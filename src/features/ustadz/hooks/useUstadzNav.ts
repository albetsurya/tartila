import {
  LayoutGrid,
  Users,
  BookOpen,
  Trophy,
  ClipboardList,
  User,
  type LucideIcon,
} from "@/components/ui/CustomIcons";

export interface UstadzNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface UstadzNavSection {
  category: string;
  items: UstadzNavItem[];
}

// Hierarki Navigasi Terkategori (USTADZ_PANEL_DESIGN.md Bab 7A)
export const USTADZ_NAV_SECTIONS: UstadzNavSection[] = [
  {
    category: "UTAMA",
    items: [
      { label: "Dashboard", to: "/ustadz", icon: LayoutGrid, end: true },
    ],
  },
  {
    category: "PENGAJARAN",
    items: [
      { label: "Kelas", to: "/ustadz/kelas", icon: Users },
      { label: "Kurikulum", to: "/ustadz/kurikulum", icon: BookOpen },
      { label: "Bank Kuis", to: "/ustadz/kuis", icon: Trophy },
      { label: "Laporan Santri", to: "/ustadz/laporan", icon: ClipboardList },
    ],
  },
  {
    category: "AKUN",
    items: [
      { label: "Profil", to: "/ustadz/profil", icon: User },
    ],
  },
];

// Flat export untuk backward-compatibility (BottomNav dll)
export const USTADZ_NAV: UstadzNavItem[] = USTADZ_NAV_SECTIONS.flatMap(
  (section) => section.items,
);
