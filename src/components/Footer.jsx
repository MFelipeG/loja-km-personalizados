import React from 'react';
import { Heart, ShieldCheck, Mail, FileText } from 'lucide-react';
import { InstagramIcon, TikTokIcon, FacebookIcon } from './Icons';
import PaymentBadges from './PaymentBadges';

export default function Footer({ settings, onOpenAdmin, onOpenTerms }) {
  return (
    <footer className="bg-atelier-900 text-atelier-200 pt-16 pb-12 border-t border-atelier-800 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-atelier-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-light/20 shrink-0">
                <img
                  src="/assets/logo-km.jpg"
                  alt="KM Personalizados"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-atelier-50 block leading-tight">
                  KM Personalizados
                </span>
                <span className="text-[11px] text-brand-light font-medium block">
                  Ateliê de Bótons & Ímãs de Fotos
                </span>
              </div>
            </div>

            <p className="text-xs text-atelier-400 max-w-sm leading-relaxed">
              Transformamos as suas melhores fotografias em bótons ímãs quadrados com laminação brilhante e tecnologia de fundo borrado 6,1cm. Encomendas personalizadas com envio CTT para todo o país.
            </p>

            {/* Email Contact (Phone removed from public display as requested) */}
            <div className="space-y-1.5 text-xs text-atelier-300 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-light" />
                <a href="mailto:kmpersonalisados@gmail.com" className="hover:underline">
                  kmpersonalisados@gmail.com
                </a>
              </div>
            </div>

            {/* Social channels */}
            <div className="flex items-center gap-3 pt-2">
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-atelier-800 hover:bg-brand text-atelier-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                  title="Siga a KM Personalizados no Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}

              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-atelier-800 hover:bg-brand text-atelier-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                  title="Siga a KM Personalizados no TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              )}

              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-atelier-800 hover:bg-brand text-atelier-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                  title="Siga a KM Personalizados no Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-atelier-50">
              Navegação
            </h4>
            <ul className="space-y-2 text-atelier-400">
              <li>
                <a href="#estudio" className="hover:text-brand-light transition-colors">
                  Personalizar os Meus Bótons
                </a>
              </li>
              <li>
                <a href="#kits" className="hover:text-brand-light transition-colors">
                  Promoção de Inauguração (5+1)
                </a>
              </li>
              <li>
                <a href="#prazos" className="hover:text-brand-light transition-colors">
                  Envios CTT & Cuidados
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-brand-light transition-colors">
                  Depoimentos de Clientes
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand-light transition-colors font-medium text-brand-light">
                  Perguntas Frequentes (FAQ)
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-brand-light transition-colors text-left cursor-pointer"
                >
                  Termos, Cancelamento & Reembolso
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal Badges */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-atelier-50">
              Políticas & Segurança
            </h4>
            <div className="space-y-2 text-atelier-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>RGPD: Fotos Apagadas Após Entrega</span>
              </div>
              <p className="text-[11px] leading-relaxed text-atelier-400">
                Não retemos as suas fotos. Concluída a expedição e entrega pelos CTT, as imagens são permanentemente eliminadas dos nossos servidores.
              </p>

              <ul className="space-y-1.5 pt-1 text-[11px]">
                <li>
                  <button
                    onClick={onOpenTerms}
                    className="text-atelier-300 hover:text-brand-light transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Desistência: Retenção 50% de material</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenTerms}
                    className="text-atelier-300 hover:text-brand-light transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Garantia: Reenvio Gratuito CTT</span>
                  </button>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-atelier-300 hover:text-brand-light transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-light"></span>
                    <span>Perguntas Frequentes (Dúvidas Rápidas)</span>
                  </a>
                </li>
              </ul>

              <div className="pt-1.5">
                <button
                  onClick={onOpenTerms}
                  className="text-brand-light hover:underline font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Todas as Políticas & Termos</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Payment Methods & Shipping Bar */}
        <div className="py-6 border-b border-atelier-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-atelier-200 block">
              Métodos de Pagamento Seguros
            </span>
            <span className="text-[11px] text-atelier-400">
              Pagamentos aceites em Portugal e no Brasil após confirmação do pedido
            </span>
          </div>
          <PaymentBadges />
        </div>

        {/* Bottom copyright (with discreet hidden admin shortcut on the © symbol) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-atelier-500 gap-4">
          <p>
            <span
              onClick={onOpenAdmin}
              title="KM Personalizados"
              className="cursor-default select-none"
            >
              ©
            </span>{' '}
            {new Date().getFullYear()} KM Personalizados. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1 text-atelier-400">
            <span>Feito com</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>para eternizar as suas melhores lembranças</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
