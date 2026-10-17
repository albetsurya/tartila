import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  Pause,
  Volume2,
  Star,
  Sparkles,
} from "../../../../components/ui/FontAwesomeIcons";
import { JUZ_AMMA_SURAHS } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

export default function JuzAmmaStarsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();

  const handlePlay = (url: string) => {
    triggerBibiReaction("play");
    toggle(url);
  };

  const handleSelect = (number: number) => {
    triggerBibiReaction("click");
    setSelected(number);
  };

  return (
    <NgajiCeriaLayout
      title="Bintang Juz 'Amma"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="space-y-5 bg-[#F0FDF4] px-4 py-4 min-h-full rounded-t-3xl pb-32">
        {/* Hero Banner (Sticker Style) */}
        <section className="relative overflow-hidden rounded-[24px] bg-[#134E4A] p-5 text-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#FF6B6B]">
          {/* Ornamen */}
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full border-[6px] border-white/5" />
          <div className="absolute right-4 top-4 text-[#FF6B6B] rotate-12 opacity-80">
            <Star size={48} fill="currentColor" />
          </div>

          <div className="relative z-10 max-w-[80%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] border border-white/20 backdrop-blur-sm mb-2">
              <Sparkles size={12} /> Misi Hafalan
            </span>
            <h2 className="mt-1 font-display text-xl font-black leading-tight">
              Kumpulkan bintang dari setiap surah
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block rounded-md bg-[#FF6B6B] px-2.5 py-1 text-[10px] font-black text-white border-2 border-[#134E4A]">
                37 Surah
              </span>
            </div>
          </div>
        </section>

        {/* Surah Grid (Sticker Cards) */}
        <section className="grid grid-cols-2 gap-3">
          {JUZ_AMMA_SURAHS.map((surah) => {
            const isSelected = selected === surah.number;
            const isSurahPlaying =
              isPlaying && currentAudioUrl === surah.audioUrl;

            return (
              <motion.div
                key={surah.number}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(surah.number)}
                className={`relative flex flex-col justify-between rounded-2xl p-3 border-[3px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#FFF0F0] border-[#FF6B6B] shadow-[3px_3px_0px_#134E4A]"
                    : "bg-white border-[#134E4A] shadow-[3px_3px_0px_#134E4A]"
                }`}
              >
                {/* Header Kartu: Nomor & Nama */}
                <div className="flex items-start gap-2 mb-2">
                  <span
                    className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-2 ${
                      isSelected
                        ? "bg-[#FF6B6B] text-white border-[#134E4A]"
                        : "bg-[#F0FDF4] text-[#0D9488] border-[#134E4A]"
                    }`}
                  >
                    {surah.number}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="font-display font-black text-sm text-[#134E4A] truncate leading-tight">
                      {surah.name}
                    </p>
                    <p className="text-[10px] font-bold text-[#134E4A]/60 mt-0.5">
                      {surah.ayah} ayat
                    </p>
                  </div>
                </div>

                {/* Tombol Audio (Sticker Style) */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Mencegah klik kartu saat menekan tombol audio
                      handlePlay(surah.audioUrl);
                    }}
                    aria-label={
                      isSurahPlaying
                        ? `Jeda ${surah.name}`
                        : `Putar ${surah.name}`
                    }
                    className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-black border-2 transition-all active:translate-y-[1px] active:shadow-none ${
                      isSurahPlaying
                        ? "bg-[#FF6B6B] text-white border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                        : "bg-white text-[#134E4A] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                    }`}
                  >
                    {isSurahPlaying ? (
                      <Pause size={12} />
                    ) : (
                      <Volume2 size={12} />
                    )}
                    {isSurahPlaying ? "Jeda" : "Putar"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </section>

        <div className="h-32" aria-hidden="true" />
      </div>
    </NgajiCeriaLayout>
  );
}
