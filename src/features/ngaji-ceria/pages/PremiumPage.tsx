import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Check,
  Crown,
  Heart,
  Gamepad,
  Star,
  Sparkles,
} from "@/components/ui/CustomIcons";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { callREST } from "@/services/api";
import { useEconomyStore } from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";

type TierType = "monthly" | "yearly" | "lifetime" | "ustadz-monthly";

interface BenefitItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  badge: string;
  accentBg: string;
  badgeBg: string;
}

interface PricingTier {
  id: TierType;
  name: string;
  badgeLabel?: string;
  price: string;
  dailyPrice: string;
  period: string;
  original: string;
  discount: string;
  desc: string;
  subType: "vip" | "premium";
  isUstadzPackage?: boolean;
  isPopular?: boolean;
  isBestValue?: boolean;
  themeColor: "teal" | "amber" | "purple";
  highlights: string[];
}

/* ============================================================================
   DAFTAR BENEFIT BERSIH (Tanpa Duplikasi Item Free vs VIP)
   ============================================================================ */

const BENEFITS_BY_TYPE: Record<"vip" | "premium" | "ustadz", BenefitItem[]> = {
  vip: [
    {
      icon: Heart,
      title: "Hati Tanpa Batas (Unlimited)",
      desc: "Bebas belajar & mengulang materi tanpa takut kehabisan nyawa hati.",
      badge: "UNLIMITED",
      accentBg: "bg-[#CCFBF1]",
      badgeBg: "bg-[#0D9488] text-white",
    },
    {
      icon: Gamepad,
      title: "Kuota 5 Tiket Arena Game",
      desc: "Kapasitas tiket bermain lebih banyak untuk mengasah hafalan.",
      badge: "5 TIKET",
      accentBg: "bg-[#FEF08A]",
      badgeBg: "bg-[#B45309] text-white",
    },
    {
      icon: Sparkles,
      title: "Buat 5 Ruang Kelas Mengaji",
      desc: "Buka ruang belajar bersama teman atau murid dengan mudah.",
      badge: "5 RUANG",
      accentBg: "bg-[#E0F2FE]",
      badgeBg: "bg-[#0284C7] text-white",
    },
    {
      icon: Star,
      title: "Kapasitas 10 Santri / Ruang",
      desc: "Setiap ruang kelas dapat menampung hingga 10 peserta aktif.",
      badge: "10 SANTRI",
      accentBg: "bg-[#F3E8FF]",
      badgeBg: "bg-[#7E22CE] text-white",
    },
  ],
  premium: [
    {
      icon: Crown,
      title: "Koleksi Avatar & Jubah Sultan",
      desc: "Buka seluruh baju adat, mahkota istana, dan bingkai profil eksklusif.",
      badge: "EKSKLUSIF",
      accentBg: "bg-[#FEF08A]",
      badgeBg: "bg-[#D97706] text-white",
    },
    {
      icon: Heart,
      title: "Hati & Tiket Tanpa Batas Selamanya",
      desc: "Akses penuh ke semua petualangan Tilawati & mini-game seumur hidup.",
      badge: "SEUMUR HIDUP",
      accentBg: "bg-[#CCFBF1]",
      badgeBg: "bg-[#0D9488] text-white",
    },
    {
      icon: Sparkles,
      title: "Ruang Kelas Tanpa Batas (Unlimited)",
      desc: "Bebas membuat berapa pun ruang halaqah dan kelas belajar.",
      badge: "TAK TERBATAS",
      accentBg: "bg-[#FCE7F3]",
      badgeBg: "bg-[#DB2777] text-white",
    },
    {
      icon: Star,
      title: "Kapasitas Besar 50 Santri / Ruang",
      desc: "Ruang kelas akbar dengan pembuat soal Quiz & Tilawati kustom.",
      badge: "50 SANTRI + KUSTOM",
      accentBg: "bg-[#FEF3C7]",
      badgeBg: "bg-[#78350F] text-[#FEF08A]",
    },
  ],
  ustadz: [
    {
      icon: Sparkles,
      title: "Unlimited Ruang Kelas TPQ",
      desc: "Kelola banyak kelompok jilid sekaligus tanpa batas jumlah ruang.",
      badge: "KHUSUS PENGAJAR",
      accentBg: "bg-[#CCFBF1]",
      badgeBg: "bg-[#0D9488] text-white",
    },
    {
      icon: Crown,
      title: "Pembuat Soal Quiz & Tilawati Kustom",
      desc: "Susun materi evaluasi harian menggunakan template game interaktif.",
      badge: "CUSTOM QUIZ",
      accentBg: "bg-[#FEF08A]",
      badgeBg: "bg-[#B45309] text-white",
    },
    {
      icon: Star,
      title: "10 Santri per Ruang & Pantau Skor",
      desc: "Ideal untuk halaqah intensif dengan laporan bintang santri.",
      badge: "10 SANTRI / KELAS",
      accentBg: "bg-[#E0F2FE]",
      badgeBg: "bg-[#0284C7] text-white",
    },
    {
      icon: Heart,
      title: "Hati & Tiket Bermain Unlimited",
      desc: "Simulasikan semua game dan materi di depan kelas tanpa batas.",
      badge: "FULL AKSES",
      accentBg: "bg-[#F3E8FF]",
      badgeBg: "bg-[#7E22CE] text-white",
    },
  ],
};

const COMPARISON_ROWS = [
  {
    label: "Energi Hati Bermain",
    free: "5 Hati / 4 Jam",
    vip: "Tanpa Batas ∞",
    premium: "Tanpa Batas ∞",
  },
  {
    label: "Kuota Tiket Mini-Game",
    free: "3 Tiket / 6 Jam",
    vip: "5 Tiket Cepat",
    premium: "Tanpa Batas ∞",
  },
  {
    label: "Jumlah Ruang Kelas",
    free: "—",
    vip: "5 Ruang",
    premium: "Tanpa Batas ∞",
  },
  {
    label: "Kapasitas per Ruang",
    free: "—",
    vip: "10 Peserta",
    premium: "50 Peserta",
  },
  {
    label: "Soal Quiz & Tilawati Kustom",
    free: "—",
    vip: "—",
    premium: "Tersedia",
  },
  {
    label: "Kostum & Mahkota Istana",
    free: "—",
    vip: "—",
    premium: "Terbuka Semua",
  },
];

const TIERS: PricingTier[] = [
  {
    id: "monthly",
    name: "VIP Bulanan",
    badgeLabel: "Coba Dulu",
    price: "Rp 15.000",
    dailyPrice: "Cuma Rp 500 / hari",
    period: "/bulan",
    original: "Rp 25.000",
    discount: "HEMAT 40%",
    desc: "Aktifkan akses VIP penuh selama 30 hari.",
    subType: "vip",
    themeColor: "teal",
    highlights: [
      "Hati Tanpa Batas",
      "5 Tiket Game",
      "5 Ruang Kelas (10 Murid)",
    ],
  },
  {
    id: "yearly",
    name: "VIP Tahunan",
    badgeLabel: "Paling Populer",
    price: "Rp 120.000",
    dailyPrice: "Cuma Rp 328 / hari",
    period: "/tahun",
    original: "Rp 300.000",
    discount: "HEMAT 60%",
    desc: "Belajar tenang setahun penuh, jauh lebih hemat!",
    subType: "vip",
    isPopular: true,
    themeColor: "teal",
    highlights: [
      "Semua Fitur VIP 12 Bulan",
      "Hemat Rp 180.000",
      "5 Ruang Kelas (10 Murid)",
    ],
  },
  {
    id: "lifetime",
    name: "Sultan Seumur Hidup",
    badgeLabel: "Nilai Terbaik",
    price: "Rp 250.000",
    dailyPrice: "Sekali bayar untuk selamanya",
    period: "/selamanya",
    original: "Rp 500.000",
    discount: "DISKON 50%",
    desc: "Buka seluruh fitur Premium, Avatar Istana & 50 Murid/Ruang selamanya.",
    subType: "premium",
    isBestValue: true,
    themeColor: "amber",
    highlights: [
      "Akses Selamanya Tanpa Iuran",
      "Avatar Istana & Kostum Sultan",
      "Ruang Unlimited (50 Murid)",
      "Buat Soal Quiz Kustom",
    ],
  },
  {
    id: "ustadz-monthly",
    name: "Paket Ustadz / Pengajar",
    badgeLabel: "Khusus Pengajar",
    price: "Rp 20.000",
    dailyPrice: "Rp 660 / hari untuk mengajar",
    period: "/bulan",
    original: "Rp 30.000",
    discount: "HEMAT 33%",
    desc: "Fasilitas lengkap untuk Ustadz/Ustadzah mengelola kelas mengaji.",
    subType: "vip",
    isUstadzPackage: true,
    themeColor: "purple",
    highlights: [
      "Unlimited Ruang Kelas",
      "10 Santri per Ruang",
      "Soal Quiz & Tilawati Kustom",
      "Hati & Tiket Unlimited",
    ],
  },
];

/* ============================================================================
   ILUSTRASI VEKTOR MAHKOTA & PERMATA SULTAN (NEO-BRUTALISM SVG)
   ============================================================================ */
const RoyalCrownChestSvg = () => (
  <motion.svg
    viewBox="0 0 140 130"
    fill="none"
    className="h-28 w-28 sm:h-32 sm:w-32 overflow-visible drop-shadow-[4px_4px_0px_#042F2E]"
    animate={{ y: [0, -5, 0], rotate: [-1.5, 1.5, -1.5] }}
    transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
  >
    {/* Cahaya Lingkar Belakang */}
    <circle cx="70" cy="68" r="50" fill="#FEF08A" opacity="0.22" />
    {/* Bintang 4 Sudut Kiri */}
    <path
      d="M18 32L21 39L28 42L21 45L18 52L15 45L8 42L15 39Z"
      fill="#FEF08A"
      stroke="#042F2E"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Bintang 4 Sudut Kanan */}
    <path
      d="M122 24L124.5 29.5L130 32L124.5 34.5L122 40L119.5 34.5L114 32L119.5 29.5Z"
      fill="#34D399"
      stroke="#042F2E"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />

    {/* Bantal Beludru Merah Istana */}
    <rect
      x="24"
      y="78"
      width="92"
      height="26"
      rx="13"
      fill="#FF6B6B"
      stroke="#042F2E"
      strokeWidth="3.5"
    />
    <path
      d="M36 91H104"
      stroke="#FEF08A"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="6 6"
    />

    {/* Badan Mahkota Emas */}
    <path
      d="M30 82L22 42L50 58L70 28L90 58L118 42L110 82H30Z"
      fill="#FBBF24"
      stroke="#042F2E"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Sabuk Dasar Mahkota */}
    <rect
      x="28"
      y="74"
      width="84"
      height="12"
      rx="5"
      fill="#F59E0B"
      stroke="#042F2E"
      strokeWidth="3.5"
    />

    {/* Permata Zamrud & Ruby pada Mahkota */}
    <circle
      cx="70"
      cy="61"
      r="7"
      fill="#10B981"
      stroke="#042F2E"
      strokeWidth="2.5"
    />
    <circle
      cx="46"
      cy="65"
      r="5"
      fill="#FF6B6B"
      stroke="#042F2E"
      strokeWidth="2.5"
    />
    <circle
      cx="94"
      cy="65"
      r="5"
      fill="#FF6B6B"
      stroke="#042F2E"
      strokeWidth="2.5"
    />

    {/* Mutiara Puncak Mahkota */}
    <circle
      cx="22"
      cy="39"
      r="5"
      fill="#FEF08A"
      stroke="#042F2E"
      strokeWidth="2.5"
    />
    <circle
      cx="70"
      cy="24"
      r="6.5"
      fill="#FEF08A"
      stroke="#042F2E"
      strokeWidth="2.5"
    />
    <circle
      cx="118"
      cy="39"
      r="5"
      fill="#FEF08A"
      stroke="#042F2E"
      strokeWidth="2.5"
    />
  </motion.svg>
);

export default function PremiumPage() {
  const navigate = useNavigate();
  const { isUstadz } = useAuth();
  const currentSubscription = useEconomyStore((s) => s.subscriptionType);

  // Default pilih paket ustadz jika akun adalah ustadz, atau yearly jika santri
  const [selectedTierId, setSelectedTierId] = useState<TierType>(
    isUstadz ? "ustadz-monthly" : "yearly",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAllPackages, setShowAllPackages] = useState(false);

  // Menyusun daftar paket yang relevan tanpa nilai undefined
  const displayedTiers = useMemo(() => {
    if (showAllPackages) return TIERS;
    if (isUstadz) {
      // Tampilkan paket ustadz di urutan pertama + opsi Sultan Seumur Hidup
      return TIERS.filter(
        (t) =>
          t.id === "ustadz-monthly" || t.id === "lifetime" || t.id === "yearly",
      );
    }
    // Untuk santri reguler, tampilkan Bulanan, Tahunan, dan Seumur Hidup
    return TIERS.filter((t) => !t.isUstadzPackage);
  }, [isUstadz, showAllPackages]);

  const selectedTier = useMemo(
    () => TIERS.find((t) => t.id === selectedTierId) || TIERS[1],
    [selectedTierId],
  );

  // Daftar benefit dinamis mengikuti paket yang sedang diklik
  const activeBenefits = useMemo(() => {
    if (selectedTier.id === "ustadz-monthly") return BENEFITS_BY_TYPE.ustadz;
    if (selectedTier.subType === "premium") return BENEFITS_BY_TYPE.premium;
    return BENEFITS_BY_TYPE.vip;
  }, [selectedTier]);

  // Handler pembelian langganan VIP. Mengarahkan user ke DOKU Checkout.
  // Logic verifikasi & secret DOKU TIDAK ada di frontend (aturan kaku).
  const handleSubscribe = async (tierId: TierType) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { userId } = useEconomyStore.getState();

      if (!userId) {
        throw new Error("Belum login. Silakan login terlebih dahulu.");
      }

      const res = await callREST<{
        success: boolean;
        data: { paymentUrl: string; invoiceNumber: string };
      }>("POST", "/api/v1/payment/doku/create", {
        userId,
        planId: tierId,
      });

      if (!res.success || !res.data.paymentUrl) {
        throw new Error("Gagal memulai pembayaran");
      }

      // Arahkan user ke halaman DOKU Checkout
      window.location.href = res.data.paymentUrl;
    } catch (err: any) {
      setIsProcessing(false);
      const message =
        err instanceof Error ? err.message : "Gagal memproses langganan VIP";
      // TODO: ganti dengan toast komponen UI yang sudah ada (mis. sonner/useToast)
      console.error("[PremiumPage] subscribe error:", err);
      alert(message);
    }
  };

  // Fungsi upgrade subscription (dipakai oleh komponen lain / test)
  const upgradeSubscription = async (tierId: TierType) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { setSubscription } = useEconomyStore.getState();

      const subscriptionMap: Record<TierType, "free" | "vip" | "premium"> = {
        monthly: "vip",
        yearly: "vip",
        lifetime: "premium",
        "ustadz-monthly": "vip",
      };

      const subType = subscriptionMap[tierId];
      if (subType) {
        await setSubscription(subType);
        navigate("/");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#FFFBEB] pb-40 select-none overflow-x-hidden">
      {/* Latar Belakang Polkadot Halus Khas Tartila */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(#D97706 1.25px, transparent 1.25px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ============================================================
          1. TOP HEADER BAR
         ============================================================ */}
      <header className="sticky top-0 z-40 border-b-[3.5px] border-[#134E4A] bg-[#0D9488] px-4 py-3 shadow-[0_4px_0px_#134E4A]">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-[2.5px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A] transition-transform active:translate-y-0.5 cursor-pointer"
            aria-label="Kembali"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <Crown size={20} className="text-[#FEF08A]" />
            <h1 className="font-display text-base sm:text-lg font-black uppercase tracking-wider text-white drop-shadow-[0_2px_0px_#134E4A]">
              Tartila Pass & VIP
            </h1>
          </div>

          {/* Status Akun Saat Ini */}
          <span className="rounded-xl border-2 border-[#134E4A] bg-[#042F2E] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#FEF08A] shadow-[2px_2px_0px_#134E4A]">
            {currentSubscription
              ? `Status: ${currentSubscription}`
              : "Akun Gratis"}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-5 space-y-6">
        {/* ============================================================
            2. HERO BANNER: MAHKOTA SULTAN NGAJI
           ============================================================ */}
        <section className="relative overflow-hidden rounded-[28px] border-[3.5px] border-[#134E4A] bg-gradient-to-br from-[#0F766E] via-[#115E59] to-[#134E4A] p-5 sm:p-6 text-white shadow-[0_6px_0px_#042F2E]">
          {/* Pendar Cahaya Emas di Sudut Kanan */}
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-60 w-60 rounded-full opacity-35"
            style={{
              background:
                "radial-gradient(circle, #FEF08A 0%, #F59E0B 45%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center sm:text-left">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border-2 border-[#FEF08A] bg-[#042F2E] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FEF08A] shadow-[2px_2px_0px_#042F2E]">
                <Sparkles size={12} /> Belajar Tanpa Batas
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-black leading-tight text-white drop-shadow-[0_2px_0px_#042F2E]">
                Jadi Santri Sultan,{" "}
                <span className="text-[#FEF08A]">Ngaji Makin Seru!</span>
              </h2>

              <p className="mt-1.5 text-xs sm:text-sm font-semibold text-teal-100 leading-relaxed max-w-md mx-auto sm:mx-0">
                Buka energi hati tanpa batas, buat ruang kelas bersama teman,
                dan koleksi jubah eksklusif istana setiap hari!
              </p>

              {/* Pill Keunggulan Cepat */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#042F2E] bg-[#FEF08A] px-2.5 py-1 text-[10px] font-black text-[#134E4A] shadow-[2px_2px_0px_#042F2E]">
                  <Heart size={12} fill="#EF4444" stroke="#042F2E" /> Hati Unlimited
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#042F2E] bg-[#34D399] px-2.5 py-1 text-[10px] font-black text-[#064E3B] shadow-[2px_2px_0px_#042F2E]">
                  <Gamepad size={12} stroke="#064E3B" /> Ruang Kelas
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#042F2E] bg-[#FF6B6B] px-2.5 py-1 text-[10px] font-black text-white shadow-[2px_2px_0px_#042F2E]">
                  <Crown size={12} stroke="#FFFFFF" /> Kostum Sultan
                </span>
              </div>
            </div>

            {/* Ilustrasi Mahkota & Maskot */}
            <div className="relative flex shrink-0 items-center justify-center">
              <RoyalCrownChestSvg />
              <div className="hidden xs:block -ml-4 mt-6">
                <TilaMascot size="sm" mood="happy" />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            3. PILIHAN PAKET LANGGANAN (INTERACTIVE PRICING CARDS)
           ============================================================ */}
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h3 className="font-display text-base sm:text-lg font-black text-[#134E4A]">
                1. Pilih Paket Langganan
              </h3>
              <p className="text-xs font-bold text-[#134E4A]/70">
                Ketuk salah satu paket untuk melihat fasilitasnya
              </p>
            </div>

            {/* Tombol Lihat Paket Pengajar / Semua Paket */}
            <button
              type="button"
              onClick={() => {
                setShowAllPackages((prev) => !prev);
                if (!showAllPackages && !isUstadz) {
                  setSelectedTierId("ustadz-monthly");
                }
              }}
              className="rounded-xl border-2 border-[#134E4A] bg-white px-3 py-1.5 text-[11px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#FEF08A] transition-colors cursor-pointer"
            >
              {showAllPackages
                ? "Sembunyikan Paket Lain"
                : isUstadz
                  ? "Lihat Semua Paket Santri"
                  : "Anda Ustadz/Pengajar? Klik di Sini"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {displayedTiers.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              const isAmber = tier.themeColor === "amber";
              const isPurple = tier.themeColor === "purple";

              return (
                <motion.div
                  key={tier.id}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`relative flex flex-col justify-between rounded-3xl border-[3.5px] p-4 transition-all cursor-pointer ${
                    isSelected
                      ? isAmber
                        ? "border-[#78350F] bg-[#FEF08A] shadow-[0_6px_0px_#78350F] -translate-y-1"
                        : isPurple
                          ? "border-[#4C1D95] bg-[#F3E8FF] shadow-[0_6px_0px_#4C1D95] -translate-y-1"
                          : "border-[#134E4A] bg-[#CCFBF1] shadow-[0_6px_0px_#134E4A] -translate-y-1"
                      : "border-[#134E4A]/60 bg-white hover:border-[#134E4A] shadow-[0_4px_0px_#CBD5E1]"
                  }`}
                >
                  {/* Ribbon Badge Atas (Populer / Nilai Terbaik) */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span
                      className={`inline-block rounded-lg border-2 border-[#134E4A] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_#134E4A] ${
                        tier.isBestValue
                          ? "bg-[#F59E0B] text-[#451A03]"
                          : tier.isPopular
                            ? "bg-[#0D9488] text-white"
                            : isPurple
                              ? "bg-[#7E22CE] text-white"
                              : "bg-[#F1F5F9] text-[#134E4A]"
                      }`}
                    >
                      {tier.badgeLabel}
                    </span>

                    {/* Diskon Pill */}
                    <span className="rounded-md border border-[#134E4A] bg-[#FF6B6B] px-2 py-0.5 text-[10px] font-black text-white">
                      {tier.discount}
                    </span>
                  </div>

                  {/* Nama Paket & Harga */}
                  <div className="my-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-base sm:text-lg font-black text-[#134E4A] leading-tight">
                        {tier.name}
                      </h4>

                      {/* Radio Indikator Terpilih */}
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#134E4A] transition-colors ${
                          isSelected
                            ? "bg-[#10B981] text-white"
                            : "bg-gray-100 text-transparent"
                        }`}
                      >
                        <Check size={14} />
                      </div>
                    </div>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-2xl sm:text-3xl font-black text-[#134E4A]">
                        {tier.price}
                      </span>
                      <span className="text-xs font-extrabold text-[#134E4A]/75">
                        {tier.period}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 line-through">
                        {tier.original}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#0F766E]">
                        • {tier.dailyPrice}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-[#134E4A]/85 leading-snug">
                      {tier.desc}
                    </p>
                  </div>

                  {/* Ringkasan Poin Fitur di dalam Kartu */}
                  <ul className="mt-3 space-y-1.5 border-t-2 border-dashed border-[#134E4A]/20 pt-3">
                    {tier.highlights.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#134E4A]"
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white border border-[#134E4A]">
                          <Check size={10} />
                        </span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            4. DETAIL KEUNTUNGAN PAKET TERPILIH (REACTIVE BENEFITS GRID)
           ============================================================ */}
        <section className="rounded-3xl border-[3.5px] border-[#134E4A] bg-white p-5 shadow-[0_5px_0px_#134E4A]">
          <div className="mb-4 flex items-center justify-between gap-2 border-b-2 border-dashed border-[#134E4A]/20 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0D9488]">
                Fasilitas Aktif
              </span>
              <h3 className="font-display text-base sm:text-lg font-black text-[#134E4A]">
                Keuntungan {selectedTier.name}
              </h3>
            </div>
            <span className="rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] inline-flex items-center gap-1.5">
              {selectedTier.subType === "premium" ? (
                <>
                  <Crown size={14} stroke="#134E4A" />
                  <span>SULTAN PASS</span>
                </>
              ) : (
                <>
                  <Star size={14} fill="#FDE047" stroke="#134E4A" />
                  <span>VIP PASS</span>
                </>
              )}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTier.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {activeBenefits.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3.5 rounded-2xl border-[2.5px] border-[#134E4A] p-3.5 shadow-[3px_3px_0px_#134E4A] ${item.accentBg}`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                      <IconComponent size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-block rounded-md border border-[#134E4A] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider mb-1 ${item.badgeBg}`}
                      >
                        {item.badge}
                      </span>
                      <h4 className="font-display text-sm font-black text-[#134E4A] leading-tight">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 text-xs font-semibold text-[#134E4A]/80 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ============================================================
            5. TABEL PERBANDINGAN JELAS (GRATIS VS VIP VS SULTAN)
           ============================================================ */}
        <section className="overflow-hidden rounded-3xl border-[3.5px] border-[#134E4A] bg-white shadow-[0_5px_0px_#134E4A]">
          <div className="bg-[#134E4A] px-4 py-3 text-white">
            <h3 className="font-display text-sm sm:text-base font-black uppercase tracking-wider">
              Perbandingan Lengkap Fitur
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#134E4A] bg-[#F8FAFC] text-[11px] font-black uppercase text-[#134E4A]">
                  <th className="py-3 px-3.5">Fitur Utama</th>
                  <th className="py-3 px-2.5 text-center text-gray-500">
                    Gratis
                  </th>
                  <th className="py-3 px-2.5 text-center bg-[#CCFBF1]/60 text-[#0F766E]">
                    VIP
                  </th>
                  <th className="py-3 px-2.5 text-center bg-[#FEF08A]/70 text-[#78350F]">
                    <span className="inline-flex items-center justify-center gap-1">
                      <Crown size={12} stroke="#78350F" />
                      <span>Sultan</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#134E4A]/15 text-xs font-bold">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className="hover:bg-amber-50/40">
                    <td className="py-2.5 px-3.5 font-extrabold text-[#134E4A]">
                      {row.label}
                    </td>
                    <td className="py-2.5 px-2.5 text-center text-gray-500">
                      {row.free}
                    </td>
                    <td className="py-2.5 px-2.5 text-center bg-[#CCFBF1]/30 font-black text-[#0F766E]">
                      {row.vip}
                    </td>
                    <td className="py-2.5 px-2.5 text-center bg-[#FEF08A]/35 font-black text-[#78350F]">
                      {row.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ============================================================
          6. STICKY BOTTOM CHECKOUT BAR (NEO-BRUTALIST ACTION DOCK)
         ============================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t-[3.5px] border-[#134E4A] bg-[#FFFDF0]/95 px-4 py-3 backdrop-blur-xs shadow-[0_-4px_0px_rgba(19,78,74,0.15)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0D9488]">
                Paket Terpilih:
              </span>
              <span className="rounded-md bg-[#FEF08A] border border-[#134E4A] px-1.5 py-0.2 text-[10px] font-black text-[#134E4A]">
                {selectedTier.discount}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="font-display text-base sm:text-xl font-black text-[#134E4A] truncate">
                {selectedTier.name}
              </span>
              <span className="font-display text-sm sm:text-base font-black text-[#0D9488]">
                ({selectedTier.price})
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleSubscribe(selectedTier.id)}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#10B981] hover:bg-[#059669] active:translate-y-0.5 px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-[0_4px_0px_#134E4A] transition-all cursor-pointer disabled:opacity-60"
          >
            <Crown size={18} className="text-[#FEF08A]" />
            <span>
              {isProcessing ? "Memproses..." : `Aktifkan ${selectedTier.name}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
