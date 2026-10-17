import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

export type BibiMood =
  | "idle"
  | "happy"
  | "thinking"
  | "sleepy"
  | "excited"
  | "sad";
export type BibiDirection = "front" | "right" | "left" | "back";

// ✅ EXPORT TYPE BibiAnimation
export type BibiAnimation = "fly" | "float" | "bounce" | "perch" | "none";

export interface BibiMascotProps {
  size?: number | string;
  mood?: BibiMood;
  direction?: BibiDirection;
  animation?: BibiAnimation;
  talking?: boolean;
  speech?: string;
  followCursor?: boolean;
  autoDirection?: boolean;
  className?: string;
  onTap?: () => void;
  rotation?: number;
  autoRotate?: boolean;
}

export function BibiMascot({
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
}: BibiMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lookOffset, setLookOffset] = useState({ x: 0, y: 0 });
  const [dynamicDir, setDynamicDir] = useState<BibiDirection | null>(null);

  const rotationValue = useMotionValue(rotation || 0);
  const [activeView, setActiveView] = useState<BibiDirection>(direction);

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

  const dynamicStyles = useTransform(rotationValue, (latest) => {
    let normalized = latest % 360;
    if (normalized < 0) normalized += 360;

    const rad = (normalized * Math.PI) / 180;

    const sX = Math.max(Math.abs(Math.cos(rad)), 0.15);
    const rY = Math.sin(rad) * 25;

    const op = 0.15 + 0.85 * Math.abs(Math.cos(2 * rad));

    return { scaleX: sX, rotateY: rY, opacity: op };
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
    : isThinking || isSleepy || isSad
      ? 0.65
      : 0.28;
  const floatDuration = isExcited ? 1.1 : isThinking || isSleepy ? 2.6 : 1.6;

  // ✅ SEMUA transition pakai `as const` agar ease di-infer sebagai literal, bukan string
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

  const leftWingAnimate = isStatic
    ? { rotate: 0 }
    : isPerching
      ? {
          rotate: [-25, -20, -25],
          transition: {
            repeat: Infinity,
            duration: 2,
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

  const rightWingAnimate = isStatic
    ? { rotate: 0 }
    : isPerching
      ? {
          rotate: [25, 20, 25],
          transition: {
            repeat: Infinity,
            duration: 2,
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
          scaleX: isRotationActive ? dynamicStyles.scaleX : 1,
          rotateY: isRotationActive ? dynamicStyles.rotateY : 0,
          opacity: isRotationActive ? dynamicStyles.opacity : 1,
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
              </motion.g>

              <motion.g
                animate={{ x: eyeOffsetX * 0.6, y: eyeOffsetY * 0.6 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <path d="M 284 222 L 316 243 L 311 258 Z" fill="#EAA012" />
                <circle cx="240" cy="225" r="13.5" fill="#FF5E6C" />
                <circle cx="346" cy="218" r="12" fill="#FF5E6C" />

                <g transform="translate(255, 190) rotate(-10)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="25"
                    ry="27"
                    fill="#FFFFFF"
                    stroke="#07473C"
                    strokeWidth="4"
                  />
                  {isSleepy ? (
                    <path
                      d="M -18 2 Q 0 14 18 2"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    <motion.g animate={{ x: eyeOffsetX, y: eyeOffsetY }}>
                      <circle cx="2" cy="0" r="19.5" fill="#008F7A" />
                      <circle cx="3" cy="0" r="15.5" fill="#053B33" />
                      <circle cx="11" cy="-8" r="6.5" fill="#FFFFFF" />
                      <path
                        d="M -5 1 Q -5 6 0 6 Q -5 6 -5 11 Q -5 6 -10 6 Q -5 6 -5 1 Z"
                        fill="#FFFFFF"
                      />
                    </motion.g>
                  )}
                </g>

                <g transform="translate(326, 184) rotate(-10)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="23"
                    ry="25"
                    fill="#FFFFFF"
                    stroke="#07473C"
                    strokeWidth="4"
                  />
                  {isSleepy ? (
                    <path
                      d="M -16 2 Q 0 13 16 2"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    <motion.g animate={{ x: eyeOffsetX, y: eyeOffsetY }}>
                      <circle cx="2" cy="0" r="18" fill="#008F7A" />
                      <circle cx="3" cy="0" r="14" fill="#053B33" />
                      <circle cx="10" cy="-7" r="6" fill="#FFFFFF" />
                      <path
                        d="M -4 1 Q -4 5.5 0.5 5.5 Q -4 5.5 -4 10 Q -4 5.5 -8.5 5.5 Q -4 5.5 -4 1 Z"
                        fill="#FFFFFF"
                      />
                    </motion.g>
                  )}
                </g>

                <motion.g
                  animate={
                    talking
                      ? { scaleY: [1, 1.18, 0.92, 1.15, 1] }
                      : isExcited
                        ? { scale: [1, 1.06, 1] }
                        : {}
                  }
                  transition={
                    talking
                      ? { repeat: Infinity, duration: 0.25 }
                      : { repeat: Infinity, duration: 1.2 }
                  }
                  style={{ transformOrigin: "285px 212px" }}
                >
                  <path
                    d="M 284 212 L 318 194 L 305 212 L 315 240 Z"
                    fill="#07473C"
                  />
                  <path
                    d="M 285 213 L 296 213 L 313 238 L 285 220 Z"
                    fill="#FF5E6C"
                  />
                  <path
                    d="M 323 191 C 304 195, 285 201, 280 209 C 276 216, 281 224, 317 244 L 305 213 L 286 213 L 323 191 Z"
                    fill="#FF5E6C"
                    stroke="#07473C"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 323 191 L 305 213 L 317 244"
                    fill="none"
                    stroke="#07473C"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="298" cy="202" r="1.8" fill="#07473C" />
                  <circle cx="303" cy="200" r="1.5" fill="#07473C" />
                </motion.g>
              </motion.g>
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
              </motion.g>

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
                <circle cx="182" cy="226" r="13.5" fill="#FF5E6C" />
                <circle cx="318" cy="226" r="13.5" fill="#FF5E6C" />

                <g transform="translate(206, 192)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="25"
                    ry="27"
                    fill="#FFFFFF"
                    stroke="#07473C"
                    strokeWidth="4"
                  />
                  {isSleepy ? (
                    <path
                      d="M -18 2 Q 0 14 18 2"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    <motion.g animate={{ x: eyeOffsetX, y: eyeOffsetY }}>
                      <circle cx="0" cy="0" r="19.5" fill="#008F7A" />
                      <circle cx="0" cy="0" r="15.5" fill="#053B33" />
                      <circle cx="8" cy="-8" r="6.5" fill="#FFFFFF" />
                      <path
                        d="M -6 1 Q -6 6 -1 6 Q -6 6 -6 11 Q -6 6 -11 6 Q -6 6 -6 1 Z"
                        fill="#FFFFFF"
                      />
                    </motion.g>
                  )}
                </g>

                <g transform="translate(294, 192)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="25"
                    ry="27"
                    fill="#FFFFFF"
                    stroke="#07473C"
                    strokeWidth="4"
                  />
                  {isSleepy ? (
                    <path
                      d="M -18 2 Q 0 14 18 2"
                      fill="none"
                      stroke="#07473C"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    <motion.g animate={{ x: eyeOffsetX, y: eyeOffsetY }}>
                      <circle cx="0" cy="0" r="19.5" fill="#008F7A" />
                      <circle cx="0" cy="0" r="15.5" fill="#053B33" />
                      <circle cx="8" cy="-8" r="6.5" fill="#FFFFFF" />
                      <path
                        d="M -6 1 Q -6 6 -1 6 Q -6 6 -6 11 Q -6 6 -11 6 Q -6 6 -6 1 Z"
                        fill="#FFFFFF"
                      />
                    </motion.g>
                  )}
                </g>

                <motion.g
                  animate={
                    talking
                      ? { scaleY: [1, 1.2, 0.9, 1.15, 1] }
                      : isExcited
                        ? { scale: [1, 1.07, 1] }
                        : {}
                  }
                  transition={
                    talking
                      ? { repeat: Infinity, duration: 0.25 }
                      : { repeat: Infinity, duration: 1.2 }
                  }
                  style={{ transformOrigin: "250px 215px" }}
                >
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
                </motion.g>
              </motion.g>
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
                  d="M 212 330 C 206 355, 196 372, 186 382 C 178 390, 182 406, 192 406 C 202 406, 206 392, 208 384 C 216 368, 222 350, 225 332 Z"
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
                  d="M 288 330 C 294 355, 304 372, 314 382 C 322 390, 318 406, 308 406 C 298 406, 294 392, 292 384 C 284 368, 278 350, 275 332 Z"
                  fill="#FF5E6C"
                  stroke="#07473C"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
              </motion.g>

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
              </motion.g>

              <motion.g
                animate={tailAnimate}
                style={{ transformOrigin: "250px 305px" }}
              >
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
              </motion.g>
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
        </motion.svg>
      </motion.div>
    </div>
  );
}
