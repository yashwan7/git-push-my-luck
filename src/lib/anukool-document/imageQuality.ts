import { DocumentQuality } from './types';

/**
 * Analyzes an image element or blob for document quality (lighting, blur, dimensions).
 * Runs completely on the client-side without sending image anywhere.
 */
export async function analyzeDocumentQuality(
  imageSource: HTMLImageElement | HTMLCanvasElement | Blob
): Promise<DocumentQuality> {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;

  if (imageSource instanceof HTMLCanvasElement) {
    canvas = imageSource;
    ctx = canvas.getContext('2d');
  } else if (imageSource instanceof HTMLImageElement) {
    canvas = document.createElement('canvas');
    canvas.width = Math.min(imageSource.naturalWidth || imageSource.width || 800, 1200);
    canvas.height = Math.min(imageSource.naturalHeight || imageSource.height || 600, 900);
    ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(imageSource, 0, 0, canvas.width, canvas.height);
    }
  } else {
    // Blob
    const img = new Image();
    const url = URL.createObjectURL(imageSource);
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = url;
    });
    canvas = document.createElement('canvas');
    canvas.width = Math.min(img.naturalWidth || 800, 1200);
    canvas.height = Math.min(img.naturalHeight || 600, 900);
    ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    URL.revokeObjectURL(url);
  }

  if (!ctx) {
    return {
      isAcceptable: true,
      brightnessScore: 80,
      contrastScore: 75,
      blurScore: 85,
      issues: [],
      suggestions: ['Document image loaded successfully.'],
    };
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const totalPixels = data.length / 4;

  let totalLuminance = 0;
  let minLum = 255;
  let maxLum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Standard relative luminance formula
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += lum;
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const avgLuminance = totalLuminance / totalPixels;
  const contrastRange = maxLum - minLum;

  const brightnessScore = Math.min(100, Math.max(0, Math.round((avgLuminance / 255) * 100)));
  const contrastScore = Math.min(100, Math.max(0, Math.round((contrastRange / 255) * 100)));
  
  // Calculate variance as a proxy for sharpness
  let varianceSum = 0;
  for (let i = 0; i < data.length; i += 16) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    varianceSum += Math.pow(lum - avgLuminance, 2);
  }
  const variance = Math.sqrt(varianceSum / (totalPixels / 4));
  const blurScore = Math.min(100, Math.max(20, Math.round(variance * 1.6)));

  const issues: string[] = [];
  const suggestions: string[] = [];

  if (avgLuminance < 65) {
    issues.push('Document appears too dark or shaded.');
    suggestions.push('Move the document into better light or turn on room lights.');
  } else if (avgLuminance > 225) {
    issues.push('Document has glare or overexposure.');
    suggestions.push('Avoid direct flash or strong reflection on the plastic card.');
  }

  if (contrastRange < 80) {
    issues.push('Low text contrast against background.');
    suggestions.push('Place the document on a dark, flat surface with all 4 corners visible.');
  }

  if (blurScore < 45) {
    issues.push('Image is slightly blurry.');
    suggestions.push('Hold your camera steady for 1 second while snapping.');
  }

  if (canvas.width < 400 || canvas.height < 300) {
    issues.push('Resolution is low.');
    suggestions.push('Bring the camera closer to the document.');
  }

  const isAcceptable = issues.length <= 1;

  if (isAcceptable && suggestions.length === 0) {
    suggestions.push('Lighting and text clarity look good.');
  }

  return {
    isAcceptable,
    brightnessScore,
    contrastScore,
    blurScore,
    issues,
    suggestions,
  };
}
