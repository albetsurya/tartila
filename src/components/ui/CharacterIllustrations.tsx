import React from "react";
import type { SvgProps } from "./CustomIcons";

export type { SvgProps };

/**
 * ============================================================================
 * TARTILA NEO-BRUTALISM CHARACTER & AVATAR ILLUSTRATIONS
 * Style: stroke="#134E4A", strokeWidth="3.5", hard shadow, solid vibrant flat colors
 * Replaces legacy 11-karakter static SVG assets.
 * ============================================================================
 */

/** 1. AvatarAnakSvg - Karakter Santri Utama (Default) */
export const AvatarAnakSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Avatar Santri Tartila"
    {...props}
  >
    <defs>
      <clipPath id="circleClipAnak">
        <circle cx="64" cy="68" r="52" />
      </clipPath>
    </defs>

    {/* Hard Shadow Background (Gaya Stiker Neo-Brutalism) */}
    <circle cx="64" cy="74" r="52" fill="#134E4A" />

    {/* Main Circular Badge */}
    <circle cx="64" cy="68" r="52" fill="#F0FDF4" stroke="#134E4A" strokeWidth="4" />

    {/* Karakter Santri */}
    <g clipPath="url(#circleClipAnak)">
      {/* Badan / Baju Koko Toska */}
      <path
        d="M 20 120 C 24 92 40 86 64 86 C 88 86 104 92 108 120 Z"
        fill="#0D9488"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Kerah Koko Putih */}
      <path
        d="M 52 86 L 64 98 L 76 86"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 52 86 L 64 98 L 76 86"
        fill="none"
        stroke="#134E4A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Leher */}
      <rect
        x="54"
        y="78"
        width="20"
        height="12"
        rx="6"
        fill="#FCD34D"
        stroke="#134E4A"
        strokeWidth="3.5"
      />

      {/* Wajah */}
      <circle cx="64" cy="60" r="26" fill="#FCD34D" stroke="#134E4A" strokeWidth="4" />

      {/* Peci Putih */}
      <path
        d="M 38 48 C 38 28 50 22 64 22 C 78 22 90 28 90 48 C 80 40 48 40 38 48 Z"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Pita Peci */}
      <rect
        x="39"
        y="42"
        width="50"
        height="7"
        rx="3.5"
        fill="#FEF08A"
        stroke="#134E4A"
        strokeWidth="3"
      />

      {/* Bintang Tartila di Peci */}
      <polygon
        points="64,28 66,34 72,34 67,38 69,44 64,40 59,44 61,38 56,34 62,34"
        fill="#FF6B6B"
        stroke="#134E4A"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Mata */}
      <circle cx="52" cy="62" r="4.5" fill="#134E4A" />
      <circle cx="76" cy="62" r="4.5" fill="#134E4A" />
      <circle cx="50.5" cy="60.5" r="1.5" fill="#FFFFFF" />
      <circle cx="74.5" cy="60.5" r="1.5" fill="#FFFFFF" />

      {/* Pipi Merah (Coral Glow) */}
      <circle cx="44" cy="72" r="6" fill="#FF8585" />
      <circle cx="84" cy="72" r="6" fill="#FF8585" />

      {/* Mulut Tersenyum */}
      <path
        d="M 56 72 C 60 79 68 79 72 72"
        fill="none"
        stroke="#134E4A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Badge Bintang di Dada */}
      <circle cx="80" cy="105" r="6" fill="#FF6B6B" stroke="#134E4A" strokeWidth="2" />
    </g>
  </svg>
);

/** 2. AvatarAnakBersorakSvg - Anak Santri Bersorak Gembira */
export const AvatarAnakBersorakSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Avatar Santri Bersorak"
    {...props}
  >
    <defs>
      <clipPath id="circleClipSorak">
        <circle cx="64" cy="70" r="52" />
      </clipPath>
    </defs>

    {/* Hard Shadow */}
    <circle cx="64" cy="76" r="52" fill="#134E4A" />
    <circle cx="64" cy="70" r="52" fill="#FEF3C7" stroke="#134E4A" strokeWidth="4" />

    <g clipPath="url(#circleClipSorak)">
      {/* Tangan Kiri Mengangkat */}
      <path
        d="M 36 100 Q 18 80 26 58"
        fill="none"
        stroke="#FCD34D"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M 36 100 Q 18 80 26 58"
        fill="none"
        stroke="#134E4A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Tangan Kanan Mengangkat */}
      <path
        d="M 92 100 Q 110 80 102 58"
        fill="none"
        stroke="#FCD34D"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M 92 100 Q 110 80 102 58"
        fill="none"
        stroke="#134E4A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Badan / Baju Koko */}
      <path
        d="M 22 120 C 26 92 42 86 64 86 C 86 86 102 92 106 120 Z"
        fill="#0D9488"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Leher */}
      <rect x="54" y="78" width="20" height="12" rx="6" fill="#FCD34D" stroke="#134E4A" strokeWidth="3.5" />

      {/* Wajah */}
      <circle cx="64" cy="60" r="26" fill="#FCD34D" stroke="#134E4A" strokeWidth="4" />

      {/* Peci Putih */}
      <path
        d="M 38 48 C 38 28 50 22 64 22 C 78 22 90 28 90 48 C 80 40 48 40 38 48 Z"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x="39" y="42" width="50" height="7" rx="3.5" fill="#FEF08A" stroke="#134E4A" strokeWidth="3" />

      {/* Mata Gembira Melengkung (^_^) */}
      <path d="M 48 62 Q 53 55 58 62" fill="none" stroke="#134E4A" strokeWidth="4" strokeLinecap="round" />
      <path d="M 70 62 Q 75 55 80 62" fill="none" stroke="#134E4A" strokeWidth="4" strokeLinecap="round" />

      {/* Pipi Merah */}
      <circle cx="44" cy="69" r="6" fill="#FF8585" />
      <circle cx="84" cy="69" r="6" fill="#FF8585" />

      {/* Mulut Terbuka Tertawa Lebar */}
      <path
        d="M 55 69 Q 64 85 73 69 Z"
        fill="#FF6B6B"
        stroke="#134E4A"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

/** 3. AvatarAnakPerempuanSvg - Santriwati Berhijab */
export const AvatarAnakPerempuanSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Avatar Santriwati"
    {...props}
  >
    <defs>
      <clipPath id="circleClipPrmp">
        <circle cx="64" cy="70" r="52" />
      </clipPath>
    </defs>

    {/* Hard Shadow */}
    <circle cx="64" cy="76" r="52" fill="#134E4A" />
    <circle cx="64" cy="70" r="52" fill="#EFF6FF" stroke="#134E4A" strokeWidth="4" />

    <g clipPath="url(#circleClipPrmp)">
      {/* Baju Gamis */}
      <path
        d="M 22 122 C 26 94 42 88 64 88 C 86 88 102 94 106 122 Z"
        fill="#F472B6"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Jilbab Luar Toska */}
      <path
        d="M 28 108 C 24 64 32 26 64 26 C 96 26 104 64 100 108 C 90 118 38 118 28 108 Z"
        fill="#0D9488"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Wajah */}
      <circle cx="64" cy="62" r="23" fill="#FCD34D" stroke="#134E4A" strokeWidth="4" />

      {/* Frame Jilbab Depan */}
      <path
        d="M 36 62 C 36 34 92 34 92 62 C 92 92 80 100 64 100 C 48 100 36 92 36 62 Z"
        fill="none"
        stroke="#134E4A"
        strokeWidth="3.5"
      />

      {/* Pita / Jepit Bunga di Jilbab */}
      <circle cx="86" cy="42" r="6" fill="#FBBF24" stroke="#134E4A" strokeWidth="2.5" />
      <circle cx="86" cy="42" r="2" fill="#EF4444" />

      {/* Mata Berbinar */}
      <circle cx="53" cy="61" r="4" fill="#134E4A" />
      <circle cx="75" cy="61" r="4" fill="#134E4A" />
      <circle cx="51.5" cy="59.5" r="1.3" fill="#FFFFFF" />
      <circle cx="73.5" cy="59.5" r="1.3" fill="#FFFFFF" />

      {/* Pipi Merah */}
      <circle cx="46" cy="69" r="5" fill="#FF8585" />
      <circle cx="82" cy="69" r="5" fill="#FF8585" />

      {/* Mulut Senyum Manis */}
      <path d="M 58 72 C 61 77 67 77 70 72" fill="none" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

/** 4. AvatarAnakSedihSvg - Santri Sedih / Salah */
export const AvatarAnakSedihSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Avatar Santri Sedih"
    {...props}
  >
    <defs>
      <clipPath id="circleClipSedih">
        <circle cx="64" cy="70" r="52" />
      </clipPath>
    </defs>

    {/* Hard Shadow */}
    <circle cx="64" cy="76" r="52" fill="#134E4A" />
    <circle cx="64" cy="70" r="52" fill="#FEE2E2" stroke="#134E4A" strokeWidth="4" />

    <g clipPath="url(#circleClipSedih)">
      {/* Baju Koko */}
      <path
        d="M 20 120 C 24 92 40 86 64 86 C 88 86 104 92 108 120 Z"
        fill="#64748B"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Leher */}
      <rect x="54" y="78" width="20" height="12" rx="6" fill="#FCD34D" stroke="#134E4A" strokeWidth="3.5" />

      {/* Wajah */}
      <circle cx="64" cy="60" r="26" fill="#FCD34D" stroke="#134E4A" strokeWidth="4" />

      {/* Peci */}
      <path
        d="M 38 48 C 38 28 50 22 64 22 C 78 22 90 28 90 48 C 80 40 48 40 38 48 Z"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x="39" y="42" width="50" height="7" rx="3.5" fill="#94A3B8" stroke="#134E4A" strokeWidth="3" />

      {/* Alis Sedih */}
      <path d="M 46 54 L 56 57" stroke="#134E4A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 82 54 L 72 57" stroke="#134E4A" strokeWidth="3.5" strokeLinecap="round" />

      {/* Mata Sayu */}
      <circle cx="52" cy="64" r="4.5" fill="#134E4A" />
      <circle cx="76" cy="64" r="4.5" fill="#134E4A" />

      {/* Air Mata */}
      <path d="M 82 68 Q 85 75 82 78 Q 79 75 82 68 Z" fill="#38BDF8" stroke="#134E4A" strokeWidth="1.5" />

      {/* Mulut Sedih Melengkung ke Bawah */}
      <path d="M 56 78 C 60 73 68 73 72 78" fill="none" stroke="#134E4A" strokeWidth="4" strokeLinecap="round" />
    </g>
  </svg>
);

/** 5. AvatarAnakSenangSvg - Santri Senang */
export const AvatarAnakSenangSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => <AvatarAnakSvg size={size} className={className} style={style} {...props} />;

/** 6. AvatarAnakVipSvg - Santri Bermahkota VIP */
export const AvatarAnakVipSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Avatar Santri VIP"
    {...props}
  >
    <defs>
      <clipPath id="circleClipVip">
        <circle cx="64" cy="70" r="52" />
      </clipPath>
    </defs>

    {/* Hard Shadow */}
    <circle cx="64" cy="76" r="52" fill="#134E4A" />
    <circle cx="64" cy="70" r="52" fill="#FEF9C3" stroke="#134E4A" strokeWidth="4" />

    <g clipPath="url(#circleClipVip)">
      {/* Baju Koko Emas */}
      <path
        d="M 20 120 C 24 92 40 86 64 86 C 88 86 104 92 108 120 Z"
        fill="#F59E0B"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Leher */}
      <rect x="54" y="78" width="20" height="12" rx="6" fill="#FCD34D" stroke="#134E4A" strokeWidth="3.5" />

      {/* Wajah */}
      <circle cx="64" cy="62" r="26" fill="#FCD34D" stroke="#134E4A" strokeWidth="4" />

      {/* Mahkota Emas VIP */}
      <path
        d="M 40 46 L 46 24 L 56 36 L 64 20 L 72 36 L 82 24 L 88 46 Z"
        fill="#FBBF24"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Permata Mahkota */}
      <circle cx="64" cy="28" r="3.5" fill="#EF4444" stroke="#134E4A" strokeWidth="1.5" />
      <circle cx="48" cy="32" r="2.5" fill="#38BDF8" stroke="#134E4A" strokeWidth="1.5" />
      <circle cx="80" cy="32" r="2.5" fill="#38BDF8" stroke="#134E4A" strokeWidth="1.5" />

      {/* Mata Berbinar */}
      <circle cx="52" cy="64" r="4.5" fill="#134E4A" />
      <circle cx="76" cy="64" r="4.5" fill="#134E4A" />
      <circle cx="50.5" cy="62.5" r="1.5" fill="#FFFFFF" />
      <circle cx="74.5" cy="62.5" r="1.5" fill="#FFFFFF" />

      {/* Pipi Merah */}
      <circle cx="44" cy="74" r="6" fill="#FF8585" />
      <circle cx="84" cy="74" r="6" fill="#FF8585" />

      {/* Senyum Bangga */}
      <path d="M 56 74 C 60 82 68 82 72 74" fill="none" stroke="#134E4A" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  </svg>
);

/** 7. AvatarUstadzSvg - Karakter Ustadz Formal */
export const AvatarUstadzSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Avatar Ustadz"
    {...props}
  >
    <defs>
      <clipPath id="circleClipUstdz">
        <circle cx="64" cy="70" r="52" />
      </clipPath>
    </defs>

    <circle cx="64" cy="76" r="52" fill="#134E4A" />
    <circle cx="64" cy="70" r="52" fill="#CCFBF1" stroke="#134E4A" strokeWidth="4" />

    <g clipPath="url(#circleClipUstdz)">
      {/* Jas / Koko Hijau Tua */}
      <path
        d="M 18 122 C 22 92 40 86 64 86 C 88 86 106 92 110 122 Z"
        fill="#134E4A"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Kemeja Putih Tengah */}
      <polygon points="56,86 64,115 72,86" fill="#FFFFFF" stroke="#134E4A" strokeWidth="2.5" />

      {/* Leher */}
      <rect x="54" y="78" width="20" height="12" rx="6" fill="#FCD34D" stroke="#134E4A" strokeWidth="3.5" />

      {/* Wajah */}
      <circle cx="64" cy="62" r="26" fill="#FCD34D" stroke="#134E4A" strokeWidth="4" />

      {/* Peci Hitam Klasik Bergaris Emas */}
      <path
        d="M 38 48 C 38 28 50 20 64 20 C 78 20 90 28 90 48 Z"
        fill="#1E293B"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x="39" y="44" width="50" height="6" rx="3" fill="#FBBF24" stroke="#134E4A" strokeWidth="2" />

      {/* Kacamata Bulat */}
      <circle cx="52" cy="60" r="8.5" fill="none" stroke="#134E4A" strokeWidth="3" />
      <circle cx="76" cy="60" r="8.5" fill="none" stroke="#134E4A" strokeWidth="3" />
      <path d="M 60.5 60 H 67.5" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />

      {/* Mata di Balik Kacamata */}
      <circle cx="52" cy="60" r="3" fill="#134E4A" />
      <circle cx="76" cy="60" r="3" fill="#134E4A" />

      {/* Jenggot Rapi */}
      <path
        d="M 58 78 Q 64 88 70 78 Z"
        fill="#1E293B"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Senyum Ramah */}
      <path d="M 58 72 C 61 76 67 76 70 72" fill="none" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

/** 8. AvatarUstadzahSvg - Karakter Ustadzah */
export const AvatarUstadzahSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Avatar Ustadzah"
    {...props}
  >
    <defs>
      <clipPath id="circleClipUstdzh">
        <circle cx="64" cy="70" r="52" />
      </clipPath>
    </defs>

    <circle cx="64" cy="76" r="52" fill="#134E4A" />
    <circle cx="64" cy="70" r="52" fill="#FEF3C7" stroke="#134E4A" strokeWidth="4" />

    <g clipPath="url(#circleClipUstdzh)">
      {/* Baju Formal */}
      <path
        d="M 22 122 C 26 94 42 88 64 88 C 86 88 102 94 106 122 Z"
        fill="#0F766E"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Hijab Syar'i Anggun */}
      <path
        d="M 26 114 C 22 70 30 26 64 26 C 98 26 106 70 102 114 C 94 122 34 122 26 114 Z"
        fill="#FF6B6B"
        stroke="#134E4A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Wajah */}
      <circle cx="64" cy="62" r="23" fill="#FCD34D" stroke="#134E4A" strokeWidth="4" />

      {/* Kacamata Bulat Elegan */}
      <circle cx="52" cy="60" r="8" fill="none" stroke="#134E4A" strokeWidth="3" />
      <circle cx="76" cy="60" r="8" fill="none" stroke="#134E4A" strokeWidth="3" />
      <path d="M 60 60 H 68" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />

      {/* Mata */}
      <circle cx="52" cy="60" r="3" fill="#134E4A" />
      <circle cx="76" cy="60" r="3" fill="#134E4A" />

      {/* Pipi Merah */}
      <circle cx="45" cy="69" r="4.5" fill="#FF8585" />
      <circle cx="83" cy="69" r="4.5" fill="#FF8585" />

      {/* Senyum Ramah */}
      <path d="M 58 72 C 61 76 67 76 70 72" fill="none" stroke="#134E4A" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

/** 9. MaskotBintangSvg - Maskot Bintang Tartila Neo-Brutalism */
export const MaskotBintangSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Maskot Bintang"
    {...props}
  >
    {/* Hard Shadow Bintang */}
    <polygon
      points="68,14 84,47 121,53 94,79 101,115 68,98 35,115 41,79 15,53 51,47"
      fill="#134E4A"
    />
    {/* Bintang Utama */}
    <polygon
      points="64,8 80.5,41.3 117.3,46.7 90.6,72.7 96.9,109.3 64,92 31.1,109.3 37.4,72.7 10.7,46.7 47.5,41.3"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Mata Ceria */}
    <circle cx="52" cy="64" r="4.5" fill="#134E4A" />
    <circle cx="76" cy="64" r="4.5" fill="#134E4A" />
    <circle cx="50.5" cy="62.5" r="1.5" fill="#FFFFFF" />
    <circle cx="74.5" cy="62.5" r="1.5" fill="#FFFFFF" />

    {/* Pipi Merah */}
    <circle cx="44" cy="72" r="5" fill="#FF8585" />
    <circle cx="84" cy="72" r="5" fill="#FF8585" />

    {/* Senyum Riang */}
    <path
      d="M 56 73 C 60 82 68 82 72 73"
      fill="none"
      stroke="#134E4A"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

/** 10. MaskotBukuSvg - Maskot Mushaf / Tilawati Neo-Brutalism */
export const MaskotBukuSvg: React.FC<SvgProps> = ({
  size = 48,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Maskot Buku Tilawati"
    {...props}
  >
    {/* Hard Shadow Buku */}
    <rect x="28" y="20" width="80" height="92" rx="14" fill="#134E4A" />

    {/* Sampul Buku Depan */}
    <rect
      x="22"
      y="14"
      width="80"
      height="92"
      rx="14"
      fill="#0D9488"
      stroke="#134E4A"
      strokeWidth="4"
    />

    {/* Lembaran Kertas Buku */}
    <rect
      x="90"
      y="22"
      width="8"
      height="76"
      rx="3"
      fill="#FEF08A"
      stroke="#134E4A"
      strokeWidth="2.5"
    />

    {/* Pita Pembatas Buku Emas */}
    <path
      d="M 76 14 V 38 L 83 31 L 90 38 V 14 Z"
      fill="#FBBF24"
      stroke="#134E4A"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Mata Ceria */}
    <circle cx="48" cy="56" r="4.5" fill="#134E4A" />
    <circle cx="72" cy="56" r="4.5" fill="#134E4A" />
    <circle cx="46.5" cy="54.5" r="1.5" fill="#FFFFFF" />
    <circle cx="70.5" cy="54.5" r="1.5" fill="#FFFFFF" />

    {/* Pipi Merah */}
    <circle cx="40" cy="65" r="5" fill="#FF8585" />
    <circle cx="80" cy="65" r="5" fill="#FF8585" />

    {/* Senyum */}
    <path
      d="M 54 65 C 57 73 63 73 66 65"
      fill="none"
      stroke="#134E4A"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);
