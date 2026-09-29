import React, { useState } from 'react';
import { X, BookOpen, Award, Shield, FileCheck } from 'lucide-react';
import { FABRICS } from '../data/fabrics';

interface ArchivesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchivesModal: React.FC<ArchivesModalProps> = ({ isOpen, onClose }) => {
  const [selectedArchiveIndex, setSelectedArchiveIndex] = useState(0);

  if (!isOpen) return null;

  const archiveRecords = [
    {
      title: 'Royal Kanchipuram Korvai Registry (1894)',
      region: 'Kanchipuram, Tamil Nadu Guild',
      loomType: 'Traditional Three-Shuttle Pit Loom with Hand-Tied Adai Harness',
      warpCount: '20/22 D Double-Filament Raw Mulberry Silk',
      weftCount: '3-Ply Silk with 0.8% Silver Electroplated 24k Gold Wire',
      notes: 'Historical registry entry documenting the master wedding sari woven for the Tanjore royal household. The border and body were joined using interlocking warp teeth, creating seamless structural integrity.',
      tensileStrength: '4.8 g/denier',
      preservedAt: 'Varanasi Central Weaver Archives'
    },
    {
      title: 'Imperial Awadh Kimkhab Jacquard (1912)',
      region: 'Varanasi & Lucknow Guild',
      loomType: 'Countermarch Jacquard Drawloom with 800-Cord Punched Card System',
      warpCount: '18/20 Fine Organzine Twisted Silk',
      weftCount: 'Pure Gilded Silver Zari Ribbon with Raised Velvet Chenille',
      notes: 'Crafted for royal ceremonial sherwanis and court coats. The raised floral vines are created through a supplementary weft float technique known as Kadwa, where each buti is woven individually without loose reverse floats.',
      tensileStrength: '5.2 g/denier',
      preservedAt: 'Atelier Threads & Textures Vault'
    },
    {
      title: 'Nishijin Peony Damask Tanmono Bolt (1926)',
      region: 'Kyoto Nishijin District, Japan',
      loomType: 'Tate-bata Vertical Drawloom with Pure Bamboo Reeds',
      warpCount: 'Extra-Fine 14 Denier Japanese Habotai Silk',
      weftCount: 'Gold Leaf Pressed on Mulberry Paper (Kinran) and Fine Indigo Silk',
      notes: 'An uncut 12-meter ceremonial bolt created for imperial court robes. Features continuous botanical peonies woven in shimmering gold Kinran foil threads with subtle color shifts across the grain.',
      tensileStrength: '4.5 g/denier',
      preservedAt: 'Kyoto Textile Historical Collection'
    },
    {
      title: 'Yogyakarta Parang Rusak Canting Masterpiece (1938)',
      region: 'Yogyakarta Palace Atelier, Java',
      loomType: 'Hand-Operated Gedogan Loom & Hot Wax Canting Pen',
      warpCount: '60s Combed Long-Staple Primissima Cotton-Silk Blend',
      weftCount: 'Hand-Spun Wild Tussar Weft',
      notes: 'Ceremonial Batik Tulis shirt fabric reserved exclusively for palace royalty. Drawn with beeswax and tree resin, then submerged across forty days in natural Indigofera tinctoria fermentation vats.',
      tensileStrength: '4.1 g/denier',
      preservedAt: 'Sultanate Heritage Textile Registry'
    }
  ];

  const current = archiveRecords[selectedArchiveIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FAF8F5] border border-[#D9CEB5] rounded-xl max-w-3xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8DFC8] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F7F3EB] border border-[#E2D8C3] text-[#B89355]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#24211D]">
                Fabric Sample Archives & Loom Registry
              </h3>
              <p className="text-xs text-[#8C7A5B]">
                Curated historical weave records, master loom draftings, and warp-weft forensic metrics
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
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Archive List */}
          <div className="w-full md:w-64 border-r border-[#E8DFC8] bg-[#F7F3EB] p-3 space-y-2 overflow-y-auto">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A5B] px-1">
              Historical Folios
            </div>
            {archiveRecords.map((rec, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedArchiveIndex(i)}
                className={`w-full p-2.5 rounded-md text-left transition-all cursor-pointer ${
                  selectedArchiveIndex === i
                    ? 'bg-white border border-[#B89355] shadow-xs text-[#24211D] font-medium'
                    : 'text-[#5C5345] hover:bg-white/60'
                }`}
              >
                <div className="font-serif-luxury text-xs font-semibold truncate leading-snug">
                  {rec.title}
                </div>
                <div className="text-[10px] text-[#8C7A5B] truncate mt-0.5">
                  {rec.region}
                </div>
              </button>
            ))}
          </div>

          {/* Right Record Details */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C7A5B] tracking-wider">
                Registry Document #{1890 + selectedArchiveIndex * 14}
              </span>
              <h4 className="font-serif-luxury text-xl font-bold text-[#24211D] mt-0.5">
                {current.title}
              </h4>
              <p className="text-xs text-[#6B6254] font-medium mt-0.5">
                {current.region} · Certified Heritage Origin
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF8F5] border border-[#E8DFC8] p-3.5 rounded-lg">
              <div>
                <span className="text-[#8C7A5B] uppercase text-[10px] font-semibold block">Loom Architecture:</span>
                <span className="text-[#332E27] font-medium">{current.loomType}</span>
              </div>
              <div>
                <span className="text-[#8C7A5B] uppercase text-[10px] font-semibold block">Tensile Strength:</span>
                <span className="text-[#332E27] font-medium">{current.tensileStrength}</span>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <span className="text-[#8C7A5B] uppercase text-[10px] font-semibold block">Warp Composition:</span>
                <span className="text-[#332E27] font-medium font-mono text-[11px]">{current.warpCount}</span>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <span className="text-[#8C7A5B] uppercase text-[10px] font-semibold block">Weft & Zari Formulation:</span>
                <span className="text-[#332E27] font-medium font-mono text-[11px]">{current.weftCount}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C7A5B] tracking-wider block mb-1">
                Forensic Weaver Notes
              </span>
              <p className="text-xs text-[#524B3F] leading-relaxed">
                {current.notes}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-[#7A7060] border-t border-[#E8DFC8]">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#B89355]" />
                Preserved: {current.preservedAt}
              </span>
              <span className="text-[10px] font-mono text-[#8C7A5B]">
                ARCHIVAL STATUS: VERIFIED AUTHENTIC
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
