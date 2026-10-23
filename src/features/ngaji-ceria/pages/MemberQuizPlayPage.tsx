import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "@/features/ngaji-ceria/components/NgajiCeriaLayout";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { useAuth } from "@/contexts/AuthContext";
import { MATERI_LABELS } from "@/data/learningCatalog";
import {
  getQuiz,
  scoreQuiz,
  submitQuizAttempt,
  type Quiz,
  type QuizScore,
} from "@/services/quizBankService";

export function MemberQuizPlayPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizScore | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const found = quizId ? await getQuiz(quizId) : undefined;
      if (!active) return;
      setQuiz(found ?? null);
      setAnswers(found ? new Array<number>(found.questions.length).fill(-1) : []);
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, [quizId]);

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!quiz || !user) return;
    setSubmitting(true);
    const attempt = await submitQuizAttempt(quiz.id, user.id, answers);
    setSubmitting(false);
    if (attempt) setResult(scoreQuiz(quiz, answers));
  };

  if (loading) {
    return (
      <NgajiCeriaLayout title="Kuis" hideNav>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-[3px] border-t-transparent"
            style={{ borderColor: "#134E4A", borderTopColor: "transparent" }}
            role="status"
            aria-label="Memuat"
          />
        </div>
      </NgajiCeriaLayout>
    );
  }

  if (!quiz) {
    return (
      <NgajiCeriaLayout title="Kuis" hideNav>
        <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-16 text-center">
          <TilaMascot size={110} mood="thinking" animation="float" direction="front" />
          <p className="mt-4 text-sm font-black text-[#134E4A]">
            Kuis tidak ditemukan
          </p>
          <p className="mt-1 text-xs font-semibold text-[#134E4A]/70">
            Kuis mungkin sudah dihapus ustadz. Hubungi pengajar kelasmu.
          </p>
          <StickerButton
            variant="primary"
            className="mt-6"
            onClick={() => navigate("/member/ngaji-ceria/kelas")}
          >
            Kembali ke Kelas
          </StickerButton>
        </div>
      </NgajiCeriaLayout>
    );
  }

  if (result) {
    const passed = result.percent >= 60;
    return (
      <NgajiCeriaLayout title="Hasil Kuis" hideNav>
        <div className="mx-auto w-full max-w-md space-y-4 px-4 py-8">
          <StickerCard className="flex flex-col items-center p-6 text-center">
            <TilaMascot
              size={110}
              mood={passed ? "happy" : "thinking"}
              animation="float"
              direction="front"
            />
            <p className="mt-4 text-2xl font-black text-[#134E4A]">
              {result.percent}
            </p>
            <p className="text-xs font-black uppercase text-[#134E4A]/60">
              Nilai Kuis
            </p>
            <p className="mt-2 text-sm font-semibold text-[#134E4A]/80">
              Benar {result.score} dari {result.total} soal
            </p>
            <p className="mt-1 text-xs font-bold text-[#134E4A]/70">
              {passed
                ? "Alhamdulillah, hasilnya bagus!"
                : "Semangat, ulangi materi lalu coba lagi ya."}
            </p>
          </StickerCard>

          <StickerCard className="space-y-2 p-4">
            <p className="text-xs font-black text-[#134E4A]">
              Pembahasan Jawaban
            </p>
            {quiz.questions.map((question, index) => {
              const chosen = answers[index];
              const correct = chosen === question.answerIndex;
              return (
                <div
                  key={question.id}
                  className={`rounded-xl border-2 p-2 ${
                    correct
                      ? "border-[#166534] bg-[#DCFCE7]"
                      : "border-[#B91C1C] bg-[#FEE2E2]"
                  }`}
                >
                  <p className="text-[11px] font-black text-[#134E4A]">
                    {index + 1}. {question.prompt}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#134E4A]/80">
                    Jawabanmu: {chosen >= 0 ? question.options[chosen] : "—"}
                    {!correct && (
                      <>
                        {" · "}
                        <span className="font-black">
                          Kunci: {question.options[question.answerIndex]}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </StickerCard>

          <StickerButton
            className="w-full"
            onClick={() => navigate("/member/ngaji-ceria/kelas")}
          >
            Kembali ke Kelas
          </StickerButton>
        </div>
      </NgajiCeriaLayout>
    );
  }

  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const allAnswered = answers.every((answer) => answer >= 0);

  return (
    <NgajiCeriaLayout title={quiz.title} hideNav>
      <div className="mx-auto w-full max-w-md space-y-4 px-4 py-6">
        <div className="flex items-center justify-between">
          <span className="rounded-lg border-2 border-[#134E4A] bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-black text-[#4C1D95]">
            {MATERI_LABELS[quiz.materi]}
          </span>
          <span className="text-[11px] font-black text-[#134E4A]/70">
            Soal {currentIndex + 1}/{quiz.questions.length}
          </span>
        </div>

        <StickerCard className="p-4">
          <p className="text-sm font-black text-[#134E4A]">{question.prompt}</p>
          <div className="mt-3 space-y-2">
            {question.options.map((option, optionIndex) => {
              const active = answers[currentIndex] === optionIndex;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(optionIndex)}
                  className={`w-full rounded-xl border-[3px] px-3 py-2 text-left text-xs font-bold transition-colors ${
                    active
                      ? "border-[#134E4A] bg-[#0D9488] text-white"
                      : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                  }`}
                >
                  <span className="mr-2 font-black">
                    {String.fromCharCode(65 + optionIndex)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </StickerCard>

        <div className="flex gap-2">
          <StickerButton
            variant="secondary"
            className="flex-1"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          >
            Sebelumnya
          </StickerButton>
          {isLast ? (
            <StickerButton
              variant="primary"
              className="flex-1"
              loading={submitting}
              disabled={!allAnswered}
              onClick={handleSubmit}
            >
              Kumpulkan
            </StickerButton>
          ) : (
            <StickerButton
              variant="primary"
              className="flex-1"
              onClick={() =>
                setCurrentIndex((prev) =>
                  Math.min(quiz.questions.length - 1, prev + 1),
                )
              }
            >
              Berikutnya
            </StickerButton>
          )}
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
