import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Laptop, Cpu, HardDrive, Database, Server, Monitor, Keyboard, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KeyBadge } from '../common/KeyBadge';

export const CategoryNavDrawer: React.FC = () => {
  const { isCategoryNavOpen, setIsCategoryNavOpen, categories } = useStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || 'laptops');

  if (!isCategoryNavOpen) return null;

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];

  const getIcon = (name: string) => {
    switch (name) {
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'HardDrive': return <HardDrive className="w-4 h-4" />;
      case 'Database': return <Database className="w-4 h-4" />;
      case 'Server': return <Server className="w-4 h-4" />;
      case 'Monitor': return <Monitor className="w-4 h-4" />;
      case 'Keyboard': return <Keyboard className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCategoryNavOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-2xl bg-white dark:bg-surface-850 shadow-2xl flex flex-col border-r border-slate-200 dark:border-surface-700 animate-slide-right">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-surface-700 flex items-center justify-between bg-slate-50/60 dark:bg-surface-900/60">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                Hardware Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse all component categories and sub-architectures
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <KeyBadge>Esc</KeyBadge>
              <button
                onClick={() => setIsCategoryNavOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                aria-label="Close directory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dual-column browser */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Category Column */}
            <div className="w-1/2 border-r border-slate-200 dark:border-surface-750 overflow-y-auto p-2 sm:p-3 space-y-1 bg-slate-50/40 dark:bg-surface-900/40">
              {categories.map(cat => {
                const isActive = cat.id === selectedCategoryId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-keycap'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className={isActive ? 'text-white' : 'text-brand-500'}>
                        {getIcon(cat.iconName)}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ml-1 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Subcategory & Preview Column */}
            <div className="w-1/2 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
              {selectedCategory && (
                <div>
                  <div className="mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold">
                      Category Overview
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedCategory.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3">
                      {selectedCategory.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Subcategories
                    </h4>
                    <div className="divide-y divide-slate-100 dark:divide-surface-800">
                      {selectedCategory.subcategories.map(sub => (
                        <Link
                          key={sub.id}
                          to={`/shop?category=${selectedCategory.id}&subcategory=${sub.id}`}
                          onClick={() => setIsCategoryNavOpen(false)}
                          className="flex items-center justify-between py-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
                        >
                          <span>{sub.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all text-brand-500" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {selectedCategory.featuredTechSpecs && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-surface-800/80 border border-slate-200 dark:border-surface-700">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1.5">
                        Key Specifications Tracked:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedCategory.featuredTechSpecs.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-surface-700 border border-slate-200 dark:border-surface-650 text-slate-700 dark:text-slate-300 font-mono"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-surface-750">
                <Link
                  to={`/category/${selectedCategory.id}`}
                  onClick={() => setIsCategoryNavOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-surface-800 dark:hover:bg-surface-700 text-slate-800 dark:text-white transition-colors"
                >
                  <span>View All in {selectedCategory.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
