import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Trophy,
  User,
  Plus,
  FileText,
} from "@/components/ui/CustomIcons";

interface BottomNavItem {
  label: string;
  to: string;
  icon: React.FC<{ size?: number; className?: string }>;
  isActive?: boolean;
}

interface SpeedDialAction {
  id: string;
  label: string;
  to: string;
  icon: React.FC<{ size?: number; className?: string; stroke?: string; color?: string }>;
  iconBg: string;
}

const SPEED_DIAL_ACTIONS: SpeedDialAction[] = [
  {
    id: "buat-kuis",
    label: "Buat Kuis",
    to: "/ustadz/kuis/baru",
    icon: FileText,
    iconBg: "#FBCFE8", // Merah Muda Pastel
  },
  {
    id: "buat-kelas",
    label: "Buat Kelas",
    to: "/ustadz/kelas/baru",
    icon: Users,
    iconBg: "#93C5FD", // Biru Langit Pastel
  },
];

/**
 * SpeedDialFab: Floating Action Button dengan Speed Dial bergaya Professional Neo-Brutalism.
 * Saat aktif, tombol (+) berputar 45° menjadi (×) dan memunculkan opsi aksi melayang di atasnya.
 */
export function SpeedDialFab() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Otomatis tutup Speed Dial saat berpindah rute
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Tutup Speed Dial saat menekan tombol Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Overlay transparan untuk menutup saat klik di luar area */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="speed-dial-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="relative z-50 flex flex-col items-center">
        {/* Daftar aksi melayang (Speed Dial options) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="speed-dial-menu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                  },
                },
                exit: {
                  transition: {
                    staggerChildren: 0.03,
                  },
                },
              }}
              className="absolute bottom-full mb-3 flex flex-col items-center gap-2"
            >
              {SPEED_DIAL_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.id}
                    variants={{
                      hidden: { opacity: 0, y: 12, scale: 0.85 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 450,
                          damping: 24,
                        },
                      },
                      exit: {
                        opacity: 0,
                        y: 8,
                        scale: 0.85,
                        transition: { duration: 0.1 },
                      },
                    }}
                    whileHover={{ y: -1, boxShadow: "3px 3px 0px #134E4A" }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate(action.to);
                    }}
                    className="flex items-center gap-2.5 rounded-xl border-2 border-[#134E4A] bg-white px-3.5 py-2 shadow-[2px_2px_0px_#134E4A] transition-colors hover:bg-[#F8FAFC]"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A]"
                      style={{ backgroundColor: action.iconBg }}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="whitespace-nowrap text-xs font-bold text-[#183B38]">
                      {action.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tombol Utama FAB (+) yang berputar 45 derajat */}
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? "Tutup menu aksi" : "Buka menu aksi (Speed Dial)"}
          aria-expanded={isOpen}
          className="flex h-13 w-13 items-center justify-center rounded-full border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A] transition-colors hover:bg-[#0F766E] focus:outline-none"
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="flex items-center justify-center"
          >
            <Plus size={24} stroke="#FFFFFF" />
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}

/**
 * BottomNav (5 elemen seimbang) — Professional Neo-Brutalism (Bab 7C)
 * Urutan: Dashboard · Kelas · [Speed Dial FAB] · Kuis · Profil
 */
export function BottomNav() {
  const location = useLocation();

  const isKuisActive =
    location.pathname.startsWith("/ustadz/kuis") ||
    location.pathname.startsWith("/ustadz/kurikulum");

  return (
    <nav
      aria-label="Navigasi ustadz mobile"
      className="fixed bottom-0 left-0 right-0 z-40 grid h-18 grid-cols-5 items-stretch border-t-2 sm:border-t-3 border-[#134E4A] bg-white px-2 pb-safe md:hidden shadow-[0_-3px_0px_#134E4A]"
    >
      {/* Dashboard */}
      <BottomNavItemLink
        to="/ustadz/dashboard"
        label="Beranda"
        icon={LayoutDashboard}
        isActive={location.pathname === "/ustadz/dashboard" || location.pathname === "/ustadz"}
      />

      {/* Kelas */}
      <BottomNavItemLink
        to="/ustadz/kelas"
        label="Kelas"
        icon={Users}
        isActive={location.pathname.startsWith("/ustadz/kelas")}
      />

      {/* Speed Dial FAB — Posisi menonjol ke atas di tengah navbar */}
      <div className="relative -top-4 flex justify-center">
        <SpeedDialFab />
      </div>

      {/* Kuis (aktif untuk /ustadz/kuis ATAU /ustadz/kurikulum) */}
      <BottomNavItemLink
        to="/ustadz/kuis"
        label="Kuis"
        icon={Trophy}
        isActive={isKuisActive}
      />

      {/* Profil */}
      <BottomNavItemLink
        to="/ustadz/profil"
        label="Profil"
        icon={User}
        isActive={location.pathname.startsWith("/ustadz/profil")}
      />
    </nav>
  );
}

function BottomNavItemLink({ to, label, icon, isActive }: BottomNavItem) {
  const Icon = icon;
  return (
    <Link
      to={to}
      className={`
        my-1.5 mx-0.5 flex flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold tracking-tight transition-colors
        ${
          isActive
            ? "bg-[#CCFBF1] text-[#134E4A] font-extrabold"
            : "text-[#64748B] hover:text-[#183B38]"
        }
      `}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        <Icon size={20} />
      </span>
      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}

export const CreateQuizFab = SpeedDialFab;
