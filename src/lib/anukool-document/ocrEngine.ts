import { createWorker, Worker } from 'tesseract.js';

export type OCRProgressCallback = (step: string, progressPercent: number) => void;

class OCREngine {
  private worker: Worker | null = null;
  private isInitializing: boolean = false;

  private async getWorker(onProgress?: OCRProgressCallback): Promise<Worker> {
    if (this.worker) return this.worker;

    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((r) => setTimeout(r, 100));
      }
      if (this.worker) return this.worker;
    }

    this.isInitializing = true;
    if (onProgress) onProgress('Preparing document...', 10);

    try {
      const worker = await createWorker('eng+hin', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            const pct = Math.round(30 + (m.progress || 0) * 50);
            onProgress('Reading document...', pct);
          }
        },
      });

      this.worker = worker;
      this.isInitializing = false;
      return worker;
    } catch (err) {
      this.isInitializing = false;
      // Fallback to english-only worker if multi-language asset fails
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            const pct = Math.round(30 + (m.progress || 0) * 50);
            onProgress('Reading document...', pct);
          }
        },
      });
      this.worker = worker;
      return worker;
    }
  }

  /**
   * Performs client-side OCR on canvas or image with progress tracking.
   */
  public async recognize(
    canvasOrBlob: HTMLCanvasElement | Blob | string,
    onProgress?: OCRProgressCallback
  ): Promise<{ text: string; confidence: number }> {
    if (onProgress) onProgress('Preparing document...', 20);
    const worker = await this.getWorker(onProgress);

    if (onProgress) onProgress('Reading document...', 40);
    const result = await worker.recognize(canvasOrBlob as any);

    if (onProgress) onProgress('Understanding information...', 85);
    
    // Clean up temporary OCR outputs (Never log raw text to console for privacy)
    return {
      text: result.data.text || '',
      confidence: Math.round(result.data.confidence || 80),
    };
  }

  public async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const ocrEngine = new OCREngine();
