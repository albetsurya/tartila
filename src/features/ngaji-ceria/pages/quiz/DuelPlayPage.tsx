import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { QuizEngine } from "../../components/quiz-models/QuizEngine";
import { getQuizHubQuestions } from "../../data/quizHubData";
import { duelService } from "@/services/duelService";
import { soundManager } from "../../services/soundManager";
import { triggerBibiReaction } from "@/utils/tilaEvent";
import { StickerButton } from "@/components/ui/StickerButton";
import { ClockSvg, WhatsAppSvg } from "@/components/ui/CustomIcons";

const QUESTION_TIME = 20;

function ScoreCard({
  label,
  score,
  bg,
  textColor = "text-[#134E4A]",
}: {
  label: string;
  score: number;
  bg: string;
  textColor?: string;
}) {
  return (
    <div
      className={`flex min-w-[84px] flex-col items-center rounded-xl border-[3px] border-[#134E4A] ${bg} px-3 py-1.5 shadow-[4px_4px_0px_#134E4A]`}
    >
      <span
        className={`font-display text-[10px] font-black uppercase tracking-wide ${textColor} opacity-80`}
      >
        {label}
      </span>
      <span className={`font-display text-2xl font-black leading-none ${textColor}`}>
        {score}
      </span>
    </div>
  );
}

export default function DuelPlayPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const questions = useMemo(
    () => getQuizHubQuestions("bahasa-arab", "mcq", undefined, 5),
    [],
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hostScore, setHostScore] = useState(0);
  const [guestScore, setGuestScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [answered, setAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  // TODO: Ganti dengan pengecekan user ID dari backend
  const [isHost] = useState(true);

  const hostScoreRef = useRef(0);
  const guestScoreRef = useRef(0);

  const finishDuel = async () => {
    setIsFinished(true);
    const finalMyScore = isHost ? hostScoreRef.current : guestScoreRef.current;
    // TODO(backend): skor lawan masih mock acak. Backend Go belum punya kontrak duel
    // (tidak ada /api/v1/duel/*, tabel duel_sessions, atau tipe pesan duel di WS).
    // Ganti dengan duelService.getDuelSession + submitDuelScore begitu endpoint tersedia.
    setOpponentScore(Math.floor(Math.random() * (questions.length + 1)));
    try {
      await duelService.submitDuelScore(sessionId ?? "", finalMyScore);
    } finally {
      setResultReady(true);
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
    setAnswered(false);
  };

  useEffect(() => {
    if (isFinished || answered) return;
    if (timeLeft <= 0) {
      advanceRef.current();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isFinished, answered]);

  const handleAnswer = (isCorrect: boolean) => {
    if (answered || isFinished) return;
    setAnswered(true);
    if (!isCorrect) return;
    if (isHost) {
      hostScoreRef.current += 1;
      setHostScore(hostScoreRef.current);
    } else {
      guestScoreRef.current += 1;
      setGuestScore(guestScoreRef.current);
    }
  };

  const handleNext = () => {
    soundManager.playSfx("tap");
    advanceRef.current();
  };

  const currentQuestion = questions[currentQuestionIndex] ?? questions[0];
  const myScore = isHost ? hostScore : guestScore;
  const result: "win" | "lose" | "draw" =
    myScore > opponentScore ? "win" : myScore < opponentScore ? "lose" : "draw";
  const resultTitle =
    result === "win" ? "KAMU MENANG!" : result === "lose" ? "KAMU KALAH" : "SERI";
  const resultColor =
    result === "win"
      ? "text-[#0D9488]"
      : result === "lose"
        ? "text-[#FF6B6B]"
        : "text-[#134E4A]";

  const resultMessage =
    result === "win" ? "Aku menang" : result === "lose" ? "Aku kalah" : "Kita seri";

  const handleShareWhatsApp = () => {
    triggerBibiReaction("click");
    soundManager.playSfx("tap");
    const text = `Aku baru saja selesai Duel Kuis Tartila! Skor akhirku: ${myScore}, Skor Lawan: ${opponentScore}. ${resultMessage}! Ayo tantang aku di Tartila!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  useEffect(() => {
    if (!isFinished) return;
    triggerBibiReaction(
      result === "win" ? "success" : result === "lose" ? "error" : "click",
    );
  }, [isFinished, result]);

  return (
    <div className="min-h-dvh overflow-hidden bg-[#F0FDF4] font-sans text-[#134E4A]">
      <header className="sticky top-0 z-30 border-b-[3px] border-[#134E4A] bg-white shadow-[0_2px_0_#134E4A]">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-3 py-2">
          <ScoreCard label="Kamu" score={myScore} bg="bg-[#FEF08A]" />
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-white shadow-[3px_3px_0px_#134E4A]">
            <ClockSvg size={18} />
            <span className="font-display text-lg font-black leading-none">
              {timeLeft}
            </span>
          </div>
          <ScoreCard
            label="Lawan"
            score={opponentScore}
            bg="bg-[#FF6B6B]"
            textColor="text-white"
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md overflow-hidden px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full border-2 border-[#134E4A] bg-[#CCFBF1] px-3 py-1 font-display text-xs font-black uppercase text-[#134E4A]">
            Soal {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>

        <QuizEngine
          key={`${currentQuestionIndex}-${currentQuestion.id}`}
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          onAnswerSubmit={handleAnswer}
          onNext={handleNext}
        />
      </main>

      <AnimatePresence>
        {isFinished && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#134E4A]/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="w-full max-w-sm rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 text-center shadow-[4px_4px_0px_#134E4A]"
            >
              <h2 className={`font-display text-3xl font-black ${resultColor}`}>
                {resultTitle}
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] p-3 shadow-[4px_4px_0px_#134E4A]">
                  <p className="font-display text-xs font-black uppercase text-[#134E4A]/70">
                    Kamu
                  </p>
                  <p className="font-display text-3xl font-black text-[#134E4A]">
                    {myScore}
                  </p>
                </div>
                <div className="rounded-2xl border-[3px] border-[#134E4A] bg-[#FF6B6B] p-3 shadow-[4px_4px_0px_#134E4A]">
                  <p className="font-display text-xs font-black uppercase text-white/80">
                    Lawan
                  </p>
                  <p className="font-display text-3xl font-black text-white">
                    {opponentScore}
                  </p>
                </div>
              </div>

              {resultReady && (
                <StickerButton
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="mt-6 border-[#134E4A] bg-[#25D366] text-white shadow-[4px_4px_0px_#134E4A]"
                  onClick={handleShareWhatsApp}
                >
                  <WhatsAppSvg size={20} />
                  Bagikan ke WhatsApp
                </StickerButton>
              )}

              <StickerButton
                variant="secondary"
                size="lg"
                fullWidth
                className="mt-3"
                onClick={() => {
                  triggerBibiReaction("click");
                  soundManager.playSfx("tap");
                  navigate("/member/ngaji-ceria/games");
                }}
              >
                Kembali ke Game
              </StickerButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
