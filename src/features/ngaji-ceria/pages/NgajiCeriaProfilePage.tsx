import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { useNgajiCeriaStreak } from "../hooks/useNgajiCeriaStreak";
import {
  ACHIEVEMENT_LABELS,
  getRank,
  useNgajiProgress,
} from "./games/_shared/progression";
import { AppModal } from "@/components/ui/AppModal";
import { useNgajiCeriaStore } from "../hooks/useNgajiCeriaStore";
import { useNgajiCeriaProgress } from "../hooks/useNgajiCeriaProgress";
import { getTilawatiDataset } from "../data/tilawatiPageDatasets";
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
import { TilaMascot } from "@/components/ui/TilaMascot";
import { AvatarSantriSvg } from "@/components/ui/Illustrations";
import { AvatarSantriAccessory } from "@/components/ui/Illustrations";
import { AVATAR_ACCESSORY_SHOP_ITEMS } from "../pages/WarungSantriPage";
import {
  getMascotName,
  resolveMascotGender,
} from "@/utils/mascotHelper";
import { isAdminRole, classroomRoleForUser } from "@/lib/roles";
import { stopAllAudio } from "../utils/audioPlayer";

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
} from "@/components/ui/CustomIcons";

const TOTAL_STARS = 654;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type ActiveModal =
  | "edit"
  | "password"
  | "feedback"
  | "install"
  | "logout"
  | "delete"
  | null;

const AVATAR_ACCESSORIES_CONFIG: { id: string; name: string }[] = [
  { id: "peci", name: "Peci" },
  { id: "hairbow", name: "Pita Rambut" },
  { id: "flowercrown", name: "Mahkota Bunga" },
  { id: "glasses", name: "Kacamata" },
  { id: "crown", name: "Mahkota Juara" },
  { id: "wizardhat", name: "Topi Penyihir" },
  { id: "headphone", name: "Headphone" },
  { id: "sleepmask", name: "Penutup Mata" },
  { id: "scarf", name: "Syal Leher" },
  { id: "turban", name: "Sorban Arabia" },
  { id: "sunglasses", name: "Kacamata Hitam" },
  { id: "chain", name: "Kalung Emas" },
  { id: "star", name: "Bintang Emas" },
  { id: "medal", name: "Medali Juara" },
  { id: "bandana", name: "Bandana Merah" },
];

function getAvatarAccessoryName(id: string): string {
  const found = AVATAR_ACCESSORIES_CONFIG.find((item) => item.id === id);
  return found?.name || id;
}

export default function NgajiCeriaProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentStreak } = useNgajiCeriaStreak();
  const loginStreak = useEconomyStore((s) => s.loginStreak);
  const effectiveStreak = Math.max(loginStreak, currentStreak);
  const progress = useNgajiProgress();
  const rank = getRank(progress.xp);
  const { currentJilid } = useNgajiCeriaProgress();
  const currentJilidNumber = Number(currentJilid.replace("jilid-", "")) || 1;

  const stars = useNgajiCeriaStore((state) => state.stars);
  const equippedAccessory = useEconomyStore((s) => s.equippedAccessory);
  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const setTilaGender = useEconomyStore((s) => s.setTilaGender);
  const mascotName = getMascotName(tilaGender);

  const avatarMode = useEconomyStore((s) => s.avatarMode || "avatar");
  const setAvatarMode = useEconomyStore((s) => s.setAvatarMode);
  const equippedAvatarAccessory = useEconomyStore((s) => s.equippedAvatarAccessory);
  const setEquippedAvatarAccessory = useEconomyStore((s) => s.setEquippedAvatarAccessory);
  const ownedAvatarAccessories = useEconomyStore((s) => s.ownedAvatarAccessories || []);

  const showMascot = useEconomyStore((s) => s.showMascot);
  const setShowMascot = useEconomyStore((s) => s.setShowMascot);

  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const isUnlimited = isUnlimitedUser(user, isVip, user?.group_id);

  const isSuperAdmin = isAdminRole(user?.role);
  const classroomRole = classroomRoleForUser(user);

  const [genderDraft, setGenderDraft] = useState<TilaGender>(tilaGender);
  const [avatarModeDraft, setAvatarModeDraft] = useState<"photo" | "avatar">("avatar");
  const [accessoryDraft, setAccessoryDraft] = useState<AvatarSantriAccessory | null>(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const earnedStars = useMemo(
    () => Object.values(stars).reduce((sum, value) => sum + (value || 0), 0),
    [stars],
  );

  const earned = useMemo(() => {
    const set = new Set(progress.achievements);
    for (let jilid = 1; jilid <= 6; jilid++) {
      const pages = Object.keys(getTilawatiDataset(jilid));
      if (
        pages.length &&
        pages.every((page) => stars[`jilid-${jilid}-hal-${page}`] > 0)
      ) {
        set.add(`jilid-${jilid}-clear`);
      }
    }
    return set;
  }, [progress.achievements, stars]);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const displayName = nameOverride || user?.name || "Tamu Tartila";
  const email = user?.username
    ? `${user.username}@santri.ngajiceria.id`
    : "Belum terhubung akun";

  const openModal = (modal: ActiveModal) => {
    setSubmitted(false);
    if (modal === "edit") {
      setNameDraft(displayName);
      const userNorm = user?.gender ? normalizeGender(user.gender) : null;
      setGenderDraft(userNorm === "P" || tilaGender === "girl" ? "girl" : "boy");
      setAvatarModeDraft(avatarMode);
      setAccessoryDraft(equippedAvatarAccessory as AvatarSantriAccessory | null);
    }
    setActiveModal(modal);
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
    if (user?.gender) {
      const norm = normalizeGender(user.gender);
      if (norm === "L" && tilaGender !== "boy") {
        setTilaGender("boy");
      } else if (norm === "P" && tilaGender !== "girl") {
        setTilaGender("girl");
      }
    }
  }, [user?.gender, tilaGender, setTilaGender]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setActiveModal(null);
  };

  const handleSaveProfile = async () => {
    if (nameDraft.trim()) setNameOverride(nameDraft.trim());
    if (genderDraft) {
      await setTilaGender(genderDraft);
    }
    setAvatarMode(avatarModeDraft);
    if (avatarModeDraft === "avatar") {
      setEquippedAvatarAccessory(accessoryDraft);
    }
    setActiveModal(null);
  };

  // Settings Items for the unified card list
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
      key: "history",
      icon: ClipboardListSvg,
      iconBg: "bg-[#E9D5FF]",
      title: "Riwayat & Laporan",
      subtitle: "Lihat progres belajar dan setoran",
      action: () => navigate("/member/ngaji-ceria/profile/history"),
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
      action: () => openModal("install"),
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
      <div className="min-h-full bg-[var(--bg-app,#F0FDF4)] text-[var(--text-main,#134E4A)] pb-24 transition-colors duration-200">
        {/* 1. Header Banner Profil */}
        <header className="rounded-b-[28px] bg-[#134E4A] px-5 pb-12 pt-safe text-white relative overflow-hidden border-b-[3px] border-[var(--border-color,#134E4A)]">
          <div className="pt-4 relative z-10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6B6B]">
                Ruang Santri
              </span>
              <h1 className="font-display text-xl font-black">
                Profil Belajarku
              </h1>
            </div>
            <div className="rounded-xl border-2 border-white/20 bg-white/10 px-2.5 py-1 text-right">
              <p className="text-[9px] font-black uppercase tracking-wider text-white/70">
                Streak
              </p>
              <p className="text-xs font-black text-[#FBBF24] flex items-center justify-end gap-1">
                <FireSvg size={14} className="text-[#EA580C]" />
                <span>{effectiveStreak} Hari</span>
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-4 px-4">
          {/* 1. Avatar Card */}
          <section className="-mt-8 relative z-20 rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] p-3.5 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] transition-colors duration-200">
            <div className="flex items-center gap-3">
              {avatarMode === "photo" ? (
                <AvatarWithBadge
                  src={user?.photo_url}
                  name={displayName}
                  size={58}
                  shape="circle"
                  role={user?.role}
                  groupId={user?.group_id}
                  gender={normalizeGender(user?.gender)}
                  borderClassName="border-2 border-[#FF6B6B] bg-white"
                />
              ) : (
                <AvatarSantriSvg
                  size={58}
                  gender={resolveMascotGender(tilaGender)}
                  accessory={(equippedAvatarAccessory || "none") as AvatarSantriAccessory}
                  mood="happy"
                  className="shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="truncate text-base font-black text-[var(--text-main,#134E4A)]">
                    {displayName}
                  </h2>
                  <span
                    className={`inline-block rounded-md px-1.5 py-0.5 text-[8px] font-black tracking-wider text-white border border-[#134E4A] ${
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
                    <span className="inline-block rounded-md bg-[#FEF08A] text-[#134E4A] px-1 py-0.5 text-[8px] font-black border border-[#134E4A]">
                      ∞ UNLIMITED
                    </span>
                  )}
                </div>
                <p className="truncate text-[11px] font-bold text-[var(--text-main,#134E4A)]/60 mt-0.5">
                  {email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openModal("edit")}
                className="shrink-0 rounded-xl p-2 bg-[var(--bg-app,#F0FDF4)] border-2 border-[var(--border-color,#134E4A)] text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px] active:shadow-none transition-all hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                title="Edit Profil"
              >
                <PencilSvg size={16} />
              </button>
            </div>
          </section>

          {/* 2. Quick Stats: 1 Baris Horizontal Scrollable */}
          <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {/* Level */}
            <div className="shrink-0 flex items-center gap-2 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3 py-2 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488]">
              <GraduationCapSvg size={20} className="shrink-0 text-[#134E4A]" stroke="#134E4A" />
              <div>
                <p className="text-[9px] font-black uppercase text-gray-500 dark:text-gray-400 leading-none">
                  Level
                </p>
                <p className="text-xs font-black text-[var(--text-main,#134E4A)] leading-tight">
                  Tilawati {currentJilidNumber}
                </p>
              </div>
            </div>

            {/* Bintang */}
            <div className="shrink-0 flex items-center gap-2 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3 py-2 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488]">
              <StarSvg size={20} className="shrink-0 text-[#134E4A]" stroke="#134E4A" />
              <div>
                <p className="text-[9px] font-black uppercase text-gray-500 dark:text-gray-400 leading-none">
                  Bintang
                </p>
                <p className="text-xs font-black text-[var(--text-main,#134E4A)] leading-tight">
                  <AnimatedCounter value={earnedStars} />/{TOTAL_STARS}
                </p>
              </div>
            </div>

            {/* Koin */}
            <div className="shrink-0 flex items-center gap-2 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3 py-2 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488]">
              <CoinsSvg size={20} className="shrink-0 text-[#134E4A]" stroke="#134E4A" />
              <div>
                <p className="text-[9px] font-black uppercase text-gray-500 dark:text-gray-400 leading-none">
                  Koin
                </p>
                <p className="text-xs font-black text-[var(--text-main,#134E4A)] leading-tight">
                  <AnimatedCounter value={progress.coins || 0} />
                </p>
              </div>
            </div>

            {/* Kuota Hati */}
            <div className="shrink-0 flex items-center gap-2 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3 py-2 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488]">
              <HeartSvg size={20} className="shrink-0 text-[#134E4A]" stroke="#134E4A" />
              <div>
                <p className="text-[9px] font-black uppercase text-gray-500 dark:text-gray-400 leading-none">
                  Hati
                </p>
                <p className="text-xs font-black text-[var(--text-main,#134E4A)] leading-tight">
                  {isUnlimited ? "∞ (VIP)" : `${hearts}/5`}
                </p>
              </div>
            </div>

            {/* Tiket Game */}
            <div className="shrink-0 flex items-center gap-2 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] px-3 py-2 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488]">
              <TicketSvg size={20} className="shrink-0 text-[#134E4A]" stroke="#134E4A" />
              <div>
                <p className="text-[9px] font-black uppercase text-gray-500 dark:text-gray-400 leading-none">
                  Tiket
                </p>
                <p className="text-xs font-black text-[var(--text-main,#134E4A)] leading-tight">
                  {isUnlimited ? "∞ (VIP)" : `${tickets}/3`}
                </p>
              </div>
            </div>
          </section>

          {/* 3. Menu Utama (Grid 2x2) */}
          <section className="grid grid-cols-2 gap-3">
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
              className="cursor-pointer rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#FEF08A] dark:bg-[var(--bg-card)] p-3 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] hover:opacity-95"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] flex items-center justify-center">
                  <div className="transform scale-[0.55] translate-y-1.5">
                    <TilaMascot
                      size={64}
                      accessory={equippedAccessory as any}
                      animation="bounce"
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-xs font-black text-[var(--text-main,#134E4A)]">
                    Kamar {mascotName}
                  </h3>
                  <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/70 truncate">
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
              className="cursor-pointer rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#DCFCE7] dark:bg-[var(--bg-card)] p-3 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] hover:opacity-95"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 shrink-0 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] flex items-center justify-center">
                  <StoreSvg size={20} className="text-[#166534] dark:text-[#4ade80]" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-xs font-black text-[var(--text-main,#134E4A)]">
                    Warung Santri
                  </h3>
                  <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/70 truncate">
                    Beli Item &amp; Kostum
                  </p>
                </div>
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
                className="cursor-pointer rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#ECFEFF] dark:bg-[var(--bg-card)] p-3 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] hover:opacity-95"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] flex items-center justify-center">
                    <GraduationCapSvg size={20} className="text-[#0891B2] dark:text-[#38bdf8]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xs font-black text-[var(--text-main,#134E4A)]">
                      Panel Ustadz
                    </h3>
                    <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/70 truncate">
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
                className="cursor-pointer rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#ECFEFF] dark:bg-[var(--bg-card)] p-3 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] hover:opacity-95"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] flex items-center justify-center">
                    <UsersSvg size={20} className="text-[#0891B2] dark:text-[#38bdf8]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xs font-black text-[var(--text-main,#134E4A)]">
                      Kelas Saya
                    </h3>
                    <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/70 truncate">
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
                className="cursor-pointer rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#FFE4E6] dark:bg-[var(--bg-card)] p-3 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] hover:opacity-95"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] flex items-center justify-center">
                    <ShieldSvg size={20} className="text-[#E11D48]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xs font-black text-[var(--text-main,#134E4A)]">
                      Panel Admin
                    </h3>
                    <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/70 truncate">
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
                className="cursor-pointer rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#FEF3C7] dark:bg-[var(--bg-card)] p-3 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--shadow-color,#134E4A)] hover:opacity-95"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] flex items-center justify-center">
                    <TrophySvg size={20} className="text-[#D97706]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xs font-black text-[var(--text-main,#134E4A)]">
                      Peringkat
                    </h3>
                    <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/70 truncate">
                      Leaderboard Santri
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 4. Referral Card (Ringkas) */}
          <ReferralSection />

          {/* Lemari Lencana (Ringkas & Horizontal) */}
          <section className="rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] p-3.5 shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-xs font-black uppercase text-[var(--text-main,#134E4A)] tracking-wider">
                Lemari Lencana
              </h3>
              <span className="text-[10px] font-black text-[var(--text-main,#134E4A)]/70 bg-[#CCFBF1] dark:bg-[#1E293B] px-2 py-0.5 rounded-md border border-[var(--border-color,#134E4A)]/30">
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
                    <span className="truncate max-w-[120px] text-[10px]">
                      {badge.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. Pengaturan & Menu Terpadu (SATU Card List Besar - Neo-Brutalism Solid) */}
          <section className="rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[4px_4px_0px_var(--shadow-color,#134E4A)] overflow-hidden transition-colors duration-200">
            <div className="bg-[#134E4A] px-4 py-2.5 text-white border-b-2 border-[var(--border-color,#134E4A)]">
              <h3 className="font-display text-xs font-black uppercase tracking-wider">
                Pengaturan &amp; Aktivitas
              </h3>
            </div>

            <div className="divide-y-2 divide-[var(--border-color,#134E4A)]/15">
              {settingsList.map((item) => {
                const Icon = item.icon;

                if (item.isToggle) {
                  return (
                    <div
                      key={item.key}
                      role="button"
                      tabIndex={0}
                      onClick={item.onToggle}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          item.onToggle();
                        }
                      }}
                      className="flex w-full items-center justify-between p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer select-none text-left"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl border-[2.5px] border-[#134E4A] dark:border-white/80 ${item.iconBg} text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488] shadow-[2.5px_2.5px_0px_#134E4A] dark:shadow-[2.5px_2.5px_0px_#000000] shrink-0`}
                        >
                          <Icon size={22} className="text-[#134E4A]" stroke="#134E4A" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block font-black text-xs text-[var(--text-main,#134E4A)]">
                            {item.title}
                          </span>
                          <span className="block truncate text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`relative w-11 h-6 rounded-full border-2 border-[var(--border-color,#134E4A)] p-0.5 transition-colors shadow-[1.5px_1.5px_0px_var(--shadow-color,#134E4A)] ${
                          item.toggleValue ? "bg-[#0D9488]" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border border-[var(--border-color,#134E4A)] transition-transform ${
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
                    className="flex w-full items-center justify-between p-3.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border-[2.5px] border-[#134E4A] dark:border-white/80 ${item.iconBg} text-[#134E4A] [--svg-primary:#134E4A] [--svg-secondary:#0D9488] shadow-[2.5px_2.5px_0px_#134E4A] dark:shadow-[2.5px_2.5px_0px_#000000] shrink-0`}
                      >
                        <Icon size={22} className="text-[#134E4A]" stroke="#134E4A" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block font-black text-xs text-[var(--text-main,#134E4A)]">
                          {item.title}
                        </span>
                        <span className="block truncate text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <ChevronRightSvg
                      size={18}
                      className="shrink-0 text-[var(--text-main,#134E4A)]/60"
                    />
                  </button>
                );
              })}
            </div>
          </section>

          {/* 6. Logout & Akun (Paling Bawah) */}
          <section className="pt-2 space-y-2.5">
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
                className="text-[11px] font-bold text-[#FF6B6B] hover:underline"
              >
                Hapus Akun Saya
              </button>
            </div>
          </section>

          <p className="pt-1 pb-4 text-center text-[10px] font-bold text-[#134E4A]/50 tracking-wider">
            Streak {effectiveStreak} hari • Pangkat {rank.title}
          </p>
        </div>
      </div>

      {/* --- MODALS --- */}
      {activeModal === "edit" && (
        <AppModal isOpen={true}
          title="Edit Profil"
          variant="warm"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-4">
            {/* Pratinjau Avatar Langsung */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-[#134E4A]/30 bg-amber-50/50">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 mb-2">
                Pratinjau {avatarModeDraft === "photo" ? "Foto Profil" : "Avatar"}
              </span>

              {avatarModeDraft === "photo" ? (
                <AvatarWithBadge
                  src={user?.photo_url}
                  name={nameDraft || displayName}
                  size={84}
                  shape="circle"
                  role={user?.role}
                  groupId={user?.group_id}
                  gender={genderDraft === "girl" ? "P" : "L"}
                  borderClassName="border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] bg-white"
                />
              ) : (
                <AvatarSantriSvg
                  size={80}
                  gender={resolveMascotGender(genderDraft)}
                  accessory={accessoryDraft || "none"}
                  mood="happy"
                  className="shrink-0"
                />
              )}

              {/* Peringatan jika Foto Profil dipilih namun photo_url kosong */}
              {avatarModeDraft === "photo" && !user?.photo_url && (
                <div className="mt-3 w-full rounded-xl border-2 border-[#B45309] bg-[#FEF3C7] p-2.5 text-left text-xs font-bold text-[#78350F] flex items-start gap-2 shadow-[2px_2px_0px_#B45309]">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#B45309]" />
                  <div>
                    <p className="font-black">Belum Ada Foto Profil</p>
                    <p className="text-[11px] opacity-90 mt-0.5">
                      Akunmu belum memiliki foto profil. Foto dapat diambil otomatis dari akun Google saat masuk, atau gunakan mode Avatar.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pilihan Tampilan Avatar Profil */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase text-[#134E4A]">
                Tampilan Profil
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAvatarModeDraft("photo")}
                  className={`rounded-2xl border-[3px] border-[#134E4A] py-2.5 px-3 text-center transition-all font-display font-black text-xs cursor-pointer ${
                    avatarModeDraft === "photo"
                      ? "bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                      : "bg-white hover:bg-slate-50 opacity-70"
                  }`}
                >
                  Foto Profil
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarModeDraft("avatar")}
                  className={`rounded-2xl border-[3px] border-[#134E4A] py-2.5 px-3 text-center transition-all font-display font-black text-xs cursor-pointer ${
                    avatarModeDraft === "avatar"
                      ? "bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                      : "bg-white hover:bg-slate-50 opacity-70"
                  }`}
                >
                  Avatar
                </button>
              </div>
            </div>

            {/* Nama Tampilan */}
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
                placeholder="Nama kamu..."
              />
            </div>

            {/* Karakter Avatar */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase text-[#134E4A]">
                Karakter Avatar
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGenderDraft("boy")}
                  className={`rounded-2xl border-[3px] border-[#134E4A] p-3 text-center transition-all cursor-pointer ${
                    genderDraft === "boy"
                      ? "bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                      : "bg-white opacity-70"
                  }`}
                >
                  <p className="font-display font-black text-sm text-[#134E4A]">
                    Santri Putra
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setGenderDraft("girl")}
                  className={`rounded-2xl border-[3px] border-[#134E4A] p-3 text-center transition-all cursor-pointer ${
                    genderDraft === "girl"
                      ? "bg-[#FEF08A] shadow-[3px_3px_0px_#134E4A]"
                      : "bg-white opacity-70"
                  }`}
                >
                  <p className="font-display font-black text-sm text-[#134E4A]">
                    Santri Putri
                  </p>
                </button>
              </div>
            </div>

            {/* Grid Aksesoris Avatar (Hanya muncul saat mode Avatar dipilih) */}
            {avatarModeDraft === "avatar" && (
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase text-[#134E4A]">
                  Aksesoris Avatar
                </label>
                {ownedAvatarAccessories.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-[#134E4A]/40 bg-amber-50/60 p-4 text-center space-y-2">
                    <p className="text-xs font-bold text-[#134E4A]/80">
                      Belum ada aksesoris avatar yang dimiliki.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal(null);
                        navigate("/member/ngaji-ceria/warung-santri?tab=avatar");
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-black text-xs shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none hover:bg-[#FDE047] transition-all cursor-pointer"
                    >
                      <StoreSvg size={14} /> Buka Warung Santri
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setAccessoryDraft(null)}
                        className={`p-2.5 rounded-2xl border-[2.5px] border-[#134E4A] text-center font-black text-xs transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          !accessoryDraft || accessoryDraft === "none"
                            ? "bg-[#FEF08A] shadow-[2.5px_2.5px_0px_#134E4A]"
                            : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <AvatarSantriSvg
                          size={40}
                          gender={resolveMascotGender(genderDraft)}
                          accessory={null}
                        />
                        <span>Tanpa</span>
                      </button>
                      {ownedAvatarAccessories
                        .filter((accId) => {
                          const item = AVATAR_ACCESSORY_SHOP_ITEMS.find((i) => i.id === accId);
                          if (!item) return true;
                          return item.gender === "all" || item.gender === genderDraft;
                        })
                        .map((accId) => (
                          <button
                            key={accId}
                            type="button"
                            onClick={() => setAccessoryDraft(accId as AvatarSantriAccessory)}
                            className={`p-2.5 rounded-2xl border-[2.5px] border-[#134E4A] text-center font-black text-xs capitalize transition-all cursor-pointer flex flex-col items-center gap-1 ${
                              accessoryDraft === accId
                                ? "bg-[#FEF08A] shadow-[2.5px_2.5px_0px_#134E4A]"
                                : "bg-white hover:bg-slate-50"
                            }`}
                          >
                            <AvatarSantriSvg
                              size={40}
                              gender={resolveMascotGender(genderDraft)}
                              accessory={accId}
                            />
                            <span>{getAvatarAccessoryName(accId)}</span>
                          </button>
                        ))}
                    </div>
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModal(null);
                          navigate("/member/ngaji-ceria/warung-santri?tab=avatar");
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#0D9488] hover:underline cursor-pointer"
                      >
                        <StoreSvg size={13} /> Belanja aksesoris lainnya di Warung Santri
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tombol Aksi */}
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
        <AppModal isOpen={true}
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
        <AppModal isOpen={true}
          title="Kritik & Saran"
          variant="warm"
          onClose={() => setActiveModal(null)}
        >
          {submitted ? (
            <div className="space-y-3 text-center">
              <p className="text-sm font-bold text-[#0D9488]">
                Jazakallahu khair! Masukanmu sangat berharga.
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
                  onClick={() => setActiveModal(null)}
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
        <AppModal isOpen={true}
          title="Install Tartila"
          variant="warm"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold text-[#134E4A]/80 leading-relaxed">
              Pasang aplikasi Tartila di layar utama agar kamu bisa belajar ngaji
              dengan lebih cepat dan nyaman setiap hari!
            </p>
            {installPrompt ? (
              <button
                type="button"
                onClick={handleInstall}
                className={`w-full ${btnPrimaryStyle}`}
              >
                Pasang Sekarang
              </button>
            ) : (
              <p className="text-[11px] font-bold text-[#134E4A]/60 bg-gray-50 p-3 rounded-xl border-2 border-dashed border-[#134E4A]/20">
                Buka menu browser (titik tiga) lalu pilih "Tambahkan ke Layar Utama".
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
        <AppModal isOpen={true}
          title="Keluar Akun?"
          variant="warm"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold text-[#134E4A]/80">
              Apakah kamu yakin ingin keluar dari akun Tartila? Progress harianmu
              tetap tersimpan aman.
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
        <AppModal isOpen={true}
          title="Hapus Akun"
          onClose={() => setActiveModal(null)}
        >
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold text-[#991B1B]">
              Tindakan ini permanen. Seluruh data koin, bintang, dan riwayat belajar
              kamu akan dihapus.
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
    </NgajiCeriaLayout>
  );
}
