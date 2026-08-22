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
  Check
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
  const [motorAssistance, setMotorAssistance] = useState<boolean>(profile.motionReduction || false);

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0E1015] text-[#1E2024] dark:text-white transition-colors font-sans">
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">
        
        {/* ═══════════════════════════════════════════════════════════
            TOP HEADER (MATCHING RIGHT SCREENSHOT)
           ═══════════════════════════════════════════════════════════ */}
        <header className="flex justify-between items-center pb-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E3A2F] text-white flex items-center justify-center font-black shadow-md">
              <Eye className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#1E2024] dark:text-white block leading-tight">
                {t('appName', 'Anukool')}
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block -mt-0.5">
                {t('digitalInclusionLayer', 'Adaptive Access Layer')}
              </span>
            </div>
          </Link>

          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            <select
              value={profile.language}
              onChange={(e) => updateProfileKey('language', e.target.value as SupportedLanguage)}
              className="appearance-none px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#18191D] text-xs font-bold text-slate-800 dark:text-white cursor-pointer focus:ring-2 focus:ring-emerald-500"
            >
              {Object.entries(LANGUAGE_NAMES).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════
            MAIN ONBOARDING CARD
           ═══════════════════════════════════════════════════════════ */}
        <main className="space-y-8">
          
          {/* Headline */}
          <div className="space-y-1 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E2024] dark:text-white">
              {t('onboardingTitle', 'How would you like to use Anukool?')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('onboardingSubtitle', "We'll adapt the experience to what works best for you.")}
            </p>
          </div>

          {/* Step 1: Language */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18191D] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-[#1E2024] dark:text-white block">
                  {t('language', 'Language')}
                </span>
                <span className="text-[11px] text-slate-500">
                  {t('selectLanguage', 'Choose your preferred language.')}
                </span>
              </div>
            </div>

            <select
              value={profile.language}
              onChange={(e) => updateProfileKey('language', e.target.value as SupportedLanguage)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
            >
              {Object.entries(LANGUAGE_NAMES).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Interaction Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Mic className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-[#1E2024] dark:text-white block">
                  {t('interactionMode', 'Interaction Mode')}
                </span>
                <span className="text-[11px] text-slate-500">
                  {t('interactionModeSub', 'How would you like to interact?')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              
              {/* Touch Card */}
              <button
                onClick={() => setInteractionMode('touch')}
                className={`p-4 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-28 ${
                  interactionMode === 'touch'
                    ? 'border-emerald-600 bg-white dark:bg-[#18191D] ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#18191D] hover:border-slate-300'
                }`}
              >
                {interactionMode === 'touch' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <Hand className="w-6 h-6 text-slate-700 dark:text-slate-200 mb-2" />
                <span className="font-bold text-xs text-[#1E2024] dark:text-white">
                  {t('touch', 'Touch')}
                </span>
              </button>

              {/* Voice Card */}
              <button
                onClick={() => setInteractionMode('voice')}
                className={`p-4 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-28 ${
                  interactionMode === 'voice'
                    ? 'border-emerald-600 bg-white dark:bg-[#18191D] ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#18191D] hover:border-slate-300'
                }`}
              >
                {interactionMode === 'voice' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <Mic className="w-6 h-6 text-slate-700 dark:text-slate-200 mb-2" />
                <span className="font-bold text-xs text-[#1E2024] dark:text-white">
                  {t('voiceOnly', 'Voice')}
                </span>
              </button>

              {/* Voice + Touch Card */}
              <button
                onClick={() => setInteractionMode('both')}
                className={`p-4 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-28 ${
                  interactionMode === 'both'
                    ? 'border-emerald-600 bg-white dark:bg-[#18191D] ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#18191D] hover:border-slate-300'
                }`}
              >
                {interactionMode === 'both' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <div className="flex items-center gap-1 mb-2">
                  <Hand className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                  <Mic className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                </div>
                <span className="font-bold text-xs text-[#1E2024] dark:text-white">
                  {t('voiceAndTouch', 'Voice + Touch')}
                </span>
              </button>

            </div>
          </div>

          {/* Step 3: Interface Style */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <LayoutGrid className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-[#1E2024] dark:text-white block">
                  {t('interfaceStyle', 'Interface Style')}
                </span>
                <span className="text-[11px] text-slate-500">
                  {t('interfaceStyleSub', 'Choose how the interface appears.')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              
              {/* Standard Card */}
              <button
                onClick={() => setInterfaceStyle('standard')}
                className={`p-4 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-28 ${
                  interfaceStyle === 'standard'
                    ? 'border-emerald-600 bg-white dark:bg-[#18191D] ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#18191D] hover:border-slate-300'
                }`}
              >
                {interfaceStyle === 'standard' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <div className="w-6 h-6 border-2 border-slate-700 dark:border-slate-200 rounded-md mb-2 flex items-center justify-center">
                  <div className="w-3 h-3 bg-slate-700 dark:bg-slate-200 rounded-xs" />
                </div>
                <span className="font-bold text-xs text-[#1E2024] dark:text-white">
                  {t('standard', 'Standard')}
                </span>
              </button>

              {/* Simplified Card */}
              <button
                onClick={() => setInterfaceStyle('simplified')}
                className={`p-4 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-28 ${
                  interfaceStyle === 'simplified'
                    ? 'border-emerald-600 bg-white dark:bg-[#18191D] ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#18191D] hover:border-slate-300'
                }`}
              >
                {interfaceStyle === 'simplified' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <div className="grid grid-cols-2 gap-1 w-6 h-6 mb-2">
                  <div className="bg-slate-700 dark:bg-slate-200 rounded-xs" />
                  <div className="bg-slate-700 dark:bg-slate-200 rounded-xs" />
                  <div className="bg-slate-700 dark:bg-slate-200 rounded-xs" />
                  <div className="bg-slate-700 dark:bg-slate-200 rounded-xs" />
                </div>
                <span className="font-bold text-xs text-[#1E2024] dark:text-white">
                  {t('simplified', 'Simplified')}
                </span>
              </button>

              {/* Large Controls Card */}
              <button
                onClick={() => setInterfaceStyle('large')}
                className={`p-4 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-center h-28 ${
                  interfaceStyle === 'large'
                    ? 'border-emerald-600 bg-white dark:bg-[#18191D] ring-2 ring-emerald-600/20 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#18191D] hover:border-slate-300'
                }`}
              >
                {interfaceStyle === 'large' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="text-xl font-bold font-serif mb-1 text-slate-700 dark:text-slate-200">Aa</span>
                <span className="font-bold text-xs text-[#1E2024] dark:text-white">
                  {t('largeControls', 'Large Controls')}
                </span>
              </button>

            </div>
          </div>

          {/* Step 4: Accessibility Support (Motor Assistance Switch) */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Accessibility className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-[#1E2024] dark:text-white block">
                  {t('accessibilitySupport', 'Accessibility Support')}
                </span>
                <span className="text-[11px] text-slate-500">
                  {t('accessibilitySupportSub', 'Additional assistance for you.')}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18191D] border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-between">
              <div>
                <span className="font-extrabold text-xs text-[#1E2024] dark:text-white block">
                  {t('motorAssistance', 'Motor Assistance')}
                </span>
                <span className="text-[11px] text-slate-500 max-w-md block pt-0.5">
                  {t('motorAssistanceSub', 'Helps with steady selection and reduced accidental actions.')}
                </span>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => setMotorAssistance(!motorAssistance)}
                className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                  motorAssistance ? 'bg-[#1E3A2F]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                    motorAssistance ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* CTA Continue */}
          <div className="pt-4 space-y-3">
            <button
              onClick={handleContinue}
              className="w-full py-3.5 rounded-2xl bg-[#1E3A2F] hover:bg-[#25493B] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <span>{t('continue', 'Continue')}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              <span>{t('preferencesAnytime', 'Your preferences can be changed anytime.')}</span>
            </div>
          </div>

        </main>

      </div>

    </div>
  );
}
