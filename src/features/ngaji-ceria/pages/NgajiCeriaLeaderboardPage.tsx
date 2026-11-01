import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import {
  GamepadSvg,
  SwordsSvg,
  ScrollTextSvg,
  Trophy,
  LayoutGridSvg,
  CardsSvg,
} from "@/components/ui/CustomIcons";
import { LeaderboardList } from "@/components/ui/LeaderboardList";

const GAME_TABS = [
  { id: "hijaiyah-pop", title: "Hijaiyah Harvest", icon: <GamepadSvg size={16} /> },
  { id: "harakat-rush", title: "Harakat Slasher", icon: <SwordsSvg size={16} /> },
  { id: "ayat-scramble", title: "Ayat Scramble", icon: <ScrollTextSvg size={16} /> },
  { id: "quiz-hub", title: "Arena Kuis", icon: <Trophy size={16} /> },
  { id: "hijaiyah-2048", title: "Puzzle 2048", icon: <LayoutGridSvg size={16} /> },
  { id: "tilawati-memory", title: "Tilawati Memory", icon: <CardsSvg size={16} /> },
];

export default function NgajiCeriaLeaderboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("hijaiyah-pop");
  const [period, setPeriod] = useState<"daily" | "weekly">("weekly");

  const currentTabInfo =
    GAME_TABS.find((t) => t.id === activeTab) || GAME_TABS[0];

  return (
    <NgajiCeriaLayout title="Papan Skor" showBack onBack={() => navigate("/member/ngaji-ceria")}>
      <div className="space-y-4 bg-[#F0FDF4] text-[#134E4A] min-h-full pb-32">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-[#134E4A] px-5 pt-6 pb-12 text-white rounded-b-[36px] border-b-[3px] border-[#134E4A]">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full border-[8px] border-white/5 pointer-events-none" />
          <div className="absolute top-6 right-8 text-[#FF6B6B] rotate-12 pointer-events-none">
            <Trophy size={44} />
          </div>
          <div className="relative z-10 max-w-[85%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B6B]/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] mb-2 border border-[#FF6B6B]/30">
              Papan Skor Santri
            </span>
            <h2 className="font-display text-2xl font-black leading-tight">
              Papan Skor <br />
              <span className="text-[#FEF08A]">Para Juara</span>
            </h2>
            <p className="mt-1.5 text-xs text-white/80 leading-relaxed max-w-xs">
              Kumpulkan skor terbaikmu dan raih puncak peringkat di setiap game!
            </p>
          </div>
        </section>

        {/* Periode Switcher (Harian / Mingguan) */}
        <section className="px-4 -mt-7 relative z-20">
          <div className="flex gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-1.5 shadow-[4px_4px_0px_#134E4A]">
            {(["daily", "weekly"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setPeriod(value)}
                className={`flex-1 rounded-xl py-2 text-xs font-black transition-all active:scale-95 ${
                  period === value
                    ? "bg-[#0D9488] text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                    : "text-[#134E4A] hover:bg-[#F0FDF4]"
                }`}
              >
                {value === "daily" ? "Peringkat Harian" : "Peringkat Pekan Ini"}
              </button>
            ))}
          </div>
        </section>

        {/* TOP TAB BAR (Horizontal Scrollable) */}
        <section className="px-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/70 mb-2">
            Pilih Game:
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 pt-1">
            {GAME_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? "border-[3px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-black shadow-[3px_3px_0px_#134E4A] -translate-y-0.5"
                      : "border-2 border-[#134E4A] bg-[#FFFFFF] text-[#134E4A]/70 font-bold shadow-[1px_1px_0px_#134E4A] hover:bg-black/5"
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* TAB CONTENT: LeaderboardList */}
        <section className="px-4">
          <motion.div
            key={activeTab + period}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LeaderboardList
              gameId={activeTab}
              title={currentTabInfo.title}
              period={period}
            />
          </motion.div>
        </section>
      </div>
    </NgajiCeriaLayout>
  );
}
