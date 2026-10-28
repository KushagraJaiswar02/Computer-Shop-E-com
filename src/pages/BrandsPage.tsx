import React from 'react';
import { BrandAccordion } from '../features/brands/BrandAccordion';
import { BrandDesktopShowcase } from '../features/brands/BrandDesktopShowcase';
import { useBrandDirectory } from '../features/brands/useBrandDirectory';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './BrandsPage.css';

export const BrandsPage: React.FC = () => {
  const brands = useBrandDirectory();
  const desktop = useMediaQuery('(min-width: 1024px)');

  return desktop ? <BrandDesktopShowcase brands={brands} /> : <BrandAccordion brands={brands} />;
};
