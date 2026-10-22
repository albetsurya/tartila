import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { TrophySvg, GamepadSvg } from "../../../components/ui/CustomIcons";
import { useGameAccess } from "../components/GameLockGuard";
import { LoginPromptModal } from "../components/LoginPromptModal";
import { isGameOpenForGuest } from "../data/gameAccess";
import { getBest } from "./games/_shared/storage";
import { triggerTilaReaction } from "../../../utils/tilaEvent";
import { GameCard } from "./games/_shared/GameCard";
import {
  HijaiyahPopCoverSvg,
  HarakatRushCoverSvg,
  QuranQuizRoyaleCoverSvg,
  AyatScrambleCoverSvg,
  TajwidArenaCoverSvg,
  SantriIdleCoverSvg,
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
}

const GAMES: GameEntry[] = [
  {
    id: "hijaiyah-pop",
    title: "Hijaiyah Pop",
    genre: "Balon Hijaiyah",
    description: "Pecahkan balon huruf secepat kilat.",
    cover: <HijaiyahPopCoverSvg size={76} />,
    best: getBest("hijaiyah-pop"),
    path: "/member/ngaji-ceria/games/hijaiyah-pop",
  },
  {
    id: "ritme-ngaji",
    title: "Qirra Match",
    genre: "Pasangan Huruf",
    description: "Hub rhythm, harakat, bentuk huruf, dan makhraj.",
    cover: <HarakatRushCoverSvg size={76} />,
    best: Math.max(
      getBest("harakat-rush"),
      getBest("makhraj-master"),
      getBest("hijaiyah-beats"),
    ),
    path: "/member/ngaji-ceria/games/ritme-ngaji",
  },
  {
    id: "quiz-ngaji",
    title: "Tebak Surah",
    genre: "Cerita Juz Amma",
    description: "Speedrun, royale, dan battle practice Juz Amma.",
    cover: <QuranQuizRoyaleCoverSvg size={76} />,
    best: Math.max(
      getBest("juz-amma-speedrun"),
      getBest("quran-quiz-royale"),
      getBest("nur-battle"),
    ),
    path: "/member/ngaji-ceria/games/quiz-ngaji",
  },
  {
    id: "puzzle-huruf",
    title: "Puzzle Huruf",
    genre: "Hub · Puzzle",
    description: "Wordle, scramble, 2048, dan berburu ayat.",
    cover: <AyatScrambleCoverSvg size={76} />,
    best: Math.max(
      getBest("arabic-wordle:daily"),
      getBest("ayat-scramble:normal"),
      getBest("hijaiyah-2048"),
      getBest("ayat-hunter"),
    ),
    path: "/member/ngaji-ceria/games/puzzle-huruf",
  },
  {
    id: "tajwid-lab",
    title: "Tajwid Lab",
    genre: "Hub · Strategi",
    description: "Duel kartu, pertahanan base, dan puzzle blok.",
    cover: <TajwidArenaCoverSvg size={76} />,
    best: Math.max(
      getBest("tajwid-arena"),
      getBest("tajwid-defense"),
      getBest("tajwid-tetris"),
    ),
    path: "/member/ngaji-ceria/games/tajwid-lab",
  },
  {
    id: "santri-idle",
    title: "Pesantren Life",
    genre: "Simulasi · Idle",
    description: "Bangun pesantren dan kumpulkan resource.",
    cover: <SantriIdleCoverSvg size={76} />,
    best: getBest("santri-idle"),
    path: "/member/ngaji-ceria/games/santri-idle",
  },
  {
    id: "adab-rpg",
    title: "Jejak Santri",
    genre: "RPG · Cerita",
    description: "Jelajahi pesantren, selesaikan quest.",
    cover: <AdabRpgCoverSvg size={76} />,
    best: getBest("adab-rpg"),
    path: "/member/ngaji-ceria/games/adab-rpg",
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
    // Memicu reaksi Tila saat game diklik
    triggerTilaReaction("play");
    navigate(path);
  };

  return (
    <NgajiCeriaLayout title="Mini Games" showBack>
      <div className="space-y-6 rounded-t-3xl bg-[#F0FDF4] px-4 py-5 md:px-6 md:py-8 min-h-full pb-32">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#0D9488]">
              Asah Kemampuan
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-black text-[#134E4A]">
              Mini Games
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 border-[2px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            <TrophySvg size={16} />
            <span className="text-xs md:text-sm font-black text-[#134E4A]">
              2/3
            </span>
          </div>
        </div>

        {/* Games Grid (Responsif: Mobile 2 cols, Tablet 3 cols, Desktop 4 cols) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {GAMES.map((game, index) => {
            const locked = tier === "guest" && !isGameOpenForGuest(game.id);
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
                  cover={game.cover}
                  best={game.best}
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
