import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Pause,
  Share2,
  Star,
  Volume2,
} from "../../../../components/ui/CustomIcons";
import { DOA_LIST, DOA_AUDIO_PLACEHOLDER } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { getDoaAudioUrl } from "../../services/doaService";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

export default function DoaDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();

  const index = useMemo(() => {
    const found = DOA_LIST.findIndex((doa) => doa.id === id);
    return found === -1 ? 0 : found;
  }, [id]);

  const doa = DOA_LIST[index];
  const hasPrev = index > 0;
  const hasNext = index < DOA_LIST.length - 1;

  const [audioSource, setAudioSource] = useState<string>(
    doa?.audioUrl || DOA_AUDIO_PLACEHOLDER,
  );

  useEffect(() => {
    let isMounted = true;
    if (doa) {
      setAudioSource(doa.audioUrl || DOA_AUDIO_PLACEHOLDER);
      getDoaAudioUrl(doa.id, doa.title).then((url) => {
        if (isMounted && url) {
          setAudioSource(url);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [doa]);

  const isDoaPlaying = isPlaying && currentAudioUrl === audioSource;

  const goTo = (target: number) => {
    triggerBibiReaction("click");
    navigate(`/member/ngaji-ceria/explore/doa/${DOA_LIST[target].id}`);
  };

  const handlePlay = () => {
    if (!audioSource) return;
    triggerBibiReaction(isDoaPlaying ? "click" : "play");
    toggle(audioSource);
  };

  const handleCopy = async () => {
    triggerBibiReaction("success");
    try {
      await navigator.clipboard.writeText(
        `${doa.arabic}\n\n${doa.latin}\n\n${doa.translation}`,
      );
    } catch {
      /* clipboard tidak tersedia */
    }
  };

  const btnBaseStyle =
    "flex items-center justify-center gap-2 rounded-xl border-[3px] border-[#134E4A] py-3 text-sm font-black shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <NgajiCeriaLayout
      title="Detail Doa"
      onBack={() => navigate("/member/ngaji-ceria/explore/doa")}
    >
      <div className="space-y-5 bg-[#F0FDF4] px-4 py-4 min-h-full rounded-t-3xl pb-32">
        {/* Title Header (Sticker Style) */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] border-2 border-[#FF6B6B]/30 flex items-center justify-center shrink-0">
            <Star size={20} className="text-[#FF6B6B] fill-[#FF6B6B]" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-black text-lg text-[#134E4A] leading-tight truncate">
              {doa.title}
            </h2>
            <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded-md border border-[#0D9488]/20">
              {doa.category}
            </span>
          </div>
        </div>

        {/* Arabic Text Box */}
        <div className="rounded-[24px] bg-white border-[3px] border-[#134E4A] p-6 shadow-[4px_4px_0px_#134E4A]">
          <p
            className="font-arabic text-[32px] text-right leading-[2.2] text-[#134E4A]"
            dir="rtl"
          >
            {doa.arabic}
          </p>
        </div>

        {/* Latin & Translation */}
        <div className="space-y-3">
          <div className="bg-white/60 p-3 rounded-xl border-2 border-[#0D9488]/20">
            <p className="text-sm font-bold text-[#0D9488] italic">
              {doa.latin}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border-[2px] border-[#134E4A]/20 shadow-[2px_2px_0px_#134E4A]/10">
            <p className="text-sm font-semibold text-[#134E4A] leading-relaxed">
              {doa.translation}
            </p>
          </div>
        </div>

        {/* Actions (Sticker Buttons) */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={handlePlay}
            className={`${btnBaseStyle} w-full transition-colors ${
              isDoaPlaying
                ? "bg-[#0284C7] text-white shadow-[3px_3px_0px_#134E4A]"
                : "bg-[#0D9488] text-white shadow-[3px_3px_0px_#134E4A]"
            }`}
          >
            {isDoaPlaying ? <Pause size={18} /> : <Volume2 size={18} />}
            {isDoaPlaying ? "Jeda Audio" : "Dengarkan Doa"}
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className={`${btnBaseStyle} flex-1 bg-white text-[#134E4A]`}
            >
              <Copy size={16} />
              Salin
            </button>
            <button
              type="button"
              onClick={() => {
                triggerBibiReaction("click");
                if (navigator.share) {
                  navigator.share({
                    title: doa.title,
                    text: `${doa.arabic}\n\n${doa.latin}\n\n${doa.translation}`,
                  }).catch(() => {});
                } else {
                  handleCopy();
                }
              }}
              className={`${btnBaseStyle} flex-1 bg-white text-[#134E4A]`}
            >
              <Share2 size={16} />
              Bagikan
            </button>
          </div>
        </div>

        {/* Prev / Next (Sticker Buttons) */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => goTo(index - 1)}
            className={`${btnBaseStyle} flex-1 bg-white text-[#134E4A] text-xs`}
          >
            <ChevronLeft size={16} />
            Sebelumnya
          </button>
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => goTo(index + 1)}
            className={`${btnBaseStyle} flex-1 bg-white text-[#134E4A] text-xs`}
          >
            Selanjutnya
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="h-32" aria-hidden="true" />
      </div>
    </NgajiCeriaLayout>
  );
}
