import React, { useState } from 'react';
import { Check, Sparkles, Zap, Flame, Gift, Plus, Minus, ArrowRight } from 'lucide-react';

export default function KitsPricing({ kits, onSelectKit, onCustomQuantity }) {
  // Custom quantity state for interactive calculator
  const [customUnits, setCustomUnits] = useState(2);

  // Calculate price for custom units:
  // Minimum 2 units = 12€ (6€/un)
  // If 5 or 6 units: applies the promotion (25€)
  // If > 6 units: 25€ + (units - 6) * 5.00€
  const calculateCustomPrice = (units) => {
    if (units <= 2) return 12.00;
    if (units === 3) return 18.00;
    if (units === 4) return 24.00;
    if (units === 5 || units === 6) return 25.00; // 5 + 1 de brinde!
    return 25.00 + (units - 6) * 5.00;
  };

  const currentCustomPrice = calculateCustomPrice(customUnits);

  return (
    <section id="kits" className="py-16 md:py-24 bg-atelier-100/60 border-b border-atelier-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-rose-600" />
            <span>Preços & Promoção Especial de Inauguração</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark">
            Tabela de Valores em Portugal (€)
          </h2>
          <p className="text-atelier-600 text-sm sm:text-base">
            Produzidos com papel fotográfico premium, proteção brilhante e ímã de alta aderência. Escolha o seu kit ou personalize a sua quantidade exata!
          </p>
        </div>

        {/* 2 Main Visual Kit Cards + Custom Quantity Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          
          {/* Card 1: Pedido Mínimo (2 Bótons) */}
          <div className="relative flex flex-col justify-between rounded-3xl p-6 bg-white border border-atelier-200 shadow-sm hover:shadow-md transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-xs font-bold bg-atelier-200 text-atelier-800 shadow-xs whitespace-nowrap">
              Pedido Mínimo
            </div>

            <div>
              <div className="text-center pt-3 pb-4 border-b border-atelier-100">
                <h3 className="font-serif text-xl font-bold text-brand-dark">
                  2 Bótons Ímãs
                </h3>
                <p className="text-xs text-atelier-500 mt-1">
                  6,1 x 6,1 cm com fundo borrado
                </p>
              </div>

              {/* Price */}
              <div className="py-6 text-center">
                <span className="text-xs text-atelier-400 line-through block mb-1">
                  De 14,00 €
                </span>
                <div className="flex items-baseline justify-center gap-1 text-brand-dark">
                  <span className="text-4xl font-extrabold tracking-tight">
                    12,00
                  </span>
                  <span className="text-2xl font-bold">€</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-2">
                  6,00 € por unidade
                </span>
              </div>

              {/* Features list */}
              <ul className="space-y-2 text-xs text-atelier-700 pb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>2 fotografias diferentes ou iguais</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Fundo borrado sem faixas brancas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Película brilhante anti-riscos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Envio via CTT para todo o país</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectKit({ id: 'minimo-2', name: 'Pedido Mínimo (2 Bótons)', units: 2, price: 12.00 })}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-atelier-100 hover:bg-atelier-200 text-brand-dark border border-atelier-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Escolher 2 Bótons (12 €)</span>
            </button>
          </div>

          {/* Card 2: Promoção de Inauguração (5 + 1 DE BRINDE!) - DESTAQUE MÁXIMO */}
          <div className="relative flex flex-col justify-between rounded-3xl p-6 bg-white border-2 border-brand shadow-tactile ring-4 ring-brand/10 md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-brand text-atelier-50 shadow-md whitespace-nowrap flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-300" />
              <span>PROMOÇÃO: 5 + 1 DE BRINDE! 🎉</span>
            </div>

            <div>
              <div className="text-center pt-3 pb-4 border-b border-atelier-100">
                <h3 className="font-serif text-2xl font-bold text-brand-dark">
                  Kit Inauguração
                </h3>
                <p className="text-xs text-brand font-semibold mt-1">
                  Pague 5 e Leve 6 Bótons Ímãs!
                </p>
              </div>

              {/* Price */}
              <div className="py-6 text-center">
                <span className="text-xs text-atelier-400 line-through block mb-1">
                  De 36,00 € (6 x 6€)
                </span>
                <div className="flex items-baseline justify-center gap-1 text-brand-dark">
                  <span className="text-5xl font-extrabold tracking-tight text-brand">
                    25,00
                  </span>
                  <span className="text-3xl font-bold text-brand">€</span>
                </div>
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
                    Apenas 4,17 € por unidade (Poupa 11 €!)
                  </span>
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-2.5 text-xs text-atelier-700 pb-6">
                <li className="flex items-center gap-2 font-bold text-brand-dark">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Total de 6 fotos personalizadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 unidade grátis de oferta</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Qualidade fotográfica 300 DPI</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Embalagem reforçada de presente</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectKit({ id: 'promo-inauguracao', name: 'Kit Inauguração (5 + 1 Grátis)', units: 6, price: 25.00 })}
              className="w-full py-4 px-4 rounded-xl font-bold text-sm bg-brand hover:bg-brand-dark text-atelier-50 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Aproveitar Promoção (6 por 25 €)</span>
            </button>
          </div>

          {/* Card 3: Quantidade Personalizável */}
          <div className="relative flex flex-col justify-between rounded-3xl p-6 bg-white border border-atelier-200 shadow-sm hover:shadow-md transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-xs font-bold bg-atelier-200 text-atelier-800 shadow-xs whitespace-nowrap">
              Quantidade Livre
            </div>

            <div>
              <div className="text-center pt-3 pb-4 border-b border-atelier-100">
                <h3 className="font-serif text-xl font-bold text-brand-dark">
                  Personalize as Unidades
                </h3>
                <p className="text-xs text-atelier-500 mt-1">
                  Escolha exatamente quantos quiser
                </p>
              </div>

              {/* Interactive Quantity Stepper */}
              <div className="py-5 text-center space-y-3">
                <div className="flex items-center justify-center gap-4">
                  <button
                    disabled={customUnits <= 2}
                    onClick={() => setCustomUnits((u) => Math.max(2, u - 1))}
                    className="w-10 h-10 rounded-xl bg-atelier-100 hover:bg-atelier-200 disabled:opacity-40 text-brand-dark flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="font-mono text-3xl font-extrabold text-brand-dark min-w-[3rem]">
                    {customUnits}
                  </div>

                  <button
                    onClick={() => setCustomUnits((u) => u + 1)}
                    className="w-10 h-10 rounded-xl bg-atelier-100 hover:bg-atelier-200 text-brand-dark flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline justify-center gap-1 text-brand-dark">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {currentCustomPrice.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-xl font-bold">€</span>
                </div>

                {customUnits >= 5 && customUnits <= 6 ? (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
                    Aproveita a promoção 5 + 1 Brinde!
                  </span>
                ) : (
                  <span className="text-[11px] text-atelier-500 block">
                    (Mínimo de 2 unidades)
                  </span>
                )}
              </div>

              <ul className="space-y-2 text-xs text-atelier-700 pb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Suba até {customUnits} fotos diferentes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Acabamento 6,1cm com corte exato</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectKit({ id: 'personalizado', name: `${customUnits} Bótons Ímãs`, units: customUnits, price: currentCustomPrice })}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-brand-cream hover:bg-atelier-200 text-brand-dark border border-brand-light/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Montar {customUnits} Bótons ({currentCustomPrice.toFixed(2).replace('.', ',')} €)</span>
            </button>
          </div>

        </div>

        {/* Note on Kit 12 and 24 (Pending as requested) */}
        <div className="mt-10 p-4 rounded-2xl bg-white/70 border border-atelier-200 text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-atelier-600">
          <Zap className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Kits de 12 e 24 unidades (Folhas A4 completas):</strong> Preços promocionais especiais a serem divulgados em breve! Se precisar de encomendas em grandes quantidades, fale connosco no WhatsApp.
          </span>
        </div>

      </div>
    </section>
  );
}
