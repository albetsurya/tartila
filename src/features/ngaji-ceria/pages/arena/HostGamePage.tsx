import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  const [questions, setQuestions] = useState<any[]>([]);
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
  const [violations, setViolations] = useState<Array<{ nickname: string; violations: number }>>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const socketRef = useRef<ArenaSocket | null>(null);

  // Ambil roomId dari sessionStorage atau resolve dari PIN
  const [targetRoomId, setTargetRoomId] = useState<string | null>(() => {
    return sessionStorage.getItem("arena_room_id") || null;
  });

  // Fetch soal dari room_questions
  useEffect(() => {
    if (!pin) return;

    let cancelled = false;
    const load = async () => {
      try {
        let rId = targetRoomId;
        if (!rId) {
          const room = await arenaRoomService.getRoom(pin);
          if (room) {
            rId = room.id;
            setTargetRoomId(room.id);
            sessionStorage.setItem("arena_room_id", room.id);
          }
        }

        if (!rId) {
          setErrorMsg("Room dengan PIN ini tidak ditemukan. Silakan buat room ulang.");
          setLoadingQuestions(false);
          return;
        }

        const data = await arenaRoomService.getRoomQuestions(rId);
        if (cancelled) return;
        if (!data || data.length === 0) {
          setErrorMsg("Gagal memuat soal, silakan buat room ulang.");
        } else {
          setQuestions(data);
          setQuestionIndex(0);
          setTotalQuestions(data.length);
          setTimeLeft(data[0].timeLimitSeconds || 20);
        }
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
  }, [pin, targetRoomId]);

  const currentQuestion = questions[questionIndex] || null;

  const handleReveal = useCallback(() => {
    setRevealed(true);
    if (socketRef.current) socketRef.current.revealAnswer();
  }, []);

  const handleNext = useCallback(() => {
    if (questionIndex + 1 >= totalQuestions) {
      if (socketRef.current) socketRef.current.nextQuestion();
      navigate(`/arena/podium/${pin}`, {
        state: { leaderboard, kkm: 75 },
      });
      return;
    }
    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    setRevealed(false);
    setAnsweredCount(0);
    setTimeLeft(questions[nextIdx]?.timeLimitSeconds || 20);
    if (socketRef.current) socketRef.current.nextQuestion();
  }, [questionIndex, totalQuestions, pin, leaderboard, questions, navigate]);

  // Timer HANYA berjalan jika questions.length > 0 dan belum revealed
  useEffect(() => {
    if (questions.length === 0 || revealed || loadingQuestions || !currentQuestion || Boolean(errorMsg)) {
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
  }, [questions.length, revealed, loadingQuestions, currentQuestion, errorMsg, timeLeft, handleReveal]);

  // Connect socket saat soal sudah terbaca
  useEffect(() => {
    if (!pin || loadingQuestions || errorMsg) return;

    const socket = new ArenaSocket(pin, "host", true, {
      onRoomState: (state) => {
        if (state.status === "finished") {
          navigate(`/arena/podium/${pin}`, {
            state: { leaderboard: state.leaderboard || [], kkm: state.kkm || 75 },
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
        setCorrectAnswer(data.correctAnswer);
        setExplanation(data.explanation || "");
        if (data.leaderboard) setLeaderboard(data.leaderboard);
      },
      onNextQuestion: (data) => {
        setQuestionIndex(data.questionIndex);
        setTotalQuestions(data.totalQuestions);
        setTimeLeft(data.question?.timeLimitSeconds || 20);
        setRevealed(false);
        setAnsweredCount(0);
      },
      onGameFinished: (data) => {
        navigate(`/arena/podium/${pin}`, {
          state: { leaderboard: data.leaderboard, kkm: data.kkm },
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

    return () => {
      socket.disconnect();
    };
  }, [pin, loadingQuestions, errorMsg, questions.length, navigate]);

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
          sessionStorage.removeItem("arena_room_id");
          navigate("/member/ngaji-ceria/games");
        }}
        onCancel={() => setShowExitConfirm(false)}
      />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* State Error Merah: Tampil jika soal gagal dimuat */}
        {errorMsg && (
          <div className="rounded-3xl border-[4px] border-[#EF4444] bg-[#FEF2F2] p-8 text-center shadow-[6px_6px_0px_#EF4444] space-y-4">
            <div className="w-16 h-16 rounded-2xl border-[3px] border-[#EF4444] bg-[#FEE2E2] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#EF4444]">
              <AlertTriangleSvg size={32} className="text-[#EF4444]" />
            </div>
            <h2 className="font-display text-2xl font-black text-[#EF4444]">
              Gagal Memuat Soal
            </h2>
            <p className="text-sm font-bold text-[#7F1D1D] max-w-md mx-auto">
              {errorMsg}
            </p>
            <button
              type="button"
              onClick={() => navigate("/arena/create")}
              className="mt-2 px-6 py-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-sm shadow-[3px_3px_0px_#134E4A] hover:bg-[#0F766E] active:translate-y-[2px] active:shadow-[1px_1px_0px_#134E4A] transition-all"
            >
              Buat Room Ulang
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loadingQuestions && !errorMsg && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 border-4 border-[#134E4A] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-sm font-black text-[#134E4A]">Memuat soal permainan...</p>
          </div>
        )}

        {/* Layar Soal Utama: Tampil HANYA jika soal ada dan tidak error */}
        {currentQuestion && !loadingQuestions && !errorMsg && (
          <div className="space-y-6">
            {/* Top Control Bar: Progres Soal, Timer, & Jumlah Santri Menjawab */}
            <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#134E4A] flex items-center justify-between gap-4 flex-wrap">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60 block">
                  Progres Soal
                </span>
                <span className="font-display text-xl md:text-2xl font-black text-[#134E4A]">
                  Soal {questionIndex + 1} / {totalQuestions}
                </span>
              </div>

              {/* Timer Display */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#134E4A]/60">
                  Waktu Tersisa
                </span>
                <div
                  className={`w-14 h-14 rounded-full border-[3px] border-[#134E4A] flex items-center justify-center font-display text-2xl font-black shadow-[2px_2px_0px_#134E4A] ${
                    timeLeft <= 5 ? "bg-[#EF4444] text-white animate-pulse" : "bg-[#FEF08A] text-[#134E4A]"
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
                <span className="font-display text-xl md:text-2xl font-black text-[#0D9488]">
                  {answeredCount} / {totalPlayers}
                </span>
              </div>
            </div>

            {/* Violations Ticker (Peringatan Anti-Cheat) */}
            {violations.length > 0 && (
              <div className="p-3 rounded-2xl border-2 border-[#134E4A] bg-[#FEF3C7] flex items-center gap-2 shadow-[2px_2px_0px_#134E4A]">
                <AlertCircle size={18} className="text-[#B45309] shrink-0" />
                <div className="text-xs font-black text-[#78350F]">
                  Peringatan Pindah Tab:{" "}
                  {violations.map((v) => `${v.nickname} (${v.violations}x)`).join(", ")}
                </div>
              </div>
            )}

            {/* Card Soal Utama (Neo-Brutalism StickerCard) */}
            <div className="rounded-3xl border-[4px] border-[#134E4A] bg-[#F0FDF4] p-6 md:p-10 shadow-[6px_6px_0px_#134E4A] text-center space-y-4">
              <span className="inline-block px-3 py-1 rounded-full border-2 border-[#134E4A] bg-white text-xs font-black uppercase tracking-wider text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                Kategori: {currentQuestion.category || "tilawati"}
              </span>

              {/* Judul & Teks Soal */}
              {(currentQuestion.title || currentQuestion.prompt) && (
                <h1 className="font-display text-2xl md:text-3xl font-black text-[#134E4A] leading-relaxed max-w-3xl mx-auto">
                  {currentQuestion.prompt || currentQuestion.title}
                </h1>
              )}

              {/* Teks Arab (Jika Tersedia) */}
              {currentQuestion.arabicPrompt && (
                <p className="game-arabic text-3xl md:text-5xl font-black text-[#0D9488] py-2">
                  {currentQuestion.arabicPrompt}
                </p>
              )}

              {/* Tombol Audio Ayat (Jika Tersedia) */}
              {currentQuestion.audioUrl && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const audio = new Audio(getAudioUrl(currentQuestion.audioUrl) ?? currentQuestion.audioUrl);
                      audio.play();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-black text-sm shadow-[3px_3px_0px_#134E4A] active:scale-95 transition-all"
                  >
                    <Volume2 size={20} /> Putar Audio Ayat
                  </button>
                </div>
              )}

              {/* Grid 4 Pilihan Jawaban (A, B, C, D) 2x2 Neo-Brutalism */}
              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {currentQuestion.options.map((opt: any, idx: number) => {
                    const optId = opt.id || OPTION_LABELS[idx];
                    const optText = typeof opt === "string" ? opt : opt.text;
                    const isThisCorrect = revealed && (optId === correctAnswer || opt.isCorrect);

                    return (
                      <div
                        key={optId || idx}
                        className={`p-5 rounded-2xl border-[3px] border-[#134E4A] font-black text-lg flex items-center gap-4 transition-all shadow-[4px_4px_0px_#134E4A] ${
                          OPTION_COLORS[idx % OPTION_COLORS.length]
                        } ${
                          isThisCorrect
                            ? "ring-4 ring-[#FEF08A] scale-[1.02] shadow-[6px_6px_0px_#134E4A]"
                            : revealed
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        <span className="w-10 h-10 rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] flex items-center justify-center font-display text-xl font-black shrink-0 shadow-[2px_2px_0px_#134E4A]">
                          {OPTION_LABELS[idx] || optId}
                        </span>
                        <span className="flex-1 text-left">{optText}</span>
                        {isThisCorrect && (
                          <span className="w-8 h-8 rounded-full bg-white text-[#0D9488] flex items-center justify-center border-2 border-[#134E4A] shrink-0">
                            <CheckSvg size={20} stroke="#0D9488" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Penjelasan Saat Jawaban Terbuka */}
              {revealed && explanation && (
                <div className="p-4 rounded-2xl border-2 border-[#134E4A] bg-[#CCFBF1] text-[#134E4A] text-left text-sm font-bold shadow-[2px_2px_0px_#134E4A] flex items-start gap-2">
                  <LightbulbSvg size={20} className="shrink-0 text-[#F59E0B] mt-0.5" />
                  <div>
                    <span className="font-black">Penjelasan:</span> {explanation}
                  </div>
                </div>
              )}
            </div>

            {/* Papan Skor Sementara (Top 5) & Host Action Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Leaderboard Box Top 5 */}
              <div className="md:col-span-2 rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A]">
                <h3 className="font-display text-base font-black text-[#134E4A] flex items-center gap-2 mb-3">
                  <TrophySvg size={18} /> Papan Skor Sementara (Top 5)
                </h3>
                {leaderboard.length === 0 ? (
                  <p className="text-xs font-bold text-[#134E4A]/60 py-4 text-center">
                    Papan skor akan diperbarui setelah jawaban dikunci & diungkap.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.slice(0, 5).map((entry, idx) => (
                      <div
                        key={entry.playerId || idx}
                        className="flex items-center justify-between px-3 py-2 rounded-xl border-2 border-[#134E4A] bg-[#F0FDF4] text-xs font-black text-[#134E4A]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md border border-[#134E4A] bg-[#FEF08A] flex items-center justify-center font-black">
                            #{entry.rank || idx + 1}
                          </span>
                          <span>{entry.nickname || entry.name || "Santri"}</span>
                        </div>
                        <span className="font-display text-sm font-black text-[#0D9488]">
                          {entry.score || 0} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Host Control Actions */}
              <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] p-4 shadow-[4px_4px_0px_#134E4A] flex flex-col justify-center gap-3">
                {!revealed ? (
                  <button
                    type="button"
                    onClick={handleReveal}
                    className="w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-base shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] hover:bg-[#0F766E] transition-all flex items-center justify-center gap-2"
                  >
                    <KeyRoundSvg size={20} /> Kunci & Buka Jawaban
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-4 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] text-white font-black text-base shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-[2px_2px_0px_#134E4A] hover:bg-[#0F766E] transition-all flex items-center justify-center gap-2"
                  >
                    {questionIndex + 1 >= totalQuestions ? (
                      <>
                        <TrophySvg size={20} /> Lihat Podium Juara
                      </>
                    ) : (
                      <>
                        <ArrowRightSvg size={20} /> Soal Berikutnya
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </NgajiCeriaLayout>
  );
}
