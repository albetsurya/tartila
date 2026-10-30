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

/** 1. Ikon Utama untuk Tartila Rhythm Memory (Kartu + Drum Ketukan Savana) */
const RhythmMemoryIconSvg = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-11 h-11 overflow-visible">
    <rect
      x="8"
      y="8"
      width="24"
      height="32"
      rx="5"
      fill="#FEF08A"
      stroke="#451A03"
      strokeWidth="3"
    />
    <rect
      x="18"
      y="12"
      width="24"
      height="32"
      rx="5"
      fill="#4ADE80"
      stroke="#451A03"
      strokeWidth="3"
    />
    <circle
      cx="30"
      cy="28"
      r="6"
      fill="#FFFFFF"
      stroke="#451A03"
      strokeWidth="2.5"
    />
    <path
      d="M34 28V18L41 20V25L34 23"
      fill="#D97706"
      stroke="#451A03"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

/** 2. Ikon Utama untuk Lab Irama Tilawati (Metronom Kayu & Nada Rost) */
const LabIramaIconSvg = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-11 h-11 overflow-visible">
    <path
      d="M19 10H37L44 46H12L19 10Z"
      fill="#D97706"
      stroke="#451A03"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M23 16H33L37 40H19L23 16Z"
      fill="#FEF3C7"
      stroke="#451A03"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <line
      x1="28"
      y1="40"
      x2="39"
      y2="15"
      stroke="#451A03"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <circle
      cx="35"
      cy="23"
      r="4.5"
      fill="#FACC15"
      stroke="#451A03"
      strokeWidth="2.5"
    />
    <rect
      x="10"
      y="43"
      width="36"
      height="6"
      rx="3"
      fill="#78350F"
      stroke="#451A03"
      strokeWidth="2.5"
    />
  </svg>
);

/** 3. Ikon Utama untuk Arena Kartu Klasik (Sepasang Kartu Kemah) */
const ArenaKartuIconSvg = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-11 h-11 overflow-visible">
    <rect
      x="7"
      y="12"
      width="24"
      height="33"
      rx="5"
      fill="#15803D"
      stroke="#451A03"
      strokeWidth="3"
    />
    <circle cx="19" cy="28" r="4" fill="#FEF08A" />
    <rect
      x="24"
      y="9"
      width="25"
      height="34"
      rx="5"
      fill="#FEF9C3"
      stroke="#451A03"
      strokeWidth="3"
    />
    <path
      d="M31 25V28C31 30.5 42 30.5 42 28V25"
      stroke="#78350F"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="36.5" cy="34.5" r="2.2" fill="#DC2626" />
  </svg>
);

/** Ilustrasi Latar Belakang Spesifik tiap Tenda Kemah */
const ProgramBackdropIllustration = ({ id }: { id: string }) => {
  switch (id) {
    case "rhythm-memory":
      return (
        <svg
          viewBox="0 0 180 140"
          fill="none"
          className="pointer-events-none absolute -right-2 -bottom-2 h-36 w-44 opacity-25 select-none"
        >
          <rect x="65" y="75" width="10" height="45" rx="5" fill="#15803D" />
          <rect x="83" y="45" width="10" height="75" rx="5" fill="#16A34A" />
          <rect x="101" y="60" width="10" height="60" rx="5" fill="#15803D" />
          <rect x="119" y="30" width="10" height="90" rx="5" fill="#14532D" />
          <rect x="137" y="52" width="10" height="68" rx="5" fill="#16A34A" />
          <circle cx="119" cy="18" r="6" fill="#D97706" />
        </svg>
      );

    case "lab-irama":
      return (
        <svg
          viewBox="0 0 180 140"
          fill="none"
          className="pointer-events-none absolute -right-2 -bottom-2 h-36 w-44 opacity-25 select-none"
        >
          <path
            d="M 15 90 L 65 90 C 85 90, 90 40, 115 40 C 140 40, 145 105, 170 105"
            stroke="#78350F"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="40" cy="90" r="8" fill="#D97706" />
          <circle
            cx="115"
            cy="40"
            r="9"
            fill="#FACC15"
            stroke="#451A03"
            strokeWidth="3"
          />
          <circle cx="165" cy="105" r="8" fill="#D97706" />
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
            x="60"
            y="25"
            width="46"
            height="62"
            rx="8"
            fill="#F59E0B"
            stroke="#451A03"
            strokeWidth="4"
          />
          <rect
            x="116"
            y="25"
            width="46"
            height="62"
            rx="8"
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
  roofBg: string;
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
    roofBg: "bg-[#15803D]",
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
    roofBg: "bg-[#D97706]",
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
    roofBg: "bg-[#B45309]",
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
      {/* Latar Padang Rumput Savana (#FEF3C7) */}
      <div className="relative min-h-[100dvh] w-full bg-[#FEF3C7] overflow-x-hidden pb-48 select-none">
        {/* Bintik Hangat Matahari Savana */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage: "radial-gradient(#D97706 2px, transparent 2px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-20">
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

          {/* ============================================================
              1. HERO BANNER: POS API UNGGUN UTAMA PADANG SAVANA
             ============================================================ */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] p-5 sm:p-7 shadow-[6px_6px_0px_#451A03] text-[#FEF3C7]">
              {/* Ilustrasi Kanan: Api Unggun Savana Menyala */}
              <div className="pointer-events-none absolute right-4 top-4 bottom-4 hidden sm:flex w-[30%] items-center justify-center">
                <motion.svg
                  viewBox="0 0 120 120"
                  fill="none"
                  className="h-full max-h-[120px] w-auto overflow-visible"
                  animate={{ scale: [1, 1.04, 1], y: [0, -3, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Lingkaran Batu Api Unggun */}
                  <ellipse cx="60" cy="98" rx="42" ry="10" fill="#451A03" />
                  {/* Kayu Bakar Menyilang */}
                  <path
                    d="M24 96L96 78M24 78L96 96"
                    stroke="#D97706"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Lidah Api Unggun Luar */}
                  <path
                    d="M60 14C60 14 28 42 28 68C28 85 42 94 60 94C78 94 92 85 92 68C92 52 80 38 72 28C72 42 64 46 64 46C64 28 60 14 60 14Z"
                    fill="#EF4444"
                    stroke="#451A03"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                  {/* Lidah Api Unggun Dalam */}
                  <path
                    d="M60 44C60 44 42 58 42 74C42 84 50 90 60 90C70 90 78 84 78 74C78 60 60 44 60 44Z"
                    fill="#FACC15"
                    stroke="#451A03"
                    strokeWidth="3"
                  />
                </motion.svg>
              </div>

              {/* Konten Teks Hero */}
              <div className="relative z-10 sm:max-w-[68%]">
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
              2. DAFTAR 3 TENDA KEMAH SAVANA (SEGITIGA CLIP-PATH)
             ============================================================ */}
          <section className="px-4 pt-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10 px-2">
              <div className="inline-block bg-[#15803D] border-[3px] border-[#451A03] px-4 py-1.5 rounded-xl shadow-[3px_3px_0px_#451A03]">
                <h2 className="font-display font-black text-sm sm:text-base uppercase tracking-wider text-[#FEF08A]">
                  Pilih Tenda Kemah ({TRAINING_PROGRAMS.length})
                </h2>
              </div>
              <span className="rounded-xl bg-[#FFFBEB] border-[3px] border-[#451A03] px-3 py-1 text-[11px] font-black text-[#451A03] shadow-[2px_2px_0px_#451A03]">
                ⛺ Terbuka Bebas!
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8 pt-6">
              {TRAINING_PROGRAMS.map((item) => (
                <div key={item.id} className="relative flex flex-col pt-16">
                  {/* Bendera Kompas di Puncak Tenda Kemah */}
                  <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                    <div
                      className="h-5 w-9 bg-[#EF4444] border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03]"
                      style={{
                        clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                      }}
                    />
                    <div className="h-4 w-1 bg-[#451A03]" />
                  </div>

                  {/* ATAP TENDA KEMAH SEGITIGA SAVANA (CLIP-PATH) */}
                  <div
                    className="pointer-events-none absolute top-4 left-0 right-0 h-20 bg-[#451A03] z-20"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    }}
                  >
                    <div
                      className={`w-full h-full ${item.roofBg}`}
                      style={{
                        clipPath: "polygon(50% 10%, 96% 100%, 4% 100%)",
                      }}
                    />
                  </div>

                  {/* IKON GAME DI TENGAH PINTU TENDA */}
                  <div className="relative z-30 -mt-6 mb-2 flex justify-center">
                    <div
                      className={`w-16 h-16 rounded-2xl border-[4px] border-[#451A03] flex items-center justify-center shadow-[4px_4px_0px_#451A03] ${item.accentBg}`}
                    >
                      {item.renderIcon()}
                    </div>
                  </div>

                  {/* BADAN TENDA KEMAH SAVANA */}
                  <StickerCard
                    accent="none"
                    hoverable
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigate(item.to)}
                    className={`group relative flex-1 flex flex-col justify-between w-full overflow-hidden rounded-b-2xl rounded-t-sm border-[4px] border-[#451A03] shadow-[6px_6px_0px_#451A03] p-5 pt-7 text-center cursor-pointer ${item.themeBg}`}
                  >
                    <ProgramBackdropIllustration id={item.id} />

                    {/* Lipatan Kain Tirai Pintu Tenda di Kiri & Kanan */}
                    <div
                      className="pointer-events-none absolute left-0 top-0 w-10 h-24 bg-[#78350F]/20"
                      style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                    />
                    <div
                      className="pointer-events-none absolute right-0 top-0 w-10 h-24 bg-[#78350F]/20"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                      {/* Baris Badge */}
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
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ============================================================
            3. HIASAN PAGAR KAYU PERKEMAHAN & RUMPUT SAVANA DI BAWAH
           ============================================================ */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 overflow-hidden pt-8">
          <div className="relative flex w-full items-end justify-around px-2">
            <div className="absolute bottom-4 left-0 right-0 h-3 bg-[#D97706] border-y-[3px] border-[#451A03] z-0" />
            {Array.from({ length: 16 }).map((_, idx) => (
              <div
                key={idx}
                className="relative z-10 h-14 w-6 shrink-0 bg-[#78350F] border-[3px] border-[#451A03]"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 100%, 0% 100%, 0% 25%)",
                }}
              />
            ))}
          </div>

          <div className="relative -mt-3 h-10 w-full bg-[#15803D] border-t-[4px] border-[#451A03] flex items-start justify-around">
            {Array.from({ length: 12 }).map((_, gIdx) => (
              <div
                key={gIdx}
                className="-mt-3 h-4 w-8 bg-[#16A34A] border-t-[3px] border-x-[3px] border-[#451A03] rounded-t-full"
              />
            ))}
          </div>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
