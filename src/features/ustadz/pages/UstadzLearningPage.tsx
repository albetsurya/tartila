import { useLocation, useNavigate } from "react-router-dom";
import { UstadzKurikulumPage } from "./UstadzKurikulumPage";
import { UstadzQuizListPage } from "./UstadzQuizListPage";
import { BookOpen, Trophy } from "@/components/ui/CustomIcons";

type TabKey = "kurikulum" | "kuis";

const TABS: {
  key: TabKey;
  label: string;
  icon: typeof BookOpen;
}[] = [
  { key: "kurikulum", label: "Kurikulum Tartila", icon: BookOpen },
  { key: "kuis", label: "Bank Kuis", icon: Trophy },
];

export function UstadzLearningPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // LANGSUNG CEK URL (Diperbaiki agar membaca /learning/kuis)
  const activeTab: TabKey = location.pathname.includes("kuis")
    ? "kuis"
    : "kurikulum";

  const handleTabChange = (tab: TabKey) => {
    navigate(
      tab === "kuis" ? "/ustadz/learning/kuis" : "/ustadz/learning/kurikulum",
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Tab Bar */}
      <div className="w-full sm:w-auto grid grid-cols-2 gap-2 rounded-2xl border-2 border-[#134E4A] bg-[#F0FDF4] p-1.5 shadow-[3px_3px_0px_#134E4A]">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`h-11 sm:h-12 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-black transition-all ${
                isActive
                  ? "border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                  : "text-[#134E4A] hover:bg-white"
              }`}
            >
              {/* IKON DIBERI WARNA KHUSUS: Kuning saat aktif, Hijau saat tidak aktif */}
              <Icon
                size={18}
                className={isActive ? "text-[#FEF08A]" : "text-[#0D9488]"}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        className={
          activeTab === "kurikulum" ? "block animate-in fade-in" : "hidden"
        }
      >
        <UstadzKurikulumPage />
      </div>

      <div
        className={activeTab === "kuis" ? "block animate-in fade-in" : "hidden"}
      >
        <UstadzQuizListPage />
      </div>
    </div>
  );
}
