import { NavLink } from "react-router-dom";
import { Shield, Sparkles } from "@/components/ui/CustomIcons";
import { AdminBreadcrumb } from "./AdminBreadcrumb";
import { AVATAR, PILL_YELLOW } from "../styles";

/**
 * Header sticky.
 * - Mobile: kartu krem melayang (avatar bulat + breadcrumb + pil "Mode Member"),
 *   mengikuti kartu profil pada gambar referensi.
 * - Desktop (md+): bilah penuh dengan border bawah tebal seperti sebelumnya.
 *
 * Catatan: tombol mode gelap dihapus karena panel admin memakai warna HEX
 * tetap (tema terang). Toggle tema aplikasi tetap ada di halaman Pengaturan.
 */
export function AdminHeader() {
  return (
    <header className="sticky top-3 z-20 mx-3 mt-3 flex min-h-14 shrink-0 items-center gap-3 rounded-2xl border-[3px] border-[#1A1A1A] bg-[#FFFBF2] px-3 py-2 font-sans shadow-[4px_4px_0px_#1A1A1A] md:top-0 md:mx-0 md:mt-0 md:h-16 md:rounded-none md:border-x-0 md:border-t-0 md:px-8 md:py-0 md:shadow-none">
      <span
        className={`${AVATAR} h-10 w-10 bg-[#9BE58B] md:hidden`}
        aria-hidden="true"
      >
        <Shield size={18} />
      </span>
      <AdminBreadcrumb />
      <div className="ml-auto flex items-center gap-2">
        <NavLink
          to="/member/ngaji-ceria"
          title="Masuk Mode Santri / Member"
          className={PILL_YELLOW}
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">Mode Member</span>
        </NavLink>
      </div>
    </header>
  );
}
