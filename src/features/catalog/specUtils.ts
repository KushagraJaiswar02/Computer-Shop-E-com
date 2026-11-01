import { Product } from '../../types';

interface SpecChipConfig {
  keys: string[];
  format?: (value: string) => string;
  highlightOnly?: boolean;
}

export function shortenSpecValue(raw: string): string {
  return raw.trim()
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/^NVIDIA\s+GeForce\s+/i, '')
    .replace(/^AMD\s+Radeon\s+/i, '')
    .replace(/^Intel\s+Core\s+/i, '')
    .replace(/^AMD\s+/i, '')
    .replace(/^Socket\s+/i, '')
    .replace(/\s+with\s+.*$/i, '')
    .trim();
}

const compactMemory = (value: string) => {
  const capacity = value.match(/\d+\s*(?:GB|TB)/i)?.[0];
  const type = value.match(/(?:GDDR|DDR)\dX?/i)?.[0];
  return capacity ? [capacity, type].filter(Boolean).join(' ') : shortenSpecValue(value);
};

const compactGraphics = (value: string) => shortenSpecValue(value).replace(/\s+\d+\s*GB.*$/i, '');
const compactStorage = (value: string) => {
  const capacity = value.match(/\d+\s*(?:GB|TB)/i)?.[0];
  const type = /NVMe/i.test(value) ? 'NVMe SSD' : /SSD/i.test(value) ? 'SSD' : '';
  return capacity && type ? `${capacity} ${type}` : shortenSpecValue(value);
};
const compactCores = (value: string) => {
  const count = value.match(/^\d+/)?.[0];
  return count ? `${count} cores` : shortenSpecValue(value);
};

// Each entry is one chip; aliases describe the same spec, never extra chips.
export const CATEGORY_SPECS_CONFIG: Record<string, SpecChipConfig[]> = {
  laptops: [
    { keys: ['Processor', 'CPU', 'CPU Model'] },
    { keys: ['Graphics', 'GPU', 'GPU Model'], format: compactGraphics },
    { keys: ['Memory', 'RAM', 'RAM Capacity'], format: compactMemory },
    { keys: ['Storage'], format: compactStorage, highlightOnly: true },
  ],
  'graphics-cards': [
    { keys: ['Video Memory', 'Memory', 'VRAM', 'VRAM Capacity'], format: compactMemory },
    { keys: ['Graphic Engine', 'Chip', 'GPU Model'], format: compactGraphics },
    { keys: ['Boost Clock', 'Engine Clock'], format: value => value.match(/\d+(?:\.\d+)?\s*(?:MHz|GHz)/i)?.[0] || shortenSpecValue(value), highlightOnly: true },
    { keys: ['Bus Standard', 'Interface'], highlightOnly: true },
  ],
  processors: [
    { keys: ['Core Count', 'Cores', 'Cores / Threads'], format: compactCores },
    { keys: ['CPU Socket', 'Socket', 'Socket Type'] },
    { keys: ['Thread Count'], highlightOnly: true },
    { keys: ['Max Turbo Frequency', 'Base / Boost Clock'], highlightOnly: true },
  ],
  'memory-ram': [
    { keys: ['Capacity', 'RAM Capacity'], format: compactMemory },
    { keys: ['Tested Speed', 'Speed', 'Memory Speed'] },
    { keys: ['Tested Latency', 'CAS Latency'], highlightOnly: true },
    { keys: ['Memory Type'], highlightOnly: true },
  ],
  'storage-ssd': [
    { keys: ['Capacity'], format: compactMemory },
    { keys: ['Type', 'Interface'], format: value => /NVMe/i.test(value) ? 'NVMe SSD' : /SATA/i.test(value) ? 'SATA SSD' : shortenSpecValue(value) },
    { keys: ['Seq. Read Speed', 'Seq. Read', 'Sequential Read'], highlightOnly: true },
    { keys: ['Form Factor'], highlightOnly: true },
  ],
  motherboards: [{ keys: ['Socket'] }, { keys: ['Chipset'] }, { keys: ['Form Factor'] }],
  monitors: [{ keys: ['Resolution'] }, { keys: ['Refresh Rate'] }, { keys: ['Panel Type'] }],
  peripherals: [{ keys: ['Form Factor'] }, { keys: ['Switch Type'] }, { keys: ['Wattage'] }],
};

export function extractSpecChips(product: Product, variant: 'card' | 'highlights' = 'card'): string[] {
  if (!product.attributes?.length) return [];
  const config = CATEGORY_SPECS_CONFIG[product.categoryId];
  if (!config) return [];

  const chips = config.flatMap(({ keys, format = shortenSpecValue, highlightOnly }) => {
    if (highlightOnly && variant === 'card') return [];
    const attribute = keys.map(key => product.attributes.find(item =>
      item.name.toLowerCase() === key.toLowerCase() && item.value.trim()
    )).find(Boolean);
    const value = attribute ? format(attribute.value) : '';
    return value ? [value] : [];
  });
  return [...new Set(chips)].slice(0, variant === 'highlights' ? 4 : 3);
}
