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

const DropletSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 2.7l5.66 5.66a8 8 0 11-11.31 0L12 2.7z"
      fill="#38BDF8"
      stroke="#0F172A"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 14.5a3.5 3.5 0 005 0"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const PillarSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M4 21h16M4 3h16M6 3v18M18 3v18M10 7v10M14 7v10"
      stroke="#0F172A"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 3h16v3.5H4V3zM4 17.5h16V21H4v-3.5z"
      fill="#F472B6"
      stroke="#0F172A"
      strokeWidth="1.5"
    />
  </svg>
);

const KaabahSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <rect
      x="4"
      y="4.5"
      width="16"
      height="15.5"
      rx="2"
      fill="#1E293B"
      stroke="#0F172A"
      strokeWidth="2.2"
    />
    <path
      d="M4 10h16"
      stroke="#FBBF24"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <rect
      x="13"
      y="13"
      width="4"
      height="7"
      fill="#F59E0B"
      stroke="#0F172A"
      strokeWidth="1.5"
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
          window.sessionStorage.setItem(`arena_is_host_${res.data.pin}`, "true");
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
        return <TilawatiLearningSvg size={26} />;
      case "juz-amma":
        return <QuranSvg size={26} />;
      case "kisah-doa":
        return <HandsPrayingSvg size={26} />;
      case "doa-harian":
        return <HandsPrayingSvg size={26} />;
      case "sejarah-nabi":
        return <PillarSvg size={26} />;
      case "bahasa-arab":
        return <PencilSvg size={26} />;
      case "misi-5-waktu":
        return <MosqueSvg size={26} />;
      case "peta-iman":
        return <MoonSvg size={26} />;
      case "air-kehidupan":
        return <DropletSvg size={26} />;
      case "tameng-ramadan":
        return <ShieldSvg size={26} />;
      case "misi-berbagi":
        return <HandsPrayingSvg size={26} />;
      case "panduan-ksatria":
        return <QuranSvg size={26} />;
      case "lorong-waktu":
        return <PillarSvg size={26} />;
      case "puncak-arafah":
        return <KaabahSvg size={26} />;
      default:
        return <SparklesSvg size={26} />;
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
      <div className="flex w-full flex-col gap-6 pb-12 pt-2 sm:gap-7">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden rounded-[24px] border-[3px] border-[var(--border-color,#134E4A)] bg-[#134E4A] px-4 py-5 text-white shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] sm:rounded-[28px] sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute -right-8 -top-9 h-32 w-32 rounded-full border-[8px] border-white/10 sm:h-40 sm:w-40" />
          <div className="pointer-events-none absolute bottom-2 right-3 rotate-12 text-[#FEF08A]/30 sm:bottom-4 sm:right-6">
            <SparklesSvg size={54} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#FEF08A] bg-[#FEF08A] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#134E4A] sm:text-xs">
                <SparklesSvg size={13} />
                Pilih cara belajarmu
              </span>
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                aria-label="Panduan Pusat Kuis"
                className="flex items-center gap-1.5 rounded-xl border-2 border-white/80 bg-white/20 px-3 py-1 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] hover:bg-white hover:text-[#134E4A] transition-all cursor-pointer"
              >
                <InfoSvg size={14} />
                <span>Panduan</span>
              </button>
            </div>
            <h2 className="mt-3 font-display text-xl font-black leading-tight sm:text-2xl md:text-3xl">
              Asah kemampuanmu!
            </h2>
            <p className="mt-1.5 max-w-xl text-xs font-medium leading-relaxed text-white/85 sm:text-sm">
              Latihan soal, susun kata, atau jelajahi berbagai topik seru di
              Pusat Kuis Tartila.
            </p>
          </div>
        </section>

        {/* 2. ACTION: ARENA & DUEL */}
        <section className="space-y-2.5">
          {/* Main Action: Big Yellow Arena & Duel Button */}
          <button
            type="button"
            disabled={isCreatingRoom}
            onClick={handleCreateArena}
            className="group relative flex w-full items-center justify-between overflow-hidden rounded-[22px] border-[3px] border-[#134E4A] bg-[#FEF3C7] p-4 text-left shadow-[4px_4px_0px_#134E4A] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none sm:p-5 cursor-pointer"
          >
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FDE68A] text-[#D97706] shadow-[2px_2px_0px_#134E4A] sm:h-14 sm:w-14">
                <GamepadSvg size={26} />
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 rounded-md bg-[#FDE68A] px-2 py-0.5 text-[10px] font-black uppercase text-[#92400E]">
                  Multiplayer
                </div>
                <h3 className="font-display text-base font-black text-[#134E4A] leading-tight sm:text-lg">
                  Arena & Duel
                </h3>
                <p className="mt-0.5 truncate text-xs font-semibold text-[#B45309]">
                  {isCreatingRoom
                    ? "Menyiapkan room..."
                    : "Klik untuk langsung buat room dan masuk ke lobi"}
                </p>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] px-3.5 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A]">
                <SparklesSvg size={14} />
                <span>Mulai Mabar</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A] sm:hidden">
                <SparklesSvg size={16} />
              </span>
            </div>
            <span
              className="pointer-events-none absolute -bottom-3 -right-3 opacity-10"
              aria-hidden="true"
            >
              <GamepadSvg size={90} />
            </span>
          </button>

          {/* Sub-actions: Duel 1v1 & Gabung PIN */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/arena/duel/lobby/new")}
              className="flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FFE4E6] hover:bg-[#FECDD3] px-3 py-2.5 text-xs font-black text-[#9F1239] shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <SwordsSvg size={15} />
              <span>Duel 1v1</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/arena/join")}
              className="flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#134E4A] bg-[#DCFCE7] hover:bg-[#BBF7D0] px-3 py-2.5 text-xs font-black text-[#14532D] shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <GamepadSvg size={15} />
              <span>Gabung PIN</span>
            </button>
          </div>
        </section>

        {/* 3. PILIH MODE KUIS (SOLO) */}
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-[#0D9488]">
                Mulai dari sini
              </p>
              <h2 className="mt-0.5 font-display text-lg font-black text-[var(--text-main,#134E4A)] sm:text-xl">
                Pilih Mode Kuis
              </h2>
            </div>
            <span className="shrink-0 text-[11px] font-bold text-[var(--text-main,#134E4A)]/60 sm:text-xs">
              2 mode tersedia
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98, y: 1 }}
              onClick={() => navigate("/quiz-hub/play?mode=mcq")}
              className="group flex min-h-[188px] min-w-0 flex-col items-start justify-between rounded-[20px] border-[3px] border-[#134E4A] bg-[#BAE6FD] p-3 text-left text-[#134E4A] shadow-[3px_3px_0px_#134E4A] transition-all hover:shadow-[4px_4px_0px_#134E4A] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:min-h-[208px] sm:rounded-[24px] sm:p-4 sm:shadow-[4px_4px_0px_#134E4A]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] sm:h-12 sm:w-12 sm:rounded-2xl">
                <GraduationCapSvg size={27} />
              </div>
              <div className="mt-4 w-full">
                <h3 className="font-display text-sm font-black leading-tight text-[#075985] sm:text-lg">
                  Latihan Soal
                </h3>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-[#164E63]">
                  Pilihan ganda, visual, dan rumpang.
                </p>
              </div>
              <span className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white px-2 py-2 text-center text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all group-hover:bg-[#F0F9FF] sm:text-sm">
                Mulai Latihan
              </span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98, y: 1 }}
              onClick={() => navigate("/quiz-hub/play?mode=scramble")}
              className="group flex min-h-[188px] min-w-0 flex-col items-start justify-between rounded-[20px] border-[3px] border-[#134E4A] bg-[#FEF08A] p-3 text-left text-[#134E4A] shadow-[3px_3px_0px_#134E4A] transition-all hover:shadow-[4px_4px_0px_#134E4A] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:min-h-[208px] sm:rounded-[24px] sm:p-4 sm:shadow-[4px_4px_0px_#134E4A]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] sm:h-12 sm:w-12 sm:rounded-2xl">
                <CardsSvg size={27} />
              </div>
              <div className="mt-4 w-full">
                <h3 className="font-display text-sm font-black leading-tight text-[#854D0E] sm:text-lg">
                  Susun Kata
                </h3>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-[#713F12]">
                  Susun potongan kata menjadi jawaban.
                </p>
              </div>
              <span className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white px-2 py-2 text-center text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all group-hover:bg-[#FFFBEB] sm:text-sm">
                Mulai Susun
              </span>
            </motion.button>
          </div>
        </section>

        {/* 4. KATEGORI TOPIK */}
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-[#0D9488]">
                Temukan tantangan
              </p>
              <h2 className="mt-0.5 font-display text-lg font-black text-[var(--text-main,#134E4A)] sm:text-xl">
                Kategori Topik Soal
              </h2>
            </div>
            <span className="shrink-0 rounded-lg border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-2.5 py-1 text-[11px] font-black text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] sm:text-xs">
              {QUIZ_HUB_CATEGORIES.length} topik
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4">
            {QUIZ_HUB_CATEGORIES.map((category) => (
              <motion.button
                key={category.id}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98, y: 1 }}
                onClick={() => setSelectedAdventureCategory(category)}
                aria-label={`Pilih kategori ${category.title}`}
                className="group flex min-h-[148px] min-w-0 flex-col items-start gap-3 rounded-[18px] border-[2.5px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] p-3 text-left text-[var(--text-main,#134E4A)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] transition-all hover:bg-[#FFFBEB] hover:shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:min-h-[160px] sm:rounded-[20px] sm:p-3.5"
              >
                <span className="flex w-full items-start justify-between gap-2">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] sm:h-12 sm:w-12 sm:rounded-2xl"
                    style={{ backgroundColor: category.bgBadge }}
                  >
                    {getCategoryIcon(category.id)}
                  </span>
                  <span
                    className="max-w-[calc(100%-3.5rem)] truncate rounded-full border border-[#134E4A] px-2 py-1 text-[9px] font-black leading-tight sm:text-[10px]"
                    style={{
                      backgroundColor: category.bgBadge,
                      color: category.borderColor,
                    }}
                  >
                    {category.tag}
                  </span>
                </span>

                <span className="line-clamp-2 min-h-10 w-full text-sm font-black leading-snug text-[var(--text-main,#134E4A)] sm:text-[15px]">
                  {category.title}
                </span>

                <span className="mt-auto inline-flex w-full items-center justify-between gap-2 border-t border-dashed border-[var(--border-color,#134E4A)]/25 pt-2 text-[10px] font-black text-[#0D9488] sm:text-[11px]">
                  <span>Pilih topik</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[1px_1px_0px_#134E4A] transition-transform group-hover:translate-x-0.5">
                    <SparklesSvg size={13} />
                  </span>
                </span>
              </motion.button>
            ))}
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
