import { motion } from "framer-motion";

interface SkyCourierTrackProps {
  playerHp: number;
  lightHp: number;
  lightMax?: number;
  courierName: string;
  index: number;
  total: number;
  status?: string | null;
}

/**
 * Konsep Malaikat Mission: Pos Langit (kurir cahaya, bukan fight).
 * Pemain = kurir amanah mengantar "pesan tugas malaikat" dari bintang ke bintang.
 * Jawaban benar = paket terkirim (cahaya misi penuh), salah = sayap lelah (nyawa kurang).
 */
export function SkyCourierTrack({ playerHp, lightHp, lightMax = 100, courierName, index, total, status }: SkyCourierTrackProps) {
  const light = Math.max(0, Math.min(lightMax, lightHp));
  return (
    <motion.section
      aria-label="Jalur Pos Langit"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-3xl border-2 border-[#134E4A] bg-[#0A2E28] p-3 shadow-[3px_3px_0px_#134E4A]"
    >
      <p className="text-center text-[10px] font-black uppercase tracking-widest text-teal-200">
        Pos Langit · Paket {Math.min(total, index + 1)}/{total} · {courierName}
      </p>
      <div className="mt-2 flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <motion.span
            key={i}
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`h-2 flex-1 rounded-full ${
              i < index
                ? "bg-amber-300"
                : i === index
                  ? "bg-teal-300 animate-pulse"
                  : "bg-white/15"
            }`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black text-white">Sayap Kurir · Kamu</p>
          <div
            role="progressbar"
            aria-label="Stamina sayap"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={playerHp}
            className="mt-1 h-3 overflow-hidden rounded-full border border-[#134E4A] bg-black/40"
          >
            <div
              className="h-full bg-[#14B8A6] transition-[width] duration-500"
              style={{ width: `${playerHp}%` }}
            />
          </div>
          <p data-testid="battle-player-hp" className="mt-1 text-[10px] font-bold text-white/70">
            {playerHp} / 100 Stamina
          </p>
        </div>
        <div className="pt-4 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black text-white">Cahaya Paket</p>
          <div
            role="progressbar"
            aria-label="Cahaya paket"
            aria-valuemin={0}
            aria-valuemax={lightMax}
            aria-valuenow={light}
            className="mt-1 h-3 overflow-hidden rounded-full border border-[#134E4A] bg-black/40"
          >
            <div
              className="h-full bg-[#F59E0B] transition-[width] duration-500"
              style={{ width: `${(light / lightMax) * 100}%` }}
            />
          </div>
          <p data-testid="battle-monster-hp" className="mt-1 text-[10px] font-bold text-white/70">
            {light} / {lightMax} Cahaya
          </p>
        </div>
      </div>
      <motion.p
        key={status ?? index}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        role="status"
        className="mt-2 text-center text-[11px] font-bold text-teal-100"
      >
        {status ?? "Pilih malaikat yang bertugas untuk mengantar paket ke tujuannya."}
      </motion.p>
    </motion.section>
  );
}
