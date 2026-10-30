import { memo, useEffect, useRef } from "react";
import { CrownSvg } from "@/components/ui/CustomIcons";

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  avatarId?: string;
}

const LEADERBOARD_COLORS = {
  1: "bg-[#FFD700] border-[#FFA500]",
  2: "bg-[#C0C0C0] border-[#A9A9A9]",
  3: "bg-[#CD7F32] border-[#B87333]",
  others: "bg-[#F5F5F5] border-[#134E4A]",
};

export interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  open: boolean;
  onClose: () => void;
  autoAdvance?: boolean;
  advanceAfterMs?: number;
}

export default function LeaderboardModal({
  entries,
  open,
  onClose,
  autoAdvance = false,
  advanceAfterMs = 5000,
}: LeaderboardModalProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (open && autoAdvance) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, advanceAfterMs);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, autoAdvance, advanceAfterMs, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl border-[3px] border-[#134E4A] bg-white shadow-[6px_6px_0px_#134E4A] animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <h2 className="font-display text-2xl font-black text-[#134E4A] mb-4">
            Leaderboard Ronde
          </h2>

          <div className="space-y-2 mb-4">
            {entries.map((entry, idx) => {
              const rank = idx + 1;
              const isTop3 = rank <= 3;
              const colors = isTop3
                ? LEADERBOARD_COLORS[rank as 1 | 2 | 3]
                : LEADERBOARD_COLORS.others;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-[2px] ${colors} font-black text-sm text-[#134E4A] shadow-[2px_2px_0px_#134E4A]`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-[2px] border-[#134E4A] font-bold text-lg">
                    {isTop3 ? (
                      <CrownSvg size={18} />
                    ) : (
                      rank
                    )}
                  </div>
                  <span className="flex-1 truncate">{entry.nickname}</span>
                  <span className="font-display text-lg">{entry.score}</span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all"
          >
            Lanjut ke Soal Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}