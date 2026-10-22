import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { useAuth } from "../../../contexts/AuthContext";
import { useNgajiCeriaStreak } from "../hooks/useNgajiCeriaStreak";
import {
  ACHIEVEMENT_LABELS,
  getRank,
  useNgajiProgress,
} from "./games/_shared/progression";
import { ModalPanel } from "./games/_shared/ModalPanel";
import { useNgajiCeriaStore } from "../hooks/useNgajiCeriaStore";
import { useNgajiCeriaProgress } from "../hooks/useNgajiCeriaProgress";
import { getTilawatiDataset } from "../data/tilawatiPageDatasets";
import { Avatar } from "../../../components/ui/Avatar";
import { AvatarWithBadge } from "../../../components/ui/AvatarWithBadge";
import { normalizeGender } from "../../../utils/format";
import { useEconomyStore, isUnlimitedUser, type TilaGender } from "../hooks/useEconomyStore";
import "./games/_shared/games.css";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { getMascotName } from "@/utils/mascotHelper";

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
  TrashSvg,
  UserSvg,
  EyeSvg,
  EyeSlashSvg,
  type SvgProps,
} from "@/components/ui/CustomIcons";

/* ============================================================================
 * MAIN COMPONENT
 * ============================================================================ */

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

export default function NgajiCeriaProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentStreak } = useNgajiCeriaStreak();
  const progress = useNgajiProgress();
  const rank = getRank(progress.xp);
  const { currentJilid } = useNgajiCeriaProgress();
  const currentJilidNumber = Number(currentJilid.replace("jilid-", "")) || 1;

  const stars = useNgajiCeriaStore((state) => state.stars);
  const equippedAccessory = useEconomyStore((s) => s.equippedAccessory);
  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const setTilaGender = useEconomyStore((s) => s.setTilaGender);
  const mascotName = getMascotName(tilaGender);

  const showMascot = useEconomyStore((s) => s.showMascot);
  const setShowMascot = useEconomyStore((s) => s.setShowMascot);

  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const isUnlimited = isUnlimitedUser(user, isVip, user?.group_id);

  const roleClean = (user?.role || "").toUpperCase();
  const isSuperAdmin =
    roleClean === "SUPER_ADMIN" ||
    roleClean === "SUPERADMIN" ||
    roleClean === "ADMIN";

  const [genderDraft, setGenderDraft] = useState<TilaGender>(tilaGender);

  const earnedStars = useMemo(
    () => Object.values(stars).reduce((sum, value) => sum + (value || 0), 0),
    [stars],
  );

  const earned = useMemo(() => {
    const set = new Set(progress.achievements);
    for (let jilid = 1; jilid <= 5; jilid++) {
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
      setGenderDraft(tilaGender);
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

  const handleSaveName = () => {
    if (nameDraft.trim()) setNameOverride(nameDraft.trim());
    if (genderDraft) {
      setTilaGender(genderDraft);
    }
    setActiveModal(null);
  };

  const settingsItems = [
    {
      key: "password",
      icon: KeyRoundSvg,
      title: "Ganti Kata Sandi",
      subtitle: "Perbarui keamanan akunmu",
      action: () => openModal("password"),
    },
    {
      key: "history",
      icon: ClipboardListSvg,
      title: "Riwayat & Laporan",
      subtitle: "Lihat progress dan capaianmu",
      action: () => navigate("/member/ngaji-ceria/profile/history"),
    },
    {
      key: "feedback",
      icon: SparklesSvg,
      title: "Kritik & Saran",
      subtitle: "Bantu kami jadi lebih baik",
      action: () => openModal("feedback"),
    },
    {
      key: "install",
      icon: DownloadSvg,
      title: "Install Aplikasi",
      subtitle: "Pasang di layar utama",
      action: () => openModal("install"),
    },
  ];

  // Style Constants (Sticker Style)
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
      <div className="min-h-full bg-[#F0FDF4] pb-24">
        {/* Header dengan Ilustrasi Stiker */}
        <header className="rounded-b-[32px] bg-[#134E4A] px-5 pb-16 pt-safe text-white relative overflow-hidden border-b-[3px] border-[#134E4A]">
          {/* LAYER ILUSTRASI */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Ilustrasi Bulan & Bintang (Kanan Atas) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-6 -top-6 h-44 w-44"
            >
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M70 10 A 40 40 0 1 0 90 70 A 30 30 0 1 1 70 10 Z"
                  fill="#FF6B6B"
                  stroke="#F0FDF4"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M80 20 L82 25 L87 27 L82 29 L80 34 L78 29 L73 27 L78 25 Z"
                  fill="#F0FDF4"
                />
                <circle cx="65" cy="15" r="2.5" fill="#F0FDF4" />
                <circle cx="85" cy="40" r="2" fill="#F0FDF4" />
                <circle cx="55" cy="30" r="1.5" fill="#F0FDF4" opacity="0.6" />
              </svg>
            </motion.div>

            {/* Ilustrasi Buku/Pola (Kiri Bawah) */}
            <div className="absolute -left-4 bottom-2 h-28 w-28 opacity-40 rotate-12">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="20"
                  y="20"
                  width="60"
                  height="70"
                  rx="8"
                  fill="#F0FDF4"
                  stroke="#0D9488"
                  strokeWidth="3"
                />
                <rect x="30" y="20" width="10" height="70" fill="#0D9488" />
                <path
                  d="M45 40 L70 40 M45 55 L70 55 M45 70 L60 70"
                  stroke="#134E4A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-[#F0FDF4]/10" />
          </div>

          <div className="pt-6 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF6B6B]">
              Ruang Santri
            </span>
            <h1 className="mt-1 font-display text-2xl font-black">
              Profil Belajarku
            </h1>
            <p className="text-xs font-medium text-white/70 mt-2 max-w-[180px] leading-relaxed">
              Teruslah belajar dan raih bintang sebanyak mungkin!
            </p>
          </div>
        </header>

        <div className="space-y-5 px-4">
          {/* Avatar Card - Satu-satunya tempat edit profil */}
          <section className="-mt-10 relative z-20 rounded-[24px] border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A]">
            <div className="flex items-start gap-3">
              <AvatarWithBadge
                src={user?.photo_url}
                name={displayName}
                size={72}
                shape="circle"
                role={user?.role}
                groupId={user?.group_id}
                gender={normalizeGender(user?.gender)}
                borderClassName="border-[3px] border-[#FF6B6B] bg-white"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-black text-[#134E4A]">
                  {displayName}
                </h2>
                <p className="truncate text-xs font-bold text-[#134E4A]/60 mt-0.5">
                  {email}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-black tracking-wider text-white border-2 border-[#134E4A] ${
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
                    <span className="inline-block rounded-md bg-[#FEF08A] text-[#134E4A] px-1.5 py-0.5 text-[9px] font-black border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                      ∞ UNLIMITED
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => openModal("edit")}
                className="shrink-0 rounded-xl p-2 bg-[#F0FDF4] border-2 border-[#134E4A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <PencilSvg size={18} />
              </button>
            </div>
          </section>

          {/* Statistics Cards */}
          <section className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border-[2px] border-[#134E4A] bg-white p-3 text-center shadow-[2px_2px_0px_#134E4A]">
              <GraduationCapSvg size={26} className="mx-auto" />
              <p className="mt-1 text-[11px] font-black text-[#134E4A]">
                Level
              </p>
              <p className="text-[10px] font-bold text-[#134E4A]/60 tracking-wide">
                Tilawati {currentJilidNumber}
              </p>
            </div>
            <div className="rounded-2xl border-[2px] border-[#134E4A] bg-white p-3 text-center shadow-[2px_2px_0px_#134E4A]">
              <StarSvg size={26} className="mx-auto" />
              <p className="mt-1 text-[11px] font-black text-[#134E4A]">
                Bintang
              </p>
              <p className="text-[10px] font-bold text-[#134E4A]/60 tracking-wide">
                {earnedStars}/{TOTAL_STARS}
              </p>
            </div>
            <div className="rounded-2xl border-[2px] border-[#134E4A] bg-white p-3 text-center shadow-[2px_2px_0px_#134E4A]">
              <CoinsSvg size={26} className="mx-auto" />
              <p className="mt-1 text-[11px] font-black text-[#134E4A]">
                Koin
              </p>
              <p className="text-[10px] font-bold text-[#134E4A]/60 tracking-wide">
                {progress.coins || 0}
              </p>
            </div>
          </section>

          {/* Kuota Energi (Hati & Tiket) */}
          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border-[2px] border-[#134E4A] bg-[#FFF1F2] p-3 flex items-center gap-3 shadow-[2px_2px_0px_#134E4A]">
              <div className="p-2 rounded-xl bg-white border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A] shrink-0">
                <HeartSvg size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase text-[#134E4A]/70">Kuota Hati</p>
                <p className="text-base font-black text-[#134E4A] leading-tight truncate">
                  {isUnlimited ? "∞ (Unlimited)" : `${hearts}/5`}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border-[2px] border-[#134E4A] bg-[#FEF3C7] p-3 flex items-center gap-3 shadow-[2px_2px_0px_#134E4A]">
              <div className="p-2 rounded-xl bg-white border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A] shrink-0">
                <TicketSvg size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase text-[#134E4A]/70">Tiket Game</p>
                <p className="text-base font-black text-[#134E4A] leading-tight truncate">
                  {isUnlimited ? "∞ (Unlimited)" : `${tickets}/3`}
                </p>
              </div>
            </div>
          </section>

          {/* Kamar Maskot - Eye-Catching Card */}
          <section
            onClick={() => navigate("/member/ngaji-ceria/kamar-tila")}
            className="relative overflow-hidden cursor-pointer rounded-[24px] border-[3px] border-[#134E4A] bg-[#FEF08A] p-4 shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all flex items-center justify-between group"
          >
            {/* Dekorasi Latar */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FF6B6B]/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />

            <div className="flex items-center gap-4 z-10">
              <div className="w-16 h-16 rounded-2xl border-[3px] border-[#134E4A] bg-white flex items-center justify-center shadow-[2px_2px_0px_#134E4A] overflow-hidden shrink-0">
                <div className="transform scale-[0.65] translate-y-2">
                  <TilaMascot
                    size={80}
                    gender={tilaGender === "girl" ? "girl" : "boy"}
                    accessory={equippedAccessory as any}
                    animation="bounce"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-display text-lg font-black text-[#134E4A]">
                    Kamar {mascotName}
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#FF6B6B] text-white px-2 py-0.5 rounded-md border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                    Baru!
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#134E4A]/70 max-w-[150px] leading-tight">
                  Kustomisasi {mascotName} & koleksi aksesorismu!
                </p>
              </div>
            </div>

            <div className="z-10 bg-[#0D9488] text-white px-3 py-2 rounded-xl border-[2px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] font-black text-xs animate-bounce group-active:animate-none">
              Masuk
            </div>
          </section>

          {/* Lemari Lencana */}
          <section className="rounded-[24px] border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-black text-[#134E4A]">
                Lemari Lencana
              </h3>
              <span className="text-[9px] font-extrabold tracking-wide text-[#134E4A]/70 bg-[#F0FDF4] px-2 py-1 rounded-md border-2 border-[#134E4A]/20">
                {earned.size}/{Object.keys(ACHIEVEMENT_LABELS).length} Terbuka
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {Object.entries(ACHIEVEMENT_LABELS).map(([id, badge]) => {
                const has = earned.has(id);
                return (
                  <div
                    key={id}
                    className={`snap-start shrink-0 w-[100px] rounded-xl border-[2px] p-2.5 text-center flex flex-col items-center justify-center transition-all ${
                      has
                        ? "border-[#134E4A] bg-[#FFF0F0] shadow-[2px_2px_0px_#134E4A]"
                        : "border-gray-300 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="h-8 flex items-center justify-center mb-1">
                      {has ? (
                        id.startsWith("jilid-") ? (
                          <GraduationCapSvg size={28} />
                        ) : (
                          <MedalSvg size={28} />
                        )
                      ) : (
                        <LockSvg size={22} className="opacity-70" />
                      )}
                    </div>
                    <p className="text-[9px] font-extrabold leading-tight text-[#134E4A] line-clamp-2">
                      {badge.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Settings List */}
          <section className="space-y-3">
            <h3 className="font-display text-[11px] font-black uppercase tracking-widest text-[#134E4A]/60 px-1">
              Pengaturan & Aktivitas
            </h3>

            {/* Toggle Tampilkan Maskot */}
            <div
              onClick={() => setShowMascot(!showMascot)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowMascot(!showMascot);
                }
              }}
              className="flex w-full items-center justify-between rounded-2xl border-[3px] border-[#134E4A] bg-white p-3.5 shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all text-left cursor-pointer select-none"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="rounded-xl bg-[#F0FDF4] p-2 shrink-0 border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  {showMascot ? <EyeSvg size={20} /> : <EyeSlashSvg size={20} />}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-black text-sm text-[#134E4A]">
                    Tampilkan Maskot
                  </span>
                  <span className="block truncate text-[10px] font-bold text-[#134E4A]/60 mt-0.5 tracking-wide">
                    {showMascot
                      ? `${mascotName} aktif menemani belajarmu`
                      : "Maskot disembunyikan dari layar"}
                  </span>
                </div>
              </div>

              {/* Neo-Brutalism Switch */}
              <div
                className={`relative w-12 h-7 rounded-full border-2 border-[#134E4A] p-0.5 transition-colors shadow-[2px_2px_0px_#134E4A] ${
                  showMascot ? "bg-[#0D9488]" : "bg-gray-200"
                }`}
                aria-label="Toggle Tampilkan Maskot"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 border-[#134E4A] transition-transform ${
                    showMascot
                      ? "translate-x-5 bg-[#FEF08A]"
                      : "translate-x-0 bg-white"
                  }`}
                />
              </div>
            </div>

            {settingsItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={item.action}
                  className="flex w-full items-center justify-between rounded-2xl border-[3px] border-[#134E4A] bg-white p-3.5 shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="rounded-xl bg-[#F0FDF4] p-2 shrink-0 border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                      <Icon size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block font-black text-sm text-[#134E4A]">
                        {item.title}
                      </span>
                      <span className="block truncate text-[10px] font-bold text-[#134E4A]/60 mt-0.5 tracking-wide">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                  <ChevronRightSvg size={18} className="shrink-0 opacity-60" />
                </button>
              );
            })}
          </section>

          {/* Danger Zone */}
          <section className="pt-4 space-y-3">
            {user ? (
              <button
                onClick={() => openModal("logout")}
                disabled={loggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-white py-3.5 font-black text-sm text-[#FF6B6B] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-60"
              >
                <LogOutSvg size={20} />
                Keluar dari Akun
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full rounded-2xl bg-[#0D9488] py-3.5 font-black text-sm text-white border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Masuk / Daftar
              </button>
            )}

            <button
              onClick={() => openModal("delete")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#FFF0F0] py-3.5 font-black text-sm text-[#FF6B6B] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <TrashSvg size={20} />
              Hapus Akun Saya
            </button>
          </section>

          <p className="pt-2 pb-6 text-center text-[10px] font-bold text-[#134E4A]/50 tracking-wider">
            Streak {currentStreak} hari • Pangkat {rank.title}
          </p>
        </div>
      </div>

      {/* --- MODALS --- */}
      {activeModal === "edit" && (
        <ModalPanel
          title="Nama & Avatar"
          warm
          onClose={() => setActiveModal(null)}
        >
          <div className="my-4 flex justify-center">
            <AvatarWithBadge
              src={user?.photo_url}
              name={displayName}
              size={88}
              shape="circle"
              role={user?.role}
              groupId={user?.group_id}
              gender={normalizeGender(user?.gender)}
              borderClassName="border-[3px] border-[#FF6B6B] bg-white"
            />
          </div>
          <label
            className="block text-left text-xs font-black text-[#134E4A]"
            htmlFor="profile-name"
          >
            Nama tampilan
          </label>
          <input
            id="profile-name"
            value={nameDraft}
            onChange={(event) => setNameDraft(event.target.value)}
            placeholder="Tulis namamu"
            className={`mt-1.5 ${inputStyle}`}
          />

          <div className="mt-4">
            <label className="block text-left text-xs font-black text-[#134E4A] mb-1.5">
              Pilihan Karakter Maskot
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGenderDraft("boy")}
                className={`py-2 px-2.5 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  genderDraft === "boy"
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-white text-[#134E4A] opacity-70"
                }`}
              >
                <UserSvg size={15} />
                <span>Tito (Laki-laki)</span>
              </button>
              <button
                type="button"
                onClick={() => setGenderDraft("girl")}
                className={`py-2 px-2.5 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  genderDraft === "girl"
                    ? "bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-white text-[#134E4A] opacity-70"
                }`}
              >
                <SparklesSvg size={15} />
                <span>Tila (Perempuan)</span>
              </button>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              className={btnCancelStyle}
              onClick={() => setActiveModal(null)}
            >
              Batal
            </button>
            <button className={btnPrimaryStyle} onClick={handleSaveName}>
              Simpan
            </button>
          </div>
        </ModalPanel>
      )}

      {activeModal === "password" && (
        <ModalPanel
          title="Ganti Kata Sandi"
          warm
          onClose={() => setActiveModal(null)}
        >
          {submitted ? (
            <>
              <p className="my-5 text-sm font-bold text-[#134E4A]/70">
                Kata sandi berhasil diperbarui. Gunakan sandi baru saat masuk
                berikutnya.
              </p>
              <button
                className={`w-full ${btnPrimaryStyle}`}
                onClick={() => setActiveModal(null)}
              >
                Selesai
              </button>
            </>
          ) : (
            <>
              <input
                type="password"
                placeholder="Kata sandi baru"
                className={`mt-4 ${inputStyle}`}
              />
              <input
                type="password"
                placeholder="Ulangi kata sandi baru"
                className={`mt-2 ${inputStyle}`}
              />
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  className={btnCancelStyle}
                  onClick={() => setActiveModal(null)}
                >
                  Batal
                </button>
                <button
                  className={btnPrimaryStyle}
                  onClick={() => setSubmitted(true)}
                >
                  Simpan
                </button>
              </div>
            </>
          )}
        </ModalPanel>
      )}

      {activeModal === "feedback" && (
        <ModalPanel
          title="Kritik & Saran"
          warm
          onClose={() => setActiveModal(null)}
        >
          {submitted ? (
            <>
              <p className="my-5 text-sm font-bold text-[#134E4A]/70">
                Terima kasih! Masukanmu sangat berarti untuk Tartila.
              </p>
              <button
                className={`w-full ${btnPrimaryStyle}`}
                onClick={() => setActiveModal(null)}
              >
                Tutup
              </button>
            </>
          ) : (
            <>
              <textarea
                rows={4}
                placeholder="Tulis kritik atau saranmu..."
                className={`mt-4 resize-none ${inputStyle}`}
              />
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  className={btnCancelStyle}
                  onClick={() => setActiveModal(null)}
                >
                  Batal
                </button>
                <button
                  className={btnPrimaryStyle}
                  onClick={() => setSubmitted(true)}
                >
                  Kirim
                </button>
              </div>
            </>
          )}
        </ModalPanel>
      )}

      {activeModal === "install" && (
        <ModalPanel
          title="Install Aplikasi"
          warm
          onClose={() => setActiveModal(null)}
        >
          <img
            src={NGAJI_CERIA_ASSETS.avatarAnak}
            alt=""
            className="mx-auto my-3 h-20 w-20 object-contain drop-shadow-md"
          />
          <p className="mb-5 text-sm font-bold text-[#134E4A]/70">
            Pasang Tartila di layar utama agar bisa dibuka lebih cepat dan
            belajar tanpa koneksi.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={btnCancelStyle}
              onClick={() => setActiveModal(null)}
            >
              Nanti
            </button>
            <button
              className={`${btnPrimaryStyle} disabled:opacity-50 disabled:active:translate-y-0`}
              disabled={!installPrompt}
              onClick={handleInstall}
            >
              {installPrompt ? "Install" : "Tak tersedia"}
            </button>
          </div>
        </ModalPanel>
      )}

      {activeModal === "logout" && (
        <ModalPanel
          title="Keluar dari akun?"
          warm
          onClose={loggingOut ? undefined : () => setActiveModal(null)}
        >
          <img
            src={NGAJI_CERIA_ASSETS.avatarAnak}
            alt=""
            className="mx-auto my-3 h-20 w-20 object-contain drop-shadow-md"
          />
          <p className="mb-5 text-sm font-bold text-[#134E4A]/70">
            Sesi akunmu akan berakhir. Kamu bisa masuk kembali untuk melanjutkan
            belajar.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={btnCancelStyle}
              disabled={loggingOut}
              onClick={() => setActiveModal(null)}
            >
              Batal
            </button>
            <button
              className={btnDangerStyle}
              disabled={loggingOut}
              onClick={handleLogout}
            >
              {loggingOut ? "Keluar…" : "Ya, Keluar"}
            </button>
          </div>
        </ModalPanel>
      )}

      {activeModal === "delete" && (
        <ModalPanel
          title="Hapus akun?"
          warm
          onClose={loggingOut ? undefined : () => setActiveModal(null)}
        >
          <p className="my-5 text-sm font-bold text-[#134E4A]/70">
            Semua progress belajarmu akan hilang dan tidak bisa dikembalikan.
            Yakin ingin menghapus akun?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={btnCancelStyle}
              disabled={loggingOut}
              onClick={() => setActiveModal(null)}
            >
              Batal
            </button>
            <button
              className={btnDangerStyle}
              disabled={loggingOut}
              onClick={handleLogout}
            >
              {loggingOut ? "Menghapus…" : "Ya, Hapus"}
            </button>
          </div>
        </ModalPanel>
      )}
    </NgajiCeriaLayout>
  );
}
