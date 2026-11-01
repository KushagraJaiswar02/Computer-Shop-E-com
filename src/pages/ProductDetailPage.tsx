import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { KeycapButton } from '../components/common/KeycapButton';
import { ProductGallery } from '../features/product/ProductGallery';
import { ProductInfoBox } from '../features/product/ProductInfoBox';
import { ProductSpecsTabs } from '../features/product/ProductSpecsTabs';
import { CompatibleProductsSection } from '../features/product/CompatibleProductsSection';
import { ProductEnquiryModal } from '../features/product/ProductEnquiryModal';
import { getBrandHref } from '../features/catalog/seriesUtils';
import { MoreFromSeries } from '../features/product/MoreFromSeries';
import { StickyCartBar } from '../features/product/StickyCartBar';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    products,
    brands,
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
  } = useStore();

  const product = products.find((p) => p.slug === slug);
  const brand = brands.find(item => item.id === product?.brandId);
  const [quantity, setQuantity] = useState(1);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const priceBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuantity(1);
    setIsEnquiryModalOpen(false);
    window.scrollTo(0, 0);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-main dark:text-main mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-muted mb-6">
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
  const handleAddToCart = () => {
    if (product.stockStatus === 'out_of_stock' || product.stock <= 0) return;
    addToCart(product, Math.max(1, Math.min(quantity, product.stock)));
  };

  // Filter compatible items
  const compatibleProducts = products.filter((p) =>
    product.compatibleAccessories?.includes(p.id)
  );


  return (
    <div className="min-h-screen bg-surface-soft/70 dark:bg-surface/50 pt-6 sm:pt-8 pb-24 lg:pb-8">
      <div className="shop-container ">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted dark:text-muted mb-6 font-sans overflow-x-auto whitespace-nowrap pb-1"
        >
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <Link to="/brands" className="hover:text-accent">Brands</Link>
          <span>/</span>
          <Link to={brand ? getBrandHref(brand) : "/brands"} className="hover:text-accent">
            {product.brandName}
          </Link>
          {product.series?.trim() && (
            <>
              <span>/</span>
              <Link
                to={brand ? getBrandHref(brand, product.series) : "/brands"}
                className="hover:text-accent font-semibold"
              >
                {product.series}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-main dark:text-main font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Primary Product Showcase: Gallery + Info Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
          <div className="lg:col-span-7">
            <ProductGallery
              key={product.id}
              images={product.images}
              name={product.name}
              discountPercent={product.discountPercent}
            />
          </div>

          <div className="lg:col-span-5">
            <ProductInfoBox
              product={product}
              priceBoxRef={priceBoxRef}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              isSaved={isSaved}
              onToggleWishlist={() => toggleWishlist(product.id)}
              isCompared={isCompared}
              onToggleCompare={() => toggleCompare(product.id)}
              onOpenEnquiry={() => setIsEnquiryModalOpen(true)}
            />
          </div>
        </div>

        {/* Detailed specifications and product overview */}
        <ProductSpecsTabs key={product.id} product={product} />

        <MoreFromSeries products={products} current={product} />

        {/* Frequently Bought Together & Compatible Accessories */}
        <CompatibleProductsSection
          products={compatibleProducts}
          onAddToCart={(acc) => addToCart(acc, 1)}
        />
      </div>

      <StickyCartBar
        key={product.id}
        product={product}
        priceBoxRef={priceBoxRef}
        onAddToCart={handleAddToCart}
        isEnquiryOpen={isEnquiryModalOpen}
      />

      {/* Hardware Compatibility Enquiry Modal */}
      <ProductEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={product}
      />
    </div>
  );
};
