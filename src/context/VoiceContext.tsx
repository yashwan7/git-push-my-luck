'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { speechEngine } from '@/lib/speechEngine';
import { useAccessibility } from './AccessibilityContext';
import { LANGUAGE_NAMES } from '@/lib/multilingualEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'nayan';
  text: string;
  timestamp: Date;
}

interface VoiceContextType {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  isContinuousMode: boolean;
  setIsContinuousMode: (val: boolean) => void;
  isAssistantModalOpen: boolean;
  setIsAssistantModalOpen: (val: boolean) => void;
  transcript: string;
  messages: ChatMessage[];
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, onEnd?: () => void) => void;
  stopSpeaking: () => void;
  lastCommand: string | null;
  processUserSpeech: (text: string) => Promise<void>;
  clearConversation: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, updateProfileKey } = useAccessibility();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isContinuousMode, setIsContinuousMode] = useState(true);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'nayan',
      text: "Hi! I'm Anukool. I'm here to help you navigate digital services in the way that works best for you. What would you like to do today?",
      timestamp: new Date(),
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Keep references for event callbacks
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const isContinuousRef = useRef(isContinuousMode);
  isContinuousRef.current = isContinuousMode;

  const speak = (text: string, onEnd?: () => void) => {
    setIsSpeaking(true);
    speechEngine.speak(text, profileRef.current.language, profileRef.current.voiceSpeed, () => {
      setIsSpeaking(false);
      if (onEnd) {
        onEnd();
      } else if (isContinuousRef.current) {
        // Continuous Loop: Listen again after Nayan responds
        setTimeout(() => {
          startListening();
        }, 500);
      }
    });
  };

  const stopSpeaking = () => {
    speechEngine.stop();
    setIsSpeaking(false);
  };

  const processUserSpeech = async (text: string) => {
    if (!text || !text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setTranscript('');

    try {
      const response = await fetch('/api/nayan/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: profileRef.current.language,
          currentPath: pathname,
        }),
      });

      const data = await response.json();
      const reply = data.replyText || "I'm listening. How can I help you navigate?";

      const nayanMsg: ChatMessage = {
        id: `nayan-${Date.now()}`,
        role: 'nayan',
        text: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, nayanMsg]);

      // Execute Action if suggested by Nayan AI
      if (data.action) {
        if (data.action.type === 'navigate' && data.action.target) {
          router.push(data.action.target);
        } else if (data.action.type === 'profile' && data.action.key) {
          updateProfileKey(data.action.key, data.action.value);
        }
      }

      setIsProcessing(false);

      // Sarvam TTS -> Speak response -> Listen Again
      speak(reply);
    } catch (err) {
      console.error('Failed to process conversation:', err);
      setIsProcessing(false);
      speak("I encountered an issue. Let's try again.");
    }
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;

    // Stop speaking if currently talking
    stopSpeaking();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = LANGUAGE_NAMES[profileRef.current.language]?.bcp47 || 'en-IN';

        let finalSpeechText = '';
        let hasProcessed = false;

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('Listening for your command...');
          finalSpeechText = '';
          hasProcessed = false;
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          finalSpeechText = currentTranscript;
          setTranscript(currentTranscript);
          setLastCommand(currentTranscript);

          // If finalized result
          if (event.results[event.resultIndex].isFinal) {
            setIsListening(false);
            if (!hasProcessed && currentTranscript.trim()) {
              hasProcessed = true;
              processUserSpeech(currentTranscript);
            }
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Recognition error:', e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // If ended before isFinal fired but text exists
          if (!hasProcessed && finalSpeechText.trim()) {
            hasProcessed = true;
            processUserSpeech(finalSpeechText);
          }
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition failed, attempting MediaRecorder fallback:', err);
      }
    }

    // Fallback: Audio recording for Sarvam STT
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setIsListening(false);
          setIsProcessing(true);

          try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'speech.wav');
            formData.append('language', profileRef.current.language);

            const res = await fetch('/api/sarvam/stt', {
              method: 'POST',
              body: formData,
            });

            if (res.ok) {
              const data = await res.json();
              if (data.transcript) {
                processUserSpeech(data.transcript);
                return;
              }
            }
          } catch (e) {
            console.error('Sarvam STT audio error:', e);
          }

          setIsProcessing(false);
        };

        setIsListening(true);
        setTranscript('Listening via Sarvam audio input...');
        mediaRecorder.start();

        // Auto stop after 5s of recording
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            stream.getTracks().forEach((track) => track.stop());
          }
        }, 5000);
      }).catch((err) => {
        console.warn('Microphone access denied:', err);
        setIsListening(false);
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'nayan',
        text: "Hi! I'm Anukool. I'm here to help you navigate digital services in the way that works best for you. What would you like to do today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isSpeaking,
        isProcessing,
        isContinuousMode,
        setIsContinuousMode,
        isAssistantModalOpen,
        setIsAssistantModalOpen,
        transcript,
        messages,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        lastCommand,
        processUserSpeech,
        clearConversation,
      }}
    >
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
