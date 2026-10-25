import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId?: string }>();
  const { categories, products } = useStore();

  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Category Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The hardware category you requested does not exist.</p>
        <Link to="/shop" className="text-brand-600 hover:underline">
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
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-600">Categories</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold">{category.name}</span>
        </div>

        {/* Hero Header for Category */}
        <div className="relative rounded-2xl bg-slate-900 text-white overflow-hidden p-6 sm:p-10 mb-8 border border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-400 font-bold block mb-1">
              Hardware category
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {category.name}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {category.description}
            </p>

            {/* Subcategory quick pills */}
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/category/${category.id}`}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  !subcategoryId
                    ? 'bg-brand-600 border-brand-500 text-white shadow-keycap'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All {category.name}
              </Link>
              {category.subcategories.map(sub => {
                const isActive = subcategoryId === sub.id;
                return (
                  <Link
                    key={sub.id}
                    to={`/category/${category.id}/${sub.id}`}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 border-brand-500 text-white shadow-keycap'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
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
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-mono font-bold text-slate-900 dark:text-white">{catProducts.length}</span> components in stock
          </div>
          <Link
            to={`/shop?category=${category.id}`}
            className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open in Full Filter Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {catProducts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-surface-850 rounded-xl border border-slate-200 dark:border-surface-750">
            <p className="text-slate-600 dark:text-slate-300 font-medium">No items found in this subcategory.</p>
            <Link to={`/category/${category.id}`} className="text-xs text-brand-600 hover:underline mt-2 inline-block">
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
