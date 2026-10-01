# AuraTech PulseCX • Customer Service, Experience & Product Tracker

> Comprehensive enterprise Customer Experience (CX) portal featuring **Customer Authentication & Registration** (capturing Name, Surname, Phone Number, and Email ID), a **Dedicated Service Manager Direct Desk** for 2-way texting with Senior CX Lead Marcus Vance, and a **Live Product & Shipment Tracker** with synchronized carrier milestones.

---

## 🌟 Core Functional Architecture

### 1. Customer Authentication & Registration Platform
- **Comprehensive Customer Registration**:
  - Captures: **First Name**, **Surname**, **Phone Number**, and **Email ID** (+ secure passcode).
  - Displays customer identity across the portal with personalized membership care tiers (e.g. `Gold Care Member`).
  - Synced via `POST /api/register` and `POST /api/login` backend endpoints.
  - Automatically provisions product protection and links the customer's smart devices.

### 2. Dedicated Service Manager Direct Desk (`/api/manager/messages`)
- A **distinct 2-way texting platform** separate from automated chat:
  - Connects customers directly with **Marcus Vance** (Senior Customer Service & Technical Experience Manager).
  - Direct Contact: Phone `+1 (800) 555-AURA ext 401` • Email `marcus.vance@auratech.example.com`.
  - Case metadata & Ticket reference generation (`#TICK-8842` / custom ticket IDs).
  - Priority Level Selector: `Normal`, `High Priority`, `Critical / Executive Escalation`.
  - **Instant Phone Callback Request Button**: Registers the customer's phone number for immediate outgoing manager dial.
  - Pre-filled issue presets: Transit Delay, Hardware Diagnostics, Return Authorization, Urgent Phone Call.

### 3. Exclusively Customer Service & Product Tracking (No Buy/Sell)
- In adherence to strict customer service focus, **all e-commerce buy-and-sell features, carts, and checkout simulators have been removed**.
- Replaced by the **Live Product & Shipment Tracker**:
  - Search by Aura Tracking ID (`AT-9842`, `AT-1024`, `AT-5521`), Carrier Number (`FX-884102941`, `1Z9999999999999999`), or Order # (`ORD-2026-9842`).
  - Step-by-step carrier milestones (FedEx Express & UPS Worldwide) from fulfillment to doorstep delivery.
  - Customer's registered devices list with serial numbers, warranty terms, battery health telemetry, and one-click diagnostic escalation.
  - "Text Marcus Vance About This Shipment" direct action buttons.

### 4. Nova AI Concierge (Tier 1 AI Assistant)
- Empathetic first-line support for instant FAQ answers, package tracking queries, and warranty terms.
- Automated human handoff: seamlessly offers a direct link/switch to the Service Manager Desk whenever escalations, damage claims, or human management are requested.

### 5. Actionable CX Insights Engine (Tier 4 Telemetry)
- Real-time telemetry sink capturing customer sentiment, intent classification, friction points, and actionable business insights.
- Live telemetry dashboard with sentiment filtering and JSON inspection.

---

## 🚀 Running the Platform

### Local Server Launch
Run the backend server using Python:

```powershell
python server.py
```

The portal is accessible at **[http://localhost:8080](http://localhost:8080)**.

### Available Endpoints
- `POST /api/register`: Registers First Name, Surname, Phone Number, and Email ID.
- `POST /api/login`: Authenticates existing customers.
- `GET  /api/customer`: Retrieves customer profile and registered devices.
- `GET  /api/manager/messages`: Retrieves Service Manager direct text thread.
- `POST /api/manager/messages`: Dispatches customer text to Marcus Vance and generates manager responses.
- `GET  /api/tracker?q=<ID>`: Queries live product tracking by order, tracking ID, or serial number.
- `POST /api/chat`: Interacts with Nova AI Concierge with automated Service Manager handoff.
- `GET  /api/telemetry`: Real-time CX telemetry stream.

---

## 📁 Repository Structure

```
PulseCX/
├── index.html                   # Single-page customer experience application (React 18 + Tailwind)
├── server.py                    # Python orchestration & API server on port 8080
├── README.md                    # Platform documentation
└── src/                         # Modular React components & TypeScript types
    ├── types/
    │   └── index.ts             # CustomerProfile, CustomerDevice, TrackedShipment, ServiceManagerMessage
    ├── components/
    │   ├── CustomerAuthModal.tsx# Customer registration modal (Name, Surname, Phone, Email)
    │   ├── ServiceManagerDesk.tsx# 2-way direct texting platform with Marcus Vance
    │   ├── ProductTracker.tsx   # Live shipment & registered device tracker
    │   ├── ChatWidget.tsx       # Nova AI concierge widget
    │   └── CXInsightsEngine.tsx # Actionable CX telemetry dashboard
    └── prompts/
        ├── novaSystemPrompt.ts  # Nova AI system prompt & boundaries
        └── authOrchestratorPrompt.ts # Auth & session orchestrator specifications
```
