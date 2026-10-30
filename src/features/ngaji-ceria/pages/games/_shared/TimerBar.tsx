import { ACCENTS, type GameAccent } from "./types";

export function TimerBar({
  progress,
  secondsLeft = 99,
  accent = "pink",
  className,
}: {
  progress: number;
  secondsLeft?: number;
  accent?: GameAccent;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(1, progress));
  const critical = secondsLeft < 10;
  void accent;
  return (
    <div
      role="progressbar"
      aria-label="Waktu tersisa"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      className={`border-[2px] border-[#134E4A] bg-white rounded-full h-4 overflow-hidden shadow-[inset_2px_2px_0px_rgba(19,78,74,0.1)] ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width,background-color] duration-100 ease-linear ${
          critical ? "bg-[#FF6B6B]" : "bg-[#0D9488]"
        }`}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}
