import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "@/features/ngaji-ceria/components/NgajiCeriaLayout";
import { useAuth } from "@/contexts/AuthContext";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  listOwnedClassrooms,
  getClassroomDetail,
  joinClassroomByCode,
  type ClassroomRoom,
  type ClassroomParticipant,
} from "@/services/classroomService";
import { classroomRoleFor, isUstadzUser } from "@/lib/roles";
import { normalizeJoinCode } from "@/services/classroomService";
import { listClassroomActivities, getRoomFocusMateri, listMateriReadProgress } from "@/services/ustadzMonitoringService";
import { listQuizzesForRoom, listAttempts, averagePercentByMateri } from "@/services/quizBankService";
import {
  coverageSummaryLine,
  coverageRecommendations,
  materiCoverage,
  materiReadCoverage,
  readCoverageSummaryLine,
  type MateriCoverageItem,
  type MateriReadCoverageItem,
} from "@/data/monitoring";
import { MATERI_LABELS } from "@/data/learningCatalog";

export function UstadzDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isTeacher = classroomRoleFor(user?.role) === "ustadz";
  const greetName = user?.name || user?.username || "Ustadz";

  const [ownedRooms, setOwnedRooms] = useState<ClassroomRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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

  const [coverage, setCoverage] = useState<MateriCoverageItem[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [monitorRoomName, setMonitorRoomName] = useState<string>("");
  const [readCoverage, setReadCoverage] = useState<MateriReadCoverageItem[]>([]);
  const [quizAverages, setQuizAverages] = useState<
    ReturnType<typeof averagePercentByMateri>
  >([]);

  useEffect(() => {
    if (!isTeacher) return;
    const active = ownedRooms.filter((room: ClassroomRoom) => !room.archived);
    if (active.length === 0) return;
    let alive = true;
    const target = active[0];
    setMonitorRoomName(target.name);
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
      const focusMateri = getRoomFocusMateri(target.id);
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
      setQuizAverages(averagePercentByMateri(roomQuizzes, attempts));
    });
    return () => {
      alive = false;
    };
  }, [ownedRooms, isTeacher]);

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
    <NgajiCeriaLayout title="Dashboard Ustadz" hideNav>
      <div className="mx-auto w-full max-w-md px-4 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <TilaMascot
            size={72}
            mood="happy"
            animation={isTeacher ? "bounce" : "float"}
            direction="front"
          />
          <div>
            <h1 className="text-lg font-black text-[#134E4A]">
              Assalamu'alaikum, {greetName}!
            </h1>
            <p className="text-xs font-bold text-[#134E4A]/70">
              {isTeacher
                ? "Panel pengajar — kelola kelas dan santri di sini."
                : "Mode pemantau — lihat kelas tanpa mengubah data."}
            </p>
          </div>
        </div>

        {isTeacher && (
          <div className="grid grid-cols-3 gap-3">
            <StickerCard className="p-3 text-center">
              <p className="text-2xl font-black text-[#0D9488]">
                {activeRooms.length}
              </p>
              <p className="text-[10px] font-bold text-[#134E4A]/70">
                Kelas Aktif
              </p>
            </StickerCard>
            <StickerCard className="p-3 text-center">
              <p className="text-2xl font-black text-[#0D9488]">{totalSantri}</p>
              <p className="text-[10px] font-bold text-[#134E4A]/70">
                Santri
              </p>
            </StickerCard>
            <StickerCard className="p-3 text-center">
              <p className="text-2xl font-black text-[#0D9488]">
                {user?.is_vip ? "VIP" : "FREE"}
              </p>
              <p className="text-[10px] font-bold text-[#134E4A]/70">
                Paket
              </p>
            </StickerCard>
          </div>
        )}

        <div>
          <h2 className="mb-2 text-sm font-black text-[#134E4A]">Menu Cepat</h2>
          <div className="space-y-3">
            {isTeacher && (
              <StickerCard
                accent="deep-teal"
                asButton
                className="flex items-center justify-between p-4"
                onClick={() => navigate("/ustadz/kelas/baru")}
              >
                <div>
                  <p className="text-sm font-black text-[#134E4A]">
                    Buat Kelas Baru
                  </p>
                  <p className="text-xs font-semibold text-[#134E4A]/70">
                    Kelola kelas baru beserta kode join-nya
                  </p>
                </div>
                <span className="text-lg font-black text-[#0D9488]">+</span>
              </StickerCard>
            )}
            <StickerCard
              asButton
              className="flex items-center justify-between p-4"
              onClick={() => navigate("/ustadz/kelas")}
            >
              <div>
                <p className="text-sm font-black text-[#134E4A]">
                  Kelola Daftar Kelas
                </p>
                <p className="text-xs font-semibold text-[#134E4A]/70">
                  Lihat semua kelas dan anggotanya
                </p>
              </div>
              <span className="text-lg font-black text-[#0D9488]">→</span>
            </StickerCard>
            <StickerCard
              asButton
              className="flex items-center justify-between p-4"
              onClick={() => navigate("/ustadz/kurikulum")}
            >
              <div>
                <p className="text-sm font-black text-[#134E4A]">
                  Kurikulum & Kuis
                </p>
                <p className="text-xs font-semibold text-[#134E4A]/70">
                  Materi, kuis, dan game pendukung selaras Jilid Tilawati
                </p>
              </div>
              <span className="text-lg font-black text-[#0D9488]">→</span>
            </StickerCard>
            <StickerCard
              asButton
              className="flex items-center justify-between p-4"
              onClick={() => navigate("/ustadz/kuis")}
            >
              <div>
                <p className="text-sm font-black text-[#134E4A]">
                  Bank Kuis
                </p>
                <p className="text-xs font-semibold text-[#134E4A]/70">
                  Buat kuis & lihat rata-rata nilai santri
                </p>
              </div>
              <span className="text-lg font-black text-[#0D9488]">→</span>
            </StickerCard>
          </div>
        </div>

        {isTeacher && activeRooms.length > 0 && (
          <StickerCard className="p-4">
            <p className="text-sm font-black text-[#134E4A]">
              Cakupan Materi · {monitorRoomName}
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
                      key={item.materi}
                      className="flex items-center justify-between text-[11px] font-semibold text-[#134E4A]/80"
                    >
                      <span>
                        {MATERI_LABELS[item.materi]}
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
    </NgajiCeriaLayout>
  );
}
