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
} from "@/components/ui/CustomIcons";
import { StickerButton } from "@/components/ui/StickerButton";
import { StickerCard } from "@/components/ui/StickerCard";
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
    normalizeRole(user?.role) === "ustadzah" ? "Ustadzah" : "Ustadz/Ustadzah";

  const unlockedCount =
    1 + (roomCount > 0 ? 1 : 0) + (quizCount > 0 ? 1 : 0);

  return (
    <div className="w-full max-w-3xl space-y-4">
      <StickerCard className="flex items-center gap-4 p-5">
        <span className="ustadz-accent-soft flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
          <GraduationCap size={30} />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-black">{displayName}</h2>
          <p className="text-xs font-bold ustadz-muted">{periodLabel}</p>
          {user?.email ? (
            <p className="mt-1 truncate text-xs ustadz-muted">{user.email}</p>
          ) : null}
        </div>
      </StickerCard>

      <StickerCard className="p-5">
        <p className="text-sm font-black">Laporan Santri</p>
        <p className="mt-1 text-xs font-semibold ustadz-muted">
          Lihat siapa yang rajin, yang hanya mengerjakan kuis, dan yang butuh
          perhatian.
        </p>
        <StickerButton
          variant="primary"
          className="mt-3 w-full"
          onClick={() => navigate("/ustadz/laporan")}
        >
          Buka Laporan
        </StickerButton>
      </StickerCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <StickerCard className="p-5">
          <div className="flex items-center gap-3">
            <Users size={18} />
            <p className="text-sm font-black">Kelas Dimiliki</p>
          </div>
          <p className="mt-2 text-2xl font-black text-[var(--ustadz-accent)]">
            {roomCount}
          </p>
          <p className="mt-1 text-[10px] font-bold ustadz-muted">
            Termasuk kelas aktif dan arsip.
          </p>
        </StickerCard>

        <StickerCard className="p-5">
          <div className="flex items-center gap-3">
            <ProfileIcon size={18} />
            <p className="text-sm font-black">Akun Santri</p>
          </div>
          <p className="mt-2 text-xs font-semibold ustadz-muted">
            Data profil publik dan riwayat belajar dikelola di area santri.
          </p>
          <StickerButton
            variant="primary"
            className="mt-3 w-full"
            onClick={() => navigate("/member/ngaji-ceria/profile")}
          >
            Buka Profil Santri
          </StickerButton>
        </StickerCard>
      </div>

      <StickerCard className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black">Lencana Dedikasi</p>
          <span className="text-xs font-black text-[#0D9488]">
            {unlockedCount}/4 terbuka
          </span>
        </div>
        <div className="mt-1 text-xs font-semibold ustadz-muted">
          Lencana penghargaan untuk perjalanan mengajarmu: tanpa poin, murni
          apresiasi.
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Badge
            label="Pendidik Baru"
            description="Masuk panel ustadz"
            unlocked
            iconBg="bg-[#BBF7D0]"
          />
          <Badge
            label="Kelas Aktif"
            description="Punya kelas digital"
            unlocked={roomCount > 0}
            iconBg="bg-[#FEF08A]"
          />
          <Badge
            label="Ahli Kuis"
            description="Buat kuis pertama"
            unlocked={quizCount > 0}
            iconBg="bg-[#BFDBFE]"
          />
          <Badge
            label="Guru Terpercaya"
            description="Kelola minimal 3 kelas"
            unlocked={roomCount >= 3}
            iconBg="bg-[#E9D5FF]"
          />
        </div>
      </StickerCard>

      <StickerCard className="p-5">
        <p className="text-sm font-black">Keluar Akun</p>
        <p className="mt-1 text-xs font-semibold ustadz-muted">
          Akhiri sesi dari perangkat ini.
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border-[3px] border-[var(--ustadz-border)] bg-[var(--ustadz-danger-soft)] px-4 py-2 text-sm font-black text-[var(--ustadz-danger)] shadow-[3px_3px_0_var(--ustadz-border)] transition-transform hover:-translate-y-0.5"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </StickerCard>
    </div>
  );
}

function Badge({
  label,
  description,
  unlocked,
  iconBg,
}: {
  label: string;
  description: string;
  unlocked: boolean;
  iconBg: string;
}) {
  return (
    <div
      className={`rounded-2xl border-[3px] border-[#0A2540] p-3 text-center shadow-[3px_3px_0_#0A2540] ${
        unlocked ? "bg-white" : "bg-[#F4F1EA]"
      }`}
    >
      <span
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl border-[2.5px] border-[#0A2540] ${
          unlocked ? `${iconBg} text-[#0A2540] shadow-[2px_2px_0_#0A2540]` : "bg-[#E3E0D8] text-[#9AA2AB] shadow-none"
        }`}
        title={unlocked ? "Lencana terbuka" : "Lencana terkunci"}
      >
        {unlocked ? <Check size={18} /> : <Lock size={18} />}
      </span>
      <p
        className={`mt-2 text-[11px] font-black ${
          unlocked ? "text-[#134E4A]" : "text-[#9AA2AB]"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-[10px] font-semibold ${
          unlocked ? "ustadz-muted" : "text-[#9AA2AB]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
