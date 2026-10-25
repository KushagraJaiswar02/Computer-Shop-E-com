import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ShoppingBag } from 'lucide-react';
import { KeycapButton } from '../components/common/KeycapButton';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-surface-50 dark:bg-surface-900 flex items-center justify-center p-6 text-center transition-colors">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Hardware Component Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The requested page, hardware SKU, or brand collection does not exist or has been relocated.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link to="/">
            <KeycapButton variant="secondary">
              <Home className="w-4 h-4 mr-1.5" />
              Storefront Home
            </KeycapButton>
          </Link>
          <Link to="/shop">
            <KeycapButton variant="primary">
              <ShoppingBag className="w-4 h-4 mr-1.5" />
              Full Catalog
            </KeycapButton>
          </Link>
        </div>
      </div>
    </div>
  );
};
