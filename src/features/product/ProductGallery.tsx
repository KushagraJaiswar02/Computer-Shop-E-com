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
      <div className="relative aspect-4/3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-6 overflow-hidden shadow-xs">
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-600 text-white shadow-xs">
            -{discountPercent}% OFF
          </div>
        ) : null}

        <img
          src={activeImage}
          alt={name}
          className="max-h-full max-w-full object-contain transition-transform duration-200 hover:scale-105"
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-16 rounded-lg bg-white dark:bg-slate-850 border p-1 flex items-center justify-center overflow-hidden transition-all flex-shrink-0 ${
                selectedIndex === idx
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-300'
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
