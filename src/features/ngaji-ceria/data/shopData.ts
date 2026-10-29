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
export type ItemGender = "all" | "boy" | "girl";

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
    desc: "Golden-yellow feathers of the smart bird, pride of Tartila santri.",
    price: 0,
    currency: "coin",
    rarity: "Common",
    effect: "Natural Glow",
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
    desc: "Ancient fire dragon with eternal flame power, emerald scales, golden horns, and swirling burning embers.",
    price: 800,
    currency: "coin",
    rarity: "Legendary",
    effect: "Fire Embers & Mystic Smoke",
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
    desc: "Future mecha warrior with advanced titanium armor and high-voltage neon plasma sparks.",
    price: 800,
    currency: "coin",
    rarity: "Legendary",
    effect: "Neon Electric Sparks",
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
    desc: "Arctic eternal bird with frozen glowing wings and magical ice crystals floating around.",
    price: 1500,
    currency: "coin",
    rarity: "Legendary",
    effect: "Ice Crystals",
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
    desc: "Majestic heavenly bird wrapped in pure gold with eternal holy golden starlight.",
    price: 50,
    currency: "ticket",
    rarity: "Mythic",
    effect: "Golden Stars",
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
    desc: "Dark dimension ruler with deep purple wings, mysterious spirit mist, and night shadow aura.",
    price: 2000,
    currency: "coin",
    rarity: "Legendary",
    effect: "Purple Spirit Smoke",
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
    desc: "Pure-hearted santri wrapped in clean white robe with soothing holy blessing radiance.",
    price: 350,
    currency: "coin",
    rarity: "Rare",
    effect: "Holy Light",
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
    desc: "Ancient forest guardian wrapped in mystical emerald leaves, natural branch crown, and dancing fireflies.",
    price: 500,
    currency: "coin",
    rarity: "Epic",
    effect: "Green Leaves",
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
    desc: "Guardian knight in light-reflecting steel armor with royal blue robe and impenetrable light shield.",
    price: 750,
    currency: "coin",
    rarity: "Epic",
    effect: "Metal Gleam",
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
    desc: "Desert ruler wrapped in luxurious maroon robe embroidered with pure gold, shimmering coins and gems.",
    price: 1200,
    currency: "coin",
    rarity: "Legendary",
    effect: "Gold Coins",
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
    desc: "Intergalactic space explorer with modern cosmic helmet and orbiting shining stars in zero gravity.",
    price: 1350,
    currency: "coin",
    rarity: "Legendary",
    effect: "Orbiting Stars",
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
    desc: "Deep ocean trench ruler with bioluminescent fins, coral crown, and magical water bubbles.",
    price: 1600,
    currency: "coin",
    rarity: "Legendary",
    effect: "Water Bubbles",
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
    desc: "Volcanic magma controller with glowing lava cracks and never-ending burning embers.",
    price: 1800,
    currency: "coin",
    rarity: "Legendary",
    effect: "Burning Embers",
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
    desc: "Mythological transparent diamond refracting rainbow light spectrum from pure magical crystal shards.",
    price: 40,
    currency: "ticket",
    rarity: "Mythic",
    effect: "Crystal Shards",
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
    desc: "Holy being with pearl-white feathers, divine golden halo, and heavenly feather light particles.",
    price: 75,
    currency: "ticket",
    rarity: "Mythic",
    effect: "Golden Feathers",
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
