import { NavLink, useLocation } from "react-router-dom";
import { tapFeedback } from "../../../lib/haptics";
import { motion } from "framer-motion";
import {
  HomeSvg,
  CompassSvg,
  GamepadSvg,
  ProfileSvg,
  type SvgProps,
} from "../../../components/ui/CustomIcons";

interface NavItem {
  key: string;
  label: string;
  to: string;
  icon: React.FC<SvgProps>;
  /** Warna latar saat aktif */
  activeBg: string;
  /** Warna teks/ikon saat aktif */
  activeText: string;
}

export const TARTILA_NAV_ITEMS: NavItem[] = [
  {
    key: "beranda",
    label: "Beranda",
    to: "/member/ngaji-ceria",
    icon: HomeSvg,
    activeBg: "bg-[#FEE2E2] dark:bg-[#7F1D1D]/60",
    activeText: "text-[#EF4444] dark:text-[#FCA5A5]",
  },
  {
    key: "jelajah",
    label: "Jelajah",
    to: "/member/ngaji-ceria/map",
    icon: CompassSvg,
    activeBg: "bg-[#CCFBF1] dark:bg-[#064E3B]/60",
    activeText: "text-[#0D9488] dark:text-[#5EEAD4]",
  },
  {
    key: "games",
    label: "Games",
    to: "/member/ngaji-ceria/games",
    icon: GamepadSvg,
    activeBg: "bg-[#EDE9FE] dark:bg-[#4C1D95]/60",
    activeText: "text-[#7C3AED] dark:text-[#C4B5FD]",
  },
  {
    key: "profile",
    label: "Profil",
    to: "/member/ngaji-ceria/profile",
    icon: ProfileSvg,
    activeBg: "bg-[#DBEAFE] dark:bg-[#1E3A8A]/60",
    activeText: "text-[#2563EB] dark:text-[#93C5FD]",
  },
];

// Alias lama agar backward-compatible
export const NGAJI_CERIA_NAV_ITEMS = TARTILA_NAV_ITEMS;

export function TartilaBottomNav() {
  const location = useLocation();

  return (
    <div className="ngaji-ceria-bottom-nav fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-md md:max-w-lg px-3 pb-safe pointer-events-auto">
        <nav
          className="mb-2 rounded-[24px] border-[3px] px-2 py-2 transition-colors duration-200 bg-[var(--nav-bg,#FFFFFF)] text-[var(--text-main,#134E4A)] border-[var(--border-color,#134E4A)] shadow-[0_4px_0px_var(--shadow-color,#134E4A)]"
        >
          <div className="flex items-center justify-around">
            {TARTILA_NAV_ITEMS.map((item) => {
              const isActive =
                item.to === "/member/ngaji-ceria"
                  ? location.pathname === "/member/ngaji-ceria"
                  : location.pathname.startsWith(item.to);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end={item.to === "/member/ngaji-ceria"}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-0.5 active:scale-95 transition-transform"
                  onClick={() => tapFeedback()}
                >
                  <motion.span
                    whileTap={{
                      scale: 0.9,
                      transition: { type: "spring", stiffness: 400, damping: 25, duration: 0.08 },
                    }}
                    animate={
                      isActive
                        ? { scale: [1, 1.14, 1], y: [0, -2, 0] }
                        : { scale: 1, y: 0 }
                    }
                    transition={{
                      duration: 0.18,
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    }}
                    className={`flex items-center justify-center w-12 h-9 rounded-xl transition-all ${
                      isActive
                        ? `${item.activeBg} opacity-100 grayscale-0 border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]`
                        : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                    }`}
                  >
                    <Icon size={26} />
                  </motion.span>

                  <span
                    className={`text-[10px] tracking-wide leading-tight transition-colors ${
                      isActive
                        ? `${item.activeText} font-black`
                        : "text-gray-500 dark:text-gray-400 font-bold"
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

// Backward-compatible export
export { TartilaBottomNav as NgajiCeriaBottomNav };
