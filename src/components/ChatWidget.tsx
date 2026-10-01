import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, SentimentType, TelemetryPayload, UserContext } from '../types';
import { INITIAL_GREETING, ESCALATION_MESSAGE } from '../prompts/novaSystemPrompt';
import { SentimentIndicator } from './SentimentIndicator';

interface ChatWidgetProps {
  userContext?: UserContext;
  onEmitTelemetry?: (telemetry: TelemetryPayload) => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  userContext = {
    userId: 'guest_user_482',
    cartCount: 0,
    cartTotal: 0,
    cartItems: [],
    device: 'Desktop Chrome'
  },
  onEmitTelemetry,
  externalPrompt,
  onClearExternalPrompt
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      role: 'assistant',
      text: INITIAL_GREETING,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState<SentimentType>('Neutral');
  const [currentIntent, setCurrentIntent] = useState<string>('General Inquiries');
  const [showContextBanner, setShowContextBanner] = useState(false);
  const [sessionId] = useState(() => 'sess_' + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Handle external prompts (e.g. from clicking "Ask Nova" on a product card)
  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      handleSendPrompt(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [externalPrompt]);

  const quickPrompts = [
    { label: '30-Day Return Policy', prompt: 'What is your return and refund policy?' },
    { label: 'Aura Pulse Battery Life', prompt: 'How long does the battery on the Aura Pulse Smartwatch last?' },
    { label: 'Bluetooth 4.2 Compatibility', prompt: 'Will the Aura Studio ANC Headphones work with an older Bluetooth 4.2 TV?' },
    { label: 'Track Order #AT-9842', prompt: 'Can you track my order #AT-9842?' },
    { label: 'Shipping Timelines', prompt: 'What are your shipping options and rates?' },
    { label: 'Billing Dispute (Escalation)', prompt: 'I have a disputed charge on my credit card statement for an unauthorized order.' }
  ];

  // Client-side intelligent rule responder (aligned 100% with Nova's System Prompt)
  const generateNovaResponse = (userText: string): { reply: string; sentiment: SentimentType; intent: string; friction: string[]; escalate: boolean; insight: string } => {
    const lower = userText.toLowerCase();

    // 1. Escalation check (complex billing, damage disputes, unauthorized transactions)
    if (
      lower.includes('dispute') ||
      lower.includes('credit card') ||
      lower.includes('unauthorized') ||
      lower.includes('fraud') ||
      lower.includes('lawyer') ||
      lower.includes('damaged in transit') ||
      lower.includes('broken box') ||
      lower.includes('stolen')
    ) {
      return {
        reply: ESCALATION_MESSAGE,
        sentiment: 'Frustrated',
        intent: 'Billing / Escalation Protocol',
        friction: ['Complex account billing or dispute requiring human oversight'],
        escalate: true,
        insight: 'Customer requested assistance with a billing or dispute issue. Gracefully routed to senior support protocol.'
      };
    }

    // 2. Returns & Refunds
    if (lower.includes('return') || lower.includes('refund') || lower.includes('warranty') || lower.includes('trial')) {
      return {
        reply: "I understand how reassuring clear policies are before and after making a purchase! AuraTech offers a hassle-free **30-day return window** for unopened or gently tested items in original packaging.\n\n• **Prepaid Labels:** Free domestic return shipping labels are provided.\n• **Fast Refunds:** Processed back to your original payment method within 3–5 business days after inspection.\n\nYou can review our full terms here: [View Warranty & Return Policy](https://auratech.example.com/returns).",
        sentiment: 'Positive',
        intent: 'Return & Warranty Policy',
        friction: ['Required reassurance regarding return timeline & prepaid shipping'],
        escalate: false,
        insight: 'Visitor converted after learning about the 30-day return window. Consider highlighting return policy directly on the product card.'
      };
    }

    // 3. Aura Pulse Smartwatch inquiry
    if (lower.includes('pulse') || lower.includes('smartwatch') || lower.includes('ecg') || lower.includes('watch') || lower.includes('sleep')) {
      return {
        reply: "I know how critical reliable battery and health metrics are for your daily routine! The **Aura Pulse Smartwatch ($199)** features an exceptional **14-day battery life** along with medical-grade continuous ECG and clinical sleep stage analytics.\n\n• **Sapphire AMOLED:** Scratch-resistant always-on display.\n• **Water Resistance:** 50 meters (5 ATM) titanium bezel.\n\nWould you like me to add the Aura Pulse to your order with free standard shipping?",
        sentiment: 'High Intent',
        intent: 'Product Recommendation',
        friction: [],
        escalate: false,
        insight: 'High engagement on wearable battery longevity. 14-day battery is the primary purchase catalyst.'
      };
    }

    // 4. Aura Studio ANC Headphones & Bluetooth compatibility
    if (lower.includes('headphone') || lower.includes('studio') || lower.includes('anc') || lower.includes('bluetooth') || lower.includes('tv') || lower.includes('noise')) {
      const isBt42 = lower.includes('4.2') || lower.includes('older') || lower.includes('tv');
      return {
        reply: "I appreciate you checking compatibility for your setup! Yes, the **Aura Studio ANC Headphones ($249)** feature advanced Bluetooth 5.3 with full backward compatibility for **Bluetooth 4.2**, including smart TVs and older transmitters.\n\n• **Hybrid ANC:** Blocks up to 42dB of environmental sound.\n• **40-Hour Playtime:** Plus 3.5mm analog cable included in the box for zero-latency listening.\n\nCan I help you reserve a pair today?",
        sentiment: isBt42 ? 'Neutral' : 'Positive',
        intent: 'Product Recommendation & Compatibility',
        friction: isBt42 ? ['Questioned compatibility with older Bluetooth 4.2 TV'] : [],
        escalate: false,
        insight: isBt42
          ? 'Visitor questioned compatibility with older Bluetooth 4.2 TV. Resolved affirmatively, eliminating purchase hesitation.'
          : 'High acoustic interest in 40h playtime and hybrid noise reduction.'
      };
    }

    // 5. Aura Hub Pro & Smart Home
    if (lower.includes('hub') || lower.includes('matter') || lower.includes('zigbee') || lower.includes('smart home') || lower.includes('setup')) {
      return {
        reply: "I'm delighted to assist with your smart home setup! The **Aura Hub Pro ($99)** is our unified smart central controller equipped with native **Matter 1.2 and Zigbee 3.0** support.\n\n• **Local Automation:** Runs scenes offline with zero cloud latency.\n• **Quick Setup:** Connect to power via USB-C, launch the Aura app, and tap 'Discover Devices'.\n\nWould you like setup tips or compatibility checks for your current accessories?",
        sentiment: 'Positive',
        intent: 'Basic Troubleshooting & Setup',
        friction: [],
        escalate: false,
        insight: 'Customer exploring Matter ecosystem integration. Emphasized local processing reliability.'
      };
    }

    // 6. Order Tracking & Delivery
    if (lower.includes('track') || lower.includes('order') || lower.includes('package') || lower.includes('at-9842') || lower.includes('at-1024') || lower.includes('status')) {
      if (lower.includes('9842')) {
        return {
          reply: "I understand how eager you are to receive your package! Order **#AT-9842** (Aura Studio ANC Headphones) is currently **Out for Delivery** via FedEx Express.\n\n• **Estimated Delivery:** Today by 4:30 PM EST.\n• **Tracking Number:** FX-884102941.\n\nPlease let me know if you would like me to send live SMS delivery alerts!",
          sentiment: 'Positive',
          intent: 'Order Tracking & Delivery',
          friction: [],
          escalate: false,
          insight: 'Customer requested order status. Provided instant real-time package carrier update.'
        };
      }
      return {
        reply: "I'm happy to help you locate your package! Please provide your 6-digit order number (e.g., `#AT-9842`) or the email address used at checkout so I can retrieve live tracking details immediately.",
        sentiment: 'Neutral',
        intent: 'Order Tracking & Delivery',
        friction: [],
        escalate: false,
        insight: 'Customer initiated tracking flow; requested order identifier.'
      };
    }

    // 7. Shipping Rates & Delivery Timelines
    if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('express') || lower.includes('cost') || lower.includes('international')) {
      return {
        reply: "I know how important reliable delivery times are! AuraTech provides three transparent delivery options:\n\n• **Free Standard Shipping:** On orders over $50 (3–5 business days).\n• **Express Expedited:** $12.99 (1–2 business days).\n• **International Shipping:** 7–12 business days worldwide.\n\nOrders placed before 2:00 PM EST ship the very same day!",
        sentiment: 'Positive',
        intent: 'Shipping & Delivery Timelines',
        friction: [],
        escalate: false,
        insight: 'Customer checked shipping thresholds. Cart value qualified for free domestic shipping.'
      };
    }

    // 8. Human Support hours
    if (lower.includes('human') || lower.includes('agent') || lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('hours')) {
      return {
        reply: "We are always here for you! Our dedicated customer success team is available Monday through Friday from **9:00 AM to 7:00 PM EST**.\n\n• **Email:** support@auratech.example.com\n• **Live Tickets:** [Open a Live Ticket](https://auratech.example.com/support)\n\nCan I assist you with anything directly in the meantime?",
        sentiment: 'Neutral',
        intent: 'Human Support Contact',
        friction: [],
        escalate: false,
        insight: 'Visitor asked for official support hours and email channels.'
      };
    }

    // Default polite empathetic fallback
    return {
      reply: "Thank you for reaching out! I'm here to assist with AuraTech's smart devices, order tracking, shipping options, or 30-day returns. How can I best guide you today?",
      sentiment: 'Neutral',
      intent: 'General Inquiry',
      friction: [],
      escalate: false,
      insight: 'General engagement turn. Prompted for specific smart electronics inquiries.'
    };
  };

  const handleSendPrompt = (promptText: string) => {
    executeSendMessage(promptText);
  };

  const executeSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // First attempt to reach the FastAPI / Node / Python orchestration server
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          context: userContext,
          sessionId: sessionId
        })
      });

      if (!res.ok) {
        throw new Error('API server returned error');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: 'msg_' + Date.now(),
        role: 'assistant',
        text: data.reply,
        timestamp: 'Just now',
        escalationNotice: data.escalation_required
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (data.sentiment) setCurrentSentiment(data.sentiment);
      if (data.intent) setCurrentIntent(data.intent);

      // Emit telemetry to parent dashboard
      if (onEmitTelemetry && data.telemetry) {
        onEmitTelemetry(data.telemetry);
      }
    } catch {
      // Offline fallback: Use the built-in Nova Knowledge Base & Guardrails Engine
      setTimeout(() => {
        const result = generateNovaResponse(textToSend);
        const assistantMsg: ChatMessage = {
          id: 'msg_' + Date.now(),
          role: 'assistant',
          text: result.reply,
          timestamp: 'Just now',
          escalationNotice: result.escalate
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setCurrentSentiment(result.sentiment);
        setCurrentIntent(result.intent);

        // Generate structured CX Insights Engine payload (as requested in Section 3)
        const telemetryPayload: TelemetryPayload = {
          session_id: sessionId,
          timestamp: new Date().toISOString(),
          customer_sentiment: result.sentiment,
          primary_intent: result.intent,
          mentioned_products: textToSend.toLowerCase().includes('pulse')
            ? ['Aura Pulse Smartwatch']
            : textToSend.toLowerCase().includes('hub')
            ? ['Aura Hub Pro']
            : textToSend.toLowerCase().includes('headphone') || textToSend.toLowerCase().includes('studio') || textToSend.toLowerCase().includes('bluetooth')
            ? ['Aura Studio ANC Headphones']
            : [],
          friction_points: result.friction,
          escalation_required: result.escalate,
          actionable_insight: result.insight,
          confidence_score: 96
        };

        if (onEmitTelemetry) {
          onEmitTelemetry(telemetryPayload);
        }
      }, 450);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    executeSendMessage(input);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg_0',
        role: 'assistant',
        text: INITIAL_GREETING,
        timestamp: 'Just now'
      }
    ]);
    setCurrentSentiment('Neutral');
    setCurrentIntent('General Inquiries');
  };

  // Helper to format markdown-like text with links and bolding
  const renderMessageContent = (text: string) => {
    // Process markdown links [label](url) and **bold**
    const parts = text.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed">
        {parts.map((paragraph, pIdx) => {
          if (!paragraph.trim()) return <div key={pIdx} className="h-1" />;

          // Process bullet points
          const isBullet = paragraph.trim().startsWith('•') || paragraph.trim().startsWith('* ');
          const cleanedText = isBullet ? paragraph.replace(/^[•*]\s*/, '') : paragraph;

          // Simple markdown regex for bold and links
          const formatted = cleanedText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline font-semibold hover:text-blue-500">$1</a>');

          if (isBullet) {
            return (
              <div key={pIdx} className="flex items-start gap-1.5 pl-1">
                <span className="text-blue-400 font-bold shrink-0">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatted }} />
              </div>
            );
          }

          return <p key={pIdx} dangerouslySetInnerHTML={{ __html: formatted }} />;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 z-50 flex items-center gap-3 group border border-white/20"
          aria-label="Open Nova AI Customer Assistant"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
              ✨
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-indigo-600 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-indigo-600 rounded-full" />
          </div>
          <div className="text-left pr-2 hidden sm:block">
            <div className="text-xs font-medium text-blue-100 flex items-center gap-1.5">
              <span>Nova</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <span className="text-[10px] text-emerald-200">Online</span>
            </div>
            <div className="text-sm font-bold">Ask AuraTech AI</div>
          </div>
        </button>
      )}

      {/* Floating Chat Widget Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col h-[580px] max-h-[calc(100vh-4rem)] overflow-hidden font-sans z-50 animate-fadeIn transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 p-4 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-base shadow-sm">
                  ✨
                </div>
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    Nova • AuraTech Support
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-1.5 py-0.5 rounded font-medium">
                      AI Agent
                    </span>
                  </h3>
                  <p className="text-xs text-blue-100">Omnichannel CX Assistant • Replies instantly</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset Conversation Button */}
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                {/* Toggle Context Info */}
                <button
                  onClick={() => setShowContextBanner(!showContextBanner)}
                  title="Toggle Context Enrichment"
                  className={`p-1.5 rounded-lg transition ${showContextBanner ? 'bg-white/20 text-white' : 'text-blue-100 hover:text-white hover:bg-white/10'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close widget"
                  className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition ml-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Context Enrichment Drawer (When opened) */}
            {showContextBanner && (
              <div className="mt-3 pt-2.5 border-t border-white/20 text-[11px] text-blue-100 bg-white/10 rounded-lg p-2 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span>⚡ Context Enrichment Layer Active</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>Cart Value: <strong className="text-white">${userContext.cartTotal}</strong> ({userContext.cartCount} items)</div>
                  <div>Device: <strong className="text-white">{userContext.device}</strong></div>
                  <div>Shipping: <strong className="text-emerald-300">{userContext.cartTotal >= 50 ? 'Free Standard Eligible' : 'Standard ($50 to Free)'}</strong></div>
                  <div>Session ID: <span className="font-mono text-white">{sessionId}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Sentiment & Intent Pill Bar */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
            <SentimentIndicator sentiment={currentSentiment} intent={currentIntent} compact={true} />
            <span className="text-[10px] text-slate-400 font-medium">Session: {sessionId}</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mb-1">
                        N
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : msg.escalationNotice
                          ? 'bg-amber-50 text-slate-900 border border-amber-300 rounded-bl-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                      }`}
                    >
                      {msg.escalationNotice && (
                        <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs mb-1.5 pb-1 border-b border-amber-200">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>Senior Support Escalation</span>
                        </div>
                      )}
                      {renderMessageContent(msg.text)}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-1">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  N
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-3 py-2 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-1 text-[11px] font-medium text-slate-600">Nova is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-[10px] text-slate-400 font-semibold uppercase shrink-0 pl-1">Quick:</span>
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(item.prompt)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-full border border-slate-200/60 font-medium transition shrink-0 disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-200/80 flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nova about products, returns, or order tracking..."
              className="flex-1 text-xs sm:text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition bg-slate-50/50"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Send</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
export default ChatWidget;
