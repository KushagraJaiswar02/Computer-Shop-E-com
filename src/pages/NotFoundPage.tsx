import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ShoppingBag } from 'lucide-react';
import { KeycapButton } from '../components/common/KeycapButton';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="shop-container min-h-[70vh] bg-background dark:bg-background flex items-center justify-center py-6 text-center transition-colors">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 dark:bg-accent/10 text-accent dark:text-accent border border-primary dark:border-primary flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <span className="font-sans text-xs font-bold text-muted uppercase tracking-widest">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-main dark:text-main">
          Hardware Component Not Found
        </h1>
        <p className="text-xs sm:text-sm text-muted dark:text-muted leading-relaxed">
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
