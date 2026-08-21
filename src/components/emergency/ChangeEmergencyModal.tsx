'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  HeartPulse, 
  Wind, 
  Activity, 
  Brain, 
  Baby, 
  AlertTriangle, 
  ArrowRight,
  CheckCircle2,
  Mic
} from 'lucide-react';

export interface EmergencyCase {
  id: string;
  condition: string;
  query: string;
  priority: string;
  hospitalName: string;
  specialty: string;
  eta: string;
  distance: string;
  lat: number;
  lng: number;
  address: string;
  alternatives: Array<{ name: string; eta: string; distance: string; status: string }>;
}

export const EMERGENCY_PRESETS: EmergencyCase[] = [
  {
    id: 'chest-pain',
    condition: 'Severe Chest Pain / Heart Attack',
    query: 'My father has severe chest pain.',
    priority: 'HIGH PRIORITY',
    hospitalName: 'CityCare General Hospital',
    specialty: 'Emergency Department & Cath Lab Available',
    eta: '11 min',
    distance: '3.2 km',
    lat: 12.9344,
    lng: 77.6101,
    address: 'Koramangala 4th Block, Bengaluru',
    alternatives: [
      { name: "St. Mary's Medical Center", eta: '16 min', distance: '5.8 km', status: 'Limited Availability' },
      { name: 'MetroCare Hospital', eta: '22 min', distance: '8.4 km', status: 'Emergency Unavailable' },
    ],
  },
  {
    id: 'breathlessness',
    condition: 'Severe Breathlessness / Asthma / Low SpO2',
    query: 'Severe difficulty breathing and continuous wheezing.',
    priority: 'RESPIRATORY CODE RED',
    hospitalName: 'Manipal Hospital Pulmonology & ICU',
    specialty: 'Advanced Respiratory Care & Oxygen Beds Ready',
    eta: '9 min',
    distance: '2.8 km',
    lat: 12.9585,
    lng: 77.6521,
    address: 'HAL Airport Road, Bengaluru',
    alternatives: [
      { name: 'CityCare General Hospital', eta: '11 min', distance: '3.2 km', status: 'Oxygen Beds Available' },
      { name: 'Fortis Hospital Cunningham Road', eta: '16 min', distance: '5.4 km', status: 'Available' },
    ],
  },
  {
    id: 'accident',
    condition: 'Road Accident / Trauma / Fracture',
    query: 'Road traffic accident with bleeding and bone fracture.',
    priority: 'TRAUMA CODE RED',
    hospitalName: "St. John's Trauma & Orthopedic Center",
    specialty: 'Level-1 Trauma Team & Blood Bank 24x7',
    eta: '13 min',
    distance: '4.1 km',
    lat: 12.9317,
    lng: 77.6186,
    address: 'Sarjapur Main Road, John Nagar, Bengaluru',
    alternatives: [
      { name: 'Hosmat Hospital Orthopedic Wing', eta: '17 min', distance: '5.9 km', status: 'Available' },
      { name: 'Victoria Hospital Emergency', eta: '20 min', distance: '7.2 km', status: 'Trauma Unit Active' },
    ],
  },
  {
    id: 'stroke',
    condition: 'Stroke / Facial Droop / Paralysis (FAST)',
    query: 'Sudden facial drooping, arm weakness, and slurred speech.',
    priority: 'STROKE CODE RED',
    hospitalName: 'NIMHANS Neuro Emergency Unit',
    specialty: 'Comprehensive Stroke Center & Neuro-ICU',
    eta: '12 min',
    distance: '3.8 km',
    lat: 12.9388,
    lng: 77.5954,
    address: 'Hosur Road, Bengaluru',
    alternatives: [
      { name: 'CityCare General Hospital', eta: '11 min', distance: '3.2 km', status: 'CT Scanner Ready' },
      { name: 'Aster CMI Neuro Hospital', eta: '22 min', distance: '9.1 km', status: 'Available' },
    ],
  },
  {
    id: 'pediatric',
    condition: 'Child Emergency / High Convulsions',
    query: 'Toddler having high fever and sudden convulsions.',
    priority: 'PEDIATRIC CODE RED',
    hospitalName: 'Indira Gandhi Institute of Child Health',
    specialty: 'Pediatric Emergency & NICU/PICU On-Call',
    eta: '15 min',
    distance: '4.9 km',
    lat: 12.9412,
    lng: 77.5911,
    address: 'South Hospital Complex, Bengaluru',
    alternatives: [
      { name: "Rainbow Children's Hospital", eta: '16 min', distance: '5.3 km', status: 'Available' },
      { name: 'Cloudnine Pediatric Emergency', eta: '19 min', distance: '6.4 km', status: 'Available' },
    ],
  },
  {
    id: 'allergic',
    condition: 'Severe Allergic Reaction / Anaphylaxis',
    query: 'Swelling in throat, hives, and dizziness after sting.',
    priority: 'ANAPHYLAXIS URGENT',
    hospitalName: 'CityCare Urgent Care & Critical Center',
    specialty: 'Epinephrine & Intensive Resuscitation Ready',
    eta: '8 min',
    distance: '2.1 km',
    lat: 12.9421,
    lng: 77.6202,
    address: 'Koramangala 1st Block, Bengaluru',
    alternatives: [
      { name: 'Apollo Clinic Urgent Care', eta: '10 min', distance: '2.9 km', status: 'Available' },
      { name: 'Manipal Hospital', eta: '12 min', distance: '3.5 km', status: 'Available' },
    ],
  },
];

interface ChangeEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: EmergencyCase;
  onSelectCase: (selectedCase: EmergencyCase) => void;
}

export function ChangeEmergencyModal({
  isOpen,
  onClose,
  currentCase,
  onSelectCase,
}: ChangeEmergencyModalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentCase.id);
  const [customText, setCustomText] = useState<string>('');

  if (!isOpen) return null;

  const handleApply = () => {
    if (customText.trim()) {
      // Find closest matching preset or customize
      const matched = EMERGENCY_PRESETS.find(p => p.id === selectedPresetId) || EMERGENCY_PRESETS[0];
      onSelectCase({
        ...matched,
        query: customText.trim(),
      });
    } else {
      const matched = EMERGENCY_PRESETS.find(p => p.id === selectedPresetId) || EMERGENCY_PRESETS[0];
      onSelectCase(matched);
    }
    onClose();
  };

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'chest-pain': return HeartPulse;
      case 'breathlessness': return Wind;
      case 'accident': return Activity;
      case 'stroke': return Brain;
      case 'pediatric': return Baby;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl p-6 sm:p-7 rounded-[32px] bg-white dark:bg-[#232428] border border-slate-200 dark:border-white/10 text-[#1E2024] dark:text-[#EAECEF] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="change-emergency-title"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <div>
              <h2 id="change-emergency-title" className="text-lg font-black text-[#1E2024] dark:text-white">
                Update Emergency Situation
              </h2>
              <p className="text-xs text-[#8B929A] font-medium">
                Select or describe the medical condition to re-route in real-time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets List */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B929A] block">
            Common Emergency Conditions
          </span>

          <div className="grid grid-cols-1 gap-2">
            {EMERGENCY_PRESETS.map((preset) => {
              const Icon = getPresetIcon(preset.id);
              const isSelected = selectedPresetId === preset.id && !customText;

              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    setCustomText('');
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-400 dark:border-red-600 shadow-sm'
                      : 'bg-[#ECECEC]/40 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-red-500 text-white' : 'bg-white dark:bg-[#1E2024] text-red-500 shadow-xs'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-[#1E2024] dark:text-white block">
                        {preset.condition}
                      </span>
                      <span className="text-[11px] text-[#8B929A] font-medium">
                        &ldquo;{preset.query}&rdquo;
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black text-red-600 dark:text-red-400 block">
                      {preset.eta}
                    </span>
                    <span className="text-[9px] text-[#8B929A]">
                      {preset.hospitalName.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8B929A] block">
            Or Describe Custom Emergency:
          </label>
          <div className="relative">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Severe burn injury or acute abdominal pain..."
              className="w-full p-3.5 pr-10 rounded-2xl bg-[#ECECEC]/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-[#1E2024] dark:text-white outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleApply}
            className="flex-1 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply &amp; Recalculate Route</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-3.5 rounded-2xl bg-[#ECECEC] dark:bg-white/10 hover:opacity-80 text-[#1E2024] dark:text-white font-bold text-xs"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
