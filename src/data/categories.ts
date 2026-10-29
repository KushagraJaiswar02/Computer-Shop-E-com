// Placeholder categories. Replace after the shop confirms its real list.
import { Laptop, CircuitBoard, Cpu, MemoryStick, HardDrive, Monitor, Keyboard, type LucideIcon } from 'lucide-react';
import type { Category, Product } from '../types';

export interface CategoryConfig {
  name: string;
  slug: string;
  icon: LucideIcon;
  accentColor: string;
  imageSrc?: string;
  featured?: boolean;
  subcategories?: { name: string; slug: string }[];
}

export const CATEGORY_CONFIG: CategoryConfig[] = [
  { name: 'Laptops', slug: 'laptops', icon: Laptop, accentColor: '#2563eb' },
  { name: 'Graphics Cards', slug: 'graphics-cards', icon: CircuitBoard, accentColor: '#7c3aed' },
  { name: 'Processors', slug: 'processors', icon: Cpu, accentColor: '#c2410c' },
  { name: 'Memory', slug: 'memory-ram', icon: MemoryStick, accentColor: '#0f766e' },
  { name: 'Storage', slug: 'storage-ssd', icon: HardDrive, accentColor: '#0369a1' },
  { name: 'Motherboards', slug: 'motherboards', icon: CircuitBoard, accentColor: '#4338ca' },
  { name: 'Monitors', slug: 'monitors', icon: Monitor, accentColor: '#be185d' },
  { name: 'Peripherals', slug: 'peripherals', icon: Keyboard, accentColor: '#a16207' },
];

export interface CategoryDirectoryEntry extends Omit<CategoryConfig, 'subcategories'> {
  id: string;
  description: string;
  count: number;
  href: string;
  subcategories: { id: string; slug: string; name: string; count: number; href: string }[];
}

export const categoryListingUrl = (categoryId: string, subcategoryId?: string): string => {
  const params = new URLSearchParams({ category: categoryId });
  if (subcategoryId) params.set('subcategory', subcategoryId);
  return `/shop?${params.toString()}`;
};

export const buildCategoryDirectory = (config: CategoryConfig[], products: Product[], catalog: Category[]): CategoryDirectoryEntry[] => config.map(entry => {
  const category = catalog.find(item => item.slug === entry.slug || item.id === entry.slug);
  const id = category?.id || entry.slug;
  const categoryProducts = products.filter(product => product.categoryId === id);
  const subcategories = new Map<string, CategoryDirectoryEntry['subcategories'][number]>();
  categoryProducts.forEach(product => {
    if (!product.subcategoryId) return;
    const metadata = category?.subcategories.find(sub => sub.id === product.subcategoryId);
    const slug = metadata?.slug || product.subcategoryId;
    const configured = entry.subcategories?.find(sub => sub.slug === slug);
    if (entry.subcategories && !configured) return;
    const name = configured?.name || metadata?.name || product.subcategoryName;
    if (!name) return;
    const existing = subcategories.get(product.subcategoryId);
    if (existing) existing.count++;
    else subcategories.set(product.subcategoryId, { id: product.subcategoryId, slug, name, count: 1, href: categoryListingUrl(id, product.subcategoryId) });
  });
  return { ...entry, id, description: category?.description || '', count: categoryProducts.length, href: categoryListingUrl(id), subcategories: [...subcategories.values()] };
});
