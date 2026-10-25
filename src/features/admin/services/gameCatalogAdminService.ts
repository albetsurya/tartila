import { useCallback, useEffect, useState } from "react";
import {
  GAME_CATALOG,
  MATERI_LABELS,
  type GameAccessLevel,
  type GameCatalogEntry,
  type JilidNumber,
  type MateriPokok,
} from "@/data/learningCatalog";
import { callREST } from "@/services/api";

export const GAME_CATALOG_STORAGE_KEY = "tartila_admin_game_catalog_overrides";
export const EVENT_GAME_CATALOG_UPDATED = "tartila:game-catalog-updated";

export interface BackendGameConfig {
  game_id: string;
  is_active: boolean;
  display_type?: "standalone" | "hub";
  parent_hub_id?: string | null;
  sort_order?: number;
  updated_at?: string;
}

export interface GameCatalogOverride {
  title?: string;
  access?: GameAccessLevel;
  needsContentValidation?: boolean;
  learningObjective?: string;
  caraMain?: string;
  tipsUstadz?: string[];
  materiPokok?: MateriPokok[];
  jilidRelevan?: JilidNumber[];
  updatedAt?: string;
}

export type GameOverridesMap = Record<string, GameCatalogOverride>;

export interface AdminGameCatalogEntry extends GameCatalogEntry {
  isActive: boolean;
  displayType: "standalone" | "hub";
  parentHubId?: string | null;
  sortOrder: number;
  isOverridden?: boolean;
  updatedAt?: string;
  routeAliases?: readonly string[];
}

export interface AdminGameFilter {
  query?: string;
  materi?: MateriPokok | "all";
  jilid?: JilidNumber | "all";
  access?: GameAccessLevel | "all";
  validationStatus?: "all" | "needs-validation" | "validated";
  status?: "all" | "active" | "inactive";
}

export interface GameCatalogStats {
  total: number;
  activeCount: number;
  inactiveCount: number;
  guestOpen: number;
  memberOnly: number;
  needsValidation: number;
  validated: number;
  overriddenCount: number;
}

// In-memory cache for game status from Go backend
const cachedConfigs: Map<string, BackendGameConfig> = new Map();
const inMemoryOverrides: Record<string, GameCatalogOverride> = {};

/** Fetch list of all game configurations from Go Backend (Admin Only) */
export async function fetchAdminGames(): Promise<BackendGameConfig[]> {
  try {
    const data = await callREST<BackendGameConfig[]>("GET", "/api/admin/games");
    return Array.isArray(data) ? data : [];
  } catch {
    const fallback = await callREST<BackendGameConfig[]>("GET", "/api/v1/admin/games");
    return Array.isArray(fallback) ? fallback : [];
  }
}

/** Update game display and active configuration in Go Backend via PATCH /api/admin/games/:game_id */
export async function patchAdminGameConfig(
  gameId: string,
  updates: Partial<BackendGameConfig>,
): Promise<BackendGameConfig> {
  const payload: Partial<BackendGameConfig> = {};
  if (updates.is_active !== undefined) payload.is_active = updates.is_active;
  if (updates.display_type !== undefined) payload.display_type = updates.display_type;
  if (updates.parent_hub_id !== undefined) payload.parent_hub_id = updates.parent_hub_id;
  if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;

  let res: BackendGameConfig;
  try {
    res = await callREST<BackendGameConfig>(
      "PATCH",
      `/api/admin/games/${encodeURIComponent(gameId)}`,
      payload,
    );
  } catch {
    res = await callREST<BackendGameConfig>(
      "PATCH",
      `/api/v1/admin/games/${encodeURIComponent(gameId)}`,
      payload,
    );
  }

  const existing = cachedConfigs.get(gameId);
  const merged: BackendGameConfig = {
    game_id: gameId,
    is_active: res?.is_active ?? updates.is_active ?? existing?.is_active ?? true,
    display_type: res?.display_type ?? updates.display_type ?? existing?.display_type ?? "standalone",
    parent_hub_id:
      res?.parent_hub_id !== undefined
        ? res.parent_hub_id
        : updates.parent_hub_id !== undefined
        ? updates.parent_hub_id
        : existing?.parent_hub_id ?? null,
    sort_order: res?.sort_order ?? updates.sort_order ?? existing?.sort_order ?? 0,
    updated_at: res?.updated_at ?? new Date().toISOString(),
  };

  cachedConfigs.set(gameId, merged);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(EVENT_GAME_CATALOG_UPDATED, {
        detail: { gameId, config: merged },
      }),
    );
  }
  return merged;
}

/** Update game active status in Go Backend via PATCH /api/admin/games/:game_id */
export async function patchAdminGameStatus(
  gameId: string,
  isActive: boolean,
): Promise<BackendGameConfig> {
  return patchAdminGameConfig(gameId, { is_active: isActive });
}

/** Membaca seluruh map override in-memory */
export function getGameOverrides(): GameOverridesMap {
  return { ...inMemoryOverrides };
}

/** Mengambil katalog game gabungan (data dasar + status Go Backend + kustomisasi in-memory) */
export function getAdminGameCatalog(): AdminGameCatalogEntry[] {
  const entries = GAME_CATALOG.map((base) => {
    const backendConfig =
      cachedConfigs.get(base.gameId) ||
      (base.routeAliases &&
        base.routeAliases.map((a) => cachedConfigs.get(a)).find(Boolean));
    const override = inMemoryOverrides[base.gameId];
    const isActive = backendConfig ? backendConfig.is_active : true;
    const displayType =
      (backendConfig?.display_type as "standalone" | "hub") || "standalone";
    const parentHubId = backendConfig?.parent_hub_id || null;
    const sortOrder = backendConfig?.sort_order ?? 0;

    return {
      ...base,
      isActive,
      displayType,
      parentHubId,
      sortOrder,
      title: override?.title ?? base.title,
      access: override?.access ?? base.access,
      needsContentValidation:
        override?.needsContentValidation !== undefined
          ? override.needsContentValidation
          : base.needsContentValidation,
      learningObjective: override?.learningObjective ?? base.learningObjective,
      caraMain: override?.caraMain ?? base.caraMain,
      tipsUstadz: override?.tipsUstadz ? [...override.tipsUstadz] : base.tipsUstadz,
      materiPokok: override?.materiPokok ? [...override.materiPokok] : base.materiPokok,
      jilidRelevan: override?.jilidRelevan ? [...override.jilidRelevan] : base.jilidRelevan,
      isOverridden:
        !isActive ||
        Boolean(override) ||
        displayType !== "standalone" ||
        sortOrder !== 0,
      updatedAt: backendConfig?.updated_at ?? override?.updatedAt,
    };
  });

  return entries.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

/** Mengambil satu entri game berdasarkan gameId */
export function getAdminGameById(gameId: string): AdminGameCatalogEntry | undefined {
  const list = getAdminGameCatalog();
  return list.find((g) => g.gameId === gameId || g.id === gameId);
}

/** Memeriksa apakah game memiliki penyesuaian khusus */
export function isGameOverridden(gameId: string): boolean {
  const backendConfig = cachedConfigs.get(gameId);
  const isInactive = backendConfig ? !backendConfig.is_active : false;
  return isInactive || Boolean(inMemoryOverrides[gameId]);
}

/** Menyimpan override in-memory untuk satu game */
export function saveGameOverride(
  gameId: string,
  updates: Partial<GameCatalogOverride>,
): void {
  const existing = inMemoryOverrides[gameId] ?? {};
  inMemoryOverrides[gameId] = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

/** Menghapus override in-memory untuk satu game */
export function resetGameOverride(gameId: string): void {
  delete inMemoryOverrides[gameId];
}

/** Mengembalikan seluruh in-memory override ke default */
export function resetAllGameOverrides(): void {
  for (const k of Object.keys(inMemoryOverrides)) {
    delete inMemoryOverrides[k];
  }
}

/** Menghitung statistik katalog game */
export function getGameCatalogStats(
  games: AdminGameCatalogEntry[] = getAdminGameCatalog(),
): GameCatalogStats {
  let guestOpen = 0;
  let memberOnly = 0;
  let needsValidation = 0;
  let validated = 0;
  let overriddenCount = 0;
  let activeCount = 0;
  let inactiveCount = 0;

  for (const game of games) {
    if (game.isActive) activeCount++;
    else inactiveCount++;

    if (game.access === "guest-open") guestOpen++;
    else memberOnly++;

    if (game.needsContentValidation) needsValidation++;
    else validated++;

    if (game.isOverridden) overriddenCount++;
  }

  return {
    total: games.length,
    activeCount,
    inactiveCount,
    guestOpen,
    memberOnly,
    needsValidation,
    validated,
    overriddenCount,
  };
}

/** Melakukan filter dan pencarian katalog game */
export function filterAdminGames(
  games: AdminGameCatalogEntry[],
  filters: AdminGameFilter,
): AdminGameCatalogEntry[] {
  const query = filters.query?.trim().toLowerCase();

  return games.filter((game) => {
    // Filter Status Aktif / Non-aktif
    if (filters.status && filters.status !== "all") {
      if (filters.status === "active" && !game.isActive) return false;
      if (filters.status === "inactive" && game.isActive) return false;
    }

    // Filter Materi Pokok
    if (filters.materi && filters.materi !== "all") {
      if (!game.materiPokok.includes(filters.materi)) return false;
    }

    // Filter Jilid
    if (filters.jilid !== undefined && filters.jilid !== "all") {
      if (!game.jilidRelevan.includes(filters.jilid)) return false;
    }

    // Filter Akses
    if (filters.access && filters.access !== "all") {
      if (game.access !== filters.access) return false;
    }

    // Filter Status Validasi
    if (filters.validationStatus && filters.validationStatus !== "all") {
      if (filters.validationStatus === "needs-validation" && !game.needsContentValidation) {
        return false;
      }
      if (filters.validationStatus === "validated" && game.needsContentValidation) {
        return false;
      }
    }

    // Filter Pencarian Teks
    if (query) {
      const materiTexts = game.materiPokok.map(
        (m) => `${m} ${MATERI_LABELS[m] || ""}`,
      );
      const tipsText = game.tipsUstadz.join(" ");
      const haystack = [
        game.title,
        game.gameId,
        game.learningObjective,
        game.caraMain,
        tipsText,
        ...materiTexts,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

/** React hook untuk komponen admin katalog game */
export function useAdminGameCatalog() {
  const [games, setGames] = useState<AdminGameCatalogEntry[]>(() =>
    getAdminGameCatalog(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAdminGames();
      cachedConfigs.clear();
      list.forEach((item) => cachedConfigs.set(item.game_id, item));
      setGames(getAdminGameCatalog());
    } catch (err: any) {
      console.warn("[useAdminGameCatalog] Error loading games from Go backend:", err);
      setError(err?.message || "Gagal memuat konfigurasi dari backend");
      setGames(getAdminGameCatalog());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const stats = getGameCatalogStats(games);

  const toggleActive = async (gameId: string): Promise<boolean> => {
    const target = games.find((g) => g.gameId === gameId);
    if (!target) return false;
    const nextActive = !target.isActive;

    // Optimistic update
    setGames((prev) =>
      prev.map((g) =>
        g.gameId === gameId
          ? { ...g, isActive: nextActive, updatedAt: new Date().toISOString() }
          : g,
      ),
    );

    try {
      const updated = await patchAdminGameStatus(gameId, nextActive);
      cachedConfigs.set(gameId, updated);
      setGames(getAdminGameCatalog());
      return true;
    } catch (err) {
      // Revert if error
      setGames((prev) =>
        prev.map((g) =>
          g.gameId === gameId
            ? { ...g, isActive: target.isActive }
            : g,
        ),
      );
      throw err;
    }
  };

  const toggleAccess = (gameId: string) => {
    const target = games.find((g) => g.gameId === gameId);
    if (!target) return;
    const nextAccess: GameAccessLevel =
      target.access === "guest-open" ? "member-only" : "guest-open";
    saveGameOverride(gameId, { access: nextAccess });
    setGames(getAdminGameCatalog());
  };

  const toggleValidation = (gameId: string) => {
    const target = games.find((g) => g.gameId === gameId);
    if (!target) return;
    saveGameOverride(gameId, {
      needsContentValidation: !target.needsContentValidation,
    });
    setGames(getAdminGameCatalog());
  };

  const updateGame = (gameId: string, updates: Partial<GameCatalogOverride>) => {
    saveGameOverride(gameId, updates);
    setGames(getAdminGameCatalog());
  };

  const updateGameConfig = async (
    gameId: string,
    updates: Partial<BackendGameConfig>,
  ): Promise<BackendGameConfig> => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.gameId !== gameId) return g;
        return {
          ...g,
          isActive: updates.is_active !== undefined ? updates.is_active : g.isActive,
          displayType:
            updates.display_type !== undefined
              ? updates.display_type
              : g.displayType,
          parentHubId:
            updates.parent_hub_id !== undefined
              ? updates.parent_hub_id
              : g.parentHubId,
          sortOrder:
            updates.sort_order !== undefined ? updates.sort_order : g.sortOrder,
          updatedAt: new Date().toISOString(),
        };
      }),
    );

    try {
      const updated = await patchAdminGameConfig(gameId, updates);
      setGames(getAdminGameCatalog());
      return updated;
    } catch (err) {
      setGames(getAdminGameCatalog());
      throw err;
    }
  };

  const resetGame = (gameId: string) => {
    resetGameOverride(gameId);
    setGames(getAdminGameCatalog());
  };

  const resetAll = () => {
    resetAllGameOverrides();
    setGames(getAdminGameCatalog());
  };

  return {
    games,
    stats,
    loading,
    error,
    toggleActive,
    updateGameConfig,
    toggleAccess,
    toggleValidation,
    updateGame,
    resetGame,
    resetAll,
    refresh: reload,
  };
}
