import { StarSvg } from "@/components/ui/CustomIcons";
import type { LeaderboardEntry } from "./progression";

export function LeaderboardPanel({
  entries,
  title = "Papan Skor Lokal",
}: {
  entries: LeaderboardEntry[];
  title?: string;
}) {
  return (
    <div className="rounded-3xl border-2 border-[#134E4A] bg-white p-3 text-left shadow-[3px_3px_0px_#134E4A]">
      <p className="text-xs font-black uppercase tracking-widest text-[#0D9488]">{title}</p>
      <ol className="mt-2 space-y-1.5">
        {entries.slice(0, 5).map((entry, index) => (
          <li
            key={entry.id}
            className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs border ${
              entry.name === "Kamu"
                ? "bg-[#F0FDF4] border-[#134E4A] font-black text-[#134e4a] shadow-[1px_1px_0px_#134E4A]"
                : "border-transparent text-[#134e4a] font-semibold"
            }`}
          >
            <span>
              <b className="mr-2 text-[#FF6B6B]">#{index + 1}</b>
              {index === 0 && <StarSvg size={12} className="inline mr-1 text-[#F59E0B]" />}
              {entry.name}
            </span>
            <b className="font-black">{entry.score}</b>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[10px] font-medium text-[#134e4a]/60">
        Dapat tersambung ke leaderboard server saat backend multiplayer tersedia.
      </p>
    </div>
  );
}
