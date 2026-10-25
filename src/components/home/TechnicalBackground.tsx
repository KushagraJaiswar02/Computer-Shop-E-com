import React, { useEffect, useRef, useState } from 'react';

const TILE_HEIGHT = 460;

/** One page-level, tiled SVG layer. Its tiles follow the containing page height. */
export const TechnicalBackground: React.FC = () => {
  const layerRef = useRef<HTMLDivElement>(null);
  const [tileCount, setTileCount] = useState(1);

  useEffect(() => {
    const container = layerRef.current?.parentElement;
    if (!container) return;

    const updateTileCount = () => {
      const height = Math.max(container.scrollHeight, container.getBoundingClientRect().height);
      setTileCount(Math.max(1, Math.ceil(height / TILE_HEIGHT)));
    };

    updateTileCount();
    const observer = new ResizeObserver(updateTileCount);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={layerRef} aria-hidden="true" className="technical-background technical-background-page">
      {Array.from({ length: tileCount }, (_, index) => (
        <svg
          key={index}
          className="technical-background__svg technical-background__tile"
          viewBox="0 0 1200 460"
          preserveAspectRatio="none"
          focusable="false"
          style={{
            top: index * TILE_HEIGHT,
            '--grid-delay': `${-index * 7}s`,
            '--pulse-delay': `${-index * 3}s`,
          } as React.CSSProperties}
        >
          <g className="technical-background__grid" fill="none" stroke="currentColor" strokeWidth="0.7">
            <path d="M0 76H1200M0 152H1200M0 228H1200M0 304H1200M0 380H1200M0 460H1200M120 0V460M240 0V460M360 0V460M480 0V460M600 0V460M720 0V460M840 0V460M960 0V460M1080 0V460" />
          </g>
          <g className="technical-background__traces" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1200 86H1030l-32 32H870v48l-24 24H760" />
            <path d="M1200 208h-102l-28 28h-98l-36 36H824" />
            <path d="M1200 352h-162l-30-30H890v-58l-26-26H790" />
            <path d="M976 0v64l-30 30v46l-24 24v70" />
            <path d="M1090 460v-64l-32-32v-40l-28-28" />
            <path className="technical-background__pulse" d="M1200 86H1030l-32 32H870v48l-24 24H760" />
            <path className="technical-background__pulse technical-background__pulse--delayed" d="M1200 352h-162l-30-30H890v-58l-26-26H790" />
          </g>
          <g className="technical-background__nodes" fill="currentColor">
            <circle cx="760" cy="190" r="3" /><circle cx="824" cy="272" r="2.5" />
            <circle cx="976" cy="140" r="2.5" /><circle cx="1038" cy="322" r="3" />
            <circle cx="1090" cy="208" r="2" />
          </g>
        </svg>
      ))}
    </div>
  );
};
