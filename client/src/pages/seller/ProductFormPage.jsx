import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Other'];

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then(({ data }) => {
        setForm({ name: data.name, description: data.description, price: data.price, category: data.category, stock: data.stock });
        setExistingImages(data.images || []);
      }).finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
    setPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
  };

  const removeNewFile = (i) => {
    setFiles(f => f.filter((_, idx) => idx !== i));
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('images', f));

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEdit) {
        await api.put(`/products/${id}`, fd, config);
        toast.success('Product updated!');
      } else {
        await api.post('/products', fd, config);
        toast.success('Product created!');
      }
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally { setLoading(false); }
  }

  if (fetching) return <div className="page-container"><div className="animate-pulse h-8 bg-gray-100 rounded w-48 mb-6"/></div>;

  return (
    <div className="page-container max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div><label className="label">Product Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/></div>
        <div><label className="label">Description</label><textarea className="input min-h-[100px] resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required/></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Price (₹)</label><input className="input" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required/></div>
          <div><label className="label">Stock</label><input className="input" type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required/></div>
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
            <option value="">Select Category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div>
            <label className="label">Current Images</label>
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img) => (
                <div key={img.public_id} className="relative w-20 h-20">
                  <img src={img.url} alt="" className="w-full h-full object-cover rounded-lg"/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New images */}
        <div>
          <label className="label">{isEdit ? 'Add More Images' : 'Product Images'}</label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primary-400 transition-colors">
            <Upload size={28} className="text-gray-400 mb-2"/>
            <span className="text-sm text-gray-500">Click to upload images (max 5MB each)</span>
            <input type="file" accept="image/*" multiple onChange={handleFiles} className="sr-only"/>
          </label>
          {previews.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={src} alt="" className="w-full h-full object-cover rounded-lg"/>
                  <button type="button" onClick={() => removeNewFile(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/seller/products')} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</button>
        </div>
      </form>
    </div>
  );
}
