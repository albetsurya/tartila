import React from 'react';
import { motion } from 'framer-motion';
import type { LabIramaTab } from '../../hooks/useLabIramaStore';

interface LabIramaTabNavProps {
  activeTab: LabIramaTab;
  onTabChange: (tab: LabIramaTab) => void;
}

interface TabItem {
  id: LabIramaTab;
  label: string;
  shortLabel: string;
  icon: string;
  badge?: string;
}

const TABS: TabItem[] = [
  {
    id: 'guide',
    label: 'Panduan Metronom',
    shortLabel: 'Panduan',
    icon: '🎵',
    badge: 'Visual',
  },
  {
    id: 'ear-training',
    label: 'Tebak Nada Rost',
    shortLabel: 'Tebak Nada',
    icon: '👂',
    badge: 'Latihan',
  },
  {
    id: 'tap-beat',
    label: 'Ketuk Irama',
    shortLabel: 'Ketuk Irama',
    icon: '⚡',
    badge: 'Game',
  },
];

export const LabIramaTabNav: React.FC<LabIramaTabNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[var(--border-color,#134E4A)] rounded-2xl p-1.5 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)]">
      <div className="grid grid-cols-3 gap-1.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl font-display font-black text-xs md:text-sm transition-all border-2 ${
                isActive
                  ? 'bg-[#F59E0B] text-[#111827] border-[var(--border-color,#F59E0B)] shadow-[2px_2px_0px_var(--shadow-color,#F59E0B)]'
                  : 'bg-transparent text-[var(--text-main,#F8FAFC)] border-transparent hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm md:text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </div>
              {tab.badge && (
                <span
                  className={`mt-0.5 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full leading-tight ${
                    isActive
                      ? 'bg-[#FEF08A] text-[#134E4A]'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
