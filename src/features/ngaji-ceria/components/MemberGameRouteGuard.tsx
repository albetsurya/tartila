import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isUstadzUser } from "@/lib/roles";
import { StickerButton } from "@/components/ui/StickerButton";
import { TilaMascot } from "@/components/ui/TilaMascot";

function DeniedScreen() {
  return (
    <div className="min-h-[100dvh] bg-[#F0FDF4] flex flex-col items-center justify-center px-6 text-center">
      <TilaMascot size={120} mood="sad" animation="float" direction="front" />
      <h1 className="mt-4 text-xl font-black text-[#134E4A]">
        Akses Ditolak
      </h1>
      <p className="mt-2 max-w-xs text-sm font-semibold text-[#134E4A]/80">
        Area ini hanya dapat diakses oleh Member/Santri. Ustadz tidak dapat
        bermain game.
      </p>
      <StickerButton variant="primary" className="mt-6" onClick={() => window.history.back()}>
        Kembali
      </StickerButton>
    </div>
  );
}

interface Props {
  children?: React.ReactNode;
}

export function MemberGameRouteGuard({ children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F0FDF4]">
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

  if (isUstadzUser(user)) {
    return <DeniedScreen />;
  }

  if (children) return <>{children}</>;

  return <Outlet />;
}