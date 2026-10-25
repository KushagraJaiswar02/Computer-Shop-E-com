import React from 'react';
import { ShieldCheck, Truck, Cpu, Headphones, RefreshCw, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KeycapButton } from '../common/KeycapButton';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
      title: 'Genuine Manufacturer Warranty',
      description: 'Every processor, graphics card, and motherboard comes with serial-matched official distributor warranty. Full RMA support without third-party hassle.',
    },
    {
      icon: <Truck className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
      title: 'Anti-Static & Shock Insured Delivery',
      description: 'Custom molded high-density foam packaging and anti-static ESD bags protect sensitive silicon and glass side panels during domestic transit.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
      title: 'Component Compatibility Testing',
      description: 'Need confirmation that your cooler clears your high-profile RAM or your PSU has enough 12VHPWR cables? Our in-house hardware technicians verify every order.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
      title: 'Enthusiast Customer Support',
      description: 'Speak directly with engineers who build PCs. Assistance with BIOS updates, memory EXPO profiles, undervolting advice, and custom liquid loops.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-surface-900 border-b border-slate-200 dark:border-surface-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 sm:p-10">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Commitment to Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Built for PC Enthusiasts, By PC Enthusiasts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              We know how critical system stability is. Whether you are compiling large codebases, editing 8K video, 
              or competing in tournaments, we supply only Tier-1 verified computing hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 shadow-keycap flex-shrink-0">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-surface-750 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Have a custom workstation requirement or enterprise procurement request?
            </div>
            <Link to="/enquiry">
              <KeycapButton variant="secondary" size="md">
                Request Hardware Consultation
              </KeycapButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
