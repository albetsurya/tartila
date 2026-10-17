import { useState } from "react";
import { Volume2 } from "../../../../components/ui/FontAwesomeIcons";
import {
  StickerButton,
  StickerCard,
  BibiMascot,
} from "../../../../components/ui";
import type { MultipleChoiceTextQuestion, QuizModelBaseProps } from "./types";

export interface ModelMultipleChoiceTextProps extends QuizModelBaseProps {
  question: MultipleChoiceTextQuestion;
}

export function ModelMultipleChoiceText({
  question,
  onAnswerSubmit,
  onNext,
}: ModelMultipleChoiceTextProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const handlePick = (option: string) => {
    if (status !== "idle") return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (selected === null) return;
    const isCorrect = selected === question.correctAnswer;
    setStatus(isCorrect ? "correct" : "wrong");
    onAnswerSubmit?.(isCorrect);
  };

  const handleRetry = () => {
    setSelected(null);
    setStatus("idle");
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 flex flex-col bg-[#F0FDF4]">
      {/* Question Box */}
      <StickerCard className="relative p-8 text-center mb-6">
        {question.audioUrl && (
          <StickerButton
            variant="secondary"
            size="sm"
            onClick={() => {
              const audio = new Audio(question.audioUrl);
              void audio.play();
            }}
            className="absolute top-3 right-3 !w-10 !h-10 !p-0 !rounded-full"
          >
            <Volume2 size={18} />
          </StickerButton>
        )}
        <p
          className="text-5xl font-arabic text-[#134E4A] leading-loose"
          dir="rtl"
        >
          {question.arabicText}
        </p>
      </StickerCard>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = option === question.correctAnswer;
          const showCorrect = status !== "idle" && isAnswer;
          const showWrong = status === "wrong" && isSelected && !isAnswer;

          return (
            <button
              key={option}
              type="button"
              disabled={status !== "idle"}
              onClick={() => handlePick(option)}
              className={`min-h-16 rounded-xl border-[3px] p-4 text-2xl font-arabic font-bold text-[#134E4A] transition-all shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none ${
                showCorrect
                  ? "border-[#0D9488] bg-[#F0FDF4]"
                  : showWrong
                    ? "border-[#FF6B6B] bg-[#FFF0F0]"
                    : isSelected
                      ? "border-[#0D9488] bg-white"
                      : "border-[#134E4A] bg-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {status !== "idle" && (
        <div className="w-full mt-6">
          <StickerCard
            accent={status === "correct" ? "deep-teal" : "coral"}
            className={`flex items-center gap-4 p-4 ${
              status === "correct" ? "bg-[#F0FDF4]" : "bg-[#FFF0F0]"
            }`}
          >
            <div className="shrink-0 -mt-8 -ml-2">
              <BibiMascot
                size={72}
                mood={status === "correct" ? "excited" : "sad"}
                animation="bounce"
              />
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-black ${status === "correct" ? "text-[#0D9488]" : "text-[#FF6B6B]"}`}
              >
                {status === "correct"
                  ? "Masya Allah, tepat!"
                  : "Hampir tepat, coba lagi ya."}
              </p>
            </div>
          </StickerCard>
        </div>
      )}

      {/* Submit / Next */}
      <div className="w-full mt-6">
        {status === "idle" ? (
          <StickerButton
            variant="primary"
            fullWidth
            disabled={selected === null}
            onClick={handleCheck}
          >
            Periksa Jawaban
          </StickerButton>
        ) : (
          <StickerButton
            variant={status === "correct" ? "primary" : "danger"}
            fullWidth
            onClick={status === "correct" ? onNext : handleRetry}
          >
            {status === "correct" ? "Lanjut →" : "Coba Lagi"}
          </StickerButton>
        )}
      </div>
    </div>
  );
}

export default ModelMultipleChoiceText;
