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
  Wallet, 
  Send, 
  Receipt, 
  LayoutGrid,
  Globe
} from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, LANGUAGE_NAMES } from '@/lib/multilingualEngine';
import { SupportedLanguage } from '@/types';

export default function LandingPage() {
  const router = useRouter();
  const { profile, resolvedTheme, setThemeMode, updateProfileKey } = useAccessibility();

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const handleToggleTheme = () => {
    setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-[#ECEEF1] dark:bg-[#0A0B0E] py-6 sm:py-12 px-3 sm:px-6 flex justify-center items-center font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          MAIN CANVAS CONTAINER (1:1 WITH USER'S REFERENCE IMAGE)
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1020px] bg-white dark:bg-[#13151B] rounded-[28px] sm:rounded-[32px] border border-slate-200/80 dark:border-white/10 shadow-sm p-6 sm:p-10 md:p-12 space-y-10 sm:space-y-14 transition-colors">

        {/* ═══════════════════════════════════════════════════════════
            TOP HEADER
           ═══════════════════════════════════════════════════════════ */}
        <header className="flex justify-between items-center">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center text-[#134233] dark:text-emerald-400">
              <Eye className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white block leading-tight">
                {t('appName', 'Anukool')}
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block -mt-0.5">
                {t('digitalInclusionLayer', 'Adaptive Access Layer')}
              </span>
            </div>
          </Link>

          {/* Right Controls: Theme + Language + CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Language Dropdown */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={profile.language}
                onChange={(e) => updateProfileKey('language', e.target.value as SupportedLanguage)}
                className="appearance-none bg-transparent cursor-pointer focus:outline-none pr-1"
              >
                {Object.entries(LANGUAGE_NAMES).map(([code, lang]) => (
                  <option key={code} value={code} className="bg-white dark:bg-[#13151B] text-slate-900 dark:text-white">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sun/Moon Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Toggle Appearance"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Get Started Pill */}
            <Link
              href="/onboarding"
              className="px-4.5 py-2 rounded-xl bg-[#134233] hover:bg-[#1a5542] text-white font-bold text-xs tracking-wide shadow-xs transition-all hover:scale-105"
            >
              {t('getStarted', 'Get Started')}
            </Link>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION
           ═══════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="md:col-span-7 space-y-5">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {profile.language === 'en' ? (
                  <>
                    Digital services,<br />
                    adapted to <span className="text-[#134233] dark:text-emerald-400">you.</span>
                  </>
                ) : (
                  t('landingTitleMain', 'Digital services, adapted to you.')
                )}
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md font-normal leading-relaxed pt-1">
                {t('landingSubtitle', 'Anukool adapts the way digital services look, sound and work — based on your needs, abilities and preferences.')}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link
                href="/onboarding"
                className="px-5 py-2.5 rounded-xl bg-[#134233] hover:bg-[#1a5542] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>{t('getStarted', 'Get Started')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/services"
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold text-xs shadow-2xs transition-all"
              >
                {t('learnMore', 'Learn More')}
              </Link>
            </div>

            {/* Tagline */}
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('empoweringTagline', 'Empowering independence. Preserving autonomy.')}</span>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-[360px] aspect-4/3 sm:aspect-[1.1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-slate-200/60 dark:border-white/10 bg-slate-100">
              <img
                src="/images/senior-hero.jpg"
                alt="Senior Indian citizen using smartphone with Anukool"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            SAME SERVICE. DIFFERENT EXPERIENCE. (COMPARISON SECTION)
           ═══════════════════════════════════════════════════════════ */}
        <section className="pt-4 space-y-6 text-center">
          
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {t('sameServiceDiffExp', 'Same service. Different experience.')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 sm:gap-4 items-center max-w-3xl mx-auto">
            
            {/* Left: Traditional Interface Wireframe */}
            <div className="md:col-span-5 space-y-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#181A22] border border-slate-200 dark:border-white/10 shadow-xs text-left h-[175px] flex flex-col justify-between">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-2 w-4 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>

                {/* Dashboard content blocks */}
                <div className="grid grid-cols-3 gap-1.5 py-1">
                  <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="h-1.5 w-6 bg-slate-300 dark:bg-slate-600 rounded" />
                    <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="h-1.5 w-6 bg-slate-300 dark:bg-slate-600 rounded" />
                    <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded border border-slate-100 dark:border-white/5 space-y-1">
                    <div className="h-1.5 w-6 bg-slate-300 dark:bg-slate-600 rounded" />
                    <div className="h-2 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                </div>

                {/* Complex form lines */}
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-1.5 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-1.5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>

              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block text-center">
                {t('traditionalInterface', 'Traditional Interface')}
              </span>
            </div>

            {/* Middle Arrow */}
            <div className="md:col-span-1 flex justify-center py-1">
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs">
                &rarr;
              </div>
            </div>

            {/* Right: Anukool Adapted Interface */}
            <div className="md:col-span-5 space-y-2">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#181A22] border border-slate-200 dark:border-white/10 shadow-xs h-[175px] flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2 w-full">
                  
                  {/* Card 1: Check Balance */}
                  <button
                    onClick={() => router.push('/banking')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <Wallet className="w-4 h-4 text-[#134233] dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[11px] text-slate-800 dark:text-white">
                      {t('checkBalance', 'Check Balance')}
                    </span>
                  </button>

                  {/* Card 2: Send Money */}
                  <button
                    onClick={() => router.push('/banking')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <Send className="w-4 h-4 text-[#134233] dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[11px] text-slate-800 dark:text-white">
                      {t('sendMoney', 'Send Money')}
                    </span>
                  </button>

                  {/* Card 3: Pay Bills */}
                  <button
                    onClick={() => router.push('/banking')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <Receipt className="w-4 h-4 text-[#134233] dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[11px] text-slate-800 dark:text-white">
                      {t('payBills', 'Pay Bills')}
                    </span>
                  </button>

                  {/* Card 4: Transactions */}
                  <button
                    onClick={() => router.push('/banking')}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center cursor-pointer group"
                  >
                    <LayoutGrid className="w-4 h-4 text-[#134233] dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[11px] text-slate-800 dark:text-white">
                      {t('transactions', 'Transactions')}
                    </span>
                  </button>

                </div>
              </div>

              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block text-center">
                {t('anukoolAdaptedInterface', 'Anukool Adapted Interface')}
              </span>
            </div>

          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER PILL
           ═══════════════════════════════════════════════════════════ */}
        <footer className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('privacyControl', "Privacy first. You're always in control.")}</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
