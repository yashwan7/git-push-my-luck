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
import { 
  Eye, 
  BrainCircuit, 
  Hand, 
  FileText, 
  ArrowLeft,
  Sparkles
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
    router.push('/services');
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] dark:bg-[#121316] text-[#1E2024] dark:text-[#EAECEF] p-2 sm:p-4 md:p-6 font-sans transition-colors">
      
      <div className="max-w-[1340px] mx-auto bg-[#ECECEC] dark:bg-[#18191D] rounded-[36px] p-4 sm:p-7 space-y-6">
        
        {/* Back Button & View Modes Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => router.push('/services')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 text-xs font-bold text-[#1E2024] dark:text-white shadow-sm hover:scale-105 transition-transform w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToServices', 'Back to Services')}</span>
          </button>

          {/* View Mode Mode Toggles Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-full bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 shadow-sm">
            <button
              onClick={() => setViewMode('cognitive')}
              className={`px-4 py-2 rounded-full font-extrabold text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'cognitive' ? 'bg-[#779AE6] text-white shadow-sm' : 'text-[#1E2024] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>{t('cognitiveMode', 'Cognitive Mode')}</span>
            </button>

            <button
              onClick={() => setViewMode('visual')}
              className={`px-4 py-2 rounded-full font-extrabold text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'visual' ? 'bg-[#779AE6] text-white shadow-sm' : 'text-[#1E2024] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('visualMode', 'Visual Mode')}</span>
            </button>

            <button
              onClick={() => setViewMode('motor')}
              className={`px-4 py-2 rounded-full font-extrabold text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'motor' ? 'bg-[#D97706] text-white shadow-sm' : 'text-[#1E2024] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>{t('motorMode', 'Motor Assist')}</span>
            </button>

            <button
              onClick={() => setViewMode('standard')}
              className={`px-4 py-2 rounded-full font-extrabold text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'standard' ? 'bg-[#232428] text-white shadow-sm' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
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

    </div>
  );
}
