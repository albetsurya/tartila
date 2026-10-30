import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ExploreHeader } from "../../components/ExploreHeader";
import {
  ChevronRight,
  Key,
  Sparkles,
} from "../../../../components/ui/CustomIcons";
import { TAJWID_RULES } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

const SIGNPOST_PALETTES = [
  { bg: "bg-[#FEF3C7]", badge: "bg-[#D97706]", text: "text-[#451A03]" },
  { bg: "bg-[#FDE68A]", badge: "bg-[#15803D]", text: "text-[#451A03]" },
  { bg: "bg-[#FFFBEB]", badge: "bg-[#B45309]", text: "text-[#451A03]" },
  { bg: "bg-[#DCFCE7]", badge: "bg-[#166534]", text: "text-[#14532D]" },
];

export default function TajwidSecretPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/member/ngaji-ceria/map");
  };

  const handleNavigate = (id: string) => {
    triggerBibiReaction("click");
    navigate(`/member/ngaji-ceria/explore/tajwid/${id}`);
  };

  return (
    <NgajiCeriaLayout
      title="Hutan Rahasia Tajwid"
      hideHeader={true}
      themeScope="tajwid"
      onBack={handleBack}
    >
      {/* Background Hijau Hutan Gelap (#166534) */}
      <div className="min-h-[100dvh] w-full bg-[#166534] relative overflow-x-hidden pb-32 select-none">
        {/* Ornamen Rimbun Daun Hutan */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(#4ADE80 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Siluet Semak Rimba di Bawah */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-[#14532D] border-t-[4px] border-[#052E16] z-0"
          style={{
            clipPath:
              "polygon(0% 40%, 18% 15%, 38% 35%, 60% 10%, 82% 35%, 100% 15%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="relative z-10">
          {/* HEADER: Balok Kayu Rimba */}
          <ExploreHeader
            title="Hutan Rimba Tajwid"
            subtitle="Papan Penunjuk Arah Kaidah di Pohon Raksasa"
            onBack={handleBack}
            themeScope="tajwid"
            themeColorClass="bg-[#78350F]"
            borderColorClass="border-[#451A03]"
            shadowClass="shadow-[0_4px_0px_#451A03]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF08A] text-[#451A03] border-[#451A03] shadow-[3px_3px_0px_#451A03] hover:bg-[#FDE68A]"
          />

          {/* HERO: Papan Tulis Kayu Gantung di Dahan Pohon Utama */}
          <div className="px-4 pt-6 max-w-3xl mx-auto">
            <section className="relative rounded-3xl bg-[#78350F] border-[4px] border-[#451A03] shadow-[6px_6px_0px_#451A03] p-5 sm:p-6 overflow-hidden">
              {/* Hiasan Daun Rimba di Sudut Atas */}
              <div className="pointer-events-none absolute -top-2 -left-2 w-12 h-12 rounded-br-3xl bg-[#22C55E] border-r-[3px] border-b-[3px] border-[#451A03]" />
              <div className="pointer-events-none absolute -bottom-2 -right-2 w-12 h-12 rounded-tl-3xl bg-[#22C55E] border-l-[3px] border-t-[3px] border-[#451A03]" />

              <div className="relative z-10 max-w-[84%] pl-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FEF08A] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#451A03] border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] mb-2.5">
                  <Sparkles size={12} /> Kompas Hutan Tajwid
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-black leading-tight text-[#FEF3C7]">
                  Ikuti Papan Penunjuk Arah di Batang Pohon!
                </h2>
                <p className="mt-1.5 text-xs font-bold text-[#FDE68A] leading-relaxed">
                  Setiap papan kayu yang dipaku pada pohon rimba ini menunjuk ke
                  rahasia dengung, pantulan, dan panjang bacaan Al-Qur'an.
                </p>
              </div>
            </section>
          </div>

          {/* POHON RAKSASA DENGAN PAPAN PENUNJUK ARAH (SIGNPOSTS) */}
          <div className="px-4 pt-10 max-w-3xl mx-auto">
            <div className="relative pt-8 pb-10">
              {/* Mahkota Daun Rimbun Pohon di Puncak Batang */}
              <div className="relative z-10 mx-auto -mb-4 w-56 h-14 rounded-full bg-[#22C55E] border-[4px] border-[#451A03] shadow-[4px_4px_0px_#451A03] flex items-center justify-center">
                <span className="font-display font-black text-xs uppercase tracking-wider text-[#14532D]">
                  🌳 Pohon Kaidah ({TAJWID_RULES.length} Misi)
                </span>
              </div>

              {/* BATANG POHON KAYU VERTIKAL DI TENGAH */}
              <div className="pointer-events-none absolute top-6 bottom-0 left-1/2 -translate-x-1/2 w-12 sm:w-16 bg-[#78350F] border-x-[4px] border-[#451A03] z-0" />

              {/* Deretan Papan Penunjuk Arah (Signposts) yang Dipaku ke Pohon */}
              <div className="relative z-10 space-y-6 pt-4">
                {TAJWID_RULES.map((rule, index) => {
                  const palette =
                    SIGNPOST_PALETTES[index % SIGNPOST_PALETTES.length];
                  const pointRight = index % 2 === 0;
                  const tiltClass = pointRight
                    ? "rotate-[0.8deg]"
                    : "-rotate-[0.8deg]";

                  return (
                    <div
                      key={rule.id}
                      className="relative flex items-center justify-center"
                    >
                      {/* Paku Besi Besar di Tengah Batang Pohon */}
                      <span
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-30 w-5 h-5 rounded-full bg-[#94A3B8] border-[3px] border-[#451A03] shadow-[2px_2px_0px_#451A03]"
                        aria-hidden="true"
                      />

                      {/* Bungkus Luar Drop-Shadow Neo-Brutalism untuk Signpost */}
                      <motion.div
                        whileHover={{ scale: 1.02, rotate: 0 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full max-w-2xl ${tiltClass}`}
                        style={{
                          filter: "drop-shadow(0px 5px 0px #451A03)",
                        }}
                      >
                        {/* Border Hitam/Cokelat Tua Signpost (Clip-Path Panah Kayu) */}
                        <div
                          className="p-[4px] bg-[#451A03]"
                          style={{
                            clipPath: pointRight
                              ? "polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%)"
                              : "polygon(7% 0%, 100% 0%, 100% 100%, 7% 100%, 0% 50%)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleNavigate(rule.id)}
                            className={`group relative w-full text-left ${palette.bg} py-4 ${
                              pointRight
                                ? "pl-4 pr-10 sm:pl-5 sm:pr-12"
                                : "pl-10 pr-4 sm:pl-12 sm:pr-5"
                            } transition-colors cursor-pointer`}
                            style={{
                              clipPath: pointRight
                                ? "polygon(0% 0%, 93% 0%, 100% 50%, 93% 100%, 0% 100%)"
                                : "polygon(7% 0%, 100% 0%, 100% 100%, 7% 100%, 0% 50%)",
                            }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div
                                  className={`shrink-0 w-11 h-11 rounded-xl ${palette.badge} border-[3px] border-[#451A03] flex flex-col items-center justify-center text-[#FEF08A] shadow-[2px_2px_0px_#451A03]`}
                                >
                                  <Key size={16} />
                                  <span className="text-[9px] font-black leading-none mt-0.5">
                                    #{index + 1}
                                  </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <span className="inline-block rounded bg-[#451A03] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#FEF08A]">
                                    Arah Misi{" "}
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                  <p
                                    className={`font-display font-black text-base sm:text-lg leading-tight mt-0.5 ${palette.text}`}
                                  >
                                    {rule.title}
                                  </p>
                                  <p className="text-xs font-bold text-[#78350F] leading-snug mt-0.5 line-clamp-1">
                                    {rule.caraBaca}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 flex items-center gap-1 rounded-xl border-[2.5px] border-[#451A03] bg-[#15803D] text-[#FFFFFF] px-3 py-1.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_#451A03]">
                                <span className="hidden sm:inline">
                                  Telusuri
                                </span>
                                <ChevronRight size={14} />
                              </div>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
