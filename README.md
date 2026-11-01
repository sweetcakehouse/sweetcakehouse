# 🎂 Sweet Cake House — Professional Artisanal Bakery Website

> **A modern, full-stack, mobile-first cake ordering website featuring an interactive Three.js 3D celebration cake, custom cake designer, manual UPI payment system with dynamic QR codes, automated WhatsApp order dispatch, and a comprehensive admin management dashboard.**

---

## 🌟 Key Highlights & Architecture

- **Interactive Three.js 3D Scene**: Real-time 3D rendered celebration cake in the hero section featuring interactive orbit dragging, cream piping rosettes, glossy ruby cherries, and a flickering birthday candle flame.
- **Boutique Bakery Aesthetic**: Crafted with an elegant cream, soft rose pink, and chocolate brown palette, typography pairing Playfair Display and Plus Jakarta Sans.
- **100% Free & Zero-Cost Dependencies**: Runs completely on free services with zero paid payment gateways, no Razorpay, no Stripe, and no subscription APIs.
- **Manual UPI Payment System**:
  - Dynamically generated UPI URI (`upi://pay?pa=...&pn=...&am=...&tn=...&cu=INR`).
  - Dynamic on-the-fly QR code generated specifically for each order amount and reference.
  - Direct 1-tap "Pay via UPI App" on mobile.
  - 12-digit UTR (UPI Transaction Reference) submission with optional payment screenshot.
  - **Zero-trust verification**: Strict manual admin verification before baking starts.
- **Automated WhatsApp Order Dispatch**: After placing an order, generates a pre-formatted WhatsApp message containing complete order details, item weights, custom inscriptions, and delivery address to the bakery's business number.
- **Custom Cake Designer Studio**: Allows customers to select custom shapes, weights, flavors, reference photo uploads, delivery dates, time slots, and special pastry instructions.
- **Secure Admin Management Portal**:
  - Protected with JWT authentication and bcrypt password hashing.
  - Metric overview (Total Revenue, Pending Verifications, Active Orders).
  - Order inspector with 1-click "Verify Payment" and "Reject Payment".
  - Full product catalog CRUD with dynamic weight-to-price matrix.
  - Store settings (UPI ID, Holder Name, QR Code, WhatsApp Number, Delivery fees).
- **Graceful Fallback Mode**: If MongoDB Atlas is not yet configured, the server automatically boots into an in-memory fallback store so developers and evaluators can immediately test the entire application out-of-the-box!

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React, Three.js |
| **Backend** | Node.js, Express.js, REST API, JWT Authentication, bcryptjs, Multer, Helmet, CORS, Express Rate Limit, QRCode |
| **Database** | MongoDB Atlas Free Tier / Mongoose ODM |
| **Payments** | Manual UPI (VPA & Dynamic QR) + UTR Verification |
| **Deployment** | Vercel (Frontend) + Render (Backend) + MongoDB Atlas (Database) |

---

## 📁 Project Structure

```
sweet-cake-house/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection with retry & diagnostics
│   │   └── inMemoryStore.js      # Graceful fallback store for immediate local testing
│   ├── controllers/
│   │   ├── authController.js     # Admin login, token issuance, profile
│   │   ├── productController.js  # Cake catalog, weights & pricing, category filters
│   │   ├── orderController.js    # Backend price calculation, UPI QR, WhatsApp text
│   │   └── settingsController.js # Bakery settings, UPI ID, delivery rules
│   ├── middleware/
│   │   ├── auth.js               # JWT verification guard
│   │   ├── errorHandler.js       # Centralized error handler
│   │   └── upload.js             # Multer secure image uploads
│   ├── models/
│   │   ├── Admin.js              # Admin schema with bcrypt hooks
│   │   ├── Product.js            # Cake schema with multi-weight pricing matrix
│   │   ├── Order.js              # Comprehensive order schema with UTR & custom cake
│   │   └── Settings.js           # Shop configuration & UPI details
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── settingsRoutes.js
│   │   └── uploadRoutes.js
│   ├── scripts/
│   │   ├── seed.js               # Seeds 8+ sample cakes with realistic INR prices
│   │   └── createAdmin.js        # Seeds default admin account
│   ├── uploads/                  # Uploaded reference photos & screenshots
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLayout.jsx       # Sidebar navigation & header
│   │   │   │   └── OrderDetailModal.jsx  # Order inspector & payment verification
│   │   │   ├── checkout/
│   │   │   │   ├── OrderSummary.jsx      # Bill breakdown & free delivery tracker
│   │   │   │   └── UpiPaymentSection.jsx # Live QR code, UPI copy button & UTR form
│   │   │   └── common/
│   │   │       ├── Cake3DScene.jsx       # Three.js 3D interactive celebration cake
│   │   │       ├── Footer.jsx            # Brand story, opening hours & quick links
│   │   │       ├── Navbar.jsx            # Sticky header with cart badge
│   │   │       ├── ProductCard.jsx       # Card with hover zoom, tags, & quick add
│   │   │       └── WhatsAppButton.jsx    # Floating WhatsApp order trigger
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Admin JWT state & login/logout
│   │   │   ├── CartContext.jsx           # Cart calculations & localStorage persistence
│   │   │   └── SettingsContext.jsx       # Global bakery settings state
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.jsx# Metrics, alerts, recent orders
│   │   │   │   ├── AdminLoginPage.jsx    # Admin login with credential hints
│   │   │   │   ├── AdminOrdersPage.jsx   # Filter, search, and verify orders
│   │   │   │   ├── AdminProductsPage.jsx # Add, edit, delete cakes & prices
│   │   │   │   └── AdminSettingsPage.jsx # Edit UPI ID, WhatsApp number, fees
│   │   │   ├── CartPage.jsx              # Item quantity controls & delivery rules
│   │   │   ├── CatalogPage.jsx           # Filterable cakes catalog with search & sort
│   │   │   ├── CheckoutPage.jsx          # Delivery address & manual UPI payment
│   │   │   ├── CustomCakePage.jsx        # Custom cake designer with photo upload
│   │   │   ├── HomePage.jsx              # Hero with 3D Cake, Bestsellers, Testimonials
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── OrderSuccessPage.jsx      # Order confirmation & WhatsApp button
│   │   │   ├── ProductDetailPage.jsx     # Dynamic weight pricing & inscription
│   │   │   └── TrackOrderPage.jsx        # Order lookup by ID or phone
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance & API endpoints
│   │   ├── App.jsx                       # Client-side routing
│   │   ├── index.css                     # Tailwind directives & custom scrollbars
│   │   └── main.jsx                      # App root
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start: Running Locally

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Start the Backend API

Open a terminal and run:
```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:5000`:
- REST APIs: `http://localhost:5000/api/`
- Health check: `http://localhost:5000/api/health`

*(Note: If MongoDB is not yet running locally or configured in `.env`, the backend will automatically run in zero-crash memory mode with 8 pre-seeded artisanal cakes, default settings, and sample data!)*

### 2. Start the Frontend

Open a second terminal and run:
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**. You will see the Sweet Cake House website with the interactive 3D cake scene!

---

## 🔑 Default Admin Credentials

To access the Admin Portal:
1. Navigate to **`http://localhost:5173/admin/login`** (or click the shield icon in the navbar).
2. Use the credentials:
   - **Email:** `admin@sweetcakehouse.com`
   - **Password:** `Admin@123`

---

## 🍃 MongoDB Atlas Free Tier Configuration

Follow these steps to connect your free MongoDB Atlas database:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in (or create a free account).
2. Click **Create** and choose the **M0 Free** cluster (Shared, 512MB storage forever free).
3. Under **Security Quickstart**:
   - Create a database user (e.g., Username: `sweetcakeadmin`, Password: `YourSecurePassword123`).
   - Under **Network Access / IP Access List**, click **Add IP Address** and choose **Allow Access from Anywhere (`0.0.0.0/0`)** so your local machine and Render backend can connect.
4. Click **Connect** → **Drivers** (Node.js) and copy the connection string.
   It looks like:
   ```
   mongodb+srv://sweetcakeadmin:<password>@cluster0.abcde.mongodb.net/sweet_cake_house?retryWrites=true&w=majority
   ```
5. In `backend/.env`, replace `MONGODB_URI` with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://sweetcakeadmin:YourSecurePassword123@cluster0.abcde.mongodb.net/sweet_cake_house?retryWrites=true&w=majority
   ```
6. Run the database seed scripts:
   ```bash
   cd backend
   npm run seed
   npm run create-admin
   ```
   This will seed the 8 premium sample cakes, store settings, and admin user directly into MongoDB Atlas.

---

## 💳 How the Manual UPI Payment System Works

This website implements a manual UPI flow without any paid payment gateway:

1. **Bakery Admin Configuration**:
   - The bakery owner goes to **Admin → Bakery Settings**.
   - Enters their real **UPI ID** (e.g., `mybakery@okaxis` or `9876543210@paytm`) and **Account Holder Name**.
2. **Dynamic Checkout Generation**:
   - When a customer adds cakes to their cart and heads to checkout, the backend calculates the exact subtotal and delivery charge.
   - The checkout displays:
     - Real-time payable amount.
     - **Dynamic UPI QR Code** encoded with `upi://pay?pa=<UPI_ID>&pn=<HOLDER>&am=<AMOUNT>&tn=<ORDER_NO>&cu=INR`.
     - **Copy UPI ID** button with visual feedback.
     - Direct **"Tap to open installed UPI App"** link for mobile buyers.
3. **Customer Submits Reference**:
   - Customer pays using GPay / PhonePe / Paytm / BHIM.
   - Customer copies the **12-digit UTR / Reference number** from the payment confirmation and pastes it into the checkout form.
   - Optionally attaches a screenshot of the payment receipt.
4. **Zero-Trust Manual Verification**:
   - The order is created with `payment.status: "submitted"`.
   - The order is **never** automatically marked as paid based on customer input alone.
   - The bakery staff checks their UPI app/bank SMS for the matching UTR and amount.
   - The staff clicks **"Mark Verified"** in the Admin Dashboard, which automatically advances the order to **"Confirmed"** and queues it for baking.

---

## 📱 WhatsApp Order Integration

Once an order is created:
1. The customer is redirected to the **Order Confirmation Page** (`/order-success/:orderNumber`).
2. A prominent green **"Send Order on WhatsApp to Bakery"** button is displayed.
3. Clicking this button opens WhatsApp (Web or Mobile App) directly to the bakery's business number with a pre-filled message:
   ```text
   🎂 *NEW ORDER PLACED at SWEET CAKE HOUSE* 🎂

   📌 *Order Number:* SCH-20261031-4821
   👤 *Customer Name:* Rahul Sharma
   📞 *Phone:* 9876543210
   📍 *Delivery Address:* Flat 402, Rose Villa Arcade, Blossom City (400001)
   📅 *Delivery Date:* 2026-11-02
   ⏰ *Time Slot:* Evening (05:00 PM - 09:00 PM)

   🍰 *Ordered Items:*
   1. *Belgian Chocolate Truffle Cake* (1 kg) - Flavor: Dark Belgian Ganache
      Qty: 1 | ₹999
      Message on Cake: "Happy 25th Birthday Rhea!" (Eggless)

   💳 *Payment & Bill Summary:*
   - Subtotal: ₹999
   - Delivery Fee: ₹0
   - *Total Amount:* ₹999
   - Payment Method: UPI
   - Payment Status: SUBMITTED
   - UTR / Ref No: 430129849201

   Thank you for choosing Sweet Cake House! We are baking happiness for you. ❤️
   ```
4. The bakery business number is configurable at any time in **Admin → Bakery Settings**.

---

## 🧪 Testing the Complete Order Flow Step-by-Step

1. **Browse Cakes**:
   - Go to `http://localhost:5173/`
   - Interact with the 3D celebration cake by clicking and dragging your mouse/finger to rotate it!
   - Click **Explore Cakes** or select a category (e.g., *Chocolate Cakes*).
2. **Customize a Cake**:
   - Click on **Belgian Chocolate Truffle Cake**.
   - Switch between **0.5 kg**, **1 kg**, and **2 kg** — notice how the price updates in real-time.
   - Type a custom message (e.g., *"Happy Birthday Priya!"*).
   - Click **Add to Cart** or **Order Now**.
3. **Cart & Free Delivery**:
   - Open `/cart`. Notice the delivery threshold bar (Free delivery above ₹999).
   - Adjust quantity and verify calculations. Click **Proceed to Checkout**.
4. **Checkout & UPI**:
   - Fill in customer name, mobile number, delivery address, date, and time slot.
   - In the UPI section, review the dynamic QR code and copy the bakery UPI ID.
   - Enter a test 12-digit UTR (e.g., `987654321098`).
   - Click **Confirm & Place Order**.
5. **Confirmation & WhatsApp**:
   - You will see the confirmation screen with your unique reference number (`SCH-...`).
   - Click **Send Order on WhatsApp to Bakery** to preview the pre-formatted message.
6. **Admin Verification**:
   - In another tab, open `http://localhost:5173/admin/login` and log in.
   - On the Dashboard, notice the **Pending Verifications** alert.
   - Click on the order to open the **Inspect & Verify Modal**.
   - Check the customer's UTR number and click **✓ Mark Verified**.
   - Change status to **Preparing / Baking** or **Out for Delivery**.
7. **Customer Tracking**:
   - Go to `/track-order`, type the order reference number, and see the updated verified status!

---

## 🚀 Free Deployment Guide

### A. Deploy Backend to Render (Free)

1. Create a free account on [Render.com](https://render.com).
2. Push your project to GitHub.
3. In Render Dashboard, click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Set:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
6. Add the following **Environment Variables** in Render:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `JWT_SECRET`: your secret key (e.g. `super_secret_jwt_key_2026`)
   - `FRONTEND_URL`: your frontend Vercel URL
7. Click **Deploy Web Service**. Render will assign a public URL (e.g., `https://sweet-cake-house-api.onrender.com`).

---

### B. Deploy Frontend to Vercel (Free)

1. Create a free account on [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project** and import your GitHub repository.
3. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: your Render backend URL with `/api` (e.g., `https://sweet-cake-house-api.onrender.com/api`)
5. Click **Deploy**. Vercel will build and assign your live production URL (e.g., `https://sweet-cake-house.vercel.app`).
6. Update `FRONTEND_URL` in your Render backend settings to match your new Vercel domain.

---

## 🛡️ Security Best Practices

- **Zero Client Price Tampering**: Product prices and delivery calculations are calculated strictly on the backend. Any client-sent prices are validated against the database.
- **Passwords**: Hashed with `bcryptjs` using 10 salt rounds before saving.
- **JWT**: Cryptographically signed tokens with configurable expiration (7 days).
- **Rate Limiting**: `express-rate-limit` protects the public API against brute-force attacks and limits login attempts to 20 per 15 minutes.
- **HTTP Security Headers**: Enforced with `helmet` and strict CORS policies.
- **Input Sanitization**: All incoming customer strings and slugs are trimmed and sanitized.
- **Strict Manual Verification**: Payment screenshots or UTR strings never automatically grant "paid" status without bakery staff review.

---

## 📄 License

This project is licensed under the MIT License — free for commercial bakery usage and personal customization.

