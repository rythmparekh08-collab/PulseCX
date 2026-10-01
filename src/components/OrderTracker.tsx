import React, { useState } from 'react';
import { ORDER_DATABASE } from '../data/products';

interface OrderTrackerProps {
  onAskNova: (prompt: string) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ onAskNova }) => {
  const [orderQuery, setOrderQuery] = useState('AT-9842');
  const [activeOrder, setActiveOrder] = useState<typeof ORDER_DATABASE[0] | null>(ORDER_DATABASE[0]);
  const [searched, setSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderQuery.trim().toUpperCase().replace('#', '');
    const found = ORDER_DATABASE.find((o) => o.orderId.toUpperCase() === clean);
    setActiveOrder(found || null);
    setSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden my-8">
      {/* Tracker Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
            Omnichannel Fulfillment
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Track Your AuraTech Shipment
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Real-time carrier synchronization with FedEx & UPS. Enter your order number below or query Nova in the live chat widget.
        </p>

        {/* Search input */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="e.g. AT-9842 or AT-1024"
              className="w-full bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-2xl transition shadow-lg shadow-blue-600/30 shrink-0"
          >
            Track Shipment
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
          <span>Try sample orders:</span>
          <button
            type="button"
            onClick={() => {
              setOrderQuery('AT-9842');
              setActiveOrder(ORDER_DATABASE[0]);
            }}
            className="underline hover:text-white font-mono"
          >
            #AT-9842 (Out for Delivery)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setOrderQuery('AT-1024');
              setActiveOrder(ORDER_DATABASE[1]);
            }}
            className="underline hover:text-white font-mono"
          >
            #AT-1024 (In Transit)
          </button>
        </div>
      </div>

      {/* Tracker Content */}
      <div className="p-6 sm:p-8">
        {activeOrder ? (
          <div className="space-y-8">
            {/* Status Highlight Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-blue-50/60 rounded-2xl border border-blue-100">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                  Status: {activeOrder.status}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Order #{activeOrder.orderId}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Destination: {activeOrder.destination} • Carrier: {activeOrder.carrier} ({activeOrder.trackingNumber})
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-slate-500 block">Estimated Arrival</span>
                <span className="text-base font-bold text-emerald-600">
                  {activeOrder.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Timeline Progress */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                Fulfillment Milestones
              </h4>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeOrder.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                        step.completed
                          ? 'bg-blue-600 border-white ring-4 ring-blue-100'
                          : 'bg-white border-slate-300'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.step}
                        </span>
                        <span className="text-slate-400 text-[11px] font-mono">{step.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help / Ask Nova Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Need to reschedule delivery or change address?
              </div>
              <button
                onClick={() => onAskNova(`Can you give me the latest tracking update and delivery details for order #${activeOrder.orderId}?`)}
                className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>Ask Nova for Live Delivery Alerts</span>
              </button>
            </div>
          </div>
        ) : (
          searched && (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <div className="text-3xl">📦</div>
              <div className="font-semibold text-slate-800">No order found matching "{orderQuery}"</div>
              <p className="text-xs max-w-sm mx-auto">
                Orders typically take 15–30 minutes to appear in carrier tracking systems. Try sample orders `#AT-9842` or `#AT-1024`.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default OrderTracker;
