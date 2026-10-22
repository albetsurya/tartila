import type { AnswerState } from "../hooks/useQuizGame";

export function OptionButton({
  label,
  index,
  selected,
  correct,
  answerState,
  arabic,
  onSelect,
}: {
  label: string;
  index: number;
  selected: boolean;
  correct: boolean;
  answerState: AnswerState;
  arabic: boolean;
  onSelect: (index: number) => void;
}) {
  const revealed = answerState !== "idle";
  const isCorrect = revealed && correct;
  const isWrongPick = revealed && selected && !correct;
  const color = isCorrect
    ? "border-2 border-[#134E4A] bg-[#059669] text-white shadow-[2px_2px_0px_#134E4A]"
    : isWrongPick
      ? "border-2 border-[#134E4A] bg-[#DC2626] text-white shadow-[2px_2px_0px_#134E4A]"
      : selected
        ? "border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
        : "border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#F0FDF4]";
  const feedback = isCorrect ? "quiz-option-correct" : isWrongPick ? "game-shake" : "";
  return (
    <button
      data-option-index={index}
      data-option-correct={correct}
      disabled={revealed}
      onClick={() => onSelect(index)}
      className={`min-h-[52px] w-full rounded-2xl p-3.5 text-left transition-transform active:scale-[0.98] relative z-30 flex items-center justify-between ${color} ${feedback} ${
        arabic ? "game-arabic text-xl leading-loose" : "text-sm font-bold leading-snug"
      }`}
      dir={arabic ? "rtl" : "ltr"}
    >
      <span>{label}</span>
    </button>
  );
}
