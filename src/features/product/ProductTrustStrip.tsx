import React from 'react';
import { FileText, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { getProductTrustItems, productTrustConfig } from './productTrustConfig';

const icons = { warranty: ShieldCheck, gstInvoice: FileText, contact: Phone, whatsapp: MessageCircle };

export const ProductTrustStrip: React.FC = () => {
  const items = getProductTrustItems(productTrustConfig);
  if (!items.length) return null;

  return (
    <ul aria-label="Store information" className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted dark:text-main">
      {items.map(item => {
        const Icon = icons[item.kind];
        const content = <><Icon aria-hidden="true" className="h-4 w-4 shrink-0" /><span>{item.label}</span></>;
        return (
          <li key={item.kind}>
            {item.href ? (
              <a href={item.href} className="inline-flex min-h-10 items-center gap-1.5 hover:text-accent dark:hover:text-accent">{content}</a>
            ) : (
              <span className="inline-flex items-center gap-1.5">{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
