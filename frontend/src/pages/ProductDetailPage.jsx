import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Zap,
  Clock,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const { t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('1 kg');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [isEggless, setIsEggless] = useState(true);
  const [cakeMessage, setCakeMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const loadCake = async () => {
      setLoading(true);
      try {
        const res = await fetchProductById(slug);
        if (res.data && res.data.product) {
          const p = res.data.product;
          setProduct(p);
          if (p.images && p.images.length > 0) {
            setActiveImage(p.images[0]);
          }
          if (p.weightsWithPrices && p.weightsWithPrices.length > 0) {
            setSelectedWeight(p.weightsWithPrices[0].weight);
          }
          if (p.availableFlavors && p.availableFlavors.length > 0) {
            setSelectedFlavor(p.availableFlavors[0]);
          }
          setIsEggless(p.isEggless);
        }
      } catch (err) {
        console.warn('Failed to load cake product:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCake();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-rosebakery-200 border-t-rosebakery-500 animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-choco-500 font-medium">Baking fresh cake details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-choco-900">Cake Not Found</h2>
        <p className="text-sm text-choco-500">
          The requested cake flavor might have been updated or moved.
        </p>
        <Link
          to="/cakes"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rosebakery-500 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Cakes</span>
        </Link>
      </div>
    );
  }

  // Calculate current price based on weight selected
  const matchedWeightObj =
    product.weightsWithPrices &&
    product.weightsWithPrices.find((w) => w.weight.toLowerCase() === selectedWeight.toLowerCase());
  const currentPrice = matchedWeightObj ? matchedWeightObj.price : product.price || 499;

  const handleAddToCart = () => {
    addToCart({
      product,
      weight: selectedWeight,
      price: currentPrice,
      flavor: selectedFlavor || 'Standard',
      isEggless,
      cakeMessage,
      quantity,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleOrderNow = () => {
    addToCart({
      product,
      weight: selectedWeight,
      price: currentPrice,
      flavor: selectedFlavor || 'Standard',
      isEggless,
      cakeMessage,
      quantity,
    });
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <Link
        to="/cakes"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-choco-500 hover:text-rosebakery-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cake Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-rosebakery-50 border border-rosebakery-100 shadow-soft h-[380px] sm:h-[480px]">
            <img
              src={activeImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rosebakery-500 text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Bestseller
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-rosebakery-500 shadow-md scale-105'
                      : 'border-rosebakery-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Configuration */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rosebakery-50 text-rosebakery-600 border border-rosebakery-100">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-choco-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating || 4.9}</span>
                <span className="text-choco-400">
                  ({product.reviewCount || 25}+ {t('product.reviews', 'reviews')})
                </span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-choco-900">
              {product.name}
            </h1>

            {/* Price display with weight indication */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-4xl font-black text-rosebakery-600">
                ₹{currentPrice * quantity}
              </span>
              {quantity > 1 && (
                <span className="text-xs text-choco-400">
                  (₹{currentPrice} × {quantity})
                </span>
              )}
              <span className="text-xs text-choco-500 font-medium">for {selectedWeight}</span>
            </div>
          </div>

          <p className="text-sm text-choco-600 leading-relaxed">{product.description}</p>

          {/* 1. Weight Selector */}
          <div className="space-y-2 pt-2 border-t border-rosebakery-100">
            <label className="block text-xs font-bold text-choco-900 uppercase tracking-wider">
              {t('product.selectWeight', '1. Select Weight / Size')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {product.weightsWithPrices &&
                product.weightsWithPrices.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedWeight(item.weight)}
                    className={`py-3 px-3 rounded-2xl border text-center transition-all ${
                      selectedWeight === item.weight
                        ? 'border-rosebakery-500 bg-rosebakery-50/70 text-rosebakery-700 font-bold shadow-xs'
                        : 'border-rosebakery-100 bg-white text-choco-700 hover:border-rosebakery-300'
                    }`}
                  >
                    <span className="block text-sm font-semibold">{item.weight}</span>
                    <span className="block text-xs text-choco-500 mt-0.5">₹{item.price}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* 2. Flavor Options */}
          {product.availableFlavors && product.availableFlavors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-choco-900 uppercase tracking-wider">
                {t('product.selectFlavor', '2. Flavor Variation')}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableFlavors.map((flavor, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedFlavor === flavor
                        ? 'bg-choco-900 text-white border-choco-900 shadow-xs'
                        : 'bg-white text-choco-700 border-rosebakery-100 hover:border-choco-400'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Dietary Choice (100% Eggless) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-choco-900 uppercase tracking-wider">
              {t('product.egglessTag', '100% Pure Veg / Eggless')}
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEggless(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                  isEggless
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                    : 'border-rosebakery-100 bg-white text-choco-700'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>100% Pure Vegetarian (Eggless)</span>
              </button>
            </div>
          </div>

          {/* 4. Custom Message On Cake */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-choco-900 uppercase tracking-wider">
              {t('customCake.messageOnCake', 'Message On Cake')} <span className="text-choco-400 font-normal">(Free Inscription)</span>
            </label>
            <input
              type="text"
              maxLength={40}
              placeholder={t('customCake.messagePlaceholder', 'e.g. Happy 25th Birthday Rhea!')}
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-rosebakery-100 focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 text-sm outline-none bg-white transition-all"
            />
          </div>

          {/* Quantity & CTAs */}
          <div className="pt-4 border-t border-rosebakery-100 space-y-4">
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-rosebakery-200 rounded-2xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-choco-600 hover:bg-rosebakery-50 transition-colors font-bold text-base"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-choco-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-choco-600 hover:bg-rosebakery-50 transition-colors font-bold text-base"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-rosebakery-50 hover:bg-rosebakery-100 text-rosebakery-700 font-bold text-sm border border-rosebakery-200 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('cart.item', 'Add to Cart')}</span>
              </button>

              {/* Order Now */}
              <button
                type="button"
                onClick={handleOrderNow}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>{t('customCake.teaserBtn', 'Order Now')}</span>
              </button>
            </div>

            {/* Added to cart toast message */}
            {addedToast && (
              <div className="bg-emerald-500 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-lg animate-fade-in">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> {t('product.addedToCart', 'Added to Cart!')}
                </span>
                <Link to="/cart" className="underline font-bold">
                  {t('nav.viewCart', 'View Cart')}
                </Link>
              </div>
            )}
          </div>

          {/* Delivery & Assurance Notes */}
          <div className="p-4 bg-cream-100/60 rounded-2xl border border-cream-200 grid grid-cols-2 gap-3 text-xs text-choco-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rosebakery-500 flex-shrink-0" />
              <span>{t('product.freshGuarantee', 'Guaranteed 100% Freshly Baked Upon Order')}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{t('values.v2Title', '100% Pure Vegetarian')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
