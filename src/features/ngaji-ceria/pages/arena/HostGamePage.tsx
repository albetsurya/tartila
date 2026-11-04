import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Volume2,
  TrophySvg,
  AlertCircle,
  CheckSvg,
  LightbulbSvg,
  KeyRoundSvg,
  ArrowRightSvg,
  AlertTriangleSvg,
} from "@/components/ui/CustomIcons";
import { ArenaSocket } from "../../services/arenaSocket";
import { arenaRoomService } from "@/services/arenaRoomService";
import { clearBotSimulatorState } from "../../hooks/useBotSimulator";
import { getAudioUrl } from "../../utils/audioUrl";
import LeaderboardModal from "@/features/ngaji-ceria/components/quiz-models/LeaderboardModal";
import { getQuizHubQuestions } from "../../data/quizHubData";

const OPTION_STYLES = [
  {
    bg: "bg-[#EF4444]",
    badgeBg: "bg-[#FEE2E2]",
    text: "text-white",
  },
  {
    bg: "bg-[#3B82F6]",
    badgeBg: "bg-[#DBEAFE]",
    text: "text-white",
  },
  {
    bg: "bg-[#F59E0B]",
    badgeBg: "bg-[#FEF3C7]",
    text: "text-[#134E4A]",
  },
  {
    bg: "bg-[#10B981]",
    badgeBg: "bg-[#D1FAE5]",
    text: "text-white",
  },
];

const OPTION_LABELS = ["A", "B", "C", "D"];

/* ============================================================================
   CUSTOM NEO-BRUTALIST HOST ARENA ILLUSTRATIONS (NO EMOJIS)
   ============================================================================ */

/** 1. Ilustrasi Lencana Panggung Kuis pada Card Soal */
const HostStageBannerSvg = () => (
  <svg
    viewBox="0 0 110 72"
    fill="none"
    className="hidden sm:block w-24 h-16 shrink-0 overflow-visible"
  >
    {/* Bayangan */}
    <rect x="14" y="14" width="84" height="50" rx="10" fill="#134E4A" />
    {/* Layar Monitor Panggung */}
    <rect
      x="10"
      y="10"
      width="84"
      height="50"
      rx="10"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    {/* Mikrofon / Buzzer Kuis di Tengah */}
    <circle
      cx="52"
      cy="35"
      r="15"
      fill="#0D9488"
      stroke="#134E4A"
      strokeWidth="3"
    />
    <path
      d="M55 24 L46 36 H53 L49 46 L60 34 H53 L55 24 Z"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Bintang Sudut */}
    <circle
      cx="24"
      cy="24"
      r="4"
      fill="#EF4444"
      stroke="#134E4A"
      strokeWidth="2"
    />
    <circle
      cx="80"
      cy="46"
      r="4"
      fill="#3B82F6"
      stroke="#134E4A"
      strokeWidth="2"
    />
  </svg>
);

export default function HostGamePage() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);
  const [roomType, setRoomType] = useState<string>("casual");
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [hostAnswer, setHostAnswer] = useState<string | null>(null);
  const [hostScore, setHostScore] = useState<number>(0);
  const hostScoreRef = useRef(0);
  const hostName =
    (typeof window !== "undefined"
      ? window.sessionStorage.getItem("arena_player_name")
      : null) || "Host";
  const [violations, setViolations] = useState<
    Array<{ nickname: string; violations: number }>
  >([]);
  const [, setSocketConnected] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState<number | null>(null);

  const socketRef = useRef<ArenaSocket | null>(null);

  // Fetch soal dari room_questions
  useEffect(() => {
    if (!pin) return;

    let cancelled = false;
    const load = async () => {
      try {
        const room = await arenaRoomService.getRoom(pin);
        if (!room) {
          setErrorMsg(
            "Room dengan PIN ini tidak ditemukan. Silakan buat room ulang.",
          );
          setLoadingQuestions(false);
          return;
        }
        sessionStorage.setItem("arena_room_id", room.id);
        const rType = room.room_type || (room as any).roomType;
        if (rType) {
          setRoomType(rType);
        }

        const roomId = room.id;
        const questions = await arenaRoomService.getRoomQuestions(pin);
        if (cancelled) return;
        if (!questions || questions.length === 0) {
          setErrorMsg("Gagal memuat soal, silakan buat room ulang.");
          setLoadingQuestions(false);
          return;
        }
        setQuestions(questions);
        setQuestionIndex(0);
        setTotalQuestions(questions.length);
        setTimeLeft(questions[0].timeLimitSeconds || 20);
        if (cancelled) return;
          setErrorMsg("Gagal memuat soal, silakan buat room ulang.");
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(err.message || "Terjadi kesalahan saat memuat soal.");
      } finally {
        if (!cancelled) setLoadingQuestions(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [pin]);

  const currentQuestion = questions[questionIndex] || null;
  const maxTime = currentQuestion?.timeLimitSeconds || 20;
  const timePercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  const isExamMode = roomType === "exam" || roomType === "ujian_resmi";

  const combinedLeaderboard = useMemo(() => {
    const list = [...leaderboard];
    if (isExamMode) {
      list.sort((a, b) => (b.score || 0) - (a.score || 0));
      return list.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    }
    const hostIdx = list.findIndex(
      (p) =>
        p.isHost ||
        p.nickname === `${hostName} (Host)` ||
        p.id === "host" ||
        p.playerId === "host",
    );
    if (hostIdx >= 0) {
      list[hostIdx] = {
        ...list[hostIdx],
        score: Math.max(list[hostIdx].score || 0, hostScore),
      };
    } else {
      list.push({
        id: "host",
        playerId: "host",
        nickname: `${hostName} (Host)`,
        score: hostScore,
        isHost: true,
        rank: 0,
      });
    }
    list.sort((a, b) => (b.score || 0) - (a.score || 0));
    return list.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [leaderboard, hostScore, hostName, isExamMode]);

  const handleHostSelectOption = useCallback(
    (optId: string) => {
      if (revealed || hostAnswer || timeLeft <= 0 || !currentQuestion) return;
      setHostAnswer(optId);

      const activeKey =
        correctAnswer ||
        currentQuestion.correctAnswer ||
        currentQuestion.correct_answer;

      const optObj = currentQuestion.options?.find((o: any) => {
        const oId = typeof o === "string" ? o : o.id;
        return oId === optId;
      });
      const optText = optObj
        ? typeof optObj === "string"
          ? optObj
          : optObj.text
        : "";

      const isCorrect =
        optId === activeKey ||
        optText === activeKey ||
        Boolean(optObj?.isCorrect) ||
        (typeof activeKey === "string" &&
          optId.toLowerCase() === activeKey.toLowerCase());

      if (isCorrect) {
        const maxT = currentQuestion.timeLimitSeconds || 20;
        const bonus = Math.round((Math.max(0, timeLeft) / maxT) * 500);
        const points = 500 + bonus;
        const nextScore = hostScoreRef.current + points;
        hostScoreRef.current = nextScore;
        setHostScore(nextScore);
      }

      if (socketRef.current) {
        socketRef.current.submitAnswer(currentQuestion.id, optId);
      }
    },
    [revealed, hostAnswer, timeLeft, currentQuestion, correctAnswer],
  );

  const handleReveal = useCallback(() => {
    setRevealed(true);
    setRevealCountdown(4);
    if (socketRef.current) socketRef.current.revealAnswer();
  }, []);

  const handleShowLeaderboard = useCallback(() => {
    setRevealCountdown(null);
    setShowLeaderboard(true);
    if (socketRef.current) socketRef.current.showLeaderboard();
  }, []);

  const handleNext = useCallback(() => {
    setRevealCountdown(null);
    setShowLeaderboard(false);
    setHostAnswer(null);
    if (questionIndex + 1 >= totalQuestions) {
      if (socketRef.current) socketRef.current.nextQuestion();
      navigate(`/arena/podium/${pin}`, {
        state: {
          leaderboard: combinedLeaderboard,
          kkm: 75,
          myScore: hostScore,
          myName: `${hostName} (Host)`,
        },
      });
      return;
    }
    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    setRevealed(false);
    setAnsweredCount(0);
    setTimeLeft(questions[nextIdx]?.timeLimitSeconds || 20);
    if (socketRef.current) socketRef.current.nextQuestion();
  }, [
    questionIndex,
    totalQuestions,
    pin,
    combinedLeaderboard,
    hostScore,
    hostName,
    questions,
    navigate,
  ]);

  // Hitung mundur pembahasan soal -> Otomatis siarkan & buka Leaderboard
  useEffect(() => {
    if (!revealed || showLeaderboard || revealCountdown === null) return;
    if (revealCountdown <= 0) {
      handleShowLeaderboard();
      return;
    }
    const timer = setTimeout(() => {
      setRevealCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [revealed, showLeaderboard, revealCountdown, handleShowLeaderboard]);

  // Timer HANYA berjalan jika questions.length > 0 dan belum revealed
  useEffect(() => {
    if (
      questions.length === 0 ||
      revealed ||
      loadingQuestions ||
      !currentQuestion ||
      Boolean(errorMsg)
    ) {
      return;
    }

    if (timeLeft <= 0) {
      handleReveal();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    questions.length,
    revealed,
    loadingQuestions,
    currentQuestion,
    errorMsg,
    timeLeft,
    handleReveal,
  ]);

  // Connect socket saat soal sudah terbaca
  useEffect(() => {
    if (!pin || loadingQuestions || errorMsg) return;

    const formatQuestionsForWs = (qs: any[]) => {
      return qs.map((q, idx) => ({
        id: q.id || `q-${idx + 1}`,
        prompt: q.prompt || q.title || "",
        questionText: q.prompt || q.title || "",
        arabicPrompt: q.arabicPrompt,
        audioUrl: q.audioUrl,
        options: (q.options || []).map((opt: any, oIdx: number) =>
          typeof opt === "string"
            ? { id: String.fromCharCode(65 + oIdx), text: opt }
            : {
                id: opt.id || String.fromCharCode(65 + oIdx),
                text: opt.text || opt.label || "",
                arabic: opt.arabic,
              },
        ),
        correctAnswer: q.correctAnswer || q.correct_answer || "A",
        explanation: q.explanation || "",
        timeLimitSeconds: q.timeLimitSeconds || 20,
      }));
    };

    const socket = new ArenaSocket(pin, "host", true, {
      onReconnect: () => {
        if (questions.length > 0) {
          socket.startGame(formatQuestionsForWs(questions));
        }
      },
      onRoomState: (state) => {
        if (state.status === "finished") {
          navigate(`/arena/podium/${pin}`, {
            state: {
              leaderboard: combinedLeaderboard,
              kkm: 75,
              myScore: hostScore,
              myName: `${hostName} (Host)`,
            },
          });
          return;
        }
        if (state.currentQuestion) {
          setQuestionIndex(state.question);
          setTotalQuestions(state.totalQ);
          setTimeLeft(state.currentQuestion.timeLimitSeconds || 20);
        }
        if (state.players) {
          setTotalPlayers(state.players.length);
        }
      },
      onGameStarted: (data) => {
        setQuestionIndex(data.questionIndex ?? 0);
        setTotalQuestions(data.totalQuestions ?? questions.length);
        setTimeLeft(data.timeLimit || 20);
        setRevealed(false);
        setAnsweredCount(0);
      },
      onPlayerAnswered: (data) => {
        setAnsweredCount(data.answeredCount);
        setTotalPlayers(data.totalPlayers);
      },
      onQuestionResult: (data) => {
        setRevealed(true);
        setRevealCountdown(4);
        setCorrectAnswer(data.correctAnswer);
        setExplanation(data.explanation || "");
        if (data.leaderboard) setLeaderboard(data.leaderboard);
      },
      onShowLeaderboard: (data) => {
        setRevealCountdown(null);
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        setShowLeaderboard(true);
      },
      onNextQuestion: (data) => {
        setQuestionIndex(data.questionIndex);
        setTotalQuestions(data.totalQuestions);
        setTimeLeft(data.question?.timeLimitSeconds || 20);
        setRevealed(false);
        setRevealCountdown(null);
        setShowLeaderboard(false);
        setAnsweredCount(0);
        setHostAnswer(null);
      },
      onGameFinished: (data) => {
        navigate(`/arena/podium/${pin}`, {
          state: {
            leaderboard: combinedLeaderboard,
            kkm: data.kkm || 75,
            myScore: hostScore,
            myName: `${hostName} (Host)`,
            winnerId: data.winnerId,
            outcome: data.outcome,
            isDraw: data.isDraw,
          },
        });
      },
      onPlayerViolation: (data) => {
        setViolations((prev) => [
          ...prev.filter((v) => v.nickname !== data.nickname),
          { nickname: data.nickname, violations: data.violations },
        ]);
      },
    });

    socket.connect();
    socketRef.current = socket;
    setSocketConnected(true);

    const initTimer = setTimeout(() => {
      if (questions.length > 0) {
        socket.startGame(formatQuestionsForWs(questions));
      }
    }, 400);

    return () => {
      clearTimeout(initTimer);
      socket.disconnect();
      clearBotSimulatorState();
    };
  }, [
    pin,
    loadingQuestions,
    errorMsg,
    questions,
    combinedLeaderboard,
    hostScore,
    hostName,
    navigate,
  ]);

  return (
    <NgajiCeriaLayout
      title={`Tartila Arena Host - PIN ${pin}`}
      hideMascot={true}
      showBack={true}
      onBack={() => setShowExitConfirm(true)}
    >
      <ConfirmDialog
        isOpen={showExitConfirm}
        title="Hentikan Permainan?"
        description="Sebagai Host, jika kamu keluar maka sesi permainan ini akan berhenti untuk semua santri."
        isDestructive={true}
        onConfirm={() => {
          setShowExitConfirm(false);
          socketRef.current?.sendHostLeft();
          socketRef.current?.disconnect();
          sessionStorage.removeItem("arena_room_id");
          sessionStorage.removeItem(`arena_is_host_${pin}`);
          clearBotSimulatorState();
          navigate("/member/ngaji-ceria/games");
        }}
        onCancel={() => setShowExitConfirm(false)}
      />

      <div className="relative min-h-[100dvh] w-full bg-[#F0FDF4] pb-24 lg:pb-10 overflow-x-hidden select-none">
        {/* Pola Titik Taktis Arena */}
        <div
          className="pointer-events-none fixed inset-0 opacity-20 z-0"
          style={{
            backgroundImage: "radial-gradient(#0D9488 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-3.5 sm:px-4 pt-3 sm:pt-4 space-y-3.5">
          {/* State Error Merah: Tampil jika soal gagal dimuat */}
          {errorMsg && (
            <div className="rounded-3xl border-[4px] border-[#134E4A] bg-[#FEF2F2] p-7 text-center shadow-[6px_6px_0px_#134E4A] space-y-3 max-w-lg mx-auto my-8">
              <div className="w-14 h-14 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEE2E2] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#134E4A]">
                <AlertTriangleSvg size={28} className="text-[#EF4444]" />
              </div>
              <h2 className="font-display text-xl font-black text-[#134E4A]">
                Gagal Memuat Soal
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#7F1D1D]">
                {errorMsg}
              </p>
              <button
                type="button"
                onClick={() => navigate("/arena/create")}
                className="mt-2 px-5 py-2.5 rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-xs sm:text-sm shadow-[3px_3px_0px_#134E4A] hover:bg-[#0F766E] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                Buat Room Ulang
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {loadingQuestions && !errorMsg && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#134E4A] border-t-transparent rounded-full animate-spin" />
              <p className="mt-3 text-xs sm:text-sm font-black text-[#134E4A]">
                Menyiapkan panggung kuis...
              </p>
            </div>
          )}

          {/* =============================================================== */}
          {/* LAYAR UTAMA HOST (SINGLE-VIEWPORT COMMAND LAYOUT)               */}
          {/* =============================================================== */}
          {currentQuestion && !loadingQuestions && !errorMsg && (
            <>
              {/* 1. COMPACT TOP HUD BAR: SOAL, TIMER PROGRESS & RESPON SANTRI */}
              <section className="rounded-2xl border-[3.5px] border-[#134E4A] bg-white p-3 sm:px-4 shadow-[4px_4px_0px_#134E4A]">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Kiri: Nomor Soal & Kategori */}
                  <div className="flex items-center gap-2.5">
                    <div className="px-3 py-1.5 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A]">
                      <span className="font-display text-sm sm:text-base font-black text-[#134E4A]">
                        Soal {questionIndex + 1} / {totalQuestions}
                      </span>
                    </div>
                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] text-[10px] font-black uppercase tracking-wider text-[#134E4A]">
                      Kategori: {currentQuestion.category || "Tilawati"}
                    </span>
                  </div>

                  {/* Tengah: Progress Bar Waktu Berjalan + Detik */}
                  <div className="flex items-center gap-2.5 flex-1 max-w-xs mx-auto">
                    <div className="flex-1 h-3.5 rounded-full border-2 border-[#134E4A] bg-gray-100 overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          revealed
                            ? "bg-[#6B7280]"
                            : timeLeft <= 5
                              ? "bg-[#EF4444]"
                              : "bg-[#0D9488]"
                        }`}
                        style={{ width: `${revealed ? 0 : timePercent}%` }}
                      />
                    </div>
                    <div
                      className={`min-w-[44px] h-9 px-2 rounded-xl border-[2.5px] border-[#134E4A] flex items-center justify-center font-display text-base sm:text-lg font-black shadow-[2px_2px_0px_#134E4A] ${
                        revealed
                          ? "bg-gray-200 text-[#134E4A]"
                          : timeLeft <= 5
                            ? "bg-[#EF4444] text-white animate-pulse"
                            : "bg-[#FEF08A] text-[#134E4A]"
                      }`}
                    >
                      {revealed ? "SELESAI" : `${timeLeft}d`}
                    </div>
                  </div>

                  {/* Kanan: Skor Host & Penghitung Santri Menjawab */}
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A] text-right">
                      <span className="block text-[9px] font-black uppercase text-[#B45309] leading-none">
                        Skor Kamu
                      </span>
                      <span className="font-display text-sm sm:text-base font-black text-[#134E4A]">
                        {hostScore} pts
                      </span>
                    </div>
                    <div className="px-3 py-1 rounded-xl border-[2.5px] border-[#134E4A] bg-[#ECFDF5] shadow-[2px_2px_0px_#134E4A] text-right">
                      <span className="block text-[9px] font-black uppercase text-[#065F46] leading-none">
                        Santri Menjawab
                      </span>
                      <span className="font-display text-sm sm:text-base font-black text-[#0D9488]">
                        {answeredCount} / {totalPlayers}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Peringatan Anti-Cheat (Jika Ada Pelanggaran Tab-Switch) */}
                {violations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t-2 border-dashed border-[#134E4A]/15 flex items-center gap-2 text-xs font-black text-[#9A3412]">
                    <AlertCircle
                      size={15}
                      className="text-[#EA580C] shrink-0"
                    />
                    <span className="truncate">
                      Peringatan Pindah Tab:{" "}
                      {violations
                        .map((v) => `${v.nickname} (${v.violations}x)`)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </section>

              {/* 2. SPLIT VIEWPORT: PANGGUNG SOAL (8 KOLOM) & PANEL HOST (4 KOLOM) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* ========================================================= */}
                {/* KOLOM KIRI (8 KOLOM): PANGGUNG PERTANYAAN & PILIHAN A-D   */}
                {/* ========================================================= */}
                <div className="lg:col-span-8 space-y-3.5">
                  <section className="relative overflow-hidden rounded-3xl border-[4px] border-[#134E4A] bg-[#FEF3C7] p-4 sm:p-6 shadow-[5px_5px_0px_#134E4A] space-y-4">
                    {/* Bagian Atas Soal + Ilustrasi Panggung */}
                    <div className="flex items-center justify-between gap-4 bg-white rounded-2xl border-[3px] border-[#134E4A] p-4 sm:p-5 shadow-[3px_3px_0px_#134E4A]">
                      <div className="flex-1 space-y-2 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-block px-2.5 py-0.5 rounded-md border-2 border-[#134E4A] bg-[#0D9488] text-[10px] font-black uppercase tracking-wider text-white">
                            PIN: {pin}
                          </span>
                          {revealed && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border-2 border-[#134E4A] bg-[#10B981] text-[10px] font-black uppercase text-white">
                              <CheckSvg size={11} stroke="#FFFFFF" /> Jawaban
                              Terbuka
                            </span>
                          )}
                        </div>

                        {(currentQuestion.title || currentQuestion.prompt) && (
                          <h1 className="font-display text-lg sm:text-2xl font-black text-[#134E4A] leading-snug">
                            {currentQuestion.prompt || currentQuestion.title}
                          </h1>
                        )}

                        {/* Teks Arab (Jika Tersedia) */}
                        {currentQuestion.arabicPrompt && (
                          <div className="pt-1">
                            <span className="inline-block rounded-xl border-2 border-[#134E4A] bg-[#F0FDF4] px-4 py-1.5 game-arabic text-2xl sm:text-4xl font-black text-[#0D9488] shadow-[2px_2px_0px_#134E4A]">
                              {currentQuestion.arabicPrompt}
                            </span>
                          </div>
                        )}

                        {/* Tombol Audio Ayat (Jika Tersedia) */}
                        {currentQuestion.audioUrl && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const audio = new Audio(
                                  getAudioUrl(currentQuestion.audioUrl) ??
                                    currentQuestion.audioUrl,
                                );
                                audio.play();
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FEF08A] hover:bg-[#FDE047] text-[#134E4A] font-black text-xs shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                            >
                              <Volume2 size={16} />
                              <span>Putar Audio Soal</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <HostStageBannerSvg />
                    </div>

                    {/* Tampilan Soal / Opsi: Mode Pengawas Ujian vs Mode Casual/Duel */}
                    {isExamMode ? (
                      <div className="rounded-3xl border-[3.5px] border-[#134E4A] bg-[#FEF3C7] p-5 sm:p-6 shadow-[5px_5px_0px_#134E4A] space-y-3.5 text-center">
                        <span className="inline-block px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-xs font-black uppercase">
                          Mode Pengawas Ujian
                        </span>
                        <h3 className="font-display text-base sm:text-lg font-black text-[#134E4A]">
                          Ujian Berlangsung &mdash; Mengawasi Jawaban Santri
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-[#134E4A]/70 max-w-md mx-auto">
                          Sebagai pengawas ujian, opsi dan kunci jawaban disembunyikan. Anda dapat memantau progres pengisian seluruh santri di bawah ini:
                        </p>
                        <div className="max-w-md mx-auto bg-white rounded-2xl border-[3px] border-[#134E4A] p-4 shadow-[3px_3px_0px_#134E4A] space-y-2">
                          <div className="flex justify-between items-center text-xs font-black text-[#134E4A]">
                            <span>Progres Santri</span>
                            <span>
                              {answeredCount} dari {totalPlayers} santri sudah menjawab
                            </span>
                          </div>
                          <div className="w-full h-4 rounded-full border-2 border-[#134E4A] bg-[#FEE2E2] overflow-hidden">
                            <div
                              className="h-full bg-[#10B981] transition-all duration-300"
                              style={{
                                width: `${totalPlayers > 0 ? (answeredCount / totalPlayers) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      currentQuestion.options &&
                      currentQuestion.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentQuestion.options.map(
                            (opt: any, idx: number) => {
                              const optId = opt.id || OPTION_LABELS[idx];
                              const optText =
                                typeof opt === "string" ? opt : opt.text;
                              const optArabic =
                                typeof opt === "object" ? opt.arabic : null;
                              const isHostChosen = hostAnswer === optId;

                              const activeKey =
                                correctAnswer ||
                                currentQuestion.correctAnswer ||
                                currentQuestion.correct_answer;
                              const isThisCorrect =
                                revealed &&
                                (optId === activeKey ||
                                  optText === activeKey ||
                                  opt.isCorrect ||
                                  (typeof activeKey === "string" &&
                                    optId.toLowerCase() ===
                                      activeKey.toLowerCase()));
                              const isHostWrong =
                                revealed && isHostChosen && !isThisCorrect;

                              const canHostClick =
                                !revealed && !hostAnswer && timeLeft > 0;

                              let cardStyle =
                                "bg-white border-[#134E4A] text-[#134E4A] shadow-[3.5px_3.5px_0px_#134E4A]";
                              if (revealed) {
                                if (isThisCorrect) {
                                  cardStyle =
                                    "bg-[#D1FAE5] border-[#10B981] ring-4 ring-[#10B981] text-[#134E4A] shadow-[4px_4px_0px_#10B981] scale-[1.01]";
                                } else if (isHostWrong) {
                                  cardStyle =
                                    "bg-[#FEE2E2] border-[#EF4444] ring-4 ring-[#EF4444] text-[#134E4A] shadow-[4px_4px_0px_#EF4444]";
                                } else {
                                  cardStyle =
                                    "bg-gray-50 border-[#134E4A]/30 text-[#134E4A]/50 opacity-40 shadow-none";
                                }
                              } else if (isHostChosen) {
                                cardStyle =
                                  "bg-[#CCFBF1] border-[#0D9488] ring-4 ring-[#0D9488] text-[#134E4A] shadow-[4px_4px_0px_#0D9488] scale-[1.01]";
                              } else if (hostAnswer) {
                                cardStyle =
                                  "bg-white/80 border-[#134E4A]/50 text-[#134E4A]/60 opacity-60 shadow-none";
                              } else {
                                cardStyle =
                                  "bg-white hover:bg-[#F0FDF4] border-[#134E4A] text-[#134E4A] shadow-[3.5px_3.5px_0px_#134E4A]";
                              }

                              return (
                                <button
                                  key={optId || idx}
                                  type="button"
                                  disabled={!canHostClick}
                                  onClick={() => handleHostSelectOption(optId)}
                                  className={`relative p-3.5 sm:p-4 rounded-2xl border-[3px] font-black text-sm sm:text-base flex items-center justify-between gap-3 text-left transition-all ${cardStyle} ${
                                    canHostClick
                                      ? "cursor-pointer active:translate-y-[2px] active:shadow-none"
                                      : "cursor-default"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span
                                      className={`w-9 h-9 rounded-xl border-[2.5px] border-[#134E4A] ${
                                        isHostChosen
                                          ? "bg-[#0D9488] text-white"
                                          : OPTION_STYLES[
                                              idx % OPTION_STYLES.length
                                            ]?.badgeBg || "bg-[#FEF08A]"
                                      } text-[#134E4A] flex items-center justify-center font-display text-base font-black shrink-0 shadow-[2px_2px_0px_#134E4A]`}
                                    >
                                      {OPTION_LABELS[idx] || optId}
                                    </span>

                                    <span className="leading-snug break-words">
                                      {optText}
                                    </span>
                                  </div>

                                  {optArabic && (
                                    <span
                                      dir="rtl"
                                      className="font-arabic text-xl sm:text-2xl text-[#0D9488] leading-relaxed shrink-0 pl-2"
                                    >
                                      {optArabic}
                                    </span>
                                  )}

                                  {revealed && isThisCorrect && (
                                    <span className="px-2 py-0.5 rounded-lg bg-[#10B981] text-white text-[10px] font-black border border-[#134E4A] shrink-0">
                                      Kunci Benar
                                    </span>
                                  )}
                                  {revealed && isHostWrong && (
                                    <span className="px-2 py-0.5 rounded-lg bg-[#EF4444] text-white text-[10px] font-black border border-[#134E4A] shrink-0">
                                      Pilihanmu
                                    </span>
                                  )}
                                  {!revealed && isHostChosen && (
                                    <span className="px-2 py-0.5 rounded-lg bg-[#0D9488] text-white text-[10px] font-black border border-[#134E4A] shrink-0">
                                      Terkunci
                                    </span>
                                  )}
                                </button>
                              );
                            },
                          )}
                        </div>
                      )
                    )}

                    {/* Kunci Jawaban Eksplisit untuk Host saat Terbuka */}
                    {revealed && (
                      <div className="p-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#CCFBF1] text-[#134E4A] shadow-[3px_3px_0px_#134E4A] space-y-1.5 text-left">
                        <div className="flex items-center gap-2">
                          <CheckSvg size={16} stroke="#0D9488" />
                          <span className="font-display text-xs font-black uppercase text-[#0F766E]">
                            Kunci Jawaban Resmi:
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md border border-[#134E4A] bg-[#FEF08A] font-black text-xs text-[#134E4A]">
                            {correctAnswer ||
                              currentQuestion.correctAnswer ||
                              currentQuestion.correct_answer ||
                              "A"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Penjelasan Saat Jawaban Terbuka */}
                    <AnimatePresence>
                      {revealed && explanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="p-3.5 rounded-2xl border-[2.5px] border-[#134E4A] bg-[#CCFBF1] text-[#134E4A] text-left text-xs sm:text-sm font-bold shadow-[3px_3px_0px_#134E4A] flex items-start gap-2.5"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#FEF08A] border-2 border-[#134E4A] flex items-center justify-center shrink-0">
                            <LightbulbSvg
                              size={15}
                              className="text-[#134E4A]"
                            />
                          </div>
                          <div className="leading-snug">
                            <span className="font-black uppercase text-[10px] tracking-wider block text-[#0F766E]">
                              Penjelasan Jawaban
                            </span>
                            {explanation}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </section>
                </div>

                {/* ========================================================= */}
                {/* KOLOM KANAN (4 KOLOM): KONTROL HOST & STATUS ARENA       */}
                {/* ========================================================= */}
                <div className="lg:col-span-4 space-y-3.5">
                  {/* Panel Tombol Eksekusi Host (Tampil di Desktop) */}
                  <section className="hidden lg:flex flex-col rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FFFBEB] p-4 shadow-[5px_5px_0px_#134E4A] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/70">
                        Kontrol Panggung Host
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#FEF08A] border border-[#134E4A] text-[10px] font-black text-[#134E4A]">
                        {revealed ? "Sesi Pembahasan" : "Sesi Menjawab"}
                      </span>
                    </div>

                    {!revealed ? (
                      <button
                        type="button"
                        onClick={handleReveal}
                        className="w-full py-3.5 px-4 rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-sm shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <KeyRoundSvg size={18} />
                        <span>Kunci & Buka Jawaban</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleShowLeaderboard}
                        className="w-full py-3.5 px-4 rounded-xl border-[3px] border-[#134E4A] bg-[#EA580C] hover:bg-[#C2410C] text-white font-black text-sm shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <TrophySvg size={18} />
                        <span>
                          Lihat Leaderboard {revealCountdown !== null ? `(${revealCountdown}s)` : ""}
                        </span>
                      </button>
                    )}
                  </section>

                  {/* Panel Respon & Statistik Santri Live */}
                  <section className="rounded-2xl border-[3.5px] border-[#134E4A] bg-white p-4 shadow-[5px_5px_0px_#134E4A] space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b-2 border-dashed border-[#134E4A]/20">
                      <h3 className="font-display text-sm sm:text-base font-black text-[#134E4A]">
                        Respon Masuk
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-[#CCFBF1] border border-[#134E4A] text-[10px] font-black text-[#0D9488]">
                        Live Sync
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-[#134E4A]">
                        <span>Santri Menjawab</span>
                        <span className="font-display text-sm text-[#0D9488]">
                          {answeredCount} / {totalPlayers} Santri
                        </span>
                      </div>
                      <div className="h-3 rounded-full border-2 border-[#134E4A] bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-[#0D9488] transition-all duration-300"
                          style={{
                            width: `${(answeredCount / Math.max(1, totalPlayers)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-[11px] font-bold text-[#134E4A]/70 leading-relaxed pt-1">
                      {!revealed
                        ? "Santri sedang membaca dan memilih jawaban di perangkat masing-masing. Host dapat mengunci jawaban sewaktu-waktu."
                        : `Jawaban & pembahasan telah terbuka. Leaderboard akan muncul otomatis dalam ${revealCountdown ?? 0}s, atau klik tombol di atas untuk membuka sekarang.`}
                    </p>

                    {/* Catatan Pelanggaran Tab jika ada */}
                    {violations.length > 0 && (
                      <div className="pt-2 border-t border-dashed border-[#134E4A]/20 space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-[#EF4444] block">
                          Peringatan Anti-Cheat ({violations.length})
                        </span>
                        {violations.slice(0, 3).map((v, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[11px] font-bold text-[#134E4A] bg-[#FEF2F2] border border-[#EF4444] rounded-lg px-2 py-1"
                          >
                            <span className="truncate">{v.nickname}</span>
                            <span className="font-black text-[#EF4444] shrink-0">
                              {v.violations}x pindah tab
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ================================================================= */}
        {/* STICKY BOTTOM HOST DOCK (KONTROL CEPAT & SKOR HOST AKTIF)        */}
        {/* ================================================================= */}
        {currentQuestion && !loadingQuestions && !errorMsg && (
          <div className="fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-[#F0FDF4] via-[#F0FDF4]/95 to-transparent">
            <div className="max-w-4xl mx-auto rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FFFBEB] p-2.5 sm:p-3 shadow-[0_-3px_0px_#134E4A,4px_4px_0px_#134E4A] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-1 rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] text-xs font-black text-[#134E4A] shrink-0">
                  Skor Host: {hostScore} pts
                </span>
                <span className="text-xs font-bold text-[#134E4A]/70 truncate hidden sm:inline">
                  {revealed
                    ? `Leaderboard terbuka otomatis dalam ${revealCountdown ?? 0}s`
                    : hostAnswer
                      ? "Jawaban Host tersimpan! Tunggu santri lain atau kunci jawaban"
                      : "Pilih jawabanmu sebelum waktu habis"}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!revealed ? (
                  <button
                    type="button"
                    onClick={handleReveal}
                    className="py-2.5 px-4 rounded-xl border-[2.5px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-black text-xs uppercase shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <KeyRoundSvg size={15} />
                    <span>Kunci & Buka Jawaban</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleShowLeaderboard}
                    className="py-2.5 px-4 rounded-xl border-[2.5px] border-[#134E4A] bg-[#EA580C] hover:bg-[#C2410C] text-white font-display font-black text-xs uppercase shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <TrophySvg size={15} />
                    <span>
                      Leaderboard {revealCountdown !== null ? `(${revealCountdown}s)` : ""}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Leaderboard Full-Screen Host (Kritis Bug 3) */}
        <LeaderboardModal
          entries={combinedLeaderboard.map((entry: any, idx: number) => ({
            id: entry.playerId || entry.id || `entry-${idx}`,
            nickname: entry.nickname || entry.name || "Santri",
            score: entry.score || 0,
            avatarId: entry.avatarId,
            rank: entry.rank || idx + 1,
            isHost: entry.isHost,
          }))}
          open={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          isHost={true}
          autoAdvance={true}
          advanceAfterMs={5000}
          onNext={handleNext}
          nextButtonText={
            questionIndex + 1 >= totalQuestions
              ? "Lihat Podium Juara"
              : "Lanjut ke Soal Berikutnya"
          }
          currentPlayerId="host"
          currentNickname={`${hostName} (Host)`}
        />
      </div>
    </NgajiCeriaLayout>
  );
}
