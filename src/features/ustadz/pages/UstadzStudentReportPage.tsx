import { useEffect, useMemo, useState } from "react";
import {
  listStudentActivities,
  listStudentWeekActivity,
  STUDENT_STATUS_LABELS,
  type StudentActivity,
  type StudentActivityStatus,
  type StudentWeekLog,
} from "@/services/ustadzMonitoringService";
import { StickerButton } from "@/components/ui/StickerButton";
import { StickerCard } from "@/components/ui/StickerCard";

type ReportFilter = "semua" | StudentActivityStatus;

const STATUS_BADGE_STYLES: Record<
  StudentActivityStatus,
  string
> = {
  rajin: "bg-[#BBF7D0] text-[#134E4A]",
  "hanya-quiz": "bg-[#FEF08A] text-[#134E4A]",
  "butuh-perhatian": "bg-[#FECACA] text-[#7F1D1D]",
};

const FILTER_LABELS: Record<ReportFilter, string> = {
  semua: "Semua",
  rajin: "Rajin",
  "hanya-quiz": "Hanya Kuis",
  "butuh-perhatian": "Butuh Perhatian",
};

export function UstadzStudentReportPage() {
  const [students, setStudents] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReportFilter>("semua");
  const [detailName, setDetailName] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    listStudentActivities("current-room").then((rows) => {
      if (!alive) return;
      setStudents(rows);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(
    () =>
      filter === "semua"
        ? students
        : students.filter((student) => student.status === filter),
    [filter, students],
  );

  const summary = useMemo(() => {
    const countBy = (status: StudentActivityStatus) =>
      students.filter((student) => student.status === status).length;
    return [
      { label: STUDENT_STATUS_LABELS.rajin, value: countBy("rajin"), bg: "bg-[#BBF7D0]" },
      { label: STUDENT_STATUS_LABELS["hanya-quiz"], value: countBy("hanya-quiz"), bg: "bg-[#FEF08A]" },
      { label: STUDENT_STATUS_LABELS["butuh-perhatian"], value: countBy("butuh-perhatian"), bg: "bg-[#FECACA]" },
    ];
  }, [students]);

  return (
    <div className="w-full max-w-5xl space-y-4">
      <div>
        <h1 className="text-lg font-black text-[#134E4A]">Laporan Santri</h1>
        <p className="text-xs font-bold text-[#134E4A]/70">
          Fokus pedagogis: siapa yang benar-benar belajar, dan siapa yang
          perlu didorong lebih lanjut.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {summary.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border-[3px] border-[#0A2540] p-3 text-center shadow-[4px_4px_0_#0A2540] ${item.bg}`}
          >
            <p className="text-2xl font-black text-[#0A2540]">{item.value}</p>
            <p className="text-[10px] font-black uppercase tracking-wide text-[#0A2540]/70">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["semua", "rajin", "hanya-quiz", "butuh-perhatian"] as const).map(
          (key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-xl border-[3px] px-3 py-1.5 text-xs font-black transition-colors ${
                filter === key
                  ? "border-[#0A2540] bg-[#0D9488] text-white shadow-[3px_3px_0_#0A2540]"
                  : "border-[#0A2540] bg-white text-[#134E4A] hover:bg-[#F4F1EA]"
              }`}
            >
              {FILTER_LABELS[key]}
            </button>
          ),
        )}
      </div>

      {loading && (
        <p className="py-10 text-center text-xs font-bold text-[#134E4A]/60">
          Memuat laporan…
        </p>
      )}

      {!loading && visible.length === 0 && (
        <StickerCard className="p-6 text-center">
          <p className="text-sm font-black text-[#134E4A]">
            Tidak ada santri dengan status ini.
          </p>
        </StickerCard>
      )}

      {!loading && visible.length > 0 && (
        <div className="overflow-hidden rounded-2xl border-[3px] border-[#0A2540] bg-white shadow-[4px_4px_0_#0A2540]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-[3px] border-[#0A2540] bg-[#F4F1EA]">
                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-wide text-[#134E4A]/70">
                  Santri
                </th>
                <th className="hidden px-3 py-2 text-[10px] font-black uppercase tracking-wide text-[#134E4A]/70 sm:table-cell">
                  Terakhir Belajar
                </th>
                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-wide text-[#134E4A]/70">
                  Latihan vs Kuis
                </th>
                <th className="px-3 py-2 text-[10px] font-black uppercase tracking-wide text-[#134E4A]/70">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((student) => (
                <ReportRow
                  key={student.name}
                  student={student}
                  onOpen={() => setDetailName(student.name)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detailName && (
        <StudentWeekModal
          student={
            students.find((student) => student.name === detailName) ?? null
          }
          onClose={() => setDetailName(null)}
        />
      )}
    </div>
  );
}

function ReportRow({
  student,
  onOpen,
}: {
  student: StudentActivity;
  onOpen: () => void;
}) {
  return (
    <tr
      className="border-b-2 border-[#0A2540]/10 last:border-0 hover:bg-[#F4F1EA]"
      onClick={onOpen}
    >
      <td className="cursor-pointer px-3 py-3">
        <p className="text-sm font-black text-[#134E4A] underline decoration-[#0D9488] decoration-2 underline-offset-2">
          {student.name}
        </p>
        <p className="text-[10px] font-bold text-[#134E4A]/60 sm:hidden">
          Terakhir belajar {student.lastActive.toLowerCase()}
        </p>
      </td>
      <td className="hidden px-3 py-3 text-xs font-bold text-[#134E4A]/80 sm:table-cell">
        {student.lastActive}
      </td>
      <td className="px-3 py-3 text-xs font-black text-[#134E4A]">
        <span className="text-[#0D9488]">{student.practiceCount}x</span> Latihan
        <span className="mx-1 text-[#134E4A]/40">|</span>
        <span>{student.quizCount}x</span> Kuis
      </td>
      <td className="px-3 py-3">
        <span
          className={`inline-block rounded-lg border-2 border-[#0A2540] px-2 py-0.5 text-[10px] font-black ${
            STATUS_BADGE_STYLES[student.status]
          }`}
        >
          {STUDENT_STATUS_LABELS[student.status]}
        </span>
      </td>
    </tr>
  );
}

function StudentWeekModal({
  student,
  onClose,
}: {
  student: StudentActivity | null;
  onClose: () => void;
}) {
  const [logs, setLogs] = useState<StudentWeekLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    let alive = true;
    setLoading(true);
    listStudentWeekActivity("current-room", student.name).then((rows) => {
      if (!alive) return;
      setLogs(rows);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [student]);

  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <StickerCard
        className="max-h-[80dvh] w-full max-w-md overflow-y-auto p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[#134E4A]">
              Riwayat Minggu Ini · {student.name}
            </p>
            <p className="text-xs font-bold text-[#134E4A]/70">
              {student.practiceCount}x latihan · {student.quizCount}x kuis ·
              terakhir belajar {student.lastActive.toLowerCase()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg border-2 border-[#0A2540] bg-white px-2 py-1 text-xs font-black text-[#134E4A]"
          >
            Tutup
          </button>
        </div>

        {loading ? (
          <p className="mt-4 text-xs font-bold text-[#134E4A]/60">
            Memuat riwayat…
          </p>
        ) : logs.length === 0 ? (
          <p className="mt-4 text-xs font-bold text-[#134E4A]/60">
            Belum ada aktivitas minggu ini.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {logs.map((log, index) => (
              <li
                key={`${log.day}-${index}`}
                className="flex items-center justify-between rounded-xl border-[2.5px] border-[#0A2540] bg-[#F4F1EA] px-3 py-2"
              >
                <span className="text-[11px] font-black uppercase tracking-wide text-[#0A2540]/70">
                  {log.day}
                </span>
                <span className="text-xs font-black text-[#134E4A]">
                  {log.activity}
                </span>
              </li>
            ))}
          </ul>
        )}

        <StickerButton
          variant="secondary"
          size="sm"
          className="mt-4 w-full"
          onClick={onClose}
        >
          Tutup Laporan
        </StickerButton>
      </StickerCard>
    </div>
  );
}
