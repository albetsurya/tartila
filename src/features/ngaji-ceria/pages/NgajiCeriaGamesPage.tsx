import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import {
  Play,
  Star,
  Lock,
  Trophy,
} from "../../../components/ui/FontAwesomeIcons";
import { useGameAccess } from "../components/GameLockGuard";
import { LoginPromptModal } from "../components/LoginPromptModal";
import { isGameOpenForGuest } from "../data/gameAccess";
import { getBest } from "./games/_shared/storage";
import { triggerBibiReaction } from "../../../utils/bibiEvent"; // Pastikan path ini benar

interface GameEntry {
  id: string;
  title: string;
  genre: string;
  description: string;
  cover: string;
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
    cover: NGAJI_CERIA_ASSETS.hijaiyahPop,
    best: getBest("hijaiyah-pop"),
    path: "/member/ngaji-ceria/games/hijaiyah-pop",
  },
  {
    id: "ritme-ngaji",
    title: "Qirra Match",
    genre: "Pasangan Huruf",
    description: "Hub rhythm, harakat, bentuk huruf, dan makhraj.",
    cover: NGAJI_CERIA_ASSETS.harakatRush,
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
    cover: NGAJI_CERIA_ASSETS.quranQuizRoyale,
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
    cover: NGAJI_CERIA_ASSETS.ayatScramble,
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
    cover: NGAJI_CERIA_ASSETS.hijaiyahMatchArena,
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
    cover: NGAJI_CERIA_ASSETS.santriIdle,
    best: getBest("santri-idle"),
    path: "/member/ngaji-ceria/games/santri-idle",
  },
  {
    id: "adab-rpg",
    title: "Jejak Santri",
    genre: "RPG · Cerita",
    description: "Jelajahi pesantren, selesaikan quest.",
    cover: NGAJI_CERIA_ASSETS.adabRpg,
    best: getBest("adab-rpg"),
    path: "/member/ngaji-ceria/games/adab-rpg",
  },
];

function GameCard({
  game,
  index,
  locked,
  onOpen,
}: {
  game: GameEntry;
  index: number;
  locked: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.3 }}
      whileTap={{ scale: 0.95, y: 2, boxShadow: "0px 0px 0px #134E4A" }}
      className={`relative flex flex-col items-center w-full rounded-[24px] bg-white border-[3px] border-[#134E4A] p-3 shadow-[4px_4px_0px_#134E4A] text-left overflow-hidden ${
        locked ? "opacity-80 grayscale-[30%]" : ""
      }`}
    >
      {/* Badge Best Score / Lock */}
      {locked ? (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-gray-200 px-2 py-1 text-[9px] font-black text-gray-500 border-2 border-[#134E4A]">
          <Lock size={10} /> TERKUNCI
        </div>
      ) : game.best > 0 ? (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-[#FEF3C7] px-2 py-1 text-[10px] font-black text-[#D97706] border-2 border-[#134E4A]">
          <Star size={10} className="fill-[#D97706]" /> {game.best}
        </div>
      ) : null}

      {/* Gambar Maskot Game */}
      <div className="relative z-10 mt-4 flex h-24 w-full items-center justify-center">
        {/* Aksen Lingkaran di Belakang Gambar */}
        <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-[#F0FDF4] border-2 border-[#0D9488]/20" />
        <img
          src={game.cover}
          alt=""
          aria-hidden="true"
          className={`relative z-10 h-full w-full object-contain drop-shadow-lg transition-transform duration-300 ${
            locked ? "opacity-50" : ""
          }`}
          draggable={false}
        />
      </div>

      {/* Teks */}
      <div className="mt-3 flex w-full flex-col items-center text-center z-10">
        <h3 className="font-display text-[15px] font-black leading-tight text-[#134E4A] line-clamp-1">
          {game.title}
        </h3>
        <p className="mt-0.5 text-[10px] font-bold text-[#134E4A]/60 line-clamp-1">
          {game.genre}
        </p>
      </div>

      {/* Tombol Main */}
      <div className="mt-3 w-full z-10">
        <span
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl border-2 py-2 text-xs font-black transition-colors ${
            locked
              ? "bg-gray-100 text-gray-400 border-gray-300"
              : "bg-[#FF6B6B] text-white border-[#134E4A]"
          }`}
        >
          {locked ? (
            <>
              <Lock size={12} /> Terkunci
            </>
          ) : (
            <>
              <Play size={12} fill="currentColor" /> Main
            </>
          )}
        </span>
      </div>
    </motion.button>
  );
}

export default function NgajiCeriaGamesPage() {
  const navigate = useNavigate();
  const { tier } = useGameAccess("games");
  const [promptOpen, setPromptOpen] = useState(false);

  const openGame = (path: string, locked: boolean) => {
    if (locked && tier === "guest") {
      setPromptOpen(true);
      return;
    }
    // Memicu reaksi Bibi saat game diklik
    triggerBibiReaction("play");
    navigate(path);
  };

  return (
    <NgajiCeriaLayout title="Mini Games" showBack>
      <div className="space-y-6 rounded-t-3xl bg-[#F0FDF4] px-4 py-5 min-h-full pb-32">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0D9488]">
              Asah Kemampuan
            </p>
            <h2 className="font-display text-2xl font-black text-[#134E4A]">
              Mini Games
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 border-[2px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            <Trophy size={16} className="text-[#F59E0B]" />
            <span className="text-xs font-black text-[#134E4A]">2/3</span>
          </div>
        </div>

        {/* Games Grid (2 Kolom) */}
        <div className="grid grid-cols-2 gap-4">
          {GAMES.map((game, index) => {
            const locked = tier === "guest" && !isGameOpenForGuest(game.id);
            return (
              <GameCard
                key={game.path}
                game={game}
                index={index}
                locked={locked}
                onOpen={() => openGame(game.path, locked)}
              />
            );
          })}

          {/* Coming Soon Card (Disesuaikan dengan gaya Sticker Card) */}
          <div className="relative flex flex-col items-center w-full rounded-[24px] bg-gray-50 border-[3px] border-gray-300 border-dashed p-3 opacity-70">
            <div className="relative z-10 mt-4 flex h-24 w-full items-center justify-center">
              <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-gray-200" />
              <span className="relative z-10 text-3xl">🤫</span>
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
