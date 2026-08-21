'use client';

import React from 'react';
import { Hand, ShieldCheck, Zap, Activity } from 'lucide-react';

interface SteadyTapShieldProps {
  enabled: boolean;
  stabilizationLevel?: number; // 0 to 100
  className?: string;
  language?: string;
}

export function SteadyTapShield({
  enabled,
  stabilizationLevel = 100,
  className = '',
  language = 'en',
}: SteadyTapShieldProps) {
  if (!enabled) return null;

  return (
    <div className={`p-4 rounded-2xl bg-zinc-900/90 border-2 border-emerald-500/40 shadow-lg text-white space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Hand className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-emerald-400">
                {language === 'kn' ? 'ಸ್ಟೆಡಿಟ್ಯಾಪ್ ಸಕ್ರಿಯವಾಗಿದೆ' : language === 'hi' ? 'स्टेडीटैप सक्रिय है' : 'SteadyTap™ Prototype Active'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Motor Assist ON
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              {language === 'kn' ? 'ದೊಡ್ಡ ಬಟನ್‌ಗಳು • ಆಕಸ್ಮಿಕ ಟ್ಯಾಪ್ ರಕ್ಷಣೆ' : language === 'hi' ? 'बड़े बटन • आकस्मिक स्पर्श रोकथाम' : 'Enlarged hit targets • Accidental tap dampening'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            {language === 'kn' ? 'ಸ್ಥಿರತೆ' : 'Stabilization'}
          </div>
          <div className="text-sm font-extrabold text-emerald-400">
            {stabilizationLevel}%
          </div>
        </div>
      </div>

      {/* Stabilization Visual Progress Bar */}
      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-emerald-500/20">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${stabilizationLevel}%` }}
        />
      </div>

      {/* Feature Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {[
          { label: language === 'kn' ? '68px ದೊಡ್ಡ ಬಟನ್‌ಗಳು' : '68px Hit Targets' },
          { label: language === 'kn' ? 'ಆಕಸ್ಮಿಕ ಟ್ಯಾಪ್ ಫಿಲ್ಟರ್' : 'Anti-Tremor Filter' },
          { label: language === 'kn' ? 'ಸ್ಪಷ್ಟ ದೃಢೀಕರಣ' : 'Delayed Activation' },
          { label: language === 'kn' ? 'ಶೂನ್ಯ ಸಂಕೀರ್ಣತೆ' : 'Zero Drag UI' },
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-1 text-[11px] font-semibold text-zinc-300 bg-zinc-950/60 px-2 py-1 rounded-lg border border-zinc-800">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{feat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
