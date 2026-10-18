import React, { useState } from "react";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import {
  DAILY_MISSIONS,
  claimMission,
  getMissionCurrentProgress,
  isMissionClaimed,
} from "../data/dailyMissions";
import { Sparkles, Check } from "../../../components/ui/FontAwesomeIcons";
import { useNgajiProgress } from "../pages/games/_shared/progression";

export function DailyMissionsCard() {
  const [, setRefresh] = useState(0);
  useNgajiProgress();

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={NGAJI_CERIA_ASSETS.petiHarta}
            alt=""
            className="h-6 w-6 object-contain"
          />
          <h3 className="font-display text-sm font-black text-deep-teal">
            Misi Harian
          </h3>
        </div>
        <span className="rounded-full bg-coral-soft px-2.5 py-0.5 text-[10px] font-black text-coral-glow border border-coral-glow/20">
          Reset Tiap Hari
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {DAILY_MISSIONS.map((mission) => {
          const current = getMissionCurrentProgress(mission);
          const completed = current >= mission.target;
          const claimed = isMissionClaimed(mission.id);

          const handleClaim = () => {
            if (completed && !claimed) {
              claimMission(mission);
              setRefresh((r) => r + 1);
            }
          };

          return (
            <div
              key={mission.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${
                claimed
                  ? "border-mint-cloud bg-mint-cloud/60 opacity-70"
                  : completed
                    ? "border-coral-glow/20 bg-coral-soft"
                    : "border-teal-emerald/10 bg-mint-cloud"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-xs font-black text-deep-teal">
                  {mission.title}
                </p>
                <p className="text-[11px] text-deep-teal/60 mt-0.5">
                  {mission.description}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mint-cloud">
                    <div
                      className="h-full bg-teal-emerald transition-all"
                      style={{ width: `${(current / mission.target) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-deep-teal/60">
                    {current}/{mission.target}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                {claimed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-emerald/10 px-2.5 py-1 text-[10px] font-black text-teal-emerald">
                    <Check size={11} /> Selesai
                  </span>
                ) : completed ? (
                  <button
                    type="button"
                    onClick={handleClaim}
                    className="flex items-center gap-1 rounded-full bg-teal-emerald px-3 py-1 text-[10px] font-black text-white shadow-sm hover:bg-teal-emerald-dark active:scale-95"
                  >
                    <Sparkles size={11} /> Klaim +{mission.rewardCoins} 🪙 · +
                    {mission.rewardXp} XP
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-teal-emerald">
                    +{mission.rewardCoins} 🪙 · +{mission.rewardXp} XP
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
