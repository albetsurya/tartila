import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  TrophySvg,
  SparklesSvg,
  CrownSvg,
  ChartBarSvg,
  WhatsAppSvg,
} from "@/components/ui/CustomIcons";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/tilaEvent";
import { arenaRoomService } from "@/services/arenaRoomService";
import {
  MultiplayerAvatar,
  loadMultiplayerProfile,
} from "../../components/multiplayer/MultiplayerSetupSheet";

interface PodiumEntry {
  playerId?: string;
  id?: string;
  rank: number;
  nickname: string;
  score: number;
  passed?: boolean;
  violations?: number;
  avatarId?: string;
}

/** Nama yang tidak membawa informasi (kosong atau default server lama). */
function isPlaceholderName(name?: string): boolean {
  const value = (name || "").trim();
  if (!value) return true;
  const lowered = value.toLowerCase();
  return lowered === "pemain" || lowered === "player" || lowered === "santri";
}

export default function ArenaPodiumPage() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const profile = useMemo(() => loadMultiplayerProfile(), []);
  const myPlayerId = useMemo(() => {
    try {
      return sessionStorage.getItem("arena_player_id");
    } catch {
      return null;
    }
  }, []);

  const state = (location.state as any) || {};
  const myNameFromProfile =
    state.myName ||
    profile?.displayName ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("arena_player_name")
      : null) ||
    "Santri";
  const myAvatarId = profile?.avatarId || "boy-peci";

  // Nama & avatar diambil dari leaderboard server (sudah membawa nickname dan
  // avatarId hasil pilihan di lobi). Tidak ada lagi daftar nama contoh dan
  // tidak ada label "Pemain" untuk santri yang sudah punya profil.
  const leaderboard: PodiumEntry[] = useMemo(() => {
    const raw: PodiumEntry[] = Array.isArray(state.leaderboard)
      ? state.leaderboard
      : [];

    if (raw.length === 0) {
      return [
        {
          rank: 1,
          nickname: myNameFromProfile,
          score: state.myScore ?? 0,
          passed: true,
          avatarId: myAvatarId,
        },
      ];
    }

    return raw.map((entry, idx) => {
      const mine =
        Boolean(myPlayerId && entry.playerId === myPlayerId) ||
        (state.myName ? entry.nickname === state.myName : false);
      const nickname = isPlaceholderName(entry.nickname)
        ? mine
          ? myNameFromProfile
          : `Santri ${entry.rank || idx + 1}`
        : entry.nickname;
      return {
        ...entry,
        nickname,
        rank: entry.rank || idx + 1,
        avatarId: entry.avatarId || (mine ? myAvatarId : undefined),
      };
    });
  }, [state.leaderboard, state.myName, state.myScore, myPlayerId, myNameFromProfile, myAvatarId]);

  const kkm = state.kkm || 75;

  const firstPlace = leaderboard.find((p) => p.rank === 1);
  const secondPlace = leaderboard.find((p) => p.rank === 2);
  const thirdPlace = leaderboard.find((p) => p.rank === 3);

  const myScore = state.myScore ?? firstPlace?.score ?? 0;
  const myRank =
    state.myRank ??
    (state.myName
      ? (leaderboard.find((p) => p.nickname === state.myName)?.rank ?? 1)
      : (leaderboard.find((p) => p.nickname === myNameFromProfile)?.rank ?? 1));

  useEffect(() => {
    if (myRank === 1) {
      soundManager.playSfx("game-winner");
    } else {
      soundManager.playSfx("victory");
    }
  }, [myRank]);

  const handleBackToLobby = async () => {
    if (!pin) {
      navigate("/quiz-hub");
      return;
    }
    try {
      await arenaRoomService.resetRoomToLobby(pin);
    } catch (err) {
      console.warn("Gagal mereset status room:", err);
    }
    navigate(`/arena/lobby/${pin}`);
  };

  return (
    <NgajiCeriaLayout
      title="Podium Tartila Arena"
      showBack={true}
      onBack={() => setShowExitConfirm(true)}
    >
      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Keluar dari Podium?"
        description="Yakin ingin keluar dari sesi ini? Kamu akan kembali ke menu permainan."
        isDestructive={true}
        onConfirm={() => {
          setShowExitConfirm(false);
          navigate("/quiz-hub");
        }}
        onCancel={() => setShowExitConfirm(false)}
      />
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
            Selamat kepada seluruh santri yang telah berjuang dan menunjukkan
            adab terbaik!
          </p>
        </div>

        {/* Podium Top 3 (Kahoot Style Neo-Brutalism) */}
        <div className="pt-8 pb-4 flex items-end justify-center gap-3 md:gap-6 max-w-lg mx-auto">
          {/* JUARA 2 (Perak) */}
          {secondPlace && (
            <div className="flex-1 flex flex-col items-center">
              <MultiplayerAvatar
                avatarId={secondPlace.avatarId || "boy-peci"}
                size={44}
              />
              <span className="text-xs font-black text-[#134E4A] mt-1 mb-0.5 truncate max-w-[100px] text-center">
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
                <TilaMascot
                  size={64}
                  mood="excited"
                  animation="bounce"
                  direction="front"
                />
              </div>
              <div className="mb-1">
                <MultiplayerAvatar
                  avatarId={firstPlace.avatarId || myAvatarId}
                  size={52}
                />
              </div>
              <span className="text-sm font-black text-[#134E4A] mb-0.5 truncate max-w-[120px] text-center inline-flex items-center justify-center gap-1">
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
              <MultiplayerAvatar
                avatarId={thirdPlace.avatarId || "girl-hairbow"}
                size={44}
              />
              <span className="text-xs font-black text-[#134E4A] mt-1 mb-0.5 truncate max-w-[100px] text-center">
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
              window.open(
                `https://wa.me/?text=${encodeURIComponent(text)}`,
                "_blank",
              );
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
                {leaderboard.map((player, idx) => (
                  <tr
                    key={`${player.playerId || player.id || player.nickname}-${idx}`}
                    className="hover:bg-[#F0FDF4] transition-colors"
                  >
                    <td className="py-3 px-3 font-display font-black">
                      #{player.rank}
                    </td>
                    <td className="py-3 px-3 font-black">
                      <div className="flex items-center gap-2">
                        <MultiplayerAvatar
                          avatarId={player.avatarId || "boy-peci"}
                          size={28}
                        />
                        <span className="truncate">{player.nickname}</span>
                      </div>
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
              onClick={handleBackToLobby}
              className="flex-1 py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] hover:bg-[#FDE047] text-[#134E4A] font-black text-base shadow-[4px_4px_0px_#134E4A] active:scale-95 transition-all text-center inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <SparklesSvg size={18} />
              <span>Kembali ke Lobi (Ganti Tema)</span>
            </button>
          )}

          {pin && (
            <button
              type="button"
              onClick={() => navigate(`/arena/report/${pin}`)}
              className="flex-1 py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] text-[#134E4A] font-black text-base shadow-[4px_4px_0px_#134E4A] active:scale-95 transition-all text-center inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ChartBarSvg size={18} /> Lihat Laporan & Rapor
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria")}
            className="flex-1 py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-base shadow-[4px_4px_0px_#134E4A] active:scale-95 transition-all text-center cursor-pointer"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
