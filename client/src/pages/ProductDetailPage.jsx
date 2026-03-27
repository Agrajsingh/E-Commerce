import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user, isBuyer } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/reviews/${id}`),
    ]).then(([{ data: p }, { data: r }]) => {
      setProduct(p);
      setReviews(r);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-container"><Loader/></div>;
  if (!product) return <div className="page-container text-center py-20 text-gray-500">Product not found.</div>;

  const images = product.images?.length ? product.images : [{ url: 'https://placehold.co/600x600?text=No+Image' }];

  const handleAddToCart = () => { addItem(product, qty); toast.success('Added to cart!'); };

  const handleWishlist = async () => {
    if (!user) return toast.error('Login to use wishlist');
    try {
      const { data } = await api.post(`/wishlist/${id}`);
      setInWishlist(data.inWishlist);
      toast.success(data.inWishlist ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Error updating wishlist'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post(`/reviews/${id}`, reviewForm);
      setReviews(prev => [data, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div>
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
            <img src={images[imgIdx]?.url} alt={product.name} className="w-full h-full object-cover"/>
            {images.length > 1 && <>
              <button onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow"><ChevronLeft size={18}/></button>
              <button onClick={() => setImgIdx((imgIdx + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow"><ChevronRight size={18}/></button>
            </>}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === imgIdx ? 'border-primary-600' : 'border-transparent'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <span className="badge bg-primary-100 text-primary-700 mb-3">{product.category}</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.rating}/>
            <span className="text-sm text-gray-500">{product.numReviews} reviews</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mb-2">₹{product.price.toLocaleString('en-IN')}</p>
          <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          <p className="text-sm text-gray-500 mb-6">Sold by: <span className="font-semibold text-gray-700">{product.seller?.storeName || product.seller?.name}</span></p>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-50 font-bold">−</button>
              <span className="px-4 py-2 text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 hover:bg-gray-50 font-bold">+</button>
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex items-center gap-2 flex-1 justify-center">
              <ShoppingCart size={18}/> Add to Cart
            </button>
            <button onClick={handleWishlist} className={`p-2.5 border rounded-lg transition-colors ${inWishlist ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-300 hover:border-primary-400 text-gray-600'}`}>
              <Heart size={18} className={inWishlist ? 'fill-red-500' : ''}/>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12 border-t border-gray-100 pt-8">
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
        {isBuyer && (
          <form onSubmit={handleReview} className="card mb-6">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="mb-3">
              <label className="label">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button type="button" key={n} onClick={() => setReviewForm({...reviewForm, rating: n})}>
                    <Star size={24} className={n <= reviewForm.rating ? 'text-accent-500 fill-accent-500' : 'text-gray-300'}/>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="label">Comment</label>
              <textarea className="input min-h-[80px] resize-none" placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} required/>
            </div>
            <button className="btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
          </form>
        )}
        {reviews.length === 0 ? <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p> : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r._id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                      {r.buyer?.name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{r.buyer?.name}</p>
                      <StarRating rating={r.rating}/>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
