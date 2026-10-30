import React, { useState, useMemo } from "react";
import {
  Search,
  Copy,
  Check,
  Sparkles,
  LayerGroup as Layers,
  BookOpen,
  Gamepad as Gamepad2,
  Coins,
  Maximize2,
  X,
  Sliders,
  CoinSvg,
} from "./CustomIcons";
import {
  PetiHartaSvg,
  PetiBonusEmasSvg,
  EfekPopSvg,
  ItemMerahSvg,
  ItemBiruSvg,
  ItemKuningSvg,
  ItemHijauSvg,
  HijaiyahHarvestCoverSvg,
  HijaiyahRushCoverSvg,
  HijaiyahBeatsCoverSvg,
  Hijaiyah2048CoverSvg,
  HijaiyahMatchArenaCoverSvg,
  ArabicWordleCoverSvg,
  AyatScrambleCoverSvg,
  AyatHunterCoverSvg,
  JuzAmmaSpeedrunCoverSvg,
  QuranQuizRoyaleCoverSvg,
  TajwidArenaCoverSvg,
  TajwidDefenseCoverSvg,
  TajwidTetrisCoverSvg,
  AdabRpgCoverSvg,
  DoaDungeonCoverSvg,
  MalaikatMissionCoverSvg,
  NabiChroniclesCoverSvg,
  SantriIdleCoverSvg,
  WudhuFlowCoverSvg,
  SholatHeroCoverSvg,
  HarakatSlasherCoverSvg,
  MakhrajMasterCoverSvg,
  NurBattleCoverSvg,
  TebakSurahCoverSvg,
  CoverRodaHijaiyahSvg,
  HeroStreakSvg,
  HeroKartuNgajiSvg,
  HeroLanjutkanSvg,
  HeroNyawaHabisSvg,
  HeroCobaLagiSvg,
  BukuTilawatiSvg,
} from "./Illustrations";

export interface IllustrationItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
  bg: string;
  animated?: boolean;
  isPopItem?: boolean;
  hasJilidProp?: boolean;
}

export type HoverPresetKey = "cardLift" | "stickerShadow" | "comicPop";

export interface HoverPreset {
  label: string;
  cardClass: string;
  svgClass: string;
  codeSnippet: string;
}

export const HOVER_PRESETS: Record<HoverPresetKey, HoverPreset> = {
  cardLift: {
    label: "1. Card Lift + Icon Tilt",
    cardClass:
      "transition-all duration-150 ease-out hover:-translate-x-1.5 hover:-translate-y-1.5 hover:shadow-[10px_10px_0px_0px_#134E4A] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_#134E4A]",
    svgClass:
      "transition-transform duration-150 ease-out group-hover:scale-110 group-hover:-rotate-6 group-active:scale-95 group-active:rotate-0",
    codeSnippet: `// Card Wrapper + SVG Hover:\nclassName="transition-transform duration-150 ease-out group-hover:scale-110 group-hover:-rotate-6 group-active:scale-95"`,
  },
  stickerShadow: {
    label: "2. Direct SVG Drop-Shadow",
    cardClass: "transition-colors duration-150",
    svgClass:
      "transition-all duration-150 ease-out drop-shadow-[4px_4px_0px_#134E4A] group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-hover:drop-shadow-[9px_9px_0px_#134E4A] group-active:translate-x-1 group-active:translate-y-1 group-active:drop-shadow-[0px_0px_0px_#134E4A]",
    codeSnippet: `// Langsung pada prop className SVG:\nclassName="transition-all duration-150 ease-out drop-shadow-[4px_4px_0px_#134E4A] hover:-translate-x-1 hover:-translate-y-1 hover:drop-shadow-[8px_8px_0px_#134E4A] active:translate-x-1 active:translate-y-1 active:drop-shadow-none"`,
  },
  comicPop: {
    label: "3. Comic Pop & Bounce",
    cardClass:
      "transition-all duration-150 ease-out hover:bg-[#FEF08A] active:scale-95",
    svgClass:
      "transition-all duration-150 ease-out group-hover:scale-125 group-hover:rotate-6 group-active:scale-90 group-active:-rotate-12",
    codeSnippet: `// Efek Pop Komik:\nclassName="transition-all duration-150 ease-out hover:scale-125 hover:rotate-6 active:scale-90 active:-rotate-12"`,
  },
};

export const ILLUSTRATIONS_LIST: IllustrationItem[] = [
  // Kategori 0: Peti & Koin (3)
  {
    id: "CoinSvg",
    name: "CoinSvg",
    category: "Peti & Koin",
    desc: "Koin bintang emas dasar dengan highlight lengkung",
    Component: CoinSvg,
    bg: "bg-[#FEF08A]",
  },
  {
    id: "PetiHartaSvg",
    name: "PetiHartaSvg",
    category: "Peti & Koin",
    desc: "Peti harta karun tertutup rapat",
    Component: PetiHartaSvg,
    bg: "bg-[#FDE68A]",
  },
  {
    id: "PetiBonusEmasSvg",
    name: "PetiBonusEmasSvg",
    category: "Peti & Koin",
    desc: "Peti emas terbuka dengan animasi sinar & 3 koin melayang",
    Component: PetiBonusEmasSvg,
    bg: "bg-[#FFFBEB]",
    animated: true,
  },

  // Kategori 1: Hijaiyah Pop (6)
  {
    id: "EfekPopSvg",
    name: "EfekPopSvg",
    category: "Hijaiyah Pop",
    desc: "Efek ledakan komik POW! saat item pecah",
    Component: EfekPopSvg,
    bg: "bg-[#FECACA]",
  },
  {
    id: "ItemMerahSvg",
    name: "ItemMerahSvg",
    category: "Hijaiyah Pop",
    desc: "Buah/bintang merah dengan area huruf kosong di tengah",
    Component: ItemMerahSvg,
    bg: "bg-[#FEE2E2]",
    isPopItem: true,
  },
  {
    id: "ItemBiruSvg",
    name: "ItemBiruSvg",
    category: "Hijaiyah Pop",
    desc: "Buah/bintang biru dengan area huruf kosong di tengah",
    Component: ItemBiruSvg,
    bg: "bg-[#DBEAFE]",
    isPopItem: true,
  },
  {
    id: "ItemKuningSvg",
    name: "ItemKuningSvg",
    category: "Hijaiyah Pop",
    desc: "Buah/bintang kuning dengan area huruf kosong di tengah",
    Component: ItemKuningSvg,
    bg: "bg-[#FEF9C3]",
    isPopItem: true,
  },
  {
    id: "ItemHijauSvg",
    name: "ItemHijauSvg",
    category: "Hijaiyah Pop",
    desc: "Buah/bintang hijau dengan area huruf kosong di tengah",
    Component: ItemHijauSvg,
    bg: "bg-[#D1FAE5]",
    isPopItem: true,
  },
  {
    id: "HijaiyahHarvestCoverSvg",
    name: "HijaiyahHarvestCoverSvg",
    category: "Hijaiyah Pop",
    desc: "Maskot Burung Tito dikelilingi 3 bintang hijaiyah",
    Component: HijaiyahHarvestCoverSvg,
    bg: "bg-[#CCFBF1]",
  },

  // Kategori 2: 24 Cover Game (24)
  {
    id: "HijaiyahRushCoverSvg",
    name: "HijaiyahRushCoverSvg",
    category: "Cover Game",
    desc: "Roket meluncur dengan jendela huruf ج",
    Component: HijaiyahRushCoverSvg,
    bg: "bg-[#E0F2FE]",
  },
  {
    id: "HijaiyahBeatsCoverSvg",
    name: "HijaiyahBeatsCoverSvg",
    category: "Cover Game",
    desc: "Irama not balok biru dengan huruf د",
    Component: HijaiyahBeatsCoverSvg,
    bg: "bg-[#DBEAFE]",
  },
  {
    id: "Hijaiyah2048CoverSvg",
    name: "Hijaiyah2048CoverSvg",
    category: "Cover Game",
    desc: "Dua tile angka puzzle huruf ب dan ت",
    Component: Hijaiyah2048CoverSvg,
    bg: "bg-[#FEF3C7]",
  },
  {
    id: "HijaiyahMatchArenaCoverSvg",
    name: "HijaiyahMatchArenaCoverSvg",
    category: "Cover Game",
    desc: "Dua perisai huruf ر berhadapan dengan kilat",
    Component: HijaiyahMatchArenaCoverSvg,
    bg: "bg-[#FEE2E2]",
  },
  {
    id: "ArabicWordleCoverSvg",
    name: "ArabicWordleCoverSvg",
    category: "Cover Game",
    desc: "Grid tebak kata 3x3 hijau, kuning, dan abu",
    Component: ArabicWordleCoverSvg,
    bg: "bg-[#DCFCE7]",
  },
  {
    id: "AyatScrambleCoverSvg",
    name: "AyatScrambleCoverSvg",
    category: "Cover Game",
    desc: "Kepingan puzzle bergerigi menyusun potongan ayat",
    Component: AyatScrambleCoverSvg,
    bg: "bg-[#FEF9C3]",
  },
  {
    id: "AyatHunterCoverSvg",
    name: "AyatHunterCoverSvg",
    category: "Cover Game",
    desc: "Kaca pembesar menyorot kata di dalam kitab",
    Component: AyatHunterCoverSvg,
    bg: "bg-[#E0F2FE]",
  },
  {
    id: "JuzAmmaSpeedrunCoverSvg",
    name: "JuzAmmaSpeedrunCoverSvg",
    category: "Cover Game",
    desc: "Stopwatch waktu cepat dan kitab Juz Amma",
    Component: JuzAmmaSpeedrunCoverSvg,
    bg: "bg-[#D1FAE5]",
  },
  {
    id: "QuranQuizRoyaleCoverSvg",
    name: "QuranQuizRoyaleCoverSvg",
    category: "Cover Game",
    desc: "Podium juara 1, 2, 3 dengan trofi piala emas",
    Component: QuranQuizRoyaleCoverSvg,
    bg: "bg-[#FEF3C7]",
  },
  {
    id: "TajwidArenaCoverSvg",
    name: "TajwidArenaCoverSvg",
    category: "Cover Game",
    desc: "Dua pedang bersilangan di atas kitab suci",
    Component: TajwidArenaCoverSvg,
    bg: "bg-[#D1FAE5]",
  },
  {
    id: "TajwidDefenseCoverSvg",
    name: "TajwidDefenseCoverSvg",
    category: "Cover Game",
    desc: "Perisai ksatria dengan simbol gelombang mad tajwid",
    Component: TajwidDefenseCoverSvg,
    bg: "bg-[#DBEAFE]",
  },
  {
    id: "TajwidTetrisCoverSvg",
    name: "TajwidTetrisCoverSvg",
    category: "Cover Game",
    desc: "Susunan blok Tetris dengan tanda waqaf",
    Component: TajwidTetrisCoverSvg,
    bg: "bg-[#F3E8FF]",
  },
  {
    id: "AdabRpgCoverSvg",
    name: "AdabRpgCoverSvg",
    category: "Cover Game",
    desc: "Pemandangan santri dengan peci dan gapura pesantren",
    Component: AdabRpgCoverSvg,
    bg: "bg-[#FEF3C7]",
  },
  {
    id: "DoaDungeonCoverSvg",
    name: "DoaDungeonCoverSvg",
    category: "Cover Game",
    desc: "Pintu gerbang dungeon berkubah dengan obor api",
    Component: DoaDungeonCoverSvg,
    bg: "bg-[#E2E8F0]",
  },
  {
    id: "MalaikatMissionCoverSvg",
    name: "MalaikatMissionCoverSvg",
    category: "Cover Game",
    desc: "Sayap malaikat putih dengan lingkaran cahaya emas",
    Component: MalaikatMissionCoverSvg,
    bg: "bg-[#CCFBF1]",
  },
  {
    id: "NabiChroniclesCoverSvg",
    name: "NabiChroniclesCoverSvg",
    category: "Cover Game",
    desc: "Pohon kurma di gurun pasir dengan bintang malam",
    Component: NabiChroniclesCoverSvg,
    bg: "bg-[#FEF3C7]",
  },
  {
    id: "SantriIdleCoverSvg",
    name: "SantriIdleCoverSvg",
    category: "Cover Game",
    desc: "Kompleks bangunan asrama pesantren dan kubah hijau",
    Component: SantriIdleCoverSvg,
    bg: "bg-[#DCFCE7]",
  },
  {
    id: "WudhuFlowCoverSvg",
    name: "WudhuFlowCoverSvg",
    category: "Cover Game",
    desc: "Kran air mengalir ke telapak tangan yang suci",
    Component: WudhuFlowCoverSvg,
    bg: "bg-[#E0F2FE]",
  },
  {
    id: "SholatHeroCoverSvg",
    name: "SholatHeroCoverSvg",
    category: "Cover Game",
    desc: "Sajadah bergambar mihrab dengan kompas kiblat",
    Component: SholatHeroCoverSvg,
    bg: "bg-[#D1FAE5]",
  },
  {
    id: "HarakatSlasherCoverSvg",
    name: "HarakatSlasherCoverSvg",
    category: "Cover Game",
    desc: "Huruf alif berlari dengan harakat fathah, kasrah, dhammah",
    Component: HarakatSlasherCoverSvg,
    bg: "bg-[#FEE2E2]",
  },
  {
    id: "MakhrajMasterCoverSvg",
    name: "MakhrajMasterCoverSvg",
    category: "Cover Game",
    desc: "Diagram rongga mulut/tenggorokan tempat keluarnya huruf",
    Component: MakhrajMasterCoverSvg,
    bg: "bg-[#FEF9C3]",
  },
  {
    id: "NurBattleCoverSvg",
    name: "NurBattleCoverSvg",
    category: "Cover Game",
    desc: "Menara lentera mercusuar dengan sinar cahaya mengusir gelap",
    Component: NurBattleCoverSvg,
    bg: "bg-[#FEF3C7]",
  },
  {
    id: "TebakSurahCoverSvg",
    name: "TebakSurahCoverSvg",
    category: "Cover Game",
    desc: "Mushaf Al-Qur'an terbuka dengan tanda tanya besar",
    Component: TebakSurahCoverSvg,
    bg: "bg-[#E0E7FF]",
  },
  {
    id: "CoverRodaHijaiyahSvg",
    name: "CoverRodaHijaiyahSvg",
    category: "Cover Game",
    desc: "Roda putar keberuntungan warna-warni huruf hijaiyah",
    Component: CoverRodaHijaiyahSvg,
    bg: "bg-[#FEF3C7]",
  },

  // Kategori 3: Panel Hero & Buku (6)
  {
    id: "HeroStreakSvg",
    name: "HeroStreakSvg",
    category: "Panel Hero & Buku",
    desc: "Api streak membara kuning oranye dengan kilau",
    Component: HeroStreakSvg,
    bg: "bg-[#FEE2E2]",
  },
  {
    id: "HeroKartuNgajiSvg",
    name: "HeroKartuNgajiSvg",
    category: "Panel Hero & Buku",
    desc: "Dua kartu ngaji bertumpuk dengan checklist hijau",
    Component: HeroKartuNgajiSvg,
    bg: "bg-[#DCFCE7]",
  },
  {
    id: "HeroLanjutkanSvg",
    name: "HeroLanjutkanSvg",
    category: "Panel Hero & Buku",
    desc: "Tombol segitiga play neon hijau di dalam lingkaran",
    Component: HeroLanjutkanSvg,
    bg: "bg-[#DCFCE7]",
  },
  {
    id: "HeroNyawaHabisSvg",
    name: "HeroNyawaHabisSvg",
    category: "Panel Hero & Buku",
    desc: "Hati merah retak dengan perban putih",
    Component: HeroNyawaHabisSvg,
    bg: "bg-[#FEE2E2]",
  },
  {
    id: "HeroCobaLagiSvg",
    name: "HeroCobaLagiSvg",
    category: "Panel Hero & Buku",
    desc: "Tombol panah putar ulang (refresh/retry)",
    Component: HeroCobaLagiSvg,
    bg: "bg-[#FEF3C7]",
  },
  {
    id: "BukuTilawatiSvg",
    name: "BukuTilawatiSvg",
    category: "Panel Hero & Buku",
    desc: "Cover buku Tilawati dinamis dengan prop jilid 1–6",
    Component: BukuTilawatiSvg,
    bg: "bg-[#F3E8FF]",
    hasJilidProp: true,
  },
];

const HIJAIYAH_SAMPLES = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "س", "ش", "ق"];

// ============================================================================
// KOMPONEN UTAMA PREVIEW ILUSTRASI (UNTUK ADMIN)
// ============================================================================

export function PreviewIllustrations() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoverMode, setHoverMode] = useState<HoverPresetKey>("cardLift");
  const [activeJilid, setActiveJilid] = useState(1);
  const [showAllJilidModal, setShowAllJilidModal] = useState(false);
  const [popLetter, setPopLetter] = useState("ب");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItemModal, setSelectedItemModal] =
    useState<IllustrationItem | null>(null);

  const categories = [
    { name: "Semua", count: ILLUSTRATIONS_LIST.length, icon: Layers },
    { name: "Peti & Koin", count: 3, icon: Coins },
    { name: "Hijaiyah Pop", count: 6, icon: Sparkles },
    { name: "Cover Game", count: 24, icon: Gamepad2 },
    { name: "Panel Hero & Buku", count: 6, icon: BookOpen },
  ];

  const filteredList = useMemo(() => {
    return ILLUSTRATIONS_LIST.filter((item) => {
      const matchCat =
        selectedCategory === "Semua" || item.category === selectedCategory;
      const matchQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyCode = (item: IllustrationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const propStr = item.hasJilidProp ? ` jilid={${activeJilid}}` : "";
    const snippet = `<${item.name} size={128}${propStr} className="${HOVER_PRESETS[hoverMode].svgClass}" />`;

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      navigator.clipboard.writeText(snippet);
    }
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#134E4A] pb-20 font-sans selection:bg-[#FBBF24]">
      {/* HEADER BAR NEO-BRUTALISM */}
      <header className="border-b-4 border-[#134E4A] bg-[#FBBF24] sticky top-0 z-30 shadow-[0px_4px_0px_0px_#134E4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFFBEB] border-4 border-[#134E4A] rounded-xl shadow-[4px_4px_0px_0px_#134E4A]">
              <HijaiyahHarvestCoverSvg size={44} />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 bg-[#10B981] text-white font-black text-xs uppercase tracking-wider border-2 border-[#134E4A] rounded-md mb-1">
                src/components/ui/Illustrations.tsx
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#134E4A]">
                Galeri 39 Ilustrasi Neo-Brutalism
              </h1>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#134E4A]"
              size={20}
              strokeWidth={3}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama SVG (mis. Rush, Peti)..."
              className="w-full pl-11 pr-9 py-2.5 bg-[#FFFBEB] border-4 border-[#134E4A] rounded-xl font-bold placeholder:text-[#134E4A]/50 focus:outline-none focus:bg-white shadow-[4px_4px_0px_0px_#134E4A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-black hover:scale-110"
              >
                <X size={18} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* CONTROL BAR: HOVER MODE & POP LETTER TESTER */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Pemilihan Mode Efek Hover Tailwind */}
          <div className="lg:col-span-7 bg-[#CCFBF1] border-4 border-[#134E4A] rounded-2xl p-4 shadow-[6px_6px_0px_0px_#134E4A]">
            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider mb-3">
              <Sliders size={18} strokeWidth={3} />
              <span>Uji Efek Hover & Klik Neo-Brutalism (Live):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(Object.keys(HOVER_PRESETS) as HoverPresetKey[]).map((key) => {
                const preset = HOVER_PRESETS[key];
                const active = hoverMode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setHoverMode(key)}
                    className={`px-3 py-2.5 rounded-xl border-3 border-[#134E4A] font-black text-xs sm:text-sm text-left transition-all duration-100 ${
                      active
                        ? "bg-[#FBBF24] shadow-[4px_4px_0px_0px_#134E4A] -translate-y-0.5"
                        : "bg-white hover:bg-[#FEF9C3]"
                    }`}
                    style={{ borderWidth: "3px" }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kustomisasi Huruf Tengah untuk Item Hijaiyah Pop & Jilid Tilawati */}
          <div className="lg:col-span-5 bg-[#FEF08A] border-4 border-[#134E4A] rounded-2xl p-4 shadow-[6px_6px_0px_0px_#134E4A] flex flex-col justify-between gap-3">
            <div>
              <span className="font-black text-xs uppercase tracking-wider block mb-2">
                Simulasi Huruf Tengah (Item Pop Merah/Biru/Kuning/Hijau):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {HIJAIYAH_SAMPLES.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => setPopLetter(char)}
                    className={`w-8 h-8 rounded-lg border-2 border-[#134E4A] font-black text-base flex items-center justify-center transition-transform ${
                      popLetter === char
                        ? "bg-[#EF4444] text-white scale-110 shadow-[2px_2px_0px_0px_#134E4A]"
                        : "bg-white hover:bg-[#FFFBEB]"
                    }`}
                  >
                    {char}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPopLetter("")}
                  className={`px-2 h-8 rounded-lg border-2 border-[#134E4A] font-bold text-xs ${
                    popLetter === ""
                      ? "bg-[#134E4A] text-white"
                      : "bg-white hover:bg-[#FFFBEB]"
                  }`}
                >
                  Kosong
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FILTER TAB KATEGORI */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-4 border-[#134E4A] font-black text-sm transition-all duration-150 ${
                  isSelected
                    ? "bg-[#10B981] text-white shadow-[5px_5px_0px_0px_#134E4A] -translate-x-0.5 -translate-y-0.5"
                    : "bg-white text-[#134E4A] shadow-[3px_3px_0px_0px_#134E4A] hover:bg-[#FEF08A]"
                }`}
              >
                <Icon size={18} strokeWidth={3} />
                <span>{cat.name}</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-md border-2 border-[#134E4A] ${
                    isSelected
                      ? "bg-[#FFFBEB] text-[#134E4A]"
                      : "bg-[#FEF08A] text-[#134E4A]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* GRID UTAMA 39 KOMPONEN */}
        {filteredList.length === 0 ? (
          <div className="bg-white border-4 border-[#134E4A] rounded-2xl p-12 text-center shadow-[6px_6px_0px_0px_#134E4A]">
            <HeroNyawaHabisSvg size={96} className="mx-auto mb-3" />
            <p className="text-xl font-black">
              Komponen &ldquo;{searchQuery}&rdquo; tidak ditemukan!
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
              className="mt-4 px-5 py-2 bg-[#FBBF24] border-3 border-[#134E4A] rounded-xl font-black shadow-[4px_4px_0px_0px_#134E4A]"
              style={{ borderWidth: "3px" }}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredList.map((item, idx) => {
              const SvgComp = item.Component;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemModal(item)}
                  className={`group relative flex flex-col justify-between rounded-2xl bg-white border-4 border-[#134E4A] shadow-[6px_6px_0px_0px_#134E4A] p-4 cursor-pointer select-none ${HOVER_PRESETS[hoverMode].cardClass}`}
                >
                  {/* Top Badge Nomor & Kategori */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 bg-[#FFFBEB] border-2 border-[#134E4A] rounded-lg font-black text-xs">
                      #{idx + 1} • {item.category}
                    </span>
                    {item.animated && (
                      <span className="px-2 py-0.5 bg-[#FBBF24] border-2 border-[#134E4A] rounded-lg font-black text-[11px] flex items-center gap-1">
                        <Sparkles size={12} strokeWidth={3} /> SMIL Anim
                      </span>
                    )}
                  </div>

                  {/* Stage Preview Ilustrasi */}
                  <div
                    className={`relative h-44 rounded-xl border-3 border-[#134E4A] ${item.bg} flex items-center justify-center overflow-hidden p-4`}
                    style={{ borderWidth: "3px" }}
                  >
                    <div className="relative flex items-center justify-center">
                      {item.hasJilidProp ? (
                        <SvgComp
                          size={124}
                          jilid={activeJilid}
                          className={HOVER_PRESETS[hoverMode].svgClass}
                        />
                      ) : (
                        <SvgComp
                          size={124}
                          className={HOVER_PRESETS[hoverMode].svgClass}
                        />
                      )}

                      {/* Overlay huruf Hijaiyah bila komponen adalah Item Pop */}
                      {item.isPopItem && popLetter && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-2 text-3xl font-black text-[#134E4A] transition-transform duration-150 group-hover:scale-110">
                          {popLetter}
                        </span>
                      )}
                    </div>

                    {/* Tombol Expand Pojok Kanan Atas */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItemModal(item);
                      }}
                      title="Detail & Kode JSX"
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1.5 bg-white border-2 border-[#134E4A] rounded-lg shadow-[2px_2px_0px_0px_#134E4A] hover:bg-[#FEF08A]"
                    >
                      <Maximize2 size={14} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Kontrol Khusus BukuTilawatiSvg (Pilih Jilid 1-6) */}
                  {item.hasJilidProp && (
                    <div
                      className="mt-3 p-2 bg-[#FFFBEB] border-2 border-[#134E4A] rounded-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between text-xs font-black mb-1.5">
                        <span>Pilih Prop Jilid:</span>
                        <button
                          type="button"
                          onClick={() => setShowAllJilidModal(true)}
                          className="underline text-[#0D9488] hover:text-[#134E4A]"
                        >
                          Lihat Semua 6 Jilid
                        </button>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() => setActiveJilid(j)}
                            className={`py-1 rounded border-2 border-[#134E4A] font-black text-xs ${
                              activeJilid === j
                                ? "bg-[#134E4A] text-white"
                                : "bg-white hover:bg-[#FEF08A]"
                            }`}
                          >
                            {j}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nama Komponen & Deskripsi */}
                  <div className="mt-3">
                    <h2 className="font-black text-base text-[#134E4A] font-mono truncate">
                      {`<${item.name} />`}
                    </h2>
                    <p className="text-xs font-bold text-[#134E4A]/75 mt-0.5 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Tombol Salin JSX */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(item, e)}
                    className={`mt-3 w-full py-2 px-3 rounded-xl border-3 border-[#134E4A] font-black text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isCopied
                        ? "bg-[#10B981] text-white"
                        : "bg-[#FEF08A] hover:bg-[#FBBF24] text-[#134E4A]"
                    }`}
                    style={{ borderWidth: "3px" }}
                  >
                    {isCopied ? (
                      <>
                        <Check size={15} strokeWidth={3} />
                        <span>JSX Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} strokeWidth={3} />
                        <span>Salin Tag JSX</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL PREVIEW SEMUA 6 JILID BUKU TILAWATI */}
      {showAllJilidModal && (
        <div
          className="fixed inset-0 z-50 bg-[#134E4A]/70 flex items-center justify-center p-4"
          onClick={() => setShowAllJilidModal(false)}
        >
          <div
            className="bg-[#FFFBEB] border-4 border-[#134E4A] rounded-2xl max-w-3xl w-full p-6 shadow-[10px_10px_0px_0px_#134E4A]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-4 border-[#134E4A] pb-3 mb-5">
              <h3 className="text-xl font-black">
                Preview Lengkap BukuTilawatiSvg (Jilid 1 – 6)
              </h3>
              <button
                type="button"
                onClick={() => setShowAllJilidModal(false)}
                className="p-1.5 bg-[#EF4444] text-white border-3 border-[#134E4A] rounded-lg"
                style={{ borderWidth: "3px" }}
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((jilidNum) => (
                <div
                  key={jilidNum}
                  className="group flex flex-col items-center p-3 bg-white border-3 border-[#134E4A] rounded-xl shadow-[4px_4px_0px_0px_#134E4A] hover:-translate-y-1 transition-transform"
                  style={{ borderWidth: "3px" }}
                >
                  <BukuTilawatiSvg
                    size={92}
                    jilid={jilidNum}
                    className="transition-transform group-hover:scale-110 group-hover:-rotate-3"
                  />
                  <span className="mt-2 font-black text-xs font-mono">
                    jilid=&#123;{jilidNum}&#125;
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL KOMPONEN & SNIPPET TAILWIND */}
      {selectedItemModal && (
        <div
          className="fixed inset-0 z-50 bg-[#134E4A]/70 flex items-center justify-center p-4"
          onClick={() => setSelectedItemModal(null)}
        >
          <div
            className="bg-[#FFFBEB] border-4 border-[#134E4A] rounded-2xl max-w-lg w-full p-6 shadow-[10px_10px_0px_0px_#134E4A]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-4 border-[#134E4A] pb-3 mb-4">
              <div>
                <span className="text-xs font-black uppercase px-2 py-0.5 bg-[#FBBF24] border-2 border-[#134E4A] rounded">
                  {selectedItemModal.category}
                </span>
                <h3 className="text-xl font-black font-mono mt-1">
                  {`<${selectedItemModal.name} />`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemModal(null)}
                className="p-1.5 bg-[#EF4444] text-white border-3 border-[#134E4A] rounded-lg"
                style={{ borderWidth: "3px" }}
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <div
              className={`h-56 rounded-xl border-4 border-[#134E4A] ${selectedItemModal.bg} flex items-center justify-center mb-4 group`}
            >
              {selectedItemModal.hasJilidProp ? (
                <selectedItemModal.Component
                  size={165}
                  jilid={activeJilid}
                  className={HOVER_PRESETS[hoverMode].svgClass}
                />
              ) : (
                <selectedItemModal.Component
                  size={165}
                  className={HOVER_PRESETS[hoverMode].svgClass}
                />
              )}
            </div>

            <p className="font-bold text-sm mb-3">{selectedItemModal.desc}</p>

            <div className="bg-[#134E4A] text-[#FEF08A] p-3.5 rounded-xl border-3 border-[#134E4A] font-mono text-xs overflow-x-auto mb-4">
              <pre>{`import { ${selectedItemModal.name} } from "@/components/ui/Illustrations";

<${selectedItemModal.name}
  size={128}${selectedItemModal.hasJilidProp ? `\n  jilid={${activeJilid}}` : ""}
  className="${HOVER_PRESETS[hoverMode].svgClass}"
/>`}</pre>
            </div>

            <button
              type="button"
              onClick={(e) => handleCopyCode(selectedItemModal, e)}
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-xl border-4 border-[#134E4A] shadow-[4px_4px_0px_0px_#134E4A] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
            >
              <Copy size={18} strokeWidth={3} />
              <span>
                {copiedId === selectedItemModal.id
                  ? "Berhasil Disalin ke Clipboard!"
                  : "Salin Kode JSX Lengkap"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewIllustrations;
