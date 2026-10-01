"""
AuraTech PulseCX - Customer Experience & Service Platform
Backend Orchestration, Customer Authentication, Service Manager Direct Desk & Product Tracker
"""

import http.server
import socketserver
import functools
import json
import urllib.parse
import os
import sys
from datetime import datetime

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

NOVA_SYSTEM_PROMPT = """### Role & Identity
You are Nova, an expert, empathetic, and professional Customer Experience Assistant for AuraTech.
Your primary mission is to help customers track their products, resolve service tickets, provide warranty guidance, troubleshoot smart devices, and seamlessly connect customers to their dedicated Service Manager when personal human intervention is required.

### Tone & Style
- Warm, polite, concise, and professional.
- Empathy First: Always acknowledge customer sentiment, frustration, or concern before delivering solutions.
- Format & Brevity: Keep answers concise (under 3 sentences when possible), use bullet points, clear CTAs with Markdown links.

### Operational Rules & Boundaries
1. Scope Limitation: Product tracking, device diagnostics, setup support, warranty validation, return authorization, and escalation to Service Managers.
2. Escalation Protocol: When an issue involves damage, complex billing disputes, or customer requests direct management review, seamlessly invite them to message the Service Manager directly or escalate using:
   "I want to make sure this is handled with executive care. I have flagged this for your Service Manager, Marcus Vance. You can also text him directly in our Service Manager Desk."
"""

# In-memory Storage
TELEMETRY_STORE = []

# In-memory Customer Accounts Database
CUSTOMERS_DB = [
    {
        "id": "usr_981273",
        "firstName": "Alex",
        "surname": "Mercer",
        "phone": "+1 (555) 234-8901",
        "email": "alex.mercer@example.com",
        "password": "password123",
        "membershipTier": "Gold",
        "registeredAt": "2026-08-15T09:30:00Z",
        "registeredDevices": [
            {
                "serialNumber": "SN-PLS-8821",
                "modelName": "Aura Pulse Smartwatch",
                "category": "Wearables",
                "purchaseDate": "Aug 15, 2026",
                "warrantyStatus": "Active",
                "warrantyExpires": "Aug 15, 2028 (2-Year Protection)",
                "healthStatus": "Optimal (Battery Health: 99%)",
                "lastSync": "Today at 08:45 AM"
            },
            {
                "serialNumber": "SN-ANC-4412",
                "modelName": "Aura Studio ANC Headphones",
                "category": "Audio",
                "purchaseDate": "Sep 29, 2026",
                "warrantyStatus": "Active",
                "warrantyExpires": "Sep 29, 2027 (1-Year Standard)",
                "healthStatus": "In Transit / Delivery Today",
                "lastSync": "N/A"
            }
        ]
    },
    {
        "id": "usr_401928",
        "firstName": "Jordan",
        "surname": "Reed",
        "phone": "+1 (555) 876-5432",
        "email": "jordan.reed@example.com",
        "password": "password123",
        "membershipTier": "Silver",
        "registeredAt": "2026-09-01T14:15:00Z",
        "registeredDevices": [
            {
                "serialNumber": "SN-PLS-1092",
                "modelName": "Aura Pulse Smartwatch Replacement Band",
                "category": "Wearables",
                "purchaseDate": "Sep 30, 2026",
                "warrantyStatus": "Active",
                "warrantyExpires": "Sep 30, 2027 (1-Year Protection)",
                "healthStatus": "In Transit to Seattle Hub",
                "lastSync": "Yesterday"
            }
        ]
    },
    {
        "id": "usr_772109",
        "firstName": "Elena",
        "surname": "Vance",
        "phone": "+1 (555) 345-6789",
        "email": "elena.vance@example.com",
        "password": "password123",
        "membershipTier": "VIP Executive",
        "registeredAt": "2026-07-20T11:00:00Z",
        "registeredDevices": [
            {
                "serialNumber": "SN-HUB-5521",
                "modelName": "Aura Hub Pro - Smart Home Matter Controller",
                "category": "Smart Home",
                "purchaseDate": "Sep 26, 2026",
                "warrantyStatus": "Active",
                "warrantyExpires": "Sep 26, 2028 (2-Year Protection)",
                "healthStatus": "Optimal (Matter Fabric Active)",
                "lastSync": "10 minutes ago"
            }
        ]
    }
]

# Tracked Shipments Database
TRACKING_DB = [
    {
        "trackingId": "AT-9842",
        "orderNumber": "ORD-2026-9842",
        "productName": "Aura Studio ANC Headphones (Matte Black)",
        "carrier": "FedEx Express",
        "carrierTrackingNumber": "FX-884102941",
        "status": "Out for Delivery",
        "destinationCity": "Austin, TX",
        "destinationAddress": "742 Evergreen Terrace, Austin TX 78701",
        "estimatedDelivery": "Today by 4:30 PM EST",
        "customerName": "Alex Mercer",
        "customerEmail": "alex.mercer@example.com",
        "customerPhone": "+1 (555) 234-8901",
        "mapTelemetry": {
            "originName": "Dallas Logistics Hub, TX",
            "destinationName": "742 Evergreen Terrace, Austin, TX",
            "currentLocationName": "Austin Local Route #14 (3.8 Miles Away)",
            "speed": "38 MPH",
            "heading": "214° SW (Downtown Corridor)",
            "distanceRemaining": "3.8 Miles",
            "totalDistance": "195 Miles",
            "etaExact": "Today at 04:30 PM EST",
            "etaMinutes": 165,
            "vehicleModel": "FedEx E-Transit Courier #14",
            "driverName": "Carlos Martinez",
            "driverBadge": "FDX-8812",
            "trafficStatus": "Optimal Flow (Clear Highway & Arterials)",
            "weather": "74°F Clear & Sunny",
            "satellitesLocked": "14 GNSS Sats (±1.2m Accuracy)",
            "routeProgressPct": 78,
            "curCourierPoint": { "x": 670, "y": 280 },
            "waypoints": [
                { "id": 1, "name": "AuraTech Dallas Logistics Center", "type": "Origin", "x": 120, "y": 90, "time": "Sep 29, 10:14 AM", "passed": True, "note": "Quality Inspection & Barcode Scan Complete" },
                { "id": 2, "name": "FedEx Regional Hub (Dallas TX)", "type": "Regional Hub", "x": 280, "y": 145, "time": "Sep 29, 06:45 PM", "passed": True, "note": "Departed sorting terminal on Interstate 35 Freight" },
                { "id": 3, "name": "Austin Central Sorting Facility", "type": "Local Station", "x": 490, "y": 225, "time": "Sep 30, 08:30 AM", "passed": True, "note": "Arrived at destination station & transferred to delivery van" },
                { "id": 4, "name": "Austin Local Courier Route #14", "type": "Live Vehicle", "x": 670, "y": 280, "time": "Live GPS Ping", "passed": True, "isLive": True, "note": "Van active on route • Approaching delivery zone" },
                { "id": 5, "name": "742 Evergreen Terrace, Austin TX", "type": "Destination Doorstep", "x": 830, "y": 345, "time": "ETA Today 4:30 PM", "passed": False, "note": "Customer Doorstep • Contactless drop-off authorized" }
            ]
        },
        "timeline": [
            { "status": "Fulfillment Complete", "location": "AuraTech Logistics Center, Dallas TX", "timestamp": "Sep 29, 10:14 AM", "completed": True },
            { "status": "Departed Sorting Hub", "location": "FedEx Regional Facility, Dallas TX", "timestamp": "Sep 29, 06:45 PM", "completed": True },
            { "status": "Arrived at Destination Station", "location": "Austin Central Terminal, Austin TX", "timestamp": "Sep 30, 08:30 AM", "completed": True },
            { "status": "Out for Delivery on Courier Vehicle", "location": "Austin Local Delivery Courier", "timestamp": "Today, 07:15 AM", "completed": True },
            { "status": "Delivered to Customer Doorstep", "location": "Destination Address", "timestamp": "Estimated 4:30 PM", "completed": False }
        ]
    },
    {
        "trackingId": "AT-1024",
        "orderNumber": "ORD-2026-1024",
        "productName": "Aura Pulse Smartwatch Replacement Band (Titanium Gray)",
        "carrier": "UPS Worldwide",
        "carrierTrackingNumber": "1Z9999999999999999",
        "status": "In Transit",
        "destinationCity": "Seattle, WA",
        "destinationAddress": "1200 4th Ave, Seattle WA 98101",
        "estimatedDelivery": "Oct 03 by End of Day",
        "customerName": "Jordan Reed",
        "customerEmail": "jordan.reed@example.com",
        "customerPhone": "+1 (555) 876-5432",
        "mapTelemetry": {
            "originName": "AuraTech West Coast Hub, Reno NV",
            "destinationName": "1200 4th Ave, Seattle WA",
            "currentLocationName": "UPS Hub Portland OR (In Transit)",
            "speed": "58 MPH",
            "heading": "350° N (Interstate 5 Corridor)",
            "distanceRemaining": "174 Miles",
            "totalDistance": "705 Miles",
            "etaExact": "Oct 03, 05:00 PM PST",
            "etaMinutes": 1440,
            "vehicleModel": "UPS Long-Haul Freightliner #88",
            "driverName": "Sarah Jenkins",
            "driverBadge": "UPS-4019",
            "trafficStatus": "Moderate Highway Transit",
            "weather": "61°F Overcast",
            "satellitesLocked": "12 GNSS Sats (±1.8m Accuracy)",
            "routeProgressPct": 52,
            "curCourierPoint": { "x": 480, "y": 210 },
            "waypoints": [
                { "id": 1, "name": "AuraTech Reno Facility", "type": "Origin", "x": 130, "y": 320, "time": "Sep 30, 04:20 PM", "passed": True, "note": "Package sealed and loaded onto West Coast freight" },
                { "id": 2, "name": "UPS Hub, Portland OR", "type": "Regional Hub", "x": 480, "y": 210, "time": "Oct 01, 06:00 AM", "passed": True, "isLive": True, "note": "In transit via I-5 corridor north to Washington State" },
                { "id": 3, "name": "Seattle Distribution Facility", "type": "Local Station", "x": 720, "y": 130, "time": "Scheduled Oct 02", "passed": False, "note": "Awaiting arrival at Puget Sound facility" },
                { "id": 4, "name": "1200 4th Ave, Seattle WA", "type": "Destination Doorstep", "x": 840, "y": 80, "time": "ETA Oct 03 by End of Day", "passed": False, "note": "Commercial reception delivery" }
            ]
        },
        "timeline": [
            { "status": "Package Handed to Carrier", "location": "AuraTech West Coast Hub, Reno NV", "timestamp": "Sep 30, 04:20 PM", "completed": True },
            { "status": "In Transit through Network", "location": "UPS Hub, Portland OR", "timestamp": "Oct 01, 06:00 AM", "completed": True },
            { "status": "Out for Delivery", "location": "Seattle Distribution Facility", "timestamp": "Scheduled Oct 03", "completed": False }
        ]
    },
    {
        "trackingId": "AT-5521",
        "orderNumber": "ORD-2026-5521",
        "productName": "Aura Hub Pro - Smart Home Controller",
        "carrier": "FedEx Express",
        "carrierTrackingNumber": "FX-339102488",
        "status": "Delivered",
        "destinationCity": "Denver, CO",
        "destinationAddress": "900 16th St, Denver CO 80202",
        "estimatedDelivery": "Delivered Sep 28 at 2:15 PM (Signed by Customer)",
        "customerName": "Elena Vance",
        "customerEmail": "elena.vance@example.com",
        "customerPhone": "+1 (555) 345-6789",
        "mapTelemetry": {
            "originName": "AuraTech Denver Station, Denver CO",
            "destinationName": "900 16th St, Denver CO",
            "currentLocationName": "Delivered & Signed at Front Doorstep",
            "speed": "0 MPH (Completed)",
            "heading": "Parked / Delivered",
            "distanceRemaining": "0.0 Miles",
            "totalDistance": "18 Miles",
            "etaExact": "Delivered Sep 28 at 02:15 PM",
            "etaMinutes": 0,
            "vehicleModel": "FedEx Express Local Van #02",
            "driverName": "David Kim",
            "driverBadge": "FDX-2201",
            "trafficStatus": "Delivery Completed",
            "weather": "68°F Clear",
            "satellitesLocked": "15 GNSS Sats (Verified Delivery GPS)",
            "routeProgressPct": 100,
            "curCourierPoint": { "x": 820, "y": 220 },
            "waypoints": [
                { "id": 1, "name": "AuraTech Denver Station", "type": "Origin", "x": 150, "y": 220, "time": "Sep 26, 09:00 AM", "passed": True, "note": "Order dispatched from central fulfillment" },
                { "id": 2, "name": "Denver Central Sorting", "type": "Regional Hub", "x": 460, "y": 220, "time": "Sep 27, 02:30 PM", "passed": True, "note": "Sorted for morning courier route" },
                { "id": 3, "name": "900 16th St, Denver CO", "type": "Destination Doorstep", "x": 820, "y": 220, "time": "Sep 28, 02:15 PM", "passed": True, "isLive": True, "note": "Delivered to recipient • Signed by Elena Vance" }
            ]
        },
        "timeline": [
            { "status": "Order Processed", "location": "AuraTech Fulfillment, Denver CO", "timestamp": "Sep 26, 09:00 AM", "completed": True },
            { "status": "Delivered & Inspected", "location": "Front Porch, Denver CO", "timestamp": "Sep 28, 02:15 PM", "completed": True }
        ]
    }
]

# Service Manager Messages Database (Direct Two-Way Thread)
SERVICE_MANAGER_MESSAGES = [
    {
        "id": "mgr_msg_1",
        "sender": "manager",
        "managerName": "Marcus Vance",
        "managerTitle": "Senior Customer Service & Technical Experience Manager",
        "text": "Hello! I'm Marcus Vance, your dedicated Service Experience Manager at AuraTech. How can my team and I assist with your devices, shipments, or warranty claims today?",
        "timestamp": "Today at 09:00 AM",
        "priority": "Normal",
        "status": "Delivered"
    }
]

# Payments & Invoices Database
PAYMENTS_DB = [
    {
        "transactionId": "TXN-884102-AU",
        "orderNumber": "ORD-2026-9842",
        "productName": "Aura Studio ANC Headphones (Matte Black)",
        "amount": 249.00,
        "currency": "USD",
        "date": "Sep 29, 2026, 09:14 AM",
        "paymentMethod": "Apple Pay (Mastercard •••• 4242)",
        "status": "Paid / Settled",
        "customerEmail": "alex.mercer@example.com",
        "customerName": "Alex Mercer",
        "customerPhone": "+1 (555) 234-8901",
        "billingAddress": "742 Evergreen Terrace, Austin TX 78701",
        "invoice": {
            "invoiceNumber": "INV-2026-9842",
            "invoiceDate": "Sep 29, 2026",
            "dueDate": "Paid in Full",
            "subtotal": 249.00,
            "tax": 0.00,
            "shipping": 0.00,
            "shippingDiscount": "Complimentary Gold Member Express Shipping (-$12.99)",
            "total": 249.00,
            "authCode": "AUTH_99214_APL",
            "items": [
                {
                    "sku": "SKU-ANC-401",
                    "description": "Aura Studio ANC Headphones (Matte Black) + 2-Year Protection Plan",
                    "qty": 1,
                    "unitPrice": 249.00,
                    "total": 249.00
                }
            ]
        }
    },
    {
        "transactionId": "TXN-552190-AU",
        "orderNumber": "ORD-2026-5521",
        "productName": "Aura Hub Pro - Smart Home Matter Controller",
        "amount": 99.00,
        "currency": "USD",
        "date": "Sep 26, 2026, 08:30 AM",
        "paymentMethod": "Visa •••• 8821",
        "status": "Refunded",
        "customerEmail": "alex.mercer@example.com",
        "customerName": "Alex Mercer",
        "customerPhone": "+1 (555) 234-8901",
        "billingAddress": "742 Evergreen Terrace, Austin TX 78701",
        "refundRef": "REF-4091",
        "invoice": {
            "invoiceNumber": "INV-2026-5521",
            "invoiceDate": "Sep 26, 2026",
            "dueDate": "Refunded in Full ($99.00)",
            "subtotal": 99.00,
            "tax": 0.00,
            "shipping": 0.00,
            "shippingDiscount": "Free Standard Domestic Shipping",
            "total": 99.00,
            "authCode": "AUTH_44120_VSA",
            "items": [
                {
                    "sku": "SKU-HUB-99",
                    "description": "Aura Hub Pro - Smart Home Matter & Zigbee Controller",
                    "qty": 1,
                    "unitPrice": 99.00,
                    "total": 99.00
                }
            ]
        }
    },
    {
        "transactionId": "TXN-994120-AU",
        "orderNumber": "ORD-2026-1024",
        "productName": "Aura Pulse Smartwatch Replacement Band (Titanium Gray)",
        "amount": 49.00,
        "currency": "USD",
        "date": "Sep 30, 2026, 03:45 PM",
        "paymentMethod": "Mastercard •••• 1092",
        "status": "Refund Processing",
        "customerEmail": "jordan.reed@example.com",
        "customerName": "Jordan Reed",
        "customerPhone": "+1 (555) 876-5432",
        "billingAddress": "1200 4th Ave, Seattle WA 98101",
        "refundRef": "REF-8820",
        "invoice": {
            "invoiceNumber": "INV-2026-1024",
            "invoiceDate": "Sep 30, 2026",
            "dueDate": "Pending Refund Clearing",
            "subtotal": 49.00,
            "tax": 0.00,
            "shipping": 0.00,
            "shippingDiscount": "Standard Shipping",
            "total": 49.00,
            "authCode": "AUTH_11203_MC",
            "items": [
                {
                    "sku": "SKU-BND-49",
                    "description": "Aura Pulse Smartwatch Replacement Band (Titanium Gray)",
                    "qty": 1,
                    "unitPrice": 49.00,
                    "total": 49.00
                }
            ]
        }
    }
]

# Returned Products & Refund Tracking Database
REFUNDS_DB = [
    {
        "refundId": "REF-4091",
        "rmaNumber": "RMA-8842-RET",
        "orderNumber": "ORD-2026-5521",
        "productName": "Aura Hub Pro - Smart Home Matter Controller",
        "refundAmount": 99.00,
        "currency": "USD",
        "refundStatus": "Completed / Credited",
        "customerName": "Alex Mercer",
        "customerEmail": "alex.mercer@example.com",
        "destinationCard": "Visa ending in •••• 8821",
        "initiatedDate": "Sep 28, 2026",
        "completedDate": "Sep 30, 2026",
        "returnCarrier": "FedEx Ground Return",
        "returnTrackingNumber": "FX-RET-9901428",
        "timeline": [
            { "step": "Return Authorization (RMA) Approved", "detail": "30-Day Risk-Free Trial policy applied. Instant RMA generated.", "timestamp": "Sep 28, 10:00 AM", "completed": True },
            { "step": "Prepaid Return Shipping Label Generated", "detail": "Free domestic FedEx prepaid label issued to customer email.", "timestamp": "Sep 28, 10:05 AM", "completed": True },
            { "step": "Returned Package Received at Return Hub", "detail": "Package scanned at AuraTech Return Logistics, Dallas TX.", "timestamp": "Sep 29, 02:30 PM", "completed": True },
            { "step": "Inspection & Diagnostic Passed", "detail": "Hardware gently tested, repackaged. 100% full refund approved.", "timestamp": "Sep 29, 04:15 PM", "completed": True },
            { "step": "Refund Credited to Original Payment Method", "detail": "$99.00 credited back to Visa •••• 8821 (Cleared by bank).", "timestamp": "Sep 30, 09:00 AM", "completed": True }
        ]
    },
    {
        "refundId": "REF-8820",
        "rmaNumber": "RMA-9921-RET",
        "orderNumber": "ORD-2026-1024",
        "productName": "Aura Pulse Smartwatch Replacement Band (Titanium Gray)",
        "refundAmount": 49.00,
        "currency": "USD",
        "refundStatus": "In Progress (Card Clearing)",
        "customerName": "Jordan Reed",
        "customerEmail": "jordan.reed@example.com",
        "destinationCard": "Mastercard ending in •••• 1092",
        "initiatedDate": "Sep 30, 2026",
        "completedDate": "Expected Oct 02, 2026",
        "returnCarrier": "UPS Return Service",
        "returnTrackingNumber": "1Z-RET-4481029",
        "timeline": [
            { "step": "Return Authorization (RMA) Approved", "detail": "Customer requested return due to incorrect wrist size.", "timestamp": "Sep 30, 04:00 PM", "completed": True },
            { "step": "Prepaid Return Shipping Label Generated", "detail": "UPS prepaid barcode emailed to customer.", "timestamp": "Sep 30, 04:05 PM", "completed": True },
            { "step": "Returned Package In Transit to Hub", "detail": "In transit through UPS carrier network.", "timestamp": "Today, 08:30 AM", "completed": True },
            { "step": "Inspection & Quality Check", "detail": "Awaiting physical arrival at warehouse.", "timestamp": "Scheduled Today", "completed": False },
            { "step": "Refund Credited to Mastercard", "detail": "$49.00 will be credited within 24-48 business hours.", "timestamp": "Estimated Oct 02", "completed": False }
        ]
    }
]

class PulseCXRequestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path in ["/", "/index.html"]:
            index_path = os.path.join(DIRECTORY, "index.html")
            if os.path.exists(index_path):
                with open(index_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        if path in ["/admin", "/admin/", "/admin.html"]:
            admin_path = os.path.join(DIRECTORY, "admin.html")
            if os.path.exists(admin_path):
                with open(admin_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        # 1. Product & Shipment Tracking
        if path == "/api/tracker":
            search_q = query.get("q", [""])[0].strip().upper().replace("#", "")
            if search_q:
                results = [
                    item for item in TRACKING_DB
                    if search_q in item["trackingId"].upper()
                    or search_q in item["carrierTrackingNumber"].upper()
                    or search_q in item["customerEmail"].upper()
                    or search_q in item["orderNumber"].upper()
                ]
            else:
                results = TRACKING_DB

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"results": results, "total": len(results)}).encode("utf-8"))
            return

        # 2. Service Manager Messages Thread
        if path == "/api/manager/messages":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({
                "manager": {
                    "name": "Marcus Vance",
                    "title": "Senior Service & Experience Manager",
                    "status": "Online • Avg response under 3 min",
                    "avatar": "MV",
                    "directPhone": "+1 (800) 555-AURA ext 401",
                    "email": "marcus.vance@auratech.example.com"
                },
                "messages": SERVICE_MANAGER_MESSAGES
            }).encode("utf-8"))
            return

        # 3. Customer Profile lookup & Admin All Customers list
        if path in ["/api/admin/customers", "/api/customers"]:
            sanitized_customers = []
            for c in CUSTOMERS_DB:
                cust_copy = dict(c)
                # Keep metadata intact for admin view
                cust_copy["shipmentCount"] = len([s for s in TRACKING_DB if s.get("customerEmail", "").lower() == c.get("email", "").lower()])
                cust_copy["refundCount"] = len([r for r in REFUNDS_DB if r.get("customerEmail", "").lower() == c.get("email", "").lower()])
                sanitized_customers.append(cust_copy)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"customers": sanitized_customers, "total": len(sanitized_customers)}).encode("utf-8"))
            return

        if path == "/api/customer":
            email = query.get("email", [""])[0].strip().lower()
            customer = next((c for c in CUSTOMERS_DB if c["email"].lower() == email), CUSTOMERS_DB[0])
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(customer).encode("utf-8"))
            return

        # 4. Payment History & Invoices
        if path == "/api/payments":
            email = query.get("email", [""])[0].strip().lower()
            if email:
                results = [p for p in PAYMENTS_DB if p["customerEmail"].lower() == email]
            else:
                results = PAYMENTS_DB
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"payments": results, "total": len(results)}).encode("utf-8"))
            return

        # 5. Returned Product Refunds & Policy
        if path == "/api/refunds":
            email = query.get("email", [""])[0].strip().lower()
            if email:
                results = [r for r in REFUNDS_DB if r["customerEmail"].lower() == email]
            else:
                results = REFUNDS_DB
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"refunds": results, "total": len(results)}).encode("utf-8"))
            return

        # 6. Prompts
        if path in ["/api/prompt", "/api/prompts/all"]:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"nova_prompt": NOVA_SYSTEM_PROMPT}).encode("utf-8"))
            return

        # Fallback static file server
        rel_path = path.lstrip("/")
        full_path = os.path.join(DIRECTORY, rel_path)
        if rel_path and os.path.exists(full_path) and os.path.isfile(full_path):
            with open(full_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            if rel_path.endswith(".html"):
                self.send_header("Content-Type", "text/html; charset=utf-8")
            elif rel_path.endswith(".js"):
                self.send_header("Content-Type", "application/javascript")
            elif rel_path.endswith(".css"):
                self.send_header("Content-Type", "text/css")
            elif rel_path.endswith(".json"):
                self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        self.send_error(404, "Endpoint or file not found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_length)
        try:
            data = json.loads(body_bytes.decode("utf-8"))
        except Exception:
            data = {}

        # 1. Customer Registration API (Name, Surname, Phone, Email, Password)
        if path == "/api/register":
            first_name = data.get("firstName", "").strip()
            surname = data.get("surname", "").strip()
            phone = data.get("phone", "").strip()
            email = data.get("email", "").strip().lower()
            password = data.get("password", "aurapass123")

            if not first_name or not surname or not email or not phone:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "First name, surname, phone number, and email ID are required."}).encode("utf-8"))
                return

            # Check if customer already exists
            existing = next((c for c in CUSTOMERS_DB if c["email"] == email), None)
            if existing:
                new_customer = existing
            else:
                new_customer = {
                    "id": f"usr_{int(datetime.now().timestamp())}",
                    "firstName": first_name,
                    "surname": surname,
                    "phone": phone,
                    "email": email,
                    "password": password,
                    "membershipTier": "Gold",
                    "registeredAt": datetime.now().isoformat(),
                    "registeredDevices": [
                        {
                            "serialNumber": f"SN-{first_name[:3].upper()}-9901",
                            "modelName": "Aura Pulse Smartwatch",
                            "category": "Wearables",
                            "purchaseDate": "Recent Registration",
                            "warrantyStatus": "Active",
                            "warrantyExpires": "2 Years Manufacturer Warranty",
                            "healthStatus": "Optimal",
                            "lastSync": "Just now"
                        }
                    ]
                }
                CUSTOMERS_DB.insert(0, new_customer)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "message": f"Welcome {first_name}! Your customer profile and product protection are now active.",
                "customer": new_customer
            }).encode("utf-8"))
            return

        # 2. Customer Login API (Email or Phone)
        if path == "/api/login":
            identifier = data.get("email", "").strip().lower()
            customer = next((c for c in CUSTOMERS_DB if c["email"].lower() == identifier or c["phone"].replace(" ", "").replace("-", "") in identifier.replace(" ", "").replace("-", "")), None)
            if not customer:
                # Create a customer profile if first-time user
                customer = {
                    "id": f"usr_{int(datetime.now().timestamp())}",
                    "firstName": identifier.split("@")[0].capitalize() if "@" in identifier else "Member",
                    "surname": "Customer",
                    "phone": identifier if "@" not in identifier else "+1 (555) 234-8901",
                    "email": identifier if "@" in identifier else f"user_{int(datetime.now().timestamp())}@auratech.example.com",
                    "membershipTier": "Gold",
                    "registeredAt": datetime.now().isoformat(),
                    "registeredDevices": [
                        {
                            "serialNumber": f"SN-PLS-{int(datetime.now().timestamp()) % 10000}",
                            "modelName": "Aura Pulse Smartwatch",
                            "category": "Wearables",
                            "purchaseDate": "Recent Registration",
                            "warrantyStatus": "Active",
                            "warrantyExpires": "2 Years Manufacturer Warranty",
                            "healthStatus": "Optimal",
                            "lastSync": "Just now"
                        }
                    ]
                }
                CUSTOMERS_DB.append(customer)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "message": f"Welcome back, {customer['firstName']}!",
                "customer": customer
            }).encode("utf-8"))
            return

        # 2b. Customer Profile Update API
        if path == "/api/customer/update":
            cust_id = data.get("id", "")
            updated_phone = data.get("phone", "").strip()
            updated_email = data.get("email", "").strip().lower()
            customer = next((c for c in CUSTOMERS_DB if c["id"] == cust_id or c["email"].lower() == updated_email), CUSTOMERS_DB[0])
            if updated_phone:
                customer["phone"] = updated_phone
            if updated_email:
                customer["email"] = updated_email

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "customer": customer}).encode("utf-8"))
            return

        # 2c. Initiate 30-Day Return & Refund API
        if path == "/api/refunds/initiate":
            product_name = data.get("productName", "Aura Studio ANC Headphones")
            order_number = data.get("orderNumber", "ORD-2026-9842")
            reason = data.get("reason", "30-Day Risk-Free Trial Return")
            cust_name = data.get("customerName", "Alex Mercer")
            cust_email = data.get("customerEmail", "alex.mercer@example.com")
            refund_amount = float(data.get("amount", 249.00))

            refund_id = f"REF-{int(datetime.now().timestamp() % 10000)}"
            rma_number = f"RMA-{int(datetime.now().timestamp() % 10000)}-RET"
            return_track = f"FX-RET-{int(datetime.now().timestamp() * 10 % 10000000)}"

            new_refund = {
                "refundId": refund_id,
                "rmaNumber": rma_number,
                "orderNumber": order_number,
                "productName": product_name,
                "refundAmount": refund_amount,
                "currency": "USD",
                "refundStatus": "In Progress (Card Clearing)",
                "customerName": cust_name,
                "customerEmail": cust_email,
                "destinationCard": "Original Payment Method",
                "initiatedDate": datetime.now().strftime("%b %d, %Y"),
                "completedDate": "Expected in 3 Business Days",
                "returnCarrier": "FedEx Ground Return",
                "returnTrackingNumber": return_track,
                "timeline": [
                    { "step": "Return Authorization (RMA) Approved", "detail": f"Reason: {reason}. 100% full refund approved under 30-Day Trial.", "timestamp": "Just now", "completed": True },
                    { "step": "Prepaid Return Shipping Label Generated", "detail": f"Free domestic prepaid label ({return_track}) generated.", "timestamp": "Just now", "completed": True },
                    { "step": "Carrier Drop-off Scanned", "detail": "Pending package scan at local FedEx/UPS station.", "timestamp": "Pending Drop-off", "completed": False },
                    { "step": "Inspection & Refund Credited", "detail": f"${refund_amount:.2f} will credit back to original payment method.", "timestamp": "Estimated in 2-3 Days", "completed": False }
                ]
            }
            REFUNDS_DB.insert(0, new_refund)

            # Update status in PAYMENTS_DB
            for p in PAYMENTS_DB:
                if p["orderNumber"] == order_number:
                    p["status"] = "Refund Processing"
                    p["refundRef"] = refund_id

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "message": f"Return RMA {rma_number} authorized! Free prepaid return label generated.",
                "refund": new_refund
            }).encode("utf-8"))
            return

        # 3. Direct Service Manager Texting API (Customer Message Ingestion)
        if path == "/api/manager/messages":
            text = data.get("text", "").strip()
            sender = data.get("sender", "customer")
            customer_name = data.get("customerName", "Customer")
            priority = data.get("priority", "Normal")
            ticket_ref = data.get("ticketRef", f"TICK-{int(datetime.now().timestamp() % 10000)}")

            if not text:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Message text cannot be empty."}).encode("utf-8"))
                return

            cust_msg = {
                "id": f"msg_{int(datetime.now().timestamp() * 1000)}",
                "sender": "customer",
                "customerName": customer_name,
                "text": text,
                "timestamp": "Just now",
                "priority": priority,
                "ticketRef": ticket_ref,
                "status": "Delivered to Marcus Vance's Desk"
            }
            SERVICE_MANAGER_MESSAGES.append(cust_msg)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "message": f"Message delivered directly to Marcus Vance (Desk Queue #{ticket_ref}).",
                "sentMessage": cust_msg
            }).encode("utf-8"))
            return

        # 3b. Manual Admin / Service Manager Reply Endpoint (Manual Operator Response)
        if path in ["/api/manager/reply", "/api/admin/reply"]:
            text = data.get("text", "").strip()
            ticket_ref = data.get("ticketRef", "TICK-8842")
            priority = data.get("priority", "Normal")

            if not text:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Reply text cannot be empty."}).encode("utf-8"))
                return

            mgr_msg = {
                "id": f"msg_mgr_{int(datetime.now().timestamp() * 1000)}",
                "sender": "manager",
                "managerName": "Marcus Vance",
                "managerTitle": "Senior Customer Service & Technical Experience Manager",
                "text": text,
                "timestamp": "Just now",
                "priority": priority,
                "ticketRef": ticket_ref,
                "status": "Delivered to Customer"
            }
            SERVICE_MANAGER_MESSAGES.append(mgr_msg)

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "reply": mgr_msg
            }).encode("utf-8"))
            return

        # 4. Nova AI Chat Assistant
        if path == "/api/chat":
            message = data.get("message", "")
            context = data.get("context", {})
            session_id = data.get("sessionId", f"sess_{int(datetime.now().timestamp())}")
            lower = message.lower()

            user_name = context.get("userName", "Customer")
            auth_status = context.get("authStatus", "guest")

            # Check if customer wants to contact the service manager directly
            if any(k in lower for k in ["manager", "service manager", "human", "speak with manager", "text manager"]):
                reply = (f"I'd be glad to connect you with our Service Experience Manager! "
                         f"You can text **Marcus Vance** directly via our **[Service Manager Desk]** tab on the navigation bar, "
                         f"or call his desk at `+1 (800) 555-AURA ext 401`.")
                telemetry = {
                    "session_id": session_id,
                    "timestamp": datetime.now().isoformat(),
                    "customer_sentiment": "Inquiring",
                    "primary_intent": "Service Manager Direct Handoff",
                    "mentioned_products": [],
                    "friction_points": [],
                    "escalation_required": True,
                    "actionable_insight": "Visitor connected directly to Service Manager Marcus Vance desk.",
                    "confidence_score": 99
                }
                TELEMETRY_STORE.insert(0, telemetry)
                response = {
                    "reply": reply,
                    "sentiment": "Inquiring",
                    "intent": "Service Manager Direct Handoff",
                    "escalation_required": True,
                    "telemetry": telemetry
                }
            elif any(k in lower for k in ["track", "package", "where is my order", "at-9842", "at-1024"]):
                reply = ("I'm here to help you track your shipment! Order **#AT-9842** (Aura Studio ANC Headphones) is currently **Out for Delivery** via FedEx Express.\n\n"
                         "• **Carrier:** FedEx Express (FX-884102941)\n"
                         "• **Destination:** Austin, TX\n"
                         "• **Estimated Arrival:** Today by 4:30 PM EST.\n\n"
                         "You can view live route milestones in our **Live Product Tracker** tab above!")
                telemetry = {
                    "session_id": session_id,
                    "timestamp": datetime.now().isoformat(),
                    "customer_sentiment": "Positive",
                    "primary_intent": "Product & Shipment Tracking",
                    "mentioned_products": ["Aura Studio ANC Headphones"],
                    "friction_points": [],
                    "escalation_required": False,
                    "actionable_insight": "Provided instant package tracking update for order #AT-9842.",
                    "confidence_score": 98
                }
                TELEMETRY_STORE.insert(0, telemetry)
                response = {
                    "reply": reply,
                    "sentiment": "Positive",
                    "intent": "Product & Shipment Tracking",
                    "escalation_required": False,
                    "telemetry": telemetry
                }
            elif any(k in lower for k in ["warranty", "return", "refund", "replace", "broken"]):
                reply = ("We prioritize hassle-free customer care! AuraTech products include a **30-day risk-free return trial** and a **1-to-2 year full hardware replacement warranty**.\n\n"
                         "• **Prepaid Labels:** Free return shipping labels provided for all domestic service.\n"
                         "• **Fast Replacement:** Replacements dispatch within 24 hours of inspection.\n\n"
                         "Would you like me to open a service ticket or connect you with Service Manager Marcus Vance?")
                telemetry = {
                    "session_id": session_id,
                    "timestamp": datetime.now().isoformat(),
                    "customer_sentiment": "Positive",
                    "primary_intent": "Warranty & Service Policy",
                    "mentioned_products": [],
                    "friction_points": [],
                    "escalation_required": False,
                    "actionable_insight": "Assisted with warranty and replacement policy terms.",
                    "confidence_score": 97
                }
                TELEMETRY_STORE.insert(0, telemetry)
                response = {
                    "reply": reply,
                    "sentiment": "Positive",
                    "intent": "Warranty & Service Policy",
                    "escalation_required": False,
                    "telemetry": telemetry
                }
            else:
                reply = (f"Hello {user_name}! I'm Nova from AuraTech Customer Experience. "
                         f"I can help you track active packages, check device warranty status, or connect you directly with our Service Manager. "
                         f"What can I help you with today?")
                telemetry = {
                    "session_id": session_id,
                    "timestamp": datetime.now().isoformat(),
                    "customer_sentiment": "Neutral",
                    "primary_intent": "Customer Experience Assistance",
                    "mentioned_products": [],
                    "friction_points": [],
                    "escalation_required": False,
                    "actionable_insight": "Standard CX concierge engagement.",
                    "confidence_score": 92
                }
                TELEMETRY_STORE.insert(0, telemetry)
                response = {
                    "reply": reply,
                    "sentiment": "Neutral",
                    "intent": "Customer Experience Assistance",
                    "escalation_required": False,
                    "telemetry": telemetry
                }

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode("utf-8"))
            return

        self.send_error(404, "Endpoint not found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), PulseCXRequestHandler) as httpd:
        print("===========================================================")
        print(">> AuraTech PulseCX Customer Service & Experience Server")
        print(f"Local URL: http://localhost:{PORT} or http://127.0.0.1:{PORT}")
        print("Service Features:")
        print("  - POST /api/register          (Customer Details: Name, Surname, Phone, Email)")
        print("  - POST /api/login             (Customer Auth)")
        print("  - GET/POST /api/manager/messages (Direct Service Manager Texting Platform)")
        print("  - GET  /api/tracker           (Live Product & Shipment Tracker)")
        print("  - POST /api/chat              (Nova AI CX Concierge)")
        print("===========================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.shutdown()
