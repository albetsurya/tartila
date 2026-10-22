import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Check,
  Crown,
  Heart,
  Gamepad,
  Star,
  Sparkles,
} from "@/components/ui/CustomIcons";
import { StickerButton, StickerCard } from "@/components/ui";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { useEconomyStore } from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";

type TierType = "monthly" | "yearly" | "lifetime" | "ustadz-monthly";

const BENEFITS_FREE = [
  {
    icon: Heart,
    title: "Hati 5 Units",
    desc: "Hati ulang setiap 4 jam",
    color: "text-[#6B7280]",
    bg: "bg-[#F3F4F6]",
  },
  {
    icon: Gamepad,
    title: "Tiket 3 Units",
    desc: "Tiket ulang setiap 6 jam",
    color: "text-[#6B7280]",
    bg: "bg-[#F3F4F6]",
  },
];

const BENEFITS_VIP = [
  ...BENEFITS_FREE,
  {
    icon: Heart,
    title: "Hati Tanpa Batas (VIP)",
    desc: "Hati tak habis untuk bermain",
    color: "text-[#0D9488]",
    bg: "bg-[#F0FDF4]",
  },
  {
    icon: Gamepad,
    title: "Tiket 5 Units",
    desc: "Tiket lebih untuk main game",
    color: "text-[#0D9488]",
    bg: "bg-[#F0FDF4]",
  },
  {
    icon: Sparkles,
    title: "Buat 5 Ruang Kelas",
    desc: "Membuat ruang belajar untuk murid",
    color: "text-[#0D9488]",
    bg: "bg-[#ECFDF3]",
  },
  {
    icon: Star,
    title: "10 Peserta per Ruang",
    desc: "Ruang bisa dipenuhi 10 murid",
    color: "text-[#0D9488]",
    bg: "bg-[#ECFDF3]",
  },
];

const BENEFITS_PREMIUM = [
  ...BENEFITS_VIP,
  {
    icon: Crown,
    title: "Avatar Eksklusif Premium",
    desc: "Buka baju dan aksesoris istana",
    color: "text-[#F59E0B]",
    bg: "bg-[#FEF3C7]",
  },
  {
    icon: Sparkles,
    title: "Ruang Tak Terbatas",
    desc: "Ruangan tidak terbatas jumlah",
    color: "text-[#F59E0B]",
    bg: "bg-[#FEF3C7]",
  },
  {
    icon: Star,
    title: "50 Peserta per Ruang",
    desc: "Ruang kelas besar untuk jamuan",
    color: "text-[#F59E0B]",
    bg: "bg-[#FEF3C7]",
  },
  {
    icon: Sparkles,
    title: "Soal Quiz & Tilawati Kustom",
    desc: "Buat soal dengan template game ada",
    color: "text-[#F59E0B]",
    bg: "bg-[#FEF3C7]",
  },
];

const TIERS = [
  {
    id: "monthly" as TierType,
    name: "Paket Bulanan",
    price: "Rp 15.000",
    period: "/bulan",
    original: "Rp 25.000",
    discount: "-40%",
    desc: "Aktifkan akun VIP selama 30 hari",
    isUstadzBenefit: true, // Fitur khusus ustadz
  },
  {
    id: "yearly" as TierType,
    name: "Paket Tahunan",
    price: "Rp 120.000",
    period: "/tahun",
    original: "Rp 300.000",
    discount: "-60%",
    desc: "Hemat besar untuk belajar setahun penuh",
    isUstadzBenefit: true,
  },
  {
    id: "lifetime" as TierType,
    name: "Seumur Hidup",
    price: "Rp 250.000",
    period: "/selamanya",
    original: "Rp 500.000",
    discount: "-50%",
    desc: "Bayar sekali, akses selamanya",
    isUstadzBenefit: true,
  },
  // Package khusus ustadz
  {
    id: "ustadz-monthly" as TierType,
    name: "Paket Ustadz Bulanan",
    price: "Rp 20.000",
    period: "/bulan",
    original: "Rp 30.000",
    discount: "-33%",
    desc: "Paket lengkap untuk ustadz/ustadzah",
    isUstadzBenefit: true,
    features: [
      "Unlimited ruang kelas",
      "10 peserta per ruang",
      "Soal quiz & tilawati kustom",
      "Hati & tiket unlimited",
    ],
  },
];

export default function PremiumPage() {
  const navigate = useNavigate();

  const { isUstadz } = useAuth();

  const TIERS_FOR_USER = isUstadz
    ? [
        TIERS.find((t) => t.id === "ustadz-monthly"),
        ...TIERS.filter((t) => t.id !== "ustadz-monthly" && !t.isUstadzBenefit),
      ]
    : TIERS;

  // Fungsi upgrade subscription
  const upgradeSubscription = async (tierId: string) => {
  // Integrasi dengan useEconomyStore untuk set subscription
  const { setSubscription } = useEconomyStore.getState();
  
  // Mapping tier ke subscription type
  const subscriptionMap: Record<string, "free" | "vip" | "premium"> = {
    monthly: "vip",
    yearly: "vip",
    lifetime: "premium",
    "ustadz-monthly": "vip", // Ustadz monthly jadi vip
  };
  
    const subType = subscriptionMap[tierId];
    if (subType) {
      await setSubscription(subType);
      navigate("/");
    }
  };

  return null; // Placeholder - akan diganti UI lengkap
}
