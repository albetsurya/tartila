import { NavLink } from "react-router-dom";
import { USTADZ_NAV } from "../hooks/useUstadzNav";

export function UstadzBottomNav() {
  return (
    <nav
      aria-label="Navigasi ustadz mobile"
      className="fixed bottom-0 left-0 right-0 z-40 flex h-20 items-stretch border-t-2 sm:border-t-3 border-[#134E4A] bg-white px-2 pb-1 md:hidden shadow-[0_-3px_0px_#134E4A]"
    >
      {USTADZ_NAV.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `m-1 flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-colors ${
                isActive
                  ? "bg-ustadz-accent text-white shadow-[3px_3px_0_#134E4A]"
                  : "text-ustadz-muted hover:text-ustadz-text"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex h-6 w-6 items-center justify-center">
                  <Icon size={20} />
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
