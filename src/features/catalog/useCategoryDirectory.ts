import { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { buildCategoryDirectory, CATEGORY_CONFIG } from '../../data/categories';

export const useCategoryDirectory = () => {
  const { products, categories } = useStore();
  return useMemo(() => buildCategoryDirectory(CATEGORY_CONFIG, products, categories), [products, categories]);
};
