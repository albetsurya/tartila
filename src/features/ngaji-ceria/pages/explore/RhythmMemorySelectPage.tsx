import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import {
  RHYTHM_MEMORY_LEVELS,
  RhythmMemoryLevel,
} from "../../data/rhythmMemoryData";
import {
  ChevronRight,
  Sparkles,
  DrumSvg,
  LockSvg,
} from "@/components/ui/CustomIcons";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { soundManager } from "../../services/soundManager";

type TentPalette = {
  roofPrimary: string;
  roofSecondary: string;
  awningFill: string;
  flagFill: string;
  flagText: string;
  curtainFill: string;
  bodyBg: string;
};

function getRhythmTentPalette(jilid: number, isLocked: boolean): TentPalette {
  if (isLocked) {
    return {
      roofPrimary: "#6B7280",
      roofSecondary: "#9CA3AF",
      awningFill: "#E5E7EB",
      flagFill: "#4B5563",
      flagText: "#F3F4F6",
      curtainFill: "#4B5563",
      bodyBg: "bg-[#F3F4F6]",
    };
  }

  const palettes: Record<number, TentPalette> = {
    1: {
      roofPrimary: "#15803D",
      roofSecondary: "#22C55E",
      awningFill: "#FEF08A",
      flagFill: "#15803D",
      flagText: "#FEF08A",
      curtainFill: "#166534",
      bodyBg: "bg-[#FFFBEB]",
    },
    2: {
      roofPrimary: "#D97706",
      roofSecondary: "#FBBF24",
      awningFill: "#FFFBEB",
      flagFill: "#B45309",
      flagText: "#FEF08A",
      curtainFill: "#92400E",
      bodyBg: "bg-[#FFFBEB]",
    },
    3: {
      roofPrimary: "#0D9488",
      roofSecondary: "#2DD4BF",
      awningFill: "#FEF08A",
      flagFill: "#0F766E",
      flagText: "#CCFBF1",
      curtainFill: "#115E59",
      bodyBg: "bg-[#F0FDFA]",
    },
    4: {
      roofPrimary: "#E11D48",
      roofSecondary: "#FB7185",
      awningFill: "#FEF08A",
      flagFill: "#BE123C",
      flagText: "#FFE4E6",
      curtainFill: "#9F1239",
      bodyBg: "bg-[#FFF1F2]",
    },
    5: {
      roofPrimary: "#7C3AED",
      roofSecondary: "#A78BFA",
      awningFill: "#FEF08A",
      flagFill: "#6D28D9",
      flagText: "#EDE9FE",
      curtainFill: "#5B21B6",
      bodyBg: "bg-[#FAF5FF]",
    },
  };

  return palettes[jilid] ?? palettes[1];
}

export default function RhythmMemorySelectPage() {
  const navigate = useNavigate();

  const handleSelectJilid = (level: RhythmMemoryLevel) => {
    if (level.jilid === 6) return;
    triggerBibiReaction("play");
    soundManager.playSfx("pop");
    navigate(`/member/ngaji-ceria/rhythm-memory/${level.jilid}`);
  };

  return (
    <NgajiCeriaLayout
      title="Pilih Kemah Rhythm Memory"
      hideHeader={true}
      themeScope="lab-irama"
      onBack={() => navigate("/member/ngaji-ceria/training")}
    >
      {/* Latar Padang Rumput Savana (#FEF3C7) */}
      <div className="relative min-h-[100dvh] w-full bg-[#FEF3C7] overflow-x-hidden pb-44 select-none">
        {/* Pola Rumput & Cahaya Savana */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(#D97706 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* ========================================================= */}
        {/* PANORAMA BUKIT & PAGAR KEMAH SAVANA DI BAWAH (SVG UTUH)   */}
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
            {/* Rumpun Rumput Mencuat */}
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
            {/* Batu & Kayu Perkemahan */}
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
          {/* Header Eksplorasi Savana */}
          <ExploreHeader
            title="Kemah Rhythm Memory"
            subtitle="Asah ingatan kartu & ketuk irama nada di tenda savana!"
            onBack={() => navigate("/member/ngaji-ceria/training")}
            themeScope="lab-irama"
            themeColorClass="bg-[#D97706]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
          />

          {/* ========================================================= */}
          {/* BANNER HERO: API UNGGUN & GENDERANG IRAMA SAVANA          */}
          {/* ========================================================= */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] p-5 sm:p-6 shadow-[6px_6px_0px_#451A03]">
              {/* Dekorasi Gelombang Irama di Sisi Kanan */}
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 opacity-90">
                <div className="w-3 h-10 rounded-full bg-[#FACC15] border-[2.5px] border-[#451A03]" />
                <div className="w-3 h-16 rounded-full bg-[#4ADE80] border-[2.5px] border-[#451A03]" />
                <div className="w-3 h-12 rounded-full bg-[#FB923C] border-[2.5px] border-[#451A03]" />
                <div className="w-3 h-20 rounded-full bg-[#FEF08A] border-[2.5px] border-[#451A03]" />
                <div className="w-3 h-11 rounded-full bg-[#4ADE80] border-[2.5px] border-[#451A03]" />
              </div>

              <div className="relative z-10 flex items-center gap-4 sm:max-w-[78%]">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-[#15803D] border-[3.5px] border-[#451A03] shadow-[3px_3px_0px_#451A03]">
                  <DrumSvg size={32} stroke="#FEF08A" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FEF08A] border-[2.5px] border-[#451A03] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#451A03] mb-1.5 shadow-[2px_2px_0px_#451A03]">
                    <Sparkles size={11} /> Irama Api Unggun Savana
                  </span>
                  <h1 className="font-display font-black text-lg sm:text-2xl text-[#FEF3C7] leading-tight">
                    Tartila Rhythm Memory
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-[#FDE68A] leading-snug mt-1">
                    Masuki tenda Jilid 1–6, dengarkan lantunan qari, dan ketuk
                    panah irama sesuai ketukan nada!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* GRID 6 TENDA KEMAH JILID RHYTHM MEMORY (ANATOMI UTUH)     */}
          {/* ========================================================= */}
          <section className="px-4 pt-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
              {RHYTHM_MEMORY_LEVELS.map((level, idx) => {
                const isLocked = level.jilid === 6;
                const tent = getRhythmTentPalette(level.jilid, isLocked);

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
                    {/* 1. BENDERA BPM & ATAP KANVAS TENDA SAVANA (SVG UTUH) */}
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

                        {/* Bendera Tempo BPM di Puncak */}
                        <path
                          d="M162 5 L238 14 L228 28 L162 28 Z"
                          fill={tent.flagFill}
                          stroke="#451A03"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                        />
                        <text
                          x="196"
                          y="20"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="900"
                          fill={tent.flagText}
                        >
                          {level.bpm} BPM
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
                      className={`relative z-10 w-full flex-1 flex flex-col justify-between overflow-hidden rounded-b-[24px] rounded-t-md ${tent.bodyBg} border-[4px] border-[#451A03] p-5 pt-6 shadow-[6px_6px_0px_#451A03]`}
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
                          fillOpacity="0.22"
                          stroke="#451A03"
                          strokeWidth="3"
                        />
                        <path
                          d="M300 0 H244 C254 38 272 68 300 98 Z"
                          fill={tent.curtainFill}
                          fillOpacity="0.22"
                          stroke="#451A03"
                          strokeWidth="3"
                        />
                      </svg>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-xl border-[2.5px] border-[#451A03] px-3 py-1 text-xs font-black uppercase text-[#FFFFFF] shadow-[2px_2px_0px_#451A03] ${level.badgeBg}`}
                          >
                            Kemah Jilid {level.jilid}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#FEF08A] border-[2.5px] border-[#451A03] px-2.5 py-0.5 text-[10px] font-black text-[#451A03] shadow-[1.5px_1.5px_0px_#451A03]">
                            🥁 {level.bpm} BPM
                          </span>
                        </div>

                        <h3 className="font-display font-black text-base sm:text-lg text-[#451A03] leading-snug mb-1">
                          {level.subtitle}
                        </h3>
                        <p className="text-xs text-[#78350F] font-bold line-clamp-2 mb-3 leading-relaxed">
                          {level.desc}
                        </p>

                        {/* Bar Indikator Gelombang Ketukan Irama */}
                        <div className="my-3 py-2 px-3 rounded-xl bg-[#FFFFFF] border-[2.5px] border-[#451A03] shadow-[2.5px_2.5px_0px_#451A03] flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#78350F]">
                            Ketukan Nada
                          </span>
                          <div className="flex items-end gap-1 h-4">
                            <span className="w-1.5 h-2 rounded-sm bg-[#15803D] border border-[#451A03]" />
                            <span className="w-1.5 h-4 rounded-sm bg-[#F59E0B] border border-[#451A03]" />
                            <span className="w-1.5 h-3 rounded-sm bg-[#15803D] border border-[#451A03]" />
                            <span className="w-1.5 h-4 rounded-sm bg-[#EF4444] border border-[#451A03]" />
                            <span className="w-1.5 h-2.5 rounded-sm bg-[#15803D] border border-[#451A03]" />
                          </div>
                        </div>
                      </div>

                      {/* Alas Pintu Tenda */}
                      <div className="relative z-10 flex items-center justify-between pt-3 border-t-[3px] border-dashed border-[#451A03]/30">
                        <span className="text-[11px] font-black text-[#15803D]">
                          12 Pos Irama
                        </span>
                        {isLocked ? (
                          <div className="inline-flex items-center gap-1 rounded-xl bg-[#9CA3AF] border-[2.5px] border-[#451A03] px-3 py-1 text-xs font-black text-[#FFFFFF] shadow-[2px_2px_0px_#451A03]">
                            <LockSvg size={12} />
                            <span>Segera Hadir</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 rounded-xl bg-[#D97706] group-hover:bg-[#B45309] border-[2.5px] border-[#451A03] px-3 py-1 text-xs font-black text-[#FEF3C7] shadow-[2px_2px_0px_#451A03] group-hover:translate-x-1 transition-all">
                            <span>Masuk Tenda</span>
                            <ChevronRight size={14} />
                          </div>
                        )}
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
