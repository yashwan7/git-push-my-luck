'use client';

import React, { useState } from 'react';
import { ServiceDefinition } from '@/types';
import { StandardView } from './StandardView';
import { VisualAdaptiveView } from './VisualAdaptiveView';
import { CognitiveAdaptiveView } from './CognitiveAdaptiveView';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation } from '@/lib/multilingualEngine';
import { Layers, Eye, BrainCircuit, FileText } from 'lucide-react';

interface CompareSplitViewProps {
  service: ServiceDefinition;
  onComplete: () => void;
}

export function CompareSplitView({ service, onComplete }: CompareSplitViewProps) {
  const { profile } = useAccessibility();
  const [activeTab, setActiveTab] = useState<'visual' | 'cognitive'>('cognitive');

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-civic-navy text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-civic-blue">
        <div>
          <span className="text-acc-xs font-bold text-yellow-400 uppercase tracking-widest block mb-1">
            {t('signatureFeature')}
          </span>
          <h2 className="text-acc-2xl font-extrabold tracking-tight">
            {t('oneServiceFiveWays')}
          </h2>
          <p className="text-acc-sm text-slate-300 max-w-2xl mt-1">
            {t('pipelineDesc')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('cognitive')}
            className={`px-4 py-2 rounded-xl text-acc-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'cognitive' ? 'bg-civic-blue text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            {t('cognitiveMode', 'Cognitive Mode')}
          </button>
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-2 rounded-xl text-acc-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'visual' ? 'bg-civic-blue text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            {t('visualMode', 'Visual Mode')}
          </button>
        </div>
      </div>

      {/* Side-by-Side Split View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Standard Dense Bureaucratic Form */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 font-bold text-acc-xs border border-red-500/20">
            <FileText className="w-4 h-4" />
            <span>{t('standardBureaucraticForm', 'Standard Bureaucratic Form')}</span>
          </div>
          <div className="opacity-90 grayscale-[20%] hover:grayscale-0 transition-all">
            <StandardView service={service} onComplete={onComplete} />
          </div>
        </div>

        {/* Right Side: NAYAN Transformed View */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-civic-green/10 text-civic-green font-bold text-acc-xs border border-civic-green/20">
            <Layers className="w-4 h-4" />
            <span>{t('nayanAdaptiveForm', 'NAYAN Adaptive Experience')}</span>
          </div>

          <div className="bg-[var(--bg-surface)] p-2 rounded-2xl border-2 border-civic-blue shadow-lg">
            {activeTab === 'cognitive' ? (
              <CognitiveAdaptiveView service={service} onComplete={onComplete} />
            ) : (
              <VisualAdaptiveView service={service} onComplete={onComplete} />
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
