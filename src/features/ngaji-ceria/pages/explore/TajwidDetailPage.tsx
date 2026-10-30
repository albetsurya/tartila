import { Fragment, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  ArrowRight,
  ChevronLeft,
  Volume2,
  Info,
  Play,
  ChartLine,
  Sparkles,
  Key,
} from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import { TAJWID_RULES } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

interface HighlightedArabicProps {
  text: string;
  highlight?: string;
  isActive?: boolean;
  currentTime?: number;
  duration?: number;
}

function HighlightedArabic({
  text,
  highlight,
  isActive = false,
  currentTime = 0,
  duration = 0,
}: HighlightedArabicProps) {
  if (isActive) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return <>{text}</>;

    const wordWeights = words.map((w) => Math.max(w.length, 1));
    const totalWeight = wordWeights.reduce((sum, w) => sum + w, 0);

    const effectiveDuration = duration > 0 ? duration : words.length * 0.75;
    const progress = Math.min(
      Math.max(currentTime / effectiveDuration, 0),
      0.999,
    );
    const targetWeight = progress * totalWeight;

    let accumulated = 0;
    let currentWordIndex = 0;
    for (let i = 0; i < words.length; i++) {
      const wWeight = wordWeights[i];
      if (targetWeight >= accumulated && targetWeight < accumulated + wWeight) {
        currentWordIndex = i;
        break;
      }
      accumulated += wWeight;
      if (i === words.length - 1) {
        currentWordIndex = i;
      }
    }

    return (
      <span className="inline-block leading-[2.4]" dir="rtl">
        {words.map((word, idx) => {
          const isCurrent = idx === currentWordIndex;
          const isPast = idx < currentWordIndex;

          return (
            <span
              key={idx}
              className={`inline-block mx-1 my-0.5 rounded-lg px-2 py-0.5 transition-all duration-150 ${
                isCurrent
                  ? "bg-[#FEF08A] text-[#14532D] font-black scale-105 border-[2px] border-[#451A03]"
                  : isPast
                    ? "text-[#451A03] font-bold opacity-90"
                    : "text-[#78350F]/45 font-medium"
              }`}
            >
              {word}
            </span>
          );
        })}
      </span>
    );
  }

  if (!highlight || !text.includes(highlight)) {
    return <>{text}</>;
  }

  const parts = text.split(highlight);
  return (
    <Fragment>
      {parts.map((part, idx) => (
        <Fragment key={idx}>
          {part}
          {idx < parts.length - 1 && (
            <span className="text-[#15803D] font-black underline decoration-2 decoration-[#15803D]">
              {highlight}
            </span>
          )}
        </Fragment>
      ))}
    </Fragment>
  );
}

/** Aksen Daun & Ranting Hutan untuk Sudut Papan Tulis Kayu */
const LeafTwigCornerSvg = ({ className = "" }: { className?: string }) => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 36 36"
    fill="none"
    className={`pointer-events-none ${className}`}
    aria-hidden="true"
  >
    {/* Ranting Kayu */}
    <path
      d="M4 32 Q 16 18 32 6"
      stroke="#78350F"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Helai Daun Rimba 1 */}
    <path
      d="M12 22 C 6 12, 16 4, 24 12 C 18 18, 14 20, 12 22 Z"
      fill="#22C55E"
      stroke="#14532D"
      strokeWidth="2.2"
    />
    {/* Helai Daun Rimba 2 */}
    <path
      d="M20 24 C 28 28, 34 18, 28 12 C 24 16, 22 20, 20 24 Z"
      fill="#15803D"
      stroke="#14532D"
      strokeWidth="2.2"
    />
  </svg>
);

export default function TajwidDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const index = useMemo(() => {
    const found = TAJWID_RULES.findIndex((rule) => rule.id === id);
    return found === -1 ? 0 : found;
  }, [id]);

  const rule = TAJWID_RULES[index];
  const total = TAJWID_RULES.length;
  const { isPlaying, currentAudioUrl, currentTime, duration, toggle } =
    useAudioPlayer();

  const firstExample = rule.examples[0];
  const isActive = (url?: string) =>
    Boolean(url) && isPlaying && currentAudioUrl === url;

  const handleNext = () => {
    triggerBibiReaction("click");
    if (index < total - 1) {
      navigate(
        `/member/ngaji-ceria/explore/tajwid/${TAJWID_RULES[index + 1].id}`,
      );
    } else {
      navigate("/member/ngaji-ceria/explore/tajwid");
    }
  };

  const handlePrev = () => {
    triggerBibiReaction("click");
    if (index > 0) {
      navigate(
        `/member/ngaji-ceria/explore/tajwid/${TAJWID_RULES[index - 1].id}`,
      );
    } else {
      navigate("/member/ngaji-ceria/explore/tajwid");
    }
  };

  const handlePlayExample = (url: string) => {
    const active = isActive(url);
    triggerBibiReaction(active ? "click" : "play");
    toggle(url);
  };

  const handleBack = () => {
    navigate("/member/ngaji-ceria/explore/tajwid");
  };

  return (
    <NgajiCeriaLayout
      title={rule.title}
      hideHeader={true}
      themeScope="tajwid"
      onBack={handleBack}
    >
      <ThemedHeader
        title={rule.title}
        onBack={handleBack}
        themeColorClass="bg-[#78350F] border-b-[4px] border-[#451A03]"
        textColorClass="text-[#FEF08A]"
        statVariant="stamp"
        statBgClass="bg-[#15803D]"
        statTextClass="text-[#FEF08A]"
        backClass="bg-[#FEF08A] text-[#451A03] border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03]"
      />

      {/* Latar Hijau Hutan Rimba Gelap (#166534) */}
      <div className="min-h-[100dvh] bg-[#166534] relative pb-32 overflow-x-hidden">
        {/* Pola Dedaunan Rimba */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(#4ADE80 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 px-4 py-5 max-w-2xl mx-auto space-y-5">
          {/* Tali Gantungan ke Dahan Pohon */}
          <div className="flex justify-between px-12 -mb-6 relative z-0">
            <div className="h-8 w-2.5 bg-[#D97706] border-x-[2px] border-[#451A03]" />
            <div className="h-8 w-2.5 bg-[#D97706] border-x-[2px] border-[#451A03]" />
          </div>

          {/* 1. Header Banner: Papan Kayu Gantung Pohon dengan Aksen Daun & Ranting */}
          <section className="relative overflow-hidden rounded-[24px] bg-[#78350F] p-5 text-[#FEF3C7] border-[4px] border-[#451A03] shadow-[6px_6px_0px_#451A03]">
            {/* Aksen Daun & Ranting di Sudut Kiri & Kanan */}
            <LeafTwigCornerSvg className="absolute -top-1 -left-1" />
            <LeafTwigCornerSvg className="absolute -bottom-1 -right-1 rotate-180" />

            <div className="absolute right-4 top-4 text-[#FEF08A] rotate-12 opacity-90">
              <Key size={42} />
            </div>

            <div className="relative z-10 max-w-[80%] pl-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#15803D] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FEF08A] border-[2px] border-[#451A03] shadow-[2px_2px_0px_#451A03] mb-2">
                <Sparkles size={12} /> {rule.kaidah}
              </span>
              <h1 className="font-display text-2xl font-black leading-tight text-[#FEF08A]">
                {rule.title}
              </h1>
              <p className="mt-1 text-xs font-bold text-[#FDE68A]">
                {rule.subtitle || "Hukum Nun Mati, Tanwin & Ghunnah"}
              </p>
            </div>
          </section>

          {/* 2. PAPAN TULIS KAYU GANTUNG (Contoh Bacaan & Karaoke) */}
          <section className="relative rounded-[28px] border-[5px] border-[#451A03] bg-[#92400E] p-4 sm:p-5 shadow-[6px_6px_0px_#451A03] space-y-4">
            {/* Aksen Daun & Ranting di Keempat Sudut Papan Tulis Kayu */}
            <LeafTwigCornerSvg className="absolute -top-2 -left-2 z-20" />
            <LeafTwigCornerSvg className="absolute -top-2 -right-2 rotate-90 z-20" />
            <LeafTwigCornerSvg className="absolute -bottom-2 -left-2 -rotate-90 z-20" />
            <LeafTwigCornerSvg className="absolute -bottom-2 -right-2 rotate-180 z-20" />

            <div className="flex items-center justify-between px-2 pt-1">
              <div>
                <span className="inline-block rounded-lg bg-[#FEF08A] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#451A03] border-[2px] border-[#451A03]">
                  Papan Tulis Pohon
                </span>
                <h3 className="font-display font-black text-lg text-[#FEF3C7] mt-1">
                  Contoh Bacaan ({rule.examples?.length || 5} Ayat)
                </h3>
              </div>

              {firstExample && (
                <button
                  type="button"
                  onClick={() => handlePlayExample(firstExample.audioUrl)}
                  className="flex items-center gap-1.5 rounded-xl border-[3px] border-[#451A03] bg-[#15803D] px-3.5 py-2 text-xs font-black text-[#FFFFFF] shadow-[3px_3px_0px_#451A03] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  {isActive(firstExample.audioUrl) ? (
                    <EqualizerIcon
                      isPlaying={true}
                      size={13}
                      barClassName="bg-[#FFFFFF]"
                    />
                  ) : (
                    <Volume2 size={13} />
                  )}
                  {isActive(firstExample.audioUrl) ? "Jeda" : "Dengar"}
                </button>
              )}
            </div>

            {/* List Bilah Papan Kayu Contoh */}
            <div className="space-y-3.5">
              {(rule.examples || []).map((ex, i) => {
                const isExActive = isActive(ex.audioUrl);
                const displayText = isExActive
                  ? ex.fullAyah || ex.arabic
                  : ex.arabic;

                return (
                  <motion.div
                    key={i}
                    layout
                    className={`rounded-2xl border-[3.5px] border-[#451A03] p-4 transition-all ${
                      isExActive
                        ? "bg-[#DCFCE7] shadow-[4px_4px_0px_#14532D]"
                        : "bg-[#FEF3C7] shadow-[4px_4px_0px_#451A03]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-[#451A03] bg-[#D97706] font-display text-xs font-black text-[#FEF3C7] shadow-[2px_2px_0px_#451A03]">
                          {ex.number || `0${i + 1}`}
                        </span>
                        {isExActive && (
                          <span className="inline-flex items-center gap-1 rounded-md border-[2px] border-[#14532D] bg-[#4ADE80] px-2 py-0.5 text-[9px] font-black text-[#14532D]">
                            ● Membaca 1 Ayat Penuh
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlayExample(ex.audioUrl)}
                        aria-label={`Putar contoh ${ex.number || i + 1}`}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                          isExActive
                            ? "bg-[#15803D] text-[#FFFFFF]"
                            : "bg-[#FEF08A] text-[#451A03] hover:bg-[#FDE047]"
                        }`}
                      >
                        {isExActive ? (
                          <EqualizerIcon
                            isPlaying={true}
                            size={14}
                            barClassName="bg-[#FFFFFF]"
                          />
                        ) : (
                          <Play size={14} />
                        )}
                      </button>
                    </div>

                    {/* Teks Arab dengan sinkronisasi karaoke */}
                    <div className="py-2">
                      <p
                        className={`font-arabic text-right text-[#451A03] ${
                          isExActive
                            ? "text-[24px] sm:text-[28px] leading-[2.4]"
                            : "text-[28px] sm:text-[32px] leading-relaxed"
                        }`}
                        dir="rtl"
                      >
                        <HighlightedArabic
                          text={displayText}
                          highlight={ex.highlight}
                          isActive={isExActive}
                          currentTime={currentTime}
                          duration={duration}
                        />
                      </p>
                    </div>

                    {/* Petunjuk tajwid saat tidak aktif */}
                    {!isExActive && (
                      <div className="flex items-center justify-between border-t-[2px] border-dashed border-[#B45309]/40 pt-2 text-[11px] font-bold text-[#78350F]">
                        <span>
                          Sorotan tajwid:{" "}
                          <span className="text-[#15803D] font-black">
                            {ex.highlight}
                          </span>
                        </span>
                        <span className="text-[10px] font-black text-[#B45309]">
                          Ketuk putar untuk 1 ayat penuh
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* 3. Kotak Cara Baca: Papan Kayu Ranting */}
          <section className="flex items-center gap-3 rounded-2xl border-[4px] border-[#451A03] bg-[#FDE68A] p-3.5 shadow-[4px_4px_0px_#451A03]">
            <span className="rounded-xl border-[2.5px] border-[#451A03] bg-[#15803D] px-3 py-1.5 text-[10px] font-black uppercase text-[#FFFFFF] shadow-[2px_2px_0px_#451A03] whitespace-nowrap">
              CARA BACA
            </span>
            <p className="flex-1 text-xs font-black text-[#451A03] italic leading-snug">
              "{rule.caraBaca || "Jelas dan tenang tanpa dengung"}"
            </p>
            <ChartLine size={18} className="text-[#78350F] mr-1 shrink-0" />
          </section>

          {/* 4. Kotak Ingat Kaidahnya: Papan Kayu Pohon */}
          <section className="relative rounded-[24px] border-[4px] border-[#451A03] bg-[#FEF3C7] p-4 shadow-[5px_5px_0px_#451A03]">
            <LeafTwigCornerSvg className="absolute -top-2 -right-2 rotate-90" />
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2.5px] border-[#451A03] bg-[#DCFCE7] shadow-[2px_2px_0px_#451A03]">
                <Info size={16} className="text-[#15803D]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#15803D] mb-1">
                  INGAT KAIDAH RIMBA
                </p>
                <p className="text-xs font-bold text-[#451A03] leading-relaxed mb-3">
                  {rule.note}
                </p>
                <div className="rounded-xl border-[3px] border-[#451A03] bg-[#FFFBEB] p-2.5 text-center shadow-[2px_2px_0px_#451A03]">
                  <p
                    className="font-arabic text-[26px] font-bold text-[#451A03]"
                    dir="rtl"
                  >
                    {rule.huruf || "(ء ه ع ح غ خ)"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 5. Tombol Navigasi Bawah Fixed: Papan Penunjuk Kayu */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#78350F] border-t-[4px] border-[#451A03] flex gap-3 z-50">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Kaidah sebelumnya"
          className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-[#451A03] bg-[#FEF08A] text-[#451A03] shadow-[3px_3px_0px_#451A03] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border-[3px] border-[#451A03] bg-[#15803D] text-[#FFFFFF] font-display text-sm font-black py-3 px-6 shadow-[3px_3px_0px_#451A03] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[#166534] cursor-pointer"
        >
          {index < total - 1
            ? "Papan Materi Berikutnya"
            : "Kembali ke Hutan Tajwid"}
          <ArrowRight size={16} />
        </button>
      </div>
    </NgajiCeriaLayout>
  );
}
