import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LockSvg, PlaySvg, XSvg, StarSvg, TrophySvg } from "@/components/ui/CustomIcons";

export interface GameLevelItem {
  level: number;
  title?: string;
  description?: string;
  target?: string | number;
  durationSeconds?: number;
}

export interface GameStartSheetProps {
  isOpen: boolean;
  gameTitle: string;
  gameSubtitle?: string;
  ruleDescription?: string;
  levels?: (GameLevelItem | number)[];
  unlockedLevels?: number; // Level tertinggi yang terbuka (default: 1)
  selectedLevel?: number;
  onSelectLevel?: (level: number) => void;
  onStart: (level: number) => void;
  onClose?: () => void;
}

export const GameStartSheet: React.FC<GameStartSheetProps> = ({
  isOpen,
  gameTitle,
  gameSubtitle,
  ruleDescription = "Kumpulkan skor sebanyak mungkin sebelum waktu habis! Hindari kesalahan agar nyawamu tidak berkurang.",
  levels = [1, 2, 3, 4, 5],
  unlockedLevels = 1,
  selectedLevel: controlledLevel,
  onSelectLevel,
  onStart,
  onClose,
}) => {
  const [internalLevel, setInternalLevel] = useState<number>(1);
  const activeLevel = controlledLevel !== undefined ? controlledLevel : internalLevel;

  const normalizedLevels: GameLevelItem[] = levels.map((lvl) => {
    if (typeof lvl === "number") {
      return {
        level: lvl,
        title: `Level ${lvl}`,
        description: `Tantangan tingkat ${lvl}`,
      };
    }
    return {
      title: `Level ${lvl.level}`,
      ...lvl,
    };
  });

  const handleSelect = (levelNumber: number) => {
    if (levelNumber > unlockedLevels) return;
    if (onSelectLevel) {
      onSelectLevel(levelNumber);
    } else {
      setInternalLevel(levelNumber);
    }
  };

  const handleStartGame = () => {
    onStart(activeLevel);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop gelap transparan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Sheet Kontainer */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] border-[4px] border-[#134E4A] bg-[#FFFDF0] p-6 text-center shadow-[6px_6px_0px_#134E4A] max-h-[90vh] overflow-y-auto"
          >
            {/* Tombol Tutup (jika ada handler onClose) */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                aria-label="Tutup"
              >
                <XSvg size={18} />
              </button>
            )}

            {/* Handle Bar untuk Mobile Drag Feel */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#134E4A]/20 sm:hidden" />

            {/* Header Game */}
            <div className="mb-4">
              <span className="inline-block rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1 text-xs font-black uppercase tracking-widest text-[#7C2D12] shadow-[2px_2px_0px_#134E4A]">
                Pilih Tantangan
              </span>
              <h2 className="mt-2 font-display text-2xl font-black text-[#134E4A] sm:text-3xl">
                {gameTitle}
              </h2>
              {gameSubtitle && (
                <p className="mt-0.5 text-xs font-bold text-[#134E4A]/70">
                  {gameSubtitle}
                </p>
              )}
            </div>

            {/* Kotak Aturan Singkat */}
            {ruleDescription && (
              <div className="mb-5 rounded-2xl border-2 border-[#134E4A] bg-[#E0F2FE] p-3.5 text-left shadow-[3px_3px_0px_#134E4A]">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#0369A1]">
                  <TrophySvg size={16} />
                  <span>Aturan Game</span>
                </div>
                <p className="mt-1 text-xs font-medium leading-relaxed text-[#134E4A]">
                  {ruleDescription}
                </p>
              </div>
            )}

            {/* Daftar Pilihan Level */}
            <div className="mb-6">
              <p className="mb-2.5 text-left text-xs font-black uppercase tracking-wider text-[#134E4A]">
                Tingkat Kesulitan:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {normalizedLevels.map((lvl) => {
                  const isUnlocked = lvl.level <= unlockedLevels;
                  const isSelected = lvl.level === activeLevel;

                  return (
                    <button
                      key={lvl.level}
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => handleSelect(lvl.level)}
                      className={`relative flex items-center gap-3 rounded-2xl border-[3px] border-[#134E4A] p-3 text-left transition-all ${
                        !isUnlocked
                          ? "bg-gray-100 opacity-60 cursor-not-allowed shadow-[1px_1px_0px_#134E4A]"
                          : isSelected
                            ? "bg-[#FEF08A] shadow-[4px_4px_0px_#134E4A] scale-[1.02] cursor-pointer"
                            : "bg-white hover:bg-[#F0FDF4] shadow-[2px_2px_0px_#134E4A] cursor-pointer"
                      }`}
                    >
                      {/* Nomor / Ikon Level */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] font-black ${
                          !isUnlocked
                            ? "bg-gray-200 text-gray-500"
                            : isSelected
                              ? "bg-[#0D9488] text-white"
                              : "bg-[#DCFCE7] text-[#134E4A]"
                        }`}
                      >
                        {!isUnlocked ? (
                          <LockSvg size={18} />
                        ) : (
                          <span className="text-sm">{lvl.level}</span>
                        )}
                      </div>

                      {/* Detail Level */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-[#134E4A] truncate">
                            {lvl.title}
                          </p>
                          {isSelected && isUnlocked && (
                            <span className="rounded-md border border-[#134E4A] bg-[#16A34A] px-1.5 py-0.2 text-[9px] font-black text-white">
                              Dipilih
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-[#134E4A]/70 truncate">
                          {lvl.target
                            ? `Target: ${lvl.target}`
                            : lvl.description}
                        </p>
                        {lvl.durationSeconds && (
                          <p className="text-[10px] font-bold text-[#0D9488]">
                            Waktu: {lvl.durationSeconds} detik
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tombol Mulai Bermain */}
            <button
              type="button"
              onClick={handleStartGame}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] py-3.5 text-base font-black text-white shadow-[4px_4px_0px_#134E4A] hover:bg-[#0F766E] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <PlaySvg size={20} />
              <span>Mulai Main (Level {activeLevel})</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
