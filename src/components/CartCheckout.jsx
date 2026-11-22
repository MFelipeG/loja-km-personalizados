import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveOrderCode, clearDraftPhotos } from '../utils/storage';

export default function CartCheckout({
  isOpen,
  onClose,
  items,
  targetKit,
  settings
}) {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [complement, setComplement] = useState('');

  // Shipping calculation state
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingResult, setShippingResult] = useState(null);
  const [shippingError, setShippingError] = useState('');

  // Order submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  // Compute pricing
  const count = items.length;
  const kits = settings?.kits || [];

  // Match best price based on count or target kit
  let subtotal = 0;
  let matchedKitName = `${count} Unidades`;

  if (count === 1) {
    subtotal = 6.00;
    matchedKitName = 'Unidade Avulsa';
  } else if (count <= 6) {
    subtotal = 27.00;
    matchedKitName = 'Kit 6 Unidades';
  } else if (count <= 12) {
    subtotal = 48.00;
    matchedKitName = 'Kit 12 Unidades (Folha Inteira)';
  } else if (count <= 24) {
    subtotal = 89.00;
    matchedKitName = 'Kit 24 Unidades (2 Folhas)';
  } else {
    // 24 + additional
    const extra = count - 24;
    subtotal = 89.00 + extra * 3.70;
    matchedKitName = `Kit Promocional ${count} Unidades`;
  }

  const shippingFee = shippingResult ? shippingResult.fee : 0;
  const grandTotal = subtotal + shippingFee;

  // Real-time Shipping Calculation (Google Sheets CSV via proxy or fallback)
  const handleCalculateShipping = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length < 5 && !city) {
      setShippingError('Digite o CEP ou Cidade para calcular o frete.');
      return;
    }

    setShippingLoading(true);
    setShippingError('');
    try {
      const params = new URLSearchParams();
      if (cleanCep) params.append('cep', cleanCep);
      if (city) params.append('city', city);
      if (neighborhood) params.append('neighborhood', neighborhood);

      const res = await fetch(`/api/shipping/calculate?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setShippingResult(data);
      } else {
        setShippingError('Não foi possível calcular o frete no momento.');
      }
    } catch (err) {
      setShippingError('Erro de conexão ao buscar taxa de entrega.');
    } finally {
      setShippingLoading(false);
    }
  };

  // Auto-search CEP via ViaCEP for autocomplete
  const handleCepBlur = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length === 8) {
      handleCalculateShipping();
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        if (res.ok) {
          const data = await res.json();
          if (!data.erro) {
            setStreet(data.logradouro || '');
            setNeighborhood(data.bairro || '');
            setCity(data.localidade || '');
            setState(data.uf || '');
          }
        }
      } catch {}
    }
  };

  // Submit Order and Generate WhatsApp
  const handleFinishOrder = async () => {
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Por favor, informe seu telefone / WhatsApp para contato.');
      return;
    }
    if (items.length === 0) {
      alert('Adicione pelo menos uma foto ao pedido.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create order payload
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        kitId: targetKit?.id || 'custom',
        kitName: matchedKitName,
        quantity: items.length,
        subtotal,
        shippingFee,
        shippingType: shippingResult?.region || 'Envio Padrão',
        estimatedDays: shippingResult?.days || settings?.productionDays || 3,
        address: {
          cep: cep.trim(),
          street: street.trim(),
          number: number.trim(),
          neighborhood: neighborhood.trim(),
          city: city.trim(),
          state: state.trim(),
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
        throw new Error('Falha ao salvar pedido no servidor.');
      }

      const data = await res.json();
      const order = data.order;
      setCompletedOrder(order);
      saveOrderCode(order.code);
      clearDraftPhotos();

      // Trigger celebratory confetti effect
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Prepare WhatsApp URL
      const waNumber = (settings?.whatsapp || '5541999999999').replace(/\D/g, '');
      const msg = `Olá KM Personalizados! ✨\n` +
        `Gostaria de confirmar meu pedido de Bótons Ímãs Quadrados:\n\n` +
        `📦 *Pedido:* ${order.code}\n` +
        `👤 *Cliente:* ${order.customerName}\n` +
        `🖼️ *Quantidade:* ${order.quantity} unidades (${order.kitName})\n` +
        `💰 *Subtotal:* R$ ${order.subtotal.toFixed(2).replace('.', ',')}\n` +
        `🚚 *Frete:* R$ ${order.shippingFee.toFixed(2).replace('.', ',')} (${order.shippingType} - Prazo estimado: ${order.estimatedDays} dias úteis)\n` +
        `💵 *Total a Pagar:* R$ ${order.total.toFixed(2).replace('.', ',')}\n\n` +
        `Minhas fotos já foram salvas e vinculadas ao código no site! Aguardo os dados para pagamento via Pix. 💖`;

      const encodedMsg = encodeURIComponent(msg);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');
    } catch (err) {
      alert(`Erro ao finalizar pedido: ${err.message}`);
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-atelier-50 border-b border-atelier-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand text-atelier-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-dark">
                {completedOrder ? 'Pedido Concluído!' : 'Minha Sacola de Bótons'}
              </h3>
              <p className="text-xs text-atelier-500">
                {completedOrder ? 'Código gerado com sucesso' : `${count} itens configurados`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-atelier-400 hover:text-atelier-700 hover:bg-atelier-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {completedOrder ? (
            /* =================== COMPLETED ORDER VIEW =================== */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Fotos Salvas com Segurança
                </span>
                <h3 className="font-serif text-2xl font-bold text-brand-dark">
                  Seu Pedido foi Registrado!
                </h3>
                <p className="text-sm text-atelier-600 max-w-md mx-auto">
                  Guarde o seu código único. Ele já está vinculado às suas fotos de alta resolução no ateliê da KM Personalizados:
                </p>
              </div>

              {/* Unique Code Badge with Copy button */}
              <div className="bg-atelier-100 rounded-2xl p-4 border border-atelier-300 max-w-md mx-auto flex items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[11px] font-semibold text-atelier-500 uppercase block">
                    Código do Pedido
                  </span>
                  <span className="font-mono text-2xl font-extrabold text-brand tracking-wider">
                    {completedOrder.code}
                  </span>
                </div>
                <button
                  onClick={copyCode}
                  className="px-4 py-2 bg-white hover:bg-atelier-50 text-atelier-800 text-xs font-bold rounded-xl border border-atelier-300 flex items-center gap-1.5 shadow-xs transition-colors"
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
                  <span className="font-semibold">R$ {completedOrder.subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete ({completedOrder.shippingType}):</span>
                  <span className="font-semibold">R$ {completedOrder.shippingFee.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-atelier-200 text-sm font-bold text-brand-dark">
                  <span>Total:</span>
                  <span>R$ {completedOrder.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* WhatsApp Launch Button */}
              <div className="space-y-3 max-w-md mx-auto">
                <a
                  href={`https://wa.me/${(settings?.whatsapp || '5541999999999').replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Olá KM Personalizados! Meu pedido é o ${completedOrder.code}. As fotos já estão salvas no site. Gostaria de acertar o pagamento via Pix!`
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
                  className="w-full py-2.5 text-xs text-atelier-500 hover:text-atelier-800 font-semibold"
                >
                  Fechar Janela
                </button>
              </div>

            </div>
          ) : (
            /* =================== CHECKOUT & FREIGHT FORM =================== */
            <div className="space-y-6">
              
              {/* Items Summary preview */}
              <div className="bg-atelier-50 rounded-2xl p-4 border border-atelier-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-brand-dark">
                  <span>{matchedKitName}</span>
                  <span className="text-base text-brand">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-xs text-atelier-500">
                  {count} bóton(s) quadrado(s) com borda borrada 6,1cm e área segura 5,0cm.
                </p>
              </div>

              {/* Shipping Calculator (Google Sheets) */}
              <div className="bg-white rounded-2xl p-4 border border-atelier-200 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-dark">
                  <Truck className="w-4 h-4 text-brand" />
                  <span>Calcular Frete & Prazo de Entrega</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-8">
                    <input
                      type="text"
                      placeholder="Digite seu CEP (Ex: 80000-000)"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      onBlur={handleCepBlur}
                      maxLength={9}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <button
                      onClick={handleCalculateShipping}
                      disabled={shippingLoading}
                      className="w-full py-2.5 px-4 bg-atelier-100 hover:bg-atelier-200 text-atelier-800 font-bold text-xs rounded-xl border border-atelier-300 transition-colors cursor-pointer"
                    >
                      {shippingLoading ? 'Calculando...' : 'Calcular'}
                    </button>
                  </div>
                </div>

                {/* Shipping result pill */}
                {shippingResult && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div>
                      <span className="font-bold">{shippingResult.region || 'Entrega Padrão'}</span>
                      <span className="text-[11px] text-emerald-700 block">
                        Prazo estimado: {shippingResult.days} a {shippingResult.days + 2} dias úteis
                      </span>
                    </div>
                    <span className="font-bold text-sm text-emerald-800">
                      R$ {shippingResult.fee.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}

                {shippingError && (
                  <p className="text-xs text-rose-600">{shippingError}</p>
                )}
              </div>

              {/* Customer Contact Information */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-brand-dark flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand" />
                  <span>Seus Dados para o Pedido</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-atelier-700 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Ana Clara Lima"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-atelier-700 mb-1">
                      WhatsApp para Contato *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: (41) 99999-9999"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-brand-dark flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand" />
                  <span>Endereço de Entrega (Opcional se for retirada)</span>
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
                      placeholder="Número"
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
                      placeholder="Bairro"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="UF (Estado)"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      maxLength={2}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Totals Box */}
              <div className="bg-atelier-50 rounded-2xl p-4 border border-atelier-200 space-y-2 text-xs text-atelier-700">
                <div className="flex justify-between">
                  <span>Subtotal ({count} bótons):</span>
                  <span className="font-semibold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span className="font-semibold">
                    {shippingResult ? `R$ ${shippingFee.toFixed(2).replace('.', ',')}` : 'A calcular'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-atelier-200 text-base font-bold text-brand-dark">
                  <span>Total do Pedido:</span>
                  <span className="text-xl text-brand">
                    R$ {grandTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Finish Button */}
              <button
                disabled={isSubmitting || count === 0}
                onClick={handleFinishOrder}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-atelier-300 text-white font-bold text-base shadow-tactile transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>{isSubmitting ? 'Salvando Fotos & Criando Pedido...' : 'Salvar Fotos & Finalizar no WhatsApp'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-[11px] text-center text-atelier-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Suas fotos serão salvas em alta qualidade vinculadas ao seu código de pedido.</span>
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
