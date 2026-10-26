import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isTartilaAdmin } from "@/lib/roles";

export function AdminRouteGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-shell flex min-h-dvh items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ color: "var(--admin-accent)" }}
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
