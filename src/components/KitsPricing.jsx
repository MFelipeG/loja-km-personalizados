import React from 'react';
import { Check, Sparkles, Zap, Flame, Heart } from 'lucide-react';

export default function KitsPricing({ kits, onSelectKit }) {
  const defaultKits = [
    {
      id: 'avulso',
      name: 'Unidade Avulsa',
      units: 1,
      price: 6.00,
      originalPrice: 8.00,
      badge: 'Para Experimentar',
      highlight: false,
      description: 'Ideal para um presente pontual ou para conhecer nosso acabamento artesanal.'
    },
    {
      id: 'kit-6',
      name: 'Kit 6 Unidades',
      units: 6,
      price: 27.00,
      originalPrice: 36.00,
      badge: 'Mais Popular',
      highlight: false,
      description: 'Perfeito para uma viagem inesquecível ou fotos dos pets.'
    },
    {
      id: 'kit-12',
      name: 'Kit 12 Unidades',
      units: 12,
      price: 48.00,
      originalPrice: 72.00,
      badge: '⭐ 1 Folha Completa (Recomendado)',
      highlight: true,
      description: 'Completa exatamente 1 folha A4! Máximo aproveitamento e excelente economia por unidade.'
    },
    {
      id: 'kit-24',
      name: 'Kit 24 Unidades',
      units: 24,
      price: 89.00,
      originalPrice: 144.00,
      badge: '🚀 Melhor Custo-Benefício',
      highlight: false,
      description: '2 folhas A4 completas. Preço promocional imperdível para decorar sua geladeira inteira.'
    }
  ];

  const displayKits = (kits && kits.length > 0) ? kits : defaultKits;

  return (
    <section id="kits" className="py-16 md:py-24 bg-atelier-100/60 border-b border-atelier-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kits Promocionais</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark">
            Escolha o Kit Perfeito Para Suas Memórias
          </h2>
          <p className="text-atelier-600 text-sm sm:text-base">
            Produzidos com tecnologia de impressão profissional em papel fotográfico e película protetora de alto brilho. Quanto mais você pede, maior é a sua economia!
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {displayKits.map((kit) => {
            const unitPrice = (kit.price / kit.units).toFixed(2).replace('.', ',');
            const isHighlight = kit.highlight || kit.units === 12;

            return (
              <div
                key={kit.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 ${
                  isHighlight
                    ? 'bg-white border-2 border-brand shadow-tactile ring-4 ring-brand/10 lg:-translate-y-2'
                    : 'bg-white/90 border border-atelier-200/90 shadow-sm hover:shadow-md hover:border-atelier-300'
                }`}
              >
                {/* Badge Header */}
                {kit.badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold shadow-xs whitespace-nowrap ${
                      isHighlight
                        ? 'bg-brand text-atelier-50'
                        : 'bg-atelier-200 text-brand-dark'
                    }`}
                  >
                    {kit.badge}
                  </div>
                )}

                <div>
                  <div className="text-center pt-2 pb-4 border-b border-atelier-100">
                    <h3 className="font-serif text-xl font-bold text-brand-dark">
                      {kit.name}
                    </h3>
                    <p className="text-xs text-atelier-500 mt-1">
                      {kit.units} {kit.units === 1 ? 'bóton quadrado' : 'bótons quadrados (6,1x6,1 cm)'}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="py-6 text-center">
                    {kit.originalPrice && kit.originalPrice > kit.price && (
                      <span className="text-xs text-atelier-400 line-through block mb-1">
                        De R$ {kit.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <div className="flex items-baseline justify-center gap-1 text-brand-dark">
                      <span className="text-lg font-bold">R$</span>
                      <span className="text-4xl font-extrabold tracking-tight">
                        {kit.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-2">
                      R$ {unitPrice} por unidade
                    </span>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2.5 text-xs text-atelier-700 pb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Fundo borrado sem faixas brancas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Laminação de proteção brilhante</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Ímã com fixação super reforçada</span>
                    </li>
                    {kit.units >= 12 && (
                      <li className="flex items-center gap-2 font-semibold text-brand">
                        <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Gabarito A4 otimizado sem desperdício</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Select button */}
                <button
                  onClick={() => onSelectKit(kit)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isHighlight
                      ? 'bg-brand text-atelier-50 hover:bg-brand-dark shadow-sm'
                      : 'bg-atelier-100 hover:bg-atelier-200 text-brand-dark border border-atelier-300'
                  }`}
                >
                  <span>Montar {kit.units} {kit.units === 1 ? 'Bóton' : 'Bótons'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Tip Banner */}
        <div className="mt-10 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-center max-w-2xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-900 font-medium">
          <Flame className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Dica do Ateliê:</strong> O <strong>Kit 12 Unidades</strong> preenche exatamente uma folha A4 inteira de impressão em 300 DPI, garantindo a melhor entrega!
          </span>
        </div>

      </div>
    </section>
  );
}
