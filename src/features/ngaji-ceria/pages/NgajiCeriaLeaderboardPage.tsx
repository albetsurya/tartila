import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import {
  getLeaderboard,
  LEADERBOARD_GAME_IDS,
  type LeaderboardEntry,
} from "./games/_shared/progression";
import { LeaderboardPanel } from "./games/_shared/LeaderboardPanel";
import { getToken } from "../../../services/api";
import {
  isNgajiCeriaServerAvailable,
  ngajiCeriaApi,
} from "../services/ngajiCeriaApi";
import { Trophy, Star } from "../../../components/ui/CustomIcons";

const TITLES: Record<string, string> = {
  "ayat-hunter": "Ayat Hunter",
  "doa-dungeon": "Doa Dungeon",
  "nabi-chronicles": "Nabi Chronicles",
  "malaikat-mission": "Malaikat Mission",
  "tajwid-tetris": "Tajwid Tetris",
};

export default function NgajiCeriaLeaderboardPage() {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const [serverEntries, setServerEntries] = useState<
    Record<string, LeaderboardEntry[]>
  >({});
  const [period, setPeriod] = useState<"daily" | "weekly">("weekly");

  useEffect(() => {
    const refresh = () => setVersion((v) => v + 1);
    window.addEventListener("ngajiceria:leaderboard-updated", refresh);
    return () =>
      window.removeEventListener("ngajiceria:leaderboard-updated", refresh);
  }, []);

  useEffect(() => {
    if (!isNgajiCeriaServerAvailable() || !getToken()) return;
    let cancelled = false;
    Promise.all(
      LEADERBOARD_GAME_IDS.map(async (gameId) => {
        try {
          const response = await ngajiCeriaApi.getLeaderboard(gameId, period);
          return [
            gameId,
            response.entries.map((entry) => ({
              ...entry,
              updatedAt: Date.parse(entry.updatedAt) || 0,
            })),
          ] as const;
        } catch {
          return null;
        }
      }),
    ).then((items) => {
      if (cancelled) return;
      setServerEntries(
        Object.fromEntries(
          items.filter((item): item is readonly [string, LeaderboardEntry[]] =>
            Boolean(item),
          ),
        ),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [period, version]);

  return (
    <NgajiCeriaLayout title="Papan Skor" showBack onBack={() => navigate(-1)}>
      <div className="space-y-5 bg-[#F0FDF4] min-h-full rounded-t-3xl pb-32">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-[#134E4A] px-5 pt-6 pb-12 text-white rounded-b-[40px] shadow-lg">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[8px] border-white/5" />
          <div className="absolute top-8 right-12 text-[#FF6B6B] rotate-12">
            <Trophy size={48} />
          </div>
          <div className="relative z-10 max-w-[85%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B6B]/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] mb-2">
              <Star size={12} /> Pahlawan Papan Skor
            </span>
            <h2 className="font-display text-[24px] font-black leading-tight">
              Siapa juara <br />
              <span className="text-[#FF6B6B]">pekan ini?</span>
            </h2>
            <p className="mt-2 text-[11px] leading-relaxed text-white/80">
              Kumpulkan bintang sebanyak mungkin dan raih posisi teratas!
            </p>
          </div>
        </section>

        {/* Filter Tab (Sticker Style) */}
        <section className="px-4 -mt-6 relative z-20">
          <div className="flex gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-white p-1.5 shadow-[4px_4px_0px_#134E4A]">
            {(["daily", "weekly"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setPeriod(value)}
                className={`flex-1 rounded-xl py-2 text-xs font-black transition-all active:scale-95 ${
                  period === value
                    ? "bg-[#FF6B6B] text-white border-2 border-[#134E4A]"
                    : "text-[#134E4A] hover:bg-[#F0FDF4]"
                }`}
              >
                {value === "daily" ? "Harian" : "Mingguan"}
              </button>
            ))}
          </div>
        </section>

        {/* Info Text */}
        <p className="text-center text-[10px] font-semibold text-[#134E4A]/60 px-6">
          Skor tersimpan di server saat tersedia. Perangkat offline memakai
          papan lokal.
        </p>

        {/* Leaderboards */}
        <section className="px-4 space-y-4">
          {LEADERBOARD_GAME_IDS.map((gameId) => (
            <div
              key={gameId}
              className="rounded-[24px] border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A]"
            >
              <LeaderboardPanel
                entries={serverEntries[gameId] ?? getLeaderboard(gameId)}
                title={TITLES[gameId]}
              />
            </div>
          ))}
        </section>
      </div>
    </NgajiCeriaLayout>
  );
}
