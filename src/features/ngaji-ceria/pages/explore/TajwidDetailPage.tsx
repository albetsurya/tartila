import { Fragment, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  ArrowRight,
  ChevronLeft,
  Volume2,
  Info,
  Play,
  PlayCircle,
  Pause,
  ChartLine,
  Sparkles,
  Key,
} from "../../../../components/ui/CustomIcons";
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

/**
 * Komponen Teks Arab dengan dukungan:
 * 1. Mode Statis (Audio tidak aktif): Highlight kata/huruf tajwid (berwarna #0284C7).
 * 2. Mode Karaoke (Audio aktif): Memecah 1 ayat penuh menjadi kata-kata dan
 *    menyorot kata yang sedang dibaca seiring berjalannya audio (Warna #0284C7 + background bg-blue-100).
 */
function HighlightedArabic({
  text,
  highlight,
  isActive = false,
  currentTime = 0,
  duration = 0,
}: HighlightedArabicProps) {
  // --- KONDISI 1: Audio sedang AKTIF -> Efek Karaoke Sinkronisasi Waktu ---
  if (isActive) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return <>{text}</>;

    // Hitung bobot proporsional setiap kata berdasarkan panjang karakter
    const wordWeights = words.map((w) => Math.max(w.length, 1));
    const totalWeight = wordWeights.reduce((sum, w) => sum + w, 0);

    // Durasi efektif (fallback jika metadata audio belum selesai memuat)
    const effectiveDuration = duration > 0 ? duration : words.length * 0.75;
    const progress = Math.min(
      Math.max(currentTime / effectiveDuration, 0),
      0.999,
    );
    const targetWeight = progress * totalWeight;

    // Tentukan kata mana yang aktif saat ini
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
                  ? "bg-blue-100 text-[#0284C7] font-black scale-105 shadow-sm border-2 border-[#0284C7]/40 ring-2 ring-[#0284C7]/20"
                  : isPast
                  ? "text-[#134E4A] font-bold opacity-90"
                  : "text-[#134E4A]/40 font-medium"
              }`}
            >
              {word}
            </span>
          );
        })}
      </span>
    );
  }

  // --- KONDISI 2: Audio TIDAK aktif -> Highlight statis tajwid ---
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
            <span className="text-[#0284C7] font-black underline decoration-2 decoration-[#0284C7]/50">
              {highlight}
            </span>
          )}
        </Fragment>
      ))}
    </Fragment>
  );
}

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

  return (
    <NgajiCeriaLayout
      title="Detail Tajwid"
      onBack={() => navigate("/member/ngaji-ceria/explore/tajwid")}
    >
      <div className="min-h-full bg-[#F0FDF4] pb-32">
        <div className="px-4 py-4 space-y-4">
          {/* 1. Header Banner (Sticker Style) */}
          <section className="relative overflow-hidden rounded-[24px] bg-[#134E4A] p-5 text-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#15803D]">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full border-[6px] border-white/5" />
            <div className="absolute right-4 top-4 text-[#86EFAC] rotate-12 opacity-80">
              <Key size={44} />
            </div>

            <div className="relative z-10 max-w-[80%]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#86EFAC] border border-[#86EFAC]/30 mb-2">
                <Sparkles size={12} /> {rule.kaidah}
              </span>
              <h1 className="font-display text-2xl font-black leading-tight text-white">
                {rule.title}
              </h1>
              <p className="mt-1 text-xs font-semibold text-white/80">
                {rule.subtitle || "Hukum Nun Mati, Tanwin & Ghunnah"}
              </p>
            </div>
          </section>

          {/* 2. Kartu Contoh Bacaan & Karaoke (Sticker Style) */}
          <section className="rounded-[28px] border-[3px] border-[#134E4A] bg-white p-5 shadow-[4px_4px_0px_#134E4A] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block rounded-md bg-[#0284C7]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#0284C7] border border-[#0284C7]/20">
                  Latihan Interaktif
                </span>
                <h3 className="font-display font-black text-lg text-[#134E4A] mt-0.5">
                  Contoh Bacaan ({rule.examples?.length || 5} Ayat)
                </h3>
              </div>

              {firstExample && (
                <button
                  type="button"
                  onClick={() => handlePlayExample(firstExample.audioUrl)}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#0284C7] px-3.5 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  {isActive(firstExample.audioUrl) ? (
                    <Pause size={13} />
                  ) : (
                    <Volume2 size={13} />
                  )}
                  {isActive(firstExample.audioUrl) ? "Jeda" : "Dengar"}
                </button>
              )}
            </div>

            {/* List Contoh */}
            <div className="space-y-3">
              {(rule.examples || []).map((ex, i) => {
                const isExActive = isActive(ex.audioUrl);
                const displayText = isExActive
                  ? ex.fullAyah || ex.arabic
                  : ex.arabic;

                return (
                  <motion.div
                    key={i}
                    layout
                    className={`rounded-2xl border-[3px] border-[#134E4A] p-4 transition-all ${
                      isExActive
                        ? "bg-[#F0F9FF] shadow-[4px_4px_0px_#0284C7] ring-2 ring-[#0284C7]/20"
                        : "bg-[#FAFAFA] shadow-[3px_3px_0px_#134E4A]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] font-display text-xs font-black text-[#134E4A] shadow-sm">
                          {ex.number || `0${i + 1}`}
                        </span>
                        {isExActive && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#0284C7] bg-blue-50 px-2 py-0.5 text-[9px] font-black text-[#0284C7] animate-pulse">
                            ● Membaca 1 Ayat Penuh
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlayExample(ex.audioUrl)}
                        aria-label={`Putar contoh ${ex.number || i + 1}`}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all ${
                          isExActive
                            ? "bg-[#0284C7] text-white"
                            : "bg-white text-[#134E4A] hover:bg-[#E0F2FE]"
                        }`}
                      >
                        {isExActive ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    </div>

                    {/* Teks Arab dengan sinkronisasi karaoke */}
                    <div className="py-2">
                      <p
                        className={`font-arabic text-right text-[#134E4A] ${
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
                      <div className="flex items-center justify-between border-t border-[#134E4A]/10 pt-2 text-[11px] font-bold text-[#134E4A]/60">
                        <span>Sorotan tajwid: <span className="text-[#0284C7] font-black">{ex.highlight}</span></span>
                        <span className="text-[10px] text-[#0284C7]">Klik dengar untuk 1 ayat penuh</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* 3. Kotak Cara Baca (Sticker Style) */}
          <section className="flex items-center gap-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] p-3.5 shadow-[3px_3px_0px_#134E4A]">
            <span className="rounded-xl border-2 border-[#134E4A] bg-[#0284C7] px-3 py-1.5 text-[10px] font-black uppercase text-white shadow-sm whitespace-nowrap">
              CARA BACA
            </span>
            <p className="flex-1 text-xs font-black text-[#134E4A] italic leading-snug">
              "{rule.caraBaca || "Jelas dan tenang tanpa dengung"}"
            </p>
            <ChartLine size={18} className="text-[#0284C7] mr-1 shrink-0" />
          </section>

          {/* 4. Kotak Ingat Kaidahnya (Sticker Style) */}
          <section className="rounded-[24px] border-[3px] border-[#134E4A] bg-[#FEF3C7] p-4 shadow-[4px_4px_0px_#134E4A]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-sm">
                <Info size={16} className="text-[#0284C7]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#B45309] mb-1">
                  INGAT KAIDAHNYA
                </p>
                <p className="text-xs font-bold text-[#134E4A] leading-relaxed mb-3">
                  {rule.note}
                </p>
                <div className="rounded-xl border-2 border-[#134E4A] bg-white p-2.5 text-center shadow-sm">
                  <p
                    className="font-arabic text-[26px] font-bold text-[#134E4A]"
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

      {/* 5. Tombol Navigasi Bawah Fixed (Sticker Style) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 border-t-[3px] border-[#134E4A] flex gap-3 z-50 shadow-lg">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Kaidah sebelumnya"
          className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-white text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border-[3px] border-[#134E4A] bg-[#134E4A] text-white font-display text-sm font-black py-3 px-6 shadow-[3px_3px_0px_#0284C7] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[#0f3f3c]"
        >
          {index < total - 1 ? "Materi Berikutnya" : "Kembali ke Lab Tajwid"}
          <ArrowRight size={16} />
        </button>
      </div>
    </NgajiCeriaLayout>
  );
}
