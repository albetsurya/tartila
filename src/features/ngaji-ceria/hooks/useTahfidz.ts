import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TAHFIDZ_TARGETS,
  ayatKey,
  targetCount,
  type TahfidzTarget,
} from "../data/tahfidzData";
import { getNgajiCeriaScope } from "./useNgajiCeriaStore";
import { grantXp } from "../pages/games/_shared/progression";

const BASE_KEY = "ngaji-ceria-tahfidz-v1";
const ACTIVITY_KEY = "ngaji-ceria-tahfidz-activity";

export interface AyatState {
  hafal: boolean;
  hafalSince?: number;
  lastReview?: number;
}

export type TahfidzData = Record<string, AyatState>;

export interface SurahProgress {
  target: TahfidzTarget;
  total: number;
  hafal: number;
  percentage: number;
  complete: boolean;
}

function getStorageKey(): string {
  const scope = getNgajiCeriaScope();
  return scope === "guest" ? BASE_KEY : `${BASE_KEY}:${encodeURIComponent(scope)}`;
}

function getActivityKey(): string {
  const scope = getNgajiCeriaScope();
  return scope === "guest" ? ACTIVITY_KEY : `${ACTIVITY_KEY}:${encodeURIComponent(scope)}`;
}

function loadData(key: string): TahfidzData {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistData(key: string, data: TahfidzData) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function loadActivity(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistActivity(key: string, dates: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(dates));
  } catch {}
}

export function getSurahProgress(
  data: TahfidzData,
  target: TahfidzTarget,
): SurahProgress {
  const total = targetCount(target);
  let hafal = 0;
  for (let a = target.ayatStart; a <= target.ayatEnd; a++) {
    const s = data[ayatKey(target.surah, a)];
    if (s?.hafal) hafal++;
  }
  const percentage = total > 0 ? Math.round((hafal / total) * 100) : 0;
  return {
    target,
    total,
    hafal,
    percentage,
    complete: hafal === total && total > 0,
  };
}

export function getOverallStats(data: TahfidzData) {
  let totalHafal = 0;
  let totalAyat = 0;
  let surahSelesai = 0;
  let surahMulai = 0;

  for (const target of TAHFIDZ_TARGETS) {
    const p = getSurahProgress(data, target);
    totalHafal += p.hafal;
    totalAyat += p.total;
    if (p.complete) surahSelesai++;
    else if (p.hafal > 0) surahMulai++;
  }

  const percentage =
    totalAyat > 0 ? Math.round((totalHafal / totalAyat) * 100) : 0;

  return {
    totalHafal,
    totalAyat,
    surahSelesai,
    surahMulai,
    totalSurah: TAHFIDZ_TARGETS.length,
    percentage,
  };
}

function calculateStreak(activityDates: string[]): number {
  if (!activityDates.length) return 0;
  const set = new Set(activityDates);
  let streak = 0;
  const now = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    if (set.has(iso)) {
      streak++;
    } else {
      if (i === 0) continue; // hari ini belum aktivitas tidak langsung memutus jika kemarin aktif
      break;
    }
  }
  return streak;
}

export function useTahfidz() {
  const storageKey = getStorageKey();
  const actKey = getActivityKey();

  const [data, setData] = useState<TahfidzData>(() => loadData(storageKey));
  const [activityDates, setActivityDates] = useState<string[]>(() =>
    loadActivity(actKey),
  );

  useEffect(() => {
    setData(loadData(storageKey));
    setActivityDates(loadActivity(actKey));
  }, [storageKey, actKey]);

  const isHafal = useCallback(
    (surah: number, ayat: number) => {
      return Boolean(data[ayatKey(surah, ayat)]?.hafal);
    },
    [data],
  );

  const toggleHafal = useCallback(
    (surah: number, ayat: number) => {
      setData((prev) => {
        const key = ayatKey(surah, ayat);
        const existing = prev[key];
        const next = { ...prev };

        if (existing?.hafal) {
          delete next[key];
        } else {
          const now = Date.now();
          next[key] = {
            hafal: true,
            hafalSince: existing?.hafalSince ?? now,
            lastReview: now,
          };
          grantXp(30);
        }

        persistData(storageKey, next);

        const iso = new Date().toISOString().slice(0, 10);
        setActivityDates((dates) => {
          if (dates.includes(iso)) return dates;
          const updated = [...dates, iso];
          persistActivity(actKey, updated);
          return updated;
        });

        return next;
      });
    },
    [storageKey, actKey],
  );

  const reset = useCallback(() => {
    setData({});
    persistData(storageKey, {});
  }, [storageKey]);

  const stats = useMemo(() => getOverallStats(data), [data]);
  const streak = useMemo(
    () => calculateStreak(activityDates),
    [activityDates],
  );

  return {
    data,
    isHafal,
    toggleHafal,
    reset,
    stats,
    streak,
  };
}
