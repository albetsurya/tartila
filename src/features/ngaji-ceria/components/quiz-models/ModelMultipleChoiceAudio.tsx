import { useEffect, useRef, useState } from "react";
import { Check, Volume2, X } from "../../../../components/ui/FontAwesomeIcons";
import {
  StickerButton,
  StickerCard,
  BibiMascot,
} from "../../../../components/ui";
import type { MultipleChoiceAudioQuestion, QuizModelBaseProps } from "./types";

export interface ModelMultipleChoiceAudioProps extends QuizModelBaseProps {
  question: MultipleChoiceAudioQuestion;
}

export function ModelMultipleChoiceAudio({
  question,
  onAnswerSubmit,
  onNext,
  onPlayAudio,
  isAudioPlaying,
}: ModelMultipleChoiceAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlay = () => {
    if (onPlayAudio) {
      onPlayAudio();
      return;
    }
    if (!question.audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(question.audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    audio.currentTime = 0;
    void audio.play();
    setIsPlaying(true);
  };

  const playing = onPlayAudio ? Boolean(isAudioPlaying) : isPlaying;

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
      {/* Audio Prompt */}
      <div className="flex flex-col items-center mb-6">
        <button
          type="button"
          onClick={handlePlay}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none ${
            playing ? "bg-[#0D9488] text-white" : "bg-white text-[#0D9488]"
          }`}
        >
          {playing && (
            <span className="absolute inset-0 rounded-full bg-[#0D9488]/30 animate-ping" />
          )}
          <Volume2 size={44} className="relative z-10" />
        </button>
        <p className="mt-3 text-xs font-black text-[#134E4A]/70 tracking-wide">
          Sentuh untuk Putar Suara
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
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

      {/* Submit */}
      {status === "idle" && (
        <StickerButton
          variant="primary"
          fullWidth
          disabled={selected === null}
          onClick={handleCheck}
          className="mt-6"
        >
          Periksa Jawaban
        </StickerButton>
      )}

      {/* Feedback Bottom Sheet (With Bibi) */}
      {status !== "idle" && (
        <div className="fixed bottom-0 left-0 w-full bg-transparent px-4 pb-6 pt-2 z-50">
          <div className="max-w-md mx-auto relative">
            <div className="absolute -top-14 right-6 z-10">
              <BibiMascot
                size={90}
                mood={status === "correct" ? "excited" : "sad"}
                animation="bounce"
              />
            </div>
            <StickerCard
              accent={status === "correct" ? "deep-teal" : "coral"}
              className={`p-6 !rounded-[24px] ${
                status === "correct" ? "bg-[#F0FDF4]" : "bg-[#FFF0F0]"
              }`}
            >
              <div className="flex items-center gap-3 pr-20">
                <span
                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center shrink-0 border-2 border-[#134E4A] ${
                    status === "correct" ? "bg-[#0D9488]" : "bg-[#FF6B6B]"
                  }`}
                >
                  {status === "correct" ? <Check size={20} /> : <X size={20} />}
                </span>
                <div>
                  <p
                    className={`text-base font-black leading-none ${status === "correct" ? "text-[#0D9488]" : "text-[#FF6B6B]"}`}
                  >
                    {status === "correct" ? "Masya Allah!" : "Hampir Tepat!"}
                  </p>
                  <p className="text-xs font-bold text-[#134E4A]/70 mt-1">
                    {status === "correct"
                      ? "Jawabanmu sudah benar."
                      : "Dengarkan lagi lalu coba ulangi."}
                  </p>
                </div>
              </div>
              <StickerButton
                variant={status === "correct" ? "primary" : "danger"}
                fullWidth
                onClick={status === "correct" ? onNext : handleRetry}
                className="mt-5"
              >
                {status === "correct" ? "Lanjut →" : "Coba Lagi"}
              </StickerButton>
            </StickerCard>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelMultipleChoiceAudio;
