import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  BookOpen,
  Gamepad,
  Fire,
} from "../../../components/ui/CustomIcons";
import { PetiHartaSvg } from "@/components/ui/Illustrations";
import { useNgajiProgress } from "../pages/games/_shared/progression";

// Helper untuk memilih ikon berdasarkan tipe misi
const getMissionIcon = (id: string) => {
  if (id.includes("game"))
    return <Gamepad size={18} className="text-[#FF6B6B]" />;
  if (id.includes("streak"))
    return <Fire size={18} className="text-[#F59E0B]" />;
  return <BookOpen size={18} className="text-[#0D9488]" />;
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
      <div className="relative overflow-hidden rounded-[24px] border-[3px] border-[#134E4A] bg-[#FFFBEB] p-4 shadow-[5px_5px_0px_#134E4A]">
        {/* Ornamen Background (Peta/Bintang) */}
        <div className="pointer-events-none absolute -right-4 -top-4 opacity-10">
          <Sparkles size={100} />
        </div>

        {/* HEADER */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A]">
              {/* Menggunakan PetiHartaSvg berukuran kecil di header */}
              <PetiHartaSvg size={32} />
            </div>
            <div>
              <h3 className="font-display text-base font-black text-[#134E4A]">
                Papan Misi
              </h3>
              <p className="text-[10px] font-bold text-[#134E4A]/60">
                Selesaikan misi, raih hadiahnya!
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-[#FF6B6B] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
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
                    ? "border-[2px] border-[#134E4A]/20 bg-gray-100 opacity-60 grayscale-[50%]"
                    : completed
                      ? "border-[3px] border-[#134E4A] bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                      : "border-[3px] border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A] hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center justify-between gap-3 w-full">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#134E4A] ${claimed ? "bg-white" : "bg-[#F0FDF4]"}`}
                    >
                      {getMissionIcon(mission.id)}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-display text-xs font-black text-[#134E4A] ${claimed ? "line-through" : ""}`}
                      >
                        {mission.title}
                      </p>
                      <p className="text-[10px] font-bold text-[#134E4A]/60 mt-0.5 truncate">
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
                        className="inline-flex items-center gap-1.5 rounded-lg border-[2px] border-[#134E4A] bg-[#F59E0B] px-2.5 py-1.5 text-[10px] font-black text-white shadow-[2px_2px_0px_#134E4A]"
                      >
                        <Sparkles size={12} /> KLAIM
                      </motion.span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0D9488] bg-[#CCFBF1] px-2 py-1 rounded-lg border-2 border-[#134E4A]">
                        +{mission.rewardCoins} <Coins size={10} />
                      </span>
                    )}
                  </div>
                </div>

                {/* PROGRESS BAR YANG LEBIH GEMUK */}
                <div className="flex items-center gap-2 w-full mt-1">
                  <div className="relative h-3.5 flex-1 overflow-hidden rounded-full border-2 border-[#134E4A] bg-[#F0FDF4]">
                    <div
                      className={`h-full transition-all duration-500 ${
                        completed ? "bg-[#F59E0B]" : "bg-[#0D9488]"
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-[#134E4A] min-w-[28px] text-right">
                    {current}/{mission.target}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* MODAL DETAIL MISI */}
      <AnimatePresence>
        {selectedMission && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMission(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-sm bg-[#FFFBEB] rounded-[32px] border-[4px] border-[#134E4A] shadow-[8px_8px_0px_#134E4A] p-6 pointer-events-auto relative overflow-hidden">
                {/* Ornamen Background Modal */}
                <div className="absolute -top-10 -right-10 opacity-10">
                  <Sparkles size={150} />
                </div>

                <button
                  onClick={() => setSelectedMission(null)}
                  className="absolute right-4 top-4 w-9 h-9 rounded-full border-[3px] border-[#134E4A] bg-white flex items-center justify-center shadow-[2px_2px_0px_#134E4A] active:translate-y-0.5 active:shadow-none z-20"
                >
                  <X size={18} className="text-[#134E4A]" />
                </button>

                <div className="relative z-10 flex flex-col items-center text-center mt-2">
                  {/* Animasi Peti Harta (Menggunakan SVG ukuran 140) */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut",
                    }}
                    className="mb-2 drop-shadow-xl"
                  >
                    <PetiHartaSvg size={140} />
                  </motion.div>

                  <h3 className="font-display text-2xl font-black text-[#134E4A] leading-tight">
                    {selectedMission.title}
                  </h3>
                  <p className="text-xs font-bold text-[#134E4A]/70 mt-2 px-2">
                    {selectedMission.description}
                  </p>

                  {/* Info Hadiah yang Lebih Mencolok */}
                  <div className="mt-5 flex items-center justify-center gap-3 w-full">
                    <div className="flex flex-1 flex-col items-center justify-center bg-white border-[3px] border-[#134E4A] rounded-xl py-3 shadow-[3px_3px_0px_#134E4A]">
                      <Coins size={20} className="text-[#F59E0B] mb-1" />
                      <span className="text-base font-black text-[#134E4A]">
                        +{selectedMission.rewardCoins}
                      </span>
                      <span className="text-[9px] font-bold text-[#134E4A]/60 uppercase tracking-widest mt-0.5">
                        Koin
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center bg-white border-[3px] border-[#134E4A] rounded-xl py-3 shadow-[3px_3px_0px_#134E4A]">
                      <Sparkles size={20} className="text-[#0D9488] mb-1" />
                      <span className="text-base font-black text-[#134E4A]">
                        +{selectedMission.rewardXp}
                      </span>
                      <span className="text-[9px] font-bold text-[#134E4A]/60 uppercase tracking-widest mt-0.5">
                        EXP
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Modal */}
                  <div className="w-full mt-6">
                    <div className="flex justify-between text-[10px] font-black text-[#134E4A] mb-1.5 uppercase tracking-wider">
                      <span>Progres Misi</span>
                      <span>
                        {getMissionCurrentProgress(selectedMission)} /{" "}
                        {selectedMission.target}
                      </span>
                    </div>
                    <div className="w-full bg-white h-4 rounded-full border-[3px] border-[#134E4A] overflow-hidden">
                      <div
                        className="bg-[#0D9488] h-full border-r-[3px] border-[#134E4A] transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (getMissionCurrentProgress(selectedMission) / selectedMission.target) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* TOMBOL AKSI MODAL */}
                <div className="mt-7 relative z-10">
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
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            claimMission(selectedMission);
                            setRefresh((r) => r + 1);
                            setSelectedMission(null);
                          }}
                          className="w-full py-4 rounded-xl border-[3px] border-[#134E4A] bg-[#F59E0B] text-white font-black text-sm shadow-[4px_4px_0px_#134E4A] active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
