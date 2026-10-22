import { motion } from "framer-motion";

/**
 * Konsep Hijaiyah Match Arena: Taman Memori (kebun kartu, bukan arena tempur).
 * Kartu = bunga di petak kebun; pasangan cocok = bunga mekar.
 * Mode battle vs AI = "berkebun bersama" (giliran menyiram), bukan bertarung.
 */
export function MemoryGarden({ playerPairs, aiPairs, turn, mode }: { playerPairs: number; aiPairs: number; turn?: string; mode?: string }) {
  const total = 8;
  const bloomed = playerPairs + aiPairs;
  return (
    <motion.section
      aria-label="Taman Memori Hijaiyah"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border-2 border-[#134E4A] bg-[#0A2E28] p-3 shadow-[3px_3px_0px_#134E4A]"
    >
      <p className="text-center text-[10px] font-black uppercase tracking-widest text-teal-200">
        Taman Memori · {bloomed}/{total} mekar{mode === "battle" ? ` · giliran: ${turn === "ai" ? "Tukang Kebun AI" : "Kamu"}` : ""}
      </p>
      <div className="mt-2 grid grid-cols-8 gap-1" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <motion.span
            key={`${i}:${i < bloomed}`}
            initial={i < bloomed ? { scale: 0.4 } : false}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 17 }}
            className={`flex h-8 items-center justify-center rounded-lg border-2 ${
              i < bloomed
                ? "border-[#134E4A] bg-[#0D9488] shadow-[1px_1px_0px_#134E4A]"
                : "border-white/10 bg-white/5 opacity-60"
            }`}
          >
            {i < playerPairs ? (
              <div className="w-3.5 h-3.5 rounded-full bg-[#EC4899] border border-[#134E4A]" />
            ) : i < bloomed ? (
              <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] border border-[#134E4A]" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-teal-800" />
            )}
          </motion.span>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] font-bold text-teal-100">
        {mode === "battle" ? `Milikmu ${playerPairs} — Kebun AI ${aiPairs}` : `${playerPairs}/${total} pasangan ditemukan`}
      </p>
    </motion.section>
  );
}
