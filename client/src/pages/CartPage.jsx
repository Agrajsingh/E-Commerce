import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();

  if (items.length === 0) return (
    <div className="page-container text-center py-20">
      <ShoppingCart size={64} className="mx-auto text-gray-200 mb-4"/>
      <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some products to get started</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-3">
          {items.map(item => (
            <div key={item._id} className="card flex gap-4 items-center">
              <img src={item.images?.[0]?.url || 'https://placehold.co/80x80?text=Item'} alt={item.name} className="w-20 h-20 object-cover rounded-xl"/>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                <p className="text-primary-600 font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => updateQty(item._id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-50"><Minus size={14}/></button>
                <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                <button onClick={() => updateQty(item._id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-50"><Plus size={14}/></button>
              </div>
              <p className="font-bold w-24 text-right text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              <button onClick={() => removeItem(item._id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={18}/></button>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-red-500 hover:underline mt-2">Clear cart</button>
        </div>

        {/* Summary */}
        <div className="lg:w-72 shrink-0">
          <div className="card sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full text-center block">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
