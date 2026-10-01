import React, { useState } from 'react';
import { AURA_PRODUCTS } from './data/products';
import { Product, TelemetryPayload, UserContext } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ChatWidget } from './components/ChatWidget';
import { CXInsightsEngine } from './components/CXInsightsEngine';
import { ArchitectureModal } from './components/ArchitectureModal';
import { SystemPromptModal } from './components/SystemPromptModal';
import { OrderTracker } from './components/OrderTracker';
import { CartDrawer } from './components/CartDrawer';
import { PolicyFAQ } from './components/PolicyFAQ';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'storefront' | 'tracking' | 'insights'>('storefront');
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  // Cart & User Context State
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: 'aura-pulse', quantity: 1 }
  ]);

  // Telemetry logs stream captured by CX Insights Engine
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryPayload[]>([]);

  // Calculate cart metrics
  const cartTotal = cartItems.reduce((acc, item) => {
    const prod = AURA_PRODUCTS.find((p) => p.id === item.productId);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const userContext: UserContext = {
    userId: 'user_auratech_8912',
    userName: 'Alex Mercer',
    cartCount,
    cartTotal,
    cartItems,
    currentViewedProduct: 'Aura Pulse Smartwatch',
    device: 'Desktop (Chrome 128 / Windows)'
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { productId: string; quantity: number }[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleAskNova = (promptText: string) => {
    setExternalPrompt(promptText);
  };

  const handleEmitTelemetry = (payload: TelemetryPayload) => {
    setTelemetryLogs((prev) => [payload, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Notification Announcement */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center font-medium border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
          Omnichannel CX
        </span>
        <span>
          AuraTech PulseCX Live • Free Standard Shipping over $50 • 30-Day Risk-Free Trial
        </span>
        <button
          onClick={() => setIsPromptOpen(true)}
          className="ml-2 text-blue-400 hover:text-blue-300 underline font-semibold"
        >
          View Nova System Prompt →
        </button>
      </div>

      {/* Navigation Bar */}
      <Navbar
        userContext={userContext}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenPromptModal={() => setIsPromptOpen(true)}
        onOpenChat={() => handleAskNova('Hi Nova! What can you help me with today?')}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'storefront' && (
          <div>
            {/* Hero Section */}
            <Hero
              onAskNova={handleAskNova}
              onExploreProducts={() => {
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Core Offerings Catalog Section */}
            <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <span>AuraTech Core Offerings</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Engineered for Precision & Wellness
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 max-w-xl">
                    Every device is built with premium materials, industry-leading battery longevity, and backed by Nova's 24/7 intelligent assistance.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">3 Flagship Devices</span>
                  <div className="h-4 w-px bg-slate-300 mx-1" />
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                    All In Stock
                  </span>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {AURA_PRODUCTS.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                    onAskNova={(p, prompt) => handleAskNova(prompt || `Can you tell me more about ${p.name}?`)}
                  />
                ))}
              </div>
            </section>

            {/* Live Order Tracker Section */}
            <section className="bg-slate-100 py-12 px-4 sm:px-6 border-y border-slate-200">
              <div className="max-w-7xl mx-auto">
                <OrderTracker onAskNova={handleAskNova} />
              </div>
            </section>

            {/* Embedded Actionable CX Insights Preview */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    Live Telemetry Preview
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    Real-Time CX Telemetry & Insights Stream
                  </h3>
                </div>
                <button
                  onClick={() => setIsArchitectureOpen(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
                >
                  <span>Inspect 4-Tier Architecture Blueprint</span>
                  <span>→</span>
                </button>
              </div>
              <CXInsightsEngine
                telemetryLogs={telemetryLogs}
                onClearLogs={() => setTelemetryLogs([])}
              />
            </section>

            {/* Policy & FAQ Section */}
            <PolicyFAQ onAskNova={handleAskNova} />
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
            <OrderTracker onAskNova={handleAskNova} />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
            <CXInsightsEngine
              telemetryLogs={telemetryLogs}
              onClearLogs={() => setTelemetryLogs([])}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base">
                  A
                </div>
                <span className="text-white font-bold text-base tracking-tight">AuraTech</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Omnichannel lifestyle & smart electronics brand. Engineered for health, acoustic immersion, and seamless home automation.
              </p>
              <div className="text-[11px] text-slate-500">
                © {new Date().getFullYear()} AuraTech Inc. All rights reserved.
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Core Offerings</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => handleAskNova('Tell me about Aura Pulse Smartwatch battery')} className="hover:text-white transition">Aura Pulse Smartwatch ($199)</button></li>
                <li><button onClick={() => handleAskNova('Tell me about Aura Studio ANC Headphones noise canceling')} className="hover:text-white transition">Aura Studio ANC Headphones ($249)</button></li>
                <li><button onClick={() => handleAskNova('Tell me about Aura Hub Pro Matter support')} className="hover:text-white transition">Aura Hub Pro ($99)</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Customer Policies</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="text-slate-300">Free Shipping</span>: Over $50 (3–5 days)</li>
                <li><span className="text-slate-300">Express Delivery</span>: $12.99 (1–2 days)</li>
                <li><span className="text-slate-300">Return Window</span>: 30-Day Risk-Free Trial</li>
                <li><span className="text-slate-300">Domestic Returns</span>: Free Prepaid Labels</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Senior Support Protocol</h4>
              <p className="text-xs text-slate-400 mb-2">
                Escalated inquiries & dispute assistance:
              </p>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700/80 space-y-1 text-xs">
                <div>Email: <a href="mailto:support@auratech.example.com" className="text-blue-400 underline">support@auratech.example.com</a></div>
                <div>Hours: Monday–Friday, 9:00 AM – 7:00 PM EST</div>
                <div>Ticket: <span className="text-slate-300">auratech.example.com/support</span></div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Live Chat Widget */}
      <ChatWidget
        userContext={userContext}
        onEmitTelemetry={handleEmitTelemetry}
        externalPrompt={externalPrompt}
        onClearExternalPrompt={() => setExternalPrompt(null)}
      />

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        userContext={userContext}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        products={AURA_PRODUCTS}
        onAskNova={handleAskNova}
      />

      {/* 4-Tier Architecture Blueprint Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Nova System Prompt Modal */}
      <SystemPromptModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
      />
    </div>
  );
};
export default App;
