'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useVoice } from '@/context/VoiceContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { getTranslation, LANGUAGE_NAMES } from '@/lib/multilingualEngine';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Languages, 
  Zap, 
  ShieldCheck,
  Radio
} from 'lucide-react';

export function AnukoolVoiceModal() {
  const {
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
    processUserSpeech,
    clearConversation,
  } = useVoice();

  const { profile, updateProfileKey } = useAccessibility();
  const t = (key: string, fallback?: string) => getTranslation(profile.language, key, fallback);

  const [inputVal, setInputVal] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing, transcript]);

  // Initial welcome speech when opening modal first time
  useEffect(() => {
    if (isAssistantModalOpen && messages.length === 1) {
      speak(messages[0].text);
    }
  }, [isAssistantModalOpen]);

  if (!isAssistantModalOpen) return null;

  const handleManualSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const text = inputVal;
    setInputVal('');
    processUserSpeech(text);
  };

  const samplePrompts = [
    { label: 'Apply for Scholarship', text: 'I want to apply for scholarship' },
    { label: 'Book Hospital OPD', text: 'Book hospital appointment for doctor' },
    { label: 'Pay Electricity Bill', text: 'Help me pay my electricity bill' },
    { label: 'High Contrast Mode', text: 'Turn on high contrast dark theme' },
    { label: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ', text: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ' },
    { label: 'हिन्दी में बात करें', text: 'मुझसे हिन्दी में बात करो' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="ANUKOOL AI Conversational Voice Assistant"
    >
      <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-civic-blue/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg transition-all ${
                isListening 
                  ? 'bg-rose-600 animate-pulse ring-4 ring-rose-500/40' 
                  : isSpeaking 
                  ? 'bg-emerald-600 ring-4 ring-emerald-500/40' 
                  : 'bg-civic-blue'
              }`}>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              {(isListening || isSpeaking) && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">ANUKOOL Conversational AI</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Voice AI Powered
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                {LANGUAGE_NAMES[profile.language]?.nativeName} ({LANGUAGE_NAMES[profile.language]?.name}) Voice Stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsContinuousMode(!isContinuousMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isContinuousMode 
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40' 
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
              title="Continuous conversation automatically listens after speaking"
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Continuous Loop</span>
            </button>

            <button
              onClick={() => setIsAssistantModalOpen(false)}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ACOUSTIC ORB / LIVE PULSE VISUALIZER */}
        <div className="py-6 px-4 bg-gradient-to-b from-zinc-900/80 to-transparent flex flex-col items-center justify-center border-b border-zinc-800/60">
          <div className="relative flex items-center justify-center">
            {/* Pulsing visual rings */}
            <div className={`absolute w-32 h-32 rounded-full transition-all duration-700 ${
              isListening 
                ? 'bg-rose-500/20 scale-125 animate-ping' 
                : isSpeaking 
                ? 'bg-emerald-500/20 scale-125 animate-pulse' 
                : 'bg-blue-500/10 scale-100'
            }`} />
            <div className={`absolute w-24 h-24 rounded-full transition-all ${
              isListening ? 'bg-rose-500/30' : isSpeaking ? 'bg-emerald-500/30' : 'bg-blue-500/20'
            }`} />

            {/* Central Interactive Mic Button */}
            <button
              onClick={isListening ? stopListening : isSpeaking ? stopSpeaking : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white scale-110 shadow-rose-500/50'
                  : isSpeaking
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white scale-105 shadow-emerald-500/50'
                  : isProcessing
                  ? 'bg-amber-600 text-white animate-spin'
                  : 'bg-civic-blue hover:bg-blue-600 text-white shadow-blue-500/40 hover:scale-105'
              }`}
              aria-label={isListening ? 'Stop Listening' : 'Start Speaking'}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-bounce" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8 animate-pulse" />
              ) : isProcessing ? (
                <RefreshCw className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          <div className="mt-4 text-center space-y-1">
            <span className="text-sm font-bold text-white block">
              {isListening 
                ? '🎙️ Listening to you now... Speak anything'
                : isSpeaking 
                ? '🔊 Anukool is speaking...'
                : isProcessing 
                ? '🧠 Anukool AI is thinking & understanding...'
                : 'Tap microphone to speak'}
            </span>
            {transcript && (
              <p className="text-xs text-amber-300 italic max-w-md mx-auto">
                &ldquo;{transcript}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* CONVERSATION HISTORY CHAT */}
        <div 
          ref={chatScrollRef}
          className="flex-1 p-6 space-y-4 overflow-y-auto min-h-[220px] max-h-[300px] bg-zinc-950/90"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'nayan' && (
                <div className="w-8 h-8 rounded-full bg-[#1E3A2F] text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 text-xs font-black shadow-md">
                  A
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-none'
                }`}
              >
                <p className="font-medium">{msg.text}</p>
                {msg.role === 'nayan' && (
                  <button
                    onClick={() => speak(msg.text)}
                    className="mt-2 text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Voice</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 pl-11">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
              <span>Anukool AI is processing...</span>
            </div>
          )}
        </div>

        {/* QUICK ACTION PROMPT CHIPS */}
        <div className="p-3 bg-zinc-900/80 border-t border-zinc-800/80 overflow-x-auto flex items-center gap-2">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => processUserSpeech(p.text)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold whitespace-nowrap transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* TEXT / VOICE INPUT BAR */}
        <form onSubmit={handleManualSend} className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center gap-3">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type or speak anything to Anukool..."
            className="flex-1 p-3.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:border-blue-500 outline-none"
          />

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`p-3.5 rounded-xl transition-all ${
              isListening 
                ? 'bg-rose-600 text-white animate-pulse' 
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="px-5 py-3.5 rounded-xl bg-civic-blue text-white font-bold text-sm hover:bg-blue-600 disabled:opacity-40 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
