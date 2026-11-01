import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { brandConfig } from '../../config/brand';
export const BrandDocumentTitle: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const update = () => {
      const heading = pathname === '/' ? '' : document.querySelector('main h1, h1')?.textContent?.trim() || '';
      const title = `${heading ? `${heading} | ` : ''}${brandConfig.shopName} · ${brandConfig.tagline}`;
      if (document.title !== title) document.title = title;
    };
    update();
    const observer = new MutationObserver(update); observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
};
