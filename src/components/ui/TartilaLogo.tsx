import React from "react";

export interface TartilaLogoProps {
  size?: number | string;
  className?: string;
  /**
   * "app-icon" -> Bingkai kotak rounded putih + hard shadow Neo-Brutalism (untuk App Icon / Favicon)
   * "sticker"  -> Maskot die-cut sticker putih transparan (untuk Navbar / Splash Screen / Hero)
   */
  variant?: "app-icon" | "sticker";
}

export const TartilaLogoSvg: React.FC<TartilaLogoProps> = ({
  size = 256,
  className = "",
  variant = "app-icon",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="60 50 380 390"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="Tartila App Logo"
    className={className}
  >
    {/* ==================== BACKGROUND APP ICON (NEO-BRUTALISM) ==================== */}
    {variant === "app-icon" && (
      <>
        {/* Solid Hard Shadow */}
        <rect x="78" y="68" width="352" height="352" rx="80" fill="#134E4A" />
        {/* Solid White Background */}
        <rect
          x="68"
          y="58"
          width="352"
          height="352"
          rx="80"
          fill="#FFFFFF"
          stroke="#134E4A"
          strokeWidth="10"
        />
        {/* Dekorasi Bintang Kecil Sudut Kiri & Kanan Atas */}
        <path
          d="M 126 106 L 130 116 L 140 120 L 130 124 L 126 134 L 122 124 L 112 120 L 122 116 Z"
          fill="#FF6B6B"
          stroke="#07473C"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M 374 106 L 377 114 L 385 117 L 377 120 L 374 128 L 371 120 L 363 117 L 371 114 Z"
          fill="#FBBF24"
          stroke="#07473C"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </>
    )}

    {/* ==================== DIE-CUT STICKER BORDER & HARD SHADOW ==================== */}
    {/* Bayangan Solid di Belakang Maskot */}
    <g transform="translate(8, 10)">
      <path d="M 198 142 L 204 96 Q 250 90 296 96 L 302 142 Z" fill="#134E4A" />
      <ellipse cx="250" cy="240" rx="105" ry="105" fill="#134E4A" />
      <path
        d="M 212 330 C 206 355, 196 372, 186 382 C 178 390, 182 406, 192 406 C 202 406, 206 392, 208 384 C 216 368, 222 350, 225 332 Z"
        fill="#134E4A"
      />
      <path
        d="M 288 330 C 294 355, 304 372, 314 382 C 322 390, 318 406, 308 406 C 298 406, 294 392, 292 384 C 284 368, 278 350, 275 332 Z"
        fill="#134E4A"
      />
    </g>

    {/* Die-Cut White Outline (Khusus Mode Sticker) */}
    {variant === "sticker" && (
      <g
        stroke="#FFFFFF"
        strokeWidth="24"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M 198 142 L 204 96 Q 250 90 296 96 L 302 142 Q 250 148 198 142 Z" />
        <ellipse cx="250" cy="240" rx="105" ry="105" />
        <path d="M 165 208 L 96 172 C 86 182, 92 205, 112 218 C 98 226, 104 246, 128 252 C 124 264, 138 274, 165 268 Z" />
        <path d="M 335 208 L 404 172 C 414 182, 408 205, 388 218 C 402 226, 396 246, 372 252 C 376 264, 362 274, 335 268 Z" />
        <path d="M 212 330 C 206 355, 196 372, 186 382 C 178 390, 182 406, 192 406 C 202 406, 206 392, 208 384 C 216 368, 222 350, 225 332 Z" />
        <path d="M 288 330 C 294 355, 304 372, 314 382 C 322 390, 318 406, 308 406 C 298 406, 294 392, 292 384 C 284 368, 278 350, 275 332 Z" />
      </g>
    )}

    {/* ==================== EKOR & SAYAP SAMPING (ASLI TILAMASCOT) ==================== */}
    {/* Ekor Belakang */}
    <g id="tail">
      <path
        d="M 225 330 C 215 358, 222 374, 235 370 C 238 382, 262 382, 265 370 C 278 374, 285 358, 275 330 Z"
        fill="#00937D"
        stroke="#07473C"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M 232 330 C 226 348, 232 356, 240 353 C 243 362, 257 362, 260 353 C 268 356, 274 348, 268 330 Z"
        fill="#FFFFFF"
        stroke="#07473C"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
    </g>

    {/* Sayap Samping Kiri (Terlipat Manis) */}
    <g transform="rotate(-22 165 230)">
      <path
        d="M 165 208 L 86 168 C 74 178, 81 202, 102 215 C 89 223, 94 244, 120 250 C 116 262, 132 274, 165 268 Z"
        fill="#FFFFFF"
        stroke="#07473C"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M 165 202 C 145 189, 126 176, 110 168 C 104 184, 109 202, 124 216 C 136 228, 150 234, 163 236 Z"
        fill="#00937D"
        stroke="#07473C"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M 110 168 C 96 155, 82 142, 73 146 C 65 151, 71 176, 88 193 C 99 203, 112 210, 124 216 C 109 202, 104 184, 110 168 Z"
        fill="#00B894"
        stroke="#07473C"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </g>

    {/* Sayap Samping Kanan (Terlipat Manis) */}
    <g transform="rotate(22 335 230)">
      <path
        d="M 335 208 L 414 168 C 426 178, 419 202, 398 215 C 411 223, 406 244, 380 250 C 384 262, 368 274, 335 268 Z"
        fill="#FFFFFF"
        stroke="#07473C"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M 335 202 C 355 189, 374 176, 390 168 C 396 184, 391 202, 376 216 C 364 228, 350 234, 337 236 Z"
        fill="#00937D"
        stroke="#07473C"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M 390 168 C 404 155, 418 142, 427 146 C 435 151, 429 176, 412 193 C 401 203, 388 210, 376 216 C 391 202, 396 184, 390 168 Z"
        fill="#00B894"
        stroke="#07473C"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </g>

    {/* ==================== BADAN & KAKI (ASLI TILAMASCOT) ==================== */}
    {/* Badan Bulat Kuning */}
    <ellipse
      cx="250"
      cy="240"
      rx="105"
      ry="105"
      fill="#FBBF24"
      stroke="#07473C"
      strokeWidth="5.5"
    />
    {/* Shading Perut Bawah Solid */}
    <path
      d="M 152 275 C 180 322, 320 322, 348 275 C 325 342, 175 342, 152 275 Z"
      fill="#EAA012"
    />
    {/* Re-stroke Outline Badan */}
    <ellipse
      cx="250"
      cy="240"
      rx="105"
      ry="105"
      fill="none"
      stroke="#07473C"
      strokeWidth="5.5"
    />

    {/* Kaki Kiri & Kanan */}
    <path
      d="M 212 330 C 206 355, 196 372, 186 382 C 178 390, 182 406, 192 406 C 202 406, 206 392, 208 384 C 216 368, 222 350, 225 332 C 226 325, 214 323, 212 330 Z"
      fill="#FF5E6C"
      stroke="#07473C"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path
      d="M 288 330 C 294 355, 304 372, 314 382 C 322 390, 318 406, 308 406 C 298 406, 294 392, 292 384 C 284 368, 278 350, 275 332 C 274 325, 286 323, 288 330 Z"
      fill="#FF5E6C"
      stroke="#07473C"
      strokeWidth="5"
      strokeLinejoin="round"
    />

    {/* ==================== WAJAH KAWAII (MATA, PIPI, PARUH TILAMASCOT) ==================== */}
    <g id="face">
      {/* Bayangan Bawah Paruh */}
      <path d="M 234 228 L 266 228 L 250 256 Z" fill="#EAA012" />

      {/* Pipi Merona Coral (#FF6B6B / #FF5E6C) */}
      <circle cx="180" cy="226" r="15" fill="#FF6B6B" />
      <circle cx="320" cy="226" r="15" fill="#FF6B6B" />

      {/* Mata Kiri (Kawaii Emerald + Bintang Kilau) */}
      <g transform="translate(206, 192)">
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="27"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="4.5"
        />
        <circle cx="0" cy="0" r="19.5" fill="#008F7A" />
        <circle cx="0" cy="0" r="15.5" fill="#053B33" />
        <circle cx="8" cy="-8" r="6.5" fill="#FFFFFF" />
        <path
          d="M -6 1 Q -6 6 -1 6 Q -6 6 -6 11 Q -6 6 -11 6 Q -6 6 -6 1 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Mata Kanan (Kawaii Emerald + Bintang Kilau) */}
      <g transform="translate(294, 192)">
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="27"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="4.5"
        />
        <circle cx="0" cy="0" r="19.5" fill="#008F7A" />
        <circle cx="0" cy="0" r="15.5" fill="#053B33" />
        <circle cx="8" cy="-8" r="6.5" fill="#FFFFFF" />
        <path
          d="M -6 1 Q -6 6 -1 6 Q -6 6 -6 11 Q -6 6 -11 6 Q -6 6 -6 1 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Paruh Tersenyum Ceria (Gaya Happy/Idle TilaMascot) */}
      <g id="beak">
        <path
          d="M 230 214 L 250 246 L 270 214 Z"
          fill="#07473C"
          stroke="#07473C"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path d="M 238 224 Q 250 218 262 224 L 250 243 Z" fill="#FF6B6B" />
        <path
          d="M 226 214 C 232 196, 268 196, 274 214 Q 250 222 226 214 Z"
          fill="#FF6B6B"
          stroke="#07473C"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <circle cx="246" cy="206" r="1.8" fill="#07473C" />
        <circle cx="254" cy="206" r="1.8" fill="#07473C" />
      </g>
    </g>

    {/* ==================== PECI / SONGKOK (ASLI TILAMASCOT) ==================== */}
    <g id="accessory-peci-front">
      {/* Badan Peci */}
      <path
        d="M 196 142 L 203 94 Q 250 88 297 94 L 304 142 Q 250 149 196 142 Z"
        fill="#134E4A"
        stroke="#07473C"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* Lis Emas Bawah Peci */}
      <path
        d="M 198 136 Q 250 143 302 136"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Garis Kilap Peci Solid */}
      <path
        d="M 216 100 L 213 130"
        stroke="#00937D"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Emblem Bintang Emas di Tengah Peci */}
      <polygon
        points="250,104 253.5,112 262,112 255.5,117 258,125 250,120 242,125 244.5,117 238,112 246.5,112"
        fill="#FBBF24"
        stroke="#07473C"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </g>

    {/* ==================== BUKU KECIL TERBUKA & SAYAP DEPAN (HOLDING POSE) ==================== */}
    <g id="held-open-book-and-wings">
      {/* Buku Terbuka di Depan Dada (Coral Cover #FF6B6B + Halaman Putih) */}
      <g transform="translate(250, 294)">
        {/* Hard Shadow Buku di Atas Perut */}
        <path
          d="M -52 -20 Q -26 -28 0 -18 Q 26 -28 52 -20 V 28 Q 26 20 0 30 Q -26 20 -52 28 Z"
          fill="#07473C"
          transform="translate(0, 4)"
        />
        {/* Sampul Buku Coral (#FF6B6B) */}
        <path
          d="M -52 -20 Q -26 -28 0 -18 Q 26 -28 52 -20 V 28 Q 26 20 0 30 Q -26 20 -52 28 Z"
          fill="#FF6B6B"
          stroke="#07473C"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* Lembaran Halaman Putih */}
        <path
          d="M -45 -26 Q -22 -34 0 -24 Q 22 -34 45 -26 V 18 Q 22 10 0 20 Q -22 10 -45 18 Z"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        {/* Lipatan Tengah Buku */}
        <line
          x1="0"
          y1="-24"
          x2="0"
          y2="20"
          stroke="#07473C"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Detail Isi Halaman Kiri (Bintang Emas) & Kanan (Garis Ayat) */}
        <circle
          cx="-22"
          cy="-4"
          r="7"
          fill="#FBBF24"
          stroke="#07473C"
          strokeWidth="3"
        />
        <line
          x1="14"
          y1="-10"
          x2="31"
          y2="-10"
          stroke="#07473C"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="14"
          y1="0"
          x2="27"
          y2="0"
          stroke="#FF6B6B"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* Sayap Depan Kiri Memegang Buku (Path asli holdWingBase & holdWingTip TilaMascot) */}
      <g>
        <path
          d="M 150 252 C 142 300, 186 330, 238 318 C 246 304, 236 288, 216 276 C 196 264, 170 248, 150 252 Z"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M 166 290 C 184 312, 212 318, 236 312 C 238 304, 232 296, 224 290 C 206 294, 184 294, 166 290 Z"
          fill="#00937D"
          stroke="#07473C"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </g>

      {/* Sayap Depan Kanan Memegang Buku (Mirror dari Kiri) */}
      <g transform="translate(500 0) scale(-1 1)">
        <path
          d="M 150 252 C 142 300, 186 330, 238 318 C 246 304, 236 288, 216 276 C 196 264, 170 248, 150 252 Z"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M 166 290 C 184 312, 212 318, 236 312 C 238 304, 232 296, 224 290 C 206 294, 184 294, 166 290 Z"
          fill="#00937D"
          stroke="#07473C"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </svg>
);

export interface TartilaFaviconProps {
  size?: number | string;
  className?: string;
  variant?: "app-icon" | "sticker";
}

export const TartilaFaviconSvg: React.FC<TartilaFaviconProps> = ({
  size = 64,
  className = "",
  variant = "app-icon",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="120 74 260 260"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="Tartila Icon Closeup"
    className={className}
  >
    {/* App Icon Frame */}
    {variant === "app-icon" && (
      <>
        <rect x="132" y="86" width="240" height="240" rx="58" fill="#134E4A" />
        <rect
          x="124"
          y="78"
          width="240"
          height="240"
          rx="58"
          fill="#FFFFFF"
          stroke="#134E4A"
          strokeWidth="9"
        />
      </>
    )}

    <g transform="translate(246, 208) scale(0.84) translate(-250, -214)">
      {/* Die-Cut White Outline (Khusus Mode Sticker) */}
      {variant === "sticker" && (
        <g
          stroke="#FFFFFF"
          strokeWidth="24"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M 188 140 L 196 90 Q 250 82 304 90 L 312 140 Z" />
          <g transform="rotate(-14 165 230)">
            <path d="M 165 204 L 92 162 C 80 172, 87 198, 108 212 C 93 220, 98 242, 126 249 C 122 262, 138 274, 165 268 Z" />
            <path d="M 110 162 C 96 148, 82 134, 73 139 C 65 144, 71 170, 88 188 C 99 199, 112 208, 124 215 Z" />
          </g>
          <g transform="rotate(14 335 230)">
            <path d="M 335 204 L 408 162 C 420 172, 413 198, 392 212 C 407 220, 402 242, 374 249 C 378 262, 362 274, 335 268 Z" />
            <path d="M 390 162 C 404 148, 418 134, 427 139 C 435 144, 429 170, 412 188 C 401 199, 388 208, 376 215 Z" />
          </g>
          <circle cx="250" cy="222" r="95" />
        </g>
      )}

      {/* Hard Shadow Badan & Sayap */}
      <g transform="translate(6, 8)">
        <g transform="rotate(-14 165 230)">
          <path
            d="M 165 204 L 92 162 C 80 172, 87 198, 108 212 C 93 220, 98 242, 126 249 C 122 262, 138 274, 165 268 Z"
            fill="#134E4A"
          />
        </g>
        <g transform="rotate(14 335 230)">
          <path
            d="M 335 204 L 408 162 C 420 172, 413 198, 392 212 C 407 220, 402 242, 374 249 C 378 262, 362 274, 335 268 Z"
            fill="#134E4A"
          />
        </g>
        <circle cx="250" cy="222" r="95" fill="#134E4A" />
      </g>

      {/* Sayap Samping Kiri (Asli TilaMascot) */}
      <g transform="rotate(-14 165 230)">
        <path
          d="M 165 204 L 92 162 C 80 172, 87 198, 108 212 C 93 220, 98 242, 126 249 C 122 262, 138 274, 165 268 Z"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
        <path
          d="M 108 212 C 116 217, 123 220, 130 222 M 126 249 C 134 251, 140 251, 146 251"
          fill="none"
          stroke="#07473C"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M 165 198 C 145 184, 126 170, 110 162 C 104 180, 109 200, 124 215 C 136 227, 150 233, 163 235 Z"
          fill="#00937D"
          stroke="#07473C"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
        <path
          d="M 110 162 C 96 148, 82 134, 73 139 C 65 144, 71 170, 88 188 C 99 199, 112 208, 124 215 C 109 200, 104 180, 110 162 Z"
          fill="#00B894"
          stroke="#07473C"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Sayap Samping Kanan (Asli TilaMascot) */}
      <g transform="rotate(14 335 230)">
        <path
          d="M 335 204 L 408 162 C 420 172, 413 198, 392 212 C 407 220, 402 242, 374 249 C 378 262, 362 274, 335 268 Z"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
        <path
          d="M 392 212 C 384 217, 377 220, 370 222 M 374 249 C 366 251, 360 251, 354 251"
          fill="none"
          stroke="#07473C"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M 335 198 C 355 184, 374 170, 390 162 C 396 180, 391 200, 376 215 C 364 227, 350 233, 337 235 Z"
          fill="#00937D"
          stroke="#07473C"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
        <path
          d="M 390 162 C 404 148, 418 134, 427 139 C 435 144, 429 170, 412 188 C 401 199, 388 208, 376 215 C 391 200, 396 180, 390 162 Z"
          fill="#00B894"
          stroke="#07473C"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Body */}
      <circle
        cx="250"
        cy="222"
        r="95"
        fill="#FBBF24"
        stroke="#07473C"
        strokeWidth="7.5"
      />
      <path
        d="M 160 252 C 185 298, 315 298, 340 252 C 320 315, 180 315, 160 252 Z"
        fill="#EAA012"
      />
      <circle
        cx="250"
        cy="222"
        r="95"
        fill="none"
        stroke="#07473C"
        strokeWidth="7.5"
      />

      {/* Face */}
      <path d="M 232 216 L 268 216 L 250 246 Z" fill="#EAA012" />
      <circle cx="174" cy="212" r="16" fill="#FF6B6B" />
      <circle cx="326" cy="212" r="16" fill="#FF6B6B" />

      {/* Left Eye */}
      <g transform="translate(202, 180)">
        <ellipse
          cx="0"
          cy="0"
          rx="27"
          ry="29"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="6.5"
        />
        <circle cx="0" cy="0" r="20.5" fill="#008F7A" />
        <circle cx="0" cy="0" r="16" fill="#053B33" />
        <circle cx="8" cy="-8" r="7.5" fill="#FFFFFF" />
        <path
          d="M -6 1 Q -6 7 0 7 Q -6 7 -6 13 Q -6 7 -12 7 Q -6 7 -6 1 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Right Eye */}
      <g transform="translate(298, 180)">
        <ellipse
          cx="0"
          cy="0"
          rx="27"
          ry="29"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="6.5"
        />
        <circle cx="0" cy="0" r="20.5" fill="#008F7A" />
        <circle cx="0" cy="0" r="16" fill="#053B33" />
        <circle cx="8" cy="-8" r="7.5" fill="#FFFFFF" />
        <path
          d="M -6 1 Q -6 7 0 7 Q -6 7 -6 13 Q -6 7 -12 7 Q -6 7 -6 1 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Beak */}
      <path
        d="M 228 202 L 250 238 L 272 202 Z"
        fill="#07473C"
        stroke="#07473C"
        strokeWidth="6.5"
        strokeLinejoin="round"
      />
      <path d="M 237 214 Q 250 208 263 214 L 250 234 Z" fill="#FF6B6B" />
      <path
        d="M 224 202 C 230 183, 270 183, 276 202 Q 250 211 224 202 Z"
        fill="#FF6B6B"
        stroke="#07473C"
        strokeWidth="6.5"
        strokeLinejoin="round"
      />

      {/* Songkok / Peci */}
      <path
        d="M 188 140 L 196 90 Q 250 82 304 90 L 312 140 Q 250 148 188 140 Z"
        fill="#134E4A"
        stroke="#07473C"
        strokeWidth="7.5"
        strokeLinejoin="round"
      />
      <path
        d="M 191 133 Q 250 141 309 133"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <polygon
        points="250,96 254.5,106 265,106 257,112 260,122 250,116 240,122 243,112 235,106 245.5,106"
        fill="#FBBF24"
        stroke="#07473C"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Open Book */}
      <g transform="translate(250, 276)">
        <path
          d="M -60 -22 Q -30 -32 0 -20 Q 30 -32 60 -22 V 28 Q 30 18 0 30 Q -30 18 -60 28 Z"
          fill="#FF6B6B"
          stroke="#07473C"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path
          d="M -52 -29 Q -26 -38 0 -26 Q 26 -38 52 -29 V 16 Q 26 6 0 18 Q -26 6 -52 16 Z"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
        <line
          x1="0"
          y1="-26"
          x2="0"
          y2="18"
          stroke="#07473C"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <circle
          cx="-25"
          cy="-6"
          r="8"
          fill="#FBBF24"
          stroke="#07473C"
          strokeWidth="4"
        />
        <line
          x1="16"
          y1="-9"
          x2="34"
          y2="-9"
          stroke="#07473C"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </g>

      {/* Front Wings Holding Book */}
      <path
        d="M 152 242 C 144 286, 184 314, 232 302 C 240 288, 230 274, 212 262 C 194 252, 170 238, 152 242 Z"
        fill="#FFFFFF"
        stroke="#07473C"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M 166 276 C 182 296, 208 302, 230 296 C 232 288, 226 280, 218 276 C 202 280, 182 280, 166 276 Z"
        fill="#00937D"
        stroke="#07473C"
        strokeWidth="6.5"
        strokeLinejoin="round"
      />
      <g transform="translate(500 0) scale(-1 1)">
        <path
          d="M 152 242 C 144 286, 184 314, 232 302 C 240 288, 230 274, 212 262 C 194 252, 170 238, 152 242 Z"
          fill="#FFFFFF"
          stroke="#07473C"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path
          d="M 166 276 C 182 296, 208 302, 230 296 C 232 288, 226 280, 218 276 C 202 280, 182 280, 166 276 Z"
          fill="#00937D"
          stroke="#07473C"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
      </g>
    </g>
  </svg>
);
