import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  Star,
  Lock,
  BookOpen,
  Play,
  X,
  ChevronLeft,
  Sun,
  Moon,
  Sparkles,
  Fire,
  Sprout,
  Seedling,
  Snowflake,
  Compass,
} from "../../../../components/ui/CustomIcons";
import { PanduanMembacaModal } from "../../components/PanduanMembacaModal";
import { OutOfEnergyModal } from "../../components/OutOfEnergyModal";
import { ExploreHeader, ExploreStatBadge } from "../../components/ExploreHeader";
import { JuicyStar } from "@/components/ui/JuicyIcons";
import { useEconomyStore, isUnlimitedUser } from "../../hooks/useEconomyStore";
import { useNgajiCeriaStore } from "../../hooks/useNgajiCeriaStore";
import { useAuth } from "@/contexts/AuthContext";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { NGAJI_CERIA_ASSETS } from "../../data/assets";

const TILAWATI_PAGES = [
  {
    page: 1,
    unlocked: true,
    stars: 0,
    arabic: "ا - ب",
    title: "Huruf Alif (ا) & Ba (ب)",
    desc: "Mengenal bunyi huruf dasar dengan harokat fathah.",
  },
  {
    page: 2,
    unlocked: true,
    stars: 0,
    arabic: "ت - ث",
    title: "Huruf Ta (ت) & Tsa (ث)",
    desc: "Mengenal bunyi huruf dasar dengan harokat fathah.",
  },
  {
    page: 3,
    unlocked: false,
    stars: 0,
    arabic: "ج - ح - خ",
    title: "Huruf Jim, Ha, Kho",
    desc: "Mengenal bunyi huruf dasar dengan harokat fathah.",
  },
  {
    page: 4,
    unlocked: false,
    stars: 0,
    arabic: "د - ذ",
    title: "Huruf Dal & Dzal",
    desc: "Lanjutan huruf dasar.",
  },
  {
    page: 5,
    unlocked: false,
    stars: 0,
    arabic: "ر - ز",
    title: "Huruf Ro & Zai",
    desc: "Lanjutan huruf dasar.",
  },
  {
    page: 6,
    unlocked: false,
    stars: 0,
    arabic: "س - ش",
    title: "Huruf Sin & Syin",
    desc: "Lanjutan huruf dasar.",
  },
  {
    page: 7,
    unlocked: false,
    stars: 0,
    arabic: "ص - ض",
    title: "Huruf Shod & Dhod",
    desc: "Lanjutan huruf dasar.",
  },
];

const NODE_X_PATTERNS = [45, 70, 45, 25, 55, 70, 50];
const ITEM_HEIGHT = 170;
const TOP_PADDING = 140;

const MAP_THEMES = {
  1: {
    bg: "bg-[#BAE6FD]",
    canvasBorder: "border-[#854D0E]",
    islandBg: "bg-[#FEF08A]",
    islandBorder: "border-[#854D0E]",
    pathColor: "#DC2626",
    nodeBg: "bg-[#D97706]",
    nodeBorder: "border-[#854D0E]",
    nodeShadow: "shadow-[3px_3px_0px_#854D0E]",
    textColor: "text-[#854D0E]",
    waterColor: "#0284C7",
    islandShape: "rounded-[60%_40%_50%_50%/50%_60%_40%_50%]",
    decor: () => (
      <>
        <div className="absolute top-10 right-10 opacity-70 drop-shadow-md">
          <Sun size={48} className="text-[#38BDF8]" />
        </div>
        <div className="absolute top-1/3 left-4 opacity-50 drop-shadow-md">
          <Sparkles size={36} className="text-[#0284C7]" />
        </div>
      </>
    ),
  },
  2: {
    bg: "bg-[#FDE68A]",
    canvasBorder: "border-[#B45309]",
    islandBg: "bg-[#F59E0B]",
    islandBorder: "border-[#78350F]",
    pathColor: "#78350F",
    nodeBg: "bg-[#B45309]",
    nodeBorder: "border-[#78350F]",
    nodeShadow: "shadow-[3px_3px_0px_#78350F]",
    textColor: "text-[#78350F]",
    waterColor: "#D97706",
    islandShape: "rounded-[30%_70%_40%_60%/60%_30%_70%_40%]",
    decor: () => (
      <>
        <div className="absolute top-12 right-8 opacity-80 drop-shadow-lg">
          <Sun size={52} className="text-[#F59E0B]" />
        </div>
        <div className="absolute top-1/2 left-2 opacity-60 drop-shadow-md">
          <Sparkles size={36} className="text-[#D97706]" />
        </div>
      </>
    ),
  },
  3: {
    bg: "bg-[#86EFAC]",
    canvasBorder: "border-[#064E3B]",
    islandBg: "bg-[#22C55E]",
    islandBorder: "border-[#064E3B]",
    pathColor: "#065F46",
    nodeBg: "bg-[#059669]",
    nodeBorder: "border-[#064E3B]",
    nodeShadow: "shadow-[3px_3px_0px_#064E3B]",
    textColor: "text-[#064E3B]",
    waterColor: "#10B981",
    islandShape: "rounded-[50%_50%_30%_70%/40%_60%_40%_60%]",
    decor: () => (
      <>
        <div className="absolute top-20 right-12 opacity-60 drop-shadow-md">
          <Sprout size={48} className="text-[#059669]" />
        </div>
        <div className="absolute top-2/3 left-6 opacity-70 drop-shadow-md">
          <Seedling size={36} className="text-[#10B981]" />
        </div>
      </>
    ),
  },
  4: {
    bg: "bg-[#E0F2FE]",
    canvasBorder: "border-[#1E40AF]",
    islandBg: "bg-[#F1F5F9]",
    islandBorder: "border-[#1E3A8A]",
    pathColor: "#3B82F6",
    nodeBg: "bg-[#2563EB]",
    nodeBorder: "border-[#1E3A8A]",
    nodeShadow: "shadow-[3px_3px_0px_#1E3A8A]",
    textColor: "text-[#1E3A8A]",
    waterColor: "#93C5FD",
    islandShape: "rounded-[40%_60%_50%_50%/50%_40%_60%_50%]",
    decor: () => (
      <>
        <div className="absolute top-16 right-6 opacity-80 drop-shadow-md">
          <Snowflake size={48} className="text-[#38BDF8]" />
        </div>
        <div className="absolute top-1/2 left-8 opacity-80 drop-shadow-md">
          <Sparkles size={36} className="text-[#60A5FA]" />
        </div>
      </>
    ),
  },
  5: {
    bg: "bg-[#450A0A]",
    canvasBorder: "border-[#991B1B]",
    islandBg: "bg-[#1C1917]",
    islandBorder: "border-[#7F1D1D]",
    pathColor: "#F97316",
    nodeBg: "bg-[#DC2626]",
    nodeBorder: "border-[#7F1D1D]",
    nodeShadow: "shadow-[3px_3px_0px_#7F1D1D]",
    textColor: "text-[#FCA5A5]",
    waterColor: "#B91C1C",
    islandShape: "rounded-[20%_80%_30%_70%/70%_30%_80%_20%]",
    decor: () => (
      <>
        <div className="absolute top-10 right-10 opacity-90 drop-shadow-md">
          <Fire size={52} className="text-[#EF4444]" />
        </div>
        <div className="absolute top-2/3 left-4 opacity-80 drop-shadow-md">
          <Fire size={36} className="text-[#F97316]" />
        </div>
      </>
    ),
  },
  6: {
    bg: "bg-[#1E1B4B]",
    canvasBorder: "border-[#4338CA]",
    islandBg: "bg-[#312E81]",
    islandBorder: "border-[#4C1D95]",
    pathColor: "#C084FC",
    nodeBg: "bg-[#7E22CE]",
    nodeBorder: "border-[#4C1D95]",
    nodeShadow: "shadow-[3px_3px_0px_#4C1D95]",
    textColor: "text-[#E9D5FF]",
    waterColor: "#1E3A8A",
    islandShape: "rounded-[10%_90%_20%_80%/80%_20%_90%_10%]",
    decor: () => (
      <>
        <div className="absolute top-12 right-8 opacity-90 drop-shadow-md">
          <Moon size={52} className="text-[#A855F7]" />
        </div>
        <div className="absolute top-1/2 left-2 opacity-80 drop-shadow-md">
          <Star size={36} className="text-[#FDE047] fill-[#FDE047]" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-90 drop-shadow-md">
          <Sparkles size={40} className="text-[#C084FC]" />
        </div>
      </>
    ),
  },
};

const ISLANDS_POS = [
  { top: 50, left: "5%", width: 290, height: 260 },
  { top: 330, left: "-12%", width: 320, height: 320 },
  { top: 680, left: "15%", width: 310, height: 300 },
  { top: 1020, left: "-5%", width: 340, height: 280 },
];

export default function TilawatiMapPage() {
  const navigate = useNavigate();
  const { jilid: jilidParam, hal: halParam } = useParams<{
    jilid: string;
    hal: string;
  }>();

  const jilid = Number(jilidParam) || 1;
  const hal = Number(halParam) || 1;
  const theme = MAP_THEMES[jilid as keyof typeof MAP_THEMES] || MAP_THEMES[1];

  const [isPanduanOpen, setIsPanduanOpen] = useState(false);
  const [energyEmpty, setEnergyEmpty] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const consumeHeart = useEconomyStore((s: any) => s.consumeHeart);
  const stars = useNgajiCeriaStore((s) => s.stars);
  const totalStars = Object.values(stars).reduce((sum, v) => sum + (v || 0), 0);
  const [selectedNode, setSelectedNode] = useState<
    (typeof TILAWATI_PAGES)[0] | null
  >(null);
  const guideButtonRef = useRef<HTMLButtonElement>(null);

  const [bubbleState, setBubbleState] = useState<{
    visible: boolean;
    shownOnPage: string | null;
  }>({ visible: false, shownOnPage: null });

  const pageKey = `${jilid}-${hal}`;

  const totalHeight = TOP_PADDING + TILAWATI_PAGES.length * ITEM_HEIGHT + 120;

  const nodePositions = TILAWATI_PAGES.map((_, i) => ({
    xPct: NODE_X_PATTERNS[i % NODE_X_PATTERNS.length],
    yPx: TOP_PADDING + i * ITEM_HEIGHT,
  }));

  const pathD = nodePositions.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.xPct} ${pt.yPx}`;
    const prev = nodePositions[i - 1];
    const midY = (prev.yPx + pt.yPx) / 2;
    return `${acc} C ${prev.xPct} ${midY}, ${pt.xPct} ${midY}, ${pt.xPct} ${pt.yPx}`;
  }, "");

  const handleOpenPanduan = () => {
    triggerBibiReaction("click");
    setIsPanduanOpen(true);
  };

  const handleNodeClick = (nodeData: (typeof TILAWATI_PAGES)[0]) => {
    if (!nodeData.unlocked) return;
    triggerBibiReaction("click");
    setSelectedNode(nodeData);
  };

  const { user, groupId } = useAuth();
  const isVip = useEconomyStore((s: any) => s.isVip);
  const isUnlimited = isUnlimitedUser(user as any, isVip, groupId as any);

  const handleStartLearning = async (practiceOverride?: boolean) => {
    if (!selectedNode) return;
    const isPractice =
      practiceOverride !== undefined ? practiceOverride : isPracticeMode;
    if (!isPractice && !isUnlimited) {
      if (!(await consumeHeart())) {
        setEnergyEmpty(true);
        return;
      }
    }
    triggerBibiReaction("play");
    const targetNode = selectedNode;
    setSelectedNode(null);
    navigate(
      `/member/ngaji-ceria/quiz/play?jilid=${jilid}&hal=${targetNode.page}${
        isPractice ? "&practice=true" : ""
      }`,
    );
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
      {/* Header Terstandarisasi Peta Tilawati [Hati] [Koin] [Bintang] */}
      <ExploreHeader
        themeScope="tilawati"
        themeColorClass="bg-[#E0F2FE]"
        borderColorClass="border-[#0D9488]"
        shadowClass="shadow-[0_3px_0px_#0D9488]"
        textColorClass="text-[#0369A1]"
        onBack={() => navigate("/member/ngaji-ceria/explore/tilawati")}
        backAriaLabel="Kembali ke Daftar Jilid"
        backClass="px-3 py-2 min-h-[40px] w-auto h-auto rounded-xl border-2 border-[#0D9488] shadow-[2px_2px_0px_#0D9488]"
        backContent={
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black">
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Daftar Jilid</span>
          </div>
        }
        title={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-xs font-black text-[#0369A1] border-2 border-[#0D9488] shadow-[2px_2px_0px_#0D9488]">
              <Sparkles size={12} className="text-[#0D9488]" /> Jilid {jilid}
            </span>
          </div>
        }
        extraBadge={
          <ExploreStatBadge
            icon={<JuicyStar size={18} className="text-[#F59E0B] fill-[#F59E0B] shrink-0" />}
            value={`${totalStars}/93`}
            title={`Total Bintang: ${totalStars}/93`}
          />
        }
        rightAction={
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setIsPracticeMode(!isPracticeMode)}
              className={`flex items-center gap-1 sm:gap-1.5 rounded-xl border-2 border-[#0D9488] px-2 sm:px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_#0D9488] active:translate-y-[1px] transition-all cursor-pointer ${
                isPracticeMode
                  ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#042F2E]"
                  : "bg-white text-[#0369A1] hover:bg-sky-50"
              }`}
            >
              <Compass
                size={14}
                className={isPracticeMode ? "text-white" : "text-[#0D9488]"}
              />
              <span className="hidden sm:inline">
                {isPracticeMode ? "Latihan: ON" : "Latihan"}
              </span>
            </button>

            <button
              type="button"
              ref={guideButtonRef}
              onClick={handleOpenPanduan}
              className="flex items-center gap-1 sm:gap-1.5 rounded-xl border-2 border-[#0D9488] bg-[#FEF08A] px-2 sm:px-2.5 py-1 text-xs font-black text-[#0369A1] shadow-[2px_2px_0px_#0D9488] active:translate-y-[1px] hover:bg-[#FDE047] transition-all cursor-pointer"
            >
              <BookOpen size={14} className="text-[#0369A1]" />
              <span className="hidden sm:inline">Panduan</span>
            </button>
          </div>
        }
      />

      <div
        className={`${theme.bg} min-h-full pb-24 relative overflow-hidden border-[6px] ${theme.canvasBorder}/60 rounded-3xl m-2 shadow-inner transition-colors duration-500`}
      >
        <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 30 80 Q 60 70, 90 80 T 150 80"
              fill="none"
              stroke={theme.waterColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 200 150 Q 230 140, 260 150 T 320 150"
              fill="none"
              stroke={theme.waterColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 50 450 Q 80 440, 110 450 T 170 450"
              fill="none"
              stroke={theme.waterColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 220 600 Q 250 590, 280 600 T 340 600"
              fill="none"
              stroke={theme.waterColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 70 850 Q 100 840, 130 850 T 190 850"
              fill="none"
              stroke={theme.waterColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 180 1100 Q 210 1090, 240 1100 T 300 1100"
              fill="none"
              stroke={theme.waterColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {theme.decor()}

          {ISLANDS_POS.map((island, idx) => (
            <div
              key={`island-${idx}`}
              className={`absolute ${theme.islandBg} border-[4px] ${theme.islandBorder} shadow-[4px_4px_0px_rgba(0,0,0,0.2)] overflow-hidden ${theme.islandShape} transition-colors duration-500`}
              style={{
                left: island.left,
                top: `${island.top}px`,
                width: `${island.width}px`,
                height: `${island.height}px`,
              }}
            >
              <svg
                className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
                viewBox="0 0 300 300"
                preserveAspectRatio="none"
              >
                <path
                  d="M 40 150 Q 60 60, 160 50 T 270 120 Q 290 200, 200 270 T 80 250 Q 10 200, 40 150 Z"
                  fill="none"
                  stroke={theme.textColor}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 90 150 Q 100 90, 170 80 T 240 140 Q 250 200, 180 230 T 100 210 Q 70 180, 90 150 Z"
                  fill="none"
                  stroke={theme.textColor}
                  strokeWidth="2.5"
                />
                <path
                  d="M 120 150 Q 130 110, 170 110 T 200 150 Q 200 180, 170 190 T 120 170 Q 110 160, 120 150 Z"
                  fill="rgba(255,255,255,0.2)"
                  stroke={theme.textColor}
                  strokeWidth="2"
                />
                <circle cx="160" cy="150" r="3" fill={theme.textColor} />
                <path
                  d="M 200 60 Q 230 40, 260 60 T 280 110 Q 260 140, 230 130 T 190 100 Q 190 70, 200 60 Z"
                  fill="none"
                  stroke={theme.textColor}
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <path
                  d="M 210 80 Q 230 70, 240 90 T 240 110 Q 230 120, 215 115 T 200 95 Q 200 85, 210 80 Z"
                  fill="rgba(255,255,255,0.2)"
                  stroke={theme.textColor}
                  strokeWidth="2"
                />
                <circle cx="220" cy="95" r="2" fill={theme.textColor} />
              </svg>

              <div
                className={`absolute inset-2 rounded-[inherit] border-2 ${theme.islandBorder}/30 opacity-50 pointer-events-none`}
              />

              <div className="absolute top-6 left-8 opacity-90">
                <svg width="40" height="40" viewBox="0 0 35 35">
                  <path
                    d="M17 2 L3 30 L31 30 Z"
                    fill={theme.textColor}
                    stroke={theme.islandBorder}
                    strokeWidth="2"
                  />
                  <rect x="15" y="30" width="4" height="6" fill="#78350F" />
                </svg>
              </div>

              <div className="absolute bottom-6 right-10 opacity-90">
                <svg width="32" height="32" viewBox="0 0 35 35">
                  <path
                    d="M17 2 L3 30 L31 30 Z"
                    fill={theme.textColor}
                    stroke={theme.islandBorder}
                    strokeWidth="2"
                  />
                  <rect x="15" y="30" width="4" height="6" fill="#78350F" />
                </svg>
              </div>
            </div>
          ))}
        </div>



        <div
          className="relative max-w-md mx-auto w-full z-10"
          style={{ height: totalHeight }}
        >
          <svg
            className="absolute top-0 left-0 pointer-events-none z-0"
            width="100%"
            height={totalHeight}
            viewBox={`0 0 100 ${totalHeight}`}
            preserveAspectRatio="none"
          >
            <path
              d={pathD}
              stroke={theme.pathColor}
              strokeOpacity="0.85"
              strokeWidth="5"
              strokeDasharray="8 8"
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          </svg>

          {TILAWATI_PAGES.map((item, index) => {
            const pos = nodePositions[index];
            const isUnlocked = item.unlocked;
            const isFirst = index === 0;

            return (
              <div
                key={item.page}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${pos.xPct}%`,
                  top: `${pos.yPx}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {isFirst && (
                  <div className="absolute -top-[75px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`relative w-[52px] h-[52px] drop-shadow-[3px_3px_0px_${theme.nodeBorder}] z-10`}
                    >
                      <div
                        className={`w-full h-full ${theme.islandBg} border-[3px] ${theme.nodeBorder} rounded-full rounded-br-none rotate-45 flex items-center justify-center`}
                      >
                        <div className="w-[82%] h-[82%] rounded-full overflow-hidden -rotate-45 bg-white border-2 border-black/10">
                          <img
                            src={
                              NGAJI_CERIA_ASSETS?.avatarAnakBersorak ||
                              NGAJI_CERIA_ASSETS?.avatarAnak ||
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23854D0E'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"
                            }
                            alt="Maskot Ngaji"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23854D0E'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ scale: [1, 0.6, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-6 h-1.5 bg-black/40 rounded-[100%] blur-[1.5px] mt-[-8px] z-0"
                    />
                  </div>
                )}

                <div className="flex gap-1 mb-2 relative z-10">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= item.stars
                          ? "text-[#F59E0B] fill-[#F59E0B]"
                          : "text-black/20 fill-black/20"
                      }
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleNodeClick(item)}
                  disabled={!isUnlocked}
                  className={`relative flex items-center justify-center w-[68px] h-[68px] rounded-full border-[3px] transition-all z-10 ${
                    isUnlocked
                      ? `${theme.nodeBg} ${theme.nodeBorder} ${theme.nodeShadow} active:translate-y-[2px] active:shadow-none`
                      : `bg-black/10 ${theme.nodeBorder}/50 shadow-[2px_2px_0px_${theme.nodeBorder}]/40 cursor-not-allowed`
                  }`}
                >
                  {isUnlocked ? (
                    <span className="text-3xl font-black text-white drop-shadow-sm">
                      {item.page}
                    </span>
                  ) : (
                    <Lock size={24} className="text-white/40" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedNode && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNode(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] border-t-[3px] border-x-[3px] ${theme.nodeBorder} p-6 max-w-md mx-auto`}
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5" />

                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1.5 rounded-full ${theme.islandBg} ${theme.textColor} text-xs font-black border-2 ${theme.nodeBorder}`}
                  >
                    Jilid {jilid} Hal {selectedNode.page}
                  </span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border-2 ${theme.nodeBorder} ${theme.textColor} shadow-[2px_2px_0px_${theme.nodeBorder}] active:translate-y-[1px] active:shadow-none transition-all`}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div
                  className={`w-full ${theme.islandBg}/20 border-[3px] border-dashed ${theme.nodeBorder} rounded-2xl py-6 flex items-center justify-center mb-5`}
                >
                  <span className={`text-4xl font-arabic ${theme.textColor}`}>
                    {selectedNode.arabic}
                  </span>
                </div>

                <div className="text-center mb-4">
                  <h2 className={`text-lg font-black ${theme.textColor}`}>
                    {selectedNode.title}
                  </h2>
                  <p className={`text-xs font-bold ${theme.textColor}/60 mt-1`}>
                    {selectedNode.desc}
                  </p>
                </div>

                <div className="flex justify-center gap-2 mb-5">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={24}
                      className={
                        s <= selectedNode.stars
                          ? "text-[#F59E0B] fill-[#F59E0B]"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>

                <div
                  className={`flex items-center justify-center gap-3 mb-4 ${theme.islandBg}/10 rounded-xl py-2.5 px-3 border-2 ${theme.nodeBorder}/20`}
                >
                  <div
                    className={`flex items-center gap-1 text-[11px] font-bold ${theme.textColor}`}
                  >
                    <Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                    {isPracticeMode ? "0 Poin (Latihan)" : "+30 Poin"}
                  </div>
                  <div className={`w-px h-3 ${theme.nodeBorder}/20`} />
                  <div
                    className={`flex items-center gap-1 text-[11px] font-bold ${theme.textColor}`}
                  >
                    <BookOpen size={12} className={theme.textColor} />
                    Iqro {jilid}
                  </div>
                </div>

                {/* Mode Latihan Toggle Box */}
                <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-[#134E4A] bg-[#F0FDF4] mb-4">
                  <div className="text-left">
                    <p className="text-xs font-black text-[#134E4A] flex items-center gap-1.5">
                      <Compass size={14} className="text-[#0D9488]" /> Mode Latihan
                    </p>
                    <p className="text-[10px] font-bold text-[#134E4A]/60">
                      Bebas tanpa nyawa & tanpa perolehan bintang
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPracticeMode(!isPracticeMode)}
                    className={`w-12 h-6 rounded-full border-2 border-[#134E4A] transition-colors p-0.5 flex items-center ${
                      isPracticeMode
                        ? "bg-[#0D9488] justify-end"
                        : "bg-gray-200 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white border border-[#134E4A] shadow-sm" />
                  </button>
                </div>

                <button
                  onClick={() => handleStartLearning()}
                  className={`w-full ${
                    isPracticeMode ? "bg-[#0D9488]" : theme.nodeBg
                  } text-white font-black text-sm py-4 rounded-2xl border-[3px] ${
                    theme.nodeBorder
                  } shadow-[3px_3px_0px_${theme.nodeBorder}] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2`}
                >
                  {isPracticeMode ? "Mulai Latihan (Bebas Nyawa)" : "Mulai Belajar (1 Hati)"}{" "}
                  <Play size={14} className="fill-white" />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <PanduanMembacaModal
          open={isPanduanOpen}
          onClose={() => setIsPanduanOpen(false)}
        />

        <OutOfEnergyModal
          visible={energyEmpty}
          type="heart"
          onClose={() => setEnergyEmpty(false)}
        />
      </div>
    </NgajiCeriaLayout>
  );
}
