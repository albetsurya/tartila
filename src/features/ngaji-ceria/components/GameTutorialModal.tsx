import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NGAJI_CERIA_ASSETS } from "../data/assets";

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  icon?: string;
}

const TUTORIALS: Record<string, { title: string; steps: TutorialStep[] }> = {
  "harakat-rush": {
    title: "Cara Bermain Harakat Rush",
    steps: [
      {
        title: "Pindah Jalur & Lompat",
        description: "Ketuk jalur kiri/kanan untuk berpindah, atau ketuk tombol Lompat saat ada rintangan batu.",
        image: NGAJI_CERIA_ASSETS.harakatRush,
      },
      {
        title: "Ambil Target Harakat",
        description: "Tabrak tile harakat yang tepat untuk mengumpulkan skor dan combo!",
        image: NGAJI_CERIA_ASSETS.tangkapHarakat,
      },
    ],
  },
  "hijaiyah-pop": {
    title: "Cara Bermain Hijaiyah Pop!",
    steps: [
      {
        title: "Pecahkan Balon",
        description: "Ketuk balon huruf Arab yang cocok dengan target suara/teks di layar.",
        image: NGAJI_CERIA_ASSETS.hijaiyahPop,
      },
      {
        title: "Hindari Balon Salah",
        description: "Jangan menepuk balon yang salah agar combo tidak terputus!",
        image: NGAJI_CERIA_ASSETS.qirraPop,
      },
    ],
  },
  "wudhu-flow": {
    title: "Cara Bermain Wudhu Flow",
    steps: [
      {
        title: "Putar Pipa Wudhu",
        description: "Ketuk pipa untuk memutarnya hingga tersambung dari pipa 1 sampai 10 sesuai urutan wudhu.",
        image: NGAJI_CERIA_ASSETS.wudhuFlow,
      },
      {
        title: "Alirkan Air",
        description: "Setelah pipa tersambung, ketuk Alirkan Air untuk memverifikasi urutan wudhu.",
        image: NGAJI_CERIA_ASSETS.stepDoaSelesai,
      },
    ],
  },
};

const SEEN_KEY = "ngajiceria:tutorials-seen:v1";

function getSeenTutorials(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markSeen(gameId: string) {
  try {
    const current = getSeenTutorials();
    if (!current.includes(gameId)) {
      localStorage.setItem(SEEN_KEY, JSON.stringify([...current, gameId]));
    }
  } catch {}
}

export function GameTutorialModal({ gameId, forceShow = false, onClose }: { gameId: string; forceShow?: boolean; onClose?: () => void }) {
  const tutorial = TUTORIALS[gameId];
  const [open, setOpen] = useState(() => {
    if (!tutorial) return false;
    if (forceShow) return true;
    return !getSeenTutorials().includes(gameId);
  });
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (forceShow && tutorial) setOpen(true);
  }, [forceShow, tutorial]);

  if (!open || !tutorial) return null;

  const step = tutorial.steps[stepIndex] || tutorial.steps[0];
  const isLast = stepIndex === tutorial.steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      markSeen(gameId);
      setOpen(false);
      onClose?.();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#134e4a]/60 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative z-10 w-full max-w-sm rounded-[32px] border-4 border-white bg-white p-5 text-center shadow-2xl"
      >
        <p className="text-[10px] font-black uppercase tracking-widest text-[#0D9488]">
          Panduan Bermain • {stepIndex + 1}/{tutorial.steps.length}
        </p>
        <h2 className="mt-1 font-display text-lg font-black text-[#134e4a]">{step.title}</h2>

        {step.image && (
          <div className="my-4 flex h-36 items-center justify-center rounded-2xl bg-[#F0FDF4] p-2">
            <img src={step.image} alt="" className="h-full max-h-32 object-contain drop-shadow-lg" draggable={false} />
          </div>
        )}

        <p className="text-xs leading-relaxed text-[#134e4a]/70">{step.description}</p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              markSeen(gameId);
              setOpen(false);
              onClose?.();
            }}
            className="flex-1 rounded-full border border-gray-200 bg-white py-2.5 text-xs font-bold text-[#134e4a]/60"
          >
            Lewati
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-full bg-[#0D9488] py-2.5 text-xs font-black text-white shadow-md hover:bg-[#0F766E]"
          >
            {isLast ? "Mulai Main!" : "Lanjut →"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
