import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import {
  ChevronRight,
  Sparkles,
  MusicSvg,
  DrumSvg,
  GameCardSvg,
  StarSvg,
  CheckSvg,
} from "@/components/ui/CustomIcons";
import { StickerCard } from "@/components/ui";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { soundManager } from "../../services/soundManager";

/* ============================================================================
   CUSTOM NEO-BRUTALIST SAVANA TRAINING ILLUSTRATIONS & ICONS
   ============================================================================ */

/** 1. Ikon Utama untuk Tartila Rhythm Memory (Kartu + Drum Djembe & Not Irama) */
const RhythmMemoryIconSvg = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12 overflow-visible">
    {/* Hard Offset Shadow */}
    <rect x="9" y="9" width="24" height="32" rx="5" fill="#451A03" />
    <rect x="21" y="14" width="25" height="33" rx="5" fill="#451A03" />

    {/* Kartu Belakang (Kuning) */}
    <rect
      x="6"
      y="6"
      width="24"
      height="32"
      rx="5"
      fill="#FEF08A"
      stroke="#451A03"
      strokeWidth="3"
    />
    <circle cx="18" cy="22" r="4" fill="#F59E0B" />

    {/* Kartu Depan (Hijau Savana) */}
    <rect
      x="18"
      y="11"
      width="25"
      height="33"
      rx="5"
      fill="#4ADE80"
      stroke="#451A03"
      strokeWidth="3"
    />

    {/* Lingkaran Drum Ketukan */}
    <circle
      cx="30.5"
      cy="28"
      r="7.5"
      fill="#FFFBEB"
      stroke="#451A03"
      strokeWidth="2.8"
    />

    {/* Not Musik Irama */}
    <circle
      cx="29"
      cy="30"
      r="3"
      fill="#D97706"
      stroke="#451A03"
      strokeWidth="2"
    />
    <path
      d="M32 30V17L42 19.5V24.5L32 22"
      fill="#F59E0B"
      stroke="#451A03"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

/** 2. Ikon Utama untuk Lab Irama Tilawati (Metronom Kayu & Gelombang Nada Rost) */
const LabIramaIconSvg = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12 overflow-visible">
    {/* Hard Offset Shadow */}
    <path d="M21 11H39L46 47H14L21 11Z" fill="#451A03" />

    {/* Badan Metronom Kayu */}
    <path
      d="M18 8H36L43 44H11L18 8Z"
      fill="#D97706"
      stroke="#451A03"
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* Panel Skala Dalam */}
    <path
      d="M22 14H32L36 38H18L22 14Z"
      fill="#FEF3C7"
      stroke="#451A03"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Garis Skala Tempo */}
    <path
      d="M24 20H30 M23 26H31 M22 32H32"
      stroke="#B45309"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Jarum Bandul Metronom */}
    <line
      x1="27"
      y1="39"
      x2="40"
      y2="13"
      stroke="#451A03"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <circle
      cx="35.5"
      cy="22"
      r="5"
      fill="#FACC15"
      stroke="#451A03"
      strokeWidth="2.5"
    />

    {/* Kaki Dasar Metronom */}
    <rect
      x="9"
      y="41"
      width="36"
      height="7"
      rx="3.5"
      fill="#78350F"
      stroke="#451A03"
      strokeWidth="3"
    />
  </svg>
);

/** 3. Ikon Utama untuk Arena Kartu Klasik (Sepasang Kartu Hijaiyah & Kilau Cepat) */
const ArenaKartuIconSvg = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12 overflow-visible">
    {/* Hard Offset Shadow */}
    <rect
      x="9"
      y="14"
      width="24"
      height="33"
      rx="5"
      transform="rotate(-8 9 14)"
      fill="#451A03"
    />
    <rect
      x="25"
      y="11"
      width="25"
      height="34"
      rx="5"
      transform="rotate(6 25 11)"
      fill="#451A03"
    />

    {/* Kartu Kiri Tertutup */}
    <rect
      x="6"
      y="11"
      width="24"
      height="33"
      rx="5"
      transform="rotate(-8 6 11)"
      fill="#15803D"
      stroke="#451A03"
      strokeWidth="3"
    />
    <circle
      cx="16"
      cy="26"
      r="4.5"
      fill="#FEF08A"
      stroke="#451A03"
      strokeWidth="2"
    />

    {/* Kartu Kanan Terbuka (Huruf Ba) */}
    <rect
      x="22"
      y="8"
      width="25"
      height="34"
      rx="5"
      transform="rotate(6 22 8)"
      fill="#FEF9C3"
      stroke="#451A03"
      strokeWidth="3"
    />
    <path
      d="M29 24V27C29 30 40 30 40 27V24"
      stroke="#451A03"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="34.5" cy="33.5" r="2.5" fill="#EF4444" />
  </svg>
);

/** Ilustrasi Dekoratif di Dalam Tenda */
const ProgramBackdropIllustration = ({ id }: { id: string }) => {
  switch (id) {
    case "rhythm-memory":
      return (
        <svg
          viewBox="0 0 180 140"
          fill="none"
          className="pointer-events-none absolute -right-2 -bottom-2 h-36 w-44 opacity-25 select-none"
        >
          <rect
            x="62"
            y="72"
            width="12"
            height="48"
            rx="6"
            fill="#15803D"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <rect
            x="82"
            y="44"
            width="12"
            height="76"
            rx="6"
            fill="#16A34A"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <rect
            x="102"
            y="58"
            width="12"
            height="62"
            rx="6"
            fill="#15803D"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <rect
            x="122"
            y="28"
            width="12"
            height="92"
            rx="6"
            fill="#14532D"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <rect
            x="142"
            y="50"
            width="12"
            height="70"
            rx="6"
            fill="#16A34A"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <circle
            cx="128"
            cy="16"
            r="6"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="2.5"
          />
        </svg>
      );

    case "lab-irama":
      return (
        <svg
          viewBox="0 0 180 140"
          fill="none"
          className="pointer-events-none absolute -right-2 -bottom-2 h-36 w-44 opacity-25 select-none"
        >
          {/* Kurva Tangga Nada Datar - Naik - Turun */}
          <path
            d="M 15 90 L 65 90 C 85 90, 90 40, 115 40 C 140 40, 145 105, 170 105"
            stroke="#78350F"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle
            cx="40"
            cy="90"
            r="8"
            fill="#D97706"
            stroke="#451A03"
            strokeWidth="3"
          />
          <circle
            cx="115"
            cy="40"
            r="9"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="3"
          />
          <circle
            cx="165"
            cy="105"
            r="8"
            fill="#D97706"
            stroke="#451A03"
            strokeWidth="3"
          />
        </svg>
      );

    case "arena-kartu":
      return (
        <svg
          viewBox="0 0 180 140"
          fill="none"
          className="pointer-events-none absolute -right-2 -bottom-2 h-36 w-44 opacity-25 select-none"
        >
          <rect
            x="56"
            y="30"
            width="46"
            height="62"
            rx="8"
            transform="rotate(-8 56 30)"
            fill="#F59E0B"
            stroke="#451A03"
            strokeWidth="4"
          />
          <rect
            x="112"
            y="24"
            width="46"
            height="62"
            rx="8"
            transform="rotate(6 112 24)"
            fill="#FEF08A"
            stroke="#451A03"
            strokeWidth="4"
          />
        </svg>
      );

    default:
      return null;
  }
};

interface TrainingProgram {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeBg: string;
  roofPrimary: string;
  roofSecondary: string;
  curtainColor: string;
  flagColor: string;
  skills: string[];
  to: string;
  themeBg: string;
  borderColor: string;
  accentBg: string;
  buttonBg: string;
  textColor: string;
  isFeatured?: boolean;
  renderIcon: () => React.ReactNode;
}

const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: "rhythm-memory",
    title: "Tartila Rhythm Memory",
    subtitle: "Tenda Memori + Ketukan Irama",
    description:
      "Gabungan asah otak visual dan ketukan irama Tilawati di tenda savana! Balik kartu, dengarkan lantunan qari, dan ketuk panah sesuai ketukan nada.",
    badge: "Kemah Unggulan",
    badgeBg: "bg-[#15803D]",
    roofPrimary: "#15803D",
    roofSecondary: "#22C55E",
    curtainColor: "#166534",
    flagColor: "#EF4444",
    skills: ["Memori Visual", "Ketukan Irama", "Audio Qari"],
    to: "/member/ngaji-ceria/rhythm-memory",
    themeBg: "bg-[#DCFCE7]",
    borderColor: "border-[#451A03]",
    accentBg: "bg-[#FEF08A]",
    buttonBg: "bg-[#15803D] hover:bg-[#166534] text-[#FFFFFF] border-[#451A03]",
    textColor: "text-[#14532D]",
    isFeatured: true,
    renderIcon: () => <RhythmMemoryIconSvg />,
  },
  {
    id: "lab-irama",
    title: "Lab Irama Tilawati",
    subtitle: "Tenda Nada Rost & Metronom",
    description:
      "Latih kepekaan telingamu membedakan 3 tingkatan nada Rost Tilawati (Datar, Naik, Turun) dan jaga konsistensi panjang-pendek bacaan bersama metronom kayu.",
    badge: "Audio & Nada",
    badgeBg: "bg-[#D97706]",
    roofPrimary: "#D97706",
    roofSecondary: "#FBBF24",
    curtainColor: "#B45309",
    flagColor: "#16A34A",
    skills: ["Nada Datar-Naik-Turun", "Metronom Mad", "Fokus Telinga"],
    to: "/member/ngaji-ceria/lab-irama",
    themeBg: "bg-[#FFFBEB]",
    borderColor: "border-[#451A03]",
    accentBg: "bg-[#FDE68A]",
    buttonBg: "bg-[#D97706] hover:bg-[#B45309] text-[#FEF3C7] border-[#451A03]",
    textColor: "text-[#451A03]",
    renderIcon: () => <LabIramaIconSvg />,
  },
  {
    id: "arena-kartu",
    title: "Arena Kartu Klasik",
    subtitle: "Tenda Ingatan Cepat Huruf & Ayat",
    description:
      "Uji ketangkasan memori mencocokkan huruf hijaiyah tunggal, kata berharakat, hingga potongan ayat suci di perkemahan savana sebelum waktu habis.",
    badge: "Memori Cepat",
    badgeBg: "bg-[#78350F]",
    roofPrimary: "#92400E",
    roofSecondary: "#F59E0B",
    curtainColor: "#78350F",
    flagColor: "#38BDF8",
    skills: ["Kecepatan Mata", "Jilid 1 - 6", "Tantangan Waktu"],
    to: "/member/ngaji-ceria/arena-kartu",
    themeBg: "bg-[#FEF9C3]",
    borderColor: "border-[#451A03]",
    accentBg: "bg-[#FEF08A]",
    buttonBg: "bg-[#78350F] hover:bg-[#451A03] text-[#FEF08A] border-[#451A03]",
    textColor: "text-[#451A03]",
    renderIcon: () => <ArenaKartuIconSvg />,
  },
];

export default function TilawatiTrainingPage() {
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    triggerBibiReaction("click");
    soundManager.playSfx("pop");
    navigate(to);
  };

  return (
    <NgajiCeriaLayout
      title="Perkemahan Savana Tilawati"
      hideHeader={true}
      themeScope="tilawati"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      {/* Header Eksplorasi Savana */}
      <ExploreHeader
        title="Perkemahan Savana"
        subtitle="Tenda Kemah Irama, Ketukan, & Memori Tilawati"
        onBack={() => navigate("/member/ngaji-ceria/map")}
        themeScope="tilawati"
        themeColorClass="bg-[#D97706]"
        borderColorClass="border-[#451A03]"
        shadowClass="shadow-[0_4px_0px_#451A03]"
        textColorClass="text-[#FEF3C7]"
        backClass="bg-[#FEF08A] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE047]"
      />

      {/* Latar Padang Rumput Savana (#FEF3C7) */}
      <div className="relative min-h-[100dvh] w-full bg-[#FEF3C7] overflow-x-clip pb-48 select-none">
        {/* Bintik Hangat Matahari Savana */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage: "radial-gradient(#D97706 2px, transparent 2px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-20">

          {/* ============================================================
              1. HERO BANNER: POS API UNGGUN UTAMA PADANG SAVANA
             ============================================================ */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] p-5 sm:p-7 shadow-[6px_6px_0px_#451A03] text-[#FEF3C7]">
              {/* Siluet Bulan & Bintang Malam Perkemahan di Sudut */}
              <div className="pointer-events-none absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#92400E] border-[3px] border-[#451A03] opacity-50" />

              {/* Ilustrasi Kanan: Api Unggun Savana & Tenda Kecil */}
              <div className="pointer-events-none absolute right-4 top-3 bottom-3 hidden sm:flex w-[32%] items-center justify-center">
                <motion.svg
                  viewBox="0 0 140 130"
                  fill="none"
                  className="h-full max-h-[130px] w-auto overflow-visible"
                  animate={{ scale: [1, 1.03, 1], y: [0, -2, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Bintang & Percikan Api Unggun */}
                  <circle
                    cx="32"
                    cy="28"
                    r="4"
                    fill="#FEF08A"
                    stroke="#451A03"
                    strokeWidth="2"
                  />
                  <circle
                    cx="108"
                    cy="24"
                    r="5"
                    fill="#FACC15"
                    stroke="#451A03"
                    strokeWidth="2"
                  />
                  <circle
                    cx="96"
                    cy="48"
                    r="3.5"
                    fill="#FB923C"
                    stroke="#451A03"
                    strokeWidth="2"
                  />

                  {/* Alas Tanah & Susunan Batu Api Unggun */}
                  <ellipse cx="70" cy="108" rx="52" ry="12" fill="#451A03" />
                  <ellipse
                    cx="70"
                    cy="105"
                    rx="48"
                    ry="10"
                    fill="#92400E"
                    stroke="#451A03"
                    strokeWidth="3"
                  />

                  {/* Kayu Bakar Menyilang Neo-Brutalism */}
                  <rect
                    x="24"
                    y="90"
                    width="92"
                    height="14"
                    rx="7"
                    transform="rotate(-12 70 97)"
                    fill="#B45309"
                    stroke="#451A03"
                    strokeWidth="3.5"
                  />
                  <rect
                    x="24"
                    y="90"
                    width="92"
                    height="14"
                    rx="7"
                    transform="rotate(12 70 97)"
                    fill="#D97706"
                    stroke="#451A03"
                    strokeWidth="3.5"
                  />

                  {/* Batu-Batu Melingkari Api */}
                  <ellipse
                    cx="34"
                    cy="106"
                    rx="11"
                    ry="7"
                    fill="#A8A29E"
                    stroke="#451A03"
                    strokeWidth="3"
                  />
                  <ellipse
                    cx="56"
                    cy="111"
                    rx="12"
                    ry="7.5"
                    fill="#78716C"
                    stroke="#451A03"
                    strokeWidth="3"
                  />
                  <ellipse
                    cx="84"
                    cy="111"
                    rx="12"
                    ry="7.5"
                    fill="#A8A29E"
                    stroke="#451A03"
                    strokeWidth="3"
                  />
                  <ellipse
                    cx="106"
                    cy="106"
                    rx="11"
                    ry="7"
                    fill="#78716C"
                    stroke="#451A03"
                    strokeWidth="3"
                  />

                  {/* Lidah Api Unggun Luar (Merah-Oranye) */}
                  <path
                    d="M70 14 C70 14 36 44 36 72 C36 90 51 100 70 100 C89 100 104 90 104 72 C104 54 90 40 82 28 C82 42 74 48 74 48 C74 30 70 14 70 14 Z"
                    fill="#EF4444"
                    stroke="#451A03"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />

                  {/* Lidah Api Tengah (Oranye Hangat) */}
                  <path
                    d="M70 32 C70 32 45 52 45 74 C45 87 56 95 70 95 C84 95 95 87 95 74 C95 58 78 44 70 32 Z"
                    fill="#F97316"
                    stroke="#451A03"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />

                  {/* Inti Api Unggun (Kuning Terang) */}
                  <path
                    d="M70 50 C70 50 54 64 54 78 C54 87 61 93 70 93 C79 93 86 87 86 78 C86 64 70 50 70 50 Z"
                    fill="#FACC15"
                    stroke="#451A03"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </div>

              {/* Konten Teks Hero */}
              <div className="relative z-10 sm:max-w-[66%]">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FEF08A] border-[3px] border-[#451A03] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#451A03] mb-2.5 shadow-[3px_3px_0px_#451A03]">
                  <Sparkles size={12} /> Api Unggun & Kemah Savana
                </span>
                <h1 className="font-display font-black text-2xl sm:text-3xl leading-tight text-[#FEF3C7]">
                  Perkemahan Latihan Santri Tartila
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#FDE68A] mt-2 leading-relaxed">
                  Pilih tenda kemah di padang savana! Asah kepekaan nada Rost,
                  ketukan panjang-pendek, serta daya ingat huruf di sekitar api
                  unggun!
                </p>

                {/* Indikator 3 Pilar Kemah */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FEF08A] border-[3px] border-[#451A03] px-3 py-1 text-[11px] font-black text-[#451A03] shadow-[3px_3px_0px_#451A03]">
                    <MusicSvg size={13} stroke="#451A03" /> 3 Nada Rost
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#4ADE80] border-[3px] border-[#451A03] px-3 py-1 text-[11px] font-black text-[#14532D] shadow-[3px_3px_0px_#451A03]">
                    <DrumSvg size={13} stroke="#14532D" /> Ketukan & Tempo
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#D97706] border-[3px] border-[#451A03] px-3 py-1 text-[11px] font-black text-[#FEF3C7] shadow-[3px_3px_0px_#451A03]">
                    <GameCardSvg size={13} stroke="#FEF3C7" /> Ingatan Visual
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================
              2. DAFTAR 3 TENDA KEMAH SAVANA (ANATOMI TENDA UTUH & MENYATU)
             ============================================================ */}
          <section className="px-4 pt-8 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-8 px-1">
              <div className="inline-flex items-center gap-2 bg-[#15803D] border-[3px] border-[#451A03] px-4 py-1.5 rounded-xl shadow-[3px_3px_0px_#451A03]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEF08A] border border-[#451A03]" />
                <h2 className="font-display font-black text-sm sm:text-base uppercase tracking-wider text-[#FEF08A]">
                  Pilih Tenda Kemah ({TRAINING_PROGRAMS.length})
                </h2>
              </div>
              <span className="rounded-xl bg-[#FFFBEB] border-[3px] border-[#451A03] px-3 py-1 text-[11px] font-black text-[#451A03] shadow-[2px_2px_0px_#451A03]">
                ⛺ Terbuka Bebas!
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-7 pt-2">
              {TRAINING_PROGRAMS.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98, y: 2 }}
                  onClick={() => handleNavigate(item.to)}
                  className="group relative flex flex-col items-center cursor-pointer"
                >
                  {/* ===================================================== */}
                  {/* A. BENDERA PUNCAK & ATAP KANVAS TENDA SAVANA (SVG)    */}
                  {/* ===================================================== */}
                  <div className="relative z-20 w-full -mb-2 pointer-events-none">
                    <svg
                      viewBox="0 0 320 132"
                      className="w-full h-auto overflow-visible drop-shadow-[4px_4px_0px_#451A03]"
                      fill="none"
                    >
                      {/* Tiang Kayu Puncak Tenda */}
                      <rect
                        x="156"
                        y="4"
                        width="8"
                        height="28"
                        rx="4"
                        fill="#78350F"
                        stroke="#451A03"
                        strokeWidth="3.5"
                      />

                      {/* Bendera Segitiga Berkibar di Puncak */}
                      <path
                        d="M162 6 L208 16 L162 26 Z"
                        fill={item.flagColor}
                        stroke="#451A03"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="160"
                        cy="6"
                        r="4"
                        fill="#FACC15"
                        stroke="#451A03"
                        strokeWidth="2.5"
                      />

                      {/* Tali Pancang Tenda Kiri & Kanan (Guy Ropes) */}
                      <line
                        x1="156"
                        y1="28"
                        x2="8"
                        y2="112"
                        stroke="#451A03"
                        strokeWidth="3"
                        strokeDasharray="6 5"
                      />
                      <line
                        x1="164"
                        y1="28"
                        x2="312"
                        y2="112"
                        stroke="#451A03"
                        strokeWidth="3"
                        strokeDasharray="6 5"
                      />

                      {/* Kubah Segitiga Atap Tenda Utama */}
                      <path
                        d="M160 24 L308 110 H12 L160 24 Z"
                        fill={item.roofPrimary}
                        stroke="#451A03"
                        strokeWidth="4.5"
                        strokeLinejoin="round"
                      />

                      {/* Panel Kanvas Belang Tengah (Safari Tent Stripes) */}
                      <path
                        d="M160 24 L224 110 H96 L160 24 Z"
                        fill={item.roofSecondary}
                        stroke="#451A03"
                        strokeWidth="4"
                        strokeLinejoin="round"
                      />

                      {/* Garis Jahitan Tengah Atap Tenda */}
                      <line
                        x1="160"
                        y1="24"
                        x2="160"
                        y2="110"
                        stroke="#451A03"
                        strokeWidth="3.5"
                      />

                      {/* Kilap Cahaya Matahari di Atap */}
                      <path
                        d="M142 46 L86 80"
                        stroke="#FFFFFF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.7"
                      />

                      {/* Renda Bibir Kanopi Tenda (Scalloped Valance Awning) */}
                      <path
                        d="M12 108 H308 V118 C308 125 296 128 284 128 C272 128 260 125 260 118 C260 125 248 128 235 128 C222 128 210 125 210 118 C210 125 198 128 185 128 C172 128 160 125 160 118 C160 125 148 128 135 128 C122 128 110 125 110 118 C110 125 98 128 85 128 C72 128 60 125 60 118 C60 125 48 128 36 128 C24 128 12 125 12 118 Z"
                        fill="#FEF08A"
                        stroke="#451A03"
                        strokeWidth="4"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* ===================================================== */}
                  {/* B. MEDALI IKON DI TENGAH AMBANG PINTU TENDA           */}
                  {/* ===================================================== */}
                  <div className="relative z-30 -mt-9 mb-1 flex justify-center">
                    <div
                      className={`w-16 h-16 rounded-2xl border-[4px] border-[#451A03] flex items-center justify-center shadow-[4px_4px_0px_#451A03] group-hover:scale-105 transition-transform ${item.accentBg}`}
                    >
                      {item.renderIcon()}
                    </div>
                  </div>

                  {/* ===================================================== */}
                  {/* C. BADAN RUANG DALAM TENDA & TIRAI PINTU TERBUKA      */}
                  {/* ===================================================== */}
                  <StickerCard
                    accent="none"
                    className={`relative z-10 flex-1 flex flex-col justify-between w-full overflow-hidden rounded-b-[26px] rounded-t-lg border-[4px] border-[#451A03] shadow-[6px_6px_0px_#451A03] px-5 pt-8 pb-5 text-center ${item.themeBg}`}
                  >
                    <ProgramBackdropIllustration id={item.id} />

                    {/* Tirai Kain Pintu Tenda Kiri & Kanan (Dengan Outline & Tali Pengikat) */}
                    <svg
                      viewBox="0 0 300 130"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute top-0 inset-x-0 w-full h-28 z-0"
                      fill="none"
                    >
                      {/* Tirai Kiri */}
                      <path
                        d="M0 0 H64 C52 44 34 78 0 115 Z"
                        fill={item.curtainColor}
                        fillOpacity="0.28"
                        stroke="#451A03"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                      {/* Simpul Tali Pengikat Tirai Kiri */}
                      <path
                        d="M0 54 Q18 58 28 52"
                        stroke="#D97706"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />

                      {/* Tirai Kanan */}
                      <path
                        d="M300 0 H236 C248 44 266 78 300 115 Z"
                        fill={item.curtainColor}
                        fillOpacity="0.28"
                        stroke="#451A03"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />
                      {/* Simpul Tali Pengikat Tirai Kanan */}
                      <path
                        d="M300 54 Q282 58 272 52"
                        stroke="#D97706"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="relative z-10 flex flex-col items-center">
                      {/* Baris Lencana Kategori Tenda */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black text-[#FFFFFF] uppercase tracking-wider border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] ${item.badgeBg}`}
                        >
                          {item.badge}
                        </span>
                        {item.isFeatured && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#FEF08A] border-[2.5px] border-[#451A03] px-2 py-0.5 text-[10px] font-black text-[#451A03] uppercase shadow-[2px_2px_0px_#451A03]">
                            <StarSvg size={10} fill="#451A03" /> Utama
                          </span>
                        )}
                      </div>

                      <h3
                        className={`font-display font-black text-lg sm:text-xl leading-tight mt-1 ${item.textColor}`}
                      >
                        {item.title}
                      </h3>
                      <span className="block text-xs font-extrabold text-[#78350F] mt-1">
                        {item.subtitle}
                      </span>

                      <p className="mt-2.5 text-xs text-[#451A03] leading-relaxed font-bold">
                        {item.description}
                      </p>
                    </div>

                    <div className="relative z-10 mt-5 pt-3.5 border-t-[3px] border-dashed border-[#451A03]/30 flex flex-col gap-3">
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#FFFFFF] border-[2px] border-[#451A03] px-2 py-0.5 text-[10px] font-black text-[#451A03] shadow-[1.5px_1.5px_0px_#451A03]"
                          >
                            <CheckSvg size={10} className="text-[#15803D]" />{" "}
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div
                        className={`inline-flex items-center justify-center gap-1.5 w-full rounded-xl border-[3px] border-[#451A03] px-4 py-2.5 text-xs font-black shadow-[3px_3px_0px_#451A03] transition-all group-hover:translate-x-0.5 ${item.buttonBg}`}
                      >
                        <span>Masuk Tenda Kemah</span>
                        <ChevronRight size={15} />
                      </div>
                    </div>
                  </StickerCard>

                  {/* ===================================================== */}
                  {/* D. ALAS KAYU & PATOK TENDA DI TANAH SAVANA            */}
                  {/* ===================================================== */}
                  <div className="pointer-events-none relative z-0 -mt-1.5 w-[88%] flex items-center justify-between px-2">
                    <div className="w-4 h-3.5 rounded-b-md bg-[#78350F] border-[3px] border-[#451A03] shadow-[2px_2px_0px_#451A03]" />
                    <div className="h-3 flex-1 mx-2 rounded-b-xl bg-[#92400E] border-x-[3px] border-b-[3px] border-[#451A03] shadow-[2px_2px_0px_#451A03]" />
                    <div className="w-4 h-3.5 rounded-b-md bg-[#78350F] border-[3px] border-[#451A03] shadow-[2px_2px_0px_#451A03]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* ============================================================
            3. PANORAMA PAGAR KAYU PERKEMAHAN & RUMPUT SAVANA DI BAWAH
           ============================================================ */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 sm:h-36 z-10 overflow-hidden">
          <svg
            viewBox="0 0 1000 140"
            preserveAspectRatio="xMidYMin slice"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Palang Kayu Horizontal Pagar Kemah */}
            <rect
              x="-20"
              y="42"
              width="1040"
              height="12"
              fill="#D97706"
              stroke="#451A03"
              strokeWidth="4"
            />
            <rect
              x="-20"
              y="68"
              width="1040"
              height="12"
              fill="#B45309"
              stroke="#451A03"
              strokeWidth="4"
            />

            {/* Barisan Patok Pagar Kayu Runcing (Dengan Outline Utuh) */}
            {[
              35, 105, 175, 245, 315, 385, 455, 525, 595, 665, 735, 805, 875,
              945,
            ].map((xPos) => (
              <g key={xPos}>
                <path
                  d={`M${xPos},18 L${xPos + 13},4 L${xPos + 26},18 V105 H${xPos} Z`}
                  fill="#78350F"
                  stroke="#451A03"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                {/* Serat Highlight Kayu */}
                <line
                  x1={xPos + 8}
                  y1="22"
                  x2={xPos + 8}
                  y2="82"
                  stroke="#92400E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ))}

            {/* Bukit Rumput Savana Belakang */}
            <path
              d="M-20,92 Q180,68 380,90 T780,82 Q910,74 1020,90 L1020,140 L-20,140 Z"
              fill="#15803D"
              stroke="#451A03"
              strokeWidth="4.5"
            />

            {/* Semak Rumput Savana Mencuat */}
            <path
              d="M140,94 L132,74 L146,84 L152,68 L158,84 L170,74 L162,94 Z"
              fill="#22C55E"
              stroke="#451A03"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M500,90 L492,70 L506,80 L512,64 L518,80 L530,70 L522,90 Z"
              fill="#4ADE80"
              stroke="#451A03"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M840,92 L832,72 L846,82 L852,66 L858,82 L870,72 L862,92 Z"
              fill="#22C55E"
              stroke="#451A03"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Hamparan Rumput Savana Depan & Tanah Perkemahan */}
            <path
              d="M-20,108 Q250,92 500,106 T1020,104 L1020,140 L-20,140 Z"
              fill="#16A34A"
              stroke="#451A03"
              strokeWidth="4.5"
            />

            {/* Batu-Batu Kecil Savana */}
            <ellipse
              cx="260"
              cy="122"
              rx="18"
              ry="8"
              fill="#F59E0B"
              stroke="#451A03"
              strokeWidth="3.5"
            />
            <ellipse
              cx="720"
              cy="120"
              rx="22"
              ry="9"
              fill="#D97706"
              stroke="#451A03"
              strokeWidth="3.5"
            />
          </svg>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
