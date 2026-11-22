import React from 'react';
import { X, ShieldCheck, RefreshCw, FileText, Lock, Mail, Phone, Heart } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-atelier-50 border-b border-atelier-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-brand text-atelier-50 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-dark">
                Termos, Privacidade & Reembolso
              </h3>
              <p className="text-xs text-atelier-500">
                Ateliê KM Personalizados • Portugal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-atelier-400 hover:text-atelier-700 hover:bg-atelier-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-atelier-700 leading-relaxed">
          
          {/* Section 1: Privacidade e Exclusão de Fotos */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70 space-y-2">
            <h4 className="font-serif font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>1. Política de Privacidade & Não-Retenção de Fotos</span>
            </h4>
            <p>
              Na <strong>KM Personalizados</strong>, levamos a privacidade das suas memórias muito a sério, em total conformidade com as diretrizes do Regulamento Geral sobre a Proteção de Dados (RGPD / GDPR) da União Europeia.
            </p>
            <p className="font-semibold text-emerald-950">
              • NÃO ficamos com imagens guardadas: assim que a encomenda é expedida e o cliente recebe os seus bótons com sucesso, as suas fotografias são PERMANENTEMENTE APAGADAS dos nossos servidores e arquivos de produção.
            </p>
            <p>
              As suas fotografias são utilizadas estritamente para a impressão e montagem dos bótons solicitados. Jamais serão partilhadas, divulgadas ou utilizadas para qualquer outro fim sem a sua autorização expressa.
            </p>
          </div>

          {/* Section 2: Política de Reembolso e Trocas */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70 space-y-2">
            <h4 className="font-serif font-bold text-sm text-amber-900 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-amber-700" />
              <span>2. Política de Reembolso e Garantia do Produto</span>
            </h4>
            <p>
              Por se tratarem de artigos 100% personalizados, feitos sob medida com fotografias de cariz pessoal, aplicam-se as seguintes condições de garantia:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-amber-950">
              <li>
                <strong>Primeira Tentativa (Reenvio Gratuito):</strong> Em caso de qualquer defeito comprovado de fabrico ou dano ocorrido durante o transporte pelos CTT, a nossa prioridade é o <strong>reenvio sem qualquer custo adicional</strong> dos mesmos produtos afetados.
              </li>
              <li>
                <strong>Mesmas Imagens:</strong> Para o reenvio de garantia, são consideradas e utilizadas estritamente as <strong>mesmas fotografias</strong> enviadas no pedido original, não sendo permitida a substituição por novas fotos.
              </li>
              <li>
                <strong>Devolução do Valor:</strong> Caso não seja possível solucionar o problema através do reenvio, ou perante avaliação específica com a nossa equipa de apoio, procederemos à <strong>devolução integral do valor pago</strong>.
              </li>
            </ul>
          </div>

          {/* Section 3: Envios CTT e Prazos */}
          <div className="p-4 bg-atelier-50 rounded-2xl border border-atelier-200 space-y-2">
            <h4 className="font-serif font-bold text-sm text-brand-dark flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand" />
              <span>3. Envios e Prazos (Portugal Continental & Ilhas)</span>
            </h4>
            <p>
              • <strong>Produção Artesanal:</strong> Média de 1 a 2 dias úteis após a confirmação do pagamento no WhatsApp.
            </p>
            <p>
              • <strong>Modalidades de Envio CTT:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-atelier-600">
              <li><strong>CTT Correio Verde (Almofadada M):</strong> Entrega rápida em envelope almofadado com frete pago (~2,70 €).</li>
              <li><strong>CTT Correio Registado (Com Rastreio):</strong> Entrega em mão com código de rastreio oficial CTT (~3,20 €).</li>
              <li><strong>InPost (Locker / Cacifo 24h):</strong> Levantamento flexível a qualquer hora no cacifo automático (~3,85 €).</li>
              <li><strong>Levantamento em Mãos:</strong> Gratuito mediante agendamento prévio no WhatsApp.</li>
            </ul>
          </div>

          {/* Section 4: Contactos Oficiais */}
          <div className="pt-2 border-t border-atelier-200 flex flex-wrap items-center justify-between gap-3 text-xs text-atelier-600">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-brand" />
              <span>kmpersonalisados@gmail.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-brand" />
              <span>+351 965 639 401</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-atelier-50 border-t border-atelier-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand hover:bg-brand-dark text-atelier-50 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Compreendi e Concordo
          </button>
        </div>

      </div>
    </div>
  );
}
