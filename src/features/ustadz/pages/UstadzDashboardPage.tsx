import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  GraduationCap,
  Trophy,
  Users,
  Check,
} from "@/components/ui/CustomIcons";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import {
  listOwnedClassrooms,
  getClassroomDetail,
  joinClassroomByCode,
  type ClassroomRoom,
  type ClassroomParticipant,
} from "@/services/classroomService";
import { classroomRoleForUser, isUstadzUser } from "@/lib/roles";
import { normalizeJoinCode } from "@/services/classroomService";
import {
  listClassroomActivities,
  getRoomFocusMateri,
  listMateriReadProgress,
  listTodayAlerts,
  type TeacherAlert,
} from "@/services/ustadzMonitoringService";
import { listQuizzes, listQuizzesForRoom, listAttempts, averagePercentByQuiz, type QuizAverage } from "@/services/quizBankService";
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

  // Onboarding checklist: langkah awal pengajar (tanpa gamifikasi santri).
  const checklist: { label: string; done: boolean }[] = [
    { label: "Buat Kelas Pertama", done: activeRooms.length > 0 },
    { label: "Undang Santri dengan Kode Join", done: totalSantri > 0 },
    { label: "Buat Bank Kuis", done: quizCount > 0 },
  ];
  const checklistDone = checklist.filter((step) => step.done).length;
  const checklistPercent = Math.round(
    (checklistDone / Math.max(checklist.length, 1)) * 100,
  );

  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [coverage, setCoverage] = useState<MateriCoverageItem[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [readCoverage, setReadCoverage] = useState<MateriReadCoverageItem[]>([]);
  const [quizAverages, setQuizAverages] = useState<QuizAverage[]>([]);
  const [alerts, setAlerts] = useState<TeacherAlert[]>([]);

  const monitorRoom =
    activeRooms.find((room) => room.id === selectedRoomId) ?? activeRooms[0] ??
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
    <>
      <div className="w-full max-w-6xl space-y-5">
        <div className="flex items-center gap-3">
          <span className="ustadz-accent-soft flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
            <GraduationCap size={24} />
          </span>
          <div>
            <h1 className="text-lg font-black text-[#134E4A]">
              Assalamu'alaikum, {greetName}!
            </h1>
            <p className="text-xs font-bold text-[#134E4A]/70">
              {isTeacher
                ? "Panel pengajar: kelola kelas dan santri di sini."
                : "Mode pemantau: lihat kelas tanpa mengubah data."}
            </p>
          </div>
        </div>

        {isTeacher && (
          <StickerCard className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#134E4A]">
                  Checklist Awal Mengajar
                </p>
                <p className="text-xs font-semibold text-[#134E4A]/70">
                  Selesaikan tiga langkah ini untuk memulai kelas digitalmu.
                </p>
              </div>
              <span
                className={`text-xl font-black ${
                  checklistPercent === 100
                    ? "text-[#0D9488]"
                    : "text-[#0A2540]"
                }`}
              >
                {checklistPercent}%
              </span>
            </div>
            <div className="mt-2 h-4 w-full overflow-hidden rounded-full border-[2.5px] border-[#0A2540] bg-[#F4F1EA]">
              <div
                className="h-full rounded-full bg-[#0D9488] transition-all duration-300"
                style={{ width: `${Math.max(checklistPercent, 2)}%` }}
              />
            </div>
            <ul className="mt-3 space-y-2">
              {checklist.map((step) => (
                <li key={step.label} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-[2.5px] border-[#0A2540] text-[11px] font-black ${
                      step.done
                        ? "bg-[#0D9488] text-white"
                        : "bg-white text-transparent"
                    }`}
                    aria-label={step.done ? "selesai" : "belum"}
                  >
                    {step.done ? <Check size={14} /> : null}
                  </span>
                  <span
                    className={`text-xs font-black ${
                      step.done
                        ? "text-[#134E4A] line-through decoration-[#0D9488] decoration-2"
                        : "text-[#134E4A]"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </StickerCard>
        )}

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border-[3px] border-[#0A2540] bg-[#BBF7D0] p-4 shadow-[5px_5px_0_#0A2540]">
              <Users size={20} />
              <p className="mt-1 text-3xl font-black text-[#0A2540]">
                {activeRooms.length}
              </p>
              <p className="text-[11px] font-black uppercase tracking-wide text-[#0A2540]/70">
                Total Kelas
              </p>
            </div>
            <div className="rounded-2xl border-[3px] border-[#0A2540] bg-[#FEF08A] p-4 shadow-[5px_5px_0_#0A2540]">
              <GraduationCap size={20} />
              <p className="mt-1 text-3xl font-black text-[#0A2540]">
                {totalSantri}
              </p>
              <p className="text-[11px] font-black uppercase tracking-wide text-[#0A2540]/70">
                Total Santri
              </p>
            </div>
            <div className="rounded-2xl border-[3px] border-[#0A2540] bg-[#BFDBFE] p-4 shadow-[5px_5px_0_#0A2540]">
              <Trophy size={20} />
              <p className="mt-1 text-3xl font-black text-[#0A2540]">{quizCount}</p>
              <p className="text-[11px] font-black uppercase tracking-wide text-[#0A2540]/70">
                Total Kuis
              </p>
            </div>
          </div>

        {isTeacher && activeRooms.length === 0 && (
          <StickerCard className="p-5 text-center">
            <svg
              viewBox="0 0 96 64"
              aria-hidden="true"
              className="mx-auto h-24 w-auto"
            >
              <rect x="14" y="26" width="52" height="30" rx="4" fill="#BFDBFE" stroke="#0A2540" strokeWidth="3" />
              <path d="M10 26l30-16 30 16" fill="#FEF08A" stroke="#0A2540" strokeWidth="3" strokeLinejoin="round" />
              <rect x="34" y="38" width="12" height="18" fill="#0D9488" stroke="#0A2540" strokeWidth="2.5" />
              <rect x="52" y="32" width="8" height="8" fill="#FFF7ED" stroke="#0A2540" strokeWidth="2" />
              <rect x="20" y="32" width="8" height="8" fill="#FFF7ED" stroke="#0A2540" strokeWidth="2" />
              <circle cx="80" cy="18" r="4" fill="#BBF7D0" stroke="#0A2540" strokeWidth="2" />
              <circle cx="8" cy="46" r="3" fill="#FECACA" stroke="#0A2540" strokeWidth="2" />
            </svg>
            <p className="mt-2 text-sm font-black text-[#134E4A]">
              Kamu belum punya kelas. Yuk buat kelas pertamamu!
            </p>
            <p className="mt-1 text-xs font-semibold text-[#134E4A]/70">
              Atur santrimu, bagikan kode join, lalu mulai dari Kurikulum
              Tilawati.
            </p>
            <StickerButton
              variant="primary"
              size="lg"
              className="mt-4 w-full sm:w-auto"
              onClick={() => navigate("/ustadz/kelas/baru")}
            >
              Buat Kelas Baru
            </StickerButton>
          </StickerCard>
        )}

        {isTeacher && activeRooms.length > 0 && (
          <StickerCard className="p-4">
            <p className="text-xs font-black text-[#134E4A]">
              Pantau Kelas
            </p>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {activeRooms.map((room) => {
                const selected = room.id === monitorRoom?.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`shrink-0 rounded-xl border-[3px] border-[#0A2540] px-3 py-1.5 text-xs font-black transition-colors ${
                      selected
                        ? "bg-[#0D9488] text-white shadow-[3px_3px_0_#0A2540]"
                        : "bg-white text-[#134E4A] hover:bg-[#F4F1EA]"
                    }`}
                  >
                    {room.name}
                  </button>
                );
              })}
            </div>
          </StickerCard>
        )}

        {isTeacher && (
          <div>
            <h2 className="mb-2 text-sm font-black text-[#134E4A]">
              Perlu Perhatian Hari Ini
            </h2>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="flex items-center gap-3 rounded-2xl border-[3px] border-[#0A2540] bg-[#BBF7D0] p-4 shadow-[4px_4px_0_#0A2540]">
                  <svg
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                    className="h-12 w-12 shrink-0"
                  >
                    <circle cx="24" cy="26" r="16" fill="#FEF08A" stroke="#0A2540" strokeWidth="3" />
                    <path
                      d="M24 17l2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.9z"
                      fill="#0A2540"
                    />
                    <path d="M14 8l1.4 2.8L18 12l-2.6 1.2L14 16l-1.4-2.8L10 12l2.6-1.2z" fill="#0D9488" stroke="#0A2540" strokeWidth="1.5" />
                    <path d="M36 6l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#0D9488" stroke="#0A2540" strokeWidth="1.5" />
                  </svg>
                  <div>
                    <p className="text-sm font-black text-[#134E4A]">
                      Semua tertangani. Bagus, tidak ada tugas tertunda!
                    </p>
                    <p className="text-xs font-semibold text-[#134E4A]/70">
                      Semua santri terpantau aman dan aktif.
                    </p>
                  </div>
                </div>
              ) : (
                alerts.map((alert) => (
                  <StickerCard
                    key={alert.id}
                    accent={alert.kind === "apresiasi" ? "deep-teal" : "coral"}
                    asButton
                    className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                    onClick={() => {
                      if (alert.kind === "kuis-belum-dikerjakan") {
                        navigate("/ustadz/kuis");
                      } else if (alert.kind === "kurang-latihan") {
                        navigate("/ustadz/laporan");
                      } else {
                        navigate("/ustadz/laporan");
                      }
                    }}
                  >
                    <p className="text-sm font-bold text-[#134E4A]">
                      {alert.title}
                    </p>
                    <span
                      className={`shrink-0 self-start rounded-xl border-[3px] border-[#0A2540] px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_#0A2540] transition-transform hover:-translate-y-[1px] ${
                        alert.kind === "apresiasi"
                          ? "bg-[#BBF7D0] text-[#134E4A]"
                          : alert.kind === "kurang-latihan"
                            ? "bg-[#FEF08A] text-[#134E4A]"
                            : "bg-[#BFDBFE] text-[#134E4A]"
                      }`}
                    >
                      {alert.actionLabel}
                    </span>
                  </StickerCard>
                ))
              )}
            </div>
          </div>
        )}

        {isTeacher && activeRooms.length > 0 && (
          <StickerCard className="p-4">
            <p className="text-sm font-black text-[#134E4A]">
              Cakupan Materi · {monitorRoom?.name ?? ""}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#134E4A]/80">
              {coverage.length > 0
                ? coverageSummaryLine(coverage)
                : "Memuat aktivitas…"}
            </p>
            {recommendations.length > 0 && (
              <ul className="mt-2 space-y-1">
                {recommendations.map((rec) => (
                  <li
                    key={rec}
                    className="list-disc pl-4 text-[11px] font-bold text-[#FF6B6B]"
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-3 border-t-2 border-dashed border-[#134E4A]/30 pt-3">
              <p className="text-xs font-black text-[#134E4A]">
                Progress Baca Materi
              </p>
              {readCoverage.length > 0 ? (
                <ul className="mt-1 space-y-1">
                  {readCoverage.map((item) => (
                    <li
                      key={item.materiId}
                      className="flex items-center justify-between text-[11px] font-semibold text-[#134E4A]/80"
                    >
                      <span>{item.label}</span>
                      <span className="font-black text-[#0D9488]">
                        {item.percent}%
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-[11px] font-semibold text-[#134E4A]/60">
                  Belum ada data baca.
                </p>
              )}
              {readCoverage.length > 0 && (
                <p className="mt-1 text-[10px] font-bold text-[#134E4A]/60">
                  {readCoverageSummaryLine(readCoverage[0])}
                </p>
              )}
            </div>

            <div className="mt-3 border-t-2 border-dashed border-[#134E4A]/30 pt-3">
              <p className="text-xs font-black text-[#134E4A]">
                Rata-rata Nilai Kuis
              </p>
              {quizAverages.length > 0 ? (
                <ul className="mt-1 space-y-1">
                  {quizAverages.map((item) => (
                    <li
                      key={item.quizId}
                      className="flex items-center justify-between text-[11px] font-semibold text-[#134E4A]/80"
                    >
                      <span>
                        {item.quizTitle}
                        <span className="text-[10px] font-bold text-[#134E4A]/50">
                          {" "}
                          · {item.attemptCount} pengerjaan
                        </span>
                      </span>
                      <span className="font-black text-[#0D9488]">
                        {item.averagePercent}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-[11px] font-semibold text-[#134E4A]/60">
                  Belum ada kuis yang dikerjakan santri.
                </p>
              )}
            </div>
          </StickerCard>
        )}

        {isTeacher && activeRooms.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-black text-[#134E4A]">
              Kelas Terbaru
            </h2>
            <div className="space-y-2">
              {activeRooms.slice(0, 3).map((room) => (
                <StickerCard
                  key={room.id}
                  asButton
                  className="p-3"
                  onClick={() => navigate(`/ustadz/kelas/${room.id}`)}
                >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-[#134E4A]">
                          {room.name}
                        </p>
                        <p className="text-xs font-semibold text-[#134E4A]/60">
                          {room.participantCount}/{room.maxParticipants} anggota
                          · Jilid {room.targetJilid}
                        </p>
                      </div>
                      <span className="text-xs font-black text-[#0D9488]">
                        {room.joinCode}
                      </span>
                    </div>
                  </StickerCard>
                ))}
              </div>
          </div>
        )}

        <StickerCard className="p-4">
          <p className="text-sm font-black text-[#134E4A]">Gabung Kelas</p>
          <p className="text-xs font-semibold text-[#134E4A]/70">
            Punya kode dari pengajar lain? Masukkan di sini.
          </p>
          <form onSubmit={handleJoinByCode} className="mt-3 space-y-3">
            <InputField
              placeholder="Kode (6 karakter)"
              maxLength={8}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              autoCapitalize="characters"
            />
            {joinError && (
              <p className="text-xs font-bold text-[#FF6B6B]">{joinError}</p>
            )}
            <StickerButton
              type="submit"
              variant="primary"
              size="sm"
              loading={joining}
              disabled={normalizeJoinCode(joinCode).length !== 6}
              fullWidth
            >
              Gabung
            </StickerButton>
          </form>
        </StickerCard>

        {loading && (
          <p className="text-center text-xs font-bold text-[#134E4A]/60">
            Memuat kelas…
          </p>
        )}
        {loadError && (
          <p className="text-center text-xs font-bold text-[#FF6B6B]">
            {loadError}
          </p>
        )}

        {!isTeacher && !isUstadzUser(user) && (
          <p className="text-center text-xs font-bold text-[#134E4A]/70">
            Anda masuk sebagai pemantau (admin). Data kelas hanya bisa dilihat.
          </p>
        )}
      </div>
    </>
  );
}
