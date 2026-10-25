import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { Pause, Volume2, UfoSvg } from "../../../../components/ui/CustomIcons";
import { JUZ_AMMA_SURAHS } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";
import { ExploreHeader } from "../../components/ExploreHeader";

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

/** ── VARIAN PLANET ────────────────────────────────────────── */
type PlanetVariant =
  | "saturn"
  | "earth"
  | "mars"
  | "jupiter"
  | "venus"
  | "neptune"
  | "ice"
  | "gasPurple";

const PLANET_VARIANTS: PlanetVariant[] = [
  "saturn",
  "earth",
  "mars",
  "jupiter",
  "venus",
  "neptune",
  "ice",
  "gasPurple",
];

/** Ukuran planet (px). Ubah satu konstanta ini untuk resize global. */
const PLANET_SIZE = 128;

function PlanetVisual({
  variant,
  size = PLANET_SIZE,
}: {
  variant: PlanetVariant;
  size?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const stroke = "#134E4A";
  const sw = 3;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className="absolute inset-0"
      aria-hidden="true"
    >
      {/* SATURN: cincin dua lapis (belakang + depan) */}
      {variant === "saturn" && (
        <g>
          <path
            d="M 4 40 A 36 10 0 0 1 76 40"
            transform="rotate(-15 40 40)"
            fill="none"
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 4 40 A 36 10 0 0 1 76 40"
            transform="rotate(-15 40 40)"
            fill="none"
            stroke="#FCD34D"
            strokeWidth="2"
          />
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="#F59E0B"
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M 22 34 Q 40 30 58 34"
            stroke="#FBBF24"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 22 46 Q 40 42 58 46"
            stroke="#FBBF24"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 4 40 A 36 10 0 0 0 76 40"
            transform="rotate(-15 40 40)"
            fill="none"
            stroke={stroke}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 4 40 A 36 10 0 0 0 76 40"
            transform="rotate(-15 40 40)"
            fill="none"
            stroke="#FCD34D"
            strokeWidth="2"
          />
        </g>
      )}

      {/* BUMI: biru + benua hijau + awan */}
      {variant === "earth" && (
        <g>
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="#38BDF8"
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M 26 32 Q 30 28 34 32 Q 36 38 32 40 Q 26 38 26 32 Z"
            fill="#22C55E"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <path
            d="M 44 42 Q 52 40 54 46 Q 52 52 46 50 Q 42 46 44 42 Z"
            fill="#22C55E"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <path
            d="M 34 48 Q 40 46 42 52 Q 38 56 34 52 Z"
            fill="#22C55E"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <ellipse
            cx="34"
            cy="24"
            rx="5"
            ry="1.8"
            fill="#FFFFFF"
            opacity="0.85"
          />
          <ellipse
            cx="50"
            cy="34"
            rx="4"
            ry="1.5"
            fill="#FFFFFF"
            opacity="0.85"
          />
        </g>
      )}

      {/* MARS: merah + kawah gelap + kutub es */}
      {variant === "mars" && (
        <g>
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="#DC2626"
            stroke={stroke}
            strokeWidth={sw}
          />
          <ellipse cx="32" cy="36" rx="6" ry="4" fill="#991B1B" opacity="0.7" />
          <ellipse cx="48" cy="46" rx="7" ry="4" fill="#991B1B" opacity="0.7" />
          <ellipse cx="36" cy="50" rx="4" ry="3" fill="#991B1B" opacity="0.7" />
          <ellipse
            cx="40"
            cy="24"
            rx="5"
            ry="2"
            fill="#FEE2E2"
            stroke={stroke}
            strokeWidth="1"
          />
          <ellipse
            cx="40"
            cy="56"
            rx="4"
            ry="1.8"
            fill="#FEE2E2"
            stroke={stroke}
            strokeWidth="1"
          />
        </g>
      )}

      {/* JUPITER: pita horizontal + bintik merah */}
      {variant === "jupiter" && (
        <g>
          <defs>
            <clipPath id={`jup-${uid}`}>
              <circle cx="40" cy="40" r="20" />
            </clipPath>
          </defs>
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="#F97316"
            stroke={stroke}
            strokeWidth={sw}
          />
          <g clipPath={`url(#jup-${uid})`}>
            <rect x="18" y="28" width="44" height="3" fill="#C2410C" />
            <rect x="18" y="35" width="44" height="2" fill="#FBBF24" />
            <rect x="18" y="41" width="44" height="3" fill="#C2410C" />
            <rect x="18" y="48" width="44" height="2" fill="#FBBF24" />
            <ellipse
              cx="52"
              cy="44"
              rx="5"
              ry="3.5"
              fill="#DC2626"
              stroke={stroke}
              strokeWidth="1"
            />
          </g>
        </g>
      )}

      {/* VENUS: kuning + gelombang awan */}
      {variant === "venus" && (
        <g>
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="#FDE047"
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M 24 30 Q 40 26 56 32"
            stroke="#F59E0B"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 22 40 Q 40 36 58 42"
            stroke="#F59E0B"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 26 50 Q 40 46 54 52"
            stroke="#F59E0B"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* NEPTUNUS: biru tua + pita + bintik gelap */}
      {variant === "neptune" && (
        <g>
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="#3B82F6"
            stroke={stroke}
            strokeWidth={sw}
          />
          <path
            d="M 22 34 Q 40 30 58 34"
            stroke="#1E40AF"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M 22 46 Q 40 50 58 46"
            stroke="#1E40AF"
            strokeWidth="2.5"
            fill="none"
          />
          <ellipse cx="46" cy="42" rx="6" ry="4" fill="#1E3A8A" opacity="0.8" />
        </g>
      )}

      {/* PLANET ES: biru muda + kawah */}
      {variant === "ice" && (
        <g>
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="#7DD3FC"
            stroke={stroke}
            strokeWidth={sw}
          />
          <circle
            cx="32"
            cy="32"
            r="4"
            fill="#0EA5E9"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <circle
            cx="48"
            cy="44"
            r="3"
            fill="#0EA5E9"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <circle
            cx="36"
            cy="50"
            r="5"
            fill="#0EA5E9"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <circle
            cx="50"
            cy="28"
            r="2.5"
            fill="#0EA5E9"
            stroke={stroke}
            strokeWidth="1.2"
          />
          <circle
            cx="28"
            cy="46"
            r="2"
            fill="#0EA5E9"
            stroke={stroke}
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* GAS GIANT UNGU: pita + kilau bintang */}
      {variant === "gasPurple" && (
        <g>
          <defs>
            <clipPath id={`gp-${uid}`}>
              <circle cx="40" cy="40" r="20" />
            </clipPath>
          </defs>
          <circle
            cx="40"
            cy="40"
            r="20"
            fill="#A855F7"
            stroke={stroke}
            strokeWidth={sw}
          />
          <g clipPath={`url(#gp-${uid})`}>
            <rect x="18" y="32" width="44" height="3" fill="#7E22CE" />
            <rect x="18" y="42" width="44" height="3" fill="#7E22CE" />
            <circle cx="50" cy="36" r="2" fill="#FEF08A" />
            <circle cx="32" cy="48" r="1.5" fill="#FEF08A" />
          </g>
        </g>
      )}
    </svg>
  );
}

/** ── HALAMAN ──────────────────────────────────────────────── */
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
      title="Galaksi Juz 'Amma"
      hideHeader={true}
      themeScope="juz-amma"
      onBack={handleBack}
    >
      <div className="min-h-[100dvh] w-full bg-[#1E1B4B] relative overflow-x-hidden pb-28">
        <SpaceStarsSvg />

        <ExploreHeader
          title="Galaksi Juz 'Amma"
          subtitle="Petualangan Bintang & Misi Hafalan"
          onBack={handleBack}
          themeScope="juz-amma"
          themeColorClass="bg-[#1E1B4B]"
          borderColorClass="border-[#FEF08A]"
          shadowClass="shadow-[0_3px_0px_#134E4A]"
          textColorClass="text-[#FEF08A]"
          backClass="bg-[#FEF08A] text-[#134E4A] border-[#FEF08A] shadow-[2px_2px_0px_#134E4A]"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
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
          </svg>
        </ExploreHeader>

        <div className="relative z-10 px-4 pt-4">
          {/* ── HERO MISI HAFALAN ── */}
          <section className="relative overflow-hidden rounded-[24px] border-[3px] border-[#FEF08A] bg-[#312E81] p-5 text-white shadow-[4px_4px_0px_#134E4A]">
            <svg
              className="absolute -top-2 right-2 h-24 w-24"
              viewBox="0 0 96 96"
              aria-hidden="true"
            >
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
              <circle
                cx="14"
                cy="70"
                r="2.5"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="1.5"
              />
              <circle
                cx="82"
                cy="62"
                r="2"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="1.5"
              />
            </svg>

            <div className="relative z-10 max-w-[70%]">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border-2 border-[#FEF08A] bg-[#1E1B4B] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FEF08A]">
                <UfoSvg size={14} /> Misi Antariksa
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
          <section className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10">
            {JUZ_AMMA_SURAHS.map((surah, i) => {
              const isSurahPlaying =
                isPlaying && currentAudioUrl === surah.audioUrl;
              const variant = PLANET_VARIANTS[i % PLANET_VARIANTS.length];

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
                  {/* Planet + orbit */}
                  <div
                    className="relative"
                    style={{ width: PLANET_SIZE, height: PLANET_SIZE }}
                  >
                    {/* Garis orbit: disembunyikan untuk Saturnus agar tidak bertabrakan dengan cincinnya */}
                    {variant !== "saturn" && (
                      <div
                        className="absolute -inset-3 rounded-full border-2 border-dashed border-[#FEF08A]/50"
                        aria-hidden="true"
                      />
                    )}
                    {/* Bulan kecil di orbit */}
                    <span className="absolute -inset-3" aria-hidden="true">
                      <span
                        className={`absolute -top-1 ${i % 2 ? "left-0" : "right-0"} block h-3 w-3 rounded-full border-2 border-[#134E4A] bg-[#FBBF24] shadow-[1.5px_1.5px_0px_#134E4A]`}
                      />
                    </span>

                    {/* Planet: drop-shadow blocky + glow saat playing */}
                    <div
                      className="absolute inset-0"
                      style={{
                        filter: isSurahPlaying
                          ? "drop-shadow(4px 4px 0 #134E4A) drop-shadow(0 0 16px rgba(254,240,138,0.9))"
                          : "drop-shadow(4px 4px 0 #134E4A)",
                      }}
                    >
                      <PlanetVisual variant={variant} size={PLANET_SIZE} />
                    </div>

                    {/* Nomor surah di atas planet */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-3xl font-black text-white [text-shadow:2px_2px_0_#134E4A]">
                        {surah.number}
                      </span>
                    </div>
                  </div>

                  {/* Nama planet */}
                  <span className="mt-3 inline-block max-w-full truncate rounded-full border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                    {surah.name}
                  </span>
                  <span className="mt-1 text-[10px] font-black uppercase tracking-wider text-[#FEF08A]">
                    {surah.ayah} ayat
                  </span>

                  {/* Tombol audio */}
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
                    className={`mt-2 flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#134E4A] transition-all active:translate-y-[1px] active:shadow-none ${
                      isSurahPlaying
                        ? "bg-[#FF6B6B] text-white"
                        : "bg-white text-[#134E4A]"
                    }`}
                  >
                    {isSurahPlaying ? (
                      <Pause size={14} />
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
