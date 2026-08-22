'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useVoice } from '@/context/VoiceContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, LANGUAGE_NAMES } from '@/lib/multilingualEngine';
import { NayanVoiceModal } from './NayanVoiceModal';
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';

export function VoiceController() {
  const pathname = usePathname();
  const {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    setIsAssistantModalOpen,
  } = useVoice();

  const { profile, updateProfileKey } = useAccessibility();
  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  // Hide floating voice bar on the main page (Home `/`) and login page
  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  return (
    <>
      <div 
        className="fixed bottom-4 right-4 sm:right-6 z-40 flex flex-col items-end gap-2"
        aria-label="NAYAN Multimodal Voice Interaction Assistant"
      >
        {/* Active Transcript / Feedback Tooltip */}
        {(isListening || isSpeaking || transcript) && (
          <div className="bg-civic-navy text-white text-acc-xs px-4 py-2.5 rounded-xl shadow-xl border border-civic-blue/30 max-w-xs sm:max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 mb-1">
              {isListening ? (
                <span className="flex items-center gap-1.5 text-civic-amber font-bold">
                  <span className="w-2 h-2 rounded-full bg-civic-amber animate-ping" />
                  Listening... ({LANGUAGE_NAMES[profile.language]?.name})
                </span>
              ) : isSpeaking ? (
                <span className="flex items-center gap-1.5 text-civic-green font-bold">
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  Speaking...
                </span>
              ) : (
                <span className="text-slate-400 font-semibold">{t('voice', 'Voice Input')}</span>
              )}
            </div>
            <p className="font-medium text-slate-100">
              {transcript || (isSpeaking ? 'Reading aloud active text...' : `${t('voice', 'Voice Assistant')} (${LANGUAGE_NAMES[profile.language]?.nativeName})`)}
            </p>
          </div>
        )}

        {/* Floating Action Controls Bar */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-zinc-950/90 border-2 border-civic-blue/80 shadow-2xl backdrop-blur-md">
          
          {/* Conversational Assistant Modal Button */}
          <button
            onClick={() => setIsAssistantModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-civic-blue hover:bg-blue-600 text-white font-bold text-acc-xs shadow-lg transition-all"
            title="Open Nayan Conversational AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
            <span>Nayan Voice AI</span>
          </button>

          {/* Quick Mic Listen Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-2.5 rounded-xl font-bold text-acc-xs transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
            aria-label={isListening ? 'Stop Voice Listening' : 'Start Voice Listening'}
            title={isListening ? 'Stop Voice Listening' : 'Start Voice Listening'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Read Page Aloud Button */}
          <button
            onClick={isSpeaking ? stopSpeaking : () => speak(`${t('appName')} ${t('tagline')}`)}
            className={`p-2.5 rounded-xl border text-acc-xs font-bold transition-all ${
              isSpeaking
                ? 'bg-amber-600 text-white border-amber-500'
                : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            }`}
            aria-label={isSpeaking ? t('stopReading', 'Stop Reading') : t('readAloud', 'Read Aloud')}
            title={isSpeaking ? t('stopReading', 'Stop Reading') : t('readAloud', 'Read Aloud')}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quick Language Toggle */}
          <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-zinc-800">
            <button
              onClick={() => updateProfileKey('language', profile.language === 'kn' ? 'en' : 'kn')}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-acc-xs font-semibold text-zinc-300"
            >
              {profile.language === 'kn' ? 'English' : 'ಕನ್ನಡ'}
            </button>
            <button
              onClick={() => updateProfileKey('language', profile.language === 'hi' ? 'en' : 'hi')}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-acc-xs font-semibold text-zinc-300"
            >
              {profile.language === 'hi' ? 'English' : 'हिन्दी'}
            </button>
          </div>

        </div>
      </div>

      {/* Full Screen Conversational Nayan Modal */}
      <NayanVoiceModal />
    </>
  );
}
