import React from 'react';
import { useStore } from '../context/StoreContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { DealsSection } from '../components/home/DealsSection';
import { BestsellersSection } from '../components/home/BestsellersSection';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { BrandsSection } from '../components/home/BrandsSection';
import { TrustSection } from '../components/home/TrustSection';

export const HomePage: React.FC = () => {
  const { homepageConfig } = useStore();

  // Sort sections by their configured order
  const orderedSections = [...(homepageConfig.sections || [])]
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order);

  // Keep category discovery before brands, including previously saved section orders.
  const categoryIndex = orderedSections.findIndex(section => section.id === 'categories');
  const brandIndex = orderedSections.findIndex(section => section.id === 'brands');
  if (categoryIndex > brandIndex && brandIndex >= 0) {
    const [category] = orderedSections.splice(categoryIndex, 1);
    orderedSections.splice(brandIndex, 0, category);
  }

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return <HeroBanner key="hero" />;
      case 'categories':
        return <CategorySection key="categories" />;
      case 'featured_products':
        return <FeaturedSection key="featured_products" />;
      case 'deals':
        return <DealsSection key="deals" />;
      case 'bestsellers':
        return <BestsellersSection key="bestsellers" />;
      case 'new_arrivals':
        return <NewArrivalsSection key="new_arrivals" />;
      case 'brands':
        return <BrandsSection key="brands" />;
      case 'reviews':
        // The current dataset contains sample reviews. Show them only after genuine reviews are connected.
        return null;
      case 'trust_support':
        return <TrustSection key="trust_support" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {orderedSections.map(section => renderSection(section.id))}
    </div>
  );
};
