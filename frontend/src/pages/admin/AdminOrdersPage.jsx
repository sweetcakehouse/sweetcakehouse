import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Clock,
  AlertCircle,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { fetchOrders } from '../../services/api';
import OrderDetailModal from '../../components/admin/OrderDetailModal';

const AdminOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPaymentStatus = searchParams.get('paymentStatus') || 'all';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState(initialPaymentStatus);
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentFilter !== 'all') params.paymentStatus = paymentFilter;
      if (dateFilter) params.date = dateFilter;

      const res = await fetchOrders(params);
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.warn('Failed to load orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-choco-900">
            Customer Orders Management
          </h1>
          <p className="text-xs text-choco-500 mt-1">
            Review incoming orders, verify UPI payments, and manage kitchen status
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rosebakery-100 text-xs font-semibold text-choco-700 hover:bg-rosebakery-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter controls */}
      <div className="bg-white p-5 rounded-3xl border border-rosebakery-100 shadow-soft space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative md:col-span-2">
            <Search className="w-4 h-4 text-choco-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, customer name, phone, or UTR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-rosebakery-100 bg-cream-50/50 text-xs outline-none focus:bg-white focus:border-rosebakery-400"
            />
          </form>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-rosebakery-100 text-xs font-semibold text-choco-800 bg-white outline-none cursor-pointer"
            >
              <option value="all">Payment: All Statuses</option>
              <option value="submitted">Payment: Submitted (Pending Verification)</option>
              <option value="verified">Payment: Verified</option>
              <option value="rejected">Payment: Rejected</option>
            </select>
          </div>

          {/* Order Delivery Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-rosebakery-100 text-xs font-semibold text-choco-800 bg-white outline-none cursor-pointer"
            >
              <option value="all">Order: All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing / Baking</option>
              <option value="ready_for_pickup">Ready for Pickup</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Date filter row */}
        <div className="flex items-center gap-3 pt-2 border-t border-rosebakery-50 text-xs">
          <span className="font-semibold text-choco-600 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-rosebakery-500" /> Filter by Delivery Date:
          </span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-rosebakery-100 text-xs bg-white outline-none"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-rosebakery-600 font-bold hover:underline"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-rosebakery-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-choco-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-xs text-choco-400">
            No orders found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-choco-700">
              <thead className="bg-cream-100/60 uppercase font-bold text-choco-500 border-b border-rosebakery-100 text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Delivery Slot</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment UTR & Status</th>
                  <th className="px-6 py-4">Order Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rosebakery-50">
                {orders.map((o) => (
                  <tr key={o._id || o.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-rosebakery-600">
                      {o.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-choco-900">{o.customer?.name}</div>
                      <div className="text-[11px] text-choco-400">{o.customer?.phone}</div>
                      <div className="text-[10px] text-choco-500 truncate max-w-xs">
                        {o.customer?.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-choco-800">{o.deliveryDate}</div>
                      <div className="text-[11px] text-choco-400">{o.deliveryTimeSlot}</div>
                    </td>
                    <td className="px-6 py-4 font-serif font-black text-choco-900 text-sm">
                      ₹{o.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            o.payment?.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.payment?.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {o.payment?.status === 'verified' && <ShieldCheck className="w-3 h-3" />}
                          {o.payment?.status || 'submitted'}
                        </span>
                        {o.payment?.utr && (
                          <div className="font-mono text-[11px] text-choco-600">
                            UTR: {o.payment.utr}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-cream-100 text-choco-800">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-choco-900 text-white font-semibold text-xs hover:bg-choco-800 transition-colors shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Verify</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRefresh={loadOrders}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;

