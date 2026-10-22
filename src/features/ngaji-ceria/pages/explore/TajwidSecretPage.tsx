import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  ChevronRight,
  Key,
  Sparkles,
} from "../../../../components/ui/CustomIcons";
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
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="space-y-5 bg-[#F0FDF4] px-4 py-4 min-h-full rounded-t-3xl pb-32">
        {/* Hero Banner (Sticker Style) */}
        <section className="relative overflow-hidden rounded-[24px] bg-[#134E4A] p-5 text-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#FF6B6B]">
          {/* Ornamen */}
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full border-[6px] border-white/5" />
          <div className="absolute right-4 top-4 text-[#FF6B6B] rotate-12 opacity-80">
            <Key size={48} />
          </div>

          <div className="relative z-10 max-w-[80%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] border border-white/20 backdrop-blur-sm mb-2">
              <Sparkles size={12} /> Misi Rahasia
            </span>
            <h2 className="mt-1 font-display text-xl font-black leading-tight">
              Buka rahasia bacaan yang indah
            </h2>
            <p className="mt-2 text-[11px] font-medium text-white/80 leading-relaxed">
              Pilih kaidah tajwid di bawah ini untuk memulai investigasi.
            </p>
          </div>
        </section>

        {/* List Rules (Sticker Cards) */}
        <section className="space-y-3">
          {TAJWID_RULES.map((rule, index) => (
            <motion.button
              key={rule.id}
              whileTap={{ scale: 0.98, y: 2 }}
              type="button"
              onClick={() => handleNavigate(rule.id)}
              className="w-full flex items-center gap-3 rounded-2xl bg-white border-[3px] border-[#134E4A] p-3.5 shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all text-left"
            >
              {/* Ikon */}
              <span className="shrink-0 w-10 h-10 rounded-xl bg-[#F0FDF4] border-2 border-[#0D9488]/30 flex items-center justify-center">
                <Key size={18} className="text-[#0D9488]" />
              </span>

              {/* Teks */}
              <div className="min-w-0 flex-1">
                <p className="font-display font-black text-sm text-[#134E4A] line-clamp-1">
                  {rule.title}
                </p>
                <p className="text-[10px] font-bold text-[#134E4A]/60 leading-snug mt-0.5 line-clamp-2">
                  {rule.caraBaca}
                </p>
              </div>

              {/* Nomor & Panah */}
              <div className="shrink-0 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#FF6B6B] border-2 border-[#134E4A] text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                  {index + 1}
                </span>
                <ChevronRight size={16} className="text-[#134E4A]/40" />
              </div>
            </motion.button>
          ))}
        </section>

        <div className="h-32" aria-hidden="true" />
      </div>
    </NgajiCeriaLayout>
  );
}
