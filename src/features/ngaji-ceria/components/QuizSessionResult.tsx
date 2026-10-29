import { AnimatePresence, motion } from "framer-motion";
import {
  RefreshCw,
  ChevronRight,
  Sparkles,
} from "../../../components/ui/CustomIcons";
import { TilaMascot } from "../../../components/ui/TilaMascot";
import { NGAJI_CERIA_ASSETS } from "../data/assets";

interface QuizSessionResultProps {
  open: boolean;
  score: number;
  total: number;
  stars: number;
  isLastPage: boolean;
  onReplay: () => void;
  onContinue: () => void;
}

const TITLES: Record<number, string> = {
  3: "Masya Allah, Sempurna!",
  2: "Hebat, Terus Berlatih!",
  1: "Semangat, Coba Lagi Ya!",
};

export function QuizSessionResult({
  open,
  score,
  total,
  stars,
  isLastPage,
  onReplay,
  onContinue,
}: QuizSessionResultProps) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#134E4A]/40 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Hasil kuis halaman ini"
        >
          <motion.div
            initial={{ scale: 0.85, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-sm rounded-[28px] border-[3px] border-[#134E4A] bg-white p-6 text-center shadow-[6px_6px_0px_#134E4A]"
          >
            <div className="mx-auto -mt-16 mb-1 w-fit">
              <TilaMascot size={96} mood="excited" animation="bounce" />
            </div>

            <h2 className="font-display text-xl font-black text-[#134E4A]">
              {TITLES[stars] ?? TITLES[1]}
            </h2>
            <p className="mt-1 text-xs font-bold text-[#134E4A]/70">
              Halaman ini selesai. Bintangmu makin bertambah!
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              {[1, 2, 3].map((starIdx) => (
                <img
                  key={starIdx}
                  src={
                    starIdx <= stars
                      ? NGAJI_CERIA_ASSETS.bintang
                      : NGAJI_CERIA_ASSETS.bintangKosong
                  }
                  alt={starIdx <= stars ? "Bintang" : "Belum dapat bintang"}
                  className="h-9 w-9 object-contain"
                />
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border-2 border-[#0D9488]/20 bg-[#F0FDF4] p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#134E4A]/60">
                  Benar
                </p>
                <p className="font-display text-2xl font-black text-[#0D9488]">
                  {score}/{total}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-[#FF6B6B]/20 bg-[#FFF0F0] p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#134E4A]/60">
                  Nilai
                </p>
                <p className="font-display text-2xl font-black text-[#FF6B6B]">
                  {percent}%
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={onContinue}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-[#0F766E] bg-[#0D9488] text-base font-black text-white transition-all active:translate-y-0.5"
              >
                {isLastPage ? (
                  <>
                    <Sparkles size={16} />
                    Selesai
                  </>
                ) : (
                  <>
                    Lanjut <ChevronRight size={16} />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onReplay}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#134E4A]/15 bg-white text-base font-black text-[#134E4A] transition-all active:scale-[0.98]"
              >
                <RefreshCw size={16} />
                Ulangi Kuis
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default QuizSessionResult;
