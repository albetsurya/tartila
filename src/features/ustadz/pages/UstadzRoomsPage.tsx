import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  Users,
  Lock,
  Sparkles,
  BookOpen,
  Backpack,
  Sprout,
  Star,
  Palette,
} from "@/components/ui/CustomIcons";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerButton } from "@/components/ui/StickerButton";
import { useClassroomAccess } from "../hooks/useClassroomAccess";
import {
  listOwnedClassrooms,
  type ClassroomRoom,
} from "@/services/classroomService";

type RoomTab = "aktif" | "arsip";

const ROOM_THEMES = [
  {
    headerBg: "bg-[#BAE6FD]",
    border: "border-[#0284C7]",
    badgeBg: "bg-[#38BDF8]",
    tagText: "text-[#0369A1]",
    icon: Backpack,
  },
  {
    headerBg: "bg-[#A7F3D0]",
    border: "border-[#059669]",
    badgeBg: "bg-[#34D399]",
    tagText: "text-[#064E3B]",
    icon: Sprout,
  },
  {
    headerBg: "bg-[#FEF08A]",
    border: "border-[#CA8A04]",
    badgeBg: "bg-[#FACC15]",
    tagText: "text-[#854D0E]",
    icon: Star,
  },
  {
    headerBg: "bg-[#DDD6FE]",
    border: "border-[#7C3AED]",
    badgeBg: "bg-[#A78BFA]",
    tagText: "text-[#5B21B6]",
    icon: Sparkles,
  },
  {
    headerBg: "bg-[#FECDD3]",
    border: "border-[#E11D48]",
    badgeBg: "bg-[#FB7185]",
    tagText: "text-[#9F1239]",
    icon: Palette,
  },
];

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

  const activeRooms = rooms.filter((r) => !r.archived);
  const archivedRooms = rooms.filter((r) => r.archived);
  const visible = tab === "aktif" ? activeRooms : archivedRooms;

  return (
    <div className="space-y-6">
      {/* ── HEADER ACTION & TABS (Consistent Tactile Gen-Z Tab Bar) ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Full width segmented tab on mobile */}
        <div className="w-full sm:w-auto grid grid-cols-2 gap-2 rounded-2xl border-2 border-[#134E4A] bg-[#F0FDF4] p-1.5 shadow-[3px_3px_0px_#134E4A]">
          <button
            type="button"
            onClick={() => setTab("aktif")}
            className={`h-11 sm:h-12 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-black transition-all ${
              tab === "aktif"
                ? "border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                : "text-[#134E4A] hover:bg-white"
            }`}
          >
            <span>Kelas Aktif</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black transition-colors ${
                tab === "aktif"
                  ? "bg-[#FEF08A] text-[#134E4A]"
                  : "bg-white/80 border border-[#134E4A]/20 text-[#134E4A]"
              }`}
            >
              {activeRooms.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("arsip")}
            className={`h-11 sm:h-12 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-black transition-all ${
              tab === "arsip"
                ? "border-2 border-[#134E4A] bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]"
                : "text-[#134E4A] hover:bg-white"
            }`}
          >
            <span>Kelas Arsip</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-black transition-colors ${
                tab === "arsip"
                  ? "bg-[#FEF08A] text-[#134E4A]"
                  : "bg-white/80 border border-[#134E4A]/20 text-[#134E4A]"
              }`}
            >
              {archivedRooms.length}
            </span>
          </button>
        </div>

        {isTeacher && (
          <StickerButton
            variant="primary"
            size="md"
            icon={<Plus size={18} />}
            onClick={() => navigate("/ustadz/kelas/baru")}
            className="w-full sm:w-auto font-black shadow-[3px_3px_0px_#134E4A]"
          >
            + Buat Kelas Baru
          </StickerButton>
        )}
      </div>

      {/* ── FEEDBACK LOADING & ERROR ── */}
      {loading && (
        <div className="py-16 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-[#0D9488] border-t-transparent" />
          <p className="mt-3 text-sm font-extrabold text-[#134E4A]">
            Sedang memuat ruang kelas…
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border-2 border-[#E11D48] bg-[#FFF1F2] p-5 text-center text-sm font-black text-[#9F1239] shadow-[3px_3px_0px_#E11D48]">
          {error}
        </div>
      )}

      {/* ── PLAYFUL GEN-Z EMPTY STATE ── */}
      {!loading && !error && visible.length === 0 && (
        <div className="rounded-3xl border-3 border-[#134E4A] bg-white p-6 sm:p-10 text-center max-w-xl mx-auto shadow-[5px_5px_0px_#134E4A]">
          {/* Custom Neo-Brutalist Illustration */}
          <div className="relative mx-auto mb-4 h-36 w-56 flex items-center justify-center">
            <svg viewBox="0 0 240 160" className="w-full h-full" fill="none">
              {/* Ground shadow */}
              <ellipse cx="120" cy="148" rx="80" ry="8" fill="#134E4A" opacity="0.15" />
              {/* Blackboard / Window */}
              <rect x="35" y="25" width="170" height="90" rx="16" fill="#CCFBF1" stroke="#134E4A" strokeWidth="3.5" />
              <rect x="45" y="35" width="150" height="70" rx="10" fill="#FEF08A" stroke="#134E4A" strokeWidth="2.5" />
              <path d="M60 55h65M60 70h45" stroke="#134E4A" strokeWidth="3.5" strokeLinecap="round" />
              {/* Books stacked */}
              <rect x="130" y="70" width="55" height="16" rx="4" fill="#93C5FD" stroke="#134E4A" strokeWidth="3" />
              <rect x="125" y="86" width="65" height="18" rx="4" fill="#F472B6" stroke="#134E4A" strokeWidth="3" />
              {/* Backpack / Trophy */}
              <rect x="75" y="85" width="45" height="50" rx="12" fill="#34D399" stroke="#134E4A" strokeWidth="3.5" />
              <circle cx="97.5" cy="105" r="8" fill="#FEF08A" stroke="#134E4A" strokeWidth="2" />
              {/* Floating Sparkles & Star */}
              <path d="M25 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#FACC15" stroke="#134E4A" strokeWidth="2" />
              <path d="M210 45l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#FB7185" stroke="#134E4A" strokeWidth="2" />
              <circle cx="215" cy="115" r="7" fill="#A78BFA" stroke="#134E4A" strokeWidth="2" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-[#134E4A] bg-[#FEF08A] text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] mb-3">
            <Sparkles size={14} /> {tab === "aktif" ? "RUANG KELAS SIAP DIBUAT" : "ARSIP KOSONG"}
          </span>

          <h3 className="text-lg sm:text-xl font-black text-[#134E4A]">
            {tab === "aktif"
              ? "Belum Ada Kelas Aktif"
              : "Belum Ada Kelas di Arsip"}
          </h3>

          <p className="mt-2 text-xs sm:text-sm font-semibold text-[#183B38]/80 leading-relaxed max-w-md mx-auto">
            {tab === "aktif"
              ? "Bikin ruang kelas baru sekarang, bagikan kode join ke santri, dan pantau progres mengaji mereka secara interaktif!"
              : "Semua kelas yang telah selesai diajar atau dinonaktifkan akan tersimpan rapi di tab arsip ini."}
          </p>

          {isTeacher && tab === "aktif" && (
            <div className="mt-6 flex justify-center">
              <StickerButton
                variant="primary"
                size="md"
                icon={<Plus size={18} />}
                onClick={() => navigate("/ustadz/kelas/baru")}
                className="font-black shadow-[3px_3px_0px_#134E4A]"
              >
                Buat Kelas Pertamamu
              </StickerButton>
            </div>
          )}
        </div>
      )}

      {/* ── PLAYFUL BENTO GRID KELAS ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((room, idx) => {
          const theme = ROOM_THEMES[idx % ROOM_THEMES.length];
          return (
            <div
              key={room.id}
              onClick={() => navigate(`/ustadz/kelas/${room.id}`)}
              className="group flex flex-col justify-between rounded-2xl border-3 border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#134E4A] transition-all cursor-pointer overflow-hidden"
            >
              {/* Color Header Banner */}
              <div
                className={`flex items-center justify-between border-b-2 border-[#134E4A] px-4 py-2.5 ${theme.headerBg}`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-white text-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                    <theme.icon size={15} />
                  </span>
                  <span className="rounded-md border-2 border-[#134E4A] bg-white/90 px-2 py-0.5 text-xs font-black text-[#134E4A]">
                    Target Jilid {room.targetJilid}
                  </span>
                </div>

                {room.hasPassword && (
                  <span className="inline-flex items-center gap-1 rounded-md border-2 border-[#134E4A] bg-[#FEF08A] px-2 py-0.5 text-xs font-black text-[#713F12]">
                    <Lock size={12} /> Terkunci
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-col justify-between p-4 sm:p-5 flex-1">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#134E4A] group-hover:text-[#0D9488] transition-colors line-clamp-2 leading-snug">
                    {room.name}
                  </h3>

                  {room.description && (
                    <p className="mt-1 text-xs sm:text-sm font-medium text-[#183B38]/70 line-clamp-2">
                      {room.description}
                    </p>
                  )}
                </div>

                {/* Ticket Style Join Code */}
                <div className="mt-4 flex items-center justify-between gap-2 border-t-2 border-dashed border-[#134E4A]/20 pt-3">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#64748B] block">
                      Kode Masuk
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] text-[#134E4A] font-mono text-sm font-black shadow-[2px_2px_0px_#134E4A] -rotate-1 mt-0.5">
                      {room.joinCode}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#64748B] block">
                      Santri
                    </span>
                    <div className="inline-flex items-center gap-1 text-xs sm:text-sm font-black text-[#134E4A] mt-1">
                      <Users size={16} className="text-[#0D9488]" />
                      <span>{room.participantCount}</span>
                      <span className="text-[#64748B] font-semibold">
                        /{room.maxParticipants}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t-2 border-dashed border-[#134E4A]/20 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#64748B]">
                    Klik untuk kelola
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-xl border-2 border-[#134E4A] bg-[#CCFBF1] px-3 py-1 text-xs font-black text-[#0F766E] shadow-[2px_2px_0px_#134E4A] group-hover:bg-[#0D9488] group-hover:text-white transition-all">
                    Buka Kelas →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
