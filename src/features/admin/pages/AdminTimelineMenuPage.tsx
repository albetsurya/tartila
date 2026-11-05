import { Link } from "react-router-dom";
import { ChevronRight, Timer } from "@/components/ui/CustomIcons";
import { CARD, PAGE_SUBTITLE, PAGE_TITLE } from "../styles";

export function AdminTimelineMenuPage() {
  return (
    <div className="space-y-5 pb-12 font-sans font-bold text-[#1A1A1A]">
      <div className={`p-5 ${CARD}`}>
        <h1 className={`${PAGE_TITLE} uppercase tracking-tight`}>
          Timeline Editor
        </h1>
        <p className={PAGE_SUBTITLE}>
          Pilih versi editor timeline audio yang ingin dipakai.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/timeline-local"
          className={`group flex items-center justify-between p-5 transition-all hover:bg-[#FFF4DC] active:translate-y-[2px] active:shadow-none ${CARD}`}
        >
          <span>
            <span className="flex items-center gap-2 font-display text-base font-black uppercase tracking-tight text-[#1A1A1A]">
              <Timer size={18} />
              Timeline Lokal
            </span>
            <span className="mt-1 block text-xs font-bold text-[#1A1A1A]/70">
              Editor offline dengan draft, undo, dan revise lokal.
            </span>
          </span>
          <ChevronRight size={20} />
        </Link>
        <Link
          to="/admin/timeline-cloud"
          className={`group flex items-center justify-between p-5 transition-all hover:bg-[#FFF4DC] active:translate-y-[2px] active:shadow-none ${CARD}`}
        >
          <span>
            <span className="flex items-center gap-2 font-display text-base font-black uppercase tracking-tight text-[#1A1A1A]">
              <Timer size={18} />
              Timeline Cloud
            </span>
            <span className="mt-1 block text-xs font-bold text-[#1A1A1A]/70">
              Editor cloud dengan sync dan publish ke server.
            </span>
          </span>
          <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}
