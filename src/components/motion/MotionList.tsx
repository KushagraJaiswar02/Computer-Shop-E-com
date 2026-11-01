import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const seenLists = new Set<string>();
const EXIT_MS = 120;
export const productKey = (product: { id: string }) => product.id;
interface Entry<T> { key: string; item: T; leaving: boolean; entering: boolean; delay: number; }
interface MotionListProps<T> {
  items: T[];
  itemKey: (item: T) => string;
  children: (item: T) => React.ReactNode;
  className?: string;
  entranceId: string;
  animateChanges?: boolean;
  empty?: React.ReactNode;
}

// Retain removed UI rows briefly; the underlying cart/wishlist state updates immediately.
export function MotionList<T>({ items, itemKey, children, className = '', entranceId, animateChanges = false, empty }: MotionListProps<T>) {
  const { pathname } = useLocation();
  const listId = `${pathname}:${entranceId}`;
  const firstEntrance = useRef(!seenLists.has(listId));
  const [entries, setEntries] = useState<Entry<T>[]>(() => items.map((item, index) => ({ key: itemKey(item), item, leaving: false, entering: firstEntrance.current, delay: Math.min(index * 30, 150) })));
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const positions = useRef(new Map<string, { top: number; left: number }>());
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    seenLists.add(listId);
    firstEntrance.current = false;
  }, [listId]);

  useLayoutEffect(() => {
    const keys = new Set(items.map(itemKey));
    setEntries(previous => {
      const byKey = new Map(previous.map(entry => [entry.key, entry]));
      const next = items.map(item => {
        const key = itemKey(item);
        const existing = byKey.get(key);
        const timer = timers.current.get(key);
        if (timer) { clearTimeout(timer); timers.current.delete(key); }
        return existing ? { ...existing, item, leaving: false } : { key, item, leaving: false, entering: animateChanges, delay: 0 };
      });
      if (animateChanges) previous.forEach((entry, index) => {
        if (keys.has(entry.key)) return;
        next.splice(Math.min(index, next.length), 0, { ...entry, leaving: true, entering: false });
        if (!timers.current.has(entry.key)) {
          const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : EXIT_MS;
          timers.current.set(entry.key, setTimeout(() => {
            timers.current.delete(entry.key);
            setEntries(current => current.filter(item => item.key !== entry.key));
          }, duration));
        }
      });
      if (previous.length === next.length && next.every((entry, i) => entry.key === previous[i].key && entry.item === previous[i].item && entry.leaving === previous[i].leaving)) return previous;
      return next;
    });
  }, [items, itemKey, animateChanges]);

  // FLIP: collapse the gap left by a row using transforms, never animated height/margins.
  useLayoutEffect(() => {
    const nodes = Array.from(root.current?.querySelectorAll<HTMLElement>(':scope > [data-motion-key]') || []);
    const next = new Map<string, { top: number; left: number }>();
    const frames: number[] = [];
    nodes.forEach(node => {
      const key = node.dataset.motionKey!;
      const position = { top: node.offsetTop, left: node.offsetLeft };
      const previous = positions.current.get(key);
      next.set(key, position);
      if (!animateChanges || !previous || node.dataset.entering === 'true' || node.dataset.leaving === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const x = previous.left - position.left, y = previous.top - position.top;
      if (!x && !y) return;
      node.style.transition = 'none';
      node.style.transform = `translate(${x}px, ${y}px)`;
      frames.push(requestAnimationFrame(() => {
        node.style.transition = 'transform 120ms ease-out';
        node.style.transform = '';
      }));
    });
    positions.current = next;
    return () => frames.forEach(cancelAnimationFrame);
  }, [entries, animateChanges]);

  useLayoutEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);

  return (
    <div ref={root} className={`relative ${className}`}>
      {entries.map(entry => (
        <div key={entry.key} data-motion-key={entry.key} data-entering={entry.entering} data-leaving={entry.leaving} className="motion-list-item min-w-0" style={{ '--entry-delay': `${entry.delay}ms` } as React.CSSProperties}
          ref={node => { if (entry.leaving) node?.setAttribute('inert', ''); else node?.removeAttribute('inert'); }}
          onAnimationEnd={event => { if (event.target === event.currentTarget && entry.entering) setEntries(current => current.map(item => item.key === entry.key ? { ...item, entering: false } : item)); }}>
          {children(entry.item)}
        </div>
      ))}
      {entries.length === 0 && <div className="col-span-full">{empty}</div>}
    </div>
  );
}
