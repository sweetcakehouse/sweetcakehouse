import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Clock,
  Heart,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Star,
  Cake,
  Flame,
} from 'lucide-react';
import Cake3DScene from '../components/common/Cake3DScene';
import ProductCard from '../components/common/ProductCard';
import { fetchProducts } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cleanWhatsAppNumber = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetchProducts({ featured: 'true' });
        if (res.data && res.data.products) {
          setFeaturedCakes(res.data.products);
        }
      } catch (err) {
        console.warn('Failed to fetch featured cakes:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const categories = [
    {
      name: 'Birthday Cakes',
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
      desc: 'Joyful celebration designs',
    },
    {
      name: 'Chocolate Cakes',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      desc: 'Pure Belgian decadence',
    },
    {
      name: 'Red Velvet',
      image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80',
      desc: 'Cream cheese perfection',
    },
    {
      name: 'Cheesecakes',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
      desc: 'Authentic NY style baked',
    },
    {
      name: 'Fruit Cakes',
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
      desc: 'Freshly glazed tropical fruits',
    },
    {
      name: 'Designer Cakes',
      image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80',
      desc: 'Bespoke fondant artistry',
    },
  ];

  const testimonials = [
    {
      name: 'Ananya Sharma',
      occasion: 'Birthday Party',
      quote:
        'The Belgian Chocolate Truffle cake was absolute heaven! Everyone at the party was praising the velvety texture. The 100% eggless sponge was so soft and moist!',
      rating: 5,
    },
    {
      name: 'Rohan Mehta',
      occasion: '1st Anniversary',
      quote:
        'The custom cake came out exactly like the reference picture I provided! Payment with UPI was effortless, and the WhatsApp update was super convenient.',
      rating: 5,
    },
    {
      name: 'Dr. Priya Desai',
      occasion: 'Family Celebration',
      quote:
        'Sweet Cake House is our family favorite now. Delivered right on the dot for our midnight surprise party. Highly recommended bakery!',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rosebakery-50/60 via-cream-50 to-white pt-8 pb-16 md:py-20 border-b border-rosebakery-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rosebakery-200/80 shadow-xs text-xs font-semibold text-rosebakery-600">
                <Sparkles className="w-3.5 h-3.5 text-rosebakery-500" />
                <span>{t('hero.tag', 'Artisanal Bakery & Fresh Cake Studio')}</span>
              </div>

              <h1 className="font-serif fluid-hero-title font-black text-choco-900 leading-[1.15] tracking-tight">
                {t('hero.titleLine1', 'Handcrafted with Love,')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rosebakery-600 via-rosebakery-500 to-amber-600">
                  {t('hero.titleLine2', 'Baked to Perfection.')}
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-choco-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t(
                  'hero.subtitle',
                  'Celebrate every milestone with our freshly baked, 100% vegetarian & eggless cakes, velvety Belgian truffles, and bespoke custom designs crafted exclusively for you.'
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/cakes"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('hero.exploreBtn', 'Explore All Cakes')}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                    `Hi ${settings.shopName}! I would like to order a fresh cake.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t('hero.whatsappBtn', 'Order on WhatsApp')}</span>
                </a>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-rosebakery-100/80 text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <span className="block font-serif text-lg sm:text-2xl font-black text-choco-900 leading-tight">
                    {t('hero.stat1Number', '100%')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-choco-500 font-medium leading-tight block mt-0.5">
                    {t('hero.stat1Label', 'Pure Veg / Eggless')}
                  </span>
                </div>
                <div>
                  <span className="block font-serif text-lg sm:text-2xl font-black text-choco-900 leading-tight">
                    {t('hero.stat2Number', '2 Hours')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-choco-500 font-medium leading-tight block mt-0.5">
                    {t('hero.stat2Label', 'Express Delivery')}
                  </span>
                </div>
                <div>
                  <span className="block font-serif text-lg sm:text-2xl font-black text-choco-900 leading-tight">
                    {t('hero.stat3Number', '4.9 ★')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-choco-500 font-medium leading-tight block mt-0.5">
                    {t('hero.stat3Label', '5,000+ Happy Smiles')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Three.js Interactive 3D Cake Showcase */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-gradient-to-b from-white/90 to-rosebakery-50/80 p-3 sm:p-4 border border-rosebakery-100 shadow-xl backdrop-blur-sm">
                {/* 3D Canvas */}
                <Cake3DScene className="h-[300px] xs:h-[350px] sm:h-[420px] w-full rounded-2xl" />

                {/* Floating pill badges (constrained on mobile to prevent horizontal scroll) */}
                <div className="absolute top-2 right-2 sm:-top-3 sm:-right-3 bg-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl shadow-lg border border-rosebakery-100 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-rosebakery-600 animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{t('hero.badgeFresh', 'Freshly Baked Today')}</span>
                </div>

                <div className="absolute bottom-2 left-2 sm:-bottom-3 sm:-left-3 bg-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl shadow-lg border border-rosebakery-100 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-700">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-600"></span>
                  <span>{t('hero.badgeEggless', '100% Eggless Sponge')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-rosebakery-100 shadow-soft flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rosebakery-50 text-rosebakery-600 flex items-center justify-center flex-shrink-0">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-choco-900">{t('values.v1Title', 'Baked to Order')}</h4>
              <p className="text-xs text-choco-500 mt-1 leading-relaxed">
                {t('values.v1Desc', 'Never stored frozen. Every single cake is baked fresh upon receiving your order.')}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-rosebakery-100 shadow-soft flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-choco-900">{t('values.v2Title', '100% Pure Vegetarian')}</h4>
              <p className="text-xs text-choco-500 mt-1 leading-relaxed">
                {t('values.v2Desc', 'Guaranteed eggless bakery with separate dedicated processing and certified clean ingredients.')}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-rosebakery-100 shadow-soft flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-choco-900">{t('values.v3Title', 'Same-Day & Midnight')}</h4>
              <p className="text-xs text-choco-500 mt-1 leading-relaxed">
                {t('values.v3Desc', 'Timely slot deliveries including special midnight surprises right at 12:00 AM!')}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-rosebakery-100 shadow-soft flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rosebakery-50 text-rosebakery-600 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-choco-900">{t('values.v4Title', 'Custom Masterpieces')}</h4>
              <p className="text-xs text-choco-500 mt-1 leading-relaxed">
                {t('values.v4Desc', 'Upload your reference photos and our master pastry chefs will recreate your vision.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR / BESTSELLER CAKES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rosebakery-600 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('bestseller.tag', 'Customer Favorites')}</span>
            </div>
            <h2 className="font-serif fluid-section-title font-bold text-choco-900">
              {t('bestseller.title', 'Popular Celebration Cakes')}
            </h2>
          </div>
          <Link
            to="/cakes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-rosebakery-600 hover:text-rosebakery-700 transition-colors"
          >
            <span>{t('bestseller.viewAll', 'View Full Catalog')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-96 animate-pulse p-4 border border-rosebakery-100">
                <div className="h-52 bg-rosebakery-50 rounded-2xl mb-4"></div>
                <div className="h-4 bg-rosebakery-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-rosebakery-50 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCakes.slice(0, 8).map((cake) => (
              <ProductCard key={cake._id || cake.id} product={cake} />
            ))}
          </div>
        )}
      </section>

      {/* CATEGORIES SECTION */}
      <section className="bg-cream-100/60 py-16 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-rosebakery-600 uppercase tracking-widest">
              {t('categories.tag', 'Flavors for Every Occasion')}
            </span>
            <h2 className="font-serif fluid-section-title font-bold text-choco-900 mt-2">
              {t('categories.title', 'Browse Cake Categories')}
            </h2>
            <p className="text-sm text-choco-600 mt-2">
              {t('categories.subtitle', 'From rich chocolate truffles to refreshing berry cheesecakes, explore our curated collections.')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/cakes?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white rounded-3xl overflow-hidden p-3 border border-rosebakery-100 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 bg-rosebakery-50">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-serif font-bold text-sm text-choco-900 group-hover:text-rosebakery-600 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-choco-400 mt-0.5 line-clamp-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM CAKE TEASER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-choco-950 via-choco-900 to-choco-950 text-white p-8 md:p-14 shadow-2xl border border-choco-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosebakery-500/20 text-rosebakery-300 text-xs font-semibold border border-rosebakery-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                {t('customCake.badge', 'Custom Cake Studio')}
              </span>
              <h2 className="font-serif fluid-section-title font-black leading-tight">
                {t('customCake.teaserTitle1', 'Have a Unique Cake Idea?')} <br />
                <span className="text-rosebakery-400">
                  {t('customCake.teaserTitle2', 'Let Us Handcraft It For You!')}
                </span>
              </h2>
              <p className="text-choco-200 text-sm md:text-base max-w-xl leading-relaxed">
                {t(
                  'customCake.teaserDesc',
                  "Whether it's a multi-tiered wedding cake, favorite cartoon theme, photo cake, or an anniversary centerpiece, our pastry chefs can bring your vision alive."
                )}
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/custom-cake"
                  className="px-6 py-3.5 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
                >
                  {t('customCake.teaserBtn', 'Design Custom Cake')}
                </Link>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
                    `Hi ${settings.shopName}! I have a custom cake design in mind and would love to share a reference photo.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider border border-white/20 transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('customCake.chatBakerBtn', 'Chat with Head Baker')}
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <div className="relative w-64 h-64 mx-auto rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80"
                  alt="Custom Designer Cake"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-rosebakery-600 uppercase tracking-widest">
            {t('testimonials.tag', 'Sweet Customer Stories')}
          </span>
          <h2 className="font-serif fluid-section-title font-bold text-choco-900 mt-2">
            {t('testimonials.title', 'Loved by Cake Lovers')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-rosebakery-100 shadow-soft flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-choco-700 leading-relaxed italic">"{test.quote}"</p>
              </div>
              <div className="pt-3 border-t border-rosebakery-50 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-choco-900">{test.name}</h4>
                  <span className="text-choco-400 text-[11px]">{test.occasion}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  {t('testimonials.verified', 'Verified Buyer')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
