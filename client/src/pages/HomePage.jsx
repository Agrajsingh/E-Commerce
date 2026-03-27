import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { ShoppingBag, Truck, Shield, Headphones, ArrowRight } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food'];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=8').then(({ data }) => setFeatured(data.products)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="badge bg-white/20 text-white mb-4">🛍️ New arrivals daily</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
              Shop Everything,<br/>
              <span className="text-accent-400">Anywhere.</span>
            </h1>
            <p className="text-primary-200 text-lg mb-8 max-w-md">Discover top products from verified sellers. Secure payments, fast delivery, hassle-free returns.</p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/products" className="btn-primary bg-white !text-primary-700 hover:bg-gray-100 flex items-center gap-2">
                Shop Now <ArrowRight size={16}/>
              </Link>
              <Link to="/register?role=seller" className="btn-secondary border-white/50 !text-white hover:bg-white/10">
                Become a Seller
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:flex justify-center">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 grid grid-cols-2 gap-4 w-80">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <Link key={cat} to={`/products?category=${cat}`} className="bg-white/10 hover:bg-white/20 rounded-2xl p-4 text-center transition-colors">
                  <span className="text-xs font-medium">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Free Delivery', sub: 'On orders over ₹499' },
            { icon: Shield, title: 'Secure Payment', sub: 'Razorpay encrypted' },
            { icon: ShoppingBag, title: 'Easy Returns', sub: '7-day return policy' },
            { icon: Headphones, title: '24/7 Support', sub: 'Always here to help' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center text-center p-4">
              <Icon className="text-primary-600 mb-2" size={28}/>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-gray-500">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="page-container">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat} to={`/products?category=${cat}`}
              className="bg-gradient-to-br from-primary-50 to-indigo-50 hover:from-primary-100 hover:to-indigo-100 border border-primary-100 rounded-2xl p-6 text-center font-semibold text-primary-700 transition-all hover:shadow-md">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-container pt-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-primary-600 font-semibold hover:underline flex items-center gap-1 text-sm">
            View all <ArrowRight size={14}/>
          </Link>
        </div>
        {loading ? <Loader/> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p._id} product={p}/>)}
          </div>
        )}
      </section>
    </div>
  );
}
