import { AdminSectionSorter } from './AdminSectionSorter';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AdminButton, AdminList, Field, FormSection, PageHeading, SaveBar, useAdminToast, useUnsavedChanges } from './AdminUi';
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
import { HomepageSection, HeroMode, HeroSlide } from '../../types';
import { KeycapButton } from '../../components/common/KeycapButton';
import { formatPrice } from '../../lib/utils';

const emptyHeroSlide = (sortOrder: number): HeroSlide => ({
  id: `hero-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now()}`,
  heroMode: 'hot_deals',
  useCustomCopy: false,
  useCustomImage: false,
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

const heroModeLabels: Record<HeroMode, string> = {
  hot_deals: 'Hot Deals',
  brands: 'Brands',
  new_arrivals: 'New Arrivals',
};

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
  const { homepageConfig: savedConfig, updateHomepageConfig: persistConfig, products, categories } = useStore();
  const [homepageConfig, setHomepageConfig] = useState(savedConfig);
  useEffect(() => setHomepageConfig(savedConfig), [savedConfig]);
  const updateHomepageConfig = (values: Partial<typeof savedConfig>) => setHomepageConfig(current => ({ ...current, ...values }));
  const location = useLocation(), navigate = useNavigate(), [params] = useSearchParams(), toast = useAdminToast();
  const route = location.pathname.split('/')[2];
  const activeTab = route === 'banners' ? 'banner' : route === 'announcement' ? 'announcement' : ['featured', 'deals'].includes(route) ? 'collections' : params.get('tab') || 'sections';
  const setActiveTab = (tab: string) => { if ((dirty || editingDirty) && !window.confirm('Leave without saving your storefront changes?')) return; navigate(tab === 'sections' ? '/admin/homepage-builder' : tab === 'banner' ? '/admin/banners' : tab === 'announcement' ? '/admin/announcement' : '/admin/featured'); };
  const pageTitle = activeTab === 'banner' ? 'Banners' : activeTab === 'announcement' ? 'Announcement bar' : activeTab === 'collections' ? route === 'deals' ? 'Deals' : 'Featured products' : 'Homepage';
  const dirty = JSON.stringify(homepageConfig) !== JSON.stringify(savedConfig);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideErrors, setSlideErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState('');
  const [saveError, setSaveError] = useState('');
  const editingDirty = !!editingSlide && JSON.stringify(homepageConfig.heroSlides.find(slide => slide.id === editingSlide.id)) !== JSON.stringify(editingSlide);
  useUnsavedChanges(dirty || editingDirty);
  const saveConfig = () => {
    if (editingSlide) { handleSaveSlide(); return; }
    const url = homepageConfig.announcement.linkUrl || '';
    if (url && !/^\/(?!\/)/.test(url) && !isValidHttpUrl(url)) { setSaveError('Use a shop path such as /shop or an http(s) URL for the announcement link.'); return; }
    try { persistConfig(homepageConfig); setSaveError(''); toast('Storefront changes saved.'); } catch (failure) { setSaveError(failure instanceof Error ? failure.message : 'Could not save changes.'); }
  };


  // Sections management
  const handleToggleSection = (id: string) => {
    const updated = homepageConfig.sections.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
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
    toast('Banner removed from this draft.', () => updateHomepageConfig({ heroSlides: orderedSlides }));
  };

  const handleSaveSlide = () => {
    if (!editingSlide) return;
    const errors: Record<string, string> = {};
    if (editingSlide.useCustomCopy && !editingSlide.title.trim()) errors.title = 'Enter a campaign headline.';
    if (editingSlide.useCustomCopy && !editingSlide.description.trim()) errors.description = 'Enter a short description.';
    if (editingSlide.useCustomCopy && !editingSlide.ctaLabel.trim()) errors.ctaLabel = 'Enter the button text.';
    const destination = editingSlide.ctaUrl.trim();
    if (editingSlide.useCustomCopy && (!destination || (!destination.startsWith('/') && !/^https?:\/\//i.test(destination)))) {
      errors.ctaUrl = 'Use a site path (for example /shop) or a full http(s) URL.';
    } else if (editingSlide.useCustomCopy && destination.startsWith('//')) {
      errors.ctaUrl = 'Use a site path beginning with one slash, or a full http(s) URL.';
    } else if (editingSlide.useCustomCopy && !destination.startsWith('/')) {
      try { new URL(destination); } catch { errors.ctaUrl = 'Enter a valid http(s) URL.'; }
    }
    if (editingSlide.useCustomImage && !editingSlide.imageUrl.trim()) errors.imageUrl = 'Add a desktop campaign image URL or upload.';
    else if (editingSlide.useCustomImage && !editingSlide.imageUrl.startsWith('data:image/') && !isValidHttpUrl(editingSlide.imageUrl)) errors.imageUrl = 'Enter a valid http(s) image URL.';
    if (editingSlide.useCustomImage && editingSlide.mobileImageUrl && !editingSlide.mobileImageUrl.startsWith('data:image/') && !isValidHttpUrl(editingSlide.mobileImageUrl)) errors.mobileImageUrl = 'Enter a valid http(s) image URL.';
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
    try {
      persistConfig({ ...homepageConfig, heroSlides: updated.map((slide, sortOrder) => ({ ...slide, ctaUrl: slide.ctaUrl || '/shop', sortOrder })) });
      toast('Banner saved to your storefront.');
    } catch (failure) { setImageError(failure instanceof Error ? failure.message : 'Could not save the banner.'); return; }

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
      setEditingSlide({ ...editingSlide, [field]: imageUrl, ...(field === 'imageUrl' ? { useCustomImage: true } : {}), ...(field === 'imageUrl' && !editingSlide.imageAlt ? { imageAlt: file.name.replace(/\.[^.]+$/, '') } : {}) });
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
    setSaveSuccess(false);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const sortedSections = [...homepageConfig.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="au-builder space-y-6 max-w-6xl">
      <PageHeading title={pageTitle} description={activeTab === 'sections' ? 'Choose the order of the sections on your homepage and show or hide them.' : activeTab === 'banner' ? 'Create the large promotional banners shoppers see first.' : activeTab === 'announcement' ? 'Write the short message shown above your shop header.' : 'Choose the products you want shoppers to notice.'} action={<Link to="/" target="_blank" className="au-button">Preview store ↗</Link>} />
      {/* Tabs */}
      <div className="au-builder-tabs flex border-b border-border gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('sections')}
          className={`py-2.5 px-4 rounded-t-lg transition-colors ${
            activeTab === 'sections'
              ? 'bg-surface-elevated text-main border-t border-x border-border'
              : 'text-muted hover:text-main'
          }`}
        >
          Homepage sections
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`py-2.5 px-4 rounded-t-lg transition-colors ${
            activeTab === 'banner'
              ? 'bg-surface-elevated text-main border-t border-x border-border'
              : 'text-muted hover:text-main'
          }`}
        >
          Banners
        </button>

        <button
          onClick={() => setActiveTab('announcement')}
          className={`py-2.5 px-4 rounded-t-lg transition-colors ${
            activeTab === 'announcement'
              ? 'bg-surface-elevated text-main border-t border-x border-border'
              : 'text-muted hover:text-main'
          }`}
        >
          Announcement bar
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`py-2.5 px-4 rounded-t-lg transition-colors ${
            activeTab === 'collections'
              ? 'bg-surface-elevated text-main border-t border-x border-border'
              : 'text-muted hover:text-main'
          }`}
        >
          Featured products
        </button>
      </div>

      {/* Tab 1: Section Reordering */}
      {activeTab === 'sections' && (
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-muted">
            <span>Arrange the order in which blocks appear on the visitor storefront.</span>
            <span className="font-sans text-success-ink">Save changes when you’re ready</span>
          </div>

          <AdminSectionSorter sections={sortedSections} onReorder={sections => updateHomepageConfig({ sections })} onToggle={handleToggleSection} />
        </div>
      )}

      {/* Tab 2: Hero Slides */}
      {activeTab === 'banner' && (
        <div className="space-y-5 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-main">Homepage banners</h2>
              <p className="mt-1 text-xs text-muted">Add, preview, order and publish campaign slides for the storefront.</p>
            </div>
            <button type="button" onClick={() => { setEditingSlide(emptyHeroSlide(orderedSlides.length)); setSlideErrors({}); setImageError(''); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
              <Plus className="h-4 w-4" /> Add banner
            </button>
          </div>

          <label className="flex max-w-sm flex-col gap-1.5 text-xs font-medium text-muted">
            Time between banners (seconds)
            <input type="number" min={2} max={30} step={1} value={Math.round((homepageConfig.heroIntervalMs || 7000) / 1000)} onChange={event => { const seconds = Number(event.target.value); if (seconds >= 2 && seconds <= 30) updateHomepageConfig({ heroIntervalMs: seconds * 1000 }); }} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none" />
            <span className="font-normal text-muted">Rotation pauses on hover, keyboard focus, manual pause, hidden tabs and reduced-motion settings.</span>
          </label>

          {orderedSlides.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3 font-semibold text-main">No promotional slides yet</p>
              <p className="mt-1 text-sm text-muted">The storefront will show its branded fallback until you add an active slide.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orderedSlides.map((slide, index) => (
                <div key={slide.id} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3 sm:flex-row sm:items-center">
                  <div className="h-16 w-full overflow-hidden rounded-lg bg-surface-elevated sm:h-14 sm:w-24 sm:shrink-0">
                    {slide.imageUrl && <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Slide {index + 1}</span>
                      {slide.heroMode && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">{heroModeLabels[slide.heroMode]}</span>}
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${slide.isActive ? 'bg-success text-success-ink' : 'bg-surface-elevated text-muted'}`}>{slide.isActive ? 'Active' : 'Disabled'}</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-main">{slide.title || 'Untitled slide'}</p>
                    <p className="truncate text-xs text-muted">{slide.ctaLabel || 'No button text'} · {slide.ctaUrl}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" disabled={index === 0} onClick={() => handleMoveSlide(index, -1)} aria-label={`Move ${slide.title || 'slide'} up`} className="rounded-md border border-border p-2 text-muted hover:bg-surface-elevated disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" disabled={index === orderedSlides.length - 1} onClick={() => handleMoveSlide(index, 1)} aria-label={`Move ${slide.title || 'slide'} down`} className="rounded-md border border-border p-2 text-muted hover:bg-surface-elevated disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                    <button type="button" onClick={() => handleToggleSlide(slide.id, !slide.isActive)} className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted hover:bg-surface-elevated">{slide.isActive ? 'Disable' : 'Enable'}</button>
                    <button type="button" onClick={() => { setEditingSlide({ ...slide }); setSlideErrors({}); setImageError(''); }} className="rounded-md border border-primary px-3 py-2 text-xs font-semibold text-accent hover:bg-primary-hover">Edit</button>
                    <button type="button" onClick={() => handleDeleteSlide(slide)} aria-label={`Delete ${slide.title || 'slide'}`} className="rounded-md border border-danger p-2 text-danger-ink hover:bg-danger"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingSlide && (
            <div className="grid gap-5 border-t border-border pt-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,.9fr)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-main">{orderedSlides.some(slide => slide.id === editingSlide.id) ? 'Edit banner' : 'New banner'}</h3>
                  <button type="button" onClick={() => { if (editingDirty && !window.confirm('Discard this banner edit?')) return; setEditingSlide(null); setSlideErrors({}); setImageError(''); }} className="text-xs text-muted hover:text-main">Cancel</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs text-muted sm:col-span-2">Banner content source
                    <select value={editingSlide.heroMode || 'hot_deals'} onChange={event => setEditingSlide({ ...editingSlide, heroMode: event.target.value as HeroMode })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none">
                      <option value="hot_deals">Hot Deals</option>
                      <option value="brands">Brands</option>
                      <option value="new_arrivals">New Arrivals</option>
                    </select>
                    <span className="mt-1 block text-[10px] text-muted">Show this banner when shoppers choose this option on the homepage.</span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-muted sm:col-span-2">
                    <input type="checkbox" checked={Boolean(editingSlide.useCustomCopy)} onChange={event => setEditingSlide({ ...editingSlide, useCustomCopy: event.target.checked })} className="mt-0.5 accent-primary" />
                    <span>Use my own headline, description and button text.</span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-muted sm:col-span-2">
                    <input type="checkbox" checked={Boolean(editingSlide.useCustomImage)} onChange={event => setEditingSlide({ ...editingSlide, useCustomImage: event.target.checked })} className="mt-0.5 accent-primary" />
                    <span>Use my own uploaded photo or image link.</span>
                  </label>
                  <label className="text-xs text-muted sm:col-span-2">Headline *
                    <input value={editingSlide.title} maxLength={90} onChange={event => setEditingSlide({ ...editingSlide, title: event.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none" />
                    {slideErrors.title && <span className="mt-1 block text-danger-ink">{slideErrors.title}</span>}
                  </label>
                  <label className="text-xs text-muted sm:col-span-2">Short description *
                    <textarea rows={2} maxLength={180} value={editingSlide.description} onChange={event => setEditingSlide({ ...editingSlide, description: event.target.value })} className="mt-1 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none" />
                    {slideErrors.description && <span className="mt-1 block text-danger-ink">{slideErrors.description}</span>}
                  </label>
                  <label className="text-xs text-muted">Small label above headline (optional)
                    <input value={editingSlide.eyebrow || ''} maxLength={36} onChange={event => setEditingSlide({ ...editingSlide, eyebrow: event.target.value })} placeholder="NEW ARRIVALS" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none" />
                  </label>
                  <label className="text-xs text-muted">Image alt text
                    <input value={editingSlide.imageAlt || ''} onChange={event => setEditingSlide({ ...editingSlide, imageAlt: event.target.value })} placeholder="Describe the campaign image" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none" />
                  </label>
                  <label className="text-xs text-muted">Button text *
                    <input value={editingSlide.ctaLabel} maxLength={32} onChange={event => setEditingSlide({ ...editingSlide, ctaLabel: event.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none" />
                    {slideErrors.ctaLabel && <span className="mt-1 block text-danger-ink">{slideErrors.ctaLabel}</span>}
                  </label>
                  <label className="text-xs text-muted">Choose a destination
                    <select value={editingSlide.ctaUrl} onChange={event => setEditingSlide({ ...editingSlide, ctaUrl: event.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none">
                      <option value={editingSlide.ctaUrl}>Current: {editingSlide.ctaUrl || 'No link yet'}</option>
                      <option value="/shop">Shop all products</option>
                      {categories.map(category => <option key={`cat-${category.id}`} value={`/category/${category.id}`}>Category: {category.name}</option>)}
                      {products.slice(0, 100).map(product => <option key={`prod-${product.id}`} value={`/product/${product.slug}`}>Product: {product.name}</option>)}
                      {!editingSlide.ctaUrl.startsWith('/') && <option value={editingSlide.ctaUrl}>Custom URL</option>}
                    </select>
                  </label>
                  <label className="text-xs text-muted sm:col-span-2">Button link *
                    <input value={editingSlide.ctaUrl} onChange={event => setEditingSlide({ ...editingSlide, ctaUrl: event.target.value })} placeholder="/shop or https://example.com" className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-main focus:border-primary focus:outline-none" />
                    {slideErrors.ctaUrl && <span className="mt-1 block text-danger-ink">{slideErrors.ctaUrl}</span>}
                  </label>
                  <div className="text-xs text-muted sm:col-span-2">
                    <label htmlFor="hero-desktop-file" className="block">Desktop campaign image *</label>
                    <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                      <input id="hero-desktop-file" type="file" accept="image/*" onChange={event => handleSlideImageUpload(event.target.files?.[0], 'imageUrl')} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted file:mr-3 file:rounded file:border-0 file:bg-surface-soft file:px-2 file:py-1 file:text-muted" />
                      <span className="self-center text-[10px] text-muted">or use an image URL</span>
                    </div>
                    <input aria-label="Desktop image URL" value={editingSlide.imageUrl.startsWith('data:image/') ? '[Uploaded image stored in this browser]' : editingSlide.imageUrl} readOnly={editingSlide.imageUrl.startsWith('data:image/')} onChange={event => setEditingSlide({ ...editingSlide, imageUrl: event.target.value })} placeholder="https://…" className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 font-sans text-xs text-main focus:border-primary focus:outline-none" />
                    {slideErrors.imageUrl && <span className="mt-1 block text-danger-ink">{slideErrors.imageUrl}</span>}
                  </div>
                  <div className="text-xs text-muted sm:col-span-2">
                    <label htmlFor="hero-mobile-file" className="block">Mobile image (optional)</label>
                    <input id="hero-mobile-file" type="file" accept="image/*" onChange={event => handleSlideImageUpload(event.target.files?.[0], 'mobileImageUrl')} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted file:mr-3 file:rounded file:border-0 file:bg-surface-soft file:px-2 file:py-1 file:text-muted" />
                    <input aria-label="Mobile image URL" value={editingSlide.mobileImageUrl?.startsWith('data:image/') ? '[Uploaded image stored in this browser]' : editingSlide.mobileImageUrl || ''} readOnly={Boolean(editingSlide.mobileImageUrl?.startsWith('data:image/'))} onChange={event => setEditingSlide({ ...editingSlide, mobileImageUrl: event.target.value })} placeholder="Optional https://…" className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 font-sans text-xs text-main focus:border-primary focus:outline-none" />
                    {slideErrors.mobileImageUrl && <span className="mt-1 block text-danger-ink">{slideErrors.mobileImageUrl}</span>}
                  </div>
                  <label className="text-xs text-muted">Image focal position
                    <select value={editingSlide.imagePosition} onChange={event => setEditingSlide({ ...editingSlide, imagePosition: event.target.value })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none">
                      <option value="center center">Center</option><option value="center top">Top center</option><option value="center bottom">Bottom center</option><option value="left center">Left</option><option value="right center">Right</option><option value="35% center">35% horizontal</option><option value="65% center">65% horizontal</option>
                    </select>
                  </label>
                  <label className="text-xs text-muted">Campaign text position
                    <select value={editingSlide.textPosition} onChange={event => setEditingSlide({ ...editingSlide, textPosition: event.target.value as HeroSlide['textPosition'] })} className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-main focus:border-primary focus:outline-none"><option value="left">Left</option><option value="right">Right</option></select>
                  </label>
                  {imageError && <p className="text-danger-ink sm:col-span-2">{imageError}</p>}
                  <div className="flex justify-end gap-2 sm:col-span-2">
                    <button type="button" onClick={() => { if (!editingDirty || window.confirm('Discard this banner edit?')) setEditingSlide(null); }} className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:bg-surface-elevated">Cancel</button>
                    <button type="button" onClick={handleSaveSlide} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover"><Save className="h-4 w-4" /> Save banner</button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Live preview</p>
                <div className="au-banner-preview relative flex aspect-[16/7] min-h-52 items-center overflow-hidden rounded-xl bg-surface-elevated">
                  {editingSlide.imageUrl && <img src={editingSlide.imageUrl} alt={editingSlide.imageAlt || editingSlide.title} style={{ objectPosition: editingSlide.imagePosition }} className="absolute inset-0 h-full w-full object-cover" />}
                  <div className={`absolute inset-0 ${editingSlide.textPosition === 'right' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-surface via-surface/90 to-surface/10`} />
                  <div className={`relative z-10 max-w-[58%] p-5 ${editingSlide.textPosition === 'right' ? 'ml-auto text-right' : ''}`}>
                    {editingSlide.eyebrow && <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-accent">{editingSlide.eyebrow}</p>}
                    <p className="line-clamp-2 text-xl font-bold leading-tight text-main">{editingSlide.title || 'Campaign headline'}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-main">{editingSlide.description || 'Short description appears here.'}</p>
                    <span className="mt-3 inline-block rounded-md bg-primary px-3 py-2 text-xs font-semibold text-on-primary">{editingSlide.ctaLabel || 'CTA button'}</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted">Preview uses the desktop image. The optional mobile image replaces it on narrow screens.</p>
              </div>
            </div>
          )}
          <p className="border-t border-border pt-4 text-[11px] leading-relaxed text-muted">
            Banners and uploaded photos are saved in this browser. Use image links if you need to save storage space.
          </p>
        </div>
      )}

      {activeTab === 'announcement' && <div className="au-grid-2"><div><FormSection title="Announcement message" help="This short strip appears above the header on every shop page."><label className="au-actions text-sm"><input type="checkbox" checked={homepageConfig.announcement.enabled} onChange={e => updateHomepageConfig({ announcement: { ...homepageConfig.announcement, enabled: e.target.checked } })} /> Show announcement bar</label><Field label="Small badge" help="For example: SALE or STORE NEWS."><input maxLength={40} value={homepageConfig.announcement.highlightText || ''} onChange={e => updateHomepageConfig({ announcement: { ...homepageConfig.announcement, highlightText: e.target.value } })} /></Field><Field label="Message"><textarea rows={3} maxLength={300} value={homepageConfig.announcement.text} onChange={e => updateHomepageConfig({ announcement: { ...homepageConfig.announcement, text: e.target.value } })} /></Field></FormSection><FormSection title="Optional link" help="Give shoppers a way to learn more about this message."><Field label="Link text"><input maxLength={60} value={homepageConfig.announcement.linkText || ''} onChange={e => updateHomepageConfig({ announcement: { ...homepageConfig.announcement, linkText: e.target.value } })} /></Field><Field label="Link address" help="Use /shop or a full https:// address." error={saveError}><input value={homepageConfig.announcement.linkUrl || ''} onChange={e => { setSaveError(''); updateHomepageConfig({ announcement: { ...homepageConfig.announcement, linkUrl: e.target.value } }); }} /></Field></FormSection></div><aside><h2 className="mb-3">Live preview</h2><div className="au-preview"><div className="rounded-lg bg-primary text-on-primary p-4 text-sm"><strong>{homepageConfig.announcement.highlightText}</strong> {homepageConfig.announcement.text || 'Your announcement message'} {homepageConfig.announcement.linkText && <span className="underline ml-2">{homepageConfig.announcement.linkText} →</span>}</div><p className="au-muted text-xs mt-3">{homepageConfig.announcement.enabled ? 'This announcement will be visible after you save.' : 'The announcement is hidden. Turn it on to show shoppers.'}</p></div></aside></div>}

      {activeTab === 'collections' && <AdminList hideHeading title={route === 'deals' ? 'Deal products' : 'Featured products'} description="Select products below, then save your changes. Selecting a deal does not change its price." rows={products} searchText={p => `${p.name} ${p.sku} ${p.brandName}`} columns={[
        { key: 'name', label: 'Product', sortValue: p => p.name, render: p => <div className="au-product">{p.images[0] && <img src={p.images[0]} alt="" />}<div><strong>{p.name}</strong><small>{p.sku} · {p.brandName}</small></div></div> },
        { key: 'price', label: 'Price', sortValue: p => p.price, render: p => formatPrice(p.price) },
        { key: 'featured', label: 'Featured', render: p => <AdminButton aria-pressed={homepageConfig.featuredProductIds.includes(p.id)} variant={homepageConfig.featuredProductIds.includes(p.id) ? 'primary' : 'quiet'} onClick={() => handleToggleFeaturedProduct(p.id)}>{homepageConfig.featuredProductIds.includes(p.id) ? '✓ Featured' : 'Add to featured'}</AdminButton> },
        { key: 'deal', label: 'Deal', render: p => <AdminButton aria-pressed={homepageConfig.dealProductIds.includes(p.id)} variant={homepageConfig.dealProductIds.includes(p.id) ? 'primary' : 'quiet'} onClick={() => handleToggleDealProduct(p.id)}>{homepageConfig.dealProductIds.includes(p.id) ? '✓ In deals' : 'Add to deals'}</AdminButton> },
      ]} />}
      {saveError && activeTab !== 'announcement' && <p role="alert" className="au-error">{saveError}</p>}
      <SaveBar dirty={dirty || editingDirty} onSave={saveConfig} onDiscard={() => { setHomepageConfig(savedConfig); setEditingSlide(null); setSlideErrors({}); setImageError(''); setSaveError(''); }} label={editingSlide ? 'Save banner and changes' : 'Save changes'} />
    </div>
  );
};
