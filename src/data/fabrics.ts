import { Fabric } from '../types';

export const FABRICS: Fabric[] = [
  {
    id: 'kanchipuram_silk',
    name: 'Kanchipuram Silk',
    subtitle: 'Triple-twisted Mulberry Silk with Solid Gold Zari',
    description: 'Renowned for its heavy weight, tactile crispness, and solid Korvai contrast borders. Woven from 3-ply mulberry yarn that yields extraordinary lustre and crease resistance.',
    priceDelta: 380,
    warpWeft: 'Warp: 2/20 D Mulberry Silk · Weft: 3-Ply Zari & Silver Leaf Thread',
    sheenLevel: 'High Lustre',
    drapeWeight: 'Heavyweight (420 g/m²)',
    texturePattern: 'diagonal_twill'
  },
  {
    id: 'banarasi_brocade',
    name: 'Banarasi Brocade',
    subtitle: 'Opulent Gilded Jacquard with Raised Kimkhab Weft',
    description: 'Embossed with intricate flora and fauna using the ancient Kadwa and Fekwa weaving techniques. Pure silver electroplated with 24k gold, creating sculptural three-dimensional depth.',
    priceDelta: 520,
    warpWeft: 'Warp: 18/20 Denier Fine Organzine · Weft: Gilded Silver Zari Wire & Spun Silk',
    sheenLevel: 'Rich Metallic',
    drapeWeight: 'Sculptural Heavy (480 g/m²)',
    texturePattern: 'jacquard_emboss'
  },
  {
    id: 'raw_chanderi',
    name: 'Raw Chanderi Silk',
    subtitle: 'Featherlight Degummed Silk with Cotton Sheerness',
    description: 'A translucent, gossamer fabric woven with un-degummed raw silk warp and fine Egyptian cotton weft. Offers a breath of celestial lightness with an understated matte-satin glow.',
    priceDelta: 220,
    warpWeft: 'Warp: 13/15 Raw Mulberry Silk · Weft: 120s Combed Cotton Yarn',
    sheenLevel: 'Gossamer Sheer',
    drapeWeight: 'Airy Lightweight (140 g/m²)',
    texturePattern: 'plain_slub'
  },
  {
    id: 'designer_organza',
    name: 'Designer Organza',
    subtitle: 'Crystalline High-Twist Silk with Glass-Like Crispness',
    description: 'Ultra-fine filaments tightly spun with maximum twist density to create an architectural, light-catching transparency. Ideal for dramatic draping silhouettes with crisp structured volume.',
    priceDelta: 290,
    warpWeft: 'Warp: Double-Twisted Raw Organzine · Weft: 20 Denier Crystalline Silk',
    sheenLevel: 'Crisp Translucent',
    drapeWeight: 'Structured Ethereal (95 g/m²)',
    texturePattern: 'micro_grid'
  }
];
