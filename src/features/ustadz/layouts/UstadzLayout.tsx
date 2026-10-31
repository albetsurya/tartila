import { useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Sparkles } from "@/components/ui/CustomIcons";
import "../ustadz.css";
import { UstadzSidebar } from "../components/UstadzSidebar";
import { BottomNav } from "../components/BottomNav";

const PAGE_TITLES: { match: (pathname: string) => boolean; title: string; subtitle?: string }[] = [
  { match: (p) => p.startsWith("/ustadz/preview"), title: "Preview Materi", subtitle: "Tinjau bacaan dan audio metode Tartila" },
  { match: (p) => p.startsWith("/ustadz/kuis/baru"), title: "Buat Kuis Baru", subtitle: "Rancang soal kuis untuk santri" },
  { match: (p) => p.startsWith("/ustadz/kuis"), title: "Bank Kuis", subtitle: "Kelola bank soal dan evaluasi pemahaman" },
  { match: (p) => p.startsWith("/ustadz/laporan"), title: "Laporan Santri", subtitle: "Pantau aktivitas dan progres belajar" },
  { match: (p) => p === "/ustadz/kelas/baru", title: "Buat Kelas Baru", subtitle: "Buka ruang kelas digital baru" },
  { match: (p) => p.startsWith("/ustadz/kelas/"), title: "Detail Kelas", subtitle: "Informasi santri dan capaian materi" },
  { match: (p) => p.startsWith("/ustadz/kelas"), title: "Kelola Kelas", subtitle: "Daftar kelas aktif dan arsip pengajaran" },
  { match: (p) => p.startsWith("/ustadz/kurikulum"), title: "Kurikulum Tartila", subtitle: "Silabus dan panduan jilid 1 sampai 6" },
  { match: (p) => p.startsWith("/ustadz/profil"), title: "Profil Pengajar", subtitle: "Pengaturan akun dan preferensi pengajaran" },
  { match: () => true, title: "Dashboard Ustadz", subtitle: "Ringkasan aktivitas mengajar hari ini" },
];

export function UstadzLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const pageInfo =
    PAGE_TITLES.find((entry) => entry.match(location.pathname)) ?? {
      title: "Dashboard Ustadz",
      subtitle: "Ringkasan aktivitas mengajar hari ini",
    };

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  return (
    <div className="ustadz-shell min-h-dvh bg-[#FDFBF7]">
      {/* Desktop Sidebar */}
      <UstadzSidebar />

      {/* Main Column */}
      <div className="md:pl-64">
        {/* Neo-Brutalist Header */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b-2 sm:border-b-3 border-[#134E4A] bg-white px-4 md:px-8 shadow-[0_2px_0px_#134E4A]">
          <div className="min-w-0 pr-4">
            <h1 className="truncate text-base font-black tracking-tight text-[#134E4A] md:text-lg">
              {pageInfo.title}
            </h1>
            {pageInfo.subtitle && (
              <p className="hidden text-xs font-semibold text-[#183B38]/70 sm:block">
                {pageInfo.subtitle}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden text-xs font-black text-[#134E4A] md:inline">
              {user?.name || user?.username || "Ustadz"}
            </span>
            <a
              href="/member/ngaji-ceria"
              title="Area Santri"
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#FDE047] active:scale-95"
            >
              <Sparkles size={14} className="text-[#134E4A]" />
              <span className="hidden sm:inline">Area Santri</span>
            </a>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Keluar"
              title="Keluar"
              className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#FEE2E2] hover:text-[#B91C1C] active:scale-95"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="mx-auto max-w-7xl px-4 pt-6 pb-28 md:px-8 md:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation */}
      <BottomNav />
    </div>
  );
}
