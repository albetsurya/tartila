import { ReactNode } from "react";
import { ChevronRightSvg as ChevronRight } from "./CustomIcons";

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  badge?: string;
  accent?: "teal" | "coral" | "amber";
  action?: { label: string; onClick: () => void };
  className?: string;
}

const ACCENT_STYLES = {
  teal: {
    iconBg: "bg-[#0D9488]",
    badgeBg: "bg-[#CCFBF1]",
    badgeText: "text-[#0D9488]",
    actionBg: "bg-[#0D9488]",
    actionText: "text-white",
  },
  coral: {
    iconBg: "bg-[#FF6B6B]",
    badgeBg: "bg-[#FFF0F0]",
    badgeText: "text-[#FF6B6B]",
    actionBg: "bg-[#FF6B6B]",
    actionText: "text-white",
  },
  amber: {
    iconBg: "bg-[#F59E0B]",
    badgeBg: "bg-[#FEF3C7]",
    badgeText: "text-[#B45309]",
    actionBg: "bg-[#F59E0B]",
    actionText: "text-white",
  },
};

export function SectionHeader({
  title,
  icon,
  badge,
  accent = "teal",
  action,
  className = "",
}: SectionHeaderProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div
      className={`flex items-center justify-between mb-3 gap-3 ${className}`}
    >
      {/* BAGIAN KIRI: Icon, Title, Badge */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {icon && (
          <div
            className={`shrink-0 w-8 h-8 rounded-xl ${styles.iconBg} flex items-center justify-center text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]`}
          >
            {icon}
          </div>
        )}

        <h3
          className="font-display text-sm font-black text-[#134E4A] truncate"
          title={title}
        >
          {title}
        </h3>

        {badge && (
          <span
            className={`hidden min-[450px]:inline shrink-0 rounded-lg border-2 border-[#134E4A] ${styles.badgeBg} ${styles.badgeText} px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_#134E4A]`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* BAGIAN KANAN: Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`shrink-0 flex items-center justify-center gap-1 rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-[10px] font-black transition-all shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none ${styles.actionBg} ${styles.actionText}`}
        >
          <span className="hidden min-[360px]:inline whitespace-nowrap">
            {action.label}
          </span>
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}
