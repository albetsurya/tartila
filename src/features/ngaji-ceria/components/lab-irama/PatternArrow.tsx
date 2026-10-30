import React from "react";

export type PatternArrowType =
  | "1-datar"
  | "2-datar-turun"
  | "3-datar-naik-turun"
  | "4-datar-naik-naik-turun";

// Warna Neo-Brutalism
const C_TEAL = "#0D9488"; // Datar
const C_AMBER = "#F59E0B"; // Naik
const C_CORAL = "#FF6B6B"; // Turun
const C_DARK = "#134E4A"; // Titik Node (Border)

export function PatternArrow({ type }: { type: PatternArrowType }) {
  return (
    <div className="flex items-center justify-center w-full max-w-[80px]">
      <svg
        viewBox="0 0 100 50"
        className="w-full h-10 sm:h-12 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === "1-datar" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            <path d="M 10 25 L 85 25" stroke={C_TEAL} strokeWidth="6" />
            <path d="M 75 15 L 85 25 L 75 35" stroke={C_TEAL} strokeWidth="6" />
          </g>
        )}

        {type === "2-datar-turun" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Garis Datar */}
            <path d="M 10 20 L 50 20" stroke={C_TEAL} strokeWidth="6" />
            {/* Node Putus */}
            <circle
              cx="50"
              cy="20"
              r="4.5"
              fill="white"
              stroke={C_DARK}
              strokeWidth="2.5"
            />
            {/* Garis Turun */}
            <path d="M 50 20 L 85 40" stroke={C_CORAL} strokeWidth="6" />
            <path
              d="M 80 28 L 85 40 L 73 35"
              stroke={C_CORAL}
              strokeWidth="6"
            />
          </g>
        )}

        {type === "3-datar-naik-turun" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Garis Datar */}
            <path d="M 10 35 L 40 35" stroke={C_TEAL} strokeWidth="6" />
            <circle
              cx="40"
              cy="35"
              r="4.5"
              fill="white"
              stroke={C_DARK}
              strokeWidth="2.5"
            />

            {/* Garis Naik */}
            <path d="M 40 35 L 70 15" stroke={C_AMBER} strokeWidth="6" />
            <circle
              cx="70"
              cy="15"
              r="4.5"
              fill="white"
              stroke={C_DARK}
              strokeWidth="2.5"
            />

            {/* Garis Turun */}
            <path d="M 70 15 L 85 35" stroke={C_CORAL} strokeWidth="6" />
            <path
              d="M 75 30 L 85 35 L 80 23"
              stroke={C_CORAL}
              strokeWidth="6"
            />
          </g>
        )}

        {type === "4-datar-naik-naik-turun" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Garis Datar */}
            <path d="M 10 35 L 30 35" stroke={C_TEAL} strokeWidth="6" />
            <circle
              cx="30"
              cy="35"
              r="4.5"
              fill="white"
              stroke={C_DARK}
              strokeWidth="2.5"
            />

            {/* Garis Naik 1 */}
            <path d="M 30 35 L 50 25" stroke={C_AMBER} strokeWidth="6" />
            <circle
              cx="50"
              cy="25"
              r="4.5"
              fill="white"
              stroke={C_DARK}
              strokeWidth="2.5"
            />

            {/* Garis Naik 2 */}
            <path d="M 50 25 L 70 15" stroke={C_AMBER} strokeWidth="6" />
            <circle
              cx="70"
              cy="15"
              r="4.5"
              fill="white"
              stroke={C_DARK}
              strokeWidth="2.5"
            />

            {/* Garis Turun */}
            <path d="M 70 15 L 85 35" stroke={C_CORAL} strokeWidth="6" />
            <path
              d="M 75 30 L 85 35 L 80 23"
              stroke={C_CORAL}
              strokeWidth="6"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
