import React from "react";
import { PetiHartaSvg, ItemMerahSvg } from "@/components/ui/Illustrations";

export interface InteractiveIconButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const InteractiveIconButton: React.FC<InteractiveIconButtonProps> = ({
  children,
  onClick,
  className = "",
  ariaLabel,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className={`group inline-flex items-center justify-center focus:outline-none select-none transition-transform active:scale-95 ${className}`}
  >
    <div className="transition-all duration-150 ease-out drop-shadow-[4px_4px_0px_#134E4A] group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:drop-shadow-[8px_8px_0px_#134E4A] group-active:translate-x-1 group-active:translate-y-1 group-active:drop-shadow-[0px_0px_0px_#134E4A]">
      {children}
    </div>
  </button>
);

export const InteractivePopButton: React.FC<InteractiveIconButtonProps> = ({
  children,
  onClick,
  className = "",
  ariaLabel,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className={`group inline-flex items-center justify-center focus:outline-none select-none transition-transform duration-150 ease-out hover:scale-110 hover:-rotate-6 active:scale-95 active:rotate-3 ${className}`}
  >
    {children}
  </button>
);

export function InteractiveIcons() {
  return (
    <div className="flex flex-wrap items-center gap-8 p-6 bg-[#FFFBEB] rounded-2xl border-4 border-[#134E4A] shadow-[6px_6px_0px_#134E4A]">
      {/* Efek Tombol Sticker Neo-Brutalism langsung di SVG */}
      <InteractiveIconButton ariaLabel="Peti Harta Karun">
        <PetiHartaSvg size={96} />
      </InteractiveIconButton>

      {/* Efek Goyang Komik (Tilt + Pop) untuk Item Game */}
      <InteractivePopButton ariaLabel="Item Bintang Pop Merah">
        <ItemMerahSvg size={96} />
      </InteractivePopButton>
    </div>
  );
}

export default InteractiveIcons;
