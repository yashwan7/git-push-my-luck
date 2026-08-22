import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ephemeralRequestsStore } from '@/lib/safetyData';
import { TrustedResponseAction } from '@/types/safety';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { response, responseNote }: { response: TrustedResponseAction; responseNote?: string } = body;

    if (!response || !['looks_safe', 'dont_proceed', 'call_me'].includes(response)) {
      return NextResponse.json(
        { error: 'Valid response action (looks_safe, dont_proceed, call_me) is required.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const statusMap = {
      looks_safe: 'approved',
      dont_proceed: 'rejected',
      call_me: 'approved',
    } as const;

    const newStatus = statusMap[response] || 'approved';

    // Update in-memory cache
    const cached = ephemeralRequestsStore.get(id);
    if (cached) {
      cached.response = response;
      cached.responseNote = responseNote;
      cached.status = newStatus;
      cached.respondedAt = now;
      ephemeralRequestsStore.set(id, cached);
    }

    const supabase = createServerSupabaseClient();
    try {
      await supabase
        .from('trusted_requests')
        .update({
          response,
          response_note: responseNote,
          status: newStatus,
          responded_at: now,
        })
        .eq('id', id);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      request: cached || {
        id,
        status: newStatus,
        response,
        responseNote,
        respondedAt: now,
      }
    });
  } catch (error: any) {
    console.error('Error submitting response:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit response.' },
      { status: 500 }
    );
  }
}
