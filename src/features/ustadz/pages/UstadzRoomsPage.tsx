import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <>
      <div className="w-full max-w-5xl space-y-4">
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
            {/* Ilustrasi kelas kosong bergaya Neo-Brutalism */}
            <svg
              viewBox="0 0 200 140"
              className="mx-auto h-32 w-52"
              role="img"
              aria-label="Ilustrasi kelas kosong"
            >
              <rect
                x="20"
                y="30"
                width="140"
                height="90"
                rx="14"
                fill="#FEF08A"
                stroke="#0A2540"
                strokeWidth="5"
              />
              <rect
                x="52"
                y="52"
                width="76"
                height="46"
                rx="8"
                fill="#FFFFFF"
                stroke="#0A2540"
                strokeWidth="5"
              />
              <path
                d="M52 52 L90 26 L128 52"
                fill="#BBF7D0"
                stroke="#0A2540"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <rect
                x="66"
                y="72"
                width="48"
                height="6"
                rx="3"
                fill="#0A2540"
                opacity="0.35"
              />
              <rect
                x="66"
                y="84"
                width="28"
                height="6"
                rx="3"
                fill="#0A2540"
                opacity="0.2"
              />
              <circle cx="172" cy="34" r="9" fill="#FF6B6B" stroke="#0A2540" strokeWidth="4" />
              <path
                d="M172 43 L172 62"
                stroke="#0A2540"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M168 40 L150 52 M176 40 L194 52"
                stroke="#0A2540"
                strokeWidth="4"
                strokeLinecap="round"
                transform="rotate(90 172 34)"
              />
            </svg>
            <p className="mt-3 text-sm font-black text-[#134E4A]">
              {tab === "aktif"
                ? "Wah, kelasmu masih kosong. Yuk buat kelas pertamamu dan kumpulkan santri!"
                : "Belum ada kelas di arsip. Kelas yang diarsipkan akan tampil di sini."}
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
    </>
  );
}
