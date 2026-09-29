import { GarmentId, ColorShade, Fabric } from '../types';
import { GARMENT_SILHOUETTE_PATHS } from './garmentMasks';

/**
 * High-precision RGB to HSL conversion.
 * Range: r, g, b in [0, 255] -> h, s, l in [0, 1].
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}

/**
 * High-precision HSL to RGB conversion.
 * Range: h, s, l in [0, 1] -> r, g, b in [0, 255].
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Material-Aware Physical Textile Dye Engine.
 * 
 * Replaces the base textile pigment with the selected dye in perceptual HSL space,
 * using the original photographic luminance to preserve genuine 3D fold geometry,
 * deep shadows, wrinkles, weave micro-contrast, and silk specular highlights.
 * 
 * Gold zari borders, gold threads, buttons, and metallic hardware are protected.
 * Background, floor, walls, and mannequin stand outside the mask remain 100% untouched.
 */
export function applyGarmentDyeToCanvas(
  sourceImage: HTMLImageElement,
  targetCanvas: HTMLCanvasElement,
  garmentId: GarmentId,
  dyeColor: ColorShade,
  fabric: Fabric,
  maskImage?: HTMLImageElement | null
): void {
  const width = sourceImage.naturalWidth || sourceImage.width || 896;
  const height = sourceImage.naturalHeight || sourceImage.height || 1200;

  targetCanvas.width = width;
  targetCanvas.height = height;

  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // 1. Draw original pristine photo onto canvas
  ctx.drawImage(sourceImage, 0, 0, width, height);

  // 2. Prepare raster mask
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) return;

  if (maskImage && maskImage.complete && maskImage.naturalWidth > 0) {
    // Render the high-precision pre-computed anti-aliased mask
    maskCtx.drawImage(maskImage, 0, 0, width, height);
  } else {
    // High-resolution vector silhouette path fallback
    const scaleX = width / 1000;
    const scaleY = height / 1333;
    maskCtx.save();
    maskCtx.scale(scaleX, scaleY);
    const pathString = GARMENT_SILHOUETTE_PATHS[garmentId] || GARMENT_SILHOUETTE_PATHS.sari;
    const path = new Path2D(pathString);
    maskCtx.fillStyle = '#FFFFFF';
    maskCtx.fill(path);
    maskCtx.restore();
  }

  const maskImgData = maskCtx.getImageData(0, 0, width, height);
  const maskData = maskImgData.data;

  // 3. Process image pixels in memory
  const imgDataObj = ctx.getImageData(0, 0, width, height);
  const data = imgDataObj.data;

  // Calculate Dye HSL
  const [dyeR, dyeG, dyeB] = dyeColor.rgb;
  const [dyeH, dyeS] = rgbToHsl(dyeR, dyeG, dyeB);

  // Fabric specific characteristics
  const isOrganza = fabric.id === 'designer_organza';
  const isChanderi = fabric.id === 'raw_chanderi';
  const isBrocade = fabric.id === 'banarasi_brocade';
  const isKanchipuram = fabric.id === 'kanchipuram_silk';

  const totalPixels = width * height;
  for (let p = 0; p < totalPixels; p++) {
    const idx = p * 4;
    const maskAlpha = maskData[idx]; // 0 = background/mannequin outside, 255 = garment

    // STRICTLY SKIP BACKGROUND AND MANNEQUIN
    if (maskAlpha === 0) continue;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Compute perceived luminance (Y) and normalized luminance
    const Y = 0.299 * r + 0.587 * g + 0.114 * b;
    const normL = Y / 255;

    // Detect Gold Zari / Metallic Brocade / Golden Embroidery / Brass Hardware
    // Gold zari in these garments has warm yellow-gold hue, high R, high G, low B:
    const isGoldHue = r > 115 && g > 75 && (r - b) > 28 && g > b * 1.05;
    const isSpecularGlint = r + g + b > 690;

    let zariProtection = 0;
    if (isGoldHue) {
      const goldDelta = Math.max(0, (r - b) - 20);
      zariProtection = Math.min(1.0, goldDelta / 40);
    } else if (isSpecularGlint) {
      zariProtection = 0.82;
    }

    // If completely gold zari or metallic hardware, preserve 100%
    if (zariProtection >= 0.98) continue;

    // MATERIAL-AWARE PHYSICAL TEXTILE COLOR MAPPING:
    let targetL: number;
    let targetS: number;
    let targetH = dyeH;

    if (dyeColor.id === 'ivory') {
      // Warm Tussar Ivory silk: lifts lightness into luxury cream, preserves fold shadows
      targetH = 44 / 360; // warm cream
      targetS = 0.24;     // subtle warm cream saturation
      targetL = 0.50 + 0.45 * normL;
    } else if (dyeColor.id === 'gold') {
      // Royal Champagne Gold silk
      targetH = 45 / 360;
      targetS = 0.70;
      targetL = 0.25 + 0.65 * normL;
    } else if (dyeColor.id === 'slate') {
      // Kashmir Slate
      targetS = 0.14;
      targetL = normL * 0.95;
    } else {
      // Jewel tones and deep dyes: Emerald, Indigo, Burgundy, Crimson, Rose, Amber, Teal, Navy
      // Saturation: rich and saturated like dyed natural silk
      targetS = Math.min(0.92, Math.max(0.65, dyeS * 1.55));

      // Lightness curve: preserves every 3D fold, deep shadow crease, and highlight
      if (normL < 0.35) {
        // Deep folds and creases
        targetL = normL * 0.96;
      } else if (normL <= 0.75) {
        // Midtones: rich saturated dye
        targetL = normL * 0.95;
      } else {
        // Highlights: specular sheen
        targetL = normL;
        // Soften saturation at pure specular highlights (silk specular reflection)
        const glint = (normL - 0.75) / 0.25;
        targetS *= 1 - 0.55 * glint;
      }
    }

    // Fabric material texture adjustments:
    if (isOrganza) {
      // Lighter, translucent crystalline structure
      targetL = Math.min(0.96, targetL * 1.08);
      targetS *= 0.88;
    } else if (isChanderi) {
      // Soft matte satin glow
      targetL = Math.min(0.95, targetL * 1.04);
      targetS *= 0.94;
    } else if (isBrocade) {
      // Deep woven structure with rich pigment
      targetL = Math.pow(targetL, 1.04);
      targetS = Math.min(0.95, targetS * 1.05);
    } else if (isKanchipuram) {
      // Crisp mulberry silk with vivid saturation
      targetS = Math.min(0.95, targetS * 1.08);
    }

    const [dyedR, dyedG, dyedB] = hslToRgb(targetH, targetS, targetL);

    // Composite using mask anti-aliasing and gold zari protection
    const effectiveWeight = (maskAlpha / 255) * (1 - zariProtection);

    data[idx] = Math.round(r * (1 - effectiveWeight) + dyedR * effectiveWeight);
    data[idx + 1] = Math.round(g * (1 - effectiveWeight) + dyedG * effectiveWeight);
    data[idx + 2] = Math.round(b * (1 - effectiveWeight) + dyedB * effectiveWeight);
  }

  // 4. Output back to canvas
  ctx.putImageData(imgDataObj, 0, 0);
}
