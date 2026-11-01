import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { homepageConfig } = useStore();
  const { announcement } = homepageConfig;

  if (!announcement || !announcement.enabled) return null;

  return (
    <div className="bg-surface-soft text-muted text-xs py-2 border-b border-border relative z-30">
      <div className="shop-container flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 truncate">
          {announcement.highlightText && (
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary px-1.5 py-0.2 rounded">
              {announcement.highlightText}
            </span>
          )}
          <span className="text-muted truncate text-[11px] sm:text-xs">{announcement.text}</span>
        </div>

        {announcement.linkUrl && announcement.linkText && (
          <Link
            to={announcement.linkUrl}
            className="hidden sm:inline-flex items-center gap-1 text-accent hover:text-accent font-semibold transition-colors flex-shrink-0 text-xs"
          >
            <span>{announcement.linkText}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};
