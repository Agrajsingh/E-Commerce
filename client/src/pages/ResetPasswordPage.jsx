import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-100 px-4">
      <div className="w-full max-w-md card shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Set New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">New Password</label>
            <input className="input" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}/>
          </div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
      </div>
    </div>
  );
}
