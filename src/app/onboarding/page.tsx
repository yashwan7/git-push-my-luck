'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  Globe, 
  Mic, 
  Hand, 
  LayoutGrid, 
  Accessibility, 
  ArrowRight, 
  Lock, 
  Check,
  Monitor,
  ChevronDown
} from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { LANGUAGE_NAMES, getTranslation } from '@/lib/multilingualEngine';
import { SupportedLanguage } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfileKey } = useAccessibility();

  // Local state aligned with screenshot
  const [interactionMode, setInteractionMode] = useState<'touch' | 'voice' | 'both'>('touch');
  const [interfaceStyle, setInterfaceStyle] = useState<'standard' | 'simplified' | 'large'>('simplified');
  const [motorAssistance, setMotorAssistance] = useState<boolean>(true);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const handleContinue = () => {
    updateProfileKey('motionReduction', motorAssistance);
    
    if (interfaceStyle === 'simplified') {
      updateProfileKey('cognitiveLevel', 'step-by-step');
    } else if (interfaceStyle === 'large') {
      updateProfileKey('textSize', 'large');
    } else {
      updateProfileKey('cognitiveLevel', 'standard');
      updateProfileKey('textSize', 'normal');
    }

    router.push('/services');
  };

  return (
    <div className="min-h-screen bg-[#ECEEF1] dark:bg-[#0A0B0E] py-6 sm:py-12 px-3 sm:px-6 flex justify-center items-center font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          MAIN CANVAS CONTAINER (1:1 WITH RIGHT SCREENSHOT)
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1020px] bg-white dark:bg-[#13151B] rounded-[28px] sm:rounded-[32px] border border-slate-200/80 dark:border-white/10 shadow-sm p-6 sm:p-10 md:p-12 space-y-8 sm:space-y-10 transition-colors">
        
        {/* ═══════════════════════════════════════════════════════════
            TOP HEADER
           ═══════════════════════════════════════════════════════════ */}
        <header className="flex justify-between items-center pb-2">
          <Link href="/" className="flex items-center gap-3">
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

          {/* Top Right Language Dropdown Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
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
            <ChevronDown className="w-3 h-3 text-slate-400 -ml-1 pointer-events-none" />
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════
            MAIN FORM STEPS
           ═══════════════════════════════════════════════════════════ */}
        <main className="space-y-7">
          
          {/* Headline */}
          <div className="space-y-1 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('onboardingTitle', 'How would you like to use Anukool?')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('onboardingSubtitle', "We'll adapt the experience to what works best for you.")}
            </p>
          </div>

          {/* Step 1: Language Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-[#134233] dark:text-emerald-400 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                  {t('language', 'Language')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('selectLanguage', 'Choose your preferred language.')}
                </span>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="relative">
                <select
                  value={profile.language}
                  onChange={(e) => updateProfileKey('language', e.target.value as SupportedLanguage)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A22] text-xs font-semibold text-slate-800 dark:text-white cursor-pointer appearance-none shadow-2xs focus:ring-1 focus:ring-emerald-500"
                >
                  {Object.entries(LANGUAGE_NAMES).map(([code, lang]) => (
                    <option key={code} value={code}>
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Step 2: Interaction Mode Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-[#134233] dark:text-emerald-400 shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                  {t('interactionMode', 'Interaction Mode')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('interactionModeSub', 'How would you like to interact?')}
                </span>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-3 gap-2.5">
              
              {/* Touch */}
              <button
                onClick={() => setInteractionMode('touch')}
                className={`p-3 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-24 cursor-pointer ${
                  interactionMode === 'touch'
                    ? 'border-[#134233] dark:border-emerald-500 bg-white dark:bg-[#181A22] shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A22] hover:border-slate-300'
                }`}
              >
                {interactionMode === 'touch' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#134233] dark:bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <Hand className="w-5 h-5 text-slate-700 dark:text-slate-200 mb-1.5" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {t('touch', 'Touch')}
                </span>
              </button>

              {/* Voice */}
              <button
                onClick={() => setInteractionMode('voice')}
                className={`p-3 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-24 cursor-pointer ${
                  interactionMode === 'voice'
                    ? 'border-[#134233] dark:border-emerald-500 bg-white dark:bg-[#181A22] shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A22] hover:border-slate-300'
                }`}
              >
                {interactionMode === 'voice' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#134233] dark:bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <Mic className="w-5 h-5 text-slate-700 dark:text-slate-200 mb-1.5" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {t('voiceOnly', 'Voice')}
                </span>
              </button>

              {/* Voice + Touch */}
              <button
                onClick={() => setInteractionMode('both')}
                className={`p-3 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-24 cursor-pointer ${
                  interactionMode === 'both'
                    ? 'border-[#134233] dark:border-emerald-500 bg-white dark:bg-[#181A22] shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A22] hover:border-slate-300'
                }`}
              >
                {interactionMode === 'both' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#134233] dark:bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="flex items-center gap-1 mb-1.5">
                  <Hand className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                  <Mic className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                </div>
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {t('voiceAndTouch', 'Voice + Touch')}
                </span>
              </button>

            </div>
          </div>

          {/* Step 3: Interface Style Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-[#134233] dark:text-emerald-400 shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                  {t('interfaceStyle', 'Interface Style')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('interfaceStyleSub', 'Choose how the interface appears.')}
                </span>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-3 gap-2.5">
              
              {/* Standard */}
              <button
                onClick={() => setInterfaceStyle('standard')}
                className={`p-3 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-24 cursor-pointer ${
                  interfaceStyle === 'standard'
                    ? 'border-[#134233] dark:border-emerald-500 bg-white dark:bg-[#181A22] shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A22] hover:border-slate-300'
                }`}
              >
                {interfaceStyle === 'standard' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#134233] dark:bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="w-5 h-5 border-2 border-slate-700 dark:border-slate-200 rounded-sm mb-1.5 flex items-center justify-center">
                  <div className="w-2.5 h-2 bg-slate-700 dark:bg-slate-200 rounded-2xs" />
                </div>
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {t('standard', 'Standard')}
                </span>
              </button>

              {/* Simplified */}
              <button
                onClick={() => setInterfaceStyle('simplified')}
                className={`p-3 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-24 cursor-pointer ${
                  interfaceStyle === 'simplified'
                    ? 'border-[#134233] dark:border-emerald-500 bg-white dark:bg-[#181A22] shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A22] hover:border-slate-300'
                }`}
              >
                {interfaceStyle === 'simplified' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#134233] dark:bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="grid grid-cols-2 gap-1 w-5 h-5 mb-1.5">
                  <div className="bg-slate-700 dark:bg-slate-200 rounded-2xs" />
                  <div className="bg-slate-700 dark:bg-slate-200 rounded-2xs" />
                  <div className="bg-slate-700 dark:bg-slate-200 rounded-2xs" />
                  <div className="bg-slate-700 dark:bg-slate-200 rounded-2xs" />
                </div>
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {t('simplified', 'Simplified')}
                </span>
              </button>

              {/* Large Controls */}
              <button
                onClick={() => setInterfaceStyle('large')}
                className={`p-3 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-24 cursor-pointer ${
                  interfaceStyle === 'large'
                    ? 'border-[#134233] dark:border-emerald-500 bg-white dark:bg-[#181A22] shadow-xs'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A22] hover:border-slate-300'
                }`}
              >
                {interfaceStyle === 'large' && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#134233] dark:bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <span className="text-lg font-bold font-serif mb-0.5 text-slate-700 dark:text-slate-200">Aa</span>
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {t('largeControls', 'Large Controls')}
                </span>
              </button>

            </div>
          </div>

          {/* Step 4: Accessibility Support Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-[#134233] dark:text-emerald-400 shrink-0">
                <Accessibility className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                  {t('accessibilitySupport', 'Accessibility Support')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('accessibilitySupportSub', 'Additional assistance for you.')}
                </span>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#181A22] border border-slate-200 dark:border-white/10 shadow-2xs flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    {t('motorAssistance', 'Motor Assistance')}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block pt-0.5">
                    {t('motorAssistanceSub', 'Helps with steady selection and reduced accidental actions.')}
                  </span>
                </div>

                {/* Toggle Switch (Green when ON) */}
                <button
                  onClick={() => setMotorAssistance(!motorAssistance)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer shrink-0 ${
                    motorAssistance ? 'bg-[#134233] dark:bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                      motorAssistance ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* CTA Continue */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleContinue}
              className="w-full py-3.5 rounded-xl bg-[#134233] hover:bg-[#1a5542] text-white font-bold text-xs tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.005]"
            >
              <span>{t('continue', 'Continue')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>{t('preferencesAnytime', 'Your preferences can be changed anytime.')}</span>
            </div>
          </div>

        </main>

      </div>

    </div>
  );
}
