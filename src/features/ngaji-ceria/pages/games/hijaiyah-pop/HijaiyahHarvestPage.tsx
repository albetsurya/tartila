import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  TilaMascot,
  type TilaMood,
  type TilaDirection,
} from "@/components/ui/TilaMascot";
import { HijaiyahHarvestCoverSvg } from "@/components/ui/Illustrations";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { resolveMascotGender } from "@/utils/mascotHelper";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { useGameExit } from "../_shared/hooks";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { ComboBadge } from "../_shared/ComboBadge";
import { FallingFruit } from "./components/FallingFruit";
import { TargetBanner } from "../_shared/TargetBanner";
import { GameLevelSelectSheet } from "../_shared/GameLevelSelectSheet";
import { playLetterAudio } from "../_shared/gameAudio";
import { playSfx } from "../_shared/audio";
import { useBalloonGame, type BalloonData } from "./hooks/useBalloonGame";
import { LEVELS } from "./data";

/** Level terbuka diselesaikan via localStorage (sama dengan modal lama). */
function getPopupUnlockedCount(): number {
  try {
    const saved = localStorage.getItem("hijaiyah-pop-unlocked");
    if (saved) {
      const completed: number[] = JSON.parse(saved);
      return completed.length + 1;
    }
  } catch {
    // ignore parse errors / missing storage
  }
  return 1;
}

function Game() {
  const game = useBalloonGame();
  const navigate = useNavigate();
  const exit = useGameExit("/member/ngaji-ceria/games");

  // Level selection: stay idle until the user picks a level via GameLevelSelectSheet.
  const [levelIndex, setLevelIndex] = useState(0);
  const levelConfig = LEVELS[levelIndex] ?? LEVELS[0];

  const [showCombo, setShowCombo] = useState(false);
  const lastComboRef = useRef(game.combo);

  // Victory transition state
  const [isVictoryTransition, setIsVictoryTransition] = useState(false);
  const targetBannerControls = useAnimation();
  const victoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const powerupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (game.combo >= 3 && game.combo > lastComboRef.current) {
      lastComboRef.current = game.combo;
      setShowCombo(true);
      const t = setTimeout(() => setShowCombo(false), 1200);
      return () => clearTimeout(t);
    }
  }, [game.combo]);

  // Victory transition effect
  useEffect(() => {
    // Strict guard: kata harus ada (len > 0) supaya kondisi 0>=0 di state idle
    // tidak memicu victory → auto-start tanpa pilih level.
    const isWinCondition =
      game.phase === "playing" &&
      game.targetLetters.length > 0 &&
      game.collectedLetters.length >= game.targetLetters.length;

    if (isWinCondition && !isVictoryTransition) {
      setIsVictoryTransition(true);
      playSfx("level-up");

      // Zoom in animation
      targetBannerControls.start({
        scale: 1.5,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });

      // Play powerup SFX after 1.5s during zoom
      powerupTimeoutRef.current = setTimeout(() => {
        playSfx("powerup");
      }, 1500);

      // Continue to next word after 1.5s
      victoryTimeoutRef.current = setTimeout(() => {
        // Zoom out animation
        targetBannerControls.start({
          scale: 1,
          opacity: 1,
          transition: { duration: 0.5, ease: "easeIn" },
        });

        setTimeout(() => {
          setIsVictoryTransition(false);
          game.continueToNextWord(levelIndex);
          // Simpan level yang berhasil diselesaikan ke localStorage
          const unlocked = JSON.parse(
            localStorage.getItem("hijaiyah-pop-unlocked") || "[]",
          );
          const currentLevelIndex = levelIndex; // level yang baru selesai
          if (!unlocked.includes(currentLevelIndex)) {
            localStorage.setItem(
              "hijaiyah-pop-unlocked",
              JSON.stringify([...unlocked, currentLevelIndex]),
            );
          }
        }, 500);
      }, 1500);
    }
  }, [
    game.phase,
    game.collectedLetters.length,
    game.targetLetters.length,
    isVictoryTransition,
    targetBannerControls,
    levelIndex,
    game,
  ]);

  // Cleanup timeouts on unmount or when isVictoryTransition becomes false
  useEffect(() => {
    return () => {
      if (victoryTimeoutRef.current) clearTimeout(victoryTimeoutRef.current);
      if (powerupTimeoutRef.current) clearTimeout(powerupTimeoutRef.current);
    };
  }, []);

  const rawGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const mascotGender = resolveMascotGender(rawGender);

  const appTheme = useEconomyStore((s) => s.equippedAppTheme);
  const arenaStyle = {
    default: { bg: "bg-[#0F766E]", dot: "#2DD4BF" },
    neon: { bg: "bg-[#0B1220]", dot: "#38BDF8" },
    retro: { bg: "bg-[#F59E0B]", dot: "#FDE68A" },
    pastel: { bg: "bg-[#F9A8D4]", dot: "#FDA4AF" },
    night: { bg: "bg-[#1E1B4B]", dot: "#818CF8" },
    sky: { bg: "bg-[#0369A1]", dot: "#7DD3FC" },
    rose: { bg: "bg-[#BE123C]", dot: "#FDA4AF" },
    gold: { bg: "bg-[#854D0E]", dot: "#FDE047" },
  }[appTheme] ?? { bg: "bg-[#0F766E]", dot: "#2DD4BF" };

  useEffect(() => {
    if (game.phase === "playing" && game.targetLetter) {
      // Pelafalan TTS tidak diaktifkan di build (tanpa aset Tilawati).
      playLetterAudio(game.targetLetter);
    }
  }, [game.targetLetter, game.phase]);

  const mascotControls = useAnimation();
  const [mascotMood, setMascotMood] = useState<TilaMood>("happy");
  const [mascotDirection, setMascotDirection] =
    useState<TilaDirection>("front");

  const handlePopFruit = useCallback(
    async (fruit: BalloonData) => {
      game.pop(fruit.id);
      if (fruit.isTarget) {
        playSfx("pop");
      }

      if (!game.fieldRef.current) return;
      const rect = game.fieldRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const bottomY = rect.height - 46;
      const deltaX = fruit.x + 38 - centerX;
      const deltaY = fruit.y + 40 - bottomY;

      setMascotDirection(deltaX >= 0 ? "right" : "left");
      setMascotMood("excited");

      await mascotControls.start({
        x: deltaX * 0.88,
        y: Math.min(-20, deltaY * 0.88),
        scale: 1.18,
        rotate: deltaX >= 0 ? 15 : -15,
        transition: { duration: 0.15, ease: "easeOut" },
      });

      await mascotControls.start({
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        transition: {
          duration: 0.22,
          ease: [0.34, 1.56, 0.64, 1],
        },
      });

      setMascotDirection("front");
      setMascotMood(game.combo > 0 ? "excited" : "happy");
    },
    [game, mascotControls],
  );

  return (
    <GameShell
      title="Hijaiyah Harvest!"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="cyan"
      tutorialGameId="hijaiyah-pop"
      floatingTopBar
    >
      {game.phase === "playing" ||
      game.phase === "paused" ||
      game.phase === "gameover" ? (
        <div
          ref={game.fieldRef}
          aria-label="Arena buah jatuh"
          className={`absolute inset-0 w-full overflow-hidden border-t-[3.5px] border-[#134E4A] ${arenaStyle.bg} select-none ${
            game.shakeLeft > 0 ? "game-shake" : ""
          } ${isVictoryTransition ? "pointer-events-none" : ""}`}
        >
          {/* TOP HUD: Skor, Nyawa, Timer, dan Target Banner */}
          <div className="absolute top-16 inset-x-0 z-30 flex flex-col items-center px-3 pointer-events-none">
            {/* Baris 1: HUD Skor, Nyawa & Hati di kiri */}
            <div className="flex w-full max-w-[640px] flex-row items-center justify-between px-4 py-2">
              <HUD score={game.score} lives={game.lives} />
            </div>

            {/* Baris 2: Target Banner ditengah - disembunyikan saat victory transition */}
            <div
              className={`w-full max-w-[640px] flex justify-center mt-2 ${isVictoryTransition ? "opacity-0 pointer-events-none" : ""}`}
            >
              <TargetBanner
                targetLetters={game.targetLetters}
                collectedLetters={game.collectedLetters}
                isWord={levelConfig.isWord}
                className="shadow-[4px_4px_0px_#134E4A] scale-90 sm:scale-100 origin-top-right"
              />
            </div>

            {/* VICTORY MODAL OVERLAY - Zoom ke tengah */}
            <AnimatePresence>
              {isVictoryTransition && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 pointer-events-none p-4"
                >
                  <motion.div className="w-[90vw] max-w-sm origin-top-center">
                    <div className="bg-white rounded-[32px] p-6 border-[4px] border-[#134E4A] shadow-[8px_8px_0px_#134E4A]">
                      <TargetBanner
                        targetLetters={game.targetLetters}
                        collectedLetters={game.targetLetters}
                        isWord={levelConfig.isWord}
                        className="bg-white"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Latar Belakang Pola Titik Neo-Brutalism */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(${arenaStyle.dot} 2px, transparent 2px)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* ILUSTRASI 1: KANOPI POHON RIMBUN */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-24 sm:h-32 z-10 overflow-hidden">
            <svg
              viewBox="0 0 1000 160"
              preserveAspectRatio="none"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ overflow: "hidden" }}
            >
              {/* Batang Kayu Cabang Atas */}
              <path
                d="M0,0 L1000,0 L1000,18 Q800,28 650,15 T300,24 T0,16 Z"
                fill="#78350F"
                stroke="#134E4A"
                strokeWidth="4"
              />

              {/* Layer 1: Daun Belakang Gelap */}
              <path
                d="M -20,0 L 1020,0 L 1020,80 C 940,110 860,70 780,100 C 700,130 620,80 540,110 C 460,140 380,90 300,120 C 220,140 140,90 60,110 C 20,120 -10,100 -20,90 Z"
                fill="#064E3B"
                stroke="#134E4A"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Layer 2: Daun Utama Hijau Zamrud */}
              <path
                d="M -20,0 L 1020,0 L 1020,60 C 930,90 870,50 800,80 C 730,110 660,60 580,90 C 500,115 430,65 350,95 C 270,115 200,65 120,90 C 60,105 10,70 -20,70 Z"
                fill="#059669"
                stroke="#134E4A"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Layer 3: Daun Menjuntai & Rimbun Terang */}
              <path
                d="M -20,0 L 1020,0 L 1020,40 C 950,65 890,30 830,58 C 760,80 690,35 610,62 C 530,85 460,40 380,68 C 300,90 230,40 150,64 C 80,80 20,45 -20,45 Z"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              <ellipse
                cx="180"
                cy="90"
                rx="35"
                ry="22"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                transform="rotate(-10 180 90)"
              />
              <ellipse
                cx="460"
                cy="96"
                rx="40"
                ry="24"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                transform="rotate(8 460 96)"
              />
              <ellipse
                cx="760"
                cy="88"
                rx="38"
                ry="22"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                transform="rotate(-6 760 88)"
              />
              <ellipse
                cx="620"
                cy="105"
                rx="30"
                ry="18"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                transform="rotate(5 620 105)"
              />

              <circle
                cx="180"
                cy="100"
                r="7"
                fill="#FBBF24"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <circle
                cx="460"
                cy="106"
                r="8"
                fill="#FF6B6B"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <circle
                cx="760"
                cy="98"
                r="7.5"
                fill="#FBBF24"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* ILUSTRASI 2: RUMPUT & TANAH SUBUR */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-20 sm:h-24 z-10 overflow-hidden">
            <svg
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,45 Q250,30 500,48 T1000,38 L1000,100 L0,100 Z"
                fill="#064E3B"
                stroke="#134E4A"
                strokeWidth="4"
              />

              <path
                d="M0,58 Q200,38 420,54 T850,44 Q930,48 1000,56 L1000,100 L0,100 Z"
                fill="#059669"
                stroke="#134E4A"
                strokeWidth="4"
              />
              <path
                d="M0,70 Q300,50 600,68 T1000,62 L1000,100 L0,100 Z"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="4"
              />

              <polygon
                points="120,45 126,28 132,45"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3"
              />
              <polygon
                points="128,46 135,32 142,46"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3"
              />
              <polygon
                points="860,42 866,26 872,42"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3"
              />
              <polygon
                points="868,43 875,30 882,43"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3"
              />

              <circle
                cx="240"
                cy="62"
                r="6"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <circle cx="240" cy="62" r="2.5" fill="#F59E0B" />

              <circle
                cx="780"
                cy="58"
                r="6"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <circle cx="780" cy="58" r="2.5" fill="#F59E0B" />
            </svg>
          </div>

          {game.balloons.map((fruit) => (
            <FallingFruit
              key={fruit.id}
              fruit={fruit}
              disabled={game.phase !== "playing" || isVictoryTransition}
              onPop={handlePopFruit}
            />
          ))}

          {/* MASKOT UTAMA */}
          <motion.div
            animate={mascotControls}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
            style={{ transformOrigin: "bottom center" }}
          >
            {game.combo >= 3 && (
              <div className="mb-1 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-[10px] font-black shadow-[1.5px_1.5px_0px_#134E4A] whitespace-nowrap animate-bounce">
                <span>Kombo x{game.combo}!</span>
              </div>
            )}

            <TilaMascot
              size={88}
              gender={mascotGender}
              mood={mascotMood}
              animation="none"
              direction={mascotDirection}
            />

            <div className="w-24 h-5 -mt-2 rounded-[50%] border-2 border-[#134E4A] bg-[#FEF3C7] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center -z-10">
              <div className="w-18 h-3 rounded-[50%] border border-dashed border-[#134E4A]/30" />
            </div>
          </motion.div>

          {/* FLOATING COMBO TOAST */}
          <AnimatePresence>
            {showCombo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1.2, y: 0 }}
                exit={{ opacity: 0, scale: 1.5, y: 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="absolute left-1/2 top-1/4 z-50 -translate-x-1/2 pointer-events-none"
              >
                <ComboBadge
                  combo={game.combo}
                  multiplier={Math.min(1 + game.combo * 0.1, 5)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* GAME OVER MODAL */}
          <GameOverModal
            visible={game.phase === "gameover"}
            score={game.score}
            maxCombo={game.maxCombo}
            victory={game.lives > 0}
            best={game.best}
            isNewRecord={game.isNewRecord}
            accent="cyan"
            description={`${
              game.lives <= 0 ? "Nyawa habis" : "Waktu habis"
            } · kombo tertinggi ${game.maxCombo}`}
            onRetry={() => game.startGame(levelIndex)}
            onExit={exit}
          />
        </div>
      ) : null}
      <GameLevelSelectSheet
        isOpen={game.phase === "idle"}
        onClose={exit}
        gameTitle="PHijaiyah Harvest"
        gameIcon={<HijaiyahHarvestCoverSvg size={22} />}
        levels={LEVELS.map((level) => ({
          id: level.id,
          title: level.title,
          description: level.desc,
        }))}
        unlockedCount={getPopupUnlockedCount()}
        onSelectLevel={(idx) => {
          setLevelIndex(idx);
          game.startGame(idx);
        }}
      />
    </GameShell>
  );
}

export default function HijaiyahHarvestPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
