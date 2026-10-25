export type MascotSkin =
  | "default"
  | "naga"
  | "robot"
  | "phoenix_ice"
  | "phoenix_gold"
  | "phoenix_dark"
  | "santri_teladan"
  | "sultan_arabia"
  | "penjelajah_angkasa"
  | "ninja_bayangan"
  | "ksatria_baja"
  | "penjaga_hutan"
  | "raja_samudra"
  | "api_membara"
  | "pelangi_kristal"
  | "malaikat_cahaya";

export type CurrencyKind = "coin" | "ticket";
export type SkinRarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export interface SkinItem {
  id: string;
  skinKey: MascotSkin;
  name: string;
  desc: string;
  price: number;
  currency?: CurrencyKind;
  rarity?: SkinRarity;
  effect: string;
  accentColor: string;
  badgeBg: string;
  badgeText?: string;
  exclusiveGender?: "boy" | "girl";
  swatch: string;
  previewColors: {
    body: string;
    accent: string;
    belly: string;
  };
}

export const RARITY_ORDER: Record<SkinRarity, number> = {
  Common: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
  Mythic: 5,
};

export const RARITY_BADGE_CLASSES: Record<SkinRarity, string> = {
  Common:
    "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600",
  Rare: "bg-sky-100 text-sky-800 border-sky-400 dark:bg-sky-900/60 dark:text-sky-300 dark:border-sky-500 font-black",
  Epic: "bg-purple-100 text-purple-900 border-purple-400 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-500 font-black shadow-[0_0_6px_rgba(168,85,247,0.3)]",
  Legendary:
    "bg-gradient-to-r from-amber-200 to-yellow-300 text-amber-950 border-amber-500 dark:from-amber-600 dark:to-yellow-500 dark:text-white dark:border-amber-400 font-black shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  Mythic:
    "bg-gradient-to-r from-amber-200 via-rose-300 to-purple-300 text-purple-950 border-amber-400 dark:from-amber-500 dark:via-rose-600 dark:to-purple-700 dark:text-white dark:border-amber-300 font-black shadow-[0_0_10px_rgba(217,70,239,0.5)]",
};

export const SKIN_ITEMS: SkinItem[] = [
  {
    id: "skin_default",
    skinKey: "default",
    name: "Classic Ceria",
    desc: "Bulu kuning emas burung pintar kebanggaan santri Tartila.",
    price: 0,
    currency: "coin",
    rarity: "Common",
    effect: "Kilau Alami",
    accentColor: "#FBBF24",
    badgeBg: RARITY_BADGE_CLASSES.Common,
    badgeText: "COMMON",
    swatch: "#FBBF24",
    previewColors: {
      body: "#FBBF24",
      accent: "#00B894",
      belly: "#EAA012",
    },
  },
  {
    id: "skin_naga",
    skinKey: "naga",
    name: "Inferno Dragon",
    desc: "Naga api purba berkekuatan kobaran api abadi dengan sisik zamrud, tanduk emas, dan pusaran bara membara.",
    price: 800,
    currency: "coin",
    rarity: "Legendary",
    effect: "Bara Api & Asap Mistis",
    accentColor: "#059669",
    badgeBg: RARITY_BADGE_CLASSES.Legendary,
    badgeText: "LEGENDARY",
    swatch: "#059669",
    previewColors: {
      body: "#059669",
      accent: "#FBBF24",
      belly: "#FDE68A",
    },
  },
  {
    id: "skin_robot",
    skinKey: "robot",
    name: "Cyber Vanguard",
    desc: "Prajurit mecha masa depan berzirah titanium canggih dengan percikan kilat plasma neon bertegangan tinggi.",
    price: 800,
    currency: "coin",
    rarity: "Legendary",
    effect: "Percikan Listrik Neon",
    accentColor: "#06B6D4",
    badgeBg: RARITY_BADGE_CLASSES.Legendary,
    badgeText: "LEGENDARY",
    swatch: "#94A3B8",
    previewColors: {
      body: "#94A3B8",
      accent: "#06B6D4",
      belly: "#CBD5E1",
    },
  },
  {
    id: "skin_phoenix_ice",
    skinKey: "phoenix_ice",
    name: "Frost Phoenix",
    desc: "Burung abadi es Arktik dengan sayap beku bercahaya dan kristal es magis yang melayang.",
    price: 1500,
    currency: "coin",
    rarity: "Legendary",
    effect: "Kristal Es",
    accentColor: "#38BDF8",
    badgeBg: RARITY_BADGE_CLASSES.Legendary,
    badgeText: "LEGENDARY",
    swatch: "#38BDF8",
    previewColors: {
      body: "#38BDF8",
      accent: "#F8FAFC",
      belly: "#BAE6FD",
    },
  },
  {
    id: "skin_phoenix_gold",
    skinKey: "phoenix_gold",
    name: "Celestial Phoenix",
    desc: "Wujud agung burung surga berselimut emas murni dengan pendar bintang emas suci abadi.",
    price: 50,
    currency: "ticket",
    rarity: "Mythic",
    effect: "Bintang Emas",
    accentColor: "#FBBF24",
    badgeBg: RARITY_BADGE_CLASSES.Mythic,
    badgeText: "MYTHIC",
    swatch: "#FBBF24",
    previewColors: {
      body: "#FBBF24",
      accent: "#D97706",
      belly: "#FEF08A",
    },
  },
  {
    id: "skin_phoenix_dark",
    skinKey: "phoenix_dark",
    name: "Abyssal Phoenix",
    desc: "Penguasa dimensi kegelapan bersayap ungu pekat berhias kabut roh misterius dan aura bayangan malam.",
    price: 2000,
    currency: "coin",
    rarity: "Legendary",
    effect: "Asap Ungu Roh",
    accentColor: "#4C1D95",
    badgeBg: RARITY_BADGE_CLASSES.Legendary,
    badgeText: "LEGENDARY",
    swatch: "#4C1D95",
    previewColors: {
      body: "#4C1D95",
      accent: "#111827",
      belly: "#2E1065",
    },
  },

  // --- 10 SKIN BARU (MOBILE LEGENDS VIBE) ---
  {
    id: "skin_santri_teladan",
    skinKey: "santri_teladan",
    name: "Sacred Novice",
    desc: "Santri berhati murni berselimut jubah putih bersih dengan pancaran berkah suci nan menyejukkan hati.",
    price: 350,
    currency: "coin",
    rarity: "Rare",
    effect: "Cahaya Suci",
    accentColor: "#10B981",
    badgeBg: RARITY_BADGE_CLASSES.Rare,
    badgeText: "RARE",
    swatch: "#F8FAFC",
    previewColors: {
      body: "#F8FAFC",
      accent: "#10B981",
      belly: "#E2E8F0",
    },
  },
  {
    id: "skin_penjaga_hutan",
    skinKey: "penjaga_hutan",
    name: "Emerald Ranger",
    desc: "Penjaga rimba kuno berselimut dedaunan zamrud mistis, mahkota ranting alam, dan tarian kunang-kunang.",
    price: 500,
    currency: "coin",
    rarity: "Epic",
    effect: "Daun Hijau",
    accentColor: "#84CC16",
    badgeBg: RARITY_BADGE_CLASSES.Epic,
    badgeText: "EPIC",
    swatch: "#65A30D",
    previewColors: {
      body: "#65A30D",
      accent: "#78350F",
      belly: "#BEF264",
    },
  },
  {
    id: "skin_ninja_bayangan",
    skinKey: "ninja_bayangan",
    name: "Shadow Assassin",
    desc: "Pengintai malam gesit berikat kepala merah menyala, jubah hitam legam, dan kabut asap sakura hitam senyap.",
    price: 650,
    currency: "coin",
    rarity: "Epic",
    effect: "Asap Hitam",
    accentColor: "#EF4444",
    badgeBg: RARITY_BADGE_CLASSES.Epic,
    badgeText: "EPIC",
    swatch: "#1E293B",
    previewColors: {
      body: "#1E293B",
      accent: "#EF4444",
      belly: "#475569",
    },
  },
  {
    id: "skin_ksatria_baja",
    skinKey: "ksatria_baja",
    name: "Iron Paladin",
    desc: "Ksatria pelindung berbaju zirah baja pantulan cahaya dengan jubah biru royal dan perisai cahaya tak tertembus.",
    price: 750,
    currency: "coin",
    rarity: "Epic",
    effect: "Kilauan Logam",
    accentColor: "#2563EB",
    badgeBg: RARITY_BADGE_CLASSES.Epic,
    badgeText: "EPIC",
    swatch: "#64748B",
    previewColors: {
      body: "#64748B",
      accent: "#2563EB",
      belly: "#E2E8F0",
    },
  },
  {
    id: "skin_sultan_arabia",
    skinKey: "sultan_arabia",
    name: "Desert Sultan",
    desc: "Penguasa gurun pasir berbalut jubah mewah merah marun bersulam emas murni dengan kilauan koin dan permata.",
    price: 1200,
    currency: "coin",
    rarity: "Legendary",
    effect: "Koin Emas",
    accentColor: "#D97706",
    badgeBg: RARITY_BADGE_CLASSES.Legendary,
    badgeText: "LEGENDARY",
    swatch: "#9F1239",
    previewColors: {
      body: "#9F1239",
      accent: "#F59E0B",
      belly: "#FDE68A",
    },
  },
  {
    id: "skin_penjelajah_angkasa",
    skinKey: "penjelajah_angkasa",
    name: "Cosmic Voyager",
    desc: "Penjelajah galaksi antariksa dengan helm kosmik modern dan orbit bintang bercahaya dalam gravitasi nol.",
    price: 1350,
    currency: "coin",
    rarity: "Legendary",
    effect: "Bintang Orbit",
    accentColor: "#6366F1",
    badgeBg: RARITY_BADGE_CLASSES.Legendary,
    badgeText: "LEGENDARY",
    swatch: "#4F46E5",
    previewColors: {
      body: "#F8FAFC",
      accent: "#4F46E5",
      belly: "#C7D2FE",
    },
  },
  {
    id: "skin_raja_samudra",
    skinKey: "raja_samudra",
    name: "Abyssal Lord",
    desc: "Penguasa palung samudra dalam dengan sirip bioluminesensi, mahkota karang, dan gelembung air ajaib.",
    price: 1600,
    currency: "coin",
    rarity: "Legendary",
    effect: "Gelembung Air",
    accentColor: "#0284C7",
    badgeBg: RARITY_BADGE_CLASSES.Legendary,
    badgeText: "LEGENDARY",
    swatch: "#0369A1",
    previewColors: {
      body: "#0369A1",
      accent: "#2DD4BF",
      belly: "#7DD3FC",
    },
  },
  {
    id: "skin_api_membara",
    skinKey: "api_membara",
    name: "Blazing Inferno",
    desc: "Pengendali magma vulkanik membara dengan retakan lava pijar dan kobaran bara api yang tak pernah padam.",
    price: 1800,
    currency: "coin",
    rarity: "Legendary",
    effect: "Bara Api",
    accentColor: "#EA580C",
    badgeBg: RARITY_BADGE_CLASSES.Legendary,
    badgeText: "LEGENDARY",
    swatch: "#C2410C",
    previewColors: {
      body: "#431407",
      accent: "#EA580C",
      belly: "#FB923C",
    },
  },
  {
    id: "skin_pelangi_kristal",
    skinKey: "pelangi_kristal",
    name: "Prismatic Gem",
    desc: "Berlian tembus pandang mitologi yang membiaskan spektrum cahaya pelangi dari serpihan kristal magis murni.",
    price: 40,
    currency: "ticket",
    rarity: "Mythic",
    effect: "Pecahan Kristal",
    accentColor: "#EC4899",
    badgeBg: RARITY_BADGE_CLASSES.Mythic,
    badgeText: "MYTHIC",
    swatch: "#F472B6",
    previewColors: {
      body: "#F472B6",
      accent: "#38BDF8",
      belly: "#FDE047",
    },
  },
  {
    id: "skin_malaikat_cahaya",
    skinKey: "malaikat_cahaya",
    name: "Seraphim Light",
    desc: "Wujud suci berbulu putih mutiara dengan lingkaran cahaya emas illahi dan partikel bulu cahaya surgawi.",
    price: 75,
    currency: "ticket",
    rarity: "Mythic",
    effect: "Bulu Emas",
    accentColor: "#FACC15",
    badgeBg: RARITY_BADGE_CLASSES.Mythic,
    badgeText: "MYTHIC",
    swatch: "#FEF9C3",
    previewColors: {
      body: "#FFFFFF",
      accent: "#FACC15",
      belly: "#FEF08A",
    },
  },
];
