import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Truck,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone,
  User,
  ArrowRight,
  Gift,
  Printer,
  Download,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveOrderCode, clearDraftPhotos } from '../utils/storage';
import PaymentBadges from './PaymentBadges';

export default function CartCheckout({
  isOpen,
  onClose,
  items,
  targetKit,
  settings,
  onOpenTerms
}) {
  if (!isOpen) return null;

  // Form states (Portugal)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [concelho, setConcelho] = useState('');
  const [district, setDistrict] = useState('');
  const [complement, setComplement] = useState('');

  // Shipping selection (CTT Portugal from Google Sheets)
  const shippingMethods = settings?.shippingMethods || [
    { id: 'ctt-verde', name: 'CTT Correio Verde (Almofadada)', fee: 2.70, days: 2, desc: 'Económico e rápido para todo o país' },
    { id: 'ctt-registado', name: 'CTT Correio Registado (Com Rastreio)', fee: 3.20, days: 1, desc: 'Entrega segura em mão com rastreio oficial' },
    { id: 'inpost-locker', name: 'InPost (Cacifo Automático 24h)', fee: 3.85, days: 3, desc: 'Levantamento no cacifo mais próximo' },
    { id: 'levantamento-local', name: 'Levantamento em Mãos', fee: 0.00, days: 1, desc: 'Grátis - A combinar pelo WhatsApp' }
  ];

  const [selectedMethodId, setSelectedMethodId] = useState(shippingMethods[0]?.id || 'ctt-verde');

  // Addons / Embalagens Especiais de Presente
  const [addons, setAddons] = useState(settings?.addons || []);
  const [selectedAddonId, setSelectedAddonId] = useState(null);

  useEffect(() => {
    fetch('/api/addons')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAddons(data);
        }
      })
      .catch(() => {});
  }, []);

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  // Compute pricing in Euro (€) with progressive and combo rules
  const count = items.length;

  // Pricing rules:
  // - Minimum 2 units = 11,00 € (5,50 € / un)
  // - Kit Inauguração (5+1 Grátis = 6 un): 25,00 € (Limite de 1 combo por cliente/pedido)
  // - Progressive Tiers:
  //   2 a 24 un: 5,50 € cada
  //   25 a 49 un: 4,50 € cada (ex: 25 un = 112,50 €)
  //   50 a 74 un: 4,00 € cada (ex: 50 un = 200,00 €)
  //   75 a 99 un: 3,50 € cada (ex: 75 un = 262,50 €)
  //   100+ un: 3,00 € cada (ex: 100 un = 300,00 €)
  let subtotal = 11.00;
  let matchedKitName = `${count} Bótons Ímãs`;
  let isPromoApplied = false;
  let hasPromoExceeded = false;

  const isPromoTarget = targetKit?.id === 'promo-inauguracao' || (count >= 5 && count <= 6);

  if (isPromoTarget) {
    if (count <= 6) {
      subtotal = 25.00;
      matchedKitName = 'Kit Inauguração (5 + 1 Grátis)';
      isPromoApplied = true;
    } else {
      // 1 promo combo (6 units for 25€) + additional units at standard/progressive pricing
      const extra = count - 6;
      let extraPrice = 0;
      if (extra < 25) {
        extraPrice = extra * 5.50;
      } else if (extra < 50) {
        extraPrice = extra * 4.50;
      } else if (extra < 75) {
        extraPrice = extra * 4.00;
      } else if (extra < 100) {
        extraPrice = extra * 3.50;
      } else {
        extraPrice = extra * 3.00;
      }
      subtotal = 25.00 + extraPrice;
      matchedKitName = `Kit Inauguração (6 un.) + ${extra} Adicionais`;
      isPromoApplied = true;
      hasPromoExceeded = true;
    }
  } else {
    // Normal / Progressive Tiers
    if (count <= 2) {
      subtotal = 11.00;
      matchedKitName = 'Pedido Mínimo (2 Bótons)';
    } else if (count < 25) {
      subtotal = count * 5.50;
      matchedKitName = `${count} Bótons Ímãs (5,50 €/un)`;
    } else if (count < 50) {
      subtotal = count * 4.50;
      matchedKitName = `Kit Eventos (${count} un. • 4,50 €/un)`;
    } else if (count < 75) {
      subtotal = count * 4.00;
      matchedKitName = `Kit Eventos (${count} un. • 4,00 €/un)`;
    } else if (count < 100) {
      subtotal = count * 3.50;
      matchedKitName = `Kit Eventos (${count} un. • 3,50 €/un)`;
    } else {
      subtotal = count * 3.00;
      matchedKitName = `Kit Eventos (${count} un. • 3,00 €/un)`;
    }
  }

  const selectedShipping = shippingMethods.find((m) => m.id === selectedMethodId) || shippingMethods[0];
  const shippingFee = selectedShipping ? selectedShipping.fee : 2.70;
  const selectedAddon = addons.find((a) => a.id === selectedAddonId);
  const addonFee = selectedAddon ? Number(selectedAddon.price) || 0 : 0;
  const grandTotal = subtotal + shippingFee + addonFee;

  // Submit Order and Launch WhatsApp with Welcome Message & #BOT-XXXX
  const handleFinishOrder = async () => {
    if (!customerName.trim()) {
      alert('Por favor, informe o seu nome.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Por favor, informe o seu contacto telefónico / WhatsApp.');
      return;
    }
    if (items.length < 2) {
      alert('O pedido mínimo é de 2 bótons ímãs.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        kitId: targetKit?.id || 'personalizado',
        kitName: matchedKitName,
        quantity: items.length,
        subtotal,
        shippingFee,
        shippingType: selectedShipping.name,
        estimatedDays: selectedShipping.days,
        packaging: selectedAddon
          ? {
              id: selectedAddon.id,
              name: selectedAddon.name,
              price: Number(selectedAddon.price) || 0,
              sheetItemName: selectedAddon.sheetItemName || selectedAddon.name
            }
          : null,
        packagingFee: addonFee,
        currency: '€',
        address: {
          postalCode: postalCode.trim(),
          street: street.trim(),
          number: number.trim(),
          concelho: concelho.trim(),
          district: district.trim(),
          complement: complement.trim()
        },
        items: items.map((it) => ({
          imageUrl: it.src,
          previewUrl: it.previewUrl || it.src,
          zoom: it.zoom || 1,
          panX: it.panX || 0,
          panY: it.panY || 0,
          blur: it.blur || 8,
          width: it.width,
          height: it.height,
          qualityBadge: it.qualityBadge
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Falha ao registar encomenda no servidor.');
      }

      const data = await res.json();
      const order = data.order;
      setCompletedOrder(order);
      saveOrderCode(order.code);
      clearDraftPhotos();

      // Trigger celebratory confetti effect
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Prepare official WhatsApp message with Welcome greeting and Order Code
      const waNumber = (settings?.whatsapp || '351965639401').replace(/\D/g, '');
      const fullAddressStr = street
        ? `${street}, ${number || 'S/N'}${complement ? ` (${complement})` : ''} - ${postalCode || ''} ${concelho || ''}`
        : 'A combinar no WhatsApp';

      const packagingInfo = selectedAddon
        ? `🎁 *Embalagem Escolhida:* ${selectedAddon.name} (+${Number(selectedAddon.price).toFixed(2).replace('.', ',')} €)\n`
        : `🎁 *Embalagem:* Padrão de Envio (Grátis)\n`;

      const msg = `Olá KM Personalizados! ✨\n` +
        `Acabei de montar o meu pedido no vosso site!\n\n` +
        `📦 *NÚMERO DO PEDIDO:* ${order.code}\n` +
        `👤 *Nome:* ${order.customerName}\n` +
        `📱 *Contacto:* ${order.customerPhone}\n` +
        `🖼️ *Quantidade:* ${order.quantity} Bótons Ímãs Quadrados (${order.kitName})\n` +
        `💰 *Subtotal:* ${order.subtotal.toFixed(2).replace('.', ',')} €\n` +
        packagingInfo +
        `🚚 *Envio:* ${order.shippingType} (${order.shippingFee.toFixed(2).replace('.', ',')} €)\n` +
        `💵 *TOTAL A PAGAR:* ${order.total.toFixed(2).replace('.', ',')} €\n\n` +
        `📍 *Morada de Entrega:* ${fullAddressStr}\n\n` +
        `As minhas fotografias já ficaram salvas no site (https://kmpersonalisados.art) com o código ${order.code}! Gostaria de receber os dados para pagamento (MB WAY, Transferência Bancária ou Pix). Muito obrigado! 💖`;

      const encodedMsg = encodeURIComponent(msg);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

      window.open(waUrl, '_blank');
    } catch (err) {
      alert(`Erro ao finalizar encomenda: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-atelier-50 border-b border-atelier-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand text-atelier-50 flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-dark">
                {completedOrder ? 'Encomenda Registada!' : 'A Minha Sacola de Bótons'}
              </h3>
              <p className="text-xs text-atelier-500">
                {completedOrder ? 'Código único gerado' : `${count} itens configurados • Portugal (€)`}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {completedOrder ? (
            /* =================== COMPLETED ORDER VIEW =================== */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Fotos Salvas em Alta Resolução
                </span>
                <h3 className="font-serif text-2xl font-bold text-brand-dark">
                  A sua Encomenda foi Registada!
                </h3>
                <p className="text-xs sm:text-sm text-atelier-600 max-w-md mx-auto">
                  Guarde o seu código exclusivo. Ele já está vinculado às suas fotos no ateliê da KM Personalizados:
                </p>
              </div>

              {/* Unique Code Badge with Copy button */}
              <div className="bg-atelier-100 rounded-2xl p-4 border border-atelier-300 max-w-md mx-auto flex items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[11px] font-semibold text-atelier-500 uppercase block">
                    Código da Encomenda
                  </span>
                  <span className="font-mono text-2xl font-extrabold text-brand tracking-wider">
                    {completedOrder.code}
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="px-4 py-2 bg-white hover:bg-atelier-50 text-atelier-800 text-xs font-bold rounded-xl border border-atelier-300 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-brand" />
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Order Quick Summary */}
              <div className="bg-atelier-50 rounded-2xl p-4 text-xs text-atelier-700 max-w-md mx-auto text-left space-y-2 border border-atelier-200">
                <div className="flex justify-between">
                  <span>Itens:</span>
                  <span className="font-semibold">{completedOrder.quantity} Bótons ({completedOrder.kitName})</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{completedOrder.subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                {completedOrder.packaging && (
                  <div className="flex justify-between text-brand font-medium">
                    <span>Embalagem:</span>
                    <span className="font-semibold">{completedOrder.packaging.name} (+{Number(completedOrder.packaging.price).toFixed(2).replace('.', ',')} €)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envio ({completedOrder.shippingType}):</span>
                  <span className="font-semibold">{completedOrder.shippingFee.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-atelier-200 text-sm font-bold text-brand-dark">
                  <span>Total a Pagar:</span>
                  <span className="text-base text-brand">
                    {completedOrder.total.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              </div>

              {/* WhatsApp Launch Button */}
              <div className="space-y-3 max-w-md mx-auto">
                <a
                  href={`https://wa.me/${(settings?.whatsapp || '351965639401').replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Olá KM Personalizados! O meu pedido é o ${completedOrder.code}. As minhas fotos já foram salvas no site. Gostaria de acertar o pagamento!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-tactile flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <span>Abrir Conversa no WhatsApp</span>
                  <ExternalLink className="w-5 h-5" />
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-xs text-atelier-500 hover:text-atelier-800 font-semibold cursor-pointer"
                >
                  Concluir e Fechar Janela
                </button>
              </div>

            </div>
          ) : (
            /* =================== CHECKOUT & FREIGHT FORM =================== */
            <div className="space-y-6">
              
              {/* Items Summary preview */}
              <div className="bg-atelier-50 rounded-2xl p-4 border border-atelier-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-brand-dark">
                  <span>{matchedKitName}</span>
                  <span className="text-base text-brand">
                    {subtotal.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
                <p className="text-xs text-atelier-500">
                  {count} bóton(s) ímã quadrado(s) com borda borrada 6,1cm e área segura 5,0cm.
                </p>
                {isPromoApplied && (
                  <div className="space-y-1.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                      <Gift className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      Promoção de Inauguração: Paga 5 e leva 1 de BRINDE (6 fotos por 25 €)!
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 bg-amber-50/90 px-2.5 py-1.5 rounded-lg border border-amber-200/80">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Limite de 1 combo promocional por cliente/pedido.</span>
                    </div>
                  </div>
                )}
                {hasPromoExceeded && (
                  <p className="text-[10.5px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 leading-relaxed">
                    * Como a promoção é limitada a 1 combo por cliente/pedido, as primeiras 6 unidades foram calculadas no valor promocional de 25 €, e as unidades adicionais na tabela normal.
                  </p>
                )}
              </div>

              {/* Packaging / Add-ons Selection */}
              <div className="bg-white rounded-2xl p-4 border border-atelier-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-brand-dark">
                  <span className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-brand" />
                    <span>Deseja Adicionar uma Embalagem Especial para Presente?</span>
                  </span>
                  <span className="text-[10px] text-brand bg-brand-cream/80 px-2 py-0.5 rounded-full font-medium">
                    Opcional
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option: Standard Packaging */}
                  <div
                    onClick={() => setSelectedAddonId(null)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      selectedAddonId === null
                        ? 'border-brand bg-brand-cream/60 ring-2 ring-brand/10'
                        : 'border-atelier-200 hover:bg-atelier-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="packagingChoice"
                      checked={selectedAddonId === null}
                      onChange={() => setSelectedAddonId(null)}
                      className="accent-brand mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-dark">Embalagem Padrão</span>
                        <span className="text-emerald-700 font-bold text-[11px]">Grátis</span>
                      </div>
                      <p className="text-[11px] text-atelier-500 mt-0.5">
                        Envelope almofadado seguro e discreto para proteção no envio.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Addons */}
                  {addons.map((addon) => {
                    const isSelected = selectedAddonId === addon.id;
                    return (
                      <div
                        key={addon.id}
                        onClick={() => setSelectedAddonId(addon.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-brand bg-brand-cream/60 ring-2 ring-brand/10'
                            : 'border-atelier-200 hover:bg-atelier-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="packagingChoice"
                          checked={isSelected}
                          onChange={() => setSelectedAddonId(addon.id)}
                          className="accent-brand mt-1"
                        />
                        {addon.imageUrl && (
                          <img
                            src={addon.imageUrl}
                            alt={addon.name}
                            className="w-12 h-12 object-cover rounded-lg border border-atelier-200 shrink-0 shadow-2xs"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-brand-dark truncate">{addon.name}</span>
                            <span className="text-brand font-bold text-xs whitespace-nowrap">
                              +{Number(addon.price).toFixed(2).replace('.', ',')} €
                            </span>
                          </div>
                          {addon.description && (
                            <p className="text-[10.5px] text-atelier-500 line-clamp-2 mt-0.5 leading-snug">
                              {addon.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Selection (Portugal CTT & Google Sheets Options) */}
              <div className="bg-white rounded-2xl p-4 border border-atelier-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-brand-dark">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand" />
                    <span>Selecione a Modalidade de Envio (Portugal)</span>
                  </span>
                  <span className="text-[10px] text-atelier-500 font-normal">
                    Via CTT / InPost
                  </span>
                </div>

                <div className="space-y-2">
                  {shippingMethods.map((m) => {
                    const isSelected = selectedMethodId === m.id;
                    return (
                      <label
                        key={m.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brand bg-brand-cream/60 ring-2 ring-brand/10'
                            : 'border-atelier-200 hover:bg-atelier-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={isSelected}
                            onChange={() => setSelectedMethodId(m.id)}
                            className="accent-brand"
                          />
                          <div>
                            <span className="font-bold text-brand-dark block">{m.name}</span>
                            <span className="text-[11px] text-atelier-500 block">{m.desc}</span>
                          </div>
                        </div>

                        <span className="font-bold text-brand text-sm whitespace-nowrap ml-2">
                          {m.fee === 0 ? 'Grátis' : `${m.fee.toFixed(2).replace('.', ',')} €`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Customer Contact Information */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-brand-dark flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand" />
                  <span>Os Seus Dados de Contacto</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-atelier-700 mb-1">
                      O Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Maria Silva"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-atelier-700 mb-1">
                      Telemóvel / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: +351 912 345 678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address (Portugal Postal Code) */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-brand-dark flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand" />
                  <span>Morada de Entrega em Portugal</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Rua / Avenida"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Nº / Andar / Porta"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Código Postal (XXXX-XXX)"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      maxLength={8}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand font-mono"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Freguesia / Concelho"
                      value={concelho}
                      onChange={(e) => setConcelho(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Distrito / Ilha"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              {/* Totals Box in Euro */}
              <div className="bg-atelier-50 rounded-2xl p-4 border border-atelier-200 space-y-2 text-xs text-atelier-700">
                <div className="flex justify-between">
                  <span>Subtotal ({count} bótons):</span>
                  <span className="font-semibold">{subtotal.toFixed(2).replace('.', ',')} €</span>
                </div>
                {addonFee > 0 && selectedAddon && (
                  <div className="flex justify-between text-brand font-medium">
                    <span>Embalagem Especial ({selectedAddon.name}):</span>
                    <span className="font-semibold">+{addonFee.toFixed(2).replace('.', ',')} €</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envio ({selectedShipping.name}):</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? 'Grátis' : `${shippingFee.toFixed(2).replace('.', ',')} €`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-atelier-200 text-base font-bold text-brand-dark">
                  <span>Total da Encomenda:</span>
                  <span className="text-xl text-brand font-extrabold">
                    {grandTotal.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              </div>

              {/* Accepted Payments Preview */}
              <div className="bg-white rounded-xl p-3 border border-atelier-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-atelier-700">Formas de Pagamento Aceites:</span>
                <PaymentBadges size="small" />
              </div>

              {/* Finish Button */}
              <button
                disabled={isSubmitting || count < 2}
                onClick={handleFinishOrder}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-atelier-300 text-white font-bold text-base shadow-tactile transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>{isSubmitting ? 'A salvar fotos & a criar encomenda...' : 'Salvar Fotos & Abrir no WhatsApp'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-[11px] text-center text-atelier-500 space-y-1.5 pt-1">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>As suas fotografias são guardadas apenas até a encomenda ser entregue, sendo depois apagadas.</span>
                </p>
                <p className="text-[10px] text-atelier-400">
                  * Artigos personalizados sob encomenda: em caso de desistência após o início da produção, será retido no mínimo 50% do valor para custos operacionais e de materiais.
                </p>
                {onOpenTerms && (
                  <button
                    onClick={onOpenTerms}
                    className="text-brand hover:underline font-semibold cursor-pointer block mx-auto text-xs"
                  >
                    Consulte os Termos de Uso, Cancelamento & Reembolso
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
