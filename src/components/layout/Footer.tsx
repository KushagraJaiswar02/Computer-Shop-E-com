import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Wrench, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs transition-colors">
      {/* Service Highlights Bar */}
      <div className="border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8 bg-slate-950/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-900/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Genuine Products</h4>
              <p className="text-slate-400 text-[11px]">Brand warranty support</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-900/60">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Pan-India Delivery</h4>
              <p className="text-slate-400 text-[11px]">Secure protective transit</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-900/60">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Technical Advice</h4>
              <p className="text-slate-400 text-[11px]">PC compatibility guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-900/60">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-xs">Support & Help</h4>
              <p className="text-slate-400 text-[11px]">Responsive customer care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Store Info & Neutral Contact Placeholder */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                CS
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Computer<span className="text-blue-400">Shop</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Retail storefront prototype for computer hardware, custom gaming PCs, components, and peripherals.
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Showroom & Retail Counter (Location placeholder)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="font-mono">+91 98765 43210 (Mon–Sat 10:00 AM – 8:00 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>sales@computershop.example.com</span>
              </div>
            </div>
          </div>

          {/* Hardware Catalog */}
          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Hardware
            </h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/category/laptops" className="hover:text-white transition-colors">Gaming Laptops</Link></li>
              <li><Link to="/category/graphics-cards" className="hover:text-white transition-colors">Graphics Cards</Link></li>
              <li><Link to="/category/processors" className="hover:text-white transition-colors">Processors (CPUs)</Link></li>
              <li><Link to="/category/memory-ram" className="hover:text-white transition-colors">DDR5 & DDR4 RAM</Link></li>
              <li><Link to="/category/storage-ssd" className="hover:text-white transition-colors">NVMe SSDs</Link></li>
              <li><Link to="/category/monitors" className="hover:text-white transition-colors">Gaming Monitors</Link></li>
              <li><Link to="/shop?deal=true" className="text-amber-400 hover:text-amber-300 transition-colors">Promotional Deals</Link></li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Customer Support
            </h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/enquiry" className="hover:text-white transition-colors">Custom PC Consultation</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Product Comparison</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/admin" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Store Admin (Demo)</Link></li>
            </ul>
          </div>

          {/* Policies & Information */}
          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Store Information
            </h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/policies#warranty" className="hover:text-white transition-colors">Warranty Information</Link></li>
              <li><Link to="/policies#shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/policies#returns" className="hover:text-white transition-colors">Returns Policy</Link></li>
              <li><Link to="/policies#terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/policies#privacy" className="hover:text-white transition-colors">Privacy Notice</Link></li>
            </ul>
          </div>
        </div>

        {/* Prototype Transparency Note */}
        <div className="mt-8 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Storefront Demonstration:</strong> Sample inventory and pricing for client feedback. No live transactions are processed.
          </span>
          <span className="font-mono text-slate-500">
            Press <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300">?</kbd> for shortcuts
          </span>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Computer Hardware Retailer. Demonstration Prototype.</p>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">UPI</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Cards</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">NetBanking</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Store Pickup</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
