import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(user.role === 'seller' ? '/seller/dashboard' : '/');
  }, [user, navigate]);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'seller' ? '/seller/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          <div className="text-center mb-8">
            <LogIn className="mx-auto text-primary-600 mb-3" size={40}/>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your ShopHub account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <input className="input pl-9" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required/>
              </div>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">Forgot password?</Link>
            </div>
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
