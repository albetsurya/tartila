import { type ReactNode } from "react";
import { StickerCard } from "./StickerCard";

/**
 * ConfirmDialog — dialog konfirmasi destruktif/biasa, gaya Neo-Brutalism.
 * Cocok untuk aksi data yang berisiko: hapus, arsip, keluar kelas.
 *
 * @param isOpen — buka/tutup dialog
 * @param title — teks judul kuat
 * @param description — penjelasan aksi; sengaja ringkas
 * @param onConfirm — dipanggil bila pembaca menekan konfirmasi
 * @param onCancel — dipanggil bila pembaca menutup/dicomfirmasi batal
 * @param isDestructive — mengubah aksi menjadi merah destruktif
 */
export function ConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isDestructive = false,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <StickerCard className="w-full max-w-sm p-5">
        <div className="flex items-start gap-3">
          {isDestructive ? (
            <span className="ustadz-accent-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-[#7F1D1D]"
                fill="none"
                stroke="#7F1D1D"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </span>
          ) : (
            <span className="ustadz-accent-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-[#1E3A8A]"
                fill="none"
                stroke="#1E3A8A"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
          )}

          <div className="min-w-0">
            <h2 className="text-sm font-black uppercase tracking-widest text-[#0A2540]">
              {title}
            </h2>
            <p className="mt-1 text-xs font-bold text-[#4A5A6B]">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="ustadz-nav-item flex h-10 items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition-colors peer-hover:bg-[#F4F1EA]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`ustadz-accent-bg flex h-10 items-center gap-2 rounded-xl px-4 py-2 text-sm font-black ${
              isDestructive
                ? "bg-[#FECACA] text-[#7F1D1D] hover:bg-[#FCA5A5]"
                : "bg-[#0D9488] text-white hover:bg-[#0F766E]"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {isDestructive ? "Hapus" : "Lanjutkan"}
          </button>
        </div>
      </StickerCard>
    </div>
  );
}
