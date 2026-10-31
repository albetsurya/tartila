import { useState, useEffect } from "react";
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

/**
 * Tab Wrapper untuk halaman pembelajaran ustadz.
 * Menggabungkan Kurikulum Tartila dan Bank Kuis dengan segmented tab konsisten & tactile.
 */
export function UstadzLearningPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (): TabKey => {
    if (location.pathname.startsWith("/ustadz/kuis")) return "kuis";
    return "kurikulum";
  };

  const [activeTab, setActiveTab] = useState<TabKey>(getTabFromPath);

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    navigate(tab === "kuis" ? "/ustadz/kuis" : "/ustadz/kurikulum", {
      replace: true,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Consistent Tactile Neo-Brutalist Tab Bar */}
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
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "kurikulum" && <UstadzKurikulumPage />}
      {activeTab === "kuis" && <UstadzQuizListPage />}
    </div>
  );
}
