import { useEffect } from "react";
import { useEconomyStore } from "./useEconomyStore";

export interface AppThemeConfig {
  id: string;
  name: string;
  desc: string;
  price: number;
  swatch: string;
  accentColor: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
  badgeBg: string;
}

export const APP_THEMES_LIST: AppThemeConfig[] = [
  {
    id: "default",
    name: "Hijau Zamrud",
    desc: "Tema orisinal Tartila yang segar, menyejukkan, dan ceria.",
    price: 0,
    swatch: "#0D9488",
    accentColor: "#0D9488",
    bgHex: "#F0FDF4",
    borderHex: "#134E4A",
    textHex: "#134E4A",
    badgeBg: "bg-[#DCFCE7] text-[#134E4A] border-[#134E4A]",
  },
  {
    id: "sky",
    name: "Langit Biru",
    desc: "Nuansa biru samudra yang sejuk, lapang, dan menenangkan.",
    price: 250,
    swatch: "#0284C7",
    accentColor: "#0284C7",
    bgHex: "#F0F9FF",
    borderHex: "#0369A1",
    textHex: "#0C4A60",
    badgeBg: "bg-[#E0F2FE] text-[#0369A1] border-[#0369A1]",
  },
  {
    id: "rose",
    name: "Sakura Manis",
    desc: "Latar merah muda lembut yang hangat, ramah, dan memikat.",
    price: 250,
    swatch: "#E11D48",
    accentColor: "#E11D48",
    bgHex: "#FFF1F2",
    borderHex: "#BE123C",
    textHex: "#881337",
    badgeBg: "bg-[#FFE4E6] text-[#BE123C] border-[#BE123C]",
  },
  {
    id: "night",
    name: "Malam Khusyuk",
    desc: "Paduan slate modern dan indigo elegan untuk suasana fokus.",
    price: 300,
    swatch: "#4F46E5",
    accentColor: "#4F46E5",
    bgHex: "#F1F5F9",
    borderHex: "#334155",
    textHex: "#1E293B",
    badgeBg: "bg-[#E0E7FF] text-[#4338CA] border-[#4338CA]",
  },
  {
    id: "gold",
    name: "Kemilau Emas",
    desc: "Kemewahan emas bersahaja yang bercahaya dan bersemangat.",
    price: 300,
    swatch: "#CA8A04",
    accentColor: "#CA8A04",
    bgHex: "#FEFCE8",
    borderHex: "#A16207",
    textHex: "#713F12",
    badgeBg: "bg-[#FEF9C3] text-[#A16207] border-[#A16207]",
  },
];

export function useAppTheme() {
  const equippedAppTheme = useEconomyStore((s) => s.equippedAppTheme) || "default";
  const ownedAppThemes = useEconomyStore((s) => s.ownedAppThemes) || ["default"];
  const equipAppTheme = useEconomyStore((s) => s.equipAppTheme);
  const buyAppTheme = useEconomyStore((s) => s.buyAppTheme);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-app-theme", equippedAppTheme);
    }
  }, [equippedAppTheme]);

  const currentTheme =
    APP_THEMES_LIST.find((t) => t.id === equippedAppTheme) || APP_THEMES_LIST[0];

  return {
    equippedAppTheme,
    ownedAppThemes,
    currentTheme,
    themes: APP_THEMES_LIST,
    equipAppTheme,
    buyAppTheme,
  };
}
