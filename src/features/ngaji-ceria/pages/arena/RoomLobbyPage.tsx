import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  SparklesSvg,
  CheckSvg,
  CopySvg,
  RocketSvg,
  CrownSvg,
  GamepadSvg,
  AlertTriangleSvg,
} from "@/components/ui/CustomIcons";
import { arenaRoomService, type ArenaRoom, type ArenaRoomPlayer } from "@/services/arenaRoomService";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeJoinCode } from "@/lib/joinCode";

export default function RoomLobbyPage() {
  const { pin: rawPin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const pin = normalizeJoinCode(rawPin || "");
  const [room, setRoom] = useState<ArenaRoom | null>(null);
  const [players, setPlayers] = useState<ArenaRoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Cek apakah user adalah host
  const isHost = Boolean(
    (user?.id && room?.host_id && user.id === room.host_id) ||
    (typeof window !== "undefined" && window.sessionStorage.getItem(`arena_is_host_${pin}`) === "true")
  );

  useEffect(() => {
    if (!pin) {
      setErrorMsg("PIN tidak ditemukan.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Ambil info room awal
    const loadRoomData = async () => {
      try {
        const foundRoom = await arenaRoomService.getRoom(pin);
        if (!foundRoom) {
          if (isMounted) {
            setErrorMsg(`Room dengan PIN "${pin}" tidak ditemukan.`);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setRoom(foundRoom);
          const initialPlayers = await arenaRoomService.getRoomPlayers(foundRoom.id);
          setPlayers(initialPlayers);
          setLoading(false);
        }

        // Jika room sudah dalam status playing, langsung redirect
        if (foundRoom.status === "playing") {
          navigate(isHost ? `/arena/host/game/${pin}` : `/arena/play/${pin}`);
          return;
        }

        // 2. Langganan Supabase Realtime untuk update lobi
        const unsubscribe = arenaRoomService.subscribeToLobby(foundRoom.id, {
          onPlayersChange: (updatedPlayers) => {
            if (isMounted) {
              setPlayers(updatedPlayers);
            }
          },
          onGameStart: () => {
            // Ketika host mulai game, semua pemain langsung berpindah
            if (isMounted) {
              navigate(isHost ? `/arena/host/game/${pin}` : `/arena/play/${pin}`);
            }
          },
        });

        return unsubscribe;
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || "Gagal memuat lobi room.");
          setLoading(false);
        }
      }
    };

    const cleanupPromise = loadRoomData();

    return () => {
      isMounted = false;
      cleanupPromise.then((unsub) => {
        if (unsub) unsub();
      });
    };
  }, [pin, navigate, isHost]);

  const handleStartGame = async () => {
    if (!room || !isHost || isStarting) return;
    setIsStarting(true);
    try {
      await arenaRoomService.startGame(room.id, pin);
      navigate(`/arena/host/game/${pin}`);
    } catch (err: any) {
      alert(err.message || "Gagal memulai permainan.");
      setIsStarting(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/arena/join?pin=${pin}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <NgajiCeriaLayout title={`Lobi Room - ${pin}`}>
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <TilaMascot size={90} mood="thinking" animation="bounce" direction="front" />
          <h2 className="font-display text-xl font-black text-[#134E4A]">
            Menghubungkan ke Lobi Tartila Arena...
          </h2>
          <p className="text-xs font-bold text-[#134E4A]/60">Menyiapkan koneksi real-time</p>
        </div>
      </NgajiCeriaLayout>
    );
  }

  if (errorMsg) {
    return (
      <NgajiCeriaLayout title="Room Tidak Ditemukan">
        <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl border-[3px] border-[#134E4A] bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] shadow-[3px_3px_0px_#134E4A]">
            <AlertTriangleSvg size={32} />
          </div>
          <h2 className="font-display text-2xl font-black text-[#134E4A]">Oops! Terjadi Masalah</h2>
          <p className="text-sm font-bold text-[#134E4A]/70">{errorMsg}</p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate("/arena/join")}
              className="px-6 py-3 rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all"
            >
              Kembali ke Menu Arena
            </button>
          </div>
        </div>
      </NgajiCeriaLayout>
    );
  }

  const isCasualRoom = room?.room_type === "casual" || room?.room_type === "latihan";

  return (
    <NgajiCeriaLayout title={`Lobi Room - PIN ${pin}`}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Banner Utama: PIN Raksasa Neo-Brutalism */}
        <div className="rounded-3xl border-[4px] border-[#134E4A] bg-[#FEF3C7] p-6 md:p-8 text-center shadow-[6px_6px_0px_#134E4A] space-y-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#134E4A] text-white text-xs font-black shadow-[2px_2px_0px_#134E4A] ${
                isCasualRoom ? "bg-[#0D9488]" : "bg-[#EA580C]"
              }`}
            >
              {isCasualRoom ? <GamepadSvg size={14} /> : <CrownSvg size={14} />}
              {isCasualRoom ? "ROOM MAIN KASUAL" : "ROOM UJIAN RESMI"}
            </span>

            {isHost && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A]">
                <CrownSvg size={14} /> Anda adalah Host
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-[#134E4A]/70">
              Bagikan Kode PIN Ini ke Teman-Temanmu:
            </h2>
            <div className="inline-block mt-3 px-8 md:px-12 py-3 md:py-4 rounded-2xl border-[4px] border-[#134E4A] bg-white shadow-[6px_6px_0px_#134E4A]">
              <span className="font-display text-5xl md:text-7xl font-black text-[#134E4A] tracking-[0.2em] select-all">
                {pin}
              </span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-[2px] border-[#134E4A] bg-white text-[#134E4A] text-xs md:text-sm font-black shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <CheckSvg size={16} /> Link Undangan Disalin!
                </>
              ) : (
                <>
                  <CopySvg size={16} /> Salin Link Undangan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Daftar Avatar Teman yang Sudah Join (Supabase Realtime) */}
        <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 shadow-[5px_5px_0px_#134E4A] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]" />
              </span>
              <h3 className="font-display text-lg md:text-xl font-black text-[#134E4A]">
                Teman yang Bergabung ({players.length})
              </h3>
            </div>

            <span className="text-xs font-bold text-[#134E4A]/60">
              Sinkronisasi Real-Time Otomatis
            </span>
          </div>

          {players.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center bg-[#F0FDF4] rounded-2xl border-2 border-dashed border-[#134E4A]/30">
              <TilaMascot size={80} mood="thinking" animation="bounce" direction="front" />
              <p className="mt-3 text-sm font-black text-[#134E4A]">
                Belum ada pemain yang bergabung
              </p>
              <p className="text-xs font-bold text-[#134E4A]/60 mt-1">
                Ayo beri tahu temanmu untuk memasukkan PIN di atas!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 rounded-2xl border-2 border-[#134E4A]/20 bg-[#F0FDF4]">
              {players.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="p-3 rounded-xl border-2 border-[#134E4A] bg-white font-black text-sm text-[#134E4A] shadow-[2px_2px_0px_#134E4A] flex items-center gap-2.5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full border border-[#134E4A] bg-[#FEF08A] flex items-center justify-center text-xs font-black shrink-0">
                    {p.is_host || idx === 0 ? "👑" : "🎮"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate text-xs font-black text-[#134E4A]">{p.nickname}</p>
                    <span className="text-[10px] font-bold text-[#134E4A]/50">
                      {p.is_host || idx === 0 ? "Host Room" : "Pemain"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Panel: Tombol Mulai Game (HANYA MUNCUL UNTUK HOST) */}
        <div className="pt-2">
          {isHost ? (
            <button
              type="button"
              disabled={isStarting}
              onClick={handleStartGame}
              className="w-full py-4 md:py-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-lg md:text-xl shadow-[5px_5px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#0F766E] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <RocketSvg size={24} />
              <span>{isStarting ? "Memulai Permainan..." : "Mulai Game Sekarang!"}</span>
            </button>
          ) : (
            <div className="p-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF9C3] shadow-[4px_4px_0px_#134E4A] flex items-center justify-center gap-3 text-center">
              <SparklesSvg size={22} />
              <div>
                <p className="font-display font-black text-base text-[#134E4A]">
                  Menunggu Host Memulai Permainan...
                </p>
                <p className="text-xs font-bold text-[#134E4A]/70 mt-0.5">
                  Layar akan otomatis berpindah begitu host menekan tombol mulai!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
