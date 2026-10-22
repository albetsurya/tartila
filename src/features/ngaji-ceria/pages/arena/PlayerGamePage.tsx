import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Volume2, AlertCircle } from "@/components/ui/CustomIcons";
import { ArenaSocket } from "../../services/arenaSocket";
import type { ClientQuestionPayload } from "../../data/quiz/types";

const BUTTON_COLORS = [
  { id: "A", bg: "bg-[#EF4444]", hover: "hover:bg-red-600", shape: "▲" },
  { id: "B", bg: "bg-[#3B82F6]", hover: "hover:bg-blue-600", shape: "◆" },
  { id: "C", bg: "bg-[#EAB308]", hover: "hover:bg-yellow-600", shape: "●" },
  { id: "D", bg: "bg-[#10B981]", hover: "hover:bg-emerald-600", shape: "■" },
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
  const [nickname] = useState(() => sessionStorage.getItem("arena_player_name") || "Santri");

  const [question, setQuestion] = useState<ClientQuestionPayload | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; scoreAwarded: number; totalScore: number } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const totalScoreRef = useRef(0);
  const [violations, setViolations] = useState(0);
  const [warningModal, setWarningModal] = useState<string | null>(null);
  const [disqualified, setDisqualified] = useState(false);

  const socketRef = useRef<ArenaSocket | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  // Anti-Cheat: Record Tab Switch
  const handleTabSwitch = useCallback(() => {
    if (disqualified) return;
    socketRef.current?.recordViolation();
  }, [disqualified]);

  useEffect(() => {
    if (!pin) return;

    // Masuk ke fullscreen jika didukung
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          // Abaikan jika browser memblokir tanpa user gesture awal
        });
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
              questionStartRef.current = Date.now();
              setSelectedAnswer(null);
              setHasAnswered(false);
              setResult(null);
            }
            return state.currentQuestion;
          });
          setQuestionIndex(state.question);
          setTotalQuestions(state.totalQ);
        }
      },
      onGameStarted: (data) => {
        setQuestion(data.question);
        setQuestionIndex(data.questionIndex);
        setTotalQuestions(data.totalQuestions);
        setSelectedAnswer(null);
        setHasAnswered(false);
        setResult(null);
        questionStartRef.current = Date.now();
      },
      onAnswerAcknowledged: (data) => {
        setResult(data);
        setTotalScore(data.totalScore);
        totalScoreRef.current = data.totalScore;
      },
      onQuestionResult: (_data) => {
        // Hasil ronde diumumkan
      },
      onNextQuestion: (data) => {
        setQuestion(data.question);
        setQuestionIndex(data.questionIndex);
        setTotalQuestions(data.totalQuestions);
        setSelectedAnswer(null);
        setHasAnswered(false);
        setResult(null);
        questionStartRef.current = Date.now();
      },
      onGameFinished: (data) => {
        navigate(`/arena/podium/${pin}`, {
          state: { leaderboard: data.leaderboard, kkm: data.kkm, myScore: totalScoreRef.current, myName: nickname },
        });
      },
      onViolationWarning: (data) => {
        setViolations(data.violations);
        setWarningModal(
          data.autoSubmitted
            ? "Kamu telah melanggar 3x berpindah tab. Sesi ujian kamu dihentikan otomatis!"
            : `Peringatan (${data.violations}/3): Jangan tinggalkan layar ujian!`
        );
        if (data.autoSubmitted) {
          setDisqualified(true);
        }
      },
    });

    socket.connect();
    socketRef.current = socket;

    // Pasang listener pindah tab / visibilitychange (Anti-Cheat Tahap 7)
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
  }, [pin, playerId, nickname, navigate, handleTabSwitch, totalScore]);

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered || !question || disqualified) return;

    const timeTakenMs = Date.now() - questionStartRef.current;
    setSelectedAnswer(optionId);
    setHasAnswered(true);

    socketRef.current?.submitAnswer(question.id, optionId, timeTakenMs);
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#F0FDF4] overflow-hidden select-none">
      {/* HUD Header Santri */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b-[3px] border-[#134E4A] shadow-[0px_2px_0px_#134E4A] z-20">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block">
            Santri
          </span>
          <span className="font-black text-sm text-[#134E4A]">{nickname}</span>
        </div>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block">
            Soal
          </span>
          <span className="font-display text-base font-black text-[#134E4A]">
            {questionIndex + 1} / {totalQuestions || 1}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block">
            Skor
          </span>
          <span className="font-display text-base font-black text-[#0D9488]">
            {totalScore} pts
          </span>
        </div>
      </header>

      {/* Area Pertanyaan / Status Menunggu */}
      <main className="flex-1 w-full flex flex-col p-4 justify-between max-w-lg mx-auto overflow-hidden">
        {/* Banner Soal Singkat atau Pertanyaan Audio */}
        {question && (
          <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[3px_3px_0px_#134E4A] text-center space-y-2 shrink-0">
            <p className="text-sm font-black text-[#134E4A] line-clamp-3">
              {question.prompt}
            </p>
            {question.arabicPrompt && (
              <p className="game-arabic text-3xl font-black text-[#0D9488]">
                {question.arabicPrompt}
              </p>
            )}
            {question.audioUrl && (
              <button
                type="button"
                onClick={() => {
                  const audio = new Audio(question.audioUrl);
                  audio.play();
                }}
                className="px-4 py-2 rounded-xl border-2 border-[#134E4A] bg-[#FEF3C7] text-[#134E4A] font-black text-xs shadow-[2px_2px_0px_#134E4A] inline-flex items-center gap-1.5 active:scale-95"
              >
                <Volume2 size={16} /> Putar Suara
              </button>
            )}
          </div>
        )}

        {/* Status Feedback Setelah Santri Memilih Jawaban */}
        {hasAnswered && (
          <div className="my-auto text-center p-6 rounded-3xl border-[4px] border-[#134E4A] bg-white shadow-[6px_6px_0px_#134E4A] space-y-2 animate-in zoom-in-95 duration-200">
            {result ? (
              result.isCorrect ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#10B981] border-[3px] border-[#134E4A] text-white flex items-center justify-center text-3xl font-black mx-auto shadow-[2px_2px_0px_#134E4A]">
                    ✓
                  </div>
                  <h2 className="font-display text-2xl font-black text-[#0D9488]">
                    Luar Biasa! Benar!
                  </h2>
                  <p className="font-display text-lg font-black text-[#134E4A]">
                    +{result.scoreAwarded} Poin
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#EF4444] border-[3px] border-[#134E4A] text-white flex items-center justify-center text-3xl font-black mx-auto shadow-[2px_2px_0px_#134E4A]">
                    ✕
                  </div>
                  <h2 className="font-display text-2xl font-black text-[#EF4444]">
                    Belum Tepat
                  </h2>
                  <p className="text-xs font-bold text-[#134E4A]/70">
                    Tetap semangat di soal berikutnya!
                  </p>
                </>
              )
            ) : (
              <>
                <div className="w-12 h-12 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="font-display text-xl font-black text-[#134E4A]">
                  Jawaban Terkirim!
                </h3>
                <p className="text-xs font-bold text-[#134E4A]/70">
                  Menunggu host mengumumkan hasil ronde...
                </p>
              </>
            )}
          </div>
        )}

        {/* 4 Tombol Raksasa (A, B, C, D) Kahoot-Style */}
        <div className="grid grid-cols-2 gap-3 w-full h-[52vh] shrink-0 pt-2">
          {BUTTON_COLORS.map((btn) => {
            const isSelected = selectedAnswer === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                disabled={hasAnswered || !question || disqualified}
                onClick={() => handleSelectOption(btn.id)}
                className={`w-full h-full rounded-3xl border-[4px] border-[#134E4A] flex flex-col items-center justify-center gap-2 font-display text-4xl font-black text-white shadow-[6px_6px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] transition-all disabled:opacity-40 ${
                  btn.bg
                } ${isSelected ? "ring-4 ring-white scale-[1.03]" : ""}`}
              >
                <span className="text-3xl opacity-80">{btn.shape}</span>
                <span>{btn.id}</span>
              </button>
            );
          })}
        </div>
      </main>

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
                className="w-full py-3 rounded-2xl border-2 border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all"
              >
                Kembali ke Ujian
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/member/ngaji-ceria")}
                className="w-full py-3 rounded-2xl border-2 border-[#134E4A] bg-[#EF4444] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all"
              >
                Keluar Arena
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
