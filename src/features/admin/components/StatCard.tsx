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
    <div className="admin-surface admin-border rounded-lg border p-4 transition-all duration-150 hover:border-[var(--admin-accent)]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium admin-muted">{label}</p>
        {icon ? <span className="admin-muted">{icon}</span> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
        {hasTrend ? (
          <span
            className="inline-flex items-center gap-1 font-medium"
            style={{
              color: isUp ? "var(--admin-accent)" : "var(--admin-danger)",
            }}
          >
            <TrendingUp
              size={12}
              style={{ transform: isUp ? undefined : "rotate(180deg)" }}
            />
            {trendText}
          </span>
        ) : null}
        {caption ? <span className="admin-muted">{caption}</span> : null}
      </div>
    </div>
  );
}
