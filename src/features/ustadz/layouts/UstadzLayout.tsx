import { useCallback, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Sparkles, ChevronLeft } from "@/components/ui/CustomIcons";
import "../ustadz.css";
import { UstadzSidebar } from "../components/UstadzSidebar";
import { BottomNav } from "../components/BottomNav";

const PAGE_TITLES: {
  match: (pathname: string) => boolean;
  title: string;
  subtitle?: string;
}[] = [
  {
    match: (p) => p.startsWith("/ustadz/preview"),
    title: "Preview Materi",
    subtitle: "Tinjau bacaan dan audio metode Tartila",
  },
  {
    match: (p) => p.startsWith("/ustadz/learning"),
    title: "Kurikulum & Bank Kuis",
    subtitle: "Pusat materi dan evaluasi santri",
  },
  {
    match: (p) => p.startsWith("/ustadz/kuis/baru"),
    title: "Buat Kuis Baru",
    subtitle: "Rancang soal kuis untuk santri",
  },
  {
    match: (p) => p.startsWith("/ustadz/kuis"),
    title: "Bank Kuis",
    subtitle: "Kelola bank soal dan evaluasi pemahaman",
  },
  {
    match: (p) => p.startsWith("/ustadz/laporan"),
    title: "Laporan Santri",
    subtitle: "Pantau aktivitas dan progres belajar",
  },
  {
    match: (p) => p === "/ustadz/kelas/baru",
    title: "Buat Kelas Baru",
    subtitle: "Buka ruang kelas digital baru",
  },
  {
    match: (p) => p.startsWith("/ustadz/kelas/"),
    title: "Detail Kelas",
    subtitle: "Informasi santri dan capaian materi",
  },
  {
    match: (p) => p.startsWith("/ustadz/kelas"),
    title: "Kelola Kelas",
    subtitle: "Daftar kelas aktif dan arsip pengajaran",
  },
  {
    match: (p) => p.startsWith("/ustadz/kurikulum"),
    title: "Kurikulum Tartila",
    subtitle: "Silabus dan panduan jilid 1 sampai 6",
  },
  {
    match: (p) => p.startsWith("/ustadz/profil"),
    title: "Profil Pengajar",
    subtitle: "Pengaturan akun dan preferensi pengajaran",
  },
  {
    match: () => true,
    title: "Dashboard Ustadz",
    subtitle: "Ringkasan aktivitas mengajar hari ini",
  },
];

function PageLoadingFallback() {
  return (
    <div
      className="ustadz-loader space-y-6"
      aria-busy="true"
      aria-label="Memuat halaman"
    >
      <div className="h-9 w-52 rounded-xl bg-[#E2E8F0]" />
      <div className="grid gap-5 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 rounded-2xl border-3 border-[#134E4A]/15 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

export function UstadzLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const pageInfo = PAGE_TITLES.find((entry) =>
    entry.match(location.pathname),
  ) ?? {
    title: "Dashboard Ustadz",
    subtitle: "Ringkasan aktivitas mengajar hari ini",
  };

  const isLearningPage =
    location.pathname.includes("/kurikulum") ||
    location.pathname.includes("/kuis");

  const isSubPage =
    location.pathname !== "/ustadz" && location.pathname !== "/ustadz/";

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const contentKey = isLearningPage ? "learning-page" : location.pathname;

  return (
    <div className="ustadz-shell min-h-dvh bg-[#FDFBF7]">
      <UstadzSidebar />

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b-2 sm:border-b-3 border-[#134E4A] bg-white px-4 md:px-8 shadow-[0_2px_0px_#134E4A]">
          <div className="flex min-w-0 items-center gap-3 pr-4">
            {isSubPage && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#F8FAFC] text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#FEF08A] active:scale-95"
                aria-label="Kembali"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-base font-black tracking-tight text-[#134E4A] md:text-lg">
                {pageInfo.title}
              </h1>
              {pageInfo.subtitle && (
                <p className="hidden text-xs font-semibold text-[#183B38]/70 sm:block">
                  {pageInfo.subtitle}
                </p>
              )}
            </div>
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

        <main className="mx-auto max-w-7xl px-4 pt-6 pb-28 md:px-8 md:pb-12">
          <motion.div
            key={contentKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
          >
            <Suspense fallback={<PageLoadingFallback />}>
              <Outlet />
            </Suspense>
          </motion.div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
