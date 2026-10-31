import { useEffect, useMemo, useState } from "react";
import {
  listStudentActivities,
  listStudentWeekActivity,
  STUDENT_STATUS_LABELS,
  type StudentActivity,
  type StudentActivityStatus,
  type StudentWeekLog,
} from "@/services/ustadzMonitoringService";
import { listOwnedClassrooms } from "@/services/classroomService";
import { useAuth } from "@/contexts/AuthContext";
import { StickerButton } from "@/components/ui/StickerButton";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { AppModal } from "@/components/ui/AppModal";
import {
  Users,
  ChartLine,
  Calendar,
  RefreshCw,
  Check,
  AlertCircle,
  HelpCircle,
} from "@/components/ui/CustomIcons";

type ReportFilter = "semua" | StudentActivityStatus;

const STATUS_VARIANTS: Record<
  StudentActivityStatus,
  "success" | "warning" | "danger"
> = {
  rajin: "success",
  "hanya-quiz": "warning",
  "butuh-perhatian": "danger",
};

const FILTER_LABELS: Record<ReportFilter, string> = {
  semua: "Semua Santri",
  rajin: "Rajin Belajar",
  "hanya-quiz": "Hanya Kuis",
  "butuh-perhatian": "Perlu Bimbingan",
};

export function UstadzStudentReportPage() {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState("");
  const [students, setStudents] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<ReportFilter>("semua");
  const [detailName, setDetailName] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    listOwnedClassrooms(user?.id).then((result) => {
      if (!alive) return;
      const active = result.ok
        ? result.data.filter((room) => !room.archived)
        : [];
      setRoomId(active[0]?.id ?? "");
    });
    return () => {
      alive = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!roomId) {
      setStudents([]);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    listStudentActivities(roomId).then((rows) => {
      if (!alive) return;
      setStudents(rows);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [roomId]);

  const handleRefresh = async () => {
    if (!roomId) return;
    setRefreshing(true);
    const rows = await listStudentActivities(roomId);
    setStudents(rows);
    setRefreshing(false);
  };

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
      {
        label: "Santri Rajin",
        value: countBy("rajin"),
        icon: Check,
        color: "text-[#15803D]",
        bg: "bg-[#F0FDF4]",
        border: "border-[#86EFAC]",
      },
      {
        label: "Hanya Kuis",
        value: countBy("hanya-quiz"),
        icon: HelpCircle,
        color: "text-[#B45309]",
        bg: "bg-[#FFFBEB]",
        border: "border-[#FDE68A]",
      },
      {
        label: "Butuh Bimbingan",
        value: countBy("butuh-perhatian"),
        icon: AlertCircle,
        color: "text-[#DC2626]",
        bg: "bg-[#FEF2F2]",
        border: "border-[#FECACA]",
      },
    ];
  }, [students]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#183B38] tracking-tight">
            Laporan & Evaluasi Santri
          </h1>
          <p className="text-xs text-[#64748B]">
            Pantau keaktifan santri antara latihan materi mandiri dan pengerjaan kuis
          </p>
        </div>
        <StickerButton
          variant="outline"
          size="sm"
          loading={refreshing}
          disabled={loading || !roomId}
          onClick={handleRefresh}
          className="shrink-0"
        >
          <RefreshCw size={14} className="mr-1.5" /> Segarkan Data
        </StickerButton>
      </div>

      {/* Summary 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`rounded-2xl border-2 border-[#134E4A] ${item.bg} p-4 transition-all shadow-[3px_3px_0px_#134E4A]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#134E4A]">
                  {item.label}
                </span>
                <span className={item.color}>
                  <Icon size={18} />
                </span>
              </div>
              <p className={`mt-2 text-2xl font-black ${item.color}`}>
                {item.value} <span className="text-xs font-bold text-[#134E4A]/70">santri</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs — Tactile Neo-Brutalist Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {(["semua", "rajin", "hanya-quiz", "butuh-perhatian"] as const).map(
          (key) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-xl border-2 border-[#134E4A] px-3.5 py-1.5 text-xs sm:text-sm font-black transition-all ${
                  isActive
                    ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                }`}
              >
                {FILTER_LABELS[key]}
              </button>
            );
          },
        )}
      </div>

      {/* Main Content / Table */}
      {loading ? (
        <div className="flex min-h-[35vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0D9488] border-t-transparent" />
            <p className="text-xs font-bold text-[#64748B]">Memuat laporan santri…</p>
          </div>
        </div>
      ) : visible.length === 0 ? (
        <StickerCard variant="elevated" className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#134E4A] bg-[#CCFBF1] text-[#0D9488] shadow-[2px_2px_0px_#134E4A]">
            <Users size={24} />
          </div>
          <h3 className="mt-3 text-sm font-black text-[#183B38]">
            {students.length === 0
              ? "Belum ada aktivitas santri di kelas ini."
              : "Tidak ada santri dengan status filter ini."}
          </h3>
          <p className="mt-1 text-xs text-[#64748B]">
            Data akan otomatis diperbarui saat santri mulai beraktivitas.
          </p>
        </StickerCard>
      ) : (
        <StickerCard variant="elevated" className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#134E4A] bg-[#CCFBF1] text-xs font-black uppercase tracking-wider text-[#134E4A]">
                  <th className="px-5 py-3.5">Santri</th>
                  <th className="hidden px-5 py-3.5 sm:table-cell">Terakhir Belajar</th>
                  <th className="px-5 py-3.5">Latihan vs Kuis</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 border-b-2 border-[#134E4A] divide-[#134E4A]/10">
                {visible.map((student) => (
                  <tr
                    key={student.name}
                    className="h-14 hover:bg-[#F8FAFC] transition cursor-pointer"
                    onClick={() => setDetailName(student.name)}
                  >
                    <td className="px-5 py-3">
                      <p className="font-black text-xs sm:text-sm text-[#134E4A] hover:text-[#0D9488]">
                        {student.name}
                      </p>
                      <p className="text-xs font-semibold text-[#64748B] sm:hidden">
                        {student.lastActive}
                      </p>
                    </td>
                    <td className="hidden px-5 py-3 text-xs sm:text-sm font-semibold text-[#183B38] sm:table-cell">
                      {student.lastActive}
                    </td>
                    <td className="px-5 py-3 text-xs sm:text-sm font-bold text-[#183B38]">
                      <span className="text-[#0D9488] font-black">{student.practiceCount}x</span> Latihan
                      <span className="mx-1.5 text-[#CBD5E1]">·</span>
                      <span className="text-[#64748B] font-black">{student.quizCount}x</span> Kuis
                    </td>
                    <td className="px-5 py-3">
                      <StickerBadge
                        variant={STATUS_VARIANTS[student.status]}
                        size="sm"
                        dot
                      >
                        {STUDENT_STATUS_LABELS[student.status]}
                      </StickerBadge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs font-bold text-[#0D9488] hover:underline">
                        Riwayat &rarr;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </StickerCard>
      )}

      {/* Student Week Modal */}
      <StudentWeekModal
        roomId={roomId}
        student={students.find((s) => s.name === detailName) ?? null}
        onClose={() => setDetailName(null)}
      />
    </div>
  );
}

function StudentWeekModal({
  roomId,
  student,
  onClose,
}: {
  roomId: string;
  student: StudentActivity | null;
  onClose: () => void;
}) {
  const [logs, setLogs] = useState<StudentWeekLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    let alive = true;
    setLoading(true);
    listStudentWeekActivity(roomId, student.userId).then((rows) => {
      if (!alive) return;
      setLogs(rows);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [student, roomId]);

  return (
    <AppModal
      isOpen={!!student}
      onClose={onClose}
      title={student ? `Riwayat Mingguan: ${student.name}` : "Riwayat Belajar"}
    >
      {student && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl border-2 border-[#134E4A] bg-[#FDFBF7] p-3 text-xs shadow-[1.5px_1.5px_0px_#134E4A]">
            <Calendar size={16} className="text-[#0D9488] shrink-0" />
            <span>
              <strong className="text-[#183B38]">{student.practiceCount}x</strong> latihan ·{" "}
              <strong className="text-[#183B38]">{student.quizCount}x</strong> kuis · aktif{" "}
              {student.lastActive.toLowerCase()}
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs font-bold text-[#64748B]">
              Memuat log aktivitas…
            </div>
          ) : logs.length === 0 ? (
            <p className="py-6 text-center text-xs text-[#64748B]">
              Belum ada catatan aktivitas di minggu ini.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {logs.map((log, index) => (
                <div
                  key={`${log.day}-${index}`}
                  className="flex items-center justify-between rounded-xl border-2 border-[#134E4A] bg-white px-3.5 py-2.5 text-xs shadow-[1.5px_1.5px_0px_#134E4A]"
                >
                  <span className="font-bold uppercase tracking-wider text-[#0D9488]">
                    {log.day}
                  </span>
                  <span className="font-medium text-[#183B38]">
                    {log.activity}
                  </span>
                </div>
              ))}
            </div>
          )}

          <StickerButton
            variant="outline"
            size="md"
            className="w-full"
            onClick={onClose}
          >
            Tutup Riwayat
          </StickerButton>
        </div>
      )}
    </AppModal>
  );
}
