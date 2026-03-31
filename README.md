# 🛒 Premium MERN E-Commerce Platform

A state-of-the-art, full-stack e-commerce solution built with the MERN stack, featuring a professional MVC architecture, secure Razorpay integration, and a sleek responsive UI.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based auth with role-based access control (Buyer/Seller).
- **🛍️ Comprehensive Catalog**: 10+ pre-seeded premium products across multiple categories.
- **💳 Seamless Payments**: Integrated with **Razorpay** (Test Mode supported).
- **📦 Reliable Order Flow**: "Pending-order-first" logic to ensure zero data loss during payment.
- **🔍 Advanced Search**: Full-text search and category filtering.
- **🎨 Modern UI**: Built with React and Tailwind CSS for a premium aesthetic.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js (MVC Pattern)
- **Database**: MongoDB (Mongoose)
- **Payments**: Razorpay SDK
- **Email**: Nodemailer (Gmail integration)

---

## 🧪 Demo Credentials

To test the application immediately, use the following accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Buyer** | `buyer@example.com` | `password123` |
| **Seller** | `seller@example.com` | `password123` |

*Note: You can also register a new account and choose your role.*

---

## 💻 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas (or local instance)
- Razorpay Key ID & Secret

### 2. Installation
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173
```

### 4. Seed the Database
Populate the application with premium demo products:
```bash
cd server
node seed.js
```

### 5. Run the Application
```bash
# In server directory
npm run dev

# In client directory
npm run dev
```

---

## 📂 Project Structure (MVC)

```text
ecommerce-mern/
├── server/
│   ├── src/
│   │   ├── controllers/  # Business logic (Refactored)
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express route definitions
│   │   ├── middleware/   # Auth, Upload, Error handling
│   │   └── index.js      # Entry point
│   └── seed.js           # Database seeding utility
└── client/
    ├── src/
    │   ├── pages/        # React page components
    │   ├── components/   # Reusable UI elements
    │   └── context/      # State management (Auth, Cart)
```
