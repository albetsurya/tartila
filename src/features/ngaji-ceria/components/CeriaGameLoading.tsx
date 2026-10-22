import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TilaMascot,
  type TilaMood,
  type TilaAnimation,
  type TilaDirection,
} from "@/components/ui/TilaMascot";
import { useEconomyStore } from "../hooks/useEconomyStore";
import { getMascotName, resolveMascotGender } from "@/utils/mascotHelper";
import { SparklesSvg, GamepadSvg, StarSvg } from "@/components/ui/CustomIcons";

const TIPS = [
  "Awali belajar membaca Al-Qur'an dengan bacaan Ta'awudz & Basmalah.",
  "Setiap huruf Al-Qur'an bernilai 10 kebaikan di sisi Allah SWT.",
  "Dengarkan irama Rost: Datar, Naik, lalu Turun dengan tenang.",
  "Bintang dan koin tersimpan otomatis ke akun Tartila kamu!",
  "Latih konsistensi mengaji setiap hari untuk menjaga streak.",
  "Tetap sabar dan teliti saat mencocokkan hukum tajwid.",
  "Doa adalah senjata orang beriman, amalkan doa harianmu ya!",
];

interface CeriaGameLoadingProps {
  onLoaded?: () => void;
  durationMs?: number;
  subtitle?: string;
}

export function CeriaGameLoading({
  onLoaded,
  durationMs = 1800,
  subtitle = "Memuat Petualangan Mengaji…",
}: CeriaGameLoadingProps) {
  const [progress, setProgress] = useState(12);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  const rawGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const mascotGender = resolveMascotGender(rawGender);
  const mascotName = getMascotName(mascotGender);

  useEffect(() => {
    const startTime = Date.now();
    let completionTimer: number | undefined;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(Math.max(12, pct));

      if (pct >= 100) {
        clearInterval(interval);
        completionTimer = window.setTimeout(() => onLoadedRef.current?.(), 150);
      }
    }, 40);

    return () => {
      clearInterval(interval);
      if (completionTimer !== undefined) window.clearTimeout(completionTimer);
    };
  }, [durationMs]);

  // Pose & ekspresi dinamis sesuai tahapan loading
  let mood: TilaMood = "greeting";
  let animation: TilaAnimation = "bounce";
  let direction: TilaDirection = "front";
  let speech = `Bismillah! ${mascotName} sedang menyiapkan arena…`;

  if (progress >= 75) {
    mood = "excited";
    animation = "bounce";
    direction = "front";
    speech = `Alhamdulillah siap! Ayo raih skor terbaikmu!`;
  } else if (progress >= 35) {
    mood = "thinking";
    animation = "float";
    direction = "right";
    speech = `Mengasah hafalan dan materi Tilawati…`;
  }

  return (
    <div
      className="fixed inset-0 z-[120] bg-[#FFFDF0] flex flex-col items-center justify-between p-6 select-none font-sans overflow-hidden"
      role="status"
      aria-live="polite"
      aria-busy={progress < 100}
    >
      {/* Top Header Badge */}
      <div className="z-10 pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A]">
          <GamepadSvg size={14} />
          <span>ARENA NGAJI CERIA</span>
        </div>
      </div>

      {/* Main Mascot Stage Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm z-10 w-full">
        {/* Dynamic Speech Bubble */}
        <div className="h-14 flex items-end justify-center mb-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={speech}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              className="relative px-3.5 py-1.5 rounded-2xl border-[2.5px] border-[#134E4A] bg-white shadow-[2.5px_2.5px_0px_#134E4A] max-w-[280px]"
            >
              <p className="text-[11px] font-black text-[#134E4A] leading-tight">
                {speech}
              </p>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-[2.5px] border-b-[2.5px] border-[#134E4A] rotate-45" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mascot Centerpiece */}
        <div className="relative flex flex-col items-center justify-center">
          <TilaMascot
            size={180}
            gender={mascotGender}
            mood={mood}
            animation={animation}
            direction={direction}
          />
          {/* Floor Rug */}
          <div className="w-44 h-7 -mt-2 rounded-[50%] border-[2.5px] border-[#134E4A] bg-[#A7F3D0] shadow-[2px_2px_0px_#134E4A] -z-10 flex items-center justify-center">
            <div className="w-36 h-4 rounded-[50%] border border-dashed border-[#134E4A]/30" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mt-4">
          <h2 className="font-display font-black text-2xl text-[#134E4A] tracking-tight">
            Tartila
          </h2>
          <p className="text-xs font-bold text-[#0D9488] mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* Bottom Progress Bar & Tips */}
      <div className="w-full max-w-sm z-10 space-y-3 pb-4">
        {/* Tips Card Neo-Brutalism */}
        <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-3.5 shadow-[3px_3px_0px_#134E4A]">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#0D9488]">
            <SparklesSvg size={13} />
            <span>Tips Mengaji & Bermain:</span>
          </div>
          <p className="text-xs font-bold text-[#134E4A] mt-1 leading-snug">
            "{TIPS[tipIndex]}"
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-black text-[#134E4A] px-1">
            <span className="flex items-center gap-1">
              <StarSvg size={12} className="text-[#F59E0B]" />
              <span>MEMUAT ARENA PERMAINAN</span>
            </span>
            <span className="px-1.5 py-0.2 rounded-md bg-[#FEF08A] border border-[#134E4A] text-[10px]">
              {progress}%
            </span>
          </div>
          <div className="w-full h-5 bg-white rounded-xl border-[2.5px] border-[#134E4A] p-0.5 shadow-[2px_2px_0px_#134E4A] overflow-hidden">
            <div
              className="h-full bg-[#0D9488] rounded-lg transition-all duration-100 flex items-center justify-end pr-1"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}