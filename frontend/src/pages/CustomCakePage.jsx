import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Upload,
  Clock,
  Cake,
  AlertCircle,
} from 'lucide-react';
import { createOrder, uploadImage } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

const CustomCakePage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    cakeName: '',
    flavor: 'Belgian Chocolate Ganache',
    weight: '1 kg',
    shape: 'Round',
    cakeMessage: '',
    specialInstructions: '',
    referenceImage: '',
    deliveryDate: '',
    deliveryTimeSlot: 'Evening (05:00 PM - 09:00 PM)',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    landmark: '',
    city: settings.city || 'Mumbai',
    utr: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const shapes = ['Round', 'Heart', 'Square', 'Tiered / Multi-tier', 'Number / Letter', 'Custom Theme'];
  const flavors = [
    'Belgian Chocolate Ganache',
    'Dutch Truffle',
    'Red Velvet Cream Cheese',
    'Madagascar Vanilla Bean',
    'Golden Butterscotch Praline',
    'Wild Blueberry Cheesecake',
    'Fresh Pineapple Delight',
  ];
  const weights = ['1 kg', '1.5 kg', '2 kg', '3 kg', '5 kg'];

  // Calculate dynamic estimated price
  const weightMultiplier = parseFloat(formData.weight) || 1;
  const estimatedBasePrice = Math.round(weightMultiplier * 950);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName || !formData.customerPhone || !formData.deliveryAddress) {
      setErrorMsg('Please fill in your name, mobile number, and delivery address.');
      return;
    }

    if (!formData.deliveryDate || !formData.deliveryTimeSlot) {
      setErrorMsg('Please select your preferred delivery date and time slot.');
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = formData.referenceImage;

      // If a local image file was chosen, upload it or send dataURL
      if (imageFile) {
        try {
          const uploadRes = await uploadImage(imageFile);
          if (uploadRes.data && uploadRes.data.url) {
            finalImageUrl = uploadRes.data.url;
          }
        } catch {
          finalImageUrl = imagePreview; // fallback to base64 preview
        }
      }

      const orderPayload = {
        customer: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail,
          address: formData.deliveryAddress,
          landmark: formData.landmark,
          city: formData.city,
        },
        items: [],
        customCake: {
          isCustom: true,
          cakeName: formData.cakeName || 'Custom Celebration Cake',
          flavor: formData.flavor,
          weight: formData.weight,
          shape: formData.shape,
          cakeMessage: formData.cakeMessage,
          specialInstructions: formData.specialInstructions,
          referenceImage: finalImageUrl,
        },
        deliveryDate: formData.deliveryDate,
        deliveryTimeSlot: formData.deliveryTimeSlot,
        orderNotes: formData.specialInstructions,
        payment: {
          method: 'UPI',
          utr: formData.utr,
          screenshotUrl: finalImageUrl,
        },
      };

      const res = await createOrder(orderPayload);
      if (res.data && res.data.order) {
        navigate(`/order-success/${res.data.order.orderNumber}`);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Failed to submit custom cake order.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosebakery-50 text-rosebakery-600 text-xs font-bold border border-rosebakery-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('customCake.badge', 'Bespoke Pastry Craftsmanship')}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-choco-900">
          {t('customCake.pageTitle', 'Design Your Custom Dream Cake')}
        </h1>
        <p className="text-sm text-choco-600 max-w-xl mx-auto">
          {t(
            'customCake.pageSubtitle',
            'Tell us about your celebration theme, select custom flavors & shapes, upload reference photos, and our master pastry artists will create it!'
          )}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Cake Design Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-rosebakery-100 shadow-soft space-y-6">
          <h3 className="font-serif text-xl font-bold text-choco-900 border-b border-rosebakery-100 pb-3 flex items-center gap-2">
            <Cake className="w-5 h-5 text-rosebakery-500" />
            <span>{t('customCake.step1', '1. Cake Design & Flavors')}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.cakeName', 'Theme / Cake Name')} <span className="text-rosebakery-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={t('customCake.cakeNamePlaceholder', 'e.g. 1st Birthday Jungle Safari / Floral Tiered')}
                value={formData.cakeName}
                onChange={(e) => setFormData({ ...formData, cakeName: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm bg-cream-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.flavor', 'Base Flavor')}
              </label>
              <select
                value={formData.flavor}
                onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm bg-white"
              >
                {flavors.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shape and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.shape', 'Cake Shape')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {shapes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, shape: s })}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.shape === s
                        ? 'border-rosebakery-500 bg-rosebakery-50 text-rosebakery-700 shadow-xs'
                        : 'border-rosebakery-100 bg-white text-choco-700 hover:border-rosebakery-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.weight', 'Cake Weight')}
              </label>
              <div className="flex flex-wrap gap-2">
                {weights.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setFormData({ ...formData, weight: w })}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      formData.weight === w
                        ? 'border-rosebakery-500 bg-rosebakery-50 text-rosebakery-700 font-bold shadow-xs'
                        : 'border-rosebakery-100 bg-white text-choco-700 hover:border-rosebakery-200'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-choco-500 mt-2">
                Estimated base price: <strong className="text-rosebakery-600">₹{estimatedBasePrice}</strong>{' '}
                <span className="text-choco-400">({t('customCake.estPriceNotice', 'Final quote verified based on design complexity')})</span>
              </p>
            </div>
          </div>

          {/* Inscription & Special Instructions */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.messageOnCake', 'Message / Inscription on Cake')}
              </label>
              <input
                type="text"
                placeholder={t('customCake.messagePlaceholder', 'e.g. Happy 1st Birthday Prince Aarav!')}
                value={formData.cakeMessage}
                onChange={(e) => setFormData({ ...formData, cakeMessage: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.specialNotes', 'Design Notes & Special Instructions')}
              </label>
              <textarea
                rows={3}
                placeholder={t('customCake.specialNotesPlaceholder', 'Describe color palette, fondant figures, allergies, or delivery preferences...')}
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
              ></textarea>
            </div>

            {/* Reference Image Upload */}
            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.uploadPhoto', 'Upload Reference Image (Pinterest, Instagram or photo)')}
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed border-rosebakery-300 bg-rosebakery-50/50 hover:bg-rosebakery-100/50 text-xs font-bold text-rosebakery-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Choose Photo File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <div className="text-xs text-choco-400">or enter image URL below</div>

                <input
                  type="url"
                  placeholder="https://...image-url.jpg"
                  value={formData.referenceImage}
                  onChange={(e) => {
                    setFormData({ ...formData, referenceImage: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-rosebakery-100 text-xs outline-none"
                />
              </div>

              {imagePreview && (
                <div className="mt-3 w-32 h-32 rounded-2xl overflow-hidden border border-rosebakery-200">
                  <img src={imagePreview} alt="Reference" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Delivery Slot & Customer Contact */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-rosebakery-100 shadow-soft space-y-6">
          <h3 className="font-serif text-xl font-bold text-choco-900 border-b border-rosebakery-100 pb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-rosebakery-500" />
            <span>{t('customCake.step2', '2. Delivery Slot & Contact Details')}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.deliveryDate', 'Delivery Date')} <span className="text-rosebakery-500">*</span>
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.deliveryTimeSlot', 'Delivery Time Slot')} <span className="text-rosebakery-500">*</span>
              </label>
              <select
                value={formData.deliveryTimeSlot}
                onChange={(e) => setFormData({ ...formData, deliveryTimeSlot: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.fullName', 'Your Full Name')} <span className="text-rosebakery-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.phone', 'Mobile Number')} <span className="text-rosebakery-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-choco-900 mb-1.5">
                {t('customCake.email', 'Email Address')}
              </label>
              <input
                type="email"
                placeholder="priya@example.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-choco-900 mb-1.5">
              {t('customCake.address', 'Full Delivery Address')} <span className="text-rosebakery-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Flat/House No, Building Name, Street, Landmark..."
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none text-sm"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-12 py-4 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting
              ? t('customCake.submitting', 'Submitting Custom Order...')
              : t('customCake.submitOrderBtn', 'Submit Custom Cake Order & Proceed')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomCakePage;
