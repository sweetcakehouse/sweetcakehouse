import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cake, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rosebakery-100 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-rosebakery-500 text-white mx-auto flex items-center justify-center shadow-md shadow-rosebakery-500/20">
            <Cake className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-choco-900">
            {settings.shopName || 'Sweet Cake House'}
          </h1>
          <p className="text-xs text-choco-500">Staff & Management Portal</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-choco-900 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-choco-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-choco-900 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-choco-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs font-medium text-choco-400 hover:text-rosebakery-600 transition-colors"
          >
            ← Back to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
