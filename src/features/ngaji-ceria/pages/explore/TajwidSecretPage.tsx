import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import { ChevronRight, Key, Sparkles } from "../../../../components/ui/CustomIcons";
import { TAJWID_RULES } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

export default function TajwidSecretPage() {
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    triggerBibiReaction("click");
    navigate(`/member/ngaji-ceria/explore/tajwid/${id}`);
  };

  return (
    <NgajiCeriaLayout
      title="Kunci Rahasia Tajwid"
      hideHeader={true}
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="min-h-[100dvh] w-full bg-[#FEF9C3] relative overflow-x-hidden pb-28">
        {/* Pola kertas buku tulis */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(#EAB30822 1px, transparent 1px), linear-gradient(90deg, #EAB30818 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10">
          {/* HEADER: Map Lipat (folder manila) */}
          <ThemedHeader
            title="Kunci Rahasia Tajwid"
            onBack={() => navigate("/member/ngaji-ceria/map")}
            themeColorClass="bg-[#FDE68A]"
            textColorClass="text-[#854D0E]"
            statVariant="stamp"
            statBgClass="bg-[#FEF9C3]"
            statTextClass="text-[#854D0E]"
            backClass="bg-[#EAB308]"
          >
            {/* Ornamen sudut: klip kertas & tab Nursal */}
            <svg
              className="absolute right-24 top-3 w-8 h-8 text-[#B45309] rotate-12 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M8 3v15a4 4 0 0 0 8 0V7a2.5 2.5 0 0 0-5 0v9" />
            </svg>
          </ThemedHeader>

          {/* Hero: folder berkas RAHASIA */}
          <div className="px-4 pt-6">
            <section className="relative mx-1 rounded-t-[18px] bg-[#FDE68A] border-[3px] border-[#B45309] border-b-0 shadow-[5px_5px_0px_#B45309] px-5 pt-9 pb-6 overflow-visible">
              {/* Tab folder */}
              <div className="absolute -top-6 left-4 h-6 w-28 bg-[#FDE68A] border-[3px] border-b-0 border-[#B45309] rounded-t-lg flex items-center pl-2">
                <span className="text-[10px] font-black text-[#854D0E] uppercase tracking-widest">
                  Berkas
                </span>
              </div>
              {/* Stempel RAHASIA */}
              <div className="absolute -right-1 top-8 rotate-[14deg] z-20">
                <div className="border-[3.5px] border-[#B91C1C] text-[#B91C1C] rounded-md px-3 py-1 text-lg font-black tracking-[0.2em] uppercase bg-[#FCA5A5]/20 shadow-[2px_2px_0px_rgba(185,28,28,0.35)]">
                  Rahasia
                </div>
              </div>
              {/* Klip kertas */}
              <svg
                className="absolute -left-2 -top-3 w-10 h-10 text-[#B45309] -rotate-12 z-20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 3v15a4 4 0 0 0 8 0V7a2.5 2.5 0 0 0-5 0v9" />
              </svg>

              <div className="max-w-[86%]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B91C1C]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#B91C1C] border-2 border-dashed border-[#B91C1C]/40 mb-2">
                  <Sparkles size={12} /> Dossier Misi
                </span>
                <h2 className="font-display text-xl font-black leading-tight text-[#854D0E]">
                  Buka segel kaidah bacaan yang indah
                </h2>
                <p className="mt-2 text-[11px] font-bold text-[#854D0E]/70 leading-relaxed">
                  Investigasi kaidah tajwid satu per satu. Stempel merah
                  menandai berkas belum terbuka.
                </p>
              </div>
            </section>
          </div>

          {/* Daftar kaidah: berkas kertas dengan selotip & stempel */}
          <section className="space-y-4 px-4 pt-2">
            {TAJWID_RULES.map((rule, index) => (
              <motion.button
                key={rule.id}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleNavigate(rule.id)}
                className="relative w-full text-left"
              >
                {/* Selotip atas */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#FEF08A] border-2 border-[#B45309]/40 rotate-[-3deg] z-20 [clip-path:polygon(3%_0,100%_0,97%_100%,0_100%)]" />
                <div className="relative w-full flex items-center gap-3 rounded-lg bg-white border-[3px] border-[#B45309] p-4 pr-24 shadow-[3px_3px_0px_#B45309] active:translate-y-[3px] active:shadow-none transition-all">
                  <span className="shrink-0 w-10 h-10 rounded-lg bg-[#FEF9C3] border-2 border-dashed border-[#B45309]/50 flex items-center justify-center">
                    <Key size={18} className="text-[#B45309]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm text-[#854D0E] line-clamp-1">
                      {rule.title}
                    </p>
                    <p className="text-[10px] text-[#854D0E]/60 leading-snug mt-0.5 line-clamp-2">
                      {rule.caraBaca}
                    </p>
                  </div>

                  {/* Stempel tinta aksi Buka Segel */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 rotate-[-6deg]">
                    <div className="flex items-center gap-1 border-[3px] border-[#B91C1C] text-[#B91C1C] rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-[#FCA5A5]/10">
                      Buka Segel <ChevronRight size={10} strokeWidth={3} />
                    </div>
                  </div>
                  {/* Nomor urut stempel tinta */}
                  <div className="absolute right-3 bottom-1.5 rotate-3">
                    <span className="text-[9px] font-black text-[#854D0E]/50">
                      No. {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
