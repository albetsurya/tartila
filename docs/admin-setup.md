# Admin Panel — Setup

Admin area for Tartila lives in an isolated feature module: `src/features/admin/`.
It renders at `/admin` and is **desktop-first** (mobile-tolerant) with a
clean, neutral look that is distinct from the playful student UI.

## Access control

The admin area is protected by `AdminRouteGuard`
(`src/features/admin/components/AdminRouteGuard.tsx`):

1. While auth is resolving (`useAuth().loading`) → centered spinner.
2. Not logged in → `Navigate` to `/login` (with `state.from`).
3. Logged in but `user.role` is not `"admin"` / `"superadmin"` → `Navigate` to `/`.

There is **no signup path for admin** and no hardcoded accounts. Roles are
assigned manually.

### How to assign an admin role

Roles come from the backend `User` object (`role?: string`, see
`src/services/authApi.ts`). The login response must include a `role` field
whose value is `"admin"` or `"superadmin"`.

1. In the database, set the user's role column to `admin` (or `superadmin`).
   Example (PostgreSQL):

   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'someone@example.com';
   ```

2. Ensure the auth API returns `role` in the user payload (login + refresh).
   The client reads `useAuth().user.role` verbatim.
3. Have the user log out and back in (or refresh the session) so `AuthContext`
   re-fetches the user with the new role.

To revoke access, set the role back to a non-admin value (e.g. `"student"`)
or `NULL`.

## Routes

| Path                 | Page                 | Notes                    |
| -------------------- | -------------------- | ------------------------ |
| `/admin`             | `AdminDashboardPage` | Overview + stat cards    |
| `/admin/analytics`   | `AdminAnalyticsPage` | Placeholder              |
| `/admin/users`       | `AdminUsersPage`     | Placeholder              |
| `/admin/books`       | `AdminContentPage`   | Placeholder              |
| `/admin/quizzes`     | `AdminQuizzesPage`   | Placeholder              |
| `/admin/settings`    | `AdminSettingsPage`  | Placeholder              |

Route definitions are derived from a single `ADMIN_PAGES` array in
`src/features/admin/routes.tsx`, which exports both:

- `adminRouteElements` — JSX `<Route>` tree, spread into `App`'s `<Routes>`.
- `adminRoutes` — equivalent `RouteObject`, for a future data router.

Each page is loaded with `React.lazy` (`src/features/admin/lazyPages.ts`) and
emits its own build chunk, so the admin code does not bloat the main bundle.

## Layout

- `AdminLayout` — sidebar + sticky header + main content, wrapped in
  `AdminErrorBoundary`; sets the `.admin-shell` scope.
- `AdminSidebar` — nav sections (Overview / Konten / Sistem), collapse toggle
  (persisted in `localStorage["tartila_admin_sidebar_collapsed"]`), logout,
  mobile drawer.
- `AdminHeader` + `AdminBreadcrumb` — sticky blurred header (h-16).
- `StatCard` — reusable compact metric tile.

## Design notes

Admin intentionally avoids the claymorphism/3D/playful styling of the student
UI:

- Neutral surfaces: `#fafafa` / `#ffffff` (light), `#09090b` / `#18181b` (dark).
- Emerald **accent only**, never large fills: `#059669` (light) / `#10b981` (dark).
- Corners: `rounded-lg` (8px). No large radii or pills.
- Minimal shadows; `transition-all duration-150` at most.
- Compact system font stack.

### Theming / dark mode

Colors are CSS variables scoped to `.admin-shell` in
`src/features/admin/admin.css`, overridden by `.dark .admin-shell`. Dark mode
follows the app-wide `.dark` class on `<html>`.

The app root is now wrapped in `ThemeProvider`
(`src/contexts/ThemeContext.tsx`, mounted in `src/main.tsx`), which:

- applies/removes `.dark` on `<html>` (and sets `color-scheme`),
- reads the saved choice from `localStorage["tartila-theme"]`,
- falls back to the OS `prefers-color-scheme` and follows it until the user
  chooses explicitly.

A no-flash inline script in `index.html` sets the class before first paint.
The `AdminHeader` has a Sun/Moon toggle that calls `useTheme().toggleTheme()`.

## Related

- **Mascot (2.5D):** `src/components/ui/BibiMascot2D.tsx` exposes
  `BibiMascot2D` / `BibiWave` with a `variant` of `"animated"` (Framer Motion)
  or `"static"` (SVG only), plus reduced-motion awareness. `BibiCompanion`
  accepts the same `variant` prop. `BibiMascot.tsx` itself is never modified.
- **Login:** `src/features/auth/pages/LoginPage.tsx` (routed at `/login`).
  Split-screen on `lg:`, stacked on mobile. A Bibi welcome overlay fades in on
  the first visit of a browser session and auto-dismisses after 2.5s
  (gated by `sessionStorage["tartila_welcomed_v1"]`).

## Out of scope / deferred

- `src/features/ngaji-ceria/pages/NgajiCeriaLoginPage.tsx` is superseded by the
  new `LoginPage` and is no longer routed (kept for reference).
