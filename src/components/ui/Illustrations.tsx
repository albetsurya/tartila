import React, { useId } from "react";
import type { SvgProps } from "./CustomIcons";

export type { SvgProps };

// Type helper for avatar body colors
type AvatarBodyColors = {
  boy: { skin: string; shirt: string; pants: string };
  girl: { skin: string; shirt: string; skirt: string };
};

/**
 * 1. PetiHartaSvg (Peti Tertutup)
 * Gaya Neo-Brutalism Murni:
 * - Outline tebal solid #134E4A (strokeWidth >= 3.5)
 * - Bayangan blok solid tanpa opacity/blur (Hard Shadow)
 * - Warna isi solid tanpa gradasi
 */
export const PetiHartaSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="petiHarta"
      className={className}
      style={style}
    >
      {/* Bayangan Blok Solid (Hard Shadow, Tanpa Opacity) */}
      <ellipse cx="64" cy="116" rx="46" ry="8" fill="var(--svg-primary)" />

      {/* Tutup Peti (Atas) */}
      <path
        d="M18 64 V52 C18 34 36 22 64 22 C92 22 110 34 110 52 V64 Z"
        fill="#B45309"
        stroke="var(--svg-primary)"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Highlight Kilap di Tepi Atas Tutup */}
      <path
        d="M32 36 C42 29 52 28 64 28"
        stroke="var(--svg-accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Pita Emas Kiri di Tutup Peti */}
      <rect
        x="30"
        y="25"
        width="12"
        height="39"
        fill="#FBBF24"
        stroke="var(--svg-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Pita Emas Kanan di Tutup Peti */}
      <rect
        x="86"
        y="25"
        width="12"
        height="39"
        fill="#FBBF24"
        stroke="var(--svg-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Badan Peti (Bawah) */}
      <rect
        x="18"
        y="64"
        width="92"
        height="50"
        rx="9"
        fill="#78350F"
        stroke="var(--svg-primary)"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Inner Rim Kayu Badan Peti */}
      <rect
        x="25"
        y="71"
        width="78"
        height="36"
        rx="4"
        fill="#92400E"
        stroke="var(--svg-primary)"
        strokeWidth="3.5"
      />

      {/* Pita Emas Kiri di Badan Peti */}
      <rect
        x="30"
        y="64"
        width="12"
        height="50"
        fill="#FBBF24"
        stroke="var(--svg-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Pita Emas Kanan di Badan Peti */}
      <rect
        x="86"
        y="64"
        width="12"
        height="50"
        fill="#FBBF24"
        stroke="var(--svg-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Gembok / Kunci Tengah */}
      <rect
        x="50"
        y="52"
        width="28"
        height="30"
        rx="6"
        fill="#FBBF24"
        stroke="var(--svg-primary)"
        strokeWidth="4.5"
      />
      <rect
        x="55"
        y="57"
        width="18"
        height="20"
        rx="3"
        fill="#FDE68A"
        stroke="var(--svg-primary)"
        strokeWidth="3"
      />

      {/* Lubang Kunci Solid */}
      <circle cx="64" cy="64" r="3.5" fill="var(--svg-primary)" />
      <polygon
        points="61.5,65 66.5,65 67.5,73 60.5,73"
        fill="var(--svg-primary)"
      />
    </svg>
  );
};

/**
 * 2. PetiBonusEmasSvg (Peti Terbuka & Animasi Koin)
 * Gaya Neo-Brutalism Murni:
 * - HAPUS radialGradient: Sinar berputar menggunakan polygon solid (#FEF08A) dengan border #134E4A.
 * - HAPUS Glow / Opacity: Lingkaran cahaya berdenyut berwarna solid (#FBBF24) tanpa opacity.
 * - Bayangan Solid: Blok ellipse solid #134E4A tanpa transparansi.
 * - Menggunakan React `useId()` untuk mencegah ID bentrok (coinId unik).
 * - Garis tebal: Semua strokeWidth minimal 3 atau 4.
 */
export const PetiBonusEmasSvg: React.FC<SvgProps> = ({
  size = 200,
  className = "",
  style,
}) => {
  const uniqueId = useId();
  const safeId = uniqueId.replace(/[^a-zA-Z0-9_-]/g, "");
  const coinId = `coin-${safeId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="petiBonusEmas"
      className={className}
      style={style}
    >
      <defs>
        {/* Template Koin Neo-Brutalism Unik */}
        <g id={coinId}>
          <circle
            cx="0"
            cy="0"
            r="15"
            fill="#FBBF24"
            stroke="var(--svg-primary)"
            strokeWidth="4"
          />
          <circle
            cx="0"
            cy="0"
            r="10.5"
            fill="#FDE68A"
            stroke="var(--svg-primary)"
            strokeWidth="3"
          />
          <polygon
            points="0,-7 2,-2.8 6.7,-2.3 3.3,0.8 4.2,5.5 0,3 -4.2,5.5 -3.3,0.8 -6.7,-2.3 -2,-2.8"
            fill="#B45309"
            stroke="var(--svg-primary)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M-7.8 -6.2 C-6 -8.5 -3.1 -10 0 -10"
            stroke="var(--svg-accent)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </defs>

      {/* Sinar Berputar di Belakang (Koordinat dipangkas agar tidak terpotong di viewBox 200x200) */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 100"
          to="360 100 100"
          dur="14s"
          repeatCount="indefinite"
        />
        <polygon
          points="100,100 190,88 190,112"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 185,140 175,160"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 160,180 140,160"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 110,190 90,190"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 60,180 40,160"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 20,160 15,140"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 10,112 10,88"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 15,60 20,40"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 40,20 60,10"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 90,10 110,10"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 140,10 160,20"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <polygon
          points="100,100 160,40 175,60"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>

      {/* Lingkaran Solid Berdenyut (Solid #FBBF24 dengan Border #134E4A, Tanpa Opacity / Glow) */}
      <circle
        cx="100"
        cy="100"
        r="64"
        fill="#FBBF24"
        stroke="var(--svg-primary)"
        strokeWidth="4"
      >
        <animate
          attributeName="r"
          values="60;67;60"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Bayangan Dasar Blok Solid (Hard Shadow, Tanpa Opacity) */}
      <ellipse cx="100" cy="178" rx="64" ry="10" fill="var(--svg-primary)" />

      {/* Struktur Peti Terbuka */}
      <g transform="translate(100 128) scale(1.2)">
        {/* Tutup Peti Terbuka (Miring ke Kiri) */}
        <g transform="rotate(-28 -46 0)">
          <path
            d="M-46 0 V-18 C-46 -38 -28 -50 0 -50 C28 -50 46 -38 46 -18 V0 Z"
            fill="#B45309"
            stroke="var(--svg-primary)"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M-30 -36 C-20 -42 -10 -43 4 -43"
            stroke="var(--svg-accent)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect
            x="-34"
            y="-47"
            width="11"
            height="47"
            fill="#FBBF24"
            stroke="var(--svg-primary)"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <rect
            x="23"
            y="-47"
            width="11"
            height="47"
            fill="#FBBF24"
            stroke="var(--svg-primary)"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>

        {/* Tumpukan Emas di Dalam Peti */}
        <ellipse
          cx="0"
          cy="0"
          rx="42"
          ry="10"
          fill="#FBBF24"
          stroke="var(--svg-primary)"
          strokeWidth="4"
        />
        <ellipse cx="0" cy="-1" rx="32" ry="6" fill="#FDE68A" />

        {/* Badan Peti Bawah */}
        <rect
          x="-46"
          y="0"
          width="92"
          height="46"
          rx="9"
          fill="#78350F"
          stroke="var(--svg-primary)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect
          x="-39"
          y="7"
          width="78"
          height="32"
          rx="4"
          fill="#92400E"
          stroke="var(--svg-primary)"
          strokeWidth="3.5"
        />
        <rect
          x="-34"
          y="0"
          width="11"
          height="46"
          fill="#FBBF24"
          stroke="var(--svg-primary)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <rect
          x="23"
          y="0"
          width="11"
          height="46"
          fill="#FBBF24"
          stroke="var(--svg-primary)"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Gembok Tengah */}
        <rect
          x="-11"
          y="10"
          width="22"
          height="24"
          rx="5"
          fill="#FBBF24"
          stroke="var(--svg-primary)"
          strokeWidth="4.5"
        />
        <rect
          x="-7"
          y="14"
          width="14"
          height="16"
          rx="2.5"
          fill="#FDE68A"
          stroke="var(--svg-primary)"
          strokeWidth="3"
        />
        <circle cx="0" cy="20" r="3" fill="var(--svg-primary)" />
        <polygon points="-2,21 2,21 3,27 -3,27" fill="var(--svg-primary)" />
      </g>

      {/* 3 Koin Melayang (Menggunakan coinId Unik) */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;0 -8;0 0"
          dur="1.6s"
          repeatCount="indefinite"
        />
        <use href={`#${coinId}`} x="74" y="72" />
      </g>
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;0 -12;0 0"
          dur="1.6s"
          repeatCount="indefinite"
        />
        <use href={`#${coinId}`} x="126" y="64" />
      </g>
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;0 -6;0 0"
          dur="1.6s"
          repeatCount="indefinite"
        />
        <use href={`#${coinId}`} x="100" y="44" />
      </g>

      {/* Efek Kilau Bintang (Sparkles Solid Tanpa Opacity) */}
      <g>
        <path
          transform="translate(40 50) scale(1.3)"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
          d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"
        />
        <path
          transform="translate(164 80) scale(1.1)"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
          d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"
        />
      </g>
      <g>
        <path
          transform="translate(160 36) scale(1.2)"
          fill="#FBBF24"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
          d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"
        />
        <path
          transform="translate(34 120) scale(1)"
          fill="#FBBF24"
          stroke="var(--svg-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
          d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"
        />
      </g>
    </svg>
  );
};

// ============================================================================
// KATEGORI 1: ASET GAME HIJAIYAH POP
// ============================================================================

// 1. EfekPopSvg: Efek ledakan komik "POW!"
export const EfekPopSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="efekPop"
    className={className}
  >
    {/* Hard Shadow Neo-Brutalism */}
    <polygon
      points="68,12 82,36 112,24 98,52 124,68 96,82 108,112 78,96 64,122 50,96 20,112 32,82 8,68 34,52 20,24 50,36"
      fill="var(--svg-primary)"
    />
    {/* Ledakan Luar Kuning */}
    <polygon
      points="64,6 78,30 108,18 94,46 120,62 92,76 104,106 74,90 60,116 46,90 16,106 28,76 4,62 30,46 16,18 46,30"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Ledakan Dalam Merah-Oranye */}
    <polygon
      points="64,22 73,40 94,32 84,52 104,62 82,72 90,92 70,80 60,98 50,80 30,92 38,72 18,62 38,52 28,32 49,40"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Teks POW! */}
    <text
      x="62"
      y="70"
      textAnchor="middle"
      fontSize="24"
      fontWeight="900"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      paintOrder="stroke"
      fontFamily="system-ui, sans-serif"
      transform="rotate(-8 62 64)"
    >
      POW!
    </text>
  </svg>
);

const BaseItemPopSvg: React.FC<
  SvgProps & { mainColor: string; lightColor: string; label: string }
> = ({ size = 128, className = "", mainColor, lightColor, label }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label={label}
    className={className}
  >
    {/* Hard Shadow */}
    <circle cx="68" cy="72" r="44" fill="var(--svg-primary)" />
    {/* Daun Tangkai Buah di Atas */}
    <path
      d="M64 26 C64 14 82 10 88 18 C82 28 70 28 64 26 Z"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <path
      d="M64 26 C64 16 48 12 42 20 C48 28 58 28 64 26 Z"
      fill="#4ADE80"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Badan Buah / Bintang Bulat */}
    <circle
      cx="64"
      cy="68"
      r="44"
      fill={mainColor}
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    {/* Highlight Kilap */}
    <path
      d="M34 48 C40 38 50 32 62 32"
      stroke={lightColor}
      strokeWidth="5"
      strokeLinecap="round"
    />
    {/* Area Kosong di Tengah (Untuk Tempat Huruf Hijaiyah) */}
    <circle
      cx="64"
      cy="68"
      r="27"
      fill="#FFFBEB"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
  </svg>
);

// 2a. ItemMerahSvg
export const ItemMerahSvg: React.FC<SvgProps> = (props) => (
  <BaseItemPopSvg
    {...props}
    mainColor="#EF4444"
    lightColor="#FCA5A5"
    label="itemMerah"
  />
);

// 2b. ItemBiruSvg
export const ItemBiruSvg: React.FC<SvgProps> = (props) => (
  <BaseItemPopSvg
    {...props}
    mainColor="#3B82F6"
    lightColor="#93C5FD"
    label="itemBiru"
  />
);

// 2c. ItemKuningSvg
export const ItemKuningSvg: React.FC<SvgProps> = (props) => (
  <BaseItemPopSvg
    {...props}
    mainColor="#FBBF24"
    lightColor="#FEF08A"
    label="itemKuning"
  />
);

// 2d. ItemHijauSvg
export const ItemHijauSvg: React.FC<SvgProps> = (props) => (
  <BaseItemPopSvg
    {...props}
    mainColor="#10B981"
    lightColor="#6EE7B7"
    label="itemHijau"
  />
);

// 3. HijaiyahPopCoverSvg: Burung Tito dikelilingi bintang hijaiyah
export const HijaiyahPopCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="qirraPopCover"
      className={className}
    >
      {/* Background Badge */}
      <circle cx="67" cy="69" r="50" fill="var(--svg-primary)" />
      <circle
        cx="64"
        cy="66"
        r="50"
        fill="#CCFBF1"
        stroke="var(--svg-primary)"
        strokeWidth="5"
      />

      {/* Sayap Burung Tito */}
      <ellipse
        cx="34"
        cy="74"
        rx="14"
        ry="9"
        transform="rotate(-25 34 74)"
        fill="var(--svg-secondary)"
        stroke="var(--svg-primary)"
        strokeWidth="4.5"
      />
      <ellipse
        cx="94"
        cy="74"
        rx="14"
        ry="9"
        transform="rotate(25 94 74)"
        fill="var(--svg-secondary)"
        stroke="var(--svg-primary)"
        strokeWidth="4.5"
      />

      {/* Badan Burung Tito */}
      <ellipse
        cx="64"
        cy="74"
        rx="26"
        ry="28"
        fill="#14B8A6"
        stroke="var(--svg-primary)"
        strokeWidth="5"
      />
      {/* Perut Krem */}
      <ellipse
        cx="64"
        cy="82"
        rx="17"
        ry="18"
        fill="var(--svg-accent)"
        stroke="var(--svg-primary)"
        strokeWidth="4"
      />
      {/* Jambul */}
      <path
        d="M58 46 C54 34 64 32 64 44 C68 34 76 38 70 46 Z"
        fill="#FBBF24"
        stroke="var(--svg-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Mata */}
      <circle
        cx="53"
        cy="64"
        r="6"
        fill="#FFFFFF"
        stroke="var(--svg-primary)"
        strokeWidth="3.5"
      />
      <circle cx="54" cy="64" r="2.5" fill="var(--svg-primary)" />
      <circle
        cx="75"
        cy="64"
        r="6"
        fill="#FFFFFF"
        stroke="var(--svg-primary)"
        strokeWidth="3.5"
      />
      <circle cx="74" cy="64" r="2.5" fill="var(--svg-primary)" />
      {/* Paruh */}
      <polygon
        points="59,68 69,68 64,77"
        fill="#F97316"
        stroke="var(--svg-primary)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* ==================== */}
      {/* BUAH HIJAIYAH KIRI  */}
      {/* ==================== */}
      <g transform="translate(24, 38)">
        <circle cx="1" cy="1" r="15" fill="var(--svg-primary)" /> {/* Shadow */}
        <circle
          cx="0"
          cy="0"
          r="15"
          fill="#EF4444"
          stroke="var(--svg-primary)"
          strokeWidth="3"
        />
        <path
          d="M 0 -15 C 0 -22 8 -24 10 -20 C 6 -15 2 -15 0 -15 Z"
          fill="#22C55E"
          stroke="var(--svg-primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle
          cx="0"
          cy="0"
          r="9.5"
          fill="#FFFBEB"
          stroke="var(--svg-primary)"
          strokeWidth="2.5"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="var(--svg-primary)"
        >
          أ
        </text>
      </g>

      {/* ==================== */}
      {/* BUAH HIJAIYAH KANAN */}
      {/* ==================== */}
      <g transform="translate(104, 38)">
        <circle cx="1" cy="1" r="15" fill="var(--svg-primary)" /> {/* Shadow */}
        <circle
          cx="0"
          cy="0"
          r="15"
          fill="#3B82F6"
          stroke="var(--svg-primary)"
          strokeWidth="3"
        />
        <path
          d="M 0 -15 C 0 -22 8 -24 10 -20 C 6 -15 2 -15 0 -15 Z"
          fill="#22C55E"
          stroke="var(--svg-primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle
          cx="0"
          cy="0"
          r="9.5"
          fill="#FFFBEB"
          stroke="var(--svg-primary)"
          strokeWidth="2.5"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="var(--svg-primary)"
        >
          ب
        </text>
      </g>

      {/* ==================== */}
      {/* BUAH HIJAIYAH ATAS  */}
      {/* ==================== */}
      {/* Posisi Y diturunkan dari 16 menjadi 28 agar daun tidak terpotong */}
      <g transform="translate(64, 28)">
        <circle cx="1" cy="1" r="15" fill="var(--svg-primary)" /> {/* Shadow */}
        <circle
          cx="0"
          cy="0"
          r="15"
          fill="#FBBF24"
          stroke="var(--svg-primary)"
          strokeWidth="3"
        />
        <path
          d="M 0 -15 C 0 -22 8 -24 10 -20 C 6 -15 2 -15 0 -15 Z"
          fill="#22C55E"
          stroke="var(--svg-primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle
          cx="0"
          cy="0"
          r="9.5"
          fill="#FFFBEB"
          stroke="var(--svg-primary)"
          strokeWidth="2.5"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="var(--svg-primary)"
        >
          ت
        </text>
      </g>
    </svg>
  );
};

// ============================================================================
// KATEGORI 2: 24 COVER GAME (4 - 27)
// ============================================================================

// 4. HijaiyahRushCoverSvg: Roket dengan jendela huruf 'ج'
export const HijaiyahRushCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="hijaiyahRushCover"
    className={className}
  >
    {/* Semburan Api Roket */}
    <path
      d="M50 94 L64 122 L78 94 Z"
      fill="#F97316"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <path
      d="M56 94 L64 110 L72 94 Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Sirip Kiri & Kanan */}
    <path
      d="M42 70 L22 92 L42 94 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <path
      d="M86 70 L106 92 L86 94 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Badan Roket */}
    <path
      d="M64 12 C42 32 40 62 42 94 H86 C88 62 86 32 64 12 Z"
      fill="#F8FAFC"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Ujung Kerucut Merah */}
    <path
      d="M64 12 C53 22 47 34 45 42 H83 C81 34 75 22 64 12 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Jendela Bulat Huruf ج */}
    <circle
      cx="64"
      cy="64"
      r="16"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <circle
      cx="64"
      cy="64"
      r="12"
      fill="#E0F2FE"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <text
      x="64"
      y="70"
      textAnchor="middle"
      fontSize="20"
      fontWeight="900"
      fill="var(--svg-primary)"
    >
      ج
    </text>
  </svg>
);

// 5. HijaiyahBeatsCoverSvg: Not balok biru dengan huruf 'د'
export const HijaiyahBeatsCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="hijaiyahBeatsCover"
    className={className}
  >
    {/* Lingkaran Vinyl / Piringan */}
    <circle cx="68" cy="68" r="48" fill="var(--svg-primary)" />
    <circle
      cx="64"
      cy="64"
      r="48"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    {/* Batang Not Balok Biru */}
    <path
      d="M52 84 V30 L96 22 V76"
      stroke="var(--svg-primary)"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M52 84 V30 L96 22 V76"
      stroke="#3B82F6"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Kepala Not Kiri (Besar dengan huruf د) */}
    <circle
      cx="40"
      cy="84"
      r="18"
      fill="#3B82F6"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <text
      x="40"
      y="91"
      textAnchor="middle"
      fontSize="22"
      fontWeight="900"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="3"
      paintOrder="stroke"
    >
      د
    </text>
    {/* Kepala Not Kanan */}
    <circle
      cx="84"
      cy="76"
      r="15"
      fill="#60A5FA"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
  </svg>
);

// 6. Hijaiyah2048CoverSvg: Dua tile puzzle (ب dan ت)
export const Hijaiyah2048CoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="hijaiyah2048Cover"
    className={className}
  >
    {/* Tile Belakang (ب) */}
    <rect
      x="20"
      y="22"
      width="56"
      height="56"
      rx="10"
      fill="var(--svg-primary)"
    />
    <rect
      x="16"
      y="18"
      width="56"
      height="56"
      rx="10"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <text
      x="44"
      y="54"
      textAnchor="middle"
      fontSize="30"
      fontWeight="900"
      fill="var(--svg-primary)"
    >
      ب
    </text>
    {/* Tile Depan (ت) */}
    <rect
      x="58"
      y="58"
      width="56"
      height="56"
      rx="10"
      fill="var(--svg-primary)"
    />
    <rect
      x="54"
      y="54"
      width="56"
      height="56"
      rx="10"
      fill="#34D399"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <text
      x="82"
      y="90"
      textAnchor="middle"
      fontSize="30"
      fontWeight="900"
      fill="var(--svg-primary)"
    >
      ت
    </text>
  </svg>
);

// 7. HijaiyahMatchArenaCoverSvg: Dua perisai 'ر' berhadapan
export const HijaiyahMatchArenaCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => {
  const rawId = useId();
  const shieldId = `shield-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="hijaiyahMatchArenaCover"
      className={className}
    >
      <defs>
        <path
          id={shieldId}
          d="M-22 -28 H22 V-4 C22 14 0 26 0 26 C0 26 -22 14 -22 -4 Z"
          stroke="var(--svg-primary)"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
      </defs>
      {/* Petir Benturan di Tengah */}
      <polygon
        points="66,14 54,56 72,56 60,114 78,66 60,66"
        fill="#FBBF24"
        stroke="var(--svg-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Perisai Kiri */}
      <g transform="translate(36 66) rotate(-12)">
        <use href={`#${shieldId}`} fill="#EF4444" />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3.5"
          paintOrder="stroke"
        >
          ر
        </text>
      </g>
      {/* Perisai Kanan */}
      <g transform="translate(92 66) rotate(12)">
        <use href={`#${shieldId}`} fill="#3B82F6" />
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fill="var(--svg-accent)"
          stroke="var(--svg-primary)"
          strokeWidth="3.5"
          paintOrder="stroke"
        >
          ر
        </text>
      </g>
    </svg>
  );
};

// 8. ArabicWordleCoverSvg: Grid 3x3 (hijau, kuning, abu)
export const ArabicWordleCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="arabicWordleCover"
    className={className}
  >
    {/* Hard Shadow Board */}
    <rect
      x="22"
      y="22"
      width="90"
      height="90"
      rx="10"
      fill="var(--svg-primary)"
    />
    <rect
      x="18"
      y="18"
      width="90"
      height="90"
      rx="10"
      fill="#FFFBEB"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    {/* Baris 1 */}
    <rect
      x="26"
      y="26"
      width="22"
      height="22"
      rx="4"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <rect
      x="52"
      y="26"
      width="22"
      height="22"
      rx="4"
      fill="#94A3B8"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <rect
      x="78"
      y="26"
      width="22"
      height="22"
      rx="4"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    {/* Baris 2 */}
    <rect
      x="26"
      y="52"
      width="22"
      height="22"
      rx="4"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <rect
      x="52"
      y="52"
      width="22"
      height="22"
      rx="4"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <rect
      x="78"
      y="52"
      width="22"
      height="22"
      rx="4"
      fill="#94A3B8"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    {/* Baris 3 (Hijau Semua - Menang) */}
    <rect
      x="26"
      y="78"
      width="22"
      height="22"
      rx="4"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <rect
      x="52"
      y="78"
      width="22"
      height="22"
      rx="4"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <rect
      x="78"
      y="78"
      width="22"
      height="22"
      rx="4"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 9. AyatScrambleCoverSvg: Puzzle bergerigi ayat Arab
export const AyatScrambleCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="ayatScrambleCover"
    className={className}
  >
    {/* Keping Puzzle Kiri */}
    <path
      d="M16 36 H56 V52 C64 52 64 68 56 68 V88 H16 Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <text
      x="36"
      y="68"
      textAnchor="middle"
      fontSize="22"
      fontWeight="900"
      fill="var(--svg-primary)"
    >
      قُلْ
    </text>
    {/* Keping Puzzle Kanan (Sedikit Miring/Terlepas) */}
    <g transform="translate(6 4) rotate(6 84 62)">
      <path
        d="M64 36 H108 V88 H64 V68 C72 68 72 52 64 52 Z"
        fill="#34D399"
        stroke="var(--svg-primary)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <text
        x="88"
        y="68"
        textAnchor="middle"
        fontSize="20"
        fontWeight="900"
        fill="var(--svg-primary)"
      >
        هُوَ
      </text>
    </g>
  </svg>
);

// 10. AyatHunterCoverSvg: Kaca pembesar menyorot kitab
export const AyatHunterCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="ayatHunterCover"
    className={className}
  >
    {/* Kitab Terbuka */}
    <path
      d="M16 36 Q40 30 64 38 Q88 30 112 36 V92 Q88 86 64 94 Q40 86 16 92 Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <line
      x1="64"
      y1="38"
      x2="64"
      y2="94"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Baris Teks Kitab */}
    <line
      x1="26"
      y1="52"
      x2="54"
      y2="52"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <line
      x1="26"
      y1="66"
      x2="54"
      y2="66"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Gagang Kaca Pembesar */}
    <path
      d="M86 82 L110 106"
      stroke="var(--svg-primary)"
      strokeWidth="14"
      strokeLinecap="round"
    />
    <path
      d="M86 82 L110 106"
      stroke="#F97316"
      strokeWidth="7"
      strokeLinecap="round"
    />
    {/* Lensa Kaca Pembesar */}
    <circle
      cx="70"
      cy="64"
      r="24"
      fill="#BAE6FD"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <text
      x="70"
      y="72"
      textAnchor="middle"
      fontSize="22"
      fontWeight="900"
      fill="var(--svg-primary)"
    >
      آيَة
    </text>
  </svg>
);

// 11. JuzAmmaSpeedrunCoverSvg: Stopwatch dan buku Juz Amma
export const JuzAmmaSpeedrunCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="juzAmmaSpeedrunCover"
    className={className}
  >
    {/* Buku Juz Amma di Kiri */}
    <rect
      x="18"
      y="24"
      width="56"
      height="74"
      rx="6"
      fill="#10B981"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <rect
      x="28"
      y="36"
      width="36"
      height="24"
      rx="3"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <text
      x="46"
      y="53"
      textAnchor="middle"
      fontSize="14"
      fontWeight="900"
      fill="var(--svg-primary)"
    >
      عمّ
    </text>
    {/* Tombol Atas Stopwatch */}
    <rect
      x="76"
      y="38"
      width="16"
      height="10"
      rx="3"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    {/* Badan Stopwatch di Kanan Bawah */}
    <circle
      cx="84"
      cy="78"
      r="30"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <circle
      cx="84"
      cy="78"
      r="22"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    {/* Jarum Stopwatch */}
    <polyline
      points="84,64 84,78 94,78"
      stroke="#EF4444"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 12. QuranQuizRoyaleCoverSvg: Podium juara dengan piala
export const QuranQuizRoyaleCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="quranQuizRoyaleCover"
    className={className}
  >
    {/* Piala Emas di Atas Podium Tengah */}
    <path
      d="M44 26 H84 V40 C84 52 44 52 44 40 Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <path
      d="M64 50 V62 M52 62 H76"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinecap="round"
    />
    {/* Podium Juara 2 (Kiri) */}
    <rect
      x="16"
      y="76"
      width="32"
      height="36"
      fill="#60A5FA"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Podium Juara 1 (Tengah) */}
    <rect
      x="48"
      y="62"
      width="32"
      height="50"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <text
      x="64"
      y="94"
      textAnchor="middle"
      fontSize="20"
      fontWeight="900"
      fill="var(--svg-primary)"
    >
      1
    </text>
    {/* Podium Juara 3 (Kanan) */}
    <rect
      x="80"
      y="84"
      width="32"
      height="28"
      fill="#F97316"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
  </svg>
);

// 13. TajwidArenaCoverSvg: Dua pedang di atas kitab
export const TajwidArenaCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="tajwidArenaCover"
    className={className}
  >
    {/* Kitab di Belakang */}
    <rect
      x="24"
      y="30"
      width="80"
      height="68"
      rx="8"
      fill="#10B981"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <rect
      x="34"
      y="40"
      width="60"
      height="48"
      rx="4"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    {/* Pedang 1 (Kiri Bawah ke Kanan Atas) */}
    <path
      d="M22 106 L102 26"
      stroke="var(--svg-primary)"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path
      d="M22 106 L102 26"
      stroke="#E2E8F0"
      strokeWidth="5"
      strokeLinecap="round"
    />
    {/* Pedang 2 (Kanan Bawah ke Kiri Atas) */}
    <path
      d="M106 106 L26 26"
      stroke="var(--svg-primary)"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path
      d="M106 106 L26 26"
      stroke="#FBBF24"
      strokeWidth="5"
      strokeLinecap="round"
    />
  </svg>
);

// 14. TajwidDefenseCoverSvg: Perisai dengan simbol tajwid
export const TajwidDefenseCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="tajwidDefenseCover"
    className={className}
  >
    {/* Hard Shadow Perisai */}
    <path
      d="M28 24 H108 V64 C108 94 68 114 68 114 C68 114 28 94 28 64 Z"
      fill="var(--svg-primary)"
    />
    {/* Perisai Utama */}
    <path
      d="M24 20 H104 V60 C104 90 64 110 64 110 C64 110 24 90 24 60 Z"
      fill="#3B82F6"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Bingkai Dalam Perisai */}
    <path
      d="M34 30 H94 V58 C94 80 64 96 64 96 C64 96 34 80 34 58 Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Simbol Mad / Tajwid (~) */}
    <path
      d="M44 62 Q54 46 64 62 T84 62"
      stroke="#EF4444"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M44 62 Q54 46 64 62 T84 62"
      stroke="var(--svg-primary)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// 15. TajwidTetrisCoverSvg: Blok Tetris dengan simbol waqaf
export const TajwidTetrisCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="tajwidTetrisCover"
    className={className}
  >
    {/* T-Block Tetris */}
    <rect
      x="20"
      y="32"
      width="28"
      height="28"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <rect
      x="48"
      y="32"
      width="28"
      height="28"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <rect
      x="76"
      y="32"
      width="28"
      height="28"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <rect
      x="48"
      y="60"
      width="28"
      height="28"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Simbol Waqaf (م / قلى) */}
    <text
      x="62"
      y="52"
      textAnchor="middle"
      fontSize="18"
      fontWeight="900"
      fill="var(--svg-accent)"
    >
      مـ
    </text>
    <text
      x="62"
      y="80"
      textAnchor="middle"
      fontSize="16"
      fontWeight="900"
      fill="var(--svg-primary)"
    >
      قلى
    </text>
  </svg>
);

// 16. AdabRpgCoverSvg: Helm ksatria dan perisai bunga
export const AdabRpgCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="adabRpgCover"
    className={className}
  >
    {/* Jambul Helm Ksatria */}
    <path
      d="M44 26 C44 12 72 12 72 26 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Helm Ksatria */}
    <path
      d="M24 52 C24 30 68 30 68 52 V84 H24 Z"
      fill="#94A3B8"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Visor Helm */}
    <rect
      x="30"
      y="54"
      width="32"
      height="12"
      rx="3"
      fill="var(--svg-primary)"
    />
    {/* Perisai di Kanan Bawah */}
    <path
      d="M58 50 H106 V78 C106 98 82 110 82 110 C82 110 58 98 58 78 Z"
      fill="#34D399"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Bunga di Tengah Perisai */}
    <circle
      cx="82"
      cy="70"
      r="7"
      fill="#F472B6"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
    <circle
      cx="82"
      cy="84"
      r="7"
      fill="#F472B6"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
    <circle
      cx="75"
      cy="77"
      r="7"
      fill="#F472B6"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
    <circle
      cx="89"
      cy="77"
      r="7"
      fill="#F472B6"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
    <circle
      cx="82"
      cy="77"
      r="5"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
  </svg>
);

// 17. DoaDungeonCoverSvg: Obor di gua menyorot peti
export const DoaDungeonCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="doaDungeonCover"
    className={className}
  >
    {/* Mulut Gua Batu */}
    <path
      d="M14 108 V56 C14 24 114 24 114 56 V108 Z"
      fill="#475569"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Lingkaran Cahaya Obor Solid */}
    <circle
      cx="40"
      cy="48"
      r="22"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    {/* Obor Kayu & Api */}
    <rect
      x="35"
      y="56"
      width="10"
      height="30"
      rx="2"
      fill="#92400E"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <path
      d="M40 28 C30 40 32 54 40 56 C48 54 50 40 40 28 Z"
      fill="#F97316"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Peti Kecil di Kanan Bawah */}
    <rect
      x="58"
      y="70"
      width="42"
      height="30"
      rx="4"
      fill="#B45309"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <line
      x1="58"
      y1="82"
      x2="100"
      y2="82"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <rect
      x="74"
      y="77"
      width="10"
      height="12"
      rx="2"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 18. MalaikatMissionCoverSvg: Sayap malaikat dan clipboard
export const MalaikatMissionCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="malaikatMissionCover"
    className={className}
  >
    {/* Sayap Kiri & Kanan */}
    <path
      d="M36 52 C10 34 6 62 22 72 C12 80 22 92 36 86 Z"
      fill="#F8FAFC"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <path
      d="M92 52 C118 34 122 62 106 72 C116 80 106 92 92 86 Z"
      fill="#F8FAFC"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Papan Clipboard */}
    <rect
      x="36"
      y="28"
      width="56"
      height="76"
      rx="8"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <rect
      x="44"
      y="38"
      width="40"
      height="56"
      rx="4"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    {/* Penjepit Clipboard Atas */}
    <rect
      x="52"
      y="20"
      width="24"
      height="12"
      rx="4"
      fill="#94A3B8"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    {/* Checklist Hijau */}
    <polyline
      points="52,58 60,66 76,48"
      stroke="#10B981"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="52"
      y1="80"
      x2="76"
      y2="80"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

// 19. NabiChroniclesCoverSvg: Gulungan perkamen kuno
export const NabiChroniclesCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="nabiChroniclesCover"
    className={className}
  >
    {/* Kertas Perkamen Utama */}
    <rect
      x="30"
      y="24"
      width="68"
      height="80"
      fill="#FDE68A"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    {/* Batang Gulungan Atas */}
    <rect
      x="20"
      y="16"
      width="88"
      height="14"
      rx="7"
      fill="#B45309"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Batang Gulungan Bawah */}
    <rect
      x="20"
      y="98"
      width="88"
      height="14"
      rx="7"
      fill="#B45309"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Garis Kaligrafi Kuno */}
    <line
      x1="44"
      y1="48"
      x2="84"
      y2="48"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <line
      x1="44"
      y1="64"
      x2="84"
      y2="64"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <line
      x1="56"
      y1="80"
      x2="84"
      y2="80"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  </svg>
);

// 20. SantriIdleCoverSvg: Santri tidur di tumpukan buku
export const SantriIdleCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="santriIdleCover"
    className={className}
  >
    {/* Tumpukan Buku */}
    <rect
      x="20"
      y="92"
      width="88"
      height="18"
      rx="4"
      fill="#10B981"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <rect
      x="26"
      y="74"
      width="76"
      height="18"
      rx="4"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Kepala Santri Tidur */}
    <circle
      cx="56"
      cy="54"
      r="18"
      fill="#FDE68A"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Peci / Kopiah Hitam */}
    <path
      d="M38 46 L42 32 H70 L74 46 Z"
      fill="#1E293B"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Mata Merem */}
    <path
      d="M48 56 Q52 60 56 56"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Huruf Zzz */}
    <text
      x="88"
      y="42"
      fontSize="18"
      fontWeight="900"
      fill="#3B82F6"
      stroke="var(--svg-primary)"
      strokeWidth="3"
      paintOrder="stroke"
    >
      Zzz
    </text>
  </svg>
);

// 21. WudhuFlowCoverSvg: Keran air dan gelembung
export const WudhuFlowCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="wudhuFlowCover"
    className={className}
  >
    {/* Pipa Keran Air */}
    <path
      d="M18 36 H68 C78 36 84 42 84 52 V62 H64 V54 H18 Z"
      fill="#94A3B8"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Pemutar Keran Merah */}
    <rect
      x="42"
      y="18"
      width="24"
      height="10"
      rx="4"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <line
      x1="54"
      y1="28"
      x2="54"
      y2="36"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    {/* Tetesan Air Besar */}
    <path
      d="M74 68 C62 84 62 104 74 104 C86 104 86 84 74 68 Z"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Gelembung Air */}
    <circle
      cx="42"
      cy="86"
      r="12"
      fill="#BAE6FD"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <circle
      cx="100"
      cy="96"
      r="9"
      fill="#BAE6FD"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
  </svg>
);

// 22. SholatHeroCoverSvg: Sajadah dengan jubah superhero
export const SholatHeroCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="sholatHeroCover"
    className={className}
  >
    {/* Jubah Superhero Merah Berkibar */}
    <path
      d="M36 28 L14 96 L64 88 L114 96 L92 28 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Sajadah Hijau di Tengah */}
    <rect
      x="36"
      y="22"
      width="56"
      height="84"
      rx="6"
      fill="#10B981"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    {/* Kubah Mihrab Sajadah */}
    <path
      d="M46 88 V52 C46 38 64 32 64 32 C64 32 82 38 82 52 V88 Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

// 23. HarakatRushCoverSvg / HarakatSlasherCoverSvg: Pedang Katana menebas buah semangka & huruf Arab "بَ"
export const HarakatRushCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="harakatSlasherCover"
    className={className}
  >
    {/* Efek Garis Sabetan (Slash Trail) Merah & Kuning Api */}
    <path
      d="M10 114 C 40 90, 80 50, 118 16"
      stroke="#EF4444"
      strokeWidth="12"
      strokeLinecap="round"
      opacity="0.35"
    />
    <path
      d="M16 108 C 44 86, 82 46, 114 20"
      stroke="#FDE047"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Percikan Bintang Sabetan (Slash Sparks) */}
    <polygon
      points="68,26 71,32 77,35 71,38 68,44 65,38 59,35 65,32"
      fill="#FDE047"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <polygon
      points="36,88 38,92 42,94 38,96 36,100 34,96 30,94 34,92"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* BELAHAN SEMANGKA BAGIAN ATAS (KIRI ATAS) */}
    <g transform="translate(-4, -6)">
      {/* Kulit Semangka Hijau */}
      <path
        d="M26 62 C 26 38, 46 22, 68 22 C 78 22, 86 26, 92 32 L 32 72 Z"
        fill="#10B981"
        stroke="var(--svg-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Daging Semangka Merah */}
      <path
        d="M32 58 C 32 40, 48 28, 66 28 C 74 28, 80 31, 84 35 L 36 67 Z"
        fill="#EF4444"
      />
      {/* Biji Semangka */}
      <circle cx="52" cy="38" r="2" fill="var(--svg-primary)" />
      <circle cx="68" cy="40" r="2" fill="var(--svg-primary)" />
    </g>

    {/* BELAHAN SEMANGKA BAGIAN BAWAH (KANAN BAWAH) */}
    <g transform="translate(6, 6)">
      {/* Kulit Semangka Hijau */}
      <path
        d="M44 82 L 102 44 C 108 52, 110 62, 108 74 C 104 96, 82 110, 60 108 C 48 106, 42 98, 44 82 Z"
        fill="#10B981"
        stroke="var(--svg-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Daging Semangka Merah */}
      <path
        d="M50 82 L 98 50 C 102 58, 104 66, 102 74 C 98 90, 80 102, 64 102 C 54 100, 50 94, 50 82 Z"
        fill="#EF4444"
      />
      {/* Biji Semangka */}
      <circle cx="78" cy="74" r="2" fill="var(--svg-primary)" />
      <circle cx="88" cy="64" r="2" fill="var(--svg-primary)" />
      <circle cx="66" cy="88" r="2" fill="var(--svg-primary)" />
    </g>

    {/* HURUF ARAB "بَ" (Ba dengan Fathah) DI TENGAH SABETAN */}
    <g transform="translate(42, 42) scale(0.9)">
      {/* Garis Harakat Fathah (Merah/Oranye tegas di atas) */}
      <line
        x1="26"
        y1="-6"
        x2="44"
        y2="-16"
        stroke="#DC2626"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Badan Huruf Ba */}
      <path
        d="M12 8 C 12 24, 22 34, 42 34 C 54 34, 58 26, 58 12"
        fill="none"
        stroke="#FEF3C7"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8 C 12 24, 22 34, 42 34 C 54 34, 58 26, 58 12"
        fill="none"
        stroke="var(--svg-primary)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Titik Huruf Ba di bawah */}
      <circle
        cx="35"
        cy="45"
        r="4"
        fill="#DC2626"
        stroke="var(--svg-primary)"
        strokeWidth="2.5"
      />
    </g>

    {/* PEDANG KATANA MELINTANG SABETAN */}
    {/* Bilah Pedang (Blade) Perak/Abu-Abu mengkilap */}
    <path
      d="M14 112 L 102 24 C 108 18, 116 16, 120 18 C 120 22, 116 30, 110 36 L 22 120 Z"
      fill="#F1F5F9"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Kilauan / Hamon Bilah Pedang */}
    <path
      d="M20 110 L 104 26 C 107 23, 111 21, 114 22 L 24 116 Z"
      fill="#FFFFFF"
    />
    {/* Tsuba (Pelindung Gagang) Emas/Kuning */}
    <ellipse
      cx="24"
      cy="102"
      rx="7"
      ry="13"
      transform="rotate(-45 24 102)"
      fill="#F59E0B"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
    {/* Gagang Pedang (Tsuka) Bertali Biru Gelap */}
    <path
      d="M20 106 L 6 120 C 4 122, 2 122, 1 120 C 0 118, 1 116, 3 114 L 17 100 Z"
      fill="#1E293B"
      stroke="var(--svg-primary)"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    {/* Detail Lilitan Gagang */}
    <line x1="15" y1="104" x2="19" y2="108" stroke="#F59E0B" strokeWidth="2" />
    <line x1="10" y1="109" x2="14" y2="113" stroke="#F59E0B" strokeWidth="2" />
    <line x1="5" y1="114" x2="9" y2="118" stroke="#F59E0B" strokeWidth="2" />
  </svg>
);

export const HarakatSlasherCoverSvg = HarakatRushCoverSvg;

// 24. MakhrajMasterCoverSvg: Wajah profil dengan target area mulut
export const MakhrajMasterCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="makhrajMasterCover"
    className={className}
  >
    {/* Siluet Profil Wajah & Leher */}
    <path
      d="M30 20 H74 C88 20 92 38 92 48 L104 60 L90 68 V88 C90 96 76 100 68 100 V112 H30 Z"
      fill="#FDE68A"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Target Radar di Area Mulut/Tenggorokan */}
    <circle
      cx="82"
      cy="78"
      r="20"
      fill="#FCA5A5"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <circle
      cx="82"
      cy="78"
      r="10"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <line
      x1="58"
      y1="78"
      x2="106"
      y2="78"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <line
      x1="82"
      y1="54"
      x2="82"
      y2="102"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 25. NurBattleCoverSvg: Lentera vs asap gelap
export const NurBattleCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="nurBattleCover"
    className={className}
  >
    {/* Asap Gelap di Kanan */}
    <path
      d="M72 32 C92 22 114 38 106 58 C118 72 106 98 84 96 C70 96 68 76 74 64 Z"
      fill="#475569"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Lentera Cahaya di Kiri */}
    <path
      d="M32 34 H56 L50 22 H38 Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <rect
      x="26"
      y="34"
      width="36"
      height="50"
      rx="6"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <rect
      x="22"
      y="84"
      width="44"
      height="10"
      rx="3"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    {/* Nyala Api di Dalam Lentera */}
    <path
      d="M44 46 C36 56 38 68 44 70 C50 68 52 56 44 46 Z"
      fill="#F97316"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 26. TebakSurahCoverSvg: Gulungan kitab dan awan
export const TebakSurahCoverSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="tebakSurahCover"
    className={className}
  >
    {/* Gulungan Kitab */}
    <rect
      x="34"
      y="20"
      width="60"
      height="72"
      rx="6"
      fill="#FDE68A"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <text
      x="64"
      y="62"
      textAnchor="middle"
      fontSize="34"
      fontWeight="900"
      fill="#F97316"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      paintOrder="stroke"
    >
      ؟
    </text>
    {/* Awan Putih di Bawah */}
    <path
      d="M28 98 C16 98 14 82 26 78 C30 64 50 64 56 74 C66 62 88 66 90 80 C104 80 104 98 90 98 Z"
      fill="#E0F2FE"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

// 27. CoverRodaHijaiyahSvg: Roda putar huruf hijaiyah
export const CoverRodaHijaiyahSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="coverRodaHijaiyah"
    className={className}
  >
    {/* 4 Sektor Warna Roda */}
    <path
      d="M64 64 L64 16 A48 48 0 0 1 112 64 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <path
      d="M64 64 L112 64 A48 48 0 0 1 64 112 Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <path
      d="M64 64 L64 112 A48 48 0 0 1 16 64 Z"
      fill="#10B981"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <path
      d="M64 64 L16 64 A48 48 0 0 1 64 16 Z"
      fill="#3B82F6"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Poros Tengah */}
    <circle
      cx="64"
      cy="64"
      r="12"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Jarum Penunjuk Atas */}
    <polygon
      points="54,8 74,8 64,26"
      fill="#F97316"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

// ============================================================================
// KATEGORI 3: PANEL HERO & BUKU (28 - 33)
// ============================================================================

// 28. HeroStreakSvg: Api unggun menyala
export const HeroStreakSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="heroStreak"
    className={className}
  >
    {/* Kayu Bakar Menyilang di Bawah */}
    <rect
      x="22"
      y="92"
      width="84"
      height="16"
      rx="6"
      transform="rotate(-12 64 100)"
      fill="#92400E"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <rect
      x="22"
      y="92"
      width="84"
      height="16"
      rx="6"
      transform="rotate(12 64 100)"
      fill="#B45309"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Lidah Api Luar Oranye */}
    <path
      d="M64 14 C32 42 26 76 46 92 C58 100 70 100 82 92 C102 76 96 42 64 14 Z"
      fill="#F97316"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Lidah Api Dalam Kuning */}
    <path
      d="M64 42 C48 60 46 80 56 90 C62 94 66 94 72 90 C82 80 80 60 64 42 Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

// 29. HeroKartuNgajiSvg: Tumpukan kartu huruf
export const HeroKartuNgajiSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="heroKartuNgaji"
    className={className}
  >
    {/* Kartu Belakang Kiri */}
    <rect
      x="22"
      y="24"
      width="56"
      height="78"
      rx="8"
      transform="rotate(-14 50 63)"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Kartu Tengah Kanan */}
    <rect
      x="50"
      y="24"
      width="56"
      height="78"
      rx="8"
      transform="rotate(12 78 63)"
      fill="#34D399"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Kartu Utama Depan */}
    <rect
      x="36"
      y="22"
      width="56"
      height="80"
      rx="8"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <rect
      x="44"
      y="30"
      width="40"
      height="64"
      rx="4"
      fill="#FFFBEB"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <text
      x="64"
      y="74"
      textAnchor="middle"
      fontSize="34"
      fontWeight="900"
      fill="var(--svg-primary)"
    >
      أ
    </text>
  </svg>
);

// 30. HeroLanjutkanSvg: Panah melengkung ke bintang
export const HeroLanjutkanSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="heroLanjutkan"
    className={className}
  >
    {/* Jalur Panah Melengkung */}
    <path
      d="M20 98 C24 58 48 48 76 52"
      stroke="var(--svg-primary)"
      strokeWidth="14"
      strokeLinecap="round"
    />
    <path
      d="M20 98 C24 58 48 48 76 52"
      stroke="#34D399"
      strokeWidth="7"
      strokeLinecap="round"
    />
    {/* Kepala Panah */}
    <polygon
      points="68,38 88,52 68,66"
      fill="#34D399"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Bintang Tujuan */}
    <polygon
      points="98,18 103,30 116,32 106,41 109,54 98,47 87,54 90,41 80,32 93,30"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
  </svg>
);

// 31. HeroNyawaHabisSvg: Hati pecah yang lucu
export const HeroNyawaHabisSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="heroNyawaHabis"
    className={className}
  >
    {/* Bentuk Hati Utama */}
    <path
      d="M64 106 C64 106 16 76 16 44 C16 26 32 18 46 24 C56 28 64 38 64 38 C64 38 72 28 82 24 C96 18 112 26 112 44 C112 76 64 106 64 106 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Retakan Zig-Zag di Tengah */}
    <polyline
      points="64,38 56,54 70,68 58,84 64,106"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Plester Luka Lucu di Kiri Atas */}
    <rect
      x="26"
      y="32"
      width="24"
      height="10"
      rx="4"
      transform="rotate(-25 38 37)"
      fill="#FDE68A"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 32. HeroCobaLagiSvg: Panah berputar (refresh)
export const HeroCobaLagiSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="heroCobaLagi"
    className={className}
  >
    {/* Lingkaran Badge Belakang */}
    <circle cx="67" cy="67" r="46" fill="var(--svg-primary)" />
    <circle
      cx="64"
      cy="64"
      r="46"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    {/* Busur Panah Refresh */}
    <path
      d="M86 54 A24 24 0 1 0 82 78"
      stroke="var(--svg-primary)"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path
      d="M86 54 A24 24 0 1 0 82 78"
      stroke="#FFFFFF"
      strokeWidth="5"
      strokeLinecap="round"
    />
    {/* Ujung Panah */}
    <polygon
      points="72,56 94,58 88,38"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

// 33. BukuTilawatiSvg: Cover buku dengan prop jilid (1-6)
export interface BukuTilawatiProps extends SvgProps {
  jilid?: 1 | 2 | 3 | 4 | 5 | 6 | number;
}

export const BukuTilawatiSvg: React.FC<BukuTilawatiProps> = ({
  size = 128,
  className = "",
  jilid = 1,
}) => {
  const rawId = useId();
  const badgeId = `badge-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const colorMap: Record<number, { cover: string; accent: string }> = {
    1: { cover: "#EF4444", accent: "#FCA5A5" }, // Merah
    2: { cover: "#10B981", accent: "#6EE7B7" }, // Hijau
    3: { cover: "#3B82F6", accent: "#93C5FD" }, // Biru
    4: { cover: "#FBBF24", accent: "#FEF08A" }, // Kuning
    5: { cover: "#A855F7", accent: "#D8B4FE" }, // Ungu
    6: { cover: "#F97316", accent: "#FDBA74" }, // Oranye
  };

  const theme = colorMap[jilid] || colorMap[1];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={`bukuTilawatiJilid${jilid}`}
      className={className}
    >
      <defs>
        <circle
          id={badgeId}
          cx="68"
          cy="68"
          r="18"
          fill="#FFFBEB"
          stroke="var(--svg-primary)"
          strokeWidth="4.5"
        />
      </defs>
      {/* Hard Shadow Buku */}
      <rect
        x="30"
        y="20"
        width="74"
        height="96"
        rx="8"
        fill="var(--svg-primary)"
      />
      {/* Cover Buku Utama */}
      <rect
        x="24"
        y="14"
        width="74"
        height="96"
        rx="8"
        fill={theme.cover}
        stroke="var(--svg-primary)"
        strokeWidth="5"
      />
      {/* Punggung Buku (Spine) di Kiri */}
      <rect
        x="24"
        y="14"
        width="14"
        height="96"
        rx="4"
        fill={theme.accent}
        stroke="var(--svg-primary)"
        strokeWidth="4.5"
      />
      {/* Ornamen Header Atas */}
      <rect
        x="48"
        y="26"
        width="40"
        height="12"
        rx="4"
        fill={theme.accent}
        stroke="var(--svg-primary)"
        strokeWidth="3.5"
      />
      {/* Lingkaran Nomor Jilid */}
      <use href={`#${badgeId}`} />
      <text
        x="68"
        y="75"
        textAnchor="middle"
        fontSize="22"
        fontWeight="900"
        fill="var(--svg-primary)"
        fontFamily="system-ui, sans-serif"
      >
        {jilid}
      </text>
    </svg>
  );
};

/* ============================================================================
 * ILUSTRASI BACKGROUND MENU JELAJAH (Neo-Brutalism, solid + tebal)
 * Digunakan sebagai banner/ornamen latar kartu menu di NgajiCeriaMapPage.
 * ============================================================================ */

/** LabTajwidBgSvg: mikroskop & tabung reaksi berisi huruf hijaiyah, dikelilingi asap warna-warni ceria. */
export const LabTajwidBgSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="labTajwid"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="120" rx="44" ry="7" fill="#000000" opacity="0.2" />
    {/* Rak hastekel meja lab */}
    <rect
      x="12"
      y="104"
      width="104"
      height="10"
      rx="4"
      fill="#065F46"
      stroke="#134E4A"
      strokeWidth="4"
    />
    {/* Asap warna-warni ceria */}
    <path
      d="M28 38 C20 30 22 20 30 16"
      stroke="#EF4444"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M40 30 C38 22 44 14 52 12"
      stroke="#FBBF24"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M88 34 C96 28 98 18 92 10"
      stroke="#3B82F6"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M100 44 C108 40 112 32 108 24"
      stroke="#10B981"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <circle
      cx="34"
      cy="10"
      r="5"
      fill="#EF4444"
      stroke="#134E4A"
      strokeWidth="2.5"
    />
    <circle
      cx="96"
      cy="6"
      r="4"
      fill="#3B82F6"
      stroke="#134E4A"
      strokeWidth="2.5"
    />
    {/* Tabung reaksi utama - Biru Ceria */}
    <rect
      x="49"
      y="30"
      width="30"
      height="76"
      rx="15"
      fill="#ECFDF5"
      stroke="#134E4A"
      strokeWidth="5"
    />
    {/* Zat di dalam tabung - Biru Terang */}
    <path d="M51 66 H77 V91 A15 15 0 0 1 51 91 Z" fill="#3B82F6" />
    {/* Huruf hijaiyah di tabung */}
    <text
      x="64"
      y="52"
      textAnchor="middle"
      fontSize="26"
      fontWeight="700"
      fill="#134E4A"
    >{`\u0646`}</text>
    <text
      x="64"
      y="86"
      textAnchor="middle"
      fontSize="22"
      fontWeight="700"
      fill="#FFFFFF"
    >{`\u0628`}</text>
    {/* Tabung kecil kiri - Kuning Cerah */}
    <rect
      x="14"
      y="66"
      width="20"
      height="40"
      rx="10"
      fill="#FEF3C7"
      stroke="#134E4A"
      strokeWidth="4"
    />
    <path d="M16 92 H32 V96 A10 10 0 0 1 13 96 Z" fill="#FBBF24" />
    <text
      x="24"
      y="82"
      textAnchor="middle"
      fontSize="15"
      fontWeight="700"
      fill="#134E4A"
    >{`\u0645`}</text>
    {/* Erlenmeyer kanan - Merah Cerah */}
    <path
      d="M94 66 L94 84 L104 104 L112 104 L114 66 Z"
      fill="#FFF1F2"
      stroke="#134E4A"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path d="M96 96 L113 96 L104 104 Z" fill="#EF4444" />
    <text
      x="104"
      y="90"
      textAnchor="middle"
      fontSize="14"
      fontWeight="700"
      fill="#134E4A"
    >{`\u0639`}</text>
  </svg>
);

/** MetronomeArtSvg: ilustrasi metronom musikal Neo-Brutalism dengan jarum berayun dan not balok ceria. */
export const MetronomeArtSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="metronome"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="120" rx="44" ry="7" fill="#000000" opacity="0.2" />
    {/* Kaki dasar metronom */}
    <rect
      x="32"
      y="110"
      width="12"
      height="8"
      rx="2"
      fill="#78350F"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <rect
      x="84"
      y="110"
      width="12"
      height="8"
      rx="2"
      fill="#78350F"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    {/* Badan piramida kayu metronom */}
    <path
      d="M48 24 L24 112 H104 L80 24 H48 Z"
      fill="#D97706"
      stroke="#134E4A"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Muka plat depan (krem) */}
    <path
      d="M52 32 L34 104 H94 L76 32 H52 Z"
      fill="#FEF3C7"
      stroke="#134E4A"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Skala garis tempo */}
    <path
      d="M44 56 H84 M42 72 H86 M40 88 H88"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Jarum pendulum berayun miring */}
    <g transform="rotate(18 64 102)">
      <line
        x1="64"
        y1="102"
        x2="64"
        y2="28"
        stroke="#134E4A"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Pemberat bandul geser (emas & merah) */}
      <rect
        x="54"
        y="46"
        width="20"
        height="18"
        rx="4"
        fill="#FBBF24"
        stroke="#134E4A"
        strokeWidth="3.5"
      />
      <circle
        cx="64"
        cy="55"
        r="4"
        fill="#EF4444"
        stroke="#134E4A"
        strokeWidth="2"
      />
    </g>
    {/* Not musik berterbangan ceria */}
    <g>
      <circle
        cx="22"
        cy="38"
        r="6"
        fill="#3B82F6"
        stroke="#134E4A"
        strokeWidth="3"
      />
      <path
        d="M28 38 V18 H38"
        stroke="#134E4A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle
        cx="106"
        cy="32"
        r="5"
        fill="#EF4444"
        stroke="#134E4A"
        strokeWidth="2.5"
      />
      <path
        d="M111 32 V16 H120"
        stroke="#134E4A"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
    {/* Kilatan / bintang irama */}
    <path
      d="M18 68 L24 64 M20 78 L26 80"
      stroke="#FBBF24"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M106 68 L112 64 M108 78 L114 80"
      stroke="#10B981"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

/** GalaksiJuzAmmaBgSvg: tata surya berplanet-bercincin, bintang membentuk huruf Arab. */
export const GalaksiJuzAmmaBgSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="galaksiJuzAmma"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="120" rx="44" ry="7" fill="#000000" opacity="0.2" />
    {/* Orbit */}
    <ellipse
      cx="62"
      cy="64"
      rx="52"
      ry="26"
      stroke="#134E4A"
      strokeWidth="3.5"
      fill="none"
    />
    {/* Bintang membentuk huruf Arab (Ya) */}
    <g stroke="#FBBF24" strokeWidth="3" strokeLinecap="round">
      <path d="M78 20 L88 44" />
      <path d="M88 44 L104 20" />
    </g>
    <polygon
      points="78,20 82,28 74,28"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="2"
    />
    <path
      d="M88 44 L104 20"
      stroke="#FBBF24"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Planet cincin besar ungu (kiri atas) */}
    <circle
      cx="30"
      cy="30"
      r="14"
      fill="#8B5CF6"
      stroke="#134E4A"
      strokeWidth="4"
    />
    <ellipse
      cx="30"
      cy="30"
      rx="24"
      ry="7"
      stroke="#134E4A"
      strokeWidth="3.5"
      fill="none"
      transform="rotate(-18 30 30)"
    />
    <circle cx="26" cy="25" r="4" fill="#DDD6FE" />
    {/* Planet kecil biru muda (kanan) */}
    <circle
      cx="108"
      cy="56"
      r="8"
      fill="#0EA5E9"
      stroke="#134E4A"
      strokeWidth="4"
    />
    <ellipse
      cx="108"
      cy="56"
      rx="15"
      ry="4"
      stroke="#134E4A"
      strokeWidth="3"
      fill="none"
      transform="rotate(14 108 56)"
    />
    {/* Bumi/planet berhuruf hijau (pusat) */}
    <circle
      cx="62"
      cy="64"
      r="24"
      fill="#10B981"
      stroke="#134E4A"
      strokeWidth="5"
    />
    <path
      d="M46 58 Q56 50 66 56 Q74 60 78 54"
      stroke="#047857"
      strokeWidth="3"
      fill="none"
    />
    <text
      x="62"
      y="74"
      textAnchor="middle"
      fontSize="24"
      fontWeight="700"
      fill="#FFFFFF"
    >{`\u0642`}</text>
    {/* Roket mini merah */}
    <g transform="rotate(28 112 92)">
      <path
        d="M104 96 Q112 84 120 96 Q112 100 104 96 Z"
        fill="#EF4444"
        stroke="#134E4A"
        strokeWidth="3.5"
      />
      <path
        d="M104 96 L100 100 M107 102 L104 104"
        stroke="#F59E0B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </g>
    {/* Bintang titik kuning */}
    <rect
      x="14"
      y="84"
      width="8"
      height="8"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="2"
      transform="rotate(45 18 88)"
    />
    <rect
      x="118"
      y="22"
      width="6"
      height="6"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="2"
      transform="rotate(45 121 25)"
    />
  </svg>
);

/** GudangDoaSvg: peti harta terbuka berisi gulungan doa dan lentera. */
export const GudangDoaSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="gudangDoa"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="120" rx="46" ry="7" fill="#000000" opacity="0.2" />
    {/* Cahaya kuning keluar dari peti */}
    <path
      d="M40 70 L22 30 L46 40 Z"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="3"
    />
    <path
      d="M88 70 L106 30 L82 40 Z"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="3"
    />
    {/* Tutup peti terbuka cokelat */}
    <path
      d="M30 56 V44 C30 30 44 22 64 22 C84 22 98 30 98 44 V56 Z"
      fill="#B45309"
      stroke="#134E4A"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path
      d="M38 34 C46 28 54 28 64 28"
      stroke="#FEF08A"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Badan peti */}
    <rect
      x="24"
      y="70"
      width="80"
      height="46"
      rx="8"
      fill="#D97706"
      stroke="#134E4A"
      strokeWidth="5"
    />
    <rect
      x="24"
      y="64"
      width="80"
      height="10"
      fill="#92400E"
      stroke="#134E4A"
      strokeWidth="4"
    />
    {/* Gembok emas */}
    <rect
      x="56"
      y="78"
      width="16"
      height="14"
      rx="3"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <path
      d="M60 78 V73 A4 4 0 0 1 68 73 V78"
      stroke="#134E4A"
      strokeWidth="3.5"
      fill="none"
    />
    {/* Gulungan doa keluar */}
    <rect
      x="38"
      y="38"
      width="34"
      height="26"
      rx="4"
      fill="#FFFBEB"
      stroke="#134E4A"
      strokeWidth="3.5"
      transform="rotate(-8 55 51)"
    />
    <path
      d="M44 46 H62 M44 52 H58"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinecap="round"
      transform="rotate(-8 55 51)"
    />
    <ellipse
      cx="36"
      cy="62"
      rx="5"
      ry="14"
      fill="#FEF3C7"
      stroke="#134E4A"
      strokeWidth="3"
    />
    {/* Gulungan doa kecil kanan */}
    <rect
      x="82"
      y="40"
      width="22"
      height="20"
      rx="3"
      fill="#FFFBEB"
      stroke="#134E4A"
      strokeWidth="3.5"
      transform="rotate(10 93 50)"
    />
    <path
      d="M86 48 H96"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinecap="round"
      transform="rotate(10 93 50)"
    />
    {/* Lentera merah-kuning */}
    <g>
      <rect
        x="104"
        y="76"
        width="16"
        height="22"
        rx="6"
        fill="#EF4444"
        stroke="#134E4A"
        strokeWidth="4"
      />
      <rect
        x="106"
        y="72"
        width="12"
        height="5"
        rx="2"
        fill="#FBBF24"
        stroke="#134E4A"
        strokeWidth="3"
      />
      <rect
        x="106"
        y="98"
        width="12"
        height="5"
        rx="2"
        fill="#FBBF24"
        stroke="#134E4A"
        strokeWidth="3"
      />
      <path
        d="M110 72 L112 66 L114 72"
        stroke="#134E4A"
        strokeWidth="3"
        fill="none"
      />
      <path d="M112 80 L114 87 L112 84 L110 88" fill="#FEF08A" />
    </g>
    {/* Kilarkan kuning */}
    <path
      d="M18 62 L22 68 M14 76 L18 80"
      stroke="#FBBF24"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/** TargetTahfidzSvg: papan bullseye besar dengan bendera kemenangan. */
export const TargetTahfidzSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="targetTahfidz"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="120" rx="42" ry="7" fill="#000000" opacity="0.2" />
    {/* Kaki target kayu */}
    <rect
      x="44"
      y="90"
      width="8"
      height="26"
      fill="#A16207"
      stroke="#134E4A"
      strokeWidth="4"
    />
    <rect
      x="76"
      y="90"
      width="8"
      height="26"
      fill="#A16207"
      stroke="#134E4A"
      strokeWidth="4"
    />
    {/* Papan target: putih & merah cerah */}
    <circle
      cx="64"
      cy="62"
      r="40"
      fill="#FFF7ED"
      stroke="#134E4A"
      strokeWidth="5"
    />
    <circle
      cx="64"
      cy="62"
      r="28"
      fill="#EF4444"
      stroke="#134E4A"
      strokeWidth="4"
    />
    <circle
      cx="64"
      cy="62"
      r="17"
      fill="#FFFFFF"
      stroke="#134E4A"
      strokeWidth="4"
    />
    <circle
      cx="64"
      cy="62"
      r="7"
      fill="#EF4444"
      stroke="#134E4A"
      strokeWidth="2"
    />
    {/* Bendera kemenangan di tengah: tiang tebal & bendera hijau ceria */}
    <path
      d="M64 62 V8"
      stroke="#134E4A"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M64 10 L96 18 L64 26 Z"
      fill="#10B981"
      stroke="#134E4A"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <circle
      cx="64"
      cy="6"
      r="5"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="3"
    />
    {/* Panah mengenai target */}
    <path
      d="M14 82 L38 74"
      stroke="#134E4A"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M38 74 L44 70 L40 77 Z"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="2"
    />
    <path
      d="M16 92 L34 90"
      stroke="#134E4A"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M34 90 L39 88 L36 93 Z"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="2"
    />
    {/* Kilarkan kuning */}
    <path
      d="M104 34 L110 30 M108 42 L114 40"
      stroke="#FBBF24"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/** JurnalIbadahSvg: jam pasir besar dengan buku checklist centang. */
export const JurnalIbadahSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="jurnalIbadah"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="120" rx="44" ry="7" fill="#000000" opacity="0.2" />
    {/* Jam pasir kayu */}
    <rect
      x="24"
      y="20"
      width="34"
      height="6"
      rx="3"
      fill="#92400E"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <rect
      x="24"
      y="94"
      width="34"
      height="6"
      rx="3"
      fill="#92400E"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <path
      d="M30 26 L34 44 Q36 52 40 56 Q44 60 42 66 Q40 74 34 74 L32 96"
      fill="#FEF9C3"
      stroke="#134E4A"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path
      d="M52 26 L48 44 Q46 52 42 56 Q38 60 40 66 Q42 74 48 74 L50 96"
      fill="#FEF9C3"
      stroke="#134E4A"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path
      d="M36 34 H46 Q42 46 41 52 Q41 56 47 60 Q48 66 40 66 Q34 62 35 54 Z"
      fill="#FBBF24"
    />
    <path
      d="M35 88 H48 Q46 80 45 78 Q40 76 41 74 L40 70 Q36 72 36 88 Z"
      fill="#FBBF24"
    />
    {/* Buku catatan */}
    <rect
      x="58"
      y="52"
      width="52"
      height="64"
      rx="8"
      fill="#FFFBEB"
      stroke="#134E4A"
      strokeWidth="5"
    />
    <rect
      x="58"
      y="52"
      width="12"
      height="64"
      fill="#10B981"
      stroke="#134E4A"
      strokeWidth="5"
    />
    <path
      d="M78 66 H102"
      stroke="#134E4A"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M78 84 H102"
      stroke="#134E4A"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M78 102 H94"
      stroke="#134E4A"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Checklist centang hijau */}
    <rect
      x="72"
      y="60"
      width="12"
      height="12"
      rx="3"
      fill="#BBF7D0"
      stroke="#134E4A"
      strokeWidth="3"
    />
    <path
      d="M75 66 L77 68.5 L81 63"
      stroke="#10B981"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <rect
      x="72"
      y="78"
      width="12"
      height="12"
      rx="3"
      fill="#BBF7D0"
      stroke="#134E4A"
      strokeWidth="3"
    />
    <path
      d="M75 84 L77 86.5 L81 81"
      stroke="#10B981"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Streak api merah */}
    <path
      d="M118 44 Q122 36 118 30 Q126 34 124 44 Q122 50 116 48 Q112 46 112 42"
      fill="#EF4444"
      stroke="#134E4A"
      strokeWidth="3"
    />
  </svg>
);

/** ArenaKartuSvg: meja hijau duel dengan dua kartu besar berhadapan. */
export const ArenaKartuSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="arenaKartu"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="120" rx="48" ry="7" fill="#000000" opacity="0.2" />
    {/* Meja hijau */}
    <ellipse
      cx="64"
      cy="88"
      rx="52"
      ry="22"
      fill="#16A34A"
      stroke="#134E4A"
      strokeWidth="5"
    />
    <ellipse
      cx="64"
      cy="86"
      rx="40"
      ry="14"
      fill="#22C55E"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    {/* Kaki meja */}
    <rect
      x="34"
      y="100"
      width="8"
      height="16"
      fill="#7C2D12"
      stroke="#134E4A"
      strokeWidth="4"
    />
    <rect
      x="86"
      y="100"
      width="8"
      height="16"
      fill="#7C2D12"
      stroke="#134E4A"
      strokeWidth="4"
    />
    {/* Kartu kiri (menang, berdiri, putih) */}
    <g transform="rotate(-12 40 44)">
      <rect
        x="26"
        y="22"
        width="28"
        height="40"
        rx="5"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="4.5"
      />
      <text
        x="40"
        y="50"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="#134E4A"
      >{`\u0643`}</text>
      <rect x="32" y="54" width="14" height="3" rx="1.5" fill="#EF4444" />
    </g>
    {/* Kartu kanan (terbalik, biru muda cerah) */}
    <g transform="rotate(12 90 44)">
      <rect
        x="74"
        y="22"
        width="28"
        height="40"
        rx="5"
        fill="#0EA5E9"
        stroke="#134E4A"
        strokeWidth="4.5"
      />
      <circle
        cx="88"
        cy="38"
        r="8"
        fill="#BAE6FD"
        stroke="#134E4A"
        strokeWidth="3"
      />
      <rect x="78" y="52" width="20" height="4" rx="2" fill="#BAE6FD" />
    </g>
    {/* Kilarkan kuning bertabrakan di tengah */}
    <path
      d="M64 30 L64 18 M58 26 L54 20 M70 26 L74 20"
      stroke="#FBBF24"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Chip token merah & kuning */}
    <circle
      cx="48"
      cy="96"
      r="7"
      fill="#EF4444"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <circle cx="48" cy="96" r="3" fill="#FFF7ED" />
    <circle
      cx="82"
      cy="94"
      r="7"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="3.5"
    />
    <circle cx="82" cy="94" r="3" fill="#FFF7ED" />
  </svg>
);

// ============================================================================
// KATEGORI 4: ASET GAME FRUIT NINJA / HIJAIYAH SLICE (WHOLE & SLICED FRUITS)
// ============================================================================

// 1. Buah Apel (Whole)
export const BuahApelSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="buahApel"
    className={className}
    style={style}
  >
    <ellipse cx="66" cy="114" rx="38" ry="7" fill="var(--svg-primary)" />
    {/* Tangkai & Daun */}
    <path
      d="M64 26 C64 16 74 14 78 20 C72 26 66 26 64 26 Z"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path
      d="M64 28 V18"
      stroke="#78350F"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Badan Apel */}
    <path
      d="M64 34 C40 34 30 52 30 72 C30 96 46 108 64 102 C82 108 98 96 98 72 C98 52 88 34 64 34 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Area Kosong Tengah untuk Teks/Harakat */}
    <circle
      cx="64"
      cy="74"
      r="24"
      fill="#FEF2F2"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 2. Potongan Apel (Sliced)
export const PotonganApelSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="potonganApel"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="38" ry="7" fill="var(--svg-primary)" />
    <path
      d="M26 72 C26 42 46 28 64 28 C82 28 102 42 102 72 C102 96 84 104 64 104 C44 104 26 96 26 72 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Daging & Biji */}
    <path
      d="M34 72 C34 48 48 36 64 36 C80 36 94 48 94 72 C94 92 80 96 64 96 C48 96 34 92 34 72 Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <ellipse cx="56" cy="70" rx="3.5" ry="5" fill="var(--svg-primary)" />
    <ellipse cx="72" cy="70" rx="3.5" ry="5" fill="var(--svg-primary)" />
  </svg>
);

// 3. Buah Semangka Slice (Whole/Wedge)
export const BuahSemangkaSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="buahSemangka"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="42" ry="7" fill="var(--svg-primary)" />
    {/* Kulit Luar Hijau */}
    <path
      d="M20 86 C20 50 40 30 64 30 C88 30 108 50 108 86 Z"
      fill="#10B981"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Daging Merah & Area Teks */}
    <path
      d="M28 86 C28 56 44 38 64 38 C84 38 100 56 100 86 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <circle
      cx="64"
      cy="68"
      r="18"
      fill="#FEE2E2"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
  </svg>
);

// 4. Potongan Semangka (Sliced)
export const PotonganSemangkaSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="potonganSemangka"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="42" ry="7" fill="var(--svg-primary)" />
    <path
      d="M20 90 L64 30 L108 90 Z"
      fill="#10B981"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path
      d="M28 90 L64 42 L100 90 Z"
      fill="#EF4444"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Biji Hitam Solid */}
    <circle cx="52" cy="74" r="3.5" fill="var(--svg-primary)" />
    <circle cx="64" cy="64" r="3.5" fill="var(--svg-primary)" />
    <circle cx="76" cy="74" r="3.5" fill="var(--svg-primary)" />
  </svg>
);

// 5. Buah Jeruk (Whole)
export const BuahJerukSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="buahJeruk"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="38" ry="7" fill="var(--svg-primary)" />
    <path
      d="M64 28 C64 18 72 16 76 22 C70 26 66 26 64 28 Z"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <circle
      cx="64"
      cy="72"
      r="38"
      fill="#F97316"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <circle
      cx="64"
      cy="72"
      r="22"
      fill="#FFEDD5"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 6. Potongan Jeruk (Sliced)
export const PotonganJerukSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="potonganJeruk"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="38" ry="7" fill="var(--svg-primary)" />
    <circle
      cx="64"
      cy="72"
      r="38"
      fill="#EA580C"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <circle
      cx="64"
      cy="72"
      r="30"
      fill="#F97316"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    {/* Segmen Jeruk */}
    <path
      d="M64 42 V102 M34 72 H94 M43 51 L85 93 M43 93 L85 51"
      stroke="#FFEDD5"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <circle
      cx="64"
      cy="72"
      r="8"
      fill="#FFEDD5"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
  </svg>
);

// 7. Buah Anggur (Whole)
export const BuahAnggurSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="buahAnggur"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="36" ry="7" fill="var(--svg-primary)" />
    <path
      d="M64 30 C64 18 78 14 82 22 C76 28 68 28 64 30 Z"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Kelompok Buah Anggur */}
    <circle
      cx="64"
      cy="48"
      r="12"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <circle
      cx="50"
      cy="62"
      r="12"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <circle
      cx="78"
      cy="62"
      r="12"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <circle
      cx="64"
      cy="76"
      r="12"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <circle
      cx="50"
      cy="90"
      r="11"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <circle
      cx="78"
      cy="90"
      r="11"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    {/* Area Kosong Tengah */}
    <circle
      cx="64"
      cy="70"
      r="8"
      fill="#F3E8FF"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
  </svg>
);

// 8. Potongan Anggur (Sliced)
export const PotonganAnggurSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="potonganAnggur"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="36" ry="7" fill="var(--svg-primary)" />
    <circle
      cx="64"
      cy="72"
      r="34"
      fill="#9333EA"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <circle
      cx="64"
      cy="72"
      r="24"
      fill="#C084FC"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <circle
      cx="64"
      cy="72"
      r="8"
      fill="#F3E8FF"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
  </svg>
);

// 9. Buah Kurma / Date (Whole)
export const BuahKurmaSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="buahKurma"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="34" ry="7" fill="var(--svg-primary)" />
    <path
      d="M64 26 C64 18 72 16 74 22 C70 26 66 26 64 26 Z"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <ellipse
      cx="64"
      cy="72"
      rx="26"
      ry="38"
      fill="#78350F"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <ellipse
      cx="64"
      cy="72"
      rx="14"
      ry="24"
      fill="#FEF3C7"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 10. Potongan Kurma (Sliced)
export const PotonganKurmaSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="potonganKurma"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="34" ry="7" fill="var(--svg-primary)" />
    <ellipse
      cx="64"
      cy="72"
      rx="26"
      ry="38"
      fill="#451A03"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <ellipse
      cx="64"
      cy="72"
      rx="18"
      ry="30"
      fill="#92400E"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    {/* Biji Kurma di Tengah */}
    <ellipse
      cx="64"
      cy="72"
      rx="5"
      ry="14"
      fill="#FDE68A"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
  </svg>
);

// 11. Buah Pir (Whole)
export const BuahPirSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="buahPir"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="36" ry="7" fill="var(--svg-primary)" />
    <path
      d="M64 24 C64 14 74 12 78 18 C72 22 66 22 64 24 Z"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path
      d="M64 26 V18"
      stroke="#78350F"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M64 32 C50 32 42 46 44 64 C40 84 50 102 64 102 C78 102 88 84 84 64 C86 46 78 32 64 32 Z"
      fill="#84CC16"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <circle
      cx="64"
      cy="74"
      r="20"
      fill="#ECFCCB"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 12. Potongan Pir (Sliced)
export const PotonganPirSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="potonganPir"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="36" ry="7" fill="var(--svg-primary)" />
    <path
      d="M64 28 C50 28 42 44 44 64 C40 84 50 102 64 102 C78 102 88 84 84 64 C86 44 78 28 64 28 Z"
      fill="#65A30D"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path
      d="M64 36 C54 36 48 48 50 64 C47 80 54 94 64 94 C74 94 81 80 78 64 C80 48 74 36 64 36 Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <ellipse cx="64" cy="68" rx="4" ry="8" fill="var(--svg-primary)" />
  </svg>
);

// 13. Buah Stroberi (Whole)
export const BuahStroberiSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="buahStroberi"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="34" ry="7" fill="var(--svg-primary)" />
    {/* Mahkota Daun Hijau */}
    <path
      d="M50 36 L64 46 L78 36 L70 48 L84 54 L64 48 L44 54 L58 48 Z"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path
      d="M64 46 V34"
      stroke="#78350F"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Badan Stroberi Kerucut */}
    <path
      d="M42 50 C36 78 50 102 64 102 C78 102 92 78 86 50 Z"
      fill="#F43F5E"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <circle
      cx="64"
      cy="74"
      r="20"
      fill="#FFE4E6"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 14. Potongan Stroberi (Sliced)
export const PotonganStroberiSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="potonganStroberi"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="34" ry="7" fill="var(--svg-primary)" />
    <path
      d="M42 50 C36 78 50 102 64 102 C78 102 92 78 86 50 Z"
      fill="#E11D48"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path
      d="M48 54 C44 76 54 94 64 94 C74 94 84 76 80 54 Z"
      fill="#FFF1F2"
      stroke="var(--svg-primary)"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path
      d="M64 54 V86 M54 68 H74"
      stroke="#E11D48"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// 15. Buah Pisang (Whole)
export const BuahPisangSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="buahPisang"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="38" ry="7" fill="var(--svg-primary)" />
    <path
      d="M28 88 C40 40 84 32 102 36 C88 56 64 78 40 96 Z"
      fill="#FACC15"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <circle
      cx="68"
      cy="68"
      r="16"
      fill="#FEF9C3"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 16. Potongan Pisang (Sliced)
export const PotonganPisangSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="potonganPisang"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="36" ry="7" fill="var(--svg-primary)" />
    <rect
      x="36"
      y="44"
      width="56"
      height="56"
      rx="28"
      fill="#EAB308"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <rect
      x="44"
      y="52"
      width="40"
      height="40"
      rx="20"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    <circle cx="64" cy="72" r="6" fill="var(--svg-primary)" />
  </svg>
);

// ============================================================================
// KATEGORI 5: VISUAL EFFECTS & UI ENVIRONMENT (NEO-BRUTALISM)
// ============================================================================

// 17. Sabetan Pedang (Crescent Sword Slash Arc)
export const SabetanPedangSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="sabetanPedang"
    className={className}
    style={style}
  >
    <path
      d="M16 112 C32 40 88 16 112 16 C88 32 48 64 32 112 Z"
      fill="#22D3EE"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path
      d="M28 104 C40 56 80 32 96 32 C80 44 52 68 40 104 Z"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
  </svg>
);

// 18. Cipratan Jus (Juice Splatter)
export const CipratanJusSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="cipratanJus"
    className={className}
    style={style}
  >
    <path
      d="M64 48 C72 32 88 36 84 52 C96 52 100 68 88 74 C92 92 72 96 68 84 C56 96 40 88 48 74 C32 68 36 52 48 52 C44 36 60 32 64 48 Z"
      fill="#F43F5E"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <circle
      cx="24"
      cy="40"
      r="8"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <circle
      cx="104"
      cy="88"
      r="10"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <circle
      cx="96"
      cy="28"
      r="6"
      fill="#34D399"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// 19. Papan Kayu Skor (Wide Wooden Signboard)
export const PapanKayuSkorSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="papanKayuSkor"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="116" rx="46" ry="7" fill="var(--svg-primary)" />
    {/* Tiang Kayu */}
    <rect
      x="42"
      y="68"
      width="12"
      height="48"
      fill="#78350F"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <rect
      x="74"
      y="68"
      width="12"
      height="48"
      fill="#78350F"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    {/* Papan Utama */}
    <rect
      x="16"
      y="32"
      width="96"
      height="48"
      rx="8"
      fill="#B45309"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <rect
      x="22"
      y="38"
      width="84"
      height="36"
      rx="4"
      fill="#D97706"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    {/* Paku Neo-Brutalism */}
    <circle cx="28" cy="46" r="3.5" fill="var(--svg-primary)" />
    <circle cx="100" cy="46" r="3.5" fill="var(--svg-primary)" />
    <circle cx="28" cy="66" r="3.5" fill="var(--svg-primary)" />
    <circle cx="100" cy="66" r="3.5" fill="var(--svg-primary)" />
  </svg>
);

// 20. Plakat Target Harakat (Square Wooden Plaque)
export const PlakatTargetHarakatSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="plakatTarget"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="116" rx="40" ry="7" fill="var(--svg-primary)" />
    <rect
      x="24"
      y="20"
      width="80"
      height="80"
      rx="12"
      fill="var(--svg-primary)"
    />
    <rect
      x="20"
      y="16"
      width="80"
      height="80"
      rx="12"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <rect
      x="32"
      y="28"
      width="56"
      height="56"
      rx="8"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
  </svg>
);

// 21. Lantai Dojo (Wooden Dojo Floor Platform)
export const LantaiDojoSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="lantaiDojo"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="114" rx="52" ry="9" fill="var(--svg-primary)" />
    <rect
      x="14"
      y="44"
      width="100"
      height="64"
      rx="8"
      fill="#78350F"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    <rect
      x="20"
      y="52"
      width="88"
      height="48"
      rx="4"
      fill="#92400E"
      stroke="var(--svg-primary)"
      strokeWidth="4"
    />
    {/* Garis Papan Lantai */}
    <line x1="20" y1="68" x2="108" y2="68" stroke="#78350F" strokeWidth="4" />
    <line x1="20" y1="84" x2="108" y2="84" stroke="#78350F" strokeWidth="4" />
  </svg>
);

// 22. Awan Putih (Fluffy Cloud)
export const AwanPutihSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="awanPutih"
    className={className}
    style={style}
  >
    <ellipse cx="66" cy="94" rx="40" ry="6" fill="var(--svg-primary)" />
    <path
      d="M30 84 C18 84 14 66 30 58 C26 40 48 34 58 48 C68 32 94 38 94 58 C108 62 106 84 90 84 Z"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

// 23. Batang Bambu (Green Bamboo Stalk)
export const BatangBambuSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="batangBambu"
    className={className}
    style={style}
  >
    <ellipse cx="64" cy="116" rx="20" ry="6" fill="var(--svg-primary)" />
    <rect
      x="48"
      y="16"
      width="32"
      height="96"
      rx="8"
      fill="#22C55E"
      stroke="var(--svg-primary)"
      strokeWidth="5"
    />
    {/* Ruas Bambu */}
    <path
      d="M48 44 H80 M48 76 H80"
      stroke="var(--svg-primary)"
      strokeWidth="4.5"
    />
    <ellipse
      cx="64"
      cy="44"
      rx="16"
      ry="4"
      fill="#16A34A"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
    <ellipse
      cx="64"
      cy="76"
      rx="16"
      ry="4"
      fill="#16A34A"
      stroke="var(--svg-primary)"
      strokeWidth="3.5"
    />
  </svg>
);

// ============================================================================
// KATEGORI 6: BOLA GASING / ROLLING BALL ANIMATION COMPONENT
// ============================================================================

export const BolaGasingSvg: React.FC<SvgProps> = ({
  size = 128,
  className = "",
  style,
}) => {
  const gasingId = useId();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="bolaGasing"
      className={className}
      style={style}
    >
      <defs>
        <radialGradient id={`gasingGrad-${gasingId}`} cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
      </defs>
      {/* Bayangan Bawah */}
      <ellipse cx="64" cy="114" rx="32" ry="6" fill="var(--svg-primary)" />

      {/* Bola Gasing Utama dengan Framer Motion / SVG animateTransform untuk menggelinding & berputar */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 64 64"
          to="360 64 64"
          dur="1.2s"
          repeatCount="indefinite"
        />
        {/* Badan Bola */}
        <circle
          cx="64"
          cy="64"
          r="42"
          fill={`url(#gasingGrad-${gasingId})`}
          stroke="var(--svg-primary)"
          strokeWidth="5"
        />
        {/* Garis Belang Gasing (Efek Roda Bergulir) */}
        <path
          d="M64 22 C78 44 78 84 64 106"
          stroke="var(--svg-primary)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M22 64 C44 78 84 78 106 64"
          stroke="var(--svg-primary)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Poros / Pusat Gasing */}
        <circle
          cx="64"
          cy="64"
          r="10"
          fill="#FFFFFF"
          stroke="var(--svg-primary)"
          strokeWidth="3.5"
        />
        <circle cx="64" cy="64" r="4" fill="var(--svg-primary)" />
      </g>
    </svg>
  );
};

// 26. ChairSvg (Ilustrasi Kursi Neo-Brutalism untuk Soal Bahasa Arab "كُرْسِيٌّ")
export const ChairSvg: React.FC<SvgProps> = ({
  size = 120,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 120"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="kursi"
    className={className}
    style={style}
    {...props}
  >
    {/* Shadow lantai */}
    <ellipse cx="60" cy="110" rx="36" ry="6" fill="#CBD5E1" />

    {/* Kaki Belakang Kiri & Kanan */}
    <rect
      x="36"
      y="65"
      width="6"
      height="42"
      rx="3"
      fill="#B45309"
      stroke="#0F172A"
      strokeWidth="3"
    />
    <rect
      x="78"
      y="65"
      width="6"
      height="42"
      rx="3"
      fill="#B45309"
      stroke="#0F172A"
      strokeWidth="3"
    />

    {/* Palang Penghubung Kaki */}
    <rect
      x="32"
      y="86"
      width="56"
      height="5"
      rx="2.5"
      fill="#D97706"
      stroke="#0F172A"
      strokeWidth="2.5"
    />

    {/* Sandaran Kursi (Backrest Posts) */}
    <rect
      x="34"
      y="16"
      width="6"
      height="52"
      rx="3"
      fill="#D97706"
      stroke="#0F172A"
      strokeWidth="3"
    />
    <rect
      x="80"
      y="16"
      width="6"
      height="52"
      rx="3"
      fill="#D97706"
      stroke="#0F172A"
      strokeWidth="3"
    />

    {/* Bilah Sandaran Horizontal Atas */}
    <rect
      x="30"
      y="14"
      width="60"
      height="14"
      rx="5"
      fill="#F59E0B"
      stroke="#0F172A"
      strokeWidth="3.5"
    />
    {/* Bilah Sandaran Horizontal Tengah */}
    <rect
      x="34"
      y="34"
      width="52"
      height="10"
      rx="4"
      fill="#FBBF24"
      stroke="#0F172A"
      strokeWidth="3"
    />

    {/* Dudukan Kursi (Seat Cushion / Wood) */}
    <path
      d="M26 62 C26 58 30 56 36 56 L84 56 C90 56 94 58 94 62 L90 72 C90 74 88 76 84 76 L36 76 C32 76 30 74 30 72 Z"
      fill="#FBBF24"
      stroke="#0F172A"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Aksen Highlight Dudukan */}
    <path
      d="M34 60 L86 60"
      stroke="#FEF08A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Kaki Depan Kiri & Kanan (Menonjol di depan) */}
    <rect
      x="28"
      y="70"
      width="7"
      height="38"
      rx="3.5"
      fill="#F59E0B"
      stroke="#0F172A"
      strokeWidth="3"
    />
    <rect
      x="85"
      y="70"
      width="7"
      height="38"
      rx="3.5"
      fill="#F59E0B"
      stroke="#0F172A"
      strokeWidth="3"
    />
  </svg>
);

// 27. QuizHubCoverSvg (Cover Kartu Game Pusat Kuis Neo-Brutalism: Piala + Kitab Terbuka)
export const QuizHubCoverSvg: React.FC<SvgProps> = ({
  size = 120,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 140 140"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="quizHubCover"
    className={className}
    style={style}
    {...props}
  >
    {/* Latar Belakang Kartu Bulat Neo-Brutalism */}
    <circle
      cx="70"
      cy="70"
      r="62"
      fill="#FEF08A"
      stroke="#0F172A"
      strokeWidth="4"
    />
    <circle cx="70" cy="70" r="54" fill="#FDE047" />

    {/* Sparkles / Bintang Sudut */}
    <path
      d="M26 30 L29 20 L32 30 L42 33 L32 36 L29 46 L26 36 L16 33 Z"
      fill="#F59E0B"
      stroke="#0F172A"
      strokeWidth="2"
    />
    <path
      d="M110 32 L112 24 L114 32 L122 34 L114 36 L112 44 L110 36 L102 34 Z"
      fill="#38BDF8"
      stroke="#0F172A"
      strokeWidth="2"
    />

    {/* Kitab Terbuka (Base) */}
    <g transform="translate(18, 56)">
      {/* Bayangan Kitab */}
      <path
        d="M10 50 C24 45 42 46 52 52 C62 46 80 45 94 50 L98 56 C80 50 62 51 52 57 C42 51 24 50 6 56 Z"
        fill="#0F172A"
      />
      {/* Sampul Kiri & Kanan */}
      <path
        d="M10 46 C24 41 42 42 52 48 L52 24 C42 18 24 17 10 22 Z"
        fill="#38BDF8"
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M94 46 C80 41 62 42 52 48 L52 24 C62 18 80 17 94 22 Z"
        fill="#0EA5E9"
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Halaman Kiri & Kanan */}
      <path
        d="M14 42 C26 37 42 38 50 44 L50 20 C42 14 26 13 14 18 Z"
        fill="#FFFFFF"
        stroke="#0F172A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M90 42 C78 37 62 38 54 44 L54 20 C62 14 78 13 90 18 Z"
        fill="#F8FAFC"
        stroke="#0F172A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Garis Baris Teks Kitab */}
      <path
        d="M20 24 L44 21"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 30 L44 27"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 36 L38 33"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M60 21 L84 24"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M60 27 L84 30"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M66 33 L84 36"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    {/* Piala Emas Juara (Trophy) di Atas Kitab */}
    <g transform="translate(42, 14)">
      {/* Gagang Kiri Piala */}
      <path
        d="M12 24 C-4 24 -4 40 12 44"
        fill="none"
        stroke="#0F172A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M12 24 C-2 24 -2 40 12 44"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
      />
      {/* Gagang Kanan Piala */}
      <path
        d="M44 24 C60 24 60 40 44 44"
        fill="none"
        stroke="#0F172A"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M44 24 C58 24 58 40 44 44"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="2"
      />
      {/* Mangkuk Piala */}
      <path
        d="M10 16 L46 16 L42 42 C40 50 34 54 28 54 C22 54 16 50 14 42 Z"
        fill="#F59E0B"
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Kilauan Mangkuk Piala */}
      <path
        d="M16 20 L20 20 L18 40"
        stroke="#FEF08A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Bintang di Piala */}
      <path
        d="M28 26 L30 31 L35 31 L31 34 L32 39 L28 36 L24 39 L25 34 L21 31 L26 31 Z"
        fill="#FFFFFF"
        stroke="#0F172A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Leher Piala */}
      <rect
        x="24"
        y="54"
        width="8"
        height="8"
        fill="#D97706"
        stroke="#0F172A"
        strokeWidth="3"
      />
      {/* Alas Piala */}
      <rect
        x="18"
        y="62"
        width="20"
        height="8"
        rx="3"
        fill="#B45309"
        stroke="#0F172A"
        strokeWidth="3"
      />
      <rect x="22" y="64" width="12" height="4" rx="1.5" fill="#FDE047" />
    </g>
  </svg>
);

// ============================================================================
// AVATAR SANTRI SYSTEM (6 Unique Characters - Retro Indie Doodle Syar'i)
// ============================================================================

export type AvatarSantriAccessory =
  | "none"
  | "peci"
  | "hairbow"
  | "flowercrown"
  | "glasses"
  | "crown"
  | "wizardhat"
  | "headphone"
  | "sleepmask"
  | "scarf"
  | "turban"
  | "sunglasses"
  | "chain"
  | "star"
  | "medal"
  | "bandana";

export type AvatarSantriVariant = 1 | 2 | 3;

export interface AvatarSantriSvgProps extends SvgProps {
  gender?: "boy" | "girl";
  variant?: AvatarSantriVariant;
  accessory?: AvatarSantriAccessory | string | null;
  mood?: "idle" | "happy" | "cheer";
}

const INK = "#18181B"; // Crisp medium-thin black outline
const SKIN = "#FFF3EA"; // Soft warm porcelain-peach skin
const STROKE_MAIN = "2.3"; // Ketebalan garis utama
const STROKE_DETAIL = "1.7"; // Ketebalan garis lipatan & detail dalam

// ============================================================================
// LAYER AKSESORIS TAMBAHAN (Opsional)
// ============================================================================
function AvatarAccessoryLayer({
  accessory,
}: {
  accessory: AvatarSantriAccessory | string | null;
}) {
  if (!accessory || accessory === "none") return null;

  if (accessory === "peci") {
    return (
      <g>
        <path
          d="M 33 44 C 33 22 46 17 64 17 C 82 17 95 22 95 44 C 82 38 46 38 33 44 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
          strokeLinejoin="round"
        />
        <path
          d="M 32 38 Q 64 34 96 38 L 95 45 Q 64 41 33 45 Z"
          fill="#F4F4F5"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
          strokeLinejoin="round"
        />
        <rect
          x="71"
          y="26"
          width="11"
          height="5.5"
          rx="1"
          transform="rotate(7 71 26)"
          fill="#52B788"
          stroke={INK}
          strokeWidth="1.8"
        />
      </g>
    );
  }

  if (accessory === "hairbow") {
    return (
      <g transform="translate(84 34) rotate(14)">
        <polygon
          points="-13,0 -2,-6.5 -2,6.5"
          fill="#FF8FA3"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <polygon
          points="13,0 2,-6.5 2,6.5"
          fill="#FF8FA3"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle
          cx="0"
          cy="0"
          r="3.5"
          fill="#E56B6F"
          stroke={INK}
          strokeWidth="2"
        />
      </g>
    );
  }

  if (accessory === "flowercrown") {
    return (
      <g>
        <path
          d="M 34 40 Q 64 47 94 40"
          fill="none"
          stroke="#52B788"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle
          cx="41"
          cy="41"
          r="6"
          fill="#E76F51"
          stroke={INK}
          strokeWidth="2"
        />
        <circle cx="41" cy="41" r="2" fill="#F4D35E" />
        <circle
          cx="56"
          cy="44"
          r="6.5"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth="2"
        />
        <circle cx="56" cy="44" r="2.2" fill="#F4D35E" />
        <circle
          cx="72"
          cy="44"
          r="6.5"
          fill="#F4D35E"
          stroke={INK}
          strokeWidth="2"
        />
        <circle cx="72" cy="44" r="2.2" fill="#FFFFFF" />
        <circle
          cx="87"
          cy="41"
          r="6"
          fill="#E76F51"
          stroke={INK}
          strokeWidth="2"
        />
        <circle cx="87" cy="41" r="2" fill="#F4D35E" />
      </g>
    );
  }

  if (accessory === "glasses") {
    return (
      <g>
        <circle
          cx="49"
          cy="62"
          r="10.5"
          fill="#FFFFFF"
          fillOpacity="0.18"
          stroke={INK}
          strokeWidth="2"
        />
        <circle
          cx="79"
          cy="62"
          r="10.5"
          fill="#FFFFFF"
          fillOpacity="0.18"
          stroke={INK}
          strokeWidth="2"
        />
        <path
          d="M 59.5 62 Q 64 59.5 68.5 62"
          fill="none"
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 38.5 60 L 34 58.5 M 89.5 60 L 94 58.5"
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (accessory === "crown") {
    return (
      <g transform="translate(0, -3)">
        <path
          d="M 40 37 L 37 19 L 51 28 L 64 15 L 77 28 L 91 19 L 88 37 Z"
          fill="#F4D35E"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
          strokeLinejoin="round"
        />
      </g>
    );
  }

  if (accessory === "wizardhat") {
    return (
      <g transform="translate(0, -21)">
        <path
          d="M 64 16 L 39 57 L 89 57 Z"
          fill="#8E7DBE"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
          strokeLinejoin="round"
        />
        <ellipse
          cx="64"
          cy="59"
          rx="38"
          ry="6.5"
          fill="#8E7DBE"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
        />
      </g>
    );
  }

  if (accessory === "headphone") {
    return (
      <g>
        <path
          d="M 28 63 C 28 28 43 18 64 18 C 85 18 100 28 100 63"
          fill="none"
          stroke={INK}
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <rect
          x="21"
          y="51"
          width="11"
          height="22"
          rx="5.5"
          fill="#52B788"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
        />
        <rect
          x="96"
          y="51"
          width="11"
          height="22"
          rx="5.5"
          fill="#52B788"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
        />
      </g>
    );
  }

  if (accessory === "sleepmask") {
    return (
      <g>
        <rect
          x="36"
          y="51"
          width="56"
          height="19"
          rx="8.5"
          fill="#74C69D"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
        />
        <path
          d="M 44 61 Q 49 65 55 61 M 73 61 Q 79 65 84 61"
          fill="none"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (accessory === "scarf") {
    return (
      <g>
        <path
          d="M 37 88 Q 64 98 91 88 Q 94 100 88 107 Q 64 115 40 107 Q 34 100 37 88 Z"
          fill="#F4D35E"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
          strokeLinejoin="round"
        />
        <path
          d="M 69 102 L 75 122 L 62 120 L 60 103"
          fill="#F4D35E"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  if (accessory === "turban") {
    return (
      <g transform="translate(0, -15)">
        <path
          d="M 30 55 Q 24 22 64 18 Q 104 22 98 55 Q 64 63 30 55 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
          strokeLinejoin="round"
        />
        <path
          d="M 36 47 Q 64 54 92 47 M 42 35 Q 64 28 86 35"
          fill="none"
          stroke={INK}
          strokeWidth={STROKE_DETAIL}
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (accessory === "sunglasses") {
    return (
      <g>
        <rect
          x="37"
          y="53"
          width="23"
          height="15"
          rx="4"
          fill={INK}
          stroke={INK}
          strokeWidth="2.2"
        />
        <rect
          x="68"
          y="53"
          width="23"
          height="15"
          rx="4"
          fill={INK}
          stroke={INK}
          strokeWidth="2.2"
        />
        <path
          d="M 42 56 L 47 64 M 73 56 L 78 64"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 60 59 L 68 59 M 37 58 L 33 56 M 91 58 L 95 56"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (accessory === "chain") {
    return (
      <g>
        <path
          d="M 49 90 Q 64 112 79 90"
          fill="none"
          stroke="#52B788"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="58"
          y="103"
          width="12"
          height="14"
          rx="2"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth="2"
        />
      </g>
    );
  }

  if (accessory === "star") {
    return (
      <g>
        <path
          d="M 38 35 L 40.5 40.5 L 46 43 L 40.5 45.5 L 38 51 L 35.5 45.5 L 30 43 L 35.5 40.5 Z"
          fill="#52B788"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M 31 46 L 32.5 49.5 L 36 51 L 32.5 52.5 L 31 56 L 29.5 52.5 L 26 51 L 29.5 49.5 Z"
          fill="#52B788"
          stroke={INK}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  if (accessory === "medal") {
    return (
      <g>
        <path
          d="M 52 90 L 60 108 M 76 90 L 68 108"
          stroke="#4895EF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle
          cx="64"
          cy="112"
          r="8"
          fill="#F4D35E"
          stroke={INK}
          strokeWidth="2.2"
        />
      </g>
    );
  }

  if (accessory === "bandana") {
    return (
      <g>
        <path
          d="M 33 44 C 35 32 48 28 64 28 C 80 28 93 32 95 44 L 94 50 C 80 41 48 41 34 50 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={STROKE_MAIN}
          strokeLinejoin="round"
        />
        <rect
          x="71"
          y="34"
          width="10.5"
          height="5"
          transform="rotate(8 71 34)"
          fill="#52B788"
          stroke={INK}
          strokeWidth="1.8"
        />
      </g>
    );
  }

  return null;
}

// ============================================================================
// FITUR WAJAH DOODLE (Menyesuaikan Alis & Ekspresi tiap Variant)
// ============================================================================
function DoodleFacialFeatures({
  mood,
  isGirl,
  variant = 1,
}: {
  mood: "idle" | "happy" | "cheer";
  isGirl?: boolean;
  variant?: AvatarSantriVariant;
}) {
  // Cowok Variant 1 punya alis tebal tegas khas panel kiri atas
  const browWidth = !isGirl && variant === 1 ? "4.5" : isGirl ? "2.1" : "2.8";

  return (
    <g>
      {/* Alis */}
      <path
        d="M 41 48.5 Q 48 46 54 48.5"
        fill="none"
        stroke={INK}
        strokeWidth={browWidth}
        strokeLinecap="round"
      />
      <path
        d="M 74 48.5 Q 80 46 87 48.5"
        fill="none"
        stroke={INK}
        strokeWidth={browWidth}
        strokeLinecap="round"
      />

      {/* Mata Indie Doodle */}
      {mood === "happy" ? (
        <>
          <path
            d="M 42 62 Q 49 55 55 62"
            fill="none"
            stroke={INK}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M 73 62 Q 79 55 86 62"
            fill="none"
            stroke={INK}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M 40 59.5 Q 49 53.5 56 59"
            fill="none"
            stroke={INK}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 72 59 Q 79 53.5 88 59.5"
            fill="none"
            stroke={INK}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <ellipse cx="49" cy="62.5" rx="4.6" ry="5.4" fill={INK} />
          <ellipse cx="79" cy="62.5" rx="4.6" ry="5.4" fill={INK} />
        </>
      )}

      {/* Hidung Titik Mungil */}
      <path
        d="M 63.8 67.5 L 64.2 68.8"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Soft Blush + Garis Arsir (//) */}
      <ellipse
        cx="41"
        cy="69.5"
        rx="6.5"
        ry="3.8"
        fill="#F4978E"
        opacity="0.45"
      />
      <ellipse
        cx="87"
        cy="69.5"
        rx="6.5"
        ry="3.8"
        fill="#F4978E"
        opacity="0.45"
      />
      <path
        d="M 38.5 68.5 L 39.8 71 M 41.8 68.2 L 43 70.8"
        stroke="#E56B6F"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 85 68.2 L 86.2 70.8 M 88.2 68.5 L 89.5 71"
        stroke="#E56B6F"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Mulut */}
      {mood === "cheer" ? (
        <path
          d="M 60 73 Q 64 72.5 68 73 C 69 80 59 80 60 73 Z"
          fill="#E56B6F"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : mood === "happy" ? (
        <path
          d="M 60.5 73.5 Q 64 77 67.5 73.5"
          fill="none"
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M 62.5 74.5 Q 64 75.5 65.5 74.5"
          fill="none"
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

// ============================================================================
// 3 KARAKTER COWOK (SANTRI PUTRA MODEST STREETWEAR)
// ============================================================================
function BoyCharacterLayers({
  variant,
  mood,
  accessory,
}: {
  variant: AvatarSantriVariant;
  mood: "idle" | "happy" | "cheer";
  accessory: AvatarSantriAccessory | string | null;
}) {
  // Daftar aksesoris penutup kepala
  const isWearingHat = ["peci", "turban", "wizardhat", "bandana"].includes(
    accessory || "none",
  );

  return (
    <g>
      {/* --- PAKAIAN COWOK BERDASARKAN VARIANT --- */}
      {variant === 1 && (
        /* COWOK 1: Crewneck Hitam + Tipografi Blok Oranye (Adaptasi Panel Kiri Atas) */
        <g>
          <path
            d="M 15 134 C 19 98 36 90 64 90 C 92 90 109 98 113 134 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Kerah Turtleneck / Mockneck */}
          <path
            d="M 50 86 L 78 86 L 80 95 Q 64 99 48 95 Z"
            fill={INK}
            stroke="#3F3F46"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Blok Grafis Dekoratif di Dada ("SANTRI" Block Style) */}
          <rect
            x="33"
            y="108"
            width="14"
            height="18"
            rx="2"
            fill="#E76F51"
            stroke={INK}
            strokeWidth="1.8"
          />
          <polygon
            points="51,126 58,108 65,126"
            fill="#E76F51"
            stroke={INK}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <polygon
            points="67,126 73,108 80,126"
            fill="#E76F51"
            stroke={INK}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <rect
            x="83"
            y="108"
            width="12"
            height="18"
            rx="2"
            fill="#E76F51"
            stroke={INK}
            strokeWidth="1.8"
          />
        </g>
      )}

      {variant === 2 && (
        /* COWOK 2: Crewneck Putih + Strap Tas Selempang (Adaptasi Panel Kiri Tengah & Tengah Atas) */
        <g>
          <path
            d="M 15 134 C 19 98 36 90 64 90 C 92 90 109 98 113 134 Z"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Kerah Rib Hijau */}
          <path
            d="M 47 90 Q 64 101 81 90 Q 84 94 81 97 Q 64 108 47 97 Q 44 94 47 90 Z"
            fill="#52B788"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Strap Tas Selempang Hitam & Gesper Hijau */}
          <path
            d="M 31 95 L 44 134 L 54 134 L 41 91 Z"
            fill={INK}
            stroke={INK}
            strokeWidth="2"
          />
          <rect
            x="35"
            y="107"
            width="12"
            height="9"
            rx="1.5"
            transform="rotate(-18 35 107)"
            fill="#52B788"
            stroke={INK}
            strokeWidth="2"
          />
          {/* Patch Oranye di Dada Kanan */}
          <rect
            x="68"
            y="110"
            width="18"
            height="10"
            rx="2"
            fill="#E76F51"
            stroke={INK}
            strokeWidth="2"
          />
        </g>
      )}

      {variant === 3 && (
        /* COWOK 3: Outer Koko/Jaket Putih Kerah Coklat + Inner Tan (Adaptasi Panel Kanan Bawah) */
        <g>
          <path
            d="M 15 134 C 19 98 36 90 64 90 C 92 90 109 98 113 134 Z"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Baju Dalam Warna Warm Tan */}
          <path
            d="M 48 91 L 56 134 L 72 134 L 80 91 Z"
            fill="#D4A373"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Kerah Lipat Outer */}
          <polygon
            points="48,90 36,105 53,115"
            fill="#CCB79B"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon
            points="80,90 92,105 75,115"
            fill="#CCB79B"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Pin Gantungan Kuning & Patch Kecil */}
          <circle
            cx="45"
            cy="121"
            r="5"
            fill="#F4D35E"
            stroke={INK}
            strokeWidth="1.8"
          />
          <rect
            x="78"
            y="122"
            width="13"
            height="6"
            rx="1"
            fill="#F4A261"
            stroke={INK}
            strokeWidth="1.8"
          />
        </g>
      )}

      {/* --- LEHER, TELINGA (TANPA ANTING), & WAJAH --- */}
      <rect
        x="56"
        y="77"
        width="16"
        height="16"
        fill={SKIN}
        stroke={INK}
        strokeWidth={STROKE_MAIN}
      />
      <path d="M 56 77 H 72 V 88 Q 64 91 56 88 Z" fill={INK} />

      <circle
        cx="33"
        cy="63"
        r="7.5"
        fill={SKIN}
        stroke={INK}
        strokeWidth={STROKE_MAIN}
      />
      <path
        d="M 31 60.5 Q 34.5 63 32 65.5"
        fill="none"
        stroke={INK}
        strokeWidth={STROKE_DETAIL}
        strokeLinecap="round"
      />
      <circle
        cx="95"
        cy="63"
        r="7.5"
        fill={SKIN}
        stroke={INK}
        strokeWidth={STROKE_MAIN}
      />
      <path
        d="M 97 60.5 Q 93.5 63 96 65.5"
        fill="none"
        stroke={INK}
        strokeWidth={STROKE_DETAIL}
        strokeLinecap="round"
      />

      <path
        d="M 35 55 C 35 34 46 28 64 28 C 82 28 93 34 93 55 C 93 74 80 84 64 84 C 48 84 35 74 35 55 Z"
        fill={SKIN}
        stroke={INK}
        strokeWidth={STROKE_MAIN}
        strokeLinejoin="round"
      />

      <DoodleFacialFeatures mood={mood} isGirl={false} variant={variant} />

      {/* --- GAYA RAMBUT COWOK --- */}
      {!isWearingHat ? (
        /* JIKA TIDAK PAKAI TOPI: Rambut Full */
        <>
          {variant === 1 && (
            <g>
              <path
                d="M 31 56
                   L 22 50 L 29 45
                   L 19 37 L 31 33
                   C 25 24 19 18 19 18
                   C 28 16 36 18 42 22
                   L 40 11 L 53 19
                   L 63 8 L 69 19
                   C 77 13 88 12 94 15
                   L 87 23
                   C 96 22 105 26 109 32
                   L 96 35
                   C 103 39 107 45 105 49
                   L 96 47 L 97 56
                   L 92 43
                   C 87 38 78 37 72 43
                   L 68 38 L 64 44 L 60 38
                   C 53 37 42 38 36 44
                   Z"
                fill={INK}
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M 55 17 C 50 11 43 10 38 13
                   M 72 17 C 79 10 88 9 95 13
                   M 27 49 C 22 51 19 55 20 58"
                fill="none"
                stroke={INK}
                strokeWidth={STROKE_DETAIL}
                strokeLinecap="round"
              />
            </g>
          )}

          {variant === 2 && (
            <g>
              <path
                d="M 32 65 L 28 73 L 34 71 L 35 78 L 42 71 Z
                   M 96 65 L 100 73 L 94 71 L 93 78 L 86 71 Z"
                fill="#EAE0B7"
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
              <path
                d="M 31 55
                   C 25 47 24 35 31 26
                   C 36 19 44 16 50 18
                   L 48 14
                   C 55 13 61 14 64 16
                   C 69 13 81 15 90 21
                   C 99 28 103 40 97 55
                   L 93 45 L 86 45
                   L 82 33 L 77 45
                   L 69 45
                   L 64 26 L 58 45
                   L 50 45
                   L 45 34 L 41 45
                   L 35 45 Z"
                fill="#EAE0B7"
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
              <path
                d="M 61 16 L 64 23
                   M 34 41 L 41 42
                   M 49 42 L 58 43
                   M 69 43 L 78 42
                   M 86 42 L 94 41"
                fill="none"
                stroke={INK}
                strokeWidth={STROKE_DETAIL}
                strokeLinecap="round"
              />
            </g>
          )}

          {variant === 3 && (
            <g>
              <path
                d="M 32 64 L 26 73 L 33 72 L 32 81 L 41 74 L 40 82 L 46 74 Z
                   M 96 64 L 102 73 L 95 72 L 96 81 L 87 74 L 88 82 L 82 74 Z"
                fill="#F4D365"
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
              <path
                d="M 32 56
                   L 25 51 L 29 46
                   L 22 40 L 29 35
                   C 26 27 33 19 44 17
                   L 41 13 L 50 15
                   C 55 13 60 14 63 17
                   L 61 10 L 66 15 L 71 11 L 69 17
                   C 78 14 89 17 95 24
                   L 102 22 L 98 29
                   C 104 33 106 39 100 43
                   L 105 49 L 96 51 L 96 56
                   C 93 48 90 42 86 46
                   C 84 36 75 32 67 39
                   L 64 49 L 60 39
                   C 52 32 43 36 41 46
                   C 37 42 34 48 32 56 Z"
                fill="#F4D365"
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
              <path
                d="M 63 18 C 61 24 62 31 64 38
                   M 54 25 C 57 28 59 32 60 36
                   M 73 25 C 70 28 68 32 67 36"
                fill="none"
                stroke={INK}
                strokeWidth={STROKE_DETAIL}
                strokeLinecap="round"
              />
              <g transform="rotate(14 31 35)">
                <rect
                  x="25"
                  y="32"
                  width="12"
                  height="5.5"
                  rx="1.2"
                  fill="#68B684"
                  stroke={INK}
                  strokeWidth="1.8"
                />
                <line
                  x1="26"
                  y1="34.75"
                  x2="36"
                  y2="34.75"
                  stroke={INK}
                  strokeWidth="1.2"
                />
              </g>
            </g>
          )}
        </>
      ) : (
        /* JIKA PAKAI TOPI: Hanya Tampilkan Rambut yang Mengintip (Poni & Sideburns) */
        <>
          {variant === 1 && (
            <g>
              {/* Poni berantakan di bawah topi */}
              <path
                d="M 34 45 L 32 55 L 37 52 L 40 60 L 46 52 L 50 58 L 55 50 L 60 57 L 64 48 L 68 57 L 73 50 L 78 58 L 82 52 L 88 60 L 91 52 L 96 55 L 94 45 C 80 40 48 40 34 45 Z"
                fill={INK}
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
              {/* Sideburns/Cambang di samping telinga */}
              <path
                d="M 33 55 L 31 65 L 35 62 Z M 95 55 L 97 65 L 93 62 Z"
                fill={INK}
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
            </g>
          )}

          {variant === 2 && (
            <g>
              {/* Poni belah tengah di bawah topi */}
              <path
                d="M 33 52 C 43 42 85 42 95 52 L 92 60 L 87 54 L 83 60 L 78 50 L 73 57 L 68 48 L 64 55 L 60 48 L 55 57 L 50 50 L 45 60 L 41 54 L 36 60 Z"
                fill="#EAE0B7"
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
              {/* Sideburns */}
              <path
                d="M 33 55 L 29 65 L 35 62 Z M 95 55 L 99 65 L 93 62 Z"
                fill="#EAE0B7"
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
            </g>
          )}

          {variant === 3 && (
            <g>
              {/* Ekor rambut panjang di belakang leher (Nape) */}
              <path
                d="M 32 62 L 26 73 L 33 71 L 32 81 L 41 74 L 40 82 L 46 72 Z M 96 62 L 102 73 L 95 71 L 96 81 L 87 74 L 88 82 L 82 72 Z"
                fill="#F4D365"
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
              {/* Poni berantakan di bawah topi */}
              <path
                d="M 35 50 C 45 42 85 42 93 50 L 90 58 L 85 52 L 81 58 L 75 48 L 68 55 L 64 46 L 60 55 L 54 48 L 48 56 L 42 50 L 38 56 Z"
                fill="#F4D365"
                stroke={INK}
                strokeWidth={STROKE_MAIN}
                strokeLinejoin="round"
              />
            </g>
          )}
        </>
      )}
    </g>
  );
}

// ============================================================================
// 3 KARAKTER CEWEK (SANTRI PUTRI SYAR'I BERBEDA GAYA HIJAB & BUSANA)
// ============================================================================
function GirlCharacterLayers({
  variant,
  mood,
}: {
  variant: AvatarSantriVariant;
  mood: "idle" | "happy" | "cheer";
}) {
  return (
    <g>
      {variant === 1 && (
        /* ====================================================================
           CEWEK 1: Pashmina Syar'i Warm-Apricot + Overall Motif Hijau
           ==================================================================== */
        <g>
          {/* Siluet Belakang Khimar */}
          <path
            d="M 15 134 C 16 96 22 76 26 56 C 26 26 41 19 64 19 C 87 19 102 26 102 56 C 106 76 112 96 113 134 Z"
            fill="#F4A261"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Gamis Dasar Hitam */}
          <path
            d="M 13 134 C 16 102 30 92 64 92 C 98 92 112 102 115 134 Z"
            fill={INK}
          />
          {/* Bayangan Dalam Kerudung */}
          <ellipse cx="64" cy="66" rx="31" ry="26" fill={INK} />
          {/* Leher & Bayangan Dagu */}
          <rect x="56" y="76" width="16" height="15" fill={SKIN} />
          <path d="M 56 76 H 72 V 87 Q 64 90 56 87 Z" fill={INK} />
          {/* Wajah */}
          <path
            d="M 36 55 C 36 35 46 28 64 28 C 82 28 92 35 92 55 C 92 74 79 83 64 83 C 49 83 36 74 36 55 Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Ciput Rapi */}
          <path
            d="M 38 44 Q 64 33 90 44 C 85 28 43 28 38 44 Z"
            fill="#FFF8F0"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <DoodleFacialFeatures mood={mood} isGirl={true} variant={1} />
          {/* Layer Depan Khimar Syar'i Menutup Dada */}
          <path
            d="M 64 19 C 40 19 26 30 26 56 C 25 78 20 96 19 120 Q 42 126 64 122 Q 86 126 109 120 C 108 96 103 78 102 56 C 102 30 88 19 64 19 Z M 89 56 C 89 73 78 83 64 83 C 50 83 39 73 39 56 C 39 39 49 32 64 32 C 79 32 89 39 89 56 Z"
            fill="#F9C784"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            fillRule="evenodd"
            strokeLinejoin="round"
          />
          {/* Lipatan Halus Dagu & Dada */}
          <path
            d="M 45 86 Q 64 95 83 86 M 32 98 Q 64 110 96 98"
            fill="none"
            stroke={INK}
            strokeWidth={STROKE_DETAIL}
            strokeLinecap="round"
          />
          {/* Tali & Bib Overall Hijau-Putih di Atas Gamis/Khimar */}
          <rect
            x="40"
            y="95"
            width="9"
            height="24"
            fill="#52B788"
            stroke={INK}
            strokeWidth="2"
          />
          <rect
            x="79"
            y="95"
            width="9"
            height="24"
            fill="#52B788"
            stroke={INK}
            strokeWidth="2"
          />
          <path
            d="M 35 114 L 93 114 L 95 134 L 33 134 Z"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Motif Bercak Hijau Lucu pada Overall */}
          <circle cx="46" cy="123" r="6" fill="#52B788" />
          <circle cx="64" cy="126" r="7" fill="#52B788" />
          <circle cx="81" cy="122" r="6.5" fill="#52B788" />
          <circle cx="55" cy="118" r="4" fill="#52B788" />
          {/* 2 Klip Hijau Ikonik di Kanan Atas Kerudung */}
          <rect
            x="75"
            y="27"
            width="9.5"
            height="4.2"
            rx="1"
            transform="rotate(-28 75 27)"
            fill="#52B788"
            stroke={INK}
            strokeWidth="1.7"
          />
          <rect
            x="80"
            y="33"
            width="9.5"
            height="4.2"
            rx="1"
            transform="rotate(-28 80 33)"
            fill="#52B788"
            stroke={INK}
            strokeWidth="1.7"
          />
        </g>
      )}

      {variant === 2 && (
        /* ====================================================================
           CEWEK 2: Khimar Syar'i Terracotta/Coral + Pin Bintang + Gamis Hitam
           ==================================================================== */
        <g>
          {/* Siluet Belakang Khimar */}
          <path
            d="M 14 134 C 15 94 22 74 26 55 C 26 25 41 18 64 18 C 87 18 102 25 102 55 C 106 74 113 94 114 134 Z"
            fill="#E06D53"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Bayangan Dalam Kerudung */}
          <ellipse cx="64" cy="66" rx="31" ry="26" fill={INK} />
          {/* Leher & Bayangan Dagu */}
          <rect x="56" y="76" width="16" height="15" fill={SKIN} />
          <path d="M 56 76 H 72 V 87 Q 64 90 56 87 Z" fill={INK} />
          {/* Wajah */}
          <path
            d="M 36 55 C 36 35 46 28 64 28 C 82 28 92 35 92 55 C 92 74 79 83 64 83 C 49 83 36 74 36 55 Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Ciput Rapi */}
          <path
            d="M 38 44 Q 64 33 90 44 C 85 28 43 28 38 44 Z"
            fill="#FFE5D9"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <DoodleFacialFeatures mood={mood} isGirl={true} variant={2} />
          {/* Khimar Syar'i Terracotta Menutup Dada dengan Lipatan Anggun */}
          <path
            d="M 64 18 C 40 18 26 29 26 55 C 24 80 18 102 16 134 L 112 134 C 110 102 104 80 102 55 C 102 29 88 18 64 18 Z M 89 56 C 89 73 78 83 64 83 C 50 83 39 73 39 56 C 39 39 49 32 64 32 C 79 32 89 39 89 56 Z"
            fill="#F2846E"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            fillRule="evenodd"
            strokeLinejoin="round"
          />
          {/* Outer Vest / Abaya Hitam di Bagian Bawah Dada */}
          <path
            d="M 20 110 Q 64 122 108 110 L 112 134 L 16 134 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={STROKE_MAIN}
          />
          {/* Patch Coral di Dada ("SANTRI") */}
          <rect
            x="48"
            y="119"
            width="32"
            height="11"
            rx="2"
            fill="#E76F51"
            stroke={INK}
            strokeWidth="1.8"
          />
          {/* Lipatan Drape Khimar Menyilang & Juntaian Lipatan Samping */}
          <path
            d="M 44 87 Q 64 96 84 87 M 26 98 Q 64 114 102 96"
            fill="none"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinecap="round"
          />
          {/* Highlight Lembut di Kanan Atas Khimar */}
          <path
            d="M 71 24 C 79 25 85 31 87 37 C 80 36 75 34 70 29 Z"
            fill="#FFD7CA"
            opacity="0.75"
          />
          {/* 2 Pin Bintang Hijau di Sisi Kiri Kerudung */}
          <path
            d="M 35 35 L 37.5 40.5 L 43 43 L 37.5 45.5 L 35 51 L 32.5 45.5 L 27 43 L 32.5 40.5 Z"
            fill="#52B788"
            stroke={INK}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M 29 47 L 30.5 50.5 L 34 52 L 30.5 53.5 L 29 57 L 27.5 53.5 L 24 52 L 27.5 50.5 Z"
            fill="#52B788"
            stroke={INK}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      )}

      {variant === 3 && (
        /* ====================================================================
           CEWEK 3: Khimar Syar'i Hitam Monokrom + Jaket Hoodie Modest + Kacamata Bulat
           ==================================================================== */
        <g>
          {/* Siluet Belakang Khimar Hitam */}
          <path
            d="M 15 134 C 17 94 23 74 27 55 C 27 25 42 18 64 18 C 86 18 101 25 101 55 C 105 74 111 94 113 134 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Leher & Bayangan Dagu */}
          <rect x="56" y="76" width="16" height="15" fill={SKIN} />
          <path d="M 56 76 H 72 V 87 Q 64 90 56 87 Z" fill={INK} />
          {/* Wajah */}
          <path
            d="M 36 55 C 36 35 46 28 64 28 C 82 28 92 35 92 55 C 92 74 79 83 64 83 C 49 83 36 74 36 55 Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          {/* Ciput Rapi Abu Muda */}
          <path
            d="M 38 44 Q 64 33 90 44 C 85 28 43 28 38 44 Z"
            fill="#E4E4E7"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <DoodleFacialFeatures mood={mood} isGirl={true} variant={3} />
          {/* Kacamata Bulat Tipis Bawaan Karakter 3 */}
          <circle
            cx="49"
            cy="62"
            r="10.5"
            fill="#FFFFFF"
            fillOpacity="0.18"
            stroke={INK}
            strokeWidth="2"
          />
          <circle
            cx="79"
            cy="62"
            r="10.5"
            fill="#FFFFFF"
            fillOpacity="0.18"
            stroke={INK}
            strokeWidth="2"
          />
          <path
            d="M 59.5 62 Q 64 59.5 68.5 62"
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Layer Depan Khimar Syar'i Hitam Membingkai Wajah & Menutup Dada */}
          <path
            d="M 64 18 C 40 18 27 29 27 55 C 26 78 20 98 18 134 L 110 134 C 108 98 102 78 101 55 C 101 29 88 18 64 18 Z M 89 56 C 89 73 78 83 64 83 C 50 83 39 73 39 56 C 39 39 49 32 64 32 C 79 32 89 39 89 56 Z"
            fill={INK}
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            fillRule="evenodd"
            strokeLinejoin="round"
          />
          {/* Lipatan Halus Khimar Hitam (Garis Abu Gelap agar Terlihat Berdimensi) */}
          <path
            d="M 44 87 Q 64 96 84 87 M 32 100 Q 64 112 96 100"
            fill="none"
            stroke="#3F3F46"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Detail Hoodie Putih & Plaket Tengah Modest */}
          <path
            d="M 38 92 C 38 86 48 86 55 92 L 64 98 L 73 92 C 80 86 90 86 90 92 C 92 100 82 104 73 102 L 73 134 L 55 134 L 55 102 C 46 104 36 100 38 92 Z"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth={STROKE_MAIN}
            strokeLinejoin="round"
          />
          <line x1="64" y1="98" x2="64" y2="134" stroke={INK} strokeWidth="2" />
          {/* Tali Hoodie Kecil */}
          <line
            x1="59"
            y1="102"
            x2="59"
            y2="115"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="69"
            y1="102"
            x2="69"
            y2="115"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Label Hijau Mint di Sisi Kanan Dada */}
          <rect
            x="78"
            y="116"
            width="15"
            height="6.5"
            rx="1"
            fill="#52B788"
            stroke={INK}
            strokeWidth="1.8"
          />
          {/* Jepit Pita Putih Kecil di Kanan Atas Khimar Hitam */}
          <polygon
            points="78,34 84,30 83,37 89,35 85,42 79,38"
            fill="#FFFFFF"
            stroke={INK}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
}

// ============================================================================
// KOMPONEN UTAMA AVATAR SANTRI SVG
// ============================================================================
export const AvatarSantriSvg: React.FC<AvatarSantriSvgProps> = ({
  size = 128,
  className = "",
  style,
  gender = "boy",
  variant = 1,
  accessory = "none",
  mood = "idle",
  ...props
}) => {
  const isGirl = gender === "girl";
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `comic-panel-clip-${uid}`;

  // Palet Warna Latar Panel Komik
  const panelColors = {
    boy: {
      1: "#F4D35E", // Mustard Yellow
      2: "#E56B6F", // Coral Red
      3: "#68B66B", // Retro Green
    },
    girl: {
      1: "#E56B6F", // Coral Red
      2: "#38A3C5", // Sky Blue
      3: "#38A3C5", // Sky Blue
    },
  };

  const panelBg = isGirl ? panelColors.girl[variant] : panelColors.boy[variant];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 140"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={`Avatar Santri ${isGirl ? "Putri" : "Putra"} Variant ${variant}`}
      className={className}
      style={style}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M 12 10 Q 64 9.5 116 10 Q 116.5 70 116 130 Q 64 130.5 12 130 Q 11.5 70 12 10 Z" />
        </clipPath>
      </defs>

      {/* Margin Kertas Komik Putih */}
      <rect x="4" y="2" width="120" height="136" rx="3" fill="#FFFFFF" />

      {/* Background Panel Solid */}
      <path
        d="M 12 10 Q 64 9.5 116 10 Q 116.5 70 116 130 Q 64 130.5 12 130 Q 11.5 70 12 10 Z"
        fill={panelBg}
      />

      {/* Ornamen Sparkle & Garis Ekspresi Latar */}
      <g clipPath={`url(#${clipId})`}>
        {isGirl && variant === 2 && (
          <path
            d="M 103 78 L 106 85 L 113 88 L 106 91 L 103 98 L 100 91 L 93 88 L 100 85 Z"
            fill="#FFFFFF"
          />
        )}
        {isGirl && variant === 3 && (
          <path
            d="M 96 20 L 101 15 M 101 24 L 108 21"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Render Karakter Cowok / Cewek */}
        {isGirl ? (
          <GirlCharacterLayers variant={variant} mood={mood} />
        ) : (
          <BoyCharacterLayers
            variant={variant}
            mood={mood}
            accessory={accessory}
          />
        )}

        {/* Layer Aksesoris Opsional */}
        <AvatarAccessoryLayer accessory={accessory} />
      </g>

      {/* Garis Tepi Panel Komik Hand-Drawn */}
      <path
        d="M 12 10 Q 64 9.5 116 10 Q 116.5 70 116 130 Q 64 130.5 12 130 Q 11.5 70 12 10 Z"
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================================
// EXPORT 6 KOMPONEN KARAKTER SPESIFIK (3 COWOK & 3 CEWEK)
// ============================================================================

// --- 3 Karakter Cowok ---
export const AvatarSantriBoySvg: React.FC<
  Omit<AvatarSantriSvgProps, "gender">
> = (props) => <AvatarSantriSvg {...props} gender="boy" />;

export const AvatarSantriBoy1Svg: React.FC<
  Omit<AvatarSantriSvgProps, "gender" | "variant">
> = (props) => <AvatarSantriSvg {...props} gender="boy" variant={1} />;

export const AvatarSantriBoy2Svg: React.FC<
  Omit<AvatarSantriSvgProps, "gender" | "variant">
> = (props) => <AvatarSantriSvg {...props} gender="boy" variant={2} />;

export const AvatarSantriBoy3Svg: React.FC<
  Omit<AvatarSantriSvgProps, "gender" | "variant">
> = (props) => <AvatarSantriSvg {...props} gender="boy" variant={3} />;

// --- 3 Karakter Cewek ---
export const AvatarSantriGirlSvg: React.FC<
  Omit<AvatarSantriSvgProps, "gender">
> = (props) => <AvatarSantriSvg {...props} gender="girl" />;

export const AvatarSantriGirl1Svg: React.FC<
  Omit<AvatarSantriSvgProps, "gender" | "variant">
> = (props) => <AvatarSantriSvg {...props} gender="girl" variant={1} />;

export const AvatarSantriGirl2Svg: React.FC<
  Omit<AvatarSantriSvgProps, "gender" | "variant">
> = (props) => <AvatarSantriSvg {...props} gender="girl" variant={2} />;

export const AvatarSantriGirl3Svg: React.FC<
  Omit<AvatarSantriSvgProps, "gender" | "variant">
> = (props) => <AvatarSantriSvg {...props} gender="girl" variant={3} />;

// ============================================================================
// KARAKTER PENDUKUNG LAINNYA (Tetap Tersedia & Kompatibel)
// ============================================================================

export const AvatarAnakBersorakSvg: React.FC<SvgProps> = (props) => (
  <AvatarSantriSvg {...props} gender="boy" variant={3} mood="cheer" />
);

export const AvatarUstadzSvg: React.FC<SvgProps> = (props) => (
  <AvatarSantriSvg
    {...props}
    gender="boy"
    variant={2}
    mood="happy"
    accessory="peci"
  />
);

export const AvatarUstadzahSvg: React.FC<SvgProps> = (props) => (
  <AvatarSantriSvg {...props} gender="girl" variant={3} mood="happy" />
);
