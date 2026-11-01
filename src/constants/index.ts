export * from "./mascot";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const MEMBER_CATEGORIES = [
  "BALITA",
  "CABERAWIT",
  "PRA_REMAJA",
  "REMAJA",
  "PRA_NIKAH",
  "DEWASA",
  "ISTIMEWA",
] as const;

export const ATTENDANCE_STATUSES = [
  "HADIR",
  "IZIN",
  "SAKIT",
  "ALPA",
] as const;

export const MONITORING_STATUSES = [
  "AKTIF",
  "PERLU_PERHATIAN",
  "KURANG_AKTIF",
  "TIDAK_AKTIF",
] as const;

// Kritik & Saran (Feedback Prompt) gate.
// State tersimpan di localStorage supaya modal tidak muncul dua kali
// saat refresh, dan karena dicek ulang dari backend setiap kali user login.
export const FEEDBACK_PROMPT_STORAGE_KEY = "tartila_feedback_prompt";
export const FEEDBACK_PROMPT_DISMISSED_KEY = "tartila_feedback_dismissed";
export const FEEDBACK_PROMPT_SNOOZE_KEY = "tartila_feedback_snooze_until";
export const FEEDBACK_PROMPT_CADENCE_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari
export const FEEDBACK_PROMPT_MIN_SNOOZE_DAYS = 30;
export const FEEDBACK_PROMPT_MAX_SNOOZE_DAYS = 90;
export const FEEDBACK_PROMPT_DELAY_MS = 5 * 60 * 1000; // 5 menit
export const FEEDBACK_PROMPT_PLAYED_KEY = "tartila_has_played_session";
export const FEEDBACK_PROMPT_SESSION_START_KEY = "tartila_session_start";
