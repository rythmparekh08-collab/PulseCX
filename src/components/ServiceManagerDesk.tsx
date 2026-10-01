import React, { useState, useEffect, useRef } from 'react';
import { CustomerProfile, ServiceManagerMessage } from '../types';

interface ServiceManagerDeskProps {
  customer: CustomerProfile | null;
  onOpenAuth: () => void;
}

export const ServiceManagerDesk: React.FC<ServiceManagerDeskProps> = ({
  customer,
  onOpenAuth
}) => {
  const [messages, setMessages] = useState<ServiceManagerMessage[]>([
    {
      id: 'mgr_msg_1',
      sender: 'manager',
      managerName: 'Marcus Vance',
      managerTitle: 'Senior Customer Service & Technical Experience Manager',
      text: "Hello! I'm Marcus Vance, your dedicated Service Experience Manager at AuraTech. I oversee customer resolutions, package escalations, and hardware replacements. How can my executive desk assist you today?",
      timestamp: 'Today at 09:00 AM',
      priority: 'Normal',
      status: 'Delivered'
    }
  ]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Critical / Escalation'>('Normal');
  const [ticketRef, setTicketRef] = useState('TICK-8842');
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const customerName = customer ? `${customer.firstName} ${customer.surname}` : 'Valued Customer';
    const customerPhone = customer ? customer.phone : 'Not provided';

    const newCustMsg: ServiceManagerMessage = {
      id: 'msg_' + Date.now(),
      sender: 'customer',
      text: input.trim(),
      timestamp: 'Just now',
      priority: priority,
      ticketRef: ticketRef,
      status: 'Sent'
    };

    setMessages((prev) => [...prev, newCustMsg]);
    const sentText = input.trim();
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/manager/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sentText,
          sender: 'customer',
          customerName,
          customerPhone,
          priority,
          ticketRef
        })
      });

      if (!res.ok) throw new Error('Failed to reach manager desk');
      const data = await res.json();

      if (data.managerReply) {
        setTimeout(() => {
          setMessages((prev) => [...prev, data.managerReply]);
        }, 600);
      }
    } catch {
      // Local fallback simulation
      setTimeout(() => {
        const replyMsg: ServiceManagerMessage = {
          id: 'mgr_msg_' + Date.now(),
          sender: 'manager',
          managerName: 'Marcus Vance',
          managerTitle: 'Senior Customer Service & Technical Experience Manager',
          text: `Thank you for contacting my desk directly, ${customerName}. I have personally flagged your message under priority reference #${ticketRef} (${priority}). I'm reviewing your tracking logs and device diagnostics right now. If needed, I will call your registered phone (${customerPhone}) directly.`,
          timestamp: 'Just now',
          priority: priority,
          ticketRef: ticketRef,
          status: 'Delivered'
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCallback = () => {
    if (!customer) {
      onOpenAuth();
      return;
    }
    setCallbackRequested(true);
    const cbMsg: ServiceManagerMessage = {
      id: 'cb_' + Date.now(),
      sender: 'customer',
      text: `[URGENT CALLBACK REQUEST]: Please call my registered phone number ${customer.phone} regarding reference #${ticketRef}.`,
      timestamp: 'Just now',
      priority: 'Critical / Escalation',
      ticketRef: ticketRef,
      status: 'Sent'
    };
    setMessages((prev) => [...prev, cbMsg]);

    setTimeout(() => {
      const ackMsg: ServiceManagerMessage = {
        id: 'ack_' + Date.now(),
        sender: 'manager',
        managerName: 'Marcus Vance',
        managerTitle: 'Senior Customer Service & Technical Experience Manager',
        text: `Callback request received for ${customer.firstName} at ${customer.phone}. I am pulling up your file and will initiate direct phone contact within 10 minutes.`,
        timestamp: 'Just now',
        priority: 'Critical / Escalation',
        ticketRef: ticketRef,
        status: 'Delivered'
      };
      setMessages((prev) => [...prev, ackMsg]);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto my-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
      {/* Left Column: Manager Profile & Case Controls */}
      <div className="lg:w-80 bg-slate-900 text-white p-6 sm:p-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
        <div>
          {/* Manager Badge */}
          <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white font-black text-xl flex items-center justify-center shadow-lg">
                MV
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Marcus Vance</h3>
              <p className="text-xs text-blue-300 font-medium">Senior Service Manager</p>
              <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span>Online • Direct Desk</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="py-4 space-y-2 text-xs text-slate-300 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">📞 Desk Phone:</span>
              <span className="font-mono text-white font-medium">+1 (800) 555-AURA ext 401</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">✉️ Direct Email:</span>
              <span className="text-blue-300 truncate">marcus.vance@auratech.example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">⏱️ Avg Response:</span>
              <span className="text-emerald-400 font-semibold">Under 3 minutes</span>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Ticket Reference</span>
              <span className="text-xs font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-800 font-semibold">
                #{ticketRef}
              </span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-semibold uppercase mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-800 text-white text-xs border border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="Normal">Normal Inquiry</option>
                <option value="High">High Priority</option>
                <option value="Critical / Escalation">Critical / Executive Escalation</option>
              </select>
            </div>

            {/* Customer Session Summary */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-xs space-y-1">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Customer Details</div>
              {customer ? (
                <>
                  <div className="font-bold text-white">{customer.firstName} {customer.surname}</div>
                  <div className="text-slate-300 truncate">{customer.email}</div>
                  <div className="text-slate-300 font-mono">{customer.phone}</div>
                  <div className="text-[10px] text-amber-300 font-semibold mt-1">Tier: {customer.membershipTier} Member</div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-amber-300 font-medium">Guest Session</div>
                  <button
                    onClick={onOpenAuth}
                    className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-2 rounded-lg text-[11px] transition"
                  >
                    Register / Sign In for Priority Callback
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Callback CTA */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={handleRequestCallback}
            disabled={callbackRequested}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              callbackRequested
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg'
            }`}
          >
            <span>📞</span>
            <span>{callbackRequested ? 'Callback Scheduled!' : 'Request Phone Callback'}</span>
          </button>
        </div>
      </div>

      {/* Right Column: Direct Messaging Thread & Chat Input */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {/* Thread Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>Direct Texting Platform with Service Manager</span>
              <span className="text-[11px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                Direct Desk
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Personalized two-way text channel for delivery issues, warranty replacements, and technical support.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Channel</span>
            <span className="text-xs font-bold text-slate-700">Encrypted 2-Way Text</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isCust = msg.sender === 'customer';
            return (
              <div key={msg.id} className={`flex flex-col ${isCust ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2.5 max-w-[85%]">
                  {!isCust && (
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0 mb-1">
                      MV
                    </div>
                  )}
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm shadow-sm leading-relaxed ${
                      isCust
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {!isCust && (
                      <div className="text-[11px] text-blue-600 font-bold mb-1 flex items-center gap-1.5 pb-1 border-b border-slate-100">
                        <span>Marcus Vance • Senior Service Manager</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.status && <span>• {msg.status}</span>}
                  {msg.priority !== 'Normal' && (
                    <span className="text-amber-600 font-semibold">• {msg.priority}</span>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-1">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                MV
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm text-xs text-slate-600">
                Marcus Vance is typing response...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Text Action Chips */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Quick Text:</span>
          <button
            onClick={() => setInput("Hello Marcus, can you verify the courier arrival window for tracking #AT-9842?")}
            className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-full border border-slate-200 font-medium transition shrink-0"
          >
            Verify Courier Arrival
          </button>
          <button
            onClick={() => setInput("I need to report package damage on arrival and initiate an expedited replacement.")}
            className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-full border border-slate-200 font-medium transition shrink-0"
          >
            Report Package Damage
          </button>
          <button
            onClick={() => setInput("Can you check if my Aura Pulse Smartwatch is still covered under active warranty?")}
            className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-full border border-slate-200 font-medium transition shrink-0"
          >
            Check Device Warranty
          </button>
        </div>

        {/* Text Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Text directly to Service Manager Marcus Vance..."
            className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition bg-slate-50/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Send Text</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
export default ServiceManagerDesk;
