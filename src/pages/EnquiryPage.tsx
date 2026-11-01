import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Cpu, CheckCircle2, MessageSquare, ShieldCheck, Wrench, Layers } from 'lucide-react';
import { useAuth } from '../features/account/useAuth';
import { useProductRequestSubmission } from '../features/account/hooks';
import { KeycapButton } from '../components/common/KeycapButton';

export const EnquiryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { submit, busy, error } = useProductRequestSubmission();
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [enquiryType, setEnquiryType] = useState<'custom_pc_build' | 'bulk_procurement' | 'compatibility_check' | 'component_availability'>(() => searchParams.get('request') === 'product' ? 'component_availability' : 'custom_pc_build');
  const [targetBudget, setTargetBudget] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    setCustomerName(current => current || user.name);
    setEmail(current => current || user.email);
    setPhone(current => current || user.phone);
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submit({
        customerName,
        email,
        phone,
        companyName,
        enquiryType,
        targetBudget,
        message,
      });
      setIsSubmitted(true);
    } catch { /* The submission hook exposes the inline error. */ }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background py-12 transition-colors">
      <div className="shop-container ">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-accent dark:text-accent mb-2">
            <Wrench className="w-4 h-4" />
            <span>Systems Consultation & Quotation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-main dark:text-main">
            Custom Hardware & Build Consultation
          </h1>
          <p className="text-xs sm:text-sm text-muted dark:text-muted mt-2">
            Whether you are designing a high-airflow 4K gaming rig, a dual-GPU studio render station, or procuring laptops for your engineering firm.
          </p>
        </div>

        <div className="bg-surface dark:bg-surface rounded-2xl border border-border dark:border-border p-6 sm:p-10 shadow-soft-card">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/10 dark:bg-success/10 text-success-ink border border-success dark:border-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-main dark:text-main">
                Demo enquiry saved locally
              </h3>
              <p className="text-sm text-muted max-w-md mx-auto">
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
              <p className="rounded-lg border border-warning bg-warning/10 p-3 text-xs text-warning-ink dark:border-warning dark:bg-warning/10 dark:text-warning-ink">Demo only: submitted details stay in this browser's local storage and are not sent to a retailer. Do not enter sensitive information.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="request-name" className="block font-semibold text-main dark:text-main mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    id="request-name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Rachel Chen"
                    className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main"
                  />
                </div>

                <div>
                  <label htmlFor="request-email" className="block font-semibold text-main dark:text-main mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    id="request-email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rachel@company.com"
                    className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main"
                  />
                </div>

                <div>
                  <label htmlFor="request-phone" className="block font-semibold text-main dark:text-main mb-1">
                    Direct Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    id="request-phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="request-company" className="block font-semibold text-main dark:text-main mb-1">
                    Company / Organization (Optional)
                  </label>
                  <input
                    type="text"
                    id="request-company"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Creative Media Works"
                    className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main"
                  />
                </div>

                <div>
                  <label htmlFor="request-type" className="block font-semibold text-main dark:text-main mb-1">
                    Enquiry Focus *
                  </label>
                  <select
                    id="request-type"
                    value={enquiryType}
                    onChange={e => setEnquiryType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main font-medium"
                  >
                    <option value="custom_pc_build">Complete Custom PC Build Consultation</option>
                    <option value="bulk_procurement">Bulk Hardware & Laptop Procurement</option>
                    <option value="compatibility_check">Technical Compatibility & Cooler Clearance</option>
                    <option value="component_availability">Request a Product / Specific SKU Availability</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="request-budget" className="block font-semibold text-main dark:text-main mb-1">
                    Target Hardware Budget
                  </label>
                  <input
                    type="text"
                    id="request-budget"
                    value={targetBudget}
                    onChange={e => setTargetBudget(e.target.value)}
                    placeholder="e.g. ₹1,50,000 or Open"
                    className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main font-sans"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="request-message" className="block font-semibold text-main dark:text-main mb-1">
                  Describe Your Hardware Objectives & Specific Needs *
                </label>
                <textarea
                  required
                  rows={4}
                  id="request-message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Specify primary workloads (e.g. Unreal Engine, 3D modeling, 240Hz competitive shooter, AI model fine-tuning), preferred brands (ASUS ROG, MSI, Corsair), noise tolerance, or thermal requirements."
                  className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main leading-relaxed"
                />
              </div>

              {error && <p role="alert" className="text-sm text-danger-ink dark:text-danger-ink">{error}</p>}
              <div className="pt-2 flex justify-end">
                <KeycapButton type="submit" variant="primary" size="lg" disabled={busy} className="font-bold">
                  {busy ? 'Saving request…' : 'Submit Hardware Consultation Request'}
                </KeycapButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
