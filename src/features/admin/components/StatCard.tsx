import type { ReactNode } from "react";
import { TrendingUp } from "@/components/ui/CustomIcons";

export interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
  /** Change vs. previous period, in percent. Negative = down (red). */
  trend?: number;
  /** Caption next to the trend pill, e.g. "dari bulan lalu". */
  trendLabel?: string;
}

export function StatCard({
  label,
  value,
  icon,
  hint,
  trend,
  trendLabel,
}: StatCardProps) {
  const hasTrend = typeof trend === "number" && Number.isFinite(trend);
  const isUp = hasTrend && (trend as number) >= 0;
  const trendText = hasTrend ? `${isUp ? "+" : ""}${trend}%` : "";
  const caption = trendLabel ?? hint;

  return (
    <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-[#FFFBF2] p-4 font-sans shadow-[4px_4px_0px_#1A1A1A]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-wide text-[#1A1A1A]/70">
          {label}
        </p>
        {icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2px] border-[#1A1A1A] bg-[#FFF4DC] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-3xl font-black tabular-nums text-[#1A1A1A]">
        {value}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
        {hasTrend ? (
          <span
            className={`inline-flex items-center gap-1 rounded-lg border-[2px] border-[#1A1A1A] px-1.5 py-0.5 font-black text-[#1A1A1A] ${
              isUp ? "bg-[#9BE58B]" : "bg-[#FF6B6B]"
            }`}
          >
            <TrendingUp
              size={12}
              style={{ transform: isUp ? undefined : "rotate(180deg)" }}
            />
            {trendText}
          </span>
        ) : null}
        {caption ? (
          <span className="font-bold text-[#1A1A1A]/60">{caption}</span>
        ) : null}
      </div>
    </div>
  );
}
