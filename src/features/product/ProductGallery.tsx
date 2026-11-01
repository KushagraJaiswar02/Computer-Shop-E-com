import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  name,
  discountPercent,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Primary Main Image */}
      <div className="relative h-72 sm:h-96 lg:h-[min(45vh,28rem)] rounded-xl bg-surface dark:bg-surface border border-border dark:border-border flex items-center justify-center p-6 overflow-hidden shadow-xs">
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded text-xs font-sans font-bold bg-discount-badge text-on-primary shadow-xs">
            -{discountPercent}% OFF
          </div>
        ) : null}

        {activeImage ? <img
          src={activeImage}
          alt={name}
          className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105"
        /> : <span className="text-sm text-muted dark:text-muted">Image unavailable</span>}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-pressed={selectedIndex === idx}
              className={`w-16 h-16 rounded-lg bg-surface dark:bg-surface border p-1 flex items-center justify-center overflow-hidden transition-all flex-shrink-0 ${
                selectedIndex === idx
                  ? 'border-primary ring-2 ring-focus/20 shadow-xs'
                  : 'border-border dark:border-border opacity-70 hover:opacity-100 hover:border-border'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img src={img} alt="" className="max-h-full max-w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
