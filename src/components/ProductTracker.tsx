import React, { useState } from 'react';
import { CustomerProfile, TrackedShipment } from '../types';

interface ProductTrackerProps {
  customer: CustomerProfile | null;
  onTextServiceManager: (trackingId?: string) => void;
  onOpenAuth: () => void;
}

export const ProductTracker: React.FC<ProductTrackerProps> = ({
  customer,
  onTextServiceManager,
  onOpenAuth
}) => {
  const [searchQuery, setSearchQuery] = useState('AT-9842');
  const [activeTab, setActiveTab] = useState<'shipments' | 'my-devices'>('shipments');

  const shipmentsData: TrackedShipment[] = [
    {
      trackingId: 'AT-9842',
      orderNumber: 'ORD-2026-9842',
      productName: 'Aura Studio ANC Headphones (Matte Black)',
      carrier: 'FedEx Express',
      carrierTrackingNumber: 'FX-884102941',
      status: 'Out for Delivery',
      destinationCity: 'Austin, TX',
      destinationAddress: '742 Evergreen Terrace, Austin TX 78701',
      estimatedDelivery: 'Today by 4:30 PM EST',
      customerName: 'Alex Mercer',
      customerEmail: 'alex.mercer@example.com',
      customerPhone: '+1 (555) 234-8901',
      timeline: [
        { status: 'Fulfillment & Quality Inspection Complete', location: 'AuraTech Logistics Center, Dallas TX', timestamp: 'Sep 29, 10:14 AM', completed: true },
        { status: 'Departed Regional Sorting Facility', location: 'FedEx Hub, Dallas TX', timestamp: 'Sep 29, 06:45 PM', completed: true },
        { status: 'Arrived at Local Destination Terminal', location: 'Austin Central Facility, Austin TX', timestamp: 'Sep 30, 08:30 AM', completed: true },
        { status: 'Out for Delivery with Courier Vehicle', location: 'Austin Local Courier Route', timestamp: 'Today, 07:15 AM', completed: true },
        { status: 'Delivered to Customer Doorstep', location: '742 Evergreen Terrace, Austin TX', timestamp: 'Estimated Today by 4:30 PM', completed: false }
      ]
    },
    {
      trackingId: 'AT-1024',
      orderNumber: 'ORD-2026-1024',
      productName: 'Aura Pulse Smartwatch Replacement Band (Titanium Gray)',
      carrier: 'UPS Worldwide',
      carrierTrackingNumber: '1Z9999999999999999',
      status: 'In Transit',
      destinationCity: 'Seattle, WA',
      destinationAddress: '1200 4th Ave, Seattle WA 98101',
      estimatedDelivery: 'Oct 03 by End of Day',
      customerName: 'Jordan Reed',
      customerEmail: 'jordan.reed@example.com',
      customerPhone: '+1 (555) 876-5432',
      timeline: [
        { status: 'Package Processed', location: 'AuraTech West Coast Hub, Reno NV', timestamp: 'Sep 30, 04:20 PM', completed: true },
        { status: 'In Transit through Carrier Network', location: 'UPS Hub, Portland OR', timestamp: 'Oct 01, 06:00 AM', completed: true },
        { status: 'Out for Delivery', location: 'Seattle Distribution Facility', timestamp: 'Scheduled Oct 03', completed: false }
      ]
    },
    {
      trackingId: 'AT-5521',
      orderNumber: 'ORD-2026-5521',
      productName: 'Aura Hub Pro - Smart Home Matter Controller',
      carrier: 'FedEx Express',
      carrierTrackingNumber: 'FX-339102488',
      status: 'Delivered',
      destinationCity: 'Denver, CO',
      destinationAddress: '900 16th St, Denver CO 80202',
      estimatedDelivery: 'Delivered Sep 28 at 2:15 PM (Signed by Customer)',
      customerName: 'Elena Vance',
      customerEmail: 'elena.vance@example.com',
      customerPhone: '+1 (555) 345-6789',
      timeline: [
        { status: 'Order Dispatched', location: 'AuraTech Denver Station, Denver CO', timestamp: 'Sep 26, 09:00 AM', completed: true },
        { status: 'Delivered & Inspected', location: 'Front Doorstep, Denver CO', timestamp: 'Sep 28, 02:15 PM', completed: true }
      ]
    }
  ];

  const cleanQuery = searchQuery.trim().toUpperCase().replace('#', '');
  const activeShipment = shipmentsData.find((s) =>
    s.trackingId.toUpperCase() === cleanQuery ||
    s.carrierTrackingNumber.toUpperCase() === cleanQuery ||
    s.orderNumber.toUpperCase() === cleanQuery
  ) || shipmentsData[0];

  return (
    <div className="max-w-5xl mx-auto my-8 space-y-6">
      {/* Tracker Search Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Omnichannel Customer Experience & Product Tracker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Live Product & Shipment Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Synchronized real-time tracking, courier milestones, warranty verification, and direct service escalation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('shipments')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'shipments' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              📦 Track Shipments
            </button>
            <button
              onClick={() => setActiveTab('my-devices')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'my-devices' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🛡️ Registered Devices & Warranty
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {activeTab === 'shipments' && (
          <div className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Tracking ID (e.g. AT-9842, AT-1024, AT-5521) or Carrier Number"
                  className="w-full bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <button
                onClick={() => {}}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl transition shadow-lg shadow-blue-600/30"
              >
                Find Shipment
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Quick Samples:</span>
              <button onClick={() => setSearchQuery('AT-9842')} className="underline hover:text-white font-mono">
                #AT-9842 (Out for Delivery)
              </button>
              <span>•</span>
              <button onClick={() => setSearchQuery('AT-1024')} className="underline hover:text-white font-mono">
                #AT-1024 (In Transit)
              </button>
              <span>•</span>
              <button onClick={() => setSearchQuery('AT-5521')} className="underline hover:text-white font-mono">
                #AT-5521 (Delivered)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shipments View */}
      {activeTab === 'shipments' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-blue-50/70 rounded-2xl border border-blue-100">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1.5 ${
                activeShipment.status === 'Out for Delivery' ? 'bg-amber-100 text-amber-800' :
                activeShipment.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                ● {activeShipment.status}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {activeShipment.productName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tracking ID: <strong className="font-mono text-slate-800">{activeShipment.trackingId}</strong> • Carrier: {activeShipment.carrier} ({activeShipment.carrierTrackingNumber})
              </p>
            </div>

            <div className="sm:text-right bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Estimated Delivery</span>
              <span className="text-base font-bold text-emerald-600 block mt-0.5">
                {activeShipment.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Delivery Address & Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Destination Address</span>
              <div className="font-bold text-slate-800">{activeShipment.destinationAddress}</div>
              <div className="text-slate-500">Recipient: {activeShipment.customerName}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Customer Contact Registered</span>
              <div className="font-medium text-slate-800">Phone: {activeShipment.customerPhone}</div>
              <div className="text-slate-500">Email: {activeShipment.customerEmail}</div>
            </div>
          </div>

          {/* Milestones Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Fulfillment & Carrier Journey
            </h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {activeShipment.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                      step.completed
                        ? 'bg-blue-600 border-white ring-4 ring-blue-100'
                        : 'bg-white border-slate-300'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className={`font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.status}
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">{step.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{step.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Service Escalation Controls */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Notice any delivery delay, incorrect address, or package damage?
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTextServiceManager(activeShipment.trackingId)}
                className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <span>💬</span>
                <span>Text Service Manager About Shipment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registered Devices & Warranty View */}
      {activeTab === 'my-devices' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Registered AuraTech Devices</h3>
              <p className="text-xs text-slate-500">Hardware health status, warranty terms, and service protection.</p>
            </div>
            {!customer && (
              <button
                onClick={onOpenAuth}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
              >
                Register / Sign In to See My Devices
              </button>
            )}
          </div>

          {customer && customer.registeredDevices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.registeredDevices.map((device, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-600">{device.category}</span>
                      <h4 className="text-base font-bold text-slate-900">{device.modelName}</h4>
                      <p className="text-xs font-mono text-slate-500">SN: {device.serialNumber}</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      {device.warrantyStatus}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 border-t border-slate-200/60 pt-2">
                    <div><strong>Warranty:</strong> {device.warrantyExpires}</div>
                    <div><strong>Diagnostic Health:</strong> {device.healthStatus}</div>
                    <div><strong>Last Device Sync:</strong> {device.lastSync}</div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onTextServiceManager(device.serialNumber)}
                      className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <span>🛠️ Request Warranty Service / Replacement</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <div className="text-3xl">🛡️</div>
              <div className="font-bold text-slate-700 text-sm">No devices registered under this session yet</div>
              <p className="text-xs max-w-sm mx-auto">
                Register with your name, surname, phone number, and email ID to link your devices for automatic 2-year warranty coverage.
              </p>
              <button
                onClick={onOpenAuth}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
              >
                Register Details Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ProductTracker;
