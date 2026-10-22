import { useNavigate } from "react-router-dom";
import { NabiChroniclesCoverSvg } from "@/components/ui/Illustrations";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { GameBoundary } from "../_shared/GameBoundary";
import { GameOverModal } from "../_shared/GameOverModal";
import { GameShell } from "../_shared/GameShell";
import { HUD } from "../_shared/HUD";
import { StartScreen } from "../_shared/StartScreen";
import { ChronicleMap } from "./components/ChronicleMap";
import { LeaderboardPanel } from "../_shared/LeaderboardPanel";
import { ProgressPanel } from "../_shared/ProgressPanel";
import { CinematicStage } from "../_shared/variant/CinematicStage";
import { useNabiChronicles } from "./hooks/useNabiChronicles";

function Game() {
  const game = useNabiChronicles();
  const navigate = useNavigate();
  const chapter = game.chapter;
  return (
    <GameShell
      title="Nabi Chronicles"
      phase={game.phase}
      onPause={game.pause}
      onResume={game.resume}
      accent="violet"
    >
      {game.phase === "idle" ? (
        <StartScreen
          title="Nabi Chronicles"
          tagline="Kisah, hikmah, dan teladan"
          description="Ikuti lima chapter kisah teladan secara interaktif. Pilih sikap yang paling mencerminkan pelajaran chapter, lalu lihat bagaimana pilihanmu membentuk refleksi akhir."
          coverImage={<NabiChroniclesCoverSvg size={112} />}
          best={game.best}
          onStart={game.start}
          onExit={() => navigate("/member/ngaji-ceria/games")}
          accent="violet"
        />
      ) : (
        chapter && (
          <div className="space-y-3">
            <HUD
              score={game.score}
              progressLabel={`Chapter ${game.chapterIndex + 1}/${game.totalChapters}`}
            />
            <ChronicleMap
              current={game.chapterIndex}
              total={game.totalChapters}
            />
            <CinematicStage
              chapter={chapter.title}
              setting={chapter.setting}
              score={game.score}
            />
            <article className="rounded-3xl border-2 border-[#134E4A] bg-[#0F3E38] p-4 shadow-[3px_3px_0px_#134E4A]">
              {/* Maskot sebagai pemandu cerita */}
              <div className="flex items-center gap-3 mb-3 border-b border-teal-600/30 pb-3">
                <TilaMascot
                  size={68}
                  mood="thinking"
                  animation="float"
                  direction="right"
                  speech={`Kisah Nabi ${chapter.prophet}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                    Pemandu Kisah Teladan
                  </p>
                  <h2 className="font-display text-xl font-black text-white truncate">
                    {chapter.title}
                  </h2>
                  <p className="text-xs font-bold text-teal-200">
                    {chapter.setting}
                  </p>
                </div>
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-200">
                {chapter.prophet}
              </p>
              <h2 className="mt-2 font-display text-2xl font-black text-white">
                {chapter.title}
              </h2>
              <p className="mt-1 text-xs font-bold text-teal-200">
                {chapter.setting}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                {chapter.summary}
              </p>
              <div className="mt-4 rounded-2xl border-2 border-[#134E4A] bg-[#115E59] p-3 shadow-[1px_1px_0px_#134E4A]">
                <p className="text-sm font-bold leading-relaxed text-white">
                  {chapter.prompt}
                </p>
              </div>
            </article>
            <div className="grid gap-2">
              {chapter.choices.map((choice) => (
                <button
                  type="button"
                  key={choice.id}
                  disabled={game.phase !== "playing"}
                  onClick={() => game.choose(choice.id)}
                  className="min-h-[44px] rounded-2xl border-2 border-[#134E4A] bg-[#0F766E] p-3 text-left transition active:scale-[.98] shadow-[2px_2px_0px_#134E4A] relative z-30 disabled:opacity-60"
                >
                  <span className="block text-sm font-black text-white">
                    {choice.text}
                  </span>
                  <span className="mt-1 block text-xs text-teal-100">
                    Pilih untuk melihat hikmahnya.
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      )}
      <GameOverModal
        visible={game.phase === "gameover"}
        title={game.ending}
        score={game.score}
        best={game.best}
        isNewRecord={game.isNewRecord}
        accent="violet"
        description="Perjalanan selesai. Simpan hikmah yang paling ingin kamu praktikkan hari ini."
        onRetry={game.start}
        onExit={() => navigate("/member/ngaji-ceria/games")}
      >
        <div className="space-y-3">
          {game.selectedChoice && (
            <p className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-3 text-sm leading-relaxed text-amber-100">
              {game.selectedChoice.lesson}
            </p>
          )}
          <ProgressPanel progress={game.progress} />
          <LeaderboardPanel entries={game.leaderboard} />
        </div>
      </GameOverModal>
    </GameShell>
  );
}

export default function NabiChroniclesPage() {
  return (
    <GameBoundary>
      <Game />
    </GameBoundary>
  );
}
