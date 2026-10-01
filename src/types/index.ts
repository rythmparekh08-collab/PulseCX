export interface CustomerProfile {
  id: string;
  firstName: string;
  surname: string;
  phone: string;
  email: string;
  membershipTier: 'Standard' | 'Silver' | 'Gold' | 'VIP';
  registeredAt: string;
  registeredDevices: CustomerDevice[];
}

export interface CustomerDevice {
  serialNumber: string;
  modelName: string;
  category: 'Wearables' | 'Audio' | 'Smart Home';
  purchaseDate: string;
  warrantyStatus: 'Active' | 'Extended' | 'Expired';
  warrantyExpires: string;
  healthStatus: 'Optimal' | 'Firmware Update Available' | 'Diagnostic Needed';
  lastSync: string;
}

export interface TrackedShipment {
  trackingId: string;
  orderNumber: string;
  productName: string;
  carrier: 'FedEx Express' | 'UPS Worldwide' | 'DHL SmartMail';
  carrierTrackingNumber: string;
  status: 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Fulfillment Pending' | 'Exception';
  destinationCity: string;
  destinationAddress: string;
  estimatedDelivery: string;
  timeline: {
    status: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface ServiceManagerMessage {
  id: string;
  sender: 'customer' | 'manager';
  managerName?: string;
  managerTitle?: string;
  text: string;
  timestamp: string;
  priority: 'Normal' | 'High' | 'Critical / Escalation';
  ticketRef?: string;
  status?: 'Sent' | 'Delivered' | 'Read' | 'Resolved';
}

export interface InvoiceItem {
  sku: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  shipping: number;
  shippingDiscount: string;
  total: number;
  authCode: string;
  items: InvoiceItem[];
}

export interface PaymentRecord {
  transactionId: string;
  orderNumber: string;
  productName: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: string;
  status: 'Paid / Settled' | 'Refunded' | 'Refund Processing' | 'In Review';
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  billingAddress: string;
  refundRef?: string;
  invoice: InvoiceData;
}

export interface RefundStep {
  step: string;
  detail: string;
  timestamp: string;
  completed: boolean;
}

export interface RefundRecord {
  refundId: string;
  rmaNumber: string;
  orderNumber: string;
  productName: string;
  refundAmount: number;
  currency: string;
  refundStatus: 'Completed / Credited' | 'In Progress (Card Clearing)' | 'Inspection Pending';
  customerName: string;
  customerEmail: string;
  destinationCard: string;
  initiatedDate: string;
  completedDate: string;
  returnCarrier: string;
  returnTrackingNumber: string;
  timeline: RefundStep[];
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; payload?: string }[];
  escalationNotice?: boolean;
  authRequired?: boolean;
}
