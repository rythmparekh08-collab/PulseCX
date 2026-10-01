import React from 'react';
import { UserContext } from '../types';

interface NavbarProps {
  userContext: UserContext;
  onOpenArchitecture: () => void;
  onOpenPromptModal: () => void;
  onOpenChat: () => void;
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userContext,
  onOpenArchitecture,
  onOpenPromptModal,
  onOpenChat,
  onOpenCart,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveTab('storefront')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  AuraTech
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-full">
                  PulseCX
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Omnichannel Electronics & Lifestyle
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('storefront')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'storefront' ? 'bg-slate-100 text-blue-600' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Shop Smart Electronics
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'tracking' ? 'bg-slate-100 text-blue-600' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Live Order Tracker
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'insights' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CX Insights Engine</span>
            </button>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Architecture Blueprint Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl transition border border-slate-200"
            title="View 4-Tier Solution Architecture"
          >
            <span>📐</span>
            <span className="hidden lg:inline">System Blueprint</span>
          </button>

          {/* System Prompt Modal Trigger */}
          <button
            onClick={onOpenPromptModal}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition border border-blue-200"
            title="Inspect Nova AI System Prompt"
          >
            <span>🤖</span>
            <span>Nova Prompt</span>
          </button>

          {/* Cart Icon & Counter */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            title="View Cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {userContext.cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {userContext.cartCount}
              </span>
            )}
          </button>

          {/* Nova AI Launch CTA */}
          <button
            onClick={onOpenChat}
            className="bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition duration-200 flex items-center gap-2 shadow-sm"
          >
            <span className="text-amber-300">✨</span>
            <span className="hidden sm:inline">Ask Nova</span>
          </button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
