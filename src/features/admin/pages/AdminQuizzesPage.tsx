import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "@/components/ui/CustomIcons";
import {
  deleteQuiz,
  fetchQuizzes,
  type MockQuiz,
  type QuizStatus,
} from "../services/quizService";
import {
  BADGE_NEUTRAL,
  BADGE_SUCCESS,
  BADGE_WARNING,
  BTN_BASE,
  BTN_DANGER_COLOR,
  BTN_ICON,
  BTN_PRIMARY,
  BTN_SECONDARY_COLOR,
  CARD,
  INPUT_ICON,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  SELECT,
  TABLE_WRAP,
  TD,
  TH,
  TR,
} from "../styles";
import { Spinner } from "../components/Spinner";

const SKELETON_ROWS = 5;

const JILID_FILTERS: Array<{ value: number | "all"; label: string }> = [
  { value: "all", label: "Semua Jilid" },
  ...[1, 2, 3, 4, 5, 6].map((jilid) => ({
    value: jilid,
    label: `Jilid ${jilid}`,
  })),
];

function JilidBadge({ jilid }: { jilid: number }) {
  return (
    <span className={BADGE_NEUTRAL}>Jilid {jilid}</span>
  );
}

function StatusBadge({ status }: { status: QuizStatus }) {
  const isActive = status === "active";
  return (
    <span className={isActive ? BADGE_SUCCESS : BADGE_WARNING}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-[#FFD60A]" : "bg-[#1A1A1A]"
        }`}
      />
      {isActive ? "Aktif" : "Draft"}
    </span>
  );
}

function QuizSkeletonRow() {
  const bar = (className: string) => (
    <div
      className={`animate-pulse rounded bg-[#D8F3C9] ${className}`}
    />
  );
  return (
    <tr className="border-b border-[#1A1A1A]/20 last:border-b-0">
      <td className="px-6 py-3">
        {bar("h-4 w-40")}
      </td>
      <td className="px-6 py-3">
        {bar("h-5 w-16 rounded-md")}
      </td>
      <td className="px-6 py-3">
        {bar("h-4 w-14")}
      </td>
      <td className="px-6 py-3">
        {bar("h-4 w-24")}
      </td>
      <td className="px-6 py-3">
        {bar("h-5 w-16 rounded-md")}
      </td>
      <td className="px-6 py-3">
        <div className="flex justify-end">
          {bar("h-4 w-14")}
        </div>
      </td>
    </tr>
  );
}

export function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<MockQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [jilidFilter, setJilidFilter] = useState<number | "all">("all");

  useEffect(() => {
    let active = true;
    fetchQuizzes()
      .then((data) => {
        if (active) setQuizzes(data);
      })
      .catch(() => {
        // No quizzes API yet; the service returns mock data. Guard anyway
        // so a future API error cannot crash the page.
        if (active) setQuizzes([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = () => {
    // TODO: Open a create-quiz modal once a quizzes API exists.
    // console.log("[AdminQuizzes] create quiz");
  };

  const handleEdit = (_quiz: MockQuiz) => {
    // TODO: Wire to a quizzes API.
    // console.log("[AdminQuizzes] edit quiz", _quiz.id);
  };

  const handleDelete = async (quiz: MockQuiz) => {
    if (deletingId) return;
    if (!window.confirm(`Hapus kuis "${quiz.title}"?`)) return;
    setDeletingId(quiz.id);
    try {
      await deleteQuiz(quiz.id);
      setQuizzes((prev) => prev.filter((item) => item.id !== quiz.id));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredQuizzes = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return quizzes.filter((quiz) => {
      if (jilidFilter !== "all" && quiz.jilid !== jilidFilter) return false;
      if (!keyword) return true;
      return quiz.title.toLowerCase().includes(keyword);
    });
  }, [quizzes, query, jilidFilter]);

  return (
    <div className="space-y-6 pb-12 font-sans font-bold text-[#1A1A1A]">
      <header className={`flex flex-wrap items-start justify-between gap-4 p-5 ${CARD}`}>
        <div>
          <h1 className={PAGE_TITLE}>Manajemen Kuis</h1>
          <p className={PAGE_SUBTITLE}>
            Kelola bank soal, pengaturan waktu, dan hadiah bintang.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className={BTN_PRIMARY}
        >
          <Plus size={16} />
          Buat Kuis Baru
        </button>
      </header>

      <div className={`flex flex-col gap-3 p-4 md:flex-row md:items-center ${CARD}`}>
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/60"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul kuis..."
            aria-label="Cari kuis"
            className={INPUT_ICON}
          />
        </div>
        <div className="relative sm:w-44">
          <select
            aria-label="Filter jilid"
            value={jilidFilter}
            onChange={(event) =>
              setJilidFilter(
                event.target.value === "all"
                  ? "all"
                  : Number(event.target.value),
              )
            }
            className={SELECT}
          >
            {JILID_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]"
          />
        </div>
      </div>

      <section className={TABLE_WRAP}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className={`px-6 py-3 ${TH}`}>Judul Kuis</th>
                <th className={`px-6 py-3 ${TH}`}>Jilid</th>
                <th className={`px-6 py-3 ${TH}`}>Jumlah Soal</th>
                <th className={`px-6 py-3 ${TH}`}>Waktu &amp; Hadiah</th>
                <th className={`px-6 py-3 ${TH}`}>Status</th>
                <th className={`px-6 py-3 text-right ${TH}`}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                  <QuizSkeletonRow key={index} />
                ))
              ) : filteredQuizzes.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm font-bold text-[#1A1A1A]/70"
                  >
                    {quizzes.length === 0
                      ? "Belum ada kuis."
                      : "Tidak ada kuis yang cocok dengan pencarian."}
                  </td>
                </tr>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <tr
                    key={quiz.id}
                    className={`${TR} ${
                      deletingId === quiz.id
                        ? "pointer-events-none opacity-40"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-3">
                      <p className="font-black text-[#1A1A1A]">{quiz.title}</p>
                    </td>
                    <td className="px-6 py-3">
                      <JilidBadge jilid={quiz.jilid} />
                    </td>
                    <td className={`px-6 py-3 tabular-nums ${TD}`}>
                      {quiz.questionsCount} Soal
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-xs font-bold text-[#1A1A1A]/70">
                      <span className="tabular-nums">
                        {quiz.timeLimit} Mnt
                      </span>
                      <span className="mx-1.5">•</span>
                      <span
                        className="inline-flex items-center gap-1 align-middle text-[#1A1A1A]"
                      >
                        <Star size={12} className="text-[#FF9F1C]" />
                        <span className="font-black tabular-nums">
                          {quiz.rewardStars}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={quiz.status} />
                    </td>
                    <td className="px-6 py-3">
                      {deletingId === quiz.id ? (
                        <div
                          className="flex items-center justify-end pr-2"
                          role="status"
                          aria-label="Menghapus"
                        >
                          <Spinner size={15} className="text-[#1A1A1A]" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(quiz)}
                            disabled={Boolean(deletingId)}
                            aria-label={`Ubah ${quiz.title}`}
                            title="Ubah"
                            className={`${BTN_BASE} ${BTN_ICON} ${BTN_SECONDARY_COLOR}`}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(quiz)}
                            disabled={Boolean(deletingId)}
                            aria-label={`Hapus ${quiz.title}`}
                            title="Hapus"
                            className={`${BTN_BASE} ${BTN_ICON} ${BTN_DANGER_COLOR}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="border-t-[3px] border-[#1A1A1A] bg-[#FFF4DC] px-6 py-3 text-xs font-black text-[#1A1A1A]/70">
          {isLoading
            ? "Memuat data..."
            : `Menampilkan ${filteredQuizzes.length} dari ${quizzes.length} kuis`}
        </footer>
      </section>
    </div>
  );
}
