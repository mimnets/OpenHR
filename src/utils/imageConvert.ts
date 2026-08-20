
/**
 * Convert any image (data URL or Blob) to WebP format using Canvas API.
 * Falls back to the original if the browser doesn't support WebP canvas export.
 *
 * @param input - data URL string or Blob.
 * @param quality - WebP quality 0..1. Default 0.8 preserves existing behaviour
 *   for all current call sites (avatars, blog covers, logos, screenshots).
 * @param maxDimension - Optional. When provided AND the source's longest edge
 *   exceeds this value, the image is proportionally scaled down to fit. Used
 *   by the attendance selfie pipeline (720) to right-size face photos for
 *   the audit UI. Not applied by default — covers/logos keep their native
 *   resolution.
 */
export async function convertToWebP(
  input: string | Blob,
  quality = 0.8,
  maxDimension?: number
): Promise<Blob> {
  const blob = typeof input === 'string' ? await dataURLToBlob(input) : input;

  // Only convert image types
  if (!blob.type.startsWith('image/')) return blob;

  try {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');

    // Optional proportional downscale. Only shrinks — never enlarges.
    let targetW = bitmap.width;
    let targetH = bitmap.height;
    if (maxDimension && maxDimension > 0) {
      const longest = Math.max(targetW, targetH);
      if (longest > maxDimension) {
        const scale = maxDimension / longest;
        targetW = Math.round(targetW * scale);
        targetH = Math.round(targetH * scale);
      }
    }

    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    const webpBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );

    // If toBlob returned null or the browser fell back to PNG, return original
    if (!webpBlob || webpBlob.type !== 'image/webp') return blob;

    return webpBlob;
  } catch {
    // Canvas conversion failed — return original unchanged
    return blob;
  }
}

/**
 * Convert a File to WebP, preserving a .webp filename for FormData uploads.
 */
export async function convertFileToWebP(file: File, quality = 0.8, maxDimension?: number): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const webpBlob = await convertToWebP(file, quality, maxDimension);

  // If conversion didn't produce webp, return original
  if (webpBlob.type !== 'image/webp') return file;

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([webpBlob], `${baseName}.webp`, { type: 'image/webp' });
}

/**
 * Convert a File to JPEG, preserving a .jpg filename for FormData uploads.
 *
 * Used for blog and tutorial COVER images specifically. Covers end up in
 * og:image, and Facebook, LinkedIn, X, and WhatsApp do not render WebP in link
 * previews — they support JPEG/PNG/GIF — so a WebP cover produces a preview
 * card with no image at all.
 *
 * Everything else (avatars, selfies, logos) stays WebP: those are never shared
 * to social, so the smaller file size wins.
 */
export async function convertFileToJpeg(file: File, quality = 0.85, maxDimension?: number): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const blob = await convertToFormat(file, 'image/jpeg', quality, maxDimension);
  if (blob.type !== 'image/jpeg') return file;

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' });
}

/**
 * Shared canvas re-encode. JPEG has no alpha channel, so transparent source
 * pixels are composited onto white rather than turning black.
 */
async function convertToFormat(
  input: Blob,
  mimeType: 'image/jpeg' | 'image/webp',
  quality: number,
  maxDimension?: number
): Promise<Blob> {
  if (!input.type.startsWith('image/')) return input;

  try {
    const bitmap = await createImageBitmap(input);
    const canvas = document.createElement('canvas');

    let targetW = bitmap.width;
    let targetH = bitmap.height;
    if (maxDimension && maxDimension > 0) {
      const longest = Math.max(targetW, targetH);
      if (longest > maxDimension) {
        const scale = maxDimension / longest;
        targetW = Math.round(targetW * scale);
        targetH = Math.round(targetH * scale);
      }
    }

    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d')!;

    if (mimeType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    const out = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mimeType, quality)
    );

    if (!out || out.type !== mimeType) return input;
    return out;
  } catch {
    return input;
  }
}

function dataURLToBlob(dataurl: string): Promise<Blob> {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return Promise.resolve(new Blob([u8arr], { type: mime }));
}
