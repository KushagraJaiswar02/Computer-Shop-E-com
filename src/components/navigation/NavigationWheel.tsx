import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Layers, Sparkles, Zap, Tag, Wrench, Phone, Award, ChevronRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export interface WheelItem {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  angle: number;
}

export const NavigationWheel: React.FC = () => {
  const { isNavWheelOpen, setIsNavWheelOpen } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 640);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const destinations: WheelItem[] = useMemo(() => [
    { id: 'shop', label: 'All Hardware', to: '/shop', icon: ShoppingBag, angle: -70 },
    { id: 'categories', label: 'Categories', to: '/shop', icon: Layers, angle: -50 },
    { id: 'deals', label: 'Deals & Offers', to: '/shop?deal=true', icon: Sparkles, angle: -30 },
    { id: 'new_arrivals', label: 'New Arrivals', to: '/shop?sort=newest', icon: Zap, angle: -10 },
    { id: 'brands', label: 'Brands Directory', to: '/brand/asus', icon: Tag, angle: 10 },
    { id: 'enquiry', label: 'Custom PC Quote', to: '/enquiry', icon: Wrench, angle: 30 },
    { id: 'contact', label: 'Support & Store', to: '/contact', icon: Phone, angle: 50 },
    { id: 'about', label: 'About Store', to: '/about', icon: Award, angle: 70 },
  ], []);

  // A 444px outer desktop ring (336px on narrow screens), centered just beyond the left edge.
  const radius = isMobile ? 148 : 198;
  const ringThickness = isMobile ? 40 : 48;
  const centerX = isMobile ? -42 : -50;
  const centerY = 0;

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (isNavWheelOpen) {
      const activeElement = document.activeElement as HTMLElement | null;
      const exploreTrigger = document.querySelector<HTMLButtonElement>(
        'button[aria-label^="Open Radial Navigation Wheel"]'
      );
      triggerRef.current = activeElement === exploreTrigger ? activeElement : exploreTrigger;
      setIsClosing(false);
      setIsMounted(true);
    } else if (isMounted) {
      setIsClosing(true);
      const exitDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 380;
      closeTimer.current = setTimeout(() => {
        closeTimer.current = null;
        setIsMounted(false);
        setIsClosing(false);
        triggerRef.current?.focus();
      }, exitDuration);
    }
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
  }, [isNavWheelOpen]);

  useEffect(() => {
    if (!isNavWheelOpen) return;
    const index = destinations.findIndex((d) => {
      if (d.id === 'shop') return location.pathname === '/shop' && !location.search;
      if (d.id === 'deals') return location.search.includes('deal=true');
      if (d.id === 'new_arrivals') return location.search.includes('newest');
      if (d.id === 'brands') return location.pathname.startsWith('/brand');
      return location.pathname === d.to;
    });
    if (index >= 0) setSelectedIndex(index);
  }, [isNavWheelOpen, location.pathname, location.search, destinations]);

  const close = () => setIsNavWheelOpen(false);
  const activate = (to: string) => { close(); navigate(to); };

  useEffect(() => {
    if (!isNavWheelOpen || isClosing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (!typing && ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
        event.preventDefault();
        const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
        setSelectedIndex((index) => (index + delta + destinations.length) % destinations.length);
      } else if (!typing && event.key === 'Enter') {
        event.preventDefault();
        activate(destinations[selectedIndex].to);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isNavWheelOpen, isClosing, selectedIndex, destinations]);

  if (!isMounted) return null;
  const selectedItem = destinations[selectedIndex] ?? destinations[0];
  const SelectedIcon = selectedItem.icon;
  const radians = selectedItem.angle * Math.PI / 180;
  const selectedX = centerX + radius * Math.cos(radians);
  const selectedY = radius * Math.sin(radians);

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none select-none" aria-label="Navigation wheel">
      <div
        aria-hidden="true"
        className={`wheel-local-blur absolute pointer-events-none ${isClosing ? 'wheel-local-blur-closing' : ''}`}
        style={{
          left: isMobile ? -170 : -200,
          top: '50%',
          width: isMobile ? 520 : 600,
          height: isMobile ? 520 : 600,
          transform: 'translateY(-50%)',
        }}
      />

      {/* Transparent click catcher closes the wheel without affecting the storefront. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close navigation wheel"
        className={`wheel-catcher absolute inset-0 pointer-events-auto cursor-default ${isClosing ? 'wheel-catcher-closing' : ''}`}
        onClick={close}
      />

      <div
        role="dialog"
        aria-label="Explore store navigation"
        className={`wheel-assembly absolute left-0 top-1/2 h-0 w-0 pointer-events-none ${isClosing ? 'wheel-assembly-closing' : ''}`}
      >
        <svg
          aria-hidden="true"
          className="absolute overflow-visible"
          viewBox="0 0 500 500"
          style={{ left: -250, top: -250, width: 500, height: 500 }}
        >
          <circle
            cx={centerX + 250}
            cy={250 + centerY}
            r={radius}
            fill="none"
            stroke="var(--ring-terracotta)"
            strokeWidth={ringThickness}
            className="wheel-ring"
          />
        </svg>

        {destinations.map((item, index) => {
          const angle = item.angle * Math.PI / 180;
          const x = centerX + radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const Icon = item.icon;
          const selected = selectedIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => activate(item.to)}
              onMouseEnter={() => setSelectedIndex(index)}
              onFocus={() => setSelectedIndex(index)}
              aria-label={item.label}
              aria-current={selected ? 'true' : undefined}
              title={item.label}
              className={`wheel-icon pointer-events-auto absolute z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white transition-[opacity,transform] duration-200 focus-visible:z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#c85032] ${selected ? 'wheel-icon-selected opacity-0' : 'opacity-100 hover:scale-110'}`}
              style={{ left: x, top: y, animationDelay: `${index * 16}ms` }}
            >
              <Icon className="h-5 w-5 stroke-[2.2]" />
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => activate(selectedItem.to)}
          aria-label={`Open ${selectedItem.label}`}
          className="wheel-pill pointer-events-auto absolute z-20 flex -translate-y-1/2 items-center rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 text-slate-900 shadow-lg transition-[opacity,transform] duration-200 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c85032] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          style={{ left: Math.max(10, selectedX - ringThickness / 2 + 5), top: selectedY }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c85032] text-white dark:bg-[#d95d3c]">
            <SelectedIcon className="h-4 w-4 stroke-[2.2]" />
          </span>
          <span className="ml-3 mr-2 whitespace-nowrap text-xs font-bold tracking-tight sm:text-sm">{selectedItem.label}</span>
          <ChevronRight className="ml-1 h-4 w-4 shrink-0 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
