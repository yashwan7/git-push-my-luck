'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { InteractiveDotGrid } from '@/components/ui/InteractiveDotGrid';
import { Sparkles, AlertCircle, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithGoogle, skipAuth, isAuthenticated, isLoading: authLoading } = useAuth();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectUrl = searchParams.get('redirect') || searchParams.get('next') || '/dashboard';
  const urlError = searchParams.get('error');

  useEffect(() => {
    if (urlError) {
      if (urlError === 'auth_callback_failed') {
        setErrorMessage('Authentication session exchange failed. Please try signing in again.');
      } else {
        setErrorMessage(urlError);
      }
    }
  }, [urlError]);

  // If already authenticated, redirect to target dashboard
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, authLoading, router, redirectUrl]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);

    try {
      const res = await signInWithGoogle(redirectUrl);
      if (res?.error) {
        setErrorMessage(res.error.message || 'We could not initiate Google sign-in. Please try again.');
        setIsSigningIn(false);
      }
    } catch (err: any) {
      setErrorMessage('We could not complete your sign-in. Please try again.');
      setIsSigningIn(false);
    }
  };

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-10 min-h-[calc(100vh-60px)] flex flex-col justify-between overflow-hidden bg-black text-white font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          ANUKOOL HERO BACKGROUND (VIDEO + SCRIM + DOT GRID)
         ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-75 scale-105 filter brightness-90"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
        />
        <div className="absolute inset-0 bg-radial from-transparent via-black/35 to-black/75 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />
      </div>

      {/* Interactive Mouse Repulsion Dot Grid Layer */}
      <InteractiveDotGrid 
        dotSize={2}
        dotSpacing={18}
        repulsionRadius={120}
        repulsionStrength={36}
        className="opacity-80"
      />

      {/* Minimal Top Brand Bar */}
      <header className="relative z-20 px-6 sm:px-12 py-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/20 text-zinc-300 text-xs font-bold transition-all backdrop-blur-md focus:ring-2 focus:ring-blue-400"
          aria-label="Back to ANUKOOL homepage"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to ANUKOOL</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Secure Supabase Google OAuth</span>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          CENTERED TRANSLUCENT GLASS AUTHENTICATION CARD
         ───────────────────────────────────────────────────────────── */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-4 py-8">
        <div 
          className="w-full max-w-[460px] p-8 sm:p-10 rounded-[32px] border text-center space-y-6 animate-in fade-in zoom-in-95 duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(20, 24, 38, 0.38) 50%, rgba(10, 14, 25, 0.52) 100%)',
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
            borderColor: 'rgba(255, 255, 255, 0.22)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.38), inset 0 0 24px rgba(255, 255, 255, 0.04)',
          }}
          role="main"
          aria-labelledby="login-heading"
        >
          
          {/* ANUKOOL "A" Logo Mark */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-civic-navy text-white flex items-center justify-center font-black text-2xl tracking-tighter border-2 border-blue-500 shadow-xl ring-4 ring-blue-500/20">
              A
            </div>
          </div>

          {/* Heading and Subtext */}
          <div className="space-y-2">
            <h1 id="login-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed max-w-sm mx-auto">
              Sign in with your Google account to access your personalized ANUKOOL accessibility profile.
            </p>
          </div>

          {/* OAuth Error Alert */}
          {errorMessage && (
            <div 
              className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-start gap-2.5 text-left animate-in fade-in"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Sign-in error</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* REAL GOOGLE OAUTH BUTTON */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn || authLoading}
              className="w-full h-14 rounded-2xl bg-white hover:bg-zinc-100 active:scale-[0.99] text-zinc-950 font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-xl disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer"
              aria-label="Continue with Google authentication"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-700" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  {/* Official Google "G" Icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* OR DIVIDER */}
            <div className="flex items-center gap-3 py-1 text-xs text-zinc-400">
              <div className="flex-1 h-px bg-white/15" />
              <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-400">or</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            {/* SKIP LOGIN & CONTINUE AS GUEST BUTTON */}
            <button
              onClick={() => {
                skipAuth();
                router.replace(redirectUrl);
              }}
              className="w-full h-13 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.99] border border-white/20 hover:border-white/35 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-400 cursor-pointer group"
            >
              <span>Skip Login &amp; Continue as Guest</span>
              <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Security & Authentication Info */}
          <div className="pt-2 border-t border-white/10 text-center">
            <p className="text-xs text-zinc-400 font-medium">
              Sign in once to save your profile across devices &bull; Or skip to explore instantly
            </p>
          </div>

          {/* Privacy & Trust reassurance */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>Universal Digital Accessibility &amp; Inclusion</span>
          </div>

        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="relative z-20 py-4 px-6 text-center text-xs text-zinc-400">
        ANUKOOL &bull; Universal Digital Accessibility & Inclusion Infrastructure
      </footer>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-10 min-h-[calc(100vh-60px)] flex flex-col justify-center items-center overflow-hidden bg-black text-white font-sans">
          <div className="w-14 h-14 rounded-2xl bg-civic-navy text-white flex items-center justify-center font-black text-2xl tracking-tighter border-2 border-blue-500 shadow-xl animate-pulse">
            A
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
