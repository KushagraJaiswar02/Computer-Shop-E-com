import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KeycapButton } from '../components/common/KeycapButton';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-surface-soft/70 py-10 dark:bg-surface/50 sm:py-12">
      <main className="shop-container content-prose space-y-6 ">
        <header>
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-accent dark:text-accent">Store contact</span>
          <h1 className="mt-1 text-2xl font-bold text-main dark:text-main sm:text-3xl">Contact the retailer</h1>
        </header>

        <div className="flex items-start gap-3 rounded-xl border border-primary bg-accent/10 p-4 text-sm text-main dark:border-border dark:bg-surface dark:text-main">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent dark:text-accent" />
          <p>Retailer contact details have not been configured. This demonstration form does not send or save messages.</p>
        </div>

        <section className="rounded-xl border border-border bg-surface p-5 dark:border-border dark:bg-surface">
          {submitted ? (
            <div role="status" className="space-y-3">
              <h2 className="font-bold text-main dark:text-main">Demo only: message not sent</h2>
              <p className="text-sm text-muted dark:text-main">No retailer contact channel is connected. Your message was not transmitted or stored.</p>
              <KeycapButton variant="secondary" onClick={() => setSubmitted(false)}>Edit message</KeycapButton>
            </div>
          ) : (
            <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <h2 className="text-sm font-bold text-main dark:text-main">Message preview</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="contact-name" className="mb-1 block text-xs font-semibold text-main dark:text-main">Name</label><input id="contact-name" autoComplete="name" className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-sm text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:border-border dark:bg-surface-elevated dark:text-main" /></div>
                <div><label htmlFor="contact-email" className="mb-1 block text-xs font-semibold text-main dark:text-main">Email</label><input id="contact-email" type="email" autoComplete="email" className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-sm text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:border-border dark:bg-surface-elevated dark:text-main" /></div>
              </div>
              <div><label htmlFor="contact-message" className="mb-1 block text-xs font-semibold text-main dark:text-main">Message</label><textarea id="contact-message" rows={5} className="w-full rounded-lg border border-border bg-surface-soft px-3 py-2 text-sm text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:border-border dark:bg-surface-elevated dark:text-main" /></div>
              <KeycapButton type="submit" variant="primary">Preview submission</KeycapButton>
              <Link to="/policies" className="ml-4 text-xs font-semibold text-accent underline dark:text-accent">Store information</Link>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};
