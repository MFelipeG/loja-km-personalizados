import React, { useState } from 'react';
import { X, Sparkles, Camera, ArrowRight, Layers, Sliders, Check, Move } from 'lucide-react';

export default function FridgeSimulatorModal({
  isOpen,
  onClose,
  items = [],
  onGoToStudio
}) {
  const [fridgeStyle, setFridgeStyle] = useState('inox'); // 'inox' | 'white' | 'dark'
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  // Mouse & Touch tilt handlers
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleTouchMove = (e) => {
    if (!e.touches || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((touch.clientY - rect.top) / rect.height - 0.5) * -18;
    setTilt({ x, y });
  };

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Default sample magnets if the user hasn't added photos yet
  const sampleMagnets = [
    { title: 'Família', src: '/assets/sample-family.jpg' },
    { title: 'Casal', src: '/assets/sample-couple.jpg' },
    { title: 'Pets', src: '/assets/sample-pet.jpg' },
    { title: 'Viagens', src: '/assets/sample-travel.jpg' }
  ];

  // If user has uploaded items, use them; otherwise use samples
  const displayItems = items.length > 0
    ? items.slice(0, 6).map((item, idx) => ({
        title: `Bóton ${idx + 1}`,
        src: item.previewUrl || item.src,
        blur: item.blur || 8
      }))
    : sampleMagnets;

  // Fridge styles
  const fridgeBackgrounds = {
    inox: 'bg-gradient-to-b from-[#E6EBF0] via-[#D6DCE3] to-[#BFC6CE] border-[#C0C7CE]',
    white: 'bg-gradient-to-b from-[#FFFFFF] via-[#F4F4F6] to-[#E9EAEC] border-[#E0E2E6]',
    dark: 'bg-gradient-to-b from-[#383C42] via-[#2A2E34] to-[#1E2126] border-[#444850] text-white'
  };

  const handleBackgrounds = {
    inox: 'bg-gradient-to-b from-[#C5CBD2] via-[#EAEFF5] to-[#B0B7BF] border-[#9BA2AB]',
    white: 'bg-gradient-to-b from-[#DFE1E5] via-[#FFFFFF] to-[#CED1D6] border-[#B8BCC2]',
    dark: 'bg-gradient-to-b from-[#50545C] via-[#757A84] to-[#3E4249] border-[#2A2C30]'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden my-4 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-atelier-50 border-b border-atelier-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand text-atelier-50 flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-brand-dark">
                  Simulador de Frigorífico 3D
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-3 h-3" />
                  Interativo
                </span>
              </div>
              <p className="text-xs text-atelier-500">
                Veja como os seus bótons ímãs quadrados (6,1 x 6,1 cm) ficam na porta do frigorífico!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-atelier-400 hover:text-atelier-700 hover:bg-atelier-200/60 rounded-full transition-colors cursor-pointer"
            title="Fechar simulador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Fridge Colors & Hint */}
        <div className="px-5 sm:px-6 py-2.5 bg-atelier-100/60 border-b border-atelier-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-atelier-700 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-brand" />
              <span>Cor do Frigorífico:</span>
            </span>
            <div className="inline-flex rounded-xl p-1 bg-white border border-atelier-200 shadow-2xs gap-1">
              <button
                type="button"
                onClick={() => setFridgeStyle('inox')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  fridgeStyle === 'inox'
                    ? 'bg-atelier-800 text-white shadow-xs'
                    : 'text-atelier-600 hover:bg-atelier-100'
                }`}
              >
                Inox Escovado
              </button>
              <button
                type="button"
                onClick={() => setFridgeStyle('white')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  fridgeStyle === 'white'
                    ? 'bg-atelier-800 text-white shadow-xs'
                    : 'text-atelier-600 hover:bg-atelier-100'
                }`}
              >
                Branco Glaciar
              </button>
              <button
                type="button"
                onClick={() => setFridgeStyle('dark')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  fridgeStyle === 'dark'
                    ? 'bg-atelier-800 text-white shadow-xs'
                    : 'text-atelier-600 hover:bg-atelier-100'
                }`}
              >
                Grafite / Black
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-atelier-500 text-[11px]">
            <Move className="w-3.5 h-3.5 text-brand" />
            <span>Passe o rato ou deslize o dedo para inclinar em 3D</span>
          </div>
        </div>

        {/* Main 3D Fridge Simulator Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-atelier-100/30">
          
          {/* THE 3D REFRIGERATOR DOOR */}
          <div
            className={`relative w-full max-w-xl aspect-[4/3] sm:aspect-[16/10] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 flex flex-col justify-between overflow-hidden perspective-container select-none cursor-grab active:cursor-grabbing transition-colors duration-300 ${fridgeBackgrounds[fridgeStyle]}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleLeave}
            onTouchStart={handleTouchMove}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleLeave}
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 2px 4px rgba(255,255,255,0.6)'
            }}
          >
            {/* Brushed metallic texture effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
            
            {/* Top Fridge Brand Display / Temperature */}
            <div className="relative z-10 flex items-center justify-between pb-2 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xs tracking-wider uppercase opacity-75">
                  KM Frigorífico Inteligente
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/10 text-[9px] font-mono font-bold">
                  4 °C • Eco
                </span>
              </div>
              <div className="text-[10px] font-bold opacity-60">
                Fixação Magnética Reforçada
              </div>
            </div>

            {/* Refrigerator Stainless Steel Handle on the Right Side */}
            <div
              className={`absolute right-3 sm:right-4 top-1/4 bottom-1/4 w-3.5 sm:w-4.5 rounded-full shadow-lg border ${handleBackgrounds[fridgeStyle]} z-20 pointer-events-none flex flex-col justify-between py-2`}
              style={{
                boxShadow: '4px 8px 15px rgba(0,0,0,0.25), inset 1px 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              <div className="w-full h-1 bg-black/20 rounded-full" />
              <div className="w-full h-1 bg-black/20 rounded-full" />
            </div>

            {/* THE PHOTO MAGNETS ON THE FRIDGE DOOR */}
            <div
              className="my-auto grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 magnet-3d-card relative z-10 pr-6 sm:pr-8 py-2"
              style={{
                transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {displayItems.map((magnet, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-magnet border border-white/80 bg-white group hover:scale-105 transition-transform duration-200"
                >
                  {/* Camada 1: Fundo Borrado 6,1 cm */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110"
                    style={{ backgroundImage: `url(${magnet.src})` }}
                  />

                  {/* Camada 2: Frente Nítida 5,0 cm */}
                  <div className="absolute inset-2 sm:inset-2.5 rounded-xl overflow-hidden border border-white/60 shadow-inner">
                    <img
                      src={magnet.src}
                      alt={magnet.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Película de Brilho Dinâmico no Frigorífico */}
                  <div
                    className="absolute inset-0 magnet-gloss rounded-2xl pointer-events-none"
                    style={{
                      transform: `translate(${tilt.x * 2}px, ${tilt.y * 2}px)`
                    }}
                  />

                  {/* Title / Badge */}
                  <div className="absolute bottom-1 right-2 text-[9px] font-bold text-white drop-shadow">
                    {magnet.title}
                  </div>
                </div>
              ))}
            </div>

            {/* Refrigerator Bottom Trim with Subtle Brand Note */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-black/10 text-[10px] opacity-75">
              <span>Bótons Ímãs Quadrados • 6,1 x 6,1 cm</span>
              <span className="font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Super Ímã Forte (Não Escorrega)
              </span>
            </div>

          </div>

          {/* Helper caption */}
          <p className="text-xs text-atelier-500 mt-4 text-center max-w-lg">
            {items.length > 0 ? (
              <span className="text-emerald-700 font-semibold">
                ✓ A exibir {items.length} {items.length === 1 ? 'foto enviada por si' : 'fotos enviadas por si'} neste frigorífico interativo!
              </span>
            ) : (
              <span>
                * A exibir fotos de demonstração. Pode personalizar os bótons com as suas próprias fotografias de família, viagens ou pets!
              </span>
            )}
          </p>

        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-4 bg-atelier-50 border-t border-atelier-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-atelier-600 text-center sm:text-left">
            <span>Impressão fotográfica brilhante com tecnologia de fundo borrado sem cortes.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-atelier-300 text-atelier-700 hover:bg-atelier-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={onGoToStudio}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-dark text-atelier-50 text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{items.length > 0 ? 'Ajustar Minhas Fotos' : 'Personalizar as Minhas Fotos'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
