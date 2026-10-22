import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MalaikatMissionCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { ComboBadge } from "../_shared/ComboBadge";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameOverModal } from "../_shared/GameOverModal";
import { GameShell } from "../_shared/GameShell";
import { HUD } from "../_shared/HUD";
import { StartScreen } from "../_shared/StartScreen";
import { TimerBar } from "../_shared/TimerBar";
import { useMalaikatMission } from "./hooks/useMalaikatMission";
import { LeaderboardPanel } from "../_shared/LeaderboardPanel";
import { ProgressPanel } from "../_shared/ProgressPanel";
import { SkyCourierTrack } from "../_shared/variant/SkyCourierTrack";

function Game() {
  const game = useMalaikatMission();
  const navigate = useNavigate();
  const mission = game.mission;
  const courierStatus =
    game.status === "correct"
      ? `Paket terkirim! ${mission?.clue ?? ""}`
      : game.status === "wrong"
        ? `Paket nyasar. ${mission?.clue ?? ""}`
        : game.status === "timeout"
          ? `Kurir kehabisan waktu. ${mission?.clue ?? ""}`
          : null;
  return (
    <GameShell
      title="Malaikat Mission"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="cyan"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Malaikat Mission"
          tagline="Kurir pos langit"
          description="Jadilah kurir amanah: antar 9 paket ke tujuannya dengan memilih malaikat yang tepat. Sepuluh detik per paket, combo untuk antar cepat."
          coverImage={<MalaikatMissionCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={() => navigate("/member/ngaji-ceria/games")}
          accent="cyan"
        />
      ) : (
        mission && (
          <div className="space-y-3">
            <HUD
              score={game.score}
              progressLabel={`Paket ${game.index + 1}/${game.missions.length}`}
              timeLeft={game.timeLeft}
            />
            <TimerBar
              progress={game.timeLeft / 10}
              secondsLeft={game.timeLeft}
            />
            {/* Maskot terbang menjelajah sebagai kurir pos langit */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl border-2 border-[#134E4A] bg-teal-900/60 shadow-[2px_2px_0px_#134E4A] overflow-hidden">
              <motion.div
                animate={{ x: [0, 20, 0], y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="flex items-center gap-2"
              >
                <TilaMascot
                  size={64}
                  animation="fly"
                  mood={game.status === "correct" ? "excited" : "happy"}
                  direction="right"
                  speech={courierStatus ?? "Menjelajah Langit..."}
                />
              </motion.div>
              <div className="text-right text-[10px] font-bold text-teal-200">
                <span className="block font-black text-amber-300">Pos Langit Amanah</span>
                <span>Paket {game.index + 1}/{game.missions.length}</span>
              </div>
            </div>
            <SkyCourierTrack
              playerHp={game.playerHp}
              lightHp={game.monsterHp}
              lightMax={100}
              courierName={mission.monster}
              index={game.index}
              total={game.missions.length}
              status={courierStatus}
            />
            <div className="rounded-3xl border-2 border-[#134E4A] bg-[#115E59] p-4 text-center shadow-[2px_2px_0px_#134E4A]">
              <p className="text-xs font-black uppercase tracking-widest text-teal-300">
                Mission Brief · Tujuan: {mission.monster}
              </p>
              <p className="mt-2 text-sm font-black text-white">
                {mission.prompt}
              </p>
              <p className="mt-2 text-xs text-teal-100">
                Fokus pada tugas: {mission.task}
              </p>
            </div>
            <div className="grid gap-2">
              {mission.options.map((option, index) => (
                <button
                  type="button"
                  key={option}
                  data-option-index={index}
                  data-option-correct={index === mission.correctIndex}
                  disabled={game.status !== "idle"}
                  onClick={() => game.answer(index)}
                  className={`min-h-[44px] rounded-2xl border-2 border-[#134E4A] p-3 text-left text-sm font-black transition active:scale-[.98] shadow-[2px_2px_0px_#134E4A] relative z-30 ${
                    game.selected === index
                      ? game.status === "correct"
                        ? "bg-[#059669] text-white"
                        : "game-shake bg-[#DC2626] text-white"
                      : "bg-[#0F766E] text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p
              aria-live="polite"
              className="text-center text-xs leading-relaxed text-white/75"
            >
              {game.status === "correct"
                ? `Benar. ${mission.clue}`
                : game.status === "wrong"
                  ? `Belum tepat. ${mission.clue}`
                  : game.status === "timeout"
                    ? `Waktu habis. ${mission.clue}`
                    : "Pilih jawaban yang paling tepat."}
            </p>
            <ComboBadge combo={game.combo} />
          </div>
        )
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        victory={game.outcome === "victory"}
        title={game.outcome === "victory" ? "Victory!" : "Defeat"}
        score={game.score}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="cyan"
        description={
          game.outcome === "victory"
            ? "Semua 9 paket pos langit terkirim."
            : "Sayap kurir lelah. Latih kembali tugas malaikat."
        }
        onRetry={game.start}
        onExit={() => navigate("/member/ngaji-ceria/games/quiz-ngaji")}
      >
        <div className="space-y-3">
          <ProgressPanel progress={game.progress} />
          <LeaderboardPanel entries={game.leaderboard} />
        </div>
      </GameOverModal>
    </GameShell>
  );
}

export default function MalaikatMissionPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
