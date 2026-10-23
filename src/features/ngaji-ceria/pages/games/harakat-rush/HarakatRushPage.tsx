import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HeartSvg } from "@/components/ui/CustomIcons";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  PapanKayuSkorSvg,
  PlakatTargetHarakatSvg,
} from "@/components/ui/Illustrations";
import SlasherStage from "./components/SlasherStage";
import { useSlasherGame } from "./hooks/useSlasherGame";
import { HARAKAT_LIST } from "./data/harakat-list";
import type { GamePhase } from "../_shared/types";

function Game() {
  const game = useSlasherGame();
  const navigate = useNavigate();
  const [celebrate, setCelebrate] = useState(false);
  const celebrateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    phase,
    score,
    combo,
    lives,
    currentTarget,
    best,
    onSliceResult,
    resetRun,
    setPhase,
  } = game;

  const targetHarakat = HARAKAT_LIST.find((h) => h.id === currentTarget);

  // Maskot bereaksi setiap pemain berhasil menebas huruf target
  useEffect(() => {
    return () => {
      if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
    };
  }, []);

  const handleResult = (
    kind: "correct" | "wrong" | "miss",
    symbol?: string
  ) => {
    if (kind === "correct") {
      setCelebrate(true);
      if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
      celebrateTimeout.current = setTimeout(() => setCelebrate(false), 750);
    }
    onSliceResult(kind, symbol);
  };

  return (
    <div className="relative h-[100dvh] w-full select-none overflow-hidden">
      <GameShell
        title="Harakat Slasher"
        phase={phase as GamePhase}
        accent="emerald"
        tutorialGameId="harakat-rush"
        onPause={() => setPhase("paused")}
        onResume={() => setPhase("playing")}
      >
        <GameBoundary>
          {phase === "idle" || phase === "paused" ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#1E1B4B] via-[#312E81] to-[#4C1D95]">
              <StartScreen
                title="Harakat Slasher"
                tagline="Fruit Ninja Harakat"
                description="Geser jari seperti pedang untuk menebas huruf harakat target, hindari pengecoh, dan jangan biarkan target jatuh!"
                best={best}
                onStart={() => {
                  resetRun();
                  setPhase("playing");
                }}
                onExit={() => navigate("/member/ngaji-ceria/games")}
                accent="emerald"
              />
            </div>
          ) : (
            <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#FEF9C3]">
              {/* ARENA SLASHER (fisika + swipe + tebasan + dekor env) */}
              <SlasherStage
                isPlaying={phase === "playing"}
                currentTarget={currentTarget}
                onResult={handleResult}
              />

              {/* PAPAN SKOR KAYU (kiri atas) */}
              <div className="pointer-events-none absolute left-3 top-14 z-30 sm:left-4 sm:top-16">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                  <PapanKayuSkorSvg size={130} className="absolute inset-0" />
                  <div className="absolute left-0 right-0 top-[22%] flex flex-col items-center gap-0.5">
                    <span className="rounded-full border-2 border-[#134E4A] bg-[#FEF3C7] px-2 text-[8px] font-black uppercase tracking-widest text-[#7C2D12]">
                      Skor
                    </span>
                    <span className="font-display text-xl font-black leading-none text-[#134E4A] drop-shadow-[1px_1px_0_rgba(255,255,255,0.8)]">
                      {score}
                    </span>
                    {combo > 1 && (
                      <span className="rounded-md border-2 border-[#134E4A] bg-[#FF6B6B] px-1.5 py-0.5 text-[9px] font-black text-white">
                        x{combo}
                      </span>
                    )}
                    <div className="mt-0.5 flex items-center gap-0.5 rounded-lg border-2 border-[#134E4A] bg-white/85 px-1 py-0.5">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <HeartSvg
                          key={i}
                          size={12}
                          className={
                            i < lives
                              ? "text-[#FF6B6B] fill-[#FF6B6B]"
                              : "text-gray-300 fill-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PLAKAT TARGET HARAKAT (kanan atas) */}
              <div className="pointer-events-none absolute right-3 top-14 z-30 sm:right-4 sm:top-16">
                <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                  <PlakatTargetHarakatSvg size={130} className="absolute inset-0" />
                  <div className="absolute inset-x-0 top-[46%] flex flex-col items-center gap-0.5 px-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#7C2D12]">
                      Target
                    </span>
                    <span className="font-arabic text-2xl font-black leading-none text-[#7C2D12]">
                      {targetHarakat?.symbol ?? "بَ"}
                    </span>
                    <span className="font-display text-[10px] font-black leading-tight text-[#7C2D12]">
                      {targetHarakat?.name ?? "Fathah"}
                    </span>
                  </div>
                </div>
              </div>

              {/* MASKOT TILA (pojok kiri bawah di lantai dojo, melompat saat tebasan benar) */}
              <motion.div
                className="pointer-events-none absolute bottom-10 left-4 z-30 flex flex-col items-center"
                animate={{
                  y: celebrate ? [-10, -38, -4] : 0,
                  rotate: celebrate ? [0, -6, 5, 0] : 0,
                }}
                transition={{ duration: celebrate ? 0.7 : 0.3 }}
              >
                <TilaMascot
                  size={92}
                  direction="front"
                  animation="bounce"
                  mood={celebrate ? "excited" : "happy"}
                />
                <span className="mt-1 rounded-lg border-2 border-[#134E4A] bg-white px-2 py-0.5 text-[9px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  {combo > 1 ? `Combo x${combo}!` : "Tebas targetnya!"}
                </span>
              </motion.div>
            </div>
          )}

          {phase === "gameover" && (
            <GameOverModal
              visible
              score={score}
              best={best}
              isNewRecord={score > 0 && score >= best}
              onRetry={() => {
                resetRun();
                setPhase("playing");
              }}
              onExit={() => {
                resetRun();
                navigate("/member/ngaji-ceria/games");
              }}
            />
          )}
        </GameBoundary>
      </GameShell>
    </div>
  );
}

export default function HarakatRushPage() {
  return <Game />;
}
