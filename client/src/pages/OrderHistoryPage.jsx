import { useEffect, useState } from 'react';
import api from '../lib/axios';
import Loader from '../components/Loader';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><Loader/></div>;

  return (
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Package size={64} className="mx-auto text-gray-200 mb-4"/>
          <p className="font-semibold">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card">
              <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                <div>
                  <p className="text-xs text-gray-400 font-mono mb-1">{order._id}</p>
                  <p className="font-semibold text-gray-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge capitalize ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
                  {expanded === order._id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </div>
              </div>
              {expanded === order._id && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img src={item.image || 'https://placehold.co/48?text=P'} alt={item.name} className="w-12 h-12 rounded-lg object-cover"/>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                    <p className="font-semibold mb-1">Shipping Address</p>
                    <p>{order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
