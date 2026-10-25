import React from 'react';
import { ShieldCheck, Truck, Cpu, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KeycapButton } from '../common/KeycapButton';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: 'Brand Warranty Support',
      description: 'Products include standard manufacturer warranty coverage and official invoice support.',
    },
    {
      icon: <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: 'Safe Transit & Packaging',
      description: 'All components and fragile items are packed with protective cushioning for secure delivery.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: 'Component Compatibility',
      description: 'Consult our technicians regarding CPU sockets, RAM clearance, power requirements, or case dimensions.',
    },
    {
      icon: <Headphones className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: 'Direct Store Assistance',
      description: 'Reach our team directly for custom PC configuration, bulk requests, or post-purchase support.',
    },
  ];

  return (
    <section className="py-10 sm:py-12 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Why Shop With Us
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Store policies and customer services overview
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-800 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Need advice on custom gaming PCs, editing workstations, or office hardware?</span>
            <Link to="/enquiry">
              <KeycapButton variant="secondary" size="sm">
                Request PC Consultation
              </KeycapButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
