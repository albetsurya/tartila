import { useState } from "react";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { SparklesSvg, CheckSvg, ArrowRight } from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";

export type ArenaRole = "santri" | "ustadz";

export interface OnboardingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialRole?: ArenaRole;
}

export function OnboardingModal({ isOpen, onClose, initialRole }: OnboardingModalProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState<boolean>(() => {
    if (isOpen !== undefined) return isOpen;
    return localStorage.getItem("tartila_onboarded") !== "true";
  });
  const [selectedRole, setSelectedRole] = useState<ArenaRole | null>(initialRole || null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const visible = isOpen !== undefined ? isOpen : internalOpen;

  if (!visible) return null;

  const handleSelectRole = (role: ArenaRole) => {
    setSelectedRole(role);
    setCurrentSlide(0);
  };

  const handleFinish = () => {
    localStorage.setItem("tartila_onboarded", "true");
    if (selectedRole) {
      localStorage.setItem("tartila_user_role", selectedRole);
    }
    setInternalOpen(false);
    onClose?.();
  };

  // 3 Slides Santri
  const santriSlides = [
    {
      title: "Belajar Al-Qur'an Lebih Asyik",
      desc: "Pelajari jilid Tilawati dengan audio pelafalan asli, tuntunan makhraj huruf, dan adab membaca yang tartil.",
      badge: "Langkah 1: Belajar",
      speech: "Mari mengaji bersamaku!",
      mood: "excited" as const,
      animation: "bounce" as const,
    },
    {
      title: "Bermain Kuis & Game Edukatif",
      desc: "Uji ketangkasan membaca lewat belasan mini-game: Hijaiyah Pop, Tajwid Tetris, Ayat Hunter, dan Doa Dungeon.",
      badge: "Langkah 2: Bermain",
      speech: "Kumpulkan skor tertinggi!",
      mood: "happy" as const,
      animation: "float" as const,
    },
    {
      title: "Tartila Arena via PIN 6-Digit",
      desc: "Tantang teman sekelas dalam kuis multiplayer real-time! Masukkan PIN dari Ustadz dan rebut podium juara.",
      badge: "Langkah 3: Bertanding",
      speech: "Siap jadi juara Tartila?",
      mood: "excited" as const,
      animation: "bounce" as const,
    },
  ];

  // 3 Slides Ustadz
  const ustadzSlides = [
    {
      title: "Manajemen Kelas & Pembelajaran",
      desc: "Pantau perkembangan mengaji santri secara terpusat, atur kurikulum Tilawati, dan rekam riwayat bacaan.",
      badge: "Langkah 1: Kelas",
      speech: "Ahlan wa Sahlan, Ustadz!",
      mood: "happy" as const,
      animation: "float" as const,
    },
    {
      title: "Ujian Real-Time & Anti-Cheat",
      desc: "Buka room ujian resmi (UTS/UKK). Sistem otomatis mendeteksi santri yang berpindah tab dan mengacak urutan soal.",
      badge: "Langkah 2: Evaluasi",
      speech: "Evaluasi adil & objektif.",
      mood: "thinking" as const,
      animation: "float" as const,
    },
    {
      title: "Laporan & Cetak Rapor PDF",
      desc: "Dapatkan analisis rata-rata penguasaan Tilawati & Tajwid santri, lalu unduh dokumen rapor PDF ber-KOP resmi dalam satu klik.",
      badge: "Langkah 3: Rapor",
      speech: "Rapor rapi siap cetak!",
      mood: "excited" as const,
      animation: "bounce" as const,
    },
  ];

  const slides = selectedRole === "ustadz" ? ustadzSlides : santriSlides;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-[32px] border-[4px] border-[#134E4A] bg-white p-6 md:p-8 shadow-[8px_8px_0px_#134E4A] text-center overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Step 0: Pemilihan Role Santri vs Ustadz (Tahap 9) */}
        {!selectedRole ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <TilaMascot size={88} mood="excited" animation="bounce" direction="front" speech="Selamat Datang di Tartila!" />
              <h2 className="mt-3 font-display text-2xl md:text-3xl font-black text-[#134E4A]">
                Pilih Peran Pengguna
              </h2>
              <p className="text-xs font-bold text-[#134E4A]/70 mt-1 max-w-sm">
                Pilih peran untuk menyesuaikan pengalaman belajar dan fitur yang tersedia untukmu.
              </p>
            </div>

            {/* 2 Tombol Raksasa Neo-Brutalism */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleSelectRole("santri")}
                className="p-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#CCFBF1] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[1px_1px_0px_#134E4A] transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl border-2 border-[#134E4A] bg-white flex items-center justify-center text-2xl mb-3 shadow-[2px_2px_0px_#134E4A]">
                    🎒
                  </div>
                  <h3 className="font-display text-lg font-black text-[#134E4A]">
                    Santri Cilik
                  </h3>
                  <p className="mt-1 text-xs font-bold text-[#134E4A]/80 leading-relaxed">
                    Saya ingin belajar mengaji, bermain game kuis, dan gabung kuis via PIN.
                  </p>
                </div>
                <span className="mt-4 text-xs font-black text-[#0D9488] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Mulai sebagai Santri →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole("ustadz")}
                className="p-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[1px_1px_0px_#134E4A] transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl border-2 border-[#134E4A] bg-white flex items-center justify-center text-2xl mb-3 shadow-[2px_2px_0px_#134E4A]">
                    👨‍🏫
                  </div>
                  <h3 className="font-display text-lg font-black text-[#134E4A]">
                    Ustadz / Guru
                  </h3>
                  <p className="mt-1 text-xs font-bold text-[#134E4A]/80 leading-relaxed">
                    Saya ingin membuat room kuis ujian, memantau kelas, dan mencetak rapor.
                  </p>
                </div>
                <span className="mt-4 text-xs font-black text-[#B45309] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Mulai sebagai Ustadz →
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Step 1-3: 3 Slide Panduan Berdasarkan Role */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#134E4A]/10 pb-3">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#134E4A] bg-[#FEF3C7] text-[#134E4A]">
                {slides[currentSlide].badge}
              </span>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-xs font-black text-[#134E4A]/60 hover:text-[#134E4A] underline"
              >
                Ubah Peran ({selectedRole})
              </button>
            </div>

            {/* Konten Slide */}
            <div className="flex flex-col items-center">
              <TilaMascot
                size={96}
                mood={slides[currentSlide].mood}
                animation={slides[currentSlide].animation}
                direction="front"
                speech={slides[currentSlide].speech}
              />
              <h2 className="mt-4 font-display text-xl md:text-2xl font-black text-[#134E4A]">
                {slides[currentSlide].title}
              </h2>
              <p className="mt-2 text-xs md:text-sm font-bold text-[#134E4A]/80 max-w-md leading-relaxed">
                {slides[currentSlide].desc}
              </p>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center items-center gap-2 pt-2">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 rounded-full border border-[#134E4A] transition-all ${
                    idx === currentSlide
                      ? "w-8 bg-[#0D9488]"
                      : "w-2.5 bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Button */}
            <div className="pt-2">
              {currentSlide < slides.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentSlide(currentSlide + 1)}
                  className="w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-base shadow-[4px_4px_0px_#134E4A] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Lanjutkan <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#FACC15] text-[#134E4A] font-black text-lg shadow-[5px_5px_0px_#134E4A] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Mulai Petualangan! 🚀
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingModal;
