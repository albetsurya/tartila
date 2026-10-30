import React, { useEffect, useState } from "react";
import {
  HarakatSlasherCoverSvg,
  HijaiyahHarvestCoverSvg,
  WudhuFlowCoverSvg,
} from "@/components/ui/Illustrations";
import { ChevronRightSvg } from "@/components/ui/CustomIcons";
import { AppModal } from "@/components/ui/AppModal";

interface TutorialStep {
  title: string;
  description: string;
  image?: React.ReactNode;
}

const TUTORIALS: Record<string, { title: string; steps: TutorialStep[] }> = {
  "harakat-rush": {
    title: "Cara Bermain Harakat Slasher",
    steps: [
      {
        title: "Geser untuk Menebas",
        description:
          "Sentuh layar dan geser seperti memainkan pedang. Setiap geseran bisa menebas huruf yang dilempar ke udara.",
        image: <HarakatSlasherCoverSvg size={96} />,
      },
      {
        title: "Tebas Target, Hindari Pengecoh",
        description:
          "Potong huruf berhias cincin kuning (target) untuk menambah skor dan combo. Salah tebas pengecoh atau membiarkan target jatuh akan mengurangi nyawa!",
        image: <HarakatSlasherCoverSvg size={96} />,
      },
    ],
  },
  "hijaiyah-pop": {
    title: "Cara Bermain Hijaiyah Pop!",
    steps: [
      {
        title: "Tangkap Bintang Hijaiyah",
        description:
          "Ketuk bintang huruf Arab yang cocok dengan target suara atau teks yang muncul di layar.",
        image: <HijaiyahHarvestCoverSvg size={96} />,
      },
      {
        title: "Hindari Item Salah",
        description:
          "Jangan mengetuk bintang yang salah agar combo tidak terputus dan nyawa tetap aman!",
        image: <HijaiyahHarvestCoverSvg size={96} />,
      },
    ],
  },
  "wudhu-flow": {
    title: "Cara Bermain Wudhu Flow",
    steps: [
      {
        title: "Putar Pipa Wudhu",
        description:
          "Ketuk pipa untuk memutarnya hingga tersambung dari pipa 1 sampai 10 sesuai urutan wudhu.",
        image: <WudhuFlowCoverSvg size={96} />,
      },
      {
        title: "Alirkan Air",
        description:
          "Setelah pipa tersambung, ketuk Alirkan Air untuk memverifikasi urutan wudhu yang benar.",
        image: <WudhuFlowCoverSvg size={96} />,
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

export function GameTutorialModal({
  gameId,
  forceShow = false,
  onClose,
}: {
  gameId: string;
  forceShow?: boolean;
  onClose?: () => void;
}) {
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

  if (!tutorial) return null;

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

  const handleSkip = () => {
    markSeen(gameId);
    setOpen(false);
    onClose?.();
  };

  return (
    <AppModal isOpen={open} onClose={handleSkip} title={step.title}>
      <p className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B]">
        Panduan Bermain • {stepIndex + 1}/{tutorial.steps.length}
      </p>

      {step.image && (
        <div className="my-4 flex h-36 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-white p-2 shadow-[inset_2px_2px_0px_rgba(19,78,74,0.1)]">
          {typeof step.image === "string" ? (
            <img
              src={step.image}
              alt=""
              className="h-full max-h-32 object-contain drop-shadow-[2px_2px_0px_rgba(19,78,74,0.2)]"
              draggable={false}
            />
          ) : (
            step.image
          )}
        </div>
      )}

      <p className="text-xs font-bold text-[#134E4A]/70 leading-relaxed">
        {step.description}
      </p>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={handleSkip}
          className="flex-1 rounded-xl border-[2px] border-[#134E4A] bg-white py-2.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
        >
          Lewati
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 rounded-xl border-[2px] border-[#134E4A] bg-[#0D9488] py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
        >
          <span>{isLast ? "Mulai Main!" : "Lanjut"}</span>
          <ChevronRightSvg size={14} />
        </button>
      </div>
    </AppModal>
  );
}
