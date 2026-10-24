import { useCallback, useState } from "react";
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

  return (
    <div className="admin-shell min-h-dvh">
      <AdminSidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <div className={collapsed ? "md:pl-[76px]" : "md:pl-64"}>
        <AdminHeader />
        <main className="mx-auto max-w-[1600px] p-4 pb-24 md:p-8 md:pb-10">
          <AdminErrorBoundary key={location.pathname}>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </div>
      <AdminBottomNav />
    </div>
  );
}
