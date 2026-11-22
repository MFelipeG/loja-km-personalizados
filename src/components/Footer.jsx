import React from 'react';
import { Heart, ShieldCheck, Lock, Sparkles, MapPin, Mail, Phone, FileText } from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './Icons';

export default function Footer({ settings, onOpenAdmin, onOpenTerms }) {
  return (
    <footer className="bg-atelier-900 text-atelier-200 pt-16 pb-12 border-t border-atelier-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-atelier-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 overflow-hidden border border-brand-light/40 shadow-xs flex items-center justify-center">
                <img
                  src="/assets/logo-km.jpg"
                  alt="KM Personalizados"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-atelier-50 block leading-tight">
                  KM Personalizados
                </span>
                <span className="text-[11px] text-brand-light font-medium block">
                  Ateliê de Bótons Ímãs Quadrados • Portugal 🇵🇹
                </span>
              </div>
            </div>

            <p className="text-xs text-atelier-400 max-w-sm leading-relaxed">
              Transformamos as suas melhores fotografias em bótons ímãs quadrados com laminação brilhante e tecnologia de fundo borrado 6,1cm. Encomendas personalizadas com envio CTT para todo o país.
            </p>

            {/* Direct Contacts */}
            <div className="space-y-1.5 text-xs text-atelier-300 pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-light" />
                <a href="mailto:kmpersonalisados@gmail.com" className="hover:underline">
                  kmpersonalisados@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-light" />
                <a href="https://wa.me/351965639401" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  +351 965 639 401 (WhatsApp)
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
                <button
                  onClick={onOpenTerms}
                  className="hover:text-brand-light transition-colors text-left cursor-pointer"
                >
                  Termos & Política de Reembolso
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal Badges */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-atelier-50">
              Privacidade & Garantia
            </h4>
            <div className="space-y-2 text-atelier-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Fotos Apagadas Após Entrega</span>
              </div>
              <p className="text-[11px] leading-relaxed text-atelier-400">
                Não retemos as suas imagens. Após a expedição e receção da encomenda, as fotos são apagadas dos nossos ficheiros.
              </p>
              <div className="pt-1">
                <button
                  onClick={onOpenTerms}
                  className="text-brand-light hover:underline font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ver Política de Reembolso Completa</span>
                </button>
              </div>

              <div className="pt-3 border-t border-atelier-800">
                <button
                  onClick={onOpenAdmin}
                  className="text-atelier-500 hover:text-atelier-300 flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Acesso da Equipa (/admin)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-atelier-500 gap-4">
          <p>© {new Date().getFullYear()} KM Personalizados. Portugal. Todos os direitos reservados.</p>
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
