import { useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, Shield, Sparkles } from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminNav } from "../hooks/useAdminNav";

export interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

/** Item menu: aktif = Teal + border + hard shadow kecil. */
const NAV_ITEM_BASE =
  "flex w-full items-center rounded-xl border-[2px] px-2.5 py-2 text-sm font-bold transition-all";
const NAV_ITEM_ACTIVE =
  "bg-[#0D9488] text-white border-[#134E4A] shadow-[2px_2px_0px_#134E4A]";
const NAV_ITEM_IDLE =
  "border-transparent text-[#134E4A] hover:bg-[#F0FDF4] hover:border-[#134E4A]";

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
      className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r-[3px] border-[#134E4A] bg-white font-sans md:flex ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b-[3px] border-[#134E4A] px-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-[2px] border-[#134E4A] bg-[#F59E0B] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
          <Shield size={16} />
        </span>
        {!collapsed ? (
          <span className="truncate font-display text-sm font-black uppercase tracking-tight text-[#134E4A]">
            Admin Tartila
          </span>
        ) : null}
      </div>

      <nav className="admin-scroll flex-1 overflow-y-auto px-2 py-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-4 last:mb-0">
            {!collapsed ? (
              <p className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-[#134E4A]/60">
                {section.title}
              </p>
            ) : null}
            <ul className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      aria-label={item.label}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `${NAV_ITEM_BASE} ${isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE} ${
                          collapsed ? "justify-center" : "gap-3"
                        }`
                      }
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

      <div className="shrink-0 space-y-1.5 border-t-[3px] border-[#134E4A] p-2">
        <NavLink
          to="/member/ngaji-ceria"
          aria-label="Masuk Mode Member"
          title={collapsed ? "Masuk Mode Member" : undefined}
          className={({ isActive }) =>
            `${NAV_ITEM_BASE} font-black ${isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE} ${
              collapsed ? "justify-center" : "gap-3"
            }`
          }
        >
          <Sparkles size={18} />
          {!collapsed ? <span>Mode Member</span> : null}
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Keluar"
          title={collapsed ? "Keluar" : undefined}
          className={`${NAV_ITEM_BASE} ${NAV_ITEM_IDLE} hover:bg-[#FF6B6B] hover:text-white ${
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
          className={`${NAV_ITEM_BASE} ${NAV_ITEM_IDLE} hidden md:flex ${
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
