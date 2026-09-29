import { Motif } from '../types';

export const MOTIFS: Motif[] = [
  {
    id: 'kalka_paisley',
    name: 'Royal Kalka Paisley',
    category: 'classic',
    description: 'The ancient weeping mango teardrop motif adorned with delicate inner floriated tendrils and twisted filigree stems.',
    priceDelta: 120,
    historicalEra: '17th Century Mughal Courts & Kashmir Pashmina Guilds',
    svgIcon: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 8C35 8 20 22 20 40C20 62 38 88 54 94C66 90 80 75 80 54C80 32 64 8 50 8ZM48 20C55 20 66 32 66 48C66 65 52 78 44 80C34 76 30 60 30 45C30 30 40 20 48 20Z"/><circle cx="50" cy="50" r="6"/><circle cx="42" cy="36" r="3"/><circle cx="58" cy="62" r="3"/></svg>`
  },
  {
    id: 'mughal_jaali',
    name: 'Mughal Rose Jaali',
    category: 'geometric',
    description: 'A symmetrical latticework fretwork interwoven with blossoming Persian roses and miniature star facets.',
    priceDelta: 140,
    historicalEra: 'Emperor Shah Jahan Atelier, Agra',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><path d="M50 10 L90 50 L50 90 L10 50 Z"/><circle cx="50" cy="50" r="16"/><path d="M50 26 L50 74 M26 50 L74 50"/><circle cx="50" cy="50" r="6" fill="currentColor"/></svg>`
  },
  {
    id: 'temple_gopuram',
    name: 'Temple Gopuram Border',
    category: 'classic',
    description: 'Serrated triangular pinnacle motifs symbolising sacred Dravidian temple spires, woven in pure gold thread.',
    priceDelta: 110,
    historicalEra: 'Chola Dynasty, Thanjavur Handloom Guilds',
    svgIcon: `<svg viewBox="0 0 100 100" fill="currentColor"><polygon points="50,15 75,55 60,55 80,85 20,85 40,55 25,55"/><circle cx="50" cy="38" r="4" fill="#FAF8F5"/><polygon points="50,60 56,72 44,72" fill="#FAF8F5"/></svg>`
  },
  {
    id: 'ashvali_buti',
    name: 'Ashvali Gold Buti',
    category: 'botanical',
    description: 'Delicate standalone floral bouquets woven with three petals and a curving stem, cast in relief zari brocade.',
    priceDelta: 95,
    historicalEra: 'Chanderi & Paithani Royal Weaving Tradition',
    svgIcon: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 35C45 22 32 20 28 28C24 38 35 48 50 62C65 48 76 38 72 28C68 20 55 22 50 35Z"/><path d="M50 60Q52 75 60 88" stroke="currentColor" stroke-width="4" fill="none"/><ellipse cx="50" cy="22" rx="7" ry="12"/></svg>`
  },
  {
    id: 'parang_rusak',
    name: 'Parang Rusak Batik',
    category: 'abstract',
    description: 'Diagonal sacred dagger motifs evoking ocean waves crashing against jagged cliffs; the traditional regalia of Javanese royalty.',
    priceDelta: 130,
    historicalEra: 'Mataram Sultanate, Central Java',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5"><path d="M15 85 Q35 65 40 45 Q45 25 25 15"/><path d="M45 85 Q65 65 70 45 Q75 25 55 15"/><path d="M75 85 Q95 65 98 45"/><circle cx="35" cy="40" r="4" fill="currentColor"/><circle cx="65" cy="40" r="4" fill="currentColor"/></svg>`
  },
  {
    id: 'imperial_peony',
    name: 'Imperial Peony Brocade',
    category: 'botanical',
    description: 'Opulent multi-layered tree peony blossoms representing wealth, honour, and celestial nobility in East Asian court tapestries.',
    priceDelta: 150,
    historicalEra: 'Tang & Song Dynasties, Jiangnan Silk Manufactory',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="16"/><path d="M50 15 C35 25 35 40 50 40 C65 40 65 25 50 15 Z" fill="currentColor"/><path d="M50 85 C35 75 35 60 50 60 C65 60 65 75 50 85 Z" fill="currentColor"/><path d="M15 50 C25 35 40 35 40 50 C40 65 25 65 15 50 Z" fill="currentColor"/><path d="M85 50 C75 35 60 35 60 50 C60 65 75 65 85 50 Z" fill="currentColor"/></svg>`
  },
  {
    id: 'ikat_chevron',
    name: 'Telia Rumal Ikat Chevron',
    category: 'geometric',
    description: 'Precision tie-dyed warp and weft diamond chevrons with geometric serrated borders, hand-oiled with sesame and castor tannins.',
    priceDelta: 115,
    historicalEra: 'Pochampally & Andhra Handloom Tradition',
    svgIcon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><path d="M10 20 L50 60 L90 20"/><path d="M10 40 L50 80 L90 40"/><path d="M10 60 L50 100 L90 60"/><polygon points="50,30 65,45 50,60 35,45" fill="currentColor"/></svg>`
  },
  {
    id: 'lotus_mandala',
    name: 'Sacred Lotus Mandala',
    category: 'abstract',
    description: 'Eight-fold radiating lotus medallion representing celestial balance, enlightenment, and perpetual regeneration.',
    priceDelta: 135,
    historicalEra: 'Ajanta Cave Frescoes & Gupta Era Weaving',
    svgIcon: `<svg viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="12"/><ellipse cx="50" cy="20" rx="9" ry="16"/><ellipse cx="50" cy="80" rx="9" ry="16"/><ellipse cx="20" cy="50" rx="16" ry="9"/><ellipse cx="80" cy="50" rx="16" ry="9"/><circle cx="50" cy="50" r="4" fill="#FAF8F5"/></svg>`
  }
];

export const HARDWARE_LIST = [
  {
    id: 'antique_gold' as const,
    name: '24k Antique Gold Gilding',
    finish: 'Hand-beaten matte gold leaf with subtle amber patina',
    description: 'Cast solid brass hardware gilded with 24-karat gold leaf, polished with agate stone for an ancestral heirloom luster.',
    priceDelta: 95,
    colorHex: '#D4AF37'
  },
  {
    id: 'brushed_silver' as const,
    name: 'Tarakasi Filigree Silver',
    finish: '92.5 Sterling silver with micro-beaded filigree wirework',
    description: 'Handcrafted fine silver wire coiled into ethereal lace-like buttons and belt buckles, finished with rhodium plating.',
    priceDelta: 75,
    colorHex: '#E2E6EA'
  },
  {
    id: 'rose_gold' as const,
    name: 'Gulabi Rose Gold',
    finish: '18k Copper-gold alloy with warm pink specular reflections',
    description: 'Warm, luminous alloy providing a romantic contemporary contrast against deep jewel-toned silks.',
    priceDelta: 110,
    colorHex: '#E8A598'
  },
  {
    id: 'burnished_gunmetal' as const,
    name: 'Bidri Burnished Gunmetal',
    finish: 'Deep blackened zinc-copper alloy inlaid with fine silver',
    description: 'Centuries-old Bidri craft from the Deccan plateau; blackened with special soil extract to achieve intense obsidian depth.',
    priceDelta: 60,
    colorHex: '#3D3B39'
  }
];
