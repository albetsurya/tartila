import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import {
  BookOpen,
  Cards,
  HandsPraying,
  Key,
  Search,
  Star,
  ArrowRight,
  Moon,
  Sparkles,
} from "../../../components/ui/FontAwesomeIcons";
import { triggerBibiReaction } from "../../../utils/bibiEvent";

interface ExploreMenuItem {
  key: string;
  title: string;
  desc: string;
  badge: string;
  to: string;
  bgClass: string;
  borderClass: string;
  iconBg: string;
  iconColor: string;
  icon: typeof BookOpen;
  isMain?: boolean;
}

const EXPLORE_MENU: ExploreMenuItem[] = [
  {
    key: "tilawati",
    title: "Peta Tilawati", 
    desc: "Jelajahi jalur petualangan membaca dari level dasar hingga mahir.", // <-- Disesuaikan
    badge: "6 Level",
    to: "/member/ngaji-ceria/explore/tilawati",
    bgClass: "bg-[#FFF4E5]",
    borderClass: "border-[#F59E0B]",
    iconBg: "bg-[#F59E0B]",
    iconColor: "text-white",
    icon: BookOpen, 
    isMain: true,
  },
  {
    key: "tajwid",
    title: "Lab Tajwid",
    desc: "Rahasia bacaan indah & benar.",
    badge: "14 Misi",
    to: "/member/ngaji-ceria/explore/tajwid",
    bgClass: "bg-[#EAF5EA]",
    borderClass: "border-[#15803D]",
    iconBg: "bg-[#15803D]",
    iconColor: "text-white",
    icon: Key,
  },
  {
    key: "juz-amma",
    title: "Galaksi Juz 'Amma",
    desc: "Hafalkan surat pendek bersama murottal.",
    badge: "37 Bintang",
    to: "/member/ngaji-ceria/explore/juz-amma",
    bgClass: "bg-[#E0F2FE]",
    borderClass: "border-[#0284C7]",
    iconBg: "bg-[#0284C7]",
    iconColor: "text-white",
    icon: Star,
  },
  {
    key: "doa",
    title: "Gudang Doa",
    desc: "Kumpulan doa harian & adab santri.",
    badge: "34 Harta",
    to: "/member/ngaji-ceria/explore/doa",
    bgClass: "bg-[#F3E8FF]",
    borderClass: "border-[#9333EA]",
    iconBg: "bg-[#9333EA]",
    iconColor: "text-white",
    icon: HandsPraying,
  },
  {
    key: "practice",
    title: "Arena Kartu",
    desc: "Latihan acak kartu ajaib.",
    badge: "Main",
    to: "/member/ngaji-ceria/explore/practice",
    bgClass: "bg-[#FFE4E6]",
    borderClass: "border-[#E11D48]",
    iconBg: "bg-[#E11D48]",
    iconColor: "text-white",
    icon: Cards,
  },
];

const RECOMMENDATIONS = [
  { label: "Doa Makan", emoji: "🍲" },
  { label: "Doa Tidur", emoji: "🛌" },
  { label: "Al-Ikhlas", emoji: "📖" },
  { label: "Doa Keluar", emoji: "🚪" },
];

export default function NgajiCeriaMapPage() {
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    triggerBibiReaction("play");
    navigate(to);
  };

  return (
    <NgajiCeriaLayout title="Jelajah">
      <div className="min-h-full bg-[#F0FDF4] pb-32">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-[#134E4A] px-5 pt-8 pb-14 text-white rounded-b-[40px] shadow-lg">
          {/* Dekorasi */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[8px] border-white/5" />
          <div className="absolute top-10 right-16 text-[#FF6B6B] rotate-12">
            <Sparkles size={32} />
          </div>
          <div className="absolute bottom-6 right-8 text-white/20">
            <Moon size={64} />
          </div>

          <div className="relative z-10 max-w-[85%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B6B]/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF6B6B]">
              <Sparkles size={12} /> Misi Hari Ini
            </span>
            <h2 className="mt-3 font-display text-[26px] font-black leading-tight">
              Siap taklukkan <br />
              <span className="text-[#FF6B6B]">tantangan baru?</span>
            </h2>
            <p className="mt-2 text-[12px] font-medium text-white/80 leading-relaxed">
              Pilih markas belajarmu dan kumpulkan bintang sebanyak mungkin!
            </p>
          </div>
        </section>

        {/* Search & Chips */}
        <section className="relative z-20 -mt-8 px-4">
          <div className="flex items-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-white px-4 py-3 shadow-[4px_4px_0px_#134E4A]">
            <Search size={20} className="text-[#134E4A]" />
            <input
              type="text"
              placeholder="Cari doa, surah, atau materi..."
              className="w-full bg-transparent text-sm font-bold text-[#134E4A] placeholder:text-[#134E4A]/40 focus:outline-none"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <span className="whitespace-nowrap text-[11px] font-black text-[#D97706]">
              Rekomendasi:
            </span>
            {RECOMMENDATIONS.map((rec) => (
              <button
                key={rec.label}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border-2 border-[#134E4A] bg-white px-3 py-1.5 text-[11px] font-bold text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <span>{rec.emoji}</span> {rec.label}
              </button>
            ))}
          </div>
        </section>

        {/* Bento Grid Menu */}
        <section className="mt-6 px-4">
          <div className="grid grid-cols-2 gap-4">
            {EXPLORE_MENU.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.key}
                  onClick={() => handleNavigate(item.to)}
                  whileTap={{ scale: 0.96 }}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-[24px] border-[3px] p-4 text-left shadow-[4px_4px_0px_#134E4A] transition-all ${item.bgClass} ${item.borderClass} ${
                    item.isMain
                      ? "col-span-2 flex-row items-center"
                      : "col-span-1"
                  }`}
                >
                  {/* Ikon Kiri (Jika Main) atau Atas */}
                  <div className={`${item.isMain ? "mr-4" : "mb-3"}`}>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#134E4A] shadow-sm ${item.iconBg}`}
                    >
                      <Icon size={24} className={item.iconColor} />
                    </div>
                  </div>

                  {/* Teks */}
                  <div className="flex-1">
                    <h4 className="font-display text-[15px] font-black leading-tight text-[#134E4A]">
                      {item.title}
                    </h4>
                    <p
                      className={`mt-1 text-[10px] font-semibold text-[#134E4A]/70 leading-snug ${item.isMain ? "line-clamp-2" : "line-clamp-2"}`}
                    >
                      {item.desc}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#134E4A] bg-white px-2 py-1 shadow-sm">
                      <span className="text-[10px] font-black text-[#134E4A] uppercase tracking-wide">
                        {item.badge}
                      </span>
                      <ArrowRight size={10} className="text-[#134E4A]" />
                    </div>
                  </div>

                  {/* Ornamen Latar */}
                  <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                    <Icon size={80} className="text-[#134E4A]" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Doa Cepat (Bottom) */}
        <section className="mt-8 px-4">
          <div className="rounded-[28px] border-[3px] border-[#134E4A] bg-[#134E4A] p-5 shadow-[4px_4px_0px_#FF6B6B]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B]">
                  Akses Cepat
                </span>
                <h3 className="font-display text-lg font-black text-white">
                  Doa Kilat
                </h3>
              </div>
              <button
                onClick={() =>
                  handleNavigate("/member/ngaji-ceria/explore/doa")
                }
                className="flex items-center gap-1 rounded-xl border-2 border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-white/20 active:scale-95"
              >
                Semua <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: "🌙", title: "Sebelum Tidur" },
                { icon: "☀️", title: "Bangun Tidur" },
                { icon: "🍽️", title: "Sebelum Makan" },
                { icon: "💧", title: "Sesudah Makan" },
              ].map((doa, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    handleNavigate("/member/ngaji-ceria/explore/doa")
                  }
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 active:bg-white/10 transition-colors"
                >
                  <span className="text-lg">{doa.icon}</span>
                  <span className="text-[11px] font-bold text-white leading-tight">
                    {doa.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </NgajiCeriaLayout>
  );
}
