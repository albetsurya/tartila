import React from "react";
import { motion } from "framer-motion";
import type { MascotSkin } from "@/features/ngaji-ceria/data/shopData";

export interface MascotAuraProps {
  skin?: MascotSkin | string;
  className?: string;
  children: React.ReactNode;
}

export function MascotAura({
  skin,
  className = "",
  children,
}: MascotAuraProps) {
  // ── SKIN LAMA ──
  const isNaga = skin === "naga";
  const isRobot = skin === "robot";
  const isPhoenixIce = skin === "phoenix_ice";
  const isPhoenixGold = skin === "phoenix_gold";
  const isPhoenixDark = skin === "phoenix_dark";

  // ── 10 SKIN BARU ──
  const isSantriTeladan = skin === "santri_teladan";
  const isPenjagaHutan = skin === "penjaga_hutan";
  const isNinjaBayangan = skin === "ninja_bayangan";
  const isKsatriaBaja = skin === "ksatria_baja";
  const isSultanArabia = skin === "sultan_arabia";
  const isPenjelajahAngkasa = skin === "penjelajah_angkasa";
  const isRajaSamudra = skin === "raja_samudra";
  const isApiMembara = skin === "api_membara";
  const isPelangiKristal = skin === "pelangi_kristal";
  const isMalaikatCahaya = skin === "malaikat_cahaya";

  const hasAura =
    isNaga ||
    isRobot ||
    isPhoenixIce ||
    isPhoenixGold ||
    isPhoenixDark ||
    isSantriTeladan ||
    isPenjagaHutan ||
    isNinjaBayangan ||
    isKsatriaBaja ||
    isSultanArabia ||
    isPenjelajahAngkasa ||
    isRajaSamudra ||
    isApiMembara ||
    isPelangiKristal ||
    isMalaikatCahaya;

  if (!hasAura) {
    return (
      <div className={`relative inline-block ${className}`}>{children}</div>
    );
  }

  // ── MULTI-LAYER DROP SHADOW (PENDAR CAHAYA INTENS DI BELAKANG MASKOT) ──
  const dropShadowStyle = isNaga
    ? "drop-shadow(0 0 18px rgba(16, 185, 129, 0.7)) drop-shadow(0 0 8px rgba(245, 158, 11, 0.85))"
    : isRobot
      ? "drop-shadow(0 0 18px rgba(6, 182, 212, 0.75)) drop-shadow(0 0 6px rgba(34, 211, 238, 0.95))"
      : isPhoenixIce
        ? "drop-shadow(0 0 20px rgba(56, 189, 248, 0.75)) drop-shadow(0 0 8px rgba(224, 242, 254, 0.95))"
        : isPhoenixGold
          ? "drop-shadow(0 0 24px rgba(251, 191, 36, 0.85)) drop-shadow(0 0 10px rgba(254, 240, 138, 1))"
          : isPhoenixDark
            ? "drop-shadow(0 0 22px rgba(126, 34, 206, 0.85)) drop-shadow(0 0 8px rgba(168, 85, 247, 0.95))"
            : isSantriTeladan
              ? "drop-shadow(0 0 18px rgba(16, 185, 129, 0.6)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.95))"
              : isPenjagaHutan
                ? "drop-shadow(0 0 18px rgba(132, 204, 22, 0.7)) drop-shadow(0 0 6px rgba(190, 242, 100, 0.85))"
                : isNinjaBayangan
                  ? "drop-shadow(0 0 20px rgba(239, 68, 68, 0.65)) drop-shadow(0 0 10px rgba(15, 23, 42, 0.95))"
                  : isKsatriaBaja
                    ? "drop-shadow(0 0 20px rgba(59, 130, 246, 0.75)) drop-shadow(0 0 8px rgba(226, 232, 240, 0.9))"
                    : isSultanArabia
                      ? "drop-shadow(0 0 22px rgba(245, 158, 11, 0.8)) drop-shadow(0 0 8px rgba(225, 29, 72, 0.85))"
                      : isPenjelajahAngkasa
                        ? "drop-shadow(0 0 22px rgba(99, 102, 241, 0.8)) drop-shadow(0 0 8px rgba(56, 189, 248, 0.9))"
                        : isRajaSamudra
                          ? "drop-shadow(0 0 22px rgba(14, 165, 233, 0.8)) drop-shadow(0 0 8px rgba(45, 212, 191, 0.95))"
                          : isApiMembara
                            ? "drop-shadow(0 0 24px rgba(234, 88, 12, 0.9)) drop-shadow(0 0 10px rgba(250, 204, 21, 0.95))"
                            : isPelangiKristal
                              ? "drop-shadow(0 0 24px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 10px rgba(56, 189, 248, 0.95))"
                              : isMalaikatCahaya
                                ? "drop-shadow(0 0 26px rgba(250, 204, 21, 0.9)) drop-shadow(0 0 12px rgba(255, 255, 255, 1))"
                                : undefined;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ filter: dropShadowStyle }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          1. NAGA KSATRIA: VORTEX ZAMRUD, ASAP NAGA & SEMBURAN BARA EMAS
         ══════════════════════════════════════════════════════════════════ */}
      {isNaga && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full bg-gradient-to-tr from-emerald-600/40 via-amber-500/25 to-transparent blur-xl"
              animate={{ scale: [0.9, 1.25, 0.9], rotate: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`naga-smoke-${i}`}
                className="absolute h-12 w-12 rounded-full bg-emerald-900/50 blur-md"
                style={{ left: `${18 + i * 26}%`, bottom: "10%" }}
                animate={{
                  y: [0, -75],
                  x: [0, i % 2 === 0 ? -22 : 22],
                  scale: [0.6, 2.5],
                  opacity: [0, 0.75, 0],
                }}
                transition={{
                  duration: 2.6 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 0.6,
                }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {[12, 28, 45, 65, 82, 35, 72].map((leftPos, i) => (
              <motion.div
                key={`naga-ember-${i}`}
                className="absolute h-2.5 w-2.5 rounded-full bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-200 shadow-[0_0_10px_#F59E0B]"
                style={{ left: `${leftPos}%`, bottom: "12%" }}
                animate={{
                  y: [0, -95 - (i % 3) * 20],
                  x: [0, i % 2 === 0 ? 18 : -18, i % 2 === 0 ? -10 : 10],
                  scale: [0.4, 1.3, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.6 + (i % 3) * 0.4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 0.25,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          2. ROBOT CYBER: CINCIN HUD HOLOGRAM & BADAI PETIR PLASMA
         ══════════════════════════════════════════════════════════════════ */}
      {isRobot && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full border-2 border-dashed border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute h-28 w-28 rounded-full border border-sky-300/40"
              animate={{ rotate: -360, scale: [1.1, 0.9, 1.1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {[
              { left: "10%", top: "5%", scale: 0.9, delay: 0 },
              { left: "78%", top: "10%", scale: 1.1, delay: 0.5 },
              { left: "45%", top: "-12%", scale: 1.25, delay: 0.9 },
              { left: "18%", top: "60%", scale: 0.8, delay: 1.3 },
            ].map((pos, i) => (
              <motion.svg
                key={`robot-spark-${i}`}
                viewBox="0 0 24 32"
                className="absolute h-8 w-6 drop-shadow-[0_0_10px_#22D3EE]"
                style={{ left: pos.left, top: pos.top }}
                animate={{
                  opacity: [0, 1, 0.2, 1, 0],
                  scale: [0.5, pos.scale, 0.7],
                  rotate: [0, i % 2 === 0 ? 12 : -12, 0],
                }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  repeatDelay: 0.7,
                  delay: pos.delay,
                }}
              >
                <path
                  d="M 14 0 L 4 14 L 12 15 L 6 32 L 20 14 L 12 13 Z"
                  fill="#E0F2FE"
                  stroke="#06B6D4"
                  strokeWidth="1.5"
                />
              </motion.svg>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          3. PHOENIX ES: NOVA FROST ARKTIK & BADAI KRISTAL SALJU
         ══════════════════════════════════════════════════════════════════ */}
      {isPhoenixIce && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full bg-radial from-sky-300/50 via-cyan-400/20 to-transparent blur-xl"
              animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.5, 0.9, 0.5] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {[10, 26, 48, 70, 85, 38].map((leftPos, i) => (
              <motion.svg
                key={`ice-crystal-${i}`}
                viewBox="0 0 24 24"
                className="absolute h-5 w-5 drop-shadow-[0_0_8px_#38BDF8]"
                style={{ left: `${leftPos}%`, top: "-10%" }}
                animate={{
                  y: [0, 130],
                  x: [0, i % 2 === 0 ? 18 : -18, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0.9, 0],
                  scale: [0.6, 1.15, 0.5],
                }}
                transition={{
                  duration: 2.8 + (i % 3) * 0.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.45,
                }}
              >
                <path
                  d="M12 1V23M1 12H23M4.2 4.2L19.8 19.8M19.8 4.2L4.2 19.8"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <polygon
                  points="12,6 17,9 17,15 12,18 7,15 7,9"
                  fill="#BAE6FD"
                  stroke="#38BDF8"
                  strokeWidth="1"
                />
              </motion.svg>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          4. PHOENIX EMAS: HALO SURYA AGUNG & LEDAKAN BINTANG EMAS MURNI
         ══════════════════════════════════════════════════════════════════ */}
      {isPhoenixGold && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-40 w-40 rounded-full bg-gradient-to-r from-amber-400/50 via-yellow-200/60 to-amber-500/50 blur-xl"
              animate={{ scale: [0.9, 1.3, 0.9], rotate: [0, 180, 360] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute h-32 w-32 rounded-full border-2 border-yellow-300/70 shadow-[0_0_25px_#FBBF24]"
              animate={{ scale: [0.8, 1.4], opacity: [0.9, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {[
              { left: "6%", top: "15%", size: "h-7 w-7", delay: 0 },
              { left: "80%", top: "8%", size: "h-8 w-8", delay: 0.4 },
              { left: "15%", top: "70%", size: "h-6 w-6", delay: 0.8 },
              { left: "75%", top: "65%", size: "h-7 w-7", delay: 1.2 },
              { left: "45%", top: "-14%", size: "h-8 w-8", delay: 1.5 },
            ].map((star, i) => (
              <motion.svg
                key={`gold-star-${i}`}
                viewBox="0 0 24 24"
                className={`absolute ${star.size} drop-shadow-[0_0_12px_#F59E0B]`}
                style={{ left: star.left, top: star.top }}
                animate={{
                  scale: [0, 1.4, 0],
                  rotate: [0, 90, 180],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: star.delay,
                }}
              >
                <path
                  d="M 12 0 C 12 7, 17 12, 24 12 C 17 12, 12 17, 12 24 C 12 17, 7 12, 0 12 C 7 12, 12 7, 12 0 Z"
                  fill="#FEF08A"
                  stroke="#F59E0B"
                  strokeWidth="1"
                />
              </motion.svg>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          5. PHOENIX KEGELAPAN: SINGULARITAS VOID & API UNGU ABYSSAL
         ══════════════════════════════════════════════════════════════════ */}
      {isPhoenixDark && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full bg-gradient-to-tr from-purple-950/90 via-fuchsia-800/50 to-slate-950/90 blur-xl"
              animate={{ scale: [0.95, 1.3, 0.95], rotate: [360, 180, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {[12, 28, 48, 68, 82].map((leftPos, i) => (
              <motion.div
                key={`dark-flame-${i}`}
                className="absolute h-6 w-4 rounded-full bg-gradient-to-t from-purple-950 via-purple-600 to-fuchsia-300 blur-[1px] shadow-[0_0_12px_#A855F7]"
                style={{ left: `${leftPos}%`, bottom: "8%" }}
                animate={{
                  y: [0, -90],
                  x: [0, i % 2 === 0 ? -15 : 15, 0],
                  scale: [0.6, 1.5, 0.2],
                  opacity: [0, 0.95, 0],
                }}
                transition={{
                  duration: 2.1 + (i % 3) * 0.3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 0.35,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          6. SANTRI TELADAN: CAHAYA BERKAH ZAMRUD, SABIT EMAS & BINTANG SUCI
         ══════════════════════════════════════════════════════════════════ */}
      {isSantriTeladan && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full bg-gradient-to-b from-emerald-300/40 via-teal-100/50 to-transparent blur-xl"
              animate={{ scale: [0.95, 1.2, 0.95], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {/* Bulan Sabit Berkah di Atas Kepala */}
            <motion.svg
              viewBox="0 0 24 24"
              className="absolute left-1/2 -top-6 -translate-x-1/2 h-7 w-7 drop-shadow-[0_0_10px_#10B981]"
              animate={{ y: [0, -6, 0], scale: [0.95, 1.1, 0.95] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="#FEF08A"
                stroke="#10B981"
                strokeWidth="1.5"
              />
            </motion.svg>
            {/* Bintang Cahaya Berkah */}
            {[
              { left: "10%", top: "20%", delay: 0 },
              { left: "82%", top: "18%", delay: 0.5 },
              { left: "16%", top: "65%", delay: 1.0 },
              { left: "78%", top: "60%", delay: 1.5 },
            ].map((pos, i) => (
              <motion.svg
                key={`santri-star-${i}`}
                viewBox="0 0 24 24"
                className="absolute h-5 w-5 drop-shadow-[0_0_8px_#34D399]"
                style={{ left: pos.left, top: pos.top }}
                animate={{
                  scale: [0, 1.3, 0],
                  rotate: [0, 90, 180],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: pos.delay,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M 12 0 C 12 7, 17 12, 24 12 C 17 12, 12 17, 12 24 C 12 17, 7 12, 0 12 C 7 12, 12 7, 12 0 Z"
                  fill="#FFFFFF"
                  stroke="#10B981"
                  strokeWidth="1"
                />
              </motion.svg>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          7. PENJAGA HUTAN: PUSARAN ANGIN RIMBA, DAUN & KUNANG-KUNANG EMAS
         ══════════════════════════════════════════════════════════════════ */}
      {isPenjagaHutan && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full bg-radial from-lime-400/40 via-emerald-500/20 to-transparent blur-xl"
              animate={{ scale: [0.9, 1.2, 0.9] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {/* Daun Rimba Melayang */}
            {[12, 32, 55, 76, 88].map((leftPos, i) => (
              <motion.svg
                key={`hutan-leaf-${i}`}
                viewBox="0 0 24 24"
                className="absolute h-5 w-5 drop-shadow-[0_0_6px_#84CC16]"
                style={{ left: `${leftPos}%`, top: "-12%" }}
                animate={{
                  y: [0, 135],
                  x: [0, i % 2 === 0 ? 25 : -25, i % 2 === 0 ? -10 : 10],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.2 + (i % 3) * 0.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M17 3C11 3 5 7 5 15C5 17.5 6.5 19.5 6.5 19.5C6.5 19.5 8.5 21 11 21C19 21 21 13 21 7C21 4.5 19.5 3 17 3ZM7 17C9 13 13 9 18 6"
                  fill="#84CC16"
                  stroke="#365314"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </motion.svg>
            ))}
            {/* Kunang-Kunang Bercahaya */}
            {[20, 45, 70, 85].map((leftPos, i) => (
              <motion.div
                key={`firefly-${i}`}
                className="absolute h-2.5 w-2.5 rounded-full bg-yellow-300 shadow-[0_0_10px_#FACC15]"
                style={{ left: `${leftPos}%`, bottom: "15%" }}
                animate={{
                  y: [0, -70, -35, -90],
                  x: [0, i % 2 === 0 ? -20 : 20, 0],
                  opacity: [0, 1, 0.3, 1, 0],
                  scale: [0.5, 1.3, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          8. NINJA BAYANGAN: KABUT MALAM, SHURIKEN BERPUTAR & KELOPAK SAKURA
         ══════════════════════════════════════════════════════════════════ */}
      {isNinjaBayangan && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`ninja-smoke-${i}`}
                className="absolute h-14 w-14 rounded-full bg-slate-900/80 blur-md"
                style={{ left: `${15 + i * 25}%`, bottom: "5%" }}
                animate={{
                  y: [0, -70],
                  scale: [0.8, 2.3],
                  opacity: [0, 0.85, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {/* Shuriken Merah Menyala */}
            {[
              { left: "8%", top: "18%", delay: 0 },
              { left: "80%", top: "22%", delay: 0.8 },
            ].map((pos, i) => (
              <motion.svg
                key={`shuriken-${i}`}
                viewBox="0 0 24 24"
                className="absolute h-6 w-6 drop-shadow-[0_0_8px_#EF4444]"
                style={{ left: pos.left, top: pos.top }}
                animate={{
                  rotate: [0, 720],
                  scale: [0, 1.2, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: pos.delay,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z"
                  fill="#1E293B"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="12" r="2.5" fill="#EF4444" />
              </motion.svg>
            ))}
            {/* Kelopak Bunga Sakura Merah Muda/Merah */}
            {[15, 38, 62, 82].map((leftPos, i) => (
              <motion.div
                key={`sakura-${i}`}
                className="absolute h-3 w-2.5 rounded-tl-full rounded-br-full bg-gradient-to-br from-rose-400 to-red-600 shadow-[0_0_6px_#F43F5E]"
                style={{ left: `${leftPos}%`, top: "-10%" }}
                animate={{
                  y: [0, 130],
                  x: [0, -25, 15],
                  rotate: [0, 240, 480],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.6 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.45,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          9. KSATRIA BAJA: PERISAI SUCI TEMPLAR & KILATAN PEDANG CAHAYA
         ══════════════════════════════════════════════════════════════════ */}
      {isKsatriaBaja && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full border-2 border-blue-400/60 bg-blue-500/15 shadow-[0_0_25px_rgba(37,99,235,0.5)]"
              animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.5, 0.9, 0.5] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {/* Tebasan Kilau Baja Menyilang */}
            {[
              { left: "12%", top: "20%", rotate: "-35deg", delay: 0 },
              { left: "55%", top: "15%", rotate: "35deg", delay: 0.6 },
              { left: "25%", top: "65%", rotate: "-25deg", delay: 1.2 },
            ].map((slash, i) => (
              <motion.div
                key={`knight-slash-${i}`}
                className="absolute h-1.5 w-12 rounded-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_#60A5FA]"
                style={{
                  left: slash.left,
                  top: slash.top,
                  rotate: slash.rotate,
                }}
                animate={{
                  scaleX: [0, 1.6, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  repeatDelay: 0.9,
                  delay: slash.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
            {/* Lambang Perisai Cahaya Kecil */}
            {[
              { left: "8%", top: "45%", delay: 0.2 },
              { left: "82%", top: "45%", delay: 1.1 },
            ].map((shield, i) => (
              <motion.svg
                key={`knight-shield-${i}`}
                viewBox="0 0 24 24"
                className="absolute h-5 w-5 drop-shadow-[0_0_8px_#3B82F6]"
                style={{ left: shield.left, top: shield.top }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0, 1, 0],
                  scale: [0.7, 1.15, 0.7],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: shield.delay,
                }}
              >
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  fill="#DBEAFE"
                  stroke="#2563EB"
                  strokeWidth="2"
                />
              </motion.svg>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          10. SULTAN ARABIA: BADAI PASIR EMAS, PERMATA RUBY/SAFIR & KOIN SULTAN
         ══════════════════════════════════════════════════════════════════ */}
      {isSultanArabia && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full bg-gradient-to-tr from-rose-700/40 via-amber-400/40 to-yellow-200/30 blur-xl"
              animate={{ scale: [0.9, 1.25, 0.9], rotate: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {/* Hujan Koin & Permata Berkilau */}
            {[10, 28, 48, 68, 84].map((leftPos, i) => (
              <motion.svg
                key={`sultan-gem-${i}`}
                viewBox="0 0 24 24"
                className="absolute h-5 w-5 drop-shadow-[0_0_8px_#F59E0B]"
                style={{ left: `${leftPos}%`, bottom: "5%" }}
                animate={{
                  y: [0, -110],
                  x: [0, i % 2 === 0 ? 12 : -12],
                  rotateY: [0, 360],
                  opacity: [0, 1, 0],
                  scale: [0.6, 1.2, 0.6],
                }}
                transition={{
                  duration: 2.4 + (i % 2) * 0.4,
                  repeat: Infinity,
                  delay: i * 0.45,
                  ease: "easeOut",
                }}
              >
                {i % 2 === 0 ? (
                  // Permata Berlian Sultan
                  <polygon
                    points="12,2 22,9 12,22 2,9"
                    fill="#38BDF8"
                    stroke="#FDE047"
                    strokeWidth="1.8"
                  />
                ) : (
                  // Koin Emas Dinar
                  <>
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      fill="#FACC15"
                      stroke="#D97706"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="12" r="5" fill="#FEF08A" />
                  </>
                )}
              </motion.svg>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          11. PENJELAJAH ANGKASA: NEBULA GALAKSI, CINCIN PLANET & SATELIT ORBIT
         ══════════════════════════════════════════════════════════════════ */}
      {isPenjelajahAngkasa && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full bg-gradient-to-tr from-indigo-600/50 via-purple-500/40 to-cyan-400/40 blur-xl"
              animate={{ scale: [0.9, 1.25, 0.9], rotate: [0, 360] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-20">
            {[0, 1, 2, 3].map((i) => {
              const orbitRadius = 46 + i * 12;
              return (
                <motion.div
                  key={`space-orbit-${i}`}
                  className="absolute h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_12px_#22D3EE]"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3.2 + i * 1.1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    transformOrigin: `${orbitRadius}px center`,
                    left: `calc(50% - ${orbitRadius}px)`,
                  }}
                >
                  <div className="h-full w-full scale-50 rounded-full bg-white" />
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          12. RAJA SAMUDRA: VORTEX ATLANTIS & GELEMBUNG BIOLUMINESENSI
         ══════════════════════════════════════════════════════════════════ */}
      {isRajaSamudra && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-36 w-36 rounded-full bg-gradient-to-t from-sky-600/50 via-teal-400/35 to-transparent blur-xl"
              animate={{ scale: [0.9, 1.2, 0.9], y: [4, -6, 4] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {[12, 26, 44, 62, 78, 88].map((leftPos, i) => {
              const size = 10 + (i % 3) * 6;
              return (
                <motion.div
                  key={`samudra-bubble-${i}`}
                  className="absolute rounded-full border-2 border-teal-200/90 bg-cyan-300/30 shadow-[0_0_10px_#2DD4BF]"
                  style={{
                    width: size,
                    height: size,
                    left: `${leftPos}%`,
                    bottom: "5%",
                  }}
                  animate={{
                    y: [0, -115],
                    x: [0, i % 2 === 0 ? 16 : -16, 0],
                    opacity: [0, 1, 0.9, 0],
                    scale: [0.5, 1.2, 1.4],
                  }}
                  transition={{
                    duration: 2.5 + (i % 3) * 0.4,
                    repeat: Infinity,
                    delay: i * 0.35,
                    ease: "easeOut",
                  }}
                >
                  <div className="ml-0.5 mt-0.5 h-1.5 w-1.5 rounded-full bg-white/90" />
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          13. API NERAKA / RAJA MAGMA: INTI VULKANIK & SEMBURAN PILAR LAVA
         ══════════════════════════════════════════════════════════════════ */}
      {isApiMembara && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-40 w-40 rounded-full bg-radial from-orange-500/65 via-red-600/40 to-transparent blur-xl"
              animate={{ scale: [0.9, 1.35, 0.9], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {[10, 24, 40, 58, 74, 86, 48].map((leftPos, i) => (
              <motion.svg
                key={`magma-flame-${i}`}
                viewBox="0 0 24 32"
                className="absolute h-7 w-5 drop-shadow-[0_0_10px_#EA580C]"
                style={{ left: `${leftPos}%`, bottom: "4%" }}
                animate={{
                  y: [0, -105],
                  x: [0, i % 2 === 0 ? 15 : -15],
                  scale: [0.5, 1.4, 0.2],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.4 + (i % 3) * 0.3,
                  repeat: Infinity,
                  delay: i * 0.22,
                  ease: "easeOut",
                }}
              >
                <path
                  d="M12 0C12 0 4 10 4 18C4 24 7.5 28 12 28C16.5 28 20 24 20 18C20 10 12 0 12 0Z"
                  fill="#F97316"
                />
                <path
                  d="M12 8C12 8 8 14 8 19C8 22 9.8 25 12 25C14.2 25 16 22 16 19C16 14 12 8 12 8Z"
                  fill="#FEF08A"
                />
              </motion.svg>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          14. PELANGI KRISTAL: BIAS CAHaya PRISMA & PECAHAN BERLIAN WARNA-WARNI
         ══════════════════════════════════════════════════════════════════ */}
      {isPelangiKristal && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-40 w-40 rounded-full bg-[conic-gradient(from_0deg,#EC4899,#8B5CF6,#38BDF8,#4ADE80,#FACC15,#EC4899)] opacity-45 blur-xl"
              animate={{ rotate: [0, 360], scale: [0.95, 1.2, 0.95] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {[
              { left: "8%", top: "18%", fill: "#F472B6", delay: 0 },
              { left: "82%", top: "15%", fill: "#38BDF8", delay: 0.3 },
              { left: "14%", top: "68%", fill: "#FACC15", delay: 0.6 },
              { left: "78%", top: "65%", fill: "#4ADE80", delay: 0.9 },
              { left: "46%", top: "-12%", fill: "#C084FC", delay: 1.2 },
              { left: "28%", top: "8%", fill: "#2DD4BF", delay: 1.5 },
            ].map((shard, i) => (
              <motion.svg
                key={`prism-crystal-${i}`}
                viewBox="0 0 24 24"
                className="absolute h-6 w-6 drop-shadow-[0_0_10px_#FFFFFF]"
                style={{ left: shard.left, top: shard.top }}
                animate={{
                  rotate: [0, 180, 360],
                  scale: [0.4, 1.35, 0.4],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: shard.delay,
                  ease: "easeInOut",
                }}
              >
                <polygon
                  points="12,1 21,12 12,23 3,12"
                  fill={shard.fill}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </motion.svg>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          15. MALAIKAT CAHAYA: HALO FIRDAUS, SINAR SURGAWI & BULU EMAS SUCI
         ══════════════════════════════════════════════════════════════════ */}
      {isMalaikatCahaya && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-0">
            <motion.div
              className="h-44 w-44 rounded-full bg-radial from-yellow-200/75 via-amber-300/35 to-transparent blur-xl"
              animate={{ scale: [0.95, 1.3, 0.95], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
            {/* Cincin Halo Suci Melayang di Atas Kepala */}
            <motion.div
              className="absolute left-1/2 -top-5 -translate-x-1/2 h-4 w-20 rounded-full border-4 border-yellow-300 bg-yellow-100/30 shadow-[0_0_18px_#FACC15]"
              animate={{
                y: [0, -5, 0],
                scaleX: [0.95, 1.08, 0.95],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Bulu Sayap Cahaya Jatuh Perlahan */}
            {[10, 28, 52, 74, 86].map((leftPos, i) => (
              <motion.svg
                key={`angel-feather-${i}`}
                viewBox="0 0 24 24"
                className="absolute h-6 w-6 drop-shadow-[0_0_10px_#FEF08A]"
                style={{ left: `${leftPos}%`, top: "-10%" }}
                animate={{
                  y: [0, 135],
                  x: [0, i % 2 === 0 ? 20 : -20, 0],
                  rotate: [-25, 35, -25],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 3.4 + (i % 3) * 0.4,
                  repeat: Infinity,
                  delay: i * 0.55,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M12 2C12 2 7 6 7 12C7 18 12 22 12 22C12 22 17 18 17 12C17 6 12 2 12 2Z"
                  fill="#FFFFFF"
                  stroke="#FACC15"
                  strokeWidth="1.2"
                />
                <path
                  d="M12 2V22"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </motion.svg>
            ))}
          </div>
        </>
      )}

      {/* Konten Utama Maskot */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
