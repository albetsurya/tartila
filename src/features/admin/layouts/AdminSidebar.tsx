import { useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, Shield, Sparkles } from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminNav } from "../hooks/useAdminNav";

export interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const sections = useAdminNav();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return (
    <aside
      className={`admin-metro fixed inset-y-0 left-0 z-30 hidden flex-col border-r-[3px] border-[var(--admin-border)] md:flex ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
      style={{ backgroundColor: "var(--admin-surface)" }}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b-[3px] border-[var(--admin-border)] px-3">
        <span className="admin-accent-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <Shield size={16} />
        </span>
        {!collapsed ? (
          <span className="truncate text-sm font-black uppercase tracking-tight">
            Admin Tartila
          </span>
        ) : null}
      </div>

      <nav className="admin-scroll flex-1 overflow-y-auto px-2 py-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-4 last:mb-0">
            {!collapsed ? (
              <p className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest admin-muted">
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
                      aria-label={item.label}
                      title={collapsed ? item.label : undefined}
                      className={`admin-nav-item flex items-center rounded-xl px-2.5 py-2 text-sm ${
                        collapsed ? "justify-center" : "gap-3"
                      }`}
                    >
                      <Icon size={18} />
                      {!collapsed ? (
                        <span className="truncate font-bold">{item.label}</span>
                      ) : null}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t-[3px] border-[var(--admin-border)] p-2">
        <NavLink
          to="/member/ngaji-ceria"
          aria-label="Masuk Mode Member"
          title={collapsed ? "Masuk Mode Member" : undefined}
          className={`admin-nav-item mb-1 flex w-full items-center rounded-xl px-2.5 py-2 text-sm font-black ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <Sparkles size={18} />
          {!collapsed ? <span>Mode Member</span> : null}
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Keluar"
          title={collapsed ? "Keluar" : undefined}
          className={`admin-nav-item flex w-full items-center rounded-xl px-2.5 py-2 text-sm font-bold ${
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
          className={`admin-nav-item hidden w-full items-center rounded-xl px-2.5 py-2 text-sm font-bold md:flex ${
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
  );
}
