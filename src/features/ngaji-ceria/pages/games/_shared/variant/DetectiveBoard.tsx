import { SearchSvg } from "@/components/ui/CustomIcons";

export function DetectiveBoard({ surah, ayah, placed, total }: { surah: string; ayah: number; placed: number; total: number }) {
  return (
    <div aria-label="Papan investigasi ayat" className="rounded-2xl border border-amber-300/25 bg-amber-950/40 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">Papan Investigasi</span>
        <SearchSvg size={20} className="text-amber-200" />
      </div>
      <p className="mt-2 text-xs font-bold text-white">{surah} · ayat {ayah}</p>
      <div className="mt-2 flex gap-1">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={`h-2 flex-1 rounded-full ${index < placed ? "bg-amber-300" : "bg-white/10"}`} />
        ))}
      </div>
      <p className="mt-2 text-[10px] text-white/60">Potongan terkunci: {placed}/{total} · cari urutan yang menjadi bukti.</p>
    </div>
  );
}
