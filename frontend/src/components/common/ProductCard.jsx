import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Sparkles, Zap, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';

  const minPrice =
    product.weightsWithPrices && product.weightsWithPrices.length > 0
      ? Math.min(...product.weightsWithPrices.map((w) => w.price))
      : product.price || 499;

  const defaultWeight = product.weightsWithPrices?.[0]?.weight || '1 kg';
  const defaultFlavor = product.availableFlavors?.[0] || 'Classic';

  const handleQuickAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      product,
      weight: defaultWeight,
      price: minPrice,
      flavor: defaultFlavor,
      isEggless: product.isEggless ?? true,
      cakeMessage: '',
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleQuickBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      product,
      weight: defaultWeight,
      price: minPrice,
      flavor: defaultFlavor,
      isEggless: product.isEggless ?? true,
      cakeMessage: '',
      quantity: 1,
    });

    navigate('/checkout');
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-rosebakery-100/80 shadow-soft hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Cake Image Box */}
        <Link to={`/cake/${product.slug}`} className="block relative h-52 sm:h-60 w-full overflow-hidden bg-rosebakery-50">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[75%]">
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rosebakery-500 text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
                {t('bestseller.bestsellerBadge', 'Bestseller')}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/95 backdrop-blur-md text-choco-800 shadow-xs truncate">
              {product.category}
            </span>
          </div>

          {/* Eggless Pure Veg Badge */}
          {product.isEggless && (
            <div className="absolute top-3 right-3 z-10">
              <span
                className="w-7 h-7 rounded-lg bg-white/95 backdrop-blur-md border border-emerald-600 flex items-center justify-center shadow-xs"
                title="100% Pure Vegetarian / Eggless"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              </span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-choco-800">{product.rating || 4.9}</span>
            <span className="text-[11px] sm:text-xs text-choco-400">
              ({product.reviewCount || 30}+ {t('product.reviews', 'reviews')})
            </span>
          </div>

          {/* Title */}
          <Link to={`/cake/${product.slug}`} className="block">
            <h3 className="font-serif text-base sm:text-lg font-bold text-choco-900 group-hover:text-rosebakery-600 transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-choco-600 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Weight Chips */}
          <div className="mt-3 flex flex-wrap gap-1">
            {product.weightsWithPrices &&
              product.weightsWithPrices.slice(0, 3).map((w, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-cream-100 text-[10px] sm:text-[11px] font-medium text-choco-700 border border-cream-200"
                >
                  {w.weight}
                </span>
              ))}
            {product.weightsWithPrices && product.weightsWithPrices.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] sm:text-[11px] text-choco-400">
                +{product.weightsWithPrices.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Price & Dual Action Buttons ("Add to Cart" + "Buy Now") */}
      <div className="p-4 sm:p-5 pt-0 border-t border-rosebakery-50 mt-2 space-y-3">
        {/* Price & Weight Row */}
        <div className="flex items-baseline justify-between pt-2">
          <div>
            <span className="text-[10px] sm:text-[11px] text-choco-400 uppercase tracking-wider block font-medium">
              {t('bestseller.from', 'Starting at')}
            </span>
            <span className="font-serif text-xl sm:text-2xl font-extrabold text-rosebakery-600">
              ₹{minPrice}
            </span>
          </div>
          <span className="text-[11px] font-medium text-choco-500 bg-rosebakery-50/80 px-2 py-0.5 rounded-full border border-rosebakery-100">
            {defaultWeight}
          </span>
        </div>

        {/* Dual Buttons Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* 1. Add to Cart Button */}
          <button
            type="button"
            onClick={handleQuickAddToCart}
            className={`w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold border transition-all active:scale-95 ${
              isAdded
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : 'bg-rosebakery-50 hover:bg-rosebakery-100 text-rosebakery-700 border-rosebakery-200'
            }`}
            title="Add default size to cart"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 flex-shrink-0 animate-scale-in" />
                <span className="truncate">{t('product.addedToCart', 'Added!')}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{t('product.addToCart', 'Add to Cart')}</span>
              </>
            )}
          </button>

          {/* 2. Buy Now Button */}
          <button
            type="button"
            onClick={handleQuickBuyNow}
            className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold bg-gradient-to-r from-rosebakery-500 to-rosebakery-600 hover:from-rosebakery-600 hover:to-rosebakery-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
            title="Buy now and proceed to checkout"
          >
            <Zap className="w-3.5 h-3.5 flex-shrink-0 fill-current" />
            <span className="truncate">{t('product.buyNow', 'Buy Now')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
