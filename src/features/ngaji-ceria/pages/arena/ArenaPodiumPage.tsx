import { useLocation, useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { TrophySvg, SparklesSvg, CrownSvg, ChartBarSvg, WhatsAppSvg } from "@/components/ui/CustomIcons";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/tilaEvent";

export default function ArenaPodiumPage() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as any) || {};
  const leaderboard: Array<{
    rank: number;
    nickname: string;
    score: number;
    passed?: boolean;
    violations?: number;
  }> = state.leaderboard || [
    { rank: 1, nickname: "Ahmad Fauzi", score: 9800, passed: true },
    { rank: 2, nickname: "Siti Nurhaliza", score: 9200, passed: true },
    { rank: 3, nickname: "Rizky Pratama", score: 8500, passed: true },
    { rank: 4, nickname: "Aisyah Zahra", score: 7200, passed: false },
    { rank: 5, nickname: "Bilal", score: 6800, passed: false },
  ];

  const kkm = state.kkm || 75;

  const firstPlace = leaderboard.find((p) => p.rank === 1);
  const secondPlace = leaderboard.find((p) => p.rank === 2);
  const thirdPlace = leaderboard.find((p) => p.rank === 3);

  const myScore = state.myScore ?? firstPlace?.score ?? 0;
  const myRank =
    state.myRank ??
    (state.myName
      ? (leaderboard.find((p) => p.nickname === state.myName)?.rank ?? 1)
      : 1);

  return (
    <NgajiCeriaLayout title="Podium Tartila Arena">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header Perayaan */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF3C7] text-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A]">
            <SparklesSvg size={14} /> HASIL AKHIR PERTANDINGAN
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-black text-[#134E4A]">
            Podium Juara Tartila Arena
          </h1>
          <p className="text-sm font-bold text-[#134E4A]/70">
            Selamat kepada seluruh santri yang telah berjuang dan menunjukkan adab terbaik!
          </p>
        </div>

        {/* Podium Top 3 (Kahoot Style Neo-Brutalism) */}
        <div className="pt-8 pb-4 flex items-end justify-center gap-3 md:gap-6 max-w-lg mx-auto">
          {/* JUARA 2 (Perak) */}
          {secondPlace && (
            <div className="flex-1 flex flex-col items-center">
              <span className="text-xs font-black text-[#134E4A] mb-1 truncate max-w-[100px] text-center">
                {secondPlace.nickname}
              </span>
              <span className="text-xs font-black text-[#0D9488] mb-2">
                {secondPlace.score} pts
              </span>
              <div className="w-full h-36 md:h-44 rounded-t-3xl border-[4px] border-[#134E4A] bg-[#E2E8F0] shadow-[4px_4px_0px_#134E4A] flex flex-col items-center justify-between p-3">
                <span className="w-10 h-10 rounded-full border-2 border-[#134E4A] bg-white font-display text-xl font-black text-[#134E4A] flex items-center justify-center shadow-[1px_1px_0px_#134E4A]">
                  2
                </span>
                <span className="text-[10px] font-black uppercase text-[#134E4A]/80 tracking-wider">
                  Perak
                </span>
              </div>
            </div>
          )}

          {/* JUARA 1 (Emas - Tengah Tinggi) */}
          {firstPlace && (
            <div className="flex-1 flex flex-col items-center -mt-6">
              <div className="mb-1">
                <TilaMascot size={64} mood="excited" animation="bounce" direction="front" />
              </div>
              <span className="text-sm font-black text-[#134E4A] mb-1 truncate max-w-[120px] text-center inline-flex items-center justify-center gap-1">
                <CrownSvg size={16} /> {firstPlace.nickname}
              </span>
              <span className="text-sm font-black text-[#D97706] mb-2">
                {firstPlace.score} pts
              </span>
              <div className="w-full h-48 md:h-56 rounded-t-3xl border-[4px] border-[#134E4A] bg-[#FACC15] shadow-[6px_6px_0px_#134E4A] flex flex-col items-center justify-between p-3">
                <span className="w-12 h-12 rounded-full border-[3px] border-[#134E4A] bg-white font-display text-2xl font-black text-[#134E4A] flex items-center justify-center shadow-[2px_2px_0px_#134E4A]">
                  1
                </span>
                <span className="text-xs font-black uppercase text-[#134E4A] tracking-wider">
                  Juara 1 Emas
                </span>
              </div>
            </div>
          )}

          {/* JUARA 3 (Perunggu) */}
          {thirdPlace && (
            <div className="flex-1 flex flex-col items-center">
              <span className="text-xs font-black text-[#134E4A] mb-1 truncate max-w-[100px] text-center">
                {thirdPlace.nickname}
              </span>
              <span className="text-xs font-black text-[#0D9488] mb-2">
                {thirdPlace.score} pts
              </span>
              <div className="w-full h-28 md:h-36 rounded-t-3xl border-[4px] border-[#134E4A] bg-[#FDBA74] shadow-[4px_4px_0px_#134E4A] flex flex-col items-center justify-between p-3">
                <span className="w-9 h-9 rounded-full border-2 border-[#134E4A] bg-white font-display text-lg font-black text-[#134E4A] flex items-center justify-center shadow-[1px_1px_0px_#134E4A]">
                  3
                </span>
                <span className="text-[10px] font-black uppercase text-[#134E4A]/80 tracking-wider">
                  Perunggu
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bagikan Hasil ke WhatsApp */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              triggerBibiReaction("click");
              soundManager.playSfx("tap");
              const text = `Aku baru saja menyelesaikan Tartila Arena! Aku mendapat peringkat ${myRank} dengan skor ${myScore}. Ayo ikut keseruannya di Tartila!`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
            }}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-4 px-6 rounded-2xl border-[3px] border-[#134E4A] bg-[#25D366] text-white font-black text-base shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all"
          >
            <WhatsAppSvg size={22} />
            Bagikan ke WhatsApp
          </button>
        </div>

        {/* Tabel Lengkap Seluruh Peserta */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 shadow-[5px_5px_0px_#134E4A] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-black text-[#134E4A] flex items-center gap-2">
              <TrophySvg size={18} /> Peringkat Keseluruhan Peserta
            </h3>
            <span className="text-xs font-black px-3 py-1 rounded-full border border-[#134E4A] bg-[#FEF3C7] text-[#134E4A]">
              Standar KKM: {kkm}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-bold text-[#134E4A]">
              <thead>
                <tr className="border-b-2 border-[#134E4A] text-[11px] font-black uppercase tracking-wider text-[#134E4A]/60">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Nama Santri</th>
                  <th className="py-2.5 px-3 text-right">Skor</th>
                  <th className="py-2.5 px-3 text-center">Status Kelulusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#134E4A]/10">
                {leaderboard.map((player) => (
                  <tr key={player.nickname} className="hover:bg-[#F0FDF4] transition-colors">
                    <td className="py-3 px-3 font-display font-black">
                      #{player.rank}
                    </td>
                    <td className="py-3 px-3 font-black">
                      {player.nickname}
                    </td>
                    <td className="py-3 px-3 text-right font-display font-black text-[#0D9488]">
                      {player.score} pts
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-black ${
                          player.passed !== false
                            ? "border-[#059669] bg-[#D1FAE5] text-[#065F46]"
                            : "border-[#DC2626] bg-[#FEE2E2] text-[#991B1B]"
                        }`}
                      >
                        {player.passed !== false ? "LULUS" : "REMEDIAL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {pin && (
            <button
              type="button"
              onClick={() => navigate(`/arena/report/${pin}`)}
              className="flex-1 py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] text-[#134E4A] font-black text-base shadow-[4px_4px_0px_#134E4A] active:scale-95 transition-all text-center inline-flex items-center justify-center gap-1.5"
            >
              <ChartBarSvg size={18} /> Lihat Laporan Kompetensi & Rapor
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria")}
            className="flex-1 py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-base shadow-[4px_4px_0px_#134E4A] active:scale-95 transition-all text-center"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
