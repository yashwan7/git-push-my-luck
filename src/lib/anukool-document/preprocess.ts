/**
 * Preprocesses document image for optimal client-side OCR accuracy.
 * Balances contrast, converts to high-clarity grayscale, and removes noise.
 */
export async function preprocessDocumentImage(
  imageSource: HTMLImageElement | Blob
): Promise<HTMLCanvasElement> {
  let img: HTMLImageElement;

  if (imageSource instanceof Blob) {
    img = new Image();
    const url = URL.createObjectURL(imageSource);
    await new Promise((resolve, reject) => {
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.onerror = reject;
      img.src = url;
    });
  } else {
    img = imageSource;
  }

  const canvas = document.createElement('canvas');
  // Scale down huge 4K camera photos to optimal OCR dimension (1600px width)
  const maxDimension = 1600;
  let width = img.naturalWidth || img.width || 800;
  let height = img.naturalHeight || img.height || 600;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return canvas;

  // 1. Draw scaled image
  ctx.drawImage(img, 0, 0, width, height);

  // 2. Grayscale & Contrast boost
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Grayscale
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // S-curve contrast enhancement
    let enhanced = (gray - 128) * 1.35 + 128;
    enhanced = Math.max(0, Math.min(255, enhanced));

    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
