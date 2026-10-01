import { Product } from '../types';

export const AURA_PRODUCTS: Product[] = [
  {
    id: 'aura-pulse',
    name: 'Aura Pulse Smartwatch',
    price: 199,
    tagline: 'Precision biometric tracking & unprecedented 14-day battery.',
    description: 'Designed for high performers and wellness enthusiasts. Features continuous ECG, SpO2 monitoring, clinical sleep stage analytics, and an always-on sapphire AMOLED display.',
    category: 'Wearables',
    features: [
      '14-day typical battery life (6 days heavy GPS)',
      'Medical-grade ECG & heart rate variability sensor',
      'Advanced sleep apnea and circadian cycle analytics',
      'Water resistant to 50 meters (5 ATM) with Titanium bezel'
    ],
    battery: '14-day battery life',
    specs: {
      'Display': '1.43" AMOLED Sapphire (466x466)',
      'Battery': '480mAh Li-Po (14 Days Typical)',
      'Water Resistance': '5 ATM / 50m ISO 22810',
      'Sensors': 'Optical PPG ECG, Accel, Barometer, Temp',
      'Connectivity': 'Bluetooth 5.3 Low Energy, NFC'
    },
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    rating: 4.9,
    reviewsCount: 1420,
    badge: 'Best Seller'
  },
  {
    id: 'aura-studio-anc',
    name: 'Aura Studio ANC Headphones',
    price: 249,
    tagline: 'Immersive spatial audio with hybrid active noise cancellation.',
    description: 'Masterfully tuned 40mm bio-cellulose dynamic drivers deliver pristine acoustic reproduction. Hybrid dual-feed ANC cancels up to 42dB of ambient noise with 40-hour continuous playtime.',
    category: 'Audio',
    features: [
      'Hybrid Active Noise Cancellation (-42dB attenuation)',
      '40-hour battery life (ANC ON), 60h with ANC off',
      'Ultra-low latency Bluetooth 5.3 & backward compatible (BT 4.2+)',
      'Memory foam vegan leather earcups & aluminum pivot hinges'
    ],
    battery: '40h playtime with ANC',
    specs: {
      'Drivers': '40mm Custom Bio-Cellulose Dynamic',
      'Battery Life': '40h (ANC ON) / 60h (ANC OFF)',
      'Fast Charge': '10 min charge = 5 hours playback',
      'Microphones': '6 MEMS mics with beamforming wind-filter',
      'Compatibility': 'Universal BT 4.2, 5.0, 5.2, 5.3, 3.5mm Aux'
    },
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    rating: 4.8,
    reviewsCount: 980,
    badge: 'Audiophile Choice'
  },
  {
    id: 'aura-hub-pro',
    name: 'Aura Hub Pro',
    price: 99,
    tagline: 'Unified smart home orchestration with Matter & Zigbee 3.0.',
    description: 'The central nervous system for your connected sanctuary. Bridges Matter, Zigbee, Thread, and Wi-Fi devices with local on-device automation that functions even without internet.',
    category: 'Smart Home',
    features: [
      'Native Matter 1.2 & Zigbee 3.0 controller + Thread border router',
      'Local offline processing: zero cloud latency & private data',
      'Dual-band Wi-Fi 6 + Gigabit Ethernet PoE support',
      'Pairs seamlessly with Aura Pulse for health-triggered routines'
    ],
    battery: 'Mains Powered (USB-C 15W)',
    specs: {
      'Protocols': 'Matter, Thread, Zigbee 3.0, BLE 5.2, Wi-Fi 6',
      'Processor': 'Quad-core ARM Cortex-A53 1.8GHz, 2GB RAM',
      'Range': 'Up to 3,000 sq ft smart mesh coverage',
      'Local Storage': '32GB eMMC for event logs & telemetry'
    },
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    rating: 4.7,
    reviewsCount: 640,
    badge: 'Smart Living'
  }
];

export const ORDER_DATABASE = [
  {
    orderId: 'AT-9842',
    status: 'Out for Delivery',
    carrier: 'FedEx Express',
    trackingNumber: 'FX-884102941',
    estimatedDelivery: 'Today by 4:30 PM EST',
    items: ['Aura Studio ANC Headphones (Matte Black)'],
    destination: 'Austin, TX',
    timeline: [
      { step: 'Order Placed', time: 'Sep 29, 10:14 AM', completed: true },
      { step: 'Fulfilled & Packaged', time: 'Sep 29, 2:30 PM', completed: true },
      { step: 'In Transit', time: 'Sep 30, 8:45 AM', completed: true },
      { step: 'Out for Delivery', time: 'Oct 01, 7:15 AM', completed: true },
      { step: 'Delivered', time: 'Estimated 4:30 PM', completed: false }
    ]
  },
  {
    orderId: 'AT-1024',
    status: 'In Transit',
    carrier: 'UPS Ground',
    trackingNumber: '1Z9999999999999999',
    estimatedDelivery: 'Oct 03 by End of Day',
    items: ['Aura Pulse Smartwatch (Titanium Gray)'],
    destination: 'Seattle, WA',
    timeline: [
      { step: 'Order Placed', time: 'Sep 30, 4:20 PM', completed: true },
      { step: 'In Transit', time: 'Oct 01, 6:00 AM', completed: true },
      { step: 'Delivered', time: 'Pending', completed: false }
    ]
  }
];
