import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface KeycapButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  shortcutHint?: string;
  isLoading?: boolean;
}

export const KeycapButton: React.FC<KeycapButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  shortcutHint,
  isLoading = false,
  onClick,
  disabled,
  ...props
}) => {
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    // Calculate ripple origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y, id: Date.now() });

    setTimeout(() => {
      setRipple(null);
    }, 450);

    if (onClick) onClick(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all select-none overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-900 disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px]';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-brand-600 hover:bg-brand-500 text-white border border-brand-700 shadow-keycap active:shadow-keycap-pressed',
    secondary:
      'bg-slate-100 hover:bg-slate-200 dark:bg-surface-800 dark:hover:bg-surface-750 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-surface-700 shadow-keycap dark:shadow-keycap-dark active:shadow-keycap-pressed',
    outline:
      'bg-transparent hover:bg-slate-50 dark:hover:bg-surface-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-surface-700 active:bg-slate-100 dark:active:bg-surface-750',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-surface-800 text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-surface-750',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white border border-rose-700 shadow-keycap active:shadow-keycap-pressed',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Ripple Animation */}
      {ripple && (
        <span
          className="pointer-events-none absolute w-12 h-12 rounded-full bg-white/30 animate-ripple -translate-x-1/2 -translate-y-1/2"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}

      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}

      <span>{children}</span>

      {shortcutHint && (
        <kbd className="ml-1.5 px-1.5 py-0.2 text-[10px] font-mono tracking-tighter opacity-80 bg-black/10 dark:bg-white/10 rounded border border-black/10 dark:border-white/10">
          {shortcutHint}
        </kbd>
      )}
    </button>
  );
};
