import {
  LayoutGrid,
  ChartLine,
  Users,
  BookOpen,
  Trophy,
  Settings,
  Sparkles,
  type LucideIcon,
} from "@/components/ui/CustomIcons";

export interface AdminNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dasbor", to: "/admin", icon: LayoutGrid, end: true },
      { label: "Analitik", to: "/admin/analytics", icon: ChartLine },
    ],
  },
  {
    title: "Konten",
    items: [
      { label: "Pengguna", to: "/admin/users", icon: Users },
      { label: "Buku", to: "/admin/books", icon: BookOpen },
      { label: "Kuis", to: "/admin/quizzes", icon: Trophy },
    ],
  },
  {
    title: "Sistem",
    items: [
      { label: "Pengaturan", to: "/admin/settings", icon: Settings },
      {
        label: "Ilustrasi UI",
        to: "/admin/preview-illustrations",
        icon: Sparkles,
      },
    ],
  },
];

export function useAdminNav(): AdminNavSection[] {
  return ADMIN_NAV;
}
