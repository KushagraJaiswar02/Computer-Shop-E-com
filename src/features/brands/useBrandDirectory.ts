import { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Product, Series } from '../../types';
import { formatPrice } from '../../lib/utils';
import asusLogo from '../../assets/brands/asus.svg?raw';
import lenovoLogo from '../../assets/brands/lenovo.svg?raw';
import msiLogo from '../../assets/brands/msi.svg?raw';
import amdLogo from '../../assets/brands/amd.svg?raw';
import intelLogo from '../../assets/brands/intel.svg?raw';
import corsairLogo from '../../assets/brands/corsair.svg?raw';
import samsungLogo from '../../assets/brands/samsung.svg?raw';
import dellLogo from '../../assets/brands/dell.svg?raw';

interface BrandIdentity {
  name: string;
  slug: string;
  logo: string;
  hoverColor: string;
  accentColor: string;
  tagline: string;
  heroSrc?: string;
  cardSrc?: string;
  darkHoverColor: string;
}

export interface BrandCategoryLink {
  id: string;
  name: string;
}

export interface BrandPriceRange {
  min: number;
  max: number;
  formatted: string;
}

export interface BrandDirectoryEntry extends BrandIdentity {
  id: string;
  description: string;
  series: Series[];
  count: number;
  lowestPrice?: number;
  priceRange?: BrandPriceRange;
  productImage?: string;
  categories: string[];
  categoryLinks: BrandCategoryLink[];
  topProducts: Product[];
}

const brandIdentities: BrandIdentity[] = [
  { name: 'ASUS', slug: 'asus', tagline: 'Republic of Gamers', logo: asusLogo, hoverColor: '#000000', accentColor: '#000000', darkHoverColor: '#f8fafc' },
  { name: 'Lenovo', slug: 'lenovo', tagline: 'Legion & ThinkPad', logo: lenovoLogo, hoverColor: '#E2231A', accentColor: '#E2231A', darkHoverColor: '#ff6b63' },
  { name: 'MSI', slug: 'msi', tagline: 'MEG, MAG & SUPRIM', logo: msiLogo, hoverColor: '#FF0000', accentColor: '#FF0000', darkHoverColor: '#ff6666' },
  { name: 'AMD', slug: 'amd', tagline: 'Ryzen & Radeon', logo: amdLogo, hoverColor: '#ED1C24', accentColor: '#ED1C24', darkHoverColor: '#ff6870' },
  { name: 'Intel', slug: 'intel', tagline: 'Core & Core Ultra', logo: intelLogo, hoverColor: '#0071C5', accentColor: '#0071C5', darkHoverColor: '#60baff' },
  { name: 'Corsair', slug: 'corsair', tagline: 'Vengeance & Dominator', logo: corsairLogo, hoverColor: '#231F20', accentColor: '#231F20', darkHoverColor: '#f8fafc' },
  { name: 'Samsung', slug: 'samsung', tagline: '990 PRO NVMe', logo: samsungLogo, hoverColor: '#1428A0', accentColor: '#1428A0', darkHoverColor: '#a5b4fc' },
  { name: 'Dell / Alienware', slug: 'dell', tagline: 'Alienware M-Series', logo: dellLogo, hoverColor: '#007DB8', accentColor: '#007DB8', darkHoverColor: '#64c8f3' },
];

// Store content stays authoritative, including administrator edits and product counts.
export const useBrandDirectory = (): BrandDirectoryEntry[] => {
  const { brands, products, categories } = useStore();
  return useMemo(() => brands.map(brand => {
    const identity = brandIdentities.find(item => item.slug === brand.slug);
    const brandProducts = products.filter(product => product.brandId === brand.id);
    const prices = brandProducts.map(product => product.price).filter(price => Number.isFinite(price) && price >= 0);

    let priceRange: BrandPriceRange | undefined = undefined;
    if (prices.length > 0) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const formatted = min === max ? formatPrice(min) : `${formatPrice(min)} \u2013 ${formatPrice(max)}`;
      priceRange = { min, max, formatted };
    }

    const categoryMap = new Map<string, string>();
    brandProducts.forEach(product => {
      const cat = categories.find(c => c.id === product.categoryId);
      const name = cat?.name || product.categoryName;
      const id = cat?.id || product.categoryId;
      if (id && name) {
        categoryMap.set(id, name);
      }
    });
    const categoryLinks: BrandCategoryLink[] = Array.from(categoryMap.entries()).map(([id, name]) => ({ id, name }));

    const topProducts = [...brandProducts]
      .sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        const rA = a.rating ?? 0;
        const rB = b.rating ?? 0;
        if (rB !== rA) return rB - rA;
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      })
      .slice(0, 4);

    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: identity?.logo || '',
      hoverColor: identity?.hoverColor || '#2563eb',
      accentColor: identity?.accentColor || '#2563eb',
      tagline: identity?.tagline || '',
      heroSrc: identity?.heroSrc,
      cardSrc: identity?.cardSrc,
      darkHoverColor: identity?.darkHoverColor || '#60a5fa',
      description: brand.description,
      series: brand.seriesList,
      count: brandProducts.length,
      lowestPrice: prices.length ? Math.min(...prices) : undefined,
      priceRange,
      productImage: brandProducts.find(product => product.images[0])?.images[0],
      categories: categoryLinks.map(c => c.name),
      categoryLinks,
      topProducts,
    };
  }), [brands, products, categories]);
};
