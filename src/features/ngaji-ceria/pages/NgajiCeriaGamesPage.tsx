import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { TrophySvg, GamepadSvg } from "../../../components/ui/CustomIcons";
import { useGameAccess } from "../components/GameLockGuard";
import { LoginPromptModal } from "../components/LoginPromptModal";
import { isGameOpen } from "../data/gameAccess";
import { getBest } from "./games/_shared/storage";
import { triggerTilaReaction } from "../../../utils/tilaEvent";
import { GameCard } from "./games/_shared/GameCard";
import {
  HarakatRushCoverSvg,
  QuranQuizRoyaleCoverSvg,
  AyatScrambleCoverSvg,
  TajwidArenaCoverSvg,
  AdabRpgCoverSvg,
} from "@/components/ui/Illustrations";

interface GameEntry {
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

const GAMES: GameEntry[] = [
  {
    id: "ritme-ngaji",
    title: "Ritme Ngaji",
    genre: "Hub · 6 Game",
    description: "Rhythm, harakat, makhraj, dan aksi arkade hijaiyah.",
    cover: <HarakatRushCoverSvg size={76} />,
    best: Math.max(
      getBest("harakat-rush"),
      getBest("makhraj-master"),
      getBest("hijaiyah-beats"),
      getBest("hijaiyah-pop"),
      getBest("hijaiyah-rush"),
      getBest("hijaiyah-match-arena"),
    ),
    path: "/member/ngaji-ceria/games/ritme-ngaji",
    bgColor: "bg-[#F0FDF4]",
  },
  {
    id: "quiz-ngaji",
    title: "Quiz Ngaji",
    genre: "Hub · 3 Game",
    description: "Speedrun, saf royale, dan menara lentera Juz Amma.",
    cover: <QuranQuizRoyaleCoverSvg size={76} />,
    best: Math.max(
      getBest("juz-amma-speedrun"),
      getBest("quran-quiz-royale"),
      getBest("nur-battle"),
    ),
    path: "/member/ngaji-ceria/games/quiz-ngaji",
    bgColor: "bg-[#FAF5FF]",
  },
  {
    id: "puzzle-huruf",
    title: "Puzzle Huruf",
    genre: "Hub · 4 Game",
    description: "Wordle, susun ayat, 2048, dan perburuan ayat.",
    cover: <AyatScrambleCoverSvg size={76} />,
    best: Math.max(
      getBest("arabic-wordle:daily"),
      getBest("ayat-scramble:normal"),
      getBest("hijaiyah-2048"),
      getBest("ayat-hunter"),
    ),
    path: "/member/ngaji-ceria/games/puzzle-huruf",
    bgColor: "bg-[#F0F9FF]",
  },
  {
    id: "tajwid-lab",
    title: "Tajwid Lab",
    genre: "Hub · 3 Game",
    description: "Duel kartu, pertahanan base, dan tetris hukum tajwid.",
    cover: <TajwidArenaCoverSvg size={76} />,
    best: Math.max(
      getBest("tajwid-arena"),
      getBest("tajwid-defense"),
      getBest("tajwid-tetris"),
    ),
    path: "/member/ngaji-ceria/games/tajwid-lab",
    bgColor: "bg-[#F0FDFA]",
  },
  {
    id: "petualangan-santri",
    title: "Petualangan Santri",
    genre: "Hub · 7 Game",
    description: "Jejak santri, doa dungeon, malaikat, nabi, & ibadah.",
    cover: <AdabRpgCoverSvg size={76} />,
    best: Math.max(
      getBest("adab-rpg"),
      getBest("doa-dungeon"),
      getBest("nabi-chronicles"),
      getBest("malaikat-mission"),
      getBest("santri-idle"),
      getBest("sholat-hero"),
      getBest("wudhu-flow"),
    ),
    path: "/member/ngaji-ceria/games/petualangan-santri",
    isNew: true,
    bgColor: "bg-[#FFFBEB]",
  },
];

export default function NgajiCeriaGamesPage() {
  const navigate = useNavigate();
  const { tier } = useGameAccess("games");
  const [promptOpen, setPromptOpen] = useState(false);

  const openGame = (path: string, locked: boolean) => {
    if (locked && tier === "guest") {
      setPromptOpen(true);
      return;
    }
    // Memicu reaksi Tito saat game diklik
    triggerTilaReaction("play");
    navigate(path);
  };

  const playedCount = GAMES.filter((g) => g.best > 0).length;

  return (
    <NgajiCeriaLayout title="Mini Games" showBack>
      <div className="space-y-6 rounded-t-3xl bg-[#F0FDF4] px-4 py-5 md:px-6 md:py-8 min-h-full pb-32">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#0D9488]">
              5 Hub Pilihan · 23 Game
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-black text-[#134E4A]">
              Mini Games
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 border-[2px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            <TrophySvg size={16} />
            <span className="text-xs md:text-sm font-black text-[#134E4A]">
              {playedCount}/{GAMES.length} Hub
            </span>
          </div>
        </div>

        {/* Games Grid (Responsif: Mobile 2 cols, Tablet 3 cols, Desktop 4 cols) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {GAMES.map((game, index) => {
            const locked = tier === "guest" && !isGameOpen(game.id, tier);
            return (
              <motion.div
                key={game.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(index * 0.05, 0.4),
                  duration: 0.3,
                }}
              >
                <GameCard
                  title={game.title}
                  genre={game.genre}
                  description={game.description}
                  cover={game.cover}
                  best={game.best}
                  badge={game.isNew ? "BARU" : undefined}
                  bgColor={game.bgColor || "bg-white"}
                  locked={locked}
                  index={index}
                  onClick={() => openGame(game.path, locked)}
                />
              </motion.div>
            );
          })}

          {/* Coming Soon Card (Disesuaikan dengan gaya Sticker Card) */}
          <div className="relative flex flex-col items-center w-full rounded-[24px] bg-gray-50 border-[3px] border-gray-300 border-dashed p-3 opacity-70">
            <div className="relative z-10 mt-4 flex h-24 w-full items-center justify-center">
              <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-gray-200" />
              <GamepadSvg size={36} className="relative z-10 opacity-40" />
            </div>
            <div className="mt-3 flex w-full flex-col items-center text-center z-10">
              <h3 className="font-display text-[15px] font-black leading-tight text-gray-500">
                Segera Hadir
              </h3>
              <p className="mt-0.5 text-[10px] font-bold text-gray-400">
                Game Baru
              </p>
            </div>
            <div className="mt-3 w-full z-10">
              <span className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-gray-300 bg-gray-200 py-2 text-xs font-black text-gray-500">
                Tunggu Ya
              </span>
            </div>
          </div>
        </div>

        <LoginPromptModal
          open={promptOpen}
          onClose={() => setPromptOpen(false)}
        />
      </div>
    </NgajiCeriaLayout>
  );
}
