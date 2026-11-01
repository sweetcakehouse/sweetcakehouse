import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Cake,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Orders Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Cakes & Products', path: '/admin/products', icon: Cake },
    { name: 'Bakery Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-choco-50/50 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-choco-950 text-choco-100 flex flex-col justify-between transition-transform duration-300 shadow-xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-choco-900">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rosebakery-500 flex items-center justify-center text-white shadow-md">
                <Cake className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white block leading-tight">
                  {settings.shopName || 'Sweet Cake'}
                </span>
                <span className="text-[10px] text-rosebakery-400 uppercase tracking-widest font-bold">
                  Admin Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-choco-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-rosebakery-500 text-white shadow-md shadow-rosebakery-500/20'
                        : 'text-choco-300 hover:bg-choco-900 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-choco-900 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-choco-900 text-xs font-semibold text-choco-200 hover:text-white hover:bg-choco-850 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Customer Site</span>
            </span>
          </Link>

          <div className="p-3 bg-choco-900/60 rounded-2xl flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{admin?.name || 'Bakery Admin'}</p>
              <p className="text-[11px] text-choco-400 truncate">{admin?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-choco-100 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-choco-700 hover:bg-rosebakery-50 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-choco-500 uppercase tracking-widest hidden sm:inline">
              Sweet Cake House Management
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Bakery Online
            </span>
            <span className="text-xs font-bold text-choco-800">{admin?.name}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

