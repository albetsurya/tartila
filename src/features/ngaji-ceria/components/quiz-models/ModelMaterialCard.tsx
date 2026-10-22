import { useEffect, useRef } from "react";
import { Info, Volume2 } from "../../../../components/ui/CustomIcons";
import { StickerButton, StickerCard } from "../../../../components/ui";
import type { MaterialItem, QuizModelBaseProps } from "./types";

export interface ModelMaterialCardProps extends QuizModelBaseProps {
  material: MaterialItem;
}

export function ModelMaterialCard({
  material,
  onNext,
  onPlayAudio,
}: ModelMaterialCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (!material.audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(material.audioUrl);
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    void audio.play();
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 flex flex-col bg-[#F0FDF4]">
      {/* Main Box */}
      <StickerCard className="!bg-[#F0FDF4] !border-[#0D9488] p-8 flex flex-col items-center justify-center min-h-[200px]">
        <p
          className="text-5xl font-arabic text-[#134E4A] leading-loose text-center"
          dir="rtl"
        >
          {material.arabicText}
        </p>
        <p className="mt-3 text-sm font-bold text-[#134E4A]/70">
          {material.transliteration}
        </p>

        {/* Audio Pill */}
        <StickerButton
          variant="secondary"
          onClick={handlePlay}
          className="mt-6 !rounded-full"
        >
          <Volume2 size={18} />
          Sentuh untuk Bunyikan
        </StickerButton>
      </StickerCard>

      {/* Instruction Box */}
      <StickerCard accent="coral" className="mt-6 p-4 flex gap-3 !bg-[#FFF0F0]">
        <Info size={20} className="text-[#FF6B6B] shrink-0 mt-0.5" />
        <p className="text-sm font-bold text-[#134E4A] leading-relaxed">
          {material.instruction}
        </p>
      </StickerCard>

      {/* Next Button */}
      <StickerButton
        variant="primary"
        fullWidth
        onClick={onNext}
        className="mt-6"
      >
        Lanjut →
      </StickerButton>
    </div>
  );
}

export default ModelMaterialCard;
