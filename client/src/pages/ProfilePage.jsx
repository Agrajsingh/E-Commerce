import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { User, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    },
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  async function handleProfile(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
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
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="space-y-6">
        {/* Profile info */}
        <div className="card">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><User size={18} className="text-primary-600"/> Personal Info</h2>
          <form onSubmit={handleProfile} className="space-y-4">
            <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/></div>
            <div><label className="label">Email</label><input className="input" value={user?.email} disabled className="input bg-gray-50 text-gray-500 cursor-not-allowed"/></div>
            <div>
              <label className="label">Address</label>
              <div className="grid grid-cols-2 gap-3">
                <input className="input col-span-2" placeholder="Street" value={form.address.street} onChange={e => setForm({...form, address: {...form.address, street: e.target.value}})}/>
                <input className="input" placeholder="City" value={form.address.city} onChange={e => setForm({...form, address: {...form.address, city: e.target.value}})}/>
                <input className="input" placeholder="State" value={form.address.state} onChange={e => setForm({...form, address: {...form.address, state: e.target.value}})}/>
                <input className="input" placeholder="Pincode" value={form.address.pincode} onChange={e => setForm({...form, address: {...form.address, pincode: e.target.value}})}/>
              </div>
            </div>
            <button className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>

        {/* Password */}
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
