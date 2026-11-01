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
    'relative inline-flex items-center justify-center font-medium transition-all select-none overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px]';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-primary hover:bg-primary-hover text-on-primary border border-primary shadow-keycap active:shadow-keycap-pressed',
    secondary:
      'bg-surface-soft hover:bg-surface-soft dark:bg-surface-elevated dark:hover:bg-surface-soft text-main dark:text-main border border-border dark:border-border shadow-keycap dark:shadow-keycap-dark active:shadow-keycap-pressed',
    outline:
      'bg-transparent hover:bg-surface-soft dark:hover:bg-surface-elevated text-main dark:text-main border border-border dark:border-border active:bg-surface-soft dark:active:bg-surface-soft',
    ghost:
      'bg-transparent hover:bg-surface-soft dark:hover:bg-surface-elevated text-muted dark:text-main active:bg-surface-soft dark:active:bg-surface-soft',
    danger:
      'bg-danger hover:bg-danger text-on-semantic border border-danger shadow-keycap active:shadow-keycap-pressed',
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
          className="pointer-events-none absolute w-12 h-12 rounded-full bg-surface/30 animate-ripple -translate-x-1/2 -translate-y-1/2"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}

      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}

      <span>{children}</span>

      {shortcutHint && (
        <kbd className="ml-1.5 px-1.5 py-0.2 text-[10px] font-sans tracking-tighter opacity-80 bg-overlay/10 dark:bg-surface/10 rounded border border-border/10 dark:border-border/10">
          {shortcutHint}
        </kbd>
      )}
    </button>
  );
};
