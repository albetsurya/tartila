import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Check,
  GraduationCap,
  Lock,
  LogOut,
  User as ProfileIcon,
  Users,
  Trophy,
} from "@/components/ui/CustomIcons";
import { StickerButton } from "@/components/ui/StickerButton";
import { StickerCard } from "@/components/ui/StickerCard";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { listOwnedClassrooms } from "@/services/classroomService";
import { listQuizzes } from "@/services/quizBankService";
import { normalizeRole } from "@/lib/roles";

export function UstadzProfilPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [roomCount, setRoomCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);

  useEffect(() => {
    let alive = true;
    listOwnedClassrooms(user?.id).then((result) => {
      if (!alive) return;
      if (result.ok) setRoomCount(result.data.length);
    });
    return () => {
      alive = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let alive = true;
    listQuizzes(user?.id).then((quizzes) => {
      if (alive) setQuizCount(quizzes.length);
    });
    return () => {
      alive = false;
    };
  }, []);

  const displayName = user?.name || user?.username || "Ustadz/Ustadzah";
  const periodLabel =
    normalizeRole(user?.role) === "ustadzah" ? "Ustadzah" : "Ustadz";

  const unlockedCount =
    1 + (roomCount > 0 ? 1 : 0) + (quizCount > 0 ? 1 : 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Educator Hero Card */}
      <StickerCard variant="elevated" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#134E4A] bg-[#CCFBF1] text-[#0D9488] shadow-[2px_2px_0px_#134E4A]">
              <GraduationCap size={32} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg md:text-xl font-black text-[#183B38]">
                  {displayName}
                </h1>
                <StickerBadge variant="primary" size="sm">
                  {periodLabel}
                </StickerBadge>
              </div>
              {user?.email && (
                <p className="mt-0.5 truncate text-xs text-[#64748B]">
                  {user.email}
                </p>
              )}
              <p className="mt-1 text-[11px] font-semibold text-[#0D9488]">
                Pengajar Terverifikasi Tartila
              </p>
            </div>
          </div>

          <StickerButton
            variant="outline"
            size="sm"
            onClick={() => navigate("/member/ngaji-ceria/profile")}
            className="shrink-0"
          >
            <ProfileIcon size={14} className="mr-1.5" /> Buka Profil Publik
          </StickerButton>
        </div>
      </StickerCard>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StickerCard variant="elevated" className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Kelas Dikelola
            </span>
            <p className="mt-1 text-2xl font-black text-[#0D9488]">
              {roomCount} <span className="text-xs font-normal text-[#64748B]">ruang kelas</span>
            </p>
            <p className="mt-1 text-[11px] text-[#64748B]">
              Termasuk kelas aktif & arsip
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#E0E7FF] text-[#4338CA] shadow-[2px_2px_0px_#134E4A]">
            <Users size={22} />
          </div>
        </StickerCard>

        <StickerCard variant="elevated" className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Bank Kuis Dibuat
            </span>
            <p className="mt-1 text-2xl font-black text-[#0D9488]">
              {quizCount} <span className="text-xs font-normal text-[#64748B]">kuis evaluasi</span>
            </p>
            <p className="mt-1 text-[11px] text-[#64748B]">
              Siap ditugaskan ke kelas
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-[#FEF3C7] text-[#B45309] shadow-[2px_2px_0px_#134E4A]">
            <Trophy size={22} />
          </div>
        </StickerCard>
      </div>

      {/* Lencana Dedikasi Section */}
      <StickerCard variant="elevated" className="p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#134E4A]/10">
          <div>
            <h2 className="text-sm font-black text-[#183B38]">
              Lencana Dedikasi Pendidik
            </h2>
            <p className="text-xs text-[#64748B]">
              Apresiasi perjalanan mengajar dan kontribusi dalam pembelajaran Al-Qur'an
            </p>
          </div>
          <span className="text-xs font-black text-[#0D9488]">
            {unlockedCount}/4 Terbuka
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <DedicationBadge
            label="Pendidik Baru"
            description="Masuk ke panel ustadz"
            unlocked
            bg="bg-[#CCFBF1]"
            text="text-[#0D9488]"
          />
          <BadgeRequirement
            label="Kelas Aktif"
            description="Membuka kelas digital pertama"
            unlocked={roomCount > 0}
            bg="bg-[#FEF3C7]"
            text="text-[#B45309]"
          />
          <BadgeRequirement
            label="Penyusun Kuis"
            description="Membuat kuis pertama di bank soal"
            unlocked={quizCount > 0}
            bg="bg-[#E0E7FF]"
            text="text-[#4338CA]"
          />
          <BadgeRequirement
            label="Guru Teladan"
            description="Mengelola 3 kelas aktif"
            unlocked={roomCount >= 3}
            bg="bg-[#FCE7F3]"
            text="text-[#BE185D]"
          />
        </div>
      </StickerCard>

      {/* Logout Card */}
      <StickerCard variant="elevated" className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#183B38]">
              Sesi Masuk
            </h3>
            <p className="text-xs text-[#64748B]">
              Keluar dari akun pengajar pada perangkat ini.
            </p>
          </div>
          <StickerButton
            variant="danger"
            size="sm"
            onClick={logout}
          >
            <LogOut size={14} className="mr-1.5" /> Keluar Akun
          </StickerButton>
        </div>
      </StickerCard>
    </div>
  );
}

function DedicationBadge({
  label,
  description,
  unlocked,
  bg,
  text,
}: {
  label: string;
  description: string;
  unlocked: boolean;
  bg: string;
  text: string;
}) {
  return (
    <div
      className={`rounded-2xl p-3.5 text-center transition-all ${
        unlocked
          ? "border-2 border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A]"
          : "border-2 border-[#134E4A]/30 bg-[#F8FAFC] opacity-60"
      }`}
    >
      <div
        className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#134E4A] ${
          unlocked ? `${bg} ${text}` : "bg-[#E2E8F0] text-[#94A3B8]"
        }`}
      >
        {unlocked ? <Check size={20} /> : <Lock size={18} />}
      </div>
      <p className="mt-2 text-xs font-black text-[#183B38]">{label}</p>
      <p className="mt-0.5 text-[10px] text-[#64748B] leading-tight">
        {description}
      </p>
    </div>
  );
}

const BadgeRequirement = DedicationBadge;
