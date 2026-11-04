import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { Volume2, UfoSvg, StarSvg } from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import { JUZ_AMMA_SURAHS } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";
import { ExploreHeader } from "../../components/ExploreHeader";

type VesselVariant = "paperBoat" | "seashell";

type SurahOceanTheme =
  | "sun"
  | "night"
  | "dawn"
  | "water"
  | "botanic"
  | "elephant"
  | "time"
  | "crown"
  | "quake"
  | "lantern"
  | "pearl";

interface SurahOceanMeta {
  theme: SurahOceanTheme;
  badgeLabel: string;
  cardShapeClass: string;
  plaqueBg: string;
  plaqueText: string;
  accentColor: string;
}

/** Menentukan bentuk kartu, tema lencana, dan ilustrasi lambang berdasarkan judul surah */
function getSurahOceanMeta(
  surahName: string,
  variant: VesselVariant,
  index: number,
): SurahOceanMeta {
  const n = surahName.toLowerCase();

  const boatShapes = [
    "rounded-[26px_14px_30px_14px]",
    "rounded-[14px_26px_14px_30px]",
  ];
  const shellShapes = [
    "rounded-[32px_32px_20px_20px]",
    "rounded-[28px_20px_28px_20px]",
  ];

  const cardShapeClass =
    variant === "paperBoat"
      ? boatShapes[index % boatShapes.length]
      : shellShapes[index % shellShapes.length];

  if (/(syams|duha|dhuha)/.test(n)) {
    return {
      theme: "sun",
      badgeLabel: "Layar Mentari",
      cardShapeClass,
      plaqueBg: "bg-[#FEF08A]",
      plaqueText: "text-[#451A03]",
      accentColor: "#FACC15",
    };
  }
  if (/(lail|tariq|thariq|buruj|qadr|takwir|infitar)/.test(n)) {
    return {
      theme: "night",
      badgeLabel: "Samudra Bintang",
      cardShapeClass,
      plaqueBg: "bg-[#E0E7FF]",
      plaqueText: "text-[#1E1B4B]",
      accentColor: "#A5B4FC",
    };
  }
  if (/(fajr|falaq|insyiqaq|syarh|insyirah)/.test(n)) {
    return {
      theme: "dawn",
      badgeLabel: "Cakrawala Fajar",
      cardShapeClass,
      plaqueBg: "bg-[#FFEDD5]",
      plaqueText: "text-[#7C2D12]",
      accentColor: "#FB923C",
    };
  }
  if (/(kautsar|kausar|ma'un|maun|naba)/.test(n)) {
    return {
      theme: "water",
      badgeLabel: "Telaga Samudra",
      cardShapeClass,
      plaqueBg: "bg-[#BAE6FD]",
      plaqueText: "text-[#0C4A6E]",
      accentColor: "#38BDF8",
    };
  }
  if (/(tin|lahab|masad|humazah|kafirun)/.test(n)) {
    return {
      theme: "botanic",
      badgeLabel: "Pulau Karang",
      cardShapeClass,
      plaqueBg: "bg-[#DCFCE7]",
      plaqueText: "text-[#14532D]",
      accentColor: "#4ADE80",
    };
  }
  if (/(fil)/.test(n)) {
    return {
      theme: "elephant",
      badgeLabel: "Armada Gajah",
      cardShapeClass,
      plaqueBg: "bg-[#E2E8F0]",
      plaqueText: "text-[#0F172A]",
      accentColor: "#CBD5E1",
    };
  }
  if (/(asr|ashr|adiyat|takatsur|abasa|mutaffifin|nazi'at|naziat)/.test(n)) {
    return {
      theme: "time",
      badgeLabel: "Kompas Pelayaran",
      cardShapeClass,
      plaqueBg: "bg-[#FDE68A]",
      plaqueText: "text-[#451A03]",
      accentColor: "#FBBF24",
    };
  }
  if (/(ikhlas|nasr|nashr|a'la|ala)/.test(n)) {
    return {
      theme: "crown",
      badgeLabel: "Mahkota Mutiara",
      cardShapeClass,
      plaqueBg: "bg-[#FEF08A]",
      plaqueText: "text-[#134E4A]",
      accentColor: "#FACC15",
    };
  }
  if (/(zalzalah|qari'ah|qariah|ghasyiyah)/.test(n)) {
    return {
      theme: "quake",
      badgeLabel: "Gelombang Dahsyat",
      cardShapeClass,
      plaqueBg: "bg-[#FECDD3]",
      plaqueText: "text-[#881337]",
      accentColor: "#FB7185",
    };
  }
  if (/(nas|balad|quraisy|alaq|bayyinah)/.test(n)) {
    return {
      theme: "lantern",
      badgeLabel: "Mercusuar Cahaya",
      cardShapeClass,
      plaqueBg: "bg-[#FEF3C7]",
      plaqueText: "text-[#451A03]",
      accentColor: "#FDE047",
    };
  }

  return {
    theme: "pearl",
    badgeLabel: variant === "paperBoat" ? "Perahu Kertas" : "Kerang Mutiara",
    cardShapeClass,
    plaqueBg: "bg-[#FEF3C7]",
    plaqueText: "text-[#451A03]",
    accentColor: "#FACC15",
  };
}

/** ── TABURAN BINTANG KUNING, BULAN SABIT & OMBAK DI LANGIT MALAM LAUTAN ── */
const OceanNightStarsSvg = ({ className = "" }: { className?: string }) => (
  <svg
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {/* Bulan Sabit Besar di Sudut Langit Malam */}
    <path
      d="M 335 28 A 22 22 0 1 0 362 56 A 17 17 0 1 1 335 28 Z"
      fill="#FACC15"
      stroke="#451A03"
      strokeWidth="2"
    />

    {/* Titik-titik Bintang Kecil */}
    {[
      [20, 25, 2.5],
      [75, 60, 2],
      [130, 20, 3],
      [185, 55, 2],
      [245, 28, 2.5],
      [305, 65, 3],
      [365, 22, 2.5],
      [45, 120, 2],
      [115, 105, 2.5],
      [175, 135, 2],
      [265, 115, 2.5],
      [335, 130, 2],
      [375, 100, 2.5],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#FACC15" />
    ))}

    {/* Bintang Kilau 4 Sudut */}
    {[
      [60, 45],
      [210, 35],
      [310, 42],
      [145, 85],
      [285, 90],
    ].map(([cx, cy], i) => (
      <path
        key={`star-${i}`}
        d={`M ${cx} ${cy - 9} L ${cx + 2.5} ${cy - 2.5} L ${cx + 9} ${cy} L ${cx + 2.5} ${cy + 2.5} L ${cx} ${cy + 9} L ${cx - 2.5} ${cy + 2.5} L ${cx - 9} ${cy} L ${cx - 2.5} ${cy - 2.5} Z`}
        fill="#FACC15"
        stroke="#451A03"
        strokeWidth="1.2"
      />
    ))}

    {/* Garis Riak Ombak Halus di Permukaan Samudra */}
    <path
      d="M 0 195 Q 50 183 100 195 T 200 195 T 300 195 T 400 195"
      fill="none"
      stroke="#38BDF8"
      strokeWidth="2.5"
      strokeDasharray="10 8"
      opacity="0.45"
    />
    <path
      d="M 0 265 Q 60 252 120 265 T 240 265 T 360 265 T 420 265"
      fill="none"
      stroke="#7DD3FC"
      strokeWidth="2"
      strokeDasharray="8 10"
      opacity="0.35"
    />
  </svg>
);

/** ── EMBLEM MINI SVG BERDASARKAN JUDUL SURAH (DI ATAS LAYAR / KERANG) ── */
function SurahEmblemSvg({ theme }: { theme: SurahOceanTheme }) {
  const stroke = "#134E4A";
  switch (theme) {
    case "sun":
      return (
        <g>
          <circle
            cx="44"
            cy="11"
            r="6"
            fill="#FACC15"
            stroke={stroke}
            strokeWidth="2"
          />
          <line
            x1="44"
            y1="2"
            x2="44"
            y2="4"
            stroke="#FEF08A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="35"
            y1="11"
            x2="37"
            y2="11"
            stroke="#FEF08A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="51"
            y1="11"
            x2="53"
            y2="11"
            stroke="#FEF08A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      );
    case "night":
      return (
        <path
          d="M 42 4 A 6.5 6.5 0 1 0 49 14 A 5 5 0 1 1 42 4 Z"
          fill="#FEF08A"
          stroke={stroke}
          strokeWidth="1.8"
        />
      );
    case "dawn":
      return (
        <g>
          <path
            d="M 36 15 A 8 8 0 0 1 52 15 Z"
            fill="#FB923C"
            stroke={stroke}
            strokeWidth="2"
          />
          <line
            x1="34"
            y1="15"
            x2="54"
            y2="15"
            stroke="#FEF08A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      );
    case "water":
      return (
        <path
          d="M 44 4 C 44 4 38 11 38 14 A 6 6 0 0 0 50 14 C 50 11 44 4 44 4 Z"
          fill="#38BDF8"
          stroke={stroke}
          strokeWidth="2"
        />
      );
    case "botanic":
      return (
        <path
          d="M 44 4 C 50 4 52 12 44 16 C 36 12 38 4 44 4 Z"
          fill="#4ADE80"
          stroke={stroke}
          strokeWidth="2"
        />
      );
    case "elephant":
      return (
        <g>
          <circle
            cx="44"
            cy="11"
            r="6"
            fill="#CBD5E1"
            stroke={stroke}
            strokeWidth="2"
          />
          <circle cx="42" cy="10" r="1.2" fill={stroke} />
        </g>
      );
    case "time":
      return (
        <g>
          <circle
            cx="44"
            cy="11"
            r="6.5"
            fill="#FEF08A"
            stroke={stroke}
            strokeWidth="2"
          />
          <polygon points="44,6 46,11 44,16 42,11" fill="#EF4444" />
        </g>
      );
    case "crown":
      return (
        <polygon
          points="36,15 38,7 44,11 50,7 52,15"
          fill="#FACC15"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case "quake":
      return (
        <polygon
          points="45,3 39,11 44,11 42,18 50,9 45,9"
          fill="#FACC15"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      );
    case "lantern":
      return (
        <g>
          <rect
            x="40"
            y="6"
            width="8"
            height="10"
            rx="2"
            fill="#FEF08A"
            stroke={stroke}
            strokeWidth="2"
          />
          <line
            x1="38"
            y1="6"
            x2="50"
            y2="6"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      );
    case "pearl":
    default:
      return (
        <polygon
          points="44,4 46,9 51,9 47,12 48,17 44,14 40,17 41,12 37,9 42,9"
          fill="#FACC15"
          stroke={stroke}
          strokeWidth="1.5"
        />
      );
  }
}

const VESSEL_SIZE = 136;

function OceanVesselVisual({
  variant,
  theme,
  index,
  size = VESSEL_SIZE,
}: {
  variant: VesselVariant;
  theme: SurahOceanTheme;
  index: number;
  size?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const stroke = "#134E4A";
  const sw = 3;
  const sailColors = ["#FEF3C7", "#FEF08A", "#BAE6FD", "#FDE68A"];
  const hullColors = ["#D97706", "#EF4444", "#0D9488", "#F59E0B"];
  const shellColors = ["#FDE68A", "#FECDD3", "#BAE6FD", "#FEF08A"];

  const sailFill = sailColors[index % sailColors.length];
  const hullFill = hullColors[index % hullColors.length];
  const shellFill = shellColors[index % shellColors.length];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      className="absolute inset-0"
      aria-hidden="true"
      style={{ filter: "drop-shadow(3px 3px 0 #0F172A)" }}
    >
      {variant === "paperBoat" ? (
        <g id={`boat-${uid}`}>
          {/* Lambang Puncak Layar Sesuai Judul Surah */}
          <SurahEmblemSvg theme={theme} />

          {/* Bendera Kecil di Puncak Tiang Perahu */}
          <polygon
            points="44,16 56,20 44,24"
            fill="#EF4444"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Layar Segitiga Kiri & Kanan Perahu Kertas */}
          <path
            d="M 44 17 L 17 52 L 44 52 Z"
            fill={sailFill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M 44 17 L 71 52 L 44 52 Z"
            fill="#FFFFFF"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />

          {/* Lipatan Tengah Perahu Kertas */}
          <path
            d="M 44 26 L 29 52 L 59 52 Z"
            fill="#FDE047"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Lambung Perahu Kertas + Jendela Porthole */}
          <path
            d="M 9 50 L 79 50 L 66 68 L 22 68 Z"
            fill={hullFill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <circle
            cx="28"
            cy="59"
            r="3"
            fill="#FEF08A"
            stroke={stroke}
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="59"
            r="3"
            fill="#FEF08A"
            stroke={stroke}
            strokeWidth="2"
          />

          {/* Ombak Berlapis di Bawah Perahu */}
          <path
            d="M 7 69 Q 20 63 32 69 T 56 69 T 81 69"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 14 75 Q 28 71 44 75 T 74 75"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      ) : (
        <g id={`shell-${uid}`}>
          {/* Lambang di Atas Kerang Sesuai Judul Surah */}
          <SurahEmblemSvg theme={theme} />

          {/* Cangkang Kerang Laut Bergerigi */}
          <path
            d="M 15 54 C 10 31 25 19 44 19 C 63 19 78 31 73 54 L 61 66 L 27 66 Z"
            fill={shellFill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />

          {/* Lingkaran Cahaya Mutiara di Tengah Kerang */}
          <circle
            cx="44"
            cy="46"
            r="14"
            fill="#FFFFFF"
            fillOpacity="0.65"
            stroke={stroke}
            strokeWidth="2"
          />

          {/* Garis-Garis Guratan Kerang */}
          <path
            d="M 44 64 L 25 28 M 44 64 L 44 21 M 44 64 L 63 28"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Engsel Bawah Kerang + Buih Mutiara */}
          <rect
            x="25"
            y="62"
            width="38"
            height="8"
            rx="4"
            fill="#D97706"
            stroke={stroke}
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="64"
            r="3"
            fill="#FEF08A"
            stroke={stroke}
            strokeWidth="1.8"
          />
          <circle
            cx="70"
            cy="64"
            r="3"
            fill="#FEF08A"
            stroke={stroke}
            strokeWidth="1.8"
          />
          <path
            d="M 12 73 Q 28 68 44 73 T 76 73"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}

export default function JuzAmmaStarsPage() {
  const navigate = useNavigate();
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();

  // Keep UfoSvg referenced safely
  void UfoSvg;

  const handlePlay = (url: string) => {
    triggerBibiReaction("play");
    toggle(url);
  };

  const handleSelect = (number: number) => {
    triggerBibiReaction("click");
    navigate(`/member/ngaji-ceria/explore/juz-amma/${number}`);
  };

  const handleBack = () => {
    navigate("/member/ngaji-ceria/map");
  };

  return (
    <NgajiCeriaLayout
      title="Samudra Juz 'Amma"
      hideHeader={true}
      themeScope="juz-amma"
      onBack={handleBack}
    >
      {/* Latar Langit Malam di Atas Samudra (#0F172A ke #0369A1) */}
      <div className="min-h-[100dvh] w-full bg-[#0369A1] relative overflow-x-hidden pb-32 select-none">
        {/* Kubah Langit Malam Berbintang Kuning di Bagian Atas */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-80 bg-[#0F172A] border-b-[4px] border-[#FEF08A]" />
        <OceanNightStarsSvg />

        {/* Bibir Pantai Pasir & Bintang Laut di Bagian Paling Bawah */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-24 bg-[#FDE68A] border-t-[4px] border-[#451A03] z-0"
          style={{
            clipPath:
              "polygon(0% 35%, 25% 15%, 55% 40%, 85% 10%, 100% 30%, 100% 100%, 0% 100%)",
          }}
        />

        <ExploreHeader
          title="Samudra Juz 'Amma"
          subtitle="Pelayaran Perahu Kertas & Kerang Mutiara"
          onBack={handleBack}
          themeScope="juz-amma"
          themeColorClass="bg-[#0F172A]"
          borderColorClass="border-[#FACC15]"
          shadowClass="shadow-[0_3px_0px_#134E4A]"
          textColorClass="text-[#FACC15]"
          backClass="bg-[#FACC15] text-[#134E4A] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
        />

        <div className="relative z-10 px-4 pt-4 max-w-4xl mx-auto">
          {/* ── HERO PELAYARAN SAMUDRA MALAM (Bentuk Dek Kapal Layar + Ilustrasi Perahu & Kerang) ── */}
          <section className="relative overflow-hidden rounded-[28px_28px_36px_36px] border-[4px] border-[#FACC15] bg-[#1E3A8A] p-5 pb-7 text-[#FFFFFF] shadow-[6px_6px_0px_#0F172A]">
            {/* Ornamen Jendela Kapal (Portholes) di Pojok Kiri Atas */}
            <div className="pointer-events-none absolute left-4 top-2.5 flex items-center gap-1.5 opacity-40">
              <span className="h-2.5 w-2.5 rounded-full border-[2px] border-[#FACC15] bg-[#38BDF8]" />
              <span className="h-2.5 w-2.5 rounded-full border-[2px] border-[#FACC15] bg-[#38BDF8]" />
              <span className="h-2.5 w-2.5 rounded-full border-[2px] border-[#FACC15] bg-[#38BDF8]" />
            </div>

            {/* Ilustrasi SVG Perahu Kertas, Kerang Mutiara & Mercusuar di Kanan Hero */}
            <div className="pointer-events-none absolute right-2 top-2 bottom-4 flex w-[34%] items-center justify-center">
              <svg
                viewBox="0 0 130 120"
                className="w-32 h-32"
                aria-hidden="true"
              >
                {/* Cahaya Bulan di Belakang */}
                <circle
                  cx="92"
                  cy="28"
                  r="16"
                  fill="#FEF08A"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                {/* Kerang Mutiara Kecil di Samping */}
                <path
                  d="M 78 86 C 75 70 84 62 96 62 C 108 62 117 70 114 86 Z"
                  fill="#FECDD3"
                  stroke="#134E4A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <circle
                  cx="96"
                  cy="78"
                  r="5"
                  fill="#FFFFFF"
                  stroke="#134E4A"
                  strokeWidth="2"
                />
                {/* Perahu Kertas Utama */}
                <polygon
                  points="46,18 18,62 46,62"
                  fill="#FEF08A"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <polygon
                  points="46,18 74,62 46,62"
                  fill="#FFFFFF"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <polygon
                  points="46,30 31,62 61,62"
                  fill="#FACC15"
                  stroke="#134E4A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <polygon
                  points="10,60 82,60 68,80 24,80"
                  fill="#D97706"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                {/* Gelombang Samudra Hero */}
                <path
                  d="M 6 84 Q 24 76 42 84 T 78 84 T 118 84"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 14 94 Q 34 88 54 94 T 98 94"
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="relative z-10 max-w-[68%] pt-2">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-[#FACC15] bg-[#0F172A] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FACC15] shadow-[2px_2px_0px_#0F172A]">
                {/* Ikon Perahu Kertas Mini pada Badge */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,3 4,14 12,14" fill="#FACC15" />
                  <polygon points="12,3 20,14 12,14" fill="#FFFFFF" />
                  <polygon points="2,14 22,14 18,20 6,20" fill="#38BDF8" />
                </svg>
                <span>Ekspedisi Samudra Juz &apos;Amma</span>
              </span>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-black leading-tight text-[#FFFFFF]">
                Berlayar dengan Perahu Kertas &amp; Temukan Kerang Surah!
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-[#134E4A] bg-[#FACC15] px-2.5 py-1 text-[10px] font-black text-[#134E4A] shadow-[2px_2px_0px_#0F172A]">
                  <StarSvg size={10} fill="#134E4A" stroke="#134E4A" />
                  <span>37 Pulau Surah</span>
                </span>
                <span className="inline-block rounded-lg border-[2.5px] border-[#134E4A] bg-[#38BDF8] px-2.5 py-1 text-[10px] font-black text-[#134E4A] shadow-[2px_2px_0px_#0F172A]">
                  ⚓ Perahu &amp; Kerang Mutiara
                </span>
              </div>
            </div>

            {/* Ornamen Pita Gelombang Laut di Tepi Bawah Hero */}
            <svg
              viewBox="0 0 400 20"
              preserveAspectRatio="none"
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 w-full"
              aria-hidden="true"
            >
              <path
                d="M 0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 T 250 10 T 300 10 T 350 10 T 400 10 L 400 20 L 0 20 Z"
                fill="#0284C7"
              />
            </svg>
          </section>

          {/* ── GRID KARTU PERAHU KERTAS & KERANG MUTIARA DI ATAS OMBAK ── */}
          <section className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
            {JUZ_AMMA_SURAHS.map((surah, i) => {
              const isSurahPlaying =
                isPlaying && currentAudioUrl === surah.audioUrl;
              const variant: VesselVariant =
                i % 2 === 0 ? "paperBoat" : "seashell";
              const meta = getSurahOceanMeta(surah.name, variant, i);

              return (
                <motion.div
                  key={surah.number}
                  onClick={() => handleSelect(surah.number)}
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      duration: 2.8 + (i % 5) * 0.35,
                      ease: "easeInOut",
                    },
                  }}
                  className={`group relative flex cursor-pointer flex-col items-center justify-between ${meta.cardShapeClass} border-[3.5px] ${
                    isSurahPlaying
                      ? "border-[#FACC15] bg-[#1E3A8A] drop-shadow-[0_0_10px_#FACC15]"
                      : "border-[#0F172A] bg-[#075985]/90 hover:bg-[#0C4A6E]"
                  } p-3.5 pt-4 shadow-[5px_5px_0px_#0F172A] transition-colors transform-gpu`}
                >
                  {/* Ornamen Gelembung Mutiara & Bintang di Sudut Kartu */}
                  <span
                    className={`pointer-events-none absolute top-2.5 ${
                      i % 2 ? "left-2.5" : "right-2.5"
                    } z-20 flex h-6 w-6 items-center justify-center rounded-full border-[2px] border-[#134E4A] bg-[#FACC15] text-[10px] font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#0F172A]`}
                  >
                    <StarSvg size={12} fill="#134E4A" stroke="#134E4A" />
                  </span>

                  {/* Gelembung Air Kecil Dekoratif */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3 left-3 h-2 w-2 rounded-full bg-[#BAE6FD]/60"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-6 left-5 h-1.5 w-1.5 rounded-full bg-[#BAE6FD]/40"
                  />

                  {/* Badge Kategori Visual Berdasarkan Judul Surah */}
                  <span className="relative z-10 rounded-full border-[2px] border-[#0F172A] bg-[#0F172A]/85 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#FACC15]">
                    {meta.badgeLabel}
                  </span>

                  {/* Perahu Kertas / Kerang + Riak Ombak */}
                  <div
                    className="relative my-1"
                    style={{ width: VESSEL_SIZE, height: VESSEL_SIZE }}
                  >
                    <OceanVesselVisual
                      variant={variant}
                      theme={meta.theme}
                      index={i}
                      size={VESSEL_SIZE}
                    />

                    {/* Nomor Surah (Mutiara / Lencana Layar) */}
                    <div className="absolute inset-0 flex items-center justify-center pt-3">
                      <span className="rounded-full bg-[#0F172A]/90 border-[2.5px] border-[#FACC15] px-2.5 py-0.5 font-display text-lg font-black text-[#FACC15] shadow-[2px_2px_0px_#134E4A]">
                        {surah.number}
                      </span>
                    </div>
                  </div>

                  {/* Papan Nama Perahu/Kerang Surah */}
                  <div className="relative z-10 flex w-full flex-col items-center">
                    <span
                      className={`inline-block max-w-full truncate rounded-xl border-[3px] border-[#134E4A] ${meta.plaqueBg} px-3.5 py-1 text-xs font-black ${meta.plaqueText} shadow-[3px_3px_0px_#0F172A]`}
                    >
                      {surah.name}
                    </span>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#FEF08A]">
                      <StarSvg size={10} fill="#FEF08A" stroke="#FEF08A" />
                      <span>{surah.ayah} Ayat Mutiara</span>
                    </span>

                    {/* Tombol Audio */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(surah.audioUrl);
                      }}
                      aria-label={
                        isSurahPlaying
                          ? `Jeda ${surah.name}`
                          : `Putar ${surah.name}`
                      }
                      className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border-[3px] border-[#134E4A] px-3 py-1.5 text-xs font-black shadow-[3px_3px_0px_#0F172A] transition-all active:translate-y-[1px] active:shadow-none cursor-pointer ${
                        isSurahPlaying
                          ? "bg-[#EF4444] text-[#FFFFFF]"
                          : "bg-[#FACC15] text-[#134E4A] hover:bg-[#FEF08A]"
                      }`}
                    >
                      {isSurahPlaying ? (
                        <EqualizerIcon
                          isPlaying={true}
                          size={14}
                          barClassName="bg-[#FFFFFF]"
                        />
                      ) : (
                        <Volume2 size={14} />
                      )}
                      {isSurahPlaying ? "Jeda" : "Putar"}
                    </button>
                  </div>

                  {/* Ornamen Gelombang Air di Dasar Kartu */}
                  <svg
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute bottom-0 left-0 right-0 h-2.5 w-full opacity-55 rounded-b-[20px]"
                    aria-hidden="true"
                  >
                    <path
                      d="M 0 7 Q 25 0 50 7 T 100 7 T 150 7 T 200 7 L 200 14 L 0 14 Z"
                      fill="#38BDF8"
                    />
                  </svg>
                </motion.div>
              );
            })}
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
