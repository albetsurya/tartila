import { CheckSvg } from "@/components/ui/CustomIcons";

export function DungeonMap({ total, current, cleared }: { total: number; current: number; cleared: number }) {
  return <div aria-label="Peta Doa Dungeon" className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-teal-300/20 bg-black/20 p-2">
    {Array.from({ length: total }, (_, index) => <div key={index} className="flex min-w-12 flex-1 items-center gap-1"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${index < cleared ? "border-teal-300 bg-teal-500/30 text-teal-100" : index === current ? "border-teal-300 bg-teal-500/30 text-teal-100" : "border-white/10 bg-white/5 text-white/40"}`}>{index < cleared ? <CheckSvg size={14} /> : index + 1}</div>{index < total - 1 && <div className={`h-1 flex-1 rounded-full ${index < cleared ? "bg-teal-400" : "bg-white/10"}`} />}</div>)}
  </div>;
}
