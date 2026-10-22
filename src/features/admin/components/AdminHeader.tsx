import { List, Moon, Sun } from "@/components/ui/CustomIcons";
import { useTheme } from "@/contexts/useTheme";
import { AdminBreadcrumb } from "./AdminBreadcrumb";

export function AdminHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="admin-header sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b px-4 backdrop-blur md:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Buka menu"
        className="admin-nav-item rounded-lg p-2 transition-colors duration-150 md:hidden"
      >
        <List size={20} />
      </button>
      <AdminBreadcrumb />
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
        title={isDark ? "Mode terang" : "Mode gelap"}
        className="admin-nav-item ml-auto rounded-lg p-2 transition-colors duration-150"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
