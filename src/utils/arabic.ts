/**
 * Helper untuk normalisasi teks Arab di seluruh aplikasi:
 * - Menghapus karakter Tatweel / Kashida (ـ) U+0640 (misal: "هـ" -> "ه")
 * - Menghapus karakter kontrol tak terlihat (ZWNJ, ZWJ, ZWSP, LTR/RTL marks, BOM)
 * - Menghapus spasi di awal & akhir
 */
export function normalizeArabicText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/\u0640/g, "")
    .replace(/[\u200B-\u200F\uFEFF]/g, "")
    .trim();
}
