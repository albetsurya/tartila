import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { DailyMissionsCard } from "../components/DailyMissionsCard";
import { CeriaGameLoading } from "../components/CeriaGameLoading";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { useNgajiCeriaProgress } from "../hooks/useNgajiCeriaProgress";
import {
  BookOpen,
  ChevronRight,
  HandsPraying,
  Lock,
  MapPin,
  Play,
  Sparkles,
  Trophy,
  Store,
  Crown,
} from "../../../components/ui/FontAwesomeIcons";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { triggerBibiReaction } from "../../../utils/bibiEvent";
import { TartilaLogo } from "../components/TartilaLogo";

export default function NgajiCeriaHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(() => {
    return sessionStorage.getItem("trigger_ngaji_ceria_splash") === "true";
  });

  React.useEffect(() => {
    if (!isLoading) return;
    sessionStorage.removeItem("trigger_ngaji_ceria_splash");
  }, [isLoading]);

  const finishLoading = React.useCallback(() => setIsLoading(false), []);

  const displayName = user?.name ? user.name.split(" ")[0] : "Hamba Allah";
  const { currentJilid, currentPage, progressPercentage } =
    useNgajiCeriaProgress();
  const currentJilidNumber = Number(currentJilid.replace("jilid-", "")) || 1;

  const quickActions = [
    {
      label: "Pilih Jilid",
      icon: BookOpen,
      to: "/member/ngaji-ceria/explore/tilawati",
    },
    { label: "Jelajah", icon: MapPin, to: "/member/ngaji-ceria/map" },
    { label: "Laporan", icon: Sparkles, to: "/member/ngaji-ceria/profile" },
    { label: "Peringkat", icon: Trophy, to: "/member/ngaji-ceria/leaderboard" },
  ];

  return (
    <>
      {isLoading && (
        <CeriaGameLoading durationMs={1500} onLoaded={finishLoading} />
      )}
      <NgajiCeriaLayout title={<TartilaLogo />}>
        <div
          className={`px-4 py-4 space-y-5 bg-[#F0FDF4] min-h-full rounded-t-3xl transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={NGAJI_CERIA_ASSETS.avatarAnak}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border-[3px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
              />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#134E4A]/60">
                  Assalamu'alaikum,
                </span>
                <h2 className="font-display font-black text-lg text-[#134E4A] truncate">
                  {displayName}
                </h2>
              </div>
            </div>
          </div>

          {/* Main Progress Card */}
          <section className="bg-[#134E4A] text-white rounded-[24px] p-5 border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#FF6B6B] relative overflow-hidden">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[6px] border-white/5" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B]">
              Tilawati {currentJilidNumber} • Halaman {currentPage}
            </span>
            <div className="mt-2 flex items-center justify-between gap-4 relative z-10">
              <div className="min-w-0">
                <h3 className="font-display font-black text-lg leading-tight">
                  Lanjutkan Belajar
                </h3>
                <p className="text-xs text-white/80 mt-1 font-medium">
                  Tilawati {currentJilidNumber} • Halaman {currentPage}
                </p>
              </div>
              <div className="shrink-0 w-16 h-16 rounded-full border-4 border-[#FF6B6B] bg-[#134E4A] flex items-center justify-center text-sm font-black text-[#FF6B6B]">
                {progressPercentage}%
              </div>
            </div>

            <button
              onClick={() => {
                triggerBibiReaction("play");
                navigate(
                  `/member/ngaji-ceria/quiz/play?jilid=${currentJilidNumber}&hal=${currentPage}`,
                );
              }}
              className="mt-4 w-full py-3 rounded-xl bg-[#0D9488] text-white font-black text-sm flex items-center justify-center gap-2 border-2 border-white/20 active:scale-[0.98] transition-all relative z-10"
            >
              <Play size={16} fill="currentColor" />
              Lanjutkan Belajar
            </button>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-4 gap-2.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => {
                    triggerBibiReaction("click");
                    navigate(action.to);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border-[2px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all gap-1.5"
                >
                  <Icon size={20} className="text-[#0D9488]" />
                  <span className="text-[10px] font-black text-[#134E4A] text-center leading-tight">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </section>

          {/* === SECTION BARU: TOKO & VIP === */}
          <section className="pt-1">
            <SectionHeader
              title="Toko & Hadiah"
              icon={<Store size={16} />}
              accent="amber"
            />

            <div className="grid grid-cols-2 gap-3">
              {/* Kartu Warung Santri (Tukar Koin) */}
              <button
                onClick={() => {
                  triggerBibiReaction("click");
                  navigate("/member/ngaji-ceria/warung-santri");
                }}
                className="text-left rounded-2xl bg-[#FEF3C7] border-[3px] border-[#134E4A] p-3.5 shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                  <img
                    src={NGAJI_CERIA_ASSETS.koinHijaiyah}
                    alt="Koin"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <p className="mt-2 font-display font-black text-sm text-[#134E4A]">
                  Warung Santri
                </p>
                <p className="text-[10px] font-bold text-[#B45309] mt-0.5">
                  Tukar Koin
                </p>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <Store size={60} />
                </div>
              </button>

              {/* Kartu Paspor VIP */}
              <button
                onClick={() => {
                  triggerBibiReaction("click");
                  navigate("/member/ngaji-ceria/premium");
                }}
                className="text-left rounded-2xl bg-[#FFF0F0] border-[3px] border-[#134E4A] p-3.5 shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FF6B6B] text-white flex items-center justify-center border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                  <Crown size={20} />
                </div>
                <p className="mt-2 font-display font-black text-sm text-[#134E4A]">
                  Paspor VIP
                </p>
                <p className="text-[10px] font-bold text-[#FF6B6B] mt-0.5">
                  Bebas Batas
                </p>
                <div className="absolute -bottom-4 -right-4 opacity-10 text-[#FF6B6B]">
                  <Crown size={60} />
                </div>
              </button>
            </div>
          </section>
          {/* === END SECTION BARU === */}

          {/* Level Cards */}
          <section className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-black text-sm text-[#134E4A]">
                Petualangan Tilawati
              </h4>
              <button
                onClick={() => navigate("/member/ngaji-ceria/explore/tilawati")}
                className="text-[11px] font-black text-[#0D9488] flex items-center gap-1 hover:underline"
              >
                Semua Jilid <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Card Jilid Aktif */}
              <button
                onClick={() => navigate("/member/ngaji-ceria/explore/tilawati")}
                className="text-left rounded-2xl bg-[#FFF0F0] border-[3px] border-[#134E4A] p-4 shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FF6B6B] text-white flex items-center justify-center border-2 border-[#134E4A]">
                  <BookOpen size={18} />
                </div>
                <p className="mt-2 font-display font-black text-sm text-[#134E4A]">
                  Tilawati {currentJilidNumber}
                </p>
                <p className="text-[10px] font-bold text-[#FF6B6B] mt-0.5">
                  Sedang dipelajari
                </p>
              </button>

              {/* Card Jilid Terkunci */}
              <button
                disabled
                className="text-left rounded-2xl bg-[#F0FDFA] border-[3px] border-dashed border-[#134E4A]/30 p-4 opacity-70 cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0D9488]/50 text-white flex items-center justify-center border-2 border-[#134E4A]/30">
                  <Lock size={18} />
                </div>
                <p className="mt-2 font-display font-black text-sm text-[#134E4A]/70">
                  Tilawati {currentJilidNumber + 1}
                </p>
                <p className="text-[10px] font-bold text-[#134E4A]/50 mt-0.5">
                  Terkunci
                </p>
              </button>
            </div>
          </section>

          {/* Daily Content */}
          <section className="rounded-2xl bg-white p-4 border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 flex items-center justify-center border-2 border-[#0D9488]/20">
                  <HandsPraying size={16} className="text-[#FF6B6B]" />
                </div>
                <h4 className="font-display font-black text-xs text-[#134E4A]">
                  Doa Hari Ini
                </h4>
              </div>
              <button
                onClick={() => navigate("/member/ngaji-ceria/explore/doa")}
                className="text-[10px] font-black text-[#0D9488] flex items-center gap-0.5 hover:underline"
              >
                Lihat Semua <ChevronRight size={12} />
              </button>
            </div>

            <div className="rounded-xl bg-[#F0FDF4] p-4 text-center border-2 border-[#0D9488]/20">
              <p
                className="font-arabic text-xl leading-loose text-[#134E4A]"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
            </div>
            <p className="mt-3 text-[11px] font-bold text-[#0D9488] italic">
              Bismillahirrahmanirrahim
            </p>
            <p className="text-[11px] font-medium text-[#134E4A]/70 mt-0.5">
              Aku memulai dengan nama Allah yang Maha Pengasih lagi Maha
              Penyayang.
            </p>
          </section>

          <DailyMissionsCard />
          <div className="h-32" aria-hidden="true" />
        </div>
      </NgajiCeriaLayout>
    </>
  );
}
