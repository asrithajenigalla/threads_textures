import React, { useState } from 'react';
import { AtelierDesignState, Garment, Fabric, ColorShade, Motif, Hardware } from '../types';
import { calculateDesignPrice, formatCurrency } from '../utils/pricing';
import { X, Copy, Check, Download, FileText, Printer } from 'lucide-react';

interface SpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AtelierDesignState;
  garment: Garment;
  fabric: Fabric;
  color: ColorShade;
  motif: Motif;
  hardware: Hardware;
}

export const SpecModal: React.FC<SpecModalProps> = ({
  isOpen,
  onClose,
  state,
  garment,
  fabric,
  color,
  motif,
  hardware
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'craft_sheet' | 'json'>('craft_sheet');

  if (!isOpen) return null;

  const pricing = calculateDesignPrice(state);

  const specObject = {
    studio: 'Threads & Textures – Custom Weave Studio',
    specId: `TT-${state.garmentId.toUpperCase()}-${Math.floor(Math.random() * 899999 + 100000)}`,
    date: new Date().toISOString(),
    garment: {
      id: garment.id,
      name: garment.name,
      category: garment.category,
      origin: garment.origin,
      basePrice: garment.basePrice
    },
    fabric: {
      id: fabric.id,
      name: fabric.name,
      warpWeft: fabric.warpWeft,
      sheenLevel: fabric.sheenLevel,
      drapeWeight: fabric.drapeWeight,
      priceDelta: fabric.priceDelta
    },
    color: {
      id: color.id,
      name: color.name,
      hex: color.hex,
      pantone: color.pantone,
      dyeOrigin: color.dyeOrigin
    },
    motif: {
      id: motif.id,
      name: motif.name,
      scale: state.motifScale,
      biasAngleDegrees: state.biasAngle,
      repeatDensity: state.density,
      projectionZone: state.projection,
      priceDelta: motif.priceDelta
    },
    hardware: {
      id: hardware.id,
      name: hardware.name,
      finish: hardware.finish,
      priceDelta: hardware.priceDelta
    },
    lighting: state.lighting,
    camera: {
      viewAngle: state.viewAngle,
      viewMode: state.viewMode,
      zoom: state.zoom,
      rotation: state.rotation
    },
    estimatedPrice: pricing.total,
    currency: 'USD',
    artisanLead: 'Ustad Maqbool Ansari, Varanasi & Kanchipuram Guild'
  };

  const jsonString = JSON.stringify(specObject, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atelier-spec-${state.garmentId}-${state.colorId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FAF8F5] border border-[#D9CEB5] rounded-xl max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8DFC8] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F7F3EB] border border-[#E2D8C3] text-[#B89355]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#24211D]">
                Technical Atelier Specification
              </h3>
              <p className="text-xs text-[#8C7A5B]">
                Loom production blueprint and archival dossier
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#8C7A5B] hover:text-[#24211D] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Atelier Craft Sheet vs Raw JSON */}
        <div className="px-5 pt-3 bg-white border-b border-[#E8DFC8] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('craft_sheet')}
            className={`pb-2 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'craft_sheet'
                ? 'border-[#B89355] text-[#24211D] font-bold'
                : 'border-transparent text-[#7A7060] hover:text-[#24211D]'
            }`}
          >
            Atelier Craft Sheet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`pb-2 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'json'
                ? 'border-[#B89355] text-[#24211D] font-bold'
                : 'border-transparent text-[#7A7060] hover:text-[#24211D]'
            }`}
          >
            Structured JSON Spec
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {activeTab === 'craft_sheet' ? (
            <div className="bg-white border border-[#E0D7C4] rounded-lg p-5 space-y-4 text-xs text-[#38332C]">
              {/* Top Banner */}
              <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
                <div>
                  <h4 className="font-serif-luxury text-xl font-bold text-[#24211D]">
                    {garment.name}
                  </h4>
                  <div className="text-[11px] text-[#8C7A5B] mt-0.5">
                    Category: {garment.category} · Origin: {garment.origin}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif-luxury text-2xl font-bold text-[#B89355]">
                    {formatCurrency(pricing.total)}
                  </div>
                  <div className="text-[10px] text-[#8C7A5B] uppercase font-mono">
                    Total Estimated Cost
                  </div>
                </div>
              </div>

              {/* Grid of specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#FAF8F5] rounded border border-[#EDE5D5]">
                  <span className="text-[10px] font-bold uppercase text-[#8C7A5B] block mb-1">
                    Weave & Warp Construction
                  </span>
                  <div className="font-semibold text-sm text-[#24211D]">{fabric.name}</div>
                  <div className="text-[11px] text-[#696152] font-mono mt-0.5">{fabric.warpWeft}</div>
                  <div className="text-[10px] text-[#8C8070] mt-1">Weight: {fabric.drapeWeight} · Sheen: {fabric.sheenLevel}</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded border border-[#EDE5D5]">
                  <span className="text-[10px] font-bold uppercase text-[#8C7A5B] block mb-1">
                    Dye & Natural Formulation
                  </span>
                  <div className="font-semibold text-sm text-[#24211D] flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border border-black/10 inline-block" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </div>
                  <div className="text-[11px] text-[#696152] font-mono mt-0.5">{color.pantone}</div>
                  <div className="text-[10px] text-[#8C8070] mt-1 line-clamp-1">{color.dyeOrigin}</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded border border-[#EDE5D5]">
                  <span className="text-[10px] font-bold uppercase text-[#8C7A5B] block mb-1">
                    Motif & Projection
                  </span>
                  <div className="font-semibold text-sm text-[#24211D]">{motif.name}</div>
                  <div className="text-[11px] text-[#696152] mt-0.5">
                    Scale: {state.motifScale}× · Bias: {state.biasAngle}° · Density: {state.density.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-[#8C8070] mt-1">Zone: {state.projection.replace('_', ' ').toUpperCase()}</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded border border-[#EDE5D5]">
                  <span className="text-[10px] font-bold uppercase text-[#8C7A5B] block mb-1">
                    Hardware & Atelier Environment
                  </span>
                  <div className="font-semibold text-sm text-[#24211D]">{hardware.name}</div>
                  <div className="text-[11px] text-[#696152] mt-0.5">{hardware.finish}</div>
                  <div className="text-[10px] text-[#8C8070] mt-1">Lighting: {state.lighting.toUpperCase()} · Angle: {state.viewAngle.toUpperCase()}</div>
                </div>
              </div>

              <div className="border-t border-[#E8DFC8] pt-3 text-[11px] text-[#7A7060] flex items-center justify-between">
                <span>Certified Loom Lead: <strong>Ustad Maqbool Ansari</strong></span>
                <span className="font-mono text-[10px]">VERIFIED ATELIER BLUEPRINT</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className="p-4 bg-[#1E1C1A] text-[#E8E2D5] rounded-lg text-xs font-mono overflow-x-auto max-h-96">
                {jsonString}
              </pre>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#F7F3EB] border-t border-[#E8DFC8] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#524B3F] hover:text-[#24211D] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJson}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border border-[#DDD5C3] text-[#24211D] rounded-md hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#8C7A5B]" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[#24211D] hover:bg-[#3D372F] text-white rounded-md transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#E6C687]" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
