import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { useNgajiCeriaStore } from "../../hooks/useNgajiCeriaStore";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";
import { useAuth } from "@/contexts/AuthContext";
import { isUstadzUser, isTartilaAdmin } from "@/lib/roles";
import {
  ExploreHeader,
  ExploreStatBadge,
} from "../../components/ExploreHeader";
import { AnimatedProgressBar } from "@/components/ui/AnimatedProgressBar";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { MapPinSvg, LockSvg, TelescopeSvg } from "@/components/ui/CustomIcons";

/* ============================================================================
- VINTAGE ADVENTURE CARTOGRAPHY SVGS (Clean & Aligned Explorer Atlas)
- Palette: Parchment (#FEF3C7, #FFFBEB), Sepia Ink (#78350F, #451A03, #B45309),
- Wax Red Stamp (#B91C1C), Explorer Desk Teal (#0F766E, #134E4A)
- ============================================================================ */

interface SvgProps {
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
}

/** Paku Payung 3D (Push Pin) bergaya petualang - Lurus & Simetris */
const PushPinSvg: React.FC<{ isLocked?: boolean; className?: string }> = ({
  isLocked = false,
  className = "",
}) => (
  <svg
    width={26}
    height={30}
    viewBox="0 0 26 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Bayangan jatuh ke kertas */}
    <ellipse cx="13" cy="26" rx="5" ry="2.2" fill="#000000" opacity="0.28" />
    {/* Ujung jarum paku logam */}
    <path
      d="M11.5 18L13 26.5L14.5 18Z"
      fill="#475569"
      stroke="#1E293B"
      strokeWidth="0.8"
    />
    {/* Kepala paku payung merah / kuningan kusam jika terkunci */}
    <circle
      cx="13"
      cy="11"
      r="8"
      fill={isLocked ? "#78716C" : "#DC2626"}
      stroke={isLocked ? "#44403C" : "#7F1D1D"}
      strokeWidth="2"
    />
    <circle cx="13" cy="8.5" r="4.5" fill={isLocked ? "#A8A29E" : "#EF4444"} />
    {/* Kilau glossy highlight */}
    <ellipse cx="11" cy="7.5" rx="2" ry="1.2" fill="#FFFFFF" opacity="0.85" />
  </svg>
);

/** Ikon Kompas Bahari Emas & Sepia */
const CompassSvg: React.FC<SvgProps> = ({ size = 26, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="14"
      cy="14"
      r="12"
      fill="#FEF08A"
      stroke="#78350F"
      strokeWidth="2.5"
    />
    <circle
      cx="14"
      cy="14"
      r="9.5"
      fill="#FFFBEB"
      stroke="#B45309"
      strokeWidth="1.5"
      strokeDasharray="2 2"
    />
    {/* Jarum Kompas (Utara Merah, Selatan Sepia) */}
    <path
      d="M14 5.5L17 14L14 13L11 14Z"
      fill="#DC2626"
      stroke="#7F1D1D"
      strokeWidth="1.2"
    />
    <path
      d="M14 22.5L17 14L14 15L11 14Z"
      fill="#78350F"
      stroke="#451A03"
      strokeWidth="1.2"
    />
    <circle
      cx="14"
      cy="14"
      r="2"
      fill="#FEF08A"
      stroke="#78350F"
      strokeWidth="1.5"
    />
  </svg>
);

/** Ikon Gulungan Peta Kuno (Map Scroll) */
const MapScrollSvg: React.FC<SvgProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Gulungan Kertas Peta Utama */}
    <path
      d="M6 5.5C6 4 7.5 3 9.5 3H18.5C20.5 3 22 4 22 5.5V21C22 22.5 20.5 23.5 18.5 23.5H9.5C7.5 23.5 6 22.5 6 21V5.5Z"
      fill="#FEF3C7"
      stroke="#78350F"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Batang rol gulungan kayu */}
    <path
      d="M5 5C5 3.5 6.5 2.5 8 2.5V24C6.5 24 5 23 5 21.5V5Z"
      fill="#FDE68A"
      stroke="#78350F"
      strokeWidth="1.8"
    />
    <path
      d="M20 2.5C21.5 2.5 23 3.5 23 5V21.5C23 23 21.5 24 20 24V2.5Z"
      fill="#FDE68A"
      stroke="#78350F"
      strokeWidth="1.8"
    />
    {/* Rute ekspedisi bertitik merah */}
    <path
      d="M10 9C12 8 13 12 15 11C17 10 17 14 18 16"
      stroke="#B45309"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    <circle cx="10" cy="9" r="1.5" fill="#DC2626" />
    <path
      d="M17 15L19 17L17 19"
      stroke="#DC2626"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const StarSvg: React.FC<SvgProps> = ({
  size = 14,
  className = "",
  fill = "#FBBF24",
  stroke = "#78350F",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2.5L14.8 8.2L21 9.1L16.5 13.5L17.6 19.7L12 16.8L6.4 19.7L7.5 13.5L3 9.1L9.2 8.2L12 2.5Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

const SparklesSvg: React.FC<SvgProps> = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
      fill="#FBBF24"
      stroke="#78350F"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="19" cy="5" r="2" fill="#DC2626" />
  </svg>
);

/** Gembok Kayu / Kuno untuk Jilid Terkunci */
const WoodLockSvg: React.FC<SvgProps> = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10"
      stroke="#78350F"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <rect
      x="4"
      y="10"
      width="16"
      height="12"
      rx="3"
      fill="#92400E"
      stroke="#451A03"
      strokeWidth="2.5"
    />
    {/* Pelat besi & lubang kunci */}
    <circle
      cx="12"
      cy="15"
      r="2"
      fill="#FEF3C7"
      stroke="#451A03"
      strokeWidth="1.2"
    />
    <path
      d="M12 17V19"
      stroke="#451A03"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowRightSvg: React.FC<SvgProps> = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 12H18M18 12L12 6M18 12L12 18"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Latar Belakang Meja Kerja Petualang (Adventurer's Desk with Navigational Grid) */
const AdventurerDeskDecor = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0 opacity-20">
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="desk-grid-pattern"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 64 0 L 0 0 0 64"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="0.9"
            strokeDasharray="4 4"
          />
          <circle cx="0" cy="0" r="1.5" fill="#FDE68A" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#desk-grid-pattern)" />

      {/* Mawar Kompas Navigasi (Nautical Compass Rose) di sudut kanan */}
      <g transform="translate(680, 160) scale(1.4)" opacity="0.6">
        <circle
          cx="0"
          cy="0"
          r="70"
          fill="none"
          stroke="#FDE68A"
          strokeWidth="1.5"
        />
        <circle
          cx="0"
          cy="0"
          r="50"
          fill="none"
          stroke="#FDE68A"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <path d="M 0 -70 L 10 -20 L 0 0 L -10 -20 Z" fill="#FDE68A" />
        <path d="M 0 70 L 10 20 L 0 0 L -10 20 Z" fill="#FDE68A" />
        <path d="M 70 0 L 20 10 L 0 0 L 20 -10 Z" fill="#FDE68A" />
        <path d="M -70 0 L -20 10 L 0 0 L -20 -10 Z" fill="#FDE68A" />
        <text x="-4" y="-76" fill="#FDE68A" fontSize="12" fontWeight="bold">
          N
        </text>
        <text x="-4" y="88" fill="#FDE68A" fontSize="12" fontWeight="bold">
          S
        </text>
        <text x="76" y="4" fill="#FDE68A" fontSize="12" fontWeight="bold">
          E
        </text>
        <text x="-88" y="4" fill="#FDE68A" fontSize="12" fontWeight="bold">
          W
        </text>
      </g>
    </svg>
  </div>
);

/** Sketsa Kartografi Sepia Monokromatik di atas Kertas Kuno */
const CardIllustration = ({ jilid }: { jilid: number }) => {
  switch (jilid) {
    case 1:
      // Pulau Kepulauan Huruf Hijaiyah
      return (
        <svg
          viewBox="0 0 160 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#78350F]"
        >
          <path
            d="M 10 90 Q 40 50 80 85 T 150 75 L 160 120 L 0 120 Z"
            fill="#B45309"
            opacity="0.18"
          />
          <path
            d="M 0 95 Q 50 65 100 95 T 160 85 L 160 120 L 0 120 Z"
            fill="#78350F"
            opacity="0.12"
          />
          <path
            d="M 15 88 Q 45 48 85 83 T 155 73"
            stroke="#78350F"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 20 105 Q 30 102 40 105"
            stroke="#92400E"
            strokeWidth="1.2"
            fill="none"
            opacity="0.35"
          />
          <path
            d="M 70 108 Q 80 105 90 108"
            stroke="#92400E"
            strokeWidth="1.2"
            fill="none"
            opacity="0.35"
          />
          <circle
            cx="130"
            cy="35"
            r="14"
            stroke="#B45309"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            fill="none"
            opacity="0.3"
          />
        </svg>
      );
    case 2:
      // Gurun Pasir Huruf Bersambung
      return (
        <svg
          viewBox="0 0 160 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#78350F]"
        >
          <path
            d="M -10 80 Q 30 40 75 75 T 170 65 L 170 120 L -10 120 Z"
            fill="#92400E"
            opacity="0.16"
          />
          <path
            d="M 10 95 Q 60 70 110 95 T 170 85 L 170 120 L 0 120 Z"
            fill="#78350F"
            opacity="0.12"
          />
          <path
            d="M -5 78 Q 32 38 77 73 T 170 63"
            stroke="#92400E"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 15 50 Q 25 46 35 50"
            stroke="#78350F"
            strokeWidth="1.2"
            fill="none"
            opacity="0.3"
          />
        </svg>
      );
    case 3:
      // Pegunungan Mad & Lembah Hijaiyah
      return (
        <svg
          viewBox="0 0 160 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#78350F]"
        >
          <polygon points="10,120 45,45 80,120" fill="#78350F" opacity="0.15" />
          <path
            d="M 45 45 L 45 120"
            stroke="#78350F"
            strokeWidth="1.2"
            opacity="0.3"
          />
          <polygon
            points="65,120 105,30 145,120"
            fill="#92400E"
            opacity="0.18"
          />
          <path
            d="M 105 30 L 105 120"
            stroke="#78350F"
            strokeWidth="1.2"
            opacity="0.35"
          />
          <polygon
            points="120,120 145,60 170,120"
            fill="#78350F"
            opacity="0.12"
          />
        </svg>
      );
    case 4:
      // Pesisir Salju & Samudera Waqaf
      return (
        <svg
          viewBox="0 0 160 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#78350F]"
        >
          <polygon points="0,120 40,35 85,120" fill="#78350F" opacity="0.14" />
          <polygon
            points="60,120 110,25 155,120"
            fill="#92400E"
            opacity="0.17"
          />
          <path d="M 40 35 L 30 65 L 50 65 Z" fill="#FFFBEB" opacity="0.4" />
          <path d="M 110 25 L 98 55 L 122 55 Z" fill="#FFFBEB" opacity="0.4" />
          <circle cx="30" cy="25" r="2" fill="#78350F" opacity="0.3" />
          <circle cx="130" cy="20" r="2.5" fill="#78350F" opacity="0.3" />
        </svg>
      );
    case 5:
      // Cagar Tajwid Lembah Api & Batu Bara
      return (
        <svg
          viewBox="0 0 160 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#78350F]"
        >
          <polygon points="15,120 80,35 145,120" fill="#78350F" opacity="0.2" />
          <polygon points="80,35 65,70 95,70" fill="#92400E" opacity="0.25" />
          <path
            d="M 75 30 Q 80 15 90 10 Q 85 22 80 35"
            stroke="#78350F"
            strokeWidth="1.5"
            fill="none"
            opacity="0.35"
          />
          <circle
            cx="95"
            cy="18"
            r="7"
            stroke="#78350F"
            strokeWidth="1"
            strokeDasharray="2 2"
            fill="none"
            opacity="0.3"
          />
        </svg>
      );
    case 6:
      // Benteng Kelulusan Khatam & Observatorium Langit
      return (
        <svg
          viewBox="0 0 160 120"
          preserveAspectRatio="none"
          className="w-full h-full text-[#78350F]"
        >
          <circle
            cx="120"
            cy="45"
            r="35"
            stroke="#78350F"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            fill="none"
            opacity="0.25"
          />
          <circle cx="120" cy="45" r="25" fill="#92400E" opacity="0.12" />
          <polygon points="10,120 35,65 60,120" fill="#78350F" opacity="0.15" />
          <polygon
            points="50,120 75,55 100,120"
            fill="#78350F"
            opacity="0.18"
          />
          <circle cx="50" cy="35" r="1.5" fill="#78350F" opacity="0.4" />
          <circle cx="75" cy="25" r="2" fill="#78350F" opacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
};

interface TilawatiLevel {
  jilid: number;
  title: string;
  regionName: string;
  coords: string;
  desc: string;
  unlocked: boolean;
  progress: number;
  totalStars: number;
  earnedStars: number;
}

const TILAWATI_LEVELS: TilawatiLevel[] = [
  {
    jilid: 1,
    title: "Tilawati 1",
    regionName: "Kepulauan Hijaiyah",
    coords: "01°N • 101°E",
    desc: "Mengenal Huruf Hijaiyah & Bunyi Fathah",
    unlocked: true,
    progress: 15,
    totalStars: 93,
    earnedStars: 0,
  },
  {
    jilid: 2,
    title: "Tilawati 2",
    regionName: "Lembah Sambung",
    coords: "02°N • 104°E",
    desc: "Huruf Bersambung & Harokat Kasrah/Dhammah",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 3,
    title: "Tilawati 3",
    regionName: "Pegunungan Irama",
    coords: "03°N • 108°E",
    desc: "Panjang Pendek (Mad Asli) & Ketukan Irama",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 4,
    title: "Tilawati 4",
    regionName: "Tanjung Waqaf",
    coords: "04°N • 112°E",
    desc: "Tanwin, Sukun & Aturan Waqaf (Berhenti)",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 5,
    title: "Tilawati 5",
    regionName: "Kawah Dengung",
    coords: "05°N • 116°E",
    desc: "Tasydid, Idgham, Ikhfa & Dengung Ghunnah",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 6,
    title: "Tilawati 6",
    regionName: "Puncak Khatam",
    coords: "06°N • 120°E",
    desc: "Gharib, Fawatihussuwar & Khatam Al-Qur'an",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
];

export default function TilawatiAdventurePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isBypass = isUstadzUser(user) || isTartilaAdmin(user?.role);
  const stars = useNgajiCeriaStore((s) => s.stars);
  const totalStars = Object.values(stars).reduce((sum, v) => sum + (v || 0), 0);

  const handleLevelClick = (level: TilawatiLevel) => {
    const isUnlocked = isBypass || level.unlocked;
    if (!isUnlocked) return;
    triggerBibiReaction("play");
    navigate(`/member/ngaji-ceria/explore/tilawati/${level.jilid}`);
  };

  return (
    <NgajiCeriaLayout
      title="Pilih Jilid"
      hideHeader={true}
      themeScope="tilawati"
    >
      {/* Header Terstandarisasi Petualangan Tilawati [Hati] [Koin] [Bintang] */}
      <ExploreHeader
        title="Meja Petualangan"
        subtitle="Pilih Gulungan Peta Tilawati"
        onBack={() => navigate("/member/ngaji-ceria/map")}
        themeScope="tilawati"
        themeColorClass="bg-[#0D4D47]"
        borderColorClass="border-[#F59E0B]"
        shadowClass="shadow-[0_4px_0px_#042F2E]"
        textColorClass="text-[#FEF3C7]"
        backClass="bg-[#FEF3C7] text-[#451A03] border-[#78350F] shadow-[2px_2px_0px_#451A03] hover:bg-[#FDE68A]"
        extraBadge={
          <ExploreStatBadge
            icon={<StarSvg size={18} fill="#F59E0B" className="shrink-0" />}
            value={`${totalStars}/93`}
            title={`Total Bintang: ${totalStars}/93`}
            className="bg-[#FEF3C7] text-[#451A03] border-[#78350F] shadow-[2px_2px_0px_#451A03]"
          />
        }
      />

      {/* SUASANA MEJA PETUALANGAN (Adventurer's Desk Canvas) */}
      <div className="relative min-h-[100dvh] w-full bg-[#0F766E] pb-32 overflow-x-hidden">
        {/* Ornamen Peta & Grid Samudra Lurus */}
        <AdventurerDeskDecor />

        {/* 1. HERO MISSION DISPATCH: Papan Rencana Ekspedisi */}
        <section className="relative z-10 px-4 pt-6 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-[#134E4A] border-[3px] border-[#F59E0B] p-4 sm:p-5 text-[#FEF3C7] shadow-[0_5px_0px_#042F2E]">
            {/* Paku sudut kuningan */}
            <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#F59E0B] border border-[#78350F]" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#F59E0B] border border-[#78350F]" />
            <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-[#F59E0B] border border-[#78350F]" />
            <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-[#F59E0B] border border-[#78350F]" />

            <div className="flex items-center gap-3.5 sm:gap-4 px-1">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] border-2 border-[#78350F] text-[#78350F] shadow-[2px_2px_0px_#042F2E]">
                <CompassSvg size={32} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#F59E0B] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#451A03] mb-1">
                  <SparklesSvg size={11} /> Ekspedisi Tilawati
                </span>
                <h1 className="font-display font-black text-lg sm:text-2xl text-[#FEF3C7] leading-tight">
                  Atlas Pulau Mengaji
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-teal-100/90 leading-snug mt-0.5">
                  Pilih wilayah peta untuk memulai penjelajahan setiap jilid dan
                  kumpulkan seluruh bintang!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. GRID KERTAS PETA (Aligned & Straight Map Scroll Cards) */}
        <section className="relative z-10 px-4 pt-7 pb-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {TILAWATI_LEVELS.map((level, index) => {
              const stepFormatted = String(level.jilid).padStart(2, "0");
              const isUnlocked = isBypass || level.unlocked;

              return (
                <motion.div
                  key={level.jilid}
                  initial={{
                    opacity: 0,
                    y: 16,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                      delay: index * 0.04,
                    },
                  }}
                  className="relative pt-3 flex flex-col"
                >
                  {/* Ornamen Paku Payung (Push Pin) Simetris di Tengah Atas */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-sm">
                    <PushPinSvg isLocked={!isUnlocked} />
                  </div>

                  {/* KERTAS PETA KUNING (PARCHMENT MAP CARD - LURUS & RAPI) */}
                  {isUnlocked ? (
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98, y: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      onClick={() => handleLevelClick(level)}
                      className="group relative flex-1 flex flex-col justify-between rounded-xl bg-[#FEF3C7] border-[3px] border-[#78350F] p-4 sm:p-5 shadow-[0_5px_0px_#451A03] hover:shadow-[0_7px_0px_#451A03] transition-all cursor-pointer overflow-hidden"
                    >
                      {/* Garis Bingkai Peta Navigasi Lurus */}
                      <div className="absolute inset-1.5 border border-[#B45309]/35 rounded-lg pointer-events-none" />

                      {/* Siku Sudut Kompas (Cartography Corner Brackets) */}
                      <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t-2 border-l-2 border-[#78350F]/50 pointer-events-none" />
                      <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t-2 border-r-2 border-[#78350F]/50 pointer-events-none" />
                      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b-2 border-l-2 border-[#78350F]/50 pointer-events-none" />
                      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b-2 border-r-2 border-[#78350F]/50 pointer-events-none" />

                      {/* Sketsa Kartografi Sepia Latar Belakang */}
                      <div className="absolute inset-0 opacity-25 pointer-events-none">
                        <CardIllustration jilid={level.jilid} />
                      </div>

                      {/* Baris Atas: Ikon Peta Gulungan + Nomor Wilayah & Bintang */}
                      <div className="relative z-10 flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDE68A] border-2 border-[#78350F] text-[#78350F] shadow-[2px_2px_0px_#78350F]">
                            <MapScrollSvg size={20} />
                          </div>
                          <div>
                            <span className="block font-display text-[10px] font-black uppercase tracking-widest text-[#92400E] leading-none">
                              Wilayah #{stepFormatted}
                            </span>
                            <span className="block text-[9px] font-bold text-[#78350F]/70 mt-0.5 font-mono">
                              {level.coords}
                            </span>
                          </div>
                        </div>

                        {/* Badge Bintang Kertas & Akses Ustadz */}
                        <div className="flex items-center gap-1.5">
                          {isBypass && !level.unlocked && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#78350F] bg-[#FEF08A] border-2 border-[#78350F] px-2 py-0.5 rounded-lg shadow-[1.5px_1.5px_0px_#78350F] uppercase tracking-wider">
                              Akses Ustadz
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#78350F] bg-[#FDE68A] border-2 border-[#78350F] px-2.5 py-0.5 rounded-lg shadow-[2px_2px_0px_#78350F]">
                            <StarSvg size={12} fill="#F59E0B" stroke="#78350F" />
                            <span>
                              {level.earnedStars}/{level.totalStars}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Teks Informasi: Judul Wilayah & Deskripsi */}
                      <div className="relative z-10 my-1">
                        <div className="inline-flex items-center gap-1 rounded bg-[#FDE68A]/90 border border-[#B45309]/40 px-1.5 py-0.5 text-[10px] font-extrabold text-[#92400E] mb-1">
                          <MapPinSvg size={11} stroke="#92400E" /> {level.regionName}
                        </div>
                        <h2 className="font-display font-black text-lg sm:text-xl text-[#451A03] tracking-wide leading-tight">
                          {level.title}
                        </h2>
                        <p className="text-xs font-bold text-[#78350F]/90 leading-snug mt-1 line-clamp-2">
                          {level.desc}
                        </p>
                      </div>

                      {/* Baris Bawah: Tracker Jalur + Tombol Lurus "BUKA PETA" */}
                      <div className="relative z-10 mt-3.5 pt-3 border-t-2 border-dashed border-[#B45309]/35 flex items-center justify-between gap-2.5">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-[10px] font-black text-[#78350F] mb-1">
                            <span>Jalur Jelajah</span>
                            <span>
                              <AnimatedCounter value={level.progress} />%
                            </span>
                          </div>
                          <AnimatedProgressBar
                            value={Math.max(level.progress, 8)}
                            height="h-2"
                            className="bg-[#78350F]/15 border-[#78350F]/30"
                            barClassName="bg-[#B91C1C]"
                          />
                        </div>

                        {/* Tombol Lurus & Tegas "BUKA PETA" */}
                        <div className="shrink-0">
                          <div className="flex items-center gap-1.5 rounded-lg border-2 border-[#7F1D1D] bg-[#DC2626] px-3 py-1.5 text-white shadow-[2px_2px_0px_#451A03] group-hover:bg-[#B91C1C] transition-colors">
                            <span className="font-display font-black text-[11px] uppercase tracking-wider">
                              BUKA PETA
                            </span>
                            <ArrowRightSvg size={12} className="shrink-0" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* KERTAS PETA TERKUNCI (Weathered Parchment - Lurus & Simetris) */
                    <div className="relative flex-1 flex flex-col justify-between rounded-xl bg-[#E5E7EB]/95 border-[3px] border-[#4B5563] p-4 sm:p-5 shadow-[0_5px_0px_#1F2937] overflow-hidden select-none">
                      {/* Garis Bingkai Dalam Putus-putus */}
                      <div className="absolute inset-1.5 border border-dashed border-[#6B7280]/45 rounded-lg pointer-events-none" />

                      {/* Sketsa Latar Belakang Pudar */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <CardIllustration jilid={level.jilid} />
                      </div>

                      {/* Baris Atas */}
                      <div className="relative z-10 flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-300 border-2 border-gray-600 text-gray-700">
                            <WoodLockSvg size={18} />
                          </div>
                          <div>
                            <span className="block font-display text-[10px] font-black uppercase tracking-widest text-gray-600 leading-none">
                              Wilayah #{stepFormatted}
                            </span>
                            <span className="block text-[9px] font-bold text-gray-500 mt-0.5 font-mono">
                              {level.coords}
                            </span>
                          </div>
                        </div>
                        <span className="rounded-md bg-gray-300 border border-gray-500 px-2 py-0.5 text-[10px] font-black text-gray-600 uppercase tracking-wider">
                          Terkunci
                        </span>
                      </div>

                      {/* Teks Judul */}
                      <div className="relative z-10 my-1">
                        <div className="inline-flex items-center gap-1 rounded bg-gray-300/80 border border-gray-400 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 mb-1">
                          <LockSvg size={11} stroke="#4B5563" /> {level.regionName}
                        </div>
                        <h2 className="font-display font-black text-lg sm:text-xl text-gray-700 leading-tight">
                          {level.title}
                        </h2>
                        <p className="text-xs font-semibold text-gray-500 leading-snug mt-1 line-clamp-2">
                          Selesaikan Jilid {level.jilid - 1} untuk membuka jalur
                          ekspedisi ke wilayah ini.
                        </p>
                      </div>

                      {/* Baris Bawah Gembok Kayu */}
                      <div className="relative z-10 mt-3.5 pt-3 border-t-2 border-dashed border-gray-400/50 flex items-center justify-center">
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#78350F] border-2 border-[#451A03] px-3.5 py-1.5 shadow-[2px_2px_0px_#1F2937] text-[#FEF3C7]">
                          <WoodLockSvg size={14} />
                          <span className="font-display font-black text-[10px] uppercase tracking-wider">
                            Wilayah Terkunci
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 3. PETA RAHASIA TAMBAHAN: Galaksi Juz 'Amma (Celestial Star Map Scroll) */}
        <section className="relative z-10 px-4 mt-4 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              triggerBibiReaction("play");
              navigate("/member/ngaji-ceria/explore/juz-amma");
            }}
            className="relative overflow-hidden rounded-2xl bg-[#1E1B4B] border-[3px] border-[#FEF08A] p-4 sm:p-5 flex items-center justify-between shadow-[0_5px_0px_#042F2E] cursor-pointer"
          >
            {/* Paku sudut peta bintang */}
            <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#FEF08A] border border-[#78350F]" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FEF08A] border border-[#78350F]" />

            <div className="relative z-10 flex items-center gap-3.5 sm:gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-[#312E81] border-2 border-[#FEF08A] text-[#FEF08A] shadow-[2px_2px_0px_#0F172A]">
                <TelescopeSvg size={26} stroke="#FEF08A" />
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#FEF08A]">
                  <SparklesSvg size={11} /> Ekspedisi Bintang
                </span>
                <h3 className="font-display font-black text-base sm:text-xl text-white leading-tight">
                  Atlas Galaksi Juz 'Amma
                </h3>
                <p className="text-xs font-semibold text-indigo-200/90 leading-snug mt-0.5 max-w-md">
                  Jelajahi peta rasi bintang untuk menghafal surat-surat pendek
                  dengan audio interaktif!
                </p>
              </div>
            </div>

            <div className="relative z-10 hidden xs:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF08A] border-2 border-[#1E1B4B] text-[#1E1B4B] shadow-[2px_2px_0px_#0F172A] font-black text-xs">
              <ArrowRightSvg size={16} />
            </div>
          </motion.div>
        </section>
      </div>
    </NgajiCeriaLayout>
  );
}
