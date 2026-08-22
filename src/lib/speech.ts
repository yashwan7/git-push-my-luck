// Thin wrapper over the real, browser-native Web Speech API (SpeechSynthesis).
// No external TTS service or API key needed — works offline in any modern browser.

class SpeechFeedback {
  private queue: string[] = [];
  private speaking = false;

  speak(text: string, opts?: { interrupt?: boolean }) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (opts?.interrupt) {
      window.speechSynthesis.cancel();
      this.queue = [];
      this.speaking = false;
    }
    this.queue.push(text);
    this.drain();
  }

  private drain() {
    if (this.speaking || this.queue.length === 0) return;
    const text = this.queue.shift()!;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.98;
    utter.pitch = 1.0;
    this.speaking = true;
    utter.onend = () => {
      this.speaking = false;
      this.drain();
    };
    utter.onerror = () => {
      this.speaking = false;
      this.drain();
    };
    window.speechSynthesis.speak(utter);
  }

  stop() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.queue = [];
    this.speaking = false;
  }
}

export const speech = new SpeechFeedback();
