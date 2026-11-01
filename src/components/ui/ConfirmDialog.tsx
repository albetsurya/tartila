import { type ReactNode } from "react";
import { StickerButton } from "./StickerButton"; // Pastikan path ini benar

export function ConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isDestructive = false,
  confirmLabel,
}: {
  isOpen: boolean;
  title: string;
  description: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  confirmLabel?: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-sm rounded-[28px] border-[3px] border-[#134E4A] bg-white p-5 shadow-[6px_6px_0px_#134E4A] sm:p-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
          {/* Ikon Neo-Brutalism */}
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] ${
              isDestructive
                ? "bg-[#FFF0F0] text-[#FF6B6B]"
                : "bg-[#F0FDF4] text-[#0D9488]"
            }`}
          >
            {isDestructive ? (
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-black text-[#134E4A]">
              {title}
            </h2>
            <div className="mt-1 text-sm font-bold text-[#134E4A]/70 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Tombol Aksi (Flex-col di HP, flex-row di Desktop) */}
        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-white px-4 py-2 text-sm font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] transition-all hover:bg-gray-50 active:translate-y-[2px] active:shadow-none sm:w-auto"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border-[3px] border-[#134E4A] px-4 py-2 text-sm font-black text-white transition-all active:translate-y-[2px] active:shadow-none sm:w-auto ${
              isDestructive
                ? "bg-[#FF6B6B] shadow-[3px_3px_0px_#134E4A] hover:bg-[#E63946]"
                : "bg-[#0D9488] shadow-[3px_3px_0px_#134E4A] hover:bg-[#0F766E]"
            }`}
          >
            {isDestructive ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
            {confirmLabel || (isDestructive ? "Hapus" : "Lanjutkan")}
          </button>
        </div>
      </div>
    </div>
  );
}
