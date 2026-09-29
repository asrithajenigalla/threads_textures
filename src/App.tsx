import React, { useState, useEffect, useMemo } from 'react';
import {
  GarmentId,
  FabricId,
  HardwareId,
  LightingPreset,
  ViewAngle,
  ViewMode,
  GridDensity,
  ProjectionType,
  AtelierDesignState,
  Motif
} from './types';
import { GARMENTS } from './data/garments';
import { FABRICS } from './data/fabrics';
import { COLORS } from './data/colors';
import { MOTIFS, HARDWARE_LIST } from './data/motifs';

import { Header } from './components/Header';
import { GarmentSelector } from './components/GarmentSelector';
import { PatternPrintPanel } from './components/PatternPrintPanel';
import { InteractiveAtelierViewer } from './components/InteractiveAtelierViewer';
import { WeaveColorPanel } from './components/WeaveColorPanel';
import { CurrentDesignBar } from './components/CurrentDesignBar';

import { CraftsmanModal } from './components/CraftsmanModal';
import { SwatchKitModal } from './components/SwatchKitModal';
import { ArchivesModal } from './components/ArchivesModal';
import { SaveLoadModal } from './components/SaveLoadModal';
import { SpecModal } from './components/SpecModal';

const FAVORITES_STORAGE_KEY = 'threads_textures_favorites_v1';

export default function App() {
  // Master Design State
  const [designState, setDesignState] = useState<AtelierDesignState>({
    garmentId: 'sari',
    fabricId: 'kanchipuram_silk',
    colorId: 'crimson',
    motifId: 'temple_gopuram',
    motifScale: 1.0,
    biasAngle: 0,
    density: 'balanced',
    projection: 'all_over',
    hardwareId: 'antique_gold',
    lighting: 'studio',
    viewAngle: 'front',
    viewMode: 'photoreal',
    zoom: 1.0,
    rotation: 0,
    panX: 0,
    panY: 0,
    backgroundTheme: 'atelier_salon'
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals
  const [isArchivesOpen, setIsArchivesOpen] = useState(false);
  const [isCraftsmanOpen, setIsCraftsmanOpen] = useState(false);
  const [isSwatchKitOpen, setIsSwatchKitOpen] = useState(false);
  const [isSavePresetOpen, setIsSavePresetOpen] = useState(false);
  const [isLoadPresetOpen, setIsLoadPresetOpen] = useState(false);
  const [isSpecOpen, setIsSpecOpen] = useState(false);

  // Custom added motifs
  const [customMotifs, setCustomMotifs] = useState<Motif[]>([]);

  // Initialize favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleToggleFavorite = () => {
    const key = `${designState.garmentId}_${designState.fabricId}_${designState.colorId}`;
    setFavorites((prev) => {
      const next = prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  const isCurrentFavorite = useMemo(() => {
    const key = `${designState.garmentId}_${designState.fabricId}_${designState.colorId}`;
    return favorites.includes(key);
  }, [designState, favorites]);

  // Active Data Objects
  const currentGarment = useMemo(() => {
    return GARMENTS.find((g) => g.id === designState.garmentId) || GARMENTS[0];
  }, [designState.garmentId]);

  const currentFabric = useMemo(() => {
    return FABRICS.find((f) => f.id === designState.fabricId) || FABRICS[0];
  }, [designState.fabricId]);

  const currentColor = useMemo(() => {
    return COLORS.find((c) => c.id === designState.colorId) || COLORS[0];
  }, [designState.colorId]);

  const currentMotif = useMemo(() => {
    const all = [...MOTIFS, ...customMotifs];
    return all.find((m) => m.id === designState.motifId) || all[0];
  }, [designState.motifId, customMotifs]);

  const currentHardware = useMemo(() => {
    return HARDWARE_LIST.find((h) => h.id === designState.hardwareId) || HARDWARE_LIST[0];
  }, [designState.hardwareId]);

  // Handlers
  const handleSelectGarment = (id: GarmentId) => {
    const garment = GARMENTS.find((g) => g.id === id);
    setDesignState((prev) => ({
      ...prev,
      garmentId: id,
      // Auto-adapt recommended weave if appropriate
      fabricId: garment?.recommendedWeaves[0] || prev.fabricId,
      // Reset camera zoom/pan for new silhouette
      zoom: 1.0,
      rotation: 0,
      panX: 0,
      panY: 0
    }));
  };

  const handleAddCustomMotif = (newMotif: Motif) => {
    setCustomMotifs((prev) => [newMotif, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#24211D]">
      {/* Top Header */}
      <Header
        currentLighting={designState.lighting}
        onLightingChange={(lighting) => setDesignState((prev) => ({ ...prev, lighting }))}
        onOpenArchives={() => setIsArchivesOpen(true)}
        onOpenCraftsman={() => setIsCraftsmanOpen(true)}
        onOpenSwatchKit={() => setIsSwatchKitOpen(true)}
        onOpenPresets={() => setIsLoadPresetOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={favorites.length}
      />

      {/* Garment Selector Bar (6 Master Silhouettes) */}
      <GarmentSelector
        selectedGarmentId={designState.garmentId}
        onSelectGarment={handleSelectGarment}
      />

      {/* Main Studio 3-Part Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1720px] mx-auto overflow-hidden min-h-[620px] lg:min-h-[700px]">
        {/* LEFT: Pattern & Print */}
        <PatternPrintPanel
          selectedMotifId={designState.motifId}
          onSelectMotif={(motifId) => setDesignState((prev) => ({ ...prev, motifId }))}
          motifScale={designState.motifScale}
          onScaleChange={(motifScale) => setDesignState((prev) => ({ ...prev, motifScale }))}
          biasAngle={designState.biasAngle}
          onAngleChange={(biasAngle) => setDesignState((prev) => ({ ...prev, biasAngle }))}
          density={designState.density}
          onDensityChange={(density) => setDesignState((prev) => ({ ...prev, density }))}
          projection={designState.projection}
          onProjectionChange={(projection) => setDesignState((prev) => ({ ...prev, projection }))}
          searchFilter={searchQuery}
          onAddCustomMotif={handleAddCustomMotif}
        />

        {/* CENTER: Interactive Atelier Viewer */}
        <InteractiveAtelierViewer
          garment={currentGarment}
          fabric={currentFabric}
          color={currentColor}
          motif={currentMotif}
          hardware={currentHardware}
          motifScale={designState.motifScale}
          biasAngle={designState.biasAngle}
          density={designState.density}
          projection={designState.projection}
          lighting={designState.lighting}
          onLightingChange={(lighting) => setDesignState((prev) => ({ ...prev, lighting }))}
          viewAngle={designState.viewAngle}
          onViewAngleChange={(viewAngle) => setDesignState((prev) => ({ ...prev, viewAngle }))}
          viewMode={designState.viewMode}
          onViewModeChange={(viewMode) => setDesignState((prev) => ({ ...prev, viewMode }))}
          zoom={designState.zoom}
          onZoomChange={(zoom) => setDesignState((prev) => ({ ...prev, zoom }))}
          rotation={designState.rotation}
          onRotationChange={(rotation) => setDesignState((prev) => ({ ...prev, rotation }))}
          backgroundTheme={designState.backgroundTheme}
          onBackgroundThemeChange={(backgroundTheme) => setDesignState((prev) => ({ ...prev, backgroundTheme }))}
        />

        {/* RIGHT: Weave & Color */}
        <WeaveColorPanel
          selectedFabricId={designState.fabricId}
          onSelectFabric={(fabricId) => setDesignState((prev) => ({ ...prev, fabricId }))}
          selectedColorId={designState.colorId}
          onSelectColor={(colorId) => setDesignState((prev) => ({ ...prev, colorId }))}
          selectedHardwareId={designState.hardwareId}
          onSelectHardware={(hardwareId) => setDesignState((prev) => ({ ...prev, hardwareId }))}
          onOpenCraftsmanModal={() => setIsCraftsmanOpen(true)}
          searchFilter={searchQuery}
        />
      </div>

      {/* Bottom Current Design Bar */}
      <CurrentDesignBar
        state={designState}
        garment={currentGarment}
        fabric={currentFabric}
        color={currentColor}
        motif={currentMotif}
        hardware={currentHardware}
        isFavorite={isCurrentFavorite}
        onToggleFavorite={handleToggleFavorite}
        onOpenSavePreset={() => setIsSavePresetOpen(true)}
        onOpenLoadPreset={() => setIsLoadPresetOpen(true)}
        onOpenExportSpec={() => setIsSpecOpen(true)}
      />

      {/* Modals & Drawers */}
      <CraftsmanModal
        isOpen={isCraftsmanOpen}
        onClose={() => setIsCraftsmanOpen(false)}
        state={designState}
        garment={currentGarment}
        fabric={currentFabric}
        color={currentColor}
      />

      <SwatchKitModal
        isOpen={isSwatchKitOpen}
        onClose={() => setIsSwatchKitOpen(false)}
        currentColor={currentColor}
      />

      <ArchivesModal
        isOpen={isArchivesOpen}
        onClose={() => setIsArchivesOpen(false)}
      />

      <SaveLoadModal
        isOpen={isSavePresetOpen || isLoadPresetOpen}
        onClose={() => {
          setIsSavePresetOpen(false);
          setIsLoadPresetOpen(false);
        }}
        currentState={designState}
        onLoadState={(newState) => setDesignState(newState)}
        mode={isSavePresetOpen ? 'save' : 'load'}
      />

      <SpecModal
        isOpen={isSpecOpen}
        onClose={() => setIsSpecOpen(false)}
        state={designState}
        garment={currentGarment}
        fabric={currentFabric}
        color={currentColor}
        motif={currentMotif}
        hardware={currentHardware}
      />
    </div>
  );
}
