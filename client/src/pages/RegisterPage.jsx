import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ShoppingBag, Store } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success(`Account created! Welcome, ${user.name}!`);
      navigate(user.role === 'seller' ? '/seller/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join ShopHub as a buyer or seller</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['buyer', 'seller'].map((r) => (
              <button key={r} type="button" onClick={() => setForm({...form, role: r})}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${ form.role === r ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {r === 'buyer' ? <ShoppingBag size={22}/> : <Store size={22}/>}
                <span className="text-sm font-semibold mt-1 capitalize">{r}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input className="input pl-9" placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input className="input pl-9" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/>
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-gray-400"/>
                <input className="input pl-9" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6}/>
              </div>
            </div>
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
