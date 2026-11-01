import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Phone, Mail, MapPin, Clock, MessageCircle, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const cleanWhatsAppNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-choco-950 text-choco-100 pt-16 pb-12 border-t border-choco-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DEDICATED BOTTOM HINDI TRUST & SUPPORT CARD (Always visible for authenticity & regional warmth) */}
        <div className="mb-14 rounded-3xl bg-gradient-to-r from-rosebakery-950/80 via-choco-900 to-rosebakery-950/80 border border-rosebakery-900/60 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rosebakery-500/20 text-rosebakery-300 text-xs font-semibold border border-rosebakery-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% शुद्ध शाकाहारी • एगलेस बेकरी</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                {t('footer.hindiTrustTitle', '🌸 शुद्धता और ताज़गी की गारंटी')}
              </h3>
              <p className="text-sm text-choco-200 max-w-2xl leading-relaxed">
                {t(
                  'footer.hindiTrustSubtitle',
                  'हमारे सभी केक 100% शुद्ध शाकाहारी (Eggless) हैं और आपके आर्डर पर ही ताज़ा बेक किए जाते हैं। किसी भी विशेष डिज़ाइन, फ्लेवर या डिलीवरी पूछताछ के लिए सीधे शेफ़ से बात करें।'
                )}
              </p>
            </div>

            <div className="flex-shrink-0">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                  `नमस्ते ${settings.shopName}! मुझे ताज़ा केक ऑर्डर करने के बारे में जानकारी चाहिए।`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{t('footer.hindiWhatsAppBtn', 'व्हाट्सएप पर संपर्क करें')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4-COLUMN FOOTER LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-choco-800">
          {/* Bakery Brand & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rosebakery-500 flex items-center justify-center text-white shadow-md">
                <Cake className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                {settings.shopName || 'Sweet Cake House'}
              </span>
            </div>
            <p className="text-sm text-choco-300 leading-relaxed">
              {settings.tagline || 'Handcrafted with Love, Baked to Perfection.'}
              <br />
              {t(
                'footer.story',
                'Artisanal cakes, handcrafted celebration desserts, and 100% pure eggless delights baked fresh with premium ingredients.'
              )}
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                  `Hi ${settings.shopName}! I want to order a custom cake.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {t('footer.quickWhatsApp', 'Quick WhatsApp Order')}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">
              {t('footer.quickNav', 'Quick Navigation')}
            </h4>
            <ul className="space-y-2.5 text-sm text-choco-300">
              <li>
                <Link to="/" className="hover:text-rosebakery-300 transition-colors">
                  {t('nav.home', 'Home')}
                </Link>
              </li>
              <li>
                <Link to="/cakes" className="hover:text-rosebakery-300 transition-colors">
                  {t('nav.exploreCakes', 'All Cake Flavors')}
                </Link>
              </li>
              <li>
                <Link to="/custom-cake" className="hover:text-rosebakery-300 transition-colors">
                  {t('nav.customCake', 'Design Custom Cake')}
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-rosebakery-300 transition-colors">
                  {t('nav.trackOrder', 'Track Your Order')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-rosebakery-300 transition-colors">
                  {t('nav.cart', 'My Shopping Cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">
              {t('footer.bakeryHours', 'Bakery Hours')}
            </h4>
            <div className="space-y-3 text-sm text-choco-300">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-rosebakery-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">{t('footer.dailyBaking', 'Daily Baking & Delivery')}</p>
                  <p>{settings.businessHours || '09:00 AM - 10:30 PM'}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-choco-900 border border-choco-800 text-xs text-choco-300">
                <span className="text-rosebakery-300 font-semibold">Midnight Special:</span>{' '}
                {t('footer.midnightNote', 'Midnight surprise cake deliveries available with prior booking!')}
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">
              {t('footer.visitConnect', 'Visit & Connect')}
            </h4>
            <ul className="space-y-3 text-sm text-choco-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rosebakery-400 mt-1 flex-shrink-0" />
                <span>{settings.shopAddress || 'Baker Street, Blossom City'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rosebakery-400 flex-shrink-0" />
                <span>{settings.phone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rosebakery-400 flex-shrink-0" />
                <span>{settings.email || 'orders@sweetcakehouse.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-choco-400">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} {settings.shopName}. Crafted with{' '}
            <Heart className="w-3.5 h-3.5 text-rosebakery-500 fill-current inline" /> for sweet celebrations.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-choco-400">{t('footer.manualUpi', 'Manual UPI Verified Ordering')}</span>
            <Link to="/admin" className="hover:text-rosebakery-300 transition-colors">
              {t('footer.adminPortal', 'Admin Portal')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
