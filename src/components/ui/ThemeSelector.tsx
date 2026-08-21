'use client';

import React from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { ThemeMode } from '@/types';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeSelectorProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function ThemeSelector({ variant = 'compact', className = '' }: ThemeSelectorProps) {
  const { themeMode, resolvedTheme, setThemeMode } = useAccessibility();

  // Cycle through Light -> Dark -> System
  const cycleTheme = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  const getActiveDetails = () => {
    switch (themeMode) {
      case 'light':
        return {
          label: 'Light',
          icon: Sun,
          glowColor: 'rgba(255, 200, 50, 0.7)',
          orbClass: 'translate-x-0',
          textPosition: 'justify-end pr-3.5 sm:pr-4',
        };
      case 'dark':
        return {
          label: 'Dark',
          icon: Moon,
          glowColor: 'rgba(120, 170, 255, 0.7)',
          orbClass: 'translate-x-[64px] sm:translate-x-[72px]',
          textPosition: 'justify-start pl-3.5 sm:pl-4',
        };
      case 'system':
      default:
        return {
          label: 'Auto',
          icon: Laptop,
          glowColor: 'rgba(52, 211, 153, 0.7)',
          orbClass: 'translate-x-[32px] sm:translate-x-[36px]',
          textPosition: 'justify-end pr-2.5 sm:pr-3',
        };
    }
  };

  const current = getActiveDetails();
  const CurrentIcon = current.icon;

  if (variant === 'full') {
    const modes: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
      { mode: 'light', label: 'Light', icon: Sun },
      { mode: 'dark', label: 'Dark', icon: Moon },
      { mode: 'system', label: 'System', icon: Laptop },
    ];

    return (
      <div
        role="radiogroup"
        aria-label="Theme Appearance Selector"
        className={`relative inline-flex items-center p-1 rounded-full bg-slate-200/50 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.08)] ${className}`}
      >
        {modes.map((opt) => {
          const isSelected = themeMode === opt.mode;
          const Icon = opt.icon;

          return (
            <button
              key={opt.mode}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setThemeMode(opt.mode)}
              className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-acc-xs transition-all duration-300 ${
                isSelected
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isSelected && (
                <div 
                  className="absolute inset-0 rounded-full bg-white/70 dark:bg-white/20 backdrop-blur-md border border-white/80 dark:border-white/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_4px_12px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200" 
                />
              )}
              <Icon className={`relative z-10 w-3.5 h-3.5 ${
                isSelected 
                  ? opt.mode === 'light' ? 'text-amber-500' : opt.mode === 'dark' ? 'text-blue-400' : 'text-emerald-400' 
                  : 'text-[var(--text-secondary)]'
              }`} />
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Exact 3D Frosted Glass Slider Capsule (matching reference image)
  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      <button
        type="button"
        onClick={cycleTheme}
        aria-label={`Current appearance: ${current.label}. Click to switch between Light, Dark, Auto`}
        title={`Appearance: ${current.label} (Click to switch)`}
        className="group relative flex items-center h-10 sm:h-11 w-28 sm:w-32 px-1.5 rounded-full bg-gradient-to-b from-slate-200/70 via-slate-300/40 to-slate-200/50 dark:from-white/15 dark:via-white/10 dark:to-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),0_6px_18px_rgba(0,0,0,0.12)] transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/50 cursor-pointer overflow-hidden"
      >
        {/* Soft Glass Glow ambient background */}
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${current.glowColor} 0%, transparent 70%)`
          }}
        />

        {/* 3D Frosted Glass Bubble Knob (Orb) */}
        <div
          className={`absolute top-1 left-1 bottom-1 w-8 sm:w-9 rounded-full flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${current.orbClass} z-20`}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 0.15) 70%, rgba(255, 255, 255, 0.6) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            boxShadow: `
              inset 0 2px 4px rgba(255, 255, 255, 1),
              inset 0 -2px 3px rgba(0, 0, 0, 0.18),
              0 6px 16px rgba(0, 0, 0, 0.2),
              0 0 12px ${current.glowColor}
            `
          }}
        >
          {/* Inner Light Reflection Rim */}
          <div className="absolute top-0.5 left-1 right-1 h-2 rounded-full bg-gradient-to-b from-white/95 to-transparent pointer-events-none" />

          {/* Active Glowing Icon inside Glass Orb */}
          <CurrentIcon className={`w-4 h-4 transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] ${
            themeMode === 'light' 
              ? 'text-amber-500 stroke-[2.5]' 
              : themeMode === 'dark' 
              ? 'text-blue-500 stroke-[2.5]' 
              : 'text-emerald-500 stroke-[2.5]'
          }`} />
        </div>

        {/* Dynamic Label positioned inside the capsule track */}
        <div className={`w-full flex items-center ${current.textPosition} z-10`}>
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-[var(--text-primary)] drop-shadow-sm">
            {current.label}
          </span>
        </div>
      </button>
    </div>
  );
}
