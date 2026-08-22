'use client';

import React, { useState } from 'react';
import { simplifyText, SimplificationResult } from '@/lib/simplificationEngine';
import { TrustExplainDrawer } from '@/components/accessibility/TrustExplainDrawer';
import { useVoice } from '@/context/VoiceContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation } from '@/lib/multilingualEngine';
import { Sparkles, Volume2, ShieldCheck } from 'lucide-react';

export default function SimplifierPage() {
  const { profile } = useAccessibility();
  const { speak } = useVoice();
  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const [inputText, setInputText] = useState(
    'Applicants must submit documentary evidence validating their eligibility under Section 12(B) of the Central Educational Code. Non-compliance results in automatic forfeiture of scholarship allocations.'
  );

  const [result, setResult] = useState<SimplificationResult | null>(simplifyText(inputText));
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  const handleSimplify = () => {
    if (!inputText.trim()) return;
    const res = simplifyText(inputText);
    setResult(res);
    speak(`${t('plainLanguageResult')}: ${res.simplifiedText}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-acc-xs font-bold text-civic-amber uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>{t('simplifierBadge', 'ANUKOOL AI Semantic Simplification Engine')}</span>
        </div>
        <h1 className="text-acc-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {t('simplifierTitle', 'Bureaucratic Terminology & Plain Language Converter')}
        </h1>
        <p className="text-acc-lg text-[var(--text-secondary)]">
          {t('simplifierDesc', 'Paste complex legal, medical, or government text to generate clear plain-language instructions.')}
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-4 shadow-sm">
        <label className="block text-acc-sm font-bold text-[var(--text-primary)]">
          {t('pasteOriginalText', 'Paste Original Bureaucratic Text:')}
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          className="w-full p-4 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium text-acc-base focus:border-civic-blue outline-none"
          placeholder="Paste complex terms..."
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setInputText('Outpatient Triage Protocol: Consultation slots are contingent upon emergency department priority. Patient must arrive 30 minutes prior with clinical history dossier.')}
            className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-acc-xs font-semibold text-[var(--text-primary)]"
          >
            {t('loadMedicalSample', 'Load Medical Sample')}
          </button>

          <button
            onClick={handleSimplify}
            className="px-8 py-3 rounded-xl bg-civic-blue text-white font-extrabold text-acc-base hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>{t('simplifyButton', 'Simplify Text')}</span>
          </button>
        </div>
      </div>

      {/* Output Transformation Card */}
      {result && (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-3 border-civic-blue space-y-6 shadow-xl animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <span className="text-acc-xs font-extrabold text-civic-blue uppercase tracking-widest">
              {t('plainLanguageResult', 'ANUKOOL Plain-Language Result')}
            </span>
            <button
              onClick={() => speak(result.simplifiedText)}
              className="px-3.5 py-1.5 rounded-xl bg-civic-blue/10 text-civic-blue font-bold text-acc-xs flex items-center gap-2 hover:bg-civic-blue/20"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t('readAloud', 'Read Aloud')}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-black/5 border border-[var(--border-color)] space-y-1">
              <span className="text-acc-xs font-bold text-[var(--text-secondary)] uppercase">{t('originalComplexText', 'Original Complex Wording')}</span>
              <p className="text-acc-base italic font-serif text-[var(--text-primary)]">&ldquo;{result.originalText}&rdquo;</p>
            </div>

            <div className="p-6 rounded-2xl bg-civic-blue/10 border-2 border-civic-blue/30 space-y-2">
              <span className="text-acc-xs font-bold text-civic-blue uppercase">{t('nayanSimplifiedNotice', 'ANUKOOL Simplified Meaning')}</span>
              <h3 className="text-acc-2xl font-extrabold text-[var(--text-primary)] leading-tight">
                {result.simplifiedText}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <button
              onClick={() => setIsExplainOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-civic-amber/10 text-civic-amber font-extrabold text-acc-sm hover:bg-civic-amber/20 transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{t('whySimplified', 'Why did ANUKOOL simplify this?')}</span>
            </button>

            <span className="text-acc-xs font-bold text-civic-green">
              {t('originalMeaningPreserved', 'Meaning 100% Preserved')}
            </span>
          </div>

        </div>
      )}

      {/* Trust Explainability Drawer Modal */}
      <TrustExplainDrawer
        result={result}
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
      />

    </div>
  );
}
