'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Award, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Play, 
  ArrowRight,
  Shield,
  HelpCircle,
  PhoneCall,
  UserPlus
} from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { ScamChallengeModal } from '@/components/safety/ScamChallengeModal';
import { TrustedCircleManagerModal } from '@/components/safety/TrustedCircleManagerModal';
import { SCAM_SCENARIOS, DEFAULT_SAFETY_PROGRESS } from '@/lib/safetyData';
import { ScamCategory, SafetyProgress } from '@/types/safety';

export default function SafetyHubPage() {
  const { profile } = useAccessibility();
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);
  const [isTrustedCircleModalOpen, setIsTrustedCircleModalOpen] = useState(false);
  const [selectedCategoryForChallenge, setSelectedCategoryForChallenge] = useState<ScamCategory | undefined>(undefined);
  const [progress, setProgress] = useState<SafetyProgress>(DEFAULT_SAFETY_PROGRESS);
  const [trustedContactsCount, setTrustedContactsCount] = useState(2);

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
      if (tcData?.contacts) setTrustedContactsCount(tcData.contacts.length);
    } catch (e) {}
  };

  const startChallenge = (cat?: ScamCategory) => {
    setSelectedCategoryForChallenge(cat);
    setIsScamModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121316] text-[#1E2024] dark:text-white p-3 sm:p-6 lg:p-8 font-sans pb-24 lg:pb-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#1E2024] border border-slate-200 dark:border-white/10 text-xs font-bold shadow-2xs hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Services</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-xs font-black text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Nayan Privacy-First Safety Intelligence</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-gradient-to-br from-[#1E3A2F] via-[#244739] to-[#122820] text-white shadow-xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-black uppercase tracking-wider border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PREVENT &bull; EDUCATE &bull; ESCALATE</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Safety Intelligence &amp; Human Trust Hub
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
              «Nayan protects you, teaches you through realistic simulations, and lets you ask people you trust for a second opinion only when you need it.»
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15 relative z-10">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-[11px] text-emerald-200 block font-semibold">Scam Safety Score</span>
              <span className="text-2xl font-black text-white">{progress.score} / 100</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-[11px] text-emerald-200 block font-semibold">Scenarios Practiced</span>
              <span className="text-2xl font-black text-white">{progress.totalAttempts} Challenges</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-[11px] text-emerald-200 block font-semibold">Trusted Circle</span>
              <span className="text-2xl font-black text-white">{trustedContactsCount} / 3 Contacts</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md">
              <span className="text-[11px] text-emerald-200 block font-semibold">Privacy Model</span>
              <span className="text-sm sm:text-base font-black text-emerald-300">0% Surveillance</span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            FEATURE 1: TRUSTED CIRCLE CARD & PRIVACY GUARANTEE
           ═══════════════════════════════════════════════════════════ */}
        <section className="p-8 rounded-[32px] bg-white dark:bg-[#1E2024] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#1D4ED8] to-[#3B82F6] text-white flex items-center justify-center shadow-md">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  👨‍👩‍👧 Trusted Circle — Human Help Only When Needed
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  People you trust when you need a second opinion on a suspicious request.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsTrustedCircleModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#1D4ED8] hover:bg-[#2563EB] text-white text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Manage Trusted Circle</span>
            </button>
          </div>

          {/* Privacy Statement Alert */}
          <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 flex items-start gap-3.5">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-extrabold text-blue-950 dark:text-blue-100 block">
                Strict Non-Invasive Privacy Policy
              </span>
              <p className="text-blue-900/80 dark:text-blue-200/80 leading-relaxed font-medium">
                «Trusted Circle <strong>NEVER</strong> monitors your account balance, transaction history, browsing, or personal messages. Nayan only contacts a trusted person for a <strong>specific situation where you explicitly click "Ask someone I trust"</strong>.»
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FEATURE 2: SCAM SIMULATION & TRAINING CHALLENGES
           ═══════════════════════════════════════════════════════════ */}
        <section className="p-8 rounded-[32px] bg-white dark:bg-[#1E2024] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#1E3A2F] to-[#2E5E4A] text-white flex items-center justify-center shadow-md">
                <Award className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  🛡️ Scam Simulation — Practice Spotting Scams
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Interactive real-world threat challenges to build continuous safety reflexes.
                </p>
              </div>
            </div>

            <button
              onClick={() => startChallenge()}
              className="px-6 py-3 rounded-2xl bg-[#1E3A2F] hover:bg-[#2B5443] text-white text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Daily Challenge</span>
            </button>
          </div>

          {/* Categories Grid (10 Real Scenarios Available) */}
          <div className="space-y-3">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
              10 Dedicated Threat Simulation Categories
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {SCAM_SCENARIOS.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => startChallenge(scenario.category)}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {scenario.categoryLabel}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 capitalize">
                        {scenario.difficulty}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {scenario.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <span>Practice Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* Interactive Modals */}
      <ScamChallengeModal
        isOpen={isScamModalOpen}
        onClose={() => {
          setIsScamModalOpen(false);
          fetchSafetyStatus();
        }}
        initialCategory={selectedCategoryForChallenge}
        language={profile.language}
      />

      <TrustedCircleManagerModal
        isOpen={isTrustedCircleModalOpen}
        onClose={() => {
          setIsTrustedCircleModalOpen(false);
          fetchSafetyStatus();
        }}
        language={profile.language}
      />

    </div>
  );
}
