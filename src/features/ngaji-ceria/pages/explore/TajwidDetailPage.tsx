import { Fragment, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "../../../../components/ui/FontAwesomeIcons";
import { TAJWID_RULES } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

// Warna sorotan diubah menjadi Biru (Blue) sesuai gambar
function HighlightedArabic({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  if (!highlight || !text.includes(highlight)) {
    return <>{text}</>;
  }

  const [before, ...rest] = text.split(highlight);
  return (
    <Fragment>
      {before}
      <span className="text-[#0284C7]">{highlight}</span> {/* Biru */}
      {rest.join(highlight)}
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
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();
  const firstExample = rule.examples[0];
  const isActive = (url?: string) =>
    Boolean(url) && isPlaying && currentAudioUrl === url;

  const handleNext = () => {
    if (index < total - 1) {
      navigate(
        `/member/ngaji-ceria/explore/tajwid/${TAJWID_RULES[index + 1].id}`,
      );
    } else {
      navigate("/member/ngaji-ceria/explore/tajwid");
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      navigate(
        `/member/ngaji-ceria/explore/tajwid/${TAJWID_RULES[index - 1].id}`,
      );
    } else {
      navigate("/member/ngaji-ceria/explore/tajwid");
    }
  };

  return (
    <NgajiCeriaLayout
      title=""
      onBack={() => navigate("/member/ngaji-ceria/explore/tajwid")}
    >
      {/* BACKGROUND DENGAN POLA GRID */}
      <div
        className="min-h-full pb-32 bg-[#F8FAFC]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E2E8F0 1px, transparent 1px),
            linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      >
        <div className="px-4 py-4">
          {/* 1. Header Teks & Ikon Atas */}
          <div className="text-center relative mb-4">
            <p className="text-[11px] font-bold tracking-widest text-[#F97316] uppercase mb-1">
              RUANG LATIHAN
            </p>
            <h1 className="font-display font-bold text-[17px] text-[#1F2937] leading-tight px-8">
              {rule.subtitle || "Hukum Nun Mati, Tanwin & Ghunnah"}
            </h1>

            {/* Ikon Kanan Atas (Kustom) */}
            <div className="absolute right-0 top-0 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <span className="text-[#F97316] text-lg">☕</span>
            </div>
          </div>

          {/* 2. Kartu Putih Utama */}
          <div className="bg-white rounded-t-3xl rounded-b-3xl shadow-sm border border-gray-100 p-5 relative overflow-hidden">
            {/* Judul Kaidah (Idzhar) */}
            <h2 className="font-display font-bold text-[22px] text-[#1F2937] text-center mb-5">
              {rule.title}
            </h2>

            {/* KOTAK CONTOH BACAAN (BIRU MUDA) */}
            <div className="bg-[#E0F2FE] rounded-2xl p-4 border border-[#BAE6FD] mb-4 relative">
              {/* Aksen garis miring di pojok */}
              <div
                className="absolute top-0 left-0 w-8 h-8 bg-[#BAE6FD]/50 rounded-tl-2xl"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              ></div>

              <div className="flex justify-between items-center mb-3 relative z-10">
                <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
                  CONTOH BACAAN ({rule.examples?.length || 5} KATA)
                </span>
                <button
                  type="button"
                  onClick={() => firstExample && toggle(firstExample.audioUrl)}
                  aria-label="Dengar contoh bacaan"
                  className="flex items-center gap-1.5 bg-[#0284C7] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-[#0369A1] transition-colors active:scale-95"
                >
                  {isActive(firstExample?.audioUrl) ? (
                    <Pause size={14} />
                  ) : (
                    <Volume2 size={14} />
                  )}{" "}
                  Dengar
                </button>
              </div>

              <div className="space-y-2.5">
                {(rule.examples || []).map((ex, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-3 flex items-center justify-between gap-2 shadow-sm border border-[#E0F2FE]"
                  >
                    <span className="bg-[#E0F2FE] text-[#0284C7] text-[11px] font-bold w-7 h-7 flex items-center justify-center rounded-lg shrink-0">
                      {ex.number || `0${i + 1}`}
                    </span>
                    <p
                      className="font-arabic text-[28px] text-black pr-2 leading-none flex-1 text-right"
                      dir="rtl"
                    >
                      <HighlightedArabic
                        text={ex.arabic}
                        highlight={ex.highlight}
                      />
                    </p>
                    <button
                      type="button"
                      onClick={() => toggle(ex.audioUrl)}
                      aria-label={`Putar contoh ${ex.number || i + 1}`}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#E0F2FE] text-[#0284C7] active:scale-95 transition-transform"
                    >
                      {isActive(ex.audioUrl) ? (
                        <Pause size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* KOTAK CARA BACA */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-2 border border-gray-200 mb-4 shadow-sm">
              <span className="bg-[#0284C7] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                CARA BACA
              </span>
              <p className="text-[13px] text-[#1F2937] font-medium italic flex-1">
                "{rule.caraBaca || "Jelas dan tenang tanpa dengung"}"
              </p>
              <ChartLine size={18} className="text-[#0284C7] mr-2" />
            </div>

            {/* KOTAK INGAT KAIDAHNYA (BEGE) */}
            <div className="bg-[#FEF3C7] rounded-2xl p-4 border border-[#FDE68A] mb-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-white rounded-full p-1.5 shadow-sm">
                  <Info size={16} className="text-[#0284C7]" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#0284C7] mb-1.5">
                    INGAT KAIDAHNYA
                  </p>
                  <p className="text-[13px] text-[#374151] leading-relaxed mb-3">
                    {rule.note}
                  </p>
                  <p
                    className="font-arabic text-[26px] text-[#1F2937] text-left"
                    dir="rtl"
                  >
                    {rule.huruf || "(ء ه ع ح غ خ)"}
                  </p>
                </div>
              </div>
            </div>

            {/* KOTAK LATIHAN PELAFALAN (BIRU) */}
            <div className="bg-[#E0F2FE] rounded-2xl p-3 flex items-center justify-between border border-[#BAE6FD]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => firstExample && toggle(firstExample.audioUrl)}
                  aria-label="Putar latihan pelafalan"
                  className="bg-[#0284C7] text-white p-2.5 rounded-full active:scale-95 transition-transform"
                >
                  {isActive(firstExample?.audioUrl) ? (
                    <Pause size={18} />
                  ) : (
                    <PlayCircle size={18} />
                  )}
                </button>
                <div>
                  <p className="text-[10px] font-bold text-[#0284C7]">
                    LATIHAN PELAFALAN
                  </p>
                  <p className="text-[13px] font-semibold text-[#1F2937]">
                    Dengarkan sekali lagi
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#0284C7]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tombol Navigasi Bawah (Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F8FAFC] border-t border-gray-200 flex gap-3 z-50">
        <button
          onClick={handlePrev}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} className="text-gray-500" />
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#4B3621] hover:bg-[#3d2a18] text-white font-bold text-[14px] py-3 px-6 shadow-md active:scale-[0.99] transition-all"
        >
          {index < total - 1 ? "Materi Berikutnya" : "Selesai"}
          <ArrowRight size={16} />
        </button>
      </div>
    </NgajiCeriaLayout>
  );
}
