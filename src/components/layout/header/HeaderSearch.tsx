import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { KeyBadge } from '../../common/KeyBadge';

export const HeaderSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { registerSearchInputRef } = useStore();

  useEffect(() => {
    registerSearchInputRef(searchInputRef);
  }, [registerSearchInputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
      searchInputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md mx-2 sm:mx-6">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products, GPUs, laptops, processors..."
          className="w-full pl-9 pr-12 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <KeyBadge>/</KeyBadge>
        </div>
      </div>
    </form>
  );
};
