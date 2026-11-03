import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { isUstadzUser, isTartilaAdmin } from "@/lib/roles";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  Star,
  BookOpen,
  Play,
  ChevronLeft,
  Sparkles,
  Compass,
} from "../../../../components/ui/CustomIcons";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { PanduanMembacaModal } from "../../components/PanduanMembacaModal";
import { OutOfEnergyModal } from "../../components/OutOfEnergyModal";
import {
  ExploreHeader,
  ExploreStatBadge,
} from "../../components/ExploreHeader";
import { JuicyStar } from "@/components/ui/JuicyIcons";
import { useEconomyStore } from "../../hooks/useEconomyStore";
import { useNgajiCeriaStore } from "../../hooks/useNgajiCeriaStore";
import { useNgajiCeriaProgress } from "../../hooks/useNgajiCeriaProgress";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { AvatarSantriSvg } from "../../../../components/ui/Illustrations";
import { resolveMascotGender } from "@/utils/mascotHelper";
import { StickerButton } from "@/components/ui";

export interface MapNodeItem {
  page: number;
  arabic: string;
  title: string;
  desc: string;
}

export interface MapNodeItemWithMeta extends MapNodeItem {
  jilid: number;
  unlocked: boolean;
  stars: number;
}

const TILAWATI_MAP_PAGES: Record<number, MapNodeItem[]> = {
  1: [
    {
      page: 1,
      arabic: "ا - ب",
      title: "Huruf Alif (ا) & Ba (ب)",
      desc: "Mengenal bunyi huruf dasar dengan harokat fathah.",
    },
    {
      page: 2,
      arabic: "ت - ث",
      title: "Huruf Ta (ت) & Tsa (ث)",
      desc: "Mengenal bunyi huruf dasar dengan harokat fathah.",
    },
    {
      page: 3,
      arabic: "ج - ح - خ",
      title: "Huruf Jim, Ha, Kho",
      desc: "Mengenal bunyi huruf dasar dengan harokat fathah.",
    },
    {
      page: 4,
      arabic: "د - ذ",
      title: "Huruf Dal & Dzal",
      desc: "Lanjutan huruf dasar.",
    },
    {
      page: 5,
      arabic: "ر - ز",
      title: "Huruf Ro & Zai",
      desc: "Lanjutan huruf dasar.",
    },
    {
      page: 6,
      arabic: "س - ش",
      title: "Huruf Sin & Syin",
      desc: "Lanjutan huruf dasar.",
    },
    {
      page: 7,
      arabic: "ص - ض",
      title: "Huruf Shod & Dhod",
      desc: "Lanjutan huruf dasar.",
    },
  ],
  2: [
    {
      page: 1,
      arabic: "سَلَمَ سَلِمَ",
      title: "Fathah & Kasrah",
      desc: "Mengenal harakat kasrah dan perbedaannya dengan fathah.",
    },
    {
      page: 2,
      arabic: "حَمِدَ حَمَدَ",
      title: "Harakat Bersambung",
      desc: "Melancarkan bacaan harakat fathah dan kasrah bersambung.",
    },
    {
      page: 3,
      arabic: "عَلِمَ عَلَمَ",
      title: "Kasrah Tiga Huruf",
      desc: "Membaca kata 3 huruf dengan fathah dan kasrah.",
    },
    {
      page: 4,
      arabic: "رُسُلُ",
      title: "Harakat Dhammah",
      desc: "Mengenal harakat dhammah dan bunyinya.",
    },
    {
      page: 5,
      arabic: "خُلِقَ",
      title: "Tiga Harakat Dasar",
      desc: "Membaca kombinasi fathah, kasrah, dan dhammah.",
    },
    {
      page: 6,
      arabic: "بَلَغَ بُلِغَ",
      title: "Kelancaran Tiga Harakat",
      desc: "Membaca kata tiga huruf lancar tanpa mengeja.",
    },
    {
      page: 7,
      arabic: "صَدَقَ صُدِقَ",
      title: "Evaluasi Jilid 2",
      desc: "Uji pemahaman tiga harakat bersambung.",
    },
  ],
  3: [
    {
      page: 1,
      arabic: "بَا - تَا",
      title: "Mad Thobi'i Fathah",
      desc: "Mengenal bacaan panjang 1 alif (2 harakat) fathah alif.",
    },
    {
      page: 2,
      arabic: "بِيْ - تِيْ",
      title: "Mad Thobi'i Kasrah",
      desc: "Membaca panjang kasrah diikuti ya sukun.",
    },
    {
      page: 3,
      arabic: "بُوْ - تُوْ",
      title: "Mad Thobi'i Dhammah",
      desc: "Membaca panjang dhammah diikuti wawu sukun.",
    },
    {
      page: 4,
      arabic: "قَالَ - قِيْلَ",
      title: "Tiga Bentuk Mad",
      desc: "Membedakan tiga bentuk mad asli.",
    },
    {
      page: 5,
      arabic: "اَلْحَمْدُ",
      title: "Alif Lam Qomariyah",
      desc: "Membaca alif lam secara jelas (Idzhar Qomariyah).",
    },
    {
      page: 6,
      arabic: "اَلشَّمْسُ",
      title: "Alif Lam Syamsiyah",
      desc: "Membaca alif lam lebur ke huruf berikutnya.",
    },
    {
      page: 7,
      arabic: "اَلرَّحْمٰنُ",
      title: "Latihan Terpadu",
      desc: "Latihan membaca mad dan alif lam lancar.",
    },
  ],
  4: [
    {
      page: 1,
      arabic: "اَبْ - اَتْ",
      title: "Huruf Sukun Dasar",
      desc: "Mengenal huruf mati (sukun) dan cara bacanya.",
    },
    {
      page: 2,
      arabic: "يَقْطَعُ",
      title: "Qolqolah Sughro",
      desc: "Mengenal pantulan huruf qolqolah saat sukun.",
    },
    {
      page: 3,
      arabic: "كِتَابًا",
      title: "Tanwin",
      desc: "Mengenal tanwin fathah, kasrah, dan dhammah.",
    },
    {
      page: 4,
      arabic: "مَنْ اٰمَنَ",
      title: "Idzhar Halqi",
      desc: "Membaca jelas nun sukun / tanwin bertemu huruf halq.",
    },
    {
      page: 5,
      arabic: "مِنْ قَبْلِ",
      title: "Ikhfa Haqiqi",
      desc: "Membaca samar nun sukun / tanwin dengan dengung.",
    },
    {
      page: 6,
      arabic: "مَنْ يَّقُوْلُ",
      title: "Idgham Bighunnah",
      desc: "Memasukkan bunyi disertai dengung 2 harakat.",
    },
    {
      page: 7,
      arabic: "مِنْ رَّبِّهِمْ",
      title: "Idgham Bilaghunnah",
      desc: "Melafalkan idgham tanpa dengung.",
    },
  ],
  5: [
    {
      page: 1,
      arabic: "عَظِيْمٌ ○",
      title: "Waqaf & Tanda Baca",
      desc: "Belajar waqaf pada akhir ayat atau tanda berhenti.",
    },
    {
      page: 2,
      arabic: "جَآءَ",
      title: "Mad Wajib Muttashil",
      desc: "Membaca mad panjang 4-5 harakat dalam satu kata.",
    },
    {
      page: 3,
      arabic: "يَآ اَيُّهَا",
      title: "Mad Jaiz Munfashil",
      desc: "Membaca mad panjang terpisah antar dua kata.",
    },
    {
      page: 4,
      arabic: "وَلاَ الضَّآلِّيْنَ",
      title: "Mad Lazim Kilmi",
      desc: "Membaca mad panjang 6 harakat diberatkan.",
    },
    {
      page: 5,
      arabic: "اِنَّ - ثُمَّ",
      title: "Ghunnah Musyaddadah",
      desc: "Mendengungkan nun dan mim bertasydid 2 harakat.",
    },
    {
      page: 6,
      arabic: "عَلَيْهِمْ غَيْرِ",
      title: "Hukum Mim Sukun",
      desc: "Idzhar syafawi, ikhfa syafawi, dan idgham mitslain.",
    },
    {
      page: 7,
      arabic: "فِيْ جِيْدِهَا",
      title: "Tartil Kalimat Panjang",
      desc: "Membaca ayat utuh dengan kaidah tajwid lengkap.",
    },
  ],
  6: [
    {
      page: 1,
      arabic: "مَجْرٰ۪ىهَا",
      title: "Ghorib: Imalah",
      desc: "Membaca miring bunyi fathah ke arah kasrah.",
    },
    {
      page: 2,
      arabic: "لَا تَاۡمَ۫نَّا",
      title: "Ghorib: Isymam",
      desc: "Memonyongkan bibir tanpa suara saat melafalkan dengung.",
    },
    {
      page: 3,
      arabic: "ءَا۬عْجَمِيٌّ",
      title: "Ghorib: Tashil",
      desc: "Meringankan hamzah kedua antara hamzah dan alif.",
    },
    {
      page: 4,
      arabic: "بِئْسَ الِاسْمُ",
      title: "Ghorib: Naql",
      desc: "Memindahkan harakat hamzah ke huruf sebelumnya.",
    },
    {
      page: 5,
      arabic: "عِوَجًا ۜ قَيِّمًا",
      title: "Saktah",
      desc: "Berhenti sejenak 2 harakat tanpa bernapas.",
    },
    {
      page: 6,
      arabic: "يَبْصُۜطُ",
      title: "Musykilat Khusus",
      desc: "Membaca huruf sin kecil di atas huruf shad.",
    },
    {
      page: 7,
      arabic: "وَتَمَّتْ كَلِمَتُ",
      title: "Khatam Tilawati",
      desc: "Evaluasi akhir kemampuan membaca tartil Al-Qur'an.",
    },
  ],
};

const MAP_NODE_X: Record<number, number[]> = {
  1: [48, 72, 26, 70, 28, 73, 46],
  2: [46, 68, 32, 65, 31, 66, 48],
  3: [50, 29, 70, 36, 68, 30, 52],
  4: [26, 44, 28, 48, 25, 45, 33],
  5: [48, 69, 31, 65, 34, 68, 49],
  6: [45, 67, 32, 68, 36, 64, 50],
};

const ITEM_HEIGHT = 186;
const TOP_PADDING = 365;

type MapTheme = {
  regionName: string;
  regionKicker: string;
  tagline: string;
  coordinate: string;
  elevationRange: string;
  mapScale: string;
  symbol: string;
  hypsometricScale: string[];
  background: string;
  frame: string;
  gridColor: string;
  ink: string;
  muted: string;
  panel: string;
  panelLine: string;
  panelShadow: string;
  accent: string;
  accentSoft: string;
  path: string;
  pathDone: string;
  pathHalo: string;
  node: string;
  nodeLine: string;
  nodeShadow: string;
  lockedNode: string;
  lockedLine: string;
  labelBg: string;
  labelHeaderBg: string;
  labelLine: string;
  avatarBg: string;
  buttonBg: string;
  buttonText: string;
  buttonLine: string;
  isDark: boolean;
  headerBgClass: string;
  headerBorderClass: string;
  headerShadowClass: string;
  headerTextClass: string;
  headerBackClass: string;
};

/**
 * 100% Pure Neo-Brutalism + Topographic Hypsometric Palette:
 * Semua warna solid (tanpa rgba/blur), garis tepi tegas, dan hard offset shadow.
 */
const MAP_THEMES: Record<number, MapTheme> = {
  1: {
    regionName: "Kepulauan Hijaiyah",
    regionKicker: "PETA BATIMETRI & ATOLL",
    tagline: "Jelajahi gugusan pulau karang dan kenali bunyi huruf dasar.",
    coordinate: "01°12'N · 101°24'E",
    elevationRange: "-40m s/d +125m",
    mapScale: "1 : 25.000",
    symbol: "⛵",
    hypsometricScale: ["#4D9EB8", "#82CADE", "#F4E5BC", "#A9D17B", "#5B9A54"],
    background: "#63B6CE",
    frame: "#09303D",
    gridColor: "#09303D",
    ink: "#09303D",
    muted: "#1E5668",
    panel: "#FFFDF5",
    panelLine: "#09303D",
    panelShadow: "#09303D",
    accent: "#FF9F1C",
    accentSoft: "#FFE599",
    path: "#5C4028",
    pathDone: "#E65127",
    pathHalo: "#FFFDF5",
    node: "#0081A7",
    nodeLine: "#09303D",
    nodeShadow: "#09303D",
    lockedNode: "#94B0B8",
    lockedLine: "#09303D",
    labelBg: "#FFFDF5",
    labelHeaderBg: "#D8F3FA",
    labelLine: "#09303D",
    avatarBg: "#FFE599",
    buttonBg: "#FFFDF5",
    buttonText: "#09303D",
    buttonLine: "#09303D",
    isDark: false,
    headerBgClass: "bg-[#B8ECF7]",
    headerBorderClass: "border-[#09303D]",
    headerShadowClass: "shadow-[0_4px_0px_#09303D]",
    headerTextClass: "text-[#09303D]",
    headerBackClass:
      "px-3 py-2 min-h-[40px] w-auto h-auto rounded-xl border-[2.5px] border-[#09303D] bg-[#FFFDF5] text-[#09303D] shadow-[3px_3px_0px_#09303D] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  },
  2: {
    regionName: "Lembah Sambung",
    regionKicker: "TOPOGRAFI NGARAI & DAS",
    tagline: "Susuri kontur tebing ngarai dan jembatan sungai harakat.",
    coordinate: "02°08'N · 104°15'E",
    elevationRange: "+85m s/d +640m",
    mapScale: "1 : 30.000",
    symbol: "🌉",
    hypsometricScale: ["#58A4B0", "#C5DCA0", "#EFE0B4", "#DDA96B", "#B5733D"],
    background: "#DFC38B",
    frame: "#3D1E05",
    gridColor: "#3D1E05",
    ink: "#3D1E05",
    muted: "#6E3B10",
    panel: "#FFF9EB",
    panelLine: "#3D1E05",
    panelShadow: "#3D1E05",
    accent: "#F77F00",
    accentSoft: "#FFD166",
    path: "#6E3F16",
    pathDone: "#D6451B",
    pathHalo: "#FFF9EB",
    node: "#D65A1E",
    nodeLine: "#3D1E05",
    nodeShadow: "#3D1E05",
    lockedNode: "#B8A590",
    lockedLine: "#3D1E05",
    labelBg: "#FFF9EB",
    labelHeaderBg: "#FCE1B6",
    labelLine: "#3D1E05",
    avatarBg: "#FFD166",
    buttonBg: "#FFF9EB",
    buttonText: "#3D1E05",
    buttonLine: "#3D1E05",
    isDark: false,
    headerBgClass: "bg-[#F9E0AE]",
    headerBorderClass: "border-[#3D1E05]",
    headerShadowClass: "shadow-[0_4px_0px_#3D1E05]",
    headerTextClass: "text-[#3D1E05]",
    headerBackClass:
      "px-3 py-2 min-h-[40px] w-auto h-auto rounded-xl border-[2.5px] border-[#3D1E05] bg-[#FFF9EB] text-[#3D1E05] shadow-[3px_3px_0px_#3D1E05] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  },
  3: {
    regionName: "Pegunungan Irama",
    regionKicker: "ATLAS ELEVASI ALPIN",
    tagline: "Daki garis kontur punggung bukit menuju puncak bacaan mad.",
    coordinate: "03°21'N · 108°40'E",
    elevationRange: "+750m s/d +3.120m",
    mapScale: "1 : 40.000",
    symbol: "⛰",
    hypsometricScale: ["#6D9F71", "#99C286", "#D2DEC2", "#B5BEB8", "#F5FAF7"],
    background: "#9CC293",
    frame: "#0D2E18",
    gridColor: "#0D2E18",
    ink: "#0D2E18",
    muted: "#265936",
    panel: "#F4FBF4",
    panelLine: "#0D2E18",
    panelShadow: "#0D2E18",
    accent: "#FFB703",
    accentSoft: "#C7F9CC",
    path: "#2D5A3C",
    pathDone: "#E05A2B",
    pathHalo: "#F4FBF4",
    node: "#2B8A3E",
    nodeLine: "#0D2E18",
    nodeShadow: "#0D2E18",
    lockedNode: "#94AD9A",
    lockedLine: "#0D2E18",
    labelBg: "#F4FBF4",
    labelHeaderBg: "#D6EFE0",
    labelLine: "#0D2E18",
    avatarBg: "#C7F9CC",
    buttonBg: "#F4FBF4",
    buttonText: "#0D2E18",
    buttonLine: "#0D2E18",
    isDark: false,
    headerBgClass: "bg-[#C7F9CC]",
    headerBorderClass: "border-[#0D2E18]",
    headerShadowClass: "shadow-[0_4px_0px_#0D2E18]",
    headerTextClass: "text-[#0D2E18]",
    headerBackClass:
      "px-3 py-2 min-h-[40px] w-auto h-auto rounded-xl border-[2.5px] border-[#0D2E18] bg-[#F4FBF4] text-[#0D2E18] shadow-[3px_3px_0px_#0D2E18] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  },
  4: {
    regionName: "Tanjung Waqaf",
    regionKicker: "PETA NAVIGASI PESISIR",
    tagline: "Ikuti garis tanjung, teluk dalam, dan sektor suar waqaf.",
    coordinate: "04°05'N · 112°18'E",
    elevationRange: "-80m s/d +210m",
    mapScale: "1 : 20.000",
    symbol: "⚓",
    hypsometricScale: ["#34789E", "#65A8C4", "#F4E3B4", "#C7DBA0", "#8BB36E"],
    background: "#5B9FB9",
    frame: "#0A2540",
    gridColor: "#0A2540",
    ink: "#0A2540",
    muted: "#244E73",
    panel: "#F5FAFF",
    panelLine: "#0A2540",
    panelShadow: "#0A2540",
    accent: "#EF476F",
    accentSoft: "#FFD6E0",
    path: "#274C6B",
    pathDone: "#EF476F",
    pathHalo: "#F5FAFF",
    node: "#118AB2",
    nodeLine: "#0A2540",
    nodeShadow: "#0A2540",
    lockedNode: "#96ACB8",
    lockedLine: "#0A2540",
    labelBg: "#F5FAFF",
    labelHeaderBg: "#DCEFFC",
    labelLine: "#0A2540",
    avatarBg: "#FFD6E0",
    buttonBg: "#F5FAFF",
    buttonText: "#0A2540",
    buttonLine: "#0A2540",
    isDark: false,
    headerBgClass: "bg-[#CBE8FA]",
    headerBorderClass: "border-[#0A2540]",
    headerShadowClass: "shadow-[0_4px_0px_#0A2540]",
    headerTextClass: "text-[#0A2540]",
    headerBackClass:
      "px-3 py-2 min-h-[40px] w-auto h-auto rounded-xl border-[2.5px] border-[#0A2540] bg-[#F5FAFF] text-[#0A2540] shadow-[3px_3px_0px_#0A2540] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  },
  5: {
    regionName: "Kawah Dengung",
    regionKicker: "PETA GEOLOGI KALDERA",
    tagline: "Telusuri cincin kaldera vulkanik dan jalur aliran magma ghunnah.",
    coordinate: "05°19'N · 116°42'E",
    elevationRange: "+920m s/d +2.890m",
    mapScale: "1 : 15.000",
    symbol: "🌋",
    hypsometricScale: ["#2C2224", "#493435", "#6E4843", "#C85A32", "#FFB648"],
    background: "#24191B",
    frame: "#12090A",
    gridColor: "#FF9F1C",
    ink: "#FFF3E6",
    muted: "#F4B89A",
    panel: "#362023",
    panelLine: "#FF9F1C",
    panelShadow: "#12090A",
    accent: "#FF9F1C",
    accentSoft: "#5E2A27",
    path: "#7A4940",
    pathDone: "#FF6B1A",
    pathHalo: "#12090A",
    node: "#E63946",
    nodeLine: "#FFE599",
    nodeShadow: "#12090A",
    lockedNode: "#5C494B",
    lockedLine: "#12090A",
    labelBg: "#362023",
    labelHeaderBg: "#522A2D",
    labelLine: "#FF9F1C",
    avatarBg: "#5E2A27",
    buttonBg: "#362023",
    buttonText: "#FFF3E6",
    buttonLine: "#FF9F1C",
    isDark: true,
    headerBgClass: "bg-[#362023]",
    headerBorderClass: "border-[#FF9F1C]",
    headerShadowClass: "shadow-[0_4px_0px_#12090A]",
    headerTextClass: "text-[#FFF3E6]",
    headerBackClass:
      "px-3 py-2 min-h-[40px] w-auto h-auto rounded-xl border-[2.5px] border-[#FF9F1C] bg-[#522A2D] text-[#FFF3E6] shadow-[3px_3px_0px_#12090A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  },
  6: {
    regionName: "Puncak Khatam",
    regionKicker: "ATLAS PUNCAK & ASTRONOMI",
    tagline: "Capai kontur tertinggi menuju observatorium khatam Al-Qur'an.",
    coordinate: "06°00'N · 120°00'E",
    elevationRange: "+1.800m s/d +4.200m",
    mapScale: "1 : 10.000",
    symbol: "✦",
    hypsometricScale: ["#1D2042", "#2C3163", "#434A87", "#7378B5", "#F3D078"],
    background: "#171A38",
    frame: "#0B0A1F",
    gridColor: "#FFD166",
    ink: "#F8F5FF",
    muted: "#D0C8F8",
    panel: "#26234F",
    panelLine: "#FFD166",
    panelShadow: "#0B0A1F",
    accent: "#FFD166",
    accentSoft: "#433D7A",
    path: "#6E679E",
    pathDone: "#FFD166",
    pathHalo: "#0B0A1F",
    node: "#7209B7",
    nodeLine: "#FFD166",
    nodeShadow: "#0B0A1F",
    lockedNode: "#4B4870",
    lockedLine: "#0B0A1F",
    labelBg: "#26234F",
    labelHeaderBg: "#393470",
    labelLine: "#FFD166",
    avatarBg: "#433D7A",
    buttonBg: "#26234F",
    buttonText: "#F8F5FF",
    buttonLine: "#FFD166",
    isDark: true,
    headerBgClass: "bg-[#26234F]",
    headerBorderClass: "border-[#FFD166]",
    headerShadowClass: "shadow-[0_4px_0px_#0B0A1F]",
    headerTextClass: "text-[#F8F5FF]",
    headerBackClass:
      "px-3 py-2 min-h-[40px] w-auto h-auto rounded-xl border-[2.5px] border-[#FFD166] bg-[#393470] text-[#F8F5FF] shadow-[3px_3px_0px_#0B0A1F] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  },
};

/**
 * Kanvas Topografi & Kartografi Atlas per Jilid (Pure Neo-Brutalism Vector Style).
 * Menggunakan Hard Offset Shadow (stdDeviation="0") dan garis kontur tegas.
 */
const RegionMapArtwork: React.FC<{ jilid: number; height: number }> = ({
  jilid,
  height,
}) => {
  const theme = MAP_THEMES[jilid] || MAP_THEMES[1];
  const horizontalGridCount = Math.floor(height / 140);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex justify-center overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full max-w-md"
        viewBox={`0 0 390 ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Tekstur Titik Kertas Kartografi */}
          <pattern
            id={`brutal-dots-${jilid}`}
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="4"
              cy="4"
              r="0.9"
              fill={theme.isDark ? "#FFFFFF" : "#09303D"}
              opacity="0.14"
            />
            <circle
              cx="15"
              cy="15"
              r="0.8"
              fill={theme.isDark ? "#FFFFFF" : "#09303D"}
              opacity="0.1"
            />
          </pattern>

          {/* Hard Offset Shadow Murni (Zero Blur) untuk Pulau & Kontur Utama */}
          <filter
            id={`brutal-relief-${jilid}`}
            x="-10%"
            y="-10%"
            width="125%"
            height="125%"
          >
            <feDropShadow
              dx="4"
              dy="4"
              stdDeviation="0"
              floodColor={theme.panelShadow}
              floodOpacity="1"
            />
          </filter>
        </defs>

        {/* ============================================================
            JILID 1: PETA BATIMETRI & TOPOGRAFI GUGUSAN PULAU
           ============================================================ */}
        {jilid === 1 && (
          <g>
            <rect width="390" height={height} fill="#63B6CE" />

            {/* Zona Palung Laut Dalam (Deep Bathymetry Polygons) */}
            <path
              d="M-20 120 C70 90 120 190 60 260 C10 320 -30 250 -20 120Z"
              fill="#3F93AD"
              stroke="#09303D"
              strokeWidth="2"
            />
            <path
              d="M310 580 C390 540 420 690 355 770 C295 830 255 640 310 580Z"
              fill="#3F93AD"
              stroke="#09303D"
              strokeWidth="2"
            />
            <path
              d="M-30 1080 C65 1030 105 1170 40 1250 C-15 1310 -45 1180 -30 1080Z"
              fill="#3F93AD"
              stroke="#09303D"
              strokeWidth="2"
            />

            {/* Garis Kontur Batimetri (Isobaths) */}
            <g
              fill="none"
              stroke="#D8F6FF"
              strokeWidth="1.6"
              strokeDasharray="6 4"
            >
              {Array.from({ length: 16 }, (_, i) => {
                const y = 90 + i * 98;
                return (
                  <path
                    key={`isobath-${i}`}
                    d={`M-20 ${y} C65 ${y - 34} 145 ${y + 32} 230 ${y - 10} S340 ${y + 28} 415 ${y - 14}`}
                  />
                );
              })}
            </g>

            {/* 7 Pulau Topografi Berlapis (Hypsometric Tints + Hard Shadow) */}
            {[
              { cx: 185, cy: 365, rx: 88, ry: 52, rot: -6, elev: "85m" },
              { cx: 278, cy: 551, rx: 82, ry: 48, rot: 8, elev: "110m" },
              { cx: 102, cy: 737, rx: 84, ry: 50, rot: -10, elev: "92m" },
              { cx: 270, cy: 923, rx: 86, ry: 52, rot: 7, elev: "124m" },
              { cx: 110, cy: 1109, rx: 84, ry: 49, rot: -8, elev: "98m" },
              { cx: 282, cy: 1295, rx: 86, ry: 50, rot: 9, elev: "115m" },
              { cx: 180, cy: 1481, rx: 94, ry: 56, rot: -4, elev: "140m" },
            ].map((isl, idx) => (
              <g
                key={`island-${idx}`}
                transform={`translate(${isl.cx} ${isl.cy}) rotate(${isl.rot})`}
              >
                {/* Zona Laguna Dangkal */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={isl.rx + 18}
                  ry={isl.ry + 13}
                  fill="#B6EEF5"
                  stroke="#09303D"
                  strokeWidth="1.8"
                  strokeDasharray="5 4"
                />
                {/* Lapisan 1: Pesisir Pasir (Hard Shadow) */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={isl.rx}
                  ry={isl.ry}
                  fill="#F5E6B8"
                  stroke="#09303D"
                  strokeWidth="2.5"
                  filter={`url(#brutal-relief-${jilid})`}
                />
                {/* Lapisan 2: Dataran Rendah (+25m) */}
                <ellipse
                  cx="-2"
                  cy="-2"
                  rx={isl.rx * 0.76}
                  ry={isl.ry * 0.74}
                  fill="#C5E09B"
                  stroke="#09303D"
                  strokeWidth="2"
                />
                {/* Lapisan 3: Perbukitan (+60m) */}
                <ellipse
                  cx="-4"
                  cy="-3"
                  rx={isl.rx * 0.5}
                  ry={isl.ry * 0.48}
                  fill="#8EC271"
                  stroke="#09303D"
                  strokeWidth="1.8"
                />
                {/* Lapisan 4: Puncak Bukit (+100m) */}
                <ellipse
                  cx="-6"
                  cy="-4"
                  rx={isl.rx * 0.25}
                  ry={isl.ry * 0.24}
                  fill="#5B9A54"
                  stroke="#09303D"
                  strokeWidth="1.8"
                />
                {/* Titik Triangulasi Survei */}
                <polygon points="-9,-1 -5,-9 -1,-1" fill="#09303D" />
                <text
                  x="4"
                  y="-2"
                  fontSize="7.5"
                  fontWeight="900"
                  fill="#09303D"
                >
                  {isl.elev}
                </text>
              </g>
            ))}

            {/* Atol Kecil */}
            {[
              { x: 62, y: 475, r: 22 },
              { x: 325, y: 725, r: 20 },
              { x: 68, y: 920, r: 24 },
              { x: 320, y: 1105, r: 19 },
            ].map((atoll, i) => (
              <g
                key={`atoll-${i}`}
                transform={`translate(${atoll.x} ${atoll.y})`}
              >
                <circle cx="3" cy="3" r={atoll.r} fill="#09303D" />
                <circle
                  cx="0"
                  cy="0"
                  r={atoll.r}
                  fill="#F5E6B8"
                  stroke="#09303D"
                  strokeWidth="2"
                />
                <circle
                  cx="-2"
                  cy="-2"
                  r={atoll.r * 0.55}
                  fill="#A9D17B"
                  stroke="#09303D"
                  strokeWidth="1.5"
                />
              </g>
            ))}

            <g fill="#09303D" fontSize="9" fontWeight="900" letterSpacing="2">
              <text x="20" y="255">
                SELAT ALIF-BA (-25m)
              </text>
              <text x="200" y="660">
                LAGUNA FATHAH (-12m)
              </text>
              <text x="22" y="1005">
                TELUK HIJAIYAH (-30m)
              </text>
            </g>
          </g>
        )}

        {/* ============================================================
            JILID 2: TOPOGRAFI NGARAI, TEBING TERASERING & SUNGAI
           ============================================================ */}
        {jilid === 2 && (
          <g>
            <rect width="390" height={height} fill="#EDE0B3" />

            {/* Sabuk Subur Lembah Aluvial */}
            <path
              d="M95 0 C145 180 75 360 130 540 C185 720 95 900 145 1080 C190 1260 110 1440 155 1700 L265 1700 C220 1440 300 1260 255 1080 C205 900 295 720 240 540 C185 360 255 180 205 0 Z"
              fill="#C5DCA0"
              stroke="#3D1E05"
              strokeWidth="2"
              strokeDasharray="7 4"
            />

            {/* Tebing Ngarai Barat Berlapis (3 Tingkat Elevasi) */}
            <path
              d="M-20 0 L108 0 C138 165 68 330 118 495 C168 660 82 825 128 990 C172 1155 95 1320 138 1485 L150 1700 L-20 1700 Z"
              fill="#DFBA7B"
              stroke="#3D1E05"
              strokeWidth="2.5"
              filter={`url(#brutal-relief-${jilid})`}
            />
            <path
              d="M-20 0 L78 0 C105 165 40 330 85 495 C132 660 52 825 96 990 C138 1155 64 1320 105 1485 L115 1700 L-20 1700 Z"
              fill="#CE9A57"
              stroke="#3D1E05"
              strokeWidth="2.2"
            />
            <path
              d="M-20 0 L45 0 C68 165 12 330 52 495 C92 660 22 825 60 990 C96 1155 32 1320 68 1485 L78 1700 L-20 1700 Z"
              fill="#B5793A"
              stroke="#3D1E05"
              strokeWidth="2.2"
            />

            {/* Tebing Ngarai Timur Berlapis */}
            <path
              d="M410 0 L278 0 C310 165 245 330 292 495 C338 660 258 825 302 990 C342 1155 270 1320 310 1485 L320 1700 L410 1700 Z"
              fill="#DFBA7B"
              stroke="#3D1E05"
              strokeWidth="2.5"
              filter={`url(#brutal-relief-${jilid})`}
            />
            <path
              d="M410 0 L312 0 C342 165 278 330 322 495 C365 660 290 825 332 990 C370 1155 302 1320 340 1485 L350 1700 L410 1700 Z"
              fill="#CE9A57"
              stroke="#3D1E05"
              strokeWidth="2.2"
            />
            <path
              d="M410 0 L346 0 C372 165 314 330 354 495 C392 660 325 825 362 990 C395 1155 336 1320 370 1485 L380 1700 L410 1700 Z"
              fill="#B5793A"
              stroke="#3D1E05"
              strokeWidth="2.2"
            />

            {/* Sungai Utama dengan Casing Tegas */}
            <path
              d="M175 -20 C215 115 142 230 196 365 C248 495 152 625 204 760 C255 895 158 1030 208 1165 C255 1295 168 1435 215 1720"
              fill="none"
              stroke="#3D1E05"
              strokeWidth="30"
              strokeLinecap="round"
            />
            <path
              d="M175 -20 C215 115 142 230 196 365 C248 495 152 625 204 760 C255 895 158 1030 208 1165 C255 1295 168 1435 215 1720"
              fill="none"
              stroke="#58A4B0"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <path
              d="M175 -20 C215 115 142 230 196 365 C248 495 152 625 204 760 C255 895 158 1030 208 1165 C255 1295 168 1435 215 1720"
              fill="none"
              stroke="#D8F6FF"
              strokeWidth="3.5"
              strokeDasharray="10 8"
            />

            {/* Jembatan Kartografi Neo-Brutalist */}
            {[445, 635, 815, 995, 1180, 1365].map((by, i) => (
              <g key={`bridge-${i}`} transform={`translate(196 ${by})`}>
                <rect
                  x="-24"
                  y="-5"
                  width="52"
                  height="14"
                  rx="3"
                  fill="#3D1E05"
                />
                <rect
                  x="-26"
                  y="-8"
                  width="52"
                  height="14"
                  rx="3"
                  fill="#FFD166"
                  stroke="#3D1E05"
                  strokeWidth="2.2"
                />
              </g>
            ))}

            <g fill="#3D1E05" fontSize="9" fontWeight="900" letterSpacing="2">
              <text x="16" y="295">
                TEBING BARAT (+520m)
              </text>
              <text x="220" y="695">
                DAS HARAKAT (+95m)
              </text>
              <text x="18" y="1045">
                PLATO KASRAH (+480m)
              </text>
            </g>
          </g>
        )}

        {/* ============================================================
            JILID 3: PETA TOPOGRAFI PEGUNUNGAN ALPIN & PUNCAK SALJU
           ============================================================ */}
        {jilid === 3 && (
          <g>
            <rect width="390" height={height} fill="#B7D3A8" />

            {/* Danau Glasial Pegunungan */}
            <path
              d="M25 560 C65 545 95 575 78 605 C62 630 18 625 12 595 C8 575 14 565 25 560Z"
              fill="#6BC2D4"
              stroke="#0D2E18"
              strokeWidth="2.5"
              filter={`url(#brutal-relief-${jilid})`}
            />
            <path
              d="M295 1110 C338 1095 368 1125 352 1158 C335 1185 288 1178 282 1148 C278 1128 282 1116 295 1110Z"
              fill="#6BC2D4"
              stroke="#0D2E18"
              strokeWidth="2.5"
              filter={`url(#brutal-relief-${jilid})`}
            />

            {/* 4 Massif Pegunungan Utama Berlapis Elevasi */}
            {[
              {
                cx: 195,
                cy: 375,
                rx: 145,
                ry: 78,
                peak: "2.150m",
                name: "G. THOBI'I",
              },
              {
                cx: 115,
                cy: 710,
                rx: 135,
                ry: 74,
                peak: "2.480m",
                name: "G. KASRAH",
              },
              {
                cx: 265,
                cy: 1045,
                rx: 140,
                ry: 76,
                peak: "2.890m",
                name: "G. QOMARIYAH",
              },
              {
                cx: 185,
                cy: 1415,
                rx: 150,
                ry: 82,
                peak: "3.120m",
                name: "PUNCAK MAD",
              },
            ].map((mtn, idx) => (
              <g
                key={`massif-${idx}`}
                transform={`translate(${mtn.cx} ${mtn.cy})`}
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx={mtn.rx}
                  ry={mtn.ry}
                  fill="#90BC82"
                  stroke="#0D2E18"
                  strokeWidth="2.5"
                  filter={`url(#brutal-relief-${jilid})`}
                />
                <ellipse
                  cx="-4"
                  cy="-3"
                  rx={mtn.rx * 0.76}
                  ry={mtn.ry * 0.74}
                  fill="#B4C99C"
                  stroke="#0D2E18"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                />
                <ellipse
                  cx="-8"
                  cy="-5"
                  rx={mtn.rx * 0.52}
                  ry={mtn.ry * 0.5}
                  fill="#C9CFC7"
                  stroke="#0D2E18"
                  strokeWidth="2"
                />
                <ellipse
                  cx="-10"
                  cy="-6"
                  rx={mtn.rx * 0.28}
                  ry={mtn.ry * 0.27}
                  fill="#F4FAF6"
                  stroke="#0D2E18"
                  strokeWidth="2"
                />
                <path
                  d={`M-${mtn.rx * 0.65} 0 L-10 -6 L${mtn.rx * 0.6} 4 M-10 -6 L-4 ${mtn.ry * 0.55}`}
                  stroke="#0D2E18"
                  strokeWidth="1.6"
                  fill="none"
                />
                <polygon points="-15,-2 -10,-12 -5,-2" fill="#0D2E18" />
                <text
                  x="-2"
                  y="-3"
                  fontSize="8"
                  fontWeight="900"
                  fill="#0D2E18"
                >
                  ▲ {mtn.peak}
                </text>
                <text
                  x="-32"
                  y="13"
                  fontSize="7.5"
                  fontWeight="900"
                  letterSpacing="1.2"
                  fill="#0D2E18"
                >
                  {mtn.name}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* ============================================================
            JILID 4: PETA NAVIGASI PESISIR, SEMENANJUNG & MERCUSUAR
           ============================================================ */}
        {jilid === 4 && (
          <g>
            <rect width="390" height={height} fill="#5B9FB9" />

            {/* Kontur Kedalaman Teluk (Isobaths) */}
            <path
              d="M275 -20 C245 110 305 210 250 340 C198 460 278 560 232 690 C192 810 268 920 220 1050 C178 1170 255 1290 205 1420 C168 1530 210 1630 185 1720 L410 1720 L410 -20 Z"
              fill="#468FAD"
              stroke="#0A2540"
              strokeWidth="2"
            />
            <path
              d="M325 -20 C295 110 348 210 298 340 C248 460 325 560 282 690 C242 810 315 920 270 1050 C228 1170 302 1290 255 1420 L410 1720 L410 -20 Z"
              fill="#2F7391"
              stroke="#0A2540"
              strokeWidth="2"
            />

            {/* Semenanjung Berlapis Kontur */}
            <path
              d="M-20 -20 L255 -20 C225 110 285 210 228 340 C176 460 258 560 212 690 C170 810 248 920 200 1050 C158 1170 235 1290 185 1420 C148 1530 190 1630 162 1720 L-20 1720 Z"
              fill="#F5E5B8"
              stroke="#0A2540"
              strokeWidth="3"
              filter={`url(#brutal-relief-${jilid})`}
            />
            <path
              d="M-20 -20 L232 -20 C202 110 262 210 205 340 C154 460 235 560 190 690 C148 810 225 920 178 1050 C136 1170 212 1290 162 1420 C126 1530 168 1630 140 1720 L-20 1720 Z"
              fill="#C9DEA3"
              stroke="#0A2540"
              strokeWidth="2.2"
            />
            <path
              d="M-20 -20 L185 -20 C158 110 215 210 160 340 C112 460 190 560 145 690 C105 810 180 920 135 1050 C95 1170 168 1290 120 1420 C88 1530 125 1630 98 1720 L-20 1720 Z"
              fill="#9CC27B"
              stroke="#0A2540"
              strokeWidth="2"
            />
            <path
              d="M-20 -20 L125 -20 C102 110 155 210 105 340 C62 460 132 560 92 690 C55 810 125 920 82 1050 C45 1170 112 1290 68 1420 L-20 1720 Z"
              fill="#75A358"
              stroke="#0A2540"
              strokeWidth="2"
            />

            {/* Sektor Suar Mercusuar */}
            {[
              { x: 222, y: 345, label: "Fl.W.5s 28m" },
              { x: 196, y: 895, label: "Oc.R.8s 34m" },
              { x: 176, y: 1410, label: "Iso.W.4s 22m" },
            ].map((lh, i) => (
              <g
                key={`lighthouse-${i}`}
                transform={`translate(${lh.x} ${lh.y})`}
              >
                <path
                  d="M0 0 L120 -50 A130 130 0 0 1 120 50 Z"
                  fill="#FFE599"
                  opacity="0.45"
                />
                <path
                  d="M92 -38 A100 100 0 0 1 92 38"
                  fill="none"
                  stroke="#0A2540"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                />
                <circle cx="2" cy="2" r="9" fill="#0A2540" />
                <circle
                  cx="0"
                  cy="0"
                  r="9"
                  fill="#FFFDF5"
                  stroke="#0A2540"
                  strokeWidth="2.5"
                />
                <circle cx="0" cy="0" r="4" fill="#EF476F" />
                <text
                  x="16"
                  y="-6"
                  fontSize="8"
                  fontWeight="900"
                  fill="#FFFDF5"
                >
                  {lh.label}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* ============================================================
            JILID 5: PETA GEOLOGI & TOPOGRAFI KALDERA VULKANIK
           ============================================================ */}
        {jilid === 5 && (
          <g>
            <rect width="390" height={height} fill="#24191B" />

            {/* 3 Kawah Kaldera Konsentris */}
            {[
              {
                cx: 195,
                cy: 420,
                rx: 142,
                ry: 74,
                name: "KALDERA MAD WAJIB",
                elev: "2.140m",
              },
              {
                cx: 195,
                cy: 935,
                rx: 150,
                ry: 80,
                name: "KAWAH GHUNNAH",
                elev: "2.560m",
              },
              {
                cx: 195,
                cy: 1440,
                rx: 144,
                ry: 76,
                name: "PUNCAK TARTIL",
                elev: "2.890m",
              },
            ].map((cal, idx) => (
              <g
                key={`caldera-${idx}`}
                transform={`translate(${cal.cx} ${cal.cy})`}
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx={cal.rx}
                  ry={cal.ry}
                  fill="#3D2B2D"
                  stroke="#12090A"
                  strokeWidth="3"
                  filter={`url(#brutal-relief-${jilid})`}
                />
                <ellipse
                  cx="0"
                  cy="0"
                  rx={cal.rx * 0.76}
                  ry={cal.ry * 0.75}
                  fill="#543838"
                  stroke="#FF9F1C"
                  strokeWidth="2"
                  strokeDasharray="7 4"
                />
                <ellipse
                  cx="0"
                  cy="0"
                  rx={cal.rx * 0.5}
                  ry={cal.ry * 0.48}
                  fill="#6E443E"
                  stroke="#12090A"
                  strokeWidth="2.5"
                />
                <ellipse
                  cx="0"
                  cy="0"
                  rx={cal.rx * 0.25}
                  ry={cal.ry * 0.24}
                  fill="#FF6B1A"
                  stroke="#FFE599"
                  strokeWidth="2.5"
                />
                <text
                  x="0"
                  y={cal.ry * 0.65}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="900"
                  fill="#FFE599"
                  letterSpacing="1.6"
                >
                  {cal.name} ({cal.elev})
                </text>
              </g>
            ))}

            {/* Aliran Sungai Magma */}
            <path
              d="M195 420 C125 520 265 625 195 735 C135 825 245 875 195 935 C130 1060 265 1180 195 1440"
              fill="none"
              stroke="#12090A"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M195 420 C125 520 265 625 195 735 C135 825 245 875 195 935 C130 1060 265 1180 195 1440"
              fill="none"
              stroke="#FF6B1A"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M195 420 C125 520 265 625 195 735 C135 825 245 875 195 935 C130 1060 265 1180 195 1440"
              fill="none"
              stroke="#FFE599"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
          </g>
        )}

        {/* ============================================================
            JILID 6: ATLAS DATARAN TINGGI LANGIT & OBSERVATORIUM KHATAM
           ============================================================ */}
        {jilid === 6 && (
          <g>
            <rect width="390" height={height} fill="#171A38" />

            {/* Bintang & Konstelasi */}
            <g fill="#FFD166">
              {Array.from({ length: 34 }, (_, i) => {
                const x = (i * 89 + 23) % 375;
                const y = (i * 137 + 45) % Math.max(height, 1);
                return (
                  <circle
                    key={`star-atlas-${i}`}
                    cx={x}
                    cy={y}
                    r={i % 5 === 0 ? 2.2 : 1.2}
                  />
                );
              })}
            </g>

            {/* Lingkaran Astrolab */}
            <g fill="none" stroke="#433D7A" strokeWidth="2">
              <circle cx="195" cy="530" r="145" strokeDasharray="8 5" />
              <circle cx="195" cy="1080" r="155" strokeDasharray="8 5" />
            </g>

            {/* Punggung Pegunungan Kuarsa Berlapis */}
            {[
              { cy: 390, label: "TERAS IMALAH (+2.200m)" },
              { cy: 775, label: "PUNGGUNG TASHIL (+2.950m)" },
              { cy: 1160, label: "DATARAN SAKTAH (+3.540m)" },
              { cy: 1480, label: "PUNCAK KHATAM (+4.200m)" },
            ].map((ridge, idx) => (
              <g
                key={`celestial-ridge-${idx}`}
                transform={`translate(195 ${ridge.cy})`}
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx="152"
                  ry="72"
                  fill="#252854"
                  stroke="#0B0A1F"
                  strokeWidth="3"
                  filter={`url(#brutal-relief-${jilid})`}
                />
                <ellipse
                  cx="0"
                  cy="-3"
                  rx="114"
                  ry="52"
                  fill="#32366E"
                  stroke="#FFD166"
                  strokeWidth="1.8"
                  strokeDasharray="7 4"
                />
                <ellipse
                  cx="0"
                  cy="-6"
                  rx="72"
                  ry="32"
                  fill="#44498C"
                  stroke="#FFD166"
                  strokeWidth="2.2"
                />
                <text
                  x="0"
                  y="46"
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="900"
                  fill="#FFD166"
                  letterSpacing="1.6"
                >
                  {ridge.label}
                </text>
              </g>
            ))}

            {/* Kubah Observatorium Khatam */}
            <g
              transform="translate(195 1470)"
              stroke="#0B0A1F"
              strokeWidth="2.5"
              strokeLinejoin="round"
            >
              <path d="M-42 28 V-2 H42 V28 Z" fill="#3B3A70" stroke="#FFD166" />
              <path
                d="M-34 -2 Q0 -44 34 -2 Z"
                fill="#7209B7"
                stroke="#FFD166"
              />
              <path
                d="M-12 28 V10 Q0 -4 12 10 V28"
                fill="#171A38"
                stroke="#FFD166"
              />
              <circle cx="0" cy="-50" r="5" fill="#FFD166" />
            </g>
          </g>
        )}

        {/* ============================================================
            OVERLAY KARTOGRAFI ATLAS UNIVERSAL (PURE NEO-BRUTALISM)
           ============================================================ */}
        <rect width="390" height={height} fill={`url(#brutal-dots-${jilid})`} />

        {/* Garis Grid Koordinat (Graticule) */}
        <g
          stroke={theme.gridColor}
          strokeWidth="1"
          strokeDasharray="5 5"
          opacity={theme.isDark ? "0.24" : "0.2"}
        >
          {[78, 195, 312].map((x) => (
            <line key={`lon-${x}`} x1={x} y1={0} x2={x} y2={height} />
          ))}
          {Array.from({ length: horizontalGridCount }, (_, i) => {
            const y = (i + 1) * 140;
            return <line key={`lat-${y}`} x1={0} y1={y} x2={390} y2={y} />;
          })}
        </g>

        {/* Kompas Mawar Neo-Brutalist di Kanan Bawah */}
        <g transform={`translate(330 ${height - 76})`}>
          <circle cx="3" cy="3" r="28" fill={theme.panelShadow} />
          <circle
            cx="0"
            cy="0"
            r="28"
            fill={theme.panel}
            stroke={theme.panelLine}
            strokeWidth="2.5"
          />
          <polygon
            points="0,-20 5.5,0 0,-4 -5.5,0"
            fill={theme.accent}
            stroke={theme.panelLine}
            strokeWidth="1"
          />
          <polygon
            points="0,20 5.5,0 0,4 -5.5,0"
            fill={theme.muted}
            stroke={theme.panelLine}
            strokeWidth="1"
          />
          <text
            x="0"
            y="-20"
            textAnchor="middle"
            fontSize="7"
            fontWeight="900"
            fill={theme.ink}
          >
            U
          </text>
        </g>

        {/* Skala Peta & Legenda Hypsometric Neo-Brutalist di Kiri Bawah */}
        <g transform={`translate(16 ${height - 62})`}>
          <rect
            x="4"
            y="-14"
            width="172"
            height="36"
            rx="8"
            fill={theme.panelShadow}
          />
          <rect
            x="0"
            y="-18"
            width="172"
            height="36"
            rx="8"
            fill={theme.panel}
            stroke={theme.panelLine}
            strokeWidth="2.5"
          />
          <text
            x="8"
            y="-5"
            fontSize="6.5"
            fontWeight="900"
            fill={theme.ink}
            letterSpacing="0.6"
          >
            SKALA {theme.mapScale} · {theme.elevationRange}
          </text>
          <rect x="8" y="1" width="18" height="5" fill={theme.ink} />
          <rect
            x="26"
            y="1"
            width="18"
            height="5"
            fill={theme.panel}
            stroke={theme.ink}
            strokeWidth="1.2"
          />
          <rect x="44" y="1" width="18" height="5" fill={theme.ink} />
          <text x="66" y="6" fontSize="6.5" fontWeight="900" fill={theme.ink}>
            500m
          </text>
          {theme.hypsometricScale.map((color, idx) => (
            <rect
              key={`swatch-${idx}`}
              x={104 + idx * 12}
              y="-1"
              width="11"
              height="7"
              fill={color}
              stroke={theme.panelLine}
              strokeWidth="1"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default function TilawatiMapPage() {
  const navigate = useNavigate();
  const { jilid: jilidParam, hal: halParam } = useParams<{
    jilid: string;
    hal: string;
  }>();

  const jilid = Number(jilidParam) || 1;
  const hal = Number(halParam) || 1;
  const theme = MAP_THEMES[jilid] || MAP_THEMES[1];

  const [isPanduanOpen, setIsPanduanOpen] = useState(false);
  const [energyEmpty, setEnergyEmpty] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const { user } = useAuth();
  const isBypass = isUstadzUser(user) || isTartilaAdmin(user?.role);
  const { currentJilid: progressJilidStr, currentPage } =
    useNgajiCeriaProgress();
  const progressJilidNum =
    parseInt(progressJilidStr.replace("jilid-", ""), 10) || 1;

  const consumeHeart = useEconomyStore((s: any) => s.consumeHeart);
  const tilaGender = useEconomyStore((s) => s.tilaGender);
  const stars = useNgajiCeriaStore((s) => s.stars);
  const totalStars = Object.values(stars).reduce(
    (sum, value) => sum + (value || 0),
    0,
  );
  const [selectedNode, setSelectedNode] = useState<MapNodeItemWithMeta | null>(
    null,
  );
  const guideButtonRef = useRef<HTMLButtonElement>(null);

  const [bubbleState, setBubbleState] = useState<{
    visible: boolean;
    shownOnPage: string | null;
  }>({ visible: false, shownOnPage: null });

  const pageKey = `${jilid}-${hal}`;
  const currentPages = TILAWATI_MAP_PAGES[jilid] || TILAWATI_MAP_PAGES[1];
  const activePage =
    jilid === progressJilidNum
      ? Math.min(currentPage, currentPages.length)
      : jilid < progressJilidNum
        ? currentPages.length
        : 1;
  const progressPercent = Math.round((activePage / currentPages.length) * 100);
  const totalHeight = TOP_PADDING + currentPages.length * ITEM_HEIGHT + 130;

  const nodePositions = currentPages.map((_, index) => ({
    xPct: (MAP_NODE_X[jilid] || MAP_NODE_X[1])[index % 7],
    yPx: TOP_PADDING + index * ITEM_HEIGHT,
  }));

  const fullPathD = nodePositions.reduce((path, point, index) => {
    if (index === 0) return `M ${point.xPct} ${point.yPx}`;
    const previous = nodePositions[index - 1];
    const midY = (previous.yPx + point.yPx) / 2;
    return `${path} C ${previous.xPct} ${midY}, ${point.xPct} ${midY}, ${point.xPct} ${point.yPx}`;
  }, "");

  const completedPositions = nodePositions.slice(0, Math.max(activePage, 1));
  const completedPathD = completedPositions.reduce((path, point, index) => {
    if (index === 0) return `M ${point.xPct} ${point.yPx}`;
    const previous = completedPositions[index - 1];
    const midY = (previous.yPx + point.yPx) / 2;
    return `${path} C ${previous.xPct} ${midY}, ${point.xPct} ${midY}, ${point.xPct} ${point.yPx}`;
  }, "");

  const handleOpenPanduan = () => {
    triggerBibiReaction("click");
    setIsPanduanOpen(true);
  };

  const handleNodeClick = (nodeData: MapNodeItemWithMeta) => {
    if (!nodeData.unlocked) return;
    triggerBibiReaction("click");
    setSelectedNode(nodeData);
  };

  const handleStartLearning = async (practiceOverride?: boolean) => {
    if (!selectedNode) return;
    const isPractice =
      practiceOverride !== undefined ? practiceOverride : isPracticeMode;

    if (!isPractice) {
      const success = await consumeHeart();
      if (!success) {
        setSelectedNode(null);
        setEnergyEmpty(true);
        return;
      }
    }

    triggerBibiReaction("play");
    const targetNode = selectedNode;
    try {
      setSelectedNode(null);
      navigate(
        `/member/ngaji-ceria/quiz/play?jilid=${targetNode.jilid}&hal=${targetNode.page}${
          isPractice ? "&practice=true" : ""
        }`,
      );
    } catch {
      setSelectedNode(targetNode);
    }
  };

  return (
    <NgajiCeriaLayout
      title={`Tilawati ${jilid}`}
      hideHeader={true}
      themeScope="tilawati"
      pageTip={{
        jilid,
        hal,
        onOpenGuide: () => setIsPanduanOpen(true),
        onTipStateChange: (state) =>
          setBubbleState({
            visible: state.visible,
            shownOnPage: state.hasAppeared ? pageKey : null,
          }),
        guideButtonRef,
      }}
    >
      <ExploreHeader
        themeScope="tilawati"
        themeColorClass={theme.headerBgClass}
        borderColorClass={theme.headerBorderClass}
        shadowClass={theme.headerShadowClass}
        textColorClass={theme.headerTextClass}
        onBack={() => navigate("/member/ngaji-ceria/explore/tilawati")}
        backAriaLabel="Kembali ke Daftar Jilid"
        backClass={theme.headerBackClass}
        backContent={
          <div className="flex items-center gap-1.5 text-xs font-black sm:text-sm">
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Atlas Jilid</span>
          </div>
        }
        title={
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-xl border-[2.5px] px-2.5 py-1 text-xs font-black"
              style={{
                backgroundColor: theme.panel,
                borderColor: theme.panelLine,
                color: theme.ink,
                boxShadow: `3px 3px 0px ${theme.panelShadow}`,
              }}
            >
              <Sparkles size={12} style={{ color: theme.accent }} /> JILID{" "}
              {jilid}
            </span>
          </div>
        }
        extraBadge={
          <ExploreStatBadge
            icon={
              <JuicyStar
                size={18}
                className="shrink-0 fill-[#F5B942] text-[#F5B942]"
              />
            }
            value={`${totalStars}/93`}
            title={`Total Bintang: ${totalStars}/93`}
          />
        }
      />

      <main
        data-tip-visible={bubbleState.visible ? "true" : "false"}
        data-tip-page={bubbleState.shownOnPage ?? ""}
        className="relative m-2.5 min-h-full overflow-hidden rounded-[26px] border-[4px] pb-24"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.frame,
          boxShadow: `6px 6px 0px ${theme.panelShadow}`,
        }}
      >
        <RegionMapArtwork jilid={jilid} height={totalHeight} />

        {/* CARTOUCHE IDENTITAS WILAYAH (100% Pure Neo-Brutalism Box) */}
        <div className="absolute left-3 right-3 top-3 z-30 mx-auto max-w-md sm:left-4 sm:right-4">
          <div
            className="relative overflow-hidden rounded-2xl border-[3px] p-3.5 sm:p-4"
            style={{
              backgroundColor: theme.panel,
              borderColor: theme.panelLine,
              boxShadow: `5px 5px 0px ${theme.panelShadow}`,
            }}
          >
            {/* Header Metadata & Hypsometric Swatch */}
            <div
              className="mb-2.5 flex items-center justify-between gap-2 border-b-[2px] pb-2"
              style={{ borderColor: theme.panelLine }}
            >
              <div
                className="flex flex-wrap items-center gap-1.5 text-[9px] font-black uppercase tracking-[.12em] sm:text-[10px]"
                style={{ color: theme.ink }}
              >
                <span>{theme.regionKicker}</span>
                <span>•</span>
                <span className="font-mono">{theme.coordinate}</span>
              </div>
              <div
                className="flex items-center border-[1.5px]"
                style={{ borderColor: theme.panelLine }}
                title={`Rentang Elevasi: ${theme.elevationRange}`}
              >
                {theme.hypsometricScale.map((hex, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-3 border-r last:border-r-0"
                    style={{
                      backgroundColor: hex,
                      borderColor: theme.panelLine,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[2.5px] text-2xl sm:h-14 sm:w-14 sm:text-3xl"
                style={{
                  backgroundColor: theme.accentSoft,
                  borderColor: theme.panelLine,
                  boxShadow: `3px 3px 0px ${theme.panelShadow}`,
                }}
              >
                <span>{theme.symbol}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h1
                    className="font-display text-[17px] font-black uppercase leading-tight tracking-tight sm:text-xl"
                    style={{ color: theme.ink }}
                  >
                    {theme.regionName}
                  </h1>
                  <span
                    className="shrink-0 rounded-md border-[2px] px-1.5 py-0.5 font-mono text-[8.5px] font-black"
                    style={{
                      backgroundColor: theme.accentSoft,
                      borderColor: theme.panelLine,
                      color: theme.ink,
                      boxShadow: `2px 2px 0px ${theme.panelShadow}`,
                    }}
                  >
                    {theme.elevationRange}
                  </span>
                </div>
                <p
                  className="mt-1 line-clamp-2 text-[10.5px] font-bold leading-snug sm:text-xs"
                  style={{ color: theme.muted }}
                >
                  {theme.tagline}
                </p>
              </div>
            </div>

            {/* Neo-Brutalist Progress Bar */}
            <div className="relative mt-3 flex items-center gap-2.5">
              <div
                className="h-3 flex-1 overflow-hidden rounded-lg border-[2px]"
                style={{
                  backgroundColor: theme.isDark ? "#12090A" : "#E2E8F0",
                  borderColor: theme.panelLine,
                }}
              >
                <div
                  className="h-full border-r-[2px] transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: theme.accent,
                    borderColor: theme.panelLine,
                  }}
                />
              </div>
              <span
                className="shrink-0 rounded-md border-[2px] px-2 py-0.5 font-mono text-[9px] font-black tabular-nums sm:text-[10px]"
                style={{
                  backgroundColor: theme.accentSoft,
                  borderColor: theme.panelLine,
                  color: theme.ink,
                }}
              >
                {activePage}/{currentPages.length} POS
              </span>
            </div>
          </div>
        </div>

        {/* TOMBOL KONTROL PETA (Pure Neo-Brutalism Buttons) */}
        <div className="absolute left-4 right-4 top-[168px] z-40 mx-auto flex max-w-md items-center justify-between gap-2 sm:top-[176px]">
          <div
            className="hidden items-center gap-1.5 rounded-xl border-[2.5px] px-2.5 py-1.5 font-mono text-[9.5px] font-black sm:inline-flex"
            style={{
              backgroundColor: theme.panel,
              borderColor: theme.panelLine,
              color: theme.ink,
              boxShadow: `3px 3px 0px ${theme.panelShadow}`,
            }}
          >
            <span>TERRAIN</span>
            <span>•</span>
            <span>{theme.mapScale}</span>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <button
              type="button"
              aria-pressed={isPracticeMode}
              onClick={() => setIsPracticeMode((value) => !value)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border-[2.5px] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:text-xs"
              style={{
                backgroundColor: isPracticeMode ? theme.node : theme.buttonBg,
                borderColor: theme.buttonLine,
                color: isPracticeMode ? "#FFFFFF" : theme.buttonText,
                boxShadow: `3px 3px 0px ${theme.nodeShadow}`,
              }}
            >
              <Compass size={15} />
              {isPracticeMode ? "Latihan Aktif" : "Mode Latihan"}
            </button>
            <button
              type="button"
              ref={guideButtonRef}
              onClick={handleOpenPanduan}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border-[2.5px] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:text-xs"
              style={{
                backgroundColor: theme.accentSoft,
                borderColor: theme.buttonLine,
                color: theme.buttonText,
                boxShadow: `3px 3px 0px ${theme.nodeShadow}`,
              }}
            >
              <BookOpen size={15} /> Panduan
            </button>
          </div>
        </div>

        {/* RUTE NAVIGASI & PIN POS PELAJARAN */}
        <div
          className="relative z-10 mx-auto w-full max-w-md"
          style={{ height: totalHeight }}
        >
          <svg
            className="pointer-events-none absolute left-0 top-0 z-0"
            width="100%"
            height={totalHeight}
            viewBox={`0 0 100 ${totalHeight}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Casing Luar Hitam/Gelap */}
            <path
              d={fullPathD}
              stroke={theme.panelShadow}
              strokeWidth="12"
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
            {/* Casing Dalam Terang */}
            <path
              d={fullPathD}
              stroke={theme.pathHalo}
              strokeWidth="8"
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
            {/* Jalur Belum Diselesaikan */}
            <path
              d={fullPathD}
              stroke={theme.path}
              strokeWidth="3.5"
              strokeDasharray="6 6"
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
            {/* Jalur Aktif / Selesai */}
            {completedPositions.length > 1 && (
              <path
                d={completedPathD}
                stroke={theme.pathDone}
                strokeWidth="5"
                fill="none"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
            )}
          </svg>

          {currentPages.map((item, index) => {
            const position = nodePositions[index];
            const isUnlocked =
              isBypass ||
              item.page === 1 ||
              (stars[`jilid-${jilid}-hal-${item.page - 1}`] || 0) === 3;
            const nodeStars = isUnlocked
              ? stars[`jilid-${jilid}-hal-${item.page}`] || 0
              : 0;
            const isCurrentNode = item.page === activePage;
            const alignFromRight = position.xPct > 55;
            const nodeData: MapNodeItemWithMeta = {
              ...item,
              jilid,
              unlocked: isUnlocked,
              stars: nodeStars,
            };

            return (
              <div
                key={item.page}
                className="absolute z-20"
                style={{
                  left: `${position.xPct}%`,
                  top: `${position.yPx}px`,
                  transform: alignFromRight
                    ? "translate(-100%, -50%)"
                    : "translate(0, -50%)",
                }}
              >
                {/* Lencana Avatar Posisi Aktif (Neo-Brutalist Badge) */}
                {isCurrentNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.85 }}
                    animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
                    transition={{
                      y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                      scale: { type: "spring", stiffness: 260, damping: 18 },
                    }}
                    className={`pointer-events-none absolute -top-[54px] z-30 flex flex-col items-center ${
                      alignFromRight ? "right-0" : "left-0"
                    }`}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-[2.5px] bg-white"
                      style={{
                        borderColor: theme.panelLine,
                        boxShadow: `3px 3px 0px ${theme.panelShadow}`,
                      }}
                    >
                      <AvatarSantriSvg
                        size={34}
                        gender={resolveMascotGender(tilaGender)}
                        mood="happy"
                        className="mt-1 shrink-0 scale-110"
                      />
                    </div>
                    <span
                      className="mt-1 whitespace-nowrap rounded-md border-[2px] px-1.5 py-0.5 text-[7.5px] font-black uppercase tracking-wider"
                      style={{
                        backgroundColor: theme.accent,
                        borderColor: theme.panelLine,
                        color: "#09303D",
                        boxShadow: `2px 2px 0px ${theme.panelShadow}`,
                      }}
                    >
                      POSISI KAMU
                    </span>
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={() => handleNodeClick(nodeData)}
                  disabled={!isUnlocked}
                  aria-label={`${item.title}${isUnlocked ? ", buka halaman" : ", terkunci"}`}
                  title={item.title}
                  className={`group flex items-center gap-2 rounded-xl text-left transition-transform duration-150 focus-visible:outline-none disabled:cursor-not-allowed ${
                    alignFromRight ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Pin Geografis dengan Hard Vector Shadow */}
                  <span
                    className="relative block h-[46px] w-[36px] shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-active:translate-x-[2px] group-active:translate-y-[2px]"
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 38 48"
                      className="h-full w-full overflow-visible"
                    >
                      {/* Cincin Target Survei di Tanah */}
                      <ellipse
                        cx="18"
                        cy="43"
                        rx="12"
                        ry="4.5"
                        fill={isCurrentNode ? theme.accent : theme.panelShadow}
                        stroke={theme.panelLine}
                        strokeWidth="1.8"
                      />

                      {/* Hard Offset Shadow Pin (Zero Blur) */}
                      <path
                        d="M21 5C12.7 5 6 11.6 6 19.8C6 29.8 21 44.5 21 44.5C21 44.5 36 29.8 36 19.8C36 11.6 29.3 5 21 5Z"
                        fill={theme.nodeShadow}
                      />

                      {/* Badan Utama Pin Peta */}
                      <path
                        d="M18 2C9.7 2 3 8.6 3 16.8C3 26.8 18 41.5 18 41.5C18 41.5 33 26.8 33 16.8C33 8.6 26.3 2 18 2Z"
                        fill={isUnlocked ? theme.node : theme.lockedNode}
                        stroke={isUnlocked ? theme.nodeLine : theme.lockedLine}
                        strokeWidth="2.6"
                      />

                      {/* Lingkaran Dalam Pin */}
                      <circle
                        cx="18"
                        cy="16.5"
                        r="10"
                        fill={isUnlocked ? theme.panel : "#CBD5E1"}
                        stroke={isUnlocked ? theme.nodeLine : theme.lockedLine}
                        strokeWidth="2.2"
                      />

                      {isUnlocked ? (
                        <text
                          x="18"
                          y="20.4"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="900"
                          fill={theme.ink}
                        >
                          {item.page}
                        </text>
                      ) : (
                        <g
                          transform="translate(12.5 11.2) scale(.46)"
                          fill="none"
                          stroke="#1E293B"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="8" width="13" height="11" rx="2" />
                          <path d="M5 8V5.5a3.5 3.5 0 0 1 7 0V8" />
                        </g>
                      )}

                      {isCurrentNode && (
                        <circle
                          cx="28"
                          cy="7"
                          r="4.5"
                          fill={theme.accent}
                          stroke={theme.panelLine}
                          strokeWidth="2"
                        />
                      )}
                    </svg>
                  </span>

                  {/* Kartu POI Neo-Brutalist (Zero Blur, Solid Offset Shadow, Divided Header) */}
                  <span
                    className="flex w-[132px] flex-col overflow-hidden rounded-xl border-[2.5px] transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-[2px] group-active:translate-y-[2px] sm:w-[144px]"
                    style={{
                      backgroundColor: isUnlocked ? theme.labelBg : "#E2E8F0",
                      borderColor: theme.labelLine,
                      color: isUnlocked ? theme.ink : "#334155",
                      boxShadow: isCurrentNode
                        ? `4px 4px 0px ${theme.accent}`
                        : `4px 4px 0px ${theme.nodeShadow}`,
                    }}
                  >
                    {/* Header Strip Kartu POI */}
                    <span
                      className="flex items-center justify-between gap-1 border-b-[2px] px-2 py-1 text-[8px] font-black uppercase tracking-wider"
                      style={{
                        backgroundColor: isUnlocked
                          ? isCurrentNode
                            ? theme.accent
                            : theme.labelHeaderBg
                          : "#CBD5E1",
                        borderColor: theme.labelLine,
                        color:
                          isUnlocked && isCurrentNode
                            ? "#09303D"
                            : isUnlocked
                              ? theme.ink
                              : "#334155",
                      }}
                    >
                      <span>POS {String(item.page).padStart(2, "0")}</span>
                      <span className="flex items-center gap-[1.5px]">
                        {[1, 2, 3].map((starIndex) => (
                          <Star
                            key={starIndex}
                            size={9}
                            className={
                              isUnlocked && starIndex <= nodeStars
                                ? "fill-[#FF9F1C] text-[#09303D]"
                                : "fill-black/15 text-black/40"
                            }
                          />
                        ))}
                      </span>
                    </span>

                    {/* Body Kartu POI */}
                    <span className="flex flex-col px-2.5 py-1.5">
                      <span className="line-clamp-1 text-[9.5px] font-black leading-tight sm:text-[10.5px]">
                        {item.title}
                      </span>
                      <span
                        dir="rtl"
                        className="mt-1 line-clamp-1 font-arabic text-[11px] font-bold leading-none"
                        style={{
                          color: isUnlocked ? theme.accent : "#64748B",
                        }}
                      >
                        {item.arabic}
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <AppBottomSheet
          isOpen={Boolean(selectedNode)}
          onClose={() => setSelectedNode(null)}
          title={selectedNode?.title ?? ""}
          style={{
            backgroundColor: theme.panel,
            borderColor: theme.panelLine,
            color: theme.ink,
            boxShadow: `0px -4px 0px ${theme.panelShadow}`,
          }}
          titleStyle={{
            color: theme.ink,
          }}
          handleStyle={{
            backgroundColor: theme.panelLine,
          }}
        >
          {selectedNode && (
            <div className="flex flex-col">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className="rounded-xl border-[2.5px] px-3 py-1 text-xs font-black uppercase"
                  style={{
                    backgroundColor: theme.accentSoft,
                    borderColor: theme.panelLine,
                    color: theme.ink,
                    boxShadow: `3px 3px 0px ${theme.panelShadow}`,
                  }}
                >
                  Jilid {selectedNode.jilid} · Pos {selectedNode.page}
                </span>
                <span
                  className="rounded-lg border-[2px] px-2 py-1 font-mono text-[9px] font-black uppercase"
                  style={{
                    backgroundColor: theme.labelHeaderBg,
                    borderColor: theme.panelLine,
                    color: theme.ink,
                  }}
                >
                  {theme.coordinate}
                </span>
              </div>

              <div
                className="mb-4 flex min-h-[116px] w-full items-center justify-center rounded-2xl border-[2.5px] px-3 py-6"
                style={{
                  backgroundColor: theme.labelHeaderBg,
                  borderColor: theme.panelLine,
                  boxShadow: `4px 4px 0px ${theme.panelShadow}`,
                }}
              >
                <span
                  dir="rtl"
                  className="font-arabic text-center text-4xl font-bold leading-relaxed"
                  style={{ color: theme.ink }}
                >
                  {selectedNode.arabic}
                </span>
              </div>

              <div className="mb-4 text-center">
                <p
                  className="text-base font-black uppercase"
                  style={{ color: theme.ink }}
                >
                  {selectedNode.title}
                </p>
                <p
                  className="mt-1 text-xs font-bold leading-relaxed"
                  style={{ color: theme.muted }}
                >
                  {selectedNode.desc}
                </p>
              </div>

              <div className="mb-5 flex justify-center gap-2.5">
                {[1, 2, 3].map((starIndex) => (
                  <div
                    key={starIndex}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-[2.5px]"
                    style={{
                      backgroundColor:
                        starIndex <= selectedNode.stars
                          ? "#FFE599"
                          : theme.labelHeaderBg,
                      borderColor: theme.panelLine,
                      boxShadow: `2px 2px 0px ${theme.panelShadow}`,
                    }}
                  >
                    <Star
                      size={22}
                      className={
                        starIndex <= selectedNode.stars
                          ? "fill-[#FF9F1C] text-[#09303D]"
                          : "fill-black/15 text-black/30"
                      }
                    />
                  </div>
                ))}
              </div>

              <div
                className="mb-4 flex items-center justify-center gap-3 rounded-xl border-[2.5px] px-3 py-2.5"
                style={{
                  backgroundColor: theme.labelHeaderBg,
                  borderColor: theme.panelLine,
                  boxShadow: `3px 3px 0px ${theme.panelShadow}`,
                }}
              >
                <div
                  className="flex items-center gap-1.5 text-[11px] font-black uppercase"
                  style={{ color: theme.ink }}
                >
                  <Star size={14} className="fill-[#FF9F1C] text-[#09303D]" />
                  {isPracticeMode ? "0 Poin · Latihan" : "+30 Poin"}
                </div>
                <div
                  className="h-4 w-[2px]"
                  style={{ backgroundColor: theme.panelLine }}
                />
                <div
                  className="flex items-center gap-1.5 text-[11px] font-black uppercase"
                  style={{ color: theme.ink }}
                >
                  <BookOpen size={14} /> Tilawati {selectedNode.jilid}
                </div>
              </div>

              <div
                className="mb-5 flex items-center justify-between gap-3 rounded-xl border-[2.5px] p-3"
                style={{
                  backgroundColor: theme.accentSoft,
                  borderColor: theme.panelLine,
                  color: theme.ink,
                  boxShadow: `3px 3px 0px ${theme.panelShadow}`,
                }}
              >
                <div className="text-left">
                  <p className="flex items-center gap-1.5 text-xs font-black uppercase">
                    <Compass size={15} /> Mode Latihan
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold">
                    Bebas tanpa nyawa dan tanpa perolehan bintang
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPracticeMode}
                  aria-label="Aktifkan mode latihan"
                  onClick={() => setIsPracticeMode((value) => !value)}
                  className="flex h-8 w-14 shrink-0 items-center rounded-lg border-[2.5px] p-1 transition-colors"
                  style={{
                    justifyContent: isPracticeMode ? "flex-end" : "flex-start",
                    backgroundColor: isPracticeMode ? theme.node : "#CBD5E1",
                    borderColor: theme.panelLine,
                    boxShadow: `2px 2px 0px ${theme.panelShadow}`,
                  }}
                >
                  <span
                    className="h-5 w-5 rounded border-[2px] bg-white"
                    style={{ borderColor: theme.panelLine }}
                  />
                </button>
              </div>

              <StickerButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => handleStartLearning(isPracticeMode)}
                className="rounded-xl border-[3px] font-black uppercase tracking-wider transition-transform active:translate-x-[2px] active:translate-y-[2px]"
                style={{
                  backgroundColor: isPracticeMode ? theme.node : theme.accent,
                  borderColor: theme.panelLine,
                  color: isPracticeMode ? "#FFFFFF" : "#09303D",
                  boxShadow: `4px 4px 0px ${theme.panelShadow}`,
                }}
              >
                {isPracticeMode
                  ? "Mulai Latihan · Bebas Nyawa"
                  : "Mulai Belajar · 1 Hati"}{" "}
                <Play size={16} className="fill-current" />
              </StickerButton>
            </div>
          )}
        </AppBottomSheet>

        <PanduanMembacaModal
          open={isPanduanOpen}
          onClose={() => setIsPanduanOpen(false)}
        />

        <OutOfEnergyModal
          visible={energyEmpty}
          type="heart"
          onClose={() => setEnergyEmpty(false)}
        />
      </main>
    </NgajiCeriaLayout>
  );
}
