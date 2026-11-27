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
  X,
  Key,
  ShieldCheck,
  Mail,
  Phone,
  BarChart2,
  Boxes,
  Star,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Gift
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
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewOrigin, setNewReviewOrigin] = useState('google');
  const [newReviewPhotoFiles, setNewReviewPhotoFiles] = useState([]);
  const [newReviewPhotoPreviews, setNewReviewPhotoPreviews] = useState([]);
  const [submittingManualReview, setSubmittingManualReview] = useState(false);

  // Addons / Embalagens & Extras state
  const [addons, setAddons] = useState([]);
  const [loadingAddons, setLoadingAddons] = useState(false);
  const [isAddingAddon, setIsAddingAddon] = useState(false);
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState('');
  const [newAddonSheetItem, setNewAddonSheetItem] = useState('');
  const [newAddonDesc, setNewAddonDesc] = useState('');
  const [newAddonImageFile, setNewAddonImageFile] = useState(null);
  const [newAddonImagePreview, setNewAddonImagePreview] = useState(null);
  const [submittingAddon, setSubmittingAddon] = useState(false);

  // Stock state from Google Sheets
  const [stockData, setStockData] = useState(null);
  const [loadingStock, setLoadingStock] = useState(false);
  const [stockSearch, setStockSearch] = useState('');
  const [stockCategoryFilter, setStockCategoryFilter] = useState('Todos');

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    whatsapp: '',
    email: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    productionDays: 2,
    shippingInfoText: '',
    careInstructions: '',
    googleSheetsCsvUrl: '',
    stockWebhookUrl: '',
    googleAnalyticsId: 'GTM-NLJPFJV8',
    kits: [],
    shippingMethods: [],
    newUsername: '',
    newPassword: ''
  });
  const [currentAdminUser, setCurrentAdminUser] = useState('admin');
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
          whatsapp: data.whatsapp || '351965639401',
          email: data.email || 'kmpersonalisados@gmail.com',
          instagram: data.instagram || '',
          tiktok: data.tiktok || '',
          facebook: data.facebook || '',
          productionDays: data.productionDays || 2,
          shippingInfoText: data.shippingInfoText || '',
          careInstructions: data.careInstructions || '',
          googleSheetsCsvUrl: data.googleSheetsCsvUrl || '',
          stockWebhookUrl: data.stockWebhookUrl || 'https://script.google.com/macros/s/AKfycbzHDz-ph4CPy65wZhTW8wBM6K4bJjhRb1cPl3JAmSOFaI3K77rMn7_G2Mtda8LUNfnx/exec',
          googleAnalyticsId: data.googleAnalyticsId || 'GTM-NLJPFJV8',
          kits: data.kits || [],
          shippingMethods: data.shippingMethods || [],
          newUsername: '',
          newPassword: ''
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  // Fetch stock from Google Sheets via backend
  const fetchStock = async (authToken = token) => {
    if (!authToken) return;
    setLoadingStock(true);
    try {
      const res = await fetch('/api/admin/stock', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStockData(data);
      }
    } catch (err) {
      console.error('Error fetching stock:', err);
    } finally {
      setLoadingStock(false);
    }
  };

  // Handle create manual review (e.g. Google Reviews - up to 3 photos)
  const handleCreateManualReview = async (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      alert('Preencha o nome do cliente e o comentário.');
      return;
    }
    setSubmittingManualReview(true);
    try {
      const formData = new FormData();
      formData.append('name', newReviewName.trim());
      formData.append('rating', newReviewRating);
      formData.append('comment', newReviewComment.trim());
      formData.append('origin', newReviewOrigin);
      formData.append('badge', newReviewOrigin === 'google' ? 'Avaliação no Google' : 'Compra Verificada');
      if (newReviewPhotoFiles && newReviewPhotoFiles.length > 0) {
        newReviewPhotoFiles.forEach((f) => formData.append('photos', f));
        formData.append('photo', newReviewPhotoFiles[0]);
      }

      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setNewReviewName('');
        setNewReviewRating(5);
        setNewReviewComment('');
        setNewReviewPhotoFiles([]);
        setNewReviewPhotoPreviews([]);
        setIsAddingReview(false);
        fetchReviews(token);
        alert('Avaliação adicionada com sucesso e já publicada no site!');
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Erro ao adicionar avaliação.');
      }
    } catch (err) {
      alert('Erro de conexão ao adicionar avaliação: ' + err.message);
    } finally {
      setSubmittingManualReview(false);
    }
  };

  // Addons / Embalagens handlers
  const fetchAddons = async () => {
    setLoadingAddons(true);
    try {
      const res = await fetch('/api/addons');
      if (res.ok) {
        const data = await res.json();
        setAddons(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching addons:', err);
    } finally {
      setLoadingAddons(false);
    }
  };

  const handleAddAddon = async (e) => {
    e.preventDefault();
    if (!newAddonName.trim()) {
      alert('Informe o nome da embalagem ou produto adicional.');
      return;
    }
    setSubmittingAddon(true);
    try {
      const formData = new FormData();
      formData.append('name', newAddonName.trim());
      formData.append('price', Number(newAddonPrice) || 0);
      if (newAddonSheetItem) formData.append('sheetItemName', newAddonSheetItem.trim());
      if (newAddonDesc) formData.append('description', newAddonDesc.trim());
      if (newAddonImageFile) formData.append('image', newAddonImageFile);

      const res = await fetch('/api/admin/addons', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setNewAddonName('');
        setNewAddonPrice('');
        setNewAddonSheetItem('');
        setNewAddonDesc('');
        setNewAddonImageFile(null);
        setNewAddonImagePreview(null);
        setIsAddingAddon(false);
        fetchAddons();
        alert('Embalagem / Produto Adicional guardado com sucesso!');
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Erro ao guardar item adicional.');
      }
    } catch (err) {
      alert('Erro de conexão ao guardar: ' + err.message);
    } finally {
      setSubmittingAddon(false);
    }
  };

  const handleDeleteAddon = async (id) => {
    if (!confirm('Deseja realmente remover esta embalagem / produto adicional?')) return;
    try {
      const res = await fetch(`/api/admin/addons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAddons((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert('Erro ao excluir item.');
      }
    } catch (err) {
      alert('Erro de conexão: ' + err.message);
    }
  };

  const handleToggleAddon = async (id, currentActive) => {
    try {
      const res = await fetch(`/api/admin/addons/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ active: !currentActive })
      });
      if (res.ok) {
        fetchAddons();
      }
    } catch (err) {
      console.error('Error toggling addon:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(token);
      fetchReviews(token);
      fetchSettings();
      fetchStock(token);
      fetchAddons();
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
        setCurrentAdminUser(data.username);
        localStorage.setItem('km_admin_token', data.token);
        fetchOrders(data.token);
        fetchReviews(data.token);
        fetchSettings();
        fetchStock(data.token);
        fetchAddons();
      } else {
        const err = await res.json().catch(() => ({}));
        setLoginError(err.error || 'Utilizador ou palavra-passe incorretos.');
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
    if (!confirm(`Deseja realmente eliminar a encomenda ${code}? Esta ação não pode ser desfeita.`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(code)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      alert('Erro ao eliminar encomenda: ' + err.message);
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
    if (!confirm('Deseja eliminar esta avaliação?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      alert('Erro ao eliminar avaliação: ' + err.message);
    }
  };

  // Save Store Settings & New Password
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
        const resData = await res.json();
        setSettingsSavedMessage('Configurações e credenciais guardadas com sucesso!');
        if (resData.adminUser) setCurrentAdminUser(resData.adminUser);
        setSettingsForm((prev) => ({ ...prev, newPassword: '', newUsername: '' }));
        if (onSettingsUpdated) onSettingsUpdated();
        setTimeout(() => setSettingsSavedMessage(''), 4000);
      } else {
        alert('Erro ao guardar configurações.');
      }
    } catch (err) {
      alert('Erro de conexão ao guardar configurações.');
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-1 sm:p-4 overflow-y-auto no-print">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden my-auto max-h-[96vh] sm:max-h-[92vh] flex flex-col">
        
        {/* Header - Responsivo para Mobile */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-brand-dark text-atelier-50 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand/50 border border-brand-light/30 flex items-center justify-center text-atelier-50 shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-sm sm:text-lg leading-tight truncate">
                Painel da Equipa • KM
              </h3>
              <p className="text-[10px] sm:text-xs text-atelier-300 truncate">
                Encomendas, Gabarito A4 300 DPI, CTT & Google
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {token && (
              <button
                onClick={handleLogout}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sair do painel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desconectar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-atelier-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= LOGIN FORM (IF NOT AUTHENTICATED) ================= */}
        {!token ? (
          <div className="p-6 sm:p-12 max-w-md mx-auto w-full my-auto text-center space-y-5 overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-cream border border-brand-light/40 flex items-center justify-center mx-auto text-brand shadow-xs">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark">
                Acesso à Gestão do Ateliê
              </h4>
              <p className="text-xs text-atelier-500 mt-1">
                Área reservada à equipa da KM Personalizados.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-atelier-700 mb-1">
                  Utilizador
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
                  Palavra-passe
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 bg-brand hover:bg-brand-dark disabled:bg-atelier-300 text-atelier-50 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {loggingIn ? 'A verificar...' : 'Entrar no Painel'}
              </button>
            </form>
          </div>
        ) : (
          /* ================= AUTHENTICATED ADMIN DASHBOARD ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Admin Tabs Bar - Scroll Horizontal Touch no Mobile */}
            <div className="px-2 sm:px-6 py-2 bg-atelier-50 border-b border-atelier-200 flex items-center gap-1.5 sm:gap-3 text-xs font-bold text-atelier-600 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'orders'
                    ? 'bg-brand text-atelier-50 shadow-xs'
                    : 'hover:bg-atelier-100 text-atelier-700'
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                <span>Encomendas ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'reviews'
                    ? 'bg-brand text-atelier-50 shadow-xs'
                    : 'hover:bg-atelier-100 text-atelier-700'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Depoimentos ({reviews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-brand text-atelier-50 shadow-xs'
                    : 'hover:bg-atelier-100 text-atelier-700'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Configurações & SEO</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('stock');
                  fetchStock();
                }}
                className={`py-2 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'stock'
                    ? 'bg-brand text-atelier-50 shadow-xs'
                    : 'hover:bg-atelier-100 text-atelier-700'
                }`}
              >
                <Boxes className="w-4 h-4 shrink-0" />
                <span>Estoque Sheets ({stockData?.summary?.totalItems || 34})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('addons');
                  fetchAddons();
                  fetchStock();
                }}
                className={`py-2 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'addons'
                    ? 'bg-brand text-atelier-50 shadow-xs'
                    : 'hover:bg-atelier-100 text-atelier-700'
                }`}
              >
                <Gift className="w-4 h-4 shrink-0" />
                <span>Embalagens & Extras ({addons.length})</span>
              </button>
            </div>

            {/* Tab 1: Orders Management & Easy 1-Click Print */}
            {activeTab === 'orders' && (
              <div className="p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 flex-1">
                
                {/* Search & Refresh */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-atelier-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Procurar por código ou cliente..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>

                  <button
                    onClick={() => fetchOrders()}
                    className="px-3 py-2 text-xs font-semibold text-atelier-700 bg-atelier-100 hover:bg-atelier-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-brand" />
                    <span>Atualizar Encomendas</span>
                  </button>
                </div>

                {/* Orders List Table */}
                {loadingOrders ? (
                  <p className="text-center py-8 text-xs text-atelier-500">A carregar encomendas...</p>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-atelier-500 space-y-2">
                    <Package className="w-10 h-10 mx-auto text-atelier-400" />
                    <p className="text-sm font-semibold">Nenhuma encomenda registada ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {filteredOrders.map((ord) => (
                      <div
                        key={ord.id || ord.code}
                        className="p-3.5 sm:p-5 bg-white rounded-2xl border border-atelier-200 shadow-xs space-y-3 sm:space-y-4 hover:border-brand/30 transition-all"
                      >
                        {/* Top: Code, Customer Name & Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-atelier-100">
                          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                            <span className="font-mono text-base font-extrabold text-brand">
                              {ord.code}
                            </span>
                            <span className="font-serif font-bold text-sm text-brand-dark">
                              {ord.customerName}
                            </span>
                            {ord.customerPhone && (
                              <span className="text-xs text-atelier-500">
                                ({ord.customerPhone})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto pt-1 sm:pt-0">
                            <span className="text-xs font-bold text-brand-dark whitespace-nowrap">
                              Total: {ord.total?.toFixed(2).replace('.', ',')} €
                            </span>
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.code, e.target.value)}
                              className="text-xs font-semibold px-2 py-1 rounded-lg border border-atelier-300 bg-atelier-50 text-atelier-800 focus:outline-none focus:border-brand cursor-pointer"
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

                        {/* Order Details & Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          <div className="text-xs text-atelier-600 space-y-1">
                            <p>
                              <strong>Itens:</strong> {ord.quantity} unidades • {ord.kitName}
                            </p>
                            <p className="break-words">
                              <strong>Morada:</strong> {ord.address ? `${ord.address.street}, ${ord.address.number || 'S/N'}${ord.address.complement ? ` (${ord.address.complement})` : ''} - ${ord.address.postalCode || ''} ${ord.address.concelho || ''}` : 'A combinar'}
                            </p>
                            <p>
                              <strong>Envio CTT:</strong> {ord.shippingType} ({ord.shippingFee?.toFixed(2).replace('.', ',')} €)
                            </p>
                            <p className="text-[11px] text-atelier-400">
                              Data: {new Date(ord.createdAt).toLocaleString('pt-PT')}
                            </p>
                          </div>

                          {/* Quick Actions: Direct Print & Delete */}
                          <div className="flex items-center gap-2 pt-2 sm:pt-0 shrink-0">
                            <button
                              onClick={() => setSelectedOrderForPrint(ord)}
                              className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-brand hover:bg-brand-dark text-atelier-50 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              title="Visualizar, baixar ou imprimir gabarito A4 em 300 DPI com controle de brilho"
                            >
                              <Printer className="w-4 h-4 shrink-0" />
                              <span>Imprimir Folha A4 (300 DPI)</span>
                            </button>

                            <button
                              onClick={() => handleDeleteOrder(ord.code)}
                              className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              title="Eliminar encomenda"
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

            {/* Tab 2: Reviews Moderation & Manual Add */}
            {activeTab === 'reviews' && (
              <div className="p-3 sm:p-6 overflow-y-auto space-y-4 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-brand-dark">
                      Moderação & Cadastro de Depoimentos
                    </h4>
                    <p className="text-[11px] text-atelier-500">
                      Adicione avaliações recebidas no Google ou aprove os envios feitos pelo site.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddingReview(!isAddingReview)}
                      className="px-3 py-1.5 text-xs text-white bg-brand hover:bg-brand-dark rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingReview ? 'Fechar Formulário' : '+ Adicionar Avaliação (Google / Manual)'}</span>
                    </button>
                    <button
                      onClick={() => fetchReviews()}
                      className="px-3 py-1.5 text-xs text-atelier-700 bg-atelier-100 hover:bg-atelier-200 rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Atualizar</span>
                    </button>
                  </div>
                </div>

                {/* Form to Add Manual Review (Google / Site) */}
                {isAddingReview && (
                  <form
                    onSubmit={handleCreateManualReview}
                    className="p-4 sm:p-5 bg-atelier-50/80 rounded-2xl border border-atelier-300 shadow-xs space-y-4 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-atelier-200">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <h5 className="font-serif font-bold text-xs sm:text-sm text-brand-dark">
                          Cadastrar Nova Avaliação (Google Meu Negócio / Cliente Real)
                        </h5>
                      </div>
                      <span className="text-[11px] text-emerald-700 bg-emerald-100/70 font-semibold px-2 py-0.5 rounded-full">
                        Publicação Imediata no Site
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-atelier-700 mb-1">
                          Nome do Cliente *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Beatriz Lima"
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-atelier-700 mb-1">
                          Classificação (Estrelas) *
                        </label>
                        <div className="flex items-center gap-1 pt-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReviewRating(star)}
                              className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= newReviewRating ? 'fill-current' : 'text-atelier-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-brand-dark ml-2">
                            {newReviewRating}.0 / 5.0
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-atelier-700 mb-1">
                          Origem / Selo
                        </label>
                        <select
                          value={newReviewOrigin}
                          onChange={(e) => setNewReviewOrigin(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                        >
                          <option value="google">Avaliação no Google (Google Reviews)</option>
                          <option value="loja">Compra Verificada no Site</option>
                          <option value="instagram">Instagram (@km_personalisado)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-atelier-700 mb-1">
                        Depoimento / Comentário do Cliente *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Escreva ou cole aqui o comentário que o cliente deixou..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-atelier-700">
                          Fotos Reais do Produto / Cliente (Até 3 fotos)
                        </label>
                        <span className="text-[10px] text-atelier-500 font-medium">
                          {newReviewPhotoFiles.length}/3 fotos
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {newReviewPhotoFiles.length < 3 && (
                          <label className="px-3.5 py-2 rounded-xl bg-white border border-atelier-300 hover:bg-atelier-100 text-xs text-atelier-700 font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-brand" />
                            <span>{newReviewPhotoFiles.length === 0 ? 'Selecionar Fotos (Máx. 3)' : '+ Adicionar Mais Foto'}</span>
                            <input
                              type="file"
                              multiple
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files) {
                                  const incoming = Array.from(e.target.files);
                                  const remaining = 3 - newReviewPhotoFiles.length;
                                  const toAdd = incoming.slice(0, remaining);
                                  if (toAdd.length === 0) return;

                                  const updatedFiles = [...newReviewPhotoFiles, ...toAdd];
                                  setNewReviewPhotoFiles(updatedFiles);

                                  toAdd.forEach((file) => {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setNewReviewPhotoPreviews((prev) => [...prev, ev.target.result]);
                                    };
                                    reader.readAsDataURL(file);
                                  });
                                }
                              }}
                            />
                          </label>
                        )}

                        {newReviewPhotoPreviews.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {newReviewPhotoPreviews.map((preview, idx) => (
                              <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-atelier-300 bg-atelier-50 shadow-2xs group">
                                <img
                                  src={preview}
                                  alt={`Foto ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewReviewPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
                                    setNewReviewPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                                  title="Remover esta foto"
                                >
                                  ✕
                                </button>
                                <span className="absolute bottom-1 left-1 px-1 rounded bg-black/60 text-[9px] text-white font-mono">
                                  {idx + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-atelier-200">
                      <button
                        type="button"
                        onClick={() => setIsAddingReview(false)}
                        className="px-4 py-2 text-xs font-semibold text-atelier-600 hover:bg-atelier-200/50 rounded-xl cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={submittingManualReview}
                        className="px-5 py-2 bg-brand hover:bg-brand-dark disabled:bg-atelier-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{submittingManualReview ? 'A publicar...' : 'Publicar Avaliação no Site'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {loadingReviews ? (
                  <p className="text-center py-8 text-xs text-atelier-500">A carregar avaliações...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-center py-8 text-xs text-atelier-500">Nenhuma avaliação registada.</p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3.5 sm:p-4 bg-white rounded-2xl border border-atelier-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-brand-dark">{rev.name}</span>
                            <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                            {rev.origin === 'google' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1">
                                <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                </svg>
                                <span>Google</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-atelier-100 text-atelier-700">
                                Site
                              </span>
                            )}
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

                        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                          {rev.status !== 'approved' && (
                            <button
                              onClick={() => handleReviewStatus(rev.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Aprovar</span>
                            </button>
                          )}
                          {rev.status === 'approved' && (
                            <button
                              onClick={() => handleReviewStatus(rev.id, 'pending')}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Tornar Pendente
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar"
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

            {/* Tab 3: Store Settings, Security, Password & Google Analytics */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-xs">
                
                {settingsSavedMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{settingsSavedMessage}</span>
                  </div>
                )}

                {/* Exclusive Admin Security Box */}
                <div className="p-4 rounded-2xl bg-brand-cream/80 border-2 border-brand/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-brand" />
                    <h4 className="font-serif font-bold text-sm text-brand-dark">
                      Segurança de Acesso (Seu Utilizador e Palavra-passe)
                    </h4>
                  </div>
                  <p className="text-[11px] text-atelier-600">
                    Aqui pode alterar os seus dados para que <strong>somente você</strong> tenha acesso ao painel de administração:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block font-bold text-atelier-700 mb-1">
                        Novo Nome de Utilizador (Atual: {currentAdminUser})
                      </label>
                      <input
                        type="text"
                        placeholder="Deixe em branco para manter"
                        value={settingsForm.newUsername}
                        onChange={(e) => setSettingsForm({ ...settingsForm, newUsername: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-atelier-700 mb-1">
                        Nova Palavra-passe Pessoal
                      </label>
                      <input
                        type="password"
                        placeholder="Mínimo de 6 caracteres"
                        value={settingsForm.newPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                </div>

                {/* Google Analytics & Tag Manager (Rastreio) */}
                <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-amber-700" />
                    <label className="block font-bold text-brand-dark text-xs sm:text-sm">
                      Google Analytics / Tag Manager (ID)
                    </label>
                  </div>
                  <p className="text-atelier-600 text-[11px] leading-relaxed">
                    Código de acompanhamento oficial para monitorizar visitas e clientes (ex: <code>GTM-NLJPFJV8</code> ou <code>G-XXXXXXXXXX</code>):
                  </p>
                  <input
                    type="text"
                    placeholder="GTM-NLJPFJV8"
                    value={settingsForm.googleAnalyticsId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:border-brand font-mono font-bold text-xs"
                  />
                </div>

                {/* Google Sheets CSV Link for CTT Shipping */}
                <div className="bg-atelier-50 rounded-2xl p-4 border border-atelier-200 space-y-2">
                  <label className="block font-bold text-brand-dark text-xs sm:text-sm">
                    Link CSV da Planilha de Custos & Fretes (Google Sheets)
                  </label>
                  <p className="text-atelier-500 text-[11px]">
                    Planilha conectada com valores de fretes CTT e custos:
                  </p>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                    value={settingsForm.googleSheetsCsvUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleSheetsCsvUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand font-mono"
                  />
                </div>

                {/* Google Apps Script Webhook URL for Automatic Stock Deduction */}
                <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-emerald-900 text-xs sm:text-sm">
                      Webhook Google Apps Script (Baixa Automática no Estoque)
                    </label>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Ativo na Coluna F (Saídas)
                    </span>
                  </div>
                  <p className="text-emerald-700 text-[11px]">
                    URL gerado pela sua aplicação web no Google Sheets para atualizar vendas em tempo real:
                  </p>
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={settingsForm.stockWebhookUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, stockWebhookUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:border-emerald-600 font-mono text-xs"
                  />
                </div>

                {/* WhatsApp & Email & Production Days */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-bold text-atelier-700 mb-1">
                      WhatsApp Oficial (+351...)
                    </label>
                    <input
                      type="text"
                      placeholder="351965639401"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-atelier-700 mb-1">
                      Email Oficial de Contacto
                    </label>
                    <input
                      type="email"
                      placeholder="kmpersonalisados@gmail.com"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-atelier-700 mb-1">
                      Dias Úteis de Confecção
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={settingsForm.productionDays}
                      onChange={(e) => setSettingsForm({ ...settingsForm, productionDays: parseInt(e.target.value, 10) || 2 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Redes Sociais */}
                <div className="bg-atelier-50 rounded-2xl p-4 border border-atelier-200 space-y-3">
                  <h5 className="font-bold text-brand-dark text-xs uppercase tracking-wider">
                    Redes Sociais Oficiais
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-atelier-700 text-xs mb-1">
                        Instagram
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.instagram.com/..."
                        value={settingsForm.instagram}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-atelier-700 text-xs mb-1">
                        TikTok
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.tiktok.com/..."
                        value={settingsForm.tiktok}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tiktok: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-atelier-700 text-xs mb-1">
                        Facebook
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.facebook.com/..."
                        value={settingsForm.facebook}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full sm:w-auto px-6 py-3 bg-brand hover:bg-brand-dark text-atelier-50 font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingSettings ? 'A guardar...' : 'Guardar Todas as Alterações'}</span>
                  </button>
                </div>

              </form>
            )}

            {/* Tab 4: Stock Integration (Google Sheets) */}
            {activeTab === 'stock' && (
              <div className="p-3 sm:p-6 overflow-y-auto space-y-4 flex-1">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-brand-dark">
                        Controle de Estoque • Google Sheets
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Sincronização Ativa
                      </span>
                    </div>
                    <p className="text-[11px] text-atelier-500">
                      Aba Estoque conectada em tempo real com a sua planilha oficial.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchStock()}
                      disabled={loadingStock}
                      className="px-3 py-1.5 text-xs text-brand-dark bg-atelier-100 hover:bg-atelier-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer font-semibold"
                      title="Recarregar dados do Sheets"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingStock ? 'animate-spin' : ''}`} />
                      <span>{loadingStock ? 'A sincronizar...' : 'Atualizar Estoque'}</span>
                    </button>

                    <a
                      href="https://docs.google.com/spreadsheets/d/1e4iCyvMsLaz2zGzrW0mqcosvbHDLmhwdpnbuXzeoSxo/edit#gid=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer font-bold shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir no Google Sheets</span>
                    </a>
                  </div>
                </div>

                {/* Privacy & Confidentiality Guarantee Banner */}
                <div className="p-3.5 bg-brand-cream/60 border border-brand-light/40 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <div className="text-xs text-atelier-700 space-y-0.5">
                    <p className="font-bold text-brand-dark">
                      Privacidade Absoluta Garantida (100% Invisível para Clientes)
                    </p>
                    <p className="text-[11px] leading-relaxed text-atelier-600">
                      Estes dados de insumos, equipamentos, custos de fornecedores e quantidades em armazém são estritamente confidenciais. 
                      Os visitantes e clientes da loja nunca verão esta tela nem os custos da sua planilha — para eles, o site exibe apenas a vitrine limpa dos bótons para encomendar.
                    </p>
                  </div>
                </div>

                {/* Summary KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  <div className="p-3.5 bg-white rounded-2xl border border-atelier-200 shadow-xs">
                    <span className="text-[10px] text-atelier-500 font-bold uppercase tracking-wider block">
                      Total de Itens
                    </span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-brand-dark block mt-0.5">
                      {stockData?.summary?.totalItems || '34'}
                    </span>
                    <span className="text-[10px] text-atelier-400">Na aba Estoque</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-atelier-200 shadow-xs">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                      Disponíveis no Site
                    </span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-700 block mt-0.5">
                      {stockData?.summary?.availableItems || '33'}
                    </span>
                    <span className="text-[10px] text-emerald-600">Ativos para uso</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-atelier-200 shadow-xs">
                    <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">
                      Estoque Baixo / Esgotado
                    </span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-amber-600 block mt-0.5">
                      {stockData?.summary?.lowOrOutOfStockItems || '13'}
                    </span>
                    <span className="text-[10px] text-amber-700">Atenção para reposição</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-2xl border border-atelier-200 shadow-xs">
                    <span className="text-[10px] text-brand font-bold uppercase tracking-wider block">
                      Valor Total em Estoque
                    </span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-brand-dark block mt-0.5">
                      {stockData?.summary?.totalStockValue || '€497,55'}
                    </span>
                    <span className="text-[10px] text-atelier-400">Patrimônio em material</span>
                  </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-atelier-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Pesquisar item (ex: papel, ímã, laminador)..."
                      value={stockSearch}
                      onChange={(e) => setStockSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0 text-xs">
                    {['Todos', 'Equipamento', 'Insumos', 'Papelaria', 'Embalagem'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setStockCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                          stockCategoryFilter === cat
                            ? 'bg-brand text-white shadow-xs'
                            : 'bg-atelier-100 hover:bg-atelier-200 text-atelier-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items List */}
                {loadingStock && !stockData ? (
                  <p className="text-center py-10 text-xs text-atelier-500">A carregar dados da planilha Google Sheets...</p>
                ) : (
                  <div className="space-y-2.5">
                    {(() => {
                      const items = (stockData?.items || []).filter((it) => {
                        const matchQuery = !stockSearch || it.name.toLowerCase().includes(stockSearch.toLowerCase()) || it.category.toLowerCase().includes(stockSearch.toLowerCase());
                        const matchCat = stockCategoryFilter === 'Todos' || it.category.toLowerCase().includes(stockCategoryFilter.toLowerCase());
                        return matchQuery && matchCat;
                      });

                      if (items.length === 0) {
                        return (
                          <div className="text-center py-10 bg-white rounded-2xl border border-atelier-200 text-xs text-atelier-500">
                            Nenhum item encontrado com os filtros aplicados.
                          </div>
                        );
                      }

                      return items.map((it) => {
                        const isLow = it.status?.toLowerCase().includes('baixo');
                        const isOut = it.status?.toLowerCase().includes('esgotado');
                        const isGood = !isLow && !isOut;

                        return (
                          <div
                            key={it.id}
                            className="p-3 sm:p-4 bg-white rounded-2xl border border-atelier-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 hover:border-brand/40 transition-all"
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-xs sm:text-sm text-brand-dark truncate">
                                  {it.name}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-atelier-100 text-atelier-600">
                                  {it.category}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-atelier-500">
                                <span>Inicial: <strong>{it.initialStock}</strong></span>
                                <span>Saídas: <strong>{it.outputs}</strong></span>
                                <span>Custo: <strong>{it.unitValue}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-atelier-100">
                              <div className="text-right">
                                <span className="text-[10px] text-atelier-400 block font-medium">Estoque Atual</span>
                                <span className="text-sm sm:text-base font-bold text-brand-dark">
                                  {it.currentStock} un.
                                </span>
                              </div>

                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                                  isGood
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : isLow
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {it.status}
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}

              </div>
            )}

            {/* Tab 5: Addons / Embalagens & Extras Management */}
            {activeTab === 'addons' && (
              <div className="p-3 sm:p-6 overflow-y-auto space-y-4 flex-1">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-brand-dark flex items-center gap-2">
                      <Gift className="w-4 h-4 text-brand" />
                      <span>Embalagens & Produtos Adicionais (Extras)</span>
                    </h4>
                    <p className="text-[11px] text-atelier-500">
                      Cadastre sacolas, caixas de presente e mimos para o cliente escolher na sacola com valor adicional.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingAddon(!isAddingAddon)}
                    className="px-3.5 py-2 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddingAddon ? 'Fechar Formulário' : '+ Nova Embalagem / Adicional'}</span>
                  </button>
                </div>

                {/* Form to Add New Addon / Packaging */}
                {isAddingAddon && (
                  <form
                    onSubmit={handleAddAddon}
                    className="p-4 bg-atelier-50/80 rounded-2xl border border-atelier-200 space-y-3 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between border-b border-atelier-200/80 pb-2">
                      <span className="font-bold text-xs text-brand-dark flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-brand" />
                        Cadastrar Nova Embalagem ou Produto Adicional
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddon(false)}
                        className="text-atelier-400 hover:text-atelier-600 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-atelier-700 mb-1">
                          Nome do Produto / Embalagem *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Caixa de Presente com Palha Rosa"
                          value={newAddonName}
                          onChange={(e) => setNewAddonName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-atelier-700 mb-1">
                          Valor Adicional (€) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          placeholder="Ex: 2.50"
                          value={newAddonPrice}
                          onChange={(e) => setNewAddonPrice(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-atelier-700 mb-1">
                          Vincular Linha da Planilha (Estoque Sheets)
                        </label>
                        <select
                          value={newAddonSheetItem}
                          onChange={(e) => setNewAddonSheetItem(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                        >
                          <option value="">-- Selecione um item da aba Estoque (Opcional) --</option>
                          <option value="Caixas">Caixas (Linha 12)</option>
                          <option value="Sacolas de Cartao rosa">Sacolas de Cartao rosa (Linha 13)</option>
                          <option value="Sacos de organza glitter 5un vár cor">Sacos de organza glitter (Linha 14)</option>
                          <option value="Plástico Laminador">Plástico Laminador (Linha 17)</option>
                          <option value="Insumos">Insumos (Linha 24)</option>
                          {stockData?.items && stockData.items.map((it) => (
                            <option key={it.row} value={it.name}>
                              {it.name} (Atual: {it.currentStock} un.)
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-atelier-500 mt-1">
                          Toda vez que o cliente pedir este item, o sistema dará baixa automática de 1 unidade na sua planilha.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-atelier-700 mb-1">
                          Descrição Rápida (Aparece no carrinho)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Caixa rígida de presente com palha decorativa e laço"
                          value={newAddonDesc}
                          onChange={(e) => setNewAddonDesc(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-atelier-300 bg-white focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-atelier-700 mb-1">
                        Foto da Embalagem / Produto
                      </label>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <label className="px-3.5 py-2 rounded-xl bg-white border border-atelier-300 hover:bg-atelier-100 text-xs text-atelier-700 font-semibold flex items-center gap-2 cursor-pointer shadow-xs">
                          <Upload className="w-3.5 h-3.5 text-brand" />
                          <span>Carregar Foto do Computador</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setNewAddonImageFile(file);
                                const reader = new FileReader();
                                reader.onload = (ev) => setNewAddonImagePreview(ev.target.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {newAddonImagePreview && (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-atelier-300">
                              <img
                                src={newAddonImagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setNewAddonImageFile(null);
                                setNewAddonImagePreview(null);
                              }}
                              className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                            >
                              Remover foto
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-atelier-200">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddon(false)}
                        className="px-4 py-2 text-xs font-semibold text-atelier-600 hover:bg-atelier-200/50 rounded-xl cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={submittingAddon}
                        className="px-5 py-2 bg-brand hover:bg-brand-dark disabled:bg-atelier-300 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{submittingAddon ? 'A guardar...' : 'Guardar Embalagem / Adicional'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* List of Registered Addons */}
                <div className="space-y-3">
                  {loadingAddons ? (
                    <div className="p-8 text-center text-xs text-atelier-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand" />
                      A carregar produtos adicionais...
                    </div>
                  ) : addons.length === 0 ? (
                    <div className="p-8 text-center text-xs text-atelier-500 bg-atelier-50 rounded-2xl border border-atelier-200">
                      <Gift className="w-8 h-8 text-atelier-300 mx-auto mb-2" />
                      Nenhuma embalagem ou adicional cadastrado ainda. Clique no botão acima para adicionar a primeira opção!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addons.map((addon) => (
                        <div
                          key={addon.id}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                            addon.active !== false
                              ? 'bg-white border-atelier-200 shadow-xs'
                              : 'bg-atelier-100/60 border-atelier-300 opacity-60'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {addon.imageUrl ? (
                              <img
                                src={addon.imageUrl}
                                alt={addon.name}
                                className="w-16 h-16 rounded-xl object-cover border border-atelier-200 shrink-0 shadow-2xs"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-brand-cream text-brand flex items-center justify-center shrink-0 border border-brand/10">
                                <Gift className="w-7 h-7" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h5 className="font-bold text-xs text-brand-dark truncate">{addon.name}</h5>
                                <span className="font-bold text-xs text-brand bg-brand-cream/60 px-2 py-0.5 rounded-md shrink-0">
                                  +{Number(addon.price).toFixed(2).replace('.', ',')} €
                                </span>
                              </div>

                              {addon.description && (
                                <p className="text-[11px] text-atelier-600 line-clamp-2 mt-0.5 leading-snug">
                                  {addon.description}
                                </p>
                              )}

                              {addon.sheetItemName ? (
                                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 w-fit">
                                  <Boxes className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>Vinculado ao Sheets: <strong>{addon.sheetItemName}</strong></span>
                                </div>
                              ) : (
                                <div className="mt-1.5 text-[10px] text-atelier-400">
                                  Sem baixa automática vinculada
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-atelier-100 text-[11px]">
                            <button
                              type="button"
                              onClick={() => handleToggleAddon(addon.id, addon.active !== false)}
                              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                                addon.active !== false
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-atelier-200 text-atelier-600 hover:bg-atelier-300'
                              }`}
                            >
                              {addon.active !== false ? '● Ativo no Site' : '○ Pausado'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteAddon(addon.id)}
                              className="p-1.5 text-atelier-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir embalagem"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
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
