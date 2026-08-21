'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, LANGUAGE_NAMES } from '@/lib/multilingualEngine';
import { 
  SupportedLanguage, 
  InfoFormat, 
  InteractionStyle, 
  CognitiveLevel, 
  TextSize, 
  ContrastTheme 
} from '@/types';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Volume2, 
  Eye, 
  BrainCircuit, 
  Hand, 
  Sparkles
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfileKey } = useAccessibility();
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const handleFinishOnboarding = () => {
    setCompleted(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="p-8 rounded-3xl bg-civic-navy text-white shadow-2xl border-4 border-civic-green space-y-6">
          <CheckCircle2 className="w-20 h-20 text-civic-green mx-auto animate-bounce" />
          <div className="space-y-2">
            <span className="text-acc-xs font-bold text-yellow-400 uppercase tracking-widest block">
              {t('profileReady', 'Profile Ready')}
            </span>
            <h2 className="text-acc-3xl font-extrabold">{t('profileActiveTitle', 'Your NAYAN Profile is Active')}</h2>
            <p className="text-acc-lg text-slate-200">
              {t('profileActiveDesc', 'NAYAN will automatically adapt all digital services to your preferences.')}
            </p>
          </div>

          {/* Profile Summary Badge */}
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-yellow-300 font-extrabold text-acc-base">
            {profile.buttonTargetSize === 'extra-large' ? 'Large controls' : 'Standard controls'} &bull;{' '}
            {profile.interactionMode === 'voice' ? 'Voice navigation' : 'Touch navigation'} &bull;{' '}
            {LANGUAGE_NAMES[profile.language]?.nativeName || 'English'} &bull;{' '}
            {profile.informationMode === 'simplified' ? 'Simplified language' : 'Standard text'}
          </div>

          <p className="text-acc-xs text-slate-400">
            {t('redirecting', 'Redirecting to your NAYAN digital gateway...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      
      {/* Onboarding Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-acc-xs font-bold uppercase tracking-widest text-civic-blue">
            {t('accessibilitySetup', 'Accessibility Setup')} &bull; {t('step', 'Step')} {step} {t('of', 'of')} 5
          </span>
          <span className="text-acc-xs font-semibold text-[var(--text-secondary)]">
            {t('humanPreferences', 'Human-Centered Preferences')}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
          <div 
            className="h-full bg-civic-blue transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <h1 className="text-acc-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {t('howShouldNayanWork', 'How should NAYAN work for you?')}
        </h1>
        <p className="text-acc-base text-[var(--text-secondary)]">
          {t('onboardingSubtext', 'Answer a few simple questions. No technical knowledge required.')}
        </p>
      </div>

      {/* STEP 1 — Language Selection */}
      {step === 1 && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-6 shadow-md">
          <h2 className="text-acc-xl font-bold text-[var(--text-primary)]">
            {t('step', 'Step')} 1 — {t('qLanguage', 'What language do you feel most comfortable using?')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(LANGUAGE_NAMES).map(([code, lang]) => (
              <button
                key={code}
                type="button"
                onClick={() => updateProfileKey('language', code as SupportedLanguage)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  profile.language === code
                    ? 'bg-civic-blue text-white border-civic-blue shadow-lg font-bold'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-civic-blue text-[var(--text-primary)]'
                }`}
              >
                <div className="text-acc-lg font-extrabold">{lang.nativeName}</div>
                <div className="text-acc-xs opacity-80">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 — Information Preference */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-6 shadow-md">
          <h2 className="text-acc-xl font-bold text-[var(--text-primary)]">
            {t('step', 'Step')} 2 — {t('qInfo', 'How would you like to receive information?')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'read', label: t('optReadStandard', 'Read Text'), desc: t('optReadStandardDesc', 'Standard text reading'), icon: Eye },
              { id: 'hear', label: t('optReadAloud', 'Hear Audio'), desc: t('optReadAloudDesc', 'Spoken text & voice prompts'), icon: Volume2 },
              { id: 'read-hear', label: t('optLargeHighContrast', 'Read + Hear'), desc: t('optLargeHighContrastDesc', 'Simultaneous text and speech'), icon: Sparkles },
              { id: 'simplified', label: t('optSimpleWords', 'Simplified Text'), desc: t('optSimpleWordsDesc', 'Plain short plain-language sentences'), icon: BrainCircuit },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateProfileKey('informationMode', item.id as InfoFormat)}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
                  profile.informationMode === item.id
                    ? 'bg-civic-blue text-white border-civic-blue shadow-lg'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-civic-blue text-[var(--text-primary)]'
                }`}
              >
                <item.icon className="w-7 h-7 shrink-0" />
                <div>
                  <div className="font-bold text-acc-lg">{item.label}</div>
                  <div className="text-acc-xs opacity-90">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 — Interaction Style */}
      {step === 3 && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-6 shadow-md">
          <h2 className="text-acc-xl font-bold text-[var(--text-primary)]">
            {t('step', 'Step')} 3 — {t('qInteraction', 'How do you interact with your device?')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'touch', label: t('optTouch', 'Standard touch screen'), desc: t('optTouchDesc', 'Regular tap and scroll navigation'), icon: Hand },
              { id: 'large-controls', label: t('optLargeTargets', 'Large buttons with extra spacing'), desc: t('optLargeTargetsDesc', 'Extra-large touch areas'), icon: Hand },
              { id: 'voice', label: t('optVoiceCommands', 'Voice commands & speech navigation'), desc: t('optVoiceCommandsDesc', 'Speak answers and navigate hands-free'), icon: Volume2 },
              { id: 'assisted', label: t('optAssisted', 'Assisted & Switch-friendly'), desc: t('optAssistedDesc', 'Step-by-step clear prompts'), icon: Sparkles },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateProfileKey('interactionMode', item.id as InteractionStyle)}
                className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
                  profile.interactionMode === item.id
                    ? 'bg-civic-blue text-white border-civic-blue shadow-lg'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-civic-blue text-[var(--text-primary)]'
                }`}
              >
                <item.icon className="w-7 h-7 shrink-0" />
                <div>
                  <div className="font-bold text-acc-lg">{item.label}</div>
                  <div className="text-acc-xs opacity-90">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4 — Cognitive Assistance */}
      {step === 4 && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-6 shadow-md">
          <h2 className="text-acc-xl font-bold text-[var(--text-primary)]">
            {t('step', 'Step')} 4 — {t('qPace', 'How would you like complex forms organized?')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'standard', label: t('optStandardForm', 'Show everything together (Standard)'), desc: t('optStandardFormDesc', 'Traditional full-page form') },
              { id: 'step-by-step', label: t('optStepByStep', 'Show 1 step at a time (Recommended)'), desc: t('optStepByStepDesc', 'Guides you one decision at a time') },
              { id: 'max-simplified', label: t('optMaxSimplified', 'Maximum Simplified Mode'), desc: t('optMaxSimplifiedDesc', 'Single clear question per screen') },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateProfileKey('cognitiveLevel', item.id as CognitiveLevel)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  profile.cognitiveLevel === item.id
                    ? 'bg-civic-blue text-white border-civic-blue shadow-lg'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-civic-blue text-[var(--text-primary)]'
                }`}
              >
                <div className="font-bold text-acc-lg">{item.label}</div>
                <div className="text-acc-xs opacity-90 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5 — Fine-Tuned Preferences */}
      {step === 5 && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-6 shadow-md">
          <h2 className="text-acc-xl font-bold text-[var(--text-primary)]">
            {t('step', 'Step')} 5 — {t('activeProfile', 'Micro Accessibility Adjustments')}
          </h2>

          <div className="space-y-6">
            {/* Appearance Theme Selector */}
            <div>
              <label className="block text-acc-sm font-bold mb-2">Appearance Mode (Theme)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', label: '☀️ Light' },
                  { id: 'dark', label: '🌙 Dark' },
                  { id: 'system', label: '💻 System' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateProfileKey('themeMode', item.id as any)}
                    className={`py-3 rounded-xl border font-bold text-acc-xs ${
                      (profile.themeMode || 'system') === item.id ? 'bg-civic-blue text-white border-civic-blue shadow-md' : 'border-[var(--border-color)] bg-[var(--bg-surface)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Scale */}
            <div>
              <label className="block text-acc-sm font-bold mb-2">{t('textSize', 'Text Scale')}</label>
              <div className="grid grid-cols-4 gap-2">
                {(['normal', 'large', 'xlarge', 'xxlarge'] as TextSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateProfileKey('textSize', s)}
                    className={`py-3 rounded-xl border font-bold text-acc-xs ${
                      profile.textSize === s ? 'bg-civic-blue text-white border-civic-blue' : 'border-[var(--border-color)]'
                    }`}
                  >
                    {s === 'normal' ? '100%' : s === 'large' ? '125%' : s === 'xlarge' ? '150%' : '200%'}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Theme */}
            <div>
              <label className="block text-acc-sm font-bold mb-2">{t('contrast', 'Contrast & Color Theme')}</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'standard', label: 'Standard Light' },
                  { id: 'high-contrast-dark', label: 'Dark High Contrast' },
                  { id: 'high-contrast-light', label: 'Light High Contrast' },
                  { id: 'warm-paper', label: 'Warm Paper' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateProfileKey('contrastTheme', item.id as ContrastTheme)}
                    className={`p-3 rounded-xl border text-left font-bold text-acc-xs ${
                      profile.contrastTheme === item.id ? 'bg-civic-navy text-white border-civic-navy' : 'border-[var(--border-color)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Motion & Confirmations Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] cursor-pointer">
                <span className="font-bold text-acc-sm">{t('reduceMotion', 'Reduce Motion')}</span>
                <input
                  type="checkbox"
                  checked={profile.motionReduction}
                  onChange={(e) => updateProfileKey('motionReduction', e.target.checked)}
                  className="w-5 h-5 accent-civic-blue"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] cursor-pointer">
                <span className="font-bold text-acc-sm">Action Confirmation Check</span>
                <input
                  type="checkbox"
                  checked={profile.actionConfirmations}
                  onChange={(e) => updateProfileKey('actionConfirmations', e.target.checked)}
                  className="w-5 h-5 accent-civic-blue"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className={`px-6 py-3 rounded-xl font-bold text-acc-base flex items-center gap-2 ${
            step === 1 ? 'opacity-30 cursor-not-allowed text-[var(--text-secondary)]' : 'bg-black/5 hover:bg-black/10'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('previous', 'Go Back')}</span>
        </button>

        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-8 py-4 rounded-2xl bg-civic-blue text-white font-extrabold text-acc-lg shadow-lg hover:bg-blue-700 flex items-center gap-3"
          >
            <span>{t('next', 'Next Step')}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={handleFinishOnboarding}
            className="px-8 py-4 rounded-2xl bg-civic-green text-white font-extrabold text-acc-lg shadow-xl hover:bg-emerald-700 flex items-center gap-3"
          >
            <span>{t('finishSetup', 'Save & Activate Profile')}</span>
            <CheckCircle2 className="w-6 h-6" />
          </button>
        )}
      </div>

    </div>
  );
}
