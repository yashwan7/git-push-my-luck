'use client';

import React from 'react';
import { useVoice } from '@/context/VoiceContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, LANGUAGE_NAMES } from '@/lib/multilingualEngine';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export function VoiceController() {
  const { isListening, isSpeaking, transcript, startListening, stopListening, speak, stopSpeaking } = useVoice();
  const { profile, updateProfileKey } = useAccessibility();
  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  return (
    <div 
      className="fixed bottom-4 right-4 sm:right-6 z-50 flex flex-col items-end gap-2"
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
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-[var(--bg-surface)] border-2 border-civic-blue shadow-2xl">
        
        {/* Listen / Microphone Button */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-acc-xs transition-all focus:outline-none focus:ring-2 focus:ring-civic-blue ${
            isListening
              ? 'bg-civic-red text-white animate-pulse'
              : 'bg-civic-blue text-white hover:bg-blue-700'
          }`}
          aria-label={isListening ? 'Stop Voice Listening' : 'Start Voice Listening'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span className="hidden sm:inline">
            {isListening ? 'Stop' : t('voice', 'Voice Input')}
          </span>
        </button>

        {/* Read Page Aloud Button */}
        <button
          onClick={isSpeaking ? stopSpeaking : () => speak(`${t('appName')} ${t('tagline')}`)}
          className={`p-2.5 rounded-xl border text-acc-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-civic-blue ${
            isSpeaking
              ? 'bg-civic-amber text-white border-civic-amber'
              : 'border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5'
          }`}
          aria-label={isSpeaking ? t('stopReading', 'Stop Reading') : t('readAloud', 'Read Aloud')}
          title={isSpeaking ? t('stopReading', 'Stop Reading') : t('readAloud', 'Read Aloud')}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Quick Voice Shortcut Prompts */}
        <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-[var(--border-color)]">
          <button
            onClick={() => updateProfileKey('language', profile.language === 'kn' ? 'en' : 'kn')}
            className="px-2.5 py-1 rounded-lg bg-black/5 hover:bg-black/10 text-acc-xs font-semibold text-[var(--text-primary)]"
          >
            {profile.language === 'kn' ? 'English' : 'ಕನ್ನಡ'}
          </button>
          <button
            onClick={() => updateProfileKey('language', profile.language === 'hi' ? 'en' : 'hi')}
            className="px-2.5 py-1 rounded-lg bg-black/5 hover:bg-black/10 text-acc-xs font-semibold text-[var(--text-primary)]"
          >
            {profile.language === 'hi' ? 'English' : 'हिन्दी'}
          </button>
        </div>

      </div>
    </div>
  );
}
