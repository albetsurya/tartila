import { NavLink } from "react-router-dom";
import { BookOpen } from "@/components/ui/CustomIcons";
import { USTADZ_NAV } from "../hooks/useUstadzNav";

export function UstadzSidebar() {
  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r-[3px] border-[var(--ustadz-border)] md:flex"
      style={{ backgroundColor: "var(--ustadz-surface)" }}
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b-[3px] border-[var(--ustadz-border)] px-4">
        <span className="ustadz-accent-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <BookOpen size={20} />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-black uppercase tracking-tight">
            Panel Ustadz
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest ustadz-muted">
            Ngaji Ceria Tartila
          </p>
        </div>
      </div>

      <nav className="ustadz-scroll flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1.5">
          {USTADZ_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  aria-label={item.label}
                  className="ustadz-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm"
                >
                  <Icon size={18} />
                  <span className="truncate font-bold">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
