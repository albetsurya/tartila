import { HeartSvg } from "@/components/ui/CustomIcons";

export function HUD({
  score,
  lives,
  progressLabel,
  timeLeft,
}: {
  score: number;
  lives?: number;
  progressLabel?: string;
  timeLeft?: number;
}) {
  const critical = timeLeft !== undefined && timeLeft < 10;
  return (
    <div className="border-[3px] border-[#134E4A] bg-white rounded-2xl shadow-[3px_3px_0px_#134E4A] px-4 py-2 flex items-center justify-between gap-2">
      {/* Skor */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60">
          Skor
        </p>
        <p data-testid="score" className="font-display text-2xl font-black text-[#134E4A]">
          {score}
        </p>
      </div>

      {/* Label progres & Timer */}
      <div className="text-center">
        {progressLabel && (
          <p className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60">
            {progressLabel}
          </p>
        )}
        {timeLeft !== undefined && (
          <p
            data-testid="timer"
            className={`font-display text-lg font-black ${
              critical ? "text-[#FF6B6B] animate-pulse" : "text-[#134E4A]"
            }`}
          >
            {Math.ceil(timeLeft)} detik
          </p>
        )}
      </div>

      {/* Nyawa */}
      {lives !== undefined && (
        <div
          aria-label={`${lives} nyawa tersisa`}
          className="flex shrink-0 gap-1.5 items-center"
        >
          {[0, 1, 2].map((i) => (
            <HeartSvg
              key={i}
              size={20}
              className={
                i < lives ? "text-[#FF6B6B]" : "[&_path:first-child]:fill-[#D1D5DB]"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
