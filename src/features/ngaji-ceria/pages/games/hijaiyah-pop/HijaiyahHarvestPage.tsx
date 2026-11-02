import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useAnimation,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  TilaMascot,
  type TilaMood,
  type TilaDirection,
} from "@/components/ui/TilaMascot";
import {
  BasketCatchSvg,
  HijaiyahHarvestCoverSvg,
} from "@/components/ui/Illustrations";
import { useEconomyStore } from "@/features/ngaji-ceria/hooks/useEconomyStore";
import { useGameStore } from "@/features/ngaji-ceria/hooks/useGameStore";
import { resolveMascotGender } from "@/utils/mascotHelper";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { useGameExit } from "../_shared/hooks";
import { GameResultModal } from "../_shared/GameResultModal";
import { ComboBadge } from "../_shared/ComboBadge";
import { GameHud } from "../_shared/GameHud";
import { GameGuideModal } from "@/components/ui/GameGuideModal";
import {
  GameFeedbackToast,
  type GameFeedbackMessage,
} from "../_shared/GameFeedbackToast";
import { FallingFruit } from "./components/FallingFruit";
import { TargetBanner } from "../_shared/TargetBanner";
import { GameLevelSelectSheet } from "../_shared/GameLevelSelectSheet";
import { playLetterAudio } from "../_shared/gameAudio";
import { playSfx } from "../_shared/audio";
import { normalizeArabicText } from "@/utils/arabic";
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
  const consumeTicket = useEconomyStore((s) => s.consumeTicket);

  const [levelIndex, setLevelIndex] = useState(0);
  const levelConfig = LEVELS[levelIndex] ?? LEVELS[0];

  const [showRules, setShowRules] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const lastComboRef = useRef(game.combo);
  const [feedback, setFeedback] = useState<GameFeedbackMessage | null>(null);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerFeedback = useCallback(
    (msg: { text: string; type: "correct" | "wrong"; arabicText?: string }) => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
      setFeedback({ id: Date.now(), ...msg });
      feedbackTimeout.current = setTimeout(() => setFeedback(null), 1800);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    };
  }, []);

  const handleSelectLevel = async (
    idx: number,
    mode: "practice" | "challenge",
  ) => {
    if (mode === "challenge") {
      const ok = await consumeTicket();
      if (!ok) return;
    }
    setLevelIndex(idx);
    game.handleStartLevel(idx, mode);
  };

  useEffect(() => {
    if (game.phase === "gameover" && game.isWin) {
      const unlocked = JSON.parse(
        localStorage.getItem("hijaiyah-pop-unlocked") || "[]",
      );
      if (!unlocked.includes(levelIndex)) {
        localStorage.setItem(
          "hijaiyah-pop-unlocked",
          JSON.stringify([...unlocked, levelIndex]),
        );
      }
    }
  }, [game.phase, game.isWin, levelIndex]);

  const recordLearningResult = useGameStore((s) => s.recordLearningResult);

  useEffect(() => {
    if (
      game.phase === "gameover" &&
      game.level.accuracy !== undefined &&
      game.level.accuracy !== null
    ) {
      recordLearningResult(
        "hijaiyah-harvest",
        game.level.accuracy,
        game.level.troubleLetters,
      );
    }
  }, [
    game.phase,
    game.level.accuracy,
    game.level.troubleLetters,
    recordLearningResult,
  ]);

  useEffect(() => {
    if (game.combo >= 3 && game.combo > lastComboRef.current) {
      lastComboRef.current = game.combo;
      setShowCombo(true);
      const t = setTimeout(() => setShowCombo(false), 1200);
      return () => clearTimeout(t);
    }
  }, [game.combo]);

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
      playLetterAudio(game.targetLetter);
    }
  }, [game.targetLetter, game.phase]);

  const mascotControls = useAnimation();
  const [mascotMood, setMascotMood] = useState<TilaMood>("happy");
  const [mascotDirection, setMascotDirection] =
    useState<TilaDirection>("front");
  const basketControls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  const handlePopFruit = useCallback(
    async (fruit: BalloonData) => {
      const wasTarget = fruit.isTarget;
      const expected = normalizeArabicText(game.targetLetter);
      const cleanFruitLetter = normalizeArabicText(fruit.letter);
      const isCorrect = cleanFruitLetter === expected;

      if (fruit.isRotten) {
        triggerFeedback({
          text: "Awas buah busuk! Jangan disentuh ya.",
          type: "wrong",
        });
      } else if (isCorrect) {
        triggerFeedback({
          text: `Hebat! Huruf ${fruit.letter} tersusun.`,
          type: "correct",
          arabicText: fruit.letter,
        });
      } else {
        const isSequenceError = game.targetLetters.some(
          (l) => normalizeArabicText(l) === cleanFruitLetter,
        );
        if (isSequenceError) {
          triggerFeedback({
            text: `Belum waktunya. Cari huruf ${game.targetLetter} dulu ya.`,
            type: "wrong",
            arabicText: fruit.letter,
          });
        } else {
          triggerFeedback({
            text: `Salah, itu huruf ${fruit.letter}.`,
            type: "wrong",
            arabicText: fruit.letter,
          });
        }
      }

      game.pop(fruit.id);

      if (wasTarget && !shouldReduceMotion) {
        basketControls.start({
          scale: [1, 1.22, 1],
          transition: { duration: 0.3, ease: "easeOut" },
        });
      }

      if (!game.fieldRef.current) return;
      const rect = game.fieldRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const bottomY = rect.height - 46;
      const deltaX = fruit.x + 38 - centerX;
      const deltaY = fruit.y + 40 - bottomY;

      setMascotDirection(deltaX >= 0 ? "right" : "left");
      setMascotMood("excited");

      if (!shouldReduceMotion) {
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
      }

      setMascotDirection("front");
      setMascotMood(game.combo > 0 ? "excited" : "happy");
    },
    [game, mascotControls, basketControls, shouldReduceMotion, triggerFeedback],
  );

  return (
    <GameShell
      title="Hijaiyah Harvest!"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="cyan"
      tutorialGameId="hijaiyah-pop"
      guideGameId="hijaiyah-harvest"
      floatingTopBar
    >
      {game.phase === "playing" ||
      game.phase === "paused" ||
      game.phase === "gameover" ? (
        <div
          ref={game.fieldRef}
          aria-label="Arena buah jatuh"
          className={`absolute inset-0 w-full overflow-hidden border-t-[3.5px] border-[#134E4A] ${arenaStyle.bg} select-none ${
            game.shakeLeft > 0 && !shouldReduceMotion ? "game-shake" : ""
          }`}
        >
          {/* ========================================================= */}
          {/* TOP HUD MENGGUNAKAN GAMEHUD */}
          {/* ========================================================= */}
          <div className="absolute top-16 inset-x-0 z-30 flex flex-col items-center px-3 pointer-events-none">
            <GameHud
              level={levelConfig.id}
              mode={game.session.mode}
              score={game.score}
              targetScore={game.targetScore}
              timeLeft={
                game.session.mode === "practice" ? undefined : game.timeLeft
              }
              lives={game.session.mode === "practice" ? undefined : game.lives}
              maxLives={3}
              combo={game.combo}
              onHelpClick={() => {
                setShowRules(true);
                game.pause();
              }}
            />
            <div className="mt-2 flex justify-center w-full">
              <TargetBanner
                targetLetters={game.targetLetters}
                collectedLetters={game.collectedLetters}
                isWord={levelConfig.isWord}
                className="shadow-[4px_4px_0px_#134E4A] scale-90 sm:scale-100 origin-top"
              />
            </div>
            <GameFeedbackToast
              feedback={feedback}
              className="top-36 sm:top-40"
            />
          </div>

          {/* Latar Belakang Pola Titik Neo-Brutalism */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(${arenaStyle.dot} 2px, transparent 2px)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* ========================================================= */}
          {/* ILUSTRASI 1: KANOPI POHON RIMBUN (ATAS)                   */}
          {/* ========================================================= */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-52 sm:h-60 z-10 overflow-hidden">
            <svg
              viewBox="0 0 1000 260"
              preserveAspectRatio="xMidYMax slice"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* LAYER 1: HARD OFFSET SHADOW NEO-BRUTALISM */}
              <path
                d="M-40,0 L1040,0 L1040,228 C990,254 920,250 870,228 C830,256 760,252 720,222 C670,236 620,228 580,214 C530,228 470,228 420,214 C380,228 330,236 280,222 C240,252 170,256 130,228 C80,250 10,254 -40,228 Z"
                fill="#134E4A"
              />

              {/* LAYER 2: DEDAUNAN HUTAN DALAM (DARK BACK FOLIAGE) */}
              <path
                d="M-40,0 L1040,0 L1040,216 C990,242 920,238 870,216 C830,244 760,240 720,210 C670,224 620,216 580,202 C530,216 470,216 420,202 C380,216 330,224 280,210 C240,240 170,244 130,216 C80,238 10,242 -40,216 Z"
                fill="#064E3B"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              {/* LAYER 3: SULUR DAUN GANTUNG & DAHAN POHON PENYANGGA BANNER */}
              <path
                d="M235,195 Q220,225 238,248"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M230,218 C212,212 206,226 224,230 Z"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M233,234 C250,228 256,242 238,246 Z"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              <path
                d="M765,195 Q780,225 762,248"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M770,218 C788,212 794,226 776,230 Z"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M767,234 C750,228 744,242 762,246 Z"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Dahan Kayu Utama Kiri & Kanan */}
              <path
                d="M-20,165 C90,155 180,175 290,192 C330,198 370,196 410,188 L405,172 C360,178 310,178 260,168 C170,150 90,130 -20,135 Z"
                fill="#78350F"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <path
                d="M1020,165 C910,155 820,175 710,192 C670,198 630,196 590,188 L595,172 C640,178 690,178 740,168 C830,150 910,130 1020,135 Z"
                fill="#78350F"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <path
                d="M40,152 Q160,156 270,178 M960,152 Q840,156 730,178"
                stroke="#B45309"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Tali Kayu Penyangga TargetBanner di Tengah */}
              <rect
                x="384"
                y="140"
                width="10"
                height="58"
                rx="5"
                fill="#D97706"
                stroke="#134E4A"
                strokeWidth="3.5"
              />
              <rect
                x="606"
                y="140"
                width="10"
                height="58"
                rx="5"
                fill="#D97706"
                stroke="#134E4A"
                strokeWidth="3.5"
              />

              {/* LAYER 4: RUMPUN DAUN TENGAH (LUSH MID-CANOPY) */}
              <path
                d="M-40,0 L1040,0 L1040,182 C985,212 910,206 865,180 C820,214 745,210 700,178 C655,198 595,192 560,174 C520,194 480,194 440,174 C405,192 345,198 300,178 C255,210 180,214 135,180 C90,206 15,212 -40,182 Z"
                fill="#059669"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              <circle
                cx="195"
                cy="186"
                r="42"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="4.5"
              />
              <circle
                cx="265"
                cy="178"
                r="36"
                fill="#059669"
                stroke="#134E4A"
                strokeWidth="4.5"
              />
              <circle
                cx="805"
                cy="186"
                r="42"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="4.5"
              />
              <circle
                cx="735"
                cy="178"
                r="36"
                fill="#059669"
                stroke="#134E4A"
                strokeWidth="4.5"
              />

              {/* LAYER 5: BUAH-BUAHAN MENGINTIP */}
              <g transform="translate(225, 198) rotate(-12)">
                <circle cx="2" cy="2" r="14" fill="#134E4A" />
                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill="#EF4444"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                />
                <path
                  d="M-6,-5 C-4,-9 0,-10 4,-9"
                  stroke="#FCA5A5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>

              <g transform="translate(775, 198) rotate(12)">
                <circle cx="2" cy="2" r="14" fill="#134E4A" />
                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill="#FACC15"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                />
                <circle cx="-4" cy="-4" r="2.5" fill="#FEF9C3" />
              </g>

              <circle
                cx="330"
                cy="182"
                r="11"
                fill="#3B82F6"
                stroke="#134E4A"
                strokeWidth="3.5"
              />
              <circle cx="327" cy="179" r="2.5" fill="#BAE6FD" />
              <circle
                cx="670"
                cy="182"
                r="11"
                fill="#F43F5E"
                stroke="#134E4A"
                strokeWidth="3.5"
              />
              <circle cx="667" cy="179" r="2.5" fill="#FECDD3" />

              {/* LAYER 6: DEDAUNAN UTAMA CERAH */}
              <path
                d="M-40,0 L1040,0 L1040,142 C980,174 910,162 860,136 C810,172 735,168 685,138 C635,166 565,162 500,140 C435,162 365,166 315,138 C265,168 190,172 140,136 C90,162 20,174 -40,142 Z"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              <path
                d="M-40,0 L1040,0 L1040,92 C975,122 900,108 845,84 C790,118 710,114 655,86 C595,116 535,112 500,90 C465,112 405,116 345,86 C290,114 210,118 155,84 C100,108 25,122 -40,92 Z"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              <path
                d="M0,0 L1000,0 L1000,26 Q830,42 660,22 T320,34 T0,22 Z"
                fill="#78350F"
                stroke="#134E4A"
                strokeWidth="4.5"
              />

              {/* LAYER 7: DETAIL PUFF DAUN, BUNGA MEKAR & KILAP CAHAYA */}
              <ellipse
                cx="145"
                cy="152"
                rx="38"
                ry="22"
                transform="rotate(-8 145 152)"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="4"
              />
              <ellipse
                cx="855"
                cy="152"
                rx="38"
                ry="22"
                transform="rotate(8 855 152)"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="4"
              />
              <ellipse
                cx="350"
                cy="148"
                rx="32"
                ry="18"
                transform="rotate(6 350 148)"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="4"
              />
              <ellipse
                cx="650"
                cy="148"
                rx="32"
                ry="18"
                transform="rotate(-6 650 148)"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="4"
              />

              <path
                d="M125,146 Q145,136 165,144 M835,144 Q855,136 875,146 M475,72 Q500,62 525,72 M285,70 Q310,60 335,70 M665,70 Q690,60 715,70"
                stroke="#A7F3D0"
                strokeWidth="4.5"
                strokeLinecap="round"
              />

              <g transform="translate(185, 162)">
                <circle
                  cx="0"
                  cy="-7"
                  r="6"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <circle
                  cx="7"
                  cy="0"
                  r="6"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <circle
                  cx="0"
                  cy="7"
                  r="6"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <circle
                  cx="-7"
                  cy="0"
                  r="6"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="5.5"
                  fill="#FACC15"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
              </g>

              <g transform="translate(815, 162)">
                <circle
                  cx="0"
                  cy="-7"
                  r="6"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <circle
                  cx="7"
                  cy="0"
                  r="6"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <circle
                  cx="0"
                  cy="7"
                  r="6"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <circle
                  cx="-7"
                  cy="0"
                  r="6"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="5.5"
                  fill="#F43F5E"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
              </g>

              <circle
                cx="280"
                cy="126"
                r="5.5"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="3"
              />
              <circle
                cx="720"
                cy="126"
                r="5.5"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="3"
              />
              <circle
                cx="500"
                cy="122"
                r="5"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="3"
              />
            </svg>
          </div>

          {/* ========================================================= */}
          {/* ILUSTRASI 2: PADANG RUMPUT, PAGAR KEBUN & PANGGUNG PANEN  */}
          {/* ========================================================= */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28 sm:h-32 z-10 overflow-hidden">
            <svg
              viewBox="0 0 1000 130"
              preserveAspectRatio="xMidYMin slice"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* PAGAR KAYU KEBUN KIRI & KANAN (ORCHARD FENCE) */}
              <g>
                {/* Palang Horizontal Kiri */}
                <rect
                  x="60"
                  y="32"
                  width="170"
                  height="10"
                  rx="4"
                  fill="#92400E"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                />
                <rect
                  x="60"
                  y="50"
                  width="170"
                  height="10"
                  rx="4"
                  fill="#92400E"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                />
                {/* Tiang Vertikal Kiri */}
                <path
                  d="M80,22 L90,14 L100,22 L100,75 L80,75 Z"
                  fill="#D97706"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M135,20 L145,12 L155,20 L155,75 L135,75 Z"
                  fill="#D97706"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M190,24 L200,16 L210,24 L210,75 L190,75 Z"
                  fill="#D97706"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Palang Horizontal Kanan */}
                <rect
                  x="770"
                  y="32"
                  width="170"
                  height="10"
                  rx="4"
                  fill="#92400E"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                />
                <rect
                  x="770"
                  y="50"
                  width="170"
                  height="10"
                  rx="4"
                  fill="#92400E"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                />
                {/* Tiang Vertikal Kanan */}
                <path
                  d="M790,24 L800,16 L810,24 L810,75 L790,75 Z"
                  fill="#D97706"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M845,20 L855,12 L865,20 L865,75 L845,75 Z"
                  fill="#D97706"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M900,22 L910,14 L920,22 L920,75 L900,75 Z"
                  fill="#D97706"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
              </g>

              {/* LAYER 1: BUKIT SEMAK GELAP BELAKANG + HARD SHADOW */}
              <path
                d="M-20,54 C120,28 260,64 400,48 C500,36 580,44 660,52 C780,64 890,28 1020,50 L1020,130 L-20,130 Z"
                fill="#064E3B"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              {/* LAYER 2: BUKIT RUMPUT TENGAH (MID-MEADOW) */}
              <path
                d="M-20,72 C150,46 280,82 440,62 C540,50 640,76 780,56 C880,42 960,64 1020,68 L1020,130 L-20,130 Z"
                fill="#059669"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              {/* JAMUR PAYUNG LUCU & RUMPUT TAJAM */}
              {/* Jamur Merah Kiri */}
              <g transform="translate(255, 62) rotate(-8)">
                <rect
                  x="-5"
                  y="0"
                  width="10"
                  height="14"
                  rx="3"
                  fill="#FEF3C7"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <path
                  d="M-16,2 C-16,-14 16,-14 16,2 Z"
                  fill="#F43F5E"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <circle cx="-5" cy="-4" r="2.5" fill="#FFFBEB" />
                <circle cx="5" cy="-3" r="2" fill="#FFFBEB" />
              </g>

              {/* Jamur Merah Kanan */}
              <g transform="translate(745, 58) rotate(10)">
                <rect
                  x="-5"
                  y="0"
                  width="10"
                  height="14"
                  rx="3"
                  fill="#FEF3C7"
                  stroke="#134E4A"
                  strokeWidth="3"
                />
                <path
                  d="M-16,2 C-16,-14 16,-14 16,2 Z"
                  fill="#F43F5E"
                  stroke="#134E4A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <circle cx="-4" cy="-4" r="2" fill="#FFFBEB" />
                <circle cx="5" cy="-4" r="2.5" fill="#FFFBEB" />
              </g>

              {/* Rumpun Daun Rumput Mencuat */}
              <path
                d="M170,68 L162,48 L176,60 L182,44 L188,62 L198,50 L190,68 Z"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M810,66 L802,48 L814,58 L820,42 L826,58 L836,48 L828,66 Z"
                fill="#34D399"
                stroke="#134E4A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* LAYER 3: HAMPARAN RUMPUT DEPAN CERAH (FOREGROUND LAWN) */}
              <path
                d="M-20,88 C180,68 320,96 500,80 C680,96 820,68 1020,88 L1020,130 L-20,130 Z"
                fill="#10B981"
                stroke="#134E4A"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              {/* Highlight Kilap Rumput */}
              <path
                d="M90,88 Q140,80 190,86 M810,86 Q860,80 910,88 M350,72 Q390,66 430,70"
                stroke="#6EE7B7"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Bunga Daisy Kebun */}
              <g transform="translate(310, 92)">
                <circle
                  cx="-5"
                  cy="0"
                  r="4.5"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
                <circle
                  cx="5"
                  cy="0"
                  r="4.5"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
                <circle
                  cx="0"
                  cy="-5"
                  r="4.5"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
                <circle
                  cx="0"
                  cy="5"
                  r="4.5"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="4"
                  fill="#FACC15"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
              </g>

              <g transform="translate(690, 92)">
                <circle
                  cx="-5"
                  cy="0"
                  r="4.5"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
                <circle
                  cx="5"
                  cy="0"
                  r="4.5"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
                <circle
                  cx="0"
                  cy="-5"
                  r="4.5"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
                <circle
                  cx="0"
                  cy="5"
                  r="4.5"
                  fill="#FFFBEB"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="4"
                  fill="#FACC15"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
              </g>

              {/* LAYER 4: TANAH SUBUR & DERMAGA PIJAKAN KERANJANG (BAWAH) */}
              <path
                d="M-20,108 Q250,100 500,106 T1020,108 L1020,130 L-20,130 Z"
                fill="#78350F"
                stroke="#134E4A"
                strokeWidth="4.5"
              />
              {/* Papan Pijakan Tengah Tempat Keranjang & Maskot Berdiri */}
              <rect
                x="410"
                y="98"
                width="180"
                height="16"
                rx="6"
                fill="#B45309"
                stroke="#134E4A"
                strokeWidth="4"
              />
              <line
                x1="425"
                y1="104"
                x2="575"
                y2="104"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Batu Kerikil Tanah */}
              <ellipse
                cx="220"
                cy="118"
                rx="10"
                ry="4"
                fill="#92400E"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <ellipse
                cx="780"
                cy="118"
                rx="12"
                ry="4.5"
                fill="#92400E"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {game.balloons.map((fruit) => (
            <FallingFruit
              key={fruit.id}
              fruit={fruit}
              disabled={game.phase !== "playing"}
              reducedMotion={Boolean(shouldReduceMotion)}
              onPop={handlePopFruit}
            />
          ))}

          {/* Keranjang Panen */}
          <motion.div
            animate={basketControls}
            className="pointer-events-none absolute z-20"
            style={{ left: "calc(50% - 45px)", bottom: 6 }}
          >
            <BasketCatchSvg
              size={90}
              className="drop-shadow-[3px_3px_0px_#134E4A]"
            />
          </motion.div>

          {/* Maskot Tila & Pijakan */}
          <motion.div
            animate={mascotControls}
            className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
            style={{ transformOrigin: "bottom center" }}
          >
            {game.combo >= 3 && (
              <div className="mb-1 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-[10px] font-black shadow-[2px_2px_0px_#134E4A] whitespace-nowrap animate-bounce">
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
            <div className="w-28 h-6 -mt-2 rounded-[50%] border-[3px] border-[#134E4A] bg-[#FDE68A] shadow-[3px_3px_0px_#134E4A] flex items-center justify-center -z-10">
              <div className="w-20 h-3.5 rounded-[50%] border-[1.5px] border-dashed border-[#B45309]" />
            </div>
          </motion.div>

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

          <GameResultModal
            isOpen={game.phase === "gameover"}
            isWin={game.isWin}
            loseReason={game.loseReason}
            score={game.score}
            targetScore={game.targetScore}
            stars={
              game.isWin
                ? game.lives === 3 || game.score >= game.targetScore * 1.2
                  ? 3
                  : game.lives === 2 || game.score >= game.targetScore * 0.7
                    ? 2
                    : 1
                : 0
            }
            level={levelIndex + 1}
            hasNextLevel={levelIndex < LEVELS.length - 1}
            learningSummary={game.level.learningSummary}
            onRetry={() => game.handleStartLevel(levelIndex, game.session.mode)}
            onNextLevel={() => {
              if (levelIndex < LEVELS.length - 1) {
                setLevelIndex((prev) => prev + 1);
                game.handleNextLevel();
              } else {
                exit();
              }
            }}
            onBackToHub={exit}
          />
        </div>
      ) : null}
      <GameLevelSelectSheet
        isOpen={game.phase === "idle"}
        onClose={exit}
        gameTitle="Hijaiyah Harvest"
        gameIcon={<HijaiyahHarvestCoverSvg size={22} />}
        levels={LEVELS.map((level) => ({
          id: level.id,
          title: level.title,
          description: level.desc,
        }))}
        unlockedCount={getPopupUnlockedCount()}
        onSelectLevel={handleSelectLevel}
        onOpenGuide={() => setShowRules(true)}
      />
      <GameGuideModal
        isOpen={showRules}
        onClose={() => {
          setShowRules(false);
          if (game.phase === "paused") {
            game.resume();
          }
        }}
        gameId="hijaiyah-harvest"
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
