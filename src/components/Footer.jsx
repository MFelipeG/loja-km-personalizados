import React from 'react';
import { Heart, ShieldCheck, Lock, Sparkles, MapPin } from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './Icons';

export default function Footer({ settings, onOpenAdmin }) {
  return (
    <footer className="bg-atelier-900 text-atelier-200 pt-16 pb-12 border-t border-atelier-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-atelier-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-light/30">
                <img
                  src="/assets/logo-km.jpg"
                  alt="KM Personalizados"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-xl font-bold text-atelier-50">
                KM Personalizados
              </span>
            </div>

            <p className="text-xs text-atelier-400 max-w-sm leading-relaxed">
              Ateliê especializado em transformar suas memórias mais afetivas em bótons ímãs quadrados com laminação brilhante e tecnologia de fundo borrado 6,1cm.
            </p>

            {/* Social channels */}
            <div className="flex items-center gap-3 pt-1">
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
                  Personalizar Meus Bótons
                </a>
              </li>
              <li>
                <a href="#kits" className="hover:text-brand-light transition-colors">
                  Tabela de Kits & Preços
                </a>
              </li>
              <li>
                <a href="#prazos" className="hover:text-brand-light transition-colors">
                  Prazos e Cuidados
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-brand-light transition-colors">
                  Depoimentos de Clientes
                </a>
              </li>
              <li>
                <a href="#em-breve" className="hover:text-brand-light transition-colors">
                  Futuros Lançamentos
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Policies */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-atelier-50">
              Segurança & Ateliê
            </h4>
            <div className="space-y-2 text-atelier-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>CSP & Cabeçalhos Seguros Ativos</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Suas fotos são processadas com criptografia local e preservadas em alta definição para a prensa.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-atelier-500 hover:text-atelier-300 flex items-center gap-1 text-[11px] transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Área da Equipe (/admin)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-atelier-500 gap-4">
          <p>© {new Date().getFullYear()} KM Personalizados. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1 text-atelier-400">
            <span>Feito com</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>para eternizar suas melhores lembranças</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
