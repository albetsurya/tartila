import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  Settings,
  Sun,
  Moon,
  LogOut,
  Volume2,
  FileText,
  AlertCircle,
  ChevronRight,
  Check,
  Pencil,
} from "@/components/ui/CustomIcons";
import {
  BTN_BASE,
  BTN_DANGER_COLOR,
  BTN_SECONDARY_SM,
  CARD,
  ICON_BOX,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  SECTION_TITLE,
  TOAST,
} from "../styles";

export function AdminSettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
        document.documentElement.setAttribute("data-app-theme", "night");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
        document.documentElement.setAttribute("data-app-theme", "default");
      }
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      showToast(next ? "Mode gelap diaktifkan." : "Mode terang diaktifkan.");
      return next;
    });
  };

  const handleLogout = async () => {
    const ok = window.confirm("Apakah Anda yakin ingin keluar dari Panel Admin?");
    if (!ok) return;

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  };

  const adminName = user?.name || user?.username || "Admin Tartila";
  const adminEmail = user?.email || "admin@tartila.id";
  const adminRole = user?.role === "superadmin" ? "Superadmin" : "Tartila Admin";

  return (
    <div className="max-w-3xl space-y-6 pb-12 font-sans font-bold text-[#134E4A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={TOAST}>
          <Check size={16} />
          {toastMessage}
        </div>
      )}

      {/* Header Halaman */}
      <div className={`p-4 sm:p-5 ${CARD}`}>
        <h1 className={PAGE_TITLE}>Pengaturan Sistem</h1>
        <p className={PAGE_SUBTITLE}>
          Kelola profil administratif, tampilan antarmuka, dan akses dokumentasi.
        </p>
      </div>

      {/* 1. Kartu Profil Admin */}
      <div className={`p-4 sm:p-5 ${CARD}`}>
        <div className="flex items-center justify-between gap-3">
          {/* Avatar kiri */}
          <div className={`h-12 w-12 shrink-0 bg-[#99F6E4] font-display text-lg font-black text-[#134E4A] ${ICON_BOX}`}>
            {adminName.charAt(0).toUpperCase()}
          </div>

          {/* Teks tengah */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="truncate font-display text-sm font-black leading-tight text-[#134E4A] sm:text-base">
                {adminName}
              </h3>
              <span className="inline-flex items-center rounded-md border-[1.5px] border-[#134E4A] bg-[#F59E0B] px-1.5 py-0.5 text-[10px] font-black text-[#134E4A]">
                {adminRole}
              </span>
            </div>
            <p className="truncate text-xs font-bold text-[#134E4A]/70">{adminEmail}</p>
            <p className="hidden text-[10px] font-bold text-[#134E4A]/60 sm:block">
              Akses level penuh ke modul manajemen sistem
            </p>
          </div>

          {/* Tombol Edit kanan */}
          <button
            type="button"
            onClick={() => showToast("Fitur edit profil segera hadir.")}
            className={`${BTN_SECONDARY_SM} shrink-0 px-2.5 py-1 text-xs`}
          >
            <Pencil size={13} />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* 2. Sakelar tema aplikasi */}
      <div className={`p-4 sm:p-5 ${CARD}`}>
        <h2 className={`mb-3 ${SECTION_TITLE}`}>Tampilan Antarmuka</h2>

        <div className="flex items-center justify-between gap-4 rounded-xl border-[2px] border-[#134E4A] bg-[#F0FDF4] p-3 sm:p-4 shadow-[2px_2px_0px_#134E4A]">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 bg-white text-[#134E4A] sm:h-10 sm:w-10 ${ICON_BOX}`}>
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} className="text-[#F59E0B]" />}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-[#134E4A]">
                {isDarkMode ? "Mode Gelap (Dark Mode)" : "Mode Terang (Light Mode)"}
              </h3>
              <p className="mt-0.5 text-[11px] sm:text-xs font-bold text-[#134E4A]/70">
                Berlaku untuk area aplikasi lain. Panel admin selalu tampil terang.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-pressed={isDarkMode}
            aria-label="Ganti tema aplikasi"
            className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 shrink-0 cursor-pointer items-center rounded-full border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-[#0D9488]/30 ${
              isDarkMode ? "bg-[#0D9488]" : "bg-white"
            }`}
          >
            <span
              className={`pointer-events-none ml-0.5 inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full border-2 border-[#134E4A] transition duration-200 ease-in-out ${
                isDarkMode ? "translate-x-5 sm:translate-x-6 bg-white" : "translate-x-0 bg-[#F59E0B]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Menu Pengaturan & Tautan */}
      <div className="overflow-hidden rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A]">
        <div className="border-b-[2px] border-[#134E4A]/20 bg-[#F0FDF4] px-4 py-3">
          <h2 className={SECTION_TITLE}>Tautan &amp; Dukungan</h2>
        </div>

        <div className="divide-y-2 divide-[#134E4A]/20">
          <Link
            to="/admin/audio-check"
            className="flex items-center justify-between p-3.5 transition-colors hover:bg-[#F0FDF4]"
          >
            <div className="flex items-center gap-3">
              <Volume2 size={18} className="text-[#0D9488]" />
              <div>
                <span className="block text-xs font-black text-[#134E4A]">
                  Cek &amp; Verifikasi Audio Tilawati
                </span>
                <span className="text-[11px] font-bold text-[#134E4A]/70">
                  Verifikasi fisik aset audio tilawati jilid 1 sampai 6
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#134E4A]" />
          </Link>

          <Link
            to="/privacy-policy"
            className="flex items-center justify-between p-3.5 transition-colors hover:bg-[#F0FDF4]"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#134E4A]" />
              <div>
                <span className="block text-xs font-black text-[#134E4A]">
                  Kebijakan Privasi &amp; Ketentuan Layanan
                </span>
                <span className="text-[11px] font-bold text-[#134E4A]/70">
                  Pedoman perlindungan data pengguna dan hak cipta
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#134E4A]" />
          </Link>
        </div>
      </div>

      {/* 4. Tombol Logout (Danger / Coral) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className={`${BTN_BASE} ${BTN_DANGER_COLOR} w-full px-5 py-3 text-sm`}
        >
          <LogOut size={18} />
          Keluar dari Akun Admin
        </button>
      </div>
    </div>
  );
}

export default AdminSettingsPage;
