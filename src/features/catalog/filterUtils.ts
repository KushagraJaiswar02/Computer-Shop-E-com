import { Product } from '../../types';

export interface CatalogFilterCriteria {
  searchQuery?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  series?: string;
  isDealOnly?: boolean;
  isBestsellerOnly?: boolean;
  isFeaturedOnly?: boolean;
  isSaleOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: string;
}

export function filterAndSortProducts(
  products: Product[],
  criteria: CatalogFilterCriteria
): Product[] {
  const {
    searchQuery = '',
    category = '',
    subcategory = '',
    brand = '',
    series = '',
    isDealOnly = false,
    isBestsellerOnly = false,
    isFeaturedOnly = false,
    isSaleOnly = false,
    minPrice = 0,
    maxPrice = 500000,
    inStockOnly = false,
    sortBy = 'featured',
  } = criteria;

  return products
    .filter(product => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brandName.toLowerCase().includes(q);
        const matchesCategory = `${product.categoryName} ${product.subcategoryName || ''}`.toLowerCase().includes(q);
        const matchesSeries = (product.seriesName || '').toLowerCase().includes(q);
        const matchesDescription = product.shortDescription.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesAttrs = product.attributes.some(a => `${a.name} ${a.value}`.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSeries && !matchesDescription && !matchesSku && !matchesAttrs) {
          return false;
        }
      }

      // Category
      if (category && product.categoryId !== category) return false;

      // Subcategory
      if (subcategory && product.subcategoryId !== subcategory) return false;

      // Brand
      if (brand && product.brandId !== brand) return false;

      // Series
      if (series && product.seriesId !== series) return false;

      // Deal
      if (isDealOnly && !product.isDeal && (!product.discountPercent || product.discountPercent <= 0)) {
        return false;
      }

      // Bestseller
      if (isBestsellerOnly && !product.isBestseller) return false;

      // Featured collection
      if (isFeaturedOnly && !product.isFeatured) return false;

      // Product has a valid catalog discount/original price.
      if (isSaleOnly && !((product.originalPrice || 0) > product.price || (product.discountPercent || 0) > 0)) return false;

      // Price
      if (product.price < minPrice || product.price > maxPrice) return false;

      // In stock
      if (inStockOnly && product.stockStatus === 'out_of_stock') return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'discount':
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
}
