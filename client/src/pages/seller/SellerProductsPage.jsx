import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/seller/products').then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(p => p.filter(x => x._id !== id));
      toast.success('Product deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="page-container"><Loader/></div>;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link to="/seller/products/new" className="btn-primary flex items-center gap-2"><Plus size={16}/> Add Product</Link>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Package size={64} className="mx-auto text-gray-200 mb-4"/>
          <p className="font-semibold">No products yet</p>
          <Link to="/seller/products/new" className="btn-primary mt-4 inline-flex items-center gap-2"><Plus size={16}/> Add Your First Product</Link>
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]?.url || 'https://placehold.co/40?text=P'} alt={p.name} className="w-10 h-10 rounded-lg object-cover"/>
                      <span className="font-medium truncate max-w-[180px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock > 0 ? 'text-green-600' : 'text-red-500'}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/seller/products/${p._id}/edit`} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg"><Pencil size={15}/></Link>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
