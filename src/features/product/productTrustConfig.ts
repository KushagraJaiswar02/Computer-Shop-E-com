export interface ProductTrustConfig {
  warranty?: string;
  gstInvoice?: string;
  contactPhone?: string;
  whatsappNumber?: string;
}

// Populate only with retailer-confirmed terms and contact details.
// Demo product warrantyMonths values are not verified retailer warranty claims.
export const productTrustConfig: ProductTrustConfig = {};

export interface ProductTrustItem {
  kind: 'warranty' | 'gstInvoice' | 'contact' | 'whatsapp';
  label: string;
  href?: string;
}

export function getProductTrustItems(config: ProductTrustConfig): ProductTrustItem[] {
  const items: ProductTrustItem[] = [];
  if (config.warranty?.trim()) items.push({ kind: 'warranty', label: config.warranty.trim() });
  if (config.gstInvoice?.trim()) items.push({ kind: 'gstInvoice', label: config.gstInvoice.trim() });

  const phone = config.contactPhone?.replace(/[\s()-]/g, '');
  if (phone && /^\+?[1-9]\d{6,14}$/.test(phone)) {
    items.push({ kind: 'contact', label: config.contactPhone!.trim(), href: `tel:${phone}` });
  }
  const whatsapp = config.whatsappNumber?.replace(/[\s()+-]/g, '');
  if (whatsapp && /^[1-9]\d{7,14}$/.test(whatsapp)) {
    items.push({ kind: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${whatsapp}` });
  }
  return items;
}
