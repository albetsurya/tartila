import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NgajiCeriaLayout } from "@/features/ngaji-ceria/components/NgajiCeriaLayout";
import { useAuth } from "@/contexts/AuthContext";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { useClassroomAccess } from "../hooks/useClassroomAccess";
import {
  listOwnedClassrooms,
  type ClassroomRoom,
} from "@/services/classroomService";

type RoomTab = "aktif" | "arsip";

export function UstadzRoomsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTeacher } = useClassroomAccess();

  const [rooms, setRooms] = useState<ClassroomRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<RoomTab>("aktif");

  useEffect(() => {
    let alive = true;
    listOwnedClassrooms(user?.id).then((result) => {
      if (!alive) return;
      setLoading(false);
      if (result.ok) setRooms(result.data);
      else setError(result.message);
    });
    return () => {
      alive = false;
    };
  }, [user?.id]);

  const visible = rooms.filter((room) =>
    tab === "aktif" ? !room.archived : room.archived,
  );

  return (
    <NgajiCeriaLayout title="Kelola Kelas" hideNav>
      <div className="mx-auto w-full max-w-md space-y-4 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex rounded-xl border-[3px] border-[#134E4A] bg-white p-1">
            {(["aktif", "arsip"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`rounded-lg px-4 py-1.5 text-xs font-black uppercase tracking-wide transition-colors ${
                  tab === key
                    ? "bg-[#0D9488] text-white"
                    : "text-[#134E4A] hover:bg-[#F0FDF4]"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          {isTeacher && (
            <StickerButton
              variant="primary"
              size="sm"
              onClick={() => navigate("/ustadz/kelas/baru")}
            >
              + Kelas
            </StickerButton>
          )}
        </div>

        {loading && (
          <p className="py-10 text-center text-xs font-bold text-[#134E4A]/60">
            Memuat daftar kelas…
          </p>
        )}
        {error && (
          <p className="py-10 text-center text-xs font-bold text-[#FF6B6B]">
            {error}
          </p>
        )}

        {!loading && !error && visible.length === 0 && (
          <StickerCard className="p-8 text-center">
            <p className="text-sm font-black text-[#134E4A]">
              Belum ada kelas {tab === "aktif" ? "aktif" : "di arsip"}.
            </p>
            {isTeacher && tab === "aktif" && (
              <StickerButton
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => navigate("/ustadz/kelas/baru")}
              >
                Buat Kelas Pertama
              </StickerButton>
            )}
          </StickerCard>
        )}

        <div className="space-y-3">
          {visible.map((room) => (
            <StickerCard
              key={room.id}
              asButton
              className="p-4"
              onClick={() => navigate(`/ustadz/kelas/${room.id}`)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[#134E4A]">
                    {room.name}
                  </p>
                  <p className="text-xs font-semibold text-[#134E4A]/60">
                    {room.participantCount}/{room.maxParticipants} anggota ·
                    Target Jilid {room.targetJilid}
                    {room.hasPassword ? " · Terkunci" : ""}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg border-2 border-[#134E4A] bg-[#FEF3C7] px-2 py-1 text-xs font-black text-[#7C2D12]">
                  {room.joinCode}
                </span>
              </div>
            </StickerCard>
          ))}
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
