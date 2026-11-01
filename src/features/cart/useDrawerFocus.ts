import { RefObject, useLayoutEffect, useState } from 'react';

export function useDrawerPresence(open: boolean) {
  const [present, setPresent] = useState(open);
  useLayoutEffect(() => {
    if (open) { setPresent(true); return; }
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
    const timer = setTimeout(() => setPresent(false), duration);
    return () => clearTimeout(timer);
  }, [open]);
  return present;
}

export function useDrawerFocus(present: boolean, panel: RefObject<HTMLDivElement>, close: () => void) {
  useLayoutEffect(() => {
    const dialog = panel.current;
    if (!present || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled),[tabindex="0"]')).filter(node => node.getClientRects().length && !node.closest('[inert]'));
    const focusFirst = () => (focusable()[0] || dialog).focus({ preventScroll: true });
    focusFirst();
    const onFocus = (event: FocusEvent) => { if (!dialog.contains(event.target as Node)) focusFirst(); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
      if (event.key !== 'Tab') return;
      const controls = focusable(), first = controls[0], last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('focusin', onFocus);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('keydown', onKey, true);
      const target = opener?.isConnected ? opener : document.querySelector<HTMLElement>('header button[aria-label^="Shopping cart"]');
      target?.focus({ preventScroll: true });
    };
  }, [present, panel, close]);
}
