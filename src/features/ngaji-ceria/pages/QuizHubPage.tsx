import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeftSvg,
  CoinSvg,
  GraduationCapSvg,
  CardsSvg,
  TilawatiLearningSvg,
  QuranSvg,
  HandsPrayingSvg,
  PencilSvg,
  SwordsSvg,
  WhatsAppSvg,
  CopySvg,
  CheckSvg,
  RefreshCwSvg,
  SparklesSvg,
  MosqueSvg,
  MoonSvg,
  ShieldSvg,
} from "@/components/ui/CustomIcons";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { GameLevelSelectSheet } from "./games/_shared/GameLevelSelectSheet";
import { useEconomyStore } from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
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

  const [isChallengeSheetOpen, setIsChallengeSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<QuizHubCategory>("bahasa-arab");
  const [seed, setSeed] = useState(() =>
    Math.floor(10000 + Math.random() * 90000),
  );
  const [isCopied, setIsCopied] = useState(false);

  const handleRandomizeSeed = () => {
    setSeed(Math.floor(10000 + Math.random() * 90000));
    setIsCopied(false);
  };

  const challengerId = user?.username || user?.name || user?.id || "santri";
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/quiz-hub/versus?seed=${seed}&category=${selectedCategory}&challenger=${encodeURIComponent(challengerId)}`
      : `https://tartila.com/quiz-hub/versus?seed=${seed}&category=${selectedCategory}&challenger=${encodeURIComponent(challengerId)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      setIsCopied(true);
    }
  };

  const handleShareWhatsApp = () => {
    const categoryInfo = QUIZ_HUB_CATEGORIES.find(
      (c) => c.id === selectedCategory,
    );
    const catName = categoryInfo ? categoryInfo.title : "Kuis";
    const message = `Bismillah! Aku menantangmu di Pusat Kuis Tartila (Kategori: ${catName}). Ayo buktikan kemampuanmu!\n\nMainkan soal yang sama di tautan berikut:\n${shareUrl}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
      "_blank",
    );
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
    <div className="min-h-screen bg-[var(--bg-app,#F0FDF4)] pb-[calc(6rem+env(safe-area-inset-bottom))] font-sans text-[var(--text-main,#134E4A)] selection:bg-[#FEF08A]">
      <header className="sticky top-0 z-30 border-b-[3px] border-[var(--border-color,#134E4A)] bg-[#FEF08A] px-3 py-3 shadow-[0_3px_0_var(--shadow-color,#134E4A)] pt-[calc(0.75rem+env(safe-area-inset-top))] sm:px-5">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/member/ngaji-ceria/games")}
              aria-label="Kembali ke Mini Games"
              title="Kembali ke Games"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#F8FAFC] active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2"
            >
              <ArrowLeftSvg size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0D9488] sm:text-[11px]">
                Belajar sambil bermain
              </p>
              <h1 className="truncate font-display text-lg font-black leading-tight tracking-tight text-[#134E4A] sm:text-2xl">
                Pusat Kuis
              </h1>
              <p className="hidden text-xs font-bold text-[#134E4A]/70 sm:block">
                Quiz Hub &amp; Latihan Soal
              </p>
            </div>
          </div>

          <div
            aria-label={`${coins} koin`}
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border-2 border-[#134E4A] bg-white px-2.5 py-1.5 text-[#134E4A] shadow-[2px_2px_0px_#134E4A] sm:px-3"
          >
            <CoinSvg size={18} />
            <span className="text-xs font-black tabular-nums sm:text-sm">
              {coins}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-3 pb-8 pt-5 sm:gap-7 sm:px-5 sm:pt-6 md:px-6">
        <section className="relative overflow-hidden rounded-[24px] border-[3px] border-[var(--border-color,#134E4A)] bg-[#134E4A] px-4 py-5 text-white shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] sm:rounded-[28px] sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute -right-8 -top-9 h-32 w-32 rounded-full border-[8px] border-white/10 sm:h-40 sm:w-40" />
          <div className="pointer-events-none absolute bottom-2 right-3 rotate-12 text-[#FEF08A]/30 sm:bottom-4 sm:right-6">
            <SparklesSvg size={54} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#FEF08A] bg-[#FEF08A] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#134E4A] sm:text-xs">
              <SparklesSvg size={13} />
              Pilih cara belajarmu
            </span>
            <h2 className="mt-3 font-display text-xl font-black leading-tight sm:text-2xl md:text-3xl">
              Asah kemampuanmu!
            </h2>
            <p className="mt-1.5 max-w-xl text-xs font-medium leading-relaxed text-white/85 sm:text-sm">
              Latihan soal, susun kata, atau jelajahi berbagai topik seru di
              Pusat Kuis Tartila.
            </p>
          </div>
        </section>

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

        <section>
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99, y: 1 }}
            onClick={() => setIsChallengeSheetOpen(true)}
            className="flex min-h-[76px] w-full items-center gap-3 rounded-[22px] border-[3px] border-[#134E4A] bg-[#E9D5FF] px-4 py-4 text-left text-[#134E4A] shadow-[4px_4px_0px_#134E4A] transition-all hover:bg-[#DDD6FE] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:px-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#6B21A8] shadow-[2px_2px_0px_#134E4A]">
              <SwordsSvg size={27} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-base font-black leading-tight sm:text-lg">
                Tantang Teman
              </span>
              <span className="mt-1 block text-xs font-semibold leading-relaxed text-[#581C87] sm:text-sm">
                Mainkan soal yang sama dalam Versus Mode.
              </span>
            </span>
            <span className="shrink-0 rounded-lg border-2 border-[#134E4A] bg-white px-2.5 py-1.5 text-[11px] font-black shadow-[2px_2px_0px_#134E4A] sm:text-xs">
              Versus
            </span>
          </motion.button>
        </section>
      </main>

      <AppBottomSheet
        isOpen={isChallengeSheetOpen}
        onClose={() => setIsChallengeSheetOpen(false)}
        title="Tantang Teman"
      >
        <div className="space-y-4 pb-2 text-[var(--text-main,#134E4A)]">
          <div className="flex items-center gap-3 border-b-2 border-[var(--border-color,#134E4A)]/15 pb-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#E9D5FF] text-[#6B21A8] shadow-[2px_2px_0px_#134E4A]">
              <SwordsSvg size={21} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-black">
                Buat tantangan baru
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-[var(--text-main,#134E4A)]/65">
                Temanmu akan mendapatkan soal yang sama melalui seed.
              </span>
            </span>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wide text-[var(--text-main,#134E4A)]">
              1. Pilih kategori soal
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {QUIZ_HUB_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={selectedCategory === cat.id}
                  className={`flex min-h-12 min-w-0 items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-left text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-1 ${
                    selectedCategory === cat.id
                      ? "border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                      : "border-[var(--border-color,#134E4A)]/25 bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] hover:bg-[var(--bg-app,#F0FDF4)]"
                  }`}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#134E4A]/30"
                    style={{ backgroundColor: cat.bgBadge }}
                  >
                    {getCategoryIcon(cat.id)}
                  </span>
                  <span className="min-w-0 truncate">{cat.title}</span>
                  {selectedCategory === cat.id && (
                    <CheckSvg size={14} className="ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="block text-xs font-black uppercase tracking-wide text-[var(--text-main,#134E4A)]">
                2. Seed soal
              </label>
              <button
                type="button"
                onClick={handleRandomizeSeed}
                className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[#0369A1]/30 bg-[#E0F2FE] px-2.5 py-1.5 text-xs font-black text-[#075985] transition-colors hover:bg-[#BAE6FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <RefreshCwSvg size={14} />
                <span>Acak ulang</span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-app,#F0FDF4)] px-3 py-3 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]">
              <span className="font-mono text-base font-black tabular-nums text-[var(--text-main,#134E4A)]">
                #{seed}
              </span>
              <span className="text-right text-[11px] font-bold leading-tight text-[var(--text-main,#134E4A)]/60">
                5 soal tersinkronisasi
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wide text-[var(--text-main,#134E4A)]">
              3. Tautan tantangan
            </label>
            <div className="max-h-24 overflow-y-auto break-all rounded-xl border-2 border-dashed border-[var(--border-color,#134E4A)]/35 bg-[var(--bg-app,#F0FDF4)] px-3 py-2.5 text-xs font-medium leading-relaxed text-[var(--text-main,#134E4A)]/75 select-all">
              {shareUrl}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#134E4A] bg-white px-2.5 py-2.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#F0FDF4] active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:text-sm"
            >
              {isCopied ? <CheckSvg size={17} /> : <CopySvg size={17} />}
              <span>{isCopied ? "Tersalin!" : "Salin tautan"}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#134E4A] bg-[#25D366] px-2.5 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#1EBE5D] active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:text-sm"
            >
              <WhatsAppSvg size={18} />
              <span>WhatsApp</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsChallengeSheetOpen(false);
              navigate(
                `/quiz-hub/versus?seed=${seed}&category=${selectedCategory}&challenger=${encodeURIComponent(challengerId)}`,
              );
            }}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#134E4A] bg-[#BAE6FD] px-3 py-2.5 text-xs font-black text-[#075985] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#E0F2FE] active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:text-sm"
          >
            <SparklesSvg size={16} />
            <span>Coba mainkan sendiri dulu</span>
          </button>
        </div>
      </AppBottomSheet>

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
        />
      )}
    </div>
  );
}
