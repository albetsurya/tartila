import { useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, Shield } from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminNav } from "../hooks/useAdminNav";

export interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const sections = useAdminNav();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return (
    <>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      ) : null}
      <aside
        className={`admin-surface admin-border fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-150 md:z-30 md:translate-x-0 ${
          collapsed ? "w-[72px]" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="admin-border flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <span className="admin-accent-soft flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <Shield size={16} />
          </span>
          {!collapsed ? (
            <span className="truncate text-sm font-semibold">Admin Tartila</span>
          ) : null}
        </div>

        <nav className="admin-scroll flex-1 overflow-y-auto px-2 py-4">
          {sections.map((section) => (
            <div key={section.title} className="mb-4 last:mb-0">
              {!collapsed ? (
                <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wide admin-muted">
                  {section.title}
                </p>
              ) : null}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={onCloseMobile}
                        aria-label={item.label}
                        title={collapsed ? item.label : undefined}
                        className={`admin-nav-item flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                          collapsed ? "justify-center" : "gap-3"
                        }`}
                      >
                        <Icon size={18} />
                        {!collapsed ? (
                          <span className="truncate">{item.label}</span>
                        ) : null}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="admin-border shrink-0 border-t p-2">
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Keluar"
            title={collapsed ? "Keluar" : undefined}
            className={`admin-nav-item flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <LogOut size={18} />
            {!collapsed ? <span>Keluar</span> : null}
          </button>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Perluas sidebar" : "Perkecil sidebar"}
            title={collapsed ? "Perluas" : "Perkecil"}
            className={`admin-nav-item hidden w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 md:flex ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <ChevronLeft
              size={18}
              style={{
                transform: collapsed ? "rotate(180deg)" : undefined,
              }}
            />
            {!collapsed ? <span>Perkecil</span> : null}
          </button>
        </div>
      </aside>
    </>
  );
}
