import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { createOrder } from '../services/api';
import OrderSummary from '../components/checkout/OrderSummary';
import UpiPaymentSection from '../components/checkout/UpiPaymentSection';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, subtotal, deliveryCharge, totalAmount, clearCart } = useCart();
  const { settings } = useSettings();
  const { t } = useLanguage();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    email: '',
    address: '',
    landmark: '',
    city: settings.city || 'Mumbai',
    pincode: '',
  });

  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(
    settings.availableTimeSlots && settings.availableTimeSlots[0]
      ? settings.availableTimeSlots[0]
      : 'Morning (09:00 AM - 01:00 PM)'
  );
  const [orderNotes, setOrderNotes] = useState('');

  // UPI payment fields
  const [utr, setUtr] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-choco-900">
          {t('cart.emptyTitle', 'Your Cart is Empty')}
        </h2>
        <p className="text-sm text-choco-500">
          {t('cart.emptySubtitle', 'Please add cakes to your cart before proceeding.')}
        </p>
        <button
          onClick={() => navigate('/cakes')}
          className="px-6 py-2.5 rounded-full bg-rosebakery-500 text-white text-xs font-bold"
        >
          {t('cart.browseBtn', 'Browse Cakes')}
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customer.name || !customer.phone || !customer.address) {
      setErrorMsg('Please enter your full name, mobile number, and delivery address.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!deliveryDate || !deliveryTimeSlot) {
      setErrorMsg('Please select your preferred delivery date and delivery time slot.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!utr.trim()) {
      setErrorMsg(
        'Please enter the 12-digit UPI UTR / Transaction Reference Number to confirm your payment.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customer,
        items: cart.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          weight: item.weight,
          flavor: item.flavor,
          price: item.price,
          quantity: item.quantity,
          isEggless: item.isEggless,
          cakeMessage: item.cakeMessage,
        })),
        deliveryDate,
        deliveryTimeSlot,
        orderNotes,
        payment: {
          method: 'UPI',
          utr: utr.trim(),
          screenshotUrl,
        },
      };

      const res = await createOrder(orderPayload);
      if (res.data && res.data.order) {
        clearCart();
        navigate(`/order-success/${res.data.order.orderNumber}`);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Checkout Title */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-choco-900">
          {t('checkout.title', 'Complete Your Cake Order')}
        </h1>
        <p className="text-xs text-choco-500">
          {t('checkout.subtitle', 'Safe, seamless checkout with direct UPI payment confirmation.')}
        </p>
      </div>

      {errorMsg && (
        <div className="max-w-3xl mx-auto p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Delivery details & UPI Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Information */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-rosebakery-100 shadow-soft space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-rosebakery-100">
                <div className="w-10 h-10 rounded-2xl bg-rosebakery-50 text-rosebakery-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-choco-900">
                    {t('checkout.contactDetails', '1. Contact & Recipient Details')}
                  </h3>
                  <p className="text-xs text-choco-500">Who should we deliver the cake to?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-choco-900 mb-1">
                    {t('customCake.fullName', 'Recipient Full Name')} <span className="text-rosebakery-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-choco-900 mb-1">
                    {t('customCake.phone', 'Mobile Number')} <span className="text-rosebakery-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-choco-900 mb-1">
                    Alternate Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9123456780"
                    value={customer.alternatePhone}
                    onChange={(e) => setCustomer({ ...customer, alternatePhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-choco-900 mb-1">
                    {t('customCake.email', 'Email Address (Optional)')}
                  </label>
                  <input
                    type="email"
                    placeholder="rahul@example.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address & Scheduling */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-rosebakery-100 shadow-soft space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-rosebakery-100">
                <div className="w-10 h-10 rounded-2xl bg-rosebakery-50 text-rosebakery-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-choco-900">
                    {t('checkout.deliverySchedule', '2. Delivery Address & Scheduling')}
                  </h3>
                  <p className="text-xs text-choco-500">Where and when should we deliver?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-choco-900 mb-1">
                    {t('customCake.address', 'Complete Street Address')} <span className="text-rosebakery-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Flat/House No, Floor, Building Name, Society, Street..."
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-choco-900 mb-1">
                      {t('customCake.landmark', 'Landmark')}
                    </label>
                    <input
                      type="text"
                      placeholder="Near Green Park"
                      value={customer.landmark}
                      onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-choco-900 mb-1">City</label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-choco-900 mb-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="400001"
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-choco-900 mb-1">
                      {t('customCake.deliveryDate', 'Delivery Date')} <span className="text-rosebakery-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-choco-900 mb-1">
                      {t('customCake.deliveryTimeSlot', 'Delivery Time Slot')} <span className="text-rosebakery-500">*</span>
                    </label>
                    <select
                      value={deliveryTimeSlot}
                      onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                    >
                      {settings.availableTimeSlots &&
                        settings.availableTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-choco-900 mb-1">
                    Special Delivery Instructions / Gate Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ring the doorbell twice, please call on arrival"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 3. Manual UPI Payment */}
            <UpiPaymentSection
              totalAmount={totalAmount}
              utr={utr}
              setUtr={setUtr}
              screenshotUrl={screenshotUrl}
              setScreenshotUrl={setScreenshotUrl}
            />

            {/* Place Order CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {submitting
                    ? 'Placing Order...'
                    : `${t('checkout.placeOrderBtn', 'Confirm & Place Order')} (₹${totalAmount})`}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <p className="text-center text-[11px] text-choco-400 mt-2">
                🔒 {t('checkout.secureNote', 'Manual UPI Payment • Direct Verification • Express Delivery')}
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 sticky top-28">
            <OrderSummary
              items={cart}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
