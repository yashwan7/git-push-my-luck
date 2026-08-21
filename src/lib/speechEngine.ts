import { SupportedLanguage } from '@/types';

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  /**
   * Speaks the provided text using Sarvam AI high-quality Indian regional TTS,
   * falling back to Web Speech API if necessary.
   */
  public async speak(
    text: string,
    lang: SupportedLanguage = 'en',
    rate: number = 1.0,
    onEnd?: () => void
  ) {
    this.stop();
    this.isSpeaking = true;

    // 1. Try Sarvam AI TTS endpoint first
    try {
      const response = await fetch('/api/sarvam/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: lang,
          pace: rate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.audioBase64) {
          const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
          const audio = new Audio(audioSrc);
          this.currentAudio = audio;

          audio.onended = () => {
            this.isSpeaking = false;
            this.currentAudio = null;
            if (onEnd) onEnd();
          };

          audio.onerror = () => {
            console.warn('Sarvam audio playback error, falling back to Web Speech API');
            this.fallbackWebSpeech(text, lang, rate, onEnd);
          };

          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Sarvam TTS network error, using browser fallback:', err);
    }

    // 2. Fallback to Browser Web Speech API
    this.fallbackWebSpeech(text, lang, rate, onEnd);
  }

  private fallbackWebSpeech(
    text: string,
    lang: SupportedLanguage = 'en',
    rate: number = 1.0,
    onEnd?: () => void
  ) {
    if (!this.synth) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    const langCodes: Record<SupportedLanguage, string> = {
      en: 'en-US',
      kn: 'kn-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
    };

    utterance.lang = langCodes[lang] || 'en-US';

    const voices = this.synth.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }

    this.isSpeaking = false;
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const speechEngine = new SpeechEngine();
