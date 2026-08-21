'use client';

import React, { useState } from 'react';
import { ServiceDefinition } from '@/types';
import { Hand, CheckCircle2, ArrowRight, MousePointerClick } from 'lucide-react';
import { useVoice } from '@/context/VoiceContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, getLocalizedService } from '@/lib/multilingualEngine';

interface MotorAdaptiveViewProps {
  service: ServiceDefinition;
  onComplete: () => void;
}

export function MotorAdaptiveView({ service: rawService, onComplete }: MotorAdaptiveViewProps) {
  const { profile } = useAccessibility();
  const { speak } = useVoice();
  const service = getLocalizedService(profile.language, rawService);

  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [dwellProgress, setDwellProgress] = useState<number | null>(null);
  const [activeDwellId, setActiveDwellId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  // Simulated Dwell Click Handler
  const handleMouseEnterDwell = (id: string, action: () => void) => {
    setActiveDwellId(id);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDwellProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setDwellProgress(null);
        setActiveDwellId(null);
        action();
      }
    }, 100);

    (window as any)[`dwell_timer_${id}`] = interval;
  };

  const handleMouseLeaveDwell = (id: string) => {
    if ((window as any)[`dwell_timer_${id}`]) {
      clearInterval((window as any)[`dwell_timer_${id}`]);
    }
    setDwellProgress(null);
    setActiveDwellId(null);
  };

  const handleFinish = () => {
    setSubmitted(true);

    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: service.id,
        serviceTitle: service.title,
        category: service.category,
        applicantAnswers: selectedOptions,
        adaptationModeUsed: 'motor',
        languageUsed: profile.language,
      }),
    }).catch(() => {});

    speak(t('submittedSuccessDesc', 'Application completed via NAYAN Motor Assistance.'));
    setTimeout(onComplete, 2000);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-3xl bg-civic-navy text-white text-center space-y-4 max-w-xl mx-auto shadow-2xl border-4 border-civic-green">
        <CheckCircle2 className="w-20 h-20 text-civic-green mx-auto animate-bounce" />
        <h2 className="text-acc-2xl font-extrabold">{t('submittedSuccess', 'Form Submitted with Dwell Assist!')}</h2>
        <p className="text-acc-base text-slate-200">Confirmation ID: NYN-MOTOR-882</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Motor Mode Banner */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border-3 border-amber-500 text-amber-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500 text-white">
            <Hand className="w-8 h-8" />
          </div>
          <div>
            <span className="text-acc-xs font-bold uppercase tracking-wider text-amber-800">
              {t('nayanMotor', 'NAYAN Motor Accessibility & Dwell Click Layer')}
            </span>
            <h2 className="text-acc-xl font-extrabold">
              {t('optLargeTargets', 'Extra Large 68px Touch Targets & Dwell-Assist Active')}
            </h2>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-acc-xs font-semibold bg-amber-500/20 px-3 py-1.5 rounded-lg">
          <MousePointerClick className="w-4 h-4" />
          <span>Rest cursor on button for 1s to click automatically</span>
        </div>
      </div>

      {/* Simplified Single-Tap Workflow Steps */}
      <div className="space-y-6">
        {service.steps.map((step) => (
          <div 
            key={step.stepNumber}
            className="p-6 rounded-2xl bg-[var(--bg-surface)] border-3 border-[var(--border-color)] space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-acc-sm font-extrabold text-civic-blue">
                {t('step', 'Step')} {step.stepNumber} {t('of', 'of')} {service.steps.length}
              </span>
              {activeDwellId === `step-${step.stepNumber}` && (
                <span className="text-acc-xs font-bold text-amber-600 animate-pulse">
                  Dwell Clicking... {dwellProgress}%
                </span>
              )}
            </div>

            <h3 className="text-acc-xl font-bold text-[var(--text-primary)]">
              {step.title}
            </h3>
            <p className="text-acc-base text-[var(--text-secondary)]">
              {step.simplifiedDescription || step.description}
            </p>

            {/* Big Tap Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {step.options ? (
                step.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedOptions({ ...selectedOptions, [step.stepNumber]: opt.value })}
                    onMouseEnter={() => handleMouseEnterDwell(`step-${step.stepNumber}`, () => {
                      setSelectedOptions({ ...selectedOptions, [step.stepNumber]: opt.value });
                    })}
                    onMouseLeave={() => handleMouseLeaveDwell(`step-${step.stepNumber}`)}
                    className={`min-h-[72px] p-5 rounded-2xl border-3 text-left font-bold text-acc-base transition-all ${
                      selectedOptions[step.stepNumber] === opt.value
                        ? 'bg-civic-amber text-white border-civic-amber shadow-lg scale-[1.01]'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-civic-amber'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedOptions({ ...selectedOptions, [step.stepNumber]: 'filled' })}
                  onMouseEnter={() => handleMouseEnterDwell(`step-${step.stepNumber}`, () => {
                    setSelectedOptions({ ...selectedOptions, [step.stepNumber]: 'filled' });
                  })}
                  onMouseLeave={() => handleMouseLeaveDwell(`step-${step.stepNumber}`)}
                  className={`min-h-[72px] p-5 rounded-2xl border-3 text-left font-bold text-acc-base transition-all ${
                    selectedOptions[step.stepNumber]
                      ? 'bg-civic-green text-white border-civic-green'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                  }`}
                >
                  {selectedOptions[step.stepNumber] ? '✓ ' + t('confirm', 'Confirmed & Selected') : t('confirm', 'Tap to Confirm Field')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Large Bottom Submit Action */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={handleFinish}
          onMouseEnter={() => handleMouseEnterDwell('finish-btn', handleFinish)}
          onMouseLeave={() => handleMouseLeaveDwell('finish-btn')}
          className="w-full sm:w-auto px-12 py-6 rounded-3xl bg-civic-amber text-white font-extrabold text-acc-xl shadow-2xl hover:bg-amber-600 focus:ring-4 focus:ring-amber-300 transition-all flex items-center justify-center gap-4 min-h-[80px]"
        >
          <span>{t('submit', 'Submit Application')}</span>
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>

    </div>
  );
}
