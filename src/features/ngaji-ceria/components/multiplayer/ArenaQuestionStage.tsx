/**
 * Panggung soal Arena yang dipakai BERSAMA oleh layar Host (`HostGamePage`)
 * dan santri (`PlayerGamePage`). Satu komponen untuk keduanya supaya teks
 * soal, urutan pilihan, dan label A/B/C/D dijamin identik secara visual —
 * tidak ada lagi soal yang "beda" antara Host dan Player.
 */
import type { ReactNode } from "react";
import { Volume2, CheckSvg, XSvg } from "@/components/ui/CustomIcons";
import { getAudioUrl } from "../../utils/audioUrl";

const OPTION_BADGES = ["bg-[#FEE2E2]", "bg-[#DBEAFE]", "bg-[#FEF3C7]", "bg-[#D1FAE5]"];
const OPTION_LETTERS = ["A", "B", "C", "D"];

export interface ArenaStageOption {
  id?: string;
  text?: string;
  arabic?: string;
}

export interface ArenaStageQuestion {
  id?: string;
  prompt?: string;
  title?: string;
  arabicPrompt?: string;
  audioUrl?: string;
  category?: string;
  correctAnswer?: string | string[];
  options?: Array<ArenaStageOption | string>;
}

function toOptionList(question: ArenaStageQuestion) {
  const raw = Array.isArray(question.options) ? question.options : [];
  return raw.map((opt, idx) => {
    const letter = OPTION_LETTERS[idx] || String.fromCharCode(65 + idx);
    if (typeof opt === "string") {
      return { id: letter, text: opt, arabic: "" };
    }
    return {
      id: opt?.id ? String(opt.id) : letter,
      text: String(opt?.text ?? ""),
      arabic: String(opt?.arabic ?? ""),
    };
  });
}

function resolveCorrectAnswer(question: ArenaStageQuestion): string {
  const raw = question.correctAnswer;
  if (Array.isArray(raw)) return String(raw[0] ?? "");
  return raw ? String(raw) : "";
}

export interface ArenaQuestionStageProps {
  question: ArenaStageQuestion;
  questionIndex: number;
  totalQuestions: number;
  /** Pilihan yang sedang/ sudah dipilih pengguna. */
  selectedOptionId?: string | null;
  /** Fase pembahasan: kunci benar & salah ditampilkan. */
  revealed?: boolean;
  /** Kunci jawaban dari server (dipakai Player saat reveal). */
  correctAnswer?: string;
  disabled?: boolean;
  /** Sembunyikan pilihan (mis. Host sedang mengawasi ujian). */
  hideOptions?: boolean;
  onSelect?: (optionId: string) => void;
  /** Elemen tambahan di bawah pilihan (status jawaban, tombol, dsb). */
  footer?: ReactNode;
  className?: string;
}

export function ArenaQuestionStage({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  revealed = false,
  correctAnswer,
  disabled = false,
  hideOptions = false,
  onSelect,
  footer,
  className = "",
}: ArenaQuestionStageProps) {
  const options = toOptionList(question);
  const activeKey = correctAnswer || resolveCorrectAnswer(question);
  const prompt = question.prompt || question.title || "";

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-3 ${className}`}>
      {/* Kartu Soal */}
      <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A] text-center space-y-2">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60">
          <span className="px-2 py-0.5 rounded bg-[#FEF08A] border border-[#134E4A] text-[#134E4A]">
            Soal {questionIndex + 1}
            {totalQuestions > 0 ? ` / ${totalQuestions}` : ""}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#CCFBF1] border border-[#134E4A] text-[#134E4A]">
            {question.category || "Tilawati"}
          </span>
        </div>

        {prompt && (
          <h2 className="text-base sm:text-lg font-black text-[#134E4A] leading-snug">
            {prompt}
          </h2>
        )}

        {question.arabicPrompt && (
          <p
            dir="rtl"
            className="font-arabic text-2xl sm:text-3xl font-black text-[#0D9488] leading-relaxed pt-1"
          >
            {question.arabicPrompt}
          </p>
        )}

        {question.audioUrl && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                const audio = new Audio(
                  getAudioUrl(question.audioUrl!) ?? question.audioUrl,
                );
                audio.play().catch(() => {});
              }}
              className="px-3.5 py-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] hover:bg-[#FDE047] text-[#134E4A] font-black text-xs shadow-[2px_2px_0px_#134E4A] inline-flex items-center gap-1.5 active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <Volume2 size={15} />
              <span>Putar Audio</span>
            </button>
          </div>
        )}
      </div>

      {/* Pilihan A-D: markup identik untuk Host & Player */}
      {!hideOptions && options.length > 0 && (
        <div className="grid grid-cols-1 gap-2.5 w-full">
          {options.map((opt, idx) => {
            const letter = OPTION_LETTERS[idx] || String.fromCharCode(65 + idx);
            const isSelected = selectedOptionId === opt.id;
            const isCorrectOption =
              revealed &&
              Boolean(activeKey) &&
              (opt.id === activeKey ||
                opt.text === activeKey ||
                opt.id.toLowerCase() === activeKey.toLowerCase());
            const isWrongChoice = revealed && isSelected && !isCorrectOption;
            const canClick = !disabled && !revealed && Boolean(onSelect);

            let cardStyle =
              "bg-white border-[#134E4A] text-[#134E4A] shadow-[3.5px_3.5px_0px_#134E4A]";
            if (revealed) {
              if (isCorrectOption) {
                cardStyle =
                  "bg-[#D1FAE5] border-[#10B981] ring-4 ring-[#10B981] text-[#134E4A] shadow-[4px_4px_0px_#10B981] scale-[1.01]";
              } else if (isWrongChoice) {
                cardStyle =
                  "bg-[#FEE2E2] border-[#EF4444] ring-4 ring-[#EF4444] text-[#134E4A] shadow-[4px_4px_0px_#EF4444]";
              } else {
                cardStyle =
                  "bg-gray-50 border-[#134E4A]/30 text-[#134E4A]/50 opacity-40 shadow-none";
              }
            } else if (isSelected) {
              cardStyle =
                "bg-[#CCFBF1] border-[#0D9488] ring-4 ring-[#0D9488] text-[#134E4A] shadow-[4px_4px_0px_#0D9488] scale-[1.01]";
            } else if (disabled) {
              cardStyle =
                "bg-white/80 border-[#134E4A]/50 text-[#134E4A]/60 opacity-60 shadow-none";
            } else {
              cardStyle =
                "bg-white hover:bg-[#F0FDF4] border-[#134E4A] text-[#134E4A] shadow-[3.5px_3.5px_0px_#134E4A]";
            }

            return (
              <button
                key={`${opt.id}-${idx}`}
                type="button"
                disabled={!canClick}
                onClick={() => onSelect?.(opt.id)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border-[3px] flex items-center justify-between gap-3 text-left transition-all ${cardStyle} ${
                  canClick
                    ? "cursor-pointer active:translate-y-[2px] active:shadow-none"
                    : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span
                    className={`w-9 h-9 rounded-xl border-[2.5px] border-[#134E4A] ${
                      OPTION_BADGES[idx % OPTION_BADGES.length]
                    } text-[#134E4A] font-display text-base font-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#134E4A]`}
                  >
                    {letter}
                  </span>

                  <span className="font-black text-sm sm:text-base leading-snug break-words">
                    {opt.text}
                  </span>
                </div>

                {opt.arabic && (
                  <span
                    dir="rtl"
                    className="font-arabic text-xl sm:text-2xl text-[#0D9488] leading-relaxed shrink-0 pl-2"
                  >
                    {opt.arabic}
                  </span>
                )}

                {revealed && (
                  <div className="shrink-0 flex items-center">
                    {isCorrectOption && (
                      <span className="px-2.5 py-1 rounded-lg border-2 border-[#134E4A] bg-[#10B981] text-white text-[11px] font-black inline-flex items-center gap-1 shadow-[1.5px_1.5px_0px_#134E4A]">
                        <CheckSvg size={14} /> Benar
                      </span>
                    )}
                    {isWrongChoice && (
                      <span className="px-2.5 py-1 rounded-lg border-2 border-[#134E4A] bg-[#EF4444] text-white text-[11px] font-black inline-flex items-center gap-1 shadow-[1.5px_1.5px_0px_#134E4A]">
                        <XSvg size={14} /> Pilihanmu
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {footer}
    </div>
  );
}
