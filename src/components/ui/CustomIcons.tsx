import React from "react";

export interface SvgProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
  color?: string;
  stroke?: string;
  strokeWidth?: number | string;
  x?: number | string;
  y?: number | string;
}

export type LucideIcon = React.FC<SvgProps>;

/**
 * ============================================================================
 * TARTILA NEO-BRUTALISM CUSTOM ILLUSTRATION ICONS
 * Style: stroke="var(--svg-primary)", strokeWidth="2.5", round linecap/join, solid flat colors
 * Single Source of Truth for icons in Tartila
 * ============================================================================
 */

// --- BOTTOM NAV ICONS (Vektor Berwarna Neo-Brutalism) ---

export const HomeSvg: React.FC<SvgProps> = ({
  size = 28,
  className = "",
  stroke,
  ...props
}) => {
  const strokeColor = stroke || "#134E4A";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Dinding Rumah Kuning/Krem */}
      <rect
        x="5.5"
        y="11.5"
        width="17"
        height="12.5"
        rx="2"
        fill="#FEF08A"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Atap Segitiga Merah */}
      <polygon
        points="14,4 4,12.5 24,12.5"
        fill="#EF4444"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Jendela Atap Sirkular */}
      <circle
        cx="14"
        cy="9"
        r="1.8"
        fill="#BAE6FD"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Pintu Melengkung Cokelat */}
      <path
        d="M11 24V16.5C11 15.1 12.3 14 14 14C15.7 14 17 15.1 17 16.5V24"
        fill="#92400E"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Gagang Pintu Emas */}
      <circle cx="15.8" cy="19.5" r="0.8" fill="#FBBF24" />
    </svg>
  );
};
export const HomeVectorSvg = HomeSvg;

export const CompassSvg: React.FC<SvgProps> = ({
  size = 28,
  className = "",
  stroke,
  ...props
}) => {
  const strokeColor = stroke || "#134E4A";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Cincin Gantungan Atas Kompas Emas */}
      <circle
        cx="14"
        cy="4.5"
        r="2.5"
        fill="#FEF08A"
        stroke={strokeColor}
        strokeWidth="2"
      />
      {/* Badan Kompas Teal (#0D9488) */}
      <circle
        cx="14"
        cy="15"
        r="10.5"
        fill="#0D9488"
        stroke={strokeColor}
        strokeWidth="2.5"
      />
      {/* Pelat Dial Dalam Kompas (Mint Lembut #CCFBF1) */}
      <circle
        cx="14"
        cy="15"
        r="7.5"
        fill="#CCFBF1"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Titik Mata Angin */}
      <circle cx="14" cy="9.5" r="0.8" fill={strokeColor} />
      <circle cx="14" cy="20.5" r="0.8" fill={strokeColor} />
      <circle cx="8.5" cy="15" r="0.8" fill={strokeColor} />
      <circle cx="19.5" cy="15" r="0.8" fill={strokeColor} />
      {/* Jarum Kompas Atas (Merah #EF4444) */}
      <polygon
        points="14,8.5 16.5,15 14,13.5 11.5,15"
        fill="#EF4444"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Jarum Kompas Bawah (Putih #FFFFFF) */}
      <polygon
        points="14,21.5 16.5,15 14,16.5 11.5,15"
        fill="#FFFFFF"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Pusat Poros Emas */}
      <circle
        cx="14"
        cy="15"
        r="2"
        fill="#FBBF24"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  );
};
export const CompassVectorSvg = CompassSvg;

export const GamepadSvg: React.FC<SvgProps> = ({
  size = 28,
  className = "",
  stroke,
  ...props
}) => {
  const strokeColor = stroke || "#134E4A";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Grips Bawah Kiri & Kanan */}
      <path
        d="M5 19L3 23C2.5 24 3.5 25 4.5 24.5L9 21"
        fill="#7C3AED"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M23 19L25 23C25.5 24 24.5 25 23.5 24.5L19 21"
        fill="#7C3AED"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Bodi Gamepad Ungu (#8B5CF6) */}
      <rect
        x="2.5"
        y="7"
        width="23"
        height="14"
        rx="7"
        fill="#8B5CF6"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* D-Pad Kiri Kuning/Krem */}
      <rect
        x="6.5"
        y="12.5"
        width="6"
        height="2.5"
        rx="0.5"
        fill="#FEF08A"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <rect
        x="8.25"
        y="10.75"
        width="2.5"
        height="6"
        rx="0.5"
        fill="#FEF08A"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Tombol Kanan Merah (#EF4444) & Kuning (#FBBF24) */}
      <circle
        cx="18.5"
        cy="11.5"
        r="1.8"
        fill="#EF4444"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <circle
        cx="21.5"
        cy="14.5"
        r="1.8"
        fill="#FBBF24"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Lampu Indikator Tengah */}
      <circle cx="14" cy="11.5" r="1" fill="#34D399" />
    </svg>
  );
};
export const GamepadVectorSvg = GamepadSvg;

export const ProfileSvg: React.FC<SvgProps> = ({
  size = 28,
  className = "",
  stroke,
  ...props
}) => {
  const strokeColor = stroke || "#134E4A";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Baju Biru (#3B82F6) */}
      <path
        d="M4.5 24.5C4.5 19.5 8.5 16.5 14 16.5C19.5 16.5 23.5 19.5 23.5 24.5"
        fill="#3B82F6"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Kerah Baju Putih */}
      <path
        d="M12 16.5L14 19.5L16 16.5"
        fill="#FFFFFF"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Kepala / Wajah Berwarna Kulit (Peach #FED7AA) */}
      <circle
        cx="14"
        cy="10.5"
        r="5.5"
        fill="#FED7AA"
        stroke={strokeColor}
        strokeWidth="2.5"
      />
      {/* Mata / Ekspresi Wajah Ceria */}
      <circle cx="12" cy="10.5" r="0.9" fill={strokeColor} />
      <circle cx="16" cy="10.5" r="0.9" fill={strokeColor} />
      <path
        d="M12.5 12.5C13 13.5 15 13.5 15.5 12.5"
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Peci Santri di atas kepala (Toska #0D9488 dengan lis emas #FEF08A) */}
      <path
        d="M9.5 9.5C9.5 5.5 11 4.5 14 4.5C17 4.5 18.5 5.5 18.5 9.5H9.5Z"
        fill="#0D9488"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 9.5H18.5"
        stroke="#FEF08A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
export const ProfileVectorSvg = ProfileSvg;

// --- HEADER STATS & EKONOMI ICONS ---

export const CoinSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Lingkaran koin luar */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="#FBBF24"
        stroke={strokeColor}
        strokeWidth="2.5"
      />
      {/* Lingkaran inner rim halus */}
      <circle
        cx="12"
        cy="12"
        r="6.8"
        fill="#FDE68A"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Simbol Bintang Koin di Tengah (Bukan Pizza) */}
      <polygon
        points="12,7.5 13.3,10.2 16.3,10.5 14.1,12.5 14.7,15.5 12,13.9 9.3,15.5 9.9,12.5 7.7,10.5 10.7,10.2"
        fill="#B45309"
        stroke={strokeColor}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* Highlight kilap di tepi atas */}
      <path
        d="M7 8C8.2 6.5 10 5.5 12 5.5"
        stroke="var(--svg-accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const HeartSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#FF6B6B"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Highlight kilap */}
      <path
        d="M6.5 6.5C5.5 7.5 5.5 9 5.5 9"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const FireSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Api Luar - Lebih mekar & proporsional */}
      <path
        d="M12 1.5C9.5 5 4.5 8 4.5 14C4.5 18.14 7.86 21.5 12 21.5C16.14 21.5 19.5 18.14 19.5 14C19.5 8.5 15.2 5.5 12 1.5Z"
        fill="#FF6B6B"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Api Dalam Kuning */}
      <path
        d="M12 7.5C10 10.5 7.5 12.5 7.5 15.5C7.5 18 9.5 20 12 20C14.5 20 16.5 18 16.5 15.5C16.5 12.5 14 10.5 12 7.5Z"
        fill="#FBBF24"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Inti Api Putih */}
      <ellipse cx="12" cy="16.5" rx="2" ry="2.5" fill="#FFFFFF" />
    </svg>
  );
};

export const TrophySvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Gagang Kiri & Kanan */}
    <path
      d="M6 6H3C2.5 6 2 6.5 2 7V9C2 11.2 3.8 13 6 13M18 6H21C21.5 6 22 6.5 22 7V9C22 11.2 20.2 13 18 13"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Cawan */}
    <path
      d="M6 4H18V11C18 14.3 15.3 17 12 17C8.7 17 6 14.3 6 11V4Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Batang & Kaki */}
    <path
      d="M12 17V20M8 20H16"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Bintang di cawan */}
    <path
      d="M12 7.5L13 9.5L15 9.8L13.5 11.2L14 13.2L12 12.2L10 13.2L10.5 11.2L9 9.8L11 9.5L12 7.5Z"
      fill="#FF6B6B"
    />
  </svg>
);

export const CrownSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
  ...props
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3 18L4.5 7L9 12L12 4L15 12L19.5 7L21 18H3Z"
        fill="#FBBF24"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Permata Mahkota */}
      <circle
        cx="4.5"
        cy="7"
        r="1.5"
        fill="#FF6B6B"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="4"
        r="1.5"
        fill="#38BDF8"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <circle
        cx="19.5"
        cy="7"
        r="1.5"
        fill="#FF6B6B"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const GiftSvg: React.FC<SvgProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Badan Kotak */}
    <rect
      x="4"
      y="10"
      width="16"
      height="11"
      rx="2"
      fill="#FF6B6B"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Tutup Kotak */}
    <rect
      x="3"
      y="6"
      width="18"
      height="4"
      rx="1.5"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Pita Vertikal */}
    <line
      x1="12"
      y1="6"
      x2="12"
      y2="21"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    {/* Pita Busur Atas */}
    <path
      d="M12 6C10 4 8 4 8 5C8 6 12 6 12 6ZM12 6C14 4 16 4 16 5C16 6 12 6 12 6Z"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const StoreSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
  ...props
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Tenda Toko Belang */}
      <path
        d="M3 8L5 3H19L21 8"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 8C3 9.5 4.5 10.5 6 10.5C7.5 10.5 9 9.5 9 8C9 9.5 10.5 10.5 12 10.5C13.5 10.5 15 9.5 15 8C15 9.5 16.5 10.5 18 10.5C19.5 10.5 21 9.5 21 8H3Z"
        fill="#FF6B6B"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Badan Toko */}
      <path
        d="M4 10.5V20C4 20.5 4.5 21 5 21H19C19.5 21 20 20.5 20 20V10.5"
        fill="#0D9488"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Pintu / Jendela Toko */}
      <rect
        x="9"
        y="14"
        width="6"
        height="7"
        rx="1"
        fill="#FEF08A"
        stroke={strokeColor}
        strokeWidth="2"
      />
    </svg>
  );
};

export const TicketSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 8C3 7 4 6 5 6H19C20 6 21 7 21 8C19.5 8 19.5 10 19.5 10C19.5 10 19.5 12 21 12C21 13 20 14 19 14H5C4 14 3 13 3 12C4.5 12 4.5 10 4.5 10C4.5 10 4.5 8 3 8Z"
        transform="scale(1, 1.25) translate(0, -1)"
        fill="#FBBF24"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="#FF6B6B"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  );
};

// --- BELAJAR, EXPLORE & MENU ICONS ---

export const TilawatiSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
}) => {
  const strokeColor = stroke || "currentColor";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
        fill="#2DD4BF"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 5C9 3.5 5 3.5 5 6V17C5 17 9 15 12 17C15 15 19 17 19 17V6C19 3.5 15 3.5 12 5Z"
        fill="#FFFFFF"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 5V17"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const TajwidKeySvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12.5 11.5L20 19M16.5 15.5L14 18M19 18L16.5 20.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="8.5"
      cy="8.5"
      r="5.5"
      fill="#FBBF24"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <circle cx="8.5" cy="8.5" r="2" fill="#FFFFFF" />
  </svg>
);

export const GalaxyStarSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 16C5 19.5 10 20.5 15.5 18C20 16 21.5 11.5 20 8.5"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M12 2.5L14.6 7.8L20.5 8.6L16.2 12.8L17.2 18.6L12 15.8L6.8 18.6L7.8 12.8L3.5 8.6L9.4 7.8L12 2.5Z"
      fill="#FBBF24"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const DoaChestSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="3"
      y="9"
      width="18"
      height="11"
      rx="2.5"
      fill="#FBBF24"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M3 9C3 6.23858 5.23858 4 8 4H16C18.7614 4 21 6.23858 21 9H3Z"
      fill="#EF4444"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <rect
      x="10"
      y="7"
      width="4"
      height="5"
      rx="1"
      fill="#FFFFFF"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const QuranSvg: React.FC<SvgProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 20L12 15L19 20M8 14L16 20M16 14L8 20"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 5C9 3.5 4 4 4 6.5V14.5C4 14.5 9 13 12 15C15 13 20 14.5 20 14.5V6.5C20 4 15 3.5 12 5Z"
      fill="#FEF08A"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 5V15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const JurnalCalendarSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="3"
      fill="#FFFFFF"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <path
      d="M3 9C3 6.79086 4.79086 5 7 5H17C19.2091 5 21 6.79086 21 9V10H3V9Z"
      fill="#EF4444"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M8 3V6M16 3V6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M9 15.5L11 17.5L15.5 13"
      stroke="#10B981"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CardsSvg: React.FC<SvgProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="4"
      y="5"
      width="11"
      height="15"
      rx="2"
      transform="rotate(-8 4 5)"
      fill="#38BDF8"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <rect
      x="9"
      y="4"
      width="11"
      height="15"
      rx="2"
      transform="rotate(6 9 4)"
      fill="#FFFFFF"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <circle
      cx="14.5"
      cy="11.5"
      r="2.5"
      fill="#FBBF24"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export const MetronomeSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
}) => {
  const strokeColor = stroke || "#134E4A";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7 21L10 3H14L17 21H7Z"
        fill="#F59E0B"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 15L12 8L14.5 15H9.5Z"
        fill="#FEF3C7"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="19"
        x2="16"
        y2="6"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="14.8"
        cy="10"
        r="2.2"
        fill="#EF4444"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <line
        x1="5"
        y1="21"
        x2="19"
        y2="21"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const SearchSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  stroke,
}) => {
  const strokeColor = stroke || "#134E4A";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15.5 15.5L20.5 20.5"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        fill="#BAE6FD"
        stroke={strokeColor}
        strokeWidth="2.5"
      />
      <circle cx="9" cy="9" r="2" fill="#FFFFFF" />
    </svg>
  );
};

export const SparklesSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
      fill="#FBBF24"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="19" cy="5" r="2" fill="#FF6B6B" />
  </svg>
);

export const MoonSvg: React.FC<SvgProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M19.5 14.5C18.2 15.1 16.7 15.5 15 15.5C9.75 15.5 5.5 11.25 5.5 6C5.5 4.8 5.7 3.6 6.2 2.5C3.6 4.1 2 7 2 10.5C2 15.75 6.25 20 11.5 20C15.3 20 18.6 17.7 19.5 14.5Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="16.5"
      cy="6.5"
      r="2"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
  </svg>
);

export const SunSvg: React.FC<SvgProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="12"
      cy="12"
      r="5"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <path
      d="M12 2V5M12 19V22M2 12H5M19 12H22M4.9 4.9L7 7M17 17L19.1 19.1M4.9 19.1L7 17M17 7L19.1 4.9"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const UtensilsSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18 2V20M15 2V8C15 9.7 16.3 11 18 11M21 2V8C21 9.7 19.7 11 18 11"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 2V20M9 2C9 5.3 7.7 8 6 8C4.3 8 3 5.3 3 2H9Z"
      fill="#FF6B6B"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HandsPrayingSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 18V8C6 6.3 7.3 5 9 5C10.7 5 12 6.3 12 8V18"
      fill="#FED7AA"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 18V8C18 6.3 16.7 5 15 5C13.3 5 12 6.3 12 8V18"
      fill="#FED7AA"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 18H20"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ArrowRightSvg: React.FC<SvgProps> = ({
  size = 16,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 12H19M13 6L19 12L13 18"
      stroke="var(--svg-primary)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronRightSvg: React.FC<SvgProps> = ({
  size = 18,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 5L16 12L9 19"
      stroke="var(--svg-primary)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlaySvg: React.FC<SvgProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <polygon
      points="7,4 20,12 7,20"
      fill="var(--svg-secondary)"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShuffleSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16 3H21V8M4 20L20 4M21 16V21H16M15 15L20 20M4 4L9 9"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckSvg: React.FC<SvgProps & { showCircle?: boolean }> = ({
  size = 24,
  className = "",
  stroke,
  showCircle = true,
  ...props
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  if (!showCircle) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <path
          d="M5 12L10 17L19 7"
          stroke={stroke || "currentColor"}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="#10B981"
        stroke={strokeColor}
        strokeWidth="2.5"
      />
      <path
        d="M8 12L11 15L16 9"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const XSvg: React.FC<SvgProps & { showCircle?: boolean }> = ({
  size = 24,
  className = "",
  stroke,
  showCircle = true,
  ...props
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  if (!showCircle) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke={stroke || "currentColor"}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="#FF6B6B"
        stroke={strokeColor}
        strokeWidth="2.5"
      />
      <path
        d="M8.5 8.5L15.5 15.5M15.5 8.5L8.5 15.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const LockSvg: React.FC<SvgProps> = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2.5"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <path
      d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="15.5" r="1.5" fill="var(--svg-primary)" />
  </svg>
);

export const GraduationCapSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 3L2 8L12 13L22 8L12 3Z"
        fill="var(--svg-secondary)"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 10.5V16C6 17.5 8.7 20 12 20C15.3 20 18 17.5 18 16V10.5"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22 8V15"
        stroke="#FF6B6B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const MedalSvg: React.FC<SvgProps> = ({ size = 26, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 2L12 11L17 2M9 2H15"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="15"
      r="6.5"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <circle cx="12" cy="15" r="2" fill="#FFFFFF" />
  </svg>
);

export const PencilSvg: React.FC<SvgProps> = ({
  size = 18,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16.5 3.5L20.5 7.5L7 21H3V17L16.5 3.5Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 6L18 10"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const KeyRoundSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  stroke,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="8"
      cy="8"
      r="5"
      fill="#FBBF24"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.5"
    />
    <path
      d="M12 12L21 21M17 17L19 19M19 15L21 17"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ClipboardListSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  stroke,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="4"
      y="5"
      width="16"
      height="16"
      rx="2.5"
      fill="#FFFFFF"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.5"
    />
    <rect
      x="8"
      y="2"
      width="8"
      height="4"
      rx="1.5"
      fill="#FF6B6B"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2"
    />
    <path
      d="M8 11H16M8 15H14"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const DownloadSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  stroke,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M12 3V15M7 10L12 15L17 10"
      stroke={stroke || "var(--svg-secondary)"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LogOutSvg: React.FC<SvgProps> = ({
  size = 18,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 21H5C4 21 3 20 3 19V5C3 4 4 3 5 3H9"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M16 17L21 12L16 7M21 12H9"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrashSvg: React.FC<SvgProps> = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 6H21M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6M5 6L6 20C6 21 7 22 8 22H16C17 22 18 21 18 20L19 6"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11V17M14 11V17"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ZapSvg: React.FC<SvgProps> = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <polygon
      points="13,2 3,14 12,14 11,22 21,10 12,10"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShirtSvg: React.FC<SvgProps> = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 4L3 8L6 11L7 9V20H17V9L18 11L21 8L17 4C15 6 9 6 7 4Z"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const GlassesSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="6.5"
      cy="13.5"
      r="4"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <circle
      cx="17.5"
      cy="13.5"
      r="4"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <path
      d="M10.5 13.5H13.5M2.5 13L4 9M21.5 13L20 9"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SnowflakeSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2V22M2 12H22M5 5L19 19M5 19L19 5"
      stroke="#38BDF8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="12"
      r="2.5"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
  </svg>
);

export const StarSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  stroke,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <polygon
      points="12,2 15,9 22,9.5 17,14.5 18.5,21.5 12,18 5.5,21.5 7,14.5 2,9.5 9,9"
      fill="#FBBF24"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

// Backward aliases
export const UserSvg = ProfileSvg;
export const CoinsSvg = CoinSvg;
export const BookOpenSvg = TilawatiSvg;

// --- ADDITIONAL NEO-BRUTALISM UI & NAVIGATION ICONS ---

export const ChevronLeftSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  color,
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M15 18L9 12L15 6"
      stroke={stroke || color || "#134E4A"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDownSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  color,
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M6 9L12 15L18 9"
      stroke={stroke || color || "#134E4A"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronUpSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  color,
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M18 15L12 9L6 15"
      stroke={stroke || color || "#134E4A"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowLeftSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  color,
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke={stroke || color || "#134E4A"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Volume2Svg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M11 5L6 9H2V15H6L11 19V5Z"
      fill="var(--svg-accent)"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 8.5C16.5 9.5 17 10.7 17 12C17 13.3 16.5 14.5 15.5 15.5"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M19 5C20.8 6.9 22 9.3 22 12C22 14.7 20.8 17.1 19 19"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const VolumeXSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M11 5L6 9H2V15H6L11 19V5Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <line
      x1="22"
      y1="9"
      x2="16"
      y2="15"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="9"
      x2="22"
      y2="15"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const PauseSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect
      x="6"
      y="4"
      width="4"
      height="16"
      rx="2"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <rect
      x="14"
      y="4"
      width="4"
      height="16"
      rx="2"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
  </svg>
);

export const InfoSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle
      cx="12"
      cy="12"
      r="9.5"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <line
      x1="12"
      y1="16"
      x2="12"
      y2="11"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="8" r="1.2" fill="var(--svg-primary)" />
  </svg>
);

export const RefreshCwSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M21 12A9 9 0 0 0 6 5.3L3 8"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 3V8H8"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12A9 9 0 0 0 18 18.7L21 16"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 21V16H16"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Share2Svg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle
      cx="18"
      cy="5"
      r="3"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <circle
      cx="6"
      cy="12"
      r="3"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <circle
      cx="18"
      cy="19"
      r="3"
      fill="#FF6B6B"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <line
      x1="8.6"
      y1="13.5"
      x2="15.4"
      y2="17.5"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="15.4"
      y1="6.5"
      x2="8.6"
      y2="10.5"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Loader2Svg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  color,
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`animate-spin ${className}`}
    style={style}
  >
    <path
      d="M21 12a9 9 0 1 1-6.219-8.56"
      stroke={stroke || color || "currentColor"}
      strokeWidth="2.8"
      strokeLinecap="round"
    />
  </svg>
);

export const TrendingUpSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <polyline
      points="23 6 13.5 15.5 8.5 10.5 1 18"
      stroke="var(--svg-secondary)"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="17 6 23 6 23 12"
      stroke="var(--svg-secondary)"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ShieldSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
  fill,
  color,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      fill={fill || color || "#FFFFFF"}
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const ListSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  color,
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <line
      x1="8"
      y1="6"
      x2="21"
      y2="6"
      stroke={stroke || color || "#134E4A"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="12"
      x2="21"
      y2="12"
      stroke={stroke || color || "#134E4A"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="18"
      x2="21"
      y2="18"
      stroke={stroke || color || "#134E4A"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="4" cy="6" r="1.5" fill={stroke || color || "#134E4A"} />
    <circle cx="4" cy="12" r="1.5" fill={stroke || color || "#134E4A"} />
    <circle cx="4" cy="18" r="1.5" fill={stroke || color || "#134E4A"} />
  </svg>
);

export const UsersSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      fill="#8B5CF6"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="9"
      cy="7"
      r="4"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <path
      d="M22 21v-2a4 4 0 0 0-3-3.87"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 3.13a4 4 0 0 1 0 7.75"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const MoreVerticalSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  color,
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="2" fill={stroke || color || "#134E4A"} />
    <circle cx="12" cy="5" r="2" fill={stroke || color || "#134E4A"} />
    <circle cx="12" cy="19" r="2" fill={stroke || color || "#134E4A"} />
  </svg>
);

export const LayoutGridSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="2"
      fill="#FF6B6B"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="2"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="2"
      fill="var(--svg-secondary)"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="2"
      fill="#8B5CF6"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
  </svg>
);

export const TimerSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle
      cx="12"
      cy="14"
      r="8"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <line
      x1="12"
      y1="6"
      x2="12"
      y2="2"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="14"
      x2="15"
      y2="11"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ScrollTextSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M19 17V5a2 2 0 0 0-2-2H4"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <line
      x1="10"
      y1="8"
      x2="15"
      y2="8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="10"
      y1="12"
      x2="15"
      y2="12"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const PlusSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  color,
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M12 5V19M5 12H19"
      stroke={stroke || color || "#134E4A"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const MinusSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  color,
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M5 12H19"
      stroke={stroke || color || "#134E4A"}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const EyeSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      fill="#FFFFFF"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="var(--svg-secondary)"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2"
    />
  </svg>
);

export const EyeSlashSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  stroke,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
      stroke={stroke || "var(--svg-primary)"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="1"
      y1="1"
      x2="23"
      y2="23"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const MosqueSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M12 3c-3 3-5 5.5-5 8.5h10C17 8.5 15 6 12 3z"
      fill="var(--svg-secondary)"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <rect
      x="4"
      y="11.5"
      width="16"
      height="9.5"
      rx="1"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
    />
    <path
      d="M10 21v-4a2 2 0 0 1 4 0v4"
      fill="var(--svg-secondary)"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="2"
      r="1"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="1"
    />
  </svg>
);

export const SettingsSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    role="img"
    aria-label="Settings"
  >
    <path
      d="M19 5H29L31 11L36 13L41 10L46 19L41 23V28L46 32L41 41L35 38L30 41L29 47H19L17 41L12 38L7 41L2 32L7 28V23L2 19L7 10L13 13L17 11L19 5Z"
      fill="var(--svg-primary)"
      transform="translate(1 1) scale(0.96)"
    />

    <path
      d="M19 5H29L31 11L36 13L41 10L46 19L41 23V28L46 32L41 41L35 38L30 41L29 47H19L17 41L12 38L7 41L2 32L7 28V23L2 19L7 10L13 13L17 11L19 5Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="3"
      strokeLinejoin="round"
      transform="translate(0 -2) scale(0.96)"
    />

    <circle
      cx="23"
      cy="22"
      r="12"
      fill="#FDE68A"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />

    <circle
      cx="23"
      cy="22"
      r="5"
      fill="#22D3EE"
      stroke="var(--svg-primary)"
      strokeWidth="3"
    />
  </svg>
);

export const ChartLineSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <line
      x1="3"
      y1="20"
      x2="21"
      y2="20"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <polyline
      points="3 16 9 10 14 15 21 6"
      stroke="#FF6B6B"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="21"
      cy="6"
      r="2"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
    />
  </svg>
);

export const LayerGroupSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <polygon
      points="12 2 2 7 12 12 22 7 12 2"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <polyline
      points="2 12 12 17 22 12"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="2 17 12 22 22 17"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CalendarSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="3"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <line
      x1="3"
      y1="9"
      x2="21"
      y2="9"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <line
      x1="8"
      y1="2"
      x2="8"
      y2="5"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="2"
      x2="16"
      y2="5"
      stroke="#FF6B6B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Trash2Svg: React.FC<SvgProps> = ({
  size = 18,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <polyline
      points="3 6 5 6 21 6"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      fill="#FFF0F0"
      stroke="#FF6B6B"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <line
      x1="10"
      y1="11"
      x2="10"
      y2="17"
      stroke="#FF6B6B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="11"
      x2="14"
      y2="17"
      stroke="#FF6B6B"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// --- COMPATIBILITY EXPORTS (Drop-in replacements for FontAwesomeIcons) ---
export const ChevronLeft = ChevronLeftSvg;
export const ChevronRight = ChevronRightSvg;
export const ChevronDown = ChevronDownSvg;
export const ChevronUp = ChevronUpSvg;
export const ArrowLeft = ArrowLeftSvg;
export const ArrowRight = ArrowRightSvg;
export const Check = CheckSvg;
export const X = XSvg;
export const CopySvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect
      x="9"
      y="9"
      width="13"
      height="13"
      rx="2"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
    />
    <path
      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

export const Copy = CopySvg;
export const Play = PlaySvg;
export const PlayCircle = PlaySvg;
export const Pause = PauseSvg;
export const Volume2 = Volume2Svg;
export const VolumeX = VolumeXSvg;
export const Info = InfoSvg;
export const Lock = LockSvg;
export const Star = StarSvg;
export const Trophy = TrophySvg;
export const Heart = HeartSvg;
export const Coins = CoinSvg;
export const Crown = CrownSvg;
export const Gift = GiftSvg;
export const Sparkles = SparklesSvg;
export const RefreshCw = RefreshCwSvg;
export const RotateCcwSvg = RefreshCwSvg;
export const Share2 = Share2Svg;
export const Loader2 = Loader2Svg;
export const Sun = SunSvg;
export const Moon = MoonSvg;
export const List = ListSvg;
export const TrendingUp = TrendingUpSvg;
export const Shield = ShieldSvg;
export const LogOut = LogOutSvg;
export const Trash = TrashSvg;
export const Trash2 = Trash2Svg;
export const Key = KeyRoundSvg;
export const ClipboardList = ClipboardListSvg;
export const GraduationCap = GraduationCapSvg;
export const Cards = CardsSvg;
export const BookOpen = BookOpenSvg;
export const Gamepad = GamepadSvg;
export const Glasses = GlassesSvg;
export const Shirt = ShirtSvg;
export const Store = StoreSvg;
export const User = ProfileSvg;
export const Users = UsersSvg;
export const Search = SearchSvg;
export const Calendar = CalendarSvg;
export const Pencil = PencilSvg;
export const Mosque = MosqueSvg;
export const Settings = SettingsSvg;
export const ChartLine = ChartLineSvg;
export const LayerGroup = LayerGroupSvg;
export const LayoutGrid = LayoutGridSvg;
export const Timer = TimerSvg;
export const ScrollText = ScrollTextSvg;
export const Plus = PlusSvg;
export const Minus = MinusSvg;
export const Eye = EyeSvg;
export const SproutSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M7 20h10"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M10 20c0-7 3-10 8-11"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M10 9a6 6 0 0 1 8-2 6 6 0 0 1-8 2z"
      fill="#4ADE80"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <path
      d="M6 14a5 5 0 0 1 5-4 5 5 0 0 0-5 4z"
      fill="#86EFAC"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
  </svg>
);

export const Sprout = SproutSvg;
export const SeedlingSvg = SproutSvg;
export const Seedling = SproutSvg;
export const Snowflake = SnowflakeSvg;
export const Compass = CompassSvg;
export const Fire = FireSvg;
export const Quran = QuranSvg;
export const EyeOff = EyeSlashSvg;
export const EyeSlash = EyeSlashSvg;
export const MoreVertical = MoreVerticalSvg;

export const PaletteSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2C6.49 2 2 6.49 2 12C2 14.54 2.95 16.85 4.5 18.6C4.8 18.94 5.25 19.14 5.7 19.14H7.5C8.6 19.14 9.5 20.04 9.5 21.14C9.5 21.61 9.89 22 10.36 22H12C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="7.5"
      cy="8.5"
      r="1.5"
      fill="#FF6B6B"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
    />
    <circle
      cx="12"
      cy="6.5"
      r="1.5"
      fill="var(--svg-secondary)"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
    />
    <circle
      cx="16.5"
      cy="8.5"
      r="1.5"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
    />
    <circle
      cx="17.5"
      cy="13.5"
      r="1.5"
      fill="#F59E0B"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
    />
  </svg>
);
export const Palette = PaletteSvg;

export const HelpCircleSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle
      cx="12"
      cy="12"
      r="9.5"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <path
      d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17" r="1.2" fill="var(--svg-primary)" />
  </svg>
);

export const LightbulbSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M9 18h6 M10 22h4 M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const HelpCircle = HelpCircleSvg;
export const Lightbulb = LightbulbSvg;
export const Home = HomeSvg;
export const HandsPraying = HandsPrayingSvg;

export const Maximize2Svg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
  strokeWidth = 2.5,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <polyline
      points="15 3 21 3 21 9"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="9 21 3 21 3 15"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="21"
      y1="3"
      x2="14"
      y2="10"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="3"
      y1="21"
      x2="10"
      y2="14"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SlidersSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  style,
  strokeWidth = 2.5,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <line
      x1="4"
      y1="21"
      x2="4"
      y2="14"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <line
      x1="4"
      y1="10"
      x2="4"
      y2="3"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="21"
      x2="12"
      y2="12"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="3"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <line
      x1="20"
      y1="21"
      x2="20"
      y2="16"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <line
      x1="20"
      y1="12"
      x2="20"
      y2="3"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <line
      x1="1"
      y1="14"
      x2="7"
      y2="14"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <line
      x1="9"
      y1="8"
      x2="15"
      y2="8"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <line
      x1="17"
      y1="16"
      x2="23"
      y2="16"
      stroke="var(--svg-primary)"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

export const Maximize2 = Maximize2Svg;
export const Sliders = SlidersSvg;
export const Zap = ZapSvg;

export const MusicSvg: React.FC<SvgProps> = ({
  size = 20,
  className = "",
  stroke,
  style,
}) => {
  const strokeColor = stroke || "var(--svg-primary)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Batang & Garis Penghubung Nada */}
      <path
        d="M9 17V6L20 4V15"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Kepala Nada Kiri */}
      <ellipse
        cx="6"
        cy="17"
        rx="3"
        ry="2.5"
        transform="rotate(-15 6 17)"
        fill="#A855F7"
        stroke={strokeColor}
        strokeWidth="2.5"
      />
      {/* Kepala Nada Kanan */}
      <ellipse
        cx="17"
        cy="15"
        rx="3"
        ry="2.5"
        transform="rotate(-15 17 15)"
        fill="#A855F7"
        stroke={strokeColor}
        strokeWidth="2.5"
      />
    </svg>
  );
};

export const Music = MusicSvg;

// ── Aksesoris Maskot Baru (Warung Santri) ──
export const TurbanSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 4C7 4 4 7 4 11C4 14 6 17 8 18H16C18 17 20 14 20 11C20 7 17 4 12 4Z"
      fill="var(--svg-accent)"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M6 13C8 15 16 15 18 13"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M4 11C6 9 18 9 20 11"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const WizardHatSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 2L4 19H20L12 2Z"
      fill="#A855F7"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M2 19H22"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <polygon
      points="12,7 13,10 16,10 14,12 15,15 12,13 9,15 10,12 8,10 11,10"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeadphoneSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M4 14V11C4 6.5 7.5 3 12 3C16.5 3 20 6.5 20 11V14"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <rect
      x="2"
      y="12"
      width="5"
      height="8"
      rx="2"
      fill="#FF6B6B"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <rect
      x="17"
      y="12"
      width="5"
      height="8"
      rx="2"
      fill="#FF6B6B"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
  </svg>
);

export const SleepMaskSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M3 10C3 10 5 14 12 14C19 14 21 10 21 10V15C21 17 19 18 12 18C5 18 3 17 3 15V10Z"
      fill="#60A5FA"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M2 10H4M20 10H22"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M8 12H10M14 12H16"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const AlertCircleSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Alias
export const Turban = TurbanSvg;
export const WizardHat = WizardHatSvg;
export const Headphone = HeadphoneSvg;
export const SleepMask = SleepMaskSvg;
export const AlertCircle = AlertCircleSvg;

// ── Tambahkan di bagian paling bawah CustomIcons.tsx ──

export const RocketSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M7 14L4 17L5 20L8.5 18.5M17 14L20 17L19 20L15.5 18.5"
      fill="#FF6B6B"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 18.5L12 22.5L14 18.5"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M12 2.5C12 2.5 7.5 6.5 7.5 13.5C7.5 16.5 9 18.5 12 18.5C15 18.5 16.5 16.5 16.5 13.5C16.5 6.5 12 2.5 12 2.5Z"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="10.5"
      r="2.5"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
    />
  </svg>
);

export const DetectiveSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M5 10L7 4.5C7.4 3.5 8.5 3 9.5 3.3L12 4L14.5 3.3C15.5 3 16.6 3.5 17 4.5L19 10H5Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 10H21.5"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle
      cx="8"
      cy="16.5"
      r="3.5"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <circle
      cx="16"
      cy="16.5"
      r="3.5"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <path
      d="M11.5 16.5H12.5"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="7" cy="15.5" r="1" fill="#FFFFFF" />
    <circle cx="15" cy="15.5" r="1" fill="#FFFFFF" />
  </svg>
);

export const Rocket = RocketSvg;
export const Detective = DetectiveSvg;

// ── AKSESORIS PITA & IKON NEO-BRUTALISM BARU ──

export const HairbowSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  x,
  y,
}) => (
  <svg
    x={x}
    y={y}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    {/* Ekor Pita Kiri */}
    <path
      d="M9.5 13L5.5 20.5L9 18.5L11 20.5L11.5 13.5Z"
      fill="#FB7185"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Ekor Pita Kanan */}
    <path
      d="M14.5 13L18.5 20.5L15 18.5L13 20.5L12.5 13.5Z"
      fill="#FB7185"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Simpul Kiri */}
    <path
      d="M11 11.5C7.5 7 3 8 2.5 11.5C2 15 6.5 16 11 13Z"
      fill="#F472B6"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Highlight Simpul Kiri */}
    <path
      d="M5 10C6 9 7.5 9 9 10"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Simpul Kanan */}
    <path
      d="M13 11.5C16.5 7 21 8 21.5 11.5C22 15 17.5 16 13 13Z"
      fill="#F472B6"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Highlight Simpul Kanan */}
    <path
      d="M19 10C18 9 16.5 9 15 10"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Ikatan Tengah (Knot) */}
    <ellipse
      cx="12"
      cy="12"
      rx="2.6"
      ry="3.2"
      fill="#FF6B6B"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <circle cx="11.2" cy="11" r="0.8" fill="#FFFFFF" />
  </svg>
);

export const ScissorsSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <circle
      cx="6"
      cy="6"
      r="3"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <circle
      cx="6"
      cy="18"
      r="3"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <line
      x1="20"
      y1="4"
      x2="8.12"
      y2="15.88"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="14.47"
      y1="14.48"
      x2="20"
      y2="20"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8.12"
      y1="8.12"
      x2="12"
      y2="12"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const AlertTriangleSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M10.29 3.86L1.82 18C1.65 18.3 1.56 18.64 1.56 19C1.56 20.1 2.45 21 3.56 21H20.44C21.55 21 22.44 20.1 22.44 19C22.44 18.64 22.35 18.3 22.18 18L13.71 3.86C13.2 2.97 12.03 2.68 11.14 3.19C10.79 3.39 10.5 3.68 10.29 3.86Z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="9"
      x2="12"
      y2="13"
      stroke="var(--svg-primary)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17" r="1.2" fill="var(--svg-primary)" />
  </svg>
);

export const ChartBarSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <rect
      x="3"
      y="12"
      width="4"
      height="9"
      rx="1"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <rect
      x="10"
      y="7"
      width="4"
      height="14"
      rx="1"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <rect
      x="17"
      y="3"
      width="4"
      height="18"
      rx="1"
      fill="#34D399"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
  </svg>
);

export const FileTextSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <polyline
      points="14 2 14 8 20 8"
      fill="#E2E8F0"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <line
      x1="16"
      y1="13"
      x2="8"
      y2="13"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="17"
      x2="8"
      y2="17"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="10"
      y1="9"
      x2="8"
      y2="9"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const PrinterSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <polyline
      points="6 9 6 2 18 2 18 9"
      fill="#E2E8F0"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M6 18H4C2.9 18 2 17.1 2 16V11C2 9.9 2.9 9 4 9H20C21.1 9 22 9.9 22 11V16C22 17.1 21.1 18 20 18H18"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <rect
      x="6"
      y="14"
      width="12"
      height="8"
      rx="1"
      fill="#FFFFFF"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <circle cx="18" cy="12" r="1" fill="var(--svg-primary)" />
  </svg>
);

export const WrenchSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const BackpackSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M4 10C4 6.7 6.7 4 10 4H14C17.3 4 20 6.7 20 10V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V10Z"
      fill="#34D399"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M8 4V2C8 1.4 8.4 1 9 1H15C15.6 1 16 1.4 16 2V4"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <rect
      x="7"
      y="13"
      width="10"
      height="6"
      rx="1"
      fill="#FBBF24"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <path
      d="M8 8H16"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const SwordsSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <polyline
      points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <line
      x1="13"
      y1="19"
      x2="19"
      y2="13"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="16"
      x2="20"
      y2="20"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="19"
      y1="21"
      x2="21"
      y2="19"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const UfoSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <ellipse
      cx="12"
      cy="14"
      rx="10"
      ry="4"
      fill="#38BDF8"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <path
      d="M6 13C6 9 8.7 6 12 6C15.3 6 18 9 18 13"
      fill="#A7F3D0"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <circle cx="8" cy="14" r="1" fill="var(--svg-accent)" />
    <circle cx="12" cy="14" r="1" fill="var(--svg-accent)" />
    <circle cx="16" cy="14" r="1" fill="var(--svg-accent)" />
  </svg>
);

// Alias exports
export const BowSvg = HairbowSvg;
export const Hairbow = HairbowSvg;
export const Bow = HairbowSvg;
export const Scissors = ScissorsSvg;
export const AlertTriangle = AlertTriangleSvg;
export const ChartBar = ChartBarSvg;
export const BarChart = ChartBarSvg;
export const FileText = FileTextSvg;
export const Printer = PrinterSvg;
export const Wrench = WrenchSvg;
export const Backpack = BackpackSvg;
export const Swords = SwordsSvg;
export const Ufo = UfoSvg;

// Harakat Slasher Neo-Brutalism Katana Icon
export const HarakatSlasherSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Slash Trail */}
    <path
      d="M3 21 C 9 15, 15 9, 21 3"
      stroke="#EF4444"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M4 20 C 10 14, 16 8, 20 4"
      stroke="#FDE047"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Katana Blade */}
    <path
      d="M4 20 L 19 5 C 20 4, 21 4, 22 5 C 22 6, 22 7, 21 8 L 6 22 Z"
      fill="#F1F5F9"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Tsuba */}
    <ellipse
      cx="6"
      cy="18"
      rx="2"
      ry="3.5"
      transform="rotate(-45 6 18)"
      fill="#F59E0B"
      stroke="var(--svg-primary)"
      strokeWidth="1"
    />
    {/* Tsuka */}
    <path
      d="M5 19 L 2 22"
      stroke="#1E293B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
export const HarakatSlasher = HarakatSlasherSvg;

// WhatsApp Neo-Brutalism Icon
export const WhatsAppSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    {...props}
  >
    {/* WhatsApp Bubble Base */}
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.58 3.38 17.07L2.1 21.9L7.05 20.64C8.5 21.5 10.19 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
      fill="#25D366"
      stroke="var(--svg-primary, #0F172A)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Phone Handset */}
    <path
      d="M8.5 7.5C8.2 6.8 7.8 6.8 7.4 6.8C7.1 6.8 6.7 6.8 6.4 7.1C6 7.5 5 8.4 5 10.3C5 12.2 6.4 14 6.6 14.3C6.8 14.5 9.3 18.5 13.3 20C16.6 21.2 17.3 20.7 17.9 20.6C18.7 20.4 19.8 19.8 20.1 19C20.4 18.2 20.4 17.5 20.3 17.3C20.2 17.1 19.9 17 19.5 16.8C19.1 16.6 17 15.6 16.6 15.4C16.2 15.2 15.9 15.1 15.6 15.6C15.3 16.1 14.5 17 14.2 17.3C13.9 17.6 13.7 17.6 13.3 17.4C12.9 17.2 11.6 16.8 10 15.4C8.8 14.3 8 13 7.8 12.6C7.6 12.2 7.8 12 8 11.8C8.2 11.6 8.5 11.3 8.7 11C8.9 10.7 9 10.5 9.1 10.2C9.2 9.9 9.1 9.7 9 9.5C8.9 9.3 8.2 7.7 8.5 7.5Z"
      fill="#FFFFFF"
      stroke="var(--svg-primary, #0F172A)"
      strokeWidth="0.75"
      strokeLinejoin="round"
    />
  </svg>
);
export const WhatsApp = WhatsAppSvg;

// ============================================================================
// MISSING ICONS (migrated from legacy assets / new requirements)
// ============================================================================

export const EarSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <path
      d="M6 8a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0z"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <path
      d="M14 12a2 2 0 0 1 2-2h4"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
  </svg>
);

export const ArrowUpRightSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <line
      x1="7"
      y1="17"
      x2="17"
      y2="7"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <polyline
      points="7 7 17 7 17 17"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
  </svg>
);

export const ArrowDownRightSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <line
      x1="7"
      y1="7"
      x2="17"
      y2="17"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
    <polyline
      points="17 7 17 17 7 17"
      stroke="var(--svg-primary)"
      strokeWidth="2.5"
    />
  </svg>
);

export const DrumSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <ellipse
      cx="12"
      cy="6"
      rx="8"
      ry="3"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <path d="M4 6v12" stroke="var(--svg-primary)" strokeWidth="2" />
    <path d="M20 6v12" stroke="var(--svg-primary)" strokeWidth="2" />
    <ellipse
      cx="12"
      cy="18"
      rx="8"
      ry="3"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <line
      x1="9"
      y1="6"
      x2="9.01"
      y2="18"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <line
      x1="15"
      y1="6"
      x2="15.01"
      y2="18"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
  </svg>
);

export const LeafSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <path
      d="M11 20A7 7 0 0 1 9.8 6.1C15.5 6.1 20 10.6 20 16.5"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <path
      d="M2.2 21.8l19.6-19.6"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const TargetSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="6" stroke="var(--svg-primary)" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill="var(--svg-primary)" />
  </svg>
);

export const ClockSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <polyline
      points="12 6 12 12 16 14"
      stroke="var(--svg-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const BrickSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="2"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <path d="M2 10h20M2 14h20" stroke="var(--svg-primary)" strokeWidth="1.5" />
    <path
      d="M8 2v4M16 2v4M8 20v-4M16 20v-4"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
    />
  </svg>
);

export const GameCardSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="3"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <path
      d="M6 8h12M6 12h12M6 16h8"
      stroke="var(--svg-primary)"
      strokeWidth="1.5"
    />
    <circle cx="18" cy="12" r="2" fill="var(--svg-primary)" />
  </svg>
);

export const MapPinSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke="var(--svg-primary)"
      strokeWidth="2"
    />
    <circle cx="12" cy="10" r="3" fill="var(--svg-primary)" />
  </svg>
);

export const TelescopeSvg: React.FC<SvgProps> = ({
  size = 24,
  className = "",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    {...props}
  >
    <path d="M10 2 3 10" stroke="var(--svg-primary)" strokeWidth="2" />
    <path d="m14 2 6 8" stroke="var(--svg-primary)" strokeWidth="2" />
    <path d="M17 14 10 7" stroke="var(--svg-primary)" strokeWidth="2" />
    <path d="M10 22 3 14" stroke="var(--svg-primary)" strokeWidth="2" />
    <circle cx="12" cy="12" r="3" stroke="var(--svg-primary)" strokeWidth="2" />
  </svg>
);

export const CameraSvg: React.FC<
  {
    size?: number;
    className?: string;
    stroke?: string;
  } & React.SVGProps<SVGSVGElement>
> = ({ size = 20, className = "", stroke = "#134E4A", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={className}
    {...props}
  >
    {/* Body Kamera */}
    <path
      d="M 4 8 C 2.895 8 2 8.895 2 10 V 18 C 2 19.105 2.895 20 4 20 H 20 C 21.105 20 22 19.105 22 18 V 10 C 22 8.895 21.105 8 20 8 H 17.5 L 15.8 5.4 C 15.4 4.8 14.8 4.5 14.1 4.5 H 9.9 C 9.2 4.5 8.6 4.8 8.2 5.4 L 6.5 8 H 4 Z"
      fill="#FFFFFF"
      stroke={stroke}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    {/* Lensa Kamera */}
    <circle
      cx="12"
      cy="14"
      r="3.5"
      fill="#0D9488"
      stroke={stroke}
      strokeWidth="2.2"
    />
    {/* Titik Flash */}
    <circle cx="18" cy="11" r="1" fill={stroke} />
  </svg>
);
