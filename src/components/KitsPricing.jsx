import React, { useState } from 'react';
import { Check, Sparkles, Zap, Gift, Plus, Minus, AlertCircle, PartyPopper } from 'lucide-react';

export default function KitsPricing({ kits, onSelectKit }) {
  // Custom quantity state for Card 3 interactive calculator (default: 2)
  const [customUnits, setCustomUnits] = useState(2);

  // Event kit tier state for Card 4 (default: 25 un.)
  const eventTiers = [
    { units: 25, unitPrice: 4.50, total: 112.50, label: '25 un. (4,50 €)' },
    { units: 50, unitPrice: 4.00, total: 200.00, label: '50 un. (4,00 €)' },
    { units: 75, unitPrice: 3.50, total: 262.50, label: '75 un. (3,50 €)' },
    { units: 100, unitPrice: 3.00, total: 300.00, label: '100 un. (3,00 €)' }
  ];
  const [selectedEventTier, setSelectedEventTier] = useState(eventTiers[0]);

  // Dynamic progressive unit pricing calculation:
  // 2 a 24 unidades: 5,50 € cada
  // 25 a 49 unidades: 4,50 € cada
  // 50 a 74 unidades: 4,00 € cada
  // 75 a 99 unidades: 3,50 € cada
  // 100+ unidades: 3,00 € cada
  const getUnitPrice = (units) => {
    if (units >= 100) return 3.00;
    if (units >= 75) return 3.50;
    if (units >= 50) return 4.00;
    if (units >= 25) return 4.50;
    return 5.50;
  };

  const calculateCustomPrice = (units) => {
    const unitPrice = getUnitPrice(units);
    return units * unitPrice;
  };

  const currentUnitPrice = getUnitPrice(customUnits);
  const currentCustomPrice = calculateCustomPrice(customUnits);

  return (
    <section id="kits" className="py-16 md:py-24 bg-atelier-100/60 border-b border-atelier-200/80 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-rose-600" />
            <span>Preços & Promoções Especiais</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark">
            Tabela de Valores
          </h2>
          <p className="text-atelier-600 text-sm sm:text-base">
            Produzidos com papel fotográfico premium, proteção brilhante e ímã de alta aderência. Escolha o seu kit ou personalize a sua quantidade exata!
          </p>
        </div>

        {/* 4 Cards Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-7xl mx-auto">
          
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
                  De 13,00 €
                </span>
                <div className="flex items-baseline justify-center gap-1 text-brand-dark">
                  <span className="text-4xl font-extrabold tracking-tight">
                    11,00
                  </span>
                  <span className="text-2xl font-bold">€</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-2">
                  5,50 € por unidade
                </span>
              </div>

              {/* Features list */}
              <ul className="space-y-2.5 text-xs text-atelier-700 pb-6">
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
              onClick={() => onSelectKit({ id: 'minimo-2', name: 'Pedido Mínimo (2 Bótons)', units: 2, price: 11.00 })}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-atelier-100 hover:bg-atelier-200 text-brand-dark border border-atelier-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Escolher 2 Bótons (11 €)</span>
            </button>
          </div>

          {/* Card 2: Promoção de Inauguração (5 + 1 DE BRINDE!) - DESTAQUE */}
          <div className="relative flex flex-col justify-between rounded-3xl p-6 bg-white border-2 border-brand shadow-tactile ring-4 ring-brand/10 md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-brand text-atelier-50 shadow-md whitespace-nowrap flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-300" />
              <span>PROMOÇÃO: 5 + 1 BRINDE! 🎉</span>
            </div>

            <div>
              <div className="text-center pt-3 pb-4 border-b border-atelier-100">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark">
                  Kit Inauguração
                </h3>
                <p className="text-xs text-brand font-semibold mt-1">
                  Pague 5 e Leve 6 Bótons Ímãs!
                </p>
              </div>

              {/* Price */}
              <div className="py-6 text-center">
                <span className="text-xs text-atelier-400 line-through block mb-1">
                  De 33,00 € (6 x 5,50€)
                </span>
                <div className="flex items-baseline justify-center gap-1 text-brand-dark">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand">
                    25,00
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-brand">€</span>
                </div>
                <div className="mt-2 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
                    Apenas 4,17 € por unidade (Poupa 8 €!)
                  </span>
                </div>
              </div>

              {/* Features list with prominent 1-per-client notice */}
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
                <li className="flex items-center gap-2 font-semibold text-amber-900 bg-amber-50/90 p-2 rounded-xl border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-[11px] leading-tight">Limite de 1 combo promocional por cliente/pedido</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectKit({ id: 'promo-inauguracao', name: 'Kit Inauguração (5 + 1 Grátis)', units: 6, price: 25.00 })}
              className="w-full py-4 px-4 rounded-xl font-bold text-xs sm:text-sm bg-brand hover:bg-brand-dark text-atelier-50 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Aproveitar Promoção (6 por 25 €)</span>
            </button>
          </div>

          {/* Card 3: Quantidade Livre com Preço Progressivo */}
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
                <div className="flex items-center justify-center gap-3">
                  <button
                    disabled={customUnits <= 2}
                    onClick={() => setCustomUnits((u) => Math.max(2, u - 1))}
                    className="w-9 h-9 rounded-xl bg-atelier-100 hover:bg-atelier-200 disabled:opacity-40 text-brand-dark flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                    title="Diminuir unidade"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="font-mono text-3xl font-extrabold text-brand-dark min-w-[3.2rem]">
                    {customUnits}
                  </div>

                  <button
                    onClick={() => setCustomUnits((u) => u + 1)}
                    className="w-9 h-9 rounded-xl bg-atelier-100 hover:bg-atelier-200 text-brand-dark flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                    title="Aumentar unidade"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Price Display */}
                <div>
                  <div className="flex items-baseline justify-center gap-1 text-brand-dark">
                    <span className="text-3xl font-extrabold tracking-tight">
                      {currentCustomPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xl font-bold">€</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    {currentUnitPrice.toFixed(2).replace('.', ',')} € por unidade
                  </span>
                </div>

                {customUnits >= 25 && (
                  <span className="text-[10.5px] font-bold text-brand bg-brand-cream px-2 py-0.5 rounded-full inline-block">
                    ✓ Desconto de quantidade ativado!
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
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Desconto progressivo automático</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectKit({ id: 'personalizado', name: `${customUnits} Bótons Ímãs`, units: customUnits, price: currentCustomPrice })}
              className="w-full py-3.5 px-3 rounded-xl font-bold text-xs sm:text-sm bg-brand-cream hover:bg-atelier-200 text-brand-dark border border-brand-light/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Montar {customUnits} Bótons ({currentCustomPrice.toFixed(2).replace('.', ',')} €)</span>
            </button>
          </div>

          {/* Card 4 (NOVO): Kit Eventos & Aniversários (mín. 25 un.) */}
          <div className="relative flex flex-col justify-between rounded-3xl p-6 bg-white border border-atelier-200 shadow-sm hover:shadow-md transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 shadow-xs whitespace-nowrap flex items-center gap-1">
              <PartyPopper className="w-3.5 h-3.5 text-amber-700" />
              <span>FESTAS & LEMBRANCINHAS</span>
            </div>

            <div>
              <div className="text-center pt-3 pb-3 border-b border-atelier-100">
                <h3 className="font-serif text-xl font-bold text-brand-dark">
                  Kit Eventos
                </h3>
                <p className="text-xs text-atelier-500 mt-1">
                  Preços especiais por quantidade (mín. 25 un.)
                </p>
              </div>

              {/* Tabela de Faixas / Patamares Interativa */}
              <div className="py-4 space-y-2">
                <span className="text-[11px] font-bold text-atelier-500 uppercase tracking-wider block text-left">
                  Escolha o Patamar:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {eventTiers.map((tier) => {
                    const isSelected = selectedEventTier.units === tier.units;
                    return (
                      <button
                        key={tier.units}
                        type="button"
                        onClick={() => setSelectedEventTier(tier)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-brand text-atelier-50 border-brand shadow-xs ring-2 ring-brand/20'
                            : 'bg-atelier-50 hover:bg-atelier-100 text-atelier-800 border-atelier-200'
                        }`}
                      >
                        <div className="font-bold text-xs">{tier.units} un.</div>
                        <div className={`text-[11px] font-semibold ${isSelected ? 'text-amber-200' : 'text-emerald-700'}`}>
                          {tier.unitPrice.toFixed(2).replace('.', ',')} € / un.
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Tier Total Preview */}
                <div className="pt-2 text-center">
                  <div className="flex items-baseline justify-center gap-1 text-brand-dark">
                    <span className="text-3xl font-extrabold tracking-tight">
                      {selectedEventTier.total.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xl font-bold">€</span>
                  </div>
                  <span className="text-[11px] font-medium text-atelier-500">
                    Total para {selectedEventTier.units} lembrancinhas
                  </span>
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-2 text-xs text-atelier-700 pb-5">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ideal para aniversários, casamentos e empresas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Artes iguais ou variadas à escolha</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Acabamento 6,1x6,1 cm com película brilhante</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectKit({
                id: 'kit-eventos',
                name: `Kit Eventos (${selectedEventTier.units} Bótons)`,
                units: selectedEventTier.units,
                price: selectedEventTier.total
              })}
              className="w-full py-3.5 px-3 rounded-xl font-bold text-xs sm:text-sm bg-brand hover:bg-brand-dark text-atelier-50 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Encomendar Kit Eventos ({selectedEventTier.units} un.)</span>
            </button>
          </div>

        </div>

        {/* Banner Inferior Informativo */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white/90 border border-atelier-200 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-atelier-700 shadow-xs">
          <Zap className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Aviso Importante:</strong> Promoção Kit Inauguração (6 por 25 €) limitada a 1 combo por pedido. Para encomendas de eventos acima de 25 unidades, o desconto por quantidade é aplicado automaticamente.
          </span>
        </div>

      </div>
    </section>
  );
}
