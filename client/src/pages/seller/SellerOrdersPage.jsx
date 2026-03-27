import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/seller/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? data : o));
      toast.success('Order status updated');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="page-container"><Loader/></div>;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs font-mono text-gray-400">{order._id}</p>
                  <p className="font-semibold text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  <p className="text-sm text-gray-500">{order.buyer?.name} · {order.buyer?.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${STATUS_COLORS[order.orderStatus]} capitalize`}>{order.orderStatus}</span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex flex-wrap gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">
                      <img src={item.image || 'https://placehold.co/28?text=P'} alt={item.name} className="w-7 h-7 rounded object-cover"/>
                      <span>{item.name}</span>
                      <span className="text-gray-400">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
