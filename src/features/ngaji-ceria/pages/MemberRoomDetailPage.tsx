import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NgajiCeriaLayout } from "../components/NgajiCeriaLayout";
import { StickerCard, StickerButton, SectionHeader } from "@/components/ui";
import { Swords, Users } from "@/components/ui/CustomIcons";
import { getClassroomDetail, type ClassroomRoom } from "@/services/classroomService";
import { duelService, type Classmate } from "@/services/duelService";

export function MemberRoomDetailPage() {
  const { roomId = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState<ClassroomRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "teman">("info");
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [duelEnabled, setDuelEnabled] = useState(true);

  const loadRoom = useCallback(async () => {
    setLoading(true);
    const result = await getClassroomDetail(roomId);
    if (!result.ok) {
      setError(result.message);
      setLoading(false);
      return;
    }
    setRoom(result.data.room);
    setDuelEnabled(result.data.room.duelEnabled ?? true);
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    void loadRoom();
  }, [loadRoom]);

  useEffect(() => {
    if (roomId && user?.id) {
      duelService
        .listClassmates(roomId)
        .then(setClassmates)
        .catch(() => setClassmates([]));
    }
  }, [roomId, user?.id]);

  useEffect(() => {
    if (roomId) {
      duelService.getDuelSetting(roomId).then((res) => {
        setDuelEnabled(res.enabled);
      });
    }
  }, [roomId]);

  const handleDuel = (opponent: Classmate) => {
    duelService
      .createChallenge(roomId, opponent.userId, "kuis")
      .then(() => {
        /* sukses - notifikasi akan muncul untuk lawan */
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <NgajiCeriaLayout title="Detail Kelas" hideNav showBack>
        <p className="text-center py-10 text-xs font-bold text-[#134E4A]/60">
          Memuat…
        </p>
      </NgajiCeriaLayout>
    );
  }

  if (error) {
    return (
      <NgajiCeriaLayout title="Detail Kelas" hideNav showBack>
        <StickerCard className="p-6 text-center">
          <p className="text-sm font-black text-[#FF6B6B]">{error}</p>
        </StickerCard>
      </NgajiCeriaLayout>
    );
  }

  if (!room) {
    return (
      <NgajiCeriaLayout title="Detail Kelas" hideNav showBack>
        <StickerCard className="p-6 text-center">
          <p className="text-sm font-black text-[#134E4A]">
            Kelas tidak ditemukan
          </p>
        </StickerCard>
      </NgajiCeriaLayout>
    );
  }

  return (
    <NgajiCeriaLayout title="Detail Kelas" hideNav showBack>
      <div className="px-4 py-4 space-y-4">
        {/* Header kelas */}
        <StickerCard className="p-4">
          <p className="text-base font-black text-[#134E4A]">{room.name}</p>
          {room.description && (
            <p className="mt-1 text-xs font-semibold text-[#134E4A]/70">
              {room.description}
            </p>
          )}
          <p className="mt-2 text-[11px] font-bold text-[#134E4A]/60">
            {room.participantCount}/{room.maxParticipants} anggota · Jilid{" "}
            {room.targetJilid}
          </p>
          <p className="mt-2 text-xs font-bold text-[#134E4A]/70">
            Kode Join: <span className="font-mono tracking-wider">{room.joinCode}</span>
          </p>
        </StickerCard>

        {/* Tab navigasi */}
        <div className="flex items-center gap-1 rounded-xl border-[3px] border-[#134E4A] bg-white p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex-1 rounded-lg px-3 py-1 text-xs font-black transition-all ${
              activeTab === "info"
                ? "bg-[#0D9488] text-white"
                : "text-[#134E4A] hover:bg-[#F4F1EA]"
            }`}
          >
            Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("teman")}
            className={`flex-1 rounded-lg px-3 py-1 text-xs font-black transition-all ${
              activeTab === "teman"
                ? "bg-[#0D9488] text-white"
                : "text-[#134E4A] hover:bg-[#F4F1EA]"
            }`}
          >
            Teman Kelas ({classmates.length})
          </button>
        </div>

        {/* Tab: Info kelas */}
        {activeTab === "info" && (
          <StickerCard className="p-4">
            <p className="text-sm font-black text-[#134E4A]">Target Jilid</p>
            <p className="mt-1 text-xs font-bold text-[#134E4A]/70">
              Jilid {room.targetJilid}
            </p>
            <p className="mt-3 text-sm font-black text-[#134E4A]">
              Mode Tantangan Duel
            </p>
            <p className="mt-1 text-xs font-bold text-[#134E4A]/70">
              {duelEnabled ? "Aktif" : "Dinonaktifkan"}
            </p>
          </StickerCard>
        )}

        {/* Tab: Teman Kelas */}
        {activeTab === "teman" && (
          <div>
            <SectionHeader
              title="Teman Kelas"
              icon={<Users size={16} />}
              accent="teal"
            />
            <p className="mt-1 text-[11px] font-bold text-[#134E4A]/60 mb-2">
              Kalian hanya bisa tantang satu sama lain di kelas yang sama.
            </p>

            {classmates.length === 0 ? (
              <StickerCard className="p-6 text-center">
                <p className="text-xs font-bold text-[#134E4A]/60">
                  Belum ada teman sekelas yang dapat ditantang.
                </p>
              </StickerCard>
            ) : (
              <div className="space-y-3">
                {classmates.map((member) => (
                  <StickerCard key={member.userId} className="flex items-center gap-3 p-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-[#FEF3C7] text-xs font-black text-[#7C2D12]"
                      title={member.name}
                    >
                      {member.name?.charAt(0) ?? member.username?.charAt(0) ?? "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-[#134E4A]">
                        {member.name || member.username}
                      </p>
                      <p className="text-[11px] font-semibold text-[#134E4A]/60">
                        Level {member.level}
                      </p>
                    </div>

                    {duelEnabled && (
                      <StickerButton
                        variant="primary"
                        size="sm"
                        className="shrink-0"
                        onClick={() => handleDuel(member)}
                      >
                        <Swords size={14} /> Tantang
                      </StickerButton>
                    )}
                  </StickerCard>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </NgajiCeriaLayout>
  );
}