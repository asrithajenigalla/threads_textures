import React, { useState } from 'react';
import { MOTIFS } from '../data/motifs';
import { Motif, MotifCategory, GridDensity, ProjectionType } from '../types';
import { Sparkles, Sliders, Layers, Plus, Check } from 'lucide-react';

interface PatternPrintPanelProps {
  selectedMotifId: string;
  onSelectMotif: (motifId: string) => void;
  motifScale: number;
  onScaleChange: (scale: number) => void;
  biasAngle: number;
  onAngleChange: (angle: number) => void;
  density: GridDensity;
  onDensityChange: (density: GridDensity) => void;
  projection: ProjectionType;
  onProjectionChange: (projection: ProjectionType) => void;
  searchFilter: string;
  onAddCustomMotif: (newMotif: Motif) => void;
}

export const PatternPrintPanel: React.FC<PatternPrintPanelProps> = ({
  selectedMotifId,
  onSelectMotif,
  motifScale,
  onScaleChange,
  biasAngle,
  onAngleChange,
  density,
  onDensityChange,
  projection,
  onProjectionChange,
  searchFilter,
  onAddCustomMotif
}) => {
  const [activeCategory, setActiveCategory] = useState<MotifCategory>('all');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<MotifCategory>('botanical');

  const filteredMotifs = MOTIFS.filter((m) => {
    const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
    const matchesSearch =
      !searchFilter ||
      m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.historicalEra.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: { id: MotifCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'botanical', label: 'Botanical' },
    { id: 'geometric', label: 'Geometric' },
    { id: 'classic', label: 'Classic' },
    { id: 'abstract', label: 'Abstract' }
  ];

  const densities: { id: GridDensity; label: string; desc: string }[] = [
    { id: 'dense', label: 'Dense', desc: 'Continuous jacquard fill' },
    { id: 'balanced', label: 'Balanced', desc: 'Harmonious traditional spacing' },
    { id: 'spaced', label: 'Spaced', desc: 'Scattered buti motifs' },
    { id: 'minimal', label: 'Minimal', desc: 'Focal placement accents' }
  ];

  const projections: { id: ProjectionType; label: string; desc: string }[] = [
    { id: 'all_over', label: 'All-Over Weave', desc: 'Pervasive body jacquard' },
    { id: 'border_accent', label: 'Border Korvai', desc: 'Concentrated along hems & trims' },
    { id: 'pallu_yoke', label: 'Pallu & Yoke Focus', desc: 'Intensified on chest & drape' },
    { id: 'cuff_lapel', label: 'Cuff & Placket', desc: 'Refined architectural accents' }
  ];

  const handleCreateCustomMotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newMotif: Motif = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      description: 'Hand-drafted artisan motif designed in custom atelier studio session.',
      priceDelta: 160,
      historicalEra: 'Contemporary Atelier Commission 2026',
      svgIcon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><circle cx="50" cy="50" r="32"/><path d="M50 18 L50 82 M18 50 L82 50"/><polygon points="50,28 66,50 50,72 34,50" fill="currentColor"/></svg>`
    };

    onAddCustomMotif(newMotif);
    onSelectMotif(newMotif.id);
    setCustomName('');
    setShowCustomModal(false);
  };

  return (
    <aside className="w-full lg:w-[360px] xl:w-[390px] shrink-0 bg-atelier-panel flex flex-col border-r border-[#E8DFC8] h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#E8DFC8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B89355]" />
            <h3 className="font-serif-luxury text-lg font-semibold tracking-wide text-[#22201D]">
              Pattern & Print
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#84662E] bg-[#F7F1E3] hover:bg-[#EFE5D0] border border-[#DFCFA8] rounded-md transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Motif</span>
          </button>
        </div>
        <p className="text-xs text-[#7A7060] mt-1 leading-relaxed">
          Curated textile motifs inspired by Mughal, Dravidian, Kyoto, and Javanese court weaving.
        </p>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 mt-3.5 p-1 bg-[#EFE9DC] rounded-lg overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white text-[#22201D] shadow-xs'
                  : 'text-[#696152] hover:text-[#22201D]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Motif Grid */}
      <div className="p-4 sm:p-5 border-b border-[#E8DFC8] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#7A7060]">
          <span>Select Heritage Motif</span>
          <span>{filteredMotifs.length} Available</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {filteredMotifs.map((motif) => {
            const isSelected = motif.id === selectedMotifId;
            return (
              <button
                key={motif.id}
                type="button"
                onClick={() => onSelectMotif(motif.id)}
                className={`flex flex-col text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#B89355] shadow-xs ring-1 ring-[#B89355]'
                    : 'bg-[#F9F6F0] border-[#E5DCB] hover:bg-white hover:border-[#D1C4AB]'
                }`}
              >
                {/* SVG Motif Icon */}
                <div className="h-12 w-full flex items-center justify-center text-[#8C7A5B] bg-[#F2EDE1] rounded p-1 mb-2">
                  <div
                    className="w-10 h-10 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: motif.svgIcon }}
                  />
                </div>

                <div className="flex items-start justify-between gap-1">
                  <span className="font-serif-luxury text-sm font-semibold text-[#24211D] leading-snug truncate">
                    {motif.name}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#B89355] shrink-0 mt-0.5" />
                  )}
                </div>

                <span className="text-[10px] text-[#7A7060] line-clamp-1 mt-0.5">
                  {motif.historicalEra}
                </span>

                <span className="text-[10px] font-mono tabular-nums text-[#8C7A5B] font-medium mt-1">
                  +${motif.priceDelta}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projection & Print Controls (Affects Mannequin Visualization) */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#615748]">
          <Sliders className="w-3.5 h-3.5 text-[#B89355]" />
          <span>Loom Projection Controls</span>
        </div>

        {/* Motif Scale Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="motif-scale" className="text-[#453F35] font-medium">Motif Scale</label>
            <span className="font-mono text-[11px] text-[#7A7060]">{motifScale.toFixed(2)}×</span>
          </div>
          <input
            id="motif-scale"
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={motifScale}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            className="w-full accent-[#B89355] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#9E9484]">
            <span>Micro Weave (0.5×)</span>
            <span>Standard (1.0×)</span>
            <span>Bold Statement (2.5×)</span>
          </div>
        </div>

        {/* Bias Angle Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="bias-angle" className="text-[#453F35] font-medium">Bias Weave Angle</label>
            <span className="font-mono text-[11px] text-[#7A7060]">{biasAngle}°</span>
          </div>
          <input
            id="bias-angle"
            type="range"
            min="0"
            max="90"
            step="5"
            value={biasAngle}
            onChange={(e) => onAngleChange(parseInt(e.target.value))}
            className="w-full accent-[#B89355] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#9E9484]">
            <span>Straight Grain (0°)</span>
            <span>True Bias (45°)</span>
            <span>Orthogonal (90°)</span>
          </div>
        </div>

        {/* Repeat & Grid Density */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#453F35] font-medium">Repeat / Grid Density</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {densities.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onDensityChange(d.id)}
                className={`px-2.5 py-1.5 text-left rounded border transition-all cursor-pointer ${
                  density === d.id
                    ? 'bg-white border-[#B89355] text-[#22201D] shadow-xs'
                    : 'bg-[#F7F3EB] border-[#E2D8C3] text-[#696152] hover:bg-white hover:text-[#22201D]'
                }`}
              >
                <div className="text-xs font-medium">{d.label}</div>
                <div className="text-[10px] text-[#8C8070] truncate">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Print Projection Placement */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#453F35] font-medium">Print Projection Zone</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {projections.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onProjectionChange(p.id)}
                className={`px-2.5 py-1.5 text-left rounded border transition-all cursor-pointer ${
                  projection === p.id
                    ? 'bg-white border-[#B89355] text-[#22201D] shadow-xs'
                    : 'bg-[#F7F3EB] border-[#E2D8C3] text-[#696152] hover:bg-white hover:text-[#22201D]'
                }`}
              >
                <div className="text-xs font-medium">{p.label}</div>
                <div className="text-[10px] text-[#8C8070] truncate">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Motif Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#FAF8F5] border border-[#D9CEB5] rounded-xl max-w-md w-full p-6 shadow-xl">
            <h4 className="font-serif-luxury text-xl font-semibold text-[#24211D]">
              Commission Custom Motif
            </h4>
            <p className="text-xs text-[#7A7060] mt-1">
              Add a bespoke insignia or royal family monogram to the atelier loom drafting table.
            </p>

            <form onSubmit={handleCreateCustomMotif} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#453F35] mb-1">
                  Motif Name / Inscription
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharani Lotus Crest"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D9CEB5] rounded-md focus:outline-none focus:border-[#B89355]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#453F35] mb-1">
                  Pattern Classification
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as MotifCategory)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D9CEB5] rounded-md focus:outline-none focus:border-[#B89355]"
                >
                  <option value="botanical">Botanical & Floral</option>
                  <option value="geometric">Geometric & Jaali</option>
                  <option value="classic">Classic Brocade</option>
                  <option value="abstract">Abstract Court Symbol</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 text-xs text-[#6B6254] hover:text-[#22201D] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-[#24211D] hover:bg-[#3B362F] text-white rounded-md shadow-xs cursor-pointer"
                >
                  Draft Motif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
