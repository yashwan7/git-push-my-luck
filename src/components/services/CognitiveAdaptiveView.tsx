'use client';

import React, { useState } from 'react';
import { ServiceDefinition } from '@/types';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoice } from '@/context/VoiceContext';
import { getTranslation, getLocalizedService } from '@/lib/multilingualEngine';
import { simplifyText, SimplificationResult } from '@/lib/simplificationEngine';
import { TrustExplainDrawer } from '@/components/accessibility/TrustExplainDrawer';
import { 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface CognitiveAdaptiveViewProps {
  service: ServiceDefinition;
  onComplete: () => void;
}

export function CognitiveAdaptiveView({ service: rawService, onComplete }: CognitiveAdaptiveViewProps) {
  const { profile } = useAccessibility();
  const { speak } = useVoice();
  const service = getLocalizedService(profile.language, rawService);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Trust Explainability Drawer state
  const [explainResult, setExplainResult] = useState<SimplificationResult | null>(null);
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);
  const step = service.steps[currentStepIdx] || service.steps[0];

  const handleNext = () => {
    if (currentStepIdx < service.steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      const nextStep = service.steps[nextIdx];
      speak(`${t('step', 'Step')} ${nextIdx + 1}: ${nextStep.simplifiedDescription || nextStep.title}`);
    } else {
      setIsSubmitted(true);
      
      // Save application to MongoDB
      fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          serviceTitle: service.title,
          category: service.category,
          applicantAnswers: answers,
          adaptationModeUsed: 'cognitive',
          languageUsed: profile.language,
        }),
      }).catch(() => {
        // graceful offline fallback
      });

      speak(t('submittedSuccessDesc', 'Great job! ANUKOOL has completed all steps and submitted your application.'));
      setTimeout(onComplete, 2500);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleOpenExplanation = () => {
    const originalText = step.description;
    const result = simplifyText(originalText);
    setExplainResult(result);
    setIsExplainOpen(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-8 rounded-3xl bg-civic-navy text-white text-center space-y-6 max-w-xl mx-auto shadow-2xl border-4 border-civic-green">
        <CheckCircle2 className="w-20 h-20 text-civic-green mx-auto animate-bounce" />
        <div className="space-y-2">
          <h2 className="text-acc-2xl font-extrabold">
            {t('submittedSuccess', 'Application Submitted Successfully!')}
          </h2>
          <p className="text-acc-base text-slate-200">
            {t('submittedSuccessDesc', 'ANUKOOL has safely submitted your application.')}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/10 text-acc-sm font-semibold">
          {t('step', 'Step')} {service.steps.length} {t('of', 'of')} {service.steps.length} (100%)
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Step Progress Bar & Indicator */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-civic-blue text-white font-extrabold flex items-center justify-center text-acc-base">
            {step.stepNumber}
          </div>
          <div>
            <span className="text-acc-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {t('step', 'Step')} {step.stepNumber} {t('of', 'of')} {service.steps.length}
            </span>
            <div className="text-acc-xs font-semibold text-civic-blue">
              {t('focusMode', '1 Step / Screen (Focus Mode)')}
            </div>
          </div>
        </div>

        {/* Audio Prompt Button */}
        <button
          onClick={() => speak(`${step.title}. ${step.simplifiedDescription}`)}
          className="p-3 rounded-xl bg-civic-blue/10 text-civic-blue hover:bg-civic-blue/20"
          aria-label={t('readAloud', 'Read step instructions aloud')}
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Main Single-Step Decision Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-3 border-civic-blue shadow-xl space-y-6">
        
        {/* Step Question Header */}
        <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
          <h2 className="text-acc-2xl font-extrabold text-[var(--text-primary)] leading-tight">
            {step.title}
          </h2>
          <p className="text-acc-lg font-medium text-[var(--text-secondary)]">
            {step.simplifiedDescription || step.description}
          </p>

          {/* Explain This Button */}
          <button
            onClick={handleOpenExplanation}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-civic-amber/10 text-civic-amber font-bold text-acc-xs hover:bg-civic-amber/20 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('explainThis', 'Explain This (Plain Language)')}</span>
          </button>
        </div>

        {/* Input Area */}
        <div className="py-2">
          {step.fieldType === 'select' ? (
            <div className="space-y-3">
              {step.options?.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [step.stepNumber]: opt.value })}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-acc-lg transition-all ${
                    answers[step.stepNumber] === opt.value
                      ? 'bg-civic-blue text-white border-civic-blue shadow-md'
                      : 'border-[var(--border-color)] hover:border-civic-blue bg-[var(--bg-surface)] text-[var(--text-primary)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : step.fieldType === 'radio' ? (
            <div className="space-y-3">
              {step.options?.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [step.stepNumber]: opt.value })}
                  className={`w-full p-5 rounded-2xl border-2 text-left font-bold text-acc-lg transition-all ${
                    answers[step.stepNumber] === opt.value
                      ? 'bg-civic-green text-white border-civic-green shadow-md'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : step.fieldType === 'file' ? (
            <div className="p-8 rounded-2xl border-3 border-dashed border-civic-blue bg-civic-blue/5 text-center space-y-3">
              <p className="text-acc-lg font-bold text-civic-blue">
                {step.helpText}
              </p>
              <input type="file" className="block w-full text-acc-sm text-[var(--text-primary)] mx-auto cursor-pointer" />
            </div>
          ) : (
            <input
              type={step.fieldType === 'date' ? 'date' : 'text'}
              value={answers[step.stepNumber] || ''}
              onChange={(e) => setAnswers({ ...answers, [step.stepNumber]: e.target.value })}
              placeholder={step.placeholder || 'Type here...'}
              className="w-full p-5 rounded-2xl border-3 border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold text-acc-xl focus:border-civic-blue outline-none"
            />
          )}
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className={`px-5 py-3 rounded-2xl font-bold text-acc-base flex items-center gap-2 ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed text-[var(--text-secondary)]'
                : 'bg-black/5 hover:bg-black/10 text-[var(--text-primary)]'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('previous', 'Back')}</span>
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-4 rounded-2xl bg-civic-blue text-white text-acc-lg font-extrabold shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 transition-all flex items-center gap-3"
          >
            <span>
              {currentStepIdx === service.steps.length - 1
                ? t('submit', 'Submit')
                : t('next', 'Next Step')}
            </span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* AI Trust Explainability Drawer */}
      <TrustExplainDrawer
        result={explainResult}
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
      />

    </div>
  );
}
