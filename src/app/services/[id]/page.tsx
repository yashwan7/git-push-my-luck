'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_SERVICES, findServiceById } from '@/lib/servicesData';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, getLocalizedService } from '@/lib/multilingualEngine';
import { StandardView } from '@/components/services/StandardView';
import { VisualAdaptiveView } from '@/components/services/VisualAdaptiveView';
import { CognitiveAdaptiveView } from '@/components/services/CognitiveAdaptiveView';
import { MotorAdaptiveView } from '@/components/services/MotorAdaptiveView';
import { CompareSplitView } from '@/components/services/CompareSplitView';
import { 
  Eye, 
  BrainCircuit, 
  Hand, 
  Layers, 
  FileText, 
  ArrowLeft
} from 'lucide-react';

export default function ServiceAdaptivePage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAccessibility();
  
  const rawService = findServiceById(params?.id as string);
  const service = getLocalizedService(profile.language, rawService);

  // Active View Mode selection (default: cognitive / simplified)
  const [viewMode, setViewMode] = useState<'standard' | 'visual' | 'cognitive' | 'motor'>('cognitive');

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const handleComplete = () => {
    router.push('/dashboard');
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/5 hover:bg-black/10 text-acc-sm font-bold text-[var(--text-primary)] w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToServices', 'Back to Services')}</span>
        </button>

        {/* View Mode Mode Toggles Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] shadow-sm">
          <button
            onClick={() => setViewMode('cognitive')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-acc-xs transition-all flex items-center gap-1.5 ${
              viewMode === 'cognitive' ? 'bg-civic-blue text-white shadow-md' : 'text-[var(--text-primary)] hover:bg-black/5'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{t('cognitiveMode', 'Cognitive Mode')}</span>
          </button>

          <button
            onClick={() => setViewMode('visual')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-acc-xs transition-all flex items-center gap-1.5 ${
              viewMode === 'visual' ? 'bg-civic-blue text-white shadow-md' : 'text-[var(--text-primary)] hover:bg-black/5'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{t('visualMode', 'Visual Mode')}</span>
          </button>

          <button
            onClick={() => setViewMode('motor')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-acc-xs transition-all flex items-center gap-1.5 ${
              viewMode === 'motor' ? 'bg-civic-amber text-white shadow-md' : 'text-[var(--text-primary)] hover:bg-black/5'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>{t('motorMode', 'Motor Assist')}</span>
          </button>

          <button
            onClick={() => setViewMode('standard')}
            className={`px-3.5 py-1.5 rounded-xl font-extrabold text-acc-xs transition-all flex items-center gap-1.5 ${
              viewMode === 'standard' ? 'bg-slate-700 text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-black/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('standardFormView', 'Standard')}</span>
          </button>
        </div>
      </div>

      {/* Render Active View Component */}
      <div className="animate-in fade-in duration-200">
        {viewMode === 'cognitive' && (
          <CognitiveAdaptiveView service={service} onComplete={handleComplete} />
        )}
        {viewMode === 'visual' && (
          <VisualAdaptiveView service={service} onComplete={handleComplete} />
        )}
        {viewMode === 'motor' && (
          <MotorAdaptiveView service={service} onComplete={handleComplete} />
        )}
        {viewMode === 'standard' && (
          <StandardView service={service} onComplete={handleComplete} />
        )}
      </div>

    </div>
  );
}
