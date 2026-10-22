import { useEffect, useState } from "react";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { TrophySvg, SparklesSvg, MedalSvg } from "@/components/ui/CustomIcons";
import { arenaApi } from "../../services/arenaApi";

interface LeaderboardItem {
  rank: number;
  nickname: string;
  tpq: string;
  score: number;
  badges: number;
}

export default function GlobalLeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    arenaApi.getGlobalLeaderboard().then((res) => {
      setItems(res.leaderboard);
    }).catch(() => {
      // Fallback data
      setItems([
        { rank: 1, nickname: "Ahmad Fauzi", tpq: "TPQ Al-Ikhlas", score: 9850, badges: 12 },
        { rank: 2, nickname: "Siti Nurhaliza", tpq: "TPQ An-Nur", score: 9420, badges: 10 },
        { rank: 3, nickname: "Rizky Pratama", tpq: "TPQ Baitul Mal", score: 8900, badges: 9 },
        { rank: 4, nickname: "Fatimah Azzahra", tpq: "TPQ Al-Muhajirin", score: 8550, badges: 8 },
        { rank: 5, nickname: "Zaidan Abdullah", tpq: "TPQ Al-Huda", score: 8200, badges: 7 },
        { rank: 6, nickname: "Maryam Kamilah", tpq: "TPQ Ar-Rahman", score: 7950, badges: 6 },
        { rank: 7, nickname: "Ibrahim Malik", tpq: "TPQ Al-Falah", score: 7600, badges: 5 },
      ]);
    }).finally(() => {
      setLoading(false);
    });
  }, [timeframe]);

  return (
    <NgajiCeriaLayout title="Klasemen Global Tartila Arena">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Banner Utama */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-6 shadow-[5px_5px_0px_#134E4A] text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#0D9488] text-white text-xs font-black shadow-[2px_2px_0px_#134E4A]">
            <SparklesSvg size={14} /> TARTILA GLOBAL LEAGUE
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-[#134E4A]">
            Klasemen Santri & TPQ
          </h1>
          <p className="text-xs md:text-sm font-bold text-[#134E4A]/80 max-w-xl mx-auto">
            Kumpulkan poin dari setiap pertandingan kuis Tartila Arena. Buktikan ketangkasan ilmu dan adab belajar Al-Qur'an!
          </p>

          {/* Toggle Waktu */}
          <div className="pt-2 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setTimeframe("weekly")}
              className={`px-5 py-2 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all ${
                timeframe === "weekly"
                  ? "bg-[#0D9488] text-white shadow-[3px_3px_0px_#134E4A]"
                  : "bg-white text-[#134E4A]"
              }`}
            >
              Minggu Ini
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("monthly")}
              className={`px-5 py-2 rounded-xl border-2 border-[#134E4A] font-black text-xs transition-all ${
                timeframe === "monthly"
                  ? "bg-[#0D9488] text-white shadow-[3px_3px_0px_#134E4A]"
                  : "bg-white text-[#134E4A]"
              }`}
            >
              Bulan Ini
            </button>
          </div>
        </div>

        {/* Tabel Klasemen */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 shadow-[5px_5px_0px_#134E4A] space-y-4">
          <h3 className="font-display text-lg font-black text-[#134E4A] flex items-center gap-2">
            <TrophySvg size={20} /> Peringkat Teratas Nasional
          </h3>

          {loading ? (
            <div className="py-12 text-center text-sm font-bold text-[#134E4A]/60">
              Memuat klasemen global...
            </div>
          ) : (
            <div className="space-y-2.5">
              {items.map((item) => {
                const isTop3 = item.rank <= 3;
                const badgeColor =
                  item.rank === 1
                    ? "bg-[#FACC15] text-[#134E4A]"
                    : item.rank === 2
                      ? "bg-[#E2E8F0] text-[#134E4A]"
                      : item.rank === 3
                        ? "bg-[#FDBA74] text-[#134E4A]"
                        : "bg-white text-[#134E4A]";

                return (
                  <div
                    key={item.rank}
                    className={`p-4 rounded-2xl border-2 border-[#134E4A] flex items-center justify-between gap-3 transition-all ${
                      isTop3 ? "bg-[#CCFBF1] shadow-[3px_3px_0px_#134E4A]" : "bg-white shadow-[1px_1px_0px_#134E4A]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-xl border-2 border-[#134E4A] flex items-center justify-center font-display text-base font-black shrink-0 ${badgeColor}`}
                      >
                        {item.rank}
                      </span>
                      <div>
                        <div className="font-black text-sm text-[#134E4A] flex items-center gap-1.5">
                          <span>{item.nickname}</span>
                          {item.rank === 1 && <span>👑</span>}
                        </div>
                        <span className="text-xs font-bold text-[#134E4A]/60">
                          {item.tpq}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-1 text-xs font-black text-[#134E4A]">
                        <MedalSvg size={16} />
                        <span>{item.badges} Lencana</span>
                      </div>
                      <div>
                        <span className="font-display text-base md:text-lg font-black text-[#0D9488]">
                          {item.score.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-black uppercase text-[#134E4A]/50 block">
                          Points
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
