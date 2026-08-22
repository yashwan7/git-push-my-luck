'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { runAccessibilityAudit } from '@/lib/auditEngine';
import { AuditMetrics } from '@/types';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation } from '@/lib/multilingualEngine';
import { 
  Activity, 
  Search, 
  Eye, 
  BrainCircuit, 
  Hand, 
  Sparkles 
} from 'lucide-react';

export default function AuditPage() {
  const router = useRouter();
  const { profile } = useAccessibility();
  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const [urlInput, setUrlInput] = useState('scholarships.gov.in');
  const [auditMetrics, setAuditMetrics] = useState<AuditMetrics | null>(runAccessibilityAudit('scholarships.gov.in'));
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = () => {
    if (!urlInput.trim()) return;
    setIsAuditing(true);
    
    const localResult = runAccessibilityAudit(urlInput);
    setAuditMetrics(localResult);

    fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput }),
    })
      .then(res => res.json())
      .then(data => {
        if (data?.audit) {
          setAuditMetrics(data.audit);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsAuditing(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-acc-xs font-bold text-civic-blue uppercase tracking-widest">
          <Activity className="w-4 h-4" />
          <span>{t('auditBadge', 'ANUKOOL Accessibility Intelligence & Audit Layer')}</span>
        </div>
        <h1 className="text-acc-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {t('auditTitle', 'Check Service Accessibility Index')}
        </h1>
        <p className="text-acc-lg text-[var(--text-secondary)]">
          {t('auditDesc', 'Audit any public digital service for visual friction, interaction targets, language clarity, and cognitive complexity.')}
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-4 shadow-sm">
        <label className="block text-acc-sm font-bold text-[var(--text-primary)]">
          {t('enterServiceUrl', 'Enter Digital Service URL or Name:')}
        </label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. citycare.health or scholarships.gov.in"
              className="w-full p-4 pl-12 rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold text-acc-base focus:border-civic-blue outline-none"
            />
            <Search className="w-5 h-5 text-[var(--text-secondary)] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-8 py-4 rounded-2xl bg-civic-navy text-white text-acc-base font-extrabold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {isAuditing ? (
              <span>{t('auditing', 'Auditing...')}</span>
            ) : (
              <>
                <Activity className="w-5 h-5 text-civic-amber" />
                <span>{t('runAudit', 'Run ANUKOOL Audit')}</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-acc-xs font-semibold text-[var(--text-secondary)]">
          <span>Preset Sample Audits:</span>
          <button onClick={() => { setUrlInput('scholarships.gov.in'); setAuditMetrics(runAccessibilityAudit('scholarships.gov.in')); }} className="underline text-civic-blue">scholarships.gov.in</button> &bull;
          <button onClick={() => { setUrlInput('citycare.health'); setAuditMetrics(runAccessibilityAudit('citycare.health')); }} className="underline text-civic-blue">citycare.health</button>
        </div>
      </div>

      {/* Audit Metrics Output */}
      {auditMetrics && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Main Score Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Original Score */}
            <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-red-500/30 space-y-4 shadow-md">
              <span className="text-acc-xs font-bold text-red-600 uppercase tracking-wider block">
                {t('scoreBefore', 'Original Accessibility Index')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-red-600">
                  {auditMetrics.overallScore}
                </span>
                <span className="text-acc-xl font-bold text-[var(--text-secondary)]">/ 100</span>
              </div>
              <p className="text-acc-xs text-red-700 dark:text-red-300 font-medium">
                High information density, fine print, and small touch targets detected.
              </p>
            </div>

            {/* Adapted Score */}
            <div className="p-8 rounded-3xl bg-civic-navy text-white border-2 border-civic-green space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-acc-xs font-bold text-civic-green uppercase tracking-wider block">
                  {t('scoreAfter', 'Adapted ANUKOOL Score')}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-civic-green/20 text-civic-green text-acc-xs font-bold">
                  +26 Point Boost
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-civic-green">
                  {auditMetrics.afterTransformationScore}
                </span>
                <span className="text-acc-xl font-bold text-slate-400">/ 100</span>
              </div>
              <button
                onClick={() => router.push('/services/government-scholarship')}
                className="w-full py-3 rounded-xl bg-civic-green text-white font-extrabold text-acc-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>{t('letAnukoolAdaptIt', 'Let ANUKOOL Adapt It Now')} &rarr;</span>
              </button>
            </div>

          </div>

          {/* Sub-Score Metrics Breakdown */}
          <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-6 shadow-sm">
            <h2 className="text-acc-xl font-extrabold text-[var(--text-primary)]">
              {t('overallAccessibilityScore', 'Accessibility Index Breakdown')}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              {[
                { label: t('visualMode', 'Visual'), score: auditMetrics.visualScore, icon: Eye },
                { label: t('motorMode', 'Interaction'), score: auditMetrics.interactionScore, icon: Hand },
                { label: t('multilingualMode', 'Language'), score: auditMetrics.languageScore, icon: Sparkles },
                { label: t('cognitiveMode', 'Cognitive'), score: auditMetrics.cognitiveScore, icon: BrainCircuit },
                { label: 'Navigation', score: auditMetrics.navigationScore, icon: Activity },
              ].map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-black/5 border border-[var(--border-color)] space-y-1">
                  <m.icon className="w-5 h-5 mx-auto text-civic-blue" />
                  <div className="text-acc-2xl font-extrabold text-[var(--text-primary)]">{m.score}</div>
                  <div className="text-acc-xs font-bold text-[var(--text-secondary)]">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Friction Findings */}
          <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-6 shadow-sm">
            <h2 className="text-acc-xl font-extrabold text-[var(--text-primary)]">
              {t('identifiedBarriers', 'Identified Accessibility Barriers & Auto-Fixes')} ({auditMetrics.issues.length})
            </h2>

            <div className="space-y-4">
              {auditMetrics.issues.map((issue, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-black/5 border border-[var(--border-color)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-red-500/10 text-red-700 dark:text-red-400 font-extrabold text-acc-xs uppercase">
                      {issue.severity === 'high' ? t('severityHigh', 'High Friction') : issue.severity === 'medium' ? t('severityMedium', 'Medium Friction') : t('severityLow', 'Low Friction')} &bull; {issue.category}
                    </span>
                  </div>
                  <h3 className="text-acc-base font-bold text-[var(--text-primary)]">
                    {issue.description}
                  </h3>
                  <p className="text-acc-xs font-semibold text-civic-blue">
                    ANUKOOL Recommendation: {issue.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
