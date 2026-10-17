import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  ArrowRight,
  Lock,
  Star,
  BookOpen,
  Play,
  Sparkles,
} from "../../../../components/ui/FontAwesomeIcons";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

interface TilawatiLevel {
  jilid: number;
  title: string;
  desc: string;
  unlocked: boolean;
  progress: number;
  totalStars: number;
  earnedStars: number;
}

const JILID_THEMES: Record<
  number,
  { bg: string; text: string; iconColor: string }
> = {
  1: {
    bg: "bg-[#F0F9FF]",
    text: "text-[#0284C7]",
    iconColor: "text-[#0EA5E9]",
  },
  2: {
    bg: "bg-[#FFFBEB]",
    text: "text-[#B45309]",
    iconColor: "text-[#D97706]",
  },
  3: {
    bg: "bg-[#F0FDF4]",
    text: "text-[#15803D]",
    iconColor: "text-[#16A34A]",
  },
  4: {
    bg: "bg-[#F8FAFC]",
    text: "text-[#1E40AF]",
    iconColor: "text-[#2563EB]",
  },
  5: {
    bg: "bg-[#FEF2F2]",
    text: "text-[#991B1B]",
    iconColor: "text-[#DC2626]",
  },
  6: {
    bg: "bg-[#FAF5FF]",
    text: "text-[#6B21A8]",
    iconColor: "text-[#7E22CE]",
  },
};

const CardIllustration = ({ jilid }: { jilid: number }) => {
  switch (jilid) {
    case 1:
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <circle cx="75" cy="25" r="15" fill="#0EA5E9" />
          <path
            d="M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z"
            fill="#38BDF8"
          />
          <path
            d="M0,75 Q30,55 60,75 T100,70 L100,100 L0,100 Z"
            fill="#0284C7"
          />
          <path
            d="M0,90 Q20,80 40,90 T80,90 T100,85 L100,100 L0,100 Z"
            fill="#075985"
          />
        </svg>
      );
    case 2:
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <circle cx="50" cy="25" r="18" fill="#F59E0B" />
          <path
            d="M-10,60 Q25,30 60,60 T120,50 L120,100 L-10,100 Z"
            fill="#D97706"
          />
          <path
            d="M-20,75 Q20,50 70,80 T120,70 L120,100 L-20,100 Z"
            fill="#B45309"
          />
          <path
            d="M-10,90 Q30,70 80,95 T110,85 L110,100 L-10,100 Z"
            fill="#78350F"
          />
        </svg>
      );
    case 3:
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path d="M0,100 L20,40 L40,100 Z" fill="#22C55E" />
          <path d="M25,100 L50,20 L75,100 Z" fill="#16A34A" />
          <path d="M60,100 L85,45 L110,100 Z" fill="#15803D" />
          <path d="M-10,100 L10,60 L30,100 Z" fill="#4ADE80" />
        </svg>
      );
    case 4:
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path d="M-10,100 L25,30 L60,100 Z" fill="#94A3B8" />
          <path d="M25,30 L15,60 L35,60 Z" fill="#F8FAFC" />
          <path d="M40,100 L70,20 L100,100 Z" fill="#CBD5E1" />
          <path d="M70,20 L60,50 L80,50 Z" fill="#F8FAFC" />
          <circle cx="20" cy="20" r="2" fill="#E2E8F0" />
          <circle cx="85" cy="15" r="3" fill="#E2E8F0" />
          <circle cx="50" cy="10" r="1.5" fill="#E2E8F0" />
        </svg>
      );
    case 5:
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path d="M0,100 L50,30 L100,100 Z" fill="#450A0A" />
          <path d="M50,30 L35,65 L65,65 Z" fill="#DC2626" />
          <path d="M50,30 L45,50 L55,50 Z" fill="#F97316" />
          <circle cx="55" cy="15" r="10" fill="#525252" />
          <circle cx="70" cy="10" r="6" fill="#525252" />
          <circle cx="40" cy="8" r="4" fill="#525252" />
        </svg>
      );
    case 6:
      return (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <circle cx="20" cy="70" r="30" fill="#4C1D95" />
          <circle cx="85" cy="30" r="40" fill="#6B21A8" />
          <circle cx="85" cy="30" r="30" fill="#7E22CE" />
          <circle cx="50" cy="50" r="2" fill="#E9D5FF" />
          <circle cx="70" cy="80" r="1.5" fill="#E9D5FF" />
          <circle cx="15" cy="20" r="1" fill="#E9D5FF" />
          <circle cx="40" cy="15" r="2" fill="#E9D5FF" />
          <circle cx="80" cy="85" r="1.5" fill="#E9D5FF" />
        </svg>
      );
    default:
      return null;
  }
};

const TILAWATI_LEVELS: TilawatiLevel[] = [
  {
    jilid: 1,
    title: "Tilawati 1",
    desc: "Pengenalan Makhraj & Huruf Hijaiyah",
    unlocked: true,
    progress: 15,
    totalStars: 93,
    earnedStars: 0,
  },
  {
    jilid: 2,
    title: "Tilawati 2",
    desc: "Huruf Bersambung & Panjang Pendek",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 3,
    title: "Tilawati 3",
    desc: "Mad, Tasydid & Ghunnah",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 4,
    title: "Tilawati 4",
    desc: "Waqaf & Ibtida' (Tanda Baca)",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 5,
    title: "Tilawati 5",
    desc: "Tajwid Lanjutan & Kelancaran",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
  {
    jilid: 6,
    title: "Tilawati 6",
    desc: "Tahap Akhir & Kelulusan",
    unlocked: false,
    progress: 0,
    totalStars: 90,
    earnedStars: 0,
  },
];

export default function TilawatiAdventurePage() {
  const navigate = useNavigate();

  const handleLevelClick = (level: TilawatiLevel) => {
    if (!level.unlocked) return;
    triggerBibiReaction("play");
    navigate(`/member/ngaji-ceria/explore/tilawati/${level.jilid}`);
  };

  return (
    <NgajiCeriaLayout
      title="Pilih Jilid"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="absolute right-4 top-3 z-50">
        <div className="flex items-center gap-1.5 rounded-xl border-[3px] border-[#134E4A] bg-white px-3 py-1.5 shadow-[2px_2px_0px_#134E4A]">
          <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
          <span className="text-xs font-black text-[#134E4A]">0</span>
        </div>
      </div>

      <div className="min-h-full bg-[#F0FDF4] pb-24">
        <section className="relative overflow-hidden bg-[#134E4A] px-5 pt-8 pb-14 text-white rounded-b-[40px] shadow-lg">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[8px] border-white/5" />
          <div className="absolute top-8 right-12 text-[#FF6B6B] rotate-12">
            <BookOpen size={48} />
          </div>

          <div className="relative z-10 max-w-[80%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B6B]/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] mb-3">
              <Sparkles size={12} /> Petualangan Tilawati
            </span>
            <h2 className="font-display text-[26px] font-black leading-tight mb-2">
              Mulai Perjalanan <br />
              <span className="text-[#FF6B6B]">Ilmu-Mu!</span>
            </h2>
            <p className="text-[12px] leading-relaxed text-white/80">
              Selesaikan setiap langkah untuk membuka gerbang ilmu selanjutnya.
              Kumpulkan bintangmu!
            </p>
          </div>
        </section>

        <section className="relative px-4 pt-8">
          <div className="relative flex flex-col items-center">
            <div className="absolute left-1/2 top-10 bottom-10 w-1 -translate-x-1/2 border-l-4 border-dashed border-[#0D9488]/40 z-0" />

            {TILAWATI_LEVELS.map((level, index) => {
              const isLeft = index % 2 === 0;
              const stepNumber = String(index + 1).padStart(2, "0");
              const theme = JILID_THEMES[level.jilid] || JILID_THEMES[1];

              return (
                <div
                  key={level.jilid}
                  className={`relative w-full flex ${isLeft ? "justify-start" : "justify-end"} mb-10 z-10`}
                >
                  <div
                    className={`absolute left-1/2 top-8 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full border-[4px] border-[#F0FDF4] shadow-sm z-20 ${
                      level.unlocked ? "bg-[#0D9488]" : "bg-gray-300"
                    }`}
                  >
                    <span className="text-[11px] font-black text-white">
                      {stepNumber}
                    </span>
                  </div>

                  <div
                    className={`w-[46%] ${isLeft ? "mr-auto pr-3" : "ml-auto pl-3"}`}
                  >
                    {level.unlocked ? (
                      <motion.button
                        type="button"
                        onClick={() => handleLevelClick(level)}
                        whileTap={{
                          scale: 0.95,
                          y: 2,
                          boxShadow: "0px 0px 0px #134E4A",
                        }}
                        className={`relative w-full flex flex-col rounded-[24px] ${theme.bg} border-[3px] border-[#134E4A] p-4 text-left shadow-[4px_4px_0px_#134E4A] overflow-hidden`}
                      >
                        <div className="absolute inset-0 opacity-25 pointer-events-none">
                          <CardIllustration jilid={level.jilid} />
                        </div>

                        <div className="relative z-10 flex items-center justify-between mb-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white border-2 border-[#134E4A] ${theme.iconColor} shadow-sm`}
                          >
                            <BookOpen size={16} />
                          </div>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#D97706] bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md border-2 border-[#134E4A]">
                            <Star size={10} fill="currentColor" />{" "}
                            {level.earnedStars}/{level.totalStars}
                          </span>
                        </div>

                        <div className="relative z-10">
                          <h4 className="font-display font-black text-[15px] text-[#134E4A] mb-1 drop-shadow-sm">
                            {level.title}
                          </h4>
                          <p
                            className={`text-[10px] font-bold ${theme.text} mb-3 leading-tight line-clamp-2 drop-shadow-sm`}
                          >
                            {level.desc}
                          </p>
                        </div>

                        <div className="relative z-10 mt-auto w-full">
                          <div className="h-2 w-full rounded-full bg-white/70 backdrop-blur-sm border border-[#134E4A] overflow-hidden mb-2">
                            <div
                              className="h-full bg-[#FF6B6B]"
                              style={{ width: `${level.progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-[#134E4A] drop-shadow-sm">
                              Mulai
                            </span>
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6B6B] border-2 border-[#134E4A] text-white">
                              <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    ) : (
                      <div
                        className={`relative w-full flex flex-col rounded-[24px] ${theme.bg} border-[3px] border-[#134E4A]/40 border-dashed p-4 text-left opacity-80 overflow-hidden shadow-[4px_4px_0px_#D1D5DB] grayscale-[50%]`}
                      >
                        <div className="absolute inset-0 opacity-15 pointer-events-none">
                          <CardIllustration jilid={level.jilid} />
                        </div>

                        <div className="relative z-10 flex items-center justify-between mb-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gray-200 border-2 border-gray-400 text-gray-500`}
                          >
                            <Lock size={16} />
                          </div>
                        </div>

                        <div className="relative z-10">
                          <h4 className="font-display font-black text-[15px] text-[#134E4A]/70 mb-1">
                            {level.title}
                          </h4>
                          <p className="text-[10px] font-semibold text-[#134E4A]/50 mb-4 leading-tight italic line-clamp-2">
                            Selesaikan level sebelumnya.
                          </p>
                        </div>

                        <div className="relative z-10 mt-auto flex items-center gap-1.5 bg-white/50 backdrop-blur-sm w-max px-2 py-1 rounded-md border border-[#134E4A]/20">
                          <Lock size={10} className="text-[#134E4A]/50" />
                          <span className="text-[9px] font-bold text-[#134E4A]/50">
                            Terkunci
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 mt-8">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerBibiReaction("play");
              navigate("/member/ngaji-ceria/explore/juz-amma");
            }}
            className="relative overflow-hidden rounded-[24px] bg-[#E0F2FE] border-[3px] border-[#134E4A] p-4 flex items-center justify-between shadow-[4px_4px_0px_#134E4A] cursor-pointer"
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0284C7] border-2 border-[#134E4A] text-white shadow-sm">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#0284C7]">
                  ✨ Fitur Baru
                </p>
                <h4 className="font-display font-black text-[16px] text-[#134E4A]">
                  Galaksi Juz 'Amma
                </h4>
                <p className="text-[10px] font-semibold text-[#134E4A]/70 leading-tight mt-0.5 max-w-[180px]">
                  Hafalkan surat pendek dengan audio interaktif.
                </p>
              </div>
            </div>
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-[#134E4A] text-[#134E4A] shadow-sm">
              <Play size={16} fill="currentColor" className="ml-1" />
            </div>
            <div className="absolute -right-2 -bottom-4 opacity-10 pointer-events-none">
              <BookOpen size={80} className="text-[#134E4A]" />
            </div>
          </motion.div>
        </section>
      </div>
    </NgajiCeriaLayout>
  );
}
