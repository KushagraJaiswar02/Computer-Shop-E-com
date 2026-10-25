export type StockStatus = 'in_stock' | 'low_stock' | 'backorder' | 'out_of_stock';

export interface TechnicalAttribute {
  name: string;
  value: string;
  group?: 'General' | 'Performance' | 'Memory & Storage' | 'Display' | 'Ports & Connectivity' | 'Power & Thermal' | 'Physical & Warranty';
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  attributes: Record<string, string>; // e.g. { "RAM": "32GB", "Storage": "1TB NVMe" }
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  seriesId?: string;
  seriesName?: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
  stock: number;
  stockStatus: StockStatus;
  shortDescription: string;
  description: string;
  images: string[];
  attributes: TechnicalAttribute[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isDeal?: boolean;
  dealEndsAt?: string; // ISO date string
  warrantyMonths: number;
  compatibleAccessories?: string[]; // IDs of related compatible products
  createdAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  subcategories: Subcategory[];
  featuredTechSpecs?: string[]; // key filters to highlight for this category
}

export interface Series {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  tagline?: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description: string;
  seriesList: Series[];
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  date: string;
  verifiedBuyer: boolean;
  title: string;
  comment: string;
  systemConfig?: string; // e.g. "Ryzen 7 7800X3D + RTX 4080 Build"
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariantId?: string;
  unitPrice: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl: string;
  accentColor?: string;
  featuredSpecs?: string[];
  isActive: boolean;
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  highlightText?: string;
  linkText?: string;
  linkUrl?: string;
}

export type HomepageSectionType = 
  | 'hero'
  | 'categories'
  | 'featured_products'
  | 'deals'
  | 'bestsellers'
  | 'new_arrivals'
  | 'brands'
  | 'reviews'
  | 'trust_support';

export interface HomepageSection {
  id: HomepageSectionType;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  itemLimit?: number;
}

export interface HomepageConfig {
  announcement: AnnouncementConfig;
  heroSlides: HeroSlide[];
  sections: HomepageSection[];
  featuredProductIds: string[];
  dealProductIds: string[];
  bestsellerProductIds: string[];
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: CustomerAddress;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'card_demo' | 'wire_transfer' | 'in_store_pickup' | 'cod';
  paymentStatus: 'Simulated Paid' | 'Payment Pending' | 'Demo Success';
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface HardwareEnquiry {
  id: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  companyName?: string;
  enquiryType: 'custom_pc_build' | 'bulk_procurement' | 'compatibility_check' | 'component_availability';
  targetBudget?: string;
  message: string;
  status: 'New' | 'In Review' | 'Quotation Sent' | 'Closed';
}

export interface FilterState {
  searchQuery: string;
  category: string;
  subcategory: string;
  brand: string;
  series: string;
  minPrice: number;
  maxPrice: number;
  stockOnly: boolean;
  attributeFilters: Record<string, string[]>;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating' | 'discount';
}
