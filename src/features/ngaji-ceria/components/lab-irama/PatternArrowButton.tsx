import React from "react";

export type PatternType =
  | "1-datar"
  | "1-naik"
  | "1-turun"
  | "2-datar-turun"
  | "3-datar-naik-turun"
  | "4-datar-naik-naik-turun";
export type ArrowType = "datar" | "naik" | "turun";

const ARROW_LABEL: Record<PatternType, string> = {
  "1-datar": "Datar",
  "1-naik": "Naik",
  "1-turun": "Turun",
  "2-datar-turun": "Datar-Turun",
  "3-datar-naik-turun": "Datar-Naik-Turun",
  "4-datar-naik-naik-turun": "Datar-Naik-Naik-Turun",
};

// Warna Neo-Brutalism
const C_TEAL = "#0D9488"; // Datar
const C_AMBER = "#F59E0B"; // Naik
const C_CORAL = "#FF6B6B"; // Turun
const C_DARK = "#134E4A"; // Titik Node (Border)

// Helper untuk menggambar garis panah SVG
function ArrowGraphic({ type }: { type: PatternType }) {
  return (
    <svg
      viewBox="0 0 100 50"
      className="w-full h-10 sm:h-12 overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {type === "1-datar" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M 10 25 L 85 25" stroke={C_TEAL} strokeWidth="5" />
          <path d="M 75 15 L 85 25 L 75 35" stroke={C_TEAL} strokeWidth="5" />
        </g>
      )}

      {type === "1-naik" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M 10 40 L 85 10" stroke={C_AMBER} strokeWidth="5" />
          <path d="M 75 15 L 85 10 L 80 22" stroke={C_AMBER} strokeWidth="5" />
        </g>
      )}

      {type === "1-turun" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M 10 10 L 85 40" stroke={C_CORAL} strokeWidth="5" />
          <path d="M 80 28 L 85 40 L 73 35" stroke={C_CORAL} strokeWidth="5" />
        </g>
      )}

      {type === "2-datar-turun" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Datar */}
          <path d="M 10 20 L 50 20" stroke={C_TEAL} strokeWidth="5" />
          <circle
            cx="50"
            cy="20"
            r="3.5"
            fill="white"
            stroke={C_DARK}
            strokeWidth="2"
          />
          {/* Turun */}
          <path d="M 50 20 L 85 40" stroke={C_CORAL} strokeWidth="5" />
          <path d="M 80 28 L 85 40 L 73 35" stroke={C_CORAL} strokeWidth="5" />
        </g>
      )}

      {type === "3-datar-naik-turun" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Datar */}
          <path d="M 10 35 L 40 35" stroke={C_TEAL} strokeWidth="5" />
          <circle
            cx="40"
            cy="35"
            r="3.5"
            fill="white"
            stroke={C_DARK}
            strokeWidth="2"
          />
          {/* Naik */}
          <path d="M 40 35 L 70 15" stroke={C_AMBER} strokeWidth="5" />
          <circle
            cx="70"
            cy="15"
            r="3.5"
            fill="white"
            stroke={C_DARK}
            strokeWidth="2"
          />
          {/* Turun */}
          <path d="M 70 15 L 85 35" stroke={C_CORAL} strokeWidth="5" />
          <path d="M 75 30 L 85 35 L 80 23" stroke={C_CORAL} strokeWidth="5" />
        </g>
      )}

      {type === "4-datar-naik-naik-turun" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Datar */}
          <path d="M 10 35 L 30 35" stroke={C_TEAL} strokeWidth="5" />
          <circle
            cx="30"
            cy="35"
            r="3.5"
            fill="white"
            stroke={C_DARK}
            strokeWidth="2"
          />

          {/* Naik 1 */}
          <path d="M 30 35 L 50 25" stroke={C_AMBER} strokeWidth="5" />
          <circle
            cx="50"
            cy="25"
            r="3.5"
            fill="white"
            stroke={C_DARK}
            strokeWidth="2"
          />

          {/* Naik 2 */}
          <path d="M 50 25 L 70 15" stroke={C_AMBER} strokeWidth="5" />
          <circle
            cx="70"
            cy="15"
            r="3.5"
            fill="white"
            stroke={C_DARK}
            strokeWidth="2"
          />

          {/* Turun */}
          <path d="M 70 15 L 85 35" stroke={C_CORAL} strokeWidth="5" />
          <path d="M 75 30 L 85 35 L 80 23" stroke={C_CORAL} strokeWidth="5" />
        </g>
      )}
    </svg>
  );
}

export interface PatternArrowButtonProps {
  type: PatternType;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  /** Opsional label lain dari pengguna (misal: "1 Nada"). */
  label?: string;
}

/**
 * Tombol panah interaktif (Neo-Brutalism).
 * Visual: border tebal 3px, hard shadow, border teal #134E4A.
 * State aktif ditandai dengan background kuning (#FEF08A) dan shadow hijau.
 */
export function PatternArrowButton({
  type,
  onClick,
  active = false,
  disabled = false,
  className = "",
  label,
}: PatternArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`
        flex flex-col items-center justify-center gap-1.5 p-2 transition-all duration-200
        rounded-xl border-[3px]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2
        ${
          active
            ? "border-[#0D9488] bg-[#FEF08A] shadow-[4px_4px_0px_#0D9488]"
            : "border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A] hover:bg-slate-50"
        }
        ${
          disabled
            ? "cursor-not-allowed opacity-50 grayscale shadow-none translate-y-[2px]"
            : "cursor-pointer active:translate-y-[2px] active:shadow-none"
        }
        ${className}
      `}
    >
      {/* Render SVG Ilustrasi */}
      <div className="w-full px-1 flex justify-center items-center">
        <ArrowGraphic type={type} />
      </div>

      {/* Label Teks */}
      <span
        className={`text-[10px] sm:text-[11px] font-black text-center leading-tight ${
          active ? "text-[#0D9488]" : "text-[#134E4A]"
        }`}
      >
        {label ?? ARROW_LABEL[type]}
      </span>
    </button>
  );
}
