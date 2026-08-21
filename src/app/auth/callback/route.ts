import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || requestUrl.searchParams.get('redirect') || '/dashboard';
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  if (error) {
    console.error('OAuth error in callback:', error, errorDescription);
    const loginUrl = new URL('/login', requestUrl.origin);
    loginUrl.searchParams.set('error', errorDescription || error);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    try {
      const supabase = createServerSupabaseClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('Failed to exchange code for session:', exchangeError);
        const loginUrl = new URL('/login', requestUrl.origin);
        loginUrl.searchParams.set('error', exchangeError.message);
        return NextResponse.redirect(loginUrl);
      }
    } catch (err: any) {
      console.error('Unexpected error in auth callback:', err);
      const loginUrl = new URL('/login', requestUrl.origin);
      loginUrl.searchParams.set('error', 'Authentication failed. Please try again.');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to requested next page or dashboard
  const redirectUrl = new URL(next, requestUrl.origin);
  return NextResponse.redirect(redirectUrl);
}
