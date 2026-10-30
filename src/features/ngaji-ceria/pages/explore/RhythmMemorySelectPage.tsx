import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import {
  RHYTHM_MEMORY_LEVELS,
  RhythmMemoryLevel,
} from "../../data/rhythmMemoryData";
import { ChevronRight, Sparkles, DrumSvg } from "@/components/ui/CustomIcons";
import { triggerBibiReaction } from "@/utils/bibiEvent";
import { soundManager } from "../../services/soundManager";

export default function RhythmMemorySelectPage() {
  const navigate = useNavigate();

  const handleSelectJilid = (level: RhythmMemoryLevel) => {
    triggerBibiReaction("play");
    soundManager.playSfx("pop");
    navigate(`/member/ngaji-ceria/rhythm-memory/${level.jilid}`);
  };

  return (
    <NgajiCeriaLayout
      title="Pilih Kemah Rhythm Memory"
      hideHeader={true}
      themeScope="lab-irama"
      onBack={() => navigate("/member/ngaji-ceria/training")}
    >
      {/* Latar Padang Rumput Savana (#FEF3C7) */}
      <div className="relative min-h-[100dvh] w-full bg-[#FEF3C7] overflow-x-hidden pb-32 select-none">
        {/* Pola Rumput & Cahaya Savana */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(#D97706 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Bukit Rumput Hijau Savana di Bawah */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-[#15803D] border-t-[4px] border-[#134E4A] z-0"
          style={{
            clipPath:
              "polygon(0% 35%, 25% 15%, 55% 35%, 85% 10%, 100% 25%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="relative z-20">
          {/* Header Eksplorasi Savana */}
          <ExploreHeader
            title="Kemah Rhythm Memory"
            subtitle="Asah ingatan kartu & ketuk irama nada di tenda savana!"
            onBack={() => navigate("/member/ngaji-ceria/training")}
            themeScope="lab-irama"
            themeColorClass="bg-[#D97706]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
          />

          {/* Banner Hero Api Unggun & Genderang Savana */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] p-5 sm:p-6 shadow-[6px_6px_0px_#451A03]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-[#15803D] border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03]">
                  <DrumSvg size={30} stroke="#FEF08A" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FEF08A] border-[2px] border-[#451A03] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#451A03] mb-1.5 shadow-[2px_2px_0px_#451A03]">
                    <Sparkles size={11} /> Irama Api Unggun Savana
                  </span>
                  <h1 className="font-display font-black text-lg sm:text-2xl text-[#FEF3C7] leading-tight">
                    Tartila Rhythm Memory
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-[#FDE68A] leading-snug mt-1">
                    Masuki tenda Jilid 1–6, dengarkan lantunan qari, dan ketuk
                    panah irama sesuai ketukan nada!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Grid 6 Tenda Kemah Jilid Rhythm Memory */}
          <section className="px-4 pt-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {RHYTHM_MEMORY_LEVELS.map((level, idx) => (
                <motion.div
                  key={level.jilid}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectJilid(level)}
                  className="group relative pt-11 cursor-pointer select-none transition-transform hover:-translate-y-1.5"
                >
                  {/* Bendera Kecil di Puncak Tenda */}
                  <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                    <div
                      className="px-2.5 py-0.5 bg-[#15803D] border-[2.5px] border-[#451A03] text-[9px] font-black text-[#FEF08A] uppercase"
                      style={{
                        clipPath: "polygon(0 0, 100% 20%, 85% 100%, 0 100%)",
                      }}
                    >
                      {level.bpm} BPM
                    </div>
                    <div className="w-1 h-3 bg-[#451A03]" />
                  </div>

                  {/* Atap Tenda Segitiga (Clip-Path) */}
                  <div
                    className="pointer-events-none absolute top-4 left-0 right-0 h-10 bg-[#451A03] z-20"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    }}
                  >
                    <div
                      className="w-full h-full bg-[#D97706]"
                      style={{
                        clipPath: "polygon(50% 14%, 96% 100%, 4% 100%)",
                      }}
                    />
                  </div>

                  {/* Badan Tenda Kemah */}
                  <div className="relative z-10 overflow-hidden rounded-b-2xl rounded-t-sm bg-[#FFFBEB] border-[4px] border-[#451A03] p-5 shadow-[6px_6px_0px_#451A03] flex flex-col justify-between h-full">
                    {/* Tirai Kiri & Kanan Tenda */}
                    <div
                      className="pointer-events-none absolute top-0 left-0 w-9 h-14 bg-[#D97706]/25"
                      style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                    />
                    <div
                      className="pointer-events-none absolute top-0 right-0 w-9 h-14 bg-[#D97706]/25"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-xl border-[2.5px] border-[#451A03] px-3 py-1 text-xs font-black uppercase text-[#FFFFFF] shadow-[2px_2px_0px_#451A03] ${level.badgeBg}`}
                        >
                          Kemah Jilid {level.jilid}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#FEF08A] border-[2px] border-[#451A03] px-2 py-0.5 text-[10px] font-black text-[#451A03]">
                          Tempo {level.bpm}
                        </span>
                      </div>

                      <h3 className="font-display font-black text-base sm:text-lg text-[#451A03] leading-snug mb-1">
                        {level.subtitle}
                      </h3>
                      <p className="text-xs text-[#78350F] font-bold line-clamp-2 mb-4 leading-relaxed">
                        {level.desc}
                      </p>
                    </div>

                    {/* Alas Pintu Tenda */}
                    <div className="flex items-center justify-between pt-3 border-t-[3px] border-dashed border-[#451A03]/30">
                      <span className="text-[11px] font-black text-[#15803D]">
                        ⛺ 12 Pos Irama
                      </span>
                      <div className="inline-flex items-center gap-1 rounded-xl bg-[#D97706] border-[2.5px] border-[#451A03] px-3 py-1 text-xs font-black text-[#FEF3C7] shadow-[2px_2px_0px_#451A03] group-hover:translate-x-1 transition-transform">
                        <span>Masuk Tenda</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
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
