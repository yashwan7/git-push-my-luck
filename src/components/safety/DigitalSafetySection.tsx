'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  TrendingUp, 
  CheckCircle2, 
  Users,
  Award
} from 'lucide-react';
import { SafetyProgress } from '@/types/safety';
import { DEFAULT_SAFETY_PROGRESS } from '@/lib/safetyData';
import { ScamChallengeModal } from './ScamChallengeModal';
import { TrustedCircleManagerModal } from './TrustedCircleManagerModal';

interface DigitalSafetySectionProps {
  language?: string;
  className?: string;
}

export function DigitalSafetySection({
  language = 'en',
  className = ''
}: DigitalSafetySectionProps) {
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);
  const [isTrustedCircleModalOpen, setIsTrustedCircleModalOpen] = useState(false);
  const [progress, setProgress] = useState<SafetyProgress>(DEFAULT_SAFETY_PROGRESS);
  const [trustedCount, setTrustedCount] = useState<number>(2);

  useEffect(() => {
    fetchSafetyStatus();
  }, []);

  const fetchSafetyStatus = async () => {
    try {
      const [progRes, tcRes] = await Promise.all([
        fetch('/api/scam-simulation/progress'),
        fetch('/api/trusted-circle')
      ]);

      const progData = await progRes.json();
      if (progData?.progress) setProgress(progData.progress);

      const tcData = await tcRes.json();
      if (tcData?.contacts) setTrustedCount(tcData.contacts.length);
    } catch (e) {
      console.warn('Safety status fetch fallback');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1E3A2F] text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-300" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>🛡️ Your Digital Safety</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                Privacy-First
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prevent threats, practice interactive challenges, and get human advice when needed.
            </p>
          </div>
        </div>
      </div>

      {/* 2 Clean Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CARD 1: SCAM SIMULATION & TRAINING */}
        <div className="p-6 rounded-[28px] bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 dark:from-emerald-950/20 dark:via-[#1E2024] dark:to-teal-950/10 border border-emerald-200/80 dark:border-emerald-800/30 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group">
          
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1E3A2F] to-[#2E5E4A] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-black/40 border border-emerald-200/80 dark:border-emerald-800/40 text-xs font-black text-emerald-800 dark:text-emerald-300 shadow-2xs">
                <span>Score:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{progress.score}/100</span>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                Scam Safety Training
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Practice identifying real-world KYC, UPI, and delivery scams in an interactive simulator before they happen.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-emerald-100 dark:border-white/5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{progress.monthlyImprovementPercentage}% improvement this month</span>
            </div>
            <button
              onClick={() => setIsScamModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1E3A2F] hover:bg-[#2B5443] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <span>Take Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* CARD 2: TRUSTED CIRCLE */}
        <div className="p-6 rounded-[28px] bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 dark:from-blue-950/20 dark:via-[#1E2024] dark:to-indigo-950/10 border border-blue-200/80 dark:border-blue-800/30 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all group">
          
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1D4ED8] to-[#3B82F6] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6 text-blue-200" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-black/40 border border-blue-200/80 dark:border-blue-800/40 text-xs font-black text-blue-800 dark:text-blue-300 shadow-2xs">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{trustedCount}/3 Contacts</span>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Trusted Circle
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Add trusted family or friends who can give you a second opinion on suspicious payment requests when you ask.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-blue-100 dark:border-white/5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400">
              <Lock className="w-3.5 h-3.5 text-blue-500" />
              <span>Zero surveillance &bull; 100% private</span>
            </div>
            <button
              onClick={() => setIsTrustedCircleModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#2563EB] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <span>Manage Circle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Modals */}
      <ScamChallengeModal
        isOpen={isScamModalOpen}
        onClose={() => {
          setIsScamModalOpen(false);
          fetchSafetyStatus();
        }}
        language={language}
      />

      <TrustedCircleManagerModal
        isOpen={isTrustedCircleModalOpen}
        onClose={() => {
          setIsTrustedCircleModalOpen(false);
          fetchSafetyStatus();
        }}
        language={language}
      />

    </div>
  );
}
