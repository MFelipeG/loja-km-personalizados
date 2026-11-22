import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Package,
  MessageSquare,
  Settings,
  Printer,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  ExternalLink,
  Save,
  Clock,
  Truck,
  Plus,
  RefreshCw,
  X
} from 'lucide-react';
import A4PrintModal from './A4PrintModal';

export default function AdminPanel({ isOpen, onClose, onSettingsUpdated }) {
  if (!isOpen) return null;

  // Authentication states
  const [token, setToken] = useState(localStorage.getItem('km_admin_token') || '');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'reviews', 'settings'

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    whatsapp: '',
    productionDays: 3,
    shippingInfoText: '',
    careInstructions: '',
    googleSheetsCsvUrl: '',
    kits: [],
    newPassword: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');

  // Fetch admin orders
  const fetchOrders = async (authToken = token) => {
    if (!authToken) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch all reviews for moderation
  const fetchReviews = async (authToken = token) => {
    if (!authToken) return;
    setLoadingReviews(true);
    try {
      const res = await fetch('/api/admin/reviews', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Fetch current store settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettingsForm({
          whatsapp: data.whatsapp || '',
          productionDays: data.productionDays || 3,
          shippingInfoText: data.shippingInfoText || '',
          careInstructions: data.careInstructions || '',
          googleSheetsCsvUrl: data.googleSheetsCsvUrl || '',
          kits: data.kits || [],
          newPassword: ''
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(token);
      fetchReviews(token);
      fetchSettings();
    }
  }, [token]);

  // Login action
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput
        })
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('km_admin_token', data.token);
        fetchOrders(data.token);
        fetchReviews(data.token);
        fetchSettings();
      } else {
        const err = await res.json().catch(() => ({}));
        setLoginError(err.error || 'Credenciais inválidas.');
      }
    } catch {
      setLoginError('Erro de conexão ao autenticar.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('km_admin_token');
  };

  // Update order status
  const handleStatusChange = async (code, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(code)}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  // Delete completed order
  const handleDeleteOrder = async (code) => {
    if (!confirm(`Deseja realmente excluir o pedido ${code}? Esta ação não pode ser desfeita.`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(code)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      alert('Erro ao excluir pedido: ' + err.message);
    }
  };

  // Moderate review status
  const handleReviewStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      alert('Erro ao moderar avaliação: ' + err.message);
    }
  };

  // Delete review
  const handleDeleteReview = async (id) => {
    if (!confirm('Deseja excluir esta avaliação?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      alert('Erro ao excluir avaliação: ' + err.message);
    }
  };

  // Save Store Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });

      if (res.ok) {
        setSettingsSavedMessage('Configurações salvas com sucesso!');
        if (onSettingsUpdated) onSettingsUpdated();
        setTimeout(() => setSettingsSavedMessage(''), 3000);
      } else {
        alert('Erro ao salvar configurações.');
      }
    } catch (err) {
      alert('Erro de conexão ao salvar configurações.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    return (
      o.code?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-brand-dark text-atelier-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/50 border border-brand-light/30 flex items-center justify-center text-atelier-50">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                Painel Administrativo KM Personalizados
              </h3>
              <p className="text-xs text-atelier-300">
                Gestão de Pedidos, Impressão A4 300 DPI, Moderação & Configurações
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Sair do painel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desconectar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-atelier-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= LOGIN FORM (IF NOT AUTHENTICATED) ================= */}
        {!token ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-brand-cream border border-brand-light/40 flex items-center justify-center mx-auto text-brand">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-serif text-2xl font-bold text-brand-dark">
                Acesso Restrito
              </h4>
              <p className="text-xs text-atelier-500 mt-1">
                Apenas para a equipe do ateliê. Clientes não precisam de login para comprar ou rastrear.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-atelier-700 mb-1">
                  Usuário
                </label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-atelier-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                />
                <span className="text-[10px] text-atelier-400 mt-1 block">
                  Padrão inicial: admin / admin123 (alterável na aba Configurações)
                </span>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 bg-brand hover:bg-brand-dark disabled:bg-atelier-300 text-atelier-50 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {loggingIn ? 'Autenticando...' : 'Entrar no Painel'}
              </button>
            </form>
          </div>
        ) : (
          /* ================= AUTHENTICATED ADMIN DASHBOARD ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Admin Tabs Bar */}
            <div className="px-6 py-2.5 bg-atelier-50 border-b border-atelier-200 flex items-center gap-4 text-xs font-bold text-atelier-600">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-brand text-atelier-50 shadow-xs'
                    : 'hover:bg-atelier-100 text-atelier-700'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Gestão de Pedidos ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-brand text-atelier-50 shadow-xs'
                    : 'hover:bg-atelier-100 text-atelier-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Moderação de Depoimentos ({reviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-3 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-brand text-atelier-50 shadow-xs'
                    : 'hover:bg-atelier-100 text-atelier-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Configurações & Planilha</span>
              </button>
            </div>

            {/* Tab 1: Orders Management */}
            {activeTab === 'orders' && (
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                
                {/* Search & Refresh */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-atelier-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Buscar por código ou cliente..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>

                  <button
                    onClick={() => fetchOrders()}
                    className="px-3 py-2 text-xs font-semibold text-atelier-700 bg-atelier-100 hover:bg-atelier-200 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-brand" />
                    <span>Atualizar Lista</span>
                  </button>
                </div>

                {/* Orders List Table */}
                {loadingOrders ? (
                  <p className="text-center py-8 text-xs text-atelier-500">Carregando pedidos...</p>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-atelier-500 space-y-2">
                    <Package className="w-10 h-10 mx-auto text-atelier-400" />
                    <p className="text-sm font-semibold">Nenhum pedido encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((ord) => (
                      <div
                        key={ord.id || ord.code}
                        className="p-4 sm:p-5 bg-white rounded-2xl border border-atelier-200 shadow-xs space-y-4 hover:border-brand/30 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-atelier-100">
                          <div>
                            <span className="font-mono text-base font-extrabold text-brand mr-3">
                              {ord.code}
                            </span>
                            <span className="font-serif font-bold text-sm text-brand-dark">
                              {ord.customerName}
                            </span>
                            <span className="text-xs text-atelier-500 ml-2">
                              ({ord.customerPhone})
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-brand-dark">
                              Total: R$ {ord.total?.toFixed(2).replace('.', ',')}
                            </span>
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.code, e.target.value)}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-atelier-300 bg-atelier-50 text-atelier-800 focus:outline-none focus:border-brand"
                            >
                              <option value="Pendente">Pendente</option>
                              <option value="Em Produção">Em Produção</option>
                              <option value="Pronto">Pronto</option>
                              <option value="Enviado">Enviado</option>
                              <option value="Concluído">Concluído</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </div>
                        </div>

                        {/* Order Details & Items Preview */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="text-xs text-atelier-600 space-y-1">
                            <p>
                              <strong>Itens:</strong> {ord.quantity} unidades • {ord.kitName}
                            </p>
                            <p>
                              <strong>Endereço:</strong> {ord.address ? `${ord.address.street}, ${ord.address.number || 'S/N'} - ${ord.address.city}/${ord.address.state} (CEP: ${ord.address.cep})` : 'A combinar'}
                            </p>
                            <p className="text-[11px] text-atelier-400">
                              Data: {new Date(ord.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* A4 Print Engine Button */}
                            <button
                              onClick={() => setSelectedOrderForPrint(ord)}
                              className="px-3.5 py-2 bg-brand hover:bg-brand-dark text-atelier-50 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Gerar e imprimir gabarito A4 em 300 DPI sem Canva"
                            >
                              <Printer className="w-4 h-4" />
                              <span>Gabarito A4 (300 DPI)</span>
                            </button>

                            {/* Delete Order Button */}
                            <button
                              onClick={() => handleDeleteOrder(ord.code)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Excluir pedido"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Photos Thumbnail Strip */}
                        {ord.items && ord.items.length > 0 && (
                          <div className="flex gap-2 overflow-x-auto pt-2 border-t border-atelier-50 scrollbar-thin">
                            {ord.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="w-12 h-12 rounded-lg overflow-hidden border border-atelier-200 shrink-0 bg-atelier-50 relative group"
                              >
                                <img
                                  src={it.previewUrl || it.imageUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 font-bold">
                                  {idx + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Reviews Moderation */}
            {activeTab === 'reviews' && (
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-brand-dark">
                    Moderação de Depoimentos de Clientes
                  </h4>
                  <button
                    onClick={() => fetchReviews()}
                    className="px-3 py-1.5 text-xs text-atelier-700 bg-atelier-100 hover:bg-atelier-200 rounded-lg flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Atualizar</span>
                  </button>
                </div>

                {loadingReviews ? (
                  <p className="text-center py-8 text-xs text-atelier-500">Carregando avaliações...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-center py-8 text-xs text-atelier-500">Nenhuma avaliação cadastrada.</p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 bg-white rounded-2xl border border-atelier-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-dark">{rev.name}</span>
                            <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                rev.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {rev.status === 'approved' ? 'Aprovado' : 'Pendente'}
                            </span>
                          </div>
                          <p className="text-atelier-700 italic">"{rev.comment}"</p>
                          {rev.photoUrl && (
                            <a
                              href={rev.photoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-brand hover:underline inline-block pt-1"
                            >
                              Ver Foto Enviada pelo Cliente
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {rev.status !== 'approved' && (
                            <button
                              onClick={() => handleReviewStatus(rev.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Aprovar</span>
                            </button>
                          )}
                          {rev.status === 'approved' && (
                            <button
                              onClick={() => handleReviewStatus(rev.id, 'pending')}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Tornar Pendente
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Store Settings & Google Sheets CSV */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {settingsSavedMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{settingsSavedMessage}</span>
                  </div>
                )}

                {/* Google Sheets CSV Link */}
                <div className="bg-atelier-50 rounded-2xl p-4 border border-atelier-200 space-y-2">
                  <label className="block font-bold text-brand-dark text-sm">
                    Link CSV Publicado do Google Sheets (Cálculo de Frete)
                  </label>
                  <p className="text-atelier-500 text-[11px]">
                    No Google Sheets: Arquivo &gt; Compartilhar &gt; Publicar na Web &gt; Formato CSV. Cole o link abaixo:
                  </p>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                    value={settingsForm.googleSheetsCsvUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleSheetsCsvUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand font-mono"
                  />
                </div>

                {/* WhatsApp & Production Days */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-atelier-700 mb-1">
                      WhatsApp da Loja para Receber Pedidos
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 5541999999999"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-atelier-700 mb-1">
                      Média de Dias para Produção
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={settingsForm.productionDays}
                      onChange={(e) => setSettingsForm({ ...settingsForm, productionDays: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Texts */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-atelier-700 mb-1">
                      Texto Informativo de Envio & Embalagem
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.shippingInfoText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, shippingInfoText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-atelier-700 mb-1">
                      Instruções de Cuidados com os Bótons
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.careInstructions}
                      onChange={(e) => setSettingsForm({ ...settingsForm, careInstructions: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Kit Pricing Config */}
                <div className="space-y-3 pt-2 border-t border-atelier-100">
                  <h4 className="font-bold text-brand-dark text-sm">
                    Preços dos Kits de Bótons
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {settingsForm.kits.map((kit, idx) => (
                      <div key={kit.id || idx} className="p-3 bg-atelier-50 rounded-xl border border-atelier-200 space-y-2">
                        <span className="font-bold text-brand-dark block">{kit.name} ({kit.units} un)</span>
                        <div className="flex items-center gap-2">
                          <label className="text-atelier-500">Preço (R$):</label>
                          <input
                            type="number"
                            step="0.50"
                            value={kit.price}
                            onChange={(e) => {
                              const updated = [...settingsForm.kits];
                              updated[idx].price = parseFloat(e.target.value) || 0;
                              setSettingsForm({ ...settingsForm, kits: updated });
                            }}
                            className="w-24 px-2 py-1 rounded border border-atelier-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change Admin Password */}
                <div className="pt-2 border-t border-atelier-100">
                  <label className="block font-bold text-atelier-700 mb-1">
                    Nova Senha de Acesso ao Painel (Deixe em branco para manter a atual)
                  </label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={settingsForm.newPassword}
                    onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                    className="w-full sm:w-72 px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-3 bg-brand hover:bg-brand-dark text-atelier-50 font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>

              </form>
            )}

          </div>
        )}

      </div>

      {/* A4 Print Modal Triggered from Order Row */}
      {selectedOrderForPrint && (
        <A4PrintModal
          isOpen={true}
          onClose={() => setSelectedOrderForPrint(null)}
          order={selectedOrderForPrint}
        />
      )}
    </div>
  );
}
