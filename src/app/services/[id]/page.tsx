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
  Camera,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DocumentAssistModal } from '@/components/anukool/DocumentAssistModal';
import { FormFieldTarget } from '@/lib/anukool-document/types';

export default function ServiceAdaptivePage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAccessibility();
  
  const rawService = findServiceById(params?.id as string);
  const service = getLocalizedService(profile.language, rawService);

  // Active View Mode selection (default: cognitive / simplified)
  const [viewMode, setViewMode] = useState<'standard' | 'visual' | 'cognitive' | 'motor'>('cognitive');
  const [isDocumentAssistOpen, setIsDocumentAssistOpen] = useState(false);
  const [autoFilledSummary, setAutoFilledSummary] = useState<string | null>(null);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const handleComplete = () => {
    router.push('/services');
  };

  const handleAutoFillComplete = (filledData: Record<string, string>) => {
    const name = filledData.fullName || 'Verified Applicant';
    setAutoFilledSummary(`Auto-filled ${Object.keys(filledData).length} fields for ${name}`);
  };

  // Convert service steps into form targets for semantic mapping
  const formTargets: FormFieldTarget[] = service?.steps.map((step) => ({
    id: `step-${step.stepNumber}`,
    name: step.fieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    label: step.fieldLabel,
    type: step.fieldType,
    placeholder: step.placeholder,
  })) || [];

  return (
    <div className="min-h-screen bg-[#ECECEC] dark:bg-[#121316] text-[#1E2024] dark:text-[#EAECEF] p-2 sm:p-4 md:p-6 font-sans transition-colors">
      
      <div className="max-w-[1340px] mx-auto bg-[#ECECEC] dark:bg-[#18191D] rounded-[36px] p-4 sm:p-7 space-y-6">
        
        {/* Back Button, Anukool Snap-to-Form & View Modes Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/services')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 text-xs font-bold text-[#1E2024] dark:text-white shadow-sm hover:scale-105 transition-transform w-fit cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('backToServices', 'Back to Services')}</span>
            </button>

            {/* Flagship Feature: Anukool Document Snap-to-Form Intelligence */}
            <button
              onClick={() => setIsDocumentAssistOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#134233] hover:bg-[#1a5542] text-white border border-emerald-500/40 text-xs font-extrabold shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Snap Document to Auto-Fill</span>
              {autoFilledSummary ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>

          {/* View Mode Mode Toggles Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-full bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 shadow-sm">
            <button
              onClick={() => setViewMode('cognitive')}
              className={`px-4 py-2 rounded-full font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cognitive' ? 'bg-[#779AE6] text-white shadow-sm' : 'text-[#1E2024] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>{t('cognitiveMode', 'Cognitive Mode')}</span>
            </button>

            <button
              onClick={() => setViewMode('visual')}
              className={`px-4 py-2 rounded-full font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'visual' ? 'bg-[#779AE6] text-white shadow-sm' : 'text-[#1E2024] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('visualMode', 'Visual Mode')}</span>
            </button>

            <button
              onClick={() => setViewMode('motor')}
              className={`px-4 py-2 rounded-full font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'motor' ? 'bg-[#D97706] text-white shadow-sm' : 'text-[#1E2024] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>{t('motorMode', 'Motor Assist')}</span>
            </button>

            <button
              onClick={() => setViewMode('standard')}
              className={`px-4 py-2 rounded-full font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'standard' ? 'bg-[#232428] text-white shadow-sm' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('standardFormView', 'Standard')}</span>
            </button>
          </div>
        </div>

        {/* Auto-filled Banner Alert if triggered */}
        {autoFilledSummary && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{autoFilledSummary}</span>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              Anukool Adapted
            </span>
          </div>
        )}

        {/* Dynamic Multi-Modal Adaptive Views */}
        <div className="transition-all">
          {viewMode === 'standard' && (
            <StandardView service={service} onComplete={handleComplete} />
          )}

          {viewMode === 'visual' && (
            <VisualAdaptiveView service={service} onComplete={handleComplete} />
          )}

          {viewMode === 'cognitive' && (
            <CognitiveAdaptiveView service={service} onComplete={handleComplete} />
          )}

          {viewMode === 'motor' && (
            <MotorAdaptiveView service={service} onComplete={handleComplete} />
          )}
        </div>

      </div>

      {/* Flagship Document Snap-to-Form Modal */}
      <DocumentAssistModal
        isOpen={isDocumentAssistOpen}
        onClose={() => setIsDocumentAssistOpen(false)}
        targetFormTitle={service.title}
        targetFields={formTargets}
        onAutoFillComplete={handleAutoFillComplete}
      />

    </div>
  );
}
