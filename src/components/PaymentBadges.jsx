import React from 'react';

export function MbWayBadge({ size = "normal" }) {
  const isSmall = size === "small";
  return (
    <div className={`inline-flex items-center gap-1.5 ${isSmall ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded-lg bg-[#E51E2B] text-white font-sans font-black shadow-xs select-none`} title="Pagamento instantâneo via MB WAY">
      <svg className={isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
      </svg>
      <span className={`${isSmall ? 'text-[10px]' : 'text-xs'} tracking-tighter uppercase font-extrabold`}>
        MB WAY
      </span>
    </div>
  );
}

export function PixBadge({ size = "normal" }) {
  const isSmall = size === "small";
  return (
    <div className={`inline-flex items-center gap-1.5 ${isSmall ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded-lg bg-[#32BCAD] text-white font-sans font-bold shadow-xs select-none`} title="Pagamento via Pix (Chave ou QR Code)">
      <svg className={isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} viewBox="0 0 512 512" fill="currentColor">
        <path d="M112.5 124.7L18.4 218.8c-24.5 24.5-24.5 64.3 0 88.8l94.1 94.1 77.4-77.4-53.7-53.7c-9.8-9.8-9.8-25.7 0-35.5l53.7-53.7-77.4-77.2zm287 0l-77.4 77.4 53.7 53.7c9.8 9.8 9.8 25.7 0 35.5l-53.7 53.7 77.4 77.4 94.1-94.1c24.5-24.5 24.5-64.3 0-88.8l-94.1-94.8zM256 182.2l-53.7 53.7c-9.8 9.8-9.8 25.7 0 35.5L256 325.1l53.7-53.7c9.8-9.8 9.8-25.7 0-35.5L256 182.2z" />
      </svg>
      <span className={`${isSmall ? 'text-[10px]' : 'text-xs'} tracking-tight font-extrabold`}>
        Pix
      </span>
    </div>
  );
}

export function IbanBadge({ size = "normal" }) {
  const isSmall = size === "small";
  return (
    <div className={`inline-flex items-center gap-1.5 ${isSmall ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded-lg bg-atelier-800 text-atelier-100 border border-atelier-700 shadow-xs select-none`} title="Transferência Bancária / IBAN / SEPA">
      <svg className={isSmall ? "w-3.5 h-3.5 text-amber-400" : "w-4 h-4 text-amber-400"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z" />
      </svg>
      <span className={`${isSmall ? 'text-[10px]' : 'text-xs'} font-bold tracking-tight`}>
        IBAN / SEPA
      </span>
    </div>
  );
}

export function CashBadge({ size = "normal" }) {
  const isSmall = size === "small";
  return (
    <div className={`inline-flex items-center gap-1.5 ${isSmall ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded-lg bg-atelier-800 text-atelier-100 border border-atelier-700 shadow-xs select-none`} title="Levantamento em Mãos / Dinheiro">
      <svg className={isSmall ? "w-3.5 h-3.5 text-emerald-400" : "w-4 h-4 text-emerald-400"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="12" x="2" y="6" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
      <span className={`${isSmall ? 'text-[10px]' : 'text-xs'} font-bold tracking-tight`}>
        Levantamento (0€)
      </span>
    </div>
  );
}

export function CttBadge({ size = "normal" }) {
  const isSmall = size === "small";
  return (
    <div className={`inline-flex items-center gap-1.5 ${isSmall ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded-lg bg-[#D40026] text-white shadow-xs select-none`} title="Envios Rápidos CTT Portugal">
      <svg className={isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      <span className={`${isSmall ? 'text-[10px]' : 'text-xs'} font-black tracking-wider`}>
        CTT
      </span>
    </div>
  );
}

export default function PaymentBadges({ size = "normal", className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <MbWayBadge size={size} />
      <IbanBadge size={size} />
      <PixBadge size={size} />
      <CashBadge size={size} />
      <CttBadge size={size} />
    </div>
  );
}
