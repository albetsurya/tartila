import { useCallback, useState, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../admin.css";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "../components/AdminHeader";
import { AdminBottomNav } from "../components/AdminBottomNav";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";

const COLLAPSE_KEY = "tartila_admin_sidebar_collapsed";

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

export function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsed);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* localStorage unavailable */
      }
      return next;
    });
  }, []);

  const isFullscreen =
    location.pathname.startsWith("/admin/timeline-local") ||
    location.pathname.startsWith("/admin/timeline-cloud");

  if (isFullscreen) {
    return (
      <AdminErrorBoundary key={location.pathname}>
        <Suspense fallback={<div className="p-4 text-center font-sans font-bold text-[#134E4A]">Memuat halaman...</div>}>
          <Outlet />
        </Suspense>
      </AdminErrorBoundary>
    );
  }

  return (
    <div className="admin-shell flex min-h-screen flex-col bg-[#F0FDF4] font-sans font-bold text-[#134E4A]">
      <AdminSidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <div className={`flex-1 flex flex-col ${collapsed ? "md:pl-[76px]" : "md:pl-64"}`}>
        <AdminHeader />
        <main className="flex-1 mx-auto w-full max-w-[1600px] p-4 pb-20 md:p-8 md:pb-10">
          <AdminErrorBoundary key={location.pathname}>
            <Suspense fallback={<div className="p-4 text-center font-sans font-bold text-[#134E4A]">Memuat halaman...</div>}>
              <Outlet />
            </Suspense>
          </AdminErrorBoundary>
        </main>
      </div>
      <AdminBottomNav />
    </div>
  );
}

export const AdminLayoutWrapper = AdminLayout;
