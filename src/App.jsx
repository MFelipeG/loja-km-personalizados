import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import KitsPricing from './components/KitsPricing';
import MockupStudio from './components/MockupStudio';
import DeadlinesShipping from './components/DeadlinesShipping';
import UpcomingProducts from './components/UpcomingProducts';
import ReviewsSection from './components/ReviewsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import CartCheckout from './components/CartCheckout';
import OrderTrackingModal from './components/OrderTrackingModal';
import AdminPanel from './components/AdminPanel';
import TermsModal from './components/TermsModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FridgeSimulatorModal from './components/FridgeSimulatorModal';

export default function App() {
  const [settings, setSettings] = useState(null);
  const [items, setItems] = useState([]);
  const [targetKit, setTargetKit] = useState(null);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isFridgeSimulatorOpen, setIsFridgeSimulatorOpen] = useState(false);

  // Fetch store settings on mount
  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar configurações:', err);
    }
  };

  useEffect(() => {
    loadSettings();

    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      } else if (window.location.hash === '#termos' || window.location.hash === '#privacidade') {
        setIsTermsOpen(true);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Smooth scroll helper
  const scrollToStudio = () => {
    const el = document.getElementById('estudio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When user clicks a kit on the pricing cards
  const handleSelectKit = (kit) => {
    setTargetKit(kit);
    scrollToStudio();
  };

  return (
    <div className="min-h-screen flex flex-col bg-atelier-50 text-atelier-900 font-sans overflow-x-hidden w-full max-w-full">
      {/* Top Header */}
      <Header
        settings={settings}
        cartCount={items.length}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onScrollToStudio={scrollToStudio}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Hero Section */}
        <Hero
          onScrollToStudio={scrollToStudio}
          settings={settings}
          onOpenFridgeSimulator={() => setIsFridgeSimulatorOpen(true)}
        />

        {/* Kits & Pricing Table */}
        <KitsPricing
          kits={settings?.kits}
          onSelectKit={handleSelectKit}
        />

        {/* Interactive Web-to-Print Mockup Studio */}
        <MockupStudio
          items={items}
          setItems={setItems}
          targetKit={targetKit}
          onOpenCheckout={() => setIsCartOpen(true)}
          settings={settings}
          onOpenFridgeSimulator={() => setIsFridgeSimulatorOpen(true)}
        />

        {/* Deadlines, CTT Shipping & Care */}
        <DeadlinesShipping
          settings={settings}
        />

        {/* Social Proof & Customer Reviews */}
        <ReviewsSection />

        {/* Perguntas Frequentes (FAQ) & Políticas da Loja */}
        <FAQSection
          settings={settings}
          onOpenTerms={() => setIsTermsOpen(true)}
        />

        {/* Upcoming Products ("Em Breve na Loja") */}
        <UpcomingProducts
          products={settings?.upcomingProducts}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Cart & Checkout Modal */}
      <CartCheckout
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        targetKit={targetKit}
        settings={settings}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', ' ');
          }
        }}
        onSettingsUpdated={loadSettings}
      />

      {/* Terms, Privacy Policy & Refund Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => {
          setIsTermsOpen(false);
          if (window.location.hash === '#termos' || window.location.hash === '#privacidade') {
            history.replaceState(null, '', ' ');
          }
        }}
      />

      {/* Interactive 3D Refrigerator Simulator Modal */}
      <FridgeSimulatorModal
        isOpen={isFridgeSimulatorOpen}
        onClose={() => setIsFridgeSimulatorOpen(false)}
        items={items}
        onGoToStudio={() => {
          setIsFridgeSimulatorOpen(false);
          scrollToStudio();
        }}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp settings={settings} />

      {/* Floating Cart Button when there are customized items */}
      {items.length > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-5 left-5 z-40 bg-brand hover:bg-brand-dark text-atelier-50 px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold transition-all transform hover:scale-105 active:scale-95 border border-brand-light/20 cursor-pointer animate-fade-in"
          title="Ver sacola de compras"
        >
          <ShoppingBag className="w-4 h-4 text-amber-300" />
          <span>Ver Sacola ({items.length})</span>
        </button>
      )}
    </div>
  );
}
