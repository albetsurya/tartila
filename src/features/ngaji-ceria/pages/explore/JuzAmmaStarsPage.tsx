import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  Pause,
  Volume2,
} from "../../../../components/ui/CustomIcons";
import { JUZ_AMMA_SURAHS } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";
import { ThemedHeader } from "../../components/ThemedHeader";

/** Pola bintang deep-space (SVG statis, warna solid tegas) */
const SpaceStarsSvg = ({ className = "" }: { className?: string }) => (
  <svg
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {[
      [20, 30, 2],
      [70, 90, 1.5],
      [130, 20, 2.5],
      [180, 70, 2],
      [240, 30, 1.5],
      [300, 80, 2.5],
      [360, 25, 2],
      [45, 160, 1.5],
      [110, 130, 2],
      [170, 180, 1.5],
      [260, 150, 2],
      [330, 170, 1.5],
      [375, 140, 2],
      [30, 250, 2],
      [95, 280, 1.5],
      [160, 240, 2.5],
      [225, 300, 1.5],
      [290, 260, 2],
      [355, 310, 2.5],
      [60, 360, 2],
      [140, 380, 1.5],
      [250, 370, 2],
      [320, 385, 1.5],
    ].map(([cx, cy, r], i) => (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill="#FEF08A"
        stroke="#FDE047"
        strokeWidth="0"
      />
    ))}
    {/* Bintang berkilau besar */}
    {[
      [200, 100],
      [80, 200],
      [320, 220],
    ].map(([cx, cy], i) => (
      <path
        key={`spark-${i}`}
        d={`M ${cx} ${cy - 8} L ${cx + 2} ${cy - 2} L ${cx + 8} ${cy} L ${cx + 2} ${cy + 2} L ${cx} ${cy + 8} L ${cx - 2} ${cy + 2} L ${cx - 8} ${cy} L ${cx - 2} ${cy - 2} Z`}
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="1.5"
      />
    ))}
  </svg>
);

/** Palet warna planet solid (tanpa gradient) */
const PLANET_COLORS = [
  { fill: "#FF6B6B", glow: "#FFB4B4" },
  { fill: "#F59E0B", glow: "#FCD34D" },
  { fill: "#38BDF8", glow: "#BAE6FD" },
  { fill: "#A855F7", glow: "#D8B4FE" },
  { fill: "#2DD4BF", glow: "#99F6E4" },
  { fill: "#F472B6", glow: "#FBCFE8" },
];

export default function JuzAmmaStarsPage() {
  const navigate = useNavigate();
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();

  const handlePlay = (url: string) => {
    triggerBibiReaction("play");
    toggle(url);
  };

  const handleSelect = (number: number) => {
    triggerBibiReaction("click");
    navigate(`/member/ngaji-ceria/explore/juz-amma/${number}`);
  };

  return (
    <NgajiCeriaLayout
      title="Galaksi Juz 'Amma"
      hideHeader={true}
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="min-h-[100dvh] w-full bg-[#1E1B4B] relative overflow-x-hidden pb-28">
        <SpaceStarsSvg />

        {/* Header kustom: Kapsul Astronot */}
        <ThemedHeader
          title="Galaksi Juz 'Amma"
          onBack={() => navigate("/member/ngaji-ceria/map")}
          themeColorClass="bg-[#1E1B4B]"
          textColorClass="text-[#FEF08A]"
          statVariant="capsule"
          statBgClass="bg-[#312E81] text-[#FEF08A]"
          backClass="bg-[#FEF08A] text-[#134E4A]"
        >
          {/* Bintang kecil di belakang tombol */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 64"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {[
              [40, 12, 1.5],
              [90, 44, 2],
              [150, 10, 2.5],
              [210, 50, 1.5],
              [270, 14, 2],
              [330, 46, 2.5],
              [380, 16, 1.5],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="#FEF08A" stroke="#FDE047" strokeWidth="0" />
            ))}
          </svg>
        </ThemedHeader>

        <div className="relative z-10 px-4 pt-4">
          {/* ── HERO MISI HAFALAN ── */}
          <section className="relative overflow-hidden rounded-[24px] border-[3px] border-[#FEF08A] bg-[#312E81] p-5 text-white shadow-[4px_4px_0px_#134E4A]">
            {/* Dekorasi roket + alien ramah + teleskop */}
            <svg
              className="absolute -top-2 right-2 h-24 w-24"
              viewBox="0 0 96 96"
              aria-hidden="true"
            >
              {/* Roket */}
              <g transform="rotate(20 48 48)">
                <path
                  d="M 48 8 Q 64 26 58 52 L 38 52 Q 32 26 48 8 Z"
                  fill="#FF6B6B"
                  stroke="#134E4A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <circle
                  cx="48"
                  cy="32"
                  r="6"
                  fill="#FEF08A"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                />
                <path
                  d="M 38 44 L 28 58 L 38 54 Z"
                  fill="#F59E0B"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 58 44 L 68 58 L 58 54 Z"
                  fill="#F59E0B"
                  stroke="#134E4A"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 42 52 Q 48 66 54 52 Q 48 56 42 52 Z"
                  fill="#FBBF24"
                  stroke="#134E4A"
                  strokeWidth="2"
                />
              </g>
              {/* Bintang kecil */}
              <circle cx="14" cy="70" r="2.5" fill="#FEF08A" stroke="#134E4A" strokeWidth="1.5" />
              <circle cx="82" cy="62" r="2" fill="#FEF08A" stroke="#134E4A" strokeWidth="1.5" />
            </svg>

            <div className="relative z-10 max-w-[70%]">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border-2 border-[#FEF08A] bg-[#1E1B4B] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FEF08A]">
                🛸 Misi Antariksa
              </span>
              <h2 className="mt-1 font-display text-xl font-black leading-tight text-white">
                Terbang ke planet surah & kumpulkan bintangnya!
              </h2>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-block rounded-md border-2 border-[#134E4A] bg-[#FF6B6B] px-2.5 py-1 text-[10px] font-black text-white">
                  37 Surah
                </span>
                <span className="inline-block rounded-md border-2 border-[#134E4A] bg-[#F59E0B] px-2.5 py-1 text-[10px] font-black text-[#134E4A]">
                  Juz 30
                </span>
              </div>
            </div>
          </section>

          {/* ── PETA PLANET ── */}
          <section className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
            {JUZ_AMMA_SURAHS.map((surah, i) => {
              const isSurahPlaying =
                isPlaying && currentAudioUrl === surah.audioUrl;
              const color = PLANET_COLORS[i % PLANET_COLORS.length];

              return (
                <motion.div
                  key={surah.number}
                  onClick={() => handleSelect(surah.number)}
                  className="relative flex cursor-pointer flex-col items-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      duration: 2.6 + (i % 5) * 0.4,
                      ease: "easeInOut",
                    },
                  }}
                >
                  {/* Planet + orbit ring */}
                  <div className="relative h-20 w-20">
                    {/* Orbit ring (garis lingkaran melayang) */}
                    <div
                      className="absolute -inset-2 rounded-full border-2 border-dashed border-[#FEF08A]/50"
                      aria-hidden="true"
                    />
                    {/* Orbit bulan kecil */}
                    <span
                      className="absolute -inset-2"
                      aria-hidden="true"
                    >
                      <span
                        className={`absolute -top-1 ${i % 2 ? "left-0" : "right-0"} block h-2.5 w-2.5 rounded-full border-2 border-[#134E4A] bg-[#FBBF24] shadow-[1.5px_1.5px_0px_#134E4A]`}
                      />
                    </span>
                    {/* Bola planet */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-full border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] ${
                        isSurahPlaying ? "bg-white" : ""
                      }`}
                      style={
                        isSurahPlaying ? undefined : {
                          backgroundColor: color.fill,
                        }
                      }
                    >
                      {/* Kawah planet (pola solid sederhana) */}
                      <span
                        className="absolute left-2 top-4 h-3 w-3 rounded-full opacity-40"
                        style={{ backgroundColor: color.glow }}
                        aria-hidden="true"
                      />
                      <span
                        className="absolute bottom-3 right-2 h-4 w-4 rounded-full opacity-40"
                        style={{ backgroundColor: color.glow }}
                        aria-hidden="true"
                      />
                      <span className="relative z-10 font-display text-xl font-black text-white [text-shadow:1.5px_1.5px_0_#134E4A]">
                        {surah.number}
                      </span>
                    </div>
                  </div>

                  {/* Nama planet */}
                  <span className="mt-3 inline-block max-w-full truncate rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1 text-[10px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                    {surah.name}
                  </span>
                  <span className="mt-1 text-[9px] font-black uppercase tracking-wider text-[#FEF08A]">
                    {surah.ayah} ayat
                  </span>

                  {/* Tombol audio (transmisi) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(surah.audioUrl);
                    }}
                    aria-label={
                      isSurahPlaying
                        ? `Jeda ${surah.name}`
                        : `Putar ${surah.name}`
                    }
                    className={`mt-2 flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#134E4A] px-2.5 py-1 text-[10px] font-black shadow-[2px_2px_0px_#134E4A] transition-all active:translate-y-[1px] active:shadow-none ${
                      isSurahPlaying
                        ? "bg-[#FF6B6B] text-white"
                        : "bg-white text-[#134E4A]"
                    }`}
                  >
                    {isSurahPlaying ? <Pause size={12} /> : <Volume2 size={12} />}
                    {isSurahPlaying ? "Jeda" : "Putar"}
                  </button>
                </motion.div>
              );
            })}
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
