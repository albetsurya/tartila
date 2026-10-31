import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { DailyMissionsCard } from "../components/DailyMissionsCard";
import { CeriaGameLoading } from "../components/CeriaGameLoading";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { useNgajiCeriaProgress } from "../hooks/useNgajiCeriaProgress";
import { useNgajiProgress, getRank } from "./games/_shared/progression";
import { useNgajiCeriaStreak } from "../hooks/useNgajiCeriaStreak";
import {
  activityDate,
  yesterdayActivityDate,
  getTimeUntilDailyResetWib,
} from "../utils/activityDate";
import { useEconomyStore, getTodayDateKey } from "../hooks/useEconomyStore";
import { ngajiCeriaApi } from "../services/ngajiCeriaApi";
import {
  GiftSvg,
  TilawatiLearningSvg,
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
  ClockSvg,
  LockSvg,
  Loader2Svg,
  TilawatiMapSvg,
  GraduationCapSvg,
  SwordsSvg,
} from "../../../components/ui/CustomIcons";
import { PetiHartaSvg } from "../../../components/ui/Illustrations";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { AvatarWithBadge } from "../../../components/ui/AvatarWithBadge";
import {
  AvatarSantriSvg,
  AvatarSantriAccessory,
} from "../../../components/ui/Illustrations";
import { resolveMascotGender } from "@/utils/mascotHelper";
import { triggerBibiReaction } from "../../../utils/bibiEvent";
import { TartilaLogo } from "../components/TartilaLogo";
import { OnboardingModal } from "../components/OnboardingModal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { AnimatedProgressBar } from "@/components/ui/AnimatedProgressBar";
import { isUstadzUser, isTartilaAdmin } from "@/lib/roles";
import { AppModal } from "@/components/ui/AppModal";
import {
  listJoinedClassrooms,
  type ClassroomRoom,
} from "@/services/classroomService";
import AppBottomSheet from "@/components/ui/AppBottomSheet";
import { RankJourneyModal } from "../components/RankJourneyModal";
import RankBadgeSvg from "@/components/ui/RankBadgeSvg";

interface DailyRewardItem {
  day: number;
  coins: number;
  hearts?: number;
  tickets?: number;
  label: string;
  image: React.ReactNode;
}

const DAILY_REWARDS: DailyRewardItem[] = [
  { day: 1, coins: 10, label: "10 Koin", image: <CoinSvg size={24} /> },
  { day: 2, coins: 15, label: "15 Koin", image: <CoinSvg size={24} /> },
  {
    day: 3,
    coins: 20,
    hearts: 1,
    label: "20 Koin + 1 Hati",
    image: <HeartSvg size={24} />,
  },
  { day: 4, coins: 25, label: "25 Koin", image: <CoinSvg size={24} /> },
  {
    day: 5,
    coins: 30,
    tickets: 1,
    label: "30 Koin + 1 Tiket",
    image: <TicketSvg size={24} />,
  },
  { day: 6, coins: 40, label: "40 Koin", image: <CoinSvg size={24} /> },
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
  const { user, isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(() => {
    return sessionStorage.getItem("trigger_ngaji_ceria_splash") === "true";
  });
  const [joinedClassrooms, setJoinedClassrooms] = useState<ClassroomRoom[]>([]);
  const [joinedClassroomsError, setJoinedClassroomsError] = useState("");

  const { currentStreak, lastPlayedAt } = useNgajiCeriaStreak();
  const streak = useEconomyStore((s) => s.loginStreak);
  const lastClaim = useEconomyStore(
    (s) => s.lastClaimDate || s.lastDailyClaimDate,
  );
  const dailyClaimed = useEconomyStore((s) => s.dailyClaimed);
  const coins = useEconomyStore((s) => s.coins);
  const isLoadingProfile = useEconomyStore((s) => s.isLoadingProfile);
  const isRewardClaimedToday = useEconomyStore((s) => s.isRewardClaimedToday);
  const claimDailyReward = useEconomyStore((s) => s.claimDailyReward);
  const dailyRewardsClaimed = useEconomyStore((s) => s.dailyRewardsClaimed);
  const applyStreakMultiplier = useEconomyStore((s) => s.applyStreakMultiplier);
  const streakMultiplier = useEconomyStore((s) => s.streakMultiplier);
  const avatarMode = useEconomyStore((s) => s.avatarMode || "avatar");
  const equippedAvatarAccessory = useEconomyStore(
    (s) => s.equippedAvatarAccessory,
  );
  const tilaGender = useEconomyStore((s) => s.tilaGender);

  const todayDateKey = getTodayDateKey();
  const isClaimedToday =
    dailyClaimed || lastClaim === todayDateKey || isRewardClaimedToday();
  const todayClaimed = isClaimedToday;
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const autoModalTriggeredRef = useRef(false);
  const [isArenaSheetOpen, setIsArenaSheetOpen] = useState(false);

  useEffect(() => {
    if (user) {
      useEconomyStore.getState().initialize();
    }
  }, [user]);

  const now = new Date();
  const effectiveWib = new Date(now.getTime() + 3 * 3600 * 1000);
  const todayDayIdx = (effectiveWib.getUTCDay() + 6) % 7;
  const todayStr = activityDate(now);
  const yesterdayStr = yesterdayActivityDate(now);

  const [timeUntilReset, setTimeUntilReset] = useState(
    () => getTimeUntilDailyResetWib().formatted,
  );

  useEffect(() => {
    if (!showDailyModal) return;
    const updateCountdown = () => {
      setTimeUntilReset(getTimeUntilDailyResetWib().formatted);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 10000);
    return () => clearInterval(interval);
  }, [showDailyModal]);

  const effectiveStreak = Math.max(streak, currentStreak);

  useEffect(() => {
    applyStreakMultiplier(effectiveStreak);
  }, [effectiveStreak, applyStreakMultiplier]);

  const streakHistory = useMemo(() => {
    const history = Array<boolean>(7).fill(false);
    if (effectiveStreak <= 0) return history;

    const isTodayActive = isClaimedToday || lastPlayedAt === todayStr;
    const isYesterdayActive =
      lastClaim === yesterdayStr || lastPlayedAt === yesterdayStr;
    if (!isTodayActive && !isYesterdayActive) return history;

    const anchorIdx = isTodayActive ? todayDayIdx : (todayDayIdx - 1 + 7) % 7;

    for (let i = 0; i < Math.min(7, effectiveStreak); i++) {
      const idx = (anchorIdx - i + 7) % 7;
      history[idx] = true;
    }
    return history;
  }, [
    effectiveStreak,
    isClaimedToday,
    lastClaim,
    lastPlayedAt,
    todayStr,
    yesterdayStr,
    todayDayIdx,
  ]);

  useEffect(() => {
    if (isAuthLoading || isLoadingProfile || !user) return;
    if (autoModalTriggeredRef.current) return;

    const sessionKey = `ngajiceria:auto-modal:${todayDateKey}`;
    if (sessionStorage.getItem(sessionKey) === "true") {
      autoModalTriggeredRef.current = true;
      return;
    }

    (async () => {
      try {
        const res = await ngajiCeriaApi.getPendingMissions();
        if (res.hasPendingMissions) {
          autoModalTriggeredRef.current = true;
          setShowDailyModal(true);
        }
      } catch {
        /* Status utama ada di API; kalau error, modal tidak tampil. */
      } finally {
        autoModalTriggeredRef.current = true;
        sessionStorage.setItem(sessionKey, "true");
      }
    })();
  }, [user, isAuthLoading, isLoadingProfile, todayDateKey]);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const res = await listJoinedClassrooms(user.id);
        if (res.ok) setJoinedClassrooms(res.data);
      } catch {
        /* ignore: section hanya muncul bila ada kelas */
      }
    })();
  }, [user?.id]);

  const activeDay = Math.min(
    7,
    todayClaimed
      ? effectiveStreak > 0
        ? ((effectiveStreak - 1) % 7) + 1
        : dailyRewardsClaimed[dailyRewardsClaimed.length - 1] || 1
      : effectiveStreak > 0
        ? (effectiveStreak % 7) + 1
        : (dailyRewardsClaimed.length % 7) + 1,
  );

  const currentReward = DAILY_REWARDS[activeDay - 1] || DAILY_REWARDS[0];

  const handleClaim = async () => {
    if (!user) {
      setIsManualOpen(false);
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
          setIsManualOpen(false);
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

  // XP Progress
  const progressData = useNgajiProgress();
  const rank = getRank(progressData.xp);
  const currentXp = progressData.xp;
  const nextXp = rank.nextXp || currentXp;
  const xpProgressPercentage =
    nextXp > rank.minXp
      ? Math.min(
          100,
          Math.max(0, ((currentXp - rank.minXp) / (nextXp - rank.minXp)) * 100),
        )
      : 100;

  const [isRankModalOpen, setIsRankModalOpen] = useState(false);

  return (
    <>
      {isLoading && (
        <CeriaGameLoading durationMs={1500} onLoaded={finishLoading} />
      )}

      <NgajiCeriaLayout title={<TartilaLogo />}>
        <div
          className={`space-y-6 px-3 py-5 sm:px-4 md:space-y-8 md:px-6 md:py-8 ${
            isLoading ? "opacity-0" : "opacity-100"
          } min-h-full rounded-t-3xl bg-[#F0FDF4] text-[#134E4A] transition-opacity duration-200`}
        >
          {/* SECTION 1: Kartu Sambutan (Diperbaiki ke Neo-Brutalism) */}
          <section className="flex items-center justify-between gap-3 rounded-2xl border-2 border-[#134E4A] bg-[#FFFFFF] px-3 py-3 shadow-[2px_2px_0px_#134E4A] sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              {avatarMode === "photo" ? (
                <AvatarWithBadge
                  src={user?.photo_url || NGAJI_CERIA_ASSETS.avatarAnak}
                  name={displayName}
                  size={52}
                  shape="rounded-2xl"
                  role={user?.role}
                  groupId={user?.group_id}
                  gender={user?.gender ?? undefined}
                />
              ) : (
                <AvatarSantriSvg
                  size={52}
                  gender={resolveMascotGender(tilaGender)}
                  accessory={
                    (equippedAvatarAccessory || "none") as AvatarSantriAccessory
                  }
                  mood="happy"
                  className="shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="mb-0.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#134E4A]/60 sm:text-xs">
                  Assalamu'alaikum,
                </p>
                <h2 className="truncate font-display text-lg font-black leading-tight text-[#134E4A] sm:text-xl">
                  {displayName}
                </h2>
                <p className="mt-0.5 text-xs font-medium text-[#134E4A]/60">
                  Siap melanjutkan belajar hari ini?
                </p>
              </div>
            </div>

            {user ? (
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                onClick={() => {
                  setIsManualOpen(true);
                  setShowDailyModal(true);
                }}
                className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-2 text-xs font-black shadow-[2px_2px_0px_#134E4A] transition-colors sm:px-4 sm:text-sm ${
                  todayClaimed
                    ? "bg-[#F0FDF4] text-[#134E4A]/70"
                    : "bg-[#FEF08A] text-[#134E4A] hover:bg-[#FDE047]"
                }`}
              >
                <GiftSvg size={17} />
                {todayClaimed ? "Hadiah" : "Klaim hadiah"}
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                onClick={() => navigate("/login")}
                className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-2 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] sm:px-4 sm:text-sm"
              >
                Masuk
              </motion.button>
            )}
          </section>

          {/* SECTION 2: Hero Card */}
          <section className="relative isolate overflow-hidden rounded-[24px] border-[3px] border-[#134E4A] bg-[#134E4A] p-4 shadow-[4px_4px_0px_#0D9488] sm:p-5">
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden="true"
            >
              <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/[0.06]" />
              <div className="absolute -bottom-12 -right-6 h-36 w-36 rounded-full border-[18px] border-white/[0.04]" />
            </div>

            <div className="relative z-10">
              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-lg border border-white/20 bg-[#FF6B6B] px-2 py-0.5 text-[10px] font-black text-white sm:px-2.5 sm:py-1 sm:text-xs">
                  TILAWATI {currentJilidNumber}
                </span>
                <span className="rounded-lg border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#FEF08A] sm:px-2.5 sm:py-1 sm:text-xs">
                  Halaman {currentPage}
                </span>
              </div>

              <h3 className="mb-1.5 max-w-[18rem] font-display text-xl font-black leading-tight text-white sm:text-2xl lg:text-3xl">
                Lanjutkan petualanganmu!
              </h3>

              <p className="mb-4 hidden max-w-sm text-sm leading-relaxed text-white/75 sm:block">
                Sedikit demi sedikit, bacaanmu semakin lancar.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97, y: 1 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  onClick={() => {
                    triggerBibiReaction("play");
                    navigate(
                      `/member/ngaji-ceria/quiz/play?jilid=${currentJilidNumber}&hal=${currentPage}`,
                    );
                  }}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#092F2C] bg-[#0D9488] px-4 py-2.5 text-sm font-black text-white shadow-[3px_3px_0px_#092F2C] transition-colors hover:bg-[#0F766E] sm:flex-none sm:px-6 sm:text-base"
                >
                  <PlaySvg size={17} />
                  Lanjut Ngaji
                </motion.button>
              </div>

              {/* XP Progress Bar Terintegrasi (Hero Section) */}
              <div
                className="mt-4 flex cursor-pointer items-center gap-3 border-t border-white/10 pt-3 transition-transform active:scale-95"
                onClick={() => setIsRankModalOpen(true)}
              >
                {/* Ilustrasi Medali (Dibungkus putih agar kontras dengan background hijau gelap) */}
                <div className="shrink-0 rounded-full border-2 border-[#092F2C] bg-white shadow-[1px_1px_0px_#092F2C]">
                  <RankBadgeSvg
                    rankId={rank.id as any}
                    size={44}
                    isActive={true}
                  />
                </div>

                {/* Teks & Bar */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-[#FEF08A] sm:text-[11px]">
                    <span className="truncate pr-2">Rank: {rank.title}</span>
                    <span className="shrink-0">
                      Sisa {Math.max(0, nextXp - currentXp)} XP lagi!
                    </span>
                  </div>
                  <AnimatedProgressBar
                    value={xpProgressPercentage}
                    barClassName="bg-[#F59E0B]"
                    className="h-2 w-full rounded-full border border-[#092F2C] bg-[#0E3B37]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Quick Menu */}
          <section aria-label="Navigasi utama">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-black text-[#134E4A] sm:text-lg">
                  Mau ke mana hari ini?
                </h3>
                <p className="mt-0.5 text-xs text-[#134E4A]/60 sm:text-sm">
                  Pilih petualangan yang ingin kamu jelajahi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {[
                {
                  label: "Jilid",
                  to: "/member/ngaji-ceria/explore/tilawati",
                  icon: <TilawatiLearningSvg size={25} />,
                  iconBg: "bg-[#CCFBF1]",
                },
                {
                  label: "Jelajah",
                  to: "/member/ngaji-ceria/map",
                  icon: <TilawatiMapSvg size={24} />,
                  iconBg: "bg-[#FEF08A]",
                },
                {
                  label: "Kelas Saya",
                  to: "/member/ngaji-ceria/kelas",
                  icon: <GraduationCapSvg size={24} />,
                  iconBg: "bg-[#DBEAFE]",
                },
                {
                  label: "Rank",
                  to: "/member/ngaji-ceria/leaderboard",
                  icon: <CrownSvg size={24} />,
                  iconBg: "bg-[#FDE68A]",
                },
              ].map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => {
                    triggerBibiReaction("click");
                    navigate(action.to);
                  }}
                  className="group flex min-h-[104px] min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[#134E4A] bg-[#FFFFFF] px-1.5 py-3 text-center shadow-[2px_2px_0px_#134E4A] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none sm:min-h-[116px] sm:rounded-[20px] sm:py-4"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#134E4A]/10 ${action.iconBg} text-[#134E4A] sm:h-12 sm:w-12`}
                  >
                    {action.icon}
                  </span>
                  <span className="text-[11px] font-extrabold leading-tight text-[#134E4A] sm:text-xs">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 4: Tilawati Map */}
          <section>
            <SectionHeader
              title="Petualangan Tilawati"
              action={{
                label: "Semua",
                onClick: () => navigate("/member/ngaji-ceria/explore/tilawati"),
              }}
            />
            <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3 pt-3">
              {[1, 2, 3, 4, 5, 6].map((jilid) => {
                const isBypass =
                  isUstadzUser(user) || isTartilaAdmin(user?.role);
                const isActive = jilid === currentJilidNumber;
                const isCompleted = jilid < currentJilidNumber;
                const isLocked = isBypass ? false : jilid > currentJilidNumber;
                const isBypassedLock = isBypass && jilid > currentJilidNumber;

                return (
                  <button
                    key={jilid}
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked) {
                        triggerBibiReaction("click");
                        navigate(
                          `/member/ngaji-ceria/explore/tilawati/${jilid}`,
                        );
                      }
                    }}
                    className={`relative flex min-h-[142px] w-36 shrink-0 snap-start flex-col justify-between rounded-2xl border-2 p-3.5 text-left transition-all sm:w-40 sm:p-4 ${
                      isActive
                        ? "border-[#134E4A] bg-[#FFFFFF] shadow-[3px_3px_0px_#134E4A] active:translate-y-0.5 active:shadow-none"
                        : isCompleted
                          ? "border-[#10B981] bg-[#ECFDF5] shadow-[2px_2px_0px_#10B981] active:translate-y-0.5 active:shadow-none dark:bg-[#064E3B]"
                          : isBypassedLock
                            ? "border-[#B45309] bg-[#FFFBEB] shadow-[2px_2px_0px_#B45309] active:translate-y-0.5 active:shadow-none"
                            : "cursor-not-allowed border-dashed border-[#134E4A]/25 bg-gray-50/70 opacity-70 dark:bg-gray-800/40"
                    }`}
                  >
                    <div className="absolute right-2 top-2">
                      {isActive && (
                        <span className="rounded-md bg-[#0D9488] px-1.5 py-1 text-[9px] font-black text-white">
                          AKTIF
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#10B981] px-1.5 py-1 text-[9px] font-black text-white">
                          <CheckSvg size={10} /> SELESAI
                        </span>
                      )}
                      {isBypassedLock ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#FEF08A] px-1.5 py-1 text-[9px] font-black text-[#78350F] border border-[#B45309]">
                          AKSES USTADZ
                        </span>
                      ) : isLocked ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-gray-200 px-1.5 py-1 text-[9px] font-black text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                          <LockSvg size={10} /> KUNCI
                        </span>
                      ) : null}
                    </div>

                    <div className="pt-5">
                      <div
                        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${isLocked ? "bg-gray-200 text-gray-400 dark:bg-gray-700" : isCompleted ? "bg-[#D1FAE5] text-[#047857]" : "bg-[#CCFBF1] text-[#134E4A]"}`}
                      >
                        <TilawatiLearningSvg size={23} />
                      </div>
                      <p
                        className={`font-display text-sm font-black ${isLocked ? "text-gray-400" : "text-[#134E4A]"}`}
                      >
                        Tilawati {jilid}
                      </p>
                    </div>

                    {isActive && (
                      <div className="mt-3">
                        <AnimatedProgressBar
                          value={progressPercentage}
                          className="mt-1"
                          barClassName="bg-[#0D9488]"
                        />
                        <p className="mt-1.5 text-[10px] font-bold text-[#134E4A]/60">
                          {progressPercentage}% selesai
                        </p>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="mt-3">
                        <AnimatedProgressBar
                          value={100}
                          className="mt-1"
                          barClassName="bg-[#10B981]"
                        />
                        <p className="mt-1.5 text-[10px] font-bold text-[#047857] dark:text-emerald-300">
                          Jilid selesai
                        </p>
                      </div>
                    )}
                    {isLocked && (
                      <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 5: Daily Missions */}
          <section>
            <DailyMissionsCard />
          </section>

          {/* SECTION 6: Streak (Diperbaiki ke Neo-Brutalism) */}
          <section className="rounded-2xl border-2 border-[#134E4A] bg-[#FFFFFF] p-4 shadow-[2px_2px_0px_#134E4A] sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#134E4A]/10 bg-[#FEF3C7] text-[#134E4A]">
                  <FireSvg size={23} stroke="#134E4A" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#134E4A] sm:text-base">
                    Streak Mengaji
                  </h4>
                  <p className="mt-0.5 text-xs font-bold text-[#B45309]">
                    Bonus {streakMultiplier}x Koin
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black leading-none text-[#EA580C]">
                  {effectiveStreak}
                </span>
                <span className="ml-1 text-xs font-bold text-[#134E4A]/60">
                  hari
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {WEEK_DAYS.map((day, idx) => {
                const isDone = Boolean(streakHistory[idx]);
                const isToday = idx === todayDayIdx;

                return (
                  <div
                    key={idx}
                    className="flex min-w-0 flex-col items-center gap-1.5"
                  >
                    <div
                      title={`${day.full}${isDone ? ": Streak Aktif" : isToday ? ": Hari Ini" : ""}`}
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#134E4A] sm:h-10 sm:w-10 ${
                        isDone
                          ? "bg-[#FEF08A] shadow-[1px_1px_0px_#134E4A]"
                          : isToday
                            ? "bg-white ring-2 ring-[#EA580C] ring-offset-2 ring-offset-[#FFFFFF] dark:bg-gray-800"
                            : "bg-[#F0FDF4]"
                      }`}
                    >
                      <img
                        src={
                          isDone
                            ? NGAJI_CERIA_ASSETS.apiStreak
                            : NGAJI_CERIA_ASSETS.apiStreakMati
                        }
                        alt={
                          isDone
                            ? `Streak ${day.full} Aktif`
                            : `${day.full} Belum Aktif`
                        }
                        className={`h-5 w-5 object-contain transition-transform ${isDone ? "scale-110 drop-shadow-[0_2px_3px_rgba(234,88,12,0.25)]" : "opacity-35 grayscale"}`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-extrabold ${isToday ? "text-[#EA580C]" : isDone ? "text-[#134E4A]" : "text-[#134E4A]/50"}`}
                    >
                      {day.short}
                    </span>
                    {isToday ? (
                      <span className="h-1 w-1 rounded-full bg-[#EA580C]" />
                    ) : (
                      <span className="h-1 w-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 7: Kelas Saya */}

          {/* SECTION 7 & 8: Bento Grid (Kelas & Arena) */}
          <section className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Card Kelas Saya */}
            <button
              type="button"
              onClick={() => navigate("/member/ngaji-ceria/kelas")}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#134E4A] bg-[#FFFFFF] p-3 text-left shadow-[3px_3px_0px_#134E4A] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none sm:p-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#134E4A]/20 bg-[#DBEAFE] text-[#134E4A]">
                  <GraduationCapSvg size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-sm font-black text-[#134E4A]">
                    Kelas Saya
                  </h4>
                  <p className="truncate text-[10px] font-bold text-[#134E4A]/60">
                    {joinedClassrooms.length > 0
                      ? `${joinedClassrooms.length} Kelas`
                      : "Belum ada"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-[#0D9488] sm:text-xs">
                <span>
                  {joinedClassrooms.length > 0 ? "Lihat Kelas" : "Cari Kelas"}
                </span>
                <ChevronRightSvg size={12} />
              </div>
            </button>

            {/* Card Main Bareng Teman */}
            <button
              type="button"
              onClick={() => setIsArenaSheetOpen(true)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#134E4A] bg-[#FEF3C7] p-3 text-left shadow-[3px_3px_0px_#134E4A] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none sm:p-4"
            >
              <div className="relative z-10 flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#134E4A]/20 bg-white text-[#D97706]">
                  <GamepadSvg size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-sm font-black text-[#134E4A] leading-tight">
                    Main Bareng
                  </h4>
                  <p className="truncate text-[10px] font-bold text-[#B45309]">
                    Arena & Duel
                  </p>
                </div>
              </div>
              <div className="relative z-10 mt-3 flex items-center gap-1 text-[10px] font-black text-[#B45309] sm:text-xs">
                <span>Buka Menu</span>
                <SparklesSvg size={12} />
              </div>
              <span
                className="pointer-events-none absolute -bottom-2 -right-2 opacity-10"
                aria-hidden="true"
              >
                <GamepadSvg size={60} />
              </span>
            </button>
          </section>

          {/* SECTION 9: Doa Hari Ini */}
          <section className="rounded-2xl border-2 border-[#134E4A] bg-[#FFFFFF] p-4 shadow-[2px_2px_0px_#134E4A] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3 border-b-2 border-[#134E4A]/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#134E4A]/10 bg-[#FFF0F0] text-[#134E4A] dark:bg-[#1E293B]">
                  <HandsPrayingSvg size={18} />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black text-[#134E4A]">
                    Doa Hari Ini
                  </h4>
                  <p className="text-xs text-[#134E4A]/55">
                    Mulai aktivitas dengan basmalah.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/member/ngaji-ceria/explore/doa")}
                className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-black text-[#0D9488] hover:bg-[#CCFBF1]/50 dark:text-[#38BDF8]"
              >
                Semua <ChevronRightSvg size={14} />
              </button>
            </div>
            <div className="rounded-xl border-2 border-[#0D9488] bg-[#F0FDF4] px-3 py-2 text-center sm:py-3">
              <p
                className="font-arabic text-2xl leading-loose text-[#134E4A] sm:text-3xl"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
            </div>
          </section>

          {/* SECTION 10: Warung & VIP (Daya Tarik Ekonomi) */}
          <section className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                triggerBibiReaction("click");
                navigate("/member/ngaji-ceria/warung-santri");
              }}
              className="group relative flex flex-col justify-center min-h-[100px] overflow-hidden rounded-2xl border-2 border-[#134E4A] bg-[#FFE4E6] p-3 text-left shadow-[3px_3px_0px_#134E4A] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none dark:bg-[#1E2937] sm:p-4"
            >
              <div className="relative z-10 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] dark:bg-slate-800 dark:text-[#2DD4BF]">
                  <StoreSvg size={22} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black leading-tight text-[#134E4A] sm:text-base">
                    Warung
                  </span>
                  <span className="mt-1 block text-xs font-bold text-[#134E4A]/70">
                    Beli Hati & Tiket
                  </span>
                </span>
              </div>
              <span
                className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.08] transition-transform group-hover:scale-110"
                aria-hidden="true"
              >
                <StoreSvg size={70} />
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerBibiReaction("click");
                navigate("/member/ngaji-ceria/premium");
              }}
              className="group relative flex flex-col justify-center min-h-[100px] overflow-hidden rounded-2xl border-2 border-[#134E4A] bg-[#FEF3C7] p-3 text-left shadow-[3px_3px_0px_#134E4A] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none dark:bg-[#1E2937] sm:p-4"
            >
              <div className="relative z-10 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#D97706] shadow-[2px_2px_0px_#134E4A] dark:bg-slate-800 dark:text-[#FBBF24]">
                  <CrownSvg size={22} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black leading-tight text-[#134E4A] sm:text-base">
                    VIP Pass
                  </span>
                  <span className="mt-1 block text-xs font-bold text-[#B45309]">
                    Energi Tak Terbatas
                  </span>
                </span>
              </div>
              <span
                className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.08] transition-transform group-hover:scale-110"
                aria-hidden="true"
              >
                <CrownSvg size={70} />
              </span>
            </button>
          </section>
        </div>

        <AppModal
          isOpen={showDailyModal && !!user}
          onClose={() => {
            autoModalTriggeredRef.current = true;
            setIsManualOpen(false);
            setShowDailyModal(false);
          }}
          title="Hadiah Login Harian"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{ scale: [1, 1.04, 1], rotate: [0, -2, 2, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: "easeInOut",
              }}
              className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
            >
              <PetiHartaSvg size={46} />
            </motion.div>
            <p className="mt-1 text-sm font-semibold text-[#134E4A]/65">
              Istiqomah mengaji setiap hari!
            </p>
            <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border-2 border-[#134E4A] bg-[#FEF3C7] px-3 py-1.5 text-xs font-extrabold text-[#B45309]">
              <FireSvg size={19} />
              <span>Streak: {effectiveStreak} hari</span>
              {streakMultiplier > 1 && (
                <span className="rounded-full bg-[#EA580C] px-2 py-0.5 text-[10px] font-black text-white">
                  Bonus {streakMultiplier}x!
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {DAILY_REWARDS.map((r, idx) => {
              const isClaimed =
                idx + 1 < activeDay || (idx + 1 === activeDay && todayClaimed);
              const isCurrent = idx + 1 === activeDay && !todayClaimed;
              const finalCoins = Math.round(
                r.coins * (isCurrent ? streakMultiplier : 1),
              );

              if (idx === 6) {
                return (
                  <motion.div
                    key={r.day}
                    animate={isCurrent ? { scale: [1, 1.02, 1] } : undefined}
                    transition={
                      isCurrent
                        ? { repeat: Infinity, duration: 2.4 }
                        : undefined
                    }
                    className={`col-span-3 flex flex-row items-center justify-between rounded-2xl border-[3px] p-3 transition-colors ${
                      isClaimed
                        ? "border-[#134E4A] bg-[#CCFBF1]"
                        : isCurrent
                          ? "border-[#134E4A] bg-[#FEF08A] shadow-[4px_4px_0px_#134E4A]"
                          : "border-dashed border-[#134E4A]/30 bg-slate-50 opacity-80"
                    }`}
                  >
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#0D9488]">
                          HADIAH UTAMA
                        </span>
                        <span className="text-sm font-black text-[#134E4A]">
                          Hari 7
                        </span>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border-2 border-[#134E4A]">
                        {r.image}
                      </div>
                      <span className="flex items-center gap-1 text-sm font-black text-[#134E4A]">
                        +{finalCoins} <CoinSvg size={16} />
                      </span>
                    </div>

                    <div>
                      {isClaimed ? (
                        <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-white px-2 py-1 text-[11px] font-black text-[#0D9488]">
                          <CheckSvg size={12} /> Sudah
                        </span>
                      ) : isCurrent ? (
                        <span className="rounded-lg border-2 border-[#134E4A] bg-[#0D9488] px-3 py-1.5 text-[11px] font-black text-white shadow-[2px_2px_0px_#134E4A]">
                          Klaim!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center rounded-lg border-2 border-[#134E4A]/20 bg-white px-3 py-1.5 text-[#134E4A]/40">
                          <GiftSvg size={14} />
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={r.day}
                  animate={isCurrent ? { scale: [1, 1.03, 1] } : undefined}
                  transition={
                    isCurrent ? { repeat: Infinity, duration: 2.4 } : undefined
                  }
                  className={`flex min-h-[115px] flex-col items-center justify-between rounded-2xl border-[3px] p-2 text-center transition-colors ${
                    isClaimed
                      ? "border-[#134E4A] bg-[#CCFBF1]"
                      : isCurrent
                        ? "border-[#134E4A] bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                        : "border-dashed border-[#134E4A]/30 bg-slate-50 opacity-80"
                  }`}
                >
                  <span className="block text-[10px] font-black uppercase tracking-wide text-[#134E4A]/70">
                    Hari {r.day}
                  </span>
                  <div className="my-1 flex h-8 w-8 items-center justify-center text-[#134E4A]">
                    {r.image}
                  </div>
                  <span className="flex items-center justify-center gap-0.5 text-xs font-black text-[#134E4A]">
                    +{finalCoins} <CoinSvg size={13} />
                  </span>
                  <div className="mt-2">
                    {isClaimed ? (
                      <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-white px-1.5 py-0.5 text-[10px] font-black text-[#0D9488]">
                        <CheckSvg size={11} /> Sudah
                      </span>
                    ) : isCurrent ? (
                      <span className="rounded-lg border-2 border-[#134E4A] bg-[#0D9488] px-2 py-0.5 text-[10px] font-black text-white shadow-[2px_2px_0px_#134E4A]">
                        Klaim!
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-lg border-2 border-[#134E4A]/20 bg-white px-2 py-0.5 text-[#134E4A]/40">
                        <GiftSvg size={12} />
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6">
            {todayClaimed ? (
              <button
                type="button"
                disabled
                className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border-[3px] border-[#134E4A]/20 bg-slate-100 px-4 py-3 text-sm font-black text-[#134E4A]/50"
              >
                <CheckSvg size={17} /> Sudah Diklaim Hari Ini
              </button>
            ) : (
              <motion.button
                type="button"
                disabled={isClaiming}
                onClick={handleClaim}
                whileHover={isClaiming ? undefined : { y: -2 }}
                whileTap={isClaiming ? undefined : { scale: 0.98, y: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] px-4 py-3 text-sm font-black text-white shadow-[4px_4px_0px_#134E4A] transition-all hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SparklesSvg size={18} />
                {isClaiming ? (
                  <>
                    <Loader2Svg
                      size={18}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    <span>Mengklaim hadiah...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Klaim Hadiah Hari {activeDay} (+
                      {Math.round(currentReward.coins * streakMultiplier)})
                    </span>
                    <CoinSvg size={16} />
                  </>
                )}
              </motion.button>
            )}
          </div>

          <div className="mt-5 flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-bold text-[#134E4A]/60">
              Reset harian terjadi setiap pukul 04:00 WIB.
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border-2 border-[#134E4A]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#0D9488]">
              <span className="inline-flex items-center gap-1">
                <ClockSvg size={14} /> Sisa waktu klaim hari ini:
              </span>
              <span className="font-mono font-black tabular-nums text-[#134E4A]">
                {timeUntilReset}
              </span>
            </div>
          </div>
        </AppModal>

        {/* Arena Bottom Sheet */}
        <AppBottomSheet
          isOpen={isArenaSheetOpen}
          onClose={() => setIsArenaSheetOpen(false)}
          title="Main Bareng Teman"
        >
          <div className="px-5 pb-2 pt-1">
            {/* Header: ikon game, judul, indikator */}
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-[#134E4A] text-[#FEF08A] shadow-[2px_2px_0px_#134E4A]">
                <GamepadSvg size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-black text-[#134E4A]">
                  Pilih Mode
                </h3>
                <p className="text-xs text-[#64748B]">
                  Tentukan cara kamu bermain
                </p>
              </div>
            </div>

            {/* Daftar Mode Bermain */}
            <div className="overflow-y-auto max-h-[60vh]">
              {/* 1. Gabung PIN */}
              <div className="mb-3 flex flex-row items-center justify-between gap-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#DCFCE7] p-3 shadow-[3px_3px_0px_#134E4A]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#134E4A] bg-[#FEF08A] text-[#0D9488]">
                  <GamepadSvg size={20} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-sm font-black text-[#134E4A]">
                    Gabung PIN
                  </div>
                  <div className="truncate text-xs text-[#64748B]">
                    Masuk ke room teman
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsArenaSheetOpen(false);
                    navigate("/arena/join");
                  }}
                  className="shrink-0 rounded-lg border-2 border-[#134E4A] bg-[#0D9488] px-4 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#0F766E] active:translate-y-[1px] active:shadow-none"
                >
                  Masuk
                </button>
              </div>

              {/* 2. Buat Room */}
              <div className="mb-3 flex flex-row items-center justify-between gap-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-3 shadow-[3px_3px_0px_#134E4A]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#134E4A] bg-[#FDE68A] text-[#B45309]">
                  <CrownSvg size={20} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-sm font-black text-[#134E4A]">
                    Buat Room
                  </div>
                  <div className="truncate text-xs text-[#64748B]">
                    Ujian atau main
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsArenaSheetOpen(false);
                    navigate("/arena/host/create");
                  }}
                  className="shrink-0 rounded-lg border-2 border-[#134E4A] bg-[#0D9488] px-4 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#0F766E] active:translate-y-[1px] active:shadow-none"
                >
                  Buat
                </button>
              </div>

              {/* 3. Duel 1v1 */}
              <div className="mb-3 flex flex-row items-center justify-between gap-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#FFE4E6] p-3 shadow-[3px_3px_0px_#134E4A]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#134E4A] bg-[#FECDD3] text-[#BE123C]">
                  <SwordsSvg size={20} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-sm font-black text-[#134E4A]">
                    Duel 1v1
                  </div>
                  <div className="truncate text-xs text-[#64748B]">
                    Tantang temanmu
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsArenaSheetOpen(false);
                    navigate("/arena/duel/lobby/new");
                  }}
                  className="shrink-0 rounded-lg border-2 border-[#134E4A] bg-[#FF6B6B] px-4 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#E11D48] active:translate-y-[1px] active:shadow-none"
                >
                  Lawan
                </button>
              </div>
            </div>
          </div>
        </AppBottomSheet>

        <OnboardingModal />
        <RankJourneyModal
          isOpen={isRankModalOpen}
          onClose={() => setIsRankModalOpen(false)}
        />
      </NgajiCeriaLayout>
    </>
  );
}
