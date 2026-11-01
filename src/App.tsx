import { lazy, Suspense, useEffect, type ReactNode } from "react";
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
import { MemberGameRouteGuard } from "./features/ngaji-ceria/components/MemberGameRouteGuard";
import { adminRouteElements } from "./features/admin";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { SessionExpiryHandler } from "./features/auth/components/SessionExpiryHandler";
import { NgajiCeriaBottomNav } from "./features/ngaji-ceria/components/NgajiCeriaBottomNav";
import { CeriaGameLoading } from "./features/ngaji-ceria/components/CeriaGameLoading";
import ScrollToTop from "./components/ScrollToTop";
import { useEconomyStore } from "./features/ngaji-ceria/hooks/useEconomyStore";
import { PwaUpdateToast } from "./components/ui/PwaUpdateToast";
import { PwaInstallBanner } from "./components/ui/PwaInstallBanner";
import { TilaCompanion } from "./components/ui/TilaCompanion";
import { RoleTransitionManager } from "./components/ui/RoleTransitionScreen";
import { usePWAUpdate } from "./hooks/usePWAUpdate";
import { UstadzLayout } from "./features/ustadz/layouts/UstadzLayout";
import { UstadzRouteGuard } from "./features/ustadz/components/UstadzRouteGuard";

// Core primary tab pages are lazy-loaded so the initial bundle stays minimal;
// <RouteBoundary> supplies the typed Suspense fallback for each route group.
const NgajiCeriaHomePage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaHomePage"),
);
const NgajiCeriaMapPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaMapPage"),
);
const NgajiCeriaGamesPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaGamesPage"),
);
const NgajiCeriaProfilePage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaProfilePage"),
);

const NgajiCeriaRegisterPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaRegisterPage"),
);
const MemberClassroomsPage = lazy(() =>
  import("./features/ngaji-ceria/pages/MemberClassroomsPage").then((m) => ({
    default: m.MemberClassroomsPage,
  })),
);
const MemberRoomDetailPage = lazy(() =>
  import("./features/ngaji-ceria/pages/MemberRoomDetailPage").then((m) => ({
    default: m.MemberRoomDetailPage,
  })),
);
const MemberQuizPlayPage = lazy(() =>
  import("./features/ngaji-ceria/pages/MemberQuizPlayPage").then((m) => ({
    default: m.MemberQuizPlayPage,
  })),
);
const UstadzDashboardPage = lazy(() =>
  import("./features/ustadz/pages/UstadzDashboardPage").then((m) => ({
    default: m.UstadzDashboardPage,
  })),
);
const UstadzRoomsPage = lazy(() =>
  import("./features/ustadz/pages/UstadzRoomsPage").then((m) => ({
    default: m.UstadzRoomsPage,
  })),
);
const UstadzCreateRoomPage = lazy(() =>
  import("./features/ustadz/pages/UstadzCreateRoomPage").then((m) => ({
    default: m.UstadzCreateRoomPage,
  })),
);
const UstadzRoomDetailPage = lazy(() =>
  import("./features/ustadz/pages/UstadzRoomDetailPage").then((m) => ({
    default: m.UstadzRoomDetailPage,
  })),
);
const UstadzLearningPage = lazy(() =>
  import("./features/ustadz/pages/UstadzLearningPage").then((m) => ({
    default: m.UstadzLearningPage,
  })),
);
const UstadzKurikulumPage = lazy(() =>
  import("./features/ustadz/pages/UstadzKurikulumPage").then((m) => ({
    default: m.UstadzKurikulumPage,
  })),
);
const UstadzMaterialPreviewPage = lazy(() =>
  import("./features/ustadz/pages/UstadzMaterialPreviewPage").then((m) => ({
    default: m.UstadzMaterialPreviewPage,
  })),
);
const UstadzQuizListPage = lazy(() =>
  import("./features/ustadz/pages/UstadzQuizListPage").then((m) => ({
    default: m.UstadzQuizListPage,
  })),
);
const UstadzQuizCreatePage = lazy(() =>
  import("./features/ustadz/pages/UstadzQuizCreatePage").then((m) => ({
    default: m.UstadzQuizCreatePage,
  })),
);
const UstadzStudentReportPage = lazy(() =>
  import("./features/ustadz/pages/UstadzStudentReportPage").then((m) => ({
    default: m.UstadzStudentReportPage,
  })),
);
const UstadzProfilPage = lazy(() =>
  import("./features/ustadz/pages/UstadzProfilPage").then((m) => ({
    default: m.UstadzProfilPage,
  })),
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
const NgajiCeriaQuizPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaQuizPage"),
);
const QuizHubPage = lazy(
  () => import("./features/ngaji-ceria/pages/QuizHubPage"),
);
const QuizHubPlayPage = lazy(
  () => import("./features/ngaji-ceria/pages/QuizHubPlayPage"),
);
const DuelLobbyPage = lazy(
  () => import("./features/ngaji-ceria/pages/quiz/DuelLobbyPage"),
);
const DuelPlayPage = lazy(
  () => import("./features/ngaji-ceria/pages/quiz/DuelPlayPage"),
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
const LabIramaPage = lazy(
  () => import("./features/ngaji-ceria/pages/LabIramaPage"),
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
const TahfidzDetailPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/TahfidzDetailPage"),
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
const ArenaKartuSelectPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/ArenaKartuSelectPage"),
);
const ArenaKartuPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/ArenaKartuPage"),
);
const KartuPracticePage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/KartuPracticePage"),
);
const TilawatiTrainingPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/TilawatiTrainingPage"),
);
const RhythmMemorySelectPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/RhythmMemorySelectPage"),
);
const RhythmMemoryPage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/RhythmMemoryPage"),
);
const FlashcardGamePage = lazy(
  () => import("./features/ngaji-ceria/pages/explore/FlashcardGamePage"),
);
// Disabled: inactive game (BalonHijaiyah, PasangHuruf, SusunKata, TangkapHarakat, TebakAyat)
/*
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
*/
const GameModeHubPage = lazy(
  () => import("./features/ngaji-ceria/pages/games/GameModeHubPage"),
);
const HijaiyahHarvestPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/hijaiyah-pop/HijaiyahHarvestPage"),
);
// Disabled: inactive game (HijaiyahRush, ArabicWordle)
/*
const HijaiyahRushPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/hijaiyah-rush/HijaiyahRushPage"),
);
const ArabicWordlePage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/arabic-wordle/ArabicWordlePage"),
);
*/
const Hijaiyah2048Page = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/hijaiyah-2048/Hijaiyah2048Page"),
);
// Disabled: inactive game (QuranQuizRoyale … JuzAmmaSpeedrun)
/*
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
*/
const HarakatSlasherPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/harakat-rush/HarakatSlasherPage"),
);
const AyatScramblePage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/ayat-scramble/AyatScramblePage"),
);
// Disabled: inactive game (AyatHunter, DoaDungeon, NabiChronicles, MalaikatMission)
/*
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
*/
const TilawatiMemorySelectPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/tilawati-memory/TilawatiMemorySelectPage"),
);
const TilawatiMemoryPage = lazy(
  () =>
    import("./features/ngaji-ceria/pages/games/tilawati-memory/TilawatiMemoryPage"),
);
const NotificationPage = lazy(
  () => import("./features/ngaji-ceria/pages/NotificationPage"),
);
const ArenaJoinRoomPage = lazy(
  () => import("./features/ngaji-ceria/pages/arena/JoinRoomPage"),
);
const ArenaCreateRoomPage = lazy(
  () => import("./features/ngaji-ceria/pages/arena/CreateRoomPage"),
);
const ArenaHostLobbyPage = lazy(
  () => import("./features/ngaji-ceria/pages/arena/HostLobbyPage"),
);
const ArenaHostGamePage = lazy(
  () => import("./features/ngaji-ceria/pages/arena/HostGamePage"),
);
const ArenaPlayerGamePage = lazy(
  () => import("./features/ngaji-ceria/pages/arena/PlayerGamePage"),
);
const ArenaPodiumPage = lazy(
  () => import("./features/ngaji-ceria/pages/arena/ArenaPodiumPage"),
);
const ArenaExamReportPage = lazy(
  () => import("./features/ngaji-ceria/pages/arena/ExamReportPage"),
);
const ArenaGlobalLeaderboardPage = lazy(
  () => import("./features/ngaji-ceria/pages/arena/GlobalLeaderboardPage"),
);

const GAME_ROUTES: Array<{ path: string; element: React.ReactNode }> = [
  { path: "hijaiyah-pop", element: <HijaiyahHarvestPage /> },
  { path: "hijaiyah-burst", element: <HijaiyahHarvestPage /> },
  // Disabled: inactive game (hijaiyah-rush, arabic-wordle)
  /*
  {
    path: "hijaiyah-rush",
    element: (
      <GameLockGuard gameId="hijaiyah-rush" title="Hijaiyah Rush">
        <HijaiyahRushPage />
      </GameLockGuard>
    ),
  },
  { path: "arabic-wordle", element: <ArabicWordlePage /> },
  */
  { path: "hijaiyah-2048", element: <Hijaiyah2048Page /> },
  // Disabled: inactive game (quran-quiz-royale … verse-quest)
  /*
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
  */
  { path: "harakat-rush", element: <HarakatSlasherPage /> },
  { path: "ayat-scramble", element: <AyatScramblePage /> },
  { path: "word-builder", element: <AyatScramblePage /> },
  // Disabled: inactive game (ayat-hunter … tebak-ayat)
  /*
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
  */
];

const HUB_ROUTES: Array<{ hub: string; title: string }> = [
  // Disabled: inactive game (ritme-ngaji, quiz-ngaji, puzzle-huruf, tajwid-lab,
  // petualangan-santri — quiz-hub aktif lewat rute /quiz-hub terpisah)
  /*
  { hub: "ritme-ngaji", title: "Ritme Ngaji" },
  { hub: "quiz-ngaji", title: "Quiz Ngaji" },
  { hub: "puzzle-huruf", title: "Puzzle Huruf" },
  { hub: "tajwid-lab", title: "Tajwid Lab" },
  { hub: "petualangan-santri", title: "Petualangan Santri" },
  */
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

function NgajiCeriaShellFallback({
  showBottomNav = false,
}: {
  showBottomNav?: boolean;
}) {
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

function AppThemeSync() {
  const equippedAppTheme =
    useEconomyStore((s) => s.equippedAppTheme) || "default";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-app-theme", equippedAppTheme);
      document.body.setAttribute("data-app-theme", equippedAppTheme);
      if (equippedAppTheme === "night" || equippedAppTheme === "neon") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [equippedAppTheme]);

  return null;
}

const TILA_MAIN_ROUTES = new Set([
  "/member/ngaji-ceria",
  "/member/ngaji-ceria/map",
  "/member/ngaji-ceria/games",
  "/member/ngaji-ceria/profile",
]);

function GlobalTilaCompanion() {
  const location = useLocation();
  const cleanPath = location.pathname.replace(/\/$/, "") || "/";

  // Render HANYA JIKA berada di rute utama
  if (!TILA_MAIN_ROUTES.has(cleanPath)) {
    return null;
  }

  // Jangan tampilkan di halaman immersive seperti game atau kuis
  if (cleanPath.includes("/games/") || cleanPath.includes("/quiz/")) {
    return null;
  }

  return (
    <div data-tila-companion>
      <TilaCompanion size={110} autoRoam reactiveSpeech />
    </div>
  );
}

function AppRoutesContent() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/login" element={<LoginPage />} />
      <Route index element={<Navigate to="/member/ngaji-ceria" replace />} />
      <Route
        path="/member/ngaji-ceria/warung-santri"
        element={<WarungSantriPage />}
      />
      <Route path="/member/ngaji-ceria/premium" element={<PremiumPage />} />
      <Route
        path="/register/ngaji-ceria"
        element={<NgajiCeriaRegisterPage />}
      />
      <Route path="/member/ngaji-ceria" element={<NgajiCeriaHomePage />} />
      <Route path="/member/ngaji-ceria/map" element={<NgajiCeriaMapPage />} />
      <Route
        path="/member/ngaji-ceria/path"
        element={<NgajiCeriaLibraryPage />}
      />
      <Route
        path="/member/ngaji-ceria/quiz/play"
        element={<NgajiCeriaQuizPage />}
      />
      <Route path="/quiz-hub" element={<QuizHubPage />} />
      <Route path="/quiz-hub/play" element={<QuizHubPlayPage />} />
      <Route path="/quiz-hub/versus" element={<QuizHubPlayPage />} />
      <Route path="/member/ngaji-ceria/quiz-hub" element={<QuizHubPage />} />
      <Route
        path="/member/ngaji-ceria/quiz-hub/play"
        element={<QuizHubPlayPage />}
      />
      <Route
        path="/member/ngaji-ceria/quiz-hub/versus"
        element={<QuizHubPlayPage />}
      />
      <Route path="/arena/duel/lobby/:sessionId" element={<DuelLobbyPage />} />
      <Route path="/arena/duel/play/:sessionId" element={<DuelPlayPage />} />
      <Route path="/member/ngaji-ceria/lab-irama" element={<LabIramaPage />} />
      <Route
        path="/member/ngaji-ceria/games"
        element={
          <MemberGameRouteGuard>
            <NgajiCeriaGamesPage />
          </MemberGameRouteGuard>
        }
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
        path="/member/ngaji-ceria/explore/tahfidz/:surahId"
        element={<TahfidzDetailPage />}
      />
      <Route
        path="/member/ngaji-ceria/explore/tahfidz/surah/:surahId"
        element={<TahfidzDetailPage />}
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
        element={<ArenaKartuSelectPage />}
      />
      <Route
        path="/member/ngaji-ceria/arena-kartu"
        element={<ArenaKartuSelectPage />}
      />
      <Route
        path="/member/ngaji-ceria/arena-kartu/:jilid"
        element={<ArenaKartuPage />}
      />
      <Route
        path="/member/ngaji-ceria/arena-kartu/:jilid/practice/:cardId"
        element={<KartuPracticePage />}
      />
      <Route
        path="/member/ngaji-ceria/explore/arena-kartu"
        element={<ArenaKartuSelectPage />}
      />
      <Route
        path="/member/ngaji-ceria/explore/arena-kartu/:jilid"
        element={<ArenaKartuPage />}
      />
      <Route
        path="/member/ngaji-ceria/explore/arena-kartu/:jilid/practice/:cardId"
        element={<KartuPracticePage />}
      />
      <Route
        path="/member/ngaji-ceria/explore/practice/play/:jilid"
        element={<FlashcardGamePage />}
      />
      {/* PUSAT LATIHAN (TRAINING HUB) & RHYTHM MEMORY */}
      <Route
        path="/member/ngaji-ceria/training"
        element={<TilawatiTrainingPage />}
      />
      <Route
        path="/member/ngaji-ceria/explore/training"
        element={<TilawatiTrainingPage />}
      />
      <Route
        path="/member/ngaji-ceria/rhythm-memory"
        element={<RhythmMemorySelectPage />}
      />
      <Route
        path="/member/ngaji-ceria/rhythm-memory/:jilid"
        element={<RhythmMemoryPage />}
      />
      <Route
        path="/member/ngaji-ceria/explore/rhythm-memory"
        element={<RhythmMemorySelectPage />}
      />
      <Route
        path="/member/ngaji-ceria/explore/rhythm-memory/:jilid"
        element={<RhythmMemoryPage />}
      />

      {/* NOTIFIKASI */}
      <Route path="/notifications" element={<NotificationPage />} />
      <Route
        path="/member/ngaji-ceria/notifications"
        element={<NotificationPage />}
      />
      <Route
        path="/member/ngaji-ceria/notifikasi"
        element={<NotificationPage />}
      />

      {/* TARTILA ARENA (REAL-TIME MULTIPLAYER QUIZ & EXAM) */}
      <Route path="/arena" element={<Navigate to="/arena/join" replace />} />
      <Route path="/arena/join" element={<ArenaJoinRoomPage />} />
      <Route path="/arena/host/create" element={<ArenaCreateRoomPage />} />
      <Route path="/arena/lobby/:pin" element={<ArenaHostLobbyPage />} />
      <Route path="/room/lobby/:pin" element={<ArenaHostLobbyPage />} />
      <Route path="/arena/host/lobby/:pin" element={<ArenaHostLobbyPage />} />
      <Route path="/arena/host/game/:pin" element={<ArenaHostGamePage />} />
      <Route path="/arena/play/:pin" element={<ArenaPlayerGamePage />} />
      <Route path="/arena/podium/:pin" element={<ArenaPodiumPage />} />
      <Route path="/arena/report/:pin" element={<ArenaExamReportPage />} />
      <Route
        path="/arena/leaderboard"
        element={<ArenaGlobalLeaderboardPage />}
      />

      {/* Member alias for Tartila Arena */}
      <Route
        path="/member/ngaji-ceria/arena"
        element={<Navigate to="/arena/join" replace />}
      />
      <Route
        path="/member/ngaji-ceria/arena/join"
        element={<ArenaJoinRoomPage />}
      />
      <Route
        path="/member/ngaji-ceria/arena/host/create"
        element={<ArenaCreateRoomPage />}
      />
      <Route
        path="/member/ngaji-ceria/arena/lobby/:pin"
        element={<ArenaHostLobbyPage />}
      />
      <Route
        path="/member/ngaji-ceria/arena/host/lobby/:pin"
        element={<ArenaHostLobbyPage />}
      />
      <Route
        path="/member/ngaji-ceria/arena/host/game/:pin"
        element={<ArenaHostGamePage />}
      />
      <Route
        path="/member/ngaji-ceria/arena/play/:pin"
        element={<ArenaPlayerGamePage />}
      />
      <Route
        path="/member/ngaji-ceria/arena/podium/:pin"
        element={<ArenaPodiumPage />}
      />
      <Route
        path="/member/ngaji-ceria/arena/report/:pin"
        element={<ArenaExamReportPage />}
      />
      <Route
        path="/member/ngaji-ceria/arena/leaderboard"
        element={<ArenaGlobalLeaderboardPage />}
      />

      {GAME_ROUTES.map((route) => (
        <Route
          key={route.path}
          path={`/member/ngaji-ceria/games/${route.path}`}
          element={<MemberGameRouteGuard>{route.element}</MemberGameRouteGuard>}
        />
      ))}

      {HUB_ROUTES.map(({ hub, title }) => (
        <Route
          key={hub}
          path={`/member/ngaji-ceria/games/${hub}`}
          element={
            <MemberGameRouteGuard>
              <GameLockGuard gameId={hub} title={title}>
                <GameModeHubPage hubOverride={hub} />
              </GameLockGuard>
            </MemberGameRouteGuard>
          }
        />
      ))}

      {/* TILAWATI MEMORY MATCH */}
      <Route
        path="/member/ngaji-ceria/games/memory/select"
        element={
          <MemberGameRouteGuard>
            <TilawatiMemorySelectPage />
          </MemberGameRouteGuard>
        }
      />
      <Route
        path="/member/ngaji-ceria/games/memory/:jilid"
        element={
          <MemberGameRouteGuard>
            <TilawatiMemoryPage />
          </MemberGameRouteGuard>
        }
      />
      <Route
        path="/member/ngaji-ceria/games/memory/:jilid/:level"
        element={
          <MemberGameRouteGuard>
            <TilawatiMemoryPage />
          </MemberGameRouteGuard>
        }
      />
      <Route
        path="/member/ngaji-ceria/games/tilawati-memory"
        element={
          <MemberGameRouteGuard>
            <TilawatiMemorySelectPage />
          </MemberGameRouteGuard>
        }
      />
      <Route
        path="/member/ngaji-ceria/games/tilawati-memory/select"
        element={
          <MemberGameRouteGuard>
            <TilawatiMemorySelectPage />
          </MemberGameRouteGuard>
        }
      />
      <Route
        path="/member/ngaji-ceria/games/tilawati-memory/:jilid"
        element={
          <MemberGameRouteGuard>
            <TilawatiMemoryPage />
          </MemberGameRouteGuard>
        }
      />
      <Route
        path="/member/ngaji-ceria/games/tilawati-memory/:jilid/:level"
        element={
          <MemberGameRouteGuard>
            <TilawatiMemoryPage />
          </MemberGameRouteGuard>
        }
      />

      {/* PANEL USTADZ (KELAS & SANTRI) */}
      <Route
        path="/member/ngaji-ceria/kelas"
        element={<MemberClassroomsPage />}
      />
      <Route
        path="/member/ngaji-ceria/kelas/:roomId"
        element={<MemberRoomDetailPage />}
      />
      <Route
        path="/member/ngaji-ceria/kelas/kuis/:quizId"
        element={
          <MemberGameRouteGuard>
            <MemberQuizPlayPage />
          </MemberGameRouteGuard>
        }
      />
      {/* Route untuk pembuatan kuis (tidak dibatasi role, pakai halaman quiz/create) */}
      <Route
        path="/member/ngaji-ceria/quiz/create"
        element={<UstadzQuizCreatePage />}
      />
      <Route path="/ustadz" element={<UstadzRouteGuard />}>
        <Route element={<UstadzLayout />}>
          <Route index element={<UstadzDashboardPage />} />
          <Route path="dashboard" element={<UstadzDashboardPage />} />
          <Route path="kelas" element={<UstadzRoomsPage />} />
          <Route path="kelas/baru" element={<UstadzCreateRoomPage />} />
          <Route path="kelas/:roomId" element={<UstadzRoomDetailPage />} />
          <Route
            path="preview/:materialId"
            element={<UstadzMaterialPreviewPage />}
          />
          <Route path="learning/*" element={<UstadzLearningPage />} />
          <Route
            path="kurikulum"
            element={<Navigate to="/ustadz/learning/kurikulum" replace />}
          />
          <Route
            path="kuis"
            element={<Navigate to="/ustadz/learning/kuis" replace />}
          />
          <Route path="kuis/baru" element={<UstadzQuizCreatePage />} />
          <Route path="laporan" element={<UstadzStudentReportPage />} />
          <Route path="profil" element={<UstadzProfilPage />} />
        </Route>
      </Route>

      {adminRouteElements}

      <Route path="*" element={<Navigate to="/member/ngaji-ceria" replace />} />
    </Routes>
  );
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const { needRefresh, updateServiceWorker, dismiss } = usePWAUpdate();

  const appContent = (
    <AuthProvider>
      <BrowserRouter>
        <AppThemeSync />
        <ScrollToTop />
        <SessionExpiryHandler />
        <RouteBoundary>
          <AppRoutesContent />
        </RouteBoundary>

        {/* PINDAHKAN KE SINI: Agar bisa mengakses useLocation() */}
        {needRefresh && (
          <PwaUpdateToast
            onDismiss={dismiss}
            onReload={() => updateServiceWorker(true)}
          />
        )}
        <PwaInstallBanner />
        <GlobalTilaCompanion />
        <RoleTransitionManager />
      </BrowserRouter>
    </AuthProvider>
  );

  return (
    <>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          {appContent}
        </GoogleOAuthProvider>
      ) : (
        appContent
      )}
    </>
  );
}
