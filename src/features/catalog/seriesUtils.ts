import { Brand, Product } from '../../types';

export interface BrandSeriesCount {
  name: string;
  count: number;
  minPrice: number;
  maxPrice: number;
}

export interface BrandProductGroup extends BrandSeriesCount {
  series: string | null;
  products: Product[];
}

export function getPriceRange(products: Product[]): { min: number; max: number } | undefined {
  const prices = products.map(product => product.price).filter(price => Number.isFinite(price) && price >= 0);
  if (!prices.length) return undefined;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

// Category is deliberately independent: one series can contain several categories.
export function getBrandProductGroups(products: Product[], brandId: string): BrandProductGroup[] {
  const groups = new Map<string | null, Product[]>();
  for (const product of products) {
    if (product.brandId !== brandId) continue;
    const series = product.series?.trim() || null;
    const group = groups.get(series) || [];
    group.push(product);
    groups.set(series, group);
  }
  return Array.from(groups, ([series, items]) => {
    const range = getPriceRange(items);
    return {
      name: series || 'Other',
      series,
      count: items.length,
      minPrice: range?.min ?? 0,
      maxPrice: range?.max ?? 0,
      products: items,
    };
  }).sort((a, b) => {
    if (a.series === null) return 1;
    if (b.series === null) return -1;
    return b.count - a.count || a.name.localeCompare(b.name);
  });
}

export function getSeriesForBrand(products: Product[], brandId: string): BrandSeriesCount[] {
  return getBrandProductGroups(products, brandId)
    .filter(group => group.series !== null)
    .map(({ name, count, minPrice, maxPrice }) => ({ name, count, minPrice, maxPrice }));
}

export function getBrandHref(brand: Pick<Brand, 'slug'>, series?: string): string {
  const path = `/brands/${encodeURIComponent(brand.slug)}`;
  return series?.trim() ? `${path}?series=${encodeURIComponent(series.trim())}` : path;
}
