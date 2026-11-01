import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { useCategoryDirectory } from '../features/catalog/useCategoryDirectory';

export const CategoryPage: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId?: string }>();
  const { products } = useStore();
  const categories = useCategoryDirectory();

  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-main dark:text-main mb-2">Category Not Found</h2>
        <p className="text-sm text-muted mb-6">The hardware category you requested does not exist.</p>
        <Link to="/shop" className="text-accent hover:underline">
          Return to full catalog
        </Link>
      </div>
    );
  }

  let catProducts = products.filter(p => p.categoryId === category.id);
  if (subcategoryId) {
    catProducts = catProducts.filter(p => p.subcategoryId === subcategoryId);
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background py-8 transition-colors">
      <div className="shop-container ">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted dark:text-muted mb-4 font-sans">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-accent">Categories</Link>
          <span>/</span>
          <span className="text-main dark:text-main font-semibold">{category.name}</span>
        </div>

        {/* Hero Header for Category */}
        <div className="relative rounded-2xl bg-inverse text-inverse-ink overflow-hidden p-6 sm:p-10 mb-8 border border-border">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-sans uppercase tracking-wider text-accent font-bold block mb-1">
              Hardware category
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {category.name}
            </h1>
            <p className="text-sm text-muted leading-relaxed mb-6">
              {category.description}
            </p>

            {/* Subcategory quick pills */}
            <div className="flex flex-wrap gap-2">
              <Link
                to={category.href}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  !subcategoryId
                    ? 'bg-primary border-primary text-on-primary shadow-keycap'
                    : 'bg-overlay/80 border-border text-muted hover:bg-inverse'
                }`}
              >
                All {category.name}
              </Link>
              {category.subcategories.map(sub => {
                const isActive = subcategoryId === sub.id;
                return (
                  <Link
                    key={sub.id}
                    to={sub.href}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      isActive
                        ? 'bg-primary border-primary text-on-primary shadow-keycap'
                        : 'bg-overlay/80 border-border text-muted hover:bg-inverse'
                    }`}
                  >
                    {sub.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted dark:text-muted">
          <div>
            Showing <span className="font-sans font-bold text-main dark:text-main">{catProducts.length}</span> components in stock
          </div>
          <Link
            to={category.href}
            className="text-accent dark:text-accent hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open in Full Filter Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {catProducts.length === 0 ? (
          <div className="p-12 text-center bg-surface dark:bg-surface rounded-xl border border-border dark:border-border">
            <p className="text-muted dark:text-main font-medium">No items found in this subcategory.</p>
            <Link to={category.href} className="text-xs text-accent hover:underline mt-2 inline-block">
              View all {category.name}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
