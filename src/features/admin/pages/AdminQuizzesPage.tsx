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
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
      style={{
        color: "var(--admin-text-muted)",
        backgroundColor: "color-mix(in srgb, #71717a 16%, transparent)",
      }}
    >
      Jilid {jilid}
    </span>
  );
}

function StatusBadge({ status }: { status: QuizStatus }) {
  const isActive = status === "active";
  const color = isActive ? "var(--admin-accent)" : "var(--admin-text-muted)";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {isActive ? "Aktif" : "Draft"}
    </span>
  );
}

function QuizSkeletonRow() {
  const bar = (className: string) => (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: "var(--admin-skeleton)" }}
    />
  );
  return (
    <tr className="admin-border border-b last:border-0">
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
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Manajemen Kuis</h1>
          <p className="mt-1 text-sm admin-muted">
            Kelola bank soal, pengaturan waktu, dan hadiah bintang.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="admin-accent-bg inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 hover:opacity-90"
        >
          <Plus size={16} />
          Buat Kuis Baru
        </button>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="admin-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul kuis..."
            aria-label="Cari kuis"
            className="admin-surface admin-border w-full rounded-lg border py-2 pl-9 pr-3 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2"
            style={{ color: "var(--admin-text)" }}
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
            className="admin-surface admin-border w-full appearance-none rounded-lg border py-2 pl-3 pr-9 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2"
            style={{ color: "var(--admin-text)" }}
          >
            {JILID_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="admin-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      <section className="admin-surface admin-border rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="admin-border border-b text-left text-xs admin-muted">
                <th className="px-6 py-3 font-medium">Judul Kuis</th>
                <th className="px-6 py-3 font-medium">Jilid</th>
                <th className="px-6 py-3 font-medium">Jumlah Soal</th>
                <th className="px-6 py-3 font-medium">Waktu &amp; Hadiah</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Aksi</th>
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
                    className="px-6 py-10 text-center text-sm admin-muted"
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
                    className={`admin-border border-b last:border-0 transition-opacity duration-150 hover:bg-[var(--admin-accent-soft)] ${
                      deletingId === quiz.id
                        ? "pointer-events-none opacity-40"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-3">
                      <p className="font-medium">{quiz.title}</p>
                    </td>
                    <td className="px-6 py-3">
                      <JilidBadge jilid={quiz.jilid} />
                    </td>
                    <td className="px-6 py-3 tabular-nums">
                      {quiz.questionsCount} Soal
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-xs admin-muted">
                      <span className="tabular-nums">
                        {quiz.timeLimit} Mnt
                      </span>
                      <span className="mx-1.5">•</span>
                      <span
                        className="inline-flex items-center gap-1 align-middle"
                        style={{ color: "var(--admin-text)" }}
                      >
                        <Star
                          size={12}
                          style={{ color: "var(--admin-accent)" }}
                        />
                        <span className="tabular-nums font-medium">
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
                          <Spinner size={15} className="admin-muted" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(quiz)}
                            disabled={Boolean(deletingId)}
                            aria-label={`Ubah ${quiz.title}`}
                            title="Ubah"
                            className="admin-nav-item rounded-md p-2 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(quiz)}
                            disabled={Boolean(deletingId)}
                            aria-label={`Hapus ${quiz.title}`}
                            title="Hapus"
                            className="rounded-md p-2 transition-colors duration-150 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-70"
                            style={{ color: "var(--admin-danger)" }}
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
        <footer className="admin-border border-t px-6 py-3 text-xs admin-muted">
          {isLoading
            ? "Memuat data..."
            : `Menampilkan ${filteredQuizzes.length} dari ${quizzes.length} kuis`}
        </footer>
      </section>
    </div>
  );
}
