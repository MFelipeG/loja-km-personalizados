import React, { useState } from 'react';
import { X, Search, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { getSavedOrderCodes } from '../utils/storage';

export default function OrderTrackingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const savedCodes = getSavedOrderCodes();

  const handleSearch = async (searchCode) => {
    const targetCode = searchCode || code;
    if (!targetCode.trim()) {
      setError('Por favor, informe o código do pedido (Ex: #BOT-1234).');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const clean = targetCode.trim();
      const res = await fetch(`/api/orders/${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Pedido não encontrado. Verifique o código e tente novamente.');
      }
    } catch (err) {
      setError('Erro de conexão ao consultar status do pedido.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepName) => {
    if (!order) return 'upcoming';
    const statusOrder = ['Pendente', 'Em Produção', 'Pronto', 'Enviado', 'Concluído'];
    const currentIdx = statusOrder.indexOf(order.status);
    const stepIdx = statusOrder.indexOf(stepName);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-atelier-50 border-b border-atelier-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-brand" />
            <h3 className="font-serif font-bold text-lg text-brand-dark">
              Acompanhar Meu Pedido
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-atelier-400 hover:text-atelier-700 hover:bg-atelier-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Search bar */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-atelier-700">
              Digite o código do seu pedido:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="#BOT-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2.5 text-sm font-mono uppercase rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
              />
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-5 py-2.5 bg-brand hover:bg-brand-dark disabled:bg-atelier-300 text-atelier-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Buscando...' : 'Consultar'}</span>
              </button>
            </div>

            {/* Quick search chips for recently placed orders on this device */}
            {savedCodes.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-atelier-500">
                <span>Pedidos Recentes:</span>
                {savedCodes.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCode(c);
                      handleSearch(c);
                    }}
                    className="px-2 py-0.5 rounded-md bg-atelier-100 hover:bg-atelier-200 text-brand font-mono font-semibold"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tracking Result View */}
          {order && (
            <div className="space-y-6 pt-2">
              
              {/* Order Info Bar */}
              <div className="bg-atelier-50 rounded-2xl p-4 border border-atelier-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-atelier-500 uppercase block">
                    Pedido {order.code}
                  </span>
                  <span className="font-serif font-bold text-base text-brand-dark">
                    {order.customerName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-atelier-500 uppercase block">
                    Status Atual
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-brand text-atelier-50">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-atelier-200">
                {[
                  { title: 'Pendente', desc: 'Pedido gerado no site e aguardando confirmação' },
                  { title: 'Em Produção', desc: 'Impressão 300 DPI e prensa dos bótons ímãs' },
                  { title: 'Pronto', desc: 'Embalado e pronto para entrega/coleta' },
                  { title: 'Enviado', desc: 'Postado nos Correios ou em rota com entregador' },
                  { title: 'Concluído', desc: 'Entregue com sucesso' }
                ].map((step, i) => {
                  const state = getStepStatus(step.title);
                  return (
                    <div key={i} className="relative">
                      <div
                        className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 transition-colors ${
                          state === 'completed'
                            ? 'bg-emerald-600 border-emerald-600'
                            : state === 'current'
                            ? 'bg-brand border-brand ring-4 ring-brand/20'
                            : 'bg-white border-atelier-300'
                        }`}
                      />
                      <h4 className={`text-xs font-bold ${state === 'current' ? 'text-brand' : 'text-atelier-800'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-atelier-500 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Items Preview */}
              {order.items && order.items.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-atelier-100">
                  <span className="text-xs font-bold text-atelier-700 block">
                    Fotos do Pedido ({order.items.length} itens):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {order.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="w-14 h-14 rounded-xl overflow-hidden border border-atelier-200 shrink-0 bg-atelier-100"
                      >
                        <img
                          src={it.previewUrl}
                          alt={`Item ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
