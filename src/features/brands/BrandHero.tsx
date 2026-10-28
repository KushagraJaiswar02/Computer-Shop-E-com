import React, { useState } from 'react';
import type { BrandDirectoryEntry } from './useBrandDirectory';

export const BrandHero: React.FC<{ brand: BrandDirectoryEntry }> = ({ brand }) => {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const source = [brand.heroSrc, brand.productImage].find((src): src is string => typeof src === 'string' && src.length > 0 && !failedSources.includes(src));
  const catalogImage = source === brand.productImage && source !== brand.heroSrc;

  return (
    <div aria-hidden="true" className="brand-directory-hero relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:order-last lg:aspect-[4/5]">
      {source ? (
        <>
          <div className="brand-directory-hero-shadow absolute bottom-[9%] left-[18%] h-[9%] w-[78%] rounded-[50%]" />
          <img
            key={source}
            src={source}
            alt=""
            loading="lazy"
            decoding="async"
            className={`brand-directory-hero-image absolute -right-[14%] bottom-[8%] h-[82%] w-[112%] max-w-none object-contain ${catalogImage ? 'brand-directory-hero-catalog' : ''}`}
            onError={() => setFailedSources(current => [...current, source])}
          />
        </>
      ) : (
        <div className="brand-directory-hero-fallback brand-directory-hero-image absolute inset-0 flex items-center justify-center p-10">
          <div className="brand-directory-hero-pattern absolute inset-0" />
          <span className="brand-directory-hero-logo relative flex h-28 w-full items-center justify-center text-center text-3xl font-bold text-white">
            {brand.logo ? <span className="block h-full w-full" dangerouslySetInnerHTML={{ __html: brand.logo }} /> : brand.name}
          </span>
        </div>
      )}
    </div>
  );
};
