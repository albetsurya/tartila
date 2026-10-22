import { useCallback, useEffect, useMemo, useState } from "react";
import {
  todayIso,
  isoDate,
  type WaktuSholat,
  type StatusSholat,
} from "../data/sholatData";
import { getNgajiCeriaScope } from "./useNgajiCeriaStore";
import { grantXp } from "../pages/games/_shared/progression";

const BASE_KEY = "ngaji-ceria-sholat-journal-v1";

export type JournalEntry = Partial<Record<WaktuSholat, StatusSholat>>;
export type JournalData = Record<string, JournalEntry>;

export const WAKTU_ORDER: WaktuSholat[] = [
  "subuh",
  "dzuhur",
  "ashar",
  "maghrib",
  "isya",
];

function getStorageKey(): string {
  const scope = getNgajiCeriaScope();
  return scope === "guest" ? BASE_KEY : `${BASE_KEY}:${encodeURIComponent(scope)}`;
}

function loadData(key: string): JournalData {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistData(key: string, data: JournalData) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function countRecorded(entry: JournalEntry = {}): number {
  return WAKTU_ORDER.filter((k) => {
    const s = entry[k];
    return s && s !== "belum";
  }).length;
}

export function countTepat(entry: JournalEntry = {}): number {
  return WAKTU_ORDER.filter((k) => entry[k] === "tepat").length;
}

export function isComplete(entry: JournalEntry = {}): boolean {
  return WAKTU_ORDER.every((k) => {
    const s = entry[k];
    return s && s !== "belum";
  });
}

export function calculateStreak(data: JournalData): number {
  let streak = 0;
  const today = new Date();
  let started = false;

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = isoDate(d);
    const entry = data[iso];

    if (!entry) {
      if (i === 0) continue; // Hari ini belum diisi penuh tidak langsung putus
      break;
    }

    if (isComplete(entry)) {
      streak++;
      started = true;
    } else {
      if (i === 0) continue;
      break;
    }
  }

  return started ? streak : 0;
}

export function useSholatJournal() {
  const storageKey = getStorageKey();
  const [data, setData] = useState<JournalData>(() => loadData(storageKey));

  useEffect(() => {
    setData(loadData(storageKey));
  }, [storageKey]);

  const today = todayIso();
  const todayEntry = useMemo(() => data[today] ?? {}, [data, today]);

  const setStatus = useCallback(
    (dateIso: string, waktu: WaktuSholat, status: StatusSholat) => {
      setData((prev) => {
        const nextDate = { ...(prev[dateIso] ?? {}) };
        if (status === "belum") {
          delete nextDate[waktu];
        } else {
          nextDate[waktu] = status;
        }

        const wasComplete = isComplete(prev[dateIso]);
        const nowComplete = isComplete(nextDate);

        if (!wasComplete && nowComplete) {
          try {
            const xpKey = `${storageKey}:awarded-xp`;
            const awarded: string[] = JSON.parse(
              localStorage.getItem(xpKey) || "[]",
            );
            if (!awarded.includes(dateIso)) {
              grantXp(50);
              localStorage.setItem(
                xpKey,
                JSON.stringify([...awarded, dateIso]),
              );
            }
          } catch {}
        }

        const next = { ...prev, [dateIso]: nextDate };
        persistData(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const resetDate = useCallback(
    (dateIso: string) => {
      setData((prev) => {
        const next = { ...prev };
        delete next[dateIso];
        persistData(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const getHistory = useCallback(
    (days: number = 7) => {
      const list: { date: string; entry: JournalEntry }[] = [];
      const ref = new Date();
      for (let i = 0; i < days; i++) {
        const d = new Date(ref);
        d.setDate(d.getDate() - i);
        const iso = isoDate(d);
        list.push({ date: iso, entry: data[iso] ?? {} });
      }
      return list;
    },
    [data],
  );

  const streak = useMemo(() => calculateStreak(data), [data]);
  const recorded = useMemo(() => countRecorded(todayEntry), [todayEntry]);
  const tepat = useMemo(() => countTepat(todayEntry), [todayEntry]);
  const complete = useMemo(() => isComplete(todayEntry), [todayEntry]);

  return {
    today,
    todayEntry,
    recorded,
    tepat,
    complete,
    streak,
    setStatus,
    resetDate,
    getHistory,
  };
}
