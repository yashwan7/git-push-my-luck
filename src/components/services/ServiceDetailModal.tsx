'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ServiceDefinition } from '@/types';
import { 
  X, 
  Sparkles, 
  Clock, 
  Building2, 
  CheckCircle2, 
  FileText, 
  Mic, 
  Languages, 
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Stethoscope,
  CreditCard,
  GraduationCap
} from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onAskNayan: (query: string) => void;
  language?: string;
}

export function ServiceDetailModal({
  service,
  isOpen,
  onClose,
  onAskNayan,
  language = 'en',
}: ServiceDetailModalProps) {
  const router = useRouter();

  if (!isOpen || !service) return null;

  const handleStartService = () => {
    onClose();
    router.push(`/services/${service.id}`);
  };

  const handleExplain = () => {
    onAskNayan(`Explain the steps and requirements for ${service.title}`);
    onClose();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'government': return Building2;
      case 'healthcare': return Stethoscope;
      case 'banking': return CreditCard;
      case 'education': return GraduationCap;
      default: return Sparkles;
    }
  };

  const CategoryIcon = getCategoryIcon(service.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 text-[#1E2024] dark:text-[#EAECEF] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="service-detail-title"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#779AE6] uppercase tracking-wider px-3 py-1 rounded-full bg-[#779AE6]/10 border border-[#779AE6]/20 flex items-center gap-1.5">
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{service.badge || service.category}</span>
            </span>
            <span className="text-xs font-medium text-[#8B929A] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{service.estimatedTime}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Organization */}
        <div className="space-y-1">
          <h2 id="service-detail-title" className="text-2xl font-black text-[#1E2024] dark:text-white tracking-tight">
            {service.title}
          </h2>
          <p className="text-xs font-bold text-[#779AE6]">
            {service.organization}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-[#8B929A] leading-relaxed">
          {service.description}
        </p>

        {/* Accessibility Features Box */}
        <div className="p-4 rounded-2xl bg-[#ECECEC]/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2.5">
          <span className="text-xs font-bold text-[#1E2024] dark:text-white block uppercase tracking-wider">
            NAYAN Accessibility Adaptations
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs text-[#8B929A]">
            <div className="flex items-center gap-2 font-medium">
              <Mic className="w-4 h-4 text-[#779AE6]" />
              <span>Voice-guided audio prompts</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-[#F0DC9B]" />
              <span>Plain-language step breakdown</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Languages className="w-4 h-4 text-[#059669]" />
              <span>Kannada & Hindi translations</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
              <span>Motor-assisted tap targets</span>
            </div>
          </div>
        </div>

        {/* Steps Preview */}
        {service.steps && service.steps.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B929A] block">
              Guided Process ({service.steps.length} Steps)
            </span>
            <div className="space-y-2">
              {service.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-[#1E2024] border border-slate-200 dark:border-white/10 text-xs">
                  <div className="w-5 h-5 rounded-full bg-[#779AE6] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {step.stepNumber}
                  </div>
                  <div>
                    <span className="font-bold text-[#1E2024] dark:text-white block">
                      {step.simplifiedDescription || step.title}
                    </span>
                    <span className="text-[11px] text-[#8B929A]">
                      {step.helpText || step.fieldLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleStartService}
            className="flex-1 py-4 rounded-2xl bg-[#779AE6] hover:bg-[#688FE8] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Start Guided Service</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleExplain}
            className="px-5 py-4 rounded-2xl bg-[#ECECEC] dark:bg-white/10 hover:opacity-80 text-[#1E2024] dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#779AE6]" />
            <span>Ask NAYAN</span>
          </button>
        </div>

      </div>
    </div>
  );
}
