import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  GraduationCap,
  Trophy,
  Users,
  Check,
  BookOpen,
  Plus,
} from "@/components/ui/CustomIcons";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { InputField } from "@/components/ui/InputField";
import {
  listOwnedClassrooms,
  getClassroomDetail,
  joinClassroomByCode,
  type ClassroomRoom,
  type ClassroomParticipant,
  normalizeJoinCode,
} from "@/services/classroomService";
import { classroomRoleForUser, isUstadzUser } from "@/lib/roles";
import {
  listClassroomActivities,
  getRoomFocusMateri,
  listMateriReadProgress,
  listTodayAlerts,
  type TeacherAlert,
} from "@/services/ustadzMonitoringService";
import {
  listQuizzes,
  listQuizzesForRoom,
  listAttempts,
  averagePercentByQuiz,
  type QuizAverage,
} from "@/services/quizBankService";
import {
  coverageSummaryLine,
  coverageRecommendations,
  materiCoverage,
  materiReadCoverage,
  readCoverageSummaryLine,
  type MateriCoverageItem,
  type MateriReadCoverageItem,
} from "@/data/monitoring";

export function UstadzDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isTeacher = classroomRoleForUser(user) === "ustadz";
  const greetName = user?.name || user?.username || "Ustadz";

  const [ownedRooms, setOwnedRooms] = useState<ClassroomRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    if (!isTeacher) return;
    let alive = true;
    listQuizzes(user?.id).then((quizzes) => {
      if (alive) setQuizCount(quizzes.length);
    });
    return () => {
      alive = false;
    };
  }, [isTeacher, user?.id]);

  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    let alive = true;
    listOwnedClassrooms(user?.id).then((result) => {
      if (!alive) return;
      setLoading(false);
      if (result.ok) setOwnedRooms(result.data);
      else setLoadError(result.message);
    });
    return () => {
      alive = false;
    };
  }, [user?.id]);

  const activeRooms = ownedRooms.filter((room) => !room.archived);
  const totalSantri = activeRooms.reduce(
    (sum, room) => sum + Math.max(room.participantCount - 1, 0),
    0,
  );

  // Onboarding checklist langkah awal pengajar
  const checklist: { label: string; done: boolean }[] = [
    { label: "Buat Kelas Pertama", done: activeRooms.length > 0 },
    { label: "Undang Santri dengan Kode Join", done: totalSantri > 0 },
    { label: "Buat Bank Soal Kuis", done: quizCount > 0 },
  ];
  const checklistDone = checklist.filter((step) => step.done).length;
  const checklistPercent = Math.round(
    (checklistDone / Math.max(checklist.length, 1)) * 100,
  );

  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [coverage, setCoverage] = useState<MateriCoverageItem[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [readCoverage, setReadCoverage] = useState<MateriReadCoverageItem[]>(
    [],
  );
  const [quizAverages, setQuizAverages] = useState<QuizAverage[]>([]);
  const [alerts, setAlerts] = useState<TeacherAlert[]>([]);

  const monitorRoom =
    activeRooms.find((room) => room.id === selectedRoomId) ??
    activeRooms[0] ??
    null;

  useEffect(() => {
    if (!isTeacher) return;
    const active = ownedRooms.filter((room: ClassroomRoom) => !room.archived);
    if (active.length === 0) return;
    let alive = true;
    const target =
      active.find((room) => room.id === selectedRoomId) ?? active[0];

    listTodayAlerts(target.id).then((todayAlerts) => {
      if (!alive) return;
      setAlerts(todayAlerts);
    });

    getClassroomDetail(target.id).then(async (detail) => {
      if (!detail.ok || !alive) {
        if (alive) {
          setCoverage([]);
          setRecommendations([]);
          setReadCoverage([]);
          setQuizAverages([]);
        }
        return;
      }
      const murid = detail.data.participants.filter(
        (member: ClassroomParticipant) => member.roleInRoom === "murid",
      );
      const muridIds = murid.map((member) => member.userId);
      const activities = await listClassroomActivities(target.id, muridIds);
      const focusMateri = await getRoomFocusMateri(target.id);
      if (!alive) return;
      setCoverage(materiCoverage(activities, focusMateri));
      setRecommendations(coverageRecommendations(activities, focusMateri));

      const trackMateri = focusMateri.length > 0 ? focusMateri : ["tilawati"];
      const reads = await listMateriReadProgress(
        target.id,
        muridIds,
        trackMateri,
      );
      if (!alive) return;
      setReadCoverage(materiReadCoverage(reads, muridIds, trackMateri));

      const roomQuizzes = await listQuizzesForRoom(target.id);
      const attempts = (
        await Promise.all(roomQuizzes.map((quiz) => listAttempts(quiz.id)))
      ).flat();
      if (!alive) return;
      setQuizAverages(averagePercentByQuiz(roomQuizzes, attempts));
    });
    return () => {
      alive = false;
    };
  }, [ownedRooms, isTeacher, selectedRoomId]);

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoining(true);
    setJoinError("");
    const result = await joinClassroomByCode({
      joinCode,
      userId: user?.id,
      userRole: user?.role,
    });
    setJoining(false);
    if (!result.ok) {
      setJoinError(result.message);
      return;
    }
    navigate(`/ustadz/kelas/${result.data.id}`);
  };

  return (
    <div className="space-y-6">
      {/* ── A. WELCOME HEADER (Edu-Brutalist Hero Card) ── */}
      <div className="flex flex-col gap-4 rounded-2xl border-2 sm:border-3 border-[#134E4A] bg-[#FEF08A] p-5 shadow-[4px_4px_0px_#134E4A] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            <GraduationCap size={24} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-[#134E4A] md:text-xl">
                Assalamu'alaikum, {greetName}!
              </h1>
              <StickerBadge variant="primary" size="sm">
                {isTeacher ? "Pengajar" : "Pemantau"}
              </StickerBadge>
            </div>
            <p className="mt-0.5 text-xs font-bold text-[#134E4A]/80">
              {isTeacher
                ? "Kelola kelas, santri, dan tinjau progres pembelajaran hari ini."
                : "Mode pemantau: lihat aktivitas tanpa mengubah data."}
            </p>
          </div>
        </div>

        {/* Quick Action CTA Buttons */}
        {isTeacher && (
          <div className="flex shrink-0 items-center gap-2">
            <StickerButton
              variant="outline"
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => navigate("/ustadz/kuis/baru")}
            >
              Buat Kuis
            </StickerButton>
            <StickerButton
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => navigate("/ustadz/kelas/baru")}
            >
              Tambah Kelas
            </StickerButton>
          </div>
        )}
      </div>

      {/* ── B. SUMMARY STATISTICS (Chapter 8B - Summary Cards) ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {/* Total Kelas */}
        <StickerCard variant="summary" className="p-4.5">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#EFF6FF] text-[#1D4ED8] shadow-[1.5px_1.5px_0px_#134E4A]">
              <BookOpen size={20} />
            </span>
            <span className="text-[11px] font-bold text-[#64748B]">Aktif</span>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-[#183B38] md:text-3xl">
            {activeRooms.length}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#64748B]">
            Total Kelas
          </p>
        </StickerCard>

        {/* Total Santri */}
        <StickerCard variant="summary" className="p-4.5">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#F0FDF4] text-[#0D9488] shadow-[1.5px_1.5px_0px_#134E4A]">
              <Users size={20} />
            </span>
            <span className="text-[11px] font-bold text-[#64748B]">
              Terdaftar
            </span>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-[#183B38] md:text-3xl">
            {totalSantri}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#64748B]">
            Total Santri
          </p>
        </StickerCard>

        {/* Total Kuis */}
        <StickerCard variant="summary" className="p-4.5">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEFCE8] text-[#B45309] shadow-[1.5px_1.5px_0px_#134E4A]">
              <Trophy size={20} />
            </span>
            <span className="text-[11px] font-bold text-[#64748B]">
              Tersedia
            </span>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-[#183B38] md:text-3xl">
            {quizCount}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#64748B]">
            Bank Kuis
          </p>
        </StickerCard>

        {/* Perhatian Hari Ini */}
        <StickerCard variant="summary" className="p-4.5">
          <div className="flex items-center justify-between">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] ${
                alerts.length > 0
                  ? "bg-[#FFF0F0] text-[#B91C1C]"
                  : "bg-[#F0FDF4] text-[#166534]"
              }`}
            >
              <Check size={20} />
            </span>
            <StickerBadge
              variant={alerts.length > 0 ? "warning" : "success"}
              size="sm"
            >
              {alerts.length > 0 ? "Perlu Respon" : "Aman"}
            </StickerBadge>
          </div>
          <p className="mt-3 text-2xl font-black tracking-tight text-[#183B38] md:text-3xl">
            {alerts.length}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[#64748B]">
            Tugas / Perhatian
          </p>
        </StickerCard>
      </div>

      {/* ── C. BAR CHART: RATA-RATA NILAI KUIS ── */}
      <StickerCard variant="data" className="p-5">
        <div className="mb-4 flex items-center justify-between border-b-2 border-dashed border-[#134E4A]/20 pb-3">
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-[#134E4A]">
              Performa Nilai Kuis Kelas
            </h2>
            <p className="mt-0.5 text-[11px] font-semibold text-[#64748B]">
              Rata-rata skor santri per kuis (Top 5)
            </p>
          </div>
          <StickerBadge variant="primary" size="sm">
            {monitorRoom?.name || "Kelas"}
          </StickerBadge>
        </div>

        <div className="space-y-4">
          {quizAverages.length > 0 ? (
            quizAverages.slice(0, 5).map((item) => {
              // Logika warna berdasarkan nilai
              const barColor =
                item.averagePercent >= 75
                  ? "bg-[#0D9488]" // Hijau (Bagus)
                  : item.averagePercent >= 50
                    ? "bg-[#F59E0B]" // Kuning (Cukup)
                    : "bg-[#FF6B6B]"; // Merah (Kurang)

              return (
                <div key={item.quizId} className="flex items-center gap-3">
                  {/* Label Kuis */}
                  <div className="w-28 shrink-0 truncate text-[11px] font-black text-[#134E4A] sm:w-48 sm:text-xs">
                    {item.quizTitle}
                  </div>

                  {/* Bar Chart */}
                  <div className="relative flex-1 h-6 overflow-hidden rounded-md border-2 border-[#134E4A] bg-[#F0FDF4] shadow-[1px_1px_0px_#134E4A]">
                    <div
                      className={`h-full border-r-[3px] border-[#134E4A] transition-all duration-1000 ${barColor}`}
                      style={{ width: `${item.averagePercent}%` }}
                    />
                  </div>

                  {/* Nilai Angka */}
                  <div className="w-10 shrink-0 text-right text-xs font-black text-[#134E4A]">
                    {item.averagePercent}%
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Trophy size={32} className="text-[#134E4A]/20 mb-2" />
              <p className="text-xs font-bold text-[#64748B]">
                Belum ada data nilai kuis untuk kelas ini.
              </p>
            </div>
          )}
        </div>
      </StickerCard>

      {/* ── C. ONBOARDING CHECKLIST (Jika belum 100%) ── */}
      {isTeacher && checklistPercent < 100 && (
        <StickerCard variant="data" className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <StickerBadge variant="info" size="sm">
                  Langkah Awal
                </StickerBadge>
                <p className="text-sm font-bold text-[#183B38]">
                  Persiapan Memulai Kelas Digital
                </p>
              </div>
              <p className="mt-1 text-xs text-[#64748B]">
                Selesaikan langkah berikut agar proses pembelajaran santri
                berjalan optimal.
              </p>
            </div>
            <div className="flex items-center gap-2 font-black text-sm text-[#0D9488]">
              <span>{checklistDone}/3 Selesai</span>
              <span className="text-xs text-[#64748B]">
                ({checklistPercent}%)
              </span>
            </div>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
            <div
              className="h-full rounded-full bg-[#0D9488] transition-all duration-300"
              style={{ width: `${checklistPercent}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {checklist.map((step) => (
              <div
                key={step.label}
                className={`flex items-center gap-2.5 rounded-xl border-2 p-3 text-xs font-black transition-all ${
                  step.done
                    ? "border-[#134E4A] bg-[#DCFCE7] text-[#15803D] shadow-[1.5px_1.5px_0px_#134E4A]"
                    : "border-[#134E4A] bg-white text-[#134E4A]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[#134E4A] ${
                    step.done ? "bg-[#15803D] text-white" : "bg-white"
                  }`}
                >
                  {step.done ? <Check size={12} /> : null}
                </span>
                <span className={step.done ? "line-through opacity-80" : ""}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </StickerCard>
      )}

      {/* ── D. ATTENTION SECTION (Chapter 8D) ── */}
      {isTeacher && alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-tight text-[#183B38]">
              Perlu Perhatian Hari Ini
            </h2>
            <StickerBadge variant="danger" size="sm" dot>
              {alerts.length} Notifikasi
            </StickerBadge>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {alerts.map((alert) => (
              <StickerCard
                key={alert.id}
                variant="attention"
                accent={alert.kind === "apresiasi" ? "deep-teal" : "coral"}
                className="flex items-center justify-between p-4"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-bold text-[#183B38]">
                    {alert.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    Tindakan pengajar diperlukan
                  </p>
                </div>
                <StickerButton
                  variant={alert.kind === "apresiasi" ? "secondary" : "danger"}
                  size="sm"
                  onClick={() => {
                    if (alert.kind === "kuis-belum-dikerjakan") {
                      navigate("/ustadz/kuis");
                    } else {
                      navigate("/ustadz/laporan");
                    }
                  }}
                >
                  {alert.actionLabel}
                </StickerButton>
              </StickerCard>
            ))}
          </div>
        </div>
      )}

      {/* ── E. KELAS SAYA & MONITORING PROGRESS (Chapter 8E & 8F) ── */}
      {isTeacher && activeRooms.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Kolom Kiri: Kelas Aktif (2 Span di Desktop) */}
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold tracking-tight text-[#183B38]">
                Daftar Kelas Aktif
              </h2>
              <button
                type="button"
                onClick={() => navigate("/ustadz/kelas")}
                className="text-xs font-bold text-[#0D9488] hover:underline"
              >
                Lihat Semua ({activeRooms.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {activeRooms.slice(0, 4).map((room) => (
                <StickerCard
                  key={room.id}
                  variant="action"
                  className="p-4"
                  onClick={() => navigate(`/ustadz/kelas/${room.id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#183B38]">
                        {room.name}
                      </p>
                      <p className="mt-1 text-xs text-[#64748B]">
                        {room.participantCount}/{room.maxParticipants} Santri ·
                        Jilid {room.targetJilid}
                      </p>
                    </div>
                    <StickerBadge variant="info" size="sm" brutal>
                      {room.joinCode}
                    </StickerBadge>
                  </div>
                </StickerCard>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Cakupan Materi & Evaluasi Kuis (1 Span) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold tracking-tight text-[#183B38]">
                Cakupan Materi
              </h2>
              {activeRooms.length > 1 && (
                <select
                  value={selectedRoomId || monitorRoom?.id}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="rounded-lg border-2 border-[#134E4A] bg-white px-2 py-1 text-xs font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A] focus:outline-none"
                  aria-label="Pilih kelas pemantauan"
                >
                  {activeRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <StickerCard variant="data" className="p-4 space-y-4">
              <div>
                <p className="text-xs font-black text-[#183B38]">
                  Status: {monitorRoom?.name}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#64748B]">
                  {coverage.length > 0
                    ? coverageSummaryLine(coverage)
                    : "Memuat aktivitas…"}
                </p>
              </div>

              {recommendations.length > 0 && (
                <div className="rounded-xl border-2 border-[#134E4A] bg-[#FEFCE8] p-3 shadow-[1.5px_1.5px_0px_#134E4A]">
                  <p className="text-xs font-black text-[#92400E]">
                    Rekomendasi:
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {recommendations.map((rec) => (
                      <li
                        key={rec}
                        className="text-[11px] font-bold text-[#B45309]"
                      >
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Progress Baca */}
              <div className="border-t-2 border-dashed border-[#134E4A]/20 pt-3">
                <p className="text-xs font-black text-[#183B38]">
                  Progres Baca Tilawati
                </p>
                {readCoverage.length > 0 ? (
                  <div className="mt-2 space-y-1.5">
                    {readCoverage.slice(0, 3).map((item) => (
                      <div
                        key={item.materiId}
                        className="flex items-center justify-between text-xs font-semibold"
                      >
                        <span className="text-[#64748B]">{item.label}</span>
                        <span className="font-black text-[#0D9488]">
                          {item.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-[#64748B]">
                    Belum ada data bacaan santri.
                  </p>
                )}
              </div>

              {/* Rata-rata Kuis */}
              <div className="border-t-2 border-dashed border-[#134E4A]/20 pt-3">
                <p className="text-xs font-black text-[#183B38]">
                  Rata-rata Nilai Kuis
                </p>
                {quizAverages.length > 0 ? (
                  <div className="mt-2 space-y-1.5">
                    {quizAverages.slice(0, 2).map((item) => (
                      <div
                        key={item.quizId}
                        className="flex items-center justify-between text-xs font-semibold"
                      >
                        <span className="truncate pr-2 text-[#64748B]">
                          {item.quizTitle}
                        </span>
                        <span className="font-black text-[#0D9488]">
                          {item.averagePercent}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-[#64748B]">
                    Belum ada santri yang menyelesaikan kuis.
                  </p>
                )}
              </div>
            </StickerCard>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE KELAS ── */}
      {isTeacher && activeRooms.length === 0 && (
        <StickerCard variant="summary" className="p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
            <BookOpen size={28} />
          </span>
          <p className="mt-3 text-base font-bold text-[#183B38]">
            Belum Ada Kelas yang Aktif
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-[#64748B]">
            Mulai pembelajaran digital dengan membuka kelas baru, bagikan kode
            join kepada santri, lalu pantau setoran bacaan Tilawati.
          </p>
          <div className="mt-4">
            <StickerButton
              variant="primary"
              size="md"
              icon={<Plus size={18} />}
              onClick={() => navigate("/ustadz/kelas/baru")}
            >
              Buat Kelas Pertama
            </StickerButton>
          </div>
        </StickerCard>
      )}

      {/* ── GABUNG KELAS DENGAN KODE ── */}
      <StickerCard variant="data" className="p-5 max-w-xl">
        <div className="flex items-center gap-2">
          <StickerBadge variant="neutral" size="sm">
            Kode Undangan
          </StickerBadge>
          <p className="text-sm font-bold text-[#183B38]">
            Gabung Sebagai Pengajar Tambahan
          </p>
        </div>
        <p className="mt-1 text-xs text-[#64748B]">
          Menerima kode kelas dari ustadz/pengajar lain? Masukkan kode 6
          karakter di sini.
        </p>
        <form onSubmit={handleJoinByCode} className="mt-3 flex gap-2">
          <div className="flex-1">
            <InputField
              placeholder="Masukkan 6 digit kode kelas"
              maxLength={8}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              autoCapitalize="characters"
              error={joinError}
            />
          </div>
          <div className="shrink-0 pt-0.5">
            <StickerButton
              type="submit"
              variant="primary"
              size="md"
              loading={joining}
              disabled={normalizeJoinCode(joinCode).length !== 6}
            >
              Gabung
            </StickerButton>
          </div>
        </form>
      </StickerCard>

      {/* Status Loading / Error */}
      {loading && (
        <p className="py-6 text-center text-xs text-[#64748B]">
          Memuat data dashboard…
        </p>
      )}
      {loadError && (
        <p className="py-6 text-center text-xs font-semibold text-[#B91C1C]">
          {loadError}
        </p>
      )}

      {!isTeacher && !isUstadzUser(user) && (
        <p className="text-center text-xs text-[#64748B]">
          Anda masuk sebagai mode pemantau (admin). Data kelas hanya dapat
          dilihat.
        </p>
      )}
    </div>
  );
}
