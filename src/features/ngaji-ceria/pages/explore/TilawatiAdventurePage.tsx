import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { useNgajiCeriaStore } from "../../hooks/useNgajiCeriaStore";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";
import { useAuth } from "@/contexts/AuthContext";
import { isUstadzUser, isTartilaAdmin } from "@/lib/roles";
import {
  ExploreHeader,
  ExploreStatBadge,
} from "../../components/ExploreHeader";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { MapPinSvg, LockSvg, TelescopeSvg } from "@/components/ui/CustomIcons";

/* ============================================================================
 * 100% PURE NEO-BRUTALISM TOPOGRAPHIC ATLAS & TERRAIN CARTOGRAPHY
 * Sinkron penuh dengan TilawatiMapPage.tsx:
 * Zero Blur, Hard Offset Shadows, High-Contrast Borders, & Hypsometric Tints
 * ============================================================================ */

interface SvgProps {
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
}

interface JilidAtlasTheme {
  regionKicker: string;
  elevationRange: string;
  peakLabel: string;
  mapScale: string;
  symbol: string;
  hypsometricScale: string[];
  panel: string;
  panelHeader: string;
  panelLine: string;
  panelShadow: string;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
  node: string;
  nodeLine: string;
  nodeShadow: string;
  pathDone: string;
  pathHalo: string;
  isDark: boolean;
}

const JILID_ATLAS_THEMES: Record<number, JilidAtlasTheme> = {
  1: {
    regionKicker: "PETA BATIMETRI & ATOLL",
    elevationRange: "-40m s/d +125m",
    peakLabel: "▲ 140m",
    mapScale: "1 : 25.000",
    symbol: "⛵",
    hypsometricScale: ["#4D9EB8", "#82CADE", "#F4E5BC", "#A9D17B", "#5B9A54"],
    panel: "#FFFDF5",
    panelHeader: "#D8F3FA",
    panelLine: "#09303D",
    panelShadow: "#09303D",
    ink: "#09303D",
    muted: "#1E5668",
    accent: "#FF9F1C",
    accentSoft: "#FFE599",
    node: "#0081A7",
    nodeLine: "#09303D",
    nodeShadow: "#09303D",
    pathDone: "#E65127",
    pathHalo: "#FFFDF5",
    isDark: false,
  },
  2: {
    regionKicker: "TOPOGRAFI NGARAI & DAS",
    elevationRange: "+85m s/d +640m",
    peakLabel: "▲ 640m",
    mapScale: "1 : 30.000",
    symbol: "🌉",
    hypsometricScale: ["#58A4B0", "#C5DCA0", "#EFE0B4", "#DDA96B", "#B5733D"],
    panel: "#FFF9EB",
    panelHeader: "#FCE1B6",
    panelLine: "#3D1E05",
    panelShadow: "#3D1E05",
    ink: "#3D1E05",
    muted: "#6E3B10",
    accent: "#F77F00",
    accentSoft: "#FFD166",
    node: "#D65A1E",
    nodeLine: "#3D1E05",
    nodeShadow: "#3D1E05",
    pathDone: "#D6451B",
    pathHalo: "#FFF9EB",
    isDark: false,
  },
  3: {
    regionKicker: "ATLAS ELEVASI ALPIN",
    elevationRange: "+750m s/d +3.120m",
    peakLabel: "▲ 3.120m",
    mapScale: "1 : 40.000",
    symbol: "⛰",
    hypsometricScale: ["#6D9F71", "#99C286", "#D2DEC2", "#B5BEB8", "#F5FAF7"],
    panel: "#F4FBF4",
    panelHeader: "#D6EFE0",
    panelLine: "#0D2E18",
    panelShadow: "#0D2E18",
    ink: "#0D2E18",
    muted: "#265936",
    accent: "#FFB703",
    accentSoft: "#C7F9CC",
    node: "#2B8A3E",
    nodeLine: "#0D2E18",
    nodeShadow: "#0D2E18",
    pathDone: "#E05A2B",
    pathHalo: "#F4FBF4",
    isDark: false,
  },
  4: {
    regionKicker: "PETA NAVIGASI PESISIR",
    elevationRange: "-80m s/d +210m",
    peakLabel: "Fl.W.5s 28m",
    mapScale: "1 : 20.000",
    symbol: "⚓",
    hypsometricScale: ["#34789E", "#65A8C4", "#F4E3B4", "#C7DBA0", "#8BB36E"],
    panel: "#F5FAFF",
    panelHeader: "#DCEFFC",
    panelLine: "#0A2540",
    panelShadow: "#0A2540",
    ink: "#0A2540",
    muted: "#244E73",
    accent: "#EF476F",
    accentSoft: "#FFD6E0",
    node: "#118AB2",
    nodeLine: "#0A2540",
    nodeShadow: "#0A2540",
    pathDone: "#EF476F",
    pathHalo: "#F5FAFF",
    isDark: false,
  },
  5: {
    regionKicker: "PETA GEOLOGI KALDERA",
    elevationRange: "+920m s/d +2.890m",
    peakLabel: "▲ 2.890m",
    mapScale: "1 : 15.000",
    symbol: "🌋",
    hypsometricScale: ["#2C2224", "#493435", "#6E4843", "#C85A32", "#FFB648"],
    panel: "#362023",
    panelHeader: "#522A2D",
    panelLine: "#FF9F1C",
    panelShadow: "#12090A",
    ink: "#FFF3E6",
    muted: "#F4B89A",
    accent: "#FF9F1C",
    accentSoft: "#5E2A27",
    node: "#E63946",
    nodeLine: "#FFE599",
    nodeShadow: "#12090A",
    pathDone: "#FF6B1A",
    pathHalo: "#12090A",
    isDark: true,
  },
  6: {
    regionKicker: "ATLAS PUNCAK & ASTRONOMI",
    elevationRange: "+1.800m s/d +4.200m",
    peakLabel: "▲ 4.200m",
    mapScale: "1 : 10.000",
    symbol: "✦",
    hypsometricScale: ["#1D2042", "#2C3163", "#434A87", "#7378B5", "#F3D078"],
    panel: "#26234F",
    panelHeader: "#393470",
    panelLine: "#FFD166",
    panelShadow: "#0B0A1F",
    ink: "#F8F5FF",
    muted: "#D0C8F8",
    accent: "#FFD166",
    accentSoft: "#433D7A",
    node: "#7209B7",
    nodeLine: "#FFD166",
    nodeShadow: "#0B0A1F",
    pathDone: "#FFD166",
    pathHalo: "#0B0A1F",
    isDark: true,
  },
};

const AtlasCompassSvg: React.FC<SvgProps> = ({ size = 36, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="18"
      cy="18"
      r="16"
      fill="#FFFDF5"
      stroke="#09303D"
      strokeWidth="2.5"
    />
    <circle
      cx="18"
      cy="18"
      r="12"
      fill="none"
      stroke="#09303D"
      strokeWidth="1.5"
      strokeDasharray="3 2"
    />
    <polygon
      points="18,3 22,18 18,15 14,18"
      fill="#E65127"
      stroke="#09303D"
      strokeWidth="1.2"
    />
    <polygon
      points="18,33 22,18 18,21 14,18"
      fill="#0081A7"
      stroke="#09303D"
      strokeWidth="1.2"
    />
    <circle
      cx="18"
      cy="18"
      r="2.5"
      fill="#FFE599"
      stroke="#09303D"
      strokeWidth="1.5"
    />
  </svg>
);

const FoldedMapSvg: React.FC<SvgProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.5 6.5L10.5 4L17.5 6.5L24.5 4V21.5L17.5 24L10.5 21.5L3.5 24V6.5Z"
      fill="#FFFDF5"
      stroke="#09303D"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M10.5 4V21.5M17.5 6.5V24" stroke="#09303D" strokeWidth="1.8" />
    <path
      d="M6 14C8.5 11.5 12 15.5 15 12.5C17.5 10 20 13.5 22 11"
      stroke="#E65127"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    <circle cx="22" cy="11" r="2.2" fill="#E65127" />
  </svg>
);

const StarSvg: React.FC<SvgProps> = ({
  size = 14,
  className = "",
  fill = "#FF9F1C",
  stroke = "#09303D",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2.5L14.8 8.2L21 9.1L16.5 13.5L17.6 19.7L12 16.8L6.4 19.7L7.5 13.5L3 9.1L9.2 8.2L12 2.5Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

const SparklesSvg: React.FC<SvgProps> = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
      fill="#FF9F1C"
      stroke="#09303D"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="19" cy="5" r="2" fill="#E65127" />
  </svg>
);

const ArrowRightSvg: React.FC<SvgProps> = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 12H18M18 12L12 6M18 12L12 18"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TopographicAtlasBackdrop = () => (
  <div
    className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
    aria-hidden="true"
  >
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="brutal-atlas-grid"
          width="76"
          height="76"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 76 0 L 0 0 0 76"
            fill="none"
            stroke="#09303D"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.18"
          />
          <circle cx="0" cy="0" r="1.5" fill="#09303D" opacity="0.25" />
        </pattern>
      </defs>

      <g fill="none" stroke="#09303D" strokeWidth="1.5" opacity="0.12">
        <path d="M -50 140 C 140 70, 320 220, 540 120 S 880 40, 1200 160" />
        <path d="M -50 190 C 160 120, 340 270, 560 170 S 900 90, 1200 210" />
        <path d="M -50 480 C 180 410, 390 560, 620 460 S 940 390, 1200 500" />
        <path d="M -50 840 C 160 770, 380 910, 610 810 S 920 740, 1200 860" />
      </g>

      <rect width="100%" height="100%" fill="url(#brutal-atlas-grid)" />
    </svg>
  </div>
);

/**
 * Viewport Peta Topografi Mini (100% Pure Neo-Brutalism Vector Style)
 */
const TopographicSheetPreview: React.FC<{
  jilid: number;
  isUnlocked: boolean;
}> = ({ jilid, isUnlocked }) => {
  const theme = JILID_ATLAS_THEMES[jilid] || JILID_ATLAS_THEMES[1];

  return (
    <svg
      viewBox="0 0 280 128"
      preserveAspectRatio="none"
      className={`h-full w-full ${isUnlocked ? "" : "grayscale"}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter
          id={`preview-shadow-${jilid}`}
          x="-10%"
          y="-10%"
          width="125%"
          height="125%"
        >
          <feDropShadow
            dx="3"
            dy="3"
            stdDeviation="0"
            floodColor={theme.panelShadow}
            floodOpacity="1"
          />
        </filter>
      </defs>

      {/* JILID 1 */}
      {jilid === 1 && (
        <g>
          <rect width="280" height="128" fill="#63B6CE" />
          <path
            d="M-10 15 C45 5 75 45 35 80 C0 110 -25 65 -10 15Z"
            fill="#3F93AD"
            stroke="#09303D"
            strokeWidth="1.8"
          />
          <path
            d="M-10 34 Q65 10 140 36 T290 26 M-10 98 Q75 74 155 100 T290 90"
            fill="none"
            stroke="#D8F6FF"
            strokeWidth="1.4"
            strokeDasharray="5 3"
          />
          <g transform="translate(82 70) rotate(-6)">
            <ellipse
              cx="0"
              cy="0"
              rx="46"
              ry="27"
              fill="#F5E6B8"
              stroke="#09303D"
              strokeWidth="2.2"
              filter={`url(#preview-shadow-${jilid})`}
            />
            <ellipse
              cx="-2"
              cy="-1"
              rx="34"
              ry="19"
              fill="#C5E09B"
              stroke="#09303D"
              strokeWidth="1.8"
            />
            <ellipse
              cx="-4"
              cy="-2"
              rx="20"
              ry="11"
              fill="#8EC271"
              stroke="#09303D"
              strokeWidth="1.6"
            />
          </g>
          <g transform="translate(202 54) rotate(8)">
            <ellipse
              cx="0"
              cy="0"
              rx="40"
              ry="23"
              fill="#F5E6B8"
              stroke="#09303D"
              strokeWidth="2.2"
              filter={`url(#preview-shadow-${jilid})`}
            />
            <ellipse
              cx="-2"
              cy="-1"
              rx="28"
              ry="15"
              fill="#C5E09B"
              stroke="#09303D"
              strokeWidth="1.8"
            />
            <ellipse
              cx="-3"
              cy="-2"
              rx="15"
              ry="8"
              fill="#5B9A54"
              stroke="#09303D"
              strokeWidth="1.5"
            />
          </g>
        </g>
      )}

      {/* JILID 2 */}
      {jilid === 2 && (
        <g>
          <rect width="280" height="128" fill="#EDE0B3" />
          <path
            d="M70 0 C95 42 55 82 88 128 L195 128 C165 82 205 42 180 0 Z"
            fill="#C5DCA0"
            stroke="#3D1E05"
            strokeWidth="1.8"
            strokeDasharray="5 3"
          />
          <path
            d="M0 0 L84 0 C102 42 62 82 92 128 L0 128 Z"
            fill="#DFBA7B"
            stroke="#3D1E05"
            strokeWidth="2.2"
            filter={`url(#preview-shadow-${jilid})`}
          />
          <path
            d="M0 0 L54 0 C70 42 34 82 60 128 L0 128 Z"
            fill="#B5793A"
            stroke="#3D1E05"
            strokeWidth="2"
          />
          <path
            d="M280 0 L192 0 C215 42 178 82 204 128 L280 128 Z"
            fill="#DFBA7B"
            stroke="#3D1E05"
            strokeWidth="2.2"
            filter={`url(#preview-shadow-${jilid})`}
          />
          <path
            d="M280 0 L226 0 C244 42 212 82 234 128 L280 128 Z"
            fill="#B5793A"
            stroke="#3D1E05"
            strokeWidth="2"
          />
          <path
            d="M135 -10 C158 36 116 82 144 138"
            fill="none"
            stroke="#3D1E05"
            strokeWidth="20"
          />
          <path
            d="M135 -10 C158 36 116 82 144 138"
            fill="none"
            stroke="#58A4B0"
            strokeWidth="14"
          />
          <rect
            x="116"
            y="54"
            width="42"
            height="11"
            rx="2"
            fill="#FFD166"
            stroke="#3D1E05"
            strokeWidth="2"
          />
        </g>
      )}

      {/* JILID 3 */}
      {jilid === 3 && (
        <g>
          <rect width="280" height="128" fill="#B7D3A8" />
          <ellipse
            cx="42"
            cy="94"
            rx="24"
            ry="11"
            fill="#6BC2D4"
            stroke="#0D2E18"
            strokeWidth="2"
          />
          <g transform="translate(158 66)">
            <ellipse
              cx="0"
              cy="0"
              rx="96"
              ry="48"
              fill="#90BC82"
              stroke="#0D2E18"
              strokeWidth="2.2"
              filter={`url(#preview-shadow-${jilid})`}
            />
            <ellipse
              cx="-4"
              cy="-2"
              rx="70"
              ry="34"
              fill="#B4C99C"
              stroke="#0D2E18"
              strokeWidth="1.8"
              strokeDasharray="6 3"
            />
            <ellipse
              cx="-7"
              cy="-3"
              rx="46"
              ry="22"
              fill="#C9CFC7"
              stroke="#0D2E18"
              strokeWidth="1.8"
            />
            <ellipse
              cx="-9"
              cy="-4"
              rx="23"
              ry="11"
              fill="#F4FAF6"
              stroke="#0D2E18"
              strokeWidth="1.8"
            />
            <polygon points="-13,-1 -9,-9 -5,-1" fill="#0D2E18" />
          </g>
        </g>
      )}

      {/* JILID 4 */}
      {jilid === 4 && (
        <g>
          <rect width="280" height="128" fill="#5B9FB9" />
          <path
            d="M185 0 C165 42 210 82 175 128 L280 128 L280 0 Z"
            fill="#34789E"
            stroke="#0A2540"
            strokeWidth="1.8"
          />
          <path
            d="M0 0 L172 0 C150 42 195 82 158 128 L0 128 Z"
            fill="#F5E5B8"
            stroke="#0A2540"
            strokeWidth="2.4"
            filter={`url(#preview-shadow-${jilid})`}
          />
          <path
            d="M0 0 L146 0 C124 42 168 82 132 128 L0 128 Z"
            fill="#C9DEA3"
            stroke="#0A2540"
            strokeWidth="2"
          />
          <path
            d="M0 0 L102 0 C82 42 122 82 90 128 L0 128 Z"
            fill="#8BB36E"
            stroke="#0A2540"
            strokeWidth="1.8"
          />
          <g transform="translate(162 64)">
            <path
              d="M0 0 L96 -36 A102 102 0 0 1 96 36 Z"
              fill="#FFE599"
              opacity="0.45"
            />
            <circle
              cx="0"
              cy="0"
              r="7.5"
              fill="#FFFDF5"
              stroke="#0A2540"
              strokeWidth="2.2"
            />
            <circle cx="0" cy="0" r="3.2" fill="#EF476F" />
          </g>
        </g>
      )}

      {/* JILID 5 */}
      {jilid === 5 && (
        <g>
          <rect width="280" height="128" fill="#24191B" />
          <path
            d="M25 100 C85 90 115 64 145 64 C185 64 215 40 265 30"
            fill="none"
            stroke="#12090A"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M25 100 C85 90 115 64 145 64 C185 64 215 40 265 30"
            fill="none"
            stroke="#FF6B1A"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <g transform="translate(145 64)">
            <ellipse
              cx="0"
              cy="0"
              rx="86"
              ry="43"
              fill="#3D2B2D"
              stroke="#12090A"
              strokeWidth="2.4"
              filter={`url(#preview-shadow-${jilid})`}
            />
            <ellipse
              cx="0"
              cy="0"
              rx="62"
              ry="31"
              fill="#543838"
              stroke="#FF9F1C"
              strokeWidth="1.8"
              strokeDasharray="5 3"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="38"
              ry="19"
              fill="#6E443E"
              stroke="#12090A"
              strokeWidth="2"
            />
            <ellipse
              cx="0"
              cy="0"
              rx="17"
              ry="8.5"
              fill="#FF6B1A"
              stroke="#FFE599"
              strokeWidth="2"
            />
          </g>
        </g>
      )}

      {/* JILID 6 */}
      {jilid === 6 && (
        <g>
          <rect width="280" height="128" fill="#171A38" />
          <g fill="#FFD166">
            <circle cx="28" cy="24" r="2" />
            <circle cx="64" cy="16" r="1.5" />
            <circle cx="96" cy="28" r="1.8" />
            <circle cx="222" cy="20" r="2" />
          </g>
          <g transform="translate(145 76)">
            <ellipse
              cx="0"
              cy="0"
              rx="94"
              ry="39"
              fill="#252854"
              stroke="#0B0A1F"
              strokeWidth="2.4"
              filter={`url(#preview-shadow-${jilid})`}
            />
            <ellipse
              cx="0"
              cy="-2"
              rx="66"
              ry="27"
              fill="#32366E"
              stroke="#FFD166"
              strokeWidth="1.6"
              strokeDasharray="5 3"
            />
            <ellipse
              cx="0"
              cy="-4"
              rx="38"
              ry="15"
              fill="#44498C"
              stroke="#FFD166"
              strokeWidth="2"
            />
            <path
              d="M-16 2 V-8 H16 V2 Z"
              fill="#3B3A70"
              stroke="#FFD166"
              strokeWidth="1.8"
            />
            <path
              d="M-13 -8 Q0 -24 13 -8 Z"
              fill="#7209B7"
              stroke="#FFD166"
              strokeWidth="1.8"
            />
          </g>
        </g>
      )}

      {/* Grid Koordinat Lintang-Bujur */}
      <g
        stroke={theme.isDark ? "#FFFFFF" : "#09303D"}
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.22"
      >
        <line x1="70" y1="0" x2="70" y2="128" />
        <line x1="140" y1="0" x2="140" y2="128" />
        <line x1="210" y1="0" x2="210" y2="128" />
        <line x1="0" y1="42" x2="280" y2="42" />
        <line x1="0" y1="84" x2="280" y2="84" />
      </g>

      {/* Rute Casing & Pin Lokasi Mini */}
      <path
        d="M 42 88 C 88 96, 112 44, 152 60 S 208 80, 236 44"
        fill="none"
        stroke={theme.panelShadow}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M 42 88 C 88 96, 112 44, 152 60 S 208 80, 236 44"
        fill="none"
        stroke={theme.pathDone}
        strokeWidth="3.2"
        strokeDasharray="5 3"
        strokeLinecap="round"
      />
      <circle
        cx="42"
        cy="88"
        r="4.5"
        fill={theme.panel}
        stroke={theme.panelLine}
        strokeWidth="2.2"
      />
      <circle
        cx="152"
        cy="60"
        r="4.5"
        fill={theme.panel}
        stroke={theme.panelLine}
        strokeWidth="2.2"
      />
      <g transform="translate(236 44)">
        <path
          d="M2 -13 C-3 -13 -7 -9 -7 -4 C-7 2 2 4 2 4 C2 4 11 2 11 -4 C11 -9 7 -13 2 -13Z"
          fill={theme.panelShadow}
        />
        <path
          d="M0 -15 C-5 -15 -9 -11 -9 -6 C-9 0 0 2 0 2 C0 2 9 0 9 -6 C9 -11 5 -15 0 -15Z"
          fill={theme.node}
          stroke={theme.panelLine}
          strokeWidth="2"
        />
        <circle cx="0" cy="-6.5" r="3" fill={theme.panel} />
      </g>
    </svg>
  );
};

interface TilawatiLevel {
  jilid: number;
  title: string;
  regionName: string;
  coords: string;
  desc: string;
  unlocked: boolean;
  progress: number;
  totalStars: number;
  earnedStars: number;
}

const TILAWATI_LEVELS: TilawatiLevel[] = [
  {
    jilid: 1,
    title: "Tilawati 1",
    regionName: "Kepulauan Hijaiyah",
    coords: "01°12'N · 101°24'E",
    desc: "Mengenal Huruf Hijaiyah & Bunyi Fathah",
    unlocked: true,
    progress: 15,
    totalStars: 93,
    earnedStars: 0,
  },
  {
    jilid: 2,
    title: "Tilawati 2",
    regionName: "Lembah Sambung",
    coords: "02°08'N · 104°15'E",
    desc: "Huruf Bersambung & Harokat Kasrah/Dhammah",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 3,
    title: "Tilawati 3",
    regionName: "Pegunungan Irama",
    coords: "03°21'N · 108°40'E",
    desc: "Panjang Pendek (Mad Asli) & Ketukan Irama",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 4,
    title: "Tilawati 4",
    regionName: "Tanjung Waqaf",
    coords: "04°05'N · 112°18'E",
    desc: "Tanwin, Sukun & Aturan Waqaf (Berhenti)",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 5,
    title: "Tilawati 5",
    regionName: "Kawah Dengung",
    coords: "05°19'N · 116°42'E",
    desc: "Tasydid, Idgham, Ikhfa & Dengung Ghunnah",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 6,
    title: "Tilawati 6",
    regionName: "Puncak Khatam",
    coords: "06°00'N · 120°00'E",
    desc: "Gharib, Fawatihussuwar & Khatam Al-Qur'an",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
];

export default function TilawatiAdventurePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isBypass = isUstadzUser(user) || isTartilaAdmin(user?.role);
  const stars = useNgajiCeriaStore((s) => s.stars);
  const totalStars = Object.values(stars).reduce((sum, v) => sum + (v || 0), 0);

  const getJilidComputedMeta = (level: TilawatiLevel) => {
    const prefix = `jilid-${level.jilid}-`;
    const entries = Object.entries(stars).filter(([key]) =>
      key.startsWith(prefix),
    );
    const dynamicEarnedStars = entries.reduce(
      (sum, [, val]) => sum + (val || 0),
      0,
    );
    const completedPages = entries.filter(([, val]) => (val || 0) > 0).length;

    const prevPrefix = `jilid-${level.jilid - 1}-`;
    const prevCompletedPages =
      level.jilid > 1
        ? Object.entries(stars).filter(
            ([key, val]) => key.startsWith(prevPrefix) && (val || 0) === 3,
          ).length
        : 7;

    const isUnlocked =
      isBypass ||
      level.unlocked ||
      dynamicEarnedStars > 0 ||
      prevCompletedPages >= 7;

    const earnedStars = Math.max(level.earnedStars, dynamicEarnedStars);
    const computedProgress =
      completedPages > 0
        ? Math.min(100, Math.round((completedPages / 7) * 100))
        : level.progress;

    return {
      isUnlocked,
      earnedStars,
      progress: isUnlocked ? computedProgress : 0,
    };
  };

  const handleLevelClick = (level: TilawatiLevel, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    triggerBibiReaction("play");
    navigate(`/member/ngaji-ceria/explore/tilawati/${level.jilid}`);
  };

  return (
    <NgajiCeriaLayout
      title="Atlas Tilawati"
      hideHeader={true}
      themeScope="tilawati"
    >
      <ExploreHeader
        title="Atlas Topografi"
        subtitle="Pilih Sektor Peta Wilayah Jilid"
        onBack={() => navigate("/member/ngaji-ceria/map")}
        themeScope="tilawati"
        themeColorClass="bg-[#B8ECF7]"
        borderColorClass="border-[#09303D]"
        shadowClass="shadow-[0_4px_0px_#09303D]"
        textColorClass="text-[#09303D]"
        backClass="bg-[#FFFDF5] text-[#09303D] border-[2.5px] border-[#09303D] shadow-[3px_3px_0px_#09303D] hover:bg-[#FFE599] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        extraBadge={
          <ExploreStatBadge
            icon={<StarSvg size={18} fill="#FF9F1C" className="shrink-0" />}
            value={`${totalStars}/93`}
            title={`Total Bintang: ${totalStars}/93`}
            className="bg-[#FFFDF5] text-[#09303D] border-[2.5px] border-[#09303D] shadow-[3px_3px_0px_#09303D]"
          />
        }
      />

      {/* KANVAS INDEKS ATLAS TOPOGRAFI (Pure Neo-Brutalism Solid Surface) */}
      <div className="relative min-h-[100dvh] w-full bg-[#A8DCE7] pb-32 overflow-x-clip select-none">
        <TopographicAtlasBackdrop />

        {/* 1. HERO CARTOUCHE: Indeks Peta Topografi */}
        <section className="relative z-10 px-4 pt-5 max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-[#FFFDF5] border-[3.5px] border-[#09303D] p-4 sm:p-5 text-[#09303D] shadow-[6px_6px_0px_#09303D]">
            {/* Bar Atas: Metadata Kartografi & Spektrum Hypsometric */}
            <div className="relative mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b-[2.5px] border-[#09303D] pb-2.5">
              <div className="flex flex-wrap items-center gap-2 text-[9.5px] font-black uppercase tracking-[0.12em] text-[#09303D] sm:text-[10px]">
                <span className="inline-flex items-center gap-1 rounded-md bg-[#FFE599] border-[2px] border-[#09303D] px-2 py-0.5 text-[#09303D] shadow-[2px_2px_0px_#09303D]">
                  <SparklesSvg size={11} /> INDEKS ATLAS TILAWATI
                </span>
                <span className="font-mono font-black">
                  01°N–06°N · 101°E–120°E
                </span>
              </div>

              {/* Spektrum Elevasi Hypsometric Global */}
              <div
                className="flex items-center gap-1.5"
                title="Spektrum Elevasi: Batimetri Laut hingga Puncak Khatam"
              >
                <span className="font-mono text-[8.5px] font-black text-[#09303D] hidden sm:inline">
                  -80m
                </span>
                <div className="flex items-center border-[2px] border-[#09303D] shadow-[2px_2px_0px_#09303D]">
                  {[
                    "#34789E",
                    "#65A8C4",
                    "#F4E3B4",
                    "#9CC27B",
                    "#DDA96B",
                    "#C85A32",
                    "#7209B7",
                    "#FFD166",
                  ].map((hex, i) => (
                    <span
                      key={i}
                      className="h-3 w-3 border-r border-[#09303D] last:border-r-0"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[8.5px] font-black text-[#09303D] hidden sm:inline">
                  +4.200m
                </span>
              </div>
            </div>

            {/* Konten Utama Cartouche */}
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFE599] border-[3px] border-[#09303D] shadow-[4px_4px_0px_#09303D]">
                  <AtlasCompassSvg size={40} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display font-black text-lg sm:text-2xl uppercase text-[#09303D] leading-tight">
                      Atlas Topografi Pulau Mengaji
                    </h1>
                    <span className="rounded-md bg-[#B8ECF7] border-[2px] border-[#09303D] px-2 py-0.5 font-mono text-[9px] font-black text-[#09303D] shadow-[2px_2px_0px_#09303D]">
                      6 SEKTOR JILID
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#1E5668] leading-snug mt-1">
                    Pilih lembar peta wilayah untuk menelusuri kontur pos
                    halaman dari kepulauan dasar hingga puncak khatam.
                  </p>
                </div>
              </div>

              <div className="pointer-events-none hidden sm:flex items-center gap-2.5 shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[2.5px] border-[#09303D] bg-[#B8ECF7] text-[#09303D] shadow-[3px_3px_0px_#09303D]">
                  <TelescopeSvg size={24} />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-[2.5px] border-[#09303D] bg-[#FFE599] text-[#09303D] shadow-[3px_3px_0px_#09303D]">
                  <FoldedMapSvg size={24} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. GRID LEMBAR PETA WILAYAH (6 Pure Neo-Brutalist Map Cards) */}
        <section className="relative z-10 px-4 pt-6 pb-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TILAWATI_LEVELS.map((level, index) => {
              const stepFormatted = String(level.jilid).padStart(2, "0");
              const theme =
                JILID_ATLAS_THEMES[level.jilid] || JILID_ATLAS_THEMES[1];
              const { isUnlocked, earnedStars, progress } =
                getJilidComputedMeta(level);

              const cardBg = isUnlocked ? theme.panel : "#E2E8F0";
              const cardBorder = isUnlocked ? theme.panelLine : "#1E293B";
              const cardShadow = isUnlocked ? theme.panelShadow : "#1E293B";
              const textInk = isUnlocked ? theme.ink : "#1E293B";
              const textMuted = isUnlocked ? theme.muted : "#475569";

              return (
                <motion.div
                  key={level.jilid}
                  initial={{
                    opacity: 0,
                    y: 16,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                      delay: index * 0.04,
                    },
                  }}
                  onClick={() => handleLevelClick(level, isUnlocked)}
                  className={`group relative flex flex-col justify-between rounded-2xl border-[3.5px] overflow-hidden transition-transform duration-150 ${
                    isUnlocked
                      ? "cursor-pointer hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[2px] active:translate-y-[2px]"
                      : "cursor-not-allowed"
                  }`}
                  style={{
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                    boxShadow: `6px 6px 0px ${cardShadow}`,
                  }}
                >
                  {/* A. VIEWPORT PRATINJAU PETA TOPOGRAFI MINI */}
                  <div
                    className="relative h-34 w-full overflow-hidden border-b-[3px]"
                    style={{ borderColor: cardBorder }}
                  >
                    <TopographicSheetPreview
                      jilid={level.jilid}
                      isUnlocked={isUnlocked}
                    />

                    {/* Badge Kiri Atas: Nomor Sektor & Koordinat (100% Solid) */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 rounded-md border-[2px] px-2 py-0.5 font-mono text-[8.5px] font-black uppercase tracking-wider"
                        style={{
                          backgroundColor: isUnlocked ? theme.panel : "#F8FAFC",
                          borderColor: cardBorder,
                          color: textInk,
                          boxShadow: `2px 2px 0px ${cardShadow}`,
                        }}
                      >
                        <span>SEKTOR {stepFormatted}</span>
                        <span>•</span>
                        <span>{level.coords}</span>
                      </span>
                    </div>

                    {/* Badge Kanan Atas: Perolehan Bintang / Status Terkunci */}
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
                      {isBypass && !level.unlocked && (
                        <span
                          className="rounded-md bg-[#FFE599] border-[2px] border-[#09303D] px-1.5 py-0.5 text-[8.5px] font-black uppercase text-[#09303D]"
                          style={{ boxShadow: `2px 2px 0px ${cardShadow}` }}
                        >
                          Ustadz
                        </span>
                      )}
                      {isUnlocked ? (
                        <span
                          className="inline-flex items-center gap-1 rounded-md border-[2px] px-2 py-0.5 text-[10px] font-black"
                          style={{
                            backgroundColor: theme.accentSoft,
                            borderColor: cardBorder,
                            color: theme.isDark ? "#FFF3E6" : textInk,
                            boxShadow: `2px 2px 0px ${cardShadow}`,
                          }}
                        >
                          <StarSvg size={11} fill="#FF9F1C" stroke="#09303D" />
                          <span>
                            {earnedStars}/{level.totalStars}
                          </span>
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 rounded-md bg-[#334155] border-[2px] border-[#0F172A] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white"
                          style={{ boxShadow: "2px 2px 0px #0F172A" }}
                        >
                          <LockSvg size={10} stroke="#FFFFFF" /> Terkunci
                        </span>
                      )}
                    </div>

                    {/* Bar Bawah Pratinjau Peta: Elevasi & Hypsometric Swatch */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2">
                      <span
                        className="rounded-md border-[2px] px-1.5 py-0.5 font-mono text-[8px] font-black"
                        style={{
                          backgroundColor: isUnlocked ? theme.panel : "#F8FAFC",
                          borderColor: cardBorder,
                          color: textInk,
                          boxShadow: `2px 2px 0px ${cardShadow}`,
                        }}
                      >
                        {theme.peakLabel} ({theme.elevationRange})
                      </span>

                      <div
                        className="flex items-center border-[2px]"
                        style={{
                          borderColor: cardBorder,
                          boxShadow: `2px 2px 0px ${cardShadow}`,
                        }}
                      >
                        {theme.hypsometricScale.map((hex, idx) => (
                          <span
                            key={idx}
                            className="h-2.5 w-2.5 border-r last:border-r-0"
                            style={{
                              backgroundColor: isUnlocked ? hex : "#94A3B8",
                              borderColor: cardBorder,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* B. PANEL INFORMASI GEOGRAFIS & KURIKULUM JILID */}
                  <div className="relative flex-1 flex flex-col justify-between p-4">
                    <div>
                      {/* Sub-Header Strip */}
                      <div
                        className="mb-2.5 flex items-center justify-between gap-2 rounded-lg border-[2px] px-2 py-1"
                        style={{
                          backgroundColor: isUnlocked
                            ? theme.panelHeader
                            : "#CBD5E1",
                          borderColor: cardBorder,
                        }}
                      >
                        <span
                          className="text-[8.5px] font-black uppercase tracking-[0.1em]"
                          style={{ color: textInk }}
                        >
                          {theme.regionKicker}
                        </span>
                        <span
                          className="font-mono text-[8.5px] font-black"
                          style={{ color: textInk }}
                        >
                          {theme.mapScale}
                        </span>
                      </div>

                      {/* Ikon Wilayah & Judul */}
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[2.5px] text-xl"
                          style={{
                            backgroundColor: isUnlocked
                              ? theme.accentSoft
                              : "#CBD5E1",
                            borderColor: cardBorder,
                            boxShadow: `3px 3px 0px ${cardShadow}`,
                          }}
                        >
                          <span className={isUnlocked ? "" : "grayscale"}>
                            {theme.symbol}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 text-[10px] font-black uppercase">
                            <MapPinSvg
                              size={11}
                              stroke={isUnlocked ? theme.accent : "#475569"}
                            />
                            <span
                              className="truncate"
                              style={{
                                color: isUnlocked ? theme.accent : "#475569",
                              }}
                            >
                              {level.regionName}
                            </span>
                          </div>
                          <h2
                            className="font-display font-black text-lg uppercase leading-tight tracking-tight mt-0.5"
                            style={{ color: textInk }}
                          >
                            {level.title}
                          </h2>
                        </div>
                      </div>

                      {/* Deskripsi Materi Jilid */}
                      <p
                        className="mt-2.5 text-xs font-bold leading-snug line-clamp-2"
                        style={{ color: textMuted }}
                      >
                        {isUnlocked
                          ? level.desc
                          : `Selesaikan seluruh pos pada Jilid ${level.jilid - 1} untuk membuka akses survei ke sektor ini.`}
                      </p>
                    </div>

                    {/* C. FOOTER KARTU: Neo-Brutalist Progress & Action Button */}
                    <div
                      className="mt-4 pt-3 border-t-[2.5px] flex items-center justify-between gap-3"
                      style={{ borderColor: cardBorder }}
                    >
                      {isUnlocked ? (
                        <>
                          <div className="min-w-0 flex-1">
                            <div
                              className="flex items-center justify-between font-mono text-[9.5px] font-black mb-1"
                              style={{ color: textInk }}
                            >
                              <span>SURVEI RUTE</span>
                              <span>
                                <AnimatedCounter value={progress} />%
                              </span>
                            </div>
                            <div
                              className="h-3 w-full overflow-hidden rounded-md border-[2px]"
                              style={{
                                backgroundColor: theme.isDark
                                  ? "#12090A"
                                  : "#E2E8F0",
                                borderColor: cardBorder,
                              }}
                            >
                              <div
                                className="h-full border-r-[2px] transition-all duration-300"
                                style={{
                                  width: `${Math.max(progress, 10)}%`,
                                  backgroundColor: theme.accent,
                                  borderColor: cardBorder,
                                }}
                              />
                            </div>
                          </div>

                          <div
                            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border-[2.5px] px-3 py-2 text-[10.5px] font-black uppercase tracking-wider text-white transition-transform group-hover:translate-x-0.5"
                            style={{
                              backgroundColor: theme.node,
                              borderColor: theme.nodeLine,
                              boxShadow: `3px 3px 0px ${theme.nodeShadow}`,
                            }}
                          >
                            <span>BUKA PETA</span>
                            <ArrowRightSvg size={12} className="shrink-0" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between gap-2">
                          <span className="font-mono text-[9.5px] font-black text-slate-600">
                            STATUS: TERKUNCI
                          </span>
                          <span
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-300 border-[2px] border-[#1E293B] px-2.5 py-1 text-[9.5px] font-black uppercase tracking-wider text-[#1E293B]"
                            style={{ boxShadow: "2px 2px 0px #1E293B" }}
                          >
                            <LockSvg size={11} stroke="#1E293B" /> Terkunci
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </NgajiCeriaLayout>
  );
}
