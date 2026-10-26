import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import { ARENA_KARTU_DATA, ArenaKartuLevel } from "../../data/arenaKartuData";
import { ChevronRight, Sparkles, BookOpen, GameCardSvg } from "@/components/ui/CustomIcons";
import { triggerBibiReaction } from "@/utils/bibiEvent";

export default function ArenaKartuSelectPage() {
  const navigate = useNavigate();

  const handleSelectJilid = (level: ArenaKartuLevel) => {
    triggerBibiReaction("play");
    navigate(`/member/ngaji-ceria/arena-kartu/${level.jilid}`);
  };

  return (
    <NgajiCeriaLayout
      title="Pilih Jilid Latihan"
      hideHeader={true}
      themeScope="arena-kartu"
      onBack={() => navigate("/member/ngaji-ceria/training")}
    >
      {/* Background Felt Hijau Kasino */}
      <div className="relative min-h-[100dvh] w-full bg-[#065F46] overflow-x-hidden pb-32">
        {/* Efek lampu meja hijau */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 25%, #10B98122 0, transparent 65%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            boxShadow: "inset 0 0 0 10px #B45309, inset 0 0 0 14px #78350F",
          }}
        />

        <div className="relative z-20">
          {/* Header Terstandarisasi Arena Kartu */}
          <ExploreHeader
            title="Pilih Jilid Latihan"
            subtitle="Tantang ingatanmu mencocokkan kartu Arab!"
            onBack={() => navigate("/member/ngaji-ceria/training")}
            themeScope="arena-kartu"
            themeColorClass="bg-[#065F46]"
            borderColorClass="border-[#B45309]"
            shadowClass="shadow-[0_4px_0px_#78350F]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#7C2D12] border-[#B45309] shadow-[2px_2px_0px_#78350F] hover:bg-[#FDE68A]"
          />

          {/* Banner Hero Arena Kartu */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-[#FEF3C7] border-[3px] border-[#B45309] p-4 sm:p-5 shadow-[4px_4px_0px_#78350F]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[#065F46] border-2 border-[#134E4A] text-[#FEF3C7] shadow-[2px_2px_0px_#134E4A]">
                  <GameCardSvg size={28} stroke="#FEF3C7" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#B45309] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#FEF3C7] mb-1">
                    <Sparkles size={11} /> Memory Game Tilawati
                  </span>
                  <h1 className="font-display font-black text-lg sm:text-2xl text-[#7C2D12] leading-tight">
                    Arena Kartu Memori
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-[#78350F]/90 leading-snug mt-0.5">
                    Pilih jilid yang ingin kamu latih. Balik dan cocokkan dua kartu bertuliskan potongan ayat yang sama!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Grid 6 Kartu Pilihan Jilid */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {ARENA_KARTU_DATA.map((level, idx) => (
                <motion.div
                  key={level.jilid}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.025, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectJilid(level)}
                  className={`group relative flex flex-col justify-between rounded-2xl ${level.cardBg} border-[3.5px] border-[#134E4A] p-4 sm:p-5 shadow-[4px_4px_0px_#134E4A] hover:shadow-[6px_6px_0px_#134E4A] transition-all cursor-pointer overflow-hidden select-none`}
                >
                  {/* Bagian Atas: Badge Jilid & Preview Text */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg ${level.badgeBg} text-white px-2.5 py-1 text-xs font-black shadow-xs`}
                      >
                        <BookOpen size={12} /> Jilid {level.jilid}
                      </span>
                      <span className="text-[10px] font-black text-[#134E4A]/60 uppercase tracking-wider">
                        {level.texts.length} Potongan
                      </span>
                    </div>

                    <h2 className="font-display font-black text-lg text-[#134E4A] leading-tight mt-1">
                      {level.title}
                    </h2>
                    <p className="text-[11px] font-bold text-[#134E4A]/80 leading-snug mt-0.5">
                      {level.subtitle}
                    </p>
                    <p className="text-[10px] font-medium text-[#134E4A]/65 leading-relaxed mt-2 line-clamp-2">
                      {level.desc}
                    </p>
                  </div>

                  {/* Preview Potongan Teks Arab Khas Jilid Ini */}
                  <div className="my-3 py-2 px-2.5 rounded-xl bg-white/70 border-2 border-[#134E4A]/20 flex items-center justify-center gap-2 overflow-hidden">
                    {level.texts.slice(0, 3).map((txt, i) => (
                      <span
                        key={i}
                        className="font-arabic font-bold text-base text-[#134E4A] px-1.5 py-0.5 rounded bg-white border border-[#134E4A]/10 shadow-2xs shrink-0"
                      >
                        {txt}
                      </span>
                    ))}
                    {level.texts.length > 3 && (
                      <span className="text-[10px] font-bold text-[#134E4A]/50 shrink-0">
                        +{level.texts.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Tombol Aksi Mulai */}
                  <div className="pt-2 border-t border-[#134E4A]/20 flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#134E4A] uppercase tracking-wider">
                      Mulai Main
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#134E4A] text-white shadow-xs group-hover:translate-x-0.5 transition-transform">
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
