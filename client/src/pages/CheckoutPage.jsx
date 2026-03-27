import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { MapPin, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || '',
    street: '', city: '', state: '', pincode: '', phone: '',
  });
  const [loading, setLoading] = useState(false);

  // Load Razorpay script
  function loadScript() {
    return new Promise((res) => {
      if (document.getElementById('rzp-script')) return res(true);
      const s = document.createElement('script');
      s.id = 'rzp-script';
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => res(true);
      s.onerror = () => res(false);
      document.body.appendChild(s);
    });
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');
    setLoading(true);

    try {
      const ok = await loadScript();
      if (!ok) { toast.error('Failed to load Razorpay'); setLoading(false); return; }

      // 1. Create Razorpay order
      const { data: rzpData } = await api.post('/payment/create-order', { amount: total });

      // 2. Open Razorpay checkout
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'ShopHub',
        description: 'Order Payment',
        order_id: rzpData.orderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: '#4f46e5' },
        handler: async (response) => {
          try {
            // 3. Create order in our DB
            const cartItems = items.map(i => ({ product: i._id, quantity: i.quantity }));
            const { data: order } = await api.post('/orders', {
              items: cartItems,
              shippingAddress: form,
              razorpayOrderId: response.razorpay_order_id,
            });

            // 4. Verify payment
            await api.post('/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order._id,
            });

            clearCart();
            navigate('/order-success', { state: { orderId: order._id } });
          } catch {
            toast.error('Payment verification failed');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
      setLoading(false);
    }
  }

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping form */}
        <div>
          <div className="card">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin size={18} className="text-primary-600"/> Shipping Address</h2>
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div><label className="label">Full Name</label><input className="input" value={form.fullName} onChange={f('fullName')} required/></div>
              <div><label className="label">Street / House No.</label><input className="input" placeholder="123 Main Street" value={form.street} onChange={f('street')} required/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">City</label><input className="input" value={form.city} onChange={f('city')} required/></div>
                <div><label className="label">State</label><input className="input" value={form.state} onChange={f('state')} required/></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Pincode</label><input className="input" value={form.pincode} onChange={f('pincode')} required/></div>
                <div><label className="label">Phone</label><input className="input" type="tel" value={form.phone} onChange={f('phone')} required/></div>
              </div>
            </form>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="card">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <img src={item.images?.[0]?.url || 'https://placehold.co/50?text=P'} alt={item.name} className="w-12 h-12 rounded-lg object-cover"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-1 mb-4">
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Delivery</span><span className="text-green-600">Free</span></div>
              <div className="flex justify-between font-bold text-gray-900 pt-1"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
            </div>
            <button form="checkout-form" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <CreditCard size={18}/> {loading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">🔒 Secured by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
}
