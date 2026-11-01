import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { useAuth } from "@/contexts/AuthContext";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  joinClassroomByCode,
  leaveClassroom,
  listJoinedClassrooms,
  type ClassroomRoom,
} from "@/services/classroomService";
import { getGameById, MATERI_LABELS } from "@/data/learningCatalog";
import { listGameAssignments } from "@/services/ustadzMonitoringService";
import { listQuizzesForRooms, type Quiz } from "@/services/quizBankService";
import {
  SparklesSvg,
  ArrowRightSvg,
  AlertTriangleSvg,
  TrophySvg,
} from "@/components/ui/CustomIcons";
import { normalizeJoinCode } from "@/lib/joinCode";

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

  // State untuk Mode Gabung
  const [isJoiningMode, setIsJoiningMode] = useState(false);
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

    setIsJoiningMode(false);
    setJoinCode("");
    setPassword("");
    setNeedsPassword(false);
    await load();
  };

  const handleLeave = async (roomId: string) => {
    setLeavingId(roomId);
    await leaveClassroom(roomId, user?.id);
    setLeavingId(null);
    await load();
  };

  // JIKA BELUM PUNYA KELAS, OTOMATIS MASUK MODE JOIN
  const showJoinForm =
    isJoiningMode || (!loading && rooms.length === 0 && !loadError);

  // ==========================================
  // VIEW 1: HALAMAN INPUT GABUNG KELAS
  // ==========================================
  if (showJoinForm) {
    return (
      <NgajiCeriaLayout
        title="Gabung Kelas"
        hideBadges
        showBack
        // Jika memang belum punya kelas (terpaksa masuk form), tombol back harus ke Beranda.
        // Jika dari tombol "+ Gabung", tombol back kembali ke daftar kelas.
        onBack={() => {
          if (rooms.length === 0) navigate("/member/ngaji-ceria");
          else setIsJoiningMode(false);
        }}
      >
        <div className="mx-auto max-w-md px-4 py-8 space-y-6">
          {/* Maskot & Judul */}
          <div className="flex flex-col items-center justify-center text-center">
            <TilaMascot
              size={100}
              mood="excited"
              animation="bounce"
              direction="front"
              speech={
                rooms.length === 0
                  ? "Ayo gabung kelas pertamamu!"
                  : "Masukkan kode kelas baru!"
              }
            />
            <h1 className="mt-4 font-display text-3xl font-black text-[#134E4A]">
              {rooms.length === 0 ? "Gabung Kelas" : "Tambah Kelas"}
            </h1>
            <p className="mt-1 text-xs font-bold text-[#134E4A]/70">
              Masukkan kode 6-karakter dari Ustadz Anda.
            </p>
          </div>

          {/* Form Input */}
          <div className="rounded-3xl border-[3px] border-[#134E4A] bg-white p-6 shadow-[5px_5px_0px_#134E4A]">
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-center text-xs font-black uppercase tracking-wider text-[#134E4A]">
                  KODE KELAS (6 Karakter)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="CONTOH: 7K9X2M"
                  value={joinCode}
                  onChange={(e) =>
                    setJoinCode(normalizeJoinCode(e.target.value))
                  }
                  className="w-full rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] py-3 text-center font-display text-3xl font-black uppercase tracking-widest text-[#134E4A] shadow-[3px_3px_0px_#134E4A] focus:outline-none"
                  autoFocus
                />
              </div>

              {needsPassword && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#134E4A]">
                    Password Kelas
                  </label>
                  <input
                    type="password"
                    placeholder="Masukkan password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#134E4A] px-4 py-3 text-sm font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] focus:outline-none"
                  />
                </div>
              )}

              {joinError && (
                <div className="flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-rose-100 p-3 text-xs font-black text-rose-800 shadow-[2px_2px_0px_#134E4A]">
                  <AlertTriangleSvg size={14} className="shrink-0" />{" "}
                  {joinError}
                </div>
              )}

              <button
                type="submit"
                disabled={joining || joinCode.length !== 6}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] py-4 text-lg font-black text-white shadow-[4px_4px_0px_#134E4A] transition-all active:translate-y-[2px] active:shadow-[1px_1px_0px_#134E4A] disabled:opacity-50"
              >
                {joining ? (
                  "Memeriksa Kelas..."
                ) : (
                  <>
                    Masuk Kelas <ArrowRightSvg size={22} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </NgajiCeriaLayout>
    );
  }

  // ==========================================
  // VIEW 2: DAFTAR KELAS (Hanya muncul jika ada kelas)
  // ==========================================
  return (
    <NgajiCeriaLayout
      title="Kelas Saya"
      hideBadges
      showBack
      onBack={() => navigate("/member/ngaji-ceria")}
    >
      <div className="mx-auto w-full max-w-md px-4 py-6 space-y-6">
        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#134E4A] border-t-transparent" />
            <p className="mt-4 text-sm font-black text-[#134E4A]">
              Memuat kelas...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {loadError && (
          <div className="space-y-4 rounded-3xl border-[4px] border-[#EF4444] bg-[#FEF2F2] p-8 text-center shadow-[6px_6px_0px_#EF4444]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-[#EF4444] bg-[#FEE2E2] shadow-[3px_3px_0px_#EF4444]">
              <AlertTriangleSvg size={32} className="text-[#EF4444]" />
            </div>
            <h2 className="font-display text-2xl font-black text-[#EF4444]">
              Gagal Memuat Kelas
            </h2>
            <p className="mx-auto max-w-md text-sm font-bold text-[#7F1D1D]">
              {loadError}
            </p>
            <button
              onClick={() => load()}
              className="mt-2 rounded-2xl border-[3px] border-[#134E4A] bg-[#0D9488] px-6 py-3 text-sm font-black text-white shadow-[3px_3px_0px_#134E4A] transition-all hover:bg-[#0F766E] active:translate-y-[2px] active:shadow-[1px_1px_0px_#134E4A]"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* DAFTAR KELAS (FILLED STATE) */}
        {!loading && rooms.length > 0 && !loadError && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-black text-[#134E4A]">
                Kelas Yang Diikuti
              </h2>
              <button
                onClick={() => setIsJoiningMode(true)}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-[#FEF08A] px-4 py-2 text-xs font-black text-[#134E4A] shadow-[3px_3px_0px_#134E4A] transition-all hover:bg-[#FDE047] active:translate-y-[2px] active:shadow-none"
              >
                + Gabung Baru
              </button>
            </div>

            <div className="space-y-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="rounded-3xl border-[4px] border-[#134E4A] bg-[#FFFFFF] p-5 shadow-[6px_6px_0px_#134E4A]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-lg font-black text-[#134E4A]">
                        {room.name}
                      </h3>
                      <p className="mt-1 text-xs font-bold text-[#134E4A]/60">
                        {room.ustadzName || "Ustadz"} • Target Jilid{" "}
                        {room.targetJilid}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/member/ngaji-ceria/kelas/${room.id}`)
                      }
                      className="inline-flex shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-[#0D9488] px-4 py-2 text-xs font-black text-white shadow-[3px_3px_0px_#134E4A] transition-all hover:bg-[#0F766E] active:translate-y-[2px] active:shadow-none"
                    >
                      Buka Kelas
                    </button>
                  </div>

                  <div className="mt-4 border-t-2 border-dashed border-[#134E4A]/20 pt-4">
                    <button
                      onClick={() => handleLeave(room.id)}
                      disabled={leavingId === room.id}
                      className="inline-flex items-center justify-center rounded-xl border-2 border-[#EF4444] bg-white px-3 py-1.5 text-[10px] font-black text-[#EF4444] transition-all hover:bg-[#FEF2F2] active:translate-y-[1px] disabled:opacity-50"
                    >
                      {leavingId === room.id ? "Keluar..." : "Keluar Kelas"}
                    </button>
                  </div>

                  {(assignedByRoom.get(room.id)?.length ?? 0) > 0 && (
                    <div className="mt-4 rounded-2xl border-2 border-[#134E4A] bg-[#F0FDF4] p-3 shadow-[2px_2px_0px_#134E4A]">
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#134E4A]">
                        <TrophySvg size={14} /> Rekomendasi Ustadz
                      </p>
                      <ul className="mt-2 space-y-1.5">
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
                              className="text-xs font-bold text-[#134E4A]/80"
                            >
                              • {entry.title}{" "}
                              <span className="text-[10px] text-[#134E4A]/50">
                                (
                                {entry.materiPokok
                                  .map((m) => MATERI_LABELS[m])
                                  .join(", ")}
                                )
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {(quizzesByRoom.get(room.id)?.length ?? 0) > 0 && (
                    <div className="mt-3 rounded-2xl border-2 border-[#134E4A] bg-[#F5F3FF] p-3 shadow-[2px_2px_0px_#134E4A]">
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#134E4A]">
                        <SparklesSvg size={14} /> Kuis Ujian
                      </p>
                      <ul className="mt-2 space-y-2">
                        {quizzesByRoom.get(room.id)?.map((quiz) => (
                          <li
                            key={quiz.id}
                            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <span className="text-xs font-bold text-[#134E4A]/80">
                              {quiz.title}{" "}
                              <span className="text-[10px] text-[#134E4A]/50">
                                ({quiz.questions.length} soal)
                              </span>
                            </span>
                            <button
                              onClick={() =>
                                navigate(
                                  `/member/ngaji-ceria/kelas/kuis/${quiz.id}`,
                                )
                              }
                              className="inline-flex items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1 text-[10px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none"
                            >
                              Kerjakan
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </NgajiCeriaLayout>
  );
}
