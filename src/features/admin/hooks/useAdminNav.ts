import {
  LayoutGrid,
  ChartLine,
  Users,
  BookOpen,
  Trophy,
  Gamepad,
  Settings,
  Sparkles,
  Volume2,
  Timer,
  LayerGroup,
  List,
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
    title: "Audio & Timeline",
    items: [
      { label: "Cek Audio", to: "/admin/audio-check", icon: Volume2 },
      {
        label: "Timeline Editor",
        to: "/admin/timeline",
        icon: Timer,
      },
      {
        label: "Timeline Lokal",
        to: "/admin/timeline-local",
        icon: Timer,
      },
      {
        label: "Timeline Cloud",
        to: "/admin/timeline-cloud",
        icon: LayerGroup,
      },
    ],
  },
  {
    title: "Konten",
    items: [
      { label: "Pengguna", to: "/admin/users", icon: Users },
      { label: "Buku", to: "/admin/books", icon: BookOpen },
      { label: "Kuis", to: "/admin/quizzes", icon: Trophy },
      { label: "Katalog Game", to: "/admin/games", icon: Gamepad },
    ],
  },
  {
    title: "Sistem",
    items: [
      { label: "Pengaturan", to: "/admin/settings", icon: Settings },
      { label: "Menu Lengkap", to: "/admin/menu", icon: List },
      {
        label: "Ilustrasi UI",
        to: "/admin/preview-illustrations",
        icon: Sparkles,
      },
    ],
  },
];

// Navigasi bawah (mobile), maksimal 5 item. Menu sekunder tersaji di halaman Menu Lengkap (/admin/menu).
export const ADMIN_BOTTOM_NAV: AdminNavItem[] = [
  { label: "Dasbor", to: "/admin", icon: LayoutGrid, end: true },
  { label: "Audio", to: "/admin/audio-check", icon: Volume2 },
  { label: "Timeline", to: "/admin/timeline", icon: Timer },
  { label: "Game", to: "/admin/games", icon: Gamepad },
  { label: "Lengkap", to: "/admin/menu", icon: List },
];

export function useAdminNav(): AdminNavSection[] {
  return ADMIN_NAV;
}
