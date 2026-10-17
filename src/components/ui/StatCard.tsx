// src/components/ui/StatCard.tsx
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  iconColor?: string;
}

export function StatCard({
  icon,
  label,
  value,
  iconColor = "text-[#0D9488]",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border-[2px] border-[#134E4A] bg-white p-3 text-center shadow-[2px_2px_0px_#134E4A]">
      <div className={`mx-auto ${iconColor}`}>{icon}</div>
      <p className="mt-1 text-[11px] font-black text-[#134E4A]">{label}</p>
      <p className="text-[10px] font-bold text-[#134E4A]/60 tracking-wide">
        {value}
      </p>
    </div>
  );
}
