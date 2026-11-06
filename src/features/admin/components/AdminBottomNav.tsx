import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Calendar, Users, Settings, Plus } from "@/components/ui/CustomIcons";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  checkActive: (path: string) => boolean;
}

interface SpeedDialAction {
  id: "event" | "user";
  label: string;
  targetPath: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
}

const SPEED_DIAL_ACTIONS: SpeedDialAction[] = [
  {
    id: "event",
    label: "Buat Event",
    targetPath: "/admin/events",
    icon: Calendar,
    iconBg: "#FBCFE8", // Merah Muda Pastel
  },
  {
    id: "user",
    label: "Tambah Pengguna",
    targetPath: "/admin/users",
    icon: Users,
    iconBg: "#93C5FD", // Biru Langit Pastel
  },
];

const NAV_ITEMS_LEFT: NavItem[] = [
  {
    label: "Beranda",
    to: "/admin",
    icon: Home,
    checkActive: (path) => path === "/admin" || path === "/admin/",
  },
  {
    label: "Event",
    to: "/admin/events",
    icon: Calendar,
    checkActive: (path) => path.startsWith("/admin/events"),
  },
];

const NAV_ITEMS_RIGHT: NavItem[] = [
  {
    label: "Pengguna",
    to: "/admin/users",
    icon: Users,
    checkActive: (path) =>
      path.startsWith("/admin/users") || path.startsWith("/admin/ustadz-requests"),
  },
  {
    label: "Sistem",
    to: "/admin/settings",
    icon: Settings,
    checkActive: (path) =>
      path.startsWith("/admin/settings") || path.startsWith("/admin/menu"),
  },
];

export function AdminBottomNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Otomatis tutup Speed Dial saat berpindah rute
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Tutup Speed Dial saat menekan Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleActionClick = (action: SpeedDialAction) => {
    setIsOpen(false);

    const triggerEvent = () => {
      window.dispatchEvent(
        new CustomEvent("open-admin-create", { detail: action.id }),
      );
      window.dispatchEvent(
        new CustomEvent(
          action.id === "event" ? "tartila:admin:create-event" : "tartila:admin:create-user",
        ),
      );
    };

    if (location.pathname.startsWith(action.targetPath)) {
      triggerEvent();
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tartila:admin:open-create", action.id);
      }
      navigate(action.targetPath);
      setTimeout(triggerEvent, 120);
    }
  };

  const renderNavLink = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.checkActive(location.pathname);

    return (
      <Link
        key={item.to}
        to={item.to}
        className={`my-1 flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] font-bold transition-all ${
          isActive
            ? "border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
            : "border-transparent text-[#134E4A]/70 hover:bg-[#F0FDF4] hover:text-[#134E4A]"
        }`}
      >
        <span className="flex h-5 w-5 items-center justify-center">
          <Icon
            size={20}
            className={isActive ? "text-white" : "text-[#134E4A]/70"}
          />
        </span>
        <span className="text-[11px] leading-tight tracking-tight">
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Overlay backdrop */}
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

      <nav
        aria-label="Navigasi admin mobile"
        className="fixed bottom-0 left-0 right-0 z-40 grid h-16 grid-cols-5 items-stretch gap-1 border-t-[3px] border-[#134E4A] bg-white px-2 pb-safe font-sans md:hidden shadow-[0_-3px_0px_#134E4A]"
      >
        {/* 1. Beranda & 2. Event */}
        {NAV_ITEMS_LEFT.map(renderNavLink)}

        {/* 3. Speed Dial FAB Tengah Melayang */}
        <div className="relative -top-4 flex flex-col items-center justify-center z-50">
          {/* Opsi Melayang ke Atas */}
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
                      onClick={() => handleActionClick(action)}
                      className="flex items-center gap-2.5 rounded-xl border-2 border-[#134E4A] bg-white px-3.5 py-2 shadow-[2px_2px_0px_#134E4A] transition-colors hover:bg-[#F0FDF4] cursor-pointer"
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A]"
                        style={{ backgroundColor: action.iconBg }}
                      >
                        <Icon size={16} className="text-[#134E4A]" />
                      </span>
                      <span className="whitespace-nowrap text-xs font-black text-[#134E4A]">
                        {action.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tombol Utama FAB (+) yang berputar 45° */}
          <motion.button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? "Tutup menu aksi" : "Buka menu aksi (Speed Dial)"}
            aria-expanded={isOpen}
            className="flex h-13 w-13 items-center justify-center rounded-full border-[3px] border-[#134E4A] bg-[#0D9488] text-white shadow-[3px_3px_0px_#134E4A] transition-colors hover:bg-[#0F766E] focus:outline-none cursor-pointer"
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

        {/* 4. Pengguna & 5. Sistem */}
        {NAV_ITEMS_RIGHT.map(renderNavLink)}
      </nav>
    </>
  );
}
