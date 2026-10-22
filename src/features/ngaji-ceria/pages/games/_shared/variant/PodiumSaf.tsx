import { motion } from "framer-motion";
import { TilaMascot } from "@/components/ui/TilaMascot";

interface PodiumPlayer { name: string; alive: boolean; score: number }

/**
 * Konsep Quran Quiz Royale: Saf Podium Masjid (eliminasi saf, bukan fight).
 * 8 peserta duduk di saf; yang salah langsung "keluar saf", yang bertahan naik podium.
 * Visual: tangga podium + daftar saf, tanpa karakter tempur/3D.
 */
export function PodiumSaf({ players, round }: { players: PodiumPlayer[]; round: number }) {
  const alive = players.filter((p) => p.alive);
  const podium = [...alive].sort((a, b) => b.score - a.score).slice(0, 3);
  return (
    <motion.section
      aria-label="Saf Podium Masjid"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border-2 border-[#134E4A] bg-[#0A2E28] p-3 shadow-[3px_3px_0px_#134E4A]"
    >
      <p className="text-center text-[10px] font-black uppercase tracking-widest text-teal-200">
        Saf Masjid · Putaran {round} · {alive.length} peserta tersisa
      </p>
      {podium.length > 0 && (
        <div className="mt-3 flex items-end justify-center gap-2" aria-label="Podium sementara">
          {podium.map((player, i) => {
            const height = ["h-14", "h-10", "h-8"][i] ?? "h-8";
            const rankLabel = `#${i + 1}`;
            const badgeColor = i === 0 ? "bg-amber-400 text-[#134E4A]" : i === 1 ? "bg-slate-200 text-[#134E4A]" : "bg-amber-700 text-white";
            return (
              <motion.div
                key={player.name}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="flex w-20 flex-col items-center"
              >
                {i === 0 && (
                  <div className="-mb-2">
                    <TilaMascot size={48} mood="excited" animation="bounce" direction="front" />
                  </div>
                )}
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#134E4A] font-black text-xs shadow-[1px_1px_0px_#134E4A] ${badgeColor}`}>
                  {rankLabel}
                </span>
                <span className="max-w-full truncate text-[9px] font-black text-white mt-0.5">
                  {player.name}
                </span>
                <span className="text-[9px] font-bold text-teal-200">{player.score}</span>
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`mt-1 w-full rounded-t-lg border-2 border-[#134E4A] bg-[#0F766E] shadow-[2px_2px_0px_#134E4A] ${height}`}
                />
              </motion.div>
            );
          })}
        </div>
      )}
      <p className="mt-2 text-center text-[10px] text-teal-200/80">
        Pemain tersisa: {alive.map((p) => p.name).join(", ") || "—"}
      </p>
    </motion.section>
  );
}
