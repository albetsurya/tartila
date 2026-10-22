import { CompassSvg } from "@/components/ui/CustomIcons";

export function StealthRadar({ collected, total, alert }: { collected: number; total: number; alert: number }) {
  return (
    <div aria-label="Radar stealth Ayat Hunter" className="rounded-2xl border border-teal-300/25 bg-teal-950/40 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-teal-200">Stealth Radar</span>
        <CompassSvg size={20} className="text-teal-200" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="relative h-12 w-12 shrink-0 rounded-full border-2 border-teal-300/50 bg-teal-500/10">
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-200 shadow-[0_0_12px_#a7f3d0]" />
          <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-300/30" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-white/60">Jejak ayat {collected}/{total}</p>
          <div className="mt-1 h-2 rounded-full bg-white/10">
            <div className={`h-full rounded-full ${alert > 60 ? "bg-red-400" : "bg-teal-400"}`} style={{ width: `${alert}%` }} />
          </div>
          <p className="mt-1 text-[10px] text-white/60">Alert monster {alert}%</p>
        </div>
      </div>
    </div>
  );
}
