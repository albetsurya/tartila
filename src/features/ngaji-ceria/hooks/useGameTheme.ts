import { useEconomyStore } from "./useEconomyStore";

export interface GameThemeStyles {
  themeId: string;
  isDefault: boolean;
  isNeon: boolean;
  isRetro: boolean;
  isPastel: boolean;
  bgClass: string;
  cardBgClass: string;
  borderClass: string;
  textClass: string;
  shadowClass: string;
  shadowHoverClass: string;
  headerClass: string;
  badgeClass: string;
  subtextClass: string;
  btnPrimaryClass: string;
  heroBgClass: string;
  heroBorderClass: string;
  heroShadowClass: string;
}

export const GAME_THEME_MAP: Record<string, GameThemeStyles> = {
  default: {
    themeId: "default",
    isDefault: true,
    isNeon: false,
    isRetro: false,
    isPastel: false,
    bgClass: "bg-[#F0FDF4]",
    cardBgClass: "bg-white",
    borderClass: "border-[#134E4A]",
    textClass: "text-[#134E4A]",
    shadowClass: "shadow-[4px_4px_0px_#134E4A]",
    shadowHoverClass: "hover:shadow-[6px_6px_0px_#134E4A]",
    headerClass: "text-[#134E4A]",
    badgeClass: "bg-[#DCFCE7] text-[#134E4A] border-[#134E4A]",
    subtextClass: "text-[#134E4A]/70",
    btnPrimaryClass: "bg-[#FF6B6B] hover:bg-[#EE5A5A] text-white border-[#134E4A] shadow-[2px_2px_0px_#134E4A]",
    heroBgClass: "bg-[#134E4A] text-white",
    heroBorderClass: "border-[#134E4A]",
    heroShadowClass: "shadow-[4px_4px_0px_#FF6B6B]",
  },
  neon: {
    themeId: "neon",
    isDefault: false,
    isNeon: true,
    isRetro: false,
    isPastel: false,
    bgClass: "bg-[#111827]",
    cardBgClass: "bg-[#1F2937]",
    borderClass: "border-[#38BDF8]",
    textClass: "text-[#38BDF8]",
    shadowClass: "shadow-[4px_4px_0px_#0EA5E9]",
    shadowHoverClass: "hover:shadow-[6px_6px_0px_#0EA5E9]",
    headerClass: "text-[#38BDF8]",
    badgeClass: "bg-[#0F172A] text-[#38BDF8] border-[#38BDF8]",
    subtextClass: "text-sky-200/70",
    btnPrimaryClass: "bg-[#0EA5E9] hover:bg-[#0284C7] text-white border-[#38BDF8] shadow-[2px_2px_0px_#38BDF8]",
    heroBgClass: "bg-[#1F2937] text-white",
    heroBorderClass: "border-[#38BDF8]",
    heroShadowClass: "shadow-[4px_4px_0px_#0EA5E9]",
  },
  retro: {
    themeId: "retro",
    isDefault: false,
    isNeon: false,
    isRetro: true,
    isPastel: false,
    bgClass: "bg-[#FFFBEB]",
    cardBgClass: "bg-[#FEF3C7]",
    borderClass: "border-[#B45309]",
    textClass: "text-[#B45309]",
    shadowClass: "shadow-[4px_4px_0px_#92400E]",
    shadowHoverClass: "hover:shadow-[6px_6px_0px_#92400E]",
    headerClass: "text-[#B45309]",
    badgeClass: "bg-[#FEF08A] text-[#B45309] border-[#B45309]",
    subtextClass: "text-[#B45309]/75",
    btnPrimaryClass: "bg-[#D97706] hover:bg-[#B45309] text-white border-[#B45309] shadow-[2px_2px_0px_#92400E]",
    heroBgClass: "bg-[#B45309] text-white",
    heroBorderClass: "border-[#78350F]",
    heroShadowClass: "shadow-[4px_4px_0px_#92400E]",
  },
  pastel: {
    themeId: "pastel",
    isDefault: false,
    isNeon: false,
    isRetro: false,
    isPastel: true,
    bgClass: "bg-[#FCE7F3]",
    cardBgClass: "bg-white",
    borderClass: "border-[#EC4899]",
    textClass: "text-[#EC4899]",
    shadowClass: "shadow-[4px_4px_0px_#BE185D]",
    shadowHoverClass: "hover:shadow-[6px_6px_0px_#BE185D]",
    headerClass: "text-[#EC4899]",
    badgeClass: "bg-[#FBCFE8] text-[#BE185D] border-[#EC4899]",
    subtextClass: "text-[#EC4899]/75",
    btnPrimaryClass: "bg-[#EC4899] hover:bg-[#DB2777] text-white border-[#BE185D] shadow-[2px_2px_0px_#BE185D]",
    heroBgClass: "bg-[#BE185D] text-white",
    heroBorderClass: "border-[#9D174D]",
    heroShadowClass: "shadow-[4px_4px_0px_#F472B6]",
  },
};

export function getGameThemeStyles(themeId?: string): GameThemeStyles {
  const normalized = (themeId || "default").replace(/^theme_/, "");
  return GAME_THEME_MAP[normalized] || GAME_THEME_MAP.default;
}

export function useGameTheme(): GameThemeStyles {
  const equippedGameTheme = useEconomyStore((state) => state.equippedGameTheme) || "default";
  return getGameThemeStyles(equippedGameTheme);
}
