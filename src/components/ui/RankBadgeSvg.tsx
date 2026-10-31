import React from "react";
import {
  RANKS,
  type RankId,
} from "../../features/ngaji-ceria/pages/games/_shared/progression";

export type { RankId };

export interface RankDef {
  id: RankId;
  label: string;
  xp: number;
  color: string;
  darkFill: string;
}

const getHex = (cls: string, fallback: string): string => {
  const match = cls.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0] : fallback;
};

/** Konversi RANKS dari progression.ts (SSOT) ke array RankDef */
export const MappedRanks: RankDef[] = RANKS.map((rank) => ({
  id: rank.id as RankId,
  label: rank.title,
  xp: rank.minXp,
  color: getHex(rank.color, "#FEF08A"),
  darkFill: getHex(rank.text, "#D97706"),
}));

/** Helper: dapatkan info rank berdasarkan ID */
export function useRankInfo(rankId: RankId | string) {
  const rank =
    RANKS.find((r) => r.id === rankId || r.title.toLowerCase().replace(/\s+/g, "-") === rankId.toLowerCase());
  return {
    title: rank?.title ?? "Pejuang",
    minXp: rank?.minXp ?? 0,
    nextXp: rank?.nextXp ?? null,
  };
}

/** Komponen SVG Rank Badge bergaya Neo-Brutalism (2D Vector, Bold Outlines, Hard Shadows). */
export default function RankBadgeSvg({
  rankId = "pejuang",
  size = 48,
  isLocked = false,
  isActive = false,
  className = "",
}: { rankId?: RankId | string; size?: number | string; isLocked?: boolean; isActive?: boolean } & { className?: string }) {
  const s = typeof size === "number" ? size : Number(size) || 48;
  // Di dalam viewBox 128x128, ketebalan garis 4.5px memberikan proporsi Neo-Brutalism yang tegas di semua ukuran layar
  const sw = 4.5;
  const active = isActive && !isLocked;

  const currentRank =
    MappedRanks.find(
      (r) => r.id === rankId || (rankId === "legenda" && r.id === "legenda-tartila")
    ) || MappedRanks[0];
  const bgFill = isLocked ? "#94A3B8" : currentRank.color;
  const subFill = isLocked ? "#94A3B8" : currentRank.darkFill;

  // Helper warna: otomatis mengubah warna ke palet grayscale jika status badge terkunci (isLocked)
  const c = (hex: string, lockedFallback = "#E2E8F0") =>
    isLocked ? lockedFallback : hex;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Pangkat ${currentRank.label}${isLocked ? " (Terkunci)" : ""}`}
    >
      {/* 1. HARD DROP SHADOW UTAMA (NEO-BRUTALISM) */}
      <circle cx="64" cy="70" r="54" fill={active ? "#F59E0B" : "#134E4A"} />
      {active && (
        <circle cx="64" cy="70" r="54" stroke="#134E4A" strokeWidth={sw} />
      )}

      {/* 2. RING LUAR MEDALI (PUTIH SOLID / ORANYE AKTIF) */}
      <circle
        cx="64"
        cy="62"
        r="54"
        fill={isLocked ? "#94A3B8" : "#FFFFFF"}
        stroke="#134E4A"
        strokeWidth={sw}
      />

      {/* Ornamen Baut / Rivet ala Medali Game di Ring Luar */}
      <circle cx="18" cy="62" r="3" fill="#134E4A" />
      <circle cx="110" cy="62" r="3" fill="#134E4A" />
      <circle cx="64" cy="16" r="3" fill="#134E4A" />

      {/* 3. BACKGROUND DALAM MEDALI */}
      <circle
        cx="64"
        cy="62"
        r="44"
        fill={bgFill}
        stroke="#134E4A"
        strokeWidth={sw}
      />

      {/* Aksen Shadow Interior Medali */}
      <path
        d="M 30 35 A 42 42 0 0 1 98 35"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        opacity={isLocked ? 0.3 : 0.7}
      />
      <path
        d="M 28 84 A 42 42 0 0 0 100 84"
        stroke={subFill}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 4. ILUSTRASI EMBLEM SPESIFIK TIAP PANGKAT */}
      <g>
        {/* =========================================================
            1. PEJUANG: Perisai kayu sederhana + bintang kecil + bulu
         ========================================================= */}
        {rankId === "pejuang" && (
          <>
            {/* Hard Shadow */}
            <path
              d="M42 42 H86 V64 C86 84 64 96 64 96 C64 96 42 84 42 64 Z"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            {/* Bulu Kecil di Kanan Atas */}
            <path
              d="M78 44 C86 30 98 26 102 30 C98 38 90 46 80 48 Z"
              fill={c("#34D399", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M80 46 L94 34"
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Bodi Perisai Kayu */}
            <path
              d="M42 42 H86 V64 C86 84 64 96 64 96 C64 96 42 84 42 64 Z"
              fill={c("#D97706", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Garis Papan Kayu */}
            <line
              x1="54"
              y1="42"
              x2="54"
              y2="89"
              stroke="#134E4A"
              strokeWidth="3"
            />
            <line
              x1="74"
              y1="42"
              x2="74"
              y2="89"
              stroke="#134E4A"
              strokeWidth="3"
            />
            {/* Bintang Kecil di Tengah */}
            <polygon
              points="64,50 68,58 77,59 70,65 72,74 64,69 56,74 58,65 51,59 60,58"
              fill={c("#FEF08A", "#F1F5F9")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* =========================================================
            2. PENJELAJAH: Kompas kuningan + jarum zamrud menyala
         ========================================================= */}
        {rankId === "penjelajah" && (
          <>
            {/* Hard Shadow */}
            <circle cx="64" cy="69" r="28" fill="#134E4A" />
            {/* Gantungan Kompas di Atas */}
            <rect
              x="57"
              y="26"
              width="14"
              height="10"
              rx="4"
              fill={c("#F59E0B", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
            />
            {/* Bodi Kuningan Kompas */}
            <circle
              cx="64"
              cy="64"
              r="28"
              fill={c("#F59E0B", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
            />
            {/* Dalam Kompas */}
            <circle
              cx="64"
              cy="64"
              r="21"
              fill={c("#FFFBEB", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3.5"
            />
            {/* Titik Arah Mata Angin */}
            <line
              x1="64"
              y1="43"
              x2="64"
              y2="48"
              stroke="#134E4A"
              strokeWidth="3"
            />
            <line
              x1="64"
              y1="80"
              x2="64"
              y2="85"
              stroke="#134E4A"
              strokeWidth="3"
            />
            <line
              x1="43"
              y1="64"
              x2="48"
              y2="64"
              stroke="#134E4A"
              strokeWidth="3"
            />
            <line
              x1="80"
              y1="64"
              x2="85"
              y2="64"
              stroke="#134E4A"
              strokeWidth="3"
            />
            {/* Jarum Zamrud (Emerald Needle) */}
            <polygon
              points="78,50 68,68 60,60"
              fill={c("#10B981", "#64748B")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <polygon
              points="50,78 68,68 60,60"
              fill={c("#FFFFFF", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <circle cx="64" cy="64" r="3.5" fill="#134E4A" />
          </>
        )}

        {/* =========================================================
            3. PEMBURU: Panah tajam menembus target cincin emas
         ========================================================= */}
        {rankId === "pemburu" && (
          <>
            {/* Hard Shadow Target */}
            <circle cx="64" cy="69" r="26" fill="#134E4A" />
            {/* Cincin Target Emas */}
            <circle
              cx="64"
              cy="64"
              r="26"
              fill={c("#F59E0B", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
            />
            <circle
              cx="64"
              cy="64"
              r="17"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3.5"
            />
            {/* Titik Bullseye */}
            <circle
              cx="64"
              cy="64"
              r="9"
              fill={c("#EF4444", "#64748B")}
              stroke="#134E4A"
              strokeWidth="3.5"
            />
            {/* Bulu Anak Panah (Kiri Bawah) */}
            <polygon
              points="32,88 26,98 38,94 42,102 48,92 40,86"
              fill={c("#10B981", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Batang Anak Panah Menembus Target */}
            <line
              x1="36"
              y1="92"
              x2="88"
              y2="40"
              stroke="#134E4A"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Mata Panah Tajam (Kanan Atas) */}
            <polygon
              points="96,32 76,38 82,44 90,52"
              fill={c("#E2E8F0", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* =========================================================
            4. PENAKLUK: Bendera megah berkibar di atas menara batu
         ========================================================= */}
        {rankId === "penakluk" && (
          <>
            {/* Hard Shadow Menara */}
            <path
              d="M42 62 H86 V96 H42 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            {/* Tiang Bendera */}
            <line
              x1="54"
              y1="26"
              x2="54"
              y2="56"
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinecap="round"
            />
            {/* Bendera Berkibar */}
            <path
              d="M54 28 L92 34 L82 43 L92 50 L54 50 Z"
              fill={c("#EF4444", "#64748B")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Bodi Menara Batu */}
            <path
              d="M46 62 H82 L86 94 H42 Z"
              fill={c("#94A3B8", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Puncak Gerigi Benteng (Battlements) */}
            <path
              d="M38 52 H48 V58 H58 V52 H70 V58 H80 V52 H90 V64 H38 Z"
              fill={c("#CBD5E1", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Gerbang Menara */}
            <path d="M57 94 V78 C57 73 71 73 71 78 V94 Z" fill="#134E4A" />
          </>
        )}

        {/* =========================================================
            5. KSATRIA: Helm ksatria + celah visor hijau menyala + crest bintang
         ========================================================= */}
        {rankId === "ksatria" && (
          <>
            {/* Hard Shadow Helm */}
            <path
              d="M40 52 C40 34 88 34 88 52 V82 L64 96 L40 82 Z"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            {/* Jambul/Plume di Atas Helm */}
            <path
              d="M56 36 C56 22 72 22 72 36 Z"
              fill={c("#F59E0B", "#64748B")}
              stroke="#134E4A"
              strokeWidth={sw}
            />
            {/* Bodi Utama Helm Besi */}
            <path
              d="M40 52 C40 34 88 34 88 52 V80 L64 94 L40 80 Z"
              fill={c("#94A3B8", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Pelindung Wajah (Faceplate) */}
            <path
              d="M40 62 L64 70 L88 62 V80 L64 94 L40 80 Z"
              fill={c("#64748B", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Celah Visor Hijau Menyala (Glowing Green Visor) */}
            <polygon
              points="45,56 64,63 83,56 80,65 64,71 48,65"
              fill={c("#10B981", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Garis Vertikal Tengah Helm */}
            <line
              x1="64"
              y1="71"
              x2="64"
              y2="93"
              stroke="#134E4A"
              strokeWidth="4"
            />
            {/* Crest Bintang Kecil di Dahi */}
            <polygon
              points="64,39 66,44 72,44 67,47 69,52 64,49 59,52 56,44 62,44"
              fill={c("#FEF08A", "#F1F5F9")}
              stroke="#134E4A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* =========================================================
            6. MASTER: Bintang 5 sudut tajam emas solid + inner teal star
         ========================================================= */}
        {rankId === "master" && (
          <>
            {/* Hard Shadow Bintang */}
            <polygon
              points="64,29 74,51 98,53 80,69 85,93 64,80 43,93 48,69 30,53 54,51"
              fill="#134E4A"
            />
            {/* Bintang Emas Besar */}
            <polygon
              points="64,23 74,45 98,47 80,63 85,87 64,74 43,87 48,63 30,47 54,45"
              fill={c("#F59E0B", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Bintang Teal di Dalam (Inner Teal Star) */}
            <polygon
              points="64,38 69,50 82,51 72,60 75,73 64,66 53,73 56,60 46,51 59,50"
              fill={c("#14B8A6", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Inti Cahaya Putih */}
            <circle cx="64" cy="57" r="4" fill="#FFFFFF" />
          </>
        )}

        {/* =========================================================
            7. GRANDMASTER: Permata berlian potongan geometris tajam (Teal & White)
         ========================================================= */}
        {rankId === "grandmaster" && (
          <>
            {/* Hard Shadow Berlian */}
            <polygon points="46,41 82,41 96,59 64,97 32,59" fill="#134E4A" />
            {/* Bodi Utama Berlian */}
            <polygon
              points="46,35 82,35 96,53 64,91 32,53"
              fill={c("#2DD4BF", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Facet Atas Tengah (Putih Bersinar) */}
            <polygon
              points="46,35 82,35 74,53 54,53"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Facet Kiri Atas */}
            <polygon
              points="32,53 46,35 54,53"
              fill={c("#99F6E4", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* FacetBawah Tengah */}
            <polygon
              points="54,53 74,53 64,91"
              fill={c("#14B8A6", "#64748B")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Facet Bawah Kiri */}
            <polygon
              points="32,53 54,53 64,91"
              fill={c("#5EEAD4", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* =========================================================
            8. PAHLAWAN: Medali bersayap heroik + bulan sabit + pedang
         ========================================================= */}
        {rankId === "pahlawan" && (
          <>
            {/* Hard Shadow Sayap & Perisai */}
            <path
              d="M22 48 L44 58 L44 78 L26 70 Z M106 48 L84 58 L84 78 L102 70 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            {/* Sayap Kiri */}
            <path
              d="M20 44 L46 52 V76 L26 68 L32 60 L22 56 L30 50 Z"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Sayap Kanan */}
            <path
              d="M108 44 L82 52 V76 L102 68 L96 60 L106 56 L98 50 Z"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Gagang & Bilah Pedang Vertikal */}
            <line
              x1="64"
              y1="24"
              x2="64"
              y2="96"
              stroke="#134E4A"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <line
              x1="52"
              y1="36"
              x2="76"
              y2="36"
              stroke="#134E4A"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Medali Emas di Tengah */}
            <circle
              cx="64"
              cy="64"
              r="20"
              fill={c("#F59E0B", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
            />
            {/* Bulan Sabit di Tengah Medali */}
            <path
              d="M68 53 A 11 11 0 1 0 68 75 A 8 8 0 1 1 68 53 Z"
              fill={c("#FEF08A", "#F1F5F9")}
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* =========================================================
            9. LEGENDA: Mahkota raja agung 3 puncak tajam + permata ruby
         ========================================================= */}
        {rankId === "legenda" && (
          <>
            {/* Hard Shadow Mahkota */}
            <polygon
              points="28,46 42,84 86,84 100,46 78,62 64,34 50,62"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            {/* Bodi Mahkota Emas */}
            <polygon
              points="28,44 40,82 88,82 100,44 78,60 64,32 50,60"
              fill={c("#FCD34D", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Sabuk Dasar Mahkota */}
            <rect
              x="38"
              y="74"
              width="52"
              height="10"
              rx="3"
              fill={c("#D97706", "#64748B")}
              stroke="#134E4A"
              strokeWidth={sw}
            />
            {/* Permata Ruby Merah di Tengah */}
            <polygon
              points="64,52 72,62 64,72 56,62"
              fill={c("#EF4444", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Ornamen Mutiara di Puncak */}
            <circle
              cx="64"
              cy="28"
              r="4"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3"
            />
            <circle
              cx="27"
              cy="41"
              r="3.5"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3"
            />
            <circle
              cx="101"
              cy="41"
              r="3.5"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3"
            />
          </>
        )}

        {/* =========================================================
            10. LEGENDA TARTILA: Al-Quran bercahaya + sayap malaikat lebar + kilauan
         ========================================================= */}
        {rankId === "legenda-tartila" && (
          <>
            {/* Hard Shadow Sayap & Kitab */}
            <path
              d="M18 44 L44 54 V78 L22 68 Z M110 44 L84 54 V78 L106 68 Z"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            {/* Sayap Malaikat Lebar (Kiri & Kanan) */}
            <path
              d="M16 40 L46 50 V76 L20 68 L28 58 L18 52 L26 46 Z"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M112 40 L82 50 V76 L108 68 L100 58 L110 52 L102 46 Z"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Sampul Emas Kitab Suci (Shadow) */}
            <path
              d="M36 52 L64 60 L92 52 V84 L64 92 L36 84 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            {/* Sampul Emas Kitab Suci */}
            <path
              d="M36 50 L64 58 L92 50 V82 L64 90 L36 82 Z"
              fill={c("#F59E0B", "#64748B")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Lembaran Halaman Kitab Terbuka */}
            <path
              d="M40 44 L64 52 L88 44 V74 L64 82 L40 74 Z"
              fill={c("#FEF9C3", "#F1F5F9")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {/* Lipatan Tengah Buku */}
            <line
              x1="64"
              y1="52"
              x2="64"
              y2="82"
              stroke="#134E4A"
              strokeWidth={sw}
            />
            {/* Garis Ayat / Kaligrafi Simbolis */}
            <line
              x1="46"
              y1="56"
              x2="58"
              y2="60"
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="46"
              y1="64"
              x2="58"
              y2="68"
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="82"
              y1="56"
              x2="70"
              y2="60"
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="82"
              y1="64"
              x2="70"
              y2="68"
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Cahaya & Sparkles di Atas Al-Quran */}
            <polygon
              points="64,20 67,29 76,32 67,35 64,44 61,35 52,32 61,29"
              fill={c("#FEF08A", "#FFFFFF")}
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle
              cx="44"
              cy="30"
              r="3"
              fill={c("#FEF08A", "#FFFFFF")}
              stroke="#134E4A"
              strokeWidth="2.5"
            />
            <circle
              cx="84"
              cy="30"
              r="3"
              fill={c("#FEF08A", "#FFFFFF")}
              stroke="#134E4A"
              strokeWidth="2.5"
            />
          </>
        )}

        {/* =========================================================
            11. PENGEMBARA: Topi petualang + peta gulung
         ========================================================= */}
        {rankId === "pengembara" && (
          <>
            <path
              d="M26 68 Q34 43 64 39 Q94 43 102 68 L110 76 Q64 66 18 76 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            <path
              d="M39 60 Q42 33 64 29 Q86 33 89 60 L101 70 Q64 63 27 70 Z"
              fill={c("#B45309", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M25 66 Q64 53 103 66 L110 75 Q64 64 18 75 Z"
              fill={c("#D6A66F", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M40 57 Q64 65 88 57"
              stroke="#134E4A"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M44 78 L83 78 L83 94 Q64 101 44 94 Z"
              fill={c("#FEF3C7", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M52 83 L72 83 M52 89 L66 89"
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M43 78 C36 78 36 94 44 94 M83 78 C91 78 91 94 83 94"
              fill="none"
              stroke="#134E4A"
              strokeWidth={sw}
            />
            <path
              d="M73 82 L77 86 L73 90"
              fill="none"
              stroke={c("#0D9488", "#64748B")}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* =========================================================
            12. PENGAWAL: Pedang bersilang + perisai segi enam
         ========================================================= */}
        {rankId === "pengawal" && (
          <>
            <g
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <path
                d="M28 31 L91 94 L83 102 L20 39 Z"
                fill="#134E4A"
                transform="translate(0, 4)"
              />
              <path
                d="M100 31 L37 94 L45 102 L108 39 Z"
                fill="#134E4A"
                transform="translate(0, 4)"
              />
              <path
                d="M28 25 L92 89 L84 97 L20 33 Z"
                fill={c("#E2E8F0", "#CBD5E1")}
              />
              <path
                d="M100 25 L36 89 L44 97 L108 33 Z"
                fill={c("#BFDBFE", "#CBD5E1")}
              />
              <path
                d="M20 28 L37 34 L31 51 L14 45 Z"
                fill={c("#F59E0B", "#94A3B8")}
              />
              <path
                d="M108 28 L91 34 L97 51 L114 45 Z"
                fill={c("#F59E0B", "#94A3B8")}
              />
              <path
                d="M64 36 L91 48 L96 72 L64 96 L32 72 L37 48 Z"
                fill="#134E4A"
                transform="translate(0, 4)"
              />
              <path
                d="M64 32 L91 44 L96 68 L64 92 L32 68 L37 44 Z"
                fill={c("#60A5FA", "#94A3B8")}
              />
              <path
                d="M64 48 L69 60 L82 61 L72 70 L75 82 L64 75 L53 82 L56 70 L46 61 L59 60 Z"
                fill={c("#FEF08A", "#E2E8F0")}
              />
            </g>
          </>
        )}

        {/* =========================================================
            13. PRAJURIT ELITE: Tombak perak + pita merah
         ========================================================= */}
        {rankId === "prajurit-elite" && (
          <>
            <path
              d="M64 39 L70 87 L64 98 L58 87 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            <path
              d="M64 34 L69 88 L64 96 L59 88 Z"
              fill={c("#CBD5E1", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M64 22 L82 51 L64 61 L46 51 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            <path
              d="M64 18 L82 47 L64 57 L46 47 Z"
              fill={c("#E2E8F0", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M64 23 L64 51"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M65 49 C83 43 91 54 83 64 C77 72 68 66 75 60"
              fill="none"
              stroke="#134E4A"
              strokeWidth="9"
              strokeLinecap="round"
              transform="translate(0, 4)"
            />
            <path
              d="M65 45 C83 39 91 50 83 60 C77 68 68 66 75 56"
              fill="none"
              stroke={c("#EF4444", "#94A3B8")}
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M64 89 L64 105"
              stroke="#134E4A"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M52 91 L76 91"
              stroke="#134E4A"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </>
        )}

        {/* =========================================================
            14. BINTANG TERANG: Bintang enam ujung + sinar cahaya
         ========================================================= */}
        {rankId === "bintang-terang" && (
          <>
            <path
              d="M64 21 L77 46 L104 48 L84 66 L91 94 L64 80 L37 94 L44 66 L24 48 L51 46 Z"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            <polygon
              points="64,18 77,43 104,45 84,63 91,91 64,77 37,91 44,63 24,45 51,43"
              fill={c("#FDE047", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <polygon
              points="64,36 71,52 88,53 75,64 79,81 64,72 49,81 53,64 40,53 57,52"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M64 10 V20 M64 94 V106 M14 58 H25 M103 58 H114 M29 24 L37 32 M91 84 L99 92 M99 24 L91 32 M37 84 L29 92"
              stroke={c("#F59E0B", "#94A3B8")}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M64 43 L67 55 L79 58 L67 61 L64 73 L61 61 L49 58 L61 55 Z"
              fill={c("#FEF08A", "#F8FAFC")}
              stroke="#134E4A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* =========================================================
            15. PANGLIMA: Greatsword dengan gagang bersayap
         ========================================================= */}
        {rankId === "panglima" && (
          <>
            <path
              d="M64 19 L82 66 L64 84 L46 66 Z"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            <path
              d="M64 15 L82 62 L64 80 L46 62 Z"
              fill={c("#E2E8F0", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M64 19 L64 77"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M46 59 Q30 43 20 51 Q29 69 49 73 L64 67 L79 73 Q99 69 108 47 Q98 43 82 59 L64 62 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            <path
              d="M46 55 Q30 39 20 47 Q29 65 49 69 L64 63 L79 69 Q99 65 108 47 Q98 39 82 55 L64 58 Z"
              fill={c("#A78BFA", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M64 77 V101 M54 88 H74"
              stroke="#134E4A"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M64 96 L56 105 L72 105 Z"
              fill={c("#F59E0B", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <circle
              cx="64"
              cy="63"
              r="7"
              fill={c("#FEF08A", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3"
            />
          </>
        )}

        {/* =========================================================
            16. PAHLAWAN AGUNG: Elang emas bermahkota
         ========================================================= */}
        {rankId === "pahlawan-agung" && (
          <>
            <path
              d="M64 43 Q47 29 21 39 L39 65 L27 78 Q47 83 64 69 Q81 83 101 78 L89 65 L107 39 Q81 29 64 43 Z"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            <path
              d="M64 39 Q47 25 21 35 L39 61 L27 74 Q47 79 64 65 Q81 79 101 74 L89 61 L107 35 Q81 25 64 39 Z"
              fill={c("#F59E0B", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M31 43 L49 58 L43 69 M97 43 L79 58 L85 69"
              fill={c("#FEF3C7", "#E2E8F0")}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M64 41 C52 51 53 77 64 88 C75 77 76 51 64 41 Z"
              fill={c("#D97706", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M61 48 Q46 39 49 28 L64 39 L79 28 Q82 39 67 48 Z"
              fill={c("#FEF08A", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M64 49 L82 58 L67 62 Z"
              fill={c("#EF4444", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx="59" cy="54" r="2.5" fill="#134E4A" />
            <path
              d="M48 26 L54 17 L64 24 L74 17 L80 26"
              fill={c("#FDE047", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* =========================================================
            17. SANG JUARA: Piala emas + pita biru
         ========================================================= */}
        {rankId === "sang-juara" && (
          <>
            <path
              d="M43 35 H85 V56 Q85 77 64 81 Q43 77 43 56 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            <path
              d="M43 31 H85 V52 Q85 73 64 77 Q43 73 43 52 Z"
              fill={c("#FBBF24", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M43 38 H27 Q25 61 49 64 M85 38 H101 Q103 61 79 64"
              fill="none"
              stroke="#134E4A"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M43 35 H29 Q28 55 48 58 M85 35 H99 Q100 55 80 58"
              fill="none"
              stroke={c("#60A5FA", "#94A3B8")}
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M57 78 V91 H71 V78"
              fill={c("#D97706", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M43 91 H85 V101 H43 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            <path
              d="M43 87 H85 V97 H43 Z"
              fill={c("#F59E0B", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <polygon
              points="64,38 69,49 81,50 72,58 74,70 64,64 54,70 56,58 47,50 59,49"
              fill={c("#FFFFFF", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M25 72 L35 78 L30 96 L19 88 Z M103 72 L93 78 L98 96 L109 88 Z"
              fill={c("#3B82F6", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* =========================================================
            18. SANG LEGENDA: Naga melingkar dengan mata menyala
         ========================================================= */}
        {rankId === "sang-legenda" && (
          <>
            <path
              d="M88 47 C105 61 91 91 65 91 C39 91 25 74 34 53 C42 35 67 31 82 44"
              fill="none"
              stroke="#134E4A"
              strokeWidth="18"
              strokeLinecap="round"
              transform="translate(0, 4)"
            />
            <path
              d="M88 43 C105 57 91 87 65 87 C39 87 25 70 34 49 C42 31 67 27 82 40"
              fill="none"
              stroke={c("#10B981", "#94A3B8")}
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M77 37 Q91 23 103 31 L112 44 L99 58 L81 55 L72 45 Z"
              fill={c("#059669", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M84 35 L80 22 L94 30 M101 34 L111 25 L109 42"
              fill={c("#A7F3D0", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M104 47 L118 52 L105 59 Z"
              fill={c("#F59E0B", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle
              cx="99"
              cy="42"
              r="3.5"
              fill="#FEF08A"
              stroke="#134E4A"
              strokeWidth="2"
            />
            <path
              d="M28 75 Q14 78 22 92 Q31 91 38 82"
              fill={c("#10B981", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M46 48 Q57 39 68 46 M44 61 Q58 54 70 60"
              fill="none"
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}

        {/* =========================================================
            19. RAJA TARTILA: Singgasana kerajaan berukir emas
         ========================================================= */}
        {rankId === "raja-tartila" && (
          <>
            <path
              d="M39 36 L89 36 L96 80 L32 80 Z"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            <path
              d="M39 32 L89 32 L96 76 L32 76 Z"
              fill={c("#7C3AED", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M48 41 L80 41 L84 66 L44 66 Z"
              fill={c("#A78BFA", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M64 43 L69 52 L79 53 L71 60 L73 68 L64 63 L55 68 L57 60 L49 53 L59 52 Z"
              fill={c("#FEF08A", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M32 62 H44 V85 H27 V71 Q27 65 32 62 Z M84 62 H96 Q101 65 101 71 V85 H84 Z"
              fill={c("#F59E0B", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M42 76 H86 V91 H42 Z"
              fill={c("#D97706", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M48 91 V103 M80 91 V103"
              stroke="#134E4A"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M52 29 L58 18 L64 25 L70 18 L76 29"
              fill={c("#FDE047", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <circle
              cx="64"
              cy="19"
              r="3.5"
              fill={c("#EF4444", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="2"
            />
          </>
        )}

        {/* =========================================================
            20. KAISER TARTILA: Mahkota tiga permata + sayap
         ========================================================= */}
        {rankId === "kaisar-tartila" && (
          <>
            <path
              d="M22 52 L44 58 L49 76 L27 70 Z M106 52 L84 58 L79 76 L101 70 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            <path
              d="M18 44 L45 50 L49 72 L25 65 L31 56 Z M110 44 L83 50 L79 72 L103 65 L97 56 Z"
              fill={c("#A78BFA", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M33 54 L43 62 M95 54 L85 62"
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M37 52 L43 28 L64 43 L85 28 L91 52 L84 77 H44 Z"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            <path
              d="M37 48 L43 24 L64 39 L85 24 L91 48 L84 73 H44 Z"
              fill={c("#FBBF24", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <path
              d="M44 59 H84 V73 H44 Z"
              fill={c("#D97706", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <polygon
              points="64,39 71,49 64,58 57,49"
              fill={c("#EF4444", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle
              cx="43"
              cy="30"
              r="6"
              fill={c("#3B82F6", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3"
            />
            <circle
              cx="85"
              cy="30"
              r="6"
              fill={c("#10B981", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth="3"
            />
          </>
        )}

        {/* =========================================================
            21. MAHKOTA TARTILA: Globe, mahkota, dan simbol iman
         ========================================================= */}
        {rankId === "mahkota-tartila" && (
          <>
            <circle
              cx="64"
              cy="69"
              r="34"
              fill="#134E4A"
              transform="translate(0, 5)"
            />
            <circle
              cx="64"
              cy="65"
              r="34"
              fill={c("#38BDF8", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth={sw}
            />
            <path
              d="M31 65 H97 M64 31 C48 44 48 86 64 99 M64 31 C80 44 80 86 64 99 M39 46 Q64 58 89 46 M39 84 Q64 72 89 84"
              fill="none"
              stroke="#134E4A"
              strokeWidth="3.5"
            />
            <path
              d="M48 39 L54 18 L64 31 L74 18 L80 39 L76 47 H52 Z"
              fill="#134E4A"
              transform="translate(0, 4)"
            />
            <path
              d="M48 35 L54 14 L64 27 L74 14 L80 35 L76 43 H52 Z"
              fill={c("#FDE047", "#CBD5E1")}
              stroke="#134E4A"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            <circle
              cx="54"
              cy="25"
              r="3.5"
              fill={c("#EF4444", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="2"
            />
            <circle
              cx="64"
              cy="31"
              r="3.5"
              fill={c("#3B82F6", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="2"
            />
            <circle
              cx="74"
              cy="25"
              r="3.5"
              fill={c("#10B981", "#94A3B8")}
              stroke="#134E4A"
              strokeWidth="2"
            />
            <path
              d="M49 64 L49 76 M43 70 H55"
              stroke={c("#FFFFFF", "#E2E8F0")}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M77 59 A 10 10 0 1 0 84 76 A 8 8 0 1 1 77 59 Z"
              fill={c("#FEF08A", "#E2E8F0")}
              stroke="#134E4A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </>
        )}
      </g>

      {/* 5. BANNER / PITA BAWAH KHUSUS SAAT STATUS AKTIF (isActive) */}
      {active && (
        <g>
          {/* Hard Shadow Pita */}
          <rect x="28" y="102" width="72" height="16" rx="8" fill="#134E4A" />
          {/* Bodi Pita Oranye */}
          <rect
            x="28"
            y="98"
            width="72"
            height="16"
            rx="8"
            fill="#F59E0B"
            stroke="#134E4A"
            strokeWidth={sw}
          />
          {/* Tiga Bintang Indikator Aktif */}
          <circle cx="48" cy="106" r="2.5" fill="#FFFFFF" />
          <circle
            cx="64"
            cy="106"
            r="3.5"
            fill="#FEF08A"
            stroke="#134E4A"
            strokeWidth="2"
          />
          <circle cx="80" cy="106" r="2.5" fill="#FFFFFF" />
        </g>
      )}
    </svg>
  );
}