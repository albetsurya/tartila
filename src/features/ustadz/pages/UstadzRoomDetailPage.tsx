import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
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
  averagePercentByMateri,
  listAttempts,
  listQuizzesForRoom,
  type Quiz,
  type MateriQuizAverage,
} from "@/services/quizBankService";
import { duelService } from "@/services/duelService";

function initials(name: string | null, username: string | null): string {
  const base = name || username || "?";
  return base.trim().slice(0, 2).toUpperCase();
}

/** Nama game + chip materi dalam satu baris kecil. */
function GameWithMateri({ entry }: { entry: GameCatalogEntry }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <span className="font-black text-[#134E4A]">{entry.title}</span>
      {entry.materiPokok.map((materi) => (
        <span
          key={materi}
          className="rounded-md border border-[#134E4A] bg-[#ECFEFF] px-1 text-[9px] font-black text-[#134E4A]"
        >
          {MATERI_LABELS[materi]}
        </span>
      ))}
    </span>
  );
}

export function UstadzRoomDetailPage() {
  const { roomId = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTeacher } = useClassroomAccess();

  const [room, setRoom] = useState<ClassroomRoom | null>(null);
  const [participants, setParticipants] = useState<ClassroomParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState(1);
  const [editFocusMateri, setEditFocusMateri] = useState<MateriPokok[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const [recommendations, setRecommendations] = useState<GameRecommendation[]>(
    [],
  );
  const [assignments, setAssignments] = useState<GameAssignment[]>([]);
  const [activities, setActivities] = useState<ClassroomActivity[]>([]);
  const [coverage, setCoverage] = useState<MateriCoverageItem[]>([]);
  const [roomQuizzes, setRoomQuizzes] = useState<Quiz[]>([]);
  const [quizAverages, setQuizAverages] = useState<MateriQuizAverage[]>([]);
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
    const room = result.data.room;
    const murid = result.data.participants.filter(
      (member: ClassroomParticipant) => member.roleInRoom === "murid",
    );
    setRoom(room);
    setParticipants(result.data.participants);
    setEditName(room.name);
    setEditTarget(room.targetJilid);

    const focusMateri = await getRoomFocusMateri(roomId);
    setEditFocusMateri(focusMateri);
    const targetJilid = Math.min(
      Math.max(room.targetJilid, 1),
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
    setQuizAverages(averagePercentByMateri(quizzes, attempts));
  }, [roomId]);

  useEffect(() => {
    void load();
  }, [load]);

  const copyJoinCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.joinCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveEdit = async () => {
    if (!room) return;
    setSavingEdit(true);
    setEditError("");
    const result = await updateClassroom(room.id, user?.id, {
      name: editName,
      targetJilid: editTarget,
    });
    setRoomFocusMateri(room.id, editFocusMateri);
    if (!result.ok) {
      setSavingEdit(false);
      setEditError(result.message);
      return;
    }
    setRoom(result.data);
    setEditing(false);
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
    await archiveClassroom(room.id, user?.id);
    setArchiving(false);
    navigate("/ustadz/kelas");
  };

  const handleLeave = async () => {
    setLeaving(true);
    await leaveClassroom(roomId, user?.id);
    setLeaving(false);
    navigate("/ustadz");
  };

  const murid =
    participants.filter((p: ClassroomParticipant) => p.roleInRoom === "murid");

  return (
    <>
      <div className="w-full max-w-5xl space-y-4">
        {loading && (
          <p className="py-10 text-center text-xs font-bold text-[#134E4A]/60">
            Memuat kelas…
          </p>
        )}
        {error && (
          <StickerCard className="p-6 text-center">
            <p className="text-sm font-black text-[#FF6B6B]">{error}</p>
            <StickerButton
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => navigate("/ustadz/kelas")}
            >
              Kembali ke Daftar
            </StickerButton>
          </StickerCard>
        )}

        {!loading && !error && room && (
          <>
            <StickerCard className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-black text-[#134E4A]">
                    {room.name}
                  </p>
                  {room.description && (
                    <p className="mt-0.5 text-xs font-semibold text-[#134E4A]/70">
                      {room.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs font-semibold text-[#134E4A]/60">
                    {participants.length}/{room.maxParticipants} anggota ·
                    Target Jilid {room.targetJilid}
                    {room.hasPassword ? " · Terkunci password" : ""}
                  </p>
                </div>
                {isTeacher && (
                  <StickerButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing((prev) => !prev)}
                  >
                    {editing ? "Batal" : "Edit"}
                  </StickerButton>
                )}
              </div>

              {isTeacher && editing && (
                <div className="mt-3 space-y-3 rounded-xl border-[3px] border-dashed border-[#134E4A] bg-[#FDFCF7] p-3">
                  <InputField
                    label="Nama Kelas"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <div>
                    <p className="mb-1.5 text-xs font-black text-[#134E4A]">
                      Target Jilid
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((jilid) => (
                        <button
                          key={jilid}
                          type="button"
                          onClick={() => setEditTarget(jilid)}
                          className={`h-9 w-9 rounded-xl border-[3px] text-sm font-black ${
                            editTarget === jilid
                              ? "border-[#134E4A] bg-[#0D9488] text-white"
                              : "border-[#134E4A] bg-white text-[#134E4A]"
                          }`}
                        >
                          {jilid}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-black text-[#134E4A]">
                      Fokus Materi
                    </p>
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
                            className={`rounded-xl border-[3px] px-2 py-1 text-[10px] font-black transition-colors ${
                              active
                                ? "border-[#134E4A] bg-[#0D9488] text-white"
                                : "border-[#134E4A] bg-white text-[#134E4A] hover:bg-[#F0FDF4]"
                            }`}
                          >
                            {MATERI_LABELS[materi]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {editError && (
                    <p className="text-xs font-bold text-[#FF6B6B]">
                      {editError}
                    </p>
                  )}
                  <StickerButton
                    variant="primary"
                    size="sm"
                    loading={savingEdit}
                    onClick={handleSaveEdit}
                  >
                    Simpan Perubahan
                  </StickerButton>
                </div>
              )}
            </StickerCard>

            <StickerCard className="p-4">
              <p className="text-xs font-black text-[#134E4A]">
                Kode Join Kelas
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="tracking-[0.4em] text-2xl font-black text-[#0D9488]">
                  {room.joinCode}
                </span>
                <StickerButton variant="secondary" size="sm" onClick={copyJoinCode}>
                  {copied ? "Tersalin!" : "Salin"}
                </StickerButton>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-[#134E4A]/60">
                Bagikan kepada santri; mereka bergabung dari menu kelas dengan
                kode ini.
              </p>
            </StickerCard>

            {isTeacher && (
              <StickerCard className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#134E4A]">
                      Izinkan Tantangan Antar Santri
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#134E4A]/60">
                      {duelEnabled
                        ? "Santri bisa saling mengajak duel di kelas ini."
                        : "Tombol \"Tantang Duel\" disembunyikan dari santri."}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={duelEnabled}
                    disabled={savingDuel}
                    onClick={handleToggleDuel}
                    className={`relative h-8 w-14 shrink-0 rounded-full border-[3px] border-[#0A2540] transition-colors ${
                      duelEnabled ? "bg-[#0D9488]" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full border-2 border-[#0A2540] bg-white transition-all ${
                        duelEnabled ? "left-[calc(100%-1.5rem)]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </StickerCard>
            )}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-black text-[#134E4A]">
                  Game Direkomendasikan
                </h2>
                <StickerButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/ustadz/kurikulum")}
                >
                  Kurikulum
                </StickerButton>
              </div>
              <div className="space-y-2">
                {recommendations.slice(0, 6).map((rec) => {
                  const assigned = assignments.some(
                    (item) => item.gameId === rec.entry.gameId,
                  );
                  return (
                    <StickerCard key={rec.entry.gameId} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <GameWithMateri entry={rec.entry} />
                          <p className="mt-1 text-[11px] font-semibold text-[#134E4A]/70">
                            {rec.reason}
                          </p>
                        </div>
                        {isTeacher && (
                          <StickerButton
                            variant={assigned ? "secondary" : "primary"}
                            size="sm"
                            onClick={() => handleToggleAssignment(rec.entry)}
                          >
                            {assigned ? "Ditugaskan" : "Tandai"}
                          </StickerButton>
                        )}
                      </div>
                    </StickerCard>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-black text-[#134E4A]">
                  Kuis Kelas
                </h2>
                {isTeacher && (
                  <StickerButton
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/ustadz/kuis/baru")}
                  >
                    + Buat Kuis
                  </StickerButton>
                )}
              </div>
              {roomQuizzes.length === 0 ? (
                <StickerCard className="p-4 text-center">
                  <p className="text-[11px] font-semibold text-[#134E4A]/60">
                    Belum ada kuis untuk kelas ini.
                  </p>
                </StickerCard>
              ) : (
                <div className="space-y-2">
                  {roomQuizzes.map((quiz) => {
                    const avg = quizAverages.find(
                      (item) => item.materi === quiz.materi,
                    );
                    return (
                      <StickerCard key={quiz.id} className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-black text-[#134E4A]">
                              {quiz.title}
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold text-[#134E4A]/70">
                              {MATERI_LABELS[quiz.materi]}
                              {" · "}
                              {quiz.questions.length} soal
                            </p>
                          </div>
                          <span className="shrink-0 text-xs font-black text-[#0D9488]">
                            {avg ? `${avg.averagePercent} rata-rata` : "Belum dinilai"}
                          </span>
                        </div>
                      </StickerCard>
                    );
                  })}
                </div>
              )}
            </div>

            <StickerCard className="p-4">
              <p className="text-sm font-black text-[#134E4A]">
                Cakupan Materi Kelas
              </p>
              <p className="mt-1 text-xs font-semibold text-[#134E4A]/80">
                {coverageSummaryLine(coverage)}
              </p>
              {coverageRecommendations(
                activities,
                editFocusMateri,
              ).map((rec) => (
                <p
                  key={rec}
                  className="mt-1 text-[11px] font-bold text-[#FF6B6B]"
                >
                  {rec}
                </p>
              ))}
            </StickerCard>

            <div>
              <h2 className="mb-2 text-sm font-black text-[#134E4A]">
                Aktivitas Terbaru
              </h2>
              {activities.length === 0 ? (
                <StickerCard className="p-4 text-center">
                  <p className="text-xs font-bold text-[#134E4A]/70">
                    Belum ada aktivitas santri yang terpantau.
                  </p>
                </StickerCard>
              ) : (
                <div className="space-y-2">
                  {activities.slice(0, 8).map((activity) => {
                    const entry = getGameById(activity.gameId);
                    const member = participants.find(
                      (item: ClassroomParticipant) =>
                        item.userId === activity.userId,
                    );
                    if (!entry) return null;
                    return (
                      <StickerCard key={activity.id} className="p-3">
                        <GameWithMateri entry={entry} />
                        <p className="mt-0.5 text-[10px] font-bold text-[#134E4A]/60">
                          {member ? member.name || member.username : "Santri"}
                          {" · "}
                          {new Date(activity.playedAt).toLocaleDateString(
                            undefined,
                            { day: "numeric", month: "short" },
                          )}
                        </p>
                      </StickerCard>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h2 className="mb-2 text-sm font-black text-[#134E4A]">
                Anggota Kelas ({murid.length} santri)
              </h2>
              {murid.length === 0 ? (
                <StickerCard className="p-6 text-center">
                  <p className="text-sm font-bold text-[#134E4A]/70">
                    Belum ada santri yang bergabung. Bagikan kodenya!
                  </p>
                </StickerCard>
              ) : (
                <div className="space-y-2">
                  {murid.map((member: ClassroomParticipant) => (
                    <StickerCard key={member.id} className="flex items-center gap-3 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-[#FEF3C7] text-xs font-black text-[#7C2D12]">
                        {initials(member.name, member.username)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-[#134E4A]">
                          {member.name || member.username}
                        </p>
                        <p className="text-[11px] font-semibold text-[#134E4A]/60">
                          Level {member.level}
                        </p>
                      </div>
                    </StickerCard>
                  ))}
                </div>
              )}
            </div>

            {isTeacher && (
              <div className="flex gap-2">
                <StickerButton
                  variant="coral-outline"
                  size="sm"
                  loading={archiving}
                  onClick={handleArchive}
                  fullWidth
                >
                  Arsipkan Kelas
                </StickerButton>
                <StickerButton
                  variant="danger"
                  size="sm"
                  loading={leaving}
                  onClick={handleLeave}
                  fullWidth
                >
                  Keluar Kelas
                </StickerButton>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
