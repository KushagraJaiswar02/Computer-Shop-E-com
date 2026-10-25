import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { homepageConfig } = useStore();
  const { announcement } = homepageConfig;

  if (!announcement || !announcement.enabled) return null;

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 truncate">
          {announcement.highlightText && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider bg-brand-600 text-white px-2 py-0.5 rounded">
              <Sparkles className="w-3 h-3" />
              {announcement.highlightText}
            </span>
          )}
          <span className="text-slate-300 truncate font-medium">{announcement.text}</span>
        </div>

        {announcement.linkUrl && announcement.linkText && (
          <Link
            to={announcement.linkUrl}
            className="hidden sm:inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 font-semibold transition-colors flex-shrink-0"
          >
            <span>{announcement.linkText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
