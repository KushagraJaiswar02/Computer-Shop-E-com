import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  Brand,
  CartItem,
  HomepageConfig,
  Order,
  HardwareEnquiry,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  DEFAULT_HOMEPAGE_CONFIG,
  SAMPLE_ORDERS,
} from '../data/mockData';

interface StoreContextType {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Catalog
  products: Product[];
  categories: Category[];
  brands: Brand[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariantId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare
  compareList: string[]; // up to 4 product IDs
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Homepage Config (Admin editable!)
  homepageConfig: HomepageConfig;
  updateHomepageConfig: (newConfig: Partial<HomepageConfig>) => void;
  resetHomepageConfig: () => void;

  // Orders
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;

  // Enquiries
  enquiries: HardwareEnquiry[];
  submitEnquiry: (enquiry: Omit<HardwareEnquiry, 'id' | 'createdAt' | 'status'>) => void;

  // Shortcuts & UI focus
  isCategoryNavOpen: boolean;
  setIsCategoryNavOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  focusedProductId: string | null;
  setFocusedProductId: (id: string | null) => void;
  searchInputRef: React.RefObject<HTMLInputElement> | null;
  registerSearchInputRef: (ref: React.RefObject<HTMLInputElement>) => void;
  focusSearch: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  THEME: 'nexustech_theme',
  CART: 'nexustech_cart',
  WISHLIST: 'nexustech_wishlist',
  COMPARE: 'nexustech_compare',
  HOMEPAGE: 'nexustech_homepage_config_v2',
  PRODUCTS: 'nexustech_custom_products',
  ORDERS: 'nexustech_orders',
  ENQUIRIES: 'nexustech_enquiries',
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  const addProduct = (prod: Product) => {
    setProducts(prev => [prod, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Categories & Brands (static data reference for consistency)
  const categories = INITIAL_CATEGORIES;
  const brands = INITIAL_BRANDS;

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, selectedVariantId?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedVariantId === selectedVariantId
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedVariantId,
          unitPrice: product.price,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    return ['prod-lap-001', 'prod-gpu-001'];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPARE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse compare list', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPARE, JSON.stringify(compareList));
  }, [compareList]);

  const toggleCompare = (productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 hardware components at once.');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const clearCompare = () => setCompareList([]);
  const isInCompare = (productId: string) => compareList.includes(productId);

  // Homepage Config (Admin configurable, reflected live on storefront!)
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.HOMEPAGE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse homepage config', e);
      }
    }
    return DEFAULT_HOMEPAGE_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HOMEPAGE, JSON.stringify(homepageConfig));
  }, [homepageConfig]);

  const updateHomepageConfig = (newConfig: Partial<HomepageConfig>) => {
    setHomepageConfig(prev => ({
      ...prev,
      ...newConfig,
    }));
  };

  const resetHomepageConfig = () => {
    setHomepageConfig(DEFAULT_HOMEPAGE_CONFIG);
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse orders', e);
      }
    }
    return SAMPLE_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      orderNumber: `NT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Enquiries
  const [enquiries, setEnquiries] = useState<HardwareEnquiry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ENQUIRIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse enquiries', e);
      }
    }
    return [
      {
        id: 'enq-001',
        createdAt: '2024-10-22T10:14:00Z',
        customerName: 'Marcus Vance',
        email: 'marcus.v@studioapex.design',
        phone: '+1 (555) 234-8901',
        companyName: 'Apex Visual Studios',
        enquiryType: 'custom_pc_build',
        targetBudget: '$6,500 - $8,000',
        message: 'Need 3 dual-GPU workstations for Unreal Engine 5 real-time ray-tracing and DaVinci Resolve rendering.',
        status: 'In Review',
      },
      {
        id: 'enq-002',
        createdAt: '2024-10-23T15:40:00Z',
        customerName: 'Sarah Lin',
        email: 'sarah.lin@techstart.io',
        phone: '+1 (555) 890-1234',
        companyName: 'TechStart Labs',
        enquiryType: 'bulk_procurement',
        targetBudget: '$15,000+',
        message: 'Looking to purchase 10 units of ROG Strix SCAR 16 laptops for our mobile AI dev team.',
        status: 'New',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  }, [enquiries]);

  const submitEnquiry = (enquiryData: Omit<HardwareEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnquiry: HardwareEnquiry = {
      ...enquiryData,
      id: `enq-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
  };

  // Keyboard navigation & search focus
  const [isCategoryNavOpen, setIsCategoryNavOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [focusedProductId, setFocusedProductId] = useState<string | null>(null);
  const [searchInputRefState, setSearchInputRefState] = useState<React.RefObject<HTMLInputElement> | null>(null);

  const registerSearchInputRef = (ref: React.RefObject<HTMLInputElement>) => {
    setSearchInputRefState(ref);
  };

  const focusSearch = () => {
    if (searchInputRefState && searchInputRefState.current) {
      searchInputRefState.current.focus();
      searchInputRefState.current.select();
    }
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme,
        products,
        categories,
        brands,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        clearCompare,
        isInCompare,
        homepageConfig,
        updateHomepageConfig,
        resetHomepageConfig,
        orders,
        createOrder,
        enquiries,
        submitEnquiry,
        isCategoryNavOpen,
        setIsCategoryNavOpen,
        isShortcutsModalOpen,
        setIsShortcutsModalOpen,
        focusedProductId,
        setFocusedProductId,
        searchInputRef: searchInputRefState,
        registerSearchInputRef,
        focusSearch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
