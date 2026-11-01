import React, { useState } from 'react';
import { Search, Cake, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const TrackOrderPage = () => {
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetchOrderById(orderQuery.trim());
      if (res.data && res.data.order) {
        navigate(`/order-success/${res.data.order.orderNumber}`);
      }
    } catch {
      setErrorMsg(
        'We could not find an order matching that reference or phone. Please verify and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-rosebakery-50 text-rosebakery-600 mx-auto flex items-center justify-center">
          <Cake className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-choco-900">
          {t('trackOrder.title', 'Track Your Cake Delivery')}
        </h1>
        <p className="text-xs text-choco-500 max-w-sm mx-auto">
          {t(
            'trackOrder.subtitle',
            'Enter your 6-character Order Number or mobile number to check the real-time baking & delivery status.'
          )}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rosebakery-100 shadow-soft space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-choco-900 mb-1.5">
              Order Reference Number
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-choco-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder={t('trackOrder.placeholder', 'e.g. SCH-20261031-1234')}
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Searching...' : t('trackOrder.trackBtn', 'Track Cake Status')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackOrderPage;
