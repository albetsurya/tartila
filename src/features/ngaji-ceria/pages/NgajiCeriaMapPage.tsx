import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { triggerBibiReaction } from "../../../utils/bibiEvent";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animationVariants";
import {
  LabTajwidBgSvg,
  GalaksiJuzAmmaBgSvg,
  GudangDoaSvg,
  TargetTahfidzSvg,
  JurnalIbadahSvg,
  ArenaKartuSvg,
  MetronomeArtSvg,
} from "../../../components/ui/Illustrations";
import {
  TilawatiSvg,
  TajwidKeySvg,
  GalaxyStarSvg,
  DoaChestSvg,
  QuranSvg,
  JurnalCalendarSvg,
  CardsSvg,
  SearchSvg,
  SparklesSvg,
  MoonSvg,
  SunSvg,
  UtensilsSvg,
  ArrowRightSvg,
  MusicSvg,
  MetronomeSvg,
  type SvgProps,
} from "../../../components/ui/CustomIcons";

/* ============================================================================
 * DATA MENU & REKOMENDASI
 * ============================================================================ */

interface ExploreMenuItem {
  key: string;
  title: string;
  desc: string;
  badge: string;
  to: string;
  bgClass: string;
  borderClass: string;
  iconBg: string;
  icon: React.FC<SvgProps>;
  /** Ilustrasi latar kartu (Neo-Brutalism), opsional untuk kartu utama. */
  art?: React.FC<SvgProps>;
  isMain?: boolean;
}

const EXPLORE_MENU: ExploreMenuItem[] = [
  {
    key: "tilawati",
    title: "Peta Tilawati",
    desc: "Jelajahi jalur petualangan membaca dari level dasar hingga mahir.",
    badge: "6 Level",
    to: "/member/ngaji-ceria/explore/tilawati",
    bgClass: "bg-[#FFF4E5]",
    borderClass: "border-[#F59E0B]",
    iconBg: "bg-[#FEF08A]",
    icon: TilawatiSvg,
    art: TargetTahfidzSvg,
    isMain: true,
  },
  {
    key: "training",
    title: "Pusat Training",
    desc: "Tartila Rhythm Memory, Lab Irama, & Arena Kartu.",
    badge: "Hub 3-in-1",
    to: "/member/ngaji-ceria/training",
    bgClass: "bg-[#F0FDF4]",
    borderClass: "border-[#10B981]",
    iconBg: "bg-[#D1FAE5]",
    icon: CardsSvg,
    art: ArenaKartuSvg,
  },
  {
    key: "tajwid",
    title: "Lab Tajwid",
    desc: "Rahasia bacaan indah & benar.",
    badge: "14 Misi",
    to: "/member/ngaji-ceria/explore/tajwid",
    bgClass: "bg-[#EAF5EA]",
    borderClass: "border-[#15803D]",
    iconBg: "bg-[#CCFBF1]",
    icon: SearchSvg,
    art: LabTajwidBgSvg,
  },
  {
    key: "juz-amma",
    title: "Galaksi Juz 'Amma",
    desc: "Hafalkan surat pendek bersama murottal.",
    badge: "37 Bintang",
    to: "/member/ngaji-ceria/explore/juz-amma",
    bgClass: "bg-[#E0F2FE]",
    borderClass: "border-[#0284C7]",
    iconBg: "bg-[#BAE6FD]",
    icon: GalaxyStarSvg,
    art: GalaksiJuzAmmaBgSvg,
  },
  {
    key: "doa",
    title: "Gudang Doa",
    desc: "Kumpulan doa harian & adab santri.",
    badge: "34 Harta",
    to: "/member/ngaji-ceria/explore/doa",
    bgClass: "bg-[#F3E8FF]",
    borderClass: "border-[#9333EA]",
    iconBg: "bg-[#F3E8FF]",
    icon: DoaChestSvg,
    art: GudangDoaSvg,
  },
  {
    key: "tahfidz",
    title: "Target Tahfidz",
    desc: "Pantau & uji hafalan Al-Quran mandiri.",
    badge: "39 Target",
    to: "/member/ngaji-ceria/explore/tahfidz",
    bgClass: "bg-[#FEF3C7]",
    borderClass: "border-[#D97706]",
    iconBg: "bg-[#FEF08A]",
    icon: QuranSvg,
    art: TargetTahfidzSvg,
  },
  {
    key: "jurnal-ibadah",
    title: "Jurnal Ibadah",
    desc: "Catat sholat 5 waktu & raih streak istiqomah.",
    badge: "5 Waktu",
    to: "/member/ngaji-ceria/explore/jurnal-ibadah",
    bgClass: "bg-[#CCFBF1]",
    borderClass: "border-[#0D9488]",
    iconBg: "bg-[#CCFBF1]",
    icon: JurnalCalendarSvg,
    art: JurnalIbadahSvg,
  },
];

const RECOMMENDATIONS = [
  { id: "sebelum-makan", label: "Doa Makan", icon: UtensilsSvg },
  { id: "sebelum-tidur", label: "Doa Tidur", icon: MoonSvg },
  { id: "al-ikhlas", label: "Al-Ikhlas", icon: QuranSvg },
  { id: "keluar-rumah", label: "Doa Keluar", icon: ArrowRightSvg },
];

export default function NgajiCeriaMapPage() {
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    triggerBibiReaction("play");
    navigate(to);
  };

  return (
    <NgajiCeriaLayout title="Jelajah">
      <div className="min-h-full bg-[var(--bg-app,#F0FDF4)] text-[var(--text-main,#134E4A)] pb-32 transition-colors duration-200">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-[#134E4A] px-5 pt-8 pb-14 md:px-8 md:pt-10 md:pb-16 text-white rounded-b-[40px] shadow-lg border-b-[3px] border-[var(--border-color,#134E4A)]">
          {/* Dekorasi */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[8px] border-white/5" />
          <div className="absolute top-10 right-16 rotate-12">
            <SparklesSvg size={32} />
          </div>
          <div className="absolute bottom-6 right-8 opacity-25">
            <MoonSvg size={64} />
          </div>

          <div className="relative z-10 max-w-[85%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B6B]/20 px-3 py-1 text-[10px] md:text-xs font-black uppercase tracking-widest text-[#FF6B6B]">
              <SparklesSvg size={14} /> Misi Hari Ini
            </span>
            <h2 className="mt-3 font-display text-[26px] md:text-3xl lg:text-4xl font-black leading-tight">
              Siap taklukkan <br />
              <span className="text-[#FF6B6B]">tantangan baru?</span>
            </h2>
            <p className="mt-2 text-[12px] md:text-sm font-medium text-white/80 leading-relaxed">
              Pilih markas belajarmu dan kumpulkan bintang sebanyak mungkin!
            </p>
          </div>
        </section>

        {/* Search & Chips */}
        <section className="relative z-20 -mt-8 px-4">
          <div className="flex items-center gap-2.5 rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-4 py-3 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)]">
            <SearchSvg size={22} className="text-[var(--text-main,#134E4A)]" />
            <input
              type="text"
              placeholder="Cari doa, surah, atau materi..."
              className="w-full bg-transparent text-sm font-bold text-[var(--text-main,#134E4A)] placeholder:text-[var(--text-main,#134E4A)]/40 focus:outline-none"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="whitespace-nowrap text-[11px] font-black text-[#D97706] dark:text-[#FDE047]">
              Rekomendasi:
            </span>
            {RECOMMENDATIONS.map((rec) => {
              const RecIcon = rec.icon;
              return (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() =>
                    handleNavigate(`/member/ngaji-ceria/explore/doa/${rec.id}`)
                  }
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                >
                  <RecIcon size={15} />
                  <span>{rec.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Bento Grid Menu Responsif (Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols) */}
        <section className="mt-6 px-4 md:px-6">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {EXPLORE_MENU.map((item) => {
              const Icon = item.icon;
              const Art = item.art;
              return (
                <motion.button
                  key={item.key}
                  variants={staggerItemVariants}
                  onClick={() => handleNavigate(item.to)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.96, y: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-[24px] border-[3px] p-4 text-left shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] transition-all cursor-pointer ${item.bgClass} dark:bg-[var(--bg-card)] ${item.borderClass} dark:border-[var(--border-color)] ${
                    item.isMain
                      ? "col-span-2 md:col-span-3 lg:col-span-4 flex-row items-center"
                      : "col-span-1"
                  }`}
                >
                  {/* Ilustrasi latar Neo-Brutalism dengan Sticker Aura & Pop-Out Dark Mode */}
                  {Art && (
                    <div className="absolute -right-3 -bottom-3 pointer-events-none select-none">
                      <div className="absolute inset-0 rounded-full bg-white/20 dark:bg-white/15 blur-md scale-95" />
                      <Art
                        size={item.isMain ? 116 : 104}
                        className="relative z-0 opacity-95 dark:opacity-100 drop-shadow-[2px_2px_0px_#134E4A] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  {/* Ikon Kiri (Jika Main) atau Atas */}
                  <div className={`${item.isMain ? "mr-4" : "mb-3"}`}>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border-[2.5px] border-[#134E4A] dark:border-white/80 shadow-[2.5px_2.5px_0px_#134E4A] dark:shadow-[2.5px_2.5px_0px_#000000] ${item.iconBg} text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488] shrink-0`}
                    >
                      <Icon size={26} className="text-[#134E4A]" stroke="#134E4A" />
                    </div>
                  </div>

                  {/* Teks */}
                  <div className="relative z-10 flex-1">
                    <h4 className="font-display text-[15px] font-black leading-tight text-[var(--text-main,#134E4A)]">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
                      {item.desc}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] px-2 py-1 shadow-sm">
                      <span className="text-[10px] font-black uppercase tracking-wide">
                        {item.badge}
                      </span>
                      <ArrowRightSvg
                        size={12}
                        className="text-[var(--text-main,#134E4A)]"
                      />
                    </div>
                  </div>

                  {/* Ornamen Latar */}
                  <div className="absolute -right-4 -bottom-4 opacity-0 pointer-events-none">
                    <Icon size={80} />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        {/* Doa Cepat (Bottom) */}
        <section className="mt-8 px-4">
          <div className="rounded-[28px] border-[3px] border-[#134E4A] bg-[#134E4A] p-5 shadow-[4px_4px_0px_#FF6B6B]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B]">
                  Akses Cepat
                </span>
                <h3 className="font-display text-lg font-black text-white">
                  Doa Kilat
                </h3>
              </div>
              <button
                onClick={() =>
                  handleNavigate("/member/ngaji-ceria/explore/doa")
                }
                className="flex items-center gap-1.5 rounded-xl border-2 border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-white/20 active:scale-95"
              >
                Semua <ArrowRightSvg size={13} className="text-white" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: MoonSvg, title: "Sebelum Tidur" },
                { icon: SunSvg, title: "Bangun Tidur" },
                { icon: UtensilsSvg, title: "Sebelum Makan" },
                { icon: SparklesSvg, title: "Sesudah Makan" },
              ].map((doa, idx) => {
                const Icon = doa.icon;
                return (
                  <button
                    key={idx}
                    onClick={() =>
                      handleNavigate("/member/ngaji-ceria/explore/doa")
                    }
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 active:bg-white/10 transition-colors"
                  >
                    <Icon size={20} />
                    <span className="text-[11px] font-bold text-white leading-tight">
                      {doa.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </NgajiCeriaLayout>
  );
}
