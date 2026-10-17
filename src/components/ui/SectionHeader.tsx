// src/components/ui/SectionHeader.tsx
import { ReactNode } from "react";
import { ChevronRight } from "./FontAwesomeIcons";

interface SectionHeaderProps {
  title: string;
  /** Ikon opsional di sebelah kiri judul */
  icon?: ReactNode;
  /** Badge/count opsional di sebelah kanan judul */
  badge?: string;
  /** Warna aksen untuk ikon, badge, dan tombol aksi */
  accent?: "teal" | "coral" | "amber";
  /** Tombol aksi di sebelah kanan (opsional) */
  action?: { label: string; onClick: () => void };
  className?: string;
}

const ACCENT_STYLES = {
  teal: {
    iconBg: "bg-[#0D9488]",
    badgeBg: "bg-[#0D9488]/10",
    badgeText: "text-[#0D9488]",
    badgeBorder: "border-[#0D9488]/30",
    actionText: "text-[#0D9488]",
  },
  coral: {
    iconBg: "bg-[#FF6B6B]",
    badgeBg: "bg-[#FF6B6B]/10",
    badgeText: "text-[#FF6B6B]",
    badgeBorder: "border-[#FF6B6B]/30",
    actionText: "text-[#FF6B6B]",
  },
  amber: {
    iconBg: "bg-[#F59E0B]",
    badgeBg: "bg-[#FEF3C7]",
    badgeText: "text-[#D97706]",
    badgeBorder: "border-[#D97706]/30",
    actionText: "text-[#D97706]",
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
      className={`flex items-center justify-between mb-3 gap-2 ${className}`}
    >
      {/* Kiri: Ikon + Judul + Badge */}
      <div className="flex items-center gap-2 min-w-0">
        {icon && (
          <div
            className={`shrink-0 w-8 h-8 rounded-xl border-2 border-[#134E4A] ${styles.iconBg} flex items-center justify-center text-white shadow-[2px_2px_0px_#134E4A]`}
          >
            {icon}
          </div>
        )}
        <h3 className="font-display text-sm font-black text-[#134E4A] truncate">
          {title}
        </h3>
        {badge && (
          <span
            className={`shrink-0 rounded-md border-2 ${styles.badgeBorder} ${styles.badgeBg} ${styles.badgeText} px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Kanan: Tombol Aksi */}
      {action && (
        <button
          onClick={action.onClick}
          className={`shrink-0 flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-white px-2.5 py-1 text-[10px] font-black ${styles.actionText} shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all`}
        >
          {action.label} <ChevronRight size={10} />
        </button>
      )}
    </div>
  );
}
