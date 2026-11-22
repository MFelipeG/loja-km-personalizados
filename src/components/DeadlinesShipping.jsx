import React from 'react';
import { Clock, Truck, ShieldCheck, Sparkles, Box, Droplets, Sun, HelpCircle, MapPin } from 'lucide-react';

export default function DeadlinesShipping({ settings }) {
  const productionDays = settings?.productionDays || 2;
  const shippingText = settings?.shippingInfoText || 'Envios para todo Portugal Continental e Ilhas via CTT.';
  const careText = settings?.careInstructions || 'Limpe com pano macio e seco. Evite produtos químicos ou solventes.';

  return (
    <section id="prazos" className="py-16 md:py-24 bg-atelier-50 border-b border-atelier-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-200 text-brand-dark text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-brand" />
            <span>Prazos & Envios em Portugal 🇵🇹</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
            Envios CTT Rápidos & Cuidados do Produto
          </h2>
          <p className="text-atelier-600 text-sm sm:text-base">
            Cada bóton é cuidadosamente impresso em alta resolução e montado à mão na nossa prensa no ateliê.
          </p>
        </div>

        {/* 3 Grid Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Produção */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-200/80 shadow-xs space-y-4 hover:border-brand/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">
              Tempo de Confecção
            </h3>
            <div className="space-y-2 text-sm text-atelier-700">
              <p className="font-semibold text-brand text-base">
                Apenas 1 a {productionDays} dias úteis
              </p>
              <p className="text-xs text-atelier-500 leading-relaxed">
                Iniciamos a impressão fotográfica em 300 DPI e a montagem na prensa logo após a confirmação no WhatsApp.
              </p>
            </div>
          </div>

          {/* Card 2: Envio CTT Portugal */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-200/80 shadow-xs space-y-4 hover:border-brand/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">
              Envio CTT & InPost
            </h3>
            <div className="space-y-2 text-sm text-atelier-700">
              <p className="font-semibold text-emerald-700 text-base">
                Portugal Continental & Ilhas
              </p>
              <p className="text-xs text-atelier-500 leading-relaxed">
                Opções com <strong>CTT Correio Verde</strong> (2,70 €), <strong>CTT Registado com Rastreio</strong> (3,20 €) ou <strong>Cacifo InPost 24h</strong> (3,85 €). Embalagem almofadada anti-impacto.
              </p>
            </div>
          </div>

          {/* Card 3: Cuidados & Durabilidade */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-200/80 shadow-xs space-y-4 hover:border-brand/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-100/70 text-rose-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">
              Cuidados com o Ímã
            </h3>
            <div className="space-y-2 text-sm text-atelier-700">
              <p className="font-semibold text-brand-leather text-base">
                Brilho & Durabilidade de Anos
              </p>
              <p className="text-xs text-atelier-500 leading-relaxed">
                {careText} A película plástica brilhante protege a imagem contra salpicos e pó do dia a dia.
              </p>
            </div>
          </div>

        </div>

        {/* Modalidades CTT Table */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-atelier-200/80 shadow-xs max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand" />
            <h4 className="font-serif text-lg font-bold text-brand-dark">
              Opções de Entrega em Portugal
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-atelier-50 rounded-2xl border border-atelier-200">
              <span className="font-bold text-brand-dark block text-sm">CTT Correio Verde</span>
              <span className="font-bold text-emerald-700 block text-base my-1">2,70 €</span>
              <span className="text-[11px] text-atelier-500 block">Prazo: 1 a 3 dias úteis</span>
              <span className="text-[10px] text-atelier-600 mt-1 block">Envelope almofadado oficial CTT</span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
              <span className="font-bold text-emerald-900 block text-sm">CTT Registado ⭐</span>
              <span className="font-bold text-emerald-800 block text-base my-1">3,20 €</span>
              <span className="text-[11px] text-emerald-700 block">Prazo: 1 a 2 dias úteis</span>
              <span className="text-[10px] text-emerald-800 font-semibold mt-1 block">Com código de rastreio oficial</span>
            </div>

            <div className="p-3.5 bg-atelier-50 rounded-2xl border border-atelier-200">
              <span className="font-bold text-brand-dark block text-sm">Cacifo InPost 24h</span>
              <span className="font-bold text-brand block text-base my-1">3,85 €</span>
              <span className="text-[11px] text-atelier-500 block">Prazo: 2 a 3 dias úteis</span>
              <span className="text-[10px] text-atelier-600 mt-1 block">Levantamento 24h num cacifo</span>
            </div>

            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200">
              <span className="font-bold text-amber-900 block text-sm">Levantamento em Mãos</span>
              <span className="font-bold text-amber-800 block text-base my-1">Grátis (0 €)</span>
              <span className="text-[11px] text-amber-700 block">A combinar</span>
              <span className="text-[10px] text-amber-800 mt-1 block">Combinado diretamente no WhatsApp</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
