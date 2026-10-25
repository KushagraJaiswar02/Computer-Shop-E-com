import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KeycapButton } from '../components/common/KeycapButton';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 dark:bg-slate-900/50 sm:py-12">
      <main className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
        <header>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Store contact</span>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Contact the retailer</h1>
        </header>

        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <p>Retailer contact details have not been configured. This demonstration form does not send or save messages.</p>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-850">
          {submitted ? (
            <div role="status" className="space-y-3">
              <h2 className="font-bold text-slate-900 dark:text-white">Demo only: message not sent</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">No retailer contact channel is connected. Your message was not transmitted or stored.</p>
              <KeycapButton variant="secondary" onClick={() => setSubmitted(false)}>Edit message</KeycapButton>
            </div>
          ) : (
            <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Message preview</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="contact-name" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Name</label><input id="contact-name" autoComplete="name" className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div>
                <div><label htmlFor="contact-email" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Email</label><input id="contact-email" type="email" autoComplete="email" className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div>
              </div>
              <div><label htmlFor="contact-message" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Message</label><textarea id="contact-message" rows={5} className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div>
              <KeycapButton type="submit" variant="primary">Preview submission</KeycapButton>
              <Link to="/policies" className="ml-4 text-xs font-semibold text-blue-700 underline dark:text-blue-300">Store information</Link>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};
