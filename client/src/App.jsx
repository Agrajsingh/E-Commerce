import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import ProductFormPage from './pages/seller/ProductFormPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerProfilePage from './pages/seller/SellerProfilePage';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/products" element={<ProductCatalogPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />

            {/* Buyer */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<PrivateRoute role="buyer"><CheckoutPage /></PrivateRoute>} />
            <Route path="/order-success" element={<PrivateRoute role="buyer"><OrderSuccessPage /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute role="buyer"><OrderHistoryPage /></PrivateRoute>} />
            <Route path="/wishlist" element={<PrivateRoute role="buyer"><WishlistPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

            {/* Seller */}
            <Route path="/seller/dashboard" element={<PrivateRoute role="seller"><SellerDashboard /></PrivateRoute>} />
            <Route path="/seller/products" element={<PrivateRoute role="seller"><SellerProductsPage /></PrivateRoute>} />
            <Route path="/seller/products/new" element={<PrivateRoute role="seller"><ProductFormPage /></PrivateRoute>} />
            <Route path="/seller/products/:id/edit" element={<PrivateRoute role="seller"><ProductFormPage /></PrivateRoute>} />
            <Route path="/seller/orders" element={<PrivateRoute role="seller"><SellerOrdersPage /></PrivateRoute>} />
            <Route path="/seller/profile" element={<PrivateRoute role="seller"><SellerProfilePage /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
