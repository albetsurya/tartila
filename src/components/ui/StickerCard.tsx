// src/components/ui/StickerCard.tsx
import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  cardVariants,
  cardHoverVariants,
  cardTapVariants,
} from "@/lib/animationVariants";

export type CardAccent =
  | "deep-teal"
  | "coral"
  | "amber"
  | "blue"
  | "violet"
  | "none";

export type CardVariant =
  | "elevated"   // Classic Neo-Brutalism (3px border + 4px hard shadow)
  | "solid"      // Solid filled surface
  | "outlined"   // Clean border without shadow
  | "summary"    // Professional LMS: Clean white, 1.5px subtle border, subtle shadow
  | "action"     // Professional LMS: Quick action card with hover lift
  | "data"       // Professional LMS: Compact, hierarchical data container
  | "attention"; // Professional LMS: Highlight card for alerts/pending actions

export type CardRadius = "xl" | "2xl" | "3xl";

export interface StickerCardProps
  extends Omit<HTMLMotionProps<"div">, "onClick" | "children"> {
  accent?: CardAccent;
  variant?: CardVariant;
  radius?: CardRadius;
  asButton?: boolean;
  interactive?: boolean;
  hoverable?: boolean;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const radiusStyles: Record<CardRadius, string> = {
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

// Elevated variant: Neo-Brutalism hard shadow + 3px border
const elevatedAccentStyles: Record<CardAccent, string> = {
  "deep-teal":
    "bg-[var(--bg-card,#FFFFFF)] text-[#183B38] border-[3px] border-[var(--border-color,#134E4A)] shadow-[4px_4px_0px_var(--shadow-color,#134E4A)]",
  coral:
    "bg-[var(--bg-card,#FFFFFF)] text-[#183B38] border-[3px] border-[#FF6B6B] shadow-[4px_4px_0px_#FF6B6B]",
  amber:
    "bg-[var(--bg-card,#FFFFFF)] text-[#183B38] border-[3px] border-[#D97706] shadow-[4px_4px_0px_#D97706]",
  blue:
    "bg-[var(--bg-card,#FFFFFF)] text-[#183B38] border-[3px] border-[#2563EB] shadow-[4px_4px_0px_#2563EB]",
  violet:
    "bg-[var(--bg-card,#FFFFFF)] text-[#183B38] border-[3px] border-[#7C3AED] shadow-[4px_4px_0px_#7C3AED]",
  none:
    "bg-[var(--bg-card,#FFFFFF)] text-[#183B38] border-[3px] border-[var(--border-color,#134E4A)] shadow-[4px_4px_0px_var(--shadow-color,#134E4A)]",
};

// Solid variant: Filled surface with high contrast text
const solidAccentStyles: Record<CardAccent, string> = {
  "deep-teal":
    "bg-[#0D9488] text-white border-2 border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  coral:
    "bg-[#FF6B6B] text-white border-2 border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  amber:
    "bg-[#FDE047] text-[#134E4A] border-2 border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  blue:
    "bg-[#93C5FD] text-[#134E4A] border-2 border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  violet:
    "bg-[#DDD6FE] text-[#134E4A] border-2 border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
  none:
    "bg-[#F8FAFC] text-[#183B38] border-2 border-[#134E4A] shadow-[3px_3px_0px_#134E4A]",
};

// Outlined variant: Bordered with no hard shadow
const outlinedAccentStyles: Record<CardAccent, string> = {
  "deep-teal":
    "bg-transparent text-[#183B38] border-2 border-[var(--border-color,#134E4A)] shadow-none",
  coral:
    "bg-transparent text-[#FF6B6B] border-2 border-[#FF6B6B] shadow-none",
  amber:
    "bg-transparent text-[#B45309] border-2 border-[#D97706] shadow-none",
  blue:
    "bg-transparent text-[#1D4ED8] border-2 border-[#2563EB] shadow-none",
  violet:
    "bg-transparent text-[#6D28D9] border-2 border-[#7C3AED] shadow-none",
  none:
    "bg-transparent text-[#183B38] border-2 border-[var(--border-color,#134E4A)] shadow-none",
};

// Neo-Brutalism Card Variants
const getLmsCardStyle = (variant: CardVariant, accent: CardAccent): string => {
  switch (variant) {
    case "summary":
      return "bg-white text-[#183B38] border-2 sm:border-3 border-[#134E4A] shadow-[3px_3px_0px_#134E4A] hover:shadow-[4px_4px_0px_#134E4A] transition-all";
    case "action":
      return "bg-white text-[#183B38] border-2 sm:border-3 border-[#134E4A] shadow-[3px_3px_0px_#134E4A] hover:shadow-[5px_5px_0px_#134E4A] cursor-pointer transition-all";
    case "data":
      return "bg-white text-[#183B38] border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:shadow-[3px_3px_0px_#134E4A] transition-all";
    case "attention":
      return accent === "coral"
        ? "bg-[#FEF2F2] text-[#991B1B] border-2 border-[#FF6B6B] shadow-[3px_3px_0px_#FF6B6B]"
        : "bg-[#FFFBEB] text-[#92400E] border-2 border-[#F59E0B] shadow-[3px_3px_0px_#F59E0B]";
    case "solid":
      return solidAccentStyles[accent];
    case "outlined":
      return outlinedAccentStyles[accent];
    case "elevated":
    default:
      return elevatedAccentStyles[accent];
  }
};

export const StickerCard = forwardRef<HTMLDivElement, StickerCardProps>(
  (
    {
      accent = "deep-teal",
      variant = "elevated",
      radius = "2xl",
      asButton,
      interactive,
      hoverable,
      className = "",
      children,
      onClick,
      whileHover,
      whileTap,
      transition,
      variants,
      ...props
    },
    ref,
  ) => {
    // Default hoverable to false for static informational cards,
    // only true automatically if asButton, onClick, interactive, or action variant is set.
    const isInteractive = Boolean(
      asButton || onClick || interactive || variant === "action",
    );
    const isHoverable = hoverable !== undefined ? hoverable : isInteractive;

    const baseClass = `${radiusStyles[radius]} ${getLmsCardStyle(
      variant,
      accent,
    )} ${className}`;

    const defaultHover = isHoverable
      ? (whileHover ?? cardHoverVariants)
      : undefined;
    const defaultTap = isHoverable
      ? (whileTap ?? cardTapVariants)
      : undefined;

    if (asButton || onClick) {
      return (
        <motion.button
          onClick={onClick}
          variants={variants}
          whileHover={defaultHover}
          whileTap={defaultTap}
          transition={
            transition ?? { type: "spring", stiffness: 300, damping: 20 }
          }
          className={`${baseClass} text-left cursor-pointer`}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <motion.div
        ref={ref}
        variants={variants}
        whileHover={defaultHover}
        whileTap={defaultTap}
        transition={
          transition ?? { type: "spring", stiffness: 300, damping: 20 }
        }
        className={baseClass}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

StickerCard.displayName = "StickerCard";
