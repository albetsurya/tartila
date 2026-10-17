import type { AnswerState } from "../hooks/useQuizGame";

export function OptionButton({ label, index, selected, correct, answerState, arabic, onSelect }: { label: string; index: number; selected: boolean; correct: boolean; answerState: AnswerState; arabic: boolean; onSelect: (index: number) => void }) {
  const revealed = answerState !== "idle";
  const isCorrect = revealed && correct;
  const isWrongPick = revealed && selected && !correct;
  const color = isCorrect
    ? "border-green-500 bg-green-50 text-[#134E4A]"
    : isWrongPick
      ? "border-[#FF6B6B] bg-[#FF6B6B]/10 text-[#134E4A]"
      : selected
        ? "border-[#0D9488] bg-[#F0FDF4] text-[#134E4A]"
        : "border-gray-100 bg-white text-[#134E4A] hover:bg-[#F0FDF4]";
  const feedback = isCorrect ? "quiz-option-correct" : isWrongPick ? "game-shake" : "";
  return <button data-option-index={index} data-option-correct={correct} disabled={revealed} onClick={() => onSelect(index)} className={`min-h-14 w-full rounded-2xl border-2 p-4 text-left shadow-sm transition-colors active:scale-[0.98] ${color} ${feedback} ${arabic ? "game-arabic text-xl leading-loose" : "text-sm font-semibold leading-snug"}`} dir={arabic ? "rtl" : "ltr"}>{label}</button>;
}
