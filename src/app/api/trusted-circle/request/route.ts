import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TrustedRequest } from '@/types/safety';
import { ephemeralRequestsStore } from '@/lib/safetyData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      trustedContactId, 
      contactName, 
      contactRelationship, 
      reason, 
      riskLevel = 'caution',
      minimalContext = {} 
    } = body;

    if (!trustedContactId || !contactName || !reason) {
      return NextResponse.json(
        { error: 'Trusted contact ID, contact name, and reason are required.' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'guest-citizen';

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours expiry

    const newRequest: TrustedRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      trustedContactId,
      contactName,
      contactRelationship: contactRelationship || 'Trusted Person',
      reason,
      riskLevel,
      minimalContext: {
        transactionType: minimalContext.transactionType || 'Suspicious Payment Review',
        amount: minimalContext.amount,
        recipientName: minimalContext.recipientName,
        detectedWarning: minimalContext.detectedWarning || 'Unusual payment activity detected',
        actionDescription: minimalContext.actionDescription,
      },
      status: 'pending',
      createdAt: now.toISOString(),
      expiresAt,
    };

    if (user?.id) {
      try {
        const { data, error } = await supabase
          .from('trusted_requests')
          .insert({
            id: newRequest.id,
            user_id: user.id,
            trusted_contact_id: trustedContactId,
            contact_name: contactName,
            contact_relationship: contactRelationship,
            reason,
            risk_level: riskLevel,
            minimal_context: newRequest.minimalContext,
            status: 'pending',
            expires_at: expiresAt,
          })
          .select()
          .single();

        if (!error && data) {
          ephemeralRequestsStore.set(data.id, newRequest);
          return NextResponse.json({ request: data }, { status: 201 });
        }
      } catch (dbErr) {
        console.warn('Supabase request insert fallback:', dbErr);
      }
    }

    ephemeralRequestsStore.set(newRequest.id, newRequest);
    return NextResponse.json({ request: newRequest }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating trusted request:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch request.' },
      { status: 500 }
    );
  }
}
