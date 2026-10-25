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

export const AdminHomepageBuilderPage: React.FC = () => {
  const { homepageConfig, updateHomepageConfig, resetHomepageConfig, products } = useStore();

  const [activeTab, setActiveTab] = useState<'sections' | 'banner' | 'announcement' | 'collections'>('sections');
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // Hero Slide management
  const handleUpdateSlide = (slideId: string, partial: Partial<HeroSlide>) => {
    const updated = homepageConfig.heroSlides.map(s =>
      s.id === slideId ? { ...s, ...partial } : s
    );
    updateHomepageConfig({ heroSlides: updated });
    triggerSaveFeedback();
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
            Reorder homepage sections, edit hero promotional silicon banners, configure top announcement messages, and pick featured collections.
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
          Hero Slides & Banners ({homepageConfig.heroSlides.length})
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
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="text-xs text-slate-400">
            Edit slides displayed in the rotating hero banner. Images and links update live on the homepage.
          </div>

          <div className="space-y-6">
            {homepageConfig.heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-900 text-brand-300 font-bold">
                      Slide #{idx + 1}
                    </span>
                    <span className="font-bold text-white text-sm">{slide.title}</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slide.isActive}
                      onChange={e => handleUpdateSlide(slide.id, { isActive: e.target.checked })}
                      className="rounded text-brand-600"
                    />
                    <span>Active in Slider</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={e => handleUpdateSlide(slide.id, { title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={slide.badge}
                      onChange={e => handleUpdateSlide(slide.id, { badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-400 mb-1">Supporting Subtitle</label>
                    <textarea
                      rows={2}
                      value={slide.subtitle}
                      onChange={e => handleUpdateSlide(slide.id, { subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Call-to-Action Text</label>
                    <input
                      type="text"
                      value={slide.ctaText}
                      onChange={e => handleUpdateSlide(slide.id, { ctaText: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Target Destination URL</label>
                    <input
                      type="text"
                      value={slide.ctaLink}
                      onChange={e => handleUpdateSlide(slide.id, { ctaLink: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-400 mb-1">Hero Image URL</label>
                    <input
                      type="text"
                      value={slide.imageUrl}
                      onChange={e => handleUpdateSlide(slide.id, { imageUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                        SKU: {prod.sku} • {prod.brandName} • ${prod.price}
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
