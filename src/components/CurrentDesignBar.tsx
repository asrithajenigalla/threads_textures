import React, { useState } from 'react';
import {
  Garment,
  Fabric,
  ColorShade,
  Motif,
  Hardware,
  AtelierDesignState
} from '../types';
import { calculateDesignPrice, formatCurrency } from '../utils/pricing';
import { exportDesignAsPng } from '../utils/renderPng';
import {
  Heart,
  Download,
  FileText,
  Bookmark,
  FolderOpen,
  Info,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface CurrentDesignBarProps {
  state: AtelierDesignState;
  garment: Garment;
  fabric: Fabric;
  color: ColorShade;
  motif: Motif;
  hardware: Hardware;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenSavePreset: () => void;
  onOpenLoadPreset: () => void;
  onOpenExportSpec: () => void;
}

export const CurrentDesignBar: React.FC<CurrentDesignBarProps> = ({
  state,
  garment,
  fabric,
  color,
  motif,
  hardware,
  isFavorite,
  onToggleFavorite,
  onOpenSavePreset,
  onOpenLoadPreset,
  onOpenExportSpec
}) => {
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const pricing = calculateDesignPrice(state);

  const handleRenderPng = async () => {
    setIsRendering(true);
    try {
      await exportDesignAsPng(state);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <footer className="sticky bottom-0 z-30 w-full bg-[#FAF8F5]/98 border-t border-[#E8DFC8] backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-all shadow-lg">
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Current Design Summary */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from Saved Atelier Portfolio' : 'Save to Atelier Portfolio'}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-[#D9CEB5] text-[#918676] hover:text-rose-600 hover:border-rose-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Text Summary */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#8C7A5B]">
                Current Design
              </span>
              <span className="text-xs text-[#8C7A5B]">·</span>
              <span className="text-[11px] text-[#7A7060] capitalize font-medium">
                {state.viewAngle.replace('_', ' ')} View ({state.viewMode})
              </span>
            </div>

            <div className="font-serif-luxury text-base sm:text-lg font-bold text-[#24211D] truncate leading-tight">
              {garment.name} · <span className="text-[#8C7A5B] font-medium">{fabric.name}</span> · <span style={{ color: color.accentHex }}>{color.name}</span>
            </div>

            <div className="text-[11px] text-[#706655] truncate hidden sm:block">
              Motif: <span className="font-medium text-[#38332C]">{motif.name}</span> ({state.motifScale}× scale, {state.biasAngle}° bias) · Hardware: {hardware.name}
            </div>
          </div>
        </div>

        {/* Center / Right: Price & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#EDE5D5]">
          
          {/* Estimated Price with interactive Breakdown Tooltip */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
              className="flex flex-col text-right group cursor-pointer"
            >
              <div className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold text-[#8C7A5B]">
                <span>Estimated Price</span>
                <Info className="w-3 h-3 text-[#9E907B]" />
              </div>
              <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#24211D] leading-none">
                {formatCurrency(pricing.total)}
              </div>
            </button>

            {/* Price Breakdown Popover */}
            {showPriceBreakdown && (
              <div className="absolute right-0 bottom-12 w-64 p-3.5 bg-white border border-[#D9CEB5] rounded-lg shadow-xl z-50 text-left">
                <div className="flex items-center justify-between border-b border-[#F0EBE0] pb-2 mb-2">
                  <span className="font-serif-luxury text-sm font-bold text-[#24211D]">
                    Atelier Cost Specification
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPriceBreakdown(false)}
                    className="text-xs text-[#9E907B] hover:text-[#24211D]"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1.5 text-xs text-[#574E41]">
                  <div className="flex justify-between">
                    <span>Base Silhouette:</span>
                    <span className="font-mono tabular-nums">{formatCurrency(pricing.baseGarment.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{pricing.fabric.name}:</span>
                    <span className="font-mono tabular-nums">+{formatCurrency(pricing.fabric.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{pricing.motif.name}:</span>
                    <span className="font-mono tabular-nums">+{formatCurrency(pricing.motif.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{pricing.hardware.name}:</span>
                    <span className="font-mono tabular-nums">+{formatCurrency(pricing.hardware.price)}</span>
                  </div>
                  {pricing.densityModifier.price > 0 && (
                    <div className="flex justify-between">
                      <span>{pricing.densityModifier.name}:</span>
                      <span className="font-mono tabular-nums">+{formatCurrency(pricing.densityModifier.price)}</span>
                    </div>
                  )}
                  <div className="border-t border-[#F0EBE0] pt-1.5 mt-1 flex justify-between font-bold text-[#24211D]">
                    <span>Total Estimate:</span>
                    <span className="font-mono tabular-nums text-[#8C7A5B]">{formatCurrency(pricing.total)}</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#8C8070] mt-2 italic">
                  Includes pure mulberry silk warping, 24k gold zari, hand-pleating, and artisan compensation.
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-[1px] bg-[#E0D7C4] hidden sm:block" />

          {/* Action Buttons: Save Preset, Load Preset, Render PNG, Export Spec */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Save Preset */}
            <button
              type="button"
              onClick={onOpenSavePreset}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-[#4D4539] bg-[#EFE8DC] hover:bg-[#E4DBCB] border border-[#DDD3BF] rounded-md transition-all cursor-pointer"
              title="Save Preset"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#8C7A5B]" />
              <span className="hidden lg:inline">Save Preset</span>
            </button>

            {/* Load Preset */}
            <button
              type="button"
              onClick={onOpenLoadPreset}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-[#4D4539] bg-[#EFE8DC] hover:bg-[#E4DBCB] border border-[#DDD3BF] rounded-md transition-all cursor-pointer"
              title="Load Saved Preset"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#8C7A5B]" />
              <span className="hidden lg:inline">Load Preset</span>
            </button>

            {/* Export Spec */}
            <button
              type="button"
              onClick={onOpenExportSpec}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-[#4D4539] bg-[#EFE8DC] hover:bg-[#E4DBCB] border border-[#DDD3BF] rounded-md transition-all cursor-pointer"
              title="Export Technical Atelier Specification"
            >
              <FileText className="w-3.5 h-3.5 text-[#8C7A5B]" />
              <span className="hidden sm:inline">Export Spec</span>
            </button>

            {/* Render PNG */}
            <button
              type="button"
              onClick={handleRenderPng}
              disabled={isRendering}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#24211D] hover:bg-[#3D372F] text-white rounded-md shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-[#E6C687]" />
              <span>{isRendering ? 'Rendering...' : 'Render PNG'}</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
