import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { WhatsAppIcon } from './Icons';

export default function FloatingWhatsApp({ settings }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappNumber = settings?.whatsappNumber || '351965639401';
  const defaultMessage = encodeURIComponent(
    'Olá KM Personalizados! Gostaria de tirar uma dúvida sobre os bótons ímãs.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="Apoio ao Cliente WhatsApp" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-none">
      {/* Friendly speech bubble / tooltip */}
      {showTooltip && (
        <div className="pointer-events-auto bg-white text-atelier-800 text-xs py-2 px-3.5 rounded-2xl shadow-xl border border-atelier-200/80 max-w-[210px] sm:max-w-[240px] flex items-start gap-2 animate-bounce-once relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-atelier-100 text-atelier-500 hover:text-atelier-800 hover:bg-atelier-200 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Fechar aviso"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
          <div className="leading-tight">
            <span className="font-bold text-brand-dark block text-[11px] sm:text-xs">
              Atendimento Online
            </span>
            <span className="text-[10px] sm:text-[11px] text-atelier-600 block mt-0.5">
              Dúvidas sobre o seu pedido? Fale connosco no WhatsApp!
            </span>
          </div>
        </div>
      )}

      {/* Main floating action button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a KM Personalizados no WhatsApp"
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
        title="Falar no WhatsApp (+351 965 639 401)"
      >
        {/* Subtle breathing ripple glow */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 group-hover:opacity-100" />
        
        {/* WhatsApp Icon */}
        <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-xs" />

        {/* Online green indicator dot */}
        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs" />
      </a>
    </aside>
  );
}
