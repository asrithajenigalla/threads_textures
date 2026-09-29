import React from 'react';
import { Search, Sparkles, BookOpen, Layers, UserCheck } from 'lucide-react';
import { LightingPreset } from '../types';

interface HeaderProps {
  currentLighting: LightingPreset;
  onLightingChange: (lighting: LightingPreset) => void;
  onOpenArchives: () => void;
  onOpenCraftsman: () => void;
  onOpenSwatchKit: () => void;
  onOpenPresets: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLighting,
  onLightingChange,
  onOpenArchives,
  onOpenCraftsman,
  onOpenSwatchKit,
  onOpenPresets,
  searchQuery,
  onSearchChange,
  favoriteCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E6DFC9] bg-[#FAF8F5]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-[1720px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-serif-luxury text-xl sm:text-2xl font-semibold tracking-wider text-[#22201D] uppercase">
              Threads & Textures
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#8C7A5B] uppercase font-medium -mt-1">
              Custom Weave Studio
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wide font-medium text-[#544D42]">
          <button 
            type="button"
            className="text-[#22201D] font-semibold border-b border-[#B89355] pb-0.5 transition-colors cursor-pointer"
          >
            Custom Weave Studio
          </button>
          
          <button
            type="button"
            onClick={onOpenArchives}
            className="flex items-center gap-1.5 hover:text-[#B89355] transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8C7A5B]" />
            <span>Fabric Archives</span>
          </button>

          <button
            type="button"
            onClick={onOpenCraftsman}
            className="flex items-center gap-1.5 hover:text-[#B89355] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B89355]" />
            <span>Atelier Craft & Master</span>
          </button>

          <button
            type="button"
            onClick={onOpenSwatchKit}
            className="flex items-center gap-1.5 hover:text-[#B89355] transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#8C7A5B]" />
            <span>Bespoke Swatch Kit</span>
          </button>
        </nav>

        {/* Zone 3: Search, Lighting Mode, Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block w-44 lg:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9E9484]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search weaves & motifs..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F3EDE2] border border-[#DDD5C3] rounded-md text-[#22201D] placeholder-[#9E9484] focus:outline-none focus:border-[#B89355] focus:bg-white transition-all"
            />
          </div>

          {/* Quick Lighting Preset Toggle */}
          <div className="flex items-center bg-[#EFE9DC] p-0.5 rounded-md border border-[#DCD3C0]">
            <button
              type="button"
              onClick={() => onLightingChange('studio')}
              title="Neutral Studio Daylight (5000K)"
              className={`px-2 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                currentLighting === 'studio'
                  ? 'bg-white text-[#22201D] shadow-xs'
                  : 'text-[#6B6254] hover:text-[#22201D]'
              }`}
            >
              Studio
            </button>
            <button
              type="button"
              onClick={() => onLightingChange('golden_hour')}
              title="Warm Golden Hour Light (3200K)"
              className={`px-2 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                currentLighting === 'golden_hour'
                  ? 'bg-white text-[#8A5817] shadow-xs'
                  : 'text-[#6B6254] hover:text-[#8A5817]'
              }`}
            >
              Golden
            </button>
            <button
              type="button"
              onClick={() => onLightingChange('runway')}
              title="Runway Directional Spotlights"
              className={`px-2 py-1 text-[11px] font-medium rounded transition-all cursor-pointer ${
                currentLighting === 'runway'
                  ? 'bg-white text-[#22201D] shadow-xs'
                  : 'text-[#6B6254] hover:text-[#22201D]'
              }`}
            >
              Runway
            </button>
          </div>

          {/* Presets & Vault Button */}
          <button
            type="button"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#24211D] hover:bg-[#38332C] text-[#FAF8F5] text-xs font-medium rounded-md transition-all shadow-xs cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#E6C687]" />
            <span className="hidden sm:inline">Client Vault</span>
            {favoriteCount > 0 && (
              <span className="ml-0.5 px-1 py-0.2 bg-[#B89355] text-white text-[10px] rounded-full">
                {favoriteCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
