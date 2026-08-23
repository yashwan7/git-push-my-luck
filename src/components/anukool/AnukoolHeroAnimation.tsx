'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Mic, 
  ScanLine, 
  ShieldCheck, 
  Zap, 
  Languages, 
  CheckCircle2, 
  Volume2, 
  FileText,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoice } from '@/context/VoiceContext';

interface AnukoolHeroAnimationProps {
  onOpenDocAssist?: () => void;
  onOpenVoiceAssist?: () => void;
  userName?: string;
}

const INDIC_LANGUAGES = [
  { code: 'kn', name: 'ಕನ್ನಡ', label: 'Kannada', sample: 'ನಮಸ್ಕಾರ, ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?' },
  { code: 'hi', name: 'हिंदी', label: 'Hindi', sample: 'नमस्ते, मैं आपकी क्या सहायता कर सकता हूँ?' },
  { code: 'ta', name: 'தமிழ்', label: 'Tamil', sample: 'வணக்கம், நான் உங்களுக்கு எவ்வாறு உதவலாம்?' },
  { code: 'te', name: 'తెలుగు', label: 'Telugu', sample: 'నమస్కారం, నేను మీకు ఎలా సహాయపడగలను?' },
  { code: 'en', name: 'English', label: 'English', sample: 'Hello! How can I assist you with services today?' }
];

export const AnukoolHeroAnimation: React.FC<AnukoolHeroAnimationProps> = ({
  onOpenDocAssist,
  onOpenVoiceAssist,
  userName = 'User'
}) => {
  const { profile } = useAccessibility();
  const { speak, isSpeaking, setIsAssistantModalOpen } = useVoice();
  
  const [activeLangIndex, setActiveLangIndex] = useState(0);
  const [activeFeature, setActiveFeature] = useState<'voice' | 'ocr' | 'adaptive'>('voice');
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through languages
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLangIndex((prev) => (prev + 1) % INDIC_LANGUAGES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle through feature showcases
  useEffect(() => {
    const featureTimer = setInterval(() => {
      setActiveFeature((prev) => {
        if (prev === 'voice') return 'ocr';
        if (prev === 'ocr') return 'adaptive';
        return 'voice';
      });
    }, 4500);
    return () => clearInterval(featureTimer);
  }, []);

  const currentLang = INDIC_LANGUAGES[activeLangIndex];

  const handleOrbClick = () => {
    if (onOpenVoiceAssist) {
      onOpenVoiceAssist();
    } else {
      setIsAssistantModalOpen(true);
      speak(`Hello ${userName}! Anukool Voice AI is ready. How can I help you today?`);
    }
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full md:w-80 lg:w-96 h-64 sm:h-72 shrink-0 rounded-[28px] overflow-hidden shadow-lg border border-emerald-900/20 dark:border-emerald-500/20 bg-gradient-to-br from-[#0F241C] via-[#163328] to-[#0A1A14] text-white select-none group flex flex-col justify-between p-4 sm:p-5"
      role="region"
      aria-label="ANUKOOL AI Multi-Modal Interactive Engine"
    >
      {/* Background Animated Gradient Mesh Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.6, 0.35],
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '10%', '-10%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.25, 0.45, 0.25],
            x: ['10%', '-10%', '10%'],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -bottom-16 -left-16 w-60 h-60 bg-teal-400/20 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      </div>

      {/* Top Header Pill: Live Indicator & Status */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-[10px] font-black tracking-wider uppercase text-emerald-300">
            ANUKOOL AI ENGINE
          </span>
        </div>

        {/* Dynamic Indic Language Badge */}
        <AnimatePresence mode="wait">
          <motion.button
            key={currentLang.code}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={() => speak(currentLang.sample)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95"
            title="Click to hear speech sample"
          >
            <Languages className="w-3 h-3 text-emerald-300" />
            <span>{currentLang.name}</span>
            <Volume2 className="w-2.5 h-2.5 text-emerald-400/80 animate-pulse" />
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Center Interactive Visualization Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-1">
        
        {/* Pulsing Concentric Energy Rings */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.45, 1.8],
              opacity: [0.6, 0.25, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute w-24 h-24 rounded-full border border-emerald-400/40 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.35, 1.65],
              opacity: [0.7, 0.3, 0],
            }}
            transition={{
              duration: 3,
              delay: 1,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute w-28 h-28 rounded-full border border-teal-300/30 pointer-events-none"
          />

          {/* Orbiting Feature Satellites */}
          {/* Satellite 1: Smart OCR */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, 2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            onClick={() => onOpenDocAssist && onOpenDocAssist()}
            className={`absolute -left-10 sm:-left-12 -top-2 px-2.5 py-1.5 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-md flex items-center gap-1.5 ${
              activeFeature === 'ocr' 
                ? 'bg-emerald-500/30 border-emerald-400 text-white scale-105 ring-2 ring-emerald-400/30' 
                : 'bg-black/40 border-white/10 text-slate-300 hover:border-emerald-400/50'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 text-emerald-300" />
            <div className="text-left">
              <p className="text-[10px] font-extrabold leading-none">Smart OCR</p>
              <p className="text-[8px] text-emerald-300/80 font-medium">Auto-fill Forms</p>
            </div>
          </motion.div>

          {/* Satellite 2: Adaptive UI */}
          <motion.div
            animate={{
              y: [0, 6, 0],
              rotate: [0, -2, 0]
            }}
            transition={{
              duration: 4.5,
              delay: 0.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className={`absolute -right-10 sm:-right-12 -bottom-1 px-2.5 py-1.5 rounded-xl backdrop-blur-md border transition-all duration-300 shadow-md flex items-center gap-1.5 ${
              activeFeature === 'adaptive' 
                ? 'bg-emerald-500/30 border-emerald-400 text-white scale-105 ring-2 ring-emerald-400/30' 
                : 'bg-black/40 border-white/10 text-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <div className="text-left">
              <p className="text-[10px] font-extrabold leading-none">Adaptive UI</p>
              <p className="text-[8px] text-amber-300/80 font-medium">Guided Steps</p>
            </div>
          </motion.div>

          {/* Central AI Glowing Neural Orb */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleOrbClick}
            className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-300 p-0.5 shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer group/orb z-20 flex items-center justify-center"
            title="Click to activate ANUKOOL Voice Assistant"
          >
            {/* Inner Core Glass Sphere */}
            <div className="w-full h-full rounded-full bg-[#112920] flex flex-col items-center justify-center p-2 relative overflow-hidden group-hover/orb:bg-[#16382b] transition-colors">
              
              {/* Core Waveform Bars */}
              <div className="flex items-center gap-1 h-6">
                {[0.4, 0.8, 1, 0.6, 0.9, 0.5].map((scale, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      scaleY: isSpeaking || isHovered ? [0.3, 1.2 * scale, 0.4] : [0.2, 0.7 * scale, 0.2],
                    }}
                    transition={{
                      duration: 0.6 + i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-gradient-to-t from-emerald-400 to-teal-200 rounded-full h-full origin-center"
                  />
                ))}
              </div>

              {/* Core Mic Icon Overlay */}
              <div className="mt-1 flex items-center gap-0.5">
                <Mic className="w-3 h-3 text-emerald-300 group-hover/orb:text-white transition-colors" />
                <span className="text-[9px] font-black text-emerald-200 group-hover/orb:text-white">TALK</span>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Bottom Interactive Feature Bar / Prompt */}
      <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-white truncate">
              {activeFeature === 'voice' && '🎙️ Indic Voice Assistant'}
              {activeFeature === 'ocr' && '📄 Document Instant Reader'}
              {activeFeature === 'adaptive' && '🛡️ Cognitive Step Simplifier'}
            </p>
            <p className="text-[9px] text-emerald-200/70 truncate">
              {activeFeature === 'voice' && 'Tap mic to speak in Kannada, Hindi, etc.'}
              {activeFeature === 'ocr' && 'Scan Aadhaar, Ration Card & Marks'}
              {activeFeature === 'adaptive' && 'Zero complexity, 100% accessible'}
            </p>
          </div>
        </div>

        <button
          onClick={handleOrbClick}
          className="shrink-0 px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#091a13] text-[10px] font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-1 shadow-sm"
        >
          <span>Try AI</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
