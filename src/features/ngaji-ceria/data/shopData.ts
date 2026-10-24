export type MascotSkin =
  | "default"
  | "naga"
  | "robot"
  | "phoenix_ice"
  | "phoenix_gold"
  | "phoenix_dark";

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

export const SKIN_ITEMS: SkinItem[] = [
  {
    id: "skin_default",
    skinKey: "default",
    name: "Klasik Ceria",
    desc: "Bulu kuning emas burung pintar kebanggaan santri Tartila.",
    price: 0,
    currency: "coin",
    rarity: "Common",
    effect: "Kilau Alami",
    accentColor: "#FBBF24",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
    badgeText: "KLASIK",
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
    name: "Naga Ksatria",
    desc: "Bulu hijau zamrud legendaris dengan tanduk emas, sisik mistis, dan aura asap bara api.",
    price: 800,
    currency: "coin",
    rarity: "Legendary",
    effect: "Asap & Bara Api",
    accentColor: "#059669",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
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
    name: "Robot Cyber",
    desc: "Baju pelindung perak futuristik, antena cyber, dan mata kotak LED cyan berdaya tinggi.",
    price: 800,
    currency: "coin",
    rarity: "Legendary",
    effect: "Percikan Listrik & Neon",
    accentColor: "#06B6D4",
    badgeBg: "bg-cyan-100 text-cyan-800 border-cyan-300",
    badgeText: "CYBER",
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
    name: "Phoenix Es",
    desc: "Burung abadi es Arktik berbulu biru langit dengan aksen putih salju dan kristal es melayang.",
    price: 1500,
    currency: "coin",
    rarity: "Legendary",
    effect: "Salju & Kristal Es",
    accentColor: "#38BDF8",
    badgeBg: "bg-sky-100 text-sky-800 border-sky-300",
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
    name: "Phoenix Emas",
    desc: "Wujud agung burung surga berselimut emas murni berhias bulu merak dengan kilau bintang berkilauan.",
    price: 50,
    currency: "ticket",
    rarity: "Mythic",
    effect: "Kilau Emas Abadi",
    accentColor: "#FBBF24",
    badgeBg:
      "bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-amber-900 border-amber-400",
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
    name: "Phoenix Kegelapan",
    desc: "Kekuatan bayangan malam bersayap ungu gelap misterius dengan aksen hitam dan roh asap ungu.",
    price: 2000,
    currency: "coin",
    rarity: "Legendary",
    effect: "Asap Ungu Misterius",
    accentColor: "#4C1D95",
    badgeBg: "bg-purple-100 text-purple-900 border-purple-300",
    badgeText: "LEGENDARY",
    swatch: "#4C1D95",
    previewColors: {
      body: "#4C1D95",
      accent: "#111827",
      belly: "#2E1065",
    },
  },
];
