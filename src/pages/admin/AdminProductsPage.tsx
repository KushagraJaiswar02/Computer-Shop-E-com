import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, StockStatus } from '../../types';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, brands, addProduct, updateProduct, deleteProduct } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for creating / editing
  const [formName, setFormName] = useState('');
  const [formBrandId, setFormBrandId] = useState('asus');
  const [formCategoryId, setFormCategoryId] = useState('graphics-cards');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState(999.99);
  const [formStock, setFormStock] = useState(10);
  const [formStockStatus, setFormStockStatus] = useState<StockStatus>('in_stock');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrandId(p.brandId);
    setFormCategoryId(p.categoryId);
    setFormSku(p.sku);
    setFormPrice(p.price);
    setFormStock(p.stock);
    setFormStockStatus(p.stockStatus);
    setFormShortDesc(p.shortDescription);
    setFormImageUrl(p.images[0] || '');
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrandId('asus');
    setFormCategoryId('graphics-cards');
    setFormSku(`SKU-${Math.floor(10000 + Math.random() * 90000)}`);
    setFormPrice(799.99);
    setFormStock(15);
    setFormStockStatus('in_stock');
    setFormShortDesc('Enthusiast-grade component featuring premium cooling and high sustained boost frequencies.');
    setFormImageUrl('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80');
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const brand = brands.find(b => b.id === formBrandId);
    const category = categories.find(c => c.id === formCategoryId);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        brandId: formBrandId,
        brandName: brand?.name || 'ASUS',
        categoryId: formCategoryId,
        categoryName: category?.name || 'Components',
        sku: formSku,
        price: formPrice,
        stock: formStock,
        stockStatus: formStockStatus,
        shortDescription: formShortDesc,
        images: [formImageUrl, ...(editingProduct.images.slice(1))],
      });
    } else {
      const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newProd: Product = {
        id: `prod-custom-${Date.now()}`,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        name: formName,
        brandId: formBrandId,
        brandName: brand?.name || 'ASUS',
        categoryId: formCategoryId,
        categoryName: category?.name || 'Components',
        sku: formSku,
        price: formPrice,
        stock: formStock,
        stockStatus: formStockStatus,
        shortDescription: formShortDesc,
        description: `${formName}. Built with premium hardware silicon and backed by official warranty.`,
        images: [formImageUrl],
        attributes: [
          { name: 'Model SKU', value: formSku, group: 'General' },
          { name: 'Factory Condition', value: 'Brand New Sealed Retail', group: 'General' },
        ],
        warrantyMonths: 36,
        createdAt: new Date().toISOString(),
      };
      addProduct(newProd);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Product Catalog Inventory ({products.length} SKUs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage live computer hardware SKUs, prices, stock allocations, and technical details.
          </p>
        </div>

        <KeycapButton variant="primary" size="sm" onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Hardware Product
        </KeycapButton>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, product name, or brand..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-soft-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
            <tr>
              <th className="p-3.5">Component</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Price</th>
              <th className="p-3.5">Stock Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredProducts.map(prod => (
              <tr key={prod.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3.5 flex items-center gap-3">
                  <img
                    src={prod.images[0]}
                    alt=""
                    className="w-10 h-10 object-contain rounded bg-slate-900 border border-slate-800 p-1 flex-shrink-0"
                  />
                  <div>
                    <span className="font-bold text-white block line-clamp-1">{prod.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      SKU: {prod.sku} • {prod.brandName}
                    </span>
                  </div>
                </td>

                <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                  {prod.categoryName}
                </td>

                <td className="p-3.5 font-mono font-bold text-white">
                  {formatPrice(prod.price)}
                </td>

                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        prod.stockStatus === 'in_stock'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                          : prod.stockStatus === 'low_stock'
                          ? 'bg-amber-950 text-amber-400 border border-amber-900'
                          : 'bg-rose-950 text-rose-400 border border-rose-900'
                      }`}
                    >
                      {prod.stock} units
                    </span>
                    {/* Inline stock adjustment */}
                    <button
                      onClick={() =>
                        updateProduct(prod.id, {
                          stock: Math.max(0, prod.stock - 1),
                          stockStatus: prod.stock - 1 <= 0 ? 'out_of_stock' : prod.stock - 1 < 5 ? 'low_stock' : 'in_stock',
                        })
                      }
                      className="px-1 text-slate-500 hover:text-white"
                      title="Decrease stock"
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        updateProduct(prod.id, {
                          stock: prod.stock + 1,
                          stockStatus: prod.stock + 1 < 5 ? 'low_stock' : 'in_stock',
                        })
                      }
                      className="px-1 text-slate-500 hover:text-white"
                      title="Increase stock"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                      title="Edit product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete ${prod.name} from prototype catalog?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                      title="Delete SKU"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create / Edit Product */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 text-xs overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                {editingProduct ? 'Edit Hardware SKU' : 'Add New Hardware SKU'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. ASUS ROG Strix GeForce RTX 4080 SUPER 16GB"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Brand</label>
                  <select
                    value={formBrandId}
                    onChange={e => setFormBrandId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={e => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">SKU Barcode</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={e => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={e => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formShortDesc}
                  onChange={e => setFormShortDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <KeycapButton
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </KeycapButton>
                <KeycapButton type="submit" variant="primary">
                  Save to Demo Database
                </KeycapButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
