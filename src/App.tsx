import { lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { GameLockGuard } from "./features/ngaji-ceria/components/GameLockGuard";
import NgajiCeriaLoginPage from "./features/ngaji-ceria/pages/NgajiCeriaLoginPage";

const NgajiCeriaRegisterPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaRegisterPage"),
);
const NgajiCeriaHomePage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaHomePage"),
);
const NgajiCeriaLibraryPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaLibraryPage"),
);
const NgajiCeriaMapPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaMapPage"),
);
const NgajiCeriaQuizListPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaQuizListPage"),
);
const NgajiCeriaQuizPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaQuizPage"),
);
const NgajiCeriaGamesPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaGamesPage"),
);
const NgajiCeriaLeaderboardPage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaLeaderboardPage"),
);
const NgajiCeriaProfilePage = lazy(
  () => import("./features/ngaji-ceria/pages/NgajiCeriaProfilePage"),
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<NgajiCeriaLoginPage />} />
          <Route
            index
            element={<Navigate to="/member/ngaji-ceria" replace />}
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

          <Route
            path="*"
            element={<Navigate to="/member/ngaji-ceria" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
