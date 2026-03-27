import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 px-4">
      <div className="w-full max-w-md card shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-2">Forgot Password</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Enter your email to get a reset link</p>
        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700">
            ✅ Check your inbox for the reset link. It expires in 10 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400"/>
              <input className="input pl-9" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required/>
            </div>
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
          </form>
        )}
        <p className="text-center text-sm text-gray-600 mt-4"><Link to="/login" className="text-primary-600 font-semibold">Back to Login</Link></p>
      </div>
    </div>
  );
}
