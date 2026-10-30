import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Check,
  Lock,
  Coins,
  Glasses,
  Store,
  User,
  Crown,
  RefreshCw,
  Sun,
  Zap,
  Heart,
  HandsPraying,
  Star,
  Moon,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Music,
  Eye,
  Fire,
  Home,
  HairbowSvg,
} from "@/components/ui/CustomIcons";
import { StickerButton } from "@/components/ui/StickerButton";
import {
  useEconomyStore,
  isUnlimitedUser,
  type TilaGender,
} from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
import { SKIN_ITEMS } from "../data/shopData";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import {
  TilaMascot,
  type TilaAccessoryType,
  type TilaDirection,
  type TilaMood,
  type TilaAnimation,
  type TilaHoldItem,
} from "@/components/ui/TilaMascot";
import { triggerTilaReaction } from "@/utils/tilaEvent";
import { getProgress, subscribeProgress } from "./games/_shared/progression";
import { getMascotName } from "@/utils/mascotHelper";

function useCoinsBalance(): number {
  const [coins, setCoins] = useState(() => getProgress().coins);
  useEffect(() => subscribeProgress(() => setCoins(getProgress().coins)), []);
  return coins;
}

export type AccessoryCategory = "all" | "boy" | "girl";

interface AccessoryConfig {
  id: TilaAccessoryType;
  name: string;
  desc: string;
  category: AccessoryCategory;
  image?: string;
  iconComponent?: React.ComponentType<{ size?: number; className?: string }>;
  price: number;
}

const ACCESSORIES: AccessoryConfig[] = [
  {
    id: "none",
    name: "Polos Alami",
    desc: "Tampilan asli yang menggemaskan dan ceria.",
    category: "all",
    iconComponent: Sparkles,
    price: 0,
  },
  {
    id: "peci",
    name: "Sacred Cap",
    desc: "Songkok hitam berhias sulam emas khas santri berjiwa luhur.",
    category: "boy",
    image: NGAJI_CERIA_ASSETS.peci,
    price: 200,
  },
  {
    id: "hairbow",
    name: "Grace Ribbon",
    desc: "Pita cantik berwarna merah muda yang manis dan anggun.",
    category: "girl",
    iconComponent: HairbowSvg,
    price: 200,
  },
  {
    id: "flowercrown",
    name: "Floral Crown",
    desc: "Karangan bunga aneka warna yang segar, ceria, dan mempesona.",
    category: "girl",
    iconComponent: Crown,
    price: 300,
  },
  {
    id: "glasses",
    name: "Smart Glasses",
    desc: "Kacamata bulat stylish pembawa semangat belajar tekun.",
    category: "all",
    iconComponent: Glasses,
    price: 500,
  },
  {
    id: "crown",
    name: "Champion's Crown",
    desc: "Mahkota emas gemerlap tanda santri istiqomah berprestasi.",
    category: "all",
    image: NGAJI_CERIA_ASSETS.mahkotaVip,
    price: 1000,
  },
];

interface ExpressionOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  mood: TilaMood;
  animation: TilaAnimation;
  holdItem?: TilaHoldItem;
  speech: string;
}

const EXPRESSION_OPTIONS: ExpressionOption[] = [
  {
    id: "normal",
    label: "Normal",
    icon: Sparkles,
    iconColor: "text-[#0D9488]",
    mood: "happy",
    animation: "float",
    speech: "Halo! Aku siap belajar bareng kamu!",
  },
  {
    id: "love",
    label: "Jatuh Cinta",
    icon: Heart,
    iconColor: "text-[#EC4899]",
    mood: "love",
    animation: "float",
    speech: "Aku sayang kamu karena Allah!",
  },
  {
    id: "angry",
    label: "Marah",
    icon: Fire,
    iconColor: "text-[#EF4444]",
    mood: "angry",
    animation: "bounce",
    speech: "Awas ya, jangan diulangi!",
  },
  {
    id: "crying",
    label: "Menangis",
    icon: Moon,
    iconColor: "text-[#3B82F6]",
    mood: "crying",
    animation: "float",
    speech: "Huhuhu... jangan pergi dong...",
  },
  {
    id: "dizzy",
    label: "Pusing",
    icon: RefreshCw,
    iconColor: "text-[#8B5CF6]",
    mood: "dizzy",
    animation: "float",
    speech: "Aduh, kepalaku pusing berputar...",
  },
  {
    id: "winking",
    label: "Kedip",
    icon: Eye,
    iconColor: "text-[#F59E0B]",
    mood: "winking",
    animation: "float",
    speech: "Ciee, siapa yang lagi diliatin?",
  },
  {
    id: "praying",
    label: "Berdoa",
    icon: HandsPraying,
    iconColor: "text-[#0D9488]",
    mood: "praying",
    animation: "float",
    speech: "Ya Allah, berikanlah keberkahan pada ilmu kami.",
  },
  {
    id: "reading",
    label: "Membaca",
    icon: BookOpen,
    iconColor: "text-[#3B82F6]",
    mood: "reading",
    animation: "float",
    speech: "Aku sedang membaca Iqro, ayo belajar bareng!",
  },
  {
    id: "starry",
    label: "Kagum",
    icon: Star,
    iconColor: "text-[#EAB308]",
    mood: "starry",
    animation: "float",
    speech: "Wahh, indah sekali! Aku suka!",
  },
  {
    id: "proud",
    label: "Keren",
    icon: Glasses,
    iconColor: "text-[#111827]",
    mood: "proud",
    animation: "float",
    speech: "Hah, aku memang paling keren.",
  },
  {
    id: "confused",
    label: "Bingung",
    icon: HelpCircle,
    iconColor: "text-[#F59E0B]",
    mood: "confused",
    animation: "float",
    speech: "Hmm, maksudnya apa ya?",
  },
  {
    id: "laughing",
    label: "Tertawa",
    icon: Sun,
    iconColor: "text-[#F59E0B]",
    mood: "laughing",
    animation: "float",
    speech: "Hahaha! Senang sekali hari ini!",
  },
  {
    id: "shocked",
    label: "Kaget",
    icon: Zap,
    iconColor: "text-[#E11D48]",
    mood: "shocked",
    animation: "bounce",
    speech: "Wah kaget! Apa itu tadi?!",
  },
  {
    id: "shy",
    label: "Malu",
    icon: Heart,
    iconColor: "text-[#EC4899]",
    mood: "shy",
    animation: "float",
    speech: "Aduh malu dilihatin terus...",
  },
  {
    id: "greeting",
    label: "Menyapa",
    icon: HandsPraying,
    iconColor: "text-[#0D9488]",
    mood: "greeting",
    animation: "float",
    speech: "Halo sahabat Tartila! Selamat belajar ya!",
  },
  {
    id: "holding",
    label: "Bintang",
    icon: Star,
    iconColor: "text-[#EAB308]",
    mood: "holding",
    animation: "float",
    holdItem: "star",
    speech: "Ini bintang prestasiku untukmu!",
  },
  {
    id: "sleeping",
    label: "Tidur",
    icon: Moon,
    iconColor: "text-[#6366F1]",
    mood: "sleeping",
    animation: "none",
    speech: "Zzz... istirahat dulu sebentar...",
  },
  {
    id: "spinning",
    label: "Berputar",
    icon: RefreshCw,
    iconColor: "text-[#0D9488]",
    mood: "happy",
    animation: "spinning",
    speech: "Wush! Aku berputar 360 derajat!",
  },
  {
    id: "rolling",
    label: "Menggelinding",
    icon: RefreshCw,
    iconColor: "text-[#F59E0B]",
    mood: "happy",
    animation: "rolling",
    speech: "Weee, aku menggelinding!",
  },
  {
    id: "peckRight",
    label: "Mematuk Kanan",
    icon: ChevronRight,
    iconColor: "text-[#0D9488]",
    mood: "happy",
    animation: "peckRight",
    speech: "Tuk tuk tuk! Cari makan dulu ah.",
  },
  {
    id: "peckLeft",
    label: "Mematuk Kiri",
    icon: ChevronLeft,
    iconColor: "text-[#0D9488]",
    mood: "happy",
    animation: "peckLeft",
    speech: "Tuk tuk tuk! Enak juga biji-bijian ini.",
  },
  {
    id: "salute",
    label: "Hormat",
    icon: Check,
    iconColor: "text-[#0D9488]",
    mood: "happy",
    animation: "salute",
    speech: "Siap laksanakan, komandan!",
  },
  {
    id: "cheer",
    label: "Sorak",
    icon: Sparkles,
    iconColor: "text-[#F59E0B]",
    mood: "laughing",
    animation: "cheer",
    speech: "Horeee! Aku senang sekali!",
  },
  {
    id: "singing",
    label: "Bersenandung",
    icon: Music,
    iconColor: "text-[#8B5CF6]",
    mood: "happy",
    animation: "singing",
    speech: "Lalala~ Alif ba ta tsa...",
  },
  {
    id: "peek",
    label: "Mengintip",
    icon: Eye,
    iconColor: "text-[#0D9488]",
    mood: "shy",
    animation: "peek",
    speech: "Pssst, ada apa ya di sana?",
  },
  {
    id: "shiver",
    label: "Menggigil",
    icon: Zap,
    iconColor: "text-[#3B82F6]",
    mood: "sad",
    animation: "shiver",
    speech: "Duh, dingin sekali... brrr!",
  },
];

const TAP_REACTIONS: Array<{
  mood: TilaMood;
  animation: TilaAnimation;
  speeches: string[];
}> = [
  {
    mood: "laughing",
    animation: "bounce",
    speeches: [
      "Hahaha geli!",
      "Hihihi jangan digelitikin!",
      "Hahaha kamu lucu banget!",
    ],
  },
  {
    mood: "shocked",
    animation: "bounce",
    speeches: ["Eh, kaget aku!", "Wah, ada apa?!", "Astaghfirullah, terkejut!"],
  },
  {
    mood: "shy",
    animation: "float",
    speeches: [
      "Ih malu diliatin terus...",
      "Aku jadi tersipu nih!",
      "Kamu baik banget deh...",
    ],
  },
  {
    mood: "greeting",
    animation: "float",
    speeches: [
      "Hai hai! Semangat belajarnya ya!",
      "Assalamu'alaikum sahabat!",
      "Ayo lanjut murojaah bareng!",
    ],
  },
  {
    mood: "starry",
    animation: "float",
    speeches: [
      "Wahh keren banget!",
      "Aku suka sekali!",
      "Masya Allah, indahnya!",
    ],
  },
];

type RoomThemeId = "default" | "galaksi" | "hutan" | "istana";

const ROOM_THEMES_CONFIG = [
  {
    id: "default",
    name: "Kamar Klasik",
    desc: "Kamar hangat khas Tartila",
    price: 0,
    swatch: "#F0FDF4",
    wallPreview: "bg-[#DBEAFE]",
    floorPreview: "bg-[#CCFBF1]",
  },
  {
    id: "galaksi",
    name: "Galaksi Bima Sakti",
    desc: "Planet & bintang berkilau",
    price: 500,
    swatch: "#1E1B4B",
    wallPreview: "bg-[#1E1B4B]",
    floorPreview: "bg-[#312E81]",
  },
  {
    id: "hutan",
    name: "Hutan Rimba",
    desc: "Pohon & rumput menjuntai",
    price: 500,
    swatch: "#166534",
    wallPreview: "bg-[#DCFCE7]",
    floorPreview: "bg-[#BBF7D0]",
  },
  {
    id: "istana",
    name: "Istana Pasir",
    desc: "Kastil mini & karpet merah",
    price: 800,
    swatch: "#E7C59E",
    wallPreview: "bg-[#FEF3C7]",
    floorPreview: "bg-[#E7C59E]",
  },
];

function RoomDecor({
  gender,
  themeId,
  time,
}: {
  gender: TilaGender;
  themeId: string;
  time: Date;
}) {
  console.log("RoomDecor themeId:", themeId);
  const isGirl = gender === "girl";
  const normalizedId =
    themeId === "theme_space" || themeId === "space"
      ? "galaksi"
      : themeId === "theme_default" ||
          themeId === "classic" ||
          themeId === "theme_classic"
        ? "default"
        : themeId === "theme_forest"
          ? "hutan"
          : themeId === "theme_castle"
            ? "istana"
            : themeId;
  const theme: RoomThemeId = (
    ["default", "galaksi", "hutan", "istana"].includes(normalizedId)
      ? normalizedId
      : "default"
  ) as RoomThemeId;

  // FASE 2: Jam Real-Time & Siklus Siang/Malam
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const isDay = hours >= 6 && hours < 18;
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  // Warna dasar sesuai tema (tetap neo-brutalism dengan garis tebal #134E4A)
  let wallColor = isGirl ? "bg-[#FCE7F3]" : "bg-[#DBEAFE]";
  let floorColor = isGirl ? "bg-[#FBCFE8]" : "bg-[#CCFBF1]";
  let rugColor = isGirl ? "bg-[#FF6B6B]" : "bg-[#0D9488]";
  let rugInner = isGirl ? "bg-[#FFE4E6]" : "bg-[#CCFBF1]";

  if (theme === "galaksi") {
    wallColor = "bg-[#1E1B4B]";
    floorColor = "bg-[#312E81]";
    rugColor = "bg-[#6D28D9]";
    rugInner = "bg-[#4C1D95]";
  } else if (theme === "hutan") {
    wallColor = "bg-[#DCFCE7]";
    floorColor = "bg-[#BBF7D0]";
    rugColor = "bg-[#166534]";
    rugInner = "bg-[#86EFAC]";
  } else if (theme === "istana") {
    wallColor = "bg-[#FEF3C7]";
    floorColor = "bg-[#E7C59E]";
    rugColor = "bg-[#B91C1C]";
    rugInner = "bg-[#FCA5A5]";
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Langit/dinding + lantai */}
      <div className={`absolute inset-x-0 top-0 h-[68%] ${wallColor}`} />
      <div className={`absolute inset-x-0 bottom-0 h-[32%] ${floorColor}`} />

      {/* Garis pembatas lantai & dinding Neo-Brutalism */}
      <div className="absolute inset-x-0 top-[68%] h-[6px] bg-[#134E4A] z-10" />

      {/* ── Redup malam (18:00 - 05:59): suasana kamar sedikit meredup ── */}
      {!isDay && (
        <div className="absolute inset-x-0 top-0 h-[68%] bg-[#0F172A]/25 z-[5] pointer-events-none transition-colors duration-700" />
      )}

      {/* ── Tema GALAKSI: bintang & planet ── */}
      {theme === "galaksi" && (
        <>
          <svg
            className="absolute inset-x-0 top-0 h-[68%] w-full"
            viewBox="0 0 400 270"
            preserveAspectRatio="none"
          >
            {[
              [30, 40, 3],
              [70, 90, 2],
              [120, 30, 2.5],
              [170, 70, 3],
              [230, 40, 2],
              [280, 90, 3],
              [330, 35, 2.5],
              [370, 80, 2],
              [50, 140, 2],
              [200, 150, 2.5],
              [320, 150, 2],
              [360, 200, 3],
            ].map(([cx, cy, r], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="0"
              />
            ))}
          </svg>
          {/* Planet cincin */}
          <div className="absolute right-[14%] top-[6%] w-14 h-14 bg-[#F59E0B] border-[3.5px] border-[#134E4A] rounded-full shadow-[3px_3px_0px_#134E4A]" />
          <div className="absolute right-[10%] top-[10%] w-24 h-5 border-[3px] border-[#FEF08A] bg-transparent rounded-[50%] -rotate-12" />
          {/* Planet biru kecil */}
          <div className="absolute left-[40%] top-[4%] w-9 h-9 bg-[#38BDF8] border-[3px] border-[#134E4A] rounded-full" />
          {/* Bulan sabit */}
          <svg
            className="absolute left-[6%] top-[4%] w-12 h-12"
            viewBox="0 0 48 48"
          >
            <path
              d="M 32 6 A 18 18 0 1 0 32 42 A 14 14 0 1 1 32 6 Z"
              fill="#FBBF24"
              stroke="#134E4A"
              strokeWidth="3"
            />
          </svg>
        </>
      )}

      {/* ── Tema HUTAN: pohon pisang & rumput menjuntai ── */}
      {theme === "hutan" && (
        <>
          {/* Tajuk pohon pisang di sudut kiri */}
          <svg
            className="absolute -left-2 top-[2%] w-24 h-32"
            viewBox="0 0 100 140"
          >
            <rect
              x="44"
              y="60"
              width="12"
              height="80"
              fill="#A16207"
              stroke="#134E4A"
              strokeWidth="4"
            />
            <path
              d="M 50 66 Q 10 40 4 66 Q 30 70 48 66"
              fill="#16A34A"
              stroke="#134E4A"
              strokeWidth="3.5"
            />
            <path
              d="M 50 66 Q 90 40 96 66 Q 70 70 50 66"
              fill="#15803D"
              stroke="#134E4A"
              strokeWidth="3.5"
            />
            <path
              d="M 50 60 Q 24 10 50 6 Q 76 10 50 60"
              fill="#22C55E"
              stroke="#134E4A"
              strokeWidth="3.5"
            />
            <path
              d="M 48 62 Q 50 30 66 18 Q 60 46 52 64"
              fill="#4ADE80"
              stroke="#134E4A"
              strokeWidth="3"
            />
            <path
              d="M 50 62 Q 48 28 34 16 Q 40 44 48 64"
              fill="#4ADE80"
              stroke="#134E4A"
              strokeWidth="3"
            />
          </svg>
          {/* Rumput menjuntai dari batas atas */}
          <svg
            className="absolute inset-x-0 top-0 w-full h-16"
            viewBox="0 0 400 48"
            preserveAspectRatio="none"
          >
            {[0, 20, 40, 60, 80, 100].map((x) => (
              <path
                key={x}
                d={`M ${x} 0 Q ${x + 8} 34 ${x + 4} 44 M ${x + 10} 0 Q ${x + 18} 40 ${x + 14} 46 M ${x + 20} 0 Q ${x + 26} 30 ${x + 24} 40`}
                fill="none"
                stroke="#16A34A"
                strokeWidth="5"
                strokeLinecap="round"
              />
            ))}
          </svg>
        </>
      )}

      {/* ── Tema ISTANA: kastil mini & papan bangsawan ── */}
      {theme === "istana" && (
        <>
          {/* Kastil mini di atas kanan */}
          <div className="absolute right-[6%] top-[4%] flex items-end flex-col">
            <div className="flex items-end gap-1">
              <div className="w-6 h-14 bg-[#FDBA74] border-[3px] border-[#134E4A]" />
              <div className="w-10 h-20 bg-[#F97316] border-[3.5px] border-[#134E4A] relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-8 bg-[#7F1D1D] border-[2.5px] border-[#134E4A] rounded-t-full" />
              </div>
              <div className="w-6 h-11 bg-[#FDBA74] border-[3px] border-[#134E4A]" />
            </div>
            {/* Atap kerucut menara */}
            <div className="absolute -top-3 left-[-6px] w-0 h-0 border-l-[12px] border-r-[12px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#B91C1C] drop-shadow-[2px_2px_0px_#134E4A]" />
            <div className="absolute -top-6 right-[-4px] w-0 h-0 border-l-[16px] border-r-[16px] border-b-[18px] border-l-transparent border-r-transparent border-b-[#991B1B] drop-shadow-[2px_2px_0px_#134E4A]" />
          </div>
          {/* Penawer (bendera) kiri */}
          <div className="absolute left-[6%] top-[10%] flex items-center">
            <div className="w-1 h-12 bg-[#134E4A] rounded-full" />
            <div className="w-6 h-4 mb-6 ml-[-2px] bg-[#B91C1C] border-2 border-[#134E4A] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,45%_50%)]" />
          </div>
          {/* Pilar kiri & kanan */}
          <div className="absolute left-0 top-[8%] flex flex-col items-center">
            <div className="w-12 h-5 bg-[#FDBA74] border-[3px] border-[#134E4A] border-b-0" />
            <div className="w-8 h-24 bg-[#FEF3C7] border-[3px] border-[#134E4A]" />
            <div className="w-10 h-4 bg-[#FDBA74] border-[3px] border-[#134E4A] border-t-0" />
          </div>
          <div className="absolute right-0 top-[8%] flex flex-col items-center">
            <div className="w-12 h-5 bg-[#FDBA74] border-[3px] border-[#134E4A] border-b-0" />
            <div className="w-8 h-24 bg-[#FEF3C7] border-[3px] border-[#134E4A]" />
            <div className="w-10 h-4 bg-[#FDBA74] border-[3px] border-[#134E4A] border-t-0" />
          </div>
        </>
      )}

      {/* ── 1. JENDELA (Terhubung Siklus Siang/Malam) ── */}
      <div className="absolute left-[5%] top-[8%] w-24 h-32 sm:w-32 sm:h-40 border-[4px] border-[#134E4A] bg-[#FFFDF0] rounded-t-full shadow-[4px_4px_0px_#134E4A] p-1.5 flex flex-col items-center z-[6]">
        <div
          className={`w-full h-full rounded-t-full border-[2.5px] border-[#134E4A] relative overflow-hidden transition-colors duration-700 ${
            theme === "galaksi"
              ? "bg-[#0F0A3C]"
              : isDay
                ? "bg-[#38BDF8]"
                : "bg-[#0F172A]"
          }`}
        >
          {theme !== "galaksi" && isDay ? (
            /* Siang: Langit Biru Cerah, Matahari & Awan */
            <>
              {/* Matahari */}
              <div className="absolute top-2 right-2 w-7 h-7 sm:w-9 sm:h-9 bg-[#FBBF24] border-[2.5px] border-[#134E4A] rounded-full shadow-[1px_1px_0px_#134E4A]">
                <div className="w-full h-full rounded-full bg-[#FDE047]/60" />
              </div>
              {/* Awan putih berjejer */}
              <div className="absolute top-8 left-1 w-11 h-5 bg-white border-[2px] border-[#134E4A] rounded-full" />
              <div className="absolute top-10 left-5 w-9 h-4 bg-white border-[2px] border-[#134E4A] rounded-full" />
              <div className="absolute bottom-3 right-1 w-12 h-5 bg-white/90 border-[2px] border-[#134E4A] rounded-full" />
            </>
          ) : (
            /* Malam: Langit Gelap, Bulan Sabit & Bintang */
            <>
              {/* Bulan Sabit */}
              <svg
                className="absolute top-2 right-2 w-7 h-7 sm:w-9 sm:h-9"
                viewBox="0 0 36 36"
              >
                <path
                  d="M 24 4 A 14 14 0 1 0 24 32 A 11 11 0 1 1 24 4 Z"
                  fill="#FEF08A"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
              </svg>
              {/* Bintang berkelap-kelip */}
              <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-[#FEF08A] rounded-full animate-ping" />
              <div className="absolute top-8 left-6 w-2 h-2 bg-white rounded-full" />
              <div className="absolute top-14 left-2 w-1.5 h-1.5 bg-[#FEF08A] rounded-full" />
              <div className="absolute bottom-6 right-3 w-2 h-2 bg-white rounded-full" />
              <div className="absolute bottom-10 left-5 w-1 h-1 bg-white rounded-full" />
            </>
          )}
        </div>
        {/* Teralis Jendela Neo-Brutalism */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[3px] bg-[#134E4A]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[120%] bg-[#134E4A]" />
      </div>

      {/* ── 2. POSTER DINDING (Ka'bah & Bintang Mini) ── */}
      <div className="absolute left-[33%] top-[8%] w-13 sm:w-16 h-18 sm:h-22 border-[3px] border-[#134E4A] bg-[#FFFDF0] rounded-xl shadow-[3px_3px_0px_#134E4A] p-1 flex flex-col items-center justify-between z-[6]">
        {/* Selotip poster */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-2 bg-[#FEF08A] border border-[#134E4A] -rotate-3" />
        <div className="w-full h-full rounded-lg bg-[#ECFDF5] border-2 border-[#134E4A] flex flex-col items-center justify-center p-1 relative overflow-hidden">
          {/* Bintang emas di atas Ka'bah */}
          <div className="flex items-center gap-0.5 mb-1">
            <span className="text-[9px] text-[#D97706] font-black">★</span>
            <div className="w-1.5 h-1.5 rounded-full border border-[#134E4A] bg-[#FBBF24]" />
          </div>
          {/* Kubus Ka'bah */}
          <div className="w-6 h-6 bg-[#18181B] border-2 border-[#134E4A] rounded-xs relative shadow-xs">
            {/* Kiswah emas */}
            <div className="absolute top-1 inset-x-0 h-[2px] bg-[#FBBF24]" />
            {/* Pintu Ka'bah */}
            <div className="absolute bottom-0 right-1 w-1.5 h-3 bg-[#FBBF24] border-[1px] border-[#134E4A]" />
          </div>
          <span className="text-[6px] font-black uppercase tracking-wider text-[#134E4A] mt-1">
            Ka'bah
          </span>
        </div>
      </div>

      {/* ── 3. JAM DINDING REAL-TIME (Analog + Digital) ── */}
      <div className="absolute left-1/2 top-[5%] -translate-x-1/2 flex flex-col items-center gap-1 z-[6]">
        <div
          className={`relative w-15 h-15 sm:w-17 sm:h-17 border-[3.5px] border-[#134E4A] rounded-full shadow-[3px_3px_0px_#134E4A] flex items-center justify-center ${
            theme === "galaksi" ? "bg-[#1E1B4B]" : "bg-white"
          }`}
        >
          {/* Tanda jam 12, 3, 6, 9 */}
          <div className="absolute top-1 w-1 h-1 rounded-full bg-[#134E4A]" />
          <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#134E4A]" />
          <div className="absolute left-1 w-1 h-1 rounded-full bg-[#134E4A]" />
          <div className="absolute right-1 w-1 h-1 rounded-full bg-[#134E4A]" />

          {/* Jarum Jam */}
          <div
            className="absolute top-1/2 left-1/2 w-1.5 h-4 bg-[#134E4A] rounded-full origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            }}
          />

          {/* Jarum Menit */}
          <div
            className="absolute top-1/2 left-1/2 w-1 h-5.5 bg-[#0D9488] rounded-full origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            }}
          />

          {/* Jarum Detik */}
          <div
            className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-[#FF6B6B] rounded-full origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
            }}
          />

          {/* Poros Tengah */}
          <div className="w-2.5 h-2.5 rounded-full border border-[#134E4A] bg-[#FEF08A] z-10" />
        </div>

        {/* Teks Digital Jam Format HH:MM */}
        <span className="rounded-md border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[9px] font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] tabular-nums">
          {timeStr}
        </span>
      </div>

      {/* ── 4. RAK BUKU (Buku Tegak: Iqro, Tilawati, Juz Amma) ── */}
      <div className="absolute right-[5%] top-[8%] w-28 sm:w-36 border-[3.5px] border-[#134E4A] bg-[#F59E0B] shadow-[4px_4px_0px_#134E4A] p-2 rounded-2xl flex flex-col gap-1.5 z-[6]">
        <div className="flex items-end justify-center gap-1 h-14">
          {/* Buku 1: Iqro */}
          <div className="w-6 h-12 bg-[#EF4444] border-[2px] border-[#134E4A] rounded-t-md shadow-[1px_1px_0px_#134E4A] flex items-center justify-center overflow-hidden">
            <span className="text-[8px] font-black text-white [writing-mode:vertical-rl] rotate-180 tracking-tighter">
              Iqro
            </span>
          </div>
          {/* Buku 2: Tilawati */}
          <div className="w-6 h-14 bg-[#0284C7] border-[2px] border-[#134E4A] rounded-t-md shadow-[1px_1px_0px_#134E4A] flex items-center justify-center overflow-hidden">
            <span className="text-[7px] font-black text-white [writing-mode:vertical-rl] rotate-180 tracking-tighter">
              Tilawati
            </span>
          </div>
          {/* Buku 3: Juz Amma */}
          <div className="w-7 h-13 bg-[#10B981] border-[2px] border-[#134E4A] rounded-t-md shadow-[1px_1px_0px_#134E4A] flex items-center justify-center overflow-hidden">
            <span className="text-[7px] font-black text-white [writing-mode:vertical-rl] rotate-180 tracking-tighter">
              Juz Amma
            </span>
          </div>
          {/* Buku 4: Doa */}
          <div className="w-5 h-11 bg-[#8B5CF6] border-[2px] border-[#134E4A] rounded-t-md shadow-[1px_1px_0px_#134E4A] flex items-center justify-center overflow-hidden">
            <span className="text-[8px] font-black text-white [writing-mode:vertical-rl] rotate-180 tracking-tighter">
              Doa
            </span>
          </div>
        </div>
        {/* Papan ambalan rak */}
        <div className="w-full h-2.5 bg-[#B45309] border-[2px] border-[#134E4A] rounded-md" />
      </div>

      {/* ── 5. MEJA BELAJAR & LAMPU MEJA (MENYALA JIKA MALAM) ── */}
      <div className="absolute left-[3%] bottom-[16%] flex flex-col items-center z-[6]">
        {/* Lampu Meja */}
        <div className="relative flex flex-col items-center mb-[-4px]">
          {/* Tudung lampu */}
          <div className="relative w-8 h-6 bg-[#0D9488] border-[2.5px] border-[#134E4A] rounded-t-full shadow-[2px_2px_0px_#134E4A] overflow-hidden">
            {/* Cahaya bola lampu menyala jika malam */}
            {!isDay && (
              <div className="absolute bottom-0 inset-x-0 h-2 bg-[#FEF08A] animate-pulse" />
            )}
          </div>
          {/* Tiang lampu */}
          <div className="w-1.5 h-6 bg-[#134E4A]" />
          {/* Dudukan lampu */}
          <div className="w-6 h-2 bg-[#FBBF24] border-[2px] border-[#134E4A] rounded-full" />

          {/* Sorot cahaya lampu meja menyala saat malam */}
          {!isDay && (
            <div
              className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-b from-[#FEF08A]/40 to-transparent pointer-events-none rounded-full blur-[2px]"
              style={{
                clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
              }}
            />
          )}
        </div>

        {/* Buku Terbuka di atas Meja */}
        <div className="relative z-10 -mb-2 flex items-center justify-center">
          <div className="w-12 h-6 bg-[#FFFDF0] border-[2px] border-[#134E4A] rounded-sm shadow-[1.5px_1.5px_0px_#134E4A] flex divide-x-2 divide-[#134E4A] p-0.5">
            <div className="flex-1 flex flex-col justify-around py-0.5 px-0.5">
              <div className="h-0.5 bg-[#134E4A]/60 rounded-full" />
              <div className="h-0.5 bg-[#134E4A]/60 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col justify-around py-0.5 px-0.5">
              <div className="h-0.5 bg-[#134E4A]/60 rounded-full" />
              <div className="h-0.5 bg-[#134E4A]/60 rounded-full" />
            </div>
          </div>
        </div>

        {/* Meja Belajar Kayu */}
        <div className="w-20 sm:w-24 h-4 bg-[#D97706] border-[3px] border-[#134E4A] rounded-md shadow-[3px_3px_0px_#134E4A]" />
        <div className="w-16 sm:w-20 flex justify-between px-1">
          <div className="w-2.5 h-10 bg-[#B45309] border-[2px] border-[#134E4A]" />
          <div className="w-2.5 h-10 bg-[#B45309] border-[2px] border-[#134E4A]" />
        </div>
      </div>

      {/* ── 6. SAJADAH GULUNG DI SUDUT LANTAI ── */}
      <div className="absolute right-[4%] bottom-[16%] flex flex-col items-center z-[6]">
        <div className="relative flex items-center">
          {/* Ujung gulungan sajadah */}
          <div className="w-4 h-7 rounded-full bg-[#059669] border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center">
            <div className="w-2 h-4 rounded-full bg-[#F59E0B] border border-[#134E4A]" />
          </div>
          {/* Badan gulungan */}
          <div className="w-12 h-6 bg-[#047857] border-[2.5px] border-l-0 border-[#134E4A] rounded-r-md shadow-[2px_2px_0px_#134E4A] flex flex-col justify-between py-0.5 px-1">
            <div className="h-0.5 bg-[#FBBF24] rounded-full" />
            <div className="h-0.5 bg-[#FBBF24] rounded-full" />
          </div>
          {/* Rumbai benang emas */}
          <div className="flex flex-col gap-0.5 ml-0.5">
            <div className="w-2 h-0.5 bg-[#FDE68A]" />
            <div className="w-2.5 h-0.5 bg-[#FDE68A]" />
            <div className="w-2 h-0.5 bg-[#FDE68A]" />
          </div>
        </div>
        <span className="text-[7px] font-black uppercase tracking-wider text-[#065F46] mt-0.5">
          Sajadah
        </span>
      </div>

      {/* ── 7. KARPET BULAT TENGAH (TEMPAT MASKOT BERDIRI) ── */}
      <div
        className={`absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[82%] max-w-[420px] h-22 sm:h-26 ${rugColor} border-[4px] border-[#134E4A] rounded-[50%] shadow-[5px_5px_0px_#134E4A] flex items-center justify-center z-0`}
      >
        <div
          className={`w-[85%] h-[72%] ${rugInner} border-[3px] border-dashed border-[#134E4A]/60 rounded-[50%] flex items-center justify-center`}
        >
          <div className="w-[60%] h-[55%] border-2 border-dotted border-[#134E4A]/30 rounded-[50%]" />
        </div>
      </div>
    </div>
  );
}

export default function KamarTilaPage() {
  const navigate = useNavigate();
  const { user, groupId } = useAuth();
  const isVip = useEconomyStore((s) => s.isVip);
  const isUnlimited = isUnlimitedUser(user, isVip, groupId);

  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const setTilaGender = useEconomyStore((s) => s.setTilaGender);
  const equippedAccessory = useEconomyStore((s) => s.equippedAccessory);
  const equippedRoomTheme = useEconomyStore((s) => s.equippedRoomTheme);
  const equipAccessory = useEconomyStore((s) => s.equipAccessory);
  const ownedAccessories = useEconomyStore((s) => s.ownedAccessories || []);
  const inventory = useEconomyStore((s) => s.inventory || []);
  const ownedRoomThemes = useEconomyStore((s) => s.ownedRoomThemes || []);
  const setEquippedTheme = useEconomyStore((s) => s.setEquippedTheme);
  const equippedSkin = useEconomyStore((s) => s.equippedSkin || "default");
  const ownedSkins = useEconomyStore((s) => s.ownedSkins || []);
  const setEquippedSkin = useEconomyStore((s) => s.setEquippedSkin);
  const equipSkin = useEconomyStore((s) => s.equipSkin);
  const coins = useCoinsBalance();

  // FASE 2: Jam Real-Time & Siklus Siang/Malam (diperbarui setiap detik)
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [wardrobeTab, setWardrobeTab] = useState<"skin" | "accessory" | "room">(
    "accessory",
  );

  const [draftGender, setDraftGender] = useState<TilaGender>(tilaGender);
  const [draftAccessory, setDraftAccessory] = useState<TilaAccessoryType>(
    equippedAccessory as TilaAccessoryType,
  );

  // Sinkronkan draftAccessory jika equippedAccessory berubah
  useEffect(() => {
    if (equippedAccessory) {
      setDraftAccessory(equippedAccessory as TilaAccessoryType);
    }
  }, [equippedAccessory]);

  const [direction, setDirection] = useState<TilaDirection>("front");
  const [previewMood, setPreviewMood] = useState<TilaMood>("happy");
  const [previewAnimation, setPreviewAnimation] =
    useState<TilaAnimation>("float");
  const [previewHoldItem, setPreviewHoldItem] = useState<TilaHoldItem>("star");

  const [speech, setSpeech] = useState<string | null>(null);
  const speechTimerRef = useRef<number | null>(null);

  const exprScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingExpr = useRef(false);
  const exprStartX = useRef(0);
  const exprScrollLeft = useRef(0);

  const triggerDialogue = (text: string) => {
    if (speechTimerRef.current !== null) {
      window.clearTimeout(speechTimerRef.current);
    }
    setSpeech(text);
    speechTimerRef.current = window.setTimeout(() => {
      setSpeech(null);
      speechTimerRef.current = null;
    }, 3800);
  };

  const isAccessoryOwned = (id: string) => {
    if (id === "none") return true;
    if (isUnlimited) return true;
    return inventory.includes(id) || ownedAccessories.includes(id);
  };

  const isSkinOwned = (skinKey: string, id: string) => {
    if (skinKey === "default") return true;
    if (isUnlimited) return true;
    return (
      inventory.includes(id) ||
      inventory.includes(skinKey) ||
      ownedSkins.includes(id) ||
      ownedSkins.includes(skinKey)
    );
  };

  const isRoomThemeOwned = (id: string) => {
    if (id === "default") return true;
    if (isUnlimited) return true;
    const aliases =
      id === "galaksi"
        ? ["galaksi", "theme_space", "space"]
        : id === "default"
          ? ["default", "theme_default", "classic", "theme_classic"]
          : [id, `theme_${id}`];
    return aliases.some(
      (alias) => inventory.includes(alias) || ownedRoomThemes.includes(alias),
    );
  };

  useEffect(() => {
    const activeName = getMascotName(draftGender);
    const welcomeText =
      draftGender === "girl"
        ? `Selamat datang di Kamar ${activeName}! Cantik kan?`
        : `Selamat datang di Kamar ${activeName}! Keren kan?`;
    triggerDialogue(welcomeText);

    return () => {
      if (speechTimerRef.current !== null) {
        window.clearTimeout(speechTimerRef.current);
      }
    };
  }, []);

  const handleTapMascot = () => {
    triggerTilaReaction("click");
    const pick =
      TAP_REACTIONS[Math.floor(Math.random() * TAP_REACTIONS.length)];
    setPreviewMood(pick.mood);
    setPreviewAnimation(pick.animation);
    const speechText =
      pick.speeches[Math.floor(Math.random() * pick.speeches.length)];
    triggerDialogue(speechText);
  };

  const handleCycleDirection = () => {
    triggerTilaReaction("click");
    if (direction === "front") {
      setDirection("right");
      triggerDialogue("Lihat aku dari samping, keren kan?");
    } else if (direction === "right") {
      setDirection("back");
      triggerDialogue("Ini bagian belakangku, jangan nakal ya!");
    } else {
      setDirection("front");
      triggerDialogue("Sekarang menghadapmu lagi, ayo belajar!");
    }
  };

  const handleToggleDraftGender = async (newGender: "boy" | "girl") => {
    triggerTilaReaction("play");
    setDraftGender(newGender);
    setPreviewMood("excited");

    try {
      await setTilaGender(newGender);
    } catch {
      // offline / fallback
    }

    if (newGender === "boy") {
      let nextAcc = draftAccessory;
      if (draftAccessory === "hairbow" || draftAccessory === "flowercrown") {
        nextAcc = ownedAccessories.includes("peci") ? "peci" : "none";
        setDraftAccessory(nextAcc);
        equipAccessory(nextAcc);
      }
      triggerDialogue("Kamar Tito! Keren dengan peci santri.");
    } else {
      let nextAcc = draftAccessory;
      if (draftAccessory === "peci") {
        nextAcc = ownedAccessories.includes("hairbow") ? "hairbow" : "none";
        setDraftAccessory(nextAcc);
        equipAccessory(nextAcc);
      }
      triggerDialogue("Kamar Tila! Anggun dengan pita rambut.");
    }
  };

  const [filterMode, setFilterMode] = useState<"matched" | "all">("matched");
  const filteredAccessories = ACCESSORIES.filter((item) => {
    if (filterMode === "all") return true;
    return item.category === "all" || item.category === draftGender;
  });

  const handleSelectAccessory = (item: AccessoryConfig) => {
    const isOwned = isAccessoryOwned(item.id);
    if (!isOwned) {
      navigate("/member/ngaji-ceria/warung-santri?tab=kostum");
      return;
    }

    setDraftAccessory(item.id);
    equipAccessory(item.id);
    triggerTilaReaction("success");
    setPreviewMood("excited");
    triggerDialogue(
      `Wah, makin cocok pakai ${item.name}! Klik 'Simpan Pengaturan' untuk menyimpan.`,
    );
  };

  const isDirty =
    draftGender !== tilaGender || draftAccessory !== equippedAccessory;

  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!isDirty) {
      setDraftGender(tilaGender);
      setDraftAccessory(equippedAccessory as TilaAccessoryType);
    }
  }, [tilaGender, equippedAccessory, isDirty]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    const previousGender = tilaGender;
    const previousAccessory = equippedAccessory;
    try {
      await setTilaGender(draftGender);
      equipAccessory(draftAccessory);
      triggerTilaReaction("success");
      setPreviewMood("excited");
      setPreviewAnimation("bounce");
      const newName = getMascotName(draftGender);
      triggerDialogue(
        `Alhamdulillah, pengaturan tersimpan! Sekarang namaku ${newName}!`,
      );
    } catch (err) {
      console.error("Save mascot settings error:", err);
      // Rollback optimistic update
      setDraftGender(previousGender);
      setDraftAccessory(previousAccessory as TilaAccessoryType);
      try {
        await setTilaGender(previousGender);
      } catch {
        // ignore
      }
      triggerTilaReaction("error");
      setPreviewMood("sad");
      triggerDialogue("Yah, gagal menyimpan ke server. Pilihan dikembalikan.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSelectExpression = (opt: ExpressionOption) => {
    triggerTilaReaction("click");
    setPreviewMood(opt.mood);
    setPreviewAnimation(opt.animation);
    if (opt.holdItem) {
      setPreviewHoldItem(opt.holdItem);
    }
    triggerDialogue(opt.speech);
  };

  const scrollExpressions = (direction: "left" | "right") => {
    if (!exprScrollRef.current) return;
    const scrollAmount = 180;
    exprScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleExprMouseDown = (e: React.MouseEvent) => {
    if (!exprScrollRef.current) return;
    isDraggingExpr.current = true;
    exprStartX.current = e.pageX - exprScrollRef.current.offsetLeft;
    exprScrollLeft.current = exprScrollRef.current.scrollLeft;
  };

  const handleExprMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingExpr.current || !exprScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - exprScrollRef.current.offsetLeft;
    const walk = (x - exprStartX.current) * 1.5;
    exprScrollRef.current.scrollLeft = exprScrollLeft.current - walk;
  };

  const handleExprMouseUp = () => {
    isDraggingExpr.current = false;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex flex-col justify-between overflow-x-hidden">
      <header className="sticky top-0 z-40 pt-safe px-4 py-3 flex items-center justify-between bg-[#FFFDF0]/95 backdrop-blur-md border-b-2 border-[#134E4A]/10 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/member/ngaji-ceria/profile")}
          className="flex h-10 min-h-[40px] items-center gap-1.5 px-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-white font-black text-xs text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0D9488]">
            Kustomisasi Maskot
          </span>
          <h1 className="font-display text-xl font-black text-[#134E4A] leading-tight flex items-center gap-1.5">
            <span>Kamar {getMascotName(draftGender)}</span>
            {draftGender !== tilaGender && (
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-[#FEF08A] text-[#134E4A] border border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                Pratinjau
              </span>
            )}
          </h1>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/member/ngaji-ceria/warung-santri?tab=kostum")
          }
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] font-black text-xs text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <Coins size={14} className="text-[#D97706]" />
          <span>{coins}</span>
          <Store size={12} className="ml-0.5 text-[#0D9488]" />
        </button>
      </header>

      <main className="relative isolate flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-0 overflow-y-auto">
        <RoomDecor
          key={equippedRoomTheme}
          gender={draftGender}
          themeId={equippedRoomTheme}
          time={time}
        />

        <div className="absolute top-4 left-6 pointer-events-none opacity-90 hidden sm:block">
          <div className="px-3 py-1.5 rounded-xl border-[2px] border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] text-[10px] font-black text-[#134E4A] flex items-center gap-1">
            <Sparkles size={12} className="text-[#0D9488]" />
            <span>Kamar Belajar</span>
          </div>
        </div>

        <div className="absolute top-4 right-6 pointer-events-none opacity-90 hidden sm:block">
          <div className="px-3 py-1.5 rounded-xl border-[2px] border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] text-[10px] font-black text-[#BE185D] flex items-center gap-1">
            <Crown size={12} className="text-[#DB2777]" />
            <span>Santri Teladan</span>
          </div>
        </div>

        <div className="h-16 flex items-end justify-center mb-1">
          <AnimatePresence>
            {speech && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                className="relative z-20 px-4 py-2 rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A] max-w-[280px] text-center"
              >
                <p className="text-xs font-black text-[#134E4A] leading-snug">
                  {speech}
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-[3px] border-b-[3px] border-[#134E4A] rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ x: 340, y: -70, rotate: -16, scale: 0.75 }}
          animate={{ x: 0, y: 0, rotate: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 85,
            damping: 14,
            duration: 1.2,
          }}
          className="relative flex flex-col items-center justify-center z-10"
        >
          <div
            onClick={handleTapMascot}
            className="relative cursor-pointer group"
          >
            <TilaMascot
              size={240}
              direction={direction}
              mood={previewMood}
              animation={previewAnimation}
              gender={draftGender === "girl" ? "girl" : "boy"}
              accessory={
                (draftAccessory ||
                  (equippedAccessory as TilaAccessoryType) ||
                  "none") as TilaAccessoryType
              }
              skin={equippedSkin}
              holdItem={previewHoldItem}
            />

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A] text-[10px] font-black text-[#134E4A] pointer-events-none flex items-center gap-1"
            >
              <span>Ketuk {getMascotName(draftGender)}!</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-5 flex items-center gap-3 z-10">
          <button
            type="button"
            onClick={handleCycleDirection}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[3px] border-[#134E4A] bg-white text-xs font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            <RefreshCw size={16} className="text-[#0D9488]" />
            <span>
              Putar Badan (
              {direction === "front"
                ? "Depan"
                : direction === "right"
                  ? "Samping"
                  : "Belakang"}
              )
            </span>
          </button>
        </div>

        <div className="w-full max-w-md mx-auto mt-4 px-2 z-10">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#134E4A] bg-white/80 px-2 py-0.5 rounded-md border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
              Uji Ekspresi & Pose
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollExpressions("left")}
                aria-label="Geser ke kiri"
                title="Geser ke kiri"
                className="w-7 h-7 rounded-lg border-2 border-[#134E4A] bg-white flex items-center justify-center text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] active:translate-y-0.5 active:shadow-none hover:bg-gray-50 transition-all cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => scrollExpressions("right")}
                aria-label="Geser ke kanan"
                title="Geser ke kanan"
                className="w-7 h-7 rounded-lg border-2 border-[#134E4A] bg-white flex items-center justify-center text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] active:translate-y-0.5 active:shadow-none hover:bg-gray-50 transition-all cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div
            ref={exprScrollRef}
            onMouseDown={handleExprMouseDown}
            onMouseMove={handleExprMouseMove}
            onMouseUp={handleExprMouseUp}
            onMouseLeave={handleExprMouseUp}
            className="flex gap-2 overflow-x-auto pb-2.5 pt-1 scroll-smooth touch-pan-x overscroll-x-contain cursor-grab active:cursor-grabbing scrollbar-thin scrollbar-thumb-[#134E4A]/30"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {EXPRESSION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive =
                opt.id === "spinning"
                  ? previewAnimation === "spinning"
                  : previewMood === opt.mood &&
                    previewAnimation === opt.animation;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectExpression(opt)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border-[2.5px] border-[#134E4A] font-black text-xs transition-all cursor-pointer select-none ${
                    isActive
                      ? "bg-[#FEF08A] text-[#134E4A] shadow-[2.5px_2.5px_0px_#134E4A] -translate-y-0.5 ring-2 ring-[#0D9488]"
                      : "bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-0.5 active:shadow-none hover:bg-gray-50"
                  }`}
                >
                  <Icon size={15} className={opt.iconColor} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="relative z-30 rounded-t-[32px] border-t-[3.5px] border-x-[3.5px] border-[#134E4A] bg-white p-5 shadow-[0px_-6px_0px_#134E4A] space-y-4">
        {/* Wardrobe Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setWardrobeTab("skin")}
            className={`px-3.5 py-1.5 rounded-xl border-2 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              wardrobeTab === "skin"
                ? "bg-[#134E4A] text-white border-[#134E4A] shadow-[2px_2px_0px_#0D9488]"
                : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
            }`}
          >
            <Sparkles size={13} />
            <span>Skin Maskot</span>
          </button>
          <button
            type="button"
            onClick={() => setWardrobeTab("accessory")}
            className={`px-3.5 py-1.5 rounded-xl border-2 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              wardrobeTab === "accessory"
                ? "bg-[#134E4A] text-white border-[#134E4A] shadow-[2px_2px_0px_#0D9488]"
                : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
            }`}
          >
            <Glasses size={13} />
            <span>Aksesoris</span>
          </button>
          <button
            type="button"
            onClick={() => setWardrobeTab("room")}
            className={`px-3.5 py-1.5 rounded-xl border-2 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              wardrobeTab === "room"
                ? "bg-[#134E4A] text-white border-[#134E4A] shadow-[2px_2px_0px_#0D9488]"
                : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
            }`}
          >
            <Home size={13} />
            <span>Tema Kamar</span>
          </button>
        </div>

        {/* Global Character Toggle: PILIH KARAKTER (Tito / Tila) */}
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#F0FDF4] border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#134E4A]">
              Pilih Karakter:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleToggleDraftGender("boy")}
              className={`px-3 py-1.5 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                draftGender === "boy"
                  ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A] -translate-y-0.5"
                  : "bg-white text-[#134E4A] opacity-70 hover:opacity-100"
              }`}
            >
              <User size={13} />
              <span>Tito (Putra)</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleDraftGender("girl")}
              className={`px-3 py-1.5 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                draftGender === "girl"
                  ? "bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#134E4A] -translate-y-0.5"
                  : "bg-white text-[#134E4A] opacity-70 hover:opacity-100"
              }`}
            >
              <Sparkles size={13} />
              <span>Tila (Putri)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Skin Maskot */}
        {wardrobeTab === "skin" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#134E4A]/80">
                Pilihan Wujud & Skin Maskot
              </span>
              <button
                type="button"
                onClick={() =>
                  navigate("/member/ngaji-ceria/warung-santri?tab=skin")
                }
                className="text-[10px] font-black text-[#0D9488] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Warung Santri</span>
                <Store size={10} />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide snap-x touch-pan-x">
              {SKIN_ITEMS.map((item) => {
                const isOwned = isSkinOwned(item.skinKey, item.id);
                const isEquipped = equippedSkin === item.skinKey;

                return (
                  <div
                    key={item.id}
                    className={`snap-start shrink-0 w-[140px] rounded-2xl border-[3px] p-3 text-center flex flex-col items-center justify-between transition-all relative ${
                      isEquipped
                        ? "border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)] ring-2 ring-emerald-500"
                        : isOwned
                          ? "border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]"
                          : "border-dashed border-[var(--border-color,#134E4A)]/40 bg-[var(--bg-card,#FFFFFF)]/50 opacity-60 grayscale"
                    }`}
                  >
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                      <span
                        className={`text-[8px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${item.badgeBg}`}
                      >
                        {item.rarity || item.badgeText}
                      </span>
                      {item.exclusiveGender === "boy" && (
                        <span className="text-[7.5px] font-black px-1 py-0.5 rounded bg-[#0D9488] text-white border border-[var(--border-color,#134E4A)]">
                          Khusus Tito
                        </span>
                      )}
                      {item.exclusiveGender === "girl" && (
                        <span className="text-[7.5px] font-black px-1 py-0.5 rounded bg-[#FF6B6B] text-white border border-[var(--border-color,#134E4A)]">
                          Khusus Tila
                        </span>
                      )}
                    </div>

                    <div className="h-16 w-16 flex items-center justify-center mb-1 mt-3 rounded-xl border-2 border-[var(--border-color,#134E4A)]/30 bg-[var(--bg-app,#F0FDF4)] relative overflow-hidden shadow-inner">
                      <div className="transform scale-[0.55] translate-y-1">
                        <TilaMascot
                          size={95}
                          skin={item.skinKey}
                          gender={draftGender === "girl" ? "girl" : "boy"}
                          accessory="none"
                          animation="bounce"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] font-black text-[var(--text-main,#134E4A)] truncate w-full mb-0.5">
                      {item.name}
                    </p>

                    <span className="text-[9px] font-bold text-[var(--text-main,#134E4A)]/70 mb-1.5 truncate w-full">
                      {item.effect}
                    </span>

                    {isEquipped ? (
                      <span className="flex items-center justify-center gap-1 w-full py-1.5 rounded-xl bg-[#134E4A] text-white text-[10px] font-black tracking-wide border border-[var(--border-color,#134E4A)]">
                        <Check size={10} /> Sedang Dipakai
                      </span>
                    ) : isOwned ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEquippedSkin(item.skinKey);
                          equipSkin(item.id);
                          triggerTilaReaction("success");
                          setPreviewMood("excited");
                          triggerDialogue(
                            `Keren! Sekarang aku memakai skin ${item.name}!`,
                          );
                        }}
                        className="w-full py-1.5 rounded-xl text-white text-[10px] font-black tracking-wide border-2 border-[var(--border-color,#134E4A)] bg-[#0D9488] hover:bg-[#0F766E] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                      >
                        Pakai
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          navigate("/member/ngaji-ceria/warung-santri?tab=skin")
                        }
                        className="w-full py-1.5 rounded-xl bg-[#FEF3C7] dark:bg-[#78350F]/60 text-[#B45309] dark:text-[#FDE047] text-[10px] font-black tracking-wide border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Lock size={10} className="shrink-0" />
                        <span>Beli di Warung</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Aksesoris */}
        {wardrobeTab === "accessory" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#134E4A]/80">
                    Koleksi Busana {getMascotName(draftGender)}
                  </span>
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-[#134E4A]/20">
                    <button
                      type="button"
                      onClick={() => setFilterMode("matched")}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                        filterMode === "matched"
                          ? "bg-white text-[#134E4A] border border-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
                          : "text-gray-500 hover:text-[#134E4A]"
                      }`}
                    >
                      Khusus {getMascotName(draftGender)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode("all")}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                        filterMode === "all"
                          ? "bg-white text-[#134E4A] border border-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
                          : "text-gray-500 hover:text-[#134E4A]"
                      }`}
                    >
                      Semua ({ACCESSORIES.length})
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/member/ngaji-ceria/warung-santri?tab=kostum")
                  }
                  className="text-[10px] font-black text-[#0D9488] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Warung Santri</span>
                  <Store size={10} />
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide snap-x touch-pan-x">
                {filteredAccessories.map((item) => {
                  const isOwned = isAccessoryOwned(item.id);
                  const isDraftSelected = draftAccessory === item.id;
                  const isMascotFit =
                    item.category === "all" || item.category === draftGender;

                  return (
                    <div
                      key={item.id}
                      className={`snap-start shrink-0 w-[124px] rounded-2xl border-[3px] p-3 text-center flex flex-col items-center justify-between transition-all relative ${
                        isDraftSelected
                          ? "border-[#134E4A] bg-[#CCFBF1] shadow-[3px_3px_0px_#134E4A]"
                          : isOwned
                            ? "border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A]"
                            : "border-dashed border-[#134E4A]/40 bg-gray-50 opacity-60 grayscale"
                      }`}
                    >
                      <div className="absolute top-2 right-2">
                        {item.category === "boy" ? (
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-[#CCFBF1] text-[#0F766E] border border-[#134E4A]">
                            Tito
                          </span>
                        ) : item.category === "girl" ? (
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-[#FCE7F3] text-[#BE185D] border border-[#134E4A]">
                            Tila
                          </span>
                        ) : (
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-[#FEF08A] text-[#134E4A] border border-[#134E4A]">
                            Unisex
                          </span>
                        )}
                      </div>

                      <div className="h-10 w-10 flex items-center justify-center mb-1.5 mt-2 rounded-xl border-2 border-[#134E4A]/20 bg-[#FFFDF0]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-8 w-8 object-contain"
                          />
                        ) : item.iconComponent ? (
                          <item.iconComponent
                            size={22}
                            className={
                              item.category === "girl"
                                ? "text-[#FB7185]"
                                : item.category === "boy"
                                  ? "text-[#0D9488]"
                                  : "text-[#D97706]"
                            }
                          />
                        ) : null}
                      </div>

                      <p className="text-[11px] font-black text-[#134E4A] truncate w-full mb-0.5">
                        {item.name}
                      </p>

                      <span className="text-[9px] font-bold text-gray-500 mb-1.5">
                        {item.category === "boy"
                          ? "Khusus Tito (Putra)"
                          : item.category === "girl"
                            ? "Khusus Tila (Putri)"
                            : "Semua Karakter"}
                      </span>

                      {isDraftSelected ? (
                        <span className="flex items-center justify-center gap-1 w-full py-1.5 rounded-xl bg-[#134E4A] text-white text-[10px] font-black tracking-wide border border-[#134E4A]">
                          <Check size={10} /> Sedang Dipakai
                        </span>
                      ) : !isMascotFit ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-1.5 rounded-xl bg-gray-200 text-gray-400 text-[10px] font-black tracking-wide border border-gray-300 shadow-none cursor-not-allowed flex items-center justify-center gap-1 opacity-70"
                        >
                          <Lock size={10} className="shrink-0" />
                          <span>Tidak Cocok</span>
                        </button>
                      ) : isOwned ? (
                        <button
                          type="button"
                          onClick={() => handleSelectAccessory(item)}
                          className="w-full py-1.5 rounded-xl text-white text-[10px] font-black tracking-wide border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer bg-[#0D9488] hover:bg-[#0F766E]"
                        >
                          Pakai
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              "/member/ngaji-ceria/warung-santri?tab=kostum",
                            )
                          }
                          className="w-full py-1.5 rounded-xl bg-[#FEF3C7] text-[#B45309] text-[10px] font-black tracking-wide border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Lock size={10} className="shrink-0" />
                          <span>Beli di Warung</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <StickerButton
                variant={isDirty ? "primary" : "secondary"}
                size="lg"
                fullWidth
                disabled={!isDirty || savingSettings}
                onClick={handleSaveSettings}
                className={
                  isDirty
                    ? "ring-2 ring-[#FEF08A] shadow-[4px_4px_0px_#134E4A]"
                    : "opacity-100 bg-gray-200 text-gray-500 border-gray-400 shadow-none"
                }
              >
                <Check size={18} />
                <span>
                  {savingSettings
                    ? "Menyimpan..."
                    : isDirty
                      ? "Simpan Pengaturan"
                      : "Pengaturan Tersimpan"}
                </span>
              </StickerButton>
            </div>
          </div>
        )}

        {/* Tab 3: Tema Kamar */}
        {wardrobeTab === "room" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#134E4A]/80">
                Pilihan Dekorasi Kamar {getMascotName(draftGender)}
              </span>
              <button
                type="button"
                onClick={() =>
                  navigate("/member/ngaji-ceria/warung-santri?tab=kamar")
                }
                className="text-[10px] font-black text-[#0D9488] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Warung Santri</span>
                <Store size={10} />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-hide snap-x touch-pan-x">
              {ROOM_THEMES_CONFIG.map((item) => {
                const isOwned = isRoomThemeOwned(item.id);
                const currentNormalized =
                  equippedRoomTheme === "theme_space" ||
                  equippedRoomTheme === "space"
                    ? "galaksi"
                    : equippedRoomTheme === "theme_default" ||
                        equippedRoomTheme === "classic" ||
                        equippedRoomTheme === "theme_classic"
                      ? "default"
                      : equippedRoomTheme === "theme_forest"
                        ? "hutan"
                        : equippedRoomTheme === "theme_castle"
                          ? "istana"
                          : equippedRoomTheme;
                const isEquipped = currentNormalized === item.id;

                return (
                  <div
                    key={item.id}
                    className={`snap-start shrink-0 w-[140px] rounded-2xl border-[3px] p-3 text-center flex flex-col items-center justify-between transition-all relative ${
                      isEquipped
                        ? "border-[#134E4A] bg-[#FEF08A]/30 shadow-[3px_3px_0px_#134E4A]"
                        : isOwned
                          ? "border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A]"
                          : "border-dashed border-[#134E4A]/40 bg-gray-50 opacity-60 grayscale"
                    }`}
                  >
                    <div className="h-10 w-16 flex flex-col mb-1.5 mt-1 rounded-lg border-2 border-[#134E4A] overflow-hidden shadow-sm">
                      <div className={`h-[65%] w-full ${item.wallPreview}`} />
                      <div
                        className={`h-[35%] w-full ${item.floorPreview} border-t border-[#134E4A]`}
                      />
                    </div>

                    <p className="text-[11px] font-black text-[#134E4A] truncate w-full mb-0.5">
                      {item.name}
                    </p>

                    <span className="text-[9px] font-bold text-gray-500 mb-1.5 truncate w-full">
                      {item.desc}
                    </span>

                    {isEquipped ? (
                      <span className="flex items-center justify-center gap-1 w-full py-1.5 rounded-xl bg-[#134E4A] text-white text-[10px] font-black tracking-wide border border-[#134E4A]">
                        <Check size={10} /> Sedang Dipakai
                      </span>
                    ) : isOwned ? (
                      <button
                        type="button"
                        onClick={() => {
                          console.log("Theme clicked:", item.id);
                          setEquippedTheme(item.id);
                          triggerTilaReaction("success");
                          setPreviewMood("excited");
                          triggerDialogue(
                            `Suasana kamar berubah menjadi ${item.name}! Nyaman sekali.`,
                          );
                        }}
                        className="w-full py-1.5 rounded-xl text-white text-[10px] font-black tracking-wide border-2 border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                      >
                        Pakai
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            "/member/ngaji-ceria/warung-santri?tab=kamar",
                          )
                        }
                        className="w-full py-1.5 rounded-xl bg-[#FEF3C7] text-[#B45309] text-[10px] font-black tracking-wide border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Lock size={10} className="shrink-0" />
                        <span>Beli di Warung</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
