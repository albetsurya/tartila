import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
  Star,
  Volume2,
} from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
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
    "flex items-center justify-center gap-2 rounded-xl border-[3.5px] border-[#451A03] py-3 text-sm font-black shadow-[4px_4px_0px_#451A03] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

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
        themeColorClass="bg-[#D97706] border-b-[4px] border-[#451A03]"
        textColorClass="text-[#FEF3C7]"
        statVariant="wood"
        statBgClass="bg-[#78350F]"
        statTextClass="text-[#FACC15]"
        backClass="bg-[#FEF3C7] text-[#451A03] border-[2.5px] border-[#451A03]"
      />

      {/* Latar Pasir Oase Gurun (#FDE68A) */}
      <div className="min-h-[100dvh] bg-[#FDE68A] px-4 py-6 pb-36 relative overflow-x-hidden">
        {/* Tekstur Butiran Pasir Gurun */}
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(#B45309 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Bukit Pasir & Mata Air Oase di Bawah */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-36 bg-[#F59E0B] border-t-[4px] border-[#451A03] z-0"
          style={{
            clipPath:
              "polygon(0% 35%, 30% 10%, 65% 30%, 100% 5%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Header Kubah Oase & Hiasan Bulan Sabit */}
          <div className="relative pt-4">
            {/* Ornamen Bulan Sabit Emas di Pojok Kanan Atas */}
            <div className="pointer-events-none absolute -top-2 right-4 z-20 flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1E3A8A] border-[3.5px] border-[#451A03] shadow-[3px_3px_0px_#451A03] rotate-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.5 14.5C19.2 15.1 17.7 15.5 16.1 15.5C10.9 15.5 6.7 11.3 6.7 6.1C6.7 4.8 7 3.6 7.5 2.5C4.5 4.1 2.5 7.2 2.5 10.8C2.5 16 6.7 20.2 11.9 20.2C15.8 20.2 19.1 17.8 20.5 14.5Z"
                  fill="#FACC15"
                  stroke="#451A03"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="17" cy="6" r="1.5" fill="#FEF08A" />
              </svg>
            </div>

            <div className="flex items-center gap-3.5 bg-[#FEF3C7] p-4 pr-16 rounded-2xl border-[4px] border-[#451A03] shadow-[5px_5px_0px_#451A03]">
              <div className="w-12 h-12 rounded-xl bg-[#0284C7] border-[3px] border-[#451A03] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#451A03]">
                <Star size={22} className="text-[#FEF08A] fill-[#FACC15]" />
              </div>
              <div className="min-w-0">
                <span className="inline-block mb-1 text-[10px] font-black uppercase tracking-wider text-[#FEF3C7] bg-[#78350F] px-2.5 py-0.5 rounded-md border-[2px] border-[#451A03]">
                  Oase • {doa.category}
                </span>
                <h2 className="font-display font-black text-lg sm:text-xl text-[#451A03] leading-tight">
                  {doa.title}
                </h2>
              </div>
            </div>
          </div>

          {/* GULUNGAN PERKAMEN KUNO (SCROLL) DENGAN SILINDER KAYU ATAS & BAWAH */}
          <div className="relative py-2">
            {/* Silinder Kayu Atas Perkamen */}
            <div className="relative z-20 flex items-center">
              <div className="h-8 w-5 rounded-l-full bg-[#451A03] border-[3px] border-[#451A03]" />
              <div className="h-6 flex-1 rounded-full bg-[#78350F] border-y-[4px] border-[#451A03] shadow-[0_3px_0px_#451A03] flex items-center justify-between px-4">
                <span className="w-8 h-1.5 rounded-full bg-[#D97706]" />
                <span className="w-8 h-1.5 rounded-full bg-[#D97706]" />
              </div>
              <div className="h-8 w-5 rounded-r-full bg-[#451A03] border-[3px] border-[#451A03]" />
            </div>

            {/* Lembaran Perkamen Kuno Doa */}
            <div className="relative z-10 mx-3 -my-1 bg-[#FFFBEB] border-x-[4px] border-[#451A03] px-5 py-7 shadow-[6px_6px_0px_#451A03] space-y-5 overflow-hidden">
              {/* Hiasan Bulan Sabit Kecil di Sudut Perkamen */}
              <div className="flex items-center justify-between border-b-[2.5px] border-dashed border-[#D97706] pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B45309]">
                  ✦ Perkamen Oase Gurun ✦
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 14.5C17.8 15.1 16.4 15.5 14.8 15.5C9.9 15.5 6 11.6 6 6.7C6 5.5 6.2 4.4 6.7 3.5C4.2 5 2.5 7.7 2.5 11C2.5 15.9 6.4 19.8 11.3 19.8C14.8 19.8 17.9 17.6 19 14.5Z"
                    fill="#D97706"
                    stroke="#451A03"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="rounded-2xl bg-[#FEF3C7] border-[3px] border-[#451A03] p-5 shadow-[3px_3px_0px_#451A03]">
                <p
                  className="font-arabic text-[30px] sm:text-[34px] text-right leading-[2.2] text-[#451A03]"
                  dir="rtl"
                >
                  {doa.arabic}
                </p>
              </div>

              <div className="bg-[#FDE68A] p-4 rounded-xl border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03]">
                <p className="text-xs sm:text-sm font-black text-[#78350F] italic leading-relaxed">
                  "{doa.latin}"
                </p>
              </div>

              <div className="bg-[#FFFFFF] p-4 rounded-xl border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03]">
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#0284C7] mb-1">
                  Makna Air Kehidupan (Artinya):
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#451A03] leading-relaxed">
                  {doa.translation}
                </p>
              </div>
            </div>

            {/* Silinder Kayu Bawah Perkamen */}
            <div className="relative z-20 flex items-center">
              <div className="h-8 w-5 rounded-l-full bg-[#451A03] border-[3px] border-[#451A03]" />
              <div className="h-6 flex-1 rounded-full bg-[#78350F] border-y-[4px] border-[#451A03] shadow-[0_4px_0px_#451A03] flex items-center justify-between px-4">
                <span className="w-8 h-1.5 rounded-full bg-[#D97706]" />
                <span className="w-8 h-1.5 rounded-full bg-[#D97706]" />
              </div>
              <div className="h-8 w-5 rounded-r-full bg-[#451A03] border-[3px] border-[#451A03]" />
            </div>
          </div>

          {/* Tombol Aksi Audio & Bagikan */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handlePlay}
              className={`${btnBaseStyle} w-full ${
                isDoaPlaying
                  ? "bg-[#15803D] text-[#FFFFFF]"
                  : "bg-[#0284C7] text-[#FFFFFF] hover:bg-[#0369A1]"
              }`}
            >
              {isDoaPlaying ? (
                <EqualizerIcon
                  isPlaying={true}
                  size={18}
                  barClassName="bg-[#FFFFFF]"
                />
              ) : (
                <Volume2 size={18} />
              )}
              {isDoaPlaying ? "Jeda Audio Doa" : "Dengarkan Lantunan Doa"}
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className={`${btnBaseStyle} flex-1 bg-[#FEF08A] text-[#451A03] hover:bg-[#FDE047]`}
              >
                <Copy size={16} />
                Salin Perkamen
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerBibiReaction("click");
                  if (navigator.share) {
                    navigator
                      .share({
                        title: doa.title,
                        text: `${doa.arabic}\n\n${doa.latin}\n\n${doa.translation}`,
                      })
                      .catch(() => {});
                  } else {
                    handleCopy();
                  }
                }}
                className={`${btnBaseStyle} flex-1 bg-[#BAE6FD] text-[#0C4A6E] hover:bg-[#7DD3FC]`}
              >
                <Share2 size={16} />
                Bagikan
              </button>
            </div>
          </div>

          {/* Navigasi Sebelumnya / Selanjutnya */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!hasPrev}
              onClick={() => goTo(index - 1)}
              className={`${btnBaseStyle} flex-1 bg-[#FEF3C7] text-[#451A03] text-xs hover:bg-[#FDE68A]`}
            >
              <ChevronLeft size={16} />
              Doa Sebelumnya
            </button>
            <button
              type="button"
              disabled={!hasNext}
              onClick={() => goTo(index + 1)}
              className={`${btnBaseStyle} flex-1 bg-[#FEF3C7] text-[#451A03] text-xs hover:bg-[#FDE68A]`}
            >
              Doa Selanjutnya
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
