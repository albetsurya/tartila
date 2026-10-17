import { HTMLAttributes, MouseEvent, forwardRef } from "react";

type CardAccent = "deep-teal" | "coral" | "none";

interface StickerCardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: CardAccent;
  asButton?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export const StickerCard = forwardRef<HTMLDivElement, StickerCardProps>(
  (
    {
      accent = "deep-teal",
      asButton,
      className = "",
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const accentShadow = {
      "deep-teal": "shadow-[4px_4px_0px_#134E4A] border-[#134E4A]",
      coral: "shadow-[4px_4px_0px_#FF6B6B] border-[#FF6B6B]",
      none: "shadow-[4px_4px_0px_#134E4A] border-[#134E4A]",
    }[accent];

    const baseClass = `bg-white border-[3px] rounded-2xl ${accentShadow} ${className}`;

    if (asButton || onClick) {
      return (
        <button
          onClick={onClick}
          className={`${baseClass} text-left transition-all active:translate-y-[2px] active:shadow-none`}
        >
          {children}
        </button>
      );
    }

    return (
      <div ref={ref} className={baseClass} {...props}>
        {children}
      </div>
    );
  },
);

StickerCard.displayName = "StickerCard";
