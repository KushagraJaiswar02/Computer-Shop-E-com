import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { KeycapButton } from '../components/common/KeycapButton';
import { ProductGallery } from '../features/product/ProductGallery';
import { ProductInfoBox } from '../features/product/ProductInfoBox';
import { ProductSpecsTabs } from '../features/product/ProductSpecsTabs';
import { CompatibleProductsSection } from '../features/product/CompatibleProductsSection';
import { ProductEnquiryModal } from '../features/product/ProductEnquiryModal';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
  } = useStore();

  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested hardware item could not be found or may have been unlisted.
        </p>
        <Link to="/shop">
          <KeycapButton variant="primary">Browse Full Hardware Catalog</KeycapButton>
        </Link>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);

  // Filter compatible items
  const compatibleProducts = products.filter((p) =>
    product.compatibleAccessories?.includes(p.id)
  );


  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-900/50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono overflow-x-auto whitespace-nowrap pb-1"
        >
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link to={`/category/${product.categoryId}`} className="hover:text-blue-600">
            {product.categoryName}
          </Link>
          <span>/</span>
          <Link to={`/brand/${product.brandId}`} className="hover:text-blue-600">
            {product.brandName}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Primary Product Showcase: Gallery + Info Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              name={product.name}
              discountPercent={product.discountPercent}
            />
          </div>

          <div className="lg:col-span-5">
            <ProductInfoBox
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={() => addToCart(product, quantity)}
              isSaved={isSaved}
              onToggleWishlist={() => toggleWishlist(product.id)}
              isCompared={isCompared}
              onToggleCompare={() => toggleCompare(product.id)}
              onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
            />
          </div>
        </div>

        {/* Detailed Tabs: Specs, Architecture Overview, Reviews */}
        <ProductSpecsTabs product={product} />

        {/* Frequently Bought Together & Compatible Accessories */}
        <CompatibleProductsSection
          products={compatibleProducts}
          onAddToCart={(acc) => addToCart(acc, 1)}
        />
      </div>

      {/* Hardware Compatibility Enquiry Modal */}
      <ProductEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={product}
      />
    </div>
  );
};
