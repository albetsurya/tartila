import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  XSvg,
  HeartSvg,
  CheckSvg,
  StarSvg,
  Sparkles,
} from "./CustomIcons";
import {
  BasketCatchSvg,
  ItemMerahSvg,
} from "./Illustrations";

export type GameGuideId =
  | "hijaiyah-harvest"
  | "hijaiyah-2048"
  | "harakat-slasher"
  | "quiz-hub"
  | "ayat-scramble"
  | "tilawati-memory";

export interface GameGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  rules?: string[];
  simulation?: React.ReactNode;
  gameId?: GameGuideId;
}

// =========================================================================
// 1. SIMULASI VISUAL UNTUK TIAP GAME (Hanya render saat modal dibuka)
// =========================================================================

/** A. Simulasi Hijaiyah Harvest: Buah jatuh ke keranjang + Nyawa */
function HarvestSimulation() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#0F766E] border-2 border-[#134E4A] flex flex-col items-center justify-between p-2 select-none">
      {/* HUD mini simulasi: Target di kiri, Nyawa di kanan */}
      <div className="w-full flex items-center justify-between px-2 pt-1 z-10">
        <div className="flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 shadow-[1.5px_1.5px_0px_#134E4A]">
          <span className="text-[10px] font-black text-[#134E4A]">Target:</span>
          <span className="font-arabic text-sm font-bold text-[#134E4A]">بَ</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-white px-1.5 py-0.5 shadow-[1.5px_1.5px_0px_#134E4A]">
          <HeartSvg size={14} fill="#FF6B6B" stroke="#134E4A" />
          <HeartSvg size={14} fill="#FF6B6B" stroke="#134E4A" />
          <HeartSvg size={14} fill="#FF6B6B" stroke="#134E4A" />
        </div>
      </div>

      {/* Buah Jatuh */}
      <motion.div
        className="absolute z-20"
        initial={{ y: 20, scale: 1, opacity: 1 }}
        animate={{
          y: [20, 75, 80],
          scale: [1, 1, 0.4],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeIn",
          times: [0, 0.8, 1],
        }}
      >
        <ItemMerahSvg size={54} letter="بَ" />
      </motion.div>

      {/* Keranjang penangkap */}
      <motion.div
        className="absolute bottom-1 z-10"
        animate={{
          scale: [1, 1, 1.15, 1],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          times: [0, 0.75, 0.85, 1],
        }}
      >
        <BasketCatchSvg size={64} />
      </motion.div>

      {/* Teks Skor Feedback */}
      <motion.div
        className="absolute bottom-8 right-8 z-30 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 font-display text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
        animate={{
          opacity: [0, 0, 1, 0],
          y: [0, 0, -14, -20],
          scale: [0.8, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          times: [0, 0.78, 0.9, 1],
        }}
      >
        +100
      </motion.div>
    </div>
  );
}

/** B. Simulasi Hijaiyah 2048: Dua kotak Alif menyatu menjadi Ba */
function Game2048Simulation() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#FEF3C7] border-2 border-[#134E4A] flex items-center justify-center p-3 select-none">
      <div className="flex items-center gap-3 relative">
        {/* Slot Grid latar */}
        <div className="flex gap-3 p-2 rounded-2xl bg-[#FDE68A] border-2 border-[#134E4A]/40">
          <div className="w-14 h-14 rounded-xl bg-white/60 border-2 border-dashed border-[#134E4A]/30" />
          <div className="w-14 h-14 rounded-xl bg-white/60 border-2 border-dashed border-[#134E4A]/30" />
        </div>

        {/* Kotak Kiri (Alif) */}
        <motion.div
          className="absolute left-2 top-2 w-14 h-14 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FBBF24] shadow-[3px_3px_0px_#134E4A] flex items-center justify-center"
          animate={{
            x: [0, 34, 34, 0],
            opacity: [1, 1, 0, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            times: [0, 0.45, 0.5, 1],
            repeatDelay: 0.4,
          }}
        >
          <span className="font-arabic text-2xl font-black text-[#134E4A]">ا</span>
        </motion.div>

        {/* Kotak Kanan (Alif) -> Bergabung jadi Ba */}
        <motion.div
          className="absolute right-2 top-2 w-14 h-14 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FBBF24] shadow-[3px_3px_0px_#134E4A] flex items-center justify-center"
          animate={{
            x: [0, -34, -34, 0],
            opacity: [1, 1, 0, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            times: [0, 0.45, 0.5, 1],
            repeatDelay: 0.4,
          }}
        >
          <span className="font-arabic text-2xl font-black text-[#134E4A]">ا</span>
        </motion.div>

        {/* Kotak Hasil Penggabungan (Ba) */}
        <motion.div
          className="absolute left-[39px] top-2 w-14 h-14 rounded-xl border-[3px] border-[#134E4A] bg-[#34D399] shadow-[3px_3px_0px_#134E4A] flex items-center justify-center"
          animate={{
            scale: [0, 0, 1.25, 1, 1, 0],
            opacity: [0, 0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            times: [0, 0.48, 0.58, 0.7, 0.9, 1],
            repeatDelay: 0.4,
          }}
        >
          <span className="font-arabic text-2xl font-black text-[#134E4A]">ب</span>
        </motion.div>
      </div>

      {/* Indikator Arah Geser */}
      <motion.div
        className="absolute bottom-1 text-[11px] font-black uppercase text-[#134E4A] bg-white px-2 py-0.5 rounded-full border border-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        Geser & Gabung Huruf
      </motion.div>
    </div>
  );
}

/** C. Simulasi Harakat Slasher: Tangan swipe menebas buah harakat */
function SlasherSimulation() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#042F2E] border-2 border-[#134E4A] flex items-center justify-center select-none">
      {/* Target Huruf */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{
          scale: [1, 1.05, 0.8, 0],
          opacity: [1, 1, 0.8, 0],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          times: [0, 0.45, 0.55, 0.65],
          repeatDelay: 0.5,
        }}
      >
        <div className="h-20 w-20 rounded-full border-[3px] border-[#134E4A] bg-[#EF4444] shadow-[3px_3px_0px_#134E4A] flex items-center justify-center">
          <div className="h-14 w-14 rounded-full border-2 border-[#134E4A] bg-[#FFFBEB] flex items-center justify-center">
            <span className="font-arabic text-2xl font-black text-[#134E4A]">تَ</span>
          </div>
        </div>
      </motion.div>

      {/* Garis Tebasan Pedang/Swipe */}
      <motion.div
        className="absolute z-20 h-1.5 w-36 rounded-full bg-white shadow-[0_0_8px_#38BDF8]"
        initial={{ rotate: -35, scaleX: 0, opacity: 0, x: -50, y: 30 }}
        animate={{
          scaleX: [0, 1.3, 0],
          opacity: [0, 1, 0],
          x: [-40, 20, 60],
          y: [30, 0, -30],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          times: [0, 0.45, 0.6],
          repeatDelay: 0.5,
        }}
      />

      {/* Efek Slash Hit */}
      <motion.div
        className="absolute z-30 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-2.5 py-1 font-display text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
        animate={{
          scale: [0, 1.2, 1, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          times: [0, 0.5, 0.7, 0.85],
          repeatDelay: 0.5,
        }}
      >
        TEBAS!
      </motion.div>

      <div className="absolute bottom-1.5 text-[10px] font-black uppercase tracking-wider text-[#A7F3D0]">
        Geser Jari Melintasi Target
      </div>
    </div>
  );
}

/** D. Simulasi Pusat Kuis: Memilih opsi jawaban yang benar */
function QuizHubSimulation() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#F0FDF4] border-2 border-[#134E4A] flex flex-col justify-between p-3 select-none">
      {/* Pertanyaan Mini */}
      <div className="rounded-xl border-2 border-[#134E4A] bg-white px-3 py-1.5 text-center shadow-[2px_2px_0px_#134E4A]">
        <span className="text-[10px] font-black uppercase text-[#0D9488] block">
          Pilihan Ganda
        </span>
        <span className="font-arabic text-base font-bold text-[#134E4A]">
          حَمَلْنَا
        </span>
      </div>

      {/* Dua Opsi Pilihan */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        <motion.div
          className="rounded-xl border-2 border-[#134E4A] p-1.5 text-center font-display text-xs font-black shadow-[2px_2px_0px_#134E4A]"
          animate={{
            backgroundColor: ["#FFFFFF", "#FFFFFF", "#86EFAC", "#86EFAC"],
            borderColor: ["#134E4A", "#134E4A", "#134E4A", "#134E4A"],
            scale: [1, 1, 1.05, 1],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            times: [0, 0.45, 0.6, 1],
            repeatDelay: 0.4,
          }}
        >
          <div className="flex items-center justify-center gap-1 text-[#134E4A]">
            <CheckSvg size={13} className="text-[#059669]" />
            <span>hamalnaa</span>
          </div>
        </motion.div>

        <div className="rounded-xl border-2 border-[#134E4A] bg-white p-1.5 text-center font-display text-xs font-black text-[#134E4A]/60 shadow-[2px_2px_0px_#134E4A]">
          <span>fa-qulnaa</span>
        </div>
      </div>

      {/* Kursor Tangan */}
      <motion.div
        className="absolute z-20 pointer-events-none"
        animate={{
          x: [90, 45, 45, 90],
          y: [120, 85, 85, 120],
          scale: [1, 0.9, 0.9, 1],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          times: [0, 0.4, 0.55, 1],
          repeatDelay: 0.4,
        }}
      >
        <div className="h-6 w-6 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center text-[10px] font-black text-[#134E4A]">
          <CheckSvg size={12} strokeWidth={3} />
        </div>
      </motion.div>

      {/* Reward XP */}
      <motion.div
        className="absolute top-2 right-2 rounded-full border border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[10px] font-black text-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
        animate={{
          opacity: [0, 0, 1, 1, 0],
          y: [0, 0, -4, -4, -8],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          times: [0, 0.5, 0.6, 0.85, 1],
          repeatDelay: 0.4,
        }}
      >
        +20 XP
      </motion.div>
    </div>
  );
}

/** E. Simulasi Ayat Scramble: Dua kotak kata melayang dari kanan ke kiri */
function AyatScrambleSimulation() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#FFFBEB] border-2 border-[#134E4A] flex flex-col items-center justify-center p-3 select-none">
      {/* Garis Rak Penempatan Ayat (RTL: kanan ke kiri) */}
      <div className="w-full flex justify-center gap-2 p-2 rounded-xl border-2 border-dashed border-[#134E4A]/30 bg-white/70">
        <div className="w-20 h-10 rounded-lg border border-[#134E4A]/20 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 font-bold">
          Slot 2
        </div>
        <div className="w-20 h-10 rounded-lg border border-[#134E4A]/20 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 font-bold">
          Slot 1
        </div>
      </div>

      {/* Kartu Kata 1 (بِسْمِ) meluncur ke Slot 1 (kanan) */}
      <motion.div
        className="absolute z-10 w-20 h-10 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center"
        animate={{
          x: [90, 45, 45, 90],
          y: [35, -7, -7, 35],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          times: [0, 0.35, 0.85, 1],
          repeatDelay: 0.4,
        }}
      >
        <span className="font-arabic text-base font-bold text-[#134E4A]">بِسْمِ</span>
      </motion.div>

      {/* Kartu Kata 2 (اللّٰهِ) meluncur ke Slot 2 (kiri) */}
      <motion.div
        className="absolute z-10 w-20 h-10 rounded-lg border-2 border-[#134E4A] bg-[#BAE6FD] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center"
        animate={{
          x: [90, 90, -45, 90],
          y: [35, 35, -7, 35],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          times: [0, 0.35, 0.65, 1],
          repeatDelay: 0.4,
        }}
      >
        <span className="font-arabic text-base font-bold text-[#134E4A]">اللّٰهِ</span>
      </motion.div>

      <div className="absolute bottom-1.5 text-[10px] font-black uppercase text-[#134E4A]">
        Susun Kata dari Kanan ke Kiri
      </div>
    </div>
  );
}

/** F. Simulasi Tilawati Memory: Dua kartu tertutup dibalik hingga match */
function MemorySimulation() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#065F46] border-2 border-[#134E4A] flex items-center justify-center gap-4 p-3 select-none">
      {/* Kartu 1 */}
      <motion.div
        className="relative w-16 h-22 rounded-xl border-[2.5px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] flex items-center justify-center cursor-pointer"
        animate={{
          rotateY: [0, 180, 180, 0],
          backgroundColor: ["#B45309", "#FFFBEB", "#FFFBEB", "#B45309"],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          times: [0, 0.35, 0.85, 1],
          repeatDelay: 0.4,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.span
          className="font-arabic text-2xl font-black text-[#134E4A]"
          animate={{
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            times: [0, 0.35, 0.85, 1],
            repeatDelay: 0.4,
          }}
        >
          جَ
        </motion.span>
      </motion.div>

      {/* Kartu 2 */}
      <motion.div
        className="relative w-16 h-22 rounded-xl border-[2.5px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] flex items-center justify-center cursor-pointer"
        animate={{
          rotateY: [0, 0, 180, 0],
          backgroundColor: ["#B45309", "#B45309", "#FFFBEB", "#B45309"],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          times: [0, 0.35, 0.65, 1],
          repeatDelay: 0.4,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.span
          className="font-arabic text-2xl font-black text-[#134E4A]"
          animate={{
            opacity: [0, 0, 1, 0],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            times: [0, 0.35, 0.65, 1],
            repeatDelay: 0.4,
          }}
        >
          جَ
        </motion.span>
      </motion.div>

      {/* Efek Cocok / Match Sparkles */}
      <motion.div
        className="absolute z-20 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1 font-display text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] flex items-center gap-1"
        animate={{
          scale: [0, 0, 1.2, 1, 0],
          opacity: [0, 0, 1, 1, 0],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          times: [0, 0.65, 0.75, 0.9, 1],
          repeatDelay: 0.4,
        }}
      >
        <StarSvg size={14} fill="#D97706" />
        <span>COCOK!</span>
      </motion.div>
    </div>
  );
}

// =========================================================================
// 2. PRESET DATA PANDUAN UNTUK 6 GAME
// =========================================================================

export const GAME_GUIDES: Record<
  GameGuideId,
  { title: string; rules: string[]; simulation: React.ReactNode }
> = {
  "hijaiyah-harvest": {
    title: "Panduan Hijaiyah Harvest",
    rules: [
      "Tangkap buah yang hurufnya sesuai target di atas layar.",
      "Salah menangkap atau membiarkan buah target lolos akan mengurangi 1 nyawa.",
      "Kumpulkan skor sampai mencapai target sebelum waktu habis untuk menang.",
    ],
    simulation: <HarvestSimulation />,
  },
  "hijaiyah-2048": {
    title: "Panduan Hijaiyah 2048",
    rules: [
      "Geser papan ke atas, bawah, kiri, atau kanan.",
      "Gabungkan dua huruf yang sama menjadi huruf berikutnya (Alif + Alif = Ba).",
      "Rencanakan langkahmu agar seluruh petak papan tidak terkunci penuh.",
    ],
    simulation: <Game2048Simulation />,
  },
  "harakat-slasher": {
    title: "Panduan Harakat Slasher",
    rules: [
      "Tebas (swipe) buah berharakat yang benar sesuai target di atas.",
      "Hindari menebas huruf pengecoh agar kombo dan nyawa tidak hilang.",
      "Tebas target sebanyak-banyaknya sebelum batas waktu permainan berakhir.",
    ],
    simulation: <SlasherSimulation />,
  },
  "quiz-hub": {
    title: "Panduan Pusat Kuis",
    rules: [
      "Pilih mode Latihan Soal (pilihan ganda) atau Susun Kata (menyusun potongan kata).",
      "Pilih jawaban yang paling tepat secara cepat untuk mengumpulkan kombo.",
      "Kumpulkan XP dan Koin sebanyak-banyaknya untuk menaikkan peringkat santri.",
    ],
    simulation: <QuizHubSimulation />,
  },
  "ayat-scramble": {
    title: "Panduan Ayat Scramble",
    rules: [
      "Ketuk atau geser potongan kata dari kanan ke kiri untuk menyusun ayat yang benar.",
      "Waktu terbatas (45 detik per soal), perhatikan urutan harakat ayat.",
      "Selesaikan susunan ayat dengan benar untuk meraih kombo tertinggi.",
    ],
    simulation: <AyatScrambleSimulation />,
  },
  "tilawati-memory": {
    title: "Panduan Tilawati Memory",
    rules: [
      "Buka dua kartu untuk mencari pasangan huruf atau kata yang sama.",
      "Ingat posisi kartu yang telah kamu buka jika belum menemukan pasangannya.",
      "Cocokkan seluruh pasangan kartu sebelum waktu habis untuk meraih bintang 3.",
    ],
    simulation: <MemorySimulation />,
  },
};

// =========================================================================
// 3. KOMPONEN UTAMA MODAL PANDUAN NEO-BRUTALISM
// =========================================================================

export function GameGuideModal({
  isOpen,
  onClose,
  title,
  rules,
  simulation,
  gameId,
}: GameGuideModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Jika gameId dikirim, gunakan preset jika prop manual tidak diisi
  const preset = gameId ? GAME_GUIDES[gameId] : undefined;
  const activeTitle = title || preset?.title || "Panduan Bermain";
  const activeRules = rules || preset?.rules || [];
  const activeSimulation = simulation || preset?.simulation;

  // Tutup dengan Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeTitle}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
        >
          {/* Backdrop dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container Neo-Brutalism */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-[28px] border-[3.5px] border-[#134E4A] bg-[#FEF3C7] p-5 shadow-[6px_6px_0px_#134E4A] flex flex-col gap-4 text-[#134E4A]"
          >
            {/* Header: Judul & Tombol Close X */}
            <div className="flex items-center justify-between border-b-2 border-[#134E4A]/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] shadow-[1.5px_1.5px_0px_#134E4A]">
                  <Sparkles size={14} className="text-[#134E4A]" />
                </div>
                <h3 className="font-display text-base font-black text-[#134E4A] tracking-tight">
                  {activeTitle}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup panduan"
                className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-gray-50 transition-all cursor-pointer"
              >
                <XSvg size={14} />
              </button>
            </div>

            {/* Simulasi Visual: Kotak berbingkai tebal ~150px */}
            <div className="h-[150px] w-full rounded-2xl border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] overflow-hidden bg-white">
              {activeSimulation}
            </div>

            {/* Teks Aturan di Bawah Simulasi */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#0D9488]">
                Cara Bermain:
              </h4>
              <ul className="space-y-1.5">
                {activeRules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs font-bold leading-relaxed text-[#134E4A]"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#134E4A] bg-[#FEF08A] text-[10px] font-black text-[#134E4A]">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tombol Mengerti di Bawah */}
            <button
              type="button"
              onClick={onClose}
              className="mt-1 w-full rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] py-3 text-center font-display text-sm font-black text-white shadow-[3px_3px_0px_#134E4A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-[#0F766E] transition-all cursor-pointer"
            >
              Mengerti
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
