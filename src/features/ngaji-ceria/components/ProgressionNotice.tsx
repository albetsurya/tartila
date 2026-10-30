import { useEffect, useState } from "react";
import { SparklesSvg } from "../../../components/ui/CustomIcons";
import { playSfx } from "../pages/games/_shared/audio";
import {
  ACHIEVEMENT_LABELS,
  getProgress,
  getRank,
  subscribeProgress,
} from "../pages/games/_shared/progression";

interface Notice {
  title: string;
  description: string;
}

export function ProgressionNotice() {
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let previous = getProgress();
    let timer: number | undefined;
    const refresh = () => {
      const next = getProgress();
      const previousRank = getRank(previous.xp);
      const nextRank = getRank(next.xp);
      const newAchievement = next.achievements.find(
        (id) => !previous.achievements.includes(id),
      );
      const nextNotice =
        newAchievement && ACHIEVEMENT_LABELS[newAchievement]
          ? {
              title: `Lencana baru: ${ACHIEVEMENT_LABELS[newAchievement].title}`,
              description: ACHIEVEMENT_LABELS[newAchievement].description,
            }
          : nextRank.title !== previousRank.title
            ? {
                title: `Naik pangkat: ${nextRank.title}`,
                description: `${next.xp} XP terkumpul. Teruskan belajar!`,
              }
            : null;
      previous = next;
      if (!nextNotice) return;
      if (newAchievement) {
        playSfx("badge-earned");
      } else {
        playSfx("level-up");
      }
      setNotice(nextNotice);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => setNotice(null), 4500);
    };
    const unsubscribe = subscribeProgress(refresh);
    return () => {
      unsubscribe();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  if (!notice) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-20 z-[70] w-[min(90vw,22rem)] -translate-x-1/2 rounded-2xl border-[3px] border-[#134E4A] bg-white px-4 py-3 text-center shadow-[4px_4px_0px_#134E4A]"
    >
      <p className="flex items-center justify-center gap-1 font-display text-sm font-black text-[#134e4a]">
        <SparklesSvg size={14} />
        <span>{notice.title}</span>
      </p>
      <p className="mt-0.5 text-xs font-bold text-[#134e4a]/70">
        {notice.description}
      </p>
    </div>
  );
}
