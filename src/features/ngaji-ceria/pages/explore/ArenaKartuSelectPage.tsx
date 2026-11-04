import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import { ARENA_KARTU_DATA, ArenaKartuLevel } from "../../data/arenaKartuData";
import {
  ChevronRight,
  Sparkles,
  BookOpen,
  GameCardSvg,
  LockSvg,
} from "@/components/ui/CustomIcons";
import { triggerBibiReaction } from "@/utils/bibiEvent";

type ArenaTentPalette = {
  roofPrimary: string;
  roofSecondary: string;
  awningFill: string;
  flagFill: string;
  curtainFill: string;
};

function getArenaTentPalette(
  jilid: number,
  isLocked: boolean,
): ArenaTentPalette {
  if (isLocked) {
    return {
      roofPrimary: "#6B7280",
      roofSecondary: "#9CA3AF",
      awningFill: "#E5E7EB",
      flagFill: "#4B5563",
      curtainFill: "#4B5563",
    };
  }

  const palettes: Record<number, ArenaTentPalette> = {
    1: {
      roofPrimary: "#D97706",
      roofSecondary: "#FBBF24",
      awningFill: "#FEF08A",
      flagFill: "#EF4444",
      curtainFill: "#92400E",
    },
    2: {
      roofPrimary: "#15803D",
      roofSecondary: "#4ADE80",
      awningFill: "#FEF08A",
      flagFill: "#D97706",
      curtainFill: "#166534",
    },
    3: {
      roofPrimary: "#0284C7",
      roofSecondary: "#38BDF8",
      awningFill: "#FEF08A",
      flagFill: "#F59E0B",
      curtainFill: "#075985",
    },
    4: {
      roofPrimary: "#B45309",
      roofSecondary: "#F59E0B",
      awningFill: "#FFFBEB",
      flagFill: "#15803D",
      curtainFill: "#78350F",
    },
    5: {
      roofPrimary: "#BE123C",
      roofSecondary: "#FB7185",
      awningFill: "#FEF08A",
      flagFill: "#7C3AED",
      curtainFill: "#881337",
    },
  };

  return palettes[jilid] ?? palettes[1];
}

export default function ArenaKartuSelectPage() {
  const navigate = useNavigate();

  const handleSelectJilid = (level: ArenaKartuLevel) => {
    if (level.jilid === 6) return;
    triggerBibiReaction("play");
    navigate(`/member/ngaji-ceria/arena-kartu/${level.jilid}`);
  };

  return (
    <NgajiCeriaLayout
      title="Pilih Kemah Jilid"
      hideHeader={true}
      themeScope="arena-kartu"
      onBack={() => navigate("/member/ngaji-ceria/training")}
    >
      {/* Background Padang Rumput Savana */}
      <div className="relative min-h-[100dvh] w-full bg-[#FEF3C7] overflow-x-hidden pb-44 select-none">
        {/* Ornamen Bintik Padang Savana */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(#D97706 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ========================================================= */}
        {/* PANORAMA BUKIT SAVANA HIJAU DI BAWAH (SVG UTUH)           */}
        {/* ========================================================= */}
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-36 sm:h-44 z-0 overflow-hidden">
          <svg
            viewBox="0 0 1000 170"
            preserveAspectRatio="xMidYMin slice"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bukit Savana Belakang */}
            <path
              d="M-20,90 Q220,35 480,82 T1020,58 L1020,170 L-20,170 Z"
              fill="#15803D"
              stroke="#451A03"
              strokeWidth="4.5"
            />
            {/* Semak Rumput Mencuat */}
            <path
              d="M150,95 L140,72 L156,84 L164,66 L172,84 L186,72 L176,95 Z"
              fill="#4ADE80"
              stroke="#451A03"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M830,90 L820,68 L836,80 L844,62 L852,80 L866,68 L856,90 Z"
              fill="#4ADE80"
              stroke="#451A03"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Bukit Savana Depan */}
            <path
              d="M-20,118 Q280,82 540,114 T1020,102 L1020,170 L-20,170 Z"
              fill="#16A34A"
              stroke="#451A03"
              strokeWidth="4.5"
            />
            {/* Batu Savana */}
            <ellipse
              cx="240"
              cy="138"
              rx="22"
              ry="9"
              fill="#D97706"
              stroke="#451A03"
              strokeWidth="3.5"
            />
            <ellipse
              cx="760"
              cy="136"
              rx="24"
              ry="10"
              fill="#B45309"
              stroke="#451A03"
              strokeWidth="3.5"
            />
          </svg>
        </div>

        <div className="relative z-20">
          <ExploreHeader
            title="Kemah Savana Jilid"
            subtitle="Pilih tenda ekspedisi Jilid 1–6 di padang savana!"
            onBack={() => navigate("/member/ngaji-ceria/training")}
            themeScope="arena-kartu"
            themeColorClass="bg-[#D97706]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
          />

          {/* ========================================================= */}
          {/* BANNER POS INDUK SAVANA & KARTU MEMORI                    */}
          {/* ========================================================= */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] p-5 sm:p-6 shadow-[6px_6px_0px_#451A03]">
              {/* Dekorasi Sepasang Kartu Kemah di Sisi Kanan */}
              <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 hidden sm:flex items-center">
                <div className="w-11 h-14 rounded-xl bg-[#15803D] border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03] -rotate-12 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FEF08A] border-2 border-[#451A03]" />
                </div>
                <div className="-ml-3 w-11 h-14 rounded-xl bg-[#FEF9C3] border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03] rotate-6 flex items-center justify-center font-arabic font-black text-lg text-[#451A03]">
                  بَ
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-4 sm:max-w-[78%]">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-[#D97706] border-[3.5px] border-[#451A03] text-[#FEF3C7] shadow-[3px_3px_0px_#451A03] -rotate-3">
                  <GameCardSvg size={32} stroke="#FEF08A" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FEF08A] border-[2.5px] border-[#451A03] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#451A03] mb-1.5 shadow-[2px_2px_0px_#451A03]">
                    <Sparkles size={11} /> Ekspedisi Padang Savana
                  </span>
                  <h1 className="font-display font-black text-xl sm:text-2xl text-[#FEF3C7] leading-tight">
                    Perkemahan Kartu Tilawati
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-[#FDE68A] leading-snug mt-1">
                    Masuki tenda kemah Jilid 1 hingga 6 dan nyalakan api
                    semangat ngajimu hari ini!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* GRID 6 TENDA KEMAH JILID ARENA KARTU (ANATOMI UTUH)       */}
          {/* ========================================================= */}
          <section className="px-4 pt-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
              {ARENA_KARTU_DATA.map((level, idx) => {
                const isLocked = level.jilid === 6;
                const tent = getArenaTentPalette(level.jilid, isLocked);

                return (
                  <motion.div
                    key={level.jilid}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={isLocked ? undefined : { y: -5 }}
                    whileTap={isLocked ? undefined : { scale: 0.98, y: 2 }}
                    onClick={() => !isLocked && handleSelectJilid(level)}
                    className={`group relative flex flex-col items-center select-none ${
                      isLocked
                        ? "opacity-75 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {/* 1. BENDERA POS & ATAP KANVAS TENDA SAVANA (SVG UTUH) */}
                    <div className="relative z-20 w-full -mb-2 pointer-events-none">
                      <svg
                        viewBox="0 0 320 120"
                        className="w-full h-auto overflow-visible drop-shadow-[4px_4px_0px_#451A03]"
                        fill="none"
                      >
                        {/* Tiang Puncak Tenda */}
                        <rect
                          x="156"
                          y="4"
                          width="8"
                          height="30"
                          rx="4"
                          fill="#78350F"
                          stroke="#451A03"
                          strokeWidth="3.5"
                        />

                        {/* Bendera POS di Puncak */}
                        <path
                          d="M162 5 L226 14 L216 28 L162 28 Z"
                          fill={tent.flagFill}
                          stroke="#451A03"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                        />
                        <text
                          x="191"
                          y="20"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="900"
                          fill="#FFFFFF"
                        >
                          POS {level.jilid}
                        </text>
                        <circle
                          cx="160"
                          cy="5"
                          r="4"
                          fill="#FACC15"
                          stroke="#451A03"
                          strokeWidth="2.5"
                        />

                        {/* Tali Pancang Tenda Kiri & Kanan */}
                        <line
                          x1="156"
                          y1="30"
                          x2="10"
                          y2="102"
                          stroke="#451A03"
                          strokeWidth="3"
                          strokeDasharray="5 5"
                        />
                        <line
                          x1="164"
                          y1="30"
                          x2="310"
                          y2="102"
                          stroke="#451A03"
                          strokeWidth="3"
                          strokeDasharray="5 5"
                        />

                        {/* Kubah Segitiga Atap Tenda */}
                        <path
                          d="M160 26 L308 100 H12 L160 26 Z"
                          fill={tent.roofPrimary}
                          stroke="#451A03"
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />

                        {/* Panel Kanvas Belang Tengah */}
                        <path
                          d="M160 26 L222 100 H98 L160 26 Z"
                          fill={tent.roofSecondary}
                          stroke="#451A03"
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />

                        {/* Garis Tengah Atap */}
                        <line
                          x1="160"
                          y1="26"
                          x2="160"
                          y2="100"
                          stroke="#451A03"
                          strokeWidth="3.5"
                        />

                        {/* Renda Bibir Kanopi Tenda (Scalloped Valance) */}
                        <path
                          d="M12 98 H308 V107 C308 114 296 117 284 117 C272 117 260 114 260 107 C260 114 248 117 235 117 C222 117 210 114 210 107 C210 114 198 117 185 117 C172 117 160 114 160 107 C160 114 148 117 135 117 C122 117 110 114 110 107 C110 114 98 117 85 117 C72 117 60 114 60 107 C60 114 48 117 36 117 C24 117 12 114 12 107 Z"
                          fill={tent.awningFill}
                          stroke="#451A03"
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* 2. BADAN TENDA KEMAH */}
                    <div
                      className={`relative z-10 flex w-full flex-1 flex-col justify-between rounded-b-[24px] rounded-t-md ${level.cardBg} border-[4px] border-[#451A03] p-5 pt-6 shadow-[6px_6px_0px_#451A03] transition-all overflow-hidden`}
                    >
                      {/* Tirai Pintu Tenda Kiri & Kanan (Dengan Outline & Tali) */}
                      <svg
                        viewBox="0 0 300 110"
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute top-0 inset-x-0 w-full h-24 z-0"
                        fill="none"
                      >
                        <path
                          d="M0 0 H56 C46 38 28 68 0 98 Z"
                          fill={tent.curtainFill}
                          fillOpacity="0.2"
                          stroke="#451A03"
                          strokeWidth="3"
                        />
                        <path
                          d="M300 0 H244 C254 38 272 68 300 98 Z"
                          fill={tent.curtainFill}
                          fillOpacity="0.2"
                          stroke="#451A03"
                          strokeWidth="3"
                        />
                      </svg>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-xl ${level.badgeBg} text-[#FFFFFF] border-[2.5px] border-[#451A03] px-3 py-1 text-xs font-black shadow-[2px_2px_0px_#451A03]`}
                          >
                            <BookOpen size={13} /> Kemah Jilid {level.jilid}
                          </span>
                          <span className="rounded-lg bg-[#FEF08A] border-[2.5px] border-[#451A03] px-2.5 py-0.5 text-[10px] font-black text-[#451A03] uppercase tracking-wider shadow-[1.5px_1.5px_0px_#451A03]">
                            {level.texts.length} Tenda
                          </span>
                        </div>

                        <h2 className="font-display font-black text-xl text-[#451A03] leading-tight">
                          {level.title}
                        </h2>
                        <p className="text-xs font-extrabold text-[#15803D] leading-snug mt-0.5">
                          {level.subtitle}
                        </p>
                        <p className="text-[11px] font-bold text-[#451A03]/80 leading-relaxed mt-2 line-clamp-2">
                          {level.desc}
                        </p>
                      </div>

                      {/* Preview Materi Berbentuk Rak Kartu Mini di Atas Papan Kayu */}
                      <div className="relative z-10 my-4 py-2.5 px-3 rounded-xl bg-[#78350F] border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03] flex items-center justify-center gap-2 overflow-hidden">
                        {level.texts.slice(0, 3).map((txt, i) => (
                          <span
                            key={i}
                            className="font-arabic font-bold text-base text-[#451A03] px-2.5 py-1 rounded-lg bg-[#FFFBEB] border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] shrink-0"
                          >
                            {txt}
                          </span>
                        ))}
                        {level.texts.length > 3 && (
                          <span className="px-2 py-1 rounded-lg bg-[#FEF08A] border-[2px] border-[#451A03] text-[10px] font-black text-[#451A03] shrink-0">
                            +{level.texts.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Papan Penunjuk Masuk Tenda */}
                      <div className="relative z-10 pt-3 border-t-[3px] border-dashed border-[#451A03]/30 flex items-center justify-between">
                        <span className="text-xs font-black text-[#451A03] uppercase tracking-wider">
                          {isLocked ? "Segera Hadir" : "Masuki Kemah Ini"}
                        </span>
                        <span
                          className={`flex h-8 items-center justify-center rounded-xl border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] ${
                            isLocked
                              ? "bg-[#9CA3AF] text-[#FFFFFF] px-2.5 text-[10px] font-black gap-1"
                              : "w-8 bg-[#15803D] text-[#FEF08A] group-hover:translate-x-1 transition-transform"
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <LockSvg size={11} /> Terkunci
                            </>
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* 3. ALAS KAYU & PATOK TENDA DI BAWAH */}
                    <div className="pointer-events-none relative z-0 -mt-1.5 w-[86%] flex items-center justify-between px-2">
                      <div className="w-3.5 h-3 rounded-b-md bg-[#78350F] border-[2.5px] border-[#451A03]" />
                      <div className="h-2.5 flex-1 mx-2 rounded-b-xl bg-[#92400E] border-x-[2.5px] border-b-[2.5px] border-[#451A03]" />
                      <div className="w-3.5 h-3 rounded-b-md bg-[#78350F] border-[2.5px] border-[#451A03]" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
