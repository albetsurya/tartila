import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { soundManager } from "../../services/soundManager";
import {
  AlertCircle,
  CheckSvg,
  XSvg,
  ChevronLeftSvg,
  AlertTriangleSvg,
} from "@/components/ui/CustomIcons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ArenaSocket } from "../../services/arenaSocket";
import { arenaRoomService } from "@/services/arenaRoomService";
import type { ClientQuestionPayload } from "../../data/quiz/types";
import LeaderboardModal, {
  type LeaderboardEntry,
} from "@/features/ngaji-ceria/components/quiz-models/LeaderboardModal";
import { ArenaQuestionStage } from "../../components/multiplayer/ArenaQuestionStage";
import {
  MultiplayerAvatar,
  loadMultiplayerProfile,
} from "../../components/multiplayer/MultiplayerSetupSheet";

/**
 * Soal HANYA dari broadcast Host. Soal "dummy" server (mis. "Pilih jawaban
 * benar untuk soal contoh N" dengan opsi kosong) ditolak: prompt wajib ada
 * dan minimal satu opsi berisi teks/Arab. Bila invalid, Player tetap di
 * layar loading sampai `room_state` mengirim soal yang benar.
 */
function pickValidQuestion(input: any): ClientQuestionPayload | null {
  if (!input) return null;
  const prompt = String(input.prompt || input.questionText || input.title || "");
  if (!prompt.trim()) return null;
  const options = Array.isArray(input.options) ? input.options : [];
  const hasRealOption = options.some((opt: any) =>
    typeof opt === "string"
      ? opt.trim().length > 0
      : String(opt?.text ?? "").trim().length > 0 ||
        String(opt?.arabic ?? "").trim().length > 0,
  );
  if (!hasRealOption) return null;
  return input as ClientQuestionPayload;
}

export default function PlayerGamePage() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const [playerId] = useState(() => {
    let pid = sessionStorage.getItem("arena_player_id");
    if (!pid) {
      pid = `guest-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("arena_player_id", pid);
    }
    return pid;
  });
  const profile = useMemo(() => loadMultiplayerProfile(), []);
  const [nickname] = useState(
    () =>
      sessionStorage.getItem("arena_player_name") ||
      profile?.displayName ||
      "Santri",
  );
  const avatarId = profile?.avatarId || "boy-peci";

  // Soal HANYA berasal dari server (broadcast Host). Tidak ada soal contoh dan
  // tidak ada soal yang dibuat sendiri di sisi santri, supaya teks soal serta
  // pilihan A-D selalu sama dengan layar Host.
  const [question, setQuestion] = useState<ClientQuestionPayload | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [result, setResult] = useState<{
    isCorrect: boolean;
    scoreAwarded: number;
    totalScore: number;
  } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const totalScoreRef = useRef(0);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [disqualified, setDisqualified] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [hostDisconnected, setHostDisconnected] = useState(false);
  const [gamePhase, setGamePhase] = useState<
    "COUNTDOWN" | "QUESTION_ACTIVE" | "REVEAL_ANSWER" | "LEADERBOARD" | "RESULT"
  >("QUESTION_ACTIVE");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [questionTimedOut, setQuestionTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timeLimit, setTimeLimit] = useState(20);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState<number | null>(null);

  const socketRef = useRef<ArenaSocket | null>(null);
  const hostDisconnectedRef = useRef(false);

  useEffect(() => {
    if (!pin) return;

    try {
      if (
        document.documentElement.requestFullscreen &&
        !document.fullscreenElement
      ) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // noop
    }

    const socket = new ArenaSocket(pin, playerId, false, {
      onRoomState: (state) => {
        if (state.myScore !== undefined) {
          setTotalScore(state.myScore);
          totalScoreRef.current = state.myScore;
        }
        if (state.disqualified) {
          setDisqualified(true);
        }
        if (state.status === "finished") {
          if (hostDisconnectedRef.current) return;
          navigate(`/arena/podium/${pin}`, {
            state: {
              leaderboard: state.leaderboard || [],
              kkm: state.kkm || 75,
              myScore: state.myScore ?? totalScoreRef.current,
              myName: nickname,
            },
          });
          return;
        }
        if (state.currentQuestion) {
          const incoming = pickValidQuestion(state.currentQuestion);
          if (!incoming) return;
          setSocketError(null);
          setQuestionTimedOut(false);
          setQuestion((prev) => {
            if (!prev || prev.id !== state.currentQuestion.id) {
              setSelectedAnswer(null);
              setIsLocked(false);
              setHasAnswered(false);
              setResult(null);
              setCorrectAnswer("");
              setExplanation("");
            }
            return state.currentQuestion;
          });
          setQuestionIndex(state.question || 0);
          setTotalQuestions(state.totalQ || 1);
          setGamePhase("QUESTION_ACTIVE");
        }
      },
      onAnswerAcknowledged: (data) => {
        setResult(data);
        setTotalScore(data.totalScore);
        totalScoreRef.current = data.totalScore;
      },
      onQuestionResult: (data) => {
        setGamePhase("REVEAL_ANSWER");
        setIsLocked(true);
        setHasAnswered(true);
        setCorrectAnswer(data.correctAnswer);
        setExplanation(data.explanation || "");
        setTimeLeft(0);
        setRevealCountdown(4);
        if (data.leaderboard) {
          setLeaderboard(
            data.leaderboard.map((p: any, idx: number) => ({
              id: p.playerId || p.id || `p-${idx}`,
              nickname: p.nickname || p.name || "Santri",
              score: p.score || 0,
              avatarId: p.avatarId,
              rank: p.rank || idx + 1,
            })),
          );
        }
      },
      onShowLeaderboard: (data) => {
        setRevealCountdown(null);
        setGamePhase("LEADERBOARD");
        if (data.leaderboard) {
          setLeaderboard(
            data.leaderboard.map((p: any, idx: number) => ({
              id: p.playerId || p.id || `p-${idx}`,
              nickname: p.nickname || p.name || "Santri",
              score: p.score || 0,
              avatarId: p.avatarId,
              rank: p.rank || idx + 1,
            })),
          );
        }
        setShowLeaderboard(true);
      },
      onGameStarted: (data) => {
        const incoming = pickValidQuestion(
          data.question ||
            (Array.isArray((data as any).questions)
              ? (data as any).questions[data.questionIndex ?? 0]
              : null),
        );
        if (!incoming) return;
        setSocketError(null);
        setQuestionTimedOut(false);
        setQuestion(incoming);
        setQuestionIndex(data.questionIndex ?? 0);
        setTotalQuestions(data.totalQuestions ?? 1);
        setTimeLimit(data.timeLimit || 20);
        setTimeLeft(data.timeLimit || 20);
        setSelectedAnswer(null);
        setIsLocked(false);
        setHasAnswered(false);
        setResult(null);
        setCorrectAnswer("");
        setExplanation("");
        setRevealCountdown(null);
        setGamePhase("QUESTION_ACTIVE");
        setShowLeaderboard(false);
      },
      onNextQuestion: (data) => {
        const incoming = pickValidQuestion(
          data.question ||
            (Array.isArray((data as any).questions)
              ? (data as any).questions[data.questionIndex ?? 0]
              : null),
        );
        if (!incoming) return;
        setSocketError(null);
        setQuestionTimedOut(false);
        setQuestion(incoming);
        setQuestionIndex(data.questionIndex);
        setTotalQuestions(data.totalQuestions);
        setTimeLimit(data.timeLimit || 20);
        setTimeLeft(data.timeLimit || 20);
        setSelectedAnswer(null);
        setIsLocked(false);
        setHasAnswered(false);
        setResult(null);
        setCorrectAnswer("");
        setExplanation("");
        setRevealCountdown(null);
        setGamePhase("QUESTION_ACTIVE");
        setShowLeaderboard(false);
      },
      onGameFinished: (data) => {
        if (hostDisconnectedRef.current) return;
        navigate(`/arena/podium/${pin}`, {
          state: {
            leaderboard: data.leaderboard,
            kkm: data.kkm,
            myScore: totalScoreRef.current,
            myName: nickname,
            winnerId: data.winnerId,
            outcome: data.outcome,
            isDraw: data.isDraw,
          },
        });
      },
      onHostDisconnected: () => {
        hostDisconnectedRef.current = true;
        setHostDisconnected(true);
        socketRef.current?.disconnect();
      },
      onPhaseChanged: (data) => {
        if (data.phase === "COUNTDOWN") {
          setGamePhase("COUNTDOWN");
          setCountdown(data.countdownSeconds || 3);
        } else if (data.phase === "QUESTION_ACTIVE") {
          setCountdown(null);
          setGamePhase("QUESTION_ACTIVE");
        }
      },
      onError: (err) => {
        setSocketError(
          err || "Koneksi terputus. Server arena tidak dapat dijangkau.",
        );
      },
    }, { nickname, avatarId });

    socket.connect();
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [pin, playerId, nickname, navigate]);

  // Watchdog: jangan biarkan layar "Menyiapkan soal..." berputar selamanya
  // bila socket tersambung tetapi server tidak pernah mengirim soal.
  useEffect(() => {
    if (
      question ||
      socketError ||
      hostDisconnected ||
      disqualified ||
      gamePhase !== "QUESTION_ACTIVE"
    ) {
      return;
    }
    // 5 detik: cukup untuk handshake + broadcast Host, tapi tidak membuat
    // santri menatap layar kosong terlalu lama.
    const timer = setTimeout(() => setQuestionTimedOut(true), 5000);
    return () => clearTimeout(timer);
  }, [question, socketError, hostDisconnected, disqualified, gamePhase]);

  // Countdown sebelum soal aktif
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      if (gamePhase === "COUNTDOWN") {
        setGamePhase("QUESTION_ACTIVE");
      }
      return;
    }
    soundManager.playSfx("pop");
    const t = setTimeout(() => {
      setCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown, gamePhase]);

  // Timer per soal & auto-transition to REVEAL_ANSWER
  useEffect(() => {
    if (
      gamePhase !== "QUESTION_ACTIVE" ||
      disqualified ||
      hostDisconnected
    ) {
      return;
    }
    if (timeLeft <= 0) {
      setGamePhase("REVEAL_ANSWER");
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft((s) => s - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [gamePhase, timeLeft, disqualified, hostDisconnected]);

  // Hitung mundur pembahasan soal -> Otomatis buka Leaderboard Modal
  useEffect(() => {
    if (
      gamePhase !== "REVEAL_ANSWER" ||
      showLeaderboard ||
      revealCountdown === null ||
      hostDisconnected
    ) {
      return;
    }

    if (revealCountdown <= 0) {
      setGamePhase("LEADERBOARD");
      setShowLeaderboard(true);
      setRevealCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setRevealCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [gamePhase, showLeaderboard, revealCountdown, hostDisconnected]);

  const handleSelectOption = (optionId: string) => {
    if (
      isLocked ||
      !question ||
      disqualified ||
      timeLeft <= 0 ||
      gamePhase === "REVEAL_ANSWER" ||
      gamePhase === "LEADERBOARD"
    ) {
      return;
    }

    setSelectedAnswer(optionId);
    // Sinkronkan pilihan ke server secara otomatis
    socketRef.current?.submitAnswer(question.id, optionId);
  };

  const handleLockAnswer = () => {
    if (
      !selectedAnswer ||
      isLocked ||
      !question ||
      disqualified ||
      timeLeft <= 0 ||
      gamePhase !== "QUESTION_ACTIVE"
    ) {
      return;
    }
    setIsLocked(true);
    setHasAnswered(true);
    socketRef.current?.submitAnswer(question.id, selectedAnswer);
  };

  // Kunci jawaban helper text
  const activeCorrectAnswer =
    correctAnswer ||
    (question as any)?.correctAnswer ||
    (question as any)?.correct_answer ||
    "";
  const correctOptionObj = question?.options?.find(
    (opt: any, idx: number) => {
      const optId = opt.id || String.fromCharCode(65 + idx);
      const optText = typeof opt === "string" ? opt : opt.text;
      return (
        optId === activeCorrectAnswer ||
        optText === activeCorrectAnswer ||
        (typeof activeCorrectAnswer === "string" &&
          optId.toLowerCase() === activeCorrectAnswer.toLowerCase()) ||
        opt.isCorrect
      );
    },
  );
  const canAnswer =
    !isLocked &&
    !disqualified &&
    timeLeft > 0 &&
    gamePhase === "QUESTION_ACTIVE" &&
    Boolean(question);

  const correctAnswerText = correctOptionObj
    ? typeof correctOptionObj === "string"
      ? correctOptionObj
      : correctOptionObj.text
    : activeCorrectAnswer;
  const correctAnswerLetter = correctOptionObj
    ? correctOptionObj.id || activeCorrectAnswer
    : activeCorrectAnswer;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-[#F0FDF4] select-none">
      {/* HUD Header Santri */}
      <header className="shrink-0 flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 bg-white border-b-[3px] border-[#134E4A] shadow-[0px_2px_0px_#134E4A] z-20">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBackModal(true)}
            aria-label="Kembali"
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-0.5 cursor-pointer"
          >
            <ChevronLeftSvg size={18} />
          </button>
          <div className="flex items-center gap-2">
            <MultiplayerAvatar avatarId={avatarId} size={30} />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block leading-tight">
                Santri
              </span>
              <span className="font-black text-sm text-[#134E4A] leading-none">
                {nickname}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block leading-tight">
            Soal
          </span>
          <span className="font-display text-sm sm:text-base font-black text-[#134E4A] leading-none">
            {questionIndex + 1} / {totalQuestions || 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block leading-tight">
              Timer
            </span>
            <span
              className={`font-display text-sm sm:text-base font-black leading-none ${
                timeLeft <= 5 ? "text-[#EF4444] animate-pulse" : "text-[#0D9488]"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="hidden xs:block w-14 sm:w-16 h-2.5 bg-gray-200 border-[2px] border-[#134E4A] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                timeLeft <= 5 ? "bg-[#EF4444]" : "bg-[#0D9488]"
              }`}
              style={{
                width: `${Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100))}%`,
              }}
            />
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block leading-tight">
            Skor
          </span>
          <span className="font-display text-sm sm:text-base font-black text-[#0D9488] leading-none">
            {totalScore} pts
          </span>
        </div>
      </header>

      {/* Konten Utama Layar Santri */}
      <main className="flex-1 w-full max-w-lg mx-auto p-3.5 sm:p-4 flex flex-col justify-between gap-3.5 overflow-y-auto">
        {/* Panggung soal bersama Host & Player: satu komponen, satu tampilan */}
        {question ? (
          <ArenaQuestionStage
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            selectedOptionId={selectedAnswer}
            revealed={gamePhase === "REVEAL_ANSWER" || gamePhase === "LEADERBOARD"}
            correctAnswer={activeCorrectAnswer}
            disabled={!canAnswer}
            onSelect={handleSelectOption}
          />
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-display text-sm font-black text-[#134E4A]">
              Menyiapkan soal...
            </p>
          </div>
        )}

        {/* Status Bawah: Sesi Menjawab / Feedback Reveal */}
        <div className="space-y-2.5 pt-1 shrink-0">
          {gamePhase === "QUESTION_ACTIVE" && (
            <>
              {!isLocked ? (
                selectedAnswer ? (
                  <div className="space-y-2 animate-in zoom-in-95">
                    <button
                      type="button"
                      onClick={handleLockAnswer}
                      className="w-full py-3.5 px-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-sm sm:text-base shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckSvg size={18} />
                      <span>Kunci Jawaban Saya</span>
                    </button>
                    <p className="text-[11px] font-bold text-center text-[#134E4A]/70">
                      Pilihan tersimpan. Kamu masih bisa mengganti pilihan sebelum menekan kunci jawaban.
                    </p>
                  </div>
                ) : (
                  <div className="py-2.5 px-4 rounded-xl border-2 border-dashed border-[#134E4A]/30 bg-white text-center">
                    <p className="text-xs font-black text-[#134E4A]/70">
                      Pilih salah satu jawaban di atas sebelum waktu habis!
                    </p>
                  </div>
                )
              ) : (
                <div className="py-3 px-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[3px_3px_0px_#134E4A] flex items-center justify-center gap-2.5 animate-in zoom-in-95">
                  <div className="w-4 h-4 border-2 border-[#134E4A] border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="font-display text-xs sm:text-sm font-black">
                    Jawaban Terkunci! Menunggu santri lain menjawab...
                  </span>
                </div>
              )}
            </>
          )}

          {gamePhase === "REVEAL_ANSWER" && (
            <div className="space-y-2 animate-in zoom-in-95">
              {/* Hasil Jawaban Santri */}
              {selectedAnswer &&
              (selectedAnswer === activeCorrectAnswer ||
                selectedAnswer.toLowerCase() ===
                  activeCorrectAnswer.toLowerCase()) ? (
                <div className="p-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#D1FAE5] text-[#134E4A] shadow-[3.5px_3.5px_0px_#134E4A] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#10B981] text-white border-2 border-[#134E4A] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#134E4A]">
                      <CheckSvg size={18} />
                    </div>
                    <div>
                      <span className="font-display text-sm sm:text-base font-black text-[#0F766E] block">
                        Luar Biasa! Jawabanmu Benar!
                      </span>
                      <span className="text-[11px] font-bold text-[#134E4A]/70">
                        Poin kuis berhasil kamu dapatkan
                      </span>
                    </div>
                  </div>
                  {result && (
                    <span className="font-display text-base font-black text-[#0D9488] shrink-0">
                      +{result.scoreAwarded} Pts
                    </span>
                  )}
                </div>
              ) : selectedAnswer ? (
                <div className="p-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEE2E2] text-[#134E4A] shadow-[3.5px_3.5px_0px_#134E4A] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EF4444] text-white border-2 border-[#134E4A] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#134E4A]">
                    <XSvg size={18} />
                  </div>
                  <div>
                    <span className="font-display text-sm sm:text-base font-black text-[#B91C1C] block">
                      Jawaban Kamu Belum Tepat
                    </span>
                    <span className="text-[11px] font-bold text-[#134E4A]/70">
                      Tetap semangat di soal berikutnya!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] text-[#134E4A] shadow-[3.5px_3.5px_0px_#134E4A] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F59E0B] text-white border-2 border-[#134E4A] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#134E4A]">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <span className="font-display text-sm sm:text-base font-black text-[#B45309] block">
                      Waktu Telah Habis!
                    </span>
                    <span className="text-[11px] font-bold text-[#134E4A]/70">
                      Kamu belum sempat memilih jawaban
                    </span>
                  </div>
                </div>
              )}

              {/* Kunci Jawaban Eksplisit */}
              {activeCorrectAnswer && (
                <div className="p-3 rounded-xl border-[2.5px] border-[#134E4A] bg-[#CCFBF1] text-[#134E4A] shadow-[2.5px_2.5px_0px_#134E4A] space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#0F766E]">
                    <CheckSvg size={14} />
                    <span>Kunci Jawaban: {correctAnswerLetter}</span>
                  </div>
                  <p className="font-black text-xs sm:text-sm text-[#134E4A]">
                    {correctAnswerText}
                  </p>
                  {explanation && (
                    <p className="text-xs font-bold text-[#134E4A]/80 pt-1 border-t border-[#134E4A]/15">
                      {explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Hitung Mundur Otomatis Membuka Leaderboard */}
              <div className="py-2.5 px-3 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-center flex items-center justify-center gap-2 shadow-[2px_2px_0px_#134E4A]">
                <div className="w-3.5 h-3.5 border-2 border-[#134E4A] border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="text-xs font-black text-[#134E4A]">
                  Membuka Klasemen otomatis dalam {revealCountdown ?? 4}s...
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Leaderboard Modal (muncul saat fase LEADERBOARD aktif) */}
      <LeaderboardModal
        entries={leaderboard}
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        isHost={false}
        currentPlayerId={playerId}
        currentNickname={nickname}
        subtitle="Menunggu host memulai soal berikutnya..."
      />

      {/* Modal Host Terputus / Keluar (Kritis Bug 4) */}
      {hostDisconnected && (
        <div className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl border-[4px] border-[#134E4A] bg-white p-6 text-center shadow-[8px_8px_0px_#134E4A] space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 border-[3px] border-[#134E4A] flex items-center justify-center mx-auto text-rose-600 shadow-[3px_3px_0px_#134E4A]">
              <AlertTriangleSvg size={32} />
            </div>
            <h3 className="font-display text-xl font-black text-[#134E4A]">
              Permainan Dihentikan
            </h3>
            <p className="text-sm font-bold text-[#134E4A]/80 leading-relaxed">
              Host telah keluar. Permainan dihentikan.
            </p>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("arena_player_id");
                navigate("/member/ngaji-ceria/games");
              }}
              className="w-full py-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Keluar Santri */}
      <ConfirmDialog
        isOpen={showBackModal}
        title="Keluar dari Room?"
        description="Yakin ingin keluar dari sesi ini? Kamu tidak akan mengikuti pertandingan ini lagi."
        isDestructive={true}
        onConfirm={() => {
          setShowBackModal(false);
          socketRef.current?.disconnect();
          navigate("/member/ngaji-ceria/games");
        }}
        onCancel={() => setShowBackModal(false)}
      />

      {/* Overlay Hitung Mundur Sinkron */}
      <AnimatePresence>
        {(countdown !== null || gamePhase === "COUNTDOWN") && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#134E4A]/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countdown ?? 0}
              initial={{ scale: 0.4, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="px-10 py-8 rounded-3xl border-[5px] border-[#134E4A] bg-[#FEF3C7] shadow-[8px_8px_0px_#042F2E] text-center"
            >
              <span className="block font-display text-6xl sm:text-7xl font-black text-[#134E4A]">
                {countdown && countdown > 0 ? countdown : "MULAI!"}
              </span>
              <p className="mt-2 text-xs sm:text-sm font-black uppercase tracking-wider text-[#134E4A]/70">
                Bersiap Menjawab!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Socket Error / Disconnect */}
      {(socketError || questionTimedOut) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#134E4A]/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FEF08A] p-6 text-center shadow-[6px_6px_0px_#134E4A] space-y-4">
            <h3 className="font-display text-lg font-black text-[#134E4A]">
              Koneksi Terputus
            </h3>
            <p className="text-xs font-bold text-[#134E4A]/80">
              {socketError ||
                "Server arena tidak mengirim soal. Permainan mungkin belum dimulai oleh Host atau koneksi real-time gagal."}
            </p>
            <button
              type="button"
              onClick={() => {
                socketRef.current?.disconnect();
                navigate("/quiz-hub");
              }}
              className="w-full py-2.5 rounded-xl border-[2.5px] border-[#134E4A] bg-[#0D9488] text-white font-black text-xs shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              Kembali ke Menu Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
