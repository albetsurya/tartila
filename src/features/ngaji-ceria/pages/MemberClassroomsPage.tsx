import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { useAuth } from "@/contexts/AuthContext";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { InputField } from "@/components/ui/InputField";
import {
  joinClassroomByCode,
  leaveClassroom,
  listJoinedClassrooms,
  type ClassroomRoom,
} from "@/services/classroomService";
import { getGameById, MATERI_LABELS } from "@/data/learningCatalog";
import { listGameAssignments } from "@/services/ustadzMonitoringService";
import { listQuizzesForRooms, type Quiz } from "@/services/quizBankService";

export function MemberClassroomsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rooms, setRooms] = useState<ClassroomRoom[]>([]);
  const [assignedByRoom, setAssignedByRoom] = useState<Map<string, string[]>>(
    new Map(),
  );
  const [quizzesByRoom, setQuizzesByRoom] = useState<Map<string, Quiz[]>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [joinCode, setJoinCode] = useState("");
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const [leavingId, setLeavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const result = await listJoinedClassrooms(user?.id);
    setLoading(false);
    if (!result.ok) {
      setLoadError(result.message);
      return;
    }
    setRooms(result.data);
    const assignmentMap = new Map<string, string[]>();
    for (const room of result.data) {
      const assigned = await listGameAssignments(room.id);
      if (assigned.length > 0) {
        assignmentMap.set(
          room.id,
          assigned.map((item) => item.gameId),
        );
      }
    }
    setAssignedByRoom(assignmentMap);

    const roomIds = result.data.map((room) => room.id);
    const quizzes = await listQuizzesForRooms(roomIds);
    const quizMap = new Map<string, Quiz[]>();
    for (const quiz of quizzes) {
      if (quiz.roomId === null) continue;
      const bucket = quizMap.get(quiz.roomId) ?? [];
      bucket.push(quiz);
      quizMap.set(quiz.roomId, bucket);
    }
    setQuizzesByRoom(quizMap);
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError("");
    setNeedsPassword(false);
    setJoining(true);
    const result = await joinClassroomByCode({
      joinCode,
      userId: user?.id,
      userRole: user?.role,
      password: password || undefined,
    });
    setJoining(false);

    if (!result.ok) {
      if (result.code === "wrong-password") setNeedsPassword(true);
      setJoinError(result.message);
      return;
    }
    setJoinCode("");
    setPassword("");
    await load();
  };

  const handleLeave = async (roomId: string) => {
    setLeavingId(roomId);
    await leaveClassroom(roomId, user?.id);
    setLeavingId(null);
    await load();
  };

  return (
    <NgajiCeriaLayout title="Kelas Saya" hideNav>
      <div className="mx-auto w-full max-w-md px-4 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <p className="text-sm font-black text-[#134E4A]">
            Gabung kelas ustadz-mu lewat kode join, yuk!
          </p>
        </div>

        <StickerCard className="p-4">
          <p className="text-sm font-black text-[#134E4A]">Gabung Kelas</p>
          <form onSubmit={handleJoin} className="mt-3 space-y-3">
            <InputField
              placeholder="Kode (6 karakter)"
              maxLength={8}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              autoCapitalize="characters"
            />
            {needsPassword && (
              <InputField
                label="Password Kelas"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            {joinError && (
              <p className="text-xs font-bold text-[#FF6B6B]">{joinError}</p>
            )}
            <StickerButton
              type="submit"
              variant="primary"
              size="sm"
              loading={joining}
              disabled={joinCode.trim().length < 6}
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

        {rooms.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-black text-[#134E4A]">
              Kelas Yang Diikuti
            </h2>
            <div className="space-y-2">
              {rooms.map((room) => (
                <StickerCard key={room.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-[#134E4A]">
                        {room.name}
                      </p>
                      <p className="text-xs font-semibold text-[#134E4A]/60">
                        {room.ustadzName || "Ustadz"} · Target Jilid{" "}
                        {room.targetJilid}
                      </p>
                    </div>
                    <StickerButton
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        navigate(`/member/ngaji-ceria/kelas/${room.id}`)
                      }
                    >
                      Buka Kelas
                    </StickerButton>
                  </div>
                  <div className="mt-3">
                    <StickerButton
                      variant="coral-outline"
                      size="sm"
                      loading={leavingId === room.id}
                      onClick={() => handleLeave(room.id)}
                    >
                      Keluar Kelas
                    </StickerButton>
                  </div>

                  {(assignedByRoom.get(room.id)?.length ?? 0) > 0 && (
                    <div className="mt-3 rounded-xl border-2 border-dashed border-[#134E4A] bg-[#F0FDF4] p-2">
                      <p className="text-[10px] font-black uppercase text-[#134E4A]/70">
                        Game direkomendasikan ustadz
                      </p>
                      <ul className="mt-1 space-y-1">
                        {assignedByRoom
                          .get(room.id)
                          ?.map((gameId) => getGameById(gameId))
                          .filter(
                            (entry): entry is NonNullable<typeof entry> =>
                              entry !== undefined,
                          )
                          .map((entry) => (
                            <li
                              key={entry.gameId}
                              className="text-[11px] font-semibold text-[#134E4A]/80"
                            >
                              <span className="font-black">{entry.title}</span>
                              {" · "}
                              {entry.materiPokok
                                .map((m) => MATERI_LABELS[m])
                                .join(", ")}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                  {(quizzesByRoom.get(room.id)?.length ?? 0) > 0 && (
                    <div className="mt-3 rounded-xl border-2 border-dashed border-[#134E4A] bg-[#F5F3FF] p-2">
                      <p className="text-[10px] font-black uppercase text-[#134E4A]/70">
                        Kuis dari ustadz
                      </p>
                      <ul className="mt-1 space-y-1.5">
                        {quizzesByRoom.get(room.id)?.map((quiz) => (
                          <li
                            key={quiz.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="min-w-0 text-[11px] font-semibold text-[#134E4A]/80">
                              <span className="font-black">{quiz.title}</span>
                              {" · "}
                              {MATERI_LABELS[quiz.materi]}
                              {" · "}
                              {quiz.questions.length} soal
                            </span>
                            <StickerButton
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/member/ngaji-ceria/kelas/kuis/${quiz.id}`,
                                )
                              }
                            >
                              Kerjakan
                            </StickerButton>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </StickerCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </NgajiCeriaLayout>
  );
}
