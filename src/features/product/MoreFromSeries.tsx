import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../../components/product/ProductCard';
import { MotionList, productKey } from '../../components/motion/MotionList';

export function getMoreFromSeries(products: Product[], current: Product): Product[] {
  const series = current.series?.trim();
  if (!series) return [];
  return products.filter(product => product.id !== current.id && product.brandId === current.brandId && product.series?.trim() === series).slice(0, 4);
}

export const MoreFromSeries: React.FC<{ products: Product[]; current: Product }> = ({ products, current }) => {
  const related = getMoreFromSeries(products, current);
  if (!related.length) return null;

  return (
    <section aria-label={`More from ${current.series?.trim()}`} className="mb-10">
      <h2 className="mb-3.5 text-base sm:text-lg font-bold text-main dark:text-main">More from {current.series?.trim()}</h2>
      <MotionList items={related} itemKey={productKey} entranceId="related-series" className="grid grid-flow-col auto-cols-[calc((100%-0.5rem)/2)] md:auto-cols-[calc((100%-2rem)/3)] lg:auto-cols-[calc((100%-3rem)/4)] gap-2 md:gap-4 overflow-x-auto py-1">
        {product => <ProductCard product={product} />}
      </MotionList>
    </section>
  );
};
