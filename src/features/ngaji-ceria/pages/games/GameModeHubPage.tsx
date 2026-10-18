import { motion } from "framer-motion";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { NGAJI_CERIA_ASSETS } from "../../data/assets";
import { Play, Lock, Star } from "../../../../components/ui/FontAwesomeIcons";
import { useGameAccess } from "../../components/GameLockGuard";
import { LoginPromptModal } from "../../components/LoginPromptModal";
import { OutOfEnergyModal } from "../../components/OutOfEnergyModal";
import { useEconomyStore } from "../../hooks/useEconomyStore";
import { canonicalGameId, isGameOpenForGuest } from "../../data/gameAccess";
import { getBest } from "./_shared/storage";

interface HubMode {
  title: string;
  description: string;
  path: string;
  cover: string;
  bestKey: string;
  bgGradient: string;
}

const HUBS: Record<
  string,
  {
    title: string;
    tagline: string;
    description: string;
    theme: string;
    glow: string;
    modes: HubMode[];
  }
> = {
  "ritme-ngaji": {
    title: "Ritme Ngaji",
    tagline: "Hub · Rhythm",
    description:
      "Satu arena untuk melatih harakat, bentuk huruf, dan makhraj. Pilih fokusmu.",
    theme: "from-[#134E4A] to-[#0D9488]",
    glow: "shadow-[#0D9488]/20",
    modes: [
      {
        title: "Harakat Rush",
        description: "Runner tiga lane dengan target harakat dan power-up.",
        path: "/member/ngaji-ceria/games/harakat-rush",
        cover: NGAJI_CERIA_ASSETS.harakatRush,
        bestKey: "harakat-rush",
        bgGradient: "from-[#F0FDF4] to-[#CCFBF1]",
      },
      {
        title: "Makhraj Master",
        description: "Empat lane rhythm dengan judgement Perfect dan Good.",
        path: "/member/ngaji-ceria/games/makhraj-master",
        cover: NGAJI_CERIA_ASSETS.hijaiyahRush,
        bestKey: "makhraj-master",
        bgGradient: "from-[#FFF0F0] to-[#FFE4E6]",
      },
      {
        title: "Hijaiyah Beats",
        description: "Mode normal atau endless untuk mengikuti bentuk huruf.",
        path: "/member/ngaji-ceria/games/hijaiyah-beats",
        cover: NGAJI_CERIA_ASSETS.hijaiyahPop,
        bestKey: "hijaiyah-beats",
        bgGradient: "from-[#FEF2F2] to-[#FEE2E2]",
      },
    ],
  },
  "quiz-ngaji": {
    title: "Quiz Ngaji",
    tagline: "Hub · Kuis",
    description:
      "Pilih format tantangan: speedrun kilat, saf podium, atau panjat menara lentera.",
    theme: "from-[#134E4A] to-[#0D9488]",
    glow: "shadow-[#0D9488]/20",
    modes: [
      {
        title: "Juz Amma Speedrun",
        description: "Sepuluh soal, lima detik per jawaban.",
        path: "/member/ngaji-ceria/games/juz-amma-speedrun",
        cover: NGAJI_CERIA_ASSETS.juzAmmaSpeedrun,
        bestKey: "juz-amma-speedrun",
        bgGradient: "from-[#F0FDF4] to-[#CCFBF1]",
      },
      {
        title: "Quran Quiz Royale",
        description: "Duduk di saf, bertahan sampai podium masjid.",
        path: "/member/ngaji-ceria/games/quran-quiz-royale",
        cover: NGAJI_CERIA_ASSETS.quranQuizRoyale,
        bestKey: "quran-quiz-royale",
        bgGradient: "from-[#FEF2F2] to-[#FEE2E2]",
      },
      {
        title: "Nur Battle",
        description: "Nyalakan tiga lantai menara lentera.",
        path: "/member/ngaji-ceria/games/nur-battle",
        cover: NGAJI_CERIA_ASSETS.quranQuizRoyale,
        bestKey: "nur-battle",
        bgGradient: "from-[#F0FDFA] to-[#CCFBF1]",
      },
    ],
  },
  "puzzle-huruf": {
    title: "Puzzle Huruf",
    tagline: "Hub · Puzzle",
    description:
      "Asah kosakata, susun ayat, dan jelajahi peta dalam empat mode tantangan.",
    theme: "from-[#134E4A] to-[#0D9488]",
    glow: "shadow-[#0D9488]/20",
    modes: [
      {
        title: "Arabic Wordle",
        description: "Tebak kata Arab lima huruf.",
        path: "/member/ngaji-ceria/games/arabic-wordle",
        cover: NGAJI_CERIA_ASSETS.arabicWordle,
        bestKey: "arabic-wordle:daily",
        bgGradient: "from-[#F0FDF4] to-[#CCFBF1]",
      },
      {
        title: "Ayat Scramble",
        description: "Susun potongan ayat menjadi urutan yang benar.",
        path: "/member/ngaji-ceria/games/ayat-scramble",
        cover: NGAJI_CERIA_ASSETS.ayatScramble,
        bestKey: "ayat-scramble:normal",
        bgGradient: "from-[#FFF0F0] to-[#FFE4E6]",
      },
      {
        title: "Hijaiyah 2048",
        description: "Gabungkan tile huruf ke level berikutnya.",
        path: "/member/ngaji-ceria/games/hijaiyah-2048",
        cover: NGAJI_CERIA_ASSETS.hijaiyah2048,
        bestKey: "hijaiyah-2048",
        bgGradient: "from-[#FEF2F2] to-[#FEE2E2]",
      },
      {
        title: "Ayat Hunter",
        description:
          "Gerakkan Qirra di peta dan kumpulkan kata sesuai urutan ayat.",
        path: "/member/ngaji-ceria/games/ayat-hunter",
        cover: NGAJI_CERIA_ASSETS.ayatHunter,
        bestKey: "ayat-hunter",
        bgGradient: "from-[#F5F3FF] to-[#EDE9FE]",
      },
    ],
  },
  "tajwid-lab": {
    title: "Tajwid Lab",
    tagline: "Hub · Strategi",
    description:
      "Belajar hukum bacaan lewat meja majelis, strategi pertahanan, dan puzzle blok.",
    theme: "from-[#134E4A] to-[#0D9488]",
    glow: "shadow-[#0D9488]/20",
    modes: [
      {
        title: "Tajwid Arena",
        description: "Jawab soal dan mainkan kartu di meja majelis.",
        path: "/member/ngaji-ceria/games/tajwid-arena",
        cover: NGAJI_CERIA_ASSETS.hijaiyahMatchArena,
        bestKey: "tajwid-arena",
        bgGradient: "from-[#F0FDF4] to-[#CCFBF1]",
      },
      {
        title: "Tajwid Defense",
        description: "Pasang menara hukum tajwid dan tahan wave musuh.",
        path: "/member/ngaji-ceria/games/tajwid-defense",
        cover: NGAJI_CERIA_ASSETS.harakatRush,
        bestKey: "tajwid-defense",
        bgGradient: "from-[#FFF0F0] to-[#FFE4E6]",
      },
      {
        title: "Tajwid Tetris",
        description:
          "Susun blok hukum bacaan dan bersihkan baris untuk naik level.",
        path: "/member/ngaji-ceria/games/tajwid-tetris",
        cover: NGAJI_CERIA_ASSETS.tajwidTetris,
        bestKey: "tajwid-tetris",
        bgGradient: "from-[#FEF2F2] to-[#FEE2E2]",
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
  const consumeTicket = useEconomyStore((s) => s.consumeTicket);

  if (!config) return <Navigate to="/member/ngaji-ceria/games" replace />;

  const openMode = (path: string, locked: boolean) => {
    if (locked && tier === "guest") {
      setPromptOpen(true);
      return;
    }
    if (!consumeTicket()) {
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-5 text-white shadow-xl ${config.theme} ${config.glow}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_130%,rgba(255,255,255,.14),transparent_65%)]" />
          <p className="relative text-[10px] font-black uppercase tracking-widest text-[#FF6B6B]">
            {config.tagline}
          </p>
          <h2 className="relative mt-1 font-display text-2xl font-black leading-tight">
            {config.title}
          </h2>
          <p className="relative mt-2 max-w-xs text-xs leading-relaxed text-white/80">
            {config.description}
          </p>
          <div className="relative mt-4 flex items-center gap-1.5">
            {config.modes.map((mode, index) => (
              <span
                key={mode.path}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px] font-black text-white backdrop-blur-sm"
              >
                {index + 1}
              </span>
            ))}
            <span className="ml-2 text-[10px] font-black uppercase tracking-wider text-white/70">
              {config.modes.length} Mode Tersedia
            </span>
          </div>
        </motion.div>

        {/* Mode List (Vertical Layout like main games page) */}
        <div className="mt-6 flex flex-col gap-4">
          {config.modes.map((mode, index) => {
            const best = getBest(mode.bestKey);
            const modeId = canonicalGameId(mode.path.split("/").pop() ?? "");
            const locked = tier === "guest" && !isGameOpenForGuest(modeId);

            return (
              <motion.button
                type="button"
                key={mode.path}
                onClick={() => openMode(mode.path, locked)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 + Math.min(index * 0.05, 0.3),
                  duration: 0.25,
                }}
                whileTap={{ scale: 0.98 }}
                className={`group relative flex w-full overflow-hidden rounded-[28px] bg-gradient-to-br ${mode.bgGradient} p-5 text-left shadow-sm border border-black/5`}
              >
                <div className="relative z-10 flex w-[60%] flex-col items-start">
                  <span className="mb-2 inline-flex items-center gap-1 rounded-md bg-white/60 px-2 py-1 text-[9px] font-black text-[#FF6B6B] uppercase tracking-wider backdrop-blur-sm border border-white/50">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    MODE {index + 1}
                  </span>

                  <h3 className="font-display text-[20px] font-black leading-tight text-[#134E4A]">
                    {mode.title}
                  </h3>
                  <p className="mt-1 text-[11px] font-medium text-[#134E4A]/70 line-clamp-2 pr-2">
                    {mode.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D9488] px-4 py-2 text-[11px] font-bold text-white shadow-sm transition-transform group-active:scale-95">
                      {locked ? (
                        <>
                          <Lock size={12} /> Terkunci
                        </>
                      ) : (
                        <>
                          <Play size={12} /> Mainkan
                        </>
                      )}
                    </span>
                    {best > 0 && !locked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1.5 text-[10px] font-bold text-[#134E4A] backdrop-blur-sm border border-white/50">
                        <Star size={12} className="text-[#FF6B6B]" /> {best}
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute -right-4 -bottom-4 top-0 w-[55%] flex items-center justify-center pointer-events-none">
                  <img
                    src={mode.cover}
                    alt=""
                    aria-hidden="true"
                    className={`h-[120%] w-full object-contain object-right drop-shadow-2xl transition-transform duration-300 group-active:scale-105 ${locked ? "grayscale opacity-50" : ""}`}
                    draggable={false}
                  />
                </div>
              </motion.button>
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
