'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilityProfile } from '@/types';
import { PERSONA_PRESETS } from '@/lib/servicesData';

export const DEFAULT_ACCESSIBILITY_PROFILE: AccessibilityProfile = {
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

  // Load from MongoDB / localStorage on client mount
  useEffect(() => {
    async function loadSavedProfile() {
      // 1. Try local storage first for instant render
      try {
        const saved = localStorage.getItem('nayan_accessibility_profile');
        if (saved) {
          setProfile(JSON.parse(saved));
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
            setProfile(data.profile);
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

  // Update HTML data attributes and sync to MongoDB / localStorage whenever profile changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-text-size', profile.textSize);
      root.setAttribute('data-contrast', profile.contrastTheme);
      root.setAttribute('data-reduced-motion', profile.motionReduction ? 'true' : 'false');

      try {
        localStorage.setItem('nayan_accessibility_profile', JSON.stringify(profile));
      } catch (e) {
        // ignore quota errors
      }

      // Asynchronously sync to MongoDB API
      const timeout = setTimeout(() => {
        fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile, activePersonaName }),
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
  }, [profile, activePersonaName]);

  const updateProfileKey = <K extends keyof AccessibilityProfile>(key: K, value: AccessibilityProfile[K]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setActivePersonaName(undefined);
  };

  const loadPersona = (personaId: string) => {
    const persona = PERSONA_PRESETS.find(p => p.id === personaId);
    if (persona) {
      setProfile(persona.profile);
      setActivePersonaName(persona.name);
    }
  };

  const resetProfile = () => {
    setProfile(DEFAULT_ACCESSIBILITY_PROFILE);
    setActivePersonaName(undefined);
  };

  return (
    <AccessibilityContext.Provider value={{
      profile,
      setProfile,
      updateProfileKey,
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
