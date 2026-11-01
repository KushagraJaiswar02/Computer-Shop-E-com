import type { Brand, Category, Product, TechnicalAttribute } from '../types';

/** Deterministic, compact fixtures used only by the browser demo. */
export const DEMO_MARKER = 'compshop-demo-v1';
export const demoToday = () => new Date();
const day = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString();

export const placeholderImage = (label: string, category: string, variant = 0) => {
  const palettes = [['#172554', '#2563eb'], ['#3f0c43', '#c026d3'], ['#3f1d0a', '#ea580c'], ['#12372a', '#16a34a']];
  const [start, end] = palettes[variant % palettes.length];
  const safe = label.replace(/[<>&]/g, '').slice(0, 24);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="${start}"/><stop offset="1" stop-color="${end}"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="650" cy="120" r="180" fill="white" opacity=".08"/><text x="48" y="265" fill="white" font-family="Arial,sans-serif" font-size="44" font-weight="700">${safe}</text><text x="48" y="318" fill="white" opacity=".75" font-family="Arial,sans-serif" font-size="22">${category} · DEMO</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const extraBrands: Brand[] = [
  { id: 'kingston', name: 'Kingston', slug: 'kingston', description: 'Memory and storage built for everyday systems and upgrades.', seriesList: [{ id: 'fury', name: 'FURY', slug: 'fury', brandId: 'kingston', tagline: 'Gaming memory and storage' }] },
  { id: 'logitech', name: 'Logitech', slug: 'logitech', description: 'Reliable keyboards, mice and headsets for work and play.', seriesList: [{ id: 'g', name: 'G Series', slug: 'g', brandId: 'logitech', tagline: 'Gaming peripherals' }] },
  { id: 'hp', name: 'HP', slug: 'hp', description: 'Business notebooks and practical desktop displays.', seriesList: [{ id: 'victus', name: 'Victus', slug: 'victus', brandId: 'hp', tagline: 'Accessible gaming laptops' }] },
  { id: 'acer', name: 'Acer', slug: 'acer', description: 'Gaming laptops and high-refresh displays.', seriesList: [{ id: 'predator', name: 'Predator', slug: 'predator', brandId: 'acer', tagline: 'Performance gaming' }] },
];

export const makeDemoCatalog = (baseProducts: Product[], baseCategories: Category[], baseBrands: Brand[]) => {
  const categories = baseCategories.map(category => ({ ...category, subcategories: [...category.subcategories] }));
  const laptops = categories.find(category => category.id === 'laptops');
  const peripherals = categories.find(category => category.id === 'peripherals');
  if (laptops && !laptops.subcategories.some(item => item.id === 'business-laptops')) laptops.subcategories.push({ id: 'business-laptops', name: 'Business Laptops', slug: 'business-laptops' });
  if (peripherals && !peripherals.subcategories.some(item => item.id === 'headsets')) peripherals.subcategories.push({ id: 'headsets', name: 'Gaming Headsets', slug: 'headsets' });
  // An intentionally empty child category makes empty-state management testable.
  if (peripherals && !peripherals.subcategories.some(item => item.id === 'webcams')) peripherals.subcategories.push({ id: 'webcams', name: 'Webcams', slug: 'webcams' });
  const brands = [...baseBrands, ...extraBrands.filter(brand => !baseBrands.some(existing => existing.id === brand.id))];
  const brand = (id: string) => brands.find(item => item.id === id)!;
  const category = (id: string) => categories.find(item => item.id === id)!;
  const subcategory = (categoryId: string, id: string) => category(categoryId).subcategories.find(item => item.id === id);
  const attributes = (categoryId: string, index: number): TechnicalAttribute[] => {
    const shared: Record<string, TechnicalAttribute[]> = {
      laptops: [{ name: 'CPU', value: index % 2 ? 'AMD Ryzen 7 8845HS' : 'Intel Core Ultra 7 155H', group: 'Performance' }, { name: 'GPU', value: index % 3 ? 'NVIDIA GeForce RTX 4060 8GB' : 'Integrated graphics', group: 'Performance' }, { name: 'RAM', value: `${16 + (index % 2) * 16}GB DDR5`, group: 'Memory & Storage' }, { name: 'Storage', value: '1TB PCIe 4.0 NVMe', group: 'Memory & Storage' }, { name: 'Display', value: '16-inch 2560 × 1600 165Hz IPS', group: 'Display' }, { name: 'Battery', value: '80Wh', group: 'Power & Thermal' }, { name: 'Weight', value: '2.2kg', group: 'Physical & Warranty' }],
      'graphics-cards': [{ name: 'Chip', value: index % 2 ? 'GeForce RTX 4070 SUPER' : 'Radeon RX 7800 XT', group: 'Performance' }, { name: 'VRAM', value: '16GB GDDR6', group: 'Memory & Storage' }, { name: 'Boost Clock', value: '2475MHz', group: 'Performance' }, { name: 'Power Connectors', value: '2 × 8-pin', group: 'Power & Thermal' }, { name: 'Recommended PSU', value: '750W', group: 'Power & Thermal' }],
      processors: [{ name: 'Socket', value: index % 2 ? 'AM5' : 'LGA1700', group: 'General' }, { name: 'Cores / Threads', value: index % 2 ? '8 / 16' : '14 / 20', group: 'Performance' }, { name: 'Boost Clock', value: '5.4GHz', group: 'Performance' }, { name: 'TDP', value: '125W', group: 'Power & Thermal' }],
      'memory-ram': [{ name: 'Generation', value: 'DDR5', group: 'Memory & Storage' }, { name: 'Capacity', value: '32GB (2 × 16GB)', group: 'Memory & Storage' }, { name: 'Speed', value: '6000MT/s', group: 'Performance' }, { name: 'Latency', value: 'CL36', group: 'Performance' }],
      'storage-ssd': [{ name: 'Form Factor', value: 'M.2 2280', group: 'General' }, { name: 'Interface', value: 'PCIe 4.0 ×4 NVMe', group: 'Performance' }, { name: 'Sequential Read', value: '7,400MB/s', group: 'Performance' }, { name: 'Sequential Write', value: '6,500MB/s', group: 'Performance' }],
      motherboards: [{ name: 'Chipset', value: index % 2 ? 'B650' : 'Z790', group: 'General' }, { name: 'Socket', value: index % 2 ? 'AM5' : 'LGA1700', group: 'General' }, { name: 'Form Factor', value: 'ATX', group: 'Physical & Warranty' }, { name: 'Memory Slots', value: '4 × DDR5', group: 'Memory & Storage' }],
      monitors: [{ name: 'Screen Size', value: '27-inch', group: 'Display' }, { name: 'Resolution', value: '2560 × 1440', group: 'Display' }, { name: 'Refresh Rate', value: '180Hz', group: 'Display' }, { name: 'Panel', value: 'Fast IPS', group: 'Display' }],
      peripherals: [{ name: 'Connectivity', value: 'USB-C wired / 2.4GHz wireless', group: 'Ports & Connectivity' }, { name: 'Warranty', value: '24 months', group: 'Physical & Warranty' }],
    };
    return shared[categoryId] || [];
  };
  const definitions: Array<[string, string, string, string, string, number]> = [
    ['asus', 'laptops', 'gaming-laptops', 'rog', 'ASUS ROG Zephyrus G16 OLED Demo Edition', 189990], ['asus', 'graphics-cards', 'nvidia-geforce', 'rog', 'ASUS ROG Strix RTX 4070 SUPER 12GB', 74990], ['lenovo', 'laptops', 'business-laptops', 'thinkpad', 'Lenovo ThinkPad T16 Gen 3 Business Notebook', 129990], ['lenovo', 'laptops', 'gaming-laptops', 'legion', 'Lenovo Legion 5i 16 Gaming Laptop', 139990], ['msi', 'laptops', 'gaming-laptops', 'mag', 'MSI Katana 15 HX Gaming Laptop', 109990], ['msi', 'graphics-cards', 'nvidia-geforce', 'suprim', 'MSI RTX 4070 Ti SUPER 16G', 82990], ['amd', 'processors', 'amd-ryzen', 'ryzen-7000', 'AMD Ryzen 5 7600 Desktop Processor', 18990], ['amd', 'graphics-cards', 'amd-radeon', 'radeon-7000', 'AMD Radeon RX 7800 XT 16GB Demo Card', 52990], ['intel', 'processors', 'intel-desktop', 'core-14th', 'Intel Core i5-14600K Desktop Processor', 28490], ['corsair', 'memory-ram', 'ddr5-desktop', 'vengeance', 'Corsair Vengeance DDR5 32GB 6000MT/s', 10490], ['corsair', 'peripherals', 'keyboards', 'dominator', 'Corsair K70 RGB PRO Mechanical Keyboard', 12990], ['kingston', 'memory-ram', 'ddr5-desktop', 'fury', 'Kingston FURY Beast DDR5 32GB Kit', 8990], ['kingston', 'storage-ssd', 'nvme-m2', 'fury', 'Kingston KC3000 2TB NVMe SSD', 13490], ['samsung', 'storage-ssd', 'sata-ssd', '990-pro', 'Samsung 870 EVO 2TB SATA SSD', 13990], ['logitech', 'peripherals', 'mice', 'g', 'Logitech G PRO X Superlight 2 Mouse', 13995], ['logitech', 'peripherals', 'headsets', 'g', 'Logitech G Pro X 2 Lightspeed Headset', 18995], ['hp', 'laptops', 'business-laptops', 'victus', 'HP Victus 16 Ryzen 7 Gaming Laptop', 91990], ['acer', 'laptops', 'gaming-laptops', 'predator', 'Acer Predator Helios Neo 16 Gaming Laptop', 119990], ['acer', 'monitors', 'gaming-monitors', 'predator', 'Acer Predator XB273U 27-inch 180Hz Monitor', 28990], ['asus', 'motherboards', 'amd-boards', 'rog', 'ASUS ROG Strix B650E-F Gaming WiFi', 26990], ['msi', 'motherboards', 'intel-boards', 'mag', 'MSI MAG Z790 Tomahawk WiFi', 30990], ['dell', 'monitors', 'creator-monitors', 'alienware-m', 'Dell Alienware AW2724DM 27-inch QHD Monitor', 34990], ['kingston', 'storage-ssd', 'external-ssd', 'fury', 'Kingston XS1000 1TB Portable SSD', 7990], ['logitech', 'peripherals', 'keyboards', 'g', 'Logitech G915 TKL Lightspeed Keyboard', 17995], ['hp', 'monitors', 'creator-monitors', 'victus', 'HP Series 7 Pro 27-inch 4K Display', 36990], ['acer', 'monitors', 'ultrawide-monitors', 'predator', 'Acer Nitro XZ342CU 34-inch Ultrawide Monitor', 39990], ['asus', 'laptops', 'ultrabooks', 'zenbook', 'ASUS Zenbook 14 OLED Ultra 7', 99990], ['lenovo', 'laptops', 'ultrabooks', 'ideapad', 'Lenovo IdeaPad Slim 5 14', 64990], ['corsair', 'peripherals', 'power-supplies', 'vengeance', 'Corsair RM850e 850W Gold PSU', 12490], ['intel', 'processors', 'intel-desktop', 'core-ultra', 'Intel Core Ultra 7 265K Desktop Processor', 41990],
  ];
  const additions = definitions.map(([brandId, categoryId, subcategoryId, seriesId, name, price], index): Product => {
    const series = brand(brandId).seriesList.find(item => item.id === seriesId);
    const cat = category(categoryId); const sub = subcategory(categoryId, subcategoryId);
    const originalPrice = index === 0 ? Math.round(price / .6) : index % 3 === 0 ? Math.round(price * 1.12) : undefined;
    const images = index === 1 ? [] : index === 2 ? [placeholderImage(name, cat.name, index)] : Array.from({ length: 2 + index % 3 }, (_, imageIndex) => placeholderImage(name, cat.name, index + imageIndex));
    return { id: `demo-product-${index + 1}`, isDemo: true, slug: `demo-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/,'')}`, name: index === 3 ? `${name} with an intentionally descriptive extended configuration title for catalogue truncation and accessibility testing across narrow product cards` : name, brandId, brandName: brand(brandId).name, categoryId, categoryName: cat.name, subcategoryId, subcategoryName: sub?.name, series: series?.name, seriesId: index === 4 ? undefined : series?.id, seriesName: index === 4 ? undefined : series?.name, sku: `DEMO-${String(index + 1).padStart(3, '0')}`, price, originalPrice, discountPercent: originalPrice ? Math.round((1 - price / originalPrice) * 100) : undefined, rating: 4 + (index % 9) / 10, reviewCount: 3 + index * 2, stock: index === 5 ? 0 : index === 6 ? 2 : 8 + index, stockStatus: index === 5 ? 'out_of_stock' : index === 6 ? 'low_stock' : 'in_stock', shortDescription: `Demo ${cat.name.toLowerCase()} with plausible specifications for storefront and admin testing.`, description: `DEMO DATA. ${name} is a fictional catalogue record intended for realistic layout, search, stock and order scenarios.`, images, attributes: index === 7 ? [] : attributes(categoryId, index), isFeatured: index < 6, isBestseller: index % 5 === 0, isNewArrival: index >= 20, isDeal: index === 0 || index === 8, dealEndsAt: index === 0 ? day(14) : undefined, warrantyMonths: 24, createdAt: day(-index - 1) };
  });
  return { categories, brands, products: [...baseProducts.map(product => ({ ...product, isDemo: true, images: product.images.length ? product.images.map((_, index) => placeholderImage(product.name, product.categoryName, index)) : product.images })), ...additions] };
};

