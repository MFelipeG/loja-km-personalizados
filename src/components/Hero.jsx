import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Heart, Camera } from 'lucide-react';

export default function Hero({ onScrollToStudio, settings }) {
  // State for interactive mouse tilt on the hero fridge magnets
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-atelier-200/80 border border-atelier-300/60 text-xs sm:text-sm font-semibold text-brand-leather">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Promoção de Inauguração: 5 Bótons por 25 € + 1 de Brinde! 🇵🇹</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark tracking-tight leading-[1.15]">
              As suas memórias mais queridas em <span className="text-brand italic font-normal">bótons ímãs</span> de alta qualidade.
            </h1>

            <p className="text-base sm:text-lg text-atelier-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Eternizamos os seus momentos em <strong>bótons ímãs quadrados (6,1 x 6,1 cm)</strong> com laminação brilhante e fixação reforçada para frigorífico. A nossa tecnologia com fundo borrado preserva toda a área útil da foto, garantindo que nenhum detalhe seja cortado na prensa!
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-atelier-200 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-atelier-800">
                  Fundo Borrado 6,1 cm (Sem faixas brancas)
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-atelier-200 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-atelier-800">
                  Super Ímã Forte (Não desliza)
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-atelier-200 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-atelier-800">
                  Envio CTT Rápido para Portugal
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
                className="w-full sm:w-auto px-6 py-4 bg-white/90 hover:bg-white text-atelier-800 font-semibold text-base rounded-2xl border border-atelier-300 shadow-xs transition-all text-center"
              >
                Ver Promoção de Inauguração
              </a>
            </div>

            {/* Sub-note */}
            <p className="text-xs text-atelier-500 flex items-center justify-center lg:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sem necessidade de registo ou login. Fechamento seguro pelo WhatsApp (+351 965 639 401).</span>
            </p>
          </div>

          {/* Right Column: Visual Fridge / Magnetic Showcase with REAL PHOTO MAGNETS */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl bg-gradient-to-b from-[#FAF8F5] via-[#EFEBE4] to-[#E2DAD0] p-6 shadow-fridge border-4 border-white/90 flex flex-col justify-between overflow-hidden perspective-container cursor-pointer select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              title="Passe o rato ou toque para inclinar o simulador realista em 3D!"
            >
              {/* Fridge texture lines & ambient shadow */}
              <div className="absolute inset-0 bg-[radial-gradient(#C5B6A8_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
              
              <div className="absolute top-3.5 right-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[11px] font-semibold text-atelier-800 shadow-xs flex items-center gap-1.5 z-20">
                <Camera className="w-3.5 h-3.5 text-brand" />
                <span>Simulador de Frigorífico 3D</span>
              </div>

              {/* 4 REALISTIC SAMPLE MAGNETS (Fitted properly in the square without text cut-offs) */}
              <div
                className="my-auto grid grid-cols-2 gap-4 magnet-3d-card relative z-10 pt-4"
                style={{
                  transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                }}
              >
                {/* Magnet 1: Family Portrait */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-magnet border border-white/70 bg-white group hover:scale-105 transition-transform duration-200">
                  {/* Blurred bleed background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110"
                    style={{ backgroundImage: 'url(/assets/sample-family.jpg)' }}
                  />
                  {/* Centered sharp safe area */}
                  <div className="absolute inset-2.5 rounded-xl overflow-hidden border border-white/50 shadow-inner">
                    <img
                      src="/assets/sample-family.jpg"
                      alt="Família"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Gloss sheen */}
                  <div className="absolute inset-0 magnet-gloss rounded-2xl pointer-events-none" />
                  <div className="absolute bottom-1 right-2 text-[9px] font-bold text-white drop-shadow">
                    Família
                  </div>
                </div>

                {/* Magnet 2: Couple Portrait */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-magnet border border-white/70 bg-white group hover:scale-105 transition-transform duration-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110"
                    style={{ backgroundImage: 'url(/assets/sample-couple.jpg)' }}
                  />
                  <div className="absolute inset-2.5 rounded-xl overflow-hidden border border-white/50 shadow-inner">
                    <img
                      src="/assets/sample-couple.jpg"
                      alt="Casal"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 magnet-gloss rounded-2xl pointer-events-none" />
                  <div className="absolute bottom-1 right-2 text-[9px] font-bold text-white drop-shadow">
                    Amor
                  </div>
                </div>

                {/* Magnet 3: Cute Pet */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-magnet border border-white/70 bg-white group hover:scale-105 transition-transform duration-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110"
                    style={{ backgroundImage: 'url(/assets/sample-pet.jpg)' }}
                  />
                  <div className="absolute inset-2.5 rounded-xl overflow-hidden border border-white/50 shadow-inner">
                    <img
                      src="/assets/sample-pet.jpg"
                      alt="Pet Fofo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 magnet-gloss rounded-2xl pointer-events-none" />
                  <div className="absolute bottom-1 right-2 text-[9px] font-bold text-white drop-shadow">
                    Pets
                  </div>
                </div>

                {/* Magnet 4: Travel Memory */}
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-magnet border border-white/70 bg-white group hover:scale-105 transition-transform duration-200">
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-110"
                    style={{ backgroundImage: 'url(/assets/sample-travel.jpg)' }}
                  />
                  <div className="absolute inset-2.5 rounded-xl overflow-hidden border border-white/50 shadow-inner">
                    <img
                      src="/assets/sample-travel.jpg"
                      alt="Viagens"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 magnet-gloss rounded-2xl pointer-events-none" />
                  <div className="absolute bottom-1 right-2 text-[9px] font-bold text-white drop-shadow">
                    Viagens
                  </div>
                </div>
              </div>

              {/* Bottom mini banner */}
              <div className="relative z-10 bg-white/85 backdrop-blur-md rounded-2xl p-3 border border-white/70 text-center shadow-xs">
                <p className="text-xs font-semibold text-brand-dark flex items-center justify-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                  <span>Película brilhante, cantos arredondados e acabamento tátil de luxo</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
