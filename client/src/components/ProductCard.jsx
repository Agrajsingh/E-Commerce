import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const image = product.images?.[0]?.url || 'https://placehold.co/400x400?text=No+Image';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/products/${product._id}`} className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500">({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
