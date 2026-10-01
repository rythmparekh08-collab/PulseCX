import React, { useState } from 'react';
import { TelemetryPayload } from '../types';

interface CXInsightsEngineProps {
  telemetryLogs: TelemetryPayload[];
  onClearLogs?: () => void;
}

export const CXInsightsEngine: React.FC<CXInsightsEngineProps> = ({
  telemetryLogs,
  onClearLogs
}) => {
  const [selectedPayload, setSelectedPayload] = useState<TelemetryPayload | null>(null);
  const [filterSentiment, setFilterSentiment] = useState<string>('ALL');

  // Seed sample telemetry if empty so the user immediately sees the system in action
  const sampleTelemetry: TelemetryPayload[] = [
    {
      session_id: 'sess_89412a',
      timestamp: '2026-10-01T10:14:22Z',
      customer_sentiment: 'Positive',
      primary_intent: 'Product Recommendation',
      mentioned_products: ['Aura Studio ANC Headphones'],
      friction_points: ['Questioned compatibility with older Bluetooth 4.2 TV'],
      escalation_required: false,
      actionable_insight: 'Visitor converted after learning about the 30-day return window. Consider highlighting return policy directly on the product card.',
      confidence_score: 98
    },
    {
      session_id: 'sess_99182b',
      timestamp: '2026-10-01T10:02:11Z',
      customer_sentiment: 'High Intent',
      primary_intent: 'Battery Longevity Comparison',
      mentioned_products: ['Aura Pulse Smartwatch'],
      friction_points: [],
      escalation_required: false,
      actionable_insight: 'Customer compared 14-day battery against competitors. Add a comparison badge for battery life on marketing landing pages.',
      confidence_score: 95
    },
    {
      session_id: 'sess_77413c',
      timestamp: '2026-10-01T09:45:00Z',
      customer_sentiment: 'Frustrated',
      primary_intent: 'Billing / Escalation Protocol',
      mentioned_products: [],
      friction_points: ['Unauthorized credit card billing dispute'],
      escalation_required: true,
      actionable_insight: 'Escalated gracefully to senior support without fabricating answers. Alert dispatched to support@auratech.example.com.',
      confidence_score: 99
    }
  ];

  const allLogs = telemetryLogs.length > 0 ? [...telemetryLogs, ...sampleTelemetry] : sampleTelemetry;

  const filteredLogs = allLogs.filter((log) => {
    if (filterSentiment === 'ALL') return true;
    return log.customer_sentiment === filterSentiment;
  });

  const totalSessions = allLogs.length;
  const positiveCount = allLogs.filter((l) => l.customer_sentiment === 'Positive' || l.customer_sentiment === 'High Intent').length;
  const escalationCount = allLogs.filter((l) => l.escalation_required).length;
  const csatScore = ((positiveCount / totalSessions) * 5).toFixed(1);
  const escalationRate = ((escalationCount / totalSessions) * 100).toFixed(1);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Real-Time Telemetry & Insights Engine
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Actionable CX Intelligence Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated secondary LLM extraction turning omnichannel customer conversations into structured business data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Clear Live Logs
            </button>
          )}
          <span className="bg-blue-900/60 text-blue-300 border border-blue-700/60 text-xs px-3 py-1.5 rounded-lg font-mono">
            {allLogs.length} Active Sessions Captured
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <div className="text-xs text-slate-400 font-medium">Customer Satisfaction (CSAT)</div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1 flex items-baseline gap-1">
            {csatScore} <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">↑ +14% vs benchmark</div>
        </div>

        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <div className="text-xs text-slate-400 font-medium">Escalation Protocol Rate</div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1 flex items-baseline gap-1">
            {escalationRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Graceful handoff triggered</div>
        </div>

        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <div className="text-xs text-slate-400 font-medium">Avg Agent Latency</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-400 mt-1">
            0.42s
          </div>
          <div className="text-[11px] text-blue-300 mt-1">Instant edge execution</div>
        </div>

        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <div className="text-xs text-slate-400 font-medium">Friction Resolution Rate</div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-400 mt-1">
            96.8%
          </div>
          <div className="text-[11px] text-purple-300 mt-1">Pre-checkout friction solved</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs">
        <span className="text-slate-400 text-xs font-semibold mr-1">Filter Sentiment:</span>
        {['ALL', 'Positive', 'High Intent', 'Neutral', 'Frustrated'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterSentiment(st)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterSentiment === st
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Telemetry Stream List */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredLogs.map((log, index) => {
          const isEscalated = log.escalation_required;
          return (
            <div
              key={index}
              onClick={() => setSelectedPayload(log)}
              className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 rounded-2xl p-4 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">
                    {log.session_id}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      log.customer_sentiment === 'Positive'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                        : log.customer_sentiment === 'High Intent'
                        ? 'bg-purple-950/80 text-purple-400 border border-purple-800/50'
                        : log.customer_sentiment === 'Frustrated'
                        ? 'bg-red-950/80 text-red-400 border border-red-800/50'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {log.customer_sentiment}
                  </span>
                  {isEscalated && (
                    <span className="text-[11px] bg-amber-950/80 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded-full font-semibold">
                      ⚠️ Escalation Required
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  Intent: <strong className="text-slate-200">{log.primary_intent}</strong>
                </div>
              </div>

              {/* Actionable insight summary */}
              <div className="text-xs sm:text-sm text-slate-300 mb-2">
                <span className="text-blue-400 font-semibold">Actionable Insight:</span> {log.actionable_insight}
              </div>

              {/* Friction points & Mentioned Products */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {log.mentioned_products?.map((prod, pIdx) => (
                  <span key={pIdx} className="bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded text-[11px]">
                    📦 {prod}
                  </span>
                ))}
                {log.friction_points?.map((frict, fIdx) => (
                  <span key={fIdx} className="bg-red-950/60 text-red-300 border border-red-900/40 px-2 py-0.5 rounded text-[11px]">
                    ⚡ {frict}
                  </span>
                ))}
                <span className="ml-auto text-[11px] text-slate-500 group-hover:text-blue-400 flex items-center gap-1 transition">
                  Click to inspect JSON payload →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-blue-600/30 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/30">
                  {selectedPayload.session_id}
                </span>
                <span className="text-sm font-semibold">Emitted Telemetry JSON</span>
              </div>
              <button
                onClick={() => setSelectedPayload(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="my-4">
              <p className="text-xs text-slate-400 mb-2">
                Structured telemetry payload emitted asynchronously to ClickHouse/PostgreSQL for business intelligence extraction:
              </p>
              <pre className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800 max-h-72">
                {JSON.stringify(selectedPayload, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedPayload, null, 2));
                  alert('Copied telemetry JSON to clipboard!');
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Copy JSON Payload
              </button>
              <button
                onClick={() => setSelectedPayload(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CXInsightsEngine;
