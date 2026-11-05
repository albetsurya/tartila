import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import {
  GraduationCapSvg,
  CardsSvg,
  TilawatiLearningSvg,
  QuranSvg,
  HandsPrayingSvg,
  PencilSvg,
  SwordsSvg,
  SparklesSvg,
  MosqueSvg,
  MoonSvg,
  ShieldSvg,
  InfoSvg,
  GamepadSvg,
  ArrowRightSvg,
} from "@/components/ui/CustomIcons";
import { GameGuideModal } from "@/components/ui/GameGuideModal";
import { GameLevelSelectSheet } from "./games/_shared/GameLevelSelectSheet";
import { useEconomyStore } from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
import { arenaRoomService } from "@/services/arenaRoomService";
import {
  QUIZ_HUB_CATEGORIES,
  QuizHubCategory,
  QuizCategoryInfo,
  ADVENTURE_LEVEL_DEFINITIONS,
  getCategoryUnlockedLevel,
} from "../data/quizHubData";

/* ============================================================================
   CUSTOM NEO-BRUTALIST ILLUSTRATIONS & CATEGORY ICONS (NO EMOJIS)
   ============================================================================ */

const DropletSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 26,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M15 4.5L20.8 10.3a8.2 8.2 0 11-11.6 0L15 4.5z"
      fill="#134E4A"
    />
    <path
      d="M13.5 3L19.3 8.8a8.2 8.2 0 11-11.6 0L13.5 3z"
      fill="#38BDF8"
      stroke="#134E4A"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 15.5a3.5 3.5 0 005 0"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const PillarSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 26,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <rect x="6" y="5" width="18" height="20" rx="2" fill="#134E4A" />
    <rect
      x="6"
      y="6"
      width="15"
      height="16"
      fill="#FEF3C7"
      stroke="#134E4A"
      strokeWidth="2.2"
    />
    <line x1="10.5" y1="7" x2="10.5" y2="21" stroke="#134E4A" strokeWidth="2" />
    <line x1="16.5" y1="7" x2="16.5" y2="21" stroke="#134E4A" strokeWidth="2" />
    <rect
      x="4"
      y="3.5"
      width="19"
      height="4"
      rx="1.5"
      fill="#F472B6"
      stroke="#134E4A"
      strokeWidth="2.2"
    />
    <rect
      x="4"
      y="20.5"
      width="19"
      height="4"
      rx="1.5"
      fill="#F472B6"
      stroke="#134E4A"
      strokeWidth="2.2"
    />
  </svg>
);

const KaabahSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 26,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <rect x="6" y="6" width="18" height="18" rx="2.5" fill="#134E4A" />
    <rect
      x="4.5"
      y="4.5"
      width="18"
      height="18"
      rx="2.5"
      fill="#1E293B"
      stroke="#134E4A"
      strokeWidth="2.4"
    />
    <path
      d="M4.5 10.5H22.5"
      stroke="#FACC15"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <rect
      x="14"
      y="14"
      width="4.5"
      height="8.5"
      rx="1"
      fill="#F59E0B"
      stroke="#134E4A"
      strokeWidth="1.8"
    />
  </svg>
);

/** Ilustrasi Vektor Hero Pusat Kuis (Piala, Kartu Kuis, & Bintang) */
const QuizHubHeroSvg = () => (
  <svg
    viewBox="0 0 150 105"
    fill="none"
    className="hidden sm:block w-32 h-24 shrink-0 overflow-visible"
    aria-hidden="true"
  >
    {/* Kartu Soal di Kiri */}
    <g transform="rotate(-12 36 48)">
      <rect x="14" y="22" width="40" height="52" rx="7" fill="#042F2E" />
      <rect
        x="10"
        y="18"
        width="40"
        height="52"
        rx="7"
        fill="#38BDF8"
        stroke="#134E4A"
        strokeWidth="3"
      />
      <rect
        x="17"
        y="27"
        width="26"
        height="14"
        rx="3"
        fill="#FFFBEB"
        stroke="#134E4A"
        strokeWidth="2"
      />
      <line
        x1="18"
        y1="49"
        x2="42"
        y2="49"
        stroke="#134E4A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="57"
        x2="34"
        y2="57"
        stroke="#134E4A"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>

    {/* Kartu Susun Kata di Kanan */}
    <g transform="rotate(12 114 48)">
      <rect x="96" y="22" width="40" height="52" rx="7" fill="#042F2E" />
      <rect
        x="92"
        y="18"
        width="40"
        height="52"
        rx="7"
        fill="#FB7185"
        stroke="#134E4A"
        strokeWidth="3"
      />
      <circle
        cx="112"
        cy="44"
        r="11"
        fill="#FEF08A"
        stroke="#134E4A"
        strokeWidth="2.5"
      />
      <path
        d="M108 44L111 47L117 41"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>

    {/* Piala Emas Utama di Tengah */}
    <path
      d="M52 24H98L92 62C90 74 82 78 75 78C68 78 60 74 58 62L52 24Z"
      fill="#FACC15"
      stroke="#134E4A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <rect
      x="69"
      y="76"
      width="12"
      height="12"
      fill="#EAB308"
      stroke="#134E4A"
      strokeWidth="3"
    />
    <rect
      x="55"
      y="86"
      width="40"
      height="11"
      rx="4"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="3"
    />
    {/* Bintang di Tengah Piala */}
    <path
      d="M75 34L78.5 41.5L86.5 42.5L80.5 48L82 56L75 52L68 56L69.5 48L63.5 42.5L71.5 41.5L75 34Z"
      fill="#FFFFFF"
      stroke="#134E4A"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

/** Ilustrasi Sudut untuk Kartu Arena & Duel */
const ArenaBattleArtSvg = () => (
  <svg
    viewBox="0 0 120 90"
    fill="none"
    className="pointer-events-none absolute -right-2 -bottom-2 w-28 h-20 opacity-25 group-hover:opacity-40 transition-opacity"
    aria-hidden="true"
  >
    <circle
      cx="78"
      cy="52"
      r="28"
      fill="#F59E0B"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <path
      d="M82 32L68 52H78L72 72L90 48H79L82 32Z"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

/** Ilustrasi Sudut untuk Mode Latihan Soal (MCQ) */
const McqModeArtSvg = () => (
  <svg
    viewBox="0 0 110 80"
    fill="none"
    className="pointer-events-none absolute -right-1 -bottom-1 w-24 h-18 opacity-25 group-hover:opacity-40 transition-opacity"
    aria-hidden="true"
  >
    <rect
      x="38"
      y="16"
      width="58"
      height="56"
      rx="8"
      transform="rotate(-6 38 16)"
      fill="#38BDF8"
      stroke="#134E4A"
      strokeWidth="3"
    />
    <circle
      cx="56"
      cy="34"
      r="5"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="2"
    />
    <line
      x1="66"
      y1="34"
      x2="84"
      y2="32"
      stroke="#134E4A"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle
      cx="58"
      cy="50"
      r="5"
      fill="#4ADE80"
      stroke="#134E4A"
      strokeWidth="2"
    />
    <line
      x1="68"
      y1="50"
      x2="86"
      y2="48"
      stroke="#134E4A"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/** Ilustrasi Sudut untuk Mode Susun Kata (Scramble) */
const ScrambleModeArtSvg = () => (
  <svg
    viewBox="0 0 110 80"
    fill="none"
    className="pointer-events-none absolute -right-1 -bottom-1 w-24 h-18 opacity-25 group-hover:opacity-40 transition-opacity"
    aria-hidden="true"
  >
    <rect
      x="34"
      y="34"
      width="32"
      height="32"
      rx="6"
      transform="rotate(-10 34 34)"
      fill="#FACC15"
      stroke="#134E4A"
      strokeWidth="3"
    />
    <rect
      x="64"
      y="22"
      width="32"
      height="32"
      rx="6"
      transform="rotate(8 64 22)"
      fill="#FB923C"
      stroke="#134E4A"
      strokeWidth="3"
    />
  </svg>
);

export default function QuizHubPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const coins = useEconomyStore((s) => s.coins);

  const [selectedAdventureCategory, setSelectedAdventureCategory] =
    useState<QuizCategoryInfo | null>(null);

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleCreateArena = async () => {
    if (isCreatingRoom) return;
    setIsCreatingRoom(true);
    try {
      const hostId = user?.id || `host-${Date.now()}`;
      const hostName = user?.name || user?.username || "Host";
      const res = await arenaRoomService.createRoom({
        hostId,
        hostName,
        roomType: "casual",
        title: "Mabar Santri",
        kkm: 75,
        questions: [],
      });
      if (res.ok && res.data?.pin) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            `arena_is_host_${res.data.pin}`,
            "true",
          );
          window.sessionStorage.setItem("arena_player_name", hostName);
        }
        navigate(`/arena/lobby/${res.data.pin}`);
      } else {
        alert("Gagal membuat room arena. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Gagal membuat arena:", err);
      alert("Terjadi kesalahan koneksi saat membuat room.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const getCategoryIcon = (catId: QuizHubCategory) => {
    switch (catId) {
      case "tilawati":
        return <TilawatiLearningSvg size={24} />;
      case "juz-amma":
        return <QuranSvg size={24} />;
      case "kisah-doa":
        return <HandsPrayingSvg size={24} />;
      case "doa-harian":
        return <HandsPrayingSvg size={24} />;
      case "sejarah-nabi":
        return <PillarSvg size={24} />;
      case "bahasa-arab":
        return <PencilSvg size={24} />;
      case "misi-5-waktu":
        return <MosqueSvg size={24} />;
      case "peta-iman":
        return <MoonSvg size={24} />;
      case "air-kehidupan":
        return <DropletSvg size={24} />;
      case "tameng-ramadan":
        return <ShieldSvg size={24} />;
      case "misi-berbagi":
        return <HandsPrayingSvg size={24} />;
      case "panduan-ksatria":
        return <QuranSvg size={24} />;
      case "lorong-waktu":
        return <PillarSvg size={24} />;
      case "puncak-arafah":
        return <KaabahSvg size={24} />;
      default:
        return <SparklesSvg size={24} />;
    }
  };

  const unlockedLevel = selectedAdventureCategory
    ? getCategoryUnlockedLevel(selectedAdventureCategory.id)
    : 1;

  return (
    <NgajiCeriaLayout
      title="Pusat Kuis"
      showBack={true}
      onBack={() => navigate("/member/ngaji-ceria/games")}
    >
      <div className="flex w-full flex-col gap-4 sm:gap-5 pb-14 pt-1 select-none">
        {/* =============================================================== */}
        {/* 1. COMPACT HERO BANNER DENGAN ILUSTRASI PIALA KUIS              */}
        {/* =============================================================== */}
        <section className="relative overflow-hidden rounded-2xl border-[3.5px] border-[#134E4A] bg-[#134E4A] px-4 py-4 text-white shadow-[5px_5px_0px_#042F2E] sm:rounded-3xl sm:px-6 sm:py-4.5">
          <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full border-[6px] border-white/10" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#134E4A] shadow-[2px_2px_0px_#042F2E]">
                  <SparklesSvg size={12} />
                  <span>Arena & Latihan Kuis</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  aria-label="Panduan Pusat Kuis"
                  className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] hover:bg-[#FEF08A] px-2.5 py-0.5 text-[11px] font-black text-[#134E4A] shadow-[2px_2px_0px_#042F2E] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <InfoSvg size={13} />
                  <span>Panduan</span>
                </button>
              </div>

              <h1 className="font-display text-lg font-black leading-tight sm:text-2xl text-[#FEF3C7]">
                Asah Kemampuan & Tantang Temanmu!
              </h1>
              <p className="mt-1 max-w-xl text-xs font-bold leading-snug text-white/85">
                Mainkan kuis multiplayer real-time, latihan cepat, atau
                selesaikan 14 misi topik petualangan.
              </p>
            </div>

            <QuizHubHeroSvg />
          </div>
        </section>

        {/* =============================================================== */}
        {/* 2. BENTO COMMAND GRID: MULTIPLAYER ARENA & MODE SOLO CEPAT      */}
        {/* =============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* KOLOM KIRI (6 KOLOM): MULTIPLAYER ARENA & DUEL */}
          <section className="lg:col-span-6 flex flex-col justify-between rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FFFBEB] p-3.5 sm:p-4 shadow-[4px_4px_0px_#134E4A] gap-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#B45309]">
                <GamepadSvg size={14} /> Mode Multiplayer Live
              </span>
              <span className="rounded-md border border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[10px] font-black text-[#134E4A]">
                Real-Time Battle
              </span>
            </div>

            {/* Tombol Utama Buat Room Mabar */}
            <button
              type="button"
              disabled={isCreatingRoom}
              onClick={handleCreateArena}
              className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl border-[3px] border-[#134E4A] bg-[#FEF3C7] hover:bg-[#FDE68A] p-3.5 text-left shadow-[3.5px_3.5px_0px_#134E4A] transition-all active:translate-y-[2px] active:shadow-none cursor-pointer"
            >
              <ArenaBattleArtSvg />

              <div className="relative z-10 flex items-center gap-3 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-[#134E4A] bg-[#FACC15] text-[#134E4A] shadow-[2px_2px_0px_#134E4A] group-hover:scale-105 transition-transform">
                  <GamepadSvg size={26} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-base font-black text-[#134E4A] leading-tight">
                    Arena Mabar & Turnamen
                  </h2>
                  <p className="mt-0.5 truncate text-xs font-bold text-[#92400E]">
                    {isCreatingRoom
                      ? "Menyiapkan room lobi..."
                      : "Buat PIN instan & undang teman sekelas"}
                  </p>
                </div>
              </div>

              <span className="relative z-10 shrink-0 inline-flex items-center gap-1.5 rounded-xl border-[2.5px] border-[#134E4A] bg-[#0D9488] group-hover:bg-[#0F766E] px-3 py-2 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A]">
                <SparklesSvg size={14} />
                <span className="hidden sm:inline">Buat Room</span>
              </span>
            </button>

            {/* Sub-aksi: Duel 1v1 & Gabung PIN */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/arena/duel/lobby/new")}
                className="flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FFE4E6] hover:bg-[#FECDD3] px-3 py-2.5 text-xs font-black text-[#9F1239] shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                <SwordsSvg size={15} />
                <span>Duel 1v1 Cepat</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/arena/join")}
                className="flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#134E4A] bg-[#DCFCE7] hover:bg-[#BBF7D0] px-3 py-2.5 text-xs font-black text-[#14532D] shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                <GamepadSvg size={15} />
                <span>Masuk Kode PIN</span>
              </button>
            </div>
          </section>

          {/* KOLOM KANAN (6 KOLOM): PILIH MODE KUIS SOLO (KOMPAK & ILUSTRATIF) */}
          <section className="lg:col-span-6 flex flex-col justify-between rounded-2xl border-[3.5px] border-[#134E4A] bg-white p-3.5 sm:p-4 shadow-[4px_4px_0px_#134E4A] gap-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#0D9488]">
                <GraduationCapSvg size={14} /> Mode Latihan Mandiri
              </span>
              <span className="rounded-md border border-[#134E4A] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-black text-[#065F46]">
                2 Mode Solo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
              {/* Kartu 1: Latihan Soal (MCQ) */}
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/quiz-hub/play?mode=mcq")}
                className="group relative overflow-hidden flex flex-col justify-between rounded-xl border-[3px] border-[#134E4A] bg-[#BAE6FD] hover:bg-[#7DD3FC] p-3.5 text-left text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:shadow-none transition-all cursor-pointer min-h-[126px]"
              >
                <McqModeArtSvg />

                <div className="relative z-10 flex items-start gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] group-hover:scale-105 transition-transform">
                    <GraduationCapSvg size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm sm:text-base font-black leading-tight text-[#075985]">
                      Latihan Soal
                    </h3>
                    <p className="mt-0.5 text-[11px] font-bold leading-snug text-[#164E63] line-clamp-2">
                      Pilihan ganda, visual, & tebak rumpang.
                    </p>
                  </div>
                </div>

                <span className="relative z-10 mt-3 inline-flex w-full items-center justify-between rounded-lg border-2 border-[#134E4A] bg-white px-2.5 py-1.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] group-hover:bg-[#F0F9FF]">
                  <span>Mulai Latihan</span>
                  <ArrowRightSvg size={13} />
                </span>
              </motion.button>

              {/* Kartu 2: Susun Kata (Scramble) */}
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/quiz-hub/play?mode=scramble")}
                className="group relative overflow-hidden flex flex-col justify-between rounded-xl border-[3px] border-[#134E4A] bg-[#FEF08A] hover:bg-[#FDE047] p-3.5 text-left text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:shadow-none transition-all cursor-pointer min-h-[126px]"
              >
                <ScrambleModeArtSvg />

                <div className="relative z-10 flex items-start gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] group-hover:scale-105 transition-transform">
                    <CardsSvg size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm sm:text-base font-black leading-tight text-[#854D0E]">
                      Susun Kata
                    </h3>
                    <p className="mt-0.5 text-[11px] font-bold leading-snug text-[#713F12] line-clamp-2">
                      Rangkai potongan kata menjadi jawaban tepat.
                    </p>
                  </div>
                </div>

                <span className="relative z-10 mt-3 inline-flex w-full items-center justify-between rounded-lg border-2 border-[#134E4A] bg-white px-2.5 py-1.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] group-hover:bg-[#FFFBEB]">
                  <span>Mulai Susun</span>
                  <ArrowRightSvg size={13} />
                </span>
              </motion.button>
            </div>
          </section>
        </div>

        {/* =============================================================== */}
        {/* 3. KATEGORI TOPIK SOAL (KOMPAK DENGAN INDIKATOR LEVEL)          */}
        {/* =============================================================== */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                <SparklesSvg size={16} />
              </div>
              <div>
                <h2 className="font-display text-base font-black text-[var(--text-main,#134E4A)] sm:text-lg leading-none">
                  Eksplorasi Topik Kuis
                </h2>
                <p className="text-[11px] font-bold text-[var(--text-main,#134E4A)]/65 mt-0.5">
                  Pilih topik untuk membuka tahapan level petualangan
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[#CCFBF1] px-3 py-1 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]">
              {QUIZ_HUB_CATEGORIES.length} Topik
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {QUIZ_HUB_CATEGORIES.map((category) => {
              const catUnlockedLvl = getCategoryUnlockedLevel(category.id);

              return (
                <motion.button
                  key={category.id}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98, y: 1 }}
                  onClick={() => setSelectedAdventureCategory(category)}
                  aria-label={`Pilih kategori ${category.title}`}
                  className="group relative overflow-hidden flex flex-col justify-between gap-2.5 rounded-2xl border-[2.5px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] p-3 text-left text-[var(--text-main,#134E4A)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] transition-all hover:bg-[#FFFBEB] hover:shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] cursor-pointer"
                >
                  {/* Aksen Sudut Dekoratif Sesuai Warna Kategori */}
                  <span
                    className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full border-2 border-[#134E4A]/20 opacity-45 transition-transform group-hover:scale-125"
                    style={{ backgroundColor: category.bgBadge }}
                  />

                  {/* Baris Atas: Ikon + Tag */}
                  <div className="relative z-10 flex w-full items-start justify-between gap-2">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: category.bgBadge }}
                    >
                      {getCategoryIcon(category.id)}
                    </span>
                    <span
                      className="max-w-[calc(100%-3rem)] truncate rounded-lg border-[1.5px] border-[#134E4A] px-2 py-0.5 text-[9px] font-black uppercase leading-tight shadow-[1px_1px_0px_#134E4A]"
                      style={{
                        backgroundColor: category.bgBadge,
                        color: "#134E4A",
                      }}
                    >
                      {category.tag}
                    </span>
                  </div>

                  {/* Judul Kategori */}
                  <div className="relative z-10">
                    <h3 className="line-clamp-1 font-display text-xs sm:text-sm font-black leading-snug text-[var(--text-main,#134E4A)]">
                      {category.title}
                    </h3>
                  </div>

                  {/* Baris Bawah: Status Level Terbuka & Tombol Panah */}
                  <div className="relative z-10 flex w-full items-center justify-between gap-1.5 border-t-2 border-dashed border-[var(--border-color,#134E4A)]/15 pt-2 text-[10px] font-black">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F0FDF4] border border-[#134E4A] px-1.5 py-0.5 text-[9px] text-[#065F46]">
                      Lv. {catUnlockedLvl} Terbuka
                    </span>

                    <span className="inline-flex items-center gap-1 text-[#0D9488] group-hover:translate-x-0.5 transition-transform">
                      <span>Main</span>
                      <ArrowRightSvg size={11} />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>

      {selectedAdventureCategory && (
        <GameLevelSelectSheet
          isOpen={true}
          onClose={() => setSelectedAdventureCategory(null)}
          gameTitle={selectedAdventureCategory.title}
          gameIcon={getCategoryIcon(selectedAdventureCategory.id)}
          levels={ADVENTURE_LEVEL_DEFINITIONS.map((lvl) => ({
            id: lvl.level,
            title: `Level ${lvl.level}: ${lvl.name}`,
            description:
              lvl.level <= unlockedLevel
                ? "Siap untuk dimainkan"
                : "Selesaikan level sebelumnya",
          }))}
          unlockedCount={unlockedLevel}
          onSelectLevel={(idx) => {
            const catId = selectedAdventureCategory.id;
            setSelectedAdventureCategory(null);
            navigate(`/quiz-hub/play?category=${catId}&level=${idx + 1}`);
          }}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
      )}

      <GameGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        gameId="quiz-hub"
      />
    </NgajiCeriaLayout>
  );
}