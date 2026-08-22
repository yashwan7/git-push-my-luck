import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ephemeralRequestsStore } from '@/lib/safetyData';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createServerSupabaseClient();

    // Check in-memory first
    const cached = ephemeralRequestsStore.get(id);
    if (cached) {
      const isExpired = new Date(cached.expiresAt).getTime() < Date.now();
      if (isExpired && cached.status === 'pending') {
        cached.status = 'expired';
      }
      return NextResponse.json({ request: cached });
    }

    const { data, error } = await supabase
      .from('trusted_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      const isExpired = new Date(data.expires_at).getTime() < Date.now();
      if (isExpired && data.status === 'pending') {
        data.status = 'expired';
      }
      return NextResponse.json({ request: data });
    }

    return NextResponse.json({ error: 'Request not found or expired.' }, { status: 404 });
  } catch (error: any) {
    console.error('Error fetching request:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch request.' },
      { status: 500 }
    );
  }
}
