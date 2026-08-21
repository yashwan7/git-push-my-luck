'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessibility } from '@/context/AccessibilityContext';
import { PERSONA_PRESETS, MOCK_SERVICES } from '@/lib/servicesData';
import { PersonaPreset, ServiceDefinition } from '@/types';
import { getTranslation, getLocalizedPersona, getLocalizedService } from '@/lib/multilingualEngine';
import { 
  Sparkles, 
  CheckCircle2, 
  Play
} from 'lucide-react';

export default function LiveDemoPage() {
  const router = useRouter();
  const { loadPersona, profile } = useAccessibility();
  
  const [selectedPersona, setSelectedPersona] = useState<PersonaPreset>(PERSONA_PRESETS[0]);
  const [selectedService, setSelectedService] = useState<ServiceDefinition>(MOCK_SERVICES[0]);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const localizedPersonas = PERSONA_PRESETS.map(p => getLocalizedPersona(profile.language, p));
  const localizedServices = MOCK_SERVICES.map(s => getLocalizedService(profile.language, s));

  const activePersona = localizedPersonas.find(p => p.id === selectedPersona.id) || localizedPersonas[0];
  const activeService = localizedServices.find(s => s.id === selectedService.id) || localizedServices[0];

  const handleLaunchDemo = () => {
    loadPersona(selectedPersona.id);
    router.push(`/services/${selectedService.id}`);
  };

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      
      {/* Hackathon Judge Presentation Banner */}
      <div className="p-8 rounded-3xl bg-civic-navy text-white shadow-2xl border-2 border-civic-blue space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-civic-blue text-white">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <span className="text-acc-xs font-bold text-yellow-400 uppercase tracking-widest block">
              Interactive Persona Experience Matrix
            </span>
            <h1 className="text-acc-3xl font-extrabold tracking-tight">
              {t('liveDemo', 'Live Accessibility Demo Matrix')}
            </h1>
          </div>
        </div>

        <p className="text-acc-lg text-slate-200 leading-relaxed max-w-3xl">
          &ldquo;{t('tagline')}&rdquo;
        </p>
      </div>

      {/* STEP 1: CHOOSE A PERSONA */}
      <div className="space-y-4">
        <h2 className="text-acc-2xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-civic-blue text-white flex items-center justify-center text-acc-sm">1</span>
          {t('qPersonas', 'Choose a User Persona')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {localizedPersonas.map((preset) => {
            const isSelected = selectedPersona.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPersona(PERSONA_PRESETS.find(p => p.id === preset.id) || preset)}
                className={`p-6 rounded-3xl border-2 text-left transition-all space-y-3 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-civic-blue text-white border-civic-blue shadow-xl scale-[1.02]'
                    : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-civic-blue'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full font-extrabold text-acc-xs ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-civic-blue/10 text-civic-blue'
                    }`}>
                      {preset.badge}
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-yellow-300" />}
                  </div>

                  <h3 className="text-acc-xl font-extrabold leading-tight">
                    {preset.name}
                  </h3>
                  <p className="text-acc-xs opacity-90 leading-relaxed">
                    {preset.tagline}
                  </p>
                </div>

                <div className="pt-2 text-acc-xs font-semibold opacity-75">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: CHOOSE A TASK */}
      <div className="space-y-4">
        <h2 className="text-acc-2xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-civic-blue text-white flex items-center justify-center text-acc-sm">2</span>
          {t('services', 'Choose a Digital Service Task')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {localizedServices.map((srv) => {
            const isSelected = selectedService.id === srv.id;
            return (
              <button
                key={srv.id}
                type="button"
                onClick={() => setSelectedService(MOCK_SERVICES.find(s => s.id === srv.id) || srv)}
                className={`p-6 rounded-3xl border-2 text-left transition-all space-y-2 ${
                  isSelected
                    ? 'bg-civic-navy text-white border-civic-navy shadow-xl scale-[1.02]'
                    : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-civic-navy'
                }`}
              >
                <span className="text-acc-xs font-bold text-civic-blue uppercase tracking-wider block">
                  {srv.badge}
                </span>
                <h3 className="text-acc-lg font-extrabold leading-tight">
                  {srv.title}
                </h3>
                <p className="text-acc-xs text-slate-300 line-clamp-2">
                  {srv.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* LAUNCH DEMO ACTION BAR */}
      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-3 border-civic-blue shadow-2xl space-y-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-acc-xs font-bold text-civic-blue uppercase tracking-widest block">
            {t('signatureFeature', 'Ready to Launch Demonstration')}
          </span>
          <h3 className="text-acc-2xl font-extrabold text-[var(--text-primary)]">
            {activePersona.name} &rarr; {activeService.title}
          </h3>
          <p className="text-acc-sm text-[var(--text-secondary)]">
            {t('pipelineDesc', 'Clicking Launch will automatically configure the profile and display the adapted service.')}
          </p>
        </div>

        <button
          onClick={handleLaunchDemo}
          className="px-10 py-5 rounded-2xl bg-civic-green text-white text-acc-xl font-extrabold shadow-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-400 transition-all flex items-center gap-3 shrink-0"
        >
          <Play className="w-7 h-7 fill-current" />
          <span>{t('startService', 'Launch Live Transformation')}</span>
        </button>
      </div>

    </div>
  );
}
