import { lazy, Suspense, type ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GameLockGuard } from "./features/ngaji-ceria/components/GameLockGuard";
import { adminRouteElements } from "./features/admin";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { SessionExpiryHandler } from "./features/auth/components/SessionExpiryHandler";
import { NgajiCeriaBottomNav } from "./features/ngaji-ceria/components/NgajiCeriaBottomNav";
import { CeriaGameLoading } from "./features/ngaji-ceria/components/CeriaGameLoading";

// Core primary tab pages imported statically for instant transitions & zero layout flashing
import NgajiCeriaHomePage from "./features/ngaji-ceria/pages/NgajiCeriaHomePage";
import NgajiCeriaMapPage from "./features/ngaji-ceria/pages/NgajiCeriaMapPage";
import NgajiCeriaGamesPage from "./features/ngaji-ceria/pages/NgajiCeriaGamesPage";
import NgajiCeriaProfilePage from "./features/ngaji-ceria/pages/NgajiCeriaProfilePage";

const NgajiCeriaRegisterPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaRegisterPage"),
);
const WarungSantriPage = lazy(
  () => import("./features/ngaji-ceria/pages/WarungSantriPage"),
);
const PremiumPage = lazy(
  () => import("./features/ngaji-ceria/pages/PremiumPage"),
);
const NgajiCeriaLibraryPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaLibraryPage"),
);
const NgajiCeriaQuizListPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaQuizListPage"),
);
const NgajiCeriaQuizPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaQuizPage"),
);
const NgajiCeriaLeaderboardPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaLeaderboardPage"),
);
const KamarTilaPage = lazy(
  () => import("./features/ngaji-ceria/pages/KamarTilaPage"),
);
const KamarBibiPage = lazy(
  () => import("./features/ngaji-ceria/pages/KamarTilaPage"),
);
const NgajiCeriaHistoryPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaHistoryPage"),
);
const CekAudioManualPage = lazy(
  () => import("./features/ngaji-ceria/pages/CekAudioManualPage"),
);
const TilawatiTimelineEditorPage = lazy(
  () => import("./features/ngaji-ceria/pages/TilawatiTimelineEditorPage"),
);
const TilawatiCloudTimelineEditorPage = lazy(
  () => import("./features/ngaji-ceria/pages/TilawatiCloudTimelineEditorPage"),
);
const TilawatiAdventurePage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/TilawatiAdventurePage"),
);
const DoaTreasurePage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/DoaTreasurePage"),
);
const DoaDetailPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/DoaDetailPage"),
);
const TajwidSecretPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/TajwidSecretPage"),
);
const TajwidDetailPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/TajwidDetailPage"),
);
const JuzAmmaStarsPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/JuzAmmaStarsPage"),
);
const JuzAmmaDetailPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/JuzAmmaDetailPage"),
);
const TahfidzPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/TahfidzPage"),
);
const JurnalIbadahPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/JurnalIbadahPage"),
);
const MagicCardsPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/MagicCardsPage"),
);
const TilawatiMapPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/TilawatiMapPage"),
);
const ArenaKartuPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/ArenaKartuPage"),
);
const FlashcardGamePage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/FlashcardGamePage"),
);
const BalonHijaiyahGamePage = lazy(
  () => import("./features/ngaji-ceria/pages/BalonHijaiyahGamePage"),
);
const PasangHurufGamePage = lazy(
  () => import("./features/ngaji-ceria/pages/PasangHurufGamePage"),
);
const SusunKataGamePage = lazy(
  () => import("./features/ngaji-ceria/pages/SusunKataGamePage"),
);
const TangkapHarakatGamePage = lazy(
  () => import("./features/ngaji-ceria/pages/TangkapHarakatGamePage"),
);
const TebakAyatGamePage = lazy(
  () => import("./features/ngaji-ceria/pages/TebakAyatGamePage"),
);
const GameModeHubPage = lazy(
  () => import("./features/ngaji-ceria/pages/games/GameModeHubPage"),
);
const HijaiyahPopPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/hijaiyah-pop/HijaiyahPopPage"),
);
const HijaiyahRushPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/hijaiyah-rush/HijaiyahRushPage"),
);
const ArabicWordlePage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/arabic-wordle/ArabicWordlePage"),
);
const Hijaiyah2048Page = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/hijaiyah-2048/Hijaiyah2048Page"),
);
const QuranQuizRoyalePage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/quran-quiz-royale/QuranQuizRoyalePage"),
);
const WudhuFlowPage = lazy(
  () => import("./features/ngaji-ceria/pages/games/wudhu-flow/WudhuFlowPage"),
);
const SantriIdlePage = lazy(
  () => import("./features/ngaji-ceria/pages/games/santri-idle/SantriIdlePage"),
);
const SholatHeroPage = lazy(
  () => import("./features/ngaji-ceria/pages/games/sholat-hero/SholatHeroPage"),
);
const AdabRPGPage = lazy(
  () => import("./features/ngaji-ceria/pages/games/adab-rpg/AdabRPGPage"),
);
const TajwidArenaPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/tajwid-arena/TajwidArenaPage"),
);
const NurBattlePage = lazy(
  () => import("./features/ngaji-ceria/pages/games/nur-battle/NurBattlePage"),
);
const MakhrajMasterPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/makhraj-master/MakhrajMasterPage"),
);
const HijaiyahBeatsPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/hijaiyah-beats/HijaiyahBeatsPage"),
);
const TajwidDefensePage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/tajwid-defense/TajwidDefensePage"),
);
const TajwidTetrisPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/tajwid-tetris/TajwidTetrisPage"),
);
const HijaiyahMatchArenaPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/hijaiyah-match-arena/HijaiyahMatchArenaPage"),
);
const JuzAmmaSpeedrunPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/juz-amma-speedrun/JuzAmmaSpeedrunPage"),
);
const HarakatRushPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/harakat-rush/HarakatRushPage"),
);
const AyatScramblePage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/ayat-scramble/AyatScramblePage"),
);
const AyatHunterPage = lazy(
  () => import("./features/ngaji-ceria/pages/games/ayat-hunter/AyatHunterPage"),
);
const DoaDungeonPage = lazy(
  () => import("./features/ngaji-ceria/pages/games/doa-dungeon/DoaDungeonPage"),
);
const NabiChroniclesPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/nabi-chronicles/NabiChroniclesPage"),
);
const MalaikatMissionPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/malaikat-mission/MalaikatMissionPage"),
);

const GAME_ROUTES: Array<{ path: string; element: React.ReactNode }> = [
  { path: "hijaiyah-pop", element: <HijaiyahPopPage /> },
  { path: "hijaiyah-burst", element: <HijaiyahPopPage /> },
  {
    path: "hijaiyah-rush",
    element: (
      <GameLockGuard gameId="hijaiyah-rush" title="Hijaiyah Rush">
        <HijaiyahRushPage />
      </GameLockGuard>
    ),
  },
  { path: "arabic-wordle", element: <ArabicWordlePage /> },
  { path: "hijaiyah-2048", element: <Hijaiyah2048Page /> },
  { path: "quran-quiz-royale", element: <QuranQuizRoyalePage /> },
  {
    path: "wudhu-flow",
    element: (
      <GameLockGuard gameId="wudhu-flow" title="Wudhu Flow">
        <WudhuFlowPage />
      </GameLockGuard>
    ),
  },
  {
    path: "santri-idle",
    element: (
      <GameLockGuard gameId="santri-idle" title="Pesantren Life">
        <SantriIdlePage />
      </GameLockGuard>
    ),
  },
  {
    path: "sholat-hero",
    element: (
      <GameLockGuard gameId="sholat-hero" title="Sholat Hero">
        <SholatHeroPage />
      </GameLockGuard>
    ),
  },
  {
    path: "adab-rpg",
    element: (
      <GameLockGuard gameId="adab-rpg" title="Jejak Santri">
        <AdabRPGPage />
      </GameLockGuard>
    ),
  },
  {
    path: "tajwid-arena",
    element: (
      <GameLockGuard gameId="tajwid-arena" title="Tajwid Arena">
        <TajwidArenaPage />
      </GameLockGuard>
    ),
  },
  { path: "nur-battle", element: <NurBattlePage /> },
  { path: "makhraj-master", element: <MakhrajMasterPage /> },
  { path: "hijaiyah-beats", element: <HijaiyahBeatsPage /> },
  {
    path: "tajwid-defense",
    element: (
      <GameLockGuard gameId="tajwid-defense" title="Tajwid Defense">
        <TajwidDefensePage />
      </GameLockGuard>
    ),
  },
  {
    path: "tajwid-tetris",
    element: (
      <GameLockGuard gameId="tajwid-tetris" title="Tajwid Tetris">
        <TajwidTetrisPage />
      </GameLockGuard>
    ),
  },
  {
    path: "hijaiyah-match-arena",
    element: (
      <GameLockGuard gameId="hijaiyah-match-arena" title="Hijaiyah Match Arena">
        <HijaiyahMatchArenaPage />
      </GameLockGuard>
    ),
  },
  {
    path: "hijaiyah-match",
    element: (
      <GameLockGuard gameId="hijaiyah-match" title="Hijaiyah Match Arena">
        <HijaiyahMatchArenaPage />
      </GameLockGuard>
    ),
  },
  { path: "juz-amma-speedrun", element: <JuzAmmaSpeedrunPage /> },
  { path: "verse-quest", element: <JuzAmmaSpeedrunPage /> },
  { path: "harakat-rush", element: <HarakatRushPage /> },
  { path: "ayat-scramble", element: <AyatScramblePage /> },
  { path: "word-builder", element: <AyatScramblePage /> },
  { path: "ayat-hunter", element: <AyatHunterPage /> },
  {
    path: "doa-dungeon",
    element: (
      <GameLockGuard gameId="doa-dungeon" title="Doa Dungeon">
        <DoaDungeonPage />
      </GameLockGuard>
    ),
  },
  {
    path: "nabi-chronicles",
    element: (
      <GameLockGuard gameId="nabi-chronicles" title="Nabi Chronicles">
        <NabiChroniclesPage />
      </GameLockGuard>
    ),
  },
  {
    path: "malaikat-mission",
    element: (
      <GameLockGuard gameId="malaikat-mission" title="Malaikat Mission">
        <MalaikatMissionPage />
      </GameLockGuard>
    ),
  },
  { path: "balon-hijaiyah", element: <BalonHijaiyahGamePage /> },
  { path: "pasang-huruf", element: <PasangHurufGamePage /> },
  { path: "susun-kata", element: <SusunKataGamePage /> },
  { path: "tangkap-harakat", element: <TangkapHarakatGamePage /> },
  { path: "tebak-ayat", element: <TebakAyatGamePage /> },
];

const HUB_ROUTES: Array<{ hub: string; title: string }> = [
  { hub: "ritme-ngaji", title: "Ritme Ngaji" },
  { hub: "quiz-ngaji", title: "Quiz Ngaji" },
  { hub: "puzzle-huruf", title: "Puzzle Huruf" },
  { hub: "tajwid-lab", title: "Tajwid Lab" },
];

function RootRouteFallback() {
  return (
    <div
      className="flex min-h-dvh items-center justify-center"
      style={{ backgroundColor: "#F0FDF4" }}
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-t-transparent"
        style={{ borderColor: "#134E4A", borderTopColor: "transparent" }}
        role="status"
        aria-label="Memuat"
      />
    </div>
  );
}

function NgajiCeriaShellFallback({ showBottomNav = false }: { showBottomNav?: boolean }) {
  return (
    <div className="min-h-screen bg-mint-cloud text-deep-teal flex flex-col justify-between selection:bg-teal-emerald/20 relative overflow-x-clip font-sans">
      <main className="flex-1 min-h-0 w-full relative max-w-md mx-auto pb-28 min-h-[50vh] flex items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-[#0D9488]/30 border-t-[#0D9488]"
          role="status"
          aria-label="Memuat"
        />
      </main>
      {showBottomNav && <NgajiCeriaBottomNav />}
    </div>
  );
}

function RouteBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();
  const MAIN_TABS = [
    "/member/ngaji-ceria",
    "/member/ngaji-ceria/map",
    "/member/ngaji-ceria/games",
    "/member/ngaji-ceria/profile",
  ];
  const isMainTab = MAIN_TABS.includes(location.pathname.replace(/\/$/, ""));
  const isNgajiCeria = location.pathname.startsWith("/member/ngaji-ceria");
  const isImmersiveGame =
    location.pathname.includes("/games/") &&
    !location.pathname.endsWith("/games");

  const fallback = isImmersiveGame ? (
    <CeriaGameLoading durationMs={1200} subtitle="Menyiapkan Arena Game…" />
  ) : isNgajiCeria ? (
    <NgajiCeriaShellFallback showBottomNav={isMainTab} />
  ) : (
    <RootRouteFallback />
  );

  return (
    <ErrorBoundary resetKeys={[location.pathname]}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  const appContent = (
    <AuthProvider>
      <BrowserRouter>
        <SessionExpiryHandler />
        <RouteBoundary>
          <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            index
            element={<Navigate to="/member/ngaji-ceria" replace />}
          />
          <Route
            path="/member/ngaji-ceria/warung-santri"
            element={<WarungSantriPage />}
          />
          <Route
            path="/member/ngaji-ceria/premium"
            element={<PremiumPage />}
          />
          <Route
            path="/register/ngaji-ceria"
            element={<NgajiCeriaRegisterPage />}
          />
          <Route path="/member/ngaji-ceria" element={<NgajiCeriaHomePage />} />
          <Route
            path="/member/ngaji-ceria/map"
            element={<NgajiCeriaMapPage />}
          />
          <Route
            path="/member/ngaji-ceria/path"
            element={<NgajiCeriaLibraryPage />}
          />
          <Route
            path="/member/ngaji-ceria/quiz"
            element={<NgajiCeriaQuizListPage />}
          />
          <Route
            path="/member/ngaji-ceria/quiz/play"
            element={<NgajiCeriaQuizPage />}
          />
          <Route
            path="/member/ngaji-ceria/games"
            element={<NgajiCeriaGamesPage />}
          />
          <Route
            path="/member/ngaji-ceria/leaderboard"
            element={<NgajiCeriaLeaderboardPage />}
          />
          <Route
            path="/member/ngaji-ceria/profile"
            element={<NgajiCeriaProfilePage />}
          />
          <Route
            path="/member/ngaji-ceria/kamar-tila"
            element={<KamarTilaPage />}
          />
          <Route
            path="/member/ngaji-ceria/kamar-tito"
            element={<KamarTilaPage />}
          />
          <Route
            path="/member/ngaji-ceria/kamar-bibi"
            element={<Navigate to="/member/ngaji-ceria/kamar-tila" replace />}
          />
          <Route
            path="/member/ngaji-ceria/profile/history"
            element={<NgajiCeriaHistoryPage />}
          />
          <Route
            path="/member/ngaji-ceria/cek-audio"
            element={<CekAudioManualPage />}
          />
          <Route
            path="/member/ngaji-ceria/cek-audio/timeline"
            element={<TilawatiTimelineEditorPage />}
          />
          <Route
            path="/member/ngaji-ceria/cek-audio/cloud-editor"
            element={<TilawatiCloudTimelineEditorPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/tilawati"
            element={<TilawatiAdventurePage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/tilawati/:jilid"
            element={<TilawatiMapPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/doa"
            element={<DoaTreasurePage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/doa/:id"
            element={<DoaDetailPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/tajwid"
            element={<TajwidSecretPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/tajwid/:id"
            element={<TajwidDetailPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/juz-amma"
            element={<JuzAmmaStarsPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/juz-amma/:surahNumber"
            element={<JuzAmmaDetailPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/tahfidz"
            element={<TahfidzPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/jurnal-ibadah"
            element={<JurnalIbadahPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/jurnal"
            element={<JurnalIbadahPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/practice"
            element={<ArenaKartuPage />}
          />
          <Route
            path="/member/ngaji-ceria/explore/practice/play/:jilid"
            element={<FlashcardGamePage />}
          />

          {GAME_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={`/member/ngaji-ceria/games/${route.path}`}
              element={route.element}
            />
          ))}

          {HUB_ROUTES.map(({ hub, title }) => (
            <Route
              key={hub}
              path={`/member/ngaji-ceria/games/${hub}`}
              element={
                <GameLockGuard gameId={hub} title={title}>
                  <GameModeHubPage hubOverride={hub} />
                </GameLockGuard>
              }
            />
          ))}

          {adminRouteElements}

          <Route
            path="*"
            element={<Navigate to="/member/ngaji-ceria" replace />}
          />
        </Routes>
        </RouteBoundary>
      </BrowserRouter>
    </AuthProvider>
  );

  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        {appContent}
      </GoogleOAuthProvider>
    );
  }

  return appContent;
}
