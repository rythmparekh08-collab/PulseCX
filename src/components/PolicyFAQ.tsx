import React, { useState } from 'react';

interface PolicyFAQProps {
  onAskNova: (prompt: string) => void;
}

export const PolicyFAQ: React.FC<PolicyFAQProps> = ({ onAskNova }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is AuraTech’s 30-Day Return & Refund Policy?',
      answer: 'We want you to be completely thrilled with your purchase. AuraTech offers a 30-day return window for unopened or gently tested items in original packaging. We provide free prepaid return shipping labels for all domestic returns. Once received and inspected, refunds process back to your original payment method within 3–5 business days.',
      prompt: 'Can you explain the 30-day return and refund process?'
    },
    {
      question: 'What are the shipping options and delivery timelines?',
      answer: 'We offer Free Standard Shipping on all orders over $50 (arriving in 3–5 business days). For urgent needs, Express Expedited delivery is available for $12.99 (1–2 business days). International deliveries arrive within 7–12 business days.',
      prompt: 'What are your shipping rates and how fast is express delivery?'
    },
    {
      question: 'How does Aura Pulse battery life compare to other smartwatches?',
      answer: 'The Aura Pulse Smartwatch is engineered with custom low-power silicon that delivers up to 14 days of typical battery life on a single charge (and up to 6 days under heavy GPS workout tracking). Unlike watches requiring nightly recharging, the Aura Pulse lets you continuously track sleep apnea and circadian trends without interruption.',
      prompt: 'How does the Aura Pulse battery compare to everyday smartwatches?'
    },
    {
      question: 'Will Aura Studio ANC Headphones work with an older Bluetooth 4.2 TV or laptop?',
      answer: 'Yes! While the Aura Studio ANC utilizes high-efficiency Bluetooth 5.3 for modern low-latency spatial audio, it is completely backward compatible with Bluetooth 4.2 devices. In addition, an gold-plated 3.5mm analog audio cable is included in every box for zero-latency hardwired listening.',
      prompt: 'Will the Studio ANC headphones connect to my older TV with Bluetooth 4.2?'
    },
    {
      question: 'How do I contact senior human support or escalate a billing inquiry?',
      answer: 'Nova is equipped with automated escalation protocols. For complex billing, warranty disputes, or damage claims, our human support team is ready to help at support@auratech.example.com. Live tickets can also be opened at auratech.example.com/support. Support hours are Monday–Friday, 9:00 AM – 7:00 PM EST.',
      prompt: 'I want to speak with a human support agent about my invoice.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          Customer Policies & FAQ
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Transparent Care & Policies
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Everything you need to know about our smart electronics, warranties, shipping, and returns.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  {faq.question}
                </span>
                <span className={`text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}>
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-fadeIn">
                  <p className="leading-relaxed">{faq.answer}</p>
                  <div className="flex items-center justify-end pt-2">
                    <button
                      onClick={() => onAskNova(faq.prompt)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200/60 transition"
                    >
                      <span>✨ Ask Nova this in Chat</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PolicyFAQ;
