import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Store, Lock } from 'lucide-react';

export default function SellerProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    storeName: user?.storeName || '',
    storeDescription: user?.storeDescription || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  async function handleProfile(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data);
      toast.success('Store profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  }

  async function handlePassword(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', pwForm);
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Store Profile</h1>
      <div className="space-y-6">
        <div className="card">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Store size={18} className="text-primary-600"/> Store Information</h2>
          <form onSubmit={handleProfile} className="space-y-4">
            <div><label className="label">Your Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/></div>
            <div><label className="label">Store Name</label><input className="input" placeholder="My Awesome Store" value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})}/></div>
            <div><label className="label">Store Description</label><textarea className="input min-h-[80px] resize-none" placeholder="Tell customers about your store..." value={form.storeDescription} onChange={e => setForm({...form, storeDescription: e.target.value})}/></div>
            <div><label className="label">Email</label><input className="input bg-gray-50 text-gray-500 cursor-not-allowed" value={user?.email} disabled/></div>
            <button className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</button>
          </form>
        </div>
        <div className="card">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Lock size={18} className="text-primary-600"/> Change Password</h2>
          <form onSubmit={handlePassword} className="space-y-4">
            <div><label className="label">Current Password</label><input className="input" type="password" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required/></div>
            <div><label className="label">New Password</label><input className="input" type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required minLength={6}/></div>
            <button className="btn-primary" disabled={loading}>{loading ? 'Changing...' : 'Change Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
