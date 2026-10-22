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
    activeBg: "bg-[#FF6B6B]", // Coral Glow
    activeText: "text-[#FF6B6B]",
  },
  {
    key: "jelajah",
    label: "Jelajah",
    to: "/member/ngaji-ceria/map",
    icon: CompassSvg,
    activeBg: "bg-[#0D9488]", // Teal Emerald
    activeText: "text-[#0D9488]",
  },
  {
    key: "games",
    label: "Games",
    to: "/member/ngaji-ceria/games",
    icon: GamepadSvg,
    activeBg: "bg-[#F59E0B]", // Amber Gold
    activeText: "text-[#D97706]",
  },
  {
    key: "profile",
    label: "Profil",
    to: "/member/ngaji-ceria/profile",
    icon: ProfileSvg,
    activeBg: "bg-[#8B5CF6]", // Violet
    activeText: "text-[#7C3AED]",
  },
];

// Alias lama agar backward-compatible
export const NGAJI_CERIA_NAV_ITEMS = TARTILA_NAV_ITEMS;

export function TartilaBottomNav() {
  const location = useLocation();

  return (
    <div className="ngaji-ceria-bottom-nav fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-md md:max-w-lg px-3 pb-safe pointer-events-auto">
        <nav className="mb-2 bg-white rounded-[24px] border-[3px] border-[#134E4A] shadow-[0_4px_0px_#134E4A] px-2 py-2">
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
                    animate={isActive ? { scale: [1, 1.12, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center justify-center w-12 h-9 rounded-xl transition-all ${
                      isActive
                        ? `${item.activeBg} text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]`
                        : "text-[#134E4A]/50"
                    }`}
                  >
                    <Icon size={28} />
                  </motion.span>

                  <span
                    className={`text-[10px] font-black tracking-wide leading-tight transition-colors ${
                      isActive ? item.activeText : "text-[#134E4A]/50"
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
