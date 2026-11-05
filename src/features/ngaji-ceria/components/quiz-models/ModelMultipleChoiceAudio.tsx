import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { answerFeedbackAnimation } from "./feedbackMotion";
import type { MultipleChoiceAudioQuestion, QuizModelBaseProps } from "./types";
import { AnswerFeedbackSheet } from "../AnswerFeedbackSheet";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";

export interface ModelMultipleChoiceAudioProps extends QuizModelBaseProps {
  question: MultipleChoiceAudioQuestion;
}

interface ChoiceAudioViewProps
  extends Omit<QuizModelBaseProps, "onPlayAudio" | "onStopAudio"> {
  question: MultipleChoiceAudioQuestion;
  playing: boolean;
  pending: boolean;
  onPlay: () => void;
  onStop: () => void;
}

/**
 * Tampilan murni (tanpa hook audio). Hanya menerima status pemutaran dari
 * pemilik audio yang sebenarnya, sehingga animasi equalizer mengikuti satu
 * sumber kebenaran.
 */
function ChoiceAudioView({
  question,
  playing,
  pending,
  onPlay,
  onStop,
  onAnswerSubmit,
  onNext,
  isRetryable,
  explanation,
}: ChoiceAudioViewProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const reducedMotion = useReducedMotion();

  const handlePlay = () => {
    if (pending) return;
    onPlay();
  };

  const handlePick = (option: string) => {
    if (status !== "idle") return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (selected === null || status !== "idle") return;
    const isCorrect = selected === question.correctAnswer;
    setStatus(isCorrect ? "correct" : "wrong");
    onAnswerSubmit?.(isCorrect, selected);

    onStop();
  };

  const handleRetry = () => {
    setSelected(null);
    setStatus("idle");
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col bg-transparent">
      {/* Tombol Audio Utama (Lingkaran Luar Mint + Lingkaran Dalam Olive + Equalizer Bars) */}
      <div className="flex flex-col items-center mb-6">
        <motion.button
          type="button"
          onClick={handlePlay}
          animate={{ scale: playing ? [1, 1.08, 1] : 1 }}
          transition={playing ? { repeat: Infinity, duration: 1, ease: "easeInOut" } : { duration: 0.2 }}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center p-3 bg-[#DCFCE7] border-[3px] border-[#4D7C0F]/40 shadow-[4px_4px_0px_#4D7C0F]/30 active:scale-95 transition-all cursor-pointer ${
            pending ? "opacity-75 cursor-wait" : ""
          }`}
          aria-label="Putar Suara"
        >
          {playing && (
            <span className="absolute inset-0 rounded-full bg-[#4D7C0F]/20 animate-ping" />
          )}
          <div className="w-full h-full rounded-full flex items-center justify-center bg-[#4D7C0F] shadow-inner">
            <EqualizerIcon isPlaying={playing} size={36} barClassName="bg-white" />
          </div>
        </motion.button>
        <p className="mt-3 text-xs font-black text-[#134E4A] tracking-wide">
          {pending ? "Menyiapkan Suara…" : "Sentuh untuk Putar Suara"}
        </p>
      </div>

      {/* Grid Opsi Pilihan Jawaban (Teks Arab, bebas diklik kapan saja tanpa lock) */}
      <div className="flex flex-col gap-3">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = option === question.correctAnswer;
          const showCorrect = status !== "idle" && isAnswer;
          const showWrong = status === "wrong" && isSelected && !isAnswer;

          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => handlePick(option)}
              animate={answerFeedbackAnimation(
                showCorrect ? "correct" : showWrong ? "wrong" : "none",
                reducedMotion ?? false,
              )}
              className={`min-h-[68px] rounded-2xl border-[3px] p-4 text-3xl font-arabic font-bold text-center leading-relaxed break-words transition-all shadow-[3px_3px_0px_var(--border-color,#0284C7)] active:translate-y-[2px] active:shadow-none cursor-pointer ${
                showCorrect
                  ? "border-[#0D9488] bg-[#F0FDF4] text-[#0D9488]"
                  : showWrong
                    ? "border-[#FF6B6B] bg-[#FFF0F0] text-[#FF6B6B]"
                    : isSelected
                      ? "border-[var(--border-color,#0284C7)] bg-sky-100/70 text-[var(--text-main,#0369A1)] ring-2 ring-[var(--border-color,#0284C7)]"
                      : "border-[var(--border-color,#0284C7)] bg-white text-[var(--text-main,#0369A1)] hover:bg-sky-50"
              }`}
              dir="rtl"
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Tombol Periksa Jawaban */}
      <div className="w-full mt-6">
        <button
          type="button"
          disabled={selected === null || status !== "idle"}
          onClick={handleCheck}
          className={`w-full py-4 px-6 rounded-2xl font-display font-black text-base border-[3px] transition-all flex items-center justify-center ${
            selected === null || status !== "idle"
              ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-[var(--border-color,#0284C7)] hover:bg-[#0284C7]/90 text-white border-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] cursor-pointer"
          }`}
        >
          Periksa Jawaban
        </button>
      </div>

      {/* Bottom Sheet Notifikasi Jawaban Benar / Salah */}
      <AnswerFeedbackSheet
        isOpen={status !== "idle"}
        isCorrect={status === "correct"}
        onNext={onNext}
        onRetry={handleRetry}
        onReset={handleRetry}
        isRetryable={isRetryable}
        // Opsi model ini berbahasa Arab, jadi kunci yang ditampilkan juga Arab.
        correctAnswer={question.correctAnswer}
        explanation={explanation}
      />
    </div>
  );
}

/** Mode host: seluruh pemutaran dikendalikan parent (NgajiCeriaQuizPage). */
function HostAudioChoice(props: ModelMultipleChoiceAudioProps & { onPlayAudio: () => void }) {
  const { onPlayAudio, onStopAudio, isAudioPlaying, isAudioPending, ...rest } = props;
  return (
    <ChoiceAudioView
      {...rest}
      playing={Boolean(isAudioPlaying)}
      pending={Boolean(isAudioPending)}
      onPlay={onPlayAudio}
      onStop={onStopAudio ?? (() => {})}
    />
  );
}

/** Mode fallback: tidak ada host, pakai pemutar lokal. */
function LocalAudioChoice({ question, ...rest }: ModelMultipleChoiceAudioProps) {
  const audioPlayer = useAudioPlayer();
  return (
    <ChoiceAudioView
      {...rest}
      question={question}
      playing={audioPlayer.isPlaying}
      pending={audioPlayer.isPending}
      onPlay={() => {
        if (!question.audioUrl) return;
        if (audioPlayer.isPlaying) {
          audioPlayer.pause();
          return;
        }
        audioPlayer.play(question.audioUrl);
      }}
      onStop={audioPlayer.stop}
    />
  );
}

export function ModelMultipleChoiceAudio(props: ModelMultipleChoiceAudioProps) {
  // Hook lokal hanya diinstansiasi saat tidak ada host, agar tidak ada dua
  // elemen audio yang saling berebut.
  return props.onPlayAudio ? (
    <HostAudioChoice {...props} onPlayAudio={props.onPlayAudio} />
  ) : (
    <LocalAudioChoice {...props} />
  );
}

export default ModelMultipleChoiceAudio;
