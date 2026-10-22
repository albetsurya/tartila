import { TilaMascot } from "@/components/ui/TilaMascot";
import type { RunnerItem } from "../hooks/useHijaiyahRush";

const ObstacleRockSvg = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path
      d="M6 26 L12 10 L26 8 L32 20 L28 28 L10 30 Z"
      fill="#78716C"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 10 L18 18 L28 16"
      stroke="#134E4A"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 18 L16 29"
      stroke="#134E4A"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export function RunnerField({
  items,
  lane,
  jumpTime,
  shake,
  onLane,
  onJump,
}: {
  items: RunnerItem[];
  lane: number;
  jumpTime: number;
  shake: boolean;
  onLane: (lane: number) => void;
  onJump: () => void;
}) {
  const jumpArc = jumpTime > 0 ? Math.sin((jumpTime / 0.72) * Math.PI) : 0;
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-teal-400/30 bg-teal-950 ${shake ? "game-shake" : ""}`}
      style={{
        height: "clamp(270px, calc(100dvh - 355px), 560px)",
        touchAction: "none",
      }}
      onClick={onJump}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#2dd4bf22 1px, transparent 1px), linear-gradient(90deg, #2dd4bf22 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-x-0 bottom-[18%] grid grid-cols-3 opacity-60">
        {[0, 1, 2].map((value) => (
          <button
            type="button"
            key={value}
            aria-label={`Pindah jalur ${value + 1}`}
            onClick={(event) => {
              event.stopPropagation();
              onLane(value);
            }}
            className={`h-28 border-x border-teal-300/20 ${lane === value ? "bg-teal-400/10" : ""}`}
          />
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-center shadow-[2px_2px_0px_#134E4A] transition-none ${item.kind === "obstacle" ? "border-red-300/60 bg-red-950/60" : item.letter === undefined ? "" : "game-arabic border-teal-200 bg-teal-500/80 text-2xl text-teal-950"}`}
          style={{
            left: `calc(${(item.lane + 0.5) * 33.333}% - 24px)`,
            top: `${item.y}%`,
          }}
        >
          {item.kind === "obstacle" ? (
            <ObstacleRockSvg />
          ) : (
            item.letter
          )}
        </div>
      ))}
      {/* Maskot terbang di lane aktif */}
      <div
        className="pointer-events-none absolute bottom-[13%] transition-all duration-150 z-20 flex justify-center"
        style={{
          left: `calc(${(lane + 0.5) * 33.333}% - 32px)`,
          transform: `translateY(${-jumpArc * 50}px)`,
        }}
      >
        <TilaMascot
          size={64}
          animation="fly"
          mood={shake ? "sad" : "excited"}
          direction="right"
        />
      </div>

      <div className="absolute bottom-[13%] left-0 right-0 grid grid-cols-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onLane(lane - 1);
          }}
          className="h-10"
          aria-label="Jalur kiri"
        />
        <div className="h-10" />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onLane(lane + 1);
          }}
          className="h-10"
          aria-label="Jalur kanan"
        />
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onJump();
        }}
        className="game-button absolute bottom-2 left-1/2 -translate-x-1/2 border border-white/25 bg-white/10 text-xs"
      >
        Lompat · Space
      </button>
    </div>
  );
}
