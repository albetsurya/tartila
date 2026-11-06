/**
 * Design tokens Neo-Brutalism Lite untuk panel admin Tartila.
 *
 * Semua warna di-hardcode (HEX) sesuai spesifikasi karena tailwind.config.js
 * tidak tersedia. Setiap konstanta di bawah adalah string class Tailwind
 * LENGKAP (bukan hasil rakitan), supaya JIT Tailwind dapat mendeteksinya.
 *
 * Token:
 *   Deep Teal   #134E4A  border & teks
 *   Teal        #0D9488  aksi utama
 *   Coral       #FF6B6B  bahaya / hapus
 *   Amber       #F59E0B  peringatan / sorotan
 *   Mint        #F0FDF4  latar halaman
 *   Surface     #FFFFFF  kartu
 */

/* ── Latar & kartu ───────────────────────────────────────────── */

export const PAGE_BG = "bg-[#F0FDF4]";

/** Kartu / kontainer utama. */
export const CARD =
  "bg-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] rounded-2xl";

/** Kartu sekunder (di dalam kartu) — border & shadow lebih kecil. */
export const CARD_SM =
  "bg-white border-[2px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] rounded-xl";

/** Panel datar di dalam kartu (tanpa shadow). */
export const PANEL =
  "bg-[#F0FDF4] border-[2px] border-[#134E4A]/20 rounded-xl";

/* ── Tipografi ───────────────────────────────────────────────── */

export const TITLE = "font-display font-black text-[#134E4A]";
export const PAGE_TITLE = `${TITLE} text-xl sm:text-2xl`;
export const PAGE_SUBTITLE = "mt-1 text-xs sm:text-sm font-sans font-bold text-[#134E4A]/70";
export const SECTION_TITLE =
  "font-display text-xs font-black uppercase tracking-wider text-[#134E4A]";
export const MUTED = "text-[#134E4A]/70 font-bold";

/* ── Tombol ──────────────────────────────────────────────────── */

export const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all font-bold disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_#134E4A]";

export const BTN_MD = "px-4 py-2 text-sm";
export const BTN_SM = "px-3 py-1.5 text-xs";
export const BTN_ICON = "p-2";
export const BTN_ICON_XS = "p-1.5";

export const BTN_PRIMARY_COLOR = "bg-[#0D9488] text-white hover:bg-[#0F766E]";
export const BTN_DANGER_COLOR = "bg-[#FF6B6B] text-white hover:bg-[#EF4444]";
export const BTN_SECONDARY_COLOR = "bg-[#FFFFFF] text-[#134E4A] hover:bg-gray-100";
export const BTN_WARNING_COLOR = "bg-[#F59E0B] text-[#134E4A] hover:bg-[#D97706]";

/** Siap pakai: ukuran sedang. */
export const BTN_PRIMARY = `${BTN_BASE} ${BTN_MD} ${BTN_PRIMARY_COLOR}`;
export const BTN_DANGER = `${BTN_BASE} ${BTN_MD} ${BTN_DANGER_COLOR}`;
export const BTN_SECONDARY = `${BTN_BASE} ${BTN_MD} ${BTN_SECONDARY_COLOR}`;

/** Siap pakai: ukuran kecil (aksi di dalam baris / kartu). */
export const BTN_PRIMARY_SM = `${BTN_BASE} ${BTN_SM} ${BTN_PRIMARY_COLOR}`;
export const BTN_DANGER_SM = `${BTN_BASE} ${BTN_SM} ${BTN_DANGER_COLOR}`;
export const BTN_SECONDARY_SM = `${BTN_BASE} ${BTN_SM} ${BTN_SECONDARY_COLOR}`;
export const BTN_WARNING_SM = `${BTN_BASE} ${BTN_SM} ${BTN_WARNING_COLOR}`;

/** Tombol ikon persegi (edit / hapus / refresh). */
export const BTN_ICON_SECONDARY = `${BTN_BASE} ${BTN_ICON} ${BTN_SECONDARY_COLOR}`;
export const BTN_ICON_DANGER = `${BTN_BASE} ${BTN_ICON} ${BTN_DANGER_COLOR}`;

/** Tombol segmen / filter (aktif = Teal, nonaktif = putih). */
export const CHIP_BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border-[2px] border-[#134E4A] px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap";
export const CHIP_ACTIVE =
  `${CHIP_BASE} bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A]`;
export const CHIP_IDLE =
  `${CHIP_BASE} bg-white text-[#134E4A] hover:bg-[#F0FDF4]`;

/* ── Form ────────────────────────────────────────────────────── */

const INPUT_COMMON =
  "rounded-xl border-[2.5px] border-[#134E4A] bg-white font-bold text-[#134E4A] placeholder:text-[#134E4A]/40 shadow-[2px_2px_0px_#134E4A] focus:outline-none focus:ring-4 focus:ring-[#0D9488]/30 disabled:opacity-60";

/** <input>, <select>, <textarea> standar. */
export const INPUT = `${INPUT_COMMON} w-full px-3 py-2 text-sm`;
/** Input dengan ikon di kiri (kolom pencarian). */
export const INPUT_ICON = `${INPUT_COMMON} w-full py-2 pl-9 pr-8 text-sm`;
/** <select> dengan chevron kustom di kanan. */
export const SELECT = `${INPUT_COMMON} w-full appearance-none py-2 pl-3 pr-9 text-sm`;

/** Varian ringkas untuk filter / sel tabel (lebar mengikuti isi). */
export const INPUT_SM = `${INPUT_COMMON} px-2.5 py-1 text-xs`;
export const SELECT_SM = `${INPUT_COMMON} w-full appearance-none py-1.5 pl-3 pr-8 text-xs`;
/** Input angka sempit (kolom urutan). */
export const INPUT_NUM = `${INPUT_COMMON} w-16 px-1 py-1 text-center text-xs`;
export const LABEL = "text-xs font-black uppercase text-[#134E4A] mb-1 block";

/* ── Tabel ───────────────────────────────────────────────────── */

export const TABLE_WRAP =
  "border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] rounded-2xl bg-white overflow-hidden";
export const TH =
  "bg-[#F0FDF4] border-b-[3px] border-[#134E4A] text-[#134E4A] font-black uppercase text-xs tracking-wide";
/** Baris data: hanya garis tipis (JANGAN tambah border tebal / shadow). */
export const TR = "border-b border-[#134E4A]/20 last:border-b-0 hover:bg-[#F0FDF4]/70 transition-colors";
export const TD = "text-[#134E4A] font-bold";

/** Daftar berbaris (div) dengan garis pemisah tipis, setara tabel. */
export const LIST_ROW =
  "border-b border-[#134E4A]/20 last:border-b-0 hover:bg-[#F0FDF4]/70 transition-colors";

/* ── Badge ───────────────────────────────────────────────────── */

const BADGE_BASE =
  "inline-flex items-center gap-1.5 rounded-lg border-2 border-[#134E4A] px-2.5 py-0.5 text-[11px] font-black text-[#134E4A] shadow-[1px_1px_0px_#134E4A]";
export const BADGE_SUCCESS = `${BADGE_BASE} bg-[#99F6E4]`;
export const BADGE_WARNING = `${BADGE_BASE} bg-[#F59E0B]`;
export const BADGE_DANGER = `${BADGE_BASE} bg-[#FF6B6B]`;
export const BADGE_NEUTRAL = `${BADGE_BASE} bg-white`;
export const BADGE_INFO = `${BADGE_BASE} bg-[#F0FDF4]`;

/* ── Lain-lain ───────────────────────────────────────────────── */

export const TOAST =
  "fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border-[2.5px] border-[#134E4A] bg-[#0D9488] px-4 py-2.5 text-xs font-bold text-white shadow-[3px_3px_0px_#134E4A]";

export const ALERT_DANGER =
  "flex items-start gap-2.5 rounded-xl border-[2.5px] border-[#134E4A] bg-[#FF6B6B]/15 p-3 text-xs font-bold text-[#134E4A] shadow-[2px_2px_0px_#134E4A]";

/** Kotak ikon persegi (avatar / ikon kartu). */
export const ICON_BOX =
  "flex shrink-0 items-center justify-center rounded-xl border-[2px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]";

export const MODAL_OVERLAY =
  "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#134E4A]/60 p-3 backdrop-blur-sm sm:p-4";
export const MODAL_PANEL =
  "relative w-full bg-white border-[3px] border-[#134E4A] shadow-[6px_6px_0px_#134E4A] rounded-2xl overflow-hidden";
