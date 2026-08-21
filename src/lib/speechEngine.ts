import { SupportedLanguage } from '@/types';

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string, lang: SupportedLanguage = 'en', rate: number = 1.0, onEnd?: () => void) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this environment.');
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    // Language code map for SpeechSynthesis
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

    // Attempt to match available voice
    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.isSpeaking = true;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const speechEngine = new SpeechEngine();
