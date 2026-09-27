# MarketLink (eGreen Basket) — Architecture & Activity Flowcharts

**Championship:** Aptech TechWiz 7  
**Document:** System Architecture, Data Flow Diagrams (DFD), and Activity Flowcharts  
**Version:** 1.0  

---

## 1. Multi-Tier Architecture Diagram

```mermaid
graph TD
    Client["Client Tier: Web Browser (Chrome, Firefox, Edge)<br/>React 18 + Bootstrap 5 + ReactBits + Three.js"]
    Web["Web & API Server: Node.js + Express REST API<br/>CORS, JWT Authentication, JSON Middleware"]
    Logic["Application Logic Tier<br/>Pre-Order Manager, Stock Auto-Deduction, AI Assistant, Notifications"]
    Data["Database Tier<br/>MongoDB Native / Hybrid Persistent Storage Engine"]

    Client -->|HTTPS / REST API Requests| Web
    Web -->|Processed Responses / JSON| Client
    Web --> Logic
    Logic -->|CRUD Queries & Mongoose ODM| Data
    Data -->|Dataset Records & Aggregations| Logic
```

---

## 2. Overall Platform Flow Diagram

```mermaid
flowchart TD
    Start([Start]) --> Login[User Login / Authentication]
    Login --> RoleCheck{Role Identification}

    RoleCheck -->|Admin| AdminDash[Admin Console]
    AdminDash --> M1[Verify & Approve Farmers]
    AdminDash --> M2[Activate / Deactivate Customers]
    AdminDash --> M3[Manage Farmers Markets & Coordinates]
    AdminDash --> M4[Content Moderation: Products & Reviews]
    AdminDash --> M5[Broadcast Platform Announcements]
    AdminDash --> M6[View System Revenue & Sales Reports]

    RoleCheck -->|Farmer / Vendor| FarmerDash[Farmer Stall Console]
    FarmerDash --> F1[Manage Weekly Stock & Recurring Templates]
    FarmerDash --> F2[Set Pickup Windows & Cutoff Hours]
    FarmerDash --> F3[Accept / Decline Incoming Pre-Orders]
    FarmerDash --> F4[Mark Harvest Orders Ready for Pickup]
    FarmerDash --> F5[Review Sales Insights & Revenue Summary]
    FarmerDash --> F6[Reply to Customer Feedback]

    RoleCheck -->|Customer / Shopper| CustFlow[Shopper Experience]
    CustFlow --> C1[Browse Nearby Markets & View OpenStreetMap]
    CustFlow --> C2[Search & Filter Harvest Catalog by Category/Day]
    CustFlow --> C3[Consult AI Market Assistant for Timings]
    CustFlow --> C4[Add to Basket & Reserve Pre-Order with Time Slot]
    CustFlow --> C5[Modify or Cancel Order before Farmer Cutoff]
    CustFlow --> C6[Arrive at Market Stall, Pay In-Person, & Collect]
    CustFlow --> C7[Submit Post-Order 5-Star Rating & Review]

    M1 & M2 & M3 & M4 & M5 & M6 --> DB[(MongoDB Database)]
    F1 & F2 & F3 & F4 & F5 & F6 --> DB
    C1 & C2 & C4 & C5 & C6 & C7 --> DB
    DB --> End([End Activity])
```

---

## 3. Pre-Order & In-Person Settlement Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend as React 18 UI
    participant Backend as Express REST API
    participant DB as MongoDB
    actor Farmer

    Customer->>Frontend: Browse produce & select pickup slot
    Frontend->>Backend: POST /api/orders (items, slot, instructions)
    Backend->>DB: Check stock & deduct reserved quantities
    Backend->>DB: Save pre-order (status: 'placed')
    Backend-->>Farmer: In-app Alert: New Pre-Order Received
    Backend-->>Customer: Instant Pre-Order Confirmation

    Farmer->>Backend: PATCH /api/orders/:id/status ('accepted')
    Backend-->>Customer: Notification: Pre-Order Accepted

    Farmer->>Backend: Packs crate & PATCH status ('ready_for_pickup')
    Backend-->>Customer: Notification: 🎉 Order Ready at Stall!

    Customer->>Farmer: Visits Stall, Inspects Harvest, Pays In-Person (Cash/Card/UPI)
    Farmer->>Backend: PATCH /api/orders/:id/status ('completed')
    Customer->>Backend: POST /api/reviews (Rating & Comment)
    Farmer->>Backend: PATCH /api/reviews/:id/reply (Thank you reply)
```

---

## 4. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : lists
    USERS ||--o{ ORDERS : places
    USERS ||--o{ REVIEWS : writes
    MARKETS ||--o{ PRODUCTS : hosts
    MARKETS ||--o{ ORDERS : destination
    CATEGORIES ||--o{ PRODUCTS : classifies
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ REVIEWS : receives

    USERS {
        string _id PK
        string username
        string email
        string role
        string status
        string stallName
        string pickupTimeWindows
    }

    MARKETS {
        string _id PK
        string name
        string address
        float latitude
        float longitude
        string operatingDays
        string timings
    }

    PRODUCTS {
        string _id PK
        string farmerId FK
        string name
        string category
        float price
        string unit
        int stock_quantity
        boolean isSoldOut
        boolean isRecurringTemplate
    }

    ORDERS {
        string _id PK
        string orderNumber
        string customerId FK
        string farmerId FK
        float total_amount
        string order_status
        string pickupDate
        string pickupTimeSlot
    }

    REVIEWS {
        string _id PK
        string productId FK
        string farmerId FK
        string customerId FK
        int rating
        string comment
        string farmerReply
    }
```
