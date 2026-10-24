import { Link } from "react-router-dom";
import { ChevronRight, Timer } from "@/components/ui/CustomIcons";

export function AdminTimelineMenuPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight">
          Timeline Editor
        </h1>
        <p className="text-sm admin-muted">
          Pilih versi editor timeline audio yang ingin dipakai.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/timeline-local"
          className="admin-surface group flex items-center justify-between p-5"
        >
          <span>
            <span className="flex items-center gap-2 text-base font-black uppercase tracking-tight">
              <Timer size={18} />
              Timeline Lokal
            </span>
            <span className="mt-1 block text-xs admin-muted">
              Editor offline dengan draft, undo, dan revise lokal.
            </span>
          </span>
          <ChevronRight size={20} />
        </Link>
        <Link
          to="/admin/timeline-cloud"
          className="admin-surface group flex items-center justify-between p-5"
        >
          <span>
            <span className="flex items-center gap-2 text-base font-black uppercase tracking-tight">
              <Timer size={18} />
              Timeline Cloud
            </span>
            <span className="mt-1 block text-xs admin-muted">
              Editor cloud dengan sync dan publish ke server.
            </span>
          </span>
          <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}
