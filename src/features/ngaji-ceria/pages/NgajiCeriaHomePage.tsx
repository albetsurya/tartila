import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { DailyMissionsCard } from "../components/DailyMissionsCard";
import { CeriaGameLoading } from "../components/CeriaGameLoading";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { useNgajiCeriaProgress } from "../hooks/useNgajiCeriaProgress";
import { useNgajiCeriaStreak } from "../hooks/useNgajiCeriaStreak";
import { activityDate, yesterdayActivityDate } from "../utils/activityDate";
import { useEconomyStore, getTodayDateKey } from "../hooks/useEconomyStore";
import { MASCOT_NAME } from "@/constants/mascot";
import {
  GiftSvg,
  StarSvg,
  TilawatiSvg,
  FireSvg,
  StoreSvg,
  CrownSvg,
  GamepadSvg,
  HandsPrayingSvg,
  CoinSvg,
  HeartSvg,
  TicketSvg,
  SparklesSvg,
  CheckSvg,
  ChevronRightSvg,
  PlaySvg,
  XSvg,
} from "../../../components/ui/CustomIcons";
import { PetiHartaSvg } from "../../../components/ui/Illustrations";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { AvatarWithBadge } from "../../../components/ui/AvatarWithBadge";
import { triggerBibiReaction } from "../../../utils/bibiEvent";
import { TartilaLogo } from "../components/TartilaLogo";
import { OnboardingModal } from "../components/OnboardingModal";

interface DailyRewardItem {
  day: number;
  coins: number;
  hearts?: number;
  tickets?: number;
  label: string;
  image: React.ReactNode;
}

const DAILY_REWARDS: DailyRewardItem[] = [
  {
    day: 1,
    coins: 10,
    label: "10 Koin",
    image: <CoinSvg size={24} />,
  },
  {
    day: 2,
    coins: 15,
    label: "15 Koin",
    image: <CoinSvg size={24} />,
  },
  {
    day: 3,
    coins: 20,
    hearts: 1,
    label: "20 Koin + 1 Hati",
    image: <HeartSvg size={24} />,
  },
  {
    day: 4,
    coins: 25,
    label: "25 Koin",
    image: <CoinSvg size={24} />,
  },
  {
    day: 5,
    coins: 30,
    tickets: 1,
    label: "30 Koin + 1 Tiket",
    image: <TicketSvg size={24} />,
  },
  {
    day: 6,
    coins: 40,
    label: "40 Koin",
    image: <CoinSvg size={24} />,
  },
  {
    day: 7,
    coins: 100,
    label: "100 Koin + Peti Emas",
    image: <PetiHartaSvg size={32} />,
  },
];

const WEEK_DAYS = [
  { short: "Sen", full: "Senin" },
  { short: "Sel", full: "Selasa" },
  { short: "Rab", full: "Rabu" },
  { short: "Kam", full: "Kamis" },
  { short: "Jum", full: "Jumat" },
  { short: "Sab", full: "Sabtu" },
  { short: "Min", full: "Minggu" },
];

export default function NgajiCeriaHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(() => {
    return sessionStorage.getItem("trigger_ngaji_ceria_splash") === "true";
  });

  const { currentStreak, lastPlayedAt } = useNgajiCeriaStreak();
  const isRewardClaimedToday = useEconomyStore((s) => s.isRewardClaimedToday);
  const lastDailyClaimDate = useEconomyStore((s) => s.lastDailyClaimDate);
  const claimDailyReward = useEconomyStore((s) => s.claimDailyReward);
  const dailyRewardsClaimed = useEconomyStore((s) => s.dailyRewardsClaimed);
  const applyStreakMultiplier = useEconomyStore((s) => s.applyStreakMultiplier);
  const streakMultiplier = useEconomyStore((s) => s.streakMultiplier);

  const todayDateKey = getTodayDateKey();
  const todayClaimed =
    lastDailyClaimDate === todayDateKey || isRewardClaimedToday();
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const autoModalTriggeredRef = useRef(false);

  // Perhitungan kalender mingguan streak (Senin - Minggu)
  const now = new Date();
  const todayDayIdx = (now.getDay() + 6) % 7; // 0 = Senin, 1 = Selasa, ..., 6 = Minggu
  const todayStr = activityDate(now);
  const yesterdayStr = yesterdayActivityDate(now);

  const streakHistory = useMemo(() => {
    const history = Array<boolean>(7).fill(false);
    if (!currentStreak || currentStreak <= 0) return history;
    if (lastPlayedAt !== todayStr && lastPlayedAt !== yesterdayStr) return history;

    // Jika sudah mengaji hari ini, titik tumpu adalah hari ini.
    // Jika belum mengaji hari ini tapi streak masih aktif dari kemarin, titik tumpu adalah kemarin.
    const anchorIdx =
      lastPlayedAt === todayStr ? todayDayIdx : (todayDayIdx - 1 + 7) % 7;

    for (let i = 0; i < Math.min(7, currentStreak); i++) {
      const idx = (anchorIdx - i + 7) % 7;
      history[idx] = true;
    }
    return history;
  }, [currentStreak, lastPlayedAt, todayStr, yesterdayStr, todayDayIdx]);

  useEffect(() => {
    // Hanya tampilkan modal hadiah secara otomatis jika user sudah login dan belum klaim
    // Gunakan ref agar tidak terpicu ganda oleh React Strict Mode atau re-render
    if (autoModalTriggeredRef.current) return;
    if (user && !todayClaimed) {
      autoModalTriggeredRef.current = true;
      setShowDailyModal(true);
    }
  }, [user, todayClaimed]);

  useEffect(() => {
    applyStreakMultiplier(currentStreak);
  }, [currentStreak, applyStreakMultiplier]);

  const activeDay = Math.min(
    7,
    todayClaimed
      ? dailyRewardsClaimed[dailyRewardsClaimed.length - 1] || 1
      : (dailyRewardsClaimed.length % 7) + 1,
  );

  const currentReward = DAILY_REWARDS[activeDay - 1] || DAILY_REWARDS[0];

  const handleClaim = async () => {
    if (!user) {
      setShowDailyModal(false);
      navigate("/login");
      return;
    }
    if (todayClaimed || isClaiming) return;
    setIsClaiming(true);
    try {
      const ok = await claimDailyReward(activeDay, currentReward.coins, {
        hearts: currentReward.hearts,
        tickets: currentReward.tickets,
        userId: user.id,
      });
      if (ok) {
        triggerBibiReaction("success");
        setTimeout(() => {
          setShowDailyModal(false);
        }, 700);
      } else {
        triggerBibiReaction("error");
      }
    } catch (err) {
      console.error("[DailyReward] Claim error:", err);
      triggerBibiReaction("error");
    } finally {
      setIsClaiming(false);
    }
  };

  const finishLoading = React.useCallback(() => {
    sessionStorage.removeItem("trigger_ngaji_ceria_splash");
    setIsLoading(false);
  }, []);

  const displayName = user?.name ? user.name.split(" ")[0] : "Hamba Allah";
  const { currentJilid, currentPage, progressPercentage } =
    useNgajiCeriaProgress();
  const currentJilidNumber = Number(currentJilid.replace("jilid-", "")) || 1;

  return (
    <>
      {isLoading && (
        <CeriaGameLoading durationMs={1500} onLoaded={finishLoading} />
      )}

      <NgajiCeriaLayout title={<TartilaLogo />}>
        <div
          className={`px-4 py-5 md:px-6 md:py-8 space-y-5 md:space-y-7 bg-[#F0FDF4] min-h-full rounded-t-3xl transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AvatarWithBadge
                src={user?.photo_url || NGAJI_CERIA_ASSETS.avatarAnak}
                name={displayName}
                size={56}
                shape="rounded-2xl"
                role={user?.role}
                groupId={user?.group_id}
                gender={user?.gender ?? undefined}
              />
              <div>
                <p className="text-xs font-black text-[#134E4A]/60 uppercase tracking-widest mb-0.5">
                  Assalamu'alaikum,
                </p>
                <h2 className="font-display font-black text-xl md:text-2xl text-[#134E4A] leading-tight">
                  {displayName}
                </h2>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => setShowDailyModal(true)}
                className={`flex items-center gap-1.5 px-3 py-2.5 md:px-4 md:py-3 rounded-xl border-[3px] border-[#134E4A] text-xs md:text-sm font-black shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all shrink-0 ${
                  todayClaimed
                    ? "bg-gray-100 text-gray-500"
                    : "bg-[#FEF08A] text-[#134E4A]"
                }`}
              >
                <GiftSvg size={16} />
                {todayClaimed ? "Hadiah" : "Klaim!"}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 px-3 py-2.5 md:px-4 md:py-3 rounded-xl border-[3px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-xs md:text-sm font-black shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all shrink-0"
              >
                Masuk
              </button>
            )}
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-2 z-0 rotate-12">
              <div className="w-10 h-10 bg-[#FEF08A] border-[3px] border-[#134E4A] rounded-full flex items-center justify-center shadow-[2px_2px_0px_#134E4A]">
                <StarSvg size={20} />
              </div>
            </div>
            <div className="absolute -bottom-3 -right-2 z-0 -rotate-12">
              <div className="w-12 h-12 bg-[#FF6B6B] border-[3px] border-[#134E4A] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#134E4A]">
                <TilawatiSvg size={24} />
              </div>
            </div>

            <div className="relative z-10 bg-[#134E4A] rounded-[24px] p-5 md:p-8 border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#FF6B6B] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full" />
                <svg
                  className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <circle cx="50" cy="50" r="40" />
                  <circle cx="20" cy="80" r="25" />
                  <circle cx="80" cy="80" r="25" />
                </svg>
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#FEF08A] rounded-full opacity-50" />
                <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-[#FF6B6B] rounded-full opacity-50" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FF6B6B] text-white text-[11px] md:text-xs font-black px-2.5 py-1 rounded-md border-2 border-white/20 rotate-2 shadow-sm">
                    TILAWATI {currentJilidNumber}
                  </span>
                  <span className="text-[#FEF08A] text-xs font-bold bg-black/20 px-2 py-0.5 rounded-md">
                    Hal. {currentPage}
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-white leading-tight mb-4 max-w-[80%]">
                  Lanjutkan <br /> Petualanganmu!
                </h3>

                <div className="flex items-center gap-3 md:gap-5">
                  <button
                    onClick={() => {
                      triggerBibiReaction("play");
                      navigate(
                        `/member/ngaji-ceria/quiz/play?jilid=${currentJilidNumber}&hal=${currentPage}`,
                      );
                    }}
                    className="flex-1 max-w-xs py-3 md:py-3.5 rounded-xl bg-[#0D9488] text-white font-black text-sm md:text-base flex items-center justify-center gap-2 border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[#0F766E]"
                  >
                    <PlaySvg size={16} />
                    Lanjut Ngaji
                  </button>

                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] border-[#FEF08A] flex items-center justify-center bg-[#134E4A] shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,0.3)] relative">
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#FEF08A"
                        strokeWidth="8"
                        strokeDasharray={`${progressPercentage * 2.82} 282`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-sm font-black text-[#FEF08A] relative z-10">
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FEF3C7] rounded-2xl border-[3px] border-[#134E4A] p-4 shadow-[3px_3px_0px_#134E4A]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] flex items-center justify-center">
                  <FireSvg size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#134E4A]">
                    Streak Mengaji
                  </h4>
                  <p className="text-[10px] font-bold text-[#B45309]">
                    Bonus {streakMultiplier}x Koin
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#EA580C]">
                  {currentStreak}
                </span>
                <span className="text-[10px] font-bold text-[#B45309] ml-1">
                  Hari
                </span>
              </div>
            </div>

            {/* Barisan Ikon Api 7 Hari (Senin - Minggu) */}
            <div className="flex items-center justify-between gap-1 px-1 mt-2">
              {WEEK_DAYS.map((day, idx) => {
                const isDone = Boolean(streakHistory[idx]);
                const isToday = idx === todayDayIdx;

                return (
                  <div
                    key={idx}
                    className="flex flex-1 flex-col items-center gap-1.5 min-w-0"
                  >
                    {/* Lingkaran Ikon Api */}
                    <div
                      title={`${day.full}${isDone ? ": Streak Aktif" : isToday ? ": Hari Ini" : ""}`}
                      className={`relative w-9 h-9 rounded-full border-[3px] border-[#134E4A] flex items-center justify-center transition-all ${
                        isDone
                          ? "bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A]"
                          : isToday
                            ? "bg-white ring-2 ring-[#EA580C] ring-offset-2 ring-offset-[#FEF3C7]"
                            : "bg-white/80"
                      }`}
                    >
                      <img
                        src={
                          isDone
                            ? NGAJI_CERIA_ASSETS.apiStreak
                            : NGAJI_CERIA_ASSETS.apiStreakMati
                        }
                        alt={isDone ? `Streak ${day.full} Aktif` : `${day.full} Belum Aktif`}
                        className={`w-5 h-5 object-contain transition-transform ${
                          isDone
                            ? "scale-110 drop-shadow-[0_2px_3px_rgba(234,88,12,0.35)]"
                            : "opacity-35 grayscale"
                        }`}
                      />
                    </div>

                    {/* Label Nama Hari (Selalu tampil konsisten di bawah lingkaran) */}
                    <span
                      className={`text-[10px] font-black transition-colors ${
                        isToday
                          ? "text-[#EA580C]"
                          : isDone
                            ? "text-[#134E4A]"
                            : "text-[#134E4A]/40"
                      }`}
                    >
                      {day.short}
                    </span>

                    {/* Indikator Titik Hari Ini */}
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] -mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TARTILA ARENA BANNER (REAL-TIME MULTIPLAYER & UJIAN) */}
          <div className="relative rounded-3xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-5 shadow-[4px_4px_0px_#134E4A] overflow-hidden">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1 max-w-[70%]">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border-2 border-[#134E4A] bg-[#0D9488] text-white text-[10px] font-black shadow-[1px_1px_0px_#134E4A]">
                  <SparklesSvg size={12} /> MULTIPLAYER KAHOOT-STYLE
                </span>
                <h3 className="font-display text-xl md:text-2xl font-black text-[#134E4A] leading-tight">
                  Tartila Arena
                </h3>
                <p className="text-xs font-bold text-[#134E4A]/80">
                  Uji kemampuan tilawati & tajwid secara real-time bersama teman sekelas atau buat ujian resmi TPQ!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/arena/join")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-xs md:text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all hover:bg-[#0F766E]"
                >
                  <GamepadSvg size={16} /> Gabung PIN
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/arena/host/create")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-[3px] border-[#134E4A] bg-white text-[#134E4A] font-black text-xs md:text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all hover:bg-gray-50"
                >
                  <CrownSvg size={16} /> Buat Room
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5 md:gap-4">
            {[
              {
                label: "Jilid",
                to: "/member/ngaji-ceria/explore/tilawati",
                svg: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
                      fill="#2DD4BF"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 5C9 3.5 5 3.5 5 6V17C5 17 9 15 12 17C15 15 19 17 19 17V6C19 3.5 15 3.5 12 5Z"
                      fill="#FFFFFF"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 5V17"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                label: "Jelajah",
                to: "/member/ngaji-ceria/map",
                svg: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6L8 4L16 6L21 4V18L16 20L8 18L3 20V6Z"
                      fill="#FEF08A"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 4V18M16 6V20"
                      stroke="#134E4A"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 16C12 16 17 12 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 12 12 16 12 16Z"
                      fill="#FF6B6B"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="8" r="2.5" fill="#FFFFFF" />
                  </svg>
                ),
              },
              {
                label: "Laporan",
                to: "/member/ngaji-ceria/profile",
                svg: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4"
                      y="4"
                      width="16"
                      height="17"
                      rx="2.5"
                      fill="#FFFFFF"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M9 3.5H15C15.5523 3.5 16 3.94772 16 4.5V6H8V4.5C8 3.94772 8.44772 3.5 9 3.5Z"
                      fill="#38BDF8"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 16V13M12 16V9M16 16V11"
                      stroke="#0D9488"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
              },
              {
                label: "Rank",
                to: "/member/ngaji-ceria/leaderboard",
                svg: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 3H18V8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8V3Z"
                      fill="#FBBF24"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 14V18M8 18H16V21H8V18Z"
                      fill="#FF6B6B"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 6H3V8C3 10.2091 4.79086 12 7 12M18 6H21V8C21 10.2091 19.2091 12 17 12"
                      stroke="#134E4A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  triggerBibiReaction("click");
                  navigate(action.to);
                }}
                className="flex flex-col items-center justify-center py-3 px-1 md:py-4 md:px-3 rounded-2xl border-[3px] border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F0FDF4] border-2 border-[#134E4A] flex items-center justify-center mb-1.5">
                  {action.svg}
                </div>
                <span className="text-[11px] md:text-xs font-black text-[#134E4A] text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          <div>
            <DailyMissionsCard />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-5">
            <button
              onClick={() => {
                triggerBibiReaction("click");
                navigate("/member/ngaji-ceria/warung-santri");
              }}
              className="text-left bg-[#FFE4E6] rounded-2xl border-[3px] border-[#134E4A] p-3.5 md:p-5 shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-3 relative overflow-hidden"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border-2 border-[#134E4A] flex items-center justify-center shrink-0 z-10">
                <StoreSvg size={20} />
              </div>
              <div className="relative z-10">
                <p className="text-sm md:text-base font-black text-[#134E4A] leading-tight">
                  Warung
                </p>
                <p className="text-[10px] md:text-xs font-bold text-[#134E4A]/60">
                  Tukar Koin
                </p>
              </div>
              <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none">
                <StoreSvg size={48} />
              </div>
            </button>

            <button
              onClick={() => {
                triggerBibiReaction("click");
                navigate("/member/ngaji-ceria/premium");
              }}
              className="text-left bg-[#FEF08A] rounded-2xl border-[3px] border-[#134E4A] p-3.5 md:p-5 shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-3 relative overflow-hidden"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border-2 border-[#134E4A] flex items-center justify-center shrink-0 z-10">
                <CrownSvg size={20} />
              </div>
              <div className="relative z-10">
                <p className="text-sm md:text-base font-black text-[#134E4A] leading-tight">
                  VIP Pass
                </p>
                <p className="text-[10px] md:text-xs font-bold text-[#B45309]">
                  Bebas Batas
                </p>
              </div>
              <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none">
                <CrownSvg size={48} />
              </div>
            </button>
          </div>

          <section>
            <SectionHeader
              title="Petualangan Tilawati"
              action={{
                label: "Semua",
                onClick: () => navigate("/member/ngaji-ceria/explore/tilawati"),
              }}
            />
            <div className="flex gap-3 overflow-x-auto pt-2 pb-3 px-1 scrollbar-hide">
              <div className="shrink-0 w-40 bg-white border-[3px] border-[#134E4A] rounded-2xl p-4 shadow-[3px_3px_0px_#134E4A] relative">
                <div className="absolute top-2 right-2 bg-[#0D9488] text-white text-[10px] font-black px-2 py-0.5 rounded-md border-2 border-[#134E4A] z-10">
                  AKTIF
                </div>
                <TilawatiSvg size={24} className="mb-3" />
                <p className="font-display font-black text-sm text-[#134E4A]">
                  Tilawati {currentJilidNumber}
                </p>
                <div className="w-full bg-gray-100 h-3 rounded-full border-2 border-[#134E4A] mt-3 overflow-hidden">
                  <div
                    className="bg-[#0D9488] h-full border-r-2 border-[#134E4A]"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="shrink-0 w-40 bg-gray-50 border-[3px] border-dashed border-[#134E4A]/30 rounded-2xl p-4 opacity-75 flex flex-col justify-between">
                <div>
                  <TilawatiSvg size={24} className="mb-3 opacity-60" />
                  <p className="font-display font-black text-sm text-gray-500">
                    Tilawati {currentJilidNumber + 1}
                  </p>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full border-2 border-gray-300 mt-3" />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] p-4">
            <div className="flex items-center justify-between mb-3 border-b-2 border-dashed border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0F0] border-2 border-[#FF6B6B]/30 flex items-center justify-center">
                  <HandsPrayingSvg size={16} />
                </div>
                <h4 className="font-display font-black text-sm text-[#134E4A]">
                  Doa Hari Ini
                </h4>
              </div>
              <button
                onClick={() => navigate("/member/ngaji-ceria/explore/doa")}
                className="text-[11px] font-black text-[#0D9488] flex items-center gap-0.5"
              >
                Semua <ChevronRightSvg size={12} />
              </button>
            </div>

            <div className="bg-[#F0FDF4] rounded-xl border-2 border-[#0D9488]/30 p-5 text-center">
              <p
                className="font-arabic text-2xl leading-loose text-[#134E4A]"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
            </div>
            <p className="mt-3 text-center text-xs font-bold text-[#0D9488] italic">
              "Bismillahirrahmanirrahim"
            </p>
          </section>

          <div className="h-24" aria-hidden="true" />
        </div>

        <AnimatePresence>
          {showDailyModal && user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 260 }}
                className="relative w-full max-w-sm rounded-[28px] border-[3px] border-[#134E4A] bg-[#F0FDF4] p-5 shadow-[6px_6px_0px_#134E4A] text-center max-h-[90vh] overflow-y-auto"
              >
                <button
                  type="button"
                  onClick={() => {
                    autoModalTriggeredRef.current = true;
                    setShowDailyModal(false);
                  }}
                  className="absolute right-4 top-4 w-8 h-8 rounded-full border-2 border-[#134E4A] bg-white flex items-center justify-center text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-0.5 z-10"
                >
                  <XSvg size={16} />
                </button>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#FEF08A] border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] flex items-center justify-center mb-2">
                    <PetiHartaSvg size={48} />
                  </div>
                  <h3 className="font-display text-xl font-black text-[#134E4A]">
                    Hadiah Login Harian
                  </h3>
                  <p className="text-xs font-bold text-[#134E4A]/60 mt-1">
                    Istiqomah mengaji setiap hari!
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-[#134E4A] bg-[#FEF3C7] px-3 py-1 text-[11px] font-black text-[#B45309] shadow-[2px_2px_0px_#134E4A]">
                    <FireSvg size={22} />
                    <span>Streak: {currentStreak} Hari</span>
                    {streakMultiplier > 1 && (
                      <span className="bg-[#EA580C] text-white px-1.5 py-0.5 rounded-full text-[9px] font-black">
                        Bonus {streakMultiplier}x!
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                  {DAILY_REWARDS.map((r, idx) => {
                    const isClaimed =
                      idx + 1 < activeDay ||
                      (idx + 1 === activeDay && todayClaimed);
                    const isCurrent = idx + 1 === activeDay && !todayClaimed;
                    const finalCoins = Math.round(
                      r.coins * (isCurrent ? streakMultiplier : 1),
                    );

                    return (
                      <div
                        key={r.day}
                        className={`rounded-2xl border-[2px] p-2 text-center flex flex-col items-center justify-between transition-all ${
                          idx === 6
                            ? "col-span-2 flex-row justify-center gap-3 p-3 text-left"
                            : ""
                        } ${
                          isClaimed
                            ? "border-[#134E4A] bg-[#CCFBF1] opacity-75 shadow-[1px_1px_0px_#134E4A]"
                            : isCurrent
                              ? "border-[3px] border-[#134E4A] bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A] -translate-y-0.5 ring-2 ring-[#0D9488]"
                              : "border-dashed border-[#134E4A]/30 bg-white opacity-70"
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-black text-[#134E4A]/70 uppercase block">
                            Hari {r.day}
                          </span>
                          <div className="w-8 h-8 flex items-center justify-center my-1 mx-auto">
                            {r.image}
                          </div>
                          <span className="flex items-center justify-center gap-0.5 text-[11px] font-black text-[#134E4A]">
                            <span>+{finalCoins}</span>
                            <CoinSvg size={12} />
                          </span>
                        </div>

                        <div className={idx === 6 ? "mt-1" : ""}>
                          {isClaimed ? (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-[#0D9488] bg-white px-1.5 py-0.5 rounded-md border border-[#0D9488]">
                              <CheckSvg size={10} /> Sudah
                            </span>
                          ) : isCurrent ? (
                            <span className="text-[9px] font-black text-white bg-[#0D9488] px-1.5 py-0.5 rounded-md border border-[#134E4A]">
                              Klaim!
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-[#134E4A]/40 inline-flex items-center justify-center">
                              <GiftSvg size={12} />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  {todayClaimed ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-2xl border-[3px] border-[#134E4A] bg-gray-200 text-[#134E4A]/50 font-black text-sm cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <CheckSvg size={16} /> Sudah Diklaim Hari Ini
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isClaiming}
                      onClick={handleClaim}
                      className="w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[4px_4px_0px_#134E4A] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <SparklesSvg size={18} />
                      <span>
                        {isClaiming
                          ? "Mengklaim Hadiah..."
                          : `Klaim Hadiah Hari ${activeDay} (+${Math.round(currentReward.coins * streakMultiplier)})`}
                      </span>
                      <CoinSvg size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Onboarding Peran (Santri vs Ustadz) */}
        <OnboardingModal />
      </NgajiCeriaLayout>
    </>
  );
}
