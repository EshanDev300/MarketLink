# MarketLink — Software Requirements Specification & Technical Report
**Project Name:** MarketLink  
**Theme:** eGreen Basket  
**Championship:** Aptech TechWiz 7  
**Category:** End-to-End Web Solutions  
**Version:** 1.0  

---

## 1. Executive Summary & Problem Definition
Local farmers markets provide crucial access to seasonal, nutrient-dense, and ecologically sustainable produce. However, traditional market models lack coordination:
- Shoppers face unpredictable stock availability, arriving at stalls only to find high-demand heirloom produce sold out.
- Farmers lack a direct forecasting mechanism to gauge pre-harvest demand, resulting in unsold surplus and agricultural food waste.
- Stall locations and market timings are informally communicated through chalkboards or outdated flyers without digital route navigation.

**MarketLink (eGreen Basket)** addresses these challenges by delivering an end-to-end web platform bridging local growers with conscious consumers. Farmers publish weekly recurring inventory templates prior to harvest day, and customers reserve produce baskets with morning pickup windows. Pre-orders are paid for in-person at pickup, protecting growers from transaction fees and supporting direct community trade.

---

## 2. Multi-Tier System Architecture
MarketLink adheres to a modern multi-tier web architecture:

1. **Client Tier (Presentation):**
   - Built on **React 18** with **Vite**.
   - Custom styling using **Bootstrap 5** and custom CSS — strictly **Zero Tailwind CSS**.
   - Interactive UI inspired by **reactbits.dev**: Custom cursor with magnetic ring follower, Decrypted Text animations, Spotlight cards, Bento Grid layouts, and shimmering text.
   - **Three.js** canvas providing an interactive 3D harvest basket with real-time mouse-tracking tilt.
   - Embedded **OpenStreetMap** with custom markers, stall directions, and coordinate pinning.

2. **Application Tier (Business Logic):**
   - **Node.js** and **Express** REST API.
   - JWT authentication with Role-Based Access Control (Admin, Farmer, Customer).
   - Real-time stock reservation engine that deducts quantities upon pre-order and restores stock upon cancellation.
   - Built-in AI Market Assistant answering questions about market schedules, produce availability, and pickup slots.

3. **Data Tier (Storage):**
   - **MongoDB** with Mongoose ODM schemas for Users, Markets, Products, Orders, Reviews, and Announcements.
   - Dual-mode architecture: connects natively to MongoDB (`mongodb://127.0.0.1:27017/marketlink`) or automatically activates an embedded persistent store for immediate zero-config evaluation.
   - Complete Relational SQL definitions provided in `Documentation/Database_Design.sql`.

---

## 3. Entity-Relationship & Database Design

### Core Entities:
- **Users:** `_id`, `name`, `username`, `email`, `password_hash`, `role` ('customer', 'farmer', 'admin'), `contactNumber`, `address`, `status` ('active', 'pending', 'suspended'), `stallName`, `pickupTimeWindows`, `orderCutoffHours`, `favoriteFarmers`, `favoriteProducts`.
- **Markets:** `_id`, `name`, `address`, `city`, `operatingDays`, `timings`, `latitude`, `longitude`, `map_provider`, `image`, `description`.
- **Products:** `_id`, `farmerId`, `farmerName`, `marketId`, `name`, `category`, `price`, `unit`, `stock_quantity`, `image`, `isSoldOut`, `isRecurringTemplate`, `ratingAverage`.
- **Orders:** `_id`, `orderNumber`, `customerId`, `farmerId`, `items` (array with product, qty, price), `total_amount`, `order_status` ('placed', 'accepted', 'ready_for_pickup', 'completed', 'cancelled'), `pickupDate`, `pickupTimeSlot`, `paymentStatus`.
- **Reviews:** `_id`, `productId`, `farmerId`, `customerId`, `rating` (1–5), `comment`, `farmerReply`, `createdAt`.
- **Announcements:** `_id`, `title`, `message`, `audience` ('all', 'farmers', 'customers'), `active`.

---

## 4. Functional Specifications Matrix

| Module | Feature | Implementation Details |
| :--- | :--- | :--- |
| **Customer** | Account Registration & Login | Secure registration, contact details, profile management. |
| **Customer** | Browse Markets & Leaflet Map | OpenStreetMap with market markers, timings, and directions. |
| **Customer** | Search, Browse & Filter Products | Multi-criteria filter: Category pills, price, market, day, in-stock toggle. |
| **Customer** | Pre-Orders for Market Pickup | Select morning pickup window; 0% online gateway; pay in-person at stall. |
| **Customer** | Order Management & History | Status progress tracker, modify slot before cutoff, cancel order, 1-click re-order. |
| **Customer** | Favorites & Restock Alerts | Heart toggle for favorite farmers and staple produce. |
| **Customer** | Ratings & Reviews | Post 1-5 star ratings and reviews for completed orders. |
| **Farmer** | Stall Profile & Operating Days | Manage stall name, pickup windows, cutoff hours, and map coordinates. |
| **Farmer** | Weekly Stock & Pricing | CRUD products with image, unit, quantity; weekly recurring templates. |
| **Farmer** | Manage Incoming Pre-Orders | Accept/decline pre-orders; mark ready for pickup; automatic stock restoration. |
| **Farmer** | Sales Insights & Review Reply | View total revenue, pending orders, top products; reply to customer reviews. |
| **Admin** | KPI Metrics Dashboard | Real-time counts for farmers, customers, markets, pre-orders, and sales. |
| **Admin** | Farmer & Customer Moderation | Approve pending farmer registrations; suspend or activate accounts. |
| **Admin** | Manage Farmers Markets | Add, edit, and delete markets with geographic coordinates and timings. |
| **Admin** | Content Moderation & Broadcast | Remove inappropriate products or reviews; publish platform announcements. |
| **AI Assistant**| 24/7 Intelligent Chatbot | Dynamic responses regarding market hours, vendor availability, and produce stock. |

---

## 5. Non-Functional Compliance
- **Safety & Security:** Bcrypt salted password hashing, JWT stateless authorization, input validation.
- **Accessibility & UX:** High-contrast organic color palette, clear legible typography (`Outfit` & `Plus Jakarta Sans`), keyboard-friendly modals.
- **Responsiveness:** Fully mobile-friendly Bootstrap 5 grid layout compatible with desktop, tablet, and mobile browsers.
- **High Performance:** Client-side caching, optimized Three.js render loop with cleanup, zero unnecessary network downloads.
