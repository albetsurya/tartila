import { Link, useLocation } from "react-router-dom";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  analytics: "Analitik",
  users: "Pengguna",
  "ustadz-requests": "Pengajuan Ustadz",
  books: "Buku",
  quizzes: "Kuis",
  settings: "Pengaturan",
};

export function AdminBreadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const page = segments[segments.length - 1];
  const label =
    segments.length <= 1 ? "Dasbor" : (SEGMENT_LABELS[page] ?? page);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-1.5 text-sm font-bold"
    >
      <Link
        to="/admin"
        className="truncate font-bold text-[#1A1A1A]/60 transition-colors hover:text-[#2F6FED]"
      >
        Admin
      </Link>
      <span className="text-[#1A1A1A]/40" aria-hidden="true">
        /
      </span>
      <span className="truncate font-display font-black text-[#1A1A1A]">{label}</span>
    </nav>
  );
}
