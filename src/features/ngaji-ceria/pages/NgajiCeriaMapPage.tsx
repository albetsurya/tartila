import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { isUstadzUser, isTartilaAdmin } from "@/lib/roles";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { triggerBibiReaction } from "../../../utils/bibiEvent";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animationVariants";
import {
  TajwidForestSvg,
  SamudraJuzAmmaBgSvg,
  OaseDoaSvg,
  TargetTahfidzSvg,
  JurnalIbadahSvg,
  ArenaKartuSvg,
  MetronomeArtSvg,
  PetaTilawatiSvg,
  HeroExplorerSvg,
} from "../../../components/ui/Illustrations";
import {
  TilawatiMapSvg,
  TajwidKeySvg,
  PaperBoatSvg,
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
    icon: TilawatiMapSvg,
    art: PetaTilawatiSvg,
    isMain: true,
  },
  {
    key: "training",
    title: "Savana Latihan",
    desc: "Latih ketukan, memori, dan kartu tebak huruf Tilawati.",
    badge: "3 Game",
    to: "/member/ngaji-ceria/training",
    bgClass: "bg-[#DCFCE7]",
    borderClass: "border-[#15803D]",
    iconBg: "bg-[#86EFAC]",
    icon: MetronomeSvg,
    art: MetronomeArtSvg,
  },
  {
    key: "tajwid",
    title: "Hutan Tajwid",
    desc: "Pelajari hukum bacaan di rimba ilmu.",
    badge: "14 Misi",
    to: "/member/ngaji-ceria/explore/tajwid",
    bgClass: "bg-[#F0FDF4]",
    borderClass: "border-[#166534]",
    iconBg: "bg-[#AFE6A7]",
    icon: TajwidKeySvg,
    art: TajwidForestSvg,
  },
  {
    key: "juz-amma",
    title: "Samudra Juz 'Amma",
    desc: "Hafalkan surat pendek di bawah taburan bintang laut.",
    badge: "37 Bintang",
    to: "/member/ngaji-ceria/explore/juz-amma",
    bgClass: "bg-[#E0F2FE]",
    borderClass: "border-[#0284C7]",
    iconBg: "bg-[#7DD3FC]",
    icon: PaperBoatSvg,
    art: SamudraJuzAmmaBgSvg,
  },
  {
    key: "doa",
    title: "Oase Doa",
    desc: "Singgah dan hafalkan doa di sumber mata air.",
    badge: "34 Doa",
    to: "/member/ngaji-ceria/explore/doa",
    bgClass: "bg-[#FDE68A]",
    borderClass: "border-[#B45309]",
    iconBg: "bg-[#FCD34D]",
    icon: DoaChestSvg,
    art: OaseDoaSvg,
  },
  {
    key: "tahfidz",
    title: "Puncak Hafalan",
    desc: "Daki puncak tertinggi dengan hafalan Al-Quran.",
    badge: "39 Target",
    to: "/member/ngaji-ceria/explore/tahfidz",
    bgClass: "bg-[#F1F5F9]",
    borderClass: "border-[#475569]",
    iconBg: "bg-[#CBD5E1]",
    icon: TargetTahfidzSvg,
    art: TargetTahfidzSvg,
  },
  {
    key: "jurnal-ibadah",
    title: "Sungai Ibadah",
    desc: "Catat sholat 5 waktu di batu pijakan sungai.",
    badge: "5 Waktu",
    to: "/member/ngaji-ceria/explore/jurnal-ibadah",
    bgClass: "bg-[#E0F2FE]",
    borderClass: "border-[#0C4A6E]",
    iconBg: "bg-[#7DD3FC]",
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
  const { user } = useAuth();
  const isBypass = isUstadzUser(user) || isTartilaAdmin(user?.role);

  const handleNavigate = (to: string) => {
    triggerBibiReaction("play");
    navigate(to);
  };

  return (
    <NgajiCeriaLayout title="Jelajah">
      <div className="min-h-full bg-[var(--bg-app,#F0FDF4)] text-[var(--text-main,#134E4A)] pb-32 transition-colors duration-200">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-[#134E4A] px-5 pt-8 pb-14 md:px-8 md:pt-10 md:pb-16 text-white rounded-b-[40px] shadow-lg border-b-[3px] border-[#134E4A]">
          {/* Ilustrasi Kompas & Teropong Penjelajah di Sebelah Kanan */}
          <div className="absolute right-4 bottom-2 md:right-10 md:bottom-0 pointer-events-none select-none z-10 opacity-95">
            <HeroExplorerSvg
              size={150}
              className="drop-shadow-[4px_4px_0px_#042F2E]"
            />
          </div>

          <div className="relative z-20 max-w-[72%] md:max-w-[78%]">
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
        <section className="relative z-20 -mt-7 px-3 sm:-mt-8 sm:px-4 md:px-6">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3.5 py-3 shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] sm:px-4 sm:shadow-[4px_4px_0px_var(--shadow-color,#134E4A)]">
            <SearchSvg
              size={21}
              className="shrink-0 text-[var(--text-main,#134E4A)]"
            />
            <input
              type="text"
              aria-label="Cari doa, surah, atau materi"
              placeholder="Cari doa, surah, atau materi..."
              className="w-full min-w-0 bg-transparent text-sm font-bold text-[var(--text-main,#134E4A)] placeholder:text-[var(--text-main,#134E4A)]/50 focus:outline-none focus-visible:ring-0 sm:text-base"
            />
          </label>

          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-hide">
            <span className="shrink-0 whitespace-nowrap text-xs font-black text-[#B45309] dark:text-[#FDE047]">
              Rekomendasi
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
                  className="inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3 py-2 text-xs font-black text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2"
                >
                  <RecIcon size={16} />
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
                      <Icon
                        size={26}
                        className="text-[#134E4A]"
                        stroke="#134E4A"
                      />
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
        <section className="mx-auto mt-8 max-w-5xl px-3 sm:px-4 md:px-6">
          <div className="rounded-[24px] border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] p-4 shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] sm:rounded-[28px] sm:p-5 sm:shadow-[4px_4px_0px_var(--shadow-color,#134E4A)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wide text-[#D9485F] dark:text-[#FDA4AF]">
                  Akses cepat
                </span>
                <h3 className="mt-0.5 font-display text-lg font-black text-[var(--text-main,#134E4A)] sm:text-xl">
                  Doa Kilat
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-main,#134E4A)]/70 sm:text-sm">
                  Pilih doa yang ingin kamu pelajari hari ini.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleNavigate("/member/ngaji-ceria/explore/doa")
                }
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-app,#F0FDF4)] px-3 py-2 text-xs font-black text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:text-sm"
              >
                Semua{" "}
                <ArrowRightSvg
                  size={14}
                  className="text-[var(--text-main,#134E4A)]"
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {[
                { id: "sebelum-tidur", icon: MoonSvg, title: "Sebelum Tidur" },
                { id: "bangun-tidur", icon: SunSvg, title: "Bangun Tidur" },
                {
                  id: "sebelum-makan",
                  icon: UtensilsSvg,
                  title: "Sebelum Makan",
                },
                {
                  id: "sesudah-makan",
                  icon: SparklesSvg,
                  title: "Sesudah Makan",
                },
              ].map((doa) => {
                const Icon = doa.icon;
                return (
                  <button
                    key={doa.id}
                    type="button"
                    onClick={() =>
                      handleNavigate(
                        `/member/ngaji-ceria/explore/doa/${doa.id}`,
                      )
                    }
                    className="flex min-h-12 min-w-0 items-center gap-2.5 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] p-2.5 text-left text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] transition-all hover:-translate-y-0.5 hover:bg-[#F8FAFC] active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 sm:gap-3 sm:p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--border-color,#134E4A)] bg-[#CCFBF1] text-[#134E4A] dark:bg-[#1E293B] dark:text-[#99F6E4]">
                      <Icon size={17} stroke="#134E4A" />
                    </div>
                    <span className="min-w-0 text-xs font-black leading-snug sm:text-sm">
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
