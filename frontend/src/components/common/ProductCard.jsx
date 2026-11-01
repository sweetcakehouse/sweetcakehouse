import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';

  const minPrice =
    product.weightsWithPrices && product.weightsWithPrices.length > 0
      ? Math.min(...product.weightsWithPrices.map((w) => w.price))
      : product.price || 499;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-rosebakery-100/80 shadow-soft hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cake Image Box */}
        <Link to={`/cake/${product.slug}`} className="block relative h-60 w-full overflow-hidden bg-rosebakery-50">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {product.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rosebakery-500 text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
                {t('bestseller.bestsellerBadge', 'Bestseller')}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-choco-800 shadow-xs">
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
        <div className="p-5">
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-choco-800">{product.rating || 4.9}</span>
            <span className="text-xs text-choco-400">
              ({product.reviewCount || 30}+ {t('product.reviews', 'reviews')})
            </span>
          </div>

          {/* Title */}
          <Link to={`/cake/${product.slug}`} className="block">
            <h3 className="font-serif text-lg font-bold text-choco-900 group-hover:text-rosebakery-600 transition-colors line-clamp-1">
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
                  className="px-2 py-0.5 rounded-md bg-cream-100 text-[11px] font-medium text-choco-700 border border-cream-200"
                >
                  {w.weight}
                </span>
              ))}
            {product.weightsWithPrices && product.weightsWithPrices.length > 3 && (
              <span className="px-1.5 py-0.5 text-[11px] text-choco-400">
                +{product.weightsWithPrices.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Price & Add */}
      <div className="p-5 pt-0 border-t border-rosebakery-50 mt-2 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-choco-400 uppercase tracking-wider block font-medium">
            {t('bestseller.from', 'Starting at')}
          </span>
          <span className="font-serif text-xl font-extrabold text-rosebakery-600">
            ₹{minPrice}
          </span>
        </div>

        <Link
          to={`/cake/${product.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-rosebakery-500 hover:bg-rosebakery-600 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t('product.addToCart', 'Order Now')}</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
