import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { useAuth } from "@/contexts/AuthContext";
import { deleteQuiz, listQuizzes, type Quiz } from "@/services/quizBankService";
import { MATERI_LABELS } from "@/data/learningCatalog";

export function UstadzQuizListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await listQuizzes();
      const userQuiz = all.filter((q) => q.createdBy === user?.id);
      setQuizzes(userQuiz);
      setLoading(false);
    };
    void load();
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    await deleteQuiz(id);
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  if (loading) {
    return (
      <>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-[3px] border-t-transparent"
            style={{ borderColor: "#134E4A", borderTopColor: "transparent" }}
            role="status"
            aria-label="Memuat"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-5xl space-y-4">
        <StickerButton
          className="w-full"
          onClick={() => navigate("/ustadz/kuis/baru")}
        >
          + Buat Kuis Baru
        </StickerButton>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-[#134E4A]">
            Kuis Saya ({quizzes.length})
          </h2>
          <Link
            to="/ustadz/kurikulum"
            className="text-xs font-bold underline text-[#0D9488]"
          >
            Kurikulum
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <StickerCard className="p-6 text-center">
            {/* Ilustrasi topi wisuda kosong bergaya Neo-Brutalism */}
            <svg
              viewBox="0 0 200 140"
              className="mx-auto h-32 w-52"
              role="img"
              aria-label="Ilustrasi bank kuis masih kosong"
            >
              <rect
                x="30"
                y="24"
                width="140"
                height="96"
                rx="14"
                fill="#E9D5FF"
                stroke="#0A2540"
                strokeWidth="5"
              />
              <path
                d="M100 42 L148 60 L100 78 L52 60 Z"
                fill="#0D9488"
                stroke="#0A2540"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path
                d="M126 68 L126 88 L128 92 L126 96"
                fill="none"
                stroke="#0A2540"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="132" cy="98" r="5" fill="#FF6B6B" stroke="#0A2540" strokeWidth="4" />
              <rect
                x="70"
                y="94"
                width="60"
                height="6"
                rx="3"
                fill="#0A2540"
                opacity="0.35"
              />
              <rect
                x="70"
                y="106"
                width="38"
                height="6"
                rx="3"
                fill="#0A2540"
                opacity="0.2"
              />
            </svg>
            <p className="mt-3 text-sm font-black text-[#134E4A]">
              Wah, bank kuis masih kosong. Yuk buat kuis pertamamu dan ukur
              pemahaman santri!
            </p>
            <StickerButton
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => navigate("/ustadz/kuis/baru")}
            >
              Buat Kuis Baru
            </StickerButton>
          </StickerCard>
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <StickerCard
                key={quiz.id}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#134E4A]">
                      {quiz.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <span className="rounded-lg border-2 border-[#134E4A] bg-[#FDE68A] px-2 py-0.5 text-[10px] font-black text-[#92400E]">
                        {MATERI_LABELS[quiz.materi]}
                      </span>
                      {quiz.targetJilid !== null && (
                        <span className="rounded-lg border-2 border-[#134E4A] bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-black text-[#7C2D12]">
                          Jilid {quiz.targetJilid}
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-[#134E4A]/70">
                        {quiz.questions.length} soal
                      </span>
                    </div>
                  </div>
                  <StickerButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(quiz.id)}
                  >
                    Hapus
                  </StickerButton>
                </div>
              </StickerCard>
            ))}
          </div>
        )}
      </div>
    </>
  );
}