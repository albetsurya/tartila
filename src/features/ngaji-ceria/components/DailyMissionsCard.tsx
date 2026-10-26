import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DAILY_MISSIONS,
  claimMission,
  getMissionCurrentProgress,
  isMissionClaimed,
} from "../data/dailyMissions";
import {
  Sparkles,
  Check,
  Coins,
  BookOpen,
  Gamepad,
  Fire,
} from "../../../components/ui/CustomIcons";
import { AppModal } from "@/components/ui/AppModal";
import { PetiHartaSvg } from "@/components/ui/Illustrations";
import { useNgajiProgress } from "../pages/games/_shared/progression";
import { AnimatedProgressBar } from "@/components/ui/AnimatedProgressBar";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

// Helper untuk memilih ikon berdasarkan tipe misi (Permanen Kontras Gelap di Light, Terang di Dark)
const getMissionIcon = (id: string, isCompletedOnYellow?: boolean) => {
  if (isCompletedOnYellow) {
    if (id.includes("game"))
      return <Gamepad size={18} className="text-[#134E4A]" stroke="#134E4A" />;
    if (id.includes("streak"))
      return <Fire size={18} className="text-[#134E4A]" stroke="#134E4A" />;
    return <BookOpen size={18} className="text-[#134E4A]" stroke="#134E4A" />;
  }
  if (id.includes("game"))
    return <Gamepad size={18} className="text-[#134E4A] dark:text-[#FBBF24]" stroke="currentColor" />;
  if (id.includes("streak"))
    return <Fire size={18} className="text-[#134E4A] dark:text-[#FB7185]" stroke="currentColor" />;
  return <BookOpen size={18} className="text-[#134E4A] dark:text-[#2DD4BF]" stroke="currentColor" />;
};

export function DailyMissionsCard() {
  const [, setRefresh] = useState(0);
  useNgajiProgress();

  const [selectedMission, setSelectedMission] = useState<
    (typeof DAILY_MISSIONS)[0] | null
  >(null);

  return (
    <>
      {/* KONTAINER UTAMA: Bergaya papan petualangan */}
      <div className="relative overflow-hidden rounded-[24px] border-[3px] border-[var(--border-color,#134E4A)] bg-[#FFFBEB] dark:bg-[var(--bg-card)] p-4 shadow-[5px_5px_0px_var(--shadow-color,#134E4A)] transition-colors duration-200">
        {/* Ornamen Background (Peta/Bintang) */}
        <div className="pointer-events-none absolute -right-4 -top-4 opacity-10">
          <Sparkles size={100} />
        </div>

        {/* HEADER */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[#FEF08A] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488]">
              {/* Menggunakan PetiHartaSvg berukuran kecil di header */}
              <PetiHartaSvg size={32} className="text-[#134E4A]" stroke="#134E4A" />
            </div>
            <div>
              <h3 className="font-display text-base font-black text-[var(--text-main,#134E4A)]">
                Papan Misi
              </h3>
              <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/60">
                Selesaikan misi, raih hadiahnya!
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-[#FF6B6B] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]">
            Reset Hari Ini
          </span>
        </div>

        {/* LIST MISI */}
        <div className="relative z-10 mt-4 space-y-3">
          {DAILY_MISSIONS.map((mission, idx) => {
            const current = getMissionCurrentProgress(mission);
            const completed = current >= mission.target;
            const claimed = isMissionClaimed(mission.id);
            const progressPercent = Math.min(
              100,
              (current / mission.target) * 100,
            );

            return (
              <motion.button
                key={mission.id}
                onClick={() => setSelectedMission(mission)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`w-full flex flex-col gap-2.5 rounded-2xl p-3.5 transition-all text-left ${
                  claimed
                    ? "border-[2px] border-[var(--border-color,#134E4A)]/30 bg-gray-100 dark:bg-gray-800/40 opacity-60"
                    : completed
                      ? "border-[3px] border-[var(--border-color,#134E4A)] bg-[#FEF08A] text-[#134E4A] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)]"
                      : "border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 shadow-[1.5px_1.5px_0px_var(--shadow-color,#134E4A)] ${
                        claimed
                          ? "bg-gray-200 dark:bg-gray-800 border-gray-400 dark:border-gray-600 text-gray-400"
                          : completed
                            ? "bg-white border-[#134E4A] text-[#134E4A]"
                            : "bg-[#FEF08A] dark:bg-[var(--bg-card)] border-[#134E4A] dark:border-[#2DD4BF] text-[#134E4A] dark:text-white"
                      }`}
                    >
                      {getMissionIcon(mission.id, completed)}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-display text-xs font-black ${
                          claimed
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : completed
                              ? "text-[#134E4A]"
                              : "text-[#134E4A] dark:text-[var(--text-main,#FFFFFF)]"
                        }`}
                      >
                        {mission.title}
                      </p>
                      <p
                        className={`text-[10px] font-bold mt-0.5 truncate ${
                          claimed
                            ? "text-gray-400 dark:text-gray-500"
                            : completed
                              ? "text-[#134E4A]/80"
                              : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {mission.description}
                      </p>
                    </div>
                  </div>

                  {/* BADGE AKSI */}
                  <div className="shrink-0">
                    {claimed ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#0D9488]/10 px-2 py-1 text-[10px] font-black text-[#0D9488]">
                        <Check size={12} /> Selesai
                      </span>
                    ) : completed ? (
                      <motion.span
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="inline-flex items-center gap-1.5 rounded-lg border-[2px] border-[var(--border-color,#134E4A)] bg-[#F59E0B] px-2.5 py-1.5 text-[10px] font-black text-white shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]"
                      >
                        <Sparkles size={12} /> KLAIM
                      </motion.span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0D9488] dark:text-[#38BDF8] bg-[#CCFBF1] dark:bg-[#1E293B] px-2 py-1 rounded-lg border-2 border-[var(--border-color,#134E4A)]">
                        +{mission.rewardCoins} <Coins size={12} className="text-[#F59E0B]" stroke="currentColor" />
                      </span>
                    )}
                  </div>
                </div>

                {/* PROGRESS BAR YANG LEBIH GEMUK */}
                <div className="flex items-center gap-2 w-full mt-1">
                  <AnimatedProgressBar
                    value={progressPercent}
                    height="h-3.5"
                    className="flex-1"
                    barClassName={completed ? "bg-[#10B981] dark:bg-[#34D399]" : "bg-[#F59E0B]"}
                  />
                  <span className="text-[10px] font-black text-[var(--text-main,#134E4A)] min-w-[28px] text-right">
                    {current}/{mission.target}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* MODAL DETAIL MISI */}
      <AppModal
        isOpen={!!selectedMission}
        onClose={() => setSelectedMission(null)}
        title={selectedMission?.title ?? ""}
        variant="warm"
      >
        {selectedMission && (
          <>
            <div className="flex flex-col items-center text-center mt-2">
              {/* Animasi Peti Harta (Menggunakan SVG ukuran 140) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                }}
                className="mb-2 drop-shadow-xl text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488]"
              >
                <PetiHartaSvg size={140} stroke="#134E4A" />
              </motion.div>

              <p className="text-xs font-bold text-[#134E4A]/80 dark:text-gray-300 mt-2 px-2">
                {selectedMission.description}
              </p>

              {/* Info Hadiah yang Lebih Mencolok */}
              <div className="mt-5 flex items-center justify-center gap-3 w-full">
                <div className="flex flex-1 flex-col items-center justify-center bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[#134E4A] dark:border-[var(--border-color,#134E4A)] rounded-2xl py-3 shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] text-[#134E4A] dark:text-[var(--text-main,#FFFFFF)]">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border-2 border-[#134E4A] flex items-center justify-center mb-1.5 shadow-[1.5px_1.5px_0px_#134E4A]">
                    <Coins size={22} className="text-[#F59E0B]" stroke="#134E4A" />
                  </div>
                  <span className="text-base font-black text-[#134E4A] dark:text-[var(--text-main,#FFFFFF)]">
                    +{selectedMission.rewardCoins}
                  </span>
                  <span className="text-[10px] font-bold text-[#134E4A]/80 dark:text-gray-300 uppercase tracking-widest mt-0.5">
                    Koin
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[#134E4A] dark:border-[var(--border-color,#134E4A)] rounded-2xl py-3 shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] text-[#134E4A] dark:text-[var(--text-main,#FFFFFF)]">
                  <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] border-2 border-[#134E4A] flex items-center justify-center mb-1.5 shadow-[1.5px_1.5px_0px_#134E4A]">
                    <Sparkles size={22} className="text-[#0D9488]" stroke="#134E4A" />
                  </div>
                  <span className="text-base font-black text-[#134E4A] dark:text-[var(--text-main,#FFFFFF)]">
                    +{selectedMission.rewardXp}
                  </span>
                  <span className="text-[10px] font-bold text-[#134E4A]/80 dark:text-gray-300 uppercase tracking-widest mt-0.5">
                    EXP
                  </span>
                </div>
              </div>

              {/* Progress Bar Modal */}
              <div className="w-full mt-6">
                <div className="flex justify-between text-[10px] font-black text-[#134E4A] dark:text-[var(--text-main,#FFFFFF)] mb-1.5 uppercase tracking-wider">
                  <span>Progres Misi</span>
                  <span>
                    {getMissionCurrentProgress(selectedMission)} /{" "}
                    {selectedMission.target}
                  </span>
                </div>
                <AnimatedProgressBar
                  value={Math.min(100, (getMissionCurrentProgress(selectedMission) / selectedMission.target) * 100)}
                  height="h-4"
                  className="border-[3px] shadow-inner"
                  barClassName="bg-[#10B981] dark:bg-[#34D399]"
                />
              </div>
            </div>

            {/* TOMBOL AKSI MODAL */}
            <div className="mt-7">
              {(() => {
                const current = getMissionCurrentProgress(selectedMission);
                const completed = current >= selectedMission.target;
                const claimed = isMissionClaimed(selectedMission.id);

                if (claimed) {
                  return (
                    <button
                      disabled
                      className="w-full py-4 rounded-xl border-[3px] border-[#134E4A] bg-gray-200 text-[#134E4A]/50 font-black text-sm flex items-center justify-center gap-2 cursor-not-allowed shadow-[3px_3px_0px_#134E4A]"
                    >
                      <Check size={18} /> Hadiah Diklaim
                    </button>
                  );
                }

                if (completed) {
                  return (
                    <motion.button
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      whileHover={{ scale: 1.04, rotate: [0, -1.5, 1.5, -1.5, 0] }}
                      whileTap={{ scale: 0.95, y: 2 }}
                      onClick={() => {
                        claimMission(selectedMission);
                        setRefresh((r) => r + 1);
                        setSelectedMission(null);
                      }}
                      className="w-full py-4 rounded-xl border-[3px] border-[#134E4A] bg-[#F59E0B] text-white font-black text-sm shadow-[4px_4px_0px_#134E4A] active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                    >
                      <Sparkles size={18} /> Klaim Hadiah!
                    </motion.button>
                  );
                }

                return (
                  <button
                    onClick={() => {
                      setSelectedMission(null);
                      if ((selectedMission as any).to) {
                        window.location.href = (selectedMission as any).to;
                      }
                    }}
                    className="w-full py-4 rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[4px_4px_0px_#134E4A] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    Kerjakan Sekarang
                  </button>
                );
              })()}
            </div>
          </>
        )}
      </AppModal>
    </>
  );
}
