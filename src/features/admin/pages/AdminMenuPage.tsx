import { NavLink } from "react-router-dom";
import { ChevronRight } from "@/components/ui/CustomIcons";
import { useAdminNav } from "../hooks/useAdminNav";
import {
  CARD,
  ICON_BOX,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  SECTION_TITLE,
  TILE_COLORS,
} from "../styles";

export function AdminMenuPage() {
  const sections = useAdminNav();

  return (
    <div className="space-y-5 pb-12 font-sans font-bold text-[#1A1A1A]">
      <div className={`relative overflow-hidden p-5 ${CARD}`}>
        {/* Dekorasi geometris (murni visual) */}
        <span aria-hidden="true" className="pointer-events-none absolute -right-3 -top-3 h-12 w-12 rotate-12 rounded-full border-[3px] border-[#1A1A1A] bg-[#8FB8FF]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-6 h-4 w-4 rotate-45 border-[2.5px] border-[#1A1A1A] bg-[#FF6B6B]" />
        <h1 className={`${PAGE_TITLE} uppercase tracking-tight`}>
          Menu Lengkap
        </h1>
        <p className={PAGE_SUBTITLE}>
          Seluruh halaman panel admin dalam satu daftar.
        </p>
      </div>
      {sections.map((section, sectionIndex) => (
        <section key={section.title}>
          <h2 className={`mb-2 ${SECTION_TITLE} tracking-widest`}>
            {section.title}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              const tileColor =
                TILE_COLORS[(sectionIndex + itemIndex) % TILE_COLORS.length];
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={`flex items-center justify-between p-4 transition-all hover:bg-[#FFF4DC] active:translate-y-[2px] active:shadow-none ${CARD}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-9 w-9 text-[#1A1A1A] ${tileColor} ${ICON_BOX}`}>
                      <Icon size={16} />
                    </span>
                    <span className="font-black text-[#1A1A1A]">{item.label}</span>
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
