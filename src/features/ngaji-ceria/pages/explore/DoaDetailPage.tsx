import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
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
    "flex items-center justify-center gap-2 rounded-xl border-[3px] border-[#B45309] py-3 text-sm font-black shadow-[3px_3px_0px_#78350F] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const handleBack = () => {
    navigate("/member/ngaji-ceria/explore/doa");
  };

  return (
    <NgajiCeriaLayout
      title={doa.title}
      hideHeader={true}
      themeScope="doa"
      onBack={handleBack}
    >
      <ThemedHeader
        title={doa.title}
        onBack={handleBack}
        themeColorClass="bg-[#78350F] border-b-[3px] border-[#451A03]"
        textColorClass="text-[#FDE68A]"
        statVariant="wood"
        statBgClass="bg-[#B45309]"
        statTextClass="text-[#FBBF24]"
        backClass="bg-[#92400E] text-[#FDE68A] border-2 border-[#451A03]"
      >
        <div className="absolute left-3 right-3 top-1 h-2 flex justify-between z-20">
          <span className="w-2 h-2 rounded-full bg-[#FCA5A5] border border-[#450A0A]" />
          <span className="w-2 h-2 rounded-full bg-[#FCA5A5] border border-[#450A0A]" />
        </div>
      </ThemedHeader>

      <div className="space-y-5 bg-[#FFFBEB] px-4 py-4 min-h-full rounded-t-3xl pb-32 relative">
        {/* Pola papan kayu halus */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #78350F 0px, #78350F 1px, transparent 1px, transparent 20px)",
          }}
        />

        <div className="relative z-10 space-y-5">
          {/* Title Header (Papan Kayu Emas) */}
          <div className="flex items-center gap-3 bg-[#FEF3C7] p-3.5 rounded-2xl border-[3px] border-[#B45309] shadow-[3px_3px_0px_#78350F]">
            <div className="w-10 h-10 rounded-xl bg-[#FDE68A] border-2 border-[#B45309] flex items-center justify-center shrink-0 shadow-sm">
              <Star size={20} className="text-[#B45309] fill-[#F59E0B]" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-black text-lg text-[#78350F] leading-tight truncate">
                {doa.title}
              </h2>
              <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider text-[#92400E] bg-[#B45309]/15 px-2 py-0.5 rounded-md border border-[#B45309]/30">
                {doa.category}
              </span>
            </div>
          </div>

          {/* Arabic Text Box (Peti Kayu Harta Karun) */}
          <div className="rounded-[24px] bg-[#FEF3C7] border-[3px] border-[#B45309] p-6 shadow-[4px_4px_0px_#78350F]">
            <p
              className="font-arabic text-[32px] text-right leading-[2.2] text-[#78350F]"
              dir="rtl"
            >
              {doa.arabic}
            </p>
          </div>

          {/* Latin & Translation */}
          <div className="space-y-3">
            <div className="bg-[#FEF9C3] p-3.5 rounded-xl border-2 border-[#B45309]/30 shadow-sm">
              <p className="text-sm font-bold text-[#92400E] italic">
                {doa.latin}
              </p>
            </div>
            <div className="bg-[#FFFBEB] p-4 rounded-xl border-2 border-[#B45309] shadow-[2px_2px_0px_#78350F]">
              <p className="text-sm font-semibold text-[#78350F] leading-relaxed">
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
                  ? "bg-[#D97706] text-white shadow-[3px_3px_0px_#78350F]"
                  : "bg-[#B45309] text-white shadow-[3px_3px_0px_#78350F] hover:bg-[#92400E]"
              }`}
            >
              {isDoaPlaying ? <Pause size={18} /> : <Volume2 size={18} />}
              {isDoaPlaying ? "Jeda Audio" : "Dengarkan Doa"}
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className={`${btnBaseStyle} flex-1 bg-[#FEF3C7] text-[#78350F] hover:bg-[#FDE68A]`}
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
                className={`${btnBaseStyle} flex-1 bg-[#FEF3C7] text-[#78350F] hover:bg-[#FDE68A]`}
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
              className={`${btnBaseStyle} flex-1 bg-[#FEF3C7] text-[#78350F] text-xs hover:bg-[#FDE68A]`}
            >
              <ChevronLeft size={16} />
              Sebelumnya
            </button>
            <button
              type="button"
              disabled={!hasNext}
              onClick={() => goTo(index + 1)}
              className={`${btnBaseStyle} flex-1 bg-[#FEF3C7] text-[#78350F] text-xs hover:bg-[#FDE68A]`}
            >
              Selanjutnya
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="h-20" aria-hidden="true" />
      </div>
    </NgajiCeriaLayout>
  );
}
