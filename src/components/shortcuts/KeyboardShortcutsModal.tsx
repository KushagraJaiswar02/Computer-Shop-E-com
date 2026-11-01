import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KeyBadge } from '../common/KeyBadge';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useStore();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: '/', description: 'Focus product search bar anywhere on the site' },
    { key: 'C', description: 'Open product comparison' },
    { key: 'W', description: 'Navigate directly to your Saved Wishlist' },
    { key: 'K', description: 'Open or close the Quick Shopping Cart drawer' },
    { key: 'L', description: 'Add/remove currently focused hardware product to Wishlist' },
    { key: '?', description: 'Toggle this keyboard shortcut guide' },
    { key: 'Esc', description: 'Close active modal, cart drawer, or navigation menu' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsShortcutsModalOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-surface dark:bg-surface rounded-xl shadow-2xl border border-border dark:border-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-border bg-surface-soft/50 dark:bg-background/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-accent/10 dark:bg-accent/10 text-accent dark:text-accent rounded-lg border border-primary dark:border-primary/50">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-main dark:text-main">Keyboard Navigation</h3>
              <p className="text-xs text-muted dark:text-muted">Power-user hardware browsing shortcuts</p>
            </div>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-1 text-muted hover:text-muted dark:hover:text-main rounded-lg transition-colors"
            aria-label="Close shortcuts guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 divide-y divide-border dark:divide-border">
          <div className="space-y-3 pb-4">
            {shortcuts.map((sc, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-1.5">
                <span className="text-main dark:text-main font-medium">{sc.description}</span>
                <KeyBadge className="text-xs px-2.5 py-1 min-w-[28px]">{sc.key}</KeyBadge>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center space-x-3 text-xs text-muted dark:text-muted">
            <Command className="w-4 h-4 text-accent flex-shrink-0" />
            <span>Shortcuts are automatically paused while typing in search or form fields.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-soft dark:bg-background border-t border-border dark:border-border flex justify-end">
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-main dark:text-main bg-surface dark:bg-surface-elevated border border-border dark:border-border rounded-md hover:bg-surface-soft dark:hover:bg-surface-soft shadow-keycap dark:shadow-keycap-dark active:shadow-keycap-pressed transition-all"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
