import { useEffect, useRef } from "react";
import { CrownSvg } from "@/components/ui/CustomIcons";

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  avatarId?: string;
  rank?: number;
  playerId?: string;
}

const LEADERBOARD_COLORS = {
  1: "bg-[#FEF08A] border-[#F59E0B]",
  2: "bg-[#BAE6FD] border-[#0284C7]",
  3: "bg-[#FED7AA] border-[#EA580C]",
  others: "bg-[#F0FDF4] border-[#134E4A]",
};

export interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  open: boolean;
  onClose?: () => void;
  autoAdvance?: boolean;
  advanceAfterMs?: number;
  isHost?: boolean;
  onNext?: () => void;
  nextButtonText?: string;
  subtitle?: string;
  currentPlayerId?: string;
  currentNickname?: string;
}

export default function LeaderboardModal({
  entries,
  open,
  onClose,
  autoAdvance = false,
  advanceAfterMs = 5000,
  isHost = false,
  onNext,
  nextButtonText = "Lanjut ke Soal Berikutnya",
  subtitle = "Menunggu host memulai soal berikutnya...",
  currentPlayerId,
  currentNickname,
}: LeaderboardModalProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (open && autoAdvance) {
      timerRef.current = setTimeout(() => {
        if (onNext) {
          onNext();
        } else if (onClose) {
          onClose();
        }
      }, advanceAfterMs);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, autoAdvance, advanceAfterMs, onClose, onNext]);

  if (!open) return null;

  const handleNextClick = () => {
    if (onNext) {
      onNext();
    } else if (onClose) {
      onClose();
    }
  };

  // Identifikasi posisi santri saat ini
  const myEntry = entries.find(
    (e) =>
      (currentPlayerId &&
        (e.id === currentPlayerId || e.playerId === currentPlayerId)) ||
      (currentNickname &&
        e.nickname.trim().toLowerCase() === currentNickname.trim().toLowerCase()),
  );
  const myRank = myEntry?.rank ?? (myEntry ? entries.indexOf(myEntry) + 1 : null);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-md rounded-3xl border-[4px] border-[#134E4A] bg-white shadow-[8px_8px_0px_#134E4A] animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-5 sm:p-6 text-center space-y-3.5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0D9488] block">
              Papan Skor Sementara
            </span>
            <h2 className="font-display text-2xl font-black text-[#134E4A]">
              Klasemen Santri
            </h2>
          </div>

          {/* Banner Peringkat Khusus Santri (Membuat Lebih Kompetitif) */}
          {!isHost && myEntry && (
            <div className="p-3 rounded-2xl border-[2.5px] border-[#134E4A] bg-[#CCFBF1] text-[#134E4A] shadow-[3px_3px_0px_#134E4A] flex items-center justify-between animate-in zoom-in-95">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0D9488] text-white border-2 border-[#134E4A] flex items-center justify-center font-display text-base font-black shadow-[1.5px_1.5px_0px_#134E4A] shrink-0">
                  #{myRank}
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0F766E] block leading-tight">
                    Posisi Kamu
                  </span>
                  <span className="font-black text-sm text-[#134E4A] leading-tight block truncate max-w-[170px]">
                    {myEntry.nickname}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block leading-tight">
                  Total Skor
                </span>
                <span className="font-display text-base font-black text-[#0D9488] leading-tight">
                  {myEntry.score} pts
                </span>
              </div>
            </div>
          )}

          {/* Daftar Ranking Santri */}
          <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
            {entries.length === 0 ? (
              <div className="py-8 px-4 rounded-2xl border-2 border-dashed border-[#134E4A]/30 bg-[#F0FDF4] text-center">
                <p className="font-display text-sm font-black text-[#134E4A]">
                  Belum ada poin yang dicatat
                </p>
                <p className="text-xs font-bold text-[#134E4A]/70 mt-1">
                  Skor santri akan muncul di sini.
                </p>
              </div>
            ) : (
              entries.map((entry, idx) => {
                const rank = entry.rank || idx + 1;
                const isTop3 = rank <= 3;
                const isMe =
                  myEntry &&
                  (entry.id === myEntry.id ||
                    entry.nickname.trim().toLowerCase() ===
                      myEntry.nickname.trim().toLowerCase());
                const colors = isMe
                  ? "bg-[#CCFBF1] border-[#0D9488] ring-3 ring-[#0D9488]"
                  : isTop3
                    ? LEADERBOARD_COLORS[rank as 1 | 2 | 3]
                    : LEADERBOARD_COLORS.others;

                return (
                  <div
                    key={entry.id || entry.playerId || idx}
                    className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 border-[2.5px] ${colors} font-black text-sm text-[#134E4A] shadow-[2.5px_2.5px_0px_#134E4A] transition-all`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border-2 border-[#134E4A] font-black text-sm shadow-[1.5px_1.5px_0px_#134E4A] shrink-0">
                      {isTop3 ? (
                        <CrownSvg size={16} />
                      ) : (
                        `#${rank}`
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0 flex items-center gap-1.5">
                      <span className="truncate font-black text-sm">
                        {entry.nickname}
                      </span>
                      {isMe && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#0D9488] text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                          Kamu
                        </span>
                      )}
                    </div>

                    <span className="font-display text-base font-black text-[#0D9488] shrink-0">
                      {entry.score} pts
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {isHost ? (
            <button
              type="button"
              onClick={handleNextClick}
              className="w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-sm shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              {nextButtonText}
            </button>
          ) : (
            <div className="py-3 px-4 rounded-2xl border-[2.5px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] flex items-center justify-center gap-2.5 shadow-[3px_3px_0px_#134E4A]">
              <div className="w-4 h-4 border-2 border-[#134E4A] border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="font-black text-xs sm:text-sm">
                {subtitle}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
