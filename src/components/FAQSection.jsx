import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Sparkles, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './Icons';

export default function FAQSection({ settings, onOpenTerms }) {
  const [openIndex, setOpenIndex] = useState(0);

  const whatsappNumber = settings?.whatsappNumber || '351965639401';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Olá KM Personalizados! Tenho uma dúvida sobre a loja e os bótons ímãs.'
  )}`;

  const faqs = [
    {
      id: 'promo-inauguracao',
      question: 'Como funciona a Promoção de Inauguração (5 Bótons por 25 € + 1 de Brinde)?',
      badge: 'Oferta Especial',
      answer: (
        <div className="space-y-2">
          <p>
            Ao selecionar o nosso <strong>Kit de 5 Bótons por 25 €</strong>, recebe automaticamente o <strong>6º bóton inteiramente de brinde</strong>!
          </p>
          <p>
            Com este desconto de inauguração, cada bóton ímã sai por apenas <strong>4,17 €</strong> (em vez de 5,50 € da unidade individual). Todos os bótons incluem impressão fotográfica de alta nitidez, laminação brilhante protetora e super ímã traseiro (limite de 1 combo promocional por cliente/pedido).
          </p>
        </div>
      )
    },
    {
      id: 'fundo-borrado',
      question: 'O que é a tecnologia de Fundo Borrado (6,1 cm) e a Área Útil (5,0 cm)?',
      badge: 'Tecnologia Exclusiva',
      answer: (
        <div className="space-y-2">
          <p>
            A face frontal plana do bóton ímã mede exatamente <strong>5,0 x 5,0 cm</strong> (a parte que fica visível no seu frigorífico). As margens que vão até <strong>6,1 x 6,1 cm</strong> são dobradas e prensadas na máquina mecânica para trás da chapa metálica.
          </p>
          <p>
            Para garantir que <strong>nenhum rosto, cabeça, cabelo ou detalhe importante seja cortado na prensa</strong>, o nosso estúdio preenche automaticamente essas bordas de dobra com a própria foto suavemente desfocada. O resultado é um bóton premium, sem faixas brancas e com 100% da sua memória preservada na frente!
          </p>
        </div>
      )
    },
    {
      id: 'qualidade-foto',
      question: 'Como sei se a qualidade da minha foto é boa o suficiente para imprimir?',
      badge: 'Verificação Inteligente',
      answer: (
        <div className="space-y-2">
          <p>
            O nosso <strong>Estúdio de Personalização</strong> conta com um verificador automático de resolução (DPI).
          </p>
          <p>
            Assim que faz o envio de qualquer imagem (do telemóvel, câmara ou redes sociais), o sistema calcula os pixels e avisa de imediato se a qualidade está <strong>Ótima</strong>, <strong>Boa</strong> ou <strong>Abaixo do Recomendado</strong>. Além disso, pode recortar, ajustar o zoom e pré-visualizar a sua foto exatamente como ficará no frigorífico antes de pedir.
          </p>
        </div>
      )
    },
    {
      id: 'pagamento',
      question: 'Quais são os métodos de pagamento aceites?',
      badge: '100% Seguro',
      answer: (
        <div className="space-y-2">
          <p>
            Dispomos de meios de pagamento simples, imediatos e sem taxas ocultas:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-atelier-700">
            <li><strong>MB WAY:</strong> Pagamento instantâneo por telemóvel para clientes em Portugal.</li>
            <li><strong>Transferência Bancária / IBAN SEPA:</strong> Para contas bancárias de Portugal e de toda a União Europeia.</li>
            <li><strong>Pix:</strong> Pagamento instantâneo em Reais (R$) para clientes brasileiros residentes ou com conta no Brasil.</li>
          </ul>
          <p className="text-[11px] text-atelier-500">
            * O pagamento é combinado diretamente connosco através do WhatsApp oficial após a revisão e confirmação do seu pedido.
          </p>
        </div>
      )
    },
    {
      id: 'envios-ctt',
      question: 'Quais são os prazos de produção e as opções de envio CTT?',
      badge: 'Envios Rápidos',
      answer: (
        <div className="space-y-2">
          <p>
            <strong>Prazo de Produção:</strong> Os seus bótons são impressos e montados artesanalmente com todo o cuidado no prazo médio de <strong>1 a 2 dias úteis</strong> após a aprovação do pedido.
          </p>
          <p>
            <strong>Modalidades de Envio em Portugal:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-atelier-700">
            <li><strong>CTT Correio Verde Almofadado (~2,70 €):</strong> Envio rápido e económico em envelope almofadado protetor (1 a 2 dias úteis de transporte).</li>
            <li><strong>CTT Correio Registado (~3,20 €):</strong> Entrega em mão com código de rastreio oficial CTT para acompanhar em tempo real.</li>
            <li><strong>Cacifos InPost 24h (~3,85 €):</strong> Levantamento rápido e seguro em qualquer locker automático perto de si.</li>
            <li><strong>Levantamento em Mãos (0,00 €):</strong> Gratuito mediante agendamento prévio no nosso ateliê.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'privacidade-fotos',
      question: 'O que acontece com as minhas fotografias após a entrega? (Política de Privacidade RGPD)',
      badge: 'Privacidade Rigorosa',
      answer: (
        <div className="space-y-2">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-emerald-900 flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs">Compromisso de Não-Retenção de Imagens</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Nós <strong>NÃO guardamos as suas fotos</strong>. As suas imagens são utilizadas única e exclusivamente para a produção da sua encomenda.
              </p>
            </div>
          </div>
          <p>
            Em estrito cumprimento do Regulamento Geral sobre a Proteção de Dados (RGPD), assim que a sua encomenda é expedida e entregue pelos CTT, as suas fotografias são <strong>permanentemente eliminadas</strong> de todos os nossos arquivos e servidores gráficos.
          </p>
        </div>
      )
    },
    {
      id: 'cancelamento-garantia',
      question: 'Posso cancelar o meu pedido ou solicitar reembolso? Qual é a garantia?',
      badge: 'Transparência Total',
      answer: (
        <div className="space-y-2">
          <p>
            <strong>Política de Desistência em Artigos Personalizados:</strong>
          </p>
          <p>
            Como os bótons são impressos em papel fotográfico sob medida com as suas fotos pessoais, caso desista da encomenda após a aprovação e início da impressão gráfica, <strong>será retido no mínimo 50% do valor total</strong> para cobrir os materiais descartados (papel fotográfico, películas, chapas e ímãs) que não podem ser reaproveitados.
          </p>
          <p>
            <strong>Garantia de Satisfação & Defeito:</strong>
          </p>
          <p>
            Se houver qualquer anomalia de fabrico ou dano sofrido durante o transporte dos CTT, realizamos o <strong>reenvio gratuito prioritário</strong> dos bótons com as mesmas imagens. Se por qualquer motivo não for possível resolver a situação, procederemos à devolução integral do montante pago.
          </p>
        </div>
      )
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-atelier-100/60 border-t border-atelier-200/80 w-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-light/30 text-brand-dark rounded-full text-xs font-semibold tracking-wide uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-brand" />
            <span>Tire Todas as Suas Dúvidas</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-dark tracking-tight">
            Perguntas Frequentes & Políticas
          </h2>

          <p className="text-xs sm:text-sm text-atelier-600 leading-relaxed">
            Reunimos as respostas para as principais questões sobre o acabamento dos nossos bótons ímãs, o fundo borrado 6,1cm, formas de pagamento e garantias.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen
                    ? 'bg-white border-brand/30 shadow-md ring-1 ring-brand/10'
                    : 'bg-white/80 hover:bg-white border-atelier-200 shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-4 px-4 sm:px-6 flex items-center justify-between gap-3 text-left cursor-pointer focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 flex-1 min-w-0 pr-2">
                    <span className="font-serif font-bold text-sm sm:text-base text-brand-dark leading-snug">
                      {faq.question}
                    </span>
                    {faq.badge && (
                      <span className="inline-flex items-center self-start text-[10px] font-semibold px-2 py-0.5 rounded-full bg-atelier-100 text-atelier-700 shrink-0">
                        {faq.badge}
                      </span>
                    )}
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-brand text-atelier-50 rotate-180'
                        : 'bg-atelier-100 text-atelier-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 pt-1 text-xs sm:text-[13px] text-atelier-700 border-t border-atelier-100 leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action card for policies and WhatsApp contact */}
        <div className="mt-12 p-6 sm:p-8 bg-white rounded-3xl border border-atelier-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-serif font-bold text-base sm:text-lg text-brand-dark flex items-center justify-center sm:justify-start gap-2">
              <FileText className="w-4 h-4 text-brand" />
              <span>Deseja ler as políticas legais completas?</span>
            </h3>
            <p className="text-xs text-atelier-600 max-w-md leading-relaxed">
              Consulte os termos detalhados de retenção de 50%, garantia dos CTT e política de eliminação de fotos segundo o RGPD.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={onOpenTerms}
              className="w-full sm:w-auto px-4 py-2.5 bg-atelier-100 hover:bg-atelier-200 text-atelier-800 text-xs font-semibold rounded-xl border border-atelier-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-brand" />
              <span>Ver Termos & Políticas</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>Tirar Dúvida no WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
