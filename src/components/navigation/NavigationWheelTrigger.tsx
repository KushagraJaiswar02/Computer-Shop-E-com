import React, { forwardRef } from 'react';
import { Compass } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KeyBadge } from '../common/KeyBadge';

interface NavigationWheelTriggerProps {
  className?: string;
  variant?: 'header' | 'compact';
}

export const NavigationWheelTrigger = forwardRef<HTMLButtonElement, NavigationWheelTriggerProps>(
  ({ className = '', variant = 'header' }, ref) => {
    const { setIsNavWheelOpen, isNavWheelOpen } = useStore();

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setIsNavWheelOpen((prev) => !prev)}
        className={`group relative flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all duration-200 select-none ${
          isNavWheelOpen
            ? 'bg-terracotta-50 dark:bg-terracotta-900/40 border-terracotta-500 text-terracotta-600 dark:text-terracotta-300 ring-2 ring-terracotta-500/20'
            : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-750 text-slate-800 dark:text-slate-100 shadow-keycap hover:border-slate-300 active:shadow-keycap-pressed'
        } ${className}`}
        aria-label="Open Radial Navigation Wheel (Shortcut: C)"
        aria-expanded={isNavWheelOpen}
        title="Explore Radial Navigation (C)"
      >
        {/* Animated Compass Icon */}
        <div className="relative flex items-center justify-center">
          <Compass className="w-4 h-4 text-terracotta-500 transition-transform duration-300 group-hover:rotate-45" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
        </div>

        {/* Text Label */}
        <span className="text-xs font-semibold tracking-tight">Explore</span>

        {/* Keyboard shortcut hint */}
        <KeyBadge className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 group-hover:border-terracotta-300">
          C
        </KeyBadge>
      </button>
    );
  }
);

NavigationWheelTrigger.displayName = 'NavigationWheelTrigger';
