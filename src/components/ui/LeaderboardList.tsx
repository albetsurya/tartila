import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrophySvg,
  MedalSvg,
  StarSvg,
  SparklesSvg,
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

/* ============================================================================
 * MOCK DATA BERVARIASI PER GAME
 * ============================================================================ */

const MOCK_LEADERBOARDS: Record<
  string,
  Array<{ name: string; score: number; avatarBg: string }>
> = {
  "ayat-hunter": [
    { name: "Ahmad Fauzi", score: 980, avatarBg: "bg-[#FEF08A]" },
    { name: "Siti Aisyah", score: 940, avatarBg: "bg-[#FCE7F3]" },
    { name: "Farhan Al-Ghifari", score: 890, avatarBg: "bg-[#CCFBF1]" },
    { name: "Rayhan Pratama", score: 850, avatarBg: "bg-[#E0F2FE]" },
    { name: "Zaskia Nur", score: 810, avatarBg: "bg-[#FED7AA]" },
    { name: "Dimas Arya", score: 770, avatarBg: "bg-[#DDD6FE]" },
    { name: "Nabila Zahra", score: 730, avatarBg: "bg-[#DCFCE7]" },
    { name: "Bilal Ramadhan", score: 690, avatarBg: "bg-[#FEF9C3]" },
    { name: "Hanif Robbani", score: 640, avatarBg: "bg-[#E0E7FF]" },
    { name: "Khadijah Putri", score: 600, avatarBg: "bg-[#FFE4E6]" },
  ],
  "doa-dungeon": [
    { name: "Bilal Ramadhan", score: 1450, avatarBg: "bg-[#FEF08A]" },
    { name: "Maryam Sholehah", score: 1380, avatarBg: "bg-[#FCE7F3]" },
    { name: "Ihsan Kamil", score: 1310, avatarBg: "bg-[#CCFBF1]" },
    { name: "Umar Al-Faruq", score: 1240, avatarBg: "bg-[#E0F2FE]" },
    { name: "Aisyah Humaira", score: 1180, avatarBg: "bg-[#FED7AA]" },
    { name: "Fathir Rahman", score: 1120, avatarBg: "bg-[#DDD6FE]" },
    { name: "Zahra Fitria", score: 1060, avatarBg: "bg-[#DCFCE7]" },
    { name: "Salman Al-Farisi", score: 990, avatarBg: "bg-[#FEF9C3]" },
    { name: "Yasmin Salsabila", score: 930, avatarBg: "bg-[#E0E7FF]" },
    { name: "Hamzah Asadullah", score: 880, avatarBg: "bg-[#FFE4E6]" },
  ],
  "nabi-chronicles": [
    { name: "Sulaiman Perkasa", score: 2200, avatarBg: "bg-[#FEF08A]" },
    { name: "Yusuf Robbani", score: 2050, avatarBg: "bg-[#CCFBF1]" },
    { name: "Fatimah Az-Zahra", score: 1920, avatarBg: "bg-[#FCE7F3]" },
    { name: "Ibrahim Halim", score: 1840, avatarBg: "bg-[#E0F2FE]" },
    { name: "Musa Al-Kalim", score: 1760, avatarBg: "bg-[#FED7AA]" },
    { name: "Idris Rabbani", score: 1680, avatarBg: "bg-[#DDD6FE]" },
    { name: "Harun Ar-Rasyid", score: 1590, avatarBg: "bg-[#DCFCE7]" },
    { name: "Maryam Shiddiqah", score: 1510, avatarBg: "bg-[#FFE4E6]" },
    { name: "Yunus Bahri", score: 1430, avatarBg: "bg-[#FEF9C3]" },
    { name: "Adam Khalifah", score: 1350, avatarBg: "bg-[#E0E7FF]" },
  ],
  "malaikat-mission": [
    { name: "Jibril Defender", score: 1120, avatarBg: "bg-[#FEF08A]" },
    { name: "Mikail Rizqi", score: 1080, avatarBg: "bg-[#CCFBF1]" },
    { name: "Israfil Hafizh", score: 1020, avatarBg: "bg-[#E0F2FE]" },
    { name: "Ridwan Salam", score: 970, avatarBg: "bg-[#DCFCE7]" },
    { name: "Malikul Maut", score: 910, avatarBg: "bg-[#FED7AA]" },
    { name: "Raqib Atid", score: 860, avatarBg: "bg-[#DDD6FE]" },
    { name: "Munkar Nakir", score: 810, avatarBg: "bg-[#FCE7F3]" },
    { name: "Shafa Marwah", score: 760, avatarBg: "bg-[#FFE4E6]" },
    { name: "Thariq Ziyad", score: 710, avatarBg: "bg-[#FEF9C3]" },
    { name: "Khalid Walid", score: 660, avatarBg: "bg-[#E0E7FF]" },
  ],
  "tajwid-tetris": [
    { name: "Qari Hafiz", score: 3400, avatarBg: "bg-[#FEF08A]" },
    { name: "Tajwid Master", score: 3150, avatarBg: "bg-[#CCFBF1]" },
    { name: "Tartila Juara", score: 2890, avatarBg: "bg-[#FED7AA]" },
    { name: "Nun Sukun Hero", score: 2640, avatarBg: "bg-[#E0F2FE]" },
    { name: "Idgham Bighunnah", score: 2410, avatarBg: "bg-[#FCE7F3]" },
    { name: "Ikhfa Hakiki", score: 2190, avatarBg: "bg-[#DDD6FE]" },
    { name: "Mad Wajib", score: 1980, avatarBg: "bg-[#DCFCE7]" },
    { name: "Qalqalah Kubra", score: 1760, avatarBg: "bg-[#FFE4E6]" },
    { name: "Ghunnah Ceria", score: 1540, avatarBg: "bg-[#FEF9C3]" },
    { name: "Iqlab Santri", score: 1320, avatarBg: "bg-[#E0E7FF]" },
  ],
};

const GENERIC_NAMES = [
  "Rifqi Maulana",
  "Alya Syakira",
  "Rayyan Al-Fariz",
  "Nadia Azzahra",
  "Farras Rabbani",
  "Hanum Salsabila",
  "Zidan Pratama",
  "Aqila Zahirah",
  "Ilham Robbani",
  "Syifa Nurhaliza",
];

const AVATAR_COLORS = [
  "bg-[#FEF08A]",
  "bg-[#CCFBF1]",
  "bg-[#FED7AA]",
  "bg-[#E0F2FE]",
  "bg-[#FCE7F3]",
  "bg-[#DDD6FE]",
  "bg-[#DCFCE7]",
  "bg-[#FEF9C3]",
  "bg-[#E0E7FF]",
  "bg-[#FFE4E6]",
];

function generateDynamicMock(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const baseScore = Math.abs(hash % 800) + 700;
  return GENERIC_NAMES.map((name, idx) => ({
    name,
    score: Math.max(50, baseScore - idx * 65),
    avatarBg: AVATAR_COLORS[idx % AVATAR_COLORS.length],
  }));
}

export function LeaderboardList({
  gameId,
  title,
  period = "weekly",
  className = "",
}: LeaderboardListProps) {
  const { user } = useAuth();
  const userName = user?.name || user?.username || "Kamu";

  // Ambil skor aktual user dari storage
  const userScore = useMemo(() => {
    if (!gameId) return 0;
    const local = getLeaderboard(gameId).find(
      (e) => e.name === "Kamu" || e.name === userName,
    )?.score;
    const best = getBest(gameId);
    return Math.max(local || 0, best || 0);
  }, [gameId, userName]);

  // Bangun daftar 10 pemain teratas
  const { top10, userRank } = useMemo(() => {
    if (!gameId || gameId.trim() === "") {
      return { top10: [], userRank: 0 };
    }

    const mockPool =
      MOCK_LEADERBOARDS[gameId] || generateDynamicMock(gameId);

    // Ambil entries dari local storage jika ada
    const localEntries = getLeaderboard(gameId).filter(
      (e) => e.name !== "Kamu" && e.name !== userName,
    );

    const mergedMap = new Map<string, { name: string; score: number; avatarBg: string }>();

    mockPool.forEach((p) => {
      mergedMap.set(p.name, p);
    });

    localEntries.forEach((e, i) => {
      mergedMap.set(e.name, {
        name: e.name,
        score: e.score,
        avatarBg: AVATAR_COLORS[i % AVATAR_COLORS.length],
      });
    });

    const allPlayers = Array.from(mergedMap.values());

    // Masukkan user jika punya skor
    if (userScore > 0) {
      allPlayers.push({
        name: `${userName} (Kamu)`,
        score: userScore,
        avatarBg: "bg-[#2DD4BF]",
      });
    }

    allPlayers.sort((a, b) => b.score - a.score);

    // Hitung peringkat user
    let rank = 0;
    if (userScore > 0) {
      const idx = allPlayers.findIndex((p) => p.name.includes("(Kamu)"));
      rank = idx !== -1 ? idx + 1 : 42;
    } else {
      rank = 42;
    }

    const playersList: PlayerEntry[] = allPlayers.slice(0, 10).map((p, idx) => ({
      id: `${gameId}-${idx}-${p.name}`,
      name: p.name,
      score: p.score,
      isUser: p.name.includes("(Kamu)"),
      avatarBg: p.avatarBg,
    }));

    return { top10: playersList, userRank: rank };
  }, [gameId, userScore, userName]);

  // EMPTY STATE (Jika gameId kosong atau tidak valid)
  if (!gameId || gameId.trim() === "") {
    return (
      <div className={`rounded-2xl border-[3px] border-[var(--game-border,var(--card-border,#134E4A))] bg-[var(--game-card-bg,var(--card-bg,#FFFFFF))] p-8 text-center shadow-[4px_4px_0px_var(--game-shadow,var(--card-shadow,#134E4A))] ${className}`}>
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-[var(--game-border,var(--card-border,#134E4A))] bg-[#FEF08A] shadow-[2px_2px_0px_var(--game-shadow,var(--card-shadow,#134E4A))]">
          <TrophySvg size={32} className="text-[#B45309]" />
        </div>
        <h3 className="font-display text-lg font-black text-[var(--game-text,var(--app-text,#134E4A))]">
          Jadilah yang pertama!
        </h3>
        <p className="mx-auto mt-1 max-w-xs text-xs font-semibold leading-relaxed text-[var(--game-text,var(--app-text,#134E4A))]/70">
          Belum ada santri yang mencetak skor untuk papan ini. Mulai bermain dan rebut takhta juara!
        </p>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col rounded-2xl border-[3px] border-[var(--game-border,var(--card-border,#134E4A))] bg-[var(--game-card-bg,var(--card-bg,#FFFFFF))] shadow-[4px_4px_0px_var(--game-shadow,var(--card-shadow,#134E4A))] overflow-hidden ${className}`}>
      {/* Header Info */}
      <div className="border-b-[3px] border-[var(--game-border,var(--card-border,#134E4A))] bg-[#CCFBF1] dark:bg-[#1E293B] px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#0F766E] dark:text-[#38BDF8]">
            Top 10 Santri Berbakat
          </span>
          <h3 className="font-display text-sm font-black text-[var(--game-text,var(--app-text,#134E4A))]">
            {title || `Papan Skor: ${gameId}`}
          </h3>
        </div>
        <span className="rounded-lg border-2 border-[var(--game-border,var(--card-border,#134E4A))] bg-[#FEF08A] px-2 py-0.5 text-[10px] font-black text-[#7C2D12]">
          {period === "daily" ? "Harian" : period === "weekly" ? "Pekan Ini" : "Semua Waktu"}
        </span>
      </div>

      {/* List Top 10 Pemain */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="divide-y-2 divide-[var(--game-border,var(--card-border,#134E4A))]/10 p-2 sm:p-3 overflow-y-auto max-h-[380px]"
      >
        {top10.map((player, index) => {
          const rank = index + 1;
          const isRank1 = rank === 1;
          const isRank2 = rank === 2;
          const isRank3 = rank === 3;

          // Rank Badge Styling
          let rankBadgeClass =
            "border-2 border-[var(--game-border,var(--card-border,#134E4A))] bg-[var(--game-card-bg,var(--card-bg,#FFFFFF))] text-[var(--game-text,var(--app-text,#134E4A))] shadow-[1px_1px_0px_var(--game-shadow,var(--card-shadow,#134E4A))]";
          let rowHighlight = "hover:bg-[var(--game-border,var(--card-border,#134E4A))]/5";

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

          if (player.isUser) {
            rowHighlight = "bg-[#DCFCE7] border-2 border-[#166534] shadow-[2px_2px_0px_#166534]";
          }

          return (
            <motion.div
              key={player.id}
              variants={staggerItemVariants}
              className={`flex items-center justify-between gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors ${rowHighlight}`}
            >
              {/* Sisi Kiri: Peringkat, Avatar, Nama */}
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rank Badge */}
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

                {/* Avatar Initial */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] font-black text-xs text-[#134E4A] shadow-[1px_1px_0px_#134E4A] ${player.avatarBg}`}
                >
                  {player.name.charAt(0)}
                </div>

                {/* Nama Pemain */}
                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-[#134E4A] flex items-center gap-1.5">
                    <span>{player.name}</span>
                    {player.isUser && (
                      <span className="rounded bg-[#166534] px-1 py-0.2 text-[9px] font-black text-white">
                        Kamu
                      </span>
                    )}
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

              {/* Sisi Kanan: Skor */}
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

      {/* STICKY FOOTER: PERINGKAT USER SAAT INI */}
      <div className="sticky bottom-0 z-10 border-t-[3px] border-[var(--game-border,var(--card-border,#134E4A))] bg-[#FEF08A] p-3 shadow-[0px_-2px_0px_var(--game-shadow,var(--card-shadow,#134E4A))]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--game-border,var(--card-border,#134E4A))] bg-[var(--game-card-bg,var(--card-bg,#FFFFFF))] font-black text-xs text-[var(--game-text,var(--app-text,#134E4A))] shadow-[1px_1px_0px_var(--game-shadow,var(--card-shadow,#134E4A))]">
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
