import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  return (
    <div className="page-container text-center py-20">
      <CheckCircle size={80} className="mx-auto text-green-500 mb-6"/>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h1>
      <p className="text-gray-500 mb-2">Thank you for your purchase. Your order is being processed.</p>
      {state?.orderId && <p className="text-sm text-gray-400 mb-8">Order ID: <span className="font-mono font-semibold">{state.orderId}</span></p>}
      <div className="flex justify-center gap-4">
        <Link to="/orders" className="btn-primary">View My Orders</Link>
        <Link to="/products" className="btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
}
