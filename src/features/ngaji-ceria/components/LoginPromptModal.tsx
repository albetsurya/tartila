import { useNavigate } from "react-router-dom";
import { AppModal } from "@/components/ui/AppModal";

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

  return (
    <AppModal isOpen={open} onClose={onClose} title={title} variant="warm">
      <div className="text-center">
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
    </AppModal>
  );
}
