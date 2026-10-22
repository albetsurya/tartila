import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
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
 * Style: stroke="#134E4A", strokeWidth="2.5", round joins, playful flat colors
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

/* Ilustrasi Status Sholat (Pengganti Emoji) */
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
      title="Jurnal Ibadah"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="min-h-full bg-[#F0FDF4] px-4 py-4 pb-32 space-y-5">
        {/* Hero Banner (Sticker Style) */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#134E4A] p-5 text-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#0D9488]">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full border-[6px] border-white/5" />
          <div className="absolute right-4 top-4 rotate-12 opacity-90">
            <CalendarCheckSvg size={52} />
          </div>

          <div className="relative z-10 max-w-[85%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2DD4BF]/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#2DD4BF] border border-[#2DD4BF]/30 mb-2">
              <SparklesSvg size={14} /> {formatDateId(today)}
            </span>
            <h2 className="font-display text-xl font-black leading-tight text-white">
              Sholat Tepat Waktu, Hati Jadi Tenang
            </h2>
            <p className="mt-1.5 text-[11px] font-medium text-white/80 leading-relaxed">
              Catat 5 waktu sholat fardhu setiap hari untuk menjaga istiqomah.
            </p>
          </div>
        </section>

        {/* Progress & Streak Card (Sticker Style) */}
        <section className="rounded-[24px] border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#D97706]">
                <FireSvg size={24} /> Streak Istiqomah
              </div>
              <p className="mt-1 font-display text-3xl font-black text-[#134E4A]">
                {streak}{" "}
                <span className="text-sm font-bold text-[#134E4A]/70">
                  Hari
                </span>
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#134E4A]/70">
                {complete
                  ? "Masya Allah, hari ini sudah lengkap!"
                  : streak > 0
                    ? "Pertahankan sholatmu hari ini!"
                    : "Mulai streak pertamamu sekarang!"}
              </p>
            </div>

            {/* Circular Meter (Sticker Style) */}
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-[#134E4A] bg-[#CCFBF1] px-4 py-2.5 shadow-[2px_2px_0px_#134E4A]">
              <span className="font-display text-2xl font-black text-[#0D9488]">
                {recorded}/5
              </span>
              <span className="text-[10px] font-black uppercase tracking-wide text-[#0D9488]">
                Tercatat
              </span>
            </div>
          </div>

          {/* Quick Summary stats */}
          <div className="mt-4 grid grid-cols-3 gap-2 border-t-2 border-[#134E4A]/10 pt-3 text-center">
            <div className="rounded-xl bg-[#F0FDF4] p-2 border border-[#134E4A]/10">
              <span className="text-[10px] font-bold text-[#134E4A]/60">
                Tepat Waktu
              </span>
              <p className="font-black text-sm text-[#15803D]">{tepat}</p>
            </div>
            <div className="rounded-xl bg-[#FEF9C3] p-2 border border-[#134E4A]/10">
              <span className="text-[10px] font-bold text-[#134E4A]/60">
                Masih Sempat
              </span>
              <p className="font-black text-sm text-[#A16207]">
                {WAKTU_ORDER.filter((w) => todayEntry[w] === "telat").length}
              </p>
            </div>
            <div className="rounded-xl bg-[#F1F5F9] p-2 border border-[#134E4A]/10">
              <span className="text-[10px] font-bold text-[#134E4A]/60">
                Sisa Sholat
              </span>
              <p className="font-black text-sm text-[#475569]">
                {5 - recorded}
              </p>
            </div>
          </div>
        </section>

        {/* 5 Waktu Sholat List (Sticker Style) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-sm text-[#134E4A]">
              Sholat 5 Waktu Hari Ini
            </h3>
            {recorded > 0 && (
              <button
                type="button"
                onClick={handleResetToday}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#E11D48] hover:underline"
              >
                <RefreshCwSvg size={14} /> Reset Hari Ini
              </button>
            )}
          </div>

          {WAKTU_LIST.map((w) => {
            const currentStatus = todayEntry[w.key] ?? "belum";
            const statusInfo = getStatusInfo(currentStatus);

            return (
              <div
                key={w.key}
                className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-3.5 shadow-[3px_3px_0px_#134E4A]"
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#F0FDF4] shadow-[2px_2px_0px_#134E4A]">
                      <WaktuIconSvg waktu={w.key} size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-black text-base text-[#134E4A]">
                          {w.label}
                        </h4>
                        <span
                          className="font-arabic text-sm text-[#0D9488]"
                          dir="rtl"
                        >
                          {w.arab}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-[#134E4A]/50">
                        {w.timeHint}
                      </p>
                    </div>
                  </div>

                  {/* Current Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-2.5 py-1 text-[11px] font-black ${statusInfo.bgClass} ${statusInfo.borderClass} ${statusInfo.textClass}`}
                  >
                    <StatusIconSvg status={currentStatus} size={14} />
                    {statusInfo.label}
                  </span>
                </div>

                {/* Status Selector Pills (Sticker Style) */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[
                    { key: "tepat" as StatusSholat, label: "Tepat" },
                    { key: "telat" as StatusSholat, label: "Sempat" },
                    { key: "jamak" as StatusSholat, label: "Jamak" },
                    { key: "tidak" as StatusSholat, label: "Terlewat" },
                  ].map((s) => {
                    const isSelected = currentStatus === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() =>
                          handleSetStatus(w.key, isSelected ? "belum" : s.key)
                        }
                        className={`flex items-center justify-center gap-1 rounded-xl border-2 border-[#134E4A] py-1.5 text-[11px] font-black transition-all ${
                          isSelected
                            ? "bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A] translate-y-[-1px]"
                            : "bg-[#F8FAFC] text-[#134E4A]/70 hover:bg-slate-100 shadow-none"
                        }`}
                      >
                        <StatusIconSvg status={s.key} size={13} />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* 7 Hari Terakhir History (Sticker Style) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarSvg size={18} />
            <h3 className="font-display font-black text-sm text-[#134E4A]">
              Riwayat 7 Hari Terakhir
            </h3>
          </div>

          <div className="rounded-[24px] border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A] space-y-2.5">
            {history.map((h, i) => {
              const rec = countRecorded(h.entry);
              const comp = isComplete(h.entry);

              return (
                <div
                  key={h.date}
                  className={`flex items-center justify-between gap-3 rounded-xl border-2 border-[#134E4A]/20 p-2.5 transition-all ${
                    i === 0 ? "bg-[#CCFBF1]/40 border-[#0D9488]" : "bg-white"
                  }`}
                >
                  <div className="w-24 shrink-0">
                    <p className="text-xs font-black text-[#134E4A]">
                      {i === 0 ? "Hari Ini" : formatDateShort(h.date)}
                    </p>
                  </div>

                  {/* 5 Waktu blocks */}
                  <div className="flex flex-1 items-center gap-1.5">
                    {WAKTU_ORDER.map((k) => {
                      const s = h.entry[k];
                      const info = s ? getStatusInfo(s) : null;
                      return (
                        <div
                          key={k}
                          title={`${k.toUpperCase()}: ${info?.label ?? "Belum"}`}
                          className={`flex-1 h-6 rounded-lg border-2 border-[#134E4A] flex items-center justify-center text-[10px] font-black ${
                            info
                              ? `${info.bgClass}${info.textClass}`
                              : "bg-slate-100 text-slate-300"
                          }`}
                        >
                          {s && s !== "belum" ? (
                            <StatusIconSvg status={s} size={12} />
                          ) : (
                            "·"
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkmark or Count */}
                  <div className="w-10 flex justify-end shrink-0">
                    {comp ? (
                      <CheckBadgeSvg size={24} />
                    ) : (
                      <span className="text-xs font-bold text-[#134E4A]/60">
                        {rec}/5
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <p className="text-center text-[10px] font-bold text-[#134E4A]/60 pt-1">
              Streak bertambah jika kelima waktu sholat tercatat lengkap dalam
              sehari.
            </p>
          </div>
        </section>
      </div>
    </NgajiCeriaLayout>
  );
}
