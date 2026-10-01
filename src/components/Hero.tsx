import React from 'react';

interface HeroProps {
  onAskNova: (prompt: string) => void;
  onExploreProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAskNova, onExploreProducts }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Next-Generation Omnichannel Smart Devices</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Intelligent Sound. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                Effortless Connected Living.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Explore AuraTech’s precision-engineered ecosystem. From the 14-day battery life of the Aura Pulse Smartwatch to acoustic spatial clarity on the Aura Studio ANC Headphones, backed by 24/7 AI-assisted customer care with Nova.
            </p>

            {/* Value Proposition Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-xl">
                <span className="text-emerald-400">✓</span>
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-xl">
                <span className="text-emerald-400">✓</span>
                <span>30-Day Risk-Free Trial</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-xl">
                <span className="text-emerald-400">✓</span>
                <span>Prepaid Free Return Labels</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Explore Core Offerings</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <button
                onClick={() => onAskNova('Hi Nova! Can you give me an overview of the AuraTech flagship smart devices?')}
                className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-semibold text-sm px-6 py-3.5 rounded-2xl border border-slate-700 transition flex items-center justify-center gap-2 group"
              >
                <span className="text-cyan-400 group-hover:scale-110 transition-transform">✨</span>
                <span>Ask Nova About Compatibility</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">Nova Active Concierge</span>
              </div>

              {/* Chat Simulation Preview Card */}
              <div className="space-y-4 py-4 text-xs">
                {/* Assistant Turn 0 */}
                <div className="bg-slate-800/90 p-3.5 rounded-2xl rounded-tl-none border border-slate-700/70 text-slate-200">
                  <div className="text-[10px] text-blue-400 font-semibold mb-1 flex items-center gap-1">
                    <span>✨ Nova • Customer Experience Assistant</span>
                  </div>
                  "Hi there! I'm Nova from AuraTech. Whether you're curious about our smart devices, tracking a package, or need a quick setup tip, I'm here to help."
                </div>

                {/* User Inquiry */}
                <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-white ml-auto max-w-[85%]">
                  "Will the Aura Studio ANC Headphones work with an older Bluetooth 4.2 TV?"
                </div>

                {/* Assistant Empathy & Answer */}
                <div className="bg-slate-800/90 p-3.5 rounded-2xl rounded-tl-none border border-slate-700/70 text-slate-200">
                  "I appreciate you checking compatibility! Yes, the **Aura Studio ANC Headphones ($249)** feature backward compatibility for **Bluetooth 4.2**, plus an included 3.5mm analog cable."
                  <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                    <span>30-Day Risk-Free Trial Included</span>
                    <span className="underline cursor-pointer">Learn More →</span>
                  </div>
                </div>
              </div>

              {/* Telemetry pill */}
              <div className="bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-300 font-semibold">Live Sentiment: Positive (98%)</span>
                </div>
                <span className="text-slate-400 text-[10px]">Zero Purchase Friction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
