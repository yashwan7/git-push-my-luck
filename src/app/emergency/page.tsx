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
  ArrowLeft,
  Hospital,
  Navigation,
  ExternalLink,
  Clock,
  Activity,
  HeartPulse,
  Wind,
  Brain,
  Baby,
  AlertTriangle,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import Link from 'next/link';
import { GoogleMapEmergency } from '@/components/emergency/GoogleMapEmergency';
import { 
  ChangeEmergencyModal, 
  EMERGENCY_PRESETS, 
  EmergencyCase 
} from '@/components/emergency/ChangeEmergencyModal';

export default function EmergencyPage() {
  const { profile } = useAccessibility();
  const { speak } = useVoice();
  const [triggeredAction, setTriggeredAction] = useState<string | null>(null);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<EmergencyCase>(EMERGENCY_PRESETS[0]);

  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const handleTriggerEmergency = (actionName: string, promptText: string) => {
    setTriggeredAction(actionName);
    speak(promptText);

    fetch('/api/emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: actionName,
        emergencyType: selectedCase.condition,
        nearestHospital: selectedCase.hospitalName,
        location: { latitude: selectedCase.lat, longitude: selectedCase.lng },
      }),
    }).catch(() => {});
  };

  const handleSelectCase = (newCase: EmergencyCase) => {
    setSelectedCase(newCase);
    speak(`Emergency type set to ${newCase.condition}. Nearest recommended facility is ${newCase.hospitalName}, ${newCase.distance} away.`);
  };

  const getEmergencyIcon = (id: string) => {
    switch (id) {
      case 'chest-pain': return HeartPulse;
      case 'breathlessness': return Wind;
      case 'accident': return Activity;
      case 'stroke': return Brain;
      case 'pediatric': return Baby;
      default: return AlertTriangle;
    }
  };

  const CurrentIcon = getEmergencyIcon(selectedCase.id);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 font-bold text-acc-sm text-[var(--text-primary)] transition-colors"
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
            className="text-acc-xs underline text-amber-800 cursor-pointer"
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
          className="p-8 rounded-3xl bg-civic-red text-white text-left space-y-4 hover:bg-red-700 transition-all shadow-xl min-h-[160px] flex flex-col justify-between focus:ring-4 focus:ring-red-400 cursor-pointer"
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
          className="p-8 rounded-3xl bg-civic-navy text-white text-left space-y-4 hover:bg-slate-800 transition-all shadow-xl min-h-[160px] flex flex-col justify-between focus:ring-4 focus:ring-slate-400 cursor-pointer"
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

      {/* ── 🚨 EMERGENCY TYPE SELECTOR & ACTIVE CONDITION ── */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border-2 border-red-500/30 dark:border-red-500/20 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600">
              <CurrentIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-acc-xs font-bold uppercase tracking-wider text-red-600 block">
                Selected Emergency Condition
              </span>
              <h2 className="text-acc-xl font-black text-[var(--text-primary)]">
                {selectedCase.condition}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsChangeModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-acc-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Change Emergency Type</span>
          </button>
        </div>

        {/* Quick-Select Emergency Pills */}
        <div className="space-y-2">
          <span className="text-acc-xs font-bold text-[var(--text-secondary)] block uppercase tracking-wider">
            Quick Emergency Categories:
          </span>
          <div className="flex flex-wrap gap-2">
            {EMERGENCY_PRESETS.map((preset) => {
              const Icon = getEmergencyIcon(preset.id);
              const isSelected = selectedCase.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectCase(preset)}
                  className={`px-3.5 py-2 rounded-xl text-acc-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-black/5 hover:bg-black/10 dark:bg-white/5 border-[var(--border-color)] text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{preset.condition.split('/')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 🏥 NEAREST HOSPITAL DETAILS CARD ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border-2 border-[var(--border-color)] shadow-sm space-y-6">
        
        {/* Card Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 shrink-0">
              <Hospital className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 text-acc-xs font-extrabold">
                  {selectedCase.priority}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-acc-xs font-extrabold">
                  Recommended for this Emergency
                </span>
              </div>
              <h3 className="text-acc-2xl font-black text-[var(--text-primary)] mt-1">
                {selectedCase.hospitalName}
              </h3>
              <p className="text-acc-sm font-semibold text-civic-blue mt-0.5">
                {selectedCase.specialty}
              </p>
            </div>
          </div>

          <button
            onClick={() => speak(`Nearest hospital is ${selectedCase.hospitalName}. ETA is ${selectedCase.eta}, distance ${selectedCase.distance}. ${selectedCase.specialty}`)}
            className="p-3 rounded-xl bg-civic-blue/10 text-civic-blue hover:bg-civic-blue/20 cursor-pointer transition-colors"
            title="Read Hospital Info Aloud"
            aria-label="Read Hospital Info Aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Vital Hospital Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-acc-xs font-bold">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>ESTIMATED TIME</span>
            </div>
            <span className="text-acc-2xl font-extrabold text-red-600 block mt-1">
              {selectedCase.eta}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-acc-xs font-bold">
              <Navigation className="w-4 h-4 text-emerald-500" />
              <span>DRIVING DISTANCE</span>
            </div>
            <span className="text-acc-2xl font-extrabold text-[var(--text-primary)] block mt-1">
              {selectedCase.distance}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-acc-xs font-bold">
              <PhoneCall className="w-4 h-4 text-blue-500" />
              <span>EMERGENCY HELPLINE</span>
            </div>
            <a
              href="tel:112"
              className="text-acc-lg font-extrabold text-civic-blue block mt-1 hover:underline"
            >
              112 / 108 Emergency
            </a>
          </div>
        </div>

        {/* Address & Fast Navigation Buttons */}
        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 max-w-md">
            <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-acc-xs font-bold text-[var(--text-secondary)] block">Hospital Address:</span>
              <span className="text-acc-sm font-semibold text-[var(--text-primary)]">
                {selectedCase.address}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCase.lat},${selectedCase.lng}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-acc-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate Now</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Alternative Hospitals */}
        {selectedCase.alternatives && selectedCase.alternatives.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-acc-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider block">
              Alternative Nearby Hospitals & Facilities:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedCase.alternatives.map((alt, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-between"
                >
                  <div>
                    <span className="text-acc-xs font-extrabold text-[var(--text-primary)] block">
                      {alt.name}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {alt.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-acc-xs font-bold text-red-600 block">{alt.eta}</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">{alt.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Live Interactive Hospital Route Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-acc-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>Fastest Route to {selectedCase.hospitalName}</span>
          </h2>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
            ● GPS Live
          </span>
        </div>

        <GoogleMapEmergency
          hospital={{
            name: selectedCase.hospitalName,
            lat: selectedCase.lat,
            lng: selectedCase.lng,
            address: selectedCase.address,
            eta: selectedCase.eta,
            distance: selectedCase.distance,
            isRecommended: true,
          }}
        />
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
            className="p-2.5 rounded-xl bg-civic-blue/10 text-civic-blue hover:bg-civic-blue/20 cursor-pointer"
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

      {/* Change Emergency Modal */}
      <ChangeEmergencyModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        currentCase={selectedCase}
        onSelectCase={handleSelectCase}
      />

    </div>
  );
}

