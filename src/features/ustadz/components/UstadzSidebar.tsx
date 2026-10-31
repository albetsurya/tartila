import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Sparkles } from "@/components/ui/CustomIcons";
import { useAuth } from "@/contexts/AuthContext";
import { USTADZ_NAV_SECTIONS } from "../hooks/useUstadzNav";

export function UstadzSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.name || user?.username || "Ustadz";
  const userRole = user?.role === "admin" ? "Administrator" : "Pengajar";

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r-2 sm:border-r-3 border-[#134E4A] bg-white shadow-[2px_0px_0px_#134E4A] md:flex"
      aria-label="Sidebar Navigasi Ustadz"
    >
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b-2 border-[#134E4A] px-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
          <BookOpen size={20} />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-base font-black tracking-tight text-[#134E4A]">
            Tartila
          </p>
          <p className="text-[10px] font-black tracking-wider text-[#134E4A]/70 uppercase">
            Panel Pengajar
          </p>
        </div>
      </div>

      {/* Nav Menu Items (Grouped by Category) */}
      <nav className="ustadz-scroll flex-1 overflow-y-auto px-3.5 py-4">
        <div className="space-y-5">
          {USTADZ_NAV_SECTIONS.map((section) => (
            <div key={section.category} className="space-y-1.5">
              <p className="px-3 text-[11px] font-black tracking-wider text-[#134E4A]/80 uppercase">
                {section.category}
              </p>
              <ul className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-black transition-all ${
                            isActive
                              ? "border-2 border-[#134E4A] bg-[#CCFBF1] text-[#134E4A] shadow-[2.5px_2.5px_0px_#134E4A]"
                              : "text-[#183B38]/80 hover:bg-[#F8FAFC] hover:text-[#134E4A]"
                          }`
                        }
                      >
                        <span className="shrink-0 transition-transform group-hover:scale-105">
                          <Icon size={18} />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom User Area */}
      <div className="border-t-2 border-[#134E4A] p-3.5">
        <div className="flex items-center justify-between rounded-xl border-2 border-[#134E4A] bg-[#FDFBF7] p-2.5 shadow-[2px_2px_0px_#134E4A]">
          <div className="min-w-0 pr-2">
            <p className="truncate text-xs font-black text-[#183B38]">
              {displayName}
            </p>
            <p className="text-[10px] font-bold text-[#134E4A]/70">{userRole}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href="/member/ngaji-ceria"
              title="Area Santri"
              aria-label="Masuk Area Santri"
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] transition-all hover:bg-[#FEF08A] active:scale-95"
            >
              <Sparkles size={15} />
            </a>
            <button
              type="button"
              onClick={handleLogout}
              title="Keluar"
              aria-label="Keluar"
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-white text-[#B91C1C] shadow-[1.5px_1.5px_0px_#134E4A] transition-all hover:bg-[#FEE2E2] active:scale-95"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
