# 🛒 Premium MERN E-Commerce Platform

 full-stack e-commerce solution built with the MERN stack, featuring a professional MVC architecture, secure Razorpay integration, and a sleek responsive UI.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based auth with role-based access control (Buyer/Seller).
- **🛍️ Comprehensive Catalog**: 10+ pre-seeded premium products across multiple categories.
- **💳 Seamless Payments**: Integrated with **Razorpay** (Test Mode supported).
- **📦 Reliable Order Flow**: "Pending-order-first" logic to ensure zero data loss during payment.
- **🔍 Advanced Search**: Full-text search and category filtering.
- **🎨 Modern UI**: Built with React and Tailwind CSS for a premium aesthetic.

---

## 🧪 Quick Start & Demo

To test the application immediately, use the following pre-configured accounts:

| Role | Email | Password | Features to Test |
| :--- | :--- | :--- | :--- |
| **Buyer** 👤 | `buyer@example.com` | `password123` | Browsing, Cart, Wishlist, Order History |
| **Seller** 🏪 | `seller@example.com` | `password123` | Dashboard, Product Management, Seller Profile |

> [!TIP]
> You can also register a new account and choose your role (Buyer/Seller) during registration.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, React Hot Toast
- **Backend**: Node.js, Express.js (MVC Architecture)
- **Database**: MongoDB (Mongoose)
- **Payments**: Razorpay SDK
- **Email**: Nodemailer (Gmail integration)

---

## 💻 Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas (or local instance)
- Razorpay Key ID & Secret

### 2. Implementation
```bash
# Clone the repository
git clone https://github.com/your-repo/ecommerce-mern.git
cd ecommerce-mern

# Install dependencies for both client and server
# From root using pnpm (if available)
pnpm install

# Alternatively, manual install
cd server && npm install
cd ../client && npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173
```

### 4. Database Seeding
Populate the database with premium demo products:
```bash
cd server
node seed.js
```

### 5. Running the App
```bash
# Run server (from server directory)
npm run dev

# Run client (from client directory)
npm run dev
```

---

## 📂 Project Structure

```text
ecommerce-mern/
├── server/
│   ├── src/
│   │   ├── controllers/  # Refactored MVC Logic
│   │   ├── models/       # Mongoose Data Schemas
│   │   ├── routes/       # API Route Definitions
│   │   ├── middleware/   # Authentication & Uploads
│   │   └── index.js      # Server Entry Point
│   └── seed.js           # DB Seeding Utility
└── client/
    ├── src/
    │   ├── pages/        # React Route Components
    │   ├── components/   # Modular UI Elements
    │   ├── context/      # Auth & Cart State Management
    │   └── lib/          # Utilities & API Config
```


---


