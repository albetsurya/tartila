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
    name: "Emerald Classic",
    desc: "The original Tartila experience. Fresh and natural.",
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
    name: "Azure Sky",
    desc: "Clear blue sky, fresh and calming.",
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
    name: "Cherry Blossom",
    desc: "Sweet pink aesthetic for a lovely mood.",
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
    name: "Midnight Galaxy",
    desc: "Deep dark mode with glowing stars.",
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
    name: "Royal Gold",
    desc: "Luxurious gold accents for true champions.",
    price: 300,
    swatch: "#CA8A04",
    accentColor: "#CA8A04",
    bgHex: "#FEFCE8",
    borderHex: "#A16207",
    textHex: "#713F12",
    badgeBg: "bg-[#FEF9C3] text-[#A16207] border-[#A16207]",
  },
  {
    id: "neon",
    name: "Cyber Neon",
    desc: "Futuristic cyberpunk vibes with bright neon lights.",
    price: 300,
    swatch: "#38BDF8",
    accentColor: "#38BDF8",
    bgHex: "#111827",
    borderHex: "#38BDF8",
    textHex: "#38BDF8",
    badgeBg: "bg-[#1F2937] text-[#38BDF8] border-[#38BDF8]",
  },
  {
    id: "retro",
    name: "Retro Arcade",
    desc: "Classic vintage console style.",
    price: 300,
    swatch: "#F59E0B",
    accentColor: "#B45309",
    bgHex: "#FFFBEB",
    borderHex: "#B45309",
    textHex: "#B45309",
    badgeBg: "bg-[#FEF3C7] text-[#B45309] border-[#B45309]",
  },
  {
    id: "pastel",
    name: "Sweet Pastel",
    desc: "Soft and colorful pastel dreams.",
    price: 400,
    swatch: "#F9A8D4",
    accentColor: "#EC4899",
    bgHex: "#FCE7F3",
    borderHex: "#EC4899",
    textHex: "#EC4899",
    badgeBg: "bg-[#FCE7F3] text-[#EC4899] border-[#EC4899]",
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
      document.body.setAttribute("data-app-theme", equippedAppTheme);
      if (equippedAppTheme === "night" || equippedAppTheme === "neon") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
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
