import React, { useState } from 'react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTier, setActiveTier] = useState<number>(2);

  if (!isOpen) return null;

  const tiers = [
    {
      id: 1,
      title: 'Tier 1: Visitor / Client Browser',
      subtitle: 'Omnichannel Edge Interface',
      protocol: 'WebSocket / Server-Sent Events (SSE)',
      description: 'Ultra-low latency connection delivering stream tokens, typing indicators, and user touchpoints directly to the customer.',
      items: [
        'Streaming text tokens with Markdown & Action Buttons',
        'Real-time typing feedback and empathetic presence',
        'Automatic offline fallback resilience'
      ],
      icon: '🌐'
    },
    {
      id: 2,
      title: 'Tier 2: Next.js / React Frontend',
      subtitle: 'Stateful Client Presentation',
      protocol: 'REST / tRPC to Backend',
      description: 'The user-facing responsive storefront containing the live chat widget, product cards, dynamic sentiment indicator, and contextual hooks.',
      items: [
        'Live Chat Widget with Turn 0 Empathy Prompting',
        'Interactive Product Catalog (Aura Pulse, Aura Studio, Aura Hub)',
        'Real-time Sentiment Indicator (Positive / High Intent / Frustrated)',
        'Context Enrichment Payload Injector (Cart, Device, Session ID)'
      ],
      icon: '⚛️'
    },
    {
      id: 3,
      title: 'Tier 3: FastAPI / Node.js Backend',
      subtitle: 'Orchestration & Guardrails Engine',
      protocol: 'Asynchronous Event Pipeline',
      description: 'The core intelligence hub managing prompt enforcement, safety boundaries, vector retrieval, and automated escalation.',
      items: [
        '1. Context Enrichment: Injects session cart, viewed items, order history, VIP status',
        '2. RAG Pipeline: Vector search on Pinecone/Qdrant + BM25 hybrid keyword search',
        '3. LLM Router: Prompt guardrails, boundary enforcement & tool calling (Check Stock, Track Order, Initiate Return)',
        '4. Real-time Telemetry: Secondary model extraction of sentiment, churn risk & friction'
      ],
      icon: '⚡'
    },
    {
      id: 4,
      title: 'Tier 4: ClickHouse / PostgreSQL + Dashboard',
      subtitle: 'CX Business Intelligence Layer',
      protocol: 'Columnar Analytics & Alert Webhooks',
      description: 'High-throughput storage collecting conversational telemetry to empower merchandising, product management, and executive decisions.',
      items: [
        'Structured Session JSON ingestion with sub-second queries',
        'Actionable CX Insights Engine dashboard for cross-functional teams',
        'Automated product friction alerts sent to support@auratech.example.com',
        'Conversion correlation between agent reassurance & checkout rates'
      ],
      icon: '📊'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                End-to-End System Blueprint
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              4-Tier Omnichannel Solution Architecture
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {/* Visual Architecture Flow Diagram */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto text-blue-300">
            <div className="text-slate-500 mb-2 font-sans font-semibold text-[11px] uppercase tracking-wider">
              Architecture Dataflow Diagram
            </div>
            <pre className="text-[12px] leading-relaxed select-none">
{`[ Visitor / Client Browser ]
         │ (WebSocket / SSE)
         ▼
[ Next.js / React Frontend ] ──── Live Chat Widget + Product Cards + Sentiment Indicator
         │ (REST / tRPC)
         ▼
[ FastAPI / Node.js Backend ] ──── Orchestration & Guardrails
   ├── 1. Context Enrichment (Session cart, viewed items, user auth)
   ├── 2. RAG Pipeline (Vector Search on Pinecone/Qdrant + Hybrid Keyword Search)
   ├── 3. LLM Router (Prompt + Tool Calling: Check Stock, Track Order, Initiate Return)
   └── 4. Real-time Telemetry (Extract user intent, churn risk, product gaps)
         │
         ▼
[ PostgreSQL / ClickHouse + Admin Dashboard ] ── Actionable CX Insights & Trends`}
            </pre>
          </div>

          {/* Tier Selector & Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {tiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTier(t.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  activeTier === t.id
                    ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-bold text-white line-clamp-1">{t.title}</div>
                <div className="text-[10px] text-blue-300 truncate">{t.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Active Tier Deep-Dive */}
          {(() => {
            const current = tiers.find((t) => t.id === activeTier) || tiers[1];
            return (
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{current.icon}</span>
                    <div>
                      <h4 className="font-bold text-base text-white">{current.title}</h4>
                      <p className="text-xs text-blue-300">{current.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-slate-300">
                    Protocol: {current.protocol}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {current.description}
                </p>

                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Key Implementations & Guardrails:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {current.items.map((it, idx) => (
                      <div key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span className="text-slate-300">{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Fully implemented in this AuraTech / PulseCX Frontend codebase.
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
export default ArchitectureModal;
