import React, { useState } from 'react';
import { FABRICS } from '../data/fabrics';
import { COLORS } from '../data/colors';
import { HARDWARE_LIST } from '../data/motifs';
import { ARTISAN_INFO } from '../data/garments';
import { FabricId, HardwareId } from '../types';
import { Check, ShieldCheck, MessageSquare, Info, Palette, Sparkles, Feather } from 'lucide-react';

interface WeaveColorPanelProps {
  selectedFabricId: FabricId;
  onSelectFabric: (fabricId: FabricId) => void;
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
  selectedHardwareId: HardwareId;
  onSelectHardware: (hardwareId: HardwareId) => void;
  onOpenCraftsmanModal: () => void;
  searchFilter: string;
}

export const WeaveColorPanel: React.FC<WeaveColorPanelProps> = ({
  selectedFabricId,
  onSelectFabric,
  selectedColorId,
  onSelectColor,
  selectedHardwareId,
  onSelectHardware,
  onOpenCraftsmanModal,
  searchFilter
}) => {
  const [activeTab, setActiveTab] = useState<'weave' | 'color' | 'hardware'>('weave');

  const filteredFabrics = FABRICS.filter((f) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.warpWeft.toLowerCase().includes(q);
  });

  const filteredColors = COLORS.filter((c) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.pantone.toLowerCase().includes(q) || c.dyeOrigin.toLowerCase().includes(q);
  });

  const selectedColor = COLORS.find((c) => c.id === selectedColorId) || COLORS[0];

  return (
    <aside className="w-full lg:w-[360px] xl:w-[390px] shrink-0 bg-atelier-panel flex flex-col border-l border-[#E8DFC8] h-full overflow-y-auto">
      {/* Tab Navigation */}
      <div className="p-4 sm:p-5 border-b border-[#E8DFC8]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif-luxury text-lg font-semibold tracking-wide text-[#22201D]">
            Weave & Color
          </h3>
          <span className="text-[11px] font-mono tabular-nums text-[#8C7A5B]">
            Haute Couture Finishes
          </span>
        </div>

        {/* 3 Main Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#EFE9DC] rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('weave')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
              activeTab === 'weave'
                ? 'bg-white text-[#22201D] shadow-xs'
                : 'text-[#696152] hover:text-[#22201D]'
            }`}
          >
            Weave Structure
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('color')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
              activeTab === 'color'
                ? 'bg-white text-[#22201D] shadow-xs'
                : 'text-[#696152] hover:text-[#22201D]'
            }`}
          >
            Color & Dye
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hardware')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
              activeTab === 'hardware'
                ? 'bg-white text-[#22201D] shadow-xs'
                : 'text-[#696152] hover:text-[#22201D]'
            }`}
          >
            Hardware
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        {/* TAB 1: WEAVE STRUCTURE */}
        {activeTab === 'weave' && (
          <div className="space-y-3">
            <div className="text-xs text-[#7A7060]">
              Select heritage loom specification & warp-weft density.
            </div>

            {filteredFabrics.map((fabric) => {
              const isSelected = fabric.id === selectedFabricId;
              return (
                <div
                  key={fabric.id}
                  onClick={() => onSelectFabric(fabric.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#B89355] shadow-xs ring-1 ring-[#B89355]'
                      : 'bg-[#F9F6F0] border-[#E5DDCB] hover:bg-white hover:border-[#D1C4AB]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-base font-semibold text-[#24211D]">
                        {fabric.name}
                      </h4>
                      <p className="text-[11px] text-[#8C7A5B] font-medium">
                        {fabric.subtitle}
                      </p>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[#8C7A5B] font-semibold">
                      +${fabric.priceDelta}
                    </span>
                  </div>

                  <p className="text-xs text-[#635B4D] mt-2 leading-relaxed">
                    {fabric.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#EDE6D7] grid grid-cols-2 gap-2 text-[10px] text-[#7A7060]">
                    <div>
                      <span className="text-[#968A78] uppercase">Weight:</span>{' '}
                      <span className="font-medium text-[#423C32]">{fabric.drapeWeight}</span>
                    </div>
                    <div>
                      <span className="text-[#968A78] uppercase">Sheen:</span>{' '}
                      <span className="font-medium text-[#423C32]">{fabric.sheenLevel}</span>
                    </div>
                    <div className="col-span-2 text-[10px] font-mono text-[#8C7A5B]">
                      {fabric.warpWeft}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: COLOR & DYE */}
        {activeTab === 'color' && (
          <div className="space-y-4">
            {/* Active Color Spotlight */}
            <div className="p-3.5 bg-white border border-[#E5DDCB] rounded-lg shadow-2xs">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-md shadow-inner border border-black/10 shrink-0"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A5B] font-medium">
                    Active Dye Formulation
                  </span>
                  <h4 className="font-serif-luxury text-base font-semibold text-[#24211D] truncate">
                    {selectedColor.name}
                  </h4>
                  <p className="text-[11px] font-mono text-[#615748] truncate">
                    {selectedColor.pantone}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-[#F0EBE0] text-[11px] text-[#706655] leading-relaxed">
                <span className="font-medium text-[#38332C]">Botanical Origin:</span> {selectedColor.dyeOrigin}
              </div>
            </div>

            {/* 11 Premium Color Swatches Grid */}
            <div className="space-y-2">
              <div className="text-xs text-[#7A7060] flex items-center justify-between">
                <span>Select Haute Dye Shade</span>
                <span>{filteredColors.length} Shades</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {filteredColors.map((color) => {
                  const isSelected = color.id === selectedColorId;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => onSelectColor(color.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#B89355] shadow-xs ring-1 ring-[#B89355]'
                          : 'bg-[#F9F6F0] border-[#E5DDCB] hover:bg-white hover:border-[#D1C4AB]'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full shrink-0 shadow-2xs border border-black/15 flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${color.id === 'ivory' ? 'text-black' : 'text-white'}`} />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-serif-luxury text-xs font-semibold text-[#24211D] truncate">
                          {color.name.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-[#8C8070] truncate">
                          {color.name.split(' ').slice(1).join(' ') || 'Pure Dye'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HARDWARE */}
        {activeTab === 'hardware' && (
          <div className="space-y-3">
            <div className="text-xs text-[#7A7060]">
              Handcrafted metal finishes for buttons, hooks, frog fastenings, and buckles.
            </div>

            {HARDWARE_LIST.map((hw) => {
              const isSelected = hw.id === selectedHardwareId;
              return (
                <div
                  key={hw.id}
                  onClick={() => onSelectHardware(hw.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#B89355] shadow-xs ring-1 ring-[#B89355]'
                      : 'bg-[#F9F6F0] border-[#E5DDCB] hover:bg-white hover:border-[#D1C4AB]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-5 h-5 rounded-full border border-black/20 shadow-xs"
                        style={{ backgroundColor: hw.colorHex }}
                      />
                      <h4 className="font-serif-luxury text-sm font-semibold text-[#24211D]">
                        {hw.name}
                      </h4>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[#8C7A5B] font-semibold">
                      +${hw.priceDelta}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#8C7A5B] font-medium mt-1">
                    {hw.finish}
                  </p>

                  <p className="text-xs text-[#635B4D] mt-1.5 leading-relaxed">
                    {hw.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MASTER ARTISAN PROFILE CARD (DIRECT CRAFTSMAN REQUEST) */}
      <div className="p-4 sm:p-5 border-t border-[#E8DFC8] bg-[#F7F3EB]/90">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-widest font-semibold uppercase text-[#8C7A5B]">
            Direct Craftsman Request
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Atelier Loom Active
          </span>
        </div>

        <div className="flex items-start gap-3 p-3 bg-white border border-[#E5DDCB] rounded-lg shadow-2xs">
          <img
            src={ARTISAN_INFO.portraitSrc}
            alt={ARTISAN_INFO.name}
            className="w-14 h-14 rounded-md object-cover border border-[#D9CEB5] shrink-0"
          />
          <div className="overflow-hidden flex-1">
            <h4 className="font-serif-luxury text-sm font-bold text-[#24211D] leading-tight">
              {ARTISAN_INFO.name}
            </h4>
            <p className="text-[11px] text-[#8C7A5B] font-medium leading-tight mt-0.5">
              {ARTISAN_INFO.title}
            </p>
            <p className="text-[10px] text-[#706655] mt-1 line-clamp-2">
              {ARTISAN_INFO.bio}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCraftsmanModal}
          className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-[#24211D] hover:bg-[#3D372F] text-white rounded-md shadow-xs transition-all cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#E6C687]" />
          <span>Consult Master Weaver</span>
        </button>
      </div>
    </aside>
  );
};
