'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilityProfile, ThemeMode } from '@/types';
import { PERSONA_PRESETS } from '@/lib/servicesData';

export const DEFAULT_ACCESSIBILITY_PROFILE: AccessibilityProfile = {
  themeMode: 'system',
  textSize: 'normal',
  contrastTheme: 'standard',
  interactionMode: 'touch',
  informationMode: 'read',
  cognitiveLevel: 'standard',
  language: 'en',
  motionReduction: false,
  voiceSpeed: 1.0,
  audioFeedback: true,
  actionConfirmations: true,
  buttonTargetSize: 'standard',
};

interface AccessibilityContextType {
  profile: AccessibilityProfile;
  setProfile: React.Dispatch<React.SetStateAction<AccessibilityProfile>>;
  updateProfileKey: <K extends keyof AccessibilityProfile>(key: K, value: AccessibilityProfile[K]) => void;
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  loadPersona: (personaId: string) => void;
  activePersonaName?: string;
  resetProfile: () => void;
  isDbSynced: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AccessibilityProfile>(DEFAULT_ACCESSIBILITY_PROFILE);
  const [activePersonaName, setActivePersonaName] = useState<string | undefined>(undefined);
  const [isDbSynced, setIsDbSynced] = useState<boolean>(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemIsDark, setSystemIsDark] = useState<boolean>(true);

  // 1. Listen to system dark/light preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  // 2. Load saved theme and profile on client mount
  useEffect(() => {
    async function loadSavedProfile() {
      // 1. Try local storage first for instant render
      try {
        const savedTheme = localStorage.getItem('nayan_theme_mode') as ThemeMode | null;
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme);
        }

        const saved = localStorage.getItem('nayan_accessibility_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setProfile(prev => ({ ...DEFAULT_ACCESSIBILITY_PROFILE, ...prev, ...parsed }));
            if (parsed.themeMode) {
              setThemeModeState(parsed.themeMode);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to parse saved profile:', e);
      }

      // 2. Try fetching from MongoDB API
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.profile) {
            setProfile(prev => ({ ...DEFAULT_ACCESSIBILITY_PROFILE, ...prev, ...data.profile }));
            if (data.profile.themeMode) {
              setThemeModeState(data.profile.themeMode);
            }
            if (data.activePersonaName) {
              setActivePersonaName(data.activePersonaName);
            }
            setIsDbSynced(data.source === 'mongodb');
          }
        }
      } catch (err) {
        // Fallback silently
      }
    }

    loadSavedProfile();
  }, []);

  // Calculate resolved active theme ('light' or 'dark')
  const resolvedTheme: 'light' | 'dark' = 
    themeMode === 'system' ? (systemIsDark ? 'dark' : 'light') : themeMode;

  // 3. Update HTML data attributes, dark class and sync to MongoDB / localStorage whenever profile or theme changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', resolvedTheme);
      
      // Synchronize Tailwind darkMode class
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      root.setAttribute('data-text-size', profile?.textSize || 'normal');
      root.setAttribute('data-contrast', profile?.contrastTheme || 'standard');
      root.setAttribute('data-reduced-motion', profile?.motionReduction ? 'true' : 'false');

      try {
        localStorage.setItem('nayan_theme_mode', themeMode);
        localStorage.setItem('nayan_accessibility_profile', JSON.stringify({ ...profile, themeMode }));
      } catch (e) {
        // ignore quota errors
      }

      // Asynchronously sync to MongoDB API
      const timeout = setTimeout(() => {
        fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: { ...profile, themeMode }, activePersonaName }),
        }).then(res => res.json()).then(data => {
          if (data?.source === 'mongodb') {
            setIsDbSynced(true);
          }
        }).catch(() => {
          // offline fallback
        });
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [profile, activePersonaName, themeMode, resolvedTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setProfile(prev => ({ ...prev, themeMode: mode }));
    try {
      localStorage.setItem('nayan_theme_mode', mode);
    } catch (e) {}
  };

  const updateProfileKey = <K extends keyof AccessibilityProfile>(key: K, value: AccessibilityProfile[K]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    if (key === 'themeMode' && value) {
      setThemeModeState(value as ThemeMode);
    }
    setActivePersonaName(undefined);
  };

  const loadPersona = (personaId: string) => {
    const persona = PERSONA_PRESETS.find(p => p.id === personaId);
    if (persona) {
      setProfile(persona.profile);
      if (persona.profile.themeMode) {
        setThemeModeState(persona.profile.themeMode);
      }
      setActivePersonaName(persona.name);
    }
  };

  const resetProfile = () => {
    setProfile(DEFAULT_ACCESSIBILITY_PROFILE);
    setThemeModeState('system');
    setActivePersonaName(undefined);
  };

  return (
    <AccessibilityContext.Provider value={{
      profile,
      setProfile,
      updateProfileKey,
      themeMode,
      resolvedTheme,
      setThemeMode,
      loadPersona,
      activePersonaName,
      resetProfile,
      isDbSynced,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
