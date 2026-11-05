import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isTartilaAdmin } from "@/lib/roles";

export function AdminRouteGuard() {
  const { user, loading, isRoleVerified } = useAuth();
  const location = useLocation();

  if (loading || !isRoleVerified) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#FFF4DC]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#1A1A1A] border-t-transparent"
          role="status"
          aria-label="Memuat"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // HANYA tartila_admin dan superadmin yang boleh masuk ke /admin Tartila.
  // Admin Sambung Ngaji (role 'admin') ditendang ke '/' (Unauthorized).
  if (!isTartilaAdmin(user.role)) {
    console.warn(
      "Akses ditolak: Role",
      user.role,
      "bukan Tartila Admin. Mengalihkan ke /",
    );
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
