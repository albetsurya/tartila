import { useEffect, useRef, useState } from "react";
import { Volume2 } from "../../../../components/ui/CustomIcons";
import { StickerCard } from "../../../../components/ui";
import type {
  AudioMatchingOption,
  AudioMatchingQuestion,
  QuizModelBaseProps,
  ShapeVariant,
} from "./types";
import { getAudioUrl } from "../../utils/audioUrl";

export interface ModelAudioMatchingProps extends QuizModelBaseProps {
  question: AudioMatchingQuestion;
}

const SHAPE_STYLES: Record<ShapeVariant, { bg: string; label: string }> = {
  circle: { bg: "bg-[#0D9488]", label: "Bulat" },
  square: { bg: "bg-[#FF6B6B]", label: "Kotak" },
  triangle: { bg: "bg-[#134E4A]", label: "Segitiga" },
  diamond: { bg: "bg-[#FBBF24]", label: "Belah Ketupat" },
};

function ShapeIcon({ shape }: { shape: ShapeVariant }) {
  switch (shape) {
    case "circle":
      return (
        <span className="block w-7 h-7 rounded-full bg-white border-2 border-black/10" />
      );
    case "square":
      return (
        <span className="block w-7 h-7 rounded-md bg-white border-2 border-black/10" />
      );
    case "triangle":
      return (
        <span className="block w-0 h-0 border-l-[14px] border-r-[14px] border-b-[24px] border-l-transparent border-r-transparent border-b-white" />
      );
    case "diamond":
      return (
        <span className="block w-6 h-6 rounded-sm bg-white rotate-45 border-2 border-black/10" />
      );
  }
}

export function ModelAudioMatching({ question }: ModelAudioMatchingProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlay = (option: AudioMatchingOption) => {
    setSelected(option.id);
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = getAudioUrl(option.audioUrl) ?? option.audioUrl;
    audio.currentTime = 0;
    void audio.play();
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 flex flex-col bg-[#F0FDF4]">
      {/* Question Card */}
      <StickerCard className="py-8 text-center mb-6">
        <p
          className="text-4xl font-arabic text-[#134E4A] leading-loose"
          dir="rtl"
        >
          {question.arabicText}
        </p>
      </StickerCard>

      {/* Audio Grid 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option) => {
          const style = SHAPE_STYLES[option.shape];
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handlePlay(option)}
              aria-label={style.label}
              className={`flex justify-between items-center p-4 rounded-xl border-[3px] border-[#134E4A] text-white shadow-[3px_3px_0px_#134E4A] transition-all active:translate-y-[2px] active:shadow-none ${style.bg} ${
                isSelected ? "ring-4 ring-[#134E4A]/20 ring-offset-2" : ""
              }`}
            >
              <Volume2 size={22} />
              <ShapeIcon shape={option.shape} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ModelAudioMatching;
