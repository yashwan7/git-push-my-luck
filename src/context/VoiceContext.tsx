'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { speechEngine } from '@/lib/speechEngine';
import { useAccessibility } from './AccessibilityContext';

import { LANGUAGE_NAMES } from '@/lib/multilingualEngine';

interface VoiceContextType {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  lastCommand: string | null;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const speak = (text: string, onEnd?: () => void) => {
    setIsSpeaking(true);
    speechEngine.speak(text, profile.language, profile.voiceSpeed, () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    });
  };

  const stopSpeaking = () => {
    speechEngine.stop();
    setIsSpeaking(false);
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speak("Voice input is not supported in this browser. You can use large touch controls.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = LANGUAGE_NAMES[profile.language]?.bcp47 || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening for command...');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        setLastCommand(text);
      };

      recognition.onerror = (e: any) => {
        console.warn('Recognition error:', e);
        setIsListening(false);
        setTranscript('Could not hear that. Try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <VoiceContext.Provider value={{
      isListening,
      isSpeaking,
      transcript,
      startListening,
      stopListening,
      speak,
      stopSpeaking,
      lastCommand,
    }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}
