import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, User, Menu, X, Package, LayoutDashboard, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isSeller } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Store className="text-primary-600" size={28} />
            <span className="text-xl font-bold text-primary-700">ShopHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/products" className="hover:text-primary-600 transition-colors">Browse</Link>
            {!user && <>
              <Link to="/login" className="hover:text-primary-600 transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </>}
            {user && !isSeller && (
              <>
                <Link to="/wishlist" className="hover:text-primary-600 transition-colors"><Heart size={18}/></Link>
                <Link to="/orders" className="hover:text-primary-600">Orders</Link>
                <Link to="/cart" className="relative hover:text-primary-600">
                  <ShoppingCart size={20}/>
                  {count > 0 && <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
                </Link>
              </>
            )}
            {isSeller && (
              <>
                <Link to="/seller/dashboard" className="hover:text-primary-600 flex items-center gap-1"><LayoutDashboard size={16}/> Dashboard</Link>
                <Link to="/seller/products" className="hover:text-primary-600 flex items-center gap-1"><Package size={16}/> Products</Link>
                <Link to="/seller/orders" className="hover:text-primary-600">Orders</Link>
              </>
            )}
            {user && (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 hover:text-primary-600">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-primary-700"/>
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link to={isSeller ? '/seller/profile' : '/profile'} onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                      <User size={14}/> Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                      <LogOut size={14}/> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/products" onClick={() => setMenuOpen(false)} className="py-1 hover:text-primary-600">Browse</Link>
          {!user && <>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="py-1">Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center">Sign Up</Link>
          </>}
          {user && !isSeller && <>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="py-1">Cart ({count})</Link>
            <Link to="/orders" onClick={() => setMenuOpen(false)} className="py-1">Orders</Link>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="py-1">Wishlist</Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)} className="py-1">Profile</Link>
          </>}
          {isSeller && <>
            <Link to="/seller/dashboard" onClick={() => setMenuOpen(false)} className="py-1">Dashboard</Link>
            <Link to="/seller/products" onClick={() => setMenuOpen(false)} className="py-1">Products</Link>
            <Link to="/seller/orders" onClick={() => setMenuOpen(false)} className="py-1">Orders</Link>
          </>}
          {user && <button onClick={handleLogout} className="py-1 text-red-600 text-left">Logout</button>}
        </div>
      )}
    </nav>
  );
}
