import { lazy } from "react";

export const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
export const AdminAnalyticsPage = lazy(() =>
  import("./pages/AdminAnalyticsPage").then((m) => ({ default: m.AdminAnalyticsPage }))
);
export const AdminUsersPage = lazy(() =>
  import("./pages/AdminUsersPage").then((m) => ({ default: m.AdminUsersPage }))
);
export const AdminContentPage = lazy(() =>
  import("./pages/AdminContentPage").then((m) => ({ default: m.AdminContentPage }))
);
export const AdminQuizzesPage = lazy(() =>
  import("./pages/AdminQuizzesPage").then((m) => ({ default: m.AdminQuizzesPage }))
);
export const AdminSettingsPage = lazy(() =>
  import("./pages/AdminSettingsPage").then((m) => ({ default: m.AdminSettingsPage }))
);
export const AdminPreviewIllustrationsPage = lazy(() =>
  import("@/components/ui/PreviewIllustrations")
);

