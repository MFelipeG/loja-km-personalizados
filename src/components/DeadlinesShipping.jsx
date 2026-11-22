import React from 'react';
import { Clock, Truck, ShieldCheck, Sparkles, Box, Droplets, Sun, HelpCircle } from 'lucide-react';

export default function DeadlinesShipping({ settings }) {
  const productionDays = settings?.productionDays || 3;
  const shippingText = settings?.shippingInfoText || 'Enviamos para todo o Brasil com embalagem reforçada anti-impacto.';
  const careText = settings?.careInstructions || 'Limpe com pano macio e seco. Evite produtos químicos ou solventes.';

  return (
    <section id="prazos" className="py-16 md:py-24 bg-atelier-50 border-b border-atelier-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-200 text-brand-dark text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-brand" />
            <span>Prazos & Cuidados</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
            Transparência do Início ao Fim
          </h2>
          <p className="text-atelier-600 text-sm sm:text-base">
            Cada pedido é confeccionado artesanalmente com carinho e inspecionado manualmente antes do envio.
          </p>
        </div>

        {/* 3 Grid Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Produção */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-200/80 shadow-sm space-y-4 hover:border-brand/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">
              Tempo de Produção
            </h3>
            <div className="space-y-2 text-sm text-atelier-700">
              <p className="font-semibold text-brand text-base">
                Média de {productionDays} a {productionDays + 2} dias úteis
              </p>
              <p className="text-xs text-atelier-500 leading-relaxed">
                Iniciamos a impressão fotográfica em 300 DPI e a montagem na prensa logo após a confirmação do pedido no WhatsApp.
              </p>
            </div>
          </div>

          {/* Card 2: Envio & Embalagem */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-200/80 shadow-sm space-y-4 hover:border-brand/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">
              Envio & Embalagem
            </h3>
            <div className="space-y-2 text-sm text-atelier-700">
              <p className="font-semibold text-emerald-700 text-base">
                Envio Seguro para Todo o Brasil
              </p>
              <p className="text-xs text-atelier-500 leading-relaxed">
                {shippingText} Seus ímãs vão envolvidos em camadas de plástico bolha e caixa rígida para evitar qualquer risco ou amassado.
              </p>
            </div>
          </div>

          {/* Card 3: Cuidados & Durabilidade */}
          <div className="bg-white rounded-3xl p-6 border border-atelier-200/80 shadow-sm space-y-4 hover:border-brand/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-100/70 text-rose-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">
              Cuidados com Seus Ímãs
            </h3>
            <div className="space-y-2 text-sm text-atelier-700">
              <p className="font-semibold text-brand-leather text-base">
                Alta Durabilidade & Brilho
              </p>
              <p className="text-xs text-atelier-500 leading-relaxed">
                {careText} A película plástica brilhante protege a foto contra respingos de água e poeira do dia a dia.
              </p>
            </div>
          </div>

        </div>

        {/* Micro FAQ Accordion/Highlights */}
        <div className="mt-12 bg-atelier-100/70 rounded-3xl p-6 sm:p-8 border border-atelier-200/70 max-w-4xl mx-auto">
          <h4 className="font-serif text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand" />
            <span>Perguntas Frequentes do Ateliê</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-atelier-700">
            <div className="p-3 bg-white/80 rounded-xl border border-atelier-200/60">
              <strong className="block text-brand-dark mb-1">Como funciona a borda borrada?</strong>
              A arte externa de 6,1cm usa a própria imagem borrada para dobrar na prensa, enquanto seus 5,0cm centrais ficam 100% nítidos na frente!
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-atelier-200/60">
              <strong className="block text-brand-dark mb-1">Preciso pagar no site?</strong>
              Não! O site gera o código exclusivo do seu pedido (#BOT-XXXX) com o frete e as fotos prontas, e você fecha o pagamento via Pix direto no WhatsApp da loja.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
