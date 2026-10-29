import { useCallback, useEffect, useRef, useState } from 'react';
import type { BrandDirectoryEntry } from './useBrandDirectory';

export interface PreparedBrand {
  brand: BrandDirectoryEntry;
  imageSrc?: string;
  imageKind: 'hero' | 'product' | 'none';
}

const decodedImages = new Map<string, Promise<HTMLImageElement | null>>();
const decodeImage = (src: string) => {
  let pending = decodedImages.get(src);
  if (!pending) {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
    pending = image.decode().then(() => image, () => null);
    decodedImages.set(src, pending);
  }
  return pending;
};

const prepareBrand = async (brand: BrandDirectoryEntry): Promise<PreparedBrand> => {
  if (brand.heroSrc && await decodeImage(brand.heroSrc)) return { brand, imageSrc: brand.heroSrc, imageKind: 'hero' };
  if (brand.productImage && await decodeImage(brand.productImage)) return { brand, imageSrc: brand.productImage, imageKind: 'product' };
  return { brand, imageKind: 'none' };
};

export const useBrandTransition = (brands: BrandDirectoryEntry[], reducedMotion: boolean) => {
  const [target, setTarget] = useState(0);
  const targetRef = useRef(0);
  const [view, setView] = useState(() => ({ current: brands[0] ? { brand: brands[0], imageKind: 'none' } as PreparedBrand : null, previous: null as PreparedBrand | null, serial: 0 }));
  const select = useCallback((next: number) => {
    if (!brands.length) return;
    const index = (next % brands.length + brands.length) % brands.length;
    targetRef.current = index;
    setTarget(index);
  }, [brands.length]);
  const step = useCallback((direction: number) => select(targetRef.current + direction), [select]);

  useEffect(() => {
    if (reducedMotion) setView(current => current.previous ? { ...current, previous: null } : current);
  }, [reducedMotion]);

  useEffect(() => {
    const brand = brands[target];
    if (!brand) return;
    let cancelled = false;
    let frame = 0;
    void prepareBrand(brand).then(prepared => {
      if (cancelled || targetRef.current !== target) return;
      frame = requestAnimationFrame(() => {
        if (cancelled || targetRef.current !== target) return;
        setView(current => {
          if (current.current?.brand === prepared.brand && current.current.imageSrc === prepared.imageSrc) return current;
          return { current: prepared, previous: reducedMotion ? null : current.current, serial: current.serial + 1 };
        });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [brands, target, reducedMotion]);

  useEffect(() => {
    if (brands.length < 2) return;
    const warmNeighbors = () => {
      void prepareBrand(brands[(target + brands.length - 1) % brands.length]);
      void prepareBrand(brands[(target + 1) % brands.length]);
    };
    if (typeof window.requestIdleCallback === 'function') {
      const idle = window.requestIdleCallback(warmNeighbors, { timeout: 1500 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = window.setTimeout(warmNeighbors, 250);
    return () => window.clearTimeout(timer);
  }, [brands, target]);

  const finish = useCallback((serial: number) => {
    setView(current => current.serial === serial && current.previous ? { ...current, previous: null } : current);
  }, []);

  return { view, select, step, finish };
};
