import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Volume2,
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
import { getAudioUrl } from "../../utils/audioUrl";
import LeaderboardModal, {
  type LeaderboardEntry,
} from "@/features/ngaji-ceria/components/quiz-models/LeaderboardModal";

const OPTION_BADGE_STYLES = [
  { letter: "A", badgeBg: "bg-[#FEE2E2]" },
  { letter: "B", badgeBg: "bg-[#DBEAFE]" },
  { letter: "C", badgeBg: "bg-[#FEF3C7]" },
  { letter: "D", badgeBg: "bg-[#D1FAE5]" },
];

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
  const [nickname] = useState(
    () => sessionStorage.getItem("arena_player_name") || "Santri",
  );

  const [question, setQuestion] = useState<ClientQuestionPayload | null>(() => {
    try {
      const raw = sessionStorage.getItem("tartila_arena_start_state");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.question) return parsed.question;
      }
    } catch {}
    return null;
  });
  const [questionIndex, setQuestionIndex] = useState(() => {
    try {
      const raw = sessionStorage.getItem("tartila_arena_start_state");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.questionIndex !== undefined) return parsed.questionIndex;
      }
    } catch {}
    return 0;
  });
  const [totalQuestions, setTotalQuestions] = useState(() => {
    try {
      const raw = sessionStorage.getItem("tartila_arena_start_state");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.totalQuestions) return parsed.totalQuestions;
      }
    } catch {}
    return 0;
  });
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
  const [violations, setViolations] = useState(0);
  const [warningModal, setWarningModal] = useState<string | null>(null);
  const [disqualified, setDisqualified] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [hostDisconnected, setHostDisconnected] = useState(false);
  const [gamePhase, setGamePhase] = useState<
    "COUNTDOWN" | "QUESTION_ACTIVE" | "REVEAL_ANSWER" | "LEADERBOARD" | "RESULT"
  >("QUESTION_ACTIVE");
  const [timeLeft, setTimeLeft] = useState(20);
  const [timeLimit, setTimeLimit] = useState(20);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState<number | null>(null);

  const socketRef = useRef<ArenaSocket | null>(null);
  const hostDisconnectedRef = useRef(false);

  // Fallback: Jika soal belum termuat dari WebSocket, ambil langsung dari room storage
  useEffect(() => {
    if (question || !pin) return;
    let alive = true;
    arenaRoomService
      .getRoomQuestions(pin)
      .then((qs) => {
        if (!alive || !qs || qs.length === 0) return;
        const firstQ = qs[0];
        setQuestion(firstQ);
        setTotalQuestions(qs.length);
        setTimeLimit(firstQ.timeLimitSeconds || 20);
        setTimeLeft(firstQ.timeLimitSeconds || 20);
        setGamePhase("QUESTION_ACTIVE");
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [pin, question]);

  // Anti-Cheat: Record Tab Switch
  const handleTabSwitch = useCallback(() => {
    if (disqualified || hostDisconnectedRef.current) return;
    socketRef.current?.recordViolation();
  }, [disqualified]);

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
        if (state.violations !== undefined) {
          setViolations(state.violations);
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
        setWarningModal(null);
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
        setQuestion(data.question);
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
        setQuestion(data.question);
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
      onViolationWarning: (data) => {
        setViolations(data.violations);
        setWarningModal(
          data.autoSubmitted
            ? "Kamu telah melanggar 3x berpindah tab. Sesi ujian kamu dihentikan otomatis!"
            : `Peringatan (${data.violations}/3): Jangan tinggalkan layar ujian!`,
        );
        if (data.autoSubmitted) {
          setDisqualified(true);
        }
      },
    });

    socket.connect();
    socketRef.current = socket;

    const onVisibilityChange = () => {
      if (document.hidden) {
        handleTabSwitch();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      socket.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pin, playerId, nickname, navigate, handleTabSwitch]);

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
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block leading-tight">
              Santri
            </span>
            <span className="font-black text-sm text-[#134E4A] leading-none">
              {nickname}
            </span>
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
        {/* Banner Kartu Soal */}
        {question ? (
          <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A] text-center space-y-2 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60">
              <span className="px-2 py-0.5 rounded bg-[#FEF08A] border border-[#134E4A] text-[#134E4A]">
                Soal {questionIndex + 1}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#CCFBF1] border border-[#134E4A] text-[#134E4A]">
                {question.category || "Tilawati"}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-[#134E4A] leading-snug">
              {question.prompt}
            </h2>

            {question.arabicPrompt && (
              <p
                dir="rtl"
                className="font-arabic text-2xl sm:text-3xl font-black text-[#0D9488] leading-relaxed pt-1"
              >
                {question.arabicPrompt}
              </p>
            )}

            {question.audioUrl && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const audio = new Audio(
                      getAudioUrl(question.audioUrl) ?? question.audioUrl,
                    );
                    audio.play().catch(() => {});
                  }}
                  className="px-3.5 py-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] hover:bg-[#FDE047] text-[#134E4A] font-black text-xs shadow-[2px_2px_0px_#134E4A] inline-flex items-center gap-1.5 active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                >
                  <Volume2 size={15} />
                  <span>Putar Audio</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-display text-sm font-black text-[#134E4A]">
              Menyiapkan soal ujian...
            </p>
          </div>
        )}

        {/* Daftar Opsi Jawaban (Neo-Brutalism & Sinkron Multi-Device) */}
        {question?.options && question.options.length > 0 && (
          <div className="grid grid-cols-1 gap-2.5 w-full shrink-0">
            {question.options.map((opt: any, idx: number) => {
              const letter =
                OPTION_BADGE_STYLES[idx % OPTION_BADGE_STYLES.length]?.letter ||
                String.fromCharCode(65 + idx);
              const badgeStyle =
                OPTION_BADGE_STYLES[idx % OPTION_BADGE_STYLES.length];
              const optId = opt.id || letter;
              const optText = typeof opt === "string" ? opt : opt.text;
              const optArabic = typeof opt === "object" ? opt.arabic : null;

              const isSelected = selectedAnswer === optId;
              const isCorrectOption =
                gamePhase === "REVEAL_ANSWER" &&
                (optId === activeCorrectAnswer ||
                  optText === activeCorrectAnswer ||
                  opt.isCorrect ||
                  (typeof activeCorrectAnswer === "string" &&
                    optId.toLowerCase() ===
                      activeCorrectAnswer.toLowerCase()));
              const isUserWrongChoice =
                gamePhase === "REVEAL_ANSWER" && isSelected && !isCorrectOption;

              const isTimeUp = timeLeft <= 0;
              const isAnswerLocked = isLocked || isTimeUp;
              const canClick =
                !isAnswerLocked &&
                Boolean(question) &&
                !disqualified &&
                gamePhase !== "REVEAL_ANSWER" &&
                gamePhase !== "LEADERBOARD";

              let cardStyle =
                "bg-white border-[#134E4A] text-[#134E4A] shadow-[3.5px_3.5px_0px_#134E4A]";
              if (gamePhase === "REVEAL_ANSWER") {
                if (isCorrectOption) {
                  cardStyle =
                    "bg-[#D1FAE5] border-[#10B981] border-[3.5px] ring-4 ring-[#10B981] text-[#134E4A] shadow-[4px_4px_0px_#10B981] scale-[1.01]";
                } else if (isUserWrongChoice) {
                  cardStyle =
                    "bg-[#FEE2E2] border-[#EF4444] border-[3.5px] ring-4 ring-[#EF4444] text-[#134E4A] shadow-[4px_4px_0px_#EF4444]";
                } else {
                  cardStyle =
                    "bg-gray-50 border-[#134E4A]/30 text-[#134E4A]/50 opacity-40 shadow-none";
                }
              } else if (isSelected) {
                cardStyle =
                  "bg-[#CCFBF1] border-[#0D9488] border-[3.5px] ring-4 ring-[#0D9488] text-[#134E4A] shadow-[4px_4px_0px_#0D9488] scale-[1.01]";
              } else if (isAnswerLocked) {
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
                  disabled={!canClick}
                  onClick={() => handleSelectOption(optId)}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl border-[3px] flex items-center justify-between gap-3 text-left transition-all ${cardStyle} ${
                    canClick
                      ? "cursor-pointer active:translate-y-[2px] active:shadow-none"
                      : "cursor-default"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`w-9 h-9 rounded-xl border-[2.5px] border-[#134E4A] ${badgeStyle?.badgeBg || "bg-[#FEF3C7]"} text-[#134E4A] font-display text-base font-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#134E4A]`}
                    >
                      {letter}
                    </span>

                    <span className="font-black text-sm sm:text-base leading-snug break-words">
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

                  {/* Lencana Reveal Jawaban */}
                  {gamePhase === "REVEAL_ANSWER" && (
                    <div className="shrink-0 flex items-center">
                      {isCorrectOption && (
                        <span className="px-2.5 py-1 rounded-lg border-2 border-[#134E4A] bg-[#10B981] text-white text-[11px] font-black inline-flex items-center gap-1 shadow-[1.5px_1.5px_0px_#134E4A]">
                          <CheckSvg size={14} /> Benar
                        </span>
                      )}
                      {isUserWrongChoice && (
                        <span className="px-2.5 py-1 rounded-lg border-2 border-[#134E4A] bg-[#EF4444] text-white text-[11px] font-black inline-flex items-center gap-1 shadow-[1.5px_1.5px_0px_#134E4A]">
                          <XSvg size={14} /> Pilihanmu
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
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

      {/* Modal Peringatan Anti-Cheat Pelanggaran Tab */}
      {warningModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl border-[4px] border-[#134E4A] bg-white p-6 text-center shadow-[8px_8px_0px_#134E4A] space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 border-[3px] border-[#134E4A] flex items-center justify-center mx-auto text-rose-600">
              <AlertCircle size={32} />
            </div>
            <h3 className="font-display text-xl font-black text-[#134E4A]">
              Peringatan Anti-Cheat!
            </h3>
            <p className="text-sm font-bold text-[#134E4A]/80 leading-relaxed">
              {warningModal}
            </p>
            <div className="p-2 rounded-xl bg-amber-100 border border-[#134E4A] text-xs font-black text-amber-900">
              Pelanggaran: {violations} dari batas 3x
            </div>
            {!disqualified ? (
              <button
                type="button"
                onClick={() => setWarningModal(null)}
                className="w-full py-3 rounded-2xl border-2 border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all cursor-pointer"
              >
                Kembali ke Ujian
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/member/ngaji-ceria")}
                className="w-full py-3 rounded-2xl border-2 border-[#134E4A] bg-[#EF4444] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all cursor-pointer"
              >
                Keluar Arena
              </button>
            )}
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
    </div>
  );
}
