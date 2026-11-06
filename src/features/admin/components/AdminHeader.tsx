import { NavLink } from "react-router-dom";
import { Sparkles } from "@/components/ui/CustomIcons";
import { AdminBreadcrumb } from "./AdminBreadcrumb";

/**
 * Header sticky dengan border bawah tebal.
 *
 * Catatan: tombol mode gelap dihapus karena panel admin sekarang memakai
 * warna HEX tetap (tema terang). Toggle tema aplikasi tetap ada di
 * halaman Pengaturan.
 */
export function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b-[3px] border-[#134E4A] bg-white px-4 font-sans md:px-8">
      <AdminBreadcrumb />
      <div className="ml-auto flex items-center gap-2">
        <NavLink
          to="/member/ngaji-ceria"
          title="Masuk Mode Santri / Member"
          className="inline-flex items-center gap-1.5 rounded-xl border-[2px] border-[#134E4A] bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#F0FDF4] active:translate-y-[2px] active:shadow-none"
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">Mode Member</span>
        </NavLink>
      </div>
    </header>
  );
}
