import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Truck, AlertCircle, Cake } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, deliveryCharge, totalAmount } =
    useCart();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const isFreeDelivery = deliveryCharge === 0 && subtotal > 0;
  const remainingForFree =
    settings.freeDeliveryAbove && subtotal < settings.freeDeliveryAbove
      ? settings.freeDeliveryAbove - subtotal
      : 0;

  const minOrderMet = subtotal >= (settings.minOrderAmount || 200);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rosebakery-50 text-rosebakery-500 mx-auto flex items-center justify-center border border-rosebakery-100 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-choco-900">
            {t('cart.emptyTitle', 'Your Cake Basket is Empty')}
          </h2>
          <p className="text-sm text-choco-500 max-w-sm mx-auto">
            {t(
              'cart.emptySubtitle',
              "You haven't added any sweet delights yet. Explore our handcrafted collection to get started!"
            )}
          </p>
        </div>
        <Link
          to="/cakes"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-sm shadow-md hover:shadow-xl transition-all"
        >
          <Cake className="w-4 h-4" />
          <span>{t('cart.browseBtn', 'Explore Fresh Cakes')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rosebakery-100">
        <div>
          <h1 className="font-serif fluid-section-title font-bold text-choco-900">
            {t('cart.title', 'Shopping Cart')}
          </h1>
          <p className="text-xs text-choco-500 mt-1">
            Review your customized cakes before proceeding to payment
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('cart.clearCart', 'Clear All Items')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Cart Items Table / Cards */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free delivery tracker */}
          {remainingForFree > 0 ? (
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 text-xs text-choco-800 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rosebakery-500 flex-shrink-0" />
                <span>
                  Add <strong className="text-rosebakery-600 font-bold">₹{remainingForFree}</strong> more to get <span className="font-bold text-emerald-700">FREE Delivery</span>!
                </span>
              </span>
              <Link to="/cakes" className="text-rosebakery-600 font-bold hover:underline">
                {t('cart.browseBtn', 'Add More Cakes')}
              </Link>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{t('cart.freeDeliveryNotice', 'Great news! You have qualified for FREE Delivery.')}</span>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.itemKey}
                className="bg-white p-5 rounded-3xl border border-rosebakery-100 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-rosebakery-50 flex-shrink-0 border border-rosebakery-100"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-serif font-bold text-base text-choco-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-choco-500">
                      <span className="font-semibold text-choco-800">{item.weight}</span> •{' '}
                      {item.flavor || 'Standard'} •{' '}
                      {item.isEggless ? (
                        <span className="text-emerald-700 font-semibold">100% Eggless</span>
                      ) : (
                        'Standard'
                      )}
                    </p>
                    {item.cakeMessage && (
                      <p className="text-[11px] text-rosebakery-600 italic">
                        Message: "{item.cakeMessage}"
                      </p>
                    )}
                    <span className="font-serif text-sm font-bold text-rosebakery-600 sm:hidden block">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>

                {/* Quantity & Delete Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-rosebakery-50">
                  {/* Stepper */}
                  <div className="flex items-center border border-rosebakery-200 rounded-2xl bg-white p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.itemKey, item.quantity - 1)}
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-choco-600 hover:bg-rosebakery-50 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-choco-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.itemKey, item.quantity + 1)}
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-choco-600 hover:bg-rosebakery-50 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="hidden sm:block font-serif text-base font-extrabold text-choco-900 w-20 text-right">
                    ₹{item.price * item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.itemKey)}
                    className="p-2 text-choco-400 hover:text-rose-600 transition-colors rounded-xl hover:bg-rose-50"
                    title={t('cart.remove', 'Remove item')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/cakes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rosebakery-600 hover:text-rosebakery-700 transition-colors pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('cart.browseBtn', 'Add More Delicious Cakes')}</span>
          </Link>
        </div>

        {/* Right: Bill Breakdown & Proceed CTA */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-rosebakery-100 shadow-soft space-y-6">
          <h3 className="font-serif text-lg font-bold text-choco-900 pb-3 border-b border-rosebakery-100">
            {t('checkout.orderSummary', 'Payment Summary')}
          </h3>

          <div className="space-y-3 text-sm text-choco-700">
            <div className="flex justify-between">
              <span>{t('cart.subtotal', 'Subtotal')}</span>
              <span className="font-semibold text-choco-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t('cart.deliveryCharge', 'Delivery Fee')}</span>
              {deliveryCharge === 0 ? (
                <span className="text-emerald-700 font-bold text-xs uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                  FREE
                </span>
              ) : (
                <span className="font-semibold text-choco-900">₹{deliveryCharge}</span>
              )}
            </div>

            <div className="pt-3 border-t border-rosebakery-100 flex justify-between items-baseline">
              <span className="font-serif text-base font-bold text-choco-900">
                {t('cart.total', 'Total Payable')}
              </span>
              <span className="font-serif text-2xl font-black text-rosebakery-600">₹{totalAmount}</span>
            </div>
          </div>

          {!minOrderMet && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                Minimum order amount is <strong>₹{settings.minOrderAmount || 200}</strong>. Please add cakes worth ₹{(settings.minOrderAmount || 200) - subtotal} more.
              </span>
            </div>
          )}

          <button
            type="button"
            disabled={!minOrderMet}
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <span>{t('cart.proceedCheckout', 'Proceed to Checkout')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-[11px] text-choco-400">
            {t('checkout.secureNote', 'Manual UPI Payment • Direct Verification • Express Delivery')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
