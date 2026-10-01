import React, { useState } from 'react';
import { CustomerProfile, PaymentRecord, RefundRecord } from '../types';

interface PaymentTrackerProps {
  customer: CustomerProfile | null;
  onTextServiceManager: (topic?: string) => void;
  onOpenAuth: () => void;
}

export const PaymentTracker: React.FC<PaymentTrackerProps> = ({
  customer,
  onTextServiceManager,
  onOpenAuth
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'payments' | 'refunds'>('payments');
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentRecord | null>(null);
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [returnProduct, setReturnProduct] = useState('Aura Studio ANC Headphones');
  const [returnReason, setReturnReason] = useState('Found incompatible with older equipment');
  const [initiateSuccess, setInitiateSuccess] = useState(false);

  // Initial Payment History
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      transactionId: 'TXN-884102-AU',
      orderNumber: 'ORD-2026-9842',
      productName: 'Aura Studio ANC Headphones (Matte Black)',
      amount: 249.00,
      currency: 'USD',
      date: 'Sep 29, 2026, 09:14 AM',
      paymentMethod: 'Apple Pay (Mastercard •••• 4242)',
      status: 'Paid / Settled',
      customerEmail: customer?.email || 'alex.mercer@example.com',
      customerName: customer ? `${customer.firstName} ${customer.surname}` : 'Alex Mercer',
      customerPhone: customer?.phone || '+1 (555) 234-8901',
      billingAddress: '742 Evergreen Terrace, Austin TX 78701',
      invoice: {
        invoiceNumber: 'INV-2026-9842',
        invoiceDate: 'Sep 29, 2026',
        dueDate: 'Paid in Full',
        subtotal: 249.00,
        tax: 0.00,
        shipping: 0.00,
        shippingDiscount: 'Complimentary Gold Member Express Shipping (-$12.99)',
        total: 249.00,
        authCode: 'AUTH_99214_APL',
        items: [
          {
            sku: 'SKU-ANC-401',
            description: 'Aura Studio ANC Headphones (Matte Black) + 2-Year Manufacturer Warranty',
            qty: 1,
            unitPrice: 249.00,
            total: 249.00
          }
        ]
      }
    },
    {
      transactionId: 'TXN-552190-AU',
      orderNumber: 'ORD-2026-5521',
      productName: 'Aura Hub Pro - Smart Home Matter Controller',
      amount: 99.00,
      currency: 'USD',
      date: 'Sep 26, 2026, 08:30 AM',
      paymentMethod: 'Visa •••• 8821',
      status: 'Refunded',
      customerEmail: customer?.email || 'alex.mercer@example.com',
      customerName: customer ? `${customer.firstName} ${customer.surname}` : 'Alex Mercer',
      customerPhone: customer?.phone || '+1 (555) 234-8901',
      billingAddress: '742 Evergreen Terrace, Austin TX 78701',
      refundRef: 'REF-4091',
      invoice: {
        invoiceNumber: 'INV-2026-5521',
        invoiceDate: 'Sep 26, 2026',
        dueDate: 'Refunded in Full ($99.00)',
        subtotal: 99.00,
        tax: 0.00,
        shipping: 0.00,
        shippingDiscount: 'Free Standard Domestic Shipping',
        total: 99.00,
        authCode: 'AUTH_44120_VSA',
        items: [
          {
            sku: 'SKU-HUB-99',
            description: 'Aura Hub Pro - Smart Home Matter & Zigbee Controller',
            qty: 1,
            unitPrice: 99.00,
            total: 99.00
          }
        ]
      }
    },
    {
      transactionId: 'TXN-994120-AU',
      orderNumber: 'ORD-2026-1024',
      productName: 'Aura Pulse Smartwatch Replacement Band (Titanium Gray)',
      amount: 49.00,
      currency: 'USD',
      date: 'Sep 30, 2026, 03:45 PM',
      paymentMethod: 'Mastercard •••• 1092',
      status: 'Refund Processing',
      customerEmail: 'jordan.reed@example.com',
      customerName: 'Jordan Reed',
      customerPhone: '+1 (555) 876-5432',
      billingAddress: '1200 4th Ave, Seattle WA 98101',
      refundRef: 'REF-8820',
      invoice: {
        invoiceNumber: 'INV-2026-1024',
        invoiceDate: 'Sep 30, 2026',
        dueDate: 'Pending Refund Clearing',
        subtotal: 49.00,
        tax: 0.00,
        shipping: 0.00,
        shippingDiscount: 'Standard Shipping',
        total: 49.00,
        authCode: 'AUTH_11203_MC',
        items: [
          {
            sku: 'SKU-BND-49',
            description: 'Aura Pulse Smartwatch Replacement Band (Titanium Gray)',
            qty: 1,
            unitPrice: 49.00,
            total: 49.00
          }
        ]
      }
    }
  ]);

  // Initial Refunds Data
  const [refunds, setRefunds] = useState<RefundRecord[]>([
    {
      refundId: 'REF-4091',
      rmaNumber: 'RMA-8842-RET',
      orderNumber: 'ORD-2026-5521',
      productName: 'Aura Hub Pro - Smart Home Matter Controller',
      refundAmount: 99.00,
      currency: 'USD',
      refundStatus: 'Completed / Credited',
      customerName: customer ? `${customer.firstName} ${customer.surname}` : 'Alex Mercer',
      customerEmail: customer?.email || 'alex.mercer@example.com',
      destinationCard: 'Visa ending in •••• 8821',
      initiatedDate: 'Sep 28, 2026',
      completedDate: 'Sep 30, 2026',
      returnCarrier: 'FedEx Ground Return',
      returnTrackingNumber: 'FX-RET-9901428',
      timeline: [
        { step: 'Return Authorization (RMA) Approved', detail: '30-Day Risk-Free Trial policy applied. Instant RMA generated.', timestamp: 'Sep 28, 10:00 AM', completed: true },
        { step: 'Prepaid Return Shipping Label Generated', detail: 'Free domestic FedEx prepaid label issued to customer email.', timestamp: 'Sep 28, 10:05 AM', completed: true },
        { step: 'Returned Package Received at Return Hub', detail: 'Package scanned at AuraTech Return Logistics, Dallas TX.', timestamp: 'Sep 29, 02:30 PM', completed: true },
        { step: 'Inspection & Diagnostic Passed', detail: 'Hardware gently tested, repackaged. 100% full refund approved.', timestamp: 'Sep 29, 04:15 PM', completed: true },
        { step: 'Refund Credited to Original Payment Method', detail: '$99.00 credited back to Visa •••• 8821 (Cleared by bank).', timestamp: 'Sep 30, 09:00 AM', completed: true }
      ]
    },
    {
      refundId: 'REF-8820',
      rmaNumber: 'RMA-9921-RET',
      orderNumber: 'ORD-2026-1024',
      productName: 'Aura Pulse Smartwatch Replacement Band (Titanium Gray)',
      refundAmount: 49.00,
      currency: 'USD',
      refundStatus: 'In Progress (Card Clearing)',
      customerName: 'Jordan Reed',
      customerEmail: 'jordan.reed@example.com',
      destinationCard: 'Mastercard ending in •••• 1092',
      initiatedDate: 'Sep 30, 2026',
      completedDate: 'Expected Oct 02, 2026',
      returnCarrier: 'UPS Return Service',
      returnTrackingNumber: '1Z-RET-4481029',
      timeline: [
        { step: 'Return Authorization (RMA) Approved', detail: 'Customer requested return due to incorrect wrist size.', timestamp: 'Sep 30, 04:00 PM', completed: true },
        { step: 'Prepaid Return Shipping Label Generated', detail: 'UPS prepaid barcode emailed to customer.', timestamp: 'Sep 30, 04:05 PM', completed: true },
        { step: 'Returned Package In Transit to Hub', detail: 'In transit through UPS carrier network.', timestamp: 'Today, 08:30 AM', completed: true },
        { step: 'Inspection & Quality Check', detail: 'Awaiting physical arrival at warehouse.', timestamp: 'Scheduled Today', completed: false },
        { step: 'Refund Credited to Mastercard', detail: '$49.00 will be credited within 24-48 business hours.', timestamp: 'Estimated Oct 02', completed: false }
      ]
    }
  ]);

  const handleInitiateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const newRefund: RefundRecord = {
      refundId: `REF-${Math.floor(Math.random() * 8999 + 1000)}`,
      rmaNumber: `RMA-${Math.floor(Math.random() * 8999 + 1000)}-RET`,
      orderNumber: 'ORD-2026-9842',
      productName: returnProduct,
      refundAmount: 249.00,
      currency: 'USD',
      refundStatus: 'In Progress (Card Clearing)',
      customerName: customer ? `${customer.firstName} ${customer.surname}` : 'Alex Mercer',
      customerEmail: customer?.email || 'alex.mercer@example.com',
      destinationCard: 'Apple Pay (Mastercard •••• 4242)',
      initiatedDate: 'Just now',
      completedDate: 'Expected in 3 Business Days',
      returnCarrier: 'FedEx Ground Return',
      returnTrackingNumber: `FX-RET-${Math.floor(Math.random() * 8999999 + 1000000)}`,
      timeline: [
        { step: 'Return Authorization (RMA) Approved', detail: `Reason: ${returnReason}. 100% full refund approved under 30-Day Trial.`, timestamp: 'Just now', completed: true },
        { step: 'Prepaid Return Shipping Label Generated', detail: 'Prepaid return label and QR drop-off code generated.', timestamp: 'Just now', completed: true },
        { step: 'Drop-off at Carrier Station', detail: 'Drop package at any FedEx / UPS retail location.', timestamp: 'Pending Drop-off', completed: false },
        { step: 'Inspection & Refund Release', detail: '$249.00 will credit back to your original payment card.', timestamp: 'Estimated in 2-3 Days', completed: false }
      ]
    };

    setRefunds([newRefund, ...refunds]);
    setInitiateSuccess(true);
    setTimeout(() => {
      setIsInitiateModalOpen(false);
      setInitiateSuccess(false);
      setActiveSubTab('refunds');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Header with Minimalist Glow Effect */}
      <div className="relative rounded-3xl p-8 sm:p-10 bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-blue-500/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] transition-all duration-500">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-700" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              <span>Financial Ledger & Customer Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Payment History, Invoices & Refund Tracking
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              View settled transactions, download itemized tax invoices, and track returned product refunds backed by our 30-Day Risk-Free Trial guarantee.
            </p>

            {/* Sub-Tab Navigation */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setActiveSubTab('payments')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeSubTab === 'payments'
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>💳</span>
                <span>Payment History & Invoices</span>
              </button>
              <button
                onClick={() => setActiveSubTab('refunds')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeSubTab === 'refunds'
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>🔄</span>
                <span>Returned Products & Refunds</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Card with Glowing Accents */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shrink-0 max-w-xs space-y-3 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-400">Total Settled:</span>
              <span className="font-extrabold text-emerald-400 font-mono text-sm">$249.00</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-400">Total Refunded:</span>
              <span className="font-extrabold text-indigo-400 font-mono text-sm">$99.00</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Protection:</span>
              <span className="font-semibold text-amber-300 text-xs">30-Day Full Guarantee</span>
            </div>
            <button
              onClick={() => setIsInitiateModalOpen(true)}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition duration-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-[1.02]"
            >
              Initiate a Return / Refund →
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: PAYMENT HISTORY & INVOICES */}
      {/* ========================================================================= */}
      {activeSubTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Settled Transactions & Tax Invoices</h2>
            <span className="text-xs text-slate-500">{payments.length} Verified Records</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {payments.map((p) => (
              <div
                key={p.transactionId}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {p.transactionId}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      p.status === 'Paid / Settled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                      p.status === 'Refunded' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      ● {p.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Order #{p.orderNumber}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {p.productName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{p.date}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{p.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-slate-400 block">Total Paid</span>
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      ${p.amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoice(p)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-blue-600 text-white transition-all shadow-sm flex items-center gap-1.5 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                    >
                      <span>📄</span>
                      <span>View Invoice</span>
                    </button>
                    {p.status === 'Refunded' && (
                      <button
                        onClick={() => setActiveSubTab('refunds')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                      >
                        Refund Track →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: RETURNED PRODUCTS & REFUND POLICY */}
      {/* ========================================================================= */}
      {activeSubTab === 'refunds' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Refund Policy Banner Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <h3 className="text-lg font-bold text-white">Official 30-Day Return & Refund Policy</h3>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                100% Full Refund Guarantee
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-1">
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
                <strong className="text-white block text-sm">30-Day Home Trial</strong>
                <p className="text-slate-300">Test devices freely. Full refunds on unopened or gently tested products.</p>
              </div>
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
                <strong className="text-white block text-sm">Free Prepaid Labels</strong>
                <p className="text-slate-300">Domestic return labels with prepaid FedEx/UPS tracking are provided instantly.</p>
              </div>
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
                <strong className="text-white block text-sm">Zero Restocking Fees</strong>
                <p className="text-slate-300">Never any hidden restocking or return handling deductions.</p>
              </div>
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
                <strong className="text-white block text-sm">Fast 3-Day Clearing</strong>
                <p className="text-slate-300">Credits post back to your original payment method in 3–5 business days.</p>
              </div>
            </div>
          </div>

          {/* Live Refund Milestones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Live Returned Product Refund Milestones</h3>
              <button
                onClick={() => setIsInitiateModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow"
              >
                + Request New Return
              </button>
            </div>

            {refunds.map((ref) => (
              <div
                key={ref.refundId}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 hover:shadow-xl transition-all duration-300"
              >
                {/* Refund Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {ref.refundId}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        ref.refundStatus.includes('Completed')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        ● {ref.refundStatus}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">RMA: {ref.rmaNumber}</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mt-2">{ref.productName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Carrier: <strong className="text-slate-800">{ref.returnCarrier}</strong> ({ref.returnTrackingNumber}) • Destination: <span className="font-semibold text-slate-700">{ref.destinationCard}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Refund Amount</span>
                    <span className="text-xl font-extrabold text-emerald-600 font-mono">
                      +${ref.refundAmount.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{ref.completedDate}</span>
                  </div>
                </div>

                {/* Refund Progress Timeline */}
                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {ref.timeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                        item.completed
                          ? 'bg-emerald-500 border-white ring-4 ring-emerald-100'
                          : 'bg-white border-slate-300'
                      }`} />
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <div>
                          <span className={`font-bold block ${item.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                            {item.step}
                          </span>
                          <span className="text-slate-500">{item.detail}</span>
                        </div>
                        <span className={`font-mono text-xs px-2.5 py-1 rounded-lg shrink-0 ${
                          item.completed ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
                        }`}>
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Action for this Refund */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Need priority bank escalation for this refund?</span>
                  <button
                    onClick={() => onTextServiceManager(`Urgent inquiry on refund ${ref.refundId} (RMA: ${ref.rmaNumber})`)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5"
                  >
                    <span>💬</span>
                    <span>Text Marcus Vance for Refund Acceleration</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* INVOICE MODAL */}
      {/* ========================================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-900 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Invoice Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center text-lg">
                  A
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">AuraTech Official Tax Invoice</h3>
                  <p className="text-xs text-slate-500">Tax Registration: VAT-AU-992144 • Customer Experience Ledger</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Billed To & Invoice Meta */}
            <div className="grid grid-cols-2 gap-4 py-6 text-xs border-b border-slate-100">
              <div>
                <span className="text-slate-400 uppercase font-bold tracking-wider block mb-1">Billed To</span>
                <strong className="text-slate-900 text-sm block">{selectedInvoice.customerName}</strong>
                <span className="text-slate-600 block">{selectedInvoice.customerEmail}</span>
                <span className="text-slate-600 block">{selectedInvoice.customerPhone}</span>
                <span className="text-slate-500 block mt-1">{selectedInvoice.billingAddress}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 uppercase font-bold tracking-wider block mb-1">Invoice Details</span>
                <span className="text-slate-900 font-mono font-bold block">{selectedInvoice.invoice.invoiceNumber}</span>
                <span className="text-slate-500 block">Date: {selectedInvoice.invoice.invoiceDate}</span>
                <span className="text-slate-500 block">Auth Code: <span className="font-mono">{selectedInvoice.invoice.authCode}</span></span>
                <span className="inline-block mt-2 font-bold px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                  {selectedInvoice.status}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-left">
                    <th className="pb-2 font-bold uppercase">Item & Description</th>
                    <th className="pb-2 font-bold uppercase text-center">Qty</th>
                    <th className="pb-2 font-bold uppercase text-right">Price</th>
                    <th className="pb-2 font-bold uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.invoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-semibold text-slate-900">
                        {it.description}
                        <span className="block text-[10px] text-slate-400 font-mono">{it.sku}</span>
                      </td>
                      <td className="py-3 text-center">{it.qty}</td>
                      <td className="py-3 text-right font-mono">${it.unitPrice.toFixed(2)}</td>
                      <td className="py-3 text-right font-mono font-bold">${it.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Calculation */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">${selectedInvoice.invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sales Tax:</span>
                <span className="font-mono">${selectedInvoice.invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping ({selectedInvoice.invoice.shippingDiscount}):</span>
                <span className="font-mono text-emerald-600">$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-blue-600">${selectedInvoice.invoice.total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Invoice Footer Actions */}
            <div className="pt-6 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Digitally authenticated by AuraTech Global Payments.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Printing official tax invoice #${selectedInvoice.invoice.invoiceNumber}...`)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow"
                >
                  🖨️ Print / Download PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INITIATE RETURN MODAL */}
      {/* ========================================================================= */}
      {isInitiateModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-slate-900 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Initiate 30-Day Return & Refund</h3>
              <button onClick={() => setIsInitiateModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {initiateSuccess ? (
              <div className="py-8 text-center space-y-3 animate-fadeIn">
                <span className="text-4xl">🎉</span>
                <h4 className="text-lg font-bold text-emerald-600">Return Authorization Approved!</h4>
                <p className="text-xs text-slate-500">
                  Your prepaid FedEx Ground label and RMA number have been generated. Switching to Live Refund Tracker...
                </p>
              </div>
            ) : (
              <form onSubmit={handleInitiateReturn} className="space-y-4 pt-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Order / Product</label>
                  <select
                    value={returnProduct}
                    onChange={(e) => setReturnProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Aura Studio ANC Headphones">Aura Studio ANC Headphones ($249.00 - ORD-2026-9842)</option>
                    <option value="Aura Pulse Smartwatch">Aura Pulse Smartwatch ($199.00 - Active Warranty)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Return</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Found incompatible with older equipment">Found incompatible with older equipment</option>
                    <option value="Preferred alternative color / model">Preferred alternative color / model</option>
                    <option value="Comfort / Fit during 30-day home trial">Comfort / Fit during 30-day home trial</option>
                    <option value="Exchange for warranty upgrade">Exchange for warranty upgrade</option>
                  </select>
                </div>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-blue-800 text-[11px] leading-relaxed">
                  ✓ 100% full refund guarantee ($249.00).<br />
                  ✓ Free prepaid FedEx return label emailed instantly.<br />
                  ✓ Zero restocking fees.
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow"
                >
                  Confirm Return & Generate Prepaid Label
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
