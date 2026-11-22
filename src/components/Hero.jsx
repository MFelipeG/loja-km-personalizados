import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Heart, Camera } from 'lucide-react';

export default function Hero({ onScrollToStudio, settings }) {
  // State for interactive mouse tilt on the hero fridge magnets
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15; // -7.5 to 7.5 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24 border-b border-atelier-200/60 bg-gradient-to-b from-atelier-50 via-atelier-100/40 to-atelier-50">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-light/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-atelier-200/70 border border-atelier-300/50 text-xs sm:text-sm font-semibold text-brand-leather">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Novidade Exclusiva: Bótons Quadrados com Borda Infinita</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark tracking-tight leading-[1.15]">
              Suas fotos favoritas com o <span className="text-brand italic font-normal">charme</span> e a durabilidade que merecem.
            </h1>

            <p className="text-base sm:text-lg text-atelier-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transformamos momentos inesquecíveis em lindos <strong>bótons ímãs quadrados</strong> de alta resolução. O acabamento com fundo borrado preserva toda a área útil da foto, garantindo que nenhum rosto ou detalhe seja cortado na prensa!
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-atelier-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-atelier-800">
                  Fundo Borrado 6,1cm (Sem Faixas Brancas)
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-atelier-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-atelier-800">
                  Super Ímã Forte (Não Escorrega)
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-atelier-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-atelier-800">
                  Produção em ~{settings?.productionDays || 3} dias úteis
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onScrollToStudio}
                className="w-full sm:w-auto px-8 py-4 bg-brand text-atelier-50 font-semibold text-base rounded-2xl shadow-tactile hover:bg-brand-dark transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Personalizar Meus Bótons</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#kits"
                className="w-full sm:w-auto px-6 py-4 bg-white/80 hover:bg-white text-atelier-800 font-semibold text-base rounded-2xl border border-atelier-300 shadow-sm transition-all text-center"
              >
                Ver Tabela de Kits & Valores
              </a>
            </div>

            {/* Sub-note */}
            <p className="text-xs text-atelier-500 flex items-center justify-center lg:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sem necessidade de cadastro. Fechamento direto e prático pelo WhatsApp.</span>
            </p>
          </div>

          {/* Right Column: Visual Fridge / Magnetic Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl bg-gradient-to-b from-[#FAF8F5] via-[#EFEBE4] to-[#E3DDD5] p-6 shadow-fridge border-4 border-white/80 flex flex-col justify-between overflow-hidden perspective-container cursor-pointer select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              title="Passe o mouse ou toque para inclinar o simulador realista!"
            >
              {/* Fridge texture lines & ambient shadow */}
              <div className="absolute inset-0 bg-[radial-gradient(#C5B6A8_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
              <div className="absolute top-3 right-4 px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-sm text-[11px] font-semibold text-atelier-700 shadow-xs flex items-center gap-1">
                <Camera className="w-3 h-3 text-brand" />
                <span>Simulador de Geladeira</span>
              </div>

              {/* Sample realistic magnets with 3D tilt */}
              <div
                className="my-auto grid grid-cols-2 gap-4 magnet-3d-card relative z-10"
                style={{
                  transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                }}
              >
                {/* Magnet 1: Sunset/Ocean */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-magnet border border-white/60 bg-white group hover:scale-105 transition-transform duration-200">
                  {/* Blurred bleed background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110"
                    style={{ backgroundImage: 'url(/assets/banner-km.jpg)' }}
                  />
                  {/* Sharp centered safe area */}
                  <div className="absolute inset-2.5 rounded-xl overflow-hidden border border-white/40 shadow-inner">
                    <img
                      src="/assets/banner-km.jpg"
                      alt="Exemplo Bóton Foto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Tactile gloss shine */}
                  <div className="absolute inset-0 magnet-gloss rounded-2xl" />
                  <div className="absolute bottom-1 right-2 text-[9px] font-bold text-white/90 drop-shadow">
                    6,1 x 6,1 cm
                  </div>
                </div>

                {/* Magnet 2: Logo KM Ateliê */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-magnet border border-white/60 bg-white group hover:scale-105 transition-transform duration-200">
                  {/* Blurred bleed background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110"
                    style={{ backgroundImage: 'url(/assets/logo-km.jpg)' }}
                  />
                  {/* Sharp centered safe area */}
                  <div className="absolute inset-2.5 rounded-xl overflow-hidden border border-white/40 shadow-inner">
                    <img
                      src="/assets/logo-km.jpg"
                      alt="Exemplo Bóton Foto 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Tactile gloss shine */}
                  <div className="absolute inset-0 magnet-gloss rounded-2xl" />
                  <div className="absolute bottom-1 right-2 text-[9px] font-bold text-white/90 drop-shadow">
                    Área Útil 5,0 cm
                  </div>
                </div>

                {/* Magnet 3: Momentos em Família */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-magnet border border-white/60 bg-white group hover:scale-105 transition-transform duration-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110"
                    style={{ backgroundImage: 'url(/assets/logo-km.jpg)' }}
                  />
                  <div className="absolute inset-2.5 rounded-xl overflow-hidden border border-white/40 shadow-inner bg-amber-50 flex items-center justify-center p-2 text-center">
                    <span className="font-serif italic text-xs text-brand-dark font-bold leading-tight">
                      Amor em cada detalhe ✨
                    </span>
                  </div>
                  <div className="absolute inset-0 magnet-gloss rounded-2xl" />
                </div>

                {/* Magnet 4: Mini Polaroid Badge */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-magnet border border-white/60 bg-white group hover:scale-105 transition-transform duration-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110"
                    style={{ backgroundImage: 'url(/assets/banner-km.jpg)' }}
                  />
                  <div className="absolute inset-2.5 rounded-xl overflow-hidden border border-white/40 shadow-inner">
                    <img
                      src="/assets/banner-km.jpg"
                      alt="Exemplo 4"
                      className="w-full h-full object-cover object-right"
                    />
                  </div>
                  <div className="absolute inset-0 magnet-gloss rounded-2xl" />
                </div>
              </div>

              {/* Bottom mini banner */}
              <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-white/60 text-center shadow-xs">
                <p className="text-xs font-semibold text-brand-dark flex items-center justify-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                  <span>Cores vivas, acabamento espelhado e ímã de alta aderência</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
