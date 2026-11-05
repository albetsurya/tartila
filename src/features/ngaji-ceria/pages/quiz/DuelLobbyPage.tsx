import { useMemo } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ChevronLeft,
  RocketSvg,
  CheckSvg,
  CopySvg,
  ZapSvg,
  TargetSvg,
  KeyRoundSvg,
  SparklesSvg,
} from "@/components/ui/CustomIcons";
import { QUIZ_HUB_CATEGORIES, getQuizHubQuestions } from "../../data/quizHubData";
import type { QuestionData } from "../../components/quiz-models/types";
import { fetchWsTicket } from "../../services/arenaApi";
const ARENA_WS_BASE = import.meta.env.VITE_WS_URL?.replace(/^http/, "ws") || "wss://ngaji-tartila.onrender.com";
import { AvatarSantriSvg } from "@/components/ui/Illustrations";
import { duelService, generateDuelCode } from "@/services/duelService";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/tilaEvent";
import { useEconomyStore } from "../../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
import {
  loadMultiplayerProfile,
  MultiplayerAvatar,
  MultiplayerSetupSheet,
  saveMultiplayerProfile,
  type MultiplayerProfile,
} from "../../components/multiplayer/MultiplayerSetupSheet";

const COUNTDOWN_STEPS = ["3", "2", "1", "MULAI!"];
const PLAY_ROUTE = "/arena/duel/play";

/** Ilustrasi Lencana Petir VS Action Neo-Brutalism */
function ActionVsBadgeSvg() {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 overflow-visible"
    >
      {/* Ledakan Bintang Komik */}
      <path
        d="M48 4 L60 22 L82 14 L74 36 L94 48 L74 60 L82 82 L60 74 L48 92 L36 74 L14 82 L22 60 L2 48 L22 36 L14 14 L36 22 Z"
        fill="#EF4444"
        stroke="#134E4A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle
        cx="48"
        cy="48"
        r="22"
        fill="#FEF08A"
        stroke="#134E4A"
        strokeWidth="3.5"
      />
      <text
        x="48"
        y="55"
        textAnchor="middle"
        fontSize="19"
        fontWeight="900"
        fill="#134E4A"
      >
        VS
      </text>
    </svg>
  );
}

function PlayerSlot({
  name,
  roleLabel,
  ready,
  accentBg,
  avatar,
}: {
  name: string;
  roleLabel: string;
  ready: boolean;
  accentBg: string;
  avatar: React.ReactNode;
}) {
  return (
    <div
      className={`relative rounded-2xl border-[3px] border-[#134E4A] p-2.5 flex flex-col items-center gap-1.5 shadow-[3px_3px_0px_#134E4A] transition-all ${
        ready ? "bg-[#ECFDF5]" : "bg-white"
      }`}
    >
      <span className="rounded-md border-[1.5px] border-[#134E4A] bg-white px-1.5 py-0.5 text-[8.5px] font-black uppercase text-[#134E4A]/80">
        {roleLabel}
      </span>

      <div
        className={`flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center overflow-hidden rounded-xl border-[3px] border-[#134E4A] ${accentBg} shadow-[2px_2px_0px_#134E4A]`}
      >
        {avatar}
      </div>

      <p className="max-w-full truncate font-display text-xs sm:text-sm font-black text-[#134E4A]">
        {name}
      </p>

      <span
        className={`inline-flex items-center gap-1 rounded-md border-[2px] border-[#134E4A] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${
          ready
            ? "bg-[#10B981] text-white shadow-[1.5px_1.5px_0px_#134E4A]"
            : "bg-[#FEF08A] text-[#134E4A]"
        }`}
      >
        {ready ? (
          <>
            <CheckSvg size={10} strokeWidth={3} />
            <span>SIAP TEMPUR</span>
          </>
        ) : (
          "MENUNGGU"
        )}
      </span>
    </div>
  );
}

export default function DuelLobbyPage() {
  const { sessionId: routeSessionId } = useParams<{ sessionId: string }>();
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<MultiplayerProfile | null>(() =>
    loadMultiplayerProfile(),
  );
  const [joinedWithCode, setJoinedWithCode] = useState(false);
  const [nickname, setNickname] = useState(
    () => profile?.displayName ?? user?.name ?? user?.username ?? "",
  );
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return routeSessionId && routeSessionId !== "new" ? routeSessionId : null;
  });

  // Tab mode untuk merapatkan UI: "host" (Bagikan Kode) vs "join" (Masuk Kode Teman)
  const [codeTab, setCodeTab] = useState<"host" | "join">("host");

  const storageKey = `tartila:duel:${activeSessionId ?? "default"}:code`;
  const [duelCode, setDuelCode] = useState(() => {
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) return existing;
      const code = generateDuelCode();
      localStorage.setItem(storageKey, code);
      return code;
    } catch {
      return generateDuelCode();
    }
  });

  const lobbySocketRef = useRef<WebSocket | null>(null);
  const duelStartSentRef = useRef(false);
  const gameQuestionsRef = useRef<QuestionData[] | null>(null);
  const [myReady, setMyReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [opponentName, setOpponentName] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countIndex, setCountIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

  const [selectedTheme, setSelectedTheme] = useState<string>("bahasa-arab");

  const consumeTicket = useEconomyStore((s) => s.consumeTicket);
  const [ticketError, setTicketError] = useState(false);

  const startingRef = useRef(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const duelCodeRef = useRef(duelCode);
  useEffect(() => {
    duelCodeRef.current = duelCode;
  }, [duelCode]);

  const myReadyRef = useRef(false);
  useEffect(() => {
    myReadyRef.current = myReady;
  }, [myReady]);

  useEffect(() => {
    if (activeSessionId) return;
    let mounted = true;

    const tryCreate = async (attempt: number): Promise<void> => {
      try {
        const res = await duelService.createDuelSession(
          selectedTheme,
          "kuis",
          duelCodeRef.current,
        );
        if (!mounted) return;
        if (!res.sessionId) {
          setCreateError("Server tidak mengembalikan sessionId.");
          return;
        }
        try {
          localStorage.removeItem("tartila:duel:default:code");
        } catch {
          /* localStorage tidak tersedia */
        }
        setActiveSessionId(res.sessionId);
        if (res.duelCode) setDuelCode(res.duelCode);
        // Host generate full question set for the duel.
        const hostQs = getQuizHubQuestions(
          selectedTheme as any,
          "mcq",
          undefined,
          5,
        ) as QuestionData[];
        gameQuestionsRef.current = hostQs;
        navigate(`/arena/duel/lobby/${res.sessionId}`, { replace: true });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Gagal membuat sesi duel.";
        const isDuplicate = /sudah dipakai|duplicate/i.test(msg);
        if (isDuplicate && attempt === 0) {
          const fresh = generateDuelCode();
          try {
            localStorage.setItem("tartila:duel:default:code", fresh);
          } catch {
            /* localStorage tidak tersedia */
          }
          duelCodeRef.current = fresh;
          setDuelCode(fresh);
          return tryCreate(1);
        }
        if (mounted) setCreateError(msg);
      }
    };

    void tryCreate(0);
    return () => {
      mounted = false;
    };
  }, [activeSessionId, navigate]);

  // Countdown HANYA dipicu aksi eksplisit: Host menekan "Mulai Game"
  // (pesan WS duel_start/game_start di listener di bawah) — bukan logika auto-start.

  // Sinkronisasi status siap lewat WebSocket duel (P1 = Host, P2 = Player).
  useEffect(() => {
    const targetSession =
      activeSessionId || (routeSessionId !== "new" ? routeSessionId : null);
    if (!targetSession || showCountdown) return;

    let closedByUs = false;
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = async () => {
      if (closedByUs) return;
      const playerId = user?.id || nickname || "guest";
      let ticket = "";
      try {
        ticket = await fetchWsTicket();
      } catch {
        /* tiket opsional untuk handshake */
      }
      const query = new URLSearchParams({ playerId, nickname });
      if (ticket) query.set("ticket", ticket);
      try {
        ws = new WebSocket(
          `${ARENA_WS_BASE}/api/ws/duel/${targetSession}?${query.toString()}`,
        );
      } catch {
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        // Socket lobby: host mengirim duel_start beserta soal setelah
        // koneksi benar-benar terbuka (jangan buat WebSocket manual di tombol).
        ws?.send(
          JSON.stringify({
            type: "duel_ready",
            payload: { playerName: nickname, isReady: myReadyRef.current },
          }),
        );
        if (!duelStartSentRef.current) {
          const qs = gameQuestionsRef.current;
          if (qs && qs.length > 0 && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({ type: "duel_start", payload: { questions: qs } }),
            );
            duelStartSentRef.current = true;
          }
        }
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          const payload = msg.payload || {};
          if (
            msg.type === "duel_ready" ||
            msg.type === "opponent_ready" ||
            msg.type === "ready_changed"
          ) {
            setOpponentReady(Boolean(payload.isReady));
            if (payload.playerName) {
              setOpponentName(String(payload.playerName));
            }
          } else if (msg.type === "duel_started" || msg.type === "game_started") {
            // Hanya server yang berhak memicu start. Sinkronkan daftar soal
            // (dari payload) bila daftar lokal masih kosong.
            if (
              Array.isArray(payload.questions) &&
              payload.questions.length > 0 &&
              gameQuestionsRef.current?.length === 0
            ) {
              gameQuestionsRef.current = payload.questions as QuestionData[];
            }
          }
        } catch {
          /* pesan non-JSON diabaikan */
        }
      };

      ws.onclose = () => {
        if (wsRef.current === ws) wsRef.current = null;
        if (!closedByUs) {
          reconnectTimer = setTimeout(connect, 2000);
        }
      };
      ws.onerror = () => {
        ws?.close();
      };
    };

    void connect();

    return () => {
      closedByUs = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (wsRef.current === ws) {
        wsRef.current?.close();
        wsRef.current = null;
      }
    };
  }, [activeSessionId, routeSessionId, showCountdown, user?.id, nickname]);

  const handleJoinWithCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (cleanCode.length < 4) return;
    setJoinedWithCode(true);
    setJoinLoading(true);
    setJoinError("");

    try {
      const res = await duelService.joinDuelSession(cleanCode);
      soundManager.playSfx("tap");
      setActiveSessionId(res.sessionId);
      if (cleanCode) setDuelCode(cleanCode);
      if (Array.isArray(res.questions)) {
        const joinedQs = res.questions as QuestionData[];
        gameQuestionsRef.current = joinedQs;
      }
      setOpponentName(res.hostName || "Host");
      navigate(`/arena/duel/lobby/${res.sessionId}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Kode duel tidak ditemukan atau room sudah penuh";
      setJoinError(msg);
    } finally {
      setJoinLoading(false);
    }
  };

  useEffect(() => {
    if (joinedWithCode) return;
    setNickname(
      (prev) =>
        prev || profile?.displayName || user?.name || user?.username || "",
    );
  }, [profile, user?.name, user?.username, joinedWithCode]);

  useEffect(() => {
    if (!showCountdown) return;
    if (countIndex >= COUNTDOWN_STEPS.length) {
      if (startingRef.current) return;
      startingRef.current = true;
      const targetSession = activeSessionId || routeSessionId || "";
      void consumeTicket().then((ok) => {
        if (!ok) {
          setShowCountdown(false);
          setTicketError(true);
          return;
        }
        navigate(
          `${PLAY_ROUTE}/${targetSession}?theme=${selectedTheme}`,
          {
            state: {
              questions: gameQuestionsRef.current,
              isHost: !joinedWithCode,
            },
          },
        );
      });
      return;
    }
    soundManager.playSfx("pop");
    const timer = setTimeout(() => setCountIndex((i) => i + 1), 1000);
    return () => clearTimeout(timer);
  }, [
    showCountdown,
    countIndex,
    navigate,
    activeSessionId,
    routeSessionId,
    consumeTicket,
  ]);

  const handleReady = () => {
    triggerBibiReaction("click");
    soundManager.playSfx("tap");
    const next = !myReady;
    setMyReady(next);
    wsRef.current?.send(
      JSON.stringify({
        type: "duel_ready",
        payload: { playerName: nickname, isReady: next },
      }),
    );
  };

  const handleCopyCode = async () => {
    triggerBibiReaction("click");
    soundManager.playSfx("tap");
    try {
      await navigator.clipboard.writeText(duelCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard tidak tersedia */
    }
  };

  const isGo = countIndex === COUNTDOWN_STEPS.length - 1;
  const readyTotal = (myReady ? 1 : 0) + (opponentReady ? 1 : 0);
  const canStart = myReady && opponentReady;

  return (
    <div className="relative min-h-dvh bg-[#F0FDF4] text-[#134E4A] font-sans overflow-x-hidden">
      {/* Latar Action Halftone + Diagonal Speed Lines */}
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

      <div className="relative z-10">
        <ConfirmDialog
          isOpen={showExitConfirm}
          title="Keluar dari Lobi Duel?"
          description="Sesi duel ini akan dibatalkan dan kamu akan kembali ke menu utama."
          isDestructive={true}
          onConfirm={() => {
            setShowExitConfirm(false);
            try {
              Object.keys(localStorage)
                .filter((k) => k.startsWith("tartila:duel:"))
                .forEach((k) => localStorage.removeItem(k));
            } catch {
              /* localStorage tidak tersedia */
            }
            navigate("/member/ngaji-ceria/games");
          }}
          onCancel={() => setShowExitConfirm(false)}
        />

        {/* Header Ringkas */}
        <header className="sticky top-0 z-20 border-b-[3px] border-[#134E4A] bg-white shadow-[0_2px_0_#134E4A]">
          <div className="mx-auto flex h-13 max-w-lg items-center gap-2.5 px-3 sm:px-4">
            <button
              type="button"
              onClick={() => {
                triggerBibiReaction("click");
                soundManager.playSfx("tap");
                setShowExitConfirm(true);
              }}
              aria-label="Kembali"
              className="flex h-9 w-9 items-center justify-center rounded-xl border-[2.5px] border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h1 className="font-display font-black text-sm sm:text-base text-[#134E4A] leading-none">
                Arena Duel 1v1
              </h1>
              <span className="text-[10px] font-bold text-[#134E4A]/65">
                Adu cepat & tepat secara real-time
              </span>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-[10px] font-black uppercase text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]">
              <ZapSvg size={11} />
              <span>{readyTotal}/2 Siap</span>
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-3 sm:px-4 pt-3 pb-10 space-y-3">
          {createError && (
            <div className="rounded-2xl border-[3px] border-[#B91C1C] bg-[#FEE2E2] p-3 text-[11px] font-bold text-[#B91C1C] shadow-[3px_3px_0px_#B91C1C]">
              {createError}
            </div>
          )}
          {/* =============================================================== */}
          {/* 1. KARTU TIKET TERPADU (UNDANG TEMAN / MASUK KODE LAWAN)        */}
          {/* =============================================================== */}
          <section className="rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FEF3C7] p-3 shadow-[4px_4px_0px_#134E4A] space-y-2.5">
            {/* Segmented Switch */}
            <div className="grid grid-cols-2 gap-1.5 rounded-xl border-[2.5px] border-[#134E4A] bg-white p-1">
              <button
                type="button"
                onClick={() => setCodeTab("host")}
                className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-display text-[11px] font-black uppercase transition-all cursor-pointer ${
                  codeTab === "host"
                    ? "bg-[#0D9488] text-white border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]"
                    : "text-[#134E4A]/70 hover:text-[#134E4A]"
                }`}
              >
                <TargetSvg size={12} />
                <span>Kode Roommu</span>
              </button>
              <button
                type="button"
                onClick={() => setCodeTab("join")}
                className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-display text-[11px] font-black uppercase transition-all cursor-pointer ${
                  codeTab === "join"
                    ? "bg-[#EA580C] text-white border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]"
                    : "text-[#134E4A]/70 hover:text-[#134E4A]"
                }`}
              >
                <KeyRoundSvg size={12} />
                <span>Masuk Kode Teman</span>
              </button>
            </div>

            {codeTab === "host" ? (
              <div className="flex items-center justify-between gap-2 rounded-xl border-[2.5px] border-[#134E4A] bg-white px-3 py-2 shadow-[2.5px_2.5px_0px_#134E4A]">
                <div className="min-w-0">
                  <span className="block text-[8.5px] font-black uppercase tracking-wider text-[#0D9488]">
                    Bagikan Kode Ini ke Lawan:
                  </span>
                  <p className="font-display text-2xl font-black tracking-[0.16em] text-[#134E4A] select-all leading-tight">
                    {duelCode}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border-[2.5px] border-[#134E4A] text-xs font-black shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
                    copied
                      ? "bg-[#10B981] text-white"
                      : "bg-[#FEF08A] hover:bg-[#FDE047] text-[#134E4A]"
                  }`}
                >
                  {copied ? <CheckSvg size={14} /> : <CopySvg size={14} />}
                  <span>{copied ? "Tersalin!" : "Salin"}</span>
                </button>
              </div>
            ) : (
              <div>
                <form
                  onSubmit={handleJoinWithCode}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="KETIK KODE LAWAN"
                    value={joinCodeInput}
                    onChange={(e) =>
                      setJoinCodeInput(e.target.value.toUpperCase())
                    }
                    className="flex-1 rounded-xl border-[2.5px] border-[#134E4A] bg-white px-3 py-2 font-display text-sm font-black tracking-widest text-[#134E4A] uppercase placeholder:text-[#134E4A]/35 shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={joinCodeInput.trim().length < 4 || joinLoading}
                    className="shrink-0 py-2.5 px-4 rounded-xl border-[2.5px] border-[#134E4A] bg-[#EA580C] hover:bg-[#C2410C] text-white font-black text-xs shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {joinLoading ? "Masuk..." : "Gabung!"}
                  </button>
                </form>
                {joinError && (
                  <p className="mt-1.5 text-[11px] font-bold text-[#B91C1C]">
                    {joinError}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* =============================================================== */}
          {/* TEMA DUEL 1V1                                                   */}
          {/* =============================================================== */}
          <section className="rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FEF08A] p-3 shadow-[4px_4px_0px_#134E4A] space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b-[2px] border-dashed border-[#134E4A]/20">
              <div className="flex items-center gap-1.5">
                <SparklesSvg size={14} />
                <span className="font-display text-xs font-black uppercase text-[#134E4A]">
                  Pilih Tema Duel
                </span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg border-2 border-[#134E4A] bg-white text-[11px] font-black text-[#0D9488]">
                {QUIZ_HUB_CATEGORIES.find((c) => c.id === selectedTheme)?.title || "Bahasa Arab"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 max-h-36 overflow-y-auto p-0.5">
              {QUIZ_HUB_CATEGORIES.map((cat) => {
                const isSelected = selectedTheme === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedTheme(cat.id)}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 p-1.5 text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#134E4A] bg-[#134E4A] text-[#FEF08A] shadow-[2px_2px_0px_#042F2E]"
                        : "border-[#134E4A]/30 bg-white hover:bg-[#FEF3C7] text-[#134E4A]"
                    }`}
                  >
                    <span className="text-[10.5px] font-black line-clamp-1">
                      {cat.title}
                    </span>
                    <span className="text-[8.5px] opacity-80 line-clamp-1">
                      {cat.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* =============================================================== */}
          {/* 2. PANGGUNG PERTARUNGAN 1V1 + TOMBOL AKSI SIAP TERPADU          */}
          {/* =============================================================== */}
          <section className="relative overflow-hidden rounded-2xl border-[3.5px] border-[#134E4A] bg-white p-3.5 sm:p-4 shadow-[5px_5px_0px_#134E4A] space-y-3.5">
            {/* Banner Status Pertarungan */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b-[2px] border-dashed border-[#134E4A]/20">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981] border border-[#134E4A]" />
                </span>
                <h2 className="font-display text-xs sm:text-sm font-black uppercase tracking-wide text-[#134E4A]">
                  Panggung Petarung Kuis
                </h2>
              </div>

              <span className="text-[10.5px] font-bold text-[#0D9488]">
                {opponentReady ? "Lawan telah masuk!" : "Menunggu lawan..."}
              </span>
            </div>

            {/* Grid P1 VS P2 (P1 selalu Host, P2 selalu pemain yang masuk kode) */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <PlayerSlot
                name={
                  joinedWithCode
                    ? opponentName ?? "Menunggu Host..."
                    : profile?.displayName ?? nickname ?? "Kamu"
                }
                roleLabel={joinedWithCode ? "P1 · Host" : "P1 · Kamu"}
                ready={joinedWithCode ? opponentReady : myReady}
                accentBg="bg-[#FEF08A]"
                avatar={
                  joinedWithCode ? (
                    opponentReady ? (
                      <AvatarSantriSvg
                        gender="boy"
                        accessory="peci"
                        mood="happy"
                        size={64}
                      />
                    ) : (
                      <span className="font-display text-3xl font-black text-[#134E4A]/35 animate-pulse">
                        ?
                      </span>
                    )
                  ) : profile ? (
                    <MultiplayerAvatar avatarId={profile.avatarId} size={64} />
                  ) : (
                    <AvatarSantriSvg
                      gender="boy"
                      accessory="peci"
                      mood={myReady ? "happy" : "idle"}
                      size={64}
                    />
                  )
                }
              />

              <div className="flex flex-col items-center justify-center">
                <ActionVsBadgeSvg />
              </div>

              <PlayerSlot
                name={
                  joinedWithCode
                    ? profile?.displayName ?? nickname ?? "Kamu"
                    : opponentName ?? "Menunggu..."
                }
                roleLabel={joinedWithCode ? "P2 · Kamu" : "P2 · Lawan"}
                ready={joinedWithCode ? myReady : opponentReady}
                accentBg={joinedWithCode ? "bg-[#FEF08A]" : "bg-[#FECDD3]"}
                avatar={
                  joinedWithCode ? (
                    profile ? (
                      <MultiplayerAvatar avatarId={profile.avatarId} size={64} />
                    ) : (
                      <AvatarSantriSvg
                        gender="girl"
                        accessory="hairbow"
                        mood="happy"
                        size={64}
                      />
                    )
                  ) : opponentReady ? (
                    <AvatarSantriSvg
                      gender="girl"
                      accessory="hairbow"
                      mood="happy"
                      size={64}
                    />
                  ) : (
                    <span className="font-display text-3xl font-black text-[#134E4A]/35 animate-pulse">
                      ?
                    </span>
                  )
                }
              />
            </div>

            {/* Tombol Aksi: Siap (semua) + Mulai Game (khusus Host) */}
            <div className="pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleReady}
                className={`w-full py-3 px-4 rounded-xl border-[3px] border-[#134E4A] font-display font-black text-sm uppercase tracking-wide shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  myReady
                    ? "bg-gray-200 text-[#134E4A]/70"
                    : "bg-[#FDE047] hover:bg-[#FACC15] text-[#134E4A]"
                }`}
              >
                <CheckSvg size={16} />
                <span>
                  {myReady ? "Terkunci (Siap)" : "Siap Tempur!"}
                </span>
              </button>

              {!joinedWithCode && (
                <button
                  type="button"
                  disabled={!canStart || Boolean(ticketError)}
                  onClick={() => {
                    triggerBibiReaction("click");
                    soundManager.playSfx("tap");
                    if (joinedWithCode) return; // Host (pembuat sesi) yang mulai
                    setShowCountdown(true);
                  }}
                  className={`w-full py-3 px-4 rounded-xl border-[3px] border-[#134E4A] font-display font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                    canStart
                      ? "bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none cursor-pointer"
                      : "bg-gray-200 text-[#134E4A]/50 shadow-none disabled:cursor-not-allowed"
                  }`}
                >
                  <RocketSvg size={18} />
                  <span>
                    {canStart ? "MULAI PERTARUNGAN!" : "Menunggu Semua Siap..."}
                  </span>
                </button>
              )}

              {myReady && joinedWithCode && (
                <p className="mt-1 text-center text-[11px] font-bold text-[#134E4A]/65">
                  Menunggu Host menekan tombol Mulai Game...
                </p>
              )}
              {myReady && !joinedWithCode && !canStart && (
                <p className="mt-1 text-center text-[11px] font-bold text-[#134E4A]/65">
                  Menunggu lawan menandai siap, lalu tekan Mulai Game.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Countdown Overlay */}
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
                  isGo
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

      {/* Modal Tiket Habis */}
      <AnimatePresence>
        {ticketError && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#134E4A]/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="w-full max-w-sm rounded-3xl border-[4px] border-[#134E4A] bg-[#FEF3C7] p-5 text-center shadow-[6px_6px_0px_#134E4A]"
            >
              <span className="inline-flex items-center rounded-lg border-2 border-[#134E4A] bg-[#FEE2E2] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#B91C1C] shadow-[1.5px_1.5px_0px_#134E4A]">
                Tiket Bermain Habis
              </span>
              <p className="mt-3 font-display text-sm font-bold text-[#134E4A]/80">
                Tunggu 6 jam atau beli tiket tambahan di Warung Santri.
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerBibiReaction("click");
                  soundManager.playSfx("tap");
                  navigate("/member/ngaji-ceria/warung-santri");
                }}
                className="mt-4 w-full py-2.5 rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-xs shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                Beli di Warung Santri
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerBibiReaction("click");
                  soundManager.playSfx("tap");
                  navigate("/member/ngaji-ceria/games");
                }}
                className="mt-2 w-full py-2.5 rounded-xl border-[3px] border-[#134E4A] bg-[#FEF08A] hover:bg-[#FDE047] text-[#134E4A] font-black text-xs shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                Kembali ke Game
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MultiplayerSetupSheet
        isOpen={!profile}
        defaultName={user?.name || user?.username || ""}
        onClose={() => {
          const fallback = {
            displayName: (user?.name || user?.username || "Santri").slice(
              0,
              12,
            ),
            avatarId: "boy-peci",
          };
          saveMultiplayerProfile(fallback);
          setProfile(fallback);
          setNickname(fallback.displayName);
        }}
        onSave={(p) => {
          saveMultiplayerProfile(p);
          setProfile(p);
          setNickname(p.displayName);
        }}
      />
    </div>
  );
}
