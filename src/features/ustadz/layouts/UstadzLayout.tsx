import { useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Sparkles } from "@/components/ui/CustomIcons";
import "../ustadz.css";
import { UstadzSidebar } from "../components/UstadzSidebar";
import { UstadzBottomNav } from "../components/UstadzBottomNav";

const PAGE_TITLES: { match: (pathname: string) => boolean; title: string }[] = [
  { match: (p) => p.startsWith("/ustadz/kuis/baru"), title: "Buat Kuis" },
  { match: (p) => p.startsWith("/ustadz/kuis"), title: "Bank Kuis" },
  { match: (p) => p.startsWith("/ustadz/laporan"), title: "Laporan Santri" },
  { match: (p) => p === "/ustadz/kelas/baru", title: "Buat Kelas Baru" },
  {
    match: (p) => p.startsWith("/ustadz/kelas/"),
    title: "Detail Kelas",
  },
  { match: (p) => p.startsWith("/ustadz/kelas"), title: "Kelola Kelas" },
  { match: (p) => p.startsWith("/ustadz/kurikulum"), title: "Kurikulum" },
  { match: (p) => p.startsWith("/ustadz/profil"), title: "Profil" },
  { match: () => true, title: "Dashboard Ustadz" },
];

export function UstadzLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const pageTitle =
    PAGE_TITLES.find((entry) => entry.match(location.pathname))?.title ??
    "Dashboard Mengajar";

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return (
    <div className="ustadz-shell min-h-dvh">
      <UstadzSidebar />
      <div className="md:pl-64">
        <header className="ustadz-header sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b-[3px] px-4 md:px-8">
          <h1 className="truncate text-base font-black uppercase tracking-tight md:text-lg">
            {pageTitle}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs font-bold ustadz-muted sm:inline">
              {user?.name || user?.username || "Ustadz/Ustadzah"}
            </span>
            <a
              href="/member/ngaji-ceria"
              title="Masuk area santri"
              className="ustadz-nav-item inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs"
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">Area Santri</span>
            </a>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Keluar"
              title="Keluar"
              className="ustadz-nav-item flex h-9 w-9 items-center justify-center rounded-xl"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>
      <UstadzBottomNav />
    </div>
  );
}
