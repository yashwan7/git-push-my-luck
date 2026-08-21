'use client';

import React from 'react';
import { SimplificationResult } from '@/lib/simplificationEngine';
import { ShieldCheck, HelpCircle, X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TrustExplainDrawerProps {
  result: SimplificationResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TrustExplainDrawer({ result, isOpen, onClose }: TrustExplainDrawerProps) {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-2xl border-2 border-civic-blue max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        role="dialog"
        aria-labelledby="trust-drawer-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-civic-blue/10 text-civic-blue">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 id="trust-drawer-title" className="text-acc-lg font-bold">
                Why NAYAN Adapted This Information
              </h2>
              <p className="text-acc-xs text-[var(--text-secondary)]">
                Trust & AI Explainability Layer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-black/5"
            aria-label="Close explanation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-6">
          
          {/* Preserved Meaning Badge */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-civic-green shrink-0" />
            <div>
              <span className="font-bold text-acc-sm text-civic-green block">
                Original Intent & Legal Meaning 100% Preserved
              </span>
              <span className="text-acc-xs text-slate-600 dark:text-slate-300">
                NAYAN simplifies sentence structure without altering rights or requirements.
              </span>
            </div>
          </div>

          {/* Original vs Adapted Phrasing */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-black/5 border border-[var(--border-color)]">
              <span className="text-acc-xs font-bold text-[var(--text-secondary)] block mb-1 uppercase tracking-wider">
                Original Bureaucratic Wording
              </span>
              <p className="text-acc-sm italic font-serif text-[var(--text-primary)]">
                &ldquo;{result.originalText}&rdquo;
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-acc-xs bg-red-500/10 text-red-700 font-medium">
                Reading Level: {result.readingGradeOriginal}
              </span>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-civic-blue rotate-90 sm:rotate-0" />
            </div>

            <div className="p-3.5 rounded-xl bg-civic-blue/10 border border-civic-blue/30">
              <span className="text-acc-xs font-bold text-civic-blue block mb-1 uppercase tracking-wider">
                NAYAN Simplified Phrasing
              </span>
              <p className="text-acc-base font-bold text-[var(--text-primary)]">
                &ldquo;{result.simplifiedText}&rdquo;
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-acc-xs bg-civic-green/10 text-civic-green font-medium">
                Reading Level: {result.readingGradeSimplified}
              </span>
            </div>
          </div>

          {/* Transformations & Bullet Points */}
          <div>
            <h3 className="text-acc-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Transformations Executed
            </h3>
            <ul className="space-y-1.5 text-acc-xs font-medium">
              {result.bulletPoints?.map((pt, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-civic-blue shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Button */}
        <div className="pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-civic-navy text-white text-acc-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Got it &mdash; Return to Service
          </button>
        </div>

      </div>
    </div>
  );
}
