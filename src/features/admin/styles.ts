/**
 * Design tokens Neo-Brutalism (kuning, tinta hitam, krem) untuk panel admin Tartila.
 *
 * Semua warna di-hardcode (HEX) karena tailwind.config.js tidak tersedia.
 * Setiap konstanta di bawah adalah string class Tailwind LENGKAP (bukan hasil
 * rakitan), supaya JIT Tailwind dapat mendeteksinya.
 *
 * Token:
 *   Ink     #1A1A1A  border & teks
 *   Yellow  #FFD60A  aksi utama / latar halaman bertitik
 *   Cream   #FFFBF2  kartu    (#FFF4DC untuk panel & header tabel)
 *   Orange  #FF9F1C  peringatan
 *   Coral   #FF6B6B  bahaya / hapus
 *   Green   #9BE58B  sukses
 *   Blue    #2F6FED  tautan / aksen sekunder
 */

/* ── Latar & kartu ───────────────────────────────────────────── */

/** Latar halaman: kuning bertitik (class `admin-dots` ada di admin.css). */
export const PAGE_BG = "admin-dots";

/** Kartu / kontainer utama. */
export const CARD =
  "bg-[#FFFBF2] border-[3px] border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] rounded-2xl";

/** Kartu sekunder (di dalam kartu) — border & shadow lebih kecil. */
export const CARD_SM =
  "bg-[#FFFBF2] border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] rounded-xl";

/** Panel datar di dalam kartu (tanpa shadow). */
export const PANEL =
  "bg-[#FFF4DC] border-[2px] border-[#1A1A1A]/20 rounded-xl";

/* ── Tipografi ───────────────────────────────────────────────── */

export const TITLE = "font-display font-black text-[#1A1A1A]";
export const PAGE_TITLE = `${TITLE} text-xl sm:text-2xl`;
export const PAGE_SUBTITLE = "mt-1 text-xs sm:text-sm font-sans font-bold text-[#1A1A1A]/70";
export const SECTION_TITLE =
  "font-display text-xs font-black uppercase tracking-wider text-[#1A1A1A]";
export const MUTED = "text-[#1A1A1A]/70 font-bold";

/* ── Tombol ──────────────────────────────────────────────────── */

export const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border-[2.5px] border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] active:translate-y-[2px] active:shadow-none transition-all font-bold disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_#1A1A1A]";

export const BTN_MD = "px-4 py-2 text-sm";
export const BTN_SM = "px-3 py-1.5 text-xs";
export const BTN_ICON = "p-2";
export const BTN_ICON_XS = "p-1.5";

export const BTN_PRIMARY_COLOR = "bg-[#FFD60A] text-[#1A1A1A] hover:bg-[#F5C400]";
export const BTN_DANGER_COLOR = "bg-[#FF6B6B] text-[#1A1A1A] hover:bg-[#F25555]";
export const BTN_SECONDARY_COLOR = "bg-[#FFFBF2] text-[#1A1A1A] hover:bg-[#FFF4DC]";
export const BTN_WARNING_COLOR = "bg-[#FF9F1C] text-[#1A1A1A] hover:bg-[#E58A00]";

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
  "inline-flex items-center justify-center gap-1.5 rounded-full border-[2px] border-[#1A1A1A] px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap";
export const CHIP_ACTIVE =
  `${CHIP_BASE} bg-[#FFD60A] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]`;
export const CHIP_IDLE =
  `${CHIP_BASE} bg-[#FFFBF2] text-[#1A1A1A] hover:bg-[#FFF4DC]`;

/* ── Form ────────────────────────────────────────────────────── */

const INPUT_BASE =
  "border-[2.5px] border-[#1A1A1A] bg-[#FFFBF2] font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 shadow-[2px_2px_0px_#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#FFD60A]/70 disabled:opacity-60";

const INPUT_COMMON = `rounded-xl ${INPUT_BASE}`;

/** <input>, <select>, <textarea> standar. */
export const INPUT = `${INPUT_COMMON} w-full px-3 py-2 text-sm`;
/** Input dengan ikon di kiri (kolom pencarian). */
export const INPUT_ICON = `rounded-full ${INPUT_BASE} w-full py-2 pl-10 pr-9 text-sm`;
/** <select> dengan chevron kustom di kanan. */
export const SELECT = `${INPUT_COMMON} w-full appearance-none py-2 pl-3 pr-9 text-sm`;

/** Varian ringkas untuk filter / sel tabel (lebar mengikuti isi). */
export const INPUT_SM = `${INPUT_COMMON} px-2.5 py-1 text-xs`;
export const SELECT_SM = `${INPUT_COMMON} w-full appearance-none py-1.5 pl-3 pr-8 text-xs`;
/** Input angka sempit (kolom urutan). */
export const INPUT_NUM = `${INPUT_COMMON} w-16 px-1 py-1 text-center text-xs`;
export const LABEL = "text-xs font-black uppercase text-[#1A1A1A] mb-1 block";

/* ── Tabel ───────────────────────────────────────────────────── */

export const TABLE_WRAP =
  "border-[3px] border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] rounded-2xl bg-[#FFFBF2] overflow-hidden";
export const TH =
  "bg-[#FFF4DC] border-b-[3px] border-[#1A1A1A] text-[#1A1A1A] font-black uppercase text-xs tracking-wide";
/** Baris data: hanya garis tipis (JANGAN tambah border tebal / shadow). */
export const TR = "border-b border-[#1A1A1A]/20 last:border-b-0 hover:bg-[#FFF4DC]/70 transition-colors";
export const TD = "text-[#1A1A1A] font-bold";

/** Daftar berbaris (div) dengan garis pemisah tipis, setara tabel. */
export const LIST_ROW =
  "border-b border-[#1A1A1A]/20 last:border-b-0 hover:bg-[#FFF4DC]/70 transition-colors";

/* ── Badge ───────────────────────────────────────────────────── */

const BADGE_BASE =
  "inline-flex items-center gap-1.5 rounded-full border-2 border-[#1A1A1A] px-2.5 py-0.5 text-[11px] font-black text-[#1A1A1A] shadow-[1px_1px_0px_#1A1A1A]";
export const BADGE_SUCCESS = `${BADGE_BASE} bg-[#9BE58B]`;
export const BADGE_WARNING = `${BADGE_BASE} bg-[#FF9F1C]`;
export const BADGE_DANGER = `${BADGE_BASE} bg-[#FF6B6B]`;
export const BADGE_NEUTRAL = `${BADGE_BASE} bg-[#FFFBF2]`;
export const BADGE_INFO = `${BADGE_BASE} bg-[#FFF4DC]`;

/* ── Lain-lain ───────────────────────────────────────────────── */

export const TOAST =
  "fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border-[2.5px] border-[#1A1A1A] bg-[#FFD60A] px-4 py-2.5 text-xs font-bold text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]";

export const ALERT_DANGER =
  "flex items-start gap-2.5 rounded-xl border-[2.5px] border-[#1A1A1A] bg-[#FF6B6B]/15 p-3 text-xs font-bold text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]";

/** Kotak ikon persegi (avatar / ikon kartu). */
export const ICON_BOX =
  "flex shrink-0 items-center justify-center rounded-xl border-[2px] border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]";

export const MODAL_OVERLAY =
  "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1A1A1A]/60 p-3 backdrop-blur-sm sm:p-4";
export const MODAL_PANEL =
  "relative w-full bg-[#FFFBF2] border-[3px] border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A] rounded-2xl overflow-hidden";

/* ── Dekorasi & avatar (gaya referensi) ──────────────────────── */

/** Avatar bulat dengan border tinta. Tambahkan ukuran & warna latar sendiri. */
export const AVATAR =
  "flex shrink-0 items-center justify-center rounded-full border-[2px] border-[#1A1A1A] font-black text-[#1A1A1A]";

/** Pil kecil di header (mis. "Mode Member"). */
export const PILL_YELLOW =
  "inline-flex items-center gap-1.5 rounded-full border-[2px] border-[#1A1A1A] bg-[#FFD60A] px-3 py-1 text-[11px] font-black text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] transition-all hover:bg-[#F5C400] active:translate-y-[2px] active:shadow-none";

/** Warna kotak ikon bergilir untuk daftar menu. */
export const TILE_COLORS = [
  "bg-[#FFD60A]",
  "bg-[#9BE58B]",
  "bg-[#8FB8FF]",
  "bg-[#FF6B6B]",
  "bg-[#FF9F1C]",
] as const;
