import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  User,
  Phone,
  MessageCircle,
  Check,
  Trash2,
} from 'lucide-react';
import { updateOrderStatus, updateOrderPayment, deleteOrder } from '../../services/api';

const OrderDetailModal = ({ order, onClose, onRefresh }) => {
  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState(order.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.payment?.status || 'submitted');
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing / Baking' },
    { value: 'ready_for_pickup', label: 'Ready for Pickup' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setMsg('');
    try {
      await updateOrderStatus(order._id || order.id, {
        status: newStatus,
        adminNotes,
      });
      setCurrentStatus(newStatus);
      setMsg(`Order status updated to ${newStatus}`);
      onRefresh();
    } catch (err) {
      setMsg('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentVerify = async (status) => {
    setUpdating(true);
    setMsg('');
    try {
      await updateOrderPayment(order._id || order.id, {
        paymentStatus: status,
        notes: `Manual admin update to ${status}`,
      });
      setPaymentStatus(status);
      if (status === 'verified' && currentStatus === 'pending') {
        setCurrentStatus('confirmed');
      }
      setMsg(`Payment marked as ${status}`);
      onRefresh();
    } catch (err) {
      setMsg('Failed to update payment');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete order ${order.orderNumber}?`)) {
      try {
        await deleteOrder(order._id || order.id);
        onRefresh();
        onClose();
      } catch (err) {
        alert('Failed to delete order');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rosebakery-100 flex flex-col justify-between">
        {/* Header */}
        <div className="p-6 border-b border-rosebakery-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black text-rosebakery-600">
                {order.orderNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-cream-100 text-choco-700">
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-choco-400 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-choco-400 hover:text-choco-900 rounded-full hover:bg-cream-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {msg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{msg}</span>
            </div>
          )}

          {/* Quick Action Bar: Verify Payment & Change Status */}
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Payment verification */}
            <div>
              <span className="text-xs font-bold text-choco-900 block mb-1.5">
                Manual UPI Payment Verification:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handlePaymentVerify('verified')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    paymentStatus === 'verified'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  ✓ Mark Verified
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handlePaymentVerify('rejected')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    paymentStatus === 'rejected'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  ✕ Mark Rejected
                </button>
              </div>
            </div>

            {/* Order status dropdown */}
            <div>
              <span className="text-xs font-bold text-choco-900 block mb-1.5">Order Delivery Status:</span>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-choco-200 text-xs font-semibold bg-white cursor-pointer"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer & Delivery Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-rosebakery-100 space-y-2">
              <h4 className="font-bold text-choco-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-rosebakery-500" />
                <span>Customer Info</span>
              </h4>
              <p>Name: <strong>{order.customer?.name}</strong></p>
              <p>Phone: <strong>{order.customer?.phone}</strong></p>
              {order.customer?.alternatePhone && <p>Alt Phone: {order.customer.alternatePhone}</p>}
              {order.customer?.email && <p>Email: {order.customer.email}</p>}
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rosebakery-100 space-y-2">
              <h4 className="font-bold text-choco-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rosebakery-500" />
                <span>Delivery Destination</span>
              </h4>
              <p>Address: {order.customer?.address}</p>
              <p>City: {order.customer?.city} {order.customer?.pincode ? `(${order.customer.pincode})` : ''}</p>
              {order.customer?.landmark && <p>Landmark: {order.customer.landmark}</p>}
              <p className="font-semibold text-rosebakery-600">
                Date: {order.deliveryDate} • Slot: {order.deliveryTimeSlot}
              </p>
            </div>
          </div>

          {/* Payment Proof details */}
          <div className="bg-white p-4 rounded-2xl border border-rosebakery-100 space-y-3 text-xs">
            <h4 className="font-bold text-choco-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rosebakery-500" />
              <span>Customer Payment Submission</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p>Payment Method: <strong>{order.payment?.method || 'UPI'}</strong></p>
                <p>
                  UTR / Reference No:{' '}
                  <strong className="font-mono text-sm text-choco-900 bg-cream-100 px-2 py-0.5 rounded">
                    {order.payment?.utr || 'Not submitted yet'}
                  </strong>
                </p>
                <p className="mt-1">
                  Status:{' '}
                  <span
                    className={`font-bold uppercase ${
                      paymentStatus === 'verified'
                        ? 'text-emerald-700'
                        : paymentStatus === 'rejected'
                        ? 'text-rose-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {paymentStatus}
                  </span>
                </p>
              </div>

              {order.payment?.screenshotUrl && (
                <div>
                  <span className="block text-choco-500 mb-1">Attached Screenshot:</span>
                  <a
                    href={order.payment.screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-28 h-28 rounded-xl overflow-hidden border border-rosebakery-200 shadow-sm hover:scale-105 transition-transform"
                  >
                    <img
                      src={order.payment.screenshotUrl}
                      alt="Proof"
                      className="w-full h-full object-cover"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Items breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-choco-500 tracking-wider">
              Ordered Cakes
            </h4>
            <div className="space-y-2">
              {order.items &&
                order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-xl bg-cream-50 text-xs border border-cream-100"
                  >
                    <div>
                      <span className="font-bold text-choco-900 block">{item.name}</span>
                      <span className="text-choco-500">
                        {item.weight} • {item.flavor || 'Standard'} • Qty: {item.quantity} •{' '}
                        {item.isEggless ? '100% Eggless' : 'Regular'}
                      </span>
                      {item.cakeMessage && (
                        <span className="block text-rosebakery-600 italic">
                          Message: "{item.cakeMessage}"
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-choco-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}

              {order.customCake && order.customCake.isCustom && (
                <div className="p-3 rounded-xl bg-rosebakery-50/70 border border-rosebakery-100 text-xs space-y-1">
                  <span className="font-bold text-rosebakery-700 block">Custom Cake Design:</span>
                  <p>Theme: {order.customCake.cakeName}</p>
                  <p>Flavor: {order.customCake.flavor} • Shape: {order.customCake.shape} • Weight: {order.customCake.weight}</p>
                  {order.customCake.cakeMessage && <p>Message: "{order.customCake.cakeMessage}"</p>}
                  {order.customCake.specialInstructions && <p>Notes: {order.customCake.specialInstructions}</p>}
                </div>
              )}
            </div>

            {/* Bill summary */}
            <div className="p-4 bg-choco-900 text-choco-100 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span>Subtotal: ₹{order.subtotal}</span> •{' '}
                <span>Delivery Fee: ₹{order.deliveryCharge}</span>
              </div>
              <span className="font-serif text-base font-black text-rosebakery-300">
                Total: ₹{order.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-cream-50 border-t border-rosebakery-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Order</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-choco-900 text-white text-xs font-bold hover:bg-choco-800"
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;

