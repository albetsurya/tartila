// [WARNING] HAND-CRAFTED SVG COMPONENT
// The animations and paths are intentionally complex.

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  type TargetAndTransition,
} from "framer-motion";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { MascotAura } from "./MascotAura";
import { HairbowSvg } from "./CustomIcons";
import type { MascotSkin } from "@/features/ngaji-ceria/data/shopData";
import {
  resolveMascotGender,
  resolveAccessoryForGender,
  isAccessoryAllowedForGender,
  getDefaultAccessoryForGender,
} from "@/utils/mascotHelper";

export type { MascotSkin };

export type TitoMood =
  | "idle"
  | "happy"
  | "thinking"
  | "sleepy"
  | "excited"
  | "sad"
  // ── Ekspresi / pose sebelumnya ──
  | "laughing" // tertawa terbahak: paruh lebar, mata ^ ^, sayap memegang perut
  | "shocked" // terkejut super: paruh "O", mata membelalak, sayap terangkat
  | "shy" // malu: mata melirik, pipi tebal, sayap menutupi sebagian wajah
  | "greeting" // menyapa: satu sayap melambai, paruh tersenyum
  | "holding" // memegang bintang/bola/hati di depan dada
  | "sleeping" // tidur santai: mata terpejam melengkung + Zzz melayang
  | "love" // jatuh cinta: mata hati, pipi tebal, hati melayang
  | "angry" // marah: alis menukik, urat muncul, badan bergetar
  | "crying" // menangis: alis sedih, air mata mengalir
  | "dizzy" // pusing: mata spiral, bintang berputar di kepala
  | "winking" // kedip sebelah mata + kilau
  // ── 5 Pose Baru ──
  | "praying" // berdoa khusyuk: kedua sayap menengadah di dada + kilau cahaya
  | "reading" // membaca buku/Iqro di depan dada + mata bergerak kanan-kiri
  | "starry" // kagum/terpukau: mata bintang emas besar berkilau
  | "proud" // bangga/keren: kacamata hitam cool + sayap berkacak pinggang
  | "confused"; // bingung: kepala miring + tanda tanya "?" melayang

export type TilaMood = TitoMood;

export type TitoDirection = "front" | "right" | "left" | "back";
export type TilaDirection = TitoDirection;

export type TitoAnimation =
  | "fly"
  | "float"
  | "bounce"
  | "perch"
  | "none"
  | "rolling" // menggelinding dari atas ke bawah seperti roda ke samping
  | "spinning" // bentuk bola berputar cepat seperti gasing (bukan bentuk burung)
  | "peckRight" // mematuk tanah ke kanan
  | "peckLeft" // mematuk tanah ke kiri
  // ── 5 Animasi Baru ──
  | "salute" // hormat "Siap!": sayap kanan di pelipis, badan tegap membusung
  | "cheer" // lompat sorak gembira + hujan konfeti perayaan
  | "singing" // bersenandung/mengaji: goyang ritmis + not irama melayang
  | "peek" // mengintip malu-malu dari bawah ke atas
  | "shiver"; // menggigil/gugup: bergetar cepat + garis getar samping

export type TilaAnimation = TitoAnimation;

export type TitoAccessoryType =
  | "none"
  | "peci"
  | "hairbow"
  | "flowercrown"
  | "glasses"
  | "crown";

export type TilaAccessoryType = TitoAccessoryType;
export type TitoHoldItem = "star" | "ball" | "heart";
export type TilaHoldItem = TitoHoldItem;

// Backward compatibility aliases
export type BibiMood = TitoMood;
export type BibiDirection = TitoDirection;
export type BibiAnimation = TitoAnimation;
export type BibiAccessoryType = TitoAccessoryType | "hijab";

export interface TitoMascotProps {
  size?: number | string;
  mood?: TitoMood;
  direction?: TitoDirection;
  animation?: TitoAnimation;
  talking?: boolean;
  speech?: string;
  followCursor?: boolean;
  autoDirection?: boolean;
  className?: string;
  onTap?: () => void;
  rotation?: number;
  autoRotate?: boolean;
  accessory?: TitoAccessoryType;
  gender?: "boy" | "girl";
  /** Objek yang dipegang saat mood="holding" (default: "star") */
  holdItem?: TitoHoldItem;
  skin?: MascotSkin;
}

export type TilaMascotProps = TitoMascotProps;
export type BibiMascotProps = TitoMascotProps;

export function TitoMascot({
  size = 240,
  mood = "idle",
  direction = "right",
  animation = "fly",
  talking = false,
  speech,
  followCursor = false,
  autoDirection = false,
  className = "",
  onTap,
  rotation,
  autoRotate = false,
  accessory,
  gender,
  holdItem = "star",
  skin,
}: TitoMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lookOffset, setLookOffset] = useState({ x: 0, y: 0 });
  const [dynamicDir, setDynamicDir] = useState<TilaDirection | null>(null);
  const rotationValue = useMotionValue(rotation || 0);

  // Orbit bintang untuk mood "dizzy"
  const orbitX = [60, 30, -30, -60, -30, 30];
  const orbitY = [0, 10, 10, 0, -10, -10];

  const storeGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const storeAccessory = useEconomyStore((s) => s.equippedAccessory);

  // === LOGIKA GENDER & AKSESORIS KETAT DINAMIS ===
  // Mengambil gender dari props eksplisit jika ada, atau fallback dinamis ke state store
  const effectiveGender: "boy" | "girl" =
    gender !== undefined
      ? resolveMascotGender(gender)
      : resolveMascotGender(storeGender);
  const isGirl = effectiveGender === "girl";

  let rawAccessory: TilaAccessoryType;
  if (accessory !== undefined) {
    rawAccessory = accessory;
  } else if (
    storeAccessory &&
    storeAccessory !== "none" &&
    isAccessoryAllowedForGender(storeAccessory, effectiveGender)
  ) {
    rawAccessory = storeAccessory as TilaAccessoryType;
  } else {
    rawAccessory = getDefaultAccessoryForGender(
      effectiveGender,
    ) as TilaAccessoryType;
  }

  const resolvedAccessory: TilaAccessoryType = resolveAccessoryForGender(
    rawAccessory,
    effectiveGender,
  ) as TilaAccessoryType;

  // ── PALETTE SWAP & SKIN DINAMIS (NAGA & ROBOT) ──
  const storeSkin = useEconomyStore((s) => s.equippedSkin);
  const effectiveSkin: MascotSkin = (skin !== undefined ? skin : storeSkin || "default") as MascotSkin;

  const skinPalette = {
    default: {
      body: "#FBBF24",
      belly: "#EAA012",
      accent1: "#00B894",
      accent2: "#00937D",
      tailTip: "#FF6B6B",
      wingsBase: "#FFFFFF",
      stroke: "#07473C",
      shadow: "#CFD8B6",
      leg: "#FF5E6C",
      cheek: "#FF5E6C",
    },
    naga: {
      body: "#059669",
      belly: "#FDE68A",
      accent1: "#FBBF24",
      accent2: "#D97706",
      tailTip: "#F59E0B",
      wingsBase: "#D1FAE5",
      stroke: "#064E3B",
      shadow: "#064E3B",
      leg: "#D97706",
      cheek: "#10B981",
    },
    robot: {
      body: "#94A3B8",
      belly: "#CBD5E1",
      accent1: "#06B6D4",
      accent2: "#0284C7",
      tailTip: "#22D3EE",
      wingsBase: "#E2E8F0",
      stroke: "#1E293B",
      shadow: "#64748B",
      leg: "#475569",
      cheek: "#38BDF8",
    },
    phoenix_ice: {
      body: "#38BDF8",
      belly: "#BAE6FD",
      accent1: "#F8FAFC",
      accent2: "#0284C7",
      tailTip: "#E0F2FE",
      wingsBase: "#F0F9FF",
      stroke: "#0C4A6E",
      shadow: "#7DD3FC",
      leg: "#0284C7",
      cheek: "#7DD3FC",
    },
    phoenix_gold: {
      body: "#FBBF24",
      belly: "#FEF08A",
      accent1: "#D97706",
      accent2: "#B45309",
      tailTip: "#F59E0B",
      wingsBase: "#FEF3C7",
      stroke: "#78350F",
      shadow: "#F59E0B",
      leg: "#B45309",
      cheek: "#F59E0B",
    },
    phoenix_dark: {
      body: "#4C1D95",
      belly: "#2E1065",
      accent1: "#111827",
      accent2: "#581C87",
      tailTip: "#A855F7",
      wingsBase: "#1F2937",
      stroke: "#0F172A",
      shadow: "#1E1B4B",
      leg: "#3B0764",
      cheek: "#7C3AED",
    },
  }[effectiveSkin] || {
    body: "#FBBF24",
    belly: "#EAA012",
    accent1: "#00B894",
    accent2: "#00937D",
    tailTip: "#FF6B6B",
    wingsBase: "#FFFFFF",
    stroke: "#07473C",
    shadow: "#CFD8B6",
    leg: "#FF5E6C",
    cheek: "#FF5E6C",
  };

  const isPhoenix =
    effectiveSkin === "phoenix_ice" ||
    effectiveSkin === "phoenix_gold" ||
    effectiveSkin === "phoenix_dark";
  const showPlumes = isGirl || isPhoenix;

  const renderNagaHorns = (view: "front" | "side" | "back") => {
    if (effectiveSkin !== "naga") return null;
    if (view === "front") {
      return (
        <g id="naga-horns">
          {/* Tanduk Kiri */}
          <path
            d="M 218 142 C 192 118, 172 92, 178 62 C 188 82, 208 112, 228 132 Z"
            fill="#FBBF24"
            stroke="#064E3B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M 178 62 Q 184 82 204 108"
            stroke="#F59E0B"
            strokeWidth="2"
            fill="none"
          />
          {/* Tanduk Kanan */}
          <path
            d="M 282 142 C 308 118, 328 92, 322 62 C 312 82, 292 112, 272 132 Z"
            fill="#FBBF24"
            stroke="#064E3B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M 322 62 Q 316 82 296 108"
            stroke="#F59E0B"
            strokeWidth="2"
            fill="none"
          />
        </g>
      );
    }
    if (view === "side") {
      return (
        <g id="naga-horns-side">
          <path
            d="M 245 138 C 220 108, 195 82, 185 58 C 205 82, 235 112, 255 132 Z"
            fill="#FBBF24"
            stroke="#064E3B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M 185 58 Q 195 82 225 108"
            stroke="#F59E0B"
            strokeWidth="2"
            fill="none"
          />
        </g>
      );
    }
    return (
      <g id="naga-horns-back">
        <path
          d="M 218 142 C 192 118, 172 92, 178 62 C 188 82, 208 112, 228 132 Z"
          fill="#FBBF24"
          stroke="#064E3B"
          strokeWidth="3.5"
        />
        <path
          d="M 282 142 C 308 118, 328 92, 322 62 C 312 82, 292 112, 272 132 Z"
          fill="#FBBF24"
          stroke="#064E3B"
          strokeWidth="3.5"
        />
      </g>
    );
  };

  const renderNagaScales = (view: "front" | "side") => {
    if (effectiveSkin !== "naga") return null;
    if (view === "front") {
      return (
        <g id="naga-scales" opacity="0.85">
          <path
            d="M 235 262 Q 250 272 265 262"
            fill="none"
            stroke="#D97706"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 222 282 Q 237 292 252 282 Q 267 292 282 282"
            fill="none"
            stroke="#D97706"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 235 302 Q 250 312 265 302"
            fill="none"
            stroke="#D97706"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      );
    }
    return (
      <g id="naga-scales-side" opacity="0.85">
        <path
          d="M 245 262 Q 260 272 275 262"
          fill="none"
          stroke="#D97706"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 235 282 Q 250 292 265 282"
          fill="none"
          stroke="#D97706"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    );
  };

  const renderRobotAntenna = (view: "front" | "side" | "back") => {
    if (effectiveSkin !== "robot") return null;
    const x = view === "side" ? 255 : 250;
    return (
      <g id={`robot-antenna-${view}`}>
        <line
          x1={x}
          y1="135"
          x2={x}
          y2="76"
          stroke="#475569"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1={x - 4}
          y1="128"
          x2={x + 4}
          y2="128"
          stroke="#06B6D4"
          strokeWidth="3"
        />
        <circle
          cx={x}
          cy="70"
          r="11"
          fill="#0891B2"
          stroke="#1E293B"
          strokeWidth="3"
        />
        <circle
          cx={x}
          cy="70"
          r="6"
          fill="#22D3EE"
          className="animate-pulse"
        />
        <circle
          cx={x - 2}
          cy="68"
          r="2"
          fill="#FFFFFF"
          opacity="0.9"
        />
      </g>
    );
  };

  const renderRobotPanels = (view: "front" | "side") => {
    if (effectiveSkin !== "robot") return null;
    if (view === "front") {
      return (
        <g id="robot-panels" opacity="0.9">
          <line
            x1="230"
            y1="256"
            x2="270"
            y2="256"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <circle
            cx="250"
            cy="276"
            r="8"
            fill="#0891B2"
            stroke="#06B6D4"
            strokeWidth="2"
          />
          <circle
            cx="250"
            cy="276"
            r="4"
            fill="#22D3EE"
          />
          <line
            x1="120"
            y1="202"
            x2="155"
            y2="242"
            stroke="#06B6D4"
            strokeWidth="2"
          />
          <line
            x1="380"
            y1="202"
            x2="345"
            y2="242"
            stroke="#06B6D4"
            strokeWidth="2"
          />
        </g>
      );
    }
    return (
      <g id="robot-panels-side" opacity="0.9">
        <line
          x1="238"
          y1="256"
          x2="278"
          y2="256"
          stroke="#06B6D4"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
        <circle
          cx="258"
          cy="276"
          r="7"
          fill="#0891B2"
          stroke="#06B6D4"
          strokeWidth="2"
        />
        <circle
          cx="258"
          cy="276"
          r="3.5"
          fill="#22D3EE"
        />
        <line
          x1="130"
          y1="195"
          x2="165"
          y2="235"
          stroke="#06B6D4"
          strokeWidth="2"
        />
      </g>
    );
  };

  const renderRobotEye = () => (
    <g id="robot-led-eye">
      <rect
        x="-22"
        y="-18"
        width="44"
        height="36"
        rx="6"
        fill="#0F172A"
        stroke="#06B6D4"
        strokeWidth="3.5"
      />
      <rect
        x="-17"
        y="-13"
        width="34"
        height="26"
        rx="4"
        fill="#22D3EE"
      />
      <rect
        x="-8"
        y="-8"
        width="16"
        height="16"
        rx="2"
        fill="#0891B2"
      />
      <rect
        x="-4"
        y="-4"
        width="4"
        height="4"
        fill="#FFFFFF"
        opacity="0.9"
      />
    </g>
  );

  const renderAccessory = (view: "front" | "side" | "back") => {
    if (resolvedAccessory === "none") return null;

    if (resolvedAccessory === "peci") {
      if (view === "front") {
        return (
          <g id="accessory-peci-front">
            <path
              d="M 198 142 L 204 96 Q 250 90 296 96 L 302 142 Q 250 148 198 142 Z"
              fill="#134E4A"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M 199 137 Q 250 143 301 137"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 218 100 L 214 136 M 282 100 L 286 136"
              stroke="#FFFFFF"
              strokeOpacity="0.18"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <polygon
              points="250,107 253,114 260,114 255,118 257,125 250,121 243,125 245,118 240,114 247,114"
              fill="#FBBF24"
              stroke="#07473C"
              strokeWidth="1.5"
            />
          </g>
        );
      }
      if (view === "side") {
        return (
          <g id="accessory-peci-side">
            <path
              d="M 210 142 L 216 96 Q 262 90 306 96 L 312 142 Q 262 148 210 142 Z"
              fill="#134E4A"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M 211 137 Q 262 143 311 137"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle
              cx="264"
              cy="116"
              r="4.5"
              fill="#FBBF24"
              stroke="#07473C"
              strokeWidth="1.5"
            />
          </g>
        );
      }
      return (
        <g id="accessory-peci-back">
          <path
            d="M 198 142 L 204 96 Q 250 90 296 96 L 302 142 Q 250 148 198 142 Z"
            fill="#134E4A"
            stroke="#07473C"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path
            d="M 199 137 Q 250 143 301 137"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      );
    }

    if (resolvedAccessory === "hairbow") {
      if (view === "front") {
        return (
          <g id="accessory-hairbow-front">
            <HairbowSvg x={251} y={103} size={70} />
          </g>
        );
      }
      if (view === "side") {
        return (
          <g id="accessory-hairbow-side">
            <HairbowSvg x={233} y={101} size={70} />
          </g>
        );
      }
      return (
        <g id="accessory-hairbow-back">
          <HairbowSvg x={251} y={103} size={70} />
        </g>
      );
    }

    if (resolvedAccessory === "flowercrown") {
      if (view === "front") {
        return (
          <g id="accessory-flowercrown-front">
            <path
              d="M 198 152 Q 250 162 302 152"
              fill="none"
              stroke="#059669"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <ellipse
              cx="210"
              cy="154"
              rx="7"
              ry="3.5"
              fill="#10B981"
              stroke="#07473C"
              strokeWidth="2.5"
              transform="rotate(-20 210 154)"
            />
            <ellipse
              cx="290"
              cy="154"
              rx="7"
              ry="3.5"
              fill="#10B981"
              stroke="#07473C"
              strokeWidth="2.5"
              transform="rotate(20 290 154)"
            />
            <g transform="translate(212, 148)">
              <circle
                cx="0"
                cy="0"
                r="9.5"
                fill="#FF6B6B"
                stroke="#07473C"
                strokeWidth="3.5"
              />
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#FDE047"
                stroke="#07473C"
                strokeWidth="1.5"
              />
            </g>
            <g transform="translate(236, 153)">
              <circle
                cx="0"
                cy="0"
                r="10.5"
                fill="#FFFFFF"
                stroke="#07473C"
                strokeWidth="3.5"
              />
              <circle
                cx="0"
                cy="0"
                r="4.5"
                fill="#F59E0B"
                stroke="#07473C"
                strokeWidth="1.5"
              />
            </g>
            <g transform="translate(264, 153)">
              <circle
                cx="0"
                cy="0"
                r="10.5"
                fill="#FBBF24"
                stroke="#07473C"
                strokeWidth="3.5"
              />
              <circle
                cx="0"
                cy="0"
                r="4.5"
                fill="#EF4444"
                stroke="#07473C"
                strokeWidth="1.5"
              />
            </g>
            <g transform="translate(288, 148)">
              <circle
                cx="0"
                cy="0"
                r="9.5"
                fill="#FF6B6B"
                stroke="#07473C"
                strokeWidth="3.5"
              />
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#FFFFFF"
                stroke="#07473C"
                strokeWidth="1.5"
              />
            </g>
          </g>
        );
      }
      if (view === "side") {
        return (
          <g id="accessory-flowercrown-side">
            <path
              d="M 215 146 Q 262 155 310 146"
              fill="none"
              stroke="#059669"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <ellipse
              cx="224"
              cy="148"
              rx="7"
              ry="3.5"
              fill="#10B981"
              stroke="#07473C"
              strokeWidth="2.5"
            />
            <ellipse
              cx="300"
              cy="148"
              rx="7"
              ry="3.5"
              fill="#10B981"
              stroke="#07473C"
              strokeWidth="2.5"
            />
            <g transform="translate(234, 147)">
              <circle
                cx="0"
                cy="0"
                r="9.5"
                fill="#FF6B6B"
                stroke="#07473C"
                strokeWidth="3.5"
              />
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#FDE047"
                stroke="#07473C"
                strokeWidth="1.5"
              />
            </g>
            <g transform="translate(264, 152)">
              <circle
                cx="0"
                cy="0"
                r="11"
                fill="#FFFFFF"
                stroke="#07473C"
                strokeWidth="3.5"
              />
              <circle
                cx="0"
                cy="0"
                r="4.5"
                fill="#F59E0B"
                stroke="#07473C"
                strokeWidth="1.5"
              />
            </g>
            <g transform="translate(294, 148)">
              <circle
                cx="0"
                cy="0"
                r="10"
                fill="#FBBF24"
                stroke="#07473C"
                strokeWidth="3.5"
              />
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#EF4444"
                stroke="#07473C"
                strokeWidth="1.5"
              />
            </g>
          </g>
        );
      }
      return (
        <g id="accessory-flowercrown-back">
          <path
            d="M 198 152 Q 250 162 302 152"
            fill="none"
            stroke="#059669"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <g transform="translate(216, 150)">
            <circle
              cx="0"
              cy="0"
              r="9"
              fill="#FF6B6B"
              stroke="#07473C"
              strokeWidth="3.5"
            />
            <circle cx="0" cy="0" r="4" fill="#FDE047" />
          </g>
          <g transform="translate(250, 154)">
            <circle
              cx="0"
              cy="0"
              r="10"
              fill="#FFFFFF"
              stroke="#07473C"
              strokeWidth="3.5"
            />
            <circle cx="0" cy="0" r="4" fill="#F59E0B" />
          </g>
          <g transform="translate(284, 150)">
            <circle
              cx="0"
              cy="0"
              r="9"
              fill="#FBBF24"
              stroke="#07473C"
              strokeWidth="3.5"
            />
            <circle cx="0" cy="0" r="4" fill="#EF4444" />
          </g>
        </g>
      );
    }

    if (resolvedAccessory === "glasses") {
      if (view === "front") {
        return (
          <g id="accessory-glasses-front">
            <circle
              cx="206"
              cy="192"
              r="30"
              fill="#BAE6FD"
              fillOpacity="0.25"
              stroke="#07473C"
              strokeWidth="5"
            />
            <circle
              cx="294"
              cy="192"
              r="30"
              fill="#BAE6FD"
              fillOpacity="0.25"
              stroke="#07473C"
              strokeWidth="5"
            />
            <path
              d="M 236 190 Q 250 183 264 190"
              fill="none"
              stroke="#07473C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 176 192 L 155 186"
              fill="none"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M 324 192 L 345 186"
              fill="none"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M 196 177 L 216 177"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 284 177 L 304 177"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        );
      }
      if (view === "side") {
        return (
          <g id="accessory-glasses-side">
            <ellipse
              cx="255"
              cy="190"
              rx="28"
              ry="29"
              fill="#BAE6FD"
              fillOpacity="0.25"
              stroke="#07473C"
              strokeWidth="5"
            />
            <ellipse
              cx="326"
              cy="184"
              rx="26"
              ry="27"
              fill="#BAE6FD"
              fillOpacity="0.25"
              stroke="#07473C"
              strokeWidth="5"
            />
            <path
              d="M 283 188 Q 295 183 302 185"
              fill="none"
              stroke="#07473C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 227 192 L 208 188"
              fill="none"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M 245 177 L 265 177"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        );
      }
      return null;
    }

    if (resolvedAccessory === "crown") {
      if (view === "front") {
        return (
          <g id="accessory-crown-front">
            <path
              d="M 205 135 L 200 85 L 225 108 L 250 75 L 275 108 L 300 85 L 295 135 Z"
              fill="#FBBF24"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M 204 125 C 230 133, 270 133, 296 125"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4"
            />
            <circle
              cx="200"
              cy="85"
              r="5"
              fill="#EF4444"
              stroke="#07473C"
              strokeWidth="2.5"
            />
            <circle
              cx="250"
              cy="75"
              r="6"
              fill="#3B82F6"
              stroke="#07473C"
              strokeWidth="2.5"
            />
            <circle
              cx="300"
              cy="85"
              r="5"
              fill="#EF4444"
              stroke="#07473C"
              strokeWidth="2.5"
            />
            <polygon
              points="250,118 255,124 250,130 245,124"
              fill="#10B981"
              stroke="#07473C"
              strokeWidth="2"
            />
          </g>
        );
      }
      if (view === "side") {
        return (
          <g id="accessory-crown-side">
            <path
              d="M 220 135 L 215 88 L 240 110 L 265 78 L 290 110 L 315 88 L 310 135 Z"
              fill="#FBBF24"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M 219 125 C 245 133, 285 133, 311 125"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4"
            />
            <circle
              cx="215"
              cy="88"
              r="5"
              fill="#EF4444"
              stroke="#07473C"
              strokeWidth="2.5"
            />
            <circle
              cx="265"
              cy="78"
              r="6"
              fill="#3B82F6"
              stroke="#07473C"
              strokeWidth="2.5"
            />
            <circle
              cx="315"
              cy="88"
              r="5"
              fill="#EF4444"
              stroke="#07473C"
              strokeWidth="2.5"
            />
            <polygon
              points="265,118 270,124 265,130 260,124"
              fill="#10B981"
              stroke="#07473C"
              strokeWidth="2"
            />
          </g>
        );
      }
      return (
        <g id="accessory-crown-back">
          <path
            d="M 205 135 L 200 85 L 225 108 L 250 75 L 275 108 L 300 85 L 295 135 Z"
            fill="#FBBF24"
            stroke="#07473C"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
        </g>
      );
    }

    return null;
  };

  const [activeView, setActiveView] = useState<TilaDirection>(direction);

  useEffect(() => {
    if (rotation !== undefined) {
      animate(rotationValue, rotation, {
        type: "spring",
        stiffness: 100,
        damping: 20,
      });
    }
  }, [rotation, rotationValue]);

  useEffect(() => {
    if (!autoRotate) return;
    const controls = animate(rotationValue, 360, {
      duration: 6,
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [autoRotate, rotationValue]);

  useEffect(() => {
    const unsubscribe = rotationValue.on("change", (latest) => {
      let normalized = latest % 360;
      if (normalized < 0) normalized += 360;

      if (normalized >= 315 || normalized < 45) {
        setActiveView("front");
      } else if (normalized >= 45 && normalized < 135) {
        setActiveView("right");
      } else if (normalized >= 135 && normalized < 225) {
        setActiveView("back");
      } else if (normalized >= 225 && normalized < 315) {
        setActiveView("left");
      }
    });
    return () => unsubscribe();
  }, [rotationValue]);

  const { scaleX, rotateY, opacity } = useTransform(rotationValue, (latest) => {
    let normalized = latest % 360;
    if (normalized < 0) normalized += 360;
    const rad = (normalized * Math.PI) / 180;
    return {
      scaleX: Math.max(Math.abs(Math.cos(rad)), 0.15),
      rotateY: Math.sin(rad) * 25,
      opacity: 0.15 + 0.85 * Math.abs(Math.cos(2 * rad)),
    };
  }) as any;

  const manualDirection = autoDirection && dynamicDir ? dynamicDir : direction;
  const isRotationActive = rotation !== undefined || autoRotate;

  // Mematuk: arah dipaksa ke tampak samping (kanan / kiri)
  const isPecking = animation === "peckRight" || animation === "peckLeft";
  const peckSign = animation === "peckLeft" ? -1 : 1;
  const finalDirection: TilaDirection = isPecking
    ? peckSign === -1
      ? "left"
      : "right"
    : isRotationActive
      ? activeView
      : manualDirection;

  const dimension = typeof size === "number" ? `${size}px` : size;

  // ── Flag mood & animasi lama ──
  const isThinking = mood === "thinking";
  const isSleepy = mood === "sleepy";
  const isSad = mood === "sad";
  const isExcited = mood === "excited" || mood === "happy";
  const isStatic = animation === "none";
  const isPerching = animation === "perch";

  // ── Flag pose & ekspresi sebelumnya ──
  const isLaughing = mood === "laughing";
  const isShocked = mood === "shocked";
  const isShy = mood === "shy";
  const isGreeting = mood === "greeting";
  const isHolding = mood === "holding";
  const isSleeping = mood === "sleeping";
  const isRolling = animation === "rolling";
  const isSpinning = animation === "spinning";
  const isLove = mood === "love";
  const isAngry = mood === "angry";
  const isCrying = mood === "crying";
  const isDizzy = mood === "dizzy";
  const isWinking = mood === "winking";

  // ── Flag 10 Pose & Animasi Baru ──
  const isPraying = mood === "praying";
  const isReading = mood === "reading";
  const isStarry = mood === "starry";
  const isProud = mood === "proud";
  const isConfused = mood === "confused";

  const isSalute = animation === "salute";
  const isCheering = animation === "cheer";
  const isSinging = animation === "singing";
  const isPeeking = animation === "peek";
  const isShivering = animation === "shiver";

  const hasEyeFx =
    isLove ||
    isAngry ||
    isCrying ||
    isDizzy ||
    isWinking ||
    isStarry ||
    isProud ||
    isConfused;

  // Pose yang memakai sayap "overlay" di depan badan
  const hasWingOverlay =
    isLaughing ||
    isShy ||
    isHolding ||
    isPraying ||
    isReading ||
    isProud ||
    isSalute;

  // Sayap asli dilipat saat pose overlay / tidur / bertengger / mematuk / menggelinding / mengintip
  const wingsFolded =
    isPerching ||
    isSleeping ||
    hasWingOverlay ||
    isPecking ||
    isRolling ||
    isPeeking;

  // Mata: "^ ^" saat tertawa / sorak, garis melengkung saat tidur / berdoa
  const eyeShape: "open" | "laugh" | "sleep" =
    isLaughing || isCheering
      ? "laugh"
      : isSleepy || isSleeping || isPraying
        ? "sleep"
        : "open";
  const eyeHidden = isLaughing || isSleeping || isPraying || isCheering;
  const eyeScale = isShocked || isStarry ? 1.18 : 1;
  const pupilScale = isShocked ? 0.6 : 1;
  const cheekExtra = isShy || isLove || isStarry || isPraying ? 4.5 : 0;

  // Ujung paruh bawah pada tampak samping (disesuaikan per ekspresi)
  const sideBeakTip =
    isLaughing || isCheering || isSinging
      ? { x: 323, y: 258 }
      : isGreeting || isPraying || isProud || isStarry
        ? { x: 311, y: 232 }
        : isSleeping
          ? { x: 304, y: 228 }
          : { x: 317, y: 244 };

  const isSideView = finalDirection === "right" || finalDirection === "left";
  const isFlippedLeft = finalDirection === "left";
  const rollSign = isFlippedLeft ? -1 : 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!followCursor || !containerRef.current || isRotationActive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const maxOffset = 6;
    const dist = Math.hypot(dx, dy) || 1;
    const factor = Math.min(dist / 60, 1);

    setLookOffset({
      x: (dx / dist) * maxOffset * factor,
      y: (dy / dist) * maxOffset * factor,
    });

    if (autoDirection) {
      if (dy < -rect.height * 0.35) {
        setDynamicDir("back");
      } else if (dx < -rect.width * 0.2) {
        setDynamicDir("left");
      } else if (dx > rect.width * 0.2) {
        setDynamicDir("right");
      } else {
        setDynamicDir("front");
      }
    }
  };

  const handleMouseLeave = () => {
    if (!followCursor) return;
    setLookOffset({ x: 0, y: 0 });
    setDynamicDir(null);
  };

  const flapDuration =
    isExcited || isCheering
      ? 0.16
      : isThinking || isSleepy || isSleeping || isSad || isPraying
        ? 0.65
        : 0.28;
  const floatDuration = isExcited ? 1.1 : isThinking || isSleepy ? 2.6 : 1.6;

  const bodyAnimate = isStatic
    ? { y: 0, rotate: 0 }
    : isSpinning
      ? {
          y: [0, -14, 0],
          rotate: 0,
          transition: {
            y: {
              repeat: Infinity,
              duration: 0.55,
              ease: "easeInOut",
            },
          } as const,
        }
      : isRolling
        ? {
            y: [0, -18, 0],
            rotate: [0, 360 * rollSign],
            transition: {
              y: {
                repeat: Infinity,
                duration: 0.42,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Infinity,
                duration: 0.84,
                ease: "linear",
              },
            } as const,
          }
        : isCheering
          ? {
              // Melompat tinggi kegirangan
              y: [0, -34, 0, -20, 0],
              scaleY: [1, 1.07, 0.92, 1.04, 1],
              scaleX: [1, 0.95, 1.06, 0.97, 1],
              transition: {
                repeat: Infinity,
                duration: 0.9,
                ease: "easeInOut",
              } as const,
            }
          : isSalute
            ? {
                // Tegap membusung
                y: [0, -3, 0],
                scaleY: [1, 1.03, 1],
                transition: {
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeInOut",
                } as const,
              }
            : isSinging
              ? {
                  // Bergoyang ritmis ke kiri dan kanan sambil bernyanyi/mengaji
                  y: [0, -8, 0, -8, 0],
                  rotate: [-6, 0, 6, 0, -6],
                  transition: {
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                  } as const,
                }
              : isPeeking
                ? {
                    // Mengintip perlahan dari bawah lalu turun kembali
                    y: [78, 78, 8, 8, 78],
                    rotate: [0, 0, -4, 4, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 3.4,
                      times: [0, 0.18, 0.42, 0.78, 1],
                      ease: "easeInOut",
                    } as const,
                  }
                : isShivering
                  ? {
                      // Menggigil cepat
                      x: [-3.5, 3.5, -3.5, 3.5, 0],
                      y: [0, 1.5, 0],
                      transition: {
                        repeat: Infinity,
                        duration: 0.14,
                        ease: "linear",
                      } as const,
                    }
                  : isLaughing
                    ? {
                        y: [0, -10, 0],
                        rotate: [-5, 5, -5],
                        transition: {
                          repeat: Infinity,
                          duration: 0.3,
                          ease: "easeInOut",
                        } as const,
                      }
                    : isShocked
                      ? {
                          x: [-3, 3, -3],
                          y: [0, -8, 0],
                          transition: {
                            repeat: Infinity,
                            duration: 0.16,
                            ease: "easeInOut",
                          } as const,
                        }
                      : isSleeping
                        ? {
                            y: [0, -3, 0],
                            rotate: [3, 6, 3],
                            transition: {
                              repeat: Infinity,
                              duration: 3.2,
                              ease: "easeInOut",
                            } as const,
                          }
                        : isPraying
                          ? {
                              y: [0, -4, 0],
                              transition: {
                                repeat: Infinity,
                                duration: 2.4,
                                ease: "easeInOut",
                              } as const,
                            }
                          : isReading
                            ? {
                                y: [0, -4, 0],
                                rotate: [-1, 1, -1],
                                transition: {
                                  repeat: Infinity,
                                  duration: 2.2,
                                  ease: "easeInOut",
                                } as const,
                              }
                            : isStarry
                              ? {
                                  y: [0, -10, 0],
                                  scale: [1, 1.04, 1],
                                  transition: {
                                    repeat: Infinity,
                                    duration: 0.85,
                                    ease: "easeInOut",
                                  } as const,
                                }
                              : isProud
                                ? {
                                    y: [0, -5, 0],
                                    rotate: [-2, 1, -2],
                                    transition: {
                                      repeat: Infinity,
                                      duration: 2,
                                      ease: "easeInOut",
                                    } as const,
                                  }
                                : isConfused
                                  ? {
                                      rotate: [-8, -12, -8],
                                      y: [0, -4, 0],
                                      transition: {
                                        repeat: Infinity,
                                        duration: 1.8,
                                        ease: "easeInOut",
                                      } as const,
                                    }
                                  : isShy
                                    ? {
                                        y: [0, -4, 0],
                                        rotate: [-3, 3, -3],
                                        transition: {
                                          repeat: Infinity,
                                          duration: 2.4,
                                          ease: "easeInOut",
                                        } as const,
                                      }
                                    : isGreeting
                                      ? {
                                          y: [0, -8, 0],
                                          rotate: [-1, 2, -1],
                                          transition: {
                                            repeat: Infinity,
                                            duration: 1.3,
                                            ease: "easeInOut",
                                          } as const,
                                        }
                                      : isHolding
                                        ? {
                                            y: [0, -6, 0],
                                            rotate: [-1, 1, -1],
                                            transition: {
                                              repeat: Infinity,
                                              duration: 1.8,
                                              ease: "easeInOut",
                                            } as const,
                                          }
                                        : isPerching
                                          ? {
                                              y: [0, -4, 0],
                                              transition: {
                                                repeat: Infinity,
                                                duration: 2,
                                                ease: "easeInOut",
                                              } as const,
                                            }
                                          : {
                                              y: isThinking
                                                ? [0, -6, 0]
                                                : [0, -14, 0],
                                              rotate: isExcited
                                                ? [-2, 3, -2]
                                                : [-1, 1.5, -1],
                                              transition: {
                                                repeat: Infinity,
                                                duration: floatDuration,
                                                ease: "easeInOut",
                                              } as const,
                                            };

  // Sudut & jarak mematuk. Pivot rotasi ada di kaki (lihat style pada motion.svg).
  const peckAngle = 52 * peckSign;
  const poseBodyAnimate: TargetAndTransition | null =
    isRolling ||
    isSpinning ||
    isCheering ||
    isSalute ||
    isSinging ||
    isPeeking ||
    isShivering
      ? null
      : isPecking
        ? {
            y: ["0%", "0%", "9%", "1%", "9%", "1%", "0%"],
            rotate: [
              0,
              0,
              peckAngle,
              peckAngle * 0.15,
              peckAngle,
              peckAngle * 0.15,
              0,
            ],
            transition: {
              repeat: Infinity,
              duration: 1.9,
              ease: "easeInOut",
              times: [0, 0.2, 0.36, 0.46, 0.6, 0.7, 1],
            },
          }
        : isLove
          ? {
              y: [0, -12, 0],
              rotate: [-4, 4, -4],
              transition: {
                repeat: Infinity,
                duration: 0.9,
                ease: "easeInOut",
              },
            }
          : isAngry
            ? {
                x: [-3, 3, -3],
                rotate: [-2, 2, -2],
                transition: {
                  repeat: Infinity,
                  duration: 0.14,
                  ease: "easeInOut",
                },
              }
            : isCrying
              ? {
                  y: [0, 4, 0],
                  x: [-1.5, 1.5, -1.5],
                  transition: {
                    repeat: Infinity,
                    duration: 0.45,
                    ease: "easeInOut",
                  },
                }
              : isDizzy
                ? {
                    rotate: [-10, 10, -10],
                    x: [-6, 6, -6],
                    transition: {
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut",
                    },
                  }
                : isWinking
                  ? {
                      y: [0, -6, 0],
                      rotate: [-3, 3, -3],
                      transition: {
                        repeat: Infinity,
                        duration: 1.6,
                        ease: "easeInOut",
                      },
                    }
                  : null;

  const foldDuration = isLaughing ? 0.3 : 2;

  // Sayap kiri (di tampak depan: sisi kiri layar)
  const leftWingAnimate = isStatic
    ? { rotate: 0 }
    : isCheering
      ? {
          // Terangkat tinggi bersorak
          rotate: [35, 60, 35],
          transition: {
            repeat: Infinity,
            duration: 0.28,
            ease: "easeInOut",
          } as const,
        }
      : isShocked
        ? {
            rotate: [30, 40, 30],
            transition: {
              repeat: Infinity,
              duration: 0.16,
              ease: "easeInOut",
            } as const,
          }
        : isGreeting
          ? {
              rotate: [6, 10, 6],
              transition: {
                repeat: Infinity,
                duration: 1.4,
                ease: "easeInOut",
              } as const,
            }
          : wingsFolded
            ? {
                rotate: [-25, -20, -25],
                transition: {
                  repeat: Infinity,
                  duration: foldDuration,
                  ease: "easeInOut",
                } as const,
              }
            : {
                rotate: isThinking ? [-5, 8, -5] : [-14, 22, -14],
                transition: {
                  repeat: Infinity,
                  duration: flapDuration,
                  ease: "easeInOut",
                } as const,
              };

  // Sayap kanan (di tampak depan: sisi kanan layar)
  const rightWingAnimate = isStatic
    ? { rotate: 0 }
    : isCheering
      ? {
          rotate: [-35, -60, -35],
          transition: {
            repeat: Infinity,
            duration: 0.28,
            ease: "easeInOut",
          } as const,
        }
      : isShocked
        ? {
            rotate: [-30, -40, -30],
            transition: {
              repeat: Infinity,
              duration: 0.16,
              ease: "easeInOut",
            } as const,
          }
        : isGreeting
          ? {
              rotate: [-35, -62, -35],
              transition: {
                repeat: Infinity,
                duration: 0.5,
                ease: "easeInOut",
              } as const,
            }
          : wingsFolded
            ? {
                rotate: [25, 20, 25],
                transition: {
                  repeat: Infinity,
                  duration: foldDuration,
                  ease: "easeInOut",
                } as const,
              }
            : {
                rotate: isThinking ? [5, -8, 5] : [14, -22, 14],
                transition: {
                  repeat: Infinity,
                  duration: flapDuration,
                  ease: "easeInOut",
                } as const,
              };

  const tailAnimate =
    isStatic || isRolling
      ? { rotate: 0 }
      : {
          rotate: [-5, 5, -5],
          transition: {
            repeat: Infinity,
            duration: flapDuration * 2,
            ease: "easeInOut",
          } as const,
        };

  const legAnimate =
    isStatic || isRolling
      ? { rotate: 0 }
      : {
          rotate: isThinking ? [-2, 2, -2] : [-5, 7, -5],
          transition: {
            repeat: Infinity,
            duration: floatDuration,
            ease: "easeInOut",
          } as const,
        };

  const crestAnimate =
    isStatic || isRolling
      ? { rotate: 0 }
      : {
          rotate: [-4, 5, -4],
          transition: {
            repeat: Infinity,
            duration: floatDuration * 0.8,
            ease: "easeInOut",
          } as const,
        };

  // Arah pandang
  const moodEyeX = isPecking
    ? 5
    : isShy
      ? -6
      : isThinking || isConfused
        ? 4
        : isSad || isCrying
          ? -2
          : 0;
  const moodEyeY = isPecking
    ? 5
    : isReading
      ? 6
      : isShy
        ? 2
        : isThinking || isConfused
          ? -5
          : isSad
            ? 4
            : isCrying
              ? 5
              : 0;
  const eyeOffsetX = moodEyeX + (isFlippedLeft ? -lookOffset.x : lookOffset.x);
  const eyeOffsetY = moodEyeY + lookOffset.y;

  // ─────────────────────────────────────────────
  // Helper SVG untuk pose-pose
  // ─────────────────────────────────────────────

  const renderLaughEye = (halfWidth: number) => (
    <path
      d={`M ${-halfWidth} 8 L 0 -8 L ${halfWidth} 8`}
      fill="none"
      stroke="#07473C"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );

  const renderOverlayWing = (basePath: string, tipPath: string) => (
    <>
      <path
        d={basePath}
        fill="#FFFFFF"
        stroke="#07473C"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path
        d={tipPath}
        fill="#00937D"
        stroke="#07473C"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
    </>
  );

  const renderHeldItem = () => {
    if (holdItem === "ball") {
      return (
        <g>
          <circle
            cx="0"
            cy="0"
            r="25"
            fill="#FF6B6B"
            stroke="#07473C"
            strokeWidth="4.5"
          />
          <path
            d="M -25 0 C -10 8, 10 8, 25 0"
            fill="none"
            stroke="#07473C"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <ellipse cx="-10" cy="-12" rx="6" ry="4" fill="#FFFFFF" />
        </g>
      );
    }
    if (holdItem === "heart") {
      return (
        <path
          d="M 0 24 C -34 0, -26 -28, 0 -12 C 26 -28, 34 0, 0 24 Z"
          fill="#FF6B6B"
          stroke="#07473C"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
      );
    }
    return (
      <polygon
        points="0,-30 7.6,-10.5 28.5,-9.3 12.4,4 17.6,24.3 0,13 -17.6,24.3 -12.4,4 -28.5,-9.3 -7.6,-10.5"
        fill="#FDE047"
        stroke="#07473C"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
    );
  };

  // Buku terbuka (Iqro / Al-Quran) untuk mood="reading"
  const renderOpenBook = () => (
    <g id="tila-open-book">
      {/* Sampul Belakang Hijau Zamrud */}
      <path
        d="M -52 -16 L -4 -6 L 4 -6 L 52 -16 L 56 26 L 4 36 L -4 36 L -56 26 Z"
        fill="#00937D"
        stroke="#07473C"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {/* Lembaran Kiri & Kanan */}
      <path
        d="M -46 -22 Q -22 -18 -2 -8 L -2 30 Q -24 22 -48 18 Z"
        fill="#FEF9C3"
        stroke="#07473C"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M 46 -22 Q 22 -18 2 -8 L 2 30 Q 24 22 48 18 Z"
        fill="#FEF9C3"
        stroke="#07473C"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Punggung Buku Emas */}
      <rect
        x="-4"
        y="-8"
        width="8"
        height="42"
        rx="3"
        fill="#FBBF24"
        stroke="#07473C"
        strokeWidth="3.5"
      />
      {/* Baris tulisan simbolis */}
      <path
        d="M -36 -8 L -12 -3 M -36 2 L -12 7 M 12 -3 L 36 -8 M 12 7 L 36 2"
        stroke="#07473C"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.65"
      />
    </g>
  );

  // Path sayap-sayap overlay
  const holdWingBase =
    "M 150 252 C 142 300, 186 330, 238 318 C 246 304, 236 288, 216 276 C 196 264, 170 248, 150 252 Z";
  const holdWingTip =
    "M 166 290 C 184 312, 212 318, 236 312 C 238 304, 232 296, 224 290 C 206 294, 184 294, 166 290 Z";
  const shyWingBase =
    "M 158 288 C 152 256, 184 234, 216 240 C 242 244, 252 268, 246 292 C 240 316, 192 326, 168 310 C 162 304, 159 296, 158 288 Z";
  const shyWingTip =
    "M 214 242 C 240 246, 250 268, 246 292 C 240 316, 200 324, 180 316 C 214 308, 232 280, 214 242 Z";

  // Sayap menengadah berdoa (praying)
  const prayWingBase =
    "M 168 278 C 162 248, 196 236, 226 248 C 246 256, 248 282, 238 304 C 224 322, 182 312, 168 278 Z";
  const prayWingTip =
    "M 206 244 C 228 246, 246 264, 242 290 C 232 296, 218 292, 208 282 C 214 268, 214 256, 206 244 Z";

  // Sayap berkacak pinggang (proud)
  const hipWingBase =
    "M 148 242 C 122 268, 134 316, 178 320 C 196 320, 202 300, 188 286 C 174 272, 162 252, 148 242 Z";
  const hipWingTip =
    "M 152 296 C 164 316, 184 322, 196 310 C 198 300, 192 290, 182 286 C 172 292, 162 296, 152 296 Z";

  // Sayap hormat di pelipis kanan (salute)
  const saluteWingBase =
    "M 344 236 C 378 212, 382 158, 342 142 C 316 134, 294 152, 304 174 C 314 192, 330 214, 344 236 Z";
  const saluteWingTip =
    "M 342 142 C 316 134, 294 152, 304 174 C 318 176, 334 170, 346 158 C 348 150, 346 144, 342 142 Z";

  // Tampak samping
  const sideWingBase =
    "M 200 266 C 192 312, 248 342, 298 324 C 304 304, 288 286, 262 274 C 240 264, 216 258, 200 266 Z";
  const sideWingTip =
    "M 214 304 C 234 324, 266 330, 294 320 C 292 310, 284 300, 272 296 C 254 300, 232 302, 214 304 Z";
  const sideShyWingBase =
    "M 222 270 C 222 240, 262 226, 298 234 C 322 240, 322 272, 296 290 C 268 306, 228 298, 222 270 Z";
  const sideShyWingTip =
    "M 296 236 C 322 242, 322 272, 296 290 C 276 300, 250 300, 236 292 C 274 284, 294 262, 296 236 Z";
  const sideSaluteWingBase =
    "M 228 250 C 240 212, 286 148, 332 148 C 350 150, 352 172, 332 186 C 304 206, 268 236, 228 250 Z";
  const sideSaluteWingTip =
    "M 304 154 C 322 146, 344 150, 346 168 C 342 180, 324 190, 306 190 C 310 176, 310 164, 304 154 Z";

  // ─────────────────────────────────────────────
  // SVG Khusus: Bola Berputar Seperti Gasing (spinning)
  // ─────────────────────────────────────────────
  const renderSpinningBall = () => (
    <g id="tila-spinning-top-ball">
      <defs>
        <clipPath id="tila-spin-ball-clip">
          <circle cx="250" cy="240" r="110" />
        </clipPath>
      </defs>

      <circle cx="256" cy="252" r="112" fill="#CFD8B6" opacity="0.65" />

      <motion.ellipse
        cx="250"
        cy="242"
        rx="148"
        ry="34"
        fill="none"
        stroke="#C5D6A7"
        strokeWidth="4"
        strokeDasharray="32 22 14 22"
        strokeLinecap="round"
        animate={{
          strokeDashoffset: [0, -180],
          scaleX: [0.97, 1.03, 0.97],
        }}
        transition={{
          strokeDashoffset: {
            repeat: Infinity,
            duration: 0.35,
            ease: "linear",
          },
          scaleX: { repeat: Infinity, duration: 0.35, ease: "easeInOut" },
        }}
      />

      <motion.g
        animate={{ x: [-1.5, 1.5, -1.5] }}
        transition={{ repeat: Infinity, duration: 0.12, ease: "easeInOut" }}
      >
        <ellipse
          cx="250"
          cy="128"
          rx="26"
          ry="9"
          fill="#00937D"
          stroke="#07473C"
          strokeWidth="4.5"
        />
        <path
          d="M 240 126 C 240 100, 260 100, 260 126 Z"
          fill="#00B894"
          stroke="#07473C"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path
          d="M 228 344 L 250 382 L 272 344 Z"
          fill="#FF5E6C"
          stroke="#07473C"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <ellipse
          cx="250"
          cy="346"
          rx="28"
          ry="8"
          fill="#00937D"
          stroke="#07473C"
          strokeWidth="4.5"
        />
      </motion.g>

      <circle
        cx="250"
        cy="240"
        r="110"
        fill="#FBBF24"
        stroke="#07473C"
        strokeWidth="4.5"
      />

      <g clipPath="url(#tila-spin-ball-clip)">
        <path
          d="M 130 162 Q 250 184 370 162 L 370 198 Q 250 220 130 198 Z"
          fill="#00B894"
          stroke="#07473C"
          strokeWidth="4"
        />
        <path
          d="M 130 222 Q 250 244 370 222 L 370 258 Q 250 280 130 258 Z"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="4"
        />
        <path
          d="M 130 282 Q 250 304 370 282 L 370 318 Q 250 340 130 318 Z"
          fill={isGirl ? "#FF6B6B" : "#00937D"}
          stroke="#07473C"
          strokeWidth="4"
        />

        <motion.g
          animate={{ x: [-240, 240] }}
          transition={{ repeat: Infinity, duration: 0.24, ease: "linear" }}
        >
          {[-240, 0, 240].map((offset) => (
            <g key={offset} transform={`translate(${offset} 0)`}>
              <ellipse cx="222" cy="208" rx="22" ry="8" fill="#07473C" />
              <ellipse cx="226" cy="206" rx="9" ry="3.5" fill="#FFFFFF" />
              <ellipse cx="278" cy="208" rx="22" ry="8" fill="#07473C" />
              <ellipse cx="282" cy="206" rx="9" ry="3.5" fill="#FFFFFF" />
              <ellipse
                cx="250"
                cy="240"
                rx="28"
                ry="11"
                fill="#FF5E6C"
                stroke="#07473C"
                strokeWidth="3.5"
              />
              <path
                d="M 170 180 L 215 180 M 285 180 L 330 180"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M 185 300 L 235 300 M 265 300 L 315 300"
                stroke="#FDE047"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>
          ))}
        </motion.g>

        <path
          d="M 140 280 C 175 338, 325 338, 360 280 C 335 362, 165 362, 140 280 Z"
          fill="#EAA012"
          opacity="0.85"
        />
        <ellipse
          cx="210"
          cy="165"
          rx="32"
          ry="13"
          transform="rotate(-18 210 165)"
          fill="#FFFFFF"
          opacity="0.65"
        />
      </g>

      <circle
        cx="250"
        cy="240"
        r="110"
        fill="none"
        stroke="#07473C"
        strokeWidth="4.5"
      />

      <motion.path
        d="M 102 242 C 102 268, 398 268, 398 242"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="48 36"
        animate={{ strokeDashoffset: [0, -168] }}
        transition={{ repeat: Infinity, duration: 0.26, ease: "linear" }}
      />
      <motion.path
        d="M 118 252 C 135 276, 365 276, 382 252"
        fill="none"
        stroke="#07473C"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="36 48"
        animate={{ strokeDashoffset: [0, -168] }}
        transition={{ repeat: Infinity, duration: 0.26, ease: "linear" }}
      />

      <motion.ellipse
        cx="250"
        cy="384"
        rx="44"
        ry="9"
        fill="none"
        stroke="#07473C"
        strokeWidth="3.5"
        strokeDasharray="18 14"
        animate={{
          strokeDashoffset: [0, -64],
          scaleX: [0.85, 1.15, 0.85],
        }}
        transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
      />

      {[
        { x: 108, y: 164, d: 0 },
        { x: 394, y: 174, d: 0.2 },
        { x: 122, y: 318, d: 0.4 },
        { x: 382, y: 312, d: 0.1 },
      ].map((sp, idx) => (
        <motion.g
          key={idx}
          transform={`translate(${sp.x} ${sp.y})`}
          animate={{ scale: [0.5, 1.2, 0.5], rotate: [0, 90, 180] }}
          transition={{
            repeat: Infinity,
            duration: 0.65,
            delay: sp.d,
            ease: "easeInOut",
          }}
        >
          <path
            d="M 0 -11 L 3 -3 L 11 0 L 3 3 L 0 11 L -3 3 L -11 0 L -3 -3 Z"
            fill="#FDE047"
            stroke="#07473C"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </motion.g>
      ))}
    </g>
  );

  // Efek mata untuk love / angry / crying / dizzy / winking / starry / proud / confused
  const renderEyeFx = (view: "front" | "side") => {
    if (!hasEyeFx) return null;

    // Kacamata hitam keren khusus mood="proud"
    if (isProud) {
      if (view === "front") {
        return (
          <motion.g
            id="eye-fx-proud-front"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            {/* Gagang & bridge kacamata hitam */}
            <path
              d="M 156 182 L 344 182"
              stroke="#07473C"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Lensa kiri */}
            <path
              d="M 172 180 L 238 180 L 232 212 Q 205 220 178 212 Z"
              fill="#053B33"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Lensa kanan */}
            <path
              d="M 262 180 L 328 180 L 322 212 Q 295 220 268 212 Z"
              fill="#053B33"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Kilau miring pada lensa */}
            <path
              d="M 186 186 L 198 206 M 202 186 L 208 196 M 276 186 L 288 206 M 292 186 L 298 196"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </motion.g>
        );
      }
      return (
        <motion.g
          id="eye-fx-proud-side"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <path
            d="M 206 184 L 354 174"
            stroke="#07473C"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 226 180 L 286 176 L 280 208 Q 255 216 232 208 Z"
            fill="#053B33"
            stroke="#07473C"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path
            d="M 298 175 L 352 172 L 346 202 Q 325 210 304 202 Z"
            fill="#053B33"
            stroke="#07473C"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path
            d="M 240 184 L 252 202 M 310 180 L 320 196"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </motion.g>
      );
    }

    const eyes =
      view === "front"
        ? [
            {
              x: 206,
              y: 192,
              rx: 25,
              ry: 27,
              rot: 0,
              mirror: false,
              wink: false,
            },
            {
              x: 294,
              y: 192,
              rx: 25,
              ry: 27,
              rot: 0,
              mirror: true,
              wink: true,
            },
          ]
        : [
            {
              x: 255,
              y: 190,
              rx: 25,
              ry: 27,
              rot: -10,
              mirror: false,
              wink: true,
            },
            {
              x: 326,
              y: 184,
              rx: 23,
              ry: 25,
              rot: -10,
              mirror: false,
              wink: false,
            },
          ];

    return (
      <g id={`eye-fx-${view}`}>
        {eyes.map((e, i) => {
          if (isWinking && !e.wink) return null;

          return (
            <g
              key={i}
              transform={`translate(${e.x} ${e.y}) rotate(${e.rot}) scale(${eyeScale})`}
            >
              <g transform={e.mirror ? "scale(-1 1)" : undefined}>
                {isLove && (
                  <>
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={e.rx + 3}
                      ry={e.ry + 3}
                      fill="#FBBF24"
                    />
                    <motion.g
                      animate={{ scale: [1, 1.18, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        d="M 0 16 C -30 -2, -22 -26, 0 -10 C 22 -26, 30 -2, 0 16 Z"
                        fill="#F43F5E"
                        stroke="#07473C"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      />
                      <ellipse cx="-9" cy="-9" rx="4" ry="2.6" fill="#FFFFFF" />
                    </motion.g>
                  </>
                )}

                {isStarry && (
                  <motion.g
                    animate={{
                      scale: [0.92, 1.16, 0.92],
                      rotate: [-8, 8, -8],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.75,
                      ease: "easeInOut",
                    }}
                  >
                    <polygon
                      points="0,-20 5.5,-6.5 20,-5 9,5 12.5,19 0,11.5 -12.5,19 -9,5 -20,-5 -5.5,-6.5"
                      fill="#FDE047"
                      stroke="#07473C"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <circle cx="-6" cy="-8" r="3" fill="#FFFFFF" />
                  </motion.g>
                )}

                {isConfused && (
                  <path
                    d={
                      i === 0
                        ? "M -24 -34 Q 0 -46 24 -30"
                        : "M -24 -22 L 24 -28"
                    }
                    fill="none"
                    stroke="#07473C"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                )}

                {isWinking && (
                  <>
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={e.rx + 3}
                      ry={e.ry + 3}
                      fill="#FBBF24"
                    />
                    <path
                      d="M -18 6 Q 0 -10 18 6"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    <motion.g
                      animate={{
                        scale: [0.6, 1.2, 0.6],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "easeInOut",
                      }}
                    >
                      <path
                        transform="translate(28 -28)"
                        d="M 0 -9 L 2.8 -2.8 L 9 0 L 2.8 2.8 L 0 9 L -2.8 2.8 L -9 0 L -2.8 -2.8 Z"
                        fill="#FEF08A"
                        stroke="#07473C"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </motion.g>
                  </>
                )}

                {isAngry && (
                  <>
                    <path
                      d="M -30 -30 L 30 -4 L 30 -38 L -30 -38 Z"
                      fill="#FBBF24"
                    />
                    <path
                      d="M -30 -30 L 30 -4"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {isCrying && (
                  <>
                    <path
                      d="M -28 -30 L 24 -42"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M -4 28 L -6 62"
                      fill="none"
                      stroke="#BAE6FD"
                      strokeWidth="5"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <motion.path
                      d="M 0 24 C -9 38, -9 48, 0 48 C 9 48, 9 38, 0 24 Z"
                      fill="#BAE6FD"
                      stroke="#07473C"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      animate={{ y: [0, 34], opacity: [1, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.9,
                        ease: "easeIn",
                        delay: i * 0.3,
                      }}
                    />
                  </>
                )}

                {isDizzy && (
                  <>
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={e.rx + 1}
                      ry={e.ry + 1}
                      fill="#FFFFFF"
                      stroke="#07473C"
                      strokeWidth="4"
                    />
                    <path
                      d="M 0 0 a 3 3 0 0 1 6 0 a 6 6 0 0 1 -12 0 a 9 9 0 0 1 18 0 a 12 12 0 0 1 -24 0"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0"
                        to="360"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </>
                )}
              </g>
            </g>
          );
        })}
      </g>
    );
  };

  const renderPoseOverlay = (view: "front" | "side" | "back") => {
    if (view === "back" || !hasWingOverlay) return null;

    if (view === "front") {
      if (isSalute) {
        return (
          <motion.g
            id="pose-salute-front"
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            {/* Sayap kiri istirahat di pinggang */}
            {renderOverlayWing(hipWingBase, hipWingTip)}
            {/* Sayap kanan hormat di pelipis */}
            {renderOverlayWing(saluteWingBase, saluteWingTip)}
          </motion.g>
        );
      }
      if (isPraying) {
        return (
          <motion.g
            id="pose-praying-front"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            {renderOverlayWing(prayWingBase, prayWingTip)}
            <g transform="translate(500 0) scale(-1 1)">
              {renderOverlayWing(prayWingBase, prayWingTip)}
            </g>
          </motion.g>
        );
      }
      if (isReading) {
        return (
          <motion.g
            id="pose-reading-front"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <g transform="translate(250 296)">{renderOpenBook()}</g>
            {renderOverlayWing(holdWingBase, holdWingTip)}
            <g transform="translate(500 0) scale(-1 1)">
              {renderOverlayWing(holdWingBase, holdWingTip)}
            </g>
          </motion.g>
        );
      }
      if (isProud) {
        return (
          <motion.g
            id="pose-proud-front"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            {renderOverlayWing(hipWingBase, hipWingTip)}
            <g transform="translate(500 0) scale(-1 1)">
              {renderOverlayWing(hipWingBase, hipWingTip)}
            </g>
          </motion.g>
        );
      }
      if (isLaughing) {
        return (
          <motion.g
            id="pose-laughing-wings-front"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.28, ease: "easeInOut" }}
          >
            <g transform="translate(12 18)">
              {renderOverlayWing(holdWingBase, holdWingTip)}
            </g>
            <g transform="translate(500 0) scale(-1 1)">
              <g transform="translate(12 18)">
                {renderOverlayWing(holdWingBase, holdWingTip)}
              </g>
            </g>
          </motion.g>
        );
      }
      if (isShy) {
        return (
          <motion.g
            id="pose-shy-wings-front"
            animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            {renderOverlayWing(shyWingBase, shyWingTip)}
            <path
              d="M 178 276 C 190 264, 212 262, 228 272"
              fill="none"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <g transform="translate(500 0) scale(-1 1)">
              {renderOverlayWing(shyWingBase, shyWingTip)}
              <path
                d="M 178 276 C 190 264, 212 262, 228 272"
                fill="none"
                stroke="#07473C"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </g>
          </motion.g>
        );
      }
      // holding
      return (
        <motion.g
          id="pose-holding-front"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <g transform="translate(250 284) scale(1.2)">{renderHeldItem()}</g>
          {renderOverlayWing(holdWingBase, holdWingTip)}
          <g transform="translate(500 0) scale(-1 1)">
            {renderOverlayWing(holdWingBase, holdWingTip)}
          </g>
        </motion.g>
      );
    }

    // view === "side"
    if (isSalute) {
      return (
        <motion.g
          id="pose-salute-side"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          {renderOverlayWing(sideSaluteWingBase, sideSaluteWingTip)}
        </motion.g>
      );
    }
    if (isPraying) {
      return (
        <motion.g
          id="pose-praying-side"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          {renderOverlayWing(sideShyWingBase, sideShyWingTip)}
        </motion.g>
      );
    }
    if (isReading) {
      return (
        <motion.g
          id="pose-reading-side"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <g transform="translate(308 288) scale(0.9)">{renderOpenBook()}</g>
          {renderOverlayWing(sideWingBase, sideWingTip)}
        </motion.g>
      );
    }
    if (isShy) {
      return (
        <motion.g
          id="pose-shy-wing-side"
          animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          {renderOverlayWing(sideShyWingBase, sideShyWingTip)}
          <path
            d="M 244 272 C 258 262, 282 262, 298 270"
            fill="none"
            stroke="#07473C"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </motion.g>
      );
    }
    return (
      <motion.g
        id={isLaughing ? "pose-laughing-wing-side" : "pose-holding-side"}
        animate={{ y: isLaughing ? [0, -6, 0] : [0, -3, 0] }}
        transition={{
          repeat: Infinity,
          duration: isLaughing ? 0.28 : 1.8,
          ease: "easeInOut",
        }}
      >
        {isHolding && (
          <g transform="translate(296 286) scale(1.2)">{renderHeldItem()}</g>
        )}
        {renderOverlayWing(sideWingBase, sideWingTip)}
      </motion.g>
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onTap}
      className={`relative flex flex-col items-center justify-center select-none ${
        onTap ? "cursor-pointer" : ""
      } ${className}`}
      style={{ width: dimension, height: dimension, perspective: 1000 }}
    >
      <AnimatePresence>
        {speech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-6 z-50 whitespace-nowrap rounded-2xl border-[3px] border-[#07473C] bg-white px-4 py-1.5 text-sm font-bold text-[#07473C] shadow-[3px_3px_0px_#07473C]"
          >
            {speech}
            <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-[3px] border-r-[3px] border-[#07473C] bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bayangan tanah untuk animasi bola gasing (spinning) */}
      {isSpinning && (
        <svg
          viewBox="0 0 500 500"
          width="100%"
          height="100%"
          className="pointer-events-none absolute inset-0 overflow-visible"
        >
          <motion.ellipse
            cx="250"
            cy="412"
            rx="85"
            ry="11"
            fill="#07473C"
            animate={{
              scaleX: [1, 0.82, 1],
              opacity: [0.18, 0.1, 0.18],
            }}
            transition={{ repeat: Infinity, duration: 0.55, ease: "easeInOut" }}
            style={{ transformOrigin: "250px 412px" }}
          />
        </svg>
      )}

      {/* Bayangan tanah + garis kecepatan untuk animasi menggelinding (rolling) */}
      {isRolling && (
        <svg
          viewBox="0 0 500 500"
          width="100%"
          height="100%"
          className="pointer-events-none absolute inset-0 overflow-visible"
        >
          <motion.ellipse
            cx="250"
            cy="392"
            rx="105"
            ry="10"
            fill="#07473C"
            animate={{
              scaleX: [1, 0.85, 1],
              opacity: [0.16, 0.09, 0.16],
            }}
            transition={{ repeat: Infinity, duration: 0.42, ease: "easeInOut" }}
            style={{ transformOrigin: "250px 392px" }}
          />
          <g
            transform={
              rollSign === 1 ? undefined : "translate(500 0) scale(-1 1)"
            }
          >
            {[0, 1, 2].map((i) => (
              <motion.line
                key={i}
                x1={140 - i * 28}
                y1={382 + i * 9}
                x2={195 - i * 28}
                y2={382 + i * 9}
                stroke="#07473C"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{
                  x: [25, -55],
                  opacity: [0, 0.45, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.45,
                  delay: i * 0.14,
                  ease: "linear",
                }}
              />
            ))}
          </g>
        </svg>
      )}

      {/* Bayangan tanah + biji untuk animasi mematuk */}
      {isPecking && (
        <svg
          viewBox="0 0 500 500"
          width="100%"
          height="100%"
          className="pointer-events-none absolute inset-0 overflow-visible"
        >
          <ellipse
            cx="250"
            cy="418"
            rx="130"
            ry="9"
            fill="#07473C"
            opacity="0.12"
          />
          <g
            transform={
              peckSign === 1 ? undefined : "translate(500 0) scale(-1 1)"
            }
          >
            {[
              { x: 372, y: 410 },
              { x: 392, y: 414 },
              { x: 356, y: 414 },
            ].map((s, i) => (
              <ellipse
                key={i}
                cx={s.x}
                cy={s.y}
                rx="7"
                ry="4.5"
                fill="#FBBF24"
                stroke="#07473C"
                strokeWidth="2.5"
              />
            ))}
            {[0, 1].map((i) => (
              <motion.circle
                key={i}
                cx={372 + i * 16}
                cy={404}
                r="3"
                fill="#F59E0B"
                animate={{
                  y: [0, 0, 0, -24, 0, -24, 0],
                  x: [0, 0, 0, i ? 10 : -8, 0, i ? 10 : -8, 0],
                  opacity: [0, 0, 1, 0, 1, 0, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.9,
                  times: [0, 0.2, 0.36, 0.46, 0.6, 0.7, 1],
                }}
              />
            ))}
          </g>
        </svg>
      )}

      <MascotAura skin={effectiveSkin} className="w-full h-full">
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            scaleX: isRotationActive ? scaleX : 1,
            rotateY: isRotationActive ? rotateY : 0,
            opacity: isRotationActive ? opacity : 1,
            transformStyle: "preserve-3d",
          }}
        >
        <motion.svg
          viewBox="0 0 500 500"
          width="100%"
          height="100%"
          animate={
            (isStatic
              ? bodyAnimate
              : (poseBodyAnimate ?? bodyAnimate)) as TargetAndTransition
          }
          style={
            isPecking
              ? { transformOrigin: "50% 66%" }
              : isRolling
                ? { transformOrigin: "250px 240px" }
                : undefined
          }
          className="overflow-visible"
        >
          {/* Jika animasi "spinning", tampilkan SVG bola gasing */}
          {isSpinning ? (
            renderSpinningBall()
          ) : (
            <>
              {isSideView && (
                <motion.g
                  initial={false}
                  animate={{ scaleX: isFlippedLeft ? -1 : 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  style={{ transformOrigin: "250px 250px" }}
                >
                  <g opacity="0.85">
                    {!isStatic && !isPerching && !isRolling && (
                      <motion.g
                        animate={{
                          opacity: [0.3, 0.9, 0.3],
                          scale: [0.98, 1.02, 0.98],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: flapDuration * 1.5,
                        }}
                      >
                        <path
                          d="M 65 170 C 52 135, 70 102, 112 126"
                          fill="none"
                          stroke="#C5D6A7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 56 268 C 48 250, 58 235, 72 238"
                          fill="none"
                          stroke="#C5D6A7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 405 142 C 425 118, 460 120, 456 160 C 454 172, 444 182, 448 196 C 452 210, 440 225, 432 228 C 440 238, 434 252, 420 256"
                          fill="none"
                          stroke="#C5D6A7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </motion.g>
                    )}

                    {!isRolling && (
                      <g transform="translate(-14, 14)" opacity="0.65">
                        <path
                          d="M 160 278 C 120 268, 82 242, 72 255 C 63 266, 78 286, 92 288 C 68 282, 62 296, 72 308 C 68 315, 68 332, 85 335 C 115 338, 150 325, 178 310 Z"
                          fill="#CFD8B6"
                        />
                        <path
                          d="M 80 130 C 68 136, 78 168, 82 162 C 70 172, 82 198, 102 212 C 85 216, 88 238, 125 250 C 118 262, 138 278, 165 274 L 204 238 Z"
                          fill="#CFD8B6"
                        />
                        <ellipse
                          cx="255"
                          cy="240"
                          rx="106"
                          ry="105"
                          fill="#CFD8B6"
                        />
                        <path
                          d="M 218 324 C 202 348, 182 360, 162 363 C 152 365, 147 378, 149 392 C 151 404, 162 400, 167 385 C 170 377, 168 373, 176 371 C 198 365, 218 348, 230 330 Z"
                          fill="#CFD8B6"
                        />
                        <path
                          d="M 258 344 C 245 365, 225 375, 210 378 C 202 380, 198 392, 200 405 C 202 415, 212 412, 216 398 C 219 390, 218 386, 225 384 C 245 378, 262 365, 273 345 Z"
                          fill="#CFD8B6"
                        />
                      </g>
                    )}
                  </g>

                  <motion.g
                    animate={rightWingAnimate}
                    style={{ transformOrigin: "350px 235px" }}
                  >
                    <path
                      d="M 350 212 L 434 162 C 446 172, 439 198, 416 213 C 431 221, 426 244, 396 251 C 400 264, 382 276, 350 272 Z"
                      fill="#FFFFFF"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 416 213 C 409 218, 402 222, 395 224 M 396 251 C 388 253, 381 253, 375 253"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 350 206 C 370 191, 388 176, 398 167 C 404 184, 399 204, 382 220 C 372 229, 361 235, 352 237 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 398 167 C 414 152, 431 134, 441 139 C 450 144, 443 172, 424 191 C 411 203, 396 212, 382 220 C 399 204, 404 184, 398 167 Z"
                      fill="#00B894"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                  </motion.g>

                  <motion.g
                    animate={tailAnimate}
                    style={{ transformOrigin: "165px 295px" }}
                  >
                    {showPlumes ? (
                      <g id="cendrawasih-tail-side">
                        <path
                          d="M 155 278 C 105 255, 45 270, 32 310 C 22 340, 52 368, 92 355 C 122 345, 155 315, 175 305 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 135 285 C 95 270, 55 285, 45 318 C 38 338, 62 355, 92 342 C 118 330, 145 308, 160 300 Z"
                          fill={skinPalette.accent1}
                          stroke={skinPalette.stroke}
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="38"
                          cy="326"
                          r="6"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="2.5"
                        />
                        <path
                          d="M 148 290 C 95 280, 25 320, 15 365 C 10 385, 28 395, 38 385 C 48 375, 75 340, 125 320"
                          fill="none"
                          stroke={skinPalette.stroke}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="20"
                          cy="380"
                          r="5"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="2.5"
                        />
                        <path
                          d="M 155 285 Q 95 305 48 335"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity="0.8"
                        />
                      </g>
                    ) : (
                      <>
                        <path
                          d="M 155 278 C 120 266, 82 242, 71 254 C 62 264, 76 286, 105 293 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 95 288 C 68 281, 61 295, 71 307 C 81 317, 108 318, 130 315 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 83 313 C 68 315, 68 331, 86 335 C 112 338, 146 328, 175 313 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 155 278 C 132 271, 112 263, 106 272 C 101 279, 114 290, 136 294 C 112 290, 102 295, 105 304 C 107 312, 124 314, 142 313 C 118 315, 108 320, 112 329 C 116 334, 148 326, 175 313 Z"
                          fill={skinPalette.wingsBase}
                          stroke="#07473C"
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                      </>
                    )}
                  </motion.g>

                  <motion.g
                    animate={legAnimate}
                    style={{ transformOrigin: "265px 345px" }}
                  >
                    <path
                      d="M 258 344 C 245 365, 225 375, 210 378 C 201 380, 197 392, 199 405 C 201 416, 212 412, 216 398 C 219 390, 218 386, 225 384 C 245 378, 262 365, 273 345 Z"
                      fill="#FF5E6C"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 255 344 L 273 345 L 269 352 L 252 350 Z"
                      fill="#07473C"
                    />
                  </motion.g>

                  {resolvedAccessory !== "peci" && (
                    <motion.g
                      animate={crestAnimate}
                      style={{ transformOrigin: "250px 133px" }}
                    >
                      <path
                        d="M 244 134 C 228 128, 220 115, 229 109 C 235 105, 243 113, 246 118 C 241 102, 244 91, 253 92 C 261 92, 262 104, 258 119 C 264 109, 273 105, 277 112 C 281 119, 270 131, 255 134 Z"
                        fill={skinPalette.accent1}
                        stroke={skinPalette.stroke}
                        strokeWidth="4.5"
                        strokeLinejoin="round"
                      />
                    </motion.g>
                  )}

                  {/* Overlays Kepala: Tanduk Naga & Antena Robot */}
                  {renderNagaHorns("side")}
                  {renderRobotAntenna("side")}

                  <ellipse
                    cx="255"
                    cy="240"
                    rx="106"
                    ry="105"
                    fill={skinPalette.body}
                    stroke={skinPalette.stroke}
                    strokeWidth="4.5"
                  />
                  <path
                    d="M 153 268 C 175 305, 225 335, 305 332 C 262 352, 185 342, 153 268 Z"
                    fill={skinPalette.belly}
                  />
                  <ellipse
                    cx="255"
                    cy="240"
                    rx="106"
                    ry="105"
                    fill="none"
                    stroke={skinPalette.stroke}
                    strokeWidth="4.5"
                  />

                  {/* Overlays Badan: Sisik Naga & Panel Robot */}
                  {renderNagaScales("side")}
                  {renderRobotPanels("side")}

                  <motion.g
                    animate={legAnimate}
                    style={{ transformOrigin: "225px 325px" }}
                  >
                    <path
                      d="M 218 324 C 202 348, 182 360, 162 363 C 151 365, 146 378, 148 392 C 150 404, 162 400, 167 385 C 170 377, 168 373, 176 371 C 198 365, 218 348, 230 330 C 234 323, 223 317, 218 324 Z"
                      fill="#FF5E6C"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                  </motion.g>

                  <motion.g
                    animate={leftWingAnimate}
                    style={{ transformOrigin: "198px 232px" }}
                  >
                    <path
                      d="M 82 162 C 70 172, 82 198, 102 212 C 85 216, 88 238, 125 250 C 118 262, 138 278, 165 274 C 186 271, 203 255, 204 236 L 130 190 Z"
                      fill="#FFFFFF"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 102 212 C 110 218, 118 221, 125 223 M 125 250 C 132 252, 138 253, 144 253"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 131 158 C 158 178, 188 198, 201 220 C 206 229, 206 239, 196 241 C 174 244, 144 228, 130 202 C 125 186, 126 170, 131 158 Z"
                      fill={skinPalette.accent2}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 131 158 C 110 143, 90 124, 80 130 C 68 136, 77 167, 98 185 C 109 194, 120 199, 130 202 C 125 186, 126 170, 131 158 Z"
                      fill={skinPalette.accent1}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    {showPlumes && (
                      <g id="cendrawasih-side-wing-plumes">
                        <path
                          d="M 145 240 C 115 270, 92 315, 106 328 C 118 338, 138 318, 155 285 C 168 262, 178 245, 185 238 Z"
                          fill={skinPalette.accent1}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 100 322 C 102 334, 114 338, 122 330 C 118 322, 110 318, 100 322 Z"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 165 248 Q 135 285 116 320"
                          fill="none"
                          stroke={skinPalette.stroke}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </motion.g>

                  <motion.g
                    animate={{ x: eyeOffsetX * 0.6, y: eyeOffsetY * 0.6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <path d="M 284 222 L 316 243 L 311 258 Z" fill="#EAA012" />
                    <circle
                      cx="240"
                      cy="225"
                      r={13.5 + cheekExtra}
                      fill="#FF5E6C"
                    />
                    <circle
                      cx="346"
                      cy="218"
                      r={12 + cheekExtra}
                      fill="#FF5E6C"
                    />
                    {isShy && (
                      <>
                        <circle cx="240" cy="225" r="8" fill="#F43F5E" />
                        <circle cx="346" cy="218" r="7" fill="#F43F5E" />
                      </>
                    )}

                    <g
                      transform={`translate(255, 190) rotate(-10) scale(${eyeScale})`}
                    >
                      {effectiveSkin === "robot" ? (
                        renderRobotEye()
                      ) : (
                        <>
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="25"
                            ry="27"
                            fill={eyeHidden ? skinPalette.body : "#FFFFFF"}
                            stroke={eyeHidden ? "none" : skinPalette.stroke}
                            strokeWidth="4"
                          />
                          {eyeShape === "laugh" ? (
                            renderLaughEye(18)
                          ) : eyeShape === "sleep" ? (
                            <path
                              d="M -18 2 Q 0 14 18 2"
                              fill="none"
                              stroke="#07473C"
                              strokeWidth="4.5"
                              strokeLinecap="round"
                            />
                          ) : (
                            <motion.g
                              animate={
                                isReading
                                  ? { x: [-5, 5, -5], y: 6 }
                                  : isPeeking
                                    ? { x: [-6, 6, -6], y: -3 }
                                    : {
                                        x: eyeOffsetX,
                                        y: eyeOffsetY,
                                        scale: pupilScale,
                                      }
                              }
                              transition={
                                isReading || isPeeking
                                  ? {
                                      repeat: Infinity,
                                      duration: 1.4,
                                      ease: "easeInOut",
                                    }
                                  : undefined
                              }
                            >
                              <circle cx="2" cy="0" r="19.5" fill="#008F7A" />
                              <circle cx="3" cy="0" r="15.5" fill="#053B33" />
                              <circle cx="11" cy="-8" r="6.5" fill="#FFFFFF" />
                              <path
                                d="M -5 1 Q -5 6 0 6 Q -5 6 -5 11 Q -5 6 -10 6 Q -5 6 -5 1 Z"
                                fill="#FFFFFF"
                              />
                            </motion.g>
                          )}
                        </>
                      )}
                      {isGirl && (
                        <g id="eyelashes-side-main">
                          <path
                            d="M 12 -22 Q 22 -30 30 -26"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 19 -15 Q 29 -20 36 -14"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 22 -6 Q 30 -9 35 -3"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </g>
                      )}
                    </g>

                    <g
                      transform={`translate(326, 184) rotate(-10) scale(${eyeScale})`}
                    >
                      <ellipse
                        cx="0"
                        cy="0"
                        rx="23"
                        ry="25"
                        fill={eyeHidden ? "#FBBF24" : "#FFFFFF"}
                        stroke={eyeHidden ? "none" : "#07473C"}
                        strokeWidth="4"
                      />
                      {eyeShape === "laugh" ? (
                        renderLaughEye(16)
                      ) : eyeShape === "sleep" ? (
                        <path
                          d="M -16 2 Q 0 13 16 2"
                          fill="none"
                          stroke="#07473C"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                      ) : (
                        <motion.g
                          animate={
                            isReading
                              ? { x: [-5, 5, -5], y: 6 }
                              : isPeeking
                                ? { x: [-6, 6, -6], y: -3 }
                                : {
                                    x: eyeOffsetX,
                                    y: eyeOffsetY,
                                    scale: pupilScale,
                                  }
                          }
                          transition={
                            isReading || isPeeking
                              ? {
                                  repeat: Infinity,
                                  duration: 1.4,
                                  ease: "easeInOut",
                                }
                              : undefined
                          }
                        >
                          <circle cx="2" cy="0" r="18" fill="#008F7A" />
                          <circle cx="3" cy="0" r="14" fill="#053B33" />
                          <circle cx="10" cy="-7" r="6" fill="#FFFFFF" />
                          <path
                            d="M -4 1 Q -4 5.5 0.5 5.5 Q -4 5.5 -4 10 Q -4 5.5 -8.5 5.5 Q -4 5.5 -4 1 Z"
                            fill="#FFFFFF"
                          />
                        </motion.g>
                      )}
                      {isGirl && (
                        <g id="eyelashes-side-sub">
                          <path
                            d="M 10 -20 Q 18 -27 26 -24"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 18 -13 Q 26 -17 31 -12"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </g>
                      )}
                    </g>

                    <motion.g
                      animate={
                        talking || isLaughing || isSinging
                          ? { scaleY: [1, 1.18, 0.92, 1.15, 1] }
                          : isExcited || isCheering
                            ? { scale: [1, 1.06, 1] }
                            : {}
                      }
                      transition={
                        talking || isLaughing || isSinging
                          ? { repeat: Infinity, duration: 0.25 }
                          : { repeat: Infinity, duration: 1.2 }
                      }
                      style={{ transformOrigin: "285px 212px" }}
                    >
                      {isShocked ? (
                        <>
                          <ellipse
                            cx="302"
                            cy="232"
                            rx="16"
                            ry="21"
                            fill="#FF5E6C"
                            stroke="#07473C"
                            strokeWidth="4.5"
                          />
                          <ellipse
                            cx="304"
                            cy="236"
                            rx="8"
                            ry="13"
                            fill="#07473C"
                          />
                          <path
                            d="M 323 191 C 304 195, 285 201, 280 209 C 277 214, 282 218, 292 219 L 318 208 Z"
                            fill="#FF5E6C"
                            stroke="#07473C"
                            strokeWidth="4.5"
                            strokeLinejoin="round"
                          />
                        </>
                      ) : (
                        <>
                          <path
                            d={`M 284 212 L 318 194 L 305 212 L ${sideBeakTip.x - 2} ${sideBeakTip.y - 4} Z`}
                            fill="#07473C"
                          />
                          <path
                            d={`M 285 213 L 296 213 L ${sideBeakTip.x - 4} ${sideBeakTip.y - 6} L 285 220 Z`}
                            fill="#FF5E6C"
                          />
                          <path
                            d={`M 323 191 C 304 195, 285 201, 280 209 C 276 216, 281 224, ${sideBeakTip.x} ${sideBeakTip.y} L 305 213 L 286 213 L 323 191 Z`}
                            fill="#FF5E6C"
                            stroke="#07473C"
                            strokeWidth="4"
                            strokeLinejoin="round"
                          />
                          <path
                            d={`M 323 191 L 305 213 L ${sideBeakTip.x} ${sideBeakTip.y}`}
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="298" cy="202" r="1.8" fill="#07473C" />
                          <circle cx="303" cy="200" r="1.5" fill="#07473C" />
                        </>
                      )}
                    </motion.g>

                    {renderEyeFx("side")}

                    {isSleeping && (
                      <motion.circle
                        cx="326"
                        cy="236"
                        r="9"
                        fill="#BAE6FD"
                        stroke="#07473C"
                        strokeWidth="4.5"
                        animate={{ scale: [0.4, 1.2, 0.4] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.4,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.g>
                  {renderPoseOverlay("side")}
                  {renderAccessory("side")}
                </motion.g>
              )}

              {finalDirection === "front" && (
                <motion.g
                  initial={{ opacity: 0.8, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <g opacity="0.75">
                    {!isStatic && !isPerching && !isRolling && (
                      <motion.g
                        animate={{ opacity: [0.3, 0.85, 0.3] }}
                        transition={{
                          repeat: Infinity,
                          duration: flapDuration * 1.5,
                        }}
                      >
                        <path
                          d="M 55 165 C 40 130, 62 100, 102 124"
                          fill="none"
                          stroke="#C5D6A7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 445 165 C 460 130, 438 100, 398 124"
                          fill="none"
                          stroke="#C5D6A7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </motion.g>
                    )}
                    {!isRolling && (
                      <ellipse
                        cx="250"
                        cy="252"
                        rx="112"
                        ry="108"
                        fill="#CFD8B6"
                        opacity="0.6"
                      />
                    )}
                  </g>

                  <motion.g
                    animate={tailAnimate}
                    style={{ transformOrigin: "250px 330px" }}
                  >
                    {showPlumes ? (
                      <g id="cendrawasih-tail-front">
                        <path
                          d="M 216 330 C 190 365, 185 415, 218 435 C 235 444, 265 444, 282 435 C 315 415, 310 365, 284 330 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 228 330 C 210 360, 208 398, 232 418 C 242 426, 258 426, 268 418 C 292 398, 290 360, 272 330 Z"
                          fill={skinPalette.accent1}
                          stroke={skinPalette.stroke}
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 228 412 Q 250 436 272 412 Q 250 422 228 412 Z"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 250 334 L 250 422"
                          fill="none"
                          stroke={skinPalette.stroke}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 240 365 L 250 375 L 260 365 M 238 385 L 250 395 L 262 385"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          opacity="0.8"
                        />
                        <path
                          d="M 232 350 C 190 390, 165 435, 178 450 C 188 460, 202 452, 206 438 C 210 422, 222 392, 238 362"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="184"
                          cy="452"
                          r="5"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="2.5"
                        />
                        <path
                          d="M 268 350 C 310 390, 335 435, 322 450 C 312 460, 298 452, 294 438 C 290 422, 278 392, 262 362"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="316"
                          cy="452"
                          r="5"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="2.5"
                        />
                      </g>
                    ) : (
                      <>
                        <path
                          d="M 225 330 C 215 358, 222 374, 235 370 C 238 382, 262 382, 265 370 C 278 374, 285 358, 275 330 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 232 330 C 226 348, 232 356, 240 353 C 243 362, 257 362, 260 353 C 268 356, 274 348, 268 330 Z"
                          fill={skinPalette.wingsBase}
                          stroke={skinPalette.stroke}
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                      </>
                    )}
                  </motion.g>

                  <motion.g
                    animate={leftWingAnimate}
                    style={{ transformOrigin: "165px 230px" }}
                  >
                    <path
                      d="M 165 208 L 66 158 C 54 168, 61 195, 84 210 C 69 218, 74 242, 104 249 C 100 262, 118 274, 165 268 Z"
                      fill="#FFFFFF"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 84 210 C 92 215, 100 219, 107 221 M 104 249 C 112 251, 119 251, 125 251"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 165 202 C 142 187, 120 172, 102 162 C 96 180, 101 200, 118 216 C 132 228, 148 234, 163 236 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 102 162 C 86 147, 69 130, 59 135 C 50 140, 57 168, 76 187 C 89 199, 104 208, 118 216 C 101 200, 96 180, 102 162 Z"
                      fill={skinPalette.accent1}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    {showPlumes && (
                      <g id="cendrawasih-left-wing-plumes">
                        <path
                          d="M 120 248 C 95 285, 78 330, 92 342 C 104 352, 122 332, 138 300 C 148 280, 158 262, 164 252 Z"
                          fill={skinPalette.accent1}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 132 250 C 114 282, 102 318, 112 328 C 120 334, 132 320, 145 292 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 86 336 C 88 348, 100 352, 108 344 C 104 336, 96 332, 86 336 Z"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 150 262 Q 120 300 102 336"
                          fill="none"
                          stroke={skinPalette.stroke}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </motion.g>

                  <motion.g
                    animate={rightWingAnimate}
                    style={{ transformOrigin: "335px 230px" }}
                  >
                    <path
                      d="M 335 208 L 434 158 C 446 168, 439 195, 416 210 C 431 218, 426 242, 396 249 C 400 262, 382 274, 335 268 Z"
                      fill={skinPalette.wingsBase}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 416 210 C 408 215, 400 219, 393 221 M 396 249 C 388 251, 381 251, 375 251"
                      fill="none"
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 335 202 C 358 187, 380 172, 398 162 C 404 180, 399 200, 382 216 C 368 228, 352 234, 337 236 Z"
                      fill={skinPalette.accent2}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 398 162 C 414 147, 431 130, 441 135 C 450 140, 443 168, 424 187 C 411 199, 396 208, 382 216 C 399 200, 404 180, 398 162 Z"
                      fill={skinPalette.accent1}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    {showPlumes && (
                      <g id="cendrawasih-right-wing-plumes">
                        <path
                          d="M 380 248 C 405 285, 422 330, 408 342 C 396 352, 378 332, 362 300 C 352 280, 342 262, 336 252 Z"
                          fill={skinPalette.accent1}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 368 250 C 386 282, 398 318, 388 328 C 380 334, 368 320, 355 292 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 414 336 C 412 348, 400 352, 392 344 C 396 336, 404 332, 414 336 Z"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 350 262 Q 380 300 398 336"
                          fill="none"
                          stroke="#07473C"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </g>
                    )}
                  </motion.g>

                  {resolvedAccessory !== "peci" && (
                    <motion.g
                      animate={crestAnimate}
                      style={{ transformOrigin: "250px 133px" }}
                    >
                      <path
                        d="M 244 134 C 228 128, 220 115, 229 109 C 235 105, 243 113, 246 118 C 241 102, 244 91, 253 92 C 261 92, 262 104, 258 119 C 264 109, 273 105, 277 112 C 281 119, 270 131, 255 134 Z"
                        fill={skinPalette.accent1}
                        stroke={skinPalette.stroke}
                        strokeWidth="4.5"
                        strokeLinejoin="round"
                      />
                    </motion.g>
                  )}

                  {/* Overlays Kepala: Tanduk Naga & Antena Robot */}
                  {renderNagaHorns("front")}
                  {renderRobotAntenna("front")}

                  <ellipse
                    cx="250"
                    cy="240"
                    rx="105"
                    ry="105"
                    fill={skinPalette.body}
                    stroke={skinPalette.stroke}
                    strokeWidth="4.5"
                  />
                  <path
                    d="M 152 275 C 180 322, 320 322, 348 275 C 325 342, 175 342, 152 275 Z"
                    fill={skinPalette.belly}
                  />
                  <ellipse
                    cx="250"
                    cy="240"
                    rx="105"
                    ry="105"
                    fill="none"
                    stroke={skinPalette.stroke}
                    strokeWidth="4.5"
                  />

                  {/* Overlays Badan: Sisik Naga & Panel Robot */}
                  {renderNagaScales("front")}
                  {renderRobotPanels("front")}

                  <motion.g
                    animate={legAnimate}
                    style={{ transformOrigin: "218px 332px" }}
                  >
                    <path
                      d="M 212 330 C 206 355, 196 372, 186 382 C 178 390, 182 406, 192 406 C 202 406, 206 392, 208 384 C 216 368, 222 350, 225 332 C 226 325, 214 323, 212 330 Z"
                      fill={skinPalette.leg}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                  </motion.g>
                  <motion.g
                    animate={legAnimate}
                    style={{ transformOrigin: "282px 332px" }}
                  >
                    <path
                      d="M 288 330 C 294 355, 304 372, 314 382 C 322 390, 318 406, 308 406 C 298 406, 294 392, 292 384 C 284 368, 278 350, 275 332 C 274 325, 286 323, 288 330 Z"
                      fill={skinPalette.leg}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                  </motion.g>

                  <motion.g
                    animate={{ x: eyeOffsetX * 0.8, y: eyeOffsetY * 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <path d="M 234 228 L 266 228 L 250 256 Z" fill={skinPalette.belly} />
                    <circle
                      cx="182"
                      cy="226"
                      r={13.5 + cheekExtra}
                      fill={skinPalette.cheek}
                    />
                    <circle
                      cx="318"
                      cy="226"
                      r={13.5 + cheekExtra}
                      fill={skinPalette.cheek}
                    />
                    {isShy && (
                      <>
                        <circle cx="182" cy="226" r="9" fill="#F43F5E" />
                        <circle cx="318" cy="226" r="9" fill="#F43F5E" />
                      </>
                    )}

                    <g transform={`translate(206, 192) scale(${eyeScale})`}>
                      {effectiveSkin === "robot" ? (
                        renderRobotEye()
                      ) : (
                        <>
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="25"
                            ry="27"
                            fill={eyeHidden ? skinPalette.body : "#FFFFFF"}
                            stroke={eyeHidden ? "none" : skinPalette.stroke}
                            strokeWidth="4"
                          />
                          {eyeShape === "laugh" ? (
                            renderLaughEye(18)
                          ) : eyeShape === "sleep" ? (
                            <path
                              d="M -18 2 Q 0 14 18 2"
                              fill="none"
                              stroke={skinPalette.stroke}
                              strokeWidth="4.5"
                              strokeLinecap="round"
                            />
                          ) : (
                            <motion.g
                              animate={
                                isReading
                                  ? { x: [-6, 6, -6], y: 6 }
                                  : isPeeking
                                    ? { x: [-7, 7, -7], y: -3 }
                                    : {
                                        x: eyeOffsetX,
                                        y: eyeOffsetY,
                                        scale: pupilScale,
                                      }
                              }
                              transition={
                                isReading || isPeeking
                                  ? {
                                      repeat: Infinity,
                                      duration: 1.4,
                                      ease: "easeInOut",
                                    }
                                  : undefined
                              }
                            >
                              <circle cx="0" cy="0" r="19.5" fill="#008F7A" />
                              <circle cx="0" cy="0" r="15.5" fill="#053B33" />
                              <circle cx="8" cy="-8" r="6.5" fill="#FFFFFF" />
                              <path
                                d="M -6 1 Q -6 6 -1 6 Q -6 6 -6 11 Q -6 6 -11 6 Q -6 6 -6 1 Z"
                                fill="#FFFFFF"
                              />
                            </motion.g>
                          )}
                        </>
                      )}
                      {isGirl && (
                        <g id="eyelashes-front-left">
                          <path
                            d="M -16 -21 Q -24 -28 -32 -26"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M -22 -14 Q -32 -18 -38 -12"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M -25 -4 Q -34 -6 -38 2"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </g>
                      )}
                    </g>

                    <g transform={`translate(294, 192) scale(${eyeScale})`}>
                      {effectiveSkin === "robot" ? (
                        renderRobotEye()
                      ) : (
                        <>
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="25"
                            ry="27"
                            fill={eyeHidden ? skinPalette.body : "#FFFFFF"}
                            stroke={eyeHidden ? "none" : skinPalette.stroke}
                            strokeWidth="4"
                          />
                          {eyeShape === "laugh" ? (
                            renderLaughEye(18)
                          ) : eyeShape === "sleep" ? (
                            <path
                              d="M -18 2 Q 0 14 18 2"
                              fill="none"
                              stroke={skinPalette.stroke}
                              strokeWidth="4.5"
                              strokeLinecap="round"
                            />
                          ) : (
                            <motion.g
                              animate={
                                isReading
                                  ? { x: [-6, 6, -6], y: 6 }
                                  : isPeeking
                                    ? { x: [-7, 7, -7], y: -3 }
                                    : {
                                        x: eyeOffsetX,
                                        y: eyeOffsetY,
                                        scale: pupilScale,
                                      }
                              }
                              transition={
                                isReading || isPeeking
                                  ? {
                                      repeat: Infinity,
                                      duration: 1.4,
                                      ease: "easeInOut",
                                    }
                                  : undefined
                              }
                            >
                              <circle cx="0" cy="0" r="19.5" fill="#008F7A" />
                              <circle cx="0" cy="0" r="15.5" fill="#053B33" />
                              <circle cx="8" cy="-8" r="6.5" fill="#FFFFFF" />
                              <path
                                d="M -6 1 Q -6 6 -1 6 Q -6 6 -6 11 Q -6 6 -11 6 Q -6 6 -6 1 Z"
                                fill="#FFFFFF"
                              />
                            </motion.g>
                          )}
                        </>
                      )}
                      {isGirl && (
                        <g id="eyelashes-front-right">
                          <path
                            d="M 16 -21 Q 24 -28 32 -26"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 22 -14 Q 32 -18 38 -12"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 25 -4 Q 34 -6 38 2"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </g>
                      )}
                    </g>

                    <motion.g
                      animate={
                        talking || isLaughing || isSinging
                          ? { scaleY: [1, 1.2, 0.9, 1.15, 1] }
                          : isExcited || isCheering
                            ? { scale: [1, 1.07, 1] }
                            : {}
                      }
                      transition={
                        talking || isLaughing || isSinging
                          ? { repeat: Infinity, duration: 0.25 }
                          : { repeat: Infinity, duration: 1.2 }
                      }
                      style={{ transformOrigin: "250px 215px" }}
                    >
                      {isShocked ? (
                        <>
                          <ellipse
                            cx="250"
                            cy="238"
                            rx="19"
                            ry="24"
                            fill="#FF5E6C"
                            stroke="#07473C"
                            strokeWidth="4.5"
                          />
                          <ellipse
                            cx="250"
                            cy="242"
                            rx="10"
                            ry="15"
                            fill="#07473C"
                          />
                          <path
                            d="M 226 214 C 232 196, 268 196, 274 214 Q 250 222 226 214 Z"
                            fill="#FF5E6C"
                            stroke="#07473C"
                            strokeWidth="4.5"
                            strokeLinejoin="round"
                          />
                          <circle cx="246" cy="206" r="1.6" fill="#07473C" />
                          <circle cx="254" cy="206" r="1.6" fill="#07473C" />
                        </>
                      ) : isLaughing || isCheering ? (
                        <>
                          <path
                            d="M 222 214 L 250 270 L 278 214 Z"
                            fill="#07473C"
                            stroke="#07473C"
                            strokeWidth="4.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M 235 242 Q 250 230 265 242 L 250 262 Z"
                            fill="#FF5E6C"
                          />
                          <path
                            d="M 226 214 C 232 196, 268 196, 274 214 Q 250 222 226 214 Z"
                            fill="#FF5E6C"
                            stroke="#07473C"
                            strokeWidth="4.5"
                            strokeLinejoin="round"
                          />
                          <circle cx="246" cy="206" r="1.6" fill="#07473C" />
                          <circle cx="254" cy="206" r="1.6" fill="#07473C" />
                        </>
                      ) : isGreeting || isProud || isPraying || isStarry ? (
                        <>
                          <path
                            d="M 230 214 Q 250 238 270 214 Z"
                            fill="#07473C"
                            stroke="#07473C"
                            strokeWidth="4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M 240 222 Q 250 218 260 222 Q 250 232 240 222 Z"
                            fill="#FF5E6C"
                          />
                          <path
                            d="M 226 214 C 232 196, 268 196, 274 214 Q 250 222 226 214 Z"
                            fill="#FF5E6C"
                            stroke="#07473C"
                            strokeWidth="4"
                            strokeLinejoin="round"
                          />
                          <circle cx="246" cy="206" r="1.6" fill="#07473C" />
                          <circle cx="254" cy="206" r="1.6" fill="#07473C" />
                        </>
                      ) : isSleeping ? (
                        <>
                          <path
                            d="M 226 214 C 232 196, 268 196, 274 214 Q 250 222 226 214 Z"
                            fill="#FF5E6C"
                            stroke="#07473C"
                            strokeWidth="4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M 232 220 Q 250 232 268 220"
                            fill="none"
                            stroke="#07473C"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                          />
                          <circle cx="246" cy="206" r="1.6" fill="#07473C" />
                          <circle cx="254" cy="206" r="1.6" fill="#07473C" />
                        </>
                      ) : (
                        <>
                          <path
                            d="M 230 214 L 250 246 L 270 214 Z"
                            fill="#07473C"
                            stroke="#07473C"
                            strokeWidth="4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M 238 224 Q 250 218 262 224 L 250 243 Z"
                            fill="#FF5E6C"
                          />
                          <path
                            d="M 226 214 C 232 196, 268 196, 274 214 Q 250 222 226 214 Z"
                            fill="#FF5E6C"
                            stroke="#07473C"
                            strokeWidth="4"
                            strokeLinejoin="round"
                          />
                          <circle cx="246" cy="206" r="1.6" fill="#07473C" />
                          <circle cx="254" cy="206" r="1.6" fill="#07473C" />
                        </>
                      )}
                    </motion.g>

                    {renderEyeFx("front")}

                    {isSleeping && (
                      <motion.circle
                        cx="288"
                        cy="232"
                        r="9"
                        fill="#BAE6FD"
                        stroke="#07473C"
                        strokeWidth="4.5"
                        animate={{ scale: [0.4, 1.2, 0.4] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.4,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.g>
                  {renderPoseOverlay("front")}
                  {renderAccessory("front")}
                </motion.g>
              )}

              {finalDirection === "back" && (
                <motion.g
                  initial={{ opacity: 0.8, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {!isRolling && (
                    <ellipse
                      cx="250"
                      cy="252"
                      rx="112"
                      ry="108"
                      fill="#CFD8B6"
                      opacity="0.6"
                    />
                  )}

                  <motion.g
                    animate={legAnimate}
                    style={{ transformOrigin: "218px 332px" }}
                  >
                    <path
                      d="M 212 330 C 206 355, 196 372, 186 382 C 178 390, 182 406, 192 406 C 202 406, 206 392, 208 384 C 216 368, 222 350, 225 332 C 226 325, 214 323, 212 330 Z"
                      fill={skinPalette.leg}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                  </motion.g>
                  <motion.g
                    animate={legAnimate}
                    style={{ transformOrigin: "282px 332px" }}
                  >
                    <path
                      d="M 288 330 C 294 355, 304 372, 314 382 C 322 390, 318 406, 308 406 C 298 406, 294 392, 292 384 C 284 368, 278 350, 275 332 C 274 325, 286 323, 288 330 Z"
                      fill={skinPalette.leg}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                  </motion.g>

                  {renderNagaHorns("back")}
                  {renderRobotAntenna("back")}

                  {resolvedAccessory !== "peci" && (
                    <motion.g
                      animate={crestAnimate}
                      style={{ transformOrigin: "250px 133px" }}
                    >
                      <path
                        d="M 244 134 C 228 128, 220 115, 229 109 C 235 105, 243 113, 246 118 C 241 102, 244 91, 253 92 C 261 92, 262 104, 258 119 C 264 109, 273 105, 277 112 C 281 119, 270 131, 255 134 Z"
                        fill={skinPalette.accent1}
                        stroke={skinPalette.stroke}
                        strokeWidth="4.5"
                        strokeLinejoin="round"
                      />
                    </motion.g>
                  )}

                  <ellipse
                    cx="250"
                    cy="240"
                    rx="105"
                    ry="105"
                    fill={skinPalette.body}
                    stroke={skinPalette.stroke}
                    strokeWidth="4.5"
                  />
                  <path
                    d="M 148 265 C 175 325, 325 325, 352 265 C 332 342, 168 342, 148 265 Z"
                    fill={skinPalette.belly}
                  />
                  <ellipse
                    cx="250"
                    cy="240"
                    rx="105"
                    ry="105"
                    fill="none"
                    stroke={skinPalette.stroke}
                    strokeWidth="4.5"
                  />

                  <motion.g
                    animate={leftWingAnimate}
                    style={{ transformOrigin: "165px 230px" }}
                  >
                    <path
                      d="M 165 208 L 66 158 C 54 168, 61 195, 84 210 C 69 218, 74 242, 104 249 C 100 262, 118 274, 165 268 Z"
                      fill={skinPalette.wingsBase}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 168 200 C 142 185, 120 170, 102 162 C 96 180, 101 200, 118 216 C 134 230, 155 238, 172 238 Z"
                      fill={skinPalette.accent2}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 102 162 C 86 147, 69 130, 59 135 C 50 140, 57 168, 76 187 C 89 199, 104 208, 118 216 C 101 200, 96 180, 102 162 Z"
                      fill={skinPalette.accent1}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    {showPlumes && (
                      <g id="cendrawasih-left-wing-plumes-back">
                        <path
                          d="M 120 248 C 95 285, 78 330, 92 342 C 104 352, 122 332, 138 300 C 148 280, 158 262, 164 252 Z"
                          fill={skinPalette.accent1}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 86 336 C 88 348, 100 352, 108 344 C 104 336, 96 332, 86 336 Z"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}
                  </motion.g>

                  <motion.g
                    animate={rightWingAnimate}
                    style={{ transformOrigin: "335px 230px" }}
                  >
                    <path
                      d="M 335 208 L 434 158 C 446 168, 439 195, 416 210 C 431 218, 426 242, 396 249 C 400 262, 382 274, 335 268 Z"
                      fill={skinPalette.wingsBase}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 332 200 C 358 185, 380 170, 398 162 C 404 180, 399 200, 382 216 C 366 230, 345 238, 328 238 Z"
                      fill={skinPalette.accent2}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 398 162 C 414 147, 431 130, 441 135 C 450 140, 443 168, 424 187 C 411 199, 396 208, 382 216 C 399 200, 404 180, 398 162 Z"
                      fill={skinPalette.accent1}
                      stroke={skinPalette.stroke}
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    {showPlumes && (
                      <g id="cendrawasih-right-wing-plumes-back">
                        <path
                          d="M 380 248 C 405 285, 422 330, 408 342 C 396 352, 378 332, 362 300 C 352 280, 342 262, 336 252 Z"
                          fill={skinPalette.accent1}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 414 336 C 412 348, 400 352, 392 344 C 396 336, 404 332, 414 336 Z"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                      </g>
                    )}
                  </motion.g>

                  <motion.g
                    animate={tailAnimate}
                    style={{ transformOrigin: "250px 305px" }}
                  >
                    {showPlumes ? (
                      <g id="cendrawasih-tail-back">
                        <path
                          d="M 216 305 C 190 345, 185 395, 218 425 C 235 436, 265 436, 282 425 C 315 395, 310 345, 284 305 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 228 305 C 210 340, 208 380, 232 405 C 242 415, 258 415, 268 405 C 292 380, 290 340, 272 305 Z"
                          fill={skinPalette.accent1}
                          stroke={skinPalette.stroke}
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 228 398 Q 250 422 272 398 Q 250 410 228 398 Z"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 232 325 C 190 365, 165 410, 178 425 C 188 435, 202 427, 206 413 C 210 397, 222 367, 238 337"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="184"
                          cy="427"
                          r="5"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="2.5"
                        />
                        <path
                          d="M 268 325 C 310 365, 335 410, 322 425 C 312 435, 298 427, 294 413 C 290 397, 278 367, 262 337"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="316"
                          cy="427"
                          r="5"
                          fill={skinPalette.tailTip}
                          stroke={skinPalette.stroke}
                          strokeWidth="2.5"
                        />
                      </g>
                    ) : (
                      <>
                        <path
                          d="M 235 305 C 205 325, 185 355, 198 368 C 208 378, 228 362, 242 342 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 265 305 C 295 325, 315 355, 302 368 C 292 378, 272 362, 258 342 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 238 310 C 232 348, 236 378, 250 380 C 264 378, 268 348, 262 310 Z"
                          fill={skinPalette.accent2}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 232 300 C 214 316, 206 335, 214 342 C 222 348, 234 338, 240 328 C 238 345, 242 356, 250 356 C 258 356, 262 345, 260 328 C 266 338, 278 348, 286 342 C 294 335, 286 316, 268 300 Q 250 292 232 300 Z"
                          fill={skinPalette.wingsBase}
                          stroke={skinPalette.stroke}
                          strokeWidth="4.5"
                          strokeLinejoin="round"
                        />
                      </>
                    )}
                  </motion.g>
                  {renderAccessory("back")}
                </motion.g>
              )}

              {/* Lampu ide (thinking) */}
              {isThinking && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0.85, 1, 0.85],
                    scale: [0.95, 1.08, 0.95],
                    y: [0, -4, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "253px 50px" }}
                >
                  <circle
                    cx="253"
                    cy="48"
                    r="18"
                    fill="#FEF08A"
                    stroke="#07473C"
                    strokeWidth="4"
                  />
                  <path
                    d="M 245 64 L 261 64 L 258 74 L 248 74 Z"
                    fill="#07473C"
                  />
                  <path
                    d="M 253 18 L 253 8 M 225 32 L 215 24 M 281 32 L 291 24 M 220 52 L 208 52 M 286 52 L 298 52"
                    stroke="#FBBF24"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </motion.g>
              )}

              {/* Tanda Tanya "?" melayang (confused) */}
              {isConfused && (
                <motion.g
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-8, 12, -8],
                    scale: [0.95, 1.08, 0.95],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.6,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "330px 95px" }}
                >
                  <circle
                    cx="330"
                    cy="92"
                    r="26"
                    fill="#FEF08A"
                    stroke="#07473C"
                    strokeWidth="4"
                  />
                  <path
                    d="M 322 82 C 322 72, 338 72, 338 82 C 338 89, 330 90, 330 96"
                    fill="none"
                    stroke="#07473C"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle cx="330" cy="106" r="3" fill="#07473C" />
                </motion.g>
              )}

              {/* Cahaya Doa Berkilau (praying) */}
              {isPraying && (
                <motion.g
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.92, 1.08, 0.92],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "250px 85px" }}
                >
                  {[
                    { x: 165, y: 120 },
                    { x: 335, y: 120 },
                    { x: 250, y: 65 },
                  ].map((sp, i) => (
                    <path
                      key={i}
                      transform={`translate(${sp.x} ${sp.y})`}
                      d="M 0 -12 L 3.5 -3.5 L 12 0 L 3.5 3.5 L 0 12 L -3.5 3.5 L -12 0 L -3.5 -3.5 Z"
                      fill="#FEF08A"
                      stroke="#07473C"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  ))}
                </motion.g>
              )}

              {/* Kilau Bintang Sekeliling (starry) */}
              {isStarry &&
                [
                  { x: 135, y: 145, d: 0 },
                  { x: 365, y: 145, d: 0.3 },
                  { x: 150, y: 265, d: 0.6 },
                  { x: 350, y: 265, d: 0.15 },
                ].map((st, idx) => (
                  <motion.g
                    key={idx}
                    transform={`translate(${st.x} ${st.y})`}
                    animate={{
                      scale: [0.4, 1.25, 0.4],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9,
                      delay: st.d,
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      d="M 0 -13 L 3.5 -3.5 L 13 0 L 3.5 3.5 L 0 13 L -3.5 3.5 L -13 0 L -3.5 -3.5 Z"
                      fill="#FDE047"
                      stroke="#07473C"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  </motion.g>
                ))}

              {/* Konfeti Perayaan (cheer) */}
              {isCheering &&
                [
                  { x: 125, y: 115, c: "#FF6B6B", d: 0 },
                  { x: 375, y: 115, c: "#00B894", d: 0.2 },
                  { x: 165, y: 75, c: "#FBBF24", d: 0.4 },
                  { x: 335, y: 75, c: "#3B82F6", d: 0.1 },
                  { x: 250, y: 55, c: "#F43F5E", d: 0.3 },
                ].map((cf, i) => (
                  <motion.rect
                    key={i}
                    x={cf.x}
                    y={cf.y}
                    width="12"
                    height="12"
                    rx="3"
                    fill={cf.c}
                    stroke="#07473C"
                    strokeWidth="2.5"
                    animate={{
                      y: [0, 55],
                      rotate: [0, 180],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.1,
                      delay: cf.d,
                      ease: "easeOut",
                    }}
                  />
                ))}

              {/* Not Irama Melayang (singing) */}
              {isSinging &&
                [
                  { x: 335, y: 165, d: 0 },
                  { x: 372, y: 125, d: 0.5 },
                  { x: 145, y: 155, d: 0.9 },
                ].map((nt, i) => (
                  <g key={i} transform={`translate(${nt.x} ${nt.y})`}>
                    <motion.g
                      animate={{
                        y: [0, -42],
                        x: [0, i % 2 === 0 ? 12 : -12],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.6,
                        delay: nt.d,
                        ease: "easeOut",
                      }}
                    >
                      <ellipse
                        cx="0"
                        cy="0"
                        rx="8"
                        ry="6"
                        fill="#00B894"
                        stroke="#07473C"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M 6 0 L 6 -22 L 18 -18"
                        fill="none"
                        stroke="#07473C"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.g>
                  </g>
                ))}

              {/* Garis Getar & Keringat Dingin (shiver) */}
              {isShivering && (
                <motion.g
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.2 }}
                >
                  <path
                    d="M 112 195 Q 102 215 112 235 Q 102 255 112 275 M 388 195 Q 398 215 388 235 Q 398 255 388 275"
                    fill="none"
                    stroke="#07473C"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 352 142 C 342 158, 346 172, 356 170 C 366 168, 364 156, 352 142 Z"
                    fill="#BAE6FD"
                    stroke="#07473C"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                </motion.g>
              )}

              {/* Zzz lama (mood "sleepy") */}
              {isSleepy && (
                <motion.g
                  animate={{ y: [0, -15], opacity: [0, 1, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeOut",
                  }}
                >
                  <text
                    x="285"
                    y="95"
                    fill="#07473C"
                    fontSize="24"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    Zzz
                  </text>
                </motion.g>
              )}

              {/* Zzz melayang untuk pose "sleeping" */}
              {isSleeping && (
                <>
                  <motion.g
                    animate={{ y: [0, -22], x: [0, 8], opacity: [0, 1, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.6,
                      ease: "easeOut",
                    }}
                  >
                    <text
                      x="300"
                      y="112"
                      fill="#07473C"
                      fontSize="32"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      Zzz
                    </text>
                  </motion.g>
                  <motion.g
                    animate={{ y: [0, -22], x: [0, 8], opacity: [0, 1, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.6,
                      ease: "easeOut",
                      delay: 1.3,
                    }}
                  >
                    <text
                      x="338"
                      y="78"
                      fill="#07473C"
                      fontSize="22"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      Zz
                    </text>
                  </motion.g>
                </>
              )}

              {/* Hati melayang (love) */}
              {isLove &&
                [
                  { x: 150, y: 120, d: 0 },
                  { x: 350, y: 110, d: 0.6 },
                  { x: 250, y: 80, d: 1.2 },
                ].map((h, i) => (
                  <g key={i} transform={`translate(${h.x} ${h.y})`}>
                    <motion.path
                      d="M 0 10 C -16 -2, -12 -14, 0 -6 C 12 -14, 16 -2, 0 10 Z"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                      animate={{ y: [0, -46], opacity: [0, 1, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: "easeOut",
                        delay: h.d,
                      }}
                    />
                  </g>
                ))}

              {/* Urat marah (angry) */}
              {isAngry && (
                <motion.path
                  d="M 318 118 Q 328 120 330 110 M 318 118 Q 320 128 330 126 M 342 118 Q 332 116 332 126 M 342 118 Q 340 108 330 110"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 0.35 }}
                />
              )}

              {/* Bintang berputar di atas kepala (dizzy) */}
              {isDizzy &&
                [0, 1, 2].map((k) => {
                  const xs = [
                    ...orbitX.slice(k * 2),
                    ...orbitX.slice(0, k * 2),
                  ];
                  const ys = [
                    ...orbitY.slice(k * 2),
                    ...orbitY.slice(0, k * 2),
                  ];
                  return (
                    <motion.g
                      key={k}
                      animate={{ x: [...xs, xs[0]], y: [...ys, ys[0]] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.4,
                        ease: "linear",
                      }}
                    >
                      <polygon
                        points="250,98 253,105 260,108 253,111 250,118 247,111 240,108 247,105"
                        fill="#FDE047"
                        stroke="#07473C"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                    </motion.g>
                  );
                })}

              {/* Efek kaget: garis radial + tetes keringat */}
              {isShocked && (
                <motion.g
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                >
                  <path
                    d="M 250 76 L 250 42 M 200 92 L 178 66 M 300 92 L 322 66"
                    fill="none"
                    stroke="#07473C"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 356 124 C 344 142, 350 158, 362 156 C 374 154, 372 140, 356 124 Z"
                    fill="#BAE6FD"
                    stroke="#07473C"
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                  />
                </motion.g>
              )}
            </>
          )}
        </motion.svg>
      </motion.div>
    </MascotAura>
  </div>
);
}

// Canonical mascot export & aliases for backwards compatibility
export const TilaMascot = TitoMascot;
export const BibiMascot = TitoMascot;
export default TitoMascot;
