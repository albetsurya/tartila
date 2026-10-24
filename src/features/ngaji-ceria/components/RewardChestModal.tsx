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

  if (!reward) return null;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#134E4A]/70 backdrop-blur-sm"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        className="relative z-10 w-full max-w-sm rounded-[32px] border-[4px] border-[#134E4A] bg-[#FFFDF0] p-6 text-center shadow-[6px_6px_0px_#134E4A]"
      >
        <span className="inline-block px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-[10px] font-black uppercase tracking-wider text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]">
          {opened ? "Bonus Didapatkan!" : "Hadiah Spesial Menanti"}
        </span>

        {/* Judul yang terpisah dan tegas */}
        <h2 className="mt-2 font-display text-xl font-black text-[#134E4A]">
          {opened ? "Alhamdulillah!" : "Peti Harta Karun"}
        </h2>

        {/* Deskripsi ringkas dan informatif */}
        <p className="mt-1 text-xs font-bold text-[#134E4A]/80 line-clamp-3">
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
                className="inline-block max-w-[240px] truncate rounded-lg border-2 border-[#134E4A] bg-[#FEF9C3] px-2 py-0.5 text-[10px] font-black text-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
              >
                {src}
              </span>
            ))}
            {reward.sources.length > 2 && (
              <span className="rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] px-2 py-0.5 text-[10px] font-black text-[#134E4A]">
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
                animate={{ scale: [1, 1.04, 1], rotate: [0, -2, 2, 0] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                whileTap={{ scale: 0.92 }}
                className="relative cursor-pointer focus:outline-none flex flex-col items-center"
              >
                <PetiHartaSvg size={140} />
                <span className="mt-2 whitespace-nowrap rounded-full border-2 border-[#134E4A] bg-[#0D9488] px-3.5 py-1 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] animate-bounce">
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
                {/* Visual Peti Terbuka / Bonus Emas Neo-Brutalism */}
                <div className="relative flex items-center justify-center">
                  <PetiBonusEmasSvg size={160} />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] px-5 py-2 shadow-[2.5px_2.5px_0px_#134E4A]"
                >
                  <CoinSvg size={24} />
                  <span className="font-display text-xl font-black text-[#134E4A]">
                    +{reward.coins} Koin Hijaiyah
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
            transition={{ delay: 0.3 }}
            type="button"
            onClick={handleClaim}
            className="w-full rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] py-3 text-sm font-black text-white shadow-[3px_3px_0px_#134E4A] hover:bg-[#0F766E] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <SparklesSvg size={16} />
            <span>Klaim Hadiah</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
