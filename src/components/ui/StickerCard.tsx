// src/components/ui/StickerCard.tsx
import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  cardVariants,
  cardHoverVariants,
  cardTapVariants,
} from "@/lib/animationVariants";

type CardAccent = "deep-teal" | "coral" | "none";

export interface StickerCardProps
  extends Omit<HTMLMotionProps<"div">, "onClick" | "children"> {
  accent?: CardAccent;
  asButton?: boolean;
  interactive?: boolean;
  hoverable?: boolean;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const StickerCard = forwardRef<HTMLDivElement, StickerCardProps>(
  (
    {
      accent = "deep-teal",
      asButton,
      interactive,
      hoverable = true,
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
    const accentShadow = {
      "deep-teal":
        "shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] border-[var(--border-color,#134E4A)]",
      coral: "shadow-[4px_4px_0px_#FF6B6B] border-[#FF6B6B]",
      none: "shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] border-[var(--border-color,#134E4A)]",
    }[accent];

    const baseClass = `bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] border-[3px] rounded-2xl ${accentShadow} ${className}`;

    const defaultHover = hoverable ? (whileHover ?? cardHoverVariants) : undefined;
    const defaultTap = hoverable ? (whileTap ?? cardTapVariants) : undefined;

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
