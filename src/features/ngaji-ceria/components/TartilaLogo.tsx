import { useId } from "react";
import { motion } from "framer-motion";

export type TartilaLogoVariant = "hero" | "header" | "icon";
export type TartilaStyleVariant = "kufi" | "rounded" | "naskh";

export interface TartilaLogoProps {
  className?: string;
  /** Ukuran & kompleksitas: 'hero' (halaman utama), 'header' (navbar), 'icon' (favicon/kecil) */
  variant?: TartilaLogoVariant;
  /** Perbandingan 3 pendekatan tipografi Arab */
  styleVariant?: TartilaStyleVariant;
  /** Tampilkan sub-label teks Latin TARTILA pada ukuran hero */
  showLatinLabel?: boolean;
}

export function TartilaLogo({
  className = "",
  variant = "header",
  styleVariant = "kufi",
  showLatinLabel = false,
}: TartilaLogoProps) {
  const logoId = useId().replace(/:/g, "");

  // Konfigurasi ketebalan dan kelengkungan berdasarkan 3 style rekomendasi
  const styleConfig = {
    kufi: {
      coreStroke: 15,
      darkOutline: 21,
      whiteSticker: 25,
      dotRadius: 7.5,
      // Soft Geometric Kufi: sudut terstruktur dengan kurva terukur (r=10)
      taAlif:
        "M 314 50 L 314 72 Q 314 82 304 82 L 278 82 Q 268 82 268 72 L 268 26",
      ra: "M 238 50 L 238 74 Q 238 96 212 100",
      tiyaLamBase:
        "M 188 50 L 188 72 Q 188 82 178 82 L 74 82 Q 64 82 64 72 L 64 56",
      yaTooth: "M 148 52 L 148 82",
      lamStem: "M 112 26 L 112 82",
      lamAlifDiag: "M 96 82 L 72 30",
    },
    rounded: {
      coreStroke: 16.5,
      darkOutline: 22.5,
      whiteSticker: 26.5,
      dotRadius: 8.5,
      // Rounded Playful Arabic: kurva lebih membulat dan mengalir
      taAlif:
        "M 314 52 L 314 66 Q 314 82 296 82 L 284 82 Q 268 82 268 66 L 268 28",
      ra: "M 238 52 C 238 78, 232 96, 210 100",
      tiyaLamBase:
        "M 188 52 L 188 66 Q 188 82 172 82 L 80 82 Q 62 82 62 66 L 62 52",
      yaTooth: "M 148 54 L 148 82",
      lamStem: "M 112 28 L 112 82",
      lamAlifDiag: "M 98 80 C 90 62, 82 46, 72 30",
    },
    naskh: {
      coreStroke: 13.5,
      darkOutline: 19.5,
      whiteSticker: 23.5,
      dotRadius: 7,
      // Simplified Naskh: ayunan baseline sedikit miring & organik
      taAlif:
        "M 316 48 C 316 68, 312 82, 298 82 L 276 82 Q 268 82 268 72 L 268 24",
      ra: "M 238 48 C 240 70, 230 94, 208 102",
      tiyaLamBase:
        "M 190 48 C 190 68, 184 82, 172 82 L 156 82 Q 148 82 148 70 L 148 82 L 78 82 C 64 82, 60 72, 64 56",
      yaTooth: "M 148 50 L 148 82",
      lamStem: "M 112 24 L 112 82",
      lamAlifDiag: "M 98 82 C 92 60, 82 44, 70 28",
    },
  }[styleVariant];

  // Versi Ikon / Favicon (Monogram Huruf Ta 'ت' dengan 2 titik koral & 1 bintang)
  if (variant === "icon") {
    return (
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={`inline-flex items-center justify-center ${className}`}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 select-none sm:h-12 sm:w-12"
          role="img"
          aria-labelledby={`${logoId}-icon-title`}
        >
          <title id={`${logoId}-icon-title`}>Tartila — تارتيلا</title>
          <defs>
            <path
              id={`${logoId}-ta-monogram`}
              d="M 86 52 L 86 72 Q 86 84 74 84 L 46 84 Q 34 84 34 72 L 34 52"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id={`${logoId}-ta-dots`}>
              <circle cx="50" cy="36" r="7.5" />
              <circle cx="70" cy="36" r="7.5" />
            </g>
          </defs>

          {/* Hard Shadow Badge */}
          <rect x="14" y="14" width="96" height="96" rx="24" fill="#134E4A" />
          {/* Main Badge */}
          <rect
            x="8"
            y="8"
            width="96"
            height="96"
            rx="24"
            fill="#FFFBEB"
            stroke="#134E4A"
            strokeWidth="5"
          />

          {/* Aksen Bintang Tunggal */}
          <path
            d="M 90 20 Q 92 24.5 96.5 26.5 Q 92 28.5 90 33 Q 88 28.5 83.5 26.5 Q 88 24.5 90 20 Z"
            fill="#FEF08A"
            stroke="#134E4A"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Hard Shadow Huruf */}
          <use
            href={`#${logoId}-ta-monogram`}
            transform="translate(3.5 3.5)"
            stroke="#134E4A"
            strokeWidth="20"
          />
          <g
            transform="translate(3.5 3.5)"
            fill="#134E4A"
            stroke="#134E4A"
            strokeWidth="6"
          >
            <use href={`#${logoId}-ta-dots`} />
          </g>

          {/* Outline Putih Stiker */}
          <use
            href={`#${logoId}-ta-monogram`}
            stroke="#FFFFFF"
            strokeWidth="23"
          />
          <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="9">
            <use href={`#${logoId}-ta-dots`} />
          </g>

          {/* Outline Teal Gelap */}
          <use
            href={`#${logoId}-ta-monogram`}
            stroke="#134E4A"
            strokeWidth="19"
          />
          <g fill="#134E4A" stroke="#134E4A" strokeWidth="5">
            <use href={`#${logoId}-ta-dots`} />
          </g>

          {/* Isi Utama Huruf & Titik Koral */}
          <use
            href={`#${logoId}-ta-monogram`}
            stroke="#0D9488"
            strokeWidth="13.5"
          />
          <use href={`#${logoId}-ta-dots`} fill="#FF6B6B" />
        </svg>
      </motion.div>
    );
  }

  const isHero = variant === "hero";
  const viewBoxHeight = isHero && showLatinLabel ? 175 : 150;

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        viewBox={`0 0 380 ${viewBoxHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={
          isHero
            ? "h-20 w-auto select-none sm:h-28"
            : "h-12 w-auto select-none sm:h-16"
        }
        role="img"
        aria-labelledby={`${logoId}-title`}
      >
        <title id={`${logoId}-title`}>Tartila — تارتيلا</title>

        <defs>
          {/* Konstruksi Huruf Arab تارتيلا (Kanan ke Kiri) */}
          <g
            id={`${logoId}-letters`}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 1. تا (Ta + Alif) */}
            <path d={styleConfig.taAlif} />

            {/* 2. ر (Ra) */}
            <path d={styleConfig.ra} />

            {/* 3. تيلا (Jalur Baseline Ta - Ya - Lam-Alif) */}
            <path d={styleConfig.tiyaLamBase} />
            {/* Gigi Ya (ي) */}
            <path d={styleConfig.yaTooth} />
            {/* Tiang Lam (ل) */}
            <path d={styleConfig.lamStem} />
            {/* Palang Alif pada Lam-Alif (لا) */}
            <path d={styleConfig.lamAlifDiag} />
          </g>

          {/* Titik Huruf Ta Kedua (ت - Atas) & Ya (ي - Bawah) */}
          <g id={`${logoId}-teal-dots`}>
            {/* 2 Titik Ta kedua (di atas gigi x=188) */}
            <circle cx="174" cy="32" r={styleConfig.dotRadius} />
            <circle cx="192" cy="32" r={styleConfig.dotRadius} />
            {/* 2 Titik Ya (di bawah gigi x=148) */}
            <circle cx="139" cy="103" r={styleConfig.dotRadius} />
            <circle cx="157" cy="103" r={styleConfig.dotRadius} />
          </g>

          {/* Titik Huruf Ta Pertama (ت - Kanan Atas, Aksen Koral) */}
          <g id={`${logoId}-coral-dots`}>
            <circle cx="294" cy="32" r={styleConfig.dotRadius} />
            <circle cx="312" cy="32" r={styleConfig.dotRadius} />
          </g>

          {/* Kurva Senyum Edukatif (Lebih Ramping & Terkontrol) */}
          <g
            id={`${logoId}-smile`}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 176 116 Q 222 134 268 114" />
            <path d="M 273 119 C 273 111, 268 109, 261 111" />
          </g>

          {/* 3 Bintang Aksen Sederhana (Menggantikan 8 Bintang Lama) */}
          <g id={`${logoId}-stars`} strokeLinejoin="round">
            {/* Bintang Kanan Atas */}
            <path d="M 332 22 Q 334.5 27.5 340 30 Q 334.5 32.5 332 38 Q 329.5 32.5 324 30 Q 329.5 27.5 332 22 Z" />
            {/* Bintang Kiri Atas */}
            <path d="M 48 24 Q 50.2 29 55 31 Q 50.2 33 48 38 Q 45.8 33 41 31 Q 45.8 29 48 24 Z" />
            {/* Bintang Kiri Bawah */}
            <path d="M 88 104 Q 90 108.5 94.5 110.5 Q 90 112.5 88 117 Q 86 112.5 81.5 110.5 Q 86 108.5 88 104 Z" />
          </g>
        </defs>

        {/* 1. Kartu Latar Neo-Brutalism + Hard Shadow */}
        <rect x="36" y="14" width="314" height="124" rx="24" fill="#134E4A" />
        <rect
          x="29"
          y="7"
          width="314"
          height="124"
          rx="24"
          fill="#FFFBEB"
          stroke="#134E4A"
          strokeWidth="5.5"
        />

        {/* 2. Ornamen Bintang (3 Aksen Proporsional) */}
        <use
          href={`#${logoId}-stars`}
          transform="translate(2 2.5)"
          fill="#134E4A"
        />
        <use
          href={`#${logoId}-stars`}
          fill="#FEF08A"
          stroke="#134E4A"
          strokeWidth="2.2"
        />

        {/* 3. Elemen Senyum Pendukung */}
        <use
          href={`#${logoId}-smile`}
          transform="translate(3 3)"
          stroke="#134E4A"
          strokeWidth="12"
        />
        <use href={`#${logoId}-smile`} stroke="#FFFFFF" strokeWidth="14" />
        <use href={`#${logoId}-smile`} stroke="#134E4A" strokeWidth="10.5" />
        <use href={`#${logoId}-smile`} stroke="#FF6B6B" strokeWidth="6" />

        {/* 4. Layering Tulisan Arab: Hard Shadow Offset */}
        <g transform="translate(4 4)">
          <use
            href={`#${logoId}-letters`}
            stroke="#134E4A"
            strokeWidth={styleConfig.darkOutline}
          />
          <g fill="#134E4A" stroke="#134E4A" strokeWidth="6">
            <use href={`#${logoId}-teal-dots`} />
            <use href={`#${logoId}-coral-dots`} />
          </g>
        </g>

        {/* 5. Layering Tulisan Arab: Efek Stiker Putih (Terkontrol) */}
        <use
          href={`#${logoId}-letters`}
          stroke="#FFFFFF"
          strokeWidth={styleConfig.whiteSticker}
        />
        <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="9.5">
          <use href={`#${logoId}-teal-dots`} />
          <use href={`#${logoId}-coral-dots`} />
        </g>

        {/* 6. Layering Tulisan Arab: Outline Luar Teal Gelap */}
        <use
          href={`#${logoId}-letters`}
          stroke="#134E4A"
          strokeWidth={styleConfig.darkOutline}
        />
        <g fill="#134E4A" stroke="#134E4A" strokeWidth="5.5">
          <use href={`#${logoId}-teal-dots`} />
          <use href={`#${logoId}-coral-dots`} />
        </g>

        {/* 7. Layering Tulisan Arab: Warna Utama Teal & Titik Aksen */}
        <use
          href={`#${logoId}-letters`}
          stroke="#0D9488"
          strokeWidth={styleConfig.coreStroke}
        />
        <use href={`#${logoId}-teal-dots`} fill="#0D9488" />
        <use href={`#${logoId}-coral-dots`} fill="#FF6B6B" />

        {/* 8. Sub-label Identitas Latin (Opsional untuk Versi Hero) */}
        {isHero && showLatinLabel && (
          <g transform="translate(0 4)">
            <rect
              x="129"
              y="122"
              width="126"
              height="34"
              rx="10"
              fill="#134E4A"
            />
            <rect
              x="125"
              y="118"
              width="126"
              height="34"
              rx="10"
              fill="#FEF08A"
              stroke="#134E4A"
              strokeWidth="4"
            />
            <text
              x="188"
              y="141"
              textAnchor="middle"
              fill="#134E4A"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="16"
              letterSpacing="3.5"
            >
              TARTILA
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
