import { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import type { Series } from '../../types';
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
  darkHoverColor: string;
}

export interface BrandDirectoryEntry extends BrandIdentity {
  id: string;
  description: string;
  series: Series[];
  count: number;
}

const brandIdentities: BrandIdentity[] = [
  { name: 'ASUS', slug: 'asus', logo: asusLogo, hoverColor: '#000000', darkHoverColor: '#f8fafc' },
  { name: 'Lenovo', slug: 'lenovo', logo: lenovoLogo, hoverColor: '#E2231A', darkHoverColor: '#ff6b63' },
  { name: 'MSI', slug: 'msi', logo: msiLogo, hoverColor: '#FF0000', darkHoverColor: '#ff6666' },
  { name: 'AMD', slug: 'amd', logo: amdLogo, hoverColor: '#ED1C24', darkHoverColor: '#ff6870' },
  { name: 'Intel', slug: 'intel', logo: intelLogo, hoverColor: '#0071C5', darkHoverColor: '#60baff' },
  { name: 'Corsair', slug: 'corsair', logo: corsairLogo, hoverColor: '#231F20', darkHoverColor: '#f8fafc' },
  { name: 'Samsung', slug: 'samsung', logo: samsungLogo, hoverColor: '#1428A0', darkHoverColor: '#a5b4fc' },
  { name: 'Dell / Alienware', slug: 'dell', logo: dellLogo, hoverColor: '#007DB8', darkHoverColor: '#64c8f3' },
];

// Store content stays authoritative, including administrator edits and product counts.
export const useBrandDirectory = (): BrandDirectoryEntry[] => {
  const { brands, products } = useStore();
  return useMemo(() => brands.map(brand => {
    const identity = brandIdentities.find(item => item.slug === brand.slug);
    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: identity?.logo || '',
      hoverColor: identity?.hoverColor || '#2563eb',
      darkHoverColor: identity?.darkHoverColor || '#60a5fa',
      description: brand.description,
      series: brand.seriesList,
      count: products.filter(product => product.brandId === brand.id).length,
    };
  }), [brands, products]);
};
