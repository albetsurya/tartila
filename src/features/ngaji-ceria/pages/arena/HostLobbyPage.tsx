import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { SparklesSvg, CheckSvg, CopySvg, RocketSvg } from "@/components/ui/CustomIcons";
import { ArenaSocket } from "../../services/arenaSocket";
import { arenaApi } from "../../services/arenaApi";

interface LobbyPlayer {
  id: string;
  nickname: string;
  score: number;
}

export default function HostLobbyPage() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const socketRef = useRef<ArenaSocket | null>(null);

  useEffect(() => {
    if (!pin) return;

    // Fetch initial room info
    arenaApi.getRoomInfo(pin).then((info) => {
      setRoomInfo(info);
      if (info.players) {
        setPlayers(info.players);
      }
    }).catch((err) => {
      console.error("Failed to get room info", err);
    });

    // Connect Host to WebSocket
    const socket = new ArenaSocket(pin, "host", true, {
      onRoomState: (state) => {
        if (state.players) setPlayers(state.players);
      },
      onPlayerJoined: (data) => {
        setPlayers((prev) => {
          if (prev.some((p) => p.id === data.player.id)) return prev;
          return [...prev, data.player];
        });
      },
      onGameStarted: () => {
        // Pindah ke Host Game Page
        navigate(`/arena/host/game/${pin}`);
      },
    });

    socket.connect();
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [pin, navigate]);

  const handleStartGame = () => {
    if (!socketRef.current) return;
    socketRef.current.startGame();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/arena/join?pin=${pin}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NgajiCeriaLayout title={`Lobi Kuis - PIN ${pin}`}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Banner Utama: PIN Raksasa Kahoot-Style */}
        <div className="rounded-3xl border-[4px] border-[#134E4A] bg-[#FEF3C7] p-6 md:p-8 text-center shadow-[6px_6px_0px_#134E4A] space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#0D9488] text-white text-xs font-black shadow-[2px_2px_0px_#134E4A]">
            <SparklesSvg size={14} /> GABUNG DI TARTILA ARENA
          </span>

          <h2 className="text-sm font-black uppercase tracking-wider text-[#134E4A]/70">
            Masuk ke tautan & masukkan Game PIN:
          </h2>

          <div className="inline-block px-8 py-3 rounded-2xl border-[4px] border-[#134E4A] bg-white shadow-[6px_6px_0px_#134E4A]">
            <span className="font-display text-5xl md:text-6xl font-black text-[#134E4A] tracking-widest select-all">
              {pin}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A] active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <CheckSvg size={14} /> Tautan Disalin!
                </>
              ) : (
                <>
                  <CopySvg size={14} /> Salin Link Undangan
                </>
              )}
            </button>
            <span className="text-xs font-bold text-[#134E4A]/80">
              Total Soal: {roomInfo?.totalQuestions || 0}
            </span>
          </div>
        </div>

        {/* Status Peserta yang Sudah Join */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 shadow-[4px_4px_0px_#134E4A] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
              <h3 className="font-display text-xl font-black text-[#134E4A]">
                Peserta Bergabung ({players.length})
              </h3>
            </div>
            {roomInfo?.kkm && (
              <span className="text-xs font-black px-2.5 py-1 rounded-lg border border-[#134E4A] bg-[#CCFBF1] text-[#134E4A]">
                Target KKM: {roomInfo.kkm}
              </span>
            )}
          </div>

          {players.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <TilaMascot size={80} mood="thinking" animation="float" direction="front" />
              <p className="mt-3 text-sm font-bold text-[#134E4A]/60 animate-pulse">
                Menunggu santri bergabung dengan PIN di atas...
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5 min-h-[120px] p-4 rounded-2xl border-2 border-[#134E4A]/20 bg-[#F0FDF4]">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="px-4 py-2 rounded-xl border-2 border-[#134E4A] bg-white font-black text-sm text-[#134E4A] shadow-[2px_2px_0px_#134E4A] flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
                  <span>{p.nickname}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button: Mulai Kuis */}
        <div className="pt-2">
          <button
            type="button"
            disabled={players.length === 0}
            onClick={handleStartGame}
            className="w-full py-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-xl shadow-[6px_6px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Mulai Kuis Sekarang! <RocketSvg size={24} />
          </button>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
