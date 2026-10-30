import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { AvatarSantriSvg } from "@/components/ui/Illustrations";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  SparklesSvg,
  CheckSvg,
  CopySvg,
  RocketSvg,
  CrownSvg,
  GamepadSvg,
  AlertTriangleSvg,
  PlusSvg,
} from "@/components/ui/CustomIcons";
import { arenaRoomService, type ArenaRoom, type ArenaRoomPlayer } from "@/services/arenaRoomService";
import { useAuth } from "@/contexts/AuthContext";
import { loadMultiplayerProfile, MultiplayerSetupSheet, MultiplayerAvatar, saveMultiplayerProfile, type MultiplayerProfile } from "../../components/multiplayer/MultiplayerSetupSheet";
import { useBotSimulator } from "../../hooks/useBotSimulator";
import { normalizeJoinCode } from "@/lib/joinCode";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/tilaEvent";
import { motion, AnimatePresence } from "framer-motion";

const COUNTDOWN_STEPS = ["3", "2", "1", "MULAI!"];

export default function RoomLobbyPage() {
  const { pin: rawPin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const pin = normalizeJoinCode(rawPin || "");

  // Room ID tersimpan di sessionStorage atau di-resolve dari PIN
  const [roomId, setRoomId] = useState<string | null>(() => {
    return typeof window !== "undefined" ? window.sessionStorage.getItem("arena_room_id") : null;
  });

  const [room, setRoom] = useState<ArenaRoom | null>(null);
  const [players, setPlayers] = useState<ArenaRoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(() => {
    return typeof window !== "undefined" ? window.sessionStorage.getItem("arena_player_id") : null;
  });
  const [showCountdown, setShowCountdown] = useState(false);
  const [countIndex, setCountIndex] = useState(0);
  const [profile, setProfile] = useState<MultiplayerProfile | null>(() => loadMultiplayerProfile());
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Simulator bot — QA superadmin: ditambahkan ke lobi, otomatis ready.
  const { bots, addBot } = useBotSimulator();

  // Guard untuk optimistic UI ready state
  const pendingReadyRef = useRef<boolean | null>(null);
  const myPlayerIdRef = useRef<string | null>(myPlayerId);
  useEffect(() => {
    myPlayerIdRef.current = myPlayerId;
  }, [myPlayerId]);

  // Cek apakah user adalah host
  const isHost = useMemo(() => {
    if (room?.host_id && user?.id && user.id === room.host_id) return true;
    if (typeof window !== "undefined" && window.sessionStorage.getItem(`arena_is_host_${pin}`) === "true") return true;
    return false;
  }, [pin, room?.host_id, user?.id]);

  // Tentukan pemain lokal (host pakai kartu host, guest pakai session join)
  useEffect(() => {
    if (!room || myPlayerId) return;
    let pid: string | null = null;
    if (isHost) {
      pid = players.find((p) => p.is_host)?.id ?? players[0]?.id ?? null;
    } else {
      pid =
        (typeof window !== "undefined"
          ? window.sessionStorage.getItem("arena_player_id")
          : null) ||
        players.find((p) => p.user_id === user?.id)?.id ||
        null;
    }
    if (pid && pid !== myPlayerId) {
      setMyPlayerId(pid);
    }
  }, [players, isHost, room, user?.id, myPlayerId]);

  const displayPlayers = useMemo(() => {
    const map = new Map(players.map((p) => [p.id, p]));
    for (const bot of bots) {
      const player: ArenaRoomPlayer = {
        id: bot.id,
        nickname: bot.name,
        room_id: pin,
        is_active: true,
        score: bot.score,
        is_host: false,
        is_ready: bot.isReady,
        created_at: new Date().toISOString(),
      };
      map.set(bot.id, player);
    }
    return Array.from(map.values());
  }, [players, bots, pin]);

  // Bot otomatis siap; user siap juga.
  const myReady = useMemo(() => {
    return Boolean(displayPlayers.find((p) => p.id === myPlayerId)?.is_ready);
  }, [displayPlayers, myPlayerId]);

  const allReady = displayPlayers.length > 0 && displayPlayers.every((p) => p.is_ready);

  // 1. Resolve roomId dari PIN jika belum ada di sessionStorage
  useEffect(() => {
    if (roomId || !pin) return;
    let isMounted = true;

    arenaRoomService
      .getRoom(pin)
      .then((foundRoom) => {
        if (!isMounted) return;
        if (foundRoom) {
          setRoom(foundRoom);
          setRoomId(foundRoom.id);
          sessionStorage.setItem("arena_room_id", foundRoom.id);
        } else {
          setErrorMsg(`Room dengan PIN "${pin}" tidak ditemukan.`);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setErrorMsg(err.message || "Gagal memuat lobi room.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pin, roomId]);

  // 2. Fungsi fetch room dan players dengan useCallback
  const fetchRoomData = useCallback(async (targetRoomId: string) => {
    try {
      const [foundRoom, initialPlayers] = await Promise.all([
        arenaRoomService.getRoom(targetRoomId),
        arenaRoomService.getRoomPlayers(targetRoomId),
      ]);
      if (foundRoom) {
        setRoom(foundRoom);
      }
      if (initialPlayers) {
        setPlayers(initialPlayers);
      }
    } catch (err: any) {
      console.warn("[RoomLobby] fetchRoomData error:", err);
    }
  }, []);

  // 3. Effect fetch data room/players & Supabase Realtime subscription
  // Dependency array HANYA [roomId]
  useEffect(() => {
    if (!roomId) return;

    let isMounted = true;

    // Fetch data awal room & players
    fetchRoomData(roomId).finally(() => {
      if (isMounted) setLoading(false);
    });

    // Langganan Supabase Realtime untuk update lobi
    const unsubscribe = arenaRoomService.subscribeToLobby(roomId, {
      onPlayersChange: (updatedPlayers) => {
        if (!isMounted) return;
        setPlayers(() => {
          // Guard: Jangan timpa status siap jika user sedang dalam proses loading/pending
          if (pendingReadyRef.current !== null && myPlayerIdRef.current) {
            return updatedPlayers.map((p) =>
              p.id === myPlayerIdRef.current
                ? { ...p, is_ready: pendingReadyRef.current! }
                : p
            );
          }
          return updatedPlayers;
        });
      },
      onGameStart: () => {
        if (isMounted) {
          setShowCountdown(true);
        }
      },
    });

    // Pastikan channel Supabase di-unsubscribe dengan benar
    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [roomId]);

  // Redirect jika room sudah berstatus playing saat pertama masuk
  useEffect(() => {
    if (room?.status === "playing") {
      navigate(isHost ? `/arena/host/game/${pin}` : `/arena/play/${pin}`, { replace: true });
    }
  }, [room?.status, isHost, pin, navigate]);

  const handleStartGame = async () => {
    if (!room || !isHost || isStarting || !allReady) return;
    triggerBibiReaction("click");
    soundManager.playSfx("tap");
    setIsStarting(true);
    try {
      // Simpan state awal untuk fallback di HostGamePage
      const startState = {
        questionIndex: 0,
        totalQuestions: (room.questions?.length ?? 0) || 1,
        question: room.questions?.[0],
      };
      sessionStorage.setItem("tartila_arena_start_state", JSON.stringify(startState));
      sessionStorage.setItem("arena_room_id", room.id);

      await arenaRoomService.startGame(room.id, pin);
      setShowCountdown(true);
    } catch (err: any) {
      alert(err.message || "Gagal memulai permainan.");
      setIsStarting(false);
    }
  };

  const handleToggleReady = async () => {
    if (!roomId || !myPlayerId || pendingReadyRef.current !== null) return;
    triggerBibiReaction("click");
    soundManager.playSfx("tap");
    const next = !myReady;

    // Optimistic UI: langsung ubah state lokal
    pendingReadyRef.current = next;
    setPlayers((prev) =>
      prev.map((p) => (p.id === myPlayerId ? { ...p, is_ready: next } : p))
    );

    try {
      await arenaRoomService.setPlayerReady(roomId, myPlayerId, next);
    } catch (err: any) {
      // Revert optimistic update jika gagal
      setPlayers((prev) =>
        prev.map((p) => (p.id === myPlayerId ? { ...p, is_ready: !next } : p))
      );
    } finally {
      pendingReadyRef.current = null;
    }
  };

  useEffect(() => {
    if (!showCountdown) return;
    if (countIndex >= COUNTDOWN_STEPS.length) {
      navigate(isHost ? `/arena/host/game/${pin}` : `/arena/play/${pin}`);
      return;
    }
    soundManager.playSfx("pop");
    const timer = setTimeout(() => setCountIndex((i) => i + 1), 1000);
    return () => clearTimeout(timer);
  }, [showCountdown, countIndex, navigate, isHost, pin]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/arena/join?pin=${pin}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    setShowExitConfirm(true);
  };

  if (loading) {
    return (
      <NgajiCeriaLayout title={`Lobi Room - ${pin}`} showBack={true} onBack={handleBack}>
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
      <NgajiCeriaLayout title="Room Tidak Ditemukan" showBack={true} onBack={handleBack}>
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
    <NgajiCeriaLayout title={`Lobi Room - PIN ${pin}`} showBack={true} onBack={handleBack}>
      {/* Confirm Dialog untuk keluar room */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Keluar dari Lobi?"
        description="Kamu akan keluar dari sesi permainan ini dan kembali ke menu."
        isDestructive={true}
        onConfirm={() => {
          setShowExitConfirm(false);
          sessionStorage.removeItem("arena_room_id");
          sessionStorage.removeItem(`arena_is_host_${pin}`);
          navigate("/member/ngaji-ceria/games");
        }}
        onCancel={() => setShowExitConfirm(false)}
      />

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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-[2px] border-[#134E4A] bg-white text-[#134E4A] text-xs md:text-sm font-black shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all hover:bg-gray-50 cursor-pointer"
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
                {bots.length > 0 ? `Teman & Bot Siap (${displayPlayers.length})` : `Teman yang Bergabung (${players.length})`}
              </h3>
            </div>

            <span className="text-xs font-bold text-[#134E4A]/60">
              Sinkronisasi Real-Time Otomatis
            </span>
          </div>

          {user?.role === "superadmin" && (
            <div className="flex items-center justify-between gap-2 border-b border-[#134E4A]/20 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wide text-[#134E4A]/50">
                Simulator QA
              </span>
              <button
                type="button"
                onClick={() => addBot()}
                className="inline-flex items-center gap-1.5 rounded-xl border-[3px] border-[#0D9488] bg-[#CCFBF1] px-3 py-1.5 text-[10px] font-black text-[#0D9488] shadow-[3px_3px_0px_#0D9488] active:translate-y-[2px] active:shadow-[2px_2px_0px_#0D9488] transition-all cursor-pointer hover:bg-[#B2F5EA]"
              >
                <PlusSvg size={14} /> + Tambah Bot
              </button>
            </div>
          )}
          {displayPlayers.length === 0 ? (
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
              {displayPlayers.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="p-3 rounded-xl border-2 border-[#134E4A] bg-white font-black text-sm text-[#134E4A] shadow-[2px_2px_0px_#134E4A] flex items-center gap-2.5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full border border-[#134E4A] bg-[#FEF08A] flex items-center justify-center shrink-0 text-[#134E4A] overflow-hidden">
                    {p.id === myPlayerId && profile ? (
                      <MultiplayerAvatar avatarId={profile.avatarId} size={26} />
                    ) : p.is_host || idx === 0 ? (
                      <CrownSvg size={16} />
                    ) : (
                      <AvatarSantriSvg
                        gender="girl"
                        accessory="hairbow"
                        mood="happy"
                        size={28}
                      />
                    )}
                  </div>
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p className="truncate text-xs font-black text-[#134E4A]">{p.nickname}</p>
                    <span className="block text-[10px] font-bold text-[#134E4A]/50">
                      {p.is_host ? "Host Room" : "Pemain"}
                    </span>
                    <span
                      className={`mt-1 inline-block px-2 py-0.5 rounded-md border-2 border-[#134E4A] text-[10px] font-black ${
                        p.is_ready
                          ? "bg-[#10B981] text-white"
                          : "bg-[#E5E7EB] text-[#6B7280]"
                      }`}
                    >
                      {p.is_ready ? "SIAP" : "MENUNGGU"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tombol Siap / Batal Siap untuk semua pemain */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleToggleReady}
            disabled={pendingReadyRef.current !== null || !myPlayerId}
            className={`w-full py-4 rounded-2xl border-[3px] border-[#134E4A] font-black text-lg shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
              myReady ? "bg-[#10B981] text-white" : "bg-[#FEF08A] text-[#134E4A]"
            }`}
          >
            <CheckSvg size={22} />
            <span>{myReady ? "Batal Siap" : "Siap"}</span>
          </button>
        </div>

        {/* Action Panel: Tombol Mulai Game (HANYA MUNCUL UNTUK HOST) */}
        <div className="pt-3">
          {isHost ? (
            <button
              type="button"
              disabled={isStarting || !allReady}
              onClick={handleStartGame}
              className="w-full py-4 md:py-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-lg md:text-xl shadow-[5px_5px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all hover:bg-[#0F766E] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <RocketSvg size={24} />
              <span>
                {isStarting
                  ? "Memulai Permainan..."
                  : allReady
                    ? "Mulai Game Sekarang!"
                    : "Menunggu Pemain Lain..."}
              </span>
            </button>
          ) : (
            <div className="p-5 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF9C3] shadow-[4px_4px_0px_#134E4A] flex items-center justify-center gap-3 text-center">
              <SparklesSvg size={22} />
              <div>
                <p className="font-display font-black text-base text-[#134E4A]">
                  {allReady
                    ? "Semua pemain siap! Menunggu Host memulai..."
                    : "Menunggu Host Memulai Permainan..."}
                </p>
                <p className="text-xs font-bold text-[#134E4A]/70 mt-0.5">
                  Layar akan otomatis berpindah begitu host menekan tombol mulai!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <MultiplayerSetupSheet
        isOpen={!profile}
        defaultName={user?.name || user?.username || ""}
        onSave={(p) => {
          saveMultiplayerProfile(p);
          setProfile(p);
        }}
      />

      <AnimatePresence>
        {showCountdown && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#134E4A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countIndex}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className={`font-display font-black leading-none ${
                countIndex === COUNTDOWN_STEPS.length - 1
                  ? "text-[4rem] text-[#FEF08A]"
                  : "text-[9rem] text-[#0D9488]"
              }`}
            >
              {COUNTDOWN_STEPS[countIndex]}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NgajiCeriaLayout>
  );
}