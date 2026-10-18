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
} from "@/components/ui/FontAwesomeIcons";
import { StickerButton, StickerCard } from "@/components/ui";
import { BibiMascot } from "@/components/ui/BibiMascot";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { useEconomyStore } from "../hooks/useEconomyStore";

type TierType = "monthly" | "yearly" | "lifetime";

const BENEFITS = [
  {
    icon: Heart,
    title: "Hati Tanpa Batas",
    desc: "Belajar sepuasnya tanpa takut kehabisan energi.",
    color: "text-[#FF6B6B]",
    bg: "bg-[#FFF0F0]",
  },
  {
    icon: Gamepad,
    title: "Tiket Bermain ∞",
    desc: "Mainkan semua mini games kapan saja.",
    color: "text-[#0D9488]",
    bg: "bg-[#F0FDF4]",
  },
  {
    icon: Crown,
    title: "Avatar Eksklusif",
    desc: "Buka baju dan aksesoris khusus Santri Bintang.",
    color: "text-[#F59E0B]",
    bg: "bg-[#FEF3C7]",
  },
  {
    icon: Star,
    title: "Akses Semua Game",
    desc: "Tidak ada game yang terkunci untukmu.",
    color: "text-[#8B5CF6]",
    bg: "bg-[#F3E8FF]",
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
    desc: "Akses VIP aktif selama 30 hari.",
  },
  {
    id: "yearly" as TierType,
    name: "Paket Tahunan",
    price: "Rp 120.000",
    period: "/tahun",
    original: "Rp 300.000",
    discount: "-60%",
    desc: "Hemat besar untuk belajar setahun penuh.",
    isBest: true,
  },
  {
    id: "lifetime" as TierType,
    name: "Seumur Hidup",
    price: "Rp 250.000",
    period: "/selamanya",
    original: "Rp 500.000",
    discount: "-50%",
    desc: "Bayar sekali, akses selamanya.",
    isBest: false,
  },
];

export default function PremiumPage() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<TierType>("yearly");
  const [isLoading, setIsLoading] = useState(false);
  const isVip = useEconomyStore((s) => s.isVip);
  const activateVip = useEconomyStore((s) => s.activateVip);

  const handleSubscribe = () => {
    if (isVip) {
      navigate("/member/ngaji-ceria");
      return;
    }
    setIsLoading(true);
    // Simulasi proses pembayaran (Di aplikasi nyata, buka payment gateway / Parental Gate)
    setTimeout(() => {
      activateVip();
      setIsLoading(false);
      alert(
        `Berhasil berlangganan ${selectedTier.toUpperCase()}! Selamat datang, Santri Bintang! 👑`,
      );
      navigate("/member/ngaji-ceria");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] relative overflow-hidden flex flex-col">
      {/* HEADER MANUAL (INDEPENDEN) */}
      <div className="sticky top-0 z-50 bg-[#F0FDF4]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b-[3px] border-[#134E4A]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <ChevronLeft size={20} className="text-[#134E4A]" />
        </button>
        <h1 className="font-display font-black text-[#134E4A] text-lg">
          Paspor Petualang
        </h1>
        <div className="w-10" />{" "}
        {/* Spacer untuk menyeimbangkan judul di tengah */}
      </div>

      {/* KONTEN SCROLLABLE */}
      {/* pb-28 ditambahkan di sini agar item terakhir tidak tertutup tombol pembayaran */}
      <div className="px-4 pt-6 pb-28 space-y-6 flex-1 overflow-y-auto">
        {/* HERO MASKOT */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative mb-4"
          >
            <div className="absolute -top-6 -right-6 rotate-12">
              <img
                src={NGAJI_CERIA_ASSETS.mahkotaVip}
                alt="Crown"
                className="w-16 h-16 drop-shadow-md"
              />
            </div>
            <BibiMascot
              size={140}
              mood="excited"
              direction="front"
              animation="float"
            />
          </motion.div>
          <h2 className="font-display text-3xl font-black text-[#134E4A] leading-tight mb-2">
            Jadi <span className="text-[#FF6B6B]">Santri Bintang!</span>
          </h2>
          <p className="text-sm font-bold text-[#134E4A]/70 max-w-[280px]">
            Buka semua petualangan, main sepuasnya, dan belajar tanpa batas
            bersama Fatih & Aisyah.
          </p>
        </div>

        {/* BENEFIT GRID */}
        <div className="grid grid-cols-2 gap-3">
          {BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <StickerCard
                key={idx}
                className="p-3 flex flex-col items-center text-center gap-1.5 bg-white"
              >
                <div
                  className={`w-10 h-10 rounded-full ${benefit.bg} flex items-center justify-center border-[2px] border-[#134E4A]`}
                >
                  <Icon size={18} className={benefit.color} />
                </div>
                <h3 className="text-[11px] font-black text-[#134E4A] leading-tight mt-1">
                  {benefit.title}
                </h3>
                <p className="text-[9px] font-bold text-[#134E4A]/60 leading-tight">
                  {benefit.desc}
                </p>
              </StickerCard>
            );
          })}
        </div>

        {/* PRICING TIERS (TICKET STYLE) */}
        <div className="space-y-3 pt-2">
          <h3 className="font-display text-lg font-black text-[#134E4A]">
            Pilih Paketmu
          </h3>

          {TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <motion.div
                key={tier.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative flex items-center gap-3 rounded-2xl border-[3px] border-dashed p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#FEF3C7] border-[#134E4A] shadow-[4px_4px_0px_#134E4A]"
                    : "bg-white border-[#134E4A]/30 shadow-[2px_2px_0px_#134E4A]/20 opacity-80"
                }`}
              >
                {/* Ornamen Tiket (Lubang di kiri dan kanan) */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F0FDF4] rounded-full border-[3px] border-[#134E4A]/30 z-10" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F0FDF4] rounded-full border-[3px] border-[#134E4A]/30 z-10" />

                <div
                  className={`w-6 h-6 shrink-0 rounded-full border-[2px] flex items-center justify-center ${isSelected ? "border-[#134E4A] bg-[#0D9488]" : "border-[#134E4A]/30 bg-transparent"}`}
                >
                  {isSelected && <Check size={14} className="text-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-[#134E4A]">
                      {tier.name}
                    </h4>
                    {tier.isBest && (
                      <span className="bg-[#FF6B6B] text-white text-[8px] font-black px-2 py-0.5 rounded-full border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                        TERBAIK
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-[#134E4A]/60 line-clamp-1">
                    {tier.desc}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-[#134E4A]/40 line-through">
                    {tier.original}
                  </p>
                  <p className="text-sm font-black text-[#FF6B6B]">
                    {tier.price}
                    <span className="text-[10px] text-[#134E4A]/60">
                      {tier.period}
                    </span>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ACTION BAR (FLOATING) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t-[3px] border-[#134E4A] z-50">
        <StickerButton
          variant={isVip ? "secondary" : "primary"}
          size="lg"
          fullWidth
          loading={isLoading}
          onClick={handleSubscribe}
          className="shadow-[4px_4px_0px_#134E4A]"
        >
          {isVip ? (
            <>
              <Crown size={18} /> Kamu Sudah VIP!
            </>
          ) : isLoading ? (
            "Memproses..."
          ) : (
            "Lanjut ke Pembayaran"
          )}
        </StickerButton>
        <p className="text-[9px] text-center font-bold text-[#134E4A]/50 mt-2 flex items-center justify-center gap-1">
          <Sparkles size={10} /> Pembayaran aman & terverifikasi Orang Tua
        </p>
      </div>
    </div>
  );
}
