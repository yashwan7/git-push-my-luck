'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation } from '@/lib/multilingualEngine';
import { InteractiveDotGrid } from '@/components/ui/InteractiveDotGrid';
import { 
  Eye, 
  BrainCircuit, 
  Hand, 
  Languages, 
  Volume2, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const { profile } = useAccessibility();
  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  useEffect(() => {
    // Animation cleanup and fallback
    const elements = document.querySelectorAll('.appear');
    elements.forEach((el) => {
      el.addEventListener('animationend', () => {
        el.classList.add('is-in');
      }, { once: true });
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const hasRunning = Array.from(elements).some((el: any) => 
          el.getAnimations && el.getAnimations().some((a: any) => a.playState === 'running' || a.playState === 'finished')
        );
        if (!hasRunning) {
          elements.forEach(el => el.classList.add('is-in'));
        }
      });
    });
  }, []);

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-10 overflow-hidden bg-black text-white font-sans">
      
      {/* Background Video & Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 scale-105 filter brightness-75"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
        />
        <div className="absolute inset-0 bg-radial from-transparent via-black/50 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black pointer-events-none" />
      </div>

      {/* Interactive Mouse Repulsion Dot Grid Layer */}
      <InteractiveDotGrid 
        dotSize={2}
        dotSpacing={18}
        repulsionRadius={100}
        repulsionStrength={32}
        className="opacity-70"
      />

      {/* Main Single-Viewport Landing Layout */}
      <div className="relative z-10 min-h-[calc(100vh-70px)] flex flex-col justify-between px-6 sm:px-12 py-8 max-w-7xl mx-auto">
        
        {/* TOP BADGE */}
        <div className="flex justify-center pt-1">
          <div 
            className="appear appear--pop inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 text-slate-200 shadow-2xl backdrop-blur-md"
            style={{ 
              background: 'linear-gradient(90deg, rgba(125,125,125,0.4) 0%, rgba(42,42,42,0.6) 52%, rgba(10,10,10,0.8) 100%)',
              animationDelay: '0.15s' 
            }}
          >
            <svg className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow fill-current" viewBox="0 0 24 24">
              <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z"></path>
            </svg>
            <span className="tracking-wide uppercase text-[10px] sm:text-[11px] font-bold text-white">
              {t('civicBadge', 'National Inclusion & Universal Accessibility Layer')}
            </span>
          </div>
        </div>

        {/* HERO COPY (Centered Bottom-Heavy) */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto my-auto space-y-4 py-4">
          
          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-medium tracking-tight text-white leading-[1.12]">
            <span className="block overflow-hidden pb-1 appear appear--mask" style={{ animationDelay: '0.3s' }}>
              Digital services were built for everyone.
            </span>
            <span 
              className="block overflow-hidden pt-0.5 appear appear--mask font-serif italic text-slate-300 text-[1.04em]" 
              style={{ 
                fontFamily: '"Instrument Serif", "Times New Roman", Times, serif',
                animationDelay: '0.5s' 
              }}
            >
              But not for everyone to use in the same way.
            </span>
          </h1>

          <p 
            className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl font-normal leading-relaxed appear appear--soft"
            style={{ animationDelay: '0.7s' }}
          >
            NAYAN adapts digital experiences around the person — not the other way around. Same service. Different experience.
          </p>

          {/* Liquid Metal & Glass Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            
            {/* Primary Solid Glass CTA */}
            <Link
              href="/login?redirect=/onboarding"
              className="appear appear--btn relative group overflow-hidden inline-flex items-center justify-center h-10 sm:h-11 px-6 rounded-lg font-bold text-slate-950 text-xs sm:text-sm transition-all duration-300 shadow-xl hover:scale-[1.02] focus:ring-4 focus:ring-blue-400"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #e7e7e7 48%, #cfcfcf 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 0 20px rgba(186,208,255,0.3)',
                animationDelay: '0.85s'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Continue with NAYAN Profile</span>
                <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </span>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"
              />
            </Link>

            {/* Frosted Ghost Glass CTA */}
            <Link
              href="/dashboard"
              className="appear appear--side relative group overflow-hidden inline-flex items-center justify-center h-10 sm:h-11 px-5 rounded-lg font-medium text-white text-xs sm:text-sm border border-white/30 backdrop-blur-xl transition-all duration-300 hover:border-white/70 hover:bg-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(0,0,0,0.5) 46%, rgba(150,170,200,0.1))',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
                animationDelay: '0.98s'
              }}
            >
              <span>Explore Services</span>
            </Link>

            <Link
              href="/audit"
              className="appear appear--side relative group overflow-hidden inline-flex items-center justify-center h-10 sm:h-11 px-5 rounded-lg font-medium text-slate-300 text-xs border border-white/20 backdrop-blur-lg hover:text-white hover:border-white/50 transition-all"
              style={{ animationDelay: '1.05s' }}
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-civic-amber" />
              <span>Audit a Service</span>
            </Link>

          </div>

        </div>

        {/* 5 MODES MINI PILLS STRIP */}
        <div className="flex flex-wrap items-center justify-center gap-2 py-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-semibold text-cyan-300">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Visual</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-semibold text-emerald-300">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Voice</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-semibold text-amber-300">
            <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
            <span>Cognitive</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-semibold text-purple-300">
            <Hand className="w-3.5 h-3.5 text-purple-400" />
            <span>Motor</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-semibold text-blue-300">
            <Languages className="w-3.5 h-3.5 text-blue-400" />
            <span>Multilingual</span>
          </div>
        </div>

        {/* RESTRAINED METRIC SECTION (PROTOTYPE METRICS) */}
        <footer className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-slate-300 text-xs sm:text-sm font-medium">
          
          {/* Metric 1 */}
          <div className="appear appear--stat flex items-center justify-center sm:justify-start gap-3.5" style={{ animationDelay: '1.12s' }}>
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>148,000+ Services Adapted <span className="text-[10px] text-zinc-500 font-mono">(Proto Data)</span></span>
          </div>

          {/* Metric 2 */}
          <div className="appear appear--stat flex items-center justify-center gap-3.5" style={{ animationDelay: '1.28s' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>5 Interaction Modes</span>
          </div>

          {/* Metric 3 */}
          <div className="appear appear--stat flex items-center justify-center sm:justify-end gap-3.5" style={{ animationDelay: '1.44s' }}>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Adaptive Friction Engine</span>
          </div>

        </footer>

      </div>

    </div>
  );
}
