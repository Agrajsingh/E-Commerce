import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import Loader from '../../components/Loader';
import { TrendingUp, Package, ShoppingBag, DollarSign } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/seller/dashboard').then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><Loader/></div>;

  const stats = [
    { label: 'Total Revenue', value: `₹${data.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'bg-green-50 text-green-700' },
    { label: 'Total Orders', value: data.totalOrders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-700' },
    { label: 'Products Listed', value: data.products, icon: Package, color: 'bg-purple-50 text-purple-700' },
    { label: 'Avg. Order Value', value: `₹${data.totalOrders ? Math.round(data.totalRevenue / data.totalOrders).toLocaleString('en-IN') : 0}`, icon: TrendingUp, color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22}/>
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card">
        <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
        {data.recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium">Order ID</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td className="py-2.5 font-mono text-xs text-gray-600">{order._id.slice(-8)}</td>
                    <td className="py-2.5 font-semibold">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td className="py-2.5"><span className={`badge ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span></td>
                    <td className="py-2.5 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
