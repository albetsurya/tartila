import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  CheckSvg,
  ArrowRight,
  BackpackSvg,
  GraduationCapSvg,
  RocketSvg,
  BookOpen,
  GamepadSvg,
  TrophySvg,
  SparklesSvg,
} from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";

export type ArenaRole = "santri" | "ustadz";

export interface OnboardingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialRole?: ArenaRole;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export function OnboardingModal({
  isOpen,
  onClose,
  initialRole,
}: OnboardingModalProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState<boolean>(() => {
    if (isOpen !== undefined) return isOpen;
    return localStorage.getItem("tartila_onboarded") !== "true";
  });
  const [selectedRole, setSelectedRole] = useState<ArenaRole | null>(
    initialRole || null,
  );

  // Menggunakan array [currentSlide, direction] untuk animasi geser (swipe)
  const [[currentSlide, direction], setPage] = useState([0, 0]);

  const visible = isOpen !== undefined ? isOpen : internalOpen;

  if (!visible) return null;

  const handleSelectRole = (role: ArenaRole) => {
    setSelectedRole(role);
    setPage([0, 0]);
  };

  const handleFinish = () => {
    localStorage.setItem("tartila_onboarded", "true");
    if (selectedRole) {
      localStorage.setItem("tartila_user_role", selectedRole);
    }
    setInternalOpen(false);
    onClose?.();
  };

  const paginate = (newDirection: number) => {
    setPage([currentSlide + newDirection, newDirection]);
  };

  // 3 Slides Santri (Disesuaikan dengan fitur aktif)
  const santriSlides = [
    {
      title: "Belajar Al-Qur'an Lebih Asyik",
      desc: "Pelajari jilid Tilawati dengan audio pelafalan asli, tuntunan makhraj huruf, dan adab membaca yang tartil.",
      badge: "Langkah 1: Belajar",
      speech: "Mari mengaji bersamaku!",
      mood: "excited" as const,
      animation: "bounce" as const,
      color: "bg-[#CCFBF1]", // Teal pastel
      Icon: BookOpen,
      iconColor: "text-[#0D9488]",
    },
    {
      title: "Bermain Game & Kumpulkan XP",
      desc: "Uji ketangkasanmu lewat mini-game seru: Hijaiyah Harvest, Harakat Slasher, Ayat Scramble, dan Hijaiyah 2048!",
      badge: "Langkah 2: Bermain",
      speech: "Kumpulkan skor tertinggi!",
      mood: "happy" as const,
      animation: "float" as const,
      color: "bg-[#FEF3C7]", // Amber pastel
      Icon: GamepadSvg,
      iconColor: "text-[#D97706]",
    },
    {
      title: "Tantang Teman di Arena & Duel",
      desc: "Main bareng di Tartila Arena via PIN, atau tantang temanmu 1 lawan 1 di fitur Duel. Rebut posisi teratas di Leaderboard!",
      badge: "Langkah 3: Bertanding",
      speech: "Siap jadi juara Tartila?",
      mood: "excited" as const,
      animation: "bounce" as const,
      color: "bg-[#FFE4E6]", // Coral pastel
      Icon: TrophySvg,
      iconColor: "text-[#E11D48]",
    },
  ];

  // 3 Slides Ustadz (Disesuaikan dengan fitur kelas & audit)
  const ustadzSlides = [
    {
      title: "Manajemen Kelas Terpusat",
      desc: "Atur kurikulum Tartila, pantau perkembangan santri, dan kelola ruang kelas belajar Tartila dengan mudah.",
      badge: "Langkah 1: Kelas",
      speech: "Ahlan wa Sahlan, Ustadz!",
      mood: "happy" as const,
      animation: "float" as const,
      color: "bg-[#E0F2FE]",
      Icon: GraduationCapSvg,
      iconColor: "text-[#0284C7]",
    },
    {
      title: "Ujian Real-Time & Anti-Cheat",
      desc: "Buka Room Ujian resmi. Sistem otomatis mendeteksi santri yang mencoba curang (pindah tab) dan mengacak urutan soal.",
      badge: "Langkah 2: Evaluasi",
      speech: "Evaluasi adil & objektif.",
      mood: "thinking" as const,
      animation: "float" as const,
      color: "bg-[#EDE9FE]",
      Icon: CheckSvg,
      iconColor: "text-[#7C3AED]",
    },
    {
      title: "Matriks & Laporan Santri",
      desc: "Dapatkan analisis hasil belajar santri, pantau audit aktivitas, dan lihat rekapitulasi kuis dalam satu dashboard terpusat.",
      badge: "Langkah 3: Laporan",
      speech: "Pantau progres santri!",
      mood: "excited" as const,
      animation: "bounce" as const,
      color: "bg-[#FEF08A]",
      Icon: SparklesSvg,
      iconColor: "text-[#B45309]",
    },
  ];

  const slides = selectedRole === "ustadz" ? ustadzSlides : santriSlides;
  const CurrentIcon = slides[currentSlide].Icon;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-[32px] border-[4px] border-[#134E4A] bg-[#F0FDF4] p-6 md:p-8 shadow-[8px_8px_0px_#134E4A] text-center overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Ornamen Latar Belakang */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FACC15] rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#0D9488] rounded-full blur-2xl" />
        </div>

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {/* ========================================================
              STEP 0: PEMILIHAN ROLE (SANTRI vs USTADZ)
             ======================================================== */}
          {!selectedRole ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 relative z-10"
            >
              <div className="flex flex-col items-center">
                <TilaMascot
                  size={100}
                  mood="excited"
                  animation="bounce"
                  direction="front"
                  speech="Selamat Datang di Tartila!"
                />
                <h2 className="mt-4 font-display text-2xl md:text-3xl font-black text-[#134E4A]">
                  Mau Mulai dari Mana?
                </h2>
                <p className="text-xs font-bold text-[#134E4A]/70 mt-1 max-w-sm">
                  Pilih peranmu untuk menyesuaikan pengalaman dan fitur yang
                  akan kamu gunakan.
                </p>
              </div>

              {/* 2 Tombol Raksasa Neo-Brutalism */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ y: 2, scale: 0.98 }}
                  type="button"
                  onClick={() => handleSelectRole("santri")}
                  className="p-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#CCFBF1] shadow-[4px_4px_0px_#134E4A] transition-all text-left group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl border-2 border-[#134E4A] bg-white flex items-center justify-center mb-3 shadow-[2px_2px_0px_#134E4A]">
                      <BackpackSvg size={28} className="text-[#0D9488]" />
                    </div>
                    <h3 className="font-display text-lg font-black text-[#134E4A]">
                      Santri Cilik
                    </h3>
                    <p className="mt-1 text-xs font-bold text-[#134E4A]/80 leading-relaxed">
                      Saya ingin belajar mengaji, bermain game kuis, dan gabung
                      kuis via PIN.
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-black text-[#0D9488] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Mulai sebagai Santri</span>
                    <ArrowRight size={13} />
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ y: 2, scale: 0.98 }}
                  type="button"
                  onClick={() => handleSelectRole("ustadz")}
                  className="p-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] shadow-[4px_4px_0px_#134E4A] transition-all text-left group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl border-2 border-[#134E4A] bg-white flex items-center justify-center mb-3 shadow-[2px_2px_0px_#134E4A]">
                      <GraduationCapSvg size={28} className="text-[#B45309]" />
                    </div>
                    <h3 className="font-display text-lg font-black text-[#134E4A]">
                      Ustadz / Guru
                    </h3>
                    <p className="mt-1 text-xs font-bold text-[#134E4A]/80 leading-relaxed">
                      Saya ingin membuat room kuis ujian, memantau kelas, dan
                      mencetak rapor.
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-black text-[#B45309] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Mulai sebagai Ustadz</span>
                    <ArrowRight size={13} />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* ========================================================
               STEP 1-3: SLIDES PANDUAN (MASCOT GUIDE STYLE)
               ======================================================== */
            <motion.div
              key="slides"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 relative z-10"
            >
              <div className="flex items-center justify-between border-b-2 border-[#134E4A]/10 pb-3">
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  {slides[currentSlide].badge}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-xs font-black text-[#134E4A]/60 hover:text-[#134E4A] underline"
                >
                  Ubah Peran
                </button>
              </div>

              {/* Konten Slide dengan Animasi Framer Motion */}
              <div className="relative overflow-hidden min-h-[280px] flex items-center">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="w-full flex flex-col md:flex-row items-center gap-6 md:gap-8 px-2"
                  >
                    {/* Area Maskot & Ikon Melayang */}
                    <div className="relative shrink-0 flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className={`absolute -top-4 -right-4 z-20 w-10 h-10 rounded-xl border-[2px] border-[#134E4A] flex items-center justify-center shadow-[2px_2px_0px_#134E4A] ${slides[currentSlide].color}`}
                      >
                        <CurrentIcon
                          size={20}
                          className={slides[currentSlide].iconColor}
                        />
                      </motion.div>

                      <TilaMascot
                        size={110}
                        mood={slides[currentSlide].mood}
                        animation={slides[currentSlide].animation}
                        direction="front"
                      />

                      {/* Panah Penunjuk (Hanya muncul di Desktop) */}
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                        className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-[#134E4A] z-10"
                      >
                        <ArrowRight size={28} strokeWidth={3} />
                      </motion.div>
                    </div>

                    {/* Balon Teks (Speech Bubble) */}
                    <div className="relative bg-white border-[3px] border-[#134E4A] p-4 md:p-5 rounded-2xl shadow-[4px_4px_0px_#134E4A] text-left w-full">
                      {/* Ekor Balon Percakapan (Desktop) */}
                      <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l-[3px] border-b-[3px] border-[#134E4A] rotate-45" />

                      {/* Ekor Balon Percakapan (Mobile) */}
                      <div className="md:hidden absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-[3px] border-l-[3px] border-[#134E4A] rotate-45" />

                      <h2 className="font-display text-lg md:text-xl font-black text-[#134E4A]">
                        {slides[currentSlide].title}
                      </h2>
                      <p className="mt-2 text-xs md:text-sm font-bold text-[#134E4A]/80 leading-relaxed">
                        {slides[currentSlide].desc}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center items-center gap-2 pt-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage([idx, idx > currentSlide ? 1 : -1])}
                    className={`h-3 rounded-full border-2 border-[#134E4A] transition-all cursor-pointer ${
                      idx === currentSlide
                        ? "w-8 bg-[#0D9488] shadow-[1px_1px_0px_#134E4A]"
                        : "w-3 bg-white opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Ke Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Button */}
              <div className="pt-2">
                {currentSlide < slides.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => paginate(1)}
                    className="w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-base shadow-[4px_4px_0px_#134E4A] transition-all flex items-center justify-center gap-2"
                  >
                    Lanjutkan <ArrowRight size={18} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleFinish}
                    className="w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#FACC15] text-[#134E4A] font-black text-lg shadow-[5px_5px_0px_#134E4A] transition-all flex items-center justify-center gap-2"
                  >
                    Mulai Petualangan! <RocketSvg size={20} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OnboardingModal;
