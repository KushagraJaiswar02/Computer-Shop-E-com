import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Wrench, CreditCard, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs transition-colors">
      {/* Trust Badges Strip */}
      <div className="border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8 bg-slate-950/40">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-brand-950 border border-brand-800/60 text-brand-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Official Warranties</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Direct manufacturer warranty backing</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-brand-950 border border-brand-800/60 text-brand-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Insured Shipping</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Heavy foam & anti-static packing</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-brand-950 border border-brand-800/60 text-brand-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Hardware Technicians</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">Pre-delivery BIOS & stress testing</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-brand-950 border border-brand-800/60 text-brand-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Hassle-Free Returns</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">30-day DOA replacement guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Store Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-mono font-bold text-base shadow-keycap">
                <span>NX</span>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white uppercase font-mono">
                Nexus<span className="text-brand-400">Tech</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              NexusTech is a specialized computer hardware retailer supplying custom PC components, 
              high-refresh gaming laptops, unlocked silicon, and workstation hardware to builders, creators, and esports professionals.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>1040 Innovation Parkway, Suite 120, Silicon Valley, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>+1 (800) 555-NEXUS (Mon - Sat 9am-7pm PST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>orders@nexustechhardware.com</span>
              </div>
            </div>
          </div>

          {/* Hardware Catalog */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 font-mono text-xs">
              Hardware
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/category/laptops" className="hover:text-white transition-colors">Gaming Laptops</Link></li>
              <li><Link to="/category/graphics-cards" className="hover:text-white transition-colors">GeForce RTX 40 & Radeon</Link></li>
              <li><Link to="/category/processors" className="hover:text-white transition-colors">AMD Ryzen & Intel Core</Link></li>
              <li><Link to="/category/memory-ram" className="hover:text-white transition-colors">DDR5 & DDR4 Memory</Link></li>
              <li><Link to="/category/storage-ssd" className="hover:text-white transition-colors">PCIe Gen4 / Gen5 NVMe</Link></li>
              <li><Link to="/category/monitors" className="hover:text-white transition-colors">OLED & 240Hz Monitors</Link></li>
              <li><Link to="/shop?deal=true" className="text-amber-400 hover:text-amber-300 transition-colors">Promotional Deals</Link></li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 font-mono text-xs">
              Services & Help
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/enquiry" className="hover:text-white transition-colors">Custom PC Consultation</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Hardware Comparison</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Technical Support</Link></li>
              <li><Link to="/admin" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">Store Admin Portal (Demo)</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider mb-3 font-mono text-xs">
              Store Policies
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/policies#warranty" className="hover:text-white transition-colors">Warranty & RMA Policy</Link></li>
              <li><Link to="/policies#shipping" className="hover:text-white transition-colors">Shipping & Freight Transit</Link></li>
              <li><Link to="/policies#returns" className="hover:text-white transition-colors">Return Policy & Restocking</Link></li>
              <li><Link to="/policies#privacy" className="hover:text-white transition-colors">Privacy Notice</Link></li>
              <li><Link to="/policies#terms" className="hover:text-white transition-colors">Terms of Retail Sale</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About NexusTech</Link></li>
            </ul>
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="mt-10 p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              <strong>Frontend Prototype Preview:</strong> Built for client evaluation & owner feedback. All transactions and checkout steps are in simulated demo mode.
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-200">?</kbd> for shortcuts</span>
          </div>
        </div>

        {/* Bottom Credits & Payments */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NexusTech Computers Inc. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px]">Simulated payment types:</span>
            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">VISA</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Mastercard</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Amex</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Wire / NEFT</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
