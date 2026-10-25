import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KeyBadge } from '../common/KeyBadge';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useStore();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: '/', description: 'Focus product search bar anywhere on the site' },
    { key: 'C', description: 'Open Left-Side Radial Navigation Wheel (Explore)' },
    { key: 'W', description: 'Navigate directly to your Saved Wishlist' },
    { key: 'K', description: 'Open or close the Quick Shopping Cart drawer' },
    { key: 'L', description: 'Add/remove currently focused hardware product to Wishlist' },
    { key: '?', description: 'Toggle this keyboard shortcut guide' },
    { key: 'Esc', description: 'Close active modal, cart drawer, or navigation menu' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsShortcutsModalOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-surface-850 rounded-xl shadow-2xl border border-slate-200 dark:border-surface-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-surface-700 bg-slate-50/50 dark:bg-surface-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-lg border border-brand-200 dark:border-brand-800/50">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Keyboard Navigation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Power-user hardware browsing shortcuts</p>
            </div>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            aria-label="Close shortcuts guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 divide-y divide-slate-100 dark:divide-surface-800">
          <div className="space-y-3 pb-4">
            {shortcuts.map((sc, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-1.5">
                <span className="text-slate-700 dark:text-slate-300 font-medium">{sc.description}</span>
                <KeyBadge className="text-xs px-2.5 py-1 min-w-[28px]">{sc.key}</KeyBadge>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
            <Command className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span>Shortcuts are automatically paused while typing in search or form fields.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-surface-900 border-t border-slate-100 dark:border-surface-750 flex justify-end">
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-surface-800 border border-slate-300 dark:border-surface-650 rounded-md hover:bg-slate-50 dark:hover:bg-surface-750 shadow-keycap dark:shadow-keycap-dark active:shadow-keycap-pressed transition-all"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
