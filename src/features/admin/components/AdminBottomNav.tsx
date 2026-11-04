import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Users, Settings } from "@/components/ui/CustomIcons";

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

export function AdminBottomNav() {
  const location = useLocation();

  return (
    <nav
      aria-label="Navigasi admin mobile"
      className="fixed bottom-0 left-0 right-0 z-40 grid h-16 grid-cols-4 items-stretch gap-1 border-t-[3px] border-[#134E4A] bg-white px-2 pb-safe font-sans md:hidden"
    >
      {NAV_ITEMS.map((item) => {
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
      })}
    </nav>
  );
}
