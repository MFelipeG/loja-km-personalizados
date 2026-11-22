import React from 'react';
import { ShoppingBag, Search, Shield, Heart, Lock } from 'lucide-react';
import { InstagramIcon, TikTokIcon } from './Icons';

export default function Header({
  settings,
  cartCount,
  onOpenTracking,
  onOpenAdmin,
  onOpenCart,
  onScrollToStudio
}) {
  return (
    <header className="sticky top-0 z-40 bg-atelier-50/95 backdrop-blur-md border-b border-atelier-200/80 transition-all">
      {/* Top micro-announcement banner */}
      <div className="bg-brand text-atelier-50 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Heart className="w-3.5 h-3.5 fill-current text-brand-light" />
        <span>Bótons Ímãs Quadrados Premium • Fechamento rápido via WhatsApp com código único!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand/20 shadow-sm group-hover:scale-105 transition-transform">
            <img
              src="/assets/logo-km.jpg"
              alt="KM Personalizados"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to text initials if image not found
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-dark block leading-none">
              KM Personalizados
            </span>
            <span className="text-[11px] font-medium tracking-widest uppercase text-brand-leather/80 block mt-1">
              Ateliê de Bótons & Ímãs de Fotos
            </span>
          </div>
        </a>

        {/* Navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-atelier-700">
          <button
            onClick={onScrollToStudio}
            className="hover:text-brand transition-colors cursor-pointer"
          >
            Personalizar
          </button>
          <a href="#kits" className="hover:text-brand transition-colors">
            Kits & Valores
          </a>
          <a href="#prazos" className="hover:text-brand transition-colors">
            Prazos & Envio
          </a>
          <a href="#depoimentos" className="hover:text-brand transition-colors">
            Depoimentos
          </a>
          <a href="#em-breve" className="hover:text-brand transition-colors text-atelier-500">
            Em Breve
          </a>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Social Links */}
          {settings?.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram Oficial KM Personalizados"
              className="hidden sm:flex p-2 text-atelier-600 hover:text-brand hover:bg-atelier-100 rounded-full transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          )}

          {/* TikTok Link */}
          {settings?.tiktok && (
            <a
              href={settings.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok Oficial KM Personalizados"
              className="hidden sm:flex p-2 text-atelier-600 hover:text-brand hover:bg-atelier-100 rounded-full transition-colors"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
          )}

          {/* Acompanhar Pedido */}
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-atelier-700 bg-atelier-100 hover:bg-atelier-200 rounded-lg transition-colors border border-atelier-200"
            title="Consulte o status do seu pedido"
          >
            <Search className="w-4 h-4 text-brand" />
            <span className="hidden sm:inline">Acompanhar Pedido</span>
            <span className="sm:hidden">Rastrear</span>
          </button>

          {/* Cart / Sacola Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-brand text-atelier-50 hover:bg-brand-dark rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            title="Ver meus bótons personalizados"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-semibold">Minha Sacola</span>
            {cartCount > 0 && (
              <span className="bg-amber-400 text-brand-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center -mr-1">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin discreet button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-atelier-400 hover:text-atelier-700 hover:bg-atelier-100 rounded-lg transition-colors ml-1"
            title="Acesso Administrativo"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
