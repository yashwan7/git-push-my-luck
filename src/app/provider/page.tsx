'use client';

import React, { useState, useEffect } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation } from '@/lib/multilingualEngine';
import { 
  Building2, 
  Users, 
  Languages, 
  BrainCircuit, 
  ShieldCheck, 
  TrendingUp,
  Database
} from 'lucide-react';

export default function ProviderDashboardPage() {
  const { profile } = useAccessibility();
  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const [metrics, setMetrics] = useState({
    adaptedSessionsCount: 148290,
    averageScoreBoost: 26,
    languageBreakdown: { kn: 62280, hi: 45970, ta: 20760, te: 13340, en: 5940 } as Record<string, number>,
    totalApplications: 0,
    totalAudits: 0,
    source: 'local'
  });

  useEffect(() => {
    fetch('/api/provider/metrics')
      .then(res => res.json())
      .then(data => {
        if (data?.success && data.metrics) {
          setMetrics(prev => ({
            ...prev,
            ...data.metrics,
            source: data.source,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      
      {/* Provider Header Banner */}
      <div className="p-8 rounded-3xl bg-civic-navy text-white shadow-xl border border-civic-blue space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-civic-blue text-white">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-acc-xs font-bold text-yellow-400 uppercase tracking-widest block">
                {t('providerBadge', 'B2B Civic Platform • Service Provider Portal')}
              </span>
              <h1 className="text-acc-3xl font-extrabold tracking-tight">
                {t('providerTitle', 'National Inclusion & Accessibility Dashboard')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-civic-green font-bold text-acc-xs border border-slate-700">
              <Database className="w-3.5 h-3.5" />
              <span>DB: {metrics.source === 'mongodb' ? 'MongoDB Connected' : 'Local Fallback'}</span>
            </span>
          </div>
        </div>

        <p className="text-acc-base text-slate-200 leading-relaxed max-w-3xl">
          {t('providerDesc', 'Monitor real-time accessibility transformations across government portals, hospitals, and banking workflows.')}
        </p>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-acc-xs font-bold uppercase">{t('adaptedSessions', 'Adapted Sessions')}</span>
            <Users className="w-5 h-5 text-civic-blue" />
          </div>
          <div className="text-acc-4xl font-extrabold text-[var(--text-primary)]">
            {metrics.adaptedSessionsCount.toLocaleString()}
          </div>
          <p className="text-acc-xs text-civic-green font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24% from last month
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-acc-xs font-bold uppercase">{t('avgScoreBoost', 'Average Score Boost')}</span>
            <ShieldCheck className="w-5 h-5 text-civic-green" />
          </div>
          <div className="text-acc-4xl font-extrabold text-civic-green">+{metrics.averageScoreBoost} Points</div>
          <p className="text-acc-xs text-[var(--text-secondary)] font-medium">
            72/100 &rarr; 98/100 NAYAN Index
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-acc-xs font-bold uppercase">{t('topLanguage', 'Top Regional Language')}</span>
            <Languages className="w-5 h-5 text-civic-amber" />
          </div>
          <div className="text-acc-3xl font-extrabold text-[var(--text-primary)]">Kannada (42%)</div>
          <p className="text-acc-xs text-[var(--text-secondary)] font-medium">
            Hindi (31%), Tamil (14%)
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span className="text-acc-xs font-bold uppercase">{t('focusMode', 'Primary Mode Request')}</span>
            <BrainCircuit className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-acc-3xl font-extrabold text-[var(--text-primary)]">1-Step Focus</div>
          <p className="text-acc-xs text-[var(--text-secondary)] font-medium">
            Cognitive simplification (58%)
          </p>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Most Requested Languages Breakdown */}
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-6 shadow-sm">
          <h2 className="text-acc-xl font-extrabold text-[var(--text-primary)]">
            {t('multilingualMode', 'Language Demand Breakdown')}
          </h2>

          <div className="space-y-4">
            {[
              { lang: 'Kannada (ಕನ್ನಡ)', pct: '42%', count: `${metrics.languageBreakdown.kn?.toLocaleString() || '62,280'} sessions` },
              { lang: 'Hindi (हिन्दी)', pct: '31%', count: `${metrics.languageBreakdown.hi?.toLocaleString() || '45,970'} sessions` },
              { lang: 'Tamil (தமிழ்)', pct: '14%', count: `${metrics.languageBreakdown.ta?.toLocaleString() || '20,760'} sessions` },
              { lang: 'Telugu (తెలుగు)', pct: '9%', count: `${metrics.languageBreakdown.te?.toLocaleString() || '13,340'} sessions` },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-acc-sm font-bold text-[var(--text-primary)]">
                  <span>{item.lang}</span>
                  <span>{item.pct}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/5 overflow-hidden">
                  <div className="h-full bg-civic-blue" style={{ width: item.pct }} />
                </div>
                <span className="text-acc-xs text-[var(--text-secondary)]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Accessibility Failure Points Detected */}
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-6 shadow-sm">
          <h2 className="text-acc-xl font-extrabold text-[var(--text-primary)]">
            {t('identifiedBarriers', 'Top Un-Adapted Friction Points Detected')}
          </h2>

          <div className="space-y-4">
            {[
              { title: 'Complex Legalistic Bureaucracy', freq: '68% of government forms', recommendation: 'Automated Plain-Language Rewriting' },
              { title: 'Small Touch Targets (< 24px)', freq: '54% of mobile views', recommendation: 'Enlarged 68px Dwell Controls' },
              { title: 'Dense 15-Field Layouts', freq: '49% of portals', recommendation: '1 Question / Screen Focus Wizard' },
              { title: 'Lack of Regional Audio Prompts', freq: '72% of clinic portals', recommendation: 'Multilingual TTS Integration' },
            ].map((pt, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-black/5 border border-[var(--border-color)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-acc-base text-[var(--text-primary)]">{pt.title}</span>
                  <span className="text-acc-xs font-semibold text-red-600">{pt.freq}</span>
                </div>
                <p className="text-acc-xs text-civic-blue font-semibold">
                  Resolution: {pt.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
