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
import {
  resolveMascotGender,
  resolveAccessoryForGender,
  isAccessoryAllowedForGender,
  getDefaultAccessoryForGender,
} from "@/utils/mascotHelper";

export type TilaMood =
  | "idle"
  | "happy"
  | "thinking"
  | "sleepy"
  | "excited"
  | "sad"
  // ── Ekspresi / pose baru ──
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
  | "winking"; // kedip sebelah mata + kilau

export type TilaDirection = "front" | "right" | "left" | "back";

export type TilaAnimation =
  | "fly"
  | "float"
  | "bounce"
  | "perch"
  | "none"
  | "spinning" // badan berputar cepat 360°
  | "peckRight" // mematuk tanah ke kanan
  | "peckLeft"; // mematuk tanah ke kiri

export type TilaAccessoryType =
  | "none"
  | "peci"
  | "hairbow"
  | "flowercrown"
  | "glasses"
  | "crown";

export type TilaHoldItem = "star" | "ball" | "heart";

// Backward compatibility aliases
export type BibiMood = TilaMood;
export type BibiDirection = TilaDirection;
export type BibiAnimation = TilaAnimation;
export type BibiAccessoryType = TilaAccessoryType | "hijab";

export interface TilaMascotProps {
  size?: number | string;
  mood?: TilaMood;
  direction?: TilaDirection;
  animation?: TilaAnimation;
  talking?: boolean;
  speech?: string;
  followCursor?: boolean;
  autoDirection?: boolean;
  className?: string;
  onTap?: () => void;
  rotation?: number;
  autoRotate?: boolean;
  accessory?: TilaAccessoryType;
  gender?: "boy" | "girl";
  /** Objek yang dipegang saat mood="holding" (default: "star") */
  holdItem?: TilaHoldItem;
}

export type BibiMascotProps = TilaMascotProps;

export function TilaMascot({
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
}: TilaMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lookOffset, setLookOffset] = useState({ x: 0, y: 0 });
  const [dynamicDir, setDynamicDir] = useState<TilaDirection | null>(null);
  const rotationValue = useMotionValue(rotation || 0);

  // Orbit bintang untuk mood "dizzy"
  const orbitX = [60, 30, -30, -60, -30, 30];
  const orbitY = [0, 10, 10, 0, -10, -10];

  const storeGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const storeAccessory = useEconomyStore((s) => s.equippedAccessory);

  // === LOGIKA GENDER & AKSESORIS KETAT (DARI FILE 2) ===
  const effectiveGender: "boy" | "girl" =
    gender ?? resolveMascotGender(storeGender);
  const isGirl = effectiveGender === "girl";

  let rawAccessory: TilaAccessoryType;
  if (accessory !== undefined) {
    rawAccessory = accessory;
  } else if (gender !== undefined) {
    // Jika gender ditentukan secara eksplisit (seperti di LoginPage atau TitoMascot):
    // Gunakan storeAccessory HANYA jika kompatibel dengan gender tersebut!
    if (
      storeAccessory &&
      isAccessoryAllowedForGender(storeAccessory, effectiveGender)
    ) {
      rawAccessory = storeAccessory as TilaAccessoryType;
    } else {
      rawAccessory = getDefaultAccessoryForGender(
        effectiveGender,
      ) as TilaAccessoryType;
    }
  } else if (storeAccessory && storeAccessory !== "none") {
    rawAccessory = storeAccessory as TilaAccessoryType;
  } else {
    rawAccessory = getDefaultAccessoryForGender(
      effectiveGender,
    ) as TilaAccessoryType;
  }

  // Validasi ketat: Tila (betina) TIDAK AKAN PERNAH memakai peci!
  // Tito (jantan) TIDAK AKAN PERNAH memakai hairbow atau flowercrown!
  const resolvedAccessory: TilaAccessoryType = resolveAccessoryForGender(
    rawAccessory,
    effectiveGender,
  ) as TilaAccessoryType;

  const renderAccessory = (view: "front" | "side" | "back") => {
    if (resolvedAccessory === "none") return null;

    if (resolvedAccessory === "peci") {
      if (view === "front") {
        return (
          <g id="accessory-peci-front">
            {/* Songkok velvet body with sticker border */}
            <path
              d="M 198 142 L 204 96 Q 250 90 296 96 L 302 142 Q 250 148 198 142 Z"
              fill="#134E4A"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Bottom golden embroidered trim */}
            <path
              d="M 199 137 Q 250 143 301 137"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Subtle velvet highlight lines */}
            <path
              d="M 218 100 L 214 136 M 282 100 L 286 136"
              stroke="#FFFFFF"
              strokeOpacity="0.18"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Central golden star emblem */}
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
            {/* Songkok side view body */}
            <path
              d="M 210 142 L 216 96 Q 262 90 306 96 L 312 142 Q 262 148 210 142 Z"
              fill="#134E4A"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Bottom golden embroidered trim */}
            <path
              d="M 211 137 Q 262 143 311 137"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Side golden emblem */}
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
          <g id="accessory-hairbow-front" transform="translate(286, 138)">
            {/* Left Bow Loop */}
            <path
              d="M 0 0 C -22 -18, -32 4, -4 10 Z"
              fill="#FF6B6B"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M -16 -6 C -18 2, -12 6, -6 6"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Right Bow Loop */}
            <path
              d="M 0 0 C 22 -18, 32 4, 4 10 Z"
              fill="#FF6B6B"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M 16 -6 C 18 2, 12 6, 6 6"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Streamer Ribbons */}
            <path
              d="M -4 8 L -14 30 L -4 24 L 0 10 Z"
              fill="#FB7185"
              stroke="#07473C"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M 4 8 L 14 30 L 4 24 L 0 10 Z"
              fill="#FB7185"
              stroke="#07473C"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Center Knot */}
            <ellipse
              cx="0"
              cy="2"
              rx="7"
              ry="8"
              fill="#F43F5E"
              stroke="#07473C"
              strokeWidth="4"
            />
            <circle cx="-2" cy="0" r="2" fill="#FFFFFF" opacity="0.9" />
          </g>
        );
      }
      if (view === "side") {
        return (
          <g id="accessory-hairbow-side" transform="translate(268, 136)">
            {/* Side Bow Loops */}
            <path
              d="M 0 0 C -20 -16, -28 4, -4 9 Z"
              fill="#FF6B6B"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M 0 0 C 20 -16, 28 4, 4 9 Z"
              fill="#FF6B6B"
              stroke="#07473C"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Ribbon Tail */}
            <path
              d="M -2 7 L -10 28 L -2 22 L 2 9 Z"
              fill="#FB7185"
              stroke="#07473C"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Center Knot */}
            <ellipse
              cx="0"
              cy="2"
              rx="7"
              ry="7.5"
              fill="#F43F5E"
              stroke="#07473C"
              strokeWidth="4"
            />
            <circle cx="-2" cy="0" r="2" fill="#FFFFFF" opacity="0.9" />
          </g>
        );
      }
      return (
        <g id="accessory-hairbow-back" transform="translate(286, 138)">
          <path
            d="M 0 0 C -22 -18, -32 4, -4 10 Z"
            fill="#FF6B6B"
            stroke="#07473C"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path
            d="M 0 0 C 22 -18, 32 4, 4 10 Z"
            fill="#FF6B6B"
            stroke="#07473C"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          <path
            d="M -4 8 L -14 30 L -4 24 L 0 10 Z"
            fill="#FB7185"
            stroke="#07473C"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M 4 8 L 14 30 L 4 24 L 0 10 Z"
            fill="#FB7185"
            stroke="#07473C"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <ellipse
            cx="0"
            cy="2"
            rx="7"
            ry="8"
            fill="#F43F5E"
            stroke="#07473C"
            strokeWidth="4"
          />
        </g>
      );
    }

    if (resolvedAccessory === "flowercrown") {
      if (view === "front") {
        return (
          <g id="accessory-flowercrown-front">
            {/* Green Leafy Vine Base */}
            <path
              d="M 198 152 Q 250 162 302 152"
              fill="none"
              stroke="#059669"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Leaves */}
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
            {/* Flower 1 - Left Coral */}
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
            {/* Flower 2 - Center Left White */}
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
            {/* Flower 3 - Center Right Golden Yellow */}
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
            {/* Flower 4 - Right Coral */}
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
            {/* Side Vine */}
            <path
              d="M 215 146 Q 262 155 310 146"
              fill="none"
              stroke="#059669"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Leaves */}
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
            {/* Side Flowers */}
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

  // ── Flag pose & ekspresi baru ──
  const isLaughing = mood === "laughing";
  const isShocked = mood === "shocked";
  const isShy = mood === "shy";
  const isGreeting = mood === "greeting";
  const isHolding = mood === "holding";
  const isSleeping = mood === "sleeping";
  const isSpinning = animation === "spinning";
  const isLove = mood === "love";
  const isAngry = mood === "angry";
  const isCrying = mood === "crying";
  const isDizzy = mood === "dizzy";
  const isWinking = mood === "winking";
  const hasEyeFx = isLove || isAngry || isCrying || isDizzy || isWinking;

  // Pose yang memakai sayap "overlay" di depan badan (memegang perut/wajah/objek)
  const hasWingOverlay = isLaughing || isShy || isHolding;
  // Sayap asli dilipat saat pose overlay / tidur / bertengger / mematuk
  const wingsFolded = isPerching || isSleeping || hasWingOverlay || isPecking;
  // Mata: "^ ^" saat tertawa, garis melengkung saat tidur
  const eyeShape: "open" | "laugh" | "sleep" = isLaughing
    ? "laugh"
    : isSleepy || isSleeping
      ? "sleep"
      : "open";
  const eyeHidden = isLaughing || isSleeping;
  const eyeScale = isShocked ? 1.2 : 1;
  const pupilScale = isShocked ? 0.6 : 1;
  const cheekExtra = isShy || isLove ? 4.5 : 0;

  // Ujung paruh bawah pada tampak samping (disesuaikan per ekspresi)
  const sideBeakTip = isLaughing
    ? { x: 323, y: 258 }
    : isGreeting
      ? { x: 311, y: 232 }
      : isSleeping
        ? { x: 304, y: 228 }
        : { x: 317, y: 244 };

  const isSideView = finalDirection === "right" || finalDirection === "left";
  const isFlippedLeft = finalDirection === "left";

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

  const flapDuration = isExcited
    ? 0.18
    : isThinking || isSleepy || isSleeping || isSad
      ? 0.65
      : 0.28;
  const floatDuration = isExcited ? 1.1 : isThinking || isSleepy ? 2.6 : 1.6;

  const bodyAnimate = isStatic
    ? { y: 0, rotate: 0 }
    : isSpinning
      ? {
          // Bola putar: berputar horizontal (sumbu Y, seperti gasing/piringan),
          // bukan menggelinding, sambil memantul naik-turun
          y: [0, -28, 0],
          rotateY: [0, 360],
          transformPerspective: 900,
          transition: {
            y: { repeat: Infinity, duration: 0.8, ease: ["easeOut", "easeIn"] },
            rotateY: { repeat: Infinity, duration: 0.8, ease: "linear" },
          } as const,
        }
      : isLaughing
        ? {
            // Terguncang karena tertawa
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
              // Gemetar kaget
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
                // Napas pelan, kepala sedikit miring
                y: [0, -3, 0],
                rotate: [3, 6, 3],
                transition: {
                  repeat: Infinity,
                  duration: 3.2,
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
                        y: isThinking ? [0, -6, 0] : [0, -14, 0],
                        rotate: isExcited ? [-2, 3, -2] : [-1, 1.5, -1],
                        transition: {
                          repeat: Infinity,
                          duration: floatDuration,
                          ease: "easeInOut",
                        } as const,
                      };

  // Sudut & jarak mematuk. Pivot rotasi ada di kaki (lihat style pada motion.svg).
  const peckAngle = 52 * peckSign;
  const poseBodyAnimate: TargetAndTransition | null = isPecking
    ? {
        // dua patukan, lalu jeda sebentar
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
          transition: { repeat: Infinity, duration: 0.9, ease: "easeInOut" },
        }
      : isAngry
        ? {
            x: [-3, 3, -3],
            rotate: [-2, 2, -2],
            transition: { repeat: Infinity, duration: 0.14, ease: "easeInOut" },
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
    : isSpinning
      ? {
          rotate: [-10, 18, -10],
          transition: {
            repeat: Infinity,
            duration: 0.35,
            ease: "easeInOut",
          } as const,
        }
      : isShocked
        ? {
            // Terangkat ke atas + bergetar
            rotate: [30, 40, 30],
            transition: {
              repeat: Infinity,
              duration: 0.16,
              ease: "easeInOut",
            } as const,
          }
        : isGreeting
          ? {
              // Sayap kiri istirahat, sayap kanan yang melambai
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

  // Sayap kanan (di tampak depan: sisi kanan layar) — ini yang melambai saat greeting
  const rightWingAnimate = isStatic
    ? { rotate: 0 }
    : isSpinning
      ? {
          rotate: [10, -18, 10],
          transition: {
            repeat: Infinity,
            duration: 0.35,
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
              // Melambai di atas kepala
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

  const tailAnimate = isStatic
    ? { rotate: 0 }
    : {
        rotate: [-5, 5, -5],
        transition: {
          repeat: Infinity,
          duration: flapDuration * 2,
          ease: "easeInOut",
        } as const,
      };

  const legAnimate = isStatic
    ? { rotate: 0 }
    : {
        rotate: isThinking ? [-2, 2, -2] : [-5, 7, -5],
        transition: {
          repeat: Infinity,
          duration: floatDuration,
          ease: "easeInOut",
        } as const,
      };

  const crestAnimate = isStatic
    ? { rotate: 0 }
    : {
        rotate: [-4, 5, -4],
        transition: {
          repeat: Infinity,
          duration: floatDuration * 0.8,
          ease: "easeInOut",
        } as const,
      };

  // Arah pandang: shy = melirik ke samping, pecking = melihat ke depan-bawah
  const moodEyeX = isPecking
    ? 5
    : isShy
      ? -6
      : isThinking
        ? 4
        : isSad || isCrying
          ? -2
          : 0;
  const moodEyeY = isPecking
    ? 5
    : isShy
      ? 2
      : isThinking
        ? -5
        : isSad
          ? 4
          : isCrying
            ? 5
            : 0;
  const eyeOffsetX = moodEyeX + (isFlippedLeft ? -lookOffset.x : lookOffset.x);
  const eyeOffsetY = moodEyeY + lookOffset.y;

  // ─────────────────────────────────────────────
  // Helper SVG untuk pose baru (gaya neo-brutalism)
  // ─────────────────────────────────────────────

  // Mata "^ ^" (tertawa)
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

  // Satu sayap "overlay" (putih + ujung hijau) — sisi kiri layar
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

  // Objek yang dipegang (bintang / bola / hati) — titik pusat di (0,0)
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

  // Sayap overlay untuk memegang perut / objek di dada (sisi kiri layar, dicerminkan untuk kanan)
  const holdWingBase =
    "M 150 252 C 142 300, 186 330, 238 318 C 246 304, 236 288, 216 276 C 196 264, 170 248, 150 252 Z";
  const holdWingTip =
    "M 166 290 C 184 312, 212 318, 236 312 C 238 304, 232 296, 224 290 C 206 294, 184 294, 166 290 Z";
  // Sayap menutupi wajah (malu)
  const shyWingBase =
    "M 158 288 C 152 256, 184 234, 216 240 C 242 244, 252 268, 246 292 C 240 316, 192 326, 168 310 C 162 304, 159 296, 158 288 Z";
  const shyWingTip =
    "M 214 242 C 240 246, 250 268, 246 292 C 240 316, 200 324, 180 316 C 214 308, 232 280, 214 242 Z";

  // Tampak samping
  const sideWingBase =
    "M 200 266 C 192 312, 248 342, 298 324 C 304 304, 288 286, 262 274 C 240 264, 216 258, 200 266 Z";
  const sideWingTip =
    "M 214 304 C 234 324, 266 330, 294 320 C 292 310, 284 300, 272 296 C 254 300, 232 302, 214 304 Z";
  const sideShyWingBase =
    "M 222 270 C 222 240, 262 226, 298 234 C 322 240, 322 272, 296 290 C 268 306, 228 298, 222 270 Z";
  const sideShyWingTip =
    "M 296 236 C 322 242, 322 272, 296 290 C 276 300, 250 300, 236 292 C 274 284, 294 262, 296 236 Z";

  // Efek mata untuk love / angry / crying / dizzy / winking.
  // Digambar di atas mata asli, di dalam grup wajah yang sama.
  const renderEyeFx = (view: "front" | "side") => {
    if (!hasEyeFx) return null;

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
          // Winking: hanya satu mata yang ditutup, mata lain tetap normal
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
                    {/* Kelopak miring + alis menukik ke arah tengah wajah */}
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
                    {/* Alis sedih: bagian dalam terangkat */}
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
      if (isLaughing) {
        // Kedua sayap memegang perut sambil terguncang
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
        // Kedua sayap menangkup pipi / menutupi bagian bawah wajah
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
            {/* Serpihan terpental tiap patukan (sinkron dengan animasi badan) */}
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
          animate={isStatic ? bodyAnimate : (poseBodyAnimate ?? bodyAnimate)}
          style={isPecking ? { transformOrigin: "50% 66%" } : undefined}
          className="overflow-visible"
        >
          {isSideView && (
            <motion.g
              initial={false}
              animate={{ scaleX: isFlippedLeft ? -1 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{ transformOrigin: "250px 250px" }}
            >
              <g opacity="0.85">
                {!isStatic && !isPerching && (
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

                <g transform="translate(-14, 14)" opacity="0.65">
                  <path
                    d="M 160 278 C 120 268, 82 242, 72 255 C 63 266, 78 286, 92 288 C 68 282, 62 296, 72 308 C 68 315, 68 332, 85 335 C 115 338, 150 325, 178 310 Z"
                    fill="#CFD8B6"
                  />
                  <path
                    d="M 80 130 C 68 136, 78 168, 82 162 C 70 172, 82 198, 102 212 C 85 216, 88 238, 125 250 C 118 262, 138 278, 165 274 L 204 238 Z"
                    fill="#CFD8B6"
                  />
                  <ellipse cx="255" cy="240" rx="106" ry="105" fill="#CFD8B6" />
                  <path
                    d="M 218 324 C 202 348, 182 360, 162 363 C 152 365, 147 378, 149 392 C 151 404, 162 400, 167 385 C 170 377, 168 373, 176 371 C 198 365, 218 348, 230 330 Z"
                    fill="#CFD8B6"
                  />
                  <path
                    d="M 258 344 C 245 365, 225 375, 210 378 C 202 380, 198 392, 200 405 C 202 415, 212 412, 216 398 C 219 390, 218 386, 225 384 C 245 378, 262 365, 273 345 Z"
                    fill="#CFD8B6"
                  />
                </g>
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
                {isGirl ? (
                  <g id="cendrawasih-tail-side">
                    <path
                      d="M 155 278 C 105 255, 45 270, 32 310 C 22 340, 52 368, 92 355 C 122 345, 155 315, 175 305 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 135 285 C 95 270, 55 285, 45 318 C 38 338, 62 355, 92 342 C 118 330, 145 308, 160 300 Z"
                      fill="#00B894"
                      stroke="#07473C"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="38"
                      cy="326"
                      r="6"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 148 290 C 95 280, 25 320, 15 365 C 10 385, 28 395, 38 385 C 48 375, 75 340, 125 320"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="20"
                      cy="380"
                      r="5"
                      fill="#FF6B6B"
                      stroke="#07473C"
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
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 95 288 C 68 281, 61 295, 71 307 C 81 317, 108 318, 130 315 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 83 313 C 68 315, 68 331, 86 335 C 112 338, 146 328, 175 313 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 155 278 C 132 271, 112 263, 106 272 C 101 279, 114 290, 136 294 C 112 290, 102 295, 105 304 C 107 312, 124 314, 142 313 C 118 315, 108 320, 112 329 C 116 334, 148 326, 175 313 Z"
                      fill="#FFFFFF"
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
                    fill="#00B894"
                    stroke="#07473C"
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                  />
                </motion.g>
              )}

              <ellipse
                cx="255"
                cy="240"
                rx="106"
                ry="105"
                fill="#FBBF24"
                stroke="#07473C"
                strokeWidth="4.5"
              />
              <path
                d="M 153 268 C 175 305, 225 335, 305 332 C 262 352, 185 342, 153 268 Z"
                fill="#EAA012"
              />
              <ellipse
                cx="255"
                cy="240"
                rx="106"
                ry="105"
                fill="none"
                stroke="#07473C"
                strokeWidth="4.5"
              />

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
                  fill="#00937D"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 131 158 C 110 143, 90 124, 80 130 C 68 136, 77 167, 98 185 C 109 194, 120 199, 130 202 C 125 186, 126 170, 131 158 Z"
                  fill="#00B894"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                {isGirl && (
                  <g id="cendrawasih-side-wing-plumes">
                    <path
                      d="M 145 240 C 115 270, 92 315, 106 328 C 118 338, 138 318, 155 285 C 168 262, 178 245, 185 238 Z"
                      fill="#00B894"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 100 322 C 102 334, 114 338, 122 330 C 118 322, 110 318, 100 322 Z"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 165 248 Q 135 285 116 320"
                      fill="none"
                      stroke="#07473C"
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
                <circle cx="346" cy="218" r={12 + cheekExtra} fill="#FF5E6C" />
                {isShy && (
                  <>
                    <circle cx="240" cy="225" r="8" fill="#F43F5E" />
                    <circle cx="346" cy="218" r="7" fill="#F43F5E" />
                  </>
                )}

                <g
                  transform={`translate(255, 190) rotate(-10) scale(${eyeScale})`}
                >
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="25"
                    ry="27"
                    fill={eyeHidden ? "#FBBF24" : "#FFFFFF"}
                    stroke={eyeHidden ? "none" : "#07473C"}
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
                      animate={{
                        x: eyeOffsetX,
                        y: eyeOffsetY,
                        scale: pupilScale,
                      }}
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
                      animate={{
                        x: eyeOffsetX,
                        y: eyeOffsetY,
                        scale: pupilScale,
                      }}
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
                    talking || isLaughing
                      ? { scaleY: [1, 1.18, 0.92, 1.15, 1] }
                      : isExcited
                        ? { scale: [1, 1.06, 1] }
                        : {}
                  }
                  transition={
                    talking || isLaughing
                      ? { repeat: Infinity, duration: 0.25 }
                      : { repeat: Infinity, duration: 1.2 }
                  }
                  style={{ transformOrigin: "285px 212px" }}
                >
                  {isShocked ? (
                    <>
                      {/* Paruh membentuk huruf "O" */}
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
                {!isStatic && !isPerching && (
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
                <ellipse
                  cx="250"
                  cy="252"
                  rx="112"
                  ry="108"
                  fill="#CFD8B6"
                  opacity="0.6"
                />
              </g>

              <motion.g
                animate={tailAnimate}
                style={{ transformOrigin: "250px 330px" }}
              >
                {isGirl ? (
                  <g id="cendrawasih-tail-front">
                    <path
                      d="M 216 330 C 190 365, 185 415, 218 435 C 235 444, 265 444, 282 435 C 315 415, 310 365, 284 330 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 228 330 C 210 360, 208 398, 232 418 C 242 426, 258 426, 268 418 C 292 398, 290 360, 272 330 Z"
                      fill="#00B894"
                      stroke="#07473C"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 228 412 Q 250 436 272 412 Q 250 422 228 412 Z"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 250 334 L 250 422"
                      fill="none"
                      stroke="#07473C"
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
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="184"
                      cy="452"
                      r="5"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 268 350 C 310 390, 335 435, 322 450 C 312 460, 298 452, 294 438 C 290 422, 278 392, 262 362"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="316"
                      cy="452"
                      r="5"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="2.5"
                    />
                  </g>
                ) : (
                  <>
                    <path
                      d="M 225 330 C 215 358, 222 374, 235 370 C 238 382, 262 382, 265 370 C 278 374, 285 358, 275 330 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 232 330 C 226 348, 232 356, 240 353 C 243 362, 257 362, 260 353 C 268 356, 274 348, 268 330 Z"
                      fill="#FFFFFF"
                      stroke="#07473C"
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
                  fill="#00B894"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                {isGirl && (
                  <g id="cendrawasih-left-wing-plumes">
                    <path
                      d="M 120 248 C 95 285, 78 330, 92 342 C 104 352, 122 332, 138 300 C 148 280, 158 262, 164 252 Z"
                      fill="#00B894"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 132 250 C 114 282, 102 318, 112 328 C 120 334, 132 320, 145 292 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 86 336 C 88 348, 100 352, 108 344 C 104 336, 96 332, 86 336 Z"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 150 262 Q 120 300 102 336"
                      fill="none"
                      stroke="#07473C"
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
                  fill="#FFFFFF"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 416 210 C 408 215, 400 219, 393 221 M 396 249 C 388 251, 381 251, 375 251"
                  fill="none"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 335 202 C 358 187, 380 172, 398 162 C 404 180, 399 200, 382 216 C 368 228, 352 234, 337 236 Z"
                  fill="#00937D"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 398 162 C 414 147, 431 130, 441 135 C 450 140, 443 168, 424 187 C 411 199, 396 208, 382 216 C 399 200, 404 180, 398 162 Z"
                  fill="#00B894"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                {isGirl && (
                  <g id="cendrawasih-right-wing-plumes">
                    <path
                      d="M 380 248 C 405 285, 422 330, 408 342 C 396 352, 378 332, 362 300 C 352 280, 342 262, 336 252 Z"
                      fill="#00B894"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 368 250 C 386 282, 398 318, 388 328 C 380 334, 368 320, 355 292 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 414 336 C 412 348, 400 352, 392 344 C 396 336, 404 332, 414 336 Z"
                      fill="#FF6B6B"
                      stroke="#07473C"
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
                    fill="#00B894"
                    stroke="#07473C"
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
                fill="#FBBF24"
                stroke="#07473C"
                strokeWidth="4.5"
              />
              <path
                d="M 152 275 C 180 322, 320 322, 348 275 C 325 342, 175 342, 152 275 Z"
                fill="#EAA012"
              />
              <ellipse
                cx="250"
                cy="240"
                rx="105"
                ry="105"
                fill="none"
                stroke="#07473C"
                strokeWidth="4.5"
              />

              <motion.g
                animate={legAnimate}
                style={{ transformOrigin: "218px 332px" }}
              >
                <path
                  d="M 212 330 C 206 355, 196 372, 186 382 C 178 390, 182 406, 192 406 C 202 406, 206 392, 208 384 C 216 368, 222 350, 225 332 C 226 325, 214 323, 212 330 Z"
                  fill="#FF5E6C"
                  stroke="#07473C"
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
                  fill="#FF5E6C"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
              </motion.g>

              <motion.g
                animate={{ x: eyeOffsetX * 0.8, y: eyeOffsetY * 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <path d="M 234 228 L 266 228 L 250 256 Z" fill="#EAA012" />
                <circle
                  cx="182"
                  cy="226"
                  r={13.5 + cheekExtra}
                  fill="#FF5E6C"
                />
                <circle
                  cx="318"
                  cy="226"
                  r={13.5 + cheekExtra}
                  fill="#FF5E6C"
                />
                {isShy && (
                  <>
                    {/* Pipi merona lebih tebal */}
                    <circle cx="182" cy="226" r="9" fill="#F43F5E" />
                    <circle cx="318" cy="226" r="9" fill="#F43F5E" />
                  </>
                )}

                <g transform={`translate(206, 192) scale(${eyeScale})`}>
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="25"
                    ry="27"
                    fill={eyeHidden ? "#FBBF24" : "#FFFFFF"}
                    stroke={eyeHidden ? "none" : "#07473C"}
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
                      animate={{
                        x: eyeOffsetX,
                        y: eyeOffsetY,
                        scale: pupilScale,
                      }}
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
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="25"
                    ry="27"
                    fill={eyeHidden ? "#FBBF24" : "#FFFFFF"}
                    stroke={eyeHidden ? "none" : "#07473C"}
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
                      animate={{
                        x: eyeOffsetX,
                        y: eyeOffsetY,
                        scale: pupilScale,
                      }}
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
                    talking || isLaughing
                      ? { scaleY: [1, 1.2, 0.9, 1.15, 1] }
                      : isExcited
                        ? { scale: [1, 1.07, 1] }
                        : {}
                  }
                  transition={
                    talking || isLaughing
                      ? { repeat: Infinity, duration: 0.25 }
                      : { repeat: Infinity, duration: 1.2 }
                  }
                  style={{ transformOrigin: "250px 215px" }}
                >
                  {isShocked ? (
                    <>
                      {/* Paruh membentuk huruf "O" */}
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
                  ) : isLaughing ? (
                    <>
                      {/* Paruh terbuka lebar */}
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
                  ) : isGreeting ? (
                    <>
                      {/* Paruh sedikit tersenyum */}
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
                      {/* Paruh tertutup santai */}
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
              <ellipse
                cx="250"
                cy="252"
                rx="112"
                ry="108"
                fill="#CFD8B6"
                opacity="0.6"
              />

              <motion.g
                animate={legAnimate}
                style={{ transformOrigin: "218px 332px" }}
              >
                <path
                  d="M 212 330 C 206 355, 196 372, 186 382 C 178 390, 182 406, 192 406 C 202 406, 206 392, 208 384 C 216 368, 222 350, 225 332 C 226 325, 214 323, 212 330 Z"
                  fill="#FF5E6C"
                  stroke="#07473C"
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
                  fill="#FF5E6C"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
              </motion.g>

              {resolvedAccessory !== "peci" && (
                <motion.g
                  animate={crestAnimate}
                  style={{ transformOrigin: "250px 133px" }}
                >
                  <path
                    d="M 244 134 C 228 128, 220 115, 229 109 C 235 105, 243 113, 246 118 C 241 102, 244 91, 253 92 C 261 92, 262 104, 258 119 C 264 109, 273 105, 277 112 C 281 119, 270 131, 255 134 Z"
                    fill="#00B894"
                    stroke="#07473C"
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
                fill="#FBBF24"
                stroke="#07473C"
                strokeWidth="4.5"
              />
              <path
                d="M 148 265 C 175 325, 325 325, 352 265 C 332 342, 168 342, 148 265 Z"
                fill="#EAA012"
              />
              <ellipse
                cx="250"
                cy="240"
                rx="105"
                ry="105"
                fill="none"
                stroke="#07473C"
                strokeWidth="4.5"
              />

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
                  d="M 168 200 C 142 185, 120 170, 102 162 C 96 180, 101 200, 118 216 C 134 230, 155 238, 172 238 Z"
                  fill="#00937D"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 102 162 C 86 147, 69 130, 59 135 C 50 140, 57 168, 76 187 C 89 199, 104 208, 118 216 C 101 200, 96 180, 102 162 Z"
                  fill="#00B894"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                {isGirl && (
                  <g id="cendrawasih-left-wing-plumes-back">
                    <path
                      d="M 120 248 C 95 285, 78 330, 92 342 C 104 352, 122 332, 138 300 C 148 280, 158 262, 164 252 Z"
                      fill="#00B894"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 86 336 C 88 348, 100 352, 108 344 C 104 336, 96 332, 86 336 Z"
                      fill="#FF6B6B"
                      stroke="#07473C"
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
                  fill="#FFFFFF"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 332 200 C 358 185, 380 170, 398 162 C 404 180, 399 200, 382 216 C 366 230, 345 238, 328 238 Z"
                  fill="#00937D"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 398 162 C 414 147, 431 130, 441 135 C 450 140, 443 168, 424 187 C 411 199, 396 208, 382 216 C 399 200, 404 180, 398 162 Z"
                  fill="#00B894"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                {isGirl && (
                  <g id="cendrawasih-right-wing-plumes-back">
                    <path
                      d="M 380 248 C 405 285, 422 330, 408 342 C 396 352, 378 332, 362 300 C 352 280, 342 262, 336 252 Z"
                      fill="#00B894"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 414 336 C 412 348, 400 352, 392 344 C 396 336, 404 332, 414 336 Z"
                      fill="#FF6B6B"
                      stroke="#07473C"
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
                {isGirl ? (
                  <g id="cendrawasih-tail-back">
                    <path
                      d="M 216 305 C 190 345, 185 395, 218 425 C 235 436, 265 436, 282 425 C 315 395, 310 345, 284 305 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 228 305 C 210 340, 208 380, 232 405 C 242 415, 258 415, 268 405 C 292 380, 290 340, 272 305 Z"
                      fill="#00B894"
                      stroke="#07473C"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 228 398 Q 250 422 272 398 Q 250 410 228 398 Z"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 232 325 C 190 365, 165 410, 178 425 C 188 435, 202 427, 206 413 C 210 397, 222 367, 238 337"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="184"
                      cy="427"
                      r="5"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 268 325 C 310 365, 335 410, 322 425 C 312 435, 298 427, 294 413 C 290 397, 278 367, 262 337"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="316"
                      cy="427"
                      r="5"
                      fill="#FF6B6B"
                      stroke="#07473C"
                      strokeWidth="2.5"
                    />
                  </g>
                ) : (
                  <>
                    <path
                      d="M 235 305 C 205 325, 185 355, 198 368 C 208 378, 228 362, 242 342 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 265 305 C 295 325, 315 355, 302 368 C 292 378, 272 362, 258 342 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 238 310 C 232 348, 236 378, 250 380 C 264 378, 268 348, 262 310 Z"
                      fill="#00937D"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 232 300 C 214 316, 206 335, 214 342 C 222 348, 234 338, 240 328 C 238 345, 242 356, 250 356 C 258 356, 262 345, 260 328 C 266 338, 278 348, 286 342 C 294 335, 286 316, 268 300 Q 250 292 232 300 Z"
                      fill="#FFFFFF"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinejoin="round"
                    />
                  </>
                )}
              </motion.g>
              {renderAccessory("back")}
            </motion.g>
          )}

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
              <path d="M 245 64 L 261 64 L 258 74 L 248 74 Z" fill="#07473C" />
              <path
                d="M 253 18 L 253 8 M 225 32 L 215 24 M 281 32 L 291 24 M 220 52 L 208 52 M 286 52 L 298 52"
                stroke="#FBBF24"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </motion.g>
          )}

          {/* Zzz lama (mood "sleepy") — tidak diubah */}
          {isSleepy && (
            <motion.g
              animate={{ y: [0, -15], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
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
              const xs = [...orbitX.slice(k * 2), ...orbitX.slice(0, k * 2)];
              const ys = [...orbitY.slice(k * 2), ...orbitY.slice(0, k * 2)];
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
        </motion.svg>
      </motion.div>
    </div>
  );
}

// Aliases for compatibility
export const BibiMascot = TilaMascot;
export const TitoMascot = (props: TilaMascotProps) => (
  <TilaMascot gender="boy" {...props} />
);
