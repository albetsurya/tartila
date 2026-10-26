import { motion } from "framer-motion";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animationVariants";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { TrophySvg, GamepadSvg, CardsSvg } from "../../../components/ui/CustomIcons";
import { useGameAccess } from "../components/GameLockGuard";
import { LoginPromptModal } from "../components/LoginPromptModal";
import { isGameOpen, canonicalGameId } from "../data/gameAccess";
import { getBest } from "./games/_shared/storage";
import { triggerTilaReaction } from "../../../utils/tilaEvent";
import { GameCard } from "./games/_shared/GameCard";
import { useActiveGames, ActiveGameItem } from "../hooks/useActiveGames";
import {
  HarakatRushCoverSvg,
  QuranQuizRoyaleCoverSvg,
  AyatScrambleCoverSvg,
  Hijaiyah2048CoverSvg,
  HijaiyahPopCoverSvg,
  TajwidArenaCoverSvg,
  AdabRpgCoverSvg,
  MakhrajMasterCoverSvg,
  HijaiyahBeatsCoverSvg,
  DoaDungeonCoverSvg,
  SholatHeroCoverSvg,
  WudhuFlowCoverSvg,
  QuizHubCoverSvg,
} from "@/components/ui/Illustrations";

export interface GameEntry {
  id: string;
  title: string;
  genre: string;
  description: string;
  cover: React.ReactNode;
  best: number;
  path: string;
  isNew?: boolean;
  bgColor?: string;
}

export interface GameMetaInfo {
  title: string;
  genre: string;
  description: string;
  cover: React.ReactNode;
  path: string;
  bestKey: string;
  isNew?: boolean;
  isQuizBased?: boolean;
}

/**
 * Registry visual & rute untuk game/hub Tartila.
 * Tampilan aktual kartu sepenuhnya dikontrol oleh data database (is_active, display_type, sort_order).
 */
export const GAME_METADATA_REGISTRY: Record<string, GameMetaInfo> = {
  // 0. Pusat Kuis (Quiz Hub)
  "quiz-hub": {
    title: "Pusat Kuis",
    genre: "Kuis · Duolingo-Style",
    description: "Pusat kuis interaktif, susun kata Arab, mufradat, dan tantang teman!",
    cover: <QuizHubCoverSvg size={76} />,
    path: "/quiz-hub",
    bestKey: "quiz-hub",
    isNew: true,
    isQuizBased: true,
  },

  // 1. Harakat Slasher
  "harakat-rush": {
    title: "Harakat Slasher",
    genre: "Arkade · Refleks",
    description: "Tebas huruf harakat target ala ninja buah dan hindari pengecoh!",
    cover: <HarakatRushCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/harakat-rush",
    bestKey: "harakat-rush",
    isNew: true,
    isQuizBased: false,
  },
  "harakat-slasher": {
    title: "Harakat Slasher",
    genre: "Arkade · Refleks",
    description: "Tebas huruf harakat target ala ninja buah dan hindari pengecoh!",
    cover: <HarakatRushCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/harakat-rush",
    bestKey: "harakat-rush",
    isNew: true,
    isQuizBased: false,
  },

  // 2. Tilawati Memori
  "tilawati-memory": {
    title: "Tilawati Memori",
    genre: "Memori · 6 Jilid",
    description: "Cocokkan pasangan huruf dan kata Arab sebelum batas waktu habis!",
    cover: (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#065F46] border-2 border-[#10B981] shadow-[2px_2px_0px_#065F46]">
        <CardsSvg size={36} />
      </div>
    ),
    path: "/member/ngaji-ceria/games/memory/select",
    bestKey: "tilawati-memory",
    isNew: true,
    isQuizBased: true,
  },
  "memory-match": {
    title: "Tilawati Memori",
    genre: "Memori · 6 Jilid",
    description: "Cocokkan pasangan huruf dan kata Arab sebelum batas waktu habis!",
    cover: (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#065F46] border-2 border-[#10B981] shadow-[2px_2px_0px_#065F46]">
        <CardsSvg size={36} />
      </div>
    ),
    path: "/member/ngaji-ceria/games/memory/select",
    bestKey: "tilawati-memory",
    isNew: true,
    isQuizBased: true,
  },

  // 3. Ayat Scramble
  "ayat-scramble": {
    title: "Ayat Scramble",
    genre: "Puzzle · Ayat",
    description: "Susun kembali potongan kata menjadi ayat Al-Qur'an utuh.",
    cover: <AyatScrambleCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/ayat-scramble",
    bestKey: "ayat-scramble:normal",
    isQuizBased: true,
  },

  // 4. Hijaiyah 2048
  "hijaiyah-2048": {
    title: "Hijaiyah 2048",
    genre: "Puzzle · Geser Huruf",
    description: "Gabungkan huruf hijaiyah kembar hingga mencapai huruf tertinggi.",
    cover: <Hijaiyah2048CoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/hijaiyah-2048",
    bestKey: "hijaiyah-2048",
    isQuizBased: false,
  },

  // 5. Quiz Ngaji
  "quiz-ngaji": {
    title: "Quiz Ngaji",
    genre: "Kuis · 3 Game",
    description: "Speedrun, saf royale, dan menara lentera Juz Amma.",
    cover: <QuranQuizRoyaleCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/quiz-ngaji",
    bestKey: "quran-quiz-royale",
    isQuizBased: true,
  },

  // 6. Hijaiyah Pop
  "hijaiyah-pop": {
    title: "Hijaiyah Pop",
    genre: "Arkade · Ketangkasan",
    description: "Pecahkan buah dan balon huruf hijaiyah secepat kilat.",
    cover: <HijaiyahPopCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/hijaiyah-pop",
    bestKey: "hijaiyah-pop",
    isQuizBased: false,
  },

  // Game / Hub pendukung lainnya jika diaktifkan admin melalui CMS
  "ritme-ngaji": {
    title: "Ritme Ngaji",
    genre: "Hub · 6 Game",
    description: "Rhythm, harakat, makhraj, dan aksi arkade hijaiyah.",
    cover: <HarakatRushCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/ritme-ngaji",
    bestKey: "harakat-rush",
    isQuizBased: false,
  },
  "puzzle-huruf": {
    title: "Puzzle Huruf",
    genre: "Hub · 4 Game",
    description: "Wordle, susun ayat, 2048, dan perburuan ayat.",
    cover: <AyatScrambleCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/puzzle-huruf",
    bestKey: "ayat-scramble:normal",
    isQuizBased: true,
  },
  "tajwid-lab": {
    title: "Tajwid Lab",
    genre: "Hub · 3 Game",
    description: "Duel kartu, pertahanan base, dan tetris hukum tajwid.",
    cover: <TajwidArenaCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/tajwid-lab",
    bestKey: "tajwid-arena",
    isQuizBased: false,
  },
  "petualangan-santri": {
    title: "Petualangan Santri",
    genre: "Hub · 7 Game",
    description: "Jejak santri, doa dungeon, malaikat, nabi, & ibadah.",
    cover: <AdabRpgCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/petualangan-santri",
    bestKey: "adab-rpg",
    isNew: true,
    isQuizBased: false,
  },
  "makhraj-master": {
    title: "Makhraj Master",
    genre: "Rhythm · Tajwid",
    description: "Empat lane rhythm dengan judgement Perfect dan Good.",
    cover: <MakhrajMasterCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/makhraj-master",
    bestKey: "makhraj-master",
    isQuizBased: false,
  },
  "hijaiyah-beats": {
    title: "Hijaiyah Beats",
    genre: "Rhythm · Huruf",
    description: "Mode normal atau endless untuk mengikuti bentuk huruf.",
    cover: <HijaiyahBeatsCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/hijaiyah-beats",
    bestKey: "hijaiyah-beats",
    isQuizBased: false,
  },
  "doa-dungeon": {
    title: "Doa Dungeon",
    genre: "RPG · Petualangan",
    description: "Eksplorasi dungeon dengan menghafal doa-doa harian.",
    cover: <DoaDungeonCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/doa-dungeon",
    bestKey: "doa-dungeon",
    isQuizBased: true,
  },
  "sholat-hero": {
    title: "Sholat Hero",
    genre: "Edukasi · Ibadah",
    description: "Praktikkan gerakan dan bacaan sholat secara interaktif.",
    cover: <SholatHeroCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/sholat-hero",
    bestKey: "sholat-hero",
    isQuizBased: true,
  },
  "wudhu-flow": {
    title: "Wudhu Flow",
    genre: "Edukasi · Bersuci",
    description: "Urutkan langkah wudhu yang benar sesuai sunnah Nabi.",
    cover: <WudhuFlowCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/wudhu-flow",
    bestKey: "wudhu-flow",
    isQuizBased: true,
  },
};

function resolveGameEntry(item: ActiveGameItem): GameEntry {
  const canonical = canonicalGameId(item.game_id);
  const meta =
    GAME_METADATA_REGISTRY[item.game_id] || GAME_METADATA_REGISTRY[canonical];

  const title = meta?.title ?? item.game_id;
  const genre =
    meta?.genre ?? (item.display_type === "hub" ? "Hub Game" : "Mini Game");
  const description =
    meta?.description ?? "Game edukasi interaktif Al-Qur'an dan Tilawati.";
  const cover = meta?.cover ?? <GamepadSvg size={64} />;
  const path =
    item.display_type === "hub"
      ? `/member/ngaji-ceria/games/${item.game_id}`
      : meta?.path ?? `/member/ngaji-ceria/games/${item.game_id}`;
  const best = meta?.bestKey ? getBest(meta.bestKey) : 0;

  return {
    id: item.game_id,
    title,
    genre,
    description,
    cover,
    best,
    path,
    isNew: meta?.isNew,
    bgColor: "bg-[var(--bg-card)]",
  };
}

export default function NgajiCeriaGamesPage() {
  const navigate = useNavigate();
  const { tier } = useGameAccess("games");
  const [promptOpen, setPromptOpen] = useState(false);

  // Tarik data game aktif dari database melalui hook useActiveGames
  const { activeGames, isLoading } = useActiveGames();

  // Render dinamis: filter game aktif (is_active = true) dan urutkan sesuai sort_order
  const gamesToDisplay = useMemo(() => {
    // Saring game yang aktif dan bukan sub-game di dalam hub jika bertipe hub
    const filtered = activeGames.filter((g) => {
      if (!g.is_active) return false;
      // Jika parent_hub_id terisi dan bukan standalone, game masuk ke dalam hub
      if (g.parent_hub_id && g.display_type !== "standalone") return false;
      return true;
    });

    // Urutkan berdasarkan sort_order menaik
    const sorted = [...filtered].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );

    // Hindari duplikasi jika ada alias kanonis ganda
    const seen = new Set<string>();
    const uniqueEntries: GameEntry[] = [];

    for (const item of sorted) {
      const canonical = canonicalGameId(item.game_id);
      if (seen.has(canonical)) continue;
      seen.add(canonical);
      uniqueEntries.push(resolveGameEntry(item));
    }

    return uniqueEntries;
  }, [activeGames]);

  const openGame = (path: string, locked: boolean) => {
    if (locked && tier === "guest") {
      setPromptOpen(true);
      return;
    }
    triggerTilaReaction("play");
    navigate(path);
  };

  return (
    <NgajiCeriaLayout title="Mini Games" showBack>
      <div className="space-y-6 rounded-t-3xl bg-[var(--bg-app,#F0FDF4)] text-[var(--text-main,#134E4A)] px-4 py-5 md:px-6 md:py-8 min-h-full pb-32 transition-colors duration-200">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#0D9488]">
              Koleksi Mini Games · Edukasi & Asah Otak
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-black text-[var(--text-main,#134E4A)]">
              Mini Games
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/member/ngaji-ceria/leaderboard")}
              className="flex items-center gap-2 rounded-xl bg-[var(--bg-card,#FFFFFF)] px-3 py-2 border-[2px] border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer hover:opacity-90"
              title="Buka Papan Skor Global"
            >
              <TrophySvg size={16} className="text-[#B45309]" />
              <span className="text-xs md:text-sm font-black text-[var(--text-main,#134E4A)]">
                Papan Skor
              </span>
            </button>
          </div>
        </div>

        {/* Games Grid Dinamis (Tarik dari Database CMS) */}
        {gamesToDisplay.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/70 border-2 border-dashed border-[#134E4A]/30 text-center">
            <GamepadSvg size={48} className="text-[#134E4A]/40 mb-2" />
            <p className="text-sm font-black text-[#134E4A]">
              Belum ada game yang diaktifkan.
            </p>
            <p className="text-xs text-[#134E4A]/70 mt-1">
              Aktifkan game melalui Panel Admin Katalog Game.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {gamesToDisplay.map((game, index) => {
              const locked = tier === "guest" && !isGameOpen(game.id, tier);
              return (
                <motion.div key={game.id} variants={staggerItemVariants}>
                  <GameCard
                    title={game.title}
                    genre={game.genre}
                    description={game.description}
                    cover={game.cover}
                    best={game.best}
                    badge={game.isNew ? "BARU" : undefined}
                    bgColor="bg-[var(--bg-card)]"
                    locked={locked}
                    index={index}
                    onClick={() => openGame(game.path, locked)}
                  />
                </motion.div>
              );
            })}

            {/* Coming Soon Card */}
            <motion.div
              variants={staggerItemVariants}
              className="relative flex flex-col items-center w-full rounded-[24px] border-[3px] border-dashed border-[var(--border-color,#134E4A)]/40 p-3 opacity-70 bg-[var(--bg-card,#FFFFFF)]/60 text-[var(--text-main,#134E4A)] shadow-[4px_4px_0px_var(--shadow-color,#134E4A)]/40"
            >
              <div className="relative z-10 mt-4 flex h-24 w-full items-center justify-center">
                <div className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-white dark:bg-white/10 border-[2.5px] border-[var(--border-color,#134E4A)]/40 shadow-sm" />
                <GamepadSvg
                  size={36}
                  className="relative z-10 opacity-40 text-[var(--text-main,#134E4A)]"
                />
              </div>
              <div className="mt-3 flex w-full flex-col items-center text-center z-10">
                <h3 className="font-display text-[15px] font-black leading-tight text-[var(--text-main,#134E4A)]">
                  Segera Hadir
                </h3>
                <p className="mt-0.5 text-[10px] font-bold text-[var(--text-main,#134E4A)]/70">
                  Game Baru
                </p>
              </div>
              <div className="mt-3 w-full z-10">
                <span className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-2 text-xs font-black">
                  Tunggu Ya
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}

        <LoginPromptModal
          open={promptOpen}
          onClose={() => setPromptOpen(false)}
        />
      </div>
    </NgajiCeriaLayout>
  );
}
