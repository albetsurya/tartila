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
} from "@/components/ui/CustomIcons";
import { StickerButton } from "@/components/ui/StickerButton";
import { useEconomyStore, type TilaGender } from "../hooks/useEconomyStore";
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
    name: "Peci Santri",
    desc: "Songkok hitam berhias sulam emas khas santri cilik.",
    category: "boy",
    image: NGAJI_CERIA_ASSETS.peci,
    price: 200,
  },
  {
    id: "hairbow",
    name: "Pita Rambut",
    desc: "Pita cantik berwarna merah muda yang manis dan anggun.",
    category: "girl",
    iconComponent: Sparkles,
    price: 200,
  },
  {
    id: "flowercrown",
    name: "Mahkota Bunga",
    desc: "Karangan bunga aneka warna yang segar, ceria, dan mempesona.",
    category: "girl",
    iconComponent: Crown,
    price: 300,
  },
  {
    id: "glasses",
    name: "Kacamata Pintar",
    desc: "Kacamata bulat stylish pembawa semangat belajar tekun.",
    category: "all",
    iconComponent: Glasses,
    price: 500,
  },
  {
    id: "crown",
    name: "Mahkota Juara",
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

function RoomDecor({
  gender,
  themeId,
}: {
  gender: TilaGender;
  themeId: string;
}) {
  const isGirl = gender === "girl";
  const theme: RoomThemeId = (
    ["default", "galaksi", "hutan", "istana"].includes(themeId)
      ? themeId
      : "default"
  ) as RoomThemeId;

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
      className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden"
      aria-hidden="true"
    >
      {/* Langit/dinding + lantai */}
      <div className={`absolute inset-x-0 top-0 h-[68%] ${wallColor}`} />
      <div className={`absolute inset-x-0 bottom-0 h-[32%] ${floorColor}`} />

      <div className="absolute inset-x-0 top-[68%] h-[6px] bg-[#134E4A] z-10" />

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

      {/* Jendela */}
      <div className="absolute left-[8%] top-[10%] w-24 h-28 sm:w-32 sm:h-36 border-[4px] border-[#134E4A] bg-white rounded-t-full shadow-[4px_4px_0px_#134E4A] p-1.5 flex flex-col items-center">
        <div
          className={`w-full h-full ${
            theme === "galaksi"
              ? "bg-[#0F0A3C]"
              : theme === "hutan"
                ? "bg-[#86EFAC]"
                : theme === "istana"
                  ? "bg-[#FDE68A]"
                  : "bg-[#38BDF8]"
          } rounded-t-full border-[2.5px] border-[#134E4A] relative overflow-hidden`}
        >
          {theme !== "hutan" && (
            <>
              <div className="absolute top-2 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-[#FBBF24] border-[2.5px] border-[#134E4A] rounded-full" />
              <div className="absolute top-8 left-1 w-12 h-6 bg-white border-[2.5px] border-[#134E4A] rounded-full" />
              <div className="absolute top-10 left-6 w-8 h-5 bg-white border-[2.5px] border-[#134E4A] rounded-full" />
            </>
          )}
          {theme === "hutan" && (
            <>
              <div className="absolute top-3 right-2 w-8 h-8 sm:w-10 sm:h-10 bg-[#16A34A] border-[2.5px] border-[#134E4A] rounded-[50%]" />
              <div className="absolute top-9 left-1 w-12 h-6 bg-[#4ADE80] border-[2.5px] border-[#134E4A] rounded-full" />
              <div className="absolute top-11 left-6 w-8 h-5 bg-[#22C55E] border-[2.5px] border-[#134E4A] rounded-full" />
            </>
          )}
          {theme === "galaksi" && (
            <div className="absolute inset-0">
              <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-white rounded-full" />
              <div className="absolute top-9 left-9 w-1 bg-white rounded-full" />
              <div className="absolute top-14 left-16 w-1.5 h-1.5 bg-[#FEF08A] rounded-full" />
              <div className="absolute top-6 left-20 w-1 h-1 bg-white rounded-full" />
            </div>
          )}
          {theme === "istana" && (
            <div className="absolute bottom-2 left-1 w-14 h-8 bg-[#22C55E] border-[2.5px] border-[#134E4A] rounded-t-[50%]" />
          )}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[3px] bg-[#134E4A]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[120%] bg-[#134E4A]" />
      </div>

      {/* Rak buku */}
      <div className="absolute right-[8%] top-[12%] w-24 sm:w-32 border-[3.5px] border-[#134E4A] bg-[#FBBF24] shadow-[4px_4px_0px_#134E4A] p-2 rounded-xl flex flex-col gap-2">
        <div className="flex items-end justify-center gap-1 h-12">
          <div className="w-4 h-10 bg-[#EF4444] border-[2px] border-[#134E4A] rounded-t-sm" />
          <div className="w-4 h-12 bg-[#3B82F6] border-[2px] border-[#134E4A] rounded-t-sm" />
          <div className="w-4 h-8 bg-[#10B981] border-[2px] border-[#134E4A] rounded-t-sm" />
          <div className="w-4 h-11 bg-[#A855F7] border-[2px] border-[#134E4A] rounded-t-sm" />
        </div>
        <div className="w-full h-2 bg-[#134E4A] rounded-full" />
      </div>

      {/* Jam dinding */}
      <div
        className={`absolute left-1/2 top-[6%] -translate-x-1/2 w-16 h-16 border-[3.5px] border-[#134E4A] rounded-full shadow-[3px_3px_0px_#134E4A] flex items-center justify-center ${
          theme === "galaksi" ? "bg-[#1E1B4B]" : "bg-white"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full z-10 ${
            theme === "galaksi" ? "bg-[#FBBF24]" : "bg-[#134E4A]"
          }`}
        />
        <div
          className={`absolute top-2 left-1/2 w-1.5 h-5 border-[1px] rounded-full origin-bottom -translate-x-1/2 ${
            theme === "galaksi"
              ? "bg-[#FBBF24] border-[#134E4A]"
              : "bg-[#FF6B6B] border-[#134E4A]"
          }`}
          style={{ transform: "rotate(45deg) translateY(2px)" }}
        />
        <div
          className={`absolute top-3 left-1/2 w-1 h-4 rounded-full origin-bottom -translate-x-1/2 ${
            theme === "galaksi" ? "bg-[#FBBF24]" : "bg-[#134E4A]"
          }`}
        />
      </div>

      {/* Karpet */}
      <div
        className={`absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[80%] max-w-[400px] h-20 sm:h-24 ${rugColor} border-[4px] border-[#134E4A] rounded-[50%] shadow-[4px_4px_0px_#134E4A] flex items-center justify-center z-0`}
      >
        <div
          className={`w-[85%] h-[70%] ${rugInner} border-[3px] border-dashed border-[#134E4A]/50 rounded-[50%]`}
        />
      </div>

      {/* Tanaman pot */}
      <div className="absolute bottom-[22%] left-[5%] flex flex-col items-center">
        <div className="relative w-16 h-16 mb-[-10px]">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-[#22C55E] border-[2.5px] border-[#134E4A] rounded-[50%_50%_0_0] -rotate-12" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-[#4ADE80] border-[2.5px] border-[#134E4A] rounded-[50%_50%_0_0] rotate-12" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-14 bg-[#10B981] border-[2.5px] border-[#134E4A] rounded-[50%_50%_0_0]" />
        </div>
        <div className="w-14 h-12 bg-[#F97316] border-[3.5px] border-[#134E4A] rounded-b-2xl shadow-[2px_2px_0px_#134E4A] flex justify-center items-start pt-1">
          <div className="w-10 h-2 bg-[#134E4A] rounded-full" />
        </div>
      </div>

      {/* Lemari kecil */}
      <div className="absolute bottom-[22%] right-[6%] w-16 h-14 bg-[#0D9488] border-[3.5px] border-[#134E4A] rounded-lg shadow-[3px_3px_0px_#134E4A] flex flex-col justify-between p-1">
        <div className="w-full h-4 bg-[#134E4A] rounded-sm" />
        <div className="w-full h-6 bg-[#CCFBF1] border-[2px] border-[#134E4A] rounded-sm flex items-center justify-center">
          <Star size={12} className="text-[#FBBF24] fill-[#FBBF24]" />
        </div>
      </div>
    </div>
  );
}

export default function KamarTilaPage() {
  const navigate = useNavigate();

  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const setTilaGender = useEconomyStore((s) => s.setTilaGender);
  const equippedAccessory = useEconomyStore((s) => s.equippedAccessory);
  const equippedRoomTheme = useEconomyStore((s) => s.equippedRoomTheme);
  const equipAccessory = useEconomyStore((s) => s.equipAccessory);
  const ownedAccessories = useEconomyStore((s) => s.ownedAccessories);
  const coins = useCoinsBalance();

  const [draftGender, setDraftGender] = useState<TilaGender>(tilaGender);
  const [draftAccessory, setDraftAccessory] = useState<TilaAccessoryType>(
    equippedAccessory as TilaAccessoryType,
  );

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

  const handleToggleDraftGender = (newGender: "boy" | "girl") => {
    triggerTilaReaction("play");
    setDraftGender(newGender);
    setPreviewMood("excited");

    if (newGender === "boy") {
      if (draftAccessory === "hairbow" || draftAccessory === "flowercrown") {
        setDraftAccessory(ownedAccessories.includes("peci") ? "peci" : "none");
      }
      triggerDialogue(
        "Kamar Tito! Keren dengan peci santri. Klik 'Simpan Pengaturan' untuk menyimpan!",
      );
    } else {
      if (draftAccessory === "peci") {
        setDraftAccessory(
          ownedAccessories.includes("hairbow") ? "hairbow" : "none",
        );
      }
      triggerDialogue(
        "Kamar Tila! Anggun dengan pita rambut. Klik 'Simpan Pengaturan' untuk menyimpan!",
      );
    }
  };

  const [filterMode, setFilterMode] = useState<"matched" | "all">("matched");
  const filteredAccessories = ACCESSORIES.filter((item) => {
    if (filterMode === "all") return true;
    return item.category === "all" || item.category === draftGender;
  });

  const handleSelectAccessory = (item: AccessoryConfig) => {
    const isOwned = item.id === "none" || ownedAccessories.includes(item.id);
    if (!isOwned) {
      navigate("/member/ngaji-ceria/warung-santri?tab=kostum");
      return;
    }

    setDraftAccessory(item.id);
    triggerTilaReaction("success");
    setPreviewMood("excited");
    triggerDialogue(
      `Wah, makin cocok pakai ${item.name}! Klik 'Simpan Pengaturan' untuk menyimpan.`,
    );
  };

  const isDirty =
    draftGender !== tilaGender || draftAccessory !== equippedAccessory;

  const handleSaveSettings = () => {
    setTilaGender(draftGender);
    equipAccessory(draftAccessory);
    triggerTilaReaction("success");
    setPreviewMood("excited");
    setPreviewAnimation("bounce");
    const newName = getMascotName(draftGender);
    triggerDialogue(
      `Alhamdulillah, pengaturan tersimpan! Sekarang namaku ${newName}!`,
    );
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
      <header className="relative z-30 px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/member/ngaji-ceria/profile")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border-[3px] border-[#134E4A] bg-white font-black text-xs text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
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
        <RoomDecor gender={draftGender} themeId={equippedRoomTheme} />

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
              size={260}
              direction={direction}
              mood={previewMood}
              animation={previewAnimation}
              gender={draftGender === "girl" ? "girl" : "boy"}
              accessory={draftAccessory}
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
        <div className="flex items-center justify-between gap-3">
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
                  : "bg-white text-[#134E4A] opacity-70"
              }`}
            >
              <User size={12} />
              <span>Tito (Laki-laki)</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleDraftGender("girl")}
              className={`px-3 py-1.5 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                draftGender === "girl"
                  ? "bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#134E4A] -translate-y-0.5"
                  : "bg-white text-[#134E4A] opacity-70"
              }`}
            >
              <User size={12} />
              <span>Tila (Perempuan)</span>
            </button>
          </div>
        </div>

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
              const isOwned =
                item.id === "none" || ownedAccessories.includes(item.id);
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
                        : "border-dashed border-[#134E4A]/40 bg-gray-50 opacity-80"
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
                      ? "Santri Putra"
                      : item.category === "girl"
                        ? "Santri Putri"
                        : "Semua Karakter"}
                  </span>

                  {isDraftSelected ? (
                    <span className="flex items-center justify-center gap-1 w-full py-1.5 rounded-xl bg-[#134E4A] text-white text-[10px] font-black tracking-wide border border-[#134E4A]">
                      <Check size={10} /> Terpilih
                    </span>
                  ) : isOwned ? (
                    <button
                      type="button"
                      onClick={() => handleSelectAccessory(item)}
                      className={`w-full py-1.5 rounded-xl text-white text-[10px] font-black tracking-wide border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer ${
                        isMascotFit ? "bg-[#0D9488]" : "bg-gray-400"
                      }`}
                    >
                      Pilih
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectAccessory(item)}
                      className="w-full py-1.5 rounded-xl bg-[#FEF3C7] text-[#B45309] text-[10px] font-black tracking-wide border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Lock size={10} className="shrink-0" />
                      <span>{item.price}</span>
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
            disabled={!isDirty}
            onClick={handleSaveSettings}
            className={
              isDirty
                ? "ring-2 ring-[#FEF08A] shadow-[4px_4px_0px_#134E4A]"
                : "opacity-100 bg-gray-200 text-gray-500 border-gray-400 shadow-none"
            }
          >
            <Check size={18} />
            <span>
              {isDirty ? "Simpan Pengaturan" : "Pengaturan Tersimpan"}
            </span>
          </StickerButton>
        </div>
      </footer>
    </div>
  );
}
