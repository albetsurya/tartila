import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SholatHeroCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameShell } from "../_shared/GameShell";
import { StartScreen } from "../_shared/StartScreen";
import { GameOverModal } from "../_shared/GameOverModal";
import { HUD } from "../_shared/HUD";
import { ComboBadge } from "../_shared/ComboBadge";
import { ScheduleRow } from "./components/ScheduleRow";
import { formatGameTime } from "./data/prayers";
import { useSholatHero } from "./hooks/useSholatHero";
import { ScheduleTimeline } from "../_shared/variant/ScheduleTimeline";

function Game() {
  const game = useSholatHero();
  const navigate = useNavigate();
  return (
    <GameShell
      title="Sholat Hero"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="emerald"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Sholat Hero"
          tagline="Atur hari, jaga lima waktu"
          description="Satu detik nyata berlalu sebagai sepuluh menit dalam permainan. Kerjakan lima sholat di jendela waktunya untuk mengumpulkan skor dan combo."
          coverImage={<SholatHeroCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={() => navigate("/member/ngaji-ceria/games")}
          accent="emerald"
        />
      ) : (
        <div className="space-y-3">
          <HUD
            score={game.score}
            progressLabel="Hari berjalan"
          />
          <ScheduleTimeline
            current={
              Object.values(game.statuses).filter(
                (status) => status !== "pending",
              ).length
            }
            total={5}
          />
          {/* Maskot melakukan gerakan sholat saat urutan benar */}
          <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-[#134E4A] bg-teal-900/60 shadow-[2px_2px_0px_#134E4A]">
            <div className="flex items-center gap-3">
              <motion.div
                animate={
                  game.combo > 0
                    ? { scale: [1, 0.9, 1], y: [0, 8, 0] }
                    : { y: [0, -3, 0] }
                }
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <TilaMascot
                  size={68}
                  mood={game.combo > 0 ? "happy" : "idle"}
                  animation="bounce"
                  direction="front"
                  speech={game.combo > 0 ? "Allahu Akbar!" : undefined}
                />
              </motion.div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 block">
                  Gerakan Sholat Tila
                </span>
                <span className="text-xs font-bold text-white">
                  {game.combo > 0 ? "Tertib & Khusyuk" : "Menunggu waktu sholat..."}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-amber-300 block">Combo</span>
              <span className="text-lg font-black text-white">x{game.combo}</span>
            </div>
          </div>
          <div className="rounded-3xl border-2 border-[#134E4A] bg-[#115E59] p-4 text-center shadow-[2px_2px_0px_#134E4A]">
            <p className="text-[10px] uppercase tracking-widest text-teal-200/70">
              Waktu permainan
            </p>
            <p className="font-display text-4xl font-black text-white">
              {formatGameTime(game.gameMinutes)}
            </p>
            <p className="mt-1 text-xs text-teal-200">{game.message}</p>
          </div>
          <div className="space-y-2">
            {game.prayers.map((prayer) => (
              <ScheduleRow
                key={prayer.id}
                prayer={prayer}
                status={game.statuses[prayer.id]}
                gameMinutes={game.gameMinutes}
                onPray={() => game.pray(prayer.id)}
              />
            ))}
          </div>
          <ComboBadge combo={game.combo} />
        </div>
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        score={game.score}
        maxCombo={game.maxCombo}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="emerald"
        title="Hari Selesai"
        description={`Combo tertinggi ${game.maxCombo} · lima waktu sudah dievaluasi`}
        onRetry={game.start}
        onExit={() => navigate("/member/ngaji-ceria/games")}
      />
    </GameShell>
  );
}
export default function SholatHeroPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
