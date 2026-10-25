import React, { useState } from 'react';
import { Cpu, CheckCircle2, MessageSquare, ShieldCheck, Wrench, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { KeycapButton } from '../components/common/KeycapButton';

export const EnquiryPage: React.FC = () => {
  const { submitEnquiry } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [enquiryType, setEnquiryType] = useState<'custom_pc_build' | 'bulk_procurement' | 'compatibility_check' | 'component_availability'>('custom_pc_build');
  const [targetBudget, setTargetBudget] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEnquiry({
      customerName,
      email,
      phone,
      companyName,
      enquiryType,
      targetBudget,
      message,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
            <Wrench className="w-4 h-4" />
            <span>Systems Consultation & Quotation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Custom Hardware & Build Consultation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Whether you are designing a high-airflow 4K gaming rig, a dual-GPU studio render station, or procuring laptops for your engineering firm.
          </p>
        </div>

        <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 sm:p-10 shadow-soft-card">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Demo enquiry saved locally
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                This example enquiry is stored only in this browser. It has not been sent to a retailer or support team.
              </p>
              <div className="pt-4">
                <KeycapButton variant="primary" onClick={() => setIsSubmitted(false)}>
                  Submit Another Request
                </KeycapButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">Demo only: submitted details stay in this browser's local storage and are not sent to a retailer. Do not enter sensitive information.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Rachel Chen"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rachel@company.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Direct Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Creative Media Works"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enquiry Focus *
                  </label>
                  <select
                    value={enquiryType}
                    onChange={e => setEnquiryType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="custom_pc_build">Complete Custom PC Build Consultation</option>
                    <option value="bulk_procurement">Bulk Hardware & Laptop Procurement</option>
                    <option value="compatibility_check">Technical Compatibility & Cooler Clearance</option>
                    <option value="component_availability">Specific Silicon / SKU Reservation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Hardware Budget
                  </label>
                  <input
                    type="text"
                    value={targetBudget}
                    onChange={e => setTargetBudget(e.target.value)}
                    placeholder="e.g. ₹1,50,000 or Open"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Describe Your Hardware Objectives & Specific Needs *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Specify primary workloads (e.g. Unreal Engine, 3D modeling, 240Hz competitive shooter, AI model fine-tuning), preferred brands (ASUS ROG, MSI, Corsair), noise tolerance, or thermal requirements."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <KeycapButton type="submit" variant="primary" size="lg" className="font-bold">
                  Submit Hardware Consultation Request
                </KeycapButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
