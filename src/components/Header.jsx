import React from 'react';
import { ShoppingBag, Search, Shield, Heart, Lock, Mail, FileText } from 'lucide-react';
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
      {/* Top micro-announcement banner */}
      <div className="bg-brand text-atelier-50 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-between max-w-7xl mx-auto">
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-atelier-200">
          <Mail className="w-3.5 h-3.5 text-brand-light" />
          <span>kmpersonalisados@gmail.com</span>
        </div>

        <div className="flex items-center justify-center gap-1.5 mx-auto sm:mx-0">
          <Heart className="w-3.5 h-3.5 fill-current text-rose-300" />
          <span>Ateliê em Portugal • Bótons Ímãs 6,1cm • Envio Rápido via CTT</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px]">
          <button
            onClick={onOpenTerms}
            className="text-atelier-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacidade & Garantia</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3.5 group">
          {/* Enhanced Crisp Brand Badge */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1 border-2 border-brand/20 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/assets/logo-km.jpg"
              alt="KM Personalizados"
              className="w-full h-full object-contain filter contrast-105"
            />
          </div>
          <div>
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark block leading-none">
              KM Personalizados
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-brand-leather block mt-1">
              Ateliê de Bótons & Ímãs de Fotos • Portugal 🇵🇹
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-atelier-700 bg-atelier-100 hover:bg-atelier-200 rounded-xl transition-colors border border-atelier-200 cursor-pointer"
            title="Consulte o estado da sua encomenda"
          >
            <Search className="w-3.5 h-3.5 text-brand" />
            <span className="hidden sm:inline">Acompanhar Encomenda</span>
            <span className="sm:hidden">Rastrear</span>
          </button>

          {/* Cart / Sacola Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-brand text-atelier-50 hover:bg-brand-dark rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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

          {/* Admin discreet button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-atelier-400 hover:text-atelier-700 hover:bg-atelier-100 rounded-lg transition-colors ml-0.5 cursor-pointer"
            title="Acesso da Equipa (/admin)"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
