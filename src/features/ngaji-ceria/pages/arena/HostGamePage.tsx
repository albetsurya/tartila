import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  TrophySvg,
  CheckSvg,
  LightbulbSvg,
  KeyRoundSvg,
  AlertTriangleSvg,
} from "@/components/ui/CustomIcons";
import { ArenaSocket } from "../../services/arenaSocket";
import { arenaRoomService } from "@/services/arenaRoomService";
import { clearBotSimulatorState } from "../../hooks/useBotSimulator";
import LeaderboardModal from "@/features/ngaji-ceria/components/quiz-models/LeaderboardModal";
import { ArenaQuestionStage } from "../../components/multiplayer/ArenaQuestionStage";
import {
  MultiplayerAvatar,
  loadMultiplayerProfile,
} from "../../components/multiplayer/MultiplayerSetupSheet";
import { getQuizHubQuestions } from "../../data/quizHubData";

/**
 * Soal yang sudah disimpan Host disimpan juga di sessionStorage tab Host
 * (`arena_questions_<pin>`). RPC `get_room_questions_by_pin` sengaja tidak
 * mengembalikan `correct_answer`, jadi tanpa salinan ini Host tidak tahu kunci
 * jawaban saat membuka pembahasan. Tab santri tidak punya salinan tersebut.
 */
function readCachedQuestions(pin: string): any[] | null {
  try {
    const raw = sessionStorage.getItem(`arena_questions_${pin}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export default function HostGamePage() {
  const { pin } = useParams<{ pin: string }>();
  const navigate = useNavigate();

  const profile = useMemo(() => loadMultiplayerProfile(), []);
  const hostName =
    (typeof window !== "undefined"
      ? window.sessionStorage.getItem("arena_player_name")
      : null) ||
    profile?.displayName ||
    "Host";
  const hostAvatarId = profile?.avatarId || "boy-peci";

  const [questions, setQuestions] = useState<any[]>([]);
  const [roomType, setRoomType] = useState<string>("casual");
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [revealed, setRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [hostAnswer, setHostAnswer] = useState<string | null>(null);
  const [hostScore, setHostScore] = useState<number>(0);
  const hostScoreRef = useRef(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState<number | null>(null);
  // Soal versi server, dipakai hanya bila Host tidak punya salinan lokal.
  const [serverQuestion, setServerQuestion] = useState<any | null>(null);

  const socketRef = useRef<ArenaSocket | null>(null);
  // Effect socket sengaja tidak bergantung pada state yang berubah selama
  // permainan (soal, papan skor). Tanpa ref, setiap perubahan skor akan
  // membuat koneksi dibongkar-pasang dan start_game terkirim ulang sehingga
  // soal santri kembali ke nomor 1.
  const questionsRef = useRef<any[]>([]);
  const leaderboardRef = useRef<any[]>([]);

  // Ambil soal yang dipakai room. Utamakan salinan Host (lengkap dengan kunci
  // jawaban), lalu barulah RPC room_questions.
  useEffect(() => {
    if (!pin) return;

    let cancelled = false;
    const load = async () => {
      try {
        const room = await arenaRoomService.getRoom(pin);
        if (cancelled) return;
        if (!room) {
          setErrorMsg(
            "Room dengan PIN ini tidak ditemukan. Silakan buat room ulang.",
          );
          setLoadingQuestions(false);
          return;
        }
        sessionStorage.setItem("arena_room_id", room.id);
        const rType = room.room_type || (room as any).roomType;
        if (rType) setRoomType(rType);

        let loadedQuestions = readCachedQuestions(pin);
        if (!loadedQuestions) {
          loadedQuestions = await arenaRoomService.getRoomQuestions(pin);
          if (cancelled) return;
        }
        if (!loadedQuestions || loadedQuestions.length === 0) {
          const storedTheme =
            sessionStorage.getItem(`arena_theme_${pin}`) || "bahasa-arab";
          const fallbackHub = getQuizHubQuestions(
            storedTheme as any,
            "mcq",
            undefined,
            10,
          );
          if (fallbackHub && fallbackHub.length > 0) {
            loadedQuestions = fallbackHub.map((q, idx) => ({
              id: q.id || `q-${idx + 1}`,
              type: "multiple_choice",
              category: "arena",
              prompt: q.prompt,
              arabicPrompt:
                (q as any).arabicPrompt || q.arabicText || q.arabicTemplate,
              audioUrl: q.audioUrl,
              title: `Soal ${idx + 1}`,
              options: (q.options || []).map((opt: any, oIdx: number) => ({
                id: String.fromCharCode(65 + oIdx),
                text: typeof opt === "string" ? opt : opt.text || "",
              })),
              correctAnswer: Array.isArray(q.correctAnswer)
                ? q.correctAnswer[0]
                : q.correctAnswer || "",
              explanation: q.explanation || "",
              timeLimitSeconds: (q as any).timeLimitSeconds || 20,
              points: 1000,
            }));
          }
        }
        if (cancelled) return;
        if (!loadedQuestions || loadedQuestions.length === 0) {
          setErrorMsg("Gagal memuat soal, silakan buat room ulang.");
          setLoadingQuestions(false);
          return;
        }
        setQuestions(loadedQuestions);
        setQuestionIndex(0);
        setTotalQuestions(loadedQuestions.length);
        setTimeLeft(loadedQuestions[0].timeLimitSeconds || 20);
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

  const localQuestion = questions[questionIndex] || null;
  // Sumber utama = soal milik Host (yang dikirim ke server), fallback = soal
  // yang disiarkan server. Keduanya memakai panggung soal yang sama sehingga
  // teks dan pilihan A-D dijamin identik dengan layar santri.
  const currentQuestion = localQuestion || serverQuestion;
  const maxTime = currentQuestion?.timeLimitSeconds || 20;
  const timePercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  const isExamMode = roomType === "exam" || roomType === "ujian_resmi";

  questionsRef.current = questions;

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
        avatarId: list[hostIdx].avatarId || hostAvatarId,
      };
    } else {
      list.push({
        id: "host",
        playerId: "host",
        nickname: `${hostName} (Host)`,
        score: hostScore,
        isHost: true,
        avatarId: hostAvatarId,
        rank: 0,
      });
    }
    list.sort((a, b) => (b.score || 0) - (a.score || 0));
    return list.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [leaderboard, hostScore, hostName, hostAvatarId, isExamMode]);

  leaderboardRef.current = combinedLeaderboard;

  const handleHostSelectOption = useCallback(
    (optId: string) => {
      if (revealed || hostAnswer || timeLeft <= 0 || !currentQuestion) return;
      setHostAnswer(optId);

      const activeKey = (
        correctAnswer ||
        currentQuestion.correctAnswer ||
        currentQuestion.correct_answer ||
        ""
      ).toString();

      const optObj = (currentQuestion.options || []).find((o: any) => {
        const oId = typeof o === "string" ? o : o.id;
        return oId === optId;
      });
      const optText = optObj
        ? typeof optObj === "string"
          ? optObj
          : optObj.text
        : "";

      const isCorrect =
        Boolean(activeKey) &&
        (optId === activeKey ||
          optText === activeKey ||
          optObj?.isCorrect ||
          optId.toLowerCase() === activeKey.toLowerCase());

      if (isCorrect) {
        const maxT = currentQuestion.timeLimitSeconds || 20;
        const bonus = Math.round((Math.max(0, timeLeft) / maxT) * 500);
        const nextScore = hostScoreRef.current + (500 + bonus);
        hostScoreRef.current = nextScore;
        setHostScore(nextScore);
      }

      socketRef.current?.submitAnswer(currentQuestion.id, optId);
    },
    [revealed, hostAnswer, timeLeft, currentQuestion, correctAnswer],
  );

  const handleReveal = useCallback(() => {
    setRevealed(true);
    setRevealCountdown(4);
    socketRef.current?.revealAnswer();
  }, []);

  const handleShowLeaderboard = useCallback(() => {
    setRevealCountdown(null);
    setShowLeaderboard(true);
    socketRef.current?.showLeaderboard();
  }, []);

  const handleNext = useCallback(() => {
    setRevealCountdown(null);
    setShowLeaderboard(false);
    setHostAnswer(null);
    setServerQuestion(null);
    if (questionIndex + 1 >= totalQuestions) {
      socketRef.current?.nextQuestion();
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
    setTimeLeft(questions[nextIdx]?.timeLimitSeconds || 20);
    socketRef.current?.nextQuestion();
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
      // Bentuk harus sama persis dengan `ArenaQuestionInput` backend Go
      // (lihat normalizeArenaQuestion di arenaRoomService) supaya server
      // tidak menolak batch dan jauh ke soal dummy "soal contoh".
      const KNOWN_TYPES = [
        "text",
        "audio",
        "fill_blank",
        "image",
        "multiple_choice",
      ];
      const KNOWN_CATEGORIES = ["tilawati", "tajwid", "nabi"];
      return qs.map((q, idx) => {
        const rawType = String(q.type ?? "").toLowerCase();
        const options = (q.options || []).map((opt: any, oIdx: number) =>
          typeof opt === "string"
            ? { id: String.fromCharCode(65 + oIdx), text: opt }
            : {
                id: opt.id || String.fromCharCode(65 + oIdx),
                text: opt.text || opt.label || "",
                arabic: opt.arabic,
              },
        );
        const rawCategory = String(q.category ?? "").toLowerCase();
        return {
          id: q.id || `q-${idx + 1}`,
          type: KNOWN_TYPES.includes(rawType)
            ? rawType
            : options.length > 0
              ? "multiple_choice"
              : "text",
          category: KNOWN_CATEGORIES.includes(rawCategory)
            ? rawCategory
            : "tilawati",
          title: q.title || `Soal ${idx + 1}`,
          prompt: q.prompt || q.title || "",
          questionText: q.prompt || q.title || "",
          arabicPrompt: q.arabicPrompt,
          audioUrl: q.audioUrl,
          options,
          // Backend hanya menerima string; soal fill-in-the-blank memakai array.
          correctAnswer: Array.isArray(q.correctAnswer)
            ? String(q.correctAnswer[0] ?? "")
            : String(q.correctAnswer || q.correct_answer || ""),
          explanation: q.explanation || "",
          timeLimitSeconds: q.timeLimitSeconds || 20,
          points: Number(q.points) || 1000,
        };
      });
    };

    const startBroadcast = (socket: ArenaSocket) => {
      if (questionsRef.current.length === 0) return;
      socket.sendPhaseChanged("COUNTDOWN", 3);
      socket.startGame(formatQuestionsForWs(questionsRef.current));
    };

    const socket = new ArenaSocket(
      pin,
      "host",
      true,
      {
        // Kirim soal TEPAT saat socket terbuka. Sebelumnya pengiriman memakai
        // setTimeout(400ms) yang bisa mendahului handshake; pesan yang dikirim
        // saat socket belum OPEN dibuang diam-diam sehingga server kehabisan
        // soal dan seluruh santri menerima soal contoh.
        onOpen: () => startBroadcast(socket),
        onRoomState: (state) => {
          if (state.status === "finished") {
            navigate(`/arena/podium/${pin}`, {
              state: {
                leaderboard: leaderboardRef.current,
                kkm: 75,
                myScore: hostScoreRef.current,
                myName: `${hostName} (Host)`,
              },
            });
            return;
          }
          if (state.currentQuestion) {
            setServerQuestion(state.currentQuestion);
            setQuestionIndex(state.question);
            setTotalQuestions(state.totalQ);
            setTimeLeft(state.currentQuestion.timeLimitSeconds || 20);
          }
        },
        onGameStarted: (data) => {
          setQuestionIndex(data.questionIndex ?? 0);
          setTotalQuestions(data.totalQuestions ?? questionsRef.current.length);
          setTimeLeft(data.timeLimit || 20);
          setRevealed(false);
        },
        onQuestionResult: (data) => {
          setRevealed(true);
          setRevealCountdown(4);
          setCorrectAnswer(data.correctAnswer || "");
          setExplanation(data.explanation || "");
          if (data.leaderboard) setLeaderboard(data.leaderboard);
        },
        onShowLeaderboard: (data) => {
          setRevealCountdown(null);
          if (data.leaderboard) setLeaderboard(data.leaderboard);
          setShowLeaderboard(true);
        },
        onNextQuestion: (data) => {
          setServerQuestion(data.question);
          setQuestionIndex(data.questionIndex);
          setTotalQuestions(data.totalQuestions);
          setTimeLeft(data.question?.timeLimitSeconds || 20);
          setRevealed(false);
          setRevealCountdown(null);
          setShowLeaderboard(false);
          setHostAnswer(null);
        },
        onGameFinished: (data) => {
          navigate(`/arena/podium/${pin}`, {
            state: {
              leaderboard: leaderboardRef.current,
              kkm: data.kkm || 75,
              myScore: hostScoreRef.current,
              myName: `${hostName} (Host)`,
              winnerId: data.winnerId,
              outcome: data.outcome,
              isDraw: data.isDraw,
            },
          });
        },
        onError: (err) => {
          setErrorMsg(err || "Koneksi terputus ke server arena.");
        },
      },
      { nickname: hostName, avatarId: hostAvatarId },
    );

    socket.connect();
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      clearBotSimulatorState();
    };
  }, [pin, loadingQuestions, errorMsg, hostName, hostAvatarId, navigate]);

  const stageQuestion = currentQuestion;
  const activeCorrectAnswer = (
    correctAnswer ||
    stageQuestion?.correctAnswer ||
    stageQuestion?.correct_answer ||
    ""
  ).toString();

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
          navigate("/quiz-hub");
        }}
        onCancel={() => setShowExitConfirm(false)}
      />

      <div className="relative min-h-[100dvh] w-full bg-[#F0FDF4] pb-28 lg:pb-32 overflow-x-hidden select-none">
        {/* Pola Titik Taktis Arena */}
        <div
          className="pointer-events-none fixed inset-0 opacity-20 z-0"
          style={{
            backgroundImage: "radial-gradient(#0D9488 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-3.5 sm:px-4 pt-3 sm:pt-4 space-y-3.5">
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

          {stageQuestion && !loadingQuestions && !errorMsg && (
            <>
              {/* HUD RINGKAS: identitas host, timer, skor */}
              <section className="rounded-2xl border-[3.5px] border-[#134E4A] bg-white px-3 py-2.5 sm:px-4 shadow-[4px_4px_0px_#134E4A] space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <MultiplayerAvatar avatarId={hostAvatarId} size={32} />
                    <div className="min-w-0">
                      <span className="block text-[9px] font-black uppercase tracking-wider text-[#134E4A]/60 leading-none">
                        Host
                      </span>
                      <span className="block text-xs font-black text-[#134E4A] truncate max-w-[120px]">
                        {hostName}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg border-2 border-[#134E4A] bg-[#CCFBF1] text-[10px] font-black text-[#134E4A]">
                      PIN {pin}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-1 max-w-[220px] min-w-[140px]">
                    <div className="flex-1 h-3 rounded-full border-2 border-[#134E4A] bg-gray-100 overflow-hidden p-0.5">
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
                      className={`min-w-[46px] h-8 px-2 rounded-xl border-[2.5px] border-[#134E4A] flex items-center justify-center font-display text-sm font-black shadow-[2px_2px_0px_#134E4A] ${
                        revealed
                          ? "bg-gray-200 text-[#134E4A]"
                          : timeLeft <= 5
                            ? "bg-[#EF4444] text-white animate-pulse"
                            : "bg-[#FEF08A] text-[#134E4A]"
                      }`}
                    >
                      {/* Satuan detik, bukan hari: sebelumnya terbaca "5d" */}
                      {revealed ? "—" : `${timeLeft}s`}
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FEF08A] shadow-[2px_2px_0px_#134E4A] text-right shrink-0">
                    <span className="block text-[9px] font-black uppercase text-[#B45309] leading-none">
                      Skor Kamu
                    </span>
                    <span className="font-display text-sm font-black text-[#134E4A]">
                      {hostScore} pts
                    </span>
                  </div>
                </div>
              </section>

              {/* PANGGUNG SOAL: komponen yang sama persis dengan layar santri */}
              <ArenaQuestionStage
                question={stageQuestion}
                questionIndex={questionIndex}
                totalQuestions={totalQuestions}
                selectedOptionId={hostAnswer}
                revealed={revealed}
                correctAnswer={activeCorrectAnswer}
                hideOptions={isExamMode}
                disabled={revealed || Boolean(hostAnswer) || timeLeft <= 0}
                onSelect={handleHostSelectOption}
                footer={
                  <div className="space-y-3">
                    {isExamMode && (
                      <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] p-4 text-center shadow-[3px_3px_0px_#134E4A]">
                        <span className="inline-block px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] text-[10px] font-black uppercase">
                          Mode Pengawas Ujian
                        </span>
                        <p className="mt-2 text-xs font-bold text-[#134E4A]/70">
                          Opsi dan kunci jawaban disembunyikan selama ujian
                          berlangsung.
                        </p>
                      </div>
                    )}

                    {revealed && (
                      <div className="p-3.5 rounded-2xl border-[3px] border-[#134E4A] bg-[#CCFBF1] text-[#134E4A] shadow-[3px_3px_0px_#134E4A] space-y-1.5 text-left">
                        <div className="flex items-center gap-2">
                          <CheckSvg size={16} stroke="#0D9488" />
                          <span className="font-display text-xs font-black uppercase text-[#0F766E]">
                            Kunci Jawaban Resmi:
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md border border-[#134E4A] bg-[#FEF08A] font-black text-xs text-[#134E4A]">
                            {activeCorrectAnswer || "—"}
                          </span>
                        </div>
                      </div>
                    )}

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
                  </div>
                }
              />
            </>
          )}
        </div>

        {/* FLOATING DOCK BAWAH: tombol kontrol, tidak menutupi soal */}
        {stageQuestion && !loadingQuestions && !errorMsg && (
          <div className="fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-[#F0FDF4] via-[#F0FDF4]/95 to-transparent">
            <div className="max-w-2xl mx-auto rounded-2xl border-[3.5px] border-[#134E4A] bg-[#FFFBEB] p-2.5 shadow-[0_-3px_0px_#134E4A,4px_4px_0px_#134E4A] flex items-center justify-between gap-3">
              <span className="text-[11px] font-black text-[#134E4A]/70 truncate">
                {revealed
                  ? `Klasemen terbuka otomatis dalam ${revealCountdown ?? 0}s`
                  : hostAnswer
                    ? "Jawabanmu tersimpan. Tunggu santri atau kunci sekarang."
                    : "Pilih jawabanmu sebelum waktu habis"}
              </span>

              {!revealed ? (
                <button
                  type="button"
                  onClick={handleReveal}
                  className="py-2.5 px-4 rounded-xl border-[2.5px] border-[#134E4A] bg-[#0D9488] hover:bg-[#0F766E] text-white font-display font-black text-[11px] sm:text-xs uppercase shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <KeyRoundSvg size={15} />
                  <span>Kunci &amp; Buka Jawaban</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleShowLeaderboard}
                  className="py-2.5 px-4 rounded-xl border-[2.5px] border-[#134E4A] bg-[#EA580C] hover:bg-[#C2410C] text-white font-display font-black text-[11px] sm:text-xs uppercase shadow-[2.5px_2.5px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <TrophySvg size={15} />
                  <span>
                    Leaderboard{" "}
                    {revealCountdown !== null ? `(${revealCountdown}s)` : ""}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Leaderboard Full-Screen Host */}
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
