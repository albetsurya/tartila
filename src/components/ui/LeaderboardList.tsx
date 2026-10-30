import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrophySvg,
  MedalSvg,
  UserSvg,
  CrownSvg,
} from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";
import { getLeaderboard } from "@/features/ngaji-ceria/pages/games/_shared/progression";
import { getBest } from "@/features/ngaji-ceria/pages/games/_shared/storage";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animationVariants";

export interface LeaderboardListProps {
  gameId?: string;
  title?: string;
  period?: "daily" | "weekly" | "all";
  className?: string;
}

interface PlayerEntry {
  id: string;
  name: string;
  score: number;
  isUser: boolean;
  avatarBg: string;
}

export function LeaderboardList({
  gameId,
  title,
  period = "weekly",
  className = "",
}: LeaderboardListProps) {
  const { user } = useAuth();
  const userName = user?.name || user?.username || "Kamu";

  const userScore = useMemo(() => {
    if (!gameId) return 0;
    const local = getLeaderboard(gameId).find(
      (e) => e.name === "Kamu" || e.name === userName,
    )?.score;
    const best = getBest(gameId);
    return Math.max(local || 0, best || 0);
  }, [gameId, userName]);

  const { top10, userRank } = useMemo(() => {
    if (!gameId || gameId.trim() === "") {
      return { top10: [], userRank: 0 };
    }

    const realEntries = getLeaderboard(gameId);
    const allPlayers = realEntries.map((p) => ({
      name: p.name,
      score: p.score,
      avatarBg: "bg-[#9CA3AF]",
    }));

    if (userScore > 0) {
      allPlayers.push({
        name: `${userName} (Kamu)`,
        score: userScore,
        avatarBg: "bg-[#2DD4BF]",
      });
    }

    allPlayers.sort((a, b) => b.score - a.score);

    let rank = 0;
    if (userScore > 0) {
      const idx = allPlayers.findIndex((p) => p.name === `${userName} (Kamu)`);
      rank = idx !== -1 ? idx + 1 : 42;
    } else {
      rank = 42;
    }

    return {
      top10: allPlayers.slice(0, 10).map((p, idx) => ({
        id: `${gameId}:${idx}:${p.name}`,
        name: p.name,
        score: p.score,
        isUser: false,
        avatarBg: p.avatarBg,
      })),
      userRank: rank,
    };
  }, [gameId, userName, userScore]);

  if (!gameId || gameId.trim() === "") {
    return (
      <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-8 text-center shadow-[4px_4px_0px_#134E4A] ${className}">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A]">
          <TrophySvg size={32} className="text-[#B45309]" />
        </div>
        <h3 className="font-display text-lg font-black text-[#134E4A]">
          Jadilah yang pertama!
        </h3>
        <p className="mx-auto mt-1 max-w-xs text-xs font-semibold leading-relaxed text-[#134E4A]/70">
          Belum ada santri yang mencatat skor. Mulai bermain dan rebut takhta juara!
        </p>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] shadow-[4px_4px_0px_#134E4A] overflow-hidden ${className}`}>
      <div className="border-b-[3px] border-[#134E4A] bg-[#CCFBF1] px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0F766E]">
            Top 10 Santri Berbakat
          </span>
          <h3 className="font-display text-sm font-black text-[#134E4A]">
            {title || `Papan Skor: ${gameId}`}
          </h3>
        </div>
        <span className="rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[10px] font-black text-[#7C2D12]">
          {period === "daily" ? "Harian" : period === "weekly" ? "Pekan Ini" : "Semua Waktu"}
        </span>
      </div>

      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="divide-y-2 divide-[#134E4A]/10 p-2 sm:p-3 overflow-y-auto max-h-[380px]"
      >
        {top10.map((player, index) => {
          const rank = index + 1;
          const isRank1 = rank === 1;
          const isRank2 = rank === 2;
          const isRank3 = rank === 3;

          let rankBadgeClass =
            "border-2 border-[#134E4A] bg-[#FFFFFF] text-[#134E4A] shadow-[1px_1px_0px_#134E4A]";
          let rowHighlight = "hover:bg-[#F3F4F6]";

          if (isRank1) {
            rankBadgeClass =
              "border-2 border-[#854D0E] bg-[#FEF08A] text-[#854D0E] shadow-[2px_2px_0px_#854D0E]";
            rowHighlight = "bg-[#FEFCE8] hover:bg-[#FEF9C3]";
          } else if (isRank2) {
            rankBadgeClass =
              "border-2 border-[#475569] bg-[#F1F5F9] text-[#475569] shadow-[2px_2px_0px_#475569]";
            rowHighlight = "bg-[#F8FAFC] hover:bg-[#F1F5F9]";
          } else if (isRank3) {
            rankBadgeClass =
              "border-2 border-[#9A3412] bg-[#FFEDD5] text-[#9A3412] shadow-[2px_2px_0px_#9A3412]";
            rowHighlight = "bg-[#FFF7ED] hover:bg-[#FFEDD5]";
          }

          return (
            <motion.div
              key={player.id}
              variants={staggerItemVariants}
              className={`flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors ${rowHighlight}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-black text-xs ${rankBadgeClass}`}
                >
                  {isRank1 ? (
                    <CrownSvg size={16} className="text-[#B45309]" />
                  ) : isRank2 ? (
                    <MedalSvg size={16} className="text-[#475569]" />
                  ) : isRank3 ? (
                    <MedalSvg size={16} className="text-[#C2410C]" />
                  ) : (
                    `#${rank}`
                  )}
                </div>

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] font-black text-xs text-[#134E4A] shadow-[1px_1px_0px_#134E4A] ${player.avatarBg}`}
                >
                  {player.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-[#134E4A]">
                    {player.name}
                  </p>
                  <p className="text-[10px] font-semibold text-[#134E4A]/60">
                    {isRank1
                      ? "Peringkat 1 (Emas)"
                      : isRank2
                      ? "Peringkat 2 (Perak)"
                      : isRank3
                      ? "Peringkat 3 (Perunggu)"
                      : `Peringkat #${rank}`}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="font-mono text-sm font-black text-[#134E4A]">
                  {player.score.toLocaleString("id-ID")}
                </span>
                <span className="ml-1 text-[10px] font-extrabold text-[#0D9488]">
                  pts
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="sticky bottom-0 z-10 border-t-[3px] border-[#134E4A] bg-[#FEF08A] p-3 shadow-[0px_-2px_0px_#134E4A]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FFFFFF] font-black text-xs text-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
              #{userRank}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-[#134E4A]">
                Peringkatmu: #{userRank}
              </p>
              <p className="truncate text-[10px] font-bold text-[#134E4A]/70">
                {userScore > 0
                  ? `${userName} · Skor Aktif`
                  : "Belum mencetak skor di game ini"}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="font-mono text-base font-black text-[#134E4A]">
              {userScore > 0 ? userScore.toLocaleString("id-ID") : 0}
            </span>
            <span className="ml-1 text-[10px] font-black text-[#7C2D12]">
              XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
