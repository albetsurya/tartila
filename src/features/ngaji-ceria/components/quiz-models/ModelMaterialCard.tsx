import { useEffect, useRef, useState } from "react";
import { Info, Volume2, ArrowRightSvg } from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import type { MaterialItem, QuizModelBaseProps } from "./types";
import { getAudioUrl } from "../../utils/audioUrl";

export interface ModelMaterialCardProps extends QuizModelBaseProps {
  material: MaterialItem;
}

export function ModelMaterialCard({
  material,
  onNext,
  onPlayAudio,
  isAudioPlaying,
}: ModelMaterialCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [localPlaying, setLocalPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const handlePlay = () => {
    if (onPlayAudio) {
      onPlayAudio();
      return;
    }
    if (!material.audioUrl) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(getAudioUrl(material.audioUrl) ?? material.audioUrl);
    audioRef.current = audio;
    setLocalPlaying(true);
    audio.onended = () => setLocalPlaying(false);
    audio.onerror = () => setLocalPlaying(false);
    void audio.play().catch(() => setLocalPlaying(false));
  };

  const isPlaying = Boolean(isAudioPlaying || localPlaying);

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 flex flex-col bg-transparent">
      {/* Main Box */}
      <div className="rounded-3xl bg-[var(--bg-card,#FFFFFF)] border-[3px] border-[var(--border-color,#0284C7)] shadow-[4px_4px_0px_var(--border-color,#0284C7)] p-8 flex flex-col items-center justify-center min-h-[200px]">
        <p
          className="text-5xl font-arabic text-[var(--text-main,#0369A1)] leading-loose text-center"
          dir="rtl"
        >
          {material.arabicText}
        </p>
        <p className="mt-3 text-sm font-bold text-[var(--text-main,#0369A1)]">
          {material.transliteration}
        </p>

        {/* Audio Pill */}
        <button
          type="button"
          onClick={handlePlay}
          className={`mt-6 px-4 py-2 rounded-full border-2 border-[var(--border-color,#0284C7)] font-bold text-xs active:translate-y-[1px] flex items-center gap-1.5 transition-all ${
            isPlaying
              ? "bg-[var(--border-color,#0284C7)] text-white shadow-[2px_2px_0px_var(--border-color,#0284C7)]"
              : "bg-white text-[var(--text-main,#0369A1)] hover:bg-sky-50 shadow-[2px_2px_0px_var(--border-color,#0284C7)]"
          }`}
        >
          {isPlaying ? (
            <EqualizerIcon isPlaying={true} size={16} barClassName="bg-white" />
          ) : (
            <Volume2 size={16} />
          )}
          <span>{isPlaying ? "Memutar Audio..." : "Sentuh untuk Bunyikan"}</span>
        </button>
      </div>

      {/* Instruction Box */}
      <div className="mt-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-[2px_2px_0px_#F59E0B] flex gap-3">
        <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm font-bold text-amber-900 leading-relaxed">
          {material.instruction}
        </p>
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={onNext}
        className="mt-6 w-full py-4 px-6 rounded-2xl bg-[var(--border-color,#0284C7)] hover:bg-[#0284C7]/90 text-white font-display font-black text-base border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Lanjut</span>
        <ArrowRightSvg size={18} />
      </button>
    </div>
  );
}

export default ModelMaterialCard;
