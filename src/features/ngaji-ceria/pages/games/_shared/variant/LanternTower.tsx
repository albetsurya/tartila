import { motion } from "framer-motion";

/**
 * Konsep Nur Battle: Menara Lentera (panjat cahaya 3 lantai, bukan fight).
 * Tiap ronde = satu lantai menara. Jawaban benar menyalakan lentera,
 * jawaban salah memadamkan satu sumbu (nyawa).
 */
export function LanternTower({ round, lives, score }: { round: number; lives: number; score: number }) {
  const floors = [1, 2, 3];
  return (
    <motion.section
      aria-label="Menara Lentera Nur"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border-2 border-[#134E4A] bg-[#0A2E28] p-3 text-center shadow-[3px_3px_0px_#134E4A]"
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-teal-200">
        Menara Lentera · Lantai {round}/3 · {score} cahaya
      </p>
      <div className="mx-auto mt-3 flex max-w-[220px] flex-col-reverse gap-1.5" aria-hidden="true">
        {floors.map((floor) => {
          const lit = floor < round || (floor === round && lives > 0);
          const current = floor === round;
          return (
            <motion.div
              key={floor}
              initial={false}
              animate={lit ? { scale: [1, 1.04, 1], opacity: 1 } : { scale: 1, opacity: 0.6 }}
              transition={{ duration: 0.35 }}
              className={`flex items-center justify-between rounded-xl border-2 px-3 py-2 ${
                lit
                  ? "border-[#134E4A] bg-[#0D9488] shadow-[2px_2px_0px_#134E4A]"
                  : "border-white/10 bg-white/5"
              } ${current ? "ring-2 ring-amber-300" : ""}`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full border border-[#134E4A] ${lit ? "bg-amber-300 animate-pulse" : "bg-gray-600"}`} />
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  Lantai {floor}
                </span>
              </div>
              {current && (
                <span className="text-[9px] font-bold text-amber-300">Aktif</span>
              )}
            </motion.div>
          );
        })}
      </div>
      <motion.p key={lives} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="mt-2 text-[11px] font-bold text-teal-100">
        Sumbu tersisa: {lives} nyawa
      </motion.p>
    </motion.section>
  );
}
