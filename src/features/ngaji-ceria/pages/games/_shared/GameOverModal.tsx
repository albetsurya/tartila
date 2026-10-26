import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Play, CoinSvg, Sparkles } from "@/components/ui/CustomIcons";
import { StickerButton } from "@/components/ui/StickerButton";
import { AppModal } from "@/components/ui/AppModal";
import { type GameOverModalProps } from "./types";
import { awardProgress, getProgress, recordLeaderboard } from "./progression";
import { soundManager } from "../../../services/soundManager";
import { canonicalGameId } from "../../../data/gameAccess";
import { addEvent } from "@/services/eventService";

export interface SecondChanceConfig {
  onSuccess: () => void;
  question?: string;
  options?: string[];
  correctIndex?: number;
}

export function GameOverModal({
  visible,
  score,
  best,
  isNewRecord,
  onRetry,
  onExit,
  title = "Sesi Selesai",
  description,
  children,
  secondChance,
  maxCombo = 0,
  victory = score > 0,
  achievementIds = [],
}: GameOverModalProps & { secondChance?: SecondChanceConfig }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const committed = useRef(false);
  const [xpGained, setXpGained] = useState(0);
  const [coinsGained, setCoinsGained] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [skipped, setSkipped] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      committed.current = false;
      setSelected(null);
      setSkipped(false);
      setXpGained(0);
      setCoinsGained(0);
      return;
    }
    if ((secondChance && !skipped) || committed.current) return;
    committed.current = true;
    const gameId = canonicalGameId(
      location.pathname.split("/").pop() || "game",
    );
    const before = getProgress().xp;
    const beforeCoins = getProgress().coins;
    const achievements = [...achievementIds];
    if (maxCombo >= 5) achievements.push("qari-cepat");
    if (victory && gameId.startsWith("tajwid-"))
      achievements.push("pejuang-tajwid");
    if (victory && ["ayat-hunter", "doa-dungeon"].includes(gameId))
      achievements.push(`${gameId}-clear`);
    if (victory && gameId === "nabi-chronicles")
      achievements.push("nabi-chronicles-complete");
    if (victory && gameId === "malaikat-mission")
      achievements.push("malaikat-master");
    if (score > 0 && gameId === "tajwid-tetris")
      achievements.push("tetris-lines");
    const progress = awardProgress(
      gameId,
      score,
      25 + Math.min(20, maxCombo * 2),
      achievements,
    );
    setXpGained(progress.xp - before);
    setCoinsGained(progress.coins - beforeCoins);
    recordLeaderboard(gameId, score);
    try {
      sessionStorage.setItem("ngajiceria:recent-game-finished", gameId);
      sessionStorage.setItem("ngajiceria:recent-game-timestamp", String(Date.now()));
      window.dispatchEvent(new CustomEvent("ngajiceria:game-finished", { detail: { gameId, score } }));
    } catch {
      // ignore
    }
    soundManager.playSfx(victory ? "victory" : "defeat");
    addEvent({
      type: "game_completed",
      missionId: gameId,
      missionName: gameId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      details: {
        score,
        best,
        victory,
        xpGained: progress.xp - before,
        coinsGained: progress.coins - beforeCoins,
        isNewRecord,
      },
    });
  }, [
    visible,
    secondChance,
    skipped,
    score,
    maxCombo,
    victory,
    location.pathname,
    achievementIds,
  ]);

  if (!visible) return null;

  const options = secondChance?.options ?? [
    "Bismillah",
    "Alhamdulillah",
    "MasyaAllah",
  ];
  const correctIndex = secondChance?.correctIndex ?? 0;

  if (secondChance && !skipped)
    return (
      <AppModal isOpen={true} title="Jangan Menyerah!" variant="warm" onClose={onExit}>
        <p className="mb-1 mt-2 text-sm font-black text-[#FF6B6B]">
          Kesempatan Kedua
        </p>
        <p className="mb-4 text-xs font-bold text-[#134E4A]/70">
          Jawab 1 soal bonus ini untuk bangkit kembali.
        </p>
        <p className="mb-3 rounded-xl border-[2px] border-[#F59E0B] bg-[#FEF3C7] p-3 text-sm font-bold text-[#B45309]">
          {secondChance.question ??
            "Apa ucapan pembuka yang baik sebelum belajar?"}
        </p>
        <div className="grid gap-2">
          {options.map((option, index) => (
            <button
              key={option}
              type="button"
              disabled={selected !== null}
              onClick={() => {
                setSelected(index);
                soundManager.playSfx(
                  index === correctIndex ? "correct" : "wrong",
                );
                if (index === correctIndex) {
                  secondChance.onSuccess();
                } else {
                  if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
                  timeoutRef.current = window.setTimeout(() => setSelected(null), 450);
                }
              }}
              className={`w-full min-h-[44px] flex items-center justify-center rounded-xl border-[2px] py-2.5 px-3 text-sm font-black transition-all ${
                selected === index
                  ? index === correctIndex
                    ? "border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "border-[#134E4A] bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#134E4A]"
                  : "border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSkipped(true)}
          className="mt-4 min-h-[44px] flex items-center justify-center text-xs font-bold text-[#134E4A]/70 underline w-full text-center"
        >
          Lewati dulu
        </button>
      </AppModal>
    );

  return (
    <AppModal isOpen={true} title={title} variant="warm" onClose={onExit}>
      <motion.p
        data-testid="xp-gained"
        role="status"
        initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="mt-3 rounded-xl border-[2px] border-[#F59E0B] bg-[#FEF3C7] p-2.5 text-center text-lg font-black text-[#B45309]"
      >
        +{xpGained} XP
      </motion.p>

      {coinsGained > 0 && (
        <motion.p
          data-testid="coins-gained"
          role="status"
          initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border-[2px] border-[#F59E0B] bg-[#FEF3C7] p-2.5 text-center text-sm font-black text-[#B45309]"
        >
          <CoinSvg size={20} />
          +{coinsGained} Koin
        </motion.p>
      )}

      {description && (
        <p className="mt-2 text-xs font-bold text-[var(--text-main,#134E4A)]/70 text-center">
          {description}
        </p>
      )}

      {isNewRecord && (
        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-black text-[#0D9488]">
          <Sparkles size={16} className="text-[#0D9488]" />
          REKOR BARU
          <Sparkles size={16} className="text-[#0D9488]" />
        </p>
      )}

      {children}

      <div className="my-6 grid grid-cols-2 divide-x-[3px] divide-[var(--border-color,#134E4A)]/10">
        <div>
          <p className="text-[10px] font-black tracking-widest text-[var(--text-main,#134E4A)]/60 uppercase">
            Skor kamu
          </p>
          <p
            data-testid="game-over-score"
            className="font-display text-3xl font-black text-[var(--text-main,#134E4A)]"
          >
            {score}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black tracking-widest text-[var(--text-main,#134E4A)]/60 uppercase">
            Terbaik
          </p>
          <p
            data-testid="game-over-best"
            className="flex items-center justify-center gap-1 font-display text-3xl font-black text-[#FF6B6B]"
          >
            <Star size={17} className="fill-[#FF6B6B]" />
            {best}
          </p>
        </div>
      </div>

      <StickerButton variant="primary" size="lg" fullWidth onClick={onRetry}>
        <Play size={15} />
        Main Lagi
      </StickerButton>

      <StickerButton
        variant="secondary"
        size="lg"
        fullWidth
        className="mt-2"
        onClick={onExit}
      >
        Keluar
      </StickerButton>
    </AppModal>
  );
}
