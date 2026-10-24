import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  X,
  Star,
  BookOpen,
  Fire,
  Trophy,
  Headphone,
  Quran,
  Crown,
  Sprout,
  GalaxyStarSvg,
  Rocket,
  Detective,
  Check,
  type SvgProps,
} from "../../../../components/ui/CustomIcons";
import { TitoMascot } from "../../../../components/ui/TitoMascot";
import { LenteraIcon } from "../../components/LenteraIcon";
import {
  TAHFIDZ_KATEGORI,
  getTargetsByKategori,
  type TahfidzKategori,
  type TahfidzTarget,
} from "../../data/tahfidzData";
import { useTahfidz, getSurahProgress } from "../../hooks/useTahfidz";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { everyAyahAudio } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

interface AyahData {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audioUrl: string;
}

/** ── POLA LANGIT MALAM & KUNANG-KUNANG CAHAYA (SVG Statis Solid) ── */
const NightSkyFirefliesSvg = ({ className = "" }: { className?: string }) => (
  <svg
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    viewBox="0 0 400 500"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {/* Siluet Kubah & Pepohonan Taman di Kejauhan */}
    <path
      d="M0 500 L0 440 Q40 410 80 440 Q130 390 180 440 Q240 400 300 440 Q350 410 400 440 L400 500 Z"
      fill="#064E3B"
      opacity="0.45"
    />
    {/* Partikel Kunang-Kunang Emas & Toska */}
    {[
      [28, 35, 2.5, "#FEF08A"],
      [85, 75, 2, "#5EEAD4"],
      [145, 28, 3, "#FBBF24"],
      [210, 65, 2, "#FEF08A"],
      [275, 32, 2.5, "#5EEAD4"],
      [345, 70, 3, "#FEF08A"],
      [380, 30, 2, "#FBBF24"],
      [40, 145, 2, "#5EEAD4"],
      [115, 125, 2.5, "#FEF08A"],
      [185, 165, 2, "#FBBF24"],
      [265, 140, 2.5, "#FEF08A"],
      [335, 160, 2, "#5EEAD4"],
      [370, 120, 2.5, "#FEF08A"],
      [25, 240, 2.5, "#FBBF24"],
      [95, 270, 2, "#FEF08A"],
      [165, 230, 3, "#5EEAD4"],
      [235, 285, 2, "#FEF08A"],
      [305, 250, 2.5, "#FBBF24"],
      [365, 295, 2.5, "#FEF08A"],
      [55, 360, 2.5, "#FEF08A"],
      [145, 390, 2, "#5EEAD4"],
      [255, 375, 2.5, "#FBBF24"],
      [335, 405, 2, "#FEF08A"],
    ].map(([cx, cy, r, color], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={String(color)} />
    ))}
    {/* Bintang Kilau 4 Sudut */}
    {[
      [190, 95],
      [65, 195],
      [325, 205],
      [120, 330],
      [295, 340],
    ].map(([cx, cy], i) => (
      <path
        key={`spark-${i}`}
        d={`M ${cx} ${cy - 8} L ${cx + 2.2} ${cy - 2.2} L ${cx + 8} ${cy} L ${cx + 2.2} ${cy + 2.2} L ${cx} ${cy + 8} L ${cx - 2.2} ${cy + 2.2} L ${cx - 8} ${cy} L ${cx - 2.2} ${cy - 2.2} Z`}
        fill="#FEF08A"
        stroke="#134E4A"
        strokeWidth="1.5"
      />
    ))}
  </svg>
);

/** ── 8 VARIAN LENTERA AJAIB (Setara PlanetVisual di JuzAmmaStarsPage) ── */
type LanternVariant =
  | "royalGold"
  | "crystalGem"
  | "emeraldDome"
  | "crescentMoon"
  | "rubyPalace"
  | "skyTower"
  | "violetStar"
  | "sunsetLotus";

const LANTERN_VARIANTS: LanternVariant[] = [
  "royalGold",
  "crystalGem",
  "emeraldDome",
  "crescentMoon",
  "rubyPalace",
  "skyTower",
  "violetStar",
  "sunsetLotus",
];

const LANTERN_SIZE = 128;

function LanternVisual({
  variant,
  size = LANTERN_SIZE,
  isLit = false,
  isComplete = false,
}: {
  variant: LanternVariant;
  size?: number;
  isLit?: boolean;
  isComplete?: boolean;
}) {
  const stroke = "#134E4A";
  const sw = 2.8;
  // Warna kaca dalam lentera: menyala kuning terang jika sudah ada hafalan, redup jika belum
  const innerGlass = isComplete ? "#FEF08A" : isLit ? "#FDE047" : "#1E293B";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className="absolute inset-0"
      aria-hidden="true"
    >
      {/* Rantai Gantungan Atas */}
      <line
        x1="40"
        y1="0"
        x2="40"
        y2="12"
        stroke="#FEF08A"
        strokeWidth="2.5"
        strokeDasharray="3 2"
      />
      <circle
        cx="40"
        cy="12"
        r="3.5"
        fill="#FBBF24"
        stroke={stroke}
        strokeWidth="2"
      />

      {/* 1. ROYAL GOLD: Lentera Kubah Emas Klasik */}
      {variant === "royalGold" && (
        <g>
          <path
            d="M24 26 C24 16 40 12 40 12 C40 12 56 16 56 26 Z"
            fill="#F59E0B"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <rect
            x="22"
            y="26"
            width="36"
            height="32"
            rx="8"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
          />
          <rect
            x="27"
            y="30"
            width="26"
            height="24"
            rx="5"
            fill={innerGlass}
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M26 58 L32 66 H48 L54 58 Z"
            fill="#D97706"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <circle
            cx="40"
            cy="70"
            r="3"
            fill="#FF6B6B"
            stroke={stroke}
            strokeWidth="2"
          />
        </g>
      )}

      {/* 2. CRYSTAL GEM: Lentera Permata Biru Segi Enam */}
      {variant === "crystalGem" && (
        <g>
          <polygon
            points="40,13 56,24 56,52 40,65 24,52 24,24"
            fill="#38BDF8"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <polygon
            points="40,19 50,27 50,49 40,58 30,49 30,27"
            fill={innerGlass}
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M24 24 H56 M24 52 H56" stroke={stroke} strokeWidth="2" />
          <polygon
            points="40,65 44,72 40,76 36,72"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth="2"
          />
        </g>
      )}

      {/* 3. EMERALD DOME: Lentera Masjid Zamrud */}
      {variant === "emeraldDome" && (
        <g>
          <path
            d="M22 28 C22 17 34 14 40 11 C46 14 58 17 58 28 Z"
            fill="#10B981"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M25 28 H55 L51 56 H29 Z"
            fill="#34D399"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M31 32 C31 27 49 27 49 32 V52 H31 Z"
            fill={innerGlass}
            stroke={stroke}
            strokeWidth="2"
          />
          <rect
            x="27"
            y="56"
            width="26"
            height="7"
            rx="3"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
          />
        </g>
      )}

      {/* 4. CRESCENT MOON: Lentera Pelukan Bulan Sabit */}
      {variant === "crescentMoon" && (
        <g>
          <circle
            cx="40"
            cy="40"
            r="22"
            fill="#F97316"
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle
            cx="40"
            cy="40"
            r="16"
            fill={innerGlass}
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M28 19 H52 L48 13 H32 Z"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M28 61 H52 L46 68 H34 Z"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* 5. RUBY PALACE: Lentera Istana Merah Delima */}
      {variant === "rubyPalace" && (
        <g>
          <path
            d="M20 26 L40 13 L60 26 Z"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <rect
            x="24"
            y="26"
            width="32"
            height="32"
            rx="6"
            fill="#FF6B6B"
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle
            cx="40"
            cy="42"
            r="12"
            fill={innerGlass}
            stroke={stroke}
            strokeWidth="2"
          />
          <rect
            x="22"
            y="58"
            width="36"
            height="6"
            rx="3"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M36 64 L40 73 L44 64"
            fill="#FF6B6B"
            stroke={stroke}
            strokeWidth="2"
          />
        </g>
      )}

      {/* 6. SKY TOWER: Lentera Menara Angkasa Biru */}
      {variant === "skyTower" && (
        <g>
          <path
            d="M26 24 C26 15 54 15 54 24 Z"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M22 24 H58 L52 56 H28 Z"
            fill="#3B82F6"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <rect
            x="30"
            y="28"
            width="20"
            height="24"
            rx="6"
            fill={innerGlass}
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M28 56 H52 L46 65 H34 Z"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* 7. VIOLET STAR: Lentera Bintang Ungu Magis */}
      {variant === "violetStar" && (
        <g>
          <path
            d="M24 25 L40 13 L56 25 Z"
            fill="#C084FC"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <rect
            x="23"
            y="25"
            width="34"
            height="32"
            rx="10"
            fill="#A855F7"
            stroke={stroke}
            strokeWidth={sw}
          />
          <rect
            x="29"
            y="30"
            width="22"
            height="22"
            rx="6"
            fill={innerGlass}
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M27 57 H53 L47 65 H33 Z"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <circle
            cx="40"
            cy="70"
            r="3"
            fill="#38BDF8"
            stroke={stroke}
            strokeWidth="2"
          />
        </g>
      )}

      {/* 8. SUNSET LOTUS: Lentera Teratai Senja */}
      {variant === "sunsetLotus" && (
        <g>
          <path
            d="M24 26 Q40 12 56 26 Z"
            fill="#FF6B6B"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <ellipse
            cx="40"
            cy="42"
            rx="19"
            ry="16"
            fill="#FBBF24"
            stroke={stroke}
            strokeWidth={sw}
          />
          <ellipse
            cx="40"
            cy="42"
            rx="13"
            ry="11"
            fill={innerGlass}
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M26 57 H54 L48 65 H32 Z"
            fill="#FF6B6B"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}

// Pemetaan ikon khusus untuk tab kategori
const KATEGORI_ICON_MAP: Record<string, React.FC<SvgProps>> = {
  juz30: Quran,
  pendek: Sprout,
  pilihan: Crown,
  default: GalaxyStarSvg,
};

export default function TahfidzPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TahfidzKategori>("juz30");
  const [selectedSurah, setSelectedSurah] = useState<TahfidzTarget | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"baca" | "uji">("baca");
  const [revealedAyat, setRevealedAyat] = useState<Set<number>>(new Set());
  const [surahAyatList, setSurahAyatList] = useState<AyahData[]>([]);
  const [isLoadingAyat, setIsLoadingAyat] = useState(false);

  const { data, isHafal, toggleHafal, reset, stats, streak } = useTahfidz();
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();

  const currentTargets = useMemo(() => {
    const list = getTargetsByKategori(activeTab);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (t) =>
        t.namaLatin.toLowerCase().includes(q) ||
        t.arti.toLowerCase().includes(q) ||
        String(t.surah).includes(q),
    );
  }, [activeTab, searchQuery]);

  // Load ayat when a surah is selected
  useEffect(() => {
    if (!selectedSurah) {
      setSurahAyatList([]);
      setRevealedAyat(new Set());
      return;
    }

    let isMounted = true;
    setIsLoadingAyat(true);
    setRevealedAyat(new Set());

    fetch(`https://equran.id/api/v2/surat/${selectedSurah.surah}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json?.code === 200 && Array.isArray(json?.data?.ayat)) {
          const list: AyahData[] = json.data.ayat.map((a: any) => ({
            nomorAyat: a.nomorAyat,
            teksArab: a.teksArab,
            teksLatin: a.teksLatin,
            teksIndonesia: a.teksIndonesia,
            audioUrl:
              a.audio?.["01"] ||
              everyAyahAudio(selectedSurah.surah, a.nomorAyat),
          }));
          setSurahAyatList(list);
        } else {
          fallbackAyat();
        }
      })
      .catch(() => {
        if (isMounted) fallbackAyat();
      })
      .finally(() => {
        if (isMounted) setIsLoadingAyat(false);
      });

    function fallbackAyat() {
      if (!selectedSurah) return;
      const list: AyahData[] = [];
      for (let i = selectedSurah.ayatStart; i <= selectedSurah.ayatEnd; i++) {
        list.push({
          nomorAyat: i,
          teksArab: `Ayat ${i}`,
          teksLatin: `Surah ${selectedSurah.namaLatin} Ayat ${i}`,
          teksIndonesia: `Terjemahan ayat ke-${i}`,
          audioUrl: everyAyahAudio(selectedSurah.surah, i),
        });
      }
      setSurahAyatList(list);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedSurah]);

  const handleOpenSurah = (target: TahfidzTarget) => {
    triggerBibiReaction("click");
    setSelectedSurah(target);
  };

  const handleToggleAyatHafal = (surahNum: number, ayahNum: number) => {
    const alreadyHafal = isHafal(surahNum, ayahNum);
    toggleHafal(surahNum, ayahNum);
    if (!alreadyHafal) {
      triggerBibiReaction("success");
    } else {
      triggerBibiReaction("click");
    }
  };

  const toggleReveal = (ayahNum: number) => {
    setRevealedAyat((prev) => {
      const next = new Set(prev);
      if (next.has(ayahNum)) next.delete(ayahNum);
      else next.add(ayahNum);
      return next;
    });
  };

  const handleResetAll = () => {
    if (
      window.confirm(
        "Apakah kamu yakin ingin mengulang petualangan lentera hafalanmu dari awal?",
      )
    ) {
      triggerBibiReaction("error");
      reset();
    }
  };

  const selectedProgress = selectedSurah
    ? getSurahProgress(data, selectedSurah)
    : null;

  return (
    <NgajiCeriaLayout
      title="Taman Seribu Lentera"
      hideHeader={true}
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      {/* Latar Malam Taman Zamrud Gelap (Kontras Tinggi seperti JuzAmmaStarsPage) */}
      <div className="min-h-[100dvh] w-full bg-[#042F2E] relative overflow-x-hidden pb-32">
        <NightSkyFirefliesSvg />

        {/* HEADER Taman Seribu Lentera */}
        <ThemedHeader
          title="Taman Seribu Lentera"
          onBack={() => navigate("/member/ngaji-ceria/map")}
          themeColorClass="bg-[#042F2E]"
          textColorClass="text-[#FEF08A]"
          statVariant="capsule"
          statBgClass="bg-[#115E59] text-[#FEF08A]"
          backClass="bg-[#FEF08A] text-[#134E4A]"
        >
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            viewBox="0 0 400 64"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {[
              [40, 12, 1.5],
              [90, 44, 2],
              [150, 10, 2.5],
              [210, 50, 1.5],
              [270, 14, 2],
              [330, 46, 2.5],
              [380, 16, 1.5],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="#FEF08A" />
            ))}
          </svg>
        </ThemedHeader>

        <div className="relative z-10 px-4 pt-4">
          {/* ── HERO MISI PENJAGA LENTERA ── */}
          <section className="relative overflow-hidden rounded-[24px] border-[3px] border-[#FEF08A] bg-[#115E59] p-5 text-white shadow-[5px_5px_0px_#134E4A]">
            {/* Maskot Tito di Kanan Bawah */}
            <div className="absolute -right-1 -bottom-2 z-10 pointer-events-none">
              <TitoMascot size={108} mood="excited" animation="float" />
            </div>

            <div className="relative z-10 max-w-[70%]">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border-2 border-[#FEF08A] bg-[#042F2E] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FEF08A]">
                <Sparkles size={13} />
                <span>Misi Penjaga Cahaya</span>
              </span>
              <h2 className="mt-1 font-display text-xl font-black leading-tight text-white">
                Nyalakan lentera surah & terangi taman surga!
              </h2>

              {/* Mini Badges Stats di dalam Hero */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2.5 py-1 text-[10px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <BookOpen size={12} />
                  <span>
                    {stats.totalHafal}/{stats.totalAyat} Ayat
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-[#34D399] px-2.5 py-1 text-[10px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <Trophy size={12} />
                  <span>{stats.surahSelesai} Tamat</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-[#FF6B6B] px-2.5 py-1 text-[10px] font-black text-white shadow-[2px_2px_0px_#134E4A]">
                  <Fire size={12} />
                  <span>{streak} Hari</span>
                </span>
              </div>
            </div>
          </section>

          {/* ── FILTER KATEGORI & PENCARIAN ── */}
          <div className="mt-5 space-y-3">
            {/* Tab Kategori Neo-Brutalism */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <div className="flex gap-2">
                {TAHFIDZ_KATEGORI.map((kat, idx) => {
                  const isActive = activeTab === kat.key;
                  const IconComponent =
                    KATEGORI_ICON_MAP[kat.key] ||
                    (idx === 0
                      ? Quran
                      : idx === 1
                        ? Sprout
                        : idx === 2
                          ? Crown
                          : GalaxyStarSvg);

                  return (
                    <motion.button
                      key={kat.key}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        triggerBibiReaction("click");
                        setActiveTab(kat.key);
                      }}
                      className={`flex items-center gap-2 rounded-2xl border-[3px] px-4 py-2.5 text-xs font-black whitespace-nowrap transition-all ${
                        isActive
                          ? "border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[3px_3px_0px_#134E4A] -translate-y-0.5"
                          : "border-[#FEF08A]/40 bg-[#115E59] text-white hover:bg-[#0F766E]"
                      }`}
                    >
                      <IconComponent size={16} />
                      <span>{kat.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {stats.totalHafal > 0 && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1 rounded-xl border-2 border-[#134E4A] bg-[#FF6B6B] px-2.5 py-2 text-[10px] font-black text-white shadow-[2px_2px_0px_#134E4A] shrink-0"
                >
                  <RefreshCw size={12} />
                  <span>Ulang</span>
                </button>
              )}
            </div>

            {/* Search Bar Kontras */}
            <div className="flex items-center gap-3 rounded-2xl border-[3px] border-[#134E4A] bg-white px-4 py-2.5 shadow-[4px_4px_0px_#134E4A]">
              <Search size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lentera surah (misal: An-Nas, Al-Ikhlas)..."
                className="w-full bg-transparent text-xs sm:text-sm font-black text-[#134E4A] placeholder:text-[#134E4A]/45 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Bersihkan pencarian"
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* ── PETA GANTUNGAN LENTERA SURAH (GRID 2 KOLOM SEPERTI GALAKSI) ── */}
          {currentTargets.length === 0 ? (
            <div className="mt-8 rounded-[24px] border-[3px] border-dashed border-[#FEF08A]/50 bg-[#115E59]/70 p-8 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF08A] border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]">
                <LenteraIcon size={32} lit={false} />
              </div>
              <p className="font-display font-black text-base text-[#FEF08A]">
                Lentera Surah Tidak Ditemukan
              </p>
              <p className="text-xs font-bold text-white/80 mt-1">
                Coba ketik kata kunci lain atau pilih kategori di atas ya.
              </p>
            </div>
          ) : (
            <section className="mt-7 grid grid-cols-2 gap-x-3 gap-y-10">
              {currentTargets.map((target, i) => {
                const progress = getSurahProgress(data, target);
                const variant = LANTERN_VARIANTS[i % LANTERN_VARIANTS.length];
                const isLit = progress.hafal > 0;

                return (
                  <motion.div
                    key={target.surah}
                    onClick={() => handleOpenSurah(target)}
                    className="relative flex cursor-pointer flex-col items-center"
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      y: {
                        repeat: Infinity,
                        duration: 2.5 + (i % 4) * 0.35,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    {/* Visual Lentera + Lingkaran Aura Cahaya */}
                    <div
                      className="relative"
                      style={{ width: LANTERN_SIZE, height: LANTERN_SIZE }}
                    >
                      {/* Lingkaran Aura Berputus-putus (Menyala Kuning jika sudah mulai dihafal) */}
                      <div
                        className={`absolute -inset-2 rounded-full border-2 border-dashed transition-colors ${
                          progress.complete
                            ? "border-[#34D399] bg-[#34D399]/15"
                            : isLit
                              ? "border-[#FEF08A]/80 bg-[#FEF08A]/10"
                              : "border-white/20"
                        }`}
                        aria-hidden="true"
                      />

                      {/* Kunang-kunang kecil mengorbit di sudut lentera */}
                      <span className="absolute -inset-2" aria-hidden="true">
                        <span
                          className={`absolute top-1 ${
                            i % 2 ? "left-1" : "right-1"
                          } block h-3.5 w-3.5 rounded-full border-2 border-[#134E4A] ${
                            progress.complete
                              ? "bg-[#34D399]"
                              : isLit
                                ? "bg-[#FEF08A]"
                                : "bg-slate-400"
                          } shadow-[1.5px_1.5px_0px_#134E4A]`}
                        />
                      </span>

                      {/* Lentera Utama dengan Drop-Shadow Blocky + Glow saat Menyala */}
                      <div
                        className="absolute inset-0"
                        style={{
                          filter: progress.complete
                            ? "drop-shadow(4px 4px 0 #134E4A) drop-shadow(0 0 18px rgba(52,211,153,0.85))"
                            : isLit
                              ? "drop-shadow(4px 4px 0 #134E4A) drop-shadow(0 0 14px rgba(254,240,138,0.75))"
                              : "drop-shadow(4px 4px 0 #134E4A)",
                        }}
                      >
                        <LanternVisual
                          variant={variant}
                          size={LANTERN_SIZE}
                          isLit={isLit}
                          isComplete={progress.complete}
                        />
                      </div>

                      {/* Nomor Surah di Tengah Kaca Lentera */}
                      <div className="absolute inset-0 flex items-center justify-center pt-2">
                        <span className="font-display text-2xl font-black text-white [text-shadow:2px_2px_0_#134E4A]">
                          {target.surah}
                        </span>
                      </div>

                      {/* Badge Piala Kecil jika Tamat */}
                      {progress.complete && (
                        <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#134E4A] bg-[#34D399] shadow-[2px_2px_0px_#134E4A]">
                          <Trophy size={16} />
                        </div>
                      )}
                    </div>

                    {/* Pil Nama Surah */}
                    <span className="mt-3 inline-block max-w-full truncate rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-3.5 py-1 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                      {target.namaLatin}
                    </span>

                    {/* Sub-info Arti & Jumlah Ayat */}
                    <span className="mt-1 text-[10px] font-black uppercase tracking-wider text-[#FEF08A]/90">
                      {progress.hafal}/{progress.total} Lentera (
                      {progress.percentage}%)
                    </span>

                    {/* Progress Bar Mini + Tombol Status */}
                    <div className="mt-2 flex w-36 flex-col items-center gap-1.5">
                      <div className="h-3 w-full overflow-hidden rounded-full border-2 border-[#134E4A] bg-[#042F2E] shadow-[1.5px_1.5px_0px_#134E4A]">
                        <div
                          className={`h-full transition-all duration-500 ${
                            progress.complete ? "bg-[#34D399]" : "bg-[#FBBF24]"
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>

                      <span
                        className={`inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#134E4A] px-3 py-1 text-[11px] font-black shadow-[2px_2px_0px_#134E4A] transition-all ${
                          progress.complete
                            ? "bg-[#34D399] text-[#134E4A]"
                            : isLit
                              ? "bg-[#FF6B6B] text-white"
                              : "bg-white text-[#134E4A]"
                        }`}
                      >
                        <LenteraIcon size={13} lit={isLit} />
                        <span>
                          {progress.complete
                            ? "Tamat Hebat"
                            : isLit
                              ? "Lanjutkan"
                              : "Nyalakan"}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </section>
          )}

          {/* ── MODAL RUANG LATIHAN LENTERA SURAH ── */}
          <AnimatePresence>
            {selectedSurah && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#042F2E]/85 backdrop-blur-xs p-0 sm:p-4">
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.95 }}
                  className="relative max-h-[92vh] w-full max-w-xl flex flex-col rounded-t-[32px] sm:rounded-[32px] border-[3px] border-[#134E4A] bg-[#FFFBEB] shadow-[8px_8px_0px_#134E4A] overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b-[3px] border-[#134E4A] bg-[#115E59] p-4 text-[#FEF08A]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#134E4A] bg-[#FEF08A] font-display text-base font-black text-[#134E4A] shadow-[2.5px_2.5px_0px_#134E4A]">
                        {selectedSurah.surah}
                      </div>
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-black leading-tight text-white flex items-center gap-2">
                          <span>{selectedSurah.namaLatin}</span>
                          <span className="text-xs text-[#FEF08A]">
                            ({selectedSurah.arti})
                          </span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#FEF08A]/90 mt-0.5 flex items-center gap-1.5">
                          <Sparkles size={13} />
                          <span>
                            Lentera Menyala: {selectedProgress?.hafal || 0}/
                            {selectedSurah.jumlahAyat} (
                            {selectedProgress?.percentage || 0}%)
                          </span>
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setSelectedSurah(null)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] hover:bg-[#FDE047] shadow-[2.5px_2.5px_0px_#134E4A]"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  {/* Subheader: Mode Switcher */}
                  <div className="flex items-center justify-between border-b-2 border-[#134E4A]/20 bg-white px-4 py-3 gap-2">
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setMode("baca")}
                        className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3.5 py-2 text-xs font-black transition-all ${
                          mode === "baca"
                            ? "bg-[#0D9488] text-white shadow-[2.5px_2.5px_0px_#134E4A]"
                            : "bg-white text-[#134E4A] hover:bg-[#FEF9EF]"
                        }`}
                      >
                        <BookOpen size={14} />
                        <span>Dengar & Ikuti</span>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setMode("uji")}
                        className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3.5 py-2 text-xs font-black transition-all ${
                          mode === "uji"
                            ? "bg-[#FF6B6B] text-white shadow-[2.5px_2.5px_0px_#134E4A]"
                            : "bg-white text-[#134E4A] hover:bg-[#FEF9EF]"
                        }`}
                      >
                        <EyeOff size={14} />
                        <span>Tantangan Tebak Ayat</span>
                      </motion.button>
                    </div>

                    <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-black text-[#134E4A] bg-[#FEF08A] px-2.5 py-1 rounded-xl border-2 border-[#134E4A]">
                      {mode === "uji" ? (
                        <>
                          <Detective size={14} />
                          <span>Mode Detektif</span>
                        </>
                      ) : (
                        <>
                          <Headphone size={14} />
                          <span>Mode Latihan</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Ayat List Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoadingAyat ? (
                      <div className="py-20 text-center">
                        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#134E4A]/30 border-t-[#0D9488]" />
                        <p className="mt-3 text-xs font-black text-[#134E4A] flex items-center justify-center gap-1.5">
                          <span>Menyiapkan lentera ayat...</span>
                          <Rocket size={16} />
                        </p>
                      </div>
                    ) : (
                      surahAyatList.map((ayah) => {
                        const hafalStatus = isHafal(
                          selectedSurah.surah,
                          ayah.nomorAyat,
                        );
                        const isRevealed = revealedAyat.has(ayah.nomorAyat);
                        const isAyahAudioActive =
                          isPlaying && currentAudioUrl === ayah.audioUrl;

                        return (
                          <div
                            key={ayah.nomorAyat}
                            className={`rounded-2xl border-[3px] border-[#134E4A] p-4 transition-all ${
                              hafalStatus
                                ? "bg-[#ECFDF5] shadow-[4px_4px_0px_#10B981]"
                                : "bg-white shadow-[4px_4px_0px_#134E4A]"
                            }`}
                          >
                            {/* Baris Kontrol Atas Ayat */}
                            <div className="flex items-center justify-between mb-3 border-b-2 pb-2.5 border-[#134E4A]/10">
                              <div className="flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                                  {ayah.nomorAyat}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => toggle(ayah.audioUrl)}
                                  className={`flex h-8 items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 text-xs font-black transition-all shadow-[2px_2px_0px_#134E4A] ${
                                    isAyahAudioActive
                                      ? "bg-[#FF6B6B] text-white"
                                      : "bg-[#FEF9EF] text-[#134E4A] hover:bg-[#FEF08A]"
                                  }`}
                                >
                                  {isAyahAudioActive ? (
                                    <Pause size={13} />
                                  ) : (
                                    <Play size={13} />
                                  )}
                                  <span>
                                    {isAyahAudioActive ? "Jeda" : "Putar Suara"}
                                  </span>
                                </motion.button>
                              </div>

                              {/* Tombol Checklist Lentera Hafal */}
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() =>
                                  handleToggleAyatHafal(
                                    selectedSurah.surah,
                                    ayah.nomorAyat,
                                  )
                                }
                                className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3.5 py-1.5 text-xs font-black transition-all ${
                                  hafalStatus
                                    ? "bg-[#34D399] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                                    : "bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#FEF08A]/40"
                                }`}
                              >
                                {hafalStatus ? (
                                  <>
                                    <Check size={14} />
                                    <span>Lentera Nyala</span>
                                  </>
                                ) : (
                                  <>
                                    <LenteraIcon size={14} lit={false} />
                                    <span>Nyalakan Lentera</span>
                                  </>
                                )}
                              </motion.button>
                            </div>

                            {/* Teks Arab (Bisa ditutup pada mode Tantangan Tebak Ayat) */}
                            <div className="relative py-3">
                              {mode === "uji" && !isRevealed ? (
                                <div className="flex flex-col items-center justify-center py-7 px-4 rounded-2xl border-2 border-dashed border-[#134E4A]/40 bg-[#FEF9EF] text-center">
                                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF08A] border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                                    <Detective size={24} />
                                  </div>
                                  <p className="text-xs font-black text-[#134E4A] mb-1 flex items-center justify-center gap-1.5">
                                    <span>
                                      Ayat ke-{ayah.nomorAyat} sedang
                                      bersembunyi di balik tirai
                                    </span>
                                  </p>
                                  <p className="text-[11px] font-bold text-[#134E4A]/70 mb-3">
                                    Coba lafalkan ayatnya dari ingatanmu, lalu
                                    buka tirainya!
                                  </p>
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => toggleReveal(ayah.nomorAyat)}
                                    className="flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-4 py-2 text-xs font-black text-[#134E4A] shadow-[2.5px_2.5px_0px_#134E4A] hover:bg-[#FDE047]"
                                  >
                                    <Eye size={14} />
                                    <span>Buka Tirai Jawaban</span>
                                  </motion.button>
                                </div>
                              ) : (
                                <div>
                                  <p
                                    className="font-arabic text-[28px] sm:text-[32px] text-right leading-[2.3] text-[#134E4A]"
                                    dir="rtl"
                                  >
                                    {ayah.teksArab}
                                  </p>

                                  {mode === "uji" && isRevealed && (
                                    <div className="mt-3 text-right">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleReveal(ayah.nomorAyat)
                                        }
                                        className="inline-flex items-center gap-1 text-xs font-black text-[#134E4A] bg-[#FEF08A] px-3 py-1 rounded-xl border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]"
                                      >
                                        <EyeOff size={13} />
                                        <span>Sembunyikan Lagi</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Teks Latin & Arti */}
                            {(mode === "baca" || isRevealed) && (
                              <div className="mt-2.5 space-y-1.5 border-t-2 border-[#134E4A]/10 pt-2.5 text-left">
                                {ayah.teksLatin && (
                                  <p className="text-xs font-bold text-[#0D9488] italic bg-[#E0F2FE]/60 px-2.5 py-1 rounded-lg border border-[#0D9488]/20">
                                    {ayah.teksLatin}
                                  </p>
                                )}
                                {ayah.teksIndonesia && (
                                  <p className="text-xs font-medium text-[#134E4A]/90 leading-relaxed px-1">
                                    {ayah.teksIndonesia}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
