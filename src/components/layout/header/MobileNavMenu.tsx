import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { CategoryDirectoryEntry } from '../../../data/categories';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryDirectoryEntry[];
  id: string;
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ isOpen, onClose, categories, id }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!isOpen) return null;
  return (
    <nav id={id} aria-label="Product categories" className="category-mega-panel category-mobile-panel">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <Link to="/shop" onClick={onClose} className="category-menu-all">All Categories<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        <div className="mt-3 space-y-1">
          {categories.map(category => {
            const Icon = category.icon;
            const open = expanded === category.slug;
            const panelId = `${id}-${category.slug}`;
            return category.count === 0 ? <div key={category.slug} className="category-menu-empty"><Icon aria-hidden="true" className="h-4 w-4" /><span>{category.name}</span><small>Coming soon</small></div> : (
              <div key={category.slug}>
                <button type="button" className="category-mobile-category" aria-expanded={open} aria-controls={panelId} onClick={() => setExpanded(current => current === category.slug ? null : category.slug)}>
                  <Icon aria-hidden="true" className="h-4 w-4" /><span>{category.name}</span><ChevronDown aria-hidden="true" className={`ml-auto h-4 w-4 ${open ? 'rotate-180' : ''}`} />
                </button>
                <div id={panelId} hidden={!open} className="category-mobile-links">
                  {category.subcategories.map(subcategory => <Link key={subcategory.id} to={subcategory.href} onClick={onClose}>{subcategory.name}</Link>)}
                  <Link to={category.href} onClick={onClose} className="font-semibold">View all {category.name}<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
