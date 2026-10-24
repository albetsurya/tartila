import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  Volume2,
  TrophySvg,
  AlertCircle,
  CheckSvg,
  LightbulbSvg,
  KeyRoundSvg,
  ArrowRightSvg,
} from "@/components/ui/CustomIcons";
import { ArenaSocket } from "../../services/arenaSocket";
import type { ClientQuestionPayload } from "../../data/quiz/types";
import { getAudioUrl } from "../../utils/audioUrl";

const OPTION_COLORS = [
  "bg-[#EF4444] text-white", // Red
  "bg-[#3B82F6] text-white", // Blue
  "bg-[#EAB308] text-white", // Yellow
  "bg-[#10B981] text-white", // Green
];

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function HostGamePage() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<ClientQuestionPayload | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [violations, setViolations] = useState<Array<{ nickname: string; violations: number }>>([]);

  const socketRef = useRef<ArenaSocket | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!pin) return;

    const socket = new ArenaSocket(pin, "host", true, {
      onRoomState: (state) => {
        if (state.status === "finished") {
          navigate(`/arena/podium/${pin}`, {
            state: { leaderboard: state.leaderboard || [], kkm: state.kkm || 75 },
          });
          return;
        }
        if (state.currentQuestion) {
          setQuestion(state.currentQuestion);
          setQuestionIndex(state.question);
          setTotalQuestions(state.totalQ);
          setTimeLeft(state.currentQuestion.timeLimitSeconds || 20);
        }
        if (state.players) {
          setTotalPlayers(state.players.length);
        }
      },
      onGameStarted: (data) => {
        setQuestion(data.question);
        setQuestionIndex(data.questionIndex);
        setTotalQuestions(data.totalQuestions);
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
        setCorrectAnswer(data.correctAnswer);
        setExplanation(data.explanation || "");
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      },
      onNextQuestion: (data) => {
        setQuestion(data.question);
        setQuestionIndex(data.questionIndex);
        setTotalQuestions(data.totalQuestions);
        setTimeLeft(data.question.timeLimitSeconds || 20);
        setRevealed(false);
        setAnsweredCount(0);
      },
      onGameFinished: (data) => {
        // Kuis selesai -> navigasi ke podium / laporan
        navigate(`/arena/podium/${pin}`, { state: { leaderboard: data.leaderboard, kkm: data.kkm } });
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

    return () => {
      socket.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pin, navigate]);

  // Countdown timer
  useEffect(() => {
    if (revealed || timeLeft <= 0) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question, revealed]);

  const handleReveal = () => {
    socketRef.current?.revealAnswer();
  };

  const handleNext = () => {
    socketRef.current?.nextQuestion();
  };

  return (
    <NgajiCeriaLayout title={`Tartila Arena Host - PIN ${pin}`}>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Top Control Bar: Ronde, Timer, & Stats */}
        <div className="rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A] flex items-center justify-between gap-4 flex-wrap">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block">
              Progres Soal
            </span>
            <span className="font-display text-2xl font-black text-[#134E4A]">
              Soal {questionIndex + 1} / {totalQuestions || 1}
            </span>
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60">
              Waktu Tersisa
            </span>
            <div
              className={`w-14 h-14 rounded-full border-[3px] border-[#134E4A] flex items-center justify-center font-display text-2xl font-black shadow-[2px_2px_0px_#134E4A] ${
                timeLeft <= 5 ? "bg-[#FF6B6B] text-white animate-pulse" : "bg-[#FEF3C7] text-[#134E4A]"
              }`}
            >
              {timeLeft}
            </div>
          </div>

          {/* Jawaban Masuk */}
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block">
              Santri Menjawab
            </span>
            <span className="font-display text-2xl font-black text-[#0D9488]">
              {answeredCount} / {totalPlayers}
            </span>
          </div>
        </div>

        {/* Violations Ticker (Anti-Cheat Notice) */}
        {violations.length > 0 && (
          <div className="p-3 rounded-2xl border-2 border-[#134E4A] bg-amber-100 flex items-center gap-2 shadow-[2px_2px_0px_#134E4A]">
            <AlertCircle size={18} className="text-amber-800 shrink-0" />
            <div className="text-xs font-black text-amber-900">
              Peringatan Pindah Tab:{" "}
              {violations.map((v) => `${v.nickname} (${v.violations}x)`).join(", ")}
            </div>
          </div>
        )}

        {/* Layar Soal Utama (Tampil di Proyektor / Layar Host) */}
        {question && (
          <div className="rounded-3xl border-[4px] border-[#134E4A] bg-[#F0FDF4] p-6 md:p-10 shadow-[6px_6px_0px_#134E4A] text-center space-y-4">
            <span className="inline-block px-3 py-1 rounded-full border-2 border-[#134E4A] bg-white text-xs font-black uppercase tracking-wider text-[#134E4A]">
              Kategori: {question.category} · {question.type}
            </span>

            <h1 className="font-display text-2xl md:text-4xl font-black text-[#134E4A] leading-relaxed max-w-3xl mx-auto">
              {question.prompt}
            </h1>

            {question.arabicPrompt && (
              <p className="game-arabic text-4xl md:text-5xl font-black text-[#0D9488] py-2">
                {question.arabicPrompt}
              </p>
            )}

            {question.audioUrl && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const audio = new Audio(getAudioUrl(question.audioUrl) ?? question.audioUrl);
                    audio.play();
                  }}
                  className="px-6 py-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] text-[#134E4A] font-black text-sm shadow-[3px_3px_0px_#134E4A] inline-flex items-center gap-2 active:scale-95"
                >
                  <Volume2 size={20} /> Putar Audio Ayat
                </button>
              </div>
            )}

            {/* Grid 4 Pilihan Jawaban */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {question.options.map((opt, idx) => {
                const isThisCorrect = revealed && opt.id === correctAnswer;
                return (
                  <div
                    key={opt.id}
                    className={`p-5 rounded-2xl border-[3px] border-[#134E4A] font-black text-lg flex items-center gap-4 transition-all shadow-[4px_4px_0px_#134E4A] ${
                      OPTION_COLORS[idx % OPTION_COLORS.length]
                    } ${isThisCorrect ? "ring-4 ring-amber-400 scale-[1.02]" : revealed ? "opacity-40" : ""}`}
                  >
                    <span className="w-10 h-10 rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] flex items-center justify-center font-display text-xl font-black shrink-0">
                      {OPTION_LABELS[idx]}
                    </span>
                    <span className="flex-1 text-left">{opt.text}</span>
                    {isThisCorrect && <CheckSvg size={24} className="text-[#0D9488]" />}
                  </div>
                );
              })}
            </div>

            {/* Penjelasan Saat Reveal */}
            {revealed && explanation && (
              <div className="flex items-start gap-2 p-4 rounded-2xl border-2 border-[#134E4A] bg-[#CCFBF1] text-[#134E4A] text-left text-sm font-bold shadow-[2px_2px_0px_#134E4A]">
                <LightbulbSvg size={18} className="shrink-0 text-[#F59E0B] mt-0.5" />
                <div>
                  <span className="font-black">Penjelasan:</span> {explanation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Top 5 Leaderboard & Host Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top 5 Box */}
          <div className="md:col-span-2 rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A]">
            <h3 className="font-display text-base font-black text-[#134E4A] flex items-center gap-2 mb-3">
              <TrophySvg size={18} /> Papan Skor Sementara (Top 5)
            </h3>
            {leaderboard.length === 0 ? (
              <p className="text-xs font-bold text-[#134E4A]/60 py-4 text-center">
                Papan skor akan diperbarui setelah jawaban diungkap.
              </p>
            ) : (
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry) => (
                  <div
                    key={entry.playerId}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border-2 border-[#134E4A] bg-[#F0FDF4] text-xs font-black text-[#134E4A]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md border border-[#134E4A] bg-[#FEF3C7] flex items-center justify-center font-black">
                        #{entry.rank}
                      </span>
                      <span>{entry.nickname}</span>
                    </div>
                    <span className="font-display text-sm font-black text-[#0D9488]">
                      {entry.score} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Host Action Buttons */}
          <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-4 shadow-[4px_4px_0px_#134E4A] flex flex-col justify-center gap-3">
            {!revealed ? (
              <button
                type="button"
                onClick={handleReveal}
                className="inline-flex items-center justify-center gap-1.5 w-full py-4 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all"
              >
                Kunci & Buka Jawaban <KeyRoundSvg size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-1.5 w-full py-4 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all"
              >
                {questionIndex + 1 >= totalQuestions ? (
                  <>
                    Lihat Podium Juara <TrophySvg size={16} />
                  </>
                ) : (
                  <>
                    Soal Berikutnya <ArrowRightSvg size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
