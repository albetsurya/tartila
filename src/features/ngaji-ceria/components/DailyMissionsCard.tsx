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

const getMissionIcon = (id: string, isCompletedOnYellow?: boolean) => {
  if (isCompletedOnYellow) {
    if (id.includes("game")) {
      return <Gamepad size={18} className="text-[#134E4A]" stroke="#134E4A" />;
    }
    if (id.includes("streak")) {
      return <Fire size={18} className="text-[#134E4A]" stroke="#134E4A" />;
    }
    return <BookOpen size={18} className="text-[#134E4A]" stroke="#134E4A" />;
  }
  if (id.includes("game")) {
    return (
      <Gamepad
        size={18}
        className="text-[#134E4A] dark:text-[#FBBF24]"
        stroke="currentColor"
      />
    );
  }
  if (id.includes("streak")) {
    return (
      <Fire
        size={18}
        className="text-[#134E4A] dark:text-[#FB7185]"
        stroke="currentColor"
      />
    );
  }
  return (
    <BookOpen
      size={18}
      className="text-[#134E4A] dark:text-[#2DD4BF]"
      stroke="currentColor"
    />
  );
};

export function DailyMissionsCard() {
  const [, setRefresh] = useState(0);
  useNgajiProgress();

  const [selectedMission, setSelectedMission] = useState<
    (typeof DAILY_MISSIONS)[0] | null
  >(null);

  return (
    <>
      <div className="relative overflow-hidden rounded-[22px] border-2 border-[var(--border-color,#134E4A)]/80 bg-[#FFFBEB] p-4 shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] transition-colors duration-200 dark:bg-[var(--bg-card)] sm:p-5">
        <div
          className="pointer-events-none absolute -right-3 -top-4 text-[#134E4A] opacity-[0.06]"
          aria-hidden="true"
        >
          <Sparkles size={92} />
        </div>

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] [--svg-primary:#134E4A] [--svg-secondary:#0D9488] sm:h-12 sm:w-12">
              <PetiHartaSvg
                size={30}
                className="text-[#134E4A]"
                stroke="#134E4A"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-black text-[var(--text-main,#134E4A)] sm:text-lg">
                Papan Misi
              </h3>
              <p className="mt-0.5 text-xs leading-snug text-[var(--text-main,#134E4A)]/60 sm:text-sm">
                Selesaikan misi, raih hadiahnya!
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-lg border border-[var(--border-color,#134E4A)]/15 bg-[#FF6B6B] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white sm:px-2.5 sm:text-[11px]">
            Harian
          </span>
        </div>

        <div className="relative z-10 mt-4 space-y-2.5 sm:space-y-3">
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
                type="button"
                onClick={() => setSelectedMission(mission)}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.22 }}
                className={`flex w-full flex-col gap-2.5 rounded-xl p-3 text-left transition-colors sm:p-3.5 ${
                  claimed
                    ? "border border-[var(--border-color,#134E4A)]/10 bg-gray-100/80 opacity-75 dark:bg-gray-800/40"
                    : completed
                      ? "border-2 border-[var(--border-color,#134E4A)] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]"
                      : "border border-[var(--border-color,#134E4A)]/15 bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] hover:border-[var(--border-color,#134E4A)]/40"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                        claimed
                          ? "border-gray-300 bg-gray-200 text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                          : completed
                            ? "border-[#134E4A] bg-white text-[#134E4A]"
                            : "border-[#134E4A]/15 bg-[#FEF08A] text-[#134E4A] dark:border-[#2DD4BF]/40 dark:bg-[var(--bg-card)] dark:text-white"
                      }`}
                    >
                      {getMissionIcon(mission.id, completed)}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-display text-sm font-black leading-tight ${
                          claimed
                            ? "text-gray-400 line-through dark:text-gray-500"
                            : completed
                              ? "text-[#134E4A]"
                              : "text-[var(--text-main,#134E4A)]"
                        }`}
                      >
                        {mission.title}
                      </p>
                      <p
                        className={`mt-1 line-clamp-2 text-xs leading-snug ${
                          claimed
                            ? "text-gray-400 dark:text-gray-500"
                            : completed
                              ? "text-[#134E4A]/75"
                              : "text-[var(--text-main,#134E4A)]/60"
                        }`}
                      >
                        {mission.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {claimed ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#0D9488]/10 px-2 py-1.5 text-[10px] font-black text-[#0D9488]">
                        <Check size={12} /> Selesai
                      </span>
                    ) : completed ? (
                      <motion.span
                        animate={{ scale: [1, 1.035, 1] }}
                        transition={{ repeat: Infinity, duration: 2.2 }}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-color,#134E4A)]/20 bg-[#F59E0B] px-2 py-1.5 text-[10px] font-black text-white"
                      >
                        <Sparkles size={12} /> Klaim
                      </motion.span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#CCFBF1] px-2 py-1.5 text-[10px] font-black text-[#0D766E] dark:bg-[#1E293B] dark:text-[#38BDF8]">
                        +{mission.rewardCoins}{" "}
                        <Coins
                          size={12}
                          className="text-[#F59E0B]"
                          stroke="currentColor"
                        />
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex w-full items-center gap-2">
                  <AnimatedProgressBar
                    value={progressPercent}
                    height="h-2.5"
                    className="flex-1"
                    barClassName={
                      completed
                        ? "bg-[#10B981] dark:bg-[#34D399]"
                        : "bg-[#F59E0B]"
                    }
                  />
                  <span className="min-w-[38px] text-right text-[11px] font-extrabold tabular-nums text-[var(--text-main,#134E4A)]/70">
                    {current}/{mission.target}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AppModal
        isOpen={!!selectedMission}
        onClose={() => setSelectedMission(null)}
        title={selectedMission?.title ?? ""}
        variant="warm"
      >
        {selectedMission && (
          <>
            <div className="mt-2 flex flex-col items-center text-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="mb-2 text-[#134E4A] drop-shadow-lg [--svg-primary:#134E4A] [--svg-secondary:#0D9488]"
              >
                <PetiHartaSvg size={124} stroke="#134E4A" />
              </motion.div>
              <p className="mt-2 px-2 text-sm leading-relaxed text-[#134E4A]/75 dark:text-gray-300">
                {selectedMission.description}
              </p>

              <div className="mt-5 flex w-full items-stretch justify-center gap-3">
                <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-[#134E4A]/80 bg-[var(--bg-card,#FFFFFF)] py-3 text-[#134E4A] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] dark:text-[var(--text-main,#FFFFFF)]">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-[#134E4A]/15 bg-[#FEF3C7]">
                    <Coins
                      size={22}
                      className="text-[#F59E0B]"
                      stroke="#134E4A"
                    />
                  </div>
                  <span className="text-lg font-black text-[#134E4A] dark:text-[var(--text-main,#FFFFFF)]">
                    +{selectedMission.rewardCoins}
                  </span>
                  <span className="mt-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#134E4A]/60 dark:text-gray-300">
                    Koin
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-[#134E4A]/80 bg-[var(--bg-card,#FFFFFF)] py-3 text-[#134E4A] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] dark:text-[var(--text-main,#FFFFFF)]">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-[#134E4A]/15 bg-[#CCFBF1]">
                    <Sparkles
                      size={22}
                      className="text-[#0D9488]"
                      stroke="#134E4A"
                    />
                  </div>
                  <span className="text-lg font-black text-[#134E4A] dark:text-[var(--text-main,#FFFFFF)]">
                    +{selectedMission.rewardXp}
                  </span>
                  <span className="mt-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#134E4A]/60 dark:text-gray-300">
                    EXP
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <div className="mb-2 flex justify-between text-xs font-extrabold text-[#134E4A] dark:text-[var(--text-main,#FFFFFF)]">
                  <span>Progres misi</span>
                  <span className="tabular-nums">
                    {getMissionCurrentProgress(selectedMission)} /{" "}
                    {selectedMission.target}
                  </span>
                </div>
                <AnimatedProgressBar
                  value={Math.min(
                    100,
                    (getMissionCurrentProgress(selectedMission) /
                      selectedMission.target) *
                      100,
                  )}
                  height="h-3.5"
                  className="overflow-hidden rounded-full border border-[#134E4A]/15"
                  barClassName="bg-[#10B981] dark:bg-[#34D399]"
                />
              </div>
            </div>

            <div className="mt-6">
              {(() => {
                const current = getMissionCurrentProgress(selectedMission);
                const completed = current >= selectedMission.target;
                const claimed = isMissionClaimed(selectedMission.id);

                if (claimed) {
                  return (
                    <button
                      type="button"
                      disabled
                      className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border-2 border-[#134E4A]/15 bg-gray-100 px-4 py-3 text-sm font-black text-[#134E4A]/50 dark:bg-gray-800"
                    >
                      <Check size={18} /> Hadiah diklaim
                    </button>
                  );
                }

                if (completed) {
                  return (
                    <motion.button
                      type="button"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      }}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        claimMission(selectedMission);
                        setRefresh((r) => r + 1);
                        setSelectedMission(null);
                      }}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#134E4A] bg-[#F59E0B] px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0px_#134E4A] transition-all active:shadow-none"
                    >
                      <Sparkles size={18} /> Klaim hadiah!
                    </motion.button>
                  );
                }

                return (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMission(null);
                      if ((selectedMission as any).to) {
                        window.location.href = (selectedMission as any).to;
                      }
                    }}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0px_#134E4A] transition-all active:translate-y-0.5 active:shadow-none"
                  >
                    Kerjakan sekarang
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
