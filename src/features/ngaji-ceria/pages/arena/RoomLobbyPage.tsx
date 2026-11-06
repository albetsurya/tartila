import { useEffect, useRef, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { AvatarSantriSvg } from "@/components/ui/Illustrations";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  CheckSvg,
  CopySvg,
  RocketSvg,
  CrownSvg,
  GamepadSvg,
  AlertTriangleSvg,
  PlusSvg,
  TrashSvg,
  ZapSvg,
  SparklesSvg,
} from "@/components/ui/CustomIcons";
import {
  QUIZ_HUB_CATEGORIES,
  getQuizHubQuestions,
} from "../../data/quizHubData";
import {
  arenaRoomService,
  type ArenaRoom,
  type ArenaRoomPlayer,
} from "@/services/arenaRoomService";
import { useAuth } from "@/contexts/AuthContext";
import {
  loadMultiplayerProfile,
  MultiplayerSetupSheet,
  MultiplayerAvatar,
  saveMultiplayerProfile,
  type MultiplayerProfile,
} from "../../components/multiplayer/MultiplayerSetupSheet";
import {
  useBotSimulator,
  clearBotSimulatorState,
} from "../../hooks/useBotSimulator";
import { normalizeJoinCode } from "@/lib/joinCode";
import { isTartilaAdmin } from "@/lib/roles";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/tilaEvent";
import { motion, AnimatePresence } from "framer-motion";

const COUNTDOWN_STEPS = ["3", "2", "1", "MULAI!"];

/** Ilustrasi Vektor Turnamen Arena Kompak untuk Header Lobi */
const LobbyArenaBannerSvg = () => (
  <svg
    viewBox="0 0 150 105"
    fill="none"
    className="w-24 h-20 sm:w-28 sm:h-22 shrink-0 overflow-visible"
  >
    {/* Efek Burst Komik */}
    <path
      d="M75 6 L88 22 L110 14 L104 34 L126 44 L106 58 L116 78 L92 76 L82 96 L68 80 L48 94 L46 74 L22 76 L34 56 L16 42 L38 34 L34 14 L56 24 Z"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Podium Juara */}
    <rect
      x="28"
      y="56"
      width="26"
      height="34"
      rx="4"
      fill="#38BDF8"
      stroke="#134E4A"
      strokeWidth="3"
    />
    <rect
      x="80"
      y="62"
      width="26"
      height="28"
      rx="4"
      fill="#FB923C"
      stroke="#134E4A"
      strokeWidth="3"
    />
    <rect
      x="52"
      y="40"
      width="30"
      height="50"
      rx="5"
      fill="#FACC15"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <text
      x="67"
      y="70"
      textAnchor="middle"
      fontSize="18"
      fontWeight="900"
      fill="#134E4A"
    >
      1
    </text>
    {/* Piala Emas */}
    <path
      d="M57 24 H77 L72 40 H62 L57 24 Z"
      fill="#FFFBEB"
      stroke="#134E4A"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle
      cx="67"
      cy="18"
      r="5.5"
      fill="#EF4444"
      stroke="#134E4A"
      strokeWidth="2.5"
    />
  </svg>
);

export default function RoomLobbyPage() {
  const { pin: rawPin } = useParams<{ pin: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const pin = normalizeJoinCode(rawPin || "");

  const [roomId, setRoomId] = useState<string | null>(null);

  const [room, setRoom] = useState<ArenaRoom | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    return (
      (typeof window !== "undefined"
        ? window.sessionStorage.getItem(`arena_theme_${pin}`)
        : null) || "bahasa-arab"
    );
  });
  const [players, setPlayers] = useState<ArenaRoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(() => {
    return typeof window !== "undefined"
      ? window.sessionStorage.getItem("arena_player_id")
      : null;
  });
  const [showCountdown, setShowCountdown] = useState(false);
  const [countIndex, setCountIndex] = useState(0);
  const [profile, setProfile] = useState<MultiplayerProfile | null>(() =>
    loadMultiplayerProfile(),
  );
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  // P0 Late Join: user yang membuka lobi saat room sedang berjalan tidak
  // boleh langsung masuk gameplay (guideline §2.5 / §12.3) — tolak.
  const [showLateJoinModal, setShowLateJoinModal] = useState(false);
  // Tersimpan false bila poll pertama sudah melihat status "playing":
  // tandanya pengguna ini bergabung telat, bukan peserta dari awal.
  const joinedEarlyRef = useRef(false);

  // Nama yang dipilih di sheet profil adalah nama yang ikut handshake
  // WebSocket, jadi samakan juga dengan yang tersimpan di sessionStorage.
  useEffect(() => {
    if (!profile?.displayName) return;
    try {
      sessionStorage.setItem("arena_player_name", profile.displayName);
    } catch {
      /* sessionStorage tidak tersedia */
    }
  }, [profile]);

  const { bots, addBot, removeBot, reset: resetBots } = useBotSimulator();

  const pendingReadyRef = useRef<boolean | null>(null);
  const myPlayerIdRef = useRef<string | null>(myPlayerId);
  useEffect(() => {
    myPlayerIdRef.current = myPlayerId;
  }, [myPlayerId]);

  useEffect(() => {
    return () => {
      resetBots();
      clearBotSimulatorState();
    };
  }, [resetBots]);

  const isHost = useMemo(() => {
    if (room?.host_id && user?.id && user.id === room.host_id) return true;
    if (
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(`arena_is_host_${pin}`) === "true"
    )
      return true;
    return false;
  }, [pin, room?.host_id, user?.id]);

  useEffect(() => {
    if (!room || myPlayerId) return;
    const pid =
      (typeof window !== "undefined"
        ? window.sessionStorage.getItem("arena_player_id")
        : null) ||
      players.find((p) => p.user_id === user?.id)?.id ||
      (isHost ? players[0]?.id : null) ||
      null;
    if (pid && pid !== myPlayerId) {
      setMyPlayerId(pid);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("arena_player_id", pid);
      }
    }
  }, [players, isHost, room, user?.id, myPlayerId]);

  const displayPlayers = useMemo(() => {
    const map = new Map(players.map((p) => [p.id, p]));
    for (const bot of bots) {
      const player: ArenaRoomPlayer = {
        id: bot.id,
        nickname: bot.name,
        room_id: room?.id ?? pin,
        is_active: true,
        score: bot.score,
        is_host: false,
        is_ready: bot.isReady,
        is_bot: true,
        avatarId: bot.avatarId,
        created_at: new Date().toISOString(),
      };
      map.set(bot.id, player);
    }
    return Array.from(map.values());
  }, [players, bots, room?.id, pin]);

  const myReady = useMemo(() => {
    return Boolean(displayPlayers.find((p) => p.id === myPlayerId)?.is_ready);
  }, [displayPlayers, myPlayerId]);

  const readyCount = useMemo(
    () => displayPlayers.filter((p) => p.is_ready).length,
    [displayPlayers],
  );

  const nonHostPlayers = displayPlayers.filter((p) => p.id !== myPlayerId);
  const hasThemeQuestions = useMemo(() => {
    try {
      const qs = getQuizHubQuestions(
        (selectedTheme as any) || "bahasa-arab",
        "mcq",
        undefined,
        1,
      );
      return Array.isArray(qs) && qs.length > 0;
    } catch {
      return false;
    }
  }, [selectedTheme]);

  const canStartGame =
    displayPlayers.length > 0 &&
    hasThemeQuestions &&
    (nonHostPlayers.length === 0 || nonHostPlayers.every((p) => p.is_ready));

  useEffect(() => {
    if (!pin) return;
    let alive = true;
    setLoading(true);

    arenaRoomService
      .getRoom(pin)
      .then((found) => {
        if (!alive) return;
        if (!found) {
          setErrorMsg(`Room dengan PIN "${pin}" tidak ditemukan.`);
          setLoading(false);
          return;
        }
        setRoom(found);
        setRoomId(found.id);
        if (found.theme) {
          setSelectedTheme(found.theme);
        }
        try {
          sessionStorage.setItem("arena_room_id", found.id);
        } catch {
          /* sessionStorage tidak tersedia */
        }
      })
      .catch((err: unknown) => {
        if (!alive) return;
        setErrorMsg(err instanceof Error ? err.message : "Gagal memuat lobi room.");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [pin]);

  useEffect(() => {
    if (!pin || showCountdown) return;
    let alive = true;
    let intervalId: number | null = null;
    let inFlight = false;
    let failures = 0;
    const POLL_INTERVAL_MS = 2000;
    const MAX_FAILURES = 5;

    const schedule = (delay: number) => {
      // Hentikan polling terjadwal SEBELUM mengubah `alive` supaya poll yang
      // sudah lewat jalur hang tidak menyeberanginya lagi.
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (!alive) return;
      // Jaring pengaman terakhir: sekali rute berpindah ke layar game/podium,
      // jangan ever menjadwalkan poll baru lagi.
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes(`/arena/lobby/${pin}`)
      ) {
        alive = false;
        return;
      }
      intervalId = window.setInterval(() => {
        void poll();
      }, delay);
    };

    const stopPolling = () => {
      // P1 ClearInterval race: batalkan interval terjadwal terlebih dahulu,
      // baru tandai tidak hidup.
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      alive = false;
    };

    const poll = async () => {
      // Satu request dalam satu waktu: tanpa guard ini, poll yang lambat bisa
      // menumpuk dan membanjiri get_room_by_pin / get_room_players_by_pin.
      if (!alive || inFlight) return;
      if (typeof document !== "undefined" && document.hidden) {
        schedule(4000);
        return;
      }

      inFlight = true;
      try {
        const [found, list] = await Promise.all([
          arenaRoomService.getRoom(pin),
          arenaRoomService.getRoomPlayers(pin),
        ]);
        if (!alive) return;
        failures = 0;
        if (found) {
          setRoom(found);
          setRoomId(found.id);
          if (found.theme) {
            setSelectedTheme(found.theme);
          }
          if (found.status === "playing") {
            // P0 Auto-Start: polling mati total; Host masuk Game lewat
            // efek status "playing" di bawah, late joiner ditolak.
            if (isHost || joinedEarlyRef.current) {
              stopPolling();
            } else {
              stopPolling();
              setShowLateJoinModal(true);
            }
            return;
          }
          // Bergabung sebelum permainan dimulai: peserta sah.
          joinedEarlyRef.current = true;
        }
        setPlayers(() => {
          if (pendingReadyRef.current !== null && myPlayerIdRef.current) {
            return list.map((p) =>
              p.id === myPlayerIdRef.current
                ? { ...p, is_ready: pendingReadyRef.current! }
                : p,
            );
          }
          return list;
        });
        setLoading(false);
      } catch (err) {
        if (!alive) return;
        failures += 1;
        if (failures >= MAX_FAILURES) {
          stopPolling();
          setLoading(false);
          setErrorMsg(
            err instanceof Error
              ? `Koneksi ke lobi terputus: ${err.message}`
              : "Koneksi ke lobi terputus.",
          );
          return;
        }
      } finally {
        inFlight = false;
      }

      schedule(POLL_INTERVAL_MS);
    };

    void poll();
    return () => {
      stopPolling();
    };
  }, [pin, showCountdown, isHost]);

  const currentThemeInfo = useMemo(() => {
    return QUIZ_HUB_CATEGORIES.find((c) => c.id === selectedTheme);
  }, [selectedTheme]);

  const handleThemeChange = async (newTheme: string) => {
    if (!isHost || !pin) return;
    setSelectedTheme(newTheme);
    try {
      sessionStorage.setItem(`arena_theme_${pin}`, newTheme);
    } catch {
      /* ignore */
    }
    // Update tema tetap via backend REST (bukan WS). Lintasan dev/offline ini
    // tidak berhubungan dengan klaim tetap mencerminkan `sambung-ngaji`.
    const res = await (arenaRoomService as any).updateRoomTheme(pin, newTheme);
    if (!res.ok) {
      alert(res.message || "Gagal memperbarui tema room.");
      return;
    }
  };

  useEffect(() => {
    if (!room || room?.status !== "playing") return;
    // P0 Late Join: hanya melihat status menuju "playing" untuk peserta yang
    // sudah jauh sebelumnya; tersinggung dilakar (modal) & kembali ke quiz hub.
    if (isHost || joinedEarlyRef.current) {
      navigate(isHost ? `/arena/host/game/${pin}` : `/arena/play/${pin}`, {
        replace: true,
      });
    } else {
      setShowLateJoinModal(true);
    }
  }, [room, isHost, pin, navigate]);

  const handleStartGame = async () => {
    if (!room || !isHost || isStarting || !canStartGame) return;
    triggerBibiReaction("click");
    soundManager.playSfx("tap");
    setIsStarting(true);
    try {
      const hubQuestions = getQuizHubQuestions(
        (selectedTheme as any) || "bahasa-arab",
        "mcq",
        undefined,
        10,
      );
      if (!hubQuestions || hubQuestions.length === 0) {
        alert("Tema yang dipilih tidak memiliki soal kuis. Silakan pilih tema lain.");
        setIsStarting(false);
        return;
      }
      const saved = await arenaRoomService.saveRoomQuestions(
        room.id,
        hubQuestions,
      );
      if (!saved.ok) {
        // Tanpa soal tersimpan, santri akan berhenti di layar
        // "Menyiapkan soal..." sehingga kegagalan ini harus terlihat.
        alert(saved.message || "Gagal menyimpan soal ke room.");
        setIsStarting(false);
        return;
      }
      try {
        sessionStorage.setItem(`arena_theme_${pin}`, selectedTheme);
      } catch {
        /* ignore */
      }

      // Salinan soal untuk tab Host sendiri (sessionStorage). RPC
      // room_questions tidak mengembalikan kunci jawaban, jadi tab Host butuh
      // salinan ini agar pembahasan menampilkan kunci yang benar. Tab santri
      // tidak memiliki salinan ini dan hanya menerima soal dari server.
      try {
        sessionStorage.setItem(
          `arena_questions_${pin}`,
          JSON.stringify(hubQuestions),
        );
      } catch {
        /* sessionStorage penuh / privat: pembahasan memakai data server */
      }

      const started = await arenaRoomService.startGame(room.id, pin);
      if (!started.ok) {
        alert(started.message || "Gagal memulai permainan.");
        setIsStarting(false);
        return;
      }

      const startState = {
        questionIndex: 0,
        totalQuestions: hubQuestions.length || 10,
        question: hubQuestions[0],
      };
      sessionStorage.setItem(
        "tartila_arena_start_state",
        JSON.stringify(startState),
      );
      sessionStorage.setItem("arena_room_id", room.id);

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

    pendingReadyRef.current = next;
    setPlayers((prev) =>
      prev.map((p) => (p.id === myPlayerId ? { ...p, is_ready: next } : p)),
    );

    try {
      const res = await arenaRoomService.setPlayerReady(roomId, myPlayerId, next);
      if (!res.ok) {
        setPlayers((prev) =>
          prev.map((p) => (p.id === myPlayerId ? { ...p, is_ready: !next } : p)),
        );
      }
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

  const activePin = room?.pin || pin;

  const handleCopyLink = () => {
    const target = room?.pin ?? pin;
    if (!target) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(target).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    setShowExitConfirm(true);
  };

  if (loading) {
    return (
      <NgajiCeriaLayout
        title={`Lobi Room - ${pin}`}
        showBack={true}
        onBack={handleBack}
      >
        <div className="max-w-md mx-auto px-4 py-14 text-center space-y-3">
          <TilaMascot
            size={84}
            mood="thinking"
            animation="bounce"
            direction="front"
          />
          <h2 className="font-display text-lg font-black text-[#134E4A]">
            Menghubungkan ke Lobi Arena...
          </h2>
          <p className="text-xs font-bold text-[#134E4A]/60">
            Menyiapkan koneksi real-time
          </p>
        </div>
      </NgajiCeriaLayout>
    );
  }

  if (errorMsg) {
    return (
      <NgajiCeriaLayout
        title="Room Tidak Ditemukan"
        showBack={true}
        onBack={handleBack}
      >
        <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl border-[3px] border-[#134E4A] bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] shadow-[3px_3px_0px_#134E4A]">
            <AlertTriangleSvg size={28} />
          </div>
          <h2 className="font-display text-xl font-black text-[#134E4A]">
            Oops! Terjadi Masalah
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#134E4A]/70">
            {errorMsg}
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => navigate("/arena/join")}
              className="px-5 py-2.5 rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-xs sm:text-sm shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              Kembali ke Menu Arena
            </button>
          </div>
        </div>
      </NgajiCeriaLayout>
    );
  }

  const isCasualRoom =
    room?.room_type === "casual" || room?.room_type === "latihan";

  return (
    <NgajiCeriaLayout
      title={`Lobi Mabar · PIN ${pin}`}
      showBack={true}
      onBack={handleBack}
    >
      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Keluar dari Lobi?"
        description="Kamu akan keluar dari sesi permainan ini dan kembali ke menu."
        isDestructive={true}
        onConfirm={() => {
          setShowExitConfirm(false);
          sessionStorage.removeItem("arena_room_id");
          sessionStorage.removeItem(`arena_is_host_${pin}`);
          sessionStorage.removeItem("arena_player_id");
          sessionStorage.removeItem("arena_player_name");
          resetBots();
          clearBotSimulatorState();
          navigate("/quiz-hub");
        }}
        onCancel={() => setShowExitConfirm(false)}
      />

      {/* P0 Late Join: modal penolakan ketika room sedang berjalan */}
      {showLateJoinModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border-[4px] border-[#134E4A] bg-white p-6 text-center shadow-[8px_8px_0px_#134E4A] space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] flex items-center justify-center text-[#134E4A] shadow-[3px_3px_0px_#134E4A]">
              <AlertTriangleSvg size={28} />
            </div>
            <h3 className="font-display text-xl font-black text-[#134E4A]">
              Room Sudah Berjalan
            </h3>
            <p className="text-sm font-bold text-[#134E4A]/80 leading-relaxed">
              Permainan sudah dimulai Host, kamu tidak bisa bergabung di tengah
              sesi.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowLateJoinModal(false);
                sessionStorage.removeItem("arena_player_id");
                sessionStorage.removeItem(`arena_is_host_${pin}`);
                navigate("/quiz-hub");
              }}
              className="w-full py-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              Kembali ke Quiz Hub
            </button>
          </div>
        </div>
      )}

      <div className="relative min-h-[calc(100dvh-3.5rem)] bg-[#F0FDF4]">
        {/* Latar Action Halftone & Diagonal Speed-Lines */}
        <div
          className="pointer-events-none fixed inset-0 opacity-20 z-0"
          style={{
            backgroundImage: "radial-gradient(#0D9488 2px, transparent 2px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.05] z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #134E4A 0px, #134E4A 2px, transparent 2px, transparent 18px)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 pt-3 pb-28 space-y-3">
          {/* =============================================================== */}
          {/* 1. COMPACT TICKET HEADER: PIN + ILUSTRASI + TOMBOL SALIN        */}
          {/* =============================================================== */}
          <section className="relative overflow-hidden rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FEF3C7] p-3.5 sm:p-4 shadow-[4px_4px_0px_#134E4A]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                <LobbyArenaBannerSvg />

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border-2 border-[#134E4A] text-white text-[9.5px] font-black uppercase shadow-[1.5px_1.5px_0px_#134E4A] ${
                        isCasualRoom ? "bg-[#0D9488]" : "bg-[#EA580C]"
                      }`}
                    >
                      {isCasualRoom ? (
                        <GamepadSvg size={11} />
                      ) : (
                        <CrownSvg size={11} />
                      )}
                      {isCasualRoom ? "Arena Mabar" : "Ujian Resmi"}
                    </span>

                    {isHost && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-[9.5px] font-black uppercase shadow-[1.5px_1.5px_0px_#134E4A]">
                        <CrownSvg size={11} /> Host
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-sm sm:text-base font-black text-[#134E4A] truncate">
                    {room?.title || "Lobi Turnamen Kuis Aktif"}
                  </h2>
                  <p className="text-[11px] font-bold text-[#134E4A]/70 leading-snug">
                    Ajak temanmu masuk menggunakan PIN di samping!
                  </p>
                </div>
              </div>

              {/* Kotak PIN & Salin Link */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t-2 sm:border-t-0 border-dashed border-[#134E4A]/20 pt-2.5 sm:pt-0">
                <div className="px-3.5 py-1.5 rounded-xl border-[2.5px] border-[#134E4A] bg-white shadow-[2.5px_2.5px_0px_#134E4A]">
                  <span className="block text-[8px] font-black uppercase tracking-widest text-[#0D9488] leading-none">
                    PIN ROOM
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-black text-[#134E4A] tracking-[0.15em] select-all leading-tight">
                    {activePin}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border-[2.5px] border-[#134E4A] text-xs font-black shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                    copied
                      ? "bg-[#10B981] text-white"
                      : "bg-[#FEF08A] hover:bg-[#FDE047] text-[#134E4A]"
                  }`}
                >
                  {copied ? <CheckSvg size={14} /> : <CopySvg size={14} />}
                  <span>{copied ? "PIN Tersalin!" : "Salin PIN"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* =============================================================== */}
          {/* 2. TEMA PERMAINAN (HOST DAPAT MENGGANTI, PEMAIN DAPAT MELIHAT)  */}
          {/* =============================================================== */}
          <section className="rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FEF08A] p-3.5 sm:p-4 shadow-[4px_4px_0px_#134E4A]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b-[2px] border-dashed border-[#134E4A]/20">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                  <SparklesSvg size={15} />
                </span>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-black text-[#134E4A]">
                    Tema Permainan
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#134E4A]/70">
                    {isHost
                      ? "Pilih topik soal kuis untuk sesi mabar ini"
                      : "Tema kuis yang dipilih oleh Host"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A]">
                  <span>{currentThemeInfo?.title || "Bahasa Arab"}</span>
                </span>
              </div>
            </div>

            {isHost ? (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 max-h-48 overflow-y-auto p-0.5">
                {QUIZ_HUB_CATEGORIES.map((cat) => {
                  const isSelected = selectedTheme === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleThemeChange(cat.id)}
                      className={`flex flex-col items-center justify-center rounded-xl border-2 p-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#134E4A] bg-[#134E4A] text-[#FEF08A] shadow-[2px_2px_0px_#042F2E]"
                          : "border-[#134E4A]/30 bg-white hover:bg-[#FEF3C7] text-[#134E4A]"
                      }`}
                    >
                      <span className="text-[11px] font-black line-clamp-1">
                        {cat.title}
                      </span>
                      <span className="text-[9px] opacity-80 line-clamp-1">
                        {cat.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-2.5 flex items-center gap-2 rounded-xl border-2 border-dashed border-[#134E4A]/30 bg-white/70 px-3 py-2 text-xs font-bold text-[#134E4A]">
                <span>Host memilih tema: </span>
                <span className="font-black text-[#0D9488]">
                  {currentThemeInfo?.title || "Bahasa Arab"} ({currentThemeInfo?.tag || "Kuis"})
                </span>
              </div>
            )}
          </section>

          {/* =============================================================== */}
          {/* 3. GRID PEMAIN COMPACT & KONTROL KARAKTER                       */}
          {/* =============================================================== */}
          <section className="rounded-2xl border-[3.5px] border-[#134E4A] bg-white p-3.5 sm:p-4 shadow-[4px_4px_0px_#134E4A] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b-[2px] border-dashed border-[#134E4A]/20">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981] border border-[#134E4A]" />
                </span>
                <h3 className="font-display text-sm sm:text-base font-black text-[#134E4A]">
                  Skuad Pemain ({displayPlayers.length})
                </h3>
                <span className="inline-flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-black text-[#065F46]">
                  <ZapSvg size={11} />
                  <span>{readyCount}/{displayPlayers.length} Siap</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {isTartilaAdmin(user?.role) && (
                  <button
                    type="button"
                    onClick={() => addBot()}
                    className="inline-flex items-center gap-1 rounded-xl border-[2px] border-[#134E4A] bg-[#FEF08A] hover:bg-[#FDE047] px-2.5 py-1 text-[10.5px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                  >
                    <PlusSvg size={12} />
                    <span>Bot QA</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowProfileSheet(true)}
                  className="inline-flex items-center gap-1 rounded-xl border-[2px] border-[#134E4A] bg-[#CCFBF1] hover:bg-[#99F6E4] px-2.5 py-1 text-[10.5px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <span>Ganti Karakter</span>
                </button>
              </div>
            </div>

            {displayPlayers.length === 0 ? (
              <div className="py-6 px-4 text-center flex flex-col items-center justify-center bg-[#F0FDF4] rounded-xl border-2 border-dashed border-[#134E4A]/30">
                <TilaMascot
                  size={60}
                  mood="thinking"
                  animation="bounce"
                  direction="front"
                />
                <p className="mt-2 text-xs sm:text-sm font-black text-[#134E4A]">
                  Menunggu pemain bergabung ke arena...
                </p>
                <p className="text-[11px] font-bold text-[#134E4A]/60">
                  Bagikan PIN {activePin} kepada teman-temanmu!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto p-0.5">
                {displayPlayers.map((p, idx) => {
                  const isMe = p.id === myPlayerId;
                  const isBotPlayer = Boolean(
                    p.is_bot || p.id.startsWith("bot-"),
                  );
                  const isRoomHost =
                    p.is_host || (room?.host_id && p.user_id === room.host_id);

                  return (
                    <div
                      key={p.id || idx}
                      className={`relative rounded-xl border-[2.5px] border-[#134E4A] p-2 transition-all flex flex-col justify-between gap-1.5 ${
                        p.is_ready
                          ? "bg-[#ECFDF5] shadow-[2.5px_2.5px_0px_#065F46]"
                          : "bg-white shadow-[2.5px_2.5px_0px_#134E4A]"
                      } ${isMe ? "ring-2 ring-[#F59E0B]" : ""}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] flex items-center justify-center shrink-0 text-[#134E4A] overflow-hidden">
                          {isMe && profile ? (
                            <MultiplayerAvatar
                              avatarId={profile.avatarId}
                              size={26}
                            />
                          ) : p.avatarId ? (
                            <MultiplayerAvatar
                              avatarId={p.avatarId}
                              size={26}
                            />
                          ) : isRoomHost ? (
                            <CrownSvg size={15} />
                          ) : (
                            <AvatarSantriSvg
                              gender="girl"
                              accessory="hairbow"
                              mood="happy"
                              size={26}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-black text-[#134E4A] leading-tight">
                            {p.nickname}
                          </p>
                          <span className="block truncate text-[9.5px] font-bold text-[#134E4A]/60">
                            {isRoomHost
                              ? "Host"
                              : isBotPlayer
                                ? "Bot QA"
                                : "Pemain"}
                          </span>
                        </div>

                        {isTartilaAdmin(user?.role) && isBotPlayer && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBot(p.id);
                            }}
                            aria-label={`Hapus bot ${p.nickname}`}
                            className="shrink-0 w-6 h-6 rounded-md border-2 border-[#134E4A] bg-[#FEE2E2] hover:bg-[#EF4444] text-[#DC2626] hover:text-white flex items-center justify-center cursor-pointer"
                          >
                            <TrashSvg size={10} />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#134E4A]/10">
                        {isMe ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#FEF08A] border border-[#134E4A] text-[8.5px] font-black text-[#134E4A] uppercase">
                            Kamu
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-[#134E4A]/45">
                            #{idx + 1}
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border-[1.5px] border-[#134E4A] text-[8.5px] font-black uppercase ${
                            p.is_ready
                              ? "bg-[#10B981] text-white"
                              : "bg-[#F3F4F6] text-[#6B7280]"
                          }`}
                        >
                          {p.is_ready ? (
                            <>
                              <CheckSvg size={10} strokeWidth={3} />
                              <span>SIAP</span>
                            </>
                          ) : (
                            "MENUNGGU"
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ================================================================= */}
        {/* 3. ACTION DOCK UNIVERSAL (TAMPIL DI MOBILE MAUPUN DESKTOP)         */}
        {/* ================================================================= */}
        <div className="fixed bottom-0 inset-x-0 z-40 p-2.5 bg-gradient-to-t from-[#F0FDF4] via-[#F0FDF4]/95 to-transparent">
          <div className="max-w-4xl mx-auto rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFBEB] p-2.5 shadow-[0_-3px_0px_#134E4A,4px_4px_0px_#134E4A] flex items-center justify-between gap-2.5">
            <div className="hidden sm:flex items-center gap-2.5 pl-1">
              <div className="px-2.5 py-1 rounded-xl border-2 border-[#134E4A] bg-[#ECFDF5] font-display font-black text-xs text-[#065F46]">
                {readyCount}/{displayPlayers.length} Siap
              </div>
              <span className="text-xs font-bold text-[#134E4A]/80">
                {isHost
                  ? canStartGame
                    ? "Semua pemain siap! Mulai sekarang."
                    : "Menunggu pemain lain menekan tombol Siap..."
                  : myReady
                    ? "Kamu sudah siap! Menunggu Host memulai..."
                    : "Tekan tombol Siap agar permainan bisa dimulai."}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleToggleReady}
                disabled={pendingReadyRef.current !== null || !myPlayerId}
                className={`flex-1 sm:flex-initial sm:px-5 py-2.5 rounded-xl border-[2.5px] border-[#134E4A] font-display font-black text-xs uppercase shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer ${
                  myReady
                    ? "bg-[#10B981] text-white"
                    : "bg-[#FEF08A] hover:bg-[#FDE047] text-[#134E4A]"
                }`}
              >
                <CheckSvg size={15} />
                <span>{myReady ? "Siap! (Batal)" : "Klik Siap!"}</span>
              </button>

              {isHost && (
                <button
                  type="button"
                  disabled={isStarting || !canStartGame}
                  onClick={handleStartGame}
                  className="flex-1 sm:flex-initial sm:px-6 py-2.5 rounded-xl border-[2.5px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-black text-xs uppercase shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all disabled:bg-gray-300 disabled:text-[#134E4A]/50 disabled:shadow-none flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RocketSvg size={15} />
                  <span>
                    {isStarting
                      ? "Memulai..."
                      : canStartGame
                        ? "Mulai Pertandingan!"
                        : "Menunggu Semua Siap..."}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <MultiplayerSetupSheet
        isOpen={showProfileSheet || !profile}
        defaultName={user?.name || user?.username || ""}
        onClose={() => {
          setShowProfileSheet(false);
          if (!profile) {
            const fallback: MultiplayerProfile = {
              displayName: (user?.name || user?.username || "Santri").slice(
                0,
                12,
              ),
              avatarId: "boy-peci",
            };
            saveMultiplayerProfile(fallback);
            setProfile(fallback);
          }
        }}
        onSave={(p) => {
          saveMultiplayerProfile(p);
          setProfile(p);
          setShowProfileSheet(false);
        }}
      />

      <AnimatePresence>
        {showCountdown && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#134E4A]/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countIndex}
              initial={{ scale: 0.4, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="px-10 py-8 rounded-3xl border-[5px] border-[#134E4A] bg-[#FEF3C7] shadow-[8px_8px_0px_#042F2E] text-center"
            >
              <span
                className={`font-display font-black leading-none block ${
                  countIndex === COUNTDOWN_STEPS.length - 1
                    ? "text-5xl sm:text-7xl text-[#EA580C]"
                    : "text-7xl sm:text-9xl text-[#0D9488]"
                }`}
              >
                {COUNTDOWN_STEPS[countIndex]}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NgajiCeriaLayout>
  );
}
