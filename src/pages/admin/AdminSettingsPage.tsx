import React, { useState } from 'react';
import { RotateCcw, Check, Database, ShieldAlert } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KeycapButton } from '../../components/common/KeycapButton';

export const AdminSettingsPage: React.FC = () => {
  const { resetHomepageConfig } = useStore();
  const [resetDone, setResetDone] = useState(false);

  const handleResetLocalStorage = () => {
    if (confirm('Reset all demo catalog mutations, custom orders, and homepage modifications to initial factory values?')) {
      localStorage.clear();
      resetHomepageConfig();
      setResetDone(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Demo Storefront Configuration & State
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Settings for the prototype environment, data caching, and sample state storage.
        </p>
      </div>

      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-6 text-xs">
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-400" />
            <span>Local Demonstration Persistence</span>
          </h3>
          <p className="text-slate-400 leading-relaxed">
            All prototype mutations — such as newly added hardware items, updated stock levels, reordered homepage blocks, customer orders, and saved wishlists — are persisted safely in the browser's LocalStorage. This allows showing realistic dynamic capabilities to the shop owner without requiring an active database connection.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white">Reset Demo Environment</h4>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Restore default products, sample orders, and original homepage order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {resetDone && (
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Reset Complete! Reloading...
              </span>
            )}
            <KeycapButton
              variant="danger"
              size="sm"
              onClick={handleResetLocalStorage}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset All Demo State
            </KeycapButton>
          </div>
        </div>
      </div>
    </div>
  );
};
