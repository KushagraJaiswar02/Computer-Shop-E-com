import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award, ChevronLeft, ChevronRight, Compass, Cpu, GitCompareArrows,
  HardDrive, Heart, Info, Keyboard, Laptop, Layers, MapPin, MemoryStick, Monitor,
  Package, PackagePlus, Percent, Phone, Server, ShoppingBag, Sparkles, Star,
  Tag, UserRound, Wrench, Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

type WheelBranch = 'items' | 'brands' | 'sales' | 'space' | 'help' | 'category';
type WheelChoice = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
  children?: WheelChoice[];
  branch?: WheelBranch;
};
type WheelFrame = { id: string; title: string; choices: WheelChoice[]; selectedIndex: number };

export interface WheelItem {
  id: string;
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  angle: number;
}

const ROOT_CHOICES: WheelChoice[] = [
  { id: 'items', label: 'All Items', icon: Layers, branch: 'items' },
  { id: 'brands', label: 'By Brand', icon: Tag, branch: 'brands' },
  { id: 'sales', label: 'Sales & Deals', icon: Sparkles, branch: 'sales' },
  { id: 'space', label: 'Your Space', icon: UserRound, branch: 'space' },
  { id: 'help', label: 'Help & Contact', icon: Phone, branch: 'help' },
];

const CATEGORY_ICONS: Record<string, WheelChoice['icon']> = {
  laptops: Laptop,
  'graphics-cards': Cpu,
  processors: Cpu,
  'memory-ram': MemoryStick,
  'storage-ssd': HardDrive,
  motherboards: Server,
  monitors: Monitor,
  peripherals: Keyboard,
};

const getCategoryLabel = (id: string, name: string) => {
  if (id === 'memory-ram') return 'RAM & Memory';
  if (id === 'peripherals') return 'Peripherals';
  return name.replace(/\s*\([^)]*\)/g, '');
};

const ARC_START = -55;
const ARC_SWEEP = 110;
const choiceAngle = (index: number, count: number) => ARC_START + (index + 0.5) * (ARC_SWEEP / count);

const getBranchChoices = (
  branch: WheelBranch,
  categories: ReturnType<typeof useStore>['categories'],
  brands: ReturnType<typeof useStore>['brands'],
  parent?: WheelChoice,
): WheelChoice[] => {
  if (branch === 'items') return categories.map((category) => {
    const label = getCategoryLabel(category.id, category.name);
    const categoryLink: WheelChoice = {
      id: `${category.id}-all`, label: `All ${label}`, icon: ShoppingBag, to: `/category/${category.id}`,
    };
    const subcategories: WheelChoice[] = category.subcategories.map((subcategory) => ({
      id: subcategory.id,
      label: subcategory.name,
      icon: CATEGORY_ICONS[category.id] || Cpu,
      to: `/category/${category.id}/${subcategory.id}`,
    }));
    return {
      id: category.id,
      label,
      icon: CATEGORY_ICONS[category.id] || Layers,
      branch: subcategories.length ? 'category' : undefined,
      to: `/category/${category.id}`,
      children: [categoryLink, ...subcategories],
    };
  });

  if (branch === 'category') return parent?.children || [];
  if (branch === 'brands') return [
    { id: 'all-brands', label: 'All Brands', icon: ShoppingBag, to: '/brands' },
    ...brands.map((brand) => ({ id: brand.id, label: brand.name, icon: Tag, to: `/brand/${brand.id}` })),
  ];
  if (branch === 'sales') return [
    { id: 'offers', label: 'Offers', icon: Tag, to: '/shop?deal=true' },
    { id: 'sale-items', label: 'Sale Items', icon: Percent, to: '/shop?sale=true&sort=discount' },
    { id: 'best-sellers', label: 'Best Sellers · demo picks', icon: Award, to: '/shop?bestseller=true' },
    { id: 'featured', label: 'Featured Products', icon: Star, to: '/shop?featured=true' },
    { id: 'popular', label: 'Popular · demo picks', icon: Sparkles, to: '/shop?bestseller=true' },
    { id: 'new-arrivals', label: 'New Arrivals', icon: Zap, to: '/shop?sort=newest' },
  ];
  if (branch === 'space') return [
    { id: 'wishlist', label: 'Wishlist', icon: Heart, to: '/wishlist' },
    { id: 'compare', label: 'Compare Items', icon: GitCompareArrows, to: '/compare' },
    { id: 'orders', label: 'Orders & Tracking · demo', icon: Package, to: '/account/orders' },
    { id: 'addresses', label: 'Addresses & Delivery · demo', icon: MapPin, to: '/account/addresses' },
    { id: 'account', label: 'Account Settings · demo', icon: UserRound, to: '/account/profile' },
  ];
  return [
    { id: 'contact', label: 'Contact Us', icon: Phone, to: '/contact' },
    { id: 'product-enquiry', label: 'Product Enquiry', icon: Wrench, to: '/enquiry' },
    { id: 'request-product', label: 'Request a Product', icon: PackagePlus, to: '/enquiry?request=product' },
    { id: 'store-info', label: 'Store Information', icon: Info, to: '/policies' },
  ];
};

const sectorPath = (cx: number, cy: number, inner: number, outer: number, start: number, end: number) => {
  const point = (radius: number, angle: number) => {
    const radians = angle * Math.PI / 180;
    return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
  };
  const [x1, y1] = point(outer, start);
  const [x2, y2] = point(outer, end);
  const [x3, y3] = point(inner, end);
  const [x4, y4] = point(inner, start);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${outer} ${outer} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
};

export const NavigationWheel: React.FC = () => {
  const { isNavWheelOpen, setIsNavWheelOpen, categories, brands } = useStore();
  const navigate = useNavigate();
  const [frames, setFrames] = useState<WheelFrame[]>([{ id: 'main', title: 'Explore', choices: ROOT_CHOICES, selectedIndex: 0 }]);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const current = frames[frames.length - 1];
  const currentIndex = frames.length - 1;
  const visibleStart = Math.max(0, frames.length - 2);
  const visibleFrames = frames.slice(visibleStart);
  const selectedChoice = current.choices[current.selectedIndex] || current.choices[0];

  const branchChoices = useMemo(() => ({
    items: getBranchChoices('items', categories, brands),
    brands: getBranchChoices('brands', categories, brands),
    sales: getBranchChoices('sales', categories, brands),
    space: getBranchChoices('space', categories, brands),
    help: getBranchChoices('help', categories, brands),
  }), [categories, brands]);

  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (isNavWheelOpen) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      setIsClosing(false);
      setFrames([{ id: 'main', title: 'Explore', choices: ROOT_CHOICES, selectedIndex: 0 }]);
      setIsMounted(true);
    } else if (isMounted) {
      setIsClosing(true);
      const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300;
      closeTimer.current = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
        triggerRef.current?.focus();
      }, duration);
    }
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, [isNavWheelOpen]);

  const close = () => setIsNavWheelOpen(false);
  const goHome = () => setFrames([{ id: 'main', title: 'Explore', choices: ROOT_CHOICES, selectedIndex: 0 }]);
  const goBack = () => setFrames((stack) => stack.length > 1 ? stack.slice(0, -1) : stack);
  const setSelected = (depth: number, index: number) => setFrames((stack) => stack.map((frame, frameIndex) => frameIndex === depth ? { ...frame, selectedIndex: index } : frame));

  const activate = (choice: WheelChoice, depth = currentIndex) => {
    if (choice.branch) {
      const choices = choice.branch === 'category'
        ? getBranchChoices('category', categories, brands, choice)
        : branchChoices[choice.branch];
      if (choices.length) setFrames((stack) => [...stack.slice(0, depth + 1), { id: choice.id, title: choice.label, choices, selectedIndex: 0 }]);
      else if (choice.to) { close(); navigate(choice.to); }
      return;
    }
    if (choice.to) { close(); navigate(choice.to); }
  };

  useEffect(() => {
    if (!isNavWheelOpen || isClosing) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-wheel-control], [data-explore-trigger]')) return;
      close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isNavWheelOpen, isClosing]);

  useEffect(() => {
    if (!isNavWheelOpen || isClosing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (!typing && ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
        event.preventDefault();
        const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
        const next = (current.selectedIndex + delta + current.choices.length) % current.choices.length;
        setSelected(currentIndex, next);
        requestAnimationFrame(() => ringRef.current?.querySelector<HTMLElement>(`[data-ring-depth="${currentIndex}"][data-choice-index="${next}"]`)?.focus());
      } else if (!typing && event.key === 'Enter' && selectedChoice) {
        event.preventDefault();
        activate(selectedChoice);
      } else if (event.key === 'Tab') {
        const controls = Array.from(document.querySelectorAll<HTMLElement>('[data-wheel-control]'));
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isNavWheelOpen, isClosing, current, currentIndex, selectedChoice]);

  useEffect(() => {
    if (isNavWheelOpen && isMounted) requestAnimationFrame(() => ringRef.current?.querySelector<HTMLElement>('[data-ring-depth="0"][data-choice-index="0"]')?.focus());
  }, [isNavWheelOpen, isMounted]);

  if (!isMounted) return null;

  const isMobile = viewport.width < 640;
  const thickness = isMobile ? 42 : 50;
  const spacing = isMobile ? 70 : 80;
  const baseRadius = isMobile ? 145 : 195;
  const headerBottom = isMobile ? 96 : 104;
  const safeBottom = isMobile ? 80 : 120;
  const depthRadius = (depth: number) => (baseRadius + depth * spacing) * scale;
  const activeVisibleDepth = visibleFrames.length - 1;
  const deepestRadius = baseRadius + Math.max(0, activeVisibleDepth) * spacing;
  const availableHeight = Math.max(0, viewport.height - headerBottom - safeBottom);
  const scale = Math.min(1, Math.max(0.62, availableHeight / (2 * (deepestRadius + thickness / 2))));
  const ringThickness = thickness * scale;
  const centerX = isMobile ? -34 : -50;
  const centerY = headerBottom + availableHeight / 2;
  const activeRadius = depthRadius(activeVisibleDepth);
  const activeAngle = choiceAngle(current.selectedIndex, current.choices.length);
  const activeRadians = activeAngle * Math.PI / 180;
  const activeX = centerX + activeRadius * Math.cos(activeRadians);
  const activeY = activeRadius * Math.sin(activeRadians);
  const pillWidth = Math.min(viewport.width - 16, isMobile ? 230 : 280);
  const pillLeft = Math.max(8, Math.min(viewport.width - pillWidth - 8, activeX - ringThickness / 2 + 5));
  const Icon = selectedChoice?.icon || Compass;
  const svgCenterX = 500 + centerX;
  const svgCenterY = 500;

  return (
    <div className={`wheel-dialog fixed inset-0 z-[80] pointer-events-none ${isClosing ? 'wheel-dialog-closing' : ''}`} role="region" aria-label="Explore radial navigation">
      <div aria-hidden="true" className={`wheel-local-blur absolute pointer-events-none ${isClosing ? 'wheel-local-blur-closing' : ''}`} style={{ left: isMobile ? -165 : -200, top: `${centerY}px`, width: isMobile ? 460 : 600, height: isMobile ? 460 : 600, transform: 'translateY(-50%)' }} />

      <div ref={ringRef} className={`wheel-assembly absolute left-0 h-0 w-0 ${isClosing ? 'wheel-assembly-closing' : ''}`} style={{ top: centerY }}>
        <svg className="wheel-rings absolute overflow-visible" viewBox="0 0 1000 1000" style={{ left: -500, top: -500, width: 1000, height: 1000 }}>
          {visibleFrames.map((frame, visibleDepth) => {
            const depth = visibleStart + visibleDepth;
            const radius = depthRadius(visibleDepth);
            const inner = Math.max(1, radius - ringThickness / 2);
            const outer = radius + ringThickness / 2;
            const step = ARC_SWEEP / frame.choices.length;
            const angularGap = Math.min(depth === 0 ? 0.8 : 1.4, step * 0.08);
            return (
              <g key={`${frame.id}-${depth}`} className={`wheel-ring-layer ${depth === currentIndex ? 'wheel-ring-layer-active' : ''}`}>
                {visibleDepth === 0 && <circle cx={svgCenterX} cy={svgCenterY} r={radius} fill="none" stroke="var(--ring-terracotta)" strokeWidth={ringThickness} />}
                {frame.choices.map((choice, index) => {
                  const start = ARC_START + index * step + angularGap / 2;
                  const end = ARC_START + (index + 1) * step - angularGap / 2;
                  const active = frame.selectedIndex === index;
                  return (
                    <path
                      key={choice.id}
                      d={sectorPath(svgCenterX, svgCenterY, inner, outer, start, end)}
                      aria-hidden="true"
                      data-wheel-control
                      className={`wheel-segment ${visibleDepth === 0 ? 'wheel-segment-root' : ''} ${active ? 'wheel-segment-active' : ''}`}
                      onClick={() => { setSelected(depth, index); activate(choice, depth); }}
                      onMouseEnter={() => setSelected(depth, index)}
                    >
                      <title>{choice.label}</title>
                    </path>
                  );
                })}
              </g>
            );
          })}
        </svg>
        {visibleFrames.map((frame, visibleDepth) => frame.choices.map((choice, index) => {
          const depth = visibleStart + visibleDepth;
          const angle = choiceAngle(index, frame.choices.length);
          const radius = depthRadius(visibleDepth);
          const radians = angle * Math.PI / 180;
          const x = centerX + radius * Math.cos(radians);
          const y = radius * Math.sin(radians);
          const ChoiceIcon = choice.icon;
          return <button key={`icon-${frame.id}-${choice.id}`} type="button" data-wheel-control data-ring-depth={depth} data-choice-index={index} aria-label={choice.label} aria-current={frame.selectedIndex === index ? 'true' : undefined} title={choice.label} onClick={() => { setSelected(depth, index); activate(choice, depth); }} onFocus={() => setSelected(depth, index)} onMouseEnter={() => setSelected(depth, index)} className={`wheel-option-icon ${frame.selectedIndex === index ? 'wheel-option-icon-active' : ''}`} style={{ left: x, top: y }}><ChoiceIcon className="h-4 w-4" /></button>;
        }))}
        <button
          type="button"
          data-wheel-control
          onClick={() => selectedChoice && activate(selectedChoice)}
          aria-label={selectedChoice?.branch ? `Open ${selectedChoice.label}` : `Go to ${selectedChoice?.label}`}
          className="wheel-pill pointer-events-auto absolute z-20 flex -translate-y-1/2 items-center rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-slate-900 shadow-lg transition-[opacity,transform] duration-200 ease-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c85032] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          style={{ left: pillLeft, top: activeY, maxWidth: pillWidth }}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c85032] text-white dark:bg-[#d95d3c]"><Icon className="h-4 w-4" /></span>
          <span className="ml-2 mr-1 max-w-[min(48vw,190px)] truncate text-xs font-bold tracking-tight sm:text-sm">{selectedChoice?.label}</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
        </button>
      </div>

      <div className="wheel-level-controls pointer-events-auto absolute z-30 flex max-w-[calc(100vw-16px)] items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1.5 text-slate-700 shadow-md backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200" style={{ left: 8, top: Math.max(headerBottom + 8, centerY - depthRadius(activeVisibleDepth) - ringThickness / 2 - 42) }} aria-label={`${current.title} level controls`}>
        {frames.length > 1 && <>
          <button type="button" data-wheel-control onClick={goBack} aria-label="Back to previous wheel level" title="Back" className="flex h-8 items-center gap-1 rounded-full px-2 text-xs font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c85032] dark:hover:bg-slate-800"><ChevronLeft className="h-4 w-4" /><span>Back</span></button>
          <button type="button" data-wheel-control onClick={goHome} aria-label="Return to main wheel" title="Main wheel" className="flex h-8 items-center gap-1 rounded-full px-2 text-xs font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c85032] dark:hover:bg-slate-800"><Compass className="h-4 w-4" /><span>Main</span></button>
        </>}
        <span className="max-w-[min(45vw,240px)] truncate px-2 text-xs font-bold" aria-live="polite">{current.title}</span>
        {frames.length === 1 && <span className="hidden px-1 text-[10px] text-slate-500 sm:inline">C to open · Esc to close</span>}
        <button type="button" data-wheel-control onClick={close} className="ml-auto rounded-full p-1.5 text-xs font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c85032] dark:hover:bg-slate-800" aria-label="Close navigation wheel">×</button>
      </div>
    </div>
  );
};
