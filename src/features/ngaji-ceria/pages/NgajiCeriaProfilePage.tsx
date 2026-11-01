import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { useNgajiCeriaStreak } from "../hooks/useNgajiCeriaStreak";
import { getInstallPrompt, triggerInstall } from "@/lib/pwaInstall";
import {
  ACHIEVEMENT_LABELS,
  getRank,
  useNgajiProgress,
} from "./games/_shared/progression";
import { AppModal } from "@/components/ui/AppModal";
import { useNgajiCeriaStore } from "../hooks/useNgajiCeriaStore";
import { useNgajiCeriaProgress } from "../hooks/useNgajiCeriaProgress";
import { loadTilawatiDataset } from "../data/tilawatiPageDatasets";
import { AvatarWithBadge } from "../../../components/ui/AvatarWithBadge";
import { normalizeGender } from "../../../utils/format";
import {
  useEconomyStore,
  isUnlimitedUser,
  type TilaGender,
} from "../hooks/useEconomyStore";
import { VoucherRedeemModal } from "../components/VoucherRedeemModal";
import { AppThemeSettingsModal } from "../components/AppThemeSettingsModal";
import { ReferralSection } from "../components/ReferralSection";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import "./games/_shared/games.css";
import { RankJourneyModal } from "../components/RankJourneyModal";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  AvatarSantriSvg,
  type AvatarSantriAccessory,
  type AvatarSantriVariant,
} from "@/components/ui/Illustrations";
import { AVATAR_ACCESSORY_SHOP_ITEMS } from "../pages/WarungSantriPage";
import { getMascotName, resolveMascotGender } from "@/utils/mascotHelper";
import { isAdminRole, classroomRoleForUser } from "@/lib/roles";
import { userApi, type UserProfileResponse } from "@/services/userApi";
import { stopAllAudio } from "../utils/audioPlayer";
import {
  FEEDBACK_PROMPT_STORAGE_KEY,
  FEEDBACK_PROMPT_DISMISSED_KEY,
  FEEDBACK_PROMPT_SNOOZE_KEY,
  FEEDBACK_PROMPT_CADENCE_MS,
  FEEDBACK_PROMPT_MIN_SNOOZE_DAYS,
  FEEDBACK_PROMPT_MAX_SNOOZE_DAYS,
  FEEDBACK_PROMPT_DELAY_MS,
  FEEDBACK_PROMPT_PLAYED_KEY,
  FEEDBACK_PROMPT_SESSION_START_KEY,
} from "../../../constants";

import {
  PencilSvg,
  GraduationCapSvg,
  StarSvg,
  CoinsSvg,
  HeartSvg,
  TicketSvg,
  MedalSvg,
  LockSvg,
  KeyRoundSvg,
  ClipboardListSvg,
  SparklesSvg,
  DownloadSvg,
  ChevronRightSvg,
  LogOutSvg,
  ShieldSvg,
  TrashSvg,
  EyeSvg,
  EyeSlashSvg,
  Volume2Svg,
  StoreSvg,
  TrophySvg,
  UsersSvg,
  AlertCircle,
  FireSvg,
  CameraSvg,
  BookOpenSvg,
  GamepadSvg,
} from "@/components/ui/CustomIcons";
import { AnimatedProgressBar } from "@/components/ui";
import RankBadgeSvg from "@/components/ui/RankBadgeSvg";

// Custom Icon Kamera bergaya Neo-Brutalism (Dapat dipindahkan ke CustomIcons.tsx)

const TOTAL_STARS = 654;
const AVATAR_VARIANT_STORAGE_KEY = "ngaji_ceria_avatar_variant";

type ActiveModal =
  | "edit"
  | "avatar"
  | "password"
  | "feedback"
  | "install"
  | "logout"
  | "delete"
  | null;

const AVATAR_CHARACTER_VARIANTS: {
  id: AvatarSantriVariant;
  boyLabel: string;
  girlLabel: string;
}[] = [
  { id: 1, boyLabel: "Santri 1", girlLabel: "Santriwati 1" },
  { id: 2, boyLabel: "Santri 2", girlLabel: "Santriwati 2" },
  { id: 3, boyLabel: "Santri 3", girlLabel: "Santriwati 3" },
];

const AVATAR_ACCESSORIES_CONFIG: {
  id: string;
  name: string;
  gender: "all" | "boy" | "girl";
}[] = [
  { id: "peci", name: "Peci", gender: "boy" },
  { id: "hairbow", name: "Hair Bow", gender: "girl" },
  { id: "flowercrown", name: "Flower Crown", gender: "girl" },
  { id: "glasses", name: "Glasses", gender: "all" },
  { id: "crown", name: "Champion Crown", gender: "all" },
  { id: "wizardhat", name: "Wizard Hat", gender: "all" },
  { id: "headphone", name: "Headphones", gender: "all" },
  { id: "sleepmask", name: "Sleep Mask", gender: "all" },
  { id: "scarf", name: "Neck Scarf", gender: "all" },
  { id: "turban", name: "Arabian Turban", gender: "boy" },
  { id: "sunglasses", name: "Sunglasses", gender: "all" },
  { id: "chain", name: "Lanyard Card", gender: "all" },
  { id: "star", name: "Star Pin", gender: "all" },
  { id: "medal", name: "Honor Medal", gender: "all" },
  { id: "bandana", name: "Headband", gender: "all" },
];

function getAvatarAccessoryName(id: string): string {
  const found = AVATAR_ACCESSORIES_CONFIG.find((item) => item.id === id);
  return found?.name || id;
}

function resolveGenderAccessory(
  accessory: string | null | undefined,
  gender: TilaGender,
): AvatarSantriAccessory {
  const resolvedGender = resolveMascotGender(gender);
  if (!accessory || accessory === "none") return "none";

  const item = AVATAR_ACCESSORIES_CONFIG.find((i) => i.id === accessory);
  if (item && item.gender !== "all" && item.gender !== resolvedGender) {
    return resolvedGender === "girl" ? "hairbow" : "peci";
  }

  return accessory as AvatarSantriAccessory;
}

export default function NgajiCeriaProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentStreak } = useNgajiCeriaStreak();
  const loginStreak = useEconomyStore((s) => s.loginStreak);
  const effectiveStreak = Math.max(loginStreak, currentStreak);
  const progress = useNgajiProgress();
  const rank = getRank(progress.xp);
  const currentXp = progress.xp;
  const nextXp = rank.nextXp || currentXp;
  const xpProgressPercentage =
    nextXp > rank.minXp
      ? Math.min(
          100,
          Math.max(0, ((currentXp - rank.minXp) / (nextXp - rank.minXp)) * 100),
        )
      : 100;
  const { currentJilid } = useNgajiCeriaProgress();
  const currentJilidNumber = Number(currentJilid.replace("jilid-", "")) || 1;

  const stars = useNgajiCeriaStore((state) => state.stars);
  const [datasets, setDatasets] = useState<
    Record<
      number,
      Record<number, import("../data/tilawatiPageDatasets").PageQuizData>
    >
  >({});

  // Preload semua dataset jilid 1-6
  useEffect(() => {
    let alive = true;
    const jilids = [1, 2, 3, 4, 5, 6];
    Promise.all(jilids.map((jilid) => loadTilawatiDataset(jilid))).then(
      (results) => {
        if (alive) {
          setDatasets(
            Object.fromEntries(results.map((d, i) => [jilids[i], d])),
          );
        }
      },
    );
    return () => {
      alive = false;
    };
  }, []);

  // Auto-prompt "Kritik & Saran":
  // Aturan Bisnis:
  // 1. Akumulasi durasi sesi minimal 5 menit (FEEDBACK_PROMPT_DELAY_MS)
  // 2. User sudah melakukan minimal 1 aktivitas produktif di sesi ini (tartila_has_played_session === "true")
  // 3. User belum pernah submit masukan dan tidak sedang dalam periode snooze (30-90 hari)
  useEffect(() => {
    if (!user) return;

    // Pastikan session start timestamp ada di sessionStorage
    let sessionStart = Number(
      sessionStorage.getItem(FEEDBACK_PROMPT_SESSION_START_KEY),
    );
    if (!sessionStart || Number.isNaN(sessionStart)) {
      sessionStart = Date.now();
      sessionStorage.setItem(
        FEEDBACK_PROMPT_SESSION_START_KEY,
        String(sessionStart),
      );
    }

    let timerId: ReturnType<typeof setTimeout> | null = null;

    const checkAndTrigger = async () => {
      // 1. Cek status permanent dismiss / submit
      if (
        localStorage.getItem(FEEDBACK_PROMPT_DISMISSED_KEY) === "true" ||
        localStorage.getItem(FEEDBACK_PROMPT_STORAGE_KEY) === "true" ||
        localStorage.getItem("tartila-feedback-dismissed") === "true"
      ) {
        return;
      }

      // 2. Cek snooze aktif
      const snoozeUntil = Number(
        localStorage.getItem(FEEDBACK_PROMPT_SNOOZE_KEY),
      );
      if (snoozeUntil && !Number.isNaN(snoozeUntil) && Date.now() < snoozeUntil) {
        return;
      }

      // 3. Cek akumulasi waktu sesi (minimal 5 menit)
      const currentStart =
        Number(sessionStorage.getItem(FEEDBACK_PROMPT_SESSION_START_KEY)) ||
        sessionStart;
      const elapsed = Date.now() - currentStart;
      if (elapsed < FEEDBACK_PROMPT_DELAY_MS) {
        return;
      }

      // 4. Cek aktivitas produktif di sesi ini (active player)
      const hasPlayed =
        sessionStorage.getItem(FEEDBACK_PROMPT_PLAYED_KEY) === "true";
      if (!hasPlayed) {
        // Belum ada aktivitas kuis/game/materi, tunda sampai aktivitas pertama selesai
        return;
      }

      // 5. Cek status di backend (has_submitted_feedback & cadence)
      try {
        const res: UserProfileResponse = await userApi.getUserProfile();
        if (res?.has_submitted_feedback === true) {
          localStorage.setItem(FEEDBACK_PROMPT_DISMISSED_KEY, "true");
          return;
        }

        const lastAt = res?.last_feedback_prompt_at;
        if (lastAt) {
          const then = new Date(lastAt).getTime();
          if (
            !Number.isNaN(then) &&
            Date.now() - then < FEEDBACK_PROMPT_CADENCE_MS
          ) {
            localStorage.setItem(FEEDBACK_PROMPT_DISMISSED_KEY, "true");
            return;
          }
        }

        setActiveModal("feedback");
      } catch {
        // API gagal; jangan tampilkan modal sekarang.
      }
    };

    // Evaluasi awal (siapa tahu user sudah melewati 5 menit & sudah bermain)
    void checkAndTrigger();

    // Jadwalkan timer untuk sisa durasi menuju 5 menit
    const currentStart =
      Number(sessionStorage.getItem(FEEDBACK_PROMPT_SESSION_START_KEY)) ||
      sessionStart;
    const elapsed = Date.now() - currentStart;
    const remaining = Math.max(0, FEEDBACK_PROMPT_DELAY_MS - elapsed);
    timerId = setTimeout(() => {
      void checkAndTrigger();
    }, remaining);

    // Dengarkan event aktivitas (jika durasi sudah 5 menit dan user baru menyelesaikan aktivitas)
    const handleActivity = () => {
      void checkAndTrigger();
    };
    window.addEventListener("tartila:activity_played", handleActivity);

    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener("tartila:activity_played", handleActivity);
    };
  }, [user]);

  const handleCloseFeedback = () => {
    // Tombol X / Batal: aktifkan snooze acak 30-90 hari jika belum pernah submit
    if (
      !submitted &&
      localStorage.getItem(FEEDBACK_PROMPT_DISMISSED_KEY) !== "true"
    ) {
      const randomDays =
        Math.floor(
          Math.random() *
            (FEEDBACK_PROMPT_MAX_SNOOZE_DAYS -
              FEEDBACK_PROMPT_MIN_SNOOZE_DAYS +
              1),
        ) + FEEDBACK_PROMPT_MIN_SNOOZE_DAYS;
      const snoozeUntil = Date.now() + randomDays * 24 * 60 * 60 * 1000;
      localStorage.setItem(FEEDBACK_PROMPT_SNOOZE_KEY, String(snoozeUntil));
      userApi.updateFeedbackPrompt().catch(() => {});
    }
    setActiveModal(null);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem(FEEDBACK_PROMPT_DISMISSED_KEY, "true");
    localStorage.setItem(FEEDBACK_PROMPT_STORAGE_KEY, "true");
    try {
      await userApi.updateFeedbackPrompt({ has_submitted_feedback: true });
    } catch {
      // LocalStorage sudah mengamankan UX
    }
  };

  const equippedAccessory = useEconomyStore((s) => s.equippedAccessory);
  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const setTilaGender = useEconomyStore((s) => s.setTilaGender);
  const mascotName = getMascotName(tilaGender);

  const avatarMode = useEconomyStore((s) => s.avatarMode || "avatar");
  const setAvatarMode = useEconomyStore((s) => s.setAvatarMode);
  const equippedAvatarAccessory = useEconomyStore(
    (s) => s.equippedAvatarAccessory,
  );
  const setEquippedAvatarAccessory = useEconomyStore(
    (s) => s.setEquippedAvatarAccessory,
  );
  const ownedAvatarAccessories = useEconomyStore(
    (s) => s.ownedAvatarAccessories || [],
  );

  // Dukungan state variant (1 | 2 | 3) dari store atau fallback ke localStorage
  const storeAvatarVariant = useEconomyStore(
    (s) => (s as any).avatarVariant as AvatarSantriVariant | undefined,
  );
  const setStoreAvatarVariant = useEconomyStore(
    (s) =>
      (s as any).setAvatarVariant as
        | ((v: AvatarSantriVariant) => void)
        | undefined,
  );

  const [avatarVariant, setAvatarVariantState] = useState<AvatarSantriVariant>(
    () => {
      if (storeAvatarVariant && [1, 2, 3].includes(storeAvatarVariant)) {
        return storeAvatarVariant;
      }
      const saved = Number(localStorage.getItem(AVATAR_VARIANT_STORAGE_KEY));
      return saved === 2 || saved === 3 ? (saved as AvatarSantriVariant) : 1;
    },
  );

  const setAvatarVariant = (v: AvatarSantriVariant) => {
    setAvatarVariantState(v);
    localStorage.setItem(AVATAR_VARIANT_STORAGE_KEY, String(v));
    if (typeof setStoreAvatarVariant === "function") {
      setStoreAvatarVariant(v);
    }
  };

  // Gabungkan aksesoris yang dimiliki dengan aksesoris gratis bawaan ("peci" & "hairbow")
  const effectiveOwnedAccessories = useMemo(() => {
    const set = new Set<string>(["peci", "hairbow", ...ownedAvatarAccessories]);
    return Array.from(set);
  }, [ownedAvatarAccessories]);

  const resolvedEquippedAccessory = useMemo(
    () => resolveGenderAccessory(equippedAvatarAccessory, tilaGender),
    [equippedAvatarAccessory, tilaGender],
  );

  const showMascot = useEconomyStore((s) => s.showMascot);
  const setShowMascot = useEconomyStore((s) => s.setShowMascot);

  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const isUnlimited = isUnlimitedUser(user, isVip, user?.group_id);

  const isSuperAdmin = isAdminRole(user?.role);
  const classroomRole = classroomRoleForUser(user);

  // State Draft untuk Modal Edit Avatar & Edit Profil
  const [genderDraft, setGenderDraft] = useState<TilaGender>(tilaGender);
  const [variantDraft, setVariantDraft] =
    useState<AvatarSantriVariant>(avatarVariant);
  const [avatarModeDraft, setAvatarModeDraft] = useState<"photo" | "avatar">(
    "avatar",
  );
  const [accessoryDraft, setAccessoryDraft] =
    useState<AvatarSantriAccessory | null>(null);

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const earnedStars = useMemo(
    () => Object.values(stars).reduce((sum, value) => sum + (value || 0), 0),
    [stars],
  );

  const completedPagesCount = useMemo(
    () => Object.values(stars).filter((v) => (v || 0) > 0).length,
    [stars],
  );

  const earned = useMemo(() => {
    const set = new Set(progress.achievements);
    for (let jilid = 1; jilid <= 6; jilid++) {
      const pages = Object.keys(datasets[jilid] || {});
      if (
        pages.length &&
        pages.every((page) => stars[`jilid-${jilid}-hal-${page}`] > 0)
      ) {
        set.add(`jilid-${jilid}-clear`);
      }
    }
    return set;
  }, [progress.achievements, stars, datasets]);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const displayName = nameOverride || user?.name || "Tamu Tartila";
  const email = user?.username
    ? `${user.username}@santri.ngajiceria.id`
    : "Belum terhubung akun";

  const openModal = (modal: ActiveModal) => {
    setSubmitted(false);
    if (modal === "edit") {
      setNameDraft(displayName);
    }
    if (modal === "avatar") {
      const userNorm = user?.gender ? normalizeGender(user.gender) : null;
      const initialGender: TilaGender =
        userNorm === "P" || tilaGender === "girl" ? "girl" : "boy";
      setGenderDraft(initialGender);
      setVariantDraft(avatarVariant);
      setAvatarModeDraft(avatarMode);

      const resolvedAcc = resolveGenderAccessory(
        equippedAvatarAccessory,
        initialGender,
      );
      setAccessoryDraft(resolvedAcc === "none" ? null : resolvedAcc);
    }
    setActiveModal(modal);
  };

  const handleSelectGenderDraft = (newGender: TilaGender) => {
    setGenderDraft(newGender);
    if (accessoryDraft) {
      const item = AVATAR_ACCESSORIES_CONFIG.find(
        (i) => i.id === accessoryDraft,
      );
      if (item && item.gender !== "all" && item.gender !== newGender) {
        setAccessoryDraft(newGender === "girl" ? "hairbow" : "peci");
      }
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    let targetGender = tilaGender;
    if (user?.gender) {
      const norm = normalizeGender(user.gender);
      if (norm === "L" && tilaGender !== "boy") {
        targetGender = "boy";
        setTilaGender("boy");
      } else if (norm === "P" && tilaGender !== "girl") {
        targetGender = "girl";
        setTilaGender("girl");
      }
    }

    if (targetGender === "girl" && equippedAvatarAccessory === "peci") {
      setEquippedAvatarAccessory("hairbow");
    } else if (
      targetGender === "boy" &&
      equippedAvatarAccessory === "hairbow"
    ) {
      setEquippedAvatarAccessory("peci");
    }
  }, [
    user?.gender,
    tilaGender,
    equippedAvatarAccessory,
    setTilaGender,
    setEquippedAvatarAccessory,
  ]);

  const handleInstall = async () => {
    triggerInstall();
    setActiveModal(null);
  };

  // Simpan Nama pada Modal Edit Profil
  const handleSaveProfile = () => {
    if (nameDraft.trim()) setNameOverride(nameDraft.trim());
    setActiveModal(null);
  };

  // Simpan Kustomisasi Karakter pada Modal Edit Avatar
  const handleSaveAvatar = async () => {
    if (genderDraft) {
      await setTilaGender(genderDraft);
    }
    setAvatarVariant(variantDraft);
    setAvatarMode(avatarModeDraft);
    if (avatarModeDraft === "avatar") {
      const finalAcc = accessoryDraft
        ? resolveGenderAccessory(accessoryDraft, genderDraft)
        : null;
      setEquippedAvatarAccessory(finalAcc === "none" ? null : finalAcc);
    }
    setActiveModal(null);
  };

  const settingsList = [
    {
      key: "mascot-toggle",
      icon: showMascot ? EyeSvg : EyeSlashSvg,
      iconBg: "bg-[#FEF08A]",
      title: "Tampilkan Maskot",
      subtitle: showMascot
        ? `${mascotName} menemani belajar`
        : "Maskot disembunyikan",
      isToggle: true,
      toggleValue: showMascot,
      onToggle: () => setShowMascot(!showMascot),
    },
    {
      key: "theme",
      icon: SparklesSvg,
      iconBg: "bg-[#FCE7F3]",
      title: "Pengaturan Tampilan",
      subtitle: "Ubah tema & warna aplikasi Tartila",
      action: () => setIsThemeModalOpen(true),
    },
    {
      key: "voucher",
      icon: TicketSvg,
      iconBg: "bg-[#FEF08A]",
      title: "Tukar Voucher VIP",
      subtitle: "Aktivasi atau perpanjang lisensi VIP",
      action: () => setIsVoucherModalOpen(true),
    },
    {
      key: "password",
      icon: KeyRoundSvg,
      iconBg: "bg-[#BAE6FD]",
      title: "Ganti Kata Sandi",
      subtitle: "Perbarui keamanan akunmu",
      action: () => openModal("password"),
    },
    {
      key: "feedback",
      icon: SparklesSvg,
      iconBg: "bg-[#FECDD3]",
      title: "Kritik & Saran",
      subtitle: "Bantu kami mengembangkan Tartila",
      action: () => openModal("feedback"),
    },
    {
      key: "install",
      icon: DownloadSvg,
      iconBg: "bg-[#BBF7D0]",
      title: "Install Aplikasi",
      subtitle: "Pasang shortcut di layar utama",
      action: () => {
        if (getInstallPrompt()) {
          triggerInstall();
        } else {
          openModal("install");
        }
      },
    },
  ];

  const inputStyle =
    "w-full rounded-xl border-[3px] border-[#134E4A] bg-white px-4 py-3 text-sm font-bold text-[#134E4A] placeholder:text-[#134E4A]/40 focus:outline-none focus:border-[#0D9488] shadow-[2px_2px_0px_#134E4A] focus:shadow-[2px_2px_0px_#0D9488] transition-all";
  const btnCancelStyle =
    "rounded-xl border-[3px] border-[#134E4A] bg-white py-2.5 text-sm font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all";
  const btnPrimaryStyle =
    "rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] py-2.5 text-sm font-black text-white shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all";
  const btnDangerStyle =
    "rounded-xl border-[3px] border-[#134E4A] bg-[#FF6B6B] py-2.5 text-sm font-black text-white shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all";

  return (
    <NgajiCeriaLayout hideHeader>
      <div className="mx-auto min-h-full w-full max-w-3xl bg-[#F0FDF4] pb-24 text-[#134E4A] transition-colors duration-200">
        {/* 1. Header Banner Profil */}
        <header className="relative overflow-hidden rounded-b-[28px] border-b-[3px] border-[#134E4A] bg-[#134E4A] px-5 pb-12 pt-safe text-white sm:px-6">
          <div className="relative z-10 mx-auto flex max-w-2xl items-center justify-between gap-3 pt-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#FEF08A]">
                Ruang Santri
              </span>
              <h1 className="font-display text-xl font-black leading-tight sm:text-2xl">
                Profil Belajarku
              </h1>
            </div>
            <div className="shrink-0 rounded-xl border-2 border-white/30 bg-white/10 px-3 py-2 text-right shadow-[2px_2px_0px_rgba(0,0,0,0.16)]">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/80">
                Streak
              </p>
              <p className="flex items-center justify-end gap-1 text-sm font-black text-[#FEF08A]">
                <FireSvg size={14} className="text-[#EA580C]" />
                <span>{effectiveStreak} Hari</span>
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-2xl space-y-5 px-4 sm:space-y-6 sm:px-5">
          {/* 1. Avatar Card dengan Tombol Kamera (Edit Avatar) & Tombol Pensil (Edit Nama) */}
          <section className="relative z-20 -mt-8 rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#134E4A] transition-colors duration-200">
            <div className="flex items-center gap-3.5 sm:gap-4">
              {/* Avatar Button + Badge Kamera */}
              <button
                type="button"
                onClick={() => openModal("avatar")}
                className="group relative shrink-0 cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2"
                title="Ganti Karakter & Aksesoris Avatar"
              >
                {avatarMode === "photo" ? (
                  <AvatarWithBadge
                    src={user?.photo_url}
                    name={displayName}
                    size={68}
                    shape="circle"
                    role={user?.role}
                    groupId={user?.group_id}
                    gender={normalizeGender(user?.gender)}
                    borderClassName="border-2 border-[#FF6B6B] bg-white"
                  />
                ) : (
                  <AvatarSantriSvg
                    size={68}
                    gender={resolveMascotGender(tilaGender)}
                    variant={avatarVariant}
                    accessory={resolvedEquippedAccessory}
                    mood="happy"
                    className="shrink-0 transition-transform group-hover:scale-[1.03]"
                  />
                )}
                {/* Floating Badge Ikon Kamera */}
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] transition-transform group-hover:scale-110 group-active:scale-95">
                  <CameraSvg size={15} />
                </span>
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="truncate text-base font-black leading-tight text-[#134E4A] sm:text-lg">
                    {displayName}
                  </h2>
                  <span
                    className={`inline-flex items-center rounded-md border border-[#134E4A] px-2 py-1 text-[10px] font-black tracking-wide text-white ${
                      isSuperAdmin
                        ? "bg-[#FF6B6B]"
                        : isVip
                          ? "bg-[#FBBF24] text-[#134E4A]"
                          : "bg-[#0D9488]"
                    }`}
                  >
                    {isSuperAdmin
                      ? "SUPER ADMIN"
                      : isVip
                        ? "MEMBER VIP"
                        : "SANTRI AKTIF"}
                  </span>
                  {isUnlimited && (
                    <span className="inline-flex items-center rounded-md border border-[#134E4A] bg-[#FEF08A] px-2 py-1 text-[10px] font-black text-[#134E4A]">
                      ∞ UNLIMITED
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs font-semibold text-[#134E4A]/70 sm:text-sm">
                  {email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => openModal("edit")}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#F0FDF4] text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 active:translate-y-[1px] active:shadow-none hover:bg-white/5"
                title="Edit Nama Profil"
              >
                <PencilSvg size={16} />
              </button>
            </div>
          </section>

          <div className="space-y-6">
            {/* A. Blok "Petualangan Ngaji Ceria" (Game) */}
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-wider text-[#134E4A]">
                  <GamepadSvg size={16} className="text-[#0D9488]" />{" "}
                  Petualangan Ceria
                </h3>
              </div>

              {/* GRID 2x2 (Simetris) */}
              <section className="grid grid-cols-2 gap-2.5">
                {/* Kartu 1: Bintang */}
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border-2 border-[#134E4A] bg-white px-3 py-3 text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <StarSvg
                    size={20}
                    className="shrink-0 text-[#134E4A]"
                    stroke="#134E4A"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black leading-tight text-[#134E4A] sm:text-[15px]">
                      <AnimatedCounter value={earnedStars} />/{TOTAL_STARS}
                    </p>
                    <p className="mt-0.5 text-[10px] font-black uppercase leading-none text-[#134E4A]/60 sm:text-[11px]">
                      Bintang
                    </p>
                  </div>
                </div>

                {/* Kartu 2: Koin */}
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border-2 border-[#134E4A] bg-white px-3 py-3 text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <CoinsSvg
                    size={20}
                    className="shrink-0 text-[#134E4A]"
                    stroke="#134E4A"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black leading-tight text-[#134E4A] sm:text-[15px]">
                      <AnimatedCounter value={progress.coins || 0} />
                    </p>
                    <p className="mt-0.5 text-[10px] font-black uppercase leading-none text-[#134E4A]/60 sm:text-[11px]">
                      Koin
                    </p>
                  </div>
                </div>

                {/* Kartu 3: Hati */}
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border-2 border-[#134E4A] bg-white px-3 py-3 text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <HeartSvg
                    size={20}
                    className="shrink-0 text-[#134E4A]"
                    stroke="#134E4A"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black leading-tight text-[#134E4A] sm:text-[15px]">
                      {isUnlimited ? "∞" : `${hearts}/5`}
                    </p>
                    <p className="mt-0.5 text-[10px] font-black uppercase leading-none text-[#134E4A]/60 sm:text-[11px]">
                      Hati
                    </p>
                  </div>
                </div>

                {/* Kartu 4: Tiket */}
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border-2 border-[#134E4A] bg-white px-3 py-3 text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <TicketSvg
                    size={20}
                    className="shrink-0 text-[#134E4A]"
                    stroke="#134E4A"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black leading-tight text-[#134E4A] sm:text-[15px]">
                      {isUnlimited ? "∞" : `${tickets}/3`}
                    </p>
                    <p className="mt-0.5 text-[10px] font-black uppercase leading-none text-[#134E4A]/60 sm:text-[11px]">
                      Tiket
                    </p>
                  </div>
                </div>
              </section>

              {/* XP PROGRESS BAR (Full Width di Bawah Grid) */}
              <div
                className="mt-2.5 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#134E4A] bg-white px-3 py-3 shadow-[2px_2px_0px_#134E4A] transition-transform active:scale-95 sm:gap-4 sm:px-4"
                onClick={() => setIsRankModalOpen(true)}
              >
                {/* Ilustrasi Rank di Kiri */}
                <div className="shrink-0">
                  <RankBadgeSvg
                    rankId={rank.id as any}
                    size={52}
                    isActive={true} // Agar muncul pita oranye di bawah medali
                  />
                </div>

                {/* Teks & Progress Bar di Kanan */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-black sm:text-sm">
                      {/* Ikon medali kecil opsional, bisa dihapus jika dirasa dobel */}
                      Rank: {rank.title}
                    </span>
                    <span className="text-[10px] font-black uppercase text-[#134E4A]/60 sm:text-[11px]">
                      {currentXp} / {nextXp} XP
                    </span>
                  </div>

                  <AnimatedProgressBar
                    value={xpProgressPercentage}
                    barClassName="bg-[#F59E0B]"
                    className="h-2.5 w-full rounded-full border-2 border-[#134E4A] bg-[#F0FDF4]"
                  />

                  <p className="mt-1.5 text-[10px] font-bold text-[#134E4A]/60 sm:text-[11px]">
                    Sisa {Math.max(0, nextXp - currentXp)} XP lagi menuju Rank
                    selanjutnya!
                  </p>
                </div>
              </div>
            </div>

            {/* B. Blok "Kurikulum Tilawati" (Belajar) */}
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-wider text-[#134E4A]">
                  <BookOpenSvg size={16} className="text-[#0D9488]" /> Kurikulum
                  Tilawati
                </h3>
              </div>
              <section className="grid grid-cols-2 gap-2.5">
                {/* Kartu 1: Jilid */}
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border-2 border-[#134E4A] bg-white px-3 py-3 text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <GraduationCapSvg
                    size={22}
                    className="shrink-0 text-[#0D9488]"
                    stroke="#134E4A"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black leading-tight text-[#134E4A] sm:text-[15px]">
                      Tilawati {currentJilidNumber}
                    </p>
                    <p className="mt-0.5 text-[10px] font-black uppercase leading-none text-[#134E4A]/60 sm:text-[11px]">
                      Level Aktif
                    </p>
                  </div>
                </div>

                {/* Kartu 2: Halaman Selesai */}
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border-2 border-[#134E4A] bg-white px-3 py-3 text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <BookOpenSvg
                    size={22}
                    className="shrink-0 text-[#0D9488]"
                    stroke="#134E4A"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black leading-tight text-[#134E4A] sm:text-[15px]">
                      <AnimatedCounter value={completedPagesCount} /> Halaman
                    </p>
                    <p className="mt-0.5 text-[10px] font-black uppercase leading-none text-[#134E4A]/60 sm:text-[11px]">
                      Selesai Belajar
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* 3. Menu Utama (Grid 2x2) */}
          <section className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Card 1: Kamar Maskot */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/member/ngaji-ceria/kamar-tila")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/member/ngaji-ceria/kamar-tila");
                }
              }}
              className="flex min-h-[88px] cursor-pointer items-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] p-3.5 shadow-[3px_3px_0px_#134E4A] transition-all hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#134E4A]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-[#134E4A] bg-white shadow-[1.5px_1.5px_0px_#134E4A]">
                  <div className="transform scale-[0.55] translate-y-1.5">
                    <TilaMascot
                      size={64}
                      accessory={equippedAccessory as any}
                      animation="bounce"
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-sm font-black leading-tight text-[#134E4A]">
                    Kamar {mascotName}
                  </h3>
                  <p className="mt-1 truncate text-xs font-semibold text-[#134E4A]/75">
                    Skin &amp; Aksesoris
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Warung Santri */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/member/ngaji-ceria/warung-santri")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/member/ngaji-ceria/warung-santri");
                }
              }}
              className="flex min-h-[88px] cursor-pointer items-center rounded-2xl border-[3px] border-[#134E4A] bg-[#DCFCE7] p-3.5 shadow-[3px_3px_0px_#134E4A] transition-all hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#134E4A]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[1.5px_1.5px_0px_#134E4A]">
                  <StoreSvg size={20} className="text-[#166534]" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-sm font-black leading-tight text-[#134E4A]">
                    Warung Santri
                  </h3>
                  <p className="mt-1 truncate text-xs font-semibold text-[#134E4A]/75">
                    Beli Item &amp; Kostum
                  </p>
                </div>
              </div>
            </div>

            {/* Card Laporan Belajar (Promoted / Featured) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/member/ngaji-ceria/profile/history")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/member/ngaji-ceria/profile/history");
                }
              }}
              className="col-span-2 flex min-h-[88px] cursor-pointer items-center justify-between rounded-2xl border-[3px] border-[#134E4A] bg-[#E9D5FF] p-3.5 shadow-[3px_3px_0px_#134E4A] transition-all hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#134E4A]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[1.5px_1.5px_0px_#134E4A]">
                  <ClipboardListSvg size={24} className="text-[#7E22CE]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-black leading-tight text-[#134E4A]">
                    Laporan Belajar
                  </h3>
                  <p className="mt-1 truncate text-xs font-semibold text-[#134E4A]/80">
                    Riwayat &amp; Pencapaian Santri
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-white shadow-[1px_1px_0px_#134E4A]">
                <ChevronRightSvg size={18} className="text-[#134E4A]" />
              </div>
            </div>

            {/* Card 3: Panel Ustadz atau Kelas Saya */}
            {classroomRole === "ustadz" || classroomRole === "monitor" ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/ustadz")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate("/ustadz");
                }}
                className="flex min-h-[88px] cursor-pointer items-center rounded-2xl border-[3px] border-[#134E4A] bg-[#ECFEFF] p-3.5 shadow-[3px_3px_0px_#134E4A] transition-all hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#134E4A]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[1.5px_1.5px_0px_#134E4A]">
                    <GraduationCapSvg size={20} className="text-[#0891B2]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-black leading-tight text-[#134E4A]">
                      Panel Ustadz
                    </h3>
                    <p className="mt-1 truncate text-xs font-semibold text-[#134E4A]/75">
                      Kelola Kelas &amp; Nilai
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/member/ngaji-ceria/kelas")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate("/member/ngaji-ceria/kelas");
                  }
                }}
                className="flex min-h-[88px] cursor-pointer items-center rounded-2xl border-[3px] border-[#134E4A] bg-[#ECFEFF] p-3.5 shadow-[3px_3px_0px_#134E4A] transition-all hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#134E4A]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[1.5px_1.5px_0px_#134E4A]">
                    <UsersSvg size={20} className="text-[#0891B2]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-black leading-tight text-[#134E4A]">
                      Kelas Saya
                    </h3>
                    <p className="mt-1 truncate text-xs font-semibold text-[#134E4A]/75">
                      Gabung Kelas Ngaji
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Card 4: Panel Admin atau Leaderboard */}
            {isSuperAdmin ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/admin")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate("/admin");
                }}
                className="flex min-h-[88px] cursor-pointer items-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FFE4E6] p-3.5 shadow-[3px_3px_0px_#134E4A] transition-all hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#134E4A]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[1.5px_1.5px_0px_#134E4A]">
                    <ShieldSvg size={20} className="text-[#E11D48]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-black leading-tight text-[#134E4A]">
                      Panel Admin
                    </h3>
                    <p className="mt-1 truncate text-xs font-semibold text-[#134E4A]/75">
                      Kelola Aplikasi
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/member/ngaji-ceria/leaderboard")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate("/member/ngaji-ceria/leaderboard");
                  }
                }}
                className="flex min-h-[88px] cursor-pointer items-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-3.5 shadow-[3px_3px_0px_#134E4A] transition-all hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#134E4A]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white shadow-[1.5px_1.5px_0px_#134E4A]">
                    <TrophySvg size={20} className="text-[#D97706]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-black leading-tight text-[#134E4A]">
                      Peringkat
                    </h3>
                    <p className="mt-1 truncate text-xs font-semibold text-[#134E4A]/75">
                      Leaderboard Santri
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Lemari Lencana */}
          <section className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-4 shadow-[3px_3px_0px_#134E4A] transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-sm font-black uppercase tracking-wider text-[#134E4A]">
                Lemari Lencana
              </h3>
              <span className="rounded-md border border-[#134E4A]/30 bg-[#CCFBF1] px-2 py-1 text-[11px] font-black text-[#134E4A]/80 bg-[#1E293B]">
                {earned.size}/{Object.keys(ACHIEVEMENT_LABELS).length} Terbuka
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {Object.entries(ACHIEVEMENT_LABELS).map(([id, badge]) => {
                const has = earned.has(id);
                return (
                  <div
                    key={id}
                    title={badge.title}
                    className={`shrink-0 flex items-center gap-1.5 rounded-xl border-2 px-2.5 py-1 text-xs font-black transition-all ${
                      has
                        ? "border-[#134E4A] bg-[#FFF0F0] text-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
                        : "border-gray-200 bg-gray-50 text-gray-400 opacity-60"
                    }`}
                  >
                    {has ? (
                      id.startsWith("jilid-") ? (
                        <GraduationCapSvg size={16} />
                      ) : (
                        <MedalSvg size={16} />
                      )
                    ) : (
                      <LockSvg size={14} />
                    )}
                    <span className="max-w-[140px] truncate text-xs">
                      {badge.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Pengaturan & Menu Terpadu */}
          <section className="overflow-hidden rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] shadow-[3px_3px_0px_#134E4A] transition-colors duration-200">
            <div className="border-b-2 border-[#134E4A] bg-[#134E4A] px-4 py-3 text-white">
              <h3 className="font-display text-sm font-black uppercase tracking-wider sm:text-base">
                Pengaturan &amp; Aktivitas
              </h3>
            </div>

            <div className="divide-y-2 divide-[#134E4A]/15">
              {settingsList.map((item) => {
                const Icon = item.icon;

                if (item.isToggle) {
                  return (
                    <div
                      key={item.key}
                      role="switch"
                      aria-checked={item.toggleValue}
                      aria-label={item.title}
                      tabIndex={0}
                      onClick={item.onToggle}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          item.onToggle();
                        }
                      }}
                      className="flex min-h-[76px] w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0D9488] hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] ${item.iconBg} text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488] shadow-[1.5px_1.5px_0px_#134E4A]`}
                        >
                          <Icon
                            size={22}
                            className="text-[#134E4A]"
                            stroke="#134E4A"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-sm font-black leading-tight text-[#134E4A]">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-xs font-medium leading-snug text-[#134E4A]/65 sm:text-[13px]">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`relative w-11 h-6 rounded-full border-2 border-[#134E4A] p-0.5 transition-colors shadow-[1.5px_1.5px_0px_#134E4A] ${
                          item.toggleValue
                            ? "bg-[#0D9488]"
                            : "bg-gray-200 bg-gray-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border border-[#134E4A] transition-transform ${
                            item.toggleValue
                              ? "translate-x-5 bg-[#FEF08A]"
                              : "translate-x-0 bg-white"
                          }`}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={item.action}
                    className="flex min-h-[76px] w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0D9488] hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] ${item.iconBg} text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488] shadow-[1.5px_1.5px_0px_#134E4A]`}
                      >
                        <Icon
                          size={22}
                          className="text-[#134E4A]"
                          stroke="#134E4A"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-sm font-black leading-tight text-[#134E4A]">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs font-medium leading-snug text-[#134E4A]/65 sm:text-[13px]">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <ChevronRightSvg
                      size={18}
                      className="shrink-0 text-[#134E4A]/60"
                    />
                  </button>
                );
              })}
            </div>
          </section>

          <ReferralSection />

          {/* 6. Logout & Akun */}
          <section className="space-y-3 pt-2">
            {user ? (
              <button
                type="button"
                onClick={() => openModal("logout")}
                disabled={loggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#FF6B6B] hover:bg-[#fa5252] py-3.5 font-black text-sm text-white shadow-[3px_3px_0px_#134E4A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-60"
              >
                <LogOutSvg size={18} />
                <span>Keluar Akun</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full rounded-2xl bg-[#0D9488] py-3.5 font-black text-sm text-white border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Masuk / Daftar
              </button>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => openModal("delete")}
                className="rounded-lg px-3 py-2 text-xs font-bold text-[#D94848] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B6B]"
              >
                Hapus Akun Saya
              </button>
            </div>
          </section>

          <p className="pb-4 pt-1 text-center text-xs font-semibold tracking-wide text-[#134E4A]/55">
            Streak {effectiveStreak} hari • Rank {rank.title}
          </p>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: EDIT AVATAR (Terbuka saat klik Avatar / Ikon Kamera)
          Berisi: Tampilan Avatar, Pilih Gender, Pilih 3 Karakter, & Aksesoris
         ===================================================================== */}
      {activeModal === "avatar" && (
        <AppModal
          isOpen={true}
          title="Edit Avatar"
          variant="warm"
          onClose={() => setActiveModal(null)}
        >
          <div className="max-h-[min(74dvh,700px)] space-y-4 overflow-y-auto pr-1 sm:pr-2">
            {/* Pratinjau Avatar Langsung */}
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#134E4A]/30 bg-amber-50/50 p-4">
              <span className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60">
                Pratinjau Avatar
              </span>

              {avatarModeDraft === "photo" ? (
                <AvatarWithBadge
                  src={user?.photo_url}
                  name={displayName}
                  size={88}
                  shape="circle"
                  role={user?.role}
                  groupId={user?.group_id}
                  gender={genderDraft === "girl" ? "P" : "L"}
                  borderClassName="border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] bg-white"
                />
              ) : (
                <AvatarSantriSvg
                  size={92}
                  gender={resolveMascotGender(genderDraft)}
                  variant={variantDraft}
                  accessory={accessoryDraft || "none"}
                  mood="happy"
                  className="shrink-0"
                />
              )}

              {avatarModeDraft === "photo" && !user?.photo_url && (
                <div className="mt-3 flex w-full items-start gap-2 rounded-xl border-2 border-[#B45309] bg-[#FEF3C7] p-2.5 text-left text-xs font-bold text-[#78350F] shadow-[2px_2px_0px_#B45309]">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-[#B45309]"
                  />
                  <div>
                    <p className="font-black">Belum Ada Foto Profil</p>
                    <p className="mt-0.5 text-[11px] opacity-90">
                      Akunmu belum memiliki foto profil. Silakan gunakan mode
                      Karakter Avatar di bawah.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 1. Mode Tampilan Profil */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase text-[#134E4A]">
                Mode Tampilan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAvatarModeDraft("avatar")}
                  className={`cursor-pointer rounded-2xl border-[3px] border-[#134E4A] px-3 py-2.5 text-center font-display text-sm font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 ${
                    avatarModeDraft === "avatar"
                      ? "bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                      : "bg-white opacity-70 hover:bg-slate-50"
                  }`}
                >
                  Karakter Avatar
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarModeDraft("photo")}
                  className={`cursor-pointer rounded-2xl border-[3px] border-[#134E4A] px-3 py-2.5 text-center font-display text-sm font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 ${
                    avatarModeDraft === "photo"
                      ? "bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                      : "bg-white opacity-70 hover:bg-slate-50"
                  }`}
                >
                  Foto Profil
                </button>
              </div>
            </div>

            {/* 2. Pilih Gender (Santri Putra / Santri Putri) */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase text-[#134E4A]">
                Pilih Gender
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectGenderDraft("boy")}
                  className={`cursor-pointer rounded-2xl border-[3px] border-[#134E4A] p-2.5 text-center transition-all ${
                    genderDraft === "boy"
                      ? "bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                      : "bg-white opacity-70 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-display text-sm font-black text-[#134E4A]">
                    Santri Putra
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectGenderDraft("girl")}
                  className={`cursor-pointer rounded-2xl border-[3px] border-[#134E4A] p-2.5 text-center transition-all ${
                    genderDraft === "girl"
                      ? "bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                      : "bg-white opacity-70 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-display text-sm font-black text-[#134E4A]">
                    Santri Putri
                  </p>
                </button>
              </div>
            </div>

            {/* 3. Pilih Karakter (3 Variasi Cowok / 3 Variasi Cewek) */}
            {avatarModeDraft === "avatar" && (
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase text-[#134E4A]">
                  Pilih Gaya Karakter (3 Variasi)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {AVATAR_CHARACTER_VARIANTS.map((charItem) => {
                    const isSelected = variantDraft === charItem.id;
                    return (
                      <button
                        key={charItem.id}
                        type="button"
                        onClick={() => setVariantDraft(charItem.id)}
                        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-[2.5px] border-[#134E4A] p-2.5 text-center text-xs font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 ${
                          isSelected
                            ? "bg-[#FEF08A] shadow-[2.5px_2.5px_0px_#134E4A]"
                            : "bg-white opacity-80 hover:bg-slate-50"
                        }`}
                      >
                        <AvatarSantriSvg
                          size={54}
                          gender={resolveMascotGender(genderDraft)}
                          variant={charItem.id}
                          accessory="none"
                          mood="happy"
                        />
                        <span>
                          {genderDraft === "girl"
                            ? charItem.girlLabel
                            : charItem.boyLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Pilih Aksesoris Avatar */}
            {avatarModeDraft === "avatar" && (
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase text-[#134E4A]">
                  Pilih Aksesoris
                </label>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccessoryDraft(null)}
                      className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-[2.5px] border-[#134E4A] p-2.5 text-center text-xs font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 ${
                        !accessoryDraft || accessoryDraft === "none"
                          ? "bg-[#FEF08A] shadow-[2.5px_2.5px_0px_#134E4A]"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <AvatarSantriSvg
                        size={42}
                        gender={resolveMascotGender(genderDraft)}
                        variant={variantDraft}
                        accessory={null}
                      />
                      <span>Tanpa Aksesoris</span>
                    </button>
                    {effectiveOwnedAccessories
                      .filter((accId) => {
                        const item = AVATAR_ACCESSORIES_CONFIG.find(
                          (i) => i.id === accId,
                        );
                        if (!item) return false;
                        return (
                          item.gender === "all" || item.gender === genderDraft
                        );
                      })
                      .map((accId) => (
                        <button
                          key={accId}
                          type="button"
                          onClick={() =>
                            setAccessoryDraft(accId as AvatarSantriAccessory)
                          }
                          className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-[2.5px] border-[#134E4A] p-2.5 text-center text-xs font-black capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 ${
                            accessoryDraft === accId
                              ? "bg-[#FEF08A] shadow-[2.5px_2.5px_0px_#134E4A]"
                              : "bg-white hover:bg-slate-50"
                          }`}
                        >
                          <AvatarSantriSvg
                            size={42}
                            gender={resolveMascotGender(genderDraft)}
                            variant={variantDraft}
                            accessory={accId}
                          />
                          <span>{getAvatarAccessoryName(accId)}</span>
                        </button>
                      ))}
                  </div>
                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        navigate(
                          "/member/ngaji-ceria/warung-santri?tab=avatar",
                        );
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-black text-[#0D9488] hover:underline"
                    >
                      <StoreSvg size={13} /> Beli aksesoris lainnya di Warung
                      Santri
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tombol Simpan Avatar */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className={`flex-1 ${btnCancelStyle}`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                className={`flex-1 ${btnPrimaryStyle}`}
              >
                Simpan Avatar
              </button>
            </div>
          </div>
        </AppModal>
      )}

      {/* =====================================================================
          MODAL 2: EDIT PROFIL (Terbuka saat klik ikon Pensil, khusus Nama)
         ===================================================================== */}
      {activeModal === "edit" && (
        <AppModal
          isOpen={true}
          title="Edit Profil"
          variant="warm"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-black uppercase text-[#134E4A]">
                Nama Tampilan
              </label>
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                maxLength={30}
                className={inputStyle}
                placeholder="Masukkan nama tampilan..."
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border-2 border-dashed border-[#134E4A]/25 bg-amber-50/60 px-3.5 py-2.5">
              <span className="text-xs font-bold text-[#134E4A]/80">
                Ingin mengganti karakter atau aksesoris?
              </span>
              <button
                type="button"
                onClick={() => openModal("avatar")}
                className="cursor-pointer text-xs font-black text-[#0D9488] underline-offset-2 hover:underline"
              >
                Buka Edit Avatar
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className={`flex-1 ${btnCancelStyle}`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className={`flex-1 ${btnPrimaryStyle}`}
              >
                Simpan
              </button>
            </div>
          </div>
        </AppModal>
      )}

      {activeModal === "password" && (
        <AppModal
          isOpen={true}
          title="Ganti Kata Sandi"
          onClose={() => setActiveModal(null)}
        >
          {submitted ? (
            <div className="space-y-3 text-center">
              <p className="text-sm font-bold text-[#0D9488]">
                Permintaan perubahan kata sandi terkirim!
              </p>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className={`w-full ${btnPrimaryStyle}`}
              >
                Tutup
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-3"
            >
              <div>
                <label className="mb-1 block text-xs font-bold text-[#134E4A]">
                  Kata Sandi Lama
                </label>
                <input
                  type="password"
                  required
                  className={inputStyle}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#134E4A]">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className={inputStyle}
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className={`flex-1 ${btnCancelStyle}`}
                >
                  Batal
                </button>
                <button type="submit" className={`flex-1 ${btnPrimaryStyle}`}>
                  Simpan
                </button>
              </div>
            </form>
          )}
        </AppModal>
      )}

      {activeModal === "feedback" && (
        <AppModal
          isOpen={true}
          title="Kritik & Saran"
          variant="warm"
          onClose={handleCloseFeedback}
        >
          {submitted ? (
            <div className="space-y-3 text-center">
              <p className="text-sm font-bold text-[#0D9488]">
                Jazakallahu khair! Masukanmu sangat berharga.
              </p>
              <button
                type="button"
                onClick={handleCloseFeedback}
                className={`w-full ${btnPrimaryStyle}`}
              >
                Tutup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#134E4A]">
                  Pesan Masukan
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tulis kritik, saran, atau ide fitur baru di sini..."
                  className={`${inputStyle} resize-none`}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseFeedback}
                  className={`flex-1 ${btnCancelStyle}`}
                >
                  Batal
                </button>
                <button type="submit" className={`flex-1 ${btnPrimaryStyle}`}>
                  Kirim
                </button>
              </div>
            </form>
          )}
        </AppModal>
      )}

      {activeModal === "install" && (
        <AppModal
          isOpen={true}
          title="Install Tartila"
          variant="warm"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold text-[#134E4A]/80 leading-relaxed">
              Pasang aplikasi Tartila di layar utama agar kamu bisa belajar
              ngaji dengan lebih cepat dan nyaman setiap hari!
            </p>
            {getInstallPrompt() ? (
              <button
                type="button"
                onClick={handleInstall}
                className={`w-full ${btnPrimaryStyle}`}
              >
                Pasang Sekarang
              </button>
            ) : (
              <p className="text-[11px] font-bold text-[#134E4A]/60 bg-gray-50 p-3 rounded-xl border-2 border-dashed border-[#134E4A]/20">
                Buka menu browser (titik tiga) lalu pilih "Tambahkan ke Layar
                Utama".
              </p>
            )}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className={`w-full ${btnCancelStyle}`}
            >
              Tutup
            </button>
          </div>
        </AppModal>
      )}

      {activeModal === "logout" && (
        <AppModal
          isOpen={true}
          title="Keluar Akun?"
          variant="warm"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold text-[#134E4A]/80">
              Apakah kamu yakin ingin keluar dari akun Tartila? Progress
              harianmu tetap tersimpan aman.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className={`flex-1 ${btnCancelStyle}`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className={`flex-1 ${btnDangerStyle}`}
              >
                {loggingOut ? "Keluar..." : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </AppModal>
      )}

      {activeModal === "delete" && (
        <AppModal
          isOpen={true}
          title="Hapus Akun"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold text-[#991B1B]">
              Tindakan ini permanen. Seluruh data koin, bintang, dan riwayat
              belajar kamu akan dihapus.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className={`flex-1 ${btnCancelStyle}`}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className={`flex-1 ${btnDangerStyle}`}
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </AppModal>
      )}

      {/* Voucher Modal */}
      <VoucherRedeemModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
      />

      {/* Theme Modal */}
      <AppThemeSettingsModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Rank Journey Modal */}
      <RankJourneyModal
        isOpen={isRankModalOpen}
        onClose={() => setIsRankModalOpen(false)}
      />
    </NgajiCeriaLayout>
  );
}
