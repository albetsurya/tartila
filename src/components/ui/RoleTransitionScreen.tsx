import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  Star,
  Gamepad,
  BookOpen,
  GraduationCap,
  ClipboardList,
  Users,
  ChartBar,
  Shield,
  Settings,
  Lock,
  Key,
} from "@/components/ui/CustomIcons";

export type RoleType = "santri" | "ustadz" | "admin";

export interface RoleTransitionScreenProps {
  targetRole: RoleType;
  isVisible: boolean;
}

export function RoleTransitionScreen({
  targetRole,
  isVisible,
}: RoleTransitionScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={targetRole}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-sm select-none"
          style={{
            backgroundColor:
              targetRole === "admin"
                ? "rgba(15, 23, 42, 0.95)"
                : targetRole === "ustadz"
                  ? "rgba(224, 242, 254, 0.95)"
                  : "rgba(240, 253, 244, 0.95)",
          }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`relative w-full max-w-sm sm:max-w-md rounded-3xl p-6 sm:p-8 text-center ${
              targetRole === "admin"
                ? "border-[3px] border-[#EF4444] bg-[#0F172A] shadow-[8px_8px_0px_#EF4444]"
                : targetRole === "ustadz"
                  ? "border-[3px] border-[#134E4A] bg-white shadow-[8px_8px_0px_#134E4A]"
                  : "border-[3px] border-[#134E4A] bg-white shadow-[8px_8px_0px_#134E4A]"
            }`}
          >
            {/* Badge Kategori Transisi */}
            <div className="mb-4 flex justify-center">
              <span
                className={`inline-block -rotate-2 rounded-xl px-3.5 py-1 text-xs font-black tracking-wider uppercase ${
                  targetRole === "admin"
                    ? "border-2 border-[#EF4444] bg-[#EF4444] text-white shadow-[2px_2px_0px_#000]"
                    : targetRole === "ustadz"
                      ? "border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                      : "border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                }`}
              >
                {targetRole === "admin"
                  ? "SISTEM ADMINISTRATOR"
                  : targetRole === "ustadz"
                    ? "PORTAL PENDIDIK"
                    : "PETUALANGAN SANTRI"}
              </span>
            </div>

            {/* Ilustrasi & Ikon Dinamis per Role */}
            <div className="relative mx-auto my-6 flex h-36 w-full max-w-xs items-center justify-center">
              {targetRole === "santri" && (
                <>
                  {/* Ikon Mengambang Kiri Atas: Bintang */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "easeInOut",
                    }}
                    className="absolute left-2 top-1 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] p-2 text-[#854D0E] shadow-[2px_2px_0px_#134E4A]"
                  >
                    <Star size={20} />
                  </motion.div>

                  {/* Maskot Tengah: Tila Melompat */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut",
                    }}
                    className="z-10"
                  >
                    <TilaMascot size={105} mood="excited" animation="bounce" />
                  </motion.div>

                  {/* Ikon Mengambang Kanan Atas: Gamepad */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      delay: 0.3,
                      ease: "easeInOut",
                    }}
                    className="absolute right-2 top-2 rounded-xl border-2 border-[#134E4A] bg-[#E0E7FF] p-2 text-[#4338CA] shadow-[2px_2px_0px_#134E4A]"
                  >
                    <Gamepad size={20} />
                  </motion.div>

                  {/* Ikon Mengambang Kiri Bawah: Buku Terbuka */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.4,
                      delay: 0.5,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-1 left-4 rounded-xl border-2 border-[#134E4A] bg-[#CCFBF1] p-2 text-[#0D9488] shadow-[2px_2px_0px_#134E4A]"
                  >
                    <BookOpen size={20} />
                  </motion.div>
                </>
              )}

              {targetRole === "ustadz" && (
                <>
                  {/* Bingkai Papan Garis Putus-putus */}
                  <div className="absolute inset-1 rounded-2xl border-2 border-dashed border-[#134E4A]/30 bg-[#F0FDF4]/50" />

                  {/* Ikon Mengambang Kiri: Clipboard Tugas */}
                  <motion.div
                    animate={{ y: [0, -9, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className="absolute left-2 top-2 z-10 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] p-2 text-[#713F12] shadow-[2px_2px_0px_#134E4A]"
                  >
                    <ClipboardList size={20} />
                  </motion.div>

                  {/* Ikon Utama Tengah: Topi Wisuda Tegas & Berdenyut */}
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border-3 border-[#134E4A] bg-[#BAE6FD] text-[#0369A1] shadow-[4px_4px_0px_#134E4A]"
                  >
                    <GraduationCap size={48} />
                  </motion.div>

                  {/* Ikon Mengambang Kanan Atas: Santri/Users */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.7,
                      delay: 0.2,
                      ease: "easeInOut",
                    }}
                    className="absolute right-2 top-3 z-10 rounded-xl border-2 border-[#134E4A] bg-[#CCFBF1] p-2 text-[#0F766E] shadow-[2px_2px_0px_#134E4A]"
                  >
                    <Users size={20} />
                  </motion.div>

                  {/* Ikon Mengambang Kanan Bawah: Grafik Batang */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.4,
                      delay: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-2 right-4 z-10 rounded-xl border-2 border-[#134E4A] bg-[#FCE7F3] p-2 text-[#BE185D] shadow-[2px_2px_0px_#134E4A]"
                  >
                    <ChartBar size={20} />
                  </motion.div>
                </>
              )}

              {targetRole === "admin" && (
                <>
                  {/* Efek Lingkaran Radar Berdenyut */}
                  <motion.div
                    animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "easeOut",
                    }}
                    className="absolute h-28 w-28 rounded-full border-2 border-[#EF4444]"
                  />

                  {/* Ikon Mengambang Kiri: Gembok Keamanan */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className="absolute left-3 top-2 z-10 rounded-xl border-2 border-[#EF4444] bg-[#1E2937] p-2 text-[#FEF08A] shadow-[2px_2px_0px_#EF4444]"
                  >
                    <Lock size={20} />
                  </motion.div>

                  {/* Ikon Utama Tengah: Perisai Otoritas */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border-3 border-[#EF4444] bg-[#1E2937] text-[#EF4444] shadow-[4px_4px_0px_#EF4444]"
                  >
                    <Shield size={48} />
                  </motion.div>

                  {/* Ikon Mengambang Kanan Atas: Kunci Akses */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.7,
                      delay: 0.2,
                      ease: "easeInOut",
                    }}
                    className="absolute right-3 top-2 z-10 rounded-xl border-2 border-[#EF4444] bg-[#1E2937] p-2 text-[#EF4444] shadow-[2px_2px_0px_#EF4444]"
                  >
                    <Key size={20} />
                  </motion.div>

                  {/* Ikon Mengambang Kanan Bawah: Roda Gigi Berputar */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 6,
                      ease: "linear",
                    }}
                    className="absolute bottom-1 right-5 z-10 rounded-xl border-2 border-[#EF4444] bg-[#1E2937] p-2 text-white shadow-[2px_2px_0px_#EF4444]"
                  >
                    <Settings size={20} />
                  </motion.div>
                </>
              )}
            </div>

            {/* Judul & Keterangan Transisi */}
            <h3
              className={`text-lg sm:text-xl font-black ${
                targetRole === "admin"
                  ? "text-white"
                  : "text-[#134E4A]"
              }`}
            >
              {targetRole === "santri"
                ? "Menyiapkan Petualangan..."
                : targetRole === "ustadz"
                  ? "Menyiapkan Ruang Kelas..."
                  : "Akses Administrator..."}
            </h3>

            <p
              className={`mt-1.5 text-xs sm:text-sm font-semibold ${
                targetRole === "admin"
                  ? "text-[#FEF08A]"
                  : "text-[#134E4A]/80"
              }`}
            >
              {targetRole === "santri"
                ? "Bersiap belajar dan bermain, Santri!"
                : targetRole === "ustadz"
                  ? "Memuat data santri dan kurikulum."
                  : "Memverifikasi kredensial keamanan."}
            </p>

            {/* Neo-Brutalist Progress Bar */}
            <div
              className={`mt-6 h-3 w-full overflow-hidden rounded-full border-2 ${
                targetRole === "admin"
                  ? "border-[#EF4444] bg-[#1E2937]"
                  : "border-[#134E4A] bg-[#CCFBF1]"
              }`}
            >
              <motion.div
                initial={{ width: "8%" }}
                animate={{ width: "96%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className={`h-full ${
                  targetRole === "admin"
                    ? "bg-[#EF4444]"
                    : targetRole === "ustadz"
                      ? "bg-[#0284C7]"
                      : "bg-[#0D9488]"
                }`}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Helper untuk menentukan panel role berdasarkan pathname.
 */
export function getPanelRole(pathname: string): RoleType | null {
  if (pathname.startsWith("/ustadz")) return "ustadz";
  if (pathname.startsWith("/admin")) return "admin";
  if (
    pathname.startsWith("/member") ||
    pathname.startsWith("/quiz-hub") ||
    pathname === "/"
  ) {
    return "santri";
  }
  return null;
}

/**
 * Manajer Transisi Antar Panel:
 * Memantau perpindahan rute antar peran secara global dan mengaktifkan overlay RoleTransitionScreen.
 */
export function RoleTransitionManager() {
  const location = useLocation();
  const [transitionState, setTransitionState] = useState<{
    isVisible: boolean;
    targetRole: RoleType;
  }>({
    isVisible: false,
    targetRole: "santri",
  });

  const prevRoleRef = useRef<RoleType | null>(null);

  useEffect(() => {
    const currentRole = getPanelRole(location.pathname);
    if (!currentRole) return;

    // Jika berpindah peran dari peran sebelumnya yang berbeda
    if (prevRoleRef.current && prevRoleRef.current !== currentRole) {
      setTransitionState({
        isVisible: true,
        targetRole: currentRole,
      });

      const timer = window.setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, isVisible: false }));
      }, 1600);

      prevRoleRef.current = currentRole;
      return () => window.clearTimeout(timer);
    }

    // Inisialisasi awal role pada load pertama tanpa memicu layar loading
    prevRoleRef.current = currentRole;
  }, [location.pathname]);

  return (
    <RoleTransitionScreen
      targetRole={transitionState.targetRole}
      isVisible={transitionState.isVisible}
    />
  );
}
