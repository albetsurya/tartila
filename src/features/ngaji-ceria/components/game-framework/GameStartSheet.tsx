import React, { useState } from "react";
import { LockSvg, PlaySvg, TrophySvg } from "@/components/ui/CustomIcons";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";

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
    <AppBottomSheet
      isOpen={isOpen}
      onClose={onClose ?? (() => {})}
      title={gameTitle}
    >
      <div className="text-center">
        <span className="inline-block rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1 text-xs font-black uppercase tracking-widest text-[#7C2D12] shadow-[2px_2px_0px_#134E4A]">
          Pilih Tantangan
        </span>
        {gameSubtitle && (
          <p className="mt-1 text-xs font-bold text-[#134E4A]/70">
            {gameSubtitle}
          </p>
        )}
      </div>

      {ruleDescription && (
        <div className="mt-4 rounded-2xl border-2 border-[#134E4A] bg-[#E0F2FE] p-3.5 text-left shadow-[3px_3px_0px_#134E4A]">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#0369A1]">
            <TrophySvg size={16} />
            <span>Aturan Game</span>
          </div>
          <p className="mt-1 text-xs font-medium leading-relaxed text-[#134E4A]">
            {ruleDescription}
          </p>
        </div>
      )}

      <p className="mb-2.5 mt-5 text-left text-xs font-black uppercase tracking-wider text-[#134E4A]">
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

      <button
        type="button"
        onClick={handleStartGame}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] py-3.5 text-base font-black text-white shadow-[4px_4px_0px_#134E4A] hover:bg-[#0F766E] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
      >
        <PlaySvg size={20} />
        <span>Mulai Main (Level {activeLevel})</span>
      </button>
    </AppBottomSheet>
  );
};
