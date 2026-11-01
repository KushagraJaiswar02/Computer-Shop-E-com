import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { KeycapButton } from '../../components/common/KeycapButton';

interface ProductEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ProductEnquiryModal: React.FC<ProductEnquiryModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-surface dark:bg-surface rounded-xl border border-border dark:border-border shadow-xl p-5 sm:p-6 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-success-ink mx-auto" />
            <h3 className="text-lg font-bold text-main dark:text-main">
              Demo request previewed · not sent
            </h3>
            <p className="text-xs text-muted dark:text-muted max-w-sm mx-auto">
              This sample request about <strong>{product.name}</strong> was not transmitted or saved. No retailer support channel is connected.
            </p>
            <div className="pt-3">
              <KeycapButton variant="primary" onClick={handleClose}>
                Done
              </KeycapButton>
            </div>
          </div>
        ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-main dark:text-main">
                  Product question · demo only
                </h3>
                <p className="text-xs text-muted dark:text-muted mt-0.5">
                  Preview a question about {product.name} (SKU: {product.sku}). No support channel is connected.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-muted hover:text-muted p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="rounded-lg border border-warning bg-warning/10 p-3 text-xs text-warning-ink dark:border-warning dark:bg-warning/10 dark:text-warning-ink">Demo only: this form does not send or save your message.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-main dark:text-main mb-1">
                  Your Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kushal Sharma"
                  className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main focus:outline-none focus:ring-1 focus:ring-focus"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-main dark:text-main mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kushal@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main focus:outline-none focus:ring-1 focus:ring-focus"
                  />
                </div>
                <div>
                  <label className="block font-medium text-main dark:text-main mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main focus:outline-none focus:ring-1 focus:ring-focus"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-main dark:text-main mb-1">
                  Your Target Build / Specific Question *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Will this GPU fit in a Lian Li O11 Dynamic case with front radiator mounted? Is a 750W Gold PSU adequate?"
                  className="w-full px-3 py-2 rounded-lg bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main focus:outline-none focus:ring-1 focus:ring-focus"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border dark:border-border">
              <KeycapButton type="button" variant="outline" onClick={handleClose}>
                Cancel
              </KeycapButton>
              <KeycapButton type="submit" variant="primary">
                Send Enquiry
              </KeycapButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
