import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Cake, MessageCircle, Shield, Globe } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemCount } = useCart();
  const { settings } = useSettings();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const cleanWhatsAppNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.exploreCakes', 'Explore Cakes'), path: '/cakes' },
    { name: t('nav.customCake', 'Custom Cake'), path: '/custom-cake' },
    { name: t('nav.trackOrder', 'Track Order'), path: '/track-order' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rosebakery-100 shadow-xs transition-all">
      {/* Top micro bar */}
      <div className="bg-gradient-to-r from-rosebakery-600 via-rosebakery-500 to-rosebakery-600 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex justify-center items-center gap-2">
        <span>{t('nav.topBanner', '✨ Handcrafted Fresh Daily • 100% Pure Vegetarian / Eggless Available')}</span>
        <span className="hidden md:inline">
          {t('nav.topBannerDelivery', '• Same-Day Delivery across')} {settings.city || 'City'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rosebakery-500 to-rosebakery-400 flex items-center justify-center text-white shadow-md shadow-rosebakery-500/20 group-hover:scale-105 transition-transform duration-300">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-choco-900 group-hover:text-rosebakery-600 transition-colors">
                {settings.shopName || 'Sweet Cake House'}
              </span>
              <p className="text-[11px] text-choco-500 tracking-wider uppercase font-medium">
                Artisanal Bakery
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-rosebakery-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-rosebakery-500 after:rounded-full'
                      : 'text-choco-700 hover:text-rosebakery-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Language Switcher, WhatsApp, Cart, Mobile Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rosebakery-50 hover:bg-rosebakery-100 text-rosebakery-700 border border-rosebakery-200/80 transition-all active:scale-95 shadow-2xs"
              title={language === 'en' ? 'हिंदी में देखें (Switch to Hindi)' : 'Switch to English'}
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-rosebakery-500" />
              <span className={language === 'en' ? 'font-bold text-rosebakery-800' : 'text-rosebakery-500'}>
                EN
              </span>
              <span className="text-rosebakery-300 text-[10px]">|</span>
              <span className={language === 'hi' ? 'font-bold text-rosebakery-800' : 'text-rosebakery-500'}>
                हिन्दी
              </span>
            </button>

            {/* WhatsApp Quick Order */}
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                `Hi ${settings.shopName}! I would like to inquire about ordering a fresh cake.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{t('nav.whatsappUs', 'WhatsApp Us')}</span>
            </a>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-rosebakery-50 text-rosebakery-600 hover:bg-rosebakery-100 transition-colors shadow-2xs"
              aria-label={t('nav.viewCart', 'View Cart')}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rosebakery-500 text-white text-[11px] font-bold flex items-center justify-center animate-bounce">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Admin Link Badge */}
            <Link
              to="/admin"
              className="p-2 rounded-full text-choco-400 hover:text-choco-800 hover:bg-choco-50 transition-colors"
              title={t('nav.adminPortal', 'Admin Portal')}
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-choco-800 hover:bg-rosebakery-50 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rosebakery-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {/* Mobile Language Toggle Row */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-rosebakery-50/80 rounded-2xl border border-rosebakery-100 mb-2">
            <span className="text-xs font-medium text-choco-700 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-rosebakery-500" />
              Language / भाषा:
            </span>
            <button
              onClick={toggleLanguage}
              className="px-3.5 py-1 rounded-full text-xs font-bold bg-white text-rosebakery-700 border border-rosebakery-200 shadow-2xs active:scale-95"
            >
              {language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
            </button>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-choco-800 hover:bg-rosebakery-50 hover:text-rosebakery-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-rosebakery-100 flex flex-col gap-2">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                `Hi ${settings.shopName}! I would like to inquire about ordering a fresh cake.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              {t('nav.whatsappUs', 'Chat on WhatsApp')}
            </a>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs text-choco-500 py-1"
            >
              {t('nav.adminPortal', 'Staff / Admin Login')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
