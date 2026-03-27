import { useEffect, useState } from 'react';
import api from '../lib/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/wishlist').then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><Loader/></div>;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Heart className="text-red-500" size={24}/> My Wishlist</h1>
      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Heart size={64} className="mx-auto text-gray-200 mb-4"/>
          <p className="font-semibold">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p._id} product={p}/>)}
        </div>
      )}
    </div>
  );
}
