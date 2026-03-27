import { Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Store className="text-primary-400" size={24}/>
              <span className="text-white text-lg font-bold">ShopHub</span>
            </div>
            <p className="text-sm text-gray-400">Your one-stop marketplace for buyers and sellers.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Clothing" className="hover:text-white transition-colors">Clothing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Sell</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register?role=seller" className="hover:text-white transition-colors">Become a Seller</Link></li>
              <li><Link to="/seller/dashboard" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ShopHub. All rights reserved. Payments secured by Razorpay.
        </div>
      </div>
    </footer>
  );
}
