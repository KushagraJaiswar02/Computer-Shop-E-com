import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { homepageConfig } = useStore();
  const { announcement } = homepageConfig;

  if (!announcement || !announcement.enabled) return null;

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 truncate">
          {announcement.highlightText && (
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-1.5 py-0.2 rounded">
              {announcement.highlightText}
            </span>
          )}
          <span className="text-slate-300 truncate text-[11px] sm:text-xs">{announcement.text}</span>
        </div>

        {announcement.linkUrl && announcement.linkText && (
          <Link
            to={announcement.linkUrl}
            className="hidden sm:inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold transition-colors flex-shrink-0 text-xs"
          >
            <span>{announcement.linkText}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};
