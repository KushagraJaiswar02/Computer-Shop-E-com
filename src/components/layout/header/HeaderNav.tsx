import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const links = [
  { label: 'All products', to: '/shop' },
  { label: 'Laptops', to: '/category/laptops' },
  { label: 'Graphics cards', to: '/category/graphics-cards' },
  { label: 'Processors', to: '/category/processors' },
  { label: 'Memory', to: '/category/memory-ram' },
  { label: 'Monitors', to: '/category/monitors' },
];

export const HeaderNav: React.FC = () => (
  <nav aria-label="Main navigation" className="hidden border-t border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70 lg:block">
    <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-xs font-semibold sm:px-6 lg:px-8">
      <div className="flex items-center gap-1">
        {links.map(link => <Link key={link.to} to={link.to} className="rounded-md px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">{link.label}</Link>)}
        <Link to="/shop?deal=true" className="flex items-center gap-1 rounded-md px-3 py-1.5 font-bold text-amber-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-amber-300 dark:hover:bg-slate-800"><Sparkles className="h-3.5 w-3.5" />Deals</Link>
      </div>
      <Link to="/enquiry" className="rounded-md px-3 py-1.5 text-slate-500 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-400 dark:hover:text-blue-300">Product enquiry</Link>
    </div>
  </nav>
);
