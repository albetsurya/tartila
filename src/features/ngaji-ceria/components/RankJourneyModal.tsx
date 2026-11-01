import React from "react";
import { motion } from "framer-motion";
import {
  getRank,
  useNgajiProgress,
  RANKS,
} from "../pages/games/_shared/progression";
import { AppModal } from "@/components/ui/AppModal";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { CheckSvg, LockSvg, SparklesSvg } from "@/components/ui/CustomIcons";
import RankBadgeSvg from "@/components/ui/RankBadgeSvg";

interface RankJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: "modal" | "sheet";
}

function formatXp(xp: number): string {
  return `${xp.toLocaleString("id-ID")} XP`;
}

export function RankJourneyModal({
  isOpen,
  onClose,
  variant = "sheet",
}: RankJourneyModalProps) {
  const progress = useNgajiProgress();
  const rank = getRank(progress.xp);
  const currentXp = progress.xp;
  const currentRankIndex = RANKS.findIndex((item) => item.id === rank.id);
  const activeIndex = currentRankIndex >= 0 ? currentRankIndex : 0;
  const currentRank = RANKS[activeIndex];
  const nextRank = RANKS[activeIndex + 1] ?? null;
  const nextXp = rank.nextXp ?? nextRank?.minXp ?? currentXp;
  const diffToNext = Math.max(0, (nextRank?.minXp ?? nextXp) - currentXp);

  const progressPct =
    nextXp > currentRank.minXp
      ? Math.min(
          100,
          Math.max(0, ((currentXp - currentRank.minXp) / (nextXp - currentRank.minXp)) * 100),
        )
      : 100;

  const unlockedCount = RANKS.filter((item) => currentXp >= item.minXp).length;
  const isMaxRank = !nextRank;
  const isSheet = variant === "sheet";
  const SheetWrapper = isSheet ? AppBottomSheet : AppModal;

  return (
    <SheetWrapper isOpen={isOpen} onClose={onClose} title="Peta Kejayaan">
      <div className="relative isolate overflow-hidden bg-[#F0FDF4] px-3 pb-4 pt-3 text-[#134E4A] sm:px-4 sm:pt-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "radial-gradient(#134E4A 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 space-y-4">
          <section className="overflow-hidden rounded-[22px] border-[3px] border-[#092F2C] bg-[#134E4A] p-3.5 text-white shadow-[4px_4px_0px_#0D9488] sm:p-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.4,
                  ease: "easeInOut",
                }}
                className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#092F2C] bg-[#FEF08A] shadow-[3px_3px_0px_#092F2C] sm:h-[76px] sm:w-[76px]"
              >
                <RankBadgeSvg
                  rankId={currentRank.id as any}
                  size={58}
                  isLocked={false}
                  isActive
                />
              </motion.div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-[#FEF08A] sm:text-xs">
                  <SparklesSvg size={14} />
                  Rank kamu sekarang
                </div>
                <h3 className="break-words font-display text-xl font-black leading-tight text-white sm:text-2xl">
                  {currentRank.title}
                </h3>
                <p className="mt-1 text-[11px] font-semibold text-white/70 sm:text-xs">
                  {unlockedCount} dari {RANKS.length} rank sudah terbuka
                </p>
              </div>

              <div className="shrink-0 rounded-xl border-2 border-[#092F2C] bg-[#FEF08A] px-2.5 py-2 text-center text-[#134E4A] shadow-[2px_2px_0px_#092F2C] sm:px-3">
                <span className="block text-[9px] font-black uppercase tracking-wider">
                  Total
                </span>
                <span className="block text-lg font-black leading-none tabular-nums sm:text-xl">
                  {currentXp.toLocaleString("id-ID")}
                </span>
                <span className="text-[9px] font-black">XP</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-extrabold sm:text-xs">
                <span className="text-white/75">Perjalanan rank</span>
                <span className="rounded-md bg-white px-2 py-1 text-[#134E4A]">
                  {Math.round(progressPct)}%
                </span>
              </div>
              <div
                className="h-3.5 overflow-hidden rounded-full border-2 border-[#092F2C] bg-white/25 shadow-inner"
                role="progressbar"
                aria-label="Progres menuju rank berikutnya"
                aria-valuenow={Math.round(progressPct)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.85, type: "spring" }}
                  className="h-full rounded-r-full border-r-2 border-[#092F2C] bg-gradient-to-r from-[#FDE047] to-[#FB923C]"
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[10px] font-bold text-white/75 sm:text-xs">
                <span>{formatXp(rank.minXp)} awal level</span>
                <span>
                  {isMaxRank ? "Rank tertinggi!" : `${formatXp(nextXp)} target`}
                </span>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-bold leading-relaxed text-white sm:text-xs">
              {isMaxRank ? (
                "Luar biasa! Kamu sudah mencapai rank tertinggi. Terus mengaji dan jadilah inspirasi!"
              ) : (
                <>
                  Tinggal{" "}
                  <span className="rounded bg-[#FEF08A] px-1.5 py-0.5 font-black text-[#134E4A]">
                    {formatXp(diffToNext)}
                  </span>{" "}
                  lagi untuk membuka{" "}
                  <span className="font-black text-[#FEF08A]">
                    {nextRank.title}
                  </span>
                  ! Semangat, kamu pasti bisa!
                </>
              )}
            </div>
          </section>

          <section aria-labelledby="rank-roadmap-title">
            <div className="mb-2 flex items-end justify-between gap-2 px-0.5">
              <div>
                <h4
                  id="rank-roadmap-title"
                  className="font-display text-base font-black text-[#134E4A] sm:text-lg"
                >
                  Tangga Kejayaan
                </h4>
                <p className="text-[11px] font-semibold text-[#134E4A]/65 sm:text-xs">
                  Kumpulkan XP untuk membuka rank baru.
                </p>
              </div>
              <span className="shrink-0 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-1 text-[10px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] sm:text-xs">
                {unlockedCount}/{RANKS.length} TERBUKA
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {RANKS.map((item, index) => {
                const isUnlocked = currentXp >= item.minXp;
                const isCurrent = index === activeIndex;
                const isNext = index === activeIndex + 1;
                const isLocked = !isUnlocked;

                const cardStyle = isCurrent
                  ? "border-[#134E4A] bg-[#FEF08A] text-[#78350F] shadow-[3px_3px_0px_#D97706]"
                  : isUnlocked
                    ? `border-[#134E4A]/70 ${item.color} ${item.text} shadow-[2px_2px_0px_#134E4A]`
                    : isNext
                      ? "border-[#0D9488] border-dashed bg-[#CCFBF1] text-[#134E4A] shadow-[2px_2px_0px_#0D9488]"
                      : "border-[#134E4A]/20 border-dashed bg-white/80 text-[#64748B]";

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(index * 0.035, 0.25),
                    }}
                    whileHover={isUnlocked ? { y: -2 } : undefined}
                    className={`relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-2xl border-[2.5px] p-2.5 transition-colors sm:min-h-[142px] sm:p-3 ${cardStyle}`}
                  >
                    {isCurrent && (
                      <div
                        className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[#F59E0B]/20"
                        aria-hidden="true"
                      />
                    )}

                    <div className="relative z-10 flex items-start justify-between gap-1.5">
                      <motion.div
                        animate={
                          isCurrent ? { rotate: [0, -4, 4, 0] } : undefined
                        }
                        transition={
                          isCurrent
                            ? {
                                repeat: Infinity,
                                duration: 3.2,
                                ease: "easeInOut",
                              }
                            : undefined
                        }
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 ${
                          isCurrent
                            ? "border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A]"
                            : isUnlocked
                              ? "border-[#134E4A]/20 bg-white/80"
                              : "border-[#94A3B8]/40 bg-slate-100"
                        }`}
                      >
                        <RankBadgeSvg
                          rankId={item.id as any}
                          size={40}
                          isLocked={isLocked}
                          isActive={isCurrent}
                        />
                      </motion.div>

                      <span
                        className={`inline-flex max-w-[76px] items-center justify-center gap-0.5 rounded-md border px-1.5 py-1 text-center text-[8px] font-black leading-tight sm:max-w-none sm:text-[9px] ${
                          isCurrent
                            ? "border-[#134E4A] bg-[#FF6B6B] text-white"
                            : isUnlocked
                              ? "border-[#134E4A]/20 bg-white/75 text-[#0F766E]"
                              : isNext
                                ? "border-[#0D9488] bg-white text-[#0F766E]"
                                : "border-slate-300 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <SparklesSvg size={10} /> KAMU DI SINI
                          </>
                        ) : isUnlocked ? (
                          <>
                            <CheckSvg size={10} /> TERBUKA
                          </>
                        ) : isNext ? (
                          <>
                            <SparklesSvg size={10} /> TARGET
                          </>
                        ) : (
                          <>
                            <LockSvg size={10} /> TERKUNCI
                          </>
                        )}
                      </span>
                    </div>

                    <div className="relative z-10 mt-2 min-w-0">
                      <p className="break-words font-display text-[11px] font-black leading-tight sm:text-xs">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[10px] font-extrabold opacity-75 sm:text-[11px]">
                        {formatXp(item.minXp)}
                      </p>
                    </div>

                    {isCurrent ? (
                      <div className="relative z-10 mt-2 rounded-lg border border-[#134E4A]/20 bg-white/70 px-2 py-1 text-[9px] font-black text-[#78350F] sm:text-[10px]">
                        Rank aktifmu
                      </div>
                    ) : isNext ? (
                      <div className="relative z-10 mt-2 rounded-lg border border-[#0D9488]/30 bg-white px-2 py-1 text-[9px] font-black text-[#0F766E] sm:text-[10px]">
                        Butuh {formatXp(Math.max(0, item.minXp - currentXp))}
                      </div>
                    ) : isUnlocked ? (
                      <div className="relative z-10 mt-2 rounded-lg border border-[#134E4A]/10 bg-white/60 px-2 py-1 text-[9px] font-bold opacity-75 sm:text-[10px]">
                        Hebat, sudah dicapai!
                      </div>
                    ) : (
                      <div className="relative z-10 mt-2 h-[22px] rounded-lg border border-slate-300/70 bg-slate-100/70" />
                    )}
                  </motion.article>
                );
              })}
            </div>
          </section>

          <div className="rounded-xl border-2 border-[#134E4A]/15 bg-white/85 px-3 py-2.5 text-center text-[10px] font-semibold leading-relaxed text-[#134E4A]/70 sm:text-xs">
            Setiap latihan dan aktivitas mengajimu membantu mengumpulkan XP.
            Terus belajar, rayakan setiap kemajuan, dan naik ke rank berikutnya!
          </div>
        </div>
      </div>
    </SheetWrapper>
  );
}

export default RankJourneyModal;
