import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  WAKTU_LIST,
  getStatusInfo,
  formatDateId,
  formatDateShort,
  type WaktuSholat,
  type StatusSholat,
} from "../../data/sholatData";
import {
  useSholatJournal,
  countRecorded,
  isComplete,
  WAKTU_ORDER,
} from "../../hooks/useSholatJournal";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

/* ============================================================================
 * NEO-BRUTALISM CUSTOM SVG ILLUSTRATIONS
 * ============================================================================ */

interface SvgProps {
  size?: number;
  className?: string;
}

const CalendarCheckSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="3"
      fill="#FFFFFF"
      stroke="#134E4A"
      strokeWidth="2.5"
    />
    <path
      d="M3 9C3 6.79086 4.79086 5 7 5H17C19.2091 5 21 6.79086 21 9V10H3V9Z"
      fill="#FF6B6B"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M8 3V6M16 3V6"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M9 15.5L11 17.5L15.5 13"
      stroke="#0D9488"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarSvg: React.FC<SvgProps> = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="3"
      fill="#FFFFFF"
      stroke="#134E4A"
      strokeWidth="2.5"
    />
    <path
      d="M3 9C3 6.79086 4.79086 5 7 5H17C19.2091 5 21 6.79086 21 9V10H3V9Z"
      fill="#2DD4BF"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M8 3V6M16 3V6"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="8.5" cy="14" r="1.5" fill="#134E4A" />
    <circle cx="12" cy="14" r="1.5" fill="#134E4A" />
    <circle cx="15.5" cy="14" r="1.5" fill="#FF6B6B" />
    <circle cx="8.5" cy="17.5" r="1.5" fill="#134E4A" />
    <circle cx="12" cy="17.5" r="1.5" fill="#134E4A" />
  </svg>
);

const SparklesSvg: React.FC<SvgProps> = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle cx="19" cy="5" r="2" fill="#FF6B6B" />
  </svg>
);

const FireSvg: React.FC<SvgProps> = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C12 2 6 8 6 13.5C6 17.6421 8.68629 21 12 21C15.3137 21 18 17.6421 18 13.5C18 11 16.5 8.5 15 7C15 9.5 13.5 10.5 13.5 10.5C13.5 7 12 2 12 2Z"
      fill="#FF6B6B"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12C12 12 9.5 14.5 9.5 16.8C9.5 18.5 10.6 20 12 20C13.4 20 14.5 18.5 14.5 16.8C14.5 15 12 12 12 12Z"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const RefreshCwSvg: React.FC<SvgProps> = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 11C19.5 6.5 15.6 3 11 3C6.02944 3 2 7.02944 2 12C2 16.9706 6.02944 21 11 21C15.2 21 18.7 18.1 19.7 14.2"
      stroke="#E11D48"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d="M21 5V11H15"
      stroke="#134E4A"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckBadgeSvg: React.FC<SvgProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="#2DD4BF"
      stroke="#134E4A"
      strokeWidth="2.5"
    />
    <path
      d="M8 12.5L10.8 15.3L16 9.5"
      stroke="#134E4A"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Ilustrasi 5 Waktu Sholat */
const WaktuIconSvg: React.FC<{ waktu: WaktuSholat; size?: number }> = ({
  waktu,
  size = 28,
}) => {
  switch (waktu) {
    case "subuh":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M6 15C6 11.6863 8.68629 9 12 9C15.3137 9 18 11.6863 18 15H6Z"
            fill="#FBBF24"
            stroke="#134E4A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M3 15H21M6 18.5H18"
            stroke="#134E4A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M12 4V6M5.5 7.5L7 9M18.5 7.5L17 9"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "dzuhur":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2V4M12 20V22M4 12H2M22 12H20M5.6 5.6L7 7M17 17L18.4 18.4M18.4 5.6L17 7M7 17L5.6 18.4"
            stroke="#F59E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="12"
            r="5.5"
            fill="#FEF08A"
            stroke="#134E4A"
            strokeWidth="2.2"
          />
        </svg>
      );
    case "ashar":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle
            cx="9"
            cy="9"
            r="4.5"
            fill="#FBBF24"
            stroke="#134E4A"
            strokeWidth="2.2"
          />
          <path
            d="M17.5 19H9.5C7.29086 19 5.5 17.2091 5.5 15C5.5 12.9 7.1 11.2 9.1 11C10.1 9.2 12 8 14.2 8C17.4 8 20 10.6 20 13.8C20 14 20 14.2 19.9 14.4C20.9 14.9 21.5 15.9 21.5 17C21.5 18.1 20.5 19 19.2 19H17.5Z"
            fill="#FFFFFF"
            stroke="#134E4A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "maghrib":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 16C5 12.134 8.13401 9 12 9C15.866 9 19 12.134 19 16H5Z"
            fill="#FF6B6B"
            stroke="#134E4A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M2 16H22M5 19.5H19"
            stroke="#134E4A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="17.5" cy="6" r="1.5" fill="#FBBF24" />
        </svg>
      );
    case "isya":
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M19 14.5C17.8 15.1 16.4 15.5 14.8 15.5C9.9 15.5 6 11.6 6 6.7C6 5.5 6.2 4.4 6.7 3.5C4.2 5 2.5 7.7 2.5 11C2.5 15.9 6.4 19.8 11.3 19.8C14.8 19.8 17.9 17.6 19 14.5Z"
            fill="#38BDF8"
            stroke="#134E4A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle
            cx="16.5"
            cy="6.5"
            r="2"
            fill="#FEF08A"
            stroke="#134E4A"
            strokeWidth="1.8"
          />
        </svg>
      );
  }
};

/* Ilustrasi Status Sholat */
const StatusIconSvg: React.FC<{
  status: StatusSholat | "belum";
  size?: number;
}> = ({ status, size = 14 }) => {
  switch (status) {
    case "tepat":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="9.5"
            fill="#2DD4BF"
            stroke="#134E4A"
            strokeWidth="2.5"
          />
          <path
            d="M7.5 12.5L10.5 15.5L16.5 9"
            stroke="#134E4A"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "telat":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L21.5 19.5H2.5L12 3Z"
            fill="#FBBF24"
            stroke="#134E4A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 9.5V13.5"
            stroke="#134E4A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.5" r="1.3" fill="#134E4A" />
        </svg>
      );
    case "jamak":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M21 4L3 11L10 14L13 21L21 4Z"
            fill="#38BDF8"
            stroke="#134E4A"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "tidak":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="9.5"
            fill="#FF6B6B"
            stroke="#134E4A"
            strokeWidth="2.5"
          />
          <path
            d="M9 9L15 15M15 9L9 15"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "belum":
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="#FFFFFF"
            stroke="#134E4A"
            strokeWidth="2.5"
          />
          <path
            d="M12 7.5V12L15 14"
            stroke="#134E4A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

const STONE_SHAPES = [
  "rounded-[34px_24px_38px_22px]",
  "rounded-[24px_36px_22px_34px]",
  "rounded-[36px_26px_30px_28px]",
  "rounded-[26px_34px_36px_24px]",
  "rounded-[32px_32px_26px_36px]",
];

/* ============================================================================
 * MAIN COMPONENT
 * ============================================================================ */

export default function JurnalIbadahPage() {
  const navigate = useNavigate();
  const {
    today,
    todayEntry,
    recorded,
    tepat,
    complete,
    streak,
    setStatus,
    resetDate,
    getHistory,
  } = useSholatJournal();

  const history = useMemo(() => getHistory(7), [getHistory]);

  const handleSetStatus = (waktu: WaktuSholat, status: StatusSholat) => {
    if (status === "tepat") {
      triggerBibiReaction("success");
    } else {
      triggerBibiReaction("click");
    }
    setStatus(today, waktu, status);
  };

  const handleResetToday = () => {
    if (window.confirm("Reset semua catatan sholat hari ini?")) {
      triggerBibiReaction("error");
      resetDate(today);
    }
  };

  return (
    <NgajiCeriaLayout
      title="Sungai Ibadah"
      hideHeader={true}
      themeScope="jurnal-ibadah"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      {/* Background Aliran Sungai Berbatu (#0284C7) */}
      <div
        className="min-h-[100dvh] w-full relative overflow-x-hidden pb-28 select-none"
        style={{
          backgroundColor: "#0284C7",
          backgroundImage: "radial-gradient(#7DD3FC 2px, transparent 2px)",
          backgroundSize: "26px 26px",
        }}
      >
        {/* Tepian Rumput Sungai di Kiri & Kanan */}
        <div className="pointer-events-none fixed top-0 bottom-0 left-0 w-3 sm:w-5 bg-[#15803D] border-r-[3px] border-[#134E4A] z-0" />
        <div className="pointer-events-none fixed top-0 bottom-0 right-0 w-3 sm:w-5 bg-[#15803D] border-l-[3px] border-[#134E4A] z-0" />

        <ThemedHeader
          title="Sungai Berbatu Ibadah"
          onBack={() => {
            navigate("/member/ngaji-ceria/map");
          }}
          themeColorClass="bg-[#15803D] border-b-[4px] border-[#134E4A]"
          textColorClass="text-[#FEF08A]"
          statVariant="wood"
          statBgClass="bg-[#78350F] text-[#FEF08A]"
          backClass="bg-[#FEF08A] text-[#134E4A] border-[2.5px] border-[#134E4A]"
        />

        <div className="relative z-10 px-4 pt-6 max-w-3xl mx-auto space-y-7">
          {/* Hero Banner: Jembatan Kayu di Atas Sungai */}
          <section className="relative overflow-hidden rounded-2xl bg-[#78350F] p-5 sm:p-6 text-[#FEF3C7] border-[4px] border-[#451A03] shadow-[6px_6px_0px_#451A03]">
            {/* Baut Kayu Jembatan */}
            <span className="absolute top-3 left-3 w-3.5 h-3.5 rounded-full bg-[#D97706] border-[2px] border-[#451A03]" />
            <span className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full bg-[#D97706] border-[2px] border-[#451A03]" />

            <div className="absolute right-5 bottom-4 rotate-12 opacity-90">
              <CalendarCheckSvg size={54} />
            </div>

            <div className="relative z-10 max-w-[82%] pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FEF08A] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#451A03] border-[2.5px] border-[#451A03] shadow-[2px_2px_0px_#451A03] mb-2.5">
                <SparklesSvg size={14} /> {formatDateId(today)}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black leading-tight text-[#FEF3C7]">
                Batu Pijakan Sholat 5 Waktu
              </h2>
              <p className="mt-1.5 text-xs font-bold text-[#FDE68A] leading-relaxed">
                Lompati setiap batu pijakan di aliran sungai dengan mencatat
                sholat 5 waktumu hingga sampai ke seberang!
              </p>
            </div>
          </section>

          {/* Progress & Streak di Atas Batu Besar Tepi Sungai */}
          <section className="relative rounded-[28px] border-[4px] border-[#134E4A] bg-[#FEF3C7] p-5 shadow-[6px_6px_0px_#134E4A]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#B45309]">
                  <FireSvg size={22} /> Arus Streak Istiqomah
                </div>
                <p className="mt-1 font-display text-3xl font-black text-[#134E4A]">
                  {streak}{" "}
                  <span className="text-sm font-black text-[#78350F]">
                    Hari Beruntun
                  </span>
                </p>
                <p className="mt-1 text-xs font-bold text-[#451A03]">
                  {complete
                    ? "Masya Allah, 5 batu pijakan sungai hari ini sudah dilewati!"
                    : streak > 0
                      ? "Jangan biarkan langkahmu terhenti di tengah sungai!"
                      : "Mulai pijakan pertamamu menyeberangi sungai hari ini!"}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-[#38BDF8] px-4 py-2.5 shadow-[3px_3px_0px_#134E4A]">
                <span className="font-display text-2xl font-black text-[#134E4A]">
                  {recorded}/5
                </span>
                <span className="text-[10px] font-black uppercase tracking-wide text-[#134E4A]">
                  Batu Pijakan
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5 border-t-[3px] border-dashed border-[#134E4A]/25 pt-3.5 text-center">
              <div className="rounded-xl bg-[#DCFCE7] p-2 border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                <span className="text-[10px] font-black text-[#14532D]">
                  Tepat Waktu
                </span>
                <p className="font-black text-base text-[#15803D]">{tepat}</p>
              </div>
              <div className="rounded-xl bg-[#FEF08A] p-2 border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                <span className="text-[10px] font-black text-[#713F12]">
                  Masih Sempat
                </span>
                <p className="font-black text-base text-[#A16207]">
                  {WAKTU_ORDER.filter((w) => todayEntry[w] === "telat").length}
                </p>
              </div>
              <div className="rounded-xl bg-[#E0F2FE] p-2 border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                <span className="text-[10px] font-black text-[#0C4A6E]">
                  Sisa Batu
                </span>
                <p className="font-black text-base text-[#0284C7]">
                  {5 - recorded}
                </p>
              </div>
            </div>
          </section>

          {/* ALIRAN SUNGAI DENGAN 5 BATU PIJAKAN (STEPPING STONES) */}
          <section className="relative rounded-3xl border-[4px] border-[#134E4A] bg-[#0369A1] p-4 sm:p-6 shadow-[8px_8px_0px_#134E4A] overflow-hidden">
            {/* Garis Arus Sungai Mengalir */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 border-l-[4px] border-dashed border-[#7DD3FC]/50" />

            <div className="relative z-10 flex items-center justify-between mb-6 pb-3 border-b-[3px] border-dashed border-[#7DD3FC]/40">
              <div className="inline-block bg-[#15803D] text-[#FEF08A] px-3.5 py-1 rounded-xl border-[2.5px] border-[#134E4A] font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[2px_2px_0px_#134E4A]">
                5 Batu Pijakan Aliran Sungai
              </div>
              {recorded > 0 && (
                <button
                  type="button"
                  onClick={handleResetToday}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFE4E6] border-[2.5px] border-[#134E4A] px-3 py-1 text-[11px] font-black text-[#E11D48] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] cursor-pointer"
                >
                  <RefreshCwSvg size={13} /> Reset Batu
                </button>
              )}
            </div>

            {/* Deretan 5 Batu Pijakan Berkelok (Zig-Zag Stepping Stones) */}
            <div className="relative z-10 flex flex-col gap-7 pb-2">
              {WAKTU_LIST.map((w, idx) => {
                const currentStatus = todayEntry[w.key] ?? "belum";
                const statusInfo = getStatusInfo(currentStatus);
                const stoneShape = STONE_SHAPES[idx % STONE_SHAPES.length];
                const alignClass =
                  idx % 2 === 0
                    ? "self-start sm:w-[86%]"
                    : "self-end sm:w-[86%]";
                const isStepped = currentStatus !== "belum";

                return (
                  <div
                    key={w.key}
                    className={`relative w-full ${alignClass} transition-transform`}
                  >
                    {/* Cincin Riak Air Sungai di Sekeliling Batu */}
                    <div
                      className={`pointer-events-none absolute -inset-2 ${stoneShape} border-[3px] border-dashed border-[#BAE6FD]/60`}
                    />

                    {/* Batu Kecil Penghubung di Antara Batu Utama */}
                    {idx < WAKTU_LIST.length - 1 && (
                      <div
                        className={`pointer-events-none absolute -bottom-6 ${
                          idx % 2 === 0 ? "right-12" : "left-12"
                        } w-6 h-4 rounded-full bg-[#CBD5E1] border-[2.5px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] z-20`}
                      />
                    )}

                    {/* Badan Batu Pijakan Sungai */}
                    <div
                      className={`relative ${stoneShape} border-[4px] border-[#134E4A] p-4 sm:p-5 shadow-[6px_6px_0px_#0F172A] ${
                        isStepped ? "bg-[#F1F5F9]" : "bg-[#CBD5E1]"
                      }`}
                    >
                      {/* Nomor Urut Batu Pijakan */}
                      <span className="absolute -top-3 left-6 rounded-full bg-[#78350F] border-[2.5px] border-[#134E4A] px-2.5 py-0.5 text-[10px] font-black text-[#FEF08A] uppercase shadow-[2px_2px_0px_#134E4A]">
                        Batu #{idx + 1}
                      </span>

                      <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                            <WaktuIconSvg waktu={w.key} size={26} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-black text-base sm:text-lg text-[#0F172A]">
                                {w.label}
                              </h4>
                              <span
                                className="font-arabic font-bold text-sm text-[#0369A1]"
                                dir="rtl"
                              >
                                {w.arab}
                              </span>
                            </div>
                            <p className="text-[11px] font-black text-[#475569]">
                              {w.timeHint}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-xl border-[2.5px] border-[#134E4A] px-2.5 py-1 text-[10px] font-black bg-[#FFFFFF] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                          <StatusIconSvg status={currentStatus} size={13} />
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Tombol Pijakan Status Sholat */}
                      <div className="grid grid-cols-4 gap-2 pt-2.5 border-t-[2.5px] border-dashed border-[#64748B]/40">
                        {[
                          {
                            key: "tepat" as StatusSholat,
                            label: "Tepat",
                            bg: "bg-[#DCFCE7]",
                            text: "text-[#15803D]",
                          },
                          {
                            key: "telat" as StatusSholat,
                            label: "Sempat",
                            bg: "bg-[#FEF08A]",
                            text: "text-[#A16207]",
                          },
                          {
                            key: "jamak" as StatusSholat,
                            label: "Jamak",
                            bg: "bg-[#E0F2FE]",
                            text: "text-[#0369A1]",
                          },
                          {
                            key: "tidak" as StatusSholat,
                            label: "Lewat",
                            bg: "bg-[#FFE4E6]",
                            text: "text-[#B91C1C]",
                          },
                        ].map((s) => {
                          const isSelected = currentStatus === s.key;
                          return (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() =>
                                handleSetStatus(
                                  w.key,
                                  isSelected ? "belum" : s.key,
                                )
                              }
                              className={`flex flex-col items-center justify-center gap-1 rounded-xl border-[2.5px] border-[#134E4A] py-2 px-1 font-black uppercase transition-all cursor-pointer ${
                                isSelected
                                  ? `${s.bg} ${s.text} scale-105 shadow-[2px_2px_0px_#134E4A]`
                                  : "bg-[#FFFFFF] text-[#334155] opacity-85 hover:opacity-100"
                              }`}
                            >
                              <StatusIconSvg status={s.key} size={13} />
                              <span className="text-[9px] tracking-tight leading-none">
                                {s.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* RIWAYAT 7 HARI TERAKHIR: PAPAN TULIS KAYU DI TEPI SUNGAI & DAUN LONTAR */}
          <section className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#FEF08A] border-[3px] border-[#451A03] px-3.5 py-1.5 shadow-[3px_3px_0px_#451A03]">
              <CalendarSvg size={18} />
              <h3 className="font-display font-black text-xs sm:text-sm uppercase text-[#451A03]">
                Papan Kayu Tepi Sungai (7 Hari Terakhir)
              </h3>
            </div>

            <div className="relative rounded-2xl border-[4px] border-[#451A03] bg-[#78350F] p-4 sm:p-5 shadow-[6px_6px_0px_#451A03] space-y-2.5">
              {history.map((h, i) => {
                const rec = countRecorded(h.entry);
                const comp = isComplete(h.entry);

                return (
                  <div
                    key={h.date}
                    className={`flex items-center justify-between gap-3 rounded-xl border-[3px] border-[#451A03] p-2.5 transition-all ${
                      i === 0 ? "bg-[#FEF08A]" : "bg-[#FEF3C7]"
                    }`}
                  >
                    <div className="w-24 shrink-0">
                      <p className="text-xs font-black text-[#451A03]">
                        {i === 0 ? "Hari Ini" : formatDateShort(h.date)}
                      </p>
                    </div>

                    <div className="flex flex-1 items-center gap-1.5">
                      {WAKTU_ORDER.map((k) => {
                        const s = h.entry[k];
                        const info = s ? getStatusInfo(s) : null;
                        return (
                          <div
                            key={k}
                            title={`${k.toUpperCase()}: ${info?.label ?? "Belum"}`}
                            className="flex-1 h-7 rounded-lg border-[2px] border-[#451A03] bg-[#FFFBEB] flex items-center justify-center text-[10px] font-black shadow-[1.5px_1.5px_0px_#451A03]"
                          >
                            {s && s !== "belum" ? (
                              <StatusIconSvg status={s} size={13} />
                            ) : (
                              "-"
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="w-10 flex justify-end shrink-0">
                      {comp ? (
                        <CheckBadgeSvg size={24} />
                      ) : (
                        <span className="text-xs font-black text-[#451A03]">
                          {rec}/5
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
