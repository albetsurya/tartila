import React from "react";
import { motion } from "framer-motion";
import type { MascotSkin } from "@/features/ngaji-ceria/data/shopData";

export interface MascotAuraProps {
  skin?: MascotSkin | string;
  className?: string;
  children: React.ReactNode;
}

export function MascotAura({ skin, className = "", children }: MascotAuraProps) {
  const isNaga = skin === "naga";
  const isRobot = skin === "robot";
  const isPhoenixIce = skin === "phoenix_ice";
  const isPhoenixGold = skin === "phoenix_gold";
  const isPhoenixDark = skin === "phoenix_dark";

  const hasAura = isNaga || isRobot || isPhoenixIce || isPhoenixGold || isPhoenixDark;

  if (!hasAura) {
    return <div className={`relative inline-block ${className}`}>{children}</div>;
  }

  const dropShadowStyle = isRobot
    ? "drop-shadow(0 0 14px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 6px rgba(34, 211, 238, 0.75))"
    : isPhoenixIce
      ? "drop-shadow(0 0 14px rgba(56, 189, 248, 0.5)) drop-shadow(0 0 6px rgba(224, 242, 254, 0.75))"
      : isPhoenixGold
        ? "drop-shadow(0 0 16px rgba(251, 191, 36, 0.6)) drop-shadow(0 0 6px rgba(254, 240, 138, 0.85))"
        : isPhoenixDark
          ? "drop-shadow(0 0 16px rgba(126, 34, 206, 0.65)) drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))"
          : undefined;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        filter: dropShadowStyle,
      }}
    >
      {/* ── EFEK AURA NAGA: ASAP MISTIS & BARA API ── */}
      {isNaga && (
        <div className="pointer-events-none absolute inset-0 overflow-visible z-0">
          {/* Asap Mistis 1 (Kiri Atas) */}
          <motion.div
            className="absolute left-6 top-8 h-8 w-8 rounded-full bg-slate-700/60 blur-md"
            animate={{
              y: [-5, -45],
              x: [0, -15],
              scale: [0.7, 2.2],
              opacity: [0, 0.65, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.2,
            }}
          />

          {/* Asap Mistis 2 (Kanan Atas - Sentuhan Ungu Gelap) */}
          <motion.div
            className="absolute right-8 top-10 h-9 w-9 rounded-full bg-purple-900/50 blur-md"
            animate={{
              y: [-8, -50],
              x: [0, 18],
              scale: [0.6, 2.4],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.9,
            }}
          />

          {/* Asap Mistis 3 (Tengah / Belakang Badan) */}
          <motion.div
            className="absolute left-1/2 top-14 -translate-x-1/2 h-10 w-10 rounded-full bg-slate-800/60 blur-md"
            animate={{
              y: [0, -42],
              scale: [0.8, 2.6],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.6,
            }}
          />

          {/* Asap Mistis 4 (Samping Badan Bawah) */}
          <motion.div
            className="absolute left-12 bottom-12 h-7 w-7 rounded-full bg-emerald-950/40 blur-md"
            animate={{
              y: [0, -38],
              x: [0, -10],
              scale: [0.6, 2.0],
              opacity: [0, 0.45, 0],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          />

          {/* Bara Api 1 (Oranye Berkobar Kecil) */}
          <motion.div
            className="absolute left-16 top-16 h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]"
            animate={{
              y: [0, -55],
              x: [0, 12, -8],
              scale: [0.6, 1.4, 0.3],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />

          {/* Bara Api 2 (Oranye Merah Nyala) */}
          <motion.div
            className="absolute right-14 top-20 h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_6px_#EA580C]"
            animate={{
              y: [0, -48],
              x: [0, -10, 6],
              scale: [0.7, 1.3, 0.2],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.1,
            }}
          />
        </div>
      )}

      {/* ── EFEK AURA ROBOT: PERCIKAN LISTRIK CYAN / NEON ── */}
      {isRobot && (
        <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
          {/* Petir 1: Di dekat antena atas */}
          <motion.svg
            viewBox="0 0 24 32"
            className="absolute left-1/2 -top-4 -translate-x-1/2 h-8 w-6 text-cyan-300 drop-shadow-[0_0_6px_#22D3EE]"
            animate={{
              opacity: [0, 1, 0, 0.9, 0],
              scale: [0.8, 1.25, 0.9],
              rotate: [0, 8, -6, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: "easeInOut",
            }}
          >
            <path
              d="M 14 0 L 6 12 L 13 14 L 8 28 L 18 13 L 11 11 Z"
              fill="#22D3EE"
              stroke="#06B6D4"
              strokeWidth="1.5"
            />
          </motion.svg>

          {/* Petir 2: Di samping sayap kiri */}
          <motion.svg
            viewBox="0 0 20 28"
            className="absolute -left-2 top-1/3 h-7 w-5 text-cyan-400 drop-shadow-[0_0_5px_#22D3EE]"
            animate={{
              opacity: [0, 0.95, 0.2, 1, 0],
              scale: [0.7, 1.2, 0.8],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 0.7,
              delay: 0.5,
              ease: "easeInOut",
            }}
          >
            <path
              d="M 12 0 L 4 10 L 10 11 L 6 22 L 15 10 L 9 9 Z"
              fill="#22D3EE"
              stroke="#06B6D4"
              strokeWidth="1.2"
            />
          </motion.svg>

          {/* Petir 3: Di samping sayap kanan */}
          <motion.svg
            viewBox="0 0 20 28"
            className="absolute -right-2 top-1/4 h-7 w-5 text-cyan-400 drop-shadow-[0_0_5px_#22D3EE]"
            animate={{
              opacity: [0, 1, 0.3, 0.8, 0],
              scale: [0.9, 1.3, 0.85],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              repeatDelay: 0.5,
              delay: 1.0,
              ease: "easeInOut",
            }}
          >
            <path
              d="M 12 0 L 4 10 L 10 11 L 6 22 L 15 10 L 9 9 Z"
              fill="#22D3EE"
              stroke="#06B6D4"
              strokeWidth="1.2"
            />
          </motion.svg>

          {/* Lingkaran Pulsa Elektromagnetik di dasar */}
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full border border-cyan-400/60 bg-cyan-400/20 blur-xs"
            animate={{
              scaleX: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* ── EFEK AURA PHOENIX ES: KRISTAL SEGI ENAM (HEXAGON) MELAYANG TURUN ── */}
      {isPhoenixIce && (
        <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
          {/* Kristal Hexagon 1 (Kiri Atas ke Bawah) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute left-3 -top-2 h-4 w-4 drop-shadow-[0_0_5px_#38BDF8]"
            animate={{
              y: [-10, 80],
              x: [0, 12, -6],
              rotate: [0, 90, 180],
              opacity: [0, 0.95, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          >
            <polygon
              points="12,2 21,7.2 21,16.8 12,22 3,16.8 3,7.2"
              fill="#E0F2FE"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </motion.svg>

          {/* Kristal Hexagon 2 (Kanan Atas ke Bawah) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute right-5 -top-4 h-5 w-5 drop-shadow-[0_0_6px_#38BDF8]"
            animate={{
              y: [-15, 85],
              x: [0, -14, 8],
              rotate: [0, -60, -180],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <polygon
              points="12,2 21,7.2 21,16.8 12,22 3,16.8 3,7.2"
              fill="#BAE6FD"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </motion.svg>

          {/* Kristal Hexagon 3 (Tengah Kepala) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute left-1/2 -top-6 -translate-x-1/2 h-4 w-4 drop-shadow-[0_0_5px_#7DD3FC]"
            animate={{
              y: [-10, 75],
              x: [0, 8, -8],
              rotate: [0, 120, 240],
              opacity: [0, 0.85, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <polygon
              points="12,2 21,7.2 21,16.8 12,22 3,16.8 3,7.2"
              fill="#FFFFFF"
              stroke="#BAE6FD"
              strokeWidth="1.5"
            />
          </motion.svg>

          {/* Kristal Hexagon 4 (Samping Kiri Badan) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute -left-3 top-1/3 h-4 w-4 drop-shadow-[0_0_5px_#38BDF8]"
            animate={{
              y: [0, 70],
              x: [0, 10, -4],
              rotate: [0, 60, 120],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: 2.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.1,
            }}
          >
            <polygon
              points="12,2 21,7.2 21,16.8 12,22 3,16.8 3,7.2"
              fill="#7DD3FC"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          </motion.svg>

          {/* Kristal Hexagon 5 (Samping Kanan Badan) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute -right-2 top-1/4 h-3.5 w-3.5 drop-shadow-[0_0_5px_#BAE6FD]"
            animate={{
              y: [0, 65],
              x: [0, -8, 6],
              rotate: [0, -90, -180],
              opacity: [0, 0.85, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.9,
            }}
          >
            <polygon
              points="12,2 21,7.2 21,16.8 12,22 3,16.8 3,7.2"
              fill="#E0F2FE"
              stroke="#7DD3FC"
              strokeWidth="1.5"
            />
          </motion.svg>

          {/* Pendar Salju di Bawah */}
          <motion.div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 h-3 w-28 rounded-full bg-sky-300/30 blur-xs"
            animate={{
              scale: [0.9, 1.15, 0.9],
              opacity: [0.3, 0.65, 0.3],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* ── EFEK AURA PHOENIX EMAS: PARTIKEL BINTANG SPARKLE BERKEDIP ── */}
      {isPhoenixGold && (
        <div className="pointer-events-none absolute inset-0 overflow-visible z-20">
          {/* Bintang Sparkle 1 (Kiri Atas) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute left-2 top-4 h-6 w-6 text-yellow-300 drop-shadow-[0_0_8px_#FBBF24]"
            animate={{
              scale: [0, 1.3, 0],
              rotate: [0, 45, 90],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          >
            <path
              d="M 12 0 C 12 7, 17 12, 24 12 C 17 12, 12 17, 12 24 C 12 17, 7 12, 0 12 C 7 12, 12 7, 12 0 Z"
              fill="#FDE047"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          </motion.svg>

          {/* Bintang Sparkle 2 (Kanan Atas) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute right-4 -top-3 h-7 w-7 text-amber-300 drop-shadow-[0_0_10px_#F59E0B]"
            animate={{
              scale: [0, 1.4, 0],
              rotate: [0, -45, -90],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          >
            <path
              d="M 12 0 C 12 7, 17 12, 24 12 C 17 12, 12 17, 12 24 C 12 17, 7 12, 0 12 C 7 12, 12 7, 12 0 Z"
              fill="#FEF08A"
              stroke="#F59E0B"
              strokeWidth="1"
            />
          </motion.svg>

          {/* Bintang Sparkle 3 (Puncak Kepala) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute left-1/2 -top-5 -translate-x-1/2 h-5 w-5 text-yellow-100 drop-shadow-[0_0_8px_#FDE047]"
            animate={{
              scale: [0, 1.25, 0],
              rotate: [0, 60, 120],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.1,
            }}
          >
            <path
              d="M 12 0 C 12 7, 17 12, 24 12 C 17 12, 12 17, 12 24 C 12 17, 7 12, 0 12 C 7 12, 12 7, 12 0 Z"
              fill="#FFFFFF"
              stroke="#FDE047"
              strokeWidth="1"
            />
          </motion.svg>

          {/* Bintang Sparkle 4 (Sayap Kiri) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute -left-3 top-1/2 h-5 w-5 text-amber-400 drop-shadow-[0_0_7px_#FBBF24]"
            animate={{
              scale: [0, 1.2, 0],
              rotate: [0, -30, -60],
              opacity: [0, 0.95, 0],
            }}
            transition={{
              duration: 1.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <path
              d="M 12 0 C 12 7, 17 12, 24 12 C 17 12, 12 17, 12 24 C 12 17, 7 12, 0 12 C 7 12, 12 7, 12 0 Z"
              fill="#FDE047"
              stroke="#D97706"
              strokeWidth="1"
            />
          </motion.svg>

          {/* Bintang Sparkle 5 (Sayap Kanan) */}
          <motion.svg
            viewBox="0 0 24 24"
            className="absolute -right-3 top-1/3 h-5 w-5 text-yellow-300 drop-shadow-[0_0_7px_#FBBF24]"
            animate={{
              scale: [0, 1.3, 0],
              rotate: [0, 45, 90],
              opacity: [0, 0.95, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.4,
            }}
          >
            <path
              d="M 12 0 C 12 7, 17 12, 24 12 C 17 12, 12 17, 12 24 C 12 17, 7 12, 0 12 C 7 12, 12 7, 12 0 Z"
              fill="#FEF08A"
              stroke="#F59E0B"
              strokeWidth="1"
            />
          </motion.svg>

          {/* Cahaya Emas Lembut Melingkar di Bawah */}
          <motion.div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 h-4 w-28 rounded-full bg-amber-400/35 blur-xs"
            animate={{
              scale: [0.85, 1.2, 0.85],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* ── EFEK AURA PHOENIX KEGELAPAN: PARTIKEL BULAT UNGU MEMBESAR LALU MEMUDAR ── */}
      {isPhoenixDark && (
        <div className="pointer-events-none absolute inset-0 overflow-visible z-0">
          {/* Asap Roh Ungu 1 (Kiri Atas) */}
          <motion.div
            className="absolute left-6 top-8 h-8 w-8 rounded-full bg-purple-700/60 blur-md"
            animate={{
              y: [0, -50],
              x: [0, -14],
              scale: [0.5, 2.3],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.1,
            }}
          />

          {/* Asap Roh Ungu 2 (Kanan Atas) */}
          <motion.div
            className="absolute right-6 top-10 h-9 w-9 rounded-full bg-fuchsia-800/60 blur-md"
            animate={{
              y: [0, -55],
              x: [0, 16],
              scale: [0.6, 2.5],
              opacity: [0, 0.75, 0],
            }}
            transition={{
              duration: 3.0,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.7,
            }}
          />

          {/* Asap Roh Ungu 3 (Belakang Kepala/Punggung) */}
          <motion.div
            className="absolute left-1/2 top-4 -translate-x-1/2 h-10 w-10 rounded-full bg-purple-900/70 blur-md"
            animate={{
              y: [0, -45],
              scale: [0.6, 2.7],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.3,
            }}
          />

          {/* Asap Roh Ungu 4 (Sayap Kiri Bawah) */}
          <motion.div
            className="absolute -left-2 top-1/2 h-7 w-7 rounded-full bg-indigo-900/60 blur-md"
            animate={{
              y: [0, -40],
              x: [0, -10],
              scale: [0.4, 2.0],
              opacity: [0, 0.65, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.4,
            }}
          />

          {/* Asap Roh Ungu 5 (Sayap Kanan Bawah) */}
          <motion.div
            className="absolute -right-2 top-1/2 h-7 w-7 rounded-full bg-purple-950/60 blur-md"
            animate={{
              y: [0, -42],
              x: [0, 10],
              scale: [0.5, 2.1],
              opacity: [0, 0.65, 0],
            }}
            transition={{
              duration: 2.7,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.0,
            }}
          />

          {/* Percikan Orb Pendar Ungu Neon */}
          <motion.div
            className="absolute left-1/2 top-12 -translate-x-1/2 h-3 w-3 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#C084FC]"
            animate={{
              y: [0, -48],
              scale: [0.5, 1.5, 0.2],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>
      )}

      {/* Konten Utama Maskot */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
