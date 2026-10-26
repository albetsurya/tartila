import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { XSvg } from "./CustomIcons";

export interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  variant?: "warm" | "cool";
}

/**
 * Modal tengah standar aplikasi (Single Source of Truth).
 *
 * ATURAN PENGGUNAAN:
 * - **AppModal**: Konfirmasi destruktif (Hapus Akun, Logout), error kritis,
 *   info penting (peringatan), dan reward (XP/Koin). Blocking: user harus
 *   berinteraksi dulu (OK/Batal/Tutup) sebelum kembali ke konten di belakangnya.
 *
 * - **AppBottomSheet**: Pilihan ringan (pilih level), filter, form pendek,
 *   aksi cepat (Edit Profil/Avatar). Non-blocking: mudah dijangkau jempol,
 *   konten di belakang masih terlihat samar.
 *
 * Variant:
 * - "warm": background kuning (#FEF3C7) — untuk info/peringatan positif/netral.
 * - "cool": background putih/card — untuk konfirmasi netral/default.
 */
export function AppModal({
  isOpen,
  onClose,
  title,
  children,
  variant = "cool",
}: AppModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const trap = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", trap);
    ref.current
      ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
      ?.focus();
    return () => {
      document.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/50 px-5 py-6"
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className={`max-h-[calc(100dvh-3rem)] w-full max-w-sm overflow-y-auto overscroll-contain rounded-[32px] border-[3px] border-[var(--border-color,#134E4A)] p-6 shadow-[6px_6px_0px_var(--shadow-color,#134E4A)] ${
              variant === "warm"
                ? "bg-[#FEF3C7] text-[#78350F]"
                : "bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)]"
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 className="font-display text-xl font-black">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="shrink-0 rounded-lg border-2 border-[var(--border-color,#134E4A)] bg-white p-1.5 text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px] active:shadow-none cursor-pointer transition-all"
              >
                <XSvg size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default AppModal;
