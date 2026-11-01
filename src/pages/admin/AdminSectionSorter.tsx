import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical } from 'lucide-react';
import { HomepageSection } from '../../types';

interface SectionSorterProps {
  sections: HomepageSection[];
  onReorder(sections: HomepageSection[]): void;
  onToggle(id: string): void;
}
interface PointerDrag {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  active: boolean;
  over: boolean;
  beforeId: string | null;
}

// Keep IDs and every section setting intact; only the order changes.
export function moveSectionBefore(sections: HomepageSection[], id: string, beforeId: string | null): HomepageSection[] {
  const moving = sections.find(section => section.id === id);
  if (!moving || beforeId === id || (beforeId !== null && !sections.some(section => section.id === beforeId))) return sections;
  const next = sections.filter(section => section.id !== id);
  const index = beforeId === null ? next.length : next.findIndex(section => section.id === beforeId);
  next.splice(index, 0, moving);
  return next.map((section, order) => ({ ...section, order }));
}

export const AdminSectionSorter: React.FC<SectionSorterProps> = ({ sections, onReorder, onToggle }) => {
  const list = useRef<HTMLOListElement>(null);
  const pointer = useRef<PointerDrag | null>(null);
  const [drag, setDrag] = useState<PointerDrag | null>(null);
  const [keyboardId, setKeyboardId] = useState<string | null>(null);
  const keyboardStart = useRef<HomepageSection[] | null>(null);
  const suppressClick = useRef(false);
  const [announcement, setAnnouncement] = useState('');
  const instructions = useId();

  const updatePointer = (value: PointerDrag) => {
    const bounds = list.current?.getBoundingClientRect();
    const over = !!bounds && value.x >= bounds.left - 24 && value.x <= bounds.right + 24 && value.y >= bounds.top - 32 && value.y <= bounds.bottom + 32;
    const rows = Array.from(list.current?.querySelectorAll<HTMLElement>('[data-section-id]') || []);
    const target = rows.find(row => {
      if (row.dataset.sectionId === value.id) return false;
      const rect = row.getBoundingClientRect();
      return value.y < rect.top + rect.height / 2;
    });
    const next = { ...value, over, beforeId: target?.dataset.sectionId || null };
    pointer.current = next;
    setDrag(next);
  };

  // Scroll the page while a mouse, pen or finger holds a section near an edge.
  useEffect(() => {
    if (!drag?.active) return;
    const oldUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    let frame = 0;
    const scroll = () => {
      const current = pointer.current;
      if (!current?.active) return;
      const bounds = list.current?.getBoundingClientRect();
      if (bounds && current.x >= bounds.left - 24 && current.x <= bounds.right + 24) {
        const topEdge = 130, bottomEdge = window.innerHeight - 115;
        const amount = current.y < topEdge ? -Math.min(16, (topEdge - current.y) / 5) : current.y > bottomEdge ? Math.min(16, (current.y - bottomEdge) / 5) : 0;
        if (amount) {
          window.scrollBy({ top: amount, behavior: 'instant' });
          updatePointer(current);
        }
      }
      frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => { cancelAnimationFrame(frame); document.body.style.userSelect = oldUserSelect; };
  }, [drag?.active]);

  const moveTo = (id: string, position: number) => {
    const from = sections.findIndex(section => section.id === id);
    if (from < 0 || position < 0 || position >= sections.length || position === from) return;
    const remaining = sections.filter(section => section.id !== id);
    onReorder(moveSectionBefore(sections, id, remaining[position]?.id || null));
    setAnnouncement(`${sections[from].title} moved to position ${position + 1} of ${sections.length}.`);
  };
  const pickUp = (section: HomepageSection) => {
    if (keyboardId === section.id) {
      setKeyboardId(null); keyboardStart.current = null;
      setAnnouncement(`${section.title} placed at position ${sections.findIndex(item => item.id === section.id) + 1}. Save changes to update your shop.`);
    } else {
      keyboardStart.current = sections;
      setKeyboardId(section.id);
      setAnnouncement(`${section.title} picked up. Use the arrow keys to move it, then press Space to place it. Escape cancels.`);
    }
  };
  const finishPointer = (event: React.PointerEvent<HTMLButtonElement>, cancel: boolean) => {
    const current = pointer.current;
    if (!current || current.pointerId !== event.pointerId) return;
    suppressClick.current = current.active;
    pointer.current = null; setDrag(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!current.active) return;
    if (cancel || !current.over) { setAnnouncement('Move cancelled. The section order has not changed.'); return; }
    const reordered = moveSectionBefore(sections, current.id, current.beforeId);
    onReorder(reordered);
    const section = reordered.find(item => item.id === current.id)!;
    setAnnouncement(`${section.title} placed at position ${reordered.findIndex(item => item.id === current.id) + 1} of ${sections.length}. Save changes to update your shop.`);
  };
  const moving = sections.find(section => section.id === drag?.id);
  const showDrop = drag?.active && drag.over;
  return <div className="au-section-sorter">
    <p id={instructions} className="au-sort-hint">Drag the six-dot handle to move a section. On a keyboard, press Space on the handle, use ↑ or ↓, then press Space to place it. Escape cancels.</p>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
    <ol ref={list} className="au-sort-list" aria-label="Homepage section order">
      {sections.map((section, index) => <li key={section.id} data-section-id={section.id} className={`au-sort-row ${!section.enabled ? 'is-hidden' : ''} ${drag?.active && drag.id === section.id ? 'is-dragging' : ''} ${keyboardId === section.id ? 'is-picked-up' : ''} ${showDrop && drag.beforeId === section.id ? 'drop-before' : ''}`}>
        <div className="au-sort-details">
          <button type="button" className="au-sort-handle" aria-label={`Move ${section.title}`} aria-describedby={instructions} aria-pressed={keyboardId === section.id || !!(drag?.active && drag.id === section.id)} title="Drag to reorder" onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return;
            event.currentTarget.focus();
            suppressClick.current = false;
            setKeyboardId(null); keyboardStart.current = null;
            const value = { id: section.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, active: false, over: false, beforeId: null };
            pointer.current = value; setDrag(value);
            event.currentTarget.setPointerCapture(event.pointerId);
          }} onPointerMove={event => {
            const current = pointer.current;
            if (!current || current.pointerId !== event.pointerId) return;
            const active = current.active || Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 6;
            if (active && !current.active) setAnnouncement(`${section.title} picked up. Drag it to the blue insertion line.`);
            updatePointer({ ...current, x: event.clientX, y: event.clientY, active });
          }} onPointerUp={event => finishPointer(event, false)} onPointerCancel={event => finishPointer(event, true)} onLostPointerCapture={() => {
            if (pointer.current?.id === section.id) { pointer.current = null; setDrag(null); setAnnouncement('Move cancelled.'); }
          }} onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } pickUp(section); }} onKeyDown={event => {
            if (event.key === 'Escape') {
              event.preventDefault();
              const current = pointer.current;
              pointer.current = null; setDrag(null);
              if (current && event.currentTarget.hasPointerCapture(current.pointerId)) event.currentTarget.releasePointerCapture(current.pointerId);
              if (keyboardId) { if (keyboardStart.current) onReorder(keyboardStart.current); setKeyboardId(null); keyboardStart.current = null; }
              setAnnouncement('Move cancelled. The previous section order has been restored.');
            } else if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault(); if (!event.repeat) pickUp(section);
            } else if (keyboardId === section.id && ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
              event.preventDefault();
              moveTo(section.id, event.key === 'Home' ? 0 : event.key === 'End' ? sections.length - 1 : index + (event.key === 'ArrowUp' ? -1 : 1));
            }
          }}><GripVertical size={21} aria-hidden="true" /></button>
          <span className="au-sort-number" aria-hidden="true">{index + 1}</span>
          <div className="au-sort-copy"><h3>{section.title}</h3>{section.subtitle && <p>{section.subtitle}</p>}<small>{section.id}</small></div>
        </div>
        <div className="au-sort-actions"><div className="au-sort-arrows"><button type="button" disabled={index === 0} onClick={() => moveTo(section.id, index - 1)} aria-label={`Move ${section.title} up`}><ArrowUp size={16} aria-hidden="true" /></button><button type="button" disabled={index === sections.length - 1} onClick={() => moveTo(section.id, index + 1)} aria-label={`Move ${section.title} down`}><ArrowDown size={16} aria-hidden="true" /></button></div><button type="button" className="au-sort-toggle" aria-pressed={section.enabled} aria-label={`${section.enabled ? 'Hide' : 'Show'} ${section.title}`} onClick={() => onToggle(section.id)}>{section.enabled ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}<span>{section.enabled ? 'Enabled' : 'Hidden'}</span></button></div>
      </li>)}
      {showDrop && drag.beforeId === null && <li className="au-sort-end-indicator" aria-hidden="true" />}
    </ol>
    {drag?.active && moving && <div className={`au-sort-ghost ${!drag.over ? 'outside' : ''}`} aria-hidden="true" style={{ left: Math.min(Math.max(12, drag.x + 16), Math.max(12, window.innerWidth - 280)), top: Math.max(8, Math.min(drag.y + 16, window.innerHeight - 85)) }}><GripVertical size={19} /><div><strong>{moving.title}</strong><small>{drag.over ? 'Release to place here' : 'Move back over the section list'}</small></div></div>}
  </div>;
};
