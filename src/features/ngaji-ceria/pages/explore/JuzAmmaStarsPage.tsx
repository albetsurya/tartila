import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { Volume2, UfoSvg } from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import { JUZ_AMMA_SURAHS } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";
import { ExploreHeader } from "../../components/ExploreHeader";

/** Taburan Bintang Kuning di Langit Malam di Atas Lautan */
const OceanNightStarsSvg = ({ className = "" }: { className?: string }) => (
  <svg
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {[
      [20, 25, 2.5],
      [75, 60, 2],
      [130, 20, 3],
      [185, 55, 2],
      [245, 28, 2.5],
      [305, 65, 3],
      [365, 22, 2.5],
      [45, 120, 2],
      [115, 105, 2.5],
      [175, 135, 2],
      [265, 115, 2.5],
      [335, 130, 2],
      [375, 100, 2.5],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#FACC15" />
    ))}
    {[
      [60, 45],
      [210, 35],
      [340, 50],
      [145, 85],
      [285, 90],
    ].map(([cx, cy], i) => (
      <path
        key={`star-${i}`}
        d={`M ${cx} ${cy - 9} L ${cx + 2.5} ${cy - 2.5} L ${cx + 9} ${cy} L ${cx + 2.5} ${cy + 2.5} L ${cx} ${cy + 9} L ${cx - 2.5} ${cy + 2.5} L ${cx - 9} ${cy} L ${cx - 2.5} ${cy - 2.5} Z`}
        fill="#FACC15"
        stroke="#451A03"
        strokeWidth="1.2"
      />
    ))}
  </svg>
);

type VesselVariant = "paperBoat" | "seashell";

const VESSEL_SIZE = 132;

function OceanVesselVisual({
  variant,
  index,
  size = VESSEL_SIZE,
}: {
  variant: VesselVariant;
  index: number;
  size?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const stroke = "#134E4A";
  const sw = 3;
  const sailColors = ["#FEF3C7", "#FEF08A", "#BAE6FD", "#FDE68A"];
  const hullColors = ["#D97706", "#EF4444", "#0D9488", "#F59E0B"];
  const shellColors = ["#FDE68A", "#FECDD3", "#BAE6FD", "#FEF08A"];

  const sailFill = sailColors[index % sailColors.length];
  const hullFill = hullColors[index % hullColors.length];
  const shellFill = shellColors[index % shellColors.length];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      className="absolute inset-0"
      aria-hidden="true"
    >
      {variant === "paperBoat" ? (
        <g id={`boat-${uid}`}>
          {/* Bintang Kuning Kecil di Puncak Layar */}
          <polygon
            points="44,4 46,9 51,9 47,12 48,17 44,14 40,17 41,12 37,9 42,9"
            fill="#FACC15"
            stroke={stroke}
            strokeWidth="1.5"
          />
          {/* Layar Segitiga Kiri & Kanan Perahu Kertas */}
          <path
            d="M 44 16 L 18 52 L 44 52 Z"
            fill={sailFill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <path
            d="M 44 16 L 70 52 L 44 52 Z"
            fill="#FFFFFF"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          {/* Lipatan Tengah Perahu Kertas */}
          <path
            d="M 44 26 L 30 52 L 58 52 Z"
            fill="#FDE047"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Lambung Perahu Kertas */}
          <path
            d="M 10 50 L 78 50 L 66 68 L 22 68 Z"
            fill={hullFill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          {/* Ombak Biru di Bawah Perahu */}
          <path
            d="M 8 68 Q 20 63 32 68 T 56 68 T 80 68"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ) : (
        <g id={`shell-${uid}`}>
          {/* Hiasan Bintang Kuning di Atas Kerang */}
          <polygon
            points="44,6 46,11 51,11 47,14 48,19 44,16 40,19 41,14 37,11 42,11"
            fill="#FACC15"
            stroke={stroke}
            strokeWidth="1.5"
          />
          {/* Cangkang Kerang Laut Bergerigi */}
          <path
            d="M 16 54 C 12 32 26 20 44 20 C 62 20 76 32 72 54 L 60 66 L 28 66 Z"
            fill={shellFill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          {/* Garis-Garis Guratan Kerang */}
          <path
            d="M 44 64 L 26 28 M 44 64 L 44 22 M 44 64 L 62 28"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Engsel Bawah Kerang */}
          <rect
            x="26"
            y="62"
            width="36"
            height="8"
            rx="4"
            fill="#D97706"
            stroke={stroke}
            strokeWidth="2.5"
          />
        </g>
      )}
    </svg>
  );
}

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

  const handleBack = () => {
    navigate("/member/ngaji-ceria/map");
  };

  return (
    <NgajiCeriaLayout
      title="Samudra Juz 'Amma"
      hideHeader={true}
      themeScope="juz-amma"
      onBack={handleBack}
    >
      {/* Latar Langit Malam di Atas Samudra (#0F172A ke #0369A1) */}
      <div className="min-h-[100dvh] w-full bg-[#0369A1] relative overflow-x-hidden pb-28">
        {/* Kubah Langit Malam Berbintang Kuning di Bagian Atas */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-80 bg-[#0F172A] border-b-[4px] border-[#FEF08A]" />
        <OceanNightStarsSvg />

        {/* Bibir Pantai Pasir di Bagian Paling Bawah */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-24 bg-[#FDE68A] border-t-[4px] border-[#451A03] z-0"
          style={{
            clipPath:
              "polygon(0% 35%, 25% 15%, 55% 40%, 85% 10%, 100% 30%, 100% 100%, 0% 100%)",
          }}
        />

        <ExploreHeader
          title="Samudra Juz 'Amma"
          subtitle="Pelayaran Perahu Kertas & Kerang Mutiara"
          onBack={handleBack}
          themeScope="juz-amma"
          themeColorClass="bg-[#0F172A]"
          borderColorClass="border-[#FACC15]"
          shadowClass="shadow-[0_3px_0px_#134E4A]"
          textColorClass="text-[#FACC15]"
          backClass="bg-[#FACC15] text-[#134E4A] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
        />

        <div className="relative z-10 px-4 pt-4 max-w-4xl mx-auto">
          {/* HERO PELAYARAN SAMUDRA MALAM */}
          <section className="relative overflow-hidden rounded-[24px] border-[4px] border-[#FACC15] bg-[#1E3A8A] p-5 text-[#FFFFFF] shadow-[6px_6px_0px_#0F172A]">
            {/* Hiasan Bulan & Bintang Kuning */}
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-[#0284C7] border-[3px] border-[#FACC15] flex items-center justify-center shadow-[3px_3px_0px_#0F172A] rotate-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    fill="#FACC15"
                    stroke="#134E4A"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            <div className="relative z-10 max-w-[74%]">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-[#FACC15] bg-[#0F172A] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FACC15]">
                <UfoSvg size={14} /> Ekspedisi Laut Malam
              </span>
              <h2 className="mt-1 font-display text-xl font-black leading-tight text-[#FFFFFF]">
                Berlayar dengan Perahu Kertas & Temukan Kerang Surah!
              </h2>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-block rounded-md border-[2.5px] border-[#134E4A] bg-[#FACC15] px-2.5 py-1 text-[10px] font-black text-[#134E4A]">
                  ★ 37 Surah
                </span>
                <span className="inline-block rounded-md border-[2.5px] border-[#134E4A] bg-[#38BDF8] px-2.5 py-1 text-[10px] font-black text-[#134E4A]">
                  Samudra Juz 30
                </span>
              </div>
            </div>
          </section>

          {/* GRID PERAHU KERTAS & KERANG DI ATAS OMBAK */}
          <section className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-10">
            {JUZ_AMMA_SURAHS.map((surah, i) => {
              const isSurahPlaying =
                isPlaying && currentAudioUrl === surah.audioUrl;
              const variant: VesselVariant =
                i % 2 === 0 ? "paperBoat" : "seashell";

              return (
                <motion.div
                  key={surah.number}
                  onClick={() => handleSelect(surah.number)}
                  className="relative flex cursor-pointer flex-col items-center"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      duration: 2.6 + (i % 5) * 0.4,
                      ease: "easeInOut",
                    },
                  }}
                >
                  {/* Perahu Kertas / Kerang + Riak Ombak */}
                  <div
                    className="relative"
                    style={{ width: VESSEL_SIZE, height: VESSEL_SIZE }}
                  >
                    {/* Hiasan Bintang Kuning Kecil di Samping */}
                    <span
                      className={`absolute top-1 ${
                        i % 2 ? "left-1" : "right-1"
                      } z-20 flex h-5 w-5 items-center justify-center rounded-full border-[2px] border-[#134E4A] bg-[#FACC15] text-[10px] font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]`}
                    >
                      ★
                    </span>

                    <div
                      className="absolute inset-0"
                      style={{
                        filter: isSurahPlaying
                          ? "drop-shadow(4px 4px 0 #0F172A) drop-shadow(0 0 14px #FACC15)"
                          : "drop-shadow(4px 4px 0 #0F172A)",
                      }}
                    >
                      <OceanVesselVisual
                        variant={variant}
                        index={i}
                        size={VESSEL_SIZE}
                      />
                    </div>

                    {/* Nomor Surah (Mutiara / Lencana Layar) */}
                    <div className="absolute inset-0 flex items-center justify-center pt-3">
                      <span className="rounded-full bg-[#0F172A]/85 border-[2.5px] border-[#FACC15] px-2.5 py-0.5 font-display text-xl font-black text-[#FACC15] shadow-[2px_2px_0px_#134E4A]">
                        {surah.number}
                      </span>
                    </div>
                  </div>

                  {/* Papan Nama Perahu/Kerang Surah */}
                  <span className="mt-2 inline-block max-w-full truncate rounded-xl border-[3px] border-[#134E4A] bg-[#FEF3C7] px-3.5 py-1 text-xs font-black text-[#451A03] shadow-[3px_3px_0px_#0F172A]">
                    {surah.name}
                  </span>
                  <span className="mt-1 text-[10px] font-black uppercase tracking-wider text-[#FACC15]">
                    ★ {surah.ayah} ayat
                  </span>

                  {/* Tombol Audio */}
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
                    className={`mt-2 flex items-center justify-center gap-1.5 rounded-xl border-[3px] border-[#134E4A] px-3.5 py-1.5 text-xs font-black shadow-[3px_3px_0px_#0F172A] transition-all active:translate-y-[1px] active:shadow-none cursor-pointer ${
                      isSurahPlaying
                        ? "bg-[#EF4444] text-[#FFFFFF]"
                        : "bg-[#FACC15] text-[#134E4A]"
                    }`}
                  >
                    {isSurahPlaying ? (
                      <EqualizerIcon
                        isPlaying={true}
                        size={14}
                        barClassName="bg-[#FFFFFF]"
                      />
                    ) : (
                      <Volume2 size={14} />
                    )}
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
