export type GarmentId = 'sari' | 'sherwani' | 'kimono' | 'qipao' | 'kaftan' | 'batik_shirt';

export type FabricId = 'kanchipuram_silk' | 'banarasi_brocade' | 'raw_chanderi' | 'designer_organza';

export type HardwareId = 'antique_gold' | 'brushed_silver' | 'rose_gold' | 'burnished_gunmetal';

export type LightingPreset = 'studio' | 'golden_hour' | 'runway';

export type ViewAngle = 'front' | 'three_quarter' | 'back' | 'detail';

export type ViewMode = 'photoreal' | 'lustre' | 'weave';

export type MotifCategory = 'all' | 'botanical' | 'geometric' | 'classic' | 'abstract';

export type GridDensity = 'dense' | 'balanced' | 'spaced' | 'minimal';

export type ProjectionType = 'all_over' | 'border_accent' | 'pallu_yoke' | 'cuff_lapel';

export interface Garment {
  id: GarmentId;
  name: string;
  origin: string;
  category: string;
  silhouette: string;
  basePrice: number;
  imageSrc: string;
  maskSrc: string;
  description: string;
  heritageText: string;
  recommendedWeaves: FabricId[];
  detailFocusTitle: string;
  tags: string[];
}

export interface Fabric {
  id: FabricId;
  name: string;
  subtitle: string;
  description: string;
  priceDelta: number;
  warpWeft: string;
  sheenLevel: 'High Lustre' | 'Rich Metallic' | 'Gossamer Sheer' | 'Crisp Translucent';
  drapeWeight: string;
  texturePattern: string;
}

export interface ColorShade {
  id: string;
  name: string;
  hex: string;
  pantone: string;
  dyeOrigin: string;
  rgb: [number, number, number];
  accentHex: string;
}

export interface Motif {
  id: string;
  name: string;
  category: MotifCategory;
  description: string;
  svgIcon: string;
  priceDelta: number;
  historicalEra: string;
}

export interface Hardware {
  id: HardwareId;
  name: string;
  finish: string;
  description: string;
  priceDelta: number;
  colorHex: string;
}

export interface AtelierDesignState {
  garmentId: GarmentId;
  fabricId: FabricId;
  colorId: string;
  motifId: string;
  motifScale: number; // 0.5 to 2.5
  biasAngle: number; // 0 to 90
  density: GridDensity;
  projection: ProjectionType;
  hardwareId: HardwareId;
  lighting: LightingPreset;
  viewAngle: ViewAngle;
  viewMode: ViewMode;
  zoom: number; // 1.0 to 2.5
  rotation: number; // -180 to 180
  panX: number;
  panY: number;
  backgroundTheme: 'atelier_salon' | 'minimal_studio' | 'dark_velvet';
}

export interface SavedPreset {
  id: string;
  name: string;
  date: string;
  state: AtelierDesignState;
  estimatedPrice: number;
}
