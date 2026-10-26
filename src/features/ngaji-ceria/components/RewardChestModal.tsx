import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  takeRewards,
  subscribeRewards,
} from "../pages/games/_shared/progression";
import { playSfx } from "../pages/games/_shared/audio";
import { tapFeedback } from "../../../lib/haptics";
import { PetiHartaSvg, PetiBonusEmasSvg } from "@/components/ui/Illustrations";
import { CoinSvg, SparklesSvg } from "@/components/ui/CustomIcons";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { AppModal } from "@/components/ui/AppModal";

interface AggregatedReward {
  id: string;
  coins: number;
  sources: string[];
}

export function RewardChestModal() {
  const [reward, setReward] = useState<AggregatedReward | null>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const checkQueue = () => {
      if (reward) return; // sedang buka reward
      const pending = takeRewards();
      if (pending.length > 0) {
        // Gabungkan total koin jika ada beberapa hadiah masuk bersamaan
        const totalCoins = pending.reduce((sum, r) => sum + r.coins, 0);

        // De-duplikasi sumber hadiah agar tidak berulang
        const distinctSources = Array.from(
          new Set(
            pending
              .map((r) => r.label?.trim())
              .filter((l): l is string => Boolean(l && l.length > 0))
          )
        );

        setReward({
          id: pending[0].id,
          coins: totalCoins,
          sources: distinctSources,
        });
        setOpened(false);
      }
    };

    checkQueue();
    return subscribeRewards(checkQueue);
  }, [reward]);

  const handleChestClick = () => {
    if (opened) return;
    tapFeedback([10, 30, 20]);
    playSfx("powerup");
    setOpened(true);
  };

  const handleClaim = () => {
    tapFeedback(12);
    setReward(null);
    setOpened(false);
  };

  return (
    <AppModal
      isOpen={!!reward}
      onClose={() => {
        setReward(null);
        setOpened(false);
      }}
      title={opened ? "Alhamdulillah!" : "Peti Harta Karun"}
      variant="warm"
    >
      {reward && (
        <>
          <span className="inline-block px-3 py-1 rounded-full border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-element,#FEF08A)] text-[10px] font-black uppercase tracking-wider text-[var(--text-main,#134E4A)] shadow-[1.5px_1.5px_0px_var(--shadow-color,#134E4A)]">
            {opened ? "Bonus Didapatkan!" : "Hadiah Spesial Menanti"}
          </span>

          {/* Deskripsi ringkas dan informatif */}
          <p className="mt-1 text-xs font-bold text-[var(--text-main,#134E4A)]/80 line-clamp-3">
            {opened
              ? "Koin bonus berhasil ditambahkan ke dompet santrimu!"
              : "Selesaikan tantangan di game ini untuk membuka peti harta karun dan mendapatkan hadiah menarik!"}
          </p>

          {/* List sumber hadiah terduplikasi rapi */}
          {!opened && reward.sources.length > 0 && (
            <div className="mt-2.5 max-h-16 overflow-y-auto flex flex-wrap justify-center gap-1.5 px-2">
              {reward.sources.slice(0, 2).map((src, idx) => (
                <span
                  key={idx}
                  className="inline-block max-w-[240px] truncate rounded-lg border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FEF9C3)] px-2 py-0.5 text-[10px] font-black text-[var(--text-main,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]"
                >
                  {src}
                </span>
              ))}
              {reward.sources.length > 2 && (
                <span className="rounded-lg border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-element,#CCFBF1)] px-2 py-0.5 text-[10px] font-black text-[var(--text-main,#134E4A)]">
                  +{reward.sources.length - 2} lainnya
                </span>
              )}
            </div>
          )}

          {/* Peti & Animasi Buka */}
          <div className="relative my-4 flex min-h-[160px] items-center justify-center">
            <AnimatePresence mode="wait">
              {!opened ? (
                <motion.button
                  key="closed"
                  type="button"
                  onClick={handleChestClick}
                  animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 2 }}
                  className="relative cursor-pointer focus:outline-none flex flex-col items-center"
                >
                  <PetiHartaSvg size={140} />
                  <span className="mt-2 whitespace-nowrap rounded-full border-2 border-[var(--border-color,#134E4A)] bg-[#0D9488] px-3.5 py-1 text-xs font-black text-white shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] animate-bounce">
                    Ketuk untuk Buka!
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  key="open"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  className="flex flex-col items-center justify-center gap-2"
                >
                  {/* Visual Peti Terbuka / Bonus Emas Neo-Brutalism dengan Partikel Sparkles */}
                  <div className="relative flex items-center justify-center">
                    <PetiBonusEmasSvg size={160} />

                    {/* Partikel Sparkles Pop & Fade */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0, x: -50, y: -40 }}
                      animate={{ scale: [0, 1.25, 0], opacity: [0, 1, 0], rotate: 45 }}
                      transition={{ repeat: Infinity, duration: 1.8, delay: 0.1 }}
                      className="absolute text-[#F59E0B] pointer-events-none"
                    >
                      <SparklesSvg size={24} />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0, opacity: 0, x: 50, y: -45 }}
                      animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: -30 }}
                      transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
                      className="absolute text-[#FEF08A] pointer-events-none"
                    >
                      <SparklesSvg size={28} />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0, opacity: 0, x: -60, y: 20 }}
                      animate={{ scale: [0, 1.3, 0], opacity: [0, 1, 0], rotate: 15 }}
                      transition={{ repeat: Infinity, duration: 1.6, delay: 0.7 }}
                      className="absolute text-[#FF6B6B] pointer-events-none"
                    >
                      <SparklesSvg size={20} />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0, opacity: 0, x: 60, y: 25 }}
                      animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: 60 }}
                      transition={{ repeat: Infinity, duration: 2.1, delay: 0.3 }}
                      className="absolute text-[#10B981] pointer-events-none"
                    >
                      <SparklesSvg size={22} />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-element,#FEF08A)] px-5 py-2 shadow-[2.5px_2.5px_0px_var(--shadow-color,#134E4A)]"
                  >
                    <CoinSvg size={24} />
                    <span className="font-display text-xl font-black text-[var(--text-main,#134E4A)]">
                      +<AnimatedCounter value={reward.coins} /> Koin Hijaiyah
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {opened && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95, y: 2 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              type="button"
              onClick={handleClaim}
              className="w-full rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#0D9488] py-3 text-sm font-black text-white shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] hover:bg-[#0F766E] cursor-pointer flex items-center justify-center gap-2"
            >
              <SparklesSvg size={16} />
              <span>Klaim Hadiah</span>
            </motion.button>
          )}
        </>
      )}
    </AppModal>
  );
}
