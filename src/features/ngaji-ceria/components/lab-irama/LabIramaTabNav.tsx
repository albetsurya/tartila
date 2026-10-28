import React from "react";
import { motion } from "framer-motion";
import type { LabIramaTab } from "../../hooks/useLabIramaStore";
import {
  MusicSvg,
  ZapSvg,
  EarSvg,
} from "../../../../components/ui/CustomIcons";

interface LabIramaTabNavProps {
  activeTab: LabIramaTab;
  onTabChange: (tab: LabIramaTab) => void;
}

interface TabItem {
  id: LabIramaTab;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  badge?: string;
}

const TABS: TabItem[] = [
  {
    id: "guide",
    label: "Panduan Metronom",
    shortLabel: "Panduan",
    icon: <MusicSvg size={16} />,
    badge: "Visual",
  },
  {
    id: "ear-training",
    label: "Tebak Nada Rost",
    shortLabel: "Tebak Nada",
    icon: <EarSvg size={16} />,
    badge: "Latihan",
  },
  {
    id: "tap-beat",
    label: "Ketuk Irama",
    shortLabel: "Ketuk Irama",
    icon: <ZapSvg size={16} />,
    badge: "Game",
  },
];

export const LabIramaTabNav: React.FC<LabIramaTabNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full bg-white border-[3px] border-[#134E4A] rounded-2xl p-1.5 shadow-[4px_4px_0px_#134E4A]">
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
                  ? "bg-[#0D9488] text-white border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                  : "bg-[#F0FDF4] text-[#134E4A] border-transparent hover:bg-[#E0F2FE]"
              }`}
            >
              <div className="flex items-center gap-1">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </div>
              {tab.badge && (
                <span
                  className={`mt-0.5 text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full leading-tight ${
                    isActive
                      ? "bg-[#FEF08A] text-[#134E4A]"
                      : "bg-white text-[#134E4A]"
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
