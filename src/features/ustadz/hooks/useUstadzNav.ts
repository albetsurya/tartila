import {
  LayoutGrid,
  Users,
  BookOpen,
  Trophy,
  User,
  type LucideIcon,
} from "@/components/ui/CustomIcons";

export interface UstadzNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export const USTADZ_NAV: UstadzNavItem[] = [
  { label: "Dashboard", to: "/ustadz", icon: LayoutGrid, end: true },
  { label: "Kelas", to: "/ustadz/kelas", icon: Users },
  { label: "Kurikulum", to: "/ustadz/kurikulum", icon: BookOpen },
  { label: "Kuis", to: "/ustadz/kuis", icon: Trophy },
  { label: "Profil", to: "/ustadz/profil", icon: User },
];
