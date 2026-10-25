import { type ReactElement, type ReactNode } from "react";
import { Navigate, Route, type RouteObject } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminRouteGuard } from "./components/AdminRouteGuard";
import { AdminLayout } from "./layouts/AdminLayout";
import {
  AdminAnalyticsPage,
  AdminAudioCheckPage,
  AdminContentPage,
  AdminDashboardPage,
  AdminGameCatalogPage,
  AdminMenuPage,
  AdminPreviewIllustrationsPage,
  AdminQuizzesPage,
  AdminSettingsPage,
  AdminTimelineCloudPage,
  AdminTimelineLocalPage,
  AdminTimelineMenuPage,
  AdminUsersPage,
} from "./lazyPages";

import { isTartilaAdmin } from "@/lib/roles";

function SuperAdminGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!isTartilaAdmin(user?.role)) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

interface AdminPageDef {
  path?: string;
  index?: boolean;
  key: string;
  element: ReactElement;
}

const ADMIN_PAGES: AdminPageDef[] = [
  { index: true, key: "dashboard", element: <AdminDashboardPage /> },
  { path: "analytics", key: "analytics", element: <AdminAnalyticsPage /> },
  { path: "users", key: "users", element: <AdminUsersPage /> },
  { path: "books", key: "books", element: <AdminContentPage /> },
  { path: "quizzes", key: "quizzes", element: <AdminQuizzesPage /> },
  { path: "settings", key: "settings", element: <AdminSettingsPage /> },
  { path: "menu", key: "menu", element: <AdminMenuPage /> },
  {
    path: "audio-check",
    key: "audio-check",
    element: <AdminAudioCheckPage />,
  },
  {
    path: "timeline",
    key: "timeline",
    element: (
      <SuperAdminGuard>
        <AdminTimelineMenuPage />
      </SuperAdminGuard>
    ),
  },
  {
    path: "timeline-local",
    key: "timeline-local",
    element: (
      <SuperAdminGuard>
        <AdminTimelineLocalPage />
      </SuperAdminGuard>
    ),
  },
  {
    path: "timeline-cloud",
    key: "timeline-cloud",
    element: (
      <SuperAdminGuard>
        <AdminTimelineCloudPage />
      </SuperAdminGuard>
    ),
  },
  {
    path: "games",
    key: "games",
    element: (
      <SuperAdminGuard>
        <AdminGameCatalogPage />
      </SuperAdminGuard>
    ),
  },
  {
    path: "game-catalog",
    key: "game-catalog",
    element: (
      <SuperAdminGuard>
        <AdminGameCatalogPage />
      </SuperAdminGuard>
    ),
  },
  {
    path: "preview-illustrations",
    key: "preview-illustrations",
    element: (
      <SuperAdminGuard>
        <AdminPreviewIllustrationsPage />
      </SuperAdminGuard>
    ),
  },
];

export const adminRouteElements = (
  <Route path="/admin" element={<AdminRouteGuard />}>
    <Route element={<AdminLayout />}>
      {ADMIN_PAGES.map((page) => (
        <Route
          key={page.key}
          index={page.index}
          path={page.path}
          element={page.element}
        />
      ))}
    </Route>
  </Route>
);

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminRouteGuard />,
  children: [
    {
      element: <AdminLayout />,
      children: ADMIN_PAGES.map((page) => ({
        index: page.index,
        path: page.path,
        element: page.element,
      })),
    },
  ],
};
