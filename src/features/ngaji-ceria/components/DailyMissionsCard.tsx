import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
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
} from "../../../components/ui/CustomIcons";
import { useNgajiProgress } from "../pages/games/_shared/progression";

export function DailyMissionsCard() {
  const [, setRefresh] = useState(0);
  useNgajiProgress();

  // State untuk menyimpan misi yang sedang dipilih
  const [selectedMission, setSelectedMission] = useState<
    (typeof DAILY_MISSIONS)[0] | null
  >(null);

  return (
    <>
      <div className="rounded-[24px] border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={NGAJI_CERIA_ASSETS.petiHarta}
              alt=""
              className="h-6 w-6 object-contain"
            />
            <h3 className="font-display text-sm font-black text-[#134E4A]">
              Misi Harian
            </h3>
          </div>
          <span className="rounded-lg bg-[#FFF0F0] px-2.5 py-0.5 text-[10px] font-black text-[#FF6B6B] border-2 border-[#134E4A]">
            Reset Tiap Hari
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          {DAILY_MISSIONS.map((mission) => {
            const current = getMissionCurrentProgress(mission);
            const completed = current >= mission.target;
            const claimed = isMissionClaimed(mission.id);

            return (
              <button
                key={mission.id}
                onClick={() => setSelectedMission(mission)}
                className={`w-full flex items-center justify-between gap-3 rounded-2xl p-3 transition-all text-left active:scale-[0.98] ${
                  claimed
                    ? "border-[2px] border-[#134E4A]/30 bg-[#F0FDF4] opacity-60"
                    : completed
                      ? "border-[3px] border-[#134E4A] bg-[#FEF3C7] shadow-[3px_3px_0px_#134E4A]"
                      : "border-[2px] border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A]"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xs font-black text-[#134E4A]">
                    {mission.title}
                  </p>
                  <p className="text-[11px] font-medium text-[#134E4A]/70 mt-0.5 line-clamp-1">
                    {mission.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full border border-[#134E4A] bg-[#F0FDF4]">
                      <div
                        className="h-full bg-[#0D9488] transition-all"
                        style={{
                          width: `${Math.min(100, (current / mission.target) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-[#134E4A]">
                      {current}/{mission.target}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {claimed ? (
                    <span className="inline-flex items-center gap-1 rounded-xl bg-[#0D9488]/20 px-2.5 py-1 text-[10px] font-black text-[#0D9488] border border-[#0D9488]">
                      <Check size={11} /> Selesai
                    </span>
                  ) : completed ? (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border-[2px] border-[#134E4A] bg-[#0D9488] px-3 py-1.5 text-[11px] font-black text-white shadow-[2px_2px_0px_#134E4A]">
                      <Sparkles size={11} />
                      <span>Klaim</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#0D9488] bg-[#F0FDF4] px-2 py-1 rounded-lg border border-[#0D9488]/30">
                      <span>+{mission.rewardCoins}</span>
                      <Coins size={10} className="text-[#0D9488]" />
                    </span>
                  )}
                </div>
              </button>
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
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-sm bg-[#F0FDF4] rounded-[28px] border-[3px] border-[#134E4A] shadow-[6px_6px_0px_#134E4A] p-5 pointer-events-auto relative">
                <button
                  onClick={() => setSelectedMission(null)}
                  className="absolute right-4 top-4 w-8 h-8 rounded-full border-2 border-[#134E4A] bg-white flex items-center justify-center shadow-[2px_2px_0px_#134E4A] active:translate-y-0.5 z-10"
                >
                  <X size={16} className="text-[#134E4A]" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                  <div className="w-20 h-20 rounded-2xl bg-[#FEF3C7] border-[3px] border-[#134E4A] flex items-center justify-center mb-4 shadow-[3px_3px_0px_#134E4A]">
                    <img
                      src={NGAJI_CERIA_ASSETS.petiHarta}
                      alt={selectedMission.title}
                      className="w-12 h-12 object-contain"
                    />
                  </div>

                  <h3 className="font-display text-xl font-black text-[#134E4A]">
                    {selectedMission.title}
                  </h3>
                  <p className="text-xs font-bold text-[#134E4A]/60 mt-1 px-4">
                    {selectedMission.description}
                  </p>

                  {/* Info Hadiah */}
                  <div className="mt-4 flex items-center justify-center gap-3 bg-white border-2 border-[#134E4A]/20 rounded-xl px-4 py-2 w-full">
                    <div className="flex items-center gap-1">
                      <Coins size={14} className="text-[#F59E0B]" />
                      <span className="text-sm font-black text-[#F59E0B]">
                        +{selectedMission.rewardCoins}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-[#134E4A]/20" />
                    <div className="flex items-center gap-1">
                      <Sparkles size={14} className="text-[#0D9488]" />
                      <span className="text-sm font-black text-[#0D9488]">
                        +{selectedMission.rewardXp} XP
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full mt-5">
                    <div className="flex justify-between text-[10px] font-black text-[#134E4A]/70 mb-1">
                      <span>Progres Misi</span>
                      <span>
                        {getMissionCurrentProgress(selectedMission)} /{" "}
                        {selectedMission.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full border-2 border-[#134E4A] overflow-hidden">
                      <div
                        className="bg-[#0D9488] h-full border-r-2 border-[#134E4A]"
                        style={{
                          width: `${Math.min(100, (getMissionCurrentProgress(selectedMission) / selectedMission.target) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-6">
                  {(() => {
                    const current = getMissionCurrentProgress(selectedMission);
                    const completed = current >= selectedMission.target;
                    const claimed = isMissionClaimed(selectedMission.id);

                    if (claimed) {
                      return (
                        <button
                          disabled
                          className="w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-gray-200 text-[#134E4A]/50 font-black text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          <Check size={16} /> Hadiah Sudah Diklaim
                        </button>
                      );
                    }

                    if (completed) {
                      return (
                        <button
                          onClick={() => {
                            claimMission(selectedMission);
                            setRefresh((r) => r + 1);
                            setSelectedMission(null);
                          }}
                          className="w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[4px_4px_0px_#134E4A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                          <Sparkles size={16} /> Klaim Hadiah
                        </button>
                      );
                    }

                    return (
                      <button
                        onClick={() => {
                          setSelectedMission(null);
                          // Arahkan ke halaman terkait misi jika ada properti to/url
                          if ((selectedMission as any).to) {
                            window.location.href = (selectedMission as any).to;
                          }
                        }}
                        className="w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-black text-sm shadow-[4px_4px_0px_#134E4A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
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
