import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Scale,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  HelpCircle,
  MessageSquare,
  Star,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/utils';
import { KeycapButton } from '../components/common/KeycapButton';
import { KeyBadge } from '../components/common/KeyBadge';
import { SAMPLE_REVIEWS } from '../data/mockData';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
  } = useStore();

  const product = products.find(p => p.slug === slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'reviews'>('specs');
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The hardware product you requested does not exist or has been relocated.</p>
        <Link to="/shop">
          <KeycapButton variant="primary">Browse Full Hardware Catalog</KeycapButton>
        </Link>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);

  // Group attributes by section
  const groupedAttributes: Record<string, typeof product.attributes> = {};
  product.attributes.forEach(attr => {
    const grp = attr.group || 'Technical Details';
    if (!groupedAttributes[grp]) groupedAttributes[grp] = [];
    groupedAttributes[grp].push(attr);
  });

  // Compatible accessories
  const compatibleProducts = products.filter(p =>
    product.compatibleAccessories?.includes(p.id)
  );

  // Reviews for this product
  const productReviews = SAMPLE_REVIEWS.filter(r => r.productId === product.id);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.categoryId}`} className="hover:text-brand-600">
            {product.categoryName}
          </Link>
          <span>/</span>
          <Link to={`/brand/${product.brandId}`} className="hover:text-brand-600">
            {product.brandName}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </div>

        {/* Top Product View: Gallery + Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Main Image */}
            <div className="relative aspect-4/3 rounded-2xl bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-750 flex items-center justify-center p-6 overflow-hidden shadow-soft-card">
              {product.discountPercent && product.discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-mono font-bold shadow-xs">
                  SAVE {product.discountPercent}%
                </div>
              )}

              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-all duration-300"
              />
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl bg-white dark:bg-surface-850 border-2 p-1.5 flex items-center justify-center overflow-hidden transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-brand-600 shadow-keycap'
                        : 'border-slate-200 dark:border-surface-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Pricing & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Brand, Series & SKU */}
              <div className="flex items-center justify-between">
                <Link
                  to={`/brand/${product.brandId}`}
                  className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {product.brandName} {product.seriesName ? `• ${product.seriesName}` : ''}
                </Link>
                <span className="text-xs font-mono text-slate-500">
                  SKU: <strong className="text-slate-800 dark:text-slate-200">{product.sku}</strong>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-400">({product.reviewCount || 0} reviews)</span>
                </div>
              )}

              {/* Short summary */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-100/60 dark:bg-surface-800/60 p-3.5 rounded-xl border border-slate-200/70 dark:border-surface-700">
                {product.shortDescription}
              </p>

              {/* Price block */}
              <div className="p-4 rounded-xl bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-750 shadow-soft-card">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base font-mono text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-surface-750">
                  <div className="flex items-center gap-1.5 font-medium">
                    {product.stockStatus === 'in_stock' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          In Stock ({product.stock} units ready to ship)
                        </span>
                      </>
                    ) : product.stockStatus === 'low_stock' ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span className="text-amber-700 dark:text-amber-400 font-semibold">
                          Low Stock - Only {product.stock} remaining
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-500">Currently out of stock</span>
                    )}
                  </div>

                  <span className="text-slate-500 font-mono text-[11px]">
                    {product.warrantyMonths} Mo. Warranty
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-850 shadow-keycap">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="p-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-sm font-mono font-bold text-slate-800 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      className="p-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <KeycapButton
                    variant="primary"
                    size="lg"
                    disabled={product.stockStatus === 'out_of_stock'}
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 font-bold shadow-elevated"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart • {formatPrice(product.price * quantity)}
                  </KeycapButton>
                </div>

                {/* Secondary Wishlist / Compare / Enquiry buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border shadow-keycap transition-all ${
                      isSaved
                        ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400'
                        : 'bg-white dark:bg-surface-850 border-slate-300 dark:border-surface-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Wishlist'}</span>
                  </button>

                  <button
                    onClick={() => toggleCompare(product.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border shadow-keycap transition-all ${
                      isCompared
                        ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-950/60 dark:border-brand-900 dark:text-brand-400'
                        : 'bg-white dark:bg-surface-850 border-slate-300 dark:border-surface-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare</span>
                  </button>

                  <button
                    onClick={() => setIsEnquiryModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border border-slate-300 dark:border-surface-700 bg-white dark:bg-surface-850 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-keycap transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ask Tech</span>
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-slate-200 dark:border-surface-750 grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{product.warrantyMonths} Months Direct Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span>Free Express over $299</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span>30-Day DOA Swap Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span>Sealed Anti-Static Packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Technical Specifications, Overview, Reviews */}
        <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 shadow-soft-card overflow-hidden mb-12">
          {/* Tab Header Buttons */}
          <div className="flex border-b border-slate-200 dark:border-surface-750 bg-slate-50/70 dark:bg-surface-900/50">
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-3.5 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'specs'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-surface-850'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Technical Specifications ({product.attributes.length})
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3.5 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'description'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-surface-850'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Architectural Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3.5 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-surface-850'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Customer Reviews ({productReviews.length})
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'specs' && (
              <div className="space-y-6">
                {Object.entries(groupedAttributes).map(([groupName, attrs]) => (
                  <div key={groupName} className="space-y-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      {groupName}
                    </h3>
                    <div className="rounded-xl border border-slate-200 dark:border-surface-750 overflow-hidden divide-y divide-slate-100 dark:divide-surface-750 text-xs sm:text-sm">
                      {attrs.map((attr, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row py-2.5 px-4 bg-white dark:bg-surface-850 hover:bg-slate-50/50 dark:hover:bg-surface-800/50"
                        >
                          <span className="w-full sm:w-1/3 font-medium text-slate-500 dark:text-slate-400 font-mono">
                            {attr.name}
                          </span>
                          <span className="w-full sm:w-2/3 font-semibold text-slate-800 dark:text-slate-100 mt-0.5 sm:mt-0">
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'description' && (
              <div className="max-w-3xl space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>{product.description}</p>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-800 border border-slate-200 dark:border-surface-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    Authentic Factory Packaging Notice
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All components are shipped brand new in sealed retail boxes with serial number barcodes verified for manufacturer warranty registration.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {productReviews.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">
                    No customer reviews recorded yet for this specific SKU in this prototype.
                  </p>
                ) : (
                  productReviews.map(rev => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-surface-750 bg-slate-50/50 dark:bg-surface-800/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {rev.authorName}
                          </span>
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded font-mono">
                            Verified Rig
                          </span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        "{rev.title}"
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Compatible Accessories Section */}
        {compatibleProducts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-500" />
              <span>Recommended Compatible Hardware & Peripherals</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {compatibleProducts.map(acc => (
                <div
                  key={acc.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-surface-750 bg-white dark:bg-surface-850 flex items-center justify-between gap-4 shadow-soft-card"
                >
                  <img
                    src={acc.images[0]}
                    alt={acc.name}
                    className="w-16 h-16 object-contain rounded-lg bg-slate-50 dark:bg-surface-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${acc.slug}`}
                      className="text-xs font-bold text-slate-800 dark:text-white hover:text-brand-600 line-clamp-1"
                    >
                      {acc.name}
                    </Link>
                    <span className="font-mono text-sm font-bold text-brand-600 dark:text-brand-400 block mt-1">
                      {formatPrice(acc.price)}
                    </span>
                  </div>
                  <KeycapButton size="sm" variant="secondary" onClick={() => addToCart(acc, 1)}>
                    Add
                  </KeycapButton>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsEnquiryModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-700 shadow-2xl p-6 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {enquirySuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Technical Enquiry Received!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Our hardware specialist will review your question regarding {product.name} and respond with compatibility confirmation shortly.
                </p>
                <div className="pt-4">
                  <KeycapButton
                    variant="primary"
                    onClick={() => {
                      setIsEnquiryModalOpen(false);
                      setEnquirySuccess(false);
                    }}
                  >
                    Done
                  </KeycapButton>
                </div>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setEnquirySuccess(true);
                }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Hardware Compatibility Enquiry
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Consult our engineers regarding {product.name} (SKU: {product.sku})
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Liam Foster"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="liam@example.com"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Your Target Setup / Question
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Will this GPU fit in a Lian Li O11 Mini with a side radiator? What PSU wattage is recommended?"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-surface-750">
                  <KeycapButton
                    type="button"
                    variant="outline"
                    onClick={() => setIsEnquiryModalOpen(false)}
                  >
                    Cancel
                  </KeycapButton>
                  <KeycapButton type="submit" variant="primary">
                    Submit Question
                  </KeycapButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
