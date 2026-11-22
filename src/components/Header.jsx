import React from 'react';
import { ShoppingBag, Search } from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './Icons';

export default function Header({
  settings,
  cartCount,
  onOpenTracking,
  onOpenAdmin,
  onOpenCart,
  onOpenTerms,
  onScrollToStudio
}) {
  return (
    <header className="sticky top-0 z-40 bg-atelier-50/95 backdrop-blur-md border-b border-atelier-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          {/* Seamless rounded logo without white borders */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 group-hover:scale-105 transition-transform border border-brand/15 shadow-xs">
            <img
              src="/assets/logo-km.jpg"
              alt="KM Personalizados"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-serif text-2xl sm:text-[26px] font-bold tracking-tight text-brand-dark block leading-tight">
              KM Personalizados
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-brand-leather block whitespace-nowrap">
              Ateliê de Bótons & Ímãs de Fotos
            </span>
          </div>
        </a>

        {/* Navigation links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-semibold text-atelier-700">
          <button
            onClick={onScrollToStudio}
            className="hover:text-brand transition-colors cursor-pointer"
          >
            Personalizar
          </button>
          <a href="#kits" className="hover:text-brand transition-colors">
            Promoções & Kits
          </a>
          <a href="#prazos" className="hover:text-brand transition-colors">
            Envio CTT & Prazos
          </a>
          <a href="#depoimentos" className="hover:text-brand transition-colors">
            Depoimentos
          </a>
          <button
            onClick={onOpenTerms}
            className="hover:text-brand transition-colors text-atelier-600 cursor-pointer"
          >
            Termos & Reembolso
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Social Links */}
          {settings?.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram Oficial KM Personalizados"
              className="hidden sm:flex p-2 text-atelier-600 hover:text-brand hover:bg-atelier-100 rounded-full transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}

          {settings?.tiktok && (
            <a
              href={settings.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok Oficial KM Personalizados"
              className="hidden sm:flex p-2 text-atelier-600 hover:text-brand hover:bg-atelier-100 rounded-full transition-colors"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
          )}

          {/* Acompanhar Pedido */}
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-atelier-700 bg-atelier-100 hover:bg-atelier-200 rounded-xl transition-colors border border-atelier-200 cursor-pointer"
            title="Consulte o estado da sua encomenda"
          >
            <Search className="w-3.5 h-3.5 text-brand" />
            <span className="hidden sm:inline">Acompanhar Encomenda</span>
            <span className="sm:hidden">Rastrear</span>
          </button>

          {/* Cart / Sacola Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2.5 bg-brand text-atelier-50 hover:bg-brand-dark rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            title="Ver encomenda de bótons"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-semibold">Minha Sacola</span>
            {cartCount > 0 && (
              <span className="bg-amber-400 text-brand-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center -mr-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
