import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import { ChevronRight, Sparkles, MusicSvg, DrumSvg, GameCardSvg, StarSvg, CheckSvg } from "@/components/ui/CustomIcons";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { soundManager } from "../../services/soundManager";

/* ============================================================================
   CUSTOM NEO-BRUTALIST TRAINING ILLUSTRATIONS & ICONS
   ============================================================================ */

/** 1. Ikon Utama untuk Tartila Rhythm Memory (Kartu + Drum Ketukan) */
const RhythmMemoryIconSvg = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-11 h-11 overflow-visible">
    {/* Kartu Belakang */}
    <rect
      x="8"
      y="8"
      width="24"
      height="32"
      rx="5"
      fill="#FEF08A"
      stroke="#064E3B"
      strokeWidth="3"
    />
    {/* Kartu Depan */}
    <rect
      x="18"
      y="12"
      width="24"
      height="32"
      rx="5"
      fill="#34D399"
      stroke="#064E3B"
      strokeWidth="3"
    />
    {/* Simbol Ketukan Nada di Tengah Kartu */}
    <circle
      cx="30"
      cy="28"
      r="6"
      fill="#FFFFFF"
      stroke="#064E3B"
      strokeWidth="2.5"
    />
    <path
      d="M34 28V18L41 20V25L34 23"
      fill="#F59E0B"
      stroke="#064E3B"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    {/* Gelombang Ketukan */}
    <path
      d="M46 22C48.5 25 48.5 31 46 34"
      stroke="#059669"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/** 2. Ikon Utama untuk Lab Irama Tilawati (Metronom & Tangga Nada Rost) */
const LabIramaIconSvg = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-11 h-11 overflow-visible">
    {/* Badan Metronom */}
    <path
      d="M19 10H37L44 46H12L19 10Z"
      fill="#C084FC"
      stroke="#3B0764"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M23 16H33L37 40H19L23 16Z"
      fill="#FAF5FF"
      stroke="#3B0764"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Jarum Pendulum Metronom */}
    <line
      x1="28"
      y1="40"
      x2="39"
      y2="15"
      stroke="#3B0764"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <circle
      cx="35"
      cy="23"
      r="4.5"
      fill="#FACC15"
      stroke="#3B0764"
      strokeWidth="2.5"
    />
    {/* Alas Metronom */}
    <rect
      x="10"
      y="43"
      width="36"
      height="6"
      rx="3"
      fill="#F472B6"
      stroke="#3B0764"
      strokeWidth="2.5"
    />
  </svg>
);

/** 3. Ikon Utama untuk Arena Kartu Klasik (Sepasang Kartu Hijaiyah) */
const ArenaKartuIconSvg = () => (
  <svg viewBox="0 0 56 56" fill="none" className="w-11 h-11 overflow-visible">
    {/* Kartu Kiri */}
    <rect
      x="7"
      y="12"
      width="24"
      height="33"
      rx="5"
      fill="#0D9488"
      stroke="#451A03"
      strokeWidth="3"
    />
    <circle cx="19" cy="28" r="4" fill="#FEF08A" />
    {/* Kartu Kanan Terbuka */}
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
    {/* Huruf Ba di atas Kartu */}
    <path
      d="M31 25V28C31 30.5 42 30.5 42 28V25"
      stroke="#78350F"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="36.5" cy="34.5" r="2.2" fill="#DC2626" />
  </svg>
);

/** Ilustrasi Latar Belakang Spesifik tiap Kartu Program */
const ProgramBackdropIllustration = ({ id }: { id: string }) => {
  switch (id) {
    case "rhythm-memory":
      return (
        <svg
          viewBox="0 0 180 140"
          fill="none"
          className="pointer-events-none absolute -right-2 -bottom-2 h-36 w-44 opacity-25 select-none"
        >
          {/* Equalizer Bars & Beat Waves */}
          <rect x="65" y="75" width="10" height="45" rx="5" fill="#059669" />
          <rect x="83" y="45" width="10" height="75" rx="5" fill="#10B981" />
          <rect x="101" y="60" width="10" height="60" rx="5" fill="#059669" />
          <rect x="119" y="30" width="10" height="90" rx="5" fill="#047857" />
          <rect x="137" y="52" width="10" height="68" rx="5" fill="#10B981" />
          <rect x="155" y="70" width="10" height="50" rx="5" fill="#059669" />
          <circle cx="119" cy="18" r="6" fill="#F59E0B" />
        </svg>
      );

    case "lab-irama":
      return (
        <svg
          viewBox="0 0 180 140"
          fill="none"
          className="pointer-events-none absolute -right-2 -bottom-2 h-36 w-44 opacity-25 select-none"
        >
          {/* Kurva 3 Tangga Nada Rost: Datar -> Naik -> Turun */}
          <path
            d="M 15 90 L 65 90 C 85 90, 90 40, 115 40 C 140 40, 145 105, 170 105"
            stroke="#7E22CE"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="1 0"
          />
          <circle cx="40" cy="90" r="8" fill="#9333EA" />
          <circle
            cx="115"
            cy="40"
            r="9"
            fill="#F59E0B"
            stroke="#581C87"
            strokeWidth="3"
          />
          <circle cx="165" cy="105" r="8" fill="#9333EA" />
          <text x="26" y="114" fill="#581C87" fontSize="11" fontWeight="900">
            DATAR
          </text>
          <text x="101" y="25" fill="#581C87" fontSize="11" fontWeight="900">
            NAIK
          </text>
          <text x="135" y="128" fill="#581C87" fontSize="11" fontWeight="900">
            TURUN
          </text>
        </svg>
      );

    case "arena-kartu":
      return (
        <svg
          viewBox="0 0 180 140"
          fill="none"
          className="pointer-events-none absolute -right-2 -bottom-2 h-36 w-44 opacity-25 select-none"
        >
          {/* Grid Pasangan Kartu Memori */}
          <rect
            x="60"
            y="25"
            width="46"
            height="62"
            rx="8"
            fill="#F59E0B"
            stroke="#78350F"
            strokeWidth="4"
          />
          <rect
            x="116"
            y="25"
            width="46"
            height="62"
            rx="8"
            fill="#FEF08A"
            stroke="#78350F"
            strokeWidth="4"
          />
          <rect
            x="88"
            y="68"
            width="46"
            height="62"
            rx="8"
            fill="#D97706"
            stroke="#78350F"
            strokeWidth="4"
          />
          <path
            d="M139 45L142 52L149 55L142 58L139 65L136 58L129 55L136 52Z"
            fill="#78350F"
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
    subtitle: "Memori Kartu + Ketukan Irama",
    description:
      "Gabungan asah otak visual dan ketukan irama Tilawati! Balik kartu, dengarkan lantunan qari, dan ketuk tombol tepat sesuai ketukan nada untuk mencocokkan pasangannya.",
    badge: "Game Unggulan",
    badgeBg: "bg-[#059669]",
    skills: ["Memori Visual", "Ketukan Irama", "Audio Qari"],
    to: "/member/ngaji-ceria/rhythm-memory",
    themeBg: "bg-[#ECFDF5]",
    borderColor: "border-[#065F46]",
    accentBg: "bg-[#D1FAE5]",
    buttonBg: "bg-[#059669] hover:bg-[#047857] text-white border-[#064E3B]",
    textColor: "text-[#064E3B]",
    isFeatured: true,
    renderIcon: () => <RhythmMemoryIconSvg />,
  },
  {
    id: "lab-irama",
    title: "Lab Irama Tilawati",
    subtitle: "Studio Mandiri Nada Rost & Metronom",
    description:
      "Latih kepekaan telingamu membedakan 3 tingkatan nada Rost Tilawati (Datar, Naik, Turun) dan jaga konsistensi panjang-pendek bacaan bersama metronom visual.",
    badge: "Audio & Nada",
    badgeBg: "bg-[#7E22CE]",
    skills: ["Nada Datar-Naik-Turun", "Metronom Mad", "Fokus Telinga"],
    to: "/member/ngaji-ceria/lab-irama",
    themeBg: "bg-[#FAF5FF]",
    borderColor: "border-[#581C87]",
    accentBg: "bg-[#F3E8FF]",
    buttonBg: "bg-[#7E22CE] hover:bg-[#6B21A8] text-white border-[#3B0764]",
    textColor: "text-[#4C1D95]",
    renderIcon: () => <LabIramaIconSvg />,
  },
  {
    id: "arena-kartu",
    title: "Arena Kartu Klasik",
    subtitle: "Asah Ingatan Cepat Huruf & Ayat",
    description:
      "Uji ketangkasan memori mencocokkan huruf hijaiyah tunggal, kata berharakat, hingga potongan ayat suci di papan arena hijau zamrud sebelum waktu habis.",
    badge: "Memori Cepat",
    badgeBg: "bg-[#B45309]",
    skills: ["Kecepatan Mata", "Jilid 1 - 6", "Tantangan Waktu"],
    to: "/member/ngaji-ceria/arena-kartu",
    themeBg: "bg-[#FEFCE8]",
    borderColor: "border-[#78350F]",
    accentBg: "bg-[#FEF08A]",
    buttonBg: "bg-[#D97706] hover:bg-[#B45309] text-white border-[#451A03]",
    textColor: "text-[#713F12]",
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
      title="Pusat Latihan Tilawati"
      hideHeader={true}
      themeScope="tilawati"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="relative min-h-[100dvh] w-full bg-[#F0F9FF] overflow-x-hidden pb-36 select-none">
        {/* Ornamen Grid Studio Latihan Halus di Latar Belakang */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(#0284C7 1.25px, transparent 1.25px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-20">
          {/* Header Eksplorasi */}
          <ExploreHeader
            title="Pusat Latihan"
            subtitle="Asah kepekaan nada Rost, ketukan, & memori Tilawati"
            onBack={() => navigate("/member/ngaji-ceria/map")}
            themeScope="tilawati"
            themeColorClass="bg-[#0284C7]"
            borderColorClass="border-[#075985]"
            shadowClass="shadow-[0_4px_0px_#0C4A6E]"
            textColorClass="text-white"
            backClass="bg-white text-[#075985] border-[#075985] shadow-[2px_2px_0px_#0C4A6E] hover:bg-sky-50"
          />

          {/* ============================================================
              1. HERO BANNER DENGAN ILUSTRASI STUDIO IRAMA & MEMORI
             ============================================================ */}
          <section className="px-4 pt-6 max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-[26px] bg-[#0369A1] border-[3.5px] border-[#0C4A6E] p-5 sm:p-6 shadow-[0_6px_0px_#0C4A6E] text-white">
              {/* Pendar Cahaya Kuning Hangat di Kanan */}
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, #FEF08A 0%, #38BDF8 45%, transparent 70%)",
                }}
              />

              {/* Gelombang Akustik Latar Bawah */}
              <svg
                viewBox="0 0 400 90"
                preserveAspectRatio="none"
                className="pointer-events-none absolute bottom-0 left-0 h-16 w-full opacity-25"
              >
                <path
                  d="M0 90 L0 55 Q100 20 200 55 T400 45 L400 90 Z"
                  fill="#0C4A6E"
                />
              </svg>

              {/* Ilustrasi Vektor Kanan: Headphone Santri & Garpu Tala Nada */}
              <div className="pointer-events-none absolute right-2 top-0 bottom-0 hidden sm:flex w-[32%] items-center justify-center">
                <motion.svg
                  viewBox="0 0 140 130"
                  fill="none"
                  className="h-full max-h-[130px] w-auto overflow-visible drop-shadow-[3px_4px_0px_#082F49]"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Lingkar Headphone Studio */}
                  <path
                    d="M36 72 V54 C36 33 104 33 104 54 V72"
                    stroke="#FEF08A"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M36 72 V54 C36 33 104 33 104 54 V72"
                    stroke="#082F49"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Bantalan Telinga Kiri & Kanan */}
                  <rect
                    x="24"
                    y="62"
                    width="18"
                    height="30"
                    rx="7"
                    fill="#FF6B6B"
                    stroke="#082F49"
                    strokeWidth="3"
                  />
                  <rect
                    x="98"
                    y="62"
                    width="18"
                    height="30"
                    rx="7"
                    fill="#FF6B6B"
                    stroke="#082F49"
                    strokeWidth="3"
                  />
                  {/* Badge Bintang & Gelombang Irama di Tengah */}
                  <circle
                    cx="70"
                    cy="72"
                    r="20"
                    fill="#34D399"
                    stroke="#082F49"
                    strokeWidth="3"
                  />
                  {/* Bar Gelombang Suara */}
                  <line
                    x1="61"
                    y1="68"
                    x2="61"
                    y2="76"
                    stroke="#082F49"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="70"
                    y1="61"
                    x2="70"
                    y2="83"
                    stroke="#082F49"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="79"
                    y1="66"
                    x2="79"
                    y2="78"
                    stroke="#082F49"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Bintang Kecil */}
                  <path
                    d="M22 26L25 32L31 35L25 38L22 44L19 38L13 35L19 32Z"
                    fill="#FEF08A"
                    stroke="#082F49"
                    strokeWidth="2"
                  />
                  <path
                    d="M118 28L120 33L125 35L120 37L118 42L116 37L111 35L116 33Z"
                    fill="#34D399"
                    stroke="#082F49"
                    strokeWidth="2"
                  />
                </motion.svg>
              </div>

              {/* Konten Teks Hero */}
              <div className="relative z-10 sm:max-w-[68%]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#082F49] border-2 border-[#FEF08A] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FEF08A] mb-2 shadow-[2px_2px_0px_#082F49]">
                  <Sparkles size={12} /> Studio Mandiri & Multisensori
                </span>
                <h1 className="font-display font-black text-xl sm:text-2xl leading-tight text-white drop-shadow-[0_2px_0px_#082F49]">
                  Pusat Latihan Santri Tartila
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-sky-100 mt-1.5 leading-relaxed">
                  Pilih arena latihan favoritmu untuk mengasah kepekaan nada
                  Rost, ketukan panjang-pendek, serta daya ingat huruf dengan
                  cara yang seru!
                </p>

                {/* Indikator 3 Pilar Latihan */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FEF08A] border-2 border-[#082F49] px-2.5 py-1 text-[10px] font-black text-[#082F49] shadow-[2px_2px_0px_#082F49]">
                    <MusicSvg size={12} stroke="#082F49" /> 3 Nada Rost
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#34D399] border-2 border-[#082F49] px-2.5 py-1 text-[10px] font-black text-[#064E3B] shadow-[2px_2px_0px_#082F49]">
                    <DrumSvg size={12} stroke="#064E3B" /> Ketukan & Tempo
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6B6B] border-2 border-[#082F49] px-2.5 py-1 text-[10px] font-black text-white shadow-[2px_2px_0px_#082F49]">
                    <GameCardSvg size={12} stroke="#FFFFFF" /> Ingatan Visual
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================
              2. DAFTAR 3 PROGRAM LATIHAN (KARTU INTERAKTIF)
             ============================================================ */}
          <section className="px-4 pt-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="font-display font-black text-sm sm:text-base uppercase tracking-wider text-[#0C4A6E]">
                Pilih Mode Latihan ({TRAINING_PROGRAMS.length})
              </h2>
              <span className="text-[11px] font-bold text-slate-500">
                Bebas berlatih kapan saja
              </span>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5">
              {TRAINING_PROGRAMS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 24,
                    delay: idx * 0.07,
                  }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleNavigate(item.to)}
                  className={`group relative cursor-pointer overflow-hidden rounded-3xl border-[3.5px] p-5 shadow-[0_5px_0px_#0F172A] transition-all hover:shadow-[0_7px_0px_#0F172A] ${item.themeBg} ${item.borderColor}`}
                >
                  {/* Ilustrasi Vektor Dekoratif di Sudut Kanan Bawah Kartu */}
                  <ProgramBackdropIllustration id={item.id} />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Kotak Ikon Vektor Neo-Brutalist */}
                    <div className="flex items-center justify-between sm:block">
                      <div
                        className={`w-16 h-16 rounded-2xl border-[3px] border-[#0F172A] flex items-center justify-center shadow-[3px_3px_0px_#0F172A] shrink-0 transition-transform group-hover:scale-105 ${item.accentBg}`}
                      >
                        {item.renderIcon()}
                      </div>

                      {/* Badge Mobile di Sebelah Kanan Ikon */}
                      <div className="flex sm:hidden items-center gap-1.5">
                        {item.isFeatured && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#FEF08A] border-2 border-[#78350F] px-2 py-0.5 text-[10px] font-black text-[#78350F] uppercase">
                            <StarSvg size={10} fill="#78350F" /> Favorit
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-black text-white uppercase tracking-wider border-2 border-[#0F172A] ${item.badgeBg}`}
                        >
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Deskripsi & Tag Keahlian */}
                    <div className="flex-1 min-w-0">
                      {/* Baris Badge Desktop */}
                      <div className="hidden sm:flex items-center gap-2 mb-1.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black text-white uppercase tracking-wider border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] ${item.badgeBg}`}
                        >
                          {item.badge}
                        </span>
                        {item.isFeatured && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#FEF08A] border-2 border-[#78350F] px-2 py-0.5 text-[10px] font-black text-[#78350F] uppercase shadow-[2px_2px_0px_#78350F]">
                            <StarSvg size={10} fill="#78350F" /> Rekomendasi Utama
                          </span>
                        )}
                      </div>

                      <h3
                        className={`font-display font-black text-lg sm:text-xl leading-tight ${item.textColor}`}
                      >
                        {item.title}
                      </h3>
                      <span className="block text-xs font-extrabold text-slate-600 mt-0.5 mb-2">
                        {item.subtitle}
                      </span>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium max-w-xl">
                        {item.description}
                      </p>

                      {/* Baris Bawah: Pills Fokus Skill + Tombol Aksi Tegas */}
                      <div className="mt-4 pt-3.5 border-t-2 border-dashed border-slate-900/15 flex flex-wrap items-center justify-between gap-3">
                        {/* Skill Pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-1 rounded-lg bg-white/90 border border-slate-900/20 px-2 py-0.5 text-[10px] font-extrabold text-slate-700"
                            >
                              <CheckSvg size={10} className="text-[#10B981]" /> {skill}
                            </span>
                          ))}
                        </div>

                        {/* Tombol Mulai Latihan */}
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3.5 py-1.5 text-xs font-black shadow-[2px_2px_0px_#0F172A] transition-all group-hover:translate-x-0.5 ${item.buttonBg}`}
                        >
                          <span>Mulai Latihan</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
