import { NavLink } from "react-router-dom";
import { ChevronRight } from "@/components/ui/CustomIcons";
import { useAdminNav } from "../hooks/useAdminNav";

export function AdminMenuPage() {
  const sections = useAdminNav();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          Menu Lengkap
        </h1>
        <p className="text-sm admin-muted">
          Seluruh halaman panel admin dalam satu daftar.
        </p>
      </div>
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 text-xs font-black uppercase tracking-widest admin-muted">
            {section.title}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className="admin-surface flex items-center justify-between p-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="admin-accent-soft flex h-9 w-9 items-center justify-center rounded-xl">
                      <Icon size={16} />
                    </span>
                    <span className="font-black">{item.label}</span>
                  </span>
                  <ChevronRight size={18} />
                </NavLink>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
