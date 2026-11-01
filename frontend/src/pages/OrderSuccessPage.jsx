import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  MessageCircle,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { fetchOrderById } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const { t } = useLanguage();
  const [orderData, setOrderData] = useState(null);
  const [whatsappInfo, setWhatsappInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetchOrderById(orderNumber);
        if (res.data && res.data.order) {
          setOrderData(res.data.order);
          setWhatsappInfo(res.data.whatsapp);
        }
      } catch (err) {
        console.warn('Failed to load order success data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-rosebakery-200 border-t-rosebakery-500 animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-choco-500 font-medium">Baking your order summary...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-choco-900">Order Not Found</h2>
        <p className="text-sm text-choco-500">
          We could not find an order matching reference #{orderNumber}.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rosebakery-500 text-white text-xs font-bold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const orderStatuses = [
    { key: 'pending', label: t('trackOrder.statusReceived', 'Order Received') },
    { key: 'confirmed', label: t('trackOrder.statusConfirmed', 'Confirmed & Verified') },
    { key: 'preparing', label: t('trackOrder.statusBaking', 'Baking Fresh') },
    { key: 'out_for_delivery', label: t('trackOrder.statusOutForDelivery', 'Out for Delivery') },
    { key: 'delivered', label: t('trackOrder.statusDelivered', 'Delivered') },
  ];

  const currentStatusIndex = orderStatuses.findIndex((s) => s.key === orderData.orderStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rosebakery-100 shadow-soft text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t('orderSuccess.title', 'Order Successfully Placed')}
          </span>
          <h1 className="font-serif fluid-section-title font-bold text-choco-900 pt-2">
            Thank You, {orderData.customer?.name}!
          </h1>
          <p className="text-sm text-choco-600">
            {t('orderSuccess.subtitle', 'Your cake order has been recorded in our bakery system.')}
          </p>
        </div>

        <div className="p-3 bg-cream-100/70 rounded-2xl border border-cream-200 max-w-sm mx-auto">
          <span className="text-xs text-choco-500 block">
            {t('orderSuccess.orderNumber', 'Your Order Reference Number')}
          </span>
          <span className="font-mono text-lg font-black text-rosebakery-600 tracking-wider">
            {orderData.orderNumber}
          </span>
        </div>

        {/* PROMINENT WHATSAPP SEND BUTTON */}
        {whatsappInfo && whatsappInfo.url && (
          <div className="pt-2">
            <a
              href={whatsappInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Send Order on WhatsApp to Bakery</span>
            </a>
            <p className="text-[11px] text-choco-400 mt-2">
              Opens WhatsApp with pre-filled order details to expedite verification & delivery tracking.
            </p>
          </div>
        )}
      </div>

      {/* Payment & Order Status Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-rosebakery-100 shadow-soft space-y-2">
          <span className="text-xs text-choco-400 font-medium">Payment Verification</span>
          <div className="flex items-center gap-2">
            {orderData.payment?.status === 'verified' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Payment Verified by Bakery
              </span>
            ) : orderData.payment?.status === 'rejected' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Payment Rejected (Contact Us)
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Submitted — Verification Pending
              </span>
            )}
          </div>
          {orderData.payment?.utr && (
            <p className="text-xs text-choco-600 font-mono">
              UTR Ref: <strong>{orderData.payment.utr}</strong>
            </p>
          )}
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rosebakery-100 shadow-soft space-y-2">
          <span className="text-xs text-choco-400 font-medium">Delivery Slot</span>
          <div className="text-sm font-bold text-choco-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-rosebakery-500" />
            <span>{orderData.deliveryDate}</span>
          </div>
          <div className="text-xs text-choco-600 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-choco-400" />
            <span>{orderData.deliveryTimeSlot}</span>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rosebakery-100 shadow-soft space-y-4">
        <h3 className="font-serif text-lg font-bold text-choco-900 pb-2 border-b border-rosebakery-100">
          Order Status Tracker
        </h3>
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
          {orderStatuses.map((st, idx) => {
            const isCompleted = currentStatusIndex >= idx;
            const isCurrent = currentStatusIndex === idx;
            return (
              <div key={st.key} className="flex sm:flex-col items-center gap-2 sm:text-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-rosebakery-500 text-white ring-4 ring-rosebakery-100 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-cream-200 text-choco-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-xs ${
                    isCurrent
                      ? 'font-bold text-rosebakery-600'
                      : isCompleted
                      ? 'font-semibold text-choco-900'
                      : 'text-choco-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Shopping button */}
      <div className="text-center pt-4">
        <Link
          to="/cakes"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-sm shadow-md transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t('orderSuccess.continueShopping', 'Continue Shopping')}</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
