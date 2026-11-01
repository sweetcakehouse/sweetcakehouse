import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Cake, Sparkles, Check, X, Upload } from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../../services/api';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Birthday Cakes',
    images: [''],
    availableFlavors: 'Belgian Chocolate, Vanilla Bean, Dutch Truffle',
    weightsWithPrices: [
      { weight: '0.5 kg', price: 499 },
      { weight: '1 kg', price: 899 },
    ],
    isEggless: true,
    egglessAvailability: '100% Eggless',
    inStock: true,
    isFeatured: false,
    rating: 4.9,
  });

  const categories = [
    'Birthday Cakes',
    'Chocolate Cakes',
    'Cheesecakes',
    'Fruit Cakes',
    'Red Velvet',
    'Anniversary Cakes',
    'Eggless Cakes',
    'Designer Cakes',
    'Cupcakes & Pastries',
  ];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts();
      if (res.data && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.warn('Failed to load cakes:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: 'Birthday Cakes',
      images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80'],
      availableFlavors: 'Belgian Chocolate, Vanilla Bean',
      weightsWithPrices: [
        { weight: '0.5 kg', price: 499 },
        { weight: '1 kg', price: 899 },
      ],
      isEggless: true,
      egglessAvailability: '100% Eggless',
      inStock: true,
      isFeatured: false,
      rating: 4.9,
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      category: p.category,
      images: p.images || [''],
      availableFlavors: (p.availableFlavors || []).join(', '),
      weightsWithPrices: p.weightsWithPrices || [{ weight: '1 kg', price: p.price || 500 }],
      isEggless: p.isEggless,
      egglessAvailability: p.egglessAvailability || '100% Eggless',
      inStock: p.inStock,
      isFeatured: p.isFeatured,
      rating: p.rating || 4.9,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        availableFlavors: formData.availableFlavors
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
        availableWeights: formData.weightsWithPrices.map((w) => w.weight),
        price: formData.weightsWithPrices[0]?.price || 499,
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete cake "${name}"?`)) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const addWeightRow = () => {
    setFormData({
      ...formData,
      weightsWithPrices: [...formData.weightsWithPrices, { weight: '1.5 kg', price: 1299 }],
    });
  };

  const removeWeightRow = (idx) => {
    const updated = formData.weightsWithPrices.filter((_, i) => i !== idx);
    setFormData({ ...formData, weightsWithPrices: updated });
  };

  const updateWeightField = (idx, field, value) => {
    const updated = [...formData.weightsWithPrices];
    updated[idx][field] = field === 'price' ? Number(value) : value;
    setFormData({ ...formData, weightsWithPrices: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-choco-900">
            Cake Catalog & Menu Management
          </h1>
          <p className="text-xs text-choco-500 mt-1">
            Add new cake flavors, configure weights, prices, eggless availability, and featured flags
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Cake</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-rosebakery-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-choco-400">Loading cake menu...</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-xs text-choco-400">
            No cakes found. Click "Add New Cake" to create your first cake product!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-choco-700">
              <thead className="bg-cream-100/60 uppercase font-bold text-choco-500 border-b border-rosebakery-100 text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Cake</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Starting Price</th>
                  <th className="px-6 py-4">Weights</th>
                  <th className="px-6 py-4">Dietary</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rosebakery-50">
                {products.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p.images && p.images[0]
                              ? p.images[0]
                              : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-rosebakery-50 border border-rosebakery-100"
                        />
                        <div>
                          <div className="font-serif font-bold text-choco-900 text-sm">{p.name}</div>
                          <div className="text-[11px] text-choco-400 truncate max-w-xs">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rosebakery-50 text-rosebakery-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-serif font-bold text-rosebakery-600 text-sm">
                      ₹{p.price || (p.weightsWithPrices && p.weightsWithPrices[0]?.price) || 499}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-choco-600">
                        {p.weightsWithPrices ? p.weightsWithPrices.length : 1} options
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.isEggless ? (
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 100% Eggless
                        </span>
                      ) : (
                        <span className="text-choco-400 text-[11px]">Regular</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Bestseller
                        </span>
                      ) : (
                        <span className="text-choco-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 text-choco-600 hover:text-choco-900 hover:bg-cream-100 rounded-xl transition-colors"
                        title="Edit cake"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id || p.id, p.name)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete cake"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Cake Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl border border-rosebakery-100">
            <div className="flex items-center justify-between pb-3 border-b border-rosebakery-100">
              <h3 className="font-serif text-xl font-bold text-choco-900">
                {editingProduct ? 'Edit Cake Details' : 'Add New Cake To Menu'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-choco-400 hover:text-choco-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-choco-900 mb-1">Cake Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Belgian Chocolate Ganache Cake"
                  className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-choco-900 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-rosebakery-100 text-xs bg-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-choco-900 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-rosebakery-100 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-choco-900 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the layers, sponge, cream, and flavor notes..."
                  className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-sm outline-none"
                ></textarea>
              </div>

              {/* Cake Image URL */}
              <div>
                <label className="block font-bold text-choco-900 mb-1">Primary Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-xs outline-none"
                />
              </div>

              {/* Flavors */}
              <div>
                <label className="block font-bold text-choco-900 mb-1">
                  Available Flavors (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.availableFlavors}
                  onChange={(e) => setFormData({ ...formData, availableFlavors: e.target.value })}
                  placeholder="Belgian Chocolate, Vanilla Bean, Caramel"
                  className="w-full px-4 py-2.5 rounded-xl border border-rosebakery-100 text-xs outline-none"
                />
              </div>

              {/* Weights and Prices Builder */}
              <div className="space-y-2 pt-2 border-t border-rosebakery-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-choco-900">Weights & Corresponding Prices</label>
                  <button
                    type="button"
                    onClick={addWeightRow}
                    className="text-xs text-rosebakery-600 font-bold hover:underline"
                  >
                    + Add Weight Option
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.weightsWithPrices.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Weight (e.g. 1 kg)"
                        value={row.weight}
                        onChange={(e) => updateWeightField(idx, 'weight', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-rosebakery-100 text-xs"
                      />
                      <div className="flex items-center gap-1">
                        <span className="font-bold">₹</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={row.price}
                          onChange={(e) => updateWeightField(idx, 'price', e.target.value)}
                          className="w-24 px-3 py-2 rounded-xl border border-rosebakery-100 text-xs"
                        />
                      </div>
                      {formData.weightsWithPrices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWeightRow(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-3 border-t border-rosebakery-100">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-choco-800">
                  <input
                    type="checkbox"
                    checked={formData.isEggless}
                    onChange={(e) => setFormData({ ...formData, isEggless: e.target.checked })}
                    className="rounded text-rosebakery-500"
                  />
                  <span>100% Eggless Pure Veg</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-choco-800">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-rosebakery-500"
                  />
                  <span>Feature as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-choco-800">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded text-rosebakery-500"
                  />
                  <span>Available In Stock</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-choco-200 text-xs font-bold hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-rosebakery-500 hover:bg-rosebakery-600 text-white text-xs font-bold shadow-md"
                >
                  Save Cake Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;

