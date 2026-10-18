import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

export type NgajiBuddyMood =
  | "idle"
  | "happy"
  | "thinking"
  | "sleepy"
  | "excited"
  | "sad";
export type NgajiBuddyDirection = "front" | "right" | "left" | "back";
export type NgajiBuddyAnimation = "fly" | "float" | "bounce" | "perch" | "none";

export interface NgajiBuddyMascotProps {
  size?: number | string;
  mood?: NgajiBuddyMood;
  direction?: NgajiBuddyDirection;
  animation?: NgajiBuddyAnimation;
  talking?: boolean;
  speech?: string;
  followCursor?: boolean;
  autoDirection?: boolean;
  className?: string;
  onTap?: () => void;
  rotation?: number;
  autoRotate?: boolean;
}

export function NgajiBuddyMascot({
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
}: NgajiBuddyMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lookOffset, setLookOffset] = useState({ x: 0, y: 0 });
  const [dynamicDir, setDynamicDir] = useState<NgajiBuddyDirection | null>(null);

  const rotationValue = useMotionValue(rotation || 0);
  const [activeView, setActiveView] = useState<NgajiBuddyDirection>(direction);

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

  const scaleXValue = useTransform(rotationValue, (latest) => {
    let normalized = latest % 360;
    if (normalized < 0) normalized += 360;
    const rad = (normalized * Math.PI) / 180;
    return Math.max(Math.abs(Math.cos(rad)), 0.15);
  });

  const rotateYValue = useTransform(rotationValue, (latest) => {
    let normalized = latest % 360;
    if (normalized < 0) normalized += 360;
    const rad = (normalized * Math.PI) / 180;
    return Math.sin(rad) * 25;
  });

  const opacityValue = useTransform(rotationValue, (latest) => {
    let normalized = latest % 360;
    if (normalized < 0) normalized += 360;
    const rad = (normalized * Math.PI) / 180;
    return 0.15 + 0.85 * Math.abs(Math.cos(2 * rad));
  });

  const manualDirection = autoDirection && dynamicDir ? dynamicDir : direction;
  const isRotationActive = rotation !== undefined || autoRotate;
  const finalDirection = isRotationActive ? activeView : manualDirection;

  const dimension = typeof size === "number" ? `${size}px` : size;

  const isThinking = mood === "thinking";
  const isSleepy = mood === "sleepy";
  const isSad = mood === "sad";
  const isExcited = mood === "excited" || mood === "happy";
  const isStatic = animation === "none";
  const isPerching = animation === "perch";

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

  const waveDuration = isExcited
    ? 0.35
    : isThinking || isSleepy || isSad
      ? 0.9
      : 0.55;
  const floatDuration = isExcited ? 0.9 : isThinking || isSleepy ? 2.4 : 1.4;

  const bodyAnimate = isStatic
    ? { y: 0, rotate: 0 }
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

  const waveArmAnimate = isStatic
    ? { rotate: 0 }
    : isPerching
      ? {
          rotate: [-3, 3, -3],
          transition: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          } as const,
        }
      : {
          rotate: isThinking ? [-4, 4, -4] : [-10, 14, -10],
          transition: {
            repeat: Infinity,
            duration: waveDuration,
            ease: "easeInOut",
          } as const,
        };

  const bookArmAnimate = isStatic
    ? { rotate: 0, y: 0 }
    : {
        rotate: [-2, 3, -2],
        y: [0, -3, 0],
        transition: {
          repeat: Infinity,
          duration: floatDuration,
          ease: "easeInOut",
        } as const,
      };

  const leftLegAnimate = isStatic
    ? { rotate: 0 }
    : {
        rotate: isThinking ? [-2, 2, -2] : [-8, 10, -8],
        transition: {
          repeat: Infinity,
          duration: floatDuration * 0.8,
          ease: "easeInOut",
        } as const,
      };

  const rightLegAnimate = isStatic
    ? { rotate: 0 }
    : {
        rotate: isThinking ? [2, -2, 2] : [10, -8, 10],
        transition: {
          repeat: Infinity,
          duration: floatDuration * 0.8,
          ease: "easeInOut",
        } as const,
      };

  const headAnimate = isStatic
    ? { rotate: 0 }
    : {
        rotate: isThinking ? [-5, -2, -5] : [-2, 3, -2],
        transition: {
          repeat: Infinity,
          duration: floatDuration * 1.1,
          ease: "easeInOut",
        } as const,
      };

  const moodEyeX = isThinking ? 4 : isSad ? -2 : 0;
  const moodEyeY = isThinking ? -5 : isSad ? 4 : 0;
  const eyeOffsetX = moodEyeX + (isFlippedLeft ? -lookOffset.x : lookOffset.x);
  const eyeOffsetY = moodEyeY + lookOffset.y;

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

      <motion.div
        style={{
          width: "100%",
          height: "100%",
          scaleX: isRotationActive ? scaleXValue : 1,
          rotateY: isRotationActive ? rotateYValue : 0,
          opacity: isRotationActive ? opacityValue : 1,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.svg
          viewBox="0 0 500 500"
          width="100%"
          height="100%"
          animate={bodyAnimate}
          className="overflow-visible"
        >
          {/* Bayangan Lantai */}
          <motion.ellipse
            cx="285"
            cy="472"
            rx="80"
            ry="10"
            fill="#F5EBE1"
            animate={
              isStatic
                ? {}
                : {
                    scaleX: [1, 0.85, 1],
                    opacity: [0.8, 0.5, 0.8],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: floatDuration,
              ease: "easeInOut",
            }}
          />

          {finalDirection !== "back" ? (
            <motion.g
              initial={false}
              animate={{ scaleX: isFlippedLeft ? -1 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{ transformOrigin: "250px 250px" }}
            >
              {/* Efek Garis Gerak & Daun Melayang (Sesuai avatarBoyBattle.svg) */}
              {!isStatic && !isPerching && (
                <motion.g
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    y: [0, -4, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: waveDuration * 2,
                    ease: "easeInOut",
                  }}
                >
                  {/* Garis gerak dekat peci */}
                  <path
                    d="M 236 52 C 254 55, 266 68, 269 86"
                    fill="none"
                    stroke="#0A191E"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 248 45 C 266 50, 278 65, 280 83"
                    fill="none"
                    stroke="#0A191E"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Garis gerak bawah lengan atas */}
                  <path
                    d="M 362 156 C 358 175, 348 192, 334 204"
                    fill="none"
                    stroke="#0A191E"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 360 182 C 354 196, 344 208, 332 216"
                    fill="none"
                    stroke="#0A191E"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Garis gerak belakang kaki kiri */}
                  <path
                    d="M 134 312 C 102 338, 100 382, 122 406"
                    fill="none"
                    stroke="#0A191E"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 142 325 C 118 348, 118 378, 134 398"
                    fill="none"
                    stroke="#0A191E"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Daun/Kelopak melayang */}
                  <path
                    d="M 148 378 C 142 362, 146 350, 151 351 C 156 352, 156 364, 148 378 Z"
                    fill="#FFFFFF"
                    stroke="#0A191E"
                    strokeWidth="2"
                  />
                  <path
                    d="M 123 452 C 102 446, 90 426, 98 416 C 106 408, 118 424, 123 452 Z"
                    fill="#FFFFFF"
                    stroke="#0A191E"
                    strokeWidth="2"
                  />
                  <path
                    d="M 362 418 C 382 412, 396 394, 390 380 C 382 368, 370 386, 362 418 Z"
                    fill="#FFFFFF"
                    stroke="#0A191E"
                    strokeWidth="2"
                  />
                </motion.g>
              )}

              {/* LENGAN KANAN (Melambai ke atas) */}
              <motion.g
                animate={waveArmAnimate}
                style={{ transformOrigin: "275px 205px" }}
              >
                {/* Jari & Telapak Tangan */}
                <path
                  d="M 318 118 C 310 95, 308 75, 315 68 C 322 62, 332 72, 334 80 C 338 55, 344 35, 353 38 C 362 40, 358 64, 352 82 C 360 58, 370 42, 378 47 C 385 52, 375 76, 366 92 C 376 74, 388 62, 395 69 C 401 75, 386 96, 376 108 C 386 96, 398 90, 403 97 C 408 104, 390 122, 374 134 L 352 152 L 315 128 Z"
                  fill="#FF8274"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                {/* Garis telapak tangan */}
                <path
                  d="M 334 80 C 348 86, 356 100, 352 115"
                  fill="none"
                  stroke="#0A191E"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Lengan Baju Toska */}
                <path
                  d="M 255 190 L 316 92 L 372 128 L 306 245 Z"
                  fill="#37CFA2"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                {/* Manset Lengan */}
                <path
                  d="M 316 92 L 372 128 L 363 144 L 307 108 Z"
                  fill="#0A8F7A"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
              </motion.g>

              {/* KAKI KIRI (Belakang) */}
              <motion.g
                animate={leftLegAnimate}
                style={{ transformOrigin: "225px 315px" }}
              >
                {/* Sepatu Kuning Kiri */}
                <g>
                  <path
                    d="M 164 392 L 146 408 C 138 416, 142 430, 156 440 C 164 462, 198 480, 215 470 C 224 464, 222 444, 208 430 L 194 405 Z"
                    fill="#F8B62D"
                    stroke="#0A191E"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                  {/* Sol Sepatu */}
                  <path
                    d="M 143 414 C 138 424, 146 436, 158 442 C 166 464, 198 480, 214 470 L 217 462 C 198 470, 170 454, 162 432 C 150 426, 146 416, 148 408 Z"
                    fill="#E5981E"
                    stroke="#0A191E"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Detail Lidah Sepatu */}
                  <ellipse
                    cx="192"
                    cy="426"
                    rx="14"
                    ry="9"
                    transform="rotate(25 192 426)"
                    fill="#E5981E"
                    stroke="#0A191E"
                    strokeWidth="2.5"
                  />
                </g>

                {/* Celana Kiri */}
                <path
                  d="M 196 310 L 190 352 L 160 384 C 174 414, 208 436, 228 432 C 242 428, 256 392, 268 338 Z"
                  fill="#0A4D46"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                {/* Kantong Celana */}
                <path
                  d="M 202 320 C 218 322, 224 338, 200 346"
                  fill="none"
                  stroke="#0A191E"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* KAKI KANAN (Depan) */}
              <motion.g
                animate={rightLegAnimate}
                style={{ transformOrigin: "285px 305px" }}
              >
                {/* Sepatu Kuning Kanan */}
                <g>
                  <path
                    d="M 282 388 L 264 406 C 256 414, 260 428, 278 436 C 292 458, 326 474, 340 464 C 348 456, 344 434, 326 418 L 314 396 Z"
                    fill="#F8B62D"
                    stroke="#0A191E"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                  {/* Sol Sepatu */}
                  <path
                    d="M 262 412 C 258 422, 266 432, 280 438 C 294 460, 326 474, 340 464 L 342 454 C 324 462, 298 448, 286 428 C 272 422, 266 414, 268 406 Z"
                    fill="#E5981E"
                    stroke="#0A191E"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Detail Lidah Sepatu */}
                  <ellipse
                    cx="318"
                    cy="414"
                    rx="14"
                    ry="9"
                    transform="rotate(20 318 414)"
                    fill="#E5981E"
                    stroke="#0A191E"
                    strokeWidth="2.5"
                  />
                </g>

                {/* Celana Kanan */}
                <path
                  d="M 250 302 L 324 292 C 358 312, 376 340, 368 366 L 348 410 C 322 414, 290 400, 278 382 L 270 336 Z"
                  fill="#0A4D46"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
              </motion.g>

              {/* BADAN BAJU KOKO */}
              <g>
                <path
                  d="M 192 222 L 288 188 L 330 288 L 186 324 Z"
                  fill="#37CFA2"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                {/* Lis Bawah Baju Koko dengan Belahan Tengah */}
                <path
                  d="M 188 308 L 264 292 L 268 308 L 186 324 Z"
                  fill="#0A8F7A"
                  stroke="#0A191E"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M 264 292 L 324 272 L 330 288 L 272 306 Z"
                  fill="#0A8F7A"
                  stroke="#0A191E"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                {/* Emblem / Cahaya Dada */}
                <circle
                  cx="282"
                  cy="214"
                  r="15"
                  fill="#A7F3D0"
                  opacity="0.65"
                />
                <circle cx="282" cy="214" r="8" fill="#FFFFFF" />
                {/* Kerah Baju Koko */}
                <path
                  d="M 202 216 L 238 228 L 244 202 L 262 216 L 258 190 Z"
                  fill="#0A8F7A"
                  stroke="#0A191E"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
              </g>

              {/* KEPALA & PECI */}
              <motion.g
                animate={headAnimate}
                style={{ transformOrigin: "235px 195px" }}
              >
                {/* Telinga Kanan (Belakang) */}
                <path
                  d="M 268 118 C 282 112, 296 126, 292 146 C 288 162, 276 168, 266 164 Z"
                  fill="#FF8274"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                />

                {/* Bentuk Kepala */}
                <path
                  d="M 152 165 C 142 122, 185 88, 238 102 C 276 112, 292 152, 278 186 C 264 218, 212 232, 176 212 C 160 202, 156 184, 152 165 Z"
                  fill="#FF8274"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                />

                {/* Telinga Kiri (Depan) */}
                <path
                  d="M 164 176 C 146 172, 134 188, 142 206 C 148 222, 168 226, 180 212"
                  fill="#FF8274"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 154 192 C 160 186, 168 190, 166 200"
                  fill="none"
                  stroke="#0A191E"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />

                {/* Rambut Samping Peci */}
                <path
                  d="M 150 158 C 148 168, 154 176, 164 176 C 162 162, 162 148, 166 138 Z"
                  fill="#0A4D46"
                  stroke="#0A191E"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />

                {/* Peci Putih */}
                <g>
                  <path
                    d="M 128 116 C 122 92, 212 52, 238 66 L 258 102 C 218 104, 174 126, 150 158 Z"
                    fill="#FFFFFF"
                    stroke="#0A191E"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                  {/* Bayangan Biru Muda pada Peci */}
                  <path
                    d="M 129 116 C 126 104, 140 90, 160 80 L 176 132 C 164 140, 156 150, 150 158 Z"
                    fill="#DCEBFA"
                  />
                  <path
                    d="M 128 116 C 122 92, 212 52, 238 66 L 258 102 C 218 104, 174 126, 150 158 Z"
                    fill="none"
                    stroke="#0A191E"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />
                </g>

                {/* ELEMEN WAJAH */}
                <motion.g
                  animate={{ x: eyeOffsetX * 0.5, y: eyeOffsetY * 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* Alis Tebal */}
                  <motion.rect
                    x="174"
                    y="122"
                    width="24"
                    height="12"
                    rx="6"
                    transform="rotate(-28 186 128)"
                    fill="#0A4D46"
                    stroke="#0A191E"
                    strokeWidth="2.4"
                    animate={{
                      y: isExcited ? -4 : isSad ? 3 : 0,
                    }}
                  />
                  <motion.rect
                    x="222"
                    y="102"
                    width="24"
                    height="12"
                    rx="6"
                    transform="rotate(-22 234 108)"
                    fill="#0A4D46"
                    stroke="#0A191E"
                    strokeWidth="2.4"
                    animate={{
                      y: isExcited ? -4 : isSad ? 3 : 0,
                    }}
                  />

                  {/* Pipi Merona & Garis Blush */}
                  <g>
                    <ellipse
                      cx="192"
                      cy="182"
                      rx="14"
                      ry="10"
                      transform="rotate(-18 192 182)"
                      fill="#FF5C5C"
                      opacity="0.85"
                    />
                    <path
                      d="M 186 184 L 188 178 M 191 185 L 193 179 M 196 186 L 198 180"
                      stroke="#FF9E99"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <ellipse
                      cx="266"
                      cy="152"
                      rx="13"
                      ry="9"
                      transform="rotate(-18 266 152)"
                      fill="#FF5C5C"
                      opacity="0.85"
                    />
                    <path
                      d="M 260 154 L 262 148 M 265 155 L 267 149 M 270 156 L 272 150"
                      stroke="#FF9E99"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Mata Kiri */}
                  <g transform="translate(202, 156) rotate(-18)">
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="16"
                      ry="17"
                      fill="#FFFFFF"
                      stroke="#0A191E"
                      strokeWidth="2.6"
                    />
                    {isSleepy ? (
                      <path
                        d="M -11 2 Q 0 10 11 2"
                        fill="none"
                        stroke="#0A191E"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    ) : (
                      <motion.g
                        animate={{ x: eyeOffsetX * 0.7, y: eyeOffsetY * 0.7 }}
                      >
                        <circle
                          cx="3"
                          cy="1"
                          r="10.5"
                          fill="#0A6C74"
                          stroke="#0A191E"
                          strokeWidth="2"
                        />
                        <circle cx="4" cy="1" r="5.5" fill="#0A191E" />
                        <circle cx="-2" cy="-3" r="3" fill="#FFFFFF" />
                      </motion.g>
                    )}
                  </g>

                  {/* Mata Kanan */}
                  <g transform="translate(248, 136) rotate(-18)">
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="16"
                      ry="17"
                      fill="#FFFFFF"
                      stroke="#0A191E"
                      strokeWidth="2.6"
                    />
                    {isSleepy ? (
                      <path
                        d="M -11 2 Q 0 10 11 2"
                        fill="none"
                        stroke="#0A191E"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    ) : (
                      <motion.g
                        animate={{ x: eyeOffsetX * 0.7, y: eyeOffsetY * 0.7 }}
                      >
                        <circle
                          cx="3"
                          cy="1"
                          r="10.5"
                          fill="#0A6C74"
                          stroke="#0A191E"
                          strokeWidth="2"
                        />
                        <circle cx="4" cy="1" r="5.5" fill="#0A191E" />
                        <circle cx="-2" cy="-3" r="3" fill="#FFFFFF" />
                      </motion.g>
                    )}
                  </g>

                  {/* Hidung */}
                  <path
                    d="M 230 148 C 236 144, 242 150, 236 156"
                    fill="none"
                    stroke="#0A191E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Mulut */}
                  <motion.g
                    animate={
                      talking
                        ? { scaleY: [1, 1.25, 0.75, 1.2, 1] }
                        : isExcited
                          ? { scale: [1, 1.06, 1] }
                          : {}
                    }
                    transition={
                      talking
                        ? { repeat: Infinity, duration: 0.25 }
                        : { repeat: Infinity, duration: 1.2 }
                    }
                    style={{ transformOrigin: "235px 178px" }}
                  >
                    {isSad ? (
                      <path
                        d="M 222 186 Q 236 174 250 182"
                        fill="none"
                        stroke="#0A191E"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                    ) : (
                      <g>
                        {/* Rongga Mulut */}
                        <path
                          d="M 212 174 C 224 170, 240 162, 248 158 C 258 164, 260 184, 244 192 C 228 200, 212 190, 212 174 Z"
                          fill="#12354A"
                          stroke="#0A191E"
                          strokeWidth="2.6"
                          strokeLinejoin="round"
                        />
                        {/* Gigi Atas */}
                        <path
                          d="M 213 174 C 224 170, 240 162, 248 158 C 251 162, 250 166, 244 170 C 234 176, 222 180, 214 178 Z"
                          fill="#FFFFFF"
                          stroke="#0A191E"
                          strokeWidth="2.2"
                        />
                        {/* Lidah */}
                        <path
                          d="M 218 188 C 224 180, 238 178, 248 186 C 242 194, 228 198, 218 188 Z"
                          fill="#FF6B6B"
                          stroke="#0A191E"
                          strokeWidth="2.2"
                        />
                      </g>
                    )}
                  </motion.g>
                </motion.g>
              </motion.g>

              {/* LENGAN KIRI & BUKU AL-QUR'AN (Di Depan Dada) */}
              <motion.g
                animate={bookArmAnimate}
                style={{ transformOrigin: "210px 255px" }}
              >
                {/* Buku Ngaji Biru */}
                <g>
                  {/* Punggung & Belakang Buku */}
                  <path
                    d="M 246 224 L 278 206 C 282 204, 286 206, 288 212 L 298 246 L 254 266 Z"
                    fill="#29B6F6"
                    stroke="#0A191E"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />
                  {/* Kertas Putih Buku */}
                  <path
                    d="M 250 224 L 280 208 C 284 210, 284 216, 280 218 L 254 232 Z"
                    fill="#FFFFFF"
                    stroke="#0A191E"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                  {/* Sampul Depan Buku */}
                  <path
                    d="M 254 232 L 290 214 L 298 248 L 262 268 Z"
                    fill="#29B6F6"
                    stroke="#0A191E"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                  />
                  {/* Garis Lipatan Punggung Buku */}
                  <path
                    d="M 246 224 L 254 266 M 250 228 L 258 266"
                    stroke="#0A191E"
                    strokeWidth="2.2"
                  />
                  {/* Lambang Bulan Sabit Putih */}
                  <path
                    d="M 278 228 C 270 230, 266 238, 270 246 C 274 252, 282 254, 288 248 C 282 250, 276 246, 275 240 C 274 234, 276 230, 278 228 Z"
                    fill="#FFFFFF"
                  />
                </g>

                {/* Lengan Baju Kiri */}
                <path
                  d="M 192 222 C 166 244, 152 278, 160 296 C 168 310, 204 312, 248 298 L 246 250 L 210 258"
                  fill="#37CFA2"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Garis Lipatan Siku */}
                <path
                  d="M 188 266 L 210 258 M 208 242 L 210 258"
                  fill="none"
                  stroke="#0A191E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Manset Lengan Kiri + Kancing */}
                <path
                  d="M 224 254 L 246 250 L 248 298 L 224 302 Z"
                  fill="#0A8F7A"
                  stroke="#0A191E"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                <circle
                  cx="235"
                  cy="290"
                  r="4"
                  fill="#0A8F7A"
                  stroke="#0A191E"
                  strokeWidth="2.2"
                />

                {/* Tangan Kiri Memegang Buku */}
                <path
                  d="M 246 252 L 260 254 L 288 242 C 294 240, 298 246, 292 252 C 298 252, 300 260, 292 266 C 298 268, 296 276, 288 280 C 276 288, 260 294, 248 292 Z"
                  fill="#FF8274"
                  stroke="#0A191E"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                {/* Garis Jari Tangan Kiri */}
                <path
                  d="M 292 252 L 274 262 M 292 266 L 276 274"
                  fill="none"
                  stroke="#0A191E"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </motion.g>
            </motion.g>
          ) : (
            /* TAMPAK BELAKANG (Saat Berputar) */
            <motion.g
              initial={{ opacity: 0.8, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* Lengan Kanan Melambai (Tampak Belakang) */}
              <motion.g
                animate={waveArmAnimate}
                style={{ transformOrigin: "275px 205px" }}
              >
                <path
                  d="M 318 118 C 310 95, 308 75, 315 68 C 322 62, 332 72, 334 80 C 338 55, 344 35, 353 38 C 362 40, 358 64, 352 82 C 360 58, 370 42, 378 47 C 385 52, 375 76, 366 92 C 376 74, 388 62, 395 69 C 401 75, 386 96, 376 108 C 386 96, 398 90, 403 97 C 408 104, 390 122, 374 134 L 352 152 L 315 128 Z"
                  fill="#FF8274"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M 255 190 L 316 92 L 372 128 L 306 245 Z"
                  fill="#37CFA2"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M 316 92 L 372 128 L 363 144 L 307 108 Z"
                  fill="#0A8F7A"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
              </motion.g>

              {/* Kaki Kiri & Kanan */}
              <motion.g
                animate={leftLegAnimate}
                style={{ transformOrigin: "225px 315px" }}
              >
                <path
                  d="M 164 392 L 146 408 C 138 416, 142 430, 156 440 C 164 462, 198 480, 215 470 C 224 464, 222 444, 208 430 L 194 405 Z"
                  fill="#F8B62D"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M 196 310 L 190 352 L 160 384 C 174 414, 208 436, 228 432 C 242 428, 256 392, 268 338 Z"
                  fill="#0A4D46"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
              </motion.g>

              <motion.g
                animate={rightLegAnimate}
                style={{ transformOrigin: "285px 305px" }}
              >
                <path
                  d="M 282 388 L 264 406 C 256 414, 260 428, 278 436 C 292 458, 326 474, 340 464 C 348 456, 344 434, 326 418 L 314 396 Z"
                  fill="#F8B62D"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M 250 302 L 324 292 C 358 312, 376 340, 368 366 L 348 410 C 322 414, 290 400, 278 382 L 270 336 Z"
                  fill="#0A4D46"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
              </motion.g>

              {/* Punggung Baju Koko */}
              <path
                d="M 180 220 L 295 190 L 330 288 L 186 324 Z"
                fill="#37CFA2"
                stroke="#0A191E"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              <path
                d="M 186 308 L 324 272 L 330 288 L 186 324 Z"
                fill="#0A8F7A"
                stroke="#0A191E"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />

              {/* Kepala Belakang & Peci */}
              <motion.g
                animate={headAnimate}
                style={{ transformOrigin: "235px 195px" }}
              >
                <path
                  d="M 152 165 C 142 122, 185 88, 238 102 C 276 112, 292 152, 278 186 C 264 218, 212 232, 176 212 C 160 202, 156 184, 152 165 Z"
                  fill="#FF8274"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                />
                {/* Rambut Belakang */}
                <path
                  d="M 150 155 C 180 125, 230 110, 270 125 C 278 155, 265 185, 240 195 C 205 205, 165 195, 150 155 Z"
                  fill="#0A4D46"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                />
                {/* Peci Putih Belakang */}
                <path
                  d="M 128 116 C 122 92, 212 52, 238 66 L 265 112 C 222 108, 174 128, 150 158 Z"
                  fill="#FFFFFF"
                  stroke="#0A191E"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
              </motion.g>
            </motion.g>
          )}

          {/* Indikator Lampu Ide saat Thinking */}
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
              style={{ transformOrigin: "185px 38px" }}
            >
              <circle
                cx="185"
                cy="36"
                r="16"
                fill="#FEF08A"
                stroke="#0A191E"
                strokeWidth="3"
              />
              <path d="M 178 50 L 192 50 L 189 58 L 181 58 Z" fill="#0A191E" />
              <path
                d="M 185 10 L 185 2 M 160 22 L 152 15 M 210 22 L 218 15"
                stroke="#FBBF24"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </motion.g>
          )}

          {/* Indikator Zzz saat Sleepy */}
          {isSleepy && (
            <motion.g
              animate={{ y: [0, -15], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
            >
              <text
                x="265"
                y="65"
                fill="#07473C"
                fontSize="24"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                Zzz
              </text>
            </motion.g>
          )}
        </motion.svg>
      </motion.div>
    </div>
  );
}
