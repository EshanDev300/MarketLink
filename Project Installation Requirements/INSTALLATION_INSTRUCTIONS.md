# MarketLink (eGreen Basket) — Project Installation & Execution Instructions

**Championship:** Aptech TechWiz 7  
**Category:** End-to-End Web Solutions  
**Theme:** eGreen Basket  
**Platform Architecture:** React 18, Bootstrap 5 (No Tailwind CSS), Node.js, Express, MongoDB, Three.js, OpenStreetMap  

---

## 1. System Requirements

### Hardware:
- Intel Core i5 / i7 Processor or equivalent
- 8 GB RAM or higher
- 10 GB free disk space
- SVGA / Full HD Monitor (1920x1080 recommended)

### Software & Environment:
- **Node.js**: v18.0.0 or higher (Tested on Node v24.18.0)
- **NPM**: v9.0.0 or higher
- **Database**: MongoDB (Local daemon or MongoDB Atlas cloud connection string). *Note: An automated persistent JSON fallback engine is also embedded in the backend to ensure zero-friction out-of-the-box evaluation if MongoDB is offline.*
- **Modern Web Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge.

---

## 2. Directory Structure Overview

```
MarketLink/
├── All Users Credential/
│   └── credentials.txt               # All login credentials for Admin, Farmers, Customers
├── Documentation/
│   ├── Project_Report_MarketLink.md  # Comprehensive project report
│   ├── Database_Design.sql           # Complete relational SQL scripts
│   └── INSTALLATION_INSTRUCTIONS.md  # Setup manual
├── Problem Definition.txt            # Formal problem statement & SRS alignment
├── Tested Data.txt                   # Complete test datasets
├── Project Live Link/
│   └── live_link.txt                 # URLs and deployment notes
└── Source Code/
    ├── backend/                      # Node.js + Express + Mongoose REST API
    │   ├── db/                       # Hybrid MongoDB & zero-config persistent store
    │   ├── models/                   # Schemas for User, Market, Product, Order, Review
    │   ├── routes/                   # REST API controllers & AI Assistant
    │   ├── server.js                 # API server entry point
    │   └── package.json
    └── frontend/                     # React 18 + Vite + Bootstrap 5 (No Tailwind)
        ├── src/
        │   ├── components/
        │   │   ├── common/           # Navbar, Footer, Chatbot, Notifications
        │   │   ├── reactbits/        # Custom Cursor, DecryptedText, BentoGrid, SpotlightCard
        │   │   ├── three/            # Interactive Three.js 3D Harvest Basket
        │   │   ├── map/              # Leaflet OpenStreetMap with directions
        │   │   ├── products/         # ProductCard, Filters, Details modal
        │   │   └── preorders/        # Pre-order cart & pickup slot selector
        │   ├── pages/                # Home, Markets, Products, Dashboards (Customer, Farmer, Admin)
        │   ├── context/              # Auth, Cart, and Notification Contexts
        │   ├── styles/               # Bootstrap 5 + Pure Custom CSS & Animations
        │   ├── App.jsx
        │   └── main.jsx
        ├── index.html
        ├── vite.config.js
        └── package.json
```

---

## 3. Step-by-Step Execution Guide

### Step 1: Start the Backend Server
1. Open PowerShell or Terminal and navigate to the backend directory:
   ```powershell
   cd "d:\MarketLink\Source Code\backend"
   ```
2. Install dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the Express REST server:
   ```powershell
   node server.js
   ```
4. The server will launch on `http://localhost:5000`. It will automatically connect to MongoDB (`mongodb://127.0.0.1:27017/marketlink`) or activate the embedded store, seeding all TechWiz test data automatically.

### Step 2: Start the React Frontend Application
1. Open a second PowerShell or Terminal window and navigate to the frontend directory:
   ```powershell
   cd "d:\MarketLink\Source Code\frontend"
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
4. The web application will launch at:
   👉 **http://localhost:3000** (or `http://localhost:5173`)

---

## 4. Evaluation Credentials (1-Click Login Available)

For evaluator convenience, 1-Click login buttons are built directly into the navbar header (**"⚡ Quick Demo Roles"**) and the Login Page:

| User Role | Email / Identifier | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@marketlink.com` | `admin123` | Full metrics, approve farmers, moderation, announcements, market CRUD |
| **Farmer / Vendor** | `greenvalley@marketlink.com` | `farmer123` | Weekly stock CRUD, accept pre-orders, mark ready for pickup, reply to reviews |
| **Customer / Shopper** | `priya@marketlink.com` | `customer123` | Browse markets, map directions, place pre-orders, select pickup slots, reviews |

---

## 5. Key Highlights

1. **Strictly No Tailwind CSS**: Built with Bootstrap 5 and handcrafted custom CSS / SCSS with rich nature gradients and glassmorphism.
2. **ReactBits Components**: Interactive custom cursor ring follower, Decrypted Text cyber-organic animation, Spotlight cards with cursor-following radial glow, Bento Grid, and Magnetic buttons.
3. **Interactive 3D Graphics**: Three.js harvest basket with organic fruits, vegetables, ambient floating golden pollen, and cursor-tracking tilt.
4. **Pre-Order Settlement**: Pre-orders reserved online with 0% gateway cuts; settled in person at market pickup as specified by the SRS.
5. **AI Assistant**: 24/7 intelligent domain chatbot answering market hours, produce availability, and pickup guidelines.
