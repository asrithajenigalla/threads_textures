import { AtelierDesignState } from '../types';
import { GARMENTS } from '../data/garments';
import { FABRICS } from '../data/fabrics';
import { COLORS } from '../data/colors';
import { MOTIFS, HARDWARE_LIST } from '../data/motifs';
import { calculateDesignPrice, formatCurrency } from './pricing';
import { applyGarmentDyeToCanvas } from './garmentDyeEngine';

export async function exportDesignAsPng(state: AtelierDesignState): Promise<void> {
  const garment = GARMENTS.find((g) => g.id === state.garmentId) || GARMENTS[0];
  const fabric = FABRICS.find((f) => f.id === state.fabricId) || FABRICS[0];
  const color = COLORS.find((c) => c.id === state.colorId) || COLORS[0];
  const motif = MOTIFS.find((m) => m.id === state.motifId) || MOTIFS[0];
  const hardware = HARDWARE_LIST.find((h) => h.id === state.hardwareId) || HARDWARE_LIST[0];
  const pricing = calculateDesignPrice(state);

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Draw elegant background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1600);
  bgGrad.addColorStop(0, '#FAF8F5');
  bgGrad.addColorStop(0.5, '#F3EDE2');
  bgGrad.addColorStop(1, '#EAE2D2');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 1600);

  // Border frame
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 1120, 1520);
  ctx.strokeStyle = '#E2D8C3';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, 1104, 1504);

  // 2. Draw Atelier Header
  ctx.fillStyle = '#24211D';
  ctx.font = '600 36px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('THREADS & TEXTURES', 600, 110);

  ctx.fillStyle = '#8C7A5B';
  ctx.font = '500 16px sans-serif';
  ctx.fillText('CUSTOM WEAVE STUDIO · HAUTE COUTURE ATELIER SPECIFICATION', 600, 140);

  // 3. Draw Mannequin Image with garment-specific dye applied ONLY to textile
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const maskImg = new Image();
    maskImg.crossOrigin = 'anonymous';

    await Promise.all([
      new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        img.src = garment.imageSrc;
      }),
      new Promise((resolve) => {
        maskImg.onload = resolve;
        maskImg.onerror = resolve;
        maskImg.src = garment.maskSrc;
      })
    ]);

    if (img.complete && img.naturalWidth > 0) {
      // Create processed canvas with garment-specific dye (masked to textile only)
      const processedCanvas = document.createElement('canvas');
      applyGarmentDyeToCanvas(
        img,
        processedCanvas,
        state.garmentId,
        color,
        fabric,
        maskImg.complete && maskImg.naturalWidth > 0 ? maskImg : null
      );

      // Draw centered with object-fit contain inside (150, 180, 900, 1050)
      const targetW = 860;
      const targetH = 1000;
      const scale = Math.min(targetW / processedCanvas.width, targetH / processedCanvas.height);
      const drawW = processedCanvas.width * scale;
      const drawH = processedCanvas.height * scale;
      const drawX = 600 - drawW / 2;
      const drawY = 680 - drawH / 2;

      ctx.save();
      ctx.shadowColor = 'rgba(40, 30, 20, 0.15)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      ctx.drawImage(processedCanvas, drawX, drawY, drawW, drawH);
      ctx.restore();
    }
  } catch (err) {
    console.error('PNG render image draw error', err);
  }

  // 4. Draw Footer Spec Box
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(80, 1220, 1040, 290);
  ctx.strokeStyle = '#D9CEB5';
  ctx.lineWidth = 1;
  ctx.strokeRect(80, 1220, 1040, 290);

  // Garment Name & Price
  ctx.textAlign = 'left';
  ctx.fillStyle = '#24211D';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(garment.name, 110, 1270);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#B89355';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(formatCurrency(pricing.total), 1090, 1270);

  // Metadata Grid
  ctx.textAlign = 'left';
  ctx.fillStyle = '#7A7060';
  ctx.font = '500 14px sans-serif';
  ctx.fillText('WEAVE STRUCTURE', 110, 1315);
  ctx.fillText('COLOR & DYE', 440, 1315);
  ctx.fillText('MOTIF & EMBOSSING', 770, 1315);

  ctx.fillStyle = '#24211D';
  ctx.font = '600 16px Georgia, serif';
  ctx.fillText(fabric.name, 110, 1340);
  ctx.fillText(color.name, 440, 1340);
  ctx.fillText(motif.name, 770, 1340);

  ctx.fillStyle = '#8C7A5B';
  ctx.font = '13px monospace';
  ctx.fillText(`+${formatCurrency(pricing.fabric.price)}`, 110, 1362);
  ctx.fillText(color.pantone, 440, 1362);
  ctx.fillText(`${state.density.toUpperCase()} Repeat (${state.motifScale}x)`, 770, 1362);

  // Authentication Stamp
  ctx.textAlign = 'left';
  ctx.fillStyle = '#615748';
  ctx.font = '12px sans-serif';
  ctx.fillText(`Hardware: ${hardware.name} · View Angle: ${state.viewAngle.toUpperCase()} · Lighting: ${state.lighting.toUpperCase()}`, 110, 1420);
  ctx.fillText(`Certified Master Weaver: Ustad Maqbool Ansari · Varanasi Atelier · Date: ${new Date().toLocaleDateString()}`, 110, 1445);
  ctx.fillText(`Spec ID: TT-${state.garmentId.toUpperCase()}-${Math.floor(Math.random() * 899999 + 100000)}`, 110, 1470);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `threads-textures-${state.garmentId}-${state.colorId}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
