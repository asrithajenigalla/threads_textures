import React from 'react';
import { Garment, GarmentId } from '../types';
import { GARMENTS } from '../data/garments';

interface GarmentSelectorProps {
  selectedGarmentId: GarmentId;
  onSelectGarment: (id: GarmentId) => void;
}

export const GarmentSelector: React.FC<GarmentSelectorProps> = ({
  selectedGarmentId,
  onSelectGarment,
}) => {
  return (
    <div className="w-full bg-[#FAF8F5] border-b border-[#E8DFC8] py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1720px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif-luxury text-base sm:text-lg font-semibold tracking-wide text-[#24211D]">
              Select Bespoke Silhouette
            </h2>
            <span className="text-xs text-[#827663] hidden md:inline">
              · Authentic Couture Mannequin Renders
            </span>
          </div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-[#96866E]">
            6 Master Silhouettes
          </span>
        </div>

        {/* 6 Garment Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {GARMENTS.map((garment) => {
            const isSelected = garment.id === selectedGarmentId;
            return (
              <button
                key={garment.id}
                type="button"
                onClick={() => onSelectGarment(garment.id)}
                className={`group relative flex flex-col text-left rounded-lg p-2 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#B89355] shadow-md ring-1 ring-[#B89355]'
                    : 'bg-[#F5F1E8]/70 border-[#E2D8C3] hover:bg-white hover:border-[#C4B79C]'
                }`}
              >
                {/* Thumbnail Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#EBE4D5] flex items-center justify-center">
                  <img
                    src={garment.imageSrc}
                    alt={garment.name}
                    className={`h-full w-full object-contain p-1 transition-transform duration-300 group-hover:scale-105 ${
                      isSelected ? 'scale-102' : 'opacity-90'
                    }`}
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B89355] shadow-xs" />
                  )}
                </div>

                {/* Garment Details */}
                <div className="mt-2 flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C7A5B] font-medium truncate">
                    {garment.category.split(' ')[0]}
                  </span>
                  <span className="font-serif-luxury text-sm font-semibold text-[#22201D] leading-tight truncate">
                    {garment.name}
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-[#615748] mt-0.5">
                    From ${garment.basePrice.toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
