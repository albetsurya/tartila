import { motion } from "framer-motion";
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { useGameAccess } from "../../components/GameLockGuard";
import { LoginPromptModal } from "../../components/LoginPromptModal";
import { OutOfEnergyModal } from "../../components/OutOfEnergyModal";
import { useEconomyStore, isUnlimitedUser } from "../../hooks/useEconomyStore";
import { useAuth } from "../../../../contexts/AuthContext";
import { canonicalGameId, isGameOpenForGuest } from "../../data/gameAccess";
import { getBest } from "./_shared/storage";
import { GameCard } from "./_shared/GameCard";
import {
  HarakatRushCoverSvg,
  MakhrajMasterCoverSvg,
  HijaiyahBeatsCoverSvg,
  JuzAmmaSpeedrunCoverSvg,
  QuranQuizRoyaleCoverSvg,
  NurBattleCoverSvg,
  ArabicWordleCoverSvg,
  AyatScrambleCoverSvg,
  Hijaiyah2048CoverSvg,
  AyatHunterCoverSvg,
  TajwidArenaCoverSvg,
  TajwidDefenseCoverSvg,
  TajwidTetrisCoverSvg,
} from "@/components/ui/Illustrations";

interface HubMode {
  title: string;
  description: string;
  path: string;
  cover: React.ReactNode;
  bestKey: string;
  bgColor: string;
}

const HUBS: Record<
  string,
  {
    title: string;
    tagline: string;
    description: string;
    modes: HubMode[];
  }
> = {
  "ritme-ngaji": {
    title: "Ritme Ngaji",
    tagline: "Hub · Rhythm",
    description:
      "Satu arena untuk melatih harakat, bentuk huruf, dan makhraj. Pilih fokusmu.",
    modes: [
      {
        title: "Harakat Rush",
        description: "Runner tiga lane dengan target harakat dan power-up.",
        path: "/member/ngaji-ceria/games/harakat-rush",
        cover: <HarakatRushCoverSvg size={88} />,
        bestKey: "harakat-rush",
        bgColor: "bg-[#F0FDF4]", // Mint
      },
      {
        title: "Makhraj Master",
        description: "Empat lane rhythm dengan judgement Perfect dan Good.",
        path: "/member/ngaji-ceria/games/makhraj-master",
        cover: <MakhrajMasterCoverSvg size={88} />,
        bestKey: "makhraj-master",
        bgColor: "bg-[#FFF0F0]", // Coral Soft
      },
      {
        title: "Hijaiyah Beats",
        description: "Mode normal atau endless untuk mengikuti bentuk huruf.",
        path: "/member/ngaji-ceria/games/hijaiyah-beats",
        cover: <HijaiyahBeatsCoverSvg size={88} />,
        bestKey: "hijaiyah-beats",
        bgColor: "bg-[#E0F2FE]", // Sky Blue
      },
    ],
  },
  "quiz-ngaji": {
    title: "Quiz Ngaji",
    tagline: "Hub · Kuis",
    description:
      "Pilih format tantangan: speedrun kilat, saf podium, atau panjat menara lentera.",
    modes: [
      {
        title: "Juz Amma Speedrun",
        description: "Sepuluh soal, lima detik per jawaban.",
        path: "/member/ngaji-ceria/games/juz-amma-speedrun",
        cover: <JuzAmmaSpeedrunCoverSvg size={88} />,
        bestKey: "juz-amma-speedrun",
        bgColor: "bg-[#FEF3C7]", // Amber Soft
      },
      {
        title: "Quran Quiz Royale",
        description: "Duduk di saf, bertahan sampai podium masjid.",
        path: "/member/ngaji-ceria/games/quran-quiz-royale",
        cover: <QuranQuizRoyaleCoverSvg size={88} />,
        bestKey: "quran-quiz-royale",
        bgColor: "bg-[#F3E8FF]", // Purple Soft
      },
      {
        title: "Nur Battle",
        description: "Nyalakan tiga lantai menara lentera.",
        path: "/member/ngaji-ceria/games/nur-battle",
        cover: <NurBattleCoverSvg size={88} />,
        bestKey: "nur-battle",
        bgColor: "bg-[#CCFBF1]", // Teal Soft
      },
    ],
  },
  "puzzle-huruf": {
    title: "Puzzle Huruf",
    tagline: "Hub · Puzzle",
    description:
      "Asah kosakata, susun ayat, dan jelajahi peta dalam empat mode tantangan.",
    modes: [
      {
        title: "Arabic Wordle",
        description: "Tebak kata Arab lima huruf.",
        path: "/member/ngaji-ceria/games/arabic-wordle",
        cover: <ArabicWordleCoverSvg size={88} />,
        bestKey: "arabic-wordle:daily",
        bgColor: "bg-[#F0FDF4]",
      },
      {
        title: "Ayat Scramble",
        description: "Susun potongan ayat menjadi urutan yang benar.",
        path: "/member/ngaji-ceria/games/ayat-scramble",
        cover: <AyatScrambleCoverSvg size={88} />,
        bestKey: "ayat-scramble:normal",
        bgColor: "bg-[#FFF0F0]",
      },
      {
        title: "Hijaiyah 2048",
        description: "Gabungkan tile huruf ke level berikutnya.",
        path: "/member/ngaji-ceria/games/hijaiyah-2048",
        cover: <Hijaiyah2048CoverSvg size={88} />,
        bestKey: "hijaiyah-2048",
        bgColor: "bg-[#E0F2FE]",
      },
      {
        title: "Ayat Hunter",
        description:
          "Gerakkan Qirra di peta dan kumpulkan kata sesuai urutan ayat.",
        path: "/member/ngaji-ceria/games/ayat-hunter",
        cover: <AyatHunterCoverSvg size={88} />,
        bestKey: "ayat-hunter",
        bgColor: "bg-[#FEF3C7]",
      },
    ],
  },
  "tajwid-lab": {
    title: "Tajwid Lab",
    tagline: "Hub · Strategi",
    description:
      "Belajar hukum bacaan lewat meja majelis, strategi pertahanan, dan puzzle blok.",
    modes: [
      {
        title: "Tajwid Arena",
        description: "Jawab soal dan mainkan kartu di meja majelis.",
        path: "/member/ngaji-ceria/games/tajwid-arena",
        cover: <TajwidArenaCoverSvg size={88} />,
        bestKey: "tajwid-arena",
        bgColor: "bg-[#F0FDF4]",
      },
      {
        title: "Tajwid Defense",
        description: "Pasang menara hukum tajwid dan tahan wave musuh.",
        path: "/member/ngaji-ceria/games/tajwid-defense",
        cover: <TajwidDefenseCoverSvg size={88} />,
        bestKey: "tajwid-defense",
        bgColor: "bg-[#FFF0F0]",
      },
      {
        title: "Tajwid Tetris",
        description:
          "Susun blok hukum bacaan dan bersihkan baris untuk naik level.",
        path: "/member/ngaji-ceria/games/tajwid-tetris",
        cover: <TajwidTetrisCoverSvg size={88} />,
        bestKey: "tajwid-tetris",
        bgColor: "bg-[#E0F2FE]",
      },
    ],
  },
};

export default function GameModeHubPage({
  hubOverride,
}: {
  hubOverride?: string;
}) {
  const { hub: routeHub } = useParams<{ hub: string }>();
  const navigate = useNavigate();
  const hub = hubOverride ?? routeHub;
  const config = hub ? HUBS[hub] : undefined;
  const { tier } = useGameAccess(hub ?? "");
  const [promptOpen, setPromptOpen] = useState(false);
  const [energyEmpty, setEnergyEmpty] = useState(false);
  const { user, groupId } = useAuth();
  const isVip = useEconomyStore((s) => s.isVip);
  const isUnlimited = isUnlimitedUser(user, isVip, groupId);
  const consumeTicket = useEconomyStore((s) => s.consumeTicket);

  if (!config) return <Navigate to="/member/ngaji-ceria/games" replace />;

  const openMode = (path: string, locked: boolean) => {
    if (locked && tier === "guest") {
      setPromptOpen(true);
      return;
    }
    if (!isUnlimited && !consumeTicket()) {
      setEnergyEmpty(true);
      return;
    }
    navigate(path);
  };

  return (
    <NgajiCeriaLayout
      title={config.title}
      showBack
      onBack={() => navigate("/member/ngaji-ceria/games")}
    >
      <div className="min-h-full bg-[#F0FDF4] px-4 py-4 pb-32">
        {/* Hero Section (Sticker Style) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative overflow-hidden rounded-[24px] border-[3px] border-[#134E4A] bg-[#134E4A] p-5 text-white shadow-[4px_4px_0px_#FF6B6B]"
        >
          {/* Ornamen Latar Tebal */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border-[8px] border-white/10" />

          <p className="relative text-[10px] font-black uppercase tracking-widest text-[#FF6B6B]">
            {config.tagline}
          </p>
          <h2 className="relative mt-1 font-display text-2xl font-black leading-tight">
            {config.title}
          </h2>
          <p className="relative mt-2 max-w-xs text-xs font-medium leading-relaxed text-white/80">
            {config.description}
          </p>

          <div className="relative mt-4 flex items-center gap-1.5">
            {config.modes.map((mode, index) => (
              <span
                key={mode.path}
                className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-[#134E4A] bg-[#FEF08A] text-[10px] font-black text-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
              >
                {index + 1}
              </span>
            ))}
            <span className="ml-2 text-[10px] font-black uppercase tracking-wider text-white/70">
              {config.modes.length} Mode Tersedia
            </span>
          </div>
        </motion.div>

        {/* Mode List (Sticker Card Layout dengan GameCard) */}
        <div className="mt-6 flex flex-col gap-4">
          {config.modes.map((mode, index) => {
            const best = getBest(mode.bestKey);
            const modeId = canonicalGameId(mode.path.split("/").pop() ?? "");
            const locked = tier === "guest" && !isGameOpenForGuest(modeId);

            return (
              <motion.div
                key={mode.path}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + Math.min(index * 0.05, 0.3),
                  duration: 0.25,
                }}
              >
                <GameCard
                  layout="horizontal"
                  title={mode.title}
                  description={mode.description}
                  cover={mode.cover}
                  index={index}
                  best={best}
                  locked={locked}
                  bgColor={mode.bgColor}
                  onClick={() => openMode(mode.path, locked)}
                />
              </motion.div>
            );
          })}
        </div>

        <LoginPromptModal
          open={promptOpen}
          onClose={() => setPromptOpen(false)}
        />

        <OutOfEnergyModal
          visible={energyEmpty}
          type="ticket"
          onClose={() => setEnergyEmpty(false)}
        />
      </div>
    </NgajiCeriaLayout>
  );
}
