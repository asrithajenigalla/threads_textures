import { AtelierDesignState } from '../types';
import { GARMENTS } from '../data/garments';
import { FABRICS } from '../data/fabrics';
import { MOTIFS, HARDWARE_LIST } from '../data/motifs';

export interface PriceBreakdown {
  baseGarment: { name: string; price: number };
  fabric: { name: string; price: number };
  motif: { name: string; price: number };
  hardware: { name: string; price: number };
  densityModifier: { name: string; price: number };
  total: number;
}

export function calculateDesignPrice(state: AtelierDesignState): PriceBreakdown {
  const garment = GARMENTS.find((g) => g.id === state.garmentId) || GARMENTS[0];
  const fabric = FABRICS.find((f) => f.id === state.fabricId) || FABRICS[0];
  const motif = MOTIFS.find((m) => m.id === state.motifId) || MOTIFS[0];
  const hardware = HARDWARE_LIST.find((h) => h.id === state.hardwareId) || HARDWARE_LIST[0];

  let densityPrice = 0;
  if (state.density === 'dense') densityPrice = 85;
  else if (state.density === 'balanced') densityPrice = 45;
  else if (state.density === 'spaced') densityPrice = 20;

  const total = garment.basePrice + fabric.priceDelta + motif.priceDelta + hardware.priceDelta + densityPrice;

  return {
    baseGarment: { name: garment.name, price: garment.basePrice },
    fabric: { name: fabric.name, price: fabric.priceDelta },
    motif: { name: motif.name, price: motif.priceDelta },
    hardware: { name: hardware.name, price: hardware.priceDelta },
    densityModifier: { name: `${state.density.toUpperCase()} Weave Repeat`, price: densityPrice },
    total
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}
