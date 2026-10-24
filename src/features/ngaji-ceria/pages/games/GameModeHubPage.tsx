import { motion } from "framer-motion";
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { useGameAccess } from "../../components/GameLockGuard";
import { useActiveGames } from "../../hooks/useActiveGames";
import { isAdminRole } from "@/lib/roles";
import { LoginPromptModal } from "../../components/LoginPromptModal";
import { OutOfEnergyModal } from "../../components/OutOfEnergyModal";
import { useEconomyStore, isUnlimitedUser } from "../../hooks/useEconomyStore";
import { useGameTheme } from "../../hooks/useGameTheme";
import { GameThemeSheet } from "../../components/GameThemeSheet";
import { PaletteSvg } from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";
import { canonicalGameId, isGameOpenForGuest } from "../../data/gameAccess";
import { triggerTilaReaction } from "@/utils/tilaEvent";
import { getBest } from "./_shared/storage";
import { GameCard } from "./_shared/GameCard";
import {
  HarakatRushCoverSvg,
  MakhrajMasterCoverSvg,
  HijaiyahBeatsCoverSvg,
  HijaiyahPopCoverSvg,
  HijaiyahRushCoverSvg,
  HijaiyahMatchArenaCoverSvg,
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
  AdabRpgCoverSvg,
  DoaDungeonCoverSvg,
  NabiChroniclesCoverSvg,
  MalaikatMissionCoverSvg,
  SantriIdleCoverSvg,
  SholatHeroCoverSvg,
  WudhuFlowCoverSvg,
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
    tagline: "Hub · Rhythm & Arcade",
    description:
      "Satu arena untuk melatih harakat, makhraj, refleks arkade, dan pengenalan huruf.",
    modes: [
      {
        title: "Harakat Slasher",
        description: "Tebas huruf harakat target ala fruit ninja dan hindari pengecoh.",
        path: "/member/ngaji-ceria/games/harakat-rush",
        cover: <HarakatRushCoverSvg size={88} />,
        bestKey: "harakat-rush",
        bgColor: "bg-[#F0FDF4]",
      },
      {
        title: "Makhraj Master",
        description: "Empat lane rhythm dengan judgement Perfect dan Good.",
        path: "/member/ngaji-ceria/games/makhraj-master",
        cover: <MakhrajMasterCoverSvg size={88} />,
        bestKey: "makhraj-master",
        bgColor: "bg-[#FFF0F0]",
      },
      {
        title: "Hijaiyah Beats",
        description: "Mode normal atau endless untuk mengikuti bentuk huruf.",
        path: "/member/ngaji-ceria/games/hijaiyah-beats",
        cover: <HijaiyahBeatsCoverSvg size={88} />,
        bestKey: "hijaiyah-beats",
        bgColor: "bg-[#E0F2FE]",
      },
      {
        title: "Hijaiyah Pop",
        description: "Pecahkan buah dan balon huruf hijaiyah secepat kilat.",
        path: "/member/ngaji-ceria/games/hijaiyah-pop",
        cover: <HijaiyahPopCoverSvg size={88} />,
        bestKey: "hijaiyah-pop",
        bgColor: "bg-[#FEF9C3]",
      },
      {
        title: "Hijaiyah Rush",
        description: "Lari dan kumpulkan huruf hijaiyah sambil hindari rintangan.",
        path: "/member/ngaji-ceria/games/hijaiyah-rush",
        cover: <HijaiyahRushCoverSvg size={88} />,
        bestKey: "hijaiyah-rush",
        bgColor: "bg-[#FDF2F8]",
      },
      {
        title: "Hijaiyah Match Arena",
        description: "Adu ingatan mencocokkan kartu huruf hijaiyah kembar.",
        path: "/member/ngaji-ceria/games/hijaiyah-match-arena",
        cover: <HijaiyahMatchArenaCoverSvg size={88} />,
        bestKey: "hijaiyah-match-arena",
        bgColor: "bg-[#F0FDFA]",
      },
    ],
  },
  "quiz-ngaji": {
    title: "Quiz Ngaji",
    tagline: "Hub · Kuis & Trivia",
    description:
      "Pilih format tantangan: speedrun kilat, saf podium, atau panjat menara lentera.",
    modes: [
      {
        title: "Juz Amma Speedrun",
        description: "Sepuluh soal, lima detik per jawaban.",
        path: "/member/ngaji-ceria/games/juz-amma-speedrun",
        cover: <JuzAmmaSpeedrunCoverSvg size={88} />,
        bestKey: "juz-amma-speedrun",
        bgColor: "bg-[#FEF3C7]",
      },
      {
        title: "Quran Quiz Royale",
        description: "Duduk di saf, bertahan sampai podium masjid.",
        path: "/member/ngaji-ceria/games/quran-quiz-royale",
        cover: <QuranQuizRoyaleCoverSvg size={88} />,
        bestKey: "quran-quiz-royale",
        bgColor: "bg-[#F3E8FF]",
      },
      {
        title: "Nur Battle",
        description: "Nyalakan tiga lantai menara lentera dengan ilmu Al-Qur'an.",
        path: "/member/ngaji-ceria/games/nur-battle",
        cover: <NurBattleCoverSvg size={88} />,
        bestKey: "nur-battle",
        bgColor: "bg-[#CCFBF1]",
      },
    ],
  },
  "puzzle-huruf": {
    title: "Puzzle Huruf",
    tagline: "Hub · Puzzle & Kata",
    description:
      "Asah kosakata, susun ayat, dan jelajahi peta dalam empat mode tantangan.",
    modes: [
      {
        title: "Arabic Wordle",
        description: "Tebak kata Arab lima huruf dalam enam kesempatan.",
        path: "/member/ngaji-ceria/games/arabic-wordle",
        cover: <ArabicWordleCoverSvg size={88} />,
        bestKey: "arabic-wordle:daily",
        bgColor: "bg-[#F0FDF4]",
      },
      {
        title: "Ayat Scramble",
        description: "Susun potongan ayat Al-Qur'an menjadi urutan yang benar.",
        path: "/member/ngaji-ceria/games/ayat-scramble",
        cover: <AyatScrambleCoverSvg size={88} />,
        bestKey: "ayat-scramble:normal",
        bgColor: "bg-[#FFF0F0]",
      },
      {
        title: "Hijaiyah 2048",
        description: "Gabungkan tile huruf hijaiyah hingga mencapai huruf akhir.",
        path: "/member/ngaji-ceria/games/hijaiyah-2048",
        cover: <Hijaiyah2048CoverSvg size={88} />,
        bestKey: "hijaiyah-2048",
        bgColor: "bg-[#E0F2FE]",
      },
      {
        title: "Ayat Hunter",
        description: "Temukan ayat Al-Qur'an target sebelum waktu habis.",
        path: "/member/ngaji-ceria/games/ayat-hunter",
        cover: <AyatHunterCoverSvg size={88} />,
        bestKey: "ayat-hunter",
        bgColor: "bg-[#FEF3C7]",
      },
    ],
  },
  "tajwid-lab": {
    title: "Tajwid Lab",
    tagline: "Hub · Strategi Tajwid",
    description: "Duel kartu hukum bacaan, pertahanan menara, dan balok tetris.",
    modes: [
      {
        title: "Tajwid Arena",
        description: "Duel kartu adu hukum bacaan nun sukun dan mad.",
        path: "/member/ngaji-ceria/games/tajwid-arena",
        cover: <TajwidArenaCoverSvg size={88} />,
        bestKey: "tajwid-arena",
        bgColor: "bg-[#CCFBF1]",
      },
      {
        title: "Tajwid Defense",
        description: "Pasang menara hukum tajwid dan tahan gelombang musuh.",
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
  "petualangan-santri": {
    title: "Petualangan Santri",
    tagline: "Hub · RPG & Ibadah",
    description:
      "Jelajahi kisah santri, misi nabi & malaikat, serta praktik ibadah harian.",
    modes: [
      {
        title: "Adab RPG",
        description: "Jelajahi pesantren dan terapkan adab mulia dalam misi cerita.",
        path: "/member/ngaji-ceria/games/adab-rpg",
        cover: <AdabRpgCoverSvg size={88} />,
        bestKey: "adab-rpg",
        bgColor: "bg-[#FEF3C7]",
      },
      {
        title: "Doa Dungeon",
        description: "Eksplorasi labirin doa harian dan taklukkan rintangan.",
        path: "/member/ngaji-ceria/games/doa-dungeon",
        cover: <DoaDungeonCoverSvg size={88} />,
        bestKey: "doa-dungeon",
        bgColor: "bg-[#FEE2E2]",
      },
      {
        title: "Nabi Chronicles",
        description: "Pelajari kisah 25 nabi lewat kronik petualangan interaktif.",
        path: "/member/ngaji-ceria/games/nabi-chronicles",
        cover: <NabiChroniclesCoverSvg size={88} />,
        bestKey: "nabi-chronicles",
        bgColor: "bg-[#E0E7FF]",
      },
      {
        title: "Malaikat Mission",
        description: "Tuntaskan misi 10 malaikat dan kenali tugas-tugas mulianya.",
        path: "/member/ngaji-ceria/games/malaikat-mission",
        cover: <MalaikatMissionCoverSvg size={88} />,
        bestKey: "malaikat-mission",
        bgColor: "bg-[#EDE9FE]",
      },
      {
        title: "Santri Idle",
        description: "Bangun dan kembangkan pondok pesantren santri impian.",
        path: "/member/ngaji-ceria/games/santri-idle",
        cover: <SantriIdleCoverSvg size={88} />,
        bestKey: "santri-idle",
        bgColor: "bg-[#FDF2F8]",
      },
      {
        title: "Sholat Hero",
        description: "Latih gerakan dan bacaan sholat 5 waktu dengan sempurna.",
        path: "/member/ngaji-ceria/games/sholat-hero",
        cover: <SholatHeroCoverSvg size={88} />,
        bestKey: "sholat-hero",
        bgColor: "bg-[#F0FDF4]",
      },
      {
        title: "Wudhu Flow",
        description: "Urutkan dan sempurnakan tata cara wudhu sesuai sunnah.",
        path: "/member/ngaji-ceria/games/wudhu-flow",
        cover: <WudhuFlowCoverSvg size={88} />,
        bestKey: "wudhu-flow",
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
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const { user, groupId } = useAuth();
  const { isGameActive, hasLoaded } = useActiveGames();
  const isAdmin = isAdminRole(user?.role);
  const [maintenanceToast, setMaintenanceToast] = useState<string | null>(null);
  const isVip = useEconomyStore((s) => s.isVip);
  const isUnlimited = isUnlimitedUser(user, isVip, groupId);
  const consumeTicket = useEconomyStore((s) => s.consumeTicket);
  const theme = useGameTheme();

  if (!config) return <Navigate to="/member/ngaji-ceria/games" replace />;

  const openMode = (path: string, locked: boolean, isMaintenance: boolean, modeTitle: string) => {
    if (isMaintenance) {
      setMaintenanceToast(`Game "${modeTitle}" sedang dalam pemeliharaan ustadz. Coba game lain ya!`);
      setTimeout(() => setMaintenanceToast(null), 3000);
      return;
    }
    if (locked && tier === "guest") {
      setPromptOpen(true);
      return;
    }
    if (!isUnlimited && !consumeTicket()) {
      setEnergyEmpty(true);
      return;
    }
    triggerTilaReaction("play");
    navigate(path);
  };

  return (
    <NgajiCeriaLayout
      title={config.title}
      showBack
      onBack={() => navigate("/member/ngaji-ceria/games")}
    >
      <div className={`min-h-full ${theme.bgClass} ${theme.textClass} px-4 py-4 pb-32 transition-colors duration-200`}>
        {/* Hero Section (Sticker Style) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`relative overflow-hidden rounded-[24px] border-[3px] ${theme.heroBorderClass} ${theme.heroBgClass} ${theme.heroShadowClass} p-5`}
        >
          {/* Ornamen Latar Tebal */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border-[8px] border-white/10" />

          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#FEF08A]">
                {config.tagline}
              </p>
              <h2 className="mt-1 font-display text-2xl font-black leading-tight">
                {config.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setThemeSheetOpen(true)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:translate-y-[1px] transition-all cursor-pointer shrink-0"
              title="Ganti Tema Game"
            >
              <PaletteSvg size={18} />
            </button>
          </div>
          <p className="relative mt-2 max-w-xs text-xs font-medium leading-relaxed text-white/80">
            {config.description}
          </p>

          <div className="relative mt-4 flex items-center gap-1.5 flex-wrap">
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

        {/* Toast Notifikasi Pemeliharaan */}
        {maintenanceToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-amber-500 text-white px-4 py-2.5 text-xs font-bold shadow-lg border border-amber-600 animate-in fade-in slide-in-from-top-2">
            {maintenanceToast}
          </div>
        )}

        {/* Mode List (Sticker Card Layout dengan GameCard) */}
        <div className="mt-6 flex flex-col gap-4">
          {config.modes.map((mode, index) => {
            const best = getBest(mode.bestKey);
            const modeId = canonicalGameId(mode.path.split("/").pop() ?? "");
            const isInactive = hasLoaded && !isGameActive(modeId);
            const isMaintenance = isInactive && !isAdmin;
            const locked = (tier === "guest" && !isGameOpenForGuest(modeId)) || isMaintenance;

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
                  description={isMaintenance ? "Sedang dalam pemeliharaan ustadz." : mode.description}
                  cover={mode.cover}
                  index={index}
                  best={best}
                  locked={locked}
                  badge={isMaintenance ? "PEMELIHARAAN" : undefined}
                  bgColor={mode.bgColor}
                  onClick={() => openMode(mode.path, locked, isMaintenance, mode.title)}
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

        <GameThemeSheet
          isOpen={themeSheetOpen}
          onClose={() => setThemeSheetOpen(false)}
        />
      </div>
    </NgajiCeriaLayout>
  );
}
