'use client';

import React, { useState } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoice } from '@/context/VoiceContext';
import { getTranslation } from '@/lib/multilingualEngine';
import { 
  Phone, 
  MapPin, 
  FileText, 
  Volume2, 
  CheckCircle2, 
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function EmergencyPage() {
  const { profile } = useAccessibility();
  const { speak } = useVoice();
  const [triggeredAction, setTriggeredAction] = useState<string | null>(null);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const handleTriggerEmergency = (actionName: string, promptText: string) => {
    setTriggeredAction(actionName);
    speak(promptText);

    fetch('/api/emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: actionName,
        location: { latitude: 12.9716, longitude: 77.5946 }, // Bangalore coordinates demo
      }),
    }).catch(() => {});
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 font-bold text-acc-sm text-[var(--text-primary)]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('returnToDashboard', 'Return to Dashboard')}</span>
      </Link>

      {/* Emergency Header Banner */}
      <div className="p-8 rounded-3xl bg-civic-red text-white shadow-2xl border-4 border-red-400 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/20 text-white">
            <ShieldAlert className="w-10 h-10 animate-bounce" />
          </div>
          <div>
            <span className="text-acc-xs font-bold uppercase tracking-widest text-yellow-300 block">
              {t('emergencyBadge', 'Emergency Accessibility Layer • Instant Support')}
            </span>
            <h1 className="text-acc-3xl font-extrabold tracking-tight">
              {t('emergencyTitle', 'ANUKOOL Immediate Assistance ("I Need Help")')}
            </h1>
          </div>
        </div>

        <p className="text-acc-lg text-white/90 leading-relaxed font-medium">
          {t('emergencyDesc', 'Large touch controls, voice triggers, location sharing, and emergency dispatch.')}
        </p>
      </div>

      {/* Active Trigger Alert */}
      {triggeredAction && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500 text-amber-950 font-bold text-acc-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-amber-600 shrink-0" />
            <span>{t('actionInitiated', 'Action Initiated:')} {triggeredAction}</span>
          </div>
          <button
            onClick={() => setTriggeredAction(null)}
            className="text-acc-xs underline text-amber-800"
          >
            Clear Alert
          </button>
        </div>
      )}

      {/* Large Touch Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Call Emergency */}
        <button
          onClick={() => handleTriggerEmergency('112 Emergency Dispatch', 'Initiating emergency call dispatch sequence.')}
          className="p-8 rounded-3xl bg-civic-red text-white text-left space-y-4 hover:bg-red-700 transition-all shadow-xl min-h-[160px] flex flex-col justify-between focus:ring-4 focus:ring-red-400"
        >
          <div className="flex items-center justify-between">
            <Phone className="w-10 h-10" />
            <span className="px-3 py-1 rounded-full bg-white/20 font-bold text-acc-xs">112 / Emergency</span>
          </div>
          <div>
            <div className="text-acc-2xl font-extrabold">{t('callEmergency', 'Call Emergency Services')}</div>
            <div className="text-acc-xs opacity-90">{t('callEmergencyDesc', 'Single-tap direct 112 emergency dispatch')}</div>
          </div>
        </button>

        {/* Share Location */}
        <button
          onClick={() => handleTriggerEmergency('GPS Location Broadcast', 'Sharing your GPS coordinates with trusted emergency contacts.')}
          className="p-8 rounded-3xl bg-civic-navy text-white text-left space-y-4 hover:bg-slate-800 transition-all shadow-xl min-h-[160px] flex flex-col justify-between focus:ring-4 focus:ring-slate-400"
        >
          <div className="flex items-center justify-between">
            <MapPin className="w-10 h-10 text-civic-blue" />
            <span className="px-3 py-1 rounded-full bg-civic-blue/20 font-bold text-acc-xs">GPS Active</span>
          </div>
          <div>
            <div className="text-acc-2xl font-extrabold">{t('shareLocation', 'Share Location')}</div>
            <div className="text-acc-xs opacity-90">{t('shareLocationDesc', 'Broadcast location to emergency contacts')}</div>
          </div>
        </button>

      </div>

      {/* Accessible Medical ID Card */}
      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-civic-blue" />
            <h2 className="text-acc-xl font-extrabold text-[var(--text-primary)]">
              {t('medicalId', 'Digital Emergency Medical Card')}
            </h2>
          </div>
          <button
            onClick={() => speak("Medical ID: Ramesh Kumar. Blood Group: O Positive. Emergency Contact: 9876543210.")}
            className="p-2.5 rounded-xl bg-civic-blue/10 text-civic-blue hover:bg-civic-blue/20"
            aria-label={t('readAloud', 'Read medical ID aloud')}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-acc-base font-bold">
          <div className="p-4 rounded-2xl bg-black/5 border border-[var(--border-color)]">
            <span className="text-acc-xs font-semibold text-[var(--text-secondary)] block">Name</span>
            <span>Ramesh Kumar</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/5 border border-[var(--border-color)]">
            <span className="text-acc-xs font-semibold text-[var(--text-secondary)] block">Blood Type</span>
            <span className="text-civic-red">O Positive (O+)</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/5 border border-[var(--border-color)]">
            <span className="text-acc-xs font-semibold text-[var(--text-secondary)] block">Emergency Contact</span>
            <span>+91 98765 43210</span>
          </div>
        </div>
      </div>

    </div>
  );
}
