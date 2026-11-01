import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Cake } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { fetchProducts } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const { t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [egglessOnly, setEgglessOnly] = useState(false);

  const categories = [
    'All',
    'Birthday Cakes',
    'Chocolate Cakes',
    'Cheesecakes',
    'Fruit Cakes',
    'Red Velvet',
    'Anniversary Cakes',
    'Designer Cakes',
  ];

  // Sync category param with state
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (egglessOnly) {
        params.eggless = 'true';
      }
      if (sortBy) {
        params.sort = sortBy;
      }

      const res = await fetchProducts(params);
      if (res.data && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.warn('Failed to load products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy, egglessOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-rosebakery-600 uppercase tracking-widest">
          Fresh From Our Ovens
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-choco-900">
          {t('catalog.title', 'Our Artisanal Cake Collection')}
        </h1>
        <p className="text-sm text-choco-600">
          {t(
            'catalog.subtitle',
            'Discover exquisite flavors, handcrafted celebration designs, and 100% pure eggless recipes baked to perfection.'
          )}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-rosebakery-100 shadow-soft space-y-4">
        {/* Search & Sort Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-choco-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by cake name or flavor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-rosebakery-100 bg-cream-50/50 text-sm text-choco-900 focus:bg-white focus:border-rosebakery-400 focus:ring-2 focus:ring-rosebakery-100 outline-none transition-all"
            />
          </form>

          {/* Controls: Eggless toggle & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Eggless toggle */}
            <button
              type="button"
              onClick={() => setEgglessOnly(!egglessOnly)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                egglessOnly
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-choco-700 border-rosebakery-200 hover:border-emerald-500'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${egglessOnly ? 'bg-white' : 'bg-emerald-600'}`}></span>
              <span>{t('catalog.egglessOnly', '100% Eggless Only')}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-choco-400 font-medium hidden sm:inline">
                {t('catalog.sortBy', 'Sort')}:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-full border border-rosebakery-200 text-xs font-semibold text-choco-800 bg-white focus:outline-none focus:border-rosebakery-400 cursor-pointer"
              >
                <option value="popular">{t('catalog.sortPopular', 'Most Popular')}</option>
                <option value="price-asc">{t('catalog.sortPriceLowHigh', 'Price: Low to High')}</option>
                <option value="price-desc">{t('catalog.sortPriceHighLow', 'Price: High to Low')}</option>
                <option value="rating">{t('catalog.sortRating', 'Highest Rated')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Tab Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-rosebakery-50 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-rosebakery-500 text-white shadow-xs'
                  : 'bg-cream-100 text-choco-700 hover:bg-rosebakery-100/60'
              }`}
            >
              {cat === 'All' ? t('catalog.filterAll', 'All Cakes') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cakes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-3xl h-96 animate-pulse p-4 border border-rosebakery-100">
              <div className="h-52 bg-rosebakery-50 rounded-2xl mb-4"></div>
              <div className="h-4 bg-rosebakery-100 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-rosebakery-50 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-rosebakery-100 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rosebakery-50 text-rosebakery-500 mx-auto flex items-center justify-center">
            <Cake className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-choco-900">
            {t('catalog.noCakesFound', 'No cakes found')}
          </h3>
          <p className="text-sm text-choco-500 max-w-sm mx-auto">
            We couldn't find any cakes matching your filters. Try clearing your search or selecting another category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setEgglessOnly(false);
            }}
            className="px-6 py-2.5 rounded-full bg-rosebakery-500 text-white text-xs font-bold hover:bg-rosebakery-600 transition-colors shadow-xs"
          >
            {t('catalog.clearFilters', 'Reset Filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((cake) => (
            <ProductCard key={cake._id || cake.id} product={cake} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
