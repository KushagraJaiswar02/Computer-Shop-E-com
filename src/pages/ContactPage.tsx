import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { KeycapButton } from '../components/common/KeycapButton';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-900/50 py-10 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Hardware Support & Store Counter
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Contact Technical Team
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Get in touch for order tracking, pre-purchase compatibility checks, custom PC quotations, or warranty support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Storefront Information */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                Retail Showroom & Dispatch Counter
              </h3>

              <div className="space-y-3.5 text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Storefront Showroom (Placeholder)</strong>
                    <span>42 Commercial Street, 2nd Floor, Bengaluru, Karnataka 560001</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Phone & WhatsApp Inquiries</strong>
                    <span className="font-mono">+91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Email Address</strong>
                    <span className="font-mono">support@example.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">Store Hours (IST)</strong>
                    <span>Monday – Saturday: 10:30 AM – 8:30 PM</span>
                    <span className="block text-slate-400">Sunday: 11:30 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Message Form */}
          <div className="md:col-span-7">
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inquiry Received</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    A hardware specialist will review your question and respond within 2 to 4 business hours.
                  </p>
                  <KeycapButton variant="secondary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </KeycapButton>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Send a Direct Hardware Inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="ramesh@example.com"
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Subject / Topic
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Custom Gaming PC Quotation / GPU Stock Confirmation"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your query or hardware requirements..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <KeycapButton type="submit" variant="primary" className="w-full sm:w-auto">
                    Submit Message
                  </KeycapButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
