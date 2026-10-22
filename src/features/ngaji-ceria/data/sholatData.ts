export type WaktuSholat = "subuh" | "dzuhur" | "ashar" | "maghrib" | "isya";
export type StatusSholat = "belum" | "tepat" | "telat" | "jamak" | "tidak";

export interface WaktuInfo {
  key: WaktuSholat;
  label: string;
  arab: string;
  emoji: string;
  timeHint: string;
}

export const WAKTU_LIST: WaktuInfo[] = [
  { key: "subuh", label: "Subuh", arab: "الفجر", emoji: "🌅", timeHint: "Fajar shadiq s.d. terbit matahari" },
  { key: "dzuhur", label: "Dzuhur", arab: "الظهر", emoji: "☀️", timeHint: "Matahari tergelincir s.d. bayangan sama panjang" },
  { key: "ashar", label: "Ashar", arab: "العصر", emoji: "🌤️", timeHint: "Bayangan lebih panjang s.d. menjelang maghrib" },
  { key: "maghrib", label: "Maghrib", arab: "المغرب", emoji: "🌇", timeHint: "Terbenam matahari s.d. hilangnya syafaq merah" },
  { key: "isya", label: "Isya", arab: "العشاء", emoji: "🌙", timeHint: "Hilang mega merah s.d. sepertiga malam" },
];

export interface StatusInfo {
  key: StatusSholat;
  label: string;
  short: string;
  emoji: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export const STATUS_LIST: StatusInfo[] = [
  {
    key: "belum",
    label: "Belum",
    short: "-",
    emoji: "⏳",
    bgClass: "bg-slate-100",
    borderClass: "border-slate-300",
    textClass: "text-slate-600",
  },
  {
    key: "tepat",
    label: "Tepat Waktu",
    short: "✓",
    emoji: "✅",
    bgClass: "bg-[#DCFCE7]",
    borderClass: "border-[#15803D]",
    textClass: "text-[#15803D]",
  },
  {
    key: "telat",
    label: "Masih Sempat",
    short: "!",
    emoji: "⚠️",
    bgClass: "bg-[#FEF9C3]",
    borderClass: "border-[#A16207]",
    textClass: "text-[#A16207]",
  },
  {
    key: "jamak",
    label: "Jamak/Qashar",
    short: "J",
    emoji: "✈️",
    bgClass: "bg-[#E0F2FE]",
    borderClass: "border-[#0284C7]",
    textClass: "text-[#0284C7]",
  },
  {
    key: "tidak",
    label: "Terlewat",
    short: "✕",
    emoji: "❌",
    bgClass: "bg-[#FFE4E6]",
    borderClass: "border-[#E11D48]",
    textClass: "text-[#E11D48]",
  },
];

export function getStatusInfo(key: StatusSholat): StatusInfo {
  return STATUS_LIST.find((s) => s.key === key) ?? STATUS_LIST[0];
}

export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateId(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  try {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  try {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(d);
  } catch {
    return iso;
  }
}
