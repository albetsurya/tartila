import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { InputField } from "@/components/ui/InputField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useClassroomAccess } from "../hooks/useClassroomAccess";
import {
  archiveClassroom,
  getClassroomDetail,
  leaveClassroom,
  updateClassroom,
  type ClassroomParticipant,
  type ClassroomRoom,
} from "@/services/classroomService";
import {
  assignGameToRoom,
  getRoomFocusMateri,
  listClassroomActivities,
  listGameAssignments,
  setRoomFocusMateri,
  unassignGameFromRoom,
  type ClassroomActivity,
  type GameAssignment,
} from "@/services/ustadzMonitoringService";
import {
  MATERI_LABELS,
  ALL_MATERI_POKOK,
  getGameById,
  recommendGamesForClassroom,
  type GameCatalogEntry,
  type GameRecommendation,
  type MateriPokok,
} from "@/data/learningCatalog";
import {
  coverageSummaryLine,
  coverageRecommendations,
  materiCoverage,
  type MateriCoverageItem,
} from "@/data/monitoring";
import {
  averagePercentByQuiz,
  listAttempts,
  listQuizzesForRoom,
  type Quiz,
  type QuizAverage,
  type QuizAttempt,
} from "@/services/quizBankService";
import {
  ArrowLeft,
  Users,
  Copy,
  Check,
  X,
  Settings,
  BookOpen,
  Sparkles,
  Trophy,
  ChartLine,
  Shield,
  Trash2,
} from "@/components/ui/CustomIcons";
import { duelService } from "@/services/duelService";

function initials(name: string | null, username: string | null): string {
  const base = name || username || "?";
  return base.trim().slice(0, 2).toUpperCase();
}

/** Nama game + chip materi dalam satu baris kecil */
function GameWithMateri({ entry }: { entry: GameCatalogEntry }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className="font-bold text-[#183B38] text-xs">{entry.title}</span>
      {entry.materiPokok.map((materi) => (
        <span
          key={materi}
          className="rounded-md border-2 border-[#134E4A] bg-[#F8FAFC] px-1.5 py-0.5 text-[9px] font-black text-[#134E4A]"
        >
          {MATERI_LABELS[materi]}
        </span>
      ))}
    </span>
  );
}

type TabKey = "santri" | "aktivitas" | "pengaturan";

export function UstadzRoomDetailPage() {
  const { roomId = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTeacher } = useClassroomAccess();

  const [activeTab, setActiveTab] = useState<TabKey>("santri");
  const [room, setRoom] = useState<ClassroomRoom | null>(null);
  const [participants, setParticipants] = useState<ClassroomParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [archiveConfirm, setArchiveConfirm] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [actionError, setActionError] = useState("");

  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState(1);
  const [editFocusMateri, setEditFocusMateri] = useState<MateriPokok[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState("");

  const [recommendations, setRecommendations] = useState<GameRecommendation[]>([]);
  const [assignments, setAssignments] = useState<GameAssignment[]>([]);
  const [activities, setActivities] = useState<ClassroomActivity[]>([]);
  const [coverage, setCoverage] = useState<MateriCoverageItem[]>([]);
  const [roomQuizzes, setRoomQuizzes] = useState<Quiz[]>([]);
  const [quizAverages, setQuizAverages] = useState<QuizAverage[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [duelEnabled, setDuelEnabled] = useState(true);
  const [savingDuel, setSavingDuel] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getClassroomDetail(roomId);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    const currentRoom = result.data.room;
    const murid = result.data.participants.filter(
      (member: ClassroomParticipant) => member.roleInRoom === "murid",
    );
    setRoom(currentRoom);
    setParticipants(result.data.participants);
    setEditName(currentRoom.name);
    setEditTarget(currentRoom.targetJilid);

    const focusMateri = await getRoomFocusMateri(roomId);
    setEditFocusMateri(focusMateri);
    const targetJilid = Math.min(
      Math.max(currentRoom.targetJilid, 1),
      5,
    ) as 1 | 2 | 3 | 4 | 5;
    setRecommendations(
      recommendGamesForClassroom({ focusMateri, targetJilid }),
    );
    setAssignments(await listGameAssignments(roomId));
    duelService
      .getDuelSetting(roomId)
      .then((res) => setDuelEnabled(res.enabled))
      .catch(() => setDuelEnabled(true));
    const activityList = await listClassroomActivities(
      roomId,
      murid.map((member) => member.userId),
    );
    setActivities(activityList);
    setCoverage(materiCoverage(activityList, focusMateri));

    const quizzes = await listQuizzesForRoom(roomId);
    setRoomQuizzes(quizzes);
    const attempts = (
      await Promise.all(quizzes.map((quiz) => listAttempts(quiz.id)))
    ).flat();
    setQuizAttempts(attempts);
    setQuizAverages(averagePercentByQuiz(quizzes, attempts));
  }, [roomId]);

  useEffect(() => {
    void load();
  }, [load]);

  const copyJoinCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.joinCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = async () => {
    if (!room) return;
    setSavingEdit(true);
    setEditError("");
    setEditSuccess(false);
    const result = await updateClassroom(room.id, user?.id, {
      name: editName.trim(),
      targetJilid: editTarget,
    });
    if (!result.ok) {
      setSavingEdit(false);
      setEditError(result.message);
      return;
    }
    try {
      await setRoomFocusMateri(room.id, editFocusMateri);
    } catch (err) {
      console.error("[handleSaveEdit] Gagal set fokus materi:", err);
      setEditError("Gagal menyimpan fokus materi.");
      setSavingEdit(false);
      return;
    }
    setRoom(result.data);
    setSavingEdit(false);
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 3000);
    await load();
  };

  const handleToggleAssignment = async (entry: GameCatalogEntry) => {
    if (!room) return;
    const assigned = assignments.some((item) => item.gameId === entry.gameId);
    if (assigned) {
      await unassignGameFromRoom(room.id, entry.gameId);
    } else {
      await assignGameToRoom(room.id, entry.gameId, user?.id ?? "");
    }
    setAssignments(await listGameAssignments(room.id));
  };

  const handleToggleDuel = async () => {
    if (!room) return;
    setSavingDuel(true);
    const next = !duelEnabled;
    await duelService.setDuelSetting(room.id, next);
    setDuelEnabled(next);
    setSavingDuel(false);
  };

  const handleArchive = async () => {
    if (!room) return;
    setArchiving(true);
    setArchiveConfirm(false);
    const result = await archiveClassroom(room.id, user?.id);
    setArchiving(false);
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    navigate("/ustadz/kelas");
  };

  const handleLeave = async () => {
    setLeaving(true);
    setLeaveConfirm(false);
    const result = await leaveClassroom(roomId, user?.id);
    setLeaving(false);
    if (!result.ok) {
      setActionError(result.message);
      return;
    }
    navigate("/ustadz/kelas");
  };

  const murid = participants.filter((p: ClassroomParticipant) => p.roleInRoom === "murid");

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0D9488] border-t-transparent" />
          <p className="text-xs font-bold text-[#64748B]">Memuat data kelas…</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="w-full max-w-xl mx-auto py-10">
        <StickerCard variant="elevated" className="p-6 text-center border border-[#FCA5A5]">
          <p className="text-sm font-black text-[#991B1B]">{error || "Kelas tidak ditemukan"}</p>
          <StickerButton
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => navigate("/ustadz/kelas")}
          >
            Kembali ke Daftar Kelas
          </StickerButton>
        </StickerCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Top Header Card */}
      <StickerCard variant="elevated" className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate("/ustadz/kelas")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#183B38] shadow-[2px_2px_0px_#134E4A] transition hover:bg-[#F8FAFC] active:scale-95"
              aria-label="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-[#183B38] truncate">
                  {room.name}
                </h1>
                <StickerBadge variant="primary" size="sm">
                  Jilid {room.targetJilid}
                </StickerBadge>
                {room.archived && (
                  <StickerBadge variant="neutral" size="sm">
                    Arsip
                  </StickerBadge>
                )}
                {room.hasPassword && (
                  <StickerBadge variant="warning" size="sm">
                    Password
                  </StickerBadge>
                )}
              </div>
              {room.description && (
                <p className="mt-1 text-xs text-[#64748B] line-clamp-2">
                  {room.description}
                </p>
              )}
              <p className="mt-1 text-xs font-semibold text-[#64748B]">
                {murid.length}/{room.maxParticipants} Santri terdaftar
              </p>
            </div>
          </div>

          {/* Join Code Box — Tactile Neo-Brutalist Sticker Ticket */}
          <div className="flex items-center gap-3 rounded-2xl border-2 border-[#134E4A] bg-[#FEF08A] p-3.5 shadow-[3px_3px_0px_#134E4A] shrink-0">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-[#713F12]">
                Kode Join Kelas
              </p>
              <p className="font-mono text-xl font-black tracking-widest text-[#134E4A]">
                {room.joinCode}
              </p>
            </div>
            <StickerButton
              variant={copied ? "primary" : "secondary"}
              size="sm"
              onClick={copyJoinCode}
              className="ml-2 font-black shadow-[2px_2px_0px_#134E4A]"
            >
              {copied ? (
                <>
                  <Check size={14} className="mr-1" /> Tersalin!
                </>
              ) : (
                <>
                  <Copy size={14} className="mr-1" /> Salin
                </>
              )}
            </StickerButton>
          </div>
        </div>

        {/* Consistent Tactile Neo-Brutalist Tab Bar */}
        <div className="mt-6 w-full grid grid-cols-3 gap-1.5 sm:gap-2 rounded-2xl border-2 border-[#134E4A] bg-[#F0FDF4] p-1.5 shadow-[3px_3px_0px_#134E4A]">
          <button
            type="button"
            onClick={() => setActiveTab("santri")}
            className={`h-11 sm:h-12 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black transition-all ${
              activeTab === "santri"
                ? "border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                : "text-[#134E4A] hover:bg-white"
            }`}
          >
            <Users size={16} className="shrink-0" />
            <span className="truncate">Santri ({murid.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("aktivitas")}
            className={`h-11 sm:h-12 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black transition-all ${
              activeTab === "aktivitas"
                ? "border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                : "text-[#134E4A] hover:bg-white"
            }`}
          >
            <ChartLine size={16} className="shrink-0" />
            <span className="truncate">Kuis & Game</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pengaturan")}
            className={`h-11 sm:h-12 px-2 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black transition-all ${
              activeTab === "pengaturan"
                ? "border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                : "text-[#134E4A] hover:bg-white"
            }`}
          >
            <Settings size={16} className="shrink-0" />
            <span className="truncate">Pengaturan</span>
          </button>
        </div>
      </StickerCard>

      {/* TAB 1: SANTRI & PROGRES */}
      {activeTab === "santri" && (
        <div className="space-y-5">
          {/* Santri List / Table */}
          <StickerCard variant="elevated" className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b-2 border-[#134E4A] bg-[#F8FAFC] px-5 py-3.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#183B38]">
                Daftar Santri ({murid.length})
              </h2>
              <span className="text-[11px] font-bold text-[#64748B]">
                Maksimal {room.maxParticipants} santri
              </span>
            </div>

            {murid.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#134E4A] bg-[#CCFBF1] text-[#0D9488] shadow-[2px_2px_0px_#134E4A]">
                  <Users size={24} />
                </div>
                <p className="mt-3 text-sm font-black text-[#183B38]">
                  Belum ada santri yang bergabung
                </p>
                <p className="mt-1 text-xs font-medium text-[#64748B]">
                  Bagikan kode kelas <span className="font-mono font-black text-[#0D9488]">{room.joinCode}</span> kepada santri Anda.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-[#134E4A] bg-[#CCFBF1] text-xs font-black uppercase tracking-wider text-[#134E4A]">
                      <th className="px-5 py-3.5">Santri</th>
                      <th className="px-5 py-3.5">Level</th>
                      <th className="px-5 py-3.5">Peran</th>
                      <th className="px-5 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 border-b-2 border-[#134E4A] divide-[#134E4A]/10">
                    {murid.map((member) => (
                      <tr key={member.id} className="h-14 hover:bg-[#F8FAFC] transition">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF3C7] text-xs font-black text-[#B45309] shadow-[1.5px_1.5px_0px_#134E4A]">
                              {initials(member.name, member.username)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-xs sm:text-sm text-[#134E4A] truncate">
                                {member.name || member.username || "Santri"}
                              </p>
                              {member.username && (
                                <p className="text-xs font-semibold text-[#64748B]">
                                  @{member.username}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-xs sm:text-sm font-bold text-[#183B38]">
                          Level {member.level}
                        </td>
                        <td className="px-5 py-3 text-xs font-semibold text-[#64748B]">
                          Murid
                        </td>
                        <td className="px-5 py-3 text-right">
                          <StickerBadge variant="success" size="sm" dot>
                            Aktif
                          </StickerBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </StickerCard>

          {/* Matriks Progres Santri */}
          <StickerCard variant="elevated" className="overflow-hidden p-0">
            <div className="border-b-2 border-[#134E4A] bg-[#F8FAFC] px-5 py-3.5">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#134E4A]">
                Matriks Penyelesaian Kuis Santri
              </h2>
            </div>

            {roomQuizzes.length === 0 || murid.length === 0 ? (
              <div className="p-6 text-center text-xs sm:text-sm text-[#64748B]">
                {roomQuizzes.length === 0
                  ? "Belum ada kuis yang ditugaskan di kelas ini. Buat atau tugaskan kuis di tab Aktivitas."
                  : "Belum ada santri yang bergabung untuk dipetakan."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-left">
                  <thead>
                    <tr className="border-b-2 border-[#134E4A] bg-[#CCFBF1]/30">
                      <th className="sticky left-0 z-10 bg-[#F1F5F9] px-4 py-3 text-xs font-black uppercase tracking-wider text-[#134E4A]">
                        Santri
                      </th>
                      {roomQuizzes.map((quiz) => (
                        <th
                          key={quiz.id}
                          className="px-4 py-3 text-xs font-black uppercase tracking-wider text-[#134E4A]"
                        >
                          <span className="block max-w-[8rem] truncate" title={quiz.title}>
                            {quiz.title}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE5E3]">
                    {murid.map((member) => (
                      <tr key={member.id} className="h-12 hover:bg-[#F8FAFC]">
                        <td className="sticky left-0 z-10 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#183B38]">
                          {member.name || member.username || "Santri"}
                        </td>
                        {roomQuizzes.map((quiz) => {
                          const done = quizAttempts.some(
                            (attempt) =>
                              attempt.userId === member.userId &&
                              attempt.quizId === quiz.id,
                          );
                          return (
                            <td key={quiz.id} className="px-4 py-2">
                              {done ? (
                                <span className="inline-flex items-center gap-1 text-xs font-black text-[#15803D]">
                                  <Check size={14} /> Selesai
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#94A3B8]">
                                  <X size={14} /> Belum
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </StickerCard>
        </div>
      )}

      {/* TAB 2: AKTIVITAS & KUIS */}
      {activeTab === "aktivitas" && (
        <div className="space-y-5">
          {/* Kuis Kelas Section */}
          <StickerCard variant="elevated" className="p-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#134E4A]/20">
              <div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#134E4A]">
                  Kuis Kelas ({roomQuizzes.length})
                </h2>
                <p className="text-xs text-[#64748B]">
                  Daftar kuis yang ditugaskan khusus untuk santri kelas ini
                </p>
              </div>
              {isTeacher && (
                <StickerButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/ustadz/kuis/baru")}
                >
                  + Buat Kuis Baru
                </StickerButton>
              )}
            </div>

            {roomQuizzes.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Belum ada kuis untuk kelas ini.
                </p>
                <StickerButton
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate("/ustadz/kuis/baru")}
                >
                  Buat Kuis Sekarang
                </StickerButton>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {roomQuizzes.map((quiz) => {
                  const avg = quizAverages.find((item) => item.quizId === quiz.id);
                  return (
                    <div
                      key={quiz.id}
                      className="rounded-2xl border-2 border-[#134E4A] bg-white p-4 shadow-[3px_3px_0px_#134E4A] hover:border-[#0D9488] transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-black text-sm sm:text-base text-[#134E4A] truncate">
                            {quiz.title}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span className="rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-xs font-black text-[#713F12]">
                              {MATERI_LABELS[quiz.materi]}
                            </span>
                            <span className="text-xs font-semibold text-[#64748B]">
                              {quiz.questions.length} soal
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm sm:text-base font-black text-[#0D9488]">
                            {avg ? `${avg.averagePercent}%` : "—"}
                          </p>
                          <p className="text-[11px] font-bold text-[#64748B]">
                            {avg ? "Rata-rata" : "Belum dinilai"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </StickerCard>

          {/* Rekomendasi Game & Tugas */}
          <StickerCard variant="elevated" className="p-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#134E4A]/20">
              <div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#134E4A]">
                  Rekomendasi Game & Materi
                </h2>
                <p className="text-xs text-[#64748B]">
                  Disarankan berdasarkan target Jilid {room.targetJilid}
                </p>
              </div>
              <StickerButton
                variant="outline"
                size="sm"
                onClick={() => navigate("/ustadz/kurikulum")}
              >
                Lihat Katalog
              </StickerButton>
            </div>

            <div className="mt-4 space-y-2.5">
              {recommendations.slice(0, 6).map((rec) => {
                const assigned = assignments.some(
                  (item) => item.gameId === rec.entry.gameId,
                );
                return (
                  <div
                    key={rec.entry.gameId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border-2 border-[#134E4A] bg-white p-3.5 shadow-[2px_2px_0px_#134E4A] transition-all"
                  >
                    <div className="min-w-0">
                      <GameWithMateri entry={rec.entry} />
                      <p className="mt-1 text-[11px] text-[#64748B]">
                        {rec.reason}
                      </p>
                    </div>
                    {isTeacher && (
                      <StickerButton
                        variant={assigned ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleToggleAssignment(rec.entry)}
                        className="shrink-0"
                      >
                        {assigned ? "Ditugaskan" : "+ Tugaskan"}
                      </StickerButton>
                    )}
                  </div>
                );
              })}
            </div>
          </StickerCard>

          {/* Cakupan Materi & Rekomendasi Guru */}
          <StickerCard variant="elevated" className="p-5">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#183B38] pb-2 border-b-2 border-dashed border-[#134E4A]/20">
              Cakupan Materi Kelas
            </h2>
            <p className="mt-3 text-xs font-bold text-[#183B38]">
              {coverageSummaryLine(coverage)}
            </p>
            {coverageRecommendations(activities, editFocusMateri).map((rec) => (
              <p key={rec} className="mt-1 text-xs font-medium text-[#DC2626]">
                • {rec}
              </p>
            ))}
          </StickerCard>

          {/* Aktivitas Terbaru */}
          <StickerCard variant="elevated" className="p-5">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#183B38] pb-2 border-b-2 border-dashed border-[#134E4A]/20">
              Aktivitas Terbaru Santri
            </h2>
            {activities.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#64748B]">
                Belum ada aktivitas santri yang terpantau di kelas ini.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-[#DCE5E3]">
                {activities.slice(0, 6).map((activity) => {
                  const entry = getGameById(activity.gameId);
                  const member = participants.find(
                    (item) => item.userId === activity.userId,
                  );
                  if (!entry) return null;
                  return (
                    <div key={activity.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <GameWithMateri entry={entry} />
                        <p className="text-[10px] text-[#64748B] mt-0.5">
                          {member ? member.name || member.username : "Santri"}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-[#64748B]">
                        {new Date(activity.playedAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </StickerCard>
        </div>
      )}

      {/* TAB 3: PENGATURAN */}
      {activeTab === "pengaturan" && (
        <div className="space-y-5">
          {/* Edit Form */}
          <StickerCard variant="elevated" className="p-5 md:p-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#183B38] pb-2 border-b-2 border-dashed border-[#134E4A]/20">
              Informasi & Kurikulum Kelas
            </h2>
            <div className="mt-4 space-y-4">
              <InputField
                label="Nama Kelas"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <div>
                <label className="block text-xs font-bold text-[#183B38] mb-1.5">
                  Target Jilid
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((jilid) => (
                    <button
                      key={jilid}
                      type="button"
                      onClick={() => setEditTarget(jilid)}
                      className={`h-10 w-11 rounded-xl border-2 text-xs font-black transition-all ${
                        editTarget === jilid
                          ? "border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0_#134E4A]"
                          : "border-[#134E4A] bg-white text-[#183B38] hover:bg-[#CCFBF1]"
                      }`}
                    >
                      J.{jilid}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183B38] mb-1.5">
                  Fokus Materi
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_MATERI_POKOK.map((materi) => {
                    const active = editFocusMateri.includes(materi);
                    return (
                      <button
                        key={materi}
                        type="button"
                        onClick={() =>
                          setEditFocusMateri((prev) =>
                            prev.includes(materi)
                              ? prev.filter((m) => m !== materi)
                              : [...prev, materi],
                          )
                        }
                        className={`inline-flex items-center rounded-lg border-2 px-2.5 py-1 text-xs font-black transition-all ${
                          active
                            ? "border-[#134E4A] bg-[#134E4A] text-white shadow-[1.5px_1.5px_0_#134E4A]"
                            : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#FEF08A]"
                        }`}
                      >
                        {active && <Check size={12} className="inline mr-1" />}
                        {MATERI_LABELS[materi]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {editError && (
                <div className="rounded-xl border-2 border-[#E11D48] bg-[#FFF1F2] p-3 text-xs font-black text-[#9F1239] shadow-[2px_2px_0px_#E11D48]">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="rounded-xl border-2 border-[#134E4A] bg-[#DCFCE7] p-3 text-xs font-black text-[#15803D] shadow-[2px_2px_0px_#134E4A]">
                  Perubahan berhasil disimpan!
                </div>
              )}

              <div className="pt-2">
                <StickerButton
                  variant="primary"
                  size="md"
                  loading={savingEdit}
                  onClick={handleSaveEdit}
                >
                  Simpan Perubahan
                </StickerButton>
              </div>
            </div>
          </StickerCard>

          {/* Duel Toggle Card */}
          {isTeacher && (
            <StickerCard variant="elevated" className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#183B38]">
                    Tantangan Duel Antar Santri
                  </h3>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    {duelEnabled
                      ? "Santri diizinkan untuk saling mengajak duel kuis di kelas ini."
                      : "Fitur tantangan duel dimatikan untuk santri kelas ini."}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={duelEnabled}
                  disabled={savingDuel}
                  onClick={handleToggleDuel}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-[#134E4A] shadow-[2px_2px_0_#134E4A] transition-colors duration-200 ease-in-out focus:outline-none ${
                    duelEnabled ? "bg-[#0D9488]" : "bg-[#CBD5E1]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full border-2 border-[#134E4A] bg-white transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                      duelEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </StickerCard>
          )}

          {/* Danger Zone */}
          {isTeacher && (
            <StickerCard variant="outlined" className="p-5 border border-[#FCA5A5] bg-[#FFF5F5]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#991B1B]">
                Zona Tindakan Penting
              </h3>
              <p className="mt-1 text-xs text-[#7F1D1D]">
                Tindakan di bawah ini mempengaruhi akses santri terhadap kelas ini.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <StickerButton
                  variant="outline"
                  size="sm"
                  loading={archiving}
                  onClick={() => setArchiveConfirm(true)}
                  className="border-[#991B1B] text-[#991B1B] hover:bg-[#FEE2E2]"
                >
                  Arsipkan Kelas
                </StickerButton>
                <StickerButton
                  variant="danger"
                  size="sm"
                  loading={leaving}
                  onClick={() => setLeaveConfirm(true)}
                >
                  Keluar dari Kelas
                </StickerButton>
              </div>
            </StickerCard>
          )}

          {actionError && (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-xs font-bold text-[#991B1B]">
              {actionError}
            </div>
          )}
        </div>
      )}

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={archiveConfirm}
        title="Arsipkan Kelas"
        description="Kelas ini akan ditandai sebagai arsip. Santri tidak lagi melihat aktivitas baru di kelas ini."
        isDestructive
        onConfirm={handleArchive}
        onCancel={() => setArchiveConfirm(false)}
      />
      <ConfirmDialog
        isOpen={leaveConfirm}
        title="Keluar Kelas"
        description="Anda akan keluar dari kelas ini. Pastikan Anda sudah memindahkan tanggung jawab pengajar."
        isDestructive
        onConfirm={handleLeave}
        onCancel={() => setLeaveConfirm(false)}
      />
    </div>
  );
}
