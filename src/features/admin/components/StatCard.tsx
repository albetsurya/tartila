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
    <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-4 font-sans shadow-[4px_4px_0px_#134E4A]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-wide text-[#134E4A]/70">
          {label}
        </p>
        {icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2px] border-[#134E4A] bg-[#F0FDF4] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-3xl font-black tabular-nums text-[#134E4A]">
        {value}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
        {hasTrend ? (
          <span
            className={`inline-flex items-center gap-1 rounded-lg border-[2px] border-[#134E4A] px-1.5 py-0.5 font-black text-[#134E4A] ${
              isUp ? "bg-[#99F6E4]" : "bg-[#FF6B6B]"
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
          <span className="font-bold text-[#134E4A]/60">{caption}</span>
        ) : null}
      </div>
    </div>
  );
}
