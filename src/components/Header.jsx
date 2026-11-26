import React from 'react';
import { Search } from 'lucide-react';
import { InstagramIcon, TikTokIcon, FacebookIcon } from './Icons';

export default function Header({
  settings,
  onOpenTracking,
}) {
  return (
    <header className="sticky top-0 z-40 bg-atelier-50/95 backdrop-blur-md border-b border-atelier-200/80 transition-all w-full max-w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Name (Nunca cortado / whitespace-nowrap) */}
        <a href="#" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0">
          <div className="relative w-10 h-10 sm:w-13 sm:h-13 rounded-full overflow-hidden shrink-0 group-hover:scale-105 transition-transform border border-brand/15 shadow-xs">
            <img
              src="/assets/logo-km.jpg"
              alt="KM Personalizados"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-serif text-base sm:text-2xl font-bold tracking-tight text-brand-dark block leading-tight whitespace-nowrap">
              KM Personalizados
            </span>
            <span className="text-[8.5px] sm:text-[11px] font-medium tracking-wider uppercase text-brand-leather whitespace-nowrap">
              Ateliê de Bótons & Ímãs de Fotos
            </span>
          </div>
        </a>

        {/* Right actions: Redes Sociais e Botão de Procurar Encomenda */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          
          {/* Redes Sociais com rel="me" para verificação Google & SEO */}
          <div className="flex items-center gap-0.5 sm:gap-1.5">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="me noopener noreferrer"
                title="Instagram Oficial KM Personalizados"
                className="p-1.5 sm:p-2 text-atelier-600 hover:text-brand hover:bg-atelier-100 rounded-full transition-colors"
              >
                <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
            )}

            {settings?.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="me noopener noreferrer"
                title="TikTok Oficial KM Personalizados"
                className="p-1.5 sm:p-2 text-atelier-600 hover:text-brand hover:bg-atelier-100 rounded-full transition-colors"
              >
                <TikTokIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
            )}

            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="me noopener noreferrer"
                title="Facebook Oficial KM Personalizados"
                className="p-1.5 sm:p-2 text-atelier-600 hover:text-brand hover:bg-atelier-100 rounded-full transition-colors"
              >
                <FacebookIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </a>
            )}
          </div>

          {/* Botão de Procurar Encomenda / Acompanhar */}
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 text-xs font-semibold text-atelier-700 bg-atelier-100 hover:bg-atelier-200 rounded-xl transition-colors border border-atelier-200 cursor-pointer shrink-0"
            title="Procurar ou acompanhar encomenda"
          >
            <Search className="w-4 h-4 text-brand" />
            <span className="hidden sm:inline">Acompanhar</span>
          </button>

        </div>

      </div>
    </header>
  );
}
