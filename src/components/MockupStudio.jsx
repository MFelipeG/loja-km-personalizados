import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  ZoomIn,
  Move,
  Trash2,
  Copy,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  Layers,
  RotateCw,
  Gift
} from 'lucide-react';
import { saveDraftPhotos, getDraftPhotos } from '../utils/storage';

export default function MockupStudio({
  items,
  setItems,
  targetKit,
  onOpenCheckout,
  settings,
  onOpenFridgeSimulator
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showSafeGuide, setShowSafeGuide] = useState(true);
  const fileInputRef = useRef(null);

  // Tilt coordinates for the realistic 3D simulator
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Load draft photos from IndexedDB on initial mount if available
  useEffect(() => {
    async function loadDraft() {
      if (items.length === 0) {
        const cached = await getDraftPhotos();
        if (cached && cached.length > 0) {
          setItems(cached);
        }
      }
    }
    loadDraft();
  }, []);

  // Save changes to IndexedDB draft cache
  useEffect(() => {
    if (items.length > 0) {
      saveDraftPhotos(items);
    }
  }, [items]);

  const selectedItem = items[selectedIndex] || items[0] || null;

  // Process uploaded files with quality check
  const handleFiles = (files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        alert(`Ficheiro "${file.name}" não aceite. Apenas imagens JPG, PNG ou WEBP são permitidas.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target.result;
        const img = new Image();
        img.onload = () => {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;
          const minDim = Math.min(width, height);

          // Quality check: >= 600px is excellent, < 600px is low warning
          const isGood = minDim >= 600;
          const qualityBadge = isGood ? 'excellent' : 'warning';
          const qualityText = isGood
            ? 'Qualidade Excelente'
            : 'Resolução baixa — pode perder nitidez';

          const itemObj = {
            id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            src,
            imageUrl: src,
            previewUrl: src,
            width,
            height,
            qualityBadge,
            qualityText,
            zoom: 1.0,
            panX: 0,
            panY: 0,
            blur: 8,
            rotation: 0
          };

          setItems((prev) => [...prev, itemObj]);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Update attributes of current selected item
  const updateSelected = (updates) => {
    setItems((prev) =>
      prev.map((it, idx) => (idx === selectedIndex ? { ...it, ...updates } : it))
    );
  };

  // Duplicate current photo
  const handleDuplicate = () => {
    if (!selectedItem) return;
    const clone = {
      ...selectedItem,
      id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };
    setItems((prev) => [...prev, clone]);
    setSelectedIndex(items.length);
  };

  // Delete current photo
  const handleDelete = (indexToDelete) => {
    setItems((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    if (selectedIndex >= items.length - 1) {
      setSelectedIndex(Math.max(0, items.length - 2));
    }
  };

  // Kit calculation & progress
  const targetUnits = targetKit ? targetKit.units : 6;
  const currentCount = items.length;
  const progressPercent = Math.min(100, Math.round((currentCount / targetUnits) * 100));
  const remainingForKit = Math.max(0, targetUnits - currentCount);

  // 3D Tilt calculation
  const handleSimMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -22;
    setTilt({ x, y });
  };

  const handleSimTouchMove = (e) => {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = ((touch.clientY - rect.top) / rect.height - 0.5) * -22;
    setTilt({ x, y });
  };

  const handleSimMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section id="estudio" className="py-16 md:py-24 bg-atelier-50 border-b border-atelier-200/80 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estúdio Web-to-Print Interativo</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark">
            Personalize os Seus Bótons Ímãs
          </h2>
          <p className="text-atelier-600 text-sm sm:text-base">
            Envie as suas fotografias, verifique a resolução automática e veja o resultado realista em 3D antes de encomendar.
          </p>
        </div>

        {/* Progress & Target Banner */}
        <div className="mb-10 max-w-3xl mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-atelier-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-atelier-500">
                Progresso da Encomenda (Mínimo: 2 unidades)
              </span>
              <h4 className="text-base font-bold text-brand-dark">
                {currentCount} {currentCount === 1 ? 'foto adicionada' : 'fotos adicionadas'}
                {targetKit ? ` • Meta: ${targetKit.name}` : ' • Meta: Promoção 5+1 Grátis (6 un)'}
              </h4>
            </div>
            <div>
              {currentCount < 2 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                  Adicione pelo menos 2 fotos (mínimo - 11 €)
                </span>
              ) : currentCount >= 5 && currentCount <= 6 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                  <Gift className="w-3.5 h-3.5 text-rose-600" />
                  Promoção 5 + 1 de Brinde Ativa! (25 €)
                </span>
              ) : currentCount >= 25 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Desconto de Eventos Ativo!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Quantidade Pronta!
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-atelier-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                currentCount >= 5
                  ? 'bg-emerald-600'
                  : 'bg-gradient-to-r from-brand-light to-brand'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, progressPercent))}%` }}
            />
          </div>

          {/* Quick-choice chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-atelier-100 text-xs text-atelier-600">
            <span className="font-semibold text-atelier-800">Sugestões rápidas:</span>
            <button
              onClick={() => setItems((p) => p.slice(0, 2))}
              className="px-2.5 py-1 rounded-lg bg-atelier-100 hover:bg-atelier-200 text-atelier-700 cursor-pointer font-medium"
            >
              2 Bótons (11 €)
            </button>
            <button
              onClick={() => {}}
              className="px-2.5 py-1 rounded-lg bg-brand/10 text-brand font-bold cursor-pointer"
            >
              5 + 1 Brinde (25 €)
            </button>
            <button
              onClick={() => {}}
              className="px-2.5 py-1 rounded-lg bg-amber-100/70 hover:bg-amber-100 text-amber-900 font-semibold cursor-pointer"
            >
              Kit Eventos 25 un. (112,50 €)
            </button>
          </div>
        </div>

        {/* Main Studio Area: Two Columns (Interactive Editor & 3D Realistic Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload Box, Thumbnails & Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Upload Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-brand bg-brand-cream/60 ring-4 ring-brand/10'
                  : 'border-atelier-300 bg-white/80 hover:bg-white hover:border-brand/40 shadow-xs'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-atelier-100 flex items-center justify-center text-brand">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-dark">
                Clique ou arraste as suas fotografias aqui
              </h3>
              <p className="text-xs text-atelier-600 mt-1 max-w-sm mx-auto">
                Selecione várias fotos de uma só vez do telemóvel ou computador (JPG, PNG ou WEBP).
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verificação de resolução automática</span>
              </div>
            </div>

            {/* Thumbnail Carousel / Grid */}
            {items.length > 0 && (
              <div className="bg-white rounded-3xl p-4 border border-atelier-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-atelier-700 px-1">
                  <span>Fotos na Encomenda ({items.length})</span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-brand hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    + Adicionar Mais Fotos
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin">
                  {items.map((it, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={it.id || idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                          isSelected
                            ? 'border-brand ring-2 ring-brand/20 scale-105 shadow-sm'
                            : 'border-atelier-200 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={it.previewUrl || it.src}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span
                          className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white ${
                            it.qualityBadge === 'excellent' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Editing Controls for Currently Selected Photo */}
            {selectedItem && (
              <div className="bg-white rounded-3xl p-6 border border-atelier-200 shadow-sm space-y-6">
                
                {/* Header: Photo Number & Quality Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-atelier-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-brand text-atelier-50 text-xs font-bold flex items-center justify-center">
                      #{selectedIndex + 1}
                    </span>
                    <span className="font-serif font-bold text-base text-brand-dark truncate max-w-[180px]">
                      {selectedItem.name || `Foto ${selectedIndex + 1}`}
                    </span>
                  </div>

                  {/* Quality Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      selectedItem.qualityBadge === 'excellent'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {selectedItem.qualityBadge === 'excellent' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>{selectedItem.qualityText}</span>
                    <span className="text-[10px] text-atelier-500 font-normal">
                      ({selectedItem.width}x{selectedItem.height}px)
                    </span>
                  </div>
                </div>

                {/* Adjusters: Zoom, Pan X/Y, Blur Intensity */}
                <div className="space-y-4 text-xs">
                  
                  {/* Zoom Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-atelier-700 flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5 text-brand" />
                        <span>Enquadramento / Zoom</span>
                      </span>
                      <span className="text-atelier-500 font-mono">
                        {Math.round((selectedItem.zoom || 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="2.5"
                      step="0.05"
                      value={selectedItem.zoom || 1.0}
                      onChange={(e) => updateSelected({ zoom: parseFloat(e.target.value) })}
                      className="w-full accent-brand cursor-pointer"
                    />
                  </div>

                  {/* Pan Sliders (X and Y) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-atelier-700">Mover Horizontal</span>
                        <span className="text-atelier-500 font-mono">{selectedItem.panX || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="-40"
                        max="40"
                        step="1"
                        value={selectedItem.panX || 0}
                        onChange={(e) => updateSelected({ panX: parseInt(e.target.value, 10) })}
                        className="w-full accent-brand cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-atelier-700">Mover Vertical</span>
                        <span className="text-atelier-500 font-mono">{selectedItem.panY || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="-40"
                        max="40"
                        step="1"
                        value={selectedItem.panY || 0}
                        onChange={(e) => updateSelected({ panY: parseInt(e.target.value, 10) })}
                        className="w-full accent-brand cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Blur Intensity Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-atelier-700 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-brand" />
                        <span>Nível do Fundo Borrado (Bordas de Dobra)</span>
                      </span>
                      <span className="text-atelier-500 font-mono">
                        {selectedItem.blur || 8}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="20"
                      step="1"
                      value={selectedItem.blur || 8}
                      onChange={(e) => updateSelected({ blur: parseInt(e.target.value, 10) })}
                      className="w-full accent-brand cursor-pointer"
                    />
                  </div>

                  {/* Actions: Duplicate, Delete, Reset */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-atelier-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDuplicate}
                        className="px-3 py-1.5 rounded-lg bg-atelier-100 hover:bg-atelier-200 text-atelier-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Duplicar foto para fazer mais de uma unidade igual"
                      >
                        <Copy className="w-3.5 h-3.5 text-brand" />
                        <span>Duplicar Foto</span>
                      </button>
                      <button
                        onClick={() => updateSelected({ zoom: 1.0, panX: 0, panY: 0, blur: 8 })}
                        className="px-3 py-1.5 rounded-lg text-atelier-600 hover:bg-atelier-100 transition-colors cursor-pointer"
                      >
                        Resetar Enquadramento
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(selectedIndex)}
                      className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir Foto</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Right Column: Realistic 3D Tilt Simulator ("Efeito Uau") */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-atelier-200 shadow-tactile space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-atelier-100 gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-brand-dark flex items-center gap-1.5">
                    <span>Simulador no Frigorífico 3D</span>
                  </h3>
                  <p className="text-xs text-atelier-500">
                    Veja o seu bóton fixado na porta do frigorífico em 3D
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowSafeGuide(!showSafeGuide)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
                      showSafeGuide
                        ? 'bg-brand/10 text-brand border-brand/20'
                        : 'bg-atelier-100 text-atelier-600 border-atelier-200'
                    }`}
                    title="Exibir ou ocultar linhas de dobra de 5,0 cm"
                  >
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">{showSafeGuide ? 'Linhas Ativas' : 'Ocultar Linhas'}</span>
                  </button>

                  {onOpenFridgeSimulator && (
                    <button
                      type="button"
                      onClick={onOpenFridgeSimulator}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/80 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      title="Ver todos os bótons juntos na porta do frigorífico em 3D"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Ver Frigorífico</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Realistic Fridge Door Container with Tilt */}
              <div
                className="relative w-full aspect-square rounded-3xl bg-gradient-to-b from-[#EAEFF4] via-[#DCE2E9] to-[#C7CFD8] p-8 shadow-fridge border-4 border-[#C1C9D2] flex items-center justify-center overflow-hidden perspective-container select-none cursor-grab active:cursor-grabbing"
                onMouseMove={handleSimMouseMove}
                onMouseLeave={handleSimMouseLeave}
                onTouchStart={handleSimTouchMove}
                onTouchMove={handleSimTouchMove}
                onTouchEnd={handleSimMouseLeave}
              >
                {/* Brushed texture & subtle grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:14px_14px] opacity-5 pointer-events-none" />

                {/* Top Fridge Door Label */}
                <div className="absolute top-2.5 left-3.5 flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-atelier-700/80 z-20 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                  <span>Porta do Frigorífico • KM</span>
                </div>

                {/* Fridge Handle Indicator on the Right Side */}
                <div
                  className="absolute right-2.5 top-10 bottom-10 w-2.5 sm:w-3 rounded-full bg-gradient-to-b from-[#B8BFC8] via-[#E2E7ED] to-[#AAB2BC] border border-[#8F97A1] shadow-md z-20 pointer-events-none"
                  style={{
                    boxShadow: '3px 6px 10px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.7)'
                  }}
                />

                {selectedItem ? (
                  /* 3D Magnet Card */
                  <div
                    className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-magnet border border-white/80 magnet-3d-card"
                    style={{
                      transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                    }}
                  >
                    {/* CAMADA 1: Fundo Borrado Total (6,1 cm x 6,1 cm) */}
                    <div
                      className="absolute inset-0 bg-cover bg-center scale-110"
                      style={{
                        backgroundImage: `url(${selectedItem.previewUrl || selectedItem.src})`,
                        filter: `blur(${selectedItem.blur || 8}px)`
                      }}
                    />

                    {/* CAMADA 2: Frente Nítida Área Útil (5,0 cm x 5,0 cm) */}
                    <div className="absolute inset-6 rounded-2xl overflow-hidden border border-white/40 shadow-inner bg-black/10">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-75"
                        style={{
                          backgroundImage: `url(${selectedItem.previewUrl || selectedItem.src})`,
                          transform: `scale(${selectedItem.zoom || 1}) translate(${selectedItem.panX || 0}%, ${selectedItem.panY || 0}%)`
                        }}
                      />
                    </div>

                    {/* Optional Safe Area Outline Indicator */}
                    {showSafeGuide && (
                      <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-white/80 pointer-events-none flex items-end justify-end p-2">
                        <span className="text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-xs">
                          Área Visível 5,0 cm
                        </span>
                      </div>
                    )}

                    {/* Realistic Gloss Lamination Sheen */}
                    <div
                      className="absolute inset-0 magnet-gloss rounded-3xl"
                      style={{
                        transform: `translate(${tilt.x * 2}px, ${tilt.y * 2}px)`
                      }}
                    />

                    {/* Dimensions Pill */}
                    <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      6,1 x 6,1 cm (Total)
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <ImageIcon className="w-12 h-12 text-atelier-400 mx-auto" />
                    <p className="text-sm font-semibold text-atelier-700">
                      Nenhuma foto enviada ainda
                    </p>
                    <p className="text-xs text-atelier-500">
                      Faça o upload ao lado para ver o seu bóton quadrado neste simulador realista.
                    </p>
                  </div>
                )}
              </div>

              {/* Explanatory Technical Note */}
              <div className="bg-atelier-50 rounded-2xl p-4 border border-atelier-200 text-xs text-atelier-700 space-y-1.5">
                <div className="font-bold text-brand-dark flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-brand" />
                  <span>Tecnologia de 2 Camadas:</span>
                </div>
                <p className="leading-relaxed text-atelier-600">
                  • <strong>6,1 cm externo:</strong> O fundo borrado preenche toda a margem de dobra da matriz metálica, sem criar bordas brancas.
                </p>
                <p className="leading-relaxed text-atelier-600">
                  • <strong>5,0 cm interno:</strong> A sua foto principal permanece 100% nítida e segura, sem cortes de rostos.
                </p>
              </div>

              {/* Advance to Checkout CTA Button */}
              <button
                disabled={items.length < 2}
                onClick={onOpenCheckout}
                className="w-full py-4 px-6 rounded-2xl bg-brand hover:bg-brand-dark disabled:bg-atelier-300 disabled:cursor-not-allowed text-atelier-50 font-bold text-base shadow-tactile transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Avançar para a Sacola ({items.length} {items.length === 1 ? 'bóton' : 'bótons'})</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {items.length < 2 && (
                <p className="text-[11px] text-center text-amber-700 font-medium">
                  * Pedido mínimo de 2 unidades para avançar.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
