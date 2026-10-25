import React from 'react';
import { Layers, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminCategoriesBrandsPage: React.FC = () => {
  const { categories, brands } = useStore();

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Categories & Brand Hierarchy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Catalog structure modeling brands, subcategories, series lines, and technical attributes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories & Subcategories */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-slate-800">
            <Layers className="w-5 h-5 text-brand-400" />
            <span>Hardware Domains ({categories.length})</span>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {categories.map(cat => (
              <div key={cat.id} className="py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{cat.name}</span>
                  <span className="font-mono text-slate-500 text-[10px]">{cat.id}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.subcategories.map(sub => (
                    <span
                      key={sub.id}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brands & Series */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-slate-800">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
            <span>Brands & Product Lines ({brands.length})</span>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {brands.map(brand => (
              <div key={brand.id} className="py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{brand.name}</span>
                  <span className="font-mono text-slate-500 text-[10px]">{brand.seriesList.length} Series</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {brand.seriesList.map(s => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-brand-300 font-mono text-[10px]"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
