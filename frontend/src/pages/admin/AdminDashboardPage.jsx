import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  Cake,
  AlertCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { fetchDashboardStats } from '../../services/api';
import OrderDetailModal from '../../components/admin/OrderDetailModal';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    pendingPaymentVerifications: 0,
    productCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadData = async () => {
    try {
      const res = await fetchDashboardStats();
      if (res.data && res.data.stats) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
      }
    } catch (err) {
      console.warn('Failed to load dashboard metrics:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metricCards = [
    {
      title: 'Total Verified Revenue',
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      sub: 'From verified orders',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingPaymentVerifications,
      sub: 'Awaiting manual UPI check',
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      alert: stats.pendingPaymentVerifications > 0,
    },
    {
      title: 'Active In Kitchen / Delivery',
      value: stats.activeOrders,
      sub: 'Currently being prepared/delivered',
      icon: ShoppingBag,
      color: 'bg-rosebakery-50 text-rosebakery-600 border-rosebakery-100',
    },
    {
      title: 'Total Cake Menu Items',
      value: stats.productCount || 8,
      sub: 'Active catalog flavors',
      icon: Cake,
      color: 'bg-cream-100 text-choco-800 border-cream-200',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-choco-900">
            Bakery Dashboard Overview
          </h1>
          <p className="text-xs text-choco-500 mt-1">
            Real-time orders, payment verifications, and kitchen updates
          </p>
        </div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white text-xs font-bold transition-all shadow-sm"
        >
          <span>View All Orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Pending payment verification alert if any */}
      {stats.pendingPaymentVerifications > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl flex items-center justify-between gap-4 text-xs text-amber-900">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <strong className="font-bold">
                {stats.pendingPaymentVerifications} customer payment{stats.pendingPaymentVerifications > 1 ? 's' : ''} submitted!
              </strong>
              <p className="text-amber-700 mt-0.5">
                Customers have entered UPI reference numbers (UTR). Please verify the bank account and confirm their orders.
              </p>
            </div>
          </div>
          <Link
            to="/admin/orders?paymentStatus=submitted"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold whitespace-nowrap shadow-sm"
          >
            Review Payments
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-white border shadow-soft flex items-start justify-between ${
                m.alert ? 'border-amber-300 ring-2 ring-amber-100' : 'border-rosebakery-100'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-choco-500">{m.title}</span>
                <span className="font-serif text-3xl font-black text-choco-900 block">
                  {m.value}
                </span>
                <span className="text-[11px] text-choco-400 block">{m.sub}</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-rosebakery-100 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-rosebakery-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-choco-900">Recent Customer Orders</h3>
            <p className="text-xs text-choco-400">Latest orders placed through website or WhatsApp</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-rosebakery-600 hover:text-rosebakery-700"
          >
            View Complete List →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-choco-400">
            No orders placed yet. Once a customer places an order, it will appear here instantly!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-choco-700">
              <thead className="bg-cream-100/60 uppercase font-bold text-choco-500 border-b border-rosebakery-100 text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Delivery Slot</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rosebakery-50">
                {recentOrders.map((o) => (
                  <tr key={o._id || o.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-rosebakery-600">
                      {o.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-choco-900">{o.customer?.name}</div>
                      <div className="text-[11px] text-choco-400">{o.customer?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{o.deliveryDate}</div>
                      <div className="text-[11px] text-choco-400">{o.deliveryTimeSlot}</div>
                    </td>
                    <td className="px-6 py-4 font-serif font-bold text-choco-900">
                      ₹{o.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
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
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-cream-100 text-choco-800">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-choco-50 hover:bg-choco-100 text-choco-800 font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
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
          onRefresh={loadData}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;

