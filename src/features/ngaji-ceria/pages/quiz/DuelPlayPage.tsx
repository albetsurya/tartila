import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { QuizEngine } from "../../components/quiz-models/QuizEngine";
import { duelService } from "@/services/duelService";
import { fetchWsTicket } from "../../services/arenaApi";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/tilaEvent";
import { StickerButton } from "@/components/ui/StickerButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ClockSvg,
  WhatsAppSvg,
  ZapSvg,
  FireSvg,
  ChevronLeftSvg,
} from "@/components/ui/CustomIcons";
import type { QuestionData } from "../../components/quiz-models/types";
import { useAuth } from "@/contexts/AuthContext";
import { useBotSimulator } from "../../hooks/useBotSimulator";
import LeaderboardModal, {
  type LeaderboardEntry,
} from "@/features/ngaji-ceria/components/quiz-models/LeaderboardModal";

const QUESTION_TIME = 20;
const ARENA_WS_BASE =
  import.meta.env.VITE_WS_URL?.replace(/^http/, "ws") ||
  "wss://ngaji-tartila.onrender.com";

/** Ilustrasi Latar Action Burst & Elemen Neo-Brutalism */
function ActionArenaBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Halftone Dots */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#0D9488 2px, transparent 2px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Diagonal Action Speed Lines */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #134E4A 0px, #134E4A 2px, transparent 2px, transparent 18px)",
        }}
      />
      {/* Ornamen Petir & Bintang Sudut */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        className="absolute -top-4 -left-4 w-28 h-28 opacity-25"
      >
        <path
          d="M68 10 L30 62 H60 L48 110 L94 52 H62 L68 10 Z"
          fill="#FACC15"
          stroke="#134E4A"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        className="absolute -bottom-6 -right-4 w-32 h-32 opacity-20"
      >
        <path
          d="M60 12 L73 42 L106 46 L80 68 L88 100 L60 82 L32 100 L40 68 L14 46 L47 42 Z"
          fill="#FF6B6B"
          stroke="#134E4A"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Ilustrasi Medali / Piala Hasil Akhir Duel */
function DuelResultBadgeSvg({ result }: { result: "win" | "lose" | "draw" }) {
  const mainFill =
    result === "win" ? "#FACC15" : result === "lose" ? "#FF6B6B" : "#38BDF8";
  return (
    <svg
      viewBox="0 0 140 110"
      fill="none"
      className="mx-auto w-28 h-22 overflow-visible"
    >
      {/* Efek Ledakan Komik Belakang */}
      <path
        d="M70 4 L84 22 L108 12 L102 36 L128 44 L108 62 L122 84 L96 84 L90 106 L70 90 L50 106 L44 84 L18 84 L32 62 L12 44 L38 36 L32 12 L56 22 Z"
        fill="#FEF08A"
        stroke="#134E4A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Lingkaran Inti */}
      <circle
        cx="70"
        cy="56"
        r="28"
        fill={mainFill}
        stroke="#134E4A"
        strokeWidth="4"
      />
      {result === "win" ? (
        <path
          d="M54 64 L58 44 L70 54 L82 44 L86 64 H54 Z"
          fill="#FFFBEB"
          stroke="#134E4A"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      ) : result === "lose" ? (
        <path
          d="M60 46 L80 66 M80 46 L60 66"
          stroke="#FFFBEB"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M56 50 H84 M56 62 H84"
          stroke="#FFFBEB"
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function DuelPlayPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const themeParam = searchParams.get("theme") || "bahasa-arab";
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<QuestionData[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hostScore, setHostScore] = useState(0);
  const [guestScore, setGuestScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [serverWinnerId, setServerWinnerId] = useState<string | null>(null);
  const [isServerDraw, setIsServerDraw] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timeLimit, setTimeLimit] = useState(QUESTION_TIME);
  const [answered, setAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const [, setGameStarted] = useState(false);
  const [isHost, setIsHost] = useState(true);
  const [gamePhase, setGamePhase] = useState<
    "COUNTDOWN" | "QUESTION_ACTIVE" | "REVEAL_ANSWER" | "LEADERBOARD" | "RESULT"
  >("COUNTDOWN");
  const [leaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now(),
  );
  const [, setTimeTakenMs] = useState<number>(0);

  // Bot simulator — superadmin QA
  useBotSimulator();

  const hostScoreRef = useRef(0);
  const guestScoreRef = useRef(0);
  const myScoreRef = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    duelService
      .getDuelSession(sessionId)
      .then((sess) => {
        if (sess && user) {
          setIsHost(sess.hostId === user.id);
        }
      })
      .catch(() => {
        // fallback: anggap host
      });
  }, [sessionId, user]);

  useEffect(() => {
    setGamePhase("QUESTION_ACTIVE");
    setQuestionStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const playerId = user?.id || "guest";
    const nickname = user?.name || user?.username || "Pemain";

    let socket: WebSocket | null = null;
    let closedByUs = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = async () => {
      const ticket = await fetchWsTicket();
      if (closedByUs) return;
      const query = new URLSearchParams({ playerId, nickname });
      if (ticket) query.set("ticket", ticket);
      const url = `${ARENA_WS_BASE}/api/ws/duel/${sessionId}?${query.toString()}`;
      try {
        socket = new WebSocket(url);
        wsRef.current = socket;
      } catch {
        return;
      }

      socket.onopen = () => {
        if (isHost) {
          socket?.send(JSON.stringify({ type: "duel_start", payload: {} }));
        }
        setGameStarted(true);
      };

      socket.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === "opponent_score_update") {
            const score = Number(msg.payload?.score ?? 0);
            setOpponentScore(score);
          } else if (msg.type === "duel_start" || msg.type === "game_start") {
            const payload = msg.payload || {};
            if (Array.isArray(payload.questions)) {
              setQuestions(payload.questions as QuestionData[]);
              setCurrentQuestionIndex(0);
              setTimeLeft(QUESTION_TIME);
              setTimeLimit(QUESTION_TIME);
              setQuestionStartTime(Date.now());
              setAnswered(false);
              setResultReady(false);
              setGamePhase("QUESTION_ACTIVE");
              setShowLeaderboard(false);
            }
          } else if (msg.type === "duel_started" || msg.type === "game_started") {
            setGameStarted(true);
          } else if (msg.type === "match.finished" || msg.type === "game_finished") {
            const payload = msg.payload;
            if (payload?.winnerId) {
              setServerWinnerId(payload.winnerId);
            } else if (payload?.isDraw || payload?.outcome === "draw") {
              setIsServerDraw(true);
            }
            setIsFinished(true);
            setResultReady(true);
          }
        } catch {
          // abaikan pesan non-JSON
        }
      };

      socket.onclose = () => {
        wsRef.current = null;
        if (!closedByUs && !isFinished) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    void connect();

    return () => {
      closedByUs = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [sessionId, user?.id, user?.name, user?.username, isFinished, isHost]);

  const pushScoreToOpponent = (newScore: number) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "submit_score", score: newScore }));
    }
  };

  const finishDuel = async () => {
    setIsFinished(true);
    const finalMyScore = myScoreRef.current;
    try {
      await duelService.submitDuelScore(sessionId ?? "", finalMyScore);
      const sess = await duelService.getDuelSession(sessionId ?? "");
      if (sess) {
        if (sess.winnerId) {
          setServerWinnerId(sess.winnerId);
        } else if (sess.status === "finished") {
          setIsServerDraw(true);
        }
      }
    } catch {
      // Tetap tampilkan hasil lokal
    } finally {
      setResultReady(true);
    }
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "duel_finish", payload: {} }));
    }
  };

  const advanceRef = useRef<() => void>(() => {});
  advanceRef.current = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      void finishDuel();
      return;
    }
    setCurrentQuestionIndex((i) => i + 1);
    setTimeLeft(QUESTION_TIME);
    setTimeLimit(QUESTION_TIME);
    setQuestionStartTime(Date.now());
    setAnswered(false);
    setResultReady(false);
    setGamePhase("QUESTION_ACTIVE");
  };

  useEffect(() => {
    if (gamePhase !== "QUESTION_ACTIVE" || isFinished || answered) return;
    if (timeLeft <= 0) {
      setGamePhase("REVEAL_ANSWER");
      return;
    }
    const timer = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [gamePhase, timeLeft, isFinished, answered]);

  const handleAnswer = (isCorrect: boolean) => {
    if (answered || isFinished) return;
    const elapsedMs = Date.now() - questionStartTime;
    const takenMs = Math.min(elapsedMs, timeLimit * 1000);
    setTimeTakenMs(takenMs);
    setAnswered(true);
    setGamePhase("REVEAL_ANSWER");

    if (isCorrect) {
      const sisa = timeLimit * 1000 - takenMs;
      const awarded = Math.max(
        0,
        Math.round((sisa / (timeLimit * 1000)) * 1000),
      );
      if (isHost) {
        hostScoreRef.current += awarded;
        setHostScore(hostScoreRef.current);
        myScoreRef.current = hostScoreRef.current;
      } else {
        guestScoreRef.current += awarded;
        setGuestScore(guestScoreRef.current);
        myScoreRef.current = guestScoreRef.current;
      }
      pushScoreToOpponent(myScoreRef.current);
    }
  };

  const handleNext = () => {
    soundManager.playSfx("tap");
    advanceRef.current();
  };

  const currentQuestion = questions[currentQuestionIndex] ?? questions[0];
  const myScore = isHost ? hostScore : guestScore;
  const totalScore = myScore + opponentScore;
  const myPowerPercent =
    totalScore === 0
      ? 50
      : Math.min(88, Math.max(12, Math.round((myScore / totalScore) * 100)));

  const result: "win" | "lose" | "draw" = useMemo(() => {
    if (serverWinnerId) {
      return serverWinnerId === user?.id ? "win" : "lose";
    }
    if (isServerDraw) {
      return "draw";
    }
    return myScore > opponentScore
      ? "win"
      : myScore < opponentScore
        ? "lose"
        : "draw";
  }, [serverWinnerId, isServerDraw, user?.id, myScore, opponentScore]);
  const resultTitle =
    result === "win"
      ? "KAMU MENANG!"
      : result === "lose"
        ? "KAMU KALAH"
        : "DUEL SERI!";
  const resultColor =
    result === "win"
      ? "text-[#0D9488]"
      : result === "lose"
        ? "text-[#EF4444]"
        : "text-[#134E4A]";

  const resultMessage =
    result === "win"
      ? "Aku menang"
      : result === "lose"
        ? "Aku kalah"
        : "Kita seri";

  const handleShareWhatsApp = () => {
    triggerBibiReaction("click");
    soundManager.playSfx("tap");
    const text = `Aku baru saja selesai Duel Kuis Tartila! Skor akhirku: ${myScore}, Skor Lawan: ${opponentScore}. ${resultMessage}! Ayo tantang aku di Tartila!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  useEffect(() => {
    if (!isFinished) return;
    if (result === "win") {
      soundManager.playSfx("game-winner");
    } else if (result === "lose") {
      soundManager.playSfx("game-over");
    }
    triggerBibiReaction(
      result === "win" ? "success" : result === "lose" ? "error" : "click",
    );
  }, [isFinished, result]);

  const isLowTime = timeLeft <= 5;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#F0FDF4] font-sans text-[#134E4A]">
      <ActionArenaBackground />

      {/* =================================================================== */}
      {/* COMPACT BATTLE HUD HEADER (SKOR + TIMER TERPADU + TUG-OF-WAR BAR)    */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-30 border-b-[3px] border-[#134E4A] bg-[#FEF3C7] shadow-[0_3px_0_#134E4A]">
        <div className="mx-auto max-w-md px-3 pt-2 pb-2 space-y-1.5">
          <div className="flex items-center justify-between pb-0.5">
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="inline-flex items-center gap-1 text-[11px] font-black text-[#134E4A] hover:underline cursor-pointer"
            >
              <ChevronLeftSvg size={14} />
              <span>Keluar</span>
            </button>
            <span className="text-[10px] font-black uppercase text-[#134E4A]/70">
              Duel 1v1
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            {/* Skor Kamu */}
            <div className="flex items-center justify-between rounded-xl border-[2.5px] border-[#134E4A] bg-[#FEF08A] px-2.5 py-1.5 shadow-[2.5px_2.5px_0px_#134E4A]">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#134E4A]/70 leading-none">
                  <ZapSvg size={10} />
                  <span>Kamu</span>
                </span>
                <span className="font-display text-lg sm:text-xl font-black leading-tight text-[#134E4A]">
                  {myScore}
                </span>
              </div>
              <span className="rounded-md border-[1.5px] border-[#134E4A] bg-white px-1.5 py-0.5 text-[9px] font-black text-[#0D9488]">
                P1
              </span>
            </div>

            {/* Badge VS + Timer Terpadu */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center gap-1 rounded-xl border-[3px] border-[#134E4A] px-2.5 py-1 shadow-[2.5px_2.5px_0px_#134E4A] transition-colors ${
                  isLowTime
                    ? "bg-[#FEE2E2] text-[#DC2626] animate-pulse"
                    : "bg-white text-[#134E4A]"
                }`}
              >
                <ClockSvg size={14} />
                <span className="font-display text-base font-black leading-none tabular-nums">
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Skor Lawan */}
            <div className="flex items-center justify-between rounded-xl border-[2.5px] border-[#134E4A] bg-[#FF6B6B] px-2.5 py-1.5 text-white shadow-[2.5px_2.5px_0px_#134E4A]">
              <span className="rounded-md border-[1.5px] border-[#134E4A] bg-white/95 px-1.5 py-0.5 text-[9px] font-black text-[#EF4444]">
                P2
              </span>
              <div className="min-w-0 text-right">
                <span className="inline-flex items-center justify-end gap-1 text-[9px] font-black uppercase tracking-wider text-white/85 leading-none">
                  <span>Lawan</span>
                  <FireSvg size={10} />
                </span>
                <span className="font-display text-lg sm:text-xl font-black leading-tight text-white">
                  {opponentScore}
                </span>
              </div>
            </div>
          </div>

          {/* Live Tug-of-War Power Bar + Indikator Soal & Timer Progress */}
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded-lg border-2 border-[#134E4A] bg-[#0D9488] px-2 py-0.5 font-display text-[10px] font-black uppercase text-white shadow-[1.5px_1.5px_0px_#134E4A]">
              Soal {currentQuestionIndex + 1}/{questions.length}
            </span>

            {/* Bar Tarik Tambang Skor (Tug of War) */}
            <div className="relative flex-1 h-3 rounded-full border-2 border-[#134E4A] bg-[#FF6B6B] overflow-hidden shadow-[1.5px_1.5px_0px_#134E4A]">
              <div
                className="h-full bg-[#FACC15] border-r-2 border-[#134E4A] transition-all duration-500"
                style={{ width: `${myPowerPercent}%` }}
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase tracking-widest text-[#134E4A]">
                VS POWER
              </span>
            </div>
          </div>

          {/* Bar Waktu Tipis Terintegrasi */}
          <div className="h-1.5 w-full rounded-full border border-[#134E4A] bg-white overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isLowTime ? "bg-[#EF4444]" : "bg-[#0D9488]"
              }`}
              style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* AREA KUIS UTAMA (RINGKAS TANPA ELEMEN DUPLIKAT)                      */}
      {/* =================================================================== */}
      <main className="relative z-10 mx-auto w-full max-w-md px-3.5 py-3">
        <QuizEngine
          key={`${currentQuestionIndex}-${currentQuestion.id}`}
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          onAnswerSubmit={handleAnswer}
          onNext={handleNext}
        />
      </main>

      {/* =================================================================== */}
      {/* MODAL HASIL AKHIR DUEL                                               */}
      {/* =================================================================== */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#134E4A]/90 p-4 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border-[4px] border-[#134E4A] bg-[#FFFBEB] p-5 text-center shadow-[6px_6px_0px_#042F2E]"
            >
              <DuelResultBadgeSvg result={result} />

              <h2
                className={`mt-2 font-display text-2xl sm:text-3xl font-black ${resultColor}`}
              >
                {resultTitle}
              </h2>
              <p className="text-xs font-bold text-[#134E4A]/70">
                Pertarungan selesai! Berikut perolehan skor akhir:
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] p-3 shadow-[3px_3px_0px_#134E4A]">
                  <p className="inline-flex items-center gap-1 font-display text-[10px] font-black uppercase text-[#134E4A]/70">
                    <ZapSvg size={11} />
                    <span>Skor Kamu</span>
                  </p>
                  <p className="font-display text-2xl sm:text-3xl font-black text-[#134E4A]">
                    {myScore}
                  </p>
                </div>
                <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FF6B6B] p-3 shadow-[3px_3px_0px_#134E4A]">
                  <p className="inline-flex items-center gap-1 font-display text-[10px] font-black uppercase text-white/85">
                    <FireSvg size={11} />
                    <span>Skor Lawan</span>
                  </p>
                  <p className="font-display text-2xl sm:text-3xl font-black text-white">
                    {opponentScore}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <StickerButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="border-[#134E4A] bg-[#FEF08A] hover:bg-[#FDE047] text-[#134E4A] shadow-[3px_3px_0px_#134E4A]"
                  onClick={() => {
                    triggerBibiReaction("click");
                    soundManager.playSfx("tap");
                    navigate(`/arena/duel/lobby/${sessionId}`);
                  }}
                >
                  Tanding Ulang (Kembali ke Lobi)
                </StickerButton>

                {resultReady && (
                  <StickerButton
                    variant="secondary"
                    size="lg"
                    fullWidth
                    className="border-[#134E4A] bg-[#25D366] text-white shadow-[3px_3px_0px_#134E4A]"
                    onClick={handleShareWhatsApp}
                  >
                    <WhatsAppSvg size={18} />
                    Bagikan Hasil ke WhatsApp
                  </StickerButton>
                )}

                <StickerButton
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    triggerBibiReaction("click");
                    soundManager.playSfx("tap");
                    navigate("/member/ngaji-ceria/games");
                  }}
                >
                  Kembali ke Menu Game
                </StickerButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LeaderboardModal
        entries={leaderboard}
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        autoAdvance
        advanceAfterMs={5000}
      />

      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Keluar dari Duel?"
        description="Yakin ingin keluar dari sesi ini? Kamu tidak akan mengikuti pertandingan ini lagi."
        isDestructive={true}
        onConfirm={() => {
          setShowExitConfirm(false);
          if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
          }
          navigate("/member/ngaji-ceria/games");
        }}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
}
