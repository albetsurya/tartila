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
export const AdminGameCatalogPage = lazy(() =>
  import("./pages/AdminGameCatalogPage").then((m) => ({ default: m.AdminGameCatalogPage }))
);
export const AdminPreviewIllustrationsPage = lazy(() =>
  import("@/components/ui/PreviewIllustrations")
);
export const AdminAudioCheckPage = lazy(() =>
  import("./pages/AdminAudioCheckPage").then((m) => ({
    default: m.AdminAudioCheckPage,
  }))
);
export const AdminTimelineMenuPage = lazy(() =>
  import("./pages/AdminTimelineMenuPage").then((m) => ({
    default: m.AdminTimelineMenuPage,
  }))
);
export const AdminTimelineLocalPage = lazy(() =>
  import("./pages/AdminTimelineLocalPage").then((m) => ({
    default: m.AdminTimelineLocalPage,
  }))
);
export const AdminTimelineCloudPage = lazy(() =>
  import("./pages/AdminTimelineCloudPage").then((m) => ({
    default: m.AdminTimelineCloudPage,
  }))
);
export const AdminMenuPage = lazy(() =>
  import("./pages/AdminMenuPage").then((m) => ({ default: m.AdminMenuPage }))
);

