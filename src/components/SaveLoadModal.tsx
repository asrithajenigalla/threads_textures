import React, { useState, useEffect } from 'react';
import { AtelierDesignState, SavedPreset } from '../types';
import { GARMENTS } from '../data/garments';
import { FABRICS } from '../data/fabrics';
import { COLORS } from '../data/colors';
import { calculateDesignPrice, formatCurrency } from '../utils/pricing';
import { X, Bookmark, Trash2, FolderOpen, Plus, Check } from 'lucide-react';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: AtelierDesignState;
  onLoadState: (state: AtelierDesignState) => void;
  mode: 'save' | 'load';
}

const STORAGE_KEY = 'threads_textures_saved_presets_v2';

const CURATED_HERITAGE_PRESETS: SavedPreset[] = [
  {
    id: 'preset_royal_awadh',
    name: 'Royal Awadh Darbar Sherwani',
    date: 'Atelier Heritage Edition',
    state: {
      garmentId: 'sherwani',
      fabricId: 'banarasi_brocade',
      colorId: 'ivory',
      motifId: 'kalka_paisley',
      motifScale: 1.1,
      biasAngle: 45,
      density: 'dense',
      projection: 'pallu_yoke',
      hardwareId: 'antique_gold',
      lighting: 'golden_hour',
      viewAngle: 'front',
      viewMode: 'lustre',
      zoom: 1.0,
      rotation: 0,
      panX: 0,
      panY: 0,
      backgroundTheme: 'atelier_salon'
    },
    estimatedPrice: 2605
  },
  {
    id: 'preset_kanchi_wedding',
    name: 'Vedic Sunrise Temple Sari',
    date: 'Atelier Heritage Edition',
    state: {
      garmentId: 'sari',
      fabricId: 'kanchipuram_silk',
      colorId: 'crimson',
      motifId: 'temple_gopuram',
      motifScale: 1.0,
      biasAngle: 0,
      density: 'balanced',
      projection: 'border_accent',
      hardwareId: 'antique_gold',
      lighting: 'studio',
      viewAngle: 'three_quarter',
      viewMode: 'lustre',
      zoom: 1.0,
      rotation: 0,
      panX: 0,
      panY: 0,
      backgroundTheme: 'atelier_salon'
    },
    estimatedPrice: 2080
  },
  {
    id: 'preset_kyoto_ceremony',
    name: 'Kyoto Nishijin Midnight Kimono',
    date: 'Atelier Heritage Edition',
    state: {
      garmentId: 'kimono',
      fabricId: 'banarasi_brocade',
      colorId: 'navy',
      motifId: 'imperial_peony',
      motifScale: 1.25,
      biasAngle: 30,
      density: 'balanced',
      projection: 'all_over',
      hardwareId: 'brushed_silver',
      lighting: 'runway',
      viewAngle: 'front',
      viewMode: 'photoreal',
      zoom: 1.0,
      rotation: 0,
      panX: 0,
      panY: 0,
      backgroundTheme: 'dark_velvet'
    },
    estimatedPrice: 2440
  },
  {
    id: 'preset_peacock_kaftan',
    name: 'Imperial Peacock Organza Kaftan',
    date: 'Atelier Heritage Edition',
    state: {
      garmentId: 'kaftan',
      fabricId: 'designer_organza',
      colorId: 'teal',
      motifId: 'mughal_jaali',
      motifScale: 0.9,
      biasAngle: 45,
      density: 'balanced',
      projection: 'pallu_yoke',
      hardwareId: 'rose_gold',
      lighting: 'studio',
      viewAngle: 'front',
      viewMode: 'lustre',
      zoom: 1.0,
      rotation: 0,
      panX: 0,
      panY: 0,
      backgroundTheme: 'minimal_studio'
    },
    estimatedPrice: 1565
  }
];

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onLoadState,
  mode
}) => {
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [activeTab, setActiveTab] = useState<'custom' | 'heritage'>('custom');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPresets(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPricing = calculateDesignPrice(currentState);

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) return;

    const newPreset: SavedPreset = {
      id: `preset_${Date.now()}`,
      name: presetName.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      state: { ...currentState },
      estimatedPrice: currentPricing.total
    };

    const updated = [newPreset, ...presets];
    setPresets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setPresetName('');
    setActiveTab('custom');
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPreset = (preset: SavedPreset) => {
    onLoadState(preset.state);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FAF8F5] border border-[#D9CEB5] rounded-xl max-w-xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8DFC8] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F7F3EB] border border-[#E2D8C3] text-[#B89355]">
              {mode === 'save' ? <Bookmark className="w-5 h-5" /> : <FolderOpen className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#24211D]">
                {mode === 'save' ? 'Save Design Configuration' : 'Load Atelier Presets'}
              </h3>
              <p className="text-xs text-[#8C7A5B]">
                {mode === 'save' ? 'Store your customized weave, motifs, and lighting setup' : 'Restore saved custom commissions or explore curated heritage editions'}
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* If Mode is Save, Show Save Form */}
          {mode === 'save' && (
            <form onSubmit={handleSavePreset} className="p-4 bg-white border border-[#E8DFC8] rounded-lg shadow-2xs space-y-3">
              <label className="block text-xs font-semibold text-[#453F35]">
                Preset Name / Commission Reference
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharani Crimson Wedding Sari"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C3] rounded-md focus:outline-none focus:border-[#B89355]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#24211D] hover:bg-[#3D372F] text-white text-xs font-medium rounded-md whitespace-nowrap cursor-pointer shadow-xs"
                >
                  Save Preset
                </button>
              </div>
              <div className="text-[11px] text-[#7A7060]">
                Current estimated total: <strong className="text-[#24211D]">{formatCurrency(currentPricing.total)}</strong>
              </div>
            </form>
          )}

          {/* Preset Tabs: My Saved Presets vs Curated Heritage Editions */}
          <div className="flex items-center gap-1 p-1 bg-[#EFE9DC] rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
                activeTab === 'custom'
                  ? 'bg-white text-[#22201D] shadow-xs'
                  : 'text-[#696152] hover:text-[#22201D]'
              }`}
            >
              My Saved Presets ({presets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('heritage')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
                activeTab === 'heritage'
                  ? 'bg-white text-[#22201D] shadow-xs'
                  : 'text-[#696152] hover:text-[#22201D]'
              }`}
            >
              Curated Heritage Editions ({CURATED_HERITAGE_PRESETS.length})
            </button>
          </div>

          {/* List of Presets */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {activeTab === 'custom' ? (
              presets.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#8C7A5B]">
                  No custom presets saved yet. Save your current design above!
                </div>
              ) : (
                presets.map((preset) => {
                  const g = GARMENTS.find((item) => item.id === preset.state.garmentId);
                  const f = FABRICS.find((item) => item.id === preset.state.fabricId);
                  const c = COLORS.find((item) => item.id === preset.state.colorId);
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className="p-3 bg-white border border-[#E5DDCB] hover:border-[#B89355] rounded-lg transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                    >
                      <div>
                        <div className="font-serif-luxury text-sm font-semibold text-[#24211D]">
                          {preset.name}
                        </div>
                        <div className="text-[11px] text-[#7A7060]">
                          {g?.name} · {f?.name} · {c?.name}
                        </div>
                        <div className="text-[10px] text-[#A39988] mt-0.5">
                          Saved: {preset.date} · {formatCurrency(preset.estimatedPrice)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#8C7A5B] opacity-0 group-hover:opacity-100 transition-opacity">
                          Load →
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeletePreset(preset.id, e)}
                          title="Delete Preset"
                          className="p-1.5 text-[#A39988] hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              CURATED_HERITAGE_PRESETS.map((preset) => {
                const g = GARMENTS.find((item) => item.id === preset.state.garmentId);
                const f = FABRICS.find((item) => item.id === preset.state.fabricId);
                const c = COLORS.find((item) => item.id === preset.state.colorId);
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="p-3 bg-white border border-[#E5DDCB] hover:border-[#B89355] rounded-lg transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="font-serif-luxury text-sm font-semibold text-[#24211D]">
                        {preset.name}
                      </div>
                      <div className="text-[11px] text-[#7A7060]">
                        {g?.name} · {f?.name} · {c?.name}
                      </div>
                      <div className="text-[10px] text-[#8C7A5B] font-mono mt-0.5">
                        {formatCurrency(preset.estimatedPrice)}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#8C7A5B] opacity-0 group-hover:opacity-100 transition-opacity">
                      Load Preset →
                    </span>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
