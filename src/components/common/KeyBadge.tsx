import React from 'react';

interface KeyBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const KeyBadge: React.FC<KeyBadgeProps> = ({ children, className = '' }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-medium tracking-tight text-slate-500 bg-slate-100 dark:bg-surface-800 dark:text-slate-400 border border-slate-300 dark:border-surface-700 rounded shadow-keycap dark:shadow-keycap-dark select-none ${className}`}
    >
      {children}
    </kbd>
  );
};
