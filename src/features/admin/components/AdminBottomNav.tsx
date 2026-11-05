import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  Settings,
  LayoutGrid,
} from "@/components/ui/CustomIcons";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  checkActive: (path: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
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

/**
 * Navigasi bawah mobile: bilah pil melayang + tombol bulat kuning di kanan
 * (pintasan ke "Menu Lengkap", rute yang sudah ada), sesuai gambar referensi.
 */
export function AdminBottomNav() {
  const location = useLocation();
  const isMenuActive = location.pathname.startsWith("/admin/menu");

  return (
    <>
      <Link
        to="/admin/menu"
        aria-label="Menu lengkap"
        className={`fixed bottom-[88px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] transition-all active:translate-y-[2px] active:shadow-none md:hidden ${
          isMenuActive ? "bg-[#FF6B6B]" : "bg-[#FFD60A]"
        }`}
      >
        <LayoutGrid size={24} className="text-[#1A1A1A]" />
      </Link>

      <nav
        aria-label="Navigasi admin mobile"
        className="pb-safe fixed inset-x-3 bottom-3 z-40 grid h-16 grid-cols-4 items-stretch gap-1 rounded-full border-[3px] border-[#1A1A1A] bg-[#FFFBF2] px-1.5 font-sans shadow-[4px_4px_0px_#1A1A1A] md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.checkActive(location.pathname);

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive ? "page" : undefined}
              className={`my-1 flex flex-col items-center justify-center gap-0.5 rounded-full border-[2px] font-bold transition-all ${
                isActive
                  ? "border-[#1A1A1A] bg-[#FFD60A] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]"
                  : "border-transparent text-[#1A1A1A]/70 hover:bg-[#FFF4DC] hover:text-[#1A1A1A]"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center">
                <Icon
                  size={20}
                  className={isActive ? "text-[#1A1A1A]" : "text-[#1A1A1A]/70"}
                />
              </span>
              <span className="text-[11px] leading-tight tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
