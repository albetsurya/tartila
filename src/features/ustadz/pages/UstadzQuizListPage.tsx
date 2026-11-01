import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StickerButton } from "@/components/ui/StickerButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { deleteQuiz, listQuizzes, type Quiz } from "@/services/quizBankService";
import { MATERI_LABELS } from "@/data/learningCatalog";
import {
  Trophy,
  Plus,
  Trash2,
  HelpCircle,
  Sparkles,
  Target,
  Star,
  Lightbulb,
  Check,
} from "@/components/ui/CustomIcons";

const QUIZ_THEMES = [
  {
    headerBg: "bg-[#FEF08A]",
    badgeBg: "bg-[#FACC15]",
    badgeText: "text-[#713F12]",
    icon: Trophy,
  },
  {
    headerBg: "bg-[#BAE6FD]",
    badgeBg: "bg-[#38BDF8]",
    badgeText: "text-[#0369A1]",
    icon: Target,
  },
  {
    headerBg: "bg-[#A7F3D0]",
    badgeBg: "bg-[#34D399]",
    badgeText: "text-[#064E3B]",
    icon: Star,
  },
  {
    headerBg: "bg-[#DDD6FE]",
    badgeBg: "bg-[#A78BFA]",
    badgeText: "text-[#5B21B6]",
    icon: Lightbulb,
  },
];

export function UstadzQuizListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const all = await listQuizzes(user?.id);
      const userQuiz = all.filter((q) => q.createdBy === user?.id);
      setQuizzes(userQuiz);
      setLoading(false);
    };
    void load();
  }, [user?.id]);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
  }>({
    open: false,
    id: "",
  });
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = (id: string) => {
    setDeleteConfirm({ open: true, id });
    setDeleteError("");
  };

  const confirmDelete = async () => {
    const result = await deleteQuiz(deleteConfirm.id);
    setDeleteConfirm({ open: false, id: "" });
    if (!result.ok) {
      setDeleteError(result.errors.join("; ") || "Gagal menghapus kuis.");
      return;
    }
    setQuizzes((prev) => prev.filter((q) => q.id !== deleteConfirm.id));
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-[#0D9488] border-t-transparent" />
        <p className="mt-3 text-sm font-extrabold text-[#134E4A]">
          Memuat bank kuis…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#134E4A]">
            Bank Kuis Saya ({quizzes.length})
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#183B38]/70">
            Kumpulan instrumen evaluasi interaktif yang siap ditugaskan ke kelas
          </p>
        </div>
      </div>

      {deleteError && (
        <div className="rounded-2xl border-2 border-[#E11D48] bg-[#FFF1F2] p-4 text-xs sm:text-sm font-bold text-[#9F1239] shadow-[3px_3px_0px_#E11D48]">
          {deleteError}
        </div>
      )}

      {/* Playful Empty State */}
      {quizzes.length === 0 ? (
        <div className="rounded-3xl border-3 border-[#134E4A] bg-white p-6 sm:p-10 text-center max-w-xl mx-auto shadow-[5px_5px_0px_#134E4A]">
          {/* Custom Neo-Brutalist Trophy Illustration */}
          <div className="relative mx-auto mb-4 h-36 w-56 flex items-center justify-center">
            <svg viewBox="0 0 240 160" className="w-full h-full" fill="none">
              {/* Shadow */}
              <ellipse
                cx="120"
                cy="148"
                rx="75"
                ry="7"
                fill="#134E4A"
                opacity="0.15"
              />
              {/* Trophy base */}
              <rect
                x="90"
                y="125"
                width="60"
                height="18"
                rx="6"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="3.5"
              />
              <rect
                x="105"
                y="110"
                width="30"
                height="18"
                rx="3"
                fill="#FACC15"
                stroke="#134E4A"
                strokeWidth="3"
              />
              {/* Trophy cup */}
              <path
                d="M70 45h100c0 35-22 65-50 65s-50-30-50-65z"
                fill="#FEF08A"
                stroke="#134E4A"
                strokeWidth="3.5"
              />
              {/* Handles */}
              <path
                d="M70 55H50c0 22 15 35 25 35M170 55h20c0 22-15 35-25 35"
                stroke="#134E4A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Star on trophy */}
              <path
                d="M120 62l3 7 7 2-7 2-3 7-3-7-7-2 7-2z"
                fill="#F472B6"
                stroke="#134E4A"
                strokeWidth="2"
              />
              {/* Confetti & Sparkles */}
              <circle
                cx="45"
                cy="35"
                r="6"
                fill="#6EE7B7"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <circle
                cx="195"
                cy="40"
                r="7"
                fill="#93C5FD"
                stroke="#134E4A"
                strokeWidth="2.5"
              />
              <path
                d="M35 110l4 8 8 4-8 4-4 8-4-8-8-4 8-4z"
                fill="#C084FC"
                stroke="#134E4A"
                strokeWidth="2"
              />
              <path
                d="M205 95l4 7 7 4-7 4-4 7-4-7-7-4 7-4z"
                fill="#F43F5E"
                stroke="#134E4A"
                strokeWidth="2"
              />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] mb-3">
            <Sparkles size={14} /> BANK SOAL KOSONG
          </span>

          <h3 className="text-lg sm:text-xl font-black text-[#134E4A]">
            Bank Kuis Masih Kosong Melompong!
          </h3>

          <p className="mt-2 text-xs sm:text-sm font-semibold text-[#183B38]/80 leading-relaxed max-w-md mx-auto">
            Yuk racik kuis interaktif pertamamu! Buat soal tebak-tebakan seru
            agar santri makin semangat menguji hafalan huruf & tajwid mereka.
          </p>

          <div className="mt-6 flex justify-center">
            <StickerButton
              variant="primary"
              size="md"
              icon={<Plus size={18} />}
              onClick={() => navigate("/ustadz/kuis/baru")}
              className="font-black shadow-[3px_3px_0px_#134E4A]"
            >
              Mulai Buat Kuis Sekarang
            </StickerButton>
          </div>
        </div>
      ) : (
        /* Quiz Grid */
        <div className="grid gap-5 sm:grid-cols-2">
          {quizzes.map((quiz, idx) => {
            const theme = QUIZ_THEMES[idx % QUIZ_THEMES.length];
            return (
              <div
                key={quiz.id}
                className="group flex flex-col justify-between rounded-2xl border-3 border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#134E4A] transition-all p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                        <theme.icon size={18} />
                      </span>
                      <h3 className="font-black text-base sm:text-lg text-[#134E4A] group-hover:text-[#0D9488] transition-colors line-clamp-2 leading-snug">
                        {quiz.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(quiz.id)}
                      className="rounded-lg border-2 border-transparent p-1.5 text-[#94A3B8] hover:border-[#E11D48] hover:bg-[#FFF1F2] hover:text-[#E11D48] transition-all"
                      title="Hapus Kuis"
                      aria-label="Hapus Kuis"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Badges Bar */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-2.5 py-1 text-xs font-black text-[#713F12] shadow-[1.5px_1.5px_0px_#134E4A]">
                      {MATERI_LABELS[quiz.materi]}
                    </span>

                    {quiz.targetJilid !== null && (
                      <span className="rounded-xl border-2 border-[#134E4A] bg-[#CCFBF1] px-2.5 py-1 text-xs font-black text-[#0F766E] shadow-[1.5px_1.5px_0px_#134E4A]">
                        Jilid {quiz.targetJilid}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#F8FAFC] px-2.5 py-1 text-xs font-bold text-[#183B38] shadow-[1.5px_1.5px_0px_#134E4A]">
                      <HelpCircle size={14} className="text-[#0D9488]" />
                      {quiz.questions.length} Pertanyaan
                    </span>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="mt-5 pt-3.5 border-t-2 border-dashed border-[#134E4A]/20 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#64748B]">
                    ID: {quiz.id.slice(0, 8)}…
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#F0FDF4] border-2 border-[#134E4A] px-2.5 py-1 text-xs font-black text-[#15803D] shadow-[1.5px_1.5px_0px_#134E4A]">
                    <Check size={13} className="text-[#15803D]" />
                    <span>Siap Dipakai</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Hapus Kuis"
        description="Kuis ini akan dihapus secara permanen beserta seluruh soal di dalamnya. Santri tidak lagi dapat mengakses kuis ini."
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: "" })}
      />
    </div>
  );
}
