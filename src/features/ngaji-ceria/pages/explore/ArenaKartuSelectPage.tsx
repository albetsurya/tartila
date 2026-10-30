import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import { ARENA_KARTU_DATA, ArenaKartuLevel } from "../../data/arenaKartuData";
import {
  ChevronRight,
  Sparkles,
  BookOpen,
  GameCardSvg,
} from "@/components/ui/CustomIcons";
import { triggerBibiReaction } from "@/utils/bibiEvent";

export default function ArenaKartuSelectPage() {
  const navigate = useNavigate();

  const handleSelectJilid = (level: ArenaKartuLevel) => {
    triggerBibiReaction("play");
    navigate(`/member/ngaji-ceria/arena-kartu/${level.jilid}`);
  };

  return (
    <NgajiCeriaLayout
      title="Pilih Kemah Jilid"
      hideHeader={true}
      themeScope="arena-kartu"
      onBack={() => navigate("/member/ngaji-ceria/training")}
    >
      {/* Background Padang Rumput Savana */}
      <div className="relative min-h-[100dvh] w-full bg-[#FEF3C7] overflow-x-hidden pb-36 select-none">
        {/* Ornamen Bintik Padang Savana */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(#D97706 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Siluet Bukit Savana Hijau di Bawah */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 bg-[#15803D] border-t-[4px] border-[#134E4A] z-0"
          style={{
            clipPath:
              "polygon(0% 40%, 25% 15%, 55% 35%, 80% 10%, 100% 30%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="relative z-20">
          <ExploreHeader
            title="Kemah Savana Jilid"
            subtitle="Pilih tenda ekspedisi Jilid 1–6 di padang savana!"
            onBack={() => navigate("/member/ngaji-ceria/training")}
            themeScope="arena-kartu"
            themeColorClass="bg-[#D97706]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
          />

          {/* Banner Pos Induk Savana & Api Unggun */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] p-5 sm:p-6 shadow-[6px_6px_0px_#451A03]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-[#D97706] border-[3px] border-[#451A03] text-[#FEF3C7] shadow-[3px_3px_0px_#451A03] -rotate-3">
                  <GameCardSvg size={32} stroke="#FEF08A" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FEF08A] border-[2px] border-[#451A03] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#451A03] mb-1.5 shadow-[2px_2px_0px_#451A03]">
                    <Sparkles size={11} /> Ekspedisi Padang Savana
                  </span>
                  <h1 className="font-display font-black text-xl sm:text-2xl text-[#FEF3C7] leading-tight">
                    Perkemahan Kartu Tilawati
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-[#FDE68A] leading-snug mt-1">
                    Masuki tenda kemah Jilid 1 hingga 6 dan nyalakan api
                    semangat ngajimu hari ini!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Grid 6 Tenda Kemah Jilid */}
          <section className="px-4 pt-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {ARENA_KARTU_DATA.map((level, idx) => (
                <motion.div
                  key={level.jilid}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectJilid(level)}
                  className="group relative pt-11 cursor-pointer select-none"
                >
                  {/* Bendera Puncak Tenda */}
                  <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                    <div
                      className="px-2 py-0.5 bg-[#EF4444] border-[2.5px] border-[#451A03] text-[9px] font-black text-[#FFFFFF] uppercase shadow-[2px_2px_0px_#451A03]"
                      style={{
                        clipPath: "polygon(0 0, 100% 15%, 85% 100%, 0 100%)",
                      }}
                    >
                      POS {level.jilid}
                    </div>
                    <div className="w-1 h-3 bg-[#451A03]" />
                  </div>

                  {/* ATAP KANVAS TENDA SEGITIGA (CLIP-PATH) */}
                  <div
                    className="pointer-events-none absolute top-4 left-0 right-0 h-10 bg-[#451A03] z-20"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    }}
                  >
                    <div
                      className="w-full h-full bg-[#D97706]"
                      style={{
                        clipPath: "polygon(50% 12%, 96% 100%, 4% 100%)",
                      }}
                    />
                  </div>

                  {/* Badan Tenda Kemah */}
                  <div
                    className={`relative z-10 flex h-full flex-col justify-between rounded-b-2xl rounded-t-sm ${level.cardBg} border-[4px] border-[#451A03] p-5 shadow-[6px_6px_0px_#451A03] transition-all overflow-hidden`}
                  >
                    {/* Lipatan Tirai Tenda di Kiri & Kanan Atas */}
                    <div
                      className="pointer-events-none absolute top-0 left-0 w-10 h-16 bg-[#78350F]/20"
                      style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                    />
                    <div
                      className="pointer-events-none absolute top-0 right-0 w-10 h-16 bg-[#78350F]/20"
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                    />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-xl ${level.badgeBg} text-[#FFFFFF] border-[2.5px] border-[#451A03] px-3 py-1 text-xs font-black shadow-[2px_2px_0px_#451A03]`}
                        >
                          <BookOpen size={13} /> Kemah Jilid {level.jilid}
                        </span>
                        <span className="rounded-lg bg-[#FEF08A] border-[2px] border-[#451A03] px-2 py-0.5 text-[10px] font-black text-[#451A03] uppercase tracking-wider">
                          {level.texts.length} Tenda
                        </span>
                      </div>

                      <h2 className="font-display font-black text-xl text-[#451A03] leading-tight">
                        {level.title}
                      </h2>
                      <p className="text-xs font-extrabold text-[#15803D] leading-snug mt-0.5">
                        {level.subtitle}
                      </p>
                      <p className="text-[11px] font-bold text-[#451A03]/80 leading-relaxed mt-2 line-clamp-2">
                        {level.desc}
                      </p>
                    </div>

                    {/* Preview Materi di atas Papan Kayu Kecil */}
                    <div className="my-4 py-2.5 px-3 rounded-xl bg-[#FFFBEB] border-[3px] border-[#451A03] shadow-[3px_3px_0px_#451A03] flex items-center justify-center gap-2 overflow-hidden">
                      {level.texts.slice(0, 3).map((txt, i) => (
                        <span
                          key={i}
                          className="font-arabic font-bold text-base text-[#451A03] px-2 py-0.5 rounded-lg bg-[#FEF08A] border-[2px] border-[#451A03] shrink-0"
                        >
                          {txt}
                        </span>
                      ))}
                      {level.texts.length > 3 && (
                        <span className="text-[11px] font-black text-[#451A03] shrink-0">
                          +{level.texts.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Papan Penunjuk Masuk Tenda */}
                    <div className="pt-3 border-t-[3px] border-dashed border-[#451A03]/30 flex items-center justify-between">
                      <span className="text-xs font-black text-[#451A03] uppercase tracking-wider">
                        Masuki Kemah Ini
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#15803D] text-[#FEF08A] border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] group-hover:translate-x-1 transition-transform">
                        <ChevronRight size={16} />
                      </span>
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
