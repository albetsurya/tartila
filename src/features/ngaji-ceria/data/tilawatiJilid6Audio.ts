/**
 * Audio Jilid 6 disusun per ayat, bukan per baris seperti Jilid 1-5.
 * Oleh karena itu `PAGE_SHAPES` (berbasis baris) tidak berlaku dan
 * `getTilawatiQuestionAudioUrl` akan selalu kosong untuk Jilid 6.
 *
 * File ini menyediakan pemetaan audio per (halaman, indeks soal) yang dibangun
 * dari nama berkas nyata pada `public/audio/tilawati/jilid_6/`.
 *
 * ATURAN KERAS:
 * - Jangan menghapus simbol waqaf (`○`, `ۚ`, `ۖ`, `ۗ`, `ۘ`, `ۙ`) dari teks Arab.
 * - Jangan mengubah isi file inti `tilawatiQuizJilid6.ts`.
 */

/** Pemetaan audio per halaman → daftar berkas per indeks soal. */
export const JILID_6_AUDIO_FILES: Record<number, (string | null)[]> = {
  1: [
    null, null, "AnNas-ayat1", "AnNas-ayat2", "AnNas-ayat2", "AnNas-ayat3", "AnNas-ayat4",
    "AnNas-ayat4", "AnNas-ayat5", "AnNas-ayat6", "AlFalaq-ayat1", "AlFalaq-ayat2", "AlFalaq-ayat2",
    "AlFalaq-ayat3", "AlFalaq-ayat4", "AlFalaq-ayat5", "AlIkhlas-ayat1", "AlIkhlas-ayat2",
    "AlIkhlas-ayat2", "AlIkhlas-ayat3", "AlIkhlas-ayat4",
  ],
  2: [
    null, null, "AlLahab-ayat1", "AlLahab-ayat1", "AlLahab-ayat2", "AlLahab-ayat3",
    "AlLahab-ayat4", "AlLahab-ayat4", "AlLahab-ayat5", "AnNasr-ayat1", "AnNasr-ayat1",
    "AnNasr-ayat2", "AnNasr-ayat2", "AnNasr-ayat2", "AnNasr-ayat3", "AlKafirun-ayat1",
    "AlKafirun-ayat2", "AlKafirun-ayat3", "AlKafirun-ayat3",
  ],
  3: [
    "AlKafirun-ayat4-lanjutan", "AlKafirun-ayat5", "AlKafirun-ayat5", "AlKafirun-ayat6",
    "AlKautsar-ayat1", "AlKautsar-ayat2", "AlKautsar-ayat3", "AlMaun-ayat1", "AlMaun-ayat1",
    "AlMaun-ayat2", "AlMaun-ayat2", "AlMaun-ayat3", "AlMaun-ayat4", "AlMaun-ayat4", "AlMaun-ayat5",
    "AlMaun-ayat6", "AlMaun-ayat6", "AlMaun-ayat7",
  ],
  25: [
    "AlHujurat-ayat11", "AlHujurat-ayat11", "AlHujurat-ayat11", "AlHujurat-ayat11",
    "AlHujurat-ayat11", "AlHujurat-ayat11", "AlHujurat-ayat11", "Fussilat-ayat44",
    "Fussilat-ayat44", "Fussilat-ayat44", "Fussilat-ayat44", "Fussilat-ayat44", "Fussilat-ayat44",
    "Fussilat-ayat44",
  ],
  26: [
    "AlKahfi-ayat1", "AlKahfi-ayat1", "AlKahfi-ayat1", "AlKahfi-ayat1", "AlKahfi-ayat2",
    "AlKahfi-ayat2", "Yasin-ayat51", "Yasin-ayat51", "Yasin-ayat52", "AlQiyamah-ayat26",
    "AlQiyamah-ayat27", "AlQiyamah-ayat28",
  ],
  27: [
    "AlMuthaffifin-ayat12", "AlMuthaffifin-ayat12", "AlMuthaffifin-ayat13", "AlMuthaffifin-ayat13",
    "AlMuthaffifin-ayat14", "AlAhqaf-ayat4", "AlAhqaf-ayat4", "AlAhqaf-ayat4", "AlAhqaf-ayat4",
    "AlBaqarah-ayat245-awal", "AlBaqarah-ayat245-awal", "AlBaqarah-ayat245-awal",
    "AlBaqarah-ayat245-awal",
  ],
  28: [
    "AlBaqarah-ayat245-lanjutan", "AlAraf-ayat69", "AlAraf-ayat69", "AlAraf-ayat69",
    "AlAraf-ayat69", "AlAraf-ayat69", "AthThur-ayat36", "AthThur-ayat36", "AthThur-ayat37",
    "AlGhasyiyah-ayat22", "AlGhasyiyah-ayat22", "AlGhasyiyah-ayat23", "AlGhasyiyah-ayat24",
    "AlGhasyiyah-ayat24",
  ],
  29: [
    "AlGhasyiyah-ayat25-lanjutan", "AlGhasyiyah-ayat26", "AlKafirun-ayat1", "AlKafirun-ayat2",
    "AlKafirun-ayat3", "AlKafirun-ayat3", "AlKafirun-ayat4", "AlKafirun-ayat5", "AlKafirun-ayat5",
    "AlKafirun-ayat6", "AzZukhruf-ayat81", "AzZukhruf-ayat81", "Luqman-ayat15-awal",
    "Luqman-ayat15-awal",
  ],
  30: [
    "Luqman-ayat15-lanjutan", "Luqman-ayat15-lanjutan", "Luqman-ayat15-lanjutan",
    "Luqman-ayat15-lanjutan", "AzZumar-ayat17", "AzZumar-ayat17", "AzZumar-ayat17",
    "AlFurqan-ayat49", "AlFurqan-ayat49", "AliImran-ayat119-awal",
  ],
  31: [
    "AliImran-ayat119-lanjutan", "AliImran-ayat119-lanjutan", "AliImran-ayat119-lanjutan",
    "AliImran-ayat119-lanjutan", "AliImran-ayat119-lanjutan", "AliImran-ayat119-lanjutan",
    "AlMuminun-ayat45", "AlMuminun-ayat45", "AlMuminun-ayat45", "AlMuminun-ayat45",
    "AlMuminun-ayat46", "Yusuf-ayat87", "Yusuf-ayat87", "Yusuf-ayat87", "Yusuf-ayat87",
  ],
  32: [
    "AlKahfi-ayat23", "AlKahfi-ayat23", "AlKahfi-ayat23", "AlKahfi-ayat23", "AlKahfi-ayat24",
    "AlKahfi-ayat24", "AlKahfi-ayat24", "AlKahfi-ayat37", "AlKahfi-ayat38", "Al-Insan-ayat4",
  ],
  33: [
    "AlAnam-ayat34", "AlAnam-ayat34", "AlAnam-ayat34", "AlAnam-ayat34", "AlAnam-ayat34",
    "Hud-ayat67", "Hud-ayat67", "Hud-ayat67", "Hud-ayat67", "Hud-ayat67", "Hud-ayat68",
    "AliImran-ayat144-awal", "AliImran-ayat144-awal",
  ],
  34: [
    "AliImran-ayat144-lanjutan", "AliImran-ayat144-lanjutan", "AliImran-ayat144-lanjutan",
    "AliImran-ayat144-lanjutan", "AlAnbiya-ayat34", "AlAnbiya-ayat34", "AlAnbiya-ayat34",
    "AlAnbiya-ayat34", "AlAnbiya-ayat34", "AlAnbiya-ayat35", "ArRad-ayat30", "ArRad-ayat30",
    "ArRad-ayat30", "ArRad-ayat30", "ArRad-ayat30",
  ],
  35: [
    "AlKahfi-ayat14", "AlKahfi-ayat14", "AlKahfi-ayat14", "ArRum-ayat39", "ArRum-ayat39",
    "ArRum-ayat39", "ArRum-ayat39", "Muhammad-ayat4-awal", "Muhammad-ayat4-awal",
    "Muhammad-ayat4-awal", "Muhammad-ayat4-awal", "Muhammad-ayat4-awal",
  ],
  36: [
    "Muhammad-ayat31", "Muhammad-ayat31", "Muhammad-ayat31", "Muhammad-ayat4-lanjutan",
    "Muhammad-ayat4-lanjutan", "Muhammad-ayat4-lanjutan", "Muhammad-ayat31", "AlAhzab-ayat10",
    "AlAhzab-ayat10", "AlAhzab-ayat10", "AlAhzab-ayat10", "AlAhzab-ayat11",
  ],
  38: [
    "AlMursalat-ayat20", "AlMursalat-ayat20", "AlMursalat-ayat21", "AlMursalat-ayat22",
    "AlMursalat-ayat22", "AlMursalat-ayat22", "AlMursalat-ayat23", "AlIsra-ayat8", "AlIsra-ayat8",
    "AlIsra-ayat8", "Yunus-ayat89", "Yunus-ayat89", "AshShaff-ayat14-awal",
  ],
  39: [
    "AshShaff-ayat14-lanjutan", "AshShaff-ayat14-lanjutan", "AshShaff-ayat14-lanjutan",
    "AshShaff-ayat14-lanjutan", "AshShaff-ayat14-lanjutan", "AlMaidah-ayat28", "AlMaidah-ayat28",
    "AlMaidah-ayat28", "AlAraf-ayat176-awal", "AlAraf-ayat176-awal", "AlAraf-ayat176-awal",
    "AlAraf-ayat176-awal", "AlAraf-ayat176-awal", "AlAraf-ayat176-awal",
  ],
  40: [
    "AlAraf-ayat176-lanjutan", "AlAraf-ayat176-lanjutan", "AlAraf-ayat176-lanjutan",
    "AzZukhruf-ayat39", "AzZukhruf-ayat39", "Hud-ayat42", "Hud-ayat42", "Hud-ayat42", "Hud-ayat42",
    "AlHumazah-ayat1", "AlHumazah-ayat1", "AlHumazah-ayat2",
  ],
  41: [
    "AlJumah-ayat11", "AlJumah-ayat11", "AlJumah-ayat11", "AlJumah-ayat11", "AlHajj-ayat11",
    "AlHajj-ayat11", "AlHajj-ayat11", "AlHajj-ayat11", "AlHajj-ayat11", "AlHajj-ayat11",
    "AlHajj-ayat11", "AlHajj-ayat11", "AlFurqan-ayat4", "AlFurqan-ayat4", "AlFurqan-ayat4",
  ],
};

/** Angka Arab (٠-٩) → angka Latin. */
const ARABIC_DIGITS: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

/**
 * Mengambil nomor ayat dari teks Arab soal Jilid 6.
 * Nomor ayat berada setelah tanda lingkaran waqaf (`○`), mis. "ۙ ○١١".
 *
 * @param arabic Teks Arab soal.
 * @returns Nomor ayat, atau `null` bila tidak ditemukan.
 */
export function parseJilid6Ayah(arabic: string): number | null {
  const match = /[○◯]\s*([٠-٩]+)/.exec(arabic);
  if (!match) return null;
  const digits = match[1]
    .split("")
    .map((digit) => ARABIC_DIGITS[digit] ?? "")
    .join("");
  const value = Number.parseInt(digits, 10);
  return Number.isFinite(value) ? value : null;
}

/**
 * Menyelesaikan URL audio Jilid 6 untuk sebuah soal.
 *
 * Berbeda dari Jilid 1-5, audio Jilid 6 disusun per ayat sehingga tidak bisa
 * memakai `PAGE_SHAPES`. Fungsi ini memakai pemetaan per halaman yang dibangun
 * dari berkas nyata. Soal tanpa klip (mis. basmalah pembuka) menghasilkan `""`.
 *
 * @param jilid Nomor jilid; hanya `6` yang didukung.
 * @param pageNumber Nomor halaman Jilid 6.
 * @param questionIndex Indeks soal pada halaman tersebut.
 * @param arabic Teks Arab soal (dipakai untuk validasi).
 * @returns URL audio lengkap, atau `""` bila tidak tersedia.
 */
export function getJilid6AudioUrl(
  jilid: number,
  pageNumber: number,
  questionIndex: number,
  arabic: string,
): string {
  if (jilid !== 6 || !arabic) return "";
  const file = JILID_6_AUDIO_FILES[pageNumber]?.[questionIndex];
  if (!file) return "";
  // Berkas berada di `hal{N}/hal{N}-{Surah}-ayat{K}.ogg` (nama berkas memuat awalan `hal{N}-`).
  return `/audio/tilawati/jilid_6/hal${pageNumber}/hal${pageNumber}-${file}.ogg`;
}
