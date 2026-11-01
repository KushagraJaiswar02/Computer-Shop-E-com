import React from 'react';

interface KeyBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const KeyBadge: React.FC<KeyBadgeProps> = ({ children, className = '' }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-sans font-medium tracking-tight text-muted bg-surface-soft dark:bg-surface-elevated dark:text-muted border border-border dark:border-border rounded shadow-keycap dark:shadow-keycap-dark select-none ${className}`}
    >
      {children}
    </kbd>
  );
};
