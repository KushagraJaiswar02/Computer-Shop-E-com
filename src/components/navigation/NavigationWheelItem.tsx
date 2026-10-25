import React from 'react';
import { WheelItem } from './NavigationWheel';

export interface NavigationWheelItemProps {
  item: WheelItem;
  isSelected: boolean;
  onSelect: () => void;
}

export const NavigationWheelItem: React.FC<NavigationWheelItemProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
        isSelected
          ? 'bg-[#c85032] text-white font-bold'
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs">{item.label}</span>
    </button>
  );
};
