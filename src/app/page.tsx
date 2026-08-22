'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Sun, 
  Moon, 
  Sparkles, 
  Wallet, 
  Send, 
  Receipt, 
  History,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { SnapToFormModal } from '@/components/documents/SnapToFormModal';
import { ExtractedDocumentData } from '@/lib/ocr/documentExtractor';

export default function LandingPage() {
  const router = useRouter();
  const { themeMode, resolvedTheme, setThemeMode } = useAccessibility();
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState<string | null>(null);

  const handleAutoFill = (data: ExtractedDocumentData) => {
    setAutoFillSuccess(`Successfully extracted ${data.fields.fullName || 'ID details'}!`);
    setTimeout(() => {
      router.push('/services');
    }, 1200);
  };

  const handleToggleTheme = () => {
    setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0E1015] text-[#1E2024] dark:text-white transition-colors">
      
      {/* ─────────────────────────────────────────────────────────────
          PAGE CONTAINER (MATCHING REFERENCE SCREENSHOT 1:1)
         ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">

        {/* ═══════════════════════════════════════════════════════════
            TOP MINIMAL NAVBAR (MATCHING REFERENCE IMAGE)
           ═══════════════════════════════════════════════════════════ */}
        <header className="flex justify-between items-center pb-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3A2F] text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#1E2024] dark:text-white block leading-tight">
                Anukool
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block -mt-0.5">
                Adaptive Access Layer
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Appearance"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <Link
              href="/onboarding"
              className="px-5 py-2 rounded-xl bg-[#1E3A2F] hover:bg-[#25493B] text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION (MATCHING SCREENSHOT WITH SENIOR IMAGE)
           ═══════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E2024] dark:text-white leading-[1.1]">
                Digital services,<br />
                adapted to <span className="text-emerald-600 dark:text-emerald-400">you.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed pt-2">
                Anukool adapts the way digital services look, sound and work — based on your needs, abilities and preferences.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/onboarding"
                className="px-6 py-3 rounded-2xl bg-[#1E3A2F] hover:bg-[#25493B] text-white font-extrabold text-sm shadow-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>

              <Link
                href="/services"
                className="px-6 py-3 rounded-2xl bg-white dark:bg-[#18191D] border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-[#1E2024] dark:text-white font-extrabold text-sm shadow-xs transition-all"
              >
                Learn More
              </Link>

              {/* Secret Weapon Button: Snap-to-Form Auto-Fill */}
              <button
                onClick={() => setIsSnapModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs shadow-xs hover:bg-emerald-100 flex items-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Snap ID to Auto-Fill (OCR)</span>
              </button>
            </div>

            {/* Tagline */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Empowering independence. Preserving autonomy.</span>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10 aspect-4/3 sm:aspect-square bg-slate-200">
              <img 
                src="/images/senior-hero.jpg" 
                alt="Senior Indian citizen using smartphone with Anukool" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 dark:bg-black/80 backdrop-blur-md border border-white/20 text-xs flex items-center justify-between">
                <span className="font-extrabold text-[#1E2024] dark:text-white">
                  Senior Citizen Adaptive Mode Active
                </span>
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            SAME SERVICE. DIFFERENT EXPERIENCE. (COMPARISON SECTION)
           ═══════════════════════════════════════════════════════════ */}
        <section className="pt-8 sm:pt-12 space-y-8 text-center">
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E2024] dark:text-white">
              Same service. Different experience.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Transforming complex multi-column interfaces into human-first intuitive actions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center max-w-4xl mx-auto">
            
            {/* Left Card: Traditional Interface */}
            <div className="md:col-span-5 p-5 rounded-3xl bg-white dark:bg-[#18191D] border border-slate-200 dark:border-white/10 shadow-sm space-y-3 text-left">
              <div className="space-y-2 opacity-50 select-none">
                <div className="h-4 w-24 bg-slate-300 rounded" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-14 bg-slate-200 rounded-xl" />
                  <div className="h-14 bg-slate-200 rounded-xl" />
                  <div className="h-14 bg-slate-200 rounded-xl" />
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="h-3 w-full bg-slate-200 rounded" />
                  <div className="h-3 w-4/5 bg-slate-200 rounded" />
                  <div className="h-3 w-3/4 bg-slate-200 rounded" />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 block text-center pt-2">
                Traditional Interface
              </span>
            </div>

            {/* Middle Transformation Arrow */}
            <div className="md:col-span-1 flex justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shadow-xs">
                &rarr;
              </div>
            </div>

            {/* Right Card: Anukool Adapted Interface */}
            <div className="md:col-span-5 p-5 rounded-3xl bg-white dark:bg-[#18191D] border-2 border-emerald-500/50 shadow-md space-y-3 text-left">
              <div className="grid grid-cols-2 gap-2.5">
                
                <button
                  onClick={() => router.push('/banking')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 hover:border-emerald-500 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <Wallet className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform mb-1" />
                  <span className="font-extrabold text-xs text-[#1E2024] dark:text-white">Check Balance</span>
                </button>

                <button
                  onClick={() => router.push('/banking')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 hover:border-emerald-500 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <Send className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform mb-1" />
                  <span className="font-extrabold text-xs text-[#1E2024] dark:text-white">Send Money</span>
                </button>

                <button
                  onClick={() => router.push('/banking')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 hover:border-emerald-500 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <Receipt className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform mb-1" />
                  <span className="font-extrabold text-xs text-[#1E2024] dark:text-white">Pay Bills</span>
                </button>

                <button
                  onClick={() => router.push('/banking')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 hover:border-emerald-500 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer"
                >
                  <History className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform mb-1" />
                  <span className="font-extrabold text-xs text-[#1E2024] dark:text-white">Transactions</span>
                </button>

              </div>

              <span className="text-xs font-bold text-[#1E3A2F] dark:text-emerald-400 block text-center pt-2">
                Anukool Adapted Interface
              </span>
            </div>

          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            PRIVACY & INCLUSION FOOTER BANNER
           ═══════════════════════════════════════════════════════════ */}
        <footer className="flex justify-center pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy first. You&apos;re always in control.</span>
          </div>
        </footer>

      </div>

      {/* Snap-to-Form Auto-Fill Modal */}
      <SnapToFormModal
        isOpen={isSnapModalOpen}
        onClose={() => setIsSnapModalOpen(false)}
        onAutoFill={handleAutoFill}
      />

    </div>
  );
}
