'use client';

import React, { useState } from 'react';
import { ServiceDefinition } from '@/types';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoice } from '@/context/VoiceContext';
import { getTranslation, getLocalizedService } from '@/lib/multilingualEngine';
import { Volume2, CheckCircle2, ArrowRight, Eye } from 'lucide-react';

interface VisualAdaptiveViewProps {
  service: ServiceDefinition;
  onComplete: () => void;
}

export function VisualAdaptiveView({ service: rawService, onComplete }: VisualAdaptiveViewProps) {
  const { profile } = useAccessibility();
  const { speak } = useVoice();
  const service = getLocalizedService(profile.language, rawService);

  const [formData, setFormData] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const handleSpeech = (text: string) => {
    speak(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: service.id,
        serviceTitle: service.title,
        category: service.category,
        applicantAnswers: formData,
        adaptationModeUsed: 'visual',
        languageUsed: profile.language,
      }),
    }).catch(() => {});

    speak(t('submittedSuccessDesc', 'Application submitted successfully through NAYAN Visual Adaptive Layer.'));
    setTimeout(onComplete, 2000);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl bg-civic-navy text-white text-center space-y-4 border-4 border-civic-green max-w-2xl mx-auto shadow-2xl">
        <CheckCircle2 className="w-16 h-16 text-civic-green mx-auto animate-bounce" />
        <h2 className="text-acc-2xl font-bold">
          {t('submittedSuccess', 'Application Successfully Submitted!')}
        </h2>
        <p className="text-acc-base text-slate-200">
          Confirmation Code: <span className="font-mono font-bold text-yellow-300">NYN-2026-9941</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      
      {/* Visual Adaptation Header Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border-4 border-civic-blue shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-civic-blue text-white">
              <Eye className="w-8 h-8" />
            </div>
            <div>
              <span className="text-acc-xs font-bold uppercase tracking-wider text-civic-blue">
                {t('nayanVisual', 'NAYAN Visual Accessibility Mode')}
              </span>
              <h2 className="text-acc-2xl font-extrabold text-[var(--text-primary)]">
                {service.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleSpeech(`${service.title}. ${service.description}`)}
            className="p-3 rounded-xl bg-civic-blue/10 text-civic-blue hover:bg-civic-blue/20 focus:ring-4 focus:ring-civic-blue"
            title={t('readAloud', 'Read aloud')}
            aria-label={t('readAloud', 'Read service title aloud')}
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* High Contrast Form Fields with Audio Prompt Buttons */}
      <div className="space-y-6">
        {service.steps.map((step) => {
          return (
            <div 
              key={step.stepNumber}
              className="p-6 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] hover:border-civic-blue transition-all space-y-4 shadow-sm focus-within:ring-4 focus-within:ring-civic-blue"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-civic-blue/10 text-civic-blue font-bold text-acc-xs">
                    {t('step', 'Step')} {step.stepNumber} {t('of', 'of')} {service.steps.length}
                  </span>
                  <h3 className="text-acc-xl font-bold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-acc-base font-medium text-[var(--text-secondary)]">
                    {step.simplifiedDescription || step.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSpeech(`${step.title}. ${step.helpText}`)}
                  className="p-2.5 rounded-lg bg-black/5 hover:bg-black/10 text-[var(--text-primary)] shrink-0 focus:ring-2 focus:ring-civic-blue"
                  aria-label={t('readAloud', 'Read field instructions aloud')}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Accessible Input Field */}
              <div className="pt-2">
                <label className="block text-acc-sm font-extrabold text-[var(--text-primary)] mb-2">
                  {step.fieldLabel} <span className="text-civic-red">*</span>
                </label>

                {step.fieldType === 'select' ? (
                  <select
                    value={formData[step.stepNumber] || ''}
                    onChange={(e) => setFormData({ ...formData, [step.stepNumber]: e.target.value })}
                    required
                    className="w-full p-4 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-acc-base font-semibold focus:border-civic-blue focus:ring-4 focus:ring-civic-blue outline-none"
                  >
                    <option value="">-- {t('confirm', 'Select an option')} --</option>
                    {step.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : step.fieldType === 'file' ? (
                  <div className="p-6 rounded-xl border-2 border-dashed border-[var(--border-color)] bg-black/5 text-center space-y-2">
                    <p className="text-acc-base font-bold text-[var(--text-primary)]">
                      {step.helpText}
                    </p>
                    <input type="file" className="block mx-auto text-acc-sm text-[var(--text-primary)] cursor-pointer" />
                  </div>
                ) : (
                  <input
                    type={step.fieldType === 'date' ? 'date' : 'text'}
                    value={formData[step.stepNumber] || ''}
                    onChange={(e) => setFormData({ ...formData, [step.stepNumber]: e.target.value })}
                    placeholder={step.placeholder || 'Type here...'}
                    required
                    className="w-full p-4 rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] text-acc-base font-semibold focus:border-civic-blue focus:ring-4 focus:ring-civic-blue outline-none"
                  />
                )}

                <span className="block text-acc-xs text-[var(--text-secondary)] mt-1.5 font-medium">
                  {step.helpText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Large High Contrast Submit Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-civic-blue text-white text-acc-xl font-extrabold shadow-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 transition-all flex items-center justify-center gap-3"
        >
          <span>{t('submit', 'Submit Application')}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

    </form>
  );
}
