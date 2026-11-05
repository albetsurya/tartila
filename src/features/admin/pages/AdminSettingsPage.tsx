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
} from "@/components/ui/CustomIcons";
import {
  BTN_BASE,
  BTN_DANGER_COLOR,
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
    <div className="max-w-3xl space-y-6 pb-12 font-sans font-bold text-[#1A1A1A]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={TOAST}>
          <Check size={16} />
          {toastMessage}
        </div>
      )}

      {/* Header Halaman */}
      <div className={`p-5 ${CARD}`}>
        <h1 className={PAGE_TITLE}>Pengaturan Sistem</h1>
        <p className={PAGE_SUBTITLE}>
          Kelola profil administratif, tampilan antarmuka, dan akses dokumentasi.
        </p>
      </div>

      {/* 1. Kartu Profil Admin */}
      <div className={`space-y-4 p-5 sm:p-6 ${CARD}`}>
        <h2 className={SECTION_TITLE}>Profil Administrator</h2>

        <div className="flex flex-col justify-between gap-4 pt-1 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 bg-[#9BE58B] font-display text-xl font-black text-[#1A1A1A] ${ICON_BOX}`}>
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-display text-base font-black leading-tight text-[#1A1A1A] sm:text-lg">
                  {adminName}
                </h3>
                <span className="inline-flex items-center rounded-lg border-2 border-[#1A1A1A] bg-[#FF9F1C] px-2.5 py-0.5 text-[11px] font-black text-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]">
                  {adminRole}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-bold text-[#1A1A1A]/70">{adminEmail}</p>
              <p className="mt-1 text-[11px] font-bold text-[#1A1A1A]/60">
                Akses level penuh ke modul manajemen konten &amp; event
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sakelar tema aplikasi */}
      <div className={`space-y-4 p-5 sm:p-6 ${CARD}`}>
        <h2 className={SECTION_TITLE}>Tampilan Antarmuka</h2>

        <div className="flex items-center justify-between gap-4 rounded-xl border-[2px] border-[#1A1A1A] bg-[#FFF4DC] p-4 shadow-[2px_2px_0px_#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 bg-[#FFFBF2] text-[#1A1A1A] ${ICON_BOX}`}>
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} className="text-[#FF9F1C]" />}
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1A1A1A]">
                {isDarkMode ? "Mode Gelap (Dark Mode)" : "Mode Terang (Light Mode)"}
              </h3>
              <p className="mt-0.5 text-xs font-bold text-[#1A1A1A]/70">
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
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-[2.5px] border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-[#FFD60A]/30 ${
              isDarkMode ? "bg-[#FFD60A]" : "bg-[#FFFBF2]"
            }`}
          >
            <span
              className={`pointer-events-none ml-0.5 inline-block h-5 w-5 transform rounded-full border-2 border-[#1A1A1A] transition duration-200 ease-in-out ${
                isDarkMode ? "translate-x-6 bg-[#FFFBF2]" : "translate-x-0 bg-[#FF9F1C]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Tautan Bantuan */}
      <div className={`space-y-3 p-5 sm:p-6 ${CARD}`}>
        <h2 className={SECTION_TITLE}>Tautan &amp; Dukungan</h2>

        <div className="space-y-3">
          <Link
            to="/admin/audio-check"
            className="flex items-center justify-between rounded-xl border-[2px] border-[#1A1A1A] bg-[#FFFBF2] p-3.5 shadow-[2px_2px_0px_#1A1A1A] transition-all hover:bg-[#FFF4DC] active:translate-y-[2px] active:shadow-none"
          >
            <div className="flex items-center gap-3">
              <Volume2 size={18} className="text-[#2F6FED]" />
              <div>
                <span className="block text-xs font-black text-[#1A1A1A]">
                  Cek &amp; Verifikasi Audio Tilawati
                </span>
                <span className="text-[11px] font-bold text-[#1A1A1A]/70">
                  Verifikasi fisik aset audio tilawati jilid 1 sampai 6
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#1A1A1A]" />
          </Link>

          <Link
            to="/privacy-policy"
            className="flex items-center justify-between rounded-xl border-[2px] border-[#1A1A1A] bg-[#FFFBF2] p-3.5 shadow-[2px_2px_0px_#1A1A1A] transition-all hover:bg-[#FFF4DC] active:translate-y-[2px] active:shadow-none"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#1A1A1A]" />
              <div>
                <span className="block text-xs font-black text-[#1A1A1A]">
                  Kebijakan Privasi &amp; Ketentuan Layanan
                </span>
                <span className="text-[11px] font-bold text-[#1A1A1A]/70">
                  Pedoman perlindungan data pengguna dan hak cipta
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#1A1A1A]" />
          </Link>
        </div>
      </div>

      {/* 4. Tombol Logout (Danger / Coral) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleLogout}
          className={`${BTN_BASE} ${BTN_DANGER_COLOR} w-full px-5 py-3.5 text-sm`}
        >
          <LogOut size={18} />
          Keluar dari Akun Admin
        </button>
      </div>
    </div>
  );
}

export default AdminSettingsPage;
