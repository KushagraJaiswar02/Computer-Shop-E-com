import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle2 } from 'lucide-react';
import { KeycapButton } from '../components/common/KeycapButton';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-12 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Hardware Support & Storefront
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Contact Technical Support
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Reach our hardware engineers for order tracking, pre-purchase compatibility checks, or RMA requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Storefront Information */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 shadow-soft-card space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                Retail Store & Dispatch Counter
              </h3>

              <div className="space-y-3 text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Silicon Valley Showroom</strong>
                    <span>1040 Innovation Parkway, Suite 120, Silicon Valley, CA 94025</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Phone Inquiries</strong>
                    <span className="font-mono">+1 (800) 555-NEXUS / +1 (206) 555-0199</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Electronic Mail</strong>
                    <span className="font-mono">support@nexustechhardware.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Operating Hours (PST)</strong>
                    <span>Monday – Friday: 9:00 AM – 7:00 PM</span>
                    <span className="block">Saturday: 10:00 AM – 5:00 PM</span>
                    <span className="block text-slate-400">Sunday: Closed for inventory dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Message Form */}
          <div className="md:col-span-7">
            <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 sm:p-8 shadow-soft-card">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Received</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    A representative from our tech desk will contact you within 2 business hours.
                  </p>
                  <KeycapButton variant="secondary" onClick={() => setSubmitted(false)}>
                    Send Another
                  </KeycapButton>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    Send a Direct Hardware Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Name</label>
                      <input required type="text" placeholder="Your name" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border" />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Email</label>
                      <input required type="email" placeholder="Your email" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Subject</label>
                    <input required type="text" placeholder="e.g. Order #NT-849201 status or RTX 4090 dimensions" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border" />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Message</label>
                    <textarea required rows={4} placeholder="How can our hardware team assist you?" className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border leading-relaxed" />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <KeycapButton type="submit" variant="primary">
                      Dispatch Message
                    </KeycapButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
