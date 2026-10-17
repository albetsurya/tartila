import type { LeaderboardEntry } from "./progression";

export function LeaderboardPanel({ entries, title = "Papan Skor Lokal" }: { entries: LeaderboardEntry[]; title?: string }) {
  return <div className="rounded-3xl border border-gray-100 bg-white p-3 text-left shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-[#0D9488]">{title}</p><ol className="mt-2 space-y-1.5">{entries.slice(0, 5).map((entry, index) => <li key={entry.id} className={`flex items-center justify-between rounded-2xl px-2.5 py-1.5 text-xs ${entry.name === "Kamu" ? "bg-[#fff0f0] font-bold text-[#134e4a]" : "text-[#134e4a]"}`}><span><b className="mr-2 text-[#FF6B6B]">#{index + 1}</b>{index === 0 && <span className="mr-1 text-[#FF6B6B]">★</span>}{entry.name}</span><b>{entry.score}</b></li>)}</ol><p className="mt-2 text-[10px] text-[#134e4a]/50">Dapat tersambung ke leaderboard server saat backend multiplayer tersedia.</p></div>;
}
