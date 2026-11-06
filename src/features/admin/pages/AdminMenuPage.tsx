import { NavLink } from "react-router-dom";
import { ChevronRight } from "@/components/ui/CustomIcons";
import { useAdminNav } from "../hooks/useAdminNav";
import { CARD, ICON_BOX, PAGE_SUBTITLE, PAGE_TITLE, SECTION_TITLE } from "../styles";

export function AdminMenuPage() {
  const sections = useAdminNav();

  return (
    <div className="space-y-5 pb-12 font-sans font-bold text-[#134E4A]">
      <div className={`p-5 ${CARD}`}>
        <h1 className={`${PAGE_TITLE} uppercase tracking-tight`}>
          Menu Lengkap
        </h1>
        <p className={PAGE_SUBTITLE}>
          Seluruh halaman panel admin dalam satu daftar.
        </p>
      </div>
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className={`mb-2 ${SECTION_TITLE} tracking-widest`}>
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
                  className={`flex items-center justify-between p-4 transition-all hover:bg-[#F0FDF4] active:translate-y-[2px] active:shadow-none ${CARD}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-9 w-9 bg-[#F59E0B] text-[#134E4A] ${ICON_BOX}`}>
                      <Icon size={16} />
                    </span>
                    <span className="font-black text-[#134E4A]">{item.label}</span>
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
