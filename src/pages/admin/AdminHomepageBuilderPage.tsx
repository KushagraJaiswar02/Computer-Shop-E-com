import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Save,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { HomepageSection, HeroSlide } from '../../types';
import { KeycapButton } from '../../components/common/KeycapButton';
import { formatPrice } from '../../lib/utils';

const emptyHeroSlide = (sortOrder: number): HeroSlide => ({
  id: `hero-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now()}`,
  title: '',
  description: '',
  eyebrow: '',
  imageUrl: '',
  mobileImageUrl: '',
  imageAlt: '',
  imagePosition: 'center center',
  textPosition: 'left',
  ctaLabel: '',
  ctaUrl: '/shop',
  isActive: true,
  sortOrder,
});

const isValidHttpUrl = (value: string) => {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const compressHeroImage = async (file: File, maxWidth: number): Promise<string> => {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
  if (file.size > 12 * 1024 * 1024) throw new Error('Choose an image smaller than 12 MB.');
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot process the selected image.');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  let compressed = canvas.toDataURL('image/jpeg', 0.84);
  for (const quality of [0.74, 0.62, 0.5]) {
    if (compressed.length < 470_000) break;
    compressed = canvas.toDataURL('image/jpeg', quality);
  }
  if (compressed.length >= 470_000) throw new Error('This image is too large after compression. Choose a smaller image.');
  return compressed;
};

export const AdminHomepageBuilderPage: React.FC = () => {
  const { homepageConfig, updateHomepageConfig, resetHomepageConfig, products, categories } = useStore();

  const [activeTab, setActiveTab] = useState<'sections' | 'banner' | 'announcement' | 'collections'>('sections');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideErrors, setSlideErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState('');

  // Sections management
  const handleToggleSection = (id: string) => {
    const updated = homepageConfig.sections.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    updateHomepageConfig({ sections: updated });
    triggerSaveFeedback();
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const sorted = [...homepageConfig.sections].sort((a, b) => a.order - b.order);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    // Swap order values
    const currentItem = sorted[index];
    const targetItem = sorted[targetIndex];

    const updated = homepageConfig.sections.map(s => {
      if (s.id === currentItem.id) return { ...s, order: targetIndex };
      if (s.id === targetItem.id) return { ...s, order: index };
      return s;
    });

    updateHomepageConfig({ sections: updated });
    triggerSaveFeedback();
  };

  // Hero slide management
  const orderedSlides = [...(homepageConfig.heroSlides || [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const handleToggleSlide = (slideId: string, isActive: boolean) => {
    updateHomepageConfig({ heroSlides: orderedSlides.map(slide => slide.id === slideId ? { ...slide, isActive } : slide) });
    triggerSaveFeedback();
  };

  const handleMoveSlide = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= orderedSlides.length) return;
    const reordered = [...orderedSlides];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    updateHomepageConfig({ heroSlides: reordered.map((slide, sortOrder) => ({ ...slide, sortOrder })) });
    triggerSaveFeedback();
  };

  const handleDeleteSlide = (slide: HeroSlide) => {
    if (!window.confirm(`Delete “${slide.title || 'Untitled slide'}”? This cannot be undone.`)) return;
    updateHomepageConfig({ heroSlides: orderedSlides.filter(item => item.id !== slide.id).map((item, sortOrder) => ({ ...item, sortOrder })) });
    if (editingSlide?.id === slide.id) setEditingSlide(null);
    triggerSaveFeedback();
  };

  const handleSaveSlide = () => {
    if (!editingSlide) return;
    const errors: Record<string, string> = {};
    if (!editingSlide.title.trim()) errors.title = 'Enter a campaign headline.';
    if (!editingSlide.description.trim()) errors.description = 'Enter a short description.';
    if (!editingSlide.ctaLabel.trim()) errors.ctaLabel = 'Enter CTA button text.';
    const destination = editingSlide.ctaUrl.trim();
    if (!destination || (!destination.startsWith('/') && !/^https?:\/\//i.test(destination))) {
      errors.ctaUrl = 'Use a site path (for example /shop) or a full http(s) URL.';
    } else if (destination.startsWith('//')) {
      errors.ctaUrl = 'Use a site path beginning with one slash, or a full http(s) URL.';
    } else if (!destination.startsWith('/')) {
      try { new URL(destination); } catch { errors.ctaUrl = 'Enter a valid http(s) URL.'; }
    }
    if (!editingSlide.imageUrl.trim()) errors.imageUrl = 'Add a desktop campaign image URL or upload.';
    else if (!editingSlide.imageUrl.startsWith('data:image/') && !isValidHttpUrl(editingSlide.imageUrl)) errors.imageUrl = 'Enter a valid http(s) image URL.';
    if (editingSlide.mobileImageUrl && !editingSlide.mobileImageUrl.startsWith('data:image/') && !isValidHttpUrl(editingSlide.mobileImageUrl)) errors.mobileImageUrl = 'Enter a valid http(s) image URL.';
    setSlideErrors(errors);
    if (Object.keys(errors).length) return;
    const exists = orderedSlides.some(slide => slide.id === editingSlide.id);
    const updated = exists
      ? orderedSlides.map(slide => slide.id === editingSlide.id ? { ...editingSlide, ctaUrl: destination } : slide)
      : [...orderedSlides, { ...editingSlide, sortOrder: orderedSlides.length, ctaUrl: destination }];
    if (new Blob([JSON.stringify({ ...homepageConfig, heroSlides: updated })]).size > 4_000_000) {
      setImageError('These images exceed the browser storage limit for this prototype. Use smaller images or image URLs.');
      return;
    }
    updateHomepageConfig({ heroSlides: updated.map((slide, sortOrder) => ({ ...slide, sortOrder })) });
    setEditingSlide(null);
    setSlideErrors({});
    setImageError('');
    triggerSaveFeedback();
  };

  const handleSlideImageUpload = async (file: File | undefined, field: 'imageUrl' | 'mobileImageUrl') => {
    if (!file || !editingSlide) return;
    setImageError('');
    try {
      const imageUrl = await compressHeroImage(file, field === 'imageUrl' ? 1800 : 1000);
      setEditingSlide({ ...editingSlide, [field]: imageUrl, ...(field === 'imageUrl' && !editingSlide.imageAlt ? { imageAlt: file.name.replace(/\.[^.]+$/, '') } : {}) });
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'The image could not be processed.');
    }
  };

  // Announcement management
  const handleUpdateAnnouncement = (text: string, highlightText: string, linkText: string, linkUrl: string, enabled: boolean) => {
    updateHomepageConfig({
      announcement: {
        text,
        highlightText,
        linkText,
        linkUrl,
        enabled,
      },
    });
    triggerSaveFeedback();
  };

  // Featured Product Collections Picker
  const handleToggleFeaturedProduct = (productId: string) => {
    const current = homepageConfig.featuredProductIds || [];
    const next = current.includes(productId)
      ? current.filter(id => id !== productId)
      : [...current, productId];
    updateHomepageConfig({ featuredProductIds: next });
    triggerSaveFeedback();
  };

  const handleToggleDealProduct = (productId: string) => {
    const current = homepageConfig.dealProductIds || [];
    const next = current.includes(productId)
      ? current.filter(id => id !== productId)
      : [...current, productId];
    updateHomepageConfig({ dealProductIds: next });
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const sortedSections = [...homepageConfig.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Homepage Layout & Visual Builder
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-950 border border-brand-800 text-brand-400">
              Live Storefront Binding
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Reorder homepage sections, manage promotional slides, configure the announcement, and choose featured collections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in font-mono">
              <Check className="w-4 h-4" /> Storefront Updated!
            </span>
          )}

          <Link to="/" target="_blank">
            <KeycapButton variant="secondary" size="sm">
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Preview Storefront
            </KeycapButton>
          </Link>

          <button
            onClick={() => {
              resetHomepageConfig();
              triggerSaveFeedback();
            }}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors"
            title="Reset to factory layout"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('sections')}
          className={`py-2.5 px-4 rounded-t-lg transition-colors ${
            activeTab === 'sections'
              ? 'bg-slate-800 text-white border-t border-x border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Section Reordering & Visibility ({homepageConfig.sections.length})
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`py-2.5 px-4 rounded-t-lg transition-colors ${
            activeTab === 'banner'
              ? 'bg-slate-800 text-white border-t border-x border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Homepage Hero / Promotional Slides ({homepageConfig.heroSlides.length})
        </button>

        <button
          onClick={() => setActiveTab('announcement')}
          className={`py-2.5 px-4 rounded-t-lg transition-colors ${
            activeTab === 'announcement'
              ? 'bg-slate-800 text-white border-t border-x border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Top Announcement Bar
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`py-2.5 px-4 rounded-t-lg transition-colors ${
            activeTab === 'collections'
              ? 'bg-slate-800 text-white border-t border-x border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Featured Product Selections
        </button>
      </div>

      {/* Tab 1: Section Reordering */}
      {activeTab === 'sections' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <span>Arrange the order in which blocks appear on the visitor storefront.</span>
            <span className="font-mono text-emerald-400">Real-time sync enabled</span>
          </div>

          <div className="space-y-2">
            {sortedSections.map((sec, idx) => (
              <div
                key={sec.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  sec.enabled
                    ? 'bg-slate-900 border-slate-800 text-white'
                    : 'bg-slate-950 border-slate-900 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 font-mono text-xs text-slate-500 font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{sec.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {sec.id}
                      </span>
                    </h3>
                    {sec.subtitle && (
                      <p className="text-xs text-slate-400 mt-0.5">{sec.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Up / Down reorder */}
                  <div className="flex items-center border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="p-1.5 hover:bg-slate-800 disabled:opacity-20 text-slate-300"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === sortedSections.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="p-1.5 hover:bg-slate-800 disabled:opacity-20 text-slate-300 border-l border-slate-800"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Enable / Disable toggle */}
                  <button
                    onClick={() => handleToggleSection(sec.id)}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      sec.enabled
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {sec.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>{sec.enabled ? 'Enabled' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Hero Slides */}
      {activeTab === 'banner' && (
        <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Promotional carousel</h2>
              <p className="mt-1 text-xs text-slate-400">Add, preview, order and publish campaign slides for the storefront.</p>
            </div>
            <button type="button" onClick={() => { setEditingSlide(emptyHeroSlide(orderedSlides.length)); setSlideErrors({}); setImageError(''); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
              <Plus className="h-4 w-4" /> Add promotional slide
            </button>
          </div>

          <label className="flex max-w-sm flex-col gap-1.5 text-xs font-medium text-slate-300">
            Automatic rotation interval (seconds)
            <input type="number" min={2} max={30} step={1} value={Math.round((homepageConfig.heroIntervalMs || 7000) / 1000)} onChange={event => { const seconds = Number(event.target.value); if (seconds >= 2 && seconds <= 30) updateHomepageConfig({ heroIntervalMs: seconds * 1000 }); }} className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
            <span className="font-normal text-slate-500">Rotation pauses on hover, keyboard focus, manual pause, hidden tabs and reduced-motion settings.</span>
          </label>

          {orderedSlides.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 px-5 py-10 text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-slate-500" />
              <p className="mt-3 font-semibold text-white">No promotional slides yet</p>
              <p className="mt-1 text-sm text-slate-400">The storefront will show its branded fallback until you add an active slide.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orderedSlides.map((slide, index) => (
                <div key={slide.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 sm:flex-row sm:items-center">
                  <div className="h-16 w-full overflow-hidden rounded-lg bg-slate-800 sm:h-14 sm:w-24 sm:shrink-0">
                    {slide.imageUrl && <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Slide {index + 1}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${slide.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>{slide.isActive ? 'Active' : 'Disabled'}</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-white">{slide.title || 'Untitled slide'}</p>
                    <p className="truncate text-xs text-slate-400">{slide.ctaLabel || 'No CTA'} · {slide.ctaUrl}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" disabled={index === 0} onClick={() => handleMoveSlide(index, -1)} aria-label={`Move ${slide.title || 'slide'} up`} className="rounded-md border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" disabled={index === orderedSlides.length - 1} onClick={() => handleMoveSlide(index, 1)} aria-label={`Move ${slide.title || 'slide'} down`} className="rounded-md border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                    <button type="button" onClick={() => handleToggleSlide(slide.id, !slide.isActive)} className="rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800">{slide.isActive ? 'Disable' : 'Enable'}</button>
                    <button type="button" onClick={() => { setEditingSlide({ ...slide }); setSlideErrors({}); setImageError(''); }} className="rounded-md border border-blue-700 px-3 py-2 text-xs font-semibold text-blue-300 hover:bg-blue-950">Edit</button>
                    <button type="button" onClick={() => handleDeleteSlide(slide)} aria-label={`Delete ${slide.title || 'slide'}`} className="rounded-md border border-rose-900 p-2 text-rose-300 hover:bg-rose-950"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingSlide && (
            <div className="grid gap-5 border-t border-slate-800 pt-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,.9fr)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{orderedSlides.some(slide => slide.id === editingSlide.id) ? 'Edit slide' : 'New slide'}</h3>
                  <button type="button" onClick={() => { setEditingSlide(null); setSlideErrors({}); setImageError(''); }} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs text-slate-300 sm:col-span-2">Headline *
                    <input value={editingSlide.title} maxLength={90} onChange={event => setEditingSlide({ ...editingSlide, title: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    {slideErrors.title && <span className="mt-1 block text-rose-400">{slideErrors.title}</span>}
                  </label>
                  <label className="text-xs text-slate-300 sm:col-span-2">Short description *
                    <textarea rows={2} maxLength={180} value={editingSlide.description} onChange={event => setEditingSlide({ ...editingSlide, description: event.target.value })} className="mt-1 w-full resize-y rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    {slideErrors.description && <span className="mt-1 block text-rose-400">{slideErrors.description}</span>}
                  </label>
                  <label className="text-xs text-slate-300">Eyebrow label (optional)
                    <input value={editingSlide.eyebrow || ''} maxLength={36} onChange={event => setEditingSlide({ ...editingSlide, eyebrow: event.target.value })} placeholder="NEW ARRIVALS" className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                  </label>
                  <label className="text-xs text-slate-300">Image alt text
                    <input value={editingSlide.imageAlt || ''} onChange={event => setEditingSlide({ ...editingSlide, imageAlt: event.target.value })} placeholder="Describe the campaign image" className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                  </label>
                  <label className="text-xs text-slate-300">CTA button text *
                    <input value={editingSlide.ctaLabel} maxLength={32} onChange={event => setEditingSlide({ ...editingSlide, ctaLabel: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                    {slideErrors.ctaLabel && <span className="mt-1 block text-rose-400">{slideErrors.ctaLabel}</span>}
                  </label>
                  <label className="text-xs text-slate-300">Choose a destination
                    <select value={editingSlide.ctaUrl} onChange={event => setEditingSlide({ ...editingSlide, ctaUrl: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                      <option value="/shop">Shop all products</option>
                      {categories.map(category => <option key={`cat-${category.id}`} value={`/category/${category.id}`}>Category: {category.name}</option>)}
                      {products.slice(0, 100).map(product => <option key={`prod-${product.id}`} value={`/product/${product.slug}`}>Product: {product.name}</option>)}
                      {!editingSlide.ctaUrl.startsWith('/') && <option value={editingSlide.ctaUrl}>Custom URL</option>}
                    </select>
                  </label>
                  <label className="text-xs text-slate-300 sm:col-span-2">CTA destination URL *
                    <input value={editingSlide.ctaUrl} onChange={event => setEditingSlide({ ...editingSlide, ctaUrl: event.target.value })} placeholder="/shop or https://example.com" className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-sm text-white focus:border-blue-500 focus:outline-none" />
                    {slideErrors.ctaUrl && <span className="mt-1 block text-rose-400">{slideErrors.ctaUrl}</span>}
                  </label>
                  <div className="text-xs text-slate-300 sm:col-span-2">
                    <label htmlFor="hero-desktop-file" className="block">Desktop campaign image *</label>
                    <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                      <input id="hero-desktop-file" type="file" accept="image/*" onChange={event => handleSlideImageUpload(event.target.files?.[0], 'imageUrl')} className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-slate-700 file:px-2 file:py-1 file:text-slate-100" />
                      <span className="self-center text-[10px] text-slate-500">or use an image URL</span>
                    </div>
                    <input aria-label="Desktop image URL" value={editingSlide.imageUrl.startsWith('data:image/') ? '[Uploaded image stored in this browser]' : editingSlide.imageUrl} readOnly={editingSlide.imageUrl.startsWith('data:image/')} onChange={event => setEditingSlide({ ...editingSlide, imageUrl: event.target.value })} placeholder="https://…" className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none" />
                    {slideErrors.imageUrl && <span className="mt-1 block text-rose-400">{slideErrors.imageUrl}</span>}
                  </div>
                  <div className="text-xs text-slate-300 sm:col-span-2">
                    <label htmlFor="hero-mobile-file" className="block">Mobile image (optional)</label>
                    <input id="hero-mobile-file" type="file" accept="image/*" onChange={event => handleSlideImageUpload(event.target.files?.[0], 'mobileImageUrl')} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-slate-700 file:px-2 file:py-1 file:text-slate-100" />
                    <input aria-label="Mobile image URL" value={editingSlide.mobileImageUrl?.startsWith('data:image/') ? '[Uploaded image stored in this browser]' : editingSlide.mobileImageUrl || ''} readOnly={Boolean(editingSlide.mobileImageUrl?.startsWith('data:image/'))} onChange={event => setEditingSlide({ ...editingSlide, mobileImageUrl: event.target.value })} placeholder="Optional https://…" className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none" />
                    {slideErrors.mobileImageUrl && <span className="mt-1 block text-rose-400">{slideErrors.mobileImageUrl}</span>}
                  </div>
                  <label className="text-xs text-slate-300">Image focal position
                    <select value={editingSlide.imagePosition} onChange={event => setEditingSlide({ ...editingSlide, imagePosition: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                      <option value="center center">Center</option><option value="center top">Top center</option><option value="center bottom">Bottom center</option><option value="left center">Left</option><option value="right center">Right</option><option value="35% center">35% horizontal</option><option value="65% center">65% horizontal</option>
                    </select>
                  </label>
                  <label className="text-xs text-slate-300">Campaign text position
                    <select value={editingSlide.textPosition} onChange={event => setEditingSlide({ ...editingSlide, textPosition: event.target.value as HeroSlide['textPosition'] })} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"><option value="left">Left</option><option value="right">Right</option></select>
                  </label>
                  {imageError && <p className="text-rose-400 sm:col-span-2">{imageError}</p>}
                  <div className="flex justify-end gap-2 sm:col-span-2">
                    <button type="button" onClick={() => setEditingSlide(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
                    <button type="button" onClick={handleSaveSlide} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"><Save className="h-4 w-4" /> Save slide</button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live preview</p>
                <div className="relative flex aspect-[16/7] min-h-52 items-center overflow-hidden rounded-xl bg-slate-800">
                  {editingSlide.imageUrl && <img src={editingSlide.imageUrl} alt={editingSlide.imageAlt || editingSlide.title} style={{ objectPosition: editingSlide.imagePosition }} className="absolute inset-0 h-full w-full object-cover" />}
                  <div className={`absolute inset-0 ${editingSlide.textPosition === 'right' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-white via-white/90 to-white/10`} />
                  <div className={`relative z-10 max-w-[58%] p-5 ${editingSlide.textPosition === 'right' ? 'ml-auto text-right' : ''}`}>
                    {editingSlide.eyebrow && <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-700">{editingSlide.eyebrow}</p>}
                    <p className="line-clamp-2 text-xl font-bold leading-tight text-slate-950">{editingSlide.title || 'Campaign headline'}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-700">{editingSlide.description || 'Short description appears here.'}</p>
                    <span className="mt-3 inline-block rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">{editingSlide.ctaLabel || 'CTA button'}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Preview uses the desktop image. The optional mobile image replaces it on narrow screens.</p>
              </div>
            </div>
          )}
          <p className="border-t border-slate-800 pt-4 text-[11px] leading-relaxed text-slate-500">
            Prototype persistence: slide configuration is saved in this browser’s local storage. Uploaded images are resized to JPEG and stored there as image data. This does not upload files to a server or protect edits with production admin authentication.
          </p>
        </div>
      )}

      {/* Tab 3: Announcement Bar */}
      {activeTab === 'announcement' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4 max-w-2xl">
          <h3 className="font-bold text-sm text-white">Announcement Banner Settings</h3>
          <p className="text-xs text-slate-400">
            Top message strip displayed above the header on all storefront pages.
          </p>

          <div className="space-y-4 text-xs pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={homepageConfig.announcement.enabled}
                onChange={e =>
                  handleUpdateAnnouncement(
                    homepageConfig.announcement.text,
                    homepageConfig.announcement.highlightText || '',
                    homepageConfig.announcement.linkText || '',
                    homepageConfig.announcement.linkUrl || '',
                    e.target.checked
                  )
                }
                className="rounded text-brand-600"
              />
              <span className="text-white font-medium">Display Announcement Bar</span>
            </label>

            <div>
              <label className="block text-slate-400 mb-1">Highlight Badge</label>
              <input
                type="text"
                value={homepageConfig.announcement.highlightText || ''}
                onChange={e =>
                  handleUpdateAnnouncement(
                    homepageConfig.announcement.text,
                    e.target.value,
                    homepageConfig.announcement.linkText || '',
                    homepageConfig.announcement.linkUrl || '',
                    homepageConfig.announcement.enabled
                  )
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Announcement Message Text</label>
              <textarea
                rows={2}
                value={homepageConfig.announcement.text}
                onChange={e =>
                  handleUpdateAnnouncement(
                    e.target.value,
                    homepageConfig.announcement.highlightText || '',
                    homepageConfig.announcement.linkText || '',
                    homepageConfig.announcement.linkUrl || '',
                    homepageConfig.announcement.enabled
                  )
                }
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Link Label (Optional)</label>
                <input
                  type="text"
                  value={homepageConfig.announcement.linkText || ''}
                  onChange={e =>
                    handleUpdateAnnouncement(
                      homepageConfig.announcement.text,
                      homepageConfig.announcement.highlightText || '',
                      e.target.value,
                      homepageConfig.announcement.linkUrl || '',
                      homepageConfig.announcement.enabled
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Link URL</label>
                <input
                  type="text"
                  value={homepageConfig.announcement.linkUrl || ''}
                  onChange={e =>
                    handleUpdateAnnouncement(
                      homepageConfig.announcement.text,
                      homepageConfig.announcement.highlightText || '',
                      homepageConfig.announcement.linkText || '',
                      e.target.value,
                      homepageConfig.announcement.enabled
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Featured Product Selections */}
      {activeTab === 'collections' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="font-bold text-sm text-white">Featured Hardware Selector</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select which individual hardware items populate the "Featured Hardware" and "Deals" grids on the homepage.
            </p>
          </div>

          <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto pr-2">
            {products.map(prod => {
              const isFeatured = (homepageConfig.featuredProductIds || []).includes(prod.id);
              const isDeal = (homepageConfig.dealProductIds || []).includes(prod.id);

              return (
                <div key={prod.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-10 h-10 object-contain rounded bg-slate-900 border border-slate-800 p-1 flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-white block">{prod.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        SKU: {prod.sku} • {prod.brandName} • {formatPrice(prod.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFeaturedProduct(prod.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        isFeatured
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {isFeatured ? '✓ Featured' : '+ Featured'}
                    </button>

                    <button
                      onClick={() => handleToggleDealProduct(prod.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        isDeal
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {isDeal ? '⚡ In Deals' : '+ Deals'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
