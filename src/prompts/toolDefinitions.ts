/**
 * Tool Calling & Function Calling Definitions for AuraTech AI Engines
 * Compatible with OpenAI Function Calling, Gemini Function Declarations, and LangChain/LlamaIndex tools.
 */

export const AI_TOOL_DEFINITIONS = [
  {
    name: "query_product_catalog",
    description: "Executes a hybrid semantic vector search and attribute filter on AuraTech's catalog (Pinecone/Qdrant + BM25) to find compatible smart electronics matching user requirements.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Natural language query describing product needs (e.g. 'ANC headphones for long flights' or 'smartwatch with 14-day battery and ECG')."
        },
        category: {
          type: "string",
          enum: ["Wearables", "Audio", "Smart Home", "Accessories", "All"],
          description: "Optional category filter."
        },
        max_price: {
          type: "number",
          description: "Maximum budget filter in USD."
        },
        required_features: {
          type: "array",
          items: { type: "string" },
          description: "Specific hardware features required (e.g., ['ECG', 'Matter 1.2', 'Bluetooth 4.2 backward compatibility', 'ANC'])."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "check_inventory_and_delivery",
    description: "Queries real-time warehouse inventory, regional fulfillment centers, and carrier dispatch cutoffs for specified product SKUs.",
    parameters: {
      type: "object",
      properties: {
        sku: {
          type: "string",
          description: "Product SKU identifier (e.g. 'sku_401' for Aura Studio ANC, 'sku_101' for Aura Pulse Smartwatch)."
        },
        destination_zip: {
          type: "string",
          description: "5-digit US ZIP code to calculate shipping speed and delivery estimate."
        },
        shipping_tier: {
          type: "string",
          enum: ["standard", "express_2day", "international"],
          description: "Delivery option requested."
        }
      },
      required: ["sku"]
    }
  },
  {
    name: "get_user_order_history",
    description: "SECURITY PRIVILEGE GATED: Retrieves recent orders, live carrier tracking numbers, and eligible return windows for the authenticated user. Never invoke for guest sessions.",
    parameters: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The authenticated user identifier (e.g. 'usr_981273')."
        },
        order_id: {
          type: "string",
          description: "Optional specific order ID (e.g. 'AT-9842'). If omitted, returns last 5 orders."
        }
      },
      required: ["user_id"]
    }
  },
  {
    name: "apply_member_benefit",
    description: "Evaluates the user's membership tier (Guest, Silver, Gold, Platinum VIP) to unlock exclusive discounts, waived express shipping fees, or extended 45-day return windows.",
    parameters: {
      type: "object",
      properties: {
        membership_tier: {
          type: "string",
          enum: ["Guest", "Silver", "Gold", "Platinum_VIP"],
          description: "User's verified tier."
        },
        cart_total: {
          type: "number",
          description: "Current subtotal before member adjustments."
        },
        benefit_type: {
          type: "string",
          enum: ["free_express_shipping", "tier_discount", "extended_return_window", "all"],
          description: "The benefit requested for application."
        }
      },
      required: ["membership_tier", "cart_total"]
    }
  },
  {
    name: "dispatch_omnichannel_message",
    description: "Generates and queues personalized omnichannel customer communication (Abandoned Cart Email, Re-engagement SMS, or In-App Chat notification) with tailored rationale and crisp CTA.",
    parameters: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          enum: ["in_app_chat", "email", "sms"],
          description: "Delivery channel for the communication."
        },
        event_trigger: {
          type: "string",
          enum: ["cart_abandonment_trigger", "price_drop_alert", "post_browse_followup", "vip_welcome"],
          description: "The marketing/lifecycle automation trigger event."
        },
        recipient_user_id: {
          type: "string",
          description: "Target user ID (e.g. 'usr_981273')."
        },
        targeted_products: {
          type: "array",
          items: { type: "string" },
          description: "List of product names or SKUs to highlight."
        },
        custom_incentive: {
          type: "string",
          description: "Special perk to highlight (e.g. 'Complimentary 2-Day Express Shipping for Gold Member' or '30-Day Risk-Free Trial')."
        }
      },
      required: ["channel", "event_trigger", "recipient_user_id", "targeted_products"]
    }
  }
];
