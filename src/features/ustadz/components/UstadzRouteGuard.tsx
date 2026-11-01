import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { classroomRoleForUser } from "@/lib/roles";
import { StickerButton } from "@/components/ui/StickerButton";
import { GraduationCap } from "@/components/ui/CustomIcons";
import "@/features/ustadz/ustadz.css";

function DeniedScreen() {
  const navigate = useNavigate();
  return (
    <div className="ustadz-shell flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <span className="ustadz-accent-soft flex h-24 w-24 items-center justify-center rounded-3xl">
        <GraduationCap size={44} />
      </span>
      <h1 className="mt-4 text-xl font-black text-[var(--ustadz-text)]">
        Akses Ustadz diperlukan
      </h1>
      <p className="mt-2 max-w-xs text-sm font-semibold text-[var(--ustadz-text-muted)]">
        Area ini hanya untuk Ustadz/Ustadzah. Santri bisa bergabung ke kelas
        lewat kode join dari pengajarnya.
      </p>
      <StickerButton variant="primary" className="mt-6" onClick={() => navigate("/member/ngaji-ceria")}>
        Kembali
      </StickerButton>
    </div>
  );
}

export function UstadzRouteGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const classroomRole = classroomRoleForUser(user);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f4f1ea]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-[3px] border-t-transparent"
          style={{ borderColor: "#134E4A", borderTopColor: "transparent" }}
          role="status"
          aria-label="Memuat"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (classroomRole !== "ustadz" && classroomRole !== "monitor") {
    return <DeniedScreen />;
  }

  return <Outlet />;
}
