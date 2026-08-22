'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare, 
  Smartphone, 
  HelpCircle,
  Lightbulb,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import { ScamScenario, ScamCategory, SafetyProgress } from '@/types/safety';
import { SCAM_SCENARIOS, DEFAULT_SAFETY_PROGRESS } from '@/lib/safetyData';
import { useVoice } from '@/context/VoiceContext';

interface ScamChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: ScamCategory;
  language?: string;
}

export function ScamChallengeModal({
  isOpen,
  onClose,
  initialCategory,
  language = 'en'
}: ScamChallengeModalProps) {
  const { speak, isSpeaking } = useVoice();
  const [scenarios, setScenarios] = useState<ScamScenario[]>(SCAM_SCENARIOS);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(initialCategory || 'all');
  const [progress, setProgress] = useState<SafetyProgress>(DEFAULT_SAFETY_PROGRESS);
  const [attemptResult, setAttemptResult] = useState<{
    isCorrect: boolean;
    explanation: string;
    generalExplanation: string;
    redFlags: string[];
    safetyTip: string;
    updatedScore: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProgress();
      if (initialCategory) {
        setSelectedCategoryFilter(initialCategory);
      }
      setSelectedOptionId(null);
      setIsAnswered(false);
      setAttemptResult(null);
    }
  }, [isOpen, initialCategory]);

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/scam-simulation/progress');
      const data = await res.json();
      if (data?.progress) {
        setProgress(data.progress);
      }
    } catch (e) {
      console.error('Failed to fetch safety progress:', e);
    }
  };

  const filteredScenarios = scenarios.filter(s => {
    if (selectedCategoryFilter === 'all') return true;
    return s.category === selectedCategoryFilter;
  });

  const activeScenario = filteredScenarios[currentScenarioIndex] || filteredScenarios[0] || SCAM_SCENARIOS[0];

  const handleSelectOption = async (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    try {
      const res = await fetch('/api/scam-simulation/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: activeScenario.id,
          selectedOptionId: optionId,
        }),
      });

      const data = await res.json();
      if (res.ok && data) {
        setAttemptResult(data);
        if (data.progress) {
          setProgress(data.progress);
        }
      }
    } catch (e) {
      console.error('Error submitting attempt:', e);
      // Fallback evaluation
      const safe = activeScenario.options.find(o => o.id === optionId)?.isSafe || false;
      setAttemptResult({
        isCorrect: safe,
        explanation: activeScenario.generalExplanation,
        generalExplanation: activeScenario.generalExplanation,
        redFlags: activeScenario.redFlags,
        safetyTip: activeScenario.safetyTip,
        updatedScore: safe ? Math.min(95, progress.score + 3) : Math.max(50, progress.score - 2),
      });
    }
  };

  const handleNextScenario = () => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setAttemptResult(null);
    if (currentScenarioIndex < filteredScenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setCurrentScenarioIndex(0);
    }
  };

  const handleReadAloud = () => {
    if (!activeScenario) return;
    const textToRead = `${activeScenario.title}. Message received from ${activeScenario.sender}: ${activeScenario.message}. What would you do?`;
    speak(textToRead);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#1E2024] rounded-[32px] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-labelledby="scam-challenge-title"
      >
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/60 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1E3A2F] to-[#2E5E4A] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="scam-challenge-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  🛡️ Scam Challenge
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                  Interactive Training
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Practice spotting scams before they happen in real life.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio narration button */}
            <button
              onClick={handleReadAloud}
              className={`p-2 rounded-xl border transition-all ${
                isSpeaking 
                  ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse' 
                  : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200'
              }`}
              title="Read scenario aloud"
              aria-label="Read scenario aloud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-500 transition-colors"
              aria-label="Close challenge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Safety Score Header Bar */}
        <div className="px-6 py-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-emerald-900 dark:text-emerald-200">
              Scam Safety Score:
            </span>
            <span className="font-black px-2 py-0.5 rounded-lg bg-emerald-600 text-white shadow-2xs">
              {progress.score} / 100
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hidden sm:inline">
              (+{progress.monthlyImprovementPercentage}% this month)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span>Challenge {currentScenarioIndex + 1} of {filteredScenarios.length}</span>
          </div>
        </div>

        {/* Scrollable Scenario Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Category Pill & Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                {activeScenario.categoryLabel}
              </span>
              <span className="text-[10px] font-bold text-slate-400 capitalize">
                {activeScenario.difficulty} level
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {language === 'kn' && activeScenario.titleKannada ? activeScenario.titleKannada : language === 'hi' && activeScenario.titleHindi ? activeScenario.titleHindi : activeScenario.title}
            </h3>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              REALISTIC SIMULATED THREAT INTERFACE (SMS, WHATSAPP, UPI)
             ───────────────────────────────────────────────────────────── */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm bg-slate-100/70 dark:bg-black/30">
            
            {/* Simulated App Bar */}
            <div className="px-4 py-2 bg-slate-200/80 dark:bg-white/10 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeScenario.sender}</span>
              </div>
              {activeScenario.senderBadge && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  {activeScenario.senderBadge}
                </span>
              )}
            </div>

            {/* Message Bubble */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2024] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2">
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                  {language === 'kn' && activeScenario.messageKannada ? activeScenario.messageKannada : language === 'hi' && activeScenario.messageHindi ? activeScenario.messageHindi : activeScenario.message}
                </p>
                {activeScenario.subDetails && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                    {activeScenario.subDetails}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="pt-1">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block mb-2.5">
              What would you do?
            </span>

            {/* Action Option Buttons */}
            <div className="grid grid-cols-1 gap-2.5">
              {activeScenario.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let btnStyle = 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-emerald-500/60';
                
                if (isAnswered) {
                  if (option.isSafe) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20';
                  } else if (isSelected && !option.isSafe) {
                    btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/20';
                  } else {
                    btnStyle = 'opacity-50 border-slate-200 dark:border-white/5';
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={isAnswered}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all duration-200 cursor-pointer ${btnStyle}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          isAnswered && option.isSafe 
                            ? 'bg-emerald-600 text-white' 
                            : isAnswered && isSelected && !option.isSafe 
                            ? 'bg-rose-600 text-white' 
                            : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                        }`}>
                          {isAnswered && option.isSafe ? '✓' : isAnswered && isSelected ? '✕' : option.isSafe ? 'A' : 'B'}
                        </span>
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                          {language === 'kn' && option.labelKannada ? option.labelKannada : language === 'hi' && option.labelHindi ? option.labelHindi : option.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold block pl-7 text-slate-400">
                        {option.isSafe ? '🛡️ Safer Action' : '⚠️ Risky Action'}
                      </span>
                    </div>

                    {isAnswered && option.isSafe && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !option.isSafe && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RICH EDUCATIONAL COACHING (POST-ANSWER FEEDBACK)
             ───────────────────────────────────────────────────────────── */}
          {isAnswered && attemptResult && (
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 animate-in fade-in duration-300">
              
              {/* Outcome Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                attemptResult.isCorrect 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-100' 
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-100'
              }`}>
                {attemptResult.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <span className="text-sm font-black block">
                    {attemptResult.isCorrect ? '🎉 Good catch! You spotted the scam.' : '⚠️ Almost — this is a common scam tactic.'}
                  </span>
                  <p className="leading-relaxed font-medium">
                    {attemptResult.explanation}
                  </p>
                </div>
              </div>

              {/* Red Flags Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Key Red Flags in this Scenario</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {activeScenario.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Golden Safety Rule */}
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{activeScenario.safetyTip}</span>
              </div>

              {/* Adaptive Recommendation Prompt if user struggled */}
              {progress.weakCategories.length > 0 && progress.weakCategories.includes(activeScenario.category) && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 text-purple-900 dark:text-purple-200 text-xs font-semibold flex items-center justify-between">
                  <span>💡 You seem to encounter {activeScenario.categoryLabel} traps often. Want to practice one more?</span>
                </div>
              )}

              {/* Next Scenario Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextScenario}
                  className="px-6 py-3 rounded-2xl bg-[#1E3A2F] hover:bg-[#2A4D3F] text-white text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Try Another Scenario</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Remember: «Stop → Verify → Then Act»</span>
          <button
            onClick={handleNextScenario}
            className="font-bold text-slate-700 dark:text-slate-200 hover:underline"
          >
            Skip to Next →
          </button>
        </div>

      </div>
    </div>
  );
}
