import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { XSvg } from "./CustomIcons";

export interface AppBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Bottom Sheet standar aplikasi (Single Source of Truth).
 *
 * ATURAN PENGGUNAAN:
 * - **AppBottomSheet**: Pilihan ringan (pilih level game), filter, form pendek
 *   (mis. Edit Profil/Avatar), dan aksi cepat yang mudah dijangkau jempol.
 *   Non-blocking: konten di belakang tetap terlihat, user bisa langsung tutup
 *   dengan klik backdrop / swipe / tombol X.
 *
 * - **AppModal**: Konfirmasi destruktif, error kritis, info penting, reward
 *   (blocking). Posisi tengah, memerlukan perhatian penuh.
 *
 * Dipakai untuk: aksi cepat, pilihan opsi, filter, dan form ringan
 * yang mudah dijangkau jempol.
 */
export function AppBottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: AppBottomSheetProps) {
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
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-t-[32px] border-[3px] border-[#134E4A] bg-[var(--bg-card,#FFFFFF)] px-5 pb-8 pt-3 shadow-[4px_4px_0px_#134E4A]"
          >
            <div
              aria-hidden="true"
              className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--border-color,#134E4A)]/25"
            />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-black text-[var(--text-main,#134E4A)]">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="rounded-xl border-[3px] border-[#FF6B6B] bg-[#FF6B6B] p-1.5 text-white shadow-[3px_3px_0px_#DC2626] active:translate-y-[2px] active:shadow-none cursor-pointer transition-all hover:scale-105"
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

export default AppBottomSheet;
