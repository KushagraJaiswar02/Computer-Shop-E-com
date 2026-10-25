import React from 'react';
import { MessageSquare, Mail, Phone, Clock, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';

export const AdminEnquiriesPage: React.FC = () => {
  const { enquiries } = useStore();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Custom PC & Hardware Enquiries ({enquiries.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Technical consultations submitted by creators, studios, and enterprise builders from the storefront.
        </p>
      </div>

      <div className="space-y-4">
        {enquiries.map(enq => (
          <div
            key={enq.id}
            className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-sm">{enq.customerName}</span>
                {enq.companyName && (
                  <span className="text-slate-400 font-mono text-[11px]">
                    ({enq.companyName})
                  </span>
                )}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-950 text-brand-400 border border-brand-800 font-semibold">
                  {enq.enquiryType.replace(/_/g, ' ')}
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {formatDate(enq.createdAt)}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
              "{enq.message}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-slate-400">
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-400" />
                  <span>{enq.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-400" />
                  <span>{enq.phone}</span>
                </div>
                {enq.targetBudget && (
                  <span className="text-amber-400 font-semibold">Budget: {enq.targetBudget}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 font-bold">
                  Status: {enq.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
