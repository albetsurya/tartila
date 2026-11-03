import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import {
  ChevronRight,
  Key,
  Sparkles,
} from "../../../../components/ui/CustomIcons";
import { TAJWID_RULES } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

type SignpostVisual = {
  bg: string;
  bevelBg: string;
  badgeBg: string;
  tagLabel: string;
  tagClass: string;
  textColor: string;
  renderIcon: () => ReactNode;
};

/**
 * Menyesuaikan warna papan kayu, label sifat bunyi, dan ikon SVG Neo-Brutalism
 * berdasarkan nama dan cara baca kaidah Tajwid.
 */
function getSignpostVisual(
  title: string,
  caraBaca: string,
  index: number,
): SignpostVisual {
  const text = `${title} ${caraBaca}`.toLowerCase();

  // 1. QALQALAH (Memantul)
  if (text.includes("qalqalah") || text.includes("pantul")) {
    return {
      bg: "bg-[#FEF3C7]",
      bevelBg: "bg-[#FDE68A]",
      badgeBg: "bg-[#EA580C]",
      tagLabel: "Bunyi Memantul",
      tagClass: "bg-[#FFEDD5] text-[#9A3412]",
      textColor: "text-[#451A03]",
      renderIcon: () => (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
          <line
            x1="6"
            y1="32"
            x2="34"
            y2="32"
            stroke="#451A03"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M8 29 Q15 10 22 29 Q28 18 33 24"
            stroke="#FEF08A"
            strokeWidth="2.5"
            strokeDasharray="2.5 2.5"
            strokeLinecap="round"
          />
          <circle
            cx="18"
            cy="15"
            r="6.5"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="2.5"
          />
        </svg>
      ),
    };
  }

  // 2. IDZHAR (Jelas & Terang)
  if (
    text.includes("idzhar") ||
    text.includes("izhar") ||
    text.includes("jelas")
  ) {
    return {
      bg: "bg-[#FEF9C3]",
      bevelBg: "bg-[#FEF08A]",
      badgeBg: "bg-[#D97706]",
      tagLabel: "Dibaca Jelas",
      tagClass: "bg-[#FEF08A] text-[#78350F]",
      textColor: "text-[#451A03]",
      renderIcon: () => (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
          <circle
            cx="20"
            cy="20"
            r="8"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <path
            d="M20 5 V9 M20 31 V35 M5 20 H9 M31 20 H35 M9.5 9.5 L12.5 12.5 M27.5 27.5 L30.5 30.5 M30.5 9.5 L27.5 12.5 M12.5 27.5 L9.5 30.5"
            stroke="#FEF08A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
  }

  // 3. IDGHAM (Melebur / Masuk)
  if (
    text.includes("idgham") ||
    text.includes("idgam") ||
    text.includes("melebur") ||
    text.includes("masuk")
  ) {
    return {
      bg: "bg-[#DCFCE7]",
      bevelBg: "bg-[#BBF7D0]",
      badgeBg: "bg-[#15803D]",
      tagLabel: "Bunyi Melebur",
      tagClass: "bg-[#BBF7D0] text-[#14532D]",
      textColor: "text-[#14532D]",
      renderIcon: () => (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
          <circle
            cx="16"
            cy="20"
            r="8.5"
            fill="#4ADE80"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="20"
            r="8.5"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <path
            d="M20 13 C22.5 16.5 22.5 23.5 20 27 C17.5 23.5 17.5 16.5 20 13 Z"
            fill="#FFFFFF"
            stroke="#451A03"
            strokeWidth="2"
          />
        </svg>
      ),
    };
  }

  // 4. IKHFA (Samar & Dengung)
  if (text.includes("ikhfa") || text.includes("samar")) {
    return {
      bg: "bg-[#ECFDF5]",
      bevelBg: "bg-[#D1FAE5]",
      badgeBg: "bg-[#0D9488]",
      tagLabel: "Samar & Dengung",
      tagClass: "bg-[#CCFBF1] text-[#115E59]",
      textColor: "text-[#134E4A]",
      renderIcon: () => (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
          <path
            d="M10 29 C10 15 24 10 31 12 C29 21 24 31 10 29 Z"
            fill="#5EEAD4"
            stroke="#451A03"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M10 29 L24 17"
            stroke="#451A03"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
  }

  // 5. IQLAB (Membalik / Menukar Bunyi menjadi Mim)
  if (
    text.includes("iqlab") ||
    text.includes("membalik") ||
    text.includes("menukar")
  ) {
    return {
      bg: "bg-[#FFEDD5]",
      bevelBg: "bg-[#FED7AA]",
      badgeBg: "bg-[#B45309]",
      tagLabel: "Tukar Bunyi Mim",
      tagClass: "bg-[#FDE68A] text-[#78350F]",
      textColor: "text-[#451A03]",
      renderIcon: () => (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
          <path
            d="M11 18 C11 11 29 11 29 18"
            stroke="#FEF08A"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <polygon points="29,14 34,19 26,20" fill="#FACC15" />
          <path
            d="M29 23 C29 30 11 30 11 23"
            stroke="#4ADE80"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <polygon points="11,27 6,22 14,21" fill="#4ADE80" />
        </svg>
      ),
    };
  }

  // 6. GHUNNAH (Dengung Lebah)
  if (
    text.includes("ghunnah") ||
    text.includes("gunnah") ||
    text.includes("dengung")
  ) {
    return {
      bg: "bg-[#FDE68A]",
      bevelBg: "bg-[#FACC15]",
      badgeBg: "bg-[#15803D]",
      tagLabel: "Dengung 2 Harakat",
      tagClass: "bg-[#FFFBEB] text-[#451A03]",
      textColor: "text-[#451A03]",
      renderIcon: () => (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
          <ellipse
            cx="20"
            cy="22"
            rx="9.5"
            ry="7"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <line
            x1="17"
            y1="15"
            x2="17"
            y2="29"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <line
            x1="23"
            y1="15"
            x2="23"
            y2="29"
            stroke="#451A03"
            strokeWidth="2.5"
          />
          <ellipse
            cx="20"
            cy="13"
            rx="5"
            ry="3.5"
            fill="#FFFFFF"
            stroke="#451A03"
            strokeWidth="2"
          />
        </svg>
      ),
    };
  }

  // 7. MAD (Ayunan Bacaan Panjang)
  if (text.includes("mad") || text.includes("panjang")) {
    return {
      bg: "bg-[#FFFBEB]",
      bevelBg: "bg-[#FEF3C7]",
      badgeBg: "bg-[#166534]",
      tagLabel: "Bacaan Panjang",
      tagClass: "bg-[#DCFCE7] text-[#14532D]",
      textColor: "text-[#451A03]",
      renderIcon: () => (
        <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
          <path
            d="M6 22 C11 12 16 12 20 20 C24 28 29 28 34 18"
            stroke="#FACC15"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      ),
    };
  }

  // DEFAULT PALETTE (Bergantian hangat & rimbun)
  const fallbackPalettes = [
    {
      bg: "bg-[#FEF3C7]",
      bevelBg: "bg-[#FDE68A]",
      badgeBg: "bg-[#D97706]",
      tagClass: "bg-[#FDE68A] text-[#78350F]",
      textColor: "text-[#451A03]",
    },
    {
      bg: "bg-[#FDE68A]",
      bevelBg: "bg-[#FACC15]",
      badgeBg: "bg-[#15803D]",
      tagClass: "bg-[#DCFCE7] text-[#14532D]",
      textColor: "text-[#451A03]",
    },
    {
      bg: "bg-[#FFFBEB]",
      bevelBg: "bg-[#FEF3C7]",
      badgeBg: "bg-[#B45309]",
      tagClass: "bg-[#FFEDD5] text-[#9A3412]",
      textColor: "text-[#451A03]",
    },
    {
      bg: "bg-[#DCFCE7]",
      bevelBg: "bg-[#BBF7D0]",
      badgeBg: "bg-[#166534]",
      tagClass: "bg-[#FEF08A] text-[#451A03]",
      textColor: "text-[#14532D]",
    },
  ];
  const p = fallbackPalettes[index % fallbackPalettes.length];

  return {
    ...p,
    tagLabel: "Kaidah Tajwid",
    renderIcon: () => <Key size={18} className="text-[#FEF08A]" />,
  };
}

export default function TajwidSecretPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/member/ngaji-ceria/map");
  };

  const handleNavigate = (id: string) => {
    triggerBibiReaction("click");
    navigate(`/member/ngaji-ceria/explore/tajwid/${id}`);
  };

  return (
    <NgajiCeriaLayout
      title="Hutan Rahasia Tajwid"
      hideHeader={true}
      themeScope="tajwid"
      onBack={handleBack}
    >
      {/* Background Hijau Hutan Gelap (#166534) */}
      <div className="min-h-[100dvh] w-full bg-[#166534] relative overflow-x-hidden pb-40 select-none">
        {/* Ornamen Rimbun Daun & Kunang-Kunang Hutan */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(#4ADE80 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ========================================================= */}
        {/* PANORAMA SEMAK BELUKAR, PAKIS & JAMUR RIMBA DI BAWAH      */}
        {/* ========================================================= */}
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-36 sm:h-44 z-0 overflow-hidden">
          <svg
            viewBox="0 0 1000 170"
            preserveAspectRatio="xMidYMin slice"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Semak Gelap Belakang */}
            <path
              d="M-20,90 C110,45 220,95 340,60 C460,25 580,85 700,50 C820,20 920,80 1020,55 L1020,170 L-20,170 Z"
              fill="#14532D"
              stroke="#052E16"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />

            {/* Daun Pakis Rimba Kiri & Kanan */}
            <path
              d="M125,105 L112,72 L130,88 L138,64 L146,88 L162,74 L150,105 Z"
              fill="#22C55E"
              stroke="#052E16"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M855,102 L842,70 L860,86 L868,62 L876,86 L892,72 L880,102 Z"
              fill="#22C55E"
              stroke="#052E16"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Semak Hutan Depan */}
            <path
              d="M-20,122 C160,92 340,136 500,112 C660,136 840,92 1020,122 L1020,170 L-20,170 Z"
              fill="#15803D"
              stroke="#052E16"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />

            {/* Jamur Hutan Bercahaya */}
            <g transform="translate(220, 118) rotate(-8)">
              <rect
                x="-4"
                y="0"
                width="8"
                height="13"
                rx="3"
                fill="#FEF3C7"
                stroke="#451A03"
                strokeWidth="3"
              />
              <path
                d="M-14,2 C-14,-13 14,-13 14,2 Z"
                fill="#FACC15"
                stroke="#451A03"
                strokeWidth="3.5"
              />
              <circle cx="-4" cy="-4" r="2" fill="#78350F" />
              <circle cx="4" cy="-3" r="2" fill="#78350F" />
            </g>

            <g transform="translate(780, 118) rotate(8)">
              <rect
                x="-4"
                y="0"
                width="8"
                height="13"
                rx="3"
                fill="#FEF3C7"
                stroke="#451A03"
                strokeWidth="3"
              />
              <path
                d="M-14,2 C-14,-13 14,-13 14,2 Z"
                fill="#F59E0B"
                stroke="#451A03"
                strokeWidth="3.5"
              />
              <circle cx="-4" cy="-4" r="2" fill="#FEF08A" />
              <circle cx="4" cy="-3" r="2" fill="#FEF08A" />
            </g>
          </svg>
        </div>

        <div className="relative z-10">
          {/* HEADER: Balok Kayu Rimba */}
          <ExploreHeader
            title="Hutan Rimba Tajwid"
            subtitle="Papan Penunjuk Arah Kaidah di Pohon Raksasa"
            onBack={handleBack}
            themeScope="tajwid"
            themeColorClass="bg-[#78350F]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF08A] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
          />

          {/* ========================================================= */}
          {/* HERO: PAPAN TULIS KAYU GANTUNG DI DAHAN POHON UTAMA       */}
          {/* ========================================================= */}
          <div className="px-4 pt-4 max-w-3xl mx-auto">
            {/* Tali Tambang Penggantung Papan Hero */}
            <div className="flex justify-between px-12 sm:px-20 -mb-1.5 relative z-0">
              <div className="w-3.5 h-5 bg-[#D97706] border-x-[3px] border-[#451A03]" />
              <div className="w-3.5 h-5 bg-[#D97706] border-x-[3px] border-[#451A03]" />
            </div>

            <section className="relative rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] shadow-[6px_6px_0px_#451A03] p-5 sm:p-6 overflow-hidden">
              {/* Baut Pengikat Tali di Atas Papan */}
              <span className="pointer-events-none absolute top-2.5 left-12 sm:left-20 w-3.5 h-3.5 rounded-full bg-[#94A3B8] border-[2.5px] border-[#451A03]" />
              <span className="pointer-events-none absolute top-2.5 right-12 sm:right-20 w-3.5 h-3.5 rounded-full bg-[#94A3B8] border-[2.5px] border-[#451A03]" />

              {/* Hiasan Daun Rimba di Sudut Atas & Bawah */}
              <div className="pointer-events-none absolute -top-2 -left-2 w-12 h-12 rounded-br-3xl bg-[#22C55E] border-r-[3px] border-b-[3px] border-[#451A03]" />
              <div className="pointer-events-none absolute -bottom-2 -right-2 w-12 h-12 rounded-tl-3xl bg-[#22C55E] border-l-[3px] border-t-[3px] border-[#451A03]" />

              {/* Ilustrasi Kompas Hutan di Sisi Kanan */}
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center">
                <div className="bg-[#FEF3C7] p-2.5 rounded-2xl border-[3.5px] border-[#451A03] shadow-[4px_4px_0px_#451A03]">
                  <svg width="54" height="54" viewBox="0 0 64 64" fill="none">
                    <path
                      d="M10 22 C8 10 22 8 28 16 Z"
                      fill="#22C55E"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M54 44 C56 54 42 56 36 48 Z"
                      fill="#16A34A"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="32"
                      cy="34"
                      r="20"
                      fill="#FACC15"
                      stroke="#451A03"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="32"
                      cy="34"
                      r="14"
                      fill="#FFFBEB"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="32"
                      cy="10"
                      r="4"
                      stroke="#451A03"
                      strokeWidth="3"
                    />
                    <polygon
                      points="32,21 37,34 32,31 27,34"
                      fill="#EF4444"
                      stroke="#451A03"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <polygon
                      points="32,47 37,34 32,37 27,34"
                      fill="#94A3B8"
                      stroke="#451A03"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <circle cx="32" cy="34" r="2.5" fill="#451A03" />
                  </svg>
                </div>
              </div>

              <div className="relative z-10 sm:max-w-[74%] pl-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FEF08A] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#451A03] border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] mb-2.5">
                  <Sparkles size={12} /> Kompas Hutan Tajwid
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-black leading-tight text-[#FEF3C7]">
                  Ikuti Papan Penunjuk Arah di Batang Pohon!
                </h2>
                <p className="mt-1.5 text-xs font-bold text-[#FDE68A] leading-relaxed">
                  Setiap papan kayu yang dipaku pada pohon rimba ini menunjuk ke
                  rahasia dengung, pantulan, dan panjang bacaan Al-Qur'an.
                </p>
              </div>
            </section>
          </div>

          {/* ========================================================= */}
          {/* POHON RAKSASA DENGAN PAPAN PENUNJUK ARAH (SIGNPOSTS)      */}
          {/* ========================================================= */}
          <div className="px-4 pt-8 max-w-3xl mx-auto">
            <div className="relative pb-10">
              {/* 1. MAHKOTA DAUN RIMBUN POHON RAKSASA DI PUNCAK BATANG */}
              <div className="relative z-20 mx-auto max-w-md -mb-5 flex flex-col items-center">
                <svg
                  viewBox="0 0 420 120"
                  className="w-full h-auto overflow-visible drop-shadow-[4px_5px_0px_#451A03]"
                  fill="none"
                >
                  {/* Sulur Liana Menggantung dari Mahkota Pohon */}
                  <path
                    d="M78 92 Q70 112 82 126"
                    stroke="#4ADE80"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M342 92 Q350 112 338 126"
                    stroke="#4ADE80"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Rumpun Daun Gelap Belakang */}
                  <path
                    d="M45 94 C15 94 10 54 42 44 C52 16 98 12 122 30 C152 6 268 6 298 30 C322 12 368 16 378 44 C410 54 405 94 375 94 Z"
                    fill="#15803D"
                    stroke="#451A03"
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                  />

                  {/* Rumpun Daun Cerah Depan */}
                  <path
                    d="M62 100 C32 100 28 64 58 54 C70 26 112 22 136 38 C168 14 252 14 284 38 C308 22 350 26 362 54 C392 64 388 100 358 100 Z"
                    fill="#22C55E"
                    stroke="#451A03"
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                  />

                  {/* Highlight Pucuk Daun Atas */}
                  <path
                    d="M155 30 Q210 16 265 30 M85 50 Q110 40 130 48 M290 48 Q310 40 335 50"
                    stroke="#86EFAC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Plakat Kayu Pohon Kaidah di Tengah Mahkota */}
                  <rect
                    x="90"
                    y="46"
                    width="240"
                    height="42"
                    rx="14"
                    fill="#FEF08A"
                    stroke="#451A03"
                    strokeWidth="4"
                  />
                  <circle cx="106" cy="67" r="3.5" fill="#451A03" />
                  <circle cx="314" cy="67" r="3.5" fill="#451A03" />
                </svg>

                <span className="pointer-events-none absolute top-[45%] font-display font-black text-xs sm:text-sm uppercase tracking-wider text-[#451A03]">
                  🌳 Pohon Kaidah ({TAJWID_RULES.length} Misi)
                </span>
              </div>

              {/* 2. BATANG POHON KAYU RAKSASA VERTIKAL DI TENGAH */}
              <div className="pointer-events-none absolute top-16 bottom-10 left-1/2 -translate-x-1/2 w-14 sm:w-20 bg-[#78350F] border-x-[4px] border-[#451A03] z-0 overflow-hidden flex justify-around">
                <div className="w-1.5 h-full bg-[#92400E] opacity-75" />
                <div className="w-2 h-full bg-[#451A03]/25" />
                <div className="w-1.5 h-full bg-[#B45309] opacity-60" />
              </div>

              {/* 3. DERETAN PAPAN PENUNJUK ARAH (SIGNPOSTS) YANG DIPAKU KE POHON */}
              <div className="relative z-10 space-y-6 pt-6">
                {TAJWID_RULES.map((rule, index) => {
                  const visual = getSignpostVisual(
                    rule.title,
                    rule.caraBaca,
                    index,
                  );
                  const pointRight = index % 2 === 0;
                  const tiltClass = pointRight
                    ? "rotate-[0.8deg]"
                    : "-rotate-[0.8deg]";

                  const signClipPath = pointRight
                    ? "polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%)"
                    : "polygon(8% 0%, 100% 0%, 100% 100%, 8% 100%, 0% 50%)";

                  return (
                    <div
                      key={rule.id}
                      className="relative flex items-center justify-center"
                    >
                      {/* Tunas Daun Kecil yang Tumbuh dari Batang Pohon */}
                      <div
                        className={`pointer-events-none absolute -top-3 z-20 ${
                          pointRight
                            ? "left-[calc(50%+14px)]"
                            : "right-[calc(50%+14px)] scale-x-[-1]"
                        }`}
                      >
                        <svg
                          width="28"
                          height="22"
                          viewBox="0 0 28 22"
                          fill="none"
                        >
                          <path
                            d="M2 18 C6 6 20 2 24 10 C18 18 8 20 2 18 Z"
                            fill="#4ADE80"
                            stroke="#451A03"
                            strokeWidth="3"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Bungkus Luar Drop-Shadow & Animasi Signpost */}
                      <motion.div
                        whileHover={{ scale: 1.02, rotate: 0 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative w-full max-w-2xl ${tiltClass}`}
                        style={{
                          filter: "drop-shadow(0px 5px 0px #451A03)",
                        }}
                      >
                        {/* Pelat Paku Besi di Tengah Papan (Menyatu Saat Hover/Tap) */}
                        <div
                          className="pointer-events-none absolute top-1.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5"
                          aria-hidden="true"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#94A3B8] border-[2.5px] border-[#451A03] shadow-[1px_1px_0px_#451A03]" />
                          <span className="w-3.5 h-3.5 rounded-full bg-[#CBD5E1] border-[2.5px] border-[#451A03] shadow-[1px_1px_0px_#451A03]" />
                        </div>

                        {/* Border Cokelat Tua Signpost (Clip-Path Panah Kayu) */}
                        <div
                          className="p-[4px] bg-[#451A03]"
                          style={{ clipPath: signClipPath }}
                        >
                          <button
                            type="button"
                            onClick={() => handleNavigate(rule.id)}
                            className={`group relative w-full text-left ${visual.bg} py-4 ${
                              pointRight
                                ? "pl-4 pr-10 sm:pl-5 sm:pr-14"
                                : "pl-10 pr-4 sm:pl-14 sm:pr-5"
                            } transition-colors cursor-pointer overflow-hidden`}
                            style={{ clipPath: signClipPath }}
                          >
                            {/* Highlight Serat Kayu Atas & Bevel Bawah Papan */}
                            <div className="pointer-events-none absolute top-1.5 inset-x-8 h-1 rounded-full bg-white/70" />
                            <div
                              className={`pointer-events-none absolute bottom-0 inset-x-0 h-2.5 ${visual.bevelBg} opacity-80`}
                            />

                            <div className="relative z-10 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {/* Lencana Ikon Kaidah + Nomor */}
                                <div
                                  className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${visual.badgeBg} border-[3px] border-[#451A03] flex flex-col items-center justify-center text-[#FEF08A] shadow-[2.5px_2.5px_0px_#451A03] group-hover:scale-105 transition-transform`}
                                >
                                  {visual.renderIcon()}
                                  <span className="text-[9px] font-black leading-none mt-0.5 text-[#FEF08A]">
                                    #{index + 1}
                                  </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="inline-block rounded bg-[#451A03] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#FEF08A]">
                                      Arah Misi{" "}
                                      {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span
                                      className={`inline-block rounded border-[2px] border-[#451A03] px-2 py-0.5 text-[9px] font-black uppercase ${visual.tagClass}`}
                                    >
                                      {visual.tagLabel}
                                    </span>
                                  </div>

                                  <p
                                    className={`font-display font-black text-base sm:text-lg leading-tight mt-1 ${visual.textColor}`}
                                  >
                                    {rule.title}
                                  </p>
                                  <p className="text-xs font-bold text-[#78350F] leading-snug mt-0.5 line-clamp-1">
                                    {rule.caraBaca}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-1 rounded-xl border-[2.5px] border-[#451A03] bg-[#15803D] group-hover:bg-[#166534] text-[#FFFFFF] px-3 py-2 text-[10px] font-black uppercase shadow-[2px_2px_0px_#451A03] transition-transform group-hover:translate-x-0.5">
                                <span className="hidden sm:inline">
                                  Telusuri
                                </span>
                                <ChevronRight size={14} />
                              </div>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* 4. AKAR POHON RAKSASA DI DASAR BATANG */}
              <div className="pointer-events-none relative z-0 mx-auto -mt-2 w-56 sm:w-72 flex justify-center">
                <svg
                  viewBox="0 0 260 54"
                  className="w-full h-auto overflow-visible"
                  fill="none"
                >
                  <path
                    d="M92 0 C88 22 52 36 18 44 H242 C208 36 172 22 168 0 Z"
                    fill="#78350F"
                    stroke="#451A03"
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M112 12 C106 28 88 38 66 44 M148 12 C154 28 172 38 194 44"
                    stroke="#451A03"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="130"
                    cy="44"
                    rx="118"
                    ry="7"
                    fill="#15803D"
                    stroke="#451A03"
                    strokeWidth="3.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
