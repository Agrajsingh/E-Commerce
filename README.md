# MERN E-Commerce App

A full-stack, responsive E-Commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). 

## 🚀 Features

- **Authentication**: JWT-based user login, registration, and role-based access (buyer/seller). Password reset via Gmail integration.
- **Product Management**: Sellers can create, update, and manage products. Includes local image upload (using Multer).
- **Payments**: Integrated with **Razorpay** for secure checkout and payment processing.
- **Search & Filters**: Search products and filter by price/category. 
- **Cart & Orders**: Full shopping cart persistence and order tracking.

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Payments**: Razorpay SDK
- **File Storage**: Local filesystem (`multer`)

---

## 💻 Running the Project Locally

### 1️⃣ Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (with IP whitelisted)
- pnpm (or npm/yarn)

### 2️⃣ Clone and Install Dependencies

Install dependencies for both frontend and backend from the root directory:
```bash
# In the root, client, and server directories
pnpm install
```

### 3️⃣ Environment Variables

You need to set up your `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Razorpay credentials for payment gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Gmail credentials for sending password reset emails
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:5173
```

### 4️⃣ Start the Development Servers

**Run Backend (Server):**
```bash
cd server
pnpm run dev
```
*(Server will run on `http://localhost:5000`)*

**Run Frontend (Client):**
```bash
cd client
pnpm dev
```
*(Client will run on `http://localhost:5173`)*

---

## 🎨 Project Structure

```text
ecommerce-mern/
├── client/           # React frontend application
├── server/           # Node/Express backend application
│   ├── src/
│   │   ├── models/   # Mongoose Database Models
│   │   ├── routes/   # Express API Routes
│   │   └── index.js  # Main Server Entry
│   ├── uploads/      # Locally stored product images
│   └── .env          # Backend environment variables
```
