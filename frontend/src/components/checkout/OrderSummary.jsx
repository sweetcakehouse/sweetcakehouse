import React from 'react';
import { ShoppingBag, Truck, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const OrderSummary = ({ items = [], subtotal, deliveryCharge, totalAmount }) => {
  const { settings } = useSettings();

  const isFreeDelivery = deliveryCharge === 0 && subtotal > 0;
  const remainingForFree =
    settings.freeDeliveryAbove && subtotal < settings.freeDeliveryAbove
      ? settings.freeDeliveryAbove - subtotal
      : 0;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-rosebakery-100 shadow-soft space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-rosebakery-100">
        <h3 className="font-serif text-lg font-bold text-choco-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-rosebakery-500" />
          <span>Order Summary</span>
        </h3>
        <span className="text-xs font-semibold text-choco-500">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Free Delivery Bar */}
      {remainingForFree > 0 ? (
        <div className="bg-cream-100 text-choco-700 text-xs p-3 rounded-2xl flex items-center gap-2 border border-cream-200">
          <Truck className="w-4 h-4 text-rosebakery-500 flex-shrink-0" />
          <span>
            Add cakes worth <strong className="text-rosebakery-600">₹{remainingForFree}</strong> more to unlock <span className="font-bold text-emerald-700">FREE Delivery</span>!
          </span>
        </div>
      ) : isFreeDelivery ? (
        <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-2xl flex items-center gap-2 border border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            You unlocked <strong>FREE Delivery</strong> on this order! 🎉
          </span>
        </div>
      ) : null}

      {/* Items list */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-3 text-sm">
            <img
              src={item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80'}
              alt={item.name}
              className="w-14 h-14 rounded-2xl object-cover bg-rosebakery-50 flex-shrink-0 border border-rosebakery-100"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-choco-900 text-sm truncate">{item.name}</h4>
              <p className="text-xs text-choco-500">
                {item.weight} • {item.flavor || 'Standard'}
              </p>
              {item.cakeMessage && (
                <p className="text-[11px] text-rosebakery-600 italic truncate">
                  "{item.cakeMessage}"
                </p>
              )}
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-choco-400">Qty: {item.quantity}</span>
                <span className="font-semibold text-choco-900">₹{item.price * item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bill calculation */}
      <div className="pt-4 border-t border-rosebakery-100 space-y-2 text-sm text-choco-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-choco-900">₹{subtotal}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Delivery Charges</span>
          {deliveryCharge === 0 ? (
            <span className="text-emerald-600 font-bold text-xs uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
              Free Delivery
            </span>
          ) : (
            <span className="font-semibold text-choco-900">₹{deliveryCharge}</span>
          )}
        </div>
        <div className="pt-3 border-t border-rosebakery-100 flex justify-between items-baseline">
          <span className="font-serif text-base font-bold text-choco-900">Final Total</span>
          <span className="font-serif text-2xl font-black text-rosebakery-600">₹{totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

