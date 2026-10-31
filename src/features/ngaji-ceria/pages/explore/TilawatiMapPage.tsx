import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { isUstadzUser, isTartilaAdmin } from "@/lib/roles";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  Star,
  Lock,
  BookOpen,
  Play,
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
import {
  AvatarAnakBersorakSvg,
  AvatarSantriAccessory,
  AvatarSantriSvg,
} from "../../../../components/ui/Illustrations";
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

const NODE_X_PATTERNS = [45, 70, 45, 25, 55, 70, 50];
const ITEM_HEIGHT = 170;
const TOP_PADDING = 220;

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
  { top: 120, left: "5%", width: 290, height: 260 },
  { top: 410, left: "-12%", width: 320, height: 320 },
  { top: 760, left: "15%", width: 310, height: 300 },
  { top: 1100, left: "-5%", width: 340, height: 280 },
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
  const { user } = useAuth();
  const isBypass = isUstadzUser(user) || isTartilaAdmin(user?.role);
  const { currentJilid: progressJilidStr, currentPage } =
    useNgajiCeriaProgress();
  const progressJilidNum =
    parseInt(progressJilidStr.replace("jilid-", ""), 10) || 1;

  const consumeHeart = useEconomyStore((s: any) => s.consumeHeart);
  const tilaGender = useEconomyStore((s) => s.tilaGender);
  const stars = useNgajiCeriaStore((s) => s.stars);
  const totalStars = Object.values(stars).reduce((sum, v) => sum + (v || 0), 0);
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

  const totalHeight = TOP_PADDING + currentPages.length * ITEM_HEIGHT + 120;

  const nodePositions = currentPages.map((_, i) => ({
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
      {/* Header Terstandarisasi (Hanya Back, Judul Jilid, & Bintang) */}
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
            icon={
              <JuicyStar
                size={18}
                className="text-[#F59E0B] fill-[#F59E0B] shrink-0"
              />
            }
            value={`${totalStars}/93`}
            title={`Total Bintang: ${totalStars}/93`}
          />
        }
      />

      <div
        className={`${theme.bg} min-h-full pb-24 relative overflow-hidden border-[6px] ${theme.canvasBorder}/60 rounded-3xl m-2 shadow-inner transition-colors duration-500`}
      >
        {/* 🟢 TOMBOL FLOATING DI POJOK KANAN ATAS KONTEN 🟢 */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 flex flex-col gap-2 items-end">
          <button
            type="button"
            onClick={() => setIsPracticeMode(!isPracticeMode)}
            className={`flex items-center gap-1.5 rounded-xl border-2 border-[#0D9488] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#0D9488] active:translate-y-[1px] transition-all cursor-pointer ${
              isPracticeMode
                ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#042F2E]"
                : "bg-white text-[#0369A1] hover:bg-sky-50"
            }`}
          >
            <Compass
              size={16}
              className={isPracticeMode ? "text-white" : "text-[#0D9488]"}
            />
            <span>{isPracticeMode ? "Latihan: ON" : "Mode Latihan"}</span>
          </button>

          <button
            type="button"
            ref={guideButtonRef}
            onClick={handleOpenPanduan}
            className="flex items-center gap-1.5 rounded-xl border-2 border-[#0D9488] bg-[#FEF08A] px-3 py-1.5 text-xs font-black text-[#0369A1] shadow-[2px_2px_0px_#0D9488] active:translate-y-[1px] hover:bg-[#FDE047] transition-all cursor-pointer"
          >
            <BookOpen size={16} className="text-[#0369A1]" />
            <span>Panduan</span>
          </button>
        </div>

        <div className="absolute inset-0 pointer-events-none z-0 select-none overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* ... (KODE SVG GARIS AIR TETAP SAMA) ... */}
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
              {/* ... (KODE SVG PULAU TETAP SAMA) ... */}
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

          {currentPages.map((item, index) => {
            const pos = nodePositions[index];
            const nodeStars = stars[`jilid-${jilid}-hal-${item.page}`] || 0;
            const isUnlocked =
              isBypass ||
              item.page === 1 ||
              (stars[`jilid-${jilid}-hal-${item.page - 1}`] || 0) === 3;
            const isCurrentNode = item.page === activePage;

            const nodeData: MapNodeItemWithMeta = {
              ...item,
              jilid,
              unlocked: isUnlocked,
              stars: nodeStars,
            };

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
                {isCurrentNode && (
                  <div className="absolute -top-[85px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
                    {/* PIN AVATAR DENGAN ANIMASI */}
                    <motion.div
                      initial={{ scale: 0, y: 20, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        y: [0, -10, 0],
                        rotate: [-4, 4, -4],
                      }}
                      transition={{
                        y: {
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        rotate: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                        scale: { type: "spring", bounce: 0.6, duration: 0.8 },
                        opacity: { duration: 0.3 },
                      }}
                      className={`relative w-[56px] h-[56px] drop-shadow-[3px_3px_0px_${theme.nodeBorder}] z-10`}
                    >
                      <div
                        className={`w-full h-full ${theme.islandBg} border-[3px] ${theme.nodeBorder} rounded-full rounded-br-none rotate-45 flex items-center justify-center`}
                      >
                        <div className="w-[88%] h-[88%] rounded-full overflow-hidden -rotate-45 bg-white flex items-center justify-center">
                          <AvatarSantriSvg
                            size={46}
                            gender={resolveMascotGender(tilaGender)}
                            mood="happy"
                            className="shrink-0 scale-110 mt-1"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{
                        scale: [1, 0.7, 1],
                        opacity: [0.4, 0.15, 0.4],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-7 h-2 bg-black/50 rounded-[100%] blur-[1.5px] mt-1.5 z-0"
                    />
                  </div>
                )}

                <div className="flex gap-1 mb-2 relative z-10">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= nodeStars
                          ? "text-[#F59E0B] fill-[#F59E0B]"
                          : "text-black/20 fill-black/20"
                      }
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleNodeClick(nodeData)}
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

        <AppBottomSheet
          isOpen={Boolean(selectedNode)}
          onClose={() => setSelectedNode(null)}
          title={selectedNode?.title ?? ""}
        >
          {selectedNode && (
            <>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1.5 rounded-full ${theme.islandBg} ${theme.textColor} text-xs font-black border-2 ${theme.nodeBorder}`}
                >
                  Jilid {selectedNode.jilid} Hal {selectedNode.page}
                </span>
              </div>

              <div
                className={`w-full ${theme.islandBg}/20 border-[3px] border-dashed ${theme.nodeBorder} rounded-2xl py-6 flex items-center justify-center mb-5`}
              >
                <span className={`text-4xl font-arabic ${theme.textColor}`}>
                  {selectedNode.arabic}
                </span>
              </div>

              <div className="text-center mb-4">
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
                  Tilawati {selectedNode.jilid}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-[#134E4A] bg-[#F0FDF4] mb-4">
                <div className="text-left">
                  <p className="text-xs font-black text-[#134E4A] flex items-center gap-1.5">
                    <Compass size={14} className="text-[#0D9488]" /> Mode
                    Latihan
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

              <StickerButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => handleStartLearning(isPracticeMode)}
                className={isPracticeMode ? "bg-[#0D9488] text-white" : ""}
              >
                {isPracticeMode
                  ? "Mulai Latihan (Bebas Nyawa)"
                  : "Mulai Belajar (1 Hati)"}{" "}
                <Play size={16} className="fill-white" />
              </StickerButton>
            </>
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
      </div>
    </NgajiCeriaLayout>
  );
}
