import { Link, useLocation } from "react-router-dom";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  analytics: "Analitik",
  users: "Pengguna",
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
      className="flex min-w-0 items-center gap-1.5 text-sm"
    >
      <Link
        to="/admin"
        className="truncate font-medium admin-muted transition-colors duration-150 hover:opacity-80"
      >
        Admin
      </Link>
      <span className="admin-muted" aria-hidden="true">
        /
      </span>
      <span className="truncate font-medium">{label}</span>
    </nav>
  );
}
