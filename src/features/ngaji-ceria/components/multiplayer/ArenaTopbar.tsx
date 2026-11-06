/**
 * Topbar / HUD gameplay bersama untuk layar Host (`HostGamePage`) dan santri
 * (`PlayerGamePage`). Markup ini disalin dari HUD sebelumnya di HostGamePage
 * supaya Soal / Timer / Skor tampil 100% sama di kedua layar — bedanya hanya
 * label peran (Host/Santri) dan handler tombol kembali.
 */
import { ChevronLeftSvg } from "@/components/ui/CustomIcons";
import { MultiplayerAvatar } from "./MultiplayerSetupSheet";

export interface ArenaTopbarProps {
  role: "host" | "player";
  name: string;
  avatarId?: string;
  pin: string;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  /** Batas waktu soal berjalan — dasar persentase bar timer. */
  timeLimit: number;
  /** Fase pembahasan/leaderboard: timer jadi abu-abu & penuh hilang. */
  revealed?: boolean;
  score: number;
  onBack?: () => void;
}

export function ArenaTopbar({
  role,
  name,
  avatarId,
  pin,
  questionIndex,
  totalQuestions,
  timeLeft,
  timeLimit,
  revealed = false,
  score,
  onBack,
}: ArenaTopbarProps) {
  const maxTime = timeLimit || 20;
  const timePercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  return (
    <section className="rounded-2xl border-[3.5px] border-[#134E4A] bg-white px-3 py-2.5 sm:px-4 shadow-[4px_4px_0px_#134E4A] space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Kembali"
              className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-0.5 cursor-pointer"
            >
              <ChevronLeftSvg size={18} />
            </button>
          )}
          <MultiplayerAvatar avatarId={avatarId || "boy-peci"} size={32} />
          <div className="min-w-0">
            <span className="block text-[9px] font-black uppercase tracking-wider text-[#134E4A]/60 leading-none">
              {role === "host" ? "Host" : "Santri"}
            </span>
            <span className="block text-xs font-black text-[#134E4A] truncate max-w-[120px]">
              {name}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] text-[10px] font-black text-[#134E4A]">
            Soal {Math.min(questionIndex + 1, totalQuestions || 1)}/
            {totalQuestions || 1}
          </span>
          <span className="px-2 py-0.5 rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] text-[10px] font-black text-[#134E4A]">
            PIN {pin}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-1 max-w-[220px] min-w-[140px] justify-center">
          <div className="flex-1 h-3 rounded-full border-2 border-[#134E4A] bg-gray-100 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                revealed
                  ? "bg-[#6B7280]"
                  : timeLeft <= 5
                    ? "bg-[#EF4444]"
                    : "bg-[#0D9488]"
              }`}
              style={{ width: `${revealed ? 0 : timePercent}%` }}
            />
          </div>
          <div
            className={`min-w-[46px] h-8 px-2 rounded-xl border-[2.5px] border-[#134E4A] flex items-center justify-center font-display text-sm font-black shadow-[2px_2px_0px_#134E4A] ${
              revealed
                ? "bg-gray-200 text-[#134E4A]"
                : timeLeft <= 5
                  ? "bg-[#EF4444] text-white animate-pulse"
                  : "bg-[#FEF08A] text-[#134E4A]"
            }`}
          >
            {/* Satuan detik, bukan hari: sebelumnya terbaca "5d" */}
            {revealed ? "—" : `${timeLeft}s`}
          </div>
        </div>

        <div className="px-3 py-1 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A] text-right shrink-0">
          <span className="block text-[9px] font-black uppercase text-[#B45309] leading-none">
            Skor Kamu
          </span>
          <span className="font-display text-sm font-black text-[#134E4A]">
            {score} pts
          </span>
        </div>
      </div>
    </section>
  );
}
