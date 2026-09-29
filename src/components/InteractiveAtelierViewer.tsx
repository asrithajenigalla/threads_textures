import React, { useState, useRef, useEffect } from 'react';
import {
  Garment,
  Fabric,
  ColorShade,
  Motif,
  Hardware,
  LightingPreset,
  ViewAngle,
  ViewMode,
  GridDensity,
  ProjectionType
} from '../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Eye,
  Maximize2,
  Compass,
  Camera,
  Info,
  Check,
  Sparkles
} from 'lucide-react';
import { applyGarmentDyeToCanvas } from '../utils/garmentDyeEngine';
import { GARMENT_SILHOUETTE_PATHS } from '../utils/garmentMasks';

interface InteractiveAtelierViewerProps {
  garment: Garment;
  fabric: Fabric;
  color: ColorShade;
  motif: Motif;
  hardware: Hardware;
  motifScale: number;
  biasAngle: number;
  density: GridDensity;
  projection: ProjectionType;
  lighting: LightingPreset;
  onLightingChange: (lighting: LightingPreset) => void;
  viewAngle: ViewAngle;
  onViewAngleChange: (angle: ViewAngle) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  rotation: number;
  onRotationChange: (rot: number) => void;
  backgroundTheme: 'atelier_salon' | 'minimal_studio' | 'dark_velvet';
  onBackgroundThemeChange: (theme: 'atelier_salon' | 'minimal_studio' | 'dark_velvet') => void;
}

export const InteractiveAtelierViewer: React.FC<InteractiveAtelierViewerProps> = ({
  garment,
  fabric,
  color,
  motif,
  hardware,
  motifScale,
  biasAngle,
  density,
  projection,
  lighting,
  onLightingChange,
  viewAngle,
  onViewAngleChange,
  viewMode,
  onViewModeChange,
  zoom,
  onZoomChange,
  rotation,
  onRotationChange,
  backgroundTheme,
  onBackgroundThemeChange
}) => {
  const [imageError, setImageError] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const loadedMaskRef = useRef<HTMLImageElement | null>(null);

  // Load and cache pristine garment base image and dedicated mask
  useEffect(() => {
    setImageError(false);
    setPan({ x: 0, y: 0 });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = garment.imageSrc;

    const maskImg = new Image();
    maskImg.crossOrigin = 'anonymous';
    maskImg.src = garment.maskSrc;

    let imgLoaded = false;
    let maskLoaded = false;

    const tryRender = () => {
      if (imgLoaded && canvasRef.current) {
        applyGarmentDyeToCanvas(
          img,
          canvasRef.current,
          garment.id,
          color,
          fabric,
          maskLoaded ? maskImg : null
        );
      }
    };

    img.onload = () => {
      imgLoaded = true;
      loadedImageRef.current = img;
      tryRender();
    };

    maskImg.onload = () => {
      maskLoaded = true;
      loadedMaskRef.current = maskImg;
      tryRender();
    };

    img.onerror = () => {
      setImageError(true);
    };

    if (img.complete && img.naturalWidth > 0) {
      imgLoaded = true;
      loadedImageRef.current = img;
      if (maskImg.complete && maskImg.naturalWidth > 0) {
        maskLoaded = true;
        loadedMaskRef.current = maskImg;
      }
      tryRender();
    }
  }, [garment.id, garment.imageSrc, garment.maskSrc]);

  // When color or fabric changes: update dye strictly on garment textile in real-time
  useEffect(() => {
    if (loadedImageRef.current && canvasRef.current && !imageError) {
      applyGarmentDyeToCanvas(
        loadedImageRef.current,
        canvasRef.current,
        garment.id,
        color,
        fabric,
        loadedMaskRef.current
      );
    }
  }, [color.id, fabric.id, garment.id, imageError]);

  // Handle Pan and Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1.05) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    onZoomChange(1.0);
    onRotationChange(0);
    setPan({ x: 0, y: 0 });
    onViewAngleChange('front');
  };

  // Dynamic transform calculation based on viewAngle, zoom, pan, rotation
  const getTransformStyle = () => {
    let baseScale = zoom;
    let offsetX = pan.x;
    let offsetY = pan.y;
    let rot = rotation;
    let perspectiveTransform = '';

    if (viewAngle === 'three_quarter') {
      perspectiveTransform = 'perspective(900px) rotateY(16deg)';
      rot += 6;
    } else if (viewAngle === 'back') {
      perspectiveTransform = 'scaleX(-0.98)';
      rot = -rot;
    } else if (viewAngle === 'detail') {
      baseScale = zoom * 1.85;
      offsetY += 50;
      offsetX -= 15;
    }

    return {
      transform: `scale(${baseScale}) translate(${offsetX}px, ${offsetY}px) rotate(${rot}deg) ${perspectiveTransform}`,
      transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    };
  };

  // Pattern tile sizing based on scale & density
  const getPatternSize = () => {
    let base = 48 * motifScale;
    if (density === 'dense') base *= 0.65;
    else if (density === 'spaced') base *= 1.4;
    else if (density === 'minimal') base *= 2.0;
    return Math.max(16, Math.min(180, base));
  };

  const patternSize = getPatternSize();

  // Background styling
  const getBackgroundClass = () => {
    switch (backgroundTheme) {
      case 'dark_velvet':
        return 'bg-gradient-to-b from-[#1C1A17] via-[#161412] to-[#0F0E0C] text-white';
      case 'minimal_studio':
        return 'bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#ECE5D8] text-[#24211D]';
      case 'atelier_salon':
      default:
        return 'bg-gradient-to-b from-[#F7F3EB] via-[#EFE8DA] to-[#E3DAC8] text-[#24211D]';
    }
  };

  // Lighting overlay
  const getLightingOverlay = () => {
    switch (lighting) {
      case 'golden_hour':
        return 'bg-gradient-to-tr from-amber-600/15 via-orange-300/10 to-transparent mix-blend-color-burn pointer-events-none';
      case 'runway':
        return 'bg-radial from-white/10 via-black/20 to-black/50 mix-blend-multiply pointer-events-none';
      case 'studio':
      default:
        return 'bg-gradient-to-b from-white/15 to-transparent mix-blend-soft-light pointer-events-none';
    }
  };

  const garmentPath = GARMENT_SILHOUETTE_PATHS[garment.id] || GARMENT_SILHOUETTE_PATHS.sari;

  return (
    <main className="flex-1 flex flex-col h-full bg-[#F5F2EB] relative overflow-hidden select-none">
      {/* Top Atelier Bar: View Angle, Mode, Lighting & Background */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:px-6 bg-[#FAF8F5]/90 border-b border-[#E8DFC8] backdrop-blur-xs z-20">
        
        {/* Left: Camera View Angles */}
        <div className="flex items-center gap-1 bg-[#EFE9DC] p-1 rounded-lg border border-[#DDD5C3]">
          <span className="text-[10px] uppercase font-bold text-[#8C7A5B] px-2 hidden sm:inline">
            Camera
          </span>
          {(['front', 'three_quarter', 'back', 'detail'] as ViewAngle[]).map((angle) => (
            <button
              key={angle}
              type="button"
              onClick={() => onViewAngleChange(angle)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer whitespace-nowrap ${
                viewAngle === angle
                  ? 'bg-white text-[#22201D] shadow-xs font-semibold'
                  : 'text-[#696152] hover:text-[#22201D]'
              }`}
            >
              {angle === 'front' && 'Front (0°)'}
              {angle === 'three_quarter' && '3/4 Perspective'}
              {angle === 'back' && 'Back Drape'}
              {angle === 'detail' && 'Macro Detail'}
            </button>
          ))}
        </div>

        {/* Center: View Modes (Photoreal / Lustre / Weave) */}
        <div className="flex items-center gap-1 bg-[#EFE9DC] p-1 rounded-lg border border-[#DDD5C3]">
          <span className="text-[10px] uppercase font-bold text-[#8C7A5B] px-2 hidden sm:inline">
            Render Mode
          </span>
          {(['photoreal', 'lustre', 'weave'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-white text-[#22201D] shadow-xs font-semibold'
                  : 'text-[#696152] hover:text-[#22201D]'
              }`}
            >
              {mode === 'photoreal' && 'Photoreal'}
              {mode === 'lustre' && 'Silk Lustre'}
              {mode === 'weave' && 'Thread Structure'}
            </button>
          ))}
        </div>

        {/* Right: Background Canvas Environment */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#7A7060] hidden md:inline">Salon:</span>
          <select
            value={backgroundTheme}
            onChange={(e) => onBackgroundThemeChange(e.target.value as any)}
            className="text-xs bg-[#EFE9DC] border border-[#DDD5C3] rounded-md px-2.5 py-1 text-[#22201D] font-medium focus:outline-none focus:border-[#B89355] cursor-pointer"
          >
            <option value="atelier_salon">Heritage Salon</option>
            <option value="minimal_studio">Limestone Minimalist</option>
            <option value="dark_velvet">Couture Obsidian</option>
          </select>
        </div>

      </div>

      {/* Main Mannequin Stage Container */}
      <div
        className={`relative flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden ${getBackgroundClass()} ${
          zoom > 1.05 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Subtle Architectural Atmosphere Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#96866E]/20 -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#96866E]/20 -translate-y-1/2" />
          <div className="absolute inset-8 border border-[#96866E]/15 rounded-2xl" />
        </div>

        {/* Dynamic Studio Lighting Ambient Overlay */}
        <div className={`absolute inset-0 ${getLightingOverlay()}`} />

        {/* Mannequin Frame - object-contain ensures ZERO cropping of head/neck, sleeves, stole, or hem */}
        <div
          className="relative max-h-full max-w-full aspect-[3/4] flex items-center justify-center"
          style={getTransformStyle()}
        >
          {!imageError ? (
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* 1. Photorealistic Atelier Canvas with Garment-Specific Masked Dye */}
              <canvas
                ref={canvasRef}
                className="max-h-full max-w-full object-contain drop-shadow-2xl select-none"
              />

              {/* 2. SVG Overlay: Motifs, Lustre, and Weave strictly clipped to garment silhouette */}
              <svg
                viewBox="0 0 1000 1333"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ objectFit: 'contain' }}
              >
                <defs>
                  {/* Garment Silhouette Clip Path */}
                  <clipPath id={`garment-clip-${garment.id}`}>
                    <path d={garmentPath} />
                  </clipPath>

                  {/* Motif Pattern */}
                  <pattern
                    id={`motif-pat-${garment.id}`}
                    width={patternSize}
                    height={patternSize}
                    patternUnits="userSpaceOnUse"
                    patternTransform={`rotate(${biasAngle})`}
                  >
                    <g
                      transform={`scale(${patternSize / 100})`}
                      style={{ color: color.id === 'ivory' ? '#B89355' : '#FFDF88' }}
                      dangerouslySetInnerHTML={{ __html: motif.svgIcon }}
                    />
                  </pattern>

                  {/* Weave grid pattern */}
                  <pattern id="weave-grid-pat" width="4" height="4" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="4" y2="0" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
                    <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* SVG Motif Repeat: Rendered ONLY inside the garment silhouette */}
                <path
                  d={garmentPath}
                  fill={`url(#motif-pat-${garment.id})`}
                  style={{
                    mixBlendMode: 'overlay',
                    opacity:
                      fabric.id === 'banarasi_brocade'
                        ? 0.65
                        : fabric.id === 'kanchipuram_silk'
                        ? 0.55
                        : 0.42,
                    maskImage:
                      projection === 'border_accent'
                        ? 'linear-gradient(to top, black 30%, transparent 70%)'
                        : projection === 'pallu_yoke'
                        ? 'linear-gradient(to bottom, black 45%, transparent 85%)'
                        : projection === 'cuff_lapel'
                        ? 'radial-gradient(circle at 50% 30%, black 40%, transparent 80%)'
                        : 'none',
                    WebkitMaskImage:
                      projection === 'border_accent'
                        ? 'linear-gradient(to top, black 30%, transparent 70%)'
                        : projection === 'pallu_yoke'
                        ? 'linear-gradient(to bottom, black 45%, transparent 85%)'
                        : projection === 'cuff_lapel'
                        ? 'radial-gradient(circle at 50% 30%, black 40%, transparent 80%)'
                        : 'none'
                  }}
                />

                {/* Silk Lustre Mode: Specular Sheen Shimmer strictly on garment fabric */}
                {viewMode === 'lustre' && (
                  <g clipPath={`url(#garment-clip-${garment.id})`} style={{ mixBlendMode: 'color-dodge' }}>
                    <path
                      d={garmentPath}
                      fill="url(#sheen-radial)"
                      opacity="0.6"
                      className="animate-pulse"
                    />
                    <radialGradient id="sheen-radial" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#E5C158" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#C49B37" stopOpacity="0" />
                    </radialGradient>
                  </g>
                )}

                {/* Weave Mode: High-Resolution Interlaced Yarn Grid strictly on garment fabric */}
                {viewMode === 'weave' && (
                  <g clipPath={`url(#garment-clip-${garment.id})`} style={{ mixBlendMode: 'overlay', opacity: 0.45 }}>
                    <path d={garmentPath} fill="url(#weave-grid-pat)" />
                  </g>
                )}
              </svg>

              {/* Interactive Craftsmanship Hotspots */}
              {zoom <= 1.2 && (
                <>
                  {/* Hotspot 1: Collar / Neckline & Hardware */}
                  <div
                    className="absolute top-[22%] left-[50%] -translate-x-1/2 z-30 cursor-pointer group"
                    onClick={() => setActiveHotspot(activeHotspot === 'collar' ? null : 'collar')}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/90 border border-[#B89355] text-[#8C7A5B] flex items-center justify-center shadow-md animate-pulse">
                      <Sparkles className="w-2.5 h-2.5" />
                    </div>
                    {activeHotspot === 'collar' && (
                      <div className="absolute left-6 top-0 w-52 p-3 bg-white/95 border border-[#B89355] rounded-lg shadow-xl text-left z-40">
                        <div className="text-[10px] uppercase font-bold text-[#8C7A5B]">
                          Hardware & Neckline
                        </div>
                        <div className="font-serif-luxury text-sm font-semibold text-[#24211D]">
                          {hardware.name}
                        </div>
                        <div className="text-[11px] text-[#6B6254] mt-0.5">
                          {hardware.finish}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hotspot 2: Chest / Pallu Weave Spec */}
                  <div
                    className="absolute top-[42%] left-[42%] z-30 cursor-pointer group"
                    onClick={() => setActiveHotspot(activeHotspot === 'pallu' ? null : 'pallu')}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/90 border border-[#B89355] text-[#8C7A5B] flex items-center justify-center shadow-md">
                      <Info className="w-2.5 h-2.5" />
                    </div>
                    {activeHotspot === 'pallu' && (
                      <div className="absolute left-6 top-0 w-60 p-3 bg-white/95 border border-[#B89355] rounded-lg shadow-xl text-left z-40">
                        <div className="text-[10px] uppercase font-bold text-[#8C7A5B]">
                          Weave Architecture
                        </div>
                        <div className="font-serif-luxury text-sm font-semibold text-[#24211D]">
                          {fabric.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#8C7A5B] mt-0.5">
                          {fabric.warpWeft}
                        </div>
                        <div className="text-[11px] text-[#6B6254] mt-1">
                          Motif: {motif.name} ({density} repeat)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hotspot 3: Hemline / Pleats */}
                  <div
                    className="absolute bottom-[18%] left-[55%] z-30 cursor-pointer group"
                    onClick={() => setActiveHotspot(activeHotspot === 'hem' ? null : 'hem')}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/90 border border-[#B89355] text-[#8C7A5B] flex items-center justify-center shadow-md">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    {activeHotspot === 'hem' && (
                      <div className="absolute right-6 bottom-0 w-52 p-3 bg-white/95 border border-[#B89355] rounded-lg shadow-xl text-left z-40">
                        <div className="text-[10px] uppercase font-bold text-[#8C7A5B]">
                          Border Korvai Seam
                        </div>
                        <div className="font-serif-luxury text-sm font-semibold text-[#24211D]">
                          {garment.detailFocusTitle}
                        </div>
                        <div className="text-[11px] text-[#6B6254] mt-0.5">
                          Interlocked three-shuttle selvedge construction with pure zari.
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Dedicated SVG Fallback Renderer for EACH garment (Never cross-fallback!) */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[#B89355]/40 rounded-xl bg-white/60">
              <div className="font-serif-luxury text-2xl font-bold text-[#24211D] mb-1">
                {garment.name}
              </div>
              <div className="text-xs text-[#8C7A5B] uppercase tracking-wider mb-4">
                Dedicated Atelier Silhouette Vector Fallback
              </div>
              
              {/* Silhouette SVG Specific to this exact garment */}
              <div className="w-48 h-72 text-[#615748] relative flex items-center justify-center">
                {garment.id === 'sari' && (
                  <svg viewBox="0 0 100 200" fill="currentColor" className="w-full h-full opacity-80" style={{ color: color.hex }}>
                    <ellipse cx="50" cy="20" rx="14" ry="10" />
                    <path d="M42 30 L58 30 L64 75 L36 75 Z" />
                    <path d="M36 75 L64 75 L78 185 L22 185 Z" />
                    <path d="M40 75 Q68 110 50 185" stroke="#B89355" strokeWidth="4" fill="none" />
                    <path d="M38 40 L82 130" stroke="#B89355" strokeWidth="3" />
                  </svg>
                )}
                {garment.id === 'sherwani' && (
                  <svg viewBox="0 0 100 200" fill="currentColor" className="w-full h-full opacity-80" style={{ color: color.hex }}>
                    <rect x="42" y="16" width="16" height="12" rx="4" />
                    <path d="M30 28 L70 28 L74 135 L26 135 Z" />
                    <path d="M38 135 L48 185 L52 185 L62 135" stroke="currentColor" strokeWidth="6" />
                    <line x1="50" y1="28" x2="50" y2="135" stroke="#B89355" strokeWidth="2" />
                    <path d="M68 35 Q80 75 75 140" stroke="#872C3E" strokeWidth="6" fill="none" />
                  </svg>
                )}
                {garment.id === 'kimono' && (
                  <svg viewBox="0 0 100 200" fill="currentColor" className="w-full h-full opacity-80" style={{ color: color.hex }}>
                    <polygon points="40,24 60,24 50,45" fill="#FAF8F5" />
                    <path d="M25 28 L75 28 L85 185 L15 185 Z" />
                    <rect x="25" y="80" width="50" height="25" fill="#B89355" />
                    <rect x="5" y="35" width="20" height="60" rx="3" />
                    <rect x="75" y="35" width="20" height="60" rx="3" />
                  </svg>
                )}
                {garment.id === 'qipao' && (
                  <svg viewBox="0 0 100 200" fill="currentColor" className="w-full h-full opacity-80" style={{ color: color.hex }}>
                    <path d="M44 20 L56 20 L58 32 L42 32 Z" />
                    <path d="M36 32 L64 32 C68 65 62 105 66 185 L34 185 C38 105 32 65 36 32 Z" />
                    <line x1="66" y1="135" x2="66" y2="185" stroke="#FAF8F5" strokeWidth="3" />
                  </svg>
                )}
                {garment.id === 'kaftan' && (
                  <svg viewBox="0 0 100 200" fill="currentColor" className="w-full h-full opacity-80" style={{ color: color.hex }}>
                    <polygon points="44,22 56,22 50,42" fill="#FAF8F5" />
                    <path d="M15 40 L85 40 L78 185 L22 185 Z" />
                    <line x1="50" y1="42" x2="50" y2="185" stroke="#B89355" strokeWidth="4" />
                  </svg>
                )}
                {garment.id === 'batik_shirt' && (
                  <svg viewBox="0 0 100 200" fill="currentColor" className="w-full h-full opacity-80" style={{ color: color.hex }}>
                    <polygon points="38,20 62,20 50,34" fill="#FAF8F5" />
                    <path d="M26 28 L74 28 L72 105 L28 105 Z" />
                    <path d="M34 105 L46 185 L54 185 L66 105" stroke="#3D3B39" strokeWidth="8" />
                    <line x1="50" y1="28" x2="50" y2="105" stroke="#FAF8F5" strokeWidth="2" />
                  </svg>
                )}
              </div>

              <div className="text-xs text-[#7A7060] mt-3 max-w-sm">
                Custom weave in {fabric.name} with {color.name} natural dye bath and {motif.name}.
              </div>
            </div>
          )}
        </div>

        {/* Floating Atelier Studio Controls (Bottom-Right of Canvas) */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
          <div className="flex items-center gap-1 bg-[#FAF8F5]/95 border border-[#DDD5C3] p-1.5 rounded-lg shadow-md backdrop-blur-xs">
            {/* Zoom Controls */}
            <button
              type="button"
              onClick={() => onZoomChange(Math.min(2.5, zoom + 0.15))}
              title="Zoom In"
              className="p-1.5 hover:bg-[#EFE9DC] text-[#423C32] rounded transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono tabular-nums text-[#7A7060] px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onZoomChange(Math.max(0.85, zoom - 0.15))}
              title="Zoom Out"
              className="p-1.5 hover:bg-[#EFE9DC] text-[#423C32] rounded transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <div className="w-[1px] h-4 bg-[#DDD5C3] mx-1" />

            {/* Reset View */}
            <button
              type="button"
              onClick={handleResetView}
              title="Reset View Framing"
              className="p-1.5 hover:bg-[#EFE9DC] text-[#423C32] rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Rotation Slider Pill */}
          <div className="flex items-center gap-2 bg-[#FAF8F5]/95 border border-[#DDD5C3] px-3 py-1.5 rounded-lg shadow-md backdrop-blur-xs text-xs text-[#544D42]">
            <Compass className="w-3.5 h-3.5 text-[#B89355]" />
            <input
              type="range"
              min="-45"
              max="45"
              value={rotation}
              onChange={(e) => onRotationChange(parseInt(e.target.value))}
              className="w-20 accent-[#B89355] cursor-pointer"
              title="Atelier Mannequin Rotation"
            />
            <span className="font-mono text-[10px] tabular-nums text-[#8C7A5B] w-6">
              {rotation}°
            </span>
          </div>
        </div>

        {/* Live Garment Spec Callout (Top-Left of Viewer) */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:block">
          <div className="p-3 bg-[#FAF8F5]/90 border border-[#DDD5C3] rounded-lg shadow-xs backdrop-blur-xs max-w-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7A5B]">
              Loom Specification
            </span>
            <div className="font-serif-luxury text-base font-bold text-[#24211D]">
              {garment.name}
            </div>
            <div className="text-[11px] text-[#696152] font-medium mt-0.5">
              {fabric.name} · {color.name}
            </div>
            <div className="text-[10px] text-[#918676] mt-1">
              Origin: {garment.origin}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};
