import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LockSvg } from "@/components/ui/CustomIcons";

/**
 * Modal ajakan login saat tamu mengetuk konten terkunci.
 * Alur belajar tidak rusak: tombol kembali menutup modal di tempat.
 */
export function LoginPromptModal({
  open,
  onClose,
  title = "Konten Terkunci",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
}) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    panel?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5 py-6"
      onClick={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border-[3px] border-[#134E4A] bg-[#F0FDF4] p-6 text-center text-[#134e4a] shadow-[6px_6px_0px_#134E4A]"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#134e4a] px-3 py-1 text-xs font-black text-white">
          <LockSvg size={13} /> {title}
        </span>
        <h2 className="mt-3 font-display text-xl font-black">
          Masuk untuk Akses Penuh
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#134e4a]/70">
          Masuk atau daftar untuk membuka seluruh Jilid 1–5 dan semua game. Tamu
          dapat memainkan Jilid 1–2, Hijaiyah Pop, Ritme Ngaji, Quiz Ngaji, dan
          Arabic Wordle.
        </p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="game-button mt-4 w-full bg-[#0D9488]"
        >
          Masuk / Daftar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="game-button mt-2 w-full border border-gray-100 bg-white text-[#134e4a]"
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
}
