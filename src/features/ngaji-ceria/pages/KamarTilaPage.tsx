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
} from "@/components/ui/CustomIcons";
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
    speeches: [
      "Eh, kaget aku!",
      "Wah, ada apa?!",
      "Astaghfirullah, terkejut!",
    ],
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
];

export default function KamarTilaPage() {
  const navigate = useNavigate();

  // Global store values
  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const setTilaGender = useEconomyStore((s) => s.setTilaGender);
  const equippedAccessory = useEconomyStore((s) => s.equippedAccessory);
  const equipAccessory = useEconomyStore((s) => s.equipAccessory);
  const ownedAccessories = useEconomyStore((s) => s.ownedAccessories);
  const coins = useCoinsBalance();

  // Nama maskot HANYA diambil dari nilai yang sudah tersimpan di store global
  const savedMascotName = getMascotName(tilaGender);

  // Draft State (lokal) agar preview real-time sebelum user klik "Simpan Pengaturan"
  const [draftGender, setDraftGender] = useState<TilaGender>(tilaGender);
  const [draftAccessory, setDraftAccessory] = useState<TilaAccessoryType>(
    equippedAccessory as TilaAccessoryType,
  );

  // State untuk arah hadap & pose preview
  const [direction, setDirection] = useState<TilaDirection>("front");
  const [previewMood, setPreviewMood] = useState<TilaMood>("happy");
  const [previewAnimation, setPreviewAnimation] = useState<TilaAnimation>("float");
  const [previewHoldItem, setPreviewHoldItem] = useState<TilaHoldItem>("star");

  // Percakapan balon kata
  const [speech, setSpeech] = useState<string | null>(null);
  const speechTimerRef = useRef<number | null>(null);

  // Refs untuk horizontal scroll Uji Ekspresi
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

  // Sambutan hangat saat tiba di kamar
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

  // Saat maskot di-tap oleh user, pilih acak dari pose baru
  const handleTapMascot = () => {
    triggerTilaReaction("click");
    const pick = TAP_REACTIONS[Math.floor(Math.random() * TAP_REACTIONS.length)];
    setPreviewMood(pick.mood);
    setPreviewAnimation(pick.animation);
    const speechText =
      pick.speeches[Math.floor(Math.random() * pick.speeches.length)];
    triggerDialogue(speechText);
  };

  // Memutar arah hadap maskot
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

  // Ganti gender pada draft (lokal)
  const handleToggleDraftGender = (newGender: "boy" | "girl") => {
    triggerTilaReaction("play");
    setDraftGender(newGender);
    setPreviewMood("excited");

    // Otomatis pasangkan aksesoris yang serasi pada draft jika beralih gender
    if (newGender === "boy") {
      if (draftAccessory === "hairbow" || draftAccessory === "flowercrown") {
        setDraftAccessory(ownedAccessories.includes("peci") ? "peci" : "none");
      }
      triggerDialogue(
        "Kamar Tito! Keren dengan peci santri. Klik 'Simpan Pengaturan' untuk menyimpan!",
      );
    } else {
      if (draftAccessory === "peci") {
        setDraftAccessory(ownedAccessories.includes("hairbow") ? "hairbow" : "none");
      }
      triggerDialogue(
        "Kamar Tila! Anggun dengan pita rambut. Klik 'Simpan Pengaturan' untuk menyimpan!",
      );
    }
  };

  // Filter koleksi aksesoris: "matched" (sesuai karakter aktif) atau "all"
  const [filterMode, setFilterMode] = useState<"matched" | "all">("matched");
  const filteredAccessories = ACCESSORIES.filter((item) => {
    if (filterMode === "all") return true;
    return item.category === "all" || item.category === draftGender;
  });

  // Pilih aksesoris pada draft (lokal)
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

  // Tombol Simpan Pengaturan
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

  // Uji Ekspresi & Pose
  const handleSelectExpression = (opt: ExpressionOption) => {
    triggerTilaReaction("click");
    setPreviewMood(opt.mood);
    setPreviewAnimation(opt.animation);
    if (opt.holdItem) {
      setPreviewHoldItem(opt.holdItem);
    }
    triggerDialogue(opt.speech);
  };

  // Fungsi scroll tombol chevron kiri/kanan
  const scrollExpressions = (direction: "left" | "right") => {
    if (!exprScrollRef.current) return;
    const scrollAmount = 180;
    exprScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Mouse drag-to-scroll handler
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
      {/* Top Header Navigation */}
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

      {/* Main Room Viewport */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-0 overflow-y-auto">
        {/* Wall Decorative Stickers */}
        <div className="absolute top-4 left-6 pointer-events-none opacity-90 hidden sm:block">
          <div className="px-3 py-1.5 rounded-xl border-[2px] border-[#134E4A] bg-[#CCFBF1] shadow-[2px_2px_0px_#134E4A] text-[10px] font-black text-[#134E4A] flex items-center gap-1">
            <Sparkles size={12} className="text-[#0D9488]" />
            <span>Kamar Belajar</span>
          </div>
        </div>

        <div className="absolute top-4 right-6 pointer-events-none opacity-90 hidden sm:block">
          <div className="px-3 py-1.5 rounded-xl border-[2px] border-[#134E4A] bg-[#FCE7F3] shadow-[2px_2px_0px_#134E4A] text-[10px] font-black text-[#BE185D] flex items-center gap-1">
            <Crown size={12} className="text-[#DB2777]" />
            <span>Santri Teladan</span>
          </div>
        </div>

        {/* Speech Bubble */}
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

        {/* Mascot Centerpiece (Preview Real-Time Menggunakan Draft State) */}
        <motion.div
          initial={{ x: 340, y: -70, rotate: -16, scale: 0.75 }}
          animate={{ x: 0, y: 0, rotate: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 85,
            damping: 14,
            duration: 1.2,
          }}
          className="relative flex flex-col items-center justify-center"
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

            {/* Tap Hint Chip */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] shadow-[1px_1px_0px_#134E4A] text-[10px] font-black text-[#134E4A] pointer-events-none flex items-center gap-1"
            >
              <span>Ketuk {getMascotName(draftGender)}!</span>
            </motion.div>
          </div>

          {/* Cozy Room Floor Rug under Mascot */}
          <div className="w-56 h-10 -mt-2 rounded-[50%] border-[3px] border-[#134E4A] bg-[#A7F3D0] shadow-[2px_2px_0px_#134E4A] -z-10 flex items-center justify-center">
            <div className="w-48 h-6 rounded-[50%] border border-dashed border-[#134E4A]/40" />
          </div>
        </motion.div>

        {/* Sprite Rotation Control */}
        <div className="mt-5 flex items-center gap-3">
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

        {/* SECTION: UJI EKSPRESI & POSE (Scrollable Tanpa Emoticon) */}
        <div className="w-full max-w-md mx-auto mt-4 px-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#134E4A]">
              Uji Ekspresi & Pose
            </span>

            {/* Tombol Panah Scroll Kiri & Kanan */}
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

          {/* Container Scroll dengan Dukungan Touch Pan-X dan Mouse Drag */}
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

      {/* Bottom Customization Panel */}
      <footer className="relative z-30 rounded-t-[32px] border-t-[3.5px] border-x-[3.5px] border-[#134E4A] bg-white p-5 shadow-[0px_-6px_0px_#134E4A] space-y-4">
        {/* Row 1: Gender / Persona Switcher */}
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

        {/* Row 2: Wardrobe / Accessories Carousel */}
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
                  {/* Category Pill Tag */}
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

        {/* Row 3: Tombol Simpan Pengaturan (Sticker Style) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveSettings}
            className={`w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDirty
                ? "bg-[#0D9488] text-white shadow-[4px_4px_0px_#134E4A] active:translate-y-0.5 active:shadow-none hover:bg-[#0F766E] ring-2 ring-[#FEF08A]"
                : "bg-[#FEF08A] text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <Check size={18} />
            <span>
              Simpan Pengaturan
              {isDirty ? " (Perubahan Belum Disimpan)" : ""}
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}
