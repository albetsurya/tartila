import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  Sparkles,
  RefreshCw,
  Search,
  X,
  BookOpen,
  Fire,
  Trophy,
  Quran,
  Crown,
  Sprout,
  PaperBoatSvg,
  type SvgProps,
} from "../../../../components/ui/CustomIcons";
import { LenteraIcon } from "../../components/LenteraIcon";
import {
  TAHFIDZ_KATEGORI,
  getTargetsByKategori,
  type TahfidzKategori,
  type TahfidzTarget,
} from "../../data/tahfidzData";
import { useTahfidz, getSurahProgress } from "../../hooks/useTahfidz";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { everyAyahAudio } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

interface AyahData {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audioUrl: string;
}

type SurahVisualCategory =
  | "sun"
  | "night"
  | "dawn"
  | "elephant"
  | "botanic"
  | "water"
  | "quake"
  | "crown"
  | "time"
  | "sanctuary"
  | "summit";

interface SurahVisualMeta {
  category: SurahVisualCategory;
  shapeClass: string;
  posLabel: string;
  badgeBg: string;
  badgeText: string;
}

/** Menentukan bentuk kartu, label pos, dan kategori ilustrasi SVG berdasarkan judul/arti surah */
function getSurahVisualMeta(
  namaLatin: string,
  arti: string,
  index: number,
  isComplete: boolean,
): SurahVisualMeta {
  const text = `${namaLatin} ${arti}`.toLowerCase();

  // Variasi bentuk pahatan batu tebing yang organik
  const rockShapes = [
    "rounded-[28px_14px_26px_12px]",
    "rounded-[14px_28px_12px_26px]",
    "rounded-[24px_20px_14px_28px]",
    "rounded-[18px_26px_28px_14px]",
  ];
  const shapeClass = isComplete
    ? "rounded-[28px_28px_18px_18px]"
    : rockShapes[index % rockShapes.length];

  if (/(syams|duha|dhuha|matahari|siang)/.test(text)) {
    return {
      category: "sun",
      shapeClass,
      posLabel: "Pos Lembah Mentari",
      badgeBg: "bg-[#FEF08A]",
      badgeText: "text-[#1E293B]",
    };
  }
  if (
    /(lail|tariq|thariq|buruj|qadr|takwir|infitar|malam|bintang)/.test(text)
  ) {
    return {
      category: "night",
      shapeClass,
      posLabel: "Pos Puncak Bintang",
      badgeBg: "bg-[#312E81]",
      badgeText: "text-[#FEF08A]",
    };
  }
  if (
    /(fajr|falaq|insyiqaq|syarh|insyirah|fajar|subuh|terbelah|kelapangan)/.test(
      text,
    )
  ) {
    return {
      category: "dawn",
      shapeClass,
      posLabel: "Pos Cakrawala Fajar",
      badgeBg: "bg-[#FDBA74]",
      badgeText: "text-[#1E293B]",
    };
  }
  if (/(fil|gajah)/.test(text)) {
    return {
      category: "elephant",
      shapeClass,
      posLabel: "Pos Batu Gajah",
      badgeBg: "bg-[#E2E8F0]",
      badgeText: "text-[#1E293B]",
    };
  }
  if (/(tin|zaitun|buah|lahab|masad|humazah|kafirun)/.test(text)) {
    return {
      category: "botanic",
      shapeClass,
      posLabel: "Pos Hutan Lereng",
      badgeBg: "bg-[#BBF7D0]",
      badgeText: "text-[#14532D]",
    };
  }
  if (/(kautsar|kausar|ma'un|maun|nikmat|sungai|air)/.test(text)) {
    return {
      category: "water",
      shapeClass,
      posLabel: "Pos Mata Air Puncak",
      badgeBg: "bg-[#BAE6FD]",
      badgeText: "text-[#0C4A6E]",
    };
  }
  if (
    /(zalzalah|qari'ah|qariah|ghasyiyah|waqi'ah|naba|haqqah|guncangan|kiamat)/.test(
      text,
    )
  ) {
    return {
      category: "quake",
      shapeClass,
      posLabel: "Pos Tebing Terjal",
      badgeBg: "bg-[#FECACA]",
      badgeText: "text-[#7F1D1D]",
    };
  }
  if (
    /(mulk|nasr|nashr|a'la|ala|ikhlas|kerajaan|pertolongan|mahkota|tinggi|esa)/.test(
      text,
    )
  ) {
    return {
      category: "crown",
      shapeClass,
      posLabel: "Pos Mahkota Puncak",
      badgeBg: "bg-[#FDE047]",
      badgeText: "text-[#1E293B]",
    };
  }
  if (
    /(asr|ashr|adiyat|takatsur|abasa|mutaffifin|waktu|masa|kuda)/.test(text)
  ) {
    return {
      category: "time",
      shapeClass,
      posLabel: "Pos Kompas Waktu",
      badgeBg: "bg-[#FDE68A]",
      badgeText: "text-[#78350F]",
    };
  }
  if (
    /(nas|balad|quraisy|alaq|bayyinah|kahf|yasin|rahman|manusia|negeri|kota|baca)/.test(
      text,
    )
  ) {
    return {
      category: "sanctuary",
      shapeClass,
      posLabel: "Pos Kemah Lentera",
      badgeBg: "bg-[#E9D5FF]",
      badgeText: "text-[#3B0764]",
    };
  }

  return {
    category: "summit",
    shapeClass,
    posLabel: "Pos Tangga Batu",
    badgeBg: "bg-[#1E293B]",
    badgeText: "text-[#FEF08A]",
  };
}

/** ── ILUSTRASI SVG TEMATIK BERDASARKAN JUDUL SURAH ── */
const SurahThemeSvg = ({
  category,
  className = "w-14 h-14",
}: {
  category: SurahVisualCategory;
  className?: string;
}) => {
  switch (category) {
    case "sun":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Sinar & Matahari di Atas Puncak */}
          <circle
            cx="32"
            cy="26"
            r="13"
            fill="#FACC15"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <line
            x1="32"
            y1="6"
            x2="32"
            y2="10"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="14"
            y1="14"
            x2="17"
            y2="17"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="50"
            y1="14"
            x2="47"
            y2="17"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <polygon
            points="8,56 26,32 42,56"
            fill="#64748B"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points="28,56 44,36 58,56"
            fill="#475569"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "night":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Bulan Sabit & Bintang di Puncak Malam */}
          <path
            d="M38 12 A12 12 0 1 0 50 28 A9 9 0 1 1 38 12 Z"
            fill="#FEF08A"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="18,14 20,19 25,19 21,22 22,27 18,24 14,27 15,22 11,19 16,19"
            fill="#FACC15"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <polygon
            points="10,56 32,26 54,56"
            fill="#334155"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points="32,26 24,37 32,34 40,37"
            fill="#F8FAFC"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "dawn":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Cakrawala Fajar Membelah Dua Tebing */}
          <path
            d="M16 48 A16 16 0 0 1 48 48 Z"
            fill="#FB923C"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <polygon
            points="4,56 22,24 32,56"
            fill="#475569"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points="32,56 42,24 60,56"
            fill="#64748B"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <line
            x1="32"
            y1="10"
            x2="32"
            y2="20"
            stroke="#FEF08A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "elephant":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Siluet Gajah & Batu Gunung */}
          <rect
            x="18"
            y="22"
            width="28"
            height="22"
            rx="10"
            fill="#94A3B8"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <circle
            cx="22"
            cy="28"
            r="10"
            fill="#94A3B8"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <path
            d="M13 28 v12 a4 4 0 0 0 8 0"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="19" cy="26" r="2" fill="#1E293B" />
          <rect
            x="22"
            y="42"
            width="6"
            height="10"
            rx="2"
            fill="#64748B"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          <rect
            x="36"
            y="42"
            width="6"
            height="10"
            rx="2"
            fill="#64748B"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
        </svg>
      );

    case "botanic":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Pohon Pinus & Buah Tin Pegunungan */}
          <polygon
            points="32,10 16,32 48,32"
            fill="#4ADE80"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points="32,22 12,46 52,46"
            fill="#22C55E"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect
            x="27"
            y="46"
            width="10"
            height="10"
            fill="#78350F"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <circle
            cx="44"
            cy="28"
            r="5"
            fill="#FACC15"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
        </svg>
      );

    case "water":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Air Terjun / Sungai Telaga Puncak */}
          <polygon
            points="8,54 24,18 40,54"
            fill="#64748B"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M26 24 C34 30, 28 42, 38 54 L54 54 C46 40, 48 28, 36 22 Z"
            fill="#38BDF8"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle
            cx="46"
            cy="18"
            r="4"
            fill="#FEF08A"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
        </svg>
      );

    case "quake":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Puncak Gunung Terbelah & Batu Melayang */}
          <polygon
            points="8,54 26,18 32,36 40,16 56,54"
            fill="#64748B"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polyline
            points="32,36 28,44 35,48 30,54"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="14"
            y="12"
            width="7"
            height="7"
            transform="rotate(20 14 12)"
            fill="#EF4444"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          <rect
            x="46"
            y="10"
            width="6"
            height="6"
            transform="rotate(-15 46 10)"
            fill="#FACC15"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
        </svg>
      );

    case "crown":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Mahkota Emas di Atas Puncak Gunung */}
          <polygon
            points="12,56 32,30 52,56"
            fill="#64748B"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points="16,30 20,14 32,22 44,14 48,30"
            fill="#FACC15"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle
            cx="32"
            cy="12"
            r="3"
            fill="#EF4444"
            stroke="#1E293B"
            strokeWidth="2"
          />
        </svg>
      );

    case "time":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Kompas Ekspedisi Pendakian */}
          <circle
            cx="32"
            cy="32"
            r="20"
            fill="#FEF08A"
            stroke="#1E293B"
            strokeWidth="3.5"
          />
          <circle
            cx="32"
            cy="32"
            r="14"
            fill="#F8FAFC"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          <polygon
            points="32,19 37,32 32,29 27,32"
            fill="#EF4444"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <polygon
            points="32,45 37,32 32,35 27,32"
            fill="#475569"
            stroke="#1E293B"
            strokeWidth="2"
          />
        </svg>
      );

    case "sanctuary":
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Kemah Basecamp Pendaki & Lentera */}
          <polygon
            points="10,52 32,18 54,52"
            fill="#F59E0B"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points="24,52 32,34 40,52"
            fill="#FEF08A"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle
            cx="48"
            cy="18"
            r="5"
            fill="#FEF08A"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
        </svg>
      );

    case "summit":
    default:
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          {/* Tumpukan Batu Cairn & Bendera Puncak */}
          <line
            x1="36"
            y1="8"
            x2="36"
            y2="30"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <polygon
            points="36,8 54,14 36,20"
            fill="#EF4444"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect
            x="14"
            y="42"
            width="36"
            height="12"
            rx="6"
            fill="#64748B"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <rect
            x="20"
            y="32"
            width="24"
            height="11"
            rx="5"
            fill="#94A3B8"
            stroke="#1E293B"
            strokeWidth="3"
          />
          <rect
            x="25"
            y="23"
            width="14"
            height="10"
            rx="4"
            fill="#CBD5E1"
            stroke="#1E293B"
            strokeWidth="3"
          />
        </svg>
      );
  }
};

/** ── ORNAMEN LAPISAN SALJU DI TEPI ATAS KARTU ── */
const SnowCapOrnamentSvg = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 180 24"
    className={`pointer-events-none select-none ${className}`}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0,0 L180,0 L180,10 Q165,22 150,12 Q135,4 120,16 Q100,24 85,11 Q65,4 50,15 Q30,22 15,10 L0,14 Z"
      fill="#F8FAFC"
      stroke="#1E293B"
      strokeWidth="3"
    />
  </svg>
);

/** ── SILUET PEGUNUNGAN, AWAN & POHON PINUS (SVG Statis Solid) ── */
const MountainPeaksBackdropSvg = ({
  className = "",
}: {
  className?: string;
}) => (
  <svg
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    viewBox="0 0 400 500"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {/* Awan Puncak Gunung */}
    <g fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5">
      <rect x="24" y="42" width="68" height="22" rx="11" />
      <circle cx="45" cy="40" r="13" />
      <circle cx="68" cy="43" r="10" />

      <rect x="290" y="30" width="76" height="24" rx="12" />
      <circle cx="315" cy="28" r="14" />
      <circle cx="342" cy="31" r="11" />
    </g>

    {/* Barisan Puncak Gunung Bersalju di Kejauhan */}
    <polygon
      points="-20,250 85,90 185,250"
      fill="#64748B"
      stroke="#1E293B"
      strokeWidth="3"
    />
    <polygon
      points="85,90 58,138 76,130 85,144 96,128 112,138"
      fill="#F8FAFC"
      stroke="#1E293B"
      strokeWidth="2.5"
    />

    <polygon
      points="250,250 345,105 430,250"
      fill="#64748B"
      stroke="#1E293B"
      strokeWidth="3"
    />
    <polygon
      points="345,105 322,146 338,138 345,150 356,138 368,146"
      fill="#F8FAFC"
      stroke="#1E293B"
      strokeWidth="2.5"
    />

    {/* Gunung Utama di Tengah */}
    <polygon
      points="110,255 225,58 340,255"
      fill="#475569"
      stroke="#1E293B"
      strokeWidth="3.5"
    />
    <polygon
      points="225,58 190,118 212,108 225,124 238,108 260,118"
      fill="#F8FAFC"
      stroke="#1E293B"
      strokeWidth="2.5"
    />

    {/* Bendera Merah di Puncak Utama */}
    <line
      x1="225"
      y1="28"
      x2="225"
      y2="60"
      stroke="#1E293B"
      strokeWidth="3.5"
    />
    <polygon
      points="225,28 254,37 225,46"
      fill="#EF4444"
      stroke="#1E293B"
      strokeWidth="2.5"
    />

    {/* Deretan Siluet Pohon Pinus di Kaki Gunung */}
    <g fill="#334155" stroke="#1E293B" strokeWidth="2">
      <polygon points="15,255 30,220 45,255" />
      <polygon points="38,255 55,212 72,255" />
      <polygon points="335,255 352,215 369,255" />
      <polygon points="360,255 378,222 395,255" />
    </g>
  </svg>
);

// Pemetaan ikon khusus untuk tab kategori
const KATEGORI_ICON_MAP: Record<string, React.FC<SvgProps>> = {
  juz30: Quran,
  pendek: Sprout,
  pilihan: Crown,
  default: PaperBoatSvg,
};

export default function TahfidzPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TahfidzKategori>("juz30");
  const [selectedSurah, setSelectedSurah] = useState<TahfidzTarget | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"baca" | "uji">("baca");
  const [revealedAyat, setRevealedAyat] = useState<Set<number>>(new Set());
  const [surahAyatList, setSurahAyatList] = useState<AyahData[]>([]);
  const [isLoadingAyat, setIsLoadingAyat] = useState(false);

  const { data, isHafal, toggleHafal, reset, stats, streak } = useTahfidz();
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();

  const currentTargets = useMemo(() => {
    const list = getTargetsByKategori(activeTab);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (t) =>
        t.namaLatin.toLowerCase().includes(q) ||
        t.arti.toLowerCase().includes(q) ||
        String(t.surah).includes(q),
    );
  }, [activeTab, searchQuery]);

  // Load ayat when a surah is selected
  useEffect(() => {
    if (!selectedSurah) {
      setSurahAyatList([]);
      setRevealedAyat(new Set());
      return;
    }

    let isMounted = true;
    setIsLoadingAyat(true);
    setRevealedAyat(new Set());

    fetch(`https://equran.id/api/v2/surat/${selectedSurah.surah}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json?.code === 200 && Array.isArray(json?.data?.ayat)) {
          const list: AyahData[] = json.data.ayat.map((a: any) => ({
            nomorAyat: a.nomorAyat,
            teksArab: a.teksArab,
            teksLatin: a.teksLatin,
            teksIndonesia: a.teksIndonesia,
            audioUrl:
              a.audio?.["01"] ||
              everyAyahAudio(selectedSurah.surah, a.nomorAyat),
          }));
          setSurahAyatList(list);
        } else {
          fallbackAyat();
        }
      })
      .catch(() => {
        if (isMounted) fallbackAyat();
      })
      .finally(() => {
        if (isMounted) setIsLoadingAyat(false);
      });

    function fallbackAyat() {
      if (!selectedSurah) return;
      const list: AyahData[] = [];
      for (let i = selectedSurah.ayatStart; i <= selectedSurah.ayatEnd; i++) {
        list.push({
          nomorAyat: i,
          teksArab: `Ayat ${i}`,
          teksLatin: `Surah ${selectedSurah.namaLatin} Ayat ${i}`,
          teksIndonesia: `Terjemahan ayat ke-${i}`,
          audioUrl: everyAyahAudio(selectedSurah.surah, i),
        });
      }
      setSurahAyatList(list);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedSurah]);

  const handleOpenSurah = (target: TahfidzTarget) => {
    triggerBibiReaction("click");
    setSelectedSurah(target);
    navigate(`/member/ngaji-ceria/explore/tahfidz/${target.surah}`);
  };

  const handleToggleAyatHafal = (surahNum: number, ayahNum: number) => {
    const alreadyHafal = isHafal(surahNum, ayahNum);
    toggleHafal(surahNum, ayahNum);
    if (!alreadyHafal) {
      triggerBibiReaction("success");
    } else {
      triggerBibiReaction("click");
    }
  };

  const toggleReveal = (ayahNum: number) => {
    setRevealedAyat((prev) => {
      const next = new Set(prev);
      if (next.has(ayahNum)) next.delete(ayahNum);
      else next.add(ayahNum);
      return next;
    });
  };

  const handleResetAll = () => {
    if (
      window.confirm(
        "Apakah kamu yakin ingin mengulang pendakian hafalanmu dari kaki gunung?",
      )
    ) {
      triggerBibiReaction("error");
      reset();
    }
  };

  const selectedProgress = selectedSurah
    ? getSurahProgress(data, selectedSurah)
    : null;

  // Suppress unused variable warnings while preserving business state
  void mode;
  void setMode;
  void revealedAyat;
  void surahAyatList;
  void isLoadingAyat;
  void isPlaying;
  void currentAudioUrl;
  void toggle;
  void handleToggleAyatHafal;
  void toggleReveal;
  void selectedProgress;

  return (
    <NgajiCeriaLayout
      title="Puncak Gunung Tahfidz"
      hideHeader={true}
      themeScope="tahfidz"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      {/* Latar Jalur Pendakian Gunung Berbatu (#CBD5E1) */}
      <div className="min-h-[100dvh] w-full bg-[#CBD5E1] relative overflow-x-hidden pb-32 select-none">
        <MountainPeaksBackdropSvg className="opacity-40" />

        {/* HEADER Puncak Gunung */}
        <ThemedHeader
          title="Puncak Gunung Tahfidz"
          onBack={() => navigate("/member/ngaji-ceria/map")}
          themeColorClass="bg-[#475569] border-b-[4px] border-[#1E293B]"
          textColorClass="text-[#FEF08A]"
          statVariant="capsule"
          statBgClass="bg-[#1E293B] text-[#FEF08A]"
          backClass="bg-[#FEF08A] text-[#1E293B] border-[2.5px] border-[#1E293B]"
        />

        <div className="relative z-10 px-4 pt-5 max-w-3xl mx-auto">
          {/* ── HERO POS PENDAKIAN PUNCAK GUNUNG (Bentuk Tebing Basecamp + Ornamen Salju) ── */}
          <section className="relative overflow-hidden rounded-[28px_18px_28px_18px] border-[4px] border-[#1E293B] bg-[#475569] p-5 pt-7 text-[#FFFFFF] shadow-[6px_6px_0px_#1E293B]">
            {/* Ornamen Lapisan Salju di Tepi Atas Hero */}
            <SnowCapOrnamentSvg className="absolute top-0 left-0 right-0 h-5 w-full" />

            {/* Ornamen Retakan Tebing Batu di Sudut Kiri Bawah */}
            <svg
              viewBox="0 0 60 40"
              className="pointer-events-none absolute left-2 bottom-1 w-14 h-9 opacity-30"
              aria-hidden="true"
            >
              <polyline
                points="4,36 18,22 14,12 28,6"
                fill="none"
                stroke="#1E293B"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polyline
                points="18,22 32,26 42,16"
                fill="none"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Ilustrasi Puncak Gunung Kembar, Kompas & Bendera di Kanan */}
            <div className="pointer-events-none absolute right-2 top-5 bottom-2 flex w-[34%] items-center justify-center">
              <svg viewBox="0 0 130 125" className="w-32 h-32">
                {/* Halo Matahari Puncak */}
                <circle
                  cx="88"
                  cy="34"
                  r="16"
                  fill="#FEF08A"
                  stroke="#1E293B"
                  strokeWidth="3"
                />
                {/* Gunung Kedua di Samping */}
                <polygon
                  points="52,112 92,48 124,112"
                  fill="#334155"
                  stroke="#1E293B"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <polygon
                  points="92,48 79,69 88,65 92,72 98,65 105,69"
                  fill="#E2E8F0"
                  stroke="#1E293B"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Bendera Puncak Utama */}
                <line
                  x1="52"
                  y1="8"
                  x2="52"
                  y2="38"
                  stroke="#1E293B"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <polygon
                  points="52,8 84,17 52,26"
                  fill="#EF4444"
                  stroke="#1E293B"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Gunung Batu Utama */}
                <polygon
                  points="6,112 52,32 98,112"
                  fill="#64748B"
                  stroke="#1E293B"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                {/* Salju Puncak Utama */}
                <polygon
                  points="52,32 34,62 45,56 52,65 60,56 70,62"
                  fill="#F8FAFC"
                  stroke="#1E293B"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Jalur Pendakian Putus-putus Menuju Puncak */}
                <path
                  d="M36 108 Q44 92 58 84 T52 66"
                  fill="none"
                  stroke="#FEF08A"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="relative z-10 max-w-[68%]">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-xl border-[2.5px] border-[#1E293B] bg-[#FEF08A] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                <Sparkles size={13} />
                <span>Ekspedisi Puncak Gunung Tahfidz</span>
              </span>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-black leading-tight text-[#FFFFFF]">
                Daki Tangga Batu Surah Menuju Puncak!
              </h2>

              {/* Mini Badges Stats Pendakian */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-[#1E293B] bg-[#FEF08A] px-2.5 py-1 text-[10px] font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                  <BookOpen size={12} />
                  <span>
                    {stats.totalHafal}/{stats.totalAyat} Batu Ayat
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-[#1E293B] bg-[#4ADE80] px-2.5 py-1 text-[10px] font-black text-[#14532D] shadow-[2px_2px_0px_#1E293B]">
                  <Trophy size={12} />
                  <span>{stats.surahSelesai} Puncak</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-[#1E293B] bg-[#EF4444] px-2.5 py-1 text-[10px] font-black text-[#FFFFFF] shadow-[2px_2px_0px_#1E293B]">
                  <Fire size={12} />
                  <span>{streak} Hari</span>
                </span>
              </div>
            </div>
          </section>

          {/* ── FILTER JALUR PENDAKIAN & PENCARIAN ── */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              <div className="flex gap-2">
                {TAHFIDZ_KATEGORI.map((kat, idx) => {
                  const isActive = activeTab === kat.key;
                  const IconComponent =
                    KATEGORI_ICON_MAP[kat.key] ||
                    (idx === 0
                      ? Quran
                      : idx === 1
                        ? Sprout
                        : idx === 2
                          ? Crown
                          : PaperBoatSvg);

                  return (
                    <motion.button
                      key={kat.key}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        triggerBibiReaction("click");
                        setActiveTab(kat.key);
                      }}
                      className={`flex items-center gap-2 rounded-[18px_12px_18px_12px] border-[3px] border-[#1E293B] px-4 py-2.5 text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#FEF08A] text-[#1E293B] shadow-[3px_3px_0px_#1E293B] -translate-y-0.5"
                          : "bg-[#64748B] text-[#FFFFFF] hover:bg-[#475569]"
                      }`}
                    >
                      <IconComponent size={16} />
                      <span>{kat.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {stats.totalHafal > 0 && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1 rounded-xl border-[2.5px] border-[#1E293B] bg-[#EF4444] px-2.5 py-2 text-[10px] font-black text-[#FFFFFF] shadow-[2px_2px_0px_#1E293B] shrink-0 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Ulang</span>
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 rounded-[20px_14px_20px_14px] border-[3.5px] border-[#1E293B] bg-[#F8FAFC] px-4 py-2.5 shadow-[4px_4px_0px_#1E293B]">
              <Search size={18} className="text-[#475569]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pos batu surah (misal: Asy-Syams, Al-Fil, Al-Ikhlas)..."
                className="w-full bg-transparent text-xs sm:text-sm font-black text-[#1E293B] placeholder:text-[#64748B] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Bersihkan pencarian"
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* ── JALUR PENDAKIAN BERBATU: TANGGA BATU VERTIKAL BERKELOK (STEPPER) ── */}
          {currentTargets.length === 0 ? (
            <div className="mt-8 rounded-[28px_16px_28px_16px] border-[4px] border-dashed border-[#475569] bg-[#E2E8F0] p-8 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF08A] border-[3px] border-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
                <LenteraIcon size={32} lit={false} />
              </div>
              <p className="font-display font-black text-base text-[#1E293B]">
                Pos Pendakian Surah Tidak Ditemukan
              </p>
              <p className="text-xs font-bold text-[#475569] mt-1">
                Coba ketik kata kunci lain atau pilih jalur kategori di atas ya.
              </p>
            </div>
          ) : (
            <div className="relative mt-8 flex flex-col gap-6 pb-8">
              {/* Jalur Tambang Pendakian Vertikal di Tengah beserta Simpul */}
              <div className="pointer-events-none absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-2.5 bg-[#78350F] border-x-[2.5px] border-[#1E293B]" />

              {currentTargets.map((target, i) => {
                const progress = getSurahProgress(data, target);
                const isLit = progress.hafal > 0;
                const visualMeta = getSurahVisualMeta(
                  target.namaLatin,
                  target.arti,
                  i,
                  progress.complete,
                );

                // Zig-zag berkelok menyerupai tangga batu pendakian
                const isLeftStep = i % 2 === 0;
                const stepAlignClass = isLeftStep
                  ? "self-start sm:w-[84%] mr-auto"
                  : "self-end sm:w-[84%] ml-auto";

                const isLightCard = progress.complete || isLit;

                return (
                  <motion.button
                    key={target.surah}
                    type="button"
                    onClick={() => handleOpenSurah(target)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative z-10 w-full ${stepAlignClass} ${visualMeta.shapeClass} flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 border-[4px] border-[#1E293B] p-4 pt-5 text-left shadow-[6px_6px_0px_#1E293B] transition-all cursor-pointer overflow-hidden ${
                      progress.complete
                        ? "bg-[#DCFCE7]"
                        : isLit
                          ? "bg-[#FEF3C7]"
                          : "bg-[#64748B]"
                    }`}
                  >
                    {/* Ornamen Lapisan Salju Tipis di Tepi Atas Batu */}
                    <div className="pointer-events-none absolute top-0 left-6 right-6 h-2.5 rounded-b-full border-x-[2.5px] border-b-[2.5px] border-[#1E293B] bg-[#F8FAFC]" />

                    {/* Ornamen Paku Piton / Carabiner Pendaki di Pojok Kartu */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute top-2 ${
                        isLeftStep ? "right-3" : "left-3"
                      } flex h-3.5 w-3.5 items-center justify-center rounded-full border-[2px] border-[#1E293B] bg-[#94A3B8]`}
                    >
                      <span className="h-1 w-1 rounded-full bg-[#1E293B]" />
                    </span>

                    {/* Ornamen Retakan Tebing Batu Halus */}
                    <svg
                      viewBox="0 0 48 32"
                      className="pointer-events-none absolute bottom-1 right-48 w-10 h-7 opacity-20"
                      aria-hidden="true"
                    >
                      <polyline
                        points="4,28 16,16 12,8 26,4"
                        fill="none"
                        stroke="#1E293B"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Bagian Kiri: Nomor Tangga Batu + Info Surah + Ilustrasi SVG Berdasarkan Judul */}
                    <div className="relative z-10 flex items-center justify-between gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Nomor Pijakan Batu */}
                        <div className="relative shrink-0">
                          <span className="flex h-12 w-12 items-center justify-center rounded-[16px_10px_16px_10px] border-[3px] border-[#1E293B] bg-[#FEF08A] text-base font-display font-black text-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
                            #{i + 1}
                          </span>
                          {progress.complete && (
                            <span
                              title="Puncak Tercapai"
                              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-[2px] border-[#1E293B] bg-[#4ADE80] text-[#14532D] shadow-[1.5px_1.5px_0px_#1E293B]"
                            >
                              <Trophy size={12} />
                            </span>
                          )}
                        </div>

                        {/* Teks Judul & Arti Surah */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`inline-block rounded-md border-[2px] border-[#1E293B] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${visualMeta.badgeBg} ${visualMeta.badgeText}`}
                            >
                              {visualMeta.posLabel} • QS. {target.surah}
                            </span>
                          </div>

                          <h3
                            className={`font-display font-black text-base sm:text-lg leading-tight mt-1 truncate ${
                              isLightCard ? "text-[#1E293B]" : "text-[#FFFFFF]"
                            }`}
                          >
                            {target.namaLatin}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span
                              className={`text-xs font-bold truncate ${
                                isLightCard
                                  ? "text-[#334155]"
                                  : "text-[#E2E8F0]"
                              }`}
                            >
                              “{target.arti}”
                            </span>
                            <span
                              className={`inline-block rounded-md border-[1.5px] border-[#1E293B] px-1.5 py-0.5 text-[10px] font-black ${
                                isLightCard
                                  ? "bg-[#F8FAFC] text-[#1E293B]"
                                  : "bg-[#1E293B] text-[#FEF08A]"
                              }`}
                            >
                              {progress.hafal}/{progress.total} Ayat
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ilustrasi SVG Dinamis Berdasarkan Judul Surah */}
                      <div className="shrink-0 flex items-center justify-center rounded-2xl border-[2.5px] border-[#1E293B] bg-[#F8FAFC]/90 p-1.5 shadow-[2.5px_2.5px_0px_#1E293B]">
                        <SurahThemeSvg
                          category={visualMeta.category}
                          className="w-11 h-11 sm:w-12 sm:h-12"
                        />
                      </div>
                    </div>

                    {/* Bagian Kanan: Indikator Progres Pijakan Batu */}
                    <div className="relative z-10 flex sm:w-44 shrink-0 flex-col justify-center gap-1.5 rounded-[16px_12px_16px_12px] border-[3px] border-[#1E293B] bg-[#F8FAFC] p-2.5 shadow-[3px_3px_0px_#1E293B]">
                      <div className="flex items-center justify-between text-[10px] font-black text-[#1E293B]">
                        <span>Progres Daki</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#CBD5E1] border-[2px] border-[#1E293B]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progress.complete ? "bg-[#15803D]" : "bg-[#D97706]"
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <span
                        className={`inline-flex items-center justify-center gap-1.5 rounded-lg border-[2px] border-[#1E293B] py-1 text-[11px] font-black shadow-[1.5px_1.5px_0px_#1E293B] ${
                          progress.complete
                            ? "bg-[#4ADE80] text-[#14532D]"
                            : isLit
                              ? "bg-[#FACC15] text-[#1E293B]"
                              : "bg-[#78350F] text-[#FEF08A]"
                        }`}
                      >
                        <LenteraIcon size={13} lit={isLit} />
                        {progress.complete
                          ? "Tiba di Puncak"
                          : isLit
                            ? "Lanjut Mendaki"
                            : "Mulai Daki"}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
