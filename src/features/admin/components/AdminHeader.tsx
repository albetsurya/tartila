import { NavLink } from "react-router-dom";
import { Moon, Sparkles, Sun } from "@/components/ui/CustomIcons";
import { useTheme } from "@/contexts/useTheme";
import { AdminBreadcrumb } from "./AdminBreadcrumb";

export function AdminHeader() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="admin-header sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b-[3px] px-4 md:px-8">
      <AdminBreadcrumb />
      <div className="ml-auto flex items-center gap-2">
        <NavLink
          to="/member/ngaji-ceria"
          title="Masuk Mode Santri / Member"
          className="admin-nav-item inline-flex items-center gap-1.5 rounded-xl border-[3px] px-2.5 py-1.5 text-xs font-black uppercase tracking-wide text-[#166534]"
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">Mode Member</span>
        </NavLink>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
          title={isDark ? "Mode terang" : "Mode gelap"}
          className="admin-nav-item flex h-9 w-9 items-center justify-center rounded-xl border-[3px]"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
