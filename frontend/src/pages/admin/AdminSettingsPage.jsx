import React, { useState } from 'react';
import { Settings, Save, Check, QrCode, Phone, MessageCircle, Truck, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { updateSettings, updateAdminCredentials } from '../../services/api';

const AdminSettingsPage = () => {
  const { settings, reloadSettings } = useSettings();
  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Password change state
  const [credData, setCredData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
  });
  const [credSaving, setCredSaving] = useState(false);
  const [credSuccess, setCredSuccess] = useState('');
  const [credError, setCredError] = useState('');

  const handleCredSubmit = async (e) => {
    e.preventDefault();
    setCredSaving(true);
    setCredSuccess('');
    setCredError('');

    try {
      const res = await updateAdminCredentials(credData);
      setCredSuccess(res.data?.message || 'Admin login credentials updated successfully!');
      setCredData({ email: '', currentPassword: '', newPassword: '' });
      setTimeout(() => setCredSuccess(''), 4000);
    } catch (err) {
      setCredError(
        err.response?.data?.message || err.message || 'Failed to update credentials. Please check your current password.'
      );
    } finally {
      setCredSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateSettings(formData);
      setSuccessMsg('Bakery configuration saved successfully!');
      reloadSettings();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-choco-900">
          Bakery & UPI Payment Settings
        </h1>
        <p className="text-xs text-choco-500 mt-1">
          Manage your bakery branding, UPI receiving account, WhatsApp number, and delivery fees
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* UPI Payment Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rosebakery-100 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-choco-900 pb-2 border-b border-rosebakery-100 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-rosebakery-500" />
            <span>1. UPI Receiving Payment Configuration</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-choco-900 mb-1">
                UPI ID (VPA) <span className="text-rosebakery-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.upiId || ''}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="e.g. sweetcakehouse@upi or 9876543210@paytm"
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 font-mono text-sm outline-none"
              />
              <p className="text-[10px] text-choco-400 mt-1">
                All customer UPI payments and QR codes are generated directly to this VPA.
              </p>
            </div>

            <div>
              <label className="block font-bold text-choco-900 mb-1">
                UPI Account Holder Name <span className="text-rosebakery-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.upiHolderName || ''}
                onChange={(e) => setFormData({ ...formData, upiHolderName: e.target.value })}
                placeholder="e.g. Sweet Cake House Bakery"
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-choco-900 mb-1">
              Custom UPI QR Image URL (Optional)
            </label>
            <input
              type="text"
              value={formData.upiQrImage || ''}
              onChange={(e) => setFormData({ ...formData, upiQrImage: e.target.value })}
              placeholder="Leave empty to use automatic dynamic amount QR generation"
              className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-xs outline-none"
            />
          </div>
        </div>

        {/* WhatsApp & Contact Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rosebakery-100 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-choco-900 pb-2 border-b border-rosebakery-100 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>2. WhatsApp Order Notification & Store Info</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-choco-900 mb-1">
                WhatsApp Business Number <span className="text-rosebakery-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="e.g. 919876543210 (digits only with country code)"
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 font-mono text-sm outline-none"
              />
              <p className="text-[10px] text-choco-400 mt-1">
                Customer "Send Order on WhatsApp" button opens directly to this number.
              </p>
            </div>

            <div>
              <label className="block font-bold text-choco-900 mb-1">Store Display Phone</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-choco-900 mb-1">Shop Name</label>
              <input
                type="text"
                value={formData.shopName || ''}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-choco-900 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-choco-900 mb-1">Physical Address</label>
              <input
                type="text"
                value={formData.shopAddress || ''}
                onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-choco-900 mb-1">City</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delivery Charges & Rules */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rosebakery-100 shadow-soft space-y-4">
          <h3 className="font-serif text-lg font-bold text-choco-900 pb-2 border-b border-rosebakery-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" />
            <span>3. Delivery Charges & Thresholds</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-choco-900 mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.deliveryCharge || 0}
                onChange={(e) => setFormData({ ...formData, deliveryCharge: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-choco-900 mb-1">
                FREE Delivery Above (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.freeDeliveryAbove || 0}
                onChange={(e) =>
                  setFormData({ ...formData, freeDeliveryAbove: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-choco-900 mb-1">Minimum Order Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.minOrderAmount || 0}
                onChange={(e) =>
                  setFormData({ ...formData, minOrderAmount: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-choco-900 mb-1">Business Operating Hours</label>
            <input
              type="text"
              value={formData.businessHours || ''}
              onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
              placeholder="09:00 AM - 10:30 PM (Daily)"
              className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>

      {/* 4. Security & Admin Credentials */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rosebakery-100 shadow-soft space-y-4 text-xs">
        <h3 className="font-serif text-lg font-bold text-choco-900 pb-2 border-b border-rosebakery-100 flex items-center gap-2">
          <Key className="w-5 h-5 text-rosebakery-500" />
          <span>4. Change Admin Login & Password</span>
        </h3>
        <p className="text-choco-500 text-[11px]">
          Keep your management portal safe. You can update your admin email and password anytime here.
        </p>

        {credSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{credSuccess}</span>
          </div>
        )}

        {credError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{credError}</span>
          </div>
        )}

        <form onSubmit={handleCredSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block font-bold text-choco-900 mb-1">New Admin Email (Optional)</label>
            <input
              type="email"
              value={credData.email}
              onChange={(e) => setCredData({ ...credData, email: e.target.value })}
              placeholder="e.g. yourname@sweetcakehouse.com"
              className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-choco-900 mb-1">Current Password</label>
              <input
                type="password"
                value={credData.currentPassword}
                onChange={(e) => setCredData({ ...credData, currentPassword: e.target.value })}
                placeholder="Current password"
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-choco-900 mb-1">New Password</label>
              <input
                type="password"
                value={credData.newPassword}
                onChange={(e) => setCredData({ ...credData, newPassword: e.target.value })}
                placeholder="New strong password"
                className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={credSaving || (!credData.email && !credData.newPassword)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-choco-900 hover:bg-choco-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{credSaving ? 'Updating...' : 'Update Password / Email'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

