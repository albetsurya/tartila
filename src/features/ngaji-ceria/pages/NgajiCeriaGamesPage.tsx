import { motion } from "framer-motion";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animationVariants";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import {
  TrophySvg,
  GamepadSvg,
  CardsSvg,
} from "../../../components/ui/CustomIcons";
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

export const GAME_METADATA_REGISTRY: Record<string, GameMetaInfo> = {
  "quiz-hub": {
    title: "Arena Kuis", // <-- Diubah dari "Pusat Kuis"
    genre: "Kuis · Tantangan Kata",
    description:
      "Uji kepintaranmu mengeja huruf, menyusun kata Arab, dan tantang temanmu di papan peringkat!",
    cover: <QuizHubCoverSvg size={76} />,
    path: "/quiz-hub",
    bestKey: "quiz-hub",
    isNew: true,
    isQuizBased: true,
  },
  "harakat-rush": {
    title: "Harakat Slasher",
    genre: "Arkade · Refleks",
    description:
      "Ayunkan pedangmu, tebas harakat yang tepat, dan hindari jebakan pengecoh sebelum waktu habis!",
    cover: <HarakatRushCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/harakat-rush",
    bestKey: "harakat-rush",
    isNew: true,
    isQuizBased: false,
  },
  "harakat-slasher": {
    title: "Harakat Slasher",
    genre: "Arkade · Refleks",
    description:
      "Ayunkan pedangmu, tebas harakat yang tepat, dan hindari jebakan pengecoh sebelum waktu habis!",
    cover: <HarakatRushCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/harakat-rush",
    bestKey: "harakat-rush",
    isNew: true,
    isQuizBased: false,
  },
  "tilawati-memory": {
    title: "Tilawati Memori",
    genre: "Memori · 6 Jilid",
    description:
      "Asah ingatanmu! Temukan pasangan kartu huruf dan kata Arab secepat mungkin sebelum waktu habis.",
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
    description:
      "Asah ingatanmu! Temukan pasangan kartu huruf dan kata Arab secepat mungkin sebelum waktu habis.",
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
  "ayat-scramble": {
    title: "Ayat Scramble",
    genre: "Puzzle · Ayat",
    description:
      "Acak-acak kata ini! Susun kembali potongan ayat menjadi bacaan Al-Qur'an yang sempurna.",
    cover: <AyatScrambleCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/ayat-scramble",
    bestKey: "ayat-scramble:normal",
    isQuizBased: true,
  },
  "hijaiyah-2048": {
    title: "Hijaiyah 2048",
    genre: "Puzzle · Geser Huruf",
    description:
      "Geser dan gabungkan huruf hijaiyah sejenis. Siapa cepat, dialah yang mencapai huruf tertinggi!",
    cover: <Hijaiyah2048CoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/hijaiyah-2048",
    bestKey: "hijaiyah-2048",
    isQuizBased: false,
  },
  "quiz-ngaji": {
    title: "Quiz Ngaji",
    genre: "Kuis · Juz Amma",
    description:
      "Uji hafalan Juz Amma-mu! Mainkan mode Speedrun, Royale, dan Menara Lentera di sini.",
    cover: <QuranQuizRoyaleCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/quiz-ngaji",
    bestKey: "quran-quiz-royale",
    isQuizBased: true,
  },
  "hijaiyah-pop": {
    title: "Hijaiyah Pop",
    genre: "Arkade · Ketangkasan",
    description:
      "Ketuk dan pecahkan balon huruf hijaiyah secepat kilat. Jangan sampai salah sasaran!",
    cover: <HijaiyahPopCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/hijaiyah-pop",
    bestKey: "hijaiyah-pop",
    isQuizBased: false,
  },
  "ritme-ngaji": {
    title: "Ritme Ngaji",
    genre: "Musik · Ketukan Nada",
    description:
      "Gabungkan ketukan irama, harakat, dan makhraj dalam satu petualangan musik islami.",
    cover: <HarakatRushCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/ritme-ngaji",
    bestKey: "harakat-rush",
    isQuizBased: false,
  },
  "puzzle-huruf": {
    title: "Puzzle Huruf",
    genre: "Puzzle · Otak",
    description:
      "Tantang logikamu dengan tebak kata, susun ayat, gabung huruf, dan buru kata tersembunyi.",
    cover: <AyatScrambleCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/puzzle-huruf",
    bestKey: "ayat-scramble:normal",
    isQuizBased: true,
  },
  "tajwid-lab": {
    title: "Tajwid Lab",
    genre: "Strategi · Hukum Tajwid",
    description:
      "Kuasai hukum tajwid lewat pertarungan kartu, pertahanan markas, dan susun blok tajwid.",
    cover: <TajwidArenaCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/tajwid-lab",
    bestKey: "tajwid-arena",
    isQuizBased: false,
  },
  "petualangan-santri": {
    title: "Petualangan Santri",
    genre: "RPG · Kisah Islami",
    description:
      "Jelajahi lorong waktu, temui para nabi dan malaikat, serta kumpulkan doa dalam petualangan epik.",
    cover: <AdabRpgCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/petualangan-santri",
    bestKey: "adab-rpg",
    isNew: true,
    isQuizBased: false,
  },
  "makhraj-master": {
    title: "Makhraj Master",
    genre: "Musik · Tajwid",
    description:
      "Ikuti irama makhraj huruf dengan tepat. Raih kombo sempurna dan jadilah Master Makhraj!",
    cover: <MakhrajMasterCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/makhraj-master",
    bestKey: "makhraj-master",
    isQuizBased: false,
  },
  "hijaiyah-beats": {
    title: "Hijaiyah Beats",
    genre: "Musik · Huruf",
    description:
      "Ketuk nada sesuai bentuk huruf hijaiyah. Mainkan mode Normal atau tantang dirimu di mode Endless!",
    cover: <HijaiyahBeatsCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/hijaiyah-beats",
    bestKey: "hijaiyah-beats",
    isQuizBased: false,
  },
  "doa-dungeon": {
    title: "Doa Dungeon",
    genre: "RPG · Petualangan",
    description:
      "Masuki gua penuh misteri. Kalahkan rintangan dengan menghafal doa-doa harian!",
    cover: <DoaDungeonCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/doa-dungeon",
    bestKey: "doa-dungeon",
    isQuizBased: true,
  },
  "sholat-hero": {
    title: "Sholat Hero",
    genre: "Edukasi · Gerakan",
    description:
      "Jadilah pahlawan ibadah! Pelajari gerakan dan bacaan sholat dengan cara yang seru.",
    cover: <SholatHeroCoverSvg size={76} />,
    path: "/member/ngaji-ceria/games/sholat-hero",
    bestKey: "sholat-hero",
    isQuizBased: true,
  },
  "wudhu-flow": {
    title: "Wudhu Flow",
    genre: "Edukasi · Urutan",
    description:
      "Bersih itu sebagian dari iman. Susun langkah wudhu dengan cepat dan tepat!",
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
      : (meta?.path ?? `/member/ngaji-ceria/games/${item.game_id}`);
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
  const { activeGames, isLoading } = useActiveGames();
  const gamesToDisplay = useMemo(() => {
    const filtered = activeGames.filter((g) => {
      if (!g.is_active) return false;
      if (g.parent_hub_id && g.display_type !== "standalone") return false;
      return true;
    });
    const sorted = [...filtered].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );
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
      <div className="mx-auto min-h-full w-full space-y-5 rounded-t-3xl bg-[var(--bg-app,#F0FDF4)] px-3 py-5 pb-32 text-[var(--text-main,#134E4A)] transition-colors duration-200 sm:space-y-6 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <span className="mb-2 inline-flex items-center rounded-lg border-2 border-[var(--border-color,#134E4A)] bg-[#CCFBF1] px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-[#134E4A] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] dark:bg-[#1E293B] dark:text-[#99F6E4]">
              Koleksi Permainan
            </span>
            <h2 className="font-display text-2xl font-black leading-tight text-[var(--text-main,#134E4A)] sm:text-3xl">
              Jelajahi Permainan
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--text-main,#134E4A)]/75">
              Pilih permainan untuk melatih kemampuan, mengasah ingatan, dan
              belajar sambil bermain.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria/leaderboard")}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border-[2px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-4 py-2.5 text-[var(--text-main,#134E4A)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] transition-all hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:w-auto"
            title="Buka Papan Skor Global"
          >
            <TrophySvg size={18} className="shrink-0 text-[#B45309]" />
            <span className="text-sm font-black">Papan Skor</span>
          </button>
        </div>

        {isLoading ? (
          <div
            aria-label="Memuat daftar permainan"
            aria-live="polite"
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="min-h-[250px] animate-pulse rounded-[22px] border-[3px] border-[var(--border-color,#134E4A)]/15 bg-[var(--bg-card,#FFFFFF)] p-3 shadow-[3px_3px_0px_rgba(19,78,74,0.12)]"
              >
                <div className="mx-auto mt-3 h-20 w-20 rounded-2xl bg-[var(--bg-app,#F0FDF4)]" />
                <div className="mx-auto mt-5 h-4 w-3/4 rounded-md bg-[var(--bg-app,#F0FDF4)]" />
                <div className="mx-auto mt-2 h-3 w-1/2 rounded-md bg-[var(--bg-app,#F0FDF4)]" />
                <div className="mt-5 h-10 rounded-xl bg-[var(--bg-app,#F0FDF4)]" />
              </div>
            ))}
          </div>
        ) : gamesToDisplay.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-[3px] border-dashed border-[var(--border-color,#134E4A)]/40 bg-[var(--bg-card,#FFFFFF)] p-6 text-center shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] sm:p-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#FEF08A] text-[#134E4A] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)]">
              <GamepadSvg size={42} />
            </div>
            <p className="text-base font-black text-[var(--text-main,#134E4A)] sm:text-lg">
              Belum ada game yang diaktifkan
            </p>
            <p className="mt-1 max-w-sm text-sm leading-relaxed text-[var(--text-main,#134E4A)]/70">
              Aktifkan game melalui Panel Admin Katalog Game untuk
              menampilkannya di sini.
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5"
          >
            {gamesToDisplay.map((game, index) => {
              const locked = tier === "guest" && !isGameOpen(game.id, tier);
              return (
                <motion.div
                  key={game.id}
                  variants={staggerItemVariants}
                  className="h-full min-w-0"
                >
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

            <motion.div
              variants={staggerItemVariants}
              className="relative flex h-full min-h-[250px] w-full flex-col items-center rounded-[22px] border-[3px] border-dashed border-[var(--border-color,#134E4A)]/40 bg-[var(--bg-card,#FFFFFF)] p-3 text-[var(--text-main,#134E4A)] shadow-[3px_3px_0px_rgba(19,78,74,0.18)]"
            >
              <div className="relative z-10 mt-3 flex h-24 w-full items-center justify-center">
                <div className="absolute inset-0 m-auto h-20 w-20 rounded-full border-[2.5px] border-dashed border-[var(--border-color,#134E4A)]/40 bg-[#CCFBF1] dark:bg-[#1E293B]" />
                <GamepadSvg
                  size={36}
                  className="relative z-10 opacity-40 text-[var(--text-main,#134E4A)]"
                />
              </div>
              <div className="z-10 mt-3 flex w-full flex-col items-center text-center">
                <h3 className="font-display text-center text-sm font-black leading-tight text-[var(--text-main,#134E4A)] sm:text-base">
                  Segera Hadir
                </h3>
                <p className="mt-1 text-xs font-bold text-[var(--text-main,#134E4A)]/70">
                  Game Baru
                </p>
              </div>
              <div className="z-10 mt-3 w-full">
                <span className="flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[var(--border-color,#134E4A)]/25 bg-gray-100 py-2 text-xs font-black text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
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
